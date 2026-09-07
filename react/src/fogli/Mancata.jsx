/* «NON DEL TUTTO» — quello che succede quando una cosa non è andata.

   Il perché si chiede, ma non si pretende: cinque risposte a un tocco e un
   campo libero, e si può chiudere senza rispondere. Chiedere un perché
   obbligatorio nel momento in cui una cosa è andata male è il modo più rapido
   per far smettere di dirlo — e a quel punto si torna a cancellare, che è la
   cosa che questo esito esiste per evitare.

   E LA PRIMA DOMANDA È QUANTO, NON PERCHÉ. Chi arriva qui ha appena mollato
   qualcosa: la prima cosa che l'app gli dice deve riconoscere il pezzo che ha
   fatto, non chiedergli conto di quello che manca.  */
import { useRef, useState } from 'react';
import { Segno } from '../pezzi.jsx';

const A = () => window.LM_APP;

function Chips({ id, voci, attributo, scelto, onScegli }) {
  return (
    <div className="q-chips" id={id}>
      {voci.map((x) => {
        const suo = { className: 'q-chip' + (scelto === x.id ? ' on' : ''), key: x.id };
        suo[attributo] = x.id;
        return <button {...suo} onClick={() => onScegli(x.id)}>{x.eti}</button>;
      })}
    </div>
  );
}

export default function Mancata({ id, testo, dopo }) {
  const a = A();
  /* le pastiglie partono tutte spente. Dentro, «quanto» vale già «niente»:
     è la risposta di chi chiude senza toccare nulla, ed è giusto che non
     sembri una scelta fatta. */
  const [quanto, setQuanto] = useState('');
  const [perche, setPerche] = useState('');
  const nota = useRef(null);

  /* LA SCELTA STA ANCHE IN UN RIFERIMENTO, E NON È UN DOPPIONE.
     Nel codice di prima erano due variabili normali: toccare una pastiglia le
     cambiava, e il tasto «Segna e vai avanti» leggeva il valore di quel
     momento. Uno stato di React invece si vede al disegno DOPO, e chi preme le
     due cose una in fila all'altra — un dito veloce, o una prova che clicca —
     può arrivare al tasto prima che il disegno sia stato rifatto: il tasto
     legge ancora la scelta di prima, cioè nessuna. `prove/timer.js` l'ha
     preso: «quello che hai fatto viene registrato → niente».
     Lo stato serve per accendere la pastiglia, il riferimento per rispondere
     alla domanda «cos'hai scelto» adesso. */
  const scelte = useRef({ quanto: '', perche: '' });

  return (
    <div className="sc">
      <p className="sc-intro">{testo || ''}</p>
      <div className="lista-eti"><Segno nome="durata" dim={11} />Quanto ne hai fatto</div>
      <Chips id="mancata-quanto" voci={window.LM.QUANTO_FATTO} attributo="data-quanto"
        scelto={quanto} onScegli={(v) => { scelte.current.quanto = v; setQuanto(v); }} />
      <div className="lista-eti"><Segno nome="aiuto" dim={11} />Cos’è successo</div>
      <Chips id="mancata-perche" voci={window.LM.PERCHE_MANCATA} attributo="data-perche"
        scelto={perche} onScegli={(v) => { scelte.current.perche = v; setPerche(v); }} />
      <div className="sc-gruppo"><label className="sc-campo"><span>se vuoi, due parole</span>
        <input type="text" id="mancata-nota" ref={nota} placeholder="facoltativo…" maxLength="140" /></label></div>
      <div className="imp-azioni">
        <button className="btn btn-primario btn-grande" id="mancata-ok" onClick={() => {
          const testoNota = (nota.current.value || '').trim();
          const xp = window.LM.segnaMancata(id, scelte.current.perche || 'altro', testoNota,
            scelte.current.quanto || 'niente');
          a.chiudiSheet();
          a.scordaFuoco(id);
          if (xp > 0) { a.festeggia('leggero'); a.toast('Segnato quello che hai fatto.', xp, 'check'); }
          else a.toast('Segnata. Non toglie niente.', 0, 'annulla');
          if (dopo) dopo();
          a.render();
        }}>Segna e vai avanti</button>
      </div>
      <p className="lista-nota">Il pezzo che hai fatto vale i suoi punti. Resta nel registro e nella giornata, non rompe nessuna serie, e risponde alla domanda «cosa non funziona per me» — che senza queste righe non ha dati.</p>
    </div>
  );
}
