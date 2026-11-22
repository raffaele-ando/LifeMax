# Revisione UX/UI — telefono (giro 2)

## oggi-adesso
- [gravità: media] oggi-adesso__tel-light.png — barra di avanzamento sotto la data con «1/2» — non dice di cosa sono 1 su 2 (attività? abitudini?); la barra non è collegata a niente sullo schermo — aggiungere un'etichetta breve («1 di 2 fatte oggi») o toglierla.
- [gravità: media] oggi-adesso__tel-light.png — pastiglia arancione «🔥 38» in alto a destra — numero senza contesto, sembra un pulsante ma non si capisce cosa sia; è anche disallineata verticalmente rispetto alla data (scende fino alla barra) — aggiungere «38 giorni» o una didascalia, allinearla alla riga del titolo.
- [gravità: media] oggi-adesso__tel-light.png — controllo segmentato in alto (Adesso/La giornata/Rituali) — il badge «1» di Rituali è un quadratino che tocca il bordo del contenitore, mentre il badge «6» di Attività in basso è un cerchio viola: due stili di badge diversi nella stessa schermata — unificare forma e colore dei badge e tenerli dentro il segmento.
- [gravità: media] oggi-adesso__tel-light.png — controllo segmentato in alto — icona sopra etichetta dentro un segmentato lo rende alto (~52px) e simile a una seconda tab bar, in concorrenza con quella in basso — usare un segmentato solo testo, alto 32–36px.
- [gravità: media] oggi-adesso__tel-light.png — sezione «Poi», riquadro grigio vuoto a sinistra di «Confrontare piani telefonici» — 40px con angoli arrotondati: sembra un segnaposto d'immagine più che una casella da spuntare — ridurla a 22–24px, bordo più sottile, cerchio o quadrato coerente con le altre liste.
- [gravità: bassa] oggi-adesso__tel-light.png — riga «Timer» / «Salta oggi ⏭» nella scheda principale — un pulsante con bordo accanto a un link senza bordo, altezze e pesi diversi: la coppia sembra sbilanciata e l'icona ⏭ dopo il testo è insolita — rendere entrambi pulsanti secondari uguali (stessa altezza, metà larghezza ciascuno) o mettere «Salta oggi» come link centrato sotto.
- [gravità: bassa] oggi-adesso__tel-light.png — riga «Pianifica la giornata · Un minuto» — «Un minuto» come sottotitolo è ambiguo (tempo richiesto? tra un minuto?) — scrivere «Ci vuole un minuto» o «1 min».
- [gravità: bassa] oggi-adesso__tel-light.png — barra in basso, pulsante «+» viola — è incastrato nella tab bar con un separatore verticale, attaccato al bordo destro, e le tre voci non sono distribuite uniformemente (Andamento è più vicino al +) — separare il FAB dalla tab bar o dare spaziatura uguale alle 4 zone.
- [gravità: bassa] oggi-adesso__tel-light.png — chip «Abitudine» sopra il titolo nella scheda — scheda dentro scheda (chip grigio su card azzurra con etichetta area blu sopra): tre livelli di metadati prima del titolo — unire area e tipo in una riga sola («Studio / Università · Abitudine»).
- [gravità: bassa] oggi-adesso__tel-dark.png — icona sole di «Pianifica la giornata» — fondo color oliva scuro/sporco, poco piacevole — usare un ambra trasparente più pulito (es. ambra al 16%).
- [gravità: bassa] oggi-adesso__tel-dark.png — badge «1» di Rituali — grigio-viola scuro su fondo scuro, quasi invisibile — usare lo stesso viola pieno del badge «6».
## giornata-giorno
- [gravità: alta] giornata-giorno__tel-light.png — parte alta (segmentato Adesso/La giornata/Rituali + segmentato Giorno/Settimana/Mese/Anno + frecce «‹ Oggi ›» + riga sonno) — quattro fasce di navigazione impilate occupano ~300px su 844 prima che inizi il calendario — fondere: titolo data con frecce nella stessa riga del selettore di vista, togliere le icone dai segmentati, comprimere la riga sonno in un chip.
- [gravità: media] giornata-giorno__tel-light.png — segmentato Giorno/Settimana/Mese/Anno — stile diverso dal segmentato sopra (niente contenitore, selezione lilla piena, icone diverse): due controlli dello stesso tipo con aspetto diverso uno sotto l'altro — usare un unico componente segmentato, o trasformare il secondo in semplici tab testuali.
- [gravità: media] giornata-giorno__tel-light.png — titolo «Oggi» tra le frecce — non mostra la data; andando avanti/indietro l'utente perde il riferimento — scrivere «Oggi, mar 18 ago» (o la data sotto in piccolo).
- [gravità: media] giornata-giorno__tel-light.png — riga «⊢ 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — icone criptiche senza testo (cosa significano le tre icone? sono pasti pianificati?); la freccia «›» a destra non chiarisce che si apre un pannello — aggiungere un'etichetta («Sonno e pasti») e mostrare gli orari dei pasti o niente.
- [gravità: media] giornata-giorno__tel-light.png — blocco «Organizzare cena con il gruppo» 09:30–11:00 — la linea dell'ora attuale e il badge blu «10:30» attraversano la scheda e coprono il bordo destro; la striscia rosa larga a sinistra con la maniglia ⠿ ha un colore che non compare altrove (la scheda è grigia) — far passare la linea sotto le schede (z-index) o renderla semitrasparente sopra; usare la stessa tinta d'area per striscia e fondo come per «Confrontare piani telefonici».
- [gravità: media] giornata-giorno__tel-light.png — blocco «Organizzare cena» barrato con stellina — il testo barrato indica «fatto» ma la scheda ha lo stesso peso delle altre; la stellina ☆ non ha significato chiaro — attenuare l'intera scheda fatta (opacità 50%, spunta verde) e spiegare o togliere la stella.
- [gravità: bassa] giornata-giorno__tel-light.png — blocchi «Colazione»/«Pranzo» — testo centrato, mentre le attività sono allineate a sinistra con orario sotto; i pasti non mostrano l'orario — allineare a sinistra come gli altri blocchi e indicare l'orario.
- [gravità: bassa] giornata-giorno__tel-light.png — fascia a righe diagonali 07:00–07:30 — non ha etichetta: non si capisce che è sonno — aggiungere una piccola icona luna/«Sonno» nella fascia.
- [gravità: media] giornata-giorno__tel-light.png — fondo schermo sotto la tab bar flottante — sotto la barra si vedono ancora «17:00» e le righe del calendario (la barra non arriva al bordo), il blocco «Confrontare piani» è tagliato dalla barra — aggiungere un fondo/sfumatura sotto la barra e un padding in basso alla lista pari all'altezza della barra.
- [gravità: bassa] giornata-giorno__tel-light.png — calendario in una scheda bianca su fondo lilla, dentro un'altra cornice — riquadro dentro riquadro e margini interni ridotti (le etichette orarie sono a ~4px dal bordo della scheda) — togliere la scheda e lasciare il calendario a tutta larghezza, oppure aumentare il padding sinistro a 12px.
- [gravità: bassa] giornata-giorno__tel-dark.png — striscia sinistra del blocco «Organizzare cena» — bordeaux spento quasi nero, la maniglia ⠿ si legge appena — schiarire il colore d'area in tema scuro.
- [gravità: bassa] giornata-giorno__tel-dark.png — blocchi «Colazione»/«Pranzo» — grigio su grigio quasi senza contrasto con il fondo del calendario — aumentare il contrasto di bordo o fondo.
## giornata-giorno-fondo
- [gravità: media] giornata-giorno-fondo__tel-light.png — blocchi abitudine «Camminata / movimento» e «Leggere 20 minuti» — terzo stile di blocco (solo bordo verde, fondo bianco) accanto a blocchi pieni colorati e blocchi grigi dei pasti; il verde del bordo richiama «fatto» ma non lo sono — usare la tinta dell'area anche per le abitudini, distinguendole solo con l'icona ↻.
- [gravità: media] giornata-giorno-fondo__tel-light.png — blocco «Leggere 20 minuti» alle 22:00 — alto ~24px, l'orario non c'è e il testo tocca i bordi; area di tocco sotto i 44px — altezza minima 32–36px con orario in linea («22:00 · Leggere 20 minuti»).
- [gravità: media] giornata-giorno-fondo__tel-light.png — sezione «Senza orario 1» — la scheda con «Ripasso flashcard» ha gli angoli superiori squadrati e sembra incollata sotto al calendario; l'intestazione sta fuori dalla scheda — dare alla scheda tutti gli angoli arrotondati e 8px di distanza dall'intestazione, o mettere l'intestazione dentro la scheda.
- [gravità: media] giornata-giorno-fondo__tel-light.png — riga «Ripasso flashcard» — nella schermata Adesso è un'abitudine (chip «Abitudine»), qui ha una casella quadrata e un'icona libro blu, nessun segno ↻: lo stesso elemento cambia aspetto da una vista all'altra — usare lo stesso simbolo di abitudine ovunque.
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — icona orologio blu a destra di «Ripasso flashcard» — non si capisce che serve a dare un orario — aggiungere il testo «Dai un orario» o un tooltip/pressione lunga, oppure usare il trascinamento.
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — campo «Nuova attività...» con «+ Aggiungi» — tre punti invece del carattere «…»; il campo duplica il pulsante «+» della tab bar — usare «Nuova attività…» e valutare se tenere un solo punto d'ingresso.
- [gravità: bassa] giornata-giorno-fondo__tel-light.png — link «Sposta 1 non fatta a domani» — italiano telegrafico — «Sposta a domani l'attività non fatta» (o «le 3 attività non fatte»).
- [gravità: bassa] giornata-giorno-fondo__tel-dark.png — bordi verdi dei blocchi abitudine — verde scuro su fondo scuro, poco visibili; l'icona ↻ verde scuro si legge appena — schiarire il verde in tema scuro (es. #4ADE80 al 70%).
- [gravità: bassa] giornata-giorno-fondo__tel-dark.png — badge «1» accanto a «Senza orario» — grigio su grigio, contrasto bassissimo — aumentare il contrasto del badge.
## giornata-settimana
- [gravità: media] giornata-settimana__tel-light.png — titolo «17 Ago – 23 Ago» tra le frecce — in italiano i mesi abbreviati vanno minuscoli e il mese non si ripete: «17–23 ago»; inoltre qui il titolo è allineato a sinistra accanto alla freccia, mentre in vista Giorno «Oggi» è centrato — centrare il titolo come nelle altre viste e correggere il formato.
- [gravità: media] giornata-settimana__tel-light.png — riga «Inbox a zero + piani per do...» con «Sposta» — titolo troncato proprio sulla parola chiave; «Sposta» non dice dove — permettere due righe di titolo o togliere «Sposta» dalla riga (azione nello swipe/menù) e scrivere «Sposta a oggi».
- [gravità: media] giornata-settimana__tel-light.png — giorno passato «Lunedì 17» — «Leggere 20 minuti» e «Ripasso flashcard» non fatti appaiono identici a quelli futuri: nessun segno di «saltato/non fatto» in un giorno già finito — mostrare le cose mancate con un'icona o colore attenuato distinto da «fatto».
- [gravità: bassa] giornata-settimana__tel-light.png — striscia dei giorni L–D — solo 17 e 18 hanno l'anello di avanzamento; gli altri numeri sono nudi e non sembrano toccabili, e l'anello verde parziale su «18» viola pieno è poco leggibile — mostrare un anello grigio vuoto su tutti i giorni (anche futuri) così la riga è coerente.
- [gravità: bassa] giornata-settimana__tel-light.png — riga «4 di 24 fatte questa settimana» — testo piccolo e grigio senza margine superiore sufficiente dalle frecce (12px) e troppo vicino alla striscia giorni — dare 16px sopra e sotto, o integrarlo nel titolo.
- [gravità: bassa] giornata-settimana__tel-light.png — chevron «›» a destra di «Lunedì 17» e «Martedì 18» — non è chiaro che apre la vista del giorno — rendere toccabile tutta l'intestazione e togliere il chevron isolato, o scrivere «Apri».
- [gravità: bassa] giornata-settimana__tel-light.png — righe senza orario («Ripasso flashcard», «Agenda per il direttivo»…) — la colonna orario vuota lascia un buco di ~50px a sinistra, poco ordinato — mettere «—» o un'etichetta «senza orario» o raggruppare le righe senza orario sotto quelle con orario con un separatore.
- [gravità: bassa] giornata-settimana__tel-dark.png — intestazione «Lunedì 17» — grigio medio su nero, si legge male; differenza con «Martedì 18» (bianco) non motivata visivamente — usare un grigio più chiaro e affidarsi al badge «Oggi» per l'enfasi.
## giornata-mese
- [gravità: media] giornata-mese__tel-light.png — puntini colorati sotto i giorni del calendario — nessuna legenda: non si capisce cosa rappresentino (aree? attività importanti?) e sono di 4–5 colori diversi, a volte due per giorno — aggiungere una legenda sotto il calendario o spiegarli toccando il giorno; altrimenti toglierli.
- [gravità: media] giornata-mese__tel-light.png — giorno 18 — doppia evidenziazione (cerchio viola pieno + quadrato grigio di selezione + anello verde parziale): tre segnali sovrapposti sullo stesso giorno — tenere solo il cerchio «oggi» e usare il quadrato solo per una selezione diversa da oggi.
- [gravità: bassa] giornata-mese__tel-light.png — ultima riga con solo «31» — lascia ~70px vuoti in fondo alla scheda calendario, più del padding superiore — mostrare i primi giorni di settembre attenuati (come i giorni di luglio in alto) per riempire la riga, e uniformare il padding sopra/sotto.
- [gravità: bassa] giornata-mese__tel-light.png — titolo «Agosto 2026» — allineato a sinistra accanto alla freccia, mentre in vista Giorno il titolo è centrato — uniformare (centrato tra le frecce).
- [gravità: bassa] giornata-mese__tel-light.png — sezione «Oggi», riga «Leggere 20 minuti» — casella quadrata verde piccola e spessa, diversa sia dalla casella grigia grande di Adesso sia dai pallini della Settimana — un'unica casella per tutte le liste.
- [gravità: bassa] giornata-mese__tel-light.png — riepilogo «18 giorni attivi   58 cose fatte» — «giorni attivi» non definito (attivo = almeno una cosa fatta?) — «18 giorni con almeno una cosa fatta» o tooltip.
- [gravità: bassa] giornata-mese__tel-dark.png — anelli dei giorni di luglio (27–31) — verde scurissimo su grigio, quasi invisibili; puntini minuscoli scuri non distinguibili — aumentare opacità minima in tema scuro.
## giornata-anno
- [gravità: media] giornata-anno__tel-light.png — riquadro riassunto «49 giorni attivi | 82 fatte | 1874 XP» — «XP» compare solo qui, mai spiegato altrove; «fatte» qui e «cose fatte» nella vista Mese: etichette incoerenti — spiegare XP (o toglierlo) e usare la stessa dicitura in tutte le viste.
- [gravità: media] giornata-anno__tel-light.png — numeri verdi in alto a destra delle schede mese («7», «25», «17») — nessuna etichetta: giorni attivi? cose fatte? — aggiungere unità («25 gg») o legenda.
- [gravità: media] giornata-anno__tel-light.png — mappe di calore dei mesi — nessuna legenda delle intensità di verde e celle di ~9px: non si capisce cosa misura l'intensità; i mesi sono toccabili ma niente lo indica — aggiungere legenda «meno ▢▢▢▢ più» e un chevron o stato premuto sulle schede.
- [gravità: bassa] giornata-anno__tel-light.png — griglia 3×4 di schede mese — riquadri dentro una pagina già piena di riquadri, con ombre: molto rumore visivo per mesi vuoti (Gen–Mag, Set–Dic tutte grigie) — togliere bordo/ombra alle schede e lasciare solo etichetta + griglia, oppure attenuare i mesi futuri.
- [gravità: bassa] giornata-anno__tel-light.png — titolo «2026» — allineato a sinistra, incoerente con «Oggi» centrato in vista Giorno — centrare.
- [gravità: bassa] giornata-anno__tel-light.png — ultima riga (Ott/Nov/Dic) — tagliata dalla tab bar flottante senza sfumatura — padding inferiore e fondo sotto la barra.
- [gravità: bassa] giornata-anno__tel-dark.png — celle vuote dei mesi — grigio scuro quasi uguale al fondo della scheda; mesi futuri e mesi senza attività indistinguibili — aumentare di un tono il grigio delle celle passate.
## giornata-sonno-aperto
- [gravità: alta] giornata-sonno-aperto__tel-light.png — campi orario «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «08:00 PM» — formato americano AM/PM in un'app italiana, mentre la riga sopra e tutto il calendario usano 23:30/07:30 — forzare il formato 24 ore (input personalizzato o lang="it" + step) ovunque.
- [gravità: alta] giornata-sonno-aperto__tel-light.png — menù a tendina della durata «15 mir», «45 mi», «45 mi» — testo troncato a metà parola: la colonna è troppo stretta — allargare la select (o scrivere «15′»/«15 min» in un chip), ridurre il campo orario.
- [gravità: media] giornata-sonno-aperto__tel-light.png — controlli del pannello — select e campi nativi del browser (freccia di sistema, bordi diversi dai campi dell'app), non coerenti con il resto dell'interfaccia — usare i componenti dell'app (chip/stepper o selettore a ruota).
- [gravità: media] giornata-sonno-aperto__tel-light.png — link «+ Pasto  Ripristina  Ritmo di base» — tre azioni dello stesso peso affiancate; «Ripristina» e «Ritmo di base» non dicono cosa fanno (ripristina cosa? salva come base?) e un tocco sbagliato può cancellare le modifiche — «+ Aggiungi pasto» come azione principale; «Usa i valori di base» / «Salva come base» in un menù «…» con conferma.
- [gravità: media] giornata-sonno-aperto__tel-light.png — bordo superiore — il segmentato «Giorno/Settimana/Mese/Anno» è tagliato a metà dal bordo dello schermo (intestazione fissa parziale) — o rimane fisso intero con fondo, o scorre via del tutto.
- [gravità: bassa] giornata-sonno-aperto__tel-light.png — riga «A letto [11:30 PM]  Sveglia [07:30 AM]» — le etichette hanno icone, quelle dei pasti no; i due campi non sono allineati alla colonna dei campi dei pasti (iniziano a x≈95 contro x≈145) — mettere sonno e pasti nella stessa griglia a due colonne (etichetta | orario | durata).
- [gravità: bassa] giornata-sonno-aperto__tel-light.png — icone cestino a destra dei pasti — grigie piccole (~14px) e attaccate al bordo, area di tocco minuscola; eliminare la colazione con un tocco senza conferma è rischioso — area di tocco 44px e annulla/undo.
- [gravità: bassa] giornata-sonno-aperto__tel-dark.png — campi orario — fondo nero su scheda grigia scura con bordo grigio sottile: la distinzione campo/scheda regge, ma le frecce delle select di sistema restano chiare/forti rispetto al resto — stilizzare le select.
## giornata-scheda-blocco
- [gravità: alta] giornata-scheda-blocco__tel-light.png — riga «Ora» del foglio — «09:30 AM»: formato AM/PM in app italiana con calendario a 24 ore — mostrare «09:30».
- [gravità: media] giornata-scheda-blocco__tel-light.png — titolo «Organizzare cena / con il gruppo» — va a capo dopo ~200px lasciando vuota metà destra del foglio (spazio riservato a un pulsante che non c'è) — usare tutta la larghezza; aggiungere in alto a destra una «X»/«Fine» visibile, oggi manca un modo esplicito di chiudere.
- [gravità: media] giornata-scheda-blocco__tel-light.png — pulsante «↶ Togli la spunta» centrato — è l'unico segnale che l'attività è fatta, ma lo stato «Fatta» non è mai scritto; «Togli la spunta» suona poco naturale — mostrare lo stato («✓ Fatta alle 10:12») con l'azione «Segna come da fare».
- [gravità: media] giornata-scheda-blocco__tel-light.png — riga «Attività · Oggi» sotto il titolo — informazione debole e ridondante (si è aperto da Oggi), mentre manca l'orario/stato — sostituire con stato e area.
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — «Sposta in Da fare» — gergo interno (nome di una sotto-scheda); non dice cosa succede (toglie l'orario? la toglie da oggi?) — «Togli dal calendario» o «Rimanda a più tardi».
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — chip «Ora»/«Durata» con ⓧ e chip «Area» senza — le tre pillole hanno larghezze diverse e solo due si possono svuotare; la ⓧ grigia dentro la pillola lilla ha contrasto basso — allineare a destra con larghezza minima comune e spostare la cancellazione dentro il selettore.
- [gravità: bassa] giornata-scheda-blocco__tel-light.png — bordi laterali del foglio — sottile linea chiara lungo i bordi sinistro e destro fino in fondo, il foglio non sembra ancorato — togliere il bordo laterale o farlo terminare con il raggio.
- [gravità: bassa] giornata-scheda-blocco__tel-dark.png — velo sullo sfondo — in tema scuro lo sfondo è quasi uguale al foglio (grigio scuro su nero attenuato): il foglio non si stacca — schiarire il foglio di un tono o aumentare il velo.
## giornata-scheda-abitudine
- [gravità: alta] giornata-scheda-abitudine__tel-light.png — riga «Ora» — «06:00 PM» in formato americano — «18:00».
- [gravità: media] giornata-scheda-abitudine__tel-light.png — pulsante viola «✓ Fatta» — nella schermata Adesso lo stesso gesto è un pulsante VERDE «Fatto» (maschile): colore e genere diversi per la stessa azione — un solo colore (verde = completa) e una sola parola («Fatto» o «Segna come fatta») in tutta l'app.
- [gravità: media] giornata-scheda-abitudine__tel-light.png — «Termina l'abitudine» — azione drastica (chiude l'abitudine per sempre?) stilata in viola come «Salta oggi» e «Apri l'abitudine», senza distinzione — renderla rossa/di avviso, spostarla nella scheda dell'abitudine e chiedere conferma; chiarire il testo («Smetti di seguire questa abitudine»).
- [gravità: bassa] giornata-scheda-abitudine__tel-light.png — confronto con il foglio di un'attività — strutture diverse (attività: «Togli la spunta» come link centrato + «Sposta in Da fare»/«Elimina»; abitudine: grande pulsante «Fatta» + tre link): due fogli gemelli con gerarchie diverse — stesso schema: pulsante primario di stato in alto, proprietà, azioni secondarie, azione distruttiva in fondo in rosso.
- [gravità: bassa] giornata-scheda-abitudine__tel-light.png — riga «↻ Abitudine · Oggi» — solo 8px tra questa riga e il pulsante «Fatta», mentre sopra il titolo ci sono 24px — dare 16px sotto i metadati.
- [gravità: bassa] giornata-scheda-abitudine__tel-dark.png — pillola «Salute & Sport» — testo lilla chiaro su lilla scuro con contrasto appena sufficiente, mentre «Ora»/«Durata» hanno testo bianco: colori del valore incoerenti — usare lo stesso colore di testo per tutti i valori.
## rituali
- [gravità: media] rituali__tel-light.png — colonna di stato a destra («da fare / 2 di 3 scelte», «da compilare / 0 di 4», «✓ fatto», «da fare») — etichette eterogenee («da fare» vs «da compilare») e combinazioni contraddittorie («da fare» ma «2 di 3 scelte»): non si capisce cosa manca — un'unica scala di stato (Da fare / In corso 2 di 3 / Fatto) con lo stesso formato su tutte le righe.
- [gravità: media] rituali__tel-light.png — elenco dei rituali — manca il «quando»: nessun orario o momento (mattina, sera, domenica); «Bilancio della settimana» risulta «da fare» di martedì — mostrare il momento previsto («Mattina», «Sera», «Domenica») e attenuare i rituali non ancora disponibili.
- [gravità: media] rituali__tel-light.png — metà inferiore dello schermo — ~370px di vuoto senza alcuna spiegazione di cosa siano i rituali — aggiungere una breve descrizione/riga d'aiuto o il prossimo rituale consigliato in evidenza.
- [gravità: bassa] rituali__tel-light.png — icona di «Piano del giorno» — viola pieno mentre le altre sono lilla chiaro; il motivo (rituale attuale?) non è detto — o aggiungere un'etichetta «Adesso», o rendere tutte le icone uguali.
- [gravità: bassa] rituali__tel-light.png — chevron «⌄» a destra — suggerisce un'espansione in linea, ma (vedi schermate rituale) si apre un contenuto lungo: meglio «›» se apre una pagina — scegliere l'icona coerente con il comportamento.
- [gravità: bassa] rituali__tel-light.png — nomi «Fine giornata» e «Bilancio della settimana» — nelle schermate interne/nell'elenco dei test sono chiamati «Review della sera»/«Review della settimana»: nomi diversi per la stessa cosa — usare un solo nome (italiano) ovunque.
- [gravità: bassa] rituali__tel-dark.png — «✓ fatto» verde e testi «da fare» grigi — grigio medio su grigio scuro, contrasto basso per i sottotitoli «2 di 3 scelte»/«0 di 4» — schiarire i secondari.
## rituale-piano
- [gravità: media] rituale-piano__tel-light.png — contenuto aperto di «Piano del giorno» — nessuna istruzione: non si dice cosa scegliere (le 3 cose più importanti?) né perché «2 di 3»; le righe non hanno casella, maniglia o «×» per toglierle — aggiungere una riga guida («Scegli fino a 3 cose per oggi») e un'azione visibile per rimuovere/riordinare.
- [gravità: media] rituale-piano__tel-light.png — riga «Organizzare cena con il gruppo» barrata + chip «☆ Priorità» + icona persone rosa — tre segnali compressi su una riga, il chip spinge il titolo a troncarsi; un'attività già fatta nel piano del giorno resta in mezzo — mettere le fatte in fondo/attenuate e mostrare la priorità con una sola stella a sinistra.
- [gravità: bassa] rituale-piano__tel-light.png — icone colorate a destra delle righe (persone rosa, portafoglio giallo) — sono le aree, ma senza etichetta sembrano pulsanti — usare un pallino colorato a sinistra come nelle altre liste o il nome area in piccolo.
- [gravità: bassa] rituale-piano__tel-light.png — campo «Quando inizi?» — domanda poco chiara (iniziare cosa? la giornata? la prima attività?) — «A che ora e dove inizi la prima cosa?» con l'esempio.
- [gravità: bassa] rituale-piano__tel-light.png — pulsante «Salva +5 XP» — l'XP compare dentro il pulsante con peso simile al verbo; la gamification non è introdotta altrove — togliere XP dal pulsante e mostrarlo come feedback dopo il salvataggio.
- [gravità: bassa] rituale-piano__tel-light.png — fisarmonica — un rituale aperto dentro la stessa scheda bianca degli altri, senza separazione: il contenuto aperto e le righe chiuse sotto si confondono — dare al rituale aperto una scheda propria o una linea/spazio più marcato prima di «Sonno e pasti».
- [gravità: bassa] rituale-piano__tel-dark.png — chip «☆ Priorità» — viola scuro con testo lilla, piccolo, sopra testo barrato grigio: poco leggibile — aumentare contrasto.
## rituale-sonno-pasti
- [gravità: alta] rituale-sonno-pasti__tel-light.png — righe «A letto 11:30 PM» e «Sveglia 07:30 AM» — AM/PM proprio sotto «Come sempre · 23:30–07:30» scritto in 24 ore: due formati nello stesso pannello — 24 ore ovunque.
- [gravità: media] rituale-sonno-pasti__tel-light.png — due pulsanti di salvataggio — «Salva» piccolo lilla dopo il sonno e un grande pulsante viola in fondo (tagliato dalla tab bar): non è chiaro se il primo salva tutto o solo il sonno — un solo pulsante «Salva» in fondo, oppure salvataggio automatico per sezione con conferma inline.
- [gravità: media] rituale-sonno-pasti__tel-light.png — «Come sempre · 23:30–07:30» in viola a destra di «Sonno» — sembra un link ma non si capisce se è un'azione («usa i soliti orari») o un'informazione — se è un'azione renderla pulsante («Uguale al solito»), altrimenti testo grigio.
- [gravità: media] rituale-sonno-pasti__tel-light.png — pulsanti «sì / no / 🕒» per ogni pasto — l'orologio non ha etichetta (orario diverso?), «sì» minuscolo, nessuno stato selezionato visibile; tre bottoni grigi uguali per riga creano un muro di grigio — controllo segmentato «Sì | No | Altro orario» con stato selezionato chiaro.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — «Non ricordo» accanto a «Salva» — stesso peso visivo di un'azione principale; non chiaro cosa registra — testo grigio più piccolo o opzione dentro il campo.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — sezione «Altre cose fatte» dentro «Sonno e pasti» — non c'entra con sonno e pasti; è un duplicato del campo «Nuova attività» — spostarla nel rituale di fine giornata.
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — intestazioni «Sonno», «Pasti», «Altre cose fatte» — grigio medio, stessa dimensione del corpo: gerarchia debole — maiuscoletto/semibold e più spazio sopra (24px).
- [gravità: bassa] rituale-sonno-pasti__tel-light.png — pulsante viola in fondo — coperto per metà dalla tab bar — padding inferiore pari all'altezza della barra.
- [gravità: bassa] rituale-sonno-pasti__tel-dark.png — pulsanti «sì/no/🕒» — grigio scuro su grigio scuro, bordi impercettibili — aumentare il contrasto del fondo dei pulsanti.
## rituale-checkin
- [gravità: media] rituale-checkin__tel-light.png — pulsante «Registra +3 XP» in fondo — il check-in è già «✓ fatto» ma il pulsante resta, con aspetto lilla chiaro (sembra disattivato); negli altri rituali il verbo è «Salva» — dopo il completamento mostrare «Aggiorna» o nascondere; usare lo stesso verbo «Salva» in tutti i rituali.
- [gravità: media] rituale-checkin__tel-light.png — pulsanti 1–5 selezionati («4», «5») — il selezionato è più grande degli altri (scala ~1.1) e sporge sopra/sotto la riga, disallineando la fila — evidenziare solo con colore, senza ingrandire.
- [gravità: bassa] rituale-checkin__tel-light.png — etichetta «5 · concentratissimo» — parola colloquiale/forzata, è anche più lunga delle altre e sbilancia la riga — «5 · molto concentrato» (o «al massimo»).
- [gravità: bassa] rituale-checkin__tel-light.png — etichette d'ancoraggio «3 · normale» — non centrate sotto il pulsante 3 (spostate a sinistra), mentre «1 · …» e «5 · …» sono allineate ai bordi — centrare l'etichetta centrale sul pulsante 3.
- [gravità: bassa] rituale-checkin__tel-light.png — tre blocchi di domande — pulsanti 1–5 da 56px ×3 righe + etichette + media: molto alti, il pulsante finale finisce sotto la tab bar — ridurre i pulsanti a 44px e usare emoji/colore per la scala, padding inferiore.
- [gravità: bassa] rituale-checkin__tel-dark.png — etichette «1 · esausto», «Media recente 4,3» — grigio scuro piccolo su nero, contrasto basso — schiarire.
## rituale-sera
- [gravità: alta] rituale-sera__tel-light.png — colonna nomi aree in «Fine giornata» — nomi tagliati di netto senza puntini: «Relazioni & Soc», «Studio / Univer», «Progetti Found», «Altro / Esplora:» (si vede mezza lettera) — mettere il nome su una riga sopra i pulsanti 1–5 a tutta larghezza, oppure ridurre i pulsanti e usare l'ellissi.
- [gravità: alta] rituale-sera__tel-light.png — griglia 8 aree × 5 pulsanti — nessuna domanda né scala spiegata: cosa si valuta (soddisfazione? tempo dedicato?) e cosa vuol dire 1 e 5 — aggiungere una domanda in testa («Come è andata oggi in ogni area?») e le ancore «1 · male … 5 · benissimo» come nel Check-in.
- [gravità: media] rituale-sera__tel-light.png — 40 pulsanti grigi identici — muro di grigio pesante e faticoso, obbliga a 8 risposte ogni sera — permettere di saltare aree («non oggi»), mostrare solo le aree toccate oggi, o usare uno slider/stelle compatte.
- [gravità: bassa] rituale-sera__tel-light.png — fondo della sezione — il pulsante di salvataggio è nascosto sotto la tab bar (si intravede un pezzo di bordo a y≈830) — padding inferiore.
- [gravità: bassa] rituale-sera__tel-dark.png — pulsanti 1–5 — grigio scuro su grigio scuro con numeri grigi, contrasto basso — schiarire fondo o bordo.
## rituale-settimana
- [gravità: media] rituale-settimana__tel-light.png — numeri «216», «10», «6/7» — carattere con grazie diverso da tutto il resto dell'app (sans): sembra un errore di font — usare il font dell'interfaccia con cifre tabulari.
- [gravità: media] rituale-settimana__tel-light.png — riga statistiche — le tre colonne non sono allineate al margine del contenuto (iniziano a x≈53 invece di 32) né distribuite uniformemente; nessun riquadro come in Andamento/Anno — usare lo stesso componente «3 statistiche» della vista Anno.
- [gravità: media] rituale-settimana__tel-light.png — «6/7 giorni attivi» — è martedì, la settimana (17–23 ago) ha solo 2 giorni passati; il numero contraddice la vista Settimana («4 di 24 fatte») — chiarire il periodo («ultimi 7 giorni») o usare la settimana in corso.
- [gravità: bassa] rituale-settimana__tel-light.png — etichette «XP guadagnati / azioni completate / giorni attivi» — terzo modo di chiamare le cose fatte («fatte», «cose fatte», «azioni completate») — un solo termine in tutta l'app.
- [gravità: bassa] rituale-settimana__tel-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — mancano i punti di domanda; caselle vuote senza esempio — aggiungere «?» e un segnaposto breve.
- [gravità: bassa] rituale-settimana__tel-light.png — aree di testo — maniglia di ridimensionamento nativa visibile nell'angolo in basso a destra, aspetto da modulo web — nasconderla (resize: none) e far crescere il campo automaticamente.
- [gravità: bassa] rituale-settimana__tel-dark.png — etichette delle domande — grigio su nero, contrasto appena sufficiente; aree di testo quasi indistinguibili dalla scheda — schiarire etichette e bordo dei campi.
## attivita-sistemare
- [gravità: media] attivita-sistemare__tel-light.png — badge numerici — «6» su «Da sistemare» e «6» sull'icona Attività in basso: non si capisce se il badge della tab bar conta le cose da sistemare o altro; i badge del segmentato sono quadratini scuri che escono dal segmento, quello in basso è un cerchio viola — chiarire cosa conta il badge della tab bar e unificare stile e posizione.
- [gravità: media] attivita-sistemare__tel-light.png — pulsanti «Oggi / Da fare / Scarta» — «Da fare» come destinazione è ambiguo (tutte sono da fare); manca «Più avanti / Scegli giorno»; «Scarta» rosso a pari peso degli altri invita all'errore — rinominare «Oggi» / «Più avanti» / «Elimina» (quest'ultimo come icona o link grigio), con annulla.
- [gravità: bassa] attivita-sistemare__tel-light.png — etichetta «🗃 Da sistemare» sopra la scheda — ripete il segmento appena selezionato — sostituirla con un'istruzione utile («Decidi dove va: 1 di 6»).
- [gravità: bassa] attivita-sistemare__tel-light.png — menù «Altro / Esplorazione» — select nativa con freccia di sistema e fondo grigio, diversa dalle pillole d'area usate nei fogli — usare la pillola area dell'app.
- [gravità: bassa] attivita-sistemare__tel-light.png — pulsante «Oggi» — ombra/alone viola molto marcato sotto il pulsante, unico nell'app — togliere l'ombra o usarla uguale per tutti i primari.
- [gravità: bassa] attivita-sistemare__tel-light.png — elenco «In coda 5» — righe grigie senza separatori né affordance: non si capisce se sono toccabili; «e un'altra» in corsivo sembra una nota — renderle righe toccabili con chevron o mostrarle come anteprima non interattiva esplicita («Dopo questa: …»).
- [gravità: bassa] attivita-sistemare__tel-light.png — metà inferiore — ~280px vuoti — accettabile, ma si potrebbe mostrare un aiuto («Scorri a destra = Oggi»).
- [gravità: media] attivita-sistemare__tel-dark.png — pulsante «Oggi» — testo bianco su viola pastello chiaro, contrasto insufficiente (~2,5:1) — viola più saturo/scuro o testo scuro.
- [gravità: bassa] attivita-sistemare__tel-dark.png — righe «In coda» — grigio medio su nero, leggibilità bassa — schiarire.
## attivita-dafare
- [gravità: media] attivita-dafare__tel-light.png — elenco «Importanti»/«Altre» — nessuna casella per segnare come fatta: in tutte le altre liste c'è; qui l'unica azione visibile è «+ Oggi» — aggiungere la casella a sinistra.
- [gravità: media] attivita-dafare__tel-light.png — pulsante «+ Oggi» ripetuto su ogni riga — occupa ~75px per riga e costringe tutti i titoli a due righe (colonna titolo ~170px); il primo è viola pieno, gli altri lilla chiaro senza motivo apparente — spostare l'azione nello swipe o in un'icona compatta (☀︎+), e uniformare lo stile (o spiegare che il primo è il suggerito).
- [gravità: bassa] attivita-dafare__tel-light.png — contatori «1 di 3», «1 di 4» — senza etichetta (passi? sessioni?) — «1/3 passi» o una mini barra.
- [gravità: bassa] attivita-dafare__tel-light.png — titoli delle righe — grassetto 17px su ogni riga: tutto pesa uguale, la lista è densa e «urlata» — peso medium 16px, grassetto solo per le intestazioni di sezione.
- [gravità: bassa] attivita-dafare__tel-light.png — filtro «Tutte ⌄» — pulsante isolato sopra «Importanti» con solo ~12px di distanza dall'intestazione, mentre sopra ha 16px; sembra appartenere alla sezione — metterlo sulla stessa riga del campo o allineato a destra dell'intestazione.
- [gravità: bassa] attivita-dafare__tel-light.png — sottotitolo «scade tra 20 giorni» — appare solo su una riga, il che sbilancia le altezze; «scade» per un obiettivo personale è freddo — «entro il 7 set» in grigio, allineato come gli altri metadati.
- [gravità: bassa] attivita-dafare__tel-light.png — ultima riga «Mettere su Vinted i pantaloni» — coperta per metà dalla tab bar — padding inferiore.
- [gravità: bassa] attivita-dafare__tel-dark.png — pulsanti «+ Oggi» — lilla scuro con testo lilla chiaro, ok; ma il primo viola pieno risalta troppo nel tema scuro — uniformare.
## attivita-dafare-aggiunta
- [gravità: media] attivita-dafare-aggiunta__tel-light.png — chip «Oggi / Domani / Senza data» e select area sotto il campo — rientrano a x≈28 mentre campo e liste partono da x≈16: opzioni fluttuanti, non agganciate al campo — metterle dentro lo stesso contenitore del campo (espanso) o allinearle al margine di 16px.
- [gravità: media] attivita-dafare-aggiunta__tel-light.png — pulsante «+ Aggiungi» — resta lilla chiaro (aspetto secondario/disattivato) anche con il testo già scritto — diventare viola pieno quando il campo non è vuoto.
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — scelta data — solo Oggi/Domani/Senza data: manca «Scegli giorno…»; manca anche l'opzione «Importante» pur esistendo la sezione «Importanti» — aggiungere chip data personalizzata e stella importante.
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — select «Altro / Esplorazione» — controllo nativo diverso dai chip accanto (altezza, raggio, freccia) — usare un chip area con menu dell'app, stessa altezza dei chip data.
- [gravità: bassa] attivita-dafare-aggiunta__tel-light.png — chip data — raggi e altezze (44px) maggiori del filtro «Tutte» sotto, ma stesso aspetto: si confonde il filtro della lista con le opzioni del nuovo elemento — separare visivamente (pannello del campo) le opzioni di creazione dai filtri della lista.
- [gravità: media] attivita-dafare-aggiunta__tel-dark.png — chip selezionato «Senza data» — testo bianco su lilla pastello, contrasto basso — viola più scuro o testo scuro.
## attivita-abitudini
- [gravità: media] attivita-abitudini__tel-light.png — riepilogo «0 di 3 oggi» con anello grigio vuoto — l'anello vuoto è un grande cerchio grigio che sembra un avatar mancante; «oggi» isolato sotto — anello più piccolo con traccia visibile, testo su una riga («0 di 3 fatte oggi»).
- [gravità: media] attivita-abitudini__tel-light.png — cerchi di completamento a destra (verde, verde, blu) — quarto tipo di «spunta» nell'app (casella grigia grande in Adesso, quadratino verde in Mese, pulsante «Fatta» nel foglio, cerchio qui) e colorati per area senza che si capisca — un unico controllo di completamento in tutta l'app.
- [gravità: bassa] attivita-abitudini__tel-light.png — schede singole per ogni abitudine — in «Da fare» le righe sono raggruppate in una scheda unica con separatori; qui ogni riga è una scheda separata — uniformare lo stile delle liste.
- [gravità: bassa] attivita-abitudini__tel-light.png — «🔥3» solo su «Camminata» — la serie non c'è sulle altre (zero? nascosta?) e l'icona fiamma è la stessa dei 38 giorni in Adesso con significato diverso — mostrare sempre la serie o spiegarla; distinguere serie dell'abitudine da serie globale.
- [gravità: bassa] attivita-abitudini__tel-light.png — badge «3» sul segmento «Abitudini» selezionato — badge che conta il totale delle abitudini (non le cose da fare) è rumore; sovrapposto al bordo della pillola bianca — togliere o mostrare solo le mancanti di oggi.
- [gravità: bassa] attivita-abitudini__tel-dark.png — anello vuoto e cerchi di completamento — grigio scuro e verde scuro su nero, poco visibili — schiarire le tracce in tema scuro.
## attivita-abitudini-nuova
- [gravità: media] attivita-abitudini-nuova__tel-light.png — riga «Ora · Nessuno» — errore di concordanza: «ora» è femminile → «Nessuna» (meglio «Qualsiasi ora» / «Senza orario») — correggere il testo.
- [gravità: media] attivita-abitudini-nuova__tel-light.png — pannello opzioni della nuova abitudine — qui è una scheda ordinata con righe Giorni/Ora/Area; per una nuova attività invece le opzioni sono chip fluttuanti + select nativa: due modi diversi di fare la stessa cosa — usare lo stesso pannello a righe anche per le attività.
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — pulsante «+ Aggiungi» — resta lilla chiaro anche con «Meditare» scritto, poco evidente come azione da completare — viola pieno quando il campo è valido.
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — riga dei giorni L M M G V S D — tutti viola pieno: sette cerchi saturi pesano più del titolo; due «M» identiche non distinguibili per lettore di schermo — selezione con fondo lilla chiaro e testo viola; etichette accessibili «Lunedì», «Martedì», «Mercoledì».
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — riga «Giorni · Ogni giorno» — l'etichetta di riepilogo è sopra i cerchi e duplica l'informazione dei cerchi — tenere solo i cerchi con il titolo «Giorni».
- [gravità: bassa] attivita-abitudini-nuova__tel-light.png — area predefinita «Salute & Sport» — nella nuova attività l'area predefinita è «Altro / Esplorazione»: default incoerenti — stesso criterio di default (ultima usata o nessuna).
- [gravità: bassa] attivita-abitudini-nuova__tel-dark.png — pillola «Nessuno» — grigio su grigio scuro, sembra disattivata e non toccabile — dare lo stesso stile lilla delle altre pillole.
## scheda-attivita
- [gravità: media] scheda-attivita__tel-light.png — foglio a quasi tutto schermo — nessun pulsante «X»/«Fine» per chiudere, solo la maniglia grigia — aggiungere un pulsante di chiusura in alto a destra.
- [gravità: media] scheda-attivita__tel-light.png — pulsante «◎ Prossimo passo in Oggi» — frase telegrafica e gergale — «Metti in Oggi: Recuperare modulo 1» (nome del passo esplicito).
- [gravità: media] scheda-attivita__tel-light.png — caselle dei passi — quadrati da ~44px, molto più grandi del testo, con spunta verde piena: altro stile di casella ancora; in ogni riga anche icone calendario e cestino — casella 22–24px come standard unico; azioni della riga nello swipe o nel menù «…».
- [gravità: bassa] scheda-attivita__tel-light.png — chip «ogni giorno / ogni 2 giorni / ogni settimana» — minuscole iniziali, mentre «Domani / Giovedì / Tra una settimana» sopra hanno la maiuscola: incoerenza — maiuscola iniziale ovunque.
- [gravità: bassa] scheda-attivita__tel-light.png — «Distribuisci i passi» — non chiaro l'effetto (pianifica un passo ogni N giorni a partire da quando?) — sottotitolo esplicativo («Metti un passo in calendario ogni…»).
- [gravità: bassa] scheda-attivita__tel-light.png — riga «+ Aggiungi un passo... Aggiungi» — tre puntini invece di «…»; il «+» a sinistra e la parola «Aggiungi» a destra duplicano l'azione; altrove «+ Aggiungi» è una pillola — tenere solo il campo con invio, o la pillola coerente.
- [gravità: bassa] scheda-attivita__tel-light.png — «Pianifica»: chip su due righe con «Un altro giorno» da solo sulla seconda — scorrimento orizzontale o 2×2 uniforme.
- [gravità: bassa] scheda-attivita__tel-light.png — «Distribuisci i passi» dentro la scheda dei passi — riquadro dentro riquadro con chip bianchi su grigio — portarla fuori come sezione propria.
- [gravità: bassa] scheda-attivita__tel-dark.png — chip «ogni giorno»… e caselle vuote — grigio scuro su grigio scuro, bordi appena visibili — aumentare contrasto.
## scheda-attivita-fondo
- [gravità: media] scheda-attivita-fondo__tel-light.png — titolo fisso del foglio — il contenuto scorre sotto il titolo con un taglio netto (si vede il bordo di una casella a y≈185 sotto «ingegneria gestionale») senza ombra né separatore; il titolo su due righe da fisso occupa ~100px — ridurre il titolo fisso a una riga (con ellissi) e aggiungere un separatore/ombra quando si scorre.
- [gravità: media] scheda-attivita-fondo__tel-light.png — riga «Fissa in alto · no» — valore testuale senza interruttore né chevron: non sembra toccabile; e nella lista la sezione si chiama «Importanti», non «fissate» — usare un interruttore e lo stesso nome («Importante»).
- [gravità: media] scheda-attivita-fondo__tel-light.png — riga «↶ Non completata ›» — sembra uno stato, non un'azione; il chevron fa pensare a una sotto-pagina — «Segna come fatta» (o «Segna come da fare» se fatta) senza chevron, come pulsante.
- [gravità: bassa] scheda-attivita-fondo__tel-light.png — riga «Area · Studio / Università ⌄» — usa la freccia giù (select) mentre «Scadenza» usa «›»: due affordance diverse per righe dello stesso elenco — un'unica convenzione.
- [gravità: bassa] scheda-attivita-fondo__tel-light.png — valori «nessuna», «no» — minuscoli, grigio chiaro, «no» quasi invisibile — «Nessuna» e interruttore.
- [gravità: bassa] scheda-attivita-fondo__tel-light.png — «Trasforma in abitudine ›» — chevron ma presumibilmente apre una conferma/azione — togliere il chevron o rendere chiaro il passaggio.
- [gravità: bassa] scheda-attivita-fondo__tel-dark.png — titolo fisso — fondo del titolo uguale al foglio, il contenuto che passa sotto si confonde — separatore in tema scuro.
## scheda-abitudine
- [gravità: alta] scheda-abitudine__tel-light.png — riga «Ora 06:00 PM» e sottotitolo «lun–ven · 18:00» — nello stesso foglio la stessa ora appare in due formati — 24 ore ovunque.
- [gravità: media] scheda-abitudine__tel-light.png — mini-calendario della serie — manca il nome del mese (si va dal 27 luglio al 18 agosto senza indicazione); tre stati di cerchio (verde pieno, grigio pieno, solo numero) senza legenda — aggiungere «Luglio–Agosto» e una legenda «fatto / mancato / non previsto».
- [gravità: media] scheda-abitudine__tel-light.png — statistiche «3 di fila | 4 record | 7 in tutto» — «record» da solo non si capisce, «in tutto» di cosa — «3 giorni di fila», «Record: 4», «7 volte in tutto».
- [gravità: bassa] scheda-abitudine__tel-light.png — riga «Ora [06:00 PM] ×» — la ⓧ qui è fuori dalla pillola e grigia, nel foglio dal calendario è dentro la pillola: incoerenza dello stesso controllo — un'unica posizione.
- [gravità: bassa] scheda-abitudine__tel-light.png — pulsante «✓ Fatta» viola e «Salta oggi» link — in Adesso «Fatto» è verde e «Salta oggi» ha l'icona ⏭ — uniformare testo, colore e icone.
- [gravità: bassa] scheda-abitudine__tel-light.png — chip «Salute & Sport» verde a etichetta — stile diverso dalla pillola lilla «Salute & Sport» usata in «Area» degli altri fogli — un solo componente area.
- [gravità: bassa] scheda-abitudine__tel-light.png — calendario fuori da riquadri mentre statistiche e «Quando» sono in riquadri grigi — ritmo visivo irregolare — mettere anche il calendario in un riquadro o togliere i riquadri.
- [gravità: bassa] scheda-abitudine__tel-dark.png — chip «Salute & Sport» — verde scuro su fondo scuro, testo bianco ma icona verde quasi invisibile; giorni «S» «D» non selezionati con bordo grigio scuro poco visibile — aumentare contrasto.
## scheda-abitudine-fondo
- [gravità: alta] scheda-abitudine-fondo__tel-light.png — riga «Inizio · 07/29/2026» — formato data americano mese/giorno/anno in app italiana — «29/07/2026» o meglio «29 lug 2026».
- [gravità: alta] scheda-abitudine-fondo__tel-light.png — riga «Ora · 06:00 PM» — AM/PM (vedi sopra) — «18:00».
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — pillole «Salute & Sport», «07/29/2026» (lilla, testo viola) e «Mai» (grigia, testo nero) — stessi controlli con colori diversi; la data ha larghezza diversa dalle altre — uniformare colore e larghezza minima.
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — pulsante «Elimina» — qui è un pulsante pieno centrato senza icona; nel foglio dell'attività è una riga allineata a sinistra con icona cestino — un unico stile per l'azione distruttiva.
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — titolo fisso — qui ha una linea di separazione sotto, nel foglio dell'attività no — uniformare (separatore sempre quando si scorre).
- [gravità: bassa] scheda-abitudine-fondo__tel-light.png — sezione «Dettagli» — manca «Termina l'abitudine» che c'era nel foglio dal calendario, ma qui c'è «Fine · Mai»: due modi diversi per la stessa cosa — tenerne uno.
- [gravità: bassa] scheda-abitudine-fondo__tel-dark.png — pillola «Mai» — grigio scuro, sembra disattivata — stesso stile delle altre.
## andamento
- [gravità: media] andamento__tel-light.png — scheda in alto «🔥 38» con la settimana M G V S D L M — la serie dice 38 giorni ma venerdì è vuoto: contraddizione visiva (se è un giorno «libero» va indicato) — mostrare il venerdì con un'icona «pausa/congelato» o correggere il conteggio; aggiungere «giorni di fila» sotto il 38.
- [gravità: media] andamento__tel-light.png — «65% / 81 di 124» in alto a destra — nessuna etichetta né periodo (di cosa? questo mese? sempre?) — «65% fatte · ultimi 30 giorni».
- [gravità: media] andamento__tel-light.png — mappa «Costanza» — blu, mentre la stessa idea nella vista Anno è verde; la griglia è allineata a sinistra e occupa metà scheda (vuoto a destra ~130px), righe sfalsate senza etichette di giorni/mesi — stesso colore della vista Anno, griglia a tutta larghezza con etichette L/M/…/D e mesi.
- [gravità: bassa] andamento__tel-light.png — segmentato «Riepilogo | Scoperte» — icona accanto al testo, mentre nel segmentato di Oggi/Attività l'icona è sopra il testo: stesso componente, due layout — uniformare.
- [gravità: bassa] andamento__tel-light.png — percentuali «Per area» — non dicono rispetto a cosa (cose fatte / pianificate?) e il periodo — sottotitolo «Fatte su pianificate, ultimi 30 giorni».
- [gravità: bassa] andamento__tel-light.png — barre «Per area» — 8px con colori molto saturi diversi; il rosso di «Altro / Esplorazione» comunica errore — usare colori area meno allarmanti (il rosso solo per errori).
- [gravità: bassa] andamento__tel-light.png — fondo — «Progetti Founder 100%» tagliato dalla tab bar — padding inferiore.
- [gravità: bassa] andamento__tel-dark.png — legenda «meno ▢▢▢▢ più» — in scuro la scala è invertita (più = più chiaro) ma le celle vuote sono quasi uguali al fondo — aumentare contrasto delle celle vuote.
## andamento-fondo
- [gravità: media] andamento-fondo__tel-light.png — elenco «Riflessioni passate / Sessioni del timer / Aree / Grafici» — «Aree» è anche in Profilo e «Riflessioni passate» sembra lo stesso contenuto di Profilo › Diario: voci duplicate in due posti con nomi diversi; «Grafici» è vago — un'unica collocazione per ciascuna, nomi coerenti («Diario»), «Grafici» → «Grafici dettagliati» con sottotitolo.
- [gravità: bassa] andamento-fondo__tel-light.png — contatore «79» solo su «Riflessioni passate» — le altre righe senza numero: elenco squilibrato — o contatori per tutte o per nessuna.
- [gravità: bassa] andamento-fondo__tel-light.png — icona ⊕ usata sia per il titolo «Per area» sia per la riga «Aree» e per «Studio» ecc. — l'icona ⊕ (mirino/aggiungi) non evoca le aree — usare un'icona di categorie/etichette.
- [gravità: bassa] andamento-fondo__tel-light.png — spazio sotto l'ultima riga «Grafici» e la tab bar — ok, ma la scheda inferiore ha bordi/ombre diversi dalla scheda «Per area» (ombra vs bordo) — uniformare elevazione delle schede.
- [gravità: bassa] andamento-fondo__tel-dark.png — schede — bordo grigio chiaro su nero più evidente che altrove; righe dell'elenco ok — nessun altro problema rilevante.
## scoperte
- [gravità: media] scoperte__tel-light.png — titoli delle righe («Mettere il telefono / in un'altra stanza», «Camminare venti / minuti dopo pranzo») — vanno a capo a ~200px anche se a destra ci sono ~100px liberi prima del chevron: a capo prematuro, righe inutilmente alte — togliere la larghezza massima del titolo.
- [gravità: media] scoperte__tel-light.png — riquadri con pollice su/giù a sinistra (44px, bordo) — sembrano pulsanti di voto toccabili, ma sono solo icone di categoria (già indicata dall'intestazione «Funziona»/«Non funziona») — togliere il riquadro o l'icona, o ridurla a un'icona 16px senza bordo.
- [gravità: media] scoperte__tel-light.png — metadati «misurato», «lo noto ogni volta», «notato una volta» — scala di affidabilità espressa in frasi diverse e incoerenti («lo noto» presente, «notato» participio) — una scala esplicita: «Certezza: alta / media / bassa» o «Visto 1 volta / Spesso / Misurato».
- [gravità: bassa] scoperte__tel-light.png — terzo livello di navigazione «Registro 8 | Esperimenti 2» sotto «Riepilogo | Scoperte» — terzo stile di segmentato (icona sopra, contatore in linea, niente contenitore) e due livelli per pochi contenuti — usare un solo livello o tab testuali semplici; contatori nello stesso stile dei badge.
- [gravità: bassa] scoperte__tel-light.png — icona «pollice su» per la sezione «Scoperte» — non evoca «scoperta» (sembra «Mi piace») — usare lampadina/lente.
- [gravità: bassa] scoperte__tel-light.png — campo «Aggiungi una scoperta...» — tre punti; non si sceglie se «funziona» o «non funziona» — «…» e opzione funziona/non funziona dopo l'invio.
- [gravità: bassa] scoperte__tel-dark.png — riquadri pollice — verde/rosso scurissimi su fondo scuro, bordi grigi: sembrano disabilitati — se restano, schiarire il fondo.
## scoperte-esperimenti
- [gravità: media] scoperte-esperimenti__tel-light.png — grafico, etichette «media 3,1» e «media 4,3» — scritte sopra i punti e sulla linea tratteggiata, si sovrappongono ai dati e si leggono male — spostare le etichette fuori dall'area dei punti (a destra dell'asse o in legenda) con fondo.
- [gravità: media] scoperte-esperimenti__tel-light.png — grafico — nessuna etichetta sull'asse orizzontale (date/giorni) e asse Y solo 1–3–5 senza titolo — aggiungere date d'inizio/fine e «Focus (1–5)» sull'asse.
- [gravità: media] scoperte-esperimenti__tel-light.png — testo in fondo «…grande (d≈3,1)» — gergo statistico (d di Cohen) incomprensibile per un utente normale — «Differenza grande: molto probabilmente non è un caso» e il dettaglio tecnico in un «Scopri di più».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» — con bordo come pulsanti: non si capisce se sono stati o filtri toccabili; «concluso» minuscolo — badge di stato pieno senza bordo («Concluso»), metrica come testo semplice.
- [gravità: bassa] scoperte-esperimenti__tel-light.png — riquadro introduttivo — paragrafo di 4 righe sempre visibile, spiega il metodo ogni volta e spinge giù l'esperimento — mostrarlo solo al primo uso o comprimerlo in «Come funziona?».
- [gravità: bassa] scoperte-esperimenti__tel-light.png — pulsante «+ Nuovo esperimento» — bianco con bordo, mentre gli altri «Aggiungi» dell'app sono lilla: incoerenza — stesso stile dei pulsanti di creazione.
- [gravità: bassa] scoperte-esperimenti__tel-light.png — riquadro conclusione in fondo — tagliato dalla tab bar a metà frase — padding inferiore.
- [gravità: bassa] scoperte-esperimenti__tel-dark.png — linea tratteggiata «Prima (base)» — grigio su grigio scuro, quasi invisibile; fascia «Dopo la modifica» blu notte poco distinta — schiarire.
## scheda-scoperta
- [gravità: media] scheda-scoperta__tel-light.png — foglio intero — nessun «Salva»/«Fine» né «X»: non si sa se le modifiche sono salvate — indicare il salvataggio automatico («Salvato») o aggiungere «Fine».
- [gravità: media] scheda-scoperta__tel-light.png — titolo «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione; il titolo generico spreca la posizione più forte — usare come titolo il testo della scoperta e togliere l'etichetta, o titolo «Scoperta».
- [gravità: bassa] scheda-scoperta__tel-light.png — «Esito: funziona / non funziona» sotto «Dettagli» — è l'informazione principale ma sta dopo la certezza, dentro i dettagli; il chip non selezionato è bianco, mentre i chip non selezionati di «Quanto ne sei sicuro» sono grigi — portare l'esito in alto e uniformare lo stile dei chip.
- [gravità: bassa] scheda-scoperta__tel-light.png — «Quanto ne sei sicuro» — manca «?»; solo maschile — «Quanto ne sei sicuro/a?» o «Quanto è affidabile?».
- [gravità: bassa] scheda-scoperta__tel-light.png — chip «notato una volta / lo noto ogni volta / misurato» — minuscoli e su due righe (misurato da solo) — maiuscola iniziale, testi più brevi su una riga («Una volta / Spesso / Misurato»).
- [gravità: bassa] scheda-scoperta__tel-light.png — area di testo — maniglia di ridimensionamento nativa visibile — nasconderla.
- [gravità: bassa] scheda-scoperta__tel-dark.png — chip non selezionati — grigio scuro su grigio scuro, contrasto basso — schiarire fondo.
## profilo
- [gravità: media] profilo__tel-light.png — parte alta — nessun titolo «Profilo» e nessun pulsante «indietro»/chiudi; nella tab bar nessuna voce è evidenziata: l'utente non sa dove si trova né come tornare — aggiungere barra con «‹ Indietro» e titolo, o presentare il profilo come foglio modale con «Fine».
- [gravità: media] profilo__tel-light.png — riga «Promemoria · bloccati» — stato allarmante scritto in grigio come un valore qualunque, senza spiegazione né azione — evidenziare (icona ⚠︎ arancio) e spiegare «Notifiche bloccate dal browser — Attiva».
- [gravità: media] profilo__tel-light.png — statistiche «38 giorni | 109 fatte | 65% riuscita» — «109 fatte» contraddice «82 fatte» della vista Anno e «81 di 124» in Andamento; «riuscita» è una parola innaturale; «38 giorni» senza «di fila» — indicare il periodo, usare «completamento», «38 giorni di fila».
- [gravità: bassa] profilo__tel-light.png — avatar «R» quadrato arrotondato — in tutte le altre schermate l'avatar è un cerchio — usare la stessa forma.
- [gravità: bassa] profilo__tel-light.png — spaziature verticali — 12px tra scheda profilo e statistiche, 24px tra statistiche e primo gruppo, 10px tra i due gruppi dell'elenco — ritmo irregolare — 16/24/24 coerenti.
- [gravità: bassa] profilo__tel-light.png — motto sotto il nome — grigio in tre righe, nessun modo visibile di modificarlo (né il nome) — aggiungere «Modifica profilo».
- [gravità: bassa] profilo__tel-dark.png — riga «bloccati» — grigio su nero, l'avviso passa del tutto inosservato — colore di avviso.
## impostazioni
- [gravità: media] impostazioni__tel-light.png — impostazioni presentate come foglio dal basso sopra il Profilo — pagina lunga con sotto-pagine dentro un foglio senza «Fine»/«X»; il foglio parte a y≈85 e sopra si vede il profilo velato — usare una pagina a schermo intero con «‹ Profilo», o almeno un pulsante di chiusura.
- [gravità: media] impostazioni__tel-light.png — sezione «Account» con la sola riga «Sincronizzazione · su questo dispositivo» — senza chevron, non sembra toccabile; «su questo dispositivo» non dice chiaramente «nessuna sincronizzazione» — «Sincronizzazione · Disattivata (solo questo telefono) ›».
- [gravità: bassa] impostazioni__tel-light.png — secondo gruppo (Area predefinita, Timer, Musica, Aspetto) — senza intestazione, attaccato a «Account» con soli 8px: sembra far parte dell'account — aggiungere «Preferenze» e la stessa spaziatura (24px) degli altri gruppi.
- [gravità: bassa] impostazioni__tel-light.png — valori «Automatica», «chiedi sempre», «nessuna», «automatico» — maiuscole incoerenti — maiuscola iniziale per tutti i valori.
- [gravità: bassa] impostazioni__tel-light.png — «Area predefinita · Automatica ⌄» — freccia giù (select nativa) tra righe con «›» — stessa convenzione.
- [gravità: bassa] impostazioni__tel-light.png — «Esporta dati», «Importa dati» senza chevron accanto a «Backup e ripristino 1 ›» — il «1» non si capisce (un backup? un errore?) — «Ultimo backup: 18 ago» e chevron coerenti.
- [gravità: bassa] impostazioni__tel-light.png — voce «Scienza» nella Guida — titolo vago — «Su cosa si basa l'app» o «Le ricerche dietro l'app».
- [gravità: bassa] impostazioni__tel-dark.png — intestazioni di sezione «Account», «I tuoi dati», «Guida» — grigio scuro su nero, poco leggibili — schiarire.
## impostazioni-fondo
- [gravità: media] impostazioni-fondo__tel-light.png — gruppo «Reimposta» — «Cancella tutti i dati» (irreversibile) a 52px da «Rimuovi dati di esempio», stessa riga e stessa altezza: rischio di tocco errato — separare in un gruppo a parte con più spazio e testo esplicativo («Non si può annullare»), conferma con digitazione.
- [gravità: bassa] impostazioni-fondo__tel-light.png — «Registro tecnico» nella sezione «Guida» — è uno strumento per sviluppatori, non una guida — spostarlo in fondo in «Avanzate» o nasconderlo.
- [gravità: bassa] impostazioni-fondo__tel-light.png — «Rimuovi dati di esempio» — l'utente può non sapere quali dati siano d'esempio; nessun conteggio — «Rimuovi dati di esempio (23 elementi)».
- [gravità: bassa] impostazioni-fondo__tel-light.png — fondo del foglio — l'ultimo gruppo finisce a ~26px dal bordo, senza margine di sicurezza per la barra di sistema iOS (home indicator) — aggiungere padding env(safe-area-inset-bottom) + 16px.
- [gravità: bassa] impostazioni-fondo__tel-light.png — titolo fisso «Impostazioni» — il contenuto passa sotto senza ombra (c'è solo una linea sottile) — ok, ma più spazio sotto il titolo (8px ora).
- [gravità: bassa] impostazioni-fondo__tel-dark.png — «Cancella tutti i dati» — rosso salmone su grigio scuro, leggibile; intestazioni di sezione grigio scuro poco leggibili — schiarire le intestazioni.
## imp-timer
- [gravità: media] imp-timer__tel-light.png — altezza del foglio — la sotto-pagina Timer inizia a y≈155, la pagina Impostazioni a y≈85: il foglio «salta» di altezza passando da una pagina all'altra — altezza costante del foglio per tutta la navigazione interna.
- [gravità: media] imp-timer__tel-light.png — «Pausa lunga ogni 4 · No» — frase spezzata (ogni 4 cosa?) e valore «No» su un pulsante pillola invece di un interruttore — «Pausa lunga dopo 4 pomodori» con interruttore, e durata della pausa lunga se attivo.
- [gravità: media] imp-timer__tel-light.png — sezione «Avvio rapido» con «Durata 5 min» e «Poi continua per 25 min» — non si capisce il funzionamento (5 minuti di riscaldamento e poi 25?) — sottotitolo esplicativo («Inizi con 5 minuti; se vuoi, continua per altri 25»).
- [gravità: bassa] imp-timer__tel-light.png — link «‹ Impostazioni» sopra il titolo — 12px, molto piccolo per un'azione di navigazione (area di tocco < 44px) — ingrandirlo e metterlo nella barra in alto a sinistra.
- [gravità: bassa] imp-timer__tel-light.png — valori in pillole lilla toccabili — nella pagina Impostazioni gli stessi tipi di valori erano testo grigio con «›»: due pattern per lo stesso tipo di riga — uniformare.
- [gravità: bassa] imp-timer__tel-light.png — «Sessione · Durata» e «Avvio rapido · Durata» — due righe con la stessa etichetta «Durata» in sezioni diverse, poco distinguibili scorrendo — etichette specifiche («Durata sessione»).
- [gravità: bassa] imp-timer__tel-dark.png — link «‹ Impostazioni» lilla piccolo su grigio scuro — contrasto e dimensione insufficienti — ingrandire/schiarire.
## imp-musica
- [gravità: media] imp-musica__tel-light.png — campi «Incolla il link» — quasi invisibili: fondo appena diverso dal gruppo e nessun bordo, sembrano testo segnaposto non toccabile — bordo 1px o fondo bianco ben distinto.
- [gravità: media] imp-musica__tel-light.png — pagina intera — nessuna spiegazione di quale link incollare (Spotify? YouTube? playlist?) né di cosa succede — riga d'aiuto in testa con esempi e icone dei servizi supportati.
- [gravità: media] imp-musica__tel-light.png — elenco «Per area» — 8 aree × campo = muro di campi vuoti identici — mostrare un'unica riga «Aggiungi musica per un'area ›» e solo le aree configurate.
- [gravità: bassa] imp-musica__tel-light.png — interruttore «Apri all'avvio del timer» spento — pomello bianco su binario grigio chiarissimo, quasi invisibile su fondo grigio — binario più scuro (contrasto 3:1).
- [gravità: bassa] imp-musica__tel-light.png — altezza del foglio — qui inizia a y≈85, Timer a y≈155 — altezza costante.
- [gravità: bassa] imp-musica__tel-light.png — etichetta «Predefinita» — sola parola senza soggetto — «Musica predefinita».
- [gravità: bassa] imp-musica__tel-dark.png — interruttore spento — pomello bianco brillante su binario grigio scuro: sembra acceso a colpo d'occhio — pomello grigio chiaro quando spento.
## imp-aspetto
- [gravità: media] imp-aspetto__tel-light.png — altezza del foglio — qui il foglio parte a y≈455 (metà schermo), Timer a 155, Musica/Impostazioni a 85: il foglio cambia altezza a ogni sotto-pagina, effetto instabile — altezza fissa per l'intera navigazione delle impostazioni.
- [gravità: bassa] imp-aspetto__tel-light.png — «Suoni», «Vibrazione», «Animazioni» dentro «Aspetto» — suoni e vibrazione non sono «aspetto» — rinominare la pagina «Aspetto e suoni» o spostarli in «Feedback».
- [gravità: bassa] imp-aspetto__tel-light.png — interruttori accesi verdi — il colore d'accento dell'app è viola; il verde qui è l'unico uso «di sistema» — usare l'accento viola (o il verde ovunque per i toggle, coerente con «Apri all'avvio del timer»).
- [gravità: bassa] imp-aspetto__tel-light.png — segmentato «Auto | Chiaro | Scuro» dentro il gruppo, sotto l'etichetta «Tema» — riquadro dentro riquadro dentro foglio; margini interni del segmentato (12px) diversi da quelli delle righe (16px) — togliere il contenitore interno e allineare ai margini delle righe.
- [gravità: bassa] imp-aspetto__tel-light.png — fondo del foglio — l'ultimo gruppo termina a ~25px dal bordo, senza margine per l'indicatore home — aggiungere safe-area.
- [gravità: bassa] imp-aspetto__tel-dark.png — segmentato del tema — bordo e fondo quasi uguali, «Auto» selezionato si distingue poco da «Chiaro»/«Scuro» — aumentare contrasto della selezione.
## aree
- [gravità: media] aree__tel-light.png — interruttori verdi accanto a ogni area — non è spiegato cosa faccia spegnerli (nascondere? archiviare?) — sottotitolo «Le aree spente non compaiono nelle liste» o etichetta «Attiva».
- [gravità: media] aree__tel-light.png — cestino accanto all'interruttore su ogni riga — azione distruttiva a un tocco, attaccata a un controllo usato spesso — spostare «Elimina» nella pagina di dettaglio dell'area o nello swipe, con conferma.
- [gravità: media] aree__tel-light.png — righe delle aree — non si può modificare nome, colore o icona (nessun chevron/affordance), né riordinare — rendere la riga toccabile con «›» verso un dettaglio, maniglia di riordino.
- [gravità: bassa] aree__tel-light.png — «Nuova area»: icona libro grigia a sinistra di «Nome» — non si capisce che è un selettore d'icona/colore — renderlo un pulsante con bordo tratteggiato e «Icona».
- [gravità: bassa] aree__tel-light.png — «Aggiungi» testo viola — altrove «+ Aggiungi» è una pillola lilla — uniformare.
- [gravità: bassa] aree__tel-light.png — altezza del foglio — parte a y≈127, ancora diversa dalle altre sotto-pagine del Profilo; manca un pulsante di chiusura — uniformare.
- [gravità: bassa] aree__tel-dark.png — icone d'area su fondo tinta scura (verde su verde scuro, rosso su bordeaux) — contrasto basso, «Salute & Sport» quasi invisibile — schiarire le icone in tema scuro.
## sonno-pasti
- [gravità: alta] sonno-pasti__tel-light.png — tutti gli orari («11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «05:00 AM – 02:00 PM») — formato AM/PM in app italiana, mentre il Profilo mostra «23:30–07:30» — 24 ore.
- [gravità: media] sonno-pasti__tel-light.png — stessa impostazione modificabile in tre posti con tre interfacce diverse (pannello nella Giornata con select native e cestini; rituale «Sonno e pasti» con sì/no; questa pagina con pillole e «×») — un solo componente riutilizzato ovunque.
- [gravità: media] sonno-pasti__tel-light.png — «Promemoria nell'app · Sonno · Tra le 05:00 AM – 02:00 PM» — non si capisce cosa sia la finestra (quando ricordare di registrare il sonno?) — testo esplicito: «Chiedimi come ho dormito tra le 5:00 e le 14:00».
- [gravità: bassa] sonno-pasti__tel-light.png — pillole orario (testo nero) e durata (testo viola) affiancate — stessa forma, colori diversi senza ragione — un colore.
- [gravità: bassa] sonno-pasti__tel-light.png — «×» per eliminare un pasto — qui «×», nel pannello della Giornata un cestino — stessa icona.
- [gravità: bassa] sonno-pasti__tel-light.png — riga «Tra le» rientrata (x≈52) rispetto alle altre etichette (x≈35) — rientro non usato altrove — allineare o usare uno stile «sotto-opzione» coerente.
- [gravità: bassa] sonno-pasti__tel-dark.png — pillole orario — grigio scuro con testo bianco, pillole durata con testo viola: in scuro la differenza è ancora più marcata — uniformare.
## promemoria
- [gravità: alta] promemoria__tel-light.png — orari «08:30 AM», «01:00 PM», «04:30 PM», «09:30 PM», «11:00 PM – 07:00 AM» — AM/PM in app italiana — 24 ore.
- [gravità: media] promemoria__tel-light.png — riquadro giallo «Bloccati» — titolo senza soggetto, paragrafo centrato su tre righe con l'icona a sinistra (allineamenti misti); il testo «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» è contorto e non c'è un'azione — titolo «Notifiche bloccate», testo allineato a sinistra, frase semplice («Per riceverle, consenti le notifiche per questo sito nelle impostazioni del browser») e pulsante «Come fare».
- [gravità: media] promemoria__tel-light.png — elenco notifiche — «Priorità del giorno» non corrisponde a nessun rituale; mancano «Sonno e pasti» e «Bilancio della settimana»: nomi e voci non allineati alla pagina Rituali — usare esattamente gli stessi nomi dei rituali.
- [gravità: bassa] promemoria__tel-light.png — sezione «Non disturbare» attiva e modificabile mentre tutte le notifiche sono disattivate/bloccate — incoerente: o tutto disattivato, o spiegare che vale quando le notifiche torneranno — attenuarla come il resto.
- [gravità: bassa] promemoria__tel-light.png — righe disattivate (testo grigio chiaro, interruttori grigi) — sembrano tutte spente ma non si capisce se il loro valore salvato è acceso o spento — mostrare lo stato reale attenuato, non tutto grigio uniforme.
- [gravità: bassa] promemoria__tel-light.png — fondo — un gruppo successivo appare tagliato in basso (y≈825) — padding/safe-area.
- [gravità: bassa] promemoria__tel-dark.png — riquadro «Bloccati» — marrone oliva scuro poco piacevole; il testo bianco centrato su questo fondo affatica — usare ambra trasparente più pulito e testo allineato a sinistra.
## diario
- [gravità: media] diario__tel-light.png — tab bar con «Andamento» evidenziato e link «‹ Profilo» in alto — la pagina si apre dal Profilo ma la tab attiva è Andamento; inoltre Diario è una pagina intera mentre le altre voci del Profilo sono fogli dal basso — una sola modalità di navigazione e tab attiva coerente.
- [gravità: media] diario__tel-light.png — pulsante «↶» (annulla) grande su ogni riga — 8 pulsanti identici da 44px: rumore, rischio di tocco accidentale e significato poco chiaro (annulla cosa?) — spostare l'annulla nello swipe o nel menù della riga, con etichetta «Annulla».
- [gravità: media] diario__tel-light.png — colonna del testo — ristretta a ~180px tra icona, pulsante e orario: frasi su tre righe («Annotato · Guardare paper / su spaced repetition / e sonno») — togliere il pulsante dalla riga e mettere l'orario sopra/sotto in piccolo per dare tutta la larghezza al testo.
- [gravità: media] diario__tel-light.png — voce «Completata · Organizzare cena… Priorità» con una select «Relazioni & Sociale ⌄» dentro il diario — un registro non dovrebbe contenere controlli di modifica; la select nativa rompe il ritmo della lista — mostrare l'area come etichetta e permettere la modifica aprendo l'elemento.
- [gravità: bassa] diario__tel-light.png — prefisso «Annotato ·» ripetuto su quasi tutte le righe — ridondante con l'icona — togliere la parola e lasciare l'icona.
- [gravità: bassa] diario__tel-light.png — segmentato «Cose importanti | Tutto» — larghezza parziale (non occupa la riga), dentro una scheda, ennesimo stile di segmentato — tutta larghezza e stile unico.
- [gravità: bassa] diario__tel-light.png — titolo «Diario» — qui la pagina ha un titolo grande con back, mentre Profilo non ha titolo — uniformare le intestazioni.
- [gravità: bassa] diario__tel-dark.png — pulsanti ↶ con bordo grigio su scheda scura — molto evidenti rispetto al contenuto, attirano l'occhio più del testo — attenuarli o toglierli.
## timer-scelta
- [gravità: bassa] timer-scelta__tel-light.png — riquadri delle icone (bordo + fondo bianco, 40px) — sembrano caselle/pulsanti separati; quasi toccano i separatori delle righe (padding verticale ~4px) — icone senza riquadro o riquadro pieno lilla, righe alte 56px con 8px di respiro.
- [gravità: bassa] timer-scelta__tel-light.png — icona di «Pomodoro» ↻ — è la stessa icona usata per le abitudini — usare un'icona diversa (pomodoro/ciclo con pausa).
- [gravità: bassa] timer-scelta__tel-light.png — «Avvio rapido · 5 min» — non anticipa che poi continua per 25 (impostazione) — «5 min, poi 25».
- [gravità: bassa] timer-scelta__tel-light.png — foglio — non c'è «Ricorda la scelta» pur esistendo l'impostazione «Timer predefinito: Chiedi sempre» — aggiungere un'opzione per impostare il predefinito da qui.
- [gravità: bassa] timer-scelta__tel-light.png — fondo del foglio — ultima riga a ~25px dal bordo, nessuna safe-area — padding inferiore.
- [gravità: bassa] timer-scelta__tel-dark.png — velo dietro il foglio — in scuro è debolissimo: il pulsante verde «Fatto» e la fiamma restano vivi e competono col foglio — velo più scuro (60%).
## timer-concentrazione
- [gravità: media] timer-concentrazione__tel-light.png — link «⏸ Termina» — icona di pausa accanto alla parola «Termina»: segnali contraddittori (mette in pausa o chiude?); manca un vero «Pausa/Riprendi» — due azioni distinte: pulsante «Pausa» (⏸) ben visibile vicino al tempo e «Termina» (■) secondario.
- [gravità: media] timer-concentrazione__tel-light.png — pulsante verde enorme «✓ Fatto» come azione principale a timer appena avviato — invita a chiudere subito; a 25:00 non si capisce nemmeno se il timer sta andando — azione primaria = Pausa/Avvia; «Fatto» secondario; mostrare l'avanzamento sull'anello.
- [gravità: bassa] timer-concentrazione__tel-light.png — «X» in alto a destra e «Termina» — due modi per uscire senza dire se la sessione viene salvata — chiarire («Esci (il timer continua)» vs «Termina sessione»).
- [gravità: bassa] timer-concentrazione__tel-light.png — composizione verticale — blocco centrale spostato in alto, ~180px vuoti in fondo — centrare otticamente o spostare i pulsanti verso il basso (zona del pollice).
- [gravità: bassa] timer-concentrazione__tel-light.png — tema chiaro — lo schermo di concentrazione resta nero anche in tema chiaro: scelta voluta ma non coerente con l'impostazione «Tema» — rispettare il tema o dichiararlo («Modalità concentrazione»).
- [gravità: bassa] timer-concentrazione__tel-light.png — «Pomodoro · blocco 1» e «restano» — «blocco 1» senza il totale, «restano» minuscolo sotto il numero — «Pomodoro 1 di 4», «rimanenti».
- [gravità: bassa] timer-concentrazione__tel-dark.png — anello quadrato-arrotondato — traccia grigio scuro quasi invisibile su nero; forma «squircle» insolita per un timer — traccia più chiara e progresso colorato.
## cattura
- [gravità: media] cattura__tel-light.png — riga inferiore con solo «Chiudi» a destra — un'intera fascia di ~45px per un link piccolo; la scheda sembra vuota a metà — spostare la chiusura (tocco fuori / «Annulla» a sinistra del campo) o usare la riga per opzioni utili (Oggi / Da sistemare / area).
- [gravità: media] cattura__tel-light.png — destinazione del pensiero — non si dice dove finisce (in «Da sistemare»?) — sottotitolo/segnaposto «Finisce in Da sistemare».
- [gravità: bassa] cattura__tel-light.png — pulsante «Salva» viola pieno con campo vuoto — attivo anche senza testo — disattivarlo finché il campo è vuoto.
- [gravità: bassa] cattura__tel-light.png — posizione del popup in alto — si apre dal «+» in basso a destra ma compare in cima: il legame spaziale si perde; inoltre sotto la tastiera reale andrebbe in basso — ancorarlo sopra la tastiera (stile foglio).
- [gravità: bassa] cattura__tel-light.png — icona ⚡ a sinistra — significato non chiaro (veloce?) e dello stesso viola del pulsante, compete — icona grigia o rimuoverla; «Scrivi un pensiero…» con il carattere «…».
- [gravità: bassa] cattura__tel-dark.png — bordo della scheda — grigio chiaro su sfondo sfocato scuro, ok; «Chiudi» viola piccolo poco leggibile — vedi sopra.
## menu-oggi-avatar
- [gravità: media] menu-oggi-avatar__tel-light.png — risultato del tocco sull'avatar — si apre direttamente la pagina Profilo (identica a profilo__tel-light.png) senza titolo né «indietro», e la voce «Oggi» della tab bar si spegne: l'utente esce da Oggi senza sapere come tornarci se non toccando la tab — aprire il Profilo come foglio/push con «‹ Oggi» o «Fine», e mantenere la tab di provenienza evidenziata.
- [gravità: bassa] menu-oggi-avatar__tel-light.png — stessi difetti di profilo__tel-light.png («bloccati» grigio, «riuscita», avatar quadrato vs cerchio, spaziature 12/24/10) — vedi sezione profilo.
- [gravità: bassa] menu-oggi-avatar__tel-dark.png — come profilo__tel-dark.png — avviso «bloccati» invisibile in grigio.
## trascinamento-in-corso
- [gravità: media] trascinamento-in-corso__tel-light.png — anteprima trascinata «Organizzare cena con il gruppo · alle 12:45» — la pillola viola galleggia sopra le 11:30–12:00, mentre la zona di destinazione evidenziata è 12:45–14:15: l'oggetto sotto il dito e il punto d'arrivo sono distanti ~70px, si capisce male dove cadrà — far coincidere l'anteprima con la zona di destinazione (o mostrare solo la zona con titolo).
- [gravità: media] trascinamento-in-corso__tel-light.png — zona di destinazione 12:45–14:15 sovrapposta a «Pranzo» — nessun avviso di conflitto con il pasto — evidenziare la sovrapposizione (bordo arancio, «si sovrappone al pranzo») o affiancare i blocchi.
- [gravità: media] trascinamento-in-corso__tel-light.png — bordo superiore — il segmentato «Adesso / La giornata / Rituali» e l'avatar sono tagliati a metà dal bordo dello schermo (badge «1» mozzato) — intestazione o tutta visibile o del tutto nascosta.
- [gravità: bassa] trascinamento-in-corso__tel-light.png — zona tratteggiata «Togli l'orario» in fondo — copre il blocco delle 15:00 e sta a ridosso della tab bar; durante il trascinamento la tab bar resta e ruba spazio — nascondere la tab bar durante il trascinamento e mettere la zona al suo posto.
- [gravità: bassa] trascinamento-in-corso__tel-light.png — etichetta «12:45–14:15» — viola su viola semitrasparente, contrasto basso — testo scuro o fondo più chiaro.

## Riassunto

**1. Formati di data e ora americani (alta).** Gli orari appaiono come «11:30 PM», «06:00 PM», «09:30 AM» in: pannello sonno della Giornata, foglio attività/abitudine, rituale Sonno e pasti, Profilo › Sonno e pasti, Promemoria. Spesso stanno accanto alle stesse ore scritte a 24 ore («lun–ven · 18:00», «23:30–07:30»). La data d'inizio di un'abitudine è «07/29/2026». Correzione: formattatore unico a 24 ore e date in italiano («29 lug 2026»), senza campi time/date nativi lasciati alla lingua del browser.

**2. Testi tagliati e controlli nativi stretti (alta).**
- In Fine giornata i nomi delle aree sono tagliati senza puntini: «Relazioni & Soc», «Studio / Univer», «Altro / Esplora:».
- Nel pannello sonno le tendine della durata mostrano «15 mir», «45 mi».
- In tutta l'app restano select e aree di testo native: freccia di sistema, maniglia di ridimensionamento.

**3. Stessi componenti con aspetto diverso (media, il tema che torna più spesso).**
- **Spunta/completamento:** cinque stili diversi. Casella grigia grande (Adesso), quadratino verde (Mese), cerchio colorato per area (Abitudini), quadrati da 44px (passi), pulsante «Fatto» verde in Adesso e «Fatta» viola nel foglio.
- **Segmentati:** quattro stili. Icona sopra il testo (Oggi/Attività), icona accanto al testo (Andamento), pillola lilla senza contenitore (Giorno/Settimana), sotto-tab con contatore (Registro/Esperimenti).
- **Badge:** quadratini scuri che escono dal segmento in alto, cerchio viola nella tab bar.
- **Fogli dal basso:** a volte c'è il titolo fisso con separatore, a volte no. «Elimina» è una volta riga con icona, una volta pulsante centrato. La «×» per svuotare un valore sta dentro o fuori dalla pillola.
- **Area:** pillola lilla, chip verde, select nativa o icona colorata, a seconda della schermata.
- **Le stesse impostazioni sonno e pasti si modificano in tre posti con tre interfacce:** pannello della Giornata, rituale, Profilo.
- **Nomi:** «Fine giornata/Bilancio della settimana» contro «Review…». «Priorità del giorno» in Promemoria non corrisponde a nessun rituale. Le cose fatte si chiamano «fatte», «cose fatte» o «azioni completate». «Fissa in alto» contro la sezione «Importanti». «Riflessioni passate» contro «Diario».

**4. Numeri e stati senza spiegazione (media).**
- In Adesso «1/2» e «🔥38» non hanno etichetta.
- In Andamento «65% / 81 di 124» non dice di cosa né di quale periodo; la serie di 38 giorni convive con un venerdì vuoto.
- In Anno compare «XP», mai spiegato; i numeri verdi sui mesi non hanno unità.
- I puntini colorati del calendario Mese e le intensità delle mappe di calore non hanno legenda.
- «riuscita» è una parola innaturale.
- I totali si contraddicono: 82 fatte (Anno), 109 (Profilo), 81 (Andamento); «6/7 giorni attivi» di martedì.
- La griglia 8×5 di Fine giornata non dice cosa si valuta.
- Mancano il nome del mese nel calendario dell'abitudine e la legenda dei suoi stati.
- «d≈3,1» è gergo statistico.

**5. Navigazione e orientamento (media).**
- **Parte alta della Giornata:** quattro fasce di navigazione impilate (~300px) prima del calendario.
- **Profilo:** si apre dall'avatar senza titolo né «indietro», e nessuna tab resta evidenziata.
- **Diario:** si apre dal Profilo ma evidenzia la tab Andamento, ed è una pagina intera mentre le altre voci del Profilo sono fogli.
- **Fogli delle impostazioni:** cambiano altezza a ogni sotto-pagina (y 85 / 127 / 155 / 455).
- **Fogli senza pulsante di chiusura:** i fogli di attività, scoperta e impostazioni hanno solo la maniglia.
- **Intestazioni fisse tagliate a metà** durante lo scorrimento e il trascinamento.

**6. Azioni ambigue o rischiose (media).**
- «Togli la spunta», «Sposta in Da fare», «Non completata ›», «Ripristina / Ritmo di base», «Pausa lunga ogni 4 · No», «⏸ Termina».
- Nel timer il pulsante principale è «Fatto», a sessione appena avviata.
- Le azioni distruttive hanno lo stesso stile di quelle normali: «Termina l'abitudine» in viola, cestini a un tocco in Aree e nei pasti, «Cancella tutti i dati» accanto a «Rimuovi dati di esempio».
- Ci sono due pulsanti «Salva» nello stesso rituale, e «Registra» resta visibile dopo che il check-in è già fatto.
- I «+ Aggiungi» restano lilla chiaro (sembrano disattivati) anche dopo aver scritto il testo.

**7. Contenuto coperto dalla tab bar flottante (media/bassa).** Liste, pulsanti di salvataggio e ultime righe finiscono sotto la barra in Giornata, Anno, rituali, Da fare, Andamento ed Esperimenti. Sotto la barra si vede ancora il contenuto. I fogli non tengono margine per la safe-area. Correzione: padding inferiore pari all'altezza della barra più la safe-area, e un fondo/sfumatura dietro la barra.

**8. Densità e gerarchia (bassa/media).**
- **Pulsanti ripetuti su ogni riga:** «+ Oggi» in Da fare, «↶» nel Diario. Restringono i titoli a ~170px e li mandano a capo su 2–3 righe.
- **A capo prematuro dei titoli** in Scoperte e nel foglio attività.
- **Riquadri dentro riquadri:** calendario, mesi dell'Anno, Distribuisci i passi, segmentato del tema.
- **Muri di controlli grigi uguali:** 40 pulsanti in Fine giornata, 8 campi link in Musica.
- **Grafici:** etichette sovrapposte ai dati negli Esperimenti; heatmap «Costanza» allineata a sinistra a metà larghezza e blu, mentre in Anno è verde.

**9. Tema scuro (bassa/media).**
- **Testo bianco su viola pastello** nei pulsanti selezionati («Oggi» in Da sistemare, «Senza data»): contrasto circa 2,5:1.
- **Contrasto quasi nullo:** badge grigio su grigio, bordi verde scuro delle abitudini, celle vuote delle mappe, pulsanti 1–5, chip non selezionati, etichette secondarie.
- **Fondi «sporchi»:** marrone/oliva nel riquadro «Bloccati» e nell'icona sole.
- **Velo dei fogli troppo leggero:** lo sfondo compete con il foglio.
- **Interruttore spento con pomello bianco brillante:** sembra acceso.

**10. Italiano (bassa/media).**
- Mesi con la maiuscola e ripetuti («17 Ago – 23 Ago»); va scritto «17–23 ago».
- «Ora · Nessuno» va al femminile: «Nessuna».
- «concentratissimo».
- «Sposta 1 non fatta a domani».
- Domande senza «?» (bilancio settimanale, «Quanto ne sei sicuro»).
- Chip con la minuscola iniziale accanto a chip con la maiuscola.
- «...» al posto di «…».
- Scala di certezza incoerente: «notato una volta / lo noto ogni volta / misurato».
- «Registro tecnico» sta dentro «Guida».
