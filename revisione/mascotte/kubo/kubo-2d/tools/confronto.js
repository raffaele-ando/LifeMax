const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');
(async()=>{const [out,pf]=process.argv.slice(2);const rows=require(path.resolve(pf));
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:800},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(__dirname,'../src/confronto.html'));
await p.evaluate(r=>showRows(r),rows);await p.waitForFunction(n=>window.loaded===n,rows.length);
await p.screenshot({path:out,fullPage:true});await b.close();})();
