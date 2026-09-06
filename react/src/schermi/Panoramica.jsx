/* PANORAMICA — l'eroe che risponde a una domanda sola, e quattro sezioni.

   React possiede la struttura, quale sezione è aperta e i comandi. L'eroe e
   il corpo delle sezioni li disegnano `eroePlanciaHtml()` e `disegnaSezPlancia()`
   di app.js: sono le stesse schede, non copie che le somigliano.

   `wireEroePlancia()` va chiamata DOPO, quando gli elementi sono in pagina:
   il numero che sale da zero e la linea dell'andamento hanno bisogno del loro
   contenitore già attaccato. */
import { useEffect, useRef } from 'react';
import { usaLM } from '../usaLM.js';
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

const SEZIONI = [
  { id: 'riepilogo', ico: 'riepilogo', eti: 'Riepilogo' },
  { id: 'diario', ico: 'quaderno', eti: 'Diario' },
  { id: 'aree', ico: 'aree', eti: 'Aree' },
  { id: 'andamento', ico: 'trendUp', eti: 'Grafici' }
];

export default function Panoramica() {
  usaLM();
  const a = A();
  const quale = a.sezPlancia;
  const eroe = a.eroePlancia();
  const vistaPrima = useRef(null);

  useEffect(() => { a.wireEroePlancia(); });
  /* come per «La giornata»: il corpo si chiede al primo montaggio e a ogni
     cambio di sezione, non a ogni ridisegno — `disegnaSezPlancia` anima solo
     quando la sezione cambia, e chiamarla sempre le toglierebbe l'occasione */
  useEffect(() => {
    if (vistaPrima.current !== quale) { a.disegnaSezPlancia(); vistaPrima.current = quale; }
  });

  /* i comandi «vai a…» dentro alle schede: erano un ascoltatore per ognuno,
     qui è uno solo sulla schermata */
  useEffect(() => {
    const v = document.getElementById('vista');
    if (!v) return;
    const vai = (e) => {
      const b = e.target.closest('[data-vai]');
      if (b) location.hash = '#/' + b.getAttribute('data-vai');
    };
    v.addEventListener('click', vai);
    return () => v.removeEventListener('click', vai);
  }, []);

  return (<>
    <Testa titolo="Panoramica" piu="t-plancia" giaNellaNav />
    <div className={eroe.classi} {...html(eroe.dentro)} />
    <div className="segmenti mini-seg sotto-seg" id="sez-plancia">
      {SEZIONI.map((x) => (
        <button key={x.id} data-sez={x.id} className={quale === x.id ? 'attivo' : ''}
          onClick={() => { a.sezPlancia = x.id; a.render(); }}>
          <span className="seg-ico"><Segno nome={x.ico} dim={13} /></span>
          <span className="seg-eti">{x.eti}</span>
        </button>
      ))}
    </div>
    <div id="sez-corpo" />
  </>);
}
