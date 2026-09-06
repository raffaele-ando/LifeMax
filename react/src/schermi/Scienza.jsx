/* PERCHÉ L'APP È FATTA COSÌ — la più semplice di tutte: si legge e basta,
   nessun comando. Serve a rodare il metodo prima delle schermate difficili.
   Il markup deve venire identico: prove/gemelle.js lo confronta elemento per
   elemento. */
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;
const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

const CLASSE = { alta: 'evidenza-alta', media: 'evidenza-media' };
const ETICHETTA = { alta: 'Evidenza alta', media: 'Media' };

export default function Scienza() {
  const a = A();
  return (<>
    <Testa titolo="Perché l’app è fatta così" sottotitolo="Le ricerche dietro ogni funzione, con le fonti." />
    <div className="card">
      <div className="sotto" style={{ margin: 0 }} {...html(
        'Le etichette dicono quanto è solida ogni prova: <span class="evidenza evidenza-alta">evidenza alta</span> significa meta-analisi o studi clinici controllati; <span class="evidenza evidenza-media">media</span> significa studi solidi ma non conclusivi; <span class="evidenza evidenza-euristica">euristica</span> significa pratica clinica ragionevole, non ancora dimostrata. La verifica finale spetta comunque a te, e serve a questo la pagina <b>Scoperte</b>.')} />
    </div>
    <div className="griglia griglia-2 mt">
      {a.PRINCIPI.map((p, i) => (
        <div className="card scienza-card" style={{ '--i': i }} key={p.titolo}>
          <div className="riga-flex" style={{ justifyContent: 'space-between', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
            <h2 style={{ margin: 0 }} {...html(p.titolo)} />
            <span className={'evidenza ' + (CLASSE[p.evidenza] || 'evidenza-euristica')}>
              {ETICHETTA[p.evidenza] || 'Euristica'}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--inchiostro-2)' }} {...html(p.claim)} />
          <div className="uso" {...html('<b>Nel prototipo:</b> ' + p.uso)} />
          <div className="fonte"><Segno nome="fonte" /><span {...html(p.fonti)} /></div>
        </div>
      ))}
    </div>
  </>);
}
