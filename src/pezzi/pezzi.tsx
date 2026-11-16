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
import type { ReactNode } from 'react';
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
/* `grezzo` sta qui dentro insieme al resto, e non si costruisce al volo nel
   JSX: React confronta `dangerouslySetInnerHTML` per identità dell'oggetto,
   quindi un oggetto nuovo a ogni disegno vuol dire ri-analizzare l'SVG a
   ogni disegno. Su una schermata i segni sono decine, e i disegni sono
   tanti — è la stessa ragione per cui esiste `pezzi/grezzo`, applicata al
   posto in cui il conto si moltiplica di più. */
/* `style` NON È UN ATTRIBUTO COME GLI ALTRI, e scordarselo svuotava il Menu.
   In HTML è una stringa; React lo vuole come oggetto, e se riceve una
   stringa non la ignora: lancia (errore #62) e butta giù tutto il ramo che
   sta disegnando. Il marchio di Google porta `style="flex:none;
   vertical-align:-3px"`, e sta sul tasto «Accedi con Google» — cioè si
   disegna solo quando il cloud è raggiungibile e non hai fatto l'accesso.
   In quel caso, e solo in quello, il foglio «Menu» si apriva vuoto.
   Nessuna prova l'aveva mai visto perché dove girano le prove il cloud non
   si caricava: era un guasto che esisteva soltanto in produzione. */
function stile(testo: string): Record<string, string> {
  const o: Record<string, string> = {};
  testo.split(';').forEach(function (coppia) {
    const i = coppia.indexOf(':');
    if (i < 0) return;
    const nome = coppia.slice(0, i).trim().replace(/-([a-z])/g, function (_m, c: string) { return c.toUpperCase(); });
    const valore = coppia.slice(i + 1).trim();
    if (nome && valore) o[nome] = valore;
  });
  return o;
}
interface Smontato { attributi: Record<string, string | Record<string, string>>; grezzo: { __html: string } }
const smontati = new Map<string, Smontato | null>();
function smonta(testo: string): Smontato | null {
  const gia = smontati.get(testo);
  if (gia !== undefined) return gia;
  const m = /^<svg([^>]*)>([\s\S]*)<\/svg>$/.exec(testo.trim());
  const fuori: Smontato | null = m
    ? {
        attributi: [...(m[1] || '').matchAll(/([\w-]+)="([^"]*)"/g)]
          .reduce<Record<string, string | Record<string, string>>>(function (o, a) {
            const nome = a[1] || '';
            if (nome === 'style') o.style = stile(a[2] || '');
            else o[ATTRIBUTO[nome] || nome] = a[2] || '';
            return o;
          }, {}),
        grezzo: { __html: m[2] || '' }
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
  return <svg {...p.attributi} dangerouslySetInnerHTML={p.grezzo} />;
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


/* una voce di una fila di scelte: il valore che rappresenta, cosa c'è
   scritto, e il segno davanti quando ce l'ha */


/* fa una cosa E dice quale delle sue scelte è quella in vigore: la seconda
   metà si dimenticava a mano, e prove/clic.js la pretende */


/* uno stato vuoto dice due cose: che non c'è niente, e cosa farci. La seconda
   mancava in metà dei posti */


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


/* ==================================================================
   I MATTONI — le forme più piccole. Nel codice di prima lo stesso
   mestiere girava sotto fino a otto nomi diversi; l'elenco di cosa
   assorbe ciascuno sta in COMPONENTI.md.
   ================================================================== */

/* seg-ico · diario-ico · sm-porta-ico · rev-ico · fs-ico · lista-azione */
/* e `Segno` da solo, per quando l'SVG deve stare lì nudo */

/* sc-eti · lista-eti · imp-eti · agg-eti · stat-eti · som-eti · seg-eti · conc-eti */

/* sc-val · lista-val · stat-val · som-pc */

/* lista-tit · sm-titolo · som-nome · bil-nome · ob-titolo */

/* riga-flex · exp-testa · focus-azioni-riga · abd-periodo — le prime due
   dichiaravano proprietà identiche al 100%: erano lo stesso pezzo due volte */

/* fs-barra · bil-barra · ab-prog-barra */
