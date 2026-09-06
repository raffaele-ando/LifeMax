/* I PEZZI, IN REACT — le stesse forme, le stesse proprietà.

   Questo file è il gemello di `assets/pezzi.js`. Non è una riscrittura: i nomi
   delle proprietà sono gli stessi, uno per uno, perché è così che il lavoro
   fatto in vanilla non si butta.

       PZ.tasto({ testo, ico, tipo, misura, id })
       <Tasto  testo=…  ico=…  tipo=…  misura=…  id=… />

   Le classi CSS restano quelle di `app.css`: React qui cambia CHI scrive il
   markup, non come è fatto. Un pezzo convertito deve venire fuori identico a
   quello di prima — è l'unico modo di poter tornare indietro con un
   interruttore e non accorgersi di niente.

   `tipo` resta il RUOLO e mai il colore. La regola di DESIGN.md — uno pieno
   per schermata — vive qui dentro come vive in pezzi.js.  */

/* L'ICONA, SENZA NIENTE ATTORNO.

   `icons.js` non si porta dentro React: è una funzione pura che restituisce
   dell'SVG, e sta benissimo dov'è. Ma infilare quell'SVG in pagina richiede
   un elemento che lo contenga, e uno <span> in più cambia l'albero: il codice
   di prima mette l'<svg> come FIGLIO DIRETTO del bottone, e prove/gemelle.js
   se ne accorge subito.

   Quindi si smonta la stringa una volta sola — gli attributi del tag <svg> e
   quello che ha dentro — e si ridisegna un <svg> vero con gli stessi
   attributi. Fuori esce esattamente lo stesso elemento, senza involucro.
   Il conto si tiene: `ICO` per un nome e una misura dà sempre la stessa cosa. */
const ATTRIBUTO = { class: 'className', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'aria-hidden': 'aria-hidden' };
const smontati = new Map();
function smonta(testo) {
  if (smontati.has(testo)) return smontati.get(testo);
  const m = /^<svg([^>]*)>([\s\S]*)<\/svg>$/.exec(testo.trim());
  const fuori = m
    ? {
        attributi: [...m[1].matchAll(/([\w-]+)="([^"]*)"/g)]
          .reduce((o, a) => { o[ATTRIBUTO[a[1]] || a[1]] = a[2]; return o; }, {}),
        dentro: m[2]
      }
    : null;
  smontati.set(testo, fuori);
  return fuori;
}

export function Segno({ nome, dim = 15 }) {
  if (!nome || typeof window.ICO !== 'function') return null;
  const p = smonta(window.ICO(nome, dim));
  if (!p) return null;
  return <svg {...p.attributi} dangerouslySetInnerHTML={{ __html: p.dentro }} />;
}

const RUOLO = {
  pieno: 'btn-primario', tonale: 'btn-tonale', quieto: '',
  chiude: 'btn-ok', pericolo: 'btn-pericolo'
};
const MISURA = { normale: '', grande: 'btn-grande', mini: 'btn-mini' };
const cl = (...a) => a.filter(Boolean).join(' ');

export function Tasto({ testo, ico, tipo = 'quieto', misura = 'normale', sotto, id, via, spento, etichetta, piu, onClick }) {
  const dentro = <>
    {ico && <Segno nome={ico} />}{ico && testo ? ' ' : ''}{testo}
    {sotto && <small>{sotto}</small>}
  </>;
  const classe = cl('btn', RUOLO[tipo], MISURA[misura], piu);
  if (via) return <a className={classe} href={via} id={id} aria-label={etichetta}>{dentro}</a>;
  return (
    <button className={classe} id={id} type="button" disabled={spento} aria-label={etichetta} onClick={onClick}>
      {dentro}
    </button>
  );
}

