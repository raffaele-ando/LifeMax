# Revisione UX/UI — telefono 390×844 (giro 1)

## Tema chiaro

### oggi-adesso__tel-light.png
- [gravità: media] oggi-adesso__tel-light.png — in alto: controllo segmentato «Adesso / La giornata / Rituali» + barra in basso «Oggi / Attività / Andamento» — due livelli di navigazione a schede con lo stesso peso visivo (icona + etichetta, pillola bianca): l'utente non capisce quale sia la navigazione principale — trasformare il segmentato in un vero segmented control solo testo, più basso (32–36 px), senza icone, così si legge come sotto-vista della scheda «Oggi».
- [gravità: bassa] oggi-adesso__tel-light.png — badge «1» sopra «Rituali» — il badge è incollato all'angolo in alto a destra della cella, lontano dall'icona e quasi sul bordo del contenitore; non segue la stessa regola del badge «6» in basso (che sta sull'icona) — ancorarlo all'icona come nella tab bar, stesso colore e stessa forma (cerchio pieno primario).
- [gravità: media] oggi-adesso__tel-light.png — avatar «R» in alto a destra — quadrato viola pieno, identico al pulsante «+» della tab bar: sembra un'azione primaria, non un profilo — avatar circolare, colore neutro/tinta tenue, 36 px, allineato al centro verticale del segmentato.
- [gravità: media] oggi-adesso__tel-light.png — sotto la data, barra verde con «1/2» — non si capisce cosa siano 1 su 2 (attività? rituali? abitudini?) — aggiungere etichetta («1 di 2 fatte oggi») o eliminare la barra.
- [gravità: bassa] oggi-adesso__tel-light.png — pastiglia «🔥 38» a destra della data — nessuna etichetta, alta il doppio della riga del titolo e non allineata né alla baseline della data né alla barra — allineare al centro della riga del titolo, ridurre l'altezza e aggiungere il significato («38 giorni di fila») almeno al tocco o con accessibilità.
- [gravità: bassa] oggi-adesso__tel-light.png — card «Pianifica la giornata / Un minuto» — il sottotitolo «Un minuto» è ambiguo (durata? scadenza?) — «Ci vuole 1 minuto».
- [gravità: media] oggi-adesso__tel-light.png — card principale azzurra (Studio / Università → Ripasso flashcard) — tre livelli di riquadro (card → chip «Abitudine» → pulsanti con bordo) + ombra molto marcata + sfondo azzurro: pesante rispetto al resto della pagina piatta — togliere l'ombra o lo sfondo colorato, trasformare «Abitudine» in testo/meta grigio senza pillola (la pillola sembra toccabile).
- [gravità: media] oggi-adesso__tel-light.png — riga «Timer» / «Salta oggi» nella card — due azioni secondarie con stili diversi (Timer: pulsante bianco con bordo e ombra; Salta oggi: testo nudo con icona a destra), larghezze e altezze diverse, non distribuite sulla riga — usare due pulsanti secondari uguali a metà larghezza, o entrambi testuali; icona di «Salta» a sinistra come per Timer.
- [gravità: bassa] oggi-adesso__tel-light.png — pulsante «Fatto» verde scuro — verde molto scuro e saturo, diverso dal verde della barra di avanzamento in alto — uniformare il verde di successo.
- [gravità: bassa] oggi-adesso__tel-light.png — riga «Confrontare piani telefonici» — la casella di spunta è enorme (~42 px, angoli arrotondati) rispetto al testo e sembra un riquadro immagine vuoto — casella 22–24 px circolare o quadrata, con area di tocco 44 px invisibile.
- [gravità: bassa] oggi-adesso__tel-light.png — intestazione «Poi» — parola isolata poco chiara come titolo di sezione — «Dopo» / «Più tardi oggi».
- [gravità: bassa] oggi-adesso__tel-light.png — tab bar in basso — il «+» è dentro la barra separato da un divisore verticale: sembra una quarta scheda di forma diversa; badge «6» su «Attività» copre parte dell'icona — FAB staccato dalla barra o «+» centrato come scheda; badge spostato sul bordo alto-destro dell'icona senza coprirla.

### oggi-adesso-scorsa__tel-light.png
- [gravità: bassa] oggi-adesso-scorsa__tel-light.png — intera schermata — identica a quella non scorsa: o la pagina non scorre (il contenuto sta tutto) o la cattura non ha scorso; lo screenshot non aggiunge informazione — verificare; se la pagina è corta va bene, altrimenti rifare la cattura. Valgono gli stessi difetti di oggi-adesso__tel-light.png.

### giornata-giorno__tel-light.png
- [gravità: alta] giornata-giorno__tel-light.png — fondo dello schermo, tab bar — la barra di navigazione in basso è tagliata: se ne vede solo la metà superiore (icone tagliate, «+» viola mozzato a destra). Nella vista calendario la barra esce dallo schermo — fissare la tab bar al fondo (position: fixed + safe-area) anche in questa vista; il contenuto scorre sotto, non la spinge fuori.
- [gravità: alta] giornata-giorno__tel-light.png — parte alta — tre file di schede impilate (segmentato «Adesso/La giornata/Rituali», poi «Giorno/Settimana/Mese/Anno», poi tab bar in basso): prima dell'ora 07:00 si consumano ~260 px di intestazioni — ridurre: il selettore Giorno/Settimana/Mese/Anno diventa un menu compatto accanto al titolo («Giorno ▾») o un segmentato solo testo da 32 px.
- [gravità: media] giornata-giorno__tel-light.png — selettore «Giorno/Settimana/Mese/Anno» — stile diverso dal segmentato superiore (qui niente contenitore, selezione lilla, icone diverse): due segmented control nella stessa schermata con due linguaggi — stesso componente per entrambi.
- [gravità: media] giornata-giorno__tel-light.png — titolo «Oggi» tra le frecce — manca la data: con le frecce si va ad altri giorni ma qui non si vede che giorno è — «Oggi · mar 18 ago» (o data in sottotitolo).
- [gravità: media] giornata-giorno__tel-light.png — riga «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴 ˅» — icone senza etichetta incomprensibili (due forchette identiche = pranzo e cena?), sembra una riga di codice — testo «Sonno 23:30–07:30 (8 h) · 3 pasti» oppure etichette sotto le icone.
- [gravità: media] giornata-giorno__tel-light.png — fascia tratteggiata 07:00–07:30 — area a righe diagonali senza spiegazione (è il sonno?) — aggiungere etichetta «Sonno» con icona luna dentro la fascia, come per «Colazione».
- [gravità: media] giornata-giorno__tel-light.png — blocco «Organizzare cena con il gruppo» 09:30–11:00 + linea dell'ora 10:30 — la linea blu dell'ora attraversa la card e il badge «10:30» sporge oltre il bordo destro della card fin quasi al bordo del contenitore; inoltre il titolo è spinto in basso (spazio vuoto sopra di ~25 px) — far passare la linea sotto le card (z-index) o con opacità, badge dentro la colonna delle ore a sinistra (come Google/Apple Calendar); padding interno uniforme 8 px in alto.
- [gravità: bassa] giornata-giorno__tel-light.png — blocco fatto barrato con stellina «☆» — la stellina è barrata insieme al testo e il colore rosa della fascia laterale non corrisponde a nessuna area visibile — escludere icona dal barrato; legenda colore area.
- [gravità: bassa] giornata-giorno__tel-light.png — blocchi «Colazione» e «Pranzo» — grigi a tutta larghezza, molto simili alle attività fatte (grigie anche loro): pasti e attività completate si confondono — pasti con stile più leggero (solo testo + icona, sfondo trasparente tratteggiato) o colore dedicato.

### giornata-giorno-fondo__tel-light.png
- [gravità: alta] giornata-giorno-fondo__tel-light.png — fondo, tab bar — anche qui la barra di navigazione è tagliata a metà fuori dallo schermo — vedi sopra.
- [gravità: media] giornata-giorno-fondo__tel-light.png — blocchi «Camminata / movimento» e «Leggere 20 minuti» (contorno verde, sfondo bianco) vs «Confrontare piani telefonici» (riempito giallo con barra laterale) — due linguaggi diversi senza legenda; la differenza abitudine/attività si capisce solo dalla piccola icona ↻ — tenere lo stesso componente (barra laterale col colore area) e distinguere l'abitudine con icona + etichetta; niente contorno verde (il verde in questa app significa «fatto»).
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — «Leggere 20 minuti» — l'orario non è mostrato (blocco breve) mentre negli altri sì — mostrare l'orario sulla stessa riga del titolo quando il blocco è basso («Leggere 20 minuti · 22:00»).
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — fascia tratteggiata 23:30–00:00 — di nuovo nessuna etichetta «Sonno» — come sopra.
- [gravità: media] giornata-giorno-fondo__tel-light.png — sezione «Senza orario» → «Ripasso flashcard» — è un'abitudine (in Adesso ha il chip «Abitudine») ma qui ha la casella quadrata da attività + icona libro blu + orologio viola a destra senza testo: incoerente e l'orologio non si capisce (pianifica? timer?) — icona ↻ come nelle altre abitudini; sostituire l'orologio con «Pianifica» o un'icona con etichetta accessibile e tooltip.
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — campo «Nuova attività…» con pulsante «+ Aggiungi» lilla dentro — il pulsante è attivo anche con campo vuoto e occupa 1/3 della larghezza — mostrarlo disabilitato finché non si scrive, oppure solo icona «+».
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — link «Sposta 1 non fatta a domani» — italiano zoppo («1 non fatta» senza sostantivo) — «Sposta a domani 1 attività non fatta».
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — spaziatura — 16 px tra calendario e «Senza orario», ma 16 px fra card e campo, 30 px tra campo e link e ~70 px vuoti sotto il link: ritmo verticale irregolare — scala di spaziature coerente (es. 24 tra sezioni, 12 dentro sezione).

### giornata-settimana__tel-light.png
- [gravità: media] giornata-settimana__tel-light.png — intestazione fissa con «4 di 24 fatte questa settimana» e striscia L–D — la prima card della lista scorre sotto l'intestazione senza separazione (nessuna ombra/bordo/sfondo sfumato): la card appare tagliata di netto sotto i numeri dei giorni; il testo «4 di 24…» è inoltre a ridosso del bordo alto — aggiungere sfondo opaco + ombra leggera o linea di separazione all'intestazione fissa quando si scorre, e margine sopra di almeno 12 px.
- [gravità: media] giornata-settimana__tel-light.png — tab bar — qui la barra è intera e visibile, mentre nella vista Giorno è tagliata: comportamento diverso fra viste sorelle — unificare. Sotto la barra flottante si vede il contenuto («18:00 Camminata / movimento») nel margine inferiore: o barra ancorata al fondo o sfumatura sotto.
- [gravità: media] giornata-settimana__tel-light.png — liste giorno per giorno — le stesse tre abitudini ripetute identiche ogni giorno occupano quasi tutto lo spazio; le attività vere si perdono — raggruppare le abitudini in una riga riassuntiva («3 abitudini») espandibile, o mostrarle in una sezione unica per la settimana.
- [gravità: bassa] giornata-settimana__tel-light.png — icona ↻ di «Ripasso flashcard» blu, delle altre abitudini verde; pallino arancione per l'attività — codice colore non spiegato e non coerente con la vista Giorno — legenda o un solo colore per «abitudine», colore area come segno secondario.
- [gravità: bassa] giornata-settimana__tel-light.png — «Sposta» solo sulla riga di «Confrontare piani telefonici» — azione testuale a destra che appare solo su una riga senza spiegazione — ok tenerla, ma serve coerenza: stesso link anche nella vista Giorno (dove c'è invece «Sposta 1 non fatta a domani»).
- [gravità: bassa] giornata-settimana__tel-light.png — striscia settimana: 17 ha un anello verde, 18 è un cerchio viola pieno con arco verde, gli altri niente — l'anello parziale non è spiegato — breve didascalia o mostrare l'anello vuoto anche nei giorni futuri per far capire che è un indicatore di avanzamento.

### giornata-mese__tel-light.png
- [gravità: media] giornata-mese__tel-light.png — griglia del mese — oggi (18) ha due segni di selezione insieme: quadrato grigio di sfondo + cerchio viola pieno + arco verde + pallino arancione sotto: troppi indicatori su una cella — un solo segno per «oggi» (cerchio pieno) e uno per «selezionato».
- [gravità: media] giornata-mese__tel-light.png — pallini colorati sotto i giorni (verde, rosa, rosso, arancione, viola, blu) — nessuna legenda, non si capisce che rappresentino le aree — legenda sotto la griglia o tooltip al tocco.
- [gravità: bassa] giornata-mese__tel-light.png — ultima riga con solo «31» — riga isolata + ~40 px vuoti sotto prima del bordo della card — riempire con i giorni del mese successivo in grigio (come per 27–31 in alto) per una griglia rettangolare.
- [gravità: media] giornata-mese__tel-light.png — lista «Oggi» sotto la griglia — i quadratini colorati a sinistra (contorno verde/blu, pieno rosa/arancione) sembrano caselle di spunta ma sono solo indicatori di colore; il quadrato pieno rosa su un'attività fatta e quello pieno arancione su una non fatta si confondono con «spuntato» — usare pallini o barre laterali, non quadrati; o renderli vere caselle.
- [gravità: media] giornata-mese__tel-light.png — ordine della lista «Oggi» — «Leggere 20 minuti 22:00» sta sopra «Camminata 18:00» e «Organizzare cena 09:30»: ordine non cronologico — ordinare per orario, poi senza orario in fondo.
- [gravità: bassa] giornata-mese__tel-light.png — «Apri il giorno ›» — testo e chevron ok, ma il titolo «Oggi» dovrebbe dire anche la data del giorno selezionato quando non è oggi — «Martedì 18».

### giornata-anno__tel-light.png
- [gravità: bassa] giornata-anno__tel-light.png — riga statistiche in alto «giorni attivi / fatte / XP» — «XP» è gergo da videogioco non spiegato e «fatte» senza sostantivo — «punti» o «esperienza»; «attività fatte».
- [gravità: media] giornata-anno__tel-light.png — numeri verdi in alto a destra delle card mese («7», «25», «17») — senza etichetta: giorni attivi? attività fatte? — «25 giorni» o didascalia unica sopra la griglia.
- [gravità: media] giornata-anno__tel-light.png — 12 card-mese con heatmap da ~10 px — quadratini troppo piccoli per essere toccati o letti, nessuna intestazione dei giorni, nessuna legenda dell'intensità del verde; card di altezze interne diverse (5 o 6 righe) che lasciano vuoti irregolari — legenda «meno ▢▢▢▢ più», griglie a 6 righe fisse, toccare un mese apre la vista Mese (rendere evidente con chevron o stato premuto).
- [gravità: bassa] giornata-anno__tel-light.png — titolo «Scadenze» — corpo ~22 px, molto più grande dei titoli dei mesi e delle altre intestazioni di sezione dell'app («Poi», «Oggi»): gerarchia incoerente — stesso stile dei titoli di sezione.
- [gravità: bassa] giornata-anno__tel-light.png — riga «7 set · Trovare lavoro per agosto · 💼» — l'icona valigetta viola a destra non è spiegata (area «Lavoro»?) e sembra un pulsante; scadenza a settembre per un obiettivo «per agosto» — mettere l'icona area a sinistra, colore neutro; segnalare scadenze in ritardo/incoerenti.

### giornata-sonno-aperto__tel-light.png
- [gravità: alta] giornata-sonno-aperto__tel-light.png — pannello sonno e pasti, campi orario «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «08:00 PM» — formato 12 ore AM/PM in un'app italiana che ovunque usa 24 ore (23:30) — forzare il formato 24 h (lang="it" sul campo / selettore orario personalizzato).
- [gravità: alta] giornata-sonno-aperto__tel-light.png — menu a tendina della durata «15 mir», «45 mi», «45 mi» — testo troncato, si legge «mir» — allargare il select o scrivere «15′» / «15 min» con larghezza sufficiente; meglio un controllo personalizzato.
- [gravità: media] giornata-sonno-aperto__tel-light.png — tutti i campi — controlli nativi del browser (select con freccia di sistema, input bordati grigi) in mezzo a un'interfaccia tutta personalizzata: stile incoerente; colonne non allineate (il campo «Sveglia» è più stretto di «A letto», le etichette «A letto»/«Sveglia» con icone e «Colazione/Pranzo/Cena» senza) — componenti custom con la stessa altezza e larghezza, griglia a colonne fisse.
- [gravità: media] giornata-sonno-aperto__tel-light.png — riga di link «+ Pasto · Ripristina · Ritmo di base» — tre azioni testuali dello stesso peso, «Ritmo di base» non si capisce cosa faccia, «Ripristina» è distruttivo senza conferma visibile — «+ Aggiungi pasto» come pulsante; «Ripristina» e «Ritmo di base» in un menu «⋯» con descrizione.
- [gravità: bassa] giornata-sonno-aperto__tel-light.png — icone cestino accanto a ogni pasto — piccole (16 px), area di tocco scarsa, troppo vicine al select — 44 px di area di tocco, o scorrimento per eliminare.
- [gravità: alta] giornata-sonno-aperto__tel-light.png — fondo: tab bar tagliata a metà come in tutte le viste Giorno.
- [gravità: bassa] giornata-sonno-aperto__tel-light.png — il pannello aperto non ha titolo visibile né pulsante di chiusura nella parte catturata (titolo scorso fuori) — aggiungere titolo fisso «Sonno e pasti» con «Fine».

### giornata-scheda-blocco__tel-light.png
- [gravità: alta] giornata-scheda-blocco__tel-light.png — riga «Ora» — «09:30 AM»: formato 12 h in italiano (sopra, nel calendario, c'è «09:30–11:00») — 24 h ovunque.
- [gravità: media] giornata-scheda-blocco__tel-light.png — titolo «Organizzare cena / con il gruppo» — va a capo dopo «cena» pur avendo spazio fino al bordo destro: larghezza massima del titolo troppo stretta (~55%) — titolo a tutta larghezza (fino a 16 px dal bordo).
- [gravità: media] giornata-scheda-blocco__tel-light.png — stato dell'attività — non si vede che è già fatta: solo il pulsante testuale centrato «↶ Togli la spunta» lo lascia intuire; il titolo non è barrato e non c'è un'etichetta «Fatta» — mostrare lo stato («✓ Fatta alle 10:12») e il pulsante come secondario allineato agli altri.
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — valori nelle pillole: «09:30 AM» nero, «1 h 30» viola, «Relazioni & Sociale» viola senza ×; pillole di larghezza diversa — stesso colore del testo per tutti i valori; × sempre o mai.
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — «Sposta in Da fare» — formula macchinosa (nome di una scheda usato come complemento) — «Togli dal calendario» o «Rimetti tra le cose da fare».
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — «Elimina» a ridosso del fondo — margine inferiore < 16 px e nessuna area sicura per l'indicatore home — padding inferiore 24 px + safe-area.

### giornata-scheda-abitudine__tel-light.png
- [gravità: media] giornata-scheda-abitudine__tel-light.png — pulsante «✓ Fatta» viola — nella schermata Adesso la stessa azione è «✓ Fatto» verde: colore e genere grammaticale diversi per la stessa azione — un solo stile e una sola parola («Fatto») in tutta l'app.
- [gravità: alta] giornata-scheda-abitudine__tel-light.png — «Ora 06:00 PM» — formato 12 h — 24 h («18:00»).
- [gravità: media] giornata-scheda-abitudine__tel-light.png — azioni «× Togli solo da oggi», «Finisce qui», «→ Apri l'abitudine» — testi poco naturali: «Togli solo da oggi» è ambiguo (togliere il blocco? saltare?), «Finisce qui» non dice cosa finisce e sembra irreversibile ma è viola come le azioni innocue — «Salta oggi», «Termina l'abitudine da oggi» (rosso, con conferma), «Apri abitudine».
- [gravità: bassa] giornata-scheda-abitudine__tel-light.png — confronto con la scheda attività — stesse righe Ora/Durata/Area ma la struttura sopra cambia (qui pulsante pieno, là pulsante testuale centrato): le due schede sorelle non hanno la stessa gerarchia — stesso schema: titolo, meta, pulsante principale a tutta larghezza (Fatto / Togli spunta), proprietà, azioni.

### rituali__tel-light.png
- [gravità: media] rituali__tel-light.png — titoli «Review della sera», «Review della settimana», «Check-in» — anglicismi mescolati all'italiano («Review della…» suona ibrido) — «Bilancio della sera», «Bilancio della settimana», «Come stai?» / «Check-in» solo se è un termine voluto in tutta l'app.
- [gravità: media] rituali__tel-light.png — stato a destra «da fare / 2 di 3 scelte» su «Piano del giorno» — contraddittorio: è «da fare» ma ne hai già scelte 2 su 3; stati in minuscolo, due righe di testo piccolo allineate a destra difficili da scansionare — una sola etichetta di stato con pillola colorata («2/3», «Fatto», «Da fare») e il dettaglio come sottotitolo sotto il nome.
- [gravità: bassa] rituali__tel-light.png — icona di «Piano del giorno» viola piena, le altre lilla chiare — non si capisce cosa significhi la differenza (prossimo? consigliato?) — spiegarlo («Adesso») o uniformare.
- [gravità: bassa] rituali__tel-light.png — metà inferiore dello schermo vuota — nessun orario suggerito, nessuna spiegazione dei rituali — aggiungere l'ora consigliata per ciascuno («dopo le 20:00») o un breve testo introduttivo.
- [gravità: bassa] rituali__tel-light.png — il badge «1» su «Rituali» scompare quando la scheda è selezionata, ma «Check-in» è l'unico fatto e ne mancano 4: il badge «1» non corrisponde a nulla di visibile qui — far corrispondere il numero ai rituali da fare ora, ed evidenziarli.

### rituale-piano__tel-light.png
- [gravità: media] rituale-piano__tel-light.png — «2 di 3 scelte» ma nella lista ci sono solo 2 voci e nessun segnaposto per la terza — mostrare lo slot vuoto «3ª priorità (facoltativa)».
- [gravità: media] rituale-piano__tel-light.png — riga «Organizzare cena con il gruppo» barrata con pillola piena «☆ Priorità» e icona rosa persone; «Confrontare piani telefonici» con icona carta gialla — le icone colorate a destra non sono spiegate; la pillola viola piena è più evidente del titolo stesso — icona area a sinistra con colore area, «Priorità» come stella piccola senza pillola.
- [gravità: bassa] rituale-piano__tel-light.png — campo «Aggiungi un'altra…» (grigio pieno, «+ Aggiungi» testuale) — diverso dal campo «Nuova attività…» della Giornata (bianco con bordo, pulsante lilla): stesso componente con due aspetti — unificare.
- [gravità: bassa] rituale-piano__tel-light.png — «Aggiungi un'altra…» — sostantivo sottinteso — «Aggiungi un'altra attività».
- [gravità: media] rituale-piano__tel-light.png — «Quando inizi?» con segnaposto «Es. alle 9:00, alla scrivania» — domanda poco chiara (inizi cosa? la prima priorità?) e non si sa se è obbligatoria — «Quando e dove inizi la prima priorità? (facoltativo)».
- [gravità: bassa] rituale-piano__tel-light.png — pulsante «💾 Salva +5 XP» — icona floppy datata e ricompensa in gergo «XP» dentro il pulsante — «Salva il piano» e mostrare i punti dopo, come feedback.
- [gravità: bassa] rituale-piano__tel-light.png — fisarmonica dentro una card con elenco di altre fisarmoniche: contenuto aperto a filo con le righe sottostanti senza separazione chiara — aprire il rituale in un foglio/pagina dedicata oppure sfondo leggermente diverso per l'area espansa.

### rituale-sonno-pasti__tel-light.png
- [gravità: alta] rituale-sonno-pasti__tel-light.png — riga «Sonno: Come sempre · 23:30–07:30» e sotto «A letto 11:30 PM», «Sveglia 07:30 AM» — nella stessa card due formati orari diversi (24 h e 12 h) — 24 h ovunque.
- [gravità: media] rituale-sonno-pasti__tel-light.png — pulsanti «Salva» (lilla, piccolo, a sinistra) + «Non ricordo» (link) a metà card, e poi un secondo pulsante principale viola in fondo (coperto dalla tab bar) — due salvataggi nella stessa scheda: non si capisce cosa salvi cosa — un solo pulsante di conferma in fondo; «Non ricordo» come opzione accanto agli orari.
- [gravità: media] rituale-sonno-pasti__tel-light.png — pasti «sì / no / ⏰» — tre pulsanti grigi identici senza stato selezionato visibile; «sì» minuscolo; l'orologio non dice cosa fa (cambiare orario?) — segmentato «Sì | No» con stato selezionato chiaro, «Altro orario» al posto dell'icona.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — «Come sempre · 23:30–07:30» in viola a destra — sembra un link ma è un'informazione (o è un'azione «uguale al solito»?) — se è un'azione, pulsante «Come sempre» esplicito; altrimenti testo grigio.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — icone orologio a destra degli orari «11:30 PM ⏰» — ridondanti, toccabili? — rimuovere o renderle il controllo del campo.
- [gravità: media] rituale-sonno-pasti__tel-light.png — fondo — il pulsante principale viola è nascosto dietro la tab bar e sotto si vede la riga di «Check-in» che spunta sotto la barra — padding inferiore pari all'altezza della tab bar + 16 px.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — «Altre cose fatte» / «Una cosa che hai fatto…» — intento non chiaro in un rituale di sonno e pasti — spostare nella review della sera o spiegare («Hai fatto qualcos'altro di utile?»).

### rituale-checkin__tel-light.png
- [gravità: media] rituale-checkin__tel-light.png — stato «✓ fatto» ma nessun valore 1–5 è selezionato e il pulsante «Registra» è chiaro (disattivato?) — non si vede cosa hai registrato — mostrare le risposte date (valore evidenziato) e «Aggiorna» invece di «Registra».
- [gravità: media] rituale-checkin__tel-light.png — «Media recente 4.3 / 4.2» — separatore decimale inglese — «4,3».
- [gravità: bassa] rituale-checkin__tel-light.png — etichette di scala «concentratissimo», «1 · esausto … 5 · pieno», «disperso», «giù» — «concentratissimo» è innaturale, «pieno» da solo è ambiguo — «molto concentrato», «pieno di energia», «distratto», «male / benissimo».
- [gravità: bassa] rituale-checkin__tel-light.png — 15 pulsanti quadrati da 56 px con bordo — muro di riquadri, molto alto (tutta la schermata) — pulsanti più bassi (40 px) o slider a 5 punti / emoji, per farlo stare in una schermata con il pulsante visibile.
- [gravità: bassa] rituale-checkin__tel-light.png — «Registra +3 XP» lilla chiaro vs «Salva +5 XP» viola pieno nel Piano — stessa azione di conferma con due stili — se è disabilitato, dirlo («Scegli un valore»); altrimenti stile primario.
- [gravità: bassa] rituale-checkin__tel-light.png — il pulsante «Registra» è parzialmente sotto la tab bar flottante — padding inferiore insufficiente.

### rituale-sera__tel-light.png
- [gravità: alta] rituale-sera__tel-light.png — colonna nomi delle aree — nomi troncati di netto senza puntini: «Relazioni & Soc», «Studio / Univer», «Progetti Found», «Altro / Esploraz» — dare alla colonna nome tutta la riga e mettere la scala 1–5 sotto, oppure ridurre i pulsanti (5×36 px) e consentire 2 righe; mai troncare senza «…».
- [gravità: alta] rituale-sera__tel-light.png — scala 1–5 per area — nessuna domanda né legenda: non si sa cosa si valuta (quanto hai dedicato? come è andata?) né cosa significano 1 e 5 — domanda in cima («Come è andata oggi in ciascuna area?») e legenda «1 male · 5 benissimo» come nel Check-in.
- [gravità: media] rituale-sera__tel-light.png — pulsanti 1–5 grigi pieni senza bordo — nel Check-in gli stessi pulsanti sono bianchi con bordo: stesso componente, due aspetti — unificare.
- [gravità: bassa] rituale-sera__tel-light.png — 8 righe × 5 pulsanti = 40 bersagli in una schermata, il pulsante di salvataggio sparisce sotto la tab bar — permettere di saltare le aree non toccate oggi, mostrare solo quelle con attività.
- [gravità: bassa] rituale-sera__tel-light.png — icone area colorate (rosa, giallo, blu, verde, verde acqua, arancio, viola, rosso) piccole e sottili — ok come codice, ma colori diversi da quelli delle barre nel calendario (es. Relazioni rosa ok, Lavoro viola = colore primario dell'app) — evitare che un'area usi il colore primario delle azioni.

### rituale-settimana__tel-light.png
- [gravità: media] rituale-settimana__tel-light.png — numeri «216 / 10 / 6/7» — carattere con grazie (serif) usato solo qui, diverso da tutta l'app; le tre colonne non sono centrate né su griglia (spazi tra colonne diversi) — stesso carattere sans dell'app, tre colonne uguali centrate, come la riga statistiche della vista Anno.
- [gravità: bassa] rituale-settimana__tel-light.png — «XP guadagnati», «azioni completate», «giorni attivi» — terminologia diversa dal resto («fatte», «attività», «cose da fare») — usare sempre lo stesso sostantivo («attività fatte»).
- [gravità: bassa] rituale-settimana__tel-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — senza punto interrogativo — aggiungere «?».
- [gravità: bassa] rituale-settimana__tel-light.png — aree di testo con maniglia di ridimensionamento nativa visibile nell'angolo — sul telefono non serve e sembra non rifinito — resize: none, altezza che cresce col testo.
- [gravità: bassa] rituale-settimana__tel-light.png — ultima domanda «Cosa cambierai la prossima settimana» tagliata dalla tab bar — padding inferiore.

### attivita-sistemare__tel-light.png
- [gravità: bassa] attivita-sistemare__tel-light.png — sotto il segmentato, etichetta «📥 Da sistemare» — ripete esattamente la scheda selezionata subito sopra — eliminarla o sostituirla con una spiegazione utile («Decidi cosa fare di ogni idea»).
- [gravità: media] attivita-sistemare__tel-light.png — badge «6 / 9 / 3» sul segmentato e «6» su Attività in basso — quattro badge numerici nella stessa schermata; il badge numerico su «Da fare» e «Abitudini» è informativo, non un avviso: rumore visivo — badge solo su «Da sistemare» (l'unico che richiede azione), conteggi delle altre come testo grigio.
- [gravità: media] attivita-sistemare__tel-light.png — menu a tendina nativo «Altro / Esplorazione» grigio con freccia di sistema — stile incoerente con il resto, alto come un pulsante e sembra un'azione principale — chip area con icona e colore, che apre un foglio di scelta.
- [gravità: bassa] attivita-sistemare__tel-light.png — tre pulsanti «◎ Oggi» (viola pieno), «Da fare», «🗑 Scarta» (rosso con bordo) — «Scarta» rosso ha lo stesso peso visivo di «Da fare»: azione distruttiva troppo invitante; «Oggi» con l'icona della scheda Oggi è criptico come verbo — «Fai oggi», «Più tardi», «Scarta» come testo rosso senza bordo o in un menu.
- [gravità: media] attivita-sistemare__tel-light.png — elenco «In coda 5» — testi grigi senza riquadro, senza chevron, senza casella: non si capisce se siano toccabili; «e un'altra» in corsivo al posto della quinta voce, quando c'è spazio in abbondanza — mostrare tutte e 5 le voci in righe toccabili, o «+1 altra» in un link.
- [gravità: bassa] attivita-sistemare__tel-light.png — metà inferiore vuota — ok, ma la card corrente potrebbe essere più centrale; nessun indicatore «1 di 6» per capire quante ne restano — «1 di 6» accanto al titolo.

### attivita-dafare__tel-light.png
- [gravità: alta] attivita-dafare__tel-light.png — quadrati grandi a sinistra di ogni riga con icona ◎ (il primo viola pieno) — sembrano caselle di spunta ma sono il pulsante «metti in Oggi»: chi li tocca per completare l'attività sbaglia; il ◎ è l'icona della scheda Oggi, non un verbo — vera casella di spunta rotonda a sinistra; «aggiungi a oggi» come icona più piccola a destra (es. ☀︎ o «Oggi» testo) con stato attivo evidente.
- [gravità: media] attivita-dafare__tel-light.png — titoli («Recuperare i corsi di / ingegneria gestionale», «Studiare le risposte / per l'OFA di inglese»…) vanno a capo a ~60% della larghezza lasciando un vuoto a destra — larghezza massima del titolo fino al contatore/chevron.
- [gravità: bassa] attivita-dafare__tel-light.png — icone area colorate minuscole (12 px) fra il quadrato e il titolo — troppo piccole e attaccate al testo, non allineate alla prima riga del titolo — 16 px, 8 px di spazio, allineate alla prima riga.
- [gravità: bassa] attivita-dafare__tel-light.png — «1 di 3», «1 di 4» a destra — non dice di cosa (passi?) — «1/3 passi» o mini barra.
- [gravità: bassa] attivita-dafare__tel-light.png — filtro «▽ Tutte ˅» isolato su una riga intera, pillola bianca — spreca una riga; unirlo alla riga dell'intestazione «Importanti» o accanto al campo.
- [gravità: bassa] attivita-dafare__tel-light.png — badge «9» su «Da fare» ma la lista mostra 3 + 6 = 9 ok; il badge in basso «6» su Attività però conta le cose da sistemare: due significati per lo stesso badge — chiarire.
- [gravità: bassa] attivita-dafare__tel-light.png — l'ultima riga scorre sotto la tab bar flottante e si vede tra barra e fondo — sfumatura o barra ancorata.

### attivita-dafare-aggiunta__tel-light.png
- [gravità: media] attivita-dafare-aggiunta__tel-light.png — opzioni sotto il campo («Oggi / Domani / Senza data», menu «Altro / Esplorazione») — rientrate di ~12 px rispetto al bordo sinistro del campo e della lista: margine sinistro diverso — allineare a 16 px come il campo, oppure metterle dentro il riquadro del campo.
- [gravità: media] attivita-dafare-aggiunta__tel-light.png — pulsante «+ Aggiungi» resta lilla pallido anche con testo scritto: sembra disattivato — viola pieno quando il campo ha testo.
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — menu a tendina nativo dell'area con «Altro / Esplorazione» preselezionato — stile di sistema e scelta di default arbitraria — chip area «Nessuna area ˅» con foglio di scelta.
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — chip «Oggi/Domani» con bordo e «Senza data» viola pieno — mancano «Scegli data…» e orario; nessuna etichetta che dica che è la scadenza o il giorno — aggiungere «📅 Altra data».
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — il filtro «Tutte» e la lista restano sotto le opzioni, spinti in basso: durante la scrittura la lista non serve — comprimere o oscurare la lista mentre si scrive; con la tastiera aperta le opzioni rischiano di essere coperte.

### attivita-abitudini__tel-light.png
- [gravità: media] attivita-abitudini__tel-light.png — riepilogo «0 di 3 oggi» con anello vuoto — in Oggi › Adesso la barra dice «1/2», qui «0 di 3»: due contatori diversi per «oggi» senza spiegare cosa contano — chiarire («abitudini fatte oggi» vs «priorità») e usare lo stesso indicatore.
- [gravità: media] attivita-abitudini__tel-light.png — cerchi di spunta grandi (44 px) a DESTRA, contorno verde o blu — nella lista Da fare il controllo sta a SINISTRA ed è un quadrato; in Senza orario un quadrato piccolo: tre controlli di completamento diversi nell'app — un solo componente casella, sempre nella stessa posizione.
- [gravità: bassa] attivita-abitudini__tel-light.png — anello vuoto grigio da 60 px a sinistra di «0 di 3» — enorme rispetto al valore, sembra un segnaposto rotto — anello più piccolo o barra; con 0 mostrare comunque il tracciato colorato.
- [gravità: bassa] attivita-abitudini__tel-light.png — «🔥3» solo su Camminata; Ripasso flashcard senza orario e senza serie — ok se dato, ma la riga meta di Ripasso è più corta e la card più bassa: card di altezze diverse — altezza minima uguale.
- [gravità: bassa] attivita-abitudini__tel-light.png — «Aggiungi» lilla attivo a campo vuoto — come altrove.

### attivita-abitudini-nuova__tel-light.png
- [gravità: media] attivita-abitudini-nuova__tel-light.png — riga «Giorni: Ogni giorno» con i cerchi L M M G V S D tutti vuoti — contraddizione: dice ogni giorno ma nessun giorno risulta scelto — con «Ogni giorno» mostrare tutti i cerchi selezionati (pieni), e il testo che si aggiorna in base alla selezione.
- [gravità: media] attivita-abitudini-nuova__tel-light.png — «Ora: Nessuno» — concordanza sbagliata (l'ora → «Nessuna»), e la pillola grigia sembra disattivata — «Nessuna ora» / «Aggiungi ora».
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — area «Salute & Sport» già scelta senza motivo — default arbitrario — nessuna area di default o l'ultima usata, segnalata.
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — pannello opzioni senza titolo né pulsante «Annulla»; «+ Aggiungi» lilla pallido con testo inserito — pulsante pieno quando attivo, link «Annulla» visibile.
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — cerchi dei giorni da ~40 px con bordo grigio chiaro, «M» ripetuto due volte senza distinzione — ok standard, ma servono etichette accessibili «martedì/mercoledì».

### scheda-attivita__tel-light.png
- [gravità: media] scheda-attivita__tel-light.png — gruppo «Pianifica»: chip «Ieri», «Domani», «Gio», «Tra una settimana», «Un altro giorno» — pianificare a «Ieri» non ha senso; «Gio» è un'abbreviazione isolata; manca «Oggi» (c'è il pulsante sopra ma con un'altra semantica) — «Oggi, Domani, Giovedì, Tra una settimana, Scegli data…».
- [gravità: media] scheda-attivita__tel-light.png — pulsante principale «◎ Prossimo passo in Oggi» — frase poco naturale e icona criptica — «Fai il prossimo passo oggi» o «Aggiungi a Oggi: Recuperare modulo 1».
- [gravità: media] scheda-attivita__tel-light.png — lista «Passi» — caselle quadrate da 42 px (verde piena per il passo fatto) molto più grandi del testo, cestino su ogni riga sempre visibile accanto all'icona calendario: riga affollata e rischio di eliminazioni accidentali — caselle 22 px, cestino nascosto dietro scorrimento o menu «⋯».
- [gravità: bassa] scheda-attivita__tel-light.png — «Distribuisci i passi» con chip in minuscolo «ogni giorno / ogni 2 giorni / ogni settimana» bianchi su grigio, mentre i chip di «Pianifica» sono grigi su bianco con maiuscola — due stili di chip nella stessa scheda — uniformare (maiuscola iniziale, stesso colore).
- [gravità: bassa] scheda-attivita__tel-light.png — «Aggiungi un passo…» + link «Aggiungi» a destra — terzo stile diverso di campo «aggiungi» nell'app — componente unico.
- [gravità: bassa] scheda-attivita__tel-light.png — allineamenti: titolo del foglio a 19 px dal bordo, etichette «Pianifica/Passi/Dettagli» a 23 px, chip a 19 px — margini sinistri leggermente diversi — una sola linea guida a 20 px.
- [gravità: bassa] scheda-attivita__tel-light.png — il foglio parte a ~85 px dall'alto ma non ha pulsante di chiusura né titolo fisso; a schermo quasi intero conviene «Chiudi» visibile.

### scheda-attivita-fondo__tel-light.png
- [gravità: media] scheda-attivita-fondo__tel-light.png — sotto il titolo fisso del foglio — il contenuto scorre sotto il titolo senza separatore: la riga del passo precedente è tagliata di netto (si vede un pezzo di casella) — linea sottile / ombra sotto l'intestazione fissa quando si scorre.
- [gravità: media] scheda-attivita-fondo__tel-light.png — gruppo «Dettagli»: «Area Studio / Università ˅», «Scadenza nessuna ›», «Fissa in alto no» — tre righe uguali con tre controlli diversi (tendina, chevron, testo nudo); «Fissa in alto: no» è un sì/no che dovrebbe essere un interruttore; valori in minuscolo — interruttore per «Fissa in alto», chevron uniforme per le scelte, «Nessuna» con maiuscola.
- [gravità: media] scheda-attivita-fondo__tel-light.png — riga «↶ Non completata ›» — l'attività non è completata: l'azione non ha senso o è scritta male (stato o comando?) — se serve: «Segna come non fatta», visibile solo quando è fatta.
- [gravità: bassa] scheda-attivita-fondo__tel-light.png — «Trasforma in abitudine ›» e «Elimina» nello stesso gruppo — azione distruttiva nello stesso riquadro di azioni normali — «Elimina» in un gruppo a sé, con conferma.

### scheda-abitudine__tel-light.png
- [gravità: alta] scheda-abitudine__tel-light.png — «Ora 06:00 PM» — 12 h accanto a «lun–ven · 18:00» del sottotitolo: due formati nella stessa scheda — 24 h.
- [gravità: media] scheda-abitudine__tel-light.png — pulsante «✓ Fatta» viola + «Salta oggi» — vedi incoerenza «Fatto» verde in Adesso.
- [gravità: bassa] scheda-abitudine__tel-light.png — «×» per togliere l'ora è qui FUORI dalla pillola, nella scheda dal calendario era DENTRO; «Durata» senza × — uniformare.
- [gravità: bassa] scheda-abitudine__tel-light.png — chip area «💚 Salute & Sport» verde chiaro qui, viola nelle altre schede/pillole — colore area incoerente — sempre colore dell'area.
- [gravità: media] scheda-abitudine__tel-light.png — mini calendario — manca il nome del mese; i giorni passati non fatti hanno cerchio grigio, i giorni non previsti (sabato/domenica) nessun cerchio, i giorni del mese precedente (27–31) grigi come i mancati: differenze troppo sottili, nessuna legenda — titolo «Agosto», giorni non fatti con contorno rosso tenue o puntino, giorni fuori mese in grigio chiaro senza cerchio.
- [gravità: bassa] scheda-abitudine__tel-light.png — statistiche «🔥3 di fila / 4 record / 7 in tutto» — «record» da solo è ambiguo — «record: 4 di fila», «7 volte in tutto».
- [gravità: bassa] scheda-abitudine__tel-light.png — «Quando»: cerchi L–V viola pieni e S, D bianchi; nella creazione dell'abitudine gli stessi cerchi sono grigi con bordo — stesso componente, stesso aspetto.

### scheda-abitudine-fondo__tel-light.png
- [gravità: alta] scheda-abitudine-fondo__tel-light.png — riga «Inizio 07/29/2026» — formato data americano MM/GG/AAAA in un'app italiana — «29 lug 2026» o «29/07/2026».
- [gravità: media] scheda-abitudine-fondo__tel-light.png — sotto il titolo fisso — il calendario scorre sotto il titolo senza separatore, i cerchi della riga superiore appaiono mozzati — ombra/linea sotto l'intestazione fissa.
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — pillole valore «Salute & Sport», «07/29/2026», «Mai» con larghezze diverse e testi viola, mentre «06:00 PM» è nero — allineare a destra con stessa larghezza minima e colore.
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — «Elimina» in una card grigia a tutta larghezza — ok separato, ma nella scheda attività «Elimina» è una riga allineata a sinistra con icona: stessa azione, due stili — unificare.

### andamento__tel-light.png
- [gravità: media] andamento__tel-light.png — card in alto «🔥 38» e «65% / 81 di 124» — numeri grandi senza etichetta: 38 cosa? 65% di cosa? — «38 giorni di fila», «65% fatte (81 di 124) negli ultimi 30 giorni».
- [gravità: bassa] andamento__tel-light.png — striscia giorni «M G V S D L M» — partire da mercoledì non è intuitivo e non c'è data; il giorno vuoto (V) è un quadrato grigio senza spiegazione — etichetta «Ultimi 7 giorni», giorno mancato con ✕ o contorno.
- [gravità: media] andamento__tel-light.png — heatmap «Costanza» — in blu, mentre la stessa informazione nella vista Anno è in verde; griglia allineata a sinistra che occupa solo ~55% della card, con un vuoto a destra; nessuna etichetta di mesi/giorni — un solo colore per «costanza» in tutta l'app, griglia a tutta larghezza, etichette mesi sopra e L/M/V a sinistra.
- [gravità: bassa] andamento__tel-light.png — titoli di sezione «Costanza», «Per area» in grassetto 20 px con icona — più grandi dei titoli delle altre schermate («Poi», «Importanti») — scala tipografica unica per i titoli di sezione.
- [gravità: bassa] andamento__tel-light.png — barre «Per area»: percentuale in grassetto + «4/8» in grigio piccolo attaccato — con 4/8 il 50% è poco significativo; la riga «Progetti Founder 100% 12/12» spunta sotto la tab bar — ordinare per importanza, padding inferiore.
- [gravità: bassa] andamento__tel-light.png — segmentato «Riepilogo / Scoperte» con icona pollice in su per Scoperte — icona fuorviante («mi piace») — lampadina o lente.

### andamento-fondo__tel-light.png
- [gravità: bassa] andamento-fondo__tel-light.png — lista «Archivio review / Sessioni del timer / Aree / Grafici» — «review» anglicismo; «Aree» duplica Profilo › Aree (due ingressi per la stessa pagina?); «Grafici» troppo generico — «Archivio dei bilanci», tenere «Aree» in un solo posto, «Tutti i grafici» con sottotitolo.
- [gravità: bassa] andamento-fondo__tel-light.png — «Archivio review 79» — il numero a destra è l'unico contatore della lista: le altre righe non hanno valore, la colonna destra è irregolare — sottotitoli descrittivi al posto dei numeri o numeri ovunque.
- [gravità: bassa] andamento-fondo__tel-light.png — barre «Per area»: il colore di «Lavoro» è il viola primario dell'app e «Altro / Esplorazione» rosso (colore di errore) — evitare rosso e viola primario come colori area.

### scoperte__tel-light.png
- [gravità: media] scoperte__tel-light.png — terzo livello di schede «Registro 8 / Esperimenti 2» sotto il segmentato «Riepilogo / Scoperte» e sopra la tab bar — ancora un segmentato con stile diverso (lilla pieno, senza contenitore): tre livelli di navigazione e tre stili — fondere: «Scoperte» con un filtro semplice, o usare lo stesso componente.
- [gravità: media] scoperte__tel-light.png — riquadri 42 px con 👍 verde / 👎 rosso a sinistra di ogni riga — sembrano pulsanti/caselle toccabili (stesso aspetto delle caselle di spunta) e ripetono l'informazione già data dall'intestazione «Funziona / Non funziona» — rimuoverli o ridurli a un'icona 16 px non incorniciata.
- [gravità: media] scoperte__tel-light.png — titoli che vanno a capo a ~60% («Mettere il telefono / in un'altra stanza») con vuoto a destra — stessa larghezza massima troppo stretta delle liste attività — titolo fino al chevron.
- [gravità: bassa] scoperte__tel-light.png — meta «misurato», «lo noto ogni volta», «notato una volta» — tre formulazioni diverse (participio, prima persona, participio) per lo stesso concetto di affidabilità — scala uniforme: «Misurato», «Notato spesso», «Notato una volta».
- [gravità: bassa] scoperte__tel-light.png — titoli di sezione «👍 Funziona 4» / «👎 Non funziona 4» piccoli e grigi — sotto la gerarchia delle card; ok, ma il contatore lilla è lo stesso dei badge di notifica — contatore in grigio.
- [gravità: bassa] scoperte__tel-light.png — fondo: righe che scorrono sotto la tab bar visibili nel margine inferiore.

### scoperte-esperimenti__tel-light.png
- [gravità: media] scoperte-esperimenti__tel-light.png — grafico dell'esperimento — le etichette «media 3,1» e «media 4,3» si sovrappongono ai punti e alla linea tratteggiata (leggibilità pessima); asse X senza date; i punti blu della fase «dopo» sono dello stesso colore della linea media — etichette fuori dall'area dati (a destra dell'asse o in legenda), sfondo bianco dietro l'etichetta, date sull'asse X.
- [gravità: media] scoperte-esperimenti__tel-light.png — riquadro conclusivo «…effetto grande (d≈3,1)» — gergo statistico (d di Cohen) incomprensibile per l'utente comune; testo tagliato sotto la tab bar — frase semplice («Con lo sport al mattino il focus è salito di 1,2 punti in media: differenza netta») e dettaglio tecnico in un «Dettagli».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» — sembrano pulsanti (bordo, sfondo bianco), minuscolo, testo tecnico — etichette senza bordo, «Concluso», «Misura: focus del check-in».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — testo introduttivo («Per prima cosa l'app misura…») sempre visibile sopra la lista — utile la prima volta, poi spreca spazio — comprimibile o «Come funziona?».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — «La modifica: Allenamento…» — maiuscola dopo i due punti, «La modifica» etichetta poco naturale — «Cosa cambi: allenamento o camminata…».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — titolo esperimento a capo presto («Fare sport al mattino / aumenta il mio focus?») — larghezza piena.

### scheda-scoperta__tel-light.png
- [gravità: alta] scheda-scoperta__tel-light.png — riga «Esito» — il primo pulsante è un rettangolo bianco VUOTO accanto a «👎 non funziona»: manca l'etichetta «👍 funziona» (forse è lo stato selezionato con testo bianco su bianco) — mostrare sempre etichetta e icona; stato selezionato con sfondo colorato e testo leggibile.
- [gravità: media] scheda-scoperta__tel-light.png — «🗑 Togli questa riga» — linguaggio da foglio di calcolo — «Elimina scoperta», con conferma.
- [gravità: bassa] scheda-scoperta__tel-light.png — «Evidenza» con «notato una volta / lo noto ogni volta / misurato» — «evidenza» è un calco dall'inglese (evidence); opzioni con forme verbali miste e minuscole — «Quanto ne sei sicuro?» con «Notato una volta / Notato spesso / Misurato».
- [gravità: bassa] scheda-scoperta__tel-light.png — «Scritta 20 lug» — «Aggiunta il 20 lug».
- [gravità: bassa] scheda-scoperta__tel-light.png — titolo «Una cosa che hai capito» generico e ripetuto da «Cosa hai capito» subito sotto — titolo = testo della scoperta, o «Scoperta».
- [gravità: bassa] scheda-scoperta__tel-light.png — area di testo con maniglia di ridimensionamento nativa — togliere.

### profilo__tel-light.png
- [gravità: media] profilo__tel-light.png — parte alta — la pagina Profilo non ha titolo né pulsante «Indietro/Chiudi», e nella tab bar nessuna scheda è selezionata: l'utente non sa dove si trova né come tornare — barra superiore «‹ Oggi · Profilo» o foglio modale con «Fine».
- [gravità: media] profilo__tel-light.png — statistiche «38 giorni / 109 fatte / 65% riuscita» — etichette mozze («riuscita» = tasso di riuscita?); in Andamento lo stesso 65% è «81 di 124», qui accanto a «109 fatte»: numeri che non tornano tra schermate — etichette complete e stessa base di calcolo («65% delle attività pianificate»).
- [gravità: media] profilo__tel-light.png — «Promemoria: bloccati» — stato critico (notifiche bloccate) scritto in grigio come un valore qualsiasi — mettere un avviso visibile (icona ⚠, colore arancio) e l'azione «Attiva le notifiche».
- [gravità: bassa] profilo__tel-light.png — avatar quadrato viola 64 px con «R» — stesso stile del pulsante «+»; la frase sotto il nome non si può modificare visibilmente — avatar circolare, matita «Modifica».
- [gravità: bassa] profilo__tel-light.png — due gruppi di righe senza intestazione («Aree/Sonno/Promemoria» e «Diario/Impostazioni») — criterio di raggruppamento non chiaro; «Diario» sembra fuori posto in Profilo — intestazioni o spostare Diario in Andamento.
- [gravità: bassa] profilo__tel-light.png — metà inferiore vuota — accettabile; ma «Aree» compare anche in Andamento in fondo: doppio ingresso.

### impostazioni__tel-light.png
- [gravità: media] impostazioni__tel-light.png — sezione «Account» contiene solo «Sincronizzazione: su questo dispositivo» — non è un account; il secondo gruppo (Area predefinita, Timer, Musica, Aspetto) non ha intestazione — «Sincronizzazione» in «Dati»; intestazione «Preferenze» per il secondo gruppo.
- [gravità: media] impostazioni__tel-light.png — valori a destra: «Automatica ˅» (tendina), «chiedi sempre ›», «nessuna ›», «automatico ›» — controlli misti, minuscole/maiuscole incoerenti («Automatica» vs «automatico») — tutte righe con chevron e valore con maiuscola iniziale.
- [gravità: bassa] impostazioni__tel-light.png — «Esporta dati», «Importa dati» senza chevron mentre «Backup e ripristino 1 ›» lo ha; «1» non spiega cosa sia (1 backup?) — «1 backup» o data dell'ultimo backup.
- [gravità: bassa] impostazioni__tel-light.png — «Guida › Scienza» — voce strana — «Le basi scientifiche» / «Perché funziona».
- [gravità: bassa] impostazioni__tel-light.png — foglio senza pulsante «Fine»/«Chiudi»; il titolo «Impostazioni» non è centrato né affiancato da un'azione — aggiungere «Fine» in alto a destra.

### impostazioni-fondo__tel-light.png
- [gravità: media] impostazioni-fondo__tel-light.png — gruppo «Guida»: «Registro tecnico» e «Design lab» — voci da sviluppatore esposte all'utente, «Design lab» in inglese — nasconderle (modalità sviluppatore) o spostarle in «Avanzate» con nomi italiani.
- [gravità: media] impostazioni-fondo__tel-light.png — «Cancella tutti i dati» — nessuna spiegazione delle conseguenze e solo testo rosso nella stessa card di «Rimuovi dati di esempio» — sottotitolo «Elimina tutto da questo dispositivo, non si può annullare» e conferma con digitazione; tenere separato dall'azione innocua.
- [gravità: bassa] impostazioni-fondo__tel-light.png — sotto il titolo fisso «Impostazioni» la riga «Aspetto» è tagliata di netto senza separatore — ombra/linea all'intestazione fissa.
- [gravità: bassa] impostazioni-fondo__tel-light.png — margine inferiore del foglio — l'ultima card arriva a ~25 px dal fondo senza safe-area — padding 32 px.

### imp-timer__tel-light.png
- [gravità: media] imp-timer__tel-light.png — valori come pillole viola («Chiedi sempre», «5 min», «25 min», «No») mentre nella pagina Impostazioni i valori sono testo grigio + chevron — stesso tipo di riga, due stili — uniformare (testo + chevron o pillole ovunque).
- [gravità: media] imp-timer__tel-light.png — «Avvio rapido: Durata 5 min / Poi continua per 25 min» e «Pomodoro: Pausa lunga ogni 4 — No» — non si capisce cosa siano «avvio rapido» e «sessione» né perché «ogni 4» abbia valore «No»; manca la durata della pausa lunga — sottotitoli esplicativi; «Pausa lunga dopo 4 cicli» con interruttore + durata.
- [gravità: bassa] imp-timer__tel-light.png — il foglio parte più in basso (~155 px) del foglio Impostazioni (~85 px): passando a una sotto-pagina il foglio «salta» di altezza — altezza costante per la navigazione dentro lo stesso foglio.
- [gravità: bassa] imp-timer__tel-light.png — «‹ Impostazioni» piccolo sopra il titolo — area di tocco ridotta (~13 px di testo) — pulsante indietro con area 44 px, sulla stessa riga del titolo.

### imp-musica__tel-light.png
- [gravità: media] imp-musica__tel-light.png — campi «Incolla il link» — non si dice di quale servizio (Spotify? YouTube?) né cosa succede; 9 campi identici di fila senza esempio — testo introduttivo («Incolla un link di Spotify, Apple Music o YouTube: si apre quando avvii il timer») e segnaposto con esempio.
- [gravità: media] imp-musica__tel-light.png — campi di testo bianchi senza bordo su card grigio chiarissimo — contrasto bassissimo, quasi invisibili come campi — bordo 1 px o sfondo più scuro della card.
- [gravità: bassa] imp-musica__tel-light.png — la card «Predefinita» attacca subito sotto il titolo «Musica» (~10 px) mentre in Timer c'è un'etichetta di sezione — aggiungere l'intestazione «Generale» e 16 px.
- [gravità: bassa] imp-musica__tel-light.png — interruttore «Apri all'avvio del timer» spento: traccia grigio chiarissimo quasi invisibile sul grigio della card — traccia più scura (contrasto 3:1).
- [gravità: bassa] imp-musica__tel-light.png — altezza del foglio diversa da Timer e Aspetto (85 px vs 155 vs 455): il foglio cambia altezza a ogni sotto-pagina — altezza fissa.

### imp-aspetto__tel-light.png
- [gravità: bassa] imp-aspetto__tel-light.png — «Suoni», «Vibrazione» dentro «Aspetto» — non sono aspetto — sezione «Suoni e vibrazione» o rinominare «Aspetto e feedback».
- [gravità: bassa] imp-aspetto__tel-light.png — interruttori verdi (stile iOS) mentre il colore d'azione dell'app è viola — ok per iOS ma in Musica l'interruttore spento è quasi invisibile: rivedere entrambi gli stati.
- [gravità: bassa] imp-aspetto__tel-light.png — etichetta «Tema» dentro la stessa card degli interruttori, con il segmentato annidato in un altro riquadro con bordo — riquadro dentro riquadro — segmentato direttamente nella card, senza contorno extra.

### aree__tel-light.png
- [gravità: media] aree__tel-light.png — ogni riga ha cestino + interruttore — non si spiega cosa faccia l'interruttore (attiva/nasconde l'area?) e il cestino sempre visibile accanto rischia tocchi accidentali (eliminare un'area con 28 attività) — sottotitolo «Attiva = compare nelle scelte»; eliminazione dentro la scheda dell'area con conferma.
- [gravità: media] aree__tel-light.png — righe non toccabili (nessun chevron) — non si può rinominare, cambiare colore/icona o riordinare — rendere la riga apribile per modificare; maniglia per riordinare.
- [gravità: bassa] aree__tel-light.png — titolo «Le tue aree» mentre in Profilo la voce è «Aree» e in Impostazioni «Area predefinita» — ok, ma i fogli fratelli usano titoli uguali alla voce («Sonno e pasti», «Timer»): uniformare («Aree»).
- [gravità: bassa] aree__tel-light.png — «Nuova area»: campo «Nome» con icona libro grigia e «Aggiungi» testuale — manca scelta di colore/icona; l'icona libro predefinita sembra già scelta — icona «+» neutra, scelta colore dopo l'inserimento.
- [gravità: bassa] aree__tel-light.png — foglio senza «Fine»/chiusura esplicita.

### sonno-pasti__tel-light.png
- [gravità: alta] sonno-pasti__tel-light.png — tutti gli orari «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «05:00 AM – 02:00 PM» — formato 12 h — 24 h.
- [gravità: media] sonno-pasti__tel-light.png — confronto con il pannello sonno-pasti dentro La giornata — stessi dati modificati con due interfacce diverse (qui pillole personalizzate e «×», là input nativi, select troncati e cestini) — un solo componente, riusato in entrambi i punti.
- [gravità: media] sonno-pasti__tel-light.png — «Promemoria nell'app → Sonno → Tra le 05:00 AM – 02:00 PM» — non si capisce cosa sia questa finestra (quando ti chiede come hai dormito?) — «Chiedimi come ho dormito tra le 05:00 e le 14:00».
- [gravità: bassa] sonno-pasti__tel-light.png — «Durata 8h» in grigio come se fosse disattivato — è calcolata: «8 h» con nota «calcolata».
- [gravità: bassa] sonno-pasti__tel-light.png — «Tra le» rientrato rispetto alle altre etichette (sotto-opzione) — ok, ma con testo più piccolo e grigio sembra disattivato — usare stessa dimensione.

### promemoria__tel-light.png
- [gravità: alta] promemoria__tel-light.png — avviso «Bloccati» in cima e sotto tutti gli interruttori verdi ACCESI — l'interfaccia dice che i promemoria sono attivi mentre non possono arrivare; l'avviso è grigio neutro come una card qualunque — avviso arancione/giallo con icona ⚠ e pulsante «Come riattivarle», interruttori mostrati come inattivi (opacità) finché il permesso manca.
- [gravità: alta] promemoria__tel-light.png — orari «08:30 AM», «01:00 PM», «04:30 PM», «09:30 PM», «11:00 PM – 07:00 AM» — 12 h — 24 h.
- [gravità: media] promemoria__tel-light.png — nomi dei promemoria («Piano del mattino», «Priorità del giorno», «Chiusura della giornata») diversi dai nomi dei rituali («Piano del giorno», «Review della sera») — stessi nomi ovunque.
- [gravità: bassa] promemoria__tel-light.png — «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» — frase contorta e tecnica — «Per riceverle, consenti le notifiche a questo sito nelle impostazioni del browser».
- [gravità: bassa] promemoria__tel-light.png — riga «Server · da collegare» in fondo — termine tecnico senza spiegazione — «Notifiche anche ad app chiusa · Configura».
- [gravità: bassa] promemoria__tel-light.png — «Chiusura della giornata» va a capo su due righe e la riga diventa più alta delle altre — accorciare («Fine giornata»).

### diario__tel-light.png
- [gravità: media] diario__tel-light.png — pagina intera con «‹ Profilo», mentre Aree, Sonno e pasti, Promemoria, Impostazioni si aprono come fogli: voci sorelle con due modelli di navigazione; nella tab bar è evidenziata «Andamento» anche se si arriva da Profilo — tutte come fogli o tutte come pagine; scheda attiva coerente.
- [gravità: media] diario__tel-light.png — pulsante quadrato «↶» grande su OGNI riga — azione «annulla» ripetuta e molto visibile (più del contenuto), senza etichetta — spostarla in un menu a scorrimento o al tocco sulla riga; se resta, icona piccola senza riquadro.
- [gravità: media] diario__tel-light.png — dentro la voce «Completata · Organizzare cena…» un menu a tendina nativo «Relazioni & Sociale» — controllo di modifica dentro un registro, stile di sistema — mostrare l'area come etichetta; modifica al tocco.
- [gravità: bassa] diario__tel-light.png — «Annotato · …» ripetuto su 6 righe — rumore; il verbo in grassetto non distingue — raggruppare («6 note») o icona sola.
- [gravità: bassa] diario__tel-light.png — testi delle voci a capo a ~60% della larghezza perché il pulsante ↶ e l'orario occupano la destra — orario sopra o sotto, testo a tutta larghezza.
- [gravità: bassa] diario__tel-light.png — segmentato «Cose importanti / Tutto» — ancora un'altra variante del segmentato (contenitore grigio con bordo, a sinistra, non a tutta larghezza) — componente unico.
- [gravità: bassa] diario__tel-light.png — «Check-in · energia 4 · focus 5 · umore 5» — nel check-in le domande erano «energia / concentrarti / come ti senti»: qui «focus» e «umore» — stessi termini.

### timer-scelta__tel-light.png
- [gravità: bassa] timer-scelta__tel-light.png — icone dentro riquadri bianchi con bordo (42 px) a sinistra di ogni riga — riquadro dentro riga dentro card: sembrano caselle di spunta — icone libere, 20 px, colore primario.
- [gravità: bassa] timer-scelta__tel-light.png — «Pomodoro» con icona ↻ — è la stessa icona delle abitudini: significato doppio — icona pomodoro/cicli diversa.
- [gravità: bassa] timer-scelta__tel-light.png — «Avvio rapido 5 min» — non dice che poi continua per 25 min (come impostato) — sottotitolo «5 min per iniziare, poi 25».
- [gravità: bassa] timer-scelta__tel-light.png — «nessun limite» minuscolo, «25 + 5 min» — uniformare («Senza limite», «25 + 5 min»).
- [gravità: bassa] timer-scelta__tel-light.png — foglio senza «Annulla» e con margine inferiore ~25 px — padding/safe-area.

### timer-concentrazione__tel-light.png
- [gravità: media] timer-concentrazione__tel-light.png — «⏸ Termina» — icona di pausa per un'azione di fine; e manca un vero «Pausa» — «⏸ Pausa» e «⏹ Termina» separati.
- [gravità: media] timer-concentrazione__tel-light.png — anello di avanzamento a forma di quadrato arrotondato, grigio scurissimo su nero — contrasto troppo basso, a 25:00 non si capisce che sia un indicatore — tracciato più chiaro, forma circolare (convenzione), avanzamento colorato.
- [gravità: bassa] timer-concentrazione__tel-light.png — schermo sempre scuro anche col tema chiaro — se voluto (modalità focus) ok, ma la × in alto a destra è grigio su grigio scuro, poco visibile — contrasto maggiore.
- [gravità: bassa] timer-concentrazione__tel-light.png — «Pomodoro · blocco 1» e «restano» — «blocco» ambiguo (blocco del calendario?) — «Ciclo 1 di 4», «rimanenti».
- [gravità: bassa] timer-concentrazione__tel-light.png — terzo inferiore vuoto, contenuto spostato in alto; «Termina» e «Cambia timer» testi grigi piccoli — centrare verticalmente il blocco, azioni secondarie come pulsanti con area 44 px.

### cattura__tel-light.png
- [gravità: media] cattura__tel-light.png — popup «Scrivi un pensiero…» — seconda riga occupata solo da «Chiudi» piccolo a destra: spreco di spazio e due azioni in posti diversi; non dice dove finisce il pensiero (Da sistemare?) — «Annulla» e «Salva» sulla stessa riga, sottotitolo «Finisce in Da sistemare».
- [gravità: bassa] cattura__tel-light.png — pulsante «Salva» viola pieno attivo con campo vuoto — disattivato finché non si scrive.
- [gravità: bassa] cattura__tel-light.png — popup ancorato in alto con sfocatura forte di tutta la pagina — su telefono la tastiera coprirà la metà bassa: va bene in alto, ma il riquadro galleggiante con 16 px di margine e angoli 20 px è diverso da tutti gli altri fogli (che salgono dal basso) — coerenza: foglio dal basso agganciato alla tastiera.
- [gravità: bassa] cattura__tel-light.png — icona fulmine viola a sinistra — significato poco chiaro — rimuovere o usare icona «nota».

### menu-oggi-avatar__tel-light.png
- [gravità: media] menu-oggi-avatar__tel-light.png — il tocco sull'avatar porta direttamente alla pagina Profilo (identica a profilo__tel-light.png) senza transizione evidente, senza titolo e senza modo visibile di tornare; nessuna scheda della tab bar è attiva — intestazione con «‹» / «Fine», o presentare come foglio modale. Valgono i difetti di profilo__tel-light.png.

### trascinamento-in-corso__tel-light.png
- [gravità: alta] trascinamento-in-corso__tel-light.png — blocco «Pranzo» — durante il trascinamento la pressione lunga SELEZIONA il testo («Pranzo» evidenziato in blu come testo selezionato) e non si vede alcun blocco che si muove, nessuna ombra, nessuna anteprima dell'orario — user-select: none sui blocchi, touch-action adeguato, blocco sollevato (ombra + scala) e orario di destinazione mostrato durante il trascinamento.
- [gravità: alta] trascinamento-in-corso__tel-light.png — tab bar in basso — il pulsante «+» esce dal bordo destro dello schermo (tagliato) e la barra è spostata — barra ancorata con margini simmetrici 16 px.
- [gravità: media] trascinamento-in-corso__tel-light.png — in alto — il segmentato «Adesso / La giornata / Rituali» è tagliato a metà dal bordo superiore (pagina scorsa di ~40 px durante il trascinamento) — bloccare lo scorrimento della pagina mentre si trascina, o rendere fissa l'intestazione.

## Tema scuro

### oggi-adesso__tel-dark.png
- [gravità: media] oggi-adesso__tel-dark.png — segmentato in alto — la pillola selezionata «Adesso» è quasi dello stesso nero del contenitore: lo stato selezionato si distingue solo dal testo bianco — pillola selezionata più chiara (es. #2C2C30) o con bordo.
- [gravità: bassa] oggi-adesso__tel-dark.png — badge «1» su Rituali — viola scuro su grigio scuro con cifra chiara piccola: poco contrasto e diverso dal badge «6» (viola chiaro) in basso — stesso colore per tutti i badge.
- [gravità: bassa] oggi-adesso__tel-dark.png — riquadro icona di «Pianifica la giornata» — marrone/oliva fangoso, e pastiglia «🔥38» marrone scuro: colori «sporchi» nella conversione scura — usare tinte con trasparenza sul colore base (giallo 15%, arancio 15%) invece di marroni.
- [gravità: bassa] oggi-adesso__tel-dark.png — avatar «R» e «+» lilla chiaro con testo nero — nel tema chiaro erano viola con testo bianco: va bene come adattamento, ma restano identici fra loro (avatar = pulsante d'azione) — vedi tema chiaro.
- [gravità: bassa] oggi-adesso__tel-dark.png — casella di «Confrontare piani telefonici» grigio su grigio — bordo poco visibile — bordo più chiaro (contrasto 3:1).
- Valgono inoltre tutti i difetti di oggi-adesso__tel-light.png (doppia navigazione, 1/2 senza etichetta, stili Timer/Salta oggi).

### oggi-adesso-scorsa__tel-dark.png
- [gravità: bassa] oggi-adesso-scorsa__tel-dark.png — identica alla non scorsa: la cattura non aggiunge informazione — stessi difetti di oggi-adesso__tel-dark.png.

### giornata-giorno__tel-dark.png
- [gravità: alta] giornata-giorno__tel-dark.png — fondo — tab bar tagliata a metà fuori schermo, come nel chiaro.
- [gravità: media] giornata-giorno__tel-dark.png — griglia delle ore — linee orizzontali quasi invisibili (grigio #2a su #1c); separare le ore è difficile — linee a contrasto ~1.5:1 almeno.
- [gravità: media] giornata-giorno__tel-dark.png — blocco «Confrontare piani telefonici» marrone-oliva e barra rosa diventata bordeaux scuro — i colori area perdono identità e sembrano sporchi — tinte area al 20–25% su fondo scuro con barra laterale nel colore pieno saturo.
- [gravità: bassa] giornata-giorno__tel-dark.png — testo barrato di «Organizzare cena…» grigio medio su grigio scuro — contrasto < 3:1 — grigio più chiaro.
- [gravità: bassa] giornata-giorno__tel-dark.png — selezione «Giorno» viola scuro con testo viola: contrasto basso — testo bianco o lilla chiaro.
- [gravità: bassa] giornata-giorno__tel-dark.png — fascia tratteggiata del sonno a righe grigio scuro, appena percepibile — etichetta «Sonno» leggibile.

### giornata-giorno-fondo__tel-dark.png
- [gravità: alta] giornata-giorno-fondo__tel-dark.png — fondo — tab bar tagliata.
- [gravità: media] giornata-giorno-fondo__tel-dark.png — blocchi abitudine con contorno verde scuro e icona ↻ verde scuro su fondo nero — contrasto basso, contorno quasi invisibile — verde più luminoso (#4ADE80) per contorno e icona.
- [gravità: bassa] giornata-giorno-fondo__tel-dark.png — card «Ripasso flashcard» senza orario e campo «Nuova attività…» — il campo ha un bordo, la card no: due superfici grigio scuro simili ma con trattamento diverso — uniformare.
- [gravità: bassa] giornata-giorno-fondo__tel-dark.png — pulsante «+ Aggiungi» grigio-viola scuro, sembra disattivato — viola pieno quando attivo.

### giornata-settimana__tel-dark.png
- [gravità: media] giornata-settimana__tel-dark.png — intestazione fissa (striscia L–D) — la card sottostante scorre e viene tagliata di netto sotto la striscia, senza separatore — come nel chiaro: sfondo + linea/ombra all'intestazione fissa.
- [gravità: bassa] giornata-settimana__tel-dark.png — ↻ verde scuro e ↻ blu, orari grigi — contrasto basso dell'icona verde su #1c — verde più chiaro.
- [gravità: bassa] giornata-settimana__tel-dark.png — contenuto visibile sotto la tab bar flottante («18:00 Camminata…») — sfumatura nera sotto la barra.
- Valgono i difetti di contenuto di giornata-settimana__tel-light.png (abitudini ripetute ogni giorno, codice colori non spiegato).

### giornata-mese__tel-dark.png
- [gravità: bassa] giornata-mese__tel-dark.png — pallini area sotto i giorni (viola, blu, bordeaux) — su fondo scuro diventano quasi invisibili (3–4 px, colori scuri) — pallini più grandi e colori schiariti.
- [gravità: bassa] giornata-mese__tel-dark.png — cella di oggi (18): quadrato grigio + cerchio lilla con testo scuro + arco verde + pallino — troppi segni, come nel chiaro.
- [gravità: bassa] giornata-mese__tel-dark.png — quadratini indicatori della lista «Oggi» (verde scuro e blu a contorno) poco visibili e ancora simili a caselle — vedi chiaro.
- [gravità: bassa] giornata-mese__tel-dark.png — testo barrato «Organizzare cena con il gruppo» grigio su grigio scuro — contrasto insufficiente.

### giornata-anno__tel-dark.png
- [gravità: media] giornata-anno__tel-dark.png — quadratini vuoti della heatmap grigio #2a su card #1e — differenza appena percettibile; i mesi futuri e passati vuoti si confondono — aumentare la differenza o mostrare i giorni futuri con solo contorno.
- [gravità: bassa] giornata-anno__tel-dark.png — numeri verdi «7», «25», «17» verde scuro su nero — contrasto basso — verde chiaro.
- [gravità: bassa] giornata-anno__tel-dark.png — card «Scadenze» con bordo chiaro visibile, le card mese senza bordo — incoerenza di superfici nel tema scuro — stesso trattamento.
- [gravità: bassa] giornata-anno__tel-dark.png — icona valigetta viola a destra di «Trovare lavoro per agosto» — vedi chiaro.

### giornata-sonno-aperto__tel-dark.png
- [gravità: media] giornata-sonno-aperto__tel-dark.png — intera schermata — il pannello sonno e pasti NON è visibile: si vede solo il calendario scorso (07:00–21:00). O il pannello non si è aperto nel tema scuro, o lo scorrimento lo ha portato fuori vista — verificare l'apertura nel tema scuro; quando il pannello si apre, scorrere in modo che resti visibile.
- [gravità: alta] giornata-sonno-aperto__tel-dark.png — fondo — tab bar tagliata a metà.
- [gravità: bassa] giornata-sonno-aperto__tel-dark.png — linee delle ore quasi invisibili, colori area fangosi (vedi giornata-giorno__tel-dark.png).

### giornata-scheda-blocco__tel-dark.png
- [gravità: media] giornata-scheda-blocco__tel-dark.png — bordo superiore del foglio — il foglio (#1e) è quasi dello stesso tono dello sfondo oscurato: il limite si legge solo dal sottile bordo — sfondo del foglio più chiaro (#232326) o oscuramento più forte.
- [gravità: alta] giornata-scheda-blocco__tel-dark.png — «09:30 AM» — 12 h.
- [gravità: bassa] giornata-scheda-blocco__tel-dark.png — «× » nelle pillole: cerchio grigio con × scura, contrasto basso — × chiara.
- Valgono gli altri difetti di giornata-scheda-blocco__tel-light.png (titolo a capo presto, stato «fatta» non mostrato, «Sposta in Da fare»).

### giornata-scheda-abitudine__tel-dark.png
- [gravità: alta] giornata-scheda-abitudine__tel-dark.png — «06:00 PM» — 12 h.
- [gravità: bassa] giornata-scheda-abitudine__tel-dark.png — «Fatta» lilla con testo scuro — buon contrasto, ma nella schermata Adesso scura «Fatto» è verde con testo bianco: incoerenza come nel chiaro.
- [gravità: bassa] giornata-scheda-abitudine__tel-dark.png — azioni «Togli solo da oggi / Finisce qui / Apri l'abitudine» tutte lilla: nessuna distinzione per l'azione definitiva — vedi chiaro.

### rituali__tel-dark.png
- [gravità: bassa] rituali__tel-dark.png — riquadri icona dei rituali non attivi — blu-notte su grigio scuro, quasi invisibili, mentre il primo è lilla pieno — contrasto più alto o tinta coerente.
- [gravità: bassa] rituali__tel-dark.png — stati «da fare / 2 di 3 scelte» grigi piccoli — contrasto limite — grigio più chiaro, testo 13 px.
- Valgono i difetti di testo di rituali__tel-light.png («Review della…», stati contraddittori, metà schermo vuota).

### rituale-piano__tel-dark.png
- [gravità: bassa] rituale-piano__tel-dark.png — riga barrata «Organizzare cena con il gruppo» grigio scuro su grigio scuro — quasi illeggibile — grigio più chiaro.
- [gravità: bassa] rituale-piano__tel-dark.png — campi «Aggiungi un'altra…» e «Es. alle 9:00…» grigio scuro su card grigio scuro: confini poco visibili — bordo 1 px.
- [gravità: bassa] rituale-piano__tel-dark.png — pillola «☆ Priorità» viola scuro con testo lilla — contrasto basso; icone area (persone rosa, carta gialla) piccole — vedi chiaro.
- Valgono i difetti di rituale-piano__tel-light.png.

### rituale-sonno-pasti__tel-dark.png
- [gravità: alta] rituale-sonno-pasti__tel-dark.png — «Come sempre · 23:30–07:30» e sotto «11:30 PM / 07:30 AM» — doppio formato orario.
- [gravità: media] rituale-sonno-pasti__tel-dark.png — pulsanti «sì / no / ⏰» grigio scuro su card grigio scuro, senza bordo — sembrano disattivati, nessuno stato selezionato — bordo o fondo più chiaro, selezione colorata.
- [gravità: media] rituale-sonno-pasti__tel-dark.png — pulsante «Salva» grigio-viola scuro accanto a «Non ricordo» + pulsante principale lilla in fondo coperto dalla tab bar — due salvataggi, vedi chiaro.
- [gravità: bassa] rituale-sonno-pasti__tel-dark.png — sotto la tab bar si vede la riga di «Check-in» — padding inferiore.

### rituale-checkin__tel-dark.png
- [gravità: media] rituale-checkin__tel-dark.png — «fatto» ma nessun valore evidenziato; «Registra» viola scuro opaco, sembra disattivato — vedi chiaro.
- [gravità: bassa] rituale-checkin__tel-dark.png — legende di scala («1 · esausto», «5 · concentratissimo») grigio scuro 11 px — contrasto basso — grigio più chiaro, 12 px.
- [gravità: media] rituale-checkin__tel-dark.png — «Media recente 4.3» — punto decimale inglese.

### rituale-sera__tel-dark.png
- [gravità: alta] rituale-sera__tel-dark.png — nomi aree troncati senza puntini («Relazioni & Soc», «Studio / Univer», «Progetti Found», «Altro / Esploraz») — vedi chiaro.
- [gravità: alta] rituale-sera__tel-dark.png — nessuna domanda/legenda per la scala 1–5 — vedi chiaro.
- [gravità: bassa] rituale-sera__tel-dark.png — 40 pulsanti grigio scuro senza bordo: in scuro i bordi delle celle si fondono e la griglia diventa una massa uniforme — bordo o spaziatura maggiore.

### rituale-settimana__tel-dark.png
- [gravità: media] rituale-settimana__tel-dark.png — numeri «216 / 10 / 6/7» in carattere con grazie, colonne non centrate — vedi chiaro.
- [gravità: bassa] rituale-settimana__tel-dark.png — aree di testo grigio scuro con maniglia di ridimensionamento chiara, bordi quasi invisibili — bordo 1 px e niente maniglia.
- [gravità: bassa] rituale-settimana__tel-dark.png — domande senza «?», ultima tagliata dalla tab bar — vedi chiaro.

### attivita-sistemare__tel-dark.png
- [gravità: bassa] attivita-sistemare__tel-dark.png — elenco «In coda» grigio medio su nero senza riquadro — ancora meno riconoscibile come toccabile che nel chiaro — righe in card con chevron.
- [gravità: bassa] attivita-sistemare__tel-dark.png — badge «6 / 9 / 3» grigio-viola scuro sul segmentato e «6» lilla chiaro in basso — due colori di badge — uno solo.
- [gravità: bassa] attivita-sistemare__tel-dark.png — select nativo «Altro / Esplorazione» con freccia di sistema nera su fondo scuro (freccia poco visibile) — componente custom.
- Valgono i difetti di attivita-sistemare__tel-light.png.

### attivita-dafare__tel-dark.png
- [gravità: alta] attivita-dafare__tel-dark.png — quadrati con ◎ a sinistra che sembrano caselle — vedi chiaro; in scuro il primo (lilla pieno) sembra «spuntato».
- [gravità: bassa] attivita-dafare__tel-dark.png — icone area colorate scure (blu, viola) su fondo scuro quasi invisibili — schiarire.
- [gravità: bassa] attivita-dafare__tel-dark.png — le card nel tema scuro hanno un bordo chiaro, nel chiaro no — scelta accettabile, ma il bordo + sfondo + divisori creano molte linee — tenere solo sfondo più chiaro.

### attivita-dafare-aggiunta__tel-dark.png
- [gravità: media] attivita-dafare-aggiunta__tel-dark.png — opzioni rientrate rispetto al campo, «+ Aggiungi» grigio scuro che sembra disattivato mentre il testo è scritto — vedi chiaro.
- [gravità: bassa] attivita-dafare-aggiunta__tel-dark.png — select nativo «Altro / Esplorazione» con freccia nera quasi invisibile su fondo scuro.

### attivita-abitudini__tel-dark.png
- [gravità: media] attivita-abitudini__tel-dark.png — cerchi di spunta verde scuro (#15803d circa) e blu scuro su card scura — contrasto basso, sembrano spenti — tinte più chiare nel tema scuro.
- [gravità: bassa] attivita-abitudini__tel-dark.png — anello «0 di 3» grigio scuro su nero, quasi invisibile — tracciato più chiaro.
- [gravità: bassa] attivita-abitudini__tel-dark.png — icone area verdi/blu piccole e scure accanto a «Salute & Sport» — schiarire.

### attivita-abitudini-nuova__tel-dark.png
- [gravità: media] attivita-abitudini-nuova__tel-dark.png — «Ogni giorno» con cerchi L–D vuoti; «Ora: Nessuno» — vedi chiaro.
- [gravità: bassa] attivita-abitudini-nuova__tel-dark.png — cerchi dei giorni: bordo grigio scuro e lettere grigie — contrasto basso, sembrano disattivati — bordo e testo più chiari.
- [gravità: bassa] attivita-abitudini-nuova__tel-dark.png — pillola «Nessuno» grigia con testo grigio: aspetto disattivato.

### scheda-attivita__tel-dark.png
- [gravità: media] scheda-attivita__tel-dark.png — chip «Ieri / Domani / Gio…» e «ogni giorno…» grigio scuro su foglio grigio scuro senza bordo — si confondono col fondo — bordo o sfondo più chiaro.
- [gravità: bassa] scheda-attivita__tel-dark.png — caselle dei passi non fatti: quadrati neri con bordo scuro — quasi invisibili — bordo grigio chiaro.
- [gravità: bassa] scheda-attivita__tel-dark.png — passo fatto barrato grigio scuro — contrasto basso.
- Valgono i difetti di testo di scheda-attivita__tel-light.png («Ieri», «Gio», «Prossimo passo in Oggi»).

### scheda-attivita-fondo__tel-dark.png
- [gravità: media] scheda-attivita-fondo__tel-dark.png — contenuto che scorre sotto il titolo fisso senza separatore (casella del passo mozzata in alto) — vedi chiaro.
- [gravità: media] scheda-attivita-fondo__tel-dark.png — «Area ˅ / Scadenza nessuna › / Fissa in alto no», «Non completata ›» — vedi chiaro.
- [gravità: bassa] scheda-attivita-fondo__tel-dark.png — valori «nessuna», «no» grigio scuro — contrasto basso.

### scheda-abitudine__tel-dark.png
- [gravità: alta] scheda-abitudine__tel-dark.png — «06:00 PM» vs «lun–ven · 18:00» — doppio formato.
- [gravità: bassa] scheda-abitudine__tel-dark.png — a destra del titolo «Camminata / movimento», all'altezza di y≈158, si intravede una sottile linea tratteggiata che sporge dal bordo destro — residuo di un elemento sottostante che trapela dal foglio — verificare overflow/z-index.
- [gravità: bassa] scheda-abitudine__tel-dark.png — giorni passati non fatti (cerchi grigio scuro) e giorni fuori programma (senza cerchio) — differenza quasi impercettibile nel tema scuro — vedi chiaro.
- [gravità: bassa] scheda-abitudine__tel-dark.png — cerchi S/D: neri con bordo scuro, quasi invisibili — bordo più chiaro.

### scheda-abitudine-fondo__tel-dark.png
- [gravità: alta] scheda-abitudine-fondo__tel-dark.png — «Inizio 07/29/2026» — data in formato americano.
- [gravità: bassa] scheda-abitudine-fondo__tel-dark.png — calendario tagliato sotto il titolo fisso senza separatore; anche qui la riga tratteggiata residua a destra del titolo — vedi sopra.
- [gravità: bassa] scheda-abitudine-fondo__tel-dark.png — «Elimina» rosa su card grigio scuro — leggibile, ma diverso dal rosso di «Elimina» della scheda attività — un solo rosso per le azioni distruttive.

### andamento__tel-dark.png
- [gravità: bassa] andamento__tel-dark.png — heatmap «Costanza» — in scuro la scala si inverte (più = azzurro chiaro), nel chiaro più = blu scuro: va bene come adattamento, ma le celle vuote grigio scurissimo quasi non si vedono — celle vuote più chiare.
- [gravità: bassa] andamento__tel-dark.png — barra di «Salute & Sport» verde scuro su traccia scura — contrasto basso rispetto alle altre barre — schiarire.
- [gravità: bassa] andamento__tel-dark.png — quadrato vuoto «V» nella striscia della settimana — grigio scuro su card scura, si confonde — contorno.
- Valgono i difetti di andamento__tel-light.png (numeri senza etichetta, heatmap che non riempie la card, blu vs verde).

### andamento-fondo__tel-dark.png
- [gravità: bassa] andamento-fondo__tel-dark.png — «Archivio review», «Aree» duplicato, «Grafici» — vedi chiaro.
- [gravità: bassa] andamento-fondo__tel-dark.png — barra «Lavoro» lilla = colore primario delle azioni; «Altro / Esplorazione» rosso salmone = colore errore — colori area da rivedere.

### scoperte__tel-dark.png
- [gravità: media] scoperte__tel-dark.png — riquadri 👍/👎 con bordo verde/rosso scuro a sinistra — sembrano pulsanti; sono ridondanti con l'intestazione — vedi chiaro.
- [gravità: bassa] scoperte__tel-dark.png — segmentato «Registro / Esperimenti» viola scuro su nero con testo lilla — contrasto basso; terzo livello di schede — vedi chiaro.
- [gravità: bassa] scoperte__tel-dark.png — meta «lo noto ogni volta», «misurato» grigio scuro 11 px — contrasto basso.

### scoperte-esperimenti__tel-dark.png
- [gravità: media] scoperte-esperimenti__tel-dark.png — grafico: etichette «media 3,1» / «media 4,3» sovrapposte ai punti; punti grigi della fase «prima» grigio su grigio scuro, quasi invisibili; asse senza date — vedi chiaro, più punti chiari.
- [gravità: media] scoperte-esperimenti__tel-dark.png — riquadro con «d≈3,1» coperto dalla tab bar — vedi chiaro.
- [gravità: bassa] scoperte-esperimenti__tel-dark.png — area «Dopo la modifica» con fondo blu-notte appena distinguibile dal resto — ok, ma la linea che separa le fasi manca — linea verticale di separazione.

### scheda-scoperta__tel-dark.png
- [gravità: alta] scheda-scoperta__tel-dark.png — «Esito»: il pulsante selezionato «👍 funziona» ha testo e icona grigio scurissimo su fondo scuro (quasi invisibile), mentre l'opzione NON selezionata «non funziona» è chiara e leggibile — lo stato selezionato è reso al contrario (conferma del bug visto nel chiaro, dove il pulsante sembrava vuoto) — selezione con fondo verde/primario e testo a contrasto pieno.
- [gravità: bassa] scheda-scoperta__tel-dark.png — area di testo con maniglia di ridimensionamento; «Togli questa riga»; «Evidenza» — vedi chiaro.

### profilo__tel-dark.png
- [gravità: media] profilo__tel-dark.png — nessun titolo né «indietro», nessuna scheda attiva nella tab bar — vedi chiaro.
- [gravità: media] profilo__tel-dark.png — «Promemoria: bloccati» grigio come un valore qualsiasi — vedi chiaro.
- [gravità: bassa] profilo__tel-dark.png — avatar lilla con «R» nera — identico al «+» in basso — vedi chiaro.

### impostazioni__tel-dark.png
- [gravità: bassa] impostazioni__tel-dark.png — divisori fra le righe delle card quasi invisibili (nel chiaro ci sono) — le righe si fondono in un blocco unico — divisori con contrasto ~1.3:1.
- [gravità: bassa] impostazioni__tel-dark.png — sfondo oscurato dietro il foglio poco scurito: «Raffaele» resta molto visibile e il foglio ha lo stesso tono — oscuramento più forte (60%) o foglio più chiaro.
- Valgono i difetti di impostazioni__tel-light.png («Account» con sola sincronizzazione, valori misti, minuscole).

### impostazioni-fondo__tel-dark.png
- [gravità: media] impostazioni-fondo__tel-dark.png — «Registro tecnico», «Design lab», «Cancella tutti i dati» senza spiegazione — vedi chiaro.
- [gravità: bassa] impostazioni-fondo__tel-dark.png — riga «Aspetto» tagliata sotto il titolo fisso senza separatore.

### imp-timer__tel-dark.png
- [gravità: bassa] imp-timer__tel-dark.png — pillole valore viola scuro con testo lilla — contrasto sufficiente ma basso; stile diverso dalla pagina Impostazioni (testo + chevron) — vedi chiaro.
- [gravità: bassa] imp-timer__tel-dark.png — avatar dietro il foglio lilla con «R» nera ancora molto evidente — oscuramento debole.
- Valgono i difetti di testo di imp-timer__tel-light.png.

### imp-musica__tel-dark.png
- [gravità: media] imp-musica__tel-dark.png — campi «Incolla il link» grigio scuro su card grigio scuro, bordo appena percettibile — sembrano righe vuote, non campi — bordo più chiaro; spiegazione del servizio supportato (vedi chiaro).
- [gravità: bassa] imp-musica__tel-dark.png — card «Predefinita» attaccata al titolo, foglio con altezza diversa dagli altri — vedi chiaro.

### imp-aspetto__tel-dark.png
- [gravità: media] imp-aspetto__tel-dark.png — segmentato «Auto / Chiaro / Scuro» — la selezione «Auto» è un nero appena diverso dal contenitore: non si capisce quale tema sia scelto — pillola selezionata più chiara o colore primario.
- [gravità: bassa] imp-aspetto__tel-dark.png — «Suoni / Vibrazione» sotto «Aspetto» — vedi chiaro.

### aree__tel-dark.png
- [gravità: bassa] aree__tel-dark.png — riquadri icona area con fondi marroni/bordeaux/verde scuro — colori fangosi, icone scure poco leggibili — tinte al 20% del colore pieno, icona nel colore chiaro.
- [gravità: bassa] aree__tel-dark.png — cestino grigio scuro accanto all'interruttore — poco visibile (bene per evitare tocchi, ma resta il problema di posizione) — vedi chiaro.
- [gravità: bassa] aree__tel-dark.png — campo «Nome» con icona libro su riquadro scuro: sembra disattivato — vedi chiaro.

### sonno-pasti__tel-dark.png
- [gravità: alta] sonno-pasti__tel-dark.png — orari in 12 h (11:30 PM, 08:00 AM, 05:00 AM – 02:00 PM) — 24 h.
- [gravità: bassa] sonno-pasti__tel-dark.png — «Durata 8h» e «Tra le» grigio scuro: sembrano disattivati — vedi chiaro.
- [gravità: bassa] sonno-pasti__tel-dark.png — pillole orario grigio scuro con testo bianco e pillole durata viola scuro con testo lilla, affiancate — due stili di valore nella stessa riga — uniformare.

### promemoria__tel-dark.png
- [gravità: alta] promemoria__tel-dark.png — avviso «Bloccati» neutro e interruttori tutti accesi — vedi chiaro; in scuro l'avviso è ancora meno visibile (grigio su grigio).
- [gravità: alta] promemoria__tel-dark.png — orari 12 h.
- [gravità: bassa] promemoria__tel-dark.png — riga «Server · da collegare» tagliata in fondo — vedi chiaro.

### diario__tel-dark.png
- [gravità: media] diario__tel-dark.png — pulsanti «↶» su ogni riga, select nativo dentro una voce, pagina intera invece di foglio con «Andamento» attivo nella tab bar — vedi chiaro.
- [gravità: bassa] diario__tel-dark.png — segmentato «Cose importanti / Tutto»: selezione nero su grigio scuro, poco distinguibile.
- [gravità: bassa] diario__tel-dark.png — orari a destra grigio scuro e icone nei riquadri scuri — contrasto basso.
- [gravità: bassa] diario__tel-dark.png — «Ieri» spunta sotto la tab bar flottante.

### timer-scelta__tel-dark.png
- [gravità: bassa] timer-scelta__tel-dark.png — oscuramento dello sfondo debole: la card «Ripasso flashcard» e «Fatto» verde restano molto leggibili e competono col foglio — oscuramento più forte.
- [gravità: bassa] timer-scelta__tel-dark.png — riquadri icona con bordo scuro: «riquadro dentro riga dentro card» — vedi chiaro.

### timer-concentrazione__tel-dark.png
- [gravità: media] timer-concentrazione__tel-dark.png — identico alla versione chiara: lo schermo di concentrazione ignora il tema (scelta accettabile), ma l'anello grigio scurissimo resta quasi invisibile e «⏸ Termina» usa l'icona di pausa — vedi chiaro.

### cattura__tel-dark.png
- [gravità: bassa] cattura__tel-dark.png — popup con «Chiudi» isolato in una seconda riga, «Salva» attivo a campo vuoto, nessuna indicazione di destinazione — vedi chiaro.

### menu-oggi-avatar__tel-dark.png
- [gravità: media] menu-oggi-avatar__tel-dark.png — come nel chiaro: l'avatar porta al Profilo senza titolo né «indietro», nessuna scheda attiva — vedi profilo__tel-light.png.

## Riassunto

### 1. Bug evidenti (alta priorità)
- **Formati di ora e data americani**: ovunque si modifica un orario compare «11:30 PM», «06:00 PM», «09:30 AM», a volte nella stessa schermata dove c'è già «23:30» o «18:00» (sonno e pasti, schede di attività e abitudini, promemoria, rituale sonno). La data di inizio dell'abitudine è «07/29/2026». Servono 24 ore e GG/MM ovunque, con un selettore orario personalizzato al posto di quello del browser.
- **Tab bar tagliata a metà** in tutte le viste Giorno della Giornata (chiaro e scuro). Durante il trascinamento il «+» esce dal bordo destro e l'intestazione viene tagliata in alto.
- **Trascinamento rotto sul telefono**: la pressione lunga seleziona il testo del blocco («Pranzo» evidenziato in blu) e non si vede nulla che si muova. Servono user-select: none e un'anteprima del blocco sollevato con l'orario di destinazione.
- **Esito della scoperta**: il pulsante selezionato «funziona» è invisibile (bianco su bianco nel chiaro, scuro su scuro nello scuro). Lo stato selezionato è disegnato al contrario.
- **Nomi delle aree troncati senza puntini** nella Review della sera («Relazioni & Soc», «Studio / Univer», «Progetti Found»), e la scala 1–5 non ha né domanda né legenda.
- **Menu durata troncati** nel pannello sonno e pasti della Giornata («15 mir», «45 mi»).
- **Promemoria «bloccati»**: tutti gli interruttori risultano accesi anche se le notifiche non possono arrivare, e l'avviso è grigio e neutro.
- **Controllo «metti in Oggi» scambiato per casella**: in Da fare il quadrato grande con ◎ a sinistra sembra una casella di spunta.
- **Pannello sonno-pasti nel tema scuro**: nella cattura scura il pannello non si vede.

### 2. Navigazione e struttura
- Ci sono fino a tre livelli di schede impilati: il segmentato in alto, un secondo segmentato (Giorno/Settimana/Mese/Anno, Registro/Esperimenti) e la tab bar. Nella vista Giorno occupano circa 260 px prima che compaia il calendario.
- Lo stesso componente segmentato ha almeno 5 aspetti diversi (in alto, Giorno/Settimana, Registro/Esperimenti, Diario, Tema).
- Il Profilo non ha titolo né «indietro», e nessuna scheda della tab bar è attiva. Il Diario è una pagina intera, mentre le voci sorelle si aprono come fogli. «Aree» si raggiunge sia da Profilo sia da Andamento.
- L'avatar è un quadrato viola identico al pulsante «+», quindi sembra un'azione e non un profilo.
- I fogli delle Impostazioni cambiano altezza a ogni sotto-pagina. Molti fogli non hanno «Fine/Chiudi».
- Le intestazioni fisse (settimana, titolo dei fogli) non hanno separatore, quindi il contenuto che scorre sotto appare tagliato di netto.

### 3. Incoerenze fra componenti
- I controlli di completamento sono quattro e diversi: quadrato grande a sinistra (passi), cerchio grande a destra (abitudini), quadratino (Senza orario), quadrati colorati non toccabili (lista del Mese).
- «Fatto» è verde in Adesso e nel timer, mentre «Fatta» è viola nelle schede abitudine.
- I campi «aggiungi» hanno tre o quattro stili diversi (bordo bianco con pulsante lilla, grigio pieno, link). Il pulsante «Aggiungi» resta lilla pallido anche quando è attivo, quindi sembra disattivato.
- I valori nelle righe sono presentati in modi misti: tendine native, testo con chevron, pillole viola, testo nudo («no», «nessuna»). La «×» per cancellare è a volte dentro la pillola e a volte fuori.
- I pulsanti 1–5 sono bianchi con bordo nel Check-in e grigi pieni nella Review della sera. I cerchi dei giorni cambiano aspetto fra creazione e scheda abitudine.
- Le abitudini nel calendario hanno contorno verde, le attività hanno riempimento e barra laterale. Il verde vuol dire anche «fatto».
- La heatmap della costanza è verde nella vista Anno e blu in Andamento.
- Nella Review della settimana i numeri usano un carattere con grazie che non compare altrove.
- Ci sono controlli nativi del browser (select, input orario, maniglia delle textarea) in mezzo a un'interfaccia personalizzata.

### 4. Testi e lingua
- Ci sono anglicismi e gergo: «Review della sera/settimana», «Archivio review», «Check-in», «XP», «Design lab», «Registro tecnico», «Server da collegare», «d≈3,1», «Evidenza».
- Alcune formule sono innaturali o ambigue: «Togli solo da oggi», «Finisce qui», «Non completata», «Togli questa riga», «Prossimo passo in Oggi», «Sposta in Da fare», «Sposta 1 non fatta a domani», «Aggiungi un'altra…», «concentratissimo», «Ora: Nessuno», «Scritta 20 lug», «Pianifica: Ieri / Gio».
- I decimali usano il punto («4.3»). Valori e stati sono spesso in minuscolo («da fare», «automatico», «nessuna»), e alcune domande non hanno «?».
- Molti numeri non hanno etichetta: «1/2», «38», «65%», «7/25/17» nella vista Anno, «1 di 3», «Backup 1». Nelle varie schermate i conteggi non tornano fra loro (1/2, 0 di 3, 81 di 124, 109 fatte).
- Gli stessi concetti hanno nomi diversi: «Piano del giorno/del mattino», «Review della sera/Chiusura della giornata», «concentrarti/focus», «come ti senti/umore».

### 5. Gerarchia e spaziature
- I titoli nelle liste (Da fare, Scoperte, schede) vanno a capo a circa il 60% della larghezza e lasciano un vuoto a destra.
- Ci sono riquadri dentro riquadri: icone incorniciate da 42 px nelle righe (Scoperte, Timer), la card hero di Adesso con chip e ombra, il segmentato annidato in Aspetto.
- In Adesso «Timer» e «Salta oggi» hanno stili, larghezze e posizioni dell'icona diversi.
- L'ultimo contenuto finisce sotto la tab bar flottante (pulsanti di salvataggio dei rituali, testi degli esperimenti), quindi serve un padding inferiore. I margini sinistri dei fogli variano di 4 px e il ritmo verticale è irregolare.
- Le azioni distruttive («Scarta», «Elimina», cestini sempre visibili, «Cancella tutti i dati») hanno troppo peso o nessuna conferma visibile.

### 6. Tema scuro
- I colori area diventano marrone, oliva e bordeaux fangosi. Le linee della griglia oraria, i bordi dei campi, i divisori e le celle vuote della heatmap sono quasi invisibili.
- La selezione dei segmentati (Adesso, Tema Auto, Diario) è quasi indistinguibile.
- Verde e blu scuri su nero (contorni delle abitudini, icone ↻, cerchi di spunta, numeri della vista Anno) hanno contrasto basso. Il testo barrato è illeggibile.
- Lo sfondo dietro i fogli è oscurato troppo poco e i fogli hanno quasi lo stesso tono dello sfondo.
- I badge hanno due colori diversi (viola scuro in alto, lilla in basso).
- Nella scheda abitudine c'è una linea tratteggiata residua a destra del titolo.
