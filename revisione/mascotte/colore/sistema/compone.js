const path=require('path'),fs=require('fs');
(async()=>{const b=await require('/home/user/LifeMax/prove/comune/lancia')();
for(const n of ['per-area','mese','abitudini']){
 let h='<body style="margin:0;display:grid;grid-template-columns:repeat(6,390px);gap:6px;background:#888">';
 for(const t of ['light','dark'])for(const m of ['norm','deut','prot'])h+=`<div><div style="font:bold 20px system-ui;background:#fff;padding:4px">${n} ${t} ${m}</div><img src="cvd-${n}-${t}-${m}.png"></div>`;
 fs.writeFileSync(path.join(__dirname,'_c.html'),h);
 const p=await b.newPage({viewport:{width:2380,height:880}});await p.goto('file://'+path.join(__dirname,'_c.html'));await p.waitForTimeout(300);
 await p.screenshot({path:path.join(__dirname,`foglio-cvd-${n}.png`)});await p.close();}
await b.close();})();
