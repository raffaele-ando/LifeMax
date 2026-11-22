# Revisione tablet — giro 5

## oggi-adesso__tab-light.png
- [media] oggi-adesso__tab-light.png — metà inferiore (da y≈650 a 1035) — oltre il 40% dello schermo è vuoto: sul tablet la colonna resta stretta (~680px) e la lista «Poi» ha un solo elemento; nessun contenuto riempie lo spazio — su tablet usare un layout a due colonne (card «adesso» + lista «Poi»/riepilogo giornata) o mostrare un'anteprima della giornata sotto «Poi».
- [media] oggi-adesso__tab-light.png — badge «38 giorni» in alto a destra — numero senza etichetta chiara: 38 giorni di cosa (serie? giorni d'uso?); la fiamma da sola non basta — «38 giorni di fila» o tooltip/etichetta «serie».
- [media] oggi-adesso__tab-light.png — barra di navigazione in basso — la barra è larga quasi tutto lo schermo (12–822px) mentre il contenuto è una colonna centrata di ~680px: i due assi non sono allineati; inoltre il FAB «+» è incastrato dentro la barra con un separatore verticale, le tre voci non sono centrate sullo schermo (Andamento a 639px, centro barra spostato a sinistra) — allineare la barra alla larghezza della colonna o distribuire le voci su tutta la larghezza, FAB fluttuante separato.
- [bassa] oggi-adesso__tab-light.png — card «Ripasso flashcard» — «Salta oggi» è testo grigio senza contenitore accanto a un bottone bordato «Timer»: due affordance di peso diverso sulla stessa riga; l'icona ⏭ dopo il testo è insolita — renderli due bottoni secondari coerenti (stesso stile ghost/outline).
- [bassa] oggi-adesso__tab-light.png — segmented control in alto — il pallino viola su «Rituali» non spiega cosa indica (nuovo? da fare?) — usare un badge numerico o testo accessibile, o un colore coerente con il badge «6» di Attività.
- [bassa] oggi-adesso__tab-light.png — riga «Confrontare piani telefonici» — il cerchio di completamento (44px) è molto più grande del testo e non è allineato otticamente al bordo sinistro della card sopra (icona sole) — ridurre a ~28px e allineare la colonna icone.

## giornata-giorno__tab-light.png
- [media] giornata-giorno__tab-light.png — intestazione «Oggi» tra le frecce — manca la data: quando si naviga avanti/indietro serve sapere che giorno è; «Oggi» da solo non dà contesto (la schermata Adesso invece mostra «Martedì 18 agosto») — «Oggi · mar 18 agosto» come titolo + sottotitolo.
- [media] giornata-giorno__tab-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — le icone dei pasti non hanno etichette né orari, il «8h» è l'unico numero spiegato dal contesto; su tablet c'è spazio orizzontale abbondante (oltre metà riga vuota) — scrivere «Colazione 8:00 · Pranzo 13:00 · Cena 20:00» o almeno gli orari accanto alle icone.
- [media] giornata-giorno__tab-light.png — blocco «Organizzare cena con il gruppo» 09:30–11:00 — la linea dell'ora attuale passa sopra il blocco e il badge «10:30» copre il bordo destro della card; il titolo barrato in grigio su grigio ha contrasto basso — far passare la linea sotto il contenuto testuale (z-index) o con opacità, schiarire meno il testo completato.
- [media] giornata-giorno__tab-light.png — blocchi del calendario — tre stili diversi per tre tipi (riempito rosa con maniglia, riempito giallo, solo bordo verde per l'abitudine) senza legenda; la differenza tra attività fatta (barrata) e abitudine (contorno) non è evidente — uniformare la forma e usare un solo segnale per il tipo (icona già presente) e uno per lo stato.
- [media] giornata-giorno__tab-light.png — calendario — sul tablet 1 ora = 56px: la giornata intera non entra e ampie fasce vuote (11–13, 16–18) dominano; nessun suggerimento di toccare lo spazio vuoto per aggiungere — valutare altezza ore compressa per le fasce vuote o affiancare la lista «senza orario» in una colonna laterale su tablet.
- [bassa] giornata-giorno__tab-light.png — blocchi pasti (Colazione, Pranzo) — Colazione è una barra sottile (~24px) con testo centrato schiacciato, Pranzo è alta 40px: altezze diverse senza un orario scritto, sembra un'incoerenza — mostrare l'orario dei pasti o dare un'altezza minima uniforme.
- [bassa] giornata-giorno__tab-light.png — tab Giorno/Settimana/Mese/Anno — la tab selezionata «Giorno» è un rettangolo pieno che si allinea al bordo sinistro, le altre senza contenitore: il gruppo non ha un fondo comune come il segmented control sopra — usare lo stesso componente (segmented) del livello superiore o una sottolineatura.

## giornata-giorno-fondo__tab-light.png
- [media] giornata-giorno-fondo__tab-light.png — blocco «Leggere 20 minuti» alle 22:00 — è l'unico blocco senza orario visibile (le altre card mostrano «18:00–18:45»): il blocco breve taglia la seconda riga — su blocchi bassi mettere l'orario in linea dopo il titolo («Leggere 20 minuti · 22:00–22:20»).
- [media] giornata-giorno-fondo__tab-light.png — riga «Ripasso flashcard» in «Senza orario» — usa una casella quadrata, mentre in Adesso le cose da fare hanno un cerchio e qui Ripasso è un'abitudine (icona libro, non l'icona ↻ usata per le abitudini nel calendario): tre segnali incoerenti per lo stesso oggetto — stessa forma di spunta in tutta l'app e stessa icona tipo (↻) per le abitudini.
- [media] giornata-giorno-fondo__tab-light.png — icona orologio viola a destra di «Ripasso flashcard» — affordance non chiara (dà un orario? avvia un timer?), senza etichetta — sostituire con un bottone testuale «Dai un orario» o aggiungere etichetta/tooltip.
- [bassa] giornata-giorno-fondo__tab-light.png — titolo sezione «Senza orario 1» — piccolo e grigio (13px), gerarchia molto più debole delle sezioni «Poi» altrove (titolo 20px bold) — allineare lo stile dei titoli di sezione.
- [bassa] giornata-giorno-fondo__tab-light.png — campo «Nuova attività…» + bottone «Aggiungi» — il bottone è incassato dentro il campo con padding diverso (bordo campo a 4px dal bottone sopra/sotto ma 8px a destra): leggermente sbilanciato — margini interni uguali.

## giornata-settimana__tab-light.png
- [media] giornata-settimana__tab-light.png — frecce ‹ › accanto a «17–23 ago» — qui sono quadrati arrotondati con bordo, nella vista Giorno sono cerchi bianchi senza bordo; anche il titolo passa da centrato («Oggi») ad allineato a sinistra («17–23 ago») — stesso componente di navigazione periodo in tutte le viste.
- [media] giornata-settimana__tab-light.png — striscia dei giorni (L…D) con «4 di 24 fatte questa settimana» — il pannello ha un fondo più largo della colonna (inizia a x≈60 invece di 77, finisce a ≈770 invece di 757): bordi disallineati rispetto alle card sotto — stessa larghezza e raggio delle card.
- [media] giornata-settimana__tab-light.png — Lunedì 17 (giorno passato) — «Leggere 20 minuti», «Ripasso flashcard» e «Inbox a zero…» non fatti appaiono identici alle cose future, e c'è «Sposta» solo su una riga: non si capisce cosa è stato mancato — evidenziare le voci mancate di un giorno passato (es. «non fatto» o icona) e offrire «Sposta» in modo coerente.
- [bassa] giornata-settimana__tab-light.png — icone abitudine ↻ — verdi per Camminata/Leggere, blu per Ripasso flashcard, senza spiegazione (colore dell'area?); i pallini colorati delle attività non hanno legenda — chiarire che il colore è l'area (legenda o nome area in piccolo su tablet, dove c'è spazio).
- [bassa] giornata-settimana__tab-light.png — anelli di progresso su 17 e 18 — l'anello del 18 è quasi invisibile (arco corto sopra un cerchio viola pieno), e i giorni futuri non hanno anello: lettura difficile — anello sempre presente (grigio vuoto) e cerchio «oggi» con contorno invece che pieno.
- [bassa] giornata-settimana__tab-light.png — sotto la barra di navigazione, a sinistra (y≈1040–1100) — si vede un alone/ombra grigia sfocata che non appartiene a nessun elemento (artefatto del blur di sfondo), presente anche in altre schermate; anche in alto a destra c'è una macchia viola sfumata — verificare backdrop-filter/gradiente di sfondo.

## giornata-mese__tab-light.png
- [alta] giornata-mese__tab-light.png — lista «Oggi» sotto il calendario — ordine non cronologico: Leggere (22:00), Ripasso (senza orario), Camminata (18:00), Organizzare cena (09:30), Confrontare (15:00); nella vista Settimana lo stesso giorno è ordinato per ora — ordinare per orario (senza orario in fondo), come nelle altre viste.
- [media] giornata-mese__tab-light.png — quadratini colorati a sinistra delle righe «Oggi» — sembrano caselle di spunta (bordo per le abitudini, pieni per le attività) ma sono 12px, non toccabili, e il pieno rosa/arancio fa pensare a «fatto»; in Settimana lo stesso ruolo è un pallino — usare il pallino area come altrove e una vera spunta se si vuole completare da qui.
- [media] giornata-mese__tab-light.png — griglia del mese — gli anelli verdi (percentuale?) e i puntini colorati sotto i numeri non hanno legenda; i giorni 27–31 di luglio hanno anelli sbiaditi ma anche puntini, sembrano parte di agosto — aggiungere una micro-legenda («anello = % fatte, puntini = aree») e attenuare di più o nascondere i giorni fuori mese.
- [bassa] giornata-mese__tab-light.png — «18 giorni attivi  58 attività fatte» — numeri grandi senza riferimento (su quanti giorni? attività o anche abitudini?) e il gruppo non è allineato all'interno della card ma fuori — «18 giorni attivi su 18 · 58 cose fatte», dentro l'intestazione della card calendario.
- [bassa] giornata-mese__tab-light.png — giorno 18 selezionato — doppio segnale (cerchio viola pieno + riquadro grigio), mentre l'anello di progresso sul viola si vede appena — tenere solo il riquadro di selezione e un contorno «oggi».
- [bassa] giornata-mese__tab-light.png — Mese e Settimana — titolo sezione «Oggi» + «Apri il giorno ›» qui, mentre in Settimana è «Martedì 18 [Oggi] ›»: due pattern per la stessa cosa — uniformare.

## giornata-anno__tab-light.png
- [media] giornata-anno__tab-light.png — card «Ago» numero «17» in verde — la vista Mese dice «18 giorni attivi» per agosto: dato incoerente tra le due viste (probabilmente oggi contato in una e non nell'altra) — usare la stessa regola di conteggio.
- [media] giornata-anno__tab-light.png — numeri verdi «7», «25», «17» in alto a destra dei mesi — numeri senza etichetta; si capisce solo per deduzione che sono giorni attivi — «17 gg» o tooltip, e colore neutro (il verde suggerisce «positivo»).
- [media] giornata-anno__tab-light.png — heatmap mensili — il codice colore è blu a intensità, mentre nella vista Mese lo stesso concetto è un anello verde: due linguaggi visivi per il progresso giornaliero; nessuna legenda d'intensità e nessuna intestazione dei giorni della settimana — uniformare il colore e aggiungere legenda «meno ▢▢▢▢ più».
- [media] giornata-anno__tab-light.png — riquadro «XP 1874» — «XP» è gergo da videogioco, non spiegato e non compare in nessun'altra schermata vista finora — chiarire («punti») o spiegare come si guadagnano.
- [bassa] giornata-anno__tab-light.png — Scadenze «7 set · Trovare lavoro per agosto» + icona valigetta a destra — l'icona isolata a destra non ha significato evidente (area Lavoro?) ed è lontanissima dal testo su tablet — mettere il pallino/nome dell'area accanto al titolo.
- [bassa] giornata-anno__tab-light.png — card mesi — le card hanno altezze uguali per riga ma i mesi con 6 settimane (Mar, Ago) hanno l'ultima riga che tocca il fondo mentre gli altri lasciano spazio vuoto; nessun numero di giorno, impossibile toccare un giorno con precisione (celle 19px) — celle ≥ 24px su tablet, c'è spazio.

## giornata-sonno-aperto__tab-light.png
- [media] giornata-sonno-aperto__tab-light.png — righe Colazione/Pranzo/Cena — le colonne orario e durata non hanno intestazione («15 min» = durata? anticipo?) e sono spinte tutte a destra lasciando ~430px vuoti tra etichetta e campi; i campi «A letto»/«Sveglia» invece occupano metà riga ciascuno: due griglie diverse nello stesso pannello — griglia unica a colonne con intestazioni «Inizio» «Durata», campi a larghezza fissa allineati sotto A letto/Sveglia.
- [media] giornata-sonno-aperto__tab-light.png — azioni «+ Pasto · Annulla le modifiche · Orari abituali» — tre link di pari peso affiancati: «Annulla le modifiche» (distruttivo) è attaccato a «+ Pasto»; «Orari abituali» non dice se applica o apre le impostazioni — separare l'azione distruttiva (a destra, grigia), rinominare in «Ripristina orari abituali».
- [bassa] giornata-sonno-aperto__tab-light.png — icone cestino accanto ai pasti — piccole (14px), grigie, molto vicine al select della durata: target di tocco insufficiente e rischio di tocchi accidentali — area di tocco 44px e spaziatura maggiore.
- [bassa] giornata-sonno-aperto__tab-light.png — riga di riepilogo del pannello aperto — continua a mostrare «23:30 → 07:30 · 8h · ☕🍴🍴» che duplica i campi subito sotto — quando aperto mostrare solo il titolo «Sonno e pasti».
- [bassa] giornata-sonno-aperto__tab-light.png — bordo superiore — le tab Giorno/Settimana/… sono tagliate a metà dal bordo dello schermo: l'intestazione non resta fissa durante lo scorrimento — rendere sticky la barra delle viste o almeno il segmented control.

## giornata-scheda-blocco__tab-light.png
- [media] giornata-scheda-blocco__tab-light.png — foglio inferiore — su tablet è un bottom sheet largo 640px incollato al bordo inferiore, con il FAB «+» ancora visibile (solo scurito) a destra e la nav che sbuca ai lati: sembra un componente da telefono stirato — su tablet usare un dialog centrato o un pannello laterale, e nascondere FAB/nav sotto l'overlay.
- [media] giornata-scheda-blocco__tab-light.png — stato dell'attività — l'unico indizio che è «fatta» è il link grigio «Segna come non fatta»; il titolo non è barrato né c'è un badge «Fatta» — aggiungere uno stato esplicito (chip «Fatta ✓» accanto a «Attività · Oggi»).
- [bassa] giornata-scheda-blocco__tab-light.png — valori Ora/Durata — «09:30» nero, «1 h 30» viola nello stesso tipo di chip; il formato «1 h 30» (con spazio) differisce da «8h» del riepilogo sonno e «45 min» dei pasti — stesso colore per i valori e un unico formato durate («1 h 30 min» / «8 h»).
- [bassa] giornata-scheda-blocco__tab-light.png — «Segna come non fatta» — testo centrato isolato fra sottotitolo e gruppo di campi, non sembra un bottone — renderlo un bottone secondario con contorno come le altre azioni.
- [bassa] giornata-scheda-blocco__tab-light.png — stellina ☆ prima del titolo nel blocco calendario — significato non spiegato (importante? preferita?) e assente nella scheda — mostrarlo anche nella scheda con etichetta («Importante»).

## giornata-scheda-abitudine__tab-light.png
- [media] giornata-scheda-abitudine__tab-light.png — lista azioni in basso — l'azione distruttiva «Termina l'abitudine» (rossa) è in mezzo, tra «Salta oggi» e «Apri l'abitudine»: facile toccarla per sbaglio e rompe la convenzione (distruttivo in fondo, separato) — ordine: Apri l'abitudine, Salta oggi, poi Termina in un gruppo a parte.
- [media] giornata-scheda-abitudine__tab-light.png — foglio inferiore su tablet — stesso problema della scheda attività: bottom sheet da telefono, FAB visibile sopra l'overlay a destra (x≈790, y≈1068) — dialog centrato/pannello laterale su tablet.
- [bassa] giornata-scheda-abitudine__tab-light.png — «Salta oggi» — qui l'icona è ✕, nella card Adesso è ⏭: stessa azione, due icone; la ✕ si confonde con «chiudi» — usare la stessa icona (⏭) ovunque.
- [bassa] giornata-scheda-abitudine__tab-light.png — bottone «✓ Fatto» — l'etichetta al participio si legge come stato più che come azione (è ancora da fare) — «Segna come fatta» o «Fatto!» con sottotitolo; in coerenza con «Segna come non fatta» della scheda attività.

## rituali__tab-light.png
- [media] rituali__tab-light.png — area sotto la lista (y≈400–1035) — due terzi dello schermo vuoti; su tablet la lista a fisarmonica potrebbe stare a sinistra con il rituale aperto a destra (master-detail) — layout a due colonne o card più ricche (orario suggerito, durata stimata).
- [media] rituali__tab-light.png — stato «da fare · 2 di 3» di Piano del giorno — ambiguo: 2 di 3 fatti ma ancora «da fare»? «da compilare · 0 di 4» usa un verbo diverso per lo stesso stato — un'unica formula: «2 di 3 passi» + barra/anello, e «in corso» quando parziale.
- [bassa] rituali__tab-light.png — icona di Piano del giorno in viola pieno, le altre in viola chiaro — l'evidenza non è spiegata (è il prossimo consigliato? è aperto?) — aggiungere un'etichetta «Adesso» o togliere la differenza.
- [bassa] rituali__tab-light.png — righe senza contesto temporale — non si sa quando fare ciascun rituale (mattina/sera/domenica) — aggiungere orario o momento come sottotitolo, c'è spazio orizzontale.

## rituale-piano__tab-light.png
- [media] rituale-piano__tab-light.png — elenco priorità — solo la prima riga ha il chip «☆ Priorità» (su un'attività già fatta e barrata), la seconda no, anche se entrambe sono elencate come priorità; il chip viola su testo barrato attira l'occhio sull'elemento meno rilevante — togliere il chip ridondante (siamo già nella lista priorità) o mostrarlo su tutte; attenuare le righe fatte.
- [media] rituale-piano__tab-light.png — icone a destra delle priorità (persone rosa, carta gialla) — icone d'area senza etichetta, piccole e isolate a 450px dal testo — nome area in chiaro o pallino colorato accanto al titolo.
- [media] rituale-piano__tab-light.png — stato «da fare 2 di 3» — con il rituale aperto non si capisce quali siano i 3 passi né quale manchi (2 priorità + «Quando inizi?»?) — numerare i passi o mostrare una checklist dei passi.
- [bassa] rituale-piano__tab-light.png — contenuto espanso — le righe interne iniziano a x≈93 (bordo icona) mentre i titoli dei rituali partono a x≈137: rientro incoerente con la gerarchia — allineare il contenuto al titolo o indentarlo visibilmente.
- [bassa] rituale-piano__tab-light.png — bottone «Salva +5 XP» — il «+5 XP» più piccolo e affiancato rende l'etichetta rumorosa; «XP» non spiegato — spostare la ricompensa in un sottotitolo o in un feedback post-salvataggio.
- [bassa] rituale-piano__tab-light.png — campo «Aggiungi un'altra priorità…» con «+ Aggiungi» interno — stile diverso dal campo «Nuova attività…» della Giornata (lì bordo bianco e bottone pieno viola chiaro, qui fondo grigio e bottone testuale) — un solo componente «aggiungi riga».

## rituale-sonno-pasti__tab-light.png
- [media] rituale-sonno-pasti__tab-light.png — campi «A letto 23:30 ⏱» e «Sveglia 07:30 ⏱» — sembrano input time nativi del browser non stilizzati (icona orologio nativa, nessun contenitore, testo a destra): non sembrano modificabili e sono diversi dai campi orario a pillola del pannello Sonno nella Giornata — usare lo stesso campo orario stilizzato ovunque.
- [media] rituale-sonno-pasti__tab-light.png — bottoni pasti «sì / no / ⏱» — il terzo bottone ha solo un'icona (indicare l'orario? posticipare?), «sì/no» minuscoli e grigi senza stato selezionato visibile in anteprima — etichetta «Altro orario», maiuscola iniziale, segmented control con stato selezionato chiaro.
- [media] rituale-sonno-pasti__tab-light.png — «Come sempre · 23:30–07:30» in viola grassetto a destra e «Non ricordo» in viola a sinistra sotto — due link-azione con posizione e peso diversi per risposte alternative alla stessa domanda; non è chiaro che «Come sempre» sia un bottone — raggrupparli come chip di risposta rapida sotto «Sonno».
- [bassa] rituale-sonno-pasti__tab-light.png — sezione «Altre cose fatte» — fuori contesto in un rituale chiamato «Sonno e pasti» — spostarla nel Check-in o in Fine giornata, o rinominare il rituale.
- [bassa] rituale-sonno-pasti__tab-light.png — CTA finale — qui «Fatto» viola, in Piano del giorno «Salva +5 XP», nella card Adesso «Fatto» verde: tre etichette/colori per la stessa azione di chiusura — uniformare (es. «Salva» viola per i rituali, verde riservato al completamento).

## rituale-checkin__tab-light.png
- [media] rituale-checkin__tab-light.png — bottone «Registra +3 XP» disabilitato — testo viola chiaro su viola chiarissimo, contrasto molto basso e nessuna spiegazione del perché sia disabilitato (già registrato oggi? nessuna modifica?) — mostrare «Registrato alle 9:12 ✓» oppure abilitare per aggiornare.
- [media] rituale-checkin__tab-light.png — grafico «Andamento degli ultimi 14 giorni» — buco nelle linee tra ~14 e 15 ago senza spiegazione; legenda duplicata (in alto e a fine linea) con le etichette finali ammassate a destra (Focus/Umore/Energia a 14px una dall'altra) — rimuovere una delle due legende, segnare i giorni mancanti (tratteggio o «nessun dato»).
- [bassa] rituale-checkin__tab-light.png — titolo «Andamento degli ultimi 14 giorni» (20px bold) — più grande del titolo del rituale «Check-in» che lo contiene: gerarchia invertita — ridurlo a livello di sottosezione.
- [bassa] rituale-checkin__tab-light.png — verbo del CTA — «Registra» qui, «Fatto» in Sonno e pasti, «Salva» in Piano del giorno — uniformare.

## rituale-sera__tab-light.png
- [alta] rituale-sera__tab-light.png — valutazione per area (8 righe) — su tablet il nome dell'area sta su una riga e i bottoni 1–5 vanno a capo sulla riga sotto, allineati a destra: ogni riga occupa ~84px con metà vuota, il rituale diventa lunghissimo e l'occhio deve fare zig-zag tra nome (sinistra) e voto (destra, riga sotto) — mettere nome e bottoni sulla stessa riga (c'è spazio: 680px), o griglia a 2 colonne di aree.
- [media] rituale-sera__tab-light.png — bottoni 1–5 — qui sono quadratini grigi 36px senza bordo, nel Check-in sono bottoni larghi bianchi con bordo e 48px di altezza: stessa scala 1–5, due componenti diversi — un solo componente scala.
- [bassa] rituale-sera__tab-light.png — titolo del rituale «Fine giornata» — nell'indice/elenco le schermate lo chiamano «Review della sera» e altrove si parla di «review»: nomi diversi per la stessa cosa — scegliere un nome unico (in italiano: «Fine giornata»).
- [bassa] rituale-sera__tab-light.png — legenda «1 = male · 5 = benissimo» — grigia e piccola, staccata dai bottoni che stanno 40px più in basso a destra — ripeterla come etichette agli estremi della scala come nel Check-in.

## rituale-settimana__tab-light.png
- [alta] rituale-settimana__tab-light.png — riepilogo «216 XP · 10 attività fatte · 6/7 giorni attivi» — incoerente con la vista Settimana (17–23 ago: «4 di 24 fatte questa settimana», solo lunedì e martedì passati): 6/7 giorni attivi è impossibile al martedì se la settimana è quella del calendario; probabilmente qui sono gli ultimi 7 giorni — dichiarare il periodo («ultimi 7 giorni, 12–18 ago») o allinearlo alla settimana del calendario.
- [media] rituale-settimana__tab-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — mancano i punti interrogativi e le textarea sono vuote senza placeholder/esempio (nel Piano del giorno c'è «Es. alle 9:00…») — aggiungere «?» e un esempio in ogni campo.
- [bassa] rituale-settimana__tab-light.png — blocco numeri centrato — unica parte centrata in un contenuto tutto allineato a sinistra; i numeri non hanno contenitore come nella vista Anno (card con divisori) — stesso componente «statistiche» della vista Anno.
- [bassa] rituale-settimana__tab-light.png — link «Apri le Scoperte» — grigio, con icona a beuta, sotto il CTA: non è chiaro perché stia qui né cosa siano le Scoperte in questo contesto — frase esplicativa («Trasforma ciò che hai imparato in una scoperta →»).

## attivita-sistemare__tab-light.png
- [media] attivita-sistemare__tab-light.png — lista «In coda 5» — le voci sono testo grigio semplice senza righe/card né affordance: non si capisce se siano toccabili; «e un'altra» in corsivo nasconde un solo elemento quando c'è mezzo schermo vuoto — mostrare tutte le voci come righe toccabili (stesso stile delle liste altrove).
- [media] attivita-sistemare__tab-light.png — bottoni «Oggi / Da fare / Scarta» — «Oggi» e «Da fare» sono nomi di sezioni, non azioni: non dicono che spostano l'elemento — «Fai oggi», «Metti in Da fare», «Scarta»; inoltre «Scarta» con bordo e testo rosso ha lo stesso peso visivo del secondario — renderlo ghost.
- [bassa] attivita-sistemare__tab-light.png — etichetta «Da sistemare» sopra la card — ripete esattamente la tab selezionata; piccola e grigia, non aggiunge informazione — sostituire con istruzione («Decidi dove va: 1 di 6»).
- [bassa] attivita-sistemare__tab-light.png — area vuota da y≈490 a 1035 — schermo per metà vuoto su tablet — card più grande con anteprima della coda accanto (due colonne).
- [bassa] attivita-sistemare__tab-light.png — badge «6» sull'icona Attività della nav — corrisponde a «Da sistemare» ma non a «Da fare 9»: non è chiaro cosa conti — tooltip/aria-label o badge solo quando ci sono cose nuove da smistare.

## attivita-dafare__tab-light.png
- [media] attivita-dafare__tab-light.png — «1 di 3», «1 di 4» a destra delle prime due righe — numeri senza etichetta (passi completati?) — «1/3 passi» o mini barra di avanzamento.
- [media] attivita-dafare__tab-light.png — bottone «+ Oggi» — il primo è viola pieno, gli altri viola chiaro senza motivo visibile (suggerito? hover/focus residuo?) — se è un suggerimento dirlo («Consigliata»), altrimenti stesso stile per tutti.
- [media] attivita-dafare__tab-light.png — righe dell'elenco — non c'è modo visibile di completare un'attività da qui (nessuna spunta), a differenza di «Poi» in Adesso e di «Senza orario» — aggiungere la spunta coerente con le altre liste o chiarire che si completa solo da Oggi.
- [bassa] attivita-dafare__tab-light.png — filtro «Tutte ▾» — un dropdown isolato occupa un'intera riga e da solo non dice cosa filtra (aree? stato?) — su tablet affiancarlo ai titoli o usare chip per area in orizzontale.
- [bassa] attivita-dafare__tab-light.png — titoli sezione «Importanti 3», «Altre 6» — piccoli (13px) e grigi, molto più deboli dei titoli di sezione «Poi» di Adesso — stesso stile titoli di sezione.
- [bassa] attivita-dafare__tab-light.png — icone d'area (libro, razzo, valigetta…) colorate prima dei titoli — senza nome area, il significato va indovinato — su tablet c'è spazio per il nome area in piccolo sotto il titolo come in Adesso («Finanze · 15:00»).

## attivita-dafare-aggiunta__tab-light.png
- [media] attivita-dafare-aggiunta__tab-light.png — opzioni della nuova attività (Oggi / Domani / Senza data / Altro / Esplorazione) e filtro «Tutte» subito sotto — due file di pillole simili una sull'altra: non si capisce che la prima riga appartiene al campo e la seconda filtra la lista; inoltre la prima riga è rientrata di 12px (x≈89) e la seconda no (x≈77) — racchiudere le opzioni in un pannello unito al campo (stesso bordo/fondo) e separare chiaramente il filtro.
- [media] attivita-dafare-aggiunta__tab-light.png — select area «Altro / Esplorazione ▾» — preselezionata senza etichetta: sembra una scelta già fatta dall'utente; stile diverso dai chip accanto (bordo più chiaro, testo regolare) — prefisso «Area:» e stesso stile chip.
- [bassa] attivita-dafare-aggiunta__tab-light.png — opzioni mancanti — non si può segnare come «Importante» né dare un orario/durata in fase di creazione, anche se la lista è divisa in Importanti/Altre — aggiungere un toggle ☆ Importante.

## attivita-abitudini__tab-light.png
- [media] attivita-abitudini__tab-light.png — cerchio di completamento a destra della riga — in Adesso e in «Senza orario» la spunta sta a sinistra (cerchio o quadrato): la posizione cambia da lista a lista — una sola posizione (sinistra) e una sola forma.
- [media] attivita-abitudini__tab-light.png — intestazione «0 di 3 oggi» con anello vuoto — anello grigio a 0% è quasi invisibile e «oggi» in minuscolo sotto il numero è una didascalia povera; in Adesso lo stesso concetto è una barra «1 di 2 fatte» — «0 di 3 abitudini fatte oggi», stesso componente progresso.
- [bassa] attivita-abitudini__tab-light.png — «🔥3» accanto a Salute & Sport — numero senza etichetta (serie di giorni?) e solo su una delle tre — «3 giorni di fila».
- [bassa] attivita-abitudini__tab-light.png — anelli di spunta colorati per area (verde, blu) — il colore del cerchio vuoto cambia con l'area, ma altrove le spunte sono grigie: incoerente — spunta neutra, colore solo nell'icona area.
- [bassa] attivita-abitudini__tab-light.png — area vuota da y≈480 in giù — oltre metà schermo vuoto — su tablet mostrare la mini-heatmap/serie di ciascuna abitudine nella riga (spazio orizzontale disponibile).

## attivita-abitudini-nuova__tab-light.png
- [media] attivita-abitudini-nuova__tab-light.png — selettore giorni L M M G V S D — su tablet i 7 cerchi sono distribuiti su 650px con ~60px di vuoto tra l'uno e l'altro: perdono l'aspetto di gruppo; tutti pieni viola, quindi non si vede com'è un giorno non selezionato — raggrupparli (gap 8px) allineati a sinistra o sulla riga «Giorni», stato non selezionato con contorno.
- [bassa] attivita-abitudini-nuova__tab-light.png — chip «Nessuna» (grigio) per Ora e «Salute & Sport» (viola) per Area — stesso tipo di controllo con colori diversi; l'area predefinita è Salute & Sport qui ma «Altro / Esplorazione» per le attività — stesso stile, default coerente (o nessuna area preselezionata).
- [bassa] attivita-abitudini-nuova__tab-light.png — pannello opzioni — è una card separata sotto il campo «Meditare», ma il bottone «Aggiungi» resta nel campo sopra: l'utente può non capire che le opzioni vengono salvate con quel bottone — unire campo e opzioni in una sola card con il bottone in fondo.

## scheda-attivita__tab-light.png
- [alta] scheda-attivita__tab-light.png — chip «Giovedi» in «Pianifica» — manca l'accento: deve essere «Giovedì» (errore di ortografia visibile) — correggere la stringa/formattazione del nome del giorno.
- [media] scheda-attivita__tab-light.png — riga «Area · Studio / Università ⌄» — sembra un select nativo con freccia nativa e testo grigio, mentre nella scheda dal calendario l'area è un chip viola («Relazioni & Sociale»): stesso campo, due controlli — usare lo stesso chip/selettore stilizzato.
- [media] scheda-attivita__tab-light.png — interruttore «Fissa in alto» — in posizione spenta è un pomello bianco su grigio chiarissimo, quasi invisibile; inoltre la lista usa la parola «Importanti», non «fissa in alto» — rinominare «Importante» e dare più contrasto al binario spento.
- [media] scheda-attivita__tab-light.png — azione «Non ce l'ho fatta ›» — ambigua (segna come fallita? rimanda? chiede perché?), con chevron come se aprisse una pagina — testo esplicito («Rinuncia e scrivi perché») e sottotitolo.
- [bassa] scheda-attivita__tab-light.png — chip «ogni giorno / ogni 2 giorni / ogni settimana» in minuscolo, chip «Domani / Giovedi / Tra una settimana» con maiuscola; «nessuna» minuscolo nella scadenza — uniformare le maiuscole.
- [bassa] scheda-attivita__tab-light.png — icone calendario accanto a ogni passo — senza etichetta (pianifica il passo?), molto vicine al cestino (40px): rischio di tocco sbagliato — etichetta o menu «…» per passo.
- [bassa] scheda-attivita__tab-light.png — foglio su tablet — bottom sheet alto quasi tutto lo schermo e con il FAB scurito visibile a destra (x≈790, y≈1068) — modale centrato/pannello laterale.

## scheda-attivita-fondo__tab-light.png
- [media] scheda-attivita-fondo__tab-light.png — intera schermata — è identica a scheda-attivita__tab-light.png: su tablet il foglio non scorre (tutto il contenuto entra) oppure lo scorrimento non è stato applicato; in ogni caso il foglio arriva al bordo inferiore senza margine/area sicura sotto «Elimina» — verificare lo scroll e aggiungere padding inferiore.
- [media] scheda-attivita-fondo__tab-light.png — «Fissa in alto» spento — l'attività compare nella sezione «Importanti» della lista Da fare, ma l'interruttore è spento: o la logica degli «Importanti» è diversa (non spiegata) o lo stato è incoerente — chiarire il criterio di «Importanti» o collegarlo all'interruttore.

## scheda-abitudine__tab-light.png
- [media] scheda-abitudine__tab-light.png — calendario dello storico — manca il nome del mese (si vede 27–31 di luglio e 1–18 di agosto senza intestazione); i giorni non programmati (S, D) sono numeri nudi, i programmati non fatti cerchi grigi: differenza sottile e senza legenda; terzo linguaggio visivo per «giorno fatto» (pallino verde pieno) dopo anelli (Mese) e heatmap blu (Anno) — titolo «Agosto 2026», legenda «fatto / mancato / non previsto», stile coerente tra viste.
- [media] scheda-abitudine__tab-light.png — riga «Ora 18:00 ×» — la × sta fuori dal chip, nella scheda dal calendario sta dentro il chip; «Durata 45 min» qui non ha × mentre là sì — stesso componente valore+rimuovi.
- [bassa] scheda-abitudine__tab-light.png — selettore giorni in «Quando» — i 7 cerchi non riempiono la riga (D finisce a x≈650, il contenitore a 718): spazio vuoto a destra e distribuzione non centrata — distribuzione uniforme o allineamento a sinistra con gap fisso, come nel modulo «Nuova abitudine».
- [bassa] scheda-abitudine__tab-light.png — «Inizio 29 lug 2026» testo semplice nero, «Fine Mai» grigio, Area chip viola — tre stili di valore nello stesso gruppo; non è chiaro quali siano modificabili — stesso stile per i valori modificabili (chip) con chevron.
- [bassa] scheda-abitudine__tab-light.png — statistiche «3 di fila · 4 record · 7 in tutto» — «record» da solo è ambiguo (record di cosa?) — «4 record di fila», «7 volte in tutto».
- [bassa] scheda-abitudine__tab-light.png — «Elimina» qui è un bottone a tutta larghezza centrato, nelle schede attività è una riga di lista con icona cestino allineata a sinistra — uniformare.

## scheda-abitudine-fondo__tab-light.png
- [bassa] scheda-abitudine-fondo__tab-light.png — intestazione fissa del foglio — scorrendo di soli ~34px la riga «Salute & Sport · lun–ven · 18:00» sparisce sotto l'intestazione e resta solo il titolo: il foglio scorre per pochissimo, segno che l'altezza è quasi sufficiente — su tablet dare al dialog l'altezza del contenuto (niente scroll) o tenere la riga di contesto nell'intestazione fissa.
- [bassa] scheda-abitudine-fondo__tab-light.png — fondo del foglio — sotto «Elimina» restano ~30px prima del bordo dello schermo, il foglio è tagliato in basso senza angoli arrotondati né margine — su tablet margine inferiore uguale ai laterali.
- [bassa] scheda-abitudine-fondo__tab-light.png — restano tutti i difetti di scheda-abitudine__tab-light.png (calendario senza mese, × fuori dal chip, stili valori diversi).

## andamento__tab-light.png
- [alta] andamento__tab-light.png — card serie «38 giorni di fila» — la striscia degli ultimi 7 giorni mostra venerdì vuoto (non fatto), quindi una serie di 38 giorni consecutivi è contraddetta dai dati sulla stessa card — se la serie tollera giorni di pausa, dirlo («38 giorni, 1 pausa usata»); altrimenti correggere il calcolo.
- [media] andamento__tab-light.png — «38 giorni di / fila» — l'etichetta va a capo spezzando «giorni di | fila» accanto al numero, anche se a destra c'è tanto spazio — tenere «giorni di fila» su una riga (white-space: nowrap) o metterla sotto il numero.
- [media] andamento__tab-light.png — card «Costanza» — la heatmap occupa ~200px su 680 disponibili, celle da 12px, senza etichette di mesi né giorni: il resto della card è vuoto — su tablet allargare le celle per riempire la larghezza e aggiungere mesi/giorni.
- [media] andamento__tab-light.png — numeri «fatte: 81 di 124 in 30 giorni» — non coerenti con la vista Anno («82 attività fatte» in tutto il 2026, con attività da giugno) e con il Mese («58 attività fatte» in agosto): probabilmente contano anche le abitudini ma non è detto — specificare cosa si conta («cose fatte, abitudini incluse»).
- [bassa] andamento__tab-light.png — striscia «M G V S D L M» — due «M» indistinguibili (mercoledì e martedì), giorno corrente evidenziato solo da un bordo viola sottile — usare date (12…18) sotto le iniziali.
- [bassa] andamento__tab-light.png — «Per area» — barre ordinate dalla percentuale più bassa alla più alta senza dichiararlo; l'area «Altro / Esplorazione» usa una barra rossa che si legge come «allarme» — dire l'ordinamento e evitare il rosso per un colore d'area.

## andamento-fondo__tab-light.png
- [media] andamento-fondo__tab-light.png — lista «Riflessioni passate / Sessioni del timer / Aree / Grafici» — «Aree» è già raggiungibile dal Profilo e «Grafici» duplica in parte «Costanza» e «Per area»: navigazione ridondante e voci generiche — raggruppare sotto un titolo («Altro») e chiarire cosa contengono «Grafici».
- [bassa] andamento-fondo__tab-light.png — «Riflessioni passate 79» — numero grigio senza etichetta; solo questa riga ha un conteggio — «79 voci» o togliere.
- [bassa] andamento-fondo__tab-light.png — card «Costanza» — conferma: heatmap piccola allineata a sinistra con ~450px vuoti a destra (vedi andamento__tab-light.png).

## scoperte__tab-light.png
- [media] scoperte__tab-light.png — sottotitoli «misurato», «lo noto ogni volta», «notato una volta» — tre gradi di certezza con forme grammaticali diverse (participio vs prima persona presente) e senza spiegare che sono un livello di evidenza — scala esplicita e uniforme: «Certezza: misurata / sempre / una volta», magari con 1–3 puntini.
- [bassa] scoperte__tab-light.png — icone pollice in quadrati bordati a sinistra di ogni riga — sembrano bottoni (stesso aspetto dei bottoni bordati) ma ripetono solo la sezione già indicata dal titolo «Funziona/Non funziona» — icona senza bordo o rimuoverla.
- [bassa] scoperte__tab-light.png — righe senza area («lo noto ogni volta») — l'assenza dell'area sposta il sottotitolo e rende irregolare la colonna — mostrare «Nessuna area» o allineare.
- [bassa] scoperte__tab-light.png — titoli sezione «Funziona 4 / Non funziona 4» — piccoli e grigi come in Da fare, mentre il contenuto è il cuore della pagina; metà schermo vuota sotto — su tablet le due sezioni possono stare affiancate in due colonne.

## scoperte-esperimenti__tab-light.png
- [media] scoperte-esperimenti__tab-light.png — grafico dell'esperimento — l'etichetta «media 3,1» è sovrapposta a un punto dati (il pallino cade sulla «i»/«a») e «media 4,3» tocca i punti a destra; asse X senza date, asse Y solo 1/3/5 — spostare le etichette fuori dall'area dati (a destra della linea o sopra con sfondo), aggiungere date di inizio/fine fase.
- [media] scoperte-esperimenti__tab-light.png — chip «⚑ concluso», «● attivo», «Focus (da check-in, 1–5)», «Minuti dedicati a un'area · Studio / Università» — hanno lo stesso bordo e fondo bianco dei bottoni «+ Nuovo esperimento» e «Salvala in «Funziona»»: stato e metrica sembrano azionabili — chip di stato senza bordo con fondo colorato, metrica come testo/etichetta.
- [bassa] scoperte-esperimenti__tab-light.png — testi descrittivi (introduzione e «La modifica: …») — limitati a ~420px dentro card da 680px, lasciando una colonna vuota a destra, mentre il riquadro del risultato usa tutta la larghezza — larghezza di lettura uniforme in tutta la card.
- [bassa] scoperte-esperimenti__tab-light.png — «Salvala in «Funziona»» — virgolette basse annidate dentro un bottone, poco naturale — «Aggiungi a Funziona».

## scheda-scoperta__tab-light.png
- [media] scheda-scoperta__tab-light.png — due gruppi di scelta «Quanto ne sei sicuro» e «Esito» — chip non selezionati grigi nel primo, bianchi nel secondo; tutte le etichette in minuscolo («notato una volta», «funziona») — stesso componente segmented, maiuscola iniziale.
- [media] scheda-scoperta__tab-light.png — «Esito» (funziona/non funziona) nascosto sotto «Dettagli» — è l'informazione principale della scoperta (decide la sezione in cui appare), ma è trattato come dettaglio secondario sotto la certezza — spostarlo subito sotto il testo.
- [bassa] scheda-scoperta__tab-light.png — titolo «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione; «Quanto ne sei sicuro» senza «?» e solo al maschile — titolo «Scoperta», domanda «Quanto ne hai la certezza?».
- [bassa] scheda-scoperta__tab-light.png — riga «Area · Studio / Università ⌄» — di nuovo select con freccia nativa, diverso dal chip area usato in altre schede — stesso selettore area ovunque.
- [bassa] scheda-scoperta__tab-light.png — foglio inferiore su tablet con FAB visibile sotto l'overlay (x≈790, y≈1068) — vedi schede precedenti.

## profilo__tab-light.png
- [media] profilo__tab-light.png — nessuna navigazione di ritorno e nessuna voce attiva nella barra inferiore — non c'è titolo «Profilo» né freccia indietro, e nessuna delle tre voci (Oggi/Attività/Andamento) è evidenziata: l'utente non sa dove si trova né come tornare — aggiungere intestazione con «‹ Indietro» e titolo, o mantenere evidenziata la sezione di provenienza.
- [media] profilo__tab-light.png — «109 attività fatte in tutto» — la vista Anno dice 82 attività fatte nel 2026 (e i dati partono da giugno 2026), l'Andamento 81 in 30 giorni: tre totali incompatibili senza spiegazione — definire una sola metrica («cose fatte» = attività + abitudini?) e usarla ovunque.
- [media] profilo__tab-light.png — «Promemoria · bloccati» — stato problematico scritto in grigio come un valore normale, senza colore d'avviso né azione — evidenziare (icona ⚠, testo arancio) e sottotitolo «Riattivali nelle impostazioni del browser».
- [bassa] profilo__tab-light.png — avatar «R» — qui quadrato arrotondato viola pieno, nell'intestazione delle altre schermate cerchio lilla con lettera viola — stessa forma.
- [bassa] profilo__tab-light.png — metà inferiore vuota (y≈550–1035) — su tablet le card possono andare su due colonne o la lista può includere anteprime.

## impostazioni__tab-light.png
- [media] impostazioni__tab-light.png — sezione «Account» — contiene Sincronizzazione e poi, in un secondo gruppo senza titolo, Area predefinita/Timer/Musica/Aspetto che sono preferenze, non account — titolo «Preferenze» per il secondo gruppo.
- [media] impostazioni__tab-light.png — «Sincronizzazione · su questo dispositivo» — formula ambigua: significa che non c'è sincronizzazione? non ha chevron, sembra non toccabile — «Sincronizzazione: spenta (dati solo su questo dispositivo)» e azione per attivarla o spiegazione.
- [media] impostazioni__tab-light.png — «Area predefinita · Automatica ⌄» — unico select (freccia giù) in una lista di righe con chevron ›; «Esporta dati» e «Importa dati» non hanno indicatore alcuno — affordance coerenti per tutte le righe.
- [bassa] impostazioni__tab-light.png — «Backup e ripristino 1» — numero senza etichetta — «1 backup» o data dell'ultimo backup.
- [bassa] impostazioni__tab-light.png — valori in minuscolo («chiedi sempre», «nessuna», «automatico») mentre «Automatica» di Area è maiuscolo — uniformare.
- [bassa] impostazioni__tab-light.png — Impostazioni come bottom sheet sopra il Profilo su tablet — un'intera sezione di navigazione dentro un foglio, con sotto-pagine: su tablet meglio una pagina o un layout master-detail.

## impostazioni-fondo__tab-light.png
- [bassa] impostazioni-fondo__tab-light.png — fondo del foglio — lo scorrimento è di soli ~12px: «Cancella tutti i dati» resta a ~30px dal bordo inferiore e il foglio è tagliato senza margine; manca qualsiasi info in fondo (versione app) — margine inferiore e riga versione.
- [bassa] impostazioni-fondo__tab-light.png — «Rimuovi dati di esempio» e «Cancella tutti i dati» — non hanno sottotitolo che spieghi le conseguenze; il primo non ha indicatore d'azione — breve descrizione sotto ciascuno.
- [bassa] impostazioni-fondo__tab-light.png — restano i difetti di impostazioni__tab-light.png (gruppo «Account» improprio, select nativo, numero «1» senza etichetta).

## imp-timer__tab-light.png
- [media] imp-timer__tab-light.png — «Se prosegui, altri · 25 min» — frase italiana monca e poco chiara — «Se continui, aggiungi 25 min» o «Estensione: 25 min».
- [media] imp-timer__tab-light.png — sezioni «Avvio rapido», «Sessione», «Pomodoro» — tre tipi di timer con «Durata»/«Concentrazione» da 25 min ciascuno, senza una riga che spieghi la differenza — sottotitolo descrittivo per ogni sezione.
- [bassa] imp-timer__tab-light.png — altezza del foglio — passando da Impostazioni (foglio alto, inizia a y≈110) a Timer (inizia a y≈420) il foglio cambia altezza e il contenuto arriva al bordo inferiore tagliato — altezza costante per la navigazione interna del foglio.
- [bassa] imp-timer__tab-light.png — link «‹ Impostazioni» — piccolo (12px) sopra il titolo, area di tocco ridotta — bottone indietro di 44px allineato al titolo.

## imp-musica__tab-light.png
- [media] imp-musica__tab-light.png — campi «Link della playlist» (9 campi) — fondo quasi identico al contenitore grigio e bordo appena percettibile: i campi non si distinguono come input, sembrano righe di testo grigio — fondo bianco con bordo visibile, come il campo «Nuova attività…».
- [media] imp-musica__tab-light.png — lista «Per area» — 8 campi vuoti sempre visibili rendono la pagina lunga e ripetitiva; nessuna icona/colore area come nel resto dell'app — mostrare solo le aree con playlist + «Aggiungi playlist per un'area», con icona area.
- [bassa] imp-musica__tab-light.png — primo gruppo «Predefinita» — manca il titolo di sezione (il secondo ha «Per area»), e «Predefinita» ha meno spazio sopra (~14px) rispetto alle altre etichette — titolo «Generale» e padding uniforme.
- [bassa] imp-musica__tab-light.png — interruttore «Apri all'avvio del timer» spento — pomello bianco su binario grigio chiarissimo, poco visibile — più contrasto nello stato spento.
- [bassa] imp-musica__tab-light.png — nota in fondo «Senza pubblicità e a schermo spento serve l'abbonamento…» — informazione utile ma nascosta in fondo dopo 9 campi e a ridosso del bordo — spostarla sotto «Predefinita».

## imp-aspetto__tab-light.png
- [media] imp-aspetto__tab-light.png — «Suoni» e «Vibrazione» dentro «Aspetto» — non sono aspetto; inoltre la vibrazione non esiste sulla maggior parte dei tablet (iPad) e l'opzione andrebbe nascosta — rinominare la pagina «Aspetto e feedback» o spostarli, nascondere Vibrazione se il dispositivo non la supporta.
- [media] imp-aspetto__tab-light.png — altezza del foglio — qui il foglio parte a y≈720, in Musica a y≈120, in Timer a y≈420: navigando nelle sotto-pagine il foglio salta di altezza ogni volta, con il Profilo che riappare dietro — altezza fissa per il foglio Impostazioni o pagina dedicata su tablet.
- [bassa] imp-aspetto__tab-light.png — etichetta «Tema» dentro la card, mentre in Timer/Musica i titoli di gruppo («Avvio», «Per area») stanno fuori dalla card — uniformare la posizione dei titoli.

## aree__tab-light.png
- [media] aree__tab-light.png — interruttori a destra di ogni area — non c'è scritto cosa attivano (area attiva/visibile?); tutti accesi, quindi non si vede l'effetto dello spento — intestazione colonna «Attiva» o sottotitolo, e mostrare le aree spente attenuate.
- [media] aree__tab-light.png — cestino a 30px dall'interruttore — azione distruttiva piccola (14px) accanto a un controllo frequente, senza conferma visibile; e non c'è modo evidente di rinominare o cambiare icona/colore — menu «…» per riga con Rinomina/Colore/Elimina.
- [bassa] aree__tab-light.png — campo «Nuova area · Nome» — fondo grigio uguale alle righe sopra, l'icona libro predefinita sembra un'area già esistente — campo bianco con bordo, icona selezionabile dichiarata («Scegli icona»).
- [bassa] aree__tab-light.png — titolo «Le tue aree» qui, «Aree» nel Profilo e in Andamento — un solo nome.

## sonno-pasti__tab-light.png
- [media] sonno-pasti__tab-light.png — «Promemoria nell'app · Sonno · Dalle 05:00 alle 14:00» e «Pasti · Alle 19:00» — non è chiaro cosa significhino (finestra in cui ricordare di registrare il sonno? un solo promemoria alle 19 per tutti i pasti?) — frase completa: «Chiedimi com'è andato il sonno tra le 05:00 e le 14:00», «Ricordami di segnare i pasti alle 19:00».
- [media] sonno-pasti__tab-light.png — stessa funzione, due interfacce — qui pasti con chip orario/durata e «×», nel pannello della Giornata campi bianchi con select nativi e cestino; qui c'è «Salva», là «Annulla le modifiche» — un solo componente per l'editor dei pasti.
- [bassa] sonno-pasti__tab-light.png — chip orario (23:30, 08:00…) — testo allineato a destra dentro chip larghi, con vuoto a sinistra; orari neri e durate viola — testo centrato e colore unico per i valori modificabili.
- [bassa] sonno-pasti__tab-light.png — «Durata 8h» in grigio senza chip — sembra disabilitato ma è un valore calcolato: dirlo («calcolata») e usare «8 h» coerente con «1 h 30».

## promemoria__tab-light.png
- [media] promemoria__tab-light.png — righe Notifiche disabilitate — testo grigio chiaro su grigio chiarissimo (contrasto molto sotto 4.5:1), orari e interruttori quasi invisibili; ma «Non disturbare» sotto resta attivo e modificabile pur con notifiche bloccate — contrasto minimo leggibile per lo stato disabilitato e disabilitare anche «Non disturbare» (o spiegare che vale per dopo).
- [media] promemoria__tab-light.png — banner «Notifiche bloccate» — testo «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» poco naturale e senza azione — «Per riattivarle apri le impostazioni del sito nel browser (icona 🔒 nella barra degli indirizzi)» + bottone «Riprova».
- [media] promemoria__tab-light.png — riga «Server · da collegare» — termine tecnico senza spiegazione né affordance (nessuna freccia) — «Notifiche anche ad app chiusa: non configurate ›» con spiegazione.
- [bassa] promemoria__tab-light.png — «Ricordami la priorità» — unica voce scritta come comando in prima persona, le altre sono nomi di rituale — «Priorità del giorno».
- [bassa] promemoria__tab-light.png — Non disturbare 23:00–07:00 vs sonno 23:30–07:30 impostato altrove — nessun legame proposto — opzione «Usa gli orari del sonno».

## diario__tab-light.png
- [alta] diario__tab-light.png — select «Relazioni & Sociale ⌄», «Associazioni ⌄» dentro le voci «Completata» — sono <select> nativi del browser non stilizzati (bordo grigio standard, freccia nativa, font diverso), in mezzo al diario; e l'etichetta «Priorità» davanti a un'area è incomprensibile («Priorità: Relazioni & Sociale»?) — sostituire con un chip area stilizzato (o testo) e chiarire «Era una priorità · area Relazioni & Sociale».
- [media] diario__tab-light.png — colonna destra (icona ↶ e orario) — l'icona annulla è 10px più in basso del testo della riga e non allineata con l'orario accanto; il significato di ↶ (annulla l'azione?) non è spiegato e ripetuto su ogni riga — allineare alla prima riga di testo, etichetta/tooltip «Annulla», o mostrarlo solo su hover/swipe.
- [media] diario__tab-light.png — link «‹ Profilo» a x≈22 — fuori dalla colonna del contenuto (che inizia a 77) e titolo «Diario» allineato alla colonna: due allineamenti in verticale; la nav in basso evidenzia «Andamento» mentre nel Profilo nessuna voce era evidenziata — allineare il link alla colonna e coerenza della voce attiva.
- [bassa] diario__tab-light.png — segmented «Cose importanti / Tutto» — piccolo, allineato a sinistra dentro una card larga, diverso dai segmented a tutta larghezza usati altrove — stesso componente.
- [bassa] diario__tab-light.png — voci «Annotato · …» alle 00:30, 02:30, 04:30, 06:30 — dati di esempio a intervalli di 2 ore notturne poco credibili (e «Organizzare cena con il gruppo» completata sia oggi sia ieri) — rendere realistici i dati demo.

## timer-scelta__tab-light.png
- [media] timer-scelta__tab-light.png — opzioni «Avvio rapido 5 min / Sessione 25 min / Pomodoro 25 + 5 min / Cronometro» — nessuna descrizione della differenza (Avvio rapido «se prosegui» aggiunge tempo, Pomodoro ripete?) — una riga di sottotitolo per ciascuna («5 minuti per rompere il ghiaccio, poi decidi se continuare»).
- [bassa] timer-scelta__tab-light.png — titolo del foglio «Timer» — non dice per quale attività parte (Ripasso flashcard) — «Timer per Ripasso flashcard».
- [bassa] timer-scelta__tab-light.png — icone in quadrati bianchi bordati — sembrano bottoni play separati dalla riga; il quadrato «▷» di Avvio rapido in particolare suggerisce un'azione diversa dal tocco sulla riga — icone senza bordo.
- [bassa] timer-scelta__tab-light.png — foglio piccolo ancorato in basso su tablet con ~130px vuoti tra contenuto e foglio — su tablet popover accanto al bottone «Timer» che lo apre.

## timer-concentrazione__tab-light.png
- [media] timer-concentrazione__tab-light.png — due uscite ambigue — «✕» in alto a destra e «Termina sessione» sotto i bottoni: non è chiaro se la ✕ mette in pausa, chiude lasciando il timer in corso o termina; «Termina sessione» usa l'icona calendario-con-✕ di «Termina l'abitudine», suggerendo che si cancelli l'abitudine — chiarire («Riduci a icona» per la ✕), icona stop ■ per Termina sessione.
- [bassa] timer-concentrazione__tab-light.png — link «Termina sessione» e «Cambia timer» — grigio medio su nero, piccoli (13px): contrasto e target di tocco al limite — schiarire e aumentare l'area di tocco.
- [bassa] timer-concentrazione__tab-light.png — bottone «Pausa» lilla chiarissimo su fondo nero — è l'elemento più luminoso dello schermo e abbaglia in modalità concentrazione, più del CTA «Fatto» — bottone scuro con bordo per Pausa.
- [bassa] timer-concentrazione__tab-light.png — uso dello spazio su tablet — timer di 260px al centro di uno schermo 834×1112, con 250px vuoti sopra e sotto — cifre e anello più grandi su tablet (es. 360–400px).

## cattura__tab-light.png
- [media] cattura__tab-light.png — popup di cattura — non dice dove finirà la nota (in «Da sistemare»), e il placeholder «Scrivi una nota…» usa «nota» mentre nel resto dell'app le cose catturate si chiamano «attività»/«idee» e l'indice parla di «pensiero» — sottotitolo «Finisce in Da sistemare» e un termine unico.
- [bassa] cattura__tab-light.png — bottone «Salva» disabilitato — bianco su lilla chiaro, contrasto basso (~2:1) — testo più scuro nello stato disabilitato.
- [bassa] cattura__tab-light.png — riga inferiore con solo «Chiudi» a destra — un'intera fascia per un link, con separatore che parte a 6px dal bordo (inset non coerente con il padding di 16px del campo) — spostare «Chiudi» come ✕ in alto o mettere suggerimento tastiera (Invio per salvare) a sinistra.

## menu-oggi-avatar__tab-light.png
- [media] menu-oggi-avatar__tab-light.png — tocco sull'avatar da Oggi — apre direttamente la pagina Profilo (identica a profilo__tab-light.png) senza transizione/titolo e senza modo visibile di tornare a Oggi se non la nav, in cui «Oggi» non risulta più selezionato: si perde il contesto — evidenziare ancora «Oggi» o aggiungere «‹ Oggi» in alto; in alternativa un menu a tendina dall'avatar.
- [bassa] menu-oggi-avatar__tab-light.png — restano i difetti di profilo__tab-light.png (totale «109» incoerente, «bloccati» non evidenziato, metà pagina vuota).

## trascinamento-in-corso__tab-light.png
- [media] trascinamento-in-corso__tab-light.png — anteprima di rilascio 12:45–14:15 — si sovrappone completamente al blocco «Pranzo» senza alcun avviso di conflitto; il testo «Pranzo» resta leggibile sotto la velatura, creando confusione — segnalare la sovrapposizione (bordo arancio, «si sovrappone a Pranzo») o affiancare i blocchi.
- [media] trascinamento-in-corso__tab-light.png — zona di rilascio «Togli l'orario» — più larga della colonna (16–818px contro 77–757), copre la parte bassa del calendario (Camminata tagliata) proprio mentre si trascina — allinearla alla colonna e/o collocarla dove non copre slot utili (in alto o accanto alla nav).
- [bassa] trascinamento-in-corso__tab-light.png — orario ripetuto due volte — fumetto «alle 12:45» e etichetta «12:45–14:15» dentro l'anteprima, quest'ultima incollata al bordo superiore sinistro sopra la linea delle 13:00 — tenerne una sola (nel fumetto) con l'intervallo completo.
- [bassa] trascinamento-in-corso__tab-light.png — banner «Dati di esempio · Rimuovi · ✕» — compare solo in questa schermata (nelle altre catture no), spinge giù tutto di 59px; «Rimuovi» e «✕» affiancati sono ambigui (la ✕ cancella i dati o nasconde il banner?) — chiarire «Nascondi» e mostrare il banner in modo coerente.
- [bassa] trascinamento-in-corso__tab-light.png — blocco originale durante il trascinamento — resta al suo posto quasi trasparente ma con la linea delle 10:30 sopra: va bene come «fantasma», ma il contrasto è così basso che sembra un errore di rendering — bordo tratteggiato per l'originale.

## Riassunto

Ho esaminato tutti i 44 screenshot (tablet 834×1112, tema chiaro). Ho annotato 201 problemi: 6 di gravità alta, 91 media e 104 bassa. Non c'è nessuno screenshot senza difetti. Due coppie di screenshot sono identiche al byte: scheda-attivita e scheda-attivita-fondo, profilo e menu-oggi-avatar.

### 1. Dati e numeri incoerenti tra schermate (gravità alta e media)
- **Alta** — andamento: la serie dice «38 giorni di fila», ma nella striscia dei 7 giorni venerdì risulta non fatto.
- **Alta** — rituale-settimana: il bilancio della settimana mostra «6/7 giorni attivi · 10 attività fatte». La vista Settimana (17–23 ago, oggi è martedì) dice invece «4 di 24 fatte». Il periodo non è dichiarato.
- **Alta** — giornata-mese: la lista «Oggi» non è in ordine di orario (22:00, nessun orario, 18:00, 09:30, 15:00).
- **Media** — i totali non tornano tra loro:
  - Agosto: 17 giorni attivi nella vista Anno, 18 nella vista Mese.
  - Attività fatte: 109 nel Profilo, 82 nell'anno (vista Anno), 81 in 30 giorni (Andamento), 58 in agosto (vista Mese).
  - Nessuna schermata dice se le abitudini sono incluse.
- **Media** — scheda-attivita-fondo: l'attività è nella sezione «Importanti», ma l'interruttore «Fissa in alto» è spento.

### 2. Testi italiani, refusi ed etichette (gravità alta e media)
- **Alta** — scheda-attivita: c'è scritto «Giovedi» senza accento.
- Ci sono numeri senza etichetta in molte schermate:
  - «38 giorni» in Adesso, «1 di 3» in Da fare, «🔥3» nelle Abitudini;
  - i numeri verdi nei mesi della vista Anno, «Riflessioni passate 79», «Backup 1»;
  - «XP», che nessuna schermata spiega.
- Formule ambigue o poco naturali:
  - «da fare · 2 di 3» nei Rituali;
  - «Se prosegui, altri» nelle impostazioni del Timer;
  - «Non ce l'ho fatta» nella scheda attività;
  - «Server · da collegare» e «Sincronizzazione · su questo dispositivo»;
  - il banner sulle notifiche bloccate;
  - i promemoria «Dalle 05:00 alle 14:00».
- I bottoni sono nomi di sezione invece di azioni: «Oggi / Da fare» in Da sistemare.
- Uno stesso oggetto ha nomi diversi: «Fine giornata» / «Review della sera»; «Bilancio» / «Review della settimana»; «Le tue aree» / «Aree»; «nota» / «pensiero».
- Le domande del bilancio settimanale non hanno il punto interrogativo.
- Maiuscole incoerenti nei chip e nei valori.
- I livelli di certezza delle Scoperte hanno forme grammaticali diverse tra loro.

### 3. Controlli nativi non stilizzati e affordance poco chiare (gravità alta e media)
- **Alta** — diario: dentro le voci ci sono `<select>` nativi del browser non stilizzati, con l'etichetta incomprensibile «Priorità: Relazioni & Sociale».
- Select con freccia nativa nelle schede attività e scoperta e nelle Impostazioni («Area predefinita»).
- Input orario nativi nel rituale Sonno e pasti.
- Campi «Link della playlist» quasi indistinguibili dal fondo.
- Interruttori spenti quasi invisibili.
- Icone senza etichetta:
  - orologio in «Senza orario»;
  - calendario sui passi;
  - icone d'area isolate a destra;
  - icona ↶ in ogni riga del Diario;
  - interruttori nella pagina Aree;
  - terzo bottone ⏱ dei pasti.
- Elementi che sembrano bottoni ma non lo sono: le icone pollice bordate, i chip di stato e di metrica degli Esperimenti, i quadratini area nel Mese.
- La lista «In coda» di Da sistemare è testo semplice, senza affordance.

### 4. Uso dello spazio su tablet (gravità alta e media)
- **Alta** — rituale-sera: nella valutazione per area i bottoni 1–5 vanno a capo sotto il nome. Ogni riga è mezza vuota e il rituale diventa lunghissimo.
- Molte schermate hanno il 40–65% dello schermo vuoto: Adesso, Rituali, Da sistemare, Abitudini, Scoperte, Profilo. Sul tablet mancano layout a due colonne o master-detail.
- La heatmap «Costanza» usa circa 200 dei 680px disponibili.
- Nel modulo «Nuova abitudine» i cerchi dei giorni sono sparpagliati su 650px.
- Il pannello pasti ha i campi spinti tutti a destra, con circa 430px vuoti in mezzo.
- Il timer di concentrazione è piccolo al centro dello schermo.
- I testi descrittivi degli Esperimenti sono larghi la metà della card.
- Tutte le schede si aprono come bottom sheet da telefono:
  - il FAB resta visibile sopra l'overlay;
  - il foglio è tagliato in basso, senza margine;
  - l'altezza salta da una sotto-pagina all'altra delle Impostazioni.
  - Su tablet servono dialog centrati o pannelli laterali.

### 5. Componenti incoerenti tra schermate (media)
- Spunte di completamento in tre forme: cerchio, quadrato, cerchio colorato. Stanno ora a sinistra, ora a destra.
- «Giorno fatto» ha tre linguaggi visivi diversi: anelli verdi nel Mese, heatmap blu nell'Anno, pallini pieni nella scheda abitudine. Nessuno ha una legenda.
- Due scale 1–5 diverse: Check-in e Fine giornata.
- Due editor diversi per i pasti: pannello della Giornata e Profilo › Sonno e pasti.
- L'area è un chip viola in alcune schede e un select in altre.
- La «×» per rimuovere un valore è ora dentro il chip, ora fuori.
- Le frecce di navigazione del periodo sono cerchi nel Giorno e quadrati in Settimana, Mese e Anno.
- Il pulsante finale cambia nome e colore: «Fatto» verde, «Fatto» viola, «Salva +5 XP», «Registra +3 XP».
- «Elimina» è una riga di lista in alcune schede e un bottone pieno in altre.
- «Salta oggi» ha l'icona ⏭ in Adesso e ✕ nella scheda.
- Campi «aggiungi» con stili diversi.
- La barra di navigazione non è allineata alla colonna del contenuto.

### 6. Gerarchia, stati e sicurezza (media e bassa)
- Le azioni distruttive sono in mezzo alle altre: «Termina l'abitudine» tra «Salta oggi» e «Apri l'abitudine»; cestini piccoli accanto agli interruttori nella pagina Aree.
- Stati poco visibili:
  - la scheda di un'attività fatta non lo dice;
  - i giorni passati non mostrano le cose mancate;
  - «Promemoria bloccati» è scritto in grigio come un valore normale;
  - «Registra» disabilitato a basso contrasto, senza spiegare perché.
- Navigazione:
  - nel Profilo non c'è titolo né modo di tornare indietro, e nessuna voce della nav è attiva;
  - nel Diario è attiva «Andamento»;
  - il link «‹ Profilo» è fuori colonna;
  - l'intestazione Giorno/Settimana non resta fissa durante lo scorrimento.
- Grafici: etichette «media» sovrapposte ai punti, legenda duplicata nel Check-in, giorni senza dati non segnalati, il titolo del grafico è più grande del rituale che lo contiene.
- Trascinamento:
  - la sovrapposizione con il Pranzo non viene segnalata;
  - la zona «Togli l'orario» è più larga della colonna e copre il calendario;
  - il banner «Dati di esempio» compare solo in quella schermata.
- Artefatti di sfondo: un alone grigio sotto la nav e una macchia viola in alto a destra.

I file:
- Note per screenshot: /tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/rev/giro-5/revisore-tab.md
