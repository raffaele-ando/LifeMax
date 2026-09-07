/* I PEZZI — le forme piccole di cui è fatta ogni schermata.

   Questo file era il gemello di `assets/pezzi.js`: gli stessi nomi di
   proprietà, uno per uno, perché finché convivevano i due disegni della
   stessa schermata quello era il modo di non buttare il lavoro fatto in
   vanilla. Il gemello adesso non c'è più — di `pezzi.js` sono rimaste
   quattro funzioni di stringa in `pezzi/stringhe.ts`, quelle che `app.ts`
   usa per costruire HTML — e questi sono i pezzi, non «i pezzi di React».

   Le classi CSS restano quelle di `app.css`. `tipo` resta il RUOLO e mai il
   colore: la regola di DESIGN.md — uno pieno per schermata — vive qui
   dentro. */
/* PERCHÉ OGNI PROPRIETÀ FACOLTATIVA È SCRITTA `?: X | undefined`.
   Con `exactOptionalPropertyTypes` le due cose non sono la stessa: `?: X`
   vuol dire «o c'è con un valore X, o non c'è», e passare esplicitamente
   `undefined` è un errore. Ma qui le proprietà si passano PER TRAVERSO —
   un componente riceve `ico` che può non esserci e lo gira a `Segno` — e
   girare un `undefined` è normale. Le due forme si comportano allo stesso
   modo: se non c'è, il pezzo decide lui. */
import type { ReactNode, CSSProperties } from 'react';
import { ICO } from '../segni/segni';

/* L'ICONA, SENZA NIENTE ATTORNO.

   `segni.ts` è una funzione pura che restituisce dell'SVG, e sta benissimo
   dov'è. Ma infilare quell'SVG in pagina richiede un elemento che lo
   contenga, e uno <span> in più cambia l'albero: l'<svg> deve stare come
   FIGLIO DIRETTO del bottone.

   Quindi si smonta la stringa una volta sola — gli attributi del tag <svg> e
   quello che ha dentro — e si ridisegna un <svg> vero con gli stessi
   attributi. Fuori esce esattamente lo stesso elemento, senza involucro.
   Il conto si tiene: `ICO` per un nome e una misura dà sempre la stessa
   cosa, quindi si può ricordare il risultato. */
const ATTRIBUTO: Record<string, string> = {
  class: 'className', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule',
  'aria-hidden': 'aria-hidden'
};
interface Smontato { attributi: Record<string, string>; dentro: string }
const smontati = new Map<string, Smontato | null>();
function smonta(testo: string): Smontato | null {
  const gia = smontati.get(testo);
  if (gia !== undefined) return gia;
  const m = /^<svg([^>]*)>([\s\S]*)<\/svg>$/.exec(testo.trim());
  const fuori: Smontato | null = m
    ? {
        attributi: [...(m[1] || '').matchAll(/([\w-]+)="([^"]*)"/g)]
          .reduce<Record<string, string>>(function (o, a) {
            const nome = a[1] || '';
            o[ATTRIBUTO[nome] || nome] = a[2] || '';
            return o;
          }, {}),
        dentro: m[2] || ''
      }
    : null;
  smontati.set(testo, fuori);
  return fuori;
}

export function Segno({ nome, dim = 15, piu }: { nome?: string | undefined; dim?: number | undefined; piu?: string | undefined }) {
  if (!nome) return null;
  return <Disegno svg={ICO(nome, dim, piu)} />;
}

/* Un SVG che non viene da `ICO`: il marchio di Google, per dirne uno. Stessa
   smontatura, stessa ragione — dev'essere figlio diretto di chi lo contiene. */
export function Disegno({ svg }: { svg?: string | undefined }) {
  const p = svg ? smonta(svg) : null;
  if (!p) return null;
  return <svg {...p.attributi} dangerouslySetInnerHTML={{ __html: p.dentro }} />;
}

/* IL RUOLO, NON IL COLORE. Cinque, e sono cinque mestieri diversi: quello
   pieno è l'azione della schermata (una sola), il tonale la seconda, il
   quieto tutto il resto, `chiude` conferma un pannello, `pericolo` cancella. */
export type Ruolo = 'pieno' | 'tonale' | 'quieto' | 'chiude' | 'pericolo';
export type Misura = 'normale' | 'grande' | 'mini';
const RUOLO: Record<Ruolo, string> = {
  pieno: 'btn-primario', tonale: 'btn-tonale', quieto: '',
  chiude: 'btn-ok', pericolo: 'btn-pericolo'
};
const MISURA: Record<Misura, string> = { normale: '', grande: 'btn-grande', mini: 'btn-mini' };
const cl = (...a: (string | false | null | undefined)[]): string => a.filter(Boolean).join(' ');

