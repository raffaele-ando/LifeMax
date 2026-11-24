/* ============================================================
   SEGNO — «Non ce l'ho fatta» → ti capisce. DURATA 3,0 s.
   0.00 calma, respira, ti guarda.
   0.15 anticipo: un respiro dentro, si tira appena indietro.
   0.42 si piega verso di te nella C di «capisce» (lento, ease in-out);
   0.55 gli occhi si fanno a goccia, il risvolto arriva dopo (follow-through).
   1.15 il risvolto cala come una palpebra comprensiva.
   1.45 annuisce due volte (la cima si piega; il secondo più piccolo), il risvolto segue in ritardo.
   2.10 si raddrizza, il risvolto torna su con un piccolo rimbalzo, gli occhi diventano un sorriso calmo.
   2.50 «si mette di segno»: un piccolo affondo verso il basso e un assestamento smorzato, come un
        segnalibro che si sistema fra le pagine. 2.75–3.0 fermo, respira.
   ============================================================ */
const DURATA=3.0;
const scena=document.getElementById('scena');
const SC=3.6, FX=556, FY=800;
const nodo=(t,a,b)=>Math.pow(Math.sin(Math.PI*prog(t,a,b)),2);
function cenno(t){ return nodo(t,1.45,1.82)+.62*nodo(t,1.82,2.14); }
function stato(t){
  const fin={...SE.calma, occhio:EF, g:[0,1]};
  const k1=eIO(prog(t,.42,1.15)), k2=eIO(prog(t,2.1,2.55));
  let s=mix(mix(SE.calma,SE.capisce,k1),fin,k2);
  s.g=mix(mix([1,1],[-1,2],eIO(prog(t,.5,1.1))),[0,1],k2);
  /* anticipo: respiro dentro e piccolo arretramento prima di piegarsi */
  const ant=bump(t,.15,.4,.42,.78);
  s.incl+=-3.2*ant; s.sy+=.02*ant; s.piega+=4*ant;
  /* occhi: ovali → gocce (in ritardo sul corpo) → sorriso calmo */
  const eg=eIO(prog(t,.55,1.05)), ef=eIO(prog(t,2.16,2.52));
  s.occhio=mix(mix(EA,EG,eg),EF,ef);
  /* risvolto: arriva dopo, poi cala come palpebra, poi torna su con un rimbalzo */
  const rk=eIO(prog(t,.58,1.25));
  const palp=eIO(prog(t,1.12,1.5))*(1-eIO(prog(t,2.08,2.42)));
  const rb=eIO(prog(t,2.12,2.5));
  const mr=molla(t-2.5,10,5.5);
  s.risvolto=[ lerp(lerp(17,22,rk),17,rb)+8*palp + 4.5*cenno(t-.09) - 9*mr,
               lerp(lerp(15,10,rk),15,rb)+11*palp + 5.5*cenno(t-.11) - 7*mr ];
  /* annuire: la cima si piega in avanti, il corpo si accorcia un poco */
  const n=cenno(t);
  s.piega+=-10*n; s.sy-=.03*n; s.incl+=-1.5*n; s.g=[s.g[0]-.6*n,s.g[1]+1.4*n];
  /* mettersi di segno: affondo e assestamento */
  const sd=bump(t,2.42,2.56,2.56,2.72);
  const ms=molla(t-2.6,13,6.5);
  s.sy*=1-.06*sd+.035*ms; s.sx*=1+.05*sd-.03*ms; s.incl+=2.8*molla(t-2.48,9,5); s.esse+=2*molla(t-2.55,9,5);
  s.piedi=[[-3*sd,0],[3*sd,0]];
  /* respiro di fondo */
  s.sy*=1+.008*Math.sin(t*Math.PI*2/1.5);
  return s;
}
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  const s=stato(t);
  const lean=eIO(prog(t,.42,1.15))*(1-eIO(prog(t,2.1,2.55)));
  o+=ombraE(FX-22*lean,FY+8,128*(1+.06*lean)*s.sx,17);
  o+=poni(s,FX,FY,SC);
  scena.innerHTML=o;
}
