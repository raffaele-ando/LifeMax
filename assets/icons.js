/* ============================================================
   LifeMax — iconografia proprietaria
   Set coerente: griglia 24px, stroke 1.8, terminali arrotondati.
   Le icone sostituiscono le emoji in tutto il "chrome" dell'app;
   il colore è sempre currentColor: l'identità cromatica resta
   al testo/contesto, mai all'icona da sola.
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

    /* aree di vita */
    book: '<path d="M4.5 19.2V5.6A2.6 2.6 0 0 1 7.1 3h12.4v15.4H7.1a2.6 2.6 0 0 0-2.6 2.6 2.6 2.6 0 0 0 2.6 2.6h12.4v-2.6"/><path d="M8.6 7.2h6.8"/>',
    heart: '<path d="M12 20.4 4.3 13a4.9 4.9 0 0 1 6.9-6.9l.8.8.8-.8a4.9 4.9 0 0 1 6.9 6.9z"/><path d="M6.6 12.4h2.6l1.3-2.4 2 4.4 1.4-2h3"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.8c.8-3.2 3.3-4.9 6.2-4.9s5.4 1.7 6.2 4.9"/><circle cx="17.2" cy="9.2" r="2.6"/><path d="M17.8 15.2c2.1.4 3.4 1.8 3.9 4.1"/>',
    wallet: '<path d="M19 7.5V6a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20H19a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2zM3 6.5C3 7.9 4.1 9 5.5 9H21"/><circle cx="16.4" cy="14.4" r="1" fill="currentColor" stroke="none"/>',
    landmark: '<path d="M3 21h18M5.4 21v-10M9.8 21v-10M14.2 21v-10M18.6 21v-10M2.8 10.4 12 3.4l9.2 7z"/>',
    rocket: '<path d="M12.4 14.6 9.4 11.6C10 9 11.5 6.4 13.9 4.3 16.4 2.1 19.9 2.4 20.8 3.2s1.1 4.4-1.1 6.9c-2.1 2.4-4.7 3.9-7.3 4.5z"/><circle cx="15.5" cy="8.5" r="1.5"/><path d="M9.4 11.6c-1.6.3-3 1.2-3.9 2.7M12.4 14.6c-.3 1.6-1.2 3-2.7 3.9M5.2 16.2c-1.5 1.5-1.9 4.6-1.9 4.6s3.1-.4 4.6-1.9"/>',
    briefcase: '<rect x="3" y="7.4" width="18" height="13" rx="2.4"/><path d="M9 7.4V6a2.4 2.4 0 0 1 2.4-2.4h1.2A2.4 2.4 0 0 1 15 6v1.4M3 12.4h18"/>',
    sparkles: '<path d="M11 4.6l1.5 3.9 3.9 1.5-3.9 1.5L11 15.4 9.5 11.5 5.6 10l3.9-1.5z"/><path d="M18.6 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',

    /* azioni e stato */
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M4.5 12.8 9.6 18 19.5 6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrowRight: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    flame: '<path d="M12 21.4c-3.6 0-6.2-2.5-6.2-6 0-2.6 1.6-4.4 3-6 1.2-1.4 2.3-2.7 2.6-4.6 0-.9-.1-1.5-.1-1.5s4.1 2.1 5.6 6.2c.4-.7.6-1.7.6-1.7 1.4 1.6 2.7 3.7 2.7 7.6 0 3.5-4.6 6-8.2 6z"/>',
    bolt: '<path d="M13.2 2.4 4.8 13.6h6l-1.6 8 8.4-11.2h-6z"/>',
    star: '<path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9z"/>',
    smile: '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 14.2a4.6 4.6 0 0 0 7.2 0M9.2 9.4h.01M14.8 9.4h.01"/>',
    play: '<path d="M8.2 5.4v13.2L18.6 12z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.2l3.4 2"/>',
    refresh: '<path d="M20.6 12a8.6 8.6 0 1 1-2.5-6"/><path d="M20.8 3.2v5h-5"/>',
    trash: '<path d="M3.6 6.4h16.8M8.6 6.4V5a1.8 1.8 0 0 1 1.8-1.8h3.2A1.8 1.8 0 0 1 15.4 5v1.4M18.6 6.4l-.9 12.7a2.2 2.2 0 0 1-2.2 2.1H8.5a2.2 2.2 0 0 1-2.2-2.1L5.4 6.4M10 10.6v6M14 10.6v6"/>',
    palette: '<path d="M12 3a9 9 0 1 0 .9 17.95c1.3-.13 1.75-1.3 1.2-2.3-.6-1.2.15-2.65 1.6-2.65H18a3.9 3.9 0 0 0 3.9-3.9C21.9 6.6 17.4 3 12 3z"/><circle cx="7.8" cy="10.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="12" cy="7.4" r="1.05" fill="currentColor" stroke="none"/><circle cx="16.2" cy="10.2" r="1.05" fill="currentColor" stroke="none"/>',
    keyboard: '<rect x="2.6" y="6" width="18.8" height="12" rx="2.4"/><path d="M6.4 10h.01M10.2 10h.01M14 10h.01M17.8 10h.01M6.4 14h11.4"/>',
    send: '<path d="M20.6 3.4 3.4 10.2l7 2.4 2.4 7z"/><path d="M20.6 3.4 10.4 12.6"/>',
    trendUp: '<path d="M3.4 17.4l5.4-5.4 3.6 3.6 8.2-8.2"/><path d="M15.4 7.4h5.2v5.2"/>',
    calendar: '<rect x="3.4" y="4.8" width="17.2" height="16" rx="2.4"/><path d="M8 2.8v4M16 2.8v4M3.4 10h17.2"/>',
    lightbulb: '<path d="M9.2 18.2v-1.4c0-1-.6-1.8-1.3-2.6a6.4 6.4 0 1 1 8.2 0c-.7.8-1.3 1.6-1.3 2.6v1.4z"/><path d="M9.6 21.2h4.8"/>',
    shield: '<path d="M12 2.8s6.4 2.2 8 3.2c0 9.2-4.4 13.6-8 15.2-3.6-1.6-8-6-8-15.2 1.6-1 8-3.2 8-3.2z"/><path d="M8.8 12l2.4 2.4 4-4.8"/>',
    cloud: '<path d="M7 18.5a4.2 4.2 0 0 1-.5-8.37 5.6 5.6 0 0 1 10.86-1.2A3.9 3.9 0 0 1 17.4 18.5z"/>',
    cloudCheck: '<path d="M7 18.5a4.2 4.2 0 0 1-.5-8.37 5.6 5.6 0 0 1 10.86-1.2A3.9 3.9 0 0 1 17.4 18.5z"/><path d="M9.6 13.6l1.8 1.8 3.4-3.6"/>',
    logout: '<path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M16 17l5-5-5-5M21 12H9"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.7-3.4 3.4-5.2 7-5.2s6.3 1.8 7 5.2"/>',
    pencil: '<path d="M4.5 19.5h4L18.6 9.4a2.05 2.05 0 0 0-2.9-2.9L5.6 16.6z"/><path d="M14 8l2 2"/>',
    download: '<path d="M12 3.5v11M7.7 10.2 12 14.5l4.3-4.3"/><path d="M4.8 20h14.4"/>',
    upload: '<path d="M12 15.5v-11M7.7 8.8 12 4.5l4.3 4.3"/><path d="M4.8 20h14.4"/>',
    save: '<path d="M6 20h12a2 2 0 0 0 2-2V8.5L15.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/><path d="M8 4v5h6.5M8 20v-6h8v6"/>',
    lista: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.6 6.5l.9.9 1.6-1.9M4.6 12l.9.9 1.6-1.9M4.6 17.5l.9.9 1.6-1.9"/>',
    dots: '<circle cx="5.2" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18.8" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    aiuto: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.7-2.6 2.1-2.6 3.9"/><path d="M12 17.4h.01"/>',
    chevronGiu: '<path d="M6 9.5l6 6 6-6"/>',
    piu2: '<path d="M12 5v14M5 12h14"/>',
    /* giornata: pasti e sonno */
    utensils: '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17.5 3c-1.6 0-2.5 1.8-2.5 4.5S15.9 12 17.5 12V3zM17.5 12v9"/>',
    coffee: '<path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M17 9.5h1.6a2.4 2.4 0 0 1 0 4.8H17"/><path d="M7.5 3.2c-.4.7-.4 1.3 0 2M11 3.2c-.4.7-.4 1.3 0 2"/>',
    bed: '<path d="M3 6v13M3 12h18a0 0 0 0 1 0 0v7M21 19v-4a3 3 0 0 0-3-3H3M6.5 12v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'
  };

  window.ICO = function (nome, size, cls) {
    var d = PATHS[nome];
    if (!d) return '<span class="ico-pallino"></span>';
    size = size || 18;
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };

  /* Logo Google ufficiale a 4 colori (fill, non stroke): usato solo
     sul pulsante di accesso, come richiesto dalle linee guida del brand. */
  window.GOOGLE_G = function (size) {
    size = size || 16;
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
      '<rect x="2" y="2" width="44" height="44" rx="13" fill="url(#' + id + ')"/>' +
      '<path d="M12 30.5l7-7 5 5L34.5 18" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M27.5 17h7.5v7.5" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  };
})();
