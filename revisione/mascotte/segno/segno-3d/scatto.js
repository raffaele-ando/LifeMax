const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const http=require('http');
(async()=>{const srv=http.createServer((q,r)=>{const f=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.statusCode=404;return r.end();}r.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':'text/html');r.end(d);});});
await new Promise(r=>srv.listen(8872,r));const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1080}});
await p.goto('http://localhost:8872/prova.html?trasparente');await p.waitForFunction(()=>window.pronto);await p.addStyleTag({content:'html,body{background:transparent!important}'});
for(const t of [0.2,1.8,3.6]){await p.evaluate(t=>render(t),t);await p.locator('canvas').screenshot({path:`segno-${t}.png`,omitBackground:true});}
await b.close();srv.close();})();
