# Revisione tablet — giro 4

## oggi-adesso__tab-light.png
- [media] oggi-adesso__tab-light.png — sotto il titolo «Martedì 18 agosto» — la barra con «1 di 2» non dice di cosa (attività? abitudini?) ed è corta (~175 px) rispetto alla colonna — scrivere «1 di 2 fatte oggi» o simile e allungare la barra a tutta la larghezza del titolo
- [media] oggi-adesso__tab-light.png — chip arancione «38 giorni» in alto a destra — numero senza contesto (serie? giorni consecutivi?) — aggiungere «di fila» o un’etichetta/tooltip «Serie: 38 giorni»
- [media] oggi-adesso__tab-light.png — metà inferiore dello schermo (da y≈650 a 1030) — ~380 px vuoti su tablet, la colonna da ~680 px lascia anche ampi margini laterali — sul tablet usare un layout a due colonne (card «adesso» + «Poi» affiancate) oppure mostrare più elementi in «Poi» / un riepilogo della giornata
- [bassa] oggi-adesso__tab-light.png — barra di navigazione in basso — la barra è larga quasi tutto lo schermo (≈810 px) mentre il contenuto è ≈680 px; il pulsante «+» viola è incollato al bordo destro dopo un separatore e le tre voci sono distribuite su spazi enormi — allineare la barra alla larghezza della colonna o trasformarla in una barra compatta centrata, con il «+» integrato
- [bassa] oggi-adesso__tab-light.png — badge «6» su «Attività» — il badge copre in parte l’icona — spostarlo in alto a destra dell’icona con bordo bianco di separazione

## andamento-fondo__tab-light.png
- [alta] andamento-fondo__tab-light.png — card «Costanza» — la griglia occupa ~200 px su ~640 disponibili, il resto della card è vuoto; non ci sono etichette di mesi/giorni della settimana né periodo coperto — allargare la heatmap a tutta la card (celle più grandi o più settimane), aggiungere etichette dei giorni (L, M, …) e dei mesi, e un sottotitolo con il periodo («ultime 12 settimane»)
- [media] andamento-fondo__tab-light.png — card «Per area» — non si capisce cosa misurino le percentuali e le frazioni grigie («4/8», «23/44»): attività completate? giorni? in quale periodo? — aggiungere un sottotitolo tipo «Completate negli ultimi 30 giorni» e scrivere «4 su 8»
- [bassa] andamento-fondo__tab-light.png — frazioni «4/8», «17/28» — grigio chiaro e corpo piccolo accanto alla percentuale in nero grassetto, contrasto basso — scurire il grigio (almeno 4.5:1) e alzare di 1 px
- [bassa] andamento-fondo__tab-light.png — striscia settimanale in alto, giorno «V» — casella grigia vuota senza icona: non si capisce se è «saltato», «nessun dato» o «giorno di riposo» — usare un segno esplicito (trattino o ×) e una legenda
- [bassa] andamento-fondo__tab-light.png — elenco «Riflessioni passate / Sessioni del timer / Aree / Grafici» — solo la prima riga ha un conteggio («79»), le altre no; «Aree» qui duplica la voce di Profilo — mostrare un conteggio coerente su tutte o su nessuna e valutare se «Aree» serva qui

## andamento__tab-light.png
- [alta] andamento__tab-light.png — card in alto: «38» con fiamma e «65% / 81 di 124» — due numeri grandi senza etichetta: non si capisce che 38 sono giorni di serie né a cosa si riferisca il 65% (attività completate? in che periodo?) — aggiungere micro-etichette «giorni di fila» sotto 38 e «completate questo mese» sotto 65%
- [media] andamento__tab-light.png — layout generale — su 834 px le card restano in una sola colonna stretta; «Costanza» è per due terzi vuota — sul tablet affiancare «Costanza» e la card della serie, o allargare la heatmap a tutta la card
- [media] andamento__tab-light.png — heatmap «Costanza» — vedi andamento-fondo: piccola, senza assi né periodo — come sopra
- [bassa] andamento__tab-light.png — striscia settimanale — le lettere M, G, V, S, D, L, M partono da mercoledì e «M» compare due volte (mercoledì e martedì) — usare abbreviazioni non ambigue («Me», «Ma») o numeri del giorno sotto la lettera
- [bassa] andamento__tab-light.png — barra di navigazione flottante — sotto la barra, tra barra e bordo, si intravede il contenuto che scorre (riga «Sessioni del timer» tagliata) — aggiungere un fondo sfumato/solido sotto la barra o un padding inferiore della pagina pari all’altezza della barra

## aree__tab-light.png
- [media] aree__tab-light.png — foglio «Le tue aree» — su tablet il foglio è ancorato in basso e tocca il bordo inferiore senza margine (il campo «Nuova area» finisce a ~30 px dal bordo, nessuno spazio di sicurezza); il «+» della barra resta visibile accanto al foglio — su tablet presentarlo come finestra centrata con margini su tutti i lati, oppure aggiungere padding inferiore e coprire del tutto la barra
- [media] aree__tab-light.png — riga di ogni area — il cestino (azione distruttiva) è piccolo e attaccato all’interruttore, facile da toccare per errore; manca qualunque conferma visibile — spostare l’eliminazione dentro un menu «…» o in un dettaglio dell’area, oppure distanziarlo e colorarlo in rosso con conferma
- [media] aree__tab-light.png — interruttori — non c’è testo che spieghi cosa fa l’interruttore (attiva/nascondi l’area?) — aggiungere un sottotitolo sotto il titolo «Spegni un’area per nasconderla senza perdere i dati»
- [bassa] aree__tab-light.png — intestazione del foglio — manca un pulsante «Fine»/«Chiudi»: l’unica affordance è la maniglia grigia — aggiungere «Fine» in alto a destra
- [bassa] aree__tab-light.png — sezione «Nuova area» — non si può scegliere icona/colore (icona grigia fissa nel campo) e non si capisce se il nome dell’area esistente sia modificabile — rendere l’icona del campo toccabile per scegliere icona e colore e indicare che toccando una riga la si rinomina

## attivita-abitudini-nuova__tab-light.png
- [media] attivita-abitudini-nuova__tab-light.png — pannello opzioni della nuova abitudine, righe «Ora» e «Area» — i due valori usano pillole di stile diverso («Nessuna» grigia, «Salute & Sport» viola) e l’area risulta già preimpostata su «Salute & Sport» senza che l’utente l’abbia scelta — usare lo stesso stile per entrambi i selettori (viola solo se scelto dall’utente) e partire da «Nessuna area» o dall’area più usata dichiarandolo
- [bassa] attivita-abitudini-nuova__tab-light.png — riga dei giorni L…D — tutti i cerchi sono pieni viola: non si vede come appare un giorno deselezionato e il cerchio pieno non suggerisce che sia toccabile — mostrare stato attivo/inattivo ben distinti (pieno vs contorno) e un aiuto «Tocca per escludere un giorno»
- [bassa] attivita-abitudini-nuova__tab-light.png — riga «Camminata / movimento», «🔥 3» — numero della serie senza etichetta — aggiungere «3 di fila» o tooltip
- [bassa] attivita-abitudini-nuova__tab-light.png — intestazione «0 di 3 / oggi» — il cerchio di avanzamento vuoto grigio a sinistra è molto chiaro e sembra un segnaposto — dare un colore alla traccia o mostrare la percentuale all’interno
- [bassa] attivita-abitudini-nuova__tab-light.png — area sotto il modulo — ~320 px vuoti su tablet — su tablet il pannello delle opzioni potrebbe aprirsi a destra dell’elenco (due colonne)

## attivita-abitudini__tab-light.png
- [media] attivita-abitudini__tab-light.png — tutta la parte sotto «Nuova abitudine…» — oltre metà schermo vuota su tablet; le righe abitudine mostrano solo il cerchio di oggi — su tablet sfruttare la larghezza mostrando gli ultimi 7 giorni per ogni abitudine (mini-striscia) accanto al cerchio
- [media] attivita-abitudini__tab-light.png — contatore «0 di 3 oggi» vs schermata Oggi («1 di 2») e Andamento (oggi già spuntato) — i contatori non coincidono tra schermate e nessuno dice cosa conta — uniformare la definizione e scrivere esplicitamente «abitudini fatte oggi» / «cose fatte oggi»
- [bassa] attivita-abitudini__tab-light.png — badge della barra in basso «6» su «Attività» — coincide con «Da sistemare 6» ma non è spiegato; con «Da fare 9» e «Abitudini 3» non è chiaro cosa segnali — usare un pallino senza numero o chiarire che indica gli elementi da sistemare
- [bassa] attivita-abitudini__tab-light.png — riga «Camminata / movimento» — «🔥 3» senza etichetta (come sopra)

