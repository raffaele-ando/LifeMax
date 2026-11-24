// node cattura.js pagina.html chiavi t1,t2 | video out.mp4 [fps]
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const http=require('http');const {execFileSync}=require('child_process');
(async()=>{const [pag,modo,arg,fpsA]=process.argv.slice(2);const nome=path.basename(pag,'.html');
const srv=http.createServer((q,r)=>{const f=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.statusCode=404;return r.end();}r.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':'text/html');r.end(d);});});
await new Promise(r=>srv.listen(8871,r));
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1080}});const err=[];p.on('pageerror',e=>err.push(e.message));p.on('console',m=>{if(m.type()==='error')err.push(m.text())});
await p.goto('http://localhost:8871/'+pag);await p.waitForFunction(()=>window.pronto,null,{timeout:20000}).catch(()=>{});
const scatta=async(t,f)=>{await p.evaluate(t=>render(t),t);await p.locator('canvas').screenshot({path:f});};
if(modo==='chiavi'){const dir=path.join(__dirname,'chiavi-'+nome);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);const ts=arg.split(',').map(Number);
 for(const t of ts)await scatta(t,path.join(dir,`t${t.toFixed(2)}.png`));
 execFileSync('ffmpeg',['-loglevel','error','-y','-pattern_type','glob','-i',path.join(dir,'t*.png'),'-vf','scale=300:300,tile=6x'+Math.ceil(ts.length/6),path.join(dir,'foglio.png')]);console.log('foglio',path.join(dir,'foglio.png'));}
else{const fps=Number(fpsA||60);const dir=path.join(__dirname,'frames-'+nome);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);
 const n=Math.round(await p.evaluate(()=>DURATA)*fps);for(let i=0;i<n;i++)await scatta(i/fps,path.join(dir,`f${String(i).padStart(4,'0')}.png`));
 execFileSync('ffmpeg',['-loglevel','error','-y','-framerate',String(fps),'-i',path.join(dir,'f%04d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-movflags','+faststart',path.resolve(arg)]);fs.rmSync(dir,{recursive:true,force:true});console.log('video',arg,n);}
console.log('errori',err);await b.close();srv.close();})();
