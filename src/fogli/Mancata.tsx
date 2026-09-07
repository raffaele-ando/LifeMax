/* «NON DEL TUTTO» — quello che succede quando una cosa non è andata.

   Il perché si chiede, ma non si pretende: cinque risposte a un tocco e un
   campo libero, e si può chiudere senza rispondere. Chiedere un perché
   obbligatorio nel momento in cui una cosa è andata male è il modo più rapido
   per far smettere di dirlo — e a quel punto si torna a cancellare, che è la
   cosa che questo esito esiste per evitare.

   E LA PRIMA DOMANDA È QUANTO, NON PERCHÉ. Chi arriva qui ha appena mollato
   qualcosa: la prima cosa che l'app gli dice deve riconoscere il pezzo che ha
   fatto, non chiedergli conto di quello che manca. */
import { useRef, useState } from 'react';
import { Segno } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { chiudiSheet, scordaFuoco, festeggia, render, toast } from '../app/app';

function Chips({ id, voci, attributo, scelto, onScegli }: {
  id: string;
  voci: readonly { id: string; eti: string }[];
  attributo: 'data-quanto' | 'data-perche';
  scelto: string;
  onScegli: (v: string) => void;
}) {
  return (
    <div className="q-chips" id={id}>
      {voci.map((x) => (
        <button key={x.id} className={'q-chip' + (scelto === x.id ? ' on' : '')}
          {...{ [attributo]: x.id }} onClick={() => onScegli(x.id)}>{x.eti}</button>
      ))}
    </div>
  );
}

export interface PropMancata {
  id: string;
  testo?: string;
  dopo?: () => void;
}

export default function Mancata({ id, testo, dopo }: PropMancata) {
  /* le pastiglie partono tutte spente. Dentro, «quanto» vale già «niente»:
     è la risposta di chi chiude senza toccare nulla, ed è giusto che non
     sembri una scelta fatta. */
  const [quanto, setQuanto] = useState('');
  const [perche, setPerche] = useState('');
  const nota = useRef<HTMLInputElement>(null);

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
      <Chips id="mancata-quanto" voci={LM.QUANTO_FATTO} attributo="data-quanto"
        scelto={quanto} onScegli={(v) => { scelte.current.quanto = v; setQuanto(v); }} />
      <div className="lista-eti"><Segno nome="aiuto" dim={11} />Cos’è successo</div>
      <Chips id="mancata-perche" voci={LM.PERCHE_MANCATA} attributo="data-perche"
        scelto={perche} onScegli={(v) => { scelte.current.perche = v; setPerche(v); }} />
      <div className="sc-gruppo"><label className="sc-campo"><span>se vuoi, due parole</span>
        <input type="text" id="mancata-nota" ref={nota} placeholder="facoltativo…" maxLength={140} /></label></div>
      <div className="imp-azioni">
        <button className="btn btn-primario btn-grande" id="mancata-ok" onClick={() => {
          const testoNota = (nota.current ? nota.current.value : '').trim();
          const xp = LM.segnaMancata(id, scelte.current.perche || 'altro', testoNota,
            scelte.current.quanto || 'niente');
          chiudiSheet();
          scordaFuoco(id);
          if (xp > 0) { festeggia('leggero'); toast('Segnato quello che hai fatto.', xp, 'check'); }
          else toast('Segnata. Non toglie niente.', 0, 'annulla');
          if (dopo) dopo();
          render();
        }}>Segna e vai avanti</button>
      </div>
      <p className="lista-nota">Il pezzo che hai fatto vale i suoi punti. Resta nel registro e nella giornata, non rompe nessuna serie, e risponde alla domanda «cosa non funziona per me» — che senza queste righe non ha dati.</p>
    </div>
  );
}
