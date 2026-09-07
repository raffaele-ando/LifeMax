/* I PROMEMORIA, DAL LATO DELL'APP
   Tre lavori, e nient'altro:
     1. registrare il service worker (senza di lui non esistono notifiche);
     2. chiedere il permesso — quando lo chiedi tu, non all'apertura;
     3. mandare al server il PIANO di oggi: a che ora, che cosa, e se è già
        fatto. Tutta la logica di «cosa vale la pena ricordare» sta qui, dove
        stanno i dati e le prove; il server fa solo il postino a orario.

   Senza server configurato funziona metà: il permesso si concede e le
   notifiche locali (il timer che finisce) arrivano. Le altre no, perché sul
   web non esiste un modo di programmare una notifica per domani alle 9:
   l'API che lo permetteva non è mai stata rilasciata. Serve un push da fuori.

   Il pannello sta in Impostazioni → Promemoria.

   LA CHIAVE PRIVATA NON STA QUI, e non ci deve stare. `CONFIG.chiave` e
   `LM.promemoria().chiave` sono la chiave PUBBLICA VAPID: serve al browser
   per iscriversi, e sta in chiaro nei dati apposta. Quella privata vive
   soltanto come segreto del Worker — se un campo di qui te la chiede, e' il
   campo sbagliato.

   COME ARRIVA A CHI LO USA
   Nel sito di prima era `window.LM_PROMEMORIA`. Qui e' un modulo che parte
   all'import — `avvia()` in fondo, come stava in fondo allo `<script>` — e
   resta anche su `window` finche' il vecchio `app.js` gira accanto a
   questo. */
import type { Abitudine, Ora, GiornoSettimana, Promemoria as ConfigPromemoria } from '../tipi/stato';
import { LM } from '../dati/dati';

/* ------------------------------------------------------------------ i tipi
   UNA VOCE DEL PIANO: quello che il postino riceve e riscrive in notifiche.
   Era un oggetto costruito in cinque punti diversi di questo file, con
   `tipo` presente in uno solo — e chi lo leggeva dall'altra parte (il
   Worker) doveva indovinare. */
export interface VoceDelPiano {
  id: string;
  ora: Ora;
  ripete: boolean;
  giorni: GiornoSettimana[];
  titolo: string;
  corpo: string;
  vai: string;
  tipo?: 'stato';
}

/* LE CINQUE VOCI HANNO UN NOME, E SONO CINQUE. `ora('mattina')` e
   `acceso('abitudini')` prendevano una stringa qualunque: un nome scritto
   male tornava l'ora di ripiego — le nove del mattino — senza dire niente a
   nessuno, e il promemoria arrivava all'ora sbagliata. */
type VoceId = keyof ConfigPromemoria['voci'];

/* i tre momenti del giorno ancora aperti: la forma la vogliono in due, il
   piano e il conto, e per questo sta scritta una volta */
interface RitualeAperto { id: VoceId; ora: Ora; titolo: string; corpo: string; vai: string }

export interface Configurazione {
  server: string;
  chiave: string;
  voci: ConfigPromemoria['voci'] | null;
  silenzio: ConfigPromemoria['silenzio'] | null;
  fissa: boolean;
}

/* Dove sta il postino. Vuoto = niente push da fuori, e il pannello lo dice.
   Si riempie con l'indirizzo del Worker e la sua chiave pubblica VAPID. */
const CONFIG = {
  server: '',      /* es. 'https://lifemax-promemoria.xxx.workers.dev' */
  chiave: ''       /* la chiave PUBBLICA VAPID, base64url. Quella privata sta
                      solo nel Worker: vedi la testata di questo file. */
};

/* Dove sta scritto davvero: nelle impostazioni, dentro i tuoi dati
   (`LM.promemoria()`), così si cambia dall'app e si porta dietro sui tuoi
   dispositivi. I valori qui sopra sono solo il ripiego per quando lo stato
   non c'è ancora. Ordine: quello che hai scritto tu vince. */
