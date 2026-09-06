/* ============================================================
   I PEZZI — le forme dell'interfaccia, scritte una volta sola.

   PERCHÉ ESISTE, contato invece che intuito. In app.js c'erano
   CINQUECENTOSESSANTASEI punti in cui una forma che esiste già veniva
   riscritta da capo, a mano, come stringa. Le prime:

       86  un tasto            35  una scheda        31  una riga di elenco
       31  un elenco           30  un campo          22  una nota sotto
       39  etichetta + valore  19  una nota          18  una statistica
       15  una pastiglia       14  un segmento        9  uno stato vuoto

   Riscrivere una forma a mano non è più lento: è più FRAGILE. La differenza
   fra due righe di elenco scritte in due punti diversi non si vede finché
   qualcuno non cambia il CSS, e allora se ne accorge in una schermata sola.
   È così che sono nati quasi tutti i difetti trovati dall'audit — tredici
   pesi tipografici, quattro tasti pieni insieme: nessuno aveva sbagliato,
   semplicemente ogni punto decideva da sé.

   COME È SCRITTO, e perché in questo modo.

   Ogni pezzo è una funzione PURA che prende un oggetto e restituisce una
   stringa. Niente stato, niente DOM, niente eventi: gli eventi restano dove
   sono sempre stati, agganciati dopo per `id` o per `data-`.

   La forma della firma — `pz.tasto({ testo, ico, tipo, id })` — non è casuale:
   è la stessa che avrà il componente React quando ci arriveremo. Un giorno
   `pz.tasto` diventa `<Tasto testo=… ico=… tipo=… />` e il lavoro fatto qui
   non si butta. Per questo i nomi delle proprietà descrivono il RUOLO e mai
   l'aspetto: `tipo: 'pieno'` e non `tipo: 'blu'`.

   LE REGOLE DI DESIGN STANNO QUI DENTRO, non nelle teste.
   `DESIGN.md` dice «uno pieno per schermata». Adesso è una riga di codice:
   `tipo` accetta 'pieno', 'tonale', 'quieto', 'chiude', 'pericolo', e chi
   scrive deve scegliere quale ruolo ha quel tasto invece di copiare le classi
   dell'ultimo che ha visto.

   prove/pezzi.js si arrabbia se una forma che sta qui viene riscritta a mano
   da qualche altra parte.
   ============================================================ */
