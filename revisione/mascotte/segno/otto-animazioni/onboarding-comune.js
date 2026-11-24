/* Parti comuni alle due animazioni dell'onboarding (benvenuto, pronto).
   Si appoggia a base.js (che NON va modificato): qui ci sono copie rinominate
   e aggiunte.
   - segnoO(s): copia di segno() con due differenze
       1. il risvolto passa da abbassato ad alzato in continuità: la sua curva passa
          per zero senza lo scatto di 9 unità, ed è sempre disegnato sopra il corpo
          (da alzato non lo tocca), così l'ordine dei livelli non cambia mai;
       2. occhi continui: chiusi -> felici con un parametro (felici 0..1), e
          l'occhio destro può fare l'occhiolino da solo (s.dx).
   - libro(): il libro chiuso, in piedi, a forme piatte (un solo neutro caldo).
   - traccia(): fotogrammi chiave con easing per tratto.                        */
const NEUTRO = '#e8c4a0';          // l'unico colore aggiunto: la copertina del libro
const BO = {...BASE, felici:0, dx:{apri:1, felici:0}};

function occhioO(x,y,r,apri,felici,K){
  if(apri<.18){                    // a fessura: da chiuso (U) a felice (∩) senza scatti
    const yo=3*felici, qy=5-15*felici;
    return `<path d="M${f1(x-7)} ${f1(y+yo)}q7 ${f1(qy)} 14 0" fill="none" stroke="${C.occhi}" stroke-width="4.2" stroke-linecap="round" transform="rotate(${f1(r)} ${f1(x)} ${f1(y)})"/>`;
  }
  return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(7.2*K)}" ry="${f1(9.6*apri*K)}" fill="${C.occhi}" transform="rotate(${f1(r)} ${f1(x)} ${f1(y)})"/>`;
}
function segnoO(s){
  const P=spina(s),N=P.length-1,top=P[N];
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
  const dx=s.dx||{apri:1,felici:0};
  const occhi=[-1,1].map(l=>{
    const c=lato(po,l,12),x=c[0]+s.g[0],y=c[1]+s.g[1];
    const apri=l>0?Math.min(s.apri,dx.apri):s.apri, fel=l>0?Math.max(s.felici,dx.felici):s.felici;
    return occhioO(x,y,r,apri,fel,s.occhioK);
  }).join('');
  const [Ll,Lr]=s.risvolto,th=top.th,hw=larg(1,s);
  const hl=lato(top,-1,hw+1),hr=lato(top,1,hw+1);
  const el=lungo(hl,th,Ll),er=lungo(hr,th,Lr);
  const somma=Ll+Lr, sotto=somma>0, apri=sotto?0:6*clamp(-somma/40);
  const el2=lato({x:el[0],y:el[1],th},-1,apri),er2=lato({x:er[0],y:er[1],th},1,apri);
  const pancia=sotto?5*clamp(somma/10):-4*clamp(-somma/10);   // continua attraverso lo zero
  const cm=lungo([(el2[0]+er2[0])/2,(el2[1]+er2[1])/2],th,pancia);
  const risv=`<path d="M${fp(hl)}L${fp(el2)}Q${fp(cm)} ${fp(er2)}L${fp(hr)}Z" fill="${C.rovescio}" stroke="${C.rovescio}" stroke-width="3" stroke-linejoin="round"/>`;
  // il risvolto si disegna SEMPRE sopra: alzato non tocca il corpo, quindi l'ordine
  // non cambia mai e non c'è scatto quando passa da abbassato ad alzato
  return `<path d="${d}" fill="${C.corpo}" stroke="${C.corpo}" stroke-width="5" stroke-linejoin="round"/>`+occhi+risv;
}
/* Segno con i piedi nel punto (px,py) dello schermo, scala K */
const K=3.0;
function segnoIn(s,px,py){ return `<g transform="translate(${f1(px)} ${f1(py)}) scale(${K}) translate(-100 -186)">${segnoO(s)}</g>`; }

/* ---------- fotogrammi chiave ---------- */
function traccia(t,keys){
  if(t<=keys[0][0]) return keys[0][1];
  for(let i=1;i<keys.length;i++) if(t<=keys[i][0]){
    const k=prog(t,keys[i-1][0],keys[i][0]), e=keys[i][2]||eIO;
    return mix(keys[i-1][1],keys[i][1],e(k));
  }
  return keys[keys.length-1][1];
}
const bump=(t,a,b)=>{ const p=prog(t,a,b); return p>0&&p<1?Math.sin(Math.PI*p):0; };
function bez(p,a,b,c,d){ const q=1-p; return q*q*q*a+3*q*q*p*b+3*q*p*p*c+p*p*p*d; }
const warp=(p,a)=>p+a*Math.sin(2*Math.PI*p)/(2*Math.PI);   // veloce agli estremi, lento all'apice
const hermite=(p,m)=>-2*p*p*p+3*p*p+m*(p*p*p-2*p*p+p);       // 0->1 con pendenza iniziale m e arrivo fermo