function cfg(): Configurazione {
  const c = (window.LM && LM.promemoria) ? LM.promemoria() : null;
  if (!c) return { server: CONFIG.server, chiave: CONFIG.chiave, voci: null, silenzio: null, fissa: false };
  return {
    server: c.server || CONFIG.server,
    chiave: c.chiave || CONFIG.chiave,
    voci: c.voci, silenzio: c.silenzio, fissa: !!c.fissa
  };
}

/* CHI ARRIVA DA PRIMA.
   Le due chiavi stavano in localStorage (`lifemax.promemoria.cfg`) e la nota
   fissa in un'altra riga ancora. Ora stanno nelle impostazioni, coi tuoi
   dati. Chi aveva già configurato non deve rifarlo: si travasa una volta e
   si cancella la vecchia riga, così il travaso non si ripete ogni avvio. */
function travasaVecchio(): void {
  if (!window.LM || !LM.impostaPromemoria) return;
  try {
    const v = JSON.parse(localStorage.getItem('lifemax.promemoria.cfg') || 'null') as
      { server?: string; chiave?: string } | null;
    const gia = LM.promemoria();
    if (v && v.server && v.chiave && !(gia && gia.server)) {
      LM.impostaPromemoria({ server: v.server, chiave: v.chiave });
    }
    if (v) localStorage.removeItem('lifemax.promemoria.cfg');
    const f = localStorage.getItem('lifemax.promemoria.fissa');
    if (f !== null) {
      if (f === '1' && !(gia && gia.fissa)) LM.impostaPromemoria({ fissa: true });
      localStorage.removeItem('lifemax.promemoria.fissa');
    }
  } catch { /* ignora */ }
}

/* Con che chiave è fatta l'iscrizione che sta su QUESTO dispositivo. Sta nel
   dispositivo e non nei dati sincronizzati, perché l'iscrizione è di questo
   telefono: un altro telefono ha la sua. */
const CHIAVE_ISCRIZIONE = 'lifemax.promemoria.chiaveIscritta';
function chiaveIscritta(): string {
  try { return localStorage.getItem(CHIAVE_ISCRIZIONE) || ''; } catch { return ''; }
}
function ricordaChiave(k: string): void {
  try { localStorage.setItem(CHIAVE_ISCRIZIONE, k || ''); } catch { /* ignora */ }
}

const CHIAVE_ID = 'lifemax.promemoria.id';
const CHIAVE_ULTIMO = 'lifemax.promemoria.ultimo';
let reg: ServiceWorkerRegistration | null = null;

/* 'niente' quando il browser non sa fare notifiche del tutto: e' diverso da
   'denied', che vuol dire «sa farle e gli hai detto no» */
type StatoPermesso = 'niente' | NotificationPermission;
function stato(): StatoPermesso {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return 'niente';
  if (!('PushManager' in window)) return 'niente';
  return Notification.permission;   /* 'default' | 'granted' | 'denied' */
}

function installata(): boolean {
  /* `navigator.standalone` è di Safari e non sta in nessun tipo standard:
     è la sola via per sapere se l'app è stata messa nella schermata Home */
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true;
}
function iPhone(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
/* Su iOS il push arriva SOLO se l'app è nella schermata Home: da Safari come
   scheda normale il permesso non si può nemmeno chiedere. Dirlo prima è
   meglio che far premere un pulsante che non fa niente. */
function serveInstallare(): boolean { return iPhone() && !installata(); }

function idDispositivo(): string {
  let v: string | null = null;
  try { v = localStorage.getItem(CHIAVE_ID); } catch { /* ignora */ }
  if (!v) {
    v = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem(CHIAVE_ID, v); } catch { /* ignora */ }
  }
  return v;
}

