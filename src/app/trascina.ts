/* IL TRASCINAMENTO — mouse, dito e penna, con lo stesso codice.

   Fuori da `app.ts` perché è un pezzo che non sa niente dell'app: non legge i
   dati, non disegna schermate, non sa che cosa sta spostando. Sa che c'è un
   elemento sotto il dito, che c'è un bersaglio da qualche parte, e chiama
   una funzione dicendo «questo è finito là». Chi lo chiama decide cosa vuol
   dire. Misurato prima di tagliare: da duecento righe usciva UN nome solo
   verso il resto del file, `presa`, che è l'asserzione documentata del
   progetto — e verso l'interno, `abilitaTrascina` chiamata da tre punti.

   COME SI DISTINGUE UN TRASCINAMENTO DA UN TOCCO, e il resto:
   Non usiamo il drag&drop nativo di HTML: sui touch non esiste, quindi da
   telefono e iPad non funzionava. Qui lo facciamo con gli eventi puntatore,
   che valgono per tutti i dispositivi.
   Come si distingue un trascinamento da un tocco: col mouse basta muoversi
   di 6px; col dito serve tenere premuto ~220ms (altrimenti la pagina non si
   potrebbe più scorrere).
   I bersagli si dichiarano con attributi, così ogni vista può offrire i suoi:
     data-drop-giorno="AAAA-MM-GG"  → sposta in quel giorno
     data-drop-ora="1"              → dà l'ora corrispondente al punto
     data-drop-senzaora="1"         → toglie l'orario                        */
import { presa } from '../tipi/presa';
import { giorno as comeGiorno } from '../tipi/stato';
import { fmtMin, etichettaGiorno } from './tempo';

/* IL TRASCINAMENTO IN CORSO: cosa si sta portando, da dove è partito, e
   l'etichetta che segue il dito. Era `null` più otto campi scritti a mano nel
   punto in cui il gesto comincia. */
interface Trascinamento {
  id: string;
  /* da dove è partito: si spegne il suo «sto prendendo» alla fine */
  el: HTMLElement;
  fantasma: HTMLElement;
  bersaglio: HTMLElement | null;
}
let trasc: Trascinamento | null = null;

function bersaglioSotto(x: number, y: number): HTMLElement | null {
  let el = document.elementFromPoint(x, y) as HTMLElement | null;
  while (el && el !== document.body) {
    if (el.hasAttribute && (el.hasAttribute('data-drop-giorno') || el.hasAttribute('data-drop-ora') || el.hasAttribute('data-drop-senzaora'))) return el;
    el = el.parentElement;
  }
  return null;
}
/* Dove finirà la cosa: lo diciamo a parole nell'etichetta che segue il dito,
   e sulla griglia mostriamo anche una riga all'ora esatta. Senza questo si
   trascinava "alla cieca". */
/* DOVE FINIRÀ LA COSA: le parole per l'etichetta, e — solo sulla griglia —
   l'ora esatta con la riga da disegnare. `min`, `top` e `host` ci sono in un
   caso su quattro, ed era un oggetto senza forma con tre campi facoltativi. */
