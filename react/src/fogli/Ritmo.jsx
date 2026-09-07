/* SONNO E PASTI — il ritmo di base, quello che disegna lo sfondo della
   giornata. Un singolo giorno si registra a parte, dalla pagina «Giornata».

   Il pannello ha due metà che sembrano lontane e non lo sono: sopra a che ora
   dormi e mangi, sotto quando l'app ti CHIEDE quelle due cose. Stanno insieme
   perché le domande sono esattamente su questa pagina — e non fra i
   promemoria, perché non sono notifiche: sono il pannello che si apre da solo
   dentro l'app.  */
import { useState } from 'react';
import { Segno } from '../pezzi.jsx';

const A = () => window.LM_APP;

function minuti(x) { const q = String(x).split(':'); return (+q[0]) * 60 + (+q[1]); }
function durSonno(aletto, sveglia) {
  let d = minuti(sveglia) - minuti(aletto);
  if (d <= 0) d += 1440;
  return d;
}

/* la stessa riga dei promemoria: interruttore, nome, ora. Spenta, la domanda
   non arriva più e il posto dove rispondere resta comunque — il «Registro di
   oggi» dei Rituali. */
function RigaChiedi({ quale, nome, spiega, v, onCambia }) {
  const acceso = !!v.on;
  const ora = (campo, eti, val) => (
    <input type="time" className="prom-ora" data-chora={quale} data-chcampo={campo}
      defaultValue={val} aria-label={nome + ', ' + eti} disabled={!acceso}
      onChange={(e) => { if (e.target.value) onCambia(quale, campo, e.target.value); }} />
  );
  return (
    <div className={'prom-riga' + (acceso ? '' : ' spenta')}>
      <button className="prom-int" data-chint={quale} role="switch" aria-checked={acceso ? 'true' : 'false'}
        aria-label={nome + (acceso ? ', acceso' : ', spento')}
        onClick={() => onCambia(quale, 'on', !acceso)}>
        <Segno nome={acceso ? 'check' : 'x'} dim={13} />
      </button>
      <div className="prom-testo"><b>{nome}</b><span>{spiega}</span></div>
      <span className="chiedi-ore">
        {ora('da', 'non prima delle', v.da)}
        {v.a != null ? <>
          <span className="chiedi-tratto" aria-hidden="true">→</span>
          {ora('a', 'non dopo le', v.a)}
        </> : null}
      </span>
    </div>
  );
}

/* «Pasti (nome · ora · durata)» erano le intestazioni di una tabella scritte
   nel titolo, sopra tre campi che dicono già cosa sono. */
function Pasto({ p, i, onCambia, onTogli }) {
  const a = A();
  return (
    <div className="ritmo-pasto" data-pi={i}>
      <input type="text" className="ritmo-nome" value={p.nome} aria-label="Nome del pasto"
        onChange={(e) => onCambia(i, { nome: e.target.value })} />
      <input type="time" className="ritmo-ora" value={p.ora || ''} aria-label="Orario"
        onChange={(e) => onCambia(i, { ora: e.target.value })} />
      <select className="ritmo-dur tl-dur" aria-label="Durata" value={p.durata == null ? '' : String(p.durata)}
        onChange={(e) => onCambia(i, { durata: e.target.value })}>
        {a.DURATE.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.t}</option>)}
      </select>
      <button className="icona-btn" data-pdel={i} title="Rimuovi" aria-label="Rimuovi"
        onClick={() => onTogli(i)}><Segno nome="trash" dim={13} /></button>
    </div>
  );
}

