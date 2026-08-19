/* DOVE FINISCE DAVVERO IL DITO
   Campiona una griglia di punti su tutta la pagina (scorrendola per intero)
   e chiede al browser quale elemento riceve il clic in ognuno. Poi confronta
   l'area che ogni singolo elemento si prende con la sua area vera: se se ne
   prende molta di più, sopra c'è qualcosa di invisibile che ruba i clic.
   Nata per un bug vero: una regola cancellata per sbaglio aveva reso l'area
   sensibile di una casella grande quanto tutta la card. */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const RADICE=path.join(__dirname,'..');
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const PAGINE=['oggi','giornata','inbox','rituali','plancia','esperimenti','scienza'];
let fail=0;const ok=(n,c,x)=>{console.log((c?'  ok   ':'  BUG  ')+n+(x?'  → '+x:''));if(!c)fail++;};
const SONDA=`(() => {
  const nome=e=>{if(!e) return '—';
    const c=(e.className&&e.className.baseVal===undefined)?String(e.className).trim().split(/\\s+/).slice(0,2).join('.'):'';
    return e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(c?'.'+c:'');};
  const mappa=new Map(), passo=8;
  for (let y=passo; y<innerHeight; y+=passo) for (let x=passo; x<innerWidth; x+=passo) {
    const t=document.elementFromPoint(x,y);
    if(!t) continue;
    let v=mappa.get(t);
    if(!v){v={n:0,el:t,minX:x,maxX:x,minY:y,maxY:y};mappa.set(t,v);}
    v.n++; v.minX=Math.min(v.minX,x); v.maxX=Math.max(v.maxX,x); v.minY=Math.min(v.minY,y); v.maxY=Math.max(v.maxY,y);
  }
  const out=[];
  mappa.forEach(v=>{
    const r=v.el.getBoundingClientRect();
    /* quanto si estende oltre il proprio rettangolo, in ogni direzione */
    const oltreX=Math.max(0, (v.maxX-v.minX+passo) - r.width);
    const oltreY=Math.max(0, (v.maxY-v.minY+passo) - r.height);
    /* 44 pt di area del dito sono leciti: si perdona fino a 26 px per lato */
    if (oltreX>52 || oltreY>52)
      out.push({chi:nome(v.el), rett:Math.round(r.width)+'×'+Math.round(r.height),
        preso:(v.maxX-v.minX+passo)+'×'+(v.maxY-v.minY+passo), oltre:Math.round(oltreX)+'/'+Math.round(oltreY)});
  });
  return out.sort((a,b)=>parseInt(b.oltre)-parseInt(a.oltre)).slice(0,6);
})()`;
/* Seconda prova, opposta: ogni comando che si vede deve ricevere il clic
   quando lo si tocca nel mezzo. Se al suo posto risponde qualcos'altro,
   sopra c'è qualcosa che lo copre (il pulsante di cattura, una barra
   appiccicata, un pannello che non si è chiuso). */
