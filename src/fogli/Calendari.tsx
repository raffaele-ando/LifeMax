/* CALENDARI COLLEGATI — Google e Outlook, nei due sensi.

   Il pannello risponde a tre domande, nell'ordine in cui le fa chi lo apre:
     1. è collegato? (e se no, cosa manca: l'ID dell'app, o un tocco qui)
     2. quali calendari entrano, e in che area?
     3. è andata? (l'ultima sincronizzazione, e l'intoppo detto semplice)

   UNA COSA CHE NON SI VEDE MA CONTA: il permesso di Google o di Microsoft
   vale solo per QUESTO browser. La scelta dei calendari si sincronizza con
   i tuoi dati, il permesso no — quindi su un dispositivo nuovo il pannello
   dice «collegato su un altro dispositivo» e chiede un tocco su «Collega».
   È voluto: un permesso sul tuo calendario di lavoro non viaggia nel cloud.

   CON LA SENTINELLA (il server di LifeMax, sentinella/) è diverso: il
   permesso lo tiene il server, cifrato, ed è dell'account. Un tocco su
   «Collega» vale per tutti i dispositivi, non scade ogni ora, e il
   calendario resta allineato anche ad app chiusa. Il pannello lo dice. */
import { useEffect, useState } from 'react';
import type { Provenienza, AccountCalendario } from '../tipi/stato';
import { Tasto } from '../pezzi/pezzi';
import { usaLM } from '../pezzi/usaLM';
import { areeAttive } from '../app/app';
import { ISTRUZIONI } from '../calendari/config';
import {
  FORNITORI, conf, statoQui, collega, ricollega, scollega, scegli, scegliDestinazione,
  salvaId, sincronizzaOra, aggiornaCalendari, preparaPannello, viaServer
} from '../calendari/sincronia';

const NOMI: Record<Provenienza, string> = { google: 'Google Calendar', microsoft: 'Outlook e Microsoft 365' };

function quando(ts: number): string {
  if (!ts) return '';
  const d = new Date(ts), oggi = new Date();
  const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  return d.toDateString() === oggi.toDateString() ? 'oggi alle ' + ora
    : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' alle ' + ora;
}

function Servizio({ p }: { p: Provenienza }) {
  const f = FORNITORI[p];
  const a: AccountCalendario | undefined = conf()[p];
  const configurato = !!f.idApp();
  const collegato = !!a && a.collegato;
  const pronto = f.pronto();
  const qui = statoQui();
  const server = viaServer(p);
  const [chiede, setChiede] = useState(false);

  /* COSA SI LEGGE ACCANTO A «STATO»: quattro casi, e il quarto è quello che
     sorprende — collegato altrove, non qui */
  let stato: string;
  if (!configurato) stato = 'Da configurare';
  else if (!collegato) stato = 'Da collegare';
  else if (!pronto) stato = server || qui.ricollega[p] ? 'Da ricollegare' : 'Collegato su un altro dispositivo';
  else stato = 'Collegato';

  const calendari = a ? Object.keys(a.calendari).map((id) => ({ id, c: a.calendari[id] })) : [];
  const aree = areeAttive();

  return (<>
    <div className="gr-titolo">{NOMI[p]}</div>
    <div className="gr" id={'cal-' + p}>
      <div className="gr-riga">
        <span className="gr-eti">Stato</span>
        <span className="gr-fisso" id={'cal-' + p + '-stato'}>{stato}</span>
      </div>
      {collegato && a && a.email ? (
        <div className="gr-riga"><span className="gr-eti">Account</span><span className="gr-fisso cal-email">{a.email}</span></div>
      ) : null}
      {!configurato ? (
        <label className="gr-riga" htmlFor={'cal-' + p + '-id'}>
          <span className="gr-eti">Client ID</span>
          {/* il campo salva quando lo lasci, non a ogni tasto: un ID a metà
              non è un ID, e salvarlo vorrebbe dire «configurato» per finta */}
          <input key={'id-' + p} id={'cal-' + p + '-id'} className="gr-val cal-id" type="text" autoComplete="off"
            spellCheck={false} placeholder="Incollalo qui" defaultValue=""
            onBlur={(e) => { const v = e.target.value.trim(); if (v) salvaId(p, v); }}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
        </label>
      ) : null}
      {configurato && !collegato ? (
        <button type="button" className="gr-riga gr-agg cal-tasto" id={'cal-' + p + '-collega'}
          onClick={() => { void collega(p); }}>Collega {f.nome}</button>
      ) : null}
      {configurato && collegato && !pronto ? (
        <button type="button" className="gr-riga gr-agg cal-tasto" id={'cal-' + p + '-ricollega'}
          onClick={() => { if (server || qui.ricollega[p]) void ricollega(p); else void collega(p); }}>
          {server || qui.ricollega[p] ? 'Ricollega' : 'Collega anche qui'}
        </button>
      ) : null}
      {calendari.map(({ id, c }) => c ? (
        <div className="gr-riga cal-riga" key={id}>
          <span className="gr-eti cal-nome">{c.nome}{c.lettura ? <span className="gr-muto"> · solo lettura</span> : null}</span>
          <select className="gr-val" aria-label={'Area per ' + c.nome} value={c.areaId}
            onChange={(e) => scegli(p, id, { areaId: e.target.value })}>
            {aree.map((ar) => <option key={ar.id} value={ar.id}>{ar.nome}</option>)}
          </select>
          <button type="button" className={'interr' + (c.on ? ' on' : '')} role="switch" aria-checked={c.on ? 'true' : 'false'}
            aria-label={'Importa ' + c.nome} data-cal={id} onClick={() => scegli(p, id, { on: !c.on })}><i /></button>
        </div>
      ) : null)}
      {collegato && !chiede ? (
        <button type="button" className="gr-riga gr-agg gr-rosso cal-tasto" id={'cal-' + p + '-scollega'}
          onClick={() => setChiede(true)}>Scollega</button>
      ) : null}
    </div>
    {!configurato ? (
      <p className="gr-nota">
        Prima serve l’ID dell’app presso {f.nome === 'Google' ? 'Google' : 'Microsoft'}: si fa una volta sola.{' '}
        <a className="sp-link cal-link" href={ISTRUZIONI} target="_blank" rel="noopener">Come si ottiene</a>
      </p>
    ) : null}
    {configurato && collegato && !pronto && !qui.ricollega[p] && !server ? (
      <p className="gr-nota">Il permesso resta in ogni browser: su questo dispositivo basta un tocco.</p>
    ) : null}
    {server && collegato && !pronto ? (
      <p className="gr-nota" id={'cal-' + p + '-server'}>Il permesso adesso lo tiene LifeMax: un tocco, una volta sola, e vale su tutti i tuoi dispositivi, anche ad app chiusa.</p>
    ) : null}
    {server && collegato && pronto ? (
      <p className="gr-nota" id={'cal-' + p + '-server'}>Resta allineato anche ad app chiusa: il permesso lo tiene LifeMax, cifrato, e non scade.</p>
    ) : null}
    {collegato && pronto && !calendari.some((x) => x.c && x.c.on) ? (
      <p className="gr-nota">Accendi i calendari che vuoi vedere fra le tue attività.</p>
    ) : null}
    {chiede ? (<>
      {/* SCOLLEGARE CHIEDE UNA COSA SOLA: le attività arrivate da lì. Tre
          risposte, nessuna sbagliata, e nessuna tocca il calendario. */}
      <p className="gr-nota">Le attività arrivate da {f.nome} restano qui, staccate, o le tolgo? Quelle già fatte restano comunque. Il calendario non si tocca.</p>
      <div className="gr cal-chiede">
        <button type="button" className="gr-riga gr-agg cal-tasto" id={'cal-' + p + '-tieni'}
          onClick={() => { setChiede(false); void scollega(p, 'tieni'); }}>Tienile, staccate</button>
        <button type="button" className="gr-riga gr-agg gr-rosso cal-tasto" id={'cal-' + p + '-togli'}
          onClick={() => { setChiede(false); void scollega(p, 'togli'); }}>Toglile</button>
        <button type="button" className="gr-riga gr-agg cal-tasto" onClick={() => setChiede(false)}>Lascia collegato</button>
      </div>
    </>) : null}
  </>);
}

