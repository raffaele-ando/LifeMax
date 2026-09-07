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
  'prima-azzeramento': 'prima di azzerare',
  'prima-import': 'prima di un import',
  'prima-del-ripristino': 'prima di un ripristino',
  'prima-di-adottare-cloud': 'prima di caricare dal cloud',
  'questo-dispositivo-prima-di-adottare-cloud': 'prima di caricare dal cloud',
  'prima-di-aggiornamento-da-altro-dispositivo': 'prima di un aggiornamento da un altro dispositivo',
  'prima-di-unire-col-cloud': 'prima di unire con il cloud',
  'prima-di-riprendere-una-copia-dal-cloud': 'prima di riprendere una copia dal cloud',
  'prima-di-sostituire-con-una-copia-dal-cloud': 'prima di sostituire con una copia dal cloud',
  'prima-di-togliere-i-dati-di-esempio': 'prima di togliere i dati di esempio',
  'prima-di-sfoltire-il-registro': 'prima di fare spazio'
};

const quando = (ts: number): string => (ts
  ? new Date(ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : 'senza data');

/* LE COPIE NEL CLOUD, che arrivano dalla rete e quindi dopo. */
function Cloud() {
  /* Le tre funzioni delle copie sono facoltative nell'API della nuvola, e
     non per prudenza: ci sono soltanto quando l'SDK si è caricato. Prese
     tutte e tre insieme qui, o c'è tutto il pannello o non c'è niente —
     un tasto «Riprendi» acceso su una nuvola che non sa riprendere è
     peggio del tasto che non c'è. */
  const c = window.LMCloud;
  const puo = c && c.available && c.backups && c.riprendiBackup && c.sostituisciConBackup
    ? { leggi: c.backups, riprendi: c.riprendiBackup, sostituisci: c.sostituisciConBackup }
    : null;
  const [stato, setStato] = useState<'attesa' | 'arrivate'>('attesa');
  const [righe, setRighe] = useState<CopiaNelCloud[]>([]);

  useEffect(() => {
    if (!puo) return undefined;
    let via = false;
    void puo.leggi().then((arr) => { if (!via) { setRighe(arr); setStato('arrivate'); } });
    return () => { via = true; };
  }, [puo]);

  if (!puo) return null;
  const eti = (conta: number | null): ReactNode => (
    <div className="lista-eti"><Segno nome="cloudCheck" dim={11} />Nel cloud{conta ? <> <span>{conta}</span></> : null}</div>
  );
  if (stato === 'attesa') {
    return <>{eti(null)}<div className="imp-nota" style={{ margin: 0 }}>Sto guardando…</div></>;
  }
  if (!righe.length) {
    return <>{eti(null)}<div className="imp-nota" style={{ margin: 0 }}>Nessuna copia online. Ne viene creata una ogni volta che il cloud sta per essere sovrascritto.</div></>;
  }
  return (<>
    {eti(righe.length)}
    {/* RIPRENDERE AGGIUNGE, SOSTITUIRE RIFÀ DA CAPO. La seconda esiste per un
        caso solo, ma è un caso vero: quando quello che c'è adesso non è tuo.
        Unire è la regola dappertutto — la fusione col cloud, l'importazione da
        un file — proprio per non perdere niente; e allora da una fusione
        sbagliata non si tornava indietro in nessun modo. */}
    <div className="imp-nota" style={{ margin: 0 }}>
      <b>Riprendi</b> AGGIUNGE quello che manca e non toglie niente.{' '}
      <b>Sostituisci</b> mette questa copia al posto di tutto: serve quando quello che c’è adesso non è roba tua
      {' '}— i dati di esempio finiti nell’account a un accesso — e non c’è altro modo di toglierla.
    </div>
    <div className="backup-lista">
      {righe.map((b) => (
        <div className="backup-riga" key={String(b.id)}>
          <div><b>{quando(b.ts)}</b><small>{b.ricchezza} elementi</small></div>
          <Tasto testo="Riprendi" misura="mini" dati={{ 'data-cloudbk': String(b.id) }} onClick={() => {
            avviso({
              titolo: 'Riprendere questa copia?',
              testo: 'Quello che le manca viene aggiunto a quello che hai adesso. Niente viene tolto.',
              azione: 'Riprendi'
            }, () => {
              void puo.riprendi(b.id).then((fatto) => {
                chiudiSheet(); render();
                toast(fatto ? 'Copia ripresa e unita.' : 'Non sono riuscito a riprenderla.', 0, fatto ? 'cloudCheck' : 'alert');
              });
            });
          }} />
          <Tasto testo="Sostituisci" misura="mini" piu="btn-ghost" dati={{ 'data-cloudsost': String(b.id) }} onClick={() => {
            avviso({
              titolo: 'Mettere questa copia al posto di tutto?',
              testo: 'Quello che c’è adesso viene salvato in un backup su questo dispositivo, e al suo posto va questa copia. Le cose che nella copia non ci sono spariscono: è la sola via per togliere roba che non è tua.',
              azione: 'Sostituisci', pericolo: true
            }, () => {
              void puo.sostituisci(b.id).then((fatto) => {
                chiudiSheet(); applicaTema(); render();
                toast(fatto ? 'Fatto: adesso ci sono solo i dati di quella copia.' : 'Non sono riuscito a sostituire.',
                  0, fatto ? 'cloudCheck' : 'alert');
              });
            });
          }} />
        </div>
      ))}
    </div>
  </>);
}

export default function Backup() {
  const lista = LM.listBackups();
  return (<>
    <div className="imp-nota" style={{ marginTop: 0 }}>Ogni voce è una copia salvata prima di una sostituzione dei dati. Ripristinandone una, lo stato attuale viene comunque salvato come nuovo backup.</div>
    <div className="lista-eti"><Segno nome="archivio" dim={11} />Su questo dispositivo{lista.length ? <> <span>{lista.length}</span></> : null}</div>
    {lista.length ? (
      <div className="backup-lista">
        {lista.map((b) => (
          <div className="backup-riga" key={b.ts}>
            <div><b>{quando(b.ts)}</b><small>{b.ricchezza} elementi{b.motivo && MOTIVI[b.motivo] ? ' · ' + MOTIVI[b.motivo] : ''}</small></div>
            <Tasto testo="Ripristina" misura="mini" dati={{ 'data-ts': String(b.ts) }} onClick={() => {
              avviso({
                titolo: 'Ripristinare questo backup?',
                testo: 'I dati di adesso non vanno persi: prima di ripristinare vengono salvati come nuovo backup.',
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
    <div id="bk-cloud"><Cloud /></div>
  </>);
}
