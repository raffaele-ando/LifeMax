/* LA SCHEDA DI UN'ABITUDINE.

   Il pannello faceva tre cose in una sola colonna da quaranta comandi —
   spuntare l'abitudine di oggi, guardare come sta andando, e cambiarne le
   regole — mentre la ragione per cui lo si apre è quasi sempre la prima. Le
   regole si mettono una volta e poi non si toccano più: stanno dietro una
   riga. Anche «Elimina» sta lì dentro: è raro e non si torna indietro.

   Quella riga è chiusa ogni volta che si apre la scheda: aprirla è una
   decisione, non una preferenza da ricordare. */
import { useEffect, useRef, useState } from 'react';
import { Segno } from '../pezzi/pezzi';
import { usaCambioNativo } from '../pezzi/nativo';
import { LM } from '../dati/dati';
import { giorno as comeGiorno, ora as comeOra } from '../tipi/stato';
import type { Giorno } from '../tipi/stato';
import { presa } from '../tipi/presa';
import {
  GIORNI_ORD, GIORNI_LAB, DURATE, chipsGiorni, riepilogoGiorni, leggiGiorni,
  statoAbitudineOggi, giorniAbitudine, areeAttive, feedbackSpunta,
  conAnnulla, chiudiSheet, toast, titoloSheetModificabile
} from '../app/app';
import type { CasellaCatena } from '../app/app';
import { html } from '../pezzi/grezzo';


/* LA GRIGLIA DICE QUAL È, E I GIORNI CHE NON SONO ARRIVATI NON CI SONO.
   Sette colonne con L M M G V S D sopra e i numeri dei giorni dentro sono un
   calendario del mese, a guardarli: e allora ad agosto uno vede una griglia
   che comincia il 3 e finisce il 28 e si chiede dove siano gli altri tre
   giorni. Sono le ultime quattro settimane, e adesso c'è scritto.
   I giorni che devono ancora arrivare non sono caselle: tengono il posto nella
   griglia e basta. Prima erano caselle senza fondo e senza bordo — sembravano
   vuote, e `.abd-g:hover` gliene riaccendeva il bordo appena ci passavi
   sopra. */
function Catena({ giorni, onGiorno }: { giorni: CasellaCatena[]; onGiorno: (k: Giorno) => void }) {
  return (<>
    <div className="abd-testa">{GIORNI_ORD.map((d) => <span key={d}>{GIORNI_LAB[d]}</span>)}</div>
    <div className="abd-catena" role="group" aria-label="Le ultime quattro settimane">
      {giorni.map((g, i) => {
        if (g.futuro) return <span key={i} className="abd-vuoto" aria-hidden="true" />;
        const cls = 'abd-g' + (g.fatto ? ' fatto' : '') + (g.saltato ? ' saltato' : '') +
          (!g.prevista && !g.fatto && !g.saltato ? ' fuori' : '') + (g.oggi ? ' oggi' : '');
        const che = g.fatto ? 'fatta' : g.saltato ? 'saltata' : g.prevista ? 'non fatta' : 'non prevista';
        const corto = LM.fmtShort(g.k).split(' ')[0];
        return (
          <button key={i} className={cls} data-giorno-ab={g.k} aria-pressed={g.fatto ? 'true' : 'false'}
            aria-label={LM.fmtShort(g.k) + ', ' + che} title={LM.fmtShort(g.k)}
            onClick={() => onGiorno(g.k)}>
            <span>{corto}</span>
          </button>
        );
      })}
    </div>
  </>);
}

export interface PropAbitudine { id: string; dopo?: (() => void) | undefined }

