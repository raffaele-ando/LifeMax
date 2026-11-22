# Revisione telefono — giro 4

## oggi-adesso__tel-light.png
- [media] oggi-adesso__tel-light.png — sotto la data — «1 di 2» accanto alla barra non dice di cosa (attività? rituali? abitudini?) — scrivere «1 di 2 fatte» o «Giornata: 1 su 2 completate»
- [media] oggi-adesso__tel-light.png — pillola «🔥 38 giorni» — numero senza contesto (serie di cosa?) e pillola più alta della riga data, non allineata alla baseline del titolo — «38 giorni di fila» + allineare verticalmente al titolo
- [bassa] oggi-adesso__tel-light.png — badge «1» su Rituali — il badge è appoggiato al bordo del controllo segmentato e lo taglia visivamente; quadrato invece che tondo come il «6» di Attività — badge tondo coerente, posizionato dentro il segmento
- [bassa] oggi-adesso__tel-light.png — etichette del controllo segmentato (Adesso/La giornata/Rituali) — testo ~11px, molto piccolo per un controllo principale — portare a 12–13px
- [bassa] oggi-adesso__tel-light.png — card principale — «Studio / Università» in blu sembra un link ma non lo è; chip «Abitudine» grigio ridondante — usare colore testo secondario o renderlo tappabile in modo esplicito
- [bassa] oggi-adesso__tel-light.png — «Salta oggi ⏭» — azione testuale senza contorno accanto a un bottone con contorno: gerarchia ok ma l'icona ⏭ dopo il testo è insolita — icona prima del testo come «▷ Timer»
- [bassa] oggi-adesso__tel-light.png — metà inferiore — ampio vuoto tra «Poi» e la barra in basso — accettabile, ma si potrebbe mostrare anche «Più tardi»/conteggio restanti

## oggi-adesso__tel-dark.png
- [media] oggi-adesso__tel-dark.png — controllo segmentato — segmento attivo «Adesso» grigio medio su grigio scuro: stato selezionato poco distinguibile — usare superficie più chiara o accento viola sottile
- [media] oggi-adesso__tel-dark.png — sotto la data — stesso «1 di 2» senza etichetta — vedi tema chiaro
- [bassa] oggi-adesso__tel-dark.png — icona sole in «Pianifica la giornata» — riquadro marrone scuro con icona gialla, contrasto basso — schiarire il fondo
- [bassa] oggi-adesso__tel-dark.png — pillola «38 giorni» — testo «giorni» grigio su marrone, contrasto basso — schiarire

