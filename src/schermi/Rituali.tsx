/* RITUALI — una pagina di schede, e ogni rituale si apre da solo.

   Era una fisarmonica: cinque righe piccole, e il contenuto si apriva in
   mezzo alle altre. Adesso la pagina è l'elenco, e toccando un rituale
   si entra dentro: una cosa per volta, con il tasto per tornare.

   React possiede la struttura; il contenuto del rituale aperto lo disegna
   `disegnaCorpiRituali()`. */
import { useEffect, useRef } from 'react';
import { usaLM } from '../pezzi/usaLM';
import { Segno, Testa } from '../pezzi/pezzi';
import { schermo, GRUPPI_RIT, RITUALI, ritualeDellOra, statoRituale, disegnaCorpiRituali, giroDiDisegno, render } from '../app/app';
import type { Rituale } from '../app/app';

const QUANTO: Record<string, string> = { mattina: '2 min', registro: '1 min', checkin: '30 sec', sera: '3 min', settimana: '10 min' };

function Riga({ r, adesso, onApri }: { r: Rituale; adesso: string; onApri: (id: string) => void }) {
  const st = statoRituale(r.id);
  const ora = r.id === adesso && !st.fatto;
  return (
    <section className={'rit-blocco' + (ora ? ' ora' : '') + (st.fatto ? ' fatto' : '')} data-rit={r.id}>
      <button className="rit-riga" data-sub={r.id} aria-expanded={false} onClick={() => onApri(r.id)}>
        <span className="rit-ico"><Segno nome={r.ico} dim={22} /></span>
        <span className="rit-nome">
          {ora ? <span className="rit-ora">Adesso</span> : null}
          <span className="rit-tit">{r.nome}</span>
          <span className="rit-sub">{st.fatto ? 'Fatto' : (st.dett || QUANTO[r.id])}</span>
        </span>
        <span className="rit-fine">
          {st.fatto ? <span className="rit-spunta"><Segno nome="check" dim={14} /></span>
            : ora ? <span className="rit-vai">Inizia</span>
            : <span className="rit-chevron"><Segno nome="chevronGiu" /></span>}
        </span>
      </button>
    </section>
  );
}

export default function Rituali() {
  usaLM();
  const adesso = ritualeDellOra();

  if (!schermo.ritualiAperti) schermo.ritualiAperti = {};
  /* chi arriva da un collegamento entra dritto in quel rituale */
  if (schermo.sottoRituale) {
    schermo.ritualiAperti = { [schermo.sottoRituale]: true };
    schermo.sottoRituale = null;
  }
  const idAperto = Object.keys(schermo.ritualiAperti)[0] || '';
  const aperto = RITUALI.find((x) => x.id === idAperto);

  /* il corpo si ridisegna solo quando cambia il giro di `render()` o il
     rituale aperto: rifarlo a ogni commit buttava via quello che stavi
     scrivendo (`prove/lezioni.js`) */
  const chiave = giroDiDisegno() + '|' + idAperto;
  const disegnati = useRef('');
  useEffect(() => {
    if (disegnati.current === chiave) return;
    disegnati.current = chiave;
    disegnaCorpiRituali();
  });

  const vai = (id: string) => {
    schermo.ritualiAperti = id ? { [id]: true } : {};
    render();
    window.scrollTo(0, 0);
  };

  if (aperto) {
    return (<>
      <button className="rit-indietro" onClick={() => vai('')}>
        <Segno nome="chevronGiu" /> Rituali
      </button>
      <h1 className="rit-titolo">{aperto.nome}</h1>
      <section className="rit-blocco aperto" data-rit={aperto.id}>
        <div className="rit-corpo" id={'corpo-rit-' + aperto.id} />
      </section>
    </>);
  }

  const giorno = GRUPPI_RIT.flatMap((g) => g.ids).map((id) => RITUALI.find((x) => x.id === id)).filter((r): r is Rituale => !!r);
  const fatti = giorno.filter((r) => r.quando === 'giorno' && statoRituale(r.id).fatto).length;
  const quanti = giorno.filter((r) => r.quando === 'giorno').length;
  return (<>
    <Testa titolo="Rituali" giaNellaNav />
    <div className="rit-testa">
      <h2 className="rit-grande">Rituali</h2>
      <span className="rit-conto">{fatti} di {quanti} oggi</span>
    </div>
    <div className="rit-hub">
      {giorno.filter((r) => r.quando === 'giorno').map((r) => <Riga key={r.id} r={r} adesso={adesso} onApri={vai} />)}
    </div>
    <div className="rit-eti">Ogni settimana</div>
    <div className="rit-hub">
      {giorno.filter((r) => r.quando !== 'giorno').map((r) => <Riga key={r.id} r={r} adesso={adesso} onApri={vai} />)}
    </div>
  </>);
}