export default function Ritmo() {
  const a = A();
  const r = window.LM.load().profilo.ritmo || window.LM.RITMO_DEFAULT;
  const [sonno, setSonno] = useState(r.sonno);
  const [sveglia, setSveglia] = useState(r.sveglia);
  const [pasti, setPasti] = useState(() => (r.pasti || []).map((p) => ({ ...p })));
  const [q, setQ] = useState(() => window.LM.chiediQuando());

  const cambiaPasto = (i, patch) => setPasti((v) => v.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const togliPasto = (i) => setPasti((v) => v.filter((p, j) => j !== i));

  const cambiaChiedi = (quale, campo, valore) => {
    const patch = {}; patch[quale] = {}; patch[quale][campo] = campo === 'on' ? valore : (valore || null);
    window.LM.impostaChiedi(patch);
    setQ(window.LM.chiediQuando());
  };

  /* SI SALVA QUELLO CHE C'È NEI CAMPI ADESSO, non quello che dice lo stato.
     Sono la stessa cosa quasi sempre; non lo sono se qualcuno cambia un campo
     e preme «Salva» prima che il disegno sia stato rifatto — un dito veloce, o
     una prova che clicca. Il codice di prima leggeva i campi, e leggere i
     campi è anche l'unica risposta che non può essere in ritardo. */
  const salva = () => {
    const dentro = (q) => { const e = document.querySelector(q); return e ? e.value : ''; };
    const fuori = [];
    document.querySelectorAll('#ritmo-pasti .ritmo-pasto').forEach((riga, i) => {
      const ora2 = riga.querySelector('.ritmo-ora').value;
      if (!ora2) return;
      const n = riga.querySelector('.ritmo-nome').value.trim() || 'Pasto';
      const d = riga.querySelector('.ritmo-dur').value;
      fuori.push({ id: 'p' + i, nome: n, ora: ora2, durata: d ? +d : 30 });
    });
    window.LM.impostaRitmo({
      sveglia: dentro('#ritmo-sveglia') || '07:30',
      sonno: dentro('#ritmo-sonno') || '23:30',
      pasti: fuori
    });
    a.chiudiSheet(); a.render();
    a.toast('Ritmo di base aggiornato.', 0, 'check');
  };

  return (<>
    <div className="imp-nota" style={{ marginTop: 0 }}>
      È il ritmo di base, quello che disegna lo sfondo della giornata. Un singolo giorno si registra a parte, dalla pagina <i>Giornata</i>.
    </div>
    <div className="ritmo-riga2">
      <label className="campo" htmlFor="ritmo-sonno">A letto</label>
      <input type="time" id="ritmo-sonno" value={sonno} onChange={(e) => setSonno(e.target.value)} />
      <label className="campo" htmlFor="ritmo-sveglia">Sveglia</label>
      <input type="time" id="ritmo-sveglia" value={sveglia} onChange={(e) => setSveglia(e.target.value)} />
    </div>
    <div className="sp-dorm" style={{ margin: '2px 0 4px' }}>
      <Segno nome="durata" dim={13} /> dormi <b id="ritmo-dorm">{a.fmtOre(durSonno(sonno || '23:30', sveglia || '07:30'))}</b>
    </div>
    <div className="imp-sezione">
      <div className="imp-eti">Pasti</div>
      <div id="ritmo-pasti">
        {pasti.map((p, i) => <Pasto key={i} p={p} i={i} onCambia={cambiaPasto} onTogli={togliPasto} />)}
      </div>
      <button className="btn btn-mini mt-s" id="ritmo-add"
        onClick={() => setPasti((v) => v.concat([{ nome: 'Pasto', ora: '', durata: 30 }]))}>
        <Segno nome="plus" dim={13} /> Aggiungi un pasto
      </button>
    </div>
    <div className="imp-sezione">
      <div className="imp-eti">Quando chiedere</div>
      <RigaChiedi quale="notte" nome="Il sonno di stanotte"
        spiega="La mattina, se sono passate almeno tre ore dall’ultima volta." v={q.notte} onCambia={cambiaChiedi} />
      <RigaChiedi quale="giorno" nome="Pasti e cose fatte"
        spiega="A fine giornata, una volta sola." v={q.giorno} onCambia={cambiaChiedi} />
      <p className="lista-nota">Spente, le due domande non arrivano più da sole. Il posto dove rispondere resta: è il <b>Registro di oggi</b>, nei Rituali.</p>
    </div>
    <div className="riga-flex mt">
      <button className="btn btn-tonale btn-grande" id="ritmo-salva" onClick={salva}>
        <Segno nome="save" /> Salva
      </button>
    </div>
  </>);
}