/* ---------- il LIBRO chiuso, in piedi, visto un poco dall'alto ---------- */
const BW=300, BH=340, DB=34;      // larghezza, altezza, sfalsamento della copertina di dietro (vista di tre quarti)
const L_LOC=-BH-DB*.5+1;           // la fessura fra le pagine (da dove esce Segno), in coordinate del libro
const FX=DB*.5;                    // la fessura sta a metà fra le due copertine anche in orizzontale
function libro(bx,g,sq,tilt){
  const sx=1+sq*.7, sy=1-sq;
  const tr=`translate(${f1(bx)} ${f1(g)}) rotate(${f1(tilt)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`;
  const w=BW/2, d=DB;
  const dietro=`<g transform="${tr}">`+
    // copertina di dietro, sfalsata in alto a destra
    `<rect x="${-w+d}" y="${-BH-d}" width="${BW}" height="${BH}" rx="16" fill="${NEUTRO}"/>`+
    // il blocco delle pagine: si vede in alto e a destra, fra le due copertine
    `<path d="M${-w+10} ${-BH+2}L${-w+10+d-8} ${-BH-d+9}H${w+d-9}V${-d-8}L${w-2} ${-10}V${-BH+2}Z" fill="${C.fondo}" stroke="${C.fondo}" stroke-width="4" stroke-linejoin="round"/>`+
    `<path d="M${-w+22} ${-BH-7}H${w+8}M${-w+34} ${-BH-19}H${w+18}M${w+8} ${-BH-7}V${-24}M${w+18} ${-BH-19}V${-30}" stroke="${C.ombra}" stroke-width="3" stroke-linecap="round" fill="none"/>`+
    `</g>`;
  const davanti=`<g transform="${tr}">`+
    `<rect x="${-w}" y="${-BH}" width="${BW}" height="${BH}" rx="16" fill="${NEUTRO}"/>`+
    // dorso: la cerniera e due nervature
    `<path d="M${-w+34} ${-BH+12}V-12" stroke="${C.fondo}" stroke-width="5" stroke-linecap="round" opacity=".75"/>`+
    `<path d="M${-w+10} ${-BH+40}H${-w+24}M${-w+10} ${-60}H${-w+24}" stroke="${C.fondo}" stroke-width="6" stroke-linecap="round" opacity=".75"/>`+
    // etichetta
    `<rect x="${-w+82}" y="${-BH+70}" width="${BW-120}" height="80" rx="14" fill="${C.fondo}"/>`+
    `<path d="M${-w+108} ${-BH+99}H${w-62}M${-w+108} ${-BH+122}H${w-104}" stroke="${NEUTRO}" stroke-width="7" stroke-linecap="round"/>`+
    `</g>`;
  return {dietro, davanti, L:g+L_LOC*sy, fx:bx+FX*sx};
}
function fessura(L){ return `<defs><clipPath id="fessura" clipPathUnits="userSpaceOnUse"><rect x="-50" y="-2000" width="1200" height="${f1(L+2000)}"/></clipPath></defs>`; }

/* scintilla d'oro che sboccia e si richiude (t0..t0+dur) */
function scintilla(t,x,y,r,t0,dur,giro=60){
  const p=prog(t,t0,t0+dur); if(p<=0||p>=1) return '';
  const k=Math.sin(Math.PI*Math.pow(p,.7));
  return `<g transform="translate(${x} ${y}) rotate(${f1(giro*p)}) scale(${k.toFixed(3)})">${stella(r,C.oro)}</g>`;
}
/* schizzo verso l'alto (pagine che "spruzzano"): stessi pezzi di creaBurst, a ventaglio */
function creaSchizzo(seed,n,cx,cy,t0,scala){
  const R=rng(seed), out=[]; const cols=[C.corpo,C.rovescio,C.oro,C.rovescio,C.oro];
  for(let i=0;i<n;i++){
    const a=lerp(-1.05,1.05,(i+.5)/n)+(R()-.5)*.25, v=lerp(480,760,R());
    out.push({t0:t0+R()*.03, x:cx+Math.sin(a)*70*scala, y:cy, vx:Math.sin(a)*v*.9, vy:-Math.cos(a)*v-180,
      rot:R()*360, vr:(R()-.5)*900, flip:R()*6, vf:6+R()*8,
      tipo:R()<.6?'segno':'stella', col:cols[Math.floor(R()*cols.length)],
      w:(9+R()*7)*scala, h:(22+R()*12)*scala, r:(10+R()*10)*scala, vita:.42+R()*.14});
  }
  return out;
}
