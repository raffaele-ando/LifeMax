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
     finiva in mezzo alle righe.  */
import { useEffect, useRef } from 'react';
import { Segno } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function Diagnostica() {
  const a = A();
  const cons = useRef(null);
  const area = useRef(null);
  const filtro = useRef(null);

  const st = a.statoSalvataggioSpiegato();
  const nProblemi = window.LMLog ? window.LMLog.righe().filter((x) => x.liv !== 'info').length : 0;
  const testoCompleto = () => (window.LMLog ? window.LMLog.testo() : '');

  /* AGGIORNAMENTO DAL VIVO: si aggiunge una riga in cima, il resto non si
     muove. Guardare il registro mentre agisci è metà della diagnosi.
     Le righe si infilano a mano, come faceva il codice di prima: React non
     ridisegna questo riquadro (lo rifà solo quando cambi filtro), e una riga
     in più in cima non è uno stato — è quello che sta succedendo adesso. */
  useEffect(() => {
    const nuovaRiga = (e) => {
      const box = cons.current;
      if (!box) return;
      const x = e.detail;
      if (!x) return;
      if (a.logSoloProblemi && x.liv === 'info') return;
      const vuoto = box.querySelector('.diag-vuoto');
      if (vuoto) vuoto.remove();
      const d = document.createElement('div');
      d.className = 'diag-riga liv-' + x.liv + ' diag-nuova';
      d.innerHTML = '<span class="diag-ora">' + window.LMLog.ora(x.t) + '</span><span class="diag-can">' + a.esc(x.can) +
        '</span><span class="diag-msg">' + a.esc(x.msg) + (x.dati ? '<i>' + a.esc(x.dati) + '</i>' : '') + '</span>';
      box.insertBefore(d, box.firstChild);
      const testa = document.querySelector('#sheet-corpo .diag-stato');
      if (testa && x.can === 'sync') {
        const s2 = a.statoSalvataggioSpiegato();
        testa.className = 'diag-stato ' + s2.cls;
        testa.innerHTML = '<b>' + a.esc(s2.tit) + '</b><span>' + a.esc(s2.txt.trim()) + '</span>';
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
      area.current.classList.add('mostra');
      area.current.value = t;
      area.current.focus();
      area.current.select();
      a.toast('Testo selezionato: tienilo premuto e scegli «Copia».', 0, 'copy');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => a.toast('Registro copiato.', 0, 'copy'), aMano);
    } else aMano();
  };

  const cambiaFiltro = (b, solo) => {
    a.logSoloProblemi = solo;
    filtro.current.querySelectorAll('[data-filtro]').forEach((x) => x.classList.toggle('attivo', x === b));
    cons.current.innerHTML = a.righeLogHtml();
    cons.current.scrollTop = 0;
  };

  return (<>
    <div className={'diag-stato ' + st.cls}><b>{st.tit}</b><span>{st.txt.trim()}</span></div>
    <div className="diag-barra">
      <button className="btn btn-mini btn-primario" id="diag-copia" onClick={copia}><Segno nome="copy" /> Copia tutto</button>
      {navigator.share ? (
        <button className="btn btn-mini" id="diag-condividi" onClick={() => {
          navigator.share({ title: 'LifeMax — registro diagnostico', text: testoCompleto() }).catch(() => { /* annullato */ });
        }}><Segno nome="share" /> Condividi</button>
      ) : null}
      <button className="btn btn-mini" id="diag-riprova" onClick={() => {
        window.LM.save();   /* forza un giro di salvataggio: rilancia anche il push sul cloud */
        if (window.LMLog) window.LMLog.info('registro', 'Salvataggio richiesto a mano dall’utente');
        a.toast('Salvataggio richiesto: l’esito è nelle righe qui sotto.', 0, 'riprova');
      }}><Segno nome="riprova" /> Riprova ora</button>
      <button className="btn btn-mini btn-ghost" id="diag-svuota" onClick={() => {
        if (window.LMLog) window.LMLog.svuota();
        cons.current.innerHTML = a.righeLogHtml();
      }}><Segno nome="trash" /> Svuota</button>
    </div>
    <div className="imp-nota diag-nota">Il registro descrive cosa fa l’app: salvataggi, cloud, rete, errori. Non contiene il testo di quello che scrivi, e l’indirizzo email è abbreviato.</div>
    <div className="segmenti diag-filtro" id="diag-filtro" ref={filtro}>
      <button data-filtro="tutto" className={a.logSoloProblemi ? '' : 'attivo'}
        onClick={(e) => cambiaFiltro(e.currentTarget, false)}>Tutto</button>
      <button data-filtro="problemi" className={a.logSoloProblemi ? 'attivo' : ''}
        onClick={(e) => cambiaFiltro(e.currentTarget, true)}>Solo problemi{nProblemi ? ' (' + nProblemi + ')' : ''}</button>
    </div>
    <div className="diag-cornice">
      <div className="diag-console" id="diag-console" tabIndex="0" role="log" aria-label="Registro diagnostico"
        ref={cons} {...html(a.righeLogHtml())} />
    </div>
    <textarea id="diag-testo" className="diag-testo" ref={area} readOnly aria-label="Testo del registro, da copiare a mano" />
  </>);
}