## attivita-dafare-aggiunta__tab-light.png
- [alta] attivita-dafare-aggiunta__tab-light.png — opzioni della nuova attività, selettore area «Altro / Esplorazione» — è un <select> nativo non stilizzato (freccia di sistema, angoli e altezza diversi dalle pillole «Oggi/Domani/Senza data») — sostituirlo con una pillola uguale alle altre che apre un menu/foglio con icone e colori delle aree
- [media] attivita-dafare-aggiunta__tab-light.png — filtro «Tutte» subito sotto le opzioni della nuova attività — le opzioni del compositore e il filtro dell’elenco sono attaccati e sembrano lo stesso gruppo; inoltre il filtro parte a x≈77 mentre le pillole a x≈89 (non allineati) — separare visivamente (più spazio o un divisore), allineare a sinistra e mettere il filtro sulla stessa riga dei titoli di sezione o in alto a destra
- [media] attivita-dafare-aggiunta__tab-light.png — pulsante «+ Oggi» della prima riga — è pieno viola mentre tutti gli altri sono tenui: sembra uno stato diverso (già aggiunta? focus?) senza spiegazione — se è uno stato hover/focus residuo eliminarlo; se indica «già in Oggi» usare un’etichetta diversa («In Oggi ✓»)
- [media] attivita-dafare-aggiunta__tab-light.png — «1 di 3», «1 di 4» a destra delle righe — numeri senza etichetta (passi completati?) — scrivere «1/3 passi» o usare un’icona di checklist accanto
- [media] attivita-dafare-aggiunta__tab-light.png — righe dell’elenco — non c’è un cerchio/checkbox per completare l’attività, a differenza di Oggi e Abitudini; l’unica azione visibile è «+ Oggi» — aggiungere il cerchio di completamento a sinistra per coerenza
- [bassa] attivita-dafare-aggiunta__tab-light.png — titoli di sezione «Importanti 3», «Altre 6» — corpo piccolo e grigio, gerarchia debole rispetto alle righe in grassetto — alzare a 15–16 px semibold

## attivita-dafare__tab-light.png
- [media] attivita-dafare__tab-light.png — prima riga «Recuperare i corsi…», pulsante «+ Oggi» pieno viola — anche a riposo è diverso dagli altri: stato non spiegato (consigliata? già pianificata?) — dare un significato esplicito (es. etichetta «Consigliata» o «In Oggi») o uniformare
- [media] attivita-dafare__tab-light.png — righe senza cerchio di completamento — vedi attivita-dafare-aggiunta — aggiungere il cerchio a sinistra
- [media] attivita-dafare__tab-light.png — «1 di 3», «1 di 4» — numeri senza unità — «1/3 passi»
- [bassa] attivita-dafare__tab-light.png — filtro «Tutte» — etichetta ambigua (tutte le aree? tutte le scadenze?) e pulsante isolato con poco spazio sopra «Importanti» (≈12 px) rispetto a quello sotto il campo (≈16 px) — scrivere «Tutte le aree» e allinearlo a destra sulla riga del titolo «Importanti»
- [bassa] attivita-dafare__tab-light.png — spazio inferiore e laterale — su tablet ~200 px vuoti in basso e margini laterali ampi; le righe sono molto larghe con il pulsante «+ Oggi» lontano dal titolo — limitare la larghezza delle righe o usare due colonne (Importanti | Altre)

## attivita-sistemare__tab-light.png
- [alta] attivita-sistemare__tab-light.png — card dell’elemento, selettore «Altro / Esplorazione» — <select> nativo non stilizzato (freccia di sistema, fondo grigio, angoli diversi) — sostituire con la stessa pillola/menu delle aree usato altrove
- [media] attivita-sistemare__tab-light.png — elenco «In coda 5» — righe in testo semplice grigio senza card, icone né affordance: non si capisce se si possono toccare per sistemarle subito; «e un’altra» in corsivo nasconde un elemento anche se sotto ci sono ~500 px vuoti — mostrare tutte le righe (lo spazio c’è) come righe toccabili con chevron o rendere «e un’altra» un link «Mostra tutte»
- [bassa] attivita-sistemare__tab-light.png — etichetta «Da sistemare» sopra la card — ripete esattamente la scheda selezionata — sostituire con un’istruzione utile («Dove la metti?» / «1 di 6»)
- [bassa] attivita-sistemare__tab-light.png — tre pulsanti «Oggi / Da fare / Scarta» — manca un’opzione per rimandare/saltare senza decidere, e non c’è indicazione di quanti ne restano dopo questo — aggiungere «Dopo» o un contatore «1 di 6»
- [bassa] attivita-sistemare__tab-light.png — «aggiunta 18 ago, 10:30» — grigio piccolo con contrasto basso — scurire leggermente

## cattura__tab-light.png
- [media] cattura__tab-light.png — pulsante «Salva» — è pieno e attivo anche con il campo vuoto — mostrarlo disattivato (tenue) finché non c’è testo
- [media] cattura__tab-light.png — popup — nessuna indicazione di dove finisce il pensiero (va in «Da sistemare»?) — aggiungere una riga di aiuto «Finisce in Attività › Da sistemare» al posto della riga vuota
- [bassa] cattura__tab-light.png — riga inferiore con solo «Chiudi» — una riga intera (≈48 px) per un link piccolo in viola, mentre «Salva» è in alto: le due azioni sono separate su righe diverse — mettere «Annulla» a sinistra di «Salva» o usare un’icona × in alto a destra ed eliminare la riga
- [bassa] cattura__tab-light.png — linea divisoria — è rientrata di pochi pixel dai bordi del popup (non va da bordo a bordo né rispetta il padding interno di 16 px) — allinearla al padding del contenuto o farla a tutta larghezza

## diario__tab-light.png
- [alta] diario__tab-light.png — voci «Completata · …» con menu a tendina «Relazioni & Sociale», «Associazioni» — <select> nativi non stilizzati in mezzo al diario (freccia di sistema, bordo grigio), che allargano le righe in modo irregolare — mostrare l’area come etichetta in sola lettura (icona + nome); se va modificabile, farlo nella scheda dell’attività
- [alta] diario__tab-light.png — etichetta «Priorità» seguita da un menu con il nome di un’area — testo sbagliato/ambiguo: «Priorità» non corrisponde al valore (un’area); inoltre compare solo su alcune voci (in «Organizzare cena con il gruppo» di ieri manca) — correggere l’etichetta in «Area» o rimuoverla, e uniformare tutte le voci
- [media] diario__tab-light.png — icona ↺ (annulla) su ogni riga — affordance poco chiara (annulla cosa?) e allineata più in basso sia del testo sia dell’orario (≈10 px sotto) — allineare icona e orario alla prima riga di testo e aggiungere un’etichetta accessibile/tooltip «Annulla»; valutare di mostrarla solo sulle voci annullabili
- [media] diario__tab-light.png — link «‹ Profilo» in alto a sinistra — sta a x≈24, fuori dalla colonna del contenuto (x≈77) dove sono allineati titolo e card — allinearlo al bordo sinistro della colonna
- [media] diario__tab-light.png — barra in basso — è evidenziata «Andamento» mentre si è in Profilo › Diario: incoerente con il percorso «‹ Profilo» — evidenziare la voce corretta o nessuna
- [bassa] diario__tab-light.png — «Check-in · energia 4 · focus 5 · umore 5» — scala non indicata — scrivere «4/5» o mostrare piccoli indicatori a pallini
- [bassa] diario__tab-light.png — colonna degli orari — molto distante dal testo (≈90 px dopo l’icona ↺) su tablet, l’occhio deve saltare — spostare l’orario a sinistra dell’icona della voce o subito sotto il testo
- [bassa] diario__tab-light.png — controllo «Cose importanti / Tutto» — ombra sotto la scheda attiva che sborda fuori dal contenitore — togliere l’ombra o contenerla

## giornata-anno__tab-light.png
- [media] giornata-anno__tab-light.png — numeri verdi in alto a destra dei mesi («7», «25», «17») — numeri senza etichetta (giorni attivi? attività?) — aggiungere un’unità («17 giorni») o una legenda sotto la riga dei totali
- [media] giornata-anno__tab-light.png — mini calendari dei mesi — nessuna intestazione dei giorni della settimana né numeri; i giorni futuri hanno lo stesso grigio dei giorni passati senza attività — aggiungere L M M G V S D in piccolo sopra almeno la prima riga e usare un grigio più chiaro/tratteggiato per i giorni futuri
- [media] giornata-anno__tab-light.png — vista «Anno» dentro «La giornata» — il nome della sezione («La giornata») contraddice le viste Settimana/Mese/Anno — rinominare la scheda in «Calendario» o «Agenda»
- [bassa] giornata-anno__tab-light.png — totale «1874 XP» — termine inglese da videogioco, unico in tutta l’app e non spiegato — tradurre («punti») o spiegare come si guadagnano
- [bassa] giornata-anno__tab-light.png — navigazione «‹ 2026 ›» — l’anno è attaccato alla freccia sinistra mentre la destra è all’estremo opposto: composizione sbilanciata — centrare l’anno tra le due frecce o raggruppare le frecce a destra
- [bassa] giornata-anno__tab-light.png — due livelli di schede (Adesso/La giornata/Rituali e Giorno/Settimana/Mese/Anno) con stili diversi: la seconda ha icone sopra il testo e una pillola viola tenue — stile accettabile ma la scheda attiva del secondo livello ha poco contrasto (testo viola su viola chiaro) — rafforzare il contrasto o usare una sottolineatura

