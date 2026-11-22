# Revisione UX/UI — computer 1280×800 (giro 3)

## oggi-adesso__pc-light.png
- [media] oggi-adesso__pc-light.png — colonna centrale (x≈385–1143) — contenuto stretto a ~760px su 1030 disponibili, con ~140px vuoti a destra e quasi metà schermo vuota sotto «Poi»: layout da telefono ingrandito — su ≥1200px usare due colonne (card «adesso» a sinistra, «Poi»/ritiro rituali a destra) o allargare a ~880px e alzare il contenuto.
- [media] oggi-adesso__pc-light.png — segmented control in alto (Adesso / La giornata / Rituali) — la barra ha un riquadro grigio con bordo e il pill bianco attivo dentro: riquadro nel riquadro, e l'avatar «R» a destra è staccato e più alto (cerchio 44px vs barra 40px) — allineare altezze/centri e togliere il bordo esterno.
- [media] oggi-adesso__pc-light.png — badge «1» davanti a «Rituali» — numero PRIMA dell'etichetta, mentre nella sidebar il badge «6» sta DOPO «Attività»: incoerente; inoltre non si capisce cosa conti (1 rituale da fare?) — badge sempre a destra dell'etichetta, stile identico alla sidebar.
- [bassa] oggi-adesso__pc-light.png — badge serie «🔥 38 giorni» in alto a destra — «giorni» è grigio piccolissimo (~11px) accanto a «38» arancione: gerarchia sbilanciata e scopo non spiegato (38 giorni di cosa?) — tooltip/etichetta «38 giorni di fila», testo secondario almeno 12–13px.
- [media] oggi-adesso__pc-light.png — barra di avanzamento «1 di 2» sotto la data — non è chiaro 1 di 2 cosa (attività? rituali?), larga solo 175px e scollegata dal resto — aggiungere soggetto («1 di 2 fatte oggi») o eliminarla.
- [media] oggi-adesso__pc-light.png — card principale «Ripasso flashcard» — molto spazio verticale sprecato: chip «Abitudine» isolato fra area e titolo, gap 30px sopra il pulsante; pulsante «Fatto» a tutta larghezza (720px) enorme su desktop — su desktop limitare il pulsante (es. 240px) e affiancare Timer / Salta oggi sulla stessa riga.
- [bassa] oggi-adesso__pc-light.png — «Salta oggi ⏭» — è un link senza contorno accanto a un pulsante bordato «Timer»: due azioni dello stesso livello con stili diversi; l'icona ⏭ dopo il testo è insolita — stesso stile secondario (ghost) per entrambi, icona prima del testo.
- [bassa] oggi-adesso__pc-light.png — card «Pianifica la giornata / Un minuto» — «Un minuto» come sottotitolo è ambiguo (durata stimata?) — «Ci vuole 1 minuto».
- [bassa] oggi-adesso__pc-light.png — riga «Confrontare piani telefonici» — cerchio di spunta 26px allineato al titolo e non al centro della riga a due linee; area/ora «Finanze · 15:00» in 11px grigio chiaro, poco leggibile.
- [bassa] oggi-adesso__pc-light.png — sidebar, «Aggiungi una nota [C]» — la scorciatoia «C» non corrisponde a nessuna parola (nota/cattura?) e il popup si chiama «Scrivi un pensiero»: tre nomi diversi per la stessa funzione — un solo nome («Nota veloce»).
- [bassa] oggi-adesso__pc-light.png — sidebar in basso «Dati salvati su questo dispositivo» — informazione tecnica occupa spazio fisso, testo va a capo male — spostarla in Impostazioni o renderla icona con tooltip.
- [bassa] oggi-adesso__pc-light.png — sidebar, voci non attive «Attività»/«Andamento» — hanno uno sfondo grigio pieno come fossero pulsanti, quasi uguale alla voce selezionata: lo stato attivo si distingue solo per il tinta viola — voci inattive senza sfondo, hover leggero.