function daBase64Url(s: string): Uint8Array {
  const p = (s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const b = atob(p), u = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return u;
}

/* ---------- il service worker ---------- */
function registra(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return Promise.resolve(null);
  return navigator.serviceWorker.register('sw.js').then(function (r) {
    reg = r;
    return r;
  }).catch(function () { return null; });
}

/* toccando una notifica il service worker dice all'app dove andare */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function (e) {
    const d = e.data as { lm?: string; vai?: string } | null;
    if (d && d.lm === 'vai' && d.vai) location.hash = d.vai;
  });
}

/* ---------- il piano di oggi ---------- */
/* Poche voci e ben scelte. Una notifica per ogni abitudine sarebbe rumore
   da ignorare entro tre giorni, e allora anche quelle che contano
   diventerebbero invisibili. Qui ci sono: i momenti del giorno che l'app
   già conosce, e un solo colpetto sulla priorità se nel pomeriggio è
   ancora intatta. */
/* I TRE MOMENTI ANCORA APERTI.
   Sta qui, da solo, per un motivo preciso: lo vogliono in due posti — il
   piano da mandare al server e il conto delle cose che ti restano — e
   quando il conto lo chiedeva al piano e il piano lo chiedeva al conto,
   l'app si fermava con lo stack pieno appena si accendeva la nota fissa.
   Un pezzo condiviso non ha versi. */
/* L'ora la scegli tu, in Impostazioni. Questi sono i valori di partenza, e
   stanno in `LM.PROMEMORIA_DEFAULT` — qui si leggono da lì per non averli
   scritti due volte in due file che poi si dimenticano l'uno dell'altro. */
function ora(id: VoceId): Ora {
  const c = cfg();
  const mia = c.voci ? c.voci[id] : undefined;
  if (mia && mia.ora) return mia.ora;
  const d = window.LM && LM.PROMEMORIA_DEFAULT;
  const suo = d ? d.voci[id] : undefined;
  return (suo && suo.ora) || ('09:00' as Ora);
}
function acceso(id: VoceId): boolean {
  const c = cfg();
  const mia = c.voci ? c.voci[id] : undefined;
  return !(mia && mia.on === false);
}

function ritualiAperti(): RitualeAperto[] {
  if (!LM) return [];
  const s = LM.load();
  const oggi = LM.todayKey();
  const out: RitualeAperto[] = [];
  if (!(s.pianoMattina || {})[oggi]) {
    out.push({ id: 'mattina', ora: ora('mattina'),
      titolo: 'Cosa fai oggi', corpo: 'Scegli le azioni di oggi, e la prima cosa.', vai: '#/rituali' });
  }
  if (!(s.checkins || []).some(function (c) { return c.data === oggi; })) {
    out.push({ id: 'checkin', ora: ora('checkin'),
      titolo: 'Check-in', corpo: 'Come stai adesso? Trenta secondi.', vai: '#/rituali' });
  }
  if (!(s.reviewSera || {})[oggi]) {
    out.push({ id: 'sera', ora: ora('sera'),
      titolo: 'Com’è andata oggi', corpo: 'Una vittoria e un ostacolo. Due righe.', vai: '#/rituali' });
  }
  return out;
}

/* LE ABITUDINI CON UN ORARIO, ancora aperte oggi. Quelle senza orario non
   entrano nel piano (una notifica per ognuna sarebbe rumore) ma entrano nel
   conto: restano comunque cose aperte. */
function abitudiniAperte(soloConOra: boolean): Abitudine[] {
  if (!LM) return [];
  const s = LM.load();
  const oggi = LM.todayKey();
  return (s.abitudini || []).filter(function (h) {
    if (soloConOra && !h.ora) return false;
    if (!LM.abitudinePrevista(h, oggi)) return false;
    return !(h.fatti && h.fatti[oggi]);
  });
}

