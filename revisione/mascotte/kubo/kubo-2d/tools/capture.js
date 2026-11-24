const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');const fs=require('fs');
(async()=>{const [page,out,fps]=process.argv.slice(2);const F=+(fps||60);fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080},deviceScaleFactor:1});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(page)+'?capture=1');await p.waitForFunction(()=>window.render);
const n=await p.evaluate(F=>Math.round(DURATION*F),F);
for(let i=0;i<=n;i++){await p.evaluate(t=>render(t),i/F);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.png`});}
await b.close();console.log('frames',n+1);})();