## giornata-giorno-fondo__tab-light.png
- [media] giornata-giorno-fondo__tab-light.png — link «Sposta a domani quella non fatta» — italiano poco naturale e ambiguo («quella» quale?) — «Sposta a domani le attività non fatte (1)» o «Sposta a domani ciò che resta»
- [media] giornata-giorno-fondo__tab-light.png — sezione «Senza orario», riga «Ripasso flashcard» — casella quadrata, mentre in Oggi/Abitudini/Adesso il completamento è un cerchio; inoltre è un’abitudine ma non ha l’icona ↻ usata nel calendario — uniformare il controllo (cerchio) e mostrare l’icona abitudine
- [media] giornata-giorno-fondo__tab-light.png — fascia tratteggiata 23:30–00:00 — nessuna etichetta: non si capisce che è il sonno — aggiungere «Sonno» con icona luna come per «Pranzo»/«Cena»
- [bassa] giornata-giorno-fondo__tab-light.png — blocco «Leggere 20 minuti» alle 22:00 — non mostra l’intervallo orario, a differenza di «Camminata / movimento» (18:00–18:45) — mostrare l’orario anche nei blocchi brevi (in linea, accanto al titolo)
- [bassa] giornata-giorno-fondo__tab-light.png — icona orologio viola a destra della riga «Ripasso flashcard» — affordance non spiegata (assegna orario?) — aggiungere testo «Dai un orario» o tooltip
- [bassa] giornata-giorno-fondo__tab-light.png — blocchi «Pranzo»/«Cena» con testo centrato mentre attività e abitudini sono allineate a sinistra con maniglia — allineare a sinistra anche i pasti per coerenza

## giornata-giorno__tab-light.png
- [media] giornata-giorno__tab-light.png — riga riassuntiva «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — tre icone di pasti senza orari né etichetta, la riga è criptica e il chevron non dice cosa apre — scrivere «Sonno 23:30–07:30 (8 h) · 3 pasti» e mettere un’etichetta «Modifica» o rendere esplicito il pannello
- [media] giornata-giorno__tab-light.png — linea dell’ora attuale «10:30» — attraversa il testo del blocco «Organizzare cena con il gruppo» e il badge «10:30» sporge oltre il bordo destro della griglia — far passare la linea sotto i blocchi (z-index) o renderla semitrasparente sopra di essi, e contenere il badge dentro la colonna
- [media] giornata-giorno__tab-light.png — titolo «Oggi» — la data non compare: navigando con ‹ › si perde il riferimento — mostrare «Oggi · mar 18 ago» e, negli altri giorni, la data completa
- [bassa] giornata-giorno__tab-light.png — frecce ‹ › — qui sono cerchi bianchi senza bordo, nella vista Anno sono quadrati arrotondati con bordo: stesso controllo, due stili — uniformare
- [bassa] giornata-giorno__tab-light.png — fascia tratteggiata 07:00–07:30 — senza etichetta (fine del sonno) — aggiungere «Sveglia 07:30» o «Sonno»
- [bassa] giornata-giorno__tab-light.png — blocco completato «Organizzare cena…» — barrato grigio su fondo grigio, contrasto molto basso, e la stellina ☆ non è spiegata — mantenere il testo leggibile (grigio più scuro) e aggiungere una spunta di completamento

## giornata-mese__tab-light.png
- [media] giornata-mese__tab-light.png — calendario del mese: anelli verdi attorno ai numeri e puntini colorati sotto — nessuna legenda: non si capisce che l’anello è la percentuale di completamento e che i puntini sono aree — aggiungere una legenda compatta sotto la griglia («anello = quanto hai completato · puntini = aree»)
- [media] giornata-mese__tab-light.png — elenco «Oggi» sotto il calendario — l’ordine non è cronologico (22:00, senza ora, 18:00, 09:30, 15:00) — ordinare per orario, con quelle senza orario in fondo
- [media] giornata-mese__tab-light.png — quadratini colorati a sinistra delle righe di «Oggi» — sembrano caselle di spunta ma sono indicatori di area (alcuni pieni, altri vuoti); componente diverso da tutte le altre liste — usare il cerchio di completamento standard e l’icona area come nelle altre schermate
- [bassa] giornata-mese__tab-light.png — azione «Sposta» presente solo sull’ultima riga — incoerente; non si capisce perché solo lì — mostrarla su tutte le attività non completate o in un menu
- [bassa] giornata-mese__tab-light.png — riga «18 giorni attivi · 58 attività fatte» — qui è testo libero, nella vista Anno gli stessi dati sono in una card a tre colonne — usare lo stesso componente di statistiche
- [bassa] giornata-mese__tab-light.png — giorno selezionato 18 — doppia evidenziazione (cerchio viola pieno + riquadro grigio) mentre l’anello di avanzamento verde si sovrappone al cerchio viola — scegliere un solo stile di selezione

## giornata-scheda-abitudine__tab-light.png
- [media] giornata-scheda-abitudine__tab-light.png — foglio inferiore su tablet — ancorato al bordo basso senza margine, contenuto finisce a filo dello schermo; il «+» viola della barra resta vivo e visibile a destra del foglio (sembra cliccabile) — su tablet usare un popover/finestra centrata vicino al blocco toccato, oppure scurire anche la barra e il «+»
- [media] giornata-scheda-abitudine__tab-light.png — valori «18:00» (testo nero) e «45 min» (testo viola) — due pillole dello stesso tipo con colori di testo diversi — uniformare
- [media] giornata-scheda-abitudine__tab-light.png — azioni «Salta oggi / Termina l’abitudine / Apri l’abitudine» — l’azione distruttiva (rossa) sta in mezzo tra due azioni neutre — spostare «Termina l’abitudine» in fondo, separata, con conferma
- [bassa] giornata-scheda-abitudine__tab-light.png — sottotitolo «↻ Abitudine · Oggi» — grigio piccolo, poco contrasto — scurire leggermente
- [bassa] giornata-scheda-abitudine__tab-light.png — velo scuro dietro il foglio — molto leggero: il calendario sotto resta molto leggibile e compete con il foglio — aumentare l’opacità del velo

## giornata-scheda-blocco__tab-light.png
- [media] giornata-scheda-blocco__tab-light.png — foglio di un’attività già completata — lo stato «fatta» non è mai detto esplicitamente: c’è solo un link grigio centrato «Segna come non fatta», poco visibile e diverso dal grande pulsante verde «Fatto» della scheda abitudine — mostrare un’intestazione di stato («✓ Fatta alle 10:00») e il pulsante di annullo come pulsante secondario con lo stesso ingombro del «Fatto»
- [media] giornata-scheda-blocco__tab-light.png — foglio ancorato in basso su tablet, senza margine inferiore; «+» della barra visibile e vivo — come per la scheda abitudine
- [bassa] giornata-scheda-blocco__tab-light.png — durata «1 h 30» — formato inconsueto e diverso da «45 min» — usare «1 h 30 min» o «1:30 h»
- [bassa] giornata-scheda-blocco__tab-light.png — sottotitolo «Attività · Oggi» senza icona, mentre la scheda abitudine ha «↻ Abitudine · Oggi» — aggiungere l’icona di tipo anche qui; inoltre testo «Oggi» poco utile se manca l’orario di completamento
- [bassa] giornata-scheda-blocco__tab-light.png — valori «09:30» nero e «1 h 30» viola nelle pillole — colori di testo incoerenti (vedi scheda abitudine)

