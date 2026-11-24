/* I DATI NEL CLOUD, DIVISI IN PEZZI.

   PERCHÉ. Fino a qui tutto lo stato stava in UN documento di Firestore
   (`users/{uid}`, campo `data`), e un documento di Firestore non può
   superare 1 MiB. Misurato: novanta giorni di uso fanno 339 KB, un anno
   1087 KB — e lì ogni salvataggio cominciava a fallire, per sempre, con un
   messaggio che parlava di configurazione. Con un uso normale ci si arriva
   in un anno e mezzo.

   COME. Lo stato si divide per CAMPO e per TRIMESTRE:
     · le righe che hanno una data (azioni, check-in, diario, sessioni del
       timer, lapidi) vanno nel pezzo del loro trimestre, `azioni.2026q4`;
     · i dizionari per giorno (voti, minuti, rituali, sonno, punti) vanno
       tutti insieme in `giorni.2026q4`;
     · gli orologi delle chiavi nel trimestre della loro ora;
     · tutto il resto (profilo, aree, abitudini, cose da fare, scoperte…)
       nel pezzo `base`.
   Un pezzo resta piccolo anche dopo anni, e un salvataggio riscrive solo i
   pezzi cambiati — quasi sempre due o tre — invece di tutto.
   E se un pezzo crescesse lo stesso oltre misura, si affetta: ogni fetta è
   un documento suo (vedi `affetta`), quindi un limite per documento non c'è
   più.

   Qui ci sono solo funzioni pure, senza Firebase: si provano da sole. */

const GIORNI = ['valutazioni', 'minuti', 'pianoMattina', 'reviewSera', 'reviewSettimana', 'xpPerGiorno', 'ritmoGiorno', 'xpConti'];
const RIGHE: Record<string, (r: Record<string, unknown>) => unknown> = {
  azioni: (r) => r['data'] || r['creata'],
  checkins: (r) => r['data'] || r['ts'],
  registro: (r) => r['ts'],
  sessioni: (r) => r['giorno'] || r['inizio'],
  cancellati: (r) => r['ts']
};
/* fuori dai pezzi: l'ora del documento sta nel documento principale */
const FUORI: Record<string, 1> = { updatedAt: 1 };