export function Scheda({ titolo, sotto, ico, id, piu, children }) {
  return (
    <div className={cl('card', piu)} id={id}>
      {titolo && <h2 className="card-tit">{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{titolo}</h2>}
      {sotto && <div className="sotto">{sotto}</div>}
      {children}
    </div>
  );
}

export function Elenco({ id, piu, children }) {
  return <div className={cl('lista', piu)} id={id}>{children}</div>;
}

/* tre mestieri, e la differenza si vede:
     porta  ti porta altrove       → freccetta
     fa     fa una cosa adesso     → niente freccetta, non si va via
     ferma  si legge e basta       → non è un bottone                     */
export function Riga({ mestiere = 'fa', eti, titolo, sotto, ico, valore, id, piu, coda, onClick }) {
  const stretta = eti !== undefined ? 'sc-riga' : '';
  const corpo = titolo
    ? <span className="lista-corpo">
        <span className="lista-tit">{titolo}</span>
        {sotto && <span className="lista-sub">{sotto}</span>}
      </span>
    : <span className="sc-eti">{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{eti}</span>;
  const dentro = <>
    {titolo && ico && <span className="lista-azione"><Segno nome={ico} /></span>}
    {corpo}
    {valore && <span className="sc-val">{valore}</span>}
    {coda}
    {mestiere === 'porta' && <span className="lista-chev"><Segno nome="chevronGiu" /></span>}
  </>;
  if (mestiere === 'ferma') {
    return <div className={cl('lista-riga', stretta, piu)} id={id}>{dentro}</div>;
  }
  return (
    <button className={cl('lista-riga', stretta, 'sc-tocca', piu)} id={id} type="button" onClick={onClick}>
      {dentro}
    </button>
  );
}

export function Campo({ eti, id, nome, valore, segnaposto, genere = 'text', righe, nota, spento, piu, onChange }) {
  const suo = id || nome;
  const comune = {
    id: suo, name: nome || suo, placeholder: segnaposto, disabled: spento,
    autoComplete: 'off', onChange
  };
  return <>
    <label className={cl('campo', piu)} htmlFor={suo}>{eti}</label>
    {righe
      ? <textarea {...comune} rows={righe} value={valore} />
      : <input {...comune} type={genere} value={valore} />}
    {nota && <p className="lista-nota">{nota}</p>}
  </>;
}

export function Pastiglie({ voci = [], scelta, id, piu, onScegli }) {
  return (
    <div className={cl('q-chips', piu)} id={id}>
      {voci.map((v) => (
        <button key={v.val} type="button"
          className={cl('q-chip', v.val === scelta && 'attivo')}
          onClick={() => onScegli && onScegli(v.val)}>
          {v.ico && <Segno nome={v.ico} />}{v.ico ? ' ' : ''}{v.eti}
        </button>
      ))}
    </div>
  );
}

/* fa una cosa E dice quale delle sue scelte è quella in vigore: la seconda
   metà si dimenticava a mano, e prove/clic.js la pretende */
export function Segmenti({ voci = [], scelta, id, etichetta, piu, onScegli }) {
  return (
    <span className={cl('segmenti', piu)} id={id} role="group" aria-label={etichetta}>
      {voci.map((v) => (
        <button key={v.val} type="button"
          className={v.val === scelta ? 'attivo' : undefined}
          onClick={() => onScegli && onScegli(v.val)}>
          {v.ico && <span className="seg-ico"><Segno nome={v.ico} dim={13} /></span>}{v.eti}
        </button>
      ))}
    </span>
  );
}

export function Statistica({ valore, eti, ico, piu }) {
  return (
    <div className={cl('stat', piu)}>
      <span className="stat-val">{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{valore}</span>
      <span className="stat-eti">{eti}</span>
    </div>
  );
}

/* uno stato vuoto dice due cose: che non c'è niente, e cosa farci. La seconda
   mancava in metà dei posti */
export function Niente({ titolo, dice, piu, children }) {
  return (
    <div className={cl('vuoto', piu)}>
      {titolo && <b>{titolo}</b>}
      {titolo && dice && <br />}
      {dice}
      {children}
    </div>
  );
}

const TONO = { normale: '', attenzione: 'nota-attenzione', pericolo: 'nota-pericolo' };
/* ------------------------------------------------------------------ LA TESTA
   La riga in cima a una schermata, identica a `topbar()` di app.js.

   Tre forme, e la differenza conta perché cambia l'albero:
     · se il nome sta già nella navigazione e non c'è altro, esce SOLO un
       <h1> per i lettori di schermo — niente contenitore;
     · se c'è un comando a destra ma il nome sta nella navigazione, la riga è
       una barra di strumenti, non una testa: `topbar-nuda`, respira meno;
     · se no titolo e sottotitolo dentro al loro <div>.
   Avvolgerla in un elemento in più è l'errore che prove/gemelle.js ha
   trovato per primo, due volte di fila. */
export function Testa({ titolo, sottotitolo, destra, piu, giaNellaNav }) {
  const h1 = <h1 className={giaNellaNav ? 'solo-lettori' : undefined}>{titolo}</h1>;
  if (giaNellaNav && !destra && !sottotitolo) return h1;
  return (
    <div className={cl('topbar', giaNellaNav && 'topbar-nuda', piu)}>
      {giaNellaNav ? h1 : (
        <div>
          {h1}
          {sottotitolo ? <div className="sottotitolo">{sottotitolo}</div> : null}
        </div>
      )}
      <div className="spazio" />
      {destra}
    </div>
  );
}

export function Nota({ piu, tono = 'normale', children }) {
  return <p className={cl('lista-nota', TONO[tono], piu)}>{children}</p>;
}

/* ==================================================================
   I MATTONI — le forme più piccole. Nel codice di prima lo stesso
   mestiere girava sotto fino a otto nomi diversi; l'elenco di cosa
   assorbe ciascuno sta in COMPONENTI.md.
   ================================================================== */

/* seg-ico · diario-ico · sm-porta-ico · rev-ico · fs-ico · lista-azione */
export function Icona({ nome, dim, piu }) {
  return <span className={cl('pz-segno', piu)}><Segno nome={nome} dim={dim} /></span>;
}
/* e `Segno` da solo, per quando l'SVG deve stare lì nudo */

/* sc-eti · lista-eti · imp-eti · agg-eti · stat-eti · som-eti · seg-eti · conc-eti */
export function Etichetta({ testo, ico, per, piu, children }) {
  const dentro = <>{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{testo}{children}</>;
  return per
    ? <label className={cl('sc-eti', piu)} htmlFor={per}>{dentro}</label>
    : <span className={cl('sc-eti', piu)}>{dentro}</span>;
}

/* sc-val · lista-val · stat-val · som-pc */
export function Valore({ testo, forte, piu, children }) {
  return <span className={cl('sc-val', forte && 'sc-val-forte', piu)}>{testo}{children}</span>;
}

/* lista-tit · sm-titolo · som-nome · bil-nome · ob-titolo */
export function Titolo({ testo, fatta, piu }) {
  return <span className={cl('lista-tit', fatta && 'fatta', piu)}>{testo}</span>;
}

/* riga-flex · exp-testa · focus-azioni-riga · abd-periodo — le prime due
   dichiaravano proprietà identiche al 100%: erano lo stesso pezzo due volte */
const SPAZIO = { fra: '', inizio: 'rf-inizio', fine: 'rf-fine' };
export function Fila({ spaziatura = 'fra', sopra, id, piu, children }) {
  return <div className={cl('riga-flex', SPAZIO[spaziatura], sopra, piu)} id={id}>{children}</div>;
}

/* fs-barra · bil-barra · ab-prog-barra */
export function Barra({ quota = 0, colore, alta, etichetta, piu }) {
  const q = Math.max(0, Math.min(1, Number(quota) || 0));
  return (
    <span className={cl('fs-barra', alta && 'fs-barra-alta', piu)}
      role="progressbar" aria-valuenow={Math.round(q * 100)} aria-valuemin={0} aria-valuemax={100}
      aria-label={etichetta}>
      <i style={{ width: (q * 100).toFixed(1) + '%', background: colore || undefined }} />
    </span>
  );
}
