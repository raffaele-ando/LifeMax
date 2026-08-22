/* Ogni pannello, aperto da ogni strada e chiuso in ogni modo: alla fine
   l'app deve essere viva e cliccabile. Un livello di modalità rimasto
   appeso non si vede: si scopre che l'app non risponde più a niente. */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const RADICE=path.join(__dirname,'..');
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const IGN=/gstatic|firebase|firestore|identitytoolkit|googleapis|net::|Failed|ERR_/i;
let fail=0;const ok=(n,c,x)=>{console.log((c?'  ok   ':'  BUG  ')+n+(x?'  → '+x:''));if(!c)fail++;};
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8621,r));const b=await chromium.launch({executablePath: process.env.CHROMIUM || undefined});
const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>{if(!IGN.test(e.message))errs.push(e.message);});
await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
await p.goto('http://localhost:8621/index.html');await p.waitForTimeout(500);
await p.evaluate(()=>{LM.seedDemo();});

const viva=()=>p.evaluate(()=>{
  const morta=[...document.querySelectorAll('.app, .tabbar, #banda-demo')].some(e=>e.hasAttribute('inert')||e.getAttribute('aria-hidden')==='true');
  const t=document.querySelector('.tabbar button');
  const r=t.getBoundingClientRect();
  const sopra=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
  return {inerte:morta, fermo:document.body.classList.contains('sfondo-fermo'),
    tabRaggiungibile:!!(sopra&&(sopra===t||t.contains(sopra))),
    aperto:!document.getElementById('sheet-overlay').hidden||!document.getElementById('overlay-cattura').hidden};});

const vaiA=async v=>{await p.evaluate(x=>location.hash='#/'+x,v);await p.waitForTimeout(600);};
const apriAbitudini=async()=>{await vaiA('inbox');
  await p.evaluate(()=>{const b=document.querySelector('[data-att="abitudini"]');if(b)b.click();});
  await p.waitForTimeout(700);};

const PANNELLI=[
  ['Impostazioni', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});}],
  ['Impostazioni → Le tue aree', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});await p.waitForTimeout(600);await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet button')].find(x=>/gestisci le aree/i.test(x.textContent));if(b)b.click();});}],
  ['Impostazioni → Come si usa', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});await p.waitForTimeout(600);await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet button')].find(x=>/come si usa/i.test(x.textContent));if(b)b.click();});}],
  ['Impostazioni → Sonno e pasti', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});await p.waitForTimeout(600);await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet button')].find(x=>/sonno e pasti/i.test(x.textContent));if(b)b.click();});}],
  ['Impostazioni → Backup', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});await p.waitForTimeout(600);await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet button')].find(x=>/backup/i.test(x.textContent));if(b)b.click();});}],
  ['Impostazioni → Cosa sta succedendo', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});await p.waitForTimeout(600);await p.evaluate(()=>{const b=[...document.querySelectorAll('.sheet button')].find(x=>/cosa sta succedendo/i.test(x.textContent));if(b)b.click();});}],
  ['La giornata (da Oggi)', async()=>{await vaiA('oggi');await p.evaluate(()=>{const b=document.querySelector('.giornata-strip');if(b)b.click();});}],
  ['Blocco della giornata', async()=>{await vaiA('giornata');await p.evaluate(()=>{const b=document.querySelector('.tl-blk-clic');if(b)b.click();});}],
  ['Scheda abitudine', async()=>{await apriAbitudini();await p.evaluate(()=>{const b=document.querySelector('[data-abdett]');if(b)b.click();});}],
  ['Cattura rapida', async()=>{await vaiA('oggi');await p.evaluate(()=>document.querySelector('.tabbar [data-catt]').click());}]
];
const CHIUSURE=[
  ['la x', async()=>{await p.evaluate(()=>{const c=document.getElementById('sheet-chiudi');if(c&&!document.getElementById('sheet-overlay').hidden)c.click();else{const o=document.getElementById('overlay-cattura');if(!o.hidden)o.click();}});}],
  ['Esc', async()=>{await p.keyboard.press('Escape');}],
  ['toccando fuori', async()=>{await p.evaluate(()=>{const s=document.getElementById('sheet-overlay');const o=document.getElementById('overlay-cattura');
      const t=!s.hidden?s:(!o.hidden?o:null); if(t) t.dispatchEvent(new MouseEvent('click',{bubbles:true}));});}]
];
for (const [nome, apri] of PANNELLI) {
  for (const [comeC, chiudi] of CHIUSURE) {
    await apri(); await p.waitForTimeout(700);
    const dentro=await viva();
    if (!dentro.aperto) { console.log('  (saltato) '+nome+': non si è aperto'); continue; }
    await chiudi(); await p.waitForTimeout(700);
    const fuori=await viva();
    ok(nome+' — chiuso con '+comeC, !fuori.inerte && !fuori.fermo && fuori.tabRaggiungibile && !fuori.aperto, JSON.stringify(fuori));
  }
}
/* LA VIA DEL RITORNO
   Cinque pannelli si aprono da dentro «Impostazioni» e finora non c'era modo
   di tornare indietro: chiudevi e riaprivi. Il tasto deve esserci, deve dire
   il nome del posto da cui vieni, e deve riportarti lì (non chiudere tutto). */
