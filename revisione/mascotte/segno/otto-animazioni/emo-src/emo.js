/* ===== SEGNO EMOTIVO: copia di segno() di base.js con tre aggiunte (base.js NON è toccato) =====
   1. OCCHIO CONTINUO: un'unica forma chiusa (4 curve) riempita e bordata dello stesso colore.
      Parametri {rx, a, b, dy, punta, tilt}: a = quanto sale l'arco alto, b = quanto scende l'arco basso.
      a=b>0 ovale aperto · a=b≈0 riga (palpebra chiusa) · a>0,b=-a arco felice ∩ · a<0,b=-a arco chiuso ∪
      punta=1 → goccia (cima appuntita) inclinata di tilt verso il centro. Tutto si interpola con mix():
      nessun cambio di disegno, quindi nessun salto tra un tipo di occhio e l'altro.
   2. RISVOLTO CONTINUO: la curvatura del bordo passa da +5 (calato) a −4 (alzato) senza scatto
      quando il risvolto attraversa la cerniera (in base.js salta di colpo a Ll+Lr=0).
   3. occhioR: scala del solo occhio destro (un occhio più grande / che si apre per primo). */
const EA={rx:5.1,a:7.5,b:7.5,dy:0,punta:0,tilt:0,arco:0};   // ovale aperto (= ellisse 7.2×9.6 di base col bordo)
const EF={rx:7,a:5,b:-5,dy:3,punta:0,tilt:0,arco:1};        // felice ∩ (= "q7 -10 14 0")
const EC={rx:7,a:-3.5,b:3.5,dy:0,punta:0,tilt:0,arco:1};    // chiuso ∪, dorme (= "q7 7 14 0")
const EG={rx:5.3,a:8.4,b:7.2,dy:0,punta:1,tilt:12,arco:0};  // goccia, "ti capisce"
const ER={rx:6.2,a:.45,b:.45,dy:.5,punta:0,tilt:0,arco:.5};  // riga: palpebra giù a metà battito
const BE={esse:6,piega:0,incl:0,sy:1,sx:1,risvolto:[17,15],g:[1,1],piedi:[[0,0],[0,0]],occhioK:1,occhioR:1,occhio:EA};
const SE={
  calma:   {...BE},
  capisce: {...BE, esse:4, piega:-22, incl:6, risvolto:[22,10], occhio:EG, g:[-1,2]},
  dorme:   {...BE, esse:0, piega:100, incl:-16, sy:.9, risvolto:[30,30], occhio:EC, g:[0,1]},
  gioia:   {...BE, esse:8, piega:-10, sy:1.04, risvolto:[-26,-32], occhio:EF, piedi:[[-6,-2],[6,-2]]},
  fiero:   {...BE, esse:0, sy:1.1, sx:.95, risvolto:[-30,-30], occhio:EF, piedi:[[-14,0],[14,0]]},
};
function spinaE(s){
  const pts=[],N=48,ds=H*s.sy/N; let x=100,y=186;
  for(let i=0;i<=N;i++){ const t=i/N;
    const th=s.incl+s.piega*t+s.esse*Math.sin(t*Math.PI*2);
    pts.push({x,y,th,t}); const r=th*Math.PI/180; x+=ds*Math.sin(r); y-=ds*Math.cos(r); }
  return pts;
}
function occhioE(x,y,o,rot,k){
  /* arco=0: ovale (maniglie d'ellisse); arco=1: arco di parabola come il "q7 -10 14 0" di base */
  const K=.5523, rx=o.rx*k, a=o.a*k, b=o.b*k, cy=y+o.dy*k, p=o.punta, q=o.arco||0;
  const sxA=lerp(rx,rx*2/3,q), syA=lerp(K,2/3,q), tA=lerp(K,1/3,q);
  const hsA=a*syA*(1-.35*p)+a*.25*p, ht=rx*tA*(1-p), hsB=b*syA, hb=rx*tA;
  const d=`M${f1(x-rx)} ${f1(cy)}C${f1(x-sxA)} ${f1(cy-hsA)} ${f1(x-ht)} ${f1(cy-a)} ${f1(x)} ${f1(cy-a)}`+
          `C${f1(x+ht)} ${f1(cy-a)} ${f1(x+sxA)} ${f1(cy-hsA)} ${f1(x+rx)} ${f1(cy)}`+
          `C${f1(x+sxA)} ${f1(cy+hsB)} ${f1(x+hb)} ${f1(cy+b)} ${f1(x)} ${f1(cy+b)}`+
          `C${f1(x-hb)} ${f1(cy+b)} ${f1(x-sxA)} ${f1(cy+hsB)} ${f1(x-rx)} ${f1(cy)}Z`;
  return `<path d="${d}" fill="${C.occhi}" stroke="${C.occhi}" stroke-width="${f1(4.2*Math.min(1.15,k))}" stroke-linejoin="round" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})"/>`;
}
function segnoE(s){
  const P=spinaE(s),N=P.length-1,top=P[N];
  const iT=Math.round(N*TACCA/(H*s.sy));
  const [pl,pr]=s.piedi;
  const ps0=lato(P[0],-1,larg(0,s)+4),pd0=lato(P[0],1,larg(0,s)+4);
  const ps=[ps0[0]+pl[0],ps0[1]+pl[1]],pd=[pd0[0]+pr[0],pd0[1]+pr[1]];
  let d=`M${fp(ps)}`;
  for(let i=3;i<=N;i++) d+=`L${fp(lato(P[i],-1,larg(P[i].t,s)))}`;
  d+=`L${fp(lato(top,1,larg(1,s)))}`;
  for(let i=N-1;i>=3;i--) d+=`L${fp(lato(P[i],1,larg(P[i].t,s)))}`;
  d+=`L${fp(pd)}L${fp([P[iT].x,P[iT].y])}Z`;
  const iO=Math.round(N*(1-.3)),po=P[iO],r=po.th;
  const occhi=[-1,1].map(l=>{
    const c=lato(po,l,12),x=c[0]+s.g[0],y=c[1]+s.g[1];
    const k=s.occhioK*(l===1?s.occhioR:1);
    const oc=(l===-1&&s.occhioL)?s.occhioL:s.occhio;   // occhioL facoltativo: occhio sinistro diverso
    return occhioE(x,y,oc,r+l*-oc.tilt*oc.punta,k);
  }).join('');
  const [Ll,Lr]=s.risvolto,th=top.th,hw=larg(1,s);
  const hl=lato(top,-1,hw+1),hr=lato(top,1,hw+1);
  const el=lungo(hl,th,Ll),er=lungo(hr,th,Lr);
  const sum=Ll+Lr, sotto=sum>0, apri=sotto?0:6*clamp(-sum/40);
  const el2=lato({x:el[0],y:el[1],th},-1,apri),er2=lato({x:er[0],y:er[1],th},1,apri);
  const curva=sotto?5*clamp(sum/12):-4*clamp(-sum/12);
  const cm=lungo([(el2[0]+er2[0])/2,(el2[1]+er2[1])/2],th,curva);
  const risv=`<path d="M${fp(hl)}L${fp(el2)}Q${fp(cm)} ${fp(er2)}L${fp(hr)}Z" fill="${C.rovescio}" stroke="${C.rovescio}" stroke-width="3" stroke-linejoin="round"/>`;
  return (sotto?'':risv)+`<path d="${d}" fill="${C.corpo}" stroke="${C.corpo}" stroke-width="5" stroke-linejoin="round"/>`+occhi+(sotto?risv:'');
}
/* pone Segno in scena: piedi in (fx,fy), scala sc. Appoggio: quando il corpo è inclinato la punta
   più bassa resta sul suolo (niente piede che sprofonda nel pavimento). */
function piedeBasso(s){ const P=spinaE(s), [pl,pr]=s.piedi;
  const a=lato(P[0],-1,larg(0,s)+4), b=lato(P[0],1,larg(0,s)+4);
  return Math.max(a[1]+pl[1], b[1]+pr[1])-186; }
function poni(s,fx,fy,sc){ const dy=piedeBasso(s)*sc;
  return `<g transform="translate(${f1(fx)} ${f1(fy-dy)}) scale(${sc.toFixed(3)}) translate(-100 -186)">${segnoE(s)}</g>`; }
function ombraE(cx,cy,rx,ry){ return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${C.ombra}"/>`; }
const bump=(t,a,b,c,d)=>eIO(prog(t,a,b))*(1-eIO(prog(t,c,d)));   // 0 → 1 → 0 morbido