function piano(): VoceDelPiano[] {
  if (!LM) return [];
  const s = LM.load();
  const oggi = LM.todayKey();
  const voci: VoceDelPiano[] = [];

  /* Gli orari dei tre momenti. L'app non li tiene come dato: `ritualeDellOra`
     li ricava dall'ora (mattina prima di mezzogiorno, sera dalle 19). Qui
     servono precisi, quindi stanno scritti una volta sola e dentro quei
     confini. Il giorno in cui diventeranno modificabili, si leggono da lì. */
  /* Il CONTO delle cose aperte non guarda gli interruttori: se spegni il
     promemoria della sera, la review resta comunque una cosa che ti manca.
     Il PIANO sì: quello è la lista di quando disturbarti. */
  ritualiAperti().filter(function (r) { return acceso(r.id); }).forEach(function (r) {
    voci.push({ id: r.id, ora: r.ora, ripete: true, giorni: [],
      titolo: r.titolo, corpo: r.corpo, vai: r.vai });
  });

  /* `ripete` distingue le voci che valgono anche domani da quelle che valgono
     solo oggi. Serve perché il piano lo manda l'app, e l'app la apri tu: se
     stasera non la apro, domani mattina il server ha in mano il piano di
     ieri. I tre momenti e le abitudini valgono comunque — se l'app è rimasta
     chiusa, per definizione non li hai fatti. La priorità del giorno no:
     quella era una cosa scritta ieri, e ricordarla domani sarebbe una bugia. */

  /* la priorità del giorno, se a metà pomeriggio è ancora lì */
  const mit = (s.azioni || []).filter(function (a) { return a.data === oggi && a.mit && !a.done; })[0];
  if (mit && acceso('mit')) {
    voci.push({ id: 'mit', ora: ora('mit'), ripete: false, giorni: [],
      titolo: 'La cosa più importante di oggi', corpo: mit.testo, vai: '#/oggi' });
  }

  /* le abitudini CON un orario: sono quelle che hai deciso di ancorare a un
     momento, quindi sono quelle che vuoi sentirti ricordare. Le altre no:
     una notifica per ognuna sarebbe rumore da ignorare entro tre giorni, e
     allora anche quelle che contano diventerebbero invisibili. */
  (acceso('abitudini') ? abitudiniAperte(true) : []).forEach(function (h) {
    /* `abitudiniAperte(true)` ha già scartato quelle senza orario: qui `ora`
       c'è per costruzione, e il ripiego non deve poter cambiare il piano */
    voci.push({ id: 'ab-' + h.id, ora: h.ora || ('09:00' as Ora), ripete: true, giorni: (h.giorni || []).slice(),
      titolo: h.testo, corpo: 'È l’ora.', vai: '#/rituali' });
  });

  /* La nota fissa, se accesa: una sola voce al giorno, di prima mattina.
     Dentro l'app si riscrive da sé a ogni cambiamento e non costa niente;
     questa serve per i giorni in cui l'app non la apri, che sono quelli in
     cui serve di più. */
  if (fissaAccesa()) {
    const t = testoFissa();
    voci.push({ id: 'stato', ora: '07:30' as Ora, ripete: true, giorni: [], tipo: 'stato',
      titolo: t.titolo, corpo: t.corpo, vai: '#/oggi' });
  }

  return voci.sort(function (a, b) { return a.ora < b.ora ? -1 : (a.ora > b.ora ? 1 : 0); });
}

/* ---------- quante cose restano oggi ----------
   Serve a due cose che sono la stessa cosa vista da due lati: il numero sul
   pallino dell'icona e la riga della nota fissa. Si conta quello che è
   ancora aperto oggi — non quello che hai fatto, perché un contatore che
   sale premia il tenere aperte le cose. */
function restano(): { n: number; righe: string[] } {
  if (!window.LM) return { n: 0, righe: [] };
  const s = LM.load();
  const oggi = LM.todayKey();
  const righe: string[] = [];

  const az = (s.azioni || []).filter(function (a) { return a.data === oggi && !a.done; });
  const mit = az.filter(function (a) { return a.mit; })[0];
  const prima = az[0];
  if (mit) righe.push(mit.testo);
  else if (prima) righe.push(prima.testo);

  const ab = abitudiniAperte(false);
  const rit = ritualiAperti();

  const n = az.length + ab.length + rit.length;
  if (az.length > 1) righe.push('e altre ' + (az.length - 1));
  if (ab.length) righe.push(ab.length === 1 ? '1 abitudine' : ab.length + ' abitudini');
  if (rit.length) righe.push(rit.length === 1 ? '1 rituale' : rit.length + ' rituali');
  return { n: n, righe: righe };
}

