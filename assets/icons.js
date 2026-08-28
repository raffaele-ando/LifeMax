/* ============================================================
   LifeMax — l'iconografia
   Griglia 24px, terminali arrotondati, colore sempre currentColor:
   l'identità cromatica resta al testo e al contesto, mai all'icona da sola.
   Lo spessore non è fisso — lo calcola `tratto()` più sotto.

   UN SEGNO, UNA COSA
   Ogni segno dice una cosa, e quella cosa la dice lui e nessun altro. Non è
   una regola di stile: un segno che vuol dire due cose costringe a leggere
   l'etichetta accanto per capire quale delle due, e a quel punto il segno non
   serve più a niente — tanto vale togliersi l'icona. Chi legge male le
   etichette (occhio che salta, schermo piccolo, fretta) resta senza appoggio.

   Il significato di ognuno sta scritto in `SENSO`, in fondo al file, e non è
   un commento: `prove/segni.js` lo legge, controlla che nessun segno sia
   senza significato e che nessun significato sia scritto due volte, e conta
   con quante etichette diverse ogni segno compare nell'app. Un segno preciso
   che si ritrova accanto a cinque frasi diverse ha ricominciato a voler dire
   più cose: la prova si ferma lì.

   È già capitato, ed è così che si presenta:
     · `check` diceva insieme «fatto», «scelto fra tanti» e «salvato»;
     · `star` era la priorità del giorno e anche «tenuta in cima»;
     · `clock` era un'ora del giorno, una durata e «aspetta, non ci sono
       abbastanza dati»;
     · `refresh` era «si ripete», «riprova» e il tema «Auto»;
     · la pagina Giornata portava l'orologio, che dentro quella stessa pagina
       compare venti volte con l'altro senso;
     · la pagina Rituali portava il sole, che nella pagina è il mattino.

   DUE FAMIGLIE CHE NON SI MESCOLANO
   · I SEGNI DI SISTEMA dicono un'azione o uno stato, e la dicono in tutta
     l'app allo stesso modo. Nessuno di questi può essere scelto come icona
     di un'area.
   · I SEGNI DELLE AREE nominano un pezzo di vita e servono solo a quello.
     Se comparissero altrove, l'icona scelta per «Salute» si ritroverebbe due
     righe sotto a dire un'altra cosa.

   DA DOVE VENGONO
   Una parte è disegnata qui. Il resto viene da Lucide (ISC, vedi
   segni/LICENZA-lucide.txt): stessa griglia, stesso tratto, stessa idea di
   disegno, e accanto a ognuno c'è scritto da quale segno del pacco arriva.
   Il pacco intero — 1776 segni — sta in segni/, e nel browser non arriva
   mai: si cerca con `node segni/cerca.mjs <parola>` e si porta dentro con
   `node segni/prendi.mjs <nome-lucide> <nomeNostro> "che cosa vuol dire"`.
   Così quando serve un significato nuovo la risposta è prenderne uno nuovo,
   che costa mezzo minuto, invece di riusare quello che sembra più vicino.
   ============================================================ */
'use strict';