## giornata-settimana__tab-light.png
- [media] giornata-settimana__tab-light.png — riquadro della striscia settimanale («4 di 24 fatte…» + L–D) — ha un fondo leggermente diverso che sborda dalla colonna (da x≈60 a x≈770, mentre card e titoli stanno tra 77 e 757) e non ha angoli/ombra come le altre card — allinearlo alla colonna e usare lo stesso stile di card (o nessun fondo)
- [media] giornata-settimana__tab-light.png — vista Settimana su tablet — è un elenco verticale giorno per giorno identico al telefono: per vedere mercoledì-domenica bisogna scorrere molto — su tablet mostrare una griglia a colonne (almeno 3–4 giorni affiancati) o un’agenda a due colonne
- [media] giornata-settimana__tab-light.png — righe del giorno — nessun controllo di completamento; le cose non fatte nei giorni passati (es. «Leggere 20 minuti» di lunedì) non sono distinte da quelle future — aggiungere il cerchio di completamento e uno stato «non fatta» (grigio/rosso tenue) per i giorni passati
- [bassa] giornata-settimana__tab-light.png — indicatori a sinistra del titolo: icona ↻ per abitudini, pallino colorato per attività — senza legenda e con allineamento diverso (le righe senza orario sono rientrate ma il pallino è più a sinistra dell’icona ↻) — allineare icone e pallini sulla stessa colonna
- [bassa] giornata-settimana__tab-light.png — angolo in basso a sinistra sopra la barra — macchia/ombra grigia sfocata visibile (x≈80–330, y≈1040–1100) — verificare l’ombra della barra o di una card che scorre sotto

## giornata-sonno-aperto__tab-light.png
- [alta] giornata-sonno-aperto__tab-light.png — pannello sonno e pasti, menu durata «15 min», «45 min» — <select> nativi non stilizzati (freccia di sistema nera), affiancati a campi orario nativi — sostituirli con pillole/stepper coerenti con le pillole «Ora/Durata» delle schede
- [media] giornata-sonno-aperto__tab-light.png — layout del pannello — «A letto» e «Sveglia» hanno l’etichetta dentro la riga e campi larghi metà schermo, mentre i pasti hanno l’etichetta a sinistra e campi stretti spinti all’estrema destra con ~350 px vuoti in mezzo: due griglie diverse nello stesso pannello — usare un’unica griglia a due colonne (etichetta | ora | durata | azione) per sonno e pasti
- [media] giornata-sonno-aperto__tab-light.png — azioni «+ Pasto · Annulla le modifiche · Orari abituali» — tre link identici per azioni di natura diversa; «Annulla le modifiche» è visibile anche senza modifiche, «Orari abituali» è ambiguo (ripristina? imposta come abituali?) — mostrare «Annulla» solo dopo una modifica, rinominare in «Ripristina orari abituali» e distinguere «+ Aggiungi pasto» come azione primaria
- [bassa] giornata-sonno-aperto__tab-light.png — nessun pulsante di conferma — non è chiaro se le modifiche si salvano da sole — aggiungere un feedback «Salvato» o un pulsante «Fatto»
- [bassa] giornata-sonno-aperto__tab-light.png — cestini grigi accanto ai menu — piccoli e attaccati al menu (≈4 px) — aumentare area di tocco e distanza

## imp-aspetto__tab-light.png
- [media] imp-aspetto__tab-light.png — sezione «Aspetto» con «Suoni» e «Vibrazione» — suoni e vibrazione non sono «aspetto»: raggruppamento errato — spostarli in una sezione «Suoni e vibrazione» o rinominare la sezione «Aspetto e feedback»
- [bassa] imp-aspetto__tab-light.png — interruttore «Vibrazione» su tablet — la maggior parte dei tablet non vibra (e i browser iPad non supportano la vibrazione): controllo senza effetto — nasconderlo quando il dispositivo non lo supporta
- [bassa] imp-aspetto__tab-light.png — foglio con navigazione interna «‹ Impostazioni» — link piccolo (≈12 px) sopra il titolo, area di tocco ridotta; il foglio è basso e lascia ~700 px di velo vuoto sopra — su tablet usare una finestra centrata o un pannello laterale a piena altezza; ingrandire il link indietro
- [bassa] imp-aspetto__tab-light.png — controllo «Auto / Chiaro / Scuro» — ombra della scheda attiva che esce sotto il contenitore (come in Diario) — contenere l’ombra
- [bassa] imp-aspetto__tab-light.png — foglio a filo del bordo inferiore — nessuno spazio dopo l’ultima riga «Animazioni» — aggiungere padding inferiore (safe area)

## imp-musica__tab-light.png
- [alta] imp-musica__tab-light.png — campi «Incolla il link» — i campi hanno praticamente lo stesso fondo del gruppo e nessun bordo: sembrano testo grigio, non campi di inserimento (affordance quasi nulla) — dare ai campi fondo bianco e bordo 1 px, o un’icona link e un’altezza chiara
- [media] imp-musica__tab-light.png — titolo «Predefinita» e campi «Incolla il link» — non dice link di cosa (playlist Spotify/YouTube?) né quando si usa; la spiegazione è solo in fondo, in piccolo — aggiungere in alto una frase «Incolla il link di una playlist Spotify o YouTube: partirà con il timer» e come segnaposto «https://open.spotify.com/…»
- [media] imp-musica__tab-light.png — interruttore «Apri all’avvio del timer» spento — pallino bianco su traccia grigio chiarissimo su fondo grigio: lo stato spento è quasi invisibile — scurire la traccia dello stato spento (contrasto ≥ 3:1)
- [bassa] imp-musica__tab-light.png — sezione «Per area» — le aree sono senza icona/colore, a differenza del resto dell’app; otto campi identici rendono la pagina lunga e monotona — mostrare icona e colore dell’area e, su tablet, disporre i campi su due colonne
- [bassa] imp-musica__tab-light.png — nota in fondo «Senza pubblicità e a schermo spento serve l’abbonamento di Spotify o di YouTube» — frase un po’ contratta — «Per ascoltare senza pubblicità e con lo schermo spento serve un abbonamento Spotify Premium o YouTube Premium»

## imp-timer__tab-light.png
- [media] imp-timer__tab-light.png — riga «Se prosegui, altri» — italiano poco naturale e incompleto (altri cosa?) — «Se continui, aggiungi» o «Estensione: altri 25 min»
- [media] imp-timer__tab-light.png — sezioni «Avvio rapido», «Sessione», «Pomodoro» — la differenza fra i tre tipi di timer non è spiegata; due righe si chiamano entrambe «Durata» — aggiungere una riga di descrizione sotto ogni titolo di sezione (es. «Avvio rapido: 5 minuti per rompere il ghiaccio»)
- [bassa] imp-timer__tab-light.png — «Pausa lunga dopo 4 blocchi: Nessuna» — formulazione contraddittoria (dopo 4 blocchi… nessuna) — «Pausa lunga (ogni 4 blocchi)» con valore «Nessuna» oppure «Off»
- [bassa] imp-timer__tab-light.png — pillola «Nessuna» viola qui, grigia nella creazione di un’abitudine — stesso valore «vuoto», stili diversi — uniformare lo stile dei valori non impostati
- [bassa] imp-timer__tab-light.png — foglio a filo del bordo inferiore, nessun indizio che ci sia altro contenuto sotto — aggiungere padding/sfumatura di scorrimento

## impostazioni-fondo__tab-light.png
- [media] impostazioni-fondo__tab-light.png — intestazione fissa «Impostazioni» — la riga divisoria taglia a filo il titolo di sezione «Account» (≈6 px di spazio): sembra un errore di scorrimento — aggiungere padding sotto il divisore o far scorrere i titoli sotto un’intestazione con sfumatura
- [bassa] impostazioni-fondo__tab-light.png — «Backup e ripristino 1» — numero senza etichetta (1 backup? 1 da ripristinare?) — «1 backup» o data dell’ultimo backup
- [bassa] impostazioni-fondo__tab-light.png — chevron incoerenti: «Area predefinita» ha una freccia ⌄ (menu), le altre › , «Esporta dati», «Importa dati», «Sincronizzazione» e le voci di «Reimposta» nessuna — usare la stessa regola: › per sottopagine, nessuna icona per azioni immediate ma con colore d’azione, ⌄ solo per menu
- [bassa] impostazioni-fondo__tab-light.png — valori in minuscolo («chiedi sempre», «nessuna», «automatico») mentre nelle sottopagine le stesse opzioni sono con maiuscola («Chiedi sempre») — uniformare le maiuscole
- [bassa] impostazioni-fondo__tab-light.png — sezione «Account» con la sola «Sincronizzazione: su questo dispositivo» — non c’è nessun account; titolo fuorviante — rinominare la sezione «Dati e sincronizzazione» o spiegare «I dati restano solo su questo dispositivo»
- [bassa] impostazioni-fondo__tab-light.png — «Su cosa si basa» — titolo vago — «Il metodo dietro l’app» / «Principi e fonti»

## impostazioni__tab-light.png
- [media] impostazioni__tab-light.png — secondo gruppo (Area predefinita, Timer, Musica, Aspetto) — non ha titolo di sezione e appare sotto «Account» come se ne facesse parte — aggiungere il titolo «Preferenze»
- [bassa] impostazioni__tab-light.png — «Aspetto: automatico» qui, «Auto» nella sottopagina — stesso valore con due nomi — usare lo stesso termine
- [bassa] impostazioni__tab-light.png — foglio senza pulsante «Chiudi/Fine» e senza margine inferiore su tablet; sotto il velo resta visibile il «+» — come per gli altri fogli: finestra centrata o padding inferiore e pulsante «Fine»
- [bassa] impostazioni__tab-light.png — chevron e numeri senza etichetta («1» su Backup) — vedi impostazioni-fondo

