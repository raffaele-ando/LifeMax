/* ============================================================
   SEGNO — GIORNATA CHIUSA (3 s)
   raccoglie il fiato → si stiracchia alto, il risvolto si alza e si apre come una bandierina
   → saltello e si pianta a piedi larghi (fiero) → coriandoli di minisegni
   → respiro soddisfatto → strizza l'occhio. Testo «Giornata chiusa».
   ============================================================ */
const DURATA=3.0;
const PX=540, SUOLO=780, SCALA=3.5;
const B=(o)=>({...BASEX,...o});
const FIERO=B({esse:0, piega:-3, sy:1.1, sx:.97, risvolto:[-30,-36], felici:1, occhiY:.31, piedi:[[-16,1],[16,1]]});
const KF=[
  [0.00, SX.calma],
  [0.12, SX.calma],
  [0.40, B({esse:2, sy:.86, sx:1.12, risvolto:[24,22], apri:0, g:[0,1], piedi:[[-5,1],[5,1]]}), eIO],          // raccoglie il fiato, occhi chiusi
  [0.58, B({esse:0, sy:1.2, sx:.88, risvolto:[10,4], apri:.4, felici:.6, piedi:[[4,5],[-4,5]]}), eIn],           // si allunga: il risvolto è ancora giù
  [0.82, B({esse:0, sy:1.3, sx:.84, risvolto:[-24,-50], felici:1, piedi:[[6,6],[-6,6]]}), eOut],                // in punta di piedi, la bandierina si apre
  [0.98, B({esse:0, sy:1.22, sx:.88, risvolto:[-26,-46], felici:1, piedi:[[-10,0],[10,0]]}), eIO],               // saltello: i piedi si aprono in aria
  [1.12, B({esse:0, sy:.88, sx:1.12, risvolto:[-14,-22], felici:1, piedi:[[-19,2],[19,2]]}), eIn],               // si pianta: schiacciamento
  [1.34, FIERO, eOut],
  [1.50, FIERO, eIO],
  [1.92, B({...FIERO, sy:1.15, sx:.94, risvolto:[-33,-39]}), eIO],                                              // inspira, petto in fuori
  [2.30, B({...FIERO, sy:1.07, sx:.99, risvolto:[-28,-32]}), eIO],                                              // espira soddisfatto
  [2.42, B({...FIERO, sy:1.08, felici:0, g:[0,0]}), eIO],                                                       // apre gli occhi: ti guarda
  [2.54, B({...FIERO, sy:1.08, felici:0, felR:1, incl:-3, g:[-1,0]}), eOut],                                    // strizza l'occhio
  [2.78, B({...FIERO, sy:1.08, felici:0, felR:1, incl:-3, g:[-1,0]}), eIO],
  [2.92, B({...FIERO, sy:1.09, felici:1, felR:1, incl:0}), eIO],                                              // e torna a sorridere
  [3.00, B({...FIERO, sy:1.09, felici:1, felR:1, incl:0}), eIO],
];
const CORIANDOLI=creaBurst(31,22,540,300,420,900,1.12,1);
CORIANDOLI.forEach(p=>p.vita=Math.min(p.vita,1.86));
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  const caldo=eOut(prog(t,1.1,1.7));
  if(caldo>0) o+=`<rect width="1080" height="1080" fill="${C.caldo}" opacity="${(.5*caldo).toFixed(3)}"/>`;
  let s=pose(t,KF);
  if(t<.14) s.sy*=1+.012*Math.sin(t*9);
  // sale in punta di piedi, poi un piccolo salto e si pianta
  const punta=28*eOut(prog(t,.45,.82))*(1-prog(t,.82,.98));
  const u=prog(t,.82,1.12);
  const su = t<.82 ? punta : (t<1.12 ? 28*(1-u)+62*4*u*(1-u) : 0);
  // rimbalzo smorzato dell'assestamento + bandierina che sventola
  s.sy+= .05*molla(t-1.12,15,6);
  s.sx-= .04*molla(t-1.12,15,6);
  const vento=clamp(prog(t,.6,.8))*(1-.75*eOut(prog(t,1.1,1.9)));
  s.risvolto=ritardo(s.risvolto,[Math.sin(t*13)*4,Math.sin(t*13+1.2)*7],vento);
  s.sv+=Math.sin(t*13+.6)*6*vento;
  s.risvolto=ritardo(s.risvolto,[1,1.3],10*molla(t-1.12,18,6));  // il risvolto arriva in ritardo
  o+=ombraA(PX,SUOLO,1-.4*su/70,120*(1+.08*clamp(Math.abs(s.piedi[1][0])/16)));
  o+=particelle(CORIANDOLI,t);            // escono da dietro Segno
  o+=segnoA(s,PX,SUOLO-su,SCALA);
  if(t>1.5){
    const e=prog(t,1.5,1.8), sc=eBack(e,2.2);
    o+=`<text x="540" y="${f1(lerp(975,955,eOut(e)))}" text-anchor="middle" font-size="92" font-weight="900" letter-spacing="-1" fill="${C.corpo}" opacity="${clamp(e*3).toFixed(3)}" transform="translate(540 925) scale(${sc.toFixed(3)}) translate(-540 -925)">Giornata chiusa</text>`;
  }
  document.getElementById('scena').innerHTML=o;
}
