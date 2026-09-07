/* MENU — le pagine che non stanno nella barra in basso, e il tuo account.

   Con le tre porte accese l'elenco delle pagine è vuoto: ogni schermata sta a
   un tocco dalle linguette sotto al titolo della sua porta, e un menu di
   collegamenti sarebbe un secondo modo per arrivare dove sei già. Quello che
   resta è l'account, che non ha nessun altro posto dove stare.

   Le impostazioni NON stanno qui dentro: da quando l'ingranaggio è in alto a
   destra su ogni schermata, un pulsante «Impostazioni» qui sarebbe un secondo
   modo di aprire la stessa porta. */
import { Segno, Disegno } from '../pezzi/pezzi';
import { GOOGLE_G } from '../segni/segni';
import { vociMenu, statoSync, apriDiagnostica, chiudiSheet, toast } from '../app/app';
import type { Vista } from '../app/app';

function Voce({ v }: { v: Vista }) {
  const liv = v.livello || 'quotidiana';
  return (
    <button className={'menu-voce menu-' + liv} data-vai={v.id}
      onClick={() => { chiudiSheet(); window.location.hash = '#/' + v.id; }}>
      <Segno nome={v.icona} dim={liv === 'extra' ? 15 : 18} />
      <span>{v.nome}</span>
      <Segno nome="arrowRight" />
    </button>
  );
}

/* la pastiglia che dice a che punto sta il salvataggio, e ci porta dentro */
function Chip() {
  const y = statoSync();
  return (
    <button type="button" className={'sync-chip sync-chip-largo ' + y.cls} data-diag="1"
      title={y.title || 'Mostra cosa sta succedendo'} onClick={() => apriDiagnostica()}>
      <Segno nome={y.ico} dim={13} /> {y.testo}<Segno nome="arrowRight" dim={13} />
    </button>
  );
}

function Account() {
  /* la nuvola può non esserci: senza SDK l'app funziona lo stesso, solo su
     questo dispositivo, e allora la sezione dice quello */
  const c = window.LM_AUTH;
  if (c && c.user) {
    const chi = c.user;
    return (<>
      <div className="menu-account">
        <Segno nome="cloudCheck" /> Connesso come <b>{chi.name || chi.email}</b>
        <button className="btn btn-mini btn-ghost" id="menu-esci" onClick={() => {
          if (window.LMCloud) void window.LMCloud.signOut();
          chiudiSheet();
          toast('Hai effettuato la disconnessione.', 0, 'logout');
        }}><Segno nome="logout" /> Esci</button>
      </div>
      <Chip />
    </>);
  }
  if (c && c.available) {
    return (<>
      <button className="btn btn-accedi" id="menu-accedi" style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => { if (window.LMCloud && window.LMCloud.available) void window.LMCloud.signIn(); }}>
        <Disegno svg={GOOGLE_G(15)} /> Accedi con Google
      </button>
      <div className="imp-nota">Accedi per ritrovare i tuoi dati su tutti i dispositivi.</div>
    </>);
  }
  return <div className="fondo-locale"><Segno nome="soloQui" dim={13} /> Dati salvati su questo dispositivo</div>;
}

export default function Menu() {
  const { extra, secondarie } = vociMenu();
  const link = extra.length || secondarie.length;
  return (<>
    {link ? (
      <div className="menu-lista">
        {extra.map((v) => <Voce key={v.id} v={v} />)}
        {extra.length ? <div className="nav-sep" /> : null}
        {secondarie.map((v) => <Voce key={v.id} v={v} />)}
      </div>
    ) : null}
    <div className="imp-sezione">
      <div className="imp-eti">Account</div>
      <Account />
    </div>
  </>);
}
