/* LE REVIEW DI PRIMA — tutte in una lista sola, dalla più recente, con dentro
   quello che avevi scritto.

   Non un elenco di date da aprire una per una: le review servono messe in
   fila. «Cosa mi ha bloccato» ripetuto per sei sere di seguito è
   un'informazione che nessuna delle sei singole aveva.

   Le tre specie stanno insieme e si distinguono dal segno, non da un filtro:
   sono poche, e un filtro su poche cose è un comando in più per guardare meno
   roba. */
import { Segno } from '../pezzi/pezzi';
import { LM } from '../dati/dati';

export default function Review() {
  const righe = LM.tutteLeReview();
  return (
    <div className="sc">
      {righe.length ? (
        <div className="lista">
          {righe.map((r, i) => (
            <div className="lista-riga rev-riga" key={r.tipo + r.k + i}>
              <span className={'lista-azione rev-ico rev-' + r.tipo}><Segno nome={r.ico} /></span>
              <span className="lista-corpo">
                <span className="lista-tit">{r.quando}</span>
                {r.campi.map((c) => (
                  <span className="rev-campo" key={c.eti}><b>{c.eti}</b> {c.val}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="vuoto"><b>Non hai ancora scritto nessuna review.</b><br />Le trovi qui appena ne chiudi una.</div>
      )}
      {righe.length ? <p className="lista-nota">Dalla più recente. Messe in fila dicono cose che una sera sola non dice: se «cosa mi ha bloccato» si ripete, quello è il posto da cui partire.</p> : null}
    </div>
  );
}
