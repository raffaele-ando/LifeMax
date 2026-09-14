/* CHI TOCCA ADESSO — la sola decisione che prende il server.
   Niente rete, niente KV, niente orologio di sistema: dentro e fuori solo
   dati. Così si può provare tutto senza far partire nulla (prova-piano.mjs).

   Il problema che risolve non è «che ora è». È questo: il piano lo manda
   l'app, e l'app la apri tu. Se stasera non la apro, domani alle 8:30 il
   server ha in mano il piano di ieri. Buttarlo via vuol dire non ricordarti
   niente proprio nei giorni in cui te ne saresti dimenticato — cioè quelli
   che contano. Tenerlo tutto vuol dire ricordarti alle 16:30 di domani una
   priorità che avevi scritto ieri, che è una bugia.
   Per questo ogni voce dice se `ripete`. I tre momenti e le abitudini sì: se
   l'app è rimasta chiusa, per definizione non li hai fatti. La priorità del
   giorno no. */

/* Più tardi di così non è un promemoria, è un rimprovero: se il telefono era
   spento alle 8:30 e si riaccende a mezzogiorno, «Cosa fai oggi» non serve
   più a niente. Un'ora e mezza è la finestra. */
export const RITARDO_MAX = 90;
/* Al massimo tre in un colpo. Se il telefono è stato spento mezza giornata,
   riaccendendosi non deve arrivare una raffica: quella si scarta tutta in
   blocco, comprese le voci buone. */
export const MAX_PER_VOLTA = 3;

/* L'ora locale di CHI riceve, non quella del server. Un Worker gira in un
   posto qualsiasi del mondo, e Intl è l'unico modo di sapere che ore sono a
   Milano senza tenersi una tabella dei fusi (che cambia due volte l'anno). */
export function oraLocale(adesso, fuso) {
  let parti;
  try {
    parti = new Intl.DateTimeFormat('en-CA', {
      timeZone: fuso || 'Europe/Rome', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', weekday: 'short'
    }).formatToParts(new Date(adesso));
  } catch (e) {
    /* fuso scritto male: meglio l'ora di Roma che nessun promemoria */
    return oraLocale(adesso, 'Europe/Rome');
  }
  const p = {};
  for (const x of parti) p[x.type] = x.value;
  /* `hour` con hour12:false può venire «24» a mezzanotte in alcune versioni */
  const h = Number(p.hour) % 24;
  const GIORNI = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    giorno: p.year + '-' + p.month + '-' + p.day,
    minuti: h * 60 + Number(p.minute),
    settimana: GIORNI[p.weekday]
  };
}

export function minutiDaOra(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/* La chiave di «questa l'ho già mandata»: giorno locale + voce. Il giorno
   dentro la chiave è quello che rende la cosa ripetibile domani senza
   azzerare niente a mezzanotte. */
export const segno = (giorno, id) => giorno + '|' + id;

/* LA FASCIA DI SILENZIO.
   Un promemoria alle due di notte non si legge, sveglia, e insegna a spegnere
   tutto. Va guardata sull'ora di ADESSO e non su quella scritta nella voce:
   una voce delle 21:30 può arrivare fino alle 23:00 per la regola del
   ritardo, e senza questo controllo entrerebbe in punta di piedi dentro la
   fascia. La fascia scavalca la mezzanotte quasi sempre (23:00→07:00), quindi
   i due casi sono diversi e vanno scritti entrambi. */
export function inSilenzio(silenzio, minuti) {
  if (!silenzio || !silenzio.on) return false;
  const da = minutiDaOra(silenzio.da), a = minutiDaOra(silenzio.a);
  if (da === null || a === null || da === a) return false;
  return da < a ? (minuti >= da && minuti < a) : (minuti >= da || minuti < a);
}

/* rec = { fuso, giorno, voci, inviate: [], silenzio } — quello che sta in KV.
   Restituisce { dovute, segni, giornoLocale }: le voci da mandare adesso e i
   segni da aggiungere a `inviate`. */
export function dovute(rec, adesso) {
  const l = oraLocale(adesso, rec && rec.fuso);
  const fuori = { dovute: [], segni: [], giornoLocale: l.giorno, locale: l };
  if (!rec || !Array.isArray(rec.voci)) return fuori;
  if (inSilenzio(rec.silenzio, l.minuti)) return fuori;

  const vecchio = rec.giorno !== l.giorno;      /* il piano è di un altro giorno */
  const fatte = new Set(rec.inviate || []);

  for (const v of rec.voci) {
    if (!v || !v.titolo) continue;
    if (vecchio && !v.ripete) continue;
    const giorni = Array.isArray(v.giorni) ? v.giorni : [];
    if (giorni.length && giorni.indexOf(l.settimana) < 0) continue;
    const q = minutiDaOra(v.ora);
    if (q === null) continue;
    const ritardo = l.minuti - q;
    if (ritardo < 0 || ritardo > RITARDO_MAX) continue;
    const s = segno(l.giorno, v.id);
    if (fatte.has(s)) continue;
    fuori.dovute.push(v);
    fuori.segni.push(s);
    if (fuori.dovute.length >= MAX_PER_VOLTA) break;
  }
  return fuori;
}

/* I segni di ieri non servono a nessuno e il record cresce per sempre: si
   tengono solo quelli del giorno locale corrente più i nuovi. */
export function potaSegni(inviate, giornoLocale, nuovi) {
  const t = new Set((inviate || []).filter((s) => String(s).slice(0, 10) === giornoLocale));
  for (const s of nuovi || []) t.add(s);
  return [...t];
}

/* Solo i servizi push veri. Senza questo controllo il Worker diventa un modo
   per far partire richieste verso un indirizzo qualsiasi scritto da chi
   passa: chiunque potrebbe usarlo per bussare a porte non sue. */
const SERVIZI = [
  'web.push.apple.com',
  'fcm.googleapis.com',
  'updates.push.services.mozilla.com',
  'notify.windows.com'
];
export function endpointValido(url) {
  let u;
  try { u = new URL(String(url)); } catch (e) { return false; }
  if (u.protocol !== 'https:') return false;
  return SERVIZI.some((d) => u.hostname === d || u.hostname.endsWith('.' + d));
}
