// misura posizioni di elementi chiave fotogramma per fotogramma e cerca scatti
const {chromium}=require('/home/user/LifeMax/node_modules/playwright');const path=require('path');
(async()=>{const [page,fps]=process.argv.slice(2);const F=+(fps||60);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(page)+'?capture=1');await p.waitForFunction(()=>window.render);
const ids=['corpo','mano-sinistra','mano-destra','antenna-capsula','piede-sinistro','piede-destro','occhio-sinistro-luce','occhio-destro-luce','traguardo-badge'];
const data=await p.evaluate(({ids,F})=>{const out=[];const n=Math.round(DURATION*F);
for(let i=0;i<=n;i++){render(i/F);out.push(ids.map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height];}));}return out;},{ids,F});
await b.close();
// accelerazione (seconda differenza) in px/fotogramma^2 su centro e dimensioni
for(let k=0;k<ids.length;k++){let worst=[];
 for(let i=1;i<data.length-1;i++){for(let c=0;c<4;c++){const a=data[i+1][k][c]-2*data[i][k][c]+data[i-1][k][c];worst.push([Math.abs(a),i,c]);}}
 worst.sort((x,y)=>y[0]-x[0]);console.log(ids[k].padEnd(22),worst.slice(0,4).map(w=>`${w[0].toFixed(1)}@f${w[1]}(${'xywh'[w[2]]})`).join('  '));}
})();
