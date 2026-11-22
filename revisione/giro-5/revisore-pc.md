# Revisione computer — giro 5

## andamento-fondo__pc-light.png
- [media] andamento-fondo__pc-light.png — card «Costanza» — la griglia della costanza occupa circa un terzo della card (celle ~13px) e lascia ~250px di bianco sotto e ~200px a destra, mentre la card accanto «Per area» è piena: squilibrio evidente a 1280px — allargare le celle per riempire la larghezza (o mostrare più settimane) e allineare l'altezza dei contenuti, oppure dare alla card una colonna più stretta.
- [media] andamento-fondo__pc-light.png — card «Costanza» — la griglia non ha etichette di giorni (L/M/M…) né di mesi né tooltip visibili: impossibile capire quale cella è quale giorno; le prime due righe partono sfalsate senza spiegazione — aggiungere iniziali dei giorni a sinistra e mesi sopra.
- [bassa] andamento-fondo__pc-light.png — legenda «meno … più» — testo ~11px grigio chiaro, contrasto basso — portare a 12px e colore testo secondario più scuro.
- [bassa] andamento-fondo__pc-light.png — riga «Riflessioni passate» — il «79» è un numero senza etichetta, con contrasto basso — scrivere «79 riflessioni» o usare un badge coerente con il contatore di «Attività».
- [bassa] andamento-fondo__pc-light.png — sotto la lista finale — ~100px di vuoto e la lista termina senza margine coerente con le card sopra; accettabile ma la voce «Aree» duplica il titolo della card «Per area» — chiarire («Gestisci aree»).

## andamento__pc-light.png
- [alta] andamento__pc-light.png — card serie in alto — «38 giorni di fila» mentre la striscia dei giorni mostra «V» non fatto: contraddizione apparente — spiegare la regola (es. «1 giorno di riposo consentito») o mostrare il giorno saltato con uno stato «saltato giustificato».
- [media] andamento__pc-light.png — striscia giorni — iniziali «M … M» ambigue (mercoledì/martedì), e l'ordine che parte da mercoledì non è dichiarato — usare abbreviazioni a 3 lettere («mer», «mar») o aggiungere il numero del giorno.
- [media] andamento__pc-light.png — «giorni di fila» — l'etichetta va a capo su due righe accanto al numero pur avendo enorme spazio libero orizzontale — impedire l'a capo (white-space: nowrap).
- [media] andamento__pc-light.png — striscia giorni — i 7 quadrati (36px) sono sparsi su ~800px con gap enormi: componente da telefono stirato — raggrupparli più vicini o mostrare 14/30 giorni sul computer.
- [bassa] andamento__pc-light.png — card «Costanza» — stessa sproporzione del fondo (griglia piccola, vuoto enorme) — vedi andamento-fondo.
- [bassa] andamento__pc-light.png — «Per area» — numeri secondari «4/8» senza unità; percentuale e frazione ridondanti — «4 di 8».