export default function Abitudine({ id, dopo }: PropAbitudine) {
  /* TUTTI I GANCI PRIMA DELL'USCITA ANTICIPATA: React li conta, e nello
     stesso ordine a ogni disegno. */
  const [, bump] = useState(0);
  const gg = useRef<HTMLDivElement>(null);
  const ora = useRef<HTMLInputElement>(null);
  const dur = useRef<HTMLSelectElement>(null);
  const area = useRef<HTMLSelectElement>(null);
  const da = useRef<HTMLInputElement>(null);
  const fin = useRef<HTMLInputElement>(null);

  const trovata = LM.load().abitudini.find((x) => x.id === id);
  const ridisegna = () => { bump((n) => n + 1); if (dopo) dopo(); };

  /* i campi che salvano nei dati tengono il `change` vero del browser: la
     ragione sta in `pezzi/nativo.ts` */
  /* il nome si cambia toccandolo, nel titolo del foglio */
  useEffect(() => {
    const h0 = LM.load().abitudini.find((x) => x.id === id);
    if (h0) titoloSheetModificabile(h0.testo, (v) => { LM.modificaAbitudine(id, { testo: v }); if (dopo) dopo(); });
  }, [id]);
  usaCambioNativo(ora, (i) => {
    const v = (i as HTMLInputElement).value;
    LM.modificaAbitudine(id, { ora: v ? comeOra(v) : null }); ridisegna();
  }, [id, trovata ? trovata.ora : null]);
  usaCambioNativo(dur, (i) => {
    const v = (i as HTMLSelectElement).value;
    LM.modificaAbitudine(id, { durata: v ? +v : null }); if (dopo) dopo();
  }, [id]);
  usaCambioNativo(area, (i) => {
    LM.modificaAbitudine(id, { areaId: (i as HTMLSelectElement).value }); if (dopo) dopo();
  }, [id]);
  usaCambioNativo(da, (i) => {
    const q = LM.load().abitudini.find((x) => x.id === id);
    const v = (i as HTMLInputElement).value;
    LM.impostaPeriodoAbitudine(id, v ? comeGiorno(v) : null, q && q.a ? q.a : null); ridisegna();
  }, [id, trovata ? trovata.da : null, trovata ? trovata.a : null]);
  usaCambioNativo(fin, (i) => {
    const q = LM.load().abitudini.find((x) => x.id === id);
    const v = (i as HTMLInputElement).value;
    LM.impostaPeriodoAbitudine(id, q && q.da ? q.da : null, v ? comeGiorno(v) : null); ridisegna();
  }, [id, trovata ? trovata.da : null, trovata ? trovata.a : null]);

  if (!trovata) { chiudiSheet(); if (dopo) dopo(); return null; }
  const h = trovata;

  const st = statoAbitudineOggi(h);
  const serie = LM.streakAbitudine(h);
  const record = LM.recordAbitudine(h);
  const volte = Object.keys(h.fatti || {}).length;
  const giorni = giorniAbitudine(h, 4);
  const prevista = LM.abitudinePrevista(h, LM.todayKey());

  /* le pastiglie dei giorni le scrive `chipsGiorni`: sono le stesse della riga
     d'aggiunta, e riscriverle vorrebbe dire due sorgenti per la stessa forma.
     Il tocco si prende sul contenitore. */
  const toccaGiorno = (e: React.MouseEvent) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const chip = t.closest('.giorno-chip');
    if (!chip) return;
    chip.classList.toggle('sel');
    LM.modificaAbitudine(id, { giorni: leggiGiorni(presa(gg.current)) });
    ridisegna();
  };

  const ar = areeAttive().find((x) => x.id === h.areaId);
  return (
    <div className="abd">
      <div className="abd-chi">
        {ar ? <span className="abd-area" style={{ '--c-area': LM.coloreArea(ar) } as React.CSSProperties}><Segno nome={ar.icona} dim={13} /> {ar.nome}</span> : null}
        <span>{riepilogoGiorni(h.giorni)}{h.ora ? ' · ' + h.ora : ''}</span>
      </div>

      <div className="abd-oggi">
        {st.saltata ? (
          <button className="btn btn-grande" id="abd-rimetti"
            onClick={() => { LM.saltaGiornoAbitudine(id); ridisegna(); }}>
            <Segno nome="annulla" /> Rimetti oggi
          </button>
        ) : <>
          <button className={'btn btn-grande ' + (st.fatta ? 'btn-ok' : 'btn-primario')} id="abd-fatta"
            onClick={(ev) => {
              feedbackSpunta(ev, LM.completaAbitudine(id), 'Fatta', 'flame');
              ridisegna();
            }}>
            <Segno nome="check" />{st.fatta ? ' Fatta oggi' : ' Fatta'}
          </button>
          {prevista && !st.fatta ? (
            <button className="sp-link" id="abd-salta" onClick={() => {
              LM.saltaGiornoAbitudine(id);
              toast('Saltata per oggi. La serie regge.', 0, 'moon');
              ridisegna();
            }}>Salta oggi</button>
          ) : null}
        </>}
      </div>

      <div className="abd-numeri" role="img" aria-label={serie + ' giorni di fila, record ' + Math.max(record, serie) + ', ' + volte + ' volte in tutto'}>
        <span><b><Segno nome="flame" dim={18} piu={serie > 0 ? 'fiamma' : ''} />{serie}</b>di fila</span>
        <span><b>{Math.max(record, serie)}</b>record</span>
        <span><b>{volte}</b>in tutto</span>
      </div>

      <Catena giorni={giorni} onGiorno={(k) => {
        if (k > LM.todayKey()) return;
        LM.completaAbitudine(id, k);
        ridisegna();
      }} />

      <div className="gr-titolo">Quando</div>
      <div className="gr">
        <div className="gr-riga gr-giorni" id="abd-giorni" ref={gg} onClick={toccaGiorno} {...html(chipsGiorni(h.giorni))} />
        <label className="gr-riga" htmlFor="abd-ora"><span className="gr-eti">Ora</span>
          <span className="gr-valori">
            <input key={h.ora || 'niente'} type="time" className="gr-val" id="abd-ora" ref={ora} defaultValue={h.ora || ''} />
            {h.ora ? <button className="gr-via" id="abd-noora" aria-label="Togli l’orario"
              onClick={(e) => { e.preventDefault(); LM.modificaAbitudine(id, { ora: null }); ridisegna(); }}><Segno nome="x" dim={13} /></button> : null}
          </span></label>
        <label className="gr-riga" htmlFor="abd-dur"><span className="gr-eti">Durata</span>
          <select key={'d' + (h.durata || '')} className="gr-val" id="abd-dur" ref={dur}
            defaultValue={String(h.durata == null ? '' : h.durata)}>
            {DURATE.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.t}</option>)}
          </select></label>
      </div>

      <div className="gr-titolo">Dettagli</div>
      <div className="gr">
        <label className="gr-riga" htmlFor="abd-area"><span className="gr-eti">Area</span>
          <select key={'ar' + (h.areaId || '')} className="gr-val" id="abd-area" ref={area} defaultValue={h.areaId}>
            {areeAttive().map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
          </select></label>
        <label className="gr-riga" htmlFor="abd-da"><span className="gr-eti">Inizio</span>
          <input key={'da' + (h.da || '')} type="date" className="gr-val" id="abd-da" ref={da} defaultValue={h.da || ''} /></label>
        <div className="gr-riga"><span className="gr-eti">Fine</span>
          <span className="gr-valori">
            {/* il campo c'è sempre (era montato solo dopo un primo tocco, e così
                il suo cambio non veniva mai ascoltato: la data non si salvava);
                vuoto, mostra «Mai» */}
            <span className="gr-data">
              <input key={'a' + (h.a || '')} type="date" className="gr-val" id="abd-a" ref={fin} defaultValue={h.a || ''} min={h.da || ''} required />
              <span className="gr-mai" aria-hidden="true">Mai</span>
            </span>
            {h.a ? <button className="gr-via" id="abd-nofine" aria-label="Senza fine"
              onClick={(e) => { e.preventDefault(); LM.impostaPeriodoAbitudine(id, h.da || null, null); ridisegna(); }}><Segno nome="x" dim={13} /></button> : null}
          </span></div>
      </div>

      <button className="gr-pericolo" id="abd-del" onClick={() => {
        conAnnulla('Abitudine eliminata.', 'trash', () => {
          LM.rimuoviAbitudine(id);
          chiudiSheet();
          if (dopo) dopo();
        });
      }}>Elimina l’abitudine</button>
    </div>
  );
}