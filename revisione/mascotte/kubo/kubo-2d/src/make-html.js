const fs=require('fs');const d=__dirname;
let h=fs.readFileSync(d+'/traguardo.tpl.html','utf8');
h=h.replace('/*RIG*/',()=>fs.readFileSync(d+'/rig.js','utf8')).replace('/*ANIM*/',()=>fs.readFileSync(d+'/anim.js','utf8'));
fs.writeFileSync(d+'/../traguardo.html',h);console.log('traguardo.html',h.length);
