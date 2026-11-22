# Revisione tablet (giro 3)

## oggi-adesso__tab-light.png
- [gravità: alta] oggi-adesso__tab-light.png — tutta la pagina — layout da telefono stirato a 834px: colonna unica a tutta larghezza, metà inferiore (y 660–1030) completamente vuota — su tablet limitare la colonna (max ~640px centrata) oppure usare due colonne (card “Adesso” a sinistra, “Poi” + Pianifica a destra), o mostrare più elementi in “Poi”.
- [gravità: media] oggi-adesso__tab-light.png — pulsante «Fatto» verde — barra larga ~720px alta 54px: domina la schermata ed è sproporzionata su tablet — limitarne la larghezza (es. 320px) o affiancarlo a Timer/Salta su una sola riga.
- [gravità: media] oggi-adesso__tab-light.png — riga «Timer» / «Salta oggi» — «Timer» è un pulsante con bordo, «Salta oggi» è testo nudo con icona ⏭ a destra: due azioni sorelle con stile e posizione icona diversi — usare lo stesso stile (entrambi ghost/secondari) con icona a sinistra.
- [gravità: media] oggi-adesso__tab-light.png — card «Ripasso flashcard» — tre livelli di etichetta impilati (area “Studio / Università”, chip “Abitudine”, titolo) con molto spazio verticale fra loro: gerarchia dispersiva — mettere area e chip “Abitudine” sulla stessa riga sopra il titolo.
- [gravità: bassa] oggi-adesso__tab-light.png — barra progresso sotto la data — barra larga ~175px con «1 di 2» staccato, mentre il badge «38 giorni» è allineato in alto a destra e non sulla stessa baseline della data — allineare badge streak verticalmente al centro del blocco data+progresso; dare un'etichetta alla barra (“1 di 2 fatte”).
- [gravità: bassa] oggi-adesso__tab-light.png — segmented control in alto — tab larghi ~235px ciascuno con testo piccolo (13px): troppo vuoto dentro ogni segmento; avatar «R» fuori dal controllo con altezza diversa — ridurre la larghezza del controllo (es. 480px centrato) e allineare l'altezza dell'avatar.
- [gravità: bassa] oggi-adesso__tab-light.png — riga «Pianifica la giornata» — margine interno sinistro (icona a ~12px) inferiore a quello della card blu sotto (~20px) — uniformare il padding orizzontale delle card.
- [gravità: bassa] oggi-adesso__tab-light.png — riga «Confrontare piani telefonici» — il cerchio di spunta è grande (44px) e grigio chiaro, sembra un avatar vuoto più che una checkbox — ridurlo a 24–28px con bordo più marcato.
- [gravità: bassa] oggi-adesso__tab-light.png — barra di navigazione in basso — il pulsante «+» viola è incastrato nel bordo destro della barra con separatore verticale; le tre voci sono distribuite su 750px con enorme spazio fra loro — su tablet usare una barra laterale (rail) o raggruppare le voci al centro; FAB staccato dalla barra.

## giornata-giorno__tab-light.png
- [gravità: alta] giornata-giorno__tab-light.png — blocco «Organizzare cena con il gruppo» 09:30–11:00 — la linea dell'ora attuale (10:30) taglia il blocco proprio sotto il titolo e passa sopra al testo/orario; il titolo è barrato ma il blocco occupa ancora 90 min a piena opacità — far passare la linea “adesso” sotto i blocchi (z-index) o solo nella colonna orari; ridurre l'opacità dei blocchi completati.
- [gravità: media] giornata-giorno__tab-light.png — blocchi del calendario — tre stili diversi per la stessa cosa: attività piena colorata con barra a sinistra (giallo), abitudine con solo bordo verde, pasti grigi centrati con icona; testo dei pasti centrato, quello delle attività allineato a sinistra — definire un unico componente blocco (barra colore + titolo a sinistra) e differenziare solo con colore/icona.
- [gravità: media] giornata-giorno__tab-light.png — titolo «Oggi» fra le frecce — non mostra la data: nella vista Giorno serve “Martedì 18 agosto” (con “Oggi” come chip) — sostituire o affiancare la data.
- [gravità: media] giornata-giorno__tab-light.png — tutta la vista — su tablet la griglia oraria a una colonna con blocchi larghi 700px e ore da 56px spreca spazio: i titoli corti stanno in un angolo a sinistra di barre enormi — su tablet affiancare alla griglia un pannello laterale (Senza orario / da pianificare) per trascinare dentro, o limitare la larghezza.
- [gravità: media] giornata-giorno__tab-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — icone di pasti senza etichette né orari: incomprensibili; tutta la riga sembra un campo, la freccia ⌄ è lontanissima a destra — aggiungere etichetta (“Sonno e pasti”) e mostrare orari, oppure solo testo.
- [gravità: bassa] giornata-giorno__tab-light.png — sotto-tab Giorno/Settimana/Mese/Anno — il segmento attivo «Giorno» è un riquadro viola su sfondo libero, mentre il controllo superiore è un segmented control con contenitore grigio: due stili di tab impilati — uniformare (stesso componente o sotto-tab come linea/testo).
- [gravità: bassa] giornata-giorno__tab-light.png — colonna orari a sinistra — etichette «07:00» attaccate al bordo sinistro della card (~4px) — dare almeno 12px di padding.
- [gravità: bassa] giornata-giorno__tab-light.png — maniglie di trascinamento ⠿ dentro i blocchi — visibili su ogni blocco, aggiungono rumore e non ci sono sui pasti — mostrarle solo in modalità modifica o su pressione prolungata.
- [gravità: bassa] giornata-giorno__tab-light.png — fondo pagina — il blocco «Cena» è coperto dalla barra di navigazione flottante; la barra ha ombra ma il contenuto sotto non ha padding inferiore sufficiente — aggiungere padding-bottom pari all'altezza della barra.

## giornata-giorno-fondo__tab-light.png
- [gravità: media] giornata-giorno-fondo__tab-light.png — blocco «Leggere 20 minuti» alle 22:00 — non mostra l'orario (gli altri blocchi sì), solo titolo schiacciato in 24px — per blocchi corti mettere l'orario sulla stessa riga del titolo (“Leggere 20 minuti · 22:00–22:20”).
- [gravità: media] giornata-giorno-fondo__tab-light.png — sezione «Senza orario» riga «Ripasso flashcard» — è un'abitudine (nell'Adesso ha chip “Abitudine”) ma qui ha checkbox quadrata, icona libro blu e nessuna icona ↻; nel calendario le abitudini hanno bordo verde con ↻ — rendere coerente la rappresentazione delle abitudini in tutta l'app.
- [gravità: media] giornata-giorno-fondo__tab-light.png — icona orologio viola a destra di «Ripasso flashcard» — azione non chiara (pianifica? imposta ora?) e senza etichetta — usare un pulsante testuale “Dai un orario” o un tooltip; oppure permettere il trascinamento nel calendario.
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — campo «Nuova attività…» con pulsante «Aggiungi» incassato — il pulsante occupa tutta l'altezza meno 4px, margini interni diversi sopra/sotto rispetto a destra — dare margine uniforme di 6–8px o portare il pulsante fuori dal campo.
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — testo «Ripasso flashcard» 16px — più grande dei titoli nei blocchi del calendario (13px) nella stessa vista — uniformare la scala tipografica.
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — link «Sposta 1 non fatta a domani» — formulazione grammaticalmente zoppicante (“1 non fatta”) — “Sposta a domani l'attività non fatta” / “Sposta 1 attività a domani”.
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — etichetta «00:00» — attaccata al bordo inferiore della card (~8px), e la fascia tratteggiata del sonno finisce sulla riga — aggiungere padding inferiore alla griglia.

## giornata-settimana__tab-light.png
- [gravità: alta] giornata-settimana__tab-light.png — striscia dei giorni L–D (y 205–315) — il riquadro bianco di sfondo va da x≈20 a x≈810, cioè più largo delle card sotto (x 37–797) e dei pulsanti freccia: bordi non allineati con il resto — portare lo sfondo agli stessi margini (37px) oppure eliminarlo.
- [gravità: media] giornata-settimana__tab-light.png — titolo «17–23 ago» — allineato a sinistra accanto alla freccia, mentre nella vista Giorno «Oggi» è centrato fra le frecce — uniformare la testata di navigazione in tutte le viste (titolo centrato, frecce ai lati).
- [gravità: media] giornata-settimana__tab-light.png — liste per giorno — righe senza orario hanno l'icona ma non la colonna ora: i titoli partono a x=113 come gli altri ma lo spazio vuoto a sinistra sembra un errore; inoltre icona ↻ per abitudini e pallino per attività si mescolano — raggruppare “Senza orario” in fondo con un'etichetta “—” o “Tutto il giorno” nella colonna ora.
- [gravità: media] giornata-settimana__tab-light.png — pulsante «Sposta» su «Inbox a zero…» (Lunedì, giorno passato) e su «Confrontare piani…» — non dice dove sposta; appare solo su alcune righe senza spiegazione — “Sposta a oggi” / “Sposta a domani”, e mostrarlo coerentemente.
- [gravità: media] giornata-settimana__tab-light.png — tutta la vista su tablet — lista verticale giorno per giorno a una colonna: su 834px una vista settimana dovrebbe essere a griglia (7 colonne o 2 colonne di giorni) — offrire layout a colonne per tablet.
- [gravità: bassa] giornata-settimana__tab-light.png — «4 di 24 fatte questa settimana» — testo minuscolo (12px) attaccato in alto a sinistra della striscia — renderlo più leggibile e allinearlo al titolo “17–23 ago”.
- [gravità: bassa] giornata-settimana__tab-light.png — giorni futuri 19–23 — senza anello, solo numero; quelli passati con anello: altezza visiva diversa, numeri non sulla stessa linea ottica — mostrare un anello grigio vuoto anche per i giorni futuri.
- [gravità: bassa] giornata-settimana__tab-light.png — intestazione «Lunedì 17» grigia vs «Martedì 18» nera con chip «Oggi» — ok, ma la freccia › a destra non è chiaramente un link; l'area cliccabile non è evidente — rendere tutta l'intestazione toccabile con stato hover/pressione.

