/* PERCHÉ L'APP È FATTA COSÌ — la più semplice di tutte: si legge e basta,
   nessun comando. Serve a rodare il metodo prima delle schermate difficili. */
import type { CSSProperties } from 'react';
import { Segno, Testa } from '../pezzi/pezzi';
import { PRINCIPI } from '../app/app';
import type { Principio } from '../app/app';

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

const CLASSE: Record<Principio['evidenza'], string> = {
  alta: 'evidenza-alta', media: 'evidenza-media', euristica: 'evidenza-euristica'
};
const ETICHETTA: Record<Principio['evidenza'], string> = {
  alta: 'Evidenza alta', media: 'Media', euristica: 'Euristica'
};

/* `--i` è il posto della card nella griglia: lo stile lo usa per far entrare
   le schede una dopo l'altra. In React una proprietà personalizzata non sta
   nel tipo di `style`, e non è un caso limite da aggirare con `any`: è
   davvero fuori dallo standard CSS, quindi la si dichiara qui. */
type StileConIndice = CSSProperties & { '--i': number };

export default function Scienza() {
  return (<>
    <Testa titolo="Perché l’app è fatta così" sottotitolo="Le ricerche dietro ogni funzione, con le fonti." />
    <div className="card">
      <div className="sotto" style={{ margin: 0 }} {...html(
        'Le etichette dicono quanto è solida ogni prova: <span class="evidenza evidenza-alta">evidenza alta</span> significa meta-analisi o studi clinici controllati; <span class="evidenza evidenza-media">media</span> significa studi solidi ma non conclusivi; <span class="evidenza evidenza-euristica">euristica</span> significa pratica clinica ragionevole, non ancora dimostrata. La verifica finale spetta comunque a te, e serve a questo la pagina <b>Scoperte</b>.')} />
    </div>
    <div className="griglia griglia-2 mt">
      {PRINCIPI.map((p, i) => (
        <div className="card scienza-card" style={{ '--i': i } as StileConIndice} key={p.titolo}>
          <div className="riga-flex" style={{ justifyContent: 'space-between', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
            <h2 style={{ margin: 0 }} {...html(p.titolo)} />
            <span className={'evidenza ' + CLASSE[p.evidenza]}>{ETICHETTA[p.evidenza]}</span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--inchiostro-2)' }} {...html(p.claim)} />
          <div className="uso" {...html('<b>Nel prototipo:</b> ' + p.uso)} />
          <div className="fonte"><Segno nome="fonte" /><span {...html(p.fonti)} /></div>
        </div>
      ))}
    </div>
  </>);
}
