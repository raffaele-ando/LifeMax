/* LA SCHEDA DI UN'ATTIVITÀ — il pannello che si apre toccando una riga.

   È il più fitto dell'app, e ogni pezzo ha una ragione:

   · UNA sola azione piena in cima. La pastiglia «Oggi» non la ripete più.
   · «Mettila in un giorno», non «Rimanda a»: da quando si può scegliere anche
     un giorno passato, «rimandare» dice la cosa sbagliata per metà dei giorni
     che si possono toccare. Il giorno passato serve a registrare una cosa
     fatta e mai messa in agenda — se il calendario non la accogliesse dopo, il
     registro sarebbe solo delle cose che ti sei ricordato di annunciare prima.
   · «Non ci sono riuscito» sta SOPRA «elimina», e non è rosso. Sono due cose
     diverse e devono sembrarlo: eliminare fa sparire la riga dal registro di
     quello che è successo, l'altra la chiude dicendo com'è andata. Alla pari,
     chi vuole solo togliersela davanti sceglie la prima che vede — e per un
     po' la prima che vedeva era «elimina».  */
import { useRef, useState } from 'react';
import { Segno } from '../pezzi.jsx';
import { usaCambioNativo } from '../nativo.js';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

/* una riga per attributo, valore a destra: è la forma degli elenchi di iOS, e
   ha preso il posto di tre riquadri che contenevano altri riquadri */
function RigaSc({ eti, cls, attrib, children }) {
  return <div className={'lista-riga sc-riga' + (cls ? ' ' + cls : '')} {...(attrib || {})}>
    <span className="sc-eti">{eti}</span>{children}
  </div>;
}

function Passo({ b, st, onRidisegna }) {
  const a = A();
  const inAg = window.LM.snapshot().azioni.find(
    (x) => !x.done && x.passoDi && x.passoDi.b === b.id && x.passoDi.s === st.id);
  return (
    <div className={'lista-riga sc-passo' + (st.done ? ' fatta' : '')}>
      <button className="lista-azione spunta" data-steptoggle={st.id} aria-pressed={st.done ? 'true' : 'false'}
        aria-label={st.testo + (st.done ? ', fatto' : ', segna come fatto')}
        onClick={(ev) => {
          a.feedbackSpunta(ev, window.LM.togglePasso(b.id, st.id), 'Passo fatto.', 'check');
          onRidisegna();
        }}><Segno nome="check" dim={13} /></button>
      <span className="lista-corpo">
        <span className="lista-tit">{st.testo}</span>
        {inAg ? <span className="lista-sub">in agenda {a.etichettaGiorno(inAg.data).toLowerCase()}</span> : null}
      </span>
      {st.done ? null : (
        <button className="icona-btn" data-stepquando={st.id} title="Mettilo in un giorno"
          aria-label={'Metti «' + st.testo + '» in un giorno'}
          onClick={() => {
            const fresco = (window.LM.load().backlog.find((x) => x.id === b.id) || {}).steps || [];
            const q = fresco.find((x) => x.id === st.id);
            if (q) a.apriQuandoPasso(window.LM.load().backlog.find((x) => x.id === b.id), q);
          }}><Segno nome="calendar" /></button>
      )}
      <button className="icona-btn icona-pericolo" data-stepdel={st.id} title="Rimuovi"
        aria-label={'Rimuovi «' + st.testo + '»'}
        onClick={() => a.conAnnulla('Passo rimosso.', 'trash', () => { window.LM.rimuoviPasso(b.id, st.id); onRidisegna(); })}
      ><Segno nome="trash" /></button>
    </div>
  );
}

