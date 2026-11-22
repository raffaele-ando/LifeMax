/* PROFILO — tu, i tuoi numeri, e le impostazioni in righe.
   Le impostazioni sono lo stesso markup di sempre (`htmlImpostazioni`), ma
   stanno in una pagina con un nome nella barra in basso invece che dietro
   un ingranaggio. */
import { useEffect, useRef } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Testa } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { htmlImpostazioni, wireAspettoDati, render } from '../app/app';
import { html } from '../pezzi/grezzo';

export default function Profilo() {
  usaLM();
  const s = LM.load();
  const corpo = useRef<HTMLDivElement>(null);
  const nome = (s.profilo.nome || '').trim();
  const righe = htmlImpostazioni('profilo');
  /* i fili si riattaccano solo quando il markup cambia: se è lo stesso,
     il nodo è lo stesso e i fili ci sono già */
  useEffect(() => { if (corpo.current) wireAspettoDati(corpo.current); }, [righe]);

  const bil = LM.bilancio(30);
  const numeri: [string, string, string][] = [
    ['flame', String(LM.streak().corrente), 'giorni di fila'],
    ['check', String(LM.quanteFatte()), 'attività fatte in tutto'],
    ['trendUp', bil.messe ? Math.round(bil.tasso * 100) + '%' : '—', 'fatte negli ultimi 30 giorni']
  ];

  return (<>
    <Testa titolo="Profilo" giaNellaNav />
    <section className="prof-testa">
      <div className="prof-avatar" aria-hidden="true">{(nome || 'Tu').charAt(0).toUpperCase()}</div>
      {/* nome e obiettivo si cambiano toccandoli, dove si leggono */}
      <div className="prof-chi">
        <input key={'n' + nome} className="prof-nome nome-in-linea" type="text" defaultValue={s.profilo.nome || ''}
          placeholder="Il tuo nome" aria-label="Il tuo nome"
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          onBlur={(e) => { const st = LM.load(); const v = e.target.value.trim(); if (v !== (st.profilo.nome || '')) { st.profilo.nome = v; LM.save(); render(); } }} />
        <textarea key={'v' + (s.profilo.visione || '')} className="prof-visione nome-in-linea" rows={2} defaultValue={s.profilo.visione || ''}
          placeholder="Cosa vuoi ottenere" aria-label="Cosa vuoi ottenere"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); } }}
          onBlur={(e) => { const st = LM.load(); const v = e.target.value.trim(); if (v !== (st.profilo.visione || '')) { st.profilo.visione = v; LM.save(); render(); } }} />
      </div>
    </section>
    <div className="prof-numeri">
      {numeri.map((n) => (
        <span className="prof-numero" key={n[2]}><b>{n[1]}</b><span>{n[2]}</span></span>
      ))}
    </div>
    <div ref={corpo} className="prof-righe" {...html(righe)} />
  </>);
}
