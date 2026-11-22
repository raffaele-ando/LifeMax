# Revisione UX/UI — computer 1280×800

## oggi-adesso__pc-light.png
- [gravità: media] oggi-adesso__pc-light.png — barra laterale, voci «Attività» e «Andamento» — le voci non attive hanno uno sfondo grigio pieno come fossero pulsanti: la voce attiva si distingue poco e la barra sembra una pila di card — voci non attive senza sfondo (solo hover), sfondo colorato solo sulla voce attiva.
- [gravità: media] oggi-adesso__pc-light.png — area centrale — colonna di contenuto ~760px con ~140px vuoti a destra e metà inferiore dello schermo vuota: layout da telefono trasposto, su 1280px non si sfrutta lo spazio (es. «Poi» potrebbe stare in colonna accanto alla card principale) — su ≥1200px usare due colonne (card «Adesso» + lista «Poi»/agenda del giorno) o almeno mostrare più elementi in «Poi».
- [gravità: media] oggi-adesso__pc-light.png — card «Ripasso flashcard», pulsante «Fatto» — pulsante verde pieno largo 720px e alto 54px: sproporzionato su computer, domina tutta la pagina — larghezza contenuta (auto/min 200px) affiancato a «Timer», oppure limitare la card a ~560px.
- [gravità: bassa] oggi-adesso__pc-light.png — card principale, «Studio / Università» → chip «Abitudine» — spazio verticale fra etichetta area e chip (~30px) più grande di quello fra chip e titolo: gerarchia sbilanciata — mettere area e tipo sulla stessa riga (es. «Studio / Università · Abitudine») o uniformare a 8px.
- [gravità: bassa] oggi-adesso__pc-light.png — riga «Timer» / «Salta oggi ⏭» — un'azione è pulsante bordato con icona a sinistra, l'altra è testo con icona a destra: stili incoerenti per azioni sorelle — stessi pulsanti secondari (icona a sinistra) o entrambi testuali.
- [gravità: media] oggi-adesso__pc-light.png — in alto a destra, badge «🔥 38» — numero senza etichetta né tooltip: non si capisce che sia una serie di giorni — aggiungere «38 giorni» o tooltip/etichetta «Serie».
- [gravità: bassa] oggi-adesso__pc-light.png — sotto la data, barra «1/2» — barra di avanzamento senza dire di cosa (rituali? attività?) — testo «1 di 2 fatte» o etichetta esplicita.
- [gravità: bassa] oggi-adesso__pc-light.png — avatar «R» in alto a destra e «Profilo e impostazioni» in basso a sinistra — due ingressi allo stesso posto sulla stessa schermata — su computer togliere l'avatar dalla barra superiore (o la voce in barra laterale).
- [gravità: bassa] oggi-adesso__pc-light.png — schede «Adesso / La giornata / 1 Rituali» — il badge «1» è prima della parola, mentre in barra laterale il badge «6» è a destra: posizione dei contatori incoerente — badge sempre dopo l'etichetta.

## giornata-giorno__pc-light.png
- [gravità: alta] giornata-giorno__pc-light.png — calendario, linea dell'ora attuale 10:30 — la linea viola attraversa il blocco «Organizzare cena con il gruppo» passando sopra al riquadro e la pillola «10:30» copre il bordo destro del blocco: sovrapposizione sporca — disegnare la linea sotto i blocchi (z-index) o solo nel gutter/bordo, con la pillola nella colonna delle ore a sinistra.
- [gravità: media] giornata-giorno__pc-light.png — intestazione «‹ Oggi ›» — manca la data: si legge solo «Oggi», non «martedì 18 agosto» — mostrare «Oggi · mar 18 agosto».
- [gravità: media] giornata-giorno__pc-light.png — riga sonno «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — sequenza di icone criptiche senza testo, sembra un riepilogo ma non spiega cosa si apre con la freccia — etichetta «Sonno e pasti» + orari leggibili (Colazione 8:00 · Pranzo 13:00 · Cena …).
- [gravità: media] giornata-giorno__pc-light.png — blocchi attività nel calendario — testo a 12–13px dentro blocchi larghi 700px; il titolo del blocco 09:30–11:00 parte a 30px dal bordo superiore (non allineato in alto come in ogni calendario) — titolo allineato in alto con padding 6–8px, corpo 14px semibold.
- [gravità: bassa] giornata-giorno__pc-light.png — blocchi «Colazione»/«Pranzo» — testo centrato, mentre i blocchi attività sono allineati a sinistra: incoerenza fra blocchi dello stesso calendario — allineare tutto a sinistra.
- [gravità: bassa] giornata-giorno__pc-light.png — fascia tratteggiata 07:00–07:30 — area a righe senza etichetta: non si capisce che è sonno — aggiungere «Sonno» o icona letto in piccolo.
- [gravità: bassa] giornata-giorno__pc-light.png — doppia fila di schede («Adesso/La giornata/Rituali» + «Giorno/Settimana/Mese/Anno») con stili diversi (segmentato vs pillola) — due livelli di navigazione impilati appesantiscono — su computer mettere Giorno/Settimana/Mese/Anno sulla riga del titolo «‹ Oggi ›» come controllo segmentato compatto a destra.
- [gravità: bassa] giornata-giorno__pc-light.png — frecce ‹ › — cerchi bianchi ai due estremi della colonna, distanti 700px dal titolo: su schermo largo le frecce sono lontane dal titolo — raggruppare ‹ Oggi › vicino, con «Oggi» come pulsante di ritorno.

## giornata-giorno-fondo__pc-light.png
- [gravità: media] giornata-giorno-fondo__pc-light.png — blocco «Leggere 20 minuti» alle 22:00 — blocco alto ~25px: la casella di spunta a destra tocca/esce dal bordo inferiore del blocco — per blocchi brevi ridurre la casella (16px) e centrarla verticalmente, altezza minima blocco 32px.
- [gravità: media] giornata-giorno-fondo__pc-light.png — blocchi abitudine (bordo verde, fondo bianco) vs attività (fondo colorato con banda a sinistra) — due linguaggi visivi diversi nello stesso calendario; la maniglia ⠿ delle abitudini sta fuori da qualunque banda — stesso componente con banda colore area, abitudine distinta solo dall'icona ↻.
- [gravità: media] giornata-giorno-fondo__pc-light.png — sezione «Senza orario» e campo «Nuova attività…» — sono in fondo a un calendario di 17 ore: su computer non si vedono mai senza scorrere tutto — metterli in una colonna laterale destra (lo spazio c'è) o sopra il calendario.
- [gravità: media] giornata-giorno-fondo__pc-light.png — scorrendo, la barra con schede, data e frecce sparisce — si perde il contesto (che giorno sto guardando) — rendere fissa (sticky) l'intestazione del giorno.
- [gravità: bassa] giornata-giorno-fondo__pc-light.png — riga «Ripasso flashcard» — icona libro blu a sinistra e icona orologio viola a destra senza etichetta: l'orologio non dice che serve a «dare un orario»; inoltre nel calendario le abitudini hanno l'icona ↻, qui un libro — tooltip/etichetta «Pianifica», icona coerente ↻.
- [gravità: bassa] giornata-giorno-fondo__pc-light.png — link «Sposta 1 non fatta a domani» — frase ellittica e non dice quale — «Sposta a domani l'attività non fatta (1)» e mostrarne il nome al passaggio.
- [gravità: bassa] giornata-giorno-fondo__pc-light.png — fondo del riquadro calendario — etichetta «00:00» a 10px dal bordo, mentre in alto «07:00» ha 25px: padding interno asimmetrico — stesso padding sopra e sotto.
- [gravità: bassa] giornata-giorno-fondo__pc-light.png — pulsante «+ Aggiungi» dentro il campo — pulsante pieno lilla già attivo con campo vuoto — disattivarlo finché non si scrive.

## giornata-settimana__pc-light.png
- [gravità: alta] giornata-settimana__pc-light.png — impaginazione generale — la vista settimana si allarga (286→1242px) mentre la barra delle schede in alto e l'avatar restano sulla colonna stretta (384→1144px): i bordi sinistro/destro non sono più allineati, la pagina «salta» passando da Giorno a Settimana — usare la stessa larghezza contenitore per tutte le viste (o allargare anche l'intestazione).
- [gravità: media] giornata-settimana__pc-light.png — intestazioni colonne «17 ago+4», «18 ago+1» — contatore «+4/+1» incollato alla data senza spazio né spiegazione: illeggibile — badge separato su riga propria («4 attività») o pallino con tooltip.
- [gravità: media] giornata-settimana__pc-light.png — colonna Mar 10:00–11:00 — la linea dell'ora e la pillola «10:30» coprono il testo barrato «Organizzare cena con il gruppo» — linea sotto i blocchi, pillola nella colonna ore.
- [gravità: media] giornata-settimana__pc-light.png — blocchi «Camminata /…» e «Confrontare piani telefonici» — titoli troncati a 10 caratteri anche se il blocco è alto abbastanza per due righe; testo 11px — consentire a capo su 2 righe, tooltip col titolo intero.
- [gravità: bassa] giornata-settimana__pc-light.png — titolo «17 Ago – 23 Ago» — mese maiuscolo «Ago» mentre sotto è «17 ago»: incoerente (in italiano minuscolo) — «17–23 agosto».
- [gravità: bassa] giornata-settimana__pc-light.png — frecce di navigazione — qui ‹ titolo a sinistra e › all'estremo destro, nella vista Giorno titolo centrato fra le frecce: stesso controllo con due impaginazioni — uniformare.
- [gravità: bassa] giornata-settimana__pc-light.png — blocchi pasti (☕ / 🍴) — solo icona, colazione alta 15px — illeggibili e cliccabili per errore — tooltip con nome e orario, o renderli fascia di sfondo non interattiva.
- [gravità: bassa] giornata-settimana__pc-light.png — Lun 18:00 «Camminata» fatta — barrata su fondo bianco grigio, mentre le fatte del Giorno hanno spunta verde: stato «fatto» rappresentato in due modi — uniformare (spunta + opacità).

