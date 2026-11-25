/* DUE INDIRIZZI, UNA CASA SOLA: IL TRASLOCO DA GITHUB.IO.

   LifeMax si apre da due indirizzi: raffaele-ando.github.io/LifeMax (quello
   di prima, GitHub Pages) e lifemax.theproject.world (quello di adesso).
   Per il browser sono due siti diversi, ognuno coi SUOI dati: chi apre il
   vecchio segnalibro vede la sua copia vecchia, e chi usa l'app senza
   account ha i dati solo lì. La verifica del cloud l'ha visto: il primo
   accesso dall'altro indirizzo azzerava il profilo (corretto in dati.ts), e
   tenerne due vuol dire tenere due copie che si allontanano.

   Qui, sull'indirizzo VECCHIO, si dice che LifeMax ha cambiato casa e si
   accompagna di là — senza lasciare indietro niente:
     · con l'account: prima si manda nel cloud quello che manca, e SOLO se
       il cloud conferma si va; di là basta accedere con lo stesso Google;
     · senza account: i dati stanno solo in questo browser, quindi si
       portano con un tocco. Si apre il nuovo indirizzo in un'altra
       finestra, le due pagine si parlano (`postMessage`, solo fra questi due
       indirizzi) e i dati passano di là, uniti a quello che c'è. Se il
       browser non apre la finestra (una app sulla schermata Home, a
       volte), c'è il file: si scarica qui e si importa di là.
   Non si porta mai via niente in silenzio, e qui non si cancella niente. */

const NUOVO = 'https://lifemax.theproject.world';
const VECCHIO = 'https://raffaele-ando.github.io';

/* le prove (prove/nuvola-spazio.js) fanno finta che due indirizzi locali
   siano questi due: è l'unico modo di provarlo senza pubblicare */
interface Indirizzi { nuovo: string; vecchio: string }
function indirizzi(): Indirizzi {
  const prova = (window as unknown as { __LM_TRASLOCO?: Indirizzi }).__LM_TRASLOCO;
  return prova && prova.nuovo && prova.vecchio ? prova : { nuovo: NUOVO, vecchio: VECCHIO };
}
function sulVecchio(): boolean { return location.origin === indirizzi().vecchio; }
function sulNuovo(): boolean { return location.origin === indirizzi().nuovo; }

function el(tag: string, testo?: string, cls?: string): HTMLElement {
  const e = document.createElement(tag);
  if (testo) e.textContent = testo;
  if (cls) e.className = cls;
  return e;
}

function stile(): void {
  if (document.getElementById('lm-trasloco-stile')) return;
  const s = document.createElement('style');
  s.id = 'lm-trasloco-stile';
  s.textContent = '#lm-trasloco{position:fixed;left:16px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:9998;max-width:520px;margin:0 auto;' +
    'background:var(--superficie,#fff);color:var(--testo,#222);border:1px solid var(--bordo,#ddd);border-radius:16px;padding:16px;' +
    'box-shadow:0 8px 30px rgba(0,0,0,.18);font:15px/1.4 system-ui,sans-serif}' +
    '#lm-trasloco h2{font-size:17px;margin:0 0 6px}#lm-trasloco p{margin:0 0 10px}' +
    '#lm-trasloco .lm-tr-azioni{display:flex;flex-wrap:wrap;gap:8px}' +
    '#lm-trasloco button{font:inherit;font-weight:600;padding:10px 14px;border-radius:999px;border:1px solid var(--bordo,#ccc);background:transparent;color:inherit;cursor:pointer}' +
    '#lm-trasloco button.lm-tr-primo{background:var(--accento,#3b5bdb);border-color:transparent;color:#fff}' +
    '#lm-trasloco.lm-tr-piccolo{padding:10px 12px;font-size:14px}#lm-trasloco.lm-tr-piccolo h2{font-size:15px;margin:0 0 2px}' +
    '#lm-trasloco.lm-tr-piccolo p{margin:0 0 6px}#lm-trasloco.lm-tr-piccolo button{padding:6px 12px}';
  document.head.appendChild(s);
}

