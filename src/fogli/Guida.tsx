/* PRIMI PASSI — cosa fa l'app, in tre passaggi e poi il resto.

   Il testo di ogni voce porta dentro del markup (un <b>, un <kbd>): si mette
   com'è. Riscriverlo pezzo per pezzo in JSX vorrebbe dire due copie dello
   stesso paragrafo, ed è il tipo di doppione che poi diverge senza che
   nessuno se ne accorga. */
import { Segno } from '../pezzi/pezzi';

function Voce({ ico, tit, testo }: { ico: string; tit: string; testo: string }) {
  return (
    <div className="guida-voce">
      <span className="guida-ico"><Segno nome={ico} /></span>
      <div><b>{tit}</b><p dangerouslySetInnerHTML={{ __html: testo }} /></div>
    </div>
  );
}

const VOCI: [string, string, string][] = [
  ['bolt', '1 · Annota', 'Premi <kbd>C</kbd> (o il tasto ＋) e scrivi. La nota finisce in <b>Attività</b>, sezione «Sistemare»: non serve decidere altro adesso.'],
  ['lista', '2 · Decidi cosa farne', 'In <b>Attività</b>, per ogni nota scegli <b>Oggi</b>, <b>Da fare</b> (più avanti, senza data) o <b>Scarta</b>. Quelle in «Da fare» restano in elenco, con il filtro per area, finché non le porti in Oggi.'],
  ['target', '3 · Fai una cosa per volta', 'La schermata <b>Oggi</b> mostra una sola azione. Al mattino scegli le tre azioni del giorno in <b>Rituali</b>, la sera chiudi con la review.'],
  ['giornata', 'La giornata', 'Mostra come sono divise le tue ore: sonno, pasti, abitudini e azioni con un orario. Dove vederla si sceglie dal menù sulla timeline.'],
  ['polso', 'Check-in', 'Energia, concentrazione, umore, su una scala da 1 a 5. Conta l’andamento nei giorni, non il numero di oggi.'],
  ['funziona', 'Scoperte', 'Una riga per ogni cosa che hai capito su di te, in due mucchi: <b>Funziona</b> e <b>Non funziona</b>. Accanto a ognuna sta scritta l’<b>evidenza</b> — notato una volta, lo noto ogni volta, misurato — così una riga si può scrivere anche senza esserne sicuro.'],
  ['flask', 'Esperimenti', 'La seconda sezione di <b>Scoperte</b>, per quando di una cosa vuoi essere sicuro: introduci un cambiamento (per esempio sport al mattino) e l’app confronta i tuoi dati prima e dopo.'],
  ['dashboard', 'Panoramica e Diario', 'In <b>Panoramica</b> vedi progressi, costanza e andamento; nel <b>Diario</b> lo storico giorno per giorno.'],
  ['dati', 'I dati', 'Backup automatici, esportazione e importazione in .json, sincronizzazione sull’account Google fra dispositivi.']
];

export default function Guida() {
  return (<>
    <div className="imp-nota" style={{ marginTop: 0 }}>
      Tre passaggi: <b>annoti</b> quello che ti viene in mente, <b>decidi</b> cosa farne, <b>fai</b> una cosa per volta.
    </div>
    <div className="guida">
      {VOCI.map(([ico, tit, testo]) => <Voce key={tit} ico={ico} tit={tit} testo={testo} />)}
    </div>
  </>);
}
