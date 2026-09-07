/* QUANDO FARE QUESTO PASSO — gli stessi tasti-giorno della scheda.

   «Ieri» sta fra le pastiglie perché è il giorno passato che si sceglie quasi
   sempre: serve a segnare una cosa che hai fatto e ti eri dimenticato di
   mettere in agenda. */
import { useRef } from 'react';
import { Segno } from '../pezzi/pezzi';
import { usaCambioNativo } from '../pezzi/nativo';
import { LM } from '../dati/dati';
import { giorno as comeGiorno } from '../tipi/stato';
import type { Giorno, Attivita, Passo } from '../tipi/stato';
import { etichettaGiorno, chiudiSheet, aggiornaNav, toast, render } from '../app/app';

export interface PropQuandoPasso { prog: Attivita; passo: Passo }

export default function QuandoPasso({ prog, passo }: PropQuandoPasso) {
  const oggi = LM.todayKey();
  const gia = LM.snapshot().azioni.find(
    (x) => !x.done && x.passoDi && x.passoDi.b === prog.id && x.passoDi.s === passo.id);

  const metti = (k: Giorno | '') => {
    if (!k) return;
    LM.pianificaPasso(prog.id, passo.id, k);
    toast('Passo messo ' + etichettaGiorno(k).toLowerCase() + '.', 0, 'calendar');
    chiudiSheet(); aggiornaNav(); render();
  };
  const chip = (k: Giorno, et: string) =>
    <button className={'q-chip' + (gia && gia.data === k ? ' on' : '')} data-qp={k}
      onClick={() => metti(k)}>{et}</button>;

  const data = useRef<HTMLInputElement>(null);
  usaCambioNativo(data, (i) => metti(comeGiorno((i as HTMLInputElement).value)), [prog.id, passo.id]);

  /* «dopodomani» o il nome del giorno: `etichettaGiorno` dice «Mer 12», e qui
     serve solo la prima parola */
  const fraDue = LM.addDays(oggi, 2);
  const nomeFraDue = etichettaGiorno(fraDue).split(' ')[0] || 'Fra due giorni';

  return (
    <div className="sc">
      <div className="lista-eti"><Segno nome="calendar" dim={11} />Quando fare questo passo</div>
      <div className="sc-gruppo">
        <div className="q-chips">
          {chip(LM.addDays(oggi, -1), 'Ieri')}
          {chip(oggi, 'Oggi')}
          {chip(LM.addDays(oggi, 1), 'Domani')}
          {chip(fraDue, nomeFraDue)}
          {chip(LM.addDays(oggi, 7), 'Tra una settimana')}
        </div>
        <label className="sc-campo"><span>un altro giorno</span>
          <input key={gia ? gia.data : 'nuovo'} type="date" id="qp-data" ref={data}
            defaultValue={gia ? gia.data : LM.addDays(oggi, 1)} /></label>
        {gia ? (
          <button className="btn btn-mini btn-ghost" id="qp-togli" onClick={() => {
            LM.azioneInBacklog(gia.id);
            toast('Passo tolto dal giorno.', 0, 'lista');
            chiudiSheet(); aggiornaNav(); render();
          }}><Segno nome="x" dim={13} /> Togli dal giorno ({etichettaGiorno(gia.data).toLowerCase()})</button>
        ) : null}
        <div className="sc-nota">Comparirà tra le cose di quel giorno, in <b>La giornata</b>.</div>
      </div>
    </div>
  );
}
