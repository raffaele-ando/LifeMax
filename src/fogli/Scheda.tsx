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
     po' la prima che vedeva era «elimina». */
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Segno } from '../pezzi/pezzi';
import { usaCambioNativo } from '../pezzi/nativo';
import { LM } from '../dati/dati';
import { giorno as comeGiorno } from '../tipi/stato';
import type { Giorno, Attivita, Passo as UnPasso } from '../tipi/stato';
import {
  selectAree, scadInfo, etichettaGiorno, etichettaQuanto,
  apriQuandoPasso, apriDaAbitudine, chiediMancata, conAnnulla,
  chiudiSheet, aggiornaNav, toast, render
} from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

/* una riga per attributo, valore a destra: è la forma degli elenchi di iOS, e
   ha preso il posto di tre riquadri che contenevano altri riquadri */
function RigaSc({ eti, cls, attrib, children }: {
  eti: ReactNode; cls?: string; attrib?: Record<string, string>; children?: ReactNode;
}) {
  return <div className={'lista-riga sc-riga' + (cls ? ' ' + cls : '')} {...(attrib || {})}>
    <span className="sc-eti">{eti}</span>{children}
  </div>;
}

function Passo({ b, st, onRidisegna }: { b: Attivita; st: UnPasso; onRidisegna: () => void }) {
  const inAg = LM.snapshot().azioni.find(
    (x) => !x.done && x.passoDi && x.passoDi.b === b.id && x.passoDi.s === st.id);
  return (
    <div className={'lista-riga sc-passo' + (st.done ? ' fatta' : '')}>
      <button className="lista-azione spunta" data-steptoggle={st.id} aria-pressed={st.done ? 'true' : 'false'}
        aria-label={st.testo + (st.done ? ', fatto' : ', segna come fatto')}
        onClick={() => {
          /* niente punti: li dà l'azione che nasce dal passo, non il passo.
             Quello che serve qui è la conferma — prima non c'era, perché il
             risultato di `togglePasso` (che non tornava niente) finiva in
             `feedbackSpunta`, che con `undefined` sta zitta. */
          const spuntato = LM.togglePasso(b.id, st.id);
          if (spuntato) toast('Passo fatto.', 0, 'check');
          onRidisegna();
        }}><Segno nome="check" dim={13} /></button>
      <span className="lista-corpo">
        <span className="lista-tit">{st.testo}</span>
        {inAg ? <span className="lista-sub">in agenda {etichettaGiorno(inAg.data).toLowerCase()}</span> : null}
      </span>
      {st.done ? null : (
        <button className="icona-btn" data-stepquando={st.id} title="Mettilo in un giorno"
          aria-label={'Metti «' + st.testo + '» in un giorno'}
          onClick={() => {
            /* si ripescano dai dati e non dalla copia disegnata: fra il
               disegno e il tocco può essere arrivata la fusione da un altro
               dispositivo */
            const prog = LM.load().backlog.find((x) => x.id === b.id);
            if (!prog) return;
            const q = (prog.steps || []).find((x) => x.id === st.id);
            if (q) apriQuandoPasso(prog, q);
          }}><Segno nome="calendar" /></button>
      )}
      <button className="icona-btn icona-pericolo" data-stepdel={st.id} title="Rimuovi"
        aria-label={'Rimuovi «' + st.testo + '»'}
        onClick={() => conAnnulla('Passo rimosso.', 'trash', () => { LM.rimuoviPasso(b.id, st.id); onRidisegna(); })}
      ><Segno nome="trash" /></button>
    </div>
  );
}

