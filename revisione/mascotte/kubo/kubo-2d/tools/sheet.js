// usage: node sheet.js out.png cols cellpx file1 file2 ...
const {chromium}=require('/home/user/LifeMax/node_modules/playwright');
const path=require('path');
(async()=>{const [out,cols,cell,...files]=process.argv.slice(2);
const html=`<body style="margin:0;background:#fff;display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:4px">`+
files.map((f,i)=>`<div style="position:relative;width:${cell}px;height:${cell}px;background:#eee"><img src="file://${path.resolve(f)}" style="width:100%;height:100%;object-fit:contain"><b style="position:absolute;top:2px;left:4px;color:red;font:bold 16px sans-serif">${i}</b></div>`).join('')+'</body>';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:cols*(+cell+4),height:400}});
require("fs").writeFileSync(out+".html",html);await p.goto("file://"+path.resolve(out+".html"));await p.waitForLoadState('networkidle');await p.screenshot({path:out,fullPage:true});await b.close();})();
