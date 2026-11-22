# Revisione computer — giro 4

## oggi-adesso__pc-light.png
- [media] oggi-adesso__pc-light.png — barra di avanzamento sotto la data — «1 di 2» non dice di cosa (attività? rituali? cose di oggi?) — scrivere «1 di 2 fatte oggi» o aggiungere un'etichetta/tooltip.
- [media] oggi-adesso__pc-light.png — barra laterale, voci «Attività» e «Andamento» — le voci non selezionate hanno già uno sfondo grigio pieno: sembrano pulsanti/stati attivi e riducono lo stacco con la voce selezionata «Oggi» — togliere lo sfondo alle voci a riposo e usarlo solo in hover.
- [media] oggi-adesso__pc-light.png — doppio accesso al profilo: avatar «R» in alto a destra e «Profilo e impostazioni» in fondo alla barra laterale — su computer tenerne uno solo (la barra laterale) o differenziare chiaramente le funzioni.
- [bassa] oggi-adesso__pc-light.png — colonna centrale ~680 px su 1280: a destra ~180 px vuoti e la scheda «Poi» è un'unica riga isolata; la parte bassa (da y 650) è vuota — su desktop usare una seconda colonna (es. «Poi»/prossimi impegni a destra) o allargare il contenuto.
- [bassa] oggi-adesso__pc-light.png — badge «38 giorni» — non dice che cosa conta (serie di giorni attivi?) — «38 giorni di fila» o tooltip.
- [bassa] oggi-adesso__pc-light.png — «Pianifica la giornata / Un minuto» — il sottotitolo «Un minuto» è ambiguo (durata? scadenza?) — «Ci vuole un minuto».
- [bassa] oggi-adesso__pc-light.png — riga «Confrontare piani telefonici»: il cerchio di spunta è a filo con il bordo sinistro della scheda (margine interno più stretto rispetto alle altre schede) — uniformare il padding a 16–20 px.

## oggi-adesso__pc-dark.png
- [media] oggi-adesso__pc-dark.png — barra laterale — in scuro la voce selezionata «Oggi» (fondo #1e1e2a circa) quasi non si distingue dalle voci a riposo, anch'esse con fondo grigio pieno; solo il colore del testo cambia — dare alla voce attiva un fondo viola più deciso (es. 20% di accento) e togliere il fondo alle voci a riposo.
- [media] oggi-adesso__pc-dark.png — schede — «Confrontare piani telefonici» ha un bordo chiaro, «Pianifica la giornata» e la scheda principale no: in scuro i contenitori non seguono una regola unica — usare lo stesso bordo sottile (o nessuno) per tutte le schede.
- [bassa] oggi-adesso__pc-dark.png — pulsante «Fatto» — verde molto saturo e luminoso su fondo blu-grigio: domina troppo e vibra in tema scuro — desaturare leggermente il verde nel tema scuro.
- [bassa] oggi-adesso__pc-dark.png — scheda segmentata in alto — la scheda attiva «Adesso» è un grigio medio con testo bianco: contrasto basso e aspetto «disabilitato» — usare il fondo di superficie più chiaro con bordo, come nel tema chiaro.
- [bassa] oggi-adesso__pc-dark.png — stessi problemi del chiaro: «1 di 2» senza etichetta, doppio accesso profilo (avatar + «Profilo e impostazioni»), spazio vuoto sotto e a destra.

## giornata-giorno__pc-light.png
- [media] giornata-giorno__pc-light.png — riga riassunto sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — le icone dei pasti sono senza etichetta e non si capisce se indicano pasti fatti, previsti o saltati — aggiungere testo («3 pasti») o tooltip, o mostrare un conteggio.
- [media] giornata-giorno__pc-light.png — due controlli a schede sovrapposti con stili diversi (riga principale: pillola bianca; riga Giorno/Settimana: pillola viola) — sembrano due componenti diversi; uniformare o rendere la seconda riga chiaramente subordinata (es. sottolineatura).
- [media] giornata-giorno__pc-light.png — uso dello spazio — calendario limitato a ~680 px al centro con ~180 px vuoti a destra; su computer il giorno potrebbe affiancare l'elenco «senza orario» da trascinare (oggi è in fondo alla pagina) — layout a due colonne su schermi ≥1200 px.
- [bassa] giornata-giorno__pc-light.png — banda tratteggiata 07:00–07:30 — non ha etichetta (sonno? non disponibile?) — aggiungere «Sonno» o un'icona letto.
- [bassa] giornata-giorno__pc-light.png — blocco «Organizzare cena con il gruppo» — titolo e orario centrati verticalmente invece che in alto: con blocchi lunghi l'informazione «galleggia» — allinearli in alto come nei calendari standard.
- [bassa] giornata-giorno__pc-light.png — etichetta «10:30» della linea dell'ora attuale — si sovrappone al bordo destro del blocco evento — spostarla nella colonna delle ore a sinistra.
- [bassa] giornata-giorno__pc-light.png — titolo «Oggi» al posto della data — su computer c'è spazio per «Oggi · martedì 18 agosto».

## giornata-giorno__pc-dark.png
- [media] giornata-giorno__pc-dark.png — casella di spunta nel blocco «Confrontare piani telefonici» — quadrato quasi nero su fondo marrone, bordo invisibile: l'affordance «segna fatto» si perde — bordo chiaro di almeno 3:1 sul fondo del blocco.
- [bassa] giornata-giorno__pc-dark.png — scheda «Giorno» selezionata — in scuro è grigia, in chiaro è viola: lo stato selezionato cambia colore tra i temi — usare l'accento viola anche in scuro.
- [bassa] giornata-giorno__pc-dark.png — le due righe di schede (principale e Giorno/Settimana) hanno lo stesso grigio medio come stato attivo: gerarchia piatta — differenziare il livello secondario.
- [bassa] giornata-giorno__pc-dark.png — titolo barrato «Organizzare cena con il gruppo» grigio su grigio: contrasto basso anche per un elemento completato — alzare leggermente la luminosità del testo.
- [bassa] giornata-giorno__pc-dark.png — restano i problemi del chiaro: icone pasti senza etichetta, banda sonno senza nome, spazio laterale inutilizzato.

## giornata-giorno-fondo__pc-light.png
- [media] giornata-giorno-fondo__pc-light.png — «Sposta a domani quella non fatta» — frase poco naturale e ambigua (quale? al singolare anche se possono essere più d'una) — «Sposta a domani le attività non fatte» (con il numero se noto).
- [media] giornata-giorno-fondo__pc-light.png — riga «Ripasso flashcard» in «Senza orario» — l'icona orologio viola a destra non ha etichetta né aspetto di pulsante — aggiungere testo «Dai un orario» o tooltip e area cliccabile visibile.
- [media] giornata-giorno-fondo__pc-light.png — caselle di spunta incoerenti: qui quadrate, in «Adesso › Poi» rotonde per la stessa funzione — scegliere una forma unica per le cose da fare.
- [media] giornata-giorno-fondo__pc-light.png — blocco «Leggere 20 minuti» alle 22:00 — troppo basso: la casella di spunta tocca i bordi del blocco e l'orario non è mostrato — altezza minima del blocco o layout su una riga con orario accanto al titolo.
- [bassa] giornata-giorno-fondo__pc-light.png — «Ripasso flashcard» è un'abitudine (in Adesso ha l'etichetta Abitudine) ma qui ha un'icona libro, mentre le altre abitudini nel calendario hanno l'icona ciclo verde — usare la stessa icona per tutte le abitudini.
- [bassa] giornata-giorno-fondo__pc-light.png — campo «Nuova attività...» e pulsante «Aggiungi» — il pulsante è tinta tenue viola e sembra disabilitato anche se attivo — o stato disabilitato esplicito finché il campo è vuoto, o colore pieno.
- [bassa] giornata-giorno-fondo__pc-light.png — la barra laterale si sposta di ~1 px rispetto alla vista in alto (es. «Aggiungi una nota» y 100 vs 101) — la barra deve essere fissa.

## giornata-settimana__pc-light.png
- [alta] giornata-settimana__pc-light.png — intestazione «17–23 ago» ma le colonne sono solo Lun–Ven: sabato e domenica non si vedono e non c'è scorrimento orizzontale evidente — mostrare 7 colonne (c'è spazio) o cambiare il titolo in «17–21 ago» con un controllo per il fine settimana.
- [alta] giornata-settimana__pc-light.png — uso dello spazio — la settimana è compressa nella stessa colonna da 680 px della vista Giorno: titoli troncati («Camminata /...», «Organizzare cena con il gr...») mentre ai lati restano ~180 px vuoti — per Settimana/Mese allargare il contenuto a tutta la larghezza disponibile.
- [alta] giornata-settimana__pc-light.png — «17 ago +4», «18 ago +1» — numeri senza etichetta (attività in più non visibili? abitudini?) — scrivere «+4 altre» o usare un badge con tooltip.
- [media] giornata-settimana__pc-light.png — l'etichetta «10:30» della linea dell'ora copre il testo del blocco «Organizzare cena…» — spostarla nella colonna delle ore.
- [bassa] giornata-settimana__pc-light.png — frecce di navigazione: qui quadrate e piccole, nella vista Giorno rotonde e grandi; inoltre il titolo qui è allineato a sinistra e nella vista Giorno è centrato — uniformare.
- [bassa] giornata-settimana__pc-light.png — blocchi dei pasti con sola icona (tazza, posate) — su desktop c'è spazio per l'etichetta o almeno un tooltip.

## giornata-settimana__pc-dark.png
- [alta] giornata-settimana__pc-dark.png — stessi problemi del chiaro: «17–23 ago» con solo 5 giorni, «+4/+1» senza etichetta, titoli troncati in una colonna stretta.
- [bassa] giornata-settimana__pc-dark.png — colonna di oggi (Mar) evidenziata con un blu-grigio appena diverso dal fondo: in scuro si nota poco — rafforzare (bordo o intestazione con accento).
- [bassa] giornata-settimana__pc-dark.png — il calendario ha un bordo chiaro visibile in scuro mentre le altre schede no — uniformare i bordi delle superfici.