/* Il pallino col numero sull'icona: l'unica cosa che resta a vista senza
   essere una notifica. Non si scarta e non fa rumore. Zero si toglie del
   tutto — un'icona pulita vuol dire «per oggi ci sei». */
function segnaNumero(): number {
  const n = restano().n;
  /* il pallino sull'icona è recente e non c'è dappertutto: i due metodi si
     chiedono al navigatore invece di darli per scontati */
  const nav = navigator as Navigator & {
    clearAppBadge?: () => Promise<void>;
    setAppBadge?: (n: number) => Promise<void>;
  };
  try {
    if (!n && nav.clearAppBadge) void nav.clearAppBadge();
    else if (nav.setAppBadge) void nav.setAppBadge(n);
  } catch { /* ignora */ }
  return n;
}

/* ---------- la nota fissa ----------
   Una notifica sola, che si riscrive al posto di quella di prima e non fa
   rumore quando lo fa. Resta nell'elenco delle notifiche finché non la
   scarti tu. Si aggiorna da sola ogni volta che apri l'app o cambi
   qualcosa: quello non costa niente a nessuno, perché la pagina è aperta.
   Chi la vuole la accende: una notifica che resta lì è esattamente il tipo
   di cosa che non si mette senza chiedere. */
function fissaAccesa(): boolean { return cfg().fissa; }
function fissa(vero: boolean): void {
  if (window.LM && LM.impostaPromemoria) LM.impostaPromemoria({ fissa: !!vero });
  if (vero) scriviFissa();
  else togliFissa();
}
function testoFissa(): { titolo: string; corpo: string } {
  const r = restano();
  if (!r.n) return { titolo: 'Per oggi ci sei', corpo: 'Niente di aperto.' };
  return {
    titolo: r.righe[0] || (r.n + (r.n === 1 ? ' cosa aperta' : ' cose aperte')),
    corpo: r.righe.slice(1).join(' · ') || 'Tocca per aprire.'
  };
}
function scriviFissa(): boolean {
  if (!fissaAccesa() || stato() !== 'granted' || !reg || !reg.showNotification) return false;
  const t = testoFissa();
  /* `renotify` e `requireInteraction` non stanno nei tipi standard di
     `NotificationOptions` e sono proprio quello che tiene la nota lì senza
     far rumore: sono i due campi per cui questa notifica esiste. */
  void reg.showNotification(t.titolo, {
    body: t.corpo, icon: 'icone/icona-192.png', badge: 'icone/badge-96.png',
    lang: 'it', tag: 'lifemax-stato', renotify: false, silent: true, requireInteraction: true,
    data: { vai: '#/oggi', tipo: 'stato' }
  } as NotificationOptions & { renotify: boolean; requireInteraction: boolean });
  return true;
}
function togliFissa(): void {
  if (!reg || !reg.getNotifications) return;
  void reg.getNotifications({ tag: 'lifemax-stato' }).then(function (l) {
    l.forEach(function (n) { n.close(); });
  }).catch(function () { /* ignora */ });
}

