/* PROFILO — tu, i tuoi numeri, e le impostazioni in righe.
   Le impostazioni sono lo stesso markup di sempre (`htmlImpostazioni`), ma
   stanno in una pagina con un nome nella barra in basso invece che dietro
   un ingranaggio. */
import { useEffect, useRef, useState } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Segno, Testa } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { htmlImpostazioni, wireAspettoDati, render } from '../app/app';
import { html } from '../pezzi/grezzo';

export default function Profilo() {
  usaLM();
  const s = LM.load();
  const [modifica, setModifica] = useState(false);
  const corpo = useRef<HTMLDivElement>(null);
  const nome = (s.profilo.nome || '').trim();
  const righe = htmlImpostazioni('profilo');
  /* i fili si riattaccano solo quando il markup cambia: se è lo stesso,
     il nodo è lo stesso e i fili ci sono già */
  useEffect(() => { if (corpo.current) wireAspettoDati(corpo.current); }, [righe]);

  const bil = LM.bilancio(30);
  const numeri: [string, string, string][] = [
    ['flame', String(LM.streak().corrente), 'giorni'],
    ['check', String(LM.quanteFatte()), 'fatte'],
    ['trendUp', bil.messe ? Math.round(bil.tasso * 100) + '%' : '—', 'riuscita']
  ];

  return (<>
    <Testa titolo="Profilo" giaNellaNav />
    <section className="prof-testa">
      <div className="prof-avatar" aria-hidden="true">{(nome || 'Tu').charAt(0).toUpperCase()}</div>
      {modifica ? (
        <form className="prof-form" onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const st = LM.load();
          st.profilo.nome = String(f.get('nome') || '').trim();
          st.profilo.visione = String(f.get('visione') || '').trim();
          LM.save(); setModifica(false); render();
        }}>
          <input type="text" name="nome" defaultValue={s.profilo.nome || ''} placeholder="Il tuo nome" aria-label="Nome" autoFocus />
          <input type="text" name="visione" defaultValue={s.profilo.visione || ''} placeholder="Cosa vuoi ottenere" aria-label="Cosa vuoi ottenere" />
          <button className="btn btn-primario" type="submit">Salva</button>
        </form>
      ) : (<>
        <div className="prof-chi">
          <h1 className="prof-nome">{nome || 'Il tuo profilo'}</h1>
          {s.profilo.visione ? <p className="prof-visione">{s.profilo.visione}</p> : null}
        </div>
        <button className="prof-mod" id="prof-modifica" aria-label="Modifica il profilo" onClick={() => setModifica(true)}>
          <Segno nome="matita" dim={18} />
        </button>
      </>)}
    </section>
    <div className="prof-numeri">
      {numeri.map((n) => (
        <span className="prof-numero" key={n[2]}><b>{n[1]}</b><span>{n[2]}</span></span>
      ))}
    </div>
    <div ref={corpo} className="prof-righe" {...html(righe)} />
  </>);
}
