/* IL DESIGN LAB — dieci basi grafiche, per sceglierne una.

   PERCHÉ È UN COMPONENTE ANCHE SE NON DISEGNA NIENTE.
   Il laboratorio si disegna da sé: `LM_LAB.montaIn(radice)` riempie un
   contenitore, e qui dentro non c'è una riga del suo markup. Restava quindi
   l'ultima schermata scritta a mano — `dove.innerHTML = …` dentro a
   `app.ts` — e quello era un difetto, non una semplificazione: `#vista` lo
   possiede la radice di React, e scriverci sopra con `innerHTML` gli porta
   via nodi che lui crede ancora di avere. Tornando su una schermata
   qualunque, React provava a togliere un figlio da un padre in cui non
   c'era più: «NotFoundError: The node to be removed is not a child of this
   node». L'ha trovato `prove/sezioni.js`.
   Adesso `#vista` ha un padrone solo. Quello che il laboratorio fa dentro al
   suo `div` non riguarda React: quel nodo è vuoto in JSX, e React non ci
   guarda dentro.

   IL CODICE ARRIVA QUANDO SI APRE QUESTA PAGINA, non prima: sono sessantun
   kilobyte di codice e settantacinque di stile per una schermata in cui non
   entra quasi nessuno. È un `import()` dentro a `caricaLab`, e Vite mette
   quella roba in un pezzo a parte. */
import { useEffect, useRef } from 'react';
import { Testa } from '../pezzi/pezzi';
import { caricaLab } from '../app/app';

export default function Lab() {
  const radice = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dove = radice.current;
    if (!dove) return;
    /* arriva da fuori: su una rete lenta questa attesa si vede, e uno schermo
       bianco senza spiegazioni sembra un guasto */
    dove.innerHTML = '<div class="card vuoto">Sto caricando il laboratorio…</div>';
    void caricaLab().then(function (lab) {
      /* la schermata può essere cambiata mentre il file arrivava: si scrive
         solo se quel contenitore sta ancora in pagina */
      if (!dove.isConnected) return;
      lab.montaIn(dove);
    }).catch(function () {
      if (dove.isConnected) {
        dove.innerHTML = '<div class="card vuoto">Il laboratorio non si è caricato. Ricarica la pagina.</div>';
      }
    });
  }, []);

  return (<>
    <Testa titolo="Design lab" sottotitolo="Scegli la base grafica del sito." />
    <div id="lab-radice" ref={radice} />
  </>);
}
