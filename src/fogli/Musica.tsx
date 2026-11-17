/* LA MUSICA SOTTO IL LAVORO. Un link di Spotify o di YouTube Music: uno per
   tutto, e uno per area se vuoi (lo studio con una playlist, lo sport con
   un'altra). Si apre nella sua app, che continua a suonare anche col
   telefono bloccato — una pagina web da sola non ci riesce. */
import { useState } from 'react';
import { LM } from '../dati/dati';
import type { Musica as MusicaDati } from '../tipi/stato';
import { areeAttive, apriMusica, toast } from '../app/app';
import { Segno } from '../pezzi/pezzi';

function buono(u: string): boolean { return /^https?:\/\/\S+$/i.test(u.trim()); }

function Campo({ id, eti, val, onSalva }: { id: string; eti: string; val: string; onSalva: (v: string) => void }) {
  return (
    <div className="gr-riga mus-riga">
      <label className="gr-eti" htmlFor={id}>{eti}</label>
      <span className="gr-valori mus-valori">
        <input key={val} id={id} type="url" inputMode="url" className="mus-link" defaultValue={val}
          placeholder="Incolla il link" autoComplete="off"
          onBlur={(e) => {
            const t = e.target.value.trim();
            if (t && !buono(t)) { toast('Non sembra un link: deve cominciare con https://', 0, 'x'); return; }
            if (t !== val) onSalva(t);
          }} />
        {val ? <button className="gr-via" aria-label={'Ascolta: ' + eti} onClick={() => apriMusica(val)}><Segno nome="play" dim={13} /></button> : null}
      </span>
    </div>
  );
}

export default function Musica() {
  const [, ridisegna] = useState(0);
  const m: MusicaDati = LM.load().profilo.musica || {};
  const cambia = (patch: Partial<MusicaDati>) => {
    const st = LM.load();
    st.profilo.musica = Object.assign({}, st.profilo.musica || {}, patch);
    LM.save();
    ridisegna((n) => n + 1);
  };
  const perArea = (id: string, v: string) => {
    const aree = Object.assign({}, m.aree || {});
    if (v) aree[id] = v; else delete aree[id];
    cambia({ aree: aree });
  };
  return (
    <div className="sc">
      <div className="gr">
        <Campo id="mus-pred" eti="Per tutto" val={m.predefinita || ''} onSalva={(v) => cambia({ predefinita: v })} />
        <div className="gr-riga">
          <span className="gr-eti">Aprila quando parte il timer</span>
          <button className={'interr' + (m.conTimer ? ' on' : '')} id="mus-contimer" role="switch"
            aria-checked={m.conTimer ? 'true' : 'false'} aria-label="Aprila quando parte il timer"
            onClick={() => cambia({ conTimer: !m.conTimer })}><i /></button>
        </div>
      </div>
      <div className="gr-titolo">Per area</div>
      <div className="gr">
        {areeAttive().map((a) => (
          <Campo key={a.id} id={'mus-' + a.id} eti={a.nome} val={(m.aree && m.aree[a.id]) || ''} onSalva={(v) => perArea(a.id, v)} />
        ))}
      </div>
      <p className="gr-nota">Senza pubblicità e a schermo spento serve l’abbonamento di Spotify o di YouTube.</p>
    </div>
  );
}
