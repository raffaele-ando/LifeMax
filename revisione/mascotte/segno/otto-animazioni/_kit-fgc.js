/* ---------- KIT locale (fatta / giornata / concentrazione) ----------
   Copia di segno() di base.js con altro nome (segnoX), estesa in modo CONTINUO:
   - occhi: un'unica forma che passa senza salti da ovale → chiuso → arco felice
     (apri 0..1, felici 0..1, per occhio con felL/felR e apL/apR);
   - onda: un'onda che percorre la spina dal basso all'alto (ondaA in gradi, ondaF fronte 0..1.6);
   - sventola: il risvolto alzato ondeggia come una bandierina (sv in unità);
   - occhiY: altezza degli occhi lungo il corpo. */
const BASEX={esse:6,piega:0,incl:0,sy:1,sx:1,risvolto:[17,15],g:[1,1],piedi:[[0,0],[0,0]],apri:1,occhioK:1,felici:0,
  felL:0,felR:0,apL:1,apR:1,occhiY:.3,ondaA:0,ondaF:0,sv:0};
const SX={
  calma:      {...BASEX},
  felice:     {...BASEX, esse:9, piega:-10, risvolto:[-22,-28], felici:1, piedi:[[-6,-3],[6,-3]]},
  carica:     {...BASEX, esse:2, sy:.82, sx:1.16, risvolto:[24,23], g:[0,2.5], piedi:[[-6,1],[6,1]], occhioK:.95},
  slancio:    {...BASEX, esse:0, sy:1.16, sx:.88, risvolto:[-14,-18], g:[0,-1], piedi:[[5,8],[-5,8]], occhioK:1.1},
  fiero:      {...BASEX, esse:0, sy:1.1, sx:.96, risvolto:[-30,-34], felici:1, occhiY:.32, piedi:[[-15,1],[15,1]]},
  alto:       {...BASEX, esse:0, sy:1.3, sx:.84, risvolto:[-26,-50], felici:1, piedi:[[6,6],[-6,6]]},
  concentrato:{...BASEX, esse:0, incl:9, piega:-4, risvolto:[29,35], g:[2,6.5], apri:.5, occhioK:.95},
  sveglio:    {...BASEX, esse:2, incl:0, risvolto:[-16,-20], g:[0,-3], apri:1, occhioK:1.14},
  stira:      {...BASEX, esse:0, incl:-7, piega:-14, sy:1.26, sx:.85, risvolto:[-34,-38], apri:0, piedi:[[5,4],[-5,4]]},
  rilassato:  {...BASEX, esse:7, risvolto:[13,10], felici:1, g:[0,1]},
};
function spinaX(s){
  const pts=[],N=48,ds=H*s.sy/N; let x=100,y=186;
  for(let i=0;i<=N;i++){ const t=i/N;
    let th=s.incl+s.piega*t+s.esse*Math.sin(t*Math.PI*2);
    if(s.ondaA){ const d=t-s.ondaF; th+=s.ondaA*Math.exp(-d*d/.045)*Math.sin(d*Math.PI*2/.42); }
    pts.push({x,y,th,t}); const r=th*Math.PI/180; x+=ds*Math.sin(r); y-=ds*Math.cos(r); }
  return pts;
}
/* occhio continuo: linea mediana ad arco + spessore; con stroke tondo da 4.2 */
function occhioX(x,y,rot,K,ap,fe){
  const w=lerp(5.1*K,7,clamp(fe+(1-ap)*.95));
  const h=7.5*K*ap*(1-fe);
  const base=3*fe, bend=5*fe-2.5*(1-ap)*(1-fe);
  const top=[],bot=[];
  for(let i=0;i<=16;i++){ const u=-1+2*i/16, ym=y+base-bend*(1-u*u), hh=h*Math.sqrt(Math.max(0,1-u*u));
    top.push([x+u*w,ym-hh]); bot.push([x+u*w,ym+hh]); }
  const d='M'+top.map(fp).join('L')+'L'+bot.reverse().map(fp).join('L')+'Z';
  return `<path d="${d}" fill="${C.occhi}" stroke="${C.occhi}" stroke-width="4.2" stroke-linejoin="round" stroke-linecap="round" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})"/>`;
}
function segnoX(s){
  const P=spinaX(s),N=P.length-1,top=P[N];
  const iT=Math.round(N*TACCA/(H*s.sy));
  const [pl,pr]=s.piedi;
  const ps0=lato(P[0],-1,larg(0,s)+4),pd0=lato(P[0],1,larg(0,s)+4);
  const ps=[ps0[0]+pl[0],ps0[1]+pl[1]],pd=[pd0[0]+pr[0],pd0[1]+pr[1]];
  let d=`M${fp(ps)}`;
  for(let i=3;i<=N;i++) d+=`L${fp(lato(P[i],-1,larg(P[i].t,s)))}`;
  d+=`L${fp(lato(top,1,larg(1,s)))}`;
  for(let i=N-1;i>=3;i--) d+=`L${fp(lato(P[i],1,larg(P[i].t,s)))}`;
  d+=`L${fp(pd)}L${fp([P[iT].x,P[iT].y])}Z`;
  const fy=N*(1-s.occhiY), i0=Math.floor(fy), fr=fy-i0, pa=P[i0], pb=P[Math.min(N,i0+1)];
  const po={x:lerp(pa.x,pb.x,fr),y:lerp(pa.y,pb.y,fr),th:lerp(pa.th,pb.th,fr)}, r=po.th;
  const occhi=[-1,1].map(l=>{
    const c=lato(po,l,12),x=c[0]+s.g[0],y=c[1]+s.g[1];
    const fe=clamp(Math.max(s.felici, l<0?s.felL:s.felR)), ap=clamp(s.apri*(l<0?s.apL:s.apR),0,1.3);
    return occhioX(x,y,r,s.occhioK,ap,fe);
  }).join('');
  const [Ll,Lr]=s.risvolto,th=top.th,hw=larg(1,s);
  const hl=lato(top,-1,hw+1),hr=lato(top,1,hw+1);
  const el=lungo(hl,th,Ll),er=lungo(hr,th,Lr);
  const sotto=Ll+Lr>0, apri=sotto?0:6*clamp(-(Ll+Lr)/40);
  const el2=lato({x:el[0],y:el[1],th},-1,apri),er2=lato({x:er[0],y:er[1],th},1,apri);
  // bordo curvo; con 'sv' il bordo libero ondeggia (bandierina)
  const cm=lungo([(el2[0]+er2[0])/2,(el2[1]+er2[1])/2],th,lerp(-4,5,clamp((Ll+Lr+12)/24))+s.sv);
  const risv=`<path d="M${fp(hl)}L${fp(el2)}Q${fp(cm)} ${fp(er2)}L${fp(hr)}Z" fill="${C.rovescio}" stroke="${C.rovescio}" stroke-width="3" stroke-linejoin="round"/>`;
  return (sotto?'':risv)+`<path d="${d}" fill="${C.corpo}" stroke="${C.corpo}" stroke-width="5" stroke-linejoin="round"/>`+occhi+(sotto?risv:'');
}
/* Segno con i piedi ancorati a (px,py) */
function segnoA(s,px,py,sc){ return `<g transform="translate(${f1(px)} ${f1(py)}) scale(${sc.toFixed(3)}) translate(-100 -186)">${segnoX(s)}</g>`; }
const ombraA=(cx,y,k,rx)=>k>0.01?`<ellipse cx="${f1(cx)}" cy="${f1(y+6)}" rx="${f1(rx*k)}" ry="${f1(18*k*rx/125)}" fill="${C.ombra}"/>`:'';
/* sequenza di pose: [[t, stato, easing dell'arrivo], ...] → stato interpolato */
function pose(t,K){
  if(t<=K[0][0]) return {...K[0][1]};
  for(let i=1;i<K.length;i++){ const [t1,s1,e]=K[i], [t0,s0]=K[i-1];
    if(t<=t1) return mix(s0,s1,(e||eIO)(prog(t,t0,t1))); }
  return {...K[K.length-1][1]};
}
const ritardo=(a,b,k)=>a.map((x,i)=>x+b[i]*k);
