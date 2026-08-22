/* Cambiare sezione non è ricaricare la pagina.
   Le tre sezioni di «Oggi» (Adesso, La giornata, Rituali) sono tre indirizzi
   diversi: ogni passaggio finiva in «cambio pagina» e si rialzava tutto a
   scaglioni, riga di linguette compresa — quella che hai appena toccato. Questa prova tiene ferme tre cose: che dentro la stessa
   porta si animi solo il corpo, che cambiando porta si animi tutto (perché lì
   è giusto), e che quello che sta FUORI dalla vista — la barra in basso, la
   colonna, la banda — non venga ricostruito né quando cambi sezione né quando
   spunti una cosa. In più controlla che le barre di sezione abbiano tutte la
   stessa forma: prima Oggi usava linguette sottolineate e le altre pastiglie.

   node prove/sezioni.js        (CHROMIUM=/percorso/di/chrome se serve)  */
const http=require('http'),fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const RADICE=path.join(__dirname,'..');
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
let fail=0;const ok=(n,c,d)=>{if(!c)fail++;console.log('  '+(c?'ok  ':'KO  ')+n+(d?'  → '+d:''));};
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8751,r));
const b=await chromium.launch({executablePath: process.env.CHROMIUM || undefined});
const p=await b.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});
const err=[];p.on('pageerror',e=>err.push(''+e));
await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
await p.goto('http://localhost:8751/index.html');await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);

const animazioni = () => p.evaluate(()=>{
  const q=s=>document.querySelector(s);
  /* `null` se quell'elemento non c'è: da quando il nome della schermata è
     scritto solo nella navigazione, la riga in cima esiste soltanto dove
     tiene un comando (Andamento, Esperimenti). Dove non c'è, non c'è niente
     da tenere fermo. */
  const attive=e=>e?e.getAnimations({subtree:false}).filter(a=>a.playState==='running').length:null;
  const v=document.getElementById('vista');
  const corpo=[...v.children].filter(e=>!e.classList.contains('topbar')&&!e.classList.contains('porta-nav'));
  return {classe:v.className, titolo:attive(q('#vista .topbar')), riga:attive(q('#vista .porta-nav')),
    corpo:corpo.reduce((n,e)=>n+attive(e),0)};
});

console.log('CAMBIO SEZIONE: l’intestazione e la riga stanno ferme');
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(900);
await p.evaluate(()=>{[...document.querySelectorAll('.porta-nav > a')].find(x=>/La giornata/.test(x.textContent)).click()});
await p.waitForTimeout(70);
let a=await animazioni();
ok('la vista usa l’animazione di sezione', /sez-enter/.test(a.classe), a.classe);
ok('la testa non si muove (se c’è)', a.titolo===0 || a.titolo===null,
  a.titolo===null?'questa pagina non ha una testa':String(a.titolo)+' animazioni');
ok('la riga delle sezioni non si muove', a.riga===0, String(a.riga)+' animazioni');
ok('il corpo invece entra', a.corpo>0, String(a.corpo)+' animazioni');

console.log('\nCAMBIO PORTA: entra tutto, come prima');
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(900);
/* verso «Andamento», che è una delle due pagine con una barra di strumenti in
   cima: così la verifica «entra anche la testa» ha ancora qualcosa da guardare */
await p.evaluate(()=>{document.querySelector('.tabbar [data-vai="plancia"]').click()});
await p.waitForTimeout(70);
a=await animazioni();
ok('la vista usa l’animazione di pagina', /vista-enter/.test(a.classe), a.classe);
ok('entra anche la testa', a.titolo>0, String(a.titolo)+' animazioni');

console.log('\nQUELLO CHE STA FUORI DALLA VISTA NON SI RIFÀ');
const marca = () => p.evaluate(()=>{window.__mk=new WeakSet();
  ['.tabbar','#nav-lato','#sidebar-fondo','#banda-demo'].forEach(s=>{const r=document.querySelector(s);if(r)r.querySelectorAll('*').forEach(e=>window.__mk.add(e));});});
