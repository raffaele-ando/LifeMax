/* DA COSA-DA-FARE A ABITUDINE: si scelgono i giorni e, se serve, l'ora.

   Vuoti vanno bene. Un'abitudine attaccata a un'ora precisa si fa molto più
   spesso di una lasciata a «quando capita» — è la parte «quando e dove» delle
   intenzioni di attuazione — ma pretenderla qui vorrebbe dire due decisioni
   per una cosa che ne chiedeva zero.  */
import { useRef } from 'react';
import { Segno } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function DaAbitudine({ id }) {
  const a = A();
  const b = window.LM.load().backlog.find((x) => x.id === id);
  const gg = useRef(null);
  const ora = useRef(null);
  const dur = useRef(null);
  if (!b) { a.chiudiSheet(); return null; }

  const crea = () => {
    const giorni = a.leggiGiorni(gg.current);
    const o = ora.current.value || null;
    const d = dur.current.value;
    window.LM.backlogInAbitudine(b.id, giorni, { ora: o, durata: d ? +d : null });
    a.toast('Diventata un’abitudine: la trovi fra le Abitudini.', 0, 'refresh');
    a.chiudiSheet(); a.aggiornaNav(); a.ridisegnaAtt();
  };

  return (
    <div className="sc">
      <div className="lista-eti"><Segno nome="calendar" dim={11} />In che giorni</div>
      <div className="sc-gruppo">
        <div id="ab-giorni" ref={gg}
          onClick={(e) => { const c = e.target.closest('.giorno-chip'); if (c) c.classList.toggle('sel'); }}
          {...html(a.chipsGiorni([1, 2, 3, 4, 5, 6, 0]))} />
        <label className="sc-campo"><span>a che ora</span>
          <input type="time" className="tl-time" id="ab-ora" ref={ora} /></label>
        <label className="sc-campo"><span>quanto dura</span>
          <select className="tl-dur" id="ab-dur" ref={dur} defaultValue="">
            {a.DURATE.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.t}</option>)}
          </select></label>
        <div className="sc-nota">Vuoti vanno bene: l’abitudine resta senza orario fisso.</div>
      </div>
      <button className="btn btn-primario btn-grande sc-primaria" id="ab-crea" onClick={crea}>
        <Segno nome="plus" /> Crea l’abitudine
      </button>
      <div className="sc-nota" style={{ textAlign: 'center' }}>Esce da «Da fare» e la ritrovi in <b>Attività → Abitudini</b>.</div>
    </div>
  );
}
