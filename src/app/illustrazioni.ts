/* LE ILLUSTRAZIONI DEI VUOTI — quattro disegni, e nient'altro.

   Compaiono dove non c'è ancora niente: la coda vuota, la prima volta che
   apri gli esperimenti, la giornata senza niente dentro. Una schermata vuota
   che dice solo «Nessuna attività» sembra l'app che non funziona; un disegno
   dice che quel posto esiste e sta aspettando.

   Sono qui fuori perché sono la cosa più facile da spostare che ci fosse
   dentro `app.ts`: prendono zero argomenti, non guardano i dati, non sanno
   che schermata è aperta, e restituiscono una stringa. Misurato: da queste
   cinquanta righe non usciva un solo nome verso il resto del file.

   Restano stringhe e non pezzi React per la stessa ragione dei segni: le
   chiede anche chi costruisce HTML a mano, e un disegno solo in due lingue
   sarebbero due disegni. `illoInbox` la importa anche «Attività», da
   `app.ts`, che la ri-esporta. */


export function illoSole(): string {
  return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
    '<defs><linearGradient id="ilA" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset=".6" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
    '<g stroke="url(#ilA)" stroke-width="3" stroke-linecap="round" opacity=".7">' +
    '<path d="M100 18v-8M62 32l-6-6M138 32l6-6M42 62h-9M158 62h9"/></g>' +
    '<circle cx="100" cy="74" r="32" fill="url(#ilA)"/>' +
    '<path d="M0 92 Q 52 74 104 92 T 200 90 V120 H0 Z" fill="var(--superficie-3)"/>' +
    '<path d="M0 104 Q 60 90 120 104 T 200 102 V120 H0 Z" fill="var(--superficie-2)"/>' +
    '</svg>';
}

export function illoInbox(): string {
  return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
    '<defs><linearGradient id="ilB" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
    '<rect x="48" y="26" width="104" height="60" rx="12" fill="var(--superficie-3)" transform="rotate(-7 100 56)"/>' +
    '<rect x="48" y="30" width="104" height="60" rx="12" fill="var(--superficie-2)" transform="rotate(4 100 60)"/>' +
    '<rect x="46" y="38" width="108" height="62" rx="12" fill="var(--superficie-1)" stroke="var(--bordo-forte)"/>' +
    '<circle cx="100" cy="69" r="17" fill="url(#ilB)"/>' +
    '<path d="M92.5 69.5l5 5 10.5-11" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
}

export function illoFlask(): string {
  return '<svg class="illo" viewBox="0 0 200 120" aria-hidden="true">' +
    '<defs><linearGradient id="ilC" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
    '<path d="M88 22h24M92 22v26l-24 42a8 8 0 0 0 7 12h50a8 8 0 0 0 7-12l-24-42V22" fill="none" stroke="var(--inchiostro-muto)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M80.5 74h39l12.5 22a4 4 0 0 1-3.5 6H71.5a4 4 0 0 1-3.5-6z" fill="url(#ilC)" opacity=".9"/>' +
    '<circle cx="92" cy="88" r="3.4" fill="#fff" opacity=".85"><animate attributeName="cy" values="92;80;92" dur="3.2s" repeatCount="indefinite"/></circle>' +
    '<circle cx="108" cy="92" r="2.6" fill="#fff" opacity=".7"><animate attributeName="cy" values="96;84;96" dur="2.6s" repeatCount="indefinite"/></circle>' +
    '</svg>';
}

export function illoOrbita(): string {
  return '<svg class="ob-illo" viewBox="0 0 300 300" aria-hidden="true">' +
    '<defs><linearGradient id="ilD" x1="0" y1="1" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--brand-a)"/><stop offset=".55" style="stop-color:var(--brand-b)"/><stop offset="1" style="stop-color:var(--brand-c)"/></linearGradient></defs>' +
    '<circle cx="150" cy="150" r="74" fill="none" stroke="var(--bordo-forte)" stroke-dasharray="3 8"/>' +
    '<circle cx="150" cy="150" r="120" fill="none" stroke="var(--bordo)" stroke-dasharray="3 8"/>' +
    '<g class="orbita"><circle cx="150" cy="76" r="11" fill="url(#ilD)"/></g>' +
    '<g class="orbita orbita-2"><circle cx="270" cy="150" r="7" fill="var(--brand-c)"/><circle cx="150" cy="270" r="5" fill="var(--brand-a)" opacity=".8"/></g>' +
    '<rect x="126" y="126" width="48" height="48" rx="14" fill="url(#ilD)"/>' +
    '<path d="M137 158l7.5-7.5 5.5 5.5 12-12.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M153.5 143h8.5v8.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
}