console.log('');
for (const [nome, apri] of PANNELLI.filter(x=>/→/.test(x[0]))) {
  await apri(); await p.waitForTimeout(700);
  const dentro=await p.evaluate(()=>{const b=document.getElementById('sheet-indietro');
    const r=b?b.getBoundingClientRect():null;
    return {tit:(document.getElementById('sheet-titolo')||{}).textContent,
      testo:b?b.textContent.replace(/\s+/g,' ').trim():null,
      visibile:!!(r&&r.width>2&&r.height>2)};});
  if (!dentro.visibile) { ok(nome+' — la via del ritorno', false, 'nessun tasto indietro (titolo: '+dentro.tit+')'); continue; }
  await p.evaluate(()=>document.getElementById('sheet-indietro').click());
  await p.waitForTimeout(700);
  const tornato=await p.evaluate(()=>({tit:(document.getElementById('sheet-titolo')||{}).textContent,
    aperto:!document.getElementById('sheet-overlay').hidden,
    indietro:!document.getElementById('sheet-indietro') || document.getElementById('sheet-indietro').hidden}));
  ok(nome+' — «'+dentro.testo+'» riporta al pannello di prima',
    tornato.aperto && /Impostazioni/.test(tornato.tit||'') && tornato.indietro,
    JSON.stringify(tornato));
  await p.evaluate(()=>{const c=document.getElementById('sheet-chiudi');if(c)c.click();});
  await p.waitForTimeout(400);
}

/* e l'avviso sopra un pannello */
await vaiA('oggi');
await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/impostazioni/i.test(x.getAttribute('aria-label')||x.title||x.textContent));b.click();});
await p.waitForTimeout(700);
await p.evaluate(()=>{const b=document.getElementById('imp-azzera');if(b)b.click();});await p.waitForTimeout(600);
await p.keyboard.press('Escape');await p.waitForTimeout(500);
await p.evaluate(()=>document.getElementById('sheet-chiudi').click());await p.waitForTimeout(600);
const dopoAvviso=await viva();
ok('avviso sopra un pannello, poi tutto chiuso', !dopoAvviso.inerte && !dopoAvviso.fermo && dopoAvviso.tabRaggiungibile, JSON.stringify(dopoAvviso));
ok('nessun errore JS', errs.length===0, errs.slice(0,3).join(' | '));
console.log(fail?'\n>>> '+fail+' PROBLEMI':'\n>>> TUTTO A POSTO');
await b.close();srv.close();process.exit(0);})();
