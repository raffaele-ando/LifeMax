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
  const fissi=[...document.querySelectorAll('.tabbar, .sheet-overlay:not([hidden]), .overlay:not([hidden]), .avviso-ovl, .toast-zona, #banda-demo')]
    .map(e=>e.getBoundingClientRect()).filter(r=>r.width>0);
  const sottoLaMobilia=r=>fissi.some(f=>!(r.right<f.left||r.left>f.right||r.bottom<f.top||r.top>f.bottom));
  const modaleAperto=!!document.querySelector('.sheet-overlay:not([hidden]), .overlay:not([hidden]), .avviso-ovl');
  return [...document.querySelectorAll('button, a[href], input, select, textarea')].filter(e=>{
    const r=e.getBoundingClientRect();
    if (modaleAperto && !e.closest('.sheet, .pannello-cattura, .avviso')) return false;
    if (sottoLaMobilia(r) && !e.closest('.tabbar, #banda-demo')) return false;
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
    if (v==='inbox') { await p.evaluate(()=>{const b=document.querySelector('[data-att="abitudini"]');if(b)b.click();});await p.waitForTimeout(700); }
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
  await p.evaluate(()=>{const t=document.querySelector('[data-att="abitudini"]');if(t)t.click();});
  await p.waitForTimeout(700);
  await p.evaluate(()=>{const b=document.querySelector('[data-abdett]');if(b)b.click();});await p.waitForTimeout(800);
  const rs=await p.evaluate(SONDA);
  rs.forEach(x=>guai.push(dove+' scheda-abitudine: '+x.chi+' è '+x.rett+' ma prende '+x.preso+' — oltre di '+x.oltre));
  const cs=await p.evaluate(COPERTI);
  cs.forEach(x=>coperti.push(dove+' scheda-abitudine: '+x));
  await p.close();
}
/* LA RISPOSTA AL DITO
   Su un telefono non esiste il passaggio del mouse: tutte le regole `:hover`
   non fanno niente, e se un comando non ha uno stato `:active` toccarlo non
   dà nessuna conferma finché la schermata non cambia. Misurato una volta:
   304 comandi su 336 erano muti — rispondeva solo `.btn`.
   Non si preme davvero ogni comando (premerne uno lo attiva, e mezza app
   cambierebbe sotto la prova): si guarda se una regola `:active` del foglio
   di stile lo riguarda, pseudo-elementi compresi. */
const PREMUTO=`(function(){
  const sel=[];
  /* Si scende anche dentro le @media, e solo in quelle che valgono ADESSO:
     una regola :active dietro un \`min-width: 861px\` non dà nessuna risposta
     su un telefono. Senza scenderci, lo stato premuto della maniglia del
     foglio — che sta nel blocco del telefono — risultava mancante. */
  const raccogli=lista=>{ for (const r of lista) {
    /* una @media che adesso non vale non dà nessuna risposta */
    if (r.media && !matchMedia(r.media.mediaText).matches) continue;
    if (r.selectorText && /:active/.test(r.selectorText)) r.selectorText.split(',').forEach(x=>{
      if(!/:active/.test(x)) return;
      sel.push(x.replace(/:active/g,'').replace(/::?(after|before|first-line|placeholder)/g,'').trim());
    });
    /* \`cssRules\` esiste su OGNI regola da quando il CSS annida, e una lista
       vuota è comunque un oggetto vero: senza controllare la lunghezza si
       scendeva in ogni regola e non se ne leggeva nessuna. */
    if (r.cssRules && r.cssRules.length) raccogli(r.cssRules);
  } };
  for (const ss of document.styleSheets) { try { raccogli(ss.cssRules); } catch(e){} }
  const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);
    return r.width>4&&r.height>4&&s.visibility!=='hidden';};
  const zona=document.querySelector('.sheet-overlay:not([hidden]) .sheet, .overlay:not([hidden]) .pannello-cattura')||document.body;
  const muti=[];
  [...zona.querySelectorAll('button,a[href],[role=button],summary')].filter(vis)
    .filter(e=>!e.closest('.lab-demo')).forEach(e=>{
      const ha=sel.some(x=>{try{return x&&e.matches(x);}catch(z){return false;}});
      if(!ha) muti.push((e.className||e.tagName).toString().trim().split(/\\s+/).slice(0,2).join('.')||e.tagName.toLowerCase());
    });
  return muti;
})()`;
const SCENE_PREMUTO=[
  ['Oggi','oggi',null,null],
  ['La giornata','giornata',null,null],
  ['Attività','inbox',1,null],
  ['Abitudini','inbox',2,null],
  ['Rituali','rituali',null,null],
  ['Andamento','plancia',null,null],
  ['Diario','plancia',1,null],
  ['Esperimenti','esperimenti',null,null],
  ['Impostazioni','plancia',null,()=>{const b=document.getElementById('fondo-impostazioni')||document.querySelector('[data-imp]');if(b)b.click();}],
  /* i due clic uno dopo l'altro, senza aspettare: il pannello si scrive con
     innerHTML dentro la stessa chiamata, quindi il secondo pulsante c'è già.
     Con un setTimeout la prova andava avanti prima che la schermata si
     aprisse, e diceva «tutto a posto» su una schermata mai vista. */
  ['Promemoria','plancia',null,()=>{const b=document.getElementById('fondo-impostazioni')||document.querySelector('[data-imp]');if(b)b.click();
    const c=document.getElementById('imp-prom-come');if(c)c.click();}],
  ['Scheda di un’attività','inbox',1,()=>{const r=document.querySelector('[data-bkapri]');if(r)r.click();}],
  ['Scheda di un’abitudine','inbox',2,()=>{const r=document.querySelector('[data-abdett]');if(r)r.click();}]
];
{
  const pp=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await pp.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
  await pp.goto('http://localhost:8561/index.html');await pp.waitForTimeout(300);
  const senza=new Map();
  for (const [nome,vai,tab,poi] of SCENE_PREMUTO) {
    await pp.evaluate(()=>{localStorage.clear();LM.seedDemo();});
    await pp.evaluate(v=>{location.hash='#/'+v;},vai);await pp.reload();await pp.waitForTimeout(620);
    if(tab!=null){await pp.evaluate(i=>{const t=document.querySelectorAll('#vista .segmenti button')[i];if(t)t.click();},tab);await pp.waitForTimeout(420);}
    if(poi){await pp.evaluate(poi);await pp.waitForTimeout(600);}
    (await pp.evaluate(PREMUTO)).forEach(c=>{
      if(!senza.has(c)) senza.set(c,new Set());
      senza.get(c).add(nome);
    });
  }
  await pp.close();
  console.log('\n=== COMANDI CHE NON RISPONDONO AL DITO ===');
  if(!senza.size) console.log('  nessuno');
  [...senza.entries()].sort((a,b)=>b[1].size-a[1].size).slice(0,20)
    .forEach(([c,d])=>console.log('  - .'+c+'  ('+[...d].join(', ').slice(0,60)+')'));
  ok('ogni comando ha uno stato «premuto»', senza.size===0, senza.size+' famiglie mute');
}

/* UNA SCELTA TOCCATA SI VEDE SUBITO.
   Un segmento dice due cose insieme: fa una cosa, e dice quale delle sue scelte
   è quella in vigore. La seconda si scriveva a mano, in ogni punto dell'app che
   disegna un segmento, e dove non era scritta non succedeva: su «Tema» (Auto ·
   Chiaro · Scuro) e su «Stile» il sito cambiava davvero e la pastiglia accesa
   restava su quella di prima. Toccavi «Scuro», il sito diventava scuro, e il
   comando continuava a dirti che eri su «Chiaro» — chi guarda non pensa «manca
   un aggiornamento», pensa di aver toccato male, e tocca di nuovo.
   Qui si prova ogni segmento di ogni pannello: si toccano tutte le sue voci una
   per una e si pretende che l'accesa sia quella toccata. */
{
  const ps = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await ps.goto('http://localhost:8561/index.html'); await ps.waitForTimeout(400);
  await ps.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await ps.reload(); await ps.waitForTimeout(700);
  const mute = [];
  const provaSegmenti = async (dove) => {
    const file = await ps.evaluate(() => {
      const out = [];
      document.querySelectorAll('.segmenti').forEach((f, i) => {
        if (f.closest('[hidden]')) return;
        const v = [...f.children].filter((c) => /^(BUTTON|A)$/.test(c.tagName));
        if (v.length > 1) out.push({ i: i, quante: v.length, id: f.id || '' });
      });
      return out;
    });
    for (const f of file) {
      for (let k = 0; k < f.quante; k++) {
        const esito = await ps.evaluate((arg) => {
          const f2 = document.querySelectorAll('.segmenti')[arg.i];
          if (!f2) return null;
          const v = [...f2.children].filter((c) => /^(BUTTON|A)$/.test(c.tagName));
          const b2 = v[arg.k];
          if (!b2 || b2.disabled) return null;
          const eti = (b2.textContent || '').trim().slice(0, 20);
          b2.click();
          /* subito, senza aspettare: la pastiglia accesa deve muoversi nello
             stesso momento in cui si tocca */
          const f3 = document.querySelectorAll('.segmenti')[arg.i];
          if (!f3) return { eti: eti, ok: true };   /* il pannello si è rifatto */
          const v3 = [...f3.children].filter((c) => /^(BUTTON|A)$/.test(c.tagName));
          const acceso = v3.findIndex((c) => c.classList.contains('attivo'));
          return { eti: eti, ok: acceso === arg.k, acceso: acceso, id: f3.id || '' };
        }, { i: f.i, k: k });
        await ps.waitForTimeout(140);
        if (esito && !esito.ok) mute.push(dove + ' · ' + (esito.id || 'segmento ' + f.i) +
          ' → «' + esito.eti + '» toccata, accesa la ' + esito.acceso);
      }
    }
  };
  await provaSegmenti('Andamento');
  await ps.evaluate(() => { location.hash = '#/esperimenti'; }); await ps.waitForTimeout(700);
  await provaSegmenti('Scoperte');
  await ps.evaluate(() => { location.hash = '#/inbox'; }); await ps.waitForTimeout(700);
  await provaSegmenti('Attività');
  await ps.evaluate(() => {
    const g = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]');
    if (g) g.click();
  });
  await ps.waitForTimeout(700);
  await provaSegmenti('Impostazioni');
  await ps.close();
  console.log('\n=== SCELTE CHE NON SI ACCENDONO QUANDO LE TOCCHI ===');
  if (!mute.length) console.log('  nessuna');
  mute.slice(0, 20).forEach((m) => console.log('  - ' + m));
  ok('la pastiglia accesa si sposta su quella che hai toccato', mute.length === 0, mute.length + ' casi');
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