## menu-oggi-avatar__tab-light.png
- [media] menu-oggi-avatar__tab-light.png — pagina aperta dal tocco sull’avatar — non c’è titolo «Profilo», né pulsante indietro/chiudi, e nella barra in basso nessuna voce è attiva: l’utente perde il contesto e non sa come tornare — aggiungere «‹ Oggi» o una × e il titolo «Profilo» (come in Diario, che ha «‹ Profilo»)
- [media] menu-oggi-avatar__tab-light.png — «Promemoria: bloccati» — stato critico scritto in grigio come un valore qualsiasi, e «bloccati» non dice da chi (browser? sistema?) — mostrarlo in arancione/rosso con icona di avviso: «Notifiche bloccate dal browser»
- [bassa] menu-oggi-avatar__tab-light.png — avatar «R» — qui è un quadrato arrotondato viola pieno, nell’intestazione è un cerchio lilla con lettera viola: stesso elemento, due forme e due colori — uniformare
- [bassa] menu-oggi-avatar__tab-light.png — metà inferiore vuota (~480 px) — su tablet si potrebbe affiancare l’elenco a un’anteprima (es. Andamento sintetico o Diario recente) o ridurre l’altezza del layout
- [bassa] menu-oggi-avatar__tab-light.png — riga statistiche — qui i numeri hanno etichette chiare («giorni di fila», «fatte negli ultimi 30 giorni») mentre in Andamento gli stessi 38 e 65% non le hanno — riutilizzare queste etichette in Andamento

## profilo__tab-light.png
- [media] profilo__tab-light.png — identico a menu-oggi-avatar: nessun titolo «Profilo», nessun pulsante indietro, nessuna voce attiva nella barra — aggiungere titolo e ritorno
- [media] profilo__tab-light.png — «Promemoria: bloccati» in grigio neutro — evidenziare come avviso con spiegazione
- [bassa] profilo__tab-light.png — card nome con frase-obiettivo — la frase va a capo dopo «chiunque,» lasciando ~170 px vuoti a destra nella card (larghezza massima del testo troppo stretta) — allargare il max-width del testo alla card
- [bassa] profilo__tab-light.png — gruppo «Diario / Impostazioni» separato dal primo gruppo senza titolo, spazio tra le due card (≈10 px) minore di quello tra statistiche e prima card (≈24 px) — uniformare gli spazi verticali tra card
- [bassa] profilo__tab-light.png — metà inferiore vuota su tablet — vedi menu-oggi-avatar

## promemoria__tab-light.png
- [media] promemoria__tab-light.png — interruttori disattivati delle notifiche — pallino a destra (posizione «acceso») ma traccia grigia: non si capisce se sono accesi-ma-bloccati o spenti — mostrare chiaramente lo stato salvato (es. acceso in viola al 40% di opacità) e una nota «si attiveranno quando sblocchi le notifiche»
- [media] promemoria__tab-light.png — riga «Server · da collegare» — termine tecnico non spiegato, senza chevron né azione: l’utente non sa cosa sia né cosa fare — spiegare «Promemoria anche ad app chiusa: richiede un server (non configurato)» o nasconderla se non attivabile dall’utente
- [media] promemoria__tab-light.png — nomi dei promemoria («Priorità del giorno», «Fine giornata») — non coincidono con i nomi dei rituali («Review della sera», «Piano del giorno»…) — usare gli stessi nomi dei rituali
- [bassa] promemoria__tab-light.png — riga «Dalle 23:00 alle 07:00» — l’etichetta «Dalle» è rientrata (x≈148) rispetto a «Attivo» e alle altre etichette (x≈132) — allineare
- [bassa] promemoria__tab-light.png — banner «Notifiche bloccate» — «alla voce di questo indirizzo» è contorto — «Riattivale dalle impostazioni del browser per questo sito» e aggiungere un link/guida
- [bassa] promemoria__tab-light.png — foglio a filo del fondo, «+» visibile accanto — come per gli altri fogli

## rituale-checkin__tab-light.png
- [media] rituale-checkin__tab-light.png — pulsante «Registra +3 XP» con check-in già «fatto» — non è chiaro se registrare di nuovo sovrascrive, aggiunge un secondo check-in o riassegna punti — se già fatto mostrare «Aggiorna check-in» (senza +XP) o lo stato «Registrato alle 09:00»
- [media] rituale-checkin__tab-light.png — grafico «Andamento degli ultimi 14 giorni» — legenda doppia (in alto e a fine linea), le etichette finali «Focus/Umore/Energia» sono ammassate a destra e tagliano lo spazio del grafico; c’è un buco tra il 14 e il 15 ago senza spiegazione — tenere una sola legenda, segnalare i giorni senza dati (es. punti grigi o testo «nessun check-in»)
- [media] rituale-checkin__tab-light.png — stati nelle intestazioni dei rituali: «da fare 2 di 3», «da compilare 0 di 4», «✓ fatto» — tre formulazioni diverse e numeri senza unità — uniformare («2 di 3 passi», «0 di 4 campi», «Fatto»)
- [bassa] rituale-checkin__tab-light.png — terminologia mista inglese/italiano («Check-in», «Focus», «XP», altrove «Review») — scegliere una lingua: «Come stai», «Concentrazione», «punti», «Revisione»
- [bassa] rituale-checkin__tab-light.png — etichette di scala sotto i pulsanti («3 · normale») — centrate sotto il terzo pulsante solo approssimativamente (in «Quanto riesci a concentrarti?» «3 · normale» è spostato a sinistra rispetto al pulsante 3) — ancorare le etichette al centro dei rispettivi pulsanti

## rituale-piano__tab-light.png
- [media] rituale-piano__tab-light.png — elenco priorità — la prima riga ha il chip «☆ Priorità», la seconda no, pur essendo entrambe priorità del piano; le aree sono solo icone isolate all’estrema destra senza nome — togliere il chip ridondante (siamo già nell’elenco priorità) o applicarlo a tutte; mostrare l’area con icona + nome vicino al titolo
- [media] rituale-piano__tab-light.png — intestazione «da fare · 2 di 3» — numero senza unità (2 priorità su 3?) e «da fare» contraddice il fatto che 2 su 3 sono già impostate — «2 priorità su 3» / «In corso»
- [bassa] rituale-piano__tab-light.png — righe priorità — non c’è modo visibile di riordinare, togliere o completare la priorità (nessun cerchio, nessuna ×) — aggiungere il cerchio di completamento e una × o un menu
- [bassa] rituale-piano__tab-light.png — campo «Quando inizi?» — segnaposto «Es. alle 9:00, alla scrivania» buono, ma è un testo libero accanto a un’app che altrove usa selettori di ora: ambiguo se l’ora verrà usata dal calendario — chiarire che è un’intenzione libera o offrire un selettore d’ora + luogo
- [bassa] rituale-piano__tab-light.png — area sotto la card — ~300 px vuoti; su tablet i rituali chiusi potrebbero stare in una colonna laterale e quello aperto a destra

## rituale-sera__tab-light.png
- [media] rituale-sera__tab-light.png — «Com’è andata, area per area?» — il nome dell’area sta su una riga e i pulsanti 1–5 sulla riga sotto, allineati a destra: ~84 px per area e metà riga vuota; su tablet c’è tutto lo spazio per metterli sulla stessa riga — mettere nome a sinistra e pulsanti a destra sulla stessa riga (dimezza l’altezza)
- [media] rituale-sera__tab-light.png — pulsanti di valutazione 1–5 — qui piccoli quadrati grigi pieni, nel Check-in grandi pulsanti bianchi con bordo e selezione viola: stessa funzione, due componenti diversi — usare un unico componente di scala
- [bassa] rituale-sera__tab-light.png — legenda «1 = male · 5 = benissimo» in grigio piccolo a fianco della domanda — facile da perdere; nel Check-in le etichette stanno sotto la scala — uniformare la posizione delle etichette di scala
- [bassa] rituale-sera__tab-light.png — ordine delle aree — qui Relazioni, Finanze, Studio…; in «Le tue aree» Studio, Salute, Relazioni…; in Andamento per percentuale — usare l’ordine definito dall’utente ovunque
- [bassa] rituale-sera__tab-light.png — sotto la barra in basso si legge il testo del campo successivo («Es. ho studiato 90 minuti…») che scorre dietro — aggiungere fondo opaco/sfumato sotto la barra

