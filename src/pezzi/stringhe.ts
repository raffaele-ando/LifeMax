/* LE QUATTRO FUNZIONI CHE RESTANO DI `pezzi.js`.

   `assets/pezzi.js` era la libreria dei pezzi in versione stringa: diciotto
   forme dell'interfaccia che tornavano HTML da infilare con `innerHTML`.
   Aveva un gemello in React (`react/src/pezzi.jsx`), e una prova che li
   confrontava uno per uno — diciotto contro diciotto.

   IN UN'APP TUTTA REACT QUELLA LIBRERIA NON HA PIÙ UN MESTIERE: i pezzi sono
   componenti, e una seconda copia di ognuno che produce stringhe è
   esattamente il «due posti dove una regola può essere diversa» che il resto
   di questa riscrittura serve a togliere.

   Restano queste quattro, e per un motivo preciso: dentro `app.ts` ci sono
   ancora dei costruttori di HTML — il pannello delle impostazioni, il corpo
   dei rituali, le righe di Attività — che React chiama e infila con
   `dangerouslySetInnerHTML`. Finché esistono, `esc` deve esistere: il testo
   che arriva da fuori non entra mai crudo in una stringa di HTML.  */

/* Il testo che arriva da fuori non entra mai crudo in una stringa di HTML. */
export function esc(s: unknown): string {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* attributi facoltativi: se il valore non c'è, l'attributo non si scrive.
   Senza questo, mezzo file si riempie di `(x ? ' id="' + x + '"' : '')`. */
export function att(nome: string, val: unknown): string {
  return (val === undefined || val === null || val === false || val === '') ? ''
    : ' ' + nome + '="' + esc(val) + '"';
}

export function classi(...pezzi: (string | false | null | undefined)[]): string {
  return pezzi.filter(Boolean).join(' ');
}

/* RIGA DI ELENCO. Tre mestieri diversi, e la differenza si vede:
     'porta'   ti porta altrove          → ha la freccetta
     'fa'      fa una cosa adesso        → non ce l'ha, perché non si va via
     'ferma'   non fa niente, si legge   → non è un bottone                */
/* I CAMPI FACOLTATIVI DICONO ANCHE `undefined`, e non è una formalità.
   Con `exactOptionalPropertyTypes` un campo `valore?: string` accetta di non
   esserci, ma rifiuta un `valore: undefined` scritto a mano — e i chiamanti
   qui fanno proprio quello, perché passano una variabile che può non avere un
   valore. La distinzione ha senso dove «assente» e «vuoto» sono due cose
   diverse; qui non lo sono: una riga senza valore e una riga col valore
   assente si disegnano identiche. */
export interface OpzRiga {
  mestiere?: 'porta' | 'fa' | 'ferma';
  id?: string | undefined;
  ico?: string | undefined;
  eti?: string | undefined;
  titolo?: string | undefined;
  sotto?: string | undefined;
  valore?: string | undefined;
  coda?: string | undefined;
  piu?: string | undefined;
  dati?: string | undefined;
}

export function riga(o: OpzRiga, segno: (nome?: string, dim?: number) => string): string {
  const corpo = o.titolo
    ? '<span class="lista-corpo"><span class="lista-tit">' + esc(o.titolo) + '</span>' +
      (o.sotto ? '<span class="lista-sub">' + esc(o.sotto) + '</span>' : '') + '</span>'
    : '<span class="sc-eti">' + segno(o.ico) + (o.ico ? ' ' : '') + esc(o.eti || '') + '</span>';
  const dentro = (o.titolo && o.ico ? '<span class="lista-azione">' + segno(o.ico) + '</span>' : '') +
    corpo +
    (o.valore ? '<span class="sc-val">' + esc(o.valore) + '</span>' : '') +
    (o.coda || '') +
    (o.mestiere === 'porta' ? '<span class="lista-chev">' + segno('chevronGiu') + '</span>' : '');
  /* `sc-riga` è la riga più fitta che si usa dentro ai pannelli, ed è
     sempre e solo quella in forma «etichetta + valore»: si mette da sé
     invece di doversela ricordare a ogni chiamata. */
  const stretta = o.eti !== undefined ? 'sc-riga' : '';
  if (o.mestiere === 'ferma') {
    return '<div class="' + classi('lista-riga', stretta, o.piu) + '"' + att('id', o.id) + '>' + dentro + '</div>';
  }
  /* `sc-tocca` senza condizione: qui ci si arriva solo se il mestiere NON è
     «ferma» — quel ramo è tornato tre righe sopra. Nel file di prima la
     classe si calcolava PRIMA del controllo e portava dietro un
     `o.mestiere !== 'ferma' ? ... : ''` che a questo punto è sempre vero.
     L'ha detto il compilatore: «questi due tipi non si toccano». */
  const cl = classi('lista-riga', stretta, 'sc-tocca', o.piu);
  return '<button class="' + cl + '"' + att('id', o.id) + ' type="button"' + (o.dati || '') + '>' +
    dentro + '</button>';
}
