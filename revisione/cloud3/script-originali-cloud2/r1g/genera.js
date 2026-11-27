/* genera una storia realistica di N giorni direttamente nello stato (in pagina) */
module.exports = function (giorni) {
  const s = LM.load();
  s.onboarded = true; s.profilo.nome = 'Mario';
  const aree = s.aree.map(a => a.id);
  const ora = Date.now(), G = 86400000;
  const rid = () => Math.random().toString(36).slice(2, 10);
  const dk = (t) => LM.dayKey(new Date(t));
  for (let h = 0; h < 6; h++) s.abitudini.push({ id: 'h' + h, testo: 'Abitudine ' + h + ' con un nome normale', areaId: aree[h % aree.length], giorni: [0,1,2,3,4,5,6], ora: null, durata: null, creata: ora - giorni * G, fatti: {}, da: dk(ora - giorni * G), a: null, salti: {} });
  for (let g = giorni; g >= 0; g--) {
    const t = ora - g * G, k = dk(t);
    for (let i = 0; i < 7; i++) {
      const fatta = Math.random() < 0.7;
      s.azioni.push({ id: rid(), areaId: aree[i % aree.length], testo: 'Cosa da fare numero ' + i + ' del giorno, scritta in modo normale', ifThen: i === 0 ? 'se arrivo in ufficio allora comincio da qui' : '', mit: i === 0, done: fatta, data: k, doneAt: fatta ? t + i * 3600000 : null, creata: t, ora: i < 3 ? '09:00' : null, durata: i < 3 ? 30 : null, passoDi: null });
    }
    s.abitudini.forEach((h, j) => { if (Math.random() < 0.6) h.fatti[k] = true; });
    s.checkins.push({ data: k, ts: t + 1000, energia: 3, focus: 4, umore: 3, contesto: 'casa' });
    for (let j = 0; j < 2; j++) s.sessioni.push({ id: 'se' + g + '_' + j, giorno: k, areaId: aree[j], azioneId: null, testo: 'lavoro concentrato', tipo: 'pomodoro', inizio: t + j * 7200000, minuti: 25, creata: t, aggiornata: t });
    s.valutazioni[k] = {}; aree.forEach(a => s.valutazioni[k][a] = 3 + (g % 3));
    s.reviewSera[k] = { ts: t, vittoria: 'ho finito la cosa principale della giornata', blocco: 'troppe notifiche', shutdown: true };
    s.pianoMattina[k] = { compilato: true, intenzione: 'concentrarmi su una cosa sola', ts: t };
    s.xpPerGiorno[k] = 60; s.xp += 60;
    if (g % 3 === 0) s.inbox.push({ id: rid(), testo: 'idea catturata al volo ' + g, creata: t });
    if (g % 5 === 0) s.backlog.push({ id: rid(), testo: 'progetto ' + g, areaId: aree[0], creata: t, steps: [{ id: rid(), testo: 'passo uno', done: true }, { id: rid(), testo: 'passo due', done: false }] });
    if (g % 7 === 0) s.reviewSettimana[k] = { ts: t, vittorie: 'settimana buona', blocchi: 'sonno', imparato: 'meglio la mattina', prossima: 'meno riunioni' };
    if (g % 10 === 0) s.lezioni.push({ id: rid(), testo: 'lezione imparata ' + g, verso: 'si', forza: 'media', areaId: null, creata: t, aggiornata: t });
  }
  for (let i = 0; i < 800; i++) s.registro.push({ ts: ora - i * 60000, cat: 'azione', testo: 'Completata «Cosa da fare numero 3 del giorno» (+10 XP)', imp: false });
  LM.save();
  return JSON.stringify(LM.snapshotPerCloud()).length;
};
