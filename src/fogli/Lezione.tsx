/* UNA COSA CHE HAI CAPITO — la scheda di una riga del registro.

   L'«evidenza» dice quanto è solida questa riga, non quanto vali tu: serve a
   poterla scrivere anche dopo averla vista una volta sola. Senza quel campo
   l'unico posto dove mettere una cosa capita sarebbe un esperimento — due
   settimane di base e due di intervento — e allora non la scrive nessuno. */
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Segno } from '../pezzi/pezzi';
import { usaCambioNativo } from '../pezzi/nativo';
import { LM } from '../dati/dati';
import { schermo, selectAreeOpz, ridisegnaLezioni, chiudiSheet, conAnnulla, render } from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

function RigaSc({ eti, cls, children }: { eti: ReactNode; cls?: string; children?: ReactNode }) {
  return <div className={'lista-riga sc-riga' + (cls ? ' ' + cls : '')}>
    <span className="sc-eti">{eti}</span>{children}
  </div>;
}

export default function Lezione({ id }: { id: string }) {
  const [, bump] = useState(0);
  const l = LM.trovaLezione(id);
  const testo = useRef<HTMLTextAreaElement>(null);
  const area = useRef<HTMLSpanElement>(null);
  usaCambioNativo(area, (i) => {
    LM.modificaLezione(id, { areaId: (i as HTMLSelectElement).value || null });
    ridisegnaLezioni();
  }, [id]);

  if (!l) { chiudiSheet(); render(); return null; }
  const riga = l;
  const esp = riga.espId ? LM.load().esperimenti.find((x) => x.id === riga.espId) : null;
  const ridisegna = () => { bump((n) => n + 1); ridisegnaLezioni(); };

  return (
    <div className="sc">
      <label className="campo" htmlFor="lez-testo">Cosa hai capito</label>
      {/* si salva uscendo dal campo, come le altre schede: un tasto «salva»
          per una riga di testo è un tasto che si dimentica di premere */}
      <textarea key={riga.testo} id="lez-testo" rows={2} ref={testo} defaultValue={riga.testo}
        onBlur={() => {
          const v = (testo.current ? testo.current.value : '').trim();
          const adesso = LM.trovaLezione(id);
          if (v && adesso && v !== adesso.testo) { LM.modificaLezione(id, { testo: v }); ridisegnaLezioni(); }
        }} />

      <div className="lista-eti"><Segno nome="confronto" dim={11} />Evidenza</div>
      <div className="q-chips">
        {LM.FORZE_LEZIONE.map((f) => (
          <button key={f.id} className={'q-chip' + (f.id === riga.forza ? ' on' : '')} data-forza={f.id}
            onClick={() => { LM.modificaLezione(id, { forza: f.id }); ridisegna(); }}>{f.eti}</button>
        ))}
      </div>
      <p className="lista-nota">Dice quanto è solida questa riga, non quanto vali tu. Serve a poterla scrivere anche dopo averla vista una volta sola.</p>

      <div className="lista-eti"><Segno nome="ingranaggio" dim={11} />Dettagli</div>
      <div className="lista">
        <RigaSc eti="Esito" cls="sc-riga-alta">
          <span className="sc-val q-chips">
            <button className={'q-chip' + (riga.verso === 'si' ? ' on' : '')} data-verso="si"
              onClick={() => { LM.modificaLezione(id, { verso: 'si' }); ridisegna(); }}>
              <Segno nome="funziona" dim={13} /> funziona</button>
            <button className={'q-chip' + (riga.verso === 'no' ? ' on' : '')} data-verso="no"
              onClick={() => { LM.modificaLezione(id, { verso: 'no' }); ridisegna(); }}>
              <Segno nome="nonFunziona" dim={13} /> non funziona</button>
          </span>
        </RigaSc>
        <RigaSc eti="Area">
          <span className="sc-val" ref={area} {...html(selectAreeOpz('lez-area', riga.areaId, 'sc-inline'))} />
        </RigaSc>
        {esp ? <RigaSc eti="Misurato con"><span className="sc-val">{esp.nome}</span></RigaSc> : null}
        <RigaSc eti="Scritta"><span className="sc-val">{LM.fmtShort(LM.dayKey(new Date(riga.creata)))}</span></RigaSc>
      </div>

      <div className="lista mt">
        {/* Il modulo dell'esperimento si apre già scritto con la riga di qui:
            chi vuole verificare una cosa che ha già capito non deve ribatterla.
            Si passa per una variabile e non per una chiamata a caldo — la
            vista si ridisegna da zero, e un timeout che va a cercare il modulo
            dopo sessanta millesimi funziona o no a seconda di cos'altro sta
            succedendo. Così è il disegno stesso che lo apre. */}
        <button className="lista-riga sc-riga sc-tocca" id="lez-esp" onClick={() => {
          schermo.lezDaProvare = LM.trovaLezione(id);
          chiudiSheet();
          window.location.hash = '#/esperimenti';
          render();
        }}>
          <span className="sc-eti"><Segno nome="flask" /> Provalo con un esperimento</span>
          <span className="lista-chev"><Segno nome="chevronGiu" /></span>
        </button>
        <button className="lista-riga sc-riga sc-tocca sc-pericolo" id="lez-del" onClick={() => {
          conAnnulla('Riga tolta.', 'trash', () => { LM.rimuoviLezione(id); });
          chiudiSheet(); ridisegnaLezioni();
        }}>
          <span className="sc-eti"><Segno nome="trash" /> Togli questa riga</span>
        </button>
      </div>
    </div>
  );
}
