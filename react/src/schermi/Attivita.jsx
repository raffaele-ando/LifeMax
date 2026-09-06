/* ATTIVITÀ, IN REACT — e deve venire IDENTICA a quella di prima.

   Non è l'occasione per ridisegnare niente: stesso markup, stesse classi,
   stesso testo, stessi `data-`. `prove/gemelle.js` disegna la schermata col
   codice di prima, si prende l'albero del DOM, la ridisegna con React e
   confronta elemento per elemento. Se una sola riga è diversa, non passa.

   Dove il markup lo produce ancora un aiutante di `app.js` — il selettore
   delle aree, l'etichetta di gruppo — si usa quello attraverso la cucitura
   invece di riscriverlo: riscriverlo vorrebbe dire avere due sorgenti per la
   stessa forma, che è esattamente il problema da cui veniamo. Diventeranno
   pezzi anche loro, e allora questa riga sparirà.  */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usaLM } from '../usaLM.js';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

/* ---------------------------------------------------------------- LE LINGUETTE
   La prima esiste solo finché c'è una coda da svuotare: una destinazione
   sempre a zero è una parola in più da scartare ogni volta. */
function Linguetta({ id, ico, eti, n, attiva, onScegli }) {
  return (
    <button data-att={id} className={attiva ? 'attivo' : ''} onClick={() => onScegli(id)}>
      <span className="seg-ico" {...html(A().ICO(ico, 15))} />
      <span className="seg-eti">{eti}</span>
      {n ? <span className="att-badge">{n}</span> : null}
    </button>
  );
}

/* ---------------------------------------------------------------- DA SISTEMARE
   Il lavoro è svuotare una coda: per ogni nota, una decisione fra tre. */
const MOSTRA = 4;
const PORTE = [
  { fai: 'azione', ico: 'target', che: 'Oggi', nota: 'la fai oggi', piu: ' sm-porta-si' },
  { fai: 'backlog', ico: 'lista', che: 'Da fare', nota: 'più avanti', piu: '' },
  { fai: 'scarta', ico: 'trash', che: 'Scarta', nota: 'non serve', piu: ' sm-porta-no' }
];