## giornata-giorno__tel-light.png
- [media] giornata-giorno__tel-light.png — testata — due controlli segmentati impilati (Adesso/La giornata/Rituali + Giorno/Settimana/Mese/Anno) con stili diversi (uno con bordo e fondo, l'altro senza): occupano ~110px e confondono il livello gerarchico — rendere il secondo livello più leggero (testo sottolineato o chip piccoli) e uniforme
- [media] giornata-giorno__tel-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — icone pasti senza etichetta né orario, significato poco chiaro finché non si apre — mostrare «3 pasti» o gli orari, oppure un'etichetta «Sonno e pasti»
- [media] giornata-giorno__tel-light.png — blocco «Organizzare cena con il gruppo» — la linea dell'ora attuale attraversa il testo «09:30–11:00» e la pillola «10:30» copre il bordo destro del blocco — far passare la linea sotto il blocco (z-index) o lasciare la pillola nella colonna delle ore a sinistra
- [bassa] giornata-giorno__tel-light.png — blocchi pasto «Colazione»/«Pranzo» — grigi centrati, sembrano elementi disabilitati; non mostrano l'orario — aggiungere orario e un tono distinto (es. contorno tratteggiato)
- [bassa] giornata-giorno__tel-light.png — fascia tratteggiata 07:00–07:30 — sonno rappresentato senza etichetta: non si capisce che è sonno — aggiungere icona letto o testo «Sonno» al primo blocco
- [bassa] giornata-giorno__tel-light.png — in fondo — sotto la barra di navigazione flottante spunta «17:00» tagliato — aggiungere padding inferiore o dissolvenza dietro la barra
- [bassa] giornata-giorno__tel-light.png — titolo «Oggi» — manca la data effettiva nella vista giorno — «Oggi · mar 18 ago»

## giornata-giorno__tel-dark.png
- [media] giornata-giorno__tel-dark.png — segmento attivo «La giornata» e «Giorno» — grigio medio su grigio scuro, contrasto stato selezionato basso; i due selezionati hanno lo stesso stile e competono — accento viola per il livello 2
- [media] giornata-giorno__tel-dark.png — linea ora attuale sul blocco — come tema chiaro
- [bassa] giornata-giorno__tel-dark.png — blocco «Organizzare cena» — barra laterale rosa scura quasi invisibile su fondo grigio — schiarire il colore area in dark
- [bassa] giornata-giorno__tel-dark.png — «17:00» tagliato sotto la barra — come tema chiaro

## giornata-giorno-fondo__tel-light.png
- [media] giornata-giorno-fondo__tel-light.png — sezione «Senza orario» — la card di «Ripasso flashcard» ha il bordo superiore piatto/tagliato, sembra incollata sotto l'intestazione mentre il resto delle card ha angoli tondi su tutti i lati — angoli tondi completi e 8px di stacco dall'intestazione
- [media] giornata-giorno-fondo__tel-light.png — «Ripasso flashcard» — è un'abitudine (in Adesso ha il chip «Abitudine») ma qui ha checkbox quadrata e icona libro, mentre le altre abitudini nel calendario hanno l'icona ↻ verde — usare lo stesso marcatore ↻ per le abitudini ovunque
- [media] giornata-giorno-fondo__tel-light.png — «Sposta a domani quella non fatta» — frase innaturale e ambigua (quale?) — «Sposta a domani le attività non fatte (1)»
- [bassa] giornata-giorno-fondo__tel-light.png — blocco «Leggere 20 minuti» — unico blocco senza orario visibile (gli altri mostrano «18:00–18:45») — mostrare l'orario a destra sulla stessa riga quando il blocco è basso
- [bassa] giornata-giorno-fondo__tel-light.png — icona orologio viola a destra di «Ripasso flashcard» — affordance non chiara (assegna orario?) — etichetta accessibile e tooltip, o testo «Pianifica»
- [bassa] giornata-giorno-fondo__tel-light.png — «Nuova attività…» + «Aggiungi» — il bottone è dentro il campo ma con sfondo lilla pieno alto quanto il campo: ok; il campo però non ha fondo bianco come le card sopra (bordo solo) — uniformare

## giornata-giorno-fondo__tel-dark.png
- [media] giornata-giorno-fondo__tel-dark.png — stessi problemi del tema chiaro (card «Senza orario» tagliata in alto, marcatore abitudine incoerente, testo «Sposta a domani quella non fatta»)
- [bassa] giornata-giorno-fondo__tel-dark.png — badge «1» accanto a «Senza orario» — grigio su grigio, poco leggibile — schiarire
- [bassa] giornata-giorno-fondo__tel-dark.png — blocco «Confrontare piani telefonici» — marrone/oliva scuro poco piacevole e con testo secondario a basso contrasto — rivedere la tinta area in dark

## giornata-settimana__tel-light.png
- [media] giornata-settimana__tel-light.png — navigazione periodo — qui il titolo «17–23 ago» è allineato a sinistra accanto alla freccia, mentre in vista Giorno «Oggi» è centrato tra le frecce: componente incoerente tra viste — centrare sempre il titolo
- [media] giornata-settimana__tel-light.png — Lunedì 17 (giorno passato) — «Leggere 20 minuti», «Ripasso flashcard» e «Inbox a zero…» non fatti non sono segnalati come mancati: si confondono con quelli futuri — stato «non fatta» (icona o testo grigio «saltata/non fatta»)
- [media] giornata-settimana__tel-light.png — anelli di progresso sotto L e M — anello verde parziale senza legenda né numero; il 18 ha pieno viola + anello verde, gli altri giorni nessun anello: significato da indovinare — legenda «anello = quota fatta» o percentuale in accessibilità, anello grigio vuoto per i giorni futuri
- [bassa] giornata-settimana__tel-light.png — riga «Inbox a zero + piani per do…» — titolo troncato a causa del link «Sposta» — andare a capo su due righe o spostare l'azione in swipe/menu
- [bassa] giornata-settimana__tel-light.png — colonna orari — righe senza orario lasciano il testo rientrato a 92px mentre le icone a pallino hanno allineamenti diversi dalle ↻: colonne irregolari — colonna orario fissa con «—» o «senza orario»
- [bassa] giornata-settimana__tel-light.png — «Ripasso flashcard» — ↻ blu, mentre le altre abitudini hanno ↻ verde — colore unico per le abitudini (o spiegare il colore = area)

## giornata-settimana__tel-dark.png
- [media] giornata-settimana__tel-dark.png — stessi problemi del tema chiaro (titolo non centrato, giorni passati senza stato «non fatta», anelli senza legenda)
- [media] giornata-settimana__tel-dark.png — segmento attivo «Settimana» grigio medio su nero: stato selezionato a basso contrasto e stile identico al livello superiore — accento viola
- [bassa] giornata-settimana__tel-dark.png — anello del 17 — grigio scuro con arco verde su nero: anello di fondo quasi invisibile — schiarire la traccia

## giornata-mese__tel-light.png
- [media] giornata-mese__tel-light.png — pallini colorati sotto i giorni — nessuna legenda: non si capisce che rappresentano (aree? scoperte? attività con scadenza?) — legenda sotto la griglia o colori spiegati al tocco
- [media] giornata-mese__tel-light.png — anelli verdi — senza legenda; molti giorni quasi pieni sono indistinguibili da pieni — legenda breve «anello = quota del giorno fatta»
- [media] giornata-mese__tel-light.png — giorno 18 — tre segnali sovrapposti (riquadro grigio di selezione, cerchio viola pieno di «oggi», arco verde): ridondante e il riquadro è più grande delle celle vicine — un solo stato per oggi (cerchio viola) e uno per selezionato
- [media] giornata-mese__tel-light.png — lista «Oggi» — l'abitudine «Leggere 20 minuti» ha qui un quadratino verde pieno-contorno ancora diverso (in Giorno ↻, in Adesso chip «Abitudine»): terzo marcatore diverso per lo stesso concetto — un unico componente abitudine
- [bassa] giornata-mese__tel-light.png — «18 giorni attivi · 58 attività fatte» — numeri grandi ma testo grigio piccolo; «giorni attivi» ambiguo (attivo = almeno una cosa fatta?) — «giorni con almeno 1 cosa fatta»
- [bassa] giornata-mese__tel-light.png — riga del 31 — ultima settimana con un solo giorno lascia ~50px vuoti nella card — accettabile, oppure griglia a 6 righe fissa con giorni di settembre sbiaditi (coerente con i 27–31 luglio in alto)

## giornata-mese__tel-dark.png
- [media] giornata-mese__tel-dark.png — stessi problemi del tema chiaro (pallini e anelli senza legenda, oggi con tre stati)
- [bassa] giornata-mese__tel-dark.png — giorni di luglio 27–31 — numeri grigio scuro e anelli quasi invisibili su nero; pallini scuri indistinguibili — aumentare opacità

## giornata-anno__tel-light.png
- [alta] giornata-anno__tel-light.png — mini-mese «Ago» — numero verde «17» mentre la vista Mese dello stesso agosto dice «18 giorni attivi»: dato incoerente tra viste (o il numero significa altro) — allineare il calcolo o etichettare diversamente
- [media] giornata-anno__tel-light.png — numeri verdi «7», «25», «17» in alto a destra dei mesi — numeri senza etichetta — «7 gg» o tooltip/legenda «giorni attivi»
- [media] giornata-anno__tel-light.png — mappa di calore — blu a intensità variabile senza legenda (meno→più), mentre la vista Mese usa anelli verdi per lo stesso dato: codifica cromatica incoerente — una sola scala (es. verde) e legenda «meno ▢▢▢▢ più»
- [media] giornata-anno__tel-light.png — riquadro statistiche — «XP» non spiegato in un'app italiana (gergo da videogioco) — «Punti» o tocco per spiegazione
- [bassa] giornata-anno__tel-light.png — riquadro statistiche — qui in card con divisori, in vista Mese gli stessi numeri sono testo libero senza card: componente incoerente — usare lo stesso componente nelle due viste
- [bassa] giornata-anno__tel-light.png — mesi futuri e passati vuoti — celle grigie identiche per «nessuna attività» e «giorno futuro»: non si distingue — futuri con solo contorno

## giornata-anno__tel-dark.png
- [alta] giornata-anno__tel-dark.png — «Ago 17» vs «18 giorni attivi» in vista Mese — come tema chiaro
- [media] giornata-anno__tel-dark.png — celle vuote grigio scuro su card grigio scuro: griglie quasi invisibili; blu scuro dei livelli bassi poco distinguibile dal vuoto — aumentare il contrasto della scala in dark
- [bassa] giornata-anno__tel-dark.png — «XP» e numeri verdi senza etichetta — come tema chiaro

## giornata-sonno-aperto__tel-light.png
- [alta] giornata-sonno-aperto__tel-light.png — durate pasti «15 min ⌄», «45 min ⌄» — select nativi non stilizzati: chevron di sistema schiacciato a destra, padding diverso dai campi orario accanto — select personalizzato o stile coerente con gli input (chevron dell'app, stesso padding)
- [media] giornata-sonno-aperto__tel-light.png — riga «A letto 23:30 / Sveglia 07:30» — griglia diversa dalle righe pasto (etichetta+campo affiancati vs colonne etichetta/ora/durata): i campi non sono allineati in colonna — usare la stessa griglia a colonne
- [media] giornata-sonno-aperto__tel-light.png — riga azioni «+ Pasto · Annulla le modifiche · Orari abituali» — tre link di pari peso; «Orari abituali» ambiguo (ripristina? apre impostazioni?) e «Annulla le modifiche» visibile anche senza modifiche — «Ripristina orari abituali», mostrare «Annulla» solo dopo una modifica, separare l'azione primaria
- [media] giornata-sonno-aperto__tel-light.png — icone cestino — piccole (~14px) e attaccate al select, area di tocco insufficiente — target 44px, più spazio
- [bassa] giornata-sonno-aperto__tel-light.png — in alto — controllo «Giorno/Settimana/Mese/Anno» tagliato dal bordo superiore durante lo scorrimento — barra sticky completa o che scompare del tutto
- [bassa] giornata-sonno-aperto__tel-light.png — riepilogo chiuso «☕ 🍴 🍴» ripetuto anche ad aperto sopra i campi — ridondante quando il pannello è espanso — sostituire con titolo «Sonno e pasti»

## giornata-sonno-aperto__tel-dark.png
- [alta] giornata-sonno-aperto__tel-dark.png — select nativi non stilizzati — come tema chiaro
- [media] giornata-sonno-aperto__tel-dark.png — campi orario — bordo grigio scuro su card scura, quasi invisibile; fondo del campo uguale alla card — bordo più chiaro o fondo campo distinto
- [bassa] giornata-sonno-aperto__tel-dark.png — stessi problemi di allineamento e link del tema chiaro

## giornata-scheda-blocco__tel-light.png
- [media] giornata-scheda-blocco__tel-light.png — intestazione foglio — l'attività è fatta (barrata nel calendario) ma nel foglio nessuno stato visibile; l'unico indizio è «Segna come non fatta» — badge «✓ Fatta alle …» accanto al sottotitolo
- [media] giornata-scheda-blocco__tel-light.png — valori righe — «09:30» in nero, «1 h 30» e «Relazioni & Sociale» in viola: colore del valore incoerente nello stesso elenco — stesso stile per tutti i valori modificabili
- [bassa] giornata-scheda-blocco__tel-light.png — «1 h 30» — formato durata poco naturale — «1 h 30 min» o «1:30 h»
- [bassa] giornata-scheda-blocco__tel-light.png — ✕ grigi dentro le pillole Ora/Durata — azione «rimuovi orario» poco chiara, rischio di tocco accidentale — spostare in un'azione esplicita «Togli dall'orario»
- [bassa] giornata-scheda-blocco__tel-light.png — foglio — nessun pulsante di chiusura né «Fatto», solo maniglia — aggiungere ✕ o «Chiudi» per accessibilità
- [bassa] giornata-scheda-blocco__tel-light.png — «Segna come non fatta» — azione centrata come testo grigio, sembra un'etichetta — renderla bottone secondario

## giornata-scheda-blocco__tel-dark.png
- [media] giornata-scheda-blocco__tel-dark.png — stessi problemi del tema chiaro (stato fatta assente, colori valori incoerenti)
- [bassa] giornata-scheda-blocco__tel-dark.png — ✕ grigio su pillola grigio-viola scura — contrasto basso — schiarire

## giornata-scheda-abitudine__tel-light.png
- [media] giornata-scheda-abitudine__tel-light.png — bottone «✓ Fatto» — verde pieno con spunta: si legge come stato («è fatto») più che come azione; nella scheda attività la stessa funzione è il testo grigio «Segna come non fatta» — usare «Segna come fatta» e lo stesso pattern nelle due schede
- [media] giornata-scheda-abitudine__tel-light.png — «Salta oggi» con icona ✕ — in Adesso la stessa azione usa ⏭; ✕ suggerisce chiudi/elimina — stessa icona ⏭ ovunque
- [media] giornata-scheda-abitudine__tel-light.png — «Termina l'abitudine» (rosso, distruttiva) inserita tra due azioni neutre — spostarla in fondo, separata
- [bassa] giornata-scheda-abitudine__tel-light.png — gruppo azioni — icone e testi viola su fondo grigio: «Apri l'abitudine» è la navigazione principale ma ha lo stesso peso — mettere «Apri l'abitudine ›» come riga con chevron in cima
- [bassa] giornata-scheda-abitudine__tel-light.png — «Durata 45 min» viola vs «Ora 18:00» nero — come nella scheda attività, colori incoerenti

## giornata-scheda-abitudine__tel-dark.png
- [media] giornata-scheda-abitudine__tel-dark.png — stessi problemi del tema chiaro
- [bassa] giornata-scheda-abitudine__tel-dark.png — «Termina l'abitudine» rosa-salmone su grigio — leggibile ma il rosso perde il carattere di avviso — rosso più saturo

## rituali__tel-light.png
- [media] rituali__tel-light.png — stati a destra — «da fare / 2 di 3» è contraddittorio (2 su 3 cosa? fatti?) e «da compilare / 0 di 4» usa un verbo diverso per lo stesso stato — «2 di 3 passi fatti» / «In corso», un solo lessico (da fare / in corso / fatto)
- [media] rituali__tel-light.png — badge «1» sul tab Rituali (nelle altre schermate) — qui risultano 4 rituali da fare: il numero del badge non corrisponde a nulla di visibile — badge = numero di rituali da fare adesso, o pallino senza numero
- [media] rituali__tel-light.png — icona di «Piano del giorno» viola pieno, le altre lilla chiaro — l'evidenza non è spiegata (consigliato ora? attivo?) — aggiungere etichetta «Adesso» o uniformare
- [bassa] rituali__tel-light.png — metà inferiore vuota — ~370px di spazio senza contenuto — mostrare orario suggerito di ogni rituale o un breve testo guida

## rituali__tel-dark.png
- [media] rituali__tel-dark.png — stessi problemi del tema chiaro (stati ambigui, evidenza icona non spiegata)
- [media] rituali__tel-dark.png — segmento attivo «Rituali» grigio chiaro su grigio scuro — più visibile che altrove ma diverso dallo stile del tema chiaro; testo «da fare» grigio scuro poco leggibile — schiarire testo stato

## rituale-piano__tel-light.png
- [media] rituale-piano__tel-light.png — intestazione «da fare · 2 di 3» — con due priorità elencate non è chiaro cosa sia il terzo elemento (i 3 passi del rituale?) — «Passo 2 di 3» o elenco dei passi visibile
- [media] rituale-piano__tel-light.png — chip «☆ Priorità» solo sulla prima riga — anche «Confrontare piani telefonici» è nell'elenco priorità ma non ha il chip: incoerente — chip su tutte o su nessuna (la sezione dice già che sono priorità)
- [media] rituale-piano__tel-light.png — icone area a destra (persone rosa, portafoglio giallo) — piccole, senza etichetta, colori diversi: rumore visivo non spiegato — nome area in testo secondario sotto il titolo come in «Poi» di Adesso
- [bassa] rituale-piano__tel-light.png — «Salva +5 XP» — gergo «XP» non tradotto/spiegato — «Salva (+5 punti)»
- [bassa] rituale-piano__tel-light.png — etichetta «Quando inizi?» — piccola e grigia, ha meno peso del placeholder — etichetta più marcata, coerente con le altre form
- [bassa] rituale-piano__tel-light.png — accordion — il rituale aperto spinge gli altri in basso e la card diventa lunghissima; manca un'indicazione di chiusura oltre al piccolo ⌃ — ok, ma aumentare l'area di tocco dell'intestazione

## rituale-piano__tel-dark.png
- [media] rituale-piano__tel-dark.png — stessi problemi del tema chiaro
- [bassa] rituale-piano__tel-dark.png — riga barrata «Organizzare cena…» grigio scuro su grigio, quasi illeggibile — accettabile per «fatto», ma alzare leggermente il contrasto

## rituale-sonno-pasti__tel-light.png
- [alta] rituale-sonno-pasti__tel-light.png — due salvataggi — bottone «Salva» per il sonno e un secondo bottone viola principale in fondo (coperto dalla barra di navigazione): non è chiaro cosa salvi ciascuno — un solo «Salva» finale, o salvataggio automatico per sezione con conferma
- [media] rituale-sonno-pasti__tel-light.png — bottone principale in fondo — tagliato dietro la barra di navigazione flottante (si vede solo il bordo viola) — padding inferiore pari all'altezza della barra
- [media] rituale-sonno-pasti__tel-light.png — «Come sempre · 23:30–07:30» in viola a destra — sembra un link ma non è chiaro se sia un'azione (conferma orari abituali) o un'informazione — bottone esplicito «Come sempre (23:30–07:30)» o testo grigio
- [media] rituale-sonno-pasti__tel-light.png — pulsanti «sì / no / ⏰» dei pasti — nessuno stato selezionato visibile, «sì» minuscolo, icona orologio senza etichetta — controllo segmentato con stato attivo chiaro, «Sì/No/Altro orario»
- [media] rituale-sonno-pasti__tel-light.png — righe «A letto 23:30 ⏰», «Sveglia 07:30 ⏰» — i valori non sembrano modificabili (nessun campo), l'icona orologio è l'unica affordance — renderli campi con bordo come nel pannello sonno della giornata
- [bassa] rituale-sonno-pasti__tel-light.png — «Altre cose fatte» dentro «Sonno e pasti» — sezione fuori tema — spostarla nella «Fine giornata» o rinominare
- [bassa] rituale-sonno-pasti__tel-light.png — icona del rituale — sveglia, mentre nella giornata il sonno usa il letto — icona unica per «sonno e pasti»

## rituale-sonno-pasti__tel-dark.png
- [alta] rituale-sonno-pasti__tel-dark.png — doppio salvataggio e bottone tagliato sotto la barra — come tema chiaro
- [media] rituale-sonno-pasti__tel-dark.png — pulsanti «sì/no/⏰» grigio scuro su card grigio scuro: forma dei pulsanti appena percepibile — contrasto maggiore

## rituale-checkin__tel-light.png
- [media] rituale-checkin__tel-light.png — bottone «Registra +3 XP» — lilla chiaro, sembra disabilitato, mentre in «Piano del giorno» il «Salva» è viola pieno: CTA incoerenti tra rituali; inoltre il check-in è già «fatto» ma il bottone dice ancora «Registra» — «Aggiorna» quando già registrato, stesso stile CTA in tutti i rituali (con stato disabilitato esplicito se non ci sono modifiche)
- [bassa] rituale-checkin__tel-light.png — bottone in fondo — parzialmente coperto dalla barra di navigazione flottante — padding inferiore
- [bassa] rituale-checkin__tel-light.png — etichette scala «5 · molto concentrato» — più lunga del bottone, sborda a sinistra rompendo la simmetria con «1 · disperso» — testi più brevi («5 · al top») o etichette solo agli estremi su due righe
- [bassa] rituale-checkin__tel-light.png — tre scale identiche impilate — lunga e ripetitiva; distanza tra «Media recente» e la domanda successiva uguale a quella interna: gruppi poco separati — più spazio (24px) tra le domande o divisori

## rituale-checkin__tel-dark.png
- [media] rituale-checkin__tel-dark.png — bottone «Registra» grigio-viola scuro: sembra disabilitato — come tema chiaro
- [bassa] rituale-checkin__tel-dark.png — bottoni non selezionati: bordo grigio scuro poco visibile — ok ma al limite

## rituale-sera__tel-light.png
- [alta] rituale-sera__tel-light.png — legenda «1 = male · 5 = benissimo» — va a capo spezzando «5» da «= benissimo» (riga 2 inizia con «= benissimo») — legenda su riga propria sotto la domanda, con spazi non separabili tra numero e testo
- [media] rituale-sera__tel-light.png — scale 1–5 per area — piccole (~36px), allineate a destra sotto il nome lasciando vuota la metà sinistra, e di stile diverso dalle scale del Check-in (grandi, bordate, larghezza piena): componente incoerente — riusare lo stesso componente scala del Check-in o mettere nome e scala sulla stessa riga
- [bassa] rituale-sera__tel-light.png — barra di navigazione — copre «Associazioni»/«Progetti Founder»: elenco lungo che spinge il salvataggio molto in basso — considerare scala compatta in linea o raggruppamento
- [bassa] rituale-sera__tel-light.png — nome del rituale — «Fine giornata» qui, ma la descrizione/altre parti parlano di «Review della sera»: verificare coerenza dei nomi in tutta l'app

## rituale-sera__tel-dark.png
- [alta] rituale-sera__tel-dark.png — legenda spezzata «5 / = benissimo» — come tema chiaro
- [media] rituale-sera__tel-dark.png — bottoni 1–5 grigio scuro senza bordo su card scura: poco riconoscibili come pulsanti — aggiungere bordo o fondo più chiaro

## rituale-settimana__tel-light.png
- [alta] rituale-settimana__tel-light.png — statistiche «10 attività fatte · 6/7 giorni attivi» — la vista Settimana dice «4 di 24 fatte questa settimana» e la settimana 17–23 ago è al secondo giorno: 6/7 giorni attivi è impossibile per «questa settimana». Probabilmente sono gli ultimi 7 giorni, ma non è detto — etichetta «ultimi 7 giorni» o allineare il periodo alla settimana di calendario
- [media] rituale-settimana__tel-light.png — textarea — maniglia di ridimensionamento nativa visibile in basso a destra, nessun placeholder — `resize: none` (o auto-altezza) e placeholder d'esempio
- [media] rituale-settimana__tel-light.png — domande senza punto interrogativo («Cosa ti ha bloccato», «Cosa hai imparato») — aggiungere «?»
- [bassa] rituale-settimana__tel-light.png — riga statistiche — allineata a sinistra, senza card, stile diverso dal riquadro statistiche di «Anno» (card centrata con divisori) — riusare lo stesso componente
- [bassa] rituale-settimana__tel-light.png — «XP guadagnati» — gergo — «punti guadagnati»

## rituale-settimana__tel-dark.png
- [alta] rituale-settimana__tel-dark.png — dati incoerenti con la vista Settimana — come tema chiaro
- [media] rituale-settimana__tel-dark.png — textarea con maniglia nativa visibile (grigia) — come tema chiaro

## attivita-sistemare__tel-light.png
- [alta] attivita-sistemare__tel-light.png — selettore area «Altro / Esplorazione ⌄» — select nativo non stilizzato (chevron di sistema, fondo grigio, altezza diversa dai bottoni) — componente selettore dell'app (chip area come nelle schede)
- [media] attivita-sistemare__tel-light.png — bottoni «Oggi / Da fare / Scarta» — «Oggi» e «Da fare» come verbi d'azione sono ambigui (sono destinazioni) — «Fai oggi», «Metti in Da fare», «Scarta»
- [media] attivita-sistemare__tel-light.png — «In coda» — voci in testo semplice senza card né affordance: non si capisce se siano tappabili; «e un'altra» in corsivo è un'etichetta morta — righe tappabili con chevron o testo esplicito «Le vedrai una alla volta»
- [bassa] attivita-sistemare__tel-light.png — etichetta «☐ Da sistemare» sopra la card — ripete il nome del tab appena selezionato — rimuoverla o sostituirla con «1 di 6»
- [bassa] attivita-sistemare__tel-light.png — «aggiunta 18 ago, 10:30» — accanto al select, grigio piccolo, schiacciato — spostarlo sotto il titolo
- [bassa] attivita-sistemare__tel-light.png — metà inferiore vuota — ~270px liberi — accettabile

## attivita-sistemare__tel-dark.png
- [alta] attivita-sistemare__tel-dark.png — select nativo non stilizzato — come tema chiaro
- [media] attivita-sistemare__tel-dark.png — badge «6/9/3» sui tab grigio scuro — contrasto basso; segmento attivo grigio medio poco distinto — come altre schermate dark
- [bassa] attivita-sistemare__tel-dark.png — voci «In coda» grigio chiaro: ok; «e un'altra» grigio scuro quasi illeggibile — schiarire

## attivita-dafare__tel-light.png
- [media] attivita-dafare__tel-light.png — titoli attività — vanno a capo a metà («Leggere il libro di / esercizi di Analisi 1») pur avendo ~80px liberi prima del bottone: la colonna titolo è limitata dalla colonna «1 di 3» riservata anche dove è vuota — colonna progresso solo quando presente, titolo a larghezza piena
- [media] attivita-dafare__tel-light.png — «1 di 3», «1 di 4» — numeri senza etichetta — «1/3 passi» o mini barra
- [media] attivita-dafare__tel-light.png — primo «+ Oggi» viola pieno, gli altri lilla — evidenza non spiegata (è il suggerito? è già in oggi?) — se è stato, usare «✓ In oggi»; altrimenti uniformare
- [media] attivita-dafare__tel-light.png — badge «6» su «Attività» nella barra in basso — corrisponde a «Da sistemare», non alle 9 «Da fare» mostrate: ambiguo — badge solo per elementi da sistemare con significato chiaro (pallino) o tooltip
- [bassa] attivita-dafare__tel-light.png — filtro «Tutte ⌄» — chip alto quanto un bottone e appiccicato a «Importanti» (8px) — ridurre e dare 16px di respiro
- [bassa] attivita-dafare__tel-light.png — icone area a sinistra (libro blu, razzo arancio, valigetta, cuore verde, lampadina rossa) — senza etichetta, piccole — nome area in testo secondario come in Adesso

## attivita-dafare__tel-dark.png
- [media] attivita-dafare__tel-dark.png — stessi problemi del tema chiaro
- [bassa] attivita-dafare__tel-dark.png — bottoni «+ Oggi» grigio-viola scuro: contrasto testo/fondo basso — schiarire testo

## attivita-dafare-aggiunta__tel-light.png
- [alta] attivita-dafare-aggiunta__tel-light.png — selettore area «Altro / Esplorazione ⌄» — select nativo non stilizzato, testo più piccolo e chevron di sistema; stile diverso dai chip «Oggi/Domani/Senza data» appena sopra — chip area coerenti
- [media] attivita-dafare-aggiunta__tel-light.png — opzioni sotto il campo — rientrate di 12px rispetto al campo e al resto della pagina (margine sinistro 28px vs 16px) — allineare al bordo del campo
- [media] attivita-dafare-aggiunta__tel-light.png — opzioni senza etichetta — non è detto che «Oggi/Domani/Senza data» sia «Quando» e il select sia «Area» — mini etichette o icone (📅, 🏷)
- [bassa] attivita-dafare-aggiunta__tel-light.png — filtro «Tutte» subito sotto le opzioni — si confonde con le opzioni della nuova attività — separare con un divisore o più spazio
- [bassa] attivita-dafare-aggiunta__tel-light.png — stesse note di «attivita-dafare» (titoli a capo, «1 di 3» senza etichetta, primo «+ Oggi» diverso)

## attivita-dafare-aggiunta__tel-dark.png
- [alta] attivita-dafare-aggiunta__tel-dark.png — select nativo non stilizzato — come tema chiaro
- [media] attivita-dafare-aggiunta__tel-dark.png — chip «Oggi/Domani» non selezionati: bordo grigio scuro poco visibile — bordo più chiaro

## attivita-abitudini__tel-light.png
- [media] attivita-abitudini__tel-light.png — badge sui tab — «6» su Da sistemare = cose da gestire, «9» su Da fare e «3» su Abitudini = totali: stessi badge con significati diversi — badge solo dove serve un'azione, o conteggi in testo grigio non a badge
- [media] attivita-abitudini__tel-light.png — riepilogo «0 di 3 oggi» — in Adesso lo stesso giorno mostra «1 di 2»: due contatori diversi per «oggi» senza spiegare cosa contano — «Abitudini di oggi: 0 di 3» e in Adesso «Cose di oggi: 1 di 2»
- [bassa] attivita-abitudini__tel-light.png — anello grande vuoto a sinistra — a 0 è solo un cerchio grigio che sembra un placeholder/caricamento — mostrare la traccia con etichetta o ridurre
- [bassa] attivita-abitudini__tel-light.png — «🔥3» solo sulla prima abitudine — numero senza etichetta («3 giorni di fila») — testo «3 di fila»
- [bassa] attivita-abitudini__tel-light.png — cerchi di completamento verdi/blu — colore dato dall'area ma non spiegato, sembra stato diverso — cerchio neutro, colore area solo nell'icona
- [bassa] attivita-abitudini__tel-light.png — metà inferiore vuota — accettabile

## attivita-abitudini__tel-dark.png
- [media] attivita-abitudini__tel-dark.png — stessi problemi del tema chiaro
- [bassa] attivita-abitudini__tel-dark.png — anello grande grigio scuro su nero quasi invisibile; cerchio blu di «Ripasso flashcard» spento — schiarire

## attivita-abitudini-nuova__tel-light.png
- [media] attivita-abitudini-nuova__tel-light.png — opzioni nuova abitudine — elenco a righe (Giorni/Ora/Area) con pillole, mentre la nuova attività in «Da fare» usa chip sciolti + select nativo: due form di creazione con componenti diversi — uniformare (questa versione è migliore: riusarla per le attività)
- [media] attivita-abitudini-nuova__tel-light.png — giorni L–D tutti viola pieni — non si vede lo stato «non selezionato», l'utente non capisce che si possono togliere — mostrare lo stile spento al primo tocco o hint «tocca per togliere»
- [bassa] attivita-abitudini-nuova__tel-light.png — «Ora: Nessuna» — pillola grigia che sembra disabilitata — «Aggiungi ora» con stile tappabile
- [bassa] attivita-abitudini-nuova__tel-light.png — riga «Giorni … Ogni giorno» — il riepilogo a destra ripete l'informazione dei cerchi sotto — ok, ma allineare il testo a destra con le pillole sotto (ora rientrato diversamente)

## attivita-abitudini-nuova__tel-dark.png
- [media] attivita-abitudini-nuova__tel-dark.png — stessi problemi del tema chiaro
- [bassa] attivita-abitudini-nuova__tel-dark.png — «Nessuna» grigio su grigio scuro: sembra disabilitato e poco leggibile

## scheda-attivita__tel-light.png
- [media] scheda-attivita__tel-light.png — «Distribuisci i passi» — significato poco chiaro (pianifica un passo ogni N giorni?) e chip in minuscolo «ogni giorno» mentre i chip «Pianifica» sono in maiuscola «Domani»; chip bianchi su grigio invece che grigi su bianco: stile diverso per lo stesso componente — «Pianifica un passo: ogni giorno / ogni 2 giorni / ogni settimana», stessa maiuscola e stile dei chip sopra
- [media] scheda-attivita__tel-light.png — icone calendario e cestino su ogni passo — piccole (~14px), vicine tra loro (~30px), rischio di tocco su «elimina» — target 44px, eliminazione con swipe o conferma/annulla
- [bassa] scheda-attivita__tel-light.png — «+ Aggiungi un passo… / Aggiungi» — doppio «aggiungi» (icona + e link) — tenere solo uno
- [bassa] scheda-attivita__tel-light.png — badge «1 di 3» accanto a «Passi» — chip grigio piccolo; ok ma formato diverso dalla lista Da fare (testo semplice) — uniformare
- [bassa] scheda-attivita__tel-light.png — foglio senza pulsante chiudi — solo maniglia — aggiungere ✕
- [bassa] scheda-attivita__tel-light.png — cerchi dei passi da 42px molto più grandi delle icone a destra — sproporzionati — 28–32px

## scheda-attivita__tel-dark.png
- [media] scheda-attivita__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scheda-attivita__tel-dark.png — cerchi dei passi non fatti: riempimento nero con bordo grigio scuro, sembrano buchi — fondo uguale alla card, bordo più chiaro

## scheda-attivita-fondo__tel-light.png
- [media] scheda-attivita-fondo__tel-light.png — titolo fisso del foglio — il contenuto scorre sotto con taglio netto (si vede lo spicchio del cerchio del passo precedente sotto il titolo), senza ombra o divisore — aggiungere divisore/ombra alla testata fissa
- [media] scheda-attivita-fondo__tel-light.png — riga «Area: Studio / Università ⌄» — chevron giù (select nativo?) mentre «Scadenza: nessuna ›» usa chevron destro: due affordance diverse nella stessa lista — stesso comportamento (foglio di scelta) e stesso chevron ›
- [media] scheda-attivita-fondo__tel-light.png — «Non ce l'ho fatta ›» — azione ambigua (segna come fallita? rimanda? chiede motivo?) — «Rimanda / non fatta oggi…» con sottotitolo esplicativo
- [media] scheda-attivita-fondo__tel-light.png — «Fissa in alto» — l'attività appare nella sezione «Importanti» della lista, ma qui l'interruttore è spento e si chiama diversamente: non si capisce come si diventi «Importante» — un solo concetto e nome («Importante»), con stato coerente
- [bassa] scheda-attivita-fondo__tel-light.png — «nessuna» minuscolo come valore — «Nessuna»
- [bassa] scheda-attivita-fondo__tel-light.png — «Elimina» rosso nello stesso gruppo di azioni neutre — separarlo in un gruppo a sé

## scheda-attivita-fondo__tel-dark.png
- [media] scheda-attivita-fondo__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scheda-attivita-fondo__tel-dark.png — interruttore spento: pomello grigio su binario grigio scuro, poco leggibile — pomello bianco

## scheda-abitudine__tel-light.png
- [media] scheda-abitudine__tel-light.png — mini-calendario — nessun nome del mese (mostra 27–31 luglio + agosto) e nessuna legenda: grigio pieno = mancata? programmata? — intestazione «Agosto» e legenda «● fatta ● mancata ○ oggi»
- [media] scheda-abitudine__tel-light.png — giorni mancati (29, 30, 31, 3, 4, 5, 12) — grigio chiaro identico al fondo di «oggi» (18): mancato e oggi si confondono — mancato con contorno tratteggiato o tinta rossa tenue
- [media] scheda-abitudine__tel-light.png — riga «Ora 18:00 ✕» — qui la ✕ è fuori dalla pillola, nella scheda del calendario è dentro: stesso controllo con layout diverso — uniformare
- [bassa] scheda-abitudine__tel-light.png — «Durata 45 min» viola, «Ora 18:00» nero — colori incoerenti (come altrove)
- [bassa] scheda-abitudine__tel-light.png — «lun–ven · 18:00» accanto al chip area — abbreviazioni minuscole con trattino lungo; ok ma il chip verde e il testo grigio non sono allineati in altezza — centrare verticalmente
- [bassa] scheda-abitudine__tel-light.png — riquadro statistiche «3 di fila · 4 record · 7 in tutto» — «4 record» ambiguo — «record: 4 di fila», «7 volte in tutto»

## scheda-abitudine__tel-dark.png
- [media] scheda-abitudine__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scheda-abitudine__tel-dark.png — cerchi S/D non selezionati con riempimento nero su card grigia: sembrano buchi — fondo trasparente

## scheda-abitudine-fondo__tel-light.png
- [media] scheda-abitudine-fondo__tel-light.png — «Elimina» — qui bottone isolato centrato in card propria, nella scheda attività è una riga nell'elenco azioni con icona cestino: stesso comando con due componenti — uniformare (bottone isolato in fondo va bene: applicarlo anche alle attività)
- [media] scheda-abitudine-fondo__tel-light.png — «Inizio 29 lug 2026», «Fine Mai» — testo semplice senza pillola né chevron: non si capisce se sono modificabili, mentre «Area» ha la pillola — stessa affordance per tutti i valori modificabili
- [bassa] scheda-abitudine-fondo__tel-light.png — testata fissa — sotto il divisore spuntano metà cerchi della riga precedente del calendario — leggera dissolvenza sotto la testata
- [bassa] scheda-abitudine-fondo__tel-light.png — manca «Termina l'abitudine» presente nella scheda aperta dal calendario: azioni diverse a seconda del punto d'ingresso — stesso set di azioni

## scheda-abitudine-fondo__tel-dark.png
- [media] scheda-abitudine-fondo__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scheda-abitudine-fondo__tel-dark.png — «Fine: Mai» grigio scuro, poco leggibile — schiarire

## andamento__tel-light.png
- [alta] andamento__tel-light.png — prima card — «🔥 38» e «65% · 81 di 124» sono numeri grandi senza etichetta (38 cosa? 65% di cosa, in che periodo?) — «38 giorni di fila», «65% fatto · 81 di 124 negli ultimi 30 giorni»
- [alta] andamento__tel-light.png — striscia settimanale — Venerdì è vuoto (non fatto) eppure la serie è 38 giorni: contraddizione apparente — spiegare la regola (es. «1 giorno di pausa concesso») o mostrare il venerdì come «giorno libero» con stile diverso
- [media] andamento__tel-light.png — «Costanza» — la griglia occupa ~60% della larghezza lasciando vuota la destra, senza etichette di giorni né mesi; le prime colonne sono sfalsate — griglia a piena larghezza con etichette L/M/V e mesi
- [media] andamento__tel-light.png — mappa «Costanza» blu, anelli del Mese verdi, quadrati settimana verdi: tre codifiche colore per il concetto «fatto» — una sola scala colore
- [bassa] andamento__tel-light.png — «Per area» — ultima riga «Progetti Founder 100% 12/12» tagliata sotto la barra di navigazione; icona ⊕ della card non significativa — padding inferiore; icona coerente
- [bassa] andamento__tel-light.png — percentuali per area — ordinate in crescendo senza dirlo; periodo non indicato — sottotitolo «ultimi 30 giorni, dal più basso»

## andamento__tel-dark.png
- [alta] andamento__tel-dark.png — numeri senza etichetta e serie/venerdì contraddittori — come tema chiaro
- [media] andamento__tel-dark.png — scala «Costanza» invertita rispetto al tema chiaro (in dark «più» è azzurro chiaro, in chiaro è blu scuro) e celle vuote grigio scuro quasi invisibili — scala coerente e celle vuote più visibili
- [media] andamento__tel-dark.png — segmento attivo «Riepilogo» grigio su grigio — contrasto basso (come altrove)

## andamento-fondo__tel-light.png
- [media] andamento-fondo__tel-light.png — elenco link «Riflessioni passate / Sessioni del timer / Aree / Grafici» — «Aree» duplica Profilo › Aree e «Riflessioni passate» sembra lo stesso contenuto di Profilo › Diario con un altro nome — un solo punto d'accesso o stesso nome
- [bassa] andamento-fondo__tel-light.png — «Riflessioni passate 79» — unico link con conteggio; gli altri senza — ok, ma il numero grigio senza unità — «79 voci»
- [bassa] andamento-fondo__tel-light.png — icona ⊕ usata sia per «Per area» sia per «Aree»; ⊕ evoca «aggiungi/mirino» — icona dedicata alle aree
- [bassa] andamento-fondo__tel-light.png — barra «Altro / Esplorazione» rossa — stesso rosso del pericolo («Elimina», «Scarta»): letta come allarme — tinta area non rossa
- [bassa] andamento-fondo__tel-light.png — riga di card tagliata in alto con «meno ▢▢▢ più» orfano — normale da scorrimento, nessuna azione

## andamento-fondo__tel-dark.png
- [media] andamento-fondo__tel-dark.png — stessi problemi del tema chiaro
- [bassa] andamento-fondo__tel-dark.png — tracce delle barre grigio scuro su card scura poco visibili — schiarire la traccia

## scoperte__tel-light.png
- [media] scoperte__tel-light.png — titoli delle scoperte — vanno a capo presto («Mettere il telefono / in un'altra stanza») lasciando ~70px liberi prima del chevron: larghezza massima del testo troppo stretta — titolo a larghezza piena
- [media] scoperte__tel-light.png — «misurato», «lo noto ogni volta», «notato una volta» — livello di prova in minuscolo senza etichetta, sembra testo casuale — «Prova: misurata / ricorrente / una volta» con chip o icona a livelli
- [bassa] scoperte__tel-light.png — riquadri pollice su ogni riga — ripetono l'informazione dell'intestazione «Funziona/Non funziona», occupano 56px di larghezza — rimuoverli o sostituirli con l'icona area
- [bassa] scoperte__tel-light.png — sotto-tab «Registro 8 / Esperimenti 2» — icona sopra e conteggio in linea, stile diverso dai sotto-tab della Giornata (icona sopra, niente conteggi) — uniformare
- [bassa] scoperte__tel-light.png — icona pollice per il tab «Scoperte» — non evoca «scoperta» — lampadina o lente
- [bassa] scoperte__tel-light.png — ultima riga tagliata sotto la barra in basso — padding inferiore

## scoperte__tel-dark.png
- [media] scoperte__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scoperte__tel-dark.png — riquadri pollice verde/rosso molto scuri, icone poco leggibili — schiarire

## scoperte-esperimenti__tel-light.png
- [alta] scoperte-esperimenti__tel-light.png — grafico — le etichette «media 3,1» e «media 4,3» sono sovrapposte ai punti dati e alla linea tratteggiata (il «3,1» è attraversato dalla linea e da un punto) — spostare le etichette sopra/fuori dall'area dei dati con fondo pieno, o in legenda
- [media] scoperte-esperimenti__tel-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» — con bordo come i bottoni: sembrano tappabili ma sono stati/metadati — chip senza bordo, fondo tenue; «Concluso» maiuscolo
- [media] scoperte-esperimenti__tel-light.png — asse X senza date/giorni e asse Y con solo 1-3-5 — impossibile leggere la durata dei periodi — etichette data inizio/cambio/fine
- [bassa] scoperte-esperimenti__tel-light.png — testo introduttivo — paragrafo esplicativo sempre visibile sopra «Nuovo esperimento», spinge i contenuti in basso — renderlo comprimibile o mostrarlo solo senza esperimenti
- [bassa] scoperte-esperimenti__tel-light.png — riquadro conclusione in fondo coperto dalla barra di navigazione — padding inferiore

## scoperte-esperimenti__tel-dark.png
- [alta] scoperte-esperimenti__tel-dark.png — etichette medie sovrapposte ai dati — come tema chiaro
- [media] scoperte-esperimenti__tel-dark.png — linea «media 3,1» grigia tratteggiata e punti grigi su fondo scuro: periodo base poco leggibile — schiarire

## scheda-scoperta__tel-light.png
- [media] scheda-scoperta__tel-light.png — campo «Cosa hai capito» — maniglia di ridimensionamento nativa visibile — `resize: none` / auto-altezza
- [media] scheda-scoperta__tel-light.png — chip non selezionati — «notato una volta» grigio su bianco, «non funziona» bianco su grigio: due stili di «non selezionato» nello stesso foglio — uno stile unico
- [bassa] scheda-scoperta__tel-light.png — chip in minuscolo («misurato», «funziona», «non funziona») mentre i chip altrove sono in maiuscola («Domani», «Oggi») — iniziale maiuscola
- [bassa] scheda-scoperta__tel-light.png — «Quanto ne sei sicuro» senza «?» — «Quanto ne sei sicuro?»
- [bassa] scheda-scoperta__tel-light.png — «Provalo con un esperimento» proposto anche se la scoperta è già «misurato» — nasconderlo o mostrarlo come «Vedi esperimento»
- [bassa] scheda-scoperta__tel-light.png — titolo generico «Una cosa che hai capito» — il foglio non mostra a colpo d'occhio di quale scoperta si tratta (è solo nel campo) — titolo = testo della scoperta, «Modifica scoperta» come sopratitolo
- [bassa] scheda-scoperta__tel-light.png — «Area» con chevron giù (select) e «Aggiunta 20 lug» in testo: incoerente con le schede attività/abitudine (pillola) — uniformare

## scheda-scoperta__tel-dark.png
- [media] scheda-scoperta__tel-dark.png — stessi problemi del tema chiaro
- [bassa] scheda-scoperta__tel-dark.png — divisori tra le righe (Area/Aggiunta, Provalo/Elimina) assenti o invisibili in dark, mentre ci sono in chiaro — divisori con contrasto sufficiente
- [bassa] scheda-scoperta__tel-dark.png — «non funziona» con fondo nero su card grigia: sembra un buco — fondo coerente

## profilo__tel-light.png
- [alta] profilo__tel-light.png — navigazione — nessun pulsante «indietro»/chiudi e nessuna voce attiva nella barra in basso: l'utente non sa dove si trova né come tornare (si arriva dall'avatar) — testata con «‹ Indietro» o titolo «Profilo» + ✕
- [media] profilo__tel-light.png — «Promemoria: bloccati» — stato critico (permesso notifiche negato?) mostrato come testo grigio neutro — badge di avviso arancio e testo «Notifiche bloccate dal browser»
- [media] profilo__tel-light.png — statistiche — «fatte negli ultimi 30 giorni» va su due righe e arriva a 8px dal bordo della card; le tre etichette hanno lunghezze molto diverse — etichette più corte («ultimi 30 gg») e padding laterale
- [bassa] profilo__tel-light.png — avatar «R» quadrato arrotondato qui, circolare nella testata delle altre schermate — stessa forma
- [bassa] profilo__tel-light.png — riquadro statistiche — qui chiarisce che 65% è «ultimi 30 giorni», ma in Andamento lo stesso 65% è senza etichetta — riportare l'etichetta anche lì
- [bassa] profilo__tel-light.png — metà inferiore vuota — accettabile

## profilo__tel-dark.png
- [alta] profilo__tel-dark.png — nessun «indietro» né voce attiva — come tema chiaro
- [media] profilo__tel-dark.png — «bloccati» grigio scuro poco visibile per uno stato d'errore — come tema chiaro

## impostazioni__tel-light.png
- [media] impostazioni__tel-light.png — secondo gruppo (Area predefinita, Timer, Musica, Aspetto) — senza intestazione, sembra far parte di «Account» — intestazione «Preferenze»
- [media] impostazioni__tel-light.png — valori — «Automatica» maiuscola con chevron giù (select), «chiedi sempre / nessuna / automatico» minuscoli con ›: maiuscole e affordance incoerenti nello stesso gruppo — tutti con iniziale maiuscola e stesso tipo di controllo
- [media] impostazioni__tel-light.png — «Sincronizzazione: su questo dispositivo» — nessun chevron e testo che arriva al bordo destro (non allineato con i valori sotto che lasciano spazio al ›); non è chiaro se sia tappabile — allineare e, se informativo, testo «Solo su questo dispositivo»
- [media] impostazioni__tel-light.png — «Backup e ripristino 1» — numero senza etichetta — «1 backup» o data dell'ultimo
- [bassa] impostazioni__tel-light.png — «Esporta dati», «Importa dati» — nessun chevron né indicazione di cosa succede (scarica file? apre selettore?) — sottotitolo «File .json»
- [bassa] impostazioni__tel-light.png — «Su cosa si basa» — titolo vago — «Il metodo dietro l'app» / «Fonti scientifiche»
- [bassa] impostazioni__tel-light.png — foglio senza ✕ di chiusura — aggiungere

## impostazioni__tel-dark.png
- [media] impostazioni__tel-dark.png — stessi problemi del tema chiaro
- [bassa] impostazioni__tel-dark.png — divisori tra le righe dei gruppi invisibili in dark (presenti in chiaro) — divisori con contrasto sufficiente

## impostazioni-fondo__tel-light.png
- [bassa] impostazioni-fondo__tel-light.png — «Registro tecnico» in «Guida» — è uno strumento di debug, non una guida — spostarlo in una sezione «Avanzate»
- [bassa] impostazioni-fondo__tel-light.png — «Rimuovi dati di esempio» — senza spiegazione (quali dati? sono quelli che vedo?) né conteggio — sottotitolo «Toglie le attività di prova caricate all'inizio»
- [bassa] impostazioni-fondo__tel-light.png — fondo del foglio — l'ultima card arriva a ~30px dal bordo inferiore senza area sicura per la barra gesti — aggiungere padding (env(safe-area-inset-bottom))
- [bassa] impostazioni-fondo__tel-light.png — gruppo «Reimposta» — le due azioni sono card separate (giusto per «Cancella tutti i dati»), ma «Rimuovi dati di esempio» non ha chevron né stile d'azione — ok, valutare coerenza

## impostazioni-fondo__tel-dark.png
- [bassa] impostazioni-fondo__tel-dark.png — stessi punti del tema chiaro; divisori interni quasi invisibili

## imp-timer__tel-light.png
- [media] imp-timer__tel-light.png — «Se prosegui, altri» — italiano innaturale e incomprensibile da solo — «Se continui, aggiungi» / «Estensione dopo l'avvio rapido»
- [media] imp-timer__tel-light.png — altezza del foglio — la sottopagina Timer parte a y≈150 mentre Impostazioni parte a y≈85: il foglio «salta» di altezza navigando — altezza fissa del foglio tra pagina e sottopagina
- [media] imp-timer__tel-light.png — etichette righe in peso normale qui, in grassetto in Impostazioni; valori come pillole viola qui, come testo grigio + › in Impostazioni: due stili di lista impostazioni — uniformare
- [bassa] imp-timer__tel-light.png — «Avvio rapido» vs «Sessione» — differenza non spiegata — sottotitolo di una riga per sezione
- [bassa] imp-timer__tel-light.png — «Pausa lunga dopo 4 blocchi: Nessuna» — etichetta lunga che sfiora la pillola; «Nessuna» ambiguo — «Pausa lunga (ogni 4): Nessuna/15 min»
- [bassa] imp-timer__tel-light.png — «‹ Impostazioni» piccolo (12px) sopra il titolo — area di tocco ridotta — target 44px

## imp-timer__tel-dark.png
- [media] imp-timer__tel-dark.png — stessi problemi del tema chiaro

## imp-musica__tel-light.png
- [alta] imp-musica__tel-light.png — campi «Incolla il link» — fondo quasi identico alla card e nessun bordo: in tema chiaro i campi sono praticamente invisibili, si legge solo il placeholder — bordo 1px o fondo bianco
- [media] imp-musica__tel-light.png — nessuna spiegazione di quale link incollare (Spotify? YouTube? playlist?) né cosa succede — riga introduttiva «Incolla il link di una playlist (Spotify, YouTube Music…)»
- [media] imp-musica__tel-light.png — 8 campi identici per area — lista lunghissima e ripetitiva — righe compatte «Studio / Università — Nessuna ›» che aprono il campo solo al tocco
- [bassa] imp-musica__tel-light.png — prima card subito sotto il titolo, senza intestazione di sezione (le altre hanno «Per area») e con 8px di stacco — intestazione «Predefinita» come sezione e 16px di spazio
- [bassa] imp-musica__tel-light.png — altezza del foglio diversa dalla sottopagina Timer (qui parte da y≈85, lì da y≈150) — altezza costante

## imp-musica__tel-dark.png
- [media] imp-musica__tel-dark.png — campi visibili (fondo più chiaro) ma senza bordo; stessi problemi di lunghezza e spiegazione del tema chiaro
- [bassa] imp-musica__tel-dark.png — interruttore spento grigio su grigio — pomello bianco

## imp-aspetto__tel-light.png
- [media] imp-aspetto__tel-light.png — altezza del foglio — terza altezza diversa per le sottopagine (qui parte a y≈450): navigando tra Impostazioni › Timer/Musica/Aspetto il foglio cambia dimensione ogni volta — altezza fissa o animazione coerente
- [media] imp-aspetto__tel-light.png — «Suoni» e «Vibrazione» dentro «Aspetto» — non sono aspetto — rinominare la voce «Aspetto e feedback» o spostarle in «Suoni e vibrazione»
- [bassa] imp-aspetto__tel-light.png — «Auto» qui, «automatico» nell'elenco Impostazioni — stessa parola ovunque («Automatico»)
- [bassa] imp-aspetto__tel-light.png — controllo «Tema» dentro una card con etichetta «Tema» e poi interruttori senza intestazione — separare in due gruppi con intestazione

## imp-aspetto__tel-dark.png
- [media] imp-aspetto__tel-dark.png — segmento attivo «Auto» grigio medio su grigio scuro — stato selezionato poco evidente (stesso problema di tutti i controlli segmentati in dark)
- [media] imp-aspetto__tel-dark.png — stessi problemi del tema chiaro

## aree__tel-light.png
- [media] aree__tel-light.png — interruttori — nessuna spiegazione di cosa significhi spegnere un'area (nascondere? archiviare? escludere dalle statistiche?) — intestazione colonna «Attiva» o sottotitolo
- [media] aree__tel-light.png — cestino accanto all'interruttore — azione distruttiva piccola (~14px) a 30px dall'interruttore: rischio di tocco errato — spostare l'eliminazione dentro il dettaglio dell'area o swipe
- [bassa] aree__tel-light.png — nessuna affordance per rinominare o cambiare colore/icona dell'area — riga tappabile con › verso il dettaglio
- [bassa] aree__tel-light.png — campo «Nome» — placeholder in grassetto grigio, sembra un'etichetta; icona libro predefinita senza indicazione che è sceglibile — placeholder normale «Nome della nuova area», icona tappabile con hint
- [bassa] aree__tel-light.png — titolo «Le tue aree» qui, «Aree» nel Profilo — piccolo disallineamento di naming, accettabile

## aree__tel-dark.png
- [media] aree__tel-dark.png — stessi problemi del tema chiaro
- [bassa] aree__tel-dark.png — riquadri icona area con fondi scuri molto spenti (marrone, verde scuro) — icone poco leggibili — fondi un po' più chiari

## sonno-pasti__tel-light.png
- [alta] sonno-pasti__tel-light.png — editor dei pasti — qui pillole viola per orario e durata + ✕ per rimuovere; nel pannello «sonno e pasti» della Giornata lo stesso editor usa input bordati, select nativi e cestino: stesso dato con due interfacce diverse — un unico componente (questo, che è più curato)
- [media] sonno-pasti__tel-light.png — orari nelle pillole allineati a destra («08:00» attaccato al bordo destro) mentre le durate sono centrate — allineamento uniforme (centrato)
- [media] sonno-pasti__tel-light.png — «Promemoria nell'app › Sonno › Dalle 05:00 alle 14:00» — non si capisce cosa sia questa finestra (quando chiedere com'è andato il sonno?) — testo esplicativo «Ti chiede del sonno tra le 05:00 e le 14:00»
- [bassa] sonno-pasti__tel-light.png — «Durata 8h» — calcolato ma con stile da riga modificabile, «8h» senza spazio (altrove «8 h»/«1 h 30») — testo grigio non interattivo e formato coerente «8 h»
- [bassa] sonno-pasti__tel-light.png — ✕ di rimozione pasto — grigio piccolo, ✕ qui e cestino altrove per la stessa azione — icona coerente

## sonno-pasti__tel-dark.png
- [alta] sonno-pasti__tel-dark.png — editor pasti diverso da quello della Giornata — come tema chiaro
- [bassa] sonno-pasti__tel-dark.png — pillole orario grigio scuro (non viola come le durate): in dark l'orario sembra non modificabile — stessa tinta

## promemoria__tel-light.png
- [alta] promemoria__tel-light.png — interruttori disabilitati — grigi ma con il pomello a destra (posizione «acceso»): non si capisce se il promemoria è attivo e solo bloccato o spento — mostrare la posizione reale con opacità ridotta, o pomello a sinistra se spento
- [media] promemoria__tel-light.png — banner «Notifiche bloccate» — «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» italiano faticoso; nessuna azione — «Per riattivarle apri le impostazioni del browser › Notifiche › questo sito» + bottone «Come fare»
- [media] promemoria__tel-light.png — «Non disturbare: Attivo» — resta pienamente attivo e colorato mentre tutte le notifiche sono bloccate: incoerente — disabilitarlo insieme al resto
- [bassa] promemoria__tel-light.png — «Priorità del giorno» — nome che non corrisponde a nessun rituale (i rituali sono Piano del giorno, Check-in, Fine giornata…) — allineare i nomi
- [bassa] promemoria__tel-light.png — riga «Dalle 23:00 alle 07:00» rientrata di 16px rispetto ad «Attivo» — allineare al margine o usare un'etichetta di sottogruppo

## promemoria__tel-dark.png
- [alta] promemoria__tel-dark.png — interruttori disabilitati con pomello grigio a destra — come tema chiaro
- [bassa] promemoria__tel-dark.png — banner marrone scuro con testo chiaro: leggibile; icona campana grigia su cerchio grigio poco visibile — schiarire

## diario__tel-light.png
- [alta] diario__tel-light.png — voce «Completata · Organizzare cena…» — contiene un select nativo «Relazioni & Sociale ⌄» non stilizzato, piazzato in mezzo al registro: controllo di modifica fuori contesto e con stile di sistema — rimuoverlo dal diario (la modifica area sta nella scheda) o chip stilizzato
- [media] diario__tel-light.png — colonna testo stretta — icona ↺ e orario occupano ~110px a destra: i testi vanno a capo ogni 2–3 parole e «Check-in · energia 4 · focus / 5 · umore 5» spezza numero e etichetta — orario sotto il testo in piccolo, ↺ solo in menu/swipe, spazi non separabili tra etichetta e valore
- [media] diario__tel-light.png — icona ↺ su ogni voce — significato non spiegato (annulla? ripristina?) e azione potenzialmente distruttiva a portata di tocco — etichetta «Annulla» o spostare nel menu della voce
- [media] diario__tel-light.png — navigazione — Diario è una pagina piena con «‹ Profilo», mentre le altre voci del Profilo (Aree, Sonno e pasti, Promemoria, Impostazioni) sono fogli; inoltre la barra in basso evidenzia «Andamento» pur venendo dal Profilo — stesso modello di navigazione e voce attiva coerente
- [bassa] diario__tel-light.png — controllo «Cose importanti / Tutto» — non a piena larghezza, allineato a sinistra dentro la card: diverso da tutti gli altri controlli segmentati — larghezza piena
- [bassa] diario__tel-light.png — «Annotato ·» ripetuto su quasi ogni riga — rumore — raggruppare o usare solo l'icona
- [bassa] diario__tel-light.png — «Priorità» su riga isolata dopo le icone ☆ — sembra un'etichetta orfana — chip «☆ Priorità» come nel rituale

## diario__tel-dark.png
- [alta] diario__tel-dark.png — select nativo nel registro — come tema chiaro
- [media] diario__tel-dark.png — stessi problemi del tema chiaro
- [bassa] diario__tel-dark.png — segmento «Cose importanti» grigio medio su grigio — contrasto basso

## timer-scelta__tel-light.png
- [media] timer-scelta__tel-light.png — riquadri icona con bordo — 42px in righe da 52px: quasi toccano i divisori e sembrano checkbox/bottoni separati — icone senza bordo o righe più alte (60px)
- [media] timer-scelta__tel-light.png — icona «Pomodoro» ↻ — è la stessa icona usata per le abitudini in tutta l'app: ambiguità — icona pomodoro/cicli distinta
- [bassa] timer-scelta__tel-light.png — nessun chevron o hint che la riga avvia subito il timer — aggiungere ▷ a destra o sottotitolo «Tocca per avviare»
- [bassa] timer-scelta__tel-light.png — non indica per quale attività parte il timer (Ripasso flashcard) — sottotitolo «per: Ripasso flashcard»
- [bassa] timer-scelta__tel-light.png — «nessun limite» minuscolo vs «5 min» — ok; valutare «Libero»

## timer-scelta__tel-dark.png
- [media] timer-scelta__tel-dark.png — stessi problemi del tema chiaro
- [bassa] timer-scelta__tel-dark.png — riquadri icona con fondo nero su card grigia — sembrano buchi — fondo coerente

## timer-concentrazione__tel-light.png
- [media] timer-concentrazione__tel-light.png — tema chiaro — lo schermo resta scuro (scelta voluta per la concentrazione?) ma il bottone «Pausa» usa la tinta lilla chiaro del tema chiaro, stridente sul nero — se lo schermo è sempre scuro, usare i colori del tema scuro anche per i bottoni (come nello screenshot dark)
- [media] timer-concentrazione__tel-light.png — «✕» in alto e «Termina sessione» — due uscite senza differenza chiara (✕ riduce? annulla? termina?) — etichettare ✕ «Riduci» o rimuovere una delle due
- [media] timer-concentrazione__tel-light.png — icone — «Termina sessione» usa il calendario-✕ di «Termina l'abitudine», «Cambia timer» usa ↻ (icona abitudine/pomodoro) — icone dedicate (■ stop, ⇄ cambia)
- [bassa] timer-concentrazione__tel-light.png — «Pomodoro · blocco 1» — manca il totale — «blocco 1 di 4»
- [bassa] timer-concentrazione__tel-light.png — layout — contenuti nella metà superiore, ~150px vuoti in basso: i bottoni principali sono lontani dal pollice — ancorare azioni in basso
- [bassa] timer-concentrazione__tel-light.png — anello a forma di squircle grigio scuro su nero, progresso non visibile all'avvio — traccia più chiara

## timer-concentrazione__tel-dark.png
- [media] timer-concentrazione__tel-dark.png — doppia uscita ✕ / «Termina sessione» e icone ambigue — come tema chiaro
- [bassa] timer-concentrazione__tel-dark.png — «restano» e azioni testuali grigio scuro su nero, contrasto al limite — schiarire

## cattura__tel-light.png
- [media] cattura__tel-light.png — bottone «Salva» pieno e attivo con campo vuoto — stato disabilitato finché non si scrive
- [media] cattura__tel-light.png — riga «Chiudi» — occupa un'intera fascia sotto il campo solo per un link piccolo (12px) a destra — ✕ in alto a destra o «Chiudi» accanto a «Salva»; la riga potrebbe ospitare un hint «Finisce in Da sistemare»
- [bassa] cattura__tel-light.png — nessun indizio di dove finisce il pensiero — sottotitolo «Lo ritrovi in Attività › Da sistemare»
- [bassa] cattura__tel-light.png — nessun cursore/anello di focus visibile nel campo (la tastiera non compare nello screenshot) — stato di focus evidente

## cattura__tel-dark.png
- [media] cattura__tel-dark.png — stessi problemi del tema chiaro
- [bassa] cattura__tel-dark.png — bordo del popup grigio scuro su sfondo sfocato scuro: il popup si stacca poco — ombra/bordo più chiaro

## menu-oggi-avatar__tel-light.png
- [alta] menu-oggi-avatar__tel-light.png — tocco sull'avatar — porta direttamente al Profilo a pagina intera (identico a profilo__tel-light.png) senza transizione/menu né «indietro»; la barra in basso non ha voce attiva: l'utente perde l'orientamento — testata «‹ Oggi» o ✕, oppure foglio dal basso come le sottopagine
- [bassa] menu-oggi-avatar__tel-light.png — stessi punti di profilo__tel-light.png (Promemoria «bloccati» neutro, statistiche strette, avatar di forma diversa)

## menu-oggi-avatar__tel-dark.png
- [alta] menu-oggi-avatar__tel-dark.png — nessun «indietro» e nessuna voce attiva — come tema chiaro
- [bassa] menu-oggi-avatar__tel-dark.png — stessi punti di profilo__tel-dark.png

## trascinamento-in-corso__tel-light.png
- [media] trascinamento-in-corso__tel-light.png — anteprima di rilascio 12:45–14:15 — si sovrappone al blocco «Pranzo» senza alcun avviso di conflitto e la scritta «12:45–14:15» si accavalla al blocco sottostante — evidenziare la sovrapposizione (bordo arancio, «si sovrappone a Pranzo») o affiancare i blocchi
- [media] trascinamento-in-corso__tel-light.png — fantasma trascinato («Organizzare cena… alle 12:45») — fluttua all'altezza delle 11:30–12:15, ~60px sopra l'anteprima reale: due indicatori della posizione disallineati — fantasma ancorato all'anteprima o anteprima unica
- [bassa] trascinamento-in-corso__tel-light.png — zona «Togli l'orario» — copre il blocco delle 15:00 e la griglia; ok come target, ma il bordo tratteggiato grigio è poco visibile — evidenziarla in viola quando il dito ci passa sopra
- [bassa] trascinamento-in-corso__tel-light.png — testata scorsa e tagliata in alto (badge «1» di Rituali a metà) — testata sticky completa o nascosta del tutto

## Riassunto

Visti tutti gli 87 screenshot del telefono (43 coppie chiaro/scuro + trascinamento). Di difetti reali ce ne sono tanti, soprattutto di coerenza e di numeri senza etichetta.

### ALTA gravità
1. **Dati che non tornano tra le schermate**
   - «Ago 17» nella vista Anno contro «18 giorni attivi» nella vista Mese.
   - Il Bilancio della settimana dice «10 attività fatte · 6/7 giorni attivi», ma la settimana 17–23 ago è al secondo giorno e la vista Settimana dice «4 di 24». Probabilmente sono gli ultimi 7 giorni, ma l'etichetta dice «settimana».
   - In Andamento la serie è di 38 giorni ma il venerdì della striscia è vuoto.
2. **Numeri grandi senza etichetta in Andamento**: «🔥38» e «65% · 81 di 124» non dicono cosa contano né su quale periodo. Il Profilo invece lo spiega.
3. **Controlli nativi non stilizzati**
   - select «15 min ⌄» nel pannello sonno della giornata
   - select area in Da sistemare e nella nuova attività
   - select dentro una voce del Diario
   - maniglia di ridimensionamento delle textarea nel Bilancio della settimana e nella scheda scoperta
4. **Due editor diversi per gli stessi pasti**: nel pannello della Giornata ci sono input bordati, select nativi e cestino; in Profilo › Sonno e pasti ci sono pillole viola e ✕.
5. **Rituale Sonno e pasti con due «Salva»**: uno per il sonno e uno principale, che in più resta coperto dalla barra in basso.
6. **Legenda spezzata in Fine giornata**: «1 = male · 5 / = benissimo» va a capo e separa il 5 dal suo testo.
7. **Grafico dell'esperimento**: le etichette «media 3,1 / 4,3» stanno sopra i punti e sopra la linea tratteggiata.
8. **Profilo aperto dall'avatar**: non c'è un pulsante indietro e nessuna voce della barra in basso è attiva, quindi ci si perde.
9. **Promemoria con notifiche bloccate**: gli interruttori sono grigi ma col pomello a destra (posizione «acceso»), quindi non si capisce se sono accesi o spenti.
10. **Campi «Incolla il link» in Musica, tema chiaro**: sono praticamente invisibili (nessun bordo, fondo uguale alla card).

### MEDIA gravità
**Componenti incoerenti tra schermate**
- Un'abitudine ha 4 marcatori diversi: chip «Abitudine», ↻ verde, ↻ blu, quadratino verde, checkbox.
- «Salta oggi» usa ⏭ in un punto e ✕ in un altro.
- Per fare/disfare un'attività c'è «Segna come non fatta» (testo grigio); per un'abitudine c'è «✓ Fatto» (verde pieno).
- La ✕ che toglie l'orario sta dentro la pillola in un foglio e fuori nell'altro.
- «Elimina» è a volte una riga di elenco, a volte un bottone isolato.
- Le scale 1–5 sono grandi nel Check-in e piccole in Fine giornata.
- I bottoni principali sono viola pieno in Piano del giorno e lilla (sembrano disabilitati) nel Check-in.
- Le liste impostazioni hanno due stili: grassetto con valore grigio e ›, oppure peso normale con pillola viola.
- Il riquadro statistiche ha 3 stili diversi (Anno, Mese, Bilancio).
- Il titolo del periodo è centrato in vista Giorno e a sinistra in Settimana, Mese e Anno.
- Il fatto è colorato in 3 modi: anelli verdi (Mese), mappa blu (Anno, Costanza), quadrati verdi (Settimana). In tema scuro la scala Costanza è anche invertita.
- Nella scheda abitudine le azioni cambiano a seconda di dove la apri (dal calendario c'è «Termina l'abitudine», dalla lista no).
- Navigazione del Profilo: Diario è una pagina piena (e la barra evidenzia Andamento), le altre voci sono fogli. Il foglio Impostazioni cambia altezza a ogni sottopagina (Timer, Musica, Aspetto).

**Numeri e stati senza etichetta o ambigui**
- «1 di 2» in Adesso e «0 di 3 oggi» in Abitudini contano cose diverse senza dirlo.
- «1 di 3» nei passi, «🔥3», «4 record», «Backup 1».
- Rituali: «da fare 2 di 3» e «da compilare», con un lessico doppio.
- Badge che contano cose diverse: «6» vuol dire da sistemare, «9» e «3» sono totali, e il badge «1» su Rituali non corrisponde a nulla.
- Pallini e anelli del Mese, mappa dell'Anno, numeri verdi dei mesi, mini calendario dell'abitudine: tutti senza legenda.
- «XP» non è spiegato.
- Livelli di prova delle scoperte («misurato», «lo noto ogni volta») senza etichetta.
- Giorni passati non fatti, in vista Settimana, che non sembrano mancati.

**Testi italiani poco naturali o ambigui**
- «Sposta a domani quella non fatta»
- «Se prosegui, altri»
- «Non ce l'ho fatta»
- «Orari abituali» e «Annulla le modifiche» (quest'ultimo visibile anche senza modifiche)
- «Si riattivano… alla voce di questo indirizzo»
- «Fissa in alto» contro la sezione «Importanti»
- «Distribuisci i passi»
- «Priorità del giorno», che non è il nome di nessun rituale
- Domande senza «?»
- Minuscole o maiuscole incoerenti nei valori e nei chip («nessuna», «chiedi sempre» contro «Automatica»; «ogni giorno» contro «Domani»)

**Layout e testo**
- Titoli che vanno a capo troppo presto in Da fare e Scoperte, per una colonna riservata anche quando è vuota.
- La colonna del Diario è troppo stretta: il testo va a capo e spezza «focus / 5».
- La linea dell'ora attuale attraversa il testo del blocco.
- Nel trascinamento il fantasma non è allineato all'anteprima e la sovrapposizione con Pranzo non viene segnalata.
- Contenuto finale coperto dalla barra di navigazione flottante (Andamento, Scoperte, Esperimenti, rituali, «17:00» in Giornata).
- La card «Senza orario» ha il bordo superiore tagliato.
- La testata fissa dei fogli non ha ombra o divisore e il contenuto ci spunta sotto.

**Affordance poco chiare e target piccoli**
- Cestini da ~14px accanto a interruttori, select o icone calendario (Aree, passi, pasti).
- ↺ su ogni voce del Diario.
- Valori modificabili che sembrano testo semplice («Inizio», «Fine», orari nel rituale sonno).
- «Come sempre · 23:30–07:30» sembra un link.
- Pulsanti sì/no dei pasti senza stato selezionato.
- Giorni L–D tutti pieni nella nuova abitudine (non si capisce che si possono togliere).
- «Ora: Nessuna» sembra disabilitato.
- «Salva» attivo con il campo vuoto nel popup «Scrivi un pensiero».
- Doppia uscita nel timer (✕ e «Termina sessione»).
- Icona ↻ usata per abitudini, Pomodoro e «Cambia timer».

**Tema scuro**
- In tutti i controlli segmentati il segmento attivo è grigio medio su grigio scuro: lo stato selezionato si vede poco.
- Divisori di elenco invisibili (Impostazioni, scheda scoperta).
- Cerchi e riquadri con fondo nero che sembrano buchi (passi, giorni S/D, icone del timer).
- Celle vuote di mappe e anelli quasi invisibili.
- Badge e testi secondari a basso contrasto.
- Interruttori spenti con pomello grigio.

**Impostazioni fuori posto**
- «Suoni» e «Vibrazione» stanno sotto «Aspetto».
- «Registro tecnico» sta sotto «Guida».
- Il gruppo Preferenze non ha intestazione.
- «Aree» e «Riflessioni passate», raggiungibili da Andamento, duplicano voci del Profilo (Riflessioni passate sembra il Diario con un altro nome).

### BASSA gravità
- Etichette del controllo segmentato a ~11px.
- Ampi vuoti in fondo a Rituali, Abitudini, Da sistemare e Profilo.
- Avatar quadrato nel Profilo e tondo nella testata.
- Formati di durata incoerenti: «1 h 30», «8h», «45 min».
- «Studio / Università» in blu che sembra un link.
- Il tab «Scoperte» ha l'icona pollice.
- Fondo del foglio Impostazioni senza margine per la barra dei gesti.
- Testo introduttivo degli esperimenti sempre visibile.
- Fogli senza ✕ di chiusura.
