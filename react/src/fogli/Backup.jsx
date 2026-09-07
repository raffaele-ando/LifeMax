/* BACKUP E RIPRISTINO — le copie prese prima di ogni sostituzione dei dati.

   LE COPIE NEL CLOUD c'erano da mesi e non si vedevano. Ogni volta che il
   documento remoto sta per essere toccato ne viene messa da parte una copia:
   finché nessuno poteva guardarle era mezza rete di sicurezza, perché quando i
   dati spariscono da un dispositivo e da lì salgono, la copia buona è
   esattamente là e non c'era modo di arrivarci.
   Si caricano dopo, perché passano dalla rete: il pannello si apre subito con
   quelle locali e questa parte si riempie quando arriva.  */
import { useEffect, useState } from 'react';
import { Segno, Tasto } from '../pezzi.jsx';

const A = () => window.LM_APP;

const MOTIVI = {
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

const quando = (ts) => (ts
  ? new Date(ts).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : 'senza data');

/* LE COPIE NEL CLOUD, che arrivano dalla rete e quindi dopo. */
function Cloud() {
  const a = A();
  const c = window.LMCloud;
  const [stato, setStato] = useState('attesa');
  const [righe, setRighe] = useState([]);
  const vivo = c && c.available && c.backups;

  useEffect(() => {
    if (!vivo) return undefined;
    let via = false;
    c.backups().then((arr) => { if (!via) { setRighe(arr); setStato('arrivate'); } });
    return () => { via = true; };
  }, [vivo]);

  if (!vivo) return null;
  const eti = (conta) => (
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
          <Tasto testo="Riprendi" misura="mini" dati={{ 'data-cloudbk': String(b.id) }} onClick={(e) => {
            const btn = e.currentTarget;
            a.avviso({
              titolo: 'Riprendere questa copia?',
              testo: 'Quello che le manca viene aggiunto a quello che hai adesso. Niente viene tolto.',
              azione: 'Riprendi'
            }, () => {
              btn.disabled = true; btn.textContent = 'Sto riprendendo…';
              c.riprendiBackup(b.id).then((fatto) => {
                a.chiudiSheet(); a.render();
                a.toast(fatto ? 'Copia ripresa e unita.' : 'Non sono riuscito a riprenderla.', 0, fatto ? 'cloudCheck' : 'alert');
              });
            });
          }} />
          <Tasto testo="Sostituisci" misura="mini" piu="btn-ghost" dati={{ 'data-cloudsost': String(b.id) }} onClick={(e) => {
            const btn = e.currentTarget;
            a.avviso({
              titolo: 'Mettere questa copia al posto di tutto?',
              testo: 'Quello che c’è adesso viene salvato in un backup su questo dispositivo, e al suo posto va questa copia. Le cose che nella copia non ci sono spariscono: è la sola via per togliere roba che non è tua.',
              azione: 'Sostituisci', pericolo: true
            }, () => {
              btn.disabled = true; btn.textContent = 'Sto sostituendo…';
              c.sostituisciConBackup(b.id).then((fatto) => {
                a.chiudiSheet(); a.applicaTema(); a.render();
                a.toast(fatto ? 'Fatto: adesso ci sono solo i dati di quella copia.' : 'Non sono riuscito a sostituire.',
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
  const a = A();
  const lista = window.LM.listBackups();
  return (<>
    <div className="imp-nota" style={{ marginTop: 0 }}>Ogni voce è una copia salvata prima di una sostituzione dei dati. Ripristinandone una, lo stato attuale viene comunque salvato come nuovo backup.</div>
    <div className="lista-eti"><Segno nome="archivio" dim={11} />Su questo dispositivo{lista.length ? <> <span>{lista.length}</span></> : null}</div>
    {lista.length ? (
      <div className="backup-lista">
        {lista.map((b) => (
          <div className="backup-riga" key={b.ts}>
            <div><b>{quando(b.ts)}</b><small>{b.ricchezza} elementi{MOTIVI[b.motivo] ? ' · ' + MOTIVI[b.motivo] : ''}</small></div>
            <Tasto testo="Ripristina" misura="mini" dati={{ 'data-ts': String(b.ts) }} onClick={() => {
              a.avviso({
                titolo: 'Ripristinare questo backup?',
                testo: 'I dati di adesso non vanno persi: prima di ripristinare vengono salvati come nuovo backup.',
                azione: 'Ripristina'
              }, () => {
                window.LM.restoreBackup(b.ts); a.chiudiSheet(); a.applicaTema(); a.render();
                a.toast('Backup ripristinato.', 0, 'archivio');
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