interface Anteprima {
  testo: string;
  min?: number;
  top?: number;
  host?: HTMLElement;
}
function anteprima(bers: HTMLElement | null, y: number): Anteprima {
  if (!bers) return { testo: 'Lascia su un giorno o su un’ora' };
  if (bers.hasAttribute('data-drop-senzaora')) return { testo: 'Senza orario' };
  const quale = bers.getAttribute('data-drop-giorno');
  if (quale) {
    const gr = bers.querySelector<HTMLElement>('[data-pxh]') || bers.closest<HTMLElement>('[data-pxh]');
    if (gr) {
      const gs = +(gr.getAttribute('data-gs') || ''), pxh = +(gr.getAttribute('data-pxh') || '');
      const r = gr.getBoundingClientRect();
      if (!isNaN(gs) && pxh && y >= r.top && y <= r.bottom) {
        const min = Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15);
        return { testo: etichettaGiorno(comeGiorno(quale)) + ', ' + fmtMin(min % 1440), min: min, top: (min - gs) / 60 * pxh, host: gr };
      }
    }
    return { testo: etichettaGiorno(comeGiorno(quale)) };
  }
  if (bers.hasAttribute('data-drop-ora')) {
    const gs = +(bers.getAttribute('data-gs') || ''), pxh = +(bers.getAttribute('data-pxh') || '');
    if (isNaN(gs) || !pxh) return { testo: '' };
    const r = bers.getBoundingClientRect();
    const min = Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15);
    return { testo: 'alle ' + fmtMin(min % 1440), min: min, top: (min - gs) / 60 * pxh, host: bers };
  }
  return { testo: '' };
}
/* dove finirà: uno spazio della sua durata, all'ora esatta, con l'orario */
let durTrasc = 30;
function guida(ap: Anteprima | null): void {
  const gia = document.getElementById('trasc-guida');
  if (!ap || ap.top == null || !ap.host) { if (gia) gia.remove(); return; }
  let g = gia;
  if (!g || g.parentNode !== (ap.host.querySelector<HTMLElement>('.tl-blocks') || ap.host)) {
    if (g) g.remove();
    g = document.createElement('div'); g.id = 'trasc-guida'; g.className = 'trasc-guida';
    g.innerHTML = '<span></span>';
    (ap.host.querySelector<HTMLElement>('.tl-blocks') || ap.host).appendChild(g);
  }
  const pxh = +(ap.host.getAttribute('data-pxh') || '60') || 60;
  g.style.top = ap.top + 'px';
  g.style.height = Math.max(14, durTrasc / 60 * pxh) + 'px';
  const m = (ap.min ?? 0) % 1440;
  presa(g.querySelector<HTMLElement>('span')).textContent = fmtMin(m) + '–' + fmtMin((m + durTrasc) % 1440);
}
/* LO SCORRIMENTO DA SOLO: col dito vicino al bordo alto o basso la pagina
   scorre, così si porta una cosa dove non si vede ancora */
let ultimoX = 0, ultimoY = 0, giroScorri = 0;
function scorriAiBordi(): void {
  if (!trasc) { giroScorri = 0; return; }
  const alto = 120, basso = innerHeight - 150;
  let v = 0;
  if (ultimoY < alto) v = -Math.ceil((alto - ultimoY) / 6);
  else if (ultimoY > basso) v = Math.ceil((ultimoY - basso) / 6);
  if (v) { window.scrollBy(0, Math.max(-24, Math.min(24, v))); porta(ultimoX, ultimoY); }
  giroScorri = requestAnimationFrame(scorriAiBordi);
}
function evidenzia(el: HTMLElement | null): void {
  if (trasc && trasc.bersaglio === el) return;
  if (trasc && trasc.bersaglio) trasc.bersaglio.classList.remove('drop-attivo');
  if (trasc) trasc.bersaglio = el;
  if (el) el.classList.add('drop-attivo');
}
function fineTrascina(): void {
  if (!trasc) return;
  if (trasc.bersaglio) trasc.bersaglio.classList.remove('drop-attivo');
  if (trasc.fantasma && trasc.fantasma.parentNode) trasc.fantasma.parentNode.removeChild(trasc.fantasma);
  trasc.el.classList.remove('sto-prendendo');
  guida(null);
  document.body.classList.remove('sto-trascinando');
  trasc = null;
}

/* onRilascio(id, bersaglio, x, y) */
/* COL DITO SI USANO GLI EVENTI DI TOCCO. Con quelli di puntatore, su
   Android, appena il dito si muove il browser decide che è uno scorrimento,
   manda `pointercancel` e il trascinamento muore senza aver fatto niente:
   si teneva premuto e non succedeva nulla. Gli eventi di tocco continuano ad
   arrivare all'elemento da cui sono partiti, e fermando `touchmove` la pagina
   non scorre. */
document.addEventListener('contextmenu', function (e) {
  const t = e.target as HTMLElement | null;
  if (trasc || (t && t.closest && t.closest('[data-drag-az], [data-drag-ab]'))) e.preventDefault();
});
/* il trascinamento NATIVO del browser (l'anteprima grigia che segue il dito
   dopo una pressione lunga) si porta via il gesto: qui non serve mai */
document.addEventListener('dragstart', function (e) {
  const t = e.target as HTMLElement | null;
  if (t && t.closest && t.closest('[data-drag-az], [data-drag-ab]')) e.preventDefault();
});

/* chi si trascina: un'attività ha il suo id; un'abitudine porta anche il
   giorno da cui parte, perché si sposta solo in quel giorno */
