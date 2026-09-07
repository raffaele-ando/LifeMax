/* PANORAMICA — l'eroe che risponde a una domanda sola, e quattro sezioni.

   React possiede la struttura, quale sezione è aperta e i comandi. L'eroe e
   il corpo delle sezioni li disegnano `eroePlancia()` e `disegnaSezione()`
   di `app.ts`: sono le stesse schede, non copie che le somigliano.

   `wireEroePlancia()` va chiamata DOPO, quando gli elementi sono in pagina:
   il numero che sale da zero e la linea dell'andamento hanno bisogno del loro
   contenitore già attaccato. */
import { useEffect, useRef } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Segno, Testa } from '../pezzi/pezzi';
import { schermo, eroePlancia, wireEroePlancia, disegnaSezione, render } from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

const SEZIONI = [
  { id: 'riepilogo', ico: 'riepilogo', eti: 'Riepilogo' },
  { id: 'diario', ico: 'quaderno', eti: 'Diario' },
  { id: 'aree', ico: 'aree', eti: 'Aree' },
  { id: 'andamento', ico: 'trendUp', eti: 'Grafici' }
];

export default function Panoramica() {
  usaLM();
  const quale = schermo.sezPlancia;
  const eroe = eroePlancia();
  const vistaPrima = useRef<string | null>(null);

  useEffect(() => { wireEroePlancia(); });
  /* come per «La giornata»: il corpo si chiede al primo montaggio e a ogni
     cambio di sezione, non a ogni ridisegno — `disegnaSezione` anima solo
     quando la sezione cambia, e chiamarla sempre le toglierebbe l'occasione */
  useEffect(() => {
    if (vistaPrima.current !== quale) { disegnaSezione(); vistaPrima.current = quale; }
  });

  /* i comandi «vai a…» dentro alle schede: erano un ascoltatore per ognuno,
     qui è uno solo sulla schermata */
  useEffect(() => {
    const v = document.getElementById('vista');
    if (!v) return undefined;
    const vai = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const b = t.closest('[data-vai]');
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
          onClick={() => { schermo.sezPlancia = x.id; render(); }}>
          <span className="seg-ico"><Segno nome={x.ico} dim={13} /></span>
          <span className="seg-eti">{x.eti}</span>
        </button>
      ))}
    </div>
    <div id="sez-corpo" />
  </>);
}