/* ---------- iscrizione e invio del piano ---------- */
function iscrivi(): Promise<PushSubscription | null> {
  const c = cfg();
  if (!c.server || !c.chiave || !reg) return Promise.resolve(null);
  const sw = reg;
  return sw.pushManager.getSubscription().then(function (s): PushSubscription | null | Promise<PushSubscription | null> {
    /* UN'ISCRIZIONE VALE PER UNA CHIAVE SOLA.
       Se le chiavi vengono rigenerate — cosa che succede, perché è la prima
       cosa da fare quando qualcosa non torna — l'iscrizione di prima resta
       valida ma è legata alla vecchia. Il server firma con la nuova, il
       servizio push la rifiuta con un 403, e sul telefono non arriva niente
       senza che nessuno dica perché. Quindi: cambiata la chiave, via la
       vecchia iscrizione e se ne fa una nuova. */
    if (s && chiaveIscritta() && chiaveIscritta() !== c.chiave) {
      return s.unsubscribe().catch(function () {}).then(function () { return null; });
    }
    return s;
  }).then(function (s) {
    if (s) { ricordaChiave(c.chiave); return s; }
    let k: Uint8Array;
    /* la chiave si converte PRIMA di chiedere l'iscrizione: se non è
       base64url valido, `atob` lancia, e un'eccezione qui non dice niente a
       nessuno */
    try { k = daBase64Url(c.chiave); } catch { ultimoErrore = 'chiave'; return null; }
    return sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: k as BufferSource })
      .then(function (nuova) { ricordaChiave(c.chiave); return nuova; })
      .catch(function (e) {
        /* Il caso vero: una chiave della lunghezza giusta ma che non è un
           punto sulla curva. Il browser rifiuta l'iscrizione e senza questo
           `catch` l'errore finiva in console e l'app restava a dire
           «accesi» senza esserlo. */
        ultimoErrore = /applicationServerKey|InvalidAccess|InvalidCharacter/i.test('' + e) ? 'chiave' : 'iscrizione';
        return null;
      });
  }).catch(function () { ultimoErrore = 'iscrizione'; return null; });
}

/* perché l'ultimo tentativo non è andato: serve al pannello per dire quale
   dei due campi è sbagliato invece di «non funziona» */
let ultimoErrore = '';
let ultimoInvio = 0;
function mandaPiano(forza: boolean): Promise<boolean> {
  if (!cfg().server || stato() !== 'granted') return Promise.resolve(false);
  const p = piano();
  /* il giorno sta dentro l'impronta: un piano identico a quello di ieri
     (perché ieri non hai aperto l'app) va comunque rimandato, altrimenti il
     server continua a credere che sia ancora ieri */
  const impronta = LM.todayKey() + '|' + JSON.stringify(p);
  let vecchia: string | null = null;
  try { vecchia = localStorage.getItem(CHIAVE_ULTIMO); } catch { /* ignora */ }
  /* Non si scrive per ogni battito: il piano si manda solo se è cambiato, e
     non più di una volta al minuto. Lo spazio gratuito di Cloudflare ha un
     tetto di scritture al giorno, e un'app che salva a ogni tocco lo
     finirebbe in un pomeriggio. */
  if (!forza && impronta === vecchia && Date.now() - ultimoInvio < 3600000) return Promise.resolve(false);
  if (!forza && Date.now() - ultimoInvio < 60000) return Promise.resolve(false);
  return iscrivi().then(function (sub) {
    if (!sub) return false;
    ultimoInvio = Date.now();
    return fetch(cfg().server + '/piano', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: idDispositivo(),
        iscrizione: sub.toJSON ? sub.toJSON() : sub,
        fuso: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || 'Europe/Rome',
        giorno: LM.todayKey(),
        numero: restano().n,
        silenzio: cfg().silenzio,
        voci: p
      })
    }).then(function (r) {
      if (r.ok) { try { localStorage.setItem(CHIAVE_ULTIMO, impronta); } catch { /* ignora */ } }
      return r.ok;
    }).catch(function () { return false; });
  });
}

/* ---------- accendere e spegnere ---------- */
/* cosa e' andato: quattro esiti, e ognuno vuole una frase diversa nel
   pannello. «acceso» non e' fra questi per un motivo: vedi sotto. */
