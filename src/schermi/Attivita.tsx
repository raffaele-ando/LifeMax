/* ATTIVITÀ — la schermata dei due lavori: svuotare la coda delle note appena
   catturate, e scegliere cosa fare da una lista.

   Dove il markup lo produce un aiutante di `app.ts` — la riga di un'attività,
   il selettore delle aree, l'etichetta di gruppo — si usa quello invece di
   riscriverlo: riscriverlo vorrebbe dire avere due sorgenti per la stessa
   forma, che è esattamente il problema da cui viene tutto questo lavoro. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usaLM } from '../pezzi/usaLM';
import { Segno, Testa } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { ICO } from '../segni/segni';
import { presa } from '../tipi/presa';
import type { Stato, Nota, Abitudine } from '../tipi/stato';
import { esc } from '../pezzi/stringhe';
import { ora as comeOra } from '../tipi/stato';
import {
  schermo, MURO,
  attRigaHtml, opzDaFare, wireAggiunta, areaFiltro, passaFiltro, nomeFiltro,
  areeAttive, aggiornaNav, animaIngresso, toast, conAnnulla, apriFoglio,
  apriScheda, apriDettaglioAbitudine, feedbackSpunta, rigaAbitudine,
  chipsGiorni, riepilogoGiorni, selectAree, leggiGiorni, wireRigaAggiunta,
  illoInbox, render
} from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

/* ---------------------------------------------------------------- LE LINGUETTE
   La prima esiste solo finché c'è una coda da svuotare: una destinazione
   sempre a zero è una parola in più da scartare ogni volta. */
