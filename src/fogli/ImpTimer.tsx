/* IL TIMER COME LO VUOI TU: quale parte al tocco, e quanto dura ognuno.
   Ogni cambio si salva subito: non c'è un «Salva» da dimenticare. */
import { useState } from 'react';
import { LM } from '../dati/dati';
import type { ImpostazioniTimer, NomeTimerDati } from '../tipi/stato';
import { TIPI_TIMER } from '../app/app';

const MINUTI = [1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 90, 120];

function Durata({ id, eti, val, valori, zero, onCambia }: {
  id: string; eti: string; val: number; valori: number[]; zero?: string; onCambia: (v: number) => void;
}) {
  return (
    <label className="gr-riga" htmlFor={id}><span className="gr-eti">{eti}</span>
      <select id={id} className="gr-val" value={String(val)} onChange={(e) => onCambia(+e.target.value)}>
        {zero ? <option value="0">{zero}</option> : null}
        {valori.map((m) => <option key={m} value={String(m)}>{m + ' min'}</option>)}
      </select>
    </label>
  );
}

export default function ImpTimer() {
  const [, ridisegna] = useState(0);
  const r: ImpostazioniTimer = LM.load().profilo.timer || {};
  const cambia = (patch: Partial<ImpostazioniTimer>) => {
    const st = LM.load();
    st.profilo.timer = Object.assign({}, st.profilo.timer || {}, patch);
    LM.save();
    ridisegna((n) => n + 1);
  };
  const v = (x: number | undefined, d: number) => (typeof x === 'number' && x >= 0 ? x : d);
  return (
    <div className="sc">
      <div className="gr-titolo">Avvio</div>
      <div className="gr">
        <label className="gr-riga" htmlFor="it-pred"><span className="gr-eti">Timer predefinito</span>
          <select id="it-pred" className="gr-val" value={r.predefinito || ''}
            onChange={(e) => cambia({ predefinito: e.target.value as NomeTimerDati | '' })}>
            <option value="">Chiedi sempre</option>
            {(['avvio', 'blocco', 'pomodoro', 'libero'] as NomeTimerDati[]).map((k) =>
              <option key={k} value={k}>{TIPI_TIMER[k].nome}</option>)}
          </select>
        </label>
      </div>

      <div className="gr-titolo">Avvio rapido</div>
      <div className="gr">
        <Durata id="it-avvio" eti="Durata" val={v(r.avvio, 5)} valori={MINUTI} onCambia={(x) => cambia({ avvio: x })} />
        <Durata id="it-poi" eti="Poi continua per" val={v(r.poi, 25)} valori={MINUTI} onCambia={(x) => cambia({ poi: x })} />
      </div>

      <div className="gr-titolo">Sessione</div>
      <div className="gr">
        <Durata id="it-blocco" eti="Durata" val={v(r.blocco, 25)} valori={MINUTI} onCambia={(x) => cambia({ blocco: x })} />
      </div>

      <div className="gr-titolo">Pomodoro</div>
      <div className="gr">
        <Durata id="it-pom" eti="Concentrazione" val={v(r.pomodoro, 25)} valori={MINUTI} onCambia={(x) => cambia({ pomodoro: x })} />
        <Durata id="it-pausa" eti="Pausa breve" val={v(r.pausa, 5)} valori={MINUTI} onCambia={(x) => cambia({ pausa: x })} />
        <Durata id="it-lunga" eti="Pausa lunga ogni 4" val={v(r.pausaLunga, 0)} valori={MINUTI} zero="Mai"
          onCambia={(x) => cambia({ pausaLunga: x })} />
      </div>
    </div>
  );
}
