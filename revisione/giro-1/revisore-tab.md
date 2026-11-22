# Revisione UX/UI — tablet 834×1112 (tema chiaro)

## oggi-adesso__tab-light.png
- [gravità: alta] oggi-adesso__tab-light.png — card centrale «Ripasso flashcard» (x≈108–726) — la card principale è larga ~620px e centrata, mentre tutto il resto (riga «Pianifica la giornata», sezione «Poi», titolo data) va a tutta larghezza 16–818: tre larghezze diverse nella stessa colonna, la card sembra "galleggiare" fuori griglia — portare tutto a una sola colonna di contenuto (es. max 640–680px centrata) oppure la card a tutta larghezza come le righe sopra/sotto.
- [gravità: alta] oggi-adesso__tab-light.png — metà inferiore dello schermo (y≈650–1030) — ~380px di vuoto: su tablet la schermata «Adesso» usa meno di metà dell'altezza; layout pensato per telefono — sfruttare lo spazio (seconda colonna con «Poi»/agenda della giornata, o centrare verticalmente il blocco focus, o mostrare più elementi in «Poi»).
- [gravità: media] oggi-adesso__tab-light.png — riga data: «Martedì 18 agosto» + barra 1/2 + badge fiamma «38» a destra — la barra di avanzamento è lunga solo 190px e il contatore «1/2» è staccato e senza etichetta (1/2 di cosa?); la fiamma 38 non dice cosa conta — aggiungere etichetta («1 di 2 fatte», «38 giorni di fila») o tooltip, allungare la barra o allinearla al badge.
- [gravità: media] oggi-adesso__tab-light.png — card focus: chip «Abitudine» su riga propria tra categoria e titolo — tre livelli di meta-informazione (categoria blu, chip, titolo) prima dell'azione: rumoroso — unire categoria e tipo in una sola riga («Studio / Università · Abitudine»).
- [gravità: media] oggi-adesso__tab-light.png — pulsanti «Timer» (con bordo, sfondo bianco) e «Salta oggi ⏭» (solo testo, icona dopo il testo) — due azioni secondarie affiancate con stili diversi e icona in posizione opposta (prima in Timer, dopo in Salta) — uniformare: stesso stile (ghost/outline) e icona sempre a sinistra.
- [gravità: bassa] oggi-adesso__tab-light.png — riga «Poi»: checkbox 44px con angoli arrotondati grandi accanto a testo 16px — checkbox sproporzionata rispetto alla riga e non allineata verticalmente all'icona sole della riga «Pianifica» (diverse dimensioni 40 vs 44) — usare checkbox 24–28px e uniformare la colonna icone.
- [gravità: bassa] oggi-adesso__tab-light.png — barra in alto: segmentato «Adesso / La giornata / Rituali» con badge «1» PRIMA della parola Rituali — il badge numerico prima del testo è insolito (di solito dopo) e il pulsante avatar «R» viola quadrato è alto quanto il segmentato ma non allineato al suo bordo superiore (20 vs 24) — spostare il badge dopo l'etichetta e allineare l'avatar.
- [gravità: bassa] oggi-adesso__tab-light.png — tab bar in basso: il pulsante «+» viola è separato da un divisore verticale ma resta dentro la stessa pillola; l'etichetta «Oggi» attiva è viola e piccola (11px) — su tablet etichette e icone sono minuscole rispetto a una barra larga 800px — aumentare dimensioni o usare una sidebar/rail su tablet.

## oggi-adesso-scorsa__tab-light.png
- [gravità: bassa] oggi-adesso-scorsa__tab-light.png — intero schermo — identico a oggi-adesso: il contenuto non scorre perché è più corto dello schermo; conferma che su tablet la pagina «Adesso» lascia metà schermo vuota (vedi difetti di oggi-adesso) — nessun difetto aggiuntivo; valutare se mostrare qui il resto della giornata/«Fatte oggi» in fondo.

## giornata-giorno__tab-light.png
- [gravità: alta] giornata-giorno__tab-light.png — barra di navigazione in basso (y≈1075–1112) — la tab bar è spinta in basso e tagliata: le etichette «Oggi», «Attività», «Andamento» sono mozzate a metà e il pulsante «+» esce dal bordo destro/inferiore; in «Adesso» la stessa barra è a y≈1037 e intera — la barra deve restare fissa nella stessa posizione in tutte le schermate (position fixed + safe area), mai spostata dal contenuto.
- [gravità: media] giornata-giorno__tab-light.png — riga ora 07:00 (y≈280–308) — fascia tratteggiata senza etichetta: non si capisce che è il sonno/risveglio (sveglia 07:30) — aggiungere etichetta «Sonno» o icona letto, come per Colazione/Pranzo/Cena.
- [gravità: media] giornata-giorno__tab-light.png — blocco «Organizzare cena con il gruppo» 09:30–11:00 — è barrato (fatto) ma la linea dell'ora attuale 10:30 lo attraversa e il badge «10:30» si sovrappone al bordo destro del blocco; il titolo è allineato in alto alle 10:00 invece che alle 09:30 (il blocco inizia a y≈420 ≈ 09:30 ma il testo appare all'altezza di 10:00) — tenere il badge dell'ora nella colonna degli orari a sinistra (come Google Calendar/Apple) e allineare il testo al bordo superiore del blocco.
- [gravità: media] giornata-giorno__tab-light.png — blocco «Camminata / movimento» — stile diverso dagli altri (solo bordo verde, sfondo bianco, senza barra colorata a sinistra) senza legenda: l'utente non capisce che "contorno" = abitudine — uniformare forma dei blocchi e distinguere l'abitudine con l'icona già presente, oppure aggiungere una legenda.
- [gravità: media] giornata-giorno__tab-light.png — abitudine «Ripasso flashcard» mostrata in «Adesso» non appare nel calendario del giorno — incoerenza tra le due viste — mostrare anche le abitudini senza orario in una fascia «In giornata» in cima al calendario.
- [gravità: media] giornata-giorno__tab-light.png — riga sonno/pasti «🛏 23:30 → 07:30 · 8h · ☕ 🍴 🍴» — sequenza di icone criptiche senza testo, chevron a destra poco evidente — scrivere «Sonno 23:30–07:30 (8 h) · 3 pasti» e rendere l'affordance più chiara.
- [gravità: bassa] giornata-giorno__tab-light.png — sotto-segmentato «Giorno/Settimana/Mese/Anno» — stile diverso dal segmentato superiore (icona sopra il testo, pillola viola chiara, testo 11px) — due controlli di navigazione dello stesso tipo con aspetto diverso; usare lo stesso componente (anche in versione più piccola).
- [gravità: bassa] giornata-giorno__tab-light.png — calendario: la griglia occupa 800px di larghezza per blocchi con testo di 20 caratteri; il riquadro bianco del calendario ha margine sinistro 16 ma le etichette orarie sono attaccate al bordo (x≈20) — aumentare il padding interno a sinistra (≥12px) per gli orari.
- [gravità: bassa] giornata-giorno__tab-light.png — maniglie di trascinamento «⋮⋮» dentro ogni blocco — su tablet con touch l'icona è minuscola (8px) e duplicata in ogni blocco: rumore visivo — rendere trascinabile tutto il blocco con pressione prolungata e togliere la maniglia o mostrarla solo in modalità modifica.

## giornata-giorno-fondo__tab-light.png
- [gravità: alta] giornata-giorno-fondo__tab-light.png — tab bar in basso — ancora tagliata (etichette «Oggi/Attività/Andamento» mozzate, «+» fuori schermo a destra e in basso) — vedi giornata-giorno: fissare la barra con safe-area.
- [gravità: media] giornata-giorno-fondo__tab-light.png — sezione «Senza orario» sotto il calendario (y≈830–900) — «Ripasso flashcard» (che è l'elemento di focus in «Adesso») è sepolto in fondo dopo 18 ore di griglia; rettifica alla nota precedente: c'è, ma irraggiungibile senza scorrere tutto — spostare «Senza orario» in cima, sopra la griglia (come la fascia "tutto il giorno" di Apple Calendar).
- [gravità: media] giornata-giorno-fondo__tab-light.png — riga «Ripasso flashcard» — ha checkbox quadrata + icona libro blu + icona orologio blu a destra: l'orologio non ha etichetta (assegna orario? avvia timer?) e l'icona libro non corrisponde all'icona «abitudine» (↻ verde) usata nella griglia per le altre abitudini — usare la stessa icona di tipo ovunque e dare all'orologio un'etichetta («Dai un orario»).
- [gravità: media] giornata-giorno-fondo__tab-light.png — blocco «Leggere 20 minuti» alle 22:00 — è alto solo ~24px, senza orario sotto il titolo, mentre gli altri blocchi mostrano «18:00–18:45»; incoerente — mostrare sempre l'orario (anche in riga col titolo per i blocchi brevi).
- [gravità: media] giornata-giorno-fondo__tab-light.png — campo «Nuova attività...» + pulsante «+ Aggiungi» — pulsante viola chiaro alto quanto il campo meno 8px, con margine destro diverso dal sinistro (testo a 31px, pulsante a 7px dal bordo) — rendere il pulsante interno coerente (padding uguale sui 4 lati) o metterlo fuori dal campo; puntini di sospensione nel placeholder da evitare («Nuova attività»).
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — link «Sposta 1 non fatta a domani» — italiano zoppo («1 non fatta») — «Sposta a domani l'attività non fatta» / «Sposta a domani (1)».
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — badge contatore «1» accanto a «Senza orario» — grigio, piccolo, diverso dal badge «1» viola di Rituali e dal badge «6» pieno di Attività: tre stili di contatore — un solo stile di badge.
- [gravità: bassa] giornata-giorno-fondo__tab-light.png — fondo del calendario: fascia tratteggiata del sonno 23:30–00:00 di nuovo senza etichetta e la griglia finisce a 00:00 senza indicare il sonno successivo — etichetta «Sonno».

## giornata-settimana__tab-light.png
- [gravità: alta] giornata-settimana__tab-light.png — intestazione fissa con striscia giorni L–D (y≈0–110) — l'intestazione appiccicata non ha sfondo opaco/sfumato sufficiente: la riga «Agenda per il direttivo» passa sotto i numeri 17/18 e resta leggibile a metà (sovrapposizione testo su testo); la riga «4 di 24 fatte questa settimana» è attaccata al bordo superiore (y≈18) senza safe-area e la segmentata «Adesso/La giornata» e «Giorno/Settimana…» spariscono scorrendo — dare all'header sticky sfondo pieno + ombra/divisore, padding superiore, e tenere visibili i controlli di vista.
- [gravità: media] giornata-settimana__tab-light.png — liste giornaliere — vista «Settimana» su tablet è solo una lista verticale a tutta larghezza (800px) di righe con testo corto: nessuna griglia a 7 colonne, lo spazio orizzontale è sprecato e non si confrontano i giorni — su tablet usare una griglia a colonne (7 giorni o 2–3 colonne di card).
- [gravità: media] giornata-settimana__tab-light.png — righe senza orario («Ripasso flashcard», «Organizzare cena», «Inbox a zero») — il testo parte più a sinistra rispetto a quelle con orario? No: resta indentato ma la colonna orario è vuota; l'icona dell'abitudine «Ripasso flashcard» è ↻ BLU mentre le altre abitudini hanno ↻ VERDE — colore incoerente senza motivo comprensibile — stesso colore per tipo, oppure colore = area con legenda.
- [gravità: media] giornata-settimana__tab-light.png — azione «Sposta» in viola a destra solo su alcune righe — non si capisce perché alcune righe abbiano «Sposta» e altre no, e su un giorno passato (lunedì) — esplicitare («Sposta a oggi») o metterlo in menu contestuale/swipe.
- [gravità: bassa] giornata-settimana__tab-light.png — anelli di progresso intorno a 17 e 18 — il 17 ha anello verde quasi chiuso, il 18 è pieno viola con piccolo arco verde: due significati sovrapposti (selezionato + progresso) poco leggibili — separare indicatore di selezione (pillola) e progresso (anello sottile o punto).
- [gravità: bassa] giornata-settimana__tab-light.png — «4 di 24 fatte questa settimana» — numero «4» in grassetto e resto grigio piccolo, testo attaccato al bordo sinistro dei numeri del calendario — allineare con il margine di 20px degli header di giorno e dargli più aria.
- [gravità: bassa] giornata-settimana__tab-light.png — chevron «>» a destra delle intestazioni giorno (Martedì 18, Mercoledì 19…) — la riga dell'intestazione è toccabile ma non sembra un pulsante — rendere l'intera intestazione area di tocco evidente o togliere il chevron e usare «Apri giorno».

## giornata-mese__tab-light.png
- [gravità: media] giornata-mese__tab-light.png — bordo superiore (y≈0–40) — il segmentato «Adesso/La giornata/Rituali» e l'avatar sono tagliati in alto (manca il margine superiore che c'è in «Giorno», y=20) — mantenere lo stesso padding superiore/safe-area in tutte le viste.
- [gravità: media] giornata-mese__tab-light.png — navigazione mese «‹ Agosto 2026 ›» — pulsanti quadrati con angoli arrotondati e titolo allineato a sinistra, mentre in «Giorno» i pulsanti sono cerchi e il titolo «Oggi» è centrato — stesso componente di navigazione periodo in tutte le viste.
- [gravità: media] giornata-mese__tab-light.png — lista «Oggi» (y≈690–990) — l'ordine non è cronologico (22:00, senza orario, 18:00, 09:30, 15:00) — ordinare per orario, con le senza orario in cima o in fondo raggruppate.
- [gravità: media] giornata-mese__tab-light.png — quadratini colorati a sinistra di ogni riga della lista — per le abitudini sono quadrati vuoti con bordo (sembrano checkbox), per le attività quadrati pieni: sembrano toccabili ma sono solo il colore dell'area; e l'attività fatta non ha checkbox spuntata — usare un pallino colore (come in Settimana) separato da una vera checkbox.
- [gravità: media] giornata-mese__tab-light.png — griglia mese: giorni con anelli verdi di riempimento diverso + puntini colorati sotto (rosa, rosso, arancio, viola, verde, blu) — nessuna legenda per anelli né puntini; i puntini sono 4px, illeggibili — aggiungere legenda o tooltip al tocco e ingrandire gli indicatori.
- [gravità: bassa] giornata-mese__tab-light.png — riepilogo «18 giorni attivi  58 cose fatte» — numeri grandi e etichette grigie su una riga senza contenitore, allineato a 20px mentre la card sotto è a 16px — allineare al margine della card; «cose fatte» è colloquiale: «attività completate».
- [gravità: bassa] giornata-mese__tab-light.png — card mese: ultima riga «31» da sola e ~40px di padding inferiore vuoto; la selezione del 18 è un rettangolo grigio molto più largo del cerchio viola — doppio indicatore di selezione — tenere solo il cerchio pieno.
- [gravità: bassa] giornata-mese__tab-light.png — «Sposta» su «Confrontare piani telefonici» delle 15:00 alle 10:30 — proporre di spostare un'attività non ancora scaduta confonde — mostrarlo solo per attività passate o in menu.