type Tab = 'sistemare' | 'dafare' | 'abitudini';
function Linguetta({ id, ico, eti, n, attiva, onScegli }: {
  id: Tab; ico: string; eti: string; n: number; attiva: boolean; onScegli: (t: Tab) => void;
}) {
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
type Esito = 'azione' | 'backlog' | 'scarta';
const PORTE: { fai: Esito; ico: string; che: string; nota: string; piu: string }[] = [
  { fai: 'azione', ico: 'target', che: 'Oggi', nota: 'la fai oggi', piu: ' sm-porta-si' },
  { fai: 'backlog', ico: 'lista', che: 'Da fare', nota: 'più avanti', piu: '' },
  { fai: 'scarta', ico: 'trash', che: 'Scarta', nota: 'non serve', piu: ' sm-porta-no' }
];

function Smista({ st }: { st: Stato }) {
  const coda: Nota[] = st.inbox.slice().sort((a, b) => (b.creata || 0) - (a.creata || 0));
  const nota = coda[0];
  const resto = coda.slice(1);
  const campo = useRef<HTMLTextAreaElement>(null);
  const area = useRef<HTMLSelectElement>(null);

  /* il campo cresce con quello che ci scrivi: la stessa `adatta()` di prima */
  const adatta = () => {
    const t = campo.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  };
  useEffect(adatta, [nota ? nota.id : '']);

  if (!nota) return null;
  const quella = nota;
  const quando = new Date(quella.creata).toLocaleString('it-IT',
    { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  /* il testo si salva uscendo dal campo: nessun tasto «salva» per una
     correzione di due lettere */
  const salva = () => {
    const t = campo.current;
    if (!t) return;
    const v = t.value.replace(/\s+/g, ' ').trim();
    if (!v) { t.value = quella.testo; adatta(); return; }
    if (v !== quella.testo) LM.modificaInbox(quella.id, v);
  };

  /* Le tre porte, con gli stessi messaggi di prima — e «Scarta» passa da
     `conAnnulla`, che dà il tempo di rimettere a posto: scartare è l'unica
     delle tre che butta via qualcosa. */
  const decidi = (esito: Esito) => {
    const t = campo.current;
    const v = t ? t.value.replace(/\s+/g, ' ').trim() : '';
    if (v && v !== quella.testo) LM.modificaInbox(quella.id, v);
    const areaVal = area.current ? area.current.value : 'altro';

    const fatto = () => {
      LM.triageInbox(quella.id, esito, areaVal);
      aggiornaNav();
      if (!LM.load().inbox.length) {
        schermo.att.tab = 'dafare';
        render();
        toast('Coda svuotata: non c’è più niente da sistemare.', 0, 'check');
        return;
      }
      render();
      animaIngresso(document.getElementById('att-corpo'));
    };

    if (esito === 'scarta') { conAnnulla('Scartata.', 'trash', fatto); return; }
    toast(esito === 'azione' ? 'Messa tra le cose di oggi.' : 'Aggiunta a «Da fare».',
      LM.XP_EVENTI.triage, esito === 'azione' ? 'arrowRight' : 'lista');
    fatto();
  };

  return (
    <div className="sm-uno">
      {/* `etichetta()` restituisce già il suo <div class="lista-eti">:
          avvolgerlo in un altro div aggiungeva un livello all'albero */}
      <div className="lista-eti" {...html(ICO('inbox', 11) + 'Da sistemare')} />
      {/* LA `key` QUI NON È UN DETTAGLIO: È QUELLO CHE C'È SCRITTO DENTRO.
          `defaultValue` vale solo al montaggio, e questa coda AVANZA: appena
          smisti una nota, React ridisegna con la nota dopo e riusa il nodo che
          sta nella stessa posizione — dentro ci resta il testo di quella di
          prima. Chi guarda vede la nota precedente al posto della nuova.
          E poi succede il peggio: `decidi()` legge il campo e, trovandolo
          diverso dal testo della nota, lo salva — cioè RIBATTEZZA la nota
          nuova col nome di quella appena smistata. Una coda intera diventa
          copie della prima. È un difetto vero e l'ha trovato chi usa l'app.
          Il codice di prima non ce l'aveva perché rifaceva tutto #vista a
          ogni giro: la casella era un elemento nuovo, e ripartiva dai dati.
          Con la chiave sull'id della nota il nodo rinasce, che è esattamente
          quello che succedeva prima. `prove/smista.js` è la prova che lo
          pretende, nota per nota, fino a svuotare la coda. */}
      <div className="sm-nota">
        <textarea key={'t' + quella.id} className="sm-titolo" id="sm-testo" rows={1} aria-label="Testo della nota"
          ref={campo} defaultValue={quella.testo}
          onInput={adatta} onBlur={salva}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />
        <div className="sm-meta">
          <select key={'a' + quella.id} id="sm-area" className="sm-area-sel" aria-label="Area"
            ref={area} defaultValue={quella.areaSug || 'altro'}>
            {areeAttive().map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
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

/* L'ELENCO. Le tre file per importanza, le non riuscite che escono dalle
   file, il gruppo «Inattive» che si apre — e le righe le fa `attRigaHtml`,
   la stessa funzione che le fa in ogni altro posto dell'app. */
function listaHtml(st: Stato, query: string): string {
  const q = (query || '').trim().toLowerCase();
  if (q) {
    const ris = st.backlog.filter((b) => b.testo.toLowerCase().indexOf(q) >= 0);
    return '<div class="lista-eti">' + ris.length + (ris.length === 1 ? ' risultato' : ' risultati') + '</div>' +
      (ris.length
        ? '<div class="lista">' + ris.map((b) => attRigaHtml(b, {})).join('') + '</div>'
        : '<p class="lista-nota">Nessuna corrispondenza per «' + esc(query.trim()) + '».</p>');
  }
  const g = LM.backlogPerImportanza({ areaId: areaFiltro() || 'tutte', tetto: 3 });
  type Voce = typeof g.ora[number];
  const senzaEsito = (x: Voce) => passaFiltro(x.b) && !x.b.mancata;
  const ora = g.ora.filter(senzaEsito);
  const poi = g.poi.filter(senzaEsito);
  const parch = g.parcheggio.filter(senzaEsito);
  const perse = g.ora.concat(g.poi, g.parcheggio).filter((x) => passaFiltro(x.b) && x.b.mancata);
  if (!ora.length && !poi.length && !parch.length && !perse.length) {
    return '<p class="lista-nota">Niente in «' + esc(nomeFiltro()) + '».</p>';
  }

  function gruppo(titolo: string, voci: Voce[], cls: string, opts?: { taglia?: boolean }): string {
    if (!voci.length) return '';
    const lunga = !!(opts && opts.taglia) && voci.length > MURO;
    const tutte = schermo.att.tutteAperte;
    const taglia = lunga && !tutte;
    const mostrate = taglia ? voci.slice(0, MURO) : voci;
    return '<div class="lista-eti">' + titolo + (voci.length > 1 ? ' <span>' + voci.length + '</span>' : '') + '</div>' +
      '<div class="lista lista-' + cls + '">' +
      mostrate.map((x, i) => attRigaHtml(x.b, { primo: cls === 'ora' && i === 0, motivo: x.i.motivo, da: x.i.da })).join('') +
      '</div>' +
      (lunga ? '<button class="lista-altre' + (tutte ? ' aperto' : '') + '" data-tutte="1" aria-expanded="' + tutte + '">' +
        ICO('chevronGiu', 15) + (taglia ? ' Mostra le altre ' + (voci.length - MURO) : ' Mostra solo le prime ' + MURO) + '</button>' : '');
  }

  const apertoParcheggio = schermo.att.parcheggioAperto;
  return gruppo('Importanti', ora, 'ora') +
    gruppo('Altre', poi, 'poi', { taglia: true }) +
    (parch.length
      ? '<button class="lista-eti lista-eti-btn" data-parcheggio="1" aria-expanded="' + apertoParcheggio + '">' +
        'Inattive <span>' + parch.length + '</span>' +
        '<span class="lista-chev' + (apertoParcheggio ? ' aperta' : '') + '">' + ICO('chevronGiu', 15) + '</span></button>' +
        '<div class="lista lista-parcheggio"' + (apertoParcheggio ? '' : ' hidden') + '>' +
        parch.map((x) => attRigaHtml(x.b, { motivo: x.i.motivo })).join('') + '</div>'
      : '');
}

/* LA RIGA PER AGGIUNGERE. Qui e non in `app.ts` perché `rigaAggiunta()`
   restituisce già il suo <form>: avvolgerlo aggiungeva un livello
   all'albero. Le opzioni dentro (le pastiglie del quando, la scelta
   dell'area) restano quelle di `app.ts` — sono un modulo a sé — e i fili li
   attacca ancora `wireAggiunta`. */
function Aggiunta({ id, segnaposto, opzioni }: { id: string; segnaposto: string; opzioni?: string }) {
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
   La struttura è di qui; il markup delle RIGHE no: quello lo fa `attRigaHtml`.
   Non è pigrizia — è l'unico modo di essere certi che la riga sia la STESSA
   riga e non una che le somiglia.
   I comandi sono di React: niente `wireLista`, un ascoltatore solo sul
   contenitore che guarda da quale `data-` arriva il tocco. */
function DaFare({ st }: { st: Stato }) {
  const [q, setQ] = useState(() => schermo.att.query);
  const [, ridisegna] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const totale = st.backlog.length;

  /* i fili della riga per aggiungere: si riattaccano a ogni disegno, perché
     React può aver rifatto il <form>. `wireAggiunta` cerca per id dentro allo
     scopo che gli si dà, e #att-corpo c'è sempre. */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (corpo) wireAggiunta(corpo);
  });

  if (!totale) {
    return (<>
      <Aggiunta id="agg-bk" segnaposto="Aggiungi una cosa da fare…" opzioni={opzDaFare()} />
      <div className="vuoto" style={{ padding: '22px 8px 6px' }}
        {...html(illoInbox() + '<b>Nessuna attività.</b><br>Aggiungine una qui sopra' +
          (st.inbox.length ? ', o sistema le note in «Da sistemare».' : '.'))} />
    </>);
  }

  const cerca = totale >= 10 || !!q;

  /* un tocco sulla lista: si guarda da quale `data-` viene e si fa quello.
     È la delega che faceva `wireLista`, ma dichiarata invece che agganciata. */
  const tocca = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const oggi = t.closest('[data-bkoggi]');
    if (oggi) {
      const id = oggi.getAttribute('data-bkoggi') || '';
      const it = LM.load().backlog.find((x) => x.id === id);
      if (!it) return;
      if (it.steps && it.steps.length) {
        const passo = LM.prossimoPassoInOggi(id);
        toast(passo ? 'Prossimo passo portato in Oggi.'
          : 'Nessun passo da fare: sono tutti in agenda o completati.', 0, passo ? 'arrowRight' : 'check');
      } else {
        LM.backlogInOggi(id);
        toast('Portata tra le cose di oggi.', 0, 'arrowRight');
      }
      aggiornaNav();
      return;
    }
    const apri = t.closest('[data-bkapri]');
    if (apri) {
      const it = LM.load().backlog.find((x) => x.id === apri.getAttribute('data-bkapri'));
      if (it) apriScheda(it.id);
      return;
    }
    const tutte = t.closest('[data-tutte]');
    if (tutte) {
      const primaY = tutte.getBoundingClientRect().top;
      schermo.att.tutteAperte = !schermo.att.tutteAperte;
      ridisegna((n) => n + 1);
      /* si torna dov'eri: il tasto che hai premuto resta sotto al dito */
      requestAnimationFrame(() => {
        const nuovo = box.current ? box.current.querySelector<HTMLElement>('[data-tutte]') : null;
        if (!nuovo) return;
        const delta = nuovo.getBoundingClientRect().top - primaY;
        if (delta) window.scrollBy(0, delta);
        nuovo.focus({ preventScroll: true });
      });
      return;
    }
    const parch = t.closest('[data-parcheggio]');
    if (parch) {
      schermo.att.parcheggioAperto = !schermo.att.parcheggioAperto;
      ridisegna((n) => n + 1);
    }
  };

  return (<>
      <Aggiunta id="agg-bk" segnaposto="Aggiungi una cosa da fare…" opzioni={opzDaFare()} />
      <div className="att-barra">
        {cerca ? (
          <label className="att-cerca">
            <Segno nome="lente" />
            <input type="text" id="att-q" placeholder="Cerca…" aria-label="Cerca un’attività"
              value={q} onChange={(e) => { schermo.att.query = e.target.value; setQ(e.target.value); }} />
          </label>
        ) : null}
        <button className={'att-filtro' + (schermo.att.area === 'tutte' ? '' : ' on')} id="att-filtro"
          aria-haspopup="dialog"
          onClick={() => apriFoglio('Guarda solo', 'filtri', { dopo: () => ridisegna((n) => n + 1) })}>
          <Segno nome="imbuto" />
          <span>{nomeFiltro()}</span>
          <span className="lista-chev"><Segno nome="chevronGiu" /></span>
        </button>
      </div>
      <div id="dafare-lista" ref={box} onClick={tocca} {...html(listaHtml(st, q))} />
  </>);
}

/* ------------------------------------------------------------------- ABITUDINI
   Con un orario la lista prende la forma della giornata: prima quelle che
   hanno un'ora, in ordine, poi quelle che si fanno quando capita.
   Le righe le fa ancora `rigaAbitudine` — stessa ragione delle righe di «Da
   fare»: dev'essere la stessa riga, non una che le somiglia. */
function Abitudini({ st }: { st: Stato }) {
  const [, ridisegna] = useState(0);
  const oggi: Abitudine[] = LM.abitudiniDiOggi().slice().sort((x, y) => {
    if (x.ora && y.ora) return x.ora < y.ora ? -1 : (x.ora > y.ora ? 1 : 0);
    if (x.ora) return -1;
    if (y.ora) return 1;
    return 0;
  });
  const idOggi: Record<string, true> = {};
  oggi.forEach((h) => { idOggi[h.id] = true; });
  const altre = st.abitudini.filter((h) => !idOggi[h.id]);
  const fatte = oggi.filter((h) => !!h.fatti[LM.todayKey()]).length;
  const tutte = oggi.length > 0 && fatte === oggi.length;

  /* i fili della riga per aggiungere: le pastiglie dei giorni e il resto */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (!corpo) return;
    const g = corpo.querySelector<HTMLElement>('#agg-ab-giorni');
    if (g) g.querySelectorAll<HTMLElement>('.giorno-chip').forEach((chip) => {
      chip.onclick = () => chip.classList.toggle('sel');
    });
    wireRigaAggiunta(corpo, 'agg-ab', (testo, opz) => {
      const giorni = leggiGiorni(presa(opz.querySelector<HTMLElement>('#agg-ab-giorni')));
      const scritta = presa(opz.querySelector<HTMLInputElement>('#agg-ab-ora')).value;
      const ora = scritta ? comeOra(scritta) : null;
      LM.aggiungiAbitudine(testo, presa(opz.querySelector<HTMLSelectElement>('#agg-ab-area')).value, giorni, { ora: ora });
      toast('«' + testo + '» ' + riepilogoGiorni(giorni) + (ora ? ' alle ' + ora : '') + ', da oggi.', 0, 'refresh');
      ridisegna((n) => n + 1);
      const i = corpo.querySelector<HTMLElement>('#agg-ab .agg-testo');
      if (i) i.focus({ preventScroll: true });
    });
  });

  /* Il tocco si delega su #att-corpo invece che su un contenitore proprio:
     un <div> attorno a tutto sarebbe un elemento in più nell'albero. */
  useEffect(() => {
    const corpo = document.getElementById('att-corpo');
    if (!corpo) return undefined;
    const tocca = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const sp = t.closest('[data-toggle-ab]');
      if (sp) {
        feedbackSpunta(e, LM.completaAbitudine(sp.getAttribute('data-toggle-ab') || ''),
          'Fatta. Continua così', 'flame');
        ridisegna((n) => n + 1);
        return;
      }
      const d = t.closest('[data-abdett]');
      if (d) apriDettaglioAbitudine(d.getAttribute('data-abdett') || '', () => ridisegna((n) => n + 1));
    };
    corpo.addEventListener('click', tocca);
    return () => corpo.removeEventListener('click', tocca);
  }, []);

  const opzioni = '<span class="agg-eti">In che giorni</span>' +
    '<div id="agg-ab-giorni" class="agg-giorni">' + chipsGiorni([]) + '</div>' +
    '<span class="agg-nota">nessuno selezionato = ogni giorno</span>' +
    '<label class="agg-ora"><span class="agg-eti">alle</span>' +
    '<input type="time" class="tl-time" id="agg-ab-ora" aria-label="A che ora (facoltativo)"></label>' +
    '<label class="agg-area"><span class="agg-eti">in</span>' + selectAree('agg-ab-area', 'salute') + '</label>';

  return (<>
    {oggi.length ? (
      <div className={'ab-prog' + (tutte ? ' piena' : '')}>
        <div className="ab-prog-testo" {...html(tutte
          ? ICO('check', 15) + ' <b>Fatte tutte</b>, per oggi ci sei.'
          : '<b>' + fatte + '</b> di ' + oggi.length + ' per oggi')} />
        <div className="ab-prog-barra"><span style={{ width: Math.round(fatte / oggi.length * 100) + '%' }} /></div>
      </div>
    ) : null}
    <div className="ab-nuova">
      <Aggiunta id="agg-ab" segnaposto="Nuova abitudine…" opzioni={opzioni} />
    </div>
    {oggi.length ? <>
      <div className="lista-eti">Oggi</div>
      <div className="lista" {...html(oggi.map((h) => rigaAbitudine(h, true)).join(''))} />
    </> : (st.abitudini.length
      ? <div className="vuoto" style={{ padding: '20px 8px' }}>Per oggi non è prevista nessuna abitudine.</div>
      : <div className="vuoto" style={{ padding: '20px 8px' }}
          {...html(illoInbox() + '<b>Nessuna abitudine.</b><br>Le azioni che vuoi ripetere: ogni volta che le fai, la serie cresce. Scrivine una qui sopra — «leggere 20 minuti», «camminare».')} />)}
    {altre.length ? <>
      <div className="lista-eti">Le altre</div>
      <div className="lista" {...html(altre.map((h) => rigaAbitudine(h, false)).join(''))} />
    </> : null}
  </>);
}

/* ------------------------------------------------------------------ LA SCHERMATA */
/* La fila delle linguette la crea il registro come figlia diretta di #vista,
   perché `sottoNav` la sposta appena dopo. Qui si dice solo com'è fatta.
   Il numero di note in coda decide fra tre linguette e due, e quello si sa
   solo leggendo i dati: per questo è una funzione. */
export const lingueAttivita = () => ({
  id: 'att-tabs',
  classi: 'segmenti sez-nav tabs-fisse' +
    (LM.load().inbox.length ? '' : ' tabs-due') + ' att-tabs'
});

export default function Attivita({ fila }: { fila: HTMLElement | null }) {
  const s = usaLM((lm) => lm.load());
  const nInbox = s.inbox.length;

  /* «Da sistemare» esiste solo con una coda da svuotare: se ci si stava
     dentro e la coda finisce, si scivola su «Da fare» invece di restare su
     una linguetta che non c'è più */
  const ammessi: Record<string, boolean> = { dafare: true, abitudini: true, sistemare: nInbox > 0 };
  const [tab, setTab] = useState<Tab>(() => {
    const t = schermo.att.tab;
    return (t && t !== 'sistemare' && ammessi[t]) || (t === 'sistemare' && nInbox)
      ? t as Tab
      : (nInbox ? 'sistemare' : 'dafare');
  });
  const quale: Tab = ammessi[tab] ? tab : (nInbox ? 'sistemare' : 'dafare');
  useEffect(() => { schermo.att.tab = quale; }, [quale]);

  /* il corpo entra quando cambia linguetta */
  const corpo = useRef<HTMLDivElement>(null);
  const vistaPrima = useRef<Tab | null>(null);
  useEffect(() => {
    /* anche al primo disegno: nel codice di prima la linguetta mostrata
       partiva indefinita, quindi il corpo entrava. Saltarlo qui voleva dire
       che la prima apertura non si muoveva e tutte le altre sì — una
       differenza che si vede. */
    if (corpo.current && vistaPrima.current !== quale) animaIngresso(corpo.current);
    vistaPrima.current = quale;
  }, [quale]);

  const nAb = LM.abitudiniDiOggi().filter((h) => !h.fatti[LM.todayKey()]).length;

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
