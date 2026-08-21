# Prove

Tre controlli automatici che guardano una cosa sola ciascuno, ma quella
cosa fa morire l'app — o la fa diventare illeggibile — quando si rompe.
Sono nati da problemi veri.

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
- **segni.js** — un segno, una cosa. Non guarda i pixel: legge il codice e
  tiene ferme cinque regole. Nessun disegno esiste sotto due nomi; nessun
  segno è invocato senza esistere né disegnato senza servire; un'icona
  delle aree non è mai anche un comando (altrimenti la stessa figura dice
  «la tua area» e due righe sopra «priorità»); tutte le misure stanno sui
  cinque gradini della scala; e il tratto arriva sempre alla stessa
  densità. Nasce da «vedo più icone usate per cose diverse».

## Come si lanciano

    npm install playwright
    node prove/clic.js
    node prove/modalita.js
    node prove/segni.js      # solo Node, niente browser

Servono Node e Chromium (segni.js si accontenta di Node). Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
