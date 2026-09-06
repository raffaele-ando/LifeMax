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
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

/* ---------------------------------------------------------------- LE LINGUETTE
   La prima esiste solo finché c'è una coda da svuotare: una destinazione
   sempre a zero è una parola in più da scartare ogni volta. */
function Linguetta({ id, ico, eti, n, attiva, onScegli }) {
  return (
    <button data-att={id} className={attiva ? 'attivo' : ''} onClick={() => onScegli(id)}>
      <span className="seg-ico"><Segno nome={ico} /></span>
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
            <span className="sm-porta-ico"><Segno nome={p.ico} dim={18} /></span>
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

/* L'ELENCO. Stessa logica di `renderLista` in app.js — le tre file per
   importanza, le non riuscite che escono dalle file, il gruppo «Inattive»
   che si apre — e le righe le fa `attRigaHtml`, la stessa di prima. */
function listaHtml(st, query) {
  const a = A();
  const q = (query || '').trim().toLowerCase();
  if (q) {
    const ris = st.backlog.filter((b) => b.testo.toLowerCase().indexOf(q) >= 0);
    return '<div class="lista-eti">' + ris.length + (ris.length === 1 ? ' risultato' : ' risultati') + '</div>' +
      (ris.length
        ? '<div class="lista">' + ris.map((b) => a.attRigaHtml(b, {})).join('') + '</div>'
        : '<p class="lista-nota">Nessuna corrispondenza per «' + a.esc(query.trim()) + '».</p>');
  }
  const g = window.LM.backlogPerImportanza({ areaId: a.areaFiltro() || 'tutte', tetto: 3 });
  const senzaEsito = (x) => a.passaFiltro(x.b) && !x.b.mancata;
  const ora = g.ora.filter(senzaEsito);
  const poi = g.poi.filter(senzaEsito);
  const parch = g.parcheggio.filter(senzaEsito);
  const perse = g.ora.concat(g.poi, g.parcheggio).filter((x) => a.passaFiltro(x.b) && x.b.mancata);
  if (!ora.length && !poi.length && !parch.length && !perse.length) {
    return '<p class="lista-nota">Niente in «' + a.esc(a.nomeFiltro()) + '».</p>';
  }

  function gruppo(titolo, voci, cls, opts) {
    if (!voci.length) return '';
    const lunga = (opts && opts.taglia) && voci.length > a.MURO;
    const tutte = !!a.backlogAperte.__tutte;
    const taglia = lunga && !tutte;
    const mostrate = taglia ? voci.slice(0, a.MURO) : voci;
    return '<div class="lista-eti">' + titolo + (voci.length > 1 ? ' <span>' + voci.length + '</span>' : '') + '</div>' +
      '<div class="lista lista-' + cls + '">' +
      mostrate.map((x, i) => a.attRigaHtml(x.b, { primo: cls === 'ora' && i === 0, motivo: x.i && x.i.motivo, da: x.i && x.i.da })).join('') +
      '</div>' +
      (lunga ? '<button class="lista-altre' + (tutte ? ' aperto' : '') + '" data-tutte="1" aria-expanded="' + tutte + '">' +
        a.ICO('chevronGiu', 15) + (taglia ? ' Mostra le altre ' + (voci.length - a.MURO) : ' Mostra solo le prime ' + a.MURO) + '</button>' : '');
  }

  const apertoParcheggio = !!a.backlogAperte.__parcheggio;
  return gruppo('Importanti', ora, 'ora') +
    gruppo('Altre', poi, 'poi', { taglia: true }) +
    (parch.length
      ? '<button class="lista-eti lista-eti-btn" data-parcheggio="1" aria-expanded="' + apertoParcheggio + '">' +
        'Inattive <span>' + parch.length + '</span>' +
        '<span class="lista-chev' + (apertoParcheggio ? ' aperta' : '') + '">' + a.ICO('chevronGiu', 15) + '</span></button>' +
        '<div class="lista lista-parcheggio"' + (apertoParcheggio ? '' : ' hidden') + '>' +
        parch.map((x) => a.attRigaHtml(x.b, { motivo: x.i && x.i.motivo })).join('') + '</div>'
      : '');
}

/* IL PANNELLO DEI FILTRI — la scelta è un elenco, come tutti gli altri. */
function apriFiltri(dopo) {
  const a = A();
  const st = window.LM.load();
  const totale = st.backlog.length;
  const conData = st.backlog.filter((b) => !b.done && b.scadenza).length;
  const nProg = st.backlog.filter((b) => b.steps && b.steps.length).length;
  function voce(id, ico, eti, n) {
    return '<div class="lista-riga">' +
      '<button class="lista-apri" data-filtro="' + id + '">' +
      '<span class="lista-vuoto">' + (a.attArea === id ? a.ICO('scelto', 15) : '') + '</span>' +
      '<span class="lista-corpo"><span class="lista-tit">' +
      (ico ? '<span class="tit-area"' + (ico === 'area' ? ' style="--c-area:' + window.LM.coloreArea(a.areaById(id)) + '"' : '') + '>' +
        a.ICO(ico === 'area' ? a.areaById(id).icona : ico, 13) + '</span>' : '') +
      a.esc(eti) + '</span></span>' +
      '<span class="lista-val">' + n + '</span></button></div>';
  }
  const html2 = '<div class="sc">' +
    '<div class="lista-eti">Tutto</div><div class="lista">' + voce('tutte', 'lista', 'Tutte le attività', totale) + '</div>' +
    ((conData || nProg)
      ? '<div class="lista-eti">Per come sono fatte</div><div class="lista">' +
        (conData ? voce('data', 'calendar', 'Con una data', conData) : '') +
        (nProg ? voce('progetti', 'rocket', 'Divise in passi', nProg) : '') + '</div>'
      : '') +
    a.etichetta('Per area', 'aree') + '<div class="lista">' +
    window.LM.backlogPerArea().filter((g) => g.items.length)
      .map((g) => voce(g.area.id, 'area', g.area.nome, g.items.length)).join('') +
    '</div></div>';
  a.apriSheet('Guarda solo', html2, (root) => {
    root.querySelectorAll('[data-filtro]').forEach((t) => {
      t.addEventListener('click', () => {
        a.attArea = t.getAttribute('data-filtro');
        a.chiudiSheet();
        dopo();
      });
    });
  });
}

/* LA RIGA PER AGGIUNGERE. In JSX perché `rigaAggiunta()` restituisce già il
   suo <form>: avvolgerlo aggiungeva un livello all'albero. Le opzioni dentro
   (le pastiglie del quando, la scelta dell'area) restano quelle di app.js —
   sono un modulo a sé — e i fili li attacca ancora `wireAggiunta`. */
function Aggiunta({ id, segnaposto, opzioni }) {
  return (
    <form className="agg" id={id} autoComplete="off">
      <div className="agg-riga">
        <input type="text" className="agg-testo" placeholder={segnaposto}
          aria-label={segnaposto} enterKeyHint="done" />
        <button className="btn btn-mini btn-tinta agg-ok" type="submit" aria-label="Aggiungi">
          <Segno nome="plus" />
          <span className="agg-ok-eti">Aggiungi</span>
        </button>
      </div>
      {opzioni ? <div className="agg-opz" hidden {...html(opzioni)} /> : null}
    </form>
  );
}

/* ---------------------------------------------------------------------- DA FARE
   La struttura è React; il markup delle RIGHE no: quello lo fa ancora
   `attRigaHtml` di app.js, chiamato attraverso la cucitura. Non è pigrizia —
   è l'unico modo di essere certi che la riga sia la STESSA riga e non una che
   le somiglia. Il giorno che diventa un pezzo (`PZ.riga`), sparisce di là e
   di qua insieme.
   I comandi invece sono di React: niente `wireLista`, un ascoltatore solo sul
   contenitore che guarda da quale `data-` arriva il tocco. */
function DaFare({ st }) {
  const [q, setQ] = useState(() => A().attQuery);
  const [, ridisegna] = useState(0);
  const box = useRef(null);

  const totale = st.backlog.length;

  /* la riga per aggiungere e i suoi fili sono ancora quelli di app.js: è un
     modulo a sé, con dentro le pastiglie del quando e la scelta dell'area */
  /* i fili della riga per aggiungere: si riattaccano a ogni disegno, perché
     React può aver rifatto il <form>. `wireAggiunta` cerca per id dentro allo
     scopo che gli si dà, e #att-corpo c'è sempre. */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (corpo) A().wireAggiunta(corpo);
  });

  if (!totale) {
    return (<>
      <Aggiunta id="agg-bk" segnaposto="Aggiungi una cosa da fare…" opzioni={A().opzDaFare()} />
      <div className="vuoto" style={{ padding: '22px 8px 6px' }}
        {...html(A().illoInbox() + '<b>Nessuna attività.</b><br>Aggiungine una qui sopra' +
          (st.inbox.length ? ', o sistema le note in «Da sistemare».' : '.'))} />
    </>);
  }

  const cerca = totale >= 10 || q;

  /* un tocco sulla lista: si guarda da quale `data-` viene e si fa quello.
     È la delega che faceva `wireLista`, ma dichiarata invece che agganciata. */
  const tocca = (e) => {
    const oggi = e.target.closest('[data-bkoggi]');
    if (oggi) {
      const id = oggi.getAttribute('data-bkoggi');
      const it = window.LM.load().backlog.find((x) => x.id === id);
      if (!it) return;
      if (it.steps && it.steps.length) {
        const passo = window.LM.prossimoPassoInOggi(id);
        A().toast(passo ? 'Prossimo passo portato in Oggi.'
          : 'Nessun passo da fare: sono tutti in agenda o completati.', 0, passo ? 'arrowRight' : 'check');
      } else {
        window.LM.backlogInOggi(id);
        A().toast('Portata tra le cose di oggi.', 0, 'arrowRight');
      }
      A().aggiornaNav();
      return;
    }
    const apri = e.target.closest('[data-bkapri]');
    if (apri) {
      const it = window.LM.load().backlog.find((x) => x.id === apri.getAttribute('data-bkapri'));
      if (it) A().apriScheda(it.id);
      return;
    }
    const tutte = e.target.closest('[data-tutte]');
    if (tutte) {
      const primaY = tutte.getBoundingClientRect().top;
      A().backlogAperte.__tutte = !A().backlogAperte.__tutte;
      ridisegna((n) => n + 1);
      /* si torna dov'eri: il tasto che hai premuto resta sotto al dito */
      requestAnimationFrame(() => {
        const nuovo = box.current && box.current.querySelector('[data-tutte]');
        if (!nuovo) return;
        const delta = nuovo.getBoundingClientRect().top - primaY;
        if (delta) window.scrollBy(0, delta);
        nuovo.focus({ preventScroll: true });
      });
      return;
    }
    const parch = e.target.closest('[data-parcheggio]');
    if (parch) {
      A().backlogAperte.__parcheggio = !A().backlogAperte.__parcheggio;
      ridisegna((n) => n + 1);
    }
  };

  return (<>
      <Aggiunta id="agg-bk" segnaposto="Aggiungi una cosa da fare…" opzioni={A().opzDaFare()} />
      <div className="att-barra">
        {cerca ? (
          <label className="att-cerca">
            <Segno nome="lente" />
            <input type="text" id="att-q" placeholder="Cerca…" aria-label="Cerca un’attività"
              value={q} onChange={(e) => { A().attQuery = e.target.value; setQ(e.target.value); }} />
          </label>
        ) : null}
        <button className={'att-filtro' + (A().attArea === 'tutte' ? '' : ' on')} id="att-filtro"
          aria-haspopup="dialog" onClick={() => apriFiltri(() => ridisegna((n) => n + 1))}>
          <Segno nome="imbuto" />
          <span>{A().nomeFiltro()}</span>
          <span className="lista-chev"><Segno nome="chevronGiu" /></span>
        </button>
      </div>
      <div id="dafare-lista" ref={box} onClick={tocca} {...html(listaHtml(st, q))} />
  </>);
}

