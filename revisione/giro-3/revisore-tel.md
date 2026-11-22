# Revisione telefono — giro 3

## oggi-adesso__tel-light.png
- [media] oggi-adesso__tel-light.png — barra segmentata in alto, badge «1» su Rituali — il badge è incollato all'angolo superiore destro del segmento, sborda quasi fino al bordo del contenitore e non è allineato con il badge «6» della tab bar (forme e posizioni diverse) — usare un unico componente badge (stesso diametro, stesso colore pieno) posizionato a ridosso dell'etichetta, non dell'angolo del segmento.
- [media] oggi-adesso__tel-light.png — riga data / «1 di 2» — «1 di 2» non dice cosa conta (attività? rituali?); la barra verde non ha etichetta — scrivere «1 di 2 fatte» o «1 attività su 2» e legare la barra al conteggio.
- [bassa] oggi-adesso__tel-light.png — pillola «🔥 38 giorni» a destra — non è allineata verticalmente né al titolo né alla barra (sta a metà fra i due), è molto voluminosa rispetto al titolo — allinearla alla linea di base del titolo o ridurla a un chip compatto; dare un'etichetta accessibile («serie di 38 giorni»).
- [bassa] oggi-adesso__tel-light.png — riga «Pianifica la giornata / Un minuto» — «Un minuto» come sottotitolo è ambiguo (durata? tempo rimasto?) — «Ci vuole un minuto» o «≈ 1 min».
- [media] oggi-adesso__tel-light.png — scheda principale «Ripasso flashcard» — gerarchia delle azioni incoerente: «Timer» è un bottone bordato con ombra, «Salta oggi» è testo nudo con icona ⏭ a destra; i due secondari dovrebbero avere lo stesso peso — rendere entrambi bottoni secondari della stessa altezza (o entrambi testo), icona di «Salta» a sinistra come per Timer.
- [bassa] oggi-adesso__tel-light.png — scheda principale — spazio interno sotto i bottoni (~20px) minore di quello sopra l'etichetta area (~24px) e il chip «Abitudine» è più rientrato visivamente del titolo — uniformare padding 20/20 e allineare chip, titolo e bottoni allo stesso margine.
- [bassa] oggi-adesso__tel-light.png — sezione «Poi» — il cerchio di spunta (~44px) è sproporzionato rispetto al testo e più grande di quello delle altre liste — ridurlo a 24–28px mantenendo l'area di tocco a 44.
- [bassa] oggi-adesso__tel-light.png — tab bar — il «+» viola è dentro la barra ma separato da un divisore, risulta un quinto tab spaiato e più alto delle altre voci; il badge «6» copre l'icona di Attività — FAB separato sopra la barra oppure tab centrale; badge spostato in alto a destra dell'icona senza coprirla.
- [bassa] oggi-adesso__tel-light.png — metà inferiore — grande vuoto fra «Poi» e la tab bar senza indicazione di cosa c'è dopo (es. «Più tardi», «Nient'altro oggi») — aggiungere un fondo di lista con stato («Nient'altro in programma · Vedi la giornata»).

## giornata-giorno__tel-light.png
- [alta] giornata-giorno__tel-light.png — parte alta (0–250px) — quattro livelli di intestazione impilati (segmentato Adesso/Giornata/Rituali, sotto-tab Giorno/Settimana/Mese/Anno, navigazione «‹ Oggi ›», riga sonno) mangiano quasi un terzo dello schermo prima che inizi il calendario — fondere titolo e frecce nella riga dei sotto-tab, rendere la riga sonno parte del calendario (fascia in cima) o compattarla; obiettivo: calendario visibile da ~170px.
- [media] giornata-giorno__tel-light.png — sotto-tab Giorno/Settimana/Mese/Anno — stile diverso dal segmentato superiore (tinta viola piena sul selezionato vs pillola bianca con ombra) senza contenitore: due controlli dello stesso tipo con due linguaggi — usare lo stesso componente segmentato (più piccolo) o tab sottolineati.
- [media] giornata-giorno__tel-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — le tre icone pasto senza testo sono criptiche e il chevron non dice cosa apre — «Sonno 23:30–07:30 · 3 pasti» con etichetta, o almeno un titolo «Sonno e pasti».
- [media] giornata-giorno__tel-light.png — blocco «Organizzare cena con il gruppo» — testo ancorato in basso al blocco invece che in alto; la linea dell'ora attuale (10:30) passa a 6px dall'orario «09:30–11:00» e quasi lo tocca; l'icona stella prima del titolo è inspiegata — testo in alto con padding 8px, linea dell'ora sotto il contenuto (z-index ma con alone) e spiegare/rimuovere la stella.
- [bassa] giornata-giorno__tel-light.png — blocco completato — barrato + grigio su sfondo grigio: lo stato «fatto» si legge, ma la striscia rosa a sinistra resta piena e satura, incoerente con lo stato attenuato — attenuare anche la striscia.
- [bassa] giornata-giorno__tel-light.png — fascia tratteggiata 07:00–07:30 — nessuna etichetta: non si capisce che è la fine del sonno — aggiungere «Sveglia 07:30» o icona letto.
- [bassa] giornata-giorno__tel-light.png — blocchi «Colazione» e «Pranzo» — etichetta centrata mentre le attività hanno testo allineato a sinistra; manca l'orario — allineare a sinistra come gli altri blocchi con orario.
- [bassa] giornata-giorno__tel-light.png — pulsanti ‹ › attorno a «Oggi» — cerchi da 44px bianchi molto pesanti rispetto al titolo; manca la data reale (Oggi = che giorno?) — «Oggi · mar 18 ago» e frecce come icone semplici.

## giornata-giorno-fondo__tel-light.png
- [media] giornata-giorno-fondo__tel-light.png — blocchi abitudine «Camminata / movimento» e «Leggere 20 minuti» — stile (solo bordo verde, sfondo bianco) completamente diverso dalle attività (fondo pieno colorato + striscia), e «Leggere 20 minuti» perde l'orario — stesso componente blocco per entrambi, distinguendo l'abitudine con l'icona ↻ e un fondo tenue; mostrare sempre l'orario (anche inline «22:00 · Leggere 20 minuti» nei blocchi bassi).
- [media] giornata-giorno-fondo__tel-light.png — sezione «Senza orario 1» — l'intestazione sta fuori dalla card e la card sotto ha l'angolo superiore piatto/attaccato, sembra tagliata — card con angoli tutti arrotondati e 8px di distanza dal titolo, oppure titolo dentro la card.
- [media] giornata-giorno-fondo__tel-light.png — riga «Ripasso flashcard» — casella quadrata, mentre in Adesso e nelle liste la spunta è un cerchio; icona libro blu e icona orologio a destra senza spiegazione (l'orologio = «assegna orario»?) — usare la stessa spunta circolare ovunque; sostituire l'orologio con «+ orario» o tooltip/etichetta.
- [bassa] giornata-giorno-fondo__tel-light.png — campo «Nuova attività…» + «Aggiungi» — il pulsante è alto quanto il campo meno 8px e ha fondo lilla tenue: sembra disabilitato anche se è attivo — se il campo è vuoto mostrarlo disabilitato in modo esplicito, altrimenti primario pieno.
- [bassa] giornata-giorno-fondo__tel-light.png — link «Sposta 1 non fatta a domani» — italiano telegrafico — «Sposta a domani l'attività non fatta» / «Sposta a domani (1)».
- [bassa] giornata-giorno-fondo__tel-light.png — fondo del calendario — la fascia tratteggiata del sonno dalle 23:30 è attaccata al bordo inferiore della card senza respiro e l'etichetta «00:00» è a filo del bordo — 12px di padding inferiore.

## giornata-settimana__tel-light.png
- [media] giornata-settimana__tel-light.png — intestazione «‹ 17–23 ago ›» — titolo allineato a sinistra subito dopo la freccia, mentre in Giorno «Oggi» è centrato fra le frecce: stessa navigazione, due impaginazioni — centrare sempre (o sempre a sinistra) in tutte le viste.
- [media] giornata-settimana__tel-light.png — lista di «Lunedì 17» — la colonna orario c'è solo per alcune righe, le altre partono a 90px lasciando un buco a sinistra: allineamento frastagliato — colonna orario fissa con «—» o «Senza orario» come sottogruppo, oppure orario come sottotitolo a destra.
- [media] giornata-settimana__tel-light.png — riga «Inbox a zero + piani per do…» — titolo troncato a causa del link «Sposta» — andare a capo su due righe o spostare «Sposta» in un'azione a scorrimento / menu.
- [bassa] giornata-settimana__tel-light.png — icone abitudine ↻ — verdi per Camminata/Leggere, blu per Ripasso flashcard senza motivo leggibile (colore area?) — se è il colore dell'area dichiararlo con un pallino come per le attività, non cambiando il colore dell'icona.
- [bassa] giornata-settimana__tel-light.png — striscia dei giorni — solo 17 e 18 hanno l'anello di avanzamento; i giorni futuri non hanno né anello vuoto né segno, quindi la riga sembra disallineata — mostrare anelli vuoti grigi su tutti i giorni.
- [bassa] giornata-settimana__tel-light.png — «Lunedì 17» grigio vs «Martedì 18» nero + chip «Oggi» — il grigio per il passato sembra uno stato disabilitato — mantenere il nero e usare un'etichetta «ieri».

## giornata-mese__tel-light.png
- [media] giornata-mese__tel-light.png — pallini colorati sotto i giorni del calendario — nessuna legenda, colori (rosa, rosso, verde scuro, arancio, blu) non spiegati e molto piccoli (4px) — legenda «colori = aree» sotto la griglia o rimuoverli; se restano, almeno 6px.
- [media] giornata-mese__tel-light.png — giorno 18 (oggi) — doppio evidenziatore: cerchio viola pieno + riquadro grigio di selezione + anello verde: tre segnali sullo stesso numero — tenere cerchio pieno per oggi e solo l'anello per il progresso; il riquadro solo quando la selezione è diversa da oggi.
- [media] giornata-mese__tel-light.png — anteprima «Oggi» sotto il calendario, riga «Leggere 20 minuti» — terza variante di casella (quadratino verde con bordo spesso) dopo cerchio grande e quadrato grigio — unificare la spunta in tutta l'app.
- [bassa] giornata-mese__tel-light.png — riepilogo «18 giorni attivi   58 cose fatte» — «cose fatte» è colloquiale e diverso da «fatte» della Settimana — «58 completate» / «58 attività fatte», usando la stessa formula in Settimana e Mese.
- [bassa] giornata-mese__tel-light.png — pulsanti ‹ › — qui sono quadrati arrotondati mentre in Giorno appaiono circolari — stessa forma ovunque.
- [bassa] giornata-mese__tel-light.png — «Apri il giorno ›» — duplica il tocco sul giorno nel calendario; il titolo «Oggi» non cambia quando si seleziona un altro giorno? (da verificare) — titolo dinamico col giorno selezionato.

## giornata-anno__tel-light.png
- [alta] giornata-anno__tel-light.png — card «Ago 17» vs vista Mese «18 giorni attivi» — lo stesso mese dà due numeri diversi di giorni attivi (17 qui, 18 in Mese) — usare la stessa definizione di «giorno attivo» (incluso/escluso oggi) in entrambe le viste.
- [media] giornata-anno__tel-light.png — riquadro statistiche «49 giorni attivi | 82 fatte | 1874 XP» — formato diverso dal Mese (lì numeri inline senza card); «1874» senza separatore delle migliaia; «XP» compare solo qui senza spiegazione — stesso componente statistiche in Settimana/Mese/Anno, «1.874», spiegare XP o toglierlo da questa vista.
- [media] giornata-anno__tel-light.png — mini-calendari dei mesi — le griglie sono allineate a sinistra e lasciano un margine destro più largo di quello sinistro dentro ogni card; celle da ~10px poco leggibili; 12 card con bordo = muro di riquadri — centrare la griglia, togliere i bordi delle card (solo spaziatura) e aumentare le celle.
- [bassa] giornata-anno__tel-light.png — mesi senza dati (Gen–Mag) — griglie grigie identiche e conteggio assente: sembra caricamento — mostrare «0» o attenuare l'intero mese.
- [bassa] giornata-anno__tel-light.png — giorno di oggi nella griglia di Agosto — evidenziato con un quadratino bordato viola minuscolo, quasi invisibile — punto più marcato o anello pieno.

## giornata-sonno-aperto__tel-light.png
- [media] giornata-sonno-aperto__tel-light.png — bordo superiore (0–20px) — i sotto-tab Giorno/Settimana/Mese/Anno sono tagliati a metà dal bordo dello schermo (pagina scorsa senza intestazione fissa) e finiscono sotto la status bar — o renderli fissi con fondo, o lasciarli scorrere via del tutto; mai mezzi visibili; rispettare la safe area.
- [alta] giornata-sonno-aperto__tel-light.png — menu durata «15 min ▾», «45 min ▾» — sono select native del browser con freccia di sistema nera, non stilizzate: stridono con il resto dell'interfaccia — sostituire con componente custom (stepper o menu) con chevron dell'app.
- [media] giornata-sonno-aperto__tel-light.png — griglia del pannello — la riga «A letto / Sveglia» ha i campi in posizioni diverse da quelle dei pasti (campo orario a x≈96 sopra, x≈146 sotto), le etichette hanno pesi e icone diversi — impaginare tutto su una griglia a 3 colonne (etichetta · orario · durata) con stessa larghezza dei campi.
- [media] giornata-sonno-aperto__tel-light.png — azioni «+ Pasto · Ripristina · Ritmo di base» — tre link affiancati senza gerarchia; «Ripristina» e «Ritmo di base» non dicono cosa fanno (ripristina cosa? imposta come predefinito?) — «+ Aggiungi pasto» come azione principale; «Usa i miei orari abituali» e «Salva come abituali» spiegati, eventualmente in un menu ⋯.
- [bassa] giornata-sonno-aperto__tel-light.png — icone cestino — piccole (14px) e attaccate al bordo destro (4px) con area di tocco insufficiente — area 44px, margine destro uguale al sinistro (16px).
- [bassa] giornata-sonno-aperto__tel-light.png — riepilogo in testa al pannello aperto — ripete esattamente i valori già nei campi sotto (23:30 → 07:30) — quando aperto mostrare solo il titolo «Sonno e pasti».

## giornata-scheda-blocco__tel-light.png
- [alta] giornata-scheda-blocco__tel-light.png — azioni «Segna come da fare» e «Sposta in Da fare» — stessa espressione «da fare» con due significati (stato non completato vs lista Da fare): l'utente non capisce la differenza — «Segna come non fatta» per lo stato e «Togli dal calendario» / «Rimetti nella lista» per lo spostamento.
- [media] giornata-scheda-blocco__tel-light.png — titolo «Organizzare cena / con il gruppo» — va a capo a metà larghezza lasciando ~150px vuoti a destra (max-width troppo stretto) — titolo a tutta larghezza meno il pulsante di chiusura.
- [media] giornata-scheda-blocco__tel-light.png — foglio — nessun pulsante di chiusura né «Fine»; solo la maniglia — aggiungere ✕ o «Fine» in alto a destra.
- [media] giornata-scheda-blocco__tel-light.png — «Segna come da fare» centrato come testo grigio — è l'azione principale della scheda ma è il meno visibile; galleggia fra meta e campi con spazi diversi sopra (36px) e sotto (20px) — bottone secondario a tutta larghezza, spazi uguali.
- [bassa] giornata-scheda-blocco__tel-light.png — valori «09:30 ⓧ», «1 h 30 ⓧ» — pillole lilla con la ✕ di cancellazione dentro: la ✕ grigia su lilla ha poco contrasto e il tocco rischia di cancellare invece di modificare; «1 h 30» con spazio strano — «1 h 30 min» o «1:30»; ✕ fuori dalla pillola o solo in modifica.
- [bassa] giornata-scheda-blocco__tel-light.png — «Area: Relazioni & Sociale» — «&» in un'interfaccia italiana suona tradotto — «Relazioni e vita sociale».
- [bassa] giornata-scheda-blocco__tel-light.png — fondo del foglio — «Elimina» a 30px dal bordo inferiore senza safe area per la home bar — padding inferiore ≥34px + env(safe-area-inset-bottom).

## giornata-scheda-abitudine__tel-light.png
- [media] giornata-scheda-abitudine__tel-light.png — pulsante «✓ Fatta» — in Adesso lo stesso gesto su un'abitudine dice «Fatto» (maschile), qui «Fatta»: incoerenza di genere/etichetta — scegliere una forma neutra unica («Fatto ✓» come stato, o «Segna come fatta») e usarla ovunque.
- [media] giornata-scheda-abitudine__tel-light.png — lista azioni «Salta oggi / Termina l'abitudine / Apri l'abitudine» — l'azione distruttiva (rossa) sta in mezzo, la navigazione in fondo — ordine: Apri l'abitudine, Salta oggi, poi separata in fondo Termina l'abitudine.
- [bassa] giornata-scheda-abitudine__tel-light.png — meta «↻ Abitudine · Oggi» — qui con icona, nella scheda attività «Attività · Oggi» senza icona; distanza meta→pulsante 14px contro 36px nella scheda attività — stessi spazi e stessa struttura nelle due schede.
- [bassa] giornata-scheda-abitudine__tel-light.png — «Salute & Sport» — «&» e maiuscola su «Sport» poco italiani — «Salute e sport».
- [bassa] giornata-scheda-abitudine__tel-light.png — foglio — anche qui niente pulsante di chiusura e «Apri l'abitudine» a 30px dal fondo senza safe area — come sopra.

## rituali__tel-light.png
- [media] rituali__tel-light.png — badge della tab Rituali — nelle altre schermate il badge dice «1», ma qui risultano 4 rituali non completati (3 «da fare» + 1 «da compilare») — il badge deve contare la stessa cosa che la lista mostra (o solo il rituale del momento, spiegandolo).
- [media] rituali__tel-light.png — icona di «Piano del giorno» — è l'unica piena viola, le altre lilla chiaro, senza spiegare perché (è il rituale del momento?) — aggiungere un'etichetta «Adesso» / orario consigliato, o rendere tutte le icone uguali.
- [media] rituali__tel-light.png — colonna stato a destra — «da fare / 2 di 3 scelte», «da compilare / 0 di 4», «✓ fatto», «da fare»: altezze di riga identiche ma testi su 1 o 2 righe, allineati a destra in modo frastagliato; «da fare» con «2 di 3 scelte» è contraddittorio — un solo formato: chip di stato + progresso opzionale sotto il titolo a sinistra.
- [media] rituali__tel-light.png — schermata intera — nessun titolo né orario dei rituali (quando si fa «Fine giornata»?), e oltre metà schermo vuota — sottotitolo per ogni rituale con il momento («mattina», «ore 21», «domenica»), titolo pagina, eventuale suggerimento/storico sotto.
- [bassa] rituali__tel-light.png — nomi — «Fine giornata» e «Bilancio della settimana» qui, mentre all'apertura i rituali si chiamano altrimenti (vedi schede seguenti) — un nome unico per ogni rituale.

## rituale-piano__tel-light.png
- [alta] rituale-piano__tel-light.png — contenuto aperto di «Piano del giorno» — nessuna istruzione: non si capisce che bisogna scegliere 3 priorità («2 di 3 scelte» sta solo in alto a destra in 11px) — riga introduttiva «Scegli le 3 cose più importanti di oggi» con contatore «2/3» accanto.
- [media] rituale-piano__tel-light.png — riga «Organizzare cena con il gruppo» — barrata (già fatta) ma con il chip «☆ Priorità» acceso: scegliere come priorità una cosa già fatta è un controsenso; il chip c'è solo sulla prima riga, la seconda non ha modo visibile di essere marcata — mostrare il chip/stella su tutte le righe (spento/acceso) e nascondere o attenuare le già fatte.
- [bassa] rituale-piano__tel-light.png — icone a destra (persone rosa, carta gialla) — icone di area senza etichetta, diverse da quelle usate altrove (pallini colorati) — usare il pallino area coerente con la Settimana o il nome dell'area.
- [media] rituale-piano__tel-light.png — pulsante «💾 Salva +5 XP» — icona floppy datata; il premio XP dentro il bottone compete con l'azione — «Conferma il piano» con XP mostrato come piccola nota sotto o come feedback dopo il tocco.
- [bassa] rituale-piano__tel-light.png — «Quando inizi?» — campo a testo libero con esempio misto ora+luogo: non chiaro se è un orario (dovrebbe essere un time picker) — dividere «Ora di inizio» (selettore) e «Dove» opzionale, o rinominare «Il tuo primo passo».
- [bassa] rituale-piano__tel-light.png — fisarmonica aperta dentro la card — campi grigi in card bianca in card con bordo: tre livelli di contenitori; le altre voci restano visibili sotto e spingono via il contenuto — aprire il rituale a pagina/foglio dedicato.

## rituale-sonno-pasti__tel-light.png
- [alta] rituale-sonno-pasti__tel-light.png — due pulsanti di salvataggio — «Salva» lilla a metà (solo per il sonno) e un altro pulsante primario viola in fondo, che è nascosto sotto la tab bar (si vede solo il bordo superiore) — un solo salvataggio a fine rituale; padding inferiore della pagina ≥ altezza tab bar + 16px.
- [media] rituale-sonno-pasti__tel-light.png — sezione «Sonno» — gli stessi dati del pannello in La giornata (campi + select) qui sono righe con orologio: due UI diverse per lo stesso dato — un componente unico per orari sonno/pasti.
- [media] rituale-sonno-pasti__tel-light.png — «Come sempre · 23:30–07:30» in viola a destra — non si capisce se è un'informazione o un pulsante (conferma «come sempre»?) — chip-bottone «Uguale al solito» esplicito, oppure testo grigio informativo.
- [media] rituale-sonno-pasti__tel-light.png — pulsanti pasto «sì | no | ⏱» — tre bottoni grigi identici senza stato selezionato visibile; «sì» minuscolo; l'orologio non dice che serve a cambiare orario — segmentato «Sì / No» con stato pieno + link «Altro orario»; maiuscole iniziali.
- [bassa] rituale-sonno-pasti__tel-light.png — «Salva» + «Non ricordo» — «Salva» è un bottone tinta tenue, «Non ricordo» testo: bottone sottodimensionato rispetto ai campi — allinearli come coppia primario/secondario o eliminare il salvataggio intermedio.
- [bassa] rituale-sonno-pasti__tel-light.png — sezione «Altre cose fatte» — dentro un rituale «Sonno e pasti» è fuori contesto — spostarla nel check-in o nella fine giornata, o rinominare il rituale.
- [bassa] rituale-sonno-pasti__tel-light.png — «di solito alle 08:00» — utile, ma con grigio chiaro 12px contrasto basso — grigio più scuro (≥4.5:1).

## rituale-checkin__tel-light.png
- [media] rituale-checkin__tel-light.png — scale 1–5, bottone selezionato («4», «5») — il selezionato è più grande e spostato di 2–3px in alto rispetto agli altri: la riga «salta» — stessa dimensione, cambiare solo colore/bordo.
- [media] rituale-checkin__tel-light.png — etichette «1 · esausto / 3 · normale / 5 · pieno» — non sono centrate sotto i rispettivi bottoni («3 · normale» sta fra 2 e 3, «5 · molto concentrato» sporge a sinistra del 5) — etichette solo agli estremi, allineate a sinistra sotto 1 e a destra sotto 5; centrale sotto il 3 col suo stesso centro.
- [media] rituale-checkin__tel-light.png — pulsante «Registra +3 XP» — lilla chiaro con bordo, mentre in Piano del giorno il pulsante equivalente «Salva +5 XP» è viola pieno; e il check-in è già «fatto» ma il pulsante dice ancora «Registra» — stesso stile primario per tutti i rituali; se già fatto «Aggiorna» o nascondere.
- [bassa] rituale-checkin__tel-light.png — «Media recente 4,3» ripetuto 3 volte con icona tachimetro — rumore visivo — una sola riga riepilogativa o mostrarlo come marcatore sulla scala.
- [bassa] rituale-checkin__tel-light.png — «pieno» come estremo di energia — poco naturale — «carico» / «al massimo».

## rituale-sera__tel-light.png
- [alta] rituale-sera__tel-light.png — legenda «Com'è andata, area per area? 1 = male · 5 / = benissimo» — va a capo spezzando «5 = benissimo» a metà (il «5» resta sulla prima riga) — legenda su riga propria sotto la domanda, con spazi non separabili (&nbsp;) fra numero, «=» e parola.
- [media] rituale-sera__tel-light.png — scale 1–5 per area — piccoli quadrati grigi allineati a destra, mentre nel Check-in le scale sono grandi bottoni bordati a tutta larghezza: stesso controllo, due aspetti — un solo componente scala.
- [media] rituale-sera__tel-light.png — impaginazione area / scala — il nome dell'area su una riga e i bottoni sulla riga sotto, allineati a destra lasciando ~150px vuoti a sinistra; ogni area occupa 84px → lista lunghissima — mettere nome e scala sulla stessa riga o la scala a tutta larghezza sotto il nome.
- [bassa] rituale-sera__tel-light.png — nome rituale «Fine giornata» — nell'elenco interno si chiama «Review della sera»; uniformare (consigliato «Fine giornata» ovunque).
- [bassa] rituale-sera__tel-light.png — area «Progetti Founder» (visibile sotto la tab bar) — inglese misto e maiuscola — «Progetti personali» / «La mia startup»; e il contenuto passa sotto la tab bar senza sfumatura.

## rituale-settimana__tel-light.png
- [media] rituale-settimana__tel-light.png — numeri «216 / 10 / 6/7» — in carattere con grazie (serif), unico punto dell'app; inoltre il blocco parte a x≈52 mentre le etichette delle domande partono a x≈32 — stesso font numerico delle statistiche dell'Anno, allineato al margine del contenuto (o centrato in 3 colonne uguali con divisori come in Anno).
- [media] rituale-settimana__tel-light.png — «6/7 giorni attivi» — la settimana corrente (17–23 ago) ha solo 2 giorni trascorsi: non è chiaro a quale settimana si riferisce il bilancio — intestazione «Settimana 10–16 ago».
- [media] rituale-settimana__tel-light.png — «azioni completate» — terzo termine per la stessa metrica (altrove «fatte», «cose fatte») — un solo termine in tutta l'app.
- [media] rituale-settimana__tel-light.png — campi di testo — mostrano la maniglia di ridimensionamento nativa in basso a destra e nessun segnaposto — disattivare resize (auto-grow) e mettere esempi nel segnaposto.
- [bassa] rituale-settimana__tel-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — senza punto interrogativo — aggiungere «?».

## attivita-sistemare__tel-light.png
- [media] attivita-sistemare__tel-light.png — select «Altro / Esplorazione ▾» — select nativa con freccia di sistema e fondo grigio, diversa da ogni altro selettore — componente chip/menu dell'app (come «Area» nelle schede).
- [media] attivita-sistemare__tel-light.png — pulsanti «Oggi / Da fare / Scarta» — stanno fuori dalla card a cui si riferiscono e con 3 stili diversi (pieno viola, bordato nero, bordato rosso); larghezze diverse — metterli dentro la card in basso; «Oggi» primario, «Da fare» secondario, «Scarta» come azione testuale rossa o icona cestino.
- [bassa] attivita-sistemare__tel-light.png — etichetta «🗂 Da sistemare» sotto il segmentato — ripete esattamente il segmento selezionato — sostituire con un'indicazione utile («1 di 6 · decidi dove va»).
- [media] attivita-sistemare__tel-light.png — lista «In coda 5» — righe in grigio chiaro senza separatori né affordance: non si capisce se si possono toccare per passarle avanti; «e un'altra» in corsivo è goffo — righe toccabili con chevron o almeno contrasto pieno; «+1 altra» o mostrare tutte.
- [bassa] attivita-sistemare__tel-light.png — titolo card «Idea: bot che trasforma i vocali in task» — contenuto utente, ok; ma il triage di una sola voce alla volta lascia mezzo schermo vuoto — mostrare un'anteprima o un contatore «1 di 6».
- [bassa] attivita-sistemare__tel-light.png — badge 6/9/3 sui tre segmenti — badge su tutti i segmenti = nessuno si distingue; il «9» di Da fare e il «3» di Abitudini non sono cose da gestire — badge solo su Da sistemare; per gli altri numero grigio inline.

## attivita-dafare__tel-light.png
- [alta] attivita-dafare__tel-light.png — righe della lista — nessuna casella per completare un'attività direttamente dalla lista Da fare (presente invece in Oggi/Giornata) — aggiungere la spunta circolare a sinistra come nelle altre liste.
- [media] attivita-dafare__tel-light.png — pulsanti «+ Oggi» — il primo è viola pieno, tutti gli altri lilla tenue, senza motivo evidente (focus? suggerito?) — stesso stile per tutti, oppure spiegare il suggerimento («Consigliata per oggi»).
- [media] attivita-dafare__tel-light.png — titoli in grassetto 17px che vanno a capo dopo ~20 caratteri — la colonna di destra («1 di 3» + bottone) ruba ~140px; lista pesante, tutte le righe alte 60px — titolo medium 15–16px, «1 di 3» spostato sotto il titolo come meta («1/3 passi»), bottone più compatto (icona «☀︎+»).
- [bassa] attivita-dafare__tel-light.png — «1 di 3», «1 di 4» — numeri senza unità — «1/3 passi».
- [bassa] attivita-dafare__tel-light.png — filtro «Tutte ▾» — bottone isolato su una riga intera, attaccato all'intestazione «Importanti» (10px) — metterlo sulla riga del campo nuova attività o a destra dell'intestazione di sezione.
- [bassa] attivita-dafare__tel-light.png — icone area (libro, matita, valigetta, cuore, lampadina) 14px colorate prima del titolo — piccole e senza nome dell'area; poco riconoscibili — pallino + nome area nella meta.
- [bassa] attivita-dafare__tel-light.png — campo «Nuova attività…» + «Aggiungi» — identico a quello in fondo alla Giornata ma qui in cima: posizione incoerente — stessa posizione nelle due viste.

## attivita-dafare-aggiunta__tel-light.png
- [media] attivita-dafare-aggiunta__tel-light.png — opzioni «Oggi / Domani / Senza data» e select area — rientrate a x≈28 mentre il campo parte a x≈16: disallineate rispetto al campo e al filtro sotto — allinearle al bordo sinistro del campo, idealmente dentro lo stesso contenitore del campo (che si espande).
- [media] attivita-dafare-aggiunta__tel-light.png — select area «Altro / Esplorazione ▾» — di nuovo nativa, qui con fondo bianco (in Da sistemare era grigia) — componente unico stilizzato.
- [media] attivita-dafare-aggiunta__tel-light.png — gruppo opzioni + filtro «Tutte» — le opzioni del nuovo elemento e il filtro della lista sono impilati con lo stesso stile di bottone bordato, sembrano un unico gruppo — separare chiaramente: opzioni dentro la card del campo, filtro dopo uno spazio maggiore (24px).
- [bassa] attivita-dafare-aggiunta__tel-light.png — chip «Senza data» selezionato — viola scuro pieno con testo bianco, mentre i segmenti selezionati altrove sono bianchi o lilla — uniformare lo stato selezionato dei chip.
- [bassa] attivita-dafare-aggiunta__tel-light.png — mancano scadenza/orario — oltre «Oggi/Domani» non si può scegliere una data — aggiungere «Scegli data…».

## attivita-abitudini__tel-light.png
- [media] attivita-abitudini__tel-light.png — spunte delle abitudini — grandi cerchi (44px) a DESTRA colorati per area, mentre in Oggi/Giornata la spunta è a sinistra (cerchio grigio o quadrato) — stessa posizione (sinistra) e stesso stile in tutte le liste.
- [media] attivita-abitudini__tel-light.png — righe come card separate — qui ogni abitudine è una card a sé, in Da fare le righe stanno in una card unica con divisori: stesse liste, due linguaggi — unificare (lista raggruppata).
- [bassa] attivita-abitudini__tel-light.png — riepilogo «◯ 0 di 3 / oggi» — anello grigio vuoto da 60px che a 0 sembra un placeholder rotto; «oggi» minuscolo e staccato — «Oggi: 0 di 3 fatte» con anello più piccolo e traccia visibile.
- [bassa] attivita-abitudini__tel-light.png — meta «18:00 · ♥ Salute & Sport 🔥3» — la serie compare solo su una riga senza etichetta — «🔥 3 giorni» o tooltip; allineare la posizione della serie.
- [bassa] attivita-abitudini__tel-light.png — «Nuova abitudine…» — la creazione inline non chiede frequenza/orario; metà schermo vuota sotto — dopo «Aggiungi» aprire subito la scheda con frequenza e orario.

## attivita-abitudini-nuova__tel-light.png
- (nota: le opzioni di frequenza/orario esistono mentre si scrive, quindi il punto «creazione inline senza frequenza» della schermata precedente vale solo come scopribilità: le opzioni appaiono solo dopo aver iniziato a scrivere.)
- [media] attivita-abitudini-nuova__tel-light.png — opzioni della nuova abitudine — qui sono righe-elenco (Giorni / Ora / Area) in stile scheda, mentre per una nuova attività sono chip + select nativa: due modelli di creazione diversi — un unico pannello opzioni per entrambi.
- [media] attivita-abitudini-nuova__tel-light.png — ordine — il pulsante «Aggiungi» sta sopra le opzioni: si conferma prima di vedere/compilare giorni e ora — spostare «Aggiungi» in fondo al pannello (o renderlo «Crea abitudine» dopo le opzioni).
- [bassa] attivita-abitudini-nuova__tel-light.png — fila dei giorni L M M G V S D — sette cerchi viola pieni attaccati (gap 6px) e a filo dei bordi della card: blocco cromatico pesante, «Ogni giorno» è già scritto sopra — cerchi più piccoli, stato attivo lilla tenue, margine 16px.
- [bassa] attivita-abitudini-nuova__tel-light.png — «Ora: Nessuna» — pillola grigia che sembra disabilitata — «Aggiungi ora» in viola come azione.

## scheda-attivita__tel-light.png
- [media] scheda-attivita__tel-light.png — chip «Pianifica» (grigi, Maiuscola) vs chip «Distribuisci i passi» (bianchi con ombra, minuscolo «ogni giorno») — due stili di chip e due regole di maiuscola nello stesso foglio — un solo stile chip, iniziale maiuscola.
- [media] scheda-attivita__tel-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» — non si capisce cosa succede (assegna date ai passi rimasti?) né lo stato attuale — frase esplicita «Pianifica i passi rimasti: uno ogni…» e mostrare l'esito (date sotto ogni passo).
- [media] scheda-attivita__tel-light.png — righe dei passi — cerchio spunta da 44px + icona calendario + cestino su ogni riga: tre target ravvicinati, cestino sempre visibile invita all'errore — spunta 24px, eliminazione con scorrimento o in modifica; calendario come testo data quando assegnata.
- [bassa] scheda-attivita__tel-light.png — «+ Aggiungi un passo… | Aggiungi» — l'icona «+» a sinistra e il link «Aggiungi» a destra duplicano l'azione — tenere solo «+» + campo e conferma da tastiera, oppure il link solo quando c'è testo.
- [bassa] scheda-attivita__tel-light.png — pulsante «◎ Aggiungi il prossimo passo a Oggi» — lungo e burocratico — «Fai il prossimo passo oggi» o «Metti in Oggi: Recuperare modulo 1».
- [bassa] scheda-attivita__tel-light.png — foglio — senza pulsante chiudi; il titolo a capo lascia spazio vuoto a destra dove starebbe la ✕ — aggiungere ✕/«Fine».
- [bassa] scheda-attivita__tel-light.png — «Passi 1 di 3» — badge grigio piccolo, diverso dal «1 di 3» della lista — stesso formato.

## scheda-attivita-fondo__tel-light.png
- [media] scheda-attivita-fondo__tel-light.png — intestazione fissa del foglio — il titolo resta fisso ma il contenuto scorre sotto senza divisore né ombra: si vede il bordo del cerchio di un passo spuntare sotto il titolo (y≈185) — aggiungere separatore/ombra quando si scorre e ridurre il titolo a una riga compatta.
- [alta] scheda-attivita-fondo__tel-light.png — riga «↺ Non completata ›» — per un'attività ancora da fare il comando non ha senso (è già non completata) e il chevron fa pensare a una pagina — mostrare solo «Segna come fatta» se aperta, «Segna come non fatta» se completata; niente chevron sulle azioni.
- [media] scheda-attivita-fondo__tel-light.png — «Fissa in alto: no» — un valore testuale «no» invece di un interruttore; non toccabile all'apparenza — usare uno switch; e chiarire il rapporto con la sezione «Importanti» della lista (stessa cosa? chiamarla «Importante»).
- [media] scheda-attivita-fondo__tel-light.png — riga «Area · Studio / Università ▾» — qui testo grigio con chevron giù, mentre nelle schede del calendario l'area è una pillola lilla: stesso campo, due aspetti — un solo stile per i valori (testo grigio + chevron ›).
- [bassa] scheda-attivita-fondo__tel-light.png — valori «nessuna», «no» minuscoli e grigio chiaro — «Nessuna», contrasto più alto.
- [bassa] scheda-attivita-fondo__tel-light.png — «Trasforma in abitudine ›» — azione importante nascosta in fondo con lo stesso peso di «Elimina» — ok in fondo, ma separare il gruppo distruttivo «Elimina» con spazio dedicato.

## scheda-abitudine__tel-light.png
- [media] scheda-abitudine__tel-light.png — calendario storico — manca il nome del mese (si vedono 27–31 luglio e agosto senza intestazione); i cerchi grigi pieni (giorni previsti e non fatti) non sono spiegati e si confondono coi giorni futuri — intestazione «Luglio–Agosto», legenda mini (fatto / mancato / riposo), giorni mancati con bordo o puntino invece di fondo pieno.
- [media] scheda-abitudine__tel-light.png — «Ora 18:00 ×» — qui la × di cancellazione sta FUORI dalla pillola, nelle schede del calendario sta DENTRO — stesso componente.
- [media] scheda-abitudine__tel-light.png — chip area «♥ Salute & Sport» — verde con fondo verde tenue, mentre in tutte le altre schede l'area è una pillola lilla — colore area coerente ovunque (se è il colore dell'area, applicarlo anche nelle altre schede).
- [bassa] scheda-abitudine__tel-light.png — statistiche «3 di fila · 4 record · 7 in tutto» — «record» e «in tutto» senza sostantivo — «serie attuale 3», «miglior serie 4», «7 volte».
- [bassa] scheda-abitudine__tel-light.png — «Fatta» verde + «Salta oggi» link: impaginazione diversa da Adesso (Fatto a tutta larghezza + Timer + Salta) — allineare i due schemi.
- [bassa] scheda-abitudine__tel-light.png — giorni 18 (oggi) con anello viola e fondo grigio — terzo modo di segnare «oggi» (dopo cerchio viola pieno e quadratino bordato) — unificare l'indicatore di oggi.

## scheda-abitudine-fondo__tel-light.png
- [media] scheda-abitudine-fondo__tel-light.png — colonna dei valori (Ora, Durata, Area, Inizio, Fine) — pillole di larghezza diversa e bordo destro non allineato (quella di «Ora» finisce 40px prima per la ×) — larghezza minima comune, × dentro la pillola o in modalità modifica, bordo destro sempre a 16px.
- [media] scheda-abitudine-fondo__tel-light.png — «Area: Salute & Sport» qui pillola lilla, nella testata dello stesso foglio chip verde — incoerenza dentro la stessa scheda — un solo stile.
- [media] scheda-abitudine-fondo__tel-light.png — «Elimina» — bottone centrato in box grigio, nella scheda attività invece riga sinistra con icona cestino rossa; nella scheda dal calendario c'era «Termina l'abitudine», qui manca — stesso componente per le azioni finali; offrire «Termina» (conserva lo storico) prima di «Elimina».
- [bassa] scheda-abitudine-fondo__tel-light.png — «Inizio 29/07/2026» — formato numerico diverso dal resto dell'app («18 ago») — «29 lug 2026».
- [bassa] scheda-abitudine-fondo__tel-light.png — «Fine: Mai» in pillola grigia (sembra disabilitata) mentre le altre sono lilla — stesso stile, testo «Nessuna» o «Mai» in viola.

## andamento__tel-light.png
- [alta] andamento__tel-light.png — card serie «🔥 38» + riga dei 7 giorni — la serie dice 38 giorni consecutivi ma venerdì è vuoto (non fatto): contraddizione evidente — spiegare la regola (giorno di riposo / jolly) con un'icona sul giorno o correggere il calcolo.
- [media] andamento__tel-light.png — «38» e «65% / 81 di 124» — numeri senza etichetta: cosa sono 124? — «38 giorni di fila», «65% completate (81 su 124) negli ultimi 30 giorni».
- [media] andamento__tel-light.png — riga giorni «M G V S D L M» — ordine non da lunedì e senza date: si capisce a fatica che sono gli ultimi 7 giorni — aggiungere il numero del giorno o titolo «Ultimi 7 giorni».
- [media] andamento__tel-light.png — mappa «Costanza» — scala di blu, mentre la stessa informazione nella vista Anno usa il verde; la griglia è allineata a sinistra con ~120px vuoti a destra e senza etichette di mesi/giorni — un solo colore per «attività svolta», griglia a tutta larghezza, etichette L/M/V e mesi.
- [bassa] andamento__tel-light.png — «Per area» — percentuali grandi in nero + frazione grigia piccola: ok, ma l'icona ⊕ del titolo sembra un «aggiungi» — icona diversa (grafico a barre) o nessuna.
- [bassa] andamento__tel-light.png — titoli card «Costanza», «Per area» in 20px nero molto pesanti rispetto ai contenuti piccoli — titolo 17px semibold.

## andamento-fondo__tel-light.png
- [media] andamento-fondo__tel-light.png — barre «Per area» — il rosso pieno per «Altro / Esplorazione» comunica errore/allarme pur essendo 63%; le barre al 100% sono indistinguibili dal binario — evitare il rosso come colore di area; lasciare un binario visibile anche al 100% o segnare l'obiettivo.
- [media] andamento-fondo__tel-light.png — elenco «Riflessioni passate / Sessioni del timer / Aree / Grafici» — «Aree» duplica Profilo › Aree, «Grafici» è vago (il Riepilogo è già fatto di grafici); icona ⊕ riusata per Aree e Per area — chiarire i nomi («Tutti i grafici», «Storico timer»), togliere i doppioni, icone distinte.
- [bassa] andamento-fondo__tel-light.png — «Riflessioni passate 79» — il conteggio è grigio chiaro e non si capisce se sono giorni o voci — «79 voci».

## scoperte__tel-light.png
- [media] scoperte__tel-light.png — titoli delle scoperte — vanno a capo a ~200px lasciando ~90px vuoti prima del chevron (larghezza massima troppo stretta, come nelle schede) — far occupare al titolo tutta la larghezza disponibile.
- [media] scoperte__tel-light.png — icona della tab «Scoperte» — è lo stesso pollice in su usato per «Funziona»: la sezione sembra contenere solo le cose che funzionano — icona neutra (lampadina/lente).
- [bassa] scoperte__tel-light.png — riquadri icona 👍/👎 da 44px con bordo e fondo — pesanti e ripetuti su ogni riga, la sezione già dice Funziona/Non funziona — icona piccola senza riquadro o solo un punto colorato.
- [bassa] scoperte__tel-light.png — meta «misurato», «lo noto ogni volta», «notato una volta» — livelli di prova poco chiari e con forme verbali diverse — scala esplicita: «Misurato / Sempre / Una volta» con icona.
- [bassa] scoperte__tel-light.png — sotto-tab «Registro 8 / Esperimenti 2» — contatori inline con un terzo stile di badge — uniformare i badge; «Registro» poco parlante → «Scoperte» o «Raccolta».

## scoperte-esperimenti__tel-light.png
- [alta] scoperte-esperimenti__tel-light.png — grafico, etichette «media 3,1» e «media 4,3» — i punti dei dati e la linea tratteggiata passano sopra il testo rendendolo illeggibile («media 3,1» barrato dai punti) — etichette fuori dall'area dei punti (sopra la linea con sfondo/alone) o in legenda.
- [media] scoperte-esperimenti__tel-light.png — riquadro risultato in basso «…grande (d≈3,1)» — gergo statistico (d di Cohen) incomprensibile per l'utente medio — frase semplice («Differenza netta: +1,2 punti») e dettaglio tecnico in un «Info».
- [bassa] scoperte-esperimenti__tel-light.png — chip «concluso» (minuscolo, icona bandiera) e «Focus (da check-in, 1–5)» — parentesi tecniche e maiuscole incoerenti — «Concluso», «Misura: concentrazione (check-in)».
- [bassa] scoperte-esperimenti__tel-light.png — testo introduttivo sempre visibile in cima — utile la prima volta, poi ingombra — renderlo comprimibile o mostrarlo solo a lista vuota.
- [bassa] scoperte-esperimenti__tel-light.png — «+ Nuovo esperimento» — bottone bordato con ombra, diverso dai pulsanti «+ Aggiungi» lilla delle altre schermate — stesso stile per le azioni «nuovo».
- [bassa] scoperte-esperimenti__tel-light.png — titolo «Fare sport al mattino / aumenta il mio focus?» — «focus» inglese; va a capo presto — «…mi aiuta a concentrarmi?».

## scheda-scoperta__tel-light.png
- [media] scheda-scoperta__tel-light.png — titolo «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione e titolo generico: il titolo dovrebbe essere la scoperta stessa — titolo = testo della scoperta (modificabile) o «Scoperta».
- [media] scheda-scoperta__tel-light.png — foglio — nessun «Salva»/«Fine» né chiusura: non si sa se le modifiche sono salvate — indicare il salvataggio automatico («Salvato») o un pulsante Fine.
- [bassa] scheda-scoperta__tel-light.png — campo di testo — maniglia di ridimensionamento nativa visibile in basso a destra — nasconderla (auto-grow).
- [bassa] scheda-scoperta__tel-light.png — chip «Quanto ne sei sicuro» — tutto minuscolo e «misurato» va a capo da solo; i chip «Esito» hanno un altro stile (bianco su fondo grigio) — controllo segmentato a 3 voci su una riga, stesso stile per Esito.
- [bassa] scheda-scoperta__tel-light.png — riga «Aggiunta 20 lug» — informazione non modificabile impaginata come i campi modificabili — spostarla come nota grigia in fondo.

## profilo__tel-light.png
- [alta] profilo__tel-light.png — intera pagina — nessuna barra di navigazione né «‹ Indietro» / chiudi, e nessuna tab attiva nella tab bar: l'utente non sa dove si trova né come tornare — intestazione «Profilo» con pulsante indietro/chiudi (o aprire come foglio modale).
- [media] profilo__tel-light.png — «Promemoria: bloccati» — stato allarmante senza spiegazione né rimedio — «Notifiche disattivate · Attiva» con istruzioni.
- [media] profilo__tel-light.png — statistiche «38 giorni / 109 fatte / 65% completate» — senza periodo; «109 fatte» non coincide con «82 fatte» dell'Anno, «38 giorni» qui è la serie mentre in Anno «giorni attivi» sono 49 — specificare («38 giorni di fila», «109 in totale») e uniformare le definizioni.
- [bassa] profilo__tel-light.png — avatar «R» — quadrato arrotondato 64px qui, cerchio nell'intestazione delle altre schermate — stessa forma.
- [bassa] profilo__tel-light.png — margine superiore — la prima card inizia a 20px dal bordo senza safe area (finirebbe sotto la status bar/notch) — rispettare env(safe-area-inset-top).
- [bassa] profilo__tel-light.png — metà inferiore vuota; voci divise in due gruppi senza titoli — titoli di gruppo («La tua routine», «App») o un solo gruppo.

## impostazioni__tel-light.png
- [media] impostazioni__tel-light.png — gruppi — «Account» contiene solo «Sincronizzazione», il gruppo successivo (Area predefinita, Timer, Musica, Aspetto) non ha titolo — titolo «Preferenze» per il secondo gruppo; valutare se «Account» serve.
- [media] impostazioni__tel-light.png — riga «Sincronizzazione · su questo dispositivo» — senza chevron: non si capisce se si può toccare né cosa significhi (= nessuna sincronizzazione?) — «Sincronizzazione: disattivata (dati solo su questo telefono)» + chevron verso la configurazione.
- [media] impostazioni__tel-light.png — indicatori a destra — «Automatica ▾» (chevron giù, maiuscola) vs «chiedi sempre ›», «nessuna ›», «automatico ›» (minuscolo); «Esporta dati» e «Importa dati» senza chevron; «Backup e ripristino 1» con un numero misterioso — stesse regole: valori con iniziale maiuscola, chevron › per tutte le righe che aprono, «1 backup».
- [bassa] impostazioni__tel-light.png — voce «Scienza» nella Guida — etichetta vaga — «Su cosa si basa l'app» / «Le basi scientifiche».
- [bassa] impostazioni__tel-light.png — foglio impostazioni — senza pulsante chiudi; aperto come foglio sopra un Profilo che è già una pagina senza navigazione — rendere Impostazioni una pagina push con «‹ Profilo».

## impostazioni-fondo__tel-light.png
- [media] impostazioni-fondo__tel-light.png — «Registro tecnico» dentro «Guida» — voce da sviluppatori in mezzo all'aiuto per l'utente — spostarla in un gruppo «Avanzate» in fondo.
- [bassa] impostazioni-fondo__tel-light.png — gruppo «Reimposta» — «Rimuovi dati di esempio» e «Cancella tutti i dati» stanno in due card separate con icone diverse (scintille, cestino) senza descrizione delle conseguenze — una card unica con sottotitoli («Toglie solo gli esempi», «Irreversibile»).
- [bassa] impostazioni-fondo__tel-light.png — fondo del foglio — «Cancella tutti i dati» a 30px dal bordo inferiore senza safe area — padding inferiore adeguato.
- [bassa] impostazioni-fondo__tel-light.png — intestazione fissa «Impostazioni» — divisore presente qui, ma assente nella scheda attività: incoerenza fra fogli — stesso comportamento.

## imp-timer__tel-light.png
- [media] imp-timer__tel-light.png — riga «Pausa lunga ogni 4 · Mai» — frase sgrammaticata (ogni 4 cosa?) e il valore «Mai» contraddice «ogni 4»; manca la durata della pausa lunga — «Pausa lunga: dopo 4 sessioni / disattivata» + riga «Durata pausa lunga».
- [media] imp-timer__tel-light.png — sezioni «Avvio rapido», «Sessione», «Pomodoro» — tre tipi di timer senza descrizione; «Poi continua per» non si capisce — una riga di spiegazione grigia sotto ogni titolo («Parti con 5 minuti, se va bene continua per altri 25»).
- [media] imp-timer__tel-light.png — altezza del foglio — la sotto-pagina parte a y≈150 mentre la pagina Impostazioni a y≈85: il foglio «salta» di altezza navigando — altezza fissa per tutto lo stack delle impostazioni.
- [bassa] imp-timer__tel-light.png — «‹ Impostazioni» — link 12px, area di tocco minuscola e titolo «Timer» sotto invece che a fianco — barra di navigazione standard: ‹ a sinistra, titolo centrato, altezza 44.
- [bassa] imp-timer__tel-light.png — valori in pillole lilla («Chiedi sempre», «5 min») — nella pagina precedente gli stessi valori sono testo grigio minuscolo («chiedi sempre») — stessa capitalizzazione e stile.

## imp-musica__tel-light.png
- [alta] imp-musica__tel-light.png — campi «Incolla il link» — grigio chiarissimo su card grigia, senza bordo: i campi quasi non si vedono e non sembrano compilabili — campo bianco con bordo 1px o fondo più scuro, contrasto ≥3:1 col contenitore.
- [media] imp-musica__tel-light.png — «Incolla il link» — non dice link di cosa (Spotify? YouTube? playlist?) né cosa succede — sottotitolo «Link a una playlist (Spotify, YouTube…), si apre quando parte il timer».
- [media] imp-musica__tel-light.png — interruttore «Apri all'avvio del timer» spento — binario grigio chiaro su fondo grigio, quasi invisibile — binario spento più scuro.
- [bassa] imp-musica__tel-light.png — prima card — parte a 14px dal titolo «Musica» senza intestazione di sezione, mentre «Per area» ce l'ha — titolo di sezione «Predefinita» fuori dalla card come gli altri.
- [bassa] imp-musica__tel-light.png — lista per area — otto campi vuoti identici impilati: muro di input — mostrare le aree come righe con valore «Nessuna ›» che aprono il campo.

## imp-aspetto__tel-light.png
- [media] imp-aspetto__tel-light.png — altezza del foglio — terza altezza diversa nella stessa navigazione (Impostazioni ~85px, Timer ~150px, Aspetto ~450px): il foglio sobbalza a ogni passaggio — altezza fissa per lo stack.
- [media] imp-aspetto__tel-light.png — «Suoni», «Vibrazione» sotto «Aspetto» e nella stessa card del Tema — non sono aspetto — sezione «Suoni e feedback» separata (o voce «Aspetto e suoni»).
- [bassa] imp-aspetto__tel-light.png — interruttori verdi — l'accento dell'app è viola ovunque (selezioni, bottoni), gli switch qui sono verdi — usare l'accento dell'app o riservare il verde a «fatto» in tutta l'app.
- [bassa] imp-aspetto__tel-light.png — «Auto» nel segmentato vs «automatico» nella riga Impostazioni — stessa parola.

## aree__tel-light.png
- [media] aree__tel-light.png — ogni riga: cestino + interruttore affiancati — due controlli con effetti molto diversi (elimina vs disattiva) a 30px l'uno dall'altro; l'interruttore non dice cosa fa (attiva? visibile?) — spiegare sopra la lista («Le aree spente non compaiono nelle scelte»), eliminazione dentro il dettaglio dell'area o con scorrimento.
- [media] aree__tel-light.png — righe senza chevron — non si può cambiare nome, colore o icona di un'area (o non si capisce come) — riga toccabile → dettaglio area con nome, colore, icona.
- [bassa] aree__tel-light.png — «Nuova area: [icona] Nome · Aggiungi» — l'icona grigia sembra disabilitata e non si sceglie colore/icona — dopo «Aggiungi» aprire il dettaglio per colore e icona, o mostrare i selettori.
- [bassa] aree__tel-light.png — titolo «Le tue aree» vs voce di menu «Aree» e nessun pulsante indietro/chiudi — titolo coerente e chiusura visibile.

## sonno-pasti__tel-light.png
- [alta] sonno-pasti__tel-light.png — stesso dato «sonno e pasti» con tre interfacce diverse: qui pillole lilla + ×, nel pannello di La giornata input bianchi + select native + cestino, nel rituale righe con orologio + sì/no — un unico componente riusato nei tre punti.
- [media] sonno-pasti__tel-light.png — pillole orario — testo nero allineato a destra («08:00») accanto a pillole con testo viola centrato («15 min»): due stili nella stessa riga — stesso colore e allineamento (centrato).
- [media] sonno-pasti__tel-light.png — «Promemoria nell'app · Sonno · Tra le 05:00 – 14:00» — non si capisce cosa venga ricordato in quella fascia (chiedere come hai dormito?) — sottotitolo esplicito «Ti chiediamo com'è andata la notte tra le 5 e le 14».
- [bassa] sonno-pasti__tel-light.png — «Durata 8h» — valore calcolato impaginato come i campi ma in grigio: ok, però «8h» → «8 h» per coerenza con «45 min».
- [bassa] sonno-pasti__tel-light.png — × per rimuovere un pasto — nel pannello della Giornata è un cestino — stessa icona.

## promemoria__tel-light.png
- [media] promemoria__tel-light.png — banner «Bloccati» — icona a sinistra ma titolo e testo centrati: impaginazione ibrida; testo innaturale («Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo») e nessun pulsante d'azione — titolo «Notifiche bloccate», testo allineato a sinistra, «Come riattivarle» con passi o pulsante «Riprova».
- [media] promemoria__tel-light.png — interruttori disabilitati — grigi con il pallino a destra (posizione ON): non si capisce se sono attivi o spenti — mostrarli nella loro posizione reale con opacità ridotta e nota «in pausa finché le notifiche sono bloccate».
- [media] promemoria__tel-light.png — voce «Priorità del giorno 16:30» — non esiste un rituale con questo nome (ci sono Piano del giorno, Check-in, Fine giornata…) — allineare i nomi ai rituali o spiegare cosa ricorda.
- [bassa] promemoria__tel-light.png — pillole orario disabilitate in lilla sbiadito sul grigio — contrasto molto basso (testo grigio su lilla chiaro) — se disabilitate, almeno 3:1.
- [bassa] promemoria__tel-light.png — card in fondo tagliata (inizia a y≈825) senza indicazione del contenuto — normale scroll, ma il foglio non ha ombra/sfumatura di fine — ok; aggiungere padding inferiore.

## diario__tel-light.png
- [media] diario__tel-light.png — tipo di navigazione — Diario si apre come pagina intera con «‹ Profilo», mentre Aree, Sonno e pasti, Promemoria, Impostazioni sono fogli; inoltre la tab bar evidenzia «Andamento» pur arrivando dal Profilo — stesso schema (tutte pagine push) e tab attiva coerente.
- [alta] diario__tel-light.png — riga «Completata · Organizzare cena… / Priorità / [Relazioni & Sociale ▾]» — dentro una voce del registro compare una select nativa con bordo: elemento di modifica fuori contesto che rompe il ritmo della lista — togliere la select (modifica dalla scheda dell'attività) e mostrare l'area come testo.
- [media] diario__tel-light.png — colonna di testo — stretta (~180px) per via dell'icona ↺ e dell'orario: ogni voce va a capo su 2–3 righe — orario sopra o sotto il testo come meta, ↺ solo nel menu/scorrimento.
- [media] diario__tel-light.png — icona ↺ su ogni riga — non si capisce cosa annulli e invita a errori — etichetta «Annulla» o azione nascosta dietro scorrimento con conferma.
- [bassa] diario__tel-light.png — «Annotato · …» ripetuto per tutte le voci — verbo poco naturale e ridondante con l'icona — «Nota:» o solo l'icona + testo.
- [bassa] diario__tel-light.png — segmentato «Cose importanti | Tutto» — non a tutta larghezza, dentro una card bianca che contiene tutta la lista (riquadro nel riquadro) — segmentato a tutta larghezza fuori dalla card, lista senza contenitore esterno.

## timer-scelta__tel-light.png
- [media] timer-scelta__tel-light.png — voci «Avvio rapido / Sessione / Pomodoro / Cronometro» — nessuna descrizione: la differenza fra «Avvio rapido» e «Sessione» non è intuibile — sottotitolo di una riga per ciascuna («5 min per rompere il ghiaccio», «25 min di concentrazione», «25 + 5 pausa, ripetuto»).
- [bassa] timer-scelta__tel-light.png — icona di «Pomodoro» ↻ — è la stessa icona usata per le abitudini — icona diversa (pomodoro/cicli).
- [bassa] timer-scelta__tel-light.png — riquadri icona bianchi con bordo dentro la card grigia — riquadro nel riquadro, pesante — icona semplice senza contenitore.
- [bassa] timer-scelta__tel-light.png — titolo «Timer» — non dice per quale attività parte — «Timer per Ripasso flashcard»; aggiungere «Ricorda la scelta» (collegato all'impostazione «Chiedi sempre»).
- [bassa] timer-scelta__tel-light.png — «nessun limite» minuscolo, «25 + 5 min» — formati misti — «Senza limite», «25 + 5 min».

## timer-concentrazione__tel-light.png
- [alta] timer-concentrazione__tel-light.png — controlli del timer — non c'è pausa/riprendi: l'unico pulsante grande è «Fatto» (completa l'attività) — aggiungere un pulsante Pausa grande al centro sotto il tempo; «Fatto» come secondario.
- [media] timer-concentrazione__tel-light.png — «Termina» con icona calendario-× — è la stessa icona di «Termina l'abitudine»: non si capisce se termina il timer o l'abitudine; inoltre duplica la ✕ in alto — «Interrompi timer» con icona stop; la ✕ solo per ridurre a icona/chiudere la vista.
- [media] timer-concentrazione__tel-light.png — anello attorno a 25:00 — solo il binario grigio scuro, nessun progresso visibile e contrasto quasi nullo col nero — arco di avanzamento nel colore d'accento.
- [bassa] timer-concentrazione__tel-light.png — «Pomodoro · blocco 1» — «blocco» poco usato — «Sessione 1 di 4».
- [bassa] timer-concentrazione__tel-light.png — «restano» sotto i numeri, minuscolo e grigio scuro su nero (contrasto basso) — «rimanenti» con grigio più chiaro.
- [bassa] timer-concentrazione__tel-light.png — schermata sempre scura anche in tema chiaro — scelta legittima per la concentrazione, ma il passaggio brusco va accompagnato (transizione) o reso opzionale.

## cattura__tel-light.png
- [media] cattura__tel-light.png — riga «Chiudi» in basso — una riga intera di 50px solo per un link piccolo allineato a destra: spazio sprecato e target piccolo — «Annulla» a sinistra nella stessa riga del campo o tocco fuori/✕; ridurre il popup a una riga.
- [media] cattura__tel-light.png — «Salva» attivo con campo vuoto — permette di salvare un pensiero vuoto (o sembra possibile) — disabilitarlo finché non c'è testo.
- [bassa] cattura__tel-light.png — nessuna indicazione di destinazione — l'utente non sa dove finisce il pensiero — microtesto «Finisce in Da sistemare».
- [bassa] cattura__tel-light.png — popup in alto con sfocatura totale dello sfondo — ok, ma il «+» della tab bar che lo apre resta sfocato sotto: manca un legame visivo — animare dal «+» o usare un foglio dal basso sopra la tastiera.

## menu-oggi-avatar__tel-light.png
- [alta] menu-oggi-avatar__tel-light.png — tocco sull'avatar — porta direttamente al Profilo a pagina piena, identico a profilo__tel-light.png, senza transizione visibile né modo di tornare a Oggi se non dalla tab bar (che non evidenzia nessuna tab) — aprire il Profilo come foglio/pagina con «‹ Oggi» o ✕; mantenere evidenziata la tab di provenienza.
- [bassa] menu-oggi-avatar__tel-light.png — stessi difetti di profilo__tel-light.png (stat senza periodo, «bloccati», avatar quadrato).

## trascinamento-in-corso__tel-light.png
- [media] trascinamento-in-corso__tel-light.png — fumetto «Organizzare cena con il gruppo · alle 12:45» — galleggia ~60px sopra l'anteprima di destinazione (12:45–14:15) e la copre parzialmente a sinistra: due indicatori della stessa cosa scollegati — fumetto attaccato al blocco fantasma (o sotto il dito) e un solo indicatore dell'orario.
- [media] trascinamento-in-corso__tel-light.png — anteprima 12:45–14:15 sopra «Pranzo» — si sovrappone al pasto senza alcun avviso di conflitto e il testo «Pranzo» resta visibile in trasparenza: caos visivo — segnalare la sovrapposizione (bordo arancio, «Si sovrappone al pranzo») e affiancare i blocchi.
- [media] trascinamento-in-corso__tel-light.png — bordo superiore — il segmentato Adesso/Giornata/Rituali è tagliato a metà dal bordo dello schermo e il badge «1» è mozzato — intestazione fissa completa o scroll pulito.
- [bassa] trascinamento-in-corso__tel-light.png — zona «Togli l'orario» — tratteggiata sopra il calendario, copre il blocco delle 15:00 e sta a ridosso della tab bar; poco contrasto — fondo pieno tenue con icona e più distanza dalla tab bar; evidenziarla quando il blocco ci passa sopra.
- [bassa] trascinamento-in-corso__tel-light.png — attività trascinata già completata — trascinare un'attività fatta è un caso strano; il blocco originale resta come fantasma barrato — ok, ma valutare se le completate debbano essere trascinabili.

