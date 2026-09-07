/* DA COSA-DA-FARE A ABITUDINE: si scelgono i giorni e, se serve, l'ora.

   Vuoti vanno bene. Un'abitudine attaccata a un'ora precisa si fa molto più
   spesso di una lasciata a «quando capita» — è la parte «quando e dove» delle
   intenzioni di attuazione — ma pretenderla qui vorrebbe dire due decisioni
   per una cosa che ne chiedeva zero. */
import { useRef } from 'react';
import { Segno } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { ora as comeOra } from '../tipi/stato';
import { chipsGiorni, leggiGiorni, DURATE, chiudiSheet, aggiornaNav, toast, render } from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function DaAbitudine({ id }: { id: string }) {
  const b = LM.load().backlog.find((x) => x.id === id);
  const gg = useRef<HTMLDivElement>(null);
  const ora = useRef<HTMLInputElement>(null);
  const dur = useRef<HTMLSelectElement>(null);
  if (!b) { chiudiSheet(); return null; }
  const quella = b;

  const crea = () => {
    if (!gg.current) return;
    const giorni = leggiGiorni(gg.current);
    const scritta = ora.current ? ora.current.value : '';
    const o = scritta ? comeOra(scritta) : null;
    const d = dur.current ? dur.current.value : '';
    LM.backlogInAbitudine(quella.id, giorni, { ora: o, durata: d ? +d : null });
    toast('Diventata un’abitudine: la trovi fra le Abitudini.', 0, 'refresh');
    chiudiSheet(); aggiornaNav(); render();
  };

  return (
    <div className="sc">
      <div className="lista-eti"><Segno nome="calendar" dim={11} />In che giorni</div>
      <div className="sc-gruppo">
        <div id="ab-giorni" ref={gg}
          onClick={(e) => {
            const t = e.target;
            if (!(t instanceof Element)) return;
            const c = t.closest('.giorno-chip');
            if (c) c.classList.toggle('sel');
          }}
          {...html(chipsGiorni([1, 2, 3, 4, 5, 6, 0]))} />
        <label className="sc-campo"><span>a che ora</span>
          <input type="time" className="tl-time" id="ab-ora" ref={ora} /></label>
        <label className="sc-campo"><span>quanto dura</span>
          <select className="tl-dur" id="ab-dur" ref={dur} defaultValue="">
            {DURATE.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.t}</option>)}
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