const sopravvissuti = () => p.evaluate(()=>{const o={};
  ['.tabbar','#nav-lato','#sidebar-fondo','#banda-demo'].forEach(s=>{const r=document.querySelector(s);
    const t=r?[...r.querySelectorAll('*')]:[];o[s]=t.length?t.filter(e=>window.__mk.has(e)).length+'/'+t.length:'—';});
  return o;});
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(900);
await marca();
await p.evaluate(()=>{[...document.querySelectorAll('.porta-nav > a')].find(x=>/Rituali/.test(x.textContent)).click()});
await p.waitForTimeout(700);
let z=await sopravvissuti();
ok('cambiando sezione la barra in basso resta la stessa', z['.tabbar'].split('/')[0]===z['.tabbar'].split('/')[1], JSON.stringify(z));
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(900);
await marca();
await p.evaluate(()=>{const b=document.getElementById('btn-fatto');if(b)b.click();});
await p.waitForTimeout(700);
z=await sopravvissuti();
ok('spuntando una cosa non si rifà niente fuori', Object.values(z).every(v=>v==='—'||v.split('/')[0]===v.split('/')[1]), JSON.stringify(z));

console.log('\nLA RIGA DELLE SEZIONI NON SPARISCE MAI');
/* aprendo «le altre» si ridisegnava tutta la vista senza rimettere la riga:
   restava senza fino al ridisegno successivo */
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();
  ['Rispondere alla mail del prof','Prep pasti per domani'].forEach(t=>LM.aggiungiAzione(t,'altro',{}));});
await p.evaluate(()=>{location.hash='#/oggi';});await p.reload();await p.waitForTimeout(800);
const rigaCe = () => p.evaluate(()=>{const r=document.querySelector('#vista .porta-nav');
  return !!r && r.getBoundingClientRect().height>1 && r.querySelectorAll('a').length;});
ok('c’è prima di aprire le altre', (await rigaCe())===3, String(await rigaCe()));
await p.evaluate(()=>{const b=document.getElementById('btn-altre');if(b)b.click();});await p.waitForTimeout(700);
ok('c’è ancora dopo averle aperte', (await rigaCe())===3, String(await rigaCe()));
await p.evaluate(()=>{const b=document.getElementById('btn-altre');if(b)b.click();});await p.waitForTimeout(700);
ok('e dopo averle richiuse', (await rigaCe())===3, String(await rigaCe()));

console.log('\nUNA SOLA FORMA PER LE BARRE DI SEZIONE');
const forme = {};
for (const v of ['oggi','giornata','inbox','plancia']) {
  await p.evaluate(x=>{location.hash='#/'+x;},v);await p.waitForTimeout(800);
  forme[v]=await p.evaluate(()=>[...document.querySelectorAll('#vista .segmenti')].map(e=>{
    const r=e.getBoundingClientRect();
    return (e.classList.contains('mini-seg')?'compatta':'sezioni')+':'+Math.round(r.height);}));
}
console.log('  '+JSON.stringify(forme));
const altezze=new Set(Object.values(forme).flat().filter(x=>x.startsWith('sezioni')));
ok('le barre di sezione hanno tutte la stessa altezza', altezze.size===1, [...altezze].join(' '));

console.log('\nOGNI VOCE DELLE BARRE PORTA IL SUO SEGNO');
/* Un segno si trova prima di una parola. È già capitato di togliere le icone
   al gradino compatto per distinguerlo da quello sopra: la differenza si fa
   con la cornice, non levando l'unica cosa che si legge a colpo d'occhio. */
const nude = [];
for (const v of ['oggi','giornata','inbox','rituali','plancia','esperimenti']) {
  await p.evaluate(x=>{location.hash='#/'+x;},v);await p.waitForTimeout(800);
  (await p.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>1&&r.height>1;};
    const out=[];
    document.querySelectorAll('#vista .porta-nav, #vista .att-tabs, #vista .sotto-seg, #vista .sez-nav').forEach(riga=>{
      if(!vis(riga))return;
      [...riga.children].filter(vis).forEach(c=>{
        if(!c.querySelector('svg.ico')) out.push(c.textContent.replace(/\s+/g,' ').trim().slice(0,20));
      });
    });
    return [...new Set(out)];
  })).forEach(x=>nude.push(v+': «'+x+'»'));
}
ok('nessuna voce senza icona', nude.length===0, nude.join(' | ')||'nessuna');
ok('nessun errore JS', err.length===0, [...new Set(err)].join(' | '));
console.log(fail?'\n>>> '+fail+' PROBLEMI':'\n>>> TUTTO A POSTO');
await b.close();srv.close();process.exit(fail?1:0);})();
