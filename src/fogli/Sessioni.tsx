/* IL TEMPO COL TIMER, giorno per giorno. Ogni pezzo si corregge: i minuti
   giusti (la pausa che non hai fatto, il timer lasciato andare a vuoto),
   l'area giusta, oppure via. */
import { useState } from 'react';
import { LM } from '../dati/dati';
import type { Giorno } from '../tipi/stato';
import { areeAttive, etichettaGiorno, fmtOre } from '../app/app';
import { Segno } from '../pezzi/pezzi';

function ora(ms: number): string {
  const d = new Date(ms);
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}

export default function Sessioni() {
  const [, ridisegna] = useState(0);
  const oggi = LM.todayKey();
  const giorni: Giorno[] = [];
  for (let i = 0; i < 14; i++) giorni.push(LM.addDays(oggi, -i));
  const conQualcosa = giorni.filter((g) => LM.sessioniDi(g).length > 0);
  if (!conQualcosa.length) {
    return <div className="sc"><div className="vuoto" style={{ padding: '24px 8px' }}>Nessuna sessione.</div></div>;
  }
  return (
    <div className="sc">
      {conQualcosa.map((g) => {
        const lista = LM.sessioniDi(g);
        const tot = lista.reduce((n, x) => n + (x.minuti || 0), 0);
        return (
          <div key={g}>
            <div className="gr-titolo ses-titolo"><span>{etichettaGiorno(g)}</span><span className="gr-muto">{fmtOre(tot)}</span></div>
            <div className="gr">
              {lista.map((x) => (
                <div className="gr-riga ses-riga" key={x.id}>
                  <span className="ses-ora">{ora(x.inizio)}</span>
                  <span className="gr-eti ses-cosa">{x.testo || 'Concentrazione'}</span>
                  <select className="gr-val ses-area" aria-label="Area" value={x.areaId || ''}
                    onChange={(e) => { LM.modificaSessione(x.id, { areaId: e.target.value || null }); ridisegna((n) => n + 1); }}>
                    <option value="">Nessuna</option>
                    {areeAttive().map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                  <input type="number" className="gr-val ses-min" min={0} max={600} inputMode="numeric"
                    key={x.id + ':' + x.minuti} defaultValue={x.minuti} aria-label="Minuti"
                    onBlur={(e) => { const v = +e.target.value; if (!isNaN(v) && v !== x.minuti) { LM.modificaSessione(x.id, { minuti: v }); ridisegna((n) => n + 1); } }} />
                  <button className="gr-via" aria-label="Togli questa sessione"
                    onClick={() => { LM.togliSessione(x.id); ridisegna((n) => n + 1); }}><Segno nome="x" dim={13} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
