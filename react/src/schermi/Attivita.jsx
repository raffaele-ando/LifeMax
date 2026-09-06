/* ATTIVITÀ — la prima schermata convertita, e non a caso.

   È la più «elenco» di tutte: righe che si spuntano, si spostano, si
   cancellano. È quindi quella dove il ridisegno totale costa di più — oggi
   spuntare una cosa rifà l'intera schermata — ed è anche quella dove un
   difetto fa meno danni: non c'è niente legato all'orologio, niente timer che
   corre, niente review della sera che si perde. Non ho cominciato da «Adesso»
   apposta: quella si apre ogni mattina.

   I dati arrivano da `LM` attraverso `usaLM`, che ridisegna quando arriva
   `lm:change`. Le azioni chiamano `LM` e basta: è lui a emettere l'evento, e
   il giro si chiude da sé. Questo è il pezzo che in vanilla erano
   sessantadue chiamate a `render()` sparse, una per ogni punto che tocca i
   dati — e ogni volta che qualcuno se ne dimenticava era un bug.  */
import { useState } from 'react';
import { usaLM } from '../usaLM.js';
import { Scheda, Elenco, Riga, Niente, Segmenti, Tasto } from '../pezzi.jsx';

const SCHEDE = [
  { val: 'inbox', eti: 'Da sistemare', ico: 'inbox' },
  { val: 'backlog', eti: 'Da fare', ico: 'list' },
  { val: 'arrivo', eti: 'In arrivo', ico: 'calendar' },
  { val: 'progetti', eti: 'Progetti', ico: 'layers' }
];

export default function Attivita() {
  const [scheda, setScheda] = useState('inbox');
  const s = usaLM((LM) => LM.load());

  const voci = scheda === 'inbox' ? (s.inbox || [])
    : scheda === 'backlog' ? (s.backlog || []).filter((b) => !b.done)
    : scheda === 'arrivo' ? (s.backlog || []).filter((b) => !b.done && b.scadenza)
    : (s.backlog || []).filter((b) => b.steps && b.steps.length);

  return (
    <>
      <Segmenti id="att-tabs" piu="sez-nav" etichetta="Schede di Attività"
        voci={SCHEDE} scelta={scheda} onScegli={setScheda} />

      <Scheda titolo={SCHEDE.find((x) => x.val === scheda).eti}>
        {voci.length === 0
          ? <Niente titolo="Qui non c’è niente."
              dice="Quello che butti giù col tasto ＋ finisce in «Da sistemare»." />
          : <Elenco>
              {voci.map((v) => (
                <Riga key={v.id} mestiere="fa" titolo={v.testo}
                  sotto={v.scadenza ? 'entro il ' + v.scadenza : undefined} />
              ))}
            </Elenco>}
      </Scheda>

      <div className="riga-flex mt-s">
        <Tasto testo="Torna al vecchio disegno" ico="refresh" tipo="quieto" misura="mini"
          onClick={() => { location.search = '?classico=1'; }} />
      </div>
    </>
  );
}
