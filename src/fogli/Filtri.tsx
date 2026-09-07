/* GUARDA SOLO — la scelta del filtro delle attività.

   Un elenco di voci, una spunta su quella scelta, e toccarne una chiude il
   foglio. È il pannello più piccolo che esista qui dentro. */
import type { CSSProperties } from 'react';
import { Segno } from '../pezzi/pezzi';
import { LM } from '../dati/dati';
import { schermo, areaById, chiudiSheet } from '../app/app';

/* `--c-area` è il colore dell'area: una proprietà personalizzata, che nel
   tipo di `style` non c'è perché davvero non è CSS standard */
type StileArea = CSSProperties & { '--c-area': string };

/* una voce dell'elenco: la spunta (o il posto vuoto dov'è, così le righe
   restano allineate), il nome con la sua icona, e quante ce ne sono */
function Voce({ id, ico, eti, n, scelto, onScegli }: {
  id: string; ico: string; eti: string; n: number; scelto: boolean; onScegli: (id: string) => void;
}) {
  const area = ico === 'area' ? areaById(id) : null;
  return (
    <div className="lista-riga">
      <button className="lista-apri" data-filtro={id} onClick={() => onScegli(id)}>
        <span className="lista-vuoto">{scelto ? <Segno nome="scelto" /> : null}</span>
        <span className="lista-corpo"><span className="lista-tit">
          {ico ? (
            <span className="tit-area" style={area ? { '--c-area': LM.coloreArea(area) } as StileArea : undefined}>
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

export default function Filtri({ dopo }: { dopo?: () => void }) {
  const st = LM.load();
  const totale = st.backlog.length;
  const conData = st.backlog.filter((b) => !b.done && b.scadenza).length;
  const nProg = st.backlog.filter((b) => b.steps && b.steps.length).length;
  const perArea = LM.backlogPerArea().filter((g) => g.items.length);

  const scegli = (id: string) => {
    schermo.att.area = id;
    chiudiSheet();
    if (dopo) dopo();
  };
  const v = (id: string, ico: string, eti: string, n: number) =>
    <Voce key={id} id={id} ico={ico} eti={eti} n={n} scelto={schermo.att.area === id} onScegli={scegli} />;

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
      {/* `etichetta('Per area', 'aree')` di `app.ts`, scritta qui: l'icona e
          poi il testo, senza niente in mezzo */}
      <div className="lista-eti"><Segno nome="aree" dim={11} />Per area</div>
      <div className="lista">
        {perArea.map((g) => v(g.area.id, 'area', g.area.nome, g.items.length))}
      </div>
    </div>
  );
}
