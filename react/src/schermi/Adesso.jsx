/* ADESSO — la schermata che risponde a una domanda sola: cosa faccio in
   questo momento. È quella che si apre ogni mattina, ed è per questo che è
   stata convertita per ultima: quando ci si è arrivati il metodo era rodato e
   i quattro difetti d'impianto erano già pagati.

   React possiede la struttura e il ciclo di vita. La scena la calcola
   `vistaFocus(true)` — che si ferma un attimo prima di scrivere in pagina e
   restituisce il dentro e le classi — e i comandi li attacca `wireFuoco()`.
   Sono la stessa scena e gli stessi comandi del codice di prima, non copie:
   qui dentro non c'è una riga di markup riscritta. */
import { useEffect } from 'react';
import { usaLM } from '../usaLM.js';
import { Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function Adesso() {
  usaLM();
  const a = A();
  const scena = a.vistaFocus(true);

  useEffect(() => {
    /* la striscia della giornata in cima e i fili della scena: tutte e due
       vogliono gli elementi già attaccati */
    a.montaOggiGiornata();
    a.wireFuoco();
    /* a giornata vuota la scena ha il campo per scrivere una cosa e basta:
       quel filo `wireFuoco` non lo attacca, perché nel codice di prima sta
       nell'altro ramo */
    const v = document.getElementById('vista');
    if (v && v.querySelector('#agg-rapida')) {
      a.wireRigaAggiunta2(v, 'agg-rapida', (testo) => {
        window.LM.aggiungiAzione(testo, 'altro', { mit: window.LM.serveMit() });
        a.render();
      });
    }
  });

  return (<>
    <Testa titolo="Oggi" giaNellaNav />
    <div id="oggi-giornata" />
    <div className={scena.classi} {...html(scena.dentro)} />
  </>);
}
