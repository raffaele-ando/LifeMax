/* IL MOVIMENTO, E LA TELA SU CUI SUCCEDE.

   Questo file è uscito da `app.ts` per primo perché è il pezzo che non
   chiede niente a nessuno: sa contare, sa far cadere dei coriandoli, e non
   ha mai bisogno di sapere che schermata è aperta o cosa c'è nei dati. Un
   pezzo così, dentro a un file di ottomila righe, è quello che si legge per
   ultimo e si cambia con più paura del dovuto.

   `RIDOTTO` sta qui e non altrove perché è la domanda che ogni animazione si
   deve fare prima di partire — «questa persona ha chiesto di non vedere
   movimento?» — e tenerla accanto alle animazioni vuol dire che chi ne
   scrive una nuova la trova sotto gli occhi. Fuori di qui non la guarda
   nessuno.

   L'unica strada è in una direzione sola: `app.ts` importa da qui, qui non
   si importa niente da `app.ts`. È la condizione per cui questa divisione
   non crea un anello — e la ragione per cui è cominciata da questo blocco. */

/* le opzioni della festa: da dove partono i pezzi, quanti, e (per lo
   scoppio attorno al dito) da che punto */
export interface OpzFesta {
  da?: 'alto' | 'punto';
  x?: number;
  y?: number;
  quanti?: number;
}

export const RIDOTTO = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- motion utilities ---------- */

