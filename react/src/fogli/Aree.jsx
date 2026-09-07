/* LE TUE AREE — rinominarle, spegnerle, toglierle, farne di nuove.

   Due cose di questo pannello vanno tenute com'erano, perché ognuna è nata
   da un errore:

   · l'interruttore di ogni area è «acceso», non «fatto». Il verde pieno in
     tutta l'app vuol dire che una cosa è finita, e otto spunte verdi in
     colonna facevano sembrare questa una lista di cose completate invece
     dell'interruttore di ognuna. Cambia il colore, non il segno.

   · i segni per una nuova area si vedono solo quando hai cominciato a
     scrivere il nome. Quattordici tasti aperti per un'area che non avevi
     ancora deciso di creare erano metà dei comandi della schermata spesi per
     una cosa che non esiste.  */
import { useRef, useState } from 'react';
import { Segno } from '../pezzi.jsx';
import { usaCambioNativo } from '../nativo.js';

const A = () => window.LM_APP;

/* IL NOME SI SALVA COME LO SALVAVA PRIMA: sull'evento `change` del browser,
   cioè uscendo dal campo o premendo invio — non a ogni lettera. React chiama
   `onChange` a ogni tasto premuto, che è un'altra cosa e vorrebbe dire un
   salvataggio (e un ridisegno di tutta l'app) per ogni carattere. Quindi
   l'ascoltatore vero si attacca a mano. */
function Nome({ area }) {
  const campo = useRef(null);
  usaCambioNativo(campo, (i) => {
    window.LM.rinominaArea(area.id, i.value);
    A().render();
    A().toast('Area rinominata.', 0, 'check');
  }, [area.id]);
  /* la key porta dentro il nome: così il campo riparte dai dati anche se
     qualcuno rinomina l'area da un'altra parte. Regge anche senza — la scheda
     si rifà a ogni rinomina — ma quella è una certezza che dipende da chi
     legge il codice, e questa no. */
  return <input key={area.nome} type="text" className="area-nome-input" data-rin={area.id}
    ref={campo} defaultValue={area.nome} aria-label="Nome dell’area" />;
}

function Riga({ area, attiva }) {
  const a = A();
  /* riaprire il pannello è quello che faceva il codice di prima: cambiare
     un'area cambia anche la schermata sotto, e `render()` la rifà */
  const rifai = () => { a.render(); a.apriAree(); };
  return (
    <div className={'area-riga' + (attiva ? '' : ' spenta')} style={{ '--c-area': window.LM.coloreArea(area) }}>
      <span className="icona-area"><Segno nome={area.icona} /></span>
      <Nome area={area} />
      {/* il title non basta: col dito non esiste, e con la voce l'icona è
          aria-hidden — senza aria-label questi tasti non avevano nome, e
          nemmeno dicevano di quale area erano */}
      <button className={'icona-btn area-on' + (attiva ? ' on' : '')} data-toggle-area={area.id}
        aria-pressed={attiva ? 'true' : 'false'}
        aria-label={area.nome + ': ' + (attiva ? 'attiva, tocca per disattivarla' : 'disattivata, tocca per attivarla')}
        title={attiva ? 'Attiva (tocca per disattivare)' : 'Disattivata (tocca per attivare)'}
        onClick={() => { window.LM.toggleArea(area.id, !attiva); rifai(); }}>
        <Segno nome={attiva ? 'check' : 'x'} />
      </button>
      <button className="icona-btn" data-del-area={area.id} title="Rimuovi" onClick={() => {
        a.avviso({
          titolo: 'Rimuovere questa area?',
          testo: 'Le attività che ci stavano dentro passano ad «Altro»: non si perde niente.',
          azione: 'Rimuovi', pericolo: true
        }, () => { window.LM.rimuoviArea(area.id); rifai(); });
      }}><Segno nome="trash" /></button>
    </div>
  );
}

export default function Aree() {
  const a = A();
  const s = window.LM.load();
  const [nome, setNome] = useState('');
  const [ico, setIco] = useState(a.ICONE_AREA[0]);
  /* il segno scelto sta anche in un riferimento: lo stato si vede al disegno
     dopo, e chi tocca un segno e preme «Aggiungi» subito dietro arriverebbe
     al tasto prima. Il codice di prima teneva una variabile normale, e questa
     è la sua traduzione. Lo stato serve solo ad accendere il tasto giusto. */
  const segno = useRef(a.ICONE_AREA[0]);

  const crea = (e) => {
    e.preventDefault();
    const campo = document.getElementById('area-nuova-nome');
    const v = ((campo && campo.value) || nome).trim();
    if (!v) return;
    window.LM.aggiungiArea(v, segno.current);
    a.render();
    a.apriAree();
    a.toast('Area creata.', 0, 'aree');
  };

  return (<>
    <div className="imp-nota" style={{ marginTop: 0 }}>
      Rinomina, disattiva o rimuovi le aree, oppure creane di tue (es. i tuoi progetti).
      Rimuovendo un’area, le sue attività passano ad «Altro»: nulla va perso.
    </div>
    <div className="aree-lista">
      {s.aree.map((x) => <Riga key={x.id} area={x} attiva={s.areeAttive.indexOf(x.id) >= 0} />)}
    </div>
    {/* «Aggiungi» sta al tono intermedio: questa è la schermata dove si
        sistemano le aree che HAI, non dove se ne fanno di nuove, e l'unico
        tasto pieno diceva il contrario. */}
    <div className="imp-sezione">
      <div className="imp-eti">Nuova area</div>
      <form className="riga-flex" id="area-nuova" onSubmit={crea}>
        <input type="text" id="area-nuova-nome" placeholder="Nome della nuova area…"
          style={{ flex: 1, minWidth: '150px' }}
          value={nome} onChange={(e) => setNome(e.target.value)} />
        <button className="btn btn-mini btn-tinta" type="submit"><Segno nome="plus" dim={13} /> Aggiungi</button>
      </form>
      <div className="ico-picker mt-s" id="ico-picker" hidden={!nome.trim()}>
        {a.ICONE_AREA.map((x) => (
          <button key={x} className={'ico-pick' + (x === ico ? ' sel' : '')} data-ico={x} aria-label={x}
            onClick={() => { segno.current = x; setIco(x); }}><Segno nome={x} /></button>
        ))}
      </div>
    </div>
  </>);
}
