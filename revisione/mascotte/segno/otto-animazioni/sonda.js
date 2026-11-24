// node sonda.js pagina.html "espressione JS con t" t0 t1 passo
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [pag,expr,a,b,st]=process.argv.slice(2);const br=await chromium.launch();const p=await br.newPage();
await p.goto('file://'+path.resolve(pag));
const r=await p.evaluate(([expr,a,b,st])=>{const out=[];for(let t=+a;t<=+b+1e-9;t+=+st){out.push(t.toFixed(3)+' '+JSON.stringify(eval(expr)));}return out;},[expr,a,b,st]);
console.log(r.join('\n'));await br.close();})();