## rituale-settimana__tab-light.png
- [media] rituale-settimana__tab-light.png — quattro aree di testo — mostrano la maniglia nativa di ridimensionamento in basso a destra (controllo nativo non stilizzato) e sono vuote senza segnaposto, a differenza degli altri campi dell’app che hanno esempi — nascondere la maniglia (resize: none + altezza automatica) e aggiungere segnaposto di esempio
- [media] rituale-settimana__tab-light.png — riepilogo «10 attività fatte · 6/7 giorni attivi» vs vista Settimana «4 di 24 fatte questa settimana» — dati della stessa settimana che non coincidono (periodi diversi? conteggi diversi?) — chiarire il periodo («ultimi 7 giorni» vs «da lunedì») o uniformare il calcolo
- [bassa] rituale-settimana__tab-light.png — numeri del riepilogo centrati mentre tutto il resto del pannello è allineato a sinistra; «6/7» usa la barra mentre altrove si scrive «4 di 24» — allineare a sinistra o in una card a tre colonne come nel Profilo; uniformare il formato «6 di 7»
- [bassa] rituale-settimana__tab-light.png — etichette delle domande senza punto interrogativo («Cosa ti ha bloccato») — aggiungere «?» per coerenza con le altre domande dell’app («Come ti senti?»)
- [bassa] rituale-settimana__tab-light.png — link «Apri le Scoperte» — grigio con icona provetta, poco riconoscibile come link e sfasato a sinistra (x≈110) rispetto al pulsante — usare il colore dei link (viola) e allinearlo al bordo del pulsante

## rituale-sonno-pasti__tab-light.png
- [media] rituale-sonno-pasti__tab-light.png — due pulsanti di conferma nello stesso pannello: «Salva» (tenue, solo per il sonno) e «Fatto» (pieno, in fondo) — non si capisce se «Fatto» salva anche il sonno o se bisogna premere entrambi — un unico «Fatto» in fondo che salva tutto, oppure salvataggio automatico del sonno con feedback
- [media] rituale-sonno-pasti__tab-light.png — «A letto 23:30 ⏰» / «Sveglia 07:30 ⏰» — campi orario nativi del browser (icona orologio di sistema), non stilizzati come le pillole orario del resto dell’app — usare la stessa pillola orario delle schede
- [media] rituale-sonno-pasti__tab-light.png — link viola «Come sempre · 23:30–07:30» — non è chiaro se è un pulsante che applica gli orari abituali o un’informazione — renderlo un pulsante esplicito «Usa orari abituali (23:30–07:30)»
- [bassa] rituale-sonno-pasti__tab-light.png — pulsanti dei pasti «sì / no / 🕐» — minuscole, grigi tutti uguali, e il terzo (solo icona orologio) non spiega che serve a indicare un orario diverso — «Sì» «No» «Altro orario» e stato selezionato evidente
- [bassa] rituale-sonno-pasti__tab-light.png — pulsante «Fatto» senza «+XP» mentre «Salva» degli altri rituali mostra i punti; e qui si chiama «Fatto» invece di «Salva» — uniformare etichetta e premio
- [bassa] rituale-sonno-pasti__tab-light.png — stato «da compilare 0 di 4» — 4 cosa? (sonno + 3 pasti) — «0 di 4 voci»

## rituali__tab-light.png
- [media] rituali__tab-light.png — elenco rituali — oltre 600 px vuoti sotto la card; nessuna indicazione di quando va fatto ciascun rituale (mattina, 13:00, sera, domenica) — mostrare l’orario/momento previsto sotto il nome e, su tablet, aprire il rituale selezionato in un pannello a destra
- [media] rituali__tab-light.png — icona di «Piano del giorno» piena viola, le altre tenui — evidenziazione non spiegata (è quello «di adesso»?) — aggiungere un’etichetta «Ora» o non differenziare
- [media] rituali__tab-light.png — badge «1» sulla scheda Rituali (visibile nelle altre schermate) — ci sono 4 rituali «da fare/da compilare», il badge dice 1: significato non chiaro — far corrispondere il numero ai rituali in scadenza adesso e spiegarlo, o usare un pallino
- [bassa] rituali__tab-light.png — stati a destra su due righe («da fare / 2 di 3») in corpo piccolo e grigio, con «fatto» verde — gerarchia debole e formulazioni diverse — vedi rituale-checkin

## scheda-abitudine-fondo__tab-light.png
- [media] scheda-abitudine-fondo__tab-light.png — riga dei giorni in «Quando» — i cerchi L…D non sono distribuiti sulla larghezza: «L» quasi a filo del bordo sinistro del gruppo (≈12 px) e ~50 px liberi a destra dopo «D»; non sono allineati alle colonne del calendario sopra — distribuirli sulle stesse 7 colonne del calendario
- [media] scheda-abitudine-fondo__tab-light.png — calendario dello storico — manca il nome del mese e non si può cambiare mese; i giorni non previsti (sabato/domenica) sono numeri grigi senza cerchio, i giorni previsti non fatti hanno un cerchio grigio: differenza sottile e senza legenda — aggiungere «Agosto 2026» con frecce e una legenda (fatto / non fatto / non previsto)
- [bassa] scheda-abitudine-fondo__tab-light.png — riga «Ora 18:00 ×» — la × sta fuori dalla pillola, nella scheda del calendario sta dentro; «Durata» qui non ha la × — uniformare il componente pillola con azzeramento
- [bassa] scheda-abitudine-fondo__tab-light.png — pulsante «Elimina» — centrato in una card a sé, senza icona; nella scheda del blocco «Elimina» è allineato a sinistra con il cestino — uniformare
- [bassa] scheda-abitudine-fondo__tab-light.png — «Fine: Mai» in grigio — sembra disattivato; non è evidente che si possa toccare per impostare una data — aggiungere chevron o stile pillola come gli altri valori

## scheda-abitudine__tab-light.png
- [bassa] scheda-abitudine__tab-light.png — area ripetuta due volte (chip verde «Salute & Sport» sotto il titolo e riga «Area» in Dettagli, con colori diversi: verde vs viola) — tenere il chip in alto con il colore dell’area e rendere la riga Area coerente nel colore
- [bassa] scheda-abitudine__tab-light.png — sottotitolo «lun–ven · 18:00» — ripete le informazioni di «Quando» poco sotto — accettabile come riassunto, ma allora rendere il blocco «Quando» richiudibile
- [media] scheda-abitudine__tab-light.png — stessi difetti della versione scorsa in fondo: calendario senza mese/legenda, riga dei giorni non allineata alle colonne, × della pillola «Ora» fuori pillola — vedi scheda-abitudine-fondo
- [bassa] scheda-abitudine__tab-light.png — numeri «3 di fila · 4 record · 7 in tutto» — «record» da solo è ambiguo — «4 record di fila» / «miglior serie: 4»

## scheda-attivita-fondo__tab-light.png
- [media] scheda-attivita-fondo__tab-light.png — pillola «Giovedi» in «Pianifica» — manca l’accento: «Giovedì» — correggere
- [media] scheda-attivita-fondo__tab-light.png — riga «Area: Studio / Università ⌄» — testo grigio con freccia (sembra un select), mentre nella scheda abitudine e nel calendario l’area è una pillola viola — usare lo stesso componente pillola
- [media] scheda-attivita-fondo__tab-light.png — voce «Non ce l’ho fatta ›» — non si capisce cosa succede (archivia? registra un fallimento? rimanda?) — rinominare con l’effetto («Archivia come non fatta») e aggiungere una riga descrittiva
- [media] scheda-attivita-fondo__tab-light.png — interruttore «Fissa in alto» spento — traccia quasi bianca su fondo grigio chiaro, quasi invisibile — scurire la traccia dello stato spento
- [bassa] scheda-attivita-fondo__tab-light.png — due stili di pillole vicine: «Pianifica» (grigie su bianco, Maiuscola) e «Distribuisci i passi» (bianche su grigio, minuscola) — uniformare stile e maiuscole
- [bassa] scheda-attivita-fondo__tab-light.png — «Scadenza: nessuna» in minuscolo, «Fine: Mai» con maiuscola nella scheda abitudine — uniformare
- [bassa] scheda-attivita-fondo__tab-light.png — icone calendario e cestino su ogni passo — piccole (≈14 px) e molto vicine tra loro, area di tocco ridotta su tablet touch — portare l’area di tocco a 44 px

## scheda-attivita__tab-light.png
- [media] scheda-attivita__tab-light.png — stessi difetti di scheda-attivita-fondo («Giovedi» senza accento, area come testo+⌄ invece di pillola, «Non ce l’ho fatta» ambiguo, interruttore spento poco visibile) — vedi sopra
- [bassa] scheda-attivita__tab-light.png — lo screenshot è identico a «scheda-attivita-fondo»: il foglio entra tutto nello schermo, quindi la versione «in fondo» non aggiunge nulla (oppure lo scorrimento non è avvenuto) — verificare la cattura; nessun difetto di interfaccia in sé
- [bassa] scheda-attivita__tab-light.png — badge «1 di 3» accanto a «Passi» — qui ha senso perché è vicino a «Passi»; riusare questa stessa forma («1 di 3 passi») nell’elenco Da fare dove il numero compare senza contesto