## giornata-mese__pc-light.png
- [gravità: media] giornata-mese__pc-light.png — griglia del mese — anelli verdi di avanzamento e puntini colorati sotto i giorni senza alcuna legenda: l'utente non sa cosa misurano — legenda sotto la griglia («anello = % fatto, puntini = aree») o tooltip al passaggio.
- [gravità: media] giornata-mese__pc-light.png — griglia su 1280px — celle larghe 135px con solo un numero: su computer un calendario mensile dovrebbe mostrare i titoli (2–3 righe per giorno) — mostrare le prime attività nella cella, «+N» per il resto.
- [gravità: bassa] giornata-mese__pc-light.png — giorno 18 — doppia evidenziazione (cerchio viola pieno + riquadro grigio di selezione + anello verde): tre segnali sovrapposti — oggi = numero viola, selezione = riquadro, anello separato.
- [gravità: bassa] giornata-mese__pc-light.png — prima riga 27–31 luglio mostrati sbiaditi, ma l'ultima riga «31» non è completata con 1–6 settembre: griglia irregolare, riga finale con un solo numero — completare con i giorni del mese successivo sbiaditi.
- [gravità: bassa] giornata-mese__pc-light.png — elenco «Oggi» in basso — caselle di spunta minuscole (12px) colorate verde/blu, diverse dalle caselle grigie 24px della vista Giorno — stesso componente checkbox ovunque.
- [gravità: bassa] giornata-mese__pc-light.png — «58 cose fatte» — «cose» è colloquiale e diverso da «attività» usato altrove — «58 completate».
- [gravità: media] giornata-mese__pc-light.png — larghezza contenitore diversa dalla barra schede in alto (vedi Settimana) — stesso problema di allineamento.

## giornata-anno__pc-light.png
- [gravità: alta] giornata-anno__pc-light.png — riquadro «Ago», numero «17» — la vista Mese dice «18 giorni attivi» per agosto, l'Anno dice 17: dati incoerenti fra viste (probabilmente il giorno corrente contato in un modo e non nell'altro) — stessa regola di conteggio in entrambe.
- [gravità: media] giornata-anno__pc-light.png — riquadri dei mesi — mancano le iniziali dei giorni (L M M G V S D) e i numeri: impossibile capire a che giorno corrisponde un quadrato; nessuna legenda dell'intensità di verde — aggiungere intestazione dei giorni, tooltip con data e conteggio, legenda «meno → più».
- [gravità: media] giornata-anno__pc-light.png — giorni futuri (set–dic, fine agosto) e giorni passati senza attività hanno lo stesso grigio — non si distingue «non fatto» da «non ancora arrivato» — giorni futuri con solo contorno o più chiari.
- [gravità: bassa] giornata-anno__pc-light.png — numeri verdi «7», «25», «17» in alto a destra dei mesi — senza unità — «7 giorni».
- [gravità: bassa] giornata-anno__pc-light.png — riepilogo «49 giorni attivi / 82 fatte / 1874 XP» — stile (card centrata con divisori) diverso dal riepilogo del Mese (numeri in linea a sinistra) e la parola «XP» compare solo qui senza spiegazione — un unico componente statistiche; spiegare cosa sono gli XP o toglierli.
- [gravità: bassa] giornata-anno__pc-light.png — griglia 4×3 di mesi alti 235px — l'anno non sta in uno schermo da 800px e richiede scorrimento — quadratini più piccoli (12–14px) in modo che i 12 mesi stiano in vista.

## giornata-sonno-aperto__pc-light.png
- [gravità: alta] giornata-sonno-aperto__pc-light.png — campi orario «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM» — formato 12 ore AM/PM in un'app italiana, mentre il riepilogo sopra e il calendario usano 23:30 / 13:00 — forzare formato 24h (input personalizzato o lang="it" + hourCycle h23).
- [gravità: alta] giornata-sonno-aperto__pc-light.png — menu durata «15 mir», «45 mi», «45 mi» — testo tagliato dentro select nativi troppo stretti — allargare a ~96px o usare «15'»/«45 min» con select personalizzato.
- [gravità: media] giornata-sonno-aperto__pc-light.png — righe pasti — etichetta a sinistra e controlli spinti all'estremo destro con 450px di vuoto in mezzo; i campi «A letto»/«Sveglia» invece occupano metà larghezza ciascuno: due griglie diverse nello stesso pannello — una griglia unica a colonne (etichetta 120px | ora | durata | elimina) allineata anche per sonno.
- [gravità: media] giornata-sonno-aperto__pc-light.png — azioni «+ Pasto · Ripristina · Ritmo di base» — «Ritmo di base» non dice cosa fa (apre impostazioni? salva come predefinito?) e «Ripristina» è distruttiva ma stilizzata come le altre — testi espliciti («Usa come orari abituali», «Torna agli orari abituali») e Ripristina in secondo piano.
- [gravità: bassa] giornata-sonno-aperto__pc-light.png — select nativi del browser con freccia di sistema — stonano con il resto dell'interfaccia — select personalizzati coerenti con gli input.
- [gravità: bassa] giornata-sonno-aperto__pc-light.png — riga riassuntiva in cima al pannello aperto — resta la stessa stringa di icone anche a pannello aperto, ripetendo le informazioni sotto — a pannello aperto mostrare un titolo «Sonno e pasti di oggi».

