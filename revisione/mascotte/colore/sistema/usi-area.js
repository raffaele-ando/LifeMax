'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const RADICE='/home/user/LifeMax';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json'};
(async()=>{
 const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
 await new Promise(r=>srv.listen(8874,r));
 const b=await require('/home/user/LifeMax/prove/comune/lancia')();
 const out=[];
 for(const tema of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:1600},colorScheme:tema,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;},new Date('2026-08-18T10:30:00').getTime());
  await p.goto('http://localhost:8874/index.html');await p.waitForTimeout(400);
  await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(900);
  for(const h of ['oggi','inbox','giornata','plancia','rituali','esperimenti']){
   await p.evaluate(v=>{location.hash='#/'+v;},h);await p.waitForTimeout(900);
   const r=await p.evaluate(()=>{
    const AREE={'#2a78d6':'Studio','#008300':'Salute','#e87ba4':'Relazioni','#eda100':'Finanze','#1baf7a':'Associazioni','#eb6834':'Founder/fiamma','#4a3aa7':'Lavoro','#e34948':'Altro','#5aa2f0':'Studio','#3fb950':'Salute','#ee8db2':'Relazioni','#f2b53b':'Finanze','#33c792':'Associazioni','#f2804f':'Founder','#9085e9':'Lavoro','#ee7a79':'Altro'};
    const hx=c=>{const m=c.match(/\d+(\.\d+)?/g);if(!m)return'';return '#'+m.slice(0,3).map(x=>(+x|0).toString(16).padStart(2,'0')).join('');};
    const res={};
    document.querySelectorAll('#vista *, .tabbar *, header *').forEach(el=>{
      const r=el.getBoundingClientRect(); if(r.width<2||r.height<2)return;
      const c=hx(getComputedStyle(el).color); if(!AREE[c])return;
      const testo=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
      const svg=el.querySelector(':scope > svg')||el.tagName==='svg';
      const k=AREE[c]+' | '+(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+' | '+(testo?'TESTO «'+testo.slice(0,30)+'» '+getComputedStyle(el).fontSize:(svg?'icona':'altro'));
      res[k]=(res[k]||0)+1;});
    return res;});
   for(const k in r) out.push(tema+' '+h+' '+k+' ×'+r[k]);
  }
  await ctx.close();
 }
 console.log([...new Set(out)].join('\n'));
 await b.close();srv.close();
})();
