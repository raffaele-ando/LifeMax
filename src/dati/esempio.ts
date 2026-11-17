/* I TESTI DEI DATI DI ESEMPIO, così come li scrive `seedDemo` (il generatore
   è a seme fisso: sono sempre questi). Servono a riconoscere i dati di esempio
   finiti nel cloud prima che l'app sapesse contrassegnarli: da allora ogni
   cosa d'esempio porta il suo segno (`stato.esempio`) e non esce mai dal
   dispositivo. Rigenerati da uno script: se cambi la demo, rigenerali. */
export const TESTI_ESEMPIO = {
  "azioni": [
    "Agenda per il direttivo",
    "Allenamento forza — gambe",
    "Capitolo di Analisi II + 10 esercizi",
    "Chiamare i nonni",
    "Chiudere il report per il cliente",
    "Confrontare piani telefonici",
    "Corsa 5 km zona 2",
    "Draft sponsorship per l’evento",
    "Fix onboarding: primo utente in <60s",
    "In letto entro le 23:30",
    "Inbox a zero + piani per domani",
    "Intervistare 2 utenti target",
    "Leggere 20 pagine del saggio nuovo",
    "Onboarding dei due nuovi membri",
    "Organizzare cena con il gruppo",
    "Prep pasti per 3 giorni",
    "Preparare demo di venerdì",
    "Preparare domande per il ricevimento",
    "Provare la lezione di arrampicata",
    "Registrare spese settimana",
    "Ripasso attivo con flashcard (30 min)",
    "Rispondere a Marco con proposta concreta",
    "Scrivere il changelog e postarlo",
    "Spedire la landing v2",
    "Spostare 10% su conto risparmio"
  ],
  "backlog": [
    "Confrontare iPhone 15 Pro e GH5",
    "Leggere 1 ora al giorno un libro personale",
    "Leggere il libro di esercizi di Analisi 1",
    "Mettere su Vinted i pantaloni",
    "Recuperare i corsi di ingegneria gestionale",
    "Scrivere i primi 30 script per Agorà",
    "Scrivere i primi 30 script per Atlas",
    "Studiare le risposte per l’OFA di inglese",
    "Trovare lavoro per agosto"
  ],
  "abitudini": [
    "Camminata / movimento",
    "Leggere 20 minuti",
    "Ripasso flashcard"
  ],
  "inbox": [
    "Chiedere a Sara del bando Erasmus+ startup",
    "Domanda: il progetto X vale ancora la mia energia?",
    "Guardare paper su spaced repetition e sonno",
    "Idea: bot che trasforma i vocali in task",
    "Provare a studiare al parco invece che in camera",
    "Regalo per il compleanno di mamma (tra 3 settimane!)"
  ],
  "lezioni": [
    "Camminare venti minuti dopo pranzo",
    "Dire «lo faccio dopo» senza scrivere quando",
    "Iniziare dalla cosa più difficile appena mi sveglio",
    "Le liste lunghissime: mi bloccano invece di aiutarmi",
    "Le sveglie multiple: le spengo tutte e dormo di più",
    "Mettere il telefono in un’altra stanza",
    "Studiare dopo cena",
    "Studiare in biblioteca invece che in camera"
  ]
} as const;
export const PROFILO_ESEMPIO = {"nome": "Raffaele", "visione": "Costruire cose che contano, imparare più veloce di chiunque, restare curioso e in salute."} as const;

/* il diario dell'esempio: le stesse frasi, ripescate a caso ogni giorno */
export const DIARIO_ESEMPIO = {
  vittorie: [
    'Finita la sessione da 90 minuti senza telefono',
    'Prima call utente andata benissimo',
    'Allenamento fatto anche se non ne avevo voglia',
    'Detto di no a una cosa che non era mia',
    'Studiato prima di aprire i social'
  ],
  blocchi: [
    'Pomeriggio perso tra notifiche e tab aperte',
    'Iniziato tardi: colazione infinita',
    'Troppe cose in lista, paralisi da scelta',
    'Riunione associazione sforata di un’ora'
  ],
  intenzione: 'Alle 9:00, appena mi siedo alla scrivania, inizio dall’attività più importante senza aprire le chat.',
  imparato: 'Quando studio fuori casa rendo di più: cambiare ambiente mi aiuta a concentrarmi.',
  prossima: 'Dedicare la prima ora del mattino allo studio, almeno 5 giorni su 7.',
  esperimenti: ['Fare sport al mattino aumenta il mio focus?', 'Telefono fuori stanza mentre studio']
} as const;