/* `dati` sono gli attributi in più — i `data-` da cui dipende un comando.
   Il gemello in vanilla ce li ha avuti da sempre; di qua mancavano, e la
   prima volta che sono serviti la strada breve era riscrivere il tasto a
   mano. È così che una forma scritta a mano si moltiplica. */
export interface PropTasto {
  testo?: ReactNode | undefined;
  ico?: string | undefined;
  tipo?: Ruolo | undefined;
  misura?: Misura | undefined;
  sotto?: ReactNode | undefined;
  id?: string | undefined;
  /* un tasto che porta altrove è un <a>, non un <button>: la differenza la
     sentono la tastiera e il tasto destro, non solo i lettori di schermo */
  via?: string | undefined;
  spento?: boolean | undefined;
  etichetta?: string | undefined;
  piu?: string | undefined;
  dati?: Record<string, string> | undefined;
  onClick?: () => void | undefined;
}
export function Tasto({ testo, ico, tipo = 'quieto', misura = 'normale', sotto, id, via, spento, etichetta, piu, dati, onClick }: PropTasto) {
  const dentro = <>
    {ico && <Segno nome={ico} />}{ico && testo ? ' ' : ''}{testo}
    {sotto && <small>{sotto}</small>}
  </>;
  const classe = cl('btn', RUOLO[tipo], MISURA[misura], piu);
  if (via) return <a className={classe} href={via} id={id} aria-label={etichetta} {...(dati || {})}>{dentro}</a>;
  return (
    <button className={classe} id={id} type="button" disabled={spento} aria-label={etichetta}
      {...(dati || {})} onClick={onClick}>
      {dentro}
    </button>
  );
}

