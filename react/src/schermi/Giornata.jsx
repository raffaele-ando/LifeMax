/* LA GIORNATA — quattro scale di tempo: giorno, settimana, mese, anno.

   Due gradini della stessa famiglia: sopra si sceglie la SEZIONE della porta,
   qui un VALORE dentro la sezione. La differenza è la misura, non l'icona.

   React possiede la struttura, quale scala è scelta e i comandi; il corpo di
   ogni scala lo disegna `disegnaOrizzonte()`, come per Scoperte e per la
   stessa ragione. */
import { useEffect, useRef } from 'react';
import { usaLM } from '../usaLM.js';
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;

const SCALE = [
  { id: 'giorno', ico: 'unGiorno', eti: 'Giorno' },
  { id: 'settimana', ico: 'unaSettimana', eti: 'Settimana' },
  { id: 'mese', ico: 'unMese', eti: 'Mese' },
  { id: 'anno', ico: 'unAnno', eti: 'Anno' }
];

export default function Giornata() {
  usaLM();
  const a = A();
  if (!a.giornataAncora) a.giornataAncora = window.LM.todayKey();
  const quale = a.giornataOrizzonte;

  /* Il corpo si chiede solo quando serve: al primo montaggio e a ogni cambio
     di scala. `disegnaOrizzonte` si tiene il conto di cosa ha già disegnato e
     anima solo quando cambia davvero — chiamarla a ogni ridisegno di React
     vorrebbe dire dirle «non è cambiato niente» e perdere l'animazione. */
  const vistaPrima = useRef(null);
  useEffect(() => {
    if (vistaPrima.current !== quale) { a.disegnaOrizzonte(); vistaPrima.current = quale; }
  });

  return (<>
    <Testa titolo="La giornata" giaNellaNav />
    <div className="segmenti mini-seg sotto-seg" id="orizz-nav">
      {SCALE.map((x) => (
        <button key={x.id} data-orizz={x.id} className={quale === x.id ? 'attivo' : ''}
          onClick={() => { a.setOrizzonte(x.id); a.render(); }}>
          <span className="seg-ico"><Segno nome={x.ico} dim={13} /></span>
          <span className="seg-eti">{x.eti}</span>
        </button>
      ))}
    </div>
    <div id="orizz-corpo" />
  </>);
}