interface OpzContatore { fmt?: (v: number) => string; dur?: number }
export function countUp(el: HTMLElement, to: number, opzioni?: OpzContatore): void {
  const opts: OpzContatore = opzioni || {};
  const fmt = opts.fmt || function (v: number) { return Math.round(v).toLocaleString('it-IT'); };
  if (RIDOTTO) { el.textContent = fmt(to); return; }
  const dur = opts.dur || 900;
  let t0: number | null = null;
  function step(ts: number) {
    if (!t0) t0 = ts;
    var k = Math.min(1, (ts - t0) / dur);
    k = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(to * k);
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const COLORI_FESTA = ['#7c5df0', '#4a7bf5', '#2ab8e8', '#0ca30c', '#eda100', '#e87ba4'];

/* LO SCOPPIO ATTORNO AL DITO: sulla stessa tela della pioggia.
   Anche questo erano diciotto elementi aggiunti alla pagina, cioè diciotto
   strati nuovi sulla scheda grafica — meno della pioggia, ma capita molto
   più spesso: ogni riga spuntata. Era il resto del blocco che si sentiva
   «anche da altre parti».
   La tela è una sola e la sa disegnare `festa()`: qui si dice soltanto da
   dove partono i pezzi e con che velocità. */
export function burst(x: number, y: number): void {
  festa({ da: 'punto', x: x, y: y, quanti: 18 });
}

export function flyXp(x: number, y: number, punti: number): void {
  if (RIDOTTO || !punti) return;
  const s = document.createElement('span');
  s.className = 'vola-xp';
  s.textContent = '+' + punti;
  s.style.left = (x - 20) + 'px';
  s.style.top = (y - 14) + 'px';
  document.body.appendChild(s);
  setTimeout(function () { s.remove(); }, 900);
}

/* ---------- LA PIOGGIA DI CORIANDOLI, SU UNA TELA SOLA ----------
   Prima erano trentaquattro elementi `position: fixed` aggiunti alla
   pagina tutti insieme, ognuno con la sua animazione CSS. Trentaquattro
   animazioni di trasformazione vogliono dire trentaquattro strati nuovi
   sulla scheda grafica, creati nello stesso istante — e quell'istante è
   proprio quello in cui hai appena finito qualcosa, cioè il momento in cui
   l'app deve sembrare svelta. Su un telefono si vedeva come un blocco: la
   festa arrivava con un ritardo lunghissimo, e la festa in ritardo non è
   una festa, è un difetto.

   Una tela sola è UNO strato, e i coriandoli ci si disegnano dentro. La
   tela si toglie appena finiscono, così non resta niente in pagina.
   La fisica è la più semplice che regge lo sguardo: caduta con
   accelerazione, deriva laterale costante, rotazione propria, e lo spessore
   che si assottiglia col coseno — un rettangolo che gira su se stesso, che
   è quello che fa un coriandolo vero. */
/* UN CORIANDOLO: dove sta, quanto va, come gira, e di che colore è. Era un
   oggetto letterale creato in due punti e letto nel ciclo di disegno. */
interface Coriandolo {
  x: number; y: number; vx: number; vy: number;
  a: number; va: number; w: number; h: number;
  col: string;
  /* la gravità: 900 per lo scoppio attorno al dito, 620 per la pioggia — un
     coriandolo lanciato in aria cade più in fretta di uno che scende dall'alto */
  g: number;
}
let telaFesta: HTMLCanvasElement | null = null;
let festaAttiva = 0;
let pezziFesta: Coriandolo[] = [];
let telaCtx: CanvasRenderingContext2D | null = null;
let telaW = 0, telaH = 0, dprFesta = 1;

/* UNA TELA SOLA PER TUTTE LE FESTE.
   Prima ogni festa creava i suoi elementi: trentaquattro per la pioggia,
   diciotto per lo scoppio attorno al dito. Ognuno con la sua animazione,
   cioè uno strato nuovo sulla scheda grafica, tutti nello stesso istante —
   e quell'istante è quello in cui hai appena fatto qualcosa, cioè quando
   l'app deve sembrare svelta. Lo scoppio capita a ogni riga spuntata, molte
   volte al giorno: era il pezzo che si sentiva più spesso.
   Adesso c'è una tela, un ciclo, e i pezzi ci si disegnano dentro. Due
   feste ravvicinate non si scavalcano: la seconda aggiunge i suoi pezzi a
   quelli che stanno già cadendo. */
function preparaTela(): void {
  if (!telaFesta) {
    telaFesta = document.createElement('canvas');
    telaFesta.className = 'tela-festa';
    telaFesta.setAttribute('aria-hidden', 'true');
    document.body.appendChild(telaFesta);
  }
  const W = window.innerWidth, H = window.innerHeight;
  if (W !== telaW || H !== telaH || telaFesta.style.display === 'none') {
    /* LA TELA STA A UNA VOLTA, NON A TRE. Un coriandolo e' un rettangolo da
       sei pixel che gira mentre cade: la densita' dello schermo non gliela
       vede nessuno, e ogni raddoppio quadruplica i pixel da pulire e
       riempire a ogni fotogramma. Misurato con la CPU rallentata sei volte:
       a due volte la festa girava a 43 fotogrammi, a una a sessanta. */
    const dpr = 1;
    dprFesta = dpr;
    telaW = W; telaH = H;
    telaFesta.width = Math.round(W * dpr);
    telaFesta.height = Math.round(H * dpr);
    telaCtx = telaFesta.getContext('2d');
    if (telaCtx) telaCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  telaFesta.style.display = 'block';
}

export function festa(opt: OpzFesta): void {
  if (RIDOTTO) return;
  preparaTela();
  /* la tela e il suo pennello si prendono una volta: dentro al ciclo, per il
     compilatore, sarebbero ancora «forse niente» a ogni fotogramma */
  const ctx = telaCtx, tela = telaFesta;
  if (!ctx || !tela) return;
  const W = telaW, H = telaH, n = opt.quanti || 40;
  for (let i = 0; i < n; i++) {
    const col = COLORI_FESTA[i % COLORI_FESTA.length] || '#7c5df0';
    if (opt.da === 'punto') {
      const ang = Math.random() * Math.PI * 2, forza = 170 + Math.random() * 280;
      pezziFesta.push({
        x: opt.x || 0, y: opt.y || 0,
        vx: Math.cos(ang) * forza, vy: Math.sin(ang) * forza - 190,
        w: 5 + Math.random() * 3, h: 8 + Math.random() * 5,
        a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 11,
        col: col, g: 900
      });
    } else {
      pezziFesta.push({
        x: Math.random() * W, y: -20 - Math.random() * H * 0.4,
        vx: (Math.random() - 0.5) * 60, vy: 220 + Math.random() * 260,
        w: 5 + Math.random() * 4, h: 9 + Math.random() * 6,
        a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 9,
        col: col, g: 620
      });
    }
  }
  if (festaAttiva) return;                 /* il ciclo gira già */
  festaAttiva = 1;
  let ultimo = performance.now();
  (function passo(ora: number) {
    const dt = Math.min(0.05, (ora - ultimo) / 1000);
    ultimo = ora;
    ctx.setTransform(dprFesta, 0, 0, dprFesta, 0, 0);
    ctx.clearRect(0, 0, telaW, telaH);
    const vivi: Coriandolo[] = [];
    for (let k = 0; k < pezziFesta.length; k++) {
      const q = pezziFesta[k];
      if (!q) continue;
      q.vy += q.g * dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.a += q.va * dt;
      if (q.y > telaH + 30 || q.x < -60 || q.x > telaW + 60) continue;
      vivi.push(q);
      /* `setTransform` invece di save/translate/rotate/restore: quattro
         chiamate diventano una, e a quaranta pezzi per sessanta fotogrammi
         sono novemila chiamate al secondo risparmiate */
      const co = Math.cos(q.a), si = Math.sin(q.a);
      ctx.setTransform(co * dprFesta, si * dprFesta, -si * dprFesta, co * dprFesta,
        q.x * dprFesta, q.y * dprFesta);
      ctx.fillStyle = q.col;
      /* lo spessore che si assottiglia col coseno: è un rettangolo che gira
         su se stesso, e girando lo vedi di taglio */
      ctx.fillRect(-q.w / 2, -q.h / 2, q.w * Math.abs(Math.cos(q.a * 1.7)), q.h);
    }
    pezziFesta = vivi;
    if (vivi.length) requestAnimationFrame(passo);
    else {
      ctx.setTransform(dprFesta, 0, 0, dprFesta, 0, 0);
      ctx.clearRect(0, 0, telaW, telaH);
      tela.style.display = 'none';
      festaAttiva = 0;
    }
  })(ultimo);
}

export function pioggiaCoriandoli(): void { festa({ da: 'alto', quanti: 40 }); }

