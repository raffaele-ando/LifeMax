// uso: node cattura.js pagina.html chiavi t1,t2,...   |   node cattura.js pagina.html video nome.mp4 [fps]
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {execFileSync}=require('child_process');
(async()=>{
  const [pag,modo,arg,fpsA]=process.argv.slice(2); const nome=path.basename(pag,'.html');
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1080}}); const err=[]; p.on('pageerror',e=>err.push(e.message));
  await p.goto('file://'+path.resolve(pag)); await p.waitForTimeout(400);
  if(modo==='chiavi'){
    const dir=path.join(path.dirname(path.resolve(pag)),'chiavi-'+nome); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
    for(const t of arg.split(',').map(Number)){ await p.evaluate(t=>render(t),t); await p.screenshot({path:path.join(dir,`t${t.toFixed(2)}.png`)}); }
    execFileSync('ffmpeg',['-loglevel','error','-y','-pattern_type','glob','-i',path.join(dir,'t*.png'),'-vf','scale=300:300,tile=6x'+Math.ceil(arg.split(',').length/6),path.join(dir,'foglio.png')]);
    console.log('foglio:',path.join(dir,'foglio.png'));
  } else {
    const fps=Number(fpsA||60); const dir=path.join(path.dirname(path.resolve(pag)),'frames-'+nome);
    fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
    const dur=await p.evaluate(()=>DURATA); const n=Math.round(dur*fps);
    for(let i=0;i<n;i++){ await p.evaluate(t=>render(t),i/fps); await p.screenshot({path:path.join(dir,`f${String(i).padStart(4,'0')}.png`)}); }
    execFileSync('ffmpeg',['-loglevel','error','-y','-framerate',String(fps),'-i',path.join(dir,'f%04d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-movflags','+faststart',path.resolve(arg)]);
    fs.rmSync(dir,{recursive:true,force:true}); console.log('video',arg,n,'fotogrammi');
  }
  console.log('errori',err); await b.close();
})();