export function Scheda({ titolo, sotto, ico, id, piu, children }: { titolo?: ReactNode | undefined; sotto?: ReactNode | undefined; ico?: string | undefined; id?: string | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  return (
    <div className={cl('card', piu)} id={id}>
      {titolo && <h2 className="card-tit">{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{titolo}</h2>}
      {sotto && <div className="sotto">{sotto}</div>}
      {children}
    </div>
  );
}

export function Elenco({ id, piu, children }: { id?: string | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  return <div className={cl('lista', piu)} id={id}>{children}</div>;
}

/* tre mestieri, e la differenza si vede:
     porta  ti porta altrove       → freccetta
     fa     fa una cosa adesso     → niente freccetta, non si va via
     ferma  si legge e basta       → non è un bottone                     */
export type Mestiere = 'porta' | 'fa' | 'ferma';
export interface PropRiga {
  mestiere?: Mestiere | undefined;
  eti?: ReactNode | undefined;
  titolo?: ReactNode | undefined;
  sotto?: ReactNode | undefined;
  ico?: string | undefined;
  valore?: ReactNode | undefined;
  id?: string | undefined;
  piu?: string | undefined;
  coda?: ReactNode | undefined;
  onClick?: () => void | undefined;
}
export function Riga({ mestiere = 'fa', eti, titolo, sotto, ico, valore, id, piu, coda, onClick }: PropRiga) {
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

export interface PropCampo {
  eti?: ReactNode | undefined;
  id?: string | undefined;
  nome?: string | undefined;
  valore?: string | undefined;
  segnaposto?: string | undefined;
  genere?: string | undefined;
  righe?: number | undefined;
  nota?: ReactNode | undefined;
  spento?: boolean | undefined;
  piu?: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void | undefined;
}
export function Campo({ eti, id, nome, valore, segnaposto, genere = 'text', righe, nota, spento, piu, onChange }: PropCampo) {
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

/* una voce di una fila di scelte: il valore che rappresenta, cosa c'è
   scritto, e il segno davanti quando ce l'ha */
export interface Voce { val: string; eti: ReactNode; ico?: string | undefined }

export function Pastiglie({ voci = [], scelta, id, piu, onScegli }: { voci?: Voce[] | undefined; scelta?: string | undefined; id?: string | undefined; piu?: string | undefined; onScegli?: (v: string) => void | undefined }) {
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
export function Segmenti({ voci = [], scelta, id, etichetta, piu, onScegli }: { voci?: Voce[] | undefined; scelta?: string | undefined; id?: string | undefined; etichetta?: string | undefined; piu?: string | undefined; onScegli?: (v: string) => void | undefined }) {
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

export function Statistica({ valore, eti, ico, piu }: { valore?: ReactNode | undefined; eti?: ReactNode | undefined; ico?: string | undefined; piu?: string | undefined }) {
  return (
    <div className={cl('stat', piu)}>
      <span className="stat-val">{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{valore}</span>
      <span className="stat-eti">{eti}</span>
    </div>
  );
}

/* uno stato vuoto dice due cose: che non c'è niente, e cosa farci. La seconda
   mancava in metà dei posti */
export function Niente({ titolo, dice, piu, children }: { titolo?: ReactNode | undefined; dice?: ReactNode | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  return (
    <div className={cl('vuoto', piu)}>
      {titolo && <b>{titolo}</b>}
      {titolo && dice && <br />}
      {dice}
      {children}
    </div>
  );
}

export type Tono = 'normale' | 'attenzione' | 'pericolo';
const TONO: Record<Tono, string> = { normale: '', attenzione: 'nota-attenzione', pericolo: 'nota-pericolo' };

/* ------------------------------------------------------------------ LA TESTA
   La riga in cima a una schermata, identica a `topbar()` di `app.ts`.

   Tre forme, e la differenza conta perché cambia l'albero:
     · se il nome sta già nella navigazione e non c'è altro, esce SOLO un
       <h1> per i lettori di schermo — niente contenitore;
     · se c'è un comando a destra ma il nome sta nella navigazione, la riga è
       una barra di strumenti, non una testa: `topbar-nuda`, respira meno;
     · se no titolo e sottotitolo dentro al loro <div>.
   Avvolgerla in un elemento in più è l'errore che le prove hanno trovato per
   primo, due volte di fila. */
export function Testa({ titolo, sottotitolo, destra, piu, giaNellaNav }: { titolo?: ReactNode | undefined; sottotitolo?: ReactNode | undefined; destra?: ReactNode | undefined; piu?: string | undefined; giaNellaNav?: boolean | undefined }) {
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

export function Nota({ piu, tono = 'normale', children }: { piu?: string | undefined; tono?: Tono | undefined; children?: ReactNode | undefined }) {
  return <p className={cl('lista-nota', TONO[tono], piu)}>{children}</p>;
}

/* ==================================================================
   I MATTONI — le forme più piccole. Nel codice di prima lo stesso
   mestiere girava sotto fino a otto nomi diversi; l'elenco di cosa
   assorbe ciascuno sta in COMPONENTI.md.
   ================================================================== */

/* seg-ico · diario-ico · sm-porta-ico · rev-ico · fs-ico · lista-azione */
export function Icona({ nome, dim, piu }: { nome?: string | undefined; dim?: number | undefined; piu?: string | undefined }) {
  return <span className={cl('pz-segno', piu)}><Segno nome={nome} dim={dim} /></span>;
}
/* e `Segno` da solo, per quando l'SVG deve stare lì nudo */

/* sc-eti · lista-eti · imp-eti · agg-eti · stat-eti · som-eti · seg-eti · conc-eti */
export function Etichetta({ testo, ico, per, piu, children }: { testo?: ReactNode | undefined; ico?: string | undefined; per?: string | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  const dentro = <>{ico && <Segno nome={ico} />}{ico ? ' ' : ''}{testo}{children}</>;
  return per
    ? <label className={cl('sc-eti', piu)} htmlFor={per}>{dentro}</label>
    : <span className={cl('sc-eti', piu)}>{dentro}</span>;
}

/* sc-val · lista-val · stat-val · som-pc */
export function Valore({ testo, forte, piu, children }: { testo?: ReactNode | undefined; forte?: boolean | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  return <span className={cl('sc-val', forte && 'sc-val-forte', piu)}>{testo}{children}</span>;
}

/* lista-tit · sm-titolo · som-nome · bil-nome · ob-titolo */
export function Titolo({ testo, fatta, piu }: { testo?: ReactNode | undefined; fatta?: boolean | undefined; piu?: string | undefined }) {
  return <span className={cl('lista-tit', fatta && 'fatta', piu)}>{testo}</span>;
}

/* riga-flex · exp-testa · focus-azioni-riga · abd-periodo — le prime due
   dichiaravano proprietà identiche al 100%: erano lo stesso pezzo due volte */
export type Spaziatura = 'fra' | 'inizio' | 'fine';
const SPAZIO: Record<Spaziatura, string> = { fra: '', inizio: 'rf-inizio', fine: 'rf-fine' };
export function Fila({ spaziatura = 'fra', sopra, id, piu, children }: { spaziatura?: Spaziatura | undefined; sopra?: string | undefined; id?: string | undefined; piu?: string | undefined; children?: ReactNode | undefined }) {
  return <div className={cl('riga-flex', SPAZIO[spaziatura], sopra, piu)} id={id}>{children}</div>;
}

/* fs-barra · bil-barra · ab-prog-barra */
export function Barra({ quota = 0, colore, alta, etichetta, piu }: { quota?: number | undefined; colore?: string | undefined; alta?: boolean | undefined; etichetta?: string | undefined; piu?: string | undefined }) {
  const q = Math.max(0, Math.min(1, Number(quota) || 0));
  const stile: CSSProperties = { width: (q * 100).toFixed(1) + '%' };
  if (colore) stile.background = colore;
  return (
    <span className={cl('fs-barra', alta && 'fs-barra-alta', piu)}
      role="progressbar" aria-valuenow={Math.round(q * 100)} aria-valuemin={0} aria-valuemax={100}
      aria-label={etichetta}>
      <i style={stile} />
    </span>
  );
}