## scheda-scoperta__tab-light.png
- [media] scheda-scoperta__tab-light.png — area di testo «Cosa hai capito» — maniglia nativa di ridimensionamento visibile in basso a destra — nascondere (resize: none, altezza automatica)
- [media] scheda-scoperta__tab-light.png — opzioni «notato una volta / lo noto ogni volta / misurato» — forme verbali incoerenti (participio, presente in prima persona, participio) e tutto minuscolo; non si legge come una scala di certezza — «Visto una volta · Lo vedo sempre · Misurato» oppure «Bassa · Media · Alta» con descrizione
- [bassa] scheda-scoperta__tab-light.png — titolo «Una cosa che hai capito» e subito sotto l’etichetta «Cosa hai capito» — ripetizione — usare come titolo il testo della scoperta o «Scoperta»
- [bassa] scheda-scoperta__tab-light.png — «Quanto ne sei sicuro» senza «?» e al maschile — «Quanto ne sei sicuro/a?» o «Quanto è certa?»
- [bassa] scheda-scoperta__tab-light.png — riga «Esito»: pulsanti su una seconda riga sotto l’etichetta, mentre «Area» e «Aggiunta» hanno il valore sulla stessa riga; «Area» è testo+⌄ (vedi scheda attività) — uniformare il layout delle righe di dettaglio

## scoperte-esperimenti__tab-light.png
- [media] scoperte-esperimenti__tab-light.png — grafico prima/dopo — le etichette «media 3,1» e «media 4,3» si sovrappongono ai punti dei dati; l’ultimo punto a destra è tagliato dal bordo; manca l’asse orizzontale con le date — spostare le etichette delle medie fuori dall’area dei punti (a destra o sopra, con fondo bianco), aggiungere margine destro e date di inizio/cambio/fine sotto l’asse
- [media] scoperte-esperimenti__tab-light.png — chip «concluso», «attivo», «Focus (da check-in, 1–5)», «Minuti dedicati a un’area · Studio / Università» — hanno bordo e fondo bianco come i pulsanti «Nuovo esperimento»/«Salvala in «Funziona»», quindi sembrano toccabili — differenziare: badge di stato senza bordo e con colore, metrica come testo secondario
- [bassa] scoperte-esperimenti__tab-light.png — paragrafi descrittivi limitati a ~400 px di larghezza in card da ~680 px — metà destra vuota; accettabile per la leggibilità ma il grafico sotto è a tutta larghezza: allineare la larghezza del testo a quella del riquadro esito
- [bassa] scoperte-esperimenti__tab-light.png — testo introduttivo in alto — lungo e sempre visibile anche quando ci sono esperimenti — renderlo richiudibile o spostarlo in un «Come funziona?»
- [bassa] scoperte-esperimenti__tab-light.png — «L’entità del cambiamento è grande» — formula tecnica — «Il cambiamento è grande»

## scoperte__tab-light.png
- [media] scoperte__tab-light.png — icone 👍/👎 a sinistra delle righe — sono dentro riquadri con bordo e ombra, come pulsanti: sembra che toccandole si cambi l’esito — renderle icone piatte senza bordo (solo fondo tenue) oppure renderle davvero un interruttore con feedback
- [bassa] scoperte__tab-light.png — layout su tablet — «Funziona» e «Non funziona» in colonna unica con ~230 px vuoti in basso — affiancare le due liste in due colonne sul tablet
- [bassa] scoperte__tab-light.png — icona 👍 usata per la scheda «Scoperte», per la sotto-scheda «Registro» e per la sezione «Funziona» — stessa icona per tre concetti diversi — dare a «Scoperte» un’icona propria (lampadina) e a «Registro» un’icona elenco
- [bassa] scoperte__tab-light.png — metadati «lo noto ogni volta», «notato una volta» in minuscolo e senza area per alcune righe — vedi scheda-scoperta (forme verbali incoerenti)

## sonno-pasti__tab-light.png
- [media] sonno-pasti__tab-light.png — sezione «Promemoria nell’app»: «Sonno · Dalle 05:00 alle 14:00» e «Pasti · Alle 19:00» — non si capisce cosa ricordino (di registrare il sonno? in quale finestra?) né perché il sonno vada dalle 5 alle 14 — aggiungere una frase di spiegazione: «Ti chiediamo come hai dormito tra le 05:00 e le 14:00» / «Alle 19:00 ti chiediamo dei pasti»
- [media] sonno-pasti__tab-light.png — stessi dati del pannello sonno/pasti della Giornata, ma con componenti diversi: qui pillole stilizzate e × per rimuovere un pasto, là <select> nativi e cestino — uniformare usando questo componente ovunque
- [bassa] sonno-pasti__tab-light.png — orari in nero e durate in viola nelle pillole — colore di testo incoerente tra pillole uguali — uniformare
- [bassa] sonno-pasti__tab-light.png — «Durata 8h» — formato diverso da «1 h 30» e «45 min» altrove — usare «8 h» con spazio come convenzione unica
- [bassa] sonno-pasti__tab-light.png — sotto-righe «Dalle» / «Alle» rientrate rispetto alle etichette principali — rientro non usato altrove (Non disturbare lo ha simile ma diverso) — uniformare il rientro delle sotto-righe

## timer-concentrazione__tab-light.png
- [media] timer-concentrazione__tab-light.png — su tablet il timer (≈260 px) e i pulsanti occupano una fascia centrale piccola; sopra e sotto ~250 px di nero vuoto — scalare il timer in proporzione allo schermo (es. 40–50% della larghezza) e le cifre di conseguenza
- [media] timer-concentrazione__tab-light.png — «Termina sessione», «Cambia timer» e la × in alto — tre modi di uscire/modificare con differenze non chiare (la × interrompe? nasconde?); i due link sono grigio scuro su nero con contrasto basso — chiarire l’effetto della × (es. «Riduci») e alzare il contrasto dei link a ≥ 4.5:1
- [bassa] timer-concentrazione__tab-light.png — anello di avanzamento — grigio scurissimo su nero, quasi invisibile; non si vedrà bene il progresso — usare un colore d’accento per la parte trascorsa e un grigio più chiaro per la traccia
- [bassa] timer-concentrazione__tab-light.png — «Pomodoro · blocco 1» — manca il totale — «blocco 1 di 4»; «restano» sotto le cifre → «rimanenti»

## timer-scelta__tab-light.png
- [media] timer-scelta__tab-light.png — foglio «Timer» — le quattro opzioni hanno solo nome e durata: «Avvio rapido» vs «Sessione» non si distinguono, e non si sa quale sia quella predefinita — aggiungere una riga di descrizione per ciascuna («5 minuti per iniziare, poi decidi se continuare») e segnare la predefinita
- [bassa] timer-scelta__tab-light.png — icona di «Pomodoro» (↻) — è la stessa icona usata per «Abitudine» in tutta l’app — usare un’icona diversa (es. cicli/pomodoro)
- [bassa] timer-scelta__tab-light.png — riquadri delle icone con bordo e fondo bianco — sembrano pulsanti separati dentro la riga — rendere l’icona piatta, la riga intera è il pulsante
- [bassa] timer-scelta__tab-light.png — foglio piccolo (≈330 px) in fondo a uno schermo da 1112 px, a filo del bordo, con il «+» visibile accanto — su tablet usare un popover ancorato al pulsante «Timer» che l’ha aperto

## trascinamento-in-corso__tab-light.png
- [media] trascinamento-in-corso__tab-light.png — anteprima di rilascio 12:45–14:15 — si sovrappone completamente al blocco «Pranzo» senza alcun avviso di conflitto; l’etichetta «12:45–14:15» si sovrappone alla parte alta di «Pranzo» — segnalare la sovrapposizione (bordo arancione, testo «si sovrappone al pranzo») e posizionare l’etichetta dentro l’anteprima con fondo opaco
- [media] trascinamento-in-corso__tab-light.png — banner «Dati di esempio · Rimuovi · ×» in cima — compare solo in questa schermata (nelle altre catture non c’è), e «Rimuovi» (azione distruttiva che cancella i dati) sta a pochi px dalla × che chiude solo il banner — tenere il banner coerente in tutte le schermate e distanziare/confermare «Rimuovi»
- [bassa] trascinamento-in-corso__tab-light.png — fumetto «Organizzare cena con il gruppo / alle 12:45» — staccato di ~25 px dall’anteprima e ripete l’orario già scritto nell’anteprima — agganciarlo all’anteprima o eliminarne l’orario
- [bassa] trascinamento-in-corso__tab-light.png — zona «Togli l’orario» — è più larga della colonna del contenuto (da x≈16 a 818, contro 77–757) e copre il blocco delle 18:00 — allinearla alla colonna e lasciare visibile il calendario sottostante (es. trasparenza)
- [bassa] trascinamento-in-corso__tab-light.png — anteprima rilascio con bordo sinistro a x≈131 contro x≈128 dei blocchi — disallineamento di 3 px — allineare alla colonna dei blocchi

