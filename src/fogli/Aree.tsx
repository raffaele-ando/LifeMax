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
     una cosa che non esiste. */
import { useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Segno } from '../pezzi/pezzi';
import { usaCambioNativo } from '../pezzi/nativo';
import { LM } from '../dati/dati';
import type { Area } from '../tipi/stato';
import { ICONE_AREA, apriAree, avviso, render, toast } from '../app/app';

type StileArea = CSSProperties & { '--c-area': string };

/* IL NOME SI SALVA COME LO SALVAVA PRIMA: sull'evento `change` del browser,
   cioè uscendo dal campo o premendo invio — non a ogni lettera. React chiama
   `onChange` a ogni tasto premuto, che è un'altra cosa e vorrebbe dire un
   salvataggio (e un ridisegno di tutta l'app) per ogni carattere. Quindi
   l'ascoltatore vero si attacca a mano. */
function Nome({ area }: { area: Area }) {
  const campo = useRef<HTMLInputElement>(null);
  usaCambioNativo(campo, (i) => {
    LM.rinominaArea(area.id, (i as HTMLInputElement).value);
    render();
    toast('Area rinominata.', 0, 'check');
  }, [area.id]);
  /* la key porta dentro il nome: così il campo riparte dai dati anche se
     qualcuno rinomina l'area da un'altra parte. Regge anche senza — la scheda
     si rifà a ogni rinomina — ma quella è una certezza che dipende da chi
     legge il codice, e questa no. */
  return <input key={area.nome} type="text" className="area-nome-input" data-rin={area.id}
    ref={campo} defaultValue={area.nome} aria-label="Nome dell’area" />;
}

function Riga({ area, attiva }: { area: Area; attiva: boolean }) {
  const rifai = () => { render(); apriAree(); };
  return (
    <div className={'gr-riga area-riga' + (attiva ? '' : ' spenta')} style={{ '--c-area': LM.coloreArea(area) } as StileArea}>
      <span className="icona-area"><Segno nome={area.icona} dim={15} /></span>
      <Nome area={area} />
      <button className="gr-via" data-del-area={area.id} aria-label={'Rimuovi ' + area.nome} onClick={() => {
        avviso({
          titolo: 'Rimuovere «' + area.nome + '»?',
          testo: 'Le sue attività passano ad «Altro».',
          azione: 'Rimuovi', pericolo: true
        }, () => { LM.rimuoviArea(area.id); rifai(); });
      }}><Segno nome="trash" dim={13} /></button>
      <button className={'interr area-on' + (attiva ? ' on' : '')} data-toggle-area={area.id} role="switch"
        aria-checked={attiva ? 'true' : 'false'} aria-label={area.nome}
        onClick={() => { LM.toggleArea(area.id, !attiva); rifai(); }}><i /></button>
    </div>
  );
}

const PRIMO = ICONE_AREA[0] || 'book';

export default function Aree() {
  const s = LM.load();
  const [nome, setNome] = useState('');
  const [ico, setIco] = useState(PRIMO);
  /* il segno scelto sta anche in un riferimento: lo stato si vede al disegno
     dopo, e chi tocca un segno e preme «Aggiungi» subito dietro arriverebbe
     al tasto prima. Il codice di prima teneva una variabile normale, e questa
     è la sua traduzione. Lo stato serve solo ad accendere il tasto giusto. */
  const segno = useRef(PRIMO);

  const crea = (e: FormEvent) => {
    e.preventDefault();
    const campo = document.getElementById('area-nuova-nome') as HTMLInputElement | null;
    const v = ((campo && campo.value) || nome).trim();
    if (!v) return;
    LM.aggiungiArea(v, segno.current);
    render();
    apriAree();
    toast('Area creata.', 0, 'aree');
  };

  return (<>
    <div className="gr aree-lista">
      {s.aree.map((x) => <Riga key={x.id} area={x} attiva={s.areeAttive.indexOf(x.id) >= 0} />)}
    </div>
    <div className="gr-titolo">Nuova area</div>
    <form className="gr" id="area-nuova" onSubmit={crea}>
      <div className="gr-riga">
        <span className="icona-area"><Segno nome={ico} dim={15} /></span>
        <input type="text" id="area-nuova-nome" className="ritmo-nome" placeholder="Nome"
          value={nome} onChange={(e) => setNome(e.target.value)} />
        <button className="sp-link" type="submit" disabled={!nome.trim()}>Aggiungi</button>
      </div>
      {nome.trim() ? (
        <div className="ico-picker gr-icone" id="ico-picker">
          {ICONE_AREA.map((x) => (
            <button key={x} type="button" className={'ico-pick' + (x === ico ? ' sel' : '')} data-ico={x} aria-label={x}
              onClick={() => { segno.current = x; setIco(x); }}><Segno nome={x} /></button>
          ))}
        </div>
      ) : null}
    </form>
  </>);
}