(function () {
  'use strict';

  /* Il testo che arriva da fuori non entra mai crudo in una stringa di HTML.
     È la stessa `esc` di app.js: sta anche qui perché questo file deve poter
     stare in piedi da solo. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  /* attributi facoltativi: se il valore non c'è, l'attributo non si scrive.
     Senza questo, mezzo file si riempie di `(x ? ' id="' + x + '"' : '')`. */
  function att(nome, val) {
    return (val === undefined || val === null || val === false || val === '') ? ''
      : ' ' + nome + '="' + esc(val) + '"';
  }
  function classi() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (a) out.push(a);
    }
    return out.join(' ');
  }
  /* l'icona la disegna icons.js; qui si chiede e basta, e se non c'è non
     succede niente */
  function segno(nome, dim) {
    return (nome && typeof window.ICO === 'function') ? window.ICO(nome, dim || 15) : '';
  }

  /* ---------------------------------------------------------------- TASTO
     `tipo` è il RUOLO, non il colore:
       pieno     l'azione della schermata. Uno solo, e DESIGN.md dice perché.
       tonale    salva un blocco dentro a una schermata più lunga
       quieto    il contorno normale: si può fare, non è la cosa principale
       chiude    verde: la conferma che chiude qualcosa
       pericolo  rosso: l'unica azione che distrugge
     `misura`: 'normale' | 'grande' | 'mini'                                */
  var RUOLO = {
    pieno: 'btn-primario', tonale: 'btn-tonale', quieto: '',
    chiude: 'btn-ok', pericolo: 'btn-pericolo'
  };
  var MISURA = { normale: '', grande: 'btn-grande', mini: 'btn-mini' };

  function tasto(o) {
    o = o || {};
    var dentro = segno(o.ico, o.icoDim) + (o.testo ? (o.ico ? ' ' : '') + esc(o.testo) : '') +
      (o.sotto ? '<small>' + esc(o.sotto) + '</small>' : '');
    var cl = classi('btn', RUOLO[o.tipo] !== undefined ? RUOLO[o.tipo] : RUOLO.quieto,
      MISURA[o.misura] || '', o.piu);
    if (o.via) {
      return '<a class="' + cl + '"' + att('href', o.via) + att('id', o.id) + att('aria-label', o.etichetta) +
        '>' + dentro + '</a>';
    }
    return '<button class="' + cl + '"' + att('id', o.id) + att('type', o.invia ? 'submit' : 'button') +
      att('disabled', o.spento ? 'disabled' : null) + att('aria-label', o.etichetta) +
      (o.dati || '') + '>' + dentro + '</button>';
  }

  /* --------------------------------------------------------------- SCHEDA
     Sta SULLA pagina, non ci galleggia sopra: filo, non ombra. Il perché in
     DESIGN.md.                                                            */
  function scheda(o) {
    o = o || {};
    return '<div class="' + classi('card', o.piu) + '"' + att('id', o.id) + (o.dati || '') + '>' +
      (o.titolo ? '<h2 class="card-tit">' + segno(o.ico) + (o.ico ? ' ' : '') + esc(o.titolo) + '</h2>' : '') +
      (o.sotto ? '<div class="sotto">' + esc(o.sotto) + '</div>' : '') +
      (o.dentro || '') + '</div>';
  }

  /* --------------------------------------------------------------- ELENCO */
  function elenco(o) {
    o = o || {};
    var righe = (o.righe || []).join('');
    return '<div class="' + classi('lista', o.piu) + '"' + att('id', o.id) + '>' + righe + '</div>';
  }

  /* RIGA DI ELENCO. Tre mestieri diversi, e la differenza si vede:
       'porta'   ti porta altrove          → ha la freccetta
       'fa'      fa una cosa adesso        → non ce l'ha, perché non si va via
       'ferma'   non fa niente, si legge   → non è un bottone                */
  function riga(o) {
    o = o || {};
    var corpo = o.titolo
      ? '<span class="lista-corpo"><span class="lista-tit">' + esc(o.titolo) + '</span>' +
        (o.sotto ? '<span class="lista-sub">' + esc(o.sotto) + '</span>' : '') + '</span>'
      : '<span class="sc-eti">' + segno(o.ico) + (o.ico ? ' ' : '') + esc(o.eti || '') + '</span>';
    var dentro = (o.titolo && o.ico ? '<span class="lista-azione">' + segno(o.ico) + '</span>' : '') +
      corpo +
      (o.valore ? '<span class="sc-val">' + esc(o.valore) + '</span>' : '') +
      (o.coda || '') +
      (o.mestiere === 'porta' ? '<span class="lista-chev">' + segno('chevronGiu') + '</span>' : '');
    /* `sc-riga` è la riga più fitta che si usa dentro ai pannelli, ed è
       sempre e solo quella in forma «etichetta + valore»: si mette da sé
       invece di doversela ricordare a ogni chiamata. */
    var stretta = o.eti !== undefined ? 'sc-riga' : '';
    var cl = classi('lista-riga', stretta, o.mestiere !== 'ferma' ? 'sc-tocca' : '', o.piu);
    if (o.mestiere === 'ferma') {
      return '<div class="' + classi('lista-riga', stretta, o.piu) + '"' + att('id', o.id) + '>' + dentro + '</div>';
    }
    return '<button class="' + cl + '"' + att('id', o.id) + ' type="button"' + (o.dati || '') + '>' +
      dentro + '</button>';
  }

  /* ---------------------------------------------------------------- CAMPO */
  function campo(o) {
    o = o || {};
    var id = o.id || ('campo-' + Math.random().toString(36).slice(2, 8));
    var comune = att('id', id) + att('name', o.nome || id) + att('placeholder', o.segnaposto) +
      att('value', o.valore) + att('inputmode', o.tastiera) + att('autocomplete', o.completa || 'off') +
      (o.spento ? ' disabled' : '') + (o.dati || '');
    var controllo = o.righe
      ? '<textarea' + comune.replace(att('value', o.valore), '') + att('rows', o.righe) + '>' + esc(o.valore) + '</textarea>'
      : '<input' + att('type', o.genere || 'text') + comune + '>';
    return '<label class="' + classi('campo', o.piu) + '"' + att('for', id) + '>' + esc(o.eti) + '</label>' +
      controllo + (o.nota ? '<p class="lista-nota">' + esc(o.nota) + '</p>' : '');
  }

  /* ------------------------------------------------------------ PASTIGLIE
     Una scelta fra poche cose, tutte visibili insieme.                     */
  function pastiglie(o) {
    o = o || {};
    var chiave = o.chiave || 'val';
    var dentro = (o.voci || []).map(function (v) {
      return '<button class="' + classi('q-chip', v.val === o.scelta ? 'attivo' : '', o.piuVoce) +
        '" type="button" data-' + chiave + '="' + esc(v.val) + '">' +
        segno(v.ico) + (v.ico ? ' ' : '') + esc(v.eti) + '</button>';
    }).join('');
    return '<div class="' + classi('q-chips', o.piu) + '"' + att('id', o.id) + '>' + dentro + '</div>';
  }

  /* -------------------------------------------------------------- SEGMENTI
     Fa una cosa E dice quale delle sue scelte è quella in vigore. La seconda
     metà si dimenticava: prove/clic.js la pretende.                        */
  function segmenti(o) {
    o = o || {};
    /* `chiave` come nelle pastiglie: chi aggancia il clic sceglie il nome
       dell'attributo da cui leggere la scelta (`data-eff`, `data-react`…) */
    var chiave = 'data-' + (o.chiave || 'val');
    var dentro = (o.voci || []).map(function (v) {
      return '<button class="' + (v.val === o.scelta ? 'attivo' : '') + '" type="button"' +
        att(chiave, v.val) + '>' +
        (v.ico ? '<span class="seg-ico">' + segno(v.ico, 13) + '</span>' : '') + esc(v.eti) + '</button>';
    }).join('');
    return '<span class="' + classi('segmenti', o.piu) + '"' + att('id', o.id) +
      ' role="group"' + att('aria-label', o.etichetta) + '>' + dentro + '</span>';
  }

  /* ----------------------------------------------------------- STATISTICA */
  function statistica(o) {
    o = o || {};
    return '<div class="' + classi('stat', o.piu) + '">' +
      '<span class="stat-val">' + segno(o.ico) + (o.ico ? ' ' : '') + esc(o.valore) + '</span>' +
      '<span class="stat-eti">' + esc(o.eti) + '</span></div>';
  }

  /* ----------------------------------------------------------- NIENTE QUI
     Uno stato vuoto dice due cose: che non c'è niente, e cosa farci. La
     seconda mancava in metà dei posti.                                     */
  function niente(o) {
    o = o || {};
    return '<div class="' + classi('vuoto', o.piu) + '">' +
      (o.titolo ? '<b>' + esc(o.titolo) + '</b>' : '') +
      (o.dice ? (o.titolo ? '<br>' : '') + esc(o.dice) : '') +
      (o.azione || '') + '</div>';
  }

  /* -------------------------------------------------------------- LA NOTA */
  var TONO = { normale: '', attenzione: 'nota-attenzione', pericolo: 'nota-pericolo' };
  function nota(o) {
    if (typeof o === 'string') o = { dice: o };
    o = o || {};
    return '<p class="' + classi('lista-nota', TONO[o.tono] || '', o.piu) + '">' +
      (o.html || esc(o.dice)) + '</p>';
  }

  /* ================================================================
     I MATTONI — le forme più piccole, quelle che dentro ai blocchi si
     ripetevano sotto sette nomi diversi. L'elenco di cosa assorbe ciascuno
     sta in COMPONENTI.md.
     ================================================================ */

  /* un'icona accanto a del testo: seg-ico, diario-ico, sm-porta-ico,
     rev-ico, fs-ico, lista-azione erano sei nomi per questo */
  function icona(o) {
    if (typeof o === 'string') o = { nome: o };
    o = o || {};
    return '<span class="' + classi('pz-segno', o.piu) + '">' + segno(o.nome, o.dim) + '</span>';
  }

  /* il nome di una cosa dentro a una riga: otto nomi diventano questo */
  function etichetta(o) {
    if (typeof o === 'string') o = { testo: o };
    o = o || {};
    var dentro = segno(o.ico) + (o.ico ? ' ' : '') + (o.html || esc(o.testo));
    if (o.per) return '<label class="' + classi('sc-eti', o.piu) + '"' + att('for', o.per) + '>' + dentro + '</label>';
    return '<span class="' + classi('sc-eti', o.piu) + '">' + dentro + '</span>';
  }

  /* quanto vale adesso quella cosa: sc-val, lista-val, stat-val, som-pc */
  function valore(o) {
    if (typeof o === 'string') o = { testo: o };
    o = o || {};
    return '<span class="' + classi('sc-val', o.forte ? 'sc-val-forte' : '', o.piu) + '">' +
      (o.html || esc(o.testo)) + '</span>';
  }

  /* il titolo di una riga di elenco: lista-tit, sm-titolo, som-nome, bil-nome */
  function titolo(o) {
    if (typeof o === 'string') o = { testo: o };
    o = o || {};
    return '<span class="' + classi('lista-tit', o.fatta ? 'fatta' : '', o.piu) + '">' +
      esc(o.testo) + '</span>';
  }

  /* due o tre cose in fila. `riga-flex` e `exp-testa` dichiaravano proprietà
     identiche al 100%: erano lo stesso pezzo scritto due volte. */
  var SPAZIO = { fra: '', inizio: 'rf-inizio', fine: 'rf-fine' };
  function fila(o) {
    o = o || {};
    return '<div class="' + classi('riga-flex', SPAZIO[o.spaziatura] || '', o.sopra, o.piu) + '"' +
      att('id', o.id) + '>' + (o.dentro || '') + '</div>';
  }

  /* quanto sei arrivato: fs-barra, bil-barra, ab-prog-barra */
  function barra(o) {
    o = o || {};
    var q = Math.max(0, Math.min(1, Number(o.quota) || 0));
    return '<span class="' + classi('fs-barra', o.alta ? 'fs-barra-alta' : '', o.piu) + '"' +
      ' role="progressbar" aria-valuenow="' + Math.round(q * 100) + '" aria-valuemin="0" aria-valuemax="100"' +
      att('aria-label', o.etichetta) + '>' +
      '<i style="width:' + (q * 100).toFixed(1) + '%' +
      (o.colore ? ';background:' + o.colore : '') + '"></i></span>';
  }

  window.PZ = {
    tasto: tasto, scheda: scheda, elenco: elenco, riga: riga, campo: campo,
    pastiglie: pastiglie, segmenti: segmenti, statistica: statistica,
    niente: niente, nota: nota,
    icona: icona, etichetta: etichetta, valore: valore, titolo: titolo,
    fila: fila, barra: barra,
    /* utili anche fuori: chi compone a mano un caso che non è un pezzo */
    esc: esc, att: att, classi: classi
  };
})();
