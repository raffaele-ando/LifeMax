# Prove

Due controlli automatici che guardano una cosa sola ciascuno, ma quella
cosa fa morire l'app quando si rompe. Sono nati da due bug veri.

- **clic.js** — dove finisce davvero il dito. Campiona una griglia di punti
  su tutta la pagina, scorrendola per intero, e chiede al browser chi
  riceve il clic in ognuno. Controlla due cose opposte: che nessun
  elemento si prenda punti molto oltre il proprio rettangolo (un'area
  invisibile che ruba i clic di quelli intorno) e che ogni comando visibile
  riceva il clic quando lo si tocca nel mezzo.
- **modalita.js** — apre tutti i pannelli da tutte le loro strade e li
  chiude in tutti i modi (la x, Esc, toccando fuori). Dopo ogni
  combinazione controlla che niente sia rimasto `inert`, che lo
  scorrimento sia tornato e che la barra in basso riceva i clic. Un
  livello di modalità rimasto appeso non si vede: si scopre solo che
  l'app non risponde più a niente.

## Come si lanciano

    npm install playwright
    node prove/clic.js
    node prove/modalita.js

Servono Node e Chromium. Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
