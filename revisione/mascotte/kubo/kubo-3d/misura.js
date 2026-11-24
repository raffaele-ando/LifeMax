const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const f of process.argv.slice(2)){const data='data:image/png;base64,'+fs.readFileSync(f).toString('base64');
const r=await p.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const a=x.getImageData(0,0,c.width,c.height).data;
const rgb2hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;let h=0,s=0;if(M!==m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return [h,s,l];};
const G={blu:[],visore:[],oro:[],bianco:[]};
for(let i=0;i<a.length;i+=16){const [h,s,l]=rgb2hsl(a[i],a[i+1],a[i+2]);const px=[a[i],a[i+1],a[i+2]];
 if(h>205&&h<235&&s>.7&&l>.35&&l<.6)G.blu.push(px); else if(h>215&&h<240&&l<.25&&l>.08&&s>.25)G.visore.push(px); else if(h>35&&h<55&&s>.8&&l>.45&&l<.65)G.oro.push(px); else if(l>.88&&l<.97&&s<.6&&h>200&&h<260)G.bianco.push(px);}
const med=v=>{if(!v.length)return null;const k=[0,1,2].map(j=>v.map(p=>p[j]).sort((x,y)=>x-y)[v.length>>1]);return '#'+k.map(n=>n.toString(16).padStart(2,'0')).join('')+' n='+v.length;};
return Object.fromEntries(Object.entries(G).map(([k,v])=>[k,med(v)]));},data);console.log(f.split('/').pop().slice(13,21),JSON.stringify(r));}
await b.close();})();
