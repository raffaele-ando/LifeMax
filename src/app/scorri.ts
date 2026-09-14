/* SCORRERE DI LATO PER CAMBIARE SCHERMATA — fuori da `app.ts`.

   Il gesto non conosce nessuna schermata, e adesso non conosce nemmeno
   l'app. L'unica cosa che gli serviva da fuori era saper rispondere a «c'è
   qualcosa aperto sopra?» — un pannello, un avviso, l'onboarding — e quella
   risposta gliela passa `app.ts` all'avvio, invece di andarsela a prendere.
   È la differenza fra un pezzo che si può leggere da solo e un pezzo che
   per capirlo bisogna avere in mente tutto il resto.

   Gli ascoltatori si attaccano quando `avviaScorrimento()` viene chiamata, e
   non al primo import: un file che fa cose solo perché qualcuno lo nomina è
   un file che non si può leggere due volte senza sorprese. */
import { LM } from '../dati/dati';
import { presa } from '../tipi/presa';

/* c'è qualcosa aperto sopra la pagina? lo sa `app.ts`, che ce lo passa */
let cSopra: () => boolean = function () { return false; };
/* una volta sola: chiamarla due volte attaccherebbe due volte tutto */
let attaccati = false;

/* ============================================================
   COME FUNZIONA

   Il gesto non conosce nessuna schermata. Trova la riga di linguette della
   pagina in cui sei — quella che c'e' sempre, `.segmenti.sez-nav` — e
   preme la linguetta accanto a quella accesa. Cosi' vale per «Adesso · La
   giornata · Rituali» come per «Da sistemare · Da fare · Abitudini», senza
   sapere che le prime sono tre indirizzi e le seconde tre pannelli, e
   continuera' a valere per quelle che verranno.

   Il verso e' quello di tutti: il dito va a SINISTRA, il contenuto entra da
   destra, si va avanti. Come sfogliare.

   La parte difficile di un gesto cosi' non e' riconoscerlo: e' NON
   riconoscerlo quando non c'e'. Un'app che cambia schermata mentre provi a
   scorrere in basso diventa inservibile, e per una testa che corre e' peggio
   che inutile — perdi il posto in cui eri e non sai perche'. Quindi qui si
   rinuncia molto piu' spesso di quanto si accetti:

     · solo col dito. Col mouse un trascinamento e' una selezione di testo,
       e la barra delle linguette e' li' a un clic.
     · mai se sotto il dito c'e' qualcosa che scorre di lato per conto suo
       (le colonne della settimana, la griglia del mese, un grafico): quel
       gesto e' gia' suo. Si guarda tutta la catena dei genitori.
     · mai su un blocco che si trascina, su un campo, su un cursore.
     · mai con un pannello, un foglio o un avviso aperto: li' il gesto che
       conta e' quello che chiude.
     · mai partendo dai ventiquattro pixel del bordo: quelli sono del
       browser, che li usa per indietro e avanti. Litigarci vuol dire
       perdere tutte e due le volte.
     · e appena il dito scende piu' di quanto vada di lato, il gesto e'
       finito: era uno scorrimento, e non torna piu' a essere uno sfoglio.
       Questo e' il controllo che conta piu' di tutti gli altri.

   Le soglie: sessanta pixel di lato (un sesto di uno schermo da 390) con
   l'orizzontale che vale almeno una volta e mezza il verticale, oppure un
   colpo secco — venticinque pixel a piu' di mezzo pixel per millesimo di
   secondo. Il colpo secco serve perche' chi sfoglia in fretta non arriva mai
   a sessanta pixel: si ferma a trenta e stacca. Senza, il gesto sembra
   rotto proprio a chi lo usa di piu'.
   ============================================================ */
var SCORRI = {
  bordo: 24,      /* px dal bordo dello schermo che sono del browser */
  passo: 60,      /* px di lato perche' valga come sfoglio */
  /* VENTICINQUE E NON MENO. Sotto una certa distanza il browser considera
     il tocco ancora un tocco, e dopo `touchend` sintetizza un clic su
     quello che c'era sotto il dito: sfogliando sopra al tasto «Fatto» si
     cambierebbe schermata E si spunterebbe la cosa. Misurato su Chromium
     (`prove/scorri.js`): il clic arriva fino a 12px di spostamento e a 20
     non arriva piu'. Stando sopra quella soglia il problema non esiste e
     non serve nessuno che ingoi i clic — c'era, e non serviva a niente. */
  colpo: 25,      /* px, se e' un colpo secco */
  velocita: 0.5,  /* px al millisecondo perche' sia un colpo secco */
  quota: 1.5,     /* quante volte l'orizzontale deve battere il verticale */
  resa: 26,       /* px in verticale oltre i quali si rinuncia */
  tempo: 1000     /* ms: piu' lento di cosi' e' un trascinamento, non uno sfoglio */
};

function scorriAcceso() { return (LM.load().profilo || {}).scorri !== 'no'; }

/* la riga di linguette della pagina di adesso, e dove siamo dentro */
interface Lingue { voci: HTMLElement[]; qui: number }
function lingueDiPagina(): Lingue | null {
  var bar = document.querySelector<HTMLElement>('#vista .segmenti.sez-nav');
  if (!bar) return null;
  /* solo le linguette che si possono premere: quelle nascoste o spente non
     sono un posto dove lo sfoglio può portare */
  const voci = Array.from(bar.children).filter(function (c) {
    if (c.tagName !== 'A' && c.tagName !== 'BUTTON') return false;
    const el = c as HTMLElement & { disabled?: boolean };
    return !el.hidden && !el.disabled;
  }) as HTMLElement[];
  if (voci.length < 2) return null;
  var qui = voci.findIndex(function (x) { return x.classList.contains('attivo'); });
  if (qui < 0) return null;
  return { voci: voci, qui: qui };
}