## giornata-mese__tab-light.png
- [gravità: alta] giornata-mese__tab-light.png — margini laterali — in vista Mese contenuti e card stanno a 16px dal bordo (frecce, calendario, lista «Oggi»), in Giorno/Settimana a 37px: la pagina “salta” cambiando tab — usare lo stesso margine orizzontale per tutte le viste.
- [gravità: media] giornata-mese__tab-light.png — calendario, righe 24–31 — giorni futuri senza anello e senza puntini e la riga «31» da sola lascia ~60px vuoti in fondo alla card — mostrare anelli vuoti o puntini anche nei futuri; ridurre il padding inferiore.
- [gravità: media] giornata-mese__tab-light.png — puntini colorati sotto i giorni — colori di aree senza legenda; illeggibili a 5px — aggiungere legenda o tooltip, oppure eliminarli.
- [gravità: media] giornata-mese__tab-light.png — lista «Oggi» sotto il calendario — le abitudini hanno un quadratino con bordo colorato (sembra una checkbox) e le attività un quadratino pieno: non è chiaro se si possono spuntare — usare checkbox reali o pallini area coerenti con la vista Settimana (che usa ↻ e pallini).
- [gravità: bassa] giornata-mese__tab-light.png — «18 giorni attivi   58 cose fatte» — “cose fatte” è colloquiale e diverso da “fatte” nella vista settimana — “58 completate”.
- [gravità: bassa] giornata-mese__tab-light.png — giorno 18 selezionato — sfondo grigio rettangolare + cerchio viola + anello: tre indicatori sovrapposti — sceglierne uno (cerchio pieno per oggi, contorno per selezione).
- [gravità: bassa] giornata-mese__tab-light.png — sotto-tab Giorno/Settimana/Mese/Anno — anche qui i tab sono a margine 16px mentre in Giorno partivano a 37px (larghezze diverse del segmento attivo) — stesso contenitore.

## giornata-anno__tab-light.png
- [gravità: media] giornata-anno__tab-light.png — margini — come in Mese, contenuti a 16px dal bordo contro i 37px di Giorno/Settimana — uniformare.
- [gravità: media] giornata-anno__tab-light.png — mini-calendari dei mesi — nessuna intestazione dei giorni (L M M G V S D) né legenda dell'intensità del verde; le celle grigie dei mesi futuri e passati vuoti sono identiche (Gen–Mag sembrano “futuri”) — aggiungere legenda “meno/più” e distinguere giorni passati senza attività da giorni futuri (es. futuri con solo contorno).
- [gravità: media] giornata-anno__tab-light.png — riquadri dei mesi — molto spazio vuoto in fondo a ogni card (Gen, Mag, Set ~35px) perché alcune hanno 5 righe e altre 6: altezze interne non omogenee — riservare sempre 6 righe o centrare verticalmente la griglia.
- [gravità: media] giornata-anno__tab-light.png — numeri verdi «7», «25», «17» in alto a destra di Giu/Lug/Ago — numeri senza unità né spiegazione — “7 giorni” o tooltip; renderli grigi/meno ambigui.
- [gravità: bassa] giornata-anno__tab-light.png — statistiche «49 giorni attivi / 82 fatte / 1874 XP» — “fatte” senza soggetto e “XP” compare solo qui (gergo da gioco non spiegato) — “82 completate”, “1874 punti” o spiegare gli XP.
- [gravità: bassa] giornata-anno__tab-light.png — card «Scadenze» — coperta per metà dalla barra di navigazione; icona valigetta a destra senza significato chiaro — padding inferiore; spiegare l'icona (area Lavoro) con il nome dell'area.
- [gravità: bassa] giornata-anno__tab-light.png — titolo «2026» allineato a sinistra accanto alla freccia — incoerente con «Oggi» centrato in vista Giorno — uniformare.

## giornata-sonno-aperto__tab-light.png
- [gravità: alta] giornata-sonno-aperto__tab-light.png — campi dei pasti (08:00 / 15 min / 🗑) — select nativi del browser non stilizzati (freccia di sistema, bordi diversi dai campi ora) e campi allineati all'estrema destra a ~520px dalle etichette «Colazione/Pranzo/Cena» — usare componenti stilizzati e un layout a griglia compatto (etichetta, ora, durata, elimina vicini) o ridurre la larghezza del pannello.
- [gravità: media] giornata-sonno-aperto__tab-light.png — riga «A letto [23:30]  Sveglia [07:30]» — campi enormi (290px) per un orario di 5 caratteri, mentre i campi dei pasti sono da 95px: stesso tipo di dato con larghezze diverse — usare la stessa larghezza (≈100px) per tutti i campi orario.
- [gravità: media] giornata-sonno-aperto__tab-light.png — etichette — «A letto»/«Sveglia» 14px con icona, «Colazione/Pranzo/Cena» 16px in grassetto senza icona: due stili di etichetta nello stesso pannello — uniformare.
- [gravità: media] giornata-sonno-aperto__tab-light.png — link «+ Pasto  Ripristina  Ritmo di base» — tre azioni testuali affiancate senza gerarchia; «Ripristina» e «Ritmo di base» non spiegano cosa fanno (ripristina cosa? apre il ritmo predefinito?) — “Aggiungi pasto” come pulsante, e un unico “Usa il ritmo di base” con conferma.
- [gravità: bassa] giornata-sonno-aperto__tab-light.png — icona cestino 🗑 — 12px, grigia, attaccata al select (4px) e senza area di tocco adeguata — 44×44px di area tocco, più distanza.
- [gravità: bassa] giornata-sonno-aperto__tab-light.png — riga di riepilogo «23:30 → 07:30 · 8h · ☕🍴🍴» ripetuta sopra al pannello aperto che mostra gli stessi dati — nascondere il riepilogo quando il pannello è aperto o sostituirlo con il titolo “Sonno e pasti di oggi”.
- [gravità: bassa] giornata-sonno-aperto__tab-light.png — bordo superiore — la barra dei sotto-tab è tagliata a metà (y=0) durante lo scorrimento: la testata non è fissa né scompare del tutto — rendere fissi i sotto-tab o farli scorrere via interamente.

## giornata-scheda-blocco__tab-light.png
- [gravità: alta] giornata-scheda-blocco__tab-light.png — titolo «Organizzare cena / con il gruppo» — va a capo dopo ~190px anche se la scheda è larga 640px: larghezza massima del titolo troppo stretta — togliere il max-width, il titolo deve occupare la larghezza della scheda.
- [gravità: media] giornata-scheda-blocco__tab-light.png — scheda in basso — su tablet un bottom sheet largo 640px ancorato al bordo inferiore, che esce dallo schermo (nessun margine sotto «Elimina») — su tablet usare un dialog centrato o un popover vicino al blocco toccato, con angoli arrotondati su tutti i lati.
- [gravità: media] giornata-scheda-blocco__tab-light.png — «↺ Segna come da fare» — testo grigio centrato che fluttua fra sottotitolo e lista, non sembra un pulsante; nella scheda abitudine l'azione equivalente è un grande pulsante verde «Fatta» — usare lo stesso componente (pulsante secondario a tutta larghezza in stato “fatto”, con tocco per annullare).
- [gravità: media] giornata-scheda-blocco__tab-light.png — valori «09:30» (nero) e «1 h 30» (viola) nelle pillole — stesso tipo di controllo con colori diversi; «1 h 30» ha uno spazio anomalo — stesso colore per tutti i valori modificabili; “1 h 30 min” o “1:30”.
- [gravità: media] giornata-scheda-blocco__tab-light.png — «Sposta in Da fare» — formula poco chiara (significa togliere dal calendario?) — “Togli dal calendario” o “Rimuovi orario”.
- [gravità: bassa] giornata-scheda-blocco__tab-light.png — manca un link «Apri l'attività» (presente invece nella scheda abitudine come «Apri l'abitudine») — aggiungere per coerenza.
- [gravità: bassa] giornata-scheda-blocco__tab-light.png — «Elimina» rosso nello stesso gruppo di «Sposta in Da fare» — azione distruttiva non separata — metterla in un gruppo a parte in fondo.

## giornata-scheda-abitudine__tab-light.png
- [gravità: media] giornata-scheda-abitudine__tab-light.png — pulsante «Fatta» — in Adesso lo stesso pulsante dice «Fatto»: incoerenza di genere/etichetta — usare un'unica forma (“Fatto”).
- [gravità: media] giornata-scheda-abitudine__tab-light.png — «× Salta oggi» — in Adesso la stessa azione usa l'icona ⏭ a destra; qui × a sinistra (che suggerisce “chiudi/elimina”) — usare la stessa icona ⏭ ovunque.
- [gravità: media] giornata-scheda-abitudine__tab-light.png — «Termina l'abitudine» in rosso fra «Salta oggi» e «Apri l'abitudine» — azione distruttiva incastrata in mezzo alle azioni neutre — spostarla in fondo, separata, o solo dentro la scheda abitudine.
- [gravità: media] giornata-scheda-abitudine__tab-light.png — bottom sheet su tablet — come per l'attività: ancorato in basso, esce dal bordo, enorme velo grigio su tutto — dialog centrato/popover.
- [gravità: bassa] giornata-scheda-abitudine__tab-light.png — pillole «18:00» nera e «45 min» viola — colori incoerenti come sopra.
- [gravità: bassa] giornata-scheda-abitudine__tab-light.png — sottotitolo «↻ Abitudine · Oggi» — l'icona ↻ c'è qui ma non nel sottotitolo «Attività · Oggi» della scheda attività: va bene come distinzione, ma la riga è grigia 13px troppo debole — ok aumentare contrasto.

