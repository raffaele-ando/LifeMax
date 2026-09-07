/* RITUALI — cinque momenti della giornata, a fisarmonica.

   Alla prima apertura è aperto quello dell'ora; dopo vale quello che hai
   deciso tu. Le sezioni aperte restano aperte: aprirne una non chiude le
   altre, perché la mattina si guarda il piano e la sera la review, e a volte
   tutte e due.

   React possiede la struttura e quali sezioni sono aperte; il contenuto di
   ognuna lo disegna `disegnaCorpiRituali()` — sono cinque schermate intere,
   e devono essere le stesse. */
import { Fragment, useEffect, useRef } from 'react';
import { usaLM } from '../usaLM.js';
import { Segno, Testa } from '../pezzi.jsx';

const A = () => window.LM_APP;

function Riga({ r, adesso, aperto, onApri }) {
  const a = A();
  const st = a.statoRituale(r.id);
  return (
    <section className={'rit-blocco' + (aperto ? ' aperto' : '') + (r.id === adesso ? ' ora' : '')} data-rit={r.id}>
      <button className="rit-riga" data-sub={r.id} aria-expanded={aperto}
        aria-controls={'corpo-rit-' + r.id} onClick={(e) => onApri(r.id, e.currentTarget)}>
        <span className="rit-ico"><Segno nome={r.ico} /></span>
        <span className="rit-nome">
          {r.nome}
          {r.id === adesso ? <span className="solo-lettori"> — è il rituale di adesso</span> : null}
        </span>
        <span className={'rit-stato' + (st.fatto ? ' fatto' : '')}>
          <span className="rs-che">{st.fatto ? <><Segno nome="check" dim={13} />{' '}</> : null}{st.testo}</span>
          {st.dett ? <span className="rs-dett">{st.dett}</span> : null}
        </span>
        <span className={'rit-chevron' + (aperto ? ' aperta' : '')}><Segno nome="chevronGiu" /></span>
      </button>
      {aperto ? <div className="rit-corpo" id={'corpo-rit-' + r.id} /> : null}
    </section>
  );
}

export default function Rituali() {
  usaLM();
  const a = A();
  const adesso = a.ritualeDellOra();
  const giro = useRef(0);

  if (!a.ritualiAperti) { const o = {}; o[adesso] = true; a.ritualiAperti = o; }
  /* chi arriva da un collegamento apre quella sezione SENZA chiudere le altre */
  if (a.sottoRituale) { a.ritualiAperti[a.sottoRituale] = true; a.sottoRituale = null; }
  const aperti = a.ritualiAperti;

  /* i corpi si disegnano dopo ogni commit: React ha appena rifatto i
     contenitori delle sezioni aperte, e sono vuoti finché non ci si scrive */
  useEffect(() => { a.disegnaCorpiRituali(); });

  const apri = (id, bottone) => {
    /* la riga resta dove sta: si tiene la sua posizione, così aprire una
       sezione in fondo non fa saltare la pagina sotto il dito */
    const primaY = bottone.getBoundingClientRect().top;
    if (aperti[id]) delete aperti[id]; else aperti[id] = true;
    giro.current++;
    a.render();
    requestAnimationFrame(() => {
      const nuova = document.querySelector('.rit-riga[data-sub="' + id + '"]');
      if (!nuova) return;
      const delta = nuova.getBoundingClientRect().top - primaY;
      if (delta) window.scrollBy(0, delta);
      nuova.focus({ preventScroll: true });
    });
  };

  return (<>
    <Testa titolo="Rituali" giaNellaNav />
    {/* un <Fragment> con la chiave, non un <div>: un contenitore in più —
        anche invisibile al layout — è un elemento in più nell'albero */}
    {a.GRUPPI_RIT.map((g) => (
      <Fragment key={g.eti}>
        <div className="rit-eti">{g.eti}</div>
        <div className="rit-gruppo">
          {g.ids.map((id) => {
            const r = a.RITUALI.filter((x) => x.id === id)[0];
            return <Riga key={id} r={r} adesso={adesso} aperto={!!aperti[id]} onApri={apri} />;
          })}
        </div>
      </Fragment>
    ))}
  </>);
}
