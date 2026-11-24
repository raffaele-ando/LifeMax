// node shot.js file.html out.png w h [scale]
const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');
(async()=>{const [f,out,w,h,s]=process.argv.slice(2);const b=await chromium.launch();
const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:+(s||1)});
p.on('console',m=>console.log('console:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(f));await p.waitForTimeout(300);await p.screenshot({path:out,fullPage:true});await b.close();})();
