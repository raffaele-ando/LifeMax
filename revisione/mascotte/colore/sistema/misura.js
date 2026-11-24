'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const RADICE='/home/user/LifeMax';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'};
const OUT=__dirname;
const TOK=['pagina','superficie-1','superficie-2','superficie-3','inchiostro-1','inchiostro-2','inchiostro-muto','bordo','bordo-forte','griglia','baseline','vetro','accento','accento-ink','accento-pieno','accento-testo','ok','ok-pieno','ok-testo','avviso','critico','critico-testo','critico-pieno','serie-1'];
(async()=>{
 const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
 await new Promise(r=>srv.listen(8873,r));
 const b=await require('/home/user/LifeMax/prove/comune/lancia')();
 const res={};
 for(const tema of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:844},colorScheme:tema,isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;},new Date('2026-08-18T10:30:00').getTime());
  await p.goto('http://localhost:8873/index.html');await p.waitForTimeout(400);
  await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(900);
  res[tema]=await p.evaluate((TOK)=>{
   const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d',{willReadFrequently:true});
   const pinta=(f,c)=>{cx.fillStyle=f;cx.fillRect(0,0,1,1);cx.fillStyle=c;cx.fillRect(0,0,1,1);return [...cx.getImageData(0,0,1,1).data].slice(0,3);};
   const risolvi=c=>{const b=pinta('#000',c),w=pinta('#fff',c);const a=1-(w[0]-b[0])/255;if(a<=0.004)return[0,0,0,0];return[Math.round(b[0]/a),Math.round(b[1]/a),Math.round(b[2]/a),+a.toFixed(3)];};
   const prova=document.createElement('div');document.body.appendChild(prova);
   const out={mode:document.documentElement.getAttribute('data-mode'),tok:{},el:{}};
   for(const t of TOK){prova.style.color='var(--'+t+')';out.tok[t]=risolvi(getComputedStyle(prova).color);}
   const i=document.querySelector('input[type=text]');
   if(i){out.el.placeholder=risolvi(getComputedStyle(i,'::placeholder').color);out.el.inputBorder=risolvi(getComputedStyle(i).borderTopColor);out.el.inputBg=risolvi(getComputedStyle(i).backgroundColor);}
   return out;},TOK);
  // deuteranopia / protanopia screenshots
  const pagine=[['oggi','oggi'],['plancia','andamento'],['inbox','attivita'],['giornata','giornata']];
  for(const [h,n] of pagine){
    await p.evaluate(v=>{location.hash='#/'+v;},h);await p.waitForTimeout(900);
    await p.screenshot({path:path.join(OUT,`norm-${n}-${tema}.png`)});
    for(const [nome,m] of [['deut','0.367 0.861 -0.228 0 0  0.280 0.673 0.047 0 0  -0.012 0.043 0.969 0 0  0 0 0 1 0'],['prot','0.152 1.053 -0.205 0 0  0.115 0.786 0.099 0 0  -0.004 -0.048 1.052 0 0  0 0 0 1 0']]){
      await p.evaluate(([nome,m])=>{let s=document.getElementById('__cvd');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.id='__cvd';s.setAttribute('style','position:absolute;width:0;height:0');document.body.appendChild(s);}
        s.innerHTML=`<filter id="f${nome}" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`;
        document.documentElement.style.filter=`url(#f${nome})`;},[nome,m]);
      await p.waitForTimeout(200);
      await p.screenshot({path:path.join(OUT,`${nome}-${n}-${tema}.png`)});
      await p.evaluate(()=>{document.documentElement.style.filter='';});
    }
  }
  await ctx.close();
 }
 fs.writeFileSync(path.join(OUT,'token.json'),JSON.stringify(res,null,1));
 await b.close();srv.close();
})();