export default function Calendari() {
  usaLM();
  const [, ridisegna] = useState(0);
  useEffect(() => {
    const via = () => ridisegna((n) => n + 1);
    window.addEventListener('lm:calendari', via);
    preparaPannello();
    /* l'elenco dei calendari si rinfresca all'apertura: un calendario nuovo
       creato su Google compare qui senza fare niente */
    (['google', 'microsoft'] as Provenienza[]).forEach((p) => {
      const a = conf()[p];
      if (a && a.collegato && FORNITORI[p].pronto()) void aggiornaCalendari(p);
    });
    return () => window.removeEventListener('lm:calendari', via);
  }, []);

  const c = conf();
  const qui = statoQui();
  const collegati = (['google', 'microsoft'] as Provenienza[]).filter((p) => { const a = c[p]; return !!a && a.collegato && !!FORNITORI[p].idApp(); });
  /* dove si può scrivere: i calendari ACCESI e non in sola lettura */
  const mete: { v: string; nome: string }[] = [];
  collegati.forEach((p) => {
    const a = c[p];
    if (!a) return;
    Object.keys(a.calendari).forEach((id) => {
      const x = a.calendari[id];
      if (x && x.on && !x.lettura) mete.push({ v: p + '|' + id, nome: FORNITORI[p].nome + ' · ' + x.nome });
    });
  });
  const esito = c.esito;

  return (
    <div className="sc">
      <Servizio p="google" />
      <Servizio p="microsoft" />

      {collegati.length ? (<>
        <div className="gr-titolo">Le attività nuove</div>
        <div className="gr">
          <label className="gr-riga" htmlFor="cal-dest">
            <span className="gr-eti">Scrivi le nuove attività con orario in…</span>
            <select id="cal-dest" className="gr-val" value={c.destinazione || ''}
              onChange={(e) => scegliDestinazione(e.target.value)}>
              <option value="">Nessuno</option>
              {mete.map((m) => <option key={m.v} value={m.v}>{m.nome}</option>)}
            </select>
          </label>
        </div>
        <p className="gr-nota">«Fatto» resta qui: il calendario non sa cosa vuol dire.</p>

        {/* SOLO SE QUI C'È UN PERMESSO. Senza, «Sincronizza ora» non avrebbe
            niente da fare se non chiedere il permesso — cioè sarebbe un
            secondo «Collega anche qui», con un altro nome (prove/doppioni.js) */}
        {collegati.some((p) => FORNITORI[p].pronto()) ? (
          <Tasto testo={qui.inCorso ? 'Sto sincronizzando…' : 'Sincronizza ora'} tipo="pieno" misura="grande" piu="gr-salva"
            id="cal-sincronizza" spento={qui.inCorso} onClick={() => { void sincronizzaOra(); }} />
        ) : null}
      </>) : null}

      {qui.nota ? <p className="gr-nota" id="cal-nota">{qui.nota}</p> : null}
      {qui.errore ? <p className="gr-nota" id="cal-errore">{qui.errore}</p> : null}
      {esito && esito.ts ? (
        <p className="gr-nota" id="cal-esito">Ultima sincronizzazione {quando(esito.ts)}. {esito.testo}</p>
      ) : null}
    </div>
  );
}