export default function Scheda({ id }: { id: string }) {
  /* TUTTI I GANCI PRIMA DELL'USCITA ANTICIPATA. React li conta, e li conta
     nello stesso ordine a ogni disegno: uno che sta sotto a un `return` è un
     gancio che a volte c'è e a volte no. */
  const [, bump] = useState(0);
  const nuovoPasso = useRef<HTMLInputElement>(null);
  const scad = useRef<HTMLInputElement>(null);
  const areaBox = useRef<HTMLSpanElement>(null);

  const trovata = LM.load().backlog.find((x) => x.id === id);
  const ridisegna = () => { bump((n) => n + 1); render(); };

  /* la riga della scadenza è il bersaglio: il campo VERO ci sta steso sopra,
     trasparente e grande quanto lei, così il tocco arriva al calendario del
     sistema senza passare da noi. Aprirlo a mano su un campo alto un pixel e
     senza eventi del puntatore non apriva niente. */
  usaCambioNativo(scad, (i) => {
    const v = (i as HTMLInputElement).value;
    LM.impostaScadenzaBacklog(id, v ? comeGiorno(v) : null);
    ridisegna();
  }, [id, trovata ? trovata.scadenza : null]);

  /* il <select> delle aree lo scrive ancora `selectAree`: è lo stesso di tutta
     l'app, e riscriverlo vorrebbe dire due sorgenti per la stessa forma. I
     suoi eventi però non sono di React, quindi si ascolta il `change` vero
     sul contenitore. */
  usaCambioNativo(areaBox, (i) => { LM.cambiaAreaBacklog(id, (i as HTMLSelectElement).value); render(); }, [id]);

  /* sparita mentre il pannello era aperto (cancellata, o arrivata la fusione
     da un altro dispositivo): si chiude */
  if (!trovata) { chiudiSheet(); render(); return null; }
  const b = trovata;

  const isProg = !!(b.steps && b.steps.length);
  const oggi = LM.todayKey();
  const av = isProg ? LM.avanzamentoProgetto(b) : null;
  const aperti = (b.steps || []).filter((st) => !st.done).length;

  const pianifica = (k: Giorno | '') => {
    if (!k) return;
    const fatto = isProg ? LM.prossimoPassoInOggi(b.id, k) : LM.backlogInOggi(b.id, k);
    if (!fatto) { toast('Nessun passo da pianificare: sono tutti in agenda o completati.', 0, 'check'); return; }
    toast(k === oggi ? 'Messa tra le cose di oggi.' : 'Pianificata per ' + etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
    chiudiSheet(); aggiornaNav(); render();
  };
  const gChip = (k: Giorno, et: string) =>
    <button className="q-chip" data-quando={k} onClick={() => pianifica(k)}>{et}</button>;

  const distribuisci = (n: number) => {
    const q = LM.distribuisciPassi(b.id, oggi, n);
    toast(q ? q + (q === 1 ? ' passo messo in agenda.' : ' passi messi in agenda, uno per volta.') : 'Nessun passo da distribuire.',
      0, q ? 'calendar' : 'check');
    chiudiSheet(); aggiornaNav(); render();
  };

  const aggiungiPasso = (e: React.FormEvent) => {
    e.preventDefault();
    const inp = nuovoPasso.current;
    if (!inp) return;
    const v = inp.value.trim();
    if (!v) return;
    LM.aggiungiPasso(b.id, v);
    inp.value = '';
    ridisegna();
    /* il fuoco resta nel campo: si aggiunge un passo dopo l'altro senza
       tornare a cercarlo col dito */
    requestAnimationFrame(() => {
      const n = document.querySelector<HTMLElement>('#sc-passo-add input');
      if (n) n.focus({ preventScroll: true });
    });
  };

  /* LA `key` NON È UN DETTAGLIO QUI.
     Il codice di prima rifaceva tutto `#sheet-corpo` a ogni ridisegno: il
     campo era un elemento NUOVO, e il suo valore ripartiva da quello che
     dicono i dati. React invece riusa il nodo che sta nella stessa posizione,
     e `defaultValue` vale solo al montaggio: togliendo la scadenza, il campo
     continuava a mostrare la data appena tolta. Cambiare la chiave lo fa
     rinascere, che è esattamente quello che succedeva prima.
     `prove/campi.js` l'ha visto. */
  const campoScad = (
    <input key={b.scadenza || 'niente'} type="date" className="sc-nascosta" id="sc-scad" ref={scad}
      defaultValue={b.scadenza || undefined} aria-label="Scadenza" />
  );

  /* «dopodomani» col nome del giorno: `etichettaGiorno` dice «Mer 12» */
  const fraDue = LM.addDays(oggi, 2);
  const nomeFraDue = etichettaGiorno(fraDue).split(' ')[0] || 'Fra due giorni';

  return (
    <div className="sc">
      <button className="btn btn-primario btn-grande sc-primaria" id="sc-oggi" onClick={() => pianifica(oggi)}>
        <Segno nome="target" /> {isProg ? 'Prossimo passo in Oggi' : 'Portala in Oggi'}
      </button>

      <div className="lista-eti"><Segno nome="calendar" dim={11} />Mettila in un giorno</div>
      <div className="q-chips sc-quando">
        {gChip(LM.addDays(oggi, -1), 'Ieri')}
        {gChip(LM.addDays(oggi, 1), 'Domani')}
        {gChip(fraDue, nomeFraDue)}
        {gChip(LM.addDays(oggi, 7), 'Tra una settimana')}
        <label className="q-chip q-chip-data">
          <Segno nome="calendar" dim={13} /> <span>Un altro giorno</span>
          <input type="date" id="sc-quando" aria-label="Un altro giorno"
            onChange={(e) => pianifica(e.target.value ? comeGiorno(e.target.value) : '')} />
        </label>
      </div>

      <div className="lista-eti"><Segno nome="lista" dim={11} />Passi{av ? <> <span>{av.fatti + ' di ' + av.tot}</span></> : null}</div>
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
          <span className="sc-val" ref={areaBox} {...html(selectAree('sc-area', b.areaId, 'Area', 'sc-inline'))} />
        </RigaSc>
        {/* senza scadenza la riga dice «nessuna» e il campo compare al tocco:
            un «mm/gg/aaaa» vuoto in una riga di valori è l'unica cosa che si
            legge, e non dice niente */}
        {b.scadenza ? (
          <RigaSc eti="Scadenza" cls="sc-tocca" attrib={{ 'data-apri-scad': '1' }}>
            <span className="sc-val">{LM.fmtShort(b.scadenza)} · {scadInfo(b.scadenza).testo}</span>
            <button className="icona-btn" id="sc-scad-x" title="Togli la scadenza" aria-label="Togli la scadenza"
              onClick={() => { LM.impostaScadenzaBacklog(b.id, null); ridisegna(); }}><Segno nome="x" dim={13} /></button>
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
          onClick={() => { LM.appuntaBacklog(b.id); ridisegna(); }}>
          <span className="sc-eti">Tieni in cima</span>
          <span className="sc-val">{b.pin ? <><Segno nome="pin" piu="sc-si" /> sì</> : 'no'}</span>
        </button>
      </div>
      <p className="lista-nota">Scegliere un giorno la sposta fra le cose di quel giorno, anche se è già passato: serve a registrare quello che hai fatto senza averlo scritto prima. La scadenza fa solo da conto alla rovescia e non la mette in agenda.</p>

      <div className="lista mt">
        <button className="lista-riga sc-riga sc-tocca" id="sc-abitudine"
          onClick={() => {
            const fresca = LM.load().backlog.find((x) => x.id === b.id);
            if (fresca) apriDaAbitudine(fresca);
          }}>
          <span className="sc-eti"><Segno nome="refresh" /> Diventa un’abitudine</span>
          <span className="lista-chev"><Segno nome="chevronGiu" /></span>
        </button>
        {b.mancata ? (
          <button className="lista-riga sc-riga sc-tocca" id="sc-rimetti" onClick={() => {
            LM.togliMancata(b.id);
            toast('Rimessa fra le cose da fare.', 0, 'riprova');
            ridisegna();
          }}>
            <span className="sc-eti"><Segno nome="riprova" /> Rimettila fra le cose da fare</span>
            <span className="sc-val">{etichettaQuanto(b.mancata)}</span>
          </button>
        ) : (
          <button className="lista-riga sc-riga sc-tocca" id="sc-mancata"
            onClick={() => {
              const fresca = LM.load().backlog.find((x) => x.id === b.id);
              chiediMancata(b.id, fresca ? fresca.testo : b.testo, render);
            }}>
            <span className="sc-eti"><Segno nome="annulla" /> Non ci sono riuscito</span>
            <span className="lista-chev"><Segno nome="chevronGiu" /></span>
          </button>
        )}
        <button className="lista-riga sc-riga sc-tocca sc-pericolo" id="sc-del"
          onClick={() => conAnnulla('Attività eliminata.', 'trash', () => {
            LM.rimuoviBacklog(b.id); chiudiSheet(); render();
          })}>
          <span className="sc-eti"><Segno nome="trash" /> Elimina l’attività</span>
        </button>
      </div>
    </div>
  );
}
