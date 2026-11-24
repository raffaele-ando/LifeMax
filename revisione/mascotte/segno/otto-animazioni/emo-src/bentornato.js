/* ============================================================
   SEGNO — Bentornato. DURATA 3,5 s. Solo gioia di rivederti, nessun accenno alla serie.
   0.00 dorme: piegato in avanti, risvolto calato come una coperta, respiro lento.
   0.75 si stiracchia nel sonno (anticipo: si raggomitola un filo).
   0.95 apre un occhio (assonnato, poi del tutto); 1.05 comincia a sollevarsi;
   1.25 apre l'altro occhio mentre la coperta-risvolto scivola via.
   1.40 si stira e sbadiglia: si allunga oltre la verticale, occhi strizzati, risvolto su
        come braccia alzate, un tremito al culmine.
   1.95 si rilassa in calma, il risvolto ricade con un rimbalzo.
   2.20 ti riconosce: occhi grandi, risvolto su come sopracciglia.
   2.38 anticipo (si schiaccia) · 2.50 saltello di gioia, risvolto alto, occhi felici · 2.78 atterra.
   2.85 saluta: onda del risvolto e della cima che si smorza; 3.40–3.50 fermo, felice.
   ============================================================ */
const DURATA=3.5;
const scena=document.getElementById('scena');
const SC=3.6, FX=520, FY=800;
const EY={rx:6.6,a:-1.6,b:1.6,dy:0,punta:0,tilt:0,arco:1};      // strizzati (sbadiglio): ∪ schiacciato
const EAs={rx:5.6,a:3.2,b:7,dy:1.2,punta:0,tilt:0,arco:0};       // assonnato: palpebra a metà
/* dorme di nastro3, girato un poco verso di te perché l'occhio che si apre per primo si veda */
const DORME={...SE.dorme, piega:75, incl:-20, sy:.9, esse:3, risvolto:[16,30]};
function stato(t){
  /* --- corpo: dorme → mezzo sollevato → stirato → calma --- */
  const meta={...DORME, piega:40, incl:-8, sy:.95, esse:2, risvolto:[14,12]};
  const stira={...BE, esse:0, piega:-7, incl:2, sy:1.15, sx:.88, risvolto:[-16,-22], piedi:[[-3,0],[3,0]]};
  const eS=u=>.5-.5*Math.cos(Math.PI*u);   // sinusoidale: più morbida della cubica nel mezzo
  const k1=eS(prog(t,1.0,1.5)), k2=eS(prog(t,1.34,1.86)), k3=eIO(prog(t,1.94,2.24));
  let s=mix(mix(mix(DORME,meta,k1),stira,k2),SE.calma,k3);
  /* respiro del sonno, e raggomitolarsi prima di svegliarsi */
  const sonno=1-k1, resp=Math.sin(t*Math.PI*2/1.25);
  s.sy*=1+.022*resp*sonno; s.piega+=3.5*resp*sonno; s.risvolto=[s.risvolto[0]+1.5*resp*sonno,s.risvolto[1]+1.5*resp*sonno];
  const rag=bump(t,.72,.88,.92,1.1);
  s.piega+=7*rag; s.sy-=.02*rag;
  /* tremito al culmine dello stiramento */
  const cul=bump(t,1.66,1.72,1.8,1.9);
  s.incl+=Math.sin(t*70)*.9*cul; s.sy+=.012*cul;
  /* --- occhi --- */
  const oL=eIO(prog(t,.95,1.07)), oL2=eIO(prog(t,1.12,1.24)), oR=eIO(prog(t,1.3,1.42));
  const yawn=bump(t,1.48,1.64,1.88,2.02);
  const fel=eIO(prog(t,2.56,2.7));
  const sveglio=o=>mix(o,EY,yawn);
  let L=mix(mix(EC,EAs,oL),EA,oL2), R=mix(EC,EA,oR);
  s.occhioL=mix(sveglio(L),EF,fel); s.occhio=mix(sveglio(R),EF,fel);
  s.g=mix(mix([2,2],[-2,0],eIO(prog(t,1.0,1.2))),[0,-1.5],eIO(prog(t,1.3,1.5)));
  /* riconosce: occhi grandi, risvolto su come sopracciglia */
  const ric=eOut(prog(t,2.18,2.3))*(1-eIO(prog(t,2.6,2.75)));
  s.occhioK=1+.22*ric+.08*molla(t-2.18,16,7);
  const rcR=eOut(prog(t,2.2,2.34));
  /* --- saltello --- */
  const an=bump(t,2.36,2.48,2.48,2.56);                 // anticipo: schiaccia
  const su=eIO(prog(t,2.48,2.6))*(1-eIO(prog(t,2.6,2.66))); // spinta → allunga
  const at=molla(t-2.78,15,6.5);                         // atterraggio: schiaccia e rimbalza
  s.sy*=1-.13*an+.13*su-.16*at; s.sx*=1+.11*an-.1*su+.12*at;
  s.piedi=[[s.piedi[0][0]-8*an+5*su-6*at,s.piedi[0][1]+9*su],[s.piedi[1][0]+8*an-5*su+6*at,s.piedi[1][1]+9*su]];
  /* risvolto: ricade dopo lo stiramento, poi sopracciglia, poi alto di gioia e saluto */
  const gio=eOut(prog(t,2.46,2.66));
  const ricadi=molla(t-2.1,11,5.5);
  let Ll=s.risvolto[0]+9*ricadi, Lr=s.risvolto[1]+9*ricadi;
  Ll=lerp(Ll,7,rcR*(1-gio)); Lr=lerp(Lr,5,rcR*(1-gio));
  /* saluto: onda che passa da un lato all'altro del risvolto, e la cima che ondeggia */
  const ond=bump(t,2.82,2.95,3.22,3.42), w=(t-2.82)*Math.PI*2*2.6;
  const gL=-26+12*Math.sin(w), gR=-30+12*Math.sin(w-1.3);
  Ll=lerp(Ll,lerp(-26,gL,ond),gio); Lr=lerp(Lr,lerp(-30,gR,ond),gio);
  s.risvolto=[Ll-6*molla(t-2.56,12,6), Lr-8*molla(t-2.58,12,6)];
  s.piega+=lerp(0,-8,gio)+9*Math.sin(w-.6)*ond; s.esse+=lerp(0,4,gio);
  s.incl+=2*Math.sin(w-1.2)*ond;
  return s;
}
function salto(t){ // altezza dei piedi da terra (px)
  if(t<2.56||t>2.78) return 0;
  const u=prog(t,2.56,2.78); return 74*4*u*(1-u);       // arco parabolico
}
function render(t){
  let o=`<rect width="1080" height="1080" fill="${C.fondo}"/>`;
  const s=stato(t), h=salto(t);
  const dorm=1-eIO(prog(t,1.05,1.6));
  o+=ombraE(FX+14*dorm,FY+8,(128-40*h/74)*s.sx,17-5*h/74);
  o+=poni(s,FX,FY-h,SC);
  scena.innerHTML=o;
}