/* qualcuno qui sotto scorre gia' di lato per conto suo? */
function scorreDiLato(el: Element | null): boolean {
  let n: Element | null = el;
  while (n && n !== document.body) {
    if (n.scrollWidth > n.clientWidth + 2) {
      var ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
    }
    n = n.parentElement;
  }
  return false;
}



/* CON GLI EVENTI TOUCH, NON CON QUELLI PUNTATORE. Non e' una preferenza:
   appena il browser capisce che il dito si muove dentro qualcosa che puo'
   scorrere, si prende il gesto e manda `pointercancel` — e da li' in poi
   `pointerup` non arriva piu'. Un gesto che finisce solo quando il browser
   e' d'accordo non finisce mai. La stessa cosa era gia' scritta, con le
   stesse parole, sopra al trascinamento del foglio: e ci sono ricascato
   lo stesso, e l'ha trovato la prova. Gli ascoltatori restano passivi:
   qui non c'e' niente da scorrere di lato, quindi non c'e' niente da
   impedire al browser, e un ascoltatore non passivo su `touchmove`
   rallenterebbe ogni scorrimento della pagina per un gesto raro. */
/* dov'è partito il dito, quando, e se il gesto è ancora uno sfoglio */
interface Sfoglio { x: number; y: number; t: number; vivo: boolean }
let sw: Sfoglio | null = null;

/* GLI ASCOLTATORI SI ATTACCANO QUI, e una volta sola. */
export function avviaScorrimento(qualcosaSopra: () => boolean): void {
  if (attaccati) return;
  attaccati = true;
  cSopra = qualcosaSopra;

  document.addEventListener('touchstart', function (ev) {
    sw = null;
    if (ev.touches.length !== 1) return;
    if (!scorriAcceso() || cSopra()) return;
    const d = presa(ev.touches[0]);
    if (d.clientX < SCORRI.bordo || d.clientX > innerWidth - SCORRI.bordo) return;
    var t = ev.target;
    if (!(t instanceof Element)) return;
    if (!t.closest('#vista')) return;
    if (t.closest('input, textarea, select, [contenteditable="true"], [data-drag-az], [data-drag-ab], [data-manico], .segmenti')) return;
    if (scorreDiLato(t)) return;
    if (!lingueDiPagina()) return;
    /* L'ORA DELL'EVENTO, NON QUELLA DEL GESTORE. `ev.timeStamp` e' il momento
       in cui il browser ha generato il tocco; `performance.now()` e' il
       momento in cui il gestore e' riuscito a girare, che con il thread
       principale occupato arriva anche cento millisecondi dopo. Misurando
       con il secondo, un colpo secco vero risulta lento e viene buttato via —
       e succede proprio quando la pagina e' impegnata, cioe' quando il gesto
       serve di piu'. */
    sw = { x: d.clientX, y: d.clientY, t: ev.timeStamp || performance.now(), vivo: true };
  }, { passive: true });

  document.addEventListener('touchmove', function (ev) {
    if (!sw || !sw.vivo) return;
    /* due dita non sono uno sfoglio: e' una pinzata */
    if (ev.touches.length !== 1) { sw.vivo = false; return; }
    const d = presa(ev.touches[0]);
    var dx = d.clientX - sw.x, dy = d.clientY - sw.y;
    /* IL DITO SCENDE: era uno scorrimento. Da qui in poi non si torna piu'
       indietro, nemmeno se dopo va tutto di lato — un gesto che comincia a
       scorrere e finisce sfogliando e' proprio quello che fa perdere il
       posto in cui si era. */
    if (Math.abs(dy) > SCORRI.resa && Math.abs(dy) > Math.abs(dx)) sw.vivo = false;
  }, { passive: true });

  document.addEventListener('touchend', function (ev) {
    var g = sw; sw = null;
    if (!g || !g.vivo) return;
    if (ev.touches.length) return;                 /* un dito e' rimasto giu' */
    if (cSopra()) return;
    var d = ev.changedTouches && ev.changedTouches[0];
    if (!d) return;
    var dx = d.clientX - g.x, dy = d.clientY - g.y;
    var quanto = Math.abs(dx), quando = (ev.timeStamp || performance.now()) - g.t;
    if (!(quando > 0)) quando = 1;
    if (quando > SCORRI.tempo) return;
    if (quanto < Math.abs(dy) * SCORRI.quota) return;
    var colpoSecco = quanto >= SCORRI.colpo && (quanto / Math.max(1, quando)) >= SCORRI.velocita;
    if (quanto < SCORRI.passo && !colpoSecco) return;
    var l = lingueDiPagina();
    if (!l) return;
    /* dito a sinistra (dx negativo) = avanti, come sfogliare */
    var dove = l.qui + (dx < 0 ? 1 : -1);
    if (dove < 0 || dove >= l.voci.length) {
      /* IL MURO SI DEVE SENTIRE. Senza niente, uno sfoglio in fondo alla fila
         e uno sfoglio non riconosciuto sono la stessa cosa: non succede
         niente, e non si impara mai quale dei due era. */
      /* `voci` ne ha almeno due (lo controlla `lingueDiPagina`) */
      const bar = presa(presa(l.voci[0]).parentElement);
      bar.classList.remove('sez-muro');
      void bar.offsetWidth;
      bar.classList.add('sez-muro');
      return;
    }
    presa(l.voci[dove]).click();
  }, { passive: true });

  document.addEventListener('touchcancel', function () { sw = null; }, { passive: true });
}
