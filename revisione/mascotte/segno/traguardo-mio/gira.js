const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+__dirname+'/anim.html');await p.waitForTimeout(300);
const fps=Number(process.argv[2]||60), soloChiave=process.argv[3]==='chiave';
fs.mkdirSync(__dirname+'/fot',{recursive:true});
const dur=await p.evaluate(()=>window.DUR);
const tempi=soloChiave?[0.2,0.7,1.0,1.4,1.7,1.85,2.1,2.6,3.2,4.0]:Array.from({length:Math.round(dur*fps)},(_,i)=>i/fps);
let i=0;for(const t of tempi){await p.evaluate(t=>window.render(t),t);await p.screenshot({path:__dirname+(soloChiave?'/chiave-'+t.toFixed(2)+'.png':'/fot/f'+String(i).padStart(4,'0')+'.png')});i++;}
console.log('fotogrammi',i,e);await b.close();})();
