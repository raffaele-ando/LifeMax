/* BACKUP E RIPRISTINO — le copie prese prima di ogni sostituzione dei dati.

   LE COPIE NEL CLOUD c'erano da mesi e non si vedevano. Ogni volta che il
   documento remoto sta per essere toccato ne viene messa da parte una copia:
   finché nessuno poteva guardarle era mezza rete di sicurezza, perché quando i
   dati spariscono da un dispositivo e da lì salgono, la copia buona è
   esattamente là e non c'era modo di arrivarci.
   Si caricano dopo, perché passano dalla rete: il pannello si apre subito con
   quelle locali e questa parte si riempie quando arriva. */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Segno, Tasto } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import type { CopiaNelCloud } from '../nuvola/nuvola';
import { avviso, chiudiSheet, applicaTema, render, toast } from '../app/app';

const MOTIVI: Record<string, string> = {
  'prima-azzeramento': 'prima della cancellazione',
  'prima-import': 'prima di un import',
  'prima-del-ripristino': 'prima di un ripristino',
  'prima-di-adottare-cloud': 'prima di caricare dal cloud',
  'questo-dispositivo-prima-di-adottare-cloud': 'prima di caricare dal cloud',
  'prima-di-aggiornamento-da-altro-dispositivo': 'prima di un aggiornamento da un altro dispositivo',
  'prima-di-unire-col-cloud': 'prima di unire con il cloud',
  'prima-di-riprendere-una-copia-dal-cloud': 'prima di riprendere una copia dal cloud',
  'prima-di-sostituire-con-una-copia-dal-cloud': 'prima di sostituire con una copia dal cloud',
  'prima-di-togliere-i-dati-di-esempio': 'prima di togliere i dati di esempio',
  'prima-di-sfoltire-il-registro': 'prima di fare spazio',
  'prima-di-riprendere-il-profilo': 'prima di riprendere il profilo',
  'prima-di-dividere-il-documento': 'prima di passare al cloud diviso in pezzi',
  'copia-del-giorno': 'copia del giorno',
  'prima-di-sostituire-con-una-copia': 'prima di sostituire con una copia',
  'prima-di-riprendere-una-copia': 'prima di riprendere una copia',
  'prima-di-entrare-nell-account': 'prima di entrare nell’account',
  'uscita-dall-account': 'all’uscita dall’account'
};