function eOggetto(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/* il trimestre di un giorno ('2026-11-20') o di un istante (in UTC, così è
   lo stesso su ogni dispositivo qualunque sia il suo fuso) */
export function trimestre(v: unknown): string {
  let a = 0, m = 0;
  if (typeof v === 'string' && /^\d{4}-\d\d/.test(v)) { a = +v.slice(0, 4); m = +v.slice(5, 7); }
  else if (typeof v === 'number' && v > 0 && isFinite(v)) { const d = new Date(v); a = d.getUTCFullYear(); m = d.getUTCMonth() + 1; }
  if (!a || !m) return 'x';
  return a + 'q' + Math.ceil(m / 3);
}

/* JSON con le chiavi in ordine: due dispositivi che hanno gli stessi dati
   scrivono lo stesso testo, e la stessa impronta */
export function ordinato(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(ordinato);
  if (eOggetto(v)) {
    const out: Record<string, unknown> = {};
    Object.keys(v).sort().forEach((k) => { if (v[k] !== undefined) out[k] = ordinato(v[k]); });
    return out;
  }
  return v;
}

/* L'IMPRONTA DI UN PEZZO. Due pezzi con la stessa impronta hanno lo stesso
   contenuto, e allora non si riscrive niente. L'ordine delle RIGHE non
   conta (due dispositivi le uniscono in ordine diverso, e non è un
   cambiamento): per l'impronta le righe di ogni campo si mettono in fila. */
export function impronta(parte: Record<string, unknown>): string {
  const c: Record<string, unknown> = {};
  Object.keys(parte).sort().forEach((k) => {
    const v = ordinato(parte[k]);
    c[k] = Array.isArray(v) ? v.map((x) => JSON.stringify(x)).sort() : v;
  });
  return hash(JSON.stringify(c));
}

/* cyrb53: veloce, 53 bit, abbastanza per dire «è cambiato» */
export function hash(t: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < t.length; i++) {
    const ch = t.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export interface Pezzo { nome: string; testo: string; h: string }

/* LO STATO → I PEZZI */
export function dividi(stato: unknown): Record<string, Pezzo> {
  const parti: Record<string, Record<string, unknown>> = {};
  const metti = (nome: string): Record<string, unknown> => parti[nome] || (parti[nome] = {});
  if (!eOggetto(stato)) return {};
  Object.keys(stato).forEach((k) => {
    if (FUORI[k]) return;
    const v = stato[k];
    const regola = RIGHE[k];
    if (regola && Array.isArray(v)) {
      v.forEach((r) => {
        const t = trimestre(eOggetto(r) ? regola(r) : null);
        const p = metti(k + '.' + t);
        const righe = (Array.isArray(p[k]) ? p[k] : (p[k] = [])) as unknown[];
        righe.push(r);
      });
      return;
    }
    if (GIORNI.indexOf(k) >= 0 && eOggetto(v)) {
      Object.keys(v).forEach((g) => {
        const t = /^\d{4}-\d\d-\d\d$/.test(g) ? trimestre(g) : 'x';
        const p = metti('giorni.' + t);
        const m = (p[k] as Record<string, unknown>) || (p[k] = {});
        (m as Record<string, unknown>)[g] = v[g];
      });
      return;
    }
    if (k === 'orologi' && eOggetto(v)) {
      Object.keys(v).forEach((via) => {
        const p = metti('orologi.' + trimestre(v[via]));
        const m = (p[k] as Record<string, unknown>) || (p[k] = {});
        (m as Record<string, unknown>)[via] = v[via];
      });
      return;
    }
    metti('base')[k] = v;
  });
  /* un campo vuoto deve comunque esserci da qualche parte, se no chi
     ricompone non sa che è vuoto apposta */
  const base = metti('base');
  Object.keys(stato).forEach((k) => {
    if (FUORI[k]) return;
    const v = stato[k];
    if ((RIGHE[k] && Array.isArray(v) && !v.length) || ((GIORNI.indexOf(k) >= 0 || k === 'orologi') && eOggetto(v) && !Object.keys(v).length)) {
      base[k] = Array.isArray(v) ? [] : {};
    }
  });
  const out: Record<string, Pezzo> = {};
  Object.keys(parti).forEach((nome) => {
    const parte = parti[nome] || {};
    out[nome] = { nome: nome, testo: JSON.stringify(ordinatoFuoriDalleRighe(parte)), h: impronta(parte) };
  });
  return out;
}
/* il testo che si salva: chiavi in ordine, ma le righe nell'ordine in cui
   stanno (l'ordine delle aree e dei passi lo vede chi usa l'app) */
function ordinatoFuoriDalleRighe(parte: Record<string, unknown>): unknown {
  const out: Record<string, unknown> = {};
  Object.keys(parte).sort().forEach((k) => { out[k] = ordinato(parte[k]); });
  return out;
}

/* I PEZZI → LO STATO. Le righe si mettono in fila, i dizionari si uniscono. */
export function ricomponi(testi: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  testi.forEach((t) => {
    let parte: unknown;
    try { parte = JSON.parse(t); } catch { parte = null; }
    if (!eOggetto(parte)) return;
    Object.keys(parte).forEach((k) => {
      const v = parte[k];
      const c = out[k];
      if (Array.isArray(v) && (RIGHE[k] || Array.isArray(c))) { out[k] = (Array.isArray(c) ? c : []).concat(v); return; }
      if (eOggetto(v) && (GIORNI.indexOf(k) >= 0 || k === 'orologi')) { out[k] = Object.assign(eOggetto(c) ? c : {}, v); return; }
      out[k] = v;
    });
  });
  return out;
}

/* UN TESTO LUNGO IN FETTE. Una fetta sta comoda in un documento (sotto i
   300 mila caratteri: anche se fossero tutti lettere accentate, in UTF-8
   restano sotto il megabyte). Non si taglia mai in mezzo a una coppia di
   caratteri che insieme fanno un simbolo solo (le emoji): metà simbolo non
   è un testo valido, e Firestore lo rifiuterebbe. */
export const FETTA = 250000;
export function affetta(testo: string, misura?: number): string[] {
  const m = misura || FETTA;
  const out: string[] = [];
  let i = 0;
  while (i < testo.length) {
    let j = Math.min(testo.length, i + m);
    if (j < testo.length) {
      const c = testo.charCodeAt(j - 1);
      if (c >= 0xd800 && c <= 0xdbff) j--;
    }
    out.push(testo.slice(i, j));
    i = j;
  }
  if (!out.length) out.push('');
  return out;
}
