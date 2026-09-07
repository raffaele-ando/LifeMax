/* SCOPERTE — due sezioni: il registro di quello che hai capito su di te, e
   gli esperimenti.

   React possiede la struttura, lo stato (quale sezione) e i comandi. Il CORPO
   di ciascuna sezione lo disegna ancora `disegnaScoperte()` di app.js,
   chiamato attraverso la cucitura.

   Non è una scorciatoia: è la stessa regola delle righe di «Da fare». Quel
   corpo è fatto di forme che esistono già — le schede degli esperimenti, il
   blocco delle lezioni — e riscriverle qui vorrebbe dire avere DUE sorgenti
   per la stessa forma, che è precisamente il difetto che il lavoro sui pezzi
   sta togliendo di mezzo. Quando quelle forme saranno pezzi, spariranno di là
   e di qua nello stesso momento. */
import { useEffect } from 'react';
import { usaLM } from '../usaLM.js';
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;

function Linguetta({ id, ico, eti, quanti, attiva, onScegli }) {
  return (
    <button data-scop={id} className={attiva ? 'attivo' : ''} onClick={() => onScegli(id)}>
      <span className="seg-ico"><Segno nome={ico} dim={13} /></span>
      <span className="seg-eti">{eti}{quanti ? <> <span className="seg-n">{quanti}</span></> : null}</span>
    </button>
  );
}

export default function Scoperte() {
  const s = usaLM((LM) => LM.load());
  const a = A();
  /* Chi arriva qui per aprire un esperimento — dalla scheda di una riga, o
     perché ne aveva uno mezzo scritto — entra dalla parte degli esperimenti:
     il modulo vive là dentro, e aprire la pagina sul registro vorrebbe dire
     far sparire quello che stava scrivendo. */
  if (a.lezDaProvare || a.formExp) a.sezScoperte = 'esperimenti';
  const quale = a.sezScoperte;

  /* il corpo si ridisegna dopo ogni commit: React ha appena rifatto il
     contenitore, e i fili vanno riattaccati a quello nuovo */
  useEffect(() => { a.disegnaScoperte(); });

  const scegli = (id) => {
    a.sezScoperte = id;
    a.disegnaScoperte();
    /* lo stato vive in app.js — lo legge anche il codice di prima quando si
       spegne l'interruttore — quindi il ridisegno lo si chiede a mano */
    a.render();
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