## giornata-mese__pc-light.png
- [media] giornata-mese__pc-light.png — anelli di avanzamento intorno ai giorni e pallini colorati sotto — nessuna legenda: non si capisce cosa misura l'anello (% di attività? abitudini?) né cosa sono i pallini (aree? umore?) — aggiungere una legenda compatta sotto la griglia e tooltip al passaggio del mouse.
- [media] giornata-mese__pc-light.png — elenco «Oggi» sotto il mese — usa piccole caselle quadrate colorate (verde, blu) diverse sia dai cerchi di «Adesso» sia dalle caselle grigie di «Senza orario» — terzo stile di casella per la stessa funzione: unificare.
- [bassa] giornata-mese__pc-light.png — griglia — la prima riga mostra i giorni di luglio (27–31) in grigio, ma l'ultima riga lascia «31» da solo senza i giorni di settembre — completare la riga o non mostrare nemmeno quelli di luglio.
- [bassa] giornata-mese__pc-light.png — uso dello spazio — su computer l'elenco «Oggi» finisce sotto la piega; con ~180 px liberi a destra si potrebbe affiancare il dettaglio del giorno selezionato alla griglia.
- [bassa] giornata-mese__pc-light.png — il giorno 18 selezionato ha sia cerchio viola pieno sia riquadro grigio sia anello verde: tre segnali sovrapposti — tenere il cerchio pieno e l'anello, togliere il riquadro.

## giornata-mese__pc-dark.png
- [media] giornata-mese__pc-dark.png — giorni di luglio (27–31): numeri e pallini quasi invisibili in scuro (grigio scuro su grigio scuro) — alzare l'opacità al ~50%.
- [media] giornata-mese__pc-dark.png — stessi problemi del chiaro: anelli e pallini senza legenda, terzo stile di casella nell'elenco «Oggi».
- [bassa] giornata-mese__pc-dark.png — scheda «Mese» selezionata grigia invece che viola (incoerenza col tema chiaro).

## giornata-anno__pc-light.png
- [alta] giornata-anno__pc-light.png — numeri verdi «7», «25», «17» in alto a destra delle schede Giu/Lug/Ago — senza etichetta (giorni attivi? attività?) — «7 giorni» o tooltip, e colore neutro.
- [media] giornata-anno__pc-light.png — incoerenza di dati: la scheda Ago dice 17, mentre la vista Mese dice «18 giorni attivi» per agosto — allineare il conteggio (oggi incluso o no) in tutte le viste.
- [media] giornata-anno__pc-light.png — mappa di calore senza legenda d'intensità (da chiaro a scuro = ?) e senza iniziali dei giorni — aggiungere legenda «meno → più» e tooltip per giorno.
- [media] giornata-anno__pc-light.png — colore: qui l'attività è blu, nella vista Mese gli anelli sono verdi, nell'andamento probabilmente altro — usare un unico colore semantico per «giorno attivo».
- [bassa] giornata-anno__pc-light.png — «XP» — sigla inglese da gioco non spiegata, accanto a etichette italiane — «punti esperienza» o tooltip.
- [bassa] giornata-anno__pc-light.png — i mesi futuri (Set–Dic) sono identici ai mesi passati vuoti (Gen–Mag): non si distingue «nessuna attività» da «non ancora arrivato» — rendere i giorni futuri tratteggiati o più chiari.

## giornata-anno__pc-dark.png
- [media] giornata-anno__pc-dark.png — la cella di oggi (18 ago) è scura con bordo sottile e si confonde con le celle vuote — evidenziarla con bordo viola/bianco più spesso.
- [bassa] giornata-anno__pc-dark.png — celle vuote grigio medio molto presenti: la griglia vuota pesa più dei dati (Gen–Mag sembrano «pieni») — scurire le celle vuote vicino al fondo della scheda.
- [alta] giornata-anno__pc-dark.png — stessi problemi del chiaro: numeri verdi senza etichetta, 17 vs 18 giorni attivi, nessuna legenda.

## giornata-sonno-aperto__pc-light.png
- [media] giornata-sonno-aperto__pc-light.png — menu a tendina «15 min / 45 min» — controlli <select> nativi con freccia di sistema, stile diverso dagli altri campi — sostituire con un select stilizzato (freccia e bordo del sistema di design).
- [media] giornata-sonno-aperto__pc-light.png — larghezze incoerenti: «A letto» e «Sveglia» hanno campi larghi ~250 px per un orario di 5 caratteri, i pasti hanno campi stretti; i nomi dei pasti sono a sinistra e i loro controlli all'estremo destro (~450 px di vuoto) — allineare in una griglia compatta: etichetta · orario · durata · elimina, tutto vicino.
- [media] giornata-sonno-aperto__pc-light.png — azioni «+ Pasto», «Annulla le modifiche», «Orari abituali» con lo stesso stile di collegamento viola: aggiungere, annullare e ripristinare sembrano equivalenti; «Orari abituali» è ambiguo (apre le impostazioni? ripristina?) — «Ripristina orari abituali», separare l'azione di annullo e dare a «+ Pasto» aspetto di pulsante.
- [bassa] giornata-sonno-aperto__pc-light.png — cestini grigi piccoli (~12 px) accanto ai select: bersaglio piccolo e poco visibile — area cliccabile 32 px e tooltip «Elimina pasto».
- [bassa] giornata-sonno-aperto__pc-light.png — non è chiaro se le modifiche si salvano da sole (non c'è «Salva» ma c'è «Annulla le modifiche») — mostrare un'indicazione «Salvato» o un pulsante esplicito.

## giornata-sonno-aperto__pc-dark.png
- [media] giornata-sonno-aperto__pc-dark.png — select nativi con freccia nera di sistema in tema scuro (poco visibile) — select stilizzato con freccia chiara.
- [media] giornata-sonno-aperto__pc-dark.png — stessi problemi di layout e azioni ambigue del chiaro (campi larghi per orari, controlli lontani dalle etichette, «Orari abituali» ambiguo).
- [bassa] giornata-sonno-aperto__pc-dark.png — i campi hanno bordo chiaro ben visibile mentre il pannello no: il contrasto dei campi è più alto del contenitore — ok funzionalmente, ma uniformare con gli altri form scuri.

## giornata-scheda-blocco__pc-light.png
- [media] giornata-scheda-blocco__pc-light.png — lo stato «fatta» non è mai dichiarato: c'è solo l'azione «Segna come non fatta» come testo grigio centrato — mostrare uno stato esplicito («✓ Fatta alle 10:12») e l'azione come pulsante secondario.
- [media] giornata-scheda-blocco__pc-light.png — valori incoerenti: «09:30» in nero, «1 h 30» in viola, «Relazioni & Sociale» viola senza ×; tutti sono pillole modificabili — stesso colore e stessa forma per tutti i valori.
- [bassa] giornata-scheda-blocco__pc-light.png — velo di sfondo molto leggero: il calendario dietro resta molto leggibile e compete con la finestra — scurire il velo (es. nero 35%).
- [bassa] giornata-scheda-blocco__pc-light.png — «1 h 30» — formato poco naturale — «1 h 30 min» o «1:30».
- [bassa] giornata-scheda-blocco__pc-light.png — la stellina mostrata nel blocco del calendario non compare nella scheda: non si capisce cosa significhi né come toglierla — mostrarla con etichetta («Importante»).

