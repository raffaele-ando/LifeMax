// uso: node cattura.js frames [fps]   oppure   node cattura.js chiavi t1,t2,...
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{
  const modo=process.argv[2]; const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1080}}); const err=[]; p.on('pageerror',e=>err.push(e.message));
  await p.goto('file://'+path.join(__dirname,'segno-traguardo.html')); await p.waitForTimeout(400);
  if(modo==='chiavi'){
    fs.mkdirSync(path.join(__dirname,'chiavi'),{recursive:true});
    for(const t of process.argv[3].split(',').map(Number)){
      await p.evaluate(t=>render(t),t);
      await p.screenshot({path:path.join(__dirname,'chiavi',`t${t.toFixed(2)}.png`)});
    }
  } else {
    const fps=Number(process.argv[3]||60); const dir=path.join(__dirname,'frames');
    fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
    const dur=await p.evaluate(()=>DURATA); const n=Math.round(dur*fps);
    for(let i=0;i<n;i++){ await p.evaluate(t=>render(t),i/fps);
      await p.screenshot({path:path.join(dir,`f${String(i).padStart(4,'0')}.png`)}); }
    console.log('frames',n);
  }
  console.log('errori',err); await b.close();
})();