(function () {

  var PATHS = {
    /* navigazione */
    target: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3.6"/><circle cx="12" cy="12" r="0.4" fill="currentColor" stroke="none"/>',
    dashboard: '<rect x="3" y="3" width="7.2" height="9.4" rx="2"/><rect x="13.8" y="3" width="7.2" height="5.4" rx="2"/><rect x="13.8" y="11.6" width="7.2" height="9.4" rx="2"/><rect x="3" y="15.6" width="7.2" height="5.4" rx="2"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
    moon: '<path d="M20.2 14.2A8.3 8.3 0 1 1 9.8 3.8a6.8 6.8 0 0 0 10.4 10.4z"/>',
    inbox: '<path d="M21 12.6V17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4.4M3 12.6 5.6 5A2 2 0 0 1 7.5 3.6h9A2 2 0 0 1 18.4 5L21 12.6M3 12.6h5l1.6 2.8h4.8l1.6-2.8h5"/>',
    flask: '<path d="M9.4 3h5.2M10.2 3v5.6l-5.5 9.3A1.8 1.8 0 0 0 6.3 20.6h11.4a1.8 1.8 0 0 0 1.6-2.7l-5.5-9.3V3"/><path d="M7.4 14.4h9.2"/>',
    atom: '<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9.2" ry="3.9"/><ellipse cx="12" cy="12" rx="9.2" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.2" ry="3.9" transform="rotate(120 12 12)"/>',

    /* ---------- i segni delle aree ----------
       Questi nominano un pezzo di vita, e servono SOLO come icona di un'area.
       Fuori da qui non vogliono dire niente, e per il motivo opposto nessuno
       dei segni di sistema (la stella della priorità, la fiamma della serie,
       il fulmine della cattura, la provetta degli esperimenti) può finire
       nella scelta di un'area: l'icona di un'area comparirebbe accanto alla
       stessa figura che, due righe sopra, vuol dire un'altra cosa. */
    book: '<path d="M4.5 19.2V5.6A2.6 2.6 0 0 1 7.1 3h12.4v15.4H7.1a2.6 2.6 0 0 0-2.6 2.6 2.6 2.6 0 0 0 2.6 2.6h12.4v-2.6"/><path d="M8.6 7.2h6.8"/>',
    heart: '<path d="M12 20.4 4.3 13a4.9 4.9 0 0 1 6.9-6.9l.8.8.8-.8a4.9 4.9 0 0 1 6.9 6.9z"/><path d="M6.6 12.4h2.6l1.3-2.4 2 4.4 1.4-2h3"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.8c.8-3.2 3.3-4.9 6.2-4.9s5.4 1.7 6.2 4.9"/><circle cx="17.2" cy="9.2" r="2.6"/><path d="M17.8 15.2c2.1.4 3.4 1.8 3.9 4.1"/>',
    wallet: '<path d="M19 7.5V6a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20H19a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2zM3 6.5C3 7.9 4.1 9 5.5 9H21"/><circle cx="16.4" cy="14.4" r="1" fill="currentColor" stroke="none"/>',
    landmark: '<path d="M3 21h18M5.4 21v-10M9.8 21v-10M14.2 21v-10M18.6 21v-10M2.8 10.4 12 3.4l9.2 7z"/>',
    rocket: '<path d="M12.4 14.6 9.4 11.6C10 9 11.5 6.4 13.9 4.3 16.4 2.1 19.9 2.4 20.8 3.2s1.1 4.4-1.1 6.9c-2.1 2.4-4.7 3.9-7.3 4.5z"/><circle cx="15.5" cy="8.5" r="1.5"/><path d="M9.4 11.6c-1.6.3-3 1.2-3.9 2.7M12.4 14.6c-.3 1.6-1.2 3-2.7 3.9M5.2 16.2c-1.5 1.5-1.9 4.6-1.9 4.6s3.1-.4 4.6-1.9"/>',
    briefcase: '<rect x="3" y="7.4" width="18" height="13" rx="2.4"/><path d="M9 7.4V6a2.4 2.4 0 0 1 2.4-2.4h1.2A2.4 2.4 0 0 1 15 6v1.4M3 12.4h18"/>',
    casa: '<path d="M3.4 10.6 12 3.6l8.6 7v8.8a1.8 1.8 0 0 1-1.8 1.8H5.2a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M9.4 21.2v-6h5.2v6"/>',
    musica: '<circle cx="6.4" cy="17.6" r="2.8"/><circle cx="17.6" cy="15.4" r="2.8"/><path d="M9.2 17.6V6.2l11.2-2.2v11.4"/>',
    globo: '<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2"/><path d="M12 3.2c2.4 2.5 3.6 5.4 3.6 8.8s-1.2 6.3-3.6 8.8c-2.4-2.5-3.6-5.4-3.6-8.8S9.6 5.7 12 3.2z"/>',
    pesi: '<path d="M4.2 9.4v5.2M7 7.6v8.8M17 7.6v8.8M19.8 9.4v5.2M7 12h10"/>',
    sparkles: '<path d="M11 4.6l1.5 3.9 3.9 1.5-3.9 1.5L11 15.4 9.5 11.5 5.6 10l3.9-1.5z"/><path d="M18.6 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',

    /* azioni e stato */
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M4.5 12.8 9.6 18 19.5 6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrowRight: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    flame: '<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>',  /* lucide:flame — la serie di giorni: quella disegnata a mano si leggeva come una goccia */
    bolt: '<path d="M13.2 2.4 4.8 13.6h6l-1.6 8 8.4-11.2h-6z"/>',
    star: '<path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9z"/>',
    smile: '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 14.2a4.6 4.6 0 0 0 7.2 0M9.2 9.4h.01M14.8 9.4h.01"/>',
    play: '<path d="M8.2 5.4v13.2L18.6 12z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.2l3.4 2"/>',
    refresh: '<path d="M20.6 12a8.6 8.6 0 1 1-2.5-6"/><path d="M20.8 3.2v5h-5"/>',
    /* annulla: la freccia che torna indietro. Sta separata da `refresh`
       perché quella nell'app vuol dire «si ripete» (abitudini, «diventa
       un'abitudine», tema automatico) e la usava anche l'annulla: lo stesso
       segno per due cose diverse, e da quando il diario ha un annulla su
       ogni riga era il segno più visto di tutti. */
    annulla: '<path d="M3.4 8.6h9.6a5.7 5.7 0 0 1 0 11.4H7.2"/><path d="M7.7 4.3 3.4 8.6l4.3 4.3"/>',
    /* impostazioni: l'ingranaggio. Prima qui c'era il sole, che vuol dire
       «tema chiaro» e non «impostazioni»: sei denti, valli ad arco, stessa
       griglia e stesso spessore del resto del set. */
    ingranaggio: '<path d="M9.89 2.84L14.11 2.84L14.47 5.56A6.9 6.9 0 0 1 16.34 6.64L18.87 5.59L20.99 9.25L18.82 10.92A6.9 6.9 0 0 1 18.82 13.08L20.99 14.75L18.87 18.41L16.34 17.36A6.9 6.9 0 0 1 14.47 18.44L14.11 21.16L9.89 21.16L9.53 18.44A6.9 6.9 0 0 1 7.66 17.36L5.13 18.41L3.01 14.75L5.18 13.08A6.9 6.9 0 0 1 5.18 10.92L3.01 9.25L5.13 5.59L7.66 6.64A6.9 6.9 0 0 1 9.53 5.56Z"/><circle cx="12" cy="12" r="3.3"/>',
    trash: '<path d="M3.6 6.4h16.8M8.6 6.4V5a1.8 1.8 0 0 1 1.8-1.8h3.2A1.8 1.8 0 0 1 15.4 5v1.4M18.6 6.4l-.9 12.7a2.2 2.2 0 0 1-2.2 2.1H8.5a2.2 2.2 0 0 1-2.2-2.1L5.4 6.4M10 10.6v6M14 10.6v6"/>',
    palette: '<path d="M12 3a9 9 0 1 0 .9 17.95c1.3-.13 1.75-1.3 1.2-2.3-.6-1.2.15-2.65 1.6-2.65H18a3.9 3.9 0 0 0 3.9-3.9C21.9 6.6 17.4 3 12 3z"/><circle cx="7.8" cy="10.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="12" cy="7.4" r="1.05" fill="currentColor" stroke="none"/><circle cx="16.2" cy="10.2" r="1.05" fill="currentColor" stroke="none"/>',
    trendUp: '<path d="M3.4 17.4l5.4-5.4 3.6 3.6 8.2-8.2"/><path d="M15.4 7.4h5.2v5.2"/>',
    calendar: '<rect x="3.4" y="4.8" width="17.2" height="16" rx="2.4"/><path d="M8 2.8v4M16 2.8v4M3.4 10h17.2"/>',
    lightbulb: '<path d="M9.2 18.2v-1.4c0-1-.6-1.8-1.3-2.6a6.4 6.4 0 1 1 8.2 0c-.7.8-1.3 1.6-1.3 2.6v1.4z"/><path d="M9.6 21.2h4.8"/>',
    shield: '<path d="M12 2.8s6.4 2.2 8 3.2c0 9.2-4.4 13.6-8 15.2-3.6-1.6-8-6-8-15.2 1.6-1 8-3.2 8-3.2z"/><path d="M8.8 12l2.4 2.4 4-4.8"/>',
    cloud: '<path d="M7 18.5a4.2 4.2 0 0 1-.5-8.37 5.6 5.6 0 0 1 10.86-1.2A3.9 3.9 0 0 1 17.4 18.5z"/>',
    cloudCheck: '<path d="M7 18.5a4.2 4.2 0 0 1-.5-8.37 5.6 5.6 0 0 1 10.86-1.2A3.9 3.9 0 0 1 17.4 18.5z"/><path d="M9.6 13.6l1.8 1.8 3.4-3.6"/>',
    logout: '<path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M16 17l5-5-5-5M21 12H9"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.7-3.4 3.4-5.2 7-5.2s6.3 1.8 7 5.2"/>',
    download: '<path d="M12 3.5v11M7.7 10.2 12 14.5l4.3-4.3"/><path d="M4.8 20h14.4"/>',
    upload: '<path d="M12 15.5v-11M7.7 8.8 12 4.5l4.3 4.3"/><path d="M4.8 20h14.4"/>',
    save: '<path d="M6 20h12a2 2 0 0 0 2-2V8.5L15.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/><path d="M8 4v5h6.5M8 20v-6h8v6"/>',
    /* imbuto: «guarda solo…». Tre linee che si restringono e una goccia
       sotto — la stessa idea del filtro di Promemoria, disegnata col tratto
       delle altre icone. */
    /* lente: la ricerca aveva l'icona del bersaglio, che vuol dire un'altra cosa */
    lente: '<circle cx="11" cy="11" r="6.5"/><path d="M15.8 15.8L21 21"/>',
    imbuto: '<path d="M4 5h16l-6 7v5.5l-4 2.5V12L4 5z"/>',
    lista: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.6 6.5l.9.9 1.6-1.9M4.6 12l.9.9 1.6-1.9M4.6 17.5l.9.9 1.6-1.9"/>',
    /* presa: la maniglia per trascinare. Prima era «dots», tre puntini in
       fila, che in ogni interfaccia del mondo vuol dire «altre opzioni»: chi
       la vedeva cercava un menu e trovava un trascinamento. */
    presa: '<circle cx="9" cy="6.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="6.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="17.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="17.5" r="1.4" fill="currentColor" stroke="none"/>',
    /* polso: il check-in. Prima usava il fulmine — lo stesso segno della
       cattura rapida E della scala «quanta energia hai» dentro la scheda
       stessa: nello stesso riquadro compariva due volte per due cose. */
    polso: '<path d="M2.6 12.4h4.2l2.2-5.6 3.4 10.4 2.4-4.8h6.6"/>',
    /* mirino: la concentrazione. Prima era il bersaglio, che in quest'app è
       «Oggi» e «l'azione più importante» — e stava nella riga sotto, nella
       barra, mentre lo si usava per «quanto riesci a concentrarti». */
    mirino: '<circle cx="12" cy="12" r="3"/><path d="M4 8.4V6a2 2 0 0 1 2-2h2.4M15.6 4H18a2 2 0 0 1 2 2v2.4M20 15.6V18a2 2 0 0 1-2 2h-2.4M8.4 20H6a2 2 0 0 1-2-2v-2.4"/>',
    /* batteria: l'energia del check-in. Prima era il fulmine, che in questa
       app vuol dire «cattura rapida» ed era già preso. */
    batteria: '<rect x="2.4" y="7.4" width="16.2" height="9.2" rx="2.4"/><path d="M21.2 10.6v2.8"/><path d="M5.8 10.4v3.2M9.2 10.4v3.2M12.6 10.4v3.2"/>',
    /* ancora: il gancio dell'intenzione, «alle 9:00, appena mi siedo». Non è
       né un orario né un luogo: è la cosa a cui agganci l'azione. */
    ancora: '<circle cx="12" cy="4.9" r="2.3"/><path d="M12 7.2v13.4"/><path d="M7.6 10.6h8.8"/><path d="M4 14.4a8.2 8.2 0 0 0 8 6.4 8.2 8.2 0 0 0 8-6.4"/>',
    /* salta: scavalca oggi e riprende domani. Prima era la luna, che nell'app
       vuol dire «la sera». */
    salta: '<path d="M5.4 6l8 6-8 6z"/><path d="M18.2 5.4v13.2"/>',
    /* fonte: lo studio citato in «Perché funziona». Prima era il libro, che è
       anche l'icona dell'area «Studio»: la stessa figura per «la tua area» e
       per «la ricerca da cui viene questa scelta». */
    fonte: '<path d="M13.6 3.2H7A2 2 0 0 0 5 5.2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.6z"/><path d="M13.4 3.3v5.3H19"/><path d="M8.6 13h6.8M8.6 16.6h4.4"/>',
    /* quaderno: il diario. Prima usava il libro, che è anche l'icona
       dell'area «Studio»: la stessa figura per due cose diverse. */
    quaderno: '<rect x="5" y="3" width="14.4" height="18" rx="2.4"/><path d="M5 8H2.8M5 12H2.8M5 16H2.8"/><path d="M9.2 8.6h6M9.2 12.4h6M9.2 16.2h3.4"/>',
    /* aree: le aree di vita, la torta divisa. Prima «Gestisci le aree» usava
       le stelline, che vogliono dire «extra» e «dati di esempio». */
    aree: '<circle cx="12" cy="12" r="8.8"/><path d="M12 3.2v17.6M3.2 12h17.6"/>',
    aiuto: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.7-2.6 2.1-2.6 3.9"/><path d="M12 17.4h.01"/>',
    chevronGiu: '<path d="M6 9.5l6 6 6-6"/>',
    copy: '<rect x="9" y="9" width="11.5" height="11.5" rx="2.4"/><path d="M15.6 5.8V5.4A2.4 2.4 0 0 0 13.2 3H6a2.4 2.4 0 0 0-2.4 2.4v7.2A2.4 2.4 0 0 0 6 15h.4"/>',
    share: '<circle cx="18" cy="5.6" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.4" r="2.6"/><path d="M8.3 10.8 15.7 6.8M8.3 13.2l7.4 4"/>',
    terminale: '<rect x="3" y="4" width="18" height="16" rx="2.6"/><path d="M7.2 9.6 9.8 12l-2.6 2.4M12.4 15h4.2"/>',
    /* giornata: pasti e sonno */
    utensils: '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17.5 3c-1.6 0-2.5 1.8-2.5 4.5S15.9 12 17.5 12V3zM17.5 12v9"/>',
    coffee: '<path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M17 9.5h1.6a2.4 2.4 0 0 1 0 4.8H17"/><path d="M7.5 3.2c-.4.7-.4 1.3 0 2M11 3.2c-.4.7-.4 1.3 0 2"/>',
    bed: '<path d="M3 6v13M3 12h18a0 0 0 0 1 0 0v7M21 19v-4a3 3 0 0 0-3-3H3M6.5 12v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    /* ---------- presi dal pacco ---------- */
    nonFunziona: '<path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/><path d="M17 14V2"/>',  /* lucide:thumbs-down — una cosa che non ti funziona */
    funziona: '<path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/><path d="M7 10v12"/>',  /* lucide:thumbs-up — una cosa che ti funziona (verdetto tuo su di te) */
    chiavi: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',  /* lucide:key — le due chiavi dei promemoria */
    notaFissa: '<path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M15 3v5a1 1 0 0 0 1 1h5"/>',  /* lucide:sticky-note — la nota che resta fra le notifiche */
    altreOpzioni: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',  /* lucide:ellipsis-vertical — le altre cose che puoi fare su questa riga */
    schermoPiccolo: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',  /* lucide:smartphone — la larghezza di un telefono */
    schermoGrande: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',  /* lucide:monitor — la larghezza di un monitor */
    soloQui: '<path d="M10 16h.01"/><path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M21.946 12.013H2.054"/><path d="M6 16h.01"/>',  /* lucide:hard-drive — i dati stanno solo su questo dispositivo */
    avviso: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',  /* lucide:triangle-alert — qualcosa non è andato */
    riepilogo: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/>',  /* lucide:layout-list — il riepilogo, tutto in breve */
    unAnno: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',  /* lucide:chart-column — l’arco di un anno */
    unMese: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',  /* lucide:grid-3x3 — l’arco di un mese: la griglia 2×2 si confondeva con la plancia */
    unaSettimana: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',  /* lucide:columns-3 — l’arco di una settimana */
    unGiorno: '<rect width="12" height="20" x="6" y="2" rx="2"/>',  /* lucide:rectangle-vertical — l’arco di un giorno */
    automatico: '<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>',  /* lucide:contrast — segue il sistema */
    dati: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',  /* lucide:database — i tuoi dati, tutti insieme */
    rituali: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',  /* lucide:route — i momenti fissi della giornata */
    giornata: '<path d="M10 6h8"/><path d="M12 16h6"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 11h7"/>',  /* lucide:chart-gantt — la giornata ora per ora */
    solito: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',  /* lucide:gauge — il tuo livello di solito */
    confronto: '<path d="M12 3v18"/><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"/><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"/><path d="M7 21h10"/>',  /* lucide:scale — prima e dopo messi a confronto */
    rimanda: '<path d="M12 6v6l2 1"/><path d="M13.5 21.885A10 10 0 1 1 22 12"/><path d="M14 18h8"/><path d="m18 22 4-4-4-4"/>',  /* lucide:clock-arrow-right — sposta a più tardi, o a un altro giorno */
    campana: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',  /* lucide:bell — i promemoria */
    campanaOff: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"/><path d="m2 2 20 20"/><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"/>',  /* lucide:bell-off — spegni i promemoria */
    durata: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',  /* lucide:timer — quanto dura */
    ritmo: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',  /* lucide:alarm-clock — il ritmo di base: sonno e pasti */
    attesa: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',  /* lucide:hourglass — non ci sono ancora abbastanza dati */
    tempospeso: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',  /* lucide:chart-pie — come è andato il tempo */
    archivio: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',  /* lucide:archive — i backup */
    altro: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',  /* lucide:ellipsis — il menu delle altre pagine */
    riprova: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',  /* lucide:rotate-cw — riprova adesso */
    pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',  /* lucide:pin — tenuta in cima */
    concluso: '<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>',  /* lucide:flag — un esperimento chiuso */
    scelto: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',  /* lucide:circle-check — questo è quello scelto, fra tanti */
    fineperiodo: '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="m14 13-4 4"/><path d="m10 13 4 4"/>',  /* lucide:calendar-x — il periodo finisce qui */
    scadenza: '<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>',  /* lucide:calendar-clock — una data con una scadenza */
  };


  /* ---------- CHE COSA VUOL DIRE OGNUNO ----------
     Una riga per segno, e la riga è unica: se due segni finissero per dire la
     stessa cosa, uno dei due è di troppo. `prove/segni.js` lo verifica.

     `generico` sono le poche figure che per natura compaiono accanto a molte
     frasi diverse restando una cosa sola: la spunta sta accanto a ogni cosa
     spuntabile dell'app, il cestino accanto a ogni cosa che si butta. Per
     tutti gli altri la prova conta le etichette e si ferma alla quinta. */
  var SENSO = {
    /* le pagine */
    target: 'Oggi, e portare una cosa in Oggi',
    giornata: 'la giornata ora per ora',
    lista: '«Da fare», e rimettere una cosa lì',
    inbox: 'le note prese al volo, ancora da sistemare',
    rituali: 'i momenti fissi della giornata',
    dashboard: 'l’andamento, tutto insieme',
    quaderno: 'il diario',
    flask: 'gli esperimenti',
    atom: 'perché funziona',
    palette: 'il laboratorio del design',
    ingranaggio: 'le impostazioni, di tutto o di una cosa sola',
    aree: 'le aree di vita',
    aiuto: 'come si usa',
    terminale: 'cosa sta succedendo dentro l’app',
    altro: 'il menu delle pagine che non stanno nella barra',
    altreOpzioni: 'le altre cose che puoi fare su questa riga',
    notaFissa: 'la nota che resta fra le notifiche',
    fonte: 'lo studio da cui viene',

    /* IL VERDETTO SU DI TE, che non è una misura: due segni, uno per verso.
       Il segno della spunta vuol già dire «fatto» e la croce «chiudi»: usarli
       anche qui avrebbe voluto dire due cose con la stessa figura. */
    funziona: 'una cosa che ti funziona',
    nonFunziona: 'una cosa che non ti funziona',

    /* il tempo */
    sun: 'il mattino, e il tema chiaro',
    moon: 'la sera, e il tema scuro',
    automatico: 'segue il sistema',
    clock: 'un’ora del giorno',
    durata: 'quanto dura',
    calendar: 'una data precisa',
    unGiorno: 'l’arco di un giorno',
    unaSettimana: 'l’arco di una settimana',
    unMese: 'l’arco di un mese',
    unAnno: 'l’arco di un anno',
    riepilogo: 'il riepilogo, tutto in breve',
    schermoGrande: 'la larghezza di un monitor',
    schermoPiccolo: 'la larghezza di un telefono',
    scadenza: 'una data entro cui',
    fineperiodo: 'il periodo finisce qui',
    rimanda: 'spostare a più tardi',
    salta: 'scavalcare oggi',
    ritmo: 'il ritmo di base: sonno e pasti',
    bed: 'l’ora di dormire',
    coffee: 'la colazione',
    utensils: 'gli altri pasti',
    ancora: 'il gancio dell’intenzione: quando e dove',
    play: 'far partire il timer',
    pause: 'fermare il timer',
    attesa: 'non ci sono ancora abbastanza dati',
    tempospeso: 'come è andato il tempo',

    /* le misure */
    polso: 'il check-in',
    batteria: 'l’energia',
    mirino: 'la concentrazione',
    smile: 'l’umore',
    trendUp: 'l’andamento nel tempo',
    solito: 'il tuo livello di solito',
    confronto: 'prima e dopo messi a confronto',
    flame: 'la serie di giorni di fila',
    concluso: 'un esperimento chiuso',

    /* le azioni */
    plus: 'creare',
    check: 'fatto',
    scelto: 'questo è quello scelto, fra tanti',
    x: 'chiudere, togliere',
    trash: 'eliminare',
    save: 'salvare',
    annulla: 'tornare indietro di un passo',
    riprova: 'riprovare adesso',
    refresh: 'una cosa che si ripete: un’abitudine',
    arrowRight: 'vai, apri',
    chevronGiu: 'c’è dell’altro in quella direzione',
    presa: 'trascinare',
    lente: 'cercare',
    imbuto: 'filtrare',
    bolt: 'prendere una nota al volo',
    star: 'la priorità del giorno',
    pin: 'tenuta in cima',
    sparkles: 'i dati di esempio',

    /* i dati e l’account */
    dati: 'i tuoi dati, tutti insieme',
    download: 'esportare',
    upload: 'importare',
    archivio: 'i backup',
    copy: 'copiare',
    share: 'condividere',
    cloud: 'il cloud',
    soloQui: 'i dati stanno solo su questo dispositivo',
    avviso: 'qualcosa non è andato',
    cloudCheck: 'i dati sono legati al tuo account',
    logout: 'uscire',

    /* i promemoria */
    campana: 'i promemoria',
    campanaOff: 'spegnere i promemoria',
    chiavi: 'le due chiavi dei promemoria',

    /* i segni delle aree: nominano un pezzo di vita, e solo quello */
    book: 'area: studio',
    heart: 'area: salute',
    users: 'area: relazioni',
    wallet: 'area: soldi',
    landmark: 'area: casa e burocrazia',
    rocket: 'area: progetti',
    briefcase: 'area: lavoro',
    lightbulb: 'area: idee ed esplorazione',
    casa: 'area: la casa',
    musica: 'area: musica',
    globo: 'area: viaggi e mondo',
    pesi: 'area: allenamento',
    user: 'area: te stesso',
    shield: 'area: sicurezza e difese'
  };

  /* le figure che stanno accanto a molte frasi restando una cosa sola */
  var GENERICI = ['check', 'plus', 'x', 'trash', 'arrowRight', 'chevronGiu', 'save'];

  /* ---------- la scala ----------
     Le icone avevano quattordici misure diverse (da 9 a 28), e nello stesso
     posto ne convivevano tre: un pulsante con la sua da 14 accanto a uno con
     la sua da 18. Sono cinque gradini, uno per ruolo, e non ce n'è un sesto:
     una misura fuori scala viene tirata al gradino più vicino, così non se ne
     reintroduce una per distrazione.

       11  micro    glifo appiccicato a un testo minuscolo (la stellina della
                    priorità, la scadenza dentro una cella di calendario)
       13  piccola  dentro la riga secondaria di un elenco
       15  riga     righe di elenco e pulsanti: il caso normale
       18  azione   l'azione principale, i titoli
       26  grande   stati vuoti e il pulsante tondo

     Lo spessore invece è il contrario: era fisso a 1.8 su una griglia da 24,
     quindi la stessa icona veniva disegnata a 0.9px da 12 e a 1.35px da 18 —
     le piccole sbiadivano e le grandi ingrassavano. Qui lo spessore si ricava
     dalla misura perché il tratto ARRIVI sempre a 1.25px, che è la stessa
     densità del testo accanto. Sopra i 26 il tratto cresce piano, come fanno
     i caratteri quando diventano titoli. */
  var SCALA = [11, 13, 15, 18, 26];
  function gradino(n) {
    n = +n || 15;
    var vicino = SCALA[0];
    for (var i = 1; i < SCALA.length; i++) {
      /* a pari distanza si sale: fra 14 e i gradini 13 e 15 vince 15, perché
         una misura tirata verso il basso sparisce, tirata in su no */
      if (Math.abs(SCALA[i] - n) <= Math.abs(vicino - n)) vicino = SCALA[i];
    }
    /* oltre la scala (loghi, illustrazioni) si passa la misura così com'è */
    return n > 30 ? n : vicino;
  }
  function tratto(size) {
    var sw = 30 / size;
    return Math.round(Math.min(2.5, Math.max(1.15, sw)) * 100) / 100;
  }

  window.ICO = function (nome, size, cls) {
    var d = PATHS[nome];
    if (!d) return '<span class="ico-pallino"></span>';
    size = gradino(size);
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + tratto(size) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };
  window.ICO.SCALA = SCALA;
  window.ICO.SENSO = SENSO;
  window.ICO.GENERICI = GENERICI;
  window.ICO.NOMI = Object.keys(PATHS);

  /* Logo Google ufficiale a 4 colori (fill, non stroke): usato solo
     sul pulsante di accesso, come richiesto dalle linee guida del brand. */
  window.GOOGLE_G = function (size) {
    /* anche il marchio Google passa dalla scala: se resta fuori si siede a
       mezzo pixel di distanza dal testo che gli sta accanto */
    size = gradino(size || 15);
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48" aria-hidden="true" style="flex:none;vertical-align:-3px">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
  };

  /* Logomark: tessera con gradiente brand + picco ascendente.
     Riusato in sidebar, onboarding e favicon. */
  window.LOGO = function (size) {
    size = size || 30;
    var id = 'lg' + Math.random().toString(36).slice(2, 7);
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" stop-color="var(--brand-a)"/><stop offset=".55" stop-color="var(--brand-b)"/><stop offset="1" stop-color="var(--brand-c)"/>' +
      '</linearGradient></defs>' +
      /* Non un `rect` con `rx`: quello è un rettangolo con quattro archi di
               CERCHIO. Questo è il tracciato dell'angolo CONTINUO di Apple — tre
               Bézier per angolo, costanti in segni/apple.mjs — e siccome è un
               tracciato è la forma vera su qualunque browser, anche dove
               `corner-shape` non c'è. Il raggio è lato / 3.057: il più grande che
               ci sta, cioè il caso in cui i due angoli si toccano a metà del lato.
               Generato con: node segni/icone.mjs */
      '<path transform="translate(2 2)" d="M 22 0 L 22 0 C 28.335 0 31.502 0 34.912 1.078 C 38.634 2.433 41.567 5.366 42.922 9.088 C 44 12.498 44 15.665 44 22 L 44 22 C 44 28.335 44 31.502 42.922 34.912 C 41.567 38.634 38.634 41.567 34.912 42.922 C 31.502 44 28.335 44 22 44 L 22 44 C 15.665 44 12.498 44 9.088 42.922 C 5.366 41.567 2.433 38.634 1.078 34.912 C 0 31.502 0 28.335 0 22 L 0 22 C 0 15.665 0 12.498 1.078 9.088 C 2.433 5.366 5.366 2.433 9.088 1.078 C 12.498 0 15.665 0 22 0 Z" fill="url(#' + id + ')"/>' +
      '<path d="M12 30.5l7-7 5 5L34.5 18" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M27.5 17h7.5v7.5" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  };
})();
