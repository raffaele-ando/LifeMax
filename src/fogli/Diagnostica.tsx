/* REGISTRO TECNICO — quando qualcosa non torna.

   La domanda vera è una sola: i miei dati sono al sicuro? Qui la risposta si
   legge in chiaro, con la cronologia di cosa è successo e un tasto che copia
   tutto — perché il problema si vede sul telefono, dove non c'è nessuna
   console.

   Due cose stanno dove stanno per una ragione:
   · la nota sta SOPRA il registro. Sotto c'è un'area che scorre da sola, e
     quello che finisce là in fondo non lo legge nessuno.
   · la cornice sta FUORI dal riquadro che scorre. Erano la stessa scatola, e
     il filo del bordo è uno pseudo-elemento assoluto: dentro un contenitore
     che scorre se ne va a spasso col contenuto, e la cornice della console
     finiva in mezzo alle righe. */
import { useEffect, useRef } from 'react';
import { Segno } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { esc } from '../pezzi/stringhe';
import { presa } from '../tipi/presa';
import { schermo, statoSalvataggioSpiegato, righeLogHtml, toast } from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function Diagnostica() {
  const cons = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const filtro = useRef<HTMLDivElement>(null);

  const st = statoSalvataggioSpiegato();
  const nProblemi = window.LMLog ? window.LMLog.righe().filter((x) => x.liv !== 'info').length : 0;
  const testoCompleto = () => (window.LMLog ? window.LMLog.testo() : '');

  /* AGGIORNAMENTO DAL VIVO: si aggiunge una riga in cima, il resto non si
     muove. Guardare il registro mentre agisci è metà della diagnosi.
     Le righe si infilano a mano, come faceva il codice di prima: React non
     ridisegna questo riquadro (lo rifà solo quando cambi filtro), e una riga
     in più in cima non è uno stato — è quello che sta succedendo adesso. */
  useEffect(() => {
    const nuovaRiga = (e: WindowEventMap['lm:log']) => {
      const box = cons.current;
      const reg = window.LMLog;
      if (!box || !reg) return;
      const x = e.detail;
      if (!x) return;
      if (schermo.logSoloProblemi && x.liv === 'info') return;
      const vuoto = box.querySelector('.diag-vuoto');
      if (vuoto) vuoto.remove();
      const d = document.createElement('div');
      d.className = 'diag-riga liv-' + x.liv + ' diag-nuova';
      d.innerHTML = '<span class="diag-ora">' + reg.ora(x.t) + '</span><span class="diag-can">' + esc(x.can) +
        '</span><span class="diag-msg">' + esc(x.msg) + (x.dati ? '<i>' + esc(x.dati) + '</i>' : '') + '</span>';
      box.insertBefore(d, box.firstChild);
      const testa = document.querySelector('#sheet-corpo .diag-stato');
      if (testa && x.can === 'sync') {
        const s2 = statoSalvataggioSpiegato();
        testa.className = 'diag-stato ' + s2.cls;
        testa.innerHTML = '<b>' + esc(s2.tit) + '</b><span>' + esc(s2.txt.trim()) + '</span>';
      }
    };
    window.addEventListener('lm:log', nuovaRiga);
    return () => window.removeEventListener('lm:log', nuovaRiga);
  }, []);

  const copia = () => {
    const t = testoCompleto();
    const aMano = () => {
      /* niente clipboard (Safari in certi contesti): si mostra il testo già
         selezionato, così «copia» è comunque a un gesto di distanza */
      const a2 = presa(area.current);
      a2.classList.add('mostra');
      a2.value = t;
      a2.focus();
      a2.select();
      toast('Testo selezionato: tienilo premuto e scegli «Copia».', 0, 'copy');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(t).then(() => toast('Registro copiato.', 0, 'copy'), aMano);
    } else aMano();
  };

  const cambiaFiltro = (b: HTMLElement, solo: boolean) => {
    schermo.logSoloProblemi = solo;
    presa(filtro.current).querySelectorAll<HTMLElement>('[data-filtro]')
      .forEach((x) => x.classList.toggle('attivo', x === b));
    const box = presa(cons.current);
    box.innerHTML = righeLogHtml();
    box.scrollTop = 0;
  };

  return (<>
    <div className={'diag-stato ' + st.cls}><b>{st.tit}</b><span>{st.txt.trim()}</span></div>
    <div className="diag-barra">
      <button className="btn btn-mini btn-primario" id="diag-copia" onClick={copia}><Segno nome="copy" /> Copia tutto</button>
      {navigator.share ? (
        <button className="btn btn-mini" id="diag-condividi" onClick={() => {
          void navigator.share({ title: 'LifeMax — registro diagnostico', text: testoCompleto() })
            .catch(() => { /* annullato */ });
        }}><Segno nome="share" /> Condividi</button>
      ) : null}
      <button className="btn btn-mini" id="diag-riprova" onClick={() => {
        LM.save();   /* forza un giro di salvataggio: rilancia anche il push sul cloud */
        if (window.LMLog) window.LMLog.info('registro', 'Salvataggio richiesto a mano dall’utente');
        toast('Salvataggio richiesto: l’esito è nelle righe qui sotto.', 0, 'riprova');
      }}><Segno nome="riprova" /> Riprova ora</button>
      <button className="btn btn-mini btn-ghost" id="diag-svuota" onClick={() => {
        if (window.LMLog) window.LMLog.svuota();
        presa(cons.current).innerHTML = righeLogHtml();
      }}><Segno nome="trash" /> Svuota</button>
    </div>
    <div className="imp-nota diag-nota">Il registro descrive cosa fa l’app: salvataggi, cloud, rete, errori. Non contiene il testo di quello che scrivi, e l’indirizzo email è abbreviato.</div>
    <div className="segmenti diag-filtro" id="diag-filtro" ref={filtro}>
      <button data-filtro="tutto" className={schermo.logSoloProblemi ? '' : 'attivo'}
        onClick={(e) => cambiaFiltro(e.currentTarget, false)}>Tutto</button>
      <button data-filtro="problemi" className={schermo.logSoloProblemi ? 'attivo' : ''}
        onClick={(e) => cambiaFiltro(e.currentTarget, true)}>Solo problemi{nProblemi ? ' (' + nProblemi + ')' : ''}</button>
    </div>
    <div className="diag-cornice">
      <div className="diag-console" id="diag-console" tabIndex={0} role="log" aria-label="Registro diagnostico"
        ref={cons} {...html(righeLogHtml())} />
    </div>
    <textarea id="diag-testo" className="diag-testo" ref={area} readOnly aria-label="Testo del registro, da copiare a mano" />
  </>);
}
