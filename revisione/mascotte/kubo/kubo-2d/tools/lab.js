// node lab.js out.png cols size posesFile.js(module exporting [[label,pose],...]) [vb]
const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');
(async()=>{const [out,cols,size,pf,vb]=process.argv.slice(2);delete require.cache[path.resolve(pf)];const poses=require(path.resolve(pf));
const b=await chromium.launch();const p=await b.newPage({viewport:{width:cols*size,height:+size},deviceScaleFactor:1});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(__dirname,'../src/lab.html')+'?size='+size);
await p.evaluate(([ps,vb])=>show(ps,vb),[poses,vb]);await p.screenshot({path:out,fullPage:true});await b.close();})();
