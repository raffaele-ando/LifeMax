/* DUE DISPOSITIVI, UN TIMER.
   Lo stesso account aperto su due telefoni: il timer partito su uno si vede
   sull'altro; allo scadere i minuti li scrive uno solo (quello che lo fa
   andare), e se quello tace per due minuti li scrive l'altro; la pausa non
   fatta torna lavoro; ogni sessione si corregge dopo.
   node prove/duedispositivi.js   (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const RADICE=require('./comune/dove').SERVITO;
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8853,r));
const b=await require('./comune/lancia')();
const err=[];
async function disp(){const ctx=await b.newContext({viewport:{width:390,height:844},locale:'it-IT'});const p=await ctx.newPage();p.on('pageerror',e=>err.push(''+e));
 await p.addInitScript(t=>{window.__off=0;const D=Date;class F extends D{constructor(...a){if(!a.length)super(t+window.__off);else super(...a);}static now(){return t+window.__off;}}window.Date=F;},new Date('2026-08-18T10:30:00').getTime());
 await p.goto('http://localhost:8853/index.html');await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);return p;}
const A=await disp(), B=await disp();
/* stesso account: B parte dallo stato di A */
const manda=async(da,a)=>{const s=await da.evaluate(()=>JSON.stringify(LM.snapshot()));await a.evaluate(s=>{LM.hydrate(JSON.parse(s),false);window.dispatchEvent(new CustomEvent('lm:remote'));},s);await a.waitForTimeout(400);};
await manda(A,B);
let guai=0;const ok=(n,c,d)=>{if(!c)guai++;console.log((c?'  ok  ':'  KO  ')+n+(d?'  → '+d:''));};
/* A avvia un pomodoro su un'azione */
await A.evaluate(()=>{const s=LM.load();s.profilo.timer={predefinito:'pomodoro',pomodoro:25,pausa:5};LM.save();});
/* l'avvio vero passa dal tasto «Timer» della carta di Adesso */
await A.evaluate(()=>{location.hash='#/oggi';});await A.waitForTimeout(800);
const tasto=await A.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Timer/.test(x.textContent));if(b){b.click();return true;}return false;});
await A.waitForTimeout(600);
const tA=await A.evaluate(()=>LM.load().timer);
ok('A: il tasto Timer avvia subito il pomodoro (predefinito)', tasto&&tA&&tA.tipo==='pomodoro', JSON.stringify(tA&&{tipo:tA.tipo,d:tA.durata}));
await manda(A,B);
const vede=await B.evaluate(()=>({t:!!LM.timerVivo(),conc:document.body.classList.contains('in-concentrazione'),cifre:(document.querySelector('[data-timer-cifre]')||{}).textContent}));
ok('B vede il timer di A, in tempo reale', vede.t&&vede.conc, JSON.stringify(vede));
/* passano 25 minuti e mezzo, su tutti e due */
for(const p of [A,B]) await p.evaluate(()=>{window.__off+=25.5*60000;});
await A.waitForTimeout(800);await B.waitForTimeout(800);
const sa=await A.evaluate(()=>({s:LM.load().sessioni.length,pausa:LM.load().timer&&LM.load().timer.inPausa}));
const sb=await B.evaluate(()=>({s:LM.load().sessioni.length}));
ok('scaduto il blocco: A (che lo fa andare) scrive la sessione e va in pausa', sa.s===1&&sa.pausa, JSON.stringify(sa));
ok('B non la scrive due volte', sb.s===0, JSON.stringify(sb));
await manda(A,B); await manda(B,A);
const tot=await B.evaluate(()=>({n:LM.load().sessioni.length,m:LM.sessioniDi(LM.todayKey()).reduce((a,x)=>a+x.minuti,0)}));
ok('dopo lo scambio: una sessione sola da 25 minuti', tot.n===1&&tot.m===25, JSON.stringify(tot));
/* in pausa, «Ho continuato a lavorare» */
await A.evaluate(()=>{window.__off+=3*60000;});await A.waitForTimeout(400);
const cont=await A.evaluate(()=>{const b=document.getElementById('conc-continuato');if(!b)return null;b.click();const t=LM.load().timer;return {inPausa:t.inPausa,ciclo:t.ciclo,giaFatti:Math.round((Date.now()-t.inizio)/60000)};});
ok('in pausa c’è «Ho continuato a lavorare», e i 3 minuti di pausa diventano lavoro', cont&&!cont.inPausa&&cont.ciclo===2&&cont.giaFatti>=3&&cont.giaFatti<=4, JSON.stringify(cont));
/* A sparisce: B prende il posto dopo due minuti dalla scadenza */
await manda(A,B);
await B.evaluate(()=>{window.__off+=25.5*60000;});await B.waitForTimeout(800);
const b1=await B.evaluate(()=>LM.load().sessioni.length);
await B.evaluate(()=>{window.__off+=2.5*60000;});await B.waitForTimeout(800);
const b2=await B.evaluate(()=>({n:LM.load().sessioni.length,t:LM.load().timer&&LM.load().timer.dispositivo}));
ok('se A tace, B aspetta e poi, dopo due minuti, scrive lui', b1===1&&b2.n===2, b1+' → '+JSON.stringify(b2));
/* correggere dopo */
const corr=await B.evaluate(()=>{const x=LM.load().sessioni[0];LM.modificaSessione(x.id,{minuti:40});return LM.minutiDi(LM.todayKey());});
ok('una sessione si corregge e i minuti del giorno seguono', Object.values(corr).some(v=>v>=40), JSON.stringify(corr));
/* fermare e il tasto Correggi */
await B.evaluate(()=>{window.__off+=5*60000;});await B.waitForTimeout(700);await B.evaluate(()=>{window.__off+=10*60000;});await B.waitForTimeout(500);
const st=await B.evaluate(()=>{const f=document.getElementById('conc-ferma');if(!f)return 'niente tasto';f.click();const t=[...document.querySelectorAll('.toast button')].map(x=>x.textContent);return t;});
ok('fermando, il messaggio offre «Correggi»', JSON.stringify(st).includes('Correggi'), JSON.stringify(st));
ok('nessun errore in pagina', err.length===0, err.slice(0,2).join(' | '));
console.log('');console.log(guai?'>>> '+guai+' PROBLEMI':'>>> TUTTO A POSTO');
await b.close();srv.close();process.exit(guai?1:0);})();