## rituali__tab-light.png
- [gravità: media] rituali__tab-light.png — pagina intera — 5 righe in alto e 640px di vuoto sotto: su tablet la lista a fisarmonica spreca lo schermo — layout master/detail (elenco rituali a sinistra, rituale aperto a destra) o griglia di card 2×N con descrizione e orario consigliato.
- [gravità: media] rituali__tab-light.png — badge «1» sul tab Rituali — 4 rituali risultano “da fare/da compilare” ma il badge dice 1: il numero non corrisponde a nulla di visibile — far coincidere il badge con i rituali in attesa per l'ora attuale e spiegarlo (es. evidenziare quello “ora”).
- [gravità: media] rituali__tab-light.png — stato a destra «da fare / 2 di 3 scelte», «da compilare / 0 di 4» — due righe di micro-testo (11px) grigio, minuscolo, con verbi diversi per lo stesso stato (“da fare” vs “da compilare”) e “2 di 3 scelte” incomprensibile se il rituale è ancora da fare — unificare in un chip (“Da fare”, “Fatto ✓”) con progresso sotto il titolo (“2 priorità su 3”).
- [gravità: bassa] rituali__tab-light.png — icona «Piano del giorno» piena viola, le altre chiare — differenza non spiegata (è il rituale attuale?) — aggiungere etichetta “Adesso” o usare lo stesso stile.
- [gravità: bassa] rituali__tab-light.png — nessuna indicazione di quando fare ciascun rituale (mattina, sera, domenica) — aggiungere sottotitolo con momento consigliato.

