const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');
(async()=>{const [out,pf,page]=process.argv.slice(2);delete require.cache[path.resolve(pf)];const poses=require(path.resolve(pf));
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1680,height:900},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(page));await p.evaluate(r=>show(r),poses);await p.screenshot({path:out,fullPage:true});await b.close();})();