## giornata-anno__tab-light.png
- [gravità: media] giornata-anno__tab-light.png — bordo superiore — segmentato a y≈4: ancora padding superiore diverso da Giorno (20) e Mese (tagliato) — padding superiore unico.
- [gravità: media] giornata-anno__tab-light.png — numeri verdi in alto a destra delle card mese («7», «25», «17») — numeri senza unità né legenda (giorni attivi? cose fatte?) — aggiungere unità («25 giorni») o icona e una legenda per l'intensità del verde (meno → più).
- [gravità: media] giornata-anno__tab-light.png — mini-calendari dei mesi — nessuna intestazione dei giorni della settimana e i mesi a 6 righe (Mar, Ago, Nov) hanno altezza diversa dagli altri lasciando spazio vuoto variabile sotto — riservare sempre 6 righe o centrare verticalmente; aggiungere iniziali L M M G V S D almeno nella prima riga di card.
- [gravità: media] giornata-anno__tab-light.png — riepilogo «49 giorni attivi | 82 fatte | 1874 XP» — «XP» non è spiegato in nessun punto e «fatte» senza sostantivo — «82 attività completate», «1.874 punti» (con separatore delle migliaia italiano) e spiegare i punti.
- [gravità: bassa] giornata-anno__tab-light.png — card «Scadenze» in fondo (y≈930–1025) — tocca quasi la tab bar (12px) e il titolo «Scadenze» è più grande dei titoli dei mesi e dei titoli sezione di altre viste («Oggi» in Mese) — uniformare la scala tipografica dei titoli di sezione e aggiungere spazio sotto per la tab bar.
- [gravità: bassa] giornata-anno__tab-light.png — riga «7 set · Trovare lavoro per agosto» con icona valigetta viola a destra — l'icona dell'area è isolata all'estremo destro lontano dal testo (600px) — metterla prima del titolo come nelle altre liste.
- [gravità: bassa] giornata-anno__tab-light.png — mese corrente «Ago» con bordo viola e giorno 18 con bordo scuro sottile — il bordo del giorno è quasi invisibile — evidenziare oggi con contorno viola più spesso.

## giornata-sonno-aperto__tab-light.png
- [gravità: alta] giornata-sonno-aperto__tab-light.png — campi orario «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM» — formato 12 ore AM/PM in un'app italiana, mentre l'intestazione e il calendario usano 23:30/07:30 (24 ore) — usare sempre il formato 24 ore (locale it-IT) nei time picker.
- [gravità: alta] giornata-sonno-aperto__tab-light.png — select durata pasti «15 mir», «45 mi» — testo troncato dentro le tendine (larghe ~75px) — allargare la select o scrivere «15 min» con font più piccolo/padding ridotto.
- [gravità: media] giornata-sonno-aperto__tab-light.png — righe Colazione/Pranzo/Cena — controlli spinti all'estremo destro (x≈590–800) con etichette all'estremo sinistro: 500px di vuoto in mezzo, l'occhio deve attraversare tutto lo schermo; i campi «A letto»/«Sveglia» invece sono larghi 315px ciascuno: due logiche di larghezza nello stesso pannello — usare una griglia compatta (etichetta + campi ravvicinati, larghezza max ~520px) coerente per sonno e pasti.
- [gravità: media] giornata-sonno-aperto__tab-light.png — azioni «+ Pasto», «Ripristina», «Ritmo di base» — tre link viola identici di significato diverso (aggiungi, annulla, naviga?) — «Ritmo di base» non si capisce (va al profilo? applica il predefinito?) — differenziare: «+ Aggiungi pasto» come pulsante, «Ripristina» come azione secondaria grigia, «Modifica orari abituali ›» come link di navigazione.
- [gravità: media] giornata-sonno-aperto__tab-light.png — pannello aperto — mancano un titolo esplicito («Sonno e pasti di oggi») e un'indicazione che le modifiche valgono solo per oggi; la riga riassunto di icone resta in alto duplicando le stesse info dei campi sotto — sostituire la riga riassunto con un titolo quando il pannello è aperto.
- [gravità: bassa] giornata-sonno-aperto__tab-light.png — icona cestino grigia minuscola (12px) accanto alle select — area di tocco insufficiente su tablet — target ≥ 44px.
- [gravità: alta] giornata-sonno-aperto__tab-light.png — tab bar in basso — di nuovo tagliata con etichette mozzate e «+» fuori schermo.

