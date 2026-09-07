/* LA SCHEDA DI UN'ABITUDINE.

   Il pannello faceva tre cose in una sola colonna da quaranta comandi —
   spuntare l'abitudine di oggi, guardare come sta andando, e cambiarne le
   regole — mentre la ragione per cui lo si apre è quasi sempre la prima. Le
   regole si mettono una volta e poi non si toccano più: stanno dietro una
   riga. Anche «Elimina» sta lì dentro: è raro e non si torna indietro.

   Quella riga è chiusa ogni volta che si apre la scheda: aprirla è una
   decisione, non una preferenza da ricordare.  */
import { useRef, useState } from 'react';
import { Segno } from '../pezzi.jsx';
import { usaCambioNativo } from '../nativo.js';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

/* TRE NUMERI IN FILA NON SONO UN'INFORMAZIONE.
   Qui c'era «3 giorni di fila · record 5 · 8 volte in tutto»: tre fatti della
   stessa dimensione, uno accanto all'altro, e il conto che conta davvero —
   quanto manca al record — lo doveva fare chi legge. La fila è diventata una
   scala: dove sei adesso, che cosa manca al passo dopo, e in fondo, piano,
   quanto hai fatto in tutto.
   La scala è larga quanto il record, e quanto ne è pieno è la serie di adesso.
   Il traguardo è il record e non un numero tondo scelto da noi: una meta già
   raggiunta una volta tira più di una medaglia lontana, ed è l'unica che l'app
   sa per certo che questa persona può fare. Quando il record è battuto la
   scala è piena e il traguardo si sposta sulla serie stessa: non si può stare
   fuori dal proprio grafico.
   E una fiamma accanto a uno zero è solo un rimprovero: se la serie non c'è si
   dice com'è, senza medaglia spenta. */
function Scala({ serie, record, volte }) {
  const meta = Math.max(record, serie, 1);
  const quota = Math.max(0, Math.min(1, serie / meta));
  const battuto = serie > 0 && serie >= record;
  const manca = record - serie;
  const detto = serie + (serie === 1 ? ' giorno di fila' : ' giorni di fila') +
    ', il tuo record è ' + Math.max(record, serie) +
    (volte > 0 ? ', ' + volte + (volte === 1 ? ' volta' : ' volte') + ' in tutto' : '');
  return (<>
    <div className={'abd-scala' + (battuto ? ' record' : '') + (serie ? '' : ' spenta')} role="img" aria-label={detto}>
      <span className="abd-scala-lato">
        <b className="abd-scala-num"><Segno nome="flame" dim={18} piu={serie > 0 ? 'fiamma' : ''} />{serie}</b>
        <small>{serie === 1 ? 'giorno di fila' : 'giorni di fila'}</small>
      </span>
      {/* la barra è un disegno: chi legge con un lettore di schermo riceve la
          frase intera dall'aria-label qui sopra, e qui dentro non c'è niente
          da annunciare */}
      <span className="abd-scala-barra" aria-hidden="true"><i style={{ width: (quota * 100).toFixed(1) + '%' }} /></span>
      <span className="abd-scala-lato abd-scala-meta">
        <b className="abd-scala-num"><Segno nome={battuto ? 'star' : 'mirino'} />{Math.max(record, serie)}</b>
        <small>{battuto ? 'record tuo' : 'il tuo record'}</small>
      </span>
    </div>
    {/* quello che manca al passo dopo si dice una volta sola, piano, e solo
        quando c'è davvero un passo dopo */}
    {manca > 0 && serie > 0
      ? <p className="abd-scala-nota">{manca === 1 ? 'Ancora un giorno' : 'Ancora ' + manca + ' giorni'} e sei al tuo record.</p>
      : serie === 0
        ? <p className="abd-scala-nota">{record > 1 ? 'La serie riparte dal primo giorno che la segni.' : 'La serie comincia il primo giorno che la segni.'}</p>
        : null}
    {volte > 0 ? <p className="abd-scala-tot">{volte}{volte === 1 ? ' volta' : ' volte'} in tutto</p> : null}
  </>);
}

/* LA GRIGLIA DICE QUAL È, E I GIORNI CHE NON SONO ARRIVATI NON CI SONO.
   Sette colonne con L M M G V S D sopra e i numeri dei giorni dentro sono un
   calendario del mese, a guardarli: e allora ad agosto uno vede una griglia
   che comincia il 3 e finisce il 28 e si chiede dove siano gli altri tre
   giorni. Sono le ultime quattro settimane, e adesso c'è scritto.
   I giorni che devono ancora arrivare non sono caselle: tengono il posto nella
   griglia e basta. Prima erano caselle senza fondo e senza bordo — sembravano
   vuote, e `.abd-g:hover` gliene riaccendeva il bordo appena ci passavi
   sopra. */