let scheda: HTMLElement | null = null;
function mostra(titolo: string, testo: string, tasti: { eti: string; primo?: boolean; fai: () => void }[]): void {
  stile();
  if (!scheda) {
    scheda = el('div');
    scheda.id = 'lm-trasloco';
    scheda.setAttribute('role', 'dialog');
    scheda.setAttribute('aria-labelledby', 'lm-tr-tit');
    document.body.appendChild(scheda);
  }
  scheda.innerHTML = '';
  const h = el('h2', titolo); h.id = 'lm-tr-tit';
  scheda.appendChild(h);
  scheda.appendChild(el('p', testo));
  const az = el('div', '', 'lm-tr-azioni');
  tasti.forEach(function (t) {
    const b = el('button', t.eti, t.primo ? 'lm-tr-primo' : '') as HTMLButtonElement;
    b.type = 'button';
    b.addEventListener('click', t.fai);
    az.appendChild(b);
  });
  scheda.appendChild(az);
}
function chiudi(): void {
  if (scheda) { scheda.remove(); scheda = null; }
  try { sessionStorage.setItem('lm-trasloco-dopo', '1'); } catch { /* niente */ }
}

function haDati(): boolean {
  try { const s = window.LM.load(); return window.LM.ricchezza(s) > 0 || s.abitudini.length > 0 || s.backlog.length > 0 || !!s.profilo.nome; } catch { return false; }
}

