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
  if (quale) return { testo: etichettaGiorno(comeGiorno(quale)) };
  if (bers.hasAttribute('data-drop-ora')) {
    const gs = +(bers.getAttribute('data-gs') || ''), pxh = +(bers.getAttribute('data-pxh') || '');
    if (isNaN(gs) || !pxh) return { testo: '' };
    const r = bers.getBoundingClientRect();
    const min = Math.max(0, Math.round((gs + (y - r.top) / pxh * 60) / 15) * 15);
    return { testo: 'alle ' + fmtMin(min % 1440), min: min, top: (min - gs) / 60 * pxh, host: bers };
  }
  return { testo: '' };
}
function guida(ap: Anteprima | null): void {
  const gia = document.getElementById('trasc-guida');
  if (!ap || ap.top == null || !ap.host) { if (gia) gia.remove(); return; }
  let g = gia;
  if (!g || g.parentNode !== ap.host) {
    if (g) g.remove();
    g = document.createElement('div'); g.id = 'trasc-guida'; g.className = 'trasc-guida';
    g.innerHTML = '<span></span>';
    (ap.host.querySelector<HTMLElement>('.tl-blocks') || ap.host).appendChild(g);
  }
  g.style.top = ap.top + 'px';
  presa(g.querySelector<HTMLElement>('span')).textContent = fmtMin((ap.min ?? 0) % 1440);
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
export function abilitaTrascina(scope: ParentNode, onRilascio: (id: string, bersaglio: HTMLElement, x: number, y: number) => void): void {
  scope.querySelectorAll<HTMLElement>('[data-drag-az]').forEach(function (el) {
    el.addEventListener('pointerdown', function (ev) {
      if (ev.button > 0) return;
      const bersaglio = ev.target as HTMLElement | null;
      if (!bersaglio) return;
      const btnDentro = bersaglio.closest('button');
      if (btnDentro && btnDentro !== el && el.contains(btnDentro)) return;  /* i pulsanti interni restano cliccabili */
      const id: string = el.getAttribute('data-drag-az') || '';
      if (!id) return;
      const x0 = ev.clientX, y0 = ev.clientY;
      const tocco = ev.pointerType === 'touch';
      const manico = el.matches('[data-manico]') ? el : el.querySelector<HTMLElement>('[data-manico]');
      const dalManico = !!(manico && (bersaglio === manico || manico.contains(bersaglio) || bersaglio.closest('[data-manico]')));
      /* Col dito, se l'elemento ha un manico si prende SOLO da lì: toccando
         il corpo il browser vorrebbe selezionare il testo (era il bug) e la
         pagina deve restare scorribile. Preso dal manico l'intenzione è
         chiara, quindi parte subito senza tenere premuto. */
      if (tocco && manico && !dalManico) return;
      let attesa: ReturnType<typeof setTimeout> | undefined;
      let spostato = false, morto = false;

      /* col dito il browser vuole scorrere la pagina: dopo il "tieni premuto"
         blocchiamo lo scorrimento, altrimenti il gesto ci viene strappato. */
      function bloccaTouch(e: TouchEvent) { if (trasc) e.preventDefault(); }

      function avvia() {
        if (morto || trasc) return;
        const r = el.getBoundingClientRect();
        const f = document.createElement('div');
        f.className = 'trasc-fantasma';
        f.innerHTML = '<b></b><i></i>';
        presa(f.querySelector<HTMLElement>('b')).textContent = (el.getAttribute('title') || el.textContent || '').trim().slice(0, 44);
        f.style.width = Math.min(280, Math.max(150, r.width)) + 'px';
        document.body.appendChild(f);
        trasc = { id: id, fantasma: f, bersaglio: null, el: el };
        el.classList.add('sto-prendendo');
        document.body.classList.add('sto-trascinando');
        try { el.setPointerCapture(ev.pointerId); } catch { /* niente cattura: si va avanti */ }
        document.addEventListener('touchmove', bloccaTouch, { passive: false });
        muovi(x0, y0);
      }
      function muovi(x: number, y: number) {
        if (!trasc) return;
        trasc.fantasma.style.left = x + 'px';
        trasc.fantasma.style.top = y + 'px';
        const b = bersaglioSotto(x, y);
        evidenzia(b);
        const ap = anteprima(b, y);
        presa(trasc.fantasma.querySelector<HTMLElement>('i')).textContent = ap.testo;
        trasc.fantasma.classList.toggle('pronto', !!b);
        guida(ap);
      }
      function onMove(e: PointerEvent) {
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (!trasc) {
          /* soglia generosa: un clic con la mano un po' mossa NON deve
             diventare un trascinamento (era la causa dei "pulsanti che non
             funzionano": il clic finiva in uno spostamento). */
          if (tocco) { if (Math.abs(dx) + Math.abs(dy) > 16) { morto = true; clearTimeout(attesa); } return; }
          if (dalManico && Math.abs(dx) + Math.abs(dy) > 4) { avvia(); if (!trasc) return; }
          if (Math.abs(dx) + Math.abs(dy) < 14) return;
          avvia();
          if (!trasc) return;
        }
        spostato = true;
        e.preventDefault();
        muovi(e.clientX, e.clientY);
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
        document.removeEventListener('touchmove', bloccaTouch);
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
      else if (tocco) attesa = setTimeout(function () { avvia(); spostato = true; }, 260);
    });
  });
}