function Catena({ giorni, onGiorno }) {
  const a = A();
  return (<>
    <div className="lista-eti"><Segno nome="unaSettimana" dim={11} />Ultime 4 settimane</div>
    <div className="abd-testa">{a.GIORNI_ORD.map((d) => <span key={d}>{a.GIORNI_LAB[d]}</span>)}</div>
    <div className="abd-catena" role="group" aria-label="Le ultime quattro settimane">
      {giorni.map((g, i) => {
        if (g.futuro) return <span key={i} className="abd-vuoto" aria-hidden="true" />;
        const cls = 'abd-g' + (g.fatto ? ' fatto' : '') + (g.saltato ? ' saltato' : '') +
          (!g.prevista && !g.fatto && !g.saltato ? ' fuori' : '') + (g.oggi ? ' oggi' : '');
        const che = g.fatto ? 'fatta' : g.saltato ? 'saltata' : g.prevista ? 'non fatta' : 'non prevista';
        return (
          <button key={i} className={cls} data-giorno-ab={g.k} aria-pressed={g.fatto ? 'true' : 'false'}
            aria-label={window.LM.fmtShort(g.k) + ', ' + che} title={window.LM.fmtShort(g.k)}
            onClick={() => onGiorno(g.k)}>
            <span>{window.LM.fmtShort(g.k).split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  </>);
}

export default function Abitudine({ id, dopo }) {
  const a = A();
  /* TUTTI I GANCI PRIMA DELL'USCITA ANTICIPATA: React li conta, e nello
     stesso ordine a ogni disegno. */
  const [, bump] = useState(0);
  const [aperta, setAperta] = useState(false);
  const nome = useRef(null);
  const gg = useRef(null);
  const ora = useRef(null);
  const dur = useRef(null);
  const area = useRef(null);
  const da = useRef(null);
  const fin = useRef(null);

  const h = window.LM.load().abitudini.find((x) => x.id === id);
  const ridisegna = () => { bump((n) => n + 1); if (dopo) dopo(); };

  /* i campi che salvano nei dati tengono il `change` vero del browser: la
     ragione sta in react/src/nativo.js */
  usaCambioNativo(nome, (i) => {
    const v2 = i.value.trim();
    const ora2 = window.LM.load().abitudini.find((x) => x.id === id);
    if (!v2) { if (ora2) i.value = ora2.testo; return; }
    window.LM.modificaAbitudine(id, { testo: v2 });
    const tit = document.getElementById('sheet-titolo');
    if (tit) tit.textContent = v2;
    if (dopo) dopo();
  }, [id, h && h.testo]);
  usaCambioNativo(ora, (i) => { window.LM.modificaAbitudine(id, { ora: i.value || null }); ridisegna(); }, [id, h && h.ora]);
  usaCambioNativo(dur, (i) => { window.LM.modificaAbitudine(id, { durata: i.value ? +i.value : null }); if (dopo) dopo(); }, [id]);
  usaCambioNativo(area, (i) => { window.LM.modificaAbitudine(id, { areaId: i.value }); if (dopo) dopo(); }, [id]);
  usaCambioNativo(da, (i) => {
    const q = window.LM.load().abitudini.find((x) => x.id === id) || {};
    window.LM.impostaPeriodoAbitudine(id, i.value || null, q.a); ridisegna();
  }, [id, h && h.da, h && h.a]);
  usaCambioNativo(fin, (i) => {
    const q = window.LM.load().abitudini.find((x) => x.id === id) || {};
    window.LM.impostaPeriodoAbitudine(id, q.da, i.value || null); ridisegna();
  }, [id, h && h.da, h && h.a]);

  if (!h) { a.chiudiSheet(); if (dopo) dopo(); return null; }

  const st = a.statoAbitudineOggi(h);
  const serie = window.LM.streakAbitudine(h);
  const record = window.LM.recordAbitudine(h);
  const volte = Object.keys(h.fatti || {}).length;
  const giorni = a.giorniAbitudine(h, 4);
  const prevista = window.LM.abitudinePrevista(h, window.LM.todayKey());

  /* le pastiglie dei giorni le scrive `chipsGiorni` di app.js: sono le stesse
     della riga d'aggiunta, e riscriverle vorrebbe dire due sorgenti per la
     stessa forma. Il tocco si prende sul contenitore. */
  const toccaGiorno = (e) => {
    const chip = e.target.closest('.giorno-chip');
    if (!chip) return;
    chip.classList.toggle('sel');
    window.LM.modificaAbitudine(id, { giorni: a.leggiGiorni(gg.current) });
    ridisegna();
  };

  return (
    <div className="abd">
      <div className="abd-oggi">
        {st.saltata ? <>
          <button className="btn btn-grande" id="abd-rimetti"
            onClick={() => { window.LM.saltaGiornoAbitudine(id); ridisegna(); }}>
            <Segno nome="annulla" /> Rimetti oggi
          </button>
          <p className="abd-nota">Oggi è saltata: non conta come mancata e la serie non si rompe.</p>
        </> : <>
          <button className={'btn btn-grande ' + (st.fatta ? 'btn-ok' : 'btn-primario')} id="abd-fatta"
            onClick={(ev) => {
              a.feedbackSpunta(ev, window.LM.completaAbitudine(id), 'Fatta. Continua così', 'flame');
              ridisegna();
            }}>
            <Segno nome="check" />{st.fatta ? ' Fatta oggi' : ' Segna come fatta'}
          </button>
          {prevista ? (
            <button className="btn btn-mini btn-ghost" id="abd-salta" onClick={() => {
              window.LM.saltaGiornoAbitudine(id);
              a.toast('Saltata per oggi. La serie regge.', 0, 'moon');
              ridisegna();
            }}><Segno nome="salta" /> Salta oggi</button>
          ) : null}
        </>}
      </div>

      <Scala serie={serie} record={record} volte={volte} />
      <Catena giorni={giorni} onGiorno={(k) => {
        if (k > window.LM.todayKey()) return;
        window.LM.completaAbitudine(id, k);
        ridisegna();
      }} />
      <p className="abd-nota">Tocca un giorno passato se te ne sei ricordato dopo.</p>

      {/* «Modifica», non «Come è impostata»: quello è il modo in cui si
          descrive una cosa a voce, non il modo in cui la si chiama. Un comando
          porta il nome di quello che fa. */}
      <button className="lista-eti lista-eti-btn" id="abd-piu" aria-expanded={aperta ? 'true' : 'false'}
        aria-controls="abd-config" onClick={() => setAperta((v) => !v)}>
        <Segno nome="ingranaggio" dim={13} />Modifica
        <span className={'lista-chev' + (aperta ? ' aperta' : '')}><Segno nome="chevronGiu" /></span>
      </button>
      <div id="abd-config" hidden={!aperta}>
        <label className="campo" htmlFor="abd-nome">Nome</label>
        <input key={h.testo} type="text" id="abd-nome" ref={nome} defaultValue={h.testo} />
        <label className="campo">Quando ripeterla</label>
        <div id="abd-giorni" ref={gg} onClick={toccaGiorno} {...html(a.chipsGiorni(h.giorni))} />
        <div className="abd-nota-giorni">{a.riepilogoGiorni(h.giorni)}</div>
        {/* Un'abitudine attaccata a un'ora precisa si fa molto più spesso di
            una lasciata a «quando capita»: è la parte «quando e dove» delle
            intenzioni di attuazione, l'unica cosa che nella ricerca sposta
            davvero la percentuale di volte in cui una cosa viene fatta. E con
            un'ora l'abitudine compare anche nella giornata, al suo posto,
            invece di restare una riga fuori dal tempo. */}
        <label className="campo" htmlFor="abd-ora">A che ora</label>
        <div className="abd-orario">
          <input key={h.ora || 'niente'} type="time" className="tl-time" id="abd-ora" ref={ora} defaultValue={h.ora || ''} />
          <select key={'d' + (h.durata || '')} className="tl-dur" id="abd-dur" ref={dur} aria-label="Quanto dura"
            defaultValue={String(h.durata == null ? '' : h.durata)}>
            {a.DURATE.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.t}</option>)}
          </select>
          {h.ora
            ? <button className="btn btn-mini btn-ghost" id="abd-noora"
                onClick={() => { window.LM.modificaAbitudine(id, { ora: null }); ridisegna(); }}>
                <Segno nome="clock" dim={13} /> Togli l’orario
              </button>
            : <span className="ap-nota">senza orario: la fai quando capita</span>}
        </div>
        <label className="campo" htmlFor="abd-area">Area</label>
        {/* qui il <select> non può stare dentro a niente — nel codice di
            prima è figlio diretto di #abd-config — quindi `selectAree` non si
            può infilare col suo involucro, e le stesse righe si scrivono in
            JSX. Dove un involucro c'è già (la riga «Area» della scheda di
            un'attività) si usa ancora quella di app.js. */}
        <select id="abd-area" ref={area} aria-label="Area" defaultValue={h.areaId}>
          {a.areeAttive().map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
        <label className="campo">Per quanto vale</label>
        <div className="abd-periodo">
          <label className="ap-campo">dal <input key={'da' + (h.da || '')} type="date" id="abd-da" ref={da} defaultValue={h.da || ''} /></label>
          <label className="ap-campo">al <input key={'a' + (h.a || '')} type="date" id="abd-a" ref={fin} defaultValue={h.a || ''} min={h.da || ''} /></label>
          {h.a
            ? <button className="btn btn-mini btn-ghost" id="abd-nofine"
                onClick={() => { window.LM.impostaPeriodoAbitudine(id, h.da, null); ridisegna(); }}>Senza fine</button>
            : <span className="ap-nota">vuoto = senza fine</span>}
        </div>
        <div className="abd-fondo">
          <button className="btn btn-mini btn-ghost imp-pericolo" id="abd-del" onClick={() => {
            a.conAnnulla('Abitudine eliminata.', 'trash', () => {
              window.LM.rimuoviAbitudine(id);
              a.chiudiSheet();
              if (dopo) dopo();
            });
          }}><Segno nome="trash" /> Elimina l’abitudine</button>
        </div>
      </div>
    </div>
  );
}
