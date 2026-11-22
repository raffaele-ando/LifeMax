# Revisione telefono — giro 5

## oggi-adesso__tel-light.png
- [media] oggi-adesso__tel-light.png — chip arancione «🔥 38 giorni» in alto a destra — non dice di cosa sono i 38 giorni (serie di cosa? giorni di uso? di abitudini?); in più il chip è alto il doppio della riga data e non è allineato né al titolo né alla barra — scrivere «38 giorni di fila» o aggiungere sottotitolo, e allineare il chip verticalmente al blocco data+barra
- [bassa] oggi-adesso__tel-light.png — pallino viola sul segmento «Rituali» — indicatore senza significato esplicito (rituale da fare? novità?) e posizionato fuori dal segmento, quasi attaccato al bordo — sostituire con badge numerico o etichetta «1 da fare», o spiegarlo nell'accessibilità
- [bassa] oggi-adesso__tel-light.png — riga «1 di 2 fatte» — «fatte» senza soggetto (cose? attività?) — «1 di 2 cose fatte»
- [bassa] oggi-adesso__tel-light.png — metà inferiore dello schermo (sotto «Poi») vuota per ~120px prima della barra — accettabile, ma si potrebbe mostrare «Più tardi» / conteggio delle altre cose
## oggi-adesso__tel-dark.png
- [bassa] oggi-adesso__tel-dark.png — segmento attivo «Adesso» grigio chiaro su grigio scuro — lo stato selezionato è poco distinto rispetto al chiaro (dove è bianco pieno); il testo selezionato non cambia colore — aumentare contrasto del segmento attivo o colorare icona/testo in viola come nella tab bar
- [bassa] oggi-adesso__tel-dark.png — chip «38 giorni» marrone scuro — stessa ambiguità del tema chiaro; contrasto della parola «giorni» grigia su marrone basso — schiarire il testo
## andamento__tel-light.png
- [alta] andamento__tel-light.png — scheda serie: «38 giorni di fila» con la fila settimanale che mostra il Venerdì vuoto (non fatto) — contraddizione logica: se venerdì è saltato la serie non può essere 38 giorni — o la serie conta altro (es. giorni con almeno un'azione, tollerando salti) e va detto, o il quadrato V deve indicare «giorno libero/di riposo» con un'icona e una legenda
- [media] andamento__tel-light.png — scheda serie, testo «giorni di / fila» e «fatte: 81 di 124 in / 30 giorni» — due blocchi di testo piccoli che vanno a capo male in colonne strette, con «65%» isolato in alto a destra senza etichetta — impaginare come due statistiche affiancate: «38 · giorni di fila» e «65% · fatte negli ultimi 30 giorni (81/124)»; evitare il formato «fatte: …» con i due punti
- [media] andamento__tel-light.png — scheda «Costanza» — heatmap senza alcuna etichetta di asse (né giorni della settimana né mesi/settimane), forma frastagliata in alto a sinistra, griglia rientrata rispetto al titolo e metà destra della scheda vuota — aggiungere iniziali dei giorni a sinistra e mesi sopra, allineare la griglia al margine del titolo, allargare le celle per riempire la larghezza
- [bassa] andamento__tel-light.png — scheda «Costanza» — la scheda non dice il periodo coperto — sottotitolo «ultime 12 settimane»
- [bassa] andamento__tel-light.png — «Per area», numeri «4/8», «23/44» grigi accanto alla percentuale — non è chiaro cosa contino — tooltip o micro‑etichetta «fatte/previste»
- [bassa] andamento__tel-light.png — giorno corrente «M» evidenziato con bordo viola e lettera viola, ma due «M» nella fila (martedì e mercoledì?) — ambiguità M/M tipica italiana; usare «Ma»/«Me» o numeri del giorno
## andamento__tel-dark.png
- [alta] andamento__tel-dark.png — stessa contraddizione «38 giorni di fila» con venerdì vuoto
- [media] andamento__tel-dark.png — heatmap «Costanza» — in scuro i livelli alti sono azzurro chiarissimo e i livelli medi blu: la scala percettiva è invertita rispetto al chiaro (dove più = più scuro), e i livelli 2–3 sono difficili da distinguere — tenere una scala monotona di luminosità e saturazione verificata in entrambi i temi
- [bassa] andamento__tel-dark.png — barre «Per area» con colori più saturi (verde, giallo) che vibrano sul fondo nero — ridurre leggermente la saturazione in scuro
## andamento-fondo__tel-light.png
- [media] andamento-fondo__tel-light.png — «Per area», barra di «Altro / Esplorazione» rossa e «Progetti Founder» arancione‑rossa — il colore dell'area sulla barra di avanzamento viene letto come semaforo (rosso = male) anche quando 100%; e il rosso per un'area «neutra» suggerisce allarme — usare un unico colore di avanzamento (o tinta neutra) e tenere il colore dell'area solo sull'icona/pallino
- [media] andamento-fondo__tel-light.png — elenco di link in fondo (Riflessioni passate, Sessioni del timer, Aree, Grafici) senza titolo di sezione e mescolato a statistiche — aggiungere un titolo «Altro» o «Approfondisci»; «Aree» qui duplica Profilo › Aree e usa la stessa icona di «Per area» — chiarire («Gestisci aree») o toglierlo
- [bassa] andamento-fondo__tel-light.png — solo «Riflessioni passate» mostra un conteggio (79), le altre righe no — incoerenza; o conteggi ovunque o da nessuna parte
- [bassa] andamento-fondo__tel-light.png — «Grafici» — etichetta generica in una pagina che già contiene grafici — specificare («Grafici dettagliati» / «Tendenze»)
## andamento-fondo__tel-dark.png
- [media] andamento-fondo__tel-dark.png — stessi problemi del chiaro; in più la barra «Lavoro» viola chiaro coincide con il colore d'accento dell'app (tab attiva, FAB) — rischio di leggere la barra come elemento interattivo/selezionato
## aree__tel-light.png
- [media] aree__tel-light.png — interruttori viola a destra di ogni area — non c'è nessuna etichetta che dica cosa attivano (area visibile? attiva nei suggerimenti? archiviata?) — aggiungere un sottotitolo sotto «Le tue aree» («Spegni un'area per nasconderla da Oggi e Andamento») o una micro‑etichetta
- [media] aree__tel-light.png — icona cestino piccola (≈16px) attaccata all'interruttore — bersaglio tattile sotto i 44px e azione distruttiva accanto a un controllo usato spesso: rischio di tocchi accidentali — spostare l'eliminazione nel dettaglio dell'area o in swipe/menù «…», con conferma
- [bassa] aree__tel-light.png — campo «Nuova area»: icona libro a sinistra sembra un segnaposto non interattivo; non è chiaro se si possa scegliere icona/colore — renderla un pulsante con bordo tratteggiato o caption «Scegli icona»
- [bassa] aree__tel-light.png — «Aggiungi» viola pieno anche con nome vuoto — mostrarlo disabilitato (grigio) finché non c'è testo
- [bassa] aree__tel-light.png — nessuna possibilità visibile di riordinare o rinominare le aree — aggiungere maniglia di trascinamento o tocco sulla riga per modificare
## aree__tel-dark.png
- [media] aree__tel-dark.png — stessi problemi del chiaro (interruttori senza significato, cestino accanto all'interruttore)
- [bassa] aree__tel-dark.png — «Aggiungi» viola chiaro su grigio scuro: contrasto appena sufficiente, sembra già disabilitato — uniformare lo stato attivo/disabilitato
## attivita-abitudini__tel-light.png
- [media] attivita-abitudini__tel-light.png — riepilogo «0 di 3 oggi» — non torna con Oggi › Adesso, che dice «1 di 2 fatte» nella stessa giornata (e lì «Ripasso flashcard» era ancora da fare) — chiarire cosa conta ciascun contatore («1 di 2 cose fatte» vs «0 di 3 abitudini») oppure unificare la fonte
- [media] attivita-abitudini__tel-light.png — badge numerici del controllo segmentato (6, 9, 3) incastrati nell'angolo in alto a destra di ogni segmento, a filo del bordo, con stile diverso dal badge della tab bar (pieno viola tondo vs riquadro grigio) — usare un solo stile di badge e metterlo inline dopo l'etichetta («Da fare 9»)
- [bassa] attivita-abitudini__tel-light.png — «🔥 3» solo su «Camminata / movimento» senza etichetta — numero senza unità; «3 giorni di fila» o tooltip
- [bassa] attivita-abitudini__tel-light.png — anello vuoto grande accanto a «0 di 3» — a 0% è solo un cerchio grigio che sembra un segnaposto/caricamento — mostrare un tratto minimo o un'icona dentro l'anello
- [bassa] attivita-abitudini__tel-light.png — cerchi di spunta colorati per area (verde, blu) — il colore dell'anello non spiega nulla e confonde con lo stato «fatto» (verde) — usare un anello neutro e il colore solo nel pallino dell'area
## attivita-abitudini__tel-dark.png
- [media] attivita-abitudini__tel-dark.png — stesse incoerenze del chiaro; il segmento attivo «Abitudini» grigio medio con testo bianco ha poco contrasto con i segmenti inattivi
- [bassa] attivita-abitudini__tel-dark.png — pulsante «+ Aggiungi» viola chiaro su grigio quasi nero: sembra disabilitato pur essendo l'azione primaria del campo
## attivita-abitudini-nuova__tel-light.png
- [media] attivita-abitudini-nuova__tel-light.png — pannello opzioni: «Ogni giorno» è testo semplice grigio, «Nessuna» è una pillola grigia, «Salute & Sport» una pillola lilla — tre stili diversi per tre valori dello stesso tipo di riga — uniformare: o tutti pillole (stesso colore neutro, lilla solo se valore impostato) o tutti testo+chevron
- [media] attivita-abitudini-nuova__tel-light.png — «Area: Salute & Sport» già precompilata per «Meditare» senza che l'utente l'abbia scelta, con lo stesso aspetto di un valore scelto — se è un suggerimento automatico segnalarlo («Suggerita») o lasciare vuoto
- [bassa] attivita-abitudini-nuova__tel-light.png — riga «Giorni / Ogni giorno» ridondante con i 7 cerchi tutti pieni subito sotto — la riga di intestazione occupa spazio senza aggiungere informazione; unire («Giorni · ogni giorno» come sottotitolo dei cerchi)
- [bassa] attivita-abitudini-nuova__tel-light.png — pannello opzioni staccato dal campo «Meditare» da uno spazio di 12px, come se fosse un'altra scheda — attaccarlo al campo (stesso contenitore) per far capire che sono le opzioni della nuova abitudine
- [bassa] attivita-abitudini-nuova__tel-light.png — cerchi giorni «M M» (martedì/mercoledì) indistinguibili — accettabile per convenzione ma aggiungere aria-label completo
## attivita-abitudini-nuova__tel-dark.png
- [media] attivita-abitudini-nuova__tel-dark.png — stessi problemi del chiaro; pillola «Nessuna» grigio su grigio scuro con testo grigio: contrasto basso, sembra disabilitata
## attivita-dafare__tel-light.png
- [alta] attivita-dafare__tel-light.png — pulsante «+ Oggi» della prima riga viola pieno, tutti gli altri lilla chiaro — non si capisce se la prima attività è già in Oggi (stato attivo) o se è solo il pulsante primario; nessun testo cambia — se è «già in Oggi» mostrare «✓ Oggi»/«In Oggi», altrimenti tutti uguali
- [media] attivita-dafare__tel-light.png — titoli che vanno a capo a metà larghezza («Studiare le risposte / per l'OFA di inglese», «Leggere il libro di / esercizi di Analisi 1») anche nelle righe senza «1 di N»: la colonna del titolo riserva sempre lo spazio del contatore — lasciare che il titolo occupi tutto lo spazio disponibile quando il contatore manca
- [media] attivita-dafare__tel-light.png — «1 di 3», «1 di 4» senza etichetta — non è chiaro che siano passi — «1/3 passi» o icona checklist accanto
- [bassa] attivita-dafare__tel-light.png — filtro «Tutte ⌄» grande (44px) con l'intestazione «Importanti 3» attaccata sotto a ~8px — spaziatura sbilanciata (più aria tra campo e filtro che tra filtro e sezione) — portare il filtro sulla stessa riga dell'intestazione o aumentare lo spazio sotto
- [bassa] attivita-dafare__tel-light.png — area indicata solo dall'icona colorata a sinistra senza nome — su telefono le icone (libro, pennello, valigetta, cuore, lampadina) non sono memorizzabili — mostrare il nome dell'area in metadato come in Abitudini
- [bassa] attivita-dafare__tel-light.png — nessun controllo per completare l'attività direttamente dalla lista (in Abitudini c'è il cerchio) — incoerenza tra le due liste della stessa sezione
## attivita-dafare__tel-dark.png
- [alta] attivita-dafare__tel-dark.png — stessa ambiguità del primo «+ Oggi» viola pieno
- [bassa] attivita-dafare__tel-dark.png — pulsanti «+ Oggi» secondari viola scuro su grigio: poco contrasto, testo lilla leggibile ma bordo del bottone quasi invisibile
## attivita-dafare-aggiunta__tel-light.png
- [media] attivita-dafare-aggiunta__tel-light.png — opzioni della nuova attività (chip Oggi/Domani/Senza data + menù area) — sono un componente completamente diverso dal pannello a righe usato per la nuova abitudine (Giorni/Ora/Area in una scheda) — stesso compito, due linguaggi visivi; uniformare (stessa scheda a righe o stessi chip)
- [media] attivita-dafare-aggiunta__tel-light.png — chip e menù area rientrati di ~12px rispetto al bordo del campo e delle schede (x≈28 vs 16) — allineare al margine sinistro del campo
- [bassa] attivita-dafare-aggiunta__tel-light.png — menù «Altro / Esplorazione ⌄» con aspetto di select nativa (bordo grigio, chevron piccolo) diverso dai chip accanto; manca l'etichetta «Area» — dargli lo stesso stile dei chip con icona dell'area e prefisso
- [bassa] attivita-dafare-aggiunta__tel-light.png — nessuna opzione «Importante» al momento della creazione, pur essendo la lista divisa in Importanti/Altre — aggiungere chip «★ Importante»
- [bassa] attivita-dafare-aggiunta__tel-light.png — il filtro «Tutte» e la lista restano sotto le opzioni aperte, spingendo il contenuto: tre gruppi di pillole impilati (chip data, menù area, filtro) si confondono — separare con un divisore o chiudere il filtro mentre si scrive
## attivita-dafare-aggiunta__tel-dark.png
- [media] attivita-dafare-aggiunta__tel-dark.png — stessi problemi del chiaro; chip non selezionati «Oggi»/«Domani» con bordo grigio scuro quasi invisibile
## attivita-sistemare__tel-light.png
- [media] attivita-sistemare__tel-light.png — «In coda 5» mostra 4 righe e poi «e un'altra» in corsivo — nascondere un solo elemento per scrivere una riga che occupa lo stesso spazio non ha senso — mostrare tutte e 5 le righe, o troncare da 6 in su con «e altre N»
- [media] attivita-sistemare__tel-light.png — righe «In coda» in testo grigio senza contenitore, separatori né chevron, rientrate rispetto al titolo — non si capisce se siano toccabili (per sistemare subito quella) — dare loro aspetto di lista (righe con divisori) o dichiararle chiaramente non interattive
- [bassa] attivita-sistemare__tel-light.png — micro‑titolo «🗂 Da sistemare» sotto il segmento attivo con lo stesso nome — ridondante e molto piccolo — sostituirlo con un'istruzione utile («Decidi dove va: 1 di 6»)
- [bassa] attivita-sistemare__tel-light.png — menù area «Altro / Esplorazione ⌄» con fondo grigio pieno — terzo stile diverso per lo stesso selettore d'area (cfr. bordo bianco in Da fare, pillola lilla in Abitudini) — un solo componente «selettore area»
- [bassa] attivita-sistemare__tel-light.png — pulsante «Da fare» con lo stesso nome del segmento accanto — si capisce, ma «Nella lista» o «Più avanti» chiarirebbe la differenza da «Oggi»
- [bassa] attivita-sistemare__tel-light.png — «aggiunta 18 ago, 10:30» — se è oggi scrivere «oggi, 10:30»
## attivita-sistemare__tel-dark.png
- [media] attivita-sistemare__tel-dark.png — stessi problemi del chiaro; testo «Scarta» rosa chiaro su fondo scuro va bene, ma il bordo del pulsante si perde
## cattura__tel-light.png
- [media] cattura__tel-light.png — popup di cattura — non dice dove finisce la nota (va in «Da sistemare»?) — aggiungere una riga di aiuto «Finisce in Da sistemare, la decidi dopo»
- [media] cattura__tel-light.png — «Chiudi» occupa un'intera riga separata da un divisore per un link piccolo (≈40×20px) allineato a destra — spazio sprecato e bersaglio piccolo — togliere la riga e usare una ✕ nell'intestazione o il tocco fuori/swipe; oppure mettere «Chiudi» a sinistra di «Salva»
- [bassa] cattura__tel-light.png — testo segnaposto «Scrivi una nota…» mentre altrove la funzione si chiama «pensiero»/«idea» (la voce in Da sistemare inizia con «Idea:») — scegliere un unico termine
- [bassa] cattura__tel-light.png — icona fulmine a sinistra non spiegata e non toccabile — decorativa, ma suggerisce un'azione; ridurla o sostituirla con un titolo «Cattura veloce»
## cattura__tel-dark.png
- [media] cattura__tel-dark.png — stessi problemi del chiaro; il bordo del popup scuro su sfondo sfocato scuro è appena percettibile — aumentare il contrasto del bordo/ombra
- [bassa] cattura__tel-dark.png — «Salva» disabilitato viola scuro con testo grigio: si distingue a fatica dallo stato attivo — rendere lo stato disabilitato più evidente
## diario__tel-light.png
- [alta] diario__tel-light.png — riga «Completata · Organizzare cena con il gruppo 👥 ☆ Priorità» seguita da una select «Relazioni & Sociale ⌄» dentro il registro — un controllo di modifica nel mezzo di un diario cronologico rompe il ritmo della lista, «Priorità» va a capo da sola e non si capisce se la stella sia un'azione o un'etichetta — mostrare l'area come metadato testuale (come nelle altre righe) e spostare la modifica in un tocco sulla riga
- [media] diario__tel-light.png — barra di navigazione in basso con «Andamento» attivo mentre si è in Profilo › Diario — la tab evidenziata non corrisponde al percorso di ritorno «‹ Profilo» — decidere dove vive Diario (sotto Andamento: allora il link indietro deve dire «Andamento»; sotto Profilo: nessuna tab attiva)
- [media] diario__tel-light.png — icona ↶ (annulla) su ogni riga senza etichetta, a metà tra testo e orario — non si capisce cosa annulli (eliminare la nota? riaprire l'attività?) e su 8 righe diventa rumore — spostarla nello swipe o in un menù, o etichettarla «Annulla»
- [media] diario__tel-light.png — testo delle voci che va a capo in una colonna stretta (~180px) per far posto a icona annulla + orario, con titoli in grassetto spezzati su 3 righe — ridurre la colonna destra (orario sopra, sotto il titolo) e lasciare il testo a piena larghezza
- [bassa] diario__tel-light.png — «Annotato · …» — participio maschile riferito a nota/idea, suona da log tecnico — «Nota:» o «Hai annotato»; e «Check-in · energia 4 · focus 5 · umore 5» senza scala — «4/5»
- [bassa] diario__tel-light.png — controllo segmentato «Cose importanti / Tutto» largo solo metà scheda, dentro una scheda: stile diverso dagli altri segmentati a piena larghezza — renderlo a piena larghezza o spostarlo fuori dalla scheda
## diario__tel-dark.png
- [alta] diario__tel-dark.png — stessa select incastrata nella voce «Completata»
- [media] diario__tel-dark.png — stessi problemi di tab attiva errata, icone annulla e testo stretto; icone delle righe (riquadri grigi) poco distinte dal fondo della scheda
## giornata-anno__tel-light.png
- [media] giornata-anno__tel-light.png — numeri verdi «7», «25», «17» in alto a destra dei mesi senza etichetta — non si sa se sono giorni attivi, attività o XP — «7 gg» o legenda sotto le statistiche
- [media] giornata-anno__tel-light.png — mini‑calendari dei mesi senza intestazione dei giorni (L M M G V S D) e senza legenda dei toni di blu — la griglia è decifrabile solo per intuito — aggiungere una riga di iniziali una sola volta sopra la griglia dei mesi e una legenda «meno → più» come in Costanza
- [bassa] giornata-anno__tel-light.png — «1874 XP» compare solo qui: il concetto di punti esperienza non è introdotto altrove (né in Andamento né nel Profilo) — spiegarlo o toglierlo; e «82 attività fatte» nell'anno non combacia a colpo d'occhio con «81 di 124 in 30 giorni» di Andamento — chiarire se contano anche le abitudini
- [bassa] giornata-anno__tel-light.png — due controlli segmentati impilati con stili diversi (bianco su grigio sopra, pillola lilla sotto) e il pallino viola su «Rituali» — gerarchia comprensibile ma pesante; valutare il secondo come chip più leggeri o un menù «Vista: Anno ⌄»
- [bassa] giornata-anno__tel-light.png — riga «‹ 2026 ›»: anno attaccato alla freccia sinistra e freccia destra all'estremo opposto — centrare l'anno tra le frecce come in un navigatore di periodo
## giornata-anno__tel-dark.png
- [media] giornata-anno__tel-dark.png — stessi problemi del chiaro; i numeri verdi piccoli su grigio scuro hanno contrasto basso e i mesi futuri (Set–Dic) hanno celle quasi uguali a quelle passate senza attività — differenziare passato vuoto e futuro
## giornata-giorno__tel-light.png
- [media] giornata-giorno__tel-light.png — fascia tratteggiata 07:00–07:30 senza etichetta — è il sonno (sveglia 07:30) ma non c'è nulla che lo dica — scrivere «Sonno» o un'icona letto dentro la fascia
- [media] giornata-giorno__tel-light.png — etichetta «10:30» dell'ora attuale appoggiata sul bordo destro del blocco «Organizzare cena…», e la linea attraversa il blocco a filo dell'orario «09:30–11:00» — la sovrapposizione rende il blocco meno leggibile — far passare la linea sotto il blocco (z-index) e spostare l'etichetta nella colonna delle ore a sinistra
- [media] giornata-giorno__tel-light.png — riga riassunto «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — tre icone pasto senza testo, non si capisce se indicano pasti registrati o previsti — usare «3 pasti» o spunte/numeri, e un'etichetta «Sonno e pasti»
- [bassa] giornata-giorno__tel-light.png — titolo «Oggi» senza la data — su vista calendario serve sapere il giorno (soprattutto navigando con le frecce) — «Oggi · mar 18 ago»
- [bassa] giornata-giorno__tel-light.png — blocchi «Colazione» e «Pranzo» grigi senza orario mentre le attività lo hanno — aggiungere l'orario per coerenza
- [bassa] giornata-giorno__tel-light.png — l'abitudine «Ripasso flashcard» (in Adesso, da fare oggi) non compare nel calendario — se le abitudini senza orario sono in fondo («senza orario») va bene, ma un indicatore in alto «+1 senza orario» aiuterebbe
## giornata-giorno__tel-dark.png
- [media] giornata-giorno__tel-dark.png — stessi problemi del chiaro; il blocco completato barrato ha testo grigio su grigio poco leggibile e la barra laterale rosa scuro quasi invisibile
- [bassa] giornata-giorno__tel-dark.png — linee orarie della griglia molto deboli sul nero — si perde la scansione delle ore
## giornata-giorno-fondo__tel-light.png
- [media] giornata-giorno-fondo__tel-light.png — riga «Ripasso flashcard» in «Senza orario» con casella QUADRATA, mentre in Abitudini e in Adesso le abitudini/cose da fare si spuntano con un CERCHIO — stesso oggetto, due controlli diversi — usare un unico controllo di completamento
- [media] giornata-giorno-fondo__tel-light.png — contenitore «Senza orario»: la scheda ha gli angoli superiori squadrati/tagliati e l'intestazione «🕒 Senza orario 1» sta fuori, appoggiata sopra — sembra una scheda troncata — dare alla scheda tutti gli angoli arrotondati o mettere il titolo dentro
- [media] giornata-giorno-fondo__tel-light.png — «Rimanda a domani l'attività rimasta» — non dice quale né quante (e «rimasta» al singolare cambierà con più elementi); come link isolato senza conferma è rischioso — «Rimanda a domani le cose non fatte (2)» con anteprima
- [bassa] giornata-giorno-fondo__tel-light.png — icona orologio viola a destra di «Ripasso flashcard» senza etichetta — azione «dai un orario» non evidente — aggiungere testo «Orario» o aria-label e tooltip
- [bassa] giornata-giorno-fondo__tel-light.png — blocco «Leggere 20 minuti» alle 22:00 senza orario di fine, mentre «Camminata / movimento» mostra «18:00–18:45» — incoerenza nei metadati dei blocchi
- [bassa] giornata-giorno-fondo__tel-light.png — blocchi abitudine con bordo verde e icona ↻ verde: il verde è lo stesso del «Fatto», fa pensare che siano già completate — usare il colore dell'area o un bordo neutro
## giornata-giorno-fondo__tel-dark.png
- [media] giornata-giorno-fondo__tel-dark.png — stessi problemi del chiaro; casella quadrata con bordo grigio scuro quasi invisibile sul fondo scheda
## giornata-mese__tel-light.png
- [media] giornata-mese__tel-light.png — «18 giorni attivi» ad agosto, mentre la vista Anno mostra «17» sul mese di agosto — dati incoerenti tra viste (probabilmente oggi contato in uno e non nell'altro) — usare la stessa regola di conteggio
- [media] giornata-mese__tel-light.png — pallini colorati sotto i giorni (rosa, verde, rosso, giallo, blu, viola) e anelli parziali verdi senza legenda — non si capisce che i pallini siano aree né cosa misuri l'anello (abitudini? attività?) — legenda compatta sotto il calendario
- [bassa] giornata-mese__tel-light.png — giorni del mese precedente (27–31 luglio) mostrati con anelli e pallini attenuati: aggiungono rumore e sembrano dati di agosto — mostrarli solo come numeri grigi senza anelli
- [bassa] giornata-mese__tel-light.png — sezione «Oggi» sotto il calendario: il primo elemento è «Leggere 20 minuti · 22:00», non l'evento più vicino — ordinare per orario o per «da fare adesso»; casella quadrata verde diversa dai cerchi di Abitudini
- [bassa] giornata-mese__tel-light.png — giorno selezionato 18 con doppio indicatore (cerchio viola pieno + riquadro grigio + anello verde) — troppi stati sovrapposti — un solo indicatore di selezione
## giornata-mese__tel-dark.png
- [media] giornata-mese__tel-dark.png — stessi problemi del chiaro; anelli parziali verde su traccia grigio scuro difficili da distinguere dagli anelli vuoti, e pallini piccoli scuri (blu, viola) quasi invisibili
## giornata-scheda-abitudine__tel-light.png
- [media] giornata-scheda-abitudine__tel-light.png — modifiche Ora/Durata/Area dentro la scheda di un'occorrenza («Abitudine · Oggi») — non è chiaro se cambiano solo oggi o l'abitudine per sempre — aggiungere sottotitolo «Solo oggi» / «Tutte le volte» o una scelta al salvataggio
- [media] giornata-scheda-abitudine__tel-light.png — «Termina l'abitudine» (rosso, distruttivo) messo in mezzo tra «Salta oggi» e «Apri l'abitudine» — rischio di tocco errato — spostarlo per ultimo, separato, o dentro la scheda completa dell'abitudine
- [bassa] giornata-scheda-abitudine__tel-light.png — valore «18:00» in nero, «45 min» e «Salute & Sport» in viola — stessa famiglia di pillole con colori di testo diversi — uniformare
- [bassa] giornata-scheda-abitudine__tel-light.png — «Salta oggi» qui ha icona ✕, in Adesso ha icona ⏭ — stessa azione, icone diverse — usare la stessa
- [bassa] giornata-scheda-abitudine__tel-light.png — oscuramento dello sfondo leggero: la vista calendario dietro resta molto leggibile e compete con il foglio — scurire lo scrim
## giornata-scheda-abitudine__tel-dark.png
- [media] giornata-scheda-abitudine__tel-dark.png — stessi problemi del chiaro; il foglio grigio scuro si stacca poco dallo sfondo scurito (bordo superiore appena visibile)
## giornata-scheda-blocco__tel-light.png
- [media] giornata-scheda-blocco__tel-light.png — l'attività è completata ma la scheda non lo dice: c'è solo il link «↶ Segna come non fatta» — mostrare uno stato esplicito («✓ Fatta alle 10:00») sopra l'azione di annullamento
- [media] giornata-scheda-blocco__tel-light.png — titolo «Organizzare cena / con il gruppo» che va a capo a ~210px pur avendo spazio fino al pulsante ✕ — il contenitore del titolo è troppo stretto — allargarlo fino alla ✕
- [bassa] giornata-scheda-blocco__tel-light.png — durata «1 h 30» (formato ibrido) accanto a «45 min» dell'altra scheda — usare un formato unico («1 h 30 min» o «1:30 h»)
- [bassa] giornata-scheda-blocco__tel-light.png — manca il controllo «Importante» (★) che nel Diario compare accanto a questa attività — aggiungerlo alle righe di proprietà
- [bassa] giornata-scheda-blocco__tel-light.png — la vista sotto risulta scorsa (il segmentato «Giorno/Settimana» è tagliato in cima) — all'apertura del foglio lo scroll della pagina salta; mantenere la posizione
## giornata-scheda-blocco__tel-dark.png
- [media] giornata-scheda-blocco__tel-dark.png — stessi problemi del chiaro; «Elimina» rosa su grigio scuro leggibile ma l'icona cestino è minuscola
## giornata-settimana__tel-light.png
- [media] giornata-settimana__tel-light.png — giorno passato «Lunedì 17»: «Leggere 20 minuti» e «Ripasso flashcard» non barrati e senza alcun segno di «non fatto/saltato» — su un giorno passato bisogna distinguere fatto / mancato / saltato (es. testo grigio + «mancata») invece di lasciarli identici a cose ancora da fare
- [media] giornata-settimana__tel-light.png — «Organizzare cena con il gruppo» compare barrato sia lunedì 17 sia martedì 18 alle 09:30 — sembra un duplicato o un dato incoerente (il Diario la dà completata oggi alle 10:00) — verificare che un'attività singola non venga mostrata in due giorni
- [media] giornata-settimana__tel-light.png — «Inbox a zero + piani per do…» troncato con puntini per far posto a «Sposta» — il titolo si perde; permettere 2 righe o mettere «Sposta» sotto
- [bassa] giornata-settimana__tel-light.png — «Sposta» compare solo sull'ultima riga senza spiegazione (perché quella e non le altre non fatte?) — rendere esplicito il criterio («Non fatta · Sposta a oggi»)
- [bassa] giornata-settimana__tel-light.png — righe senza orario lasciano vuota la colonna dell'ora e partono con icone/pallini diversi (↻ per abitudini, pallino colorato per attività) — accettabile, ma una legenda o le stesse icone usate altrove (icona area) renderebbero coerente
- [bassa] giornata-settimana__tel-light.png — «4 di 24 fatte questa settimana» — numero 4 in grassetto staccato dal resto, testo piccolo; «fatte» senza soggetto — «4 cose fatte su 24 questa settimana»
## giornata-settimana__tel-dark.png
- [media] giornata-settimana__tel-dark.png — stessi problemi del chiaro; testo barrato grigio su grigio poco leggibile e intestazione «Lunedì 17» grigia che sembra disabilitata
## giornata-sonno-aperto__tel-light.png
- [media] giornata-sonno-aperto__tel-light.png — pannello sonno/pasti: i campi «A letto 23:30» e «Sveglia 07:30» iniziano a x≈95 e x≈270, mentre i campi orario dei pasti iniziano a x≈146 — due griglie diverse nello stesso pannello, colonne non allineate — allineare i campi su una sola colonna (sonno su due righe come i pasti, o pasti con la stessa griglia)
- [media] giornata-sonno-aperto__tel-light.png — «Annulla le modifiche» visibile e attivo anche senza modifiche, e manca un «Salva»/«Fatto»: non si sa se le modifiche si salvano da sole — mostrare «Annulla» solo dopo una modifica e un feedback «Salvato»
- [bassa] giornata-sonno-aperto__tel-light.png — tre link in fila «+ Pasto · Annulla le modifiche · Orari abituali» con lo stesso peso — «Orari abituali» non spiega se applica o apre le impostazioni — «Ripristina orari abituali» oppure «Imposta orari abituali ›»
- [bassa] giornata-sonno-aperto__tel-light.png — campi ora e select durata con aspetto nativo (chevron di sistema, bordo grigio) diverso dalle pillole lilla usate per Ora/Durata nelle schede attività — stesso dato (ora, durata), due componenti diversi — uniformare
- [bassa] giornata-sonno-aperto__tel-light.png — etichette «Colazione/Pranzo/Cena» in grassetto senza icona, «A letto/Sveglia» in regolare con icona — gerarchia incoerente nella stessa griglia
- [bassa] giornata-sonno-aperto__tel-light.png — cestino piccolo (≈14px) accanto alla select — bersaglio sotto 44px
## giornata-sonno-aperto__tel-dark.png
- [media] giornata-sonno-aperto__tel-dark.png — stessi problemi del chiaro; campi con bordo grigio su grigio scuro poco visibili; l'icona orologio nativa dei campi time può apparire nera su scuro in alcuni browser (verificare color-scheme)
## imp-aspetto__tel-light.png
- [media] imp-aspetto__tel-light.png — «Suoni» e «Vibrazione» dentro la pagina «Aspetto» — non sono aspetto visivo — rinominare la pagina «Aspetto e feedback» o spostarli in una sezione «Suoni e vibrazione»
- [bassa] imp-aspetto__tel-light.png — interruttori senza descrizione (Suoni di cosa? Animazioni: tutte o solo celebrazioni?) — aggiungere una riga di spiegazione sotto ciascuno
- [bassa] imp-aspetto__tel-light.png — (sfondo, Profilo) «109 attività fatte in tutto» contro «82 attività fatte» nell'anno 2026, mentre la vista Anno mostra attività solo da giugno 2026 — i totali non tornano; verificare la definizione di «attività» (con o senza abitudini)
- [bassa] imp-aspetto__tel-light.png — foglio con ritorno «‹ Impostazioni» e anche ✕: due modi di uscire senza differenza chiara — ok, ma la ✕ dovrebbe chiudere tutto e va detto con coerenza in tutti i sottofogli
## imp-aspetto__tel-dark.png
- [media] imp-aspetto__tel-dark.png — stessi problemi del chiaro; il segmento «Auto» selezionato grigio medio è poco distinguibile dagli altri — usare accento viola per il tema attivo
## imp-musica__tel-light.png
- [alta] imp-musica__tel-light.png — campi «Link della playlist» bianco‑quasi‑grigio dentro una scheda grigio chiaro, senza bordo — i campi sono quasi invisibili, sembrano righe di testo segnaposto — dare bordo 1px o fondo bianco pieno con contrasto ≥3:1 rispetto alla scheda
- [media] imp-musica__tel-light.png — interruttore «Apri all'avvio del timer» spento: pomello bianco su binario grigio chiarissimo, contrasto troppo basso, sembra disabilitato — scurire il binario spento
- [media] imp-musica__tel-light.png — nessuna indicazione di quali link funzionano (Spotify? YouTube? Apple Music?) né esempio — aiuto sotto «Predefinita»: «Incolla un link Spotify o YouTube»
- [bassa] imp-musica__tel-light.png — etichette «Predefinita», «Studio / Università»… attaccate al bordo superiore della scheda/riga (padding superiore ≈6px contro ≈12px sotto) — riequilibrare il padding
- [bassa] imp-musica__tel-light.png — 8 campi identici in fila per area: pagina lunga e ripetitiva — mostrare solo le aree con playlist e un «+ Playlist per un'area»
## imp-musica__tel-dark.png
- [media] imp-musica__tel-dark.png — in scuro i campi si vedono meglio, ma l'interruttore spento (pomello grigio su grigio) è poco leggibile; stesso problema di aiuto mancante e ripetitività
## imp-timer__tel-light.png
- [media] imp-timer__tel-light.png — «Se prosegui, altri» — frase spezzata e criptica (altri cosa? minuti dopo l'avvio rapido?) — «Se continui, aggiungi» o «Estensione dopo l'avvio rapido»
- [media] imp-timer__tel-light.png — «Pausa lunga dopo 4 blocchi: Nessuna» — valore «Nessuna» per una durata è ambiguo (pausa lunga disattivata?) — «Disattivata» o «Off», oppure usare un interruttore + durata
- [bassa] imp-timer__tel-light.png — tre timer («Avvio rapido», «Sessione», «Pomodoro») elencati senza descrizione della differenza — una riga di spiegazione sotto ogni intestazione
- [bassa] imp-timer__tel-light.png — due righe «Durata» identiche in sezioni diverse — rinominare («Durata avvio rapido», «Durata sessione») per chi scorre veloce
- [bassa] imp-timer__tel-light.png — «Timer predefinito: Chiedi sempre» — valore che non è un timer; ok ma pillola larga che va quasi a capo — «Chiedi ogni volta»
## imp-timer__tel-dark.png
- [bassa] imp-timer__tel-dark.png — stessi problemi di testo del chiaro; pillole valore viola scuro su grigio con testo lilla: contrasto sufficiente ma basso — nessun altro difetto specifico del tema
## impostazioni__tel-light.png
- [media] impostazioni__tel-light.png — riga «Area predefinita · Automatica ⌄» è una select nativa con triangolino pieno, unica tra righe con chevron › — controllo nativo non stilizzato e incoerente — aprire un foglio come per Timer/Musica o usare lo stesso chevron
- [media] impostazioni__tel-light.png — il secondo gruppo (Area predefinita, Timer, Musica, Aspetto) sta sotto l'intestazione «Account» ma sono preferenze — aggiungere intestazione «Preferenze»
- [bassa] impostazioni__tel-light.png — valori con maiuscola incoerente: «Automatica» vs «chiedi sempre», «nessuna», «automatico» — scegliere minuscolo per tutti i valori (o maiuscola per tutti)
- [bassa] impostazioni__tel-light.png — «Sincronizzazione · su questo dispositivo» senza chevron: non si capisce se è toccabile né che significa «non sincronizzato» — «Solo su questo dispositivo» + chevron per attivarla
- [bassa] impostazioni__tel-light.png — «Backup e ripristino 1» — numero senza etichetta — «1 backup»; «Esporta dati»/«Importa dati» senza chevron né indicazione del formato
- [bassa] impostazioni__tel-light.png — «Su cosa si basa» — titolo vago — «Il metodo» / «Le idee dietro l'app»
## impostazioni__tel-dark.png
- [media] impostazioni__tel-dark.png — stessi problemi del chiaro; la select nativa «Automatica ⌄» con triangolino bianco pieno risalta come elemento estraneo
## impostazioni-fondo__tel-light.png
- [media] impostazioni-fondo__tel-light.png — «Rimuovi dati di esempio» presente mentre i dati mostrati in tutta l'app (79 riflessioni, 109 attività, 38 giorni) sembrano dati reali — se sono dati di esempio l'app non lo segnala da nessuna parte (manca un banner «Stai vedendo dati di esempio»); se sono reali, la voce non dovrebbe esserci — chiarire lo stato
- [bassa] impostazioni-fondo__tel-light.png — «Registro tecnico» in «Guida» — è uno strumento di debug, non una guida — spostarlo in fondo sotto «Avanzate»
- [bassa] impostazioni-fondo__tel-light.png — «Cancella tutti i dati» rosso è separato bene; ma «Rimuovi dati di esempio» ha un'icona ✨ che lo fa sembrare positivo — usare un'icona neutra e una descrizione di cosa resta
## impostazioni-fondo__tel-dark.png
- [bassa] impostazioni-fondo__tel-dark.png — stessi problemi del chiaro; nessun difetto specifico del tema (rosso «Cancella tutti i dati» leggibile)
## menu-oggi-avatar__tel-light.png
- [media] menu-oggi-avatar__tel-light.png — il tocco sull'avatar apre direttamente la pagina Profilo senza titolo, senza «‹ indietro» né ✕, e nessuna tab attiva nella barra in basso — l'utente non sa dove si trova né come tornare a Oggi se non indovinando la tab — aggiungere titolo «Profilo» e un pulsante indietro/chiudi, o aprire come foglio
- [media] menu-oggi-avatar__tel-light.png — «Promemoria · bloccati» — non si capisce chi li blocca (il browser? l'utente?) né cosa fare; tono da errore senza colore di avviso — «Notifiche bloccate dal browser» in arancione con azione «Come sbloccarle»
- [bassa] menu-oggi-avatar__tel-light.png — terza statistica «fatte negli ultimi 30 giorni» su due righe arriva a ~4px dal bordo destro della scheda — etichetta più corta («ultimi 30 gg») o padding
- [bassa] menu-oggi-avatar__tel-light.png — «Diario» sta sotto Profilo ma quando lo si apre la tab bar evidenzia «Andamento» (vedi diario) — collocazione incoerente; e Andamento ha già «Riflessioni passate»: due ingressi per contenuti simili
## menu-oggi-avatar__tel-dark.png
- [media] menu-oggi-avatar__tel-dark.png — stessi problemi del chiaro (nessun titolo/indietro, «bloccati» ambiguo)
## profilo__tel-light.png
- [media] profilo__tel-light.png — identico a menu-oggi-avatar: pagina senza intestazione «Profilo» né modo esplicito di tornare indietro; nessuna tab attiva
- [bassa] profilo__tel-light.png — l'avatar «R» viola e il motto non sono modificabili in apparenza (nessuna icona matita) — aggiungere affordance «Modifica profilo»
- [bassa] profilo__tel-light.png — «109 attività fatte in tutto» incoerente con «82 attività fatte» nella vista Anno 2026 (dati che partono da giugno 2026)
- [bassa] profilo__tel-light.png — grande area vuota sotto le liste (~180px) — accettabile; si potrebbe spostare qui la versione/app info
## profilo__tel-dark.png
- [media] profilo__tel-dark.png — stessi problemi del chiaro; nessun difetto specifico del tema
## promemoria__tel-light.png
- [media] promemoria__tel-light.png — banner «Notifiche bloccate»: testo «Si riattivano dalle impostazioni del browser, alla voce di questo indirizzo» poco naturale e senza azione — «Per riattivarle apri le impostazioni del sito nel browser (icona lucchetto accanto all'indirizzo)» + pulsante «Riprova» che richiede il permesso
- [media] promemoria__tel-light.png — righe Notifiche disattivate (testo grigio) ma i campi orario restano lilla pieni, come se fossero attivi; e «Non disturbare» sotto è pienamente attivo e modificabile pur essendo le notifiche bloccate — stato disabilitato incoerente — attenuare anche i campi orario e disattivare/attenuare «Non disturbare»
- [bassa] promemoria__tel-light.png — riga «Dalle [23:00] alle [07:00]»: «Dalle» rientrato rispetto ad «Attivo», «alle» schiacciato tra i due campi — allineare a sinistra e dare spazio uniforme
- [bassa] promemoria__tel-light.png — etichette miste: «Piano del giorno», «Check-in», «Fine giornata» (nomi) e «Ricordami la priorità» (frase all'imperativo) — uniformare («Priorità del giorno»)
- [bassa] promemoria__tel-light.png — «Abitudini con orario» senza campo orario: la riga ha una colonna vuota che rompe l'allineamento — aggiungere testo «all'ora di ognuna»
## promemoria__tel-dark.png
- [media] promemoria__tel-dark.png — stessi problemi del chiaro; banner marrone scuro con icona grigia: buon contrasto testo, ma interruttori spenti grigio su grigio quasi invisibili
## rituale-checkin__tel-light.png
- [media] rituale-checkin__tel-light.png — Check-in segnato «✓ fatto» con valori selezionati, ma il pulsante «Registra +3 XP» è disabilitato e sbiadito senza spiegazione — non si capisce se si può aggiornare il check-in o se è già salvato — sostituire con «Registrato alle 09:00 · Aggiorna» (attivo se cambi un valore)
- [media] rituale-checkin__tel-light.png — «Sonno e pasti · da compilare 0 di 4» mentre La giornata mostra già sonno 23:30→07:30 e 3 pasti — stato incoerente (gli orari abituali non contano come compilati?) — spiegare «da confermare» o contare i dati presenti
- [bassa] rituale-checkin__tel-light.png — etichette di scala «5 · molto concentrato» e «5 · alla grande» più larghe del pulsante 5, allineate a destra e spostate verso il 4; «3 · normale» non centrata sotto il 3 — ancorare ogni etichetta sotto il proprio pulsante o usare solo gli estremi
- [bassa] rituale-checkin__tel-light.png — stato a destra delle righe chiuse su due righe («da fare / 2 di 3», «da compilare / 0 di 4») in testo piccolo grigio, mentre «✓ fatto» è su una riga verde — uniformare (es. «2/3» in pillola)
- [bassa] rituale-checkin__tel-light.png — «Media recente 4,3» — «recente» vago — «Media 7 giorni: 4,3»
## rituale-checkin__tel-dark.png
- [media] rituale-checkin__tel-dark.png — stessi problemi del chiaro; il pulsante «Registra» disabilitato grigio su grigio è quasi invisibile
## rituale-piano__tel-light.png
- [media] rituale-piano__tel-light.png — stato «da fare · 2 di 3» — non si capisce cosa siano i 3 passi (2 priorità scelte + orario di inizio?) — esplicitare («2 priorità · manca l'inizio») o mostrare i passi come checklist numerata
- [media] rituale-piano__tel-light.png — pillola «☆ Priorità» viola solo sulla prima voce (già fatta e barrata) — non è chiaro se sia un'etichetta (questa è LA priorità) o un pulsante per sceglierla; la seconda voce non ce l'ha — rendere la scelta esplicita (stella toccabile su tutte, piena sulla scelta)
- [bassa] rituale-piano__tel-light.png — icone area isolate all'estrema destra (persone rosa, portafoglio giallo) senza nome — scollegate dal titolo; metterle prima del titolo come in Da fare
- [bassa] rituale-piano__tel-light.png — «Quando inizi?» con segnaposto «Es. alle 9:00, alla scrivania» — mescola orario e luogo in un campo libero: è un'intenzione di implementazione ma la domanda non lo dice — «Quando e dove inizi?»
- [bassa] rituale-piano__tel-light.png — «+5 XP» nel pulsante Salva: gli XP non sono spiegati in nessuna parte dell'app
## rituale-piano__tel-dark.png
- [media] rituale-piano__tel-dark.png — stessi problemi del chiaro; pillola «Priorità» viola scuro con testo lilla su riga barrata grigia: poco leggibile
## rituale-sera__tel-light.png
- [media] rituale-sera__tel-light.png — pulsanti di voto 1–5 piccoli, grigi pieni e senza bordo, allineati a destra — completamente diversi dai pulsanti 1–5 grandi con bordo del Check-in nella stessa pagina — stessa interazione (scala 1–5), due componenti — usare lo stesso componente
- [media] rituale-sera__tel-light.png — ogni area occupa due righe (nome sopra, voti sotto a destra) lasciando vuoto il lato sinistro; 8 aree = pagina lunghissima — mettere nome e voti sulla stessa riga o usare voti a piena larghezza
- [bassa] rituale-sera__tel-light.png — icona di «Piano del giorno» in viola pieno mentre tutte le altre icone di rituale sono lilla chiaro, anche quando aperto è un altro rituale — evidenziazione senza significato (è il prossimo? il consigliato?) — togliere o spiegare
- [bassa] rituale-sera__tel-light.png — nome «Fine giornata» qui, mentre l'indice degli screenshot/altre parti lo chiamano «Review della sera» — verificare che il nome sia uno solo in tutta l'app (inglese «Review» da evitare)
- [bassa] rituale-sera__tel-light.png — legenda «1 = male · 5 = benissimo» rientrata di 4px rispetto alla domanda — allineare
## rituale-sera__tel-dark.png
- [media] rituale-sera__tel-dark.png — stessi problemi del chiaro; pulsanti di voto grigio scuro su grigio scuro con numeri grigi: contrasto basso, sembrano disabilitati
## rituale-settimana__tel-light.png
- [alta] rituale-settimana__tel-light.png — statistiche «10 attività fatte · 6/7 giorni attivi» mentre la vista Settimana (17–23 ago) dice «4 di 24 fatte questa settimana» ed è martedì (solo 2 giorni trascorsi) — i numeri si riferiscono evidentemente agli ultimi 7 giorni, ma la scheda dice «settimana» — dichiarare il periodo («ultimi 7 giorni, 12–18 ago») o allineare i conteggi alla settimana di calendario
- [media] rituale-settimana__tel-light.png — tre statistiche ammassate a sinistra con spaziatura irregolare (216 / 10 / 6/7) e metà destra vuota — distribuirle su tre colonne uguali come nel Profilo
- [bassa] rituale-settimana__tel-light.png — campi di testo vuoti senza segnaposto né conteggio, solo blocchi grigi — aggiungere un esempio («Es. sono riuscito a…») per invogliare la scrittura
- [bassa] rituale-settimana__tel-light.png — «216 XP guadagnati» — XP non spiegati altrove
## rituale-settimana__tel-dark.png
- [alta] rituale-settimana__tel-dark.png — stessa incoerenza di conteggi della settimana
- [bassa] rituale-settimana__tel-dark.png — etichette delle domande grigio medio su grigio scuro: contrasto al limite
## rituale-sonno-pasti__tel-light.png
- [media] rituale-sonno-pasti__tel-light.png — alle 10:30 il rituale chiede se si è fatto pranzo (13:00) e cena (20:00) senza dire a quale giorno si riferiscono i pasti (oggi? ieri?) — indicare «Pasti di ieri» o mostrare solo i pasti già passati
- [media] rituale-sonno-pasti__tel-light.png — orari «23:30 🕒» e «07:30 🕒» come testo nudo con iconcina: non sembrano campi modificabili; è il terzo stile di campo orario (dopo campo con bordo nel pannello sonno e pillola lilla nelle schede) — usare un unico componente orario
- [media] rituale-sonno-pasti__tel-light.png — «Come sempre · 23:30–07:30» in viola a destra di «Sonno»: non si capisce se è un'informazione o un pulsante che conferma gli orari — renderlo un pulsante esplicito «✓ Come sempre (23:30–07:30)»; lo stesso per «Non ricordo», link isolato sotto la lista
- [bassa] rituale-sonno-pasti__tel-light.png — pulsanti «sì / no / 🕒»: il terzo è solo un'icona orologio senza testo — «altro orario»; nessuno stato selezionato visibile per capire il risultato
- [bassa] rituale-sonno-pasti__tel-light.png — «Altre cose fatte» dentro «Sonno e pasti» — fuori contesto — spostarlo nel Check-in o in Fine giornata
## rituale-sonno-pasti__tel-dark.png
- [media] rituale-sonno-pasti__tel-dark.png — stessi problemi del chiaro; pulsanti sì/no grigio scuro su fondo scuro con poco contrasto
## rituali__tel-light.png
- [media] rituali__tel-light.png — nessuna indicazione di quando va fatto ciascun rituale (mattina, sera, domenica): «Fine giornata» e «Bilancio della settimana» risultano «da fare» alle 10:30 di martedì con lo stesso peso del Piano del giorno — mostrare l'orario/momento previsto («stasera», «domenica») e attenuare quelli non ancora dovuti
- [bassa] rituali__tel-light.png — solo l'icona di «Piano del giorno» è viola piena: evidenziazione non spiegata — se è il rituale «adesso», scriverlo («Ora»)
- [bassa] rituali__tel-light.png — stati con formati diversi: «da fare / 2 di 3», «da compilare / 0 di 4», «✓ fatto», «da fare» — uniformare (stesso verbo, stesso formato numerico)
- [bassa] rituali__tel-light.png — oltre metà schermo vuota sotto la lista — accettabile, ma si potrebbe mostrare la prossima scadenza o una breve spiegazione dei rituali
## rituali__tel-dark.png
- [bassa] rituali__tel-dark.png — stessi problemi del chiaro; nessun difetto specifico del tema
## scheda-abitudine__tel-light.png
- [media] scheda-abitudine__tel-light.png — calendario storico senza nome del mese e con i giorni di luglio (27–31) nello stesso stile di quelli di agosto — non si capisce che periodo si stia guardando — aggiungere «Luglio – Agosto» o etichetta mese all'inizio di ogni mese, attenuare i giorni dell'altro mese
- [media] scheda-abitudine__tel-light.png — riga «Ora 18:00 ×»: la ✕ qui sta FUORI dalla pillola, mentre nella scheda dal calendario sta DENTRO — stesso controllo, due layout; inoltre «18:00» nero e «45 min» viola — uniformare
- [bassa] scheda-abitudine__tel-light.png — chip area «Salute & Sport» verde con bordo, diverso dalla pillola lilla usata per l'area nelle altre schede — un solo componente «area»
- [bassa] scheda-abitudine__tel-light.png — giorni non previsti (sab/dom) in grigio chiaro senza cerchio e giorni previsti mancati (12, 4, 5) in cerchio grigio: la differenza c'è ma è sottile e non c'è legenda — aggiungere legenda «fatto / mancato / non previsto»
- [bassa] scheda-abitudine__tel-light.png — «4 record» — etichetta ambigua — «record: 4 di fila»
## scheda-abitudine__tel-dark.png
- [media] scheda-abitudine__tel-dark.png — stessi problemi del chiaro; i cerchi «S» e «D» non selezionati sono neri su scheda grigio scuro, quasi invisibili; la pillola «18:00» grigia non sembra modificabile accanto a «45 min» viola
## scheda-abitudine-fondo__tel-light.png
- [media] scheda-abitudine-fondo__tel-light.png — nella stessa scheda l'area appare due volte con due stili diversi: chip verde in testa, pillola lilla in «Dettagli» — uniformare
- [media] scheda-abitudine-fondo__tel-light.png — in fondo solo «Elimina», mentre la scheda aperta dal calendario offre «Termina l'abitudine» — due azioni diverse (eliminare lo storico vs smettere da oggi) presentate in posti diversi — offrire entrambe qui, con «Termina» prima e «Elimina (cancella lo storico)» sotto con conferma
- [bassa] scheda-abitudine-fondo__tel-light.png — «Inizio 29 lug 2026» e «Fine Mai» in testo semplice senza pillola: non è chiaro se siano modificabili, a differenza di Ora/Durata/Area — stesso stile di valore modificabile
- [bassa] scheda-abitudine-fondo__tel-light.png — pulsante «Elimina» rosso su fondo grigio a piena larghezza — ok, ma la scheda finisce senza margine inferiore di sicurezza (bordo arrotondato del foglio tagliato a 4px) — aggiungere padding inferiore/safe-area
## scheda-abitudine-fondo__tel-dark.png
- [media] scheda-abitudine-fondo__tel-dark.png — stessi problemi del chiaro; cerchi S/D quasi invisibili
## scheda-attivita__tel-light.png
- [media] scheda-attivita__tel-light.png — chip «Pianifica» (grigi su bianco, Maiuscola: «Domani», «Giovedì») e chip «Distribuisci i passi» (bianchi su grigio, minuscola: «ogni giorno») — due varianti di chip invertite e con maiuscole incoerenti nella stessa scheda — un solo stile di chip e un'unica regola di maiuscole
- [media] scheda-attivita__tel-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» senza spiegazione e senza stato selezionato — non si capisce cosa succede toccandoli (crea date per i passi?) né se ne è già attivo uno — aggiungere riga di aiuto e stato selezionato
- [bassa] scheda-attivita__tel-light.png — ogni passo ha icona calendario + cestino piccoli affiancati (≈16px) — bersagli piccoli e cestino sempre visibile — usare swipe o menù «…»
- [bassa] scheda-attivita__tel-light.png — «Aggiungi il prossimo passo a Oggi» come pulsante primario, ma «Pianifica» non offre «Oggi» per l'intera attività: la relazione attività/passo non è chiara — sottotitolo «Prossimo passo: Recuperare modulo 1»
- [bassa] scheda-attivita__tel-light.png — «Passi 1 di 3» in badge grigio: ok, ma in lista Da fare lo stesso dato appare come «1 di 3» senza parola «passi» — uniformare
## scheda-attivita__tel-dark.png
- [media] scheda-attivita__tel-dark.png — stessi problemi del chiaro; cerchi dei passi non fatti neri pieni su grigio: sembrano «pieni» e non vuoti — usare solo il bordo
## scheda-attivita-fondo__tel-light.png
- [media] scheda-attivita-fondo__tel-light.png — «Area · Studio / Università ⌄» è testo grigio con triangolino da select nativa — quarto stile diverso per il selettore d'area (pillola lilla nelle schede dal calendario, chip in Da sistemare, chip con bordo in aggiunta) — unificare
- [media] scheda-attivita-fondo__tel-light.png — terminologia incoerente per lo stesso concetto: «Fissa in alto» qui, sezione «Importanti» nella lista, «☆ Priorità» nel Piano del giorno e nel Diario — scegliere un solo termine («Importante») e usarlo ovunque
- [media] scheda-attivita-fondo__tel-light.png — «Non ce l'ho fatta ›» — non dice cosa fa (la archivia? la segna come fallita? la rimanda?) — etichetta d'azione esplicita («Lascia perdere» / «Archivia senza completare») con sottotitolo
- [bassa] scheda-attivita-fondo__tel-light.png — intestazione fissa con titolo su due righe in 26px: occupa ~80px mentre si scorre e taglia il cerchio del passo sopra — ridurre il titolo a una riga troncata quando si scorre
- [bassa] scheda-attivita-fondo__tel-light.png — interruttore «Fissa in alto» spento a basso contrasto (pomello bianco su grigio chiaro)
## scheda-attivita-fondo__tel-dark.png
- [media] scheda-attivita-fondo__tel-dark.png — stessi problemi del chiaro; interruttore spento grigio su grigio quasi invisibile
## scheda-scoperta__tel-light.png
- [media] scheda-scoperta__tel-light.png — opzioni «Quanto ne sei sicuro»: «notato una volta» (participio), «lo noto ogni volta» (presente con pronome), «misurato» (participio) — forme grammaticali miste e livelli non ordinati visivamente (il terzo va a capo da solo) — «L'ho notato una volta / Lo noto sempre / L'ho misurato», in un segmentato a 3 colonne su una riga
- [media] scheda-scoperta__tel-light.png — «Esito: funziona / non funziona» sepolto sotto «Dettagli» pur essendo l'informazione principale della scoperta — spostarlo subito sotto il testo
- [bassa] scheda-scoperta__tel-light.png — titolo del foglio «Una cosa che hai capito» mentre la sezione si chiama «Scoperte» — titolo «Scoperta» con la domanda come etichetta del campo
- [bassa] scheda-scoperta__tel-light.png — «Area · Studio / Università ⌄» select nativa testuale (stesso problema di coerenza del selettore area); «Aggiunta 20 lug» senza anno mentre altrove «29 lug 2026»
- [bassa] scheda-scoperta__tel-light.png — pulsante non selezionato «non funziona» bianco su grigio in light, ma nero su grigio in dark: aspetti molto diversi tra temi
## scheda-scoperta__tel-dark.png
- [media] scheda-scoperta__tel-dark.png — stessi problemi del chiaro; «non funziona» nero pieno sembra uno stato attivo scuro, si confonde con un pulsante premuto
## scoperte__tel-light.png
- [media] scoperte__tel-light.png — titoli che vanno a capo a ~160px («Mettere il telefono / in un'altra stanza», «Camminare venti / minuti dopo pranzo») pur avendo ~100px liberi prima del chevron — larghezza massima artificiale del testo — lasciare il titolo a tutta larghezza
- [bassa] scoperte__tel-light.png — riquadri grandi con pollice su/giù su ogni riga ripetono l'informazione già data dall'intestazione «Funziona / Non funziona» e rubano 56px di larghezza — usare un'icona piccola o niente
- [bassa] scoperte__tel-light.png — badge dei sotto‑segmenti «Registro 8», «Esperimenti 2» inline accanto al testo, mentre in Attività gli stessi badge stanno nell'angolo del segmento — uniformare (questa versione è migliore)
- [bassa] scoperte__tel-light.png — icona «pollice su» usata sia per «Scoperte» (segmento principale) sia per «Registro» (sotto‑segmento) sia per «Funziona» — un'icona per tre significati — differenziare (es. lampadina per Scoperte, elenco per Registro)
## scoperte__tel-dark.png
- [media] scoperte__tel-dark.png — stessi problemi del chiaro; i riquadri pollice verde/rosso scuri hanno contrasto basso dell'icona
## scoperte-esperimenti__tel-light.png
- [alta] scoperte-esperimenti__tel-light.png — grafico: le etichette «media 3,1» e «media 4,3» sono disegnate sopra i punti e sulla linea tratteggiata, con i pallini che attraversano il testo — illeggibili — spostare le etichette fuori dall'area dei dati (a destra della linea o sopra con fondo bianco/alone)
- [media] scoperte-esperimenti__tel-light.png — grafico senza asse X (date/giorni) e con asse Y solo 1‑3‑5 — non si capisce quanto sono durate le due fasi — aggiungere date di inizio/fine fase sotto l'asse
- [media] scoperte-esperimenti__tel-light.png — pillole «⚑ concluso» e «Focus (da check-in, 1–5)» con bordo, identiche a pulsanti — sembrano toccabili ma sono etichette di stato/metrica — renderle badge senza bordo, «concluso» in verde/grigio
- [bassa] scoperte-esperimenti__tel-light.png — paragrafo introduttivo sul metodo sempre visibile in cima, sopra «Nuovo esperimento» — utile la prima volta, ingombrante dopo — renderlo comprimibile («Come funziona?»)
- [bassa] scoperte-esperimenti__tel-light.png — «La modifica: Allenamento o camminata…» — maiuscola dopo i due punti e tono da modulo — «Cosa hai cambiato: allenamento…»
## scoperte-esperimenti__tel-dark.png
- [alta] scoperte-esperimenti__tel-dark.png — stesse etichette di media sovrapposte ai punti; in scuro il testo bianco sopra i pallini blu è ancora meno leggibile
- [bassa] scoperte-esperimenti__tel-dark.png — linee della griglia del grafico quasi invisibili su fondo scuro
## sonno-pasti__tel-light.png
- [media] sonno-pasti__tel-light.png — stessi dati (orari pasti, durata) modificati qui con pillole lilla e rimozione «×», ma nel pannello sonno de La giornata con campi bordati, select nativa e cestino — due componenti per la stessa cosa — riusare lo stesso componente in entrambi i posti
- [media] sonno-pasti__tel-light.png — «Promemoria nell'app · Sonno · Dalle 05:00 alle 14:00» — non si capisce cosa ricordi (di registrare il sonno?) né perché una fascia di 9 ore — sottotitolo esplicativo («Ti chiediamo come hai dormito tra le 05:00 e le 14:00»)
- [bassa] sonno-pasti__tel-light.png — orari in nero e durate in viola nelle pillole identiche — colori del testo incoerenti per valori dello stesso tipo
- [bassa] sonno-pasti__tel-light.png — «Durata 8h» (senza spazio) vs «45 min», «1 h 30» altrove — formato unico delle durate
- [bassa] sonno-pasti__tel-light.png — «Dalle» rientrato e «alle» schiacciato (stesso schema di Promemoria)
## sonno-pasti__tel-dark.png
- [media] sonno-pasti__tel-dark.png — stessi problemi del chiaro; pillole orario grigio scuro e pillole durata viola scuro: la differenza di colore sembra indicare stati diversi (modificabile/non modificabile)
## timer-concentrazione__tel-light.png
- [media] timer-concentrazione__tel-light.png — in tema chiaro lo schermo di concentrazione è nero ma il pulsante «Pausa» resta lilla chiarissimo (colore del tema chiaro): un blocco quasi bianco che abbaglia su fondo nero e non coincide con la versione scura — se lo schermo è sempre scuro, usare sempre i colori del tema scuro
- [media] timer-concentrazione__tel-light.png — due pulsanti grandi impilati di peso quasi uguale («Pausa» e «Fatto» verde): durante la concentrazione il tocco più probabile è pausa, ma il verde attira di più e «Fatto» chiude la sessione — affiancarli o ridurre «Fatto» a secondario
- [bassa] timer-concentrazione__tel-light.png — «Termina sessione» usa la stessa icona calendario‑con‑✕ di «Termina l'abitudine» — semantica sbagliata (non si termina un calendario) — icona stop ■
- [bassa] timer-concentrazione__tel-light.png — anello di avanzamento a forma di squircle completamente grigio a 25:00: senza un segno di inizio non si capisce che è un indicatore di progresso — mostrare un punto/arco iniziale
- [bassa] timer-concentrazione__tel-light.png — «25:00 / restano» — «restano» sotto il numero è poco naturale — «rimanenti» o «mancano 25:00»
- [bassa] timer-concentrazione__tel-light.png — ✕ in alto a destra senza spiegazione: chiude il timer o lo riduce lasciandolo in corso? — «Riduci» con icona ⌄ se continua in background
## timer-concentrazione__tel-dark.png
- [bassa] timer-concentrazione__tel-dark.png — «Pausa» viola scuro con testo lilla: va bene; stessi problemi di gerarchia Pausa/Fatto, icona «Termina sessione» e «restano»
## timer-scelta__tel-light.png
- [media] timer-scelta__tel-light.png — foglio «Timer»: quattro opzioni senza una riga che spieghi la differenza (Avvio rapido vs Sessione) — aggiungere sottotitolo per ciascuna («5 min per rompere il ghiaccio, poi continui se vuoi»)
- [bassa] timer-scelta__tel-light.png — icona di «Pomodoro» ↻ uguale all'icona usata per «Abitudine» in tutta l'app — conflitto semantico — usare un'icona diversa (pomodoro/ciclo con pausa)
- [bassa] timer-scelta__tel-light.png — oscuramento dello sfondo debole: il pulsante verde «Fatto» resta molto saturo dietro il foglio e distrae — scrim più scuro
- [bassa] timer-scelta__tel-light.png — riquadri icona bianchi con bordo grigio, stile diverso dai riquadri icona lilla dei Rituali e dai riquadri colorati delle Aree — uniformare il «tile icona»
## timer-scelta__tel-dark.png
- [bassa] timer-scelta__tel-dark.png — stessi problemi del chiaro; riquadri icona neri con bordo grigio su riga grigio scura: poco distinti
## trascinamento-in-corso__tel-light.png
- [media] trascinamento-in-corso__tel-light.png — l'anteprima di destinazione «12:45–14:15» si sovrappone completamente al blocco «Pranzo» senza alcun avviso di conflitto — evidenziare la sovrapposizione (bordo arancione, «si sovrappone a Pranzo») o affiancare i blocchi
- [media] trascinamento-in-corso__tel-light.png — l'elemento trascinato («Organizzare cena… alle 12:45») galleggia all'altezza delle 11:30–12:15, mentre l'anteprima parte dalle 12:45: lo scarto verticale tra dito/fantasma e slot reale confonde — allineare il fantasma all'inizio dello slot o nascondere uno dei due
- [bassa] trascinamento-in-corso__tel-light.png — si sta trascinando un'attività già completata (barrata): spostare nel tempo una cosa fatta ha poco senso — impedirlo o chiedere conferma
- [bassa] trascinamento-in-corso__tel-light.png — zona «Togli l'orario» tratteggiata copre il blocco delle 15:00 e la fine del calendario — ok come zona di rilascio, ma potrebbe stare sopra la tab bar con fondo opaco e ombra per non sembrare parte della griglia

## Riassunto

Ho guardato tutti gli 87 screenshot (43 coppie chiaro/scuro e il trascinamento). Non ci sono rotture gravi di layout: niente sovrapposizioni che bloccano l'uso e niente testo fuori dallo schermo. Restano però molte incoerenze tra i componenti, numeri che non tornano tra una schermata e l'altra, e diversi punti in cui non si capisce cosa fa un controllo.

### 1. Dati e numeri incoerenti tra schermate (alta/media)
- [alta] Andamento: «38 giorni di fila» ma nella fila della settimana il venerdì è vuoto (andamento chiaro/scuro).
- [alta] Bilancio della settimana: «10 attività fatte · 6/7 giorni attivi» contro «4 di 24 fatte questa settimana» nella vista Settimana, ed è martedì (rituale-settimana).
- [media] Agosto ha «18 giorni attivi» nella vista Mese e «17» nella vista Anno (giornata-mese / giornata-anno).
- [media] Oggi › Adesso dice «1 di 2 fatte», Abitudini dice «0 di 3 oggi» (attivita-abitudini).
- [media] «Sonno e pasti: da compilare 0 di 4» mentre La giornata mostra già sonno e 3 pasti (rituale-checkin).
- [media] «Organizzare cena con il gruppo» compare barrata sia lunedì 17 sia martedì 18 (giornata-settimana).
- [bassa] «109 attività fatte in tutto» nel Profilo contro «82» nella vista Anno 2026, che mostra dati solo da giugno.
- [bassa] Gli XP compaiono in Anno, nel Piano e nel Bilancio ma non sono mai spiegati.

### 2. Stati e azioni ambigui (alta/media)
- [alta] Il primo «+ Oggi» in Da fare è viola pieno, gli altri sono chiari: non si capisce se l'attività è già in Oggi (attivita-dafare).
- [alta] Nel Diario c'è una select modificabile dell'area dentro una voce del registro, e la parola «Priorità» va a capo da sola (diario).
- [media] La scheda di un'attività completata non dice che è fatta: c'è solo «Segna come non fatta» (giornata-scheda-blocco).
- [media] Check-in «fatto» ma il pulsante «Registra» è disabilitato senza spiegazione (rituale-checkin).
- [media] Le modifiche a Ora/Durata/Area dalla scheda dal calendario: non è chiaro se valgono solo oggi o per sempre (giornata-scheda-abitudine).
- [media] Le cose non fatte di un giorno passato hanno lo stesso aspetto delle cose ancora da fare (giornata-settimana).
- [media] Etichette poco chiare:
  - «Non ce l'ho fatta», «Rimanda a domani l'attività rimasta», «Se prosegui, altri», «Pausa lunga: Nessuna», «Promemoria · bloccati», «Come sempre · 23:30–07:30» e «Non ricordo»;
  - gli interruttori delle Aree senza etichetta;
  - i pasti chiesti alle 10:30 senza dire di che giorno sono.
- [media] «Rimuovi dati di esempio» c'è, ma nell'app nessun segnale dice che i dati mostrati sono di esempio.
- [media] La pagina Profilo (anche quando la si apre dall'avatar) non ha titolo, né indietro, né una tab attiva. Il Diario si apre con «Andamento» evidenziato ma il link di ritorno è «‹ Profilo».
- [media] Elementi distruttivi vicini ad azioni comuni:
  - cestino piccolo accanto all'interruttore nelle Aree;
  - «Termina l'abitudine» in mezzo ad altre azioni;
  - la scheda dell'abitudine offre solo «Elimina», mentre dal calendario si può «Terminare».

### 3. Componenti incoerenti per la stessa funzione (media)
- Selettore dell'area: almeno 5 stili diversi (pillola lilla, chip grigio pieno, chip con bordo, chip verde, testo con ▾ nativo), a volte due stili nella stessa scheda (scheda-abitudine).
- Campo orario e durata: pillola lilla con ✕ dentro, pillola con ✕ fuori, campo con bordo più select nativa, testo con 🕒. Gli orari sono neri e le durate viola. I formati delle durate sono «8h», «45 min» e «1 h 30».
- Completamento: cerchio in Abitudini e Adesso, quadrato in «Senza orario» e nella sezione Oggi del Mese.
- Scala 1–5: pulsanti grandi con bordo nel Check-in, quadratini grigi in Fine giornata.
- Nuova attività (chip) e nuova abitudine (righe dentro una scheda) usano due pannelli di opzioni diversi.
- Badge numerici: nell'angolo del segmento in Attività, accanto al testo in Scoperte, tondo viola nella tab bar.
- Chip «Pianifica» e «Distribuisci» con colori invertiti e maiuscole diverse. Valori in Impostazioni con maiuscole miste.
- Lo stesso concetto ha tre nomi: «Importante», «Priorità» e «Fissa in alto». Lo stesso vale per i nomi dei rituali: «Fine giornata» contro «Review della sera».
- Icone usate con più significati: ↻ vuol dire sia Abitudine sia Pomodoro; il pollice vale per Scoperte, Registro e Funziona; il calendario con ✕ vale sia per «Termina sessione» sia per «Termina abitudine». «Salta oggi» ha icona ✕ in un posto e ⏭ in un altro.
- Select nativa non stilizzata: «Area predefinita» nelle Impostazioni e l'area nelle schede attività e scoperta.

### 4. Grafici e numeri senza etichetta (media)
- [alta] Esperimenti: le etichette «media 3,1» e «media 4,3» sono sovrapposte ai punti e non si leggono. Manca l'asse delle date.
- [media] Heatmap «Costanza» senza assi né periodo, con forma frastagliata e griglia non allineata. In scuro la scala di luminosità è invertita.
- [media] Numeri senza unità:
  - numeri verdi sui mesi della vista Anno; pallini e anelli nella vista Mese senza legenda;
  - «4/8» in Per area; «1 di 3» in Da fare; «🔥 3»; «4 record»; «Backup 1»; «38 giorni» nel chip di Adesso.
- [media] Barre «Per area» nel colore dell'area: il rosso e l'arancione si leggono come allarme.

### 5. Testo e impaginazione (media/bassa)
- Titoli che vanno a capo troppo presto anche con spazio libero: Da fare, Scoperte, Diario, titolo della scheda attività.
- «Inbox a zero…» troncato per far posto a «Sposta». «In coda 5» mostra 4 righe più «e un'altra».
- Nel pannello sonno della giornata le colonne dei campi non sono allineate. Nelle righe «Dalle … alle» i campi sono rientrati o schiacciati.
- Statistiche del Bilancio ammassate a sinistra. Nella scheda serie di Andamento il testo va a capo male.
- Riga «Ora attuale 10:30» sovrapposta al blocco dell'attività. Fascia del sonno senza etichetta.
- Trascinamento: l'anteprima copre «Pranzo» senza avviso, il fantasma è sfalsato rispetto allo slot, e si può trascinare un'attività già fatta.
- Testi poco naturali: «Annotato ·», «fatte: 81 di 124 in 30 giorni», «restano», opzioni di certezza con forme miste, «La modifica: …».

### 6. Contrasto e tema scuro (media/bassa)
- [alta] Musica (chiaro): i campi «Link della playlist» sono quasi invisibili, senza bordo.
- In scuro:
  - segmento selezionato grigio poco distinto (Adesso, Attività, Aspetto, Giornata);
  - interruttori spenti, caselle e cerchi S/D quasi invisibili;
  - pulsanti disabilitati e secondari («Aggiungi», «Registra», «Nessuna», voti 1–5) con poco contrasto;
  - linee della griglia del calendario e dei grafici molto deboli.
- In chiaro:
  - interruttori spenti con binario troppo chiaro;
  - oscuramento dietro i fogli troppo leggero;
  - lo schermo del timer è nero ma il pulsante «Pausa» resta lilla chiarissimo.
- Disabilitato non coerente in Promemoria: le righe sono attenuate ma i campi orario restano attivi, e «Non disturbare» resta attivo con le notifiche bloccate.

Ogni nota per singolo screenshot, con la correzione proposta, è nel file:
/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/rev/giro-5/revisore-tel.md