type Esito = 'negato' | 'chiave' | 'server' | 'accesi';
function accendi(): Promise<Esito> {
  ultimoErrore = '';
  return registra().then(function () {
    if (stato() === 'denied') return 'negato';
    return Notification.requestPermission().then(function (p) {
      if (p !== 'granted') return 'negato';
      return mandaPiano(true).then(function (ok) {
        /* «acceso» non vuol dire «funziona»: il permesso può esserci e
           l'iscrizione essere stata rifiutata perché la chiave è sbagliata.
           Dirlo qui è l'unico modo di farlo sapere a chi configura da solo. */
        if (ultimoErrore === 'chiave') return 'chiave';
        if (!ok && cfg().server) return 'server';
        return 'accesi';
      });
    });
  });
}

function spegni(): Promise<boolean> {
  /* spento vuol dire spento: via anche la nota fissa e il numero
     sull'icona, o resterebbe lì un pallino che nessuno aggiorna più */
  togliFissa();
  const nav = navigator as Navigator & { clearAppBadge?: () => Promise<void> };
  try { if (nav.clearAppBadge) void nav.clearAppBadge(); } catch { /* ignora */ }
  if (!reg) return Promise.resolve(true);
  return reg.pushManager.getSubscription().then(function (s) {
    const via: Promise<unknown> = s ? s.unsubscribe() : Promise.resolve();
    const avvisa: Promise<unknown> = (cfg().server && s)
      ? fetch(cfg().server + '/piano/' + idDispositivo(), { method: 'DELETE' }).catch(function () { /* ignora */ })
      : Promise.resolve();
    try { localStorage.removeItem(CHIAVE_ULTIMO); localStorage.removeItem(CHIAVE_ISCRIZIONE); } catch { /* ignora */ }
    return Promise.all([via, avvisa]).then(function () { return true; });
  });
}

/* ---------- una notifica adesso, senza server ---------- */
/* Il timer che finisce mentre guardi altrove: non serve nessun push, la
   pagina è ancora viva. È l'unica cosa che sul web si può fare da soli. */
function locale(titolo: string, corpo?: string, vai?: string): boolean {
  if (stato() !== 'granted') return false;
  if (reg && reg.showNotification) {
    void reg.showNotification(titolo, {
      body: corpo || '', icon: 'icone/icona-192.png', badge: 'icone/badge-96.png', lang: 'it',
      tag: 'lifemax-locale', data: { vai: vai || '#/oggi' }
    });
    return true;
  }
  try { new Notification(titolo, { body: corpo || '' }); return true; } catch { return false; }
}

export const LM_PROMEMORIA = {
  stato: stato, accendi: accendi, spegni: spegni, locale: locale,
  piano: piano, mandaPiano: mandaPiano, registra: registra,
  serveInstallare: serveInstallare, installata: installata,
  restano: restano, segnaNumero: segnaNumero,
  fissa: fissa, fissaAccesa: fissaAccesa, testoFissa: testoFissa,
  configurato: function () { const c = cfg(); return !!(c.server && c.chiave); },
  cfg: cfg, idDispositivo: idDispositivo, chiaveIscritta: chiaveIscritta,
  ultimoErrore: function () { return ultimoErrore; },
  CONFIG: CONFIG
};
export type Promemoria = typeof LM_PROMEMORIA;

/* Si registra da subito, e se i promemoria sono già accesi manda subito il
   piano: aprendo l'app di prima mattina il server ha ancora quello di ieri,
   e le cose che hai fatto stanotte non le sa nessuno.
   Il permesso, invece, NON si chiede qui. */
function avvia(): void {
  travasaVecchio();
  segnaNumero();
  void registra().then(function () { scriviFissa(); void mandaPiano(false); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
else avvia();
/* quando i dati cambiano, il piano di oggi può essere cambiato */
document.addEventListener('lm:change', function () {
  /* il numero e la nota fissa si aggiornano subito e senza server: la
     pagina è aperta, e l'unica cosa che costa è un giro di conto */
  segnaNumero();
  scriviFissa();
  void mandaPiano(false);
});
