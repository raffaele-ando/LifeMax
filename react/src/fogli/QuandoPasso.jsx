/* QUANDO FARE QUESTO PASSO — gli stessi tasti-giorno della scheda.

   «Ieri» sta fra le pastiglie perché è il giorno passato che si sceglie quasi
   sempre: serve a segnare una cosa che hai fatto e ti eri dimenticato di
   mettere in agenda.  */
import { useRef } from 'react';
import { Segno } from '../pezzi.jsx';
import { usaCambioNativo } from '../nativo.js';

const A = () => window.LM_APP;

export default function QuandoPasso({ prog, passo }) {
  const a = A();
  const oggi = window.LM.todayKey();
  const gia = window.LM.snapshot().azioni.find(
    (x) => !x.done && x.passoDi && x.passoDi.b === prog.id && x.passoDi.s === passo.id);

  const metti = (k) => {
    if (!k) return;
    window.LM.pianificaPasso(prog.id, passo.id, k);
    a.toast('Passo messo ' + a.etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
    a.chiudiSheet(); a.aggiornaNav(); a.ridisegnaAtt();
  };
  const chip = (k, et) =>
    <button className={'q-chip' + (gia && gia.data === k ? ' on' : '')} data-qp={k}
      onClick={() => metti(k)}>{et}</button>;

  const data = useRef(null);
  usaCambioNativo(data, (i) => metti(i.value), [prog.id, passo.id]);

  return (
    <div className="sc">
      <div className="lista-eti"><Segno nome="calendar" dim={11} />Quando fare questo passo</div>
      <div className="sc-gruppo">
        <div className="q-chips">
          {chip(window.LM.addDays(oggi, -1), 'Ieri')}
          {chip(oggi, 'Oggi')}
          {chip(window.LM.addDays(oggi, 1), 'Domani')}
          {chip(window.LM.addDays(oggi, 2), a.etichettaGiorno(window.LM.addDays(oggi, 2)).split(' ')[0])}
          {chip(window.LM.addDays(oggi, 7), 'Tra una settimana')}
        </div>
        <label className="sc-campo"><span>un altro giorno</span>
          <input key={gia ? gia.data : 'nuovo'} type="date" id="qp-data" ref={data}
            defaultValue={gia ? gia.data : window.LM.addDays(oggi, 1)} /></label>
        {gia ? (
          <button className="btn btn-mini btn-ghost" id="qp-togli" onClick={() => {
            window.LM.azioneInBacklog(gia.id);
            a.toast('Passo tolto dal giorno.', 0, 'lista');
            a.chiudiSheet(); a.aggiornaNav(); a.ridisegnaAtt();
          }}><Segno nome="x" dim={13} /> Togli dal giorno ({a.etichettaGiorno(gia.data).toLowerCase()})</button>
        ) : null}
        <div className="sc-nota">Comparirà tra le cose di quel giorno, in <b>La giornata</b>.</div>
      </div>
    </div>
  );
}
