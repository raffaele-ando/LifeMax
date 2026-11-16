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
import { html } from '../pezzi/grezzo';

const SEZIONI = [
  { id: 'riepilogo', ico: 'riepilogo', eti: 'Riepilogo' },
  { id: 'diario', ico: 'quaderno', eti: 'Diario' }
];

export default function Panoramica() {
  usaLM();
  const quale = schermo.sezPlancia;
  const eroe = eroePlancia();
  const vistaPrima = useRef<string | null>(null);

  /* si ricabla a ogni disegno, ed è giusto così: quando i numeri cambiano
     davvero, l'HTML dell'eroe cambia, React riscrive il nodo e cancella il
     valore animato — se non si ripassasse resterebbe lo `0` del markup.
     Che il nodo NON venga riscritto quando non è cambiato niente lo garantisce
     `html()` di `pezzi/grezzo`: è là che sta la ragione, e vale la pena
     leggerla, perché per un po' quel numero è ripartito da zero a ogni
     salvataggio. */
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

  /* LE LINGUETTE STANNO SOPRA A QUELLO CHE COMANDANO, e l'eroe è del
     Riepilogo. Prima l'ordine era eroe → linguette → sezione, e l'eroe
     restava in cima a tutte e quattro: su un telefono occupava i primi
     quattrocento pixel, quindi aprendo «Diario», «Aree» o «Grafici» si
     vedeva di nuovo il 65% e la sezione scelta cominciava sotto la piega.
     La stessa scheda ripetuta quattro volte non è un'intestazione, è un
     ostacolo — e un selettore a segmenti messo in mezzo alla pagina non si
     capisce più di cosa sia il selettore. Adesso è come in «La giornata»:
     le linguette in cima, e sotto solo quello che la linguetta dice. */
  return (<>
    <Testa titolo="Panoramica" piu="t-plancia" giaNellaNav />
    {quale === 'aree' || quale === 'andamento' ? (<>
      <button className="rit-indietro" onClick={() => { schermo.sezPlancia = 'riepilogo'; render(); }}>
        <Segno nome="chevronGiu" /> Andamento
      </button>
      <h1 className="rit-titolo">{quale === 'aree' ? 'Aree' : 'Grafici'}</h1>
    </>) : (
    <div className="segmenti mini-seg sotto-seg" id="sez-plancia">
      {SEZIONI.map((x) => (
        <button key={x.id} data-sez={x.id} className={quale === x.id ? 'attivo' : ''}
          onClick={() => { schermo.sezPlancia = x.id; render(); }}>
          <span className="seg-ico"><Segno nome={x.ico} dim={13} /></span>
          <span className="seg-eti">{x.eti}</span>
        </button>
      ))}
    </div>
    )}
    {quale === 'riepilogo' ? <div className={eroe.classi} {...html(eroe.dentro)} /> : null}
    <div id="sez-corpo" />
  </>);
}
