/* ADESSO — la schermata che risponde a una domanda sola: cosa faccio in
   questo momento. È quella che si apre ogni mattina, ed è per questo che è
   stata convertita per ultima: quando ci si è arrivati il metodo era rodato e
   i quattro difetti d'impianto erano già pagati.

   React possiede la struttura e il ciclo di vita. La scena la calcola
   `vistaFocus()` — che in pagina non scrive: restituisce il dentro e le
   classi — e i comandi li attacca `wireFuoco()`.
   Sono la stessa scena e gli stessi comandi, non copie: qui dentro non c'è
   una riga di markup riscritta. */
import { useEffect } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Testa } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { vistaFocus, wireFuoco, testaCasa, wireRigaAggiunta, render } from '../app/app';
import { html } from '../pezzi/grezzo';

export default function Adesso() {
  usaLM();
  const scena = vistaFocus();

  useEffect(() => {
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
    {/* chi sei, che giorno è, a che punto sei: al posto della barra del
        tempo senza parole che stava qui */}
    <div className="casa" {...html(testaCasa())} />
    <div className={scena.classi} {...html(scena.dentro)} />
    {/* LA FASCIA STA FUORI DALLA SCENA, e deve restarci.
        Su un telefono è `position: fixed`, e un elemento fisso si aggancia
        al viewport soltanto se nessun antenato ha una `transform`.
        L'animazione di cambio schermata ne mette una sulla scena — è
        `.vista-enter > *`, e la scena è un figlio diretto di `#vista` —
        quindi da dentro la fascia si agganciava alla SCENA: per i
        novecento millisecondi dell'animazione compariva a metà pagina,
        sopra la coda, e poi scattava in fondo.
        Qui è sorella, non figlia. Il foglio la tiene anche fuori
        dall'animazione: una cosa appoggiata allo schermo non entra
        scivolando insieme al contenuto. */}
    {scena.fascia ? <div className="fuoco-fascia" {...html(scena.fascia)} /> : null}
  </>);
}
