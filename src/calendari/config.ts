/* ============================================================
   GLI ID DELL'APP PRESSO GOOGLE E MICROSOFT.

   Sono i «Client ID» che si ottengono registrando LifeMax nella console di
   Google e nel portale di Microsoft: le istruzioni passo per passo stanno
   in `src/calendari/LEGGIMI.md`.

   NON SONO SEGRETI. Un Client ID dice «chi chiede» e finisce per forza nel
   browser di chiunque apra l'app: è scritto in chiaro nella richiesta che
   apre la finestra di Google. Quello che lo protegge è l'elenco degli
   indirizzi autorizzati, che sta nella console e non qui.

   DUE POSTI DOVE METTERLI, e vale il primo che c'è:
     1. qui sotto — ma il sito che Pages serve è quello COSTRUITO, quindi
        dopo aver cambiato questo file serve `npm run build:nuovo`;
     2. dall'app: Profilo → Calendari collegati → «Ho il Client ID». Finisce
        nei dati (che si sincronizzano), e non serve costruire niente. È la
        stessa strada dell'indirizzo del postino.
   Vuoti, il servizio si mostra «da configurare» e non parte niente.
   ============================================================ */
export const GOOGLE_CLIENT_ID = '168732828259-r62fu4bc9ppa5fdtljdmffj6qib16epa.apps.googleusercontent.com';
export const MICROSOFT_CLIENT_ID = '139c6fa8-e084-4b27-902b-fc348453b4f4';

/* dove sono scritte le istruzioni: il link del pannello quando un ID manca */
export const ISTRUZIONI = 'https://github.com/raffaele-ando/LifeMax/blob/HEAD/src/calendari/LEGGIMI.md';