const COPERTI=`(() => {
  const nome=e=>{if(!e) return '—';
    const c=(e.className&&e.className.baseVal===undefined)?String(e.className).trim().split(/\s+/).slice(0,2).join('.'):'';
    return e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(c?'.'+c:'');};
  const eti=e=>(e.getAttribute('aria-label')||e.textContent||'').replace(/\s+/g,' ').trim().slice(0,24)||nome(e);
  /* la mobilia fissa (tab bar, pulsante di cattura, pannello aperto) copre
     per mestiere: quello che sta sotto si raggiunge scorrendo. Qui si cerca
     altro: qualcosa che copre senza che si veda. */
  const fissi=[...document.querySelectorAll('.tabbar, .fab, .sheet-overlay:not([hidden]), .overlay:not([hidden]), .avviso-ovl, .toast-zona, #banda-demo')]
    .map(e=>e.getBoundingClientRect()).filter(r=>r.width>0);
  const sottoLaMobilia=r=>fissi.some(f=>!(r.right<f.left||r.left>f.right||r.bottom<f.top||r.top>f.bottom));
  const modaleAperto=!!document.querySelector('.sheet-overlay:not([hidden]), .overlay:not([hidden]), .avviso-ovl');
  return [...document.querySelectorAll('button, a[href], input, select, textarea')].filter(e=>{
    const r=e.getBoundingClientRect();
    if (modaleAperto && !e.closest('.sheet, .pannello-cattura, .avviso')) return false;
    if (sottoLaMobilia(r) && !e.closest('.tabbar, .fab, #banda-demo')) return false;
    return r.width>4 && r.height>4 && r.top>=0 && r.bottom<=innerHeight && r.left>=0 && r.right<=innerWidth
      && getComputedStyle(e).visibility!=='hidden' && !e.closest('[hidden]');
  }).map(e=>{
    const r=e.getBoundingClientRect();
    const t=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
    if (t && (t===e || e.contains(t) || t.contains(e))) return null;
    return eti(e)+' ['+nome(e)+'] → al suo posto risponde '+nome(t);
  }).filter(Boolean);
})()`;
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8561,r));const b=await chromium.launch({executablePath: process.env.CHROMIUM || undefined});
const guai=[], coperti=[];
for (const [w,h,tocco] of [[390,844,true],[768,1024,true],[1440,1000,false]]) {
  const p=await b.newPage({viewport:{width:w,height:h},hasTouch:tocco,isMobile:tocco});
  await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
  await p.goto('http://localhost:8561/index.html');await p.waitForTimeout(500);
  await p.evaluate(()=>{LM.seedDemo();});
  const dove=(tocco?'tocco':'mouse');
  for (const v of PAGINE) {
    await p.evaluate(x=>location.hash='#/'+x,v);await p.waitForTimeout(700);
    if (v==='rituali') { await p.evaluate(()=>{document.querySelectorAll('.rit-riga').forEach(r=>{if(r.getAttribute('aria-expanded')==='false')r.click();});});await p.waitForTimeout(900); }
    /* tutta la pagina, non solo la prima schermata */
    const alt=await p.evaluate(()=>document.body.scrollHeight);
    for (let y=0; y<alt; y+=Math.round(h*0.9)) {
      await p.evaluate(yy=>window.scrollTo(0,yy), y);await p.waitForTimeout(250);
      const r=await p.evaluate(SONDA);
      r.forEach(x=>guai.push(dove+' '+v+' (a '+y+'px): '+x.chi+' è '+x.rett+' ma prende '+x.preso+' — oltre di '+x.oltre));
      const c=await p.evaluate(COPERTI);
      c.forEach(x=>coperti.push(dove+' '+v+' (a '+y+'px): '+x));
    }
    await p.evaluate(()=>window.scrollTo(0,0));
  }
  /* e dentro i pannelli */
  await p.evaluate(()=>{location.hash='#/rituali';});await p.waitForTimeout(700);
  await p.evaluate(()=>{const r=[...document.querySelectorAll('.rit-riga')].find(x=>/Abitudini/.test(x.textContent));if(r&&r.getAttribute('aria-expanded')==='false')r.click();});
  await p.waitForTimeout(700);
  await p.evaluate(()=>{const b=document.querySelector('[data-abdett]');if(b)b.click();});await p.waitForTimeout(800);
  const rs=await p.evaluate(SONDA);
  rs.forEach(x=>guai.push(dove+' scheda-abitudine: '+x.chi+' è '+x.rett+' ma prende '+x.preso+' — oltre di '+x.oltre));
  const cs=await p.evaluate(COPERTI);
  cs.forEach(x=>coperti.push(dove+' scheda-abitudine: '+x));
  await p.close();
}
console.log('\n=== AREE DI TOCCO CHE SBORDANO ===');
if (!guai.length) console.log('  nessuna');
guai.slice(0,25).forEach(g=>console.log('  - '+g));
ok('nessun elemento ruba i clic di quelli intorno', guai.length===0, guai.length+' casi');
console.log('\n=== COMANDI COPERTI DA QUALCOS\'ALTRO ===');
const unici=[...new Set(coperti.map(c=>c.replace(/ \(a \d+px\)/,'')))];
if(!unici.length) console.log('  nessuno');
unici.slice(0,25).forEach(c=>console.log('  - '+c));
ok('ogni comando riceve il clic quando lo si tocca', unici.length===0, unici.length+' coperti');
console.log(fail?'\n>>> '+fail+' PROBLEMI':'\n>>> TUTTO A POSTO');
await b.close();srv.close();process.exit(0);})();
