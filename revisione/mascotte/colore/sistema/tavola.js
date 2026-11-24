'use strict';
const fs=require('fs'),path=require('path'),http=require('http');
const cvd=JSON.parse(fs.readFileSync(path.join(__dirname,'cvd.json')));
let html='<!doctype html><meta charset=utf-8><style>body{font:13px system-ui;margin:16px;background:#fff}h2{margin:18px 0 6px}table{border-collapse:collapse}td{padding:3px 6px;vertical-align:middle}.s{width:64px;height:30px;border-radius:6px}.d td{color:#eee}.d{background:#1c1c1e}</style>';
for(const tema of ['light','dark']){
  html+=`<h2>${tema==='light'?'Tema chiaro':'Tema scuro'} — colori simulati (Machado 2009, gravità 1.0)</h2><table class="${tema==='dark'?'d':''}"><tr><td></td>`+Object.keys(cvd[tema]).map(m=>`<td><b>${m}</b></td>`).join('')+'</tr>';
  for(const k of Object.keys(cvd[tema].normale)){
    html+=`<tr><td>${k}</td>`+Object.keys(cvd[tema]).map(m=>`<td><div class=s style="background:${cvd[tema][m][k]}"></div></td>`).join('')+'</tr>';
  }
  html+='</table>';
}
fs.writeFileSync(path.join(__dirname,'tavola-cvd.html'),html);
const RADICE='/home/user/LifeMax';const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json'};
(async()=>{
 const b=await require('/home/user/LifeMax/prove/comune/lancia')();
 const p0=await b.newPage({viewport:{width:900,height:800}});
 await p0.goto('file://'+path.join(__dirname,'tavola-cvd.html'));await p0.screenshot({path:path.join(__dirname,'tavola-cvd.png'),fullPage:true});await p0.close();
 const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
 await new Promise(r=>srv.listen(8875,r));
 const MAT={deut:'0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0',prot:'0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0'};
 for(const tema of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:844},colorScheme:tema,isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const p=await ctx.newPage();
  await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;},new Date('2026-08-18T10:30:00').getTime());
  await p.goto('http://localhost:8875/index.html');await p.waitForTimeout(400);
  await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(900);
  const scatti=[['plancia','.bil-riga','per-area'],['giornata','__mese','mese'],['inbox','__abit','abitudini']];
  for(const [h,sel,n] of scatti){
    await p.evaluate(v=>{location.hash='#/'+v;},h);await p.waitForTimeout(900);
    if(sel==='__mese'){await p.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='Mese');if(b)b.click();});await p.waitForTimeout(700);}
    else if(sel==='__abit'){await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Abitudini/.test(x.textContent));if(b)b.click();});await p.waitForTimeout(700);}
    else {await p.evaluate(s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'});},sel);await p.waitForTimeout(400);}
    for(const m of ['norm','deut','prot']){
      await p.evaluate(([m,v])=>{let s=document.getElementById('__cvd');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.id='__cvd';s.setAttribute('style','position:absolute;width:0;height:0');document.body.appendChild(s);}
        s.innerHTML=v?`<filter id="f${m}" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="${v}"/></filter>`:'';
        document.documentElement.style.filter=v?`url(#f${m})`:'';},[m,MAT[m]||null]);
      await p.waitForTimeout(150);
      await p.screenshot({path:path.join(__dirname,`cvd-${n}-${tema}-${m}.png`)});
    }
    await p.evaluate(()=>{document.documentElement.style.filter='';});
  }
  await ctx.close();
 }
 await b.close();srv.close();
})();