function scaricaFile(): void {
  try {
    const blob = new Blob([window.LM.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lifemax-dati-' + window.LM.todayKey() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    mostra('File scaricato', 'Adesso apri ' + indirizzi().nuovo.replace(/^https?:\/\//, '') + ', vai in Impostazioni → Importa dati e scegli questo file. I dati si aggiungono a quelli che ci sono, senza togliere niente.',
      [{ eti: 'Apri il nuovo indirizzo', primo: true, fai: function () { location.href = indirizzi().nuovo + '/'; } }, { eti: 'Chiudi', fai: chiudi }]);
  } catch {
    mostra('Il file non è partito', 'Prova da Impostazioni → Esporta dati.', [{ eti: 'Chiudi', fai: chiudi }]);
  }
}

/* il viaggio con un tocco: si apre il nuovo indirizzo e gli si passano i dati */
function portaDati(): void {
  const dove = indirizzi();
  const w = window.open(dove.nuovo + '/?trasloco=1', '_blank');
  if (!w) {
    mostra('Il browser non ha aperto la pagina', 'Nessun problema: porta i dati con un file.', [{ eti: 'Scarica il file', primo: true, fai: scaricaFile }, { eti: 'Più tardi', fai: chiudi }]);
    return;
  }
  mostra('Sto portando i tuoi dati…', 'Lascia aperte tutte e due le pagine per un momento.', []);
  let finito = false;
  const t = setTimeout(function () {
    if (finito) return;
    window.removeEventListener('message', ascolta);
    mostra('Non ha risposto in tempo', 'Puoi riprovare, oppure portare i dati con un file.', [{ eti: 'Riprova', primo: true, fai: portaDati }, { eti: 'Scarica il file', fai: scaricaFile }, { eti: 'Più tardi', fai: chiudi }]);
  }, 30000);
  function ascolta(e: MessageEvent): void {
    if (e.origin !== dove.nuovo || !e.data || typeof e.data !== 'object') return;
    if (e.data.tipo === 'lifemax-trasloco-pronto' && w) {
      w.postMessage({ tipo: 'lifemax-trasloco-dati', json: window.LM.exportJson() }, dove.nuovo);
    } else if (e.data.tipo === 'lifemax-trasloco-attendi') {
      /* di là c'è un account, e chiede a te: si aspetta senza fretta */
      clearTimeout(t);
      mostra('Conferma sull’altra pagina', 'Sul nuovo indirizzo è collegato un account: lì ti chiedo se aggiungere a quell’account i dati di questo browser.', []);
    } else if (e.data.tipo === 'lifemax-trasloco-rifiutato') {
      finito = true; clearTimeout(t);
      window.removeEventListener('message', ascolta);
      mostra('Dati non portati', 'Hai scelto di non aggiungerli a quell’account. Qui restano tutti; se ti servono altrove, scaricali in un file.', [{ eti: 'Scarica il file', primo: true, fai: scaricaFile }, { eti: 'Chiudi', fai: chiudi }]);
    } else if (e.data.tipo === 'lifemax-trasloco-ricevuti') {
      finito = true; clearTimeout(t);
      window.removeEventListener('message', ascolta);
      try { localStorage.setItem('lm-traslocato', String(Date.now())); } catch { /* niente */ }
      mostra('Fatto: i tuoi dati sono di là', 'Da adesso usa ' + dove.nuovo.replace(/^https?:\/\//, '') + ' (aggiungilo ai preferiti o alla schermata Home). Qui non ho cancellato niente.',
        [{ eti: 'Vai al nuovo indirizzo', primo: true, fai: function () { location.href = dove.nuovo + '/'; } }, { eti: 'Chiudi', fai: chiudi }]);
    } else if (e.data.tipo === 'lifemax-trasloco-errore') {
      finito = true; clearTimeout(t);
      window.removeEventListener('message', ascolta);
      mostra('Di là il file non è entrato', 'Porta i dati con un file: Impostazioni → Importa dati, sul nuovo indirizzo.', [{ eti: 'Scarica il file', primo: true, fai: scaricaFile }, { eti: 'Chiudi', fai: chiudi }]);
    }
  }
  window.addEventListener('message', ascolta);
}

/* con l'account: prima il cloud deve avere tutto, poi si va */
async function vaiConAccount(): Promise<void> {
  const c = window.LMCloud;
  mostra('Un momento…', 'Mi assicuro che il cloud abbia tutte le tue ultime modifiche.', []);
  const inSospeso = !!(c && c.inSospeso && c.inSospeso());
  /* senza rete non si aspetta niente: si dice subito */
  const ok = !inSospeso ? true : (!navigator.onLine || !c || !c.svuota) ? false : await c.svuota(10000);
  if (ok) { location.href = indirizzi().nuovo + '/'; return; }
  mostra('Alcune modifiche non sono ancora nel cloud', 'Manca la rete, o il cloud non risponde. Resta qui finché partono (lo vedi in alto: «Salvato nel cloud»), oppure portale con un file.',
    [{ eti: 'Riprova', primo: true, fai: function () { void vaiConAccount(); } }, { eti: 'Scarica il file', fai: scaricaFile }, { eti: 'Più tardi', fai: chiudi }]);
}

function proponi(): void {
  try { if (sessionStorage.getItem('lm-trasloco-dopo')) return; } catch { /* chiede */ }
  const nuovo = indirizzi().nuovo.replace(/^https?:\/\//, '');
  /* il trasloco è già fatto: un promemoria piccolo, non di nuovo la proposta
     intera a ogni visita (verifica 2, m12) */
  let traslocato = false;
  try { traslocato = !!localStorage.getItem('lm-traslocato'); } catch { traslocato = false; }
  if (traslocato) {
    mostra('LifeMax adesso sta su ' + nuovo, 'I tuoi dati sono già stati portati di là.',
      [{ eti: 'Vai', primo: true, fai: function () { location.href = indirizzi().nuovo + '/'; } }, { eti: 'Chiudi', fai: chiudi }]);
    if (scheda) scheda.classList.add('lm-tr-piccolo');
    return;
  }
  const a = window.LM_AUTH;
  if (a && a.user) {
    mostra('LifeMax ha cambiato indirizzo', 'Adesso sta su ' + nuovo + '. I tuoi dati sono nel tuo account: di là ti basta accedere con lo stesso account Google.',
      [{ eti: 'Vai al nuovo indirizzo', primo: true, fai: function () { void vaiConAccount(); } }, { eti: 'Resta qui per ora', fai: chiudi }]);
  } else if (haDati()) {
    mostra('LifeMax ha cambiato indirizzo', 'Adesso sta su ' + nuovo + '. I tuoi dati sono solo in questo browser, a questo indirizzo: portali con te, con un tocco. Qui non si cancella niente.',
      [{ eti: 'Porta i miei dati', primo: true, fai: portaDati }, { eti: 'Scarica un file', fai: scaricaFile }, { eti: 'Resta qui per ora', fai: chiudi }]);
  } else {
    mostra('LifeMax ha cambiato indirizzo', 'Adesso sta su ' + nuovo + '.',
      [{ eti: 'Vai al nuovo indirizzo', primo: true, fai: function () { location.href = indirizzi().nuovo + '/'; } }, { eti: 'Resta qui per ora', fai: chiudi }]);
  }
}

/* sul nuovo indirizzo: la pagina aperta dal vecchio riceve i dati */
function ricevi(): void {
  const dove = indirizzi();
  const genitore = window.opener as Window | null;
  if (!genitore) return;
  window.addEventListener('message', function (e: MessageEvent) {
    if (e.origin !== dove.vecchio || !e.data || e.data.tipo !== 'lifemax-trasloco-dati') return;
    const json = String(e.data.json || '');
    /* SE QUI C'È UN ACCOUNT, SI CHIEDE (verifica 2, m12). I dati di
       github.io sono di chi usava quel browser senza account: su un
       dispositivo condiviso possono essere di un'altra persona, e una volta
       nell'account vanno su tutti i suoi dispositivi. */
    let account = '';
    try { account = localStorage.getItem('lm-account-unito') || ''; } catch { account = ''; }
    const chi = window.LM_AUTH && window.LM_AUTH.user ? (window.LM_AUTH.user.email || '') : '';
    if (account || chi) {
      genitore.postMessage({ tipo: 'lifemax-trasloco-attendi' }, dove.vecchio);
      let quanti = 0;
      try {
        const d = JSON.parse(json); const st = (d && d.stato) || d || {};
        Object.keys(st).forEach(function (k) { if (Array.isArray(st[k]) && ['registro', 'log', 'cancellati', 'aree', 'areeAttive'].indexOf(k) < 0) quanti += st[k].length; });
      } catch { quanti = 0; }
      mostra('Aggiungo i dati del vecchio indirizzo al tuo account?',
        'Arrivano ' + quanti + (quanti === 1 ? ' elemento' : ' elementi') + ' da LifeMax su github.io, usato in quel browser senza account. Se li aggiungo, finiscono nell’account ' +
        (chi || 'collegato qui') + ' e su tutti i suoi dispositivi. Se non sono tuoi, non aggiungerli.',
        [{ eti: 'Aggiungi all’account', primo: true, fai: function () { importa(json); } },
          { eti: 'Non aggiungere', fai: function () { genitore.postMessage({ tipo: 'lifemax-trasloco-rifiutato' }, dove.vecchio); chiudi(); } }]);
      return;
    }
    importa(json);
  });
  function importa(json: string): void {
    if (!genitore) return;
    const r = window.LM.importJson(json);
    if (r && r.ok) {
      genitore.postMessage({ tipo: 'lifemax-trasloco-ricevuti', n: r.ricchezza || 0 }, dove.vecchio);
      mostra('I tuoi dati sono arrivati', 'Sono stati aggiunti a quelli che c’erano qui. Da adesso usa questo indirizzo.', [{ eti: 'Bene', primo: true, fai: function () { chiudi(); location.reload(); } }]);
    } else {
      genitore.postMessage({ tipo: 'lifemax-trasloco-errore' }, dove.vecchio);
    }
  }
  genitore.postMessage({ tipo: 'lifemax-trasloco-pronto' }, dove.vecchio);
  try { history.replaceState(null, '', location.pathname + location.hash); } catch { /* resta l'indirizzo lungo */ }
}

function avvia(): void {
  if (sulNuovo() && /[?&]trasloco=1/.test(location.search)) { ricevi(); return; }
  if (!sulVecchio()) return;
  /* si aspetta che la nuvola sappia se c'è un account */
  let fatto = false;
  const vai = function () { if (fatto) return; fatto = true; proponi(); };
  window.addEventListener('lm:auth', function () { if (window.LM_AUTH && !window.LM_AUTH.syncing) setTimeout(vai, 300); });
  setTimeout(vai, 4000);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
else avvia();
