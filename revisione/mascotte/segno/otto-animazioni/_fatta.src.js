/* ============================================================
   SEGNO — COSA FATTA (micro-ricompensa, 1,2 s)
   anticipazione → saltello (risvolto che sbatte come un ciuffo) → atterraggio → assestamento.
   Primo e ultimo fotogramma = Segno calmo: si innesta sull'idle senza tagli.
   ============================================================ */
const DURATA=1.2;
const PX=540, SUOLO=840, SCALA=4.1;
const B=(o)=>({...BASEX,...o});
const KF=[
  [0.00, SX.calma],
  [0.08, SX.calma],
  [0.25, B({esse:2, sy:.83, sx:1.15, risvolto:[25,23], g:[0,2], apri:.55, piedi:[[-6,1],[6,1]]}), eIO],   // anticipazione: si accuccia, strizza gli occhi
  [0.35, B({esse:0, sy:1.15, sx:.89, risvolto:[12,8], felici:1, piedi:[[5,7],[-5,7]]}), eOut],            // stacco: si allunga, il risvolto resta giù (ritardo)
  [0.54, B({esse:9, piega:-9, sy:1.04, risvolto:[-24,-30], felici:1, piedi:[[-9,-5],[9,-5]]}), eOut],      // apice: gioia, ciuffo alzato
  [0.70, B({esse:3, sy:1.08, sx:.94, risvolto:[-20,-26], felici:1, piedi:[[3,5],[-3,5]]}), eIn],           // ricade
  [0.76, B({esse:1, sy:.87, sx:1.12, risvolto:[-6,-10], felici:1, piedi:[[-7,1],[7,1]]}), eOut],           // tocca terra: schiacciamento
  [0.92, B({esse:7, sy:1.03, sx:.98, risvolto:[14,10], felici:1}), eIO],                                    // rimbalzo smorzato
  [1.04, B({esse:6, sy:.99, risvolto:[17,15], felici:1}), eIO],
  [1.18, SX.calma, eIO],
];
const STELLE=[ // poche scintille attorno alla testa all'apice
  {x:318,y:280,r:44,t0:.40},{x:745,y:232,r:34,t0:.45},{x:790,y:452,r:27,t0:.51},{x:290,y:492,r:23,t0:.55}];
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  const u=prog(t,.35,.76), su=128*4*u*(1-u);              // parabola del salto
  let s=pose(t,KF);
  if(t<.12) s.sy*=1+.012*Math.sin(t*9);
  // il risvolto sbatte come un ciuffo: frusta allo stacco, ricaduta all'atterraggio
  s.risvolto=ritardo(s.risvolto,[1,1.25],-16*molla(t-.35,19,6.5)+14*molla(t-.76,21,6.5));
  // i piedi arrivano in ritardo: scalciano un poco in volo
  const sc=SCALA;
  o+=ombraA(PX,SUOLO,1-.45*su/128,118*(t>.25&&t<.35?1+.08*Math.sin(Math.PI*prog(t,.25,.35)):1));
  // in aria leggera rotazione ad arco (si inclina avanti salendo, indietro scendendo)
  s.incl+= u>0&&u<1 ? -5*Math.sin(Math.PI*2*u)*Math.sin(Math.PI*u) : 0;
  o+=segnoA(s,PX,SUOLO-su,sc);
  for(const p of STELLE){ const a=prog(t,p.t0,p.t0+.14), b=prog(t,p.t0+.22,p.t0+.5);
    const k=eBack(a,2.6)*(1-eIn(b)); if(k<=0.001) continue;
    o+=`<g transform="translate(${p.x} ${f1(p.y-30*eOut(prog(t,p.t0,p.t0+.6)))}) rotate(${f1((t-p.t0)*120)}) scale(${k.toFixed(3)})">${stella(p.r,C.oro)}</g>`; }
  document.getElementById('scena').innerHTML=o;
}