function Smista({ st }) {
  const coda = st.inbox.slice().sort((a, b) => (b.creata || 0) - (a.creata || 0));
  const nota = coda[0];
  const resto = coda.slice(1);
  const campo = useRef(null);
  const area = useRef(null);

  /* il campo cresce con quello che ci scrivi: la stessa `adatta()` di prima */
  const adatta = () => {
    const t = campo.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  };
  useEffect(adatta, [nota && nota.id]);

  if (!nota) return null;
  const quando = new Date(nota.creata).toLocaleString('it-IT',
    { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  /* il testo si salva uscendo dal campo: nessun tasto «salva» per una
     correzione di due lettere */
  const salva = () => {
    const t = campo.current;
    const v = t.value.replace(/\s+/g, ' ').trim();
    if (!v) { t.value = nota.testo; adatta(); return; }
    if (v !== nota.testo) window.LM.modificaInbox(nota.id, v);
  };

  const decidi = (esito) => {
    const t = campo.current;
    const v = t.value.replace(/\s+/g, ' ').trim();
    if (v && v !== nota.testo) window.LM.modificaInbox(nota.id, v);
    window.LM.triageInbox(nota.id, esito, area.current ? area.current.value : 'altro');
    A().aggiornaNav();
    if (!window.LM.load().inbox.length) {
      A().attTab = 'dafare';
      A().render();
      A().toast('Coda svuotata: non c’è più niente da sistemare.', 0, 'check');
    }
  };

  return (
    <div className="sm-uno">
      {/* `etichetta()` restituisce già il suo <div class="lista-eti">:
          avvolgerlo in un altro div aggiungeva un livello all'albero */}
      <div className="lista-eti" {...html(A().ICO('inbox', 11) + 'Da sistemare')} />
      <div className="sm-nota">
        <textarea className="sm-titolo" id="sm-testo" rows="1" aria-label="Testo della nota"
          ref={campo} defaultValue={nota.testo}
          onInput={adatta} onBlur={salva}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />
        <div className="sm-meta">
          <select id="sm-area" className="sm-area-sel" aria-label="Area"
            ref={area} defaultValue={nota.areaSug || 'altro'}>
            {A().areeAttive().map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          <span className="sm-quando">scritta {quando}</span>
        </div>
      </div>

      <div className="sm-scelte" role="group" aria-label="Che fine fa questa nota">
        {PORTE.map((p) => (
          <button key={p.fai} className={'sm-porta' + p.piu} data-fai={p.fai} onClick={() => decidi(p.fai)}>
            <span className="sm-porta-ico" {...html(A().ICO(p.ico, 18))} />
            <span className="sm-porta-che">{p.che}</span>
            <span className="sm-porta-nota">{p.nota}</span>
          </button>
        ))}
      </div>

      {resto.length ? <>
        <div className="lista-eti">Dopo questa <span>{resto.length}</span></div>
        <div className="sm-coda">
          {resto.slice(0, MOSTRA).map((x) => <p key={x.id}>{x.testo}</p>)}
          {resto.length > MOSTRA &&
            <p className="sm-coda-piu">e {resto.length - MOSTRA === 1 ? 'un’altra' : 'altre ' + (resto.length - MOSTRA)}</p>}
        </div>
      </> : <p className="lista-nota">Ultima della coda.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ LA SCHERMATA */
/* La fila delle linguette la crea `monta` come figlia diretta di #vista,
   perché `sottoNav` la sposta appena dopo. Qui si dice solo com'è fatta.
   Il numero di note in coda decide fra tre linguette e due, e quello si sa
   solo leggendo i dati: per questo è una funzione. */
Attivita.lingue = () => ({
  id: 'att-tabs',
  classi: 'segmenti sez-nav tabs-fisse' +
    (window.LM.load().inbox.length ? '' : ' tabs-due') + ' att-tabs'
});

export default function Attivita({ fila }) {
  const s = usaLM((LM) => LM.load());
  const nInbox = s.inbox.length;

  const ammessi = { dafare: 1, abitudini: 1 };
  if (nInbox) ammessi.sistemare = 1;
  const [tab, setTab] = useState(() => {
    const t = A().attTab;
    return (t && ammessi[t]) ? t : (nInbox ? 'sistemare' : 'dafare');
  });
  const quale = ammessi[tab] ? tab : (nInbox ? 'sistemare' : 'dafare');
  useEffect(() => { A().attTab = quale; }, [quale]);

  /* il corpo entra quando cambia linguetta, come faceva `ridisegna()` */
  const corpo = useRef(null);
  const vistaPrima = useRef(null);
  useEffect(() => {
    /* anche al primo disegno: nel codice di prima `attTabMostrata` parte
       indefinita, quindi `cambio` è vero e il corpo entra. Saltarlo qui
       voleva dire che la prima apertura non si muoveva e tutte le altre sì —
       una differenza che si vede. */
    if (corpo.current && vistaPrima.current !== quale) A().animaIngresso(corpo.current);
    vistaPrima.current = quale;
  }, [quale]);

  const nAb = window.LM.abitudiniDiOggi()
    .filter((h) => !h.fatti[window.LM.todayKey()]).length;

  return (
    <>
      {/* le linguette vivono nel loro contenitore, ovunque sottoNav lo porti */}
      {fila && createPortal(<>
        {nInbox ? <Linguetta id="sistemare" ico="inbox" eti="Da sistemare" n={nInbox}
          attiva={quale === 'sistemare'} onScegli={setTab} /> : null}
        <Linguetta id="dafare" ico="lista" eti="Da fare" n={s.backlog.length}
          attiva={quale === 'dafare'} onScegli={setTab} />
        <Linguetta id="abitudini" ico="refresh" eti="Abitudini" n={nAb}
          attiva={quale === 'abitudini'} onScegli={setTab} />
      </>, fila)}
      {/* `topbar` con questi argomenti restituisce un <h1> e basta: niente
          contenitore attorno, se no l'albero ha un livello in più */}
      <h1 className="solo-lettori">Attività</h1>
      <div id="att-corpo" ref={corpo}>
        {quale === 'sistemare' && nInbox ? <Smista st={s} /> : null}
      </div>
    </>
  );
}