## giornata-scheda-blocco__pc-dark.png
- [bassa] giornata-scheda-blocco__pc-dark.png — la finestra (#1c1c1e circa) è quasi dello stesso tono del fondo velato: si stacca solo per il bordo sottile — alzare di un livello la superficie della finestra o aggiungere ombra più marcata.
- [bassa] giornata-scheda-blocco__pc-dark.png — pulsanti × grigi chiari su pillole scure: bene il contrasto, ma la pillola «Relazioni & Sociale» non ha ×: incoerenza.
- [media] giornata-scheda-blocco__pc-dark.png — stessi problemi del chiaro: stato «fatta» non dichiarato, valori con colori diversi.

## giornata-scheda-abitudine__pc-light.png
- [media] giornata-scheda-abitudine__pc-light.png — elenco azioni — l'azione distruttiva «Termina l'abitudine» (rossa) sta in mezzo tra «Salta oggi» e «Apri l'abitudine»: rischio di clic per errore e ordine illogico — mettere «Apri l'abitudine» in alto (o come link nel titolo) e «Termina» per ultima, separata.
- [bassa] giornata-scheda-abitudine__pc-light.png — «Salta oggi» usa l'icona × qui e l'icona ⏭ nella schermata Adesso — stessa icona ovunque (⏭).
- [bassa] giornata-scheda-abitudine__pc-light.png — spaziatura: tra la riga «Abitudine · Oggi» e il pulsante «Fatto» ci sono ~10 px, mentre nella scheda attività la riga di stato ha ~30 px di respiro — uniformare il ritmo verticale delle due schede.
- [bassa] giornata-scheda-abitudine__pc-light.png — l'icona ciclo accanto a «Abitudine» è più piccola e più bassa della linea di base del testo — allineare al centro e a 14 px.

## giornata-scheda-abitudine__pc-dark.png
- [media] giornata-scheda-abitudine__pc-dark.png — come nel chiaro: «Termina l'abitudine» in mezzo alle azioni non distruttive.
- [bassa] giornata-scheda-abitudine__pc-dark.png — «Termina l'abitudine» in rosa chiaro su grigio: in scuro si legge come un link qualunque e non come azione pericolosa — rosso più saturo o icona di avviso + conferma.
- [bassa] giornata-scheda-abitudine__pc-dark.png — finestra poco staccata dal fondo velato (stesso problema della scheda attività in scuro).

## trascinamento-in-corso__pc-light.png
- [alta] trascinamento-in-corso__pc-light.png — barra laterale — durante il trascinamento la barra laterale finisce a y≈740 e sotto si vede il fondo della pagina (striscia di 60 px senza fondo bianco/bordo); anche «Dati salvati…» e «Profilo e impostazioni» sono saliti di ~60 px — la barra deve restare a tutta altezza (height: 100dvh / position: sticky) anche quando la pagina scorre durante il trascinamento.
- [media] trascinamento-in-corso__pc-light.png — zona di rilascio «Togli l'orario» — compare in basso a destra a cavallo del bordo del calendario (x 997–1255, sborda di ~150 px oltre la colonna) e copre la colonna oraria — ancorarla dentro la colonna del contenuto o come barra a tutta larghezza in fondo alla colonna.
- [media] trascinamento-in-corso__pc-light.png — l'anteprima di rilascio 12:45–14:15 copre «Pranzo» senza alcun avviso di sovrapposizione — segnalare il conflitto (bordo arancione, testo «si sovrappone a Pranzo»).
- [bassa] trascinamento-in-corso__pc-light.png — informazione doppia: la pillola fluttuante «alle 12:45» e l'etichetta «12:45–14:15» nell'anteprima dicono la stessa cosa in due punti — tenere solo l'anteprima con orario completo.

## rituali__pc-light.png
- [media] rituali__pc-light.png — stato «da fare · 2 di 3» per «Piano del giorno» — contraddittorio: se 2 passi su 3 sono fatti è «in corso», non «da fare» — usare «in corso · 2 di 3» o «manca 1 passo».
- [media] rituali__pc-light.png — badge «1» sulla scheda «Rituali» (nelle altre schermate) — non corrisponde a niente di visibile qui: 4 rituali risultano da fare/da compilare — chiarire cosa conta (es. «rituali consigliati ora») o mostrare il numero reale.
- [media] rituali__pc-light.png — nomi incoerenti: in «Adesso» la scheda si chiama «Pianifica la giornata», qui «Piano del giorno» — scegliere un nome unico.
- [bassa] rituali__pc-light.png — solo l'icona di «Piano del giorno» è viola piena, le altre chiare: non si capisce se indica «consigliato adesso» o selezione — aggiungere un'etichetta «Adesso» o uniformare.
- [bassa] rituali__pc-light.png — stati in testo piccolo (12 px) e in due righe allineate a destra, lontani dal titolo — su desktop c'è spazio per una pillola di stato unica e per indicare quando va fatto il rituale (mattina, sera, domenica).
- [bassa] rituali__pc-light.png — due terzi dello schermo vuoti — su computer si può mostrare il primo rituale da fare già aperto, o una colonna con l'anteprima.

## rituali__pc-dark.png
- [bassa] rituali__pc-dark.png — icone dei rituali non attivi viola scuro su quadrato quasi nero: poco leggibili — schiarire l'icona.
- [media] rituali__pc-dark.png — stessi problemi del chiaro: «da fare 2 di 3», badge «1» non spiegato, nome diverso da «Pianifica la giornata», schermo per lo più vuoto.

## rituale-piano__pc-light.png
- [media] rituale-piano__pc-light.png — «2 di 3» nell'intestazione — non si capisce a cosa si riferisca: sotto ci sono 2 priorità e un campo «Quando inizi?» — esplicitare («2 passi su 3») o mostrare i passi numerati.
- [media] rituale-piano__pc-light.png — pillola «☆ Priorità» — testo bianco su viola chiaro (#a99cf5 circa), contrasto < 3:1 — testo viola scuro su viola chiaro o viola pieno.
- [media] rituale-piano__pc-light.png — icone a destra delle priorità (persone rosa, carta gialla) — sono le aree ma senza etichetta né tooltip, e la prima riga ha la pillola «Priorità» mentre la seconda no senza spiegazione — mostrare il nome dell'area in piccolo come in «Adesso» («Finanze · 15:00»).
- [media] rituale-piano__pc-light.png — campi di testo grigi pieni senza bordo, diversi dai campi bianchi con bordo della vista Giorno («Nuova attività...») e del pannello sonno — un solo stile di campo in tutta l'app.
- [bassa] rituale-piano__pc-light.png — «+5 XP» nel pulsante «Salva» — più piccolo e più alto della linea di base di «Salva» — allineare alla linea di base o spostarlo in una pillola separata.
- [bassa] rituale-piano__pc-light.png — il campo «Aggiungi un'altra priorità…» non ha un'etichetta mentre «Quando inizi?» sì — aggiungere «Priorità di oggi» sopra l'elenco.

## rituale-piano__pc-dark.png
- [bassa] rituale-piano__pc-dark.png — icona persone rosa accanto a «Priorità» quasi invisibile in scuro (rosa scuro su grigio) — schiarire.
- [bassa] rituale-piano__pc-dark.png — campi grigi senza bordo su scheda grigia: bordo del campo appena percepibile — aggiungere bordo 1 px.
- [media] rituale-piano__pc-dark.png — stessi problemi del chiaro: «2 di 3» ambiguo, icone d'area senza etichetta, stile campi diverso dal resto.

## rituale-sonno-pasti__pc-light.png
- [media] rituale-sonno-pasti__pc-light.png — due pulsanti di conferma nello stesso rituale: «Salva» (tenue) per il sonno e «Fatto» (pieno) in fondo — non è chiaro se «Fatto» salva anche il sonno — un solo pulsante finale, oppure rinominare il primo «Conferma sonno».
- [media] rituale-sonno-pasti__pc-light.png — «Come sempre · 23:30–07:30» in viola allineato a destra — sembra un valore, invece è un'azione rapida — trasformarlo in pulsante «Uguale al solito (23:30–07:30)».
- [media] rituale-sonno-pasti__pc-light.png — pulsanti pasti «sì / no / 🕒» — minuscolo poco curato e icona orologio senza etichetta (orario diverso?) — «Sì», «No», «Altro orario».
- [media] rituale-sonno-pasti__pc-light.png — incoerenza tra schermate: gli stessi dati (sonno e pasti) qui si compilano con sì/no e orari in sola lettura, nel pannello della Giornata con campi orario e select di durata — unificare il componente.
- [bassa] rituale-sonno-pasti__pc-light.png — orari «23:30 🕒» allineati a destra senza aspetto di campo: non si capisce che sono modificabili — dare forma di campo/pillola cliccabile.
- [bassa] rituale-sonno-pasti__pc-light.png — «Non ricordo» accanto a «Salva» con peso simile — ok, ma andrebbe chiarito l'effetto (salta il sonno di oggi?).

## rituale-sonno-pasti__pc-dark.png
- [bassa] rituale-sonno-pasti__pc-dark.png — pulsante «Salva» tenue: fondo viola-grigio quasi uguale alla scheda, sembra disabilitato — rafforzare.
- [media] rituale-sonno-pasti__pc-dark.png — stessi problemi del chiaro (due pulsanti di conferma, «sì/no» minuscoli, icona orologio senza etichetta, «Come sempre» ambiguo).

## rituale-checkin__pc-light.png
- [media] rituale-checkin__pc-light.png — il check-in è già «fatto» ma il pulsante dice ancora «Registra +3 XP»: sembra che si possa registrare di nuovo e prendere altri punti — se già fatto: «Aggiorna» senza XP, o testo «Registrato alle 9:12».
- [media] rituale-checkin__pc-light.png — verbi dei pulsanti finali incoerenti tra rituali: «Salva» (piano), «Salva» + «Fatto» (sonno), «Registra» (check-in) e anche stile diverso (pieno vs tenue) — un verbo e uno stile unici per chiudere un rituale.
- [media] rituale-checkin__pc-light.png — gerarchia: il titolo «Andamento degli ultimi 14 giorni» (grande, ~20 px, nero pesante) è più forte dei titoli dei rituali (Piano del giorno, Check-in) — ridurlo a sottotitolo di sezione.
- [bassa] rituale-checkin__pc-light.png — su desktop i pulsanti 1–5 sono larghi 120 px ciascuno: la scala occupa tutta la larghezza e l'occhio deve viaggiare molto — larghezza massima ~400–480 px per la scala.
- [bassa] rituale-checkin__pc-light.png — «1 · giù» — registro troppo colloquiale e ambiguo — «1 · molto giù» o «1 · male».

## rituale-checkin__pc-dark.png
- [bassa] rituale-checkin__pc-dark.png — pulsante «Registra» viola scurissimo con bordo: in scuro sembra disabilitato — se è l'azione principale, colore pieno.
- [media] rituale-checkin__pc-dark.png — stessi problemi del chiaro («Registra +3 XP» su check-in già fatto, verbi incoerenti, titolo dell'andamento troppo forte).

## rituale-sera__pc-light.png
- [media] rituale-sera__pc-light.png — valutazione per area — su computer il nome dell'area sta su una riga e i pulsanti 1–5 sulla riga sotto, allineati a destra: ~600 px vuoti a destra del nome e il doppio dell'altezza necessaria — mettere nome e scala sulla stessa riga.
- [media] rituale-sera__pc-light.png — scala 1–5 con componente diverso dal check-in (qui quadratini grigi pieni 36 px, nel check-in grandi riquadri bianchi con bordo) — un solo componente «scala» in tutta l'app.
- [bassa] rituale-sera__pc-light.png — pulsanti 1–5 grigi chiari su bianco con numeri grigi: contrasto basso, sembrano disabilitati — bordo o testo più scuro.
- [bassa] rituale-sera__pc-light.png — nome «Fine giornata» qui, «Review della sera» nell'indice/altre parti — verificare coerenza dei nomi dei rituali.

## rituale-sera__pc-dark.png
- [media] rituale-sera__pc-dark.png — stessi problemi del chiaro: nome area e scala su due righe, scala diversa dal check-in.
- [bassa] rituale-sera__pc-dark.png — pulsanti 1–5 senza bordo su scheda scura: si distinguono poco — bordo 1 px.

## rituale-settimana__pc-light.png
- [media] rituale-settimana__pc-light.png — numeri «216 XP guadagnati · 10 attività fatte · 6/7 giorni attivi» senza periodo: è martedì 18 e la settimana 17–23 ha solo 2 giorni trascorsi, quindi «6/7» non può riferirsi a questa settimana — indicare il periodo («ultimi 7 giorni» o «11–17 ago»).
- [media] rituale-settimana__pc-light.png — aree di testo con maniglia di ridimensionamento nativa visibile, fondo grigio senza bordo e senza segnaposto — nascondere la maniglia (resize: vertical con stile o auto-altezza) e aggiungere un esempio come segnaposto.
- [bassa] rituale-settimana__pc-light.png — riga dei numeri non allineata al contenuto: parte a x≈583 invece che al margine sinistro (440) e non è nemmeno centrata rispetto alla scheda — allinearla a sinistra o centrarla davvero.
- [bassa] rituale-settimana__pc-light.png — etichette formulate come domande ma senza punto interrogativo («Cosa ti ha bloccato») — aggiungere «?».
- [bassa] rituale-settimana__pc-light.png — su computer le quattro domande in colonna obbligano a scorrere molto — griglia 2×2.

## rituale-settimana__pc-dark.png
- [media] rituale-settimana__pc-dark.png — stessi problemi del chiaro: periodo dei numeri non indicato, maniglia nativa delle aree di testo (in scuro con righine chiare visibili), riga numeri non allineata.

## attivita-sistemare__pc-light.png
- [media] attivita-sistemare__pc-light.png — select «Altro / Esplorazione» — controllo nativo grigio con freccia di sistema, unico elemento non stilizzato in una scheda curata — usare la pillola «Area» dello stile delle schede (come in «Relazioni & Sociale»).
- [media] attivita-sistemare__pc-light.png — elenco «In coda»: 4 voci e poi «e un'altra» in corsivo — su computer c'è tutto lo spazio per mostrarla; inoltre le voci non hanno aspetto cliccabile (non si capisce se si possono aprire o riordinare) — mostrare tutte le voci con hover e cursore.
- [bassa] attivita-sistemare__pc-light.png — «Scarta» ha lo stesso peso visivo di «Da fare» (stessa forma, stesso bordo) — azione distruttiva più discreta (solo testo/icona) o separata a destra.
- [bassa] attivita-sistemare__pc-light.png — titolo di sezione «Da sistemare» ripete la scheda selezionata subito sopra — sostituirlo con un'istruzione utile («Decidi dove va: 1 di 6»).
- [bassa] attivita-sistemare__pc-light.png — su computer mancano scorciatoie da tastiera per smistare (O / F / Canc) — mostrarle nei pulsanti come «C» in «Aggiungi una nota».
- [bassa] attivita-sistemare__pc-light.png — badge «6» nella barra laterale su «Attività» = solo le cose da sistemare, mentre le schede dicono 6/9/3 — tooltip «6 da sistemare».

## attivita-sistemare__pc-dark.png
- [bassa] attivita-sistemare__pc-dark.png — contatore «6» nella scheda attiva «Da sistemare»: grigio su grigio medio, quasi illeggibile — contatore con fondo più scuro o viola.
- [media] attivita-sistemare__pc-dark.png — select nativo «Altro / Esplorazione» anche in scuro, con freccia nera di sistema poco visibile; restano «e un'altra» e «Scarta» troppo pesante.

## attivita-dafare__pc-light.png
- [media] attivita-dafare__pc-light.png — «1 di 3», «1 di 4» accanto ai titoli — numeri senza etichetta (passi completati?) — «1/3 passi» o mini barra con tooltip.
- [media] attivita-dafare__pc-light.png — nell'elenco «Da fare» non c'è modo di segnare un'attività come fatta (niente casella), mentre ovunque altrove c'è — aggiungere la casella a sinistra, coerente con gli altri elenchi.
- [bassa] attivita-dafare__pc-light.png — il primo «+ Oggi» è viola pieno, gli altri tenui: se è hover va bene, se è uno stato fisso non si capisce perché — verificare; se è il «consigliato» spiegarlo.
- [bassa] attivita-dafare__pc-light.png — spaziatura: il filtro «Tutte» è a ~10 px dall'intestazione «Importanti 3», mentre tra le sezioni ci sono ~30 px — staccare il filtro (o metterlo sulla stessa riga del campo «Nuova attività»).
- [bassa] attivita-dafare__pc-light.png — icone colorate delle aree (libro, matita, valigetta, lampadina) senza nome dell'area — su desktop c'è spazio per l'etichetta dell'area come in «Adesso».
- [bassa] attivita-dafare__pc-light.png — titoli delle righe a ~17 px semibold, più grandi dei titoli nelle altre liste (15 px) — uniformare la scala tipografica delle liste.

## attivita-dafare__pc-dark.png
- [media] attivita-dafare__pc-dark.png — anche in scuro il primo «+ Oggi» è pieno e gli altri tenui: è uno stato fisso, non un hover — non si capisce perché quel pulsante sia diverso; o tutti uguali, o spiegare («consigliata»).
- [bassa] attivita-dafare__pc-dark.png — «scade tra 20 giorni» grigio scuro piccolo su fondo scuro: contrasto basso per un'informazione importante — alzare il contrasto o colorare se la scadenza è vicina.
- [media] attivita-dafare__pc-dark.png — stessi problemi del chiaro: «1 di 3» senza etichetta, nessuna casella per completare.

## attivita-dafare-aggiunta__pc-light.png
- [media] attivita-dafare-aggiunta__pc-light.png — select nativo «Altro / Esplorazione» accanto a pillole stilizzate: altezza diversa (~42 px contro ~34 px), angoli diversi, freccia di sistema — renderlo una pillola dello stesso componente con menu personalizzato.
- [bassa] attivita-dafare-aggiunta__pc-light.png — la riga delle opzioni parte a x≈436, rientrata di 12 px rispetto al campo (x 424) e al filtro sotto — allineare al bordo sinistro.
- [bassa] attivita-dafare-aggiunta__pc-light.png — le opzioni non hanno etichette («Quando», «Area»): «Oggi/Domani/Senza data» e l'area sono comprensibili, ma l'area preselezionata «Altro / Esplorazione» passa inosservata — prefisso «Area:» o icona.
- [bassa] attivita-dafare-aggiunta__pc-light.png — mentre si scrive, il filtro «Tutte» resta schiacciato tra le opzioni e l'intestazione «Importanti»: tre livelli di controlli impilati con spaziature diverse — separare meglio il blocco «nuova attività» dall'elenco.

## attivita-dafare-aggiunta__pc-dark.png
- [media] attivita-dafare-aggiunta__pc-dark.png — stessi problemi del chiaro: select nativo più alto delle pillole e con freccia di sistema, riga opzioni rientrata.
- [bassa] attivita-dafare-aggiunta__pc-dark.png — pillole «Oggi/Domani» non selezionate con bordo grigio scuro poco visibile — bordo più chiaro.

## attivita-abitudini__pc-light.png
- [media] attivita-abitudini__pc-light.png — il cerchio per segnare fatto è a destra (grande, 44 px), mentre in «Adesso», «Senza orario» e «Mese» la casella è a sinistra e piccola — stessa posizione e stessa forma per «segna fatto» in tutta l'app.
- [media] attivita-abitudini__pc-light.png — «🔥3» accanto a «Camminata / movimento» — numero senza etichetta (serie di giorni?) e assente sulle altre abitudini senza spiegazione — «3 giorni di fila» in tooltip o testo.
- [bassa] attivita-abitudini__pc-light.png — anello «0 di 3 oggi» vuoto grigio chiarissimo: a zero sembra un elemento rotto/caricamento — mostrare la traccia con un minimo di contrasto e testo «0 di 3 fatte oggi».
- [bassa] attivita-abitudini__pc-light.png — su desktop metà inferiore vuota; le abitudini non mostrano frequenza (ogni giorno? lun-ven?) — aggiungere la frequenza nella riga.

## attivita-abitudini__pc-dark.png
- [media] attivita-abitudini__pc-dark.png — stessi problemi del chiaro (cerchio a destra incoerente, «🔥3» senza etichetta).
- [bassa] attivita-abitudini__pc-dark.png — incoerenza di dati percepita: qui «0 di 3» abitudini fatte oggi, in «Adesso» la barra dice «1 di 2» — senza etichette l'utente non può capire che sono conteggi diversi; etichettare entrambi.

## attivita-abitudini-nuova__pc-light.png
- [media] attivita-abitudini-nuova__pc-light.png — cerchi dei giorni L–D distribuiti su tutta la larghezza (~100 px di vuoto tra uno e l'altro): su desktop sembrano elementi sparsi, non un gruppo — raggrupparli a sinistra con 8 px di spazio.
- [media] attivita-abitudini-nuova__pc-light.png — schema di creazione diverso da «Nuova attività»: lì opzioni a pillole in riga, qui un pannello a righe (Giorni/Ora/Area) con pillole a destra — unificare il modo di impostare le opzioni.
- [bassa] attivita-abitudini-nuova__pc-light.png — «Ogni giorno» in grigio a destra di «Giorni»: non si capisce se è un riassunto o un pulsante — se riassunto, metterlo accanto all'etichetta; se scorciatoia, dargli forma di pulsante.
- [bassa] attivita-abitudini-nuova__pc-light.png — pillola «Nessuna» per l'ora: grigio su grigio, sembra disabilitata — «Scegli ora» in viola come le altre pillole.
- [bassa] attivita-abitudini-nuova__pc-light.png — due «M» (martedì e mercoledì) indistinguibili — tooltip col nome intero o «Ma/Me».

## attivita-abitudini-nuova__pc-dark.png
- [media] attivita-abitudini-nuova__pc-dark.png — stessi problemi del chiaro (giorni sparsi, schema diverso da Nuova attività, «Nessuna» che sembra disabilitata).
- [bassa] attivita-abitudini-nuova__pc-dark.png — barra superiore: rispetto alle altre schermate le schede sono salite di ~14 px (y 37 invece di 51) perché la pagina è scorsa, mentre la barra laterale è ferma — se la barra delle schede è un'intestazione, renderla fissa; altrimenti ok.

## scheda-attivita__pc-light.png
- [media] scheda-attivita__pc-light.png — finestra larga solo ~460 px su uno schermo da 1280: il titolo va a capo su due righe, «Un altro giorno» scende su una seconda riga e tutto il contenuto richiede scorrimento — su computer finestra 600–720 px o pannello laterale a destra.
- [media] scheda-attivita__pc-light.png — maiuscole incoerenti tra pillole: «Domani», «Giovedì», «Tra una settimana» con iniziale maiuscola; «ogni giorno», «ogni 2 giorni», «ogni settimana» minuscole — uniformare (iniziale maiuscola).
- [bassa] scheda-attivita__pc-light.png — «Distribuisci i passi» — non è chiaro cosa faccia (crea date ai passi? li pianifica nel calendario?) — sottotitolo esplicativo («Pianifica un passo ogni…»).
- [bassa] scheda-attivita__pc-light.png — il contenuto in fondo (sezione «Dettagli», riga «Area») è tagliato netto dal bordo della finestra senza sfumatura né indicazione di scorrimento — aggiungere ombra/sfumatura in fondo all'area scorrevole.
- [bassa] scheda-attivita__pc-light.png — icone calendario e cestino dei passi grigie, piccole e vicine (~30 px di distanza): facile cliccare elimina per errore — più spazio o cestino visibile solo in hover.

## scheda-attivita__pc-dark.png
- [bassa] scheda-attivita__pc-dark.png — cerchi dei passi non fatti: fondo nero con bordo grigio scuro, poco visibili — bordo più chiaro (≥3:1).
- [media] scheda-attivita__pc-dark.png — stessi problemi del chiaro: finestra stretta, maiuscole incoerenti nelle pillole, fondo tagliato.

## scheda-attivita-fondo__pc-light.png
- [media] scheda-attivita-fondo__pc-light.png — «Non ce l'ho fatta» con freccia → — non si capisce cosa succede (archivia? segna fallita? riprogramma?) — rinominare in base all'effetto («Lascia perdere e archivia») con sottotitolo.
- [media] scheda-attivita-fondo__pc-light.png — «Fissa in alto» qui, ma nell'elenco la sezione si chiama «Importanti» e nel rituale c'è la pillola «Priorità»: tre nomi per lo stesso concetto (?) — scegliere un termine unico.
- [media] scheda-attivita-fondo__pc-light.png — «Area» qui è testo grigio con freccia ⌄ (select), nella scheda dal calendario è una pillola viola, in «Da sistemare» un select nativo — tre rappresentazioni dello stesso campo.
- [bassa] scheda-attivita-fondo__pc-light.png — intestazione fissa senza ombra/separatore: la riga «Recuperare modulo 1» passa sotto il titolo tagliata a metà — aggiungere un bordo inferiore o un'ombra all'intestazione quando si scorre.
- [bassa] scheda-attivita-fondo__pc-light.png — interruttore «Fissa in alto» spento: pallino bianco su binario grigio chiarissimo, quasi invisibile — binario più scuro.
- [bassa] scheda-attivita-fondo__pc-light.png — «nessuna» minuscolo come valore di «Scadenza» — «Nessuna» o «Aggiungi».

## scheda-abitudine__pc-light.png
- [media] scheda-abitudine__pc-light.png — calendario dell'abitudine senza nome del mese e senza frecce: non si sa che è agosto (con coda di luglio) né si può guardare indietro — titolo «Agosto 2026» con navigazione.
- [media] scheda-abitudine__pc-light.png — tre stati dei giorni senza legenda: cerchio verde (fatto), cerchio grigio (previsto e non fatto?), numero senza cerchio (non previsto) e cerchio bordato viola (oggi) — legenda minima o tooltip; «mancato» potrebbe avere un segno distinto.
- [bassa] scheda-abitudine__pc-light.png — la × per togliere l'ora è fuori dalla pillola «18:00», mentre nella scheda dal calendario è dentro la pillola — uniformare.
- [bassa] scheda-abitudine__pc-light.png — pillola area «Salute & Sport» verde qui, viola nelle schede del calendario — usare sempre il colore dell'area o sempre il viola.
- [bassa] scheda-abitudine__pc-light.png — «4 record» — formulazione poco naturale — «record: 4 giorni».
- [bassa] scheda-abitudine__pc-light.png — finestra alta quasi quanto lo schermo (48–750) e stretta (460 px): su computer statistiche e calendario potrebbero stare affiancati.

## scheda-abitudine__pc-dark.png
- [bassa] scheda-abitudine__pc-dark.png — numeri dei giorni non previsti (1, 2, 8, 9…) e di luglio grigio scuro su grigio scuro: contrasto basso — schiarire.
- [media] scheda-abitudine__pc-dark.png — stessi problemi del chiaro: mese senza nome, stati dei giorni senza legenda.

## scheda-abitudine-fondo__pc-light.png
- [media] scheda-abitudine-fondo__pc-light.png — sezione «Dettagli»: «Area» è una pillola viola modificabile, «Inizio 29 lug 2026» testo nero, «Fine Mai» testo grigio — non si capisce quali valori si possono cambiare — stessa affordance (pillola o freccia ›) per tutti i campi modificabili.
- [media] scheda-abitudine-fondo__pc-light.png — «Elimina» qui è un pulsante centrato senza icona, nella scheda attività è una riga allineata a sinistra con cestino — stesso componente per l'azione distruttiva.
- [bassa] scheda-abitudine-fondo__pc-light.png — l'area appare due volte con colori diversi (pillola verde in alto, pillola viola qui) — vedi nota precedente.
- [bassa] scheda-abitudine-fondo__pc-light.png — intestazione fissa senza ombra: le righe del calendario scorrono sotto tagliate a metà — separatore/ombra.

## andamento__pc-light.png
- [alta] andamento__pc-light.png — scheda in alto: «🔥 38» e «65% · 81 di 124» senza alcuna etichetta (38 cosa? 65% di cosa, in che periodo?) — «38 giorni di fila» e «65% attività completate (81 su 124) negli ultimi 30 giorni».
- [alta] andamento__pc-light.png — incoerenza: la serie dice 38 giorni di fila ma nella riga degli ultimi 7 giorni il venerdì è vuoto (non fatto) — o la serie non è «di fila» o il venerdì ha un'altra regola (giorno di pausa?): spiegarlo (icona «pausa») o correggere il calcolo.
- [media] andamento__pc-light.png — scheda «Costanza»: mappa di calore piccola (~200×110 px) in una scheda alta 420 px: metà inferiore vuota; mancano mesi e giorni sugli assi — ingrandire le celle per riempire la larghezza, aggiungere etichette dei mesi e tooltip per giorno.
- [bassa] andamento__pc-light.png — riga dei 7 giorni: le iniziali (M, G, V, S, D, L, M) senza date; il giorno corrente si capisce solo dal bordo viola — aggiungere il numero del giorno o «oggi».
- [bassa] andamento__pc-light.png — «Per area» ordinato dal peggiore al migliore senza indicarlo — titolo «Per area (dal più basso)» o ordinamento selezionabile; inoltre il periodo di riferimento non è indicato.
- [bassa] andamento__pc-light.png — colori: «Costanza» in blu, giorni in verde, aree con il loro colore: il blu della mappa non ha un significato condiviso — usare il colore d'accento/attività coerente con le viste Mese/Anno.

## andamento__pc-dark.png
- [alta] andamento__pc-dark.png — stessi problemi del chiaro: «38» e «65% 81 di 124» senza etichetta, serie di 38 giorni con venerdì vuoto, metà della scheda «Costanza» vuota.
- [bassa] andamento__pc-dark.png — le schede in scuro hanno un bordo chiaro marcato (qui sì, in «Adesso» no): incoerenza del sistema di superfici.
- [bassa] andamento__pc-dark.png — il riquadro vuoto del venerdì è grigio scuro quasi uguale al fondo: il giorno mancato si vede poco — bordo tratteggiato o simbolo.

## andamento-fondo__pc-light.png
- [media] andamento-fondo__pc-light.png — elenco di collegamenti in fondo: «Aree» compare qui e anche in Profilo › Aree; «Grafici» è vago (quali grafici, rispetto al riepilogo?) — chiarire con sottotitoli («Andamento di energia e umore») ed evitare voci doppie in sezioni diverse.
- [bassa] andamento-fondo__pc-light.png — solo «Riflessioni passate» ha un conteggio (79), le altre voci no — aggiungere i conteggi (es. sessioni del timer) o toglierlo.
- [bassa] andamento-fondo__pc-light.png — su computer le voci in fondo potrebbero diventare schede in griglia invece di un elenco stile telefono.

## scoperte__pc-light.png
- [media] scoperte__pc-light.png — livelli di prova «misurato», «lo noto ogni volta», «notato una volta» — forme verbali incoerenti (presente/participio, con e senza «lo»), minuscole, e la scala non è spiegata — etichette parallele e una legenda: «Misurato», «Notato sempre», «Notato una volta», magari con 1–3 tacche.
- [bassa] scoperte__pc-light.png — la scheda «Registro» usa la stessa icona pollice della scheda madre «Scoperte» — icona diversa (es. elenco) per non confondere livelli.
- [bassa] scoperte__pc-light.png — su computer «Funziona» e «Non funziona» potrebbero stare affiancate in due colonne invece di richiedere scorrimento.
- [bassa] scoperte__pc-light.png — le righe senza area («Iniziare dalla cosa più difficile…») hanno il sottotitolo che parte senza icona, disallineato rispetto alle righe con icona — riservare lo spazio icona o mettere un segnaposto «Nessuna area».

## scoperte__pc-dark.png
- [media] scoperte__pc-dark.png — stessi problemi del chiaro (etichette di prova incoerenti e senza legenda).
- [bassa] scoperte__pc-dark.png — pollice verso rosso scuro dentro riquadro scuro: poco leggibile — schiarire il rosso nel tema scuro.

## scoperte-esperimenti__pc-light.png
- [media] scoperte-esperimenti__pc-light.png — grafico: le etichette «media 3,1» e «media 4,3» si sovrappongono ai punti dei dati — spostarle fuori dall'area dei punti (a destra del grafico o sopra la linea con fondo bianco).
- [media] scoperte-esperimenti__pc-light.png — grafico senza asse del tempo (date o giorni) — aggiungere date di inizio/fine di ciascun periodo.
- [media] scoperte-esperimenti__pc-light.png — «⚑ concluso» e «Focus (da check-in, 1–5)» hanno forma di pulsante (bordo, fondo bianco) ma sono stati/etichette — stile da pillola informativa non cliccabile.
- [bassa] scoperte-esperimenti__pc-light.png — «Salvala in «Funziona»» — pronome «la» poco chiaro e virgolette annidate — «Aggiungi a Funziona».
- [bassa] scoperte-esperimenti__pc-light.png — «Focus» (inglese) mentre il check-in chiede «Quanto riesci a concentrarti?» — usare «Concentrazione».
- [bassa] scoperte-esperimenti__pc-light.png — testo introduttivo limitato a metà scheda (~400 px) con l'altra metà vuota, mentre il riepilogo in basso occupa tutta la larghezza — larghezza di lettura coerente nelle schede.

## scoperte-esperimenti__pc-dark.png
- [media] scoperte-esperimenti__pc-dark.png — stessi problemi del chiaro: etichette delle medie sopra i punti, nessun asse del tempo, pillole che sembrano pulsanti.
- [bassa] scoperte-esperimenti__pc-dark.png — punti grigi del periodo «Prima» e linea tratteggiata grigia su fondo scuro: contrasto basso — schiarire.

## scheda-scoperta__pc-light.png
- [media] scheda-scoperta__pc-light.png — due stili diversi per le pillole non selezionate nella stessa finestra: grigie piene («notato una volta») e bianche («non funziona») — un solo stile di gruppo di scelta.
- [bassa] scheda-scoperta__pc-light.png — gerarchia: «Esito» (funziona / non funziona), l'informazione principale, è nascosto dentro «Dettagli» sotto il livello di sicurezza — spostarlo subito sotto il testo.
- [bassa] scheda-scoperta__pc-light.png — titolo «Una cosa che hai capito» e etichetta «Cosa hai capito» ripetono la stessa frase; le etichette-domanda non hanno «?» («Quanto ne sei sicuro») — togliere l'etichetta ridondante, aggiungere «?».
- [bassa] scheda-scoperta__pc-light.png — area di testo con maniglia nativa di ridimensionamento; nessuna indicazione che le modifiche si salvano da sole — nascondere la maniglia, mostrare «Salvato».
- [bassa] scheda-scoperta__pc-light.png — pillole in minuscolo («funziona», «non funziona», «misurato») mentre altrove le pillole hanno iniziale maiuscola — uniformare.

## scheda-scoperta__pc-dark.png
- [media] scheda-scoperta__pc-dark.png — stessi problemi del chiaro (stili diversi per pillole non selezionate, «Esito» nascosto in Dettagli, maniglia nativa visibile in basso a destra dell'area di testo).

## profilo__pc-light.png
- [media] profilo__pc-light.png — barra laterale: siamo nel Profilo ma nessuna voce è evidenziata («Profilo e impostazioni» in fondo resta a riposo) — evidenziarla come voce attiva.
- [media] profilo__pc-light.png — «Promemoria · bloccati» — non si capisce chi li blocca (il browser? l'utente?) né come sbloccarli, e non ha colore d'avviso — «Notifiche bloccate dal browser» in arancione con azione «Come attivarle».
- [media] profilo__pc-light.png — dati incoerenti tra schermate: «109 attività fatte in tutto» qui, «82 attività fatte» nella vista Anno 2026 (con i dati che iniziano a giugno 2026) — verificare il conteggio o specificare il periodo.
- [bassa] profilo__pc-light.png — qui le statistiche hanno etichette chiare («giorni di fila», «fatte negli ultimi 30 giorni»), mentre in Andamento gli stessi numeri (38, 65%) sono nudi — riusare queste etichette in Andamento.
- [bassa] profilo__pc-light.png — nome e motto senza alcuna affordance di modifica (matita) — aggiungere «Modifica».
- [bassa] profilo__pc-light.png — l'avatar «R» in alto a destra, presente in tutte le altre pagine, qui sparisce e l'intestazione cambia altezza — coerenza dell'intestazione.

## profilo__pc-dark.png
- [bassa] profilo__pc-dark.png — le due schede elenco hanno bordo chiaro, le schede nome/statistiche no — uniformare i bordi.
- [media] profilo__pc-dark.png — stessi problemi del chiaro: nessuna voce laterale attiva, «bloccati» ambiguo, 109 vs 82 attività.

## impostazioni__pc-light.png
- [media] impostazioni__pc-light.png — «Backup e ripristino · 1» — numero senza etichetta (1 backup? 1 da ripristinare?) — «1 backup salvato».
- [media] impostazioni__pc-light.png — raggruppamento: «Area predefinita», «Timer», «Musica», «Aspetto» stanno sotto l'intestazione «Account» ma sono preferenze — intestazione propria «Preferenze».
- [media] impostazioni__pc-light.png — su computer le impostazioni si aprono in una finestra stretta (460 px) sopra la pagina Profilo, con sotto-pagine annidate e scorrimento — su desktop una pagina a due colonne (menu a sinistra, dettaglio a destra) sarebbe più adatta.
- [bassa] impostazioni__pc-light.png — maiuscole dei valori incoerenti: «Automatica» maiuscola, «chiedi sempre», «nessuna», «automatico», «su questo dispositivo» minuscole — uniformare.
- [bassa] impostazioni__pc-light.png — «Sincronizzazione · su questo dispositivo» senza freccia: non si capisce se è cliccabile né cosa significa (nessuna sincronizzazione) — «Nessuna: i dati restano su questo dispositivo».
- [bassa] impostazioni__pc-light.png — «Su cosa si basa» — titolo vago — «Le ricerche alla base dell'app» o simile.
- [bassa] impostazioni__pc-light.png — «Area predefinita» usa ⌄ (select), le altre righe › (sotto-pagina): stesso aspetto di riga con comportamenti diversi — ok se voluto, ma il select dovrebbe aprire un menu stilizzato.

## impostazioni__pc-dark.png
- [bassa] impostazioni__pc-dark.png — separatori tra righe quasi invisibili in scuro (le righe si fondono) — separatore più chiaro.
- [media] impostazioni__pc-dark.png — stessi problemi del chiaro («1» senza etichetta, preferenze sotto «Account», finestra stretta su desktop, contenuto in fondo tagliato senza sfumatura).

## impostazioni-fondo__pc-light.png
- [bassa] impostazioni-fondo__pc-light.png — «Registro tecnico» sta sotto «Guida»: è uno strumento diagnostico, non una guida — spostarlo in un gruppo «Avanzate»/«Assistenza» insieme alla versione dell'app (oggi assente).
- [bassa] impostazioni-fondo__pc-light.png — «Rimuovi dati di esempio» con icona «scintille» e stile neutro: è un'azione che cancella dati — icona coerente (gomma/cestino) e conferma; sottotitolo che dica cosa resta.
- [bassa] impostazioni-fondo__pc-light.png — sezione «Reimposta» con due blocchi separati e spaziature diverse (titolo → primo blocco 18 px; tra i blocchi 16 px) — un unico gruppo o separazione più netta per «Cancella tutti i dati».
- [bassa] impostazioni-fondo__pc-light.png — intestazione fissa: la riga «Aspetto» passa sotto il titolo tagliata, la linea di separazione è sottile — ombra all'intestazione.

## imp-timer__pc-light.png
- [media] imp-timer__pc-light.png — «Se prosegui, altri · 25 min» — frase spezzata e oscura — «Se continui, aggiungi 25 min» con sottotitolo esplicativo.
- [media] imp-timer__pc-light.png — tre concetti di timer («Avvio rapido», «Sessione», «Pomodoro») senza spiegazione delle differenze — una riga descrittiva sotto ciascun gruppo.
- [bassa] imp-timer__pc-light.png — «Pausa lunga dopo 4 blocchi · Nessuna» — l'etichetta presume una pausa che poi è «Nessuna»: lettura contraddittoria — «Pausa lunga (ogni 4 blocchi)» con valore «Disattivata».
- [bassa] imp-timer__pc-light.png — finestra di sotto-pagina con altezza e posizione diverse da quella principale (top 72 invece di 48): la finestra «salta» quando si naviga — altezza/posizione fisse.
- [bassa] imp-timer__pc-light.png — il collegamento «‹ Impostazioni» è minuscolo (12 px) sopra il titolo, e la × è allineata al titolo e non al collegamento — pulsante indietro a sinistra del titolo, sulla stessa riga della ×.

## imp-timer__pc-dark.png
- [media] imp-timer__pc-dark.png — stessi problemi del chiaro (testi «Se prosegui, altri», «Pausa lunga… Nessuna», gruppi non spiegati).

## imp-musica__pc-light.png
- [media] imp-musica__pc-light.png — campi «Incolla il link» quasi invisibili: grigio chiarissimo su grigio chiaro, senza bordo — bordo 1 px e fondo bianco come gli altri campi.
- [media] imp-musica__pc-light.png — spaziatura interna dei gruppi: le etichette («Predefinita», «Studio / Università»…) sono a ~10 px dal bordo superiore e il campo arriva al bordo inferiore, mentre le righe semplici hanno padding verticale ~16 px — padding uniforme.
- [media] imp-musica__pc-light.png — «Incolla il link» non dice di quale servizio (Spotify? YouTube? qualsiasi URL?) né cosa succede — segnaposto «https://open.spotify.com/…» e una riga di spiegazione in alto.
- [bassa] imp-musica__pc-light.png — su computer sette campi impilati in una finestra stretta che scorre — layout a due colonne (area → campo) su una riga.
- [bassa] imp-musica__pc-light.png — nomi delle aree senza icona/colore, mentre ovunque le aree hanno la loro icona — aggiungere l'icona.

## imp-musica__pc-dark.png
- [media] imp-musica__pc-dark.png — in scuro i campi si vedono meglio che nel chiaro (incoerenza di contrasto tra temi), ma restano le etichette schiacciate contro il bordo superiore dei gruppi e il segnaposto generico.
- [bassa] imp-musica__pc-dark.png — interruttore spento: pallino grigio su binario grigio, si legge appena — binario più contrastato.

## imp-aspetto__pc-light.png
- [media] imp-aspetto__pc-light.png — «Suoni» e «Vibrazione» stanno sotto «Aspetto» (che dovrebbe riguardare tema e grafica) — rinominare la pagina «Aspetto e suoni» o spostarli in «Notifiche/Feedback».
- [bassa] imp-aspetto__pc-light.png — «Vibrazione» mostrata su computer, dove non ha effetto — nasconderla sui dispositivi senza vibrazione.
- [bassa] imp-aspetto__pc-light.png — nell'elenco Impostazioni il valore è «automatico», qui l'opzione si chiama «Auto» — stessa parola.
- [bassa] imp-aspetto__pc-light.png — questa sotto-finestra è centrata verticalmente (top 226), Timer parte da 72, Musica da 48: la finestra cambia posizione a ogni sotto-pagina — ancorare in alto con posizione fissa.

## imp-aspetto__pc-dark.png
- [bassa] imp-aspetto__pc-dark.png — opzione selezionata «Auto» in grigio medio con testo bianco (stesso stile «disabilitato» delle schede segmentate in scuro) — accento viola o superficie più chiara con bordo.
- [bassa] imp-aspetto__pc-dark.png — stessi problemi di raggruppamento del chiaro (Suoni/Vibrazione sotto Aspetto).

## aree__pc-light.png
- [media] aree__pc-light.png — interruttori accanto a ogni area senza etichetta: non si capisce cosa fanno (area attiva? visibile? nei rituali?) — intestazione di colonna «Attiva» o sottotitolo che spieghi l'effetto («8 attive» compare solo nel Profilo).
- [bassa] aree__pc-light.png — cestino subito accanto all'interruttore: rischio di eliminare per errore; nessun modo visibile di rinominare, cambiare colore/icona o riordinare — menu «⋯» con Rinomina/Icona/Elimina.
- [bassa] aree__pc-light.png — nella riga «Nuova area» l'icona predefinita è il libro, la stessa di «Studio / Università»: sembra già scelta — icona neutra (+) o selettore di icona evidente.
- [bassa] aree__pc-light.png — «Aggiungi» testo viola senza forma di pulsante, a differenza dei «+ Aggiungi» a pillola usati altrove — uniformare.

## aree__pc-dark.png
- [media] aree__pc-dark.png — stessi problemi del chiaro (interruttori senza significato esplicito, cestino accanto all'interruttore).
- [bassa] aree__pc-dark.png — l'icona di «Lavoro» (viola su viola scuro) e di «Studio» (blu su blu scuro) sono poco leggibili — schiarire le icone in scuro.

## sonno-pasti__pc-light.png
- [media] sonno-pasti__pc-light.png — terza interfaccia diversa per gli stessi dati: qui pillole orario/durata con ×, nel pannello della Giornata campi + select nativi con cestino, nel rituale pulsanti sì/no — un unico componente «pasto» riusato ovunque.
- [media] sonno-pasti__pc-light.png — «Promemoria nell'app › Sonno · Dalle 05:00 alle 14:00» — non si capisce cosa significhi la finestra (quando chiedere com'è andato il sonno?) — sottotitolo esplicativo («Ti chiediamo del sonno tra le 05:00 e le 14:00»).
- [bassa] sonno-pasti__pc-light.png — orari allineati a destra dentro pillole larghe («    08:00»): testo spostato verso il bordo — centrare il valore nella pillola come per «15 min».
- [bassa] sonno-pasti__pc-light.png — «Durata 8h» in grigio sembra disabilitato e non ha pillola: chiarire che è calcolata («calcolata: 8 h»).
- [bassa] sonno-pasti__pc-light.png — «8h» qui, «8h» nella Giornata, ma «1 h 30» e «45 min» altrove — formato durata unico («8 h», «1 h 30 min»).

## sonno-pasti__pc-dark.png
- [media] sonno-pasti__pc-dark.png — stessi problemi del chiaro (terzo componente diverso per i pasti, finestra promemoria non spiegata, orari allineati a destra).

## promemoria__pc-light.png
- [media] promemoria__pc-light.png — interruttori disabilitati con pallino a destra ma binario grigio: non si capisce se sono accesi o spenti (resteranno così quando le notifiche verranno sbloccate?) — mostrare lo stato reale in versione attenuata (viola chiaro se acceso).
- [media] promemoria__pc-light.png — nomi dei promemoria non allineati ai rituali: qui «Priorità del giorno» (16:30), che non esiste nell'elenco Rituali; mancano «Sonno e pasti» e «Bilancio della settimana» — usare gli stessi nomi e lo stesso elenco.
- [bassa] promemoria__pc-light.png — riga «Dalle 23:00 alle 07:00»: «Dalle» rientrato di 16 px in più delle altre etichette — allineare o usare un rientro chiaro con linea guida.
- [bassa] promemoria__pc-light.png — il riquadro «Notifiche bloccate» spiega bene il problema ma non offre un'azione — aggiungere «Come riattivarle» con istruzioni per il browser in uso.

## promemoria__pc-dark.png
- [bassa] promemoria__pc-dark.png — riquadro d'avviso marrone scuro con icona grigia: in scuro non comunica «attenzione» — bordo/icona ambra.
- [media] promemoria__pc-dark.png — stessi problemi del chiaro (stato degli interruttori disabilitati illeggibile, nomi diversi dai rituali).

## diario__pc-light.png
- [alta] diario__pc-light.png — barra laterale: è evidenziato «Andamento» mentre il collegamento indietro dice «‹ Profilo» — l'utente non sa dove si trova; evidenziare la sezione corretta (Profilo) o rendere il Diario parte di Andamento in modo coerente.
- [media] diario__pc-light.png — «‹ Profilo» è a x≈293, fuori dalla colonna del contenuto (che parte a 424) — allinearlo al bordo sinistro della colonna, sopra il titolo.
- [media] diario__pc-light.png — incoerenza di navigazione: Diario è una pagina intera, mentre Aree, Sonno e pasti, Promemoria e Impostazioni (dallo stesso elenco del Profilo) si aprono in finestre — scegliere un modello unico.
- [media] diario__pc-light.png — icona «annulla» (↶) su ogni riga senza etichetta né tooltip: non si capisce se annulla l'azione, la elimina o la ripristina — tooltip «Annulla questa azione» e conferma.
- [media] diario__pc-light.png — select «Relazioni & Sociale ⌄» con bordo dentro le righe del diario: controllo di modifica che compare in un registro di sola lettura, con stile diverso da tutte le altre pillole area — mostrarlo come etichetta, modificabile al passaggio del mouse.
- [bassa] diario__pc-light.png — «⭐Priorità» attaccato al titolo senza spazio e con stella in testo — usare la pillola «Priorità» del rituale.
- [bassa] diario__pc-light.png — testi: «Annotato» (maschile) e «Completata» (femminile) mescolati; «focus» inglese accanto a «energia» e «umore» — «Annotata/Completata» o forme neutre; «concentrazione».
- [bassa] diario__pc-light.png — orari e icona ↶ allineati più in basso della prima riga di testo (~8 px) — allineamento alla prima riga.

## diario__pc-dark.png
- [alta] diario__pc-dark.png — stessi problemi del chiaro: «Andamento» evidenziato con «‹ Profilo» come ritorno, collegamento indietro fuori colonna, icone ↶ senza etichetta, select area nel registro.
- [bassa] diario__pc-dark.png — la riga «Regalo per il compleanno di mamma (tra 3 settimane!)» va a capo a ~930 px lasciando ~70 px vuoti prima delle icone, mentre altre righe arrivano a ~995 — larghezza massima del testo incoerente tra le righe.

## timer-scelta__pc-light.png
- [media] timer-scelta__pc-light.png — la finestra «Timer» non dice per quale attività parte (Ripasso flashcard) — sottotitolo con il nome dell'attività.
- [media] timer-scelta__pc-light.png — «Avvio rapido» e «Sessione» non sono spiegati: la differenza (5 min estendibili vs 25 min fissi) si capisce solo dalle impostazioni — una riga di descrizione sotto ogni voce.
- [bassa] timer-scelta__pc-light.png — nessuna opzione «ricorda la scelta» malgrado l'impostazione «Timer predefinito · Chiedi sempre» esista — collegamento rapido «Usa sempre questo».
- [bassa] timer-scelta__pc-light.png — «nessun limite» minuscolo, gli altri valori sono numeri — «Senza limite».

## timer-scelta__pc-dark.png
- [bassa] timer-scelta__pc-dark.png — separatori tra le voci invisibili e il velo lascia molto leggibile la pagina dietro: la finestra si stacca poco — separatori più chiari, velo più scuro.
- [media] timer-scelta__pc-dark.png — stessi problemi del chiaro (attività non indicata, voci non spiegate).

## timer-concentrazione__pc-light.png
- [media] timer-concentrazione__pc-light.png — in tema chiaro lo schermo di concentrazione è nero (scelta voluta), ma il pulsante «Pausa» usa il lilla chiarissimo del tema chiaro: su nero è un blocco abbagliante che domina più del timer — usare i colori del tema scuro in questa schermata (pulsante scuro con bordo).
- [media] timer-concentrazione__pc-light.png — tre modi di uscire senza differenze chiare: × in alto a destra, «Termina sessione», «Fatto» — spiegare (× = riduci? Termina = interrompi senza segnare?) o ridurre a due azioni.
- [bassa] timer-concentrazione__pc-light.png — «Pomodoro · blocco 1» senza totale — «blocco 1 di 4».
- [bassa] timer-concentrazione__pc-light.png — icona di «Termina sessione» è un calendario con ×, la stessa di «Termina l'abitudine»: metafora sbagliata — icona stop (■).
- [bassa] timer-concentrazione__pc-light.png — su computer mancano le scorciatoie da tastiera (Spazio = pausa, Invio = fatto, Esc = chiudi) — mostrarle in piccolo.

## timer-concentrazione__pc-dark.png
- [bassa] timer-concentrazione__pc-dark.png — anello di avanzamento (quadrato arrotondato) grigio scurissimo su nero: a 25:00 sembra solo una cornice decorativa — traccia leggermente più chiara e avanzamento in accento ben visibile.
- [media] timer-concentrazione__pc-dark.png — stessi problemi del chiaro (tre uscite ambigue, «blocco 1» senza totale, icona «Termina sessione»). In scuro il pulsante «Pausa» è corretto: conferma che nel tema chiaro va riusato questo stile.

## cattura__pc-light.png
- [alta] cattura__pc-light.png — finestra «Scrivi un pensiero» senza pulsante per salvare: c'è solo «Chiudi», che fa temere di perdere il testo; non c'è indicazione che si salva con Invio — pulsante «Salva» (o suggerimento «Invio per salvare · Esc per chiudere») e chiarire cosa fa «Chiudi».
- [media] cattura__pc-light.png — nomi diversi per la stessa funzione: «Aggiungi una nota» (barra laterale), «Scrivi un pensiero…» (qui), e il risultato finisce in «Da sistemare» come «Annotato» — un solo nome («Nota veloce») e dire dove finisce («Finisce in Da sistemare»).
- [bassa] cattura__pc-light.png — la linea divisoria non arriva ai bordi (rientrata di ~5 px a sinistra e destra) — a tutta larghezza o allineata al padding del testo.
- [bassa] cattura__pc-light.png — fondo sfocato qui, mentre le altre finestre usano un velo scuro senza sfocatura — stesso trattamento per tutte le finestre.
- [bassa] cattura__pc-light.png — il campo vuoto non mostra un cursore/focus evidente — anello di focus o cursore visibile per confermare che si può scrivere subito.

## cattura__pc-dark.png
- [alta] cattura__pc-dark.png — come nel chiaro: nessun pulsante di salvataggio, solo «Chiudi».
- [bassa] cattura__pc-dark.png — la sfocatura del fondo lascia un alone rettangolare visibile attorno alla colonna centrale (bordi netti a x≈400 e x≈1130) — sfocatura uniforme su tutta la pagina.

## menu-oggi-avatar__pc-light.png
- [media] menu-oggi-avatar__pc-light.png — il clic sull'avatar «R» porta direttamente alla pagina Profilo, identica a «Profilo e impostazioni» della barra laterale: due ingressi per la stessa destinazione e nessun menu — su computer togliere l'avatar o farne un menu rapido (tema, impostazioni, profilo).
- [media] menu-oggi-avatar__pc-light.png — dopo il clic nessuna voce della barra laterale è evidenziata (né «Oggi» da cui si arriva, né «Profilo e impostazioni») — evidenziare «Profilo e impostazioni».

## menu-oggi-avatar__pc-dark.png
- [media] menu-oggi-avatar__pc-dark.png — stessi problemi del chiaro: l'avatar apre la stessa pagina della voce laterale e nessuna voce laterale risulta attiva.

## Riassunto

Revisionati 82 screenshot (computer 1280×800, chiaro e scuro). Ci sono difetti reali. Qui sotto sono raggruppati per tema e in ordine di gravità.

### ALTA
1. **Numeri senza etichetta o in contraddizione tra loro**
   - Andamento: «🔥 38» e «65% · 81 di 124» non dicono cosa sono, né su quale periodo. Il Profilo ha già le etichette giuste da riusare: «giorni di fila» e «fatte negli ultimi 30 giorni».
   - Andamento: la serie dice «38 giorni di fila», ma nella riga degli ultimi 7 giorni il venerdì è vuoto.
   - Settimana: «17 ago +4», «+1» senza spiegazione. Anno: «7 / 25 / 17» in verde senza etichetta.
   - Agosto ha 17 giorni attivi nella vista Anno e 18 nella vista Mese. Le attività fatte sono 109 nel Profilo e 82 nella vista Anno 2026.
2. **La vista Settimana è rotta su desktop**: il titolo dice «17–23 ago» ma le colonne sono solo Lun–Ven. Le colonne stanno nei 680 px centrali, quindi i titoli vengono troncati («Camminata /...») mentre ai lati restano ~180 px vuoti.
3. **«Scrivi un pensiero» (aggiunta di una nota)**: non c'è un pulsante per salvare, solo «Chiudi», e non c'è nessuna indicazione su Invio o Esc.
4. **Navigazione laterale sbagliata o assente**: nel Diario è evidenziato «Andamento» mentre il ritorno dice «‹ Profilo». In Profilo e nelle pagine aperte dall'avatar nessuna voce è evidenziata. L'avatar «R» e «Profilo e impostazioni» portano alla stessa pagina.
5. **Barra laterale non a tutta altezza durante il trascinamento** (trascinamento-in-corso): sotto y≈740 si vede il fondo della pagina e le voci in basso salgono. Nello stesso stato la zona «Togli l'orario» sborda oltre la colonna del contenuto.

### MEDIA
6. **Lo stesso componente cambia forma da una schermata all'altra**
   - Casella «segna fatto»: cerchio a sinistra (Adesso), quadrato (Senza orario), quadratino colorato (Mese), cerchio grande a destra (Abitudini). Nell'elenco Da fare non c'è proprio.
   - Area: pillola viola, pillola verde, testo con ⌄, select nativo, select con bordo nel Diario.
   - Sonno e pasti si compilano in tre modi diversi: campi più select nativi (Giornata), sì/no (Rituale), pillole con × (Profilo).
   - Scala 1–5: grandi riquadri nel check-in, quadratini grigi in Fine giornata.
   - Campi di testo: bianchi con bordo oppure grigi senza bordo.
   - Pillole non selezionate: grigie oppure bianche, anche dentro la stessa finestra.
   - Elimina: riga rossa con icona oppure pulsante centrato.
   - Chiusura di un rituale: «Salva», «Salva» + «Fatto», «Registra».
7. **Controlli nativi non stilizzati**: i `<select>` in Da sistemare, Nuova attività (più alto delle pillole accanto) e nel pannello sonno della Giornata, e la maniglia di ridimensionamento nelle aree di testo (Bilancio della settimana, Scheda scoperta).
8. **Lo spazio del desktop non è usato**: tutto sta in una colonna da ~680 px.
   - Le finestre di dettaglio sono larghe 460 px: i titoli vanno a capo e serve scorrere molto.
   - Le impostazioni sono finestre annidate e cambiano posizione a ogni sotto-pagina.
   - In Fine giornata nome dell'area e scala 1–5 stanno su due righe.
   - I cerchi dei giorni della nuova abitudine sono sparsi su tutta la larghezza.
   - La scheda «Costanza» è vuota per metà.
   - Rituali e Abitudini lasciano vuoti due terzi dello schermo.
9. **Mancano legende e assi**: anelli e pallini del Mese, intensità della mappa Anno, stati dei giorni nel calendario dell'abitudine (che non dice nemmeno il mese), grafico dell'esperimento senza date e con le etichette delle medie sopra i punti, «1 di 3» / «1 di 4» negli elenchi, «🔥3» sulle abitudini, «1 di 2» in Adesso, «Backup e ripristino · 1».
10. **Testi italiani ambigui o poco naturali**:
    - «Sposta a domani quella non fatta», «Se prosegui, altri», «Pausa lunga dopo 4 blocchi · Nessuna», «Non ce l'ho fatta», «Orari abituali», «Come sempre · 23:30–07:30» (sembra un valore ma è un'azione), «Promemoria · bloccati», «Salvala in «Funziona»», «Un minuto», «4 record».
    - Livelli di prova incoerenti tra loro: «misurato / lo noto ogni volta / notato una volta».
    - «Annotato» accanto a «Completata».
    - Parole inglesi: «focus», «XP».
    - Maiuscole incoerenti in pillole e valori: «ogni giorno» contro «Domani», «Automatica» contro «automatico».
11. **Nomi incoerenti per lo stesso concetto**: «Pianifica la giornata» / «Piano del giorno»; «Priorità del giorno» nei promemoria non esiste tra i rituali; «Fissa in alto» / «Importanti» / «Priorità»; «Aggiungi una nota» / «Scrivi un pensiero».
12. **Stati e azioni poco chiari**:
    - Scheda di un'attività fatta: lo stato non viene dichiarato.
    - Check-in già «fatto» ma con ancora «Registra +3 XP».
    - Rituale «da fare» con «2 di 3».
    - Il badge «1» su Rituali non si spiega.
    - Il primo «+ Oggi» è sempre pieno, gli altri no.
    - Le icone ↶ del Diario e gli interruttori delle Aree non hanno etichetta.
    - Gli interruttori disabilitati dei Promemoria non mostrano se sono accesi o spenti.
    - Tre uscite ambigue dal timer: ×, «Termina sessione», «Fatto».
13. **Azioni distruttive mal collocate**: «Termina l'abitudine» sta tra due azioni innocue, «Scarta» ha lo stesso peso di «Da fare», cestini piccoli sono accanto a interruttori e calendari, «Rimuovi dati di esempio» ha l'icona «scintille».
14. **Raggruppamenti nelle Impostazioni**: le preferenze stanno sotto «Account», Suoni e Vibrazione sotto «Aspetto» (e Vibrazione su desktop non serve), «Registro tecnico» sotto «Guida». In Musica i campi sono quasi invisibili e le etichette schiacciate contro il bordo.

### BASSA
15. **Tema scuro**:
    - Gli stati selezionati (voce laterale, schede segmentate, «Auto») sono grigi e sembrano disabilitati. In chiaro le stesse sottoschede sono viola.
    - Alcune schede hanno il bordo e altre no.
    - Contrasto basso per: caselle di spunta nei blocchi colorati, giorni di luglio e numeri non previsti, icone delle aree, cella di oggi nella vista Anno, separatori, interruttori spenti, pulsanti «Salva» e «Registra» tenui.
    - Le finestre si staccano poco dal velo.
16. **Tema chiaro**:
    - Velo delle finestre troppo leggero.
    - La pillola «Priorità» ha testo bianco su lilla chiaro.
    - Nello schermo nero del timer il pulsante «Pausa» usa il lilla chiaro e abbaglia.
    - Interruttori spenti quasi invisibili.
17. **Dettagli di allineamento e spaziatura**:
    - Etichetta «10:30» sopra i blocchi.
    - Riga opzioni di Nuova attività rientrata di 12 px.
    - Statistiche del Bilancio non allineate.
    - «‹ Profilo» fuori dalla colonna.
    - Intestazioni fisse delle finestre senza ombra, con il contenuto tagliato sotto.
    - «Dalle» rientrato.
    - Orari allineati a destra dentro le pillole.
    - Formato delle durate incoerente: «8h», «1 h 30», «45 min».
    - Frecce di navigazione diverse tra Giorno e Settimana.
    - Su desktop mancano le scorciatoie da tastiera (smistamento, timer).