/* ------------------------------------------------------------------- ABITUDINI
   Con un orario la lista prende la forma della giornata: prima quelle che
   hanno un'ora, in ordine, poi quelle che si fanno quando capita.
   Le righe le fa ancora `rigaAbitudine` di app.js — stessa ragione delle
   righe di «Da fare»: dev'essere la stessa riga, non una che le somiglia. */
function Abitudini({ st }) {
  const a = A();
  const [, ridisegna] = useState(0);
  const oggi = window.LM.abitudiniDiOggi().slice().sort((x, y) => {
    if (x.ora && y.ora) return x.ora < y.ora ? -1 : (x.ora > y.ora ? 1 : 0);
    if (x.ora) return -1;
    if (y.ora) return 1;
    return 0;
  });
  const idOggi = {};
  oggi.forEach((h) => { idOggi[h.id] = true; });
  const altre = st.abitudini.filter((h) => !idOggi[h.id]);
  const fatte = oggi.filter((h) => !!h.fatti[window.LM.todayKey()]).length;
  const tutte = oggi.length && fatte === oggi.length;

  /* i fili della riga per aggiungere: le pastiglie dei giorni e il resto */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (!corpo) return;
    const g = corpo.querySelector('#agg-ab-giorni');
    if (g) g.querySelectorAll('.giorno-chip').forEach((chip) => {
      chip.onclick = () => chip.classList.toggle('sel');
    });
    a.wireRigaAggiunta(corpo, 'agg-ab', (testo, opz) => {
      const giorni = a.leggiGiorni(opz.querySelector('#agg-ab-giorni'));
      const ora = opz.querySelector('#agg-ab-ora').value || null;
      window.LM.aggiungiAbitudine(testo, opz.querySelector('#agg-ab-area').value, giorni, { ora: ora });
      a.toast('«' + testo + '» ' + a.riepilogoGiorni(giorni) + (ora ? ' alle ' + ora : '') + ', da oggi.', 0, 'refresh');
      ridisegna((n) => n + 1);
      const i = corpo.querySelector('#agg-ab .agg-testo');
      if (i) i.focus({ preventScroll: true });
    });
  });

  /* Il tocco si delega su #att-corpo invece che su un contenitore proprio:
     un <div> attorno a tutto sarebbe un elemento in più nell'albero, e
     prove/gemelle.js li conta. */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (!corpo) return;
    const tocca = (e) => {
      const sp = e.target.closest('[data-toggle-ab]');
      if (sp) {
        a.feedbackSpunta(e, window.LM.completaAbitudine(sp.getAttribute('data-toggle-ab')),
          'Fatta. Continua così', 'flame');
        ridisegna((n) => n + 1);
        return;
      }
      const d = e.target.closest('[data-abdett]');
      if (d) a.apriDettaglioAbitudine(d.getAttribute('data-abdett'), () => ridisegna((n) => n + 1));
    };
    corpo.addEventListener('click', tocca);
    return () => corpo.removeEventListener('click', tocca);
  }, []);

  const opzioni = '<span class="agg-eti">In che giorni</span>' +
    '<div id="agg-ab-giorni" class="agg-giorni">' + a.chipsGiorni([]) + '</div>' +
    '<span class="agg-nota">nessuno selezionato = ogni giorno</span>' +
    '<label class="agg-ora"><span class="agg-eti">alle</span>' +
    '<input type="time" class="tl-time" id="agg-ab-ora" aria-label="A che ora (facoltativo)"></label>' +
    '<label class="agg-area"><span class="agg-eti">in</span>' + a.selectAree('agg-ab-area', 'salute') + '</label>';

  return (<>
    {oggi.length ? (
      <div className={'ab-prog' + (tutte ? ' piena' : '')}>
        <div className="ab-prog-testo" {...html(tutte
          ? a.ICO('check', 15) + ' <b>Fatte tutte</b>, per oggi ci sei.'
          : '<b>' + fatte + '</b> di ' + oggi.length + ' per oggi')} />
        <div className="ab-prog-barra"><span style={{ width: Math.round(fatte / oggi.length * 100) + '%' }} /></div>
      </div>
    ) : null}
    <div className="ab-nuova">
      <Aggiunta id="agg-ab" segnaposto="Nuova abitudine…" opzioni={opzioni} />
    </div>
    {oggi.length ? <>
      <div className="lista-eti">Oggi</div>
      <div className="lista" {...html(oggi.map((h) => a.rigaAbitudine(h, true)).join(''))} />
    </> : (st.abitudini.length
      ? <div className="vuoto" style={{ padding: '20px 8px' }}>Per oggi non è prevista nessuna abitudine.</div>
      : <div className="vuoto" style={{ padding: '20px 8px' }}
          {...html(a.illoInbox() + '<b>Nessuna abitudine.</b><br>Le azioni che vuoi ripetere: ogni volta che le fai, la serie cresce. Scrivine una qui sopra — «leggere 20 minuti», «camminare».')} />)}
    {altre.length ? <>
      <div className="lista-eti">Le altre</div>
      <div className="lista" {...html(altre.map((h) => a.rigaAbitudine(h, false)).join(''))} />
    </> : null}
  </>);
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
      <Testa titolo="Attività" giaNellaNav />
      <div id="att-corpo" ref={corpo}>
        {quale === 'sistemare' && nInbox ? <Smista st={s} /> : null}
        {quale === 'dafare' ? <DaFare st={s} /> : null}
        {quale === 'abitudini' ? <Abitudini st={s} /> : null}
      </div>
    </>
  );
}
