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

/* l'icona la disegna ancora icons.js, che non si porta dentro React: è una
   funzione pura che restituisce dell'SVG, e va benissimo dov'è */
function Segno({ nome, dim = 15 }) {
  if (!nome || typeof window.ICO !== 'function') return null;
  return <span className="pz-ico" dangerouslySetInnerHTML={{ __html: window.ICO(nome, dim) }} />;
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

export function Nota({ piu, children }) {
  return <p className={cl('lista-nota', piu)}>{children}</p>;
}
