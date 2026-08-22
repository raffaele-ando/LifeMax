# Prove

Sei controlli automatici che guardano una cosa sola ciascuno, ma
quella cosa fa morire l'app — o la fa diventare illeggibile — quando si
rompe. Sono nati da problemi veri.

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
- **doppioni.js** — due comandi che fanno la stessa cosa nella stessa
  schermata. Non guarda i nomi né le classi: clicca. Per ogni comando
  visibile parte da uno stato identico, lo preme, e registra cosa lascia —
  dove sei finito, com'è cambiato il salvataggio, che pannello si è
  aperto, che messaggio è comparso. Due comandi che lasciano lo stesso
  stato esatto sono due modi per la stessa cosa; N righe di un elenco
  toccano cose diverse, lasciano salvataggi diversi, e non si confondono
  con i doppioni. In fondo al file c'è la lista dei doppioni tenuti di
  proposito, con la ragione. Di comandi identici per costruzione — le righe
  di un elenco, l'«Annulla» su ogni riga del diario — ne prova sei per tipo e
  stampa quanti ne lascia fuori: un taglio muto si leggerebbe come «provato
  tutto». Nasce da «verifica se nella stessa schermata non ci sono elementi
  che fanno le stesse cose». Ci mette qualche minuto: apre una pagina pulita
  per ogni comando.

- **sezioni.js** — cambiare sezione non è ricaricare la pagina. Dentro la
  stessa porta si anima solo il corpo (titolo e riga di linguette restano
  immobili), cambiando porta si anima tutto, e quello che sta FUORI dalla
  vista — barra in basso, colonna, banda — non viene ricostruito né quando
  cambi sezione né quando spunti una cosa. Controlla anche che le barre di
  sezione abbiano tutte la stessa forma. Nasce da «se passo da una schermata
  all'altra deve ricaricare tutto».

- **annulla.js** — annullare dal diario, anche quello di mesi fa. Quasi ogni
  riga del diario è un dato salvato (una spunta, un check-in, una review, una
  nota) e si disfa togliendo quel dato: vale a qualunque distanza di tempo e
  non tocca nient'altro. Le righe di registro raccontano un cambiamento senza
  esserlo, e per quelle serve il punto di ritorno — gli ultimi dodici, in
  contenitori loro fuori dai dati sincronizzati. Controlla che una riga
  vecchia si annulli con la memoria dei punti vuota, che gli XP scendano sul
  giorno giusto e non su oggi, che ogni tipo di riga abbia il suo inverso e
  che una chiave inventata non combini niente, che il tasto compaia una volta
  sola per cambiamento e mai dove non c'è niente da disfare, che l'annulla si
  possa a sua volta annullare, e che passare dal punto avverta di quante
  altre cose rientrano. Nasce da «non posso annullare le cose che faccio per
  ogni cosa» e da «non è retroattivo rispetto a quelli che ho già messo nel
  passato».

## Come si lanciano

    npm install playwright
    node prove/clic.js
    node prove/modalita.js
    node prove/segni.js      # solo Node, niente browser
    node prove/doppioni.js   # qualche minuto
    node prove/sezioni.js
    node prove/annulla.js

Servono Node e Chromium (segni.js si accontenta di Node). Se Chromium sta in un posto suo:

    CHROMIUM=/percorso/di/chrome node prove/clic.js