## Riassunto

Ho guardato tutti i 44 screenshot (tablet 834×1112, tema chiaro). Le note sono 223: 8 alte, 96 medie, 119 basse. I difetti reali ci sono. I temi sono in ordine di gravità.

### 1. Controlli nativi non stilizzati (ALTA)
- Ci sono `<select>` nativi con la freccia di sistema in: area della nuova attività (attivita-dafare-aggiunta), area in Da sistemare (attivita-sistemare), aree nelle voci del Diario (diario), durate dei pasti nel pannello sonno della Giornata (giornata-sonno-aperto).
- Ci sono campi orario nativi con l'icona orologio del browser in rituale-sonno-pasti e giornata-sonno-aperto.
- Le aree di testo mostrano la maniglia nativa di ridimensionamento in rituale-settimana e scheda-scoperta.
- Correzione: usare ovunque la pillola/menu già stilizzata di sonno-pasti e delle schede. Per le aree di testo: resize:none e altezza automatica.

### 2. Testi sbagliati, ambigui o poco naturali (ALTA/MEDIA)
- Nel Diario l'etichetta «Priorità» è seguita dal nome di un'area, e compare solo su alcune voci (ALTA).
- «Giovedi» è senza accento (scheda-attivita).
- Formulazioni poco naturali o incomplete: «Sposta a domani quella non fatta», «Se prosegui, altri», «Pausa lunga dopo 4 blocchi: Nessuna», «Non ce l'ho fatta» (effetto ignoto), «Server · da collegare», «Orari abituali», «Come sempre · 23:30–07:30» (link o informazione?).
- Le opzioni di certezza delle scoperte hanno forme verbali incoerenti («notato una volta / lo noto ogni volta / misurato»).
- Inglese misto all'italiano: XP, Check-in, Focus.
- Maiuscole incoerenti tra un valore e l'altro («chiedi sempre» / «Chiedi sempre», «nessuna» / «Mai»).
- Lo stesso valore ha due nomi: «Aspetto: automatico» e «Auto».

### 3. Numeri senza etichetta e contatori incoerenti (ALTA/MEDIA)
- Mancano le etichette su:
  - Andamento: «38» con la fiamma e «65% · 81 di 124» (ALTA). Nel Profilo gli stessi numeri hanno etichette chiare.
  - Oggi: «1 di 2» e «38 giorni».
  - Da fare: «1 di 3» e «1 di 4».
  - Rituali: «2 di 3» e «0 di 4».
  - Anno: i numeri verdi dei mesi.
  - Per area: le frazioni «4/8».
  - Backup: «1».
  - Badge «6» su Attività e «1» su Rituali.
  - «🔥 3», «record».
- Contatori che non coincidono tra schermate:
  - Oggi dice «1 di 2», Abitudini «0 di 3 oggi».
  - La vista Settimana dice «4 di 24», il Bilancio della settimana «10 attività fatte».

### 4. Uso dello spazio sul tablet (ALTA/MEDIA)
- La colonna unica di circa 680 px lascia grandi vuoti: 300–600 px in Oggi, Abitudini, Rituali, Profilo, Da sistemare e Scoperte.
- La heatmap «Costanza» usa circa un terzo della card e non ha assi né periodo (ALTA).
- La vista Settimana è un elenco verticale come sul telefono.
- Nel rituale della sera ogni area occupa due righe (nome sopra, pulsanti 1–5 sotto, a destra).
- Il timer di concentrazione è piccolo al centro di uno schermo nero.
- Proposte: layout a due colonne (elenco + dettaglio, Funziona | Non funziona), heatmap a tutta larghezza, griglia settimanale, timer in proporzione allo schermo.

### 5. Fogli (bottom sheet) su tablet (MEDIA)
- Tutti i fogli sono ancorati al bordo basso senza margine né spazio di sicurezza. Succede in Aree, Impostazioni e sottopagine, Promemoria, Sonno e pasti, schede attività/abitudine/scoperta, Timer.
- Il «+» viola della barra resta visibile e vivo accanto al foglio.
- Manca un pulsante «Fine/Chiudi».
- Il velo dietro il foglio è leggero.
- Proposta: su tablet una finestra centrata o un popover ancorato all'elemento toccato.

### 6. Componenti incoerenti tra schermate (MEDIA)
- Il controllo di completamento cambia forma: cerchio (Oggi/Abitudini), quadrato (Senza orario), quadratino colorato non interattivo (Mese). Da fare e Settimana non hanno nessun controllo.
- La scala 1–5 ha grandi pulsanti bianchi nel Check-in e piccoli quadrati grigi nel rituale della sera.
- L'area appare in tre forme: pillola viola, testo con ⌄ (scheda attività/scoperta) e chip verde.
- Le pillole ora/durata hanno testo nero o viola. La × di azzeramento sta dentro o fuori dalla pillola. Per togliere un pasto c'è il cestino in un pannello e la × nell'altro.
- Il pannello sonno/pasti della Giornata è diverso dalla pagina Profilo › Sonno e pasti.
- Le frecce ‹ › sono cerchi in Giorno e quadrati in Anno/Mese.
- L'avatar è un cerchio lilla nell'intestazione e un quadrato viola nel Profilo.
- «Elimina» è centrato in una scheda e allineato a sinistra con icona in un'altra.
- Le icone 👍 dentro riquadri con bordo (Scoperte, Timer) sembrano pulsanti.
- I chip di stato «concluso/attivo» hanno lo stile dei pulsanti.
- Il «+ Oggi» della prima riga di Da fare è pieno viola, senza spiegazione.

### 7. Navigazione e contesto (MEDIA)
- Il Profilo, aperto dall'avatar, non ha titolo né pulsante indietro, e nessuna voce della barra è attiva.
- Nel Diario la barra evidenzia «Andamento» mentre si è in Profilo.
- Il link «‹ Profilo» del Diario sta fuori dalla colonna.
- La sezione «La giornata» contiene anche le viste Settimana, Mese e Anno.
- Nella vista Giorno la data non compare (solo «Oggi»).
- I nomi dei promemoria non coincidono con quelli dei rituali.
- Le Impostazioni hanno un gruppo senza titolo sotto «Account», e una sezione «Account» senza nessun account.
- In Aspetto ci sono anche Suoni e Vibrazione.

### 8. Stati poco visibili e affordance deboli (MEDIA)
- Gli interruttori spenti sono quasi invisibili (Musica, Fissa in alto).
- Gli interruttori disattivati in Promemoria non dicono se sono accesi o spenti.
- I campi «Incolla il link» in Musica non sembrano campi.
- «Promemoria: bloccati» è scritto in grigio neutro, senza nessun segnale di avviso.
- Una attività completata non dice «Fatta»: c'è solo il link grigio «Segna come non fatta».
- «Salva» è attivo con il campo vuoto (Cattura). Ci sono due salvataggi nel rituale Sonno e pasti.
- La fascia del sonno nel calendario non ha etichetta.
- Il calendario mensile e lo storico abitudine non hanno legenda.
- Il cestino è attaccato agli interruttori e ai menu.
- Nel Diario l'icona ↺ non è spiegata ed è disallineata.

### 9. Dettagli visivi e di allineamento (BASSA)
- Il contenuto che scorre si vede sotto la barra flottante.
- Il badge sulla barra copre l'icona.
- La scheda attiva del segmentato ha un'ombra che esce dal contenitore.
- Il riquadro della striscia settimanale sborda dalla colonna.
- Rientri irregolari: «Dalle», giorni di «Quando», filtro «Tutte».
- Nel grafico degli esperimenti le etichette delle medie coprono i punti e l'ultimo punto è tagliato.
- Il grafico del Check-in ha la legenda doppia e un buco nei dati senza spiegazione.
- La linea dell'ora attuale passa sopra il testo dei blocchi.
- Il trascinamento sopra «Pranzo» non avvisa della sovrapposizione.
- Il banner «Dati di esempio» compare solo in una schermata, con «Rimuovi» vicino alla ×.
- I formati delle durate sono incoerenti: «8h», «1 h 30», «45 min».
- Testi grigi piccoli con contrasto basso.
- scheda-attivita e scheda-attivita-fondo sono identici: la cattura «in fondo» non ha scorrimento.
