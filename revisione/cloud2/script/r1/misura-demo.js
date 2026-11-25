const L = require('../lib');
(async () => { const srv = await L.servi(); await L.avvia();
  const A = await L.dispositivo('x', { tipo: 'pc' });
  const r = await A.evaluate(() => { LM.seedDemo(); const s = LM.load(); const tot = JSON.stringify(s).length; const per = {}; Object.keys(s).forEach(k => per[k] = JSON.stringify(s[k]).length); return { tot, per, azioni: s.azioni.length, giorni: 56 }; });
  console.log(JSON.stringify(r)); await L.browser().close(); srv.close(); })();
