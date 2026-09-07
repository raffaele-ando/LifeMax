/* QUANTO CI STAI — quattro voci, non quattro numeri.

   Un elenco di durate («5 · 10 · 25 · 50») chiede di decidere quanto durerà
   una cosa che non è ancora cominciata: è una domanda a cui, nel momento
   sbagliato, non si sa rispondere — e restarci sopra è un ottimo modo per non
   cominciare. Quattro modi di stare davanti alla cosa si scelgono in un colpo,
   perché uno dei quattro è come ti senti adesso.

   Il minutaggio del blocco lo porta la cosa stessa — la durata che le hai dato
   trascinandola nella Giornata; dove non c'è, venticinque. */
import { Segno } from '../pezzi/pezzi';
import { TIPI_TIMER, avviaTimer, chiudiSheet } from '../app/app';
import type { NomeTimer } from '../app/app';

const QUALI: NomeTimer[] = ['avvio', 'blocco', 'pomodoro', 'libero'];

export interface PropTimer {
  azioneId?: string | null | undefined;
  areaId?: string | null | undefined;
  testo?: string | undefined;
  minBlocco?: number | null | undefined;
}

export default function Timer({ azioneId, areaId, testo, minBlocco }: PropTimer) {
  return (
    <div className="sc">
      <div className="lista">
        {QUALI.map((k) => {
          const T = TIPI_TIMER[k];
          const min = k === 'blocco' ? (minBlocco || T.min) : T.min;
          const quanto = k === 'libero' ? 'senza fine' : (k === 'pomodoro' ? min + '′ + ' + T.pausa + '′' : min + '′');
          return (
            <button key={k} className="lista-riga sc-porta timer-scelta" data-timer-tipo={k} data-min={min}
              onClick={() => { chiudiSheet(); avviaTimer(azioneId || null, min, areaId, k, testo || ''); }}>
              <span className="lista-azione ts-ico"><Segno nome={T.ico} /></span>
              <span className="lista-corpo">
                <span className="lista-tit">{T.nome}</span>
                <span className="lista-sub">{T.dice}</span>
              </span>
              <span className="sc-val">{quanto}</span>
            </button>
          );
        })}
      </div>
      <p className="lista-nota">Mentre gira, lo schermo resta su una cosa sola. Il conto va avanti anche a telefono chiuso, e lo stesso timer si vede su tutti i tuoi dispositivi.</p>
    </div>
  );
}
