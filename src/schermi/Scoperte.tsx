/* SCOPERTE — due sezioni: il registro di quello che hai capito su di te, e
   gli esperimenti.

   React possiede la struttura, lo stato (quale sezione) e i comandi. Il CORPO
   di ciascuna sezione lo disegna ancora `disegnaScoperte()` di `app.ts`.

   Non è una scorciatoia: è la stessa regola delle righe di «Da fare». Quel
   corpo è fatto di forme che esistono già — le schede degli esperimenti, il
   blocco delle lezioni — e riscriverle qui vorrebbe dire avere DUE sorgenti
   per la stessa forma, che è precisamente il difetto che il lavoro sui pezzi
   sta togliendo di mezzo. Quando quelle forme saranno pezzi, spariranno di là
   e di qua nello stesso momento. */
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Segno, Testa } from '../pezzi/pezzi';
import { schermo, disegnaScoperte, giroDiDisegno, render } from '../app/app';

function Linguetta({ id, ico, eti, quanti, attiva, onScegli }: {
  id: string; ico: string; eti: ReactNode; quanti: number | null;
  attiva: boolean; onScegli: (id: string) => void;
}) {
  return (
    <button data-scop={id} className={attiva ? 'attivo' : ''} onClick={() => onScegli(id)}>
      <span className="seg-ico"><Segno nome={ico} dim={13} /></span>
      <span className="seg-eti">{eti}{quanti ? <> <span className="seg-n">{quanti}</span></> : null}</span>
    </button>
  );
}

export default function Scoperte() {
  const s = usaLM((LM) => LM.load());
  /* Chi arriva qui per aprire un esperimento — dalla scheda di una riga, o
     perché ne aveva uno mezzo scritto — entra dalla parte degli esperimenti:
     il modulo vive là dentro, e aprire la pagina sul registro vorrebbe dire
     far sparire quello che stava scrivendo. */
  if (schermo.lezDaProvare || schermo.formExp) schermo.sezScoperte = 'esperimenti';
  const quale = schermo.sezScoperte;

  /* IL CORPO SI RIFÀ A UN DISEGNO VERO O A UN CAMBIO DI SEZIONE, non a ogni
     cambiamento dei dati. Il contenitore lo scrive `disegnaScoperte` con
     `innerHTML`, e React quel nodo non lo tocca: sopravvive ai suoi
     ridisegni da solo. Rifarlo a ogni commit voleva dire riscrivere sotto le
     dita il modulo del nuovo esperimento — il testo tornava (lo tiene
     `schermo.formExp`) ma il cursore saltava in fondo.
     È la stessa distinzione dei Rituali e della Panoramica: `render()` è un
     disegno, `lm:change` è un dato che si è mosso. */
  const chiave = giroDiDisegno() + '|' + quale;
  const disegnato = useRef('');
  useEffect(() => {
    if (disegnato.current === chiave) return;
    disegnato.current = chiave;
    disegnaScoperte();
  });

  const scegli = (id: string) => {
    schermo.sezScoperte = id;
    render();
  };

  return (<>
    <Testa titolo="Scoperte" giaNellaNav />
    <div className="segmenti mini-seg sotto-seg" id="sez-scoperte">
      <Linguetta id="registro" ico="funziona" eti="Registro"
        quanti={s.lezioni.length || null} attiva={quale === 'registro'} onScegli={scegli} />
      <Linguetta id="esperimenti" ico="flask" eti="Esperimenti"
        quanti={s.esperimenti.length || null} attiva={quale === 'esperimenti'} onScegli={scegli} />
    </div>
    <div id="scop-corpo" />
  </>);
}
