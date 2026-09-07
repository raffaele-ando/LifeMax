/* GUARDA SOLO — la scelta del filtro delle attività.

   È il primo pannello che passa a React, e per una ragione: è il più piccolo
   che esista qui dentro. Un elenco di voci, una spunta su quella scelta, e
   toccarne una chiude il foglio. Se la strada regge per questo, regge.

   Come per le schermate, la regola è una sola: deve venire IDENTICO a quello
   di prima. `prove/fogli.js` apre il pannello col codice di prima, si prende
   l'albero, lo riapre con React e confronta elemento per elemento. */
import { Segno } from '../pezzi.jsx';

const A = () => window.LM_APP;

/* una voce dell'elenco: la spunta (o il posto vuoto dov'è, così le righe
   restano allineate), il nome con la sua icona, e quante ce ne sono */
function Voce({ id, ico, eti, n, scelto, onScegli }) {
  const a = A();
  const area = ico === 'area' ? a.areaById(id) : null;
  return (
    <div className="lista-riga">
      <button className="lista-apri" data-filtro={id} onClick={() => onScegli(id)}>
        <span className="lista-vuoto">{scelto ? <Segno nome="scelto" /> : null}</span>
        <span className="lista-corpo"><span className="lista-tit">
          {ico ? (
            <span className="tit-area" style={area ? { '--c-area': window.LM.coloreArea(area) } : undefined}>
              <Segno nome={area ? area.icona : ico} dim={13} />
            </span>
          ) : null}
          {eti}
        </span></span>
        <span className="lista-val">{n}</span>
      </button>
    </div>
  );
}

export default function Filtri({ dopo }) {
  const a = A();
  const st = window.LM.load();
  const totale = st.backlog.length;
  const conData = st.backlog.filter((b) => !b.done && b.scadenza).length;
  const nProg = st.backlog.filter((b) => b.steps && b.steps.length).length;
  const perArea = window.LM.backlogPerArea().filter((g) => g.items.length);

  const scegli = (id) => {
    a.attArea = id;
    a.chiudiSheet();
    if (dopo) dopo();
  };
  const v = (id, ico, eti, n) =>
    <Voce key={id} id={id} ico={ico} eti={eti} n={n} scelto={a.attArea === id} onScegli={scegli} />;

  return (
    <div className="sc">
      <div className="lista-eti">Tutto</div>
      <div className="lista">{v('tutte', 'lista', 'Tutte le attività', totale)}</div>
      {(conData || nProg) ? <>
        <div className="lista-eti">Per come sono fatte</div>
        <div className="lista">
          {conData ? v('data', 'calendar', 'Con una data', conData) : null}
          {nProg ? v('progetti', 'rocket', 'Divise in passi', nProg) : null}
        </div>
      </> : null}
      {/* `etichetta('Per area', 'aree')` di app.js, scritta qui: l'icona e
          poi il testo, senza niente in mezzo */}
      <div className="lista-eti"><Segno nome="aree" dim={11} />Per area</div>
      <div className="lista">
        {perArea.map((g) => v(g.area.id, 'area', g.area.nome, g.items.length))}
      </div>
    </div>
  );
}