## giornata-scheda-blocco__tab-light.png
- [gravità: alta] giornata-scheda-blocco__tab-light.png — titolo del foglio «Organizzare cena / con il gruppo» (y≈655–715) — il titolo va a capo dopo ~200px pur avendo 800px disponibili: larghezza del titolo limitata come su telefono — lasciare al titolo tutta la larghezza del foglio (o limitare il foglio a ~600px centrato).
- [gravità: alta] giornata-scheda-blocco__tab-light.png — foglio a tutta larghezza (834px) che parte dal basso — su tablet un bottom sheet a piena larghezza è un pattern da telefono; Apple/Material usano un foglio centrato (form sheet ~540–600px) o un pannello laterale — presentare la scheda come modale centrata o pannello laterale destro accanto al calendario.
- [gravità: media] giornata-scheda-blocco__tab-light.png — campo «Ora 09:30 AM» — formato 12h (AM) in contrasto con «09:30–11:00» del calendario — formato 24h.
- [gravità: media] giornata-scheda-blocco__tab-light.png — pillole valore «09:30 AM ⊗», «1 h 30 ⊗», «Relazioni & Sociale» — colori del testo diversi (nero per l'ora, viola per durata e area) e solo due hanno la ⊗ — uniformare stile dei valori; la ⊗ di «Ora» rimuove l'orario? Non è chiaro — usare etichetta «Togli orario» o menu.
- [gravità: media] giornata-scheda-blocco__tab-light.png — «↶ Togli la spunta» centrato da solo tra titolo e campi — è l'unico indizio che l'attività è fatta; manca uno stato visivo chiaro («Fatta alle 10:12») e l'azione sembra un titolo — mostrare stato «✓ Fatta» + pulsante secondario «Segna come da fare».
- [gravità: bassa] giornata-scheda-blocco__tab-light.png — sottotitolo «Attività · Oggi» — ridondante con il campo Ora, e non mostra il colore dell'area — sostituire con un chip area colorato.
- [gravità: bassa] giornata-scheda-blocco__tab-light.png — «Sposta in Da fare» — formulazione poco chiara (toglie dal calendario?) — «Togli dal calendario» / «Rimetti tra le cose da fare».
- [gravità: bassa] giornata-scheda-blocco__tab-light.png — foglio: nessun pulsante «Chiudi»/«Fine», solo maniglia; su tablet con tastiera/mouse serve una X o «Fine» in alto a destra.

## giornata-scheda-abitudine__tab-light.png
- [gravità: alta] giornata-scheda-abitudine__tab-light.png — pulsante primario «✓ Fatta» viola a tutta larghezza (800px) — nella schermata «Adesso» la stessa azione è «✓ Fatto» VERDE: colore e genere grammaticale diversi per la stessa azione — un solo stile (verde = completare) e una sola parola («Fatto»); pulsante con larghezza max ~360px su tablet.
- [gravità: media] giornata-scheda-abitudine__tab-light.png — «Finisce qui» — azione criptica (termina l'abitudine da oggi in poi? per sempre?) e distruttiva senza colore di avviso — «Interrompi l'abitudine da oggi» con conferma; «Togli solo da oggi» → «Salta oggi» (stessa parola usata in «Adesso»).
- [gravità: media] giornata-scheda-abitudine__tab-light.png — «Ora 06:00 PM» — formato 12h (vedi altre schede) — 18:00.
- [gravità: media] giornata-scheda-abitudine__tab-light.png — foglio a tutta larghezza da telefono (vedi scheda-blocco) e nessuna X di chiusura — usare foglio centrato/pannello laterale.
- [gravità: bassa] giornata-scheda-abitudine__tab-light.png — pillole valore di larghezze diverse (Ora 118px, Durata 110px, Area 165px) e colore testo diverso (nero/viola/viola) — allineare stile e lasciar crescere a contenuto ma con stesso colore.
- [gravità: bassa] giornata-scheda-abitudine__tab-light.png — confronto con scheda-blocco: qui il titolo sta su una riga sola, là va a capo a 200px — larghezza titolo incoerente fra le due schede.
- [gravità: bassa] giornata-scheda-abitudine__tab-light.png — icona «↻ Abitudine · Oggi» minuscola (10px) e grigio chiaro — contrasto basso.

## rituali__tab-light.png
- [gravità: alta] rituali__tab-light.png — y≈395–1030 — 2/3 dello schermo vuoto: 5 righe in una lista a tutta larghezza — su tablet mostrare i rituali come griglia di card (2 colonne) con descrizione, durata e stato, oppure lista a sinistra + rituale aperto a destra (master-detail).
- [gravità: media] rituali__tab-light.png — badge «1» su «Rituali» nel segmentato — presente nelle altre schede ma sparisce quando la scheda è attiva, e conta 1 mentre i rituali «da fare» sono 3 e «da compilare» 1 — chiarire cosa conta il badge e mantenerlo coerente.
- [gravità: media] rituali__tab-light.png — stati a destra: «da fare / 2 di 3 scelte», «da compilare / 0 di 4», «✓ fatto», «da fare» — 4 formati diversi, testo minuscolo (11px) e minuscole iniziali; «2 di 3 scelte» con stato «da fare» è contraddittorio (è iniziato) — usare un componente di stato unico: chip «Da fare» / «In corso 2/3» / «Fatto ✓».
- [gravità: media] rituali__tab-light.png — «Review della sera», «Review della settimana», «Check-in» — anglicismi in un'app italiana — «Bilancio della sera», «Revisione settimanale», «Come stai?».
- [gravità: bassa] rituali__tab-light.png — icona di «Piano del giorno» piena viola, le altre su fondo viola chiaro — non si capisce se indica selezione, priorità o "suggerito ora" — uniformare o spiegare (es. etichetta «Ora»).
- [gravità: bassa] rituali__tab-light.png — chevron «⌄» (fisarmonica) — aprire un rituale dentro una lista che si espande è scomodo per flussi lunghi — usare navigazione a pagina/pannello.

## rituale-piano__tab-light.png
- [gravità: alta] rituale-piano__tab-light.png — contenuto del rituale aperto (y≈150–460) — manca qualunque istruzione: due attività elencate senza titolo («Le tue 3 priorità di oggi»), si dice «2 di 3 scelte» ma ne sono visibili 2 e non si capisce come sceglierne una terza né cosa significhi «Priorità» — aggiungere domanda guida in testa («Quali sono le 3 cose più importanti di oggi?») e slot numerati 1/2/3.
- [gravità: media] rituale-piano__tab-light.png — riga «Organizzare cena con il gruppo» barrata con chip «☆ Priorità» viola e icona persone rosa; riga «Confrontare piani telefonici» con sola icona carta gialla — le righe hanno margine sinistro 32 (non allineato all'icona del rituale a 30 né al titolo a 76) e icone d'area senza testo — allineare il contenuto al titolo (x=76) o al bordo card con padding uniforme; dare etichetta alle icone o usare pallini colore coerenti con il resto.
- [gravità: media] rituale-piano__tab-light.png — campo «Aggiungi un'altra...» + «+ Aggiungi» — stesso pattern di giornata-giorno-fondo ma qui il campo è grigio pieno senza bordo, là bianco con bordo e pulsante viola chiaro: due stili per lo stesso componente — unificare il componente "aggiungi in linea".
- [gravità: media] rituale-piano__tab-light.png — pulsante «💾 Salva +5 XP» a tutta larghezza (770px) — icona floppy datata, «+5 XP» in piccolo attaccato al testo, pulsante enorme su tablet — «Salva il piano» con larghezza contenuta; ricompensa XP come chip separato o feedback dopo il salvataggio.
- [gravità: bassa] rituale-piano__tab-light.png — etichetta «Quando inizi?» e placeholder «Es. alle 9:00, alla scrivania» — campo testo libero per un'intenzione d'implementazione: va bene ma l'etichetta è piccola (12px grassetto) rispetto ai titoli — e il placeholder è l'unica spiegazione — aggiungere microcopy.
- [gravità: bassa] rituale-piano__tab-light.png — y≈720–1030 vuoto — come in rituali, layout da telefono su tablet.

## rituale-sonno-pasti__tab-light.png
- [gravità: alta] rituale-sonno-pasti__tab-light.png — due pulsanti di conferma nello stesso rituale: «Salva» (viola chiaro piccolo, sotto il sonno) e «Fatto» (viola pieno a tutta larghezza, in fondo) — non è chiaro se «Fatto» salva anche il sonno o se bisogna premere prima «Salva» — un solo pulsante finale che salva tutto; se serve conferma parziale, salvataggio automatico.
- [gravità: alta] rituale-sonno-pasti__tab-light.png — orari «11:30 PM», «07:30 AM» a fianco di «Come sempre · 23:30–07:30» — due formati orari nella stessa card — 24h ovunque.
- [gravità: media] rituale-sonno-pasti__tab-light.png — «Come sempre · 23:30–07:30» in viola a destra della label «Sonno» — sembra un link ma non si capisce cosa fa (applica l'orario abituale? è uno stato?) — pulsante esplicito «Uguale al solito» o chip selezionabile.
- [gravità: media] rituale-sonno-pasti__tab-light.png — pulsanti pasti «sì / no / 🕒» — minuscole, grigi tutti uguali, nessuno stato selezionato visibile; il terzo con solo icona orologio non ha etichetta — «Sì / No / Altro orario», segmentato con stato attivo chiaro.
- [gravità: media] rituale-sonno-pasti__tab-light.png — gerarchia: «Sonno», «Pasti», «Altre cose fatte» sono label grigie 12px mentre «A letto», «Colazione» sono nere 14px grassetto: le sezioni pesano meno delle righe — invertire: titoli di sezione più forti.
- [gravità: media] rituale-sonno-pasti__tab-light.png — «Altre cose fatte» dentro il rituale «Sonno e pasti» — non c'entra col tema; «Non ricordo» accanto a «Salva» con stile link — ok ma posizionato come azione primaria accanto al Salva — spostare «Altre cose fatte» nel check-in/review; «Non ricordo» come opzione secondaria sotto i campi.
- [gravità: bassa] rituale-sonno-pasti__tab-light.png — stato in intestazione «da compilare 0 di 4» — 4 cosa? (sonno + 3 pasti?) — «0 di 4 risposte».
- [gravità: bassa] rituale-sonno-pasti__tab-light.png — controlli orario A letto/Sveglia spinti all'estremo destro a 760px dalle etichette — avvicinare (griglia compatta).

## rituale-checkin__tab-light.png
- [gravità: alta] rituale-checkin__tab-light.png — stato «✓ fatto» nell'intestazione ma nessuno dei pulsanti 1–5 risulta selezionato e il pulsante «Registra +3 XP» è attivo — se il check-in è fatto bisogna mostrare i valori scelti (pulsante evidenziato) oppure lo stato è sbagliato — preselezionare i valori registrati e cambiare il pulsante in «Aggiorna».
- [gravità: media] rituale-checkin__tab-light.png — scale 1–5: pulsanti enormi (148×50) con solo un numero; etichette «1 · esausto / 3 · normale / 5 · pieno» in 10px grigio sotto, distanti dai pulsanti a cui si riferiscono e «5 · concentratissimo» è lunga e spinge l'allineamento — mettere l'etichetta dentro/subito sotto il pulsante corrispondente o usare emoji/icone; «concentratissimo» → «molto concentrato».
- [gravità: media] rituale-checkin__tab-light.png — «Registra» con icona floppy, viola chiaro, vs «Salva» viola pieno nel Piano e «Fatto» nel Sonno — tre parole e tre stili diversi per il pulsante di conferma dei rituali — un'unica etichetta («Salva») e un unico stile primario.
- [gravità: media] rituale-checkin__tab-light.png — grafico «Andamento degli ultimi 14 giorni» — linee interrotte (buco tra 12 e 15 ago) senza spiegazione; doppia legenda (in alto e a destra) ridondante; le etichette a destra «Focus/Umore/Energia» si sovrappongono quasi; l'asse X ha solo 3 date — togliere una delle due legende, segnare i giorni senza dati, più tick sull'asse.
- [gravità: media] rituale-checkin__tab-light.png — il grafico finisce sotto la tab bar (y≈1010–1100): l'ultimo pezzo e il bordo della card sono coperti — padding inferiore pari all'altezza della tab bar.
- [gravità: bassa] rituale-checkin__tab-light.png — «Media recente 4.3» — separatore decimale inglese (punto) — «4,3»; «Media recente» vago — «Media 7 giorni: 4,3».
- [gravità: bassa] rituale-checkin__tab-light.png — terminologia: domanda «Quanto riesci a concentrarti?» e serie «Focus» — usare la stessa parola («Concentrazione»).

## rituale-sera__tab-light.png
- [gravità: alta] rituale-sera__tab-light.png — 8 righe aree con scala 1–5 — nessuna domanda/istruzione: cosa si valuta (soddisfazione? tempo dedicato? progresso?) e cosa significano 1 e 5 — aggiungere domanda «Com'è andata oggi in ogni area?» e ancore «1 male · 5 benissimo»; rendere facoltative le aree non toccate.
- [gravità: media] rituale-sera__tab-light.png — pulsantini 1–5 (36×36) qui, mentre nel Check-in la stessa scala 1–5 usa pulsanti 148×50 con bordo — due componenti diversi per la stessa scala — un unico componente rating (dimensione media, ≥44px).
- [gravità: media] rituale-sera__tab-light.png — scala allineata all'estremo destro, etichette area all'estremo sinistro: 400px di vuoto per riga — su tablet raggruppare (griglia 2 colonne di aree) o avvicinare la scala all'etichetta.
- [gravità: media] rituale-sera__tab-light.png — pulsante «Salva +8 XP» con icona luna, a tutta larghezza; nel check-in l'icona era floppy e il colore viola chiaro — vedi incoerenza pulsanti conferma.
- [gravità: media] rituale-sera__tab-light.png — fondo card (y≈1020–1040) — la riga successiva «Review della settimana» è coperta dalla tab bar: si vede solo il bordo dell'icona — spazio inferiore per la tab bar.
- [gravità: bassa] rituale-sera__tab-light.png — area «Progetti Founder» — anglicismo e maiuscola impropria — «Progetti personali»/«Startup».
- [gravità: bassa] rituale-sera__tab-light.png — «Cosa ti ha bloccato?» — ok; ma le label delle domande sono 12px grigio scuro, più piccole del testo placeholder (16px) — le domande devono pesare più dei placeholder.

## rituale-settimana__tab-light.png
- [gravità: media] rituale-settimana__tab-light.png — statistiche «216 XP guadagnati · 10 azioni completate · 6/7 giorni attivi» — numeri in un font serif (diverso dal sans del resto dell'app, unico caso) e gruppo centrato mentre tutto il contenuto della card è allineato a sinistra — usare il font dell'app e lo stesso componente statistiche di «Anno» (tre colonne con divisori).
- [gravità: media] rituale-settimana__tab-light.png — dati incoerenti: «10 azioni completate» questa settimana vs «4 di 24 fatte questa settimana» in La giornata › Settimana; «azioni» vs «fatte» vs «cose fatte» — unificare termine e conteggio.
- [gravità: media] rituale-settimana__tab-light.png — quattro textarea vuote senza placeholder (invece la Review della sera ha esempi «Es. ho studiato…») e con maniglia di ridimensionamento del browser visibile in basso a destra — aggiungere placeholder d'esempio, togliere il resize handle (auto-grow).
- [gravità: bassa] rituale-settimana__tab-light.png — domande senza punto interrogativo («Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»…) mentre nella sera hanno «?» — aggiungere «?».
- [gravità: bassa] rituale-settimana__tab-light.png — «⚗ Apri le Scoperte» — link grigio dopo il pulsante Salva, sembra testo disabilitato; non si capisce perché andarci — «Vedi cosa hai scoperto questa settimana ›» in viola come gli altri link.

## attivita-sistemare__tab-light.png
- [gravità: alta] attivita-sistemare__tab-light.png — card «Idea: bot…» e pulsanti Oggi/Da fare/Scarta (x≈16–636) — colonna larga 620px allineata a SINISTRA con 200px vuoti a destra: in «Adesso» la card analoga è centrata, qui è appoggiata a sinistra — scegliere una regola unica (colonna centrata max-width) per tutte le pagine.
- [gravità: alta] attivita-sistemare__tab-light.png — metà inferiore vuota (y≈490–1030) — su tablet usare due colonne: elemento da smistare a sinistra, coda a destra, o card più grande.
- [gravità: media] attivita-sistemare__tab-light.png — titolo di sezione «Da sistemare» ripete esattamente il segmento attivo «Da sistemare 6» sopra — ridondante — togliere o sostituire con istruzione «Decidi dove mettere ogni idea (1 di 6)».
- [gravità: media] attivita-sistemare__tab-light.png — elenco «In coda»: righe di testo grigio senza contenitore né affordance, «e un'altra» in corsivo — non si capisce se siano toccabili; «e un'altra» è goffo — rendere le righe card/lista toccabili o scrivere «+1 altra» / «e altre 1».
- [gravità: media] attivita-sistemare__tab-light.png — select «Altro / Esplorazione» nativo del browser (freccia di sistema, sfondo grigio) — diverso da tutti gli altri controlli (chip area nelle schede) — usare il chip/menu area dell'app.
- [gravità: media] attivita-sistemare__tab-light.png — conteggi: segmento «Da sistemare 6», «In coda 5», badge tab bar «6» su Attività — il badge tab bar conta solo gli elementi da sistemare? non è chiaro — chiarire cosa conta il badge.
- [gravità: bassa] attivita-sistemare__tab-light.png — «Idea: bot che trasforma i vocali in task» — l'utente ha scritto «task», ma l'app usa ovunque «attività»: ok come contenuto utente; tuttavia «aggiunta 18 ago, 10:30» in 11px grigio è attaccata al select senza allineamento verticale centrato — centrare verticalmente.
- [gravità: bassa] attivita-sistemare__tab-light.png — pulsante «Oggi» con ombra viola marcata, gli altri senza ombra — ombra solo su questo — rimuovere o uniformare.

## attivita-dafare__tab-light.png
- [gravità: alta] attivita-dafare__tab-light.png — pulsanti quadrati 44px con icona «◎» a sinistra di ogni riga (uno pieno viola, gli altri bianchi) — sembrano checkbox ma hanno l'icona di «Oggi»: non si capisce se completano l'attività o la mettono in Oggi; non esiste un modo visibile per segnare come fatta dalla lista — se è «metti in Oggi» usare un pulsante esplicito/etichettato (es. chip «Oggi») e affiancare una vera checkbox di completamento; altrimenti usare la checkbox standard.
- [gravità: media] attivita-dafare__tab-light.png — controllo filtro «⏷ Tutte ⌄» da solo su una riga (y≈160–200), poi titolo «Importanti 3» attaccato (8px) sotto — spazio sbilanciato: filtro isolato, titolo sezione schiacciato — mettere il filtro sulla stessa riga del campo «Nuova attività» o a destra del titolo di sezione; spaziatura sezione ≥16px.
- [gravità: media] attivita-dafare__tab-light.png — «1 di 3», «1 di 4» a destra senza unità (passi? sotto-attività?) — «1/3 passi» o mini barra.
- [gravità: media] attivita-dafare__tab-light.png — lista a tutta larghezza (800px) con titoli brevi e chevron all'estremo destro — su tablet sarebbe ideale master-detail (lista a sinistra, scheda a destra) invece di aprire fogli a schermo pieno.
- [gravità: bassa] attivita-dafare__tab-light.png — badge contatori «6», «9», «3» nel segmentato e «3», «6» nei titoli sezione: stile grigio-viola; badge tab bar «6» viola pieno — e il badge «6» della tab bar coincide con Da sistemare, non con Da fare (9) — chiarire.
- [gravità: bassa] attivita-dafare__tab-light.png — icone area minuscole (12px) colorate prima del titolo — poco leggibili; «Leggere 1 ora al giorno un libro personale» è un'abitudine finita fra le attività — suggerire «Trasforma in abitudine».
- [gravità: bassa] attivita-dafare__tab-light.png — titoli sezione «Importanti» / «Altre» — «Altre» generico — «Il resto» o «Altre attività».

## attivita-dafare-aggiunta__tab-light.png
- [gravità: media] attivita-dafare-aggiunta__tab-light.png — riga opzioni «Oggi | Domani | Senza data | Altro / Esplorazione ⌄» (y≈153–197) — rientrata di 28px (x=28) mentre il campo sopra e il filtro sotto stanno a x=16: disallineata; mescola chip (pulsanti) e un select nativo con altezze e stili diversi — allineare a x=16 e usare un chip area come gli altri.
- [gravità: media] attivita-dafare-aggiunta__tab-light.png — opzioni di data limitate (Oggi/Domani/Senza data): manca «Scegli data…» e la scelta "importante" — aggiungere chip «Data…» e «★ Importante».
- [gravità: media] attivita-dafare-aggiunta__tab-light.png — opzioni aperte e filtro «Tutte» subito sotto: due file di controlli di tipo simile (chip) a 20px di distanza, l'utente confonde i chip della nuova attività con i filtri della lista — racchiudere le opzioni dentro il riquadro del campo (pannello composer) chiaramente separato dalla lista.
- [gravità: bassa] attivita-dafare-aggiunta__tab-light.png — «Senza data» preselezionato viola: in un contesto dove la pagina si chiama «Da fare» va bene, ma il chip selezionato ha lo stesso viola del pulsante primario dell'app — usare stile "selezionato" più tenue o con spunta.
- [gravità: bassa] attivita-dafare-aggiunta__tab-light.png — pulsante «+ Aggiungi» viola chiaro anche quando c'è testo — dovrebbe diventare primario (viola pieno) quando il campo non è vuoto; supporto Invio.

## attivita-abitudini__tab-light.png
- [gravità: media] attivita-abitudini__tab-light.png — cerchi di completamento 44px a DESTRA delle righe — in «Da fare» il controllo è un quadrato a SINISTRA, in «Poi» (Adesso) e «Senza orario» una checkbox quadrata a sinistra: tre posizioni/forme per «segna come fatto» — un unico controllo di completamento, sempre nella stessa posizione.
- [gravità: media] attivita-abitudini__tab-light.png — anello di progresso «0 di 3 oggi» in alto a sinistra — anello vuoto grigio quasi invisibile, «oggi» sotto in minuscolo; in «Adesso» il progresso del giorno era «1/2» con barra lineare: due visualizzazioni e due conteggi diversi per concetti vicini — uniformare componente e spiegare («0 di 3 abitudini fatte oggi»).
- [gravità: media] attivita-abitudini__tab-light.png — card separate (una card per riga, gap 8px) mentre in «Da fare» le righe sono raggruppate in una card con divisori — stesso tipo di lista, due stili — scegliere un solo stile di lista.
- [gravità: media] attivita-abitudini__tab-light.png — righe abitudine senza chevron/affordance per aprire la scheda (in Da fare c'è «›») — aggiungere chevron o rendere evidente che il tocco apre i dettagli.
- [gravità: media] attivita-abitudini__tab-light.png — y≈480–1030 vuoto; righe a tutta larghezza con il cerchio a 750px dal titolo — su tablet griglia a 2–3 colonne di card abitudine (con mini-calendario/serie), come Streaks/Habitify.
- [gravità: bassa] attivita-abitudini__tab-light.png — serie «🔥3» solo sulla prima abitudine, senza etichetta — mostrare per tutte («0» o «inizia oggi») o spiegare.
- [gravità: bassa] attivita-abitudini__tab-light.png — colore del cerchio (verde, verde, blu) = colore dell'area, ma sembra indicare stato — usare un colore neutro per lo stato non fatto.

## attivita-abitudini-nuova__tab-light.png
- [gravità: alta] attivita-abitudini-nuova__tab-light.png — selettore giorni L M M G V S D — tutti i cerchi bianchi/non selezionati mentre a destra c'è scritto «Ogni giorno»: stato contraddittorio (se è ogni giorno dovrebbero essere tutti attivi) — evidenziare i giorni attivi (pieni viola) coerentemente col riepilogo.
- [gravità: media] attivita-abitudini-nuova__tab-light.png — cerchi giorni distribuiti su 800px con 80px tra l'uno e l'altro — troppo sparsi, leggibilità come gruppo persa — raggrupparli (gap 8–12px) a sinistra o centrati.
- [gravità: media] attivita-abitudini-nuova__tab-light.png — «Ora: Nessuno» — accordo sbagliato (l'ora → «Nessuna») — «Nessuna» o meglio «Qualsiasi ora» / «Aggiungi ora».
- [gravità: media] attivita-abitudini-nuova__tab-light.png — pannello opzioni (Giorni/Ora/Area) staccato sotto il campo «Meditare» come card separata — non è chiaro che appartenga alla nuova abitudine e il pulsante «Aggiungi» resta in alto sopra le opzioni (ordine di compilazione invertito) — unire campo e opzioni in un'unica card composer con «Aggiungi» in fondo.
- [gravità: bassa] attivita-abitudini-nuova__tab-light.png — chip «Nessuno» grigio e «Salute & Sport» viola: stesso tipo di valore, due colori — stessa pillola; area preselezionata «Salute & Sport» arbitraria per «Meditare» (ok) ma andrebbe resa evidente come suggerimento.
- [gravità: bassa] attivita-abitudini-nuova__tab-light.png — mancano obiettivo/quantità (es. 10 minuti) e promemoria — opzioni attese in un'app di abitudini.

## scheda-attivita__tab-light.png
- [gravità: alta] scheda-attivita__tab-light.png — chip «Pianifica»: «Ieri | Domani | Gio | Tra una settimana | Un altro giorno» — «Ieri» non ha senso per pianificare (o è un bug di etichetta per «Oggi»), «Gio» abbreviato accanto a parole intere — «Oggi | Domani | Giovedì | Tra una settimana | Scegli data…».
- [gravità: alta] scheda-attivita__tab-light.png — titolo «Recuperare i corsi di / ingegneria gestionale» va a capo a ~260px su un foglio largo 834 — stesso difetto della scheda-blocco — larghezza titolo piena.
- [gravità: media] scheda-attivita__tab-light.png — «Fissa in alto: no» — valore testuale non toccabile in apparenza (nessun interruttore né chevron), e la lista usa la sezione «Importanti»: due nomi per lo stesso concetto — usare un interruttore (switch) e chiamarlo «Importante».
- [gravità: media] scheda-attivita__tab-light.png — «Non completata ›» — etichetta ambigua (stato? azione «segna come non completata»? link a storico?) con chevron di navigazione — se è un'azione «Rinuncia / Segna come non fatta», senza chevron.
- [gravità: media] scheda-attivita__tab-light.png — riga «Area: Studio / Università ⌄» usa select con freccia giù, «Scadenza: nessuna ›» usa chevron destra, «Fissa in alto: no» nulla — tre affordance diverse nella stessa card — uniformare (valore + chevron).
- [gravità: media] scheda-attivita__tab-light.png — checkbox passi 44px con angoli arrotondati, la spuntata è verde pieno — diverse dalle checkbox altrove (abitudini cerchi, Da fare quadrati con ◎) — unificare; il cestino su ogni passo e l'icona calendario sono minuscoli (12px) e grigi.
- [gravità: bassa] scheda-attivita__tab-light.png — chip «ogni giorno / ogni 2 giorni / ogni settimana» in minuscolo, mentre i chip «Pianifica» hanno l'iniziale maiuscola — capitalizzazione coerente; «Distribuisci i passi» richiede spiegazione («Pianifica un passo ogni…»).
- [gravità: bassa] scheda-attivita__tab-light.png — label di sezione «Pianifica», «Passi», «Dettagli» in 12px grigio — gerarchia debole rispetto a valori 14px nero — rinforzare i titoli di sezione.
- [gravità: bassa] scheda-attivita__tab-light.png — foglio a tutta larghezza su tablet senza pulsante di chiusura; l'header della pagina sotto (campo Nuova attività) spunta tra la maniglia e il bordo — modale centrata con «Chiudi».

## scheda-attivita-fondo__tab-light.png
- [gravità: alta] scheda-attivita-fondo__tab-light.png — titolo fisso e pulsante «Prossimo passo in Oggi» (y≈160–270) — scorrendo, il pulsante viola passa SOTTO il titolo fisso e viene tagliato a metà (si vede solo la parte inferiore), senza divisore né sfumatura — dare al header del foglio sfondo opaco + divisore, oppure far scorrere anche il titolo; il pulsante primario dovrebbe restare intero (o fisso in basso).
- [gravità: media] scheda-attivita-fondo__tab-light.png — il foglio scorre solo di ~20px: il contenuto era quasi tutto visibile ma il fondo ha ancora padding minimo (Elimina a 25px dal bordo) — aggiungere padding inferiore/safe area ≥ 24–34px.
- [gravità: bassa] scheda-attivita-fondo__tab-light.png — altri difetti identici a scheda-attivita (chip «Ieri/Gio», «Fissa in alto: no», «Non completata ›»).

## scheda-abitudine__tab-light.png
- [gravità: alta] scheda-abitudine__tab-light.png — campo «Inizio 07/29/2026» — formato data americano MM/GG/AAAA in un'app italiana (si legge "7 del 29° mese") — «29/07/2026» o meglio «29 lug 2026».
- [gravità: alta] scheda-abitudine__tab-light.png — «Ora 06:00 PM» — formato 12h; e la ✕ qui è FUORI dalla pillola, mentre nelle schede del calendario era dentro — 18:00 e stessa posizione della ✕.
- [gravità: media] scheda-abitudine__tab-light.png — riga giorni «Quando» L M M G V S D (cerchi a x≈53,164,275…,717) non allineata alle colonne del calendario soprastante (x≈74,188,303…,760) e lascia ~100px vuoti a destra dopo «D» — usare la stessa griglia a 7 colonne del calendario.
- [gravità: media] scheda-abitudine__tab-light.png — calendario storico — nessun nome del mese/anno e nessuna legenda: verde = fatto, grigio = mancato, numeri senza cerchio = non previsto (sab/dom e futuro) non è spiegato; 29–31 luglio e 1–2 agosto mescolati senza distinzione — aggiungere «Agosto 2026» con frecce e mini legenda.
- [gravità: media] scheda-abitudine__tab-light.png — pulsante «✓ Fatta» viola + «Salta oggi» link a destra — in Adesso è «Fatto» verde con «Salta oggi ⏭»: stessa azione, colore/genere diversi — unificare.
- [gravità: bassa] scheda-abitudine__tab-light.png — statistiche «🔥3 di fila · 4 record · 7 in tutto» — «record» senza unità; «in tutto» ambiguo — «Serie attuale 3 · Migliore 4 · Totale 7 volte».
- [gravità: bassa] scheda-abitudine__tab-light.png — «Fine: Mai» chip viola chiaro, «Inizio» chip viola chiaro con testo viola, «Ora» chip grigio con testo nero — tre stili di valore — uniformare.
- [gravità: bassa] scheda-abitudine__tab-light.png — «Elimina» rosso centrato in una card a tutta larghezza, mentre nella scheda attività «Elimina» è allineato a sinistra con icona cestino — stesso componente.
- [gravità: bassa] scheda-abitudine__tab-light.png — sottotitolo «lun–ven · 18:00» in 24h mentre il campo sotto mostra 06:00 PM: incoerenza nella stessa schermata.

## scheda-abitudine-fondo__tab-light.png
- [gravità: media] scheda-abitudine-fondo__tab-light.png — sotto il titolo (y≈195–215) — scorrendo, la riga «Salute & Sport · lun–ven · 18:00» sparisce sotto il titolo fisso senza transizione (nessun divisore), il titolo resta e il pulsante «Fatta» si accosta a 30px — header del foglio con divisore/ombra quando il contenuto scorre sotto.
- [gravità: bassa] scheda-abitudine-fondo__tab-light.png — «Elimina» a 25px dal bordo inferiore senza safe area — aggiungere padding inferiore.
- [gravità: bassa] scheda-abitudine-fondo__tab-light.png — restano tutti i difetti di scheda-abitudine (07/29/2026, 06:00 PM, giorni disallineati).

## andamento__tab-light.png
- [gravità: alta] andamento__tab-light.png — card «Costanza» — la mappa di calore occupa solo ~200×110px nell'angolo in alto a sinistra di una card larga 800px: contenuto perso in un angolo, celle 12px illeggibili, nessuna etichetta di mesi/giorni — far scalare la heatmap a tutta la larghezza della card (celle più grandi, etichette mesi in alto e L/M/V a sinistra).
- [gravità: alta] andamento__tab-light.png — card «Per area»: barre di progresso con inizio e fine diversi riga per riga (x di partenza 267–275, fine 708–732) perché dipendono dalla lunghezza del testo a destra/sinistra — colonne disallineate — usare griglia a 3 colonne fisse (etichetta | barra | valore allineato a destra).
- [gravità: media] andamento__tab-light.png — card serie «🔥38» con 7 giorni M G V S D L M — venerdì NON spuntato ma la serie è 38 giorni: contraddizione apparente; «65% / 81 di 124» senza etichetta (di cosa?) — spiegare («38 giorni di fila con almeno un'abitudine», «65% delle attività completate»).
- [gravità: media] andamento__tab-light.png — colori: heatmap blu qui, verde nella vista Anno e nel calendario abitudine per lo stesso concetto (giorni attivi) — un solo colore per "attività/costanza".
- [gravità: media] andamento__tab-light.png — lista in fondo «Archivio review 79 ›», «Sessioni del timer ›», «Aree ›» — l'ultima riga è coperta dalla tab bar (riga vuota a y≈1015–1035) e «Aree» qui duplica la voce Aree del Profilo — padding inferiore; togliere duplicazioni o spiegare la differenza.
- [gravità: bassa] andamento__tab-light.png — numeri «50% 4/8» — il frazionario in grigio attaccato alla percentuale; percentuali ordinate crescenti (ok) ma due aree al 100% con 12/12 e 9/9 rendono poco informativo — mostrare anche il periodo («ultimi 30 giorni»).
- [gravità: bassa] andamento__tab-light.png — segmento «Scoperte» con icona pollice in su — icona non semantica — usare lampadina o ampolla (coerente con «⚗ Apri le Scoperte» della Review).
- [gravità: bassa] andamento__tab-light.png — titoli card «Costanza», «Per area» 20px con icone diverse e la card serie senza titolo — uniformare (titolo per ogni card o per nessuna).

## andamento-fondo__tab-light.png
- [gravità: media] andamento-fondo__tab-light.png — scorrendo, il segmentato «Riepilogo / Scoperte» e l'avatar spariscono e la card serie si incolla al bordo superiore (y≈6) senza margine — header sticky o padding superiore costante.
- [gravità: media] andamento-fondo__tab-light.png — voce «Grafici ›» (prima nascosta sotto la tab bar) — «Grafici» è vago e si sovrappone concettualmente a «Costanza»/«Per area» sopra; lista di link a fondo pagina con icone grigie diversa dallo stile card sopra — raggruppare in una sezione «Altro» con titolo o promuovere i grafici a card.
- [gravità: bassa] andamento-fondo__tab-light.png — su tablet tutte le card in una colonna da 800px; la card serie e la card Costanza potrebbero stare affiancate (2 colonne) riducendo lo scroll — griglia 2 colonne sopra 700px.

## scoperte__tab-light.png
- [gravità: media] scoperte__tab-light.png — sotto-segmentato «Registro 8 / Esperimenti 2» — terzo stile di segmentato (pillola viola chiara, icona sopra, badge a destra) diverso sia dal principale sia da Giorno/Settimana — uniformare; «Registro» è un termine poco chiaro — «Cosa ho scoperto».
- [gravità: media] scoperte__tab-light.png — riquadri pollice su/giù 44px a sinistra di ogni riga — sembrano pulsanti/checkbox toccabili (stessa forma delle checkbox altrove) ma sono solo indicatori, già ridondanti con i titoli di sezione «Funziona»/«Non funziona» — rimuoverli o farli piccoli e non incorniciati.
- [gravità: media] scoperte__tab-light.png — meta «misurato», «lo noto ogni volta», «notato una volta» — livello di evidenza scritto in tre forme diverse e non si capisce la scala — usare un indicatore uniforme («Evidenza: alta/media/bassa» o 1–3 puntini).
- [gravità: media] scoperte__tab-light.png — y≈790–1030 vuoto; due liste una sotto l'altra a 800px — su tablet affiancare «Funziona» e «Non funziona» in due colonne (è un confronto naturale).
- [gravità: bassa] scoperte__tab-light.png — campo «Aggiungi una scoperta...» non permette di scegliere se funziona o no prima di aggiungere — aggiungere toggle 👍/👎 nel composer.
- [gravità: bassa] scoperte__tab-light.png — titoli sezione «👍 Funziona 4» 12px grigio — gerarchia debole.

## scoperte-esperimenti__tab-light.png
- [gravità: media] scoperte-esperimenti__tab-light.png — testo introduttivo e «La modifica: …» — paragrafi limitati a ~420px dentro card larghe 800px, lasciando metà card vuota a destra, mentre i grafici usano tutta la larghezza — larghezza testo coerente (es. max 65ch ma non 420px) o usare lo spazio a destra per i chip/stato.
- [gravità: media] scoperte-esperimenti__tab-light.png — chip «⚑ concluso», «● attivo», «Focus (da check-in, 1–5)», «Minuti dedicati a un'area · Studio / Università» — hanno bordo e aspetto di pulsanti ma sono etichette statiche; il chip metrico lungo va a capo/stringe il titolo — renderli badge senza bordo (sfondo tenue) e spostare la metrica sotto il titolo.
- [gravità: media] scoperte-esperimenti__tab-light.png — riquadro risultato «…differenza di +1,2. L'entità del cambiamento è grande (d≈3,1)» — «d≈3,1» è gergo statistico (d di Cohen) incomprensibile per l'utente medio — togliere o spostare in un «Dettagli» espandibile; tradurre in linguaggio semplice.
- [gravità: media] scoperte-esperimenti__tab-light.png — etichette «media 3,1» e «media 4,3» nel grafico si sovrappongono ai punti dati (es. a x≈275 e x≈745) — posizionarle fuori dall'area dati (a destra del grafico) o con sfondo.
- [gravità: media] scoperte-esperimenti__tab-light.png — secondo esperimento «Telefono fuori stanza» (attivo) — grafico con 2 punti e due medie identiche «media 75» — per un esperimento appena iniziato mostrare stato «Raccolta dati: giorno 2 di 14» invece di un grafico quasi vuoto; inoltre il fondo è coperto dalla tab bar.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — asse Y con solo 5/3/1 e nessuna data sull'asse X — aggiungere date inizio/cambio/fine.
- [gravità: bassa] scoperte-esperimenti__tab-light.png — terminologia: «focus» nel titolo vs «Concentrazione» nel check-in; separatore decimale con virgola qui, con punto nel check-in («4.3») — uniformare (virgola).
- [gravità: bassa] scoperte-esperimenti__tab-light.png — pulsanti «+ Nuovo esperimento» e «👍 Salvala in «Funziona»» outline bianco, stile diverso dai «+ Aggiungi» viola chiaro — «Salvala in «Funziona»» ha virgolette annidate goffe — «Aggiungi a Funziona».

## scheda-scoperta__tab-light.png
- [gravità: alta] scheda-scoperta__tab-light.png — riga «Esito»: primo pulsante (x≈31–135, y≈812–852) completamente VUOTO, bianco senza testo né icona — probabilmente l'opzione selezionata «👍 funziona» con testo bianco su sfondo bianco (stato selezionato rotto) — correggere lo stile selezionato (sfondo verde/viola con testo bianco) come per «misurato».
- [gravità: media] scheda-scoperta__tab-light.png — «Togli questa riga» — linguaggio tecnico (righe di tabella) — «Elimina scoperta» come nelle altre schede («Elimina»).
- [gravità: media] scheda-scoperta__tab-light.png — «Scritta 20 lug» — etichetta innaturale — «Aggiunta il 20 lug».
- [gravità: media] scheda-scoperta__tab-light.png — titolo foglio «Una cosa che hai capito» e label «Cosa hai capito» — ripetizione; il registro si chiama «Scoperte» ma qui non compare la parola — titolo «Scoperta», label «Cosa hai scoperto».
- [gravità: bassa] scheda-scoperta__tab-light.png — «Esito» posto in «Dettagli» sotto «Evidenza», mentre è l'informazione principale (funziona / non funziona) — portarlo subito sotto il testo.
- [gravità: bassa] scheda-scoperta__tab-light.png — chip evidenza in minuscolo («notato una volta», «lo noto ogni volta») con forme verbali miste (participio, presente) — «Una volta / Spesso / Misurato».
- [gravità: bassa] scheda-scoperta__tab-light.png — textarea con maniglia di ridimensionamento visibile e 2 righe vuote — auto-altezza; foglio a tutta larghezza senza «Chiudi».

## profilo__tab-light.png
- [gravità: alta] profilo__tab-light.png — liste «Aree/Sonno e pasti/Promemoria» e «Diario/Impostazioni» (x≈98–736) — larghe 640px e centrate, mentre le due card sopra (profilo e statistiche) sono a tutta larghezza 16–818: due larghezze nella stessa pagina — stessa colonna per tutto.
- [gravità: alta] profilo__tab-light.png — navigazione — la pagina Profilo non ha titolo, né pulsante «Indietro»/«Chiudi», e nessuna voce della tab bar è attiva: l'utente non sa dove si trova né come tornare — aggiungere header «Profilo» con «‹ Indietro» o far diventare Profilo una voce della tab bar.
- [gravità: media] profilo__tab-light.png — statistiche «38 giorni · 109 fatte · 65% riuscita» — numeri incoerenti con Anno (82 fatte) e Andamento (81 di 124 = 65%); etichette ellittiche («fatte», «riuscita», «giorni» di cosa?) — etichette complete e coerenti («38 giorni di fila», «109 attività completate», «65% completamento»).
- [gravità: media] profilo__tab-light.png — «Promemoria: bloccati» — stato allarmante senza spiegazione né colore (grigio come i valori neutri) — «Disattivati – attiva le notifiche» in arancio con azione diretta.
- [gravità: bassa] profilo__tab-light.png — card profilo: motto/descrizione su due righe con larghezza 400px, avatar 64px — nessuna affordance per modificare nome/foto/motto — aggiungere «Modifica».
- [gravità: bassa] profilo__tab-light.png — y≈550–1030 vuoto — layout da telefono.
- [gravità: bassa] profilo__tab-light.png — «Aree» qui e in Andamento; «Sonno e pasti» qui e in Rituali e nella Giornata — tre ingressi per la stessa impostazione senza chiarire quale è il "ritmo di base" — chiarire con sottotitolo («Orari abituali»).

## impostazioni__tab-light.png
- [gravità: alta] impostazioni__tab-light.png — Impostazioni presentate come bottom sheet a tutta larghezza (834px) sopra il Profilo — su tablet le impostazioni sono una pagina/split-view (elenco a sinistra, dettaglio a destra) o un foglio centrato — usare form sheet centrato ~600px o navigazione a pagina.
- [gravità: media] impostazioni__tab-light.png — sezione «Account» contiene solo «Sincronizzazione», poi un secondo gruppo senza titolo con Area predefinita/Timer/Musica/Aspetto — il secondo gruppo dovrebbe avere titolo («Preferenze»); «Sincronizzazione: su questo dispositivo» non ha chevron né spiegazione — aggiungere titolo e affordance.
- [gravità: media] impostazioni__tab-light.png — «Area predefinita: Automatica ⌄» con freccia giù (select), le altre righe con chevron › — affordance mista — uniformare.
- [gravità: media] impostazioni__tab-light.png — «Registro tecnico», «Design lab», «Scienza» in «Guida» — voci da sviluppatore/gergo esposte all'utente; «Scienza» poco chiaro — nascondere le voci tecniche o metterle in «Avanzate»; «Scienza» → «Il metodo dietro l'app».
- [gravità: bassa] impostazioni__tab-light.png — valori in minuscolo («chiedi sempre», «nessuna», «automatico») accanto a «Automatica» maiuscola — capitalizzazione coerente; «Automatica» vs «automatico».
- [gravità: bassa] impostazioni__tab-light.png — «Backup e ripristino 1» — numero senza significato — «1 backup» o data dell'ultimo backup.
- [gravità: bassa] impostazioni__tab-light.png — «Esporta dati»/«Importa dati» senza chevron né indicazione del formato — aggiungere «(JSON)» o sottotitolo.

## impostazioni-fondo__tab-light.png
- [gravità: media] impostazioni-fondo__tab-light.png — titolo fisso «Impostazioni» — la card «Sincronizzazione» scorre sotto il titolo e viene tagliata in alto (bordo superiore mancante, y≈197) senza divisore — header del foglio con sfondo e divisore/ombra durante lo scroll.
- [gravità: media] impostazioni-fondo__tab-light.png — «Cancella tutti i dati» a 25px dal fondo, nella stessa card di «Rimuovi dati di esempio» — azione distruttiva irreversibile vicino a una innocua — separarla in una card propria, con spazio inferiore e conferma esplicita.
- [gravità: bassa] impostazioni-fondo__tab-light.png — «Reimposta» come titolo sezione con «Rimuovi dati di esempio» — non è un reset — titolo «Dati di esempio e reset» o separare.

## imp-timer__tab-light.png
- [gravità: media] imp-timer__tab-light.png — altezza del foglio — la sottopagina Timer apre un foglio che parte a y≈424, mentre Impostazioni partiva a y≈112: navigando dentro le impostazioni il foglio cambia altezza e sotto ricompare il Profilo — mantenere la stessa altezza del foglio durante la navigazione interna.
- [gravità: media] imp-timer__tab-light.png — link indietro «‹ Impostazioni» 12px viola sopra il titolo — troppo piccolo come target (≈20px) e posizionato in stile web — barra di navigazione con «‹ Impostazioni» a sinistra e titolo centrato/grande, target ≥44px.
- [gravità: media] imp-timer__tab-light.png — sezione «Avvio rapido: Durata 5 min / Poi continua per 25 min» — concetto non spiegato (5 minuti per iniziare, poi estende?) — aggiungere microcopy («Inizia con 5 minuti; se continui, il timer passa a 25»).
- [gravità: media] imp-timer__tab-light.png — «Pausa lunga ogni 4: No» — frase incompleta (ogni 4 cosa?) con valore Sì/No — interruttore «Pausa lunga ogni 4 sessioni» + durata.
- [gravità: bassa] imp-timer__tab-light.png — tre sezioni con «Durata» ripetuto (Avvio rapido, Sessione, Pomodoro=«Concentrazione») — nomi diversi per lo stesso concetto — uniformare («Durata concentrazione»).
- [gravità: bassa] imp-timer__tab-light.png — «Timer predefinito: Chiedi sempre» — in Impostazioni il valore era «chiedi sempre» minuscolo — capitalizzazione coerente.
- [gravità: bassa] imp-timer__tab-light.png — fondo del foglio: ultima card a 25px dal bordo — padding inferiore.

## imp-musica__tab-light.png
- [gravità: media] imp-musica__tab-light.png — 9 campi «Incolla il link» — campi quasi invisibili (sfondo grigio identico alla card, nessun bordo), etichetta sopra con padding superiore 8px e inferiore 0: righe schiacciate e campi non riconoscibili come input — campi con bordo/sfondo bianco, spaziatura verticale uniforme; mostrare anche icona Spotify/YouTube quando c'è un link.
- [gravità: media] imp-musica__tab-light.png — «Per area» con 8 campi tutti vuoti — muro di input ripetitivi; meglio «Predefinita» + «Aggiungi musica per un'area ›» solo per chi la vuole.
- [gravità: bassa] imp-musica__tab-light.png — nota in fondo «Senza pubblicità e a schermo spento serve l'abbonamento di Spotify o di YouTube.» — frase inversa poco chiara e testo a 420px — «Per ascoltare senza pubblicità e a schermo spento serve un abbonamento Spotify Premium o YouTube Premium.»; spostarla sotto «Predefinita».
- [gravità: bassa] imp-musica__tab-light.png — interruttore «Apri all'avvio del timer» spento è grigio chiarissimo su grigio, quasi invisibile — aumentare contrasto del track.
- [gravità: bassa] imp-musica__tab-light.png — altezza del foglio diversa ancora (inizia a y≈124) rispetto a Timer (424) e Impostazioni (112).

## imp-aspetto__tab-light.png
- [gravità: media] imp-aspetto__tab-light.png — «Suoni», «Vibrazione», «Animazioni» sotto «Aspetto» — suoni e vibrazione non sono aspetto; inoltre in questa card le etichette sono 14px grassetto con icona, mentre «Tema» è una label senza icona — rinominare la pagina «Aspetto e feedback» o spostare suoni/vibrazione; uniformare righe.
- [gravità: media] imp-aspetto__tab-light.png — foglio corto che parte a y≈724: quarta altezza diversa dei fogli impostazioni (112/124/424/724) — altezza fissa per tutta la navigazione interna.
- [gravità: bassa] imp-aspetto__tab-light.png — interruttori VERDI (stile iOS) mentre l'accento dell'app è viola e il segmentato Tema usa bianco/grigio — colore degli switch coerente con l'accento.
- [gravità: bassa] imp-aspetto__tab-light.png — segmentato «Auto/Chiaro/Scuro» dentro una card con label «Tema» sopra: doppio contenitore (card + segmentato con bordo) — togliere il bordo del segmentato o la card.
- [gravità: bassa] imp-aspetto__tab-light.png — «Vibrazione» su tablet/web spesso non supportata — nasconderla dove il dispositivo non vibra.

## aree__tab-light.png
- [gravità: media] aree__tab-light.png — ogni riga ha cestino + interruttore attivo — due azioni (disattiva/elimina) con significato vicino e nessuna spiegazione della differenza; cestino minuscolo grigio accanto allo switch, facile tocco errato — spiegare («Disattivata: nascosta ma conserva lo storico»), spostare Elimina dentro il dettaglio dell'area o su swipe.
- [gravità: media] aree__tab-light.png — righe non aprono un dettaglio: impossibile cambiare nome, colore o icona di un'area — aggiungere tocco sulla riga → modifica (nome, icona, colore).
- [gravità: media] aree__tab-light.png — titolo «Le tue aree» senza link «‹ Profilo»/chiusura, mentre le sottopagine impostazioni hanno «‹ Impostazioni»; foglio a tutta larghezza — coerenza della navigazione nei fogli.
- [gravità: bassa] aree__tab-light.png — «Nuova area»: campo «Nome» con icona libro fissa grigia e «Aggiungi» testo viola — terzo stile del composer "aggiungi" (vedi Da fare e Piano) — un unico componente; permettere di scegliere l'icona.
- [gravità: bassa] aree__tab-light.png — padding inferiore del foglio ~25px — aumentarlo.

## sonno-pasti__tab-light.png
- [gravità: alta] sonno-pasti__tab-light.png — tutti gli orari in formato 12h («11:30 PM», «08:00 AM», «01:00 PM», «05:00 AM – 02:00 PM», «07:00 PM») mentre la riga Profilo mostra «23:30–07:30» — 24h ovunque.
- [gravità: media] sonno-pasti__tab-light.png — «Promemoria nell'app · Sonno · Tra le 05:00 AM – 02:00 PM» — significato oscuro (ricordare di registrare il sonno fra le 5 e le 14?) — «Chiedimi come ho dormito tra le 05:00 e le 14:00».
- [gravità: media] sonno-pasti__tab-light.png — qui la durata pasti è una pillola viola («15 min») e la rimozione una «×»; nel pannello della Giornata la durata è una select nativa troncata («15 mir») e la rimozione un cestino — stessa funzione, due componenti — unificare.
- [gravità: media] sonno-pasti__tab-light.png — pulsante «Salva» in fondo al foglio, mentre altre impostazioni (Timer, Aspetto, Aree) salvano automaticamente senza pulsante — modello di salvataggio incoerente — scegliere salvataggio automatico ovunque o un «Fine» in alto.
- [gravità: bassa] sonno-pasti__tab-light.png — «Durata 8h» testo grigio senza pillola (calcolato) — ok, ma «8h» senza spazio vs «1 h 30» altrove — «8 h».
- [gravità: bassa] sonno-pasti__tab-light.png — interruttori verdi vs accento viola — coerenza.

## promemoria__tab-light.png
- [gravità: alta] promemoria__tab-light.png — sezione «Server · da collegare» con campi «Indirizzo https://….workers.dev» e «Chiave pubblica B…» — configurazione tecnica (Cloudflare Worker, chiave VAPID) esposta all'utente finale; nessuna persona normale sa cosa inserire — nascondere in «Avanzate/Sviluppatore» o gestirlo lato app.
- [gravità: alta] promemoria__tab-light.png — banner «Bloccati» + tutti gli interruttori VERDI (attivi) sotto — contraddizione: le notifiche sono bloccate ma tutto appare acceso; il banner è grigio neutro, non un avviso — banner color avviso con azione («Come riattivarle»), interruttori disattivati/attenuati finché bloccate.
- [gravità: alta] promemoria__tab-light.png — orari 12h («08:30 AM», «01:00 PM», «11:00 PM – 07:00 AM») — 24h.
- [gravità: media] promemoria__tab-light.png — nomi dei promemoria diversi dai nomi dei rituali: «Piano del mattino» (rituale «Piano del giorno»), «Chiusura della giornata» («Review della sera»), «Priorità del giorno» (nessun rituale corrispondente) — usare gli stessi nomi.
- [gravità: media] promemoria__tab-light.png — fondo del foglio: un pulsante viola (x≈36–112, y≈1104) tagliato dal bordo inferiore, se ne vede solo il bordo superiore — padding inferiore / scorrimento.
- [gravità: bassa] promemoria__tab-light.png — testo del banner «…alla voce di questo indirizzo.» — italiano innaturale — «Per riattivarle apri le impostazioni del browser › Notifiche e consenti questo sito.»
- [gravità: bassa] promemoria__tab-light.png — «Non disturbare · Attivo» — label «Attivo» ridondante — «Non disturbare» come etichetta dell'interruttore.

## diario__tab-light.png
- [gravità: alta] diario__tab-light.png — pulsante «↶ Annulla» grande su OGNI riga del diario (16 pulsanti visibili) — ripetizione pesante che domina la colonna e rende facile annullare per errore eventi passati (anche di ieri) — spostare in swipe/menu «…» o mostrarlo solo al passaggio/selezione della riga.
- [gravità: alta] diario__tab-light.png — select «Priorità [Relazioni & Sociale ⌄]» / «[Associazioni ⌄]» sotto alcune righe «Completata» — l'etichetta dice «Priorità» ma il valore è un'area; in un'altra riga lo stesso select ha l'icona area invece di «Priorità»; select nativi editabili dentro un diario (storico) — chiarire cosa si modifica o rimuovere i controlli dal diario.
- [gravità: media] diario__tab-light.png — ordine colonne: testo | pulsante Annulla | ora — l'ora sta all'estremo destro dopo il pulsante, mentre di solito l'ora precede o segue subito il testo — mettere l'ora a sinistra (timeline) o subito dopo il testo, azione in fondo.
- [gravità: media] diario__tab-light.png — navigazione — Diario è una pagina intera con «‹ Profilo», mentre Aree/Sonno/Promemoria/Impostazioni del Profilo si aprono come fogli; e la tab bar evidenzia «Andamento» pur essendo arrivati dal Profilo — pattern di navigazione coerente e tab attiva corretta.
- [gravità: media] diario__tab-light.png — titolo «Diario» per un registro automatico di eventi (Annotato/Completata/Check-in) — in italiano «diario» evoca scrittura personale — «Cronologia» / «Attività recenti».
- [gravità: media] diario__tab-light.png — contenuto che passa sotto la tab bar flottante (riga «Piano del mattino · Alle 9:00…» visibile sotto/attorno alla barra a y≈1100) — sfondo della tab bar opaco o padding inferiore.
- [gravità: bassa] diario__tab-light.png — «Check-in · energia 4 · focus 5 · umore 5» — «focus» qui, «concentrazione» nella domanda del check-in; «Annotato» vs «Da sistemare» — terminologia.
- [gravità: bassa] diario__tab-light.png — segmentato «Cose importanti / Tutto» allineato a sinistra e piccolo, quarto stile di segmentato — uniformare.

## timer-scelta__tab-light.png
- [gravità: media] timer-scelta__tab-light.png — foglio a tutta larghezza per 4 opzioni brevi — su tablet un popover ancorato al pulsante «Timer» o un menu sarebbe più adatto; il foglio non mostra per quale attività si avvia il timer («Ripasso flashcard») — aggiungere sottotitolo con l'attività e usare popover.
- [gravità: media] timer-scelta__tab-light.png — valori a destra («5 min», «25 min», «25 + 5 min», «nessun limite») attaccati al bordo destro (padding 4px vs 12 a sinistra) — padding interno simmetrico (≥16px).
- [gravità: media] timer-scelta__tab-light.png — nessuna spiegazione della differenza tra «Avvio rapido» e «Sessione» (5 vs 25 min) — sottotitolo per ogni opzione («Inizia con 5 minuti, poi decidi»).
- [gravità: bassa] timer-scelta__tab-light.png — icone dentro quadrati bianchi con bordo 44px — stessa forma delle checkbox dell'app: sembrano caselle — icone senza cornice o con sfondo tenue colorato.
- [gravità: bassa] timer-scelta__tab-light.png — nessuna opzione preselezionata/predefinita indicata, né «Ricorda la scelta» — aggiungere.

## timer-concentrazione__tab-light.png
- [gravità: media] timer-concentrazione__tab-light.png — anello/quadrato del timer (288×260) — forma "squircle" con anello di progresso grigio scuro quasi invisibile su nero, e su tablet il timer è piccolo (1/4 della larghezza) — ingrandire (es. 420–480px), anello di progresso con colore d'accento e contrasto adeguato.
- [gravità: media] timer-concentrazione__tab-light.png — «⏸ Termina» — icona di pausa con etichetta «Termina» (azioni diverse: mettere in pausa vs finire) — separare «Pausa» e «Termina sessione», con icone corrette.
- [gravità: media] timer-concentrazione__tab-light.png — azioni secondarie «Termina», «Cambia timer» in grigio scuro (#888 su nero, 13px) — contrasto basso e target piccoli — aumentare contrasto/dimensione, pulsanti con area ≥44px.
- [gravità: bassa] timer-concentrazione__tab-light.png — «Pomodoro · blocco 1» — manca «di 4» e la pausa successiva; «restano» sotto il numero è superfluo — «Blocco 1 di 4 · poi 5 min di pausa».
- [gravità: bassa] timer-concentrazione__tab-light.png — «Cambia timer» con icona ↻ identica a quella di «Pomodoro» e delle abitudini — icona diversa (es. cursori).
- [gravità: bassa] timer-concentrazione__tab-light.png — pulsante «✓ Fatto» 420px: va bene, ma premendo «Fatto» con 25:00 ancora da fare non è chiaro se chiude la sessione o segna l'abitudine — «Segna fatto e chiudi».
- [gravità: bassa] timer-concentrazione__tab-light.png — schermo nero puro anche in tema chiaro — scelta voluta (concentrazione) ma andrebbe resa coerente con l'opzione Tema (o dichiarata «modalità concentrazione»); X in alto a destra a 12px dal bordo, meno margine del resto (16–20px).

## cattura__tab-light.png
- [gravità: media] cattura__tab-light.png — popup «Scrivi un pensiero…» — riga inferiore quasi vuota (50px) solo per «Chiudi» piccolo a destra: spreco di spazio e due azioni (Salva in alto, Chiudi in basso) in posizioni lontane e non convenzionali — mettere «Annulla» e «Salva» insieme (Annulla a sinistra o in basso a destra accanto a Salva), oppure X in alto.
- [gravità: media] cattura__tab-light.png — nessun indizio di dove finisce il pensiero (va in «Da sistemare») né opzioni (area, data) — microcopy «Finirà in Da sistemare» sotto il campo.
- [gravità: bassa] cattura__tab-light.png — campo a una riga per un "pensiero" — testo lungo non visibile; usare textarea che cresce.
- [gravità: bassa] cattura__tab-light.png — «Salva» viola attivo anche con campo vuoto — disabilitarlo finché vuoto.
- [gravità: bassa] cattura__tab-light.png — divisore interno che non arriva ai bordi (rientro 4px) e popup larghezza 640 — ok, ma posizionato in alto (y=145) invece che centrato o sopra la tastiera — ok su tablet con tastiera; verificare.

## menu-oggi-avatar__tab-light.png
- [gravità: alta] menu-oggi-avatar__tab-light.png — toccando l'avatar «R» si apre direttamente la pagina Profilo che sostituisce Oggi senza transizione di "push", senza titolo né «Indietro» e con nessuna tab attiva (vedi profilo): l'utente perde il contesto — aprire il profilo come pagina con barra «‹ Oggi» / pulsante chiudi, o come popover/menu ancorato all'avatar.
- [gravità: media] menu-oggi-avatar__tab-light.png — l'avatar sparisce in questa pagina (nessun elemento in alto a destra) — l'utente non trova lo stesso punto per tornare indietro — mantenere un controllo di chiusura nella stessa posizione.
- [gravità: bassa] menu-oggi-avatar__tab-light.png — stessi difetti di layout di profilo (colonne di larghezza diversa, spazio vuoto).

## trascinamento-in-corso__tab-light.png
- [gravità: alta] trascinamento-in-corso__tab-light.png — anteprima di rilascio «12:45–14:15» (viola, y≈660–745) — si sovrappone completamente al blocco «Pranzo» (13:00–14:00) senza alcun avviso di conflitto; l'etichetta «12:45–14:15» è scritta sopra il bordo superiore del pasto — segnalare sovrapposizione (bordo arancio/«si sovrappone al pranzo») e affiancare i blocchi in colonne.
- [gravità: alta] trascinamento-in-corso__tab-light.png — zona di rilascio «🕒 Togli l'orario» tratteggiata (y≈997–1050) — esce dal bordo destro dello schermo (bordo tratteggiato tagliato a x=834) e copre il blocco «Camminata / movimento» e la riga delle 19:00; la tab bar sotto è tagliata — zona di rilascio con margini 16px su entrambi i lati, posizionata sopra la tab bar senza coprire contenuti (o in alto).
- [gravità: media] trascinamento-in-corso__tab-light.png — banner «✦ Dati di esempio · Rimuovi · ✕» in cima — compare solo in questa schermata (non negli altri screenshot della stessa vista) e sposta tutto il layout di 60px; colore viola chiaro identico ai controlli selezionati — mostrarlo in modo coerente (sempre o mai) e con stile da avviso informativo.
- [gravità: media] trascinamento-in-corso__tab-light.png — etichetta fluttuante «Organizzare cena con il gruppo / alle 12:45» (y≈577–635) — staccata dall'anteprima (sta ~40px sopra, a metà fra 11 e 12) e copre la griglia; dice «alle 12:45» mentre l'anteprima dice «12:45–14:15» — tenere l'etichetta attaccata all'anteprima o al dito, con un solo formato.
- [gravità: bassa] trascinamento-in-corso__tab-light.png — blocco originale lasciato al 30% di opacità con la linea dell'ora 10:30 sopra — ok, ma il badge «10:30» resta sovrapposto al bordo destro (vedi giornata-giorno).

## Riassunto

Esaminati 45/45 screenshot tablet (834×1112, tema chiaro). Problemi principali, raggruppati:

### 1. Layout da telefono su tablet (alta)
- Quasi ogni pagina è una colonna unica che lascia vuoto il 40–65% dello schermo (Adesso, Rituali, Da sistemare, Abitudini, Scoperte, Profilo). Mancano master-detail, griglie a 2 colonne o colonne a larghezza massima pensate per il tablet.
- Le larghezze cambiano nella stessa pagina: in Adesso la card focus è centrata a 620px fra righe a tutta larghezza; in Profilo le liste sono a 640px centrate sotto card a tutta larghezza; in Da sistemare la colonna è da 620px appoggiata a sinistra. Va scelta un'unica griglia/max-width.
- Le schede (attività, abitudine, scoperta, impostazioni, timer) sono fogli dal basso a tutta larghezza. I titoli vanno a capo a 200–260px pur avendo 800px. Non c'è un pulsante Chiudi. Sul tablet servono form sheet centrati o un pannello laterale.
- Righe con l'etichetta all'estremo sinistro e il controllo all'estremo destro, con 400–750px di vuoto in mezzo: pasti, Review della sera, abitudini, Per area.
- La heatmap «Costanza» resta in un angolo di 200px dentro una card da 800px. I giorni della settimana nel nuovo-abitudine sono sparpagliati e non allineati al calendario.

### 2. Elementi tagliati o sovrapposti (alta)
- La tab bar è tagliata (etichette mozzate, «+» fuori schermo) in tutte le viste di La giornata › Giorno.
- Gli header sticky non hanno sfondo: in Settimana il testo passa sotto i numeri dei giorni; nei fogli il pulsante «Prossimo passo in Oggi» e la card «Sincronizzazione» finiscono tagliati sotto il titolo fisso.
- Contenuti coperti dalla tab bar: grafico del Check-in, ultima riga dei Rituali, «Grafici» in Andamento, esperimenti, Diario. Un pulsante è tagliato in fondo a Promemoria.
- Durante il trascinamento la zona «Togli l'orario» esce dal bordo destro e copre un blocco. L'anteprima di rilascio si sovrappone al Pranzo senza avviso di conflitto.
- Il padding superiore cambia fra Giorno, Mese e Anno (20, tagliato, 4).

### 3. Bug visivi e testi troncati (alta)
- Scheda scoperta: il pulsante «Esito» selezionato è vuoto (testo bianco su bianco).
- Select della durata dei pasti troncate: «15 mir», «45 mi».
- Check-in segnato «fatto» ma nessun valore risulta selezionato.
- Nuova abitudine: c'è scritto «Ogni giorno» ma nessun giorno è selezionato.

### 4. Localizzazione (alta)
- Orari in formato 12h AM/PM (time picker, schede, Sonno e pasti, Promemoria) accanto al formato 24h usato altrove, a volte nella stessa schermata.
- Data in formato USA «07/29/2026».
- Decimali col punto («4.3») e altrove con la virgola.
- Anglicismi e gergo: Review, Check-in, Focus, XP, Founder, «d≈3,1», Design lab, Registro tecnico, configurazione «Server/Chiave pubblica» (workers.dev) esposta all'utente.
- Italiano innaturale: «Ora: Nessuno», «e un'altra», «Sposta 1 non fatta a domani», «Togli questa riga», «Scritta 20 lug», «alla voce di questo indirizzo», «Pausa lunga ogni 4: No», chip «Ieri» per pianificare, «Gio».

### 5. Componenti incoerenti (media)
- Completare un elemento: checkbox quadrata a sinistra, quadrato con «◎» (ambiguo, sembra checkbox ma manda in Oggi), cerchio colorato a destra, quadrato verde nei passi.
- Pulsante «Fatto»: verde in Adesso e nel timer, «Fatta» viola nelle schede.
- Conferma dei rituali: «Salva», «Registra», «Fatto», con icone floppy o luna e stili pieno/tenue. Il rituale Sonno e pasti ha due pulsanti di salvataggio.
- 4–5 stili di controllo segmentato.
- 3 stili di composer «Aggiungi».
- 3 stili di badge contatore.
- Pillole dei valori con colori diversi; la ✕ a volte dentro, a volte fuori.
- Select native del browser mescolate ai chip.
- Switch verdi mentre l'accento dell'app è viola.
- Liste raggruppate in un'unica card in alcune viste, card separate in altre.
- Fogli delle impostazioni con 4 altezze diverse.
- Icone delle abitudini di colori diversi senza logica. Heatmap blu in Andamento, verde in Anno.
- Elementi non interattivi che sembrano pulsanti: pollici in Scoperte, icone del timer incorniciate, chip di stato degli esperimenti, quadratini colore nella lista del Mese.

### 6. Informazioni poco chiare o incoerenti (media)
- Numeri senza etichetta o unità: 1/2, 38, «7/25/17» in Anno, «1 di 3», «record», «in tutto», «XP».
- Conteggi che non tornano: fatte 4/24, 10, 58, 82, 109; serie di 38 giorni con un venerdì non spuntato; badge «1» sui Rituali con 3 da fare.
- Stessa cosa con nomi diversi: «Fissa in alto» vs «Importanti»; Piano del mattino/giorno; Chiusura della giornata vs Review della sera; Focus vs Concentrazione; «Diario» per una cronologia.
- Il Diario ha un pulsante «Annulla» su ognuna di 16+ righe e select «Priorità» che in realtà contengono un'area.
- Promemoria «Bloccati» ma tutti gli interruttori risultano accesi.
- Navigazione del Profilo: nessun titolo, nessun Indietro, nessuna tab attiva. Il Diario è una pagina intera mentre le altre voci del Profilo si aprono come fogli. Nel Diario la tab attiva è sbagliata.
- La griglia del Giorno mette le attività senza orario in fondo, dopo 18 ore. La lista «Oggi» del Mese non segue l'ordine cronologico.
- Gerarchia tipografica debole: i titoli di sezione (12px grigio) pesano meno delle righe che contengono.

### Priorità di intervento consigliate
1. Tab bar e header sticky: posizione fissa e sfondo opaco. Padding inferiore uguale all'altezza della tab bar ovunque.
2. Locale it-IT: 24h, gg/mm/aaaa, virgola decimale. Glossario unico per i termini.
3. Layout tablet: max-width coerente, master-detail o 2 colonne, fogli centrati.
4. Unificare i componenti: completamento, pulsante primario, segmentato, composer, pillole, badge.
5. Correggere i bug: Esito vuoto, select troncate, stati incoerenti (check-in, giorni dell'abitudine, promemoria).
