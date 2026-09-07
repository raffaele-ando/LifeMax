/* ADESSO — la schermata che risponde a una domanda sola: cosa faccio in
   questo momento. È quella che si apre ogni mattina, ed è per questo che è
   stata convertita per ultima: quando ci si è arrivati il metodo era rodato e
   i quattro difetti d'impianto erano già pagati.

   React possiede la struttura e il ciclo di vita. La scena la calcola
   `vistaFocus(true)` — che si ferma un attimo prima di scrivere in pagina e
   restituisce il dentro e le classi — e i comandi li attacca `wireFuoco()`.
   Sono la stessa scena e gli stessi comandi, non copie: qui dentro non c'è
   una riga di markup riscritta. */
import { useEffect } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Testa } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { vistaFocus, wireFuoco, montaOggiGiornata, wireRigaAggiunta, render } from '../app/app';
import { presa } from '../tipi/presa';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function Adesso() {
  usaLM();
  /* `vistaFocus(true)` si ferma prima di toccare la pagina: torna sempre
     una scena quando gli si passa `true` */
  const scena = presa(vistaFocus(true));

  useEffect(() => {
    /* la striscia della giornata in cima e i fili della scena: tutte e due
       vogliono gli elementi già attaccati */
    montaOggiGiornata();
    wireFuoco();
    /* a giornata vuota la scena ha il campo per scrivere una cosa e basta:
       quel filo `wireFuoco` non lo attacca, perché sta nell'altro ramo */
    const v = document.getElementById('vista');
    if (v && v.querySelector('#agg-rapida')) {
      wireRigaAggiunta(v, 'agg-rapida', (testo) => {
        LM.aggiungiAzione(testo, 'altro', { mit: LM.serveMit() });
        render();
      });
    }
  });

  return (<>
    <Testa titolo="Oggi" giaNellaNav />
    <div id="oggi-giornata" />
    <div className={scena.classi} {...html(scena.dentro)} />
  </>);
}