export default function Scheda({ id }) {
  const a = A();
  const [, bump] = useState(0);
  const nuovoPasso = useRef(null);

  const b = window.LM.load().backlog.find((x) => x.id === id);
  /* sparita mentre il pannello era aperto (cancellata, o arrivata la fusione
     da un altro dispositivo): si chiude, come faceva `collega` */
  if (!b) { a.chiudiSheet(); a.ridisegnaAtt(); return null; }

  const ridisegna = () => { bump((n) => n + 1); a.ridisegnaAtt(); };
  const isProg = !!(b.steps && b.steps.length);
  const oggi = window.LM.todayKey();
  const av = isProg ? window.LM.avanzamentoProgetto(b) : null;
  const aperti = (b.steps || []).filter((st) => !st.done).length;

  const pianifica = (k) => {
    if (!k) return;
    const fatto = isProg ? window.LM.prossimoPassoInOggi(b.id, k) : window.LM.backlogInOggi(b.id, k);
    if (!fatto) { a.toast('Nessun passo da pianificare: sono tutti in agenda o completati.', 0, 'check'); return; }
    a.toast(k === oggi ? 'Messa tra le cose di oggi.' : 'Pianificata per ' + a.etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
    a.chiudiSheet(); a.aggiornaNav(); a.ridisegnaAtt();
  };
  const gChip = (k, et) => <button className="q-chip" data-quando={k} onClick={() => pianifica(k)}>{et}</button>;

  const distribuisci = (n) => {
    const q = window.LM.distribuisciPassi(b.id, oggi, n);
    a.toast(q ? q + (q === 1 ? ' passo messo in agenda.' : ' passi messi in agenda, uno per volta.') : 'Nessun passo da distribuire.',
      0, q ? 'calendar' : 'check');
    a.chiudiSheet(); a.aggiornaNav(); a.ridisegnaAtt();
  };

  const aggiungiPasso = (e) => {
    e.preventDefault();
    const inp = nuovoPasso.current;
    const v = inp.value.trim();
    if (!v) return;
    window.LM.aggiungiPasso(b.id, v);
    inp.value = '';
    ridisegna();
    /* il fuoco resta nel campo: si aggiunge un passo dopo l'altro senza
       tornare a cercarlo col dito */
    requestAnimationFrame(() => {
      const n = document.querySelector('#sc-passo-add input');
      if (n) n.focus({ preventScroll: true });
    });
  };

  /* la riga della scadenza è il bersaglio: il campo VERO ci sta steso sopra,
     trasparente e grande quanto lei, così il tocco arriva al calendario del
     sistema senza passare da noi. Aprirlo a mano su un campo alto un pixel e
     senza eventi del puntatore non apriva niente. */
  const scad = useRef(null);
  usaCambioNativo(scad, (i) => { window.LM.impostaScadenzaBacklog(b.id, i.value || null); ridisegna(); }, [b.id, b.scadenza]);
  /* LA `key` NON È UN DETTAGLIO QUI.
     Il codice di prima rifà tutto `#sheet-corpo` a ogni ridisegno: il campo è
     un elemento NUOVO, e il suo valore riparte da quello che dicono i dati.
     React invece riusa il nodo che sta nella stessa posizione, e `defaultValue`
     vale solo al montaggio: togliendo la scadenza, il campo continuava a
     mostrare la data appena tolta. Cambiare la chiave lo fa rinascere, che è
     esattamente quello che succedeva prima. `prove/campi.js` l'ha visto. */
  const campoScad = (
    <input key={b.scadenza || 'niente'} type="date" className="sc-nascosta" id="sc-scad" ref={scad}
      defaultValue={b.scadenza || undefined} aria-label="Scadenza" />
  );

  /* il <select> delle aree lo scrive ancora `selectAree` di app.js: è lo
     stesso di tutta l'app, e riscriverlo vorrebbe dire due sorgenti per la
     stessa forma. I suoi eventi però non sono di React, quindi si ascolta il
     `change` vero sul contenitore. */
  const areaBox = useRef(null);
  usaCambioNativo(areaBox, (i) => { window.LM.cambiaAreaBacklog(b.id, i.value); a.ridisegnaAtt(); }, [b.id]);

  return (
    <div className="sc">
      <button className="btn btn-primario btn-grande sc-primaria" id="sc-oggi" onClick={() => pianifica(oggi)}>
        <Segno nome="target" /> {isProg ? 'Prossimo passo in Oggi' : 'Portala in Oggi'}
      </button>

      <div className="lista-eti"><Segno nome="calendar" dim={11} />Mettila in un giorno</div>
      <div className="q-chips sc-quando">
        {gChip(window.LM.addDays(oggi, -1), 'Ieri')}
        {gChip(window.LM.addDays(oggi, 1), 'Domani')}
        {gChip(window.LM.addDays(oggi, 2), a.etichettaGiorno(window.LM.addDays(oggi, 2)).split(' ')[0])}
        {gChip(window.LM.addDays(oggi, 7), 'Tra una settimana')}
        <label className="q-chip q-chip-data">
          <Segno nome="calendar" dim={13} /> <span>Un altro giorno</span>
          <input type="date" id="sc-quando" aria-label="Un altro giorno"
            onChange={(e) => pianifica(e.target.value)} />
        </label>
      </div>

      <div className="lista-eti"><Segno nome="lista" dim={11} />Passi{isProg ? <> <span>{av.fatti + ' di ' + av.tot}</span></> : null}</div>
      <div className="lista">
        {(b.steps || []).map((st) => <Passo key={st.id} b={b} st={st} onRidisegna={ridisegna} />)}
        <form className="lista-riga sc-agg" id="sc-passo-add" onSubmit={aggiungiPasso}>
          <span className="lista-vuoto"><Segno nome="plus" /></span>
          <input type="text" ref={nuovoPasso} aria-label="Aggiungi un passo"
            placeholder={isProg ? 'Aggiungi un passo…' : 'Dividila in passi: scrivi il primo…'} />
          {/* il «più» sta già in testa alla riga, dove si allinea alle spunte
              dei passi sopra: qui la parola basta. Due segni «più» nella stessa
              riga per la stessa azione erano uno di troppo. */}
          <button className="btn btn-mini btn-tinta" type="submit">Aggiungi</button>
        </form>
        {isProg && aperti > 1 ? (
          <RigaSc eti="Spalma i passi aperti" cls="sc-riga-alta">
            <span className="sc-val q-chips">
              <button className="q-chip" data-distrib="1" onClick={() => distribuisci(1)}>ogni giorno</button>
              <button className="q-chip" data-distrib="2" onClick={() => distribuisci(2)}>ogni 2</button>
              <button className="q-chip" data-distrib="7" onClick={() => distribuisci(7)}>ogni settimana</button>
            </span>
          </RigaSc>
        ) : null}
      </div>

      <div className="lista-eti"><Segno nome="ingranaggio" dim={11} />Dettagli</div>
      <div className="lista">
        <RigaSc eti="Area">
          <span className="sc-val" ref={areaBox} {...html(a.selectAree('sc-area', b.areaId, 'Area', 'sc-inline'))} />
        </RigaSc>
        {/* senza scadenza la riga dice «nessuna» e il campo compare al tocco:
            un «mm/gg/aaaa» vuoto in una riga di valori è l'unica cosa che si
            legge, e non dice niente */}
        {b.scadenza ? (
          <RigaSc eti="Scadenza" cls="sc-tocca" attrib={{ 'data-apri-scad': '1' }}>
            <span className="sc-val">{window.LM.fmtShort(b.scadenza)} · {a.scadInfo(b.scadenza).testo}</span>
            <button className="icona-btn" id="sc-scad-x" title="Togli la scadenza" aria-label="Togli la scadenza"
              onClick={() => { window.LM.impostaScadenzaBacklog(b.id, null); ridisegna(); }}><Segno nome="x" dim={13} /></button>
            {campoScad}
          </RigaSc>
        ) : (
          <RigaSc eti="Scadenza" cls="sc-tocca" attrib={{ 'data-apri-scad': '1' }}>
            <span className="sc-val">nessuna</span>
            <span className="lista-chev"><Segno nome="chevronGiu" /></span>
            {campoScad}
          </RigaSc>
        )}
        <button className="lista-riga sc-riga sc-tocca" id="sc-pin"
          onClick={() => { window.LM.appuntaBacklog(b.id); ridisegna(); }}>
          <span className="sc-eti">Tieni in cima</span>
          <span className="sc-val">{b.pin ? <><Segno nome="pin" piu="sc-si" /> sì</> : 'no'}</span>
        </button>
      </div>
      <p className="lista-nota">Scegliere un giorno la sposta fra le cose di quel giorno, anche se è già passato: serve a registrare quello che hai fatto senza averlo scritto prima. La scadenza fa solo da conto alla rovescia e non la mette in agenda.</p>

      <div className="lista mt">
        <button className="lista-riga sc-riga sc-tocca" id="sc-abitudine"
          onClick={() => a.apriDaAbitudine(window.LM.load().backlog.find((x) => x.id === b.id))}>
          <span className="sc-eti"><Segno nome="refresh" /> Diventa un’abitudine</span>
          <span className="lista-chev"><Segno nome="chevronGiu" /></span>
        </button>
        {b.mancata ? (
          <button className="lista-riga sc-riga sc-tocca" id="sc-rimetti" onClick={() => {
            window.LM.togliMancata(b.id);
            a.toast('Rimessa fra le cose da fare.', 0, 'riprova');
            ridisegna();
          }}>
            <span className="sc-eti"><Segno nome="riprova" /> Rimettila fra le cose da fare</span>
            <span className="sc-val">{a.etichettaQuanto(b.mancata)}</span>
          </button>
        ) : (
          <button className="lista-riga sc-riga sc-tocca" id="sc-mancata"
            onClick={() => a.chiediMancata(b.id, (window.LM.load().backlog.find((x) => x.id === b.id) || {}).testo, a.ridisegnaAtt)}>
            <span className="sc-eti"><Segno nome="annulla" /> Non ci sono riuscito</span>
            <span className="lista-chev"><Segno nome="chevronGiu" /></span>
          </button>
        )}
        <button className="lista-riga sc-riga sc-tocca sc-pericolo" id="sc-del"
          onClick={() => a.conAnnulla('Attività eliminata.', 'trash', () => {
            window.LM.rimuoviBacklog(b.id); a.chiudiSheet(); a.ridisegnaAtt();
          })}>
          <span className="sc-eti"><Segno nome="trash" /> Elimina l’attività</span>
        </button>
      </div>
    </div>
  );
}
