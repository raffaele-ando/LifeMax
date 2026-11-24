// node ricolora.js in.png out.png : sposta i blu elettrici (antenna, orecchie, piedi) sul ciclamino #b744ab
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [inp,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage();
const data='data:image/png;base64,'+fs.readFileSync(inp).toString('base64');
const res=await p.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
const d=x.getImageData(0,0,c.width,c.height),a=d.data;
const rgb2hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;let h=0,s=0;if(M!==m){const dd=M-m;s=l>.5?dd/(2-M-m):dd/(M+m);h=M===r?(g-b)/dd+(g<b?6:0):M===g?(b-r)/dd+2:(r-g)/dd+4;h*=60;}return [h,s,l];};
const hsl2rgb=(h,s,l)=>{h/=360;const f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};if(!s)return[l,l,l].map(v=>v*255);const q=l<.5?l*(1+s):l+s-l*s,p2=2*l-q;return[f(p2,q,h+1/3),f(p2,q,h),f(p2,q,h-1/3)].map(v=>v*255);};
for(let i=0;i<a.length;i+=4){const [h,s,l]=rgb2hsl(a[i],a[i+1],a[i+2]);
  if(h>200&&h<245&&s>.45&&l>.28&&l<.85){ // blu elettrico, non il visore blu notte
    const k=Math.min(1,(s-.45)/.2); const nh=h+(306-222), ns=s*.82, nl=l*.98;
    const [r,g,bb]=hsl2rgb(((nh%360)+360)%360,ns,nl); a[i]=a[i]+(r-a[i])*k;a[i+1]=a[i+1]+(g-a[i+1])*k;a[i+2]=a[i+2]+(bb-a[i+2])*k;}}
x.putImageData(d,0,0);return c.toDataURL('image/png');},data);
fs.writeFileSync(out,Buffer.from(res.split(',')[1],'base64'));await b.close();})();