## giornata-giorno__pc-light.png
- [media] giornata-giorno__pc-light.png — intestazione «‹ Oggi ›» — mostra solo «Oggi», la data (Martedì 18 agosto) sparisce appena si cambia scheda; quando si naviga a un altro giorno serve la data comunque — «Oggi · mar 18 ago».
- [media] giornata-giorno__pc-light.png — doppia fila di schede (Adesso/La giornata/Rituali + Giorno/Settimana/Mese/Anno) — due livelli di tab con stili diversi (segmented grigio vs pill viola) uno sotto l'altro: gerarchia confusa e 110px di intestazione — su desktop mettere Giorno/Settimana/Mese/Anno a destra della riga «‹ Oggi ›» come in Google/Apple Calendar.
- [media] giornata-giorno__pc-light.png — blocco «Organizzare cena con il gruppo» (09:30–11:00) — testo centrato verticalmente nel blocco invece che in alto; la linea «adesso 10:30» attraversa il blocco e passa a 2px sotto l'orario «09:30–11:00», sovrapponendosi alla scritta — testo allineato in alto; linea «adesso» sotto i blocchi (z-index) o semitrasparente all'interno.
- [bassa] giornata-giorno__pc-light.png — blocco completato — è barrato ma mantiene colore pieno e la spunta verde in alto a destra è staccata dal titolo (allineata al bordo, non alla riga del titolo) — attenuare i completati (opacità 60%) e allineare la spunta con la prima riga.
- [media] giornata-giorno__pc-light.png — casella vuota del blocco «Confrontare piani telefonici» (bordo bianco su giallo) — quasi invisibile, sembra un riquadro rotto — bordo più scuro (colore dell'area) e stessa forma della spunta del blocco completato (che è quadrata piena verde mentre altrove le spunte sono cerchi).
- [bassa] giornata-giorno__pc-light.png — maniglie «⠿» a sinistra dei blocchi — compaiono sempre, aggiungono rumore; il blocco rosa ha la maniglia su una fascia di colore diverso da quello del blocco (rosa vs grigio) — mostrare le maniglie solo in hover; fascia colorata sottile (4px) senza maniglia.
- [bassa] giornata-giorno__pc-light.png — riga riassunto sonno «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — icone pasti senza etichetta né orario, incomprensibili; sembra un campo e non si capisce che si apre — testo «Sonno 23:30–07:30 · 3 pasti» + chevron con etichetta «Modifica».
- [bassa] giornata-giorno__pc-light.png — fascia 07:00–07:30 a righe diagonali — non c'è legenda: non si capisce che è sonno — aggiungere etichetta «Sonno» dentro la fascia come per Colazione/Pranzo.
- [bassa] giornata-giorno__pc-light.png — etichette ore (07:00…) — stanno sopra la linea della griglia invece che centrate sulla linea, così sembra che l'ora indichi lo spazio sotto ma è sfasata di ~8px — centrare l'etichetta sulla linea (convenzione calendari).
- [bassa] giornata-giorno__pc-light.png — colonna calendario — la griglia parte alle 07:00 e i pasti (grigi pieni con bordo) hanno lo stesso peso visivo delle attività — pasti come fasce più leggere (solo testo/tratteggio), attività piene.

## giornata-giorno-fondo__pc-light.png
- [media] giornata-giorno-fondo__pc-light.png — intera pagina — scorrendo spariscono schede, navigazione giorno e data: su desktop il calendario dovrebbe scorrere dentro il suo riquadro con intestazione fissa (sticky) — rendere sticky la riga «‹ Oggi › / Giorno-Settimana…».
- [media] giornata-giorno-fondo__pc-light.png — blocco «Leggere 20 minuti» (22:00) — alto ~24px: l'orario non c'è, la casella quadrata tocca il bordo verde e quasi esce dal blocco — per blocchi brevi layout su una riga «Leggere 20 minuti · 22:00–22:20» e casella ridotta centrata.
- [media] giornata-giorno-fondo__pc-light.png — abitudini (Camminata, Leggere) con solo bordo verde e sfondo bianco vs attività piene colorate — due linguaggi visivi senza legenda; il verde dei bordi è lo stesso del «fatto», quindi sembrano già completate — usare il colore dell'area anche per le abitudini, distinguerle solo con l'icona ↻.
- [media] giornata-giorno-fondo__pc-light.png — sezione «Senza orario», riga «Ripasso flashcard» — la casella è quadrata mentre in Adesso le spunte sono cerchi; l'icona 🕐 viola a destra non ha etichetta (assegna orario? non si capisce) — stessa forma di spunta ovunque; pulsante «Dai un orario» con testo o tooltip.
- [bassa] giornata-giorno-fondo__pc-light.png — «Senza orario 1» — badge contatore grigio e icona orologio piccolissimi; titolo sezione 13px poco distinguibile dalla griglia — titolo sezione coerente con «Poi» della pagina Adesso (16–18px bold).
- [media] giornata-giorno-fondo__pc-light.png — campo «Nuova attività… [+ Aggiungi]» in fondo al calendario — nascosto in fondo alla pagina, l'utente deve scorrere 17 ore per aggiungere; inoltre non dice se l'attività va oggi senza orario — spostarlo in alto o renderlo pulsante fisso; placeholder «Aggiungi a oggi…».
- [media] giornata-giorno-fondo__pc-light.png — link «Sposta 1 non fatta a domani» — italiano zoppo (manca il sostantivo) e non dice quale — «Sposta a domani l'attività non fatta (1)»; posizionarlo vicino alla sezione relativa.
- [bassa] giornata-giorno-fondo__pc-light.png — fascia tratteggiata 23:30–00:00 — la griglia si chiude a 00:00 tagliando il sonno; il bordo inferiore del riquadro taglia la fascia — etichetta «Sonno» e fine griglia coerente.
- [bassa] giornata-giorno-fondo__pc-light.png — icona libro blu accanto a «Ripasso flashcard» — in Adesso la stessa voce è etichettata «Abitudine» con icona ↻, qui icona area: incoerenza di simboli tra viste.

## giornata-settimana__pc-light.png
- [alta] giornata-settimana__pc-light.png — larghezze incoerenti — la vista Settimana si allarga a ~955px (x 287–1241) mentre la barra Adesso/La giornata/Rituali resta larga 760px centrata: la barra in alto è disallineata rispetto a schede e calendario (bordo sinistro 385 vs 287) e il layout «salta» passando da Giorno a Settimana — usare un'unica larghezza di contenuto per tutta la sezione (o allineare tutto a sinistra con la stessa griglia).
- [media] giornata-settimana__pc-light.png — intestazioni giorno «17 ago+4», «18 ago+1» — il «+4»/«+1» è attaccato alla data senza spazio, in grassetto, senza spiegazione (cose senza orario? altre attività?) — badge separato con tooltip, es. pallino «4» o «+4 senza orario».
- [media] giornata-settimana__pc-light.png — blocco «Organizzare cena con il gruppo» (mar) — il pill «10:30» della linea adesso copre metà del testo del blocco; testo barrato su due righe in 10px illeggibile — linea adesso sotto il blocco, pill nella colonna delle ore a sinistra.
- [media] giornata-settimana__pc-light.png — blocchi «Camminata /…» — titolo troncato a 11 caratteri anche se c'è spazio per due righe, e la barra «/» diventa «/…» — consentire 2 righe e rinunciare al bordo spesso; abbreviare con ellissi solo al bisogno.
- [bassa] giornata-settimana__pc-light.png — Lun «Camminata» barrata con bordo grigio — lo stato «fatto» in settimana è grigio, nel giorno la spunta è verde: incoerente.
- [bassa] giornata-settimana__pc-light.png — pasti come rettangoli grigi con solo icona (☕, 🍴) ripetuti 7 volte — rumore visivo che compete con le attività vere — renderli fasce leggerissime o nasconderli in settimana.
- [bassa] giornata-settimana__pc-light.png — titolo «17–23 ago» allineato a sinistra accanto alla freccia, mentre in Giorno «Oggi» è centrato tra le frecce: stessa intestazione con due impaginazioni diverse — uniformare.
- [bassa] giornata-settimana__pc-light.png — colonna oggi (Mar) — evidenziata con sfondo lilla e angoli arrotondati che sporgono sopra la griglia: bene, ma il giorno nell'intestazione non ha un cerchio/pill come convenzione — aggiungere numero cerchiato.

## giornata-mese__pc-light.png
- [media] giornata-mese__pc-light.png — griglia del mese — anelli di avanzamento e pallini colorati sotto i numeri senza alcuna legenda: non si capisce cosa misuri l'anello (% fatto?) né cosa siano i pallini (aree? attività?) — legenda sotto la griglia o tooltip in hover con «4 di 5 fatte».
- [media] giornata-mese__pc-light.png — righe della griglia — si mostrano i giorni di luglio (27–31) ma non quelli di settembre: l'ultima riga contiene solo «31» e lascia 6 celle vuote — completare con 1–6 settembre attenuati o, viceversa, togliere anche luglio.
- [media] giornata-mese__pc-light.png — su desktop la vista Mese non mostra nessun contenuto delle giornate (titoli attività), solo anelli: spreco dello spazio disponibile (celle ~130×60) — su schermo largo mostrare 2–3 titoli per cella come un calendario vero.
- [bassa] giornata-mese__pc-light.png — giorno 18 (oggi) — cerchio viola pieno con l'anello verde che ci si sovrappone a metà, più un rettangolo grigio di selezione intorno: tre segnali sovrapposti — scegliere uno stile per «oggi» e uno per «selezionato».
- [bassa] giornata-mese__pc-light.png — riga «18 giorni attivi · 58 cose fatte» — «cose fatte» è colloquiale/vago — «58 completate»; allineare la riga al bordo interno della card (ora è a x=291, la card a 287: 4px di sfasamento, mentre la card ha padding 16px).
- [media] giornata-mese__pc-light.png — lista «Oggi» sotto il calendario — i quadratini colorati (verde, blu) davanti a «Leggere 20 minuti»/«Ripasso flashcard» sembrano caselle da spuntare ma sono indicatori di area; altrove la spunta è un cerchio — usare un pallino pieno per l'area, non un quadrato vuoto.
- [bassa] giornata-mese__pc-light.png — intestazioni L M M G V S D — due «M» uguali (martedì/mercoledì) ambigue su desktop dove c'è spazio — usare «Lun Mar Mer…» come nella vista Settimana.

## giornata-anno__pc-light.png
- [alta] giornata-anno__pc-light.png — card «Ago» in alto a destra mostra «17» giorni attivi, mentre la vista Mese dello stesso agosto dice «18 giorni attivi» — dati incoerenti tra viste — usare la stessa definizione (oggi incluso o no) in entrambe.
- [media] giornata-anno__pc-light.png — riquadro riassunto «49 giorni attivi / 82 fatte / 1874 XP» — «XP» non è spiegato in nessun punto e appare solo qui; «fatte» senza sostantivo (in Mese è «cose fatte») — etichette coerenti («completate»), XP con tooltip o rimossi se la gamification non c'è altrove.
- [media] giornata-anno__pc-light.png — mini-calendari dei mesi — nessuna legenda dell'intensità di verde, nessun numero di giorno né intestazione giorni della settimana: impossibile capire che giorno è un quadrato — legenda «meno ▢▢▢▢ più» e tooltip con data e conteggio.
- [media] giornata-anno__pc-light.png — griglia 4×3 di card alte ~235px — su 800px di altezza si vedono solo 8 mesi, serve scorrere per vedere tutto l'anno; card con spazio bianco sotto di altezza diversa (mesi a 5 o 6 righe) — heatmap annuale compatta in stile GitHub (una riga continua) o card più basse/6 colonne.
- [bassa] giornata-anno__pc-light.png — mesi senza dati (Gen–Mag) — riempiti di quadrati grigi pieni che pesano quanto i dati: molto rumore — quadrati vuoti più chiari o solo contorno.
- [bassa] giornata-anno__pc-light.png — numeri verdi «7», «25», «17» in alto a destra delle card — senza unità, piccoli (11px) — «7 giorni».

## giornata-sonno-aperto__pc-light.png
- [media] giornata-sonno-aperto__pc-light.png — bordo superiore — la riga delle schede Giorno/Settimana/Mese/Anno è tagliata a metà dal bordo della finestra (aprendo il pannello la pagina scorre o le schede non sono sticky) — intestazione sticky con sfondo, oppure non scorrere all'apertura.
- [media] giornata-sonno-aperto__pc-light.png — campi «A letto 23:30» e «Sveglia 07:30» — larghi ~290px ciascuno per 5 caratteri, mentre i campi orario dei pasti sono larghi 95px: stesso tipo di dato, due misure — campi orario tutti ~100px, allineati in una colonna.
- [media] giornata-sonno-aperto__pc-light.png — righe Colazione/Pranzo/Cena — etichetta a sinistra e controlli spinti all'estremo destro con ~450px di vuoto in mezzo: l'occhio deve attraversare lo schermo — controlli subito dopo l'etichetta (griglia a 3 colonne compatta) o max-width del pannello ~520px.
- [media] giornata-sonno-aperto__pc-light.png — selettori «15 min ⌄» — select nativi con freccia di sistema, stile diverso dagli altri campi; non dice cosa rappresenta (durata) — etichetta «durata» e select stilizzato.
- [media] giornata-sonno-aperto__pc-light.png — icone cestino accanto ai pasti — 12px, senza area di clic adeguata, attaccate al select e al bordo destro — pulsante icona 32px con margine, conferma o annulla.
- [media] giornata-sonno-aperto__pc-light.png — azioni «+ Pasto · Ripristina · Ritmo di base» — tre link identici: non si capisce la differenza fra «Ripristina» e «Ritmo di base» né se le modifiche valgono solo per oggi o per sempre — testi espliciti («Solo oggi» / «Usa il mio orario abituale» / «Salva come orario abituale»), e indicare l'ambito in testa al pannello.
- [bassa] giornata-sonno-aperto__pc-light.png — pannello aperto — la riga riassunto «23:30 → 07:30 · 8h · icone» resta identica in testa anche da aperto (informazione ripetuta) — da aperto mostrare titolo «Sonno e pasti di oggi».
- [bassa] giornata-sonno-aperto__pc-light.png — «A letto»/«Sveglia» hanno icona, i pasti no; testo etichette pasti 15px bold vs 13px delle altre — uniformare.

## giornata-scheda-blocco__pc-light.png
- [media] giornata-scheda-blocco__pc-light.png — titolo modale «Organizzare cena / con il gruppo» — va a capo dopo ~200px pur avendo 380px disponibili (max-width troppo stretto per la X) — titolo su tutta la larghezza meno 40px della X.
- [bassa] giornata-scheda-blocco__pc-light.png — pulsante X — allineato al centro del titolo a due righe e non alla prima riga — allinearlo in alto.
- [media] giornata-scheda-blocco__pc-light.png — «↺ Segna come da fare» — testo grigio centrato senza contenitore, non sembra un pulsante e non dice che l'attività è già fatta — mostrare lo stato («✓ Fatta alle 10:12») + pulsante secondario «Segna come non fatta».
- [media] giornata-scheda-blocco__pc-light.png — righe Ora / Durata — «09:30» in nero, «1 h 30» in viola: stessi chip con colori diversi; «1 h 30» è una forma insolita — chip uniformi, formato «1 h 30 min».
- [bassa] giornata-scheda-blocco__pc-light.png — X grigie dentro i chip Ora/Durata — rimuovono l'orario? non è chiaro e sono a 4px dal testo — tooltip «Togli orario», o voce separata.
- [bassa] giornata-scheda-blocco__pc-light.png — sottotitolo «Attività · Oggi» — ridondante e povero; manca accesso a note/passi della attività (la scheda completa ha passi e note) — link «Apri dettagli».
- [bassa] giornata-scheda-blocco__pc-light.png — due gruppi grigi annidati in una modale bianca (riquadri in riquadro) con «Sposta in Da fare» ed «Elimina» nello stesso gruppo — azione distruttiva staccata in fondo, senza sfondo.
- [bassa] giornata-scheda-blocco__pc-light.png — sfondo — la modale è centrata sulla finestra (x=640) e non sul contenuto (x≈764), e le schede in alto restano tagliate — accettabile, ma meglio un pannello laterale a destra su desktop che non copre il calendario.

## giornata-scheda-abitudine__pc-light.png
- [media] giornata-scheda-abitudine__pc-light.png — pulsante «✓ Fatta» — qui è un grande pulsante verde pieno, nella pagina Adesso è «Fatto» (maschile) e nella scheda attività completata è un link grigio: tre forme e due generi per la stessa azione — un solo componente e un'unica etichetta («Fatto»).
- [media] giornata-scheda-abitudine__pc-light.png — gruppo azioni — «Termina l'abitudine» (rossa, distruttiva) sta in mezzo fra «Salta oggi» e «Apri l'abitudine»: facile cliccarla per errore — ordine: Apri / Salta oggi, poi separata in fondo la distruttiva, con conferma.
- [bassa] giornata-scheda-abitudine__pc-light.png — «Apri l'abitudine» — è il modo per vedere i dettagli ma è l'ultima voce di una lista; meglio rendere cliccabile il titolo o mettere un link «Dettagli ›» accanto al titolo.
- [bassa] giornata-scheda-abitudine__pc-light.png — sottotitolo «↻ Abitudine · Oggi» attaccato al pulsante verde (12px) mentre gli altri gruppi hanno 12–16px e il titolo 30px dal sottotitolo: ritmo verticale irregolare — spaziatura costante 16px.
- [bassa] giornata-scheda-abitudine__pc-light.png — chip «Durata 45 min» viola vs «Ora 18:00» nero (come scheda blocco) — uniformare.

## rituali__pc-light.png
- [media] rituali__pc-light.png — scheda «Rituali» in alto — il badge «1» presente nelle altre schede qui sparisce; e comunque 4 rituali risultano «da fare/da compilare»: il numero 1 non corrisponde a nulla di visibile — il badge deve contare ciò che la lista mostra come da fare, e restare visibile.
- [media] rituali__pc-light.png — stati a destra — «da fare», «da compilare», «fatto» (verde) con sottotesto «2 di 3 scelte», «0 di 4»: tre vocaboli per lo stesso concetto; «da fare · 2 di 3 scelte» è contraddittorio (è iniziato?) — stati uniformi: «Da fare», «In corso 2/3», «Fatto ✓», magari come chip.
- [media] rituali__pc-light.png — icona «Piano del giorno» piena viola, le altre chiare — evidenziazione senza spiegazione (è quello consigliato adesso?) — aggiungere etichetta «Ora» o «Consigliato adesso», oppure uniformare.
- [media] rituali__pc-light.png — mancano informazioni di quando fare ogni rituale (mattina, sera, domenica) e quanto dura: la lista è povera — sottotitolo «Mattina · 1 min» come nella card «Pianifica la giornata» di Adesso.
- [media] rituali__pc-light.png — layout — elenco alto 300px in una colonna di 760px, il resto della pagina vuoto (oltre metà schermo) — su desktop aprire il rituale nella parte destra (master-detail) o card in griglia 2×3.
- [bassa] rituali__pc-light.png — chevron ⌄ a destra — suggerisce un'espansione in linea, ma (vedi rituale-*.png) si apre una pagina/foglio — usare › se apre un'altra vista.
- [bassa] rituali__pc-light.png — testi di stato 12px grigio in due righe, allineati a destra e attaccati al chevron (8px) — dare più respiro e leggibilità.

## rituale-piano__pc-light.png
- (correzione a rituali__pc-light.png: il chevron apre davvero una fisarmonica, quindi ⌄ è corretto.)
- [media] rituale-piano__pc-light.png — contenuto del rituale — manca una riga di spiegazione (es. «Scegli fino a 3 cose importanti per oggi»): «2 di 3 scelte» in alto a destra è l'unico indizio del limite — aggiungere istruzione in testa al pannello.
- [media] rituale-piano__pc-light.png — righe «Organizzare cena con il gruppo» / «Confrontare piani telefonici» — nessun controllo per togliere una scelta o riordinare; le icone a destra (persone rosa, cartella gialla) sono icone d'area minuscole e criptiche; «Priorità» viola su un elemento barrato/completato — rimuovi (×) in hover, area come chip con nome, chip «Priorità» solo se attivabile e con stato chiaro.
- [bassa] rituale-piano__pc-light.png — testo barrato grigio chiaro su bianco — contrasto ~2.5:1, sotto WCAG — grigio più scuro (#6b7280).
- [media] rituale-piano__pc-light.png — pulsante «Salva +5 XP» — pulsante a tutta larghezza alto 52px dentro una fisarmonica, molto più pesante di tutto il resto; «+5 XP» è un incentivo di gioco senza contesto (XP compaiono solo qui e in Anno) — pulsante normale allineato a destra, XP spiegati altrove o rimossi.
- [bassa] rituale-piano__pc-light.png — campo «Aggiungi un'altra…» — non dice un'altra cosa — «Aggiungi un'altra priorità…»; il pulsante «+ Aggiungi» testuale dentro il campo è poco visibile.
- [bassa] rituale-piano__pc-light.png — «Quando inizi?» — etichetta 13px bold grigia vicina al campo ma lontana dal blocco sopra solo 16px: non c'è separazione fra «scelte» e «quando inizi»; il campo stesso è a sfondo grigio senza bordo come il campo sopra, ma è un tipo diverso — piccolo titolo di sezione e spaziatura 24px.

## rituale-sonno-pasti__pc-light.png
- [alta] rituale-sonno-pasti__pc-light.png — due pulsanti di conferma nello stesso pannello — «Salva» (lilla, piccolo) sotto il sonno e «Fatto» (viola pieno, a tutta larghezza) in fondo: non è chiaro se «Fatto» salva anche il sonno o se bisogna premerli entrambi — un unico «Salva» finale; il sonno si salva con il resto.
- [media] rituale-sonno-pasti__pc-light.png — stesso dato (sonno e pasti) modificabile in due interfacce diverse: qui righe con orologio e sì/no, nel pannello della Giornata campi orario e select durata — unificare componente e vocabolario.
- [media] rituale-sonno-pasti__pc-light.png — pulsanti «sì» «no» «🕐» a destra dei pasti — minuscoli in minuscolo, senza stato selezionato visibile; l'orologio senza etichetta (cambia orario?) — segmented control «Sì / No / Altro orario» con stato attivo evidente.
- [media] rituale-sonno-pasti__pc-light.png — «Come sempre · 23:30–07:30» in viola a destra di «Sonno» — sembra un link ma non si capisce cosa fa (applica l'orario abituale?) — pulsante «Usa orario abituale».
- [bassa] rituale-sonno-pasti__pc-light.png — righe «A letto 23:30 🕐» — orario e icona orologio sono separati, il valore non sembra un campo modificabile — chip/campo orario cliccabile come altrove.
- [media] rituale-sonno-pasti__pc-light.png — sezione «Altre cose fatte / Una cosa che hai fatto…» dentro il rituale «Sonno e pasti» — non c'entra col titolo — spostarla nel check-in o nella review della sera.
- [bassa] rituale-sonno-pasti__pc-light.png — «Non ricordo» link accanto a «Salva» — azione utile ma ambigua (salta il sonno?) — «Salta, non ricordo».
- [bassa] rituale-sonno-pasti__pc-light.png — pulsante «Fatto» tocca quasi il bordo inferiore della finestra e la card prosegue sotto: il resto della fisarmonica (Check-in…) finisce fuori schermo — su desktop dettaglio in pannello laterale.
- [bassa] rituale-sonno-pasti__pc-light.png — titoli di sezione «Sonno», «Pasti», «Altre cose fatte» 13px grigi, quasi uguali ai sottotesti «di solito alle 08:00» — gerarchia debole.

## rituale-checkin__pc-light.png
- [media] rituale-checkin__pc-light.png — valore selezionato nelle scale 1–5 («4», «5») — il pulsante attivo si alza di ~3px e si allarga rispetto agli altri, rompendo l'allineamento della riga — stato attivo solo con colore/bordo, stessa geometria.
- [media] rituale-checkin__pc-light.png — pulsanti 1–5 larghi ~140×50px ciascuno — enormi per una scala, la riga è 730px: su desktop scale compatte (48px) con etichette accanto — max-width ~420px per la scala.
- [media] rituale-checkin__pc-light.png — verbo del pulsante finale: qui «Registra +3 XP» lilla chiaro, in Piano «Salva +5 XP» viola pieno, in Sonno e pasti «Fatto» viola pieno — tre verbi e due stili per la stessa azione di chiusura rituale — un unico stile e verbo («Salva»).
- [media] rituale-checkin__pc-light.png — stato «✓ fatto» in testa ma il pulsante dice ancora «Registra»: non è chiaro se registrando di nuovo si sovrascrive o si aggiunge un secondo check-in — «Aggiorna check-in delle 9:40» quando già fatto.
- [bassa] rituale-checkin__pc-light.png — etichette estremi «1 · esausto / 3 · normale / 5 · pieno» — l'etichetta «3 · normale» è centrata sulla riga ma non sotto il pulsante 3 (scarto di ~1px ok) mentre «5 · molto concentrato» va a capo potenziale; il punto medio «·» è inutile — etichette sotto i rispettivi pulsanti, senza numero.
- [bassa] rituale-checkin__pc-light.png — «Media recente 4,3» ripetuto tre volte in viola con icona tachimetro — ridondante col grafico «Andamento degli ultimi 14 giorni» subito sotto — tenerne uno.
- [bassa] rituale-checkin__pc-light.png — titolo «Andamento degli ultimi 14 giorni» 20px bold, più grande del titolo del rituale «Check-in» (17px): gerarchia invertita, ed è tagliato dal bordo inferiore.
- [bassa] rituale-checkin__pc-light.png — icone delle domande (batteria, mirino, faccina) 11px — invisibili; domande 13px grigio scuro — domanda 15px.

## rituale-sera__pc-light.png
- [media] rituale-sera__pc-light.png — righe area (Relazioni & Sociale, Finanze, …) — nome area a sinistra su una riga e pulsanti 1–5 a destra sulla riga sotto: ogni riga occupa 84px invece di 44, con un grande vuoto a sinistra dei pulsanti — mettere nome e scala sulla stessa riga (c'è spazio in abbondanza).
- [media] rituale-sera__pc-light.png — scala 1–5 — qui quadratini grigi 36px senza bordo, nel Check-in pulsanti bianchi bordati 140×50: stesso componente, due aspetti — un solo componente scala.
- [bassa] rituale-sera__pc-light.png — legenda «1 = male · 5 = benissimo» inline e grigia accanto alla domanda — facile da perdere; con 5+ aree bisogna scorrere molto prima di arrivare al salvataggio — etichette sotto la prima scala o tooltip, e scala compatta.
- [bassa] rituale-sera__pc-light.png — icone d'area colorate (verde «Salute & Sport» e verde-acqua «Associazioni» quasi uguali) — colori d'area troppo simili tra loro.
- [bassa] rituale-sera__pc-light.png — domanda «Com'è andata, area per area?» — tono ok, ma il rituale si chiama «Fine giornata» qui e altrove (elenco interno) «Review della sera»: verificare che il nome sia unico in tutta l'app.

## rituale-settimana__pc-light.png
- [media] rituale-settimana__pc-light.png — numeri «216 / 10 / 6/7» — in un font serif (tipo Georgia) che non compare in nessun'altra parte dell'app: sembra un fallback di font non caricato — usare il font dell'interfaccia con cifre tabellari.
- [media] rituale-settimana__pc-light.png — «6/7 giorni attivi» di martedì 18, con la settimana 17–23 appena iniziata — dato incoerente (forse ultimi 7 giorni, non «settimana») — specificare «ultimi 7 giorni» o calcolare sulla settimana corrente.
- [media] rituale-settimana__pc-light.png — vocabolario — «azioni completate» qui, «cose fatte» in Mese, «fatte» in Anno, «XP guadagnati» qui ma «XP» in Anno — uniformare un termine («completate»).
- [bassa] rituale-settimana__pc-light.png — riquadro statistiche — tre colonne centrate in un blocco largo ~380px, scollegato dal margine sinistro delle domande (x=400) — allinearlo a sinistra o a tutta larghezza come il riepilogo di Anno.
- [bassa] rituale-settimana__pc-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — senza punto interrogativo; textarea grigie vuote senza placeholder né esempio, tutte alte 48px con maniglia di ridimensionamento visibile — aggiungere «?», placeholder di esempio, autoaltezza.
- [bassa] rituale-settimana__pc-light.png — «Bilancio della settimana · da fare» visibile ogni giorno (oggi è martedì) — rituale settimanale andrebbe proposto solo nel giorno scelto, gli altri giorni «Domenica» in grigio.

## attivita-sistemare__pc-light.png
- [media] attivita-sistemare__pc-light.png — badge sidebar «Attività 6» — coincide con «Da sistemare 6» ma non con «Da fare 9»: non è chiaro cosa conti; inoltre stile badge sidebar (viola pieno) diverso dai badge nelle schede (lilla chiaro) — dichiarare con tooltip «6 da sistemare» e uniformare lo stile.
- [bassa] attivita-sistemare__pc-light.png — etichetta «📥 Da sistemare» sotto la scheda omonima — ripete esattamente la scheda attiva — sostituirla con un'istruzione utile («Decidi dove va ogni nota: oggi, da fare o scarta»).
- [media] attivita-sistemare__pc-light.png — select nativo «Altro / Esplorazione ⌄» — stile di sistema (grigio, bordo, freccia) che stona con il resto; non ha etichetta «Area» — usare il chip area come nelle schede.
- [media] attivita-sistemare__pc-light.png — tre pulsanti «Oggi / Da fare / Scarta» larghi 250px ciascuno — enormi su desktop; «Scarta» ha lo stesso peso di «Da fare», e «Oggi» come verbo non spiega l'azione — pulsanti compatti a destra della card («Fai oggi», «Metti in Da fare», «Scarta» come link rosso), scorciatoie da tastiera visibili (1/2/3).
- [media] attivita-sistemare__pc-light.png — elenco «In coda 5» — mostra 4 voci + «e un'altra» in corsivo pur con 300px vuoti sotto; le voci non sembrano cliccabili né si possono sistemare in blocco — mostrare tutte, cliccabili, con hover; azioni multiple.
- [bassa] attivita-sistemare__pc-light.png — «e un'altra» — italiano generico — «+1 altra nota».
- [bassa] attivita-sistemare__pc-light.png — testo «aggiunta 18 ago, 10:30» grigio 12px attaccato al select (8px) — separarlo con «·» o spostarlo sotto il titolo.

## attivita-dafare__pc-light.png
- [media] attivita-dafare__pc-light.png — righe dell'elenco — nessuna casella per completare un'attività direttamente dall'elenco (in Adesso/Giornata c'è): flusso più lungo — cerchio di spunta a sinistra di ogni riga.
- [media] attivita-dafare__pc-light.png — pulsante «+ Oggi» ripetuto su 9 righe, il primo viola pieno e gli altri lilla: rumore visivo e incoerenza (stato hover catturato o primo evidenziato senza motivo?) — mostrarlo in hover/focus su desktop, stile unico.
- [media] attivita-dafare__pc-light.png — «1 di 3», «1 di 4» in grigio a destra — non si capisce che sono passi completati — «1/3 passi» con icona checklist o mini barra.
- [bassa] attivita-dafare__pc-light.png — filtro «Tutte ⌄» e titolo «Importanti 3» — distanza 6px, troppo attaccati, mentre tra campo e filtro ci sono 16px — 20–24px prima del titolo di sezione.
- [bassa] attivita-dafare__pc-light.png — icone d'area colorate 12px davanti ai titoli — senza nome area non si leggono (matita arancio, lampadina rossa, cuore verde) — mostrare il nome area come meta grigio sotto il titolo, come «scade tra 20 giorni».
- [media] attivita-dafare__pc-light.png — uso dello spazio — colonna da 760px con righe a 60px, solo 9 voci visibili; su desktop mancano raggruppamenti per area/scadenza o una colonna dettaglio — layout master-detail: lista a sinistra, scheda a destra.
- [bassa] attivita-dafare__pc-light.png — «Importanti» / «Altre» — «Altre» suona come scarto — «Il resto» o raggruppare per area.

## attivita-dafare-aggiunta__pc-light.png
- [media] attivita-dafare-aggiunta__pc-light.png — riga opzioni «Oggi / Domani / Senza data / Altro / Esplorazione ⌄» — rientrata di 12px rispetto al campo (x=396 vs 384); il select nativo è alto 42px contro 34px dei chip, quindi non allineato in altezza — stessa altezza, stesso stile chip, allineamento al bordo del campo.
- [media] attivita-dafare-aggiunta__pc-light.png — opzioni della nuova attività e filtro «Tutte» uno sotto l'altro con lo stesso aspetto (pill bianchi bordati): il filtro sembra un'altra opzione del nuovo elemento — raggruppare le opzioni dentro il riquadro del campo (stile composer) e separare chiaramente il filtro.
- [bassa] attivita-dafare-aggiunta__pc-light.png — chip «Senza data» selezionato viola pieno, uguale al pulsante primario «Aggiungi» e a «+ Oggi» della prima riga: troppi elementi viola pieno in competizione — selezione chip in lilla con bordo.
- [bassa] attivita-dafare-aggiunta__pc-light.png — select area senza etichetta e senza icona; manca la possibilità di segnare «Importante» o scegliere una data precisa da qui — aggiungere ★ e «Scegli data…».
- [bassa] attivita-dafare-aggiunta__pc-light.png — il primo «+ Oggi» resta viola pieno anche qui: non è uno stato hover, è un'incoerenza persistente.

## attivita-abitudini__pc-light.png
- [media] attivita-abitudini__pc-light.png — cerchi di spunta grandi (44px) a DESTRA delle righe, colorati come l'area (verde/blu) — altrove la spunta è a sinistra e grigia; un cerchio verde vuoto si legge come «fatto» — stessa posizione e stile di spunta in tutta l'app.
- [media] attivita-abitudini__pc-light.png — campo «Nuova abitudine…» in FONDO all'elenco, mentre in «Da fare» il campo «Nuova attività…» è in CIMA — stesso schema, posizioni opposte — uniformare (in cima).
- [bassa] attivita-abitudini__pc-light.png — intestazione «◯ 0 di 3 / oggi» — anello vuoto grigio 58px e numero 28px molto più grandi di qualunque altro titolo nella sezione; «oggi» isolato su una riga — riga compatta «0 di 3 fatte oggi» con barra.
- [bassa] attivita-abitudini__pc-light.png — meta «🔥 3» solo su Camminata — numero senza unità — «🔥 3 giorni di fila» o tooltip.
- [bassa] attivita-abitudini__pc-light.png — «Ripasso flashcard» senza orario mentre le altre hanno l'orario in grassetto: meta non allineata; manca la frequenza (ogni giorno? 3 volte a settimana?) — mostrare «Ogni giorno» o «Lun Mer Ven».
- [media] attivita-abitudini__pc-light.png — schermo largo — 3 righe e campo, poi 330px vuoti; nessuna visione della settimana per abitudine (classica griglia 7 giorni) che su desktop ha spazio — mostrare la mini-striscia dei 7 giorni a destra di ogni abitudine.

## attivita-abitudini-nuova__pc-light.png
- [bassa] attivita-abitudini-nuova__pc-light.png — intera pagina spostata in su di 14px (barra schede a y=17 invece di 31) — l'apertura delle opzioni fa scorrere la pagina: salto visivo — evitare lo scroll automatico se il pannello è già visibile.
- [media] attivita-abitudini-nuova__pc-light.png — cerchi dei giorni «L M M G V S D» distribuiti su 730px con ~70px tra uno e l'altro — sembrano scollegati; due «M» ambigue — gruppo compatto (36px, gap 8px) allineato a sinistra o a destra della riga «Giorni», etichette «Lun Mar…» in tooltip.
- [media] attivita-abitudini-nuova__pc-light.png — pannello opzioni (Giorni/Ora/Area) separato dal campo «Meditare» da 14px e senza titolo, mentre «Aggiungi» sta nel campo sopra: non è chiaro che le opzioni si applicano alla nuova abitudine prima di premere Aggiungi — unire campo e opzioni in un'unica card, pulsante «Aggiungi» in fondo.
- [bassa] attivita-abitudini-nuova__pc-light.png — riga «Giorni … Ogni giorno» — testo riepilogo grigio a destra ripete ciò che mostrano i 7 cerchi pieni — bastano i cerchi.
- [bassa] attivita-abitudini-nuova__pc-light.png — chip «Ora: Nessuna» grigio-lilla e «Area: Salute & Sport» lilla: chip con stati diversi ma stesso aspetto; manca «Durata» presente nella scheda abitudine — aggiungerla per coerenza.
- [bassa] attivita-abitudini-nuova__pc-light.png — area predefinita «Salute & Sport» per «Meditare» — preselezione arbitraria — lasciare vuoto o ricordare l'ultima area scelta.

## scheda-attivita__pc-light.png
- [alta] scheda-attivita__pc-light.png — velo scuro dietro la modale — la parte bassa (riga «Confrontare iPhone 15 Pro e GH5» e il suo «+ Oggi», y>752) appare più chiara delle righe sopra: il velo non copre tutta l'altezza dello schermo (finisce col contenuto scorrevole) — overlay position:fixed; inset:0.
- [media] scheda-attivita__pc-light.png — modale larga 460px e alta quasi tutto lo schermo con scorrimento interno; il contenuto (Dettagli › Area) è tagliato di netto in fondo senza sfumatura né indicazione che continua — su desktop modale più larga (640px) a due colonne (passi a sinistra, pianifica/dettagli a destra) o pannello laterale; ombra/sfumatura di scorrimento.
- [media] scheda-attivita__pc-light.png — chip «Pianifica»: «Domani / Giovedì / Tra una settimana» su una riga e «Un altro giorno» che va a capo da solo — riga spezzata e chip senza stato selezionato; non è chiaro se pianifica l'attività o il prossimo passo — tutti su una riga (c'è spazio se la modale è più larga), etichetta «Pianifica il prossimo passo».
- [media] scheda-attivita__pc-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» — minuscolo iniziale (incoerente con «Domani», «Giovedì»), chip bianchi su sfondo grigio diversi dai chip grigi su bianco di «Pianifica»; concetto poco chiaro senza anteprima — maiuscola iniziale, stile chip unico, frase esplicativa («Pianifica un passo …»).
- [bassa] scheda-attivita__pc-light.png — titolo su due righe con la X centrata verticalmente sul blocco titolo — X allineata alla prima riga.
- [bassa] scheda-attivita__pc-light.png — badge «1 di 3» accanto a «Passi» e «Aggiungi» testuale a destra del campo passo — piccolo e poco visibile; icone calendario/cestino sempre visibili su ogni passo — mostrarle in hover.
- [bassa] scheda-attivita__pc-light.png — pulsante primario «Aggiungi il prossimo passo a Oggi» — lungo e pesante; ok come CTA ma potrebbe dire quale passo («Fai oggi: Recuperare modulo 1»).

## scheda-attivita-fondo__pc-light.png
- [media] scheda-attivita-fondo__pc-light.png — riga «Fissa in alto … no» — un'impostazione booleana mostrata come testo grigio «no», senza interruttore né chevron: non sembra cliccabile — usare uno switch.
- [media] scheda-attivita-fondo__pc-light.png — «Fissa in alto» vs sezione «Importanti» nell'elenco Da fare e chip «Priorità» nel Piano del giorno — tre nomi per (probabilmente) lo stesso concetto — un solo termine («Importante ★»).
- [media] scheda-attivita-fondo__pc-light.png — voce «↺ Non completata ›» — per un'attività non ancora completata è incomprensibile (azione? stato? rinvia?) — se significa «Non l'ho fatta / rimanda» scriverlo; se è lo stato, non metterlo fra le azioni.
- [bassa] scheda-attivita-fondo__pc-light.png — affordance incoerenti nella lista Dettagli: «Studio / Università ⌄», «nessuna ›», «no» senza nulla — controlli uniformi (valore + chevron per tutti, switch per i booleani).
- [bassa] scheda-attivita-fondo__pc-light.png — intestazione fissa della modale — il passo «Recuperare modulo 1» scorre sotto il titolo e resta visibile a metà senza separatore/ombra — aggiungere ombra o bordo sotto l'intestazione quando si scorre.
- [bassa] scheda-attivita-fondo__pc-light.png — «Elimina» nello stesso gruppo di «Trasforma in abitudine» — separare l'azione distruttiva e chiedere conferma.

## scheda-abitudine__pc-light.png
- [media] scheda-abitudine__pc-light.png — mini-calendario — nessun nome del mese (si vedono 27–31 luglio e agosto senza indicazione) né navigazione; cerchi grigi pieni (mancati?) vs numeri senza cerchio (non previsti) senza legenda — titolo «Agosto», legenda «fatto / mancato / non previsto».
- [media] scheda-abitudine__pc-light.png — «Fatta» + «Salta oggi» affiancati qui, mentre nella scheda dal calendario sono uno sopra e uno in lista con «Termina l'abitudine»: stessa entità, due layout di scheda diversi — un'unica scheda abitudine.
- [bassa] scheda-abitudine__pc-light.png — riga «Ora 18:00 ×» — la × qui è fuori dal chip, nelle altre schede è un cerchietto grigio dentro il chip — uniformare.
- [bassa] scheda-abitudine__pc-light.png — statistiche «🔥3 di fila / 4 record / 7 in tutto» — etichette in minuscolo e «record» senza contesto («record: 4 di fila») — «Serie attuale», «Serie migliore», «Totale».
- [bassa] scheda-abitudine__pc-light.png — selettore giorni «Quando» — cerchi viola pieni per i giorni attivi e lettere «M M» ambigue; diverso dai cerchi del calendario sopra (verde) che usano la stessa forma per un significato diverso: due griglie di cerchi quasi identiche vicine confondono — selettore giorni come segmented a pill rettangolari.
- [bassa] scheda-abitudine__pc-light.png — chip area «Salute & Sport» verde chiaro con icona — unico chip d'area colorato col colore area: altrove le aree sono chip lilla («Salute & Sport» in giornata-scheda-abitudine) — uniformare.

## scheda-abitudine-fondo__pc-light.png
- [bassa] scheda-abitudine-fondo__pc-light.png — «Inizio 29/07/2026» — formato numerico, mentre ovunque l'app scrive «18 ago» — «29 lug 2026».
- [media] scheda-abitudine-fondo__pc-light.png — pulsante «Elimina» — qui centrato, senza icona, in un blocco grigio a sé; nella scheda attività è allineato a sinistra con icona cestino dentro una lista — uniformare il componente azione distruttiva.
- [bassa] scheda-abitudine-fondo__pc-light.png — chip valore «Mai» grigio, «29/07/2026» e «Salute & Sport» lilla con testo viola, «18:00» lilla con testo nero, «45 min» lilla con testo viola — quattro varianti di chip-valore nella stessa scheda — un solo stile.
- [bassa] scheda-abitudine-fondo__pc-light.png — intestazione fissa senza separazione: il calendario scorre sotto il titolo e i cerchi 3–7 sono tagliati dalla linea — ombra sotto l'header.
- [bassa] scheda-abitudine-fondo__pc-light.png — «Fine: Mai» qui e «Termina l'abitudine» nella scheda dal calendario: due modi di fare la stessa cosa con parole diverse.

## andamento__pc-light.png
- [media] andamento__pc-light.png — card in alto «🔥 38» e «65% · 81 di 124» — numeri enormi senza etichetta: 38 cosa? 65% di cosa, in che periodo? — «38 giorni di fila» e «65% delle attività completate negli ultimi 30 giorni».
- [media] andamento__pc-light.png — riga 7 giorni (M G V S D L M) — quadrati 36px distribuiti su 700px, con il giorno di oggi a destra (ordine invertito rispetto alla settimana Lun→Dom delle altre viste) e senza date — aggiungere le date e raggrupparli; spiegare cosa significa la spunta (giorno attivo?).
- [alta] andamento__pc-light.png — card «Costanza» — heatmap minuscola (quadrati 12px) che occupa 200×100px in una card di 370×420: oltre metà card vuota perché allungata all'altezza di «Per area»; nessuna etichetta di mesi/giorni — heatmap a tutta larghezza su una riga (full-width card) con etichette mesi, o card ad altezza naturale.
- [media] andamento__pc-light.png — colori heatmap — qui scala di BLU, nella vista Anno della giornata scala di VERDE per la stessa informazione (giorni attivi) — un'unica scala.
- [bassa] andamento__pc-light.png — «Per area» — colori «Salute & Sport» verde e «Associazioni» verde acqua quasi identici; numeri «4/8» grigi 11px attaccati alla percentuale — palette d'area più distinta, separatore.
- [bassa] andamento__pc-light.png — «Progetti Founder» — inglese misto in un'interfaccia italiana (dato utente, ma vale come esempio) — ok se scelto dall'utente.
- [bassa] andamento__pc-light.png — lista «Riflessioni passate 79 ›», «Sessioni del timer…» in fondo — tagliata dal bordo, nessun titolo di sezione: sembra un'appendice — titolo «Archivio».

## andamento-fondo__pc-light.png
- [media] andamento-fondo__pc-light.png — lista «Riflessioni passate / Sessioni del timer / Aree / Grafici» — voci eterogenee senza titolo; «Aree» duplica Profilo › Aree e la card «Per area»; «Riflessioni passate» sembra duplicare Profilo › Diario; «Grafici» non dice quali grafici e perché non sono già qui — rinominare/accorpare: un solo posto per Aree e Diario, «Grafici» → «Tutti i grafici (energia, sonno…)».
- [bassa] andamento-fondo__pc-light.png — solo «Riflessioni passate» mostra un conteggio (79), le altre no — o tutte o nessuna.
- [bassa] andamento-fondo__pc-light.png — heatmap «Costanza» — le prime due righe partono una colonna dopo (forma a scalino) senza intestazioni di colonna: non si capisce se colonne = settimane — etichette mesi sopra e giorni a sinistra.
- [bassa] andamento-fondo__pc-light.png — ~100px di vuoto sotto l'ultima card e card Costanza vuota per 230px — vedi sopra: altezza naturale delle card.

## scoperte__pc-light.png
- [media] scoperte__pc-light.png — sottoscheda «Registro» — nome burocratico e poco chiaro per un elenco di cose che funzionano/non funzionano — «Cosa ho scoperto» o «Elenco».
- [media] scoperte__pc-light.png — icona pollice-su usata per la scheda «Scoperte», per «Registro» e per la sezione «Funziona»: stessa icona con tre significati — icona lampadina/lente per Scoperte, pollice solo per «Funziona».
- [media] scoperte__pc-light.png — meta «misurato», «lo noto ogni volta», «notato una volta» — livelli di evidenza non spiegati e con forme verbali incoerenti (prima persona presente vs participio) — scala esplicita: «Prova: misurata / sempre / una volta», magari con 1-3 pallini.
- [media] scoperte__pc-light.png — su desktop le due liste «Funziona» e «Non funziona» potrebbero stare affiancate in due colonne invece di una pila che scorre oltre il fondo — due colonne ≥1100px.
- [bassa] scoperte__pc-light.png — icone pollice dentro quadrati con bordo e fondo colorato (riquadro nel riquadro) a sinistra di ogni riga, ripetitive dato che la sezione dice già «Funziona» — togliere o ridurre a un pallino colorato.
- [bassa] scoperte__pc-light.png — campo «Aggiungi una scoperta…» — non chiede se funziona o no prima di aggiungere: dove finisce? — toggle 👍/👎 nel campo.

## scoperte-esperimenti__pc-light.png
- [media] scoperte-esperimenti__pc-light.png — grafico — le etichette «media 3,1» e «media 4,3» sono scritte sopra i punti dati e si sovrappongono a essi; l'ultimo punto blu a destra è tagliato dal bordo del grafico (x≈1108) — etichette fuori dall'area dati (a destra dell'asse) o con fondo bianco; padding interno destro.
- [media] scoperte-esperimenti__pc-light.png — riepilogo «L'entità del cambiamento è grande (d≈3,1)» — «d» di Cohen è gergo statistico incomprensibile per l'utente medio — togliere «d≈3,1» o metterlo in un «i» espandibile.
- [media] scoperte-esperimenti__pc-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» accanto al titolo — sembrano pulsanti (bordo, fondo bianco) ma sono etichette; «concluso» in minuscolo — badge piatti senza bordo, «Concluso».
- [bassa] scoperte-esperimenti__pc-light.png — testo introduttivo e «La modifica: …» limitati a ~420px mentre la card è 760px: metà destra vuota — ok la misura di lettura, ma allora affiancare a destra il pulsante «Nuovo esperimento» o un'illustrazione.
- [bassa] scoperte-esperimenti__pc-light.png — testo intro «Per prima cosa l'app misura…» sempre visibile anche quando ci sono già esperimenti — renderlo comprimibile/mostrarlo solo al primo uso.
- [bassa] scoperte-esperimenti__pc-light.png — asse Y con solo 1, 3, 5; nessuna etichetta asse X (date) — aggiungere date di inizio/modifica.
- [bassa] scoperte-esperimenti__pc-light.png — riquadro risultato grigio dentro card bianca, testo 14px + nota 11px — la nota «È un indizio utile…» troppo piccola.

## scheda-scoperta__pc-light.png
- [alta] scheda-scoperta__pc-light.png — velo della modale — l'ultima riga in basso («Studiare dopo cena», y>728) è più chiara e nitida del resto: il velo non copre l'intera finestra (stesso difetto di scheda-attivita) — overlay fisso a tutto schermo.
- [media] scheda-scoperta__pc-light.png — «Esito: funziona / non funziona» nascosto dentro «Dettagli» come fosse secondario, mentre è il dato principale (decide la sezione) — portarlo subito sotto il testo.
- [bassa] scheda-scoperta__pc-light.png — titolo modale «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione; la sezione si chiama «Scoperte» — titolo «Scoperta».
- [bassa] scheda-scoperta__pc-light.png — «Quanto ne sei sicuro» senza «?»; opzioni in minuscolo («notato una volta», «funziona») mentre altrove i chip hanno maiuscola iniziale — uniformare.
- [bassa] scheda-scoperta__pc-light.png — nessun pulsante «Salva» e nessun segnale di salvataggio automatico — mostrare «Salvato» o pulsante.
- [bassa] scheda-scoperta__pc-light.png — «Provalo con un esperimento ›» proposto anche per una scoperta già «misurata» — nasconderlo o cambiare testo («Ripeti l'esperimento»).

## profilo__pc-light.png
- [media] profilo__pc-light.png — sidebar — nessuna voce risulta attiva: «Profilo e impostazioni» in basso non si evidenzia quando la pagina aperta è proprio il Profilo — stato attivo anche per la voce in basso.
- [alta] profilo__pc-light.png — statistiche «38 giorni / 109 fatte / 65% completate» — 109 fatte qui, 82 «fatte» in Anno, «81 di 124» in Andamento, 58 in Mese: numeri che non tornano tra le schermate e senza periodo di riferimento — indicare il periodo («da sempre», «2026», «30 giorni») e calcolarli in modo coerente.
- [media] profilo__pc-light.png — «38 giorni» — senza «di fila» sembra «giorni di utilizzo», in contrasto con «49 giorni attivi» di Anno — «38 giorni di fila».
- [bassa] profilo__pc-light.png — avatar quadrato arrotondato viola pieno qui, cerchio lilla con «R» viola altrove — stesso avatar, stessa forma.
- [media] profilo__pc-light.png — riga «Promemoria — bloccati» — parola allarmante e criptica (bloccati da chi? dal browser?) — «Notifiche disattivate dal browser» con azione «Attiva».
- [bassa] profilo__pc-light.png — card statistiche con padding verticale 10px, schiacciata rispetto alle altre card (padding 16–20px) — uniformare padding.
- [bassa] profilo__pc-light.png — nessun modo visibile di modificare nome e frase (non c'è matita/«Modifica») — aggiungere «Modifica profilo».
- [bassa] profilo__pc-light.png — «Diario» qui e «Riflessioni passate» in Andamento — se sono la stessa cosa, un solo nome e un solo posto.
- [bassa] profilo__pc-light.png — metà inferiore della pagina vuota, colonna 760px — su desktop accettabile ma si potrebbe affiancare elenco e dettaglio delle impostazioni (pattern Impostazioni macOS).

## impostazioni__pc-light.png
- [media] impostazioni__pc-light.png — Impostazioni come modale stretta (460px) con scorrimento interno sopra il Profilo — su desktop le impostazioni dovrebbero essere una pagina (o modale larga con indice a sinistra); il contenuto è tagliato in fondo («Scienza») senza indicazione di scorrimento.
- [media] impostazioni__pc-light.png — sezione «Account» con la sola riga «Sincronizzazione — su questo dispositivo» (senza chevron, non sembra cliccabile) e subito dopo un gruppo senza titolo (Area predefinita, Timer, Musica, Aspetto) — gruppo senza intestazione sembra appartenere ad «Account» — titolo «Preferenze» per il secondo gruppo; «Sincronizzazione: disattivata (dati solo su questo dispositivo)».
- [bassa] impostazioni__pc-light.png — valori a destra: «Automatica» maiuscolo con ⌄, «chiedi sempre», «nessuna», «automatico» minuscoli con › — maiuscole e affordance incoerenti; «Automatica» e «automatico» due generi a 150px di distanza.
- [bassa] impostazioni__pc-light.png — «Backup e ripristino 1» — il «1» non spiega nulla (1 backup? 1 avviso?) — «1 backup · 12 ago».
- [bassa] impostazioni__pc-light.png — «Esporta dati» / «Importa dati» senza chevron né descrizione del formato — «Esporta (JSON)…».
- [bassa] impostazioni__pc-light.png — voce «Scienza» nella Guida — titolo vago — «Su cosa si basa LifeMax» / «Le basi scientifiche».

## impostazioni-fondo__pc-light.png
- [bassa] impostazioni-fondo__pc-light.png — «Registro tecnico» dentro «Guida» — strumento di debug mescolato alle guide per l'utente — spostarlo in una sezione «Avanzate» in fondo.
- [bassa] impostazioni-fondo__pc-light.png — «Rimuovi dati di esempio» in «Reimposta» con icona ✨ — icona incongrua (scintille = magia/IA) per un'azione di cancellazione; non dice cosa rimuove né se è reversibile — icona cestino/gomma e sottotitolo «Toglie le attività dimostrative, i tuoi dati restano».
- [bassa] impostazioni-fondo__pc-light.png — «Cancella tutti i dati» rosso in un gruppo a sé, ok, ma con lo stesso sfondo grigio delle voci normali — riquadro con bordo rosso tenue o testo che spiega l'irreversibilità.
- [bassa] impostazioni-fondo__pc-light.png — intestazione fissa «Impostazioni» senza separatore: la riga «Aspetto» scorre sotto e resta mezza visibile — ombra/bordo sotto l'header.

## imp-timer__pc-light.png
- [media] imp-timer__pc-light.png — «Pausa lunga ogni 4 — Mai» — frase che non si regge («ogni 4 … mai») e non dice la durata della pausa lunga — due righe: «Pausa lunga: 15 min» e «Dopo: 4 pomodori / mai».
- [media] imp-timer__pc-light.png — sezioni «Avvio rapido (Durata 5 min, Poi continua per 25 min)», «Sessione (Durata 25 min)», «Pomodoro» — tre modalità senza descrizione; «Poi continua per» è oscuro — una riga di spiegazione sotto ogni titolo («Inizi con 5 minuti, se ti va prosegui per altri 25»).
- [bassa] imp-timer__pc-light.png — link indietro «‹ Impostazioni» 12px sopra il titolo e X allineata fra le due righe — back come icona a sinistra del titolo, X allineata al titolo.
- [bassa] imp-timer__pc-light.png — modale cambia altezza e posizione verticale (top 72 vs 48 della pagina Impostazioni) passando alla sottopagina: salto visivo — altezza fissa o ancoraggio in alto costante.
- [bassa] imp-timer__pc-light.png — titoli di sezione «Avvio», «Avvio rapido» — quasi uguali e confondibili — «Timer all'avvio» / «Avvio rapido».

## imp-musica__pc-light.png
- [media] imp-musica__pc-light.png — campi «Incolla il link» — fondo grigio chiarissimo su riquadro grigio, senza bordo visibile: quasi invisibili, non sembrano campi; etichette («Studio / Università») attaccate al bordo superiore del gruppo (padding 8px) e al campo — campi bianchi con bordo, padding 12–16px.
- [media] imp-musica__pc-light.png — nessuna spiegazione di quale link (Spotify, YouTube, playlist?) e di cosa succede — sottotitolo «Incolla il link di una playlist Spotify/YouTube: si aprirà quando avvii il timer».
- [bassa] imp-musica__pc-light.png — prima sezione senza titolo («Predefinita» è un'etichetta dentro il gruppo), la seconda ha titolo «Per area» — titolo «Generale».
- [bassa] imp-musica__pc-light.png — interruttore spento «Apri all'avvio del timer» — binario grigio chiaro su grigio, contrasto basso — binario più scuro.
- [bassa] imp-musica__pc-light.png — 8 campi link per area impilati in una modale 460px che scorre molto — su desktop griglia a due colonne o campo per area solo su richiesta («+ Musica per un'area»).

## imp-aspetto__pc-light.png
- [media] imp-aspetto__pc-light.png — posizione della modale — qui è centrata verticalmente (top 226), nelle sottopagine Timer/Musica è ancorata in alto (48–72): navigando fra le sottopagine la finestra salta su e giù — ancorare tutte le modali allo stesso top.
- [media] imp-aspetto__pc-light.png — «Suoni», «Vibrazione» dentro «Aspetto» — non sono aspetto; «Vibrazione» su un computer non ha effetto — sezione «Suoni e feedback», nascondere Vibrazione su desktop.
- [bassa] imp-aspetto__pc-light.png — interruttori verdi mentre il colore d'accento dell'app (selezioni, pulsanti primari) è viola — uniformare all'accento o giustificare il verde solo per «fatto».
- [bassa] imp-aspetto__pc-light.png — «Tema» con etichetta in alto e segmented sotto, le altre righe con icona a sinistra: la prima riga non ha icona e ha layout diverso — coerenza di riga.

## aree__pc-light.png
- [media] aree__pc-light.png — interruttori verdi accanto a ogni area — non è spiegato cosa fanno (attiva/nascondi?); con tutto acceso non si capisce l'effetto — sottotitolo «Le aree spente non compaiono nei menu» o etichetta di colonna «Attiva».
- [media] aree__pc-light.png — cestino 12px a 20px dall'interruttore — rischio di clic accidentale su un'azione distruttiva; nessun modo di rinominare, cambiare icona/colore o riordinare — menu «…» per riga con Rinomina/Colore/Elimina, maniglia di trascinamento.
- [bassa] aree__pc-light.png — «Nuova area» — il quadratino icona grigio a sinistra del campo «Nome» sembra cliccabile ma non è chiaro (sceglie l'icona?) e non c'è scelta del colore — popover icona+colore.
- [bassa] aree__pc-light.png — titolo «Le tue aree» qui, «Aree» nel Profilo e in Andamento — uniformare.

## sonno-pasti__pc-light.png
- [alta] sonno-pasti__pc-light.png — terza interfaccia diversa per gli stessi dati (sonno e pasti): qui chip lilla con orario allineato a destra e durata viola, nel pannello della Giornata campi bianchi + select nativi + cestino, nel rituale righe con sì/no e orologio — un solo componente «riga pasto» riusato ovunque.
- [bassa] sonno-pasti__pc-light.png — chip orario: testo allineato a destra («  08:00»), chip durata: testo centrato («15 min») — allineamento interno uniforme (centrato).
- [bassa] sonno-pasti__pc-light.png — rimozione pasto: qui «×», nel pannello Giornata icona cestino — stessa azione, due icone.
- [media] sonno-pasti__pc-light.png — sezione «Promemoria nell'app» qui dentro, mentre esiste anche Profilo › Promemoria — impostazioni dello stesso tipo in due posti — spostare tutto in Promemoria o collegare.
- [bassa] sonno-pasti__pc-light.png — «Tra le 05:00 – 14:00» — «Tra le … –» mescola due costruzioni — «Dalle 05:00 alle 14:00»; riga tagliata dal fondo della modale senza indicatore di scorrimento.
- [bassa] sonno-pasti__pc-light.png — «Durata 8h» grigio non modificabile accanto a righe modificabili con lo stesso aspetto riga — renderla visivamente di sola lettura (testo secondario sotto «Sveglia»); «8h» → «8 h».

## promemoria__pc-light.png
- [alta] promemoria__pc-light.png — avviso «Bloccati» in alto — card arancio larga 340px su 418 disponibili (non a tutta larghezza, margine destro 80px), testo centrato, ombra come un toast fluttuante: sembra un elemento rotto/fuori posto — banner a tutta larghezza, testo allineato a sinistra, senza ombra, con pulsante «Come riattivarle».
- [media] promemoria__pc-light.png — testo dell'avviso «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» — italiano macchinoso — «Per riattivarle apri le impostazioni del browser › Notifiche › consenti a questo sito».
- [media] promemoria__pc-light.png — interruttori disabilitati delle notifiche — grigi ma con la levetta a destra (posizione «acceso»): non si capisce se sono accesi o spenti — mostrare lo stato reale attenuato, o nasconderli e mostrare solo l'avviso.
- [media] promemoria__pc-light.png — voce «Priorità del giorno 16:30» — nessun rituale ha questo nome (c'è «Piano del giorno»); «Fine giornata» ok — allineare i nomi ai rituali e spiegare cosa fa (ricorda le priorità?).
- [bassa] promemoria__pc-light.png — «Non disturbare › Tra le 23:00 – 07:00» — «Tra le» rientrato di 16px rispetto alle altre etichette e costruzione mista — «Dalle 23:00 alle 07:00» allineato.
- [bassa] promemoria__pc-light.png — titolo dell'avviso «Bloccati» isolato, senza soggetto — «Notifiche bloccate».

## diario__pc-light.png
- [alta] diario__pc-light.png — navigazione — la sidebar evidenzia «Andamento» mentre il link indietro dice «‹ Profilo»: l'utente non sa in che sezione si trova; inoltre Diario è una pagina intera mentre le altre voci del Profilo (Aree, Sonno e pasti, Promemoria, Impostazioni) sono modali — scegliere una sola sezione madre e un solo modello (pagina o modale).
- [media] diario__pc-light.png — link «‹ Profilo» a x=293 mentre il titolo «Diario» e la card partono a x=384 — disallineati di 90px — allineare al bordo sinistro del contenuto.
- [media] diario__pc-light.png — icone ↺ (annulla?) su ogni riga — senza etichetta né tooltip, abbassate di ~4px rispetto alla riga di testo e all'orario — tooltip «Annulla», allineamento alla prima riga, mostrarle solo in hover.
- [media] diario__pc-light.png — riga «Completata · Organizzare cena con il gruppo 👥 ☆ / Priorità [Relazioni & Sociale ⌄]» — un select modificabile dentro una voce di diario, che va a capo con l'etichetta «Priorità» spezzata: confuso (è un registro, perché si modifica l'area?) — mostrare l'area come testo; modifica nella scheda.
- [bassa] diario__pc-light.png — colonna sinistra «Oggi / Ieri» larga ~110px con solo una parola — spreco orizzontale; meglio intestazioni di gruppo sopra le voci, sticky.
- [bassa] diario__pc-light.png — «Check-in · energia 4 · focus 5 · umore 5» — nel check-in le domande erano «Quanta energia», «concentrarti», «Come ti senti»: «focus» inglese e «umore» non compaiono nel rituale — usare le stesse parole.
- [bassa] diario__pc-light.png — segmented «Cose importanti / Tutto» annidato in card bianca con bordo e linea sotto (riquadro nel riquadro) — spostarlo fuori, accanto al titolo.

## timer-scelta__pc-light.png
- [alta] timer-scelta__pc-light.png — valori a destra «5 min», «25 min», «25 + 5 min», «nessun limite» — attaccati al bordo destro del gruppo (padding ~3px contro 12px a sinistra): margini interni asimmetrici, testo che tocca il bordo — padding destro 12–16px come a sinistra.
- [media] timer-scelta__pc-light.png — titolo «Timer» — non dice per quale attività si sta avviando (Ripasso flashcard) — «Timer per Ripasso flashcard».
- [bassa] timer-scelta__pc-light.png — modalità senza descrizione: «Avvio rapido 5 min» non dice che poi prosegue per 25 (come in Impostazioni), «Sessione» vs «Pomodoro» poco distinguibili — sottotitolo per ognuna.
- [bassa] timer-scelta__pc-light.png — icone in riquadri bianchi bordati dentro righe grigie dentro una modale bianca (tre livelli di contenitori) — icone semplici senza riquadro.
- [bassa] timer-scelta__pc-light.png — nessuna opzione «Ricorda la scelta» — scorciatoia verso l'impostazione «Timer predefinito».

## timer-concentrazione__pc-light.png
- [alta] timer-concentrazione__pc-light.png — controlli del timer — non c'è un pulsante Pausa/Riprendi né Avvia: le uniche azioni sono «Fatto», «Termina», «Cambia timer» e la X — aggiungere Pausa (anche barra spaziatrice) come azione principale accanto a Fatto.
- [media] timer-concentrazione__pc-light.png — «Termina» con la stessa icona calendario-× di «Termina l'abitudine»: sembra che chiuda l'abitudine per sempre; inoltre duplica la X in alto a destra — «Interrompi sessione» con icona stop; X che chiede conferma o rimuoverla.
- [media] timer-concentrazione__pc-light.png — «Fatto» verde grande — non è chiaro se segna l'abitudine completata o chiude solo la sessione — «Segna Ripasso flashcard come fatto».
- [bassa] timer-concentrazione__pc-light.png — anello di avanzamento a forma di squircle grigio scuro — a 25:00 vuoto e quasi invisibile (#1c1c1c su #0b0b0b); forma insolita per un timer — cerchio con traccia visibile.
- [bassa] timer-concentrazione__pc-light.png — «Pomodoro · blocco 1» — non dice quanti blocchi né cosa viene dopo — «Pomodoro 1 di 4 · poi pausa di 5 min».
- [bassa] timer-concentrazione__pc-light.png — schermata sempre scura anche nel tema chiaro — scelta legittima per la concentrazione, ma andrebbe dichiarata (o seguire il tema).

## cattura__pc-light.png
- [alta] cattura__pc-light.png — popup «Scrivi un pensiero…» — l'unico pulsante è «Chiudi»: manca «Salva/Aggiungi» e non c'è alcun suggerimento «Invio per salvare»; l'utente non sa se chiudendo perde il testo — pulsante primario «Aggiungi ↵» a destra, «Esc» per chiudere.
- [media] cattura__pc-light.png — nomi diversi per la stessa funzione: pulsante sidebar «Aggiungi una nota (C)», popup «Scrivi un pensiero», Diario «Annotato», scheda «Da sistemare» — un solo termine («Nota»), e dire dove finisce («Va in Da sistemare»).
- [bassa] cattura__pc-light.png — linea di separazione interna che non tocca i bordi della card (rientro di ~5px per lato) — linea a tutta larghezza o con rientro pari al padding (20px).
- [bassa] cattura__pc-light.png — «Chiudi» link viola 12px in basso a destra in una fascia alta 48px quasi vuota — footer sproporzionato.
- [bassa] cattura__pc-light.png — sfocatura molto forte dello sfondo (tutto illeggibile), diversa dal velo semplice delle altre modali — uniformare il trattamento dello sfondo.