const quando = (ts: number): string => (ts
  ? new Date(ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : 'senza data');

/* LE COPIE NEL CLOUD, che arrivano dalla rete e quindi dopo.

   Tre cose si possono fare con una copia, e ognuna dice cosa tocca:
     · «Riprendi il profilo» rimette SOLO nome, visione, sveglia, tema,
       timer… di quella copia, e lascia tutto il resto com'è. È la strada per
       chi si è visto azzerare il profilo da un telefono nuovo o dall'altro
       indirizzo del sito;
     · «Riprendi tutto» AGGIUNGE quello che manca e non toglie niente;
     · «Sostituisci» mette quella copia al posto di tutto.
   Le copie della versione di prima dell'app (fino a novembre 2026) stanno a
   parte e sono intere, quindi pesanti: si cercano solo a richiesta. */
function RigaCopia({ b, puo }: { b: CopiaNelCloud; puo: Puo }) {
  const chi = b.nome ? '«' + b.nome + '»' : 'profilo senza nome';
  return (
    <div className="backup-riga" key={String(b.id)}>
      <div><b>{quando(b.ts || b.salvato)}</b><small>{b.ricchezza} elementi · {chi}{b.motivo && MOTIVI[b.motivo] ? ' · ' + MOTIVI[b.motivo] : ''}</small></div>
      <Tasto testo="Riprendi il profilo" misura="mini" dati={{ 'data-cloudprof': String(b.id) }} onClick={() => {
        avviso({
          titolo: 'Riprendere il profilo di questa copia?',
          testo: 'Tornano il nome' + (b.nome ? ' (' + b.nome + ')' : '') + ', la visione, la sveglia, il tema e le altre impostazioni di quella copia, su tutti i tuoi dispositivi. Le cose fatte, i voti e il diario restano come sono adesso. Prima faccio un backup.',
          azione: 'Riprendi il profilo'
        }, () => {
          void puo.profilo(b.id, !!b.vecchia).then((fatto) => {
            chiudiSheet(); applicaTema(); render();
            toast(fatto ? 'Profilo ripreso.' : 'Non sono riuscito a riprenderlo.', 0, fatto ? 'cloudCheck' : 'alert');
          });
        });
      }} />
      <Tasto testo="Riprendi tutto" misura="mini" piu="btn-ghost" dati={{ 'data-cloudbk': String(b.id) }} onClick={() => {
        avviso({
          titolo: 'Riprendere tutta questa copia?',
          testo: 'Quello che c’è nella copia e adesso manca viene aggiunto, su tutti i tuoi dispositivi. Non viene tolto niente.',
          azione: 'Riprendi tutto'
        }, () => {
          void puo.riprendi(b.id, !!b.vecchia).then((fatto) => {
            chiudiSheet(); render();
            toast(fatto ? 'Copia ripresa e unita.' : 'Non sono riuscito a riprenderla.', 0, fatto ? 'cloudCheck' : 'alert');
          });
        });
      }} />
      <Tasto testo="Sostituisci" misura="mini" piu="btn-ghost" dati={{ 'data-cloudsost': String(b.id) }} onClick={() => {
        avviso({
          titolo: 'Sostituire con questa copia?',
          testo: 'I dati attuali verranno salvati in un backup e sostituiti da questa copia, su tutti i tuoi dispositivi. Quello che hai fatto dopo quella data non ci sarà più (resta nel backup).',
          azione: 'Sostituisci', pericolo: true
        }, () => {
          void puo.sostituisci(b.id, !!b.vecchia).then((fatto) => {
            chiudiSheet(); applicaTema(); render();
            toast(fatto ? 'Fatto: adesso ci sono solo i dati di quella copia.' : 'Non sono riuscito a sostituire.',
              0, fatto ? 'cloudCheck' : 'alert');
          });
        });
      }} />
    </div>
  );
}

interface Puo {
  leggi: () => Promise<CopiaNelCloud[]>;
  vecchie: () => Promise<CopiaNelCloud[]>;
  riprendi: (id: string, vecchia?: boolean) => Promise<boolean>;
  sostituisci: (id: string, vecchia?: boolean) => Promise<boolean>;
  profilo: (id: string, vecchia?: boolean) => Promise<boolean>;
}

function Cloud() {
  /* Le funzioni delle copie ci sono soltanto quando l'SDK si è caricato.
     Prese tutte insieme qui: o c'è tutto il pannello o non c'è niente. */
  const c = window.LMCloud;
  const puo: Puo | null = c && c.available && c.backups && c.backupsVecchi && c.riprendiBackup && c.sostituisciConBackup && c.riprendiProfilo
    ? { leggi: c.backups, vecchie: c.backupsVecchi, riprendi: c.riprendiBackup, sostituisci: c.sostituisciConBackup, profilo: c.riprendiProfilo }
    : null;
  const [stato, setStato] = useState<'attesa' | 'arrivate'>('attesa');
  const [righe, setRighe] = useState<CopiaNelCloud[]>([]);
  const [vecchie, setVecchie] = useState<'no' | 'cerco' | CopiaNelCloud[]>('no');

  useEffect(() => {
    if (!puo) return undefined;
    let via = false;
    void puo.leggi().then((arr) => { if (!via) { setRighe(arr); setStato('arrivate'); } });
    return () => { via = true; };
  }, [puo ? 1 : 0]);

  if (!puo) return null;
  const eti = (conta: number | null): ReactNode => (
    <div className="lista-eti"><Segno nome="cloudCheck" dim={11} />Nel cloud{conta ? <> <span>{conta}</span></> : null}</div>
  );
  return (<>
    {eti(stato === 'arrivate' && righe.length ? righe.length : null)}
    {stato === 'attesa' ? <div className="imp-nota" style={{ margin: 0 }}>Sto guardando…</div> : null}
    {stato === 'arrivate' && !righe.length ? <div className="imp-nota" style={{ margin: 0 }}>Nessuna copia online, per ora. Ne faccio una al giorno, e una prima di ogni ripristino; tengo le ultime trenta.</div> : null}
    {righe.length ? (<>
      <div className="imp-nota" style={{ margin: 0 }}>
        <b>Riprendi il profilo</b> rimette solo nome, visione, sveglia, tema e impostazioni.{' '}
        <b>Riprendi tutto</b> aggiunge quello che manca e non toglie niente.{' '}
        <b>Sostituisci</b> mette la copia al posto di tutto.
      </div>
      <div className="backup-lista">{righe.map((b) => <RigaCopia key={b.id} b={b} puo={puo} />)}</div>
    </>) : null}
    {vecchie === 'no' ? (
      <Tasto testo="Cerca anche le copie di prima (fino a novembre 2026)" misura="mini" piu="btn-ghost" dati={{ 'data-cloudvecchie': '1' }} onClick={() => {
        setVecchie('cerco');
        void puo.vecchie().then((arr) => setVecchie(arr));
      }} />
    ) : vecchie === 'cerco' ? (
      <div className="imp-nota" style={{ margin: 0 }}>Cerco le copie di prima… sono intere, può volerci un po’.</div>
    ) : vecchie.length ? (<>
      <div className="lista-eti"><Segno nome="archivio" dim={11} />Copie di prima <span>{vecchie.length}</span></div>
      <div className="imp-nota" style={{ margin: 0 }}>Copie prese dalla versione di prima dell’app. Se il tuo profilo è stato azzerato, cerca qui una copia col tuo nome e usa «Riprendi il profilo».</div>
      <div className="backup-lista">{vecchie.map((b) => <RigaCopia key={'v' + b.id} b={b} puo={puo} />)}</div>
    </>) : (
      <div className="imp-nota" style={{ margin: 0 }}>Nessuna copia di prima nel cloud.</div>
    )}
  </>);
}

export default function Backup() {
  const lista = LM.listBackups();
  return (<>
    <div className="lista-eti"><Segno nome="archivio" dim={11} />Su questo dispositivo{lista.length ? <> <span>{lista.length}</span></> : null}</div>
    {lista.length ? (
      <div className="backup-lista">
        {lista.map((b) => (
          <div className="backup-riga" key={b.ts}>
            <div><b>{quando(b.ts)}</b><small>{b.ricchezza} elementi{b.motivo && MOTIVI[b.motivo] ? ' · ' + MOTIVI[b.motivo] : ''}</small></div>
            <Tasto testo="Ripristina" misura="mini" dati={{ 'data-ts': String(b.ts) }} onClick={() => {
              avviso({
                titolo: 'Ripristinare questo backup?',
                testo: 'I dati attuali verranno salvati in un nuovo backup.',
                azione: 'Ripristina'
              }, () => {
                LM.restoreBackup(b.ts); chiudiSheet(); applicaTema(); render();
                toast('Backup ripristinato.', 0, 'archivio');
              });
            }} />
          </div>
        ))}
      </div>
    ) : (
      <div className="imp-nota" style={{ margin: 0 }}>Non ci sono ancora backup. Vengono creati automaticamente ogni volta che i dati stanno per essere sostituiti.</div>
    )}
    <SenzaProprietario />
    <div id="bk-cloud"><Cloud /></div>
  </>);
}

/* LE COPIE SENZA PROPRIETARIO (verifica 3, N1). Copie prese da una versione
   di prima su questo dispositivo, che non si sa di chi siano: su un
   dispositivo condiviso possono essere di un'altra persona. Non si
   ripristinano (finirebbero nell'account di chi è dentro adesso): si possono
   solo scaricare in un file — che chi è sicuro che sia suo può importare da
   «Importa dati» — o eliminare. Si vedono solo se ce ne sono. */
function SenzaProprietario() {
  const [, rifai] = useState(0);
  const lista = LM.copieSenzaProprietario();
  if (!lista.length) return null;
  const scarica = (ts: number): void => {
    const testo = LM.fileCopiaSenzaProprietario(ts);
    if (!testo) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([testo], { type: 'application/json' }));
    a.download = 'lifemax-copia-senza-proprietario-' + new Date(ts || Date.now()).toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  };
  return (<>
    <div className="lista-eti" id="bk-senza"><Segno nome="archivio" dim={11} />Copie senza proprietario <span>{lista.length}</span></div>
    <div className="imp-nota" style={{ margin: 0 }}>Copie prese prima dell’aggiornamento di novembre 2026 su questo dispositivo, quando ancora non si segnava di chi erano. <b>Possono essere di un’altra persona che ha usato questo browser.</b> Per questo non si ripristinano: se sei sicuro che una sia tua, scaricala e usa «Importa dati»; altrimenti eliminala.</div>
    <div className="backup-lista">
      {lista.map((b) => (
        <div className="backup-riga" key={'s' + b.ts}>
          <div><b>{quando(b.ts)}</b><small>{b.ricchezza} elementi{b.motivo && MOTIVI[b.motivo] ? ' · ' + MOTIVI[b.motivo] : ''}</small></div>
          <Tasto testo="Scarica" misura="mini" dati={{ 'data-senza-scarica': String(b.ts) }} onClick={() => scarica(b.ts)} />
          <Tasto testo="Elimina" misura="mini" piu="btn-ghost" dati={{ 'data-senza-elimina': String(b.ts) }} onClick={() => {
            avviso({ titolo: 'Eliminare questa copia?', testo: 'Non si potrà più recuperare.', azione: 'Elimina' }, () => {
              LM.eliminaCopiaSenzaProprietario(b.ts); rifai((n) => n + 1); toast('Copia eliminata.', 0, 'archivio');
            });
          }} />
        </div>
      ))}
    </div>
  </>);
}
