/* ============================================================
   SEGNO — FINE CONCENTRAZIONE (2,5 s)
   concentrato (visiera calata, inclinato in avanti, respiro lento) → «ding»
   → alza la visiera e apre gli occhi → si stiracchia all'indietro
   → si scrolla (onda dal basso all'alto) → sorridente e rilassato.
   ============================================================ */
const DURATA=2.5;
const PX=540, SUOLO=790, SCALA=3.6;
const B=(o)=>({...BASEX,...o});
const CONC=SX.concentrato;
const KF=[
  [0.00, CONC],
  [0.58, CONC],
  [0.66, B({...CONC, sy:1.04, sx:.97, risvolto:[27,32], apri:.75, g:[1,3]}), eOut],                      // sente il ding: si drizza appena
  [0.92, B({...SX.sveglio}), eOut],                                                                    // la visiera si alza, occhi spalancati
  [1.02, B({...SX.sveglio, sy:.96, sx:1.04, apri:.9}), eIO],                                            // piccola presa d'aria
  [1.38, SX.stira, eIO],                                                                               // si stiracchia: allungato e all'indietro
  [1.52, B({...SX.stira, sy:1.29, incl:-8.5, piega:-16}), eIO],
  [1.64, B({esse:0, sy:.9, sx:1.1, risvolto:[-8,-12], apri:0, piedi:[[-6,1],[6,1]]}), eIn],           // lascia andare: schiacciamento
  [1.80, B({esse:2, sy:1.03, sx:.98, risvolto:[-4,-8], apri:0}), eOut],
  [2.08, B({esse:4, sy:1, risvolto:[6,4], apri:0, felici:.0}), eIO],
  [2.26, SX.rilassato, eIO],                                                                           // sorride, rilassato
  [2.50, SX.rilassato, eIO],
];
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  let s=pose(t,KF);
  // respiro lento della concentrazione (e poi quello rilassato)
  s.sy*=1+.016*Math.sin(t*Math.PI*2/1.2-1.2)*(1-prog(t,.55,.7));
  if(t>2.2) s.sy*=1+.012*Math.sin((t-2.2)*5)*clamp((t-2.2)*4);
  // il ding: un sussulto
  s.sy+=.035*molla(t-.58,26,9);
  // la visiera alzata oscilla (segue in ritardo)
  s.risvolto=ritardo(s.risvolto,[1,1.2],-9*molla(t-.92,18,6));
  // tremito nel massimo dello stiracchiamento
  if(t>1.36&&t<1.56) s.incl+=Math.sin(t*90)*.7*Math.sin(Math.PI*prog(t,1.36,1.56));
  // LA SCROLLATA: un'onda sale dai piedi alla cima
  const w=prog(t,1.62,2.14);
  if(w>0&&w<1){ s.ondaF=lerp(-.25,1.35,w); s.ondaA=24*(1-.3*w); s.incl+=3.5*Math.sin(w*Math.PI*5)*(1-w); }   // e un piccolo dondolio
  // il risvolto sbatte quando l'onda arriva in cima
  s.risvolto=ritardo(s.risvolto,[1,1.25],-12*molla(t-1.98,20,6));
  s.sv+=6*molla(t-1.98,20,6);
  o+=ombraA(PX,SUOLO,1,120*(1+.06*clamp(-s.sx+1.1)));
  o+=segnoA(s,PX,SUOLO,SCALA);
  // il «ding» del timer: un anello d'oro e due scintille accanto alla testa
  const d=prog(t,.56,.98);
  if(d>0&&d<1){
    o+=`<circle cx="730" cy="270" r="${f1(lerp(18,120,eOut(d)))}" fill="none" stroke="${C.oro}" stroke-width="${f1(lerp(16,0,eOut(d)))}"/>`;
  }
  for(const [x,y,r,t0] of [[760,250,24,.62],[800,350,16,.68]]){ const k=eBack(prog(t,t0,t0+.12),2.6)*(1-eIn(prog(t,t0+.2,t0+.46)));
    if(k>.001) o+=`<g transform="translate(${x} ${y}) rotate(${f1((t-t0)*140)}) scale(${k.toFixed(3)})">${stella(r,C.oro)}</g>`; }
  document.getElementById('scena').innerHTML=o;
}