## rituale-piano__tab-light.png
- [gravità: media] rituale-piano__tab-light.png — righe «Organizzare cena con il gruppo» / «Confrontare piani telefonici» — nessun controllo visibile per scegliere/deselezionare; icone a destra (👥 rosa, 💳 gialla) senza significato evidente; il chip «☆ Priorità» compare solo sulla prima — aggiungere checkbox/stella toccabile su ogni riga, sostituire le icone con il nome dell'area.
- [gravità: media] rituale-piano__tab-light.png — prima riga barrata — un'attività già fatta proposta nel piano del giorno come priorità: confonde — separarla (“già fatta ✓”) o non mostrarla.
- [gravità: media] rituale-piano__tab-light.png — campo «Aggiungi un‘altra…» — apostrofo tipografico sbagliato (‘ aperto invece di ’) — “Aggiungi un’altra…”; inoltre il segnaposto non dice “un'altra cosa”: “Aggiungi un'altra priorità…”.
- [gravità: media] rituale-piano__tab-light.png — pulsante «Salva +5 XP» — barra viola a tutta larghezza (730px) con icona floppy; la ricompensa XP in grigio-chiaro poco leggibile — pulsante più contenuto, icona ✓, “Salva il piano · +5 XP”.
- [gravità: bassa] rituale-piano__tab-light.png — contenuto del rituale aperto — padding sinistro del contenuto (53px) diverso da quello del titolo della riga (97px, allineato al testo dopo l'icona) — allineare il contenuto al testo del titolo o all'icona in modo coerente.
- [gravità: bassa] rituale-piano__tab-light.png — «Quando inizi?» con segnaposto «Es. alle 9:00, alla scrivania» — domanda poco chiara senza contesto — “Quando e dove inizi la prima?”.

## rituale-sonno-pasti__tab-light.png
- [gravità: alta] rituale-sonno-pasti__tab-light.png — pulsanti di salvataggio — dentro lo stesso rituale ci sono «Salva» (solo sonno, viola chiaro) e poi «Fatto» (viola pieno, a tutta larghezza): due salvataggi per un solo modulo, l'utente non sa se deve premerli entrambi — un unico pulsante finale; “Non ricordo” come opzione accanto agli orari.
- [gravità: media] rituale-sonno-pasti__tab-light.png — etichette dei pulsanti di conferma nei rituali — «Salva +5 XP» (Piano), «Fatto» (Sonno e pasti), «Registra +3 XP» (Check-in), con stili diversi (pieno/chiaro) e XP solo in alcuni — uniformare testo, stile e presenza dell'XP.
- [gravità: media] rituale-sonno-pasti__tab-light.png — pasti: pulsanti «sì / no / ⏰» — minuscoli, grigi, nessuno stato selezionato visibile; l'orologio non spiega che serve a indicare un orario diverso — segmented control “Sì / No / Altro orario” con stato attivo evidente.
- [gravità: media] rituale-sonno-pasti__tab-light.png — orari sonno «23:30 ⏰» e «07:30 ⏰» — qui sono testo con icona, nel pannello della Giornata sono campi di input: stessa informazione con controlli diversi — usare lo stesso componente.
- [gravità: media] rituale-sonno-pasti__tab-light.png — «Altre cose fatte» con campo «Una cosa che hai fatto…» — fuori tema in un rituale “Sonno e pasti” — spostarlo nella Fine giornata o rinominare il rituale.
- [gravità: bassa] rituale-sonno-pasti__tab-light.png — «Come sempre · 23:30–07:30» link viola a destra di «Sonno» — non è chiaro che sia un'azione (compila con i soliti orari); è allineato più in basso dell'etichetta «Sonno» — “Usa i soliti orari” come pulsante, allineato alla baseline.
- [gravità: bassa] rituale-sonno-pasti__tab-light.png — spaziature verticali — 40px fra «Sonno» e «A letto», ma solo 20px fra «Salva» e «Pasti»: ritmo verticale irregolare — uniformare la spaziatura fra sezioni (24–32px) e aggiungere separatori.

## rituale-checkin__tab-light.png
- [gravità: media] rituale-checkin__tab-light.png — pulsanti 1–5 selezionati (4 energia, 5 focus, 5 umore) — il selezionato si ingrandisce e sporge rispetto agli altri (il «5» esce oltre il margine destro dei campi a x≈785 vs 781) e ha ombra: la griglia si deforma — evidenziare solo con colore, senza scala.
- [gravità: media] rituale-checkin__tab-light.png — pulsante «Registra +3 XP» — il check-in è già «fatto» ma il pulsante resta uguale e non dice “Aggiorna”; stile viola chiaro diverso dal «Salva» pieno del Piano — mostrare “Aggiorna” quando già registrato; stesso stile primario.
- [gravità: media] rituale-checkin__tab-light.png — grafico «Andamento degli ultimi 14 giorni» — legenda doppia (in alto e etichette a fine linea), etichette «Focus/Umore/Energia» a destra sovrapposte ai punti e alle linee; buco nelle linee senza spiegazione (giorni senza dati) — tenere una sola legenda, spostare le etichette fuori dal tracciato, indicare i giorni mancanti.
- [gravità: bassa] rituale-checkin__tab-light.png — terminologia — domande «Quanto riesci a concentrarti?» / «Come ti senti?» ma nel grafico «Focus» / «Umore»: parole diverse per la stessa misura, e “Focus” è inglese — usare “Concentrazione” e “Umore” anche nelle domande come titolo.
- [gravità: bassa] rituale-checkin__tab-light.png — etichette di scala «1 · esausto  3 · normale  5 · pieno» — “pieno” per l'energia è innaturale — “carico”, “pieno di energia”.
- [gravità: bassa] rituale-checkin__tab-light.png — pulsanti 1–5 alti 50px e larghi 140px — enormi per una scala; il check-in occupa tutto lo schermo — ridurre a pillole compatte (≈56×44) o usare slider/emoji.
- [gravità: bassa] rituale-checkin__tab-light.png — grafico in fondo coperto dalla barra di navigazione — padding inferiore.

## rituale-sera__tab-light.png
- [gravità: alta] rituale-sera__tab-light.png — valutazione per area (8 righe) — nome area su una riga e pulsanti 1–5 sulla riga sotto allineati a destra: ogni area occupa 84px e lascia ~520px vuoti a sinistra; il modulo esce dallo schermo — su tablet mettere nome area e pulsanti sulla stessa riga (≈44px per area), o griglia a 2 colonne.
- [gravità: media] rituale-sera__tab-light.png — pulsanti 1–5 qui sono quadratini grigi 36px, nel Check-in sono pulsanti bianchi 140×50 con bordo: stessa scala 1–5 con due componenti diversi — un unico componente “scala 1–5”.
- [gravità: media] rituale-sera__tab-light.png — campo di testo in fondo («Es. ho studiato 90 minuti senza guardare il telefono») — coperto dalla barra di navigazione e tagliato — padding inferiore sufficiente.
- [gravità: bassa] rituale-sera__tab-light.png — intestazione «Com’è andata, area per area?  1 = male · 5 = benissimo» — legenda in grigio chiaro 12px attaccata alla domanda — metterla sotto o come etichette agli estremi della scala come nel Check-in.
- [gravità: bassa] rituale-sera__tab-light.png — nome rituale «Fine giornata» ma nell'elenco interno “Review della sera”: verificare che il nome sia uguale ovunque (notifiche, impostazioni).
- [gravità: bassa] rituale-sera__tab-light.png — obbligare a valutare 8 aree ogni sera è pesante — permettere di saltare aree non toccate oggi (“Non oggi”) o mostrare solo le aree con attività del giorno.

## rituale-settimana__tab-light.png
- [gravità: media] rituale-settimana__tab-light.png — numeri «216 / 10 / 6/7» — in carattere con grazie (serif), unico punto dell'app con questo font — usare il font numerico dell'app (stesso dello streak e dell'Anno).
- [gravità: media] rituale-settimana__tab-light.png — statistiche centrate mentre tutto il resto del pannello è allineato a sinistra; gruppo stretto (280px) in mezzo a 730px — usare la stessa riga statistiche a 3 colonne con separatori dell'Anno.
- [gravità: media] rituale-settimana__tab-light.png — terminologia — «azioni completate» qui, «cose fatte» in Mese, «fatte» in Anno/Settimana: tre nomi per la stessa metrica — scegliere un termine (“completate”).
- [gravità: bassa] rituale-settimana__tab-light.png — aree di testo — maniglia di ridimensionamento del browser visibile in basso a destra, nessun segnaposto/esempio — nascondere la maniglia (auto-grow) e aggiungere esempi come nella Fine giornata.
- [gravità: bassa] rituale-settimana__tab-light.png — «Apri le Scoperte» — link grigio con icona beuta, rientrato di 16px rispetto ai campi (x≈70 vs 53) e poco riconoscibile come azione — allinearlo al margine dei campi, colore link.
- [gravità: bassa] rituale-settimana__tab-light.png — il bilancio della settimana appare “da fare” già di martedì — mostrarlo solo nel giorno previsto (es. domenica) o con stato “disponibile domenica”.

## attivita-sistemare__tab-light.png
- [gravità: media] attivita-sistemare__tab-light.png — pulsanti «Oggi / Da fare / Scarta» — stanno fuori dalla card dell'elemento, separati da 16px: non è evidente che agiscono su «Idea: bot…» — metterli dentro la card (footer della card) o raggruppare card+azioni in un unico contenitore.
- [gravità: media] attivita-sistemare__tab-light.png — select «Altro / Esplorazione» — select nativo grigio con freccia di sistema, alto 44px e largo 180px, stile diverso da tutti gli altri chip area dell'app — usare il chip area (come nella scheda “Relazioni & Sociale”).
- [gravità: media] attivita-sistemare__tab-light.png — lista «In coda 5» — testi grigi senza contenitore, senza icona e non toccabili in apparenza; «e un'altra» in corsivo invece di mostrare l'elemento (c'è tutto lo spazio) — mostrare tutti gli elementi in righe toccabili, o permettere di sceglierli.
- [gravità: media] attivita-sistemare__tab-light.png — pagina su tablet — una card in alto e 550px vuoti — layout a due colonne: elemento corrente a sinistra, coda a destra; oppure lista completa con azioni rapide per riga.
- [gravità: bassa] attivita-sistemare__tab-light.png — etichetta «Da sistemare» sotto il segmented control — ripete il nome del tab attivo — eliminarla o sostituirla con istruzione (“Decidi dove va ogni idea”).
- [gravità: bassa] attivita-sistemare__tab-light.png — badge «6» sulla voce Attività della barra inferiore — corrisponde a “Da sistemare” ma non a “Da fare 9”: non chiaro — chiarire il significato o usare un pallino.
- [gravità: bassa] attivita-sistemare__tab-light.png — «Scarta» in rosso con lo stesso peso dei pulsanti positivi — ridurre a pulsante testuale/icona.
- [gravità: bassa] attivita-sistemare__tab-light.png — «aggiunta 18 ago, 10:30» — micro-testo grigio troppo vicino al select; manca un'azione per modificare il testo — ok, aggiungere tocco per modificare.

## attivita-dafare__tab-light.png
- [gravità: media] attivita-dafare__tab-light.png — righe attività — nessuna casella di spunta: non si può completare un'attività dalla lista (solo “+ Oggi”) — aggiungere checkbox a sinistra come in Adesso/Poi.
- [gravità: media] attivita-dafare__tab-light.png — pulsante «+ Oggi» della prima riga pieno viola, gli altri chiari — differenza non spiegata (già in Oggi? suggerito?) — se significa “già in Oggi” scrivere “In Oggi ✓”; altrimenti stile uguale.
- [gravità: media] attivita-dafare__tab-light.png — «1 di 3», «1 di 4» a destra — numeri senza contesto (passi completati) — “1/3 passi” con icona o barra di progresso sotto il titolo.
- [gravità: bassa] attivita-dafare__tab-light.png — filtro «Tutte ⌄» — attaccato all'etichetta «Importanti 3» (8px sotto) e allineato a sinistra da solo — più spazio (16px) e metterlo sulla stessa riga del campo o a destra dell'intestazione.
- [gravità: bassa] attivita-dafare__tab-light.png — icone area (libro, razzo, valigetta, cuore, lampadina) piccole (12px) e unico indizio dell'area — aggiungere nome area come sottotitolo o colore più evidente; su tablet c'è spazio per una colonna “Area”.
- [gravità: bassa] attivita-dafare__tab-light.png — titoli 17px semibold molto pesanti per una lista lunga — peso regular/medium.
- [gravità: bassa] attivita-dafare__tab-light.png — spazio su tablet — lista a colonna unica a tutta larghezza con il pulsante a 700px di distanza dal titolo — limitare la larghezza o mostrare dettagli (area, scadenza) in colonne.

## attivita-dafare-aggiunta__tab-light.png
- [gravità: media] attivita-dafare-aggiunta__tab-light.png — riga opzioni «Oggi / Domani / Senza data / Altro / Esplorazione» — rientrata di 12px rispetto al campo (x=49 vs 37), senza etichette (“Quando”, “Area”); il select area è di nuovo nativo con freccia di sistema — allineare al margine del campo, aggiungere micro-etichette, usare un chip area stilizzato.
- [gravità: media] attivita-dafare-aggiunta__tab-light.png — opzioni mancanti — non si può segnare come importante, scegliere data precisa o durata, pur essendoci tutto lo spazio — aggiungere “☆ Importante” e “📅 Data…”.
- [gravità: bassa] attivita-dafare-aggiunta__tab-light.png — tre pulsanti data e select hanno raggi e paddings diversi (chip 12px vs select 10px), select più largo del contenuto — uniformare.
- [gravità: bassa] attivita-dafare-aggiunta__tab-light.png — il filtro «Tutte» resta fra le opzioni e la lista, attaccato a «Importanti» — durante l'aggiunta nasconderlo o staccarlo meglio (ritmo 8/16/24).

## attivita-abitudini__tab-light.png
- [gravità: media] attivita-abitudini__tab-light.png — elenco abitudini — qui ogni abitudine è una card separata con cerchio di spunta grande a DESTRA; in Da fare le righe sono raggruppate in un'unica card senza spunta; in Adesso il cerchio è a SINISTRA — uniformare componente lista e posizione della spunta (a sinistra).
- [gravità: media] attivita-abitudini__tab-light.png — riepilogo «0 di 3 oggi» con anello vuoto grigio — anello a 0% sembra un placeholder rotto; testo “oggi” isolato sotto — scrivere “0 di 3 fatte oggi” sulla stessa riga, anello con traccia colorata più visibile, o barra come in Adesso.
- [gravità: media] attivita-abitudini__tab-light.png — campo «Nuova abitudine…» in fondo alla lista; in Da fare il campo «Nuova attività…» è in cima — stessa posizione in entrambe le liste.
- [gravità: bassa] attivita-abitudini__tab-light.png — meta «18:00 · Salute & Sport 🔥3» — lo streak appare solo per la prima, le altre non mostrano nulla (0?) — mostrare sempre lo streak o spiegare.
- [gravità: bassa] attivita-abitudini__tab-light.png — «Leggere 20 minuti» classificata «Salute & Sport» — contenuto incoerente nei dati di esempio (dovrebbe essere Crescita/Altro) — correggere i dati demo.
- [gravità: bassa] attivita-abitudini__tab-light.png — cerchi colorati 44px vuoti per area (verde/blu) — non sembrano checkbox ma avatar — aggiungere ✓ in grigio dentro o ridurre.
- [gravità: bassa] attivita-abitudini__tab-light.png — 600px vuoti sotto — su tablet mostrare la settimana delle abitudini (griglia L–D con spunte) accanto a ogni riga, sfruttando la larghezza.

## attivita-abitudini-nuova__tab-light.png
- [gravità: media] attivita-abitudini-nuova__tab-light.png — pallini giorni L M M G V S D — distribuiti su 730px con ~70px fra l'uno e l'altro: sembrano elementi scollegati — raggrupparli (gap 8px) allineati a sinistra o centrati.
- [gravità: media] attivita-abitudini-nuova__tab-light.png — pannello opzioni (Giorni/Ora/Area) — card separata dal campo «Meditare» da 14px, sembra un elemento della lista e non le opzioni del campo — unire campo e opzioni in un unico contenitore con bordo attivo.
- [gravità: media] attivita-abitudini-nuova__tab-light.png — tutti i giorni pieni viola: nessuno stato deselezionato visibile, e «Ogni giorno» in grigio a destra sembra un valore non modificabile — mostrare chiaramente il toggle per giorno (pieno/contorno) e rendere «Ogni giorno» un preset toccabile.
- [gravità: bassa] attivita-abitudini-nuova__tab-light.png — pillola «Nessuna» grigia vs «Salute & Sport» viola — due stili di valore nella stessa lista — stesso stile, con testo grigio per il vuoto.
- [gravità: bassa] attivita-abitudini-nuova__tab-light.png — area preimpostata «Salute & Sport» per «Meditare» — scelta arbitraria senza indicazione che è automatica — lasciare vuoto o mostrare “suggerita”.
- [gravità: bassa] attivita-abitudini-nuova__tab-light.png — manca «Annulla» per chiudere la creazione — aggiungere.

## scheda-attivita__tab-light.png
- [gravità: alta] scheda-attivita__tab-light.png — chip «Giovedi» — manca l'accento: “Giovedì” — correggere.
- [gravità: alta] scheda-attivita__tab-light.png — titolo «Recuperare i corsi di / ingegneria gestionale» — va a capo a metà scheda come nella scheda calendario: max-width del titolo troppo stretto — usare tutta la larghezza.
- [gravità: media] scheda-attivita__tab-light.png — gruppo «Dettagli» — tre controlli con tre affordance diverse: «Studio / Università ⌄» (select), «nessuna ›» (navigazione), «no» (testo nudo senza toggle) — usare uno switch per «Fissa in alto», chevron coerenti, valori con maiuscola (“Nessuna”, “No”).
- [gravità: media] scheda-attivita__tab-light.png — «↺ Non completata ›» — etichetta che descrive uno stato invece di un'azione e chevron di navigazione: non si capisce cosa succede — “Segna come non fatta”/“Rinvia” o rimuovere.
- [gravità: media] scheda-attivita__tab-light.png — chip «Pianifica» (grigi pieni) e chip «Distribuisci i passi» (bianchi, minuscolo) — stesso tipo di scelta rapida con stili e maiuscole diverse — uniformare stile e iniziale maiuscola.
- [gravità: media] scheda-attivita__tab-light.png — righe dei passi — cerchi 44px che toccano i divisori (riga 52px), passo completato con cerchio verde pieno molto pesante — cerchi 24px con area di tocco invisibile 44px, più respiro verticale.
- [gravità: media] scheda-attivita__tab-light.png — bottom sheet alto quanto lo schermo su tablet, ancorato in basso e tagliato sotto «Elimina» — dialog centrato o pannello laterale destro (sheet a colonna) su tablet.
- [gravità: bassa] scheda-attivita__tab-light.png — «Distribuisci i passi» dentro lo stesso riquadro grigio dei passi, sotto «Aggiungi un passo…» — appare come parte della lista — separarlo con un titolo di sezione proprio.
- [gravità: bassa] scheda-attivita__tab-light.png — icone calendario e cestino per ogni passo sempre visibili, piccole (14px) — mostrarle con swipe/menu o aumentarne l'area di tocco.
- [gravità: bassa] scheda-attivita__tab-light.png — «Aggiungi il prossimo passo a Oggi» pulsante primario enorme subito sotto il titolo — ok come azione principale, ma con icona ◎ poco chiara — icona “+” o “☀”.

## scheda-attivita-fondo__tab-light.png
- [gravità: media] scheda-attivita-fondo__tab-light.png — testata fissa con il titolo — il pulsante viola «Aggiungi il prossimo passo a Oggi» scorre sotto la testata e resta tagliato a metà, senza ombra né divisore che indichi lo scorrimento — aggiungere divisore/ombra alla testata quando si scorre, o ridurre il titolo a una riga compatta.
- [gravità: media] scheda-attivita-fondo__tab-light.png — fondo della scheda — anche scorsa fino in fondo la scheda finisce sul bordo inferiore dello schermo con ~25px sotto «Elimina» e senza safe-area — padding inferiore ≥ 32px + safe-area; su tablet dialog centrato.
- [gravità: bassa] scheda-attivita-fondo__tab-light.png — lo scorrimento interno è di soli 24px: la scheda è quasi tutta visibile ma comunque scorrevole — su tablet rendere la scheda alta quanto il contenuto o comprimere le sezioni.
- (restano validi i difetti di scheda-attivita: «Giovedi» senza accento, titolo a capo, affordance incoerenti nei Dettagli.)

## scheda-abitudine__tab-light.png
- [gravità: media] scheda-abitudine__tab-light.png — «Salta oggi» — qui link testuale viola a destra del pulsante, in Adesso testo grigio con ⏭, nella scheda calendario riga con × : tre rappresentazioni della stessa azione — un solo stile.
- [gravità: media] scheda-abitudine__tab-light.png — riga giorni «Quando» L–D — i pallini non riempiono la riga (D finisce a x≈650, la card a 718): spaziatura diversa da quella del calendario sopra (che usa 7 colonne piene) e dalla creazione abitudine — allineare i pallini alle stesse 7 colonne del calendario.
- [gravità: media] scheda-abitudine__tab-light.png — «Ora 18:00 ×» — la × è fuori dalla pillola, nella scheda calendario era dentro; «Durata» non ha × — stessa pillola con × interna per tutti i valori cancellabili.
- [gravità: media] scheda-abitudine__tab-light.png — statistiche «3 di fila / 4 record / 7 in tutto» — “4 record” si legge come “quattro record” — “Record: 4 di fila”, “7 volte in tutto”.
- [gravità: bassa] scheda-abitudine__tab-light.png — «Inizio 29/07/2026» in formato numerico, altrove le date sono «18 ago», «7 set» — usare “29 lug 2026”.
- [gravità: bassa] scheda-abitudine__tab-light.png — valori pillole: «18:00» nero, «45 min»/«Salute & Sport»/«29/07/2026» viola, «Mai» grigio scuro — tre colori — uniformare.
- [gravità: bassa] scheda-abitudine__tab-light.png — calendario — sabato/domenica senza cerchio (non previsti) ma con numero grigio simile ai giorni futuri: poco distinguibili dai giorni passati non fatti (cerchio grigio) — legenda o stile tratteggiato per “non previsto”.
- [gravità: bassa] scheda-abitudine__tab-light.png — «Elimina» qui è un pulsante centrato a sé, nella scheda attività è una riga allineata a sinistra con icona — uniformare.
- [gravità: bassa] scheda-abitudine__tab-light.png — sottotitolo «lun–ven · 18:00» accanto al chip area — formato abbreviato diverso da “L–V” usato nei pallini — coerenza.

## scheda-abitudine-fondo__tab-light.png
- [gravità: media] scheda-abitudine-fondo__tab-light.png — testata fissa — scorrendo sparisce la riga chip area + «lun–ven · 18:00» e il divisore sotto il titolo è un filo grigio che taglia la scheda; il pulsante «Fatta» si attacca al divisore (12px) — più spazio sotto la testata e ombra leggera.
- [gravità: media] scheda-abitudine-fondo__tab-light.png — fondo della scheda — «Elimina» a ~30px dal bordo dello schermo, la scheda prosegue oltre il bordo — padding inferiore + safe area; dialog centrato su tablet.
- (restano validi i difetti di scheda-abitudine: “Salta oggi” incoerente, pallini Quando non allineati alle colonne, × fuori pillola, date numeriche.)

## andamento__tab-light.png
- [gravità: alta] andamento__tab-light.png — card «Costanza» — la griglia del calendario occupa ~200px in alto a sinistra di una card larga 760px: 75% della card vuoto; nessuna etichetta di mesi/giorni — allargare le celle per riempire la card (o affiancare Costanza e Per area in due colonne), aggiungere etichette mesi e giorni.
- [gravità: media] andamento__tab-light.png — numero «38» con fiamma e «65% 81 di 124» — nessuna etichetta: non si capisce che 38 sono giorni di fila e 65% il tasso di completamento di cosa/in che periodo — “38 giorni di fila”, “65% completate negli ultimi 30 giorni”.
- [gravità: media] andamento__tab-light.png — colori — la heatmap qui è blu, in Giornata › Anno la stessa informazione (giorni attivi) è verde; anche la striscia giorni sopra è verde — un solo colore per “attività completata”.
- [gravità: media] andamento__tab-light.png — striscia giorni «M G V S D L M» — inizia da mercoledì (ultimi 7 giorni) senza date, e la casella di oggi ha un doppio bordo viola che la fa sembrare selezionata — aggiungere il numero del giorno, evidenziare oggi con etichetta “Oggi”.
- [gravità: media] andamento__tab-light.png — layout tablet — tutte card a tutta larghezza impilate — griglia a 2 colonne (streak+costanza a sinistra, per area a destra).
- [gravità: bassa] andamento__tab-light.png — «Per area» — percentuale in grassetto + frazione grigia piccola attaccata (4/8): la frazione è quasi illeggibile — stessa riga con più spazio o sotto la barra.
- [gravità: bassa] andamento__tab-light.png — tab «Riepilogo / Scoperte» con icona pollice in su per Scoperte — icona non pertinente (sembra “mi piace”) — usare lampadina o beuta (usata altrove per Scoperte).
- [gravità: bassa] andamento__tab-light.png — titoli di card con icona («↗ Costanza», «⊕ Per area») — icone generiche che non aggiungono significato; il titolo «Costanza» non spiega che è una heatmap delle attività — sottotitolo “Ultimi 3 mesi”.

## andamento-fondo__tab-light.png
- [gravità: media] andamento-fondo__tab-light.png — lista «Riflessioni passate / Sessioni del timer / Aree / Grafici» — «Aree» è anche in Profilo: doppio punto d'accesso con nomi uguali e contesto diverso; «Grafici» generico — tenere Aree in un solo posto; rinominare “Grafici” in “Energia, concentrazione e umore”.
- [gravità: bassa] andamento-fondo__tab-light.png — solo «Riflessioni passate» mostra un conteggio (79), le altre righe no — mostrare il conteggio anche per le sessioni del timer o nessun conteggio.
- [gravità: bassa] andamento-fondo__tab-light.png — striscia giorni in alto tagliata durante lo scorrimento e nessuna testata fissa con i tab Riepilogo/Scoperte — testata fissa o compatta.
- (restano validi: Costanza minuscola in una card enorme, colore blu vs verde.)

## scoperte__tab-light.png
- [gravità: media] scoperte__tab-light.png — sottotitoli «misurato», «lo noto ogni volta», «notato una volta» — formule poco naturali e incoerenti fra loro (participio vs prima persona), “misurato” oscuro — usare un'unica scala: “Verificato con un esperimento”, “Succede sempre”, “Visto una volta”.
- [gravità: media] scoperte__tab-light.png — icone 👍/👎 in riquadri 44px con bordo e sfondo su ogni riga — pesanti e ripetitive, dato che la sezione già dice «Funziona/Non funziona» — sostituire con un pallino/colore o togliere.
- [gravità: bassa] scoperte__tab-light.png — sotto-tab «Registro» con icona pollice — stessa icona del tab superiore «Scoperte»: ridondante; «Registro» è un termine poco chiaro — “Cosa ho notato” / “Elenco”.
- [gravità: bassa] scoperte__tab-light.png — campo «Aggiungi una scoperta…» — non chiede se funziona o no: la classificazione avviene dopo? non evidente — mostrare scelta 👍/👎 accanto al campo.
- [gravità: bassa] scoperte__tab-light.png — sotto-tab (Registro/Esperimenti) come blocchi pieni a metà larghezza: terzo stile di tab nell'app (oltre al segmented control e a Giorno/Settimana) — unificare.
- [gravità: bassa] scoperte__tab-light.png — 230px vuoti sotto la lista su tablet; due liste potrebbero stare affiancate (Funziona | Non funziona) — layout a due colonne.

## scoperte-esperimenti__tab-light.png
- [gravità: media] scoperte-esperimenti__tab-light.png — grafico 1, etichetta «media 3,1» — sovrapposta ai punti dati (un punto copre la “e” di “media”); «media 4,3» poggia sulla linea tratteggiata — spostare le etichette fuori dall'area dati o con sfondo bianco.
- [gravità: media] scoperte-esperimenti__tab-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» — hanno bordo e ombra come pulsanti ma sono etichette; nel secondo esperimento lo stato è un pallino verde «attivo» e la metrica va a capo su una riga separata: due layout di testata diversi — chip piatti senza bordo, stessa posizione (stato accanto al titolo, metrica nel sottotitolo).
- [gravità: media] scoperte-esperimenti__tab-light.png — box risultato «…differenza di +1,2. L'entità del cambiamento è grande (d≈3,1)» — gergo statistico (d di Cohen) incomprensibile all'utente medio — “Un miglioramento netto” + dettaglio tecnico nascosto in “Come si calcola”.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — testo introduttivo — limitato a ~400px in una card da 760px, con pulsante «+ Nuovo esperimento» sotto; occupa una card intera ad ogni visita — renderlo comprimibile (“Come funziona?”) e mettere “Nuovo esperimento” in testata.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — paragrafo «La modifica: …» limitato a metà larghezza mentre il grafico è a tutta larghezza — allineare le larghezze.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — asse Y con solo 1, 3, 5 e asse X senza date — aggiungere date inizio/fine dei periodi.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — «Focus» in inglese (titolo «aumenta il mio focus?») — “concentrazione”.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — secondo grafico: etichette «media 55» tagliate dalla barra di navigazione — padding inferiore.

## scheda-scoperta__tab-light.png
- [gravità: media] scheda-scoperta__tab-light.png — titolo «Una cosa che hai capito» e subito sotto l'etichetta «Cosa hai capito» — ridondanza; il titolo dovrebbe essere la scoperta stessa — titolo “Scoperta”, campo senza etichetta duplicata.
- [gravità: media] scheda-scoperta__tab-light.png — nessun pulsante «Salva»/«Fatto» — non è chiaro se le modifiche si salvano da sole — aggiungere “Fatto” in testata o un feedback “Salvato”.
- [gravità: media] scheda-scoperta__tab-light.png — «Provalo con un esperimento» proposto su una scoperta già «misurato» — incoerente — nasconderlo o “Vedi l'esperimento”.
- [gravità: bassa] scheda-scoperta__tab-light.png — chip «notato una volta / lo noto ogni volta / misurato» e «funziona / non funziona» tutte in minuscolo — iniziale maiuscola come nel resto dell'app.
- [gravità: bassa] scheda-scoperta__tab-light.png — area di testo con maniglia di ridimensionamento del browser visibile — nasconderla, auto-altezza.
- [gravità: bassa] scheda-scoperta__tab-light.png — «Esito» (scelta fondamentale) sepolto dentro «Dettagli» sotto «Quanto ne sei sicuro» — portarlo subito dopo il testo.
- [gravità: bassa] scheda-scoperta__tab-light.png — bottom sheet che esce dal fondo dello schermo, angoli inferiori non visibili — dialog centrato su tablet.

## profilo__tab-light.png
- [gravità: alta] profilo__tab-light.png — numeri incoerenti fra schermate — Profilo «109 fatte / 65% completate», Anno «82 fatte», Andamento «65% 81 di 124», Mese «58 cose fatte»: senza periodo dichiarato sembrano contraddirsi — indicare il periodo (“da sempre”, “quest'anno”, “ultimi 30 giorni”) accanto a ogni numero.
- [gravità: media] profilo__tab-light.png — navigazione — nessun titolo «Profilo», nessun pulsante indietro e nessuna voce attiva nella barra inferiore: la pagina è orfana — titolo + freccia indietro (o chiusura), oppure aprirla come pannello.
- [gravità: media] profilo__tab-light.png — «Promemoria — bloccati» — stato di errore (notifiche bloccate dal browser) scritto in grigio come un valore normale — evidenziarlo (icona ⚠ arancione, “Notifiche bloccate: attivale”).
- [gravità: media] profilo__tab-light.png — pagina su tablet — 480px vuoti sotto; card profilo con bio limitata a 400px — su tablet griglia a due colonne o colonna centrata max 640px.
- [gravità: bassa] profilo__tab-light.png — avatar «R» quadrato arrotondato qui, cerchio nell'header delle altre schermate — stessa forma.
- [gravità: bassa] profilo__tab-light.png — statistiche «38 giorni» — “giorni” da solo è ambiguo (di fila? attivi?) — “38 giorni di fila”.
- [gravità: bassa] profilo__tab-light.png — nome e bio non sembrano modificabili (nessuna icona ✎) — aggiungere “Modifica profilo”.
- [gravità: bassa] profilo__tab-light.png — valori a destra in minuscolo («8 attive», «bloccati») — maiuscola iniziale coerente.

## impostazioni__tab-light.png
- [gravità: media] impostazioni__tab-light.png — sezione «Account» — contiene solo «Sincronizzazione»; il gruppo successivo (Area predefinita, Timer, Musica, Aspetto) non ha intestazione e appare sotto Account — aggiungere intestazione “Preferenze”.
- [gravità: media] impostazioni__tab-light.png — affordance miste — «Sincronizzazione: su questo dispositivo» senza chevron, «Area predefinita: Automatica ⌄» select, gli altri con ›, «Esporta/Importa dati» senza chevron — uniformare: › per sottopagine, nessun indicatore solo per azioni immediate, ma con icona coerente.
- [gravità: media] impostazioni__tab-light.png — Impostazioni aperte come bottom sheet sopra il Profilo — pagina complessa e lunga in un foglio senza pulsante chiudi né titolo fisso; su tablet esce dal bordo inferiore — pagina a tutto schermo o vista master/detail (lista a sinistra, dettaglio a destra).
- [gravità: bassa] impostazioni__tab-light.png — «Backup e ripristino 1» — numero senza significato — “1 backup” o data dell'ultimo backup.
- [gravità: bassa] impostazioni__tab-light.png — «Scienza», «Registro tecnico» in “Guida” — “Scienza” troppo vago, “Registro tecnico” non è una guida — “Su cosa si basa l'app”; spostare il registro in una sezione “Avanzate”.
- [gravità: bassa] impostazioni__tab-light.png — valori in minuscolo («chiedi sempre», «nessuna», «automatico») mentre «Automatica» è maiuscolo — uniformare (maiuscola iniziale).
- [gravità: bassa] impostazioni__tab-light.png — «Rimuovi dati di esempio» con icona ✨ e «Cancella tutti i dati» in gruppi separati senza descrizione delle conseguenze — aggiungere sottotitolo esplicativo.

## impostazioni-fondo__tab-light.png
- [gravità: media] impostazioni-fondo__tab-light.png — testata fissa «Impostazioni» — l'intestazione di sezione «Account» passa sotto il divisore della testata e resta a 6px dal filo; scorrimento di soli 12px — più margine sotto la testata; su tablet la lista dovrebbe stare tutta senza scorrere o essere una pagina vera.
- [gravità: bassa] impostazioni-fondo__tab-light.png — fondo — «Cancella tutti i dati» a ~25px dal bordo, foglio tagliato — padding inferiore/safe area.
- (restano validi i difetti di impostazioni: gruppo senza intestazione, affordance miste, valori minuscoli.)

## imp-timer__tab-light.png
- [gravità: media] imp-timer__tab-light.png — «Pausa lunga ogni 4 — Mai» — frase contraddittoria (“ogni 4… mai”) — etichetta “Pausa lunga” con valore “Ogni 4 cicli, 15 min” o “Disattivata”.
- [gravità: media] imp-timer__tab-light.png — «Avvio rapido: Durata 5 min / Poi continua per 25 min» — concetto non spiegato (si parte con 5 minuti e poi?) — aggiungere una riga descrittiva (“Inizia con 5 minuti per vincere la resistenza, poi prosegue”).
- [gravità: media] imp-timer__tab-light.png — altezza del foglio — passando da Impostazioni (foglio alto) a Timer (foglio basso, parte da y=420) il pannello cambia altezza bruscamente lasciando il Profilo visibile sopra — altezza costante per la navigazione dentro lo stesso foglio.
- [gravità: bassa] imp-timer__tab-light.png — etichette righe 16px regular qui, 14px semibold in Impostazioni — stesso stile di riga in tutte le sottopagine.
- [gravità: bassa] imp-timer__tab-light.png — link indietro «‹ Impostazioni» 12px sopra il titolo — area di tocco piccola; metterlo a sinistra nella testata come pulsante 44px.
- [gravità: bassa] imp-timer__tab-light.png — sezioni con una sola riga («Avvio», «Sessione») — molti titoletti per poche righe; accorpare.

## imp-musica__tab-light.png
- [gravità: media] imp-musica__tab-light.png — campi «Incolla il link» — senza bordo, bianco quasi invisibile sul grigio, attaccati al divisore inferiore (0–2px) e con margine sopra di 20px: spaziatura sbilanciata — bordo visibile, padding simmetrico 12px sopra/sotto ogni campo.
- [gravità: media] imp-musica__tab-light.png — 9 campi vuoti identici impilati — muro di input; non spiega quali link (Spotify? YouTube?) finché non si arriva alla nota in fondo — mettere la spiegazione in alto e mostrare le aree come righe “Aggiungi playlist ›” compatte.
- [gravità: bassa] imp-musica__tab-light.png — gruppo «Predefinita» senza titolo di sezione, mentre «Per area» lo ha — aggiungere intestazione “Generale”.
- [gravità: bassa] imp-musica__tab-light.png — interruttore «Apri all'avvio del timer» spento quasi invisibile (grigio chiaro su grigio) — aumentare il contrasto della traccia.
- [gravità: bassa] imp-musica__tab-light.png — nota finale «Senza pubblicità e a schermo spento serve l'abbonamento…» — frase contorta — “Per ascoltare senza pubblicità e a schermo spento serve un abbonamento Spotify o YouTube Premium.”
- [gravità: bassa] imp-musica__tab-light.png — etichette righe 16px regular senza icone, in Aspetto 14px semibold con icone — uniformare.

## imp-aspetto__tab-light.png
- [gravità: media] imp-aspetto__tab-light.png — «Suoni», «Vibrazione» dentro «Aspetto» — non sono aspetto — spostarle in “Suoni e vibrazione” o rinominare la sezione “Aspetto e feedback”.
- [gravità: media] imp-aspetto__tab-light.png — foglio alto solo 390px ancorato in basso, con il Profilo velato sopra e 170px di velo vuoto — altezza costante con la pagina Impostazioni o dialog centrato.
- [gravità: bassa] imp-aspetto__tab-light.png — interruttori verdi (stile iOS) mentre il colore d'accento dell'app è viola — usare l'accento dell'app.
- [gravità: bassa] imp-aspetto__tab-light.png — segmented «Auto / Chiaro / Scuro» dentro un gruppo grigio con etichetta «Tema» sopra: contenitore dentro contenitore; il segmento selezionato ha un'ombra che sborda sotto — togliere il doppio contenitore, ombra contenuta.
- [gravità: bassa] imp-aspetto__tab-light.png — manca una riga per la dimensione del testo / riduzione movimento (Animazioni c'è) — valutare.

## aree__tab-light.png
- [gravità: media] aree__tab-light.png — cestino fra nome e interruttore su ogni riga — due azioni (disattiva / elimina) affiancate, il cestino minuscolo (12px) è facile da toccare per errore e non chiaro rispetto allo switch — spostare l'eliminazione in un menu/scheda dell'area o in modalità “Modifica”.
- [gravità: media] aree__tab-light.png — righe area — non c'è modo visibile di cambiare nome, icona, colore o ordine — rendere la riga toccabile (› ) per aprire il dettaglio, maniglia per riordinare.
- [gravità: bassa] aree__tab-light.png — interruttori verdi (accento iOS) — l'app usa viola come accento — uniformare.
- [gravità: bassa] aree__tab-light.png — «Nuova area» — icona libro grigia preimpostata nel campo senza possibilità visibile di sceglierla; «Aggiungi» testuale qui, pulsante con “+” negli altri campi di aggiunta — stesso componente di inserimento.
- [gravità: bassa] aree__tab-light.png — foglio tagliato sul fondo (campo «Nome» a 25px dal bordo) — padding inferiore.
- [gravità: bassa] aree__tab-light.png — titolo «Le tue aree» mentre la voce di menu dice «Aree» — uniformare.

## sonno-pasti__tab-light.png
- [gravità: media] sonno-pasti__tab-light.png — stesso contenuto del pannello «Sonno e pasti» della Giornata ma con controlli diversi: qui pillole e × per eliminare, là campi nativi, select e cestino; qui «Salva», là salvataggio implicito — un unico componente “Sonno e pasti” riusato.
- [gravità: media] sonno-pasti__tab-light.png — «Promemoria nell'app — Sonno: Tra le 05:00 – 14:00» e «Pasti: Alle 19:00» — non si capisce cosa ricorda (registrare il sonno? andare a letto?) né perché un solo orario per tutti i pasti — aggiungere descrizioni (“Ti chiediamo come hai dormito fra le 5 e le 14”).
- [gravità: bassa] sonno-pasti__tab-light.png — orari nelle pillole allineati a destra con 40px vuoti a sinistra — centrarli.
- [gravità: bassa] sonno-pasti__tab-light.png — «Durata 8h» in grigio e valore non in pillola — ok come dato calcolato, ma etichetta grigia uguale a sottorighe “Tra le/Alle”: gerarchia confusa — distinguere valori calcolati con stile proprio.
- [gravità: bassa] sonno-pasti__tab-light.png — pillole ora nere, pillole durata viola — incoerenza già vista.
- [gravità: bassa] sonno-pasti__tab-light.png — × per eliminare il pasto grigio senza area di tocco evidente; vicino alla pillola durata — usare cestino o swipe, 44px.

## promemoria__tab-light.png
- [gravità: media] promemoria__tab-light.png — riquadro «Bloccati» — card giallo a metà larghezza (340px) con ombra, testo centrato, che sembra un toast fluttuante sovrapposto e non allineato alle card sotto (larghe 600px) — banner a tutta larghezza, testo allineato a sinistra, senza ombra, con pulsante “Come riattivarle”.
- [gravità: media] promemoria__tab-light.png — interruttori disattivati delle notifiche — grigi con pomello a destra: non si capisce se sono accesi (ma bloccati) o spenti — mostrare lo stato reale con opacità ridotta e una nota “in pausa finché le notifiche sono bloccate”.
- [gravità: media] promemoria__tab-light.png — «Server — da collegare» — termine tecnico senza spiegazione per l'utente — “Promemoria anche ad app chiusa — Configura” con descrizione.
- [gravità: bassa] promemoria__tab-light.png — testo «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo.» — formulazione contorta — “Per riattivarle apri le impostazioni del browser e consenti le notifiche per questo sito.”
- [gravità: bassa] promemoria__tab-light.png — «Priorità del giorno» 16:30 — nome diverso dai rituali (“Piano del giorno” è già alle 08:30); non chiaro cosa ricorda — “Controllo delle priorità”.
- [gravità: bassa] promemoria__tab-light.png — «Non disturbare — Attivo» acceso e verde mentre tutte le notifiche sono bloccate — incoerente visivamente; disattivare/attenuare anche questa sezione.
- [gravità: bassa] promemoria__tab-light.png — gap verticale di 45px fra il riquadro «Bloccati» e «Notifiche», 20px fra le altre sezioni — uniformare.

## diario__tab-light.png
- [gravità: alta] diario__tab-light.png — barra di navigazione inferiore — è evidenziato «Andamento» anche se il Diario si apre da Profilo (‹ Profilo): stato di navigazione errato — evidenziare la sezione corretta o nessuna.
- [gravità: media] diario__tab-light.png — Diario è una pagina intera con «‹ Profilo» e titolo grande, mentre Aree, Sonno e pasti, Promemoria e Impostazioni si aprono come fogli: pattern di navigazione incoerenti per voci della stessa lista — uno solo.
- [gravità: media] diario__tab-light.png — colonna azioni ↶ e orari — l'icona annulla è 8px più in basso dell'orario e del testo (non allineati alla prima riga), e le due colonne stanno a x≈570–635 lasciando 140px vuoti a destra — allineare alla baseline della prima riga e portare l'orario al margine destro.
- [gravità: media] diario__tab-light.png — «Priorità [Relazioni & Sociale ⌄]» — select dell'area sotto la riga, preceduto da «Priorità» (o da un'icona nella riga di ieri): non si capisce cosa si sta scegliendo né perché serva nel diario — mostrare l'area come chip di sola lettura; modifica nella scheda.
- [gravità: media] diario__tab-light.png — icona ↶ (annulla) su ogni voce — azione pericolosa e ambigua (annulla il completamento? elimina la nota?) ripetuta 15 volte senza etichetta — spostarla in un menu “…” o swipe con conferma.
- [gravità: bassa] diario__tab-light.png — dati demo: note alle 00:30, 02:30, 04:30, 06:30 — orari notturni irrealistici — dati demo più credibili.
- [gravità: bassa] diario__tab-light.png — «Check-in · energia 4 · focus 5 · umore 5» — “focus” inglese, misure in minuscolo — “Energia 4 · Concentrazione 5 · Umore 5”.
- [gravità: bassa] diario__tab-light.png — segmented «Cose importanti / Tutto» dentro la card, piccolo e allineato a sinistra con divisore sotto — portarlo fuori dalla card sotto il titolo; “Cose importanti” → “In evidenza”.
- [gravità: bassa] diario__tab-light.png — prefissi «Annotato · », «Completata · » ripetuti su ogni riga, con l'icona che già indica il tipo — rimuovere il prefisso o renderlo grigio piccolo.

## timer-scelta__tab-light.png
- [gravità: media] timer-scelta__tab-light.png — foglio «Timer» ancorato in basso, lontano 300px dal pulsante «Timer» che l'ha aperto — su tablet usare un popover ancorato al pulsante.
- [gravità: bassa] timer-scelta__tab-light.png — icone dentro riquadri bianchi con bordo e ombra (40px) — effetto “pulsante dentro pulsante”, pesante — icona semplice colorata senza riquadro.
- [gravità: bassa] timer-scelta__tab-light.png — valori a destra («5 min», «nessun limite») a 4px dal bordo della card, mentre a sinistra c'è 12px — padding destro uguale al sinistro (16px).
- [gravità: bassa] timer-scelta__tab-light.png — nessuna descrizione delle modalità (cosa fa “Avvio rapido”? “Sessione” vs “Pomodoro”?) e nessuna indicazione della predefinita — sottotitolo di una riga per ognuna.
- [gravità: bassa] timer-scelta__tab-light.png — «nessun limite» minuscolo, «25 + 5 min» — maiuscola iniziale; “25 min + 5 di pausa”.

## timer-concentrazione__tab-light.png
- [gravità: alta] timer-concentrazione__tab-light.png — manca il pulsante Pausa/Avvia — il timer mostra 25:00 “restano” ma l'unica azione principale è «Fatto»: non si capisce se il timer stia andando né come metterlo in pausa — aggiungere un pulsante play/pausa grande come azione principale.
- [gravità: media] timer-concentrazione__tab-light.png — riquadro attorno al tempo — quadrato arrotondato grigio scuro che non mostra alcun progresso (non è un anello che si svuota) — usare un anello di avanzamento visibile.
- [gravità: media] timer-concentrazione__tab-light.png — «Termina» con icona calendario-× (la stessa di “Termina l'abitudine”) — ambiguo: termina la sessione o l'abitudine? — “Interrompi sessione” con icona ■.
- [gravità: bassa] timer-concentrazione__tab-light.png — «Pomodoro · blocco 1» — manca il totale — “Pomodoro · 1 di 4”; “blocco” poco usato, meglio “sessione”.
- [gravità: bassa] timer-concentrazione__tab-light.png — «restano» sotto il numero, grigio scuro su nero poco leggibile — aumentare contrasto.
- [gravità: bassa] timer-concentrazione__tab-light.png — pulsante chiudi × in alto a destra senza conferma apparente e a 12px dai bordi — margine 16–20px, conferma se il timer è in corso.
- [gravità: bassa] timer-concentrazione__tab-light.png — blocco centrale leggermente sopra il centro, con 300px vuoti sotto — su tablet centrare verticalmente o mostrare musica/prossimo passo sotto.

## cattura__tab-light.png
- [gravità: media] cattura__tab-light.png — riga inferiore con solo «Chiudi» separata da un divisore — 50px di altezza per un link; il divisore è rientrato di 5px (non tocca i bordi) — mettere “Annulla” a sinistra di “Salva” nella stessa riga o usare tap fuori/Esc; divisore a filo.
- [gravità: media] cattura__tab-light.png — nessuna indicazione di dove finisce il pensiero (Da sistemare) né scelta rapida di area/oggi — aggiungere sottotitolo “Finisce in Da sistemare” e scorciatoie opzionali.
- [gravità: bassa] cattura__tab-light.png — «Salva» viola pieno attivo anche con campo vuoto — disabilitarlo finché non si scrive.
- [gravità: bassa] cattura__tab-light.png — icona fulmine ⚡ — significato poco chiaro per “pensiero” — icona “nota”/“inbox” coerente con Da sistemare.
- [gravità: bassa] cattura__tab-light.png — popup largo 640px posizionato a y=145, non centrato e non ancorato al pulsante «+» che l'ha aperto (in basso a destra) — popover vicino al “+” o centrato verticalmente.

## menu-oggi-avatar__tab-light.png
- [gravità: media] menu-oggi-avatar__tab-light.png — tocco sull'avatar — porta direttamente alla pagina Profilo a tutto schermo, senza animazione di contesto, senza titolo né “indietro”, e la barra inferiore non evidenzia nessuna voce: l'utente perde l'orientamento — aprire un menu/popover dall'avatar (Profilo, Impostazioni, Diario) o mostrare la pagina con “‹ Oggi” e titolo.
- (stessi difetti di profilo__tab-light.png: numeri senza periodo, “bloccati” non evidenziato, spazio vuoto.)

## trascinamento-in-corso__tab-light.png
- [gravità: media] trascinamento-in-corso__tab-light.png — banner «Dati di esempio · Rimuovi ×» — compare in cima solo in questa schermata e spinge giù tutto il layout di 60px — mostrarlo in modo coerente (sempre o mai) e non durante il trascinamento; usare un banner meno invasivo.
- [gravità: media] trascinamento-in-corso__tab-light.png — etichetta flottante «Organizzare cena con il gruppo · alle 12:45» — posizionata a ~11:30, 80px sopra l'anteprima di rilascio, ripete l'orario già scritto nell'anteprima («12:45–14:15») — attaccare l'etichetta all'anteprima o eliminarla.
- [gravità: media] trascinamento-in-corso__tab-light.png — anteprima 12:45–14:15 sovrapposta a «Pranzo» senza alcun avviso di conflitto — evidenziare la sovrapposizione (bordo rosso/“si sovrappone al pranzo”) o affiancare i blocchi.
- [gravità: media] trascinamento-in-corso__tab-light.png — zona «Togli l'orario» — copre la griglia dalle 18:00 e il blocco «Camminata / movimento» e si sovrappone alla barra di navigazione (si toccano) — farla apparire al posto della barra di navigazione o sopra con margine; rendere più chiaro il bordo tratteggiato.
- [gravità: bassa] trascinamento-in-corso__tab-light.png — testo «12:45–14:15» in alto a sinistra dell'anteprima sopra la riga delle 13:00 e attaccato al bordo — padding interno 8px.
- [gravità: bassa] trascinamento-in-corso__tab-light.png — si sta trascinando un'attività già completata (barrata) — valutare se permetterlo o mostrare avviso.

## Riassunto

Esaminati tutti i 44 screenshot tablet (834×1112, tema chiaro).

### 1. Layout da telefono stirato su tablet (problema principale)
- Quasi tutte le pagine sono una colonna unica a tutta larghezza (760px) con grandi vuoti sotto: Adesso, Rituali, Da sistemare, Abitudini, Profilo, Scoperte. Su tablet serve una colonna centrata (max ~640px) oppure layout a due colonne / master-detail (Rituali, Impostazioni, Andamento, Scoperte Funziona|Non funziona).
- Componenti stirati: «Fatto» largo 720px, «Salva +XP» a tutta larghezza, scala 1–5 del Check-in con pulsanti 140×50, pallini dei giorni sparsi su 730px, Fine giornata con nome area e pulsanti su righe diverse (8 aree × 84px).
- «Costanza» (Andamento): heatmap di 200px in una card da 760px.
- Tutte le schede (attività, abitudine, scoperta, impostazioni, timer) sono bottom sheet ancorati in basso, tagliati sul bordo inferiore e con altezza che salta fra sottopagine. Su tablet servono dialog centrati, popover o pannelli laterali.

### 2. Margini e allineamenti incoerenti
- Giornata: margine 37px in Giorno/Settimana, 16px in Mese/Anno. La pagina “salta” cambiando tab.
- Settimana: lo sfondo della striscia dei giorni è più largo delle card sotto.
- Titoli delle schede che vanno a capo a metà larghezza: «Organizzare cena / con il gruppo», «Recuperare i corsi di / ingegneria gestionale».
- Contenuto sotto la barra di navigazione flottante senza padding inferiore: Cena, Scadenze, grafici, campo della Fine giornata.
- Diario: icona ↶ non allineata alla riga e colonna orari staccata dal bordo destro. Musica: campi attaccati al divisore. Promemoria: banner «Bloccati» a metà larghezza, come un toast.

### 3. Stessi componenti con aspetto diverso
- Tre stili di tab (segmented control, sotto-tab Giorno/Settimana, sotto-tab Registro/Esperimenti).
- Blocchi del calendario in tre stili (attività piena, abitudine solo bordo, pasti centrati).
- Spunta: cerchio a sinistra in Adesso, cerchio a destra in Abitudini, nessuna spunta in Da fare, quadrato in «Senza orario».
- Scala 1–5 con due componenti diversi (Check-in e Fine giornata).
- «Salta oggi» in tre stili e con tre icone diverse. «Fatto» e «Fatta».
- Pulsanti di conferma dei rituali: «Salva +5 XP», «Fatto», «Registra +3 XP», «Salva +25 XP», pieni o chiari.
- Pillole valore in nero, viola o grigio. La × di cancellazione dentro o fuori dalla pillola.
- Select nativi del browser non stilizzati (pannello sonno, Da sistemare, aggiunta attività) accanto a chip stilizzati.
- Sonno e pasti con due editor diversi: pannello Giornata e Profilo.
- Interruttori verdi iOS mentre l'accento dell'app è viola. Un solo punto con font serif (Bilancio settimana).
- Navigazione del Profilo mista: Diario è una pagina intera, le altre voci sono fogli.

### 4. Testi e terminologia
- Errori: «Giovedi» senza accento. «Aggiungi un‘altra…» con l'apostrofo sbagliato.
- Termini diversi per la stessa cosa: «fatte», «cose fatte», «azioni completate», «completate». «Focus» (inglese) e «concentrazione». «Fine giornata» e «Review della sera».
- Formule innaturali o oscure: «Sposta 1 non fatta a domani», «2 di 3 scelte», «Pausa lunga ogni 4 – Mai», «4 record», «misurato», «lo noto ogni volta», «Server: da collegare», «d≈3,1», «Sposta in Da fare», «Non completata ›».
- Valori in minuscolo misti a valori con maiuscola.

### 5. UX e affordance
- Timer di concentrazione senza pulsante Pausa/Avvia e senza progresso visibile. «Termina» è ambiguo.
- Numeri che si contraddicono fra schermate senza periodo dichiarato: Profilo 109 fatte, Anno 82, Andamento 81 di 124, Mese 58.
- Badge senza significato chiaro: «1» su Rituali con 4 rituali da fare; «6» su Attività.
- Barra di navigazione con stato errato: Diario evidenzia Andamento; Profilo non evidenzia nulla e non ha «indietro»; il tocco sull'avatar apre una pagina orfana.
- Azioni distruttive mescolate alle azioni neutre: «Termina l'abitudine», ↶ su ogni voce del diario, cestino accanto allo switch in Aree.
- Elementi che sembrano toccabili e non lo sono (o viceversa):
  - chip di stato con bordo negli Esperimenti;
  - testo nudo «no» in «Fissa in alto»;
  - lista «In coda» in testo grigio;
  - icone 👥 e 💳 nel Piano del giorno.
- Doppio salvataggio nel rituale Sonno e pasti («Salva» e «Fatto»). Nessun «Salva» nella scheda scoperta.
- Calendario: la linea “adesso” taglia il testo dei blocchi. Nessun avviso di sovrapposizione nel trascinamento. La zona «Togli l'orario» copre blocchi e barra.
- Grafici: legenda doppia, etichette «media» sovrapposte ai punti, nessuna legenda per i puntini nel Mese e per l'intensità nell'Anno.
- Colore della costanza blu in Andamento e verde in Giornata › Anno.