## giornata-scheda-blocco__pc-light.png
- [gravità: alta] giornata-scheda-blocco__pc-light.png — finestra, riga «Ora 09:30 AM» — formato 12h AM/PM — 24h «09:30».
- [gravità: media] giornata-scheda-blocco__pc-light.png — titolo «Organizzare cena / con il gruppo» — va a capo dopo ~200px pur avendo 380px disponibili: il titolo è limitato inutilmente — titolo a tutta larghezza meno la X (padding-right 40px).
- [gravità: media] giornata-scheda-blocco__pc-light.png — pulsante «↶ Togli la spunta» — espressione poco naturale, ed è l'unica indicazione che l'attività è fatta (lo stato non è mostrato) — mostrare stato «✓ Fatta alle …» con azione «Segna come non fatta».
- [gravità: bassa] giornata-scheda-blocco__pc-light.png — valori «09:30 AM ⓧ», «1 h 30 ⓧ», «Relazioni & Sociale» — i primi due hanno la X per cancellare, l'Area no; «1 h 30» è un formato insolito — uniformare le pillole; durata «1 h 30 min» o «1:30».
- [gravità: bassa] giornata-scheda-blocco__pc-light.png — «Sposta in Da fare» — «Da fare» sembra un nome proprio, la frase non si capisce subito (toglie l'orario? la toglie da oggi?) — «Togli dal calendario» o «Rimanda (senza data)».
- [gravità: bassa] giornata-scheda-blocco__pc-light.png — sottotitolo «Attività · Oggi» — grigio piccolo, poco utile; mancano invece modifica del titolo e note — rendere il titolo modificabile e aggiungere un campo note / link «Apri scheda completa».
- [gravità: bassa] giornata-scheda-blocco__pc-light.png — «&» in «Relazioni & Sociale» — anglicismo tipografico — «Relazioni e vita sociale».

## giornata-scheda-abitudine__pc-light.png
- [gravità: alta] giornata-scheda-abitudine__pc-light.png — riga «Ora 06:00 PM» — formato 12h AM/PM — «18:00».
- [gravità: media] giornata-scheda-abitudine__pc-light.png — pulsante «✓ Fatta» viola — nella schermata Adesso la stessa azione è «✓ Fatto» verde: colore e genere grammaticale diversi per la stessa azione; inoltre «Fatta» sembra uno stato, non un comando — un solo pulsante «Segna come fatta» con un solo colore (verde = completamento) ovunque.
- [gravità: media] giornata-scheda-abitudine__pc-light.png — «Termina l'abitudine» — azione distruttiva/definitiva colorata come le altre (viola), mentre nella scheda attività «Elimina» è rossa — colore di pericolo (rosso) e conferma.
- [gravità: bassa] giornata-scheda-abitudine__pc-light.png — confronto con scheda attività — lo stesso tipo di finestra ha struttura diversa (lì «Togli la spunta» testuale centrato, qui pulsante pieno; lì 2 azioni, qui 3; sottotitolo con/senza icona) — un solo modello di scheda per blocco calendario.
- [gravità: bassa] giornata-scheda-abitudine__pc-light.png — «Salute & Sport» — «&» — «Salute e sport».

## rituali__pc-light.png
- [gravità: media] rituali__pc-light.png — scheda «Rituali» in alto — il contatore «1» presente nelle altre schermate sparisce quando la scheda è attiva; inoltre «1» non corrisponde a nulla di visibile (qui ci sono 4 rituali «da fare/da compilare») — badge sempre visibile e uguale al numero di rituali da fare ora, o toglierlo.
- [gravità: media] rituali__pc-light.png — colonna di stato a destra «da fare / 2 di 3 scelte», «da compilare / 0 di 4», «✓ fatto» — tre formulazioni diverse per lo stesso concetto, in minuscolo, 12px grigio; «2 di 3 scelte» è criptico — unificare («Da fare · 2/3»), aggiungere orario consigliato («mattina», «sera», «domenica»).
- [gravità: bassa] rituali__pc-light.png — icona di «Piano del giorno» piena viola, le altre chiare — non si capisce perché quella sia diversa (è quella consigliata ora?) — se è il rituale del momento, dirlo con un'etichetta «Adesso».
- [gravità: bassa] rituali__pc-light.png — nomi «Fine giornata» e «Bilancio della settimana» — nelle schermate del rituale aperto i titoli sono altri (vedi rituale-sera / rituale-settimana): nomi da allineare.
- [gravità: bassa] rituali__pc-light.png — pagina — cinque righe e 400px di vuoto sotto: su computer i rituali potrebbero aprirsi in un pannello a destra invece che a fisarmonica — layout master/detail.

## rituale-piano__pc-light.png
- [gravità: media] rituale-piano__pc-light.png — contenuto aperto di «Piano del giorno» — nessuna frase che spieghi cosa fare (scegliere 3 priorità? pianificare tutto?): l'elenco parte subito con due voci — una riga guida in cima («Scegli fino a 3 cose importanti per oggi»).
- [gravità: media] rituale-piano__pc-light.png — righe attività — la pillola «☆ Priorità» compare solo sulla prima (barrata), sull'altra no e non c'è un modo visibile per marcarla; le icone area (persone rosa, cartella gialla) sono minuscole e senza etichetta — stella cliccabile sempre visibile su ogni riga; area come testo breve.
- [gravità: bassa] rituale-piano__pc-light.png — segnaposto «Aggiungi un‘altra…» — apostrofo tipografico sbagliato (‘ aperto invece di ’) — usare «un’altra».
- [gravità: bassa] rituale-piano__pc-light.png — campi «Aggiungi…» e «Es. alle 9:00, alla scrivania» — campi grigi pieni senza bordo, mentre altrove (Giorno, Da fare) i campi sono bianchi bordati — un solo stile di input.
- [gravità: bassa] rituale-piano__pc-light.png — «Quando inizi?» — non chiaro se crea un orario nel calendario o è una nota libera — sottotitolo «Un’intenzione: quando e dove inizi la prima cosa».
- [gravità: bassa] rituale-piano__pc-light.png — pulsante «Salva +5 XP» largo 730px — sproporzionato su computer; «+5 XP» attaccato al testo con peso diverso — pulsante di larghezza naturale allineato a destra; XP come piccola nota sotto.

## rituale-sonno-pasti__pc-light.png
- [gravità: alta] rituale-sonno-pasti__pc-light.png — righe «A letto 11:30 PM», «Sveglia 07:30 AM» — formato 12h, mentre 20px più su la stessa informazione è «23:30–07:30» — 24h ovunque.
- [gravità: media] rituale-sonno-pasti__pc-light.png — due pulsanti di conferma: «Salva» (sonno, a metà) e «Fatto» (in fondo, pieno viola) — non si capisce se «Fatto» salva anche il sonno o se bisogna premere entrambi — un solo pulsante finale; il sonno si salva con «Fatto».
- [gravità: media] rituale-sonno-pasti__pc-light.png — pulsanti pasto «sì / no / ⏰» — il terzo pulsante ha solo un'icona orologio (cambia orario? più tardi?), «sì» minuscolo, nessuno stato selezionato visibile — segmentato «Sì · No · Altro orario» con stato attivo evidente.
- [gravità: bassa] rituale-sonno-pasti__pc-light.png — «Come sempre · 23:30–07:30» in viola a destra di «Sonno» — sembra un link ma non si capisce cosa fa (applica gli orari abituali?) — pulsante esplicito «Usa orari abituali».
- [gravità: bassa] rituale-sonno-pasti__pc-light.png — sezione «Altre cose fatte» — fuori tema in un rituale «Sonno e pasti», non spiega dove finiscono queste voci — spostarla nella review della sera o spiegare («Aggiungi al registro di oggi»).
- [gravità: bassa] rituale-sonno-pasti__pc-light.png — ritmo verticale — righe del sonno alte 52px con separatore, righe pasti 52px con sottotitolo, titoli sezione «Sonno»/«Pasti» grigi 13px poco visibili — titoli di sezione più marcati e stesso stile di riga.
- [gravità: bassa] rituale-sonno-pasti__pc-light.png — stato «0 di 4» — non dice 4 di cosa — «0/4 risposte».

## rituale-checkin__pc-light.png
- [gravità: media] rituale-checkin__pc-light.png — pulsanti 1–5 selezionati («4» energia, «5» concentrazione e umore) — il pulsante selezionato si ingrandisce e sporge: tocca il vicino e il «5» esce di ~4px oltre il margine destro della colonna (1132 vs 1128) — evidenziare solo con colore/bordo, senza scale; oppure riservare lo spazio.
- [gravità: media] rituale-checkin__pc-light.png — pulsante «Registra +3 XP» — il check-in è già «✓ fatto» ma il pulsante resta «Registra» come se non fosse salvato; inoltre qui è lilla chiaro, in «Piano» è viola pieno («Salva»), in «Sonno» «Fatto»: tre etichette e due stili per la stessa azione — «Aggiorna» quando già fatto; un unico stile e verbo per chiudere un rituale.
- [gravità: media] rituale-checkin__pc-light.png — titolo «Andamento degli ultimi 14 giorni» — è più grande (20px nero) del titolo del rituale («Check-in» 17px) che lo contiene: gerarchia invertita — sottotitolo 15px semibold.
- [gravità: bassa] rituale-checkin__pc-light.png — tre scale 1–5 con pulsanti 140×50px — su computer occupano tutto lo schermo; un check-in di 3 tocchi richiede scorrere — pulsanti 44px quadrati in fila, le tre domande in 3 colonne o più compatte.
- [gravità: bassa] rituale-checkin__pc-light.png — etichette «concentratissimo», «alla grande», «giù» — registro molto colloquiale e incoerente con «esausto/pieno» — «molto concentrato», «benissimo», «molto giù».

## rituale-sera__pc-light.png
- [gravità: alta] rituale-sera__pc-light.png — valutazioni 1–5 per area — nessuna domanda né ancoraggio: non si sa cosa si sta votando (soddisfazione? impegno? tempo dedicato?) né se 1 è bene o male — domanda in testa («Com’è andata oggi in ciascuna area?») e ancoraggi «1 male · 5 benissimo» come nel check-in.
- [gravità: media] rituale-sera__pc-light.png — scala 1–5 — qui quadratini grigi 36px senza bordo, nel check-in rettangoli bianchi 140×50 bordati: stesso componente con due aspetti — un solo componente di valutazione.
- [gravità: media] rituale-sera__pc-light.png — 8 aree da votare ogni sera prima delle domande — rituale lungo, le domande («Cosa è andato bene oggi?») finiscono sotto la piega — rendere facoltativo («Salta») o mostrare solo le aree toccate oggi.
- [gravità: bassa] rituale-sera__pc-light.png — titolo del rituale — qui «Fine giornata», nell'elenco schermate «Review della sera»: nomenclatura incoerente fra parti dell'app — scegliere un nome («Fine giornata») e usarlo ovunque.
- [gravità: bassa] rituale-sera__pc-light.png — aree «Progetti Founder», «Relazioni & Sociale», «Salute & Sport» — inglese e «&» — «Progetti personali/imprenditoriali», «e».
- [gravità: bassa] rituale-sera__pc-light.png — fisarmonica — gli altri 3 rituali restano aperti sopra e spingono giù il contenuto: su computer il rituale aperto dovrebbe stare in un pannello a parte — dettaglio a destra o pagina dedicata.

## rituale-settimana__pc-light.png
- [gravità: media] rituale-settimana__pc-light.png — numeri «216», «10», «6/7» — unico punto dell'app con un carattere serif: incoerenza tipografica — usare il font dell'interfaccia con cifre tabulari.
- [gravità: bassa] rituale-settimana__pc-light.png — gruppo statistiche — centrato nella card ma ciascun blocco allineato a sinistra (inizio a 566px), non allineato né al bordo sinistro dei campi (400px) né simmetrico — tre colonne uguali a tutta larghezza come in Anno, testo centrato.
- [gravità: bassa] rituale-settimana__pc-light.png — etichette «XP guadagnati / azioni completate / giorni attivi» — «azioni completate» qui, «fatte» in Anno, «cose fatte» in Mese: tre parole per la stessa misura — un solo termine.
- [gravità: bassa] rituale-settimana__pc-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — senza punto interrogativo, mentre in «Fine giornata» c'è («Cosa è andato bene oggi?») — aggiungere «?».
- [gravità: bassa] rituale-settimana__pc-light.png — aree di testo grigie alte 48px con maniglia di ridimensionamento visibile — piccole per una riflessione e con aspetto da browser — altezza 3 righe, auto-espandibili, senza maniglia.
- [gravità: bassa] rituale-settimana__pc-light.png — «Bilancio della settimana · da fare» un martedì — non si sa quando va fatto (domenica?) — mostrare «domenica» o «disponibile da venerdì».

## attivita-sistemare__pc-light.png
- [gravità: bassa] attivita-sistemare__pc-light.png — etichetta «Da sistemare» sotto le schede — ripete il nome della scheda appena selezionata — sostituirla con un'istruzione («Decidi cosa fare di ogni nota: oggi, più avanti o scartala»).
- [gravità: media] attivita-sistemare__pc-light.png — select «Altro / Esplorazione» — select nativo grigio del browser, diverso da tutti gli altri controlli; non è chiaro che sia l'area da assegnare — etichetta «Area» e selettore a pillola come nella scheda attività.
- [gravità: media] attivita-sistemare__pc-light.png — pulsanti «Oggi / Da fare / Scarta» — etichette ellittiche («Oggi» cosa?) e tre blocchi da 250px — «Fai oggi», «Più avanti», «Scarta»; mostrare scorciatoie da tastiera (O / D / ⌫) visto che su computer lo smistamento si fa a raffica.
- [gravità: bassa] attivita-sistemare__pc-light.png — elenco «In coda» — righe di testo grigio senza aspetto cliccabile né hover; «e un’altra» in corsivo non mostra la quinta voce pur avendo 300px di spazio — mostrare tutte le voci (lo spazio c'è) e renderle selezionabili.
- [gravità: bassa] attivita-sistemare__pc-light.png — titolo «Idea: bot che trasforma i vocali in task» — esempio con «task» in inglese mentre l'app dice «attività» — (contenuto di esempio) usare «attività».

## attivita-dafare__pc-light.png
- [gravità: alta] attivita-dafare__pc-light.png — elenco «Importanti»/«Altre» — nessuna casella di spunta: dall'elenco delle cose da fare non si può completare nulla (in «Adesso › Poi» invece c'è la casella) — casella a sinistra di ogni riga.
- [gravità: media] attivita-dafare__pc-light.png — primo «+ Oggi» viola pieno, gli altri lilla chiari — sembra uno stato diverso (già in oggi?) ma non è spiegato; se è solo hover/focus è troppo forte — stato «già in Oggi» con etichetta «✓ In oggi», altrimenti tutti uguali.
- [gravità: media] attivita-dafare__pc-light.png — «1 di 3», «1 di 4» a destra — numeri senza unità (sono i passi) — «1/3 passi» con piccola barra o icona.
- [gravità: bassa] attivita-dafare__pc-light.png — filtro «Tutte ⌄» — attaccato al titolo «Importanti» (8px) mentre fra campo e filtro ci sono 16px: il filtro sembra appartenere alla sezione — metterlo sulla stessa riga del campo o a destra dei titoli, con spaziatura coerente.
- [gravità: bassa] attivita-dafare__pc-light.png — badge «6» su «Attività» in barra laterale — corrisponde a «Da sistemare», non alle 9 «Da fare»: ambiguo — tooltip «6 da sistemare» o badge solo sulla scheda.
- [gravità: bassa] attivita-dafare__pc-light.png — icone area colorate 12px prima del titolo — unica indicazione dell'area, illeggibile — nome area in piccolo sotto il titolo come in «Poi».
- [gravità: bassa] attivita-dafare__pc-light.png — righe alte 60px con un'azione sola a destra, nessun hover visibile — su computer mostrare al passaggio azioni rapide (data, priorità, elimina).

## attivita-dafare-aggiunta__pc-light.png
- [gravità: media] attivita-dafare-aggiunta__pc-light.png — riga opzioni «Oggi · Domani · Senza data · Altro / Esplorazione» — rientrata di 12px rispetto al campo (396 vs 384) e con altezze diverse (pillole 34px, select 40px) — allineare al bordo sinistro del campo e uniformare l'altezza a 36px.
- [gravità: media] attivita-dafare-aggiunta__pc-light.png — select area nativo con freccia di sistema — stona accanto alle pillole — selettore a pillola con menù personalizzato.
- [gravità: bassa] attivita-dafare-aggiunta__pc-light.png — opzioni senza etichette («Quando», «Area») e senza modo di segnare «Importante» o un orario, che però esistono nell'elenco — aggiungere stella «Importante» e «Scegli data…» (calendario) oltre a Oggi/Domani.
- [gravità: bassa] attivita-dafare-aggiunta__pc-light.png — le opzioni compaiono sopra l'elenco spingendolo giù di 56px — salto di layout durante la digitazione — pannello che si apre in sovrimpressione o spazio riservato.

## attivita-abitudini__pc-light.png
- [gravità: media] attivita-abitudini__pc-light.png — elenco abitudini — card separate con spazi fra loro, mentre «Da fare» usa un'unica card con righe divise: due stili di lista nella stessa sezione Attività — uniformare (lista raggruppata).
- [gravità: media] attivita-abitudini__pc-light.png — cerchi di completamento 44px verdi/blu a destra — grandi, colorati per area senza spiegazione, e diversi dalle caselle quadrate usate per le attività — cerchio 28px neutro con colore area solo come accento, o stessa casella ovunque.
- [gravità: media] attivita-abitudini__pc-light.png — uso dello spazio — ogni abitudine mostra solo orario e area; su 760px di larghezza manca lo storico (ultimi 7 giorni) che è l'informazione più utile di un'abitudine — aggiungere 7 pallini della settimana per riga.
- [gravità: bassa] attivita-abitudini__pc-light.png — riepilogo «0 di 3 oggi» con anello grigio vuoto — anello vuoto sembra un elemento rotto/caricamento; testo «oggi» minuscolo staccato — «0 di 3 fatte oggi» su una riga, anello con traccia visibile.
- [gravità: bassa] attivita-abitudini__pc-light.png — «🔥 3» solo su «Camminata» — serie senza etichetta, come il 38 in Adesso — «3 giorni di fila».

## attivita-abitudini-nuova__pc-light.png
- [gravità: media] attivita-abitudini-nuova__pc-light.png — riga «Ora · Nessuno» — errore di genere: «ora» è femminile — «Nessuna» (meglio «Senza orario»).
- [gravità: media] attivita-abitudini-nuova__pc-light.png — cerchi dei giorni L M M G V S D — sparsi su 730px con ~70px fra uno e l'altro: sembrano scollegati — gruppo compatto di cerchi 36px con 8px di spazio, allineato a sinistra o a destra accanto a «Ogni giorno».
- [gravità: media] attivita-abitudini-nuova__pc-light.png — flusso di creazione — opzioni in una card separata sotto il campo, mentre in «Da fare» sono pillole in linea: due flussi diversi per creare un elemento; il pulsante «Aggiungi» resta nel campo, lontano dalle opzioni da confermare — un solo modello (pannello opzioni attaccato al campo con «Aggiungi» in fondo).
- [gravità: bassa] attivita-abitudini-nuova__pc-light.png — area preimpostata «Salute & Sport» — scelta arbitraria non motivata — nessuna area preselezionata o l'ultima usata, con etichetta «Scegli».
- [gravità: bassa] attivita-abitudini-nuova__pc-light.png — mancano campi tipici di un'abitudine (obiettivo/durata, promemoria) che però esistono nella scheda abitudine — aggiungere «Durata» come nella scheda.

## scheda-attivita__pc-light.png
- [gravità: media] scheda-attivita__pc-light.png — finestra larga 460px su schermo da 1280 — titolo su due righe, contenuto che scorre dentro la finestra, sezione «Dettagli/Area» tagliata dal bordo inferiore: finestra da telefono — su computer pannello laterale destro largo ~520–600px a tutta altezza, o modale più larga (640px) con due colonne (Passi | Pianifica/Dettagli).
- [gravità: media] scheda-attivita__pc-light.png — pillole «Pianifica» — «Un altro giorno» va a capo da sola su una seconda riga — tutte su una riga (sono corte) o «Scegli data…» come ultimo elemento allineato.
- [gravità: media] scheda-attivita__pc-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» — funzione poco chiara (assegna date ai passi?), pillole in minuscolo mentre quelle di «Pianifica» hanno la maiuscola — testo di aiuto («Assegna una data a ciascun passo, a partire da domani») e maiuscole coerenti.
- [gravità: bassa] scheda-attivita__pc-light.png — pulsante «Prossimo passo in Oggi» — frase poco naturale — «Fai il prossimo passo oggi» o «Aggiungi “Recuperare modulo 1” a oggi».
- [gravità: bassa] scheda-attivita__pc-light.png — titoli di sezione «Pianifica / Passi / Dettagli» — rientrati di 4px rispetto ai contenuti (435 vs 431) e molto deboli (13px grigio) — allineare al bordo e aumentare il contrasto.
- [gravità: bassa] scheda-attivita__pc-light.png — riga «Area · Studio / Università ⌄» (tagliata) — select nativo — stesso selettore a pillola della scheda calendario.

## scheda-attivita-fondo__pc-light.png
- [gravità: media] scheda-attivita-fondo__pc-light.png — riga «Fissa in alto · no» — valore testuale «no» senza interruttore né freccia: non sembra modificabile — interruttore on/off; e chiarire il rapporto con la sezione «Importanti» dell'elenco (stesso concetto con due nomi?).
- [gravità: media] scheda-attivita-fondo__pc-light.png — azione «↶ Non completata ›» — etichetta ambigua (l'attività non è completata: è un'azione «abbandona»? «segna non fatta»?) con icona annulla e freccia da navigazione — verbo esplicito: «Segna come non portata a termine» / «Archivia senza completare».
- [gravità: media] scheda-attivita-fondo__pc-light.png — manca un'azione principale «Segna come completata» per l'attività intera — aggiungerla in alto accanto al titolo.
- [gravità: bassa] scheda-attivita-fondo__pc-light.png — righe Dettagli — «Area» con ⌄, «Scadenza» con ›, «Fissa in alto» senza nulla: tre segnali diversi di interattività; valori in minuscolo («nessuna», «no») — stesso schema (valore + ›) e maiuscola iniziale.
- [gravità: bassa] scheda-attivita-fondo__pc-light.png — nessun campo note/descrizione nella scheda — aggiungere «Note».

## scheda-abitudine__pc-light.png
- [gravità: alta] scheda-abitudine__pc-light.png — riga «Ora 06:00 PM» — formato 12h, mentre il sottotitolo 400px più su dice «lun–ven · 18:00» — 24h.
- [gravità: media] scheda-abitudine__pc-light.png — calendario della storia — manca il nome del mese; giorni 29–31 con cerchio grigio, 27–28 senza, weekend senza: tre stati grigi indistinguibili senza legenda (mancato? non previsto? prima della creazione?) — intestazione «Agosto 2026» con frecce, legenda «fatto / saltato / non previsto».
- [gravità: bassa] scheda-abitudine__pc-light.png — riga «Ora» — la X per togliere l'orario è fuori dalla pillola, nella scheda dal calendario è dentro (ⓧ): stesso controllo disegnato in due modi — uniformare.
- [gravità: bassa] scheda-abitudine__pc-light.png — statistiche «3 di fila / 4 record / 7 in tutto» — «record» da solo non dice di cosa — «Record: 4 di fila», «7 volte in tutto».
- [gravità: bassa] scheda-abitudine__pc-light.png — finestra stretta 460px con tutto impilato e scorrimento interno — su computer storia e impostazioni affiancate in una finestra più larga.
- [gravità: bassa] scheda-abitudine__pc-light.png — «Fatta» (pulsante viola pieno) + «Salta oggi» (link) — vedi incoerenza col verde «Fatto» di Adesso.

## scheda-abitudine-fondo__pc-light.png
- [gravità: alta] scheda-abitudine-fondo__pc-light.png — riga «Inizio 07/29/2026» — formato data americano mese/giorno/anno in un'app italiana — «29/07/2026» o meglio «29 lug 2026».
- [gravità: bassa] scheda-abitudine-fondo__pc-light.png — pulsante «Elimina» — centrato, senza icona, su fondo grigio a tutta larghezza; nella scheda attività è allineato a sinistra con icona cestino dentro un gruppo — uniformare lo stile delle azioni distruttive.
- [gravità: bassa] scheda-abitudine-fondo__pc-light.png — valori «Salute & Sport» e «07/29/2026» in viola, «Mai» in grigio sulla stessa pillola — colore del testo incoerente — stesso colore per tutti i valori modificabili.
- [gravità: bassa] scheda-abitudine-fondo__pc-light.png — «Ora 06:00 PM» — 12h (vedi sopra).

## andamento__pc-light.png
- [gravità: alta] andamento__pc-light.png — card «Per area», nomi delle aree — tagliati di netto senza puntini: «Relazioni &», «Salute & Sp», «Studio / Un», «Altro / Espl», «Progetti Fo», «Associazio» — colonna nomi più larga (140px) con ellissi e tooltip, o nome sopra la barra.
- [gravità: alta] andamento__pc-light.png — card in alto «🔥 38» con la settimana — la serie dice 38 giorni ma venerdì nella striscia è vuoto (non fatto): informazioni contraddittorie o regola della serie non spiegata — spiegare cosa conta («38 giorni con almeno un rituale») o correggere il calcolo.
- [gravità: media] andamento__pc-light.png — card «Costanza» — mappa a quadratini minuscola (12px) appoggiata in alto a sinistra, metà card vuota; nessuna etichetta di mesi/giorni; colore blu, mentre la stessa misura nella vista Anno è verde — quadratini che riempiono la card, etichette mesi, stesso colore della vista Anno.
- [gravità: media] andamento__pc-light.png — barre «Per area» — la lunghezza delle barre varia con la larghezza del numero («Lavoro» finisce prima): colonne non allineate — colonna percentuale a larghezza fissa allineata a destra, cifre tabulari.
- [gravità: media] andamento__pc-light.png — «38» e «65% · 81 di 124» — numeri grandi senza etichetta (serie? percentuale di cosa?) — «38 giorni di fila», «65% delle attività completate (81 su 124)».
- [gravità: bassa] andamento__pc-light.png — striscia settimanale «M G V S D L M» — solo iniziali, due «M» ambigue, nessuna data — aggiungere il numero del giorno.
- [gravità: bassa] andamento__pc-light.png — elenco «Riflessioni passate / Sessioni del timer / Aree» — «Aree» è anche in Profilo: due ingressi alla stessa pagina in sezioni diverse; «79» senza unità — un solo posto; «79 riflessioni».

## andamento-fondo__pc-light.png
- [gravità: media] andamento-fondo__pc-light.png — voce «Grafici ›» in fondo — i grafici, cuore di una pagina «Andamento», sono nascosti dietro un link generico mentre la pagina ha spazio libero — mostrare 1–2 grafici principali direttamente nella pagina, link «Tutti i grafici».
- [gravità: bassa] andamento-fondo__pc-light.png — barre «Salute & Sp» e «Lavoro» più corte delle altre (fine a 1043/1050 vs 1057) — disallineamento dovuto alla larghezza del testo percentuale (vedi sopra).
- [gravità: bassa] andamento-fondo__pc-light.png — elenco link — icone diverse per peso/stile (archivio, cronometro, mirino, freccia) e voce «Aree» duplicata col Profilo — uniformare icone, togliere il duplicato.
- [gravità: bassa] andamento-fondo__pc-light.png — card «Costanza» — altezza pareggiata a «Per area» ma metà vuota (vedi sopra).

## scoperte__pc-light.png
- [gravità: media] scoperte__pc-light.png — sottotitoli «misurato», «lo noto ogni volta», «notato una volta» — tre formule di «quanto sono sicuro» con tempi verbali diversi e senza spiegazione — scala chiara e uniforme («Certezza: alta / media / bassa» o «Visto 1 volta / Sempre / Misurato») con legenda.
- [gravità: bassa] scoperte__pc-light.png — elenchi «Funziona» / «Non funziona» impilati — su 760px+ di larghezza potrebbero stare affiancati in due colonne, evitando lo scorrimento — due colonne su ≥1100px.
- [gravità: bassa] scoperte__pc-light.png — icone pollice dentro quadratini bordati e colorati — bordo + fondo + icona: decorazione pesante ripetuta 8 volte — solo icona colorata o pallino.
- [gravità: bassa] scoperte__pc-light.png — terzo livello di schede («Registro / Esperimenti» sotto «Riepilogo / Scoperte») — navigazione a 3 livelli (barra laterale › schede › sottoschede) — su computer usare la barra laterale per i livelli superiori.

## scoperte-esperimenti__pc-light.png
- [gravità: media] scoperte-esperimenti__pc-light.png — grafico, etichette «media 3,1» e «media 4,3» — scritte sopra i punti e sulla linea tratteggiata: testo e dati si sovrappongono — etichette fuori dall'area dati (a destra del grafico o sopra con fondo) .
- [gravità: media] scoperte-esperimenti__pc-light.png — grafico — nessun asse orizzontale (date/giorni), asse Y solo 1–3–5 — aggiungere date d'inizio/fine e della modifica sull'asse X.
- [gravità: bassa] scoperte-esperimenti__pc-light.png — pillole «⚑ concluso» e «Focus (da check-in, 1–5)» accanto al titolo — bordate come pulsanti ma sono informazioni (o lo sono? non si capisce) — badge senza bordo per lo stato; se cliccabili, aspetto da pulsante chiaro.
- [gravità: bassa] scoperte-esperimenti__pc-light.png — «L’entità del cambiamento è grande (d≈3,1)» — notazione statistica (d di Cohen) incomprensibile per l'utente medio — togliere la parentesi o spiegarla al passaggio.
- [gravità: bassa] scoperte-esperimenti__pc-light.png — testo introduttivo e «La modifica: …» limitati a ~420px in card da 760px — colonna di testo stretta che lascia mezza card vuota — portare a ~600px o affiancare il pulsante «Nuovo esperimento» a destra.

## scheda-scoperta__pc-light.png
- [gravità: media] scheda-scoperta__pc-light.png — «Esito: funziona / non funziona» — è l'informazione principale di una scoperta ma è sepolta in «Dettagli» sotto la certezza — spostarla subito sotto il testo.
- [gravità: bassa] scheda-scoperta__pc-light.png — pillole nella stessa finestra con due stili: certezza = grigie/viola su fondo bianco, esito = bianche/viola dentro un riquadro grigio — un solo controllo segmentato.
- [gravità: bassa] scheda-scoperta__pc-light.png — titolo «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione; altrove l'oggetto si chiama «scoperta» — titolo «Scoperta», etichetta «Cosa hai scoperto».
- [gravità: bassa] scheda-scoperta__pc-light.png — opzioni tutte in minuscolo («notato una volta», «funziona»), domanda «Quanto ne sei sicuro» senza «?» — maiuscola iniziale e punto interrogativo.
- [gravità: bassa] scheda-scoperta__pc-light.png — nessun pulsante «Salva»/«Fine» né indicazione di salvataggio automatico — aggiungere «Salvato» discreto o pulsante «Fine».

## profilo__pc-light.png
- [gravità: alta] profilo__pc-light.png — riga statistiche «38 giorni / 109 fatte / 65% riuscita» — numeri che non tornano con il resto dell'app: Andamento «81 di 124», Anno «82 fatte», Anno «49 giorni attivi» vs qui «38 giorni» — definire una volta le metriche (periodo e regola) e mostrare etichette che dicano il periodo («da sempre», «quest’anno»).
- [gravità: media] profilo__pc-light.png — barra laterale — siamo nel Profilo ma nessuna voce è evidenziata («Profilo e impostazioni» in basso resta grigia): si perde l'orientamento — stato attivo anche per la voce in fondo.
- [gravità: media] profilo__pc-light.png — «Promemoria · bloccati» — stato allarmante senza spiegazione né azione diretta (è il permesso del browser?) — «Notifiche bloccate dal browser — Come attivarle» con colore di avviso.
- [gravità: bassa] profilo__pc-light.png — «65% riuscita» — parola innaturale — «65% completate».
- [gravità: bassa] profilo__pc-light.png — avatar «R» quadrato arrotondato qui, cerchio nella barra in alto delle altre pagine — stessa forma ovunque.
- [gravità: bassa] profilo__pc-light.png — pagina senza titolo né barra superiore (le altre sezioni hanno le schede in alto): impaginazione diversa e la card profilo parte a 30px dal bordo — titolo «Profilo» coerente con le altre sezioni; card profilo con indicazione «Modifica».
- [gravità: bassa] profilo__pc-light.png — card statistiche — padding verticale 10px, molto più stretto delle altre card (20–24px) — uniformare.

## impostazioni__pc-light.png
- [gravità: media] impostazioni__pc-light.png — Impostazioni in una finestra di 460px che scorre internamente sopra la pagina Profilo — su computer le impostazioni dovrebbero essere una pagina (o finestra larga con menù a sinistra: Account / Preferenze / Dati / Guida) — pagina dedicata a due colonne.
- [gravità: media] impostazioni__pc-light.png — sezione «Account» contiene solo «Sincronizzazione»; il gruppo successivo (Area predefinita, Timer, Musica, Aspetto) non ha titolo — titolo «Preferenze» al secondo gruppo.
- [gravità: bassa] impostazioni__pc-light.png — «Sincronizzazione · su questo dispositivo» senza freccia — non si capisce se è cliccabile né cosa significhi (non sincronizza?) — «Non attiva · dati solo su questo dispositivo ›».
- [gravità: bassa] impostazioni__pc-light.png — valori «Automatica» (maiuscola, con ⌄) vs «chiedi sempre», «nessuna», «automatico» (minuscolo, con ›) — maiuscole e indicatori incoerenti — maiuscola iniziale ovunque e stesso indicatore.
- [gravità: bassa] impostazioni__pc-light.png — «Backup e ripristino · 1» — numero senza unità — «1 backup».
- [gravità: bassa] impostazioni__pc-light.png — voce «Scienza» nella Guida — etichetta vaga — «Su cosa si basa l’app» / «Le ricerche dietro LifeMax».

## impostazioni-fondo__pc-light.png
- [gravità: bassa] impostazioni-fondo__pc-light.png — «Registro tecnico» dentro «Guida» — è uno strumento di diagnostica, non una guida — spostarlo in una sezione «Avanzate» / «Informazioni».
- [gravità: media] impostazioni-fondo__pc-light.png — «Rimuovi dati di esempio» in fondo alle impostazioni — se l'app è piena di dati di esempio, l'utente deve saperlo subito (banner nella home «Stai vedendo dati di esempio — Rimuovili») — aggiungere avviso visibile e lasciare qui la voce.
- [gravità: bassa] impostazioni-fondo__pc-light.png — manca una sezione «Informazioni» (versione, privacy, contatti/feedback), utile in una Beta — aggiungerla in fondo.
- [gravità: bassa] impostazioni-fondo__pc-light.png — «Esporta dati» / «Importa dati» senza freccia, le altre righe sì — indicatore incoerente (azione immediata vs navigazione non distinte in modo chiaro) — accettabile se voluto; altrimenti aggiungere descrizione del formato («file JSON»).

## imp-timer__pc-light.png
- [gravità: media] imp-timer__pc-light.png — sezioni «Avvio rapido / Sessione / Pomodoro» — tre tipi di timer con durate simili (5+25, 25, 25/5) senza una riga che spieghi la differenza; «Poi continua per» è oscuro — una frase descrittiva sotto ogni titolo di sezione («Parti con 5 minuti per vincere la resistenza, poi…»).
- [gravità: media] imp-timer__pc-light.png — «Pausa lunga ogni 4 · No» — frase spezzata (ogni 4 cosa?) con valore «No» che non risponde alla domanda — interruttore «Pausa lunga ogni 4 sessioni» + durata.
- [gravità: bassa] imp-timer__pc-light.png — finestra — cambia altezza e posizione verticale passando da Impostazioni (48–751px) a Timer (75–725px): la finestra «salta» — altezza fissa o ancorata in alto.
- [gravità: bassa] imp-timer__pc-light.png — link «‹ Impostazioni» 12px sopra il titolo — piccolo, e la X è allineata al titolo, non al link — freccia indietro a sinistra del titolo sulla stessa riga.
- [gravità: bassa] imp-timer__pc-light.png — valori a pillola («5 min», «Chiedi sempre», «No») senza segno di menù — non si capisce se si aprono, si ciclano o si scrivono — aggiungere ⌄ o stepper −/+ per le durate.
- [gravità: bassa] imp-timer__pc-light.png — etichette delle righe in peso normale, nella pagina Impostazioni in semibold — uniformare.

## imp-musica__pc-light.png
- [gravità: media] imp-musica__pc-light.png — campi «Incolla il link» — stesso grigio del riquadro che li contiene, solo un'ombra appena visibile: i campi quasi non si vedono — campi bianchi con bordo 1px, come gli altri input.
- [gravità: media] imp-musica__pc-light.png — «Incolla il link» — non dice link di cosa (Spotify? YouTube? playlist?) né cosa succede — testo di aiuto in cima: «Incolla il link di una playlist (Spotify, YouTube…): si aprirà quando avvii il timer».
- [gravità: bassa] imp-musica__pc-light.png — etichette «Predefinita», «Studio / Università»… attaccate al bordo superiore del riquadro (13px) e campo rientrato di 15px rispetto all'etichetta — padding uniforme 12px sopra/sotto, campo allineato all'etichetta.
- [gravità: bassa] imp-musica__pc-light.png — primo gruppo senza titolo, il secondo ha «Per area» — titolo «Predefinita» come sezione.
- [gravità: bassa] imp-musica__pc-light.png — interruttore spento: pomello bianco su binario grigio chiarissimo dentro riquadro grigio — contrasto basso — binario più scuro.
- [gravità: bassa] imp-musica__pc-light.png — 8 campi link uno sotto l'altro — lungo e ripetitivo — su computer griglia a due colonne o «+ Musica per un’area» solo quando serve.

## imp-aspetto__pc-light.png
- [gravità: media] imp-aspetto__pc-light.png — finestra — qui centrata verticalmente e bassa (230–570px), mentre Timer e Musica partono da 48–75px: navigando fra le sottopagine la finestra salta su e giù di 180px — ancorare la finestra in alto con altezza fissa.
- [gravità: bassa] imp-aspetto__pc-light.png — «Suoni», «Vibrazione» sotto «Aspetto» — non sono aspetto; «Vibrazione» su computer non ha senso — sezione «Suoni e feedback», nascondere Vibrazione su desktop.
- [gravità: bassa] imp-aspetto__pc-light.png — interruttori verdi — il colore d'accento dell'app è viola (selezioni, pulsanti): il verde qui è un terzo colore d'azione — interruttori nel colore d'accento.

## aree__pc-light.png
- [gravità: media] aree__pc-light.png — interruttori verdi accanto a ogni area — non si spiega cosa fa spegnere un'area (la nasconde? la archivia? esce dalle statistiche?) — sottotitolo «Le aree spente non compaiono nelle scelte e nelle statistiche».
- [gravità: media] aree__pc-light.png — righe area — si può solo spegnere o eliminare: niente rinomina, colore, icona, ordine; il cestino a portata di clic accanto all'interruttore rischia eliminazioni accidentali — clic sulla riga apre la modifica; eliminazione dentro la modifica con conferma.
- [gravità: bassa] aree__pc-light.png — testo della finestra leggermente sfocato (anti-aliasing da animazione scale/transform in corso o fermata) — verificare che a fine animazione transform sia «none».
- [gravità: bassa] aree__pc-light.png — «Nuova area» — icona grigia a sinistra del campo senza indicazione che sia cliccabile per scegliere l'icona — tooltip/«Scegli icona», anteprima colore.
- [gravità: bassa] aree__pc-light.png — titolo «Le tue aree» vs voce «Aree» nel Profilo; nella vista Impostazioni le sottopagine hanno «‹ Impostazioni», qui nessun ritorno al Profilo — titoli coerenti con le voci di menù.

## sonno-pasti__pc-light.png
- [gravità: alta] sonno-pasti__pc-light.png — tutti gli orari («11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «05:00 AM – 02:00 PM») — formato 12h — 24h.
- [gravità: media] sonno-pasti__pc-light.png — confronto con il pannello sonno della Giornata — stessa funzione con controlli completamente diversi (lì input e select nativi, cestino; qui pillole e ×) — riusare lo stesso componente in entrambi i posti.
- [gravità: bassa] sonno-pasti__pc-light.png — riga «Tra le 05:00 AM – 02:00 PM» sotto «Promemoria · Sonno» — frase monca («Tra le» cosa?), rientrata di 16px rispetto alle altre righe — «Chiedi il sonno tra le 05:00 e le 14:00».
- [gravità: bassa] sonno-pasti__pc-light.png — pillole orario (grigio-lilla, testo nero) e durata (lilla, testo viola) affiancate con colori diversi — stesso stile per valori modificabili.
- [gravità: bassa] sonno-pasti__pc-light.png — «Promemoria nell’app» qui, mentre esiste anche la pagina «Promemoria» nel Profilo — impostazioni dello stesso tipo divise in due posti — raccogliere o collegare.

## promemoria__pc-light.png
- [gravità: media] promemoria__pc-light.png — avviso «Bloccati» — card larga solo 340px (finisce a 770 mentre i gruppi arrivano a 849), testo centrato, ombra propria: sembra un elemento fuori posto/un toast incastrato — avviso a tutta larghezza, testo allineato a sinistra, senza ombra, con pulsante «Come sbloccarle».
- [gravità: media] promemoria__pc-light.png — interruttori disattivati (grigi) con il pomello a destra — non si capisce se sono accesi o spenti — mostrare chiaramente lo stato (pomello a sinistra se spenti) e solo opacità per «non disponibile».
- [gravità: alta] promemoria__pc-light.png — orari «08:30 AM», «01:00 PM», «04:30 PM», «11:00 PM – 07:00 AM» — formato 12h — 24h.
- [gravità: bassa] promemoria__pc-light.png — testo «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» — formulazione contorta — «Per riceverle, consenti le notifiche per questo sito nelle impostazioni del browser (icona del lucchetto accanto all’indirizzo)».
- [gravità: bassa] promemoria__pc-light.png — voci «Priorità del giorno» — non corrisponde a nessun rituale («Piano del giorno», «Sonno e pasti», «Bilancio della settimana» mancano o hanno nomi diversi) — allineare l'elenco ai rituali.
- [gravità: bassa] promemoria__pc-light.png — «Non disturbare · Attivo» in verde pieno mentre le notifiche sono bloccate — sezione inutile in questo stato — disattivarla visivamente insieme alle altre.

## diario__pc-light.png
- [gravità: alta] diario__pc-light.png — barra laterale — siamo in Profilo › Diario ma è evidenziata «Andamento»: stato di navigazione sbagliato — evidenziare «Profilo e impostazioni» (o spostare davvero il Diario sotto Andamento, accanto a «Riflessioni passate»).
- [gravità: media] diario__pc-light.png — pulsante «↶ Annulla» ripetuto su tutte le ~16 righe — rumore visivo enorme e rischio di annullare per errore azioni di ieri — mostrarlo solo al passaggio del mouse o in un menù «⋯».
- [gravità: media] diario__pc-light.png — righe «Completata · … / Priorità [Relazioni & Sociale ⌄]» — l'etichetta «Priorità» è seguita da un select dell'area: non si capisce cosa sia (priorità? area?) e un select nativo dentro un registro è fuori luogo — mostrare «★ Priorità · Relazioni e sociale» come testo; modifica nella scheda.
- [gravità: media] diario__pc-light.png — impaginazione — il Diario è una pagina con «‹ Profilo», mentre Aree, Sonno e pasti, Promemoria (stesso livello nel Profilo) sono finestre modali: comportamento incoerente; il link «‹ Profilo» a 294px è fuori dalla colonna (384px) — stesso tipo di apertura per tutte le voci del Profilo; link indietro allineato alla colonna.
- [gravità: bassa] diario__pc-light.png — schede «Cose importanti / Tutto» — «Cose importanti» colloquiale — «In evidenza / Tutto».
- [gravità: bassa] diario__pc-light.png — righe «Fine giornata · andata bene: … · ostacolo: …» — etichette in minuscolo attaccate al testo, si legge male — mettere il contenuto della riflessione su righe separate con etichette in grassetto.
- [gravità: bassa] diario__pc-light.png — colonna giorni «Oggi / Ieri» larga 110px quasi vuota — data esplicita («Oggi · mar 18 ago») e colonna più stretta o titolo di gruppo sopra le righe.

## timer-scelta__pc-light.png
- [gravità: media] timer-scelta__pc-light.png — colonna destra «5 min / 25 min / 25 + 5 min / nessun limite» — testo a 4px dal bordo destro del riquadro, mentre a sinistra il padding è 12px: margini interni asimmetrici — padding destro 12–16px (o freccia › come nelle altre liste).
- [gravità: bassa] timer-scelta__pc-light.png — titolo «Timer» — non dice per quale attività si avvia — «Timer per “Ripasso flashcard”».
- [gravità: bassa] timer-scelta__pc-light.png — «Avvio rapido · 5 min» — nelle impostazioni l'avvio rapido è «5 min poi continua per 25»: informazione incompleta; nessuna descrizione delle quattro modalità — sottotitolo di una riga per ciascuna («Parti con 5 minuti, poi decidi»).
- [gravità: bassa] timer-scelta__pc-light.png — su computer mancano scorciatoie (1–4) per scegliere — mostrarle a destra.

## timer-concentrazione__pc-light.png
- [gravità: media] timer-concentrazione__pc-light.png — azione «⏸ Termina» — icona di pausa con etichetta «Termina»: non si sa se mette in pausa o chiude la sessione; manca una vera pausa — due azioni distinte: «⏸ Pausa» e «■ Termina».
- [gravità: media] timer-concentrazione__pc-light.png — «Fatto» (verde pieno) vs «Termina» — non è chiaro che differenza ci sia (Fatto = attività completata? Termina = fine sessione senza completare?) — «Ho finito l’attività» e «Interrompi sessione».
- [gravità: bassa] timer-concentrazione__pc-light.png — schermo nero pieno anche con tema chiaro — scelta forte non annunciata; va bene come «modalità concentrazione» ma va resa coerente (o seguire il tema) — documentare/opzione in Impostazioni › Timer.
- [gravità: bassa] timer-concentrazione__pc-light.png — anello di avanzamento a forma di quadrato arrotondato grigio scuro su nero — contrasto bassissimo (traccia #1c1c1c su #0b0b0b), avanzamento non leggibile — traccia più chiara e progresso colorato.
- [gravità: bassa] timer-concentrazione__pc-light.png — «restano» sotto il tempo — «rimanenti».
- [gravità: bassa] timer-concentrazione__pc-light.png — «Pomodoro · blocco 1» — non dice quanti blocchi in totale né la pausa successiva — «Pomodoro · 1 di 4 · poi 5 min di pausa».

## cattura__pc-light.png
- [gravità: media] cattura__pc-light.png — finestra «Scrivi un pensiero…» — c'è solo «Chiudi»: nessun pulsante per salvare né suggerimento «Invio per salvare», e non dice dove finisce la nota («Da sistemare») — a destra «Salva ↵» primario e «Esc» per chiudere; riga d'aiuto «Finisce in Attività › Da sistemare».
- [gravità: media] cattura__pc-light.png — nomenclatura — lo stesso gesto si chiama «Aggiungi una nota» (barra laterale), «Scrivi un pensiero» (finestra), «Annotato» (diario), «Da sistemare» (destinazione) — un solo termine (es. «Nota veloce» → «Note da smistare»).
- [gravità: bassa] cattura__pc-light.png — linea divisoria rientrata di 5px dai bordi della finestra (non a filo né allineata al testo) — a filo dei bordi o allineata al padding 20px.
- [gravità: bassa] cattura__pc-light.png — «Chiudi» link viola piccolo in un piede alto 48px — molto spazio per un solo link — piede con «Esc Chiudi · ↵ Salva» in grigio, più compatto.

## menu-oggi-avatar__pc-light.png
- [gravità: media] menu-oggi-avatar__pc-light.png — clic sull'avatar in Oggi — porta direttamente alla pagina Profilo (identica a profilo__pc-light) senza menù e senza modo di tornare se non la barra laterale; nessuna voce laterale risulta attiva — su computer l'avatar è superfluo (c'è «Profilo e impostazioni»): toglierlo, oppure farne un menù a tendina (Profilo, Impostazioni, Tema).
- [gravità: bassa] menu-oggi-avatar__pc-light.png — stessi difetti di profilo__pc-light.png (statistiche incoerenti, «riuscita», «bloccati», avatar quadrato vs tondo).

## trascinamento-in-corso__pc-light.png
- [gravità: alta] trascinamento-in-corso__pc-light.png — barra laterale — durante il trascinamento la barra si accorcia e finisce a ~740px: sotto si vede lo sfondo, «Profilo e impostazioni» sale di 60px — la barra deve restare alta 100vh (position: fixed/sticky con height:100vh) anche quando la pagina scorre o cambia altezza.
- [gravità: media] trascinamento-in-corso__pc-light.png — zona di rilascio «Togli l’orario» in basso a destra — esce dalla colonna del contenuto (996–1256px vs bordo 1144px) e copre il calendario — ancorarla dentro la colonna o in una barra in fondo a tutta larghezza del calendario.
- [gravità: media] trascinamento-in-corso__pc-light.png — anteprima di trascinamento — l'etichetta «Organizzare cena… alle 12:45» fluttua 30px sopra la zona di destinazione e ripete l'orario già scritto nell'anteprima «12:45–14:15» — una sola anteprima attaccata al puntatore.
- [gravità: media] trascinamento-in-corso__pc-light.png — l'anteprima 12:45–14:15 si sovrappone al «Pranzo» (13:00) senza nessun avviso di conflitto — evidenziare il conflitto (bordo arancione / «si sovrappone al pranzo»).
- [gravità: bassa] trascinamento-in-corso__pc-light.png — blocco originale sbiadito ma la linea dell'ora e la pillola 10:30 restano sopra — vedi problema z-index della linea.

## oggi-adesso__pc-dark.png
- [gravità: media] oggi-adesso__pc-dark.png — barra laterale, voce attiva «Oggi» — fondo viola scurissimo quasi uguale al grigio delle voci non attive: lo stato attivo si riconosce solo dal colore del testo — fondo attivo più luminoso (es. viola 20% opacità) e voci non attive senza fondo.
- [gravità: media] oggi-adesso__pc-dark.png — schede in alto, «Adesso» attiva — pillola attiva grigio #2a2a2a su barra #1e1e1e: differenza minima — aumentare il contrasto della scheda attiva.
- [gravità: bassa] oggi-adesso__pc-dark.png — card su sfondo — card #1a1a1a su pagina #111: separazione affidata a bordi appena visibili; la barra laterale ha lo stesso colore della pagina — livelli di superficie più distinti (pagina più scura, card +6–8% luminosità) e barra laterale leggermente diversa.
- [gravità: bassa] oggi-adesso__pc-dark.png — «Pianifica la giornata», riquadro icona marrone/ocra — colore spento e sporco nel tema scuro — tinta ambra più satura su fondo scuro trasparente.
- [gravità: bassa] oggi-adesso__pc-dark.png — stessi problemi di layout del tema chiaro (pulsante «Fatto» enorme, colonna stretta, badge 38 senza etichetta).

## giornata-giorno__pc-dark.png
- [gravità: media] giornata-giorno__pc-dark.png — blocco «Confrontare piani telefonici» — giallo diventato marrone fango (#3d2e10), casella di spunta scura quasi invisibile sul blocco — tinte area più luminose/sature in scuro (fondo 18% opacità del colore pieno, banda piena) e casella con bordo chiaro.
- [gravità: bassa] giornata-giorno__pc-dark.png — linee delle ore — grigio quasi uguale al fondo, la griglia sparisce — linee #2a2a2a → #333 o +opacità.
- [gravità: bassa] giornata-giorno__pc-dark.png — blocco fatto «Organizzare cena» — testo barrato grigio su grigio, contrasto molto basso (sotto 3:1) — mantenere contrasto ≥4.5:1 anche per elementi fatti, usare solo barratura.
- [gravità: bassa] giornata-giorno__pc-dark.png — sottoscheda attiva «Giorno» — in chiaro è viola, in scuro grigio neutro: l'accento si perde — mantenere l'accento viola.
- [gravità: alta] giornata-giorno__pc-dark.png — linea ora 10:30 sopra il blocco (come in chiaro).

## giornata-settimana__pc-dark.png
- [gravità: bassa] giornata-settimana__pc-dark.png — bordi verdi delle abitudini «Camminata» — verde scuro (#1f5f1f) su fondo scuro, poco visibile — verde più luminoso in tema scuro.
- [gravità: bassa] giornata-settimana__pc-dark.png — colonna «Mar» di oggi — fondo blu-grigio appena diverso dalle altre colonne — evidenziare oggi anche nell'intestazione (numero in cerchio viola).
- [gravità: media] giornata-settimana__pc-dark.png — stessi difetti del tema chiaro: larghezza diversa dalla barra in alto, «+4/+1» criptici, linea 10:30 sopra il testo, titoli troncati, «Ago» maiuscolo.

## giornata-mese__pc-dark.png
- [gravità: bassa] giornata-mese__pc-dark.png — giorni di luglio 27–31 e i loro puntini — numeri e puntini scurissimi (#444 su #1c1c1c), quasi invisibili — opacità 50% invece di colore fisso scuro.
- [gravità: bassa] giornata-mese__pc-dark.png — puntini colorati sotto i giorni — rossi/verdi scuri difficili da distinguere e senza legenda — colori area più luminosi in scuro + legenda.
- [gravità: media] giornata-mese__pc-dark.png — stessi difetti del tema chiaro (anelli senza legenda, triplo evidenziatore del 18, griglia vuota).

## giornata-anno__pc-dark.png
- [gravità: bassa] giornata-anno__pc-dark.png — numeri «7», «25», «17» verdi scuri 11px su grigio — contrasto insufficiente — verde più chiaro o testo neutro.
- [gravità: bassa] giornata-anno__pc-dark.png — in scuro i giorni futuri di agosto sono più scuri dei giorni passati vuoti, in chiaro no: comportamento diverso fra temi — stessa regola nei due temi (e renderla evidente).
- [gravità: bassa] giornata-anno__pc-dark.png — scala di verdi — il verde scuro (meno attività) si confonde con il grigio delle celle vuote — primo livello più distinto.
- [gravità: alta] giornata-anno__pc-dark.png — stesso conteggio incoerente (Ago 17 vs Mese 18 giorni attivi).

## giornata-sonno-aperto__pc-dark.png
- [gravità: alta] giornata-sonno-aperto__pc-dark.png — stessi difetti del chiaro: orari AM/PM, select «15 mir»/«45 mi» tagliati.
- [gravità: bassa] giornata-sonno-aperto__pc-dark.png — campi orario: fondo nero più scuro della card (#111 su #1c1c1c) con bordo grigio — in scuro gli input dovrebbero essere leggermente più chiari della card, non più scuri; icona orologio nativa assente/invisibile — input #262626.
- [gravità: bassa] giornata-sonno-aperto__pc-dark.png — icone cestino grigio medio, poco visibili — contrasto ≥3:1.

## giornata-scheda-blocco__pc-dark.png
- [gravità: media] giornata-scheda-blocco__pc-dark.png — velo dietro la finestra — scurisce poco una pagina già scura: la finestra (#1c1c1c) si stacca solo per il bordo sottile, il calendario dietro resta leggibile e distrae — velo più opaco (60–70% nero) e finestra un gradino più chiara (#232323) con ombra.
- [gravità: bassa] giornata-scheda-blocco__pc-dark.png — pulsanti ⓧ di «09:30 AM» e «1 h 30» — cerchio grigio con × scura, contrasto basso — × chiara su cerchio medio.
- [gravità: alta] giornata-scheda-blocco__pc-dark.png — stessi difetti del chiaro (09:30 AM, titolo che va a capo presto, «Togli la spunta»).

## giornata-scheda-abitudine__pc-dark.png
- [gravità: bassa] giornata-scheda-abitudine__pc-dark.png — pillola «Salute & Sport» — in chiaro è lilla con testo viola, in scuro grigio con testo lilla: il valore si confonde con lo sfondo della riga — fondo viola 18% opacità.
- [gravità: media] giornata-scheda-abitudine__pc-dark.png — velo dietro la finestra poco coprente (come sopra); stessi difetti del chiaro (06:00 PM, «Fatta» viola vs «Fatto» verde, «Termina» non rosso).

## rituali__pc-dark.png
- [gravità: bassa] rituali__pc-dark.png — «✓ fatto» verde scuro 12px su #1c1c1c — contrasto basso — verde più chiaro (#4ade80).
- [gravità: bassa] rituali__pc-dark.png — icone dei rituali non attivi: riquadro #26233a con icona viola scura — poco visibili — icona più chiara.
- [gravità: media] rituali__pc-dark.png — stessi difetti del chiaro (badge «1» che sparisce, stati incoerenti, molto vuoto).

## rituale-piano__pc-dark.png
- [gravità: bassa] rituale-piano__pc-dark.png — voce barrata «Organizzare cena con il gruppo» — grigio scuro su grigio, quasi illeggibile — contrasto ≥4.5:1.
- [gravità: bassa] rituale-piano__pc-dark.png — pillola «☆ Priorità» viola scuro con testo grigio-lilla — contrasto basso — testo bianco o lilla chiaro.
- [gravità: bassa] rituale-piano__pc-dark.png — campi grigi su card grigia (#232323 su #1c1c1c) — campo poco riconoscibile — bordo 1px.
- [gravità: media] rituale-piano__pc-dark.png — stessi difetti del chiaro (manca istruzione, apostrofo ‘, pulsante enorme).

## rituale-sonno-pasti__pc-dark.png
- [gravità: bassa] rituale-sonno-pasti__pc-dark.png — pulsanti «sì / no / ⏰» — grigio #262626 su #1c1c1c, quasi invisibili come pulsanti — bordo o fondo più chiaro.
- [gravità: bassa] rituale-sonno-pasti__pc-dark.png — «Salva» (fondo viola scurissimo, testo lilla) accanto a «Non ricordo» — il pulsante quasi non si distingue dallo sfondo — fondo più chiaro.
- [gravità: alta] rituale-sonno-pasti__pc-dark.png — stessi difetti del chiaro (AM/PM, doppio salvataggio Salva/Fatto, icona orologio muta).

## rituale-checkin__pc-dark.png
- [gravità: bassa] rituale-checkin__pc-dark.png — pulsante «Registra +3 XP» — fondo viola scurissimo con bordo: in scuro sembra disattivato — se è l'azione principale, viola pieno.
- [gravità: media] rituale-checkin__pc-dark.png — stessi difetti del chiaro (pulsanti selezionati che sporgono oltre il margine, gerarchia titolo «Andamento…» invertita, «Registra» quando già fatto).

## rituale-sera__pc-dark.png
- [gravità: bassa] rituale-sera__pc-dark.png — quadratini 1–5 grigi #262626 con numeri grigi su #1c1c1c — poco riconoscibili come pulsanti — bordo 1px o numeri più chiari.
- [gravità: alta] rituale-sera__pc-dark.png — stessi difetti del chiaro (manca la domanda/scala, componente diverso dal check-in, 8 voci obbligatorie).

## rituale-settimana__pc-dark.png
- [gravità: bassa] rituale-settimana__pc-dark.png — aree di testo #232323 su #1c1c1c senza bordo — si distinguono appena — bordo 1px #333.
- [gravità: media] rituale-settimana__pc-dark.png — stessi difetti del chiaro (numeri serif, statistiche non allineate, domande senza «?»).

## attivita-sistemare__pc-dark.png
- [gravità: media] attivita-sistemare__pc-dark.png — pulsante «Oggi» — lilla chiaro (#8f86ff) con testo bianco: contrasto ~3:1 e tono diverso dal viola dei pulsanti primari nei rituali («Salva», «Fatto» #6c5ce7) — un solo viola primario in scuro con testo bianco ≥4.5:1.
- [gravità: bassa] attivita-sistemare__pc-dark.png — select nativo «Altro / Esplorazione» con fondo nero e freccia di sistema — vedi chiaro.
- [gravità: media] attivita-sistemare__pc-dark.png — stessi difetti del chiaro.

## attivita-dafare__pc-dark.png
- [gravità: bassa] attivita-dafare__pc-dark.png — icone area verde scuro (Salute) e viola (Lavoro) su fondo scuro — piccolissime e a basso contrasto — tinte più chiare in scuro.
- [gravità: bassa] attivita-dafare__pc-dark.png — «scade tra 20 giorni» grigio scuro 11px — contrasto insufficiente — grigio più chiaro.
- [gravità: alta] attivita-dafare__pc-dark.png — stessi difetti del chiaro (nessuna casella di spunta, primo «+ Oggi» pieno senza motivo, «1 di 3» senza unità).

## attivita-dafare-aggiunta__pc-dark.png
- [gravità: media] attivita-dafare-aggiunta__pc-dark.png — pillola selezionata «Senza data» — lilla chiaro con testo bianco: contrasto basso (~2.8:1) — viola più scuro o testo scuro.
- [gravità: media] attivita-dafare-aggiunta__pc-dark.png — stessi difetti del chiaro (opzioni rientrate di 12px, altezze diverse, select nativo).

## attivita-abitudini__pc-dark.png
- [gravità: bassa] attivita-abitudini__pc-dark.png — sotto la scheda «Abitudini» (x≈670–800, y≈98) — si intravede un testo/ombra fantasma quasi trasparente (tooltip o etichetta residua) — verificare elementi con opacity bassa non rimossi e nasconderli con display:none/visibility.
- [gravità: bassa] attivita-abitudini__pc-dark.png — cerchi di completamento verde scuro su fondo scuro e anello «0 di 3» grigio #2a2a2a — poco visibili — colori più chiari.
- [gravità: media] attivita-abitudini__pc-dark.png — stessi difetti del chiaro.

## attivita-abitudini-nuova__pc-dark.png
- [gravità: bassa] attivita-abitudini-nuova__pc-dark.png — anche qui si vede il testo fantasma sotto le schede (x≈670–800, y≈85) — vedi sopra.
- [gravità: bassa] attivita-abitudini-nuova__pc-dark.png — pillola «Nessuno» grigia con testo grigio — sembra disattivata — stesso stile delle altre pillole valore.
- [gravità: media] attivita-abitudini-nuova__pc-dark.png — stessi difetti del chiaro («Nessuno» → «Nessuna», cerchi dei giorni sparsi, flusso diverso da «Da fare»).

## scheda-attivita__pc-dark.png
- [gravità: bassa] scheda-attivita__pc-dark.png — passo fatto «Elenco lezioni arretrate» — barrato grigio su grigio, contrasto molto basso — vedi regola contrasto elementi fatti.
- [gravità: bassa] scheda-attivita__pc-dark.png — pillole «Domani / Giovedì / …» e «ogni giorno…» #2a2a2a su #232323 — quasi indistinguibili dal fondo — bordo o fondo più chiaro.
- [gravità: media] scheda-attivita__pc-dark.png — stessi difetti del chiaro (finestra stretta, «Un altro giorno» a capo, sezione tagliata, «Distribuisci i passi» oscuro).

## scheda-abitudine__pc-dark.png
- [gravità: bassa] scheda-abitudine__pc-dark.png — chip «Salute & Sport» fondo verde scurissimo con testo bianco e icona verde scura — l'icona quasi sparisce — icona più chiara.
- [gravità: bassa] scheda-abitudine__pc-dark.png — giorni mancati (cerchio #2a2a2a) vs non previsti (nessun cerchio) — in scuro la differenza è minima — usare un contorno/colore distinto per «mancato».
- [gravità: alta] scheda-abitudine__pc-dark.png — stessi difetti del chiaro (06:00 PM, mese assente, nessuna legenda).

## andamento__pc-dark.png
- [gravità: bassa] andamento__pc-dark.png — barra «Salute & Sp» verde scuro (#138a13) e icona Salute — più scura delle altre barre, poco leggibile in scuro — tinte area ricalibrate per il tema scuro.
- [gravità: bassa] andamento__pc-dark.png — giorno «V» non fatto: quadrato #2a2a2a quasi invisibile — contorno tratteggiato per i giorni mancati.
- [gravità: alta] andamento__pc-dark.png — stessi difetti del chiaro (nomi aree tagliati, serie 38 con venerdì vuoto, mappa piccola, barre disallineate).

## scoperte__pc-dark.png
- [gravità: bassa] scoperte__pc-dark.png — sottoscheda attiva «Registro» — grigio neutro in scuro, viola in chiaro (come Giorno/Settimana) — accento coerente fra temi.
- [gravità: media] scoperte__pc-dark.png — stessi difetti del chiaro (etichette di certezza confuse, liste impilate, tre livelli di schede).

## scoperte-esperimenti__pc-dark.png
- [gravità: bassa] scoperte-esperimenti__pc-dark.png — punti grigi della fase «Prima (base)» — grigio medio su nero, poco visibili; etichetta «media 3,1» sovrapposta ai punti — punti più chiari, etichetta con fondo.
- [gravità: media] scoperte-esperimenti__pc-dark.png — stessi difetti del chiaro (etichette sui dati, assi incompleti, «d≈3,1»).

## scheda-scoperta__pc-dark.png
- [gravità: bassa] scheda-scoperta__pc-dark.png — velo dietro la finestra — la riga «Studiare dopo cena» sotto la finestra resta quasi leggibile: velo troppo leggero — più opacità.
- [gravità: bassa] scheda-scoperta__pc-dark.png — pillole non selezionate («notato una volta», «non funziona») #2a2a2a su #232323 — poco distinguibili — bordo.
- [gravità: media] scheda-scoperta__pc-dark.png — stessi difetti del chiaro (esito sepolto in Dettagli, titoli ripetuti, minuscole, nessun salva).

## profilo__pc-dark.png
- [gravità: bassa] profilo__pc-dark.png — card profilo e statistiche senza bordo, card elenco (Aree…, Diario…) con bordo grigio — trattamento delle superfici incoerente nella stessa pagina — stesso bordo (o nessuno) per tutte le card.
- [gravità: alta] profilo__pc-dark.png — stessi difetti del chiaro (statistiche in contrasto col resto dell'app, nessuna voce attiva in barra laterale, «bloccati», «riuscita»).

## impostazioni__pc-dark.png
- [gravità: bassa] impostazioni__pc-dark.png — gruppi #262626 dentro finestra #1c1c1c, velo leggero: tre grigi vicinissimi fra loro e con la pagina dietro — gerarchia di superfici poco leggibile — velo più scuro, finestra più chiara.
- [gravità: media] impostazioni__pc-dark.png — stessi difetti del chiaro (finestra stretta invece di pagina, gruppo senza titolo, valori minuscoli/maiuscoli misti).

## imp-timer__pc-dark.png
- [gravità: bassa] imp-timer__pc-dark.png — dietro la finestra «Raffaele» e le statistiche restano ben leggibili — velo troppo leggero.
- [gravità: media] imp-timer__pc-dark.png — stessi difetti del chiaro (tre timer non spiegati, «Pausa lunga ogni 4 · No», finestra che cambia posizione).

## imp-musica__pc-dark.png
- [gravità: media] imp-musica__pc-dark.png — campi «Incolla il link» — stesso grigio del riquadro, praticamente invisibili in scuro (ancora peggio che in chiaro) — bordo 1px #3a3a3a.
- [gravità: bassa] imp-musica__pc-dark.png — interruttore spento: pomello bianco brillante su binario #2a2a2a — il pomello sembra un pallino isolato — binario più chiaro.
- [gravità: media] imp-musica__pc-dark.png — stessi difetti del chiaro.

## imp-aspetto__pc-dark.png
- [gravità: bassa] imp-aspetto__pc-dark.png — scelta «Auto» attiva — grigio #333 su #262626, poco evidente quale tema è scelto — accento viola sulla scelta attiva.
- [gravità: bassa] imp-aspetto__pc-dark.png — velo troppo leggero: profilo e statistiche dietro restano leggibili e competono con la finestra.
- [gravità: media] imp-aspetto__pc-dark.png — stessi difetti del chiaro (Suoni/Vibrazione in «Aspetto», finestra che salta di posizione, interruttori verdi).

## aree__pc-dark.png
- [gravità: bassa] aree__pc-dark.png — testo sfocato anche qui (animazione di scala non conclusa) — vedi chiaro.
- [gravità: bassa] aree__pc-dark.png — icona «Salute & Sport» verde scuro su verde scurissimo — quasi invisibile — tinte icone più chiare in scuro.
- [gravità: media] aree__pc-dark.png — stessi difetti del chiaro (interruttori non spiegati, cestino accanto all'interruttore, niente modifica).

## sonno-pasti__pc-dark.png
- [gravità: bassa] sonno-pasti__pc-dark.png — etichetta «Colazione» allineata più in alto delle pillole sulla stessa riga (394 vs 395 centro, ma «Pranzo»/«Cena» centrate rispetto alla riga): leggero disallineamento verticale nella prima riga del gruppo — align-items:center su tutte le righe.
- [gravità: alta] sonno-pasti__pc-dark.png — stessi difetti del chiaro (AM/PM, componente diverso dal pannello della Giornata, «Tra le»).