function idDi(el: HTMLElement): string {
  const az = el.getAttribute('data-drag-az');
  if (az) return az;
  const ab = el.getAttribute('data-drag-ab');
  return ab ? 'ab:' + ab + ':' + (el.getAttribute('data-drag-k') || '') : '';
}

function prendi(el: HTMLElement, id: string, x: number, y: number): void {
  if (trasc) return;
  const r = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'trasc-fantasma';
  f.innerHTML = '<b></b><i></i>';
  const nomeEl = el.querySelector<HTMLElement>('.tl-blk-t, .gio-so-testo, .lista-tit');
  presa(f.querySelector<HTMLElement>('b')).textContent = (el.getAttribute('title') || (nomeEl && nomeEl.textContent) || el.textContent || '').trim().slice(0, 44);
  f.style.width = Math.min(260, Math.max(160, r.width)) + 'px';
  document.body.appendChild(f);
  durTrasc = +(el.getAttribute('data-dur') || '') || 30;
  trasc = { id: id, fantasma: f, bersaglio: null, el: el };
  if (!giroScorri) giroScorri = requestAnimationFrame(scorriAiBordi);
  el.classList.add('sto-prendendo');
  document.body.classList.add('sto-trascinando');
  if (navigator.vibrate) navigator.vibrate(12);
  porta(x, y);
}
function porta(x: number, y: number): void {
  if (!trasc) return;
  ultimoX = x; ultimoY = y;
  const w = trasc.fantasma.offsetWidth || 200;
  trasc.fantasma.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + 'px';
  trasc.fantasma.style.top = Math.max(8, y - 84) + 'px';
  const b = bersaglioSotto(x, y);
  evidenzia(b);
  const ap = anteprima(b, y);
  presa(trasc.fantasma.querySelector<HTMLElement>('i')).textContent = ap.testo;
  trasc.fantasma.classList.toggle('pronto', !!b);
  guida(ap);
}
function colDito(el: HTMLElement, onRilascio: (id: string, bersaglio: HTMLElement, x: number, y: number) => void): void {
  let attesa: ReturnType<typeof setTimeout> | undefined;
  let x0 = 0, y0 = 0, mio = false;
  el.addEventListener('touchstart', function (ev) {
    if (ev.touches.length !== 1 || trasc) return;
    const bers = ev.target as HTMLElement | null;
    if (!bers) return;
    const btn = bers.closest('button');
    if (btn && btn !== el && el.contains(btn)) return;
    const id = idDi(el);
    if (!id) return;
    const t = presa(ev.touches[0]);
    x0 = t.clientX; y0 = t.clientY; mio = false;
    const manico = el.matches('[data-manico]') ? el : el.querySelector<HTMLElement>('[data-manico]');
    const dalManico = !!(manico && (bers === manico || manico.contains(bers)));
    clearTimeout(attesa);
    /* dal manico parte quasi subito; dal corpo tenendo premuto un attimo */
    attesa = setTimeout(function () { mio = true; prendi(el, id, x0, y0); }, dalManico ? 90 : 280);
  }, { passive: true });
  el.addEventListener('touchmove', function (ev) {
    const t = ev.touches[0];
    if (!t) return;
    if (!mio) {
      if (Math.abs(t.clientX - x0) + Math.abs(t.clientY - y0) > 10) clearTimeout(attesa);
      return;
    }
    if (ev.cancelable) ev.preventDefault();
    porta(t.clientX, t.clientY);
  }, { passive: false });
  const fine = function (ev: TouchEvent): void {
    clearTimeout(attesa);
    if (!mio) return;
    mio = false;
    const t = ev.changedTouches[0];
    if (!trasc) return;
    const x = t ? t.clientX : x0, y = t ? t.clientY : y0;
    const b = ev.type === 'touchend' ? bersaglioSotto(x, y) : null;
    const idFin = trasc.id;
    fineTrascina();
    /* il clic che il browser manda dopo il rilascio non deve aprire niente */
    const ingoia = function (ce: Event) { ce.stopPropagation(); ce.preventDefault(); };
    window.addEventListener('click', ingoia, true);
    setTimeout(function () { window.removeEventListener('click', ingoia, true); }, 350);
    if (b) onRilascio(idFin, b, x, y);
  };
  el.addEventListener('touchend', fine);
  el.addEventListener('touchcancel', fine);
}

