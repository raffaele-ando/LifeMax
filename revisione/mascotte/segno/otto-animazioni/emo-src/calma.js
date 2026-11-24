/* ============================================================
   SEGNO — Attesa (loop per stati vuoti e home). DURATA 4 s, render(0) == render(4).
   Ogni movimento è o una sinusoide con periodo che divide 4 s (2 s o 4 s), o un "bump"
   che parte e finisce a zero con velocità zero dentro il giro: il loop non ha cuciture.
   continuo  respiro (2 respiri per giro), oscillazione lentissima del corpo,
             il risvolto ondeggia come stoffa nell'aria (i due lati sfasati, la cima in ritardo).
   1.10      battito di ciglia (chiude in 70 ms, riapre più piano).
   2.00      lo sguardo va un attimo in alto a destra, la cima lo segue appena; 3.25 torna da te.
   ============================================================ */
const DURATA=4.0;
const scena=document.getElementById('scena');
const SC=3.6, FX=540, FY=800;
const TAU=Math.PI*2;
const onda=(t,per,fase)=>Math.sin(TAU*t/per+fase);
function stato(t){
  const s={...SE.calma};
  /* respiro: si allunga inspirando, si allarga un filo espirando */
  const r=onda(t,2,-Math.PI/2);
  s.sy=1+.013*r; s.sx=1-.007*r;
  /* oscillazione del corpo e cima che segue in ritardo */
  s.incl=.9*onda(t,4,.3); s.esse=6+.8*onda(t,4,-.9); s.piega=1.4*onda(t,4,-.6);
  /* sguardo che si sposta un attimo */
  const gz=bump(t,2.0,2.32,2.92,3.25);
  s.g=[1+5*gz, 1-2.6*gz]; s.piega+=-2.2*gz; s.incl+=.6*gz;
  /* risvolto come stoffa: due onde per lato, sfasate; si solleva appena quando guarda in alto */
  s.risvolto=[17+1.7*onda(t,4,0)+.7*onda(t,2,.7)-2*gz, 15+1.7*onda(t,4,-1.1)+.7*onda(t,2,-.5)-1.2*gz];
  /* battito di ciglia */
  const bl=eIn(prog(t,1.1,1.17))*(1-eOut(prog(t,1.19,1.34)));
  s.occhio=mix(EA,ER,bl);
  return s;
}
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  const s=stato(t);
  o+=ombraE(FX+3*s.incl,FY+8,128*(1+.012*onda(t,2,Math.PI/2)),17);
  o+=poni(s,FX,FY,SC);
  scena.innerHTML=o;
}
