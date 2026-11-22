/* node scatta.js <cartella-uscita>  — foto di tutta l'app */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const RADICE=require('/home/user/LifeMax/prove/comune/dove').SERVITO;
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'};
const OUT=process.argv[2]||'shots'; fs.mkdirSync(OUT,{recursive:true});
const indice=[];
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8861,r));
const b=await require('/home/user/LifeMax/prove/comune/lancia')();
const DIM={tel:{viewport:{width:390,height:844},hasTouch:true,isMobile:true},tab:{viewport:{width:834,height:1112},hasTouch:true,isMobile:true},pc:{viewport:{width:1280,height:800}}};
const CLIC=(sel,txt)=>`(()=>{const b=[...document.querySelectorAll(${JSON.stringify(sel)})].find(x=>!${JSON.stringify(txt||'')}||x.textContent.includes(${JSON.stringify(txt||'')}));if(b)b.click();})()`;
const S=[ // [nome, hash, passi[], descrizione]
 ['oggi-adesso','oggi',[],'Oggi › Adesso'],
 ['oggi-adesso-scorsa','oggi',['window.scrollTo(0,99999)'],'Oggi › Adesso, scorsa in fondo'],
 ['giornata-giorno','giornata',[],'Oggi › La giornata › Giorno'],
 ['giornata-giorno-fondo','giornata',['window.scrollTo(0,99999)'],'La giornata › Giorno, scorsa in fondo (senza orario, aggiunta)'],
 ['giornata-settimana','giornata',[CLIC('#vista button','Settimana')],'La giornata › Settimana'],
 ['giornata-mese','giornata',[CLIC('#vista button','Mese')],'La giornata › Mese'],
 ['giornata-anno','giornata',[CLIC('#vista button','Anno')],'La giornata › Anno'],
 ['giornata-sonno-aperto','giornata',['document.getElementById("gio-sonno-toggle")&&document.getElementById("gio-sonno-toggle").click()'],'La giornata con il pannello sonno e pasti aperto'],
 ['giornata-scheda-blocco','giornata',['(()=>{const b=document.querySelector("[data-blk-az]");if(b)b.click();})()'],'Scheda di un’attività toccata nel calendario'],
 ['giornata-scheda-abitudine','giornata',['(()=>{const b=document.querySelector("[data-blk-ab]");if(b)b.click();})()'],'Scheda di un’abitudine toccata nel calendario'],
 ['rituali','rituali',[],'Oggi › Rituali'],
 ['rituale-piano','rituali',['(()=>{const r=document.querySelectorAll(".rit-riga")[0];if(r)r.click();})()'],'Rituale aperto: Piano del giorno'],
 ['rituale-sonno-pasti','rituali',['(()=>{const r=document.querySelectorAll(".rit-riga")[1];if(r)r.click();})()'],'Rituale aperto: Sonno e pasti'],
 ['rituale-checkin','rituali',['(()=>{const r=document.querySelectorAll(".rit-riga")[2];if(r)r.click();})()','(()=>{const b=document.getElementById("ck-rifai");if(b)b.click();})()'],'Rituale aperto: Check-in'],
 ['rituale-sera','rituali',['(()=>{const r=document.querySelectorAll(".rit-riga")[3];if(r)r.click();})()'],'Rituale aperto: Review della sera'],
 ['rituale-settimana','rituali',['(()=>{const r=document.querySelectorAll(".rit-riga")[4];if(r)r.click();})()'],'Rituale aperto: Review della settimana'],
 ['attivita-sistemare','inbox',[CLIC('#vista button','Da sistemare')],'Attività › Da sistemare'],
 ['attivita-dafare','inbox',[CLIC('#vista button','Da fare')],'Attività › Da fare'],
 ['attivita-dafare-aggiunta','inbox',[CLIC('#vista button','Da fare'),'(()=>{const t=document.querySelector("#agg-bk .agg-testo");if(t){t.focus();t.value="Comprare il pane";t.dispatchEvent(new Event("input",{bubbles:true}));}})()'],'Attività › Da fare mentre scrivi una nuova attività (opzioni aperte)'],
 ['attivita-abitudini','inbox',[CLIC('#vista button','Abitudini')],'Attività › Abitudini'],
 ['attivita-abitudini-nuova','inbox',[CLIC('#vista button','Abitudini'),'(()=>{const t=document.querySelector("#agg-ab .agg-testo");if(t){t.focus();t.value="Meditare";t.dispatchEvent(new Event("input",{bubbles:true}));t.scrollIntoView({block:"center"});}})()'],'Attività › Abitudini mentre crei una nuova abitudine'],
 ['scheda-attivita','inbox',[CLIC('#vista button','Da fare'),'(()=>{const b=document.querySelector("#vista [data-bkapri]");if(b)b.click();})()'],'Scheda di una cosa da fare (con passi)'],
 ['scheda-attivita-fondo','inbox',[CLIC('#vista button','Da fare'),'(()=>{const b=document.querySelector("#vista [data-bkapri]");if(b)b.click();})()','(()=>{const c=document.querySelector(".sheet-corpo");if(c)c.scrollTop=99999;})()'],'Scheda di una cosa da fare, scorsa in fondo'],
 ['scheda-abitudine','inbox',[CLIC('#vista button','Abitudini'),'(()=>{const b=document.querySelector("#vista [data-abdett]");if(b)b.click();})()'],'Scheda di un’abitudine'],
 ['scheda-abitudine-fondo','inbox',[CLIC('#vista button','Abitudini'),'(()=>{const b=document.querySelector("#vista [data-abdett]");if(b)b.click();})()','(()=>{const c=document.querySelector(".sheet-corpo");if(c)c.scrollTop=99999;})()'],'Scheda di un’abitudine, scorsa in fondo'],
 ['andamento','plancia',[],'Andamento › Riepilogo'],
 ['andamento-fondo','plancia',['window.scrollTo(0,99999)'],'Andamento › Riepilogo, in fondo'],
 ['scoperte','esperimenti',[],'Andamento › Scoperte › Registro'],
 ['scoperte-esperimenti','esperimenti',[CLIC('#vista button','Esperimenti')],'Andamento › Scoperte › Esperimenti'],
 ['scheda-scoperta','esperimenti',['(()=>{const b=document.querySelector("[data-lezapri]");if(b)b.click();})()'],'Scheda di una scoperta'],
 ['profilo','profilo',[],'Profilo'],
 ['impostazioni','profilo',[CLIC('#vista .lista-riga, #vista button','Impostazioni')],'Profilo › Impostazioni'],
 ['impostazioni-fondo','profilo',[CLIC('#vista .lista-riga, #vista button','Impostazioni'),'(()=>{const c=document.querySelector(".sheet-corpo");if(c)c.scrollTop=99999;})()'],'Impostazioni in fondo'],
 ['imp-timer','profilo',[CLIC('#vista .lista-riga, #vista button','Impostazioni'),'(()=>{const e=document.getElementById("imp-timer");if(e)e.click();})()'],'Impostazioni › Timer'],
 ['imp-musica','profilo',[CLIC('#vista .lista-riga, #vista button','Impostazioni'),'(()=>{const e=document.getElementById("imp-musica");if(e)e.click();})()'],'Impostazioni › Musica'],
 ['imp-aspetto','profilo',[CLIC('#vista .lista-riga, #vista button','Impostazioni'),'(()=>{const e=document.getElementById("imp-aspetto");if(e)e.click();})()'],'Impostazioni › Aspetto'],
 ['aree','profilo',[CLIC('#vista .lista-riga, #vista button','Aree')],'Profilo › Aree'],
 ['sonno-pasti','profilo',[CLIC('#vista .lista-riga, #vista button','Sonno e pasti')],'Profilo › Sonno e pasti'],
 ['promemoria','profilo',[CLIC('#vista .lista-riga, #vista button','Promemoria')],'Profilo › Promemoria'],
 ['diario','profilo',[CLIC('#vista .lista-riga, #vista button','Diario')],'Profilo › Diario'],
 ['timer-scelta','oggi',['(()=>{const s=LM.load();delete s.profilo.timer;LM.save();})()',CLIC('button','Timer')],'Scelta del timer (foglio)'],
 ['timer-concentrazione','oggi',['(()=>{const s=LM.load();delete s.profilo.timer;LM.save();})()',CLIC('button','Timer'),'(()=>{const t=document.querySelector("[data-timer-tipo=pomodoro]");if(t)t.click();})()'],'Schermo di concentrazione col timer'],
 ['cattura','oggi',['document.querySelector(".tab-catt, #side-cattura") && document.querySelector(".tab-catt, #side-cattura").click()'],'Popup «Scrivi un pensiero»'],
 ['menu-oggi-avatar','oggi',['(()=>{const a=document.querySelector(".casa-avatar, .btn-tu, .porta-tu, [aria-label*=Profilo]");if(a)a.click();})()'],'Tocco sull’avatar in alto a destra'],
];
const MOD=[['tel','light'],['tel','dark'],['tab','light'],['pc','light'],['pc','dark']];
for(const [dim,tema] of MOD){
 const ctx=await b.newContext(Object.assign({locale:'it-IT',colorScheme:tema,deviceScaleFactor:1},DIM[dim]));
 const p=await ctx.newPage();
 await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;},new Date('2026-08-18T10:30:00').getTime());
 await p.goto('http://localhost:8861/index.html');await p.waitForTimeout(300);
 for(const [nome,h,passi,desc] of S){
  /* le schede su pc/tablet solo per una parte, per non moltiplicare */
  if(dim!=='tel' && /scorsa|fondo/.test(desc) && tema==='dark') continue;
  try{
   await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(700);
   await p.evaluate(()=>{const x=document.querySelector('.banda-x');if(x)x.click();});
   await p.evaluate(h=>{location.hash='#/'+h;},h);await p.waitForTimeout(800);
   for(const s of passi){await p.evaluate(s);await p.waitForTimeout(700);}
   const f=`${nome}__${dim}-${tema}.png`;
   await p.screenshot({path:path.join(OUT,f)});
   indice.push(`${f}\t${desc} — ${dim==='tel'?'telefono 390×844':dim==='tab'?'tablet 834×1112':'computer 1280×800'}, tema ${tema==='light'?'chiaro':'scuro'}`);
  }catch(e){indice.push(`ERRORE ${nome} ${dim}-${tema}: ${String(e).slice(0,80)}`);}
 }
 /* un trascinamento a metà, solo sul telefono chiaro e sul pc */
 if(tema==='light'){
  try{
   await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(700);
   await p.evaluate(()=>{location.hash='#/giornata';});await p.waitForTimeout(900);
   const r=await p.evaluate(()=>{const e=document.querySelector('.tl-grid [data-drag-az] [data-manico], .tl-grid [data-drag-az]');if(!e)return null;e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
   if(r){await p.mouse.move(r.x,r.y);await p.mouse.down();await p.waitForTimeout(450);await p.mouse.move(r.x,r.y+60,{steps:6});await p.mouse.move(r.x,r.y+140,{steps:6});await p.waitForTimeout(300);
    const f=`trascinamento-in-corso__${dim}-${tema}.png`;await p.screenshot({path:path.join(OUT,f)});indice.push(`${f}\tLa giornata mentre trascini un’attività nel calendario — ${dim}`);await p.mouse.up();}
  }catch(e){indice.push('ERRORE trascinamento '+dim);}
 }
 await ctx.close();
}
fs.writeFileSync(path.join(OUT,'INDICE.txt'),indice.join('\n')+'\n');
console.log(indice.length,'foto');
await b.close();srv.close();})();