export function abilitaTrascina(scope: ParentNode, onRilascio: (id: string, bersaglio: HTMLElement, x: number, y: number) => void): void {
  scope.querySelectorAll<HTMLElement>('[data-drag-az], [data-drag-ab]').forEach(function (el) {
    colDito(el, onRilascio);
    el.addEventListener('pointerdown', function (ev) {
      if (ev.button > 0 || ev.pointerType === 'touch') return;
      const bersaglio = ev.target as HTMLElement | null;
      if (!bersaglio) return;
      const btnDentro = bersaglio.closest('button');
      if (btnDentro && btnDentro !== el && el.contains(btnDentro)) return;  /* i pulsanti interni restano cliccabili */
      const id: string = idDi(el);
      if (!id) return;
      const x0 = ev.clientX, y0 = ev.clientY;
      const tocco = ev.pointerType === 'touch';
      const manico = el.matches('[data-manico]') ? el : el.querySelector<HTMLElement>('[data-manico]');
      const dalManico = !!(manico && (bersaglio === manico || manico.contains(bersaglio) || bersaglio.closest('[data-manico]')));
      /* Col dito, se l'elemento ha un manico si prende SOLO da lì: toccando
         il corpo il browser vorrebbe selezionare il testo (era il bug) e la
         pagina deve restare scorribile. Preso dal manico l'intenzione è
         chiara, quindi parte subito senza tenere premuto. */
      /* dal corpo, col dito, si prende tenendo premuto un attimo: è il gesto
         di ogni calendario. Dal manico parte subito. */
      let attesa: ReturnType<typeof setTimeout> | undefined;
      let spostato = false, morto = false;

      /* col dito il browser vuole scorrere la pagina: dopo il "tieni premuto"
         blocchiamo lo scorrimento, altrimenti il gesto ci viene strappato. */

      function avvia() {
        if (morto || trasc) return;
        prendi(el, id, x0, y0);
        try { el.setPointerCapture(ev.pointerId); } catch { /* niente cattura: si va avanti */ }
      }
      function onMove(e: PointerEvent) {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!trasc) {
          /* soglia generosa: un clic con la mano un po' mossa NON deve
             diventare un trascinamento (era la causa dei "pulsanti che non
             funzionano": il clic finiva in uno spostamento). */
          if (tocco) { if (Math.abs(dx) + Math.abs(dy) > 12) { morto = true; clearTimeout(attesa); } return; }
          if (dalManico && Math.abs(dx) + Math.abs(dy) > 4) { avvia(); if (!trasc) return; }
          if (Math.abs(dx) + Math.abs(dy) < 14) return;
          avvia();
          if (!trasc) return;
        }
        spostato = true;
        e.preventDefault();
        porta(e.clientX, e.clientY);
      }
      function onUp(e: PointerEvent) {
        clearTimeout(attesa);
        let fatto = false;
        if (trasc && spostato) {
          const b = bersaglioSotto(e.clientX, e.clientY);
          const idFin = trasc.id;
          fineTrascina();
          if (b) { fatto = true; onRilascio(idFin, b, e.clientX, e.clientY); }
        }
        /* il clic va ingoiato SOLO se abbiamo davvero spostato qualcosa,
           altrimenti si bloccherebbero i clic normali */
        if (fatto) {
          const ingoia = function (ce: Event) { ce.stopPropagation(); ce.preventDefault(); };
          window.addEventListener('click', ingoia, true);
          setTimeout(function () { window.removeEventListener('click', ingoia, true); }, 350);
        }
        pulisci();
      }
      function pulisci() {
        clearTimeout(attesa);
        fineTrascina();
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', suCancel);
      }
      /* se il gesto viene annullato PRIMA di iniziare (il browser ha deciso
         che era uno scorrimento) lasciamo perdere; se il trascinamento è già
         partito lo teniamo: abbiamo la cattura del puntatore. */
      function suCancel() { if (!trasc) { morto = true; pulisci(); } }

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', suCancel);
      if (tocco && dalManico) { ev.preventDefault(); avvia(); }
      else if (tocco) attesa = setTimeout(function () { avvia(); spostato = true; if (navigator.vibrate) navigator.vibrate(12); }, 220);
    });
  });
}