## andamento__pc-dark.png
- [media] andamento__pc-dark.png — card «Costanza» — in scuro la scala è invertita rispetto al chiaro (più attività = azzurro più chiaro) ma le celle vuote (grigio #2a) sono quasi indistinguibili dallo sfondo della card — aumentare il contrasto delle celle vuote (bordo 1px o grigio più chiaro).
- [media] andamento__pc-dark.png — segmented control «Riepilogo/Scoperte» — la scheda attiva è solo un grigio leggermente più chiaro, poco riconoscibile — usare lo stesso accento viola del menu laterale o un contrasto maggiore.
- [bassa] andamento__pc-dark.png — avatar «R» in alto a destra — cerchio scuro su sfondo scuro, si legge appena come pulsante — aggiungere bordo o tinta d'accento.
- [bassa] andamento__pc-dark.png — gli stessi difetti del chiaro (serie 38 con «V» vuoto, «giorni di / fila» a capo, iniziali M/M ambigue, vuoto sotto la griglia).

## aree__pc-light.png
- [media] aree__pc-light.png — righe delle aree — il cestino è a 30px dall'interruttore: azione distruttiva attaccata a un comando frequente, rischio di clic sbagliato; inoltre l'interruttore non ha etichetta (attiva? visibile?) — spostare «Elimina» in un menu «…» o in modalità modifica e dare un'intestazione/aiuto «Attiva».
- [bassa] aree__pc-light.png — nomi delle aree — il testo è 2px sopra il centro verticale dell'icona e dell'interruttore — centrare con align-items:center/line-height.
- [bassa] aree__pc-light.png — «Nuova area» — l'icona libro grigia nel campo sembra un'icona già scelta ma non è cliccabile come selettore — renderla un selettore di icona/colore evidente o rimuoverla; «Aggiungi» attivo con campo vuoto (dovrebbe essere disabilitato).
- [bassa] aree__pc-light.png — finestra — manca un modo per riordinare le aree (ordine diverso da «Per area» in Andamento) — aggiungere maniglie di trascinamento.

## aree__pc-dark.png
- [bassa] aree__pc-dark.png — icone cestino — grigio medio piccolo (12px) su #2a: poco visibili, ma ancora attaccate all'interruttore (vedi chiaro) — stesso intervento.
- [bassa] aree__pc-dark.png — velo dietro la finestra — quasi nero pieno: la pagina sotto sparisce del tutto, mentre in chiaro resta leggibile; incoerente tra temi — ridurre l'opacità del velo in scuro (~60%).

## attivita-abitudini-nuova__pc-light.png
- [media] attivita-abitudini-nuova__pc-light.png — selettore giorni — 7 cerchi da 44px distribuiti su ~860px con gap di ~90px: componente da telefono stirato, difficile leggerlo come gruppo — raggruppare i giorni a sinistra con gap 8px (o usare un segmented control compatto).
- [media] attivita-abitudini-nuova__pc-light.png — pannello opzioni — è staccato dal campo «Meditare» (12px di vuoto, bordo diverso) e non ha un «Annulla»: non è chiaro che appartiene al campo né come chiuderlo — unire campo e opzioni in un'unica card con bordo d'accento e aggiungere «Annulla»/Esc.
- [media] attivita-abitudini-nuova__pc-light.png — «Area: Salute & Sport» — l'area risulta preselezionata (in viola, come se scelta) senza che l'utente l'abbia indicata; «Ora: Nessuna» invece è grigio: stati incoerenti — mostrare l'area suggerita come «Suggerita: Salute & Sport» o lasciarla vuota.
- [media] attivita-abitudini-nuova__pc-light.png — riepilogo «0 di 3 oggi» — l'anello di avanzamento vuoto è un cerchio grigio chiarissimo quasi invisibile e il blocco è disallineato rispetto alle card (rientra di 6px) — dare un colore alla traccia e allineare al bordo sinistro delle card.
- [bassa] attivita-abitudini-nuova__pc-light.png — cerchi di spunta — colori diversi (verde, verde, blu) senza legenda: sono il colore dell'area ma sembrano stati diversi — usare un colore neutro per la spunta e il colore dell'area solo sull'etichetta.
- [bassa] attivita-abitudini-nuova__pc-light.png — «🔥 3» — numero senza etichetta, solo sulla prima abitudine — tooltip/testo «3 giorni di fila».
- [bassa] attivita-abitudini-nuova__pc-light.png — barra schede in alto — la barra è a y≈37 mentre in Andamento è a y≈51: l'intestazione salta passando da una sezione all'altra — uniformare il margine superiore.

## attivita-abitudini-nuova__pc-dark.png
- [media] attivita-abitudini-nuova__pc-dark.png — scheda attiva «Abitudini» — grigio medio pieno (#555) con testo bianco: stacca più del necessario e non usa l'accento come il menu laterale; in chiaro invece è bianco — uniformare lo stile della scheda attiva fra i temi.
- [bassa] attivita-abitudini-nuova__pc-dark.png — «Ora: Nessuna» — pulsante grigio scuro su card grigio scuro, contrasto basso (sembra disabilitato) — bordo 1px o testo più chiaro.
- [bassa] attivita-abitudini-nuova__pc-dark.png — la pagina è scorsa di ~14px (barra schede tagliata più in alto che in abitudini normale) pur con il contenuto che sta nello schermo: scatto involontario all'apertura delle opzioni — evitare scrollIntoView quando il pannello è già visibile.
- [bassa] attivita-abitudini-nuova__pc-dark.png — stessi difetti del chiaro (giorni sparsi, pannello staccato, area preselezionata).

## attivita-abitudini__pc-light.png
- [media] attivita-abitudini__pc-light.png — metà inferiore — oltre 300px vuoti sotto 3 abitudini: a 1280px la colonna unica centrata spreca spazio — su computer affiancare un pannello (es. calendario settimanale delle abitudini o dettaglio dell'abitudine selezionata).
- [media] attivita-abitudini__pc-light.png — badge «Attività 6» nel menu vs «Da fare 9» e «Abitudini 3» — non è chiaro cosa conti il 6 (coincide con «Da sistemare») — aggiungere tooltip «6 da sistemare» o usare lo stesso badge sulla scheda.
- [bassa] attivita-abitudini__pc-light.png — «+ Aggiungi» — appare attivo con il campo vuoto — disabilitarlo finché non si scrive.
- [bassa] attivita-abitudini__pc-light.png — anello «0 di 3» — traccia grigia quasi invisibile (vedi nuova abitudine).

## attivita-abitudini__pc-dark.png
- [bassa] attivita-abitudini__pc-dark.png — sotto la scheda attiva «Abitudini» — si vede un'ombra scura sfocata che sborda sotto la barra (y≈100), sembra una macchia — ridurre/eliminare l'ombra della scheda attiva in tema scuro.
- [bassa] attivita-abitudini__pc-dark.png — stessi difetti del chiaro (vuoto sotto, scheda attiva grigia poco coerente, «Aggiungi» attivo a campo vuoto).

## attivita-dafare-aggiunta__pc-light.png
- [media] attivita-dafare-aggiunta__pc-light.png — riga opzioni — «Altro / Esplorazione» è un select nativo (freccia di sistema, altezza 44px) accanto a chip da 34px: controllo nativo non stilizzato e altezze incoerenti — usare lo stesso chip con menu personalizzato.
- [media] attivita-dafare-aggiunta__pc-light.png — riga opzioni — le chip sono rientrate di 12px rispetto al campo e non c'è etichetta (quando? area?) né «Annulla»; non è chiaro che appartengano al campo in scrittura — racchiuderle nella stessa card del campo, con etichette «Quando» / «Area».
- [media] attivita-dafare-aggiunta__pc-light.png — «+ Oggi» della prima riga — pieno viola mentre gli altri sono tenui: sembra uno stato diverso (o un hover rimasto) senza motivo — uniformare, e se è hover renderlo più leggero.
- [media] attivita-dafare-aggiunta__pc-light.png — «1 di 3», «1 di 4» — numeri senza etichetta — «1 di 3 passi» o icona checklist.
- [bassa] attivita-dafare-aggiunta__pc-light.png — filtro «Tutte» — attaccato all'etichetta «Importanti 3» (8px) mentre sopra ha 24px: spaziatura incoerente — 16px sotto il filtro, e allinearlo sulla stessa riga delle chip o a destra dell'intestazione.
- [bassa] attivita-dafare-aggiunta__pc-light.png — area predefinita «Altro / Esplorazione» per «Comprare il pane» — il default sembra una scelta già fatta — mostrare «Nessuna area» o «Area» come segnaposto.
- [bassa] attivita-dafare-aggiunta__pc-light.png — icone area prima del titolo — 12px colorate senza testo, l'area non è leggibile — tooltip o nome area in piccolo come nelle abitudini.

## attivita-dafare-aggiunta__pc-dark.png
- [media] attivita-dafare-aggiunta__pc-dark.png — chip «Oggi»/«Domani» — grigio scuro con bordo appena visibile, quasi uguali al select accanto; la chip selezionata «Senza data» è chiara ma le altre sembrano disabilitate — bordo più chiaro (#444) per le non selezionate.
- [bassa] attivita-dafare-aggiunta__pc-dark.png — stessi difetti del chiaro (select nativo, «+ Oggi» pieno solo sulla prima riga, numeri «1 di 3» senza etichetta).

## attivita-dafare__pc-light.png
- [alta] attivita-dafare__pc-light.png — righe delle attività — nessuna casella di completamento: in una lista «Da fare» l'unica azione visibile è «+ Oggi», non si capisce come segnare un'attività come fatta — aggiungere un cerchio/checkbox a sinistra come nelle abitudini.
- [media] attivita-dafare__pc-light.png — «+ Oggi» della prima riga — pieno viola anche senza cursore sopra; nessuna spiegazione (consigliata? hover bloccato?) — se è un suggerimento, etichettarlo («Consigliata»), altrimenti uniformare.
- [media] attivita-dafare__pc-light.png — titoli — tutti in semibold 17px: la lista è pesante e «Importanti» vs «Altre» non si distinguono per gerarchia (le intestazioni di gruppo sono 13px grigio, più deboli delle righe) — titoli riga in regular/medium, intestazioni di gruppo più marcate.
- [bassa] attivita-dafare__pc-light.png — filtro «Tutte» — attaccato a «Importanti» (8px) — vedi aggiunta.
- [bassa] attivita-dafare__pc-light.png — lo spazio a 1280px è usato da una sola colonna di 880px: per una lista lunga si potrebbe mostrare un pannello di dettaglio a destra al clic.

## attivita-dafare__pc-dark.png
- [bassa] attivita-dafare__pc-dark.png — pulsante «Aggiungi» nel campo vuoto — viola scuro su grigio, sembra disabilitato ma è cliccabile (ambiguo) — disabilitarlo davvero a campo vuoto con stile coerente.
- [bassa] attivita-dafare__pc-dark.png — stessi difetti del chiaro (nessuna casella di completamento, «+ Oggi» pieno solo sulla prima riga, scheda attiva grigia).

## attivita-sistemare__pc-light.png
- [media] attivita-sistemare__pc-light.png — selettore area «Altro / Esplorazione» — pillola grigia piena con freccia, mentre in «Da fare» lo stesso selettore è bianco con bordo e più alto: stesso controllo, due stili — un unico componente «selettore area».
- [media] attivita-sistemare__pc-light.png — elenco «In coda» — righe di testo grigio senza card, senza hover né affordance: non si capisce se siano cliccabili o se si possa riordinare — dare righe con hover e cursore, o dichiararle come anteprima («Prossime»).
- [media] attivita-sistemare__pc-light.png — azioni «Oggi / Da fare / Scarta» — su computer mancano le scorciatoie da tastiera (smistamento rapido) e non sono indicate — aggiungere tasti (es. O, F, Canc) con suggerimento sul pulsante come per «Aggiungi una nota [C]».
- [bassa] attivita-sistemare__pc-light.png — intestazione «Da sistemare» sotto la barra — ripete l'etichetta della scheda appena selezionata — sostituire con «1 di 6» o rimuovere.
- [bassa] attivita-sistemare__pc-light.png — «e un'altra» in corsivo grigio — formulazione colloquiale e poco chiara — «+1 altra» o «e altre 1» → meglio «Altre 1 in coda» oppure mostrarla.
- [bassa] attivita-sistemare__pc-light.png — oltre 300px vuoti sotto — lo spazio potrebbe ospitare l'anteprima della coda come card o un aiuto sulle scorciatoie.

## attivita-sistemare__pc-dark.png
- [bassa] attivita-sistemare__pc-dark.png — «Da fare» e «Scarta» — pulsanti grigio scuro con bordo tenue, «Scarta» in rosa chiaro: gerarchia corretta ma i due secondari si confondono con lo sfondo — bordo più chiaro.
- [bassa] attivita-sistemare__pc-dark.png — stessi difetti del chiaro (coda senza affordance, intestazione ripetuta, «e un'altra»).

## cattura__pc-light.png
- [media] cattura__pc-light.png — finestra «Scrivi una nota…» — c'è solo «Chiudi»: nessun pulsante «Salva» né indicazione che Invio salva; l'utente non sa come confermare — aggiungere «Salva ↵» primario e «Esc» accanto a Chiudi.
- [bassa] cattura__pc-light.png — linea divisoria — rientra di ~5px dai bordi della card mentre il resto è a filo: dettaglio sciatto — portarla a tutta larghezza o allinearla al padding (20px).
- [bassa] cattura__pc-light.png — testo segnaposto — «Scrivi una nota…» in grigio medio 18px semibold: sembra testo già scritto più che segnaposto — peso regular e grigio più chiaro.
- [bassa] cattura__pc-light.png — posizione — la finestra è centrata sulla finestra del browser (x 320–960) e non sulla colonna contenuti (x 324–1204): visivamente sbilanciata a sinistra rispetto alla pagina sfocata — centrarla sulla colonna o allargarla a 880px.

## cattura__pc-dark.png
- [bassa] cattura__pc-dark.png — finestra — su sfondo sfocato quasi nero la card #1c1c1e ha solo un bordo sottile: stacca poco — bordo/ombra più chiari o velo meno scuro.
- [bassa] cattura__pc-dark.png — stessi difetti del chiaro (manca «Salva», divisore rientrato, finestra non centrata sulla colonna).

## diario__pc-light.png
- [alta] diario__pc-light.png — menu laterale — è evidenziata «Andamento» mentre si è in Profilo › Diario: l'utente perde l'orientamento — evidenziare «Profilo e impostazioni» (o nessuna voce) nelle pagine del profilo.
- [media] diario__pc-light.png — icone ↶ accanto all'ora — icona senza etichetta né tooltip visibile, ambigua (annulla? ripristina?) e ripetuta su ogni riga: rumore visivo — mostrarla solo al passaggio del mouse con tooltip «Annulla questa azione».
- [media] diario__pc-light.png — colonne — etichetta del giorno a x=345, contenuti da x=457 e ora a x=993 con ~170px vuoti a destra: griglia larga e scollegata, l'ora è lontana dal testo — avvicinare la colonna ora al bordo destro (allineata a destra) e ridurre la colonna del giorno.
- [media] diario__pc-light.png — riga «Completata · Organizzare cena…» — «Priorità» va a capo da solo e un selettore area (dropdown) è dentro la voce di diario: controllo di modifica inatteso in un registro, e altezza riga irregolare — mostrare l'area come etichetta statica; modifica solo nella scheda.
- [bassa] diario__pc-light.png — icone ↶ e orari — sono 4px più in basso della prima riga di testo — allineare alla baseline della prima riga.
- [bassa] diario__pc-light.png — «energia 4 · focus 5 · umore 5» — valori senza scala — «4/5».
- [bassa] diario__pc-light.png — «Fine giornata · andata bene: … · ostacolo: …» — etichette minuscole fuse nel testo, poco leggibili — «Bene: … — Ostacolo: …» con etichette in grassetto o su righe separate.

## diario__pc-dark.png
- [media] diario__pc-dark.png — selettori area dentro le voci («Relazioni & Sociale ⌄») — in scuro hanno bordo grigio sottile e sembrano select nativi; risultano il controllo più evidente della riga — vedi chiaro: etichetta statica.
- [bassa] diario__pc-dark.png — stessi difetti del chiaro («Andamento» evidenziato nel menu, icone ↶ ripetute, colonna ora lontana).

## giornata-anno__pc-light.png
- [media] giornata-anno__pc-light.png — numeri verdi in alto a destra dei mesi («7», «25», «17») — numeri senza etichetta, 11px — «17 giorni attivi» in tooltip o testo «17 gg».
- [media] giornata-anno__pc-light.png — mini calendari mensili — nessuna iniziale dei giorni né numero del giorno: non si capisce in che giorno della settimana inizi il mese; il giorno di oggi è indicato solo da un bordo sottile poco visibile — aggiungere riga L M M G V S D sopra il primo mese di ogni riga e un anello d'accento più marcato per oggi.
- [media] giornata-anno__pc-light.png — scheda «Rituali» — il pallino viola è attaccato/sovrapposto all'icona senza significato chiaro — spostarlo dopo il testo come badge o spiegare (es. «1 rituale da fare»).
- [bassa] giornata-anno__pc-light.png — «XP» — sigla da videogioco non spiegata in un'app in italiano — «punti esperienza» o tooltip.
- [bassa] giornata-anno__pc-light.png — navigazione anno — freccia ‹ a sinistra e › all'estremità destra a 860px di distanza: comando spezzato — mettere ‹ 2026 › insieme con un pulsante «Oggi».
- [bassa] giornata-anno__pc-light.png — mesi futuri (Set–Dic) — stessi grigi dei mesi passati senza attività: passato vuoto e futuro non si distinguono — futuro con celle tratteggiate o più chiare.

## giornata-anno__pc-dark.png
- [media] giornata-anno__pc-dark.png — celle dei giorni senza attività — grigio #3a molto simile alle celle future (#2a): passato vuoto/futuro quasi identici e la cella «oggi» (bordo sottile) si vede appena — differenziare futuro e oggi.
- [bassa] giornata-anno__pc-dark.png — scheda attiva «La giornata» e «Anno» — grigio medio pieno, mentre nel menu laterale l'attivo è viola: due linguaggi diversi per lo stato selezionato — uniformare.
- [bassa] giornata-anno__pc-dark.png — stessi difetti del chiaro (numeri verdi senza etichetta, «XP», frecce separate).

## giornata-giorno-fondo__pc-light.png
- [media] giornata-giorno-fondo__pc-light.png — blocco «Leggere 20 minuti» (22:00) — troppo basso: l'orario non compare e la casella a destra tocca i bordi del blocco (sembra tagliata) — altezza minima 36px per i blocchi o casella più piccola centrata, con orario inline «22:00».
- [media] giornata-giorno-fondo__pc-light.png — caselle di completamento — nei blocchi del calendario sono a destra, nella lista «Senza orario» a sinistra: stessa azione in posizioni diverse — uniformare (a sinistra ovunque).
- [media] giornata-giorno-fondo__pc-light.png — fascia a righe 23:30–00:00 — nessuna etichetta: non si capisce che è il sonno — scrivere «Sonno» come per «Cena».
- [bassa] giornata-giorno-fondo__pc-light.png — icona orologio viola a destra di «Ripasso flashcard» — senza etichetta né tooltip (assegna orario?) — tooltip «Dai un orario» o testo.
- [bassa] giornata-giorno-fondo__pc-light.png — blocco «Cena» — grigio pieno centrato senza orario, stile diverso da tutti gli altri blocchi (allineati a sinistra) — allineare a sinistra con orario.
- [bassa] giornata-giorno-fondo__pc-light.png — menu laterale — le voci sono 1px più in alto rispetto alle altre pagine (Aggiungi una nota y≈99 vs 100): il menu «saltella» — fissare il menu laterale indipendente dallo scorrimento.
- [bassa] giornata-giorno-fondo__pc-light.png — «Rimanda a domani l'attività rimasta» — link isolato sotto il campo, sembra appartenere al campo — spostarlo nell'intestazione «Senza orario» o renderlo pulsante secondario.

## giornata-giorno__pc-light.png
- [media] giornata-giorno__pc-light.png — titolo «Oggi» — non c'è la data (giorno/mese): navigando con ‹ › si perde il riferimento e su computer lo spazio non manca — «Oggi · domenica 22 novembre».
- [media] giornata-giorno__pc-light.png — riga riassunto «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — icone senza etichetta, testo 13px: sembra una riga tecnica; non è chiaro che è cliccabile (solo chevron all'estrema destra a 850px di distanza) — «Sonno 23:30–07:30 (8 h) · 3 pasti» con pulsante «Modifica».
- [media] giornata-giorno__pc-light.png — blocchi del calendario — larghi 815px per un titolo di 200px: su computer una sola colonna giorno spreca spazio — affiancare un pannello (attività senza orario / da fare trascinabili) a destra del calendario.
- [bassa] giornata-giorno__pc-light.png — linea «adesso» 10:30 — attraversa il blocco «Organizzare cena» sopra il testo; l'etichetta è blu mentre la linea è viola — far passare la linea sotto i blocchi (o semitrasparente) e usare lo stesso colore.
- [bassa] giornata-giorno__pc-light.png — fascia a righe 07:00–07:30 — senza etichetta (sonno) — vedi giorno-fondo.
- [bassa] giornata-giorno__pc-light.png — frecce ‹ › — tonde da 44px agli estremi, mentre in Anno sono quadrate 34px: componente di navigazione incoerente tra le viste — uniformare.

## giornata-giorno__pc-dark.png
- [media] giornata-giorno__pc-dark.png — blocco «Confrontare piani telefonici» — casella scura su fondo oliva, contrasto molto basso (quasi invisibile) — casella con bordo chiaro.
- [bassa] giornata-giorno__pc-dark.png — fascia sonno a righe — in scuro le righe diagonali sono molto marcate e più evidenti dei blocchi reali — ridurre il contrasto delle righe.
- [bassa] giornata-giorno__pc-dark.png — blocchi «Colazione»/«Pranzo» — grigio su grigio quasi senza bordo — leggero bordo per distinguerli dalla griglia.
- [bassa] giornata-giorno__pc-dark.png — stessi difetti del chiaro (manca la data, riga sonno criptica, linea adesso sopra il testo).

## giornata-mese__pc-light.png
- [alta] giornata-mese__pc-light.png — riepilogo «18 giorni attivi» — nella vista Anno lo stesso agosto riporta «17»: dati incoerenti tra viste (forse oggi contato/non contato) — usare la stessa regola di calcolo e la stessa etichetta.
- [media] giornata-mese__pc-light.png — pallini colorati sotto i giorni — nessuna legenda (aree? tipi?) e 4px di diametro — legenda o tooltip al passaggio, pallini più grandi.
- [media] giornata-mese__pc-light.png — riepilogo «18 giorni attivi · 58 attività fatte» — stile diverso dalla vista Anno (là card con 3 numeri centrati, qui testo in linea a sinistra senza card) — stesso componente statistiche nelle due viste.
- [media] giornata-mese__pc-light.png — lista «Oggi» sotto il calendario — le abitudini hanno caselle quadrate piccole colorate, mentre nella pagina Abitudini sono cerchi grandi: stesso oggetto, controllo diverso — uniformare.
- [bassa] giornata-mese__pc-light.png — anelli di avanzamento — senza percentuale né tooltip; giorni futuri senza anello e passati con anello: ok, ma il 18 (oggi) ha cerchio pieno viola che nasconde l'anello verde parziale — mostrare l'anello attorno al cerchio pieno con più distacco.
- [bassa] giornata-mese__pc-light.png — riga 31 da sola + celle vuote: ~45px vuoti in fondo alla card — normale, ma si potrebbe mostrare l'inizio di settembre attenuato come per luglio.

## giornata-mese__pc-dark.png
- [media] giornata-mese__pc-dark.png — giorni del mese precedente (27–31) — numeri e anelli grigio scuro quasi illeggibili, pallini quasi invisibili — aumentare l'opacità al 50%.
- [bassa] giornata-mese__pc-dark.png — stessi difetti del chiaro (18 vs 17, pallini senza legenda, caselle quadrate per le abitudini).

## giornata-scheda-abitudine__pc-light.png
- [media] giornata-scheda-abitudine__pc-light.png — pulsante «✓ Fatto» verde pieno — sembra uno stato già raggiunto («fatto») più che un'azione, e l'abitudine non è ancora fatta — testo d'azione «Segna come fatta» o pulsante viola primario; verde pieno solo a completamento avvenuto.
- [media] giornata-scheda-abitudine__pc-light.png — valori «18:00» (nero) e «45 min» (viola) — stesso tipo di campo, colori diversi — uniformare (tutti viola o tutti testo primario).
- [bassa] giornata-scheda-abitudine__pc-light.png — «Area: Salute & Sport» — non ha la × di rimozione come Ora e Durata e la pillola è più larga: incoerenza nel gruppo — stessa forma per i tre valori.
- [bassa] giornata-scheda-abitudine__pc-light.png — azione «Termina l'abitudine» in rosso — senza indicazione se è reversibile; posta tra due azioni neutre — spostarla in fondo, separata, e chiedere conferma.

## giornata-scheda-abitudine__pc-dark.png
- [bassa] giornata-scheda-abitudine__pc-dark.png — pillole «18:00», «45 min», «Salute & Sport» — fondo grigio-viola scuro su card grigio: contrasto basso tra pillola e riga — schiarire leggermente il fondo delle pillole.
- [bassa] giornata-scheda-abitudine__pc-dark.png — stessi difetti del chiaro («Fatto» ambiguo, colori dei valori incoerenti).

## giornata-scheda-blocco__pc-light.png
- [media] giornata-scheda-blocco__pc-light.png — azione principale — qui è un link grigio centrato «↶ Segna come non fatta», nella scheda dell'abitudine è un grande pulsante verde «Fatto»: le due schede gemelle hanno gerarchie opposte e manca un'indicazione di stato («Completata alle 10:00») — stesso pulsante grande a stato (verde «✓ Fatta» con possibilità di annullare) in entrambe.
- [media] giornata-scheda-blocco__pc-light.png — azioni in fondo — manca «Apri l'attività» (presente invece per l'abitudine) per vedere passi e note — aggiungerla.
- [bassa] giornata-scheda-blocco__pc-light.png — sfondo — aprendo la scheda la pagina sotto è scorsa di ~100px (le schede in alto sono tagliate) e la finestra parte a y=178 contro 154 dell'abitudine — non far scorrere la pagina al clic su un blocco; posizione verticale costante.
- [bassa] giornata-scheda-blocco__pc-light.png — «1 h 30» — formato incompleto — «1 h 30 min».
- [bassa] giornata-scheda-blocco__pc-light.png — «Elimina» — azione distruttiva a un clic senza separazione — chiedere conferma o offrire «Annulla» in un avviso.

## giornata-scheda-blocco__pc-dark.png
- [bassa] giornata-scheda-blocco__pc-dark.png — «Segna come non fatta» — grigio chiaro senza contenitore, si legge come etichetta e non come pulsante — dargli forma di pulsante secondario.
- [bassa] giornata-scheda-blocco__pc-dark.png — stessi difetti del chiaro.

## giornata-settimana__pc-light.png
- [media] giornata-settimana__pc-light.png — colonna delle ore — le etichette («07:00», «10:00»…) stanno ~11px sopra la riga corrispondente, mentre nella vista Giorno sono centrate sulla riga: lettura dell'orario ambigua e incoerente tra viste — centrare l'etichetta sulla linea (translateY(-50%)).
- [media] giornata-settimana__pc-light.png — blocco «Organizzare cena con il gruppo» — testo su 3 righe barrato, coperto dalla linea «adesso» e dal badge «10:30» che ne nasconde la parte destra — linea sotto i blocchi e badge solo nella colonna delle ore.
- [media] giornata-settimana__pc-light.png — «Camminata /…» — troncato in tutte le colonne pur con 108px; a 1280px il titolo intero non entra mai — ridurre il padding, usare 2 righe o tooltip; considerare di nascondere le fasce pasto ripetute per guadagnare leggibilità.
- [bassa] giornata-settimana__pc-light.png — blocchi pasto — solo icona (tazza, posate) senza testo né orario: in settimana si capisce a fatica — tooltip o etichetta «Pranzo» quando lo spazio basta.
- [bassa] giornata-settimana__pc-light.png — «4 senza ora», «1 senza ora» — testo 11px grigio, non cliccabile in apparenza — renderlo un link/badge che apre l'elenco.
- [bassa] giornata-settimana__pc-light.png — selettore viste (Giorno/Settimana/Mese/Anno) — stile «pill» diverso dalla barra a segmenti superiore (Adesso/La giornata/Rituali): due livelli di schede con linguaggi diversi ma che si somigliano, gerarchia poco chiara — differenziare meglio (es. secondo livello come testo sottolineato).

## giornata-settimana__pc-dark.png
- [bassa] giornata-settimana__pc-dark.png — blocco «Camminata» del lunedì (fatto) — bordo grigio su grigio e testo barrato grigio: quasi illeggibile — mantenere il bordo verde attenuato per le abitudini fatte.
- [bassa] giornata-settimana__pc-dark.png — stessi difetti del chiaro (etichette ore disallineate, testo coperto da «adesso», titoli troncati).

## giornata-sonno-aperto__pc-light.png
- [media] giornata-sonno-aperto__pc-light.png — layout del pannello — «A letto» e «Sveglia» hanno campi larghi ~350px per 5 caratteri, mentre i pasti hanno etichetta a sinistra e campi stretti all'estrema destra a 640px di distanza: due griglie diverse nello stesso pannello, l'occhio deve attraversare lo schermo — griglia unica a 2 colonne compatte (etichetta + campo da 90px) allineate a sinistra.
- [media] giornata-sonno-aperto__pc-light.png — «15 min ⌄», «45 min ⌄» — select nativi non stilizzati (freccia di sistema) — usare il componente selettore dell'app.
- [media] giornata-sonno-aperto__pc-light.png — azioni «+ Pasto · Annulla le modifiche · Orari abituali» — tre link uguali con significati molto diversi; «Annulla le modifiche» è attivo anche senza modifiche e «Orari abituali» è ambiguo (apre le impostazioni? ripristina?) — «Ripristina orari abituali» come azione secondaria, «Annulla» visibile solo con modifiche, «+ Aggiungi pasto» separato.
- [bassa] giornata-sonno-aperto__pc-light.png — riga riassunto — resta visibile anche a pannello aperto, duplicando gli stessi orari subito sotto — a pannello aperto mostrare un titolo «Sonno e pasti di oggi».
- [bassa] giornata-sonno-aperto__pc-light.png — cestini dei pasti — 12px grigi, senza conferma e attaccati al select — area di clic più grande e tooltip «Rimuovi pasto».

## giornata-sonno-aperto__pc-dark.png
- [bassa] giornata-sonno-aperto__pc-dark.png — campi orario — bordo grigio su card grigia con contrasto sufficiente; i select nativi in scuro mostrano la freccia di sistema chiara — stesso intervento del chiaro.
- [bassa] giornata-sonno-aperto__pc-dark.png — stessi difetti del chiaro (griglia incoerente, link ambigui).

## imp-aspetto__pc-light.png
- [media] imp-aspetto__pc-light.png — contenuto di «Aspetto» — «Suoni» e «Vibrazione» non sono aspetto; «Vibrazione» su computer non ha effetto — spostarli in «Suoni e feedback» e nascondere la vibrazione sui dispositivi che non la supportano.
- [media] imp-aspetto__pc-light.png — navigazione — le impostazioni sono finestre impilate con link «‹ Impostazioni» dentro la finestra: su computer è stretto (460px) e il percorso si perde — su schermo largo usare una pagina Impostazioni con menu a sinistra e contenuto a destra.
- [bassa] imp-aspetto__pc-light.png — titolo «Aspetto» e «×» — la × è allineata al link «Impostazioni» e non al titolo — allinearla verticalmente al titolo.
- [bassa] imp-aspetto__pc-light.png — interruttori — senza descrizione (cosa suona? quali animazioni?) — una riga di aiuto sotto ciascuno.

## imp-aspetto__pc-dark.png
- [bassa] imp-aspetto__pc-dark.png — opzione selezionata «Auto» — grigio medio pieno: si distingue, ma è diverso dal viola usato per gli interruttori accanto — usare l'accento anche per il segmento selezionato.
- [bassa] imp-aspetto__pc-dark.png — stessi difetti del chiaro.

## imp-musica__pc-light.png
- [alta] imp-musica__pc-light.png — campi «Link della playlist» — in chiaro il campo ha lo stesso fondo del gruppo e nessun bordo: i campi di testo sono praticamente invisibili, si vede solo il segnaposto — bordo 1px o fondo bianco per i campi.
- [media] imp-musica__pc-light.png — righe per area — l'etichetta («Studio / Università») tocca quasi il bordo superiore della riga (6px) mentre sotto il campo c'è altro spazio: spaziatura sbilanciata — padding verticale 12px uniforme.
- [media] imp-musica__pc-light.png — testi — «Predefinita» da sola non dice cosa sia, e non si spiega quali servizi siano accettati (Spotify? YouTube?) né cosa succede con «Per area» — «Playlist predefinita» con aiuto «Incolla un link Spotify, Apple Music o YouTube; per ogni area puoi sceglierne una diversa».
- [bassa] imp-musica__pc-light.png — finestra lunga con scorrimento interno — su computer 8 campi in colonna obbligano a scorrere un riquadro stretto — 2 colonne o pagina dedicata.
- [bassa] imp-musica__pc-light.png — interruttore spento «Apri all'avvio del timer» — traccia grigio chiarissimo su grigio, quasi invisibile — traccia più scura.

## imp-musica__pc-dark.png
- [bassa] imp-musica__pc-dark.png — interruttore spento — pomello grigio su traccia grigio scuro, sembra disabilitato più che spento — pomello bianco come negli interruttori accesi.
- [bassa] imp-musica__pc-dark.png — in scuro i campi si vedono (fondo più chiaro) mentre in chiaro no: incoerenza tra temi — vedi chiaro.

## imp-timer__pc-light.png
- [media] imp-timer__pc-light.png — sezioni «Avvio rapido» e «Sessione» — termini interni non spiegati: non è chiaro che differenza ci sia tra avvio rapido, sessione e pomodoro, né cosa significhi «Se prosegui, altri» (frase spezzata) — aggiungere una riga di aiuto per sezione e riformulare «Se continui: altri 25 min».
- [media] imp-timer__pc-light.png — «Pausa lunga dopo 4 blocchi: Nessuna» — la frase letta per intero («pausa lunga dopo 4 blocchi: nessuna») è contraddittoria — «Pausa lunga» con valore «Disattivata» / «15 min ogni 4 blocchi».
- [bassa] imp-timer__pc-light.png — valori in pillola viola — non si capisce se aprano un menu, un campo o cicli di valori (nessuna freccia) — aggiungere un chevron ⌄.
- [bassa] imp-timer__pc-light.png — «Durata» ripetuta in due gruppi — etichette identiche per cose diverse — «Durata avvio rapido», «Durata sessione».

## imp-timer__pc-dark.png
- [bassa] imp-timer__pc-dark.png — pillole dei valori — viola chiaro su grigio-viola scuro, contrasto appena sufficiente; nessun difetto nuovo oltre a quelli del chiaro.

## impostazioni-fondo__pc-light.png
- [media] impostazioni-fondo__pc-light.png — «Backup e ripristino 1» — numero senza etichetta — «1 backup» o data dell'ultimo backup.
- [media] impostazioni-fondo__pc-light.png — «Esporta dati» / «Importa dati» — senza chevron né indicazione di cosa succede al clic (scarica subito? apre una finestra?), mentre le righe vicine hanno › — aggiungere sottotitolo («Scarica un file .json») e icona coerente.
- [bassa] impostazioni-fondo__pc-light.png — «Su cosa si basa», «Registro tecnico» — etichette vaghe/gergali per un utente — «Il metodo dietro LifeMax», «Informazioni per l'assistenza».
- [bassa] impostazioni-fondo__pc-light.png — «Cancella tutti i dati» — ben separato e rosso; nessun difetto, salvo verificare la conferma.

## impostazioni__pc-light.png
- [media] impostazioni__pc-light.png — «Sincronizzazione: su questo dispositivo» — la riga dice «sincronizzazione» ma il valore indica che non c'è sincronizzazione: messaggio contraddittorio — «Dove sono salvati i dati: solo su questo dispositivo».
- [media] impostazioni__pc-light.png — «Area predefinita: Automatica ⌄» — chevron giù in grassetto (select nativo) mentre le altre righe usano › sottile: controllo incoerente — stessa riga con › che apre una scelta, o select stilizzato.
- [bassa] impostazioni__pc-light.png — valori a destra in minuscolo («chiedi sempre», «nessuna», «automatico») ma «Automatica» con maiuscola — uniformare le maiuscole.
- [bassa] impostazioni__pc-light.png — «Account» — la sezione non contiene un account (nessun accesso) — rinominare «Dati e dispositivo» o «Generali».

## impostazioni__pc-dark.png
- [bassa] impostazioni__pc-dark.png — divisori tra le righe — quasi invisibili (#2e su #2a) — schiarire leggermente; per il resto stessi difetti del chiaro.

## menu-oggi-avatar__pc-light.png
- [media] menu-oggi-avatar__pc-light.png — menu laterale — sulla pagina Profilo nessuna voce è evidenziata, nemmeno «Profilo e impostazioni» in basso: l'utente non sa dove si trova — evidenziare «Profilo e impostazioni» come voce attiva.
- [media] menu-oggi-avatar__pc-light.png — «Promemoria: bloccati» — non si capisce chi li blocchi (il browser? l'utente?) né cosa fare — «Notifiche bloccate dal browser · Sblocca» con colore di avviso.
- [bassa] menu-oggi-avatar__pc-light.png — intestazione profilo — nome e motto senza alcuna affordance di modifica (matita) — aggiungere «Modifica profilo».
- [bassa] menu-oggi-avatar__pc-light.png — avatar «R» quadrato 64px qui, cerchio 44px nelle altre pagine — stessa forma.
- [bassa] menu-oggi-avatar__pc-light.png — sulla pagina profilo sparisce la barra superiore (schede + avatar): l'intestazione cambia altezza rispetto alle altre sezioni — tenere un'intestazione con titolo «Profilo».
- [bassa] menu-oggi-avatar__pc-light.png — metà inferiore vuota (~250px) — su computer si potrebbero affiancare statistiche e collegamenti in due colonne.

## menu-oggi-avatar__pc-dark.png
- [bassa] menu-oggi-avatar__pc-dark.png — stessi difetti del chiaro (nessuna voce attiva nel menu, «bloccati» ambiguo, avatar quadrato); in scuro nessun problema di contrasto rilevante.

## oggi-adesso__pc-light.png
- [alta] oggi-adesso__pc-light.png — barra «1 di 2 fatte» — non è chiaro cosa conti: oggi ci sono 3 abitudini (pagina Abitudini «0 di 3») più attività con orario; il numero non corrisponde a nessun'altra schermata — specificare («1 di 2 attività pianificate») o usare lo stesso conteggio ovunque.
- [media] oggi-adesso__pc-light.png — sezione «Poi» — mostra solo «Confrontare piani telefonici», mancano «Camminata» (18:00) e «Leggere 20 minuti» (22:00) presenti nel calendario: l'elenco sembra incompleto — mostrare tutto il resto della giornata o scrivere «e altre 2 · Vedi la giornata».
- [media] oggi-adesso__pc-light.png — «Salta oggi ⏭» — testo grigio senza forma di pulsante, con icona dopo il testo, accanto a «▶ Timer» che ha bordo e icona prima: due azioni sorelle con stili opposti — stesso stile di pulsante secondario.
- [bassa] oggi-adesso__pc-light.png — «Pianifica la giornata — Un minuto» — «Un minuto» isolato è ambiguo (tempo stimato?) — «Richiede circa un minuto».
- [bassa] oggi-adesso__pc-light.png — card «adesso» — l'etichetta area «Studio / Università» e la pillola «Abitudine» sono su due righe separate con molto spazio: gerarchia dispersiva — metterle sulla stessa riga.
- [bassa] oggi-adesso__pc-light.png — pallino viola su «Rituali» — sovrapposto all'icona, senza significato esplicito (vedi giornata-anno).

## oggi-adesso__pc-dark.png
- [bassa] oggi-adesso__pc-dark.png — card «adesso» — fondo blu-grigio con ombra nera sfocata che sborda ai lati: effetto alone sporco su sfondo nero — ridurre l'ombra in tema scuro e usare un bordo sottile.
- [bassa] oggi-adesso__pc-dark.png — «Salta oggi» — grigio medio su blu scuro, contrasto basso — vedi chiaro.
- [bassa] oggi-adesso__pc-dark.png — stessi difetti del chiaro («1 di 2 fatte» ambiguo, «Poi» incompleto).

## profilo__pc-light.png
- [media] profilo__pc-light.png — identica a menu-oggi-avatar: nessuna voce del menu laterale attiva in Profilo, mentre in Profilo › Diario risulta attiva «Andamento»: logica di evidenziazione incoerente — «Profilo e impostazioni» attiva per tutto il ramo profilo.
- [bassa] profilo__pc-light.png — statistiche — «109 attività fatte in tutto» mentre altrove si dice «fatte» per le percentuali dei 30 giorni: tre numeri con orizzonti temporali diversi affiancati senza distinzione — sottotitoli espliciti («da sempre», «ultimi 30 giorni»).
- [bassa] profilo__pc-light.png — «Promemoria: bloccati» — vedi menu-oggi-avatar.

## profilo__pc-dark.png
- [bassa] profilo__pc-dark.png — stessi difetti del chiaro; nessun problema specifico del tema scuro.

## promemoria__pc-light.png
- [media] promemoria__pc-light.png — avviso «Notifiche bloccate» — spiega il problema ma non offre un'azione (es. «Come sbloccarle» o «Riprova») e l'icona grigia su giallo è debole — aggiungere un pulsante/link e icona color avviso.
- [media] promemoria__pc-light.png — «Non disturbare» — resta attivo e modificabile mentre tutte le notifiche sopra sono disabilitate: incoerente — disabilitarlo insieme alle altre o spiegarlo.
- [bassa] promemoria__pc-light.png — riga «Dalle 23:00 alle 07:00» — «Dalle» rientra di 16px rispetto ad «Attivo» e «alle» è schiacciato tra i due campi — allineare a sinistra e dare spazio.
- [bassa] promemoria__pc-light.png — voci — «Ricordami la priorità» è una frase, le altre sono nomi («Check-in», «Fine giornata») — «Promemoria priorità».
- [bassa] promemoria__pc-light.png — orari disabilitati — testo grigio su lilla chiarissimo, quasi illeggibile — opacità 60% invece di colori slavati.
- [bassa] promemoria__pc-light.png — orari «Non disturbare» 23:00–07:00 diversi dal sonno impostato (23:30–07:30) — proporre di default gli orari del sonno.

## promemoria__pc-dark.png
- [bassa] promemoria__pc-dark.png — interruttori spenti/disabilitati — pomello grigio su traccia grigia, identici a quelli «spenti ma attivi» di Musica: disabilitato e spento non si distinguono — stile disabilitato distinto (opacità + cursore).
- [bassa] promemoria__pc-dark.png — avviso marrone scuro — contrasto del testo buono, icona grigia poco visibile — icona in giallo/arancio.

## rituale-checkin__pc-light.png
- [media] rituale-checkin__pc-light.png — stato «✓ fatto» con pulsante «Registra +3 XP» disabilitato in fondo — non si capisce se le modifiche ai valori vengano salvate né perché il pulsante sia spento — a check-in fatto mostrare «Aggiorna» attivo quando cambia qualcosa, o testo «Registrato alle 09:00».
- [media] rituale-checkin__pc-light.png — gerarchia testi — le domande («Quanta energia hai?») sono 13px grigio scuro mentre il titolo «Andamento degli ultimi 14 giorni» sotto è 20px nero: la sezione secondaria pesa più del contenuto principale — domande a 15–16px, titolo dell'andamento ridotto.
- [bassa] rituale-checkin__pc-light.png — stati a destra («da fare / 2 di 3», «da compilare / 0 di 4») — due righe 11px, termini diversi per lo stesso concetto e «2 di 3» senza unità — un'unica pillola «2 di 3 passi».
- [bassa] rituale-checkin__pc-light.png — icona «Piano del giorno» viola piena, le altre tenui — senza motivo dichiarato (suggerito?) — uniformare o etichettare «consigliato ora».
- [bassa] rituale-checkin__pc-light.png — pulsanti 1–5 larghi 160px — su computer troppo larghi per un numero; le etichette «1 · esausto» sono lontane dal relativo pulsante — pulsanti più compatti con l'etichetta dentro/sotto ciascuno.

## rituale-checkin__pc-dark.png
- [bassa] rituale-checkin__pc-dark.png — pulsante «Registra +3 XP» disabilitato — grigio su grigio, quasi invisibile; il titolo «Andamento degli ultimi 14 giorni» è tagliato dal bordo inferiore senza indizio di scorrimento — stessi interventi del chiaro.

## rituale-piano__pc-light.png
- [media] rituale-piano__pc-light.png — stato «da fare · 2 di 3» — si vedono solo 2 priorità: non si capisce cosa sia il 3 (priorità? passi del rituale?) — «2 di 3 passi» con elenco dei passi o rimuovere.
- [media] rituale-piano__pc-light.png — righe delle priorità — nessuna casella per completarle; la prima è barrata ma con testo grigio chiaro poco leggibile; l'etichetta «★ Priorità» compare solo sulla prima — casella a sinistra, contrasto del barrato più alto, spiegare la differenza tra priorità principale e le altre.
- [bassa] rituale-piano__pc-light.png — icone area a destra (persone, portafoglio) — 12px colorate senza testo — tooltip o nome area.
- [bassa] rituale-piano__pc-light.png — «Quando inizi?» con campo libero «Es. alle 9:00, alla scrivania» — mescola orario e luogo in testo libero, non si collega al calendario — se è un'intenzione, chiarire «Quando e dove inizi? (intenzione)»; altrimenti un selettore orario.
- [bassa] rituale-piano__pc-light.png — «+5 XP» dentro il pulsante «Salva» — testo più piccolo e più chiaro, rumore nel pulsante primario — spostare la ricompensa in un sottotitolo o nella conferma.

## rituale-piano__pc-dark.png
- [bassa] rituale-piano__pc-dark.png — priorità completata barrata — grigio scuro su nero, quasi illeggibile — schiarire; per il resto stessi difetti del chiaro.

## rituale-sera__pc-light.png
- [alta] rituale-sera__pc-light.png — righe di valutazione per area — nome area in alto a sinistra e pulsanti 1–5 su una seconda riga all'estrema destra, a ~600px di distanza: ogni riga è alta 84px invece di 48, l'occhio deve fare zig-zag e su 8 aree il rituale diventa lunghissimo — nome e pulsanti sulla stessa riga (nome a sinistra, scala a destra) o scala subito sotto il nome a sinistra.
- [media] rituale-sera__pc-light.png — pulsanti 1–5 — quadratini grigi 36px senza bordo, mentre nel Check-in la stessa scala 1–5 usa pulsanti bianchi grandi con bordo: due componenti per la stessa scala — un unico componente di valutazione.
- [bassa] rituale-sera__pc-light.png — legenda «1 = male · 5 = benissimo» — 12px grigio sulla riga della domanda, si perde — ripeterla agli estremi della scala (come in Check-in).
- [bassa] rituale-sera__pc-light.png — ordine delle aree — diverso da quello di «Le tue aree» e di «Per area» in Andamento — usare un ordine unico.

## rituale-sera__pc-dark.png
- [bassa] rituale-sera__pc-dark.png — pulsanti 1–5 — grigio scuro su grigio scuro, contrasto basso e senza bordo — bordo sottile; stessi difetti del chiaro (righe a zig-zag).

## rituale-settimana__pc-light.png
- [media] rituale-settimana__pc-light.png — campi di testo — rettangoli grigi senza bordo né segnaposto: non sembrano campi da compilare — bordo e segnaposto d'esempio («Es. ho studiato ogni mattina»).
- [media] rituale-settimana__pc-light.png — statistiche «216 XP guadagnati · 10 attività fatte · 6/7 giorni attivi» — terza variante del componente statistiche (dopo Anno e Mese), qui centrate ma con numeri allineati a sinistra nelle colonne — un solo componente.
- [bassa] rituale-settimana__pc-light.png — domande senza punto interrogativo («Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»…) — aggiungere «?».
- [bassa] rituale-settimana__pc-light.png — elenco rituali — 5 voci a fisarmonica con una aperta molto lunga: su computer un rituale aperto in una vista dedicata (o a due colonne: elenco a sinistra, rituale a destra) sarebbe più leggibile.

## rituale-settimana__pc-dark.png
- [bassa] rituale-settimana__pc-dark.png — campi di testo — grigio #2a su #1e senza bordo né segnaposto, ancora meno riconoscibili che in chiaro — bordo e segnaposto.

## rituale-sonno-pasti__pc-light.png
- [media] rituale-sonno-pasti__pc-light.png — pulsante di chiusura del rituale — qui «Fatto» viola, in Piano «Salva +5 XP», in Check-in «Registra +3 XP», nella scheda abitudine «Fatto» verde: quattro etichette/colori per la stessa azione «conferma il rituale» — un solo verbo (es. «Salva») e un solo colore.
- [media] rituale-sonno-pasti__pc-light.png — «Come sempre · 23:30–07:30» in viola a destra — non si capisce se è un'informazione o un pulsante («usa gli orari di sempre»); «Non ricordo» è un link isolato senza contesto — pulsante esplicito «Usa orari abituali» e «Non ricordo» accanto ai campi.
- [media] rituale-sonno-pasti__pc-light.png — modifica del sonno — qui orari come testo con icona orologio, nel pannello della giornata come campi di testo larghi, in Profilo › Sonno e pasti in un altro modo: tre interfacce per lo stesso dato — un componente unico.
- [bassa] rituale-sonno-pasti__pc-light.png — pulsanti pasti «sì / no / ⏰» — «sì» minuscolo, terzo pulsante solo icona senza etichetta (orario diverso?) — «Sì», «No», «Altro orario».
- [bassa] rituale-sonno-pasti__pc-light.png — «da compilare · 0 di 4» — non si spiega cosa siano i 4 elementi — vedi rituale-checkin.

## rituale-sonno-pasti__pc-dark.png
- [bassa] rituale-sonno-pasti__pc-dark.png — pulsanti «sì / no / ⏰» — grigio scuro su grigio, nessuno stato selezionato visibile; stessi difetti del chiaro.

## rituali__pc-light.png
- [media] rituali__pc-light.png — elenco rituali — nessuna indicazione di quando farli (mattina, 13:00, sera, domenica) né di quanto durano; «Bilancio della settimana» risulta «da fare» di martedì — aggiungere sottotitolo con momento consigliato e mostrare «da fare» solo quando è il momento.
- [media] rituali__pc-light.png — oltre metà schermo vuota sotto 5 righe — su computer usare una disposizione a due colonne (elenco + rituale aperto) o card con anteprima.
- [bassa] rituali__pc-light.png — stati a destra — «da fare / 2 di 3», «da compilare / 0 di 4», «✓ fatto», «da fare»: formati e altezze diverse sulla stessa colonna — pillole uniformi.
- [bassa] rituali__pc-light.png — icona «Piano del giorno» viola piena, le altre tenui — vedi rituale-checkin.

## rituali__pc-dark.png
- [bassa] rituali__pc-dark.png — stessi difetti del chiaro (nessun momento indicato, vuoto sotto, stati eterogenei); in scuro nessun problema di contrasto rilevante.

## scheda-abitudine-fondo__pc-light.png
- [media] scheda-abitudine-fondo__pc-light.png — «Ora 18:00 ×» — qui la × è fuori dalla pillola, nella scheda aperta dal calendario è dentro la pillola; «Durata» qui non ha × mentre là sì: stesso campo, tre varianti — un solo componente valore+rimuovi.
- [media] scheda-abitudine-fondo__pc-light.png — calendario dell'abitudine — giorni mancati (12, grigio pieno) e giorni non previsti (8, 9, 15, 16, solo numero grigio) si distinguono a fatica; nessuna legenda — giorni mancati con bordo rosso tenue o ×, legenda «fatto / mancato / non previsto».
- [bassa] scheda-abitudine-fondo__pc-light.png — «Inizio 29 lug 2026» e «Fine Mai» — testo semplice senza aspetto di controllo (le righe sopra hanno pillole): non si capisce se si possano modificare — stessa pillola cliccabile.
- [bassa] scheda-abitudine-fondo__pc-light.png — «Elimina» — pulsante a tutta larghezza senza icona né conferma visibile — aggiungere conferma.

## scheda-abitudine__pc-light.png
- [media] scheda-abitudine__pc-light.png — calendario dell'abitudine — manca il nome del mese e la navigazione tra mesi: si vedono giorni 27…18 senza sapere di che mese — intestazione «Agosto 2026» con ‹ ›.
- [media] scheda-abitudine__pc-light.png — «✓ Fatto» verde + «Salta oggi» come link — l'azione principale sembra uno stato già raggiunto (vedi giornata-scheda-abitudine) e «Salta oggi» ha qui forma di link, nella scheda del calendario di voce di elenco, in Adesso di testo con icona: tre forme — uniformare.
- [bassa] scheda-abitudine__pc-light.png — statistiche «3 di fila · 4 record · 7 in tutto» — «record» e «in tutto» senza unità — «record: 4 giorni», «7 volte in tutto».
- [bassa] scheda-abitudine__pc-light.png — finestra di 460px con scorrimento interno su schermo da 1280px — su computer allargare a 640px e affiancare calendario e impostazioni.

## scheda-abitudine__pc-dark.png
- [bassa] scheda-abitudine__pc-dark.png — giorni non previsti (S, D) e futuri — grigio scuro su grigio, quasi illeggibili; i cerchi S/D non selezionati in «Quando» sono neri con bordo sottile — schiarire bordo e testo. Per il resto come il chiaro.

## scheda-attivita-fondo__pc-light.png
- [media] scheda-attivita-fondo__pc-light.png — sezione «Dettagli» — righe con etichette 14px semibold e valori grigi («Studio / Università ⌄» select nativo, «nessuna ›»), mentre la scheda abitudine usa etichette 16px regular e pillole viola per gli stessi campi: le due schede gemelle hanno stili diversi — un unico stile di riga impostazione.
- [media] scheda-attivita-fondo__pc-light.png — «Non ce l'ho fatta ›» — formulazione ambigua: cosa succede (segna come fallita? rimanda? archivia?) — etichetta d'azione esplicita («Archivia come non completata») con sottotitolo.
- [bassa] scheda-attivita-fondo__pc-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» — chip bianche senza stato selezionato e senza spiegazione dell'effetto — sottotitolo «Pianifica i passi rimasti a intervalli regolari», minuscole/maiuscole coerenti con le chip «Domani».
- [bassa] scheda-attivita-fondo__pc-light.png — «Fissa in alto» — interruttore spento quasi invisibile (traccia bianca su grigio chiaro) — traccia più scura.

## scheda-attivita__pc-light.png
- [media] scheda-attivita__pc-light.png — titolo — va a capo su 2 righe (36px l'una) perché la finestra è larga solo 460px su uno schermo da 1280: occupa molto spazio verticale — su computer finestra più larga (600–680px) o pannello laterale.
- [media] scheda-attivita__pc-light.png — chip «Pianifica» — «Un altro giorno» va a capo da sola su una seconda riga — tutte su una riga (finestra più larga) o «Altro…» compatto.
- [bassa] scheda-attivita__pc-light.png — «Passi 1 di 3» — qui c'è l'etichetta «Passi», nella lista Da fare lo stesso «1 di 3» appare senza etichetta — riportare «passi» anche nella lista.
- [bassa] scheda-attivita__pc-light.png — icone calendario e cestino per ogni passo — sempre visibili, il cestino accanto al calendario favorisce clic errati — mostrarle al passaggio del mouse, cestino con conferma.

## scheda-attivita__pc-dark.png
- [bassa] scheda-attivita__pc-dark.png — chip «ogni giorno…» nere su grigio scuro e chip «Pianifica» grigie: due stili di chip nella stessa finestra — uniformare; cerchi dei passi non fatti con bordo poco visibile. Per il resto come il chiaro.

## scheda-scoperta__pc-light.png
- [media] scheda-scoperta__pc-light.png — «Quanto ne sei sicuro»: «notato una volta / lo noto ogni volta / misurato» — tre opzioni con forme grammaticali diverse (participio, prima persona, participio) e senza punto interrogativo — «Una volta / Ogni volta / L'ho misurato», domanda con «?».
- [media] scheda-scoperta__pc-light.png — «Esito: funziona / non funziona» — è l'informazione principale della scoperta ma è nascosta dentro «Dettagli» — portarla in cima subito sotto il testo.
- [bassa] scheda-scoperta__pc-light.png — titolo «Una cosa che hai capito» e etichetta «Cosa hai capito» ripetono lo stesso concetto — titolo «Scoperta» o usare il testo della scoperta come titolo.
- [bassa] scheda-scoperta__pc-light.png — «Area: Studio / Università ⌄» — ancora select nativo con chevron in grassetto (vedi Impostazioni e scheda attività).

## scheda-scoperta__pc-dark.png
- [bassa] scheda-scoperta__pc-dark.png — «non funziona» non selezionato — pulsante nero su grigio, sembra un pulsante «spento» più scuro del contesto — stile secondario coerente (grigio con bordo). Per il resto come il chiaro.

## scoperte-esperimenti__pc-light.png
- [media] scoperte-esperimenti__pc-light.png — grafico — le etichette «media 3,1» e «media 4,3» si sovrappongono ai punti dei dati; l'asse orizzontale non ha date né giorni, quindi «11 giorni» e «24 giorni» non si leggono sul grafico — spostare le etichette fuori dall'area dei punti (a destra della linea, con sfondo) e aggiungere tacche di data sull'asse x.
- [media] scoperte-esperimenti__pc-light.png — «⚑ concluso» e «Focus (da check-in, 1–5)» — etichette informative disegnate come pulsanti con bordo: sembrano cliccabili — usare badge senza bordo, oppure renderle davvero azioni.
- [bassa] scoperte-esperimenti__pc-light.png — testo introduttivo e «La modifica: …» — limitati a ~420px/720px dentro card da 880px, con ampio vuoto a destra; l'introduzione è ripetuta ogni volta — mostrarla una sola volta (comprimibile) e sfruttare la larghezza.
- [bassa] scoperte-esperimenti__pc-light.png — ultimo punto del grafico — tagliato sul bordo destro dell'area (x≈1168) — margine interno destro di 8px.
- [bassa] scoperte-esperimenti__pc-light.png — asse y con solo 1, 3, 5 — per una scala 1–5 mostrare tutti i valori.

## scoperte-esperimenti__pc-dark.png
- [bassa] scoperte-esperimenti__pc-dark.png — punti della fase «base» — grigio chiaro su nero ok, ma la linea tratteggiata grigia e l'etichetta «media 3,1» si confondono con i punti; area «Dopo la modifica» blu scurissimo quasi invisibile — schiarire la campitura. Per il resto come il chiaro.

## scoperte__pc-light.png
- [bassa] scoperte__pc-light.png — icone pollice in riquadri con bordo colorato — sembrano pulsanti (votare/cambiare esito) ma sono solo indicatori — togliere il bordo o renderle davvero un interruttore con tooltip.
- [bassa] scoperte__pc-light.png — sottotitoli «misurato», «lo noto ogni volta», «notato una volta» — stesse forme grammaticali incoerenti della scheda — uniformare.
- [bassa] scoperte__pc-light.png — alcune scoperte senza area e altre con area: le righe di metadati partono a x diverse (con/senza icona) — accettabile; nessun altro difetto rilevante.

## scoperte__pc-dark.png
- [bassa] scoperte__pc-dark.png — come il chiaro; badge contatori «4» grigio su nero leggibili. Nessun difetto specifico del tema scuro.

## sonno-pasti__pc-light.png
- [media] sonno-pasti__pc-light.png — «Promemoria nell'app · Sonno · Dalle 05:00 alle 14:00» — senza spiegazione non si capisce cosa ricordi (chiedere a che ora hai dormito?) né perché proprio quella fascia — sottotitolo «Ti chiediamo com'è andato il sonno tra le 05:00 e le 14:00».
- [media] sonno-pasti__pc-light.png — rimozione pasto — qui «×», nel pannello della giornata un cestino, e i campi qui sono pillole mentre nel pannello giornata sono campi bianchi con select nativi: stessa funzione, interfaccia diversa — un unico componente pasti.
- [bassa] sonno-pasti__pc-light.png — valori ora in nero e durate in viola nella stessa riga — colori incoerenti (vedi schede).
- [bassa] sonno-pasti__pc-light.png — «8h» senza spazio, altrove «1 h 30» con spazio — uniformare la formattazione delle durate.
- [bassa] sonno-pasti__pc-light.png — «Dalle» rientrato e «alle» schiacciato tra i campi (come in Promemoria) — allineare.

## sonno-pasti__pc-dark.png
- [bassa] sonno-pasti__pc-dark.png — come il chiaro; pillole orario grigio-viola scuro su grigio con contrasto basso tra pillola e riga.

## timer-concentrazione__pc-light.png
- [media] timer-concentrazione__pc-light.png — tema — in tema chiaro lo schermo di concentrazione è comunque nero: scelta forse voluta, ma il pulsante «Pausa» lilla chiarissimo su nero abbaglia e stona — se la modalità è sempre scura, usare pulsanti del tema scuro (Pausa grigio scuro con testo viola).
- [media] timer-concentrazione__pc-light.png — «Pausa» e «Fatto» — due pulsanti a tutta larghezza di peso simile uno sopra l'altro: «Fatto» (chiude l'attività) è più evidente di «Pausa» e vicinissimo, rischio di chiusura accidentale — Pausa come pulsante principale tondo sotto il timer, «Fatto» secondario.
- [bassa] timer-concentrazione__pc-light.png — anello di avanzamento — quadrato arrotondato grigio scuro senza alcuna porzione colorata a 25:00: non si capisce che è una barra di avanzamento — mostrare la traccia colorata piena all'avvio.
- [bassa] timer-concentrazione__pc-light.png — icone — «Termina sessione» usa il calendario con × (lo stesso di «Termina l'abitudine») e «Cambia timer» la stessa freccia circolare di «Pomodoro»: metafore confuse — icona stop ■ per terminare, icona «scambia» per cambiare.
- [bassa] timer-concentrazione__pc-light.png — su computer mancano scorciatoie (Spazio = pausa, Esc = esci) e non sono indicate — aggiungerle con suggerimento.

## timer-concentrazione__pc-dark.png
- [bassa] timer-concentrazione__pc-dark.png — identico al chiaro tranne «Pausa» grigio-viola (qui coerente); restano i difetti di gerarchia Pausa/Fatto, icone e assenza di scorciatoie.

## timer-scelta__pc-light.png
- [media] timer-scelta__pc-light.png — opzioni «Avvio rapido 5 min / Sessione 25 min / Pomodoro 25 + 5 min / Cronometro» — nessuna descrizione: la differenza tra «Avvio rapido» e «Sessione» non è comprensibile — una riga di sottotitolo per ciascuna («Parti con 5 minuti, poi decidi se continuare»).
- [bassa] timer-scelta__pc-light.png — titolo «Timer» — non dice per quale attività si avvia — «Timer per: Ripasso flashcard».
- [bassa] timer-scelta__pc-light.png — icone in riquadri con bordo — sembrano caselle di selezione — icone senza riquadro o con fondo tenue.
- [bassa] timer-scelta__pc-light.png — manca un'opzione «Ricorda la scelta» (oggi va cercata in Impostazioni › Timer › «Chiedi sempre») — aggiungere una casella in fondo.

## timer-scelta__pc-dark.png
- [bassa] timer-scelta__pc-dark.png — come il chiaro; in scuro i riquadri delle icone con bordo grigio accentuano l'aspetto da casella di selezione.

## trascinamento-in-corso__pc-light.png
- [alta] trascinamento-in-corso__pc-light.png — menu laterale — durante il trascinamento il menu non arriva più in fondo allo schermo: termina a y≈740 con uno stacco visibile e il piè di pagina («Dati salvati…», «Profilo e impostazioni») risale di ~60px — il menu deve restare a tutta altezza (position: fixed / height: 100dvh) indipendentemente dallo scorrimento.
- [media] trascinamento-in-corso__pc-light.png — zona «Togli l'orario» — sborda a destra oltre la colonna dei contenuti (fino a x≈1256, vicino al bordo della finestra) e copre il calendario — ancorarla dentro la colonna (in basso, a tutta larghezza della colonna) o sopra l'elenco «Senza orario».
- [media] trascinamento-in-corso__pc-light.png — anteprima di rilascio 12:45–14:15 — si sovrappone al «Pranzo» senza alcun avviso di conflitto — evidenziare la sovrapposizione (bordo arancio, «si sovrappone al pranzo»).
- [bassa] trascinamento-in-corso__pc-light.png — etichetta fluttuante «alle 12:45» e anteprima «12:45–14:15» — informazione duplicata in due punti distanti — tenere solo l'anteprima con orario, o far seguire l'etichetta al cursore.
- [bassa] trascinamento-in-corso__pc-light.png — intestazione — la pagina è scorsa e la barra delle schede è tagliata in alto — mantenere l'intestazione fissa durante il trascinamento.

## Riassunto

Ho guardato tutti gli 82 screenshot dell'elenco. Ho trovato difetti reali, nessuno bloccante. I temi più gravi sono questi: dati che non coincidono tra viste, orientamento nel menu laterale, componenti e verbi diversi per la stessa funzione, e lo spazio del computer usato come su un telefono stirato.

### Gravità alta
1. **Dati incoerenti tra schermate.** Andamento mostra «38 giorni di fila» ma nella striscia il venerdì è vuoto. Agosto ha «18 giorni attivi» nella vista Mese e «17» nella vista Anno. Il «1 di 2 fatte» di Adesso non corrisponde a nessun altro conteggio («0 di 3» abitudini, 3 attività con orario). Il «2 di 3» del Piano del giorno mostra solo 2 elementi. (andamento, giornata-mese/anno, oggi-adesso, rituale-piano)
2. **Menu laterale.** Durante il trascinamento non arriva più in fondo e il piè di pagina risale di circa 60px (trascinamento-in-corso). In Profilo › Diario risulta evidenziata «Andamento», mentre in Profilo nessuna voce è evidenziata (diario, profilo, menu-oggi-avatar).
3. **La lista «Da fare» non ha caselle di completamento.** L'unica azione visibile è «+ Oggi» (attivita-dafare).
4. **In chiaro i campi «Link della playlist» di Impostazioni › Musica sono invisibili.** Non hanno bordo e hanno lo stesso fondo del gruppo (imp-musica).
5. **Fine giornata: il nome dell'area e la scala 1–5 stanno su due righe ai lati opposti.** L'occhio va a zig-zag e il rituale diventa lunghissimo (rituale-sera).

### Gravità media, raggruppati per tema
- **Componenti incoerenti per la stessa funzione.**
  - Selettore area: select nativo con ⌄ in grassetto, pillola grigia, pillola viola, chip bianca.
  - Rimozione di un valore: × dentro la pillola, × fuori, cestino.
  - Scala 1–5: pulsanti grandi in Check-in, quadratini in Fine giornata.
  - Completamento: cerchi grandi in Abitudini, quadratini in Mese, caselle a destra nei blocchi e a sinistra nell'elenco.
  - Statistiche: tre varianti diverse (Anno, Mese, Settimana).
  - Sonno e pasti: tre interfacce diverse (pannello della giornata, rituale, profilo).
- **Verbi e colori incoerenti per «conferma».** Si trovano «Fatto» verde, «Fatto» viola, «Salva +5 XP» e «Registra +3 XP». Il grande «✓ Fatto» verde sembra uno stato già raggiunto, non un'azione. Nella scheda dell'attività invece c'è solo un link grigio «Segna come non fatta». «Salta oggi» ha tre forme diverse.
- **Controlli nativi non stilizzati.** Select di area e durata («15 min ⌄»), chevron di sistema (attivita-dafare-aggiunta, giornata-sonno-aperto, impostazioni, scheda-attivita, scheda-scoperta).
- **Numeri senza etichetta.** «1 di 3» (passi), «79», «7/25/17» sui mesi, «4/8», «Backup 1», «🔥3», «record 4», «energia 4» senza scala, «XP».
- **Testi italiani ambigui o poco naturali.**
  - «Se prosegui, altri», «Pausa lunga dopo 4 blocchi: Nessuna».
  - «Sincronizzazione: su questo dispositivo», «Promemoria: bloccati», «Non ce l'ho fatta».
  - «notato una volta / lo noto ogni volta / misurato» (forme grammaticali diverse), domande senza «?».
  - «e un'altra», «Orari abituali», «Un minuto».
- **Uso dello spazio su computer.** Colonna unica da 880px con metà schermo vuota (Abitudini, Da sistemare, Rituali, Profilo). Selettore dei giorni e striscia settimanale stirati con spazi di 90px. Griglia «Costanza» piccola in una card enorme. Finestre larghe 460px che mandano a capo i titoli. Le impostazioni sono finestre impilate e non una pagina con menu laterale.
- **Calendario.**
  - Vista Giorno: manca la data accanto a «Oggi».
  - Vista Settimana: le etichette delle ore sono ~11px sopra la riga corrispondente.
  - La linea «adesso» e il badge coprono il testo dei blocchi; «Camminata /…» è troncato.
  - La fascia del sonno non ha etichetta; il blocco da 30 minuti è troppo basso e la casella tocca il bordo.
  - L'anteprima di trascinamento non segnala la sovrapposizione col pranzo; «Togli l'orario» sborda fuori dalla colonna.
- **Affordance poco chiare.** Etichette disegnate come pulsanti («concluso», «Focus…», pollici nelle scoperte, icone dei timer). Elenco «In coda» senza hover. Riga riassuntiva del sonno criptica. Icone ↶ ripetute nel Diario. «Aggiungi» attivo con il campo vuoto. Cestino attaccato all'interruttore nelle Aree. Mancano «Salva» e «Invio» nella finestra della nota e le scorciatoie da tastiera (smistamento, timer).
- **Grafici.** Le etichette «media» si sovrappongono ai punti, l'asse x non ha date, la mappa «Costanza» non ha giorni e mesi, i pallini colorati del mese non hanno legenda, il calendario dell'abitudine non ha nome del mese.

### Gravità bassa e tema scuro
- **Stato selezionato poco riconoscibile in scuro.** Segmenti e schede attive sono un grigio medio pieno, mentre il menu laterale usa il viola.
- **Contrasto basso in scuro.** Celle vuote e giorni futuri, caselle su blocchi colorati (oliva), interruttori spenti o disabilitati indistinguibili, campi di testo senza bordo nei rituali, pulsanti disabilitati, testo barrato.
- **Effetti visivi in scuro.** Ombre che sbordano come aloni (scheda attiva, card «adesso»), velo dietro le finestre quasi nero, mentre in chiaro la pagina sotto resta leggibile.
- **Schermo di concentrazione.** In tema chiaro resta nero con un pulsante «Pausa» lilla che abbaglia. «Fatto» è troppo vicino e troppo evidente rispetto a «Pausa».
- **Dettagli di allineamento e spaziatura.** Divisore rientrato nella finestra della nota, «Dalle» rientrato nei promemoria, filtro «Tutte» attaccato all'intestazione, pagina che scorre da sola all'apertura delle schede, × non allineata al titolo, formati delle durate incoerenti («8h» / «1 h 30»).
