# Revisione UX/UI — computer 1280×800

## oggi-adesso__pc-light.png
- [alta] oggi-adesso__pc-light.png — area centrale — su 1280 px il contenuto è una colonna di ~560 px al centro (x 486–1043) con ~240 px vuoti per lato e metà inferiore dello schermo vuota: layout da telefono ingrandito — su schermi ≥1100 px usare due colonne (a sinistra «Adesso» + «Poi», a destra mini-agenda della giornata/rituali) oppure allargare la colonna a ~720 px.
- [media] oggi-adesso__pc-light.png — card «Ripasso flashcard» — la card protagonista è più larga (x 455–1073) delle card sopra e sotto (x 485–1043): i bordi sinistri non sono allineati, la colonna sembra storta — tenere la stessa larghezza e distinguere la card con colore/ombra, non sbordando.
- [media] oggi-adesso__pc-light.png — barra schede in alto — la barra «Adesso / La giornata / Rituali» va da x 290 a 1190, mentre il contenuto sotto è largo la metà e centrato: barra e contenuto non condividono la griglia — allineare la barra alla larghezza della colonna di contenuto (o allargare il contenuto).
- [media] oggi-adesso__pc-light.png — pillola «🔥 38» in alto a destra — numero senza etichetta: non si capisce che è una serie di giorni e se è cliccabile — aggiungere «38 giorni» o un tooltip, e uno stato hover se apre qualcosa.
- [bassa] oggi-adesso__pc-light.png — barra progresso «1/2» sotto la data — non dice di cosa (rituali? attività?) — scrivere «1 di 2 fatte» o un'etichetta.
- [media] oggi-adesso__pc-light.png — card hero — «Studio / Università» in alto e il chip «Abitudine» staccati da ~30 px di vuoto e poi titolo: tre livelli di metadati prima del titolo, gerarchia dispersiva — mettere area e tipo sulla stessa riga piccola sopra il titolo e ridurre il padding verticale.
- [bassa] oggi-adesso__pc-light.png — riga «Timer / Salta oggi» — «Timer» ha icona a sinistra e bordo, «Salta oggi» è testo con icona a destra: due stili di azione secondaria affiancati — usare lo stesso stile (entrambi ghost con icona a sinistra).
- [media] oggi-adesso__pc-light.png — barra laterale, «Attività» e «Andamento» — le voci non selezionate hanno un fondo grigio pieno che le fa sembrare pulsanti/selezionate quanto «Oggi» — voci inattive senza fondo, fondo solo su hover e selezione.
- [media] oggi-adesso__pc-light.png — avatar «R» in alto a destra e «Profilo e impostazioni» in basso a sinistra — due accessi allo stesso posto in punti opposti dello schermo — su computer tenerne uno solo (barra laterale) oppure mettere nome/avatar in fondo alla barra laterale.
- [bassa] oggi-adesso__pc-light.png — scheda «Rituali» — il contatore «1» è prima dell'etichetta, mentre nella barra laterale il «6» di Attività è dopo: posizione dei contatori incoerente — badge sempre dopo l'etichetta.
- [bassa] oggi-adesso__pc-light.png — barra laterale in basso — «Dati salvati su questo dispositivo» va a capo su due righe in grigio chiaro con icona disco: poco leggibile e sembra un avviso — una riga sola, più corta («Salvato in locale») o spostarla nelle impostazioni.
- [bassa] oggi-adesso__pc-light.png — «Aggiungi una nota» con tasto «C» — scorciatoia C non intuitiva per «nota» — usare N o mostrare «⌘K»/tooltip coerente col nome dell'azione.

## oggi-adesso-scorsa__pc-light.png
- [bassa] oggi-adesso-scorsa__pc-light.png — intera schermata — identica a oggi-adesso: il contenuto non scorre perché è tutto sopra la piega e lascia ~160 px vuoti sotto «Poi» — (nota per il test: nessuna parte in fondo da verificare) conferma che su computer c'è spazio per mostrare più contenuto («Più tardi», abitudini rimanenti, prossimo blocco del calendario).
- [bassa] oggi-adesso-scorsa__pc-light.png — sezione «Poi» — un solo elemento, nessun link «vedi tutte le attività di oggi» — aggiungere un rimando a La giornata/Attività per sapere cosa c'è dopo.

## giornata-giorno__pc-light.png
- [media] giornata-giorno__pc-light.png — intera area contenuto — qui il contenuto occupa tutta la larghezza (x 287–1241), mentre in «Adesso» è una colonna di 560 px: passando da una scheda all'altra della stessa sezione la pagina cambia larghezza — definire una griglia unica per sezione (es. max 960 px) o giustificare la differenza.
- [media] giornata-giorno__pc-light.png — intestazione «‹ Oggi ›» — il titolo dice solo «Oggi» senza data, e le frecce sono a 900 px di distanza ai due bordi: occhio e mouse fanno avanti-indietro — mostrare «Oggi · mar 18 ago» e raggruppare frecce + titolo (+ pulsante «Oggi») a sinistra, come Google Calendar/Fantastical.
- [media] giornata-giorno__pc-light.png — tre livelli di navigazione (barra laterale, schede Adesso/La giornata/Rituali, schede Giorno/Settimana/Mese/Anno) con tre stili diversi di pillola — troppi livelli impilati: la gerarchia non si legge — fondere Giorno/Settimana/Mese/Anno in un selettore segmentato a destra dell'intestazione data.
- [media] giornata-giorno__pc-light.png — calendario — su computer un blocco largo 890 px con il titolo in 12 px a sinistra e tutto il resto vuoto; manca un pannello laterale con le attività da pianificare da trascinare nel calendario — aggiungere colonna destra (~300 px) «Da pianificare» e ridurre la griglia oraria.
- [media] giornata-giorno__pc-light.png — linea dell'ora corrente 10:30 — attraversa il blocco «Organizzare cena» e la pillola «10:30» copre il bordo destro del blocco sotto la spunta verde — far passare la linea sotto i blocchi (z-index) o rendere la pillola più piccola nel solco orario a sinistra.
- [bassa] giornata-giorno__pc-light.png — blocchi «Colazione» / «Pranzo» — testo centrato mentre i blocchi attività hanno testo a sinistra; Colazione è alto ~24 px con testo che quasi tocca i bordi — allineare a sinistra come gli altri blocchi e dare altezza minima ~32 px.
- [bassa] giornata-giorno__pc-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — tre icone senza testo, non si capisce cosa siano né che la riga si apre (la freccia è a 900 px di distanza) — aggiungere etichetta «Sonno e pasti» e tooltip sulle icone.
- [bassa] giornata-giorno__pc-light.png — blocco completato — titolo barrato grigio su fondo grigio con stella e maniglia di trascinamento: contrasto basso (~2.5:1) — barrare ma mantenere testo al 60% almeno con contrasto 4.5:1; nascondere la maniglia sui blocchi completati.
- [bassa] giornata-giorno__pc-light.png — casella vuota del blocco «Confrontare piani telefonici» — bianca su giallo, bordo quasi invisibile, staccata in alto a destra lontano dal titolo — metterla a sinistra del titolo come nelle liste.

## giornata-giorno-fondo__pc-light.png
- [media] giornata-giorno-fondo__pc-light.png — parte alta — scorrendo spariscono schede, intestazione «‹ Oggi ›» e selettore Giorno/Settimana: in fondo non si sa più che giorno si guarda — rendere fissa (sticky) la riga data + selettore vista, e far scorrere solo la griglia oraria.
- [media] giornata-giorno-fondo__pc-light.png — «Senza orario» e campo «Nuova attività…» — stanno sotto 17 ore di calendario: per vederli bisogna scorrere tutto, e per trascinarli in un orario bisogna risalire — su computer metterli in una colonna laterale fissa accanto alla griglia.
- [media] giornata-giorno-fondo__pc-light.png — blocchi abitudine 18:00 e 22:00 — le abitudini hanno solo bordo verde mentre le attività sono piene colorate; «Leggere 20 minuti» è alto ~24 px, senza orario visibile, con la casella che tocca i bordi superiore e inferiore — altezza minima 36 px, mostrare orario inline («22:00 · Leggere 20 minuti») e unificare lo stile (stesso pieno tenue, icona per distinguere).
- [bassa] giornata-giorno-fondo__pc-light.png — riga «Ripasso flashcard» in «Senza orario» — icona libro blu, mentre la stessa abitudine altrove ha l'icona ↻ verde; l'icona orologio a destra è senza etichetta né tooltip — usare la stessa icona di tipo ovunque e scrivere «Dai un orario» o tooltip.
- [bassa] giornata-giorno-fondo__pc-light.png — «Sposta 1 non fatta a domani» — italiano un po' contratto (manca il soggetto) e link isolato centrato lontano da tutto — «Sposta a domani l'attività non fatta» come pulsante secondario allineato a sinistra sotto la lista.
- [bassa] giornata-giorno-fondo__pc-light.png — sotto il link — ~120 px vuoti in fondo, contenuto finito ma pagina che continua — ridurre il padding inferiore.

## giornata-settimana__pc-light.png
- [alta] giornata-settimana__pc-light.png — parte alta della griglia — la vista si apre già scorsa (o mantiene lo scorrimento della vista Giorno): non si vedono intestazioni dei giorni (lun 17, mar 18…), né schede né frecce; impossibile sapere quale colonna è quale giorno — intestazione dei giorni sticky in cima alla griglia e, al cambio vista, riportare lo scorrimento sull'ora corrente con l'intestazione visibile.
- [media] giornata-settimana__pc-light.png — blocchi «Camminata /…» — titoli troncati con puntini in colonne da 120 px, mentre c'è spazio per andare a capo (il blocco dura 45 min) — consentire 2 righe nei blocchi alti ≥ 30 px e accorciare il nome a «Camminata».
- [media] giornata-settimana__pc-light.png — colonna di oggi, 10:00 — la pillola «10:30» si sovrappone al testo barrato «con il gruppo» che esce dal blocco — pillola dell'ora solo nel solco orario a sinistra, linea sottile sopra i blocchi.
- [bassa] giornata-settimana__pc-light.png — blocchi pasti (☕ / 🍴) — riquadri grigi con solo un'icona da 10 px ripetuti 21 volte: rumore visivo, senza informazione — in settimana mostrarli come fascia tenue di sfondo senza bordo, oppure nasconderli.
- [bassa] giornata-settimana__pc-light.png — «Camminata» lunedì completata — fondo bianco con bordo grigio, quasi invisibile rispetto alle altre verdi — usare la stessa forma con opacità ridotta e spunta.
- [bassa] giornata-settimana__pc-light.png — sotto la griglia — ~100 px di vuoto e la griglia finisce a 00:00 con una riga in più — compattare.

## giornata-mese__pc-light.png
- [alta] giornata-mese__pc-light.png — parte alta — anche il Mese si apre scorso: la prima riga di giorni è tagliata in alto (cerchi a metà a y 0) e non si vedono nome del mese, giorni della settimana né le frecce — al cambio vista riportare lo scorrimento in cima; intestazione mese + giorni della settimana sticky.
- [media] giornata-mese__pc-light.png — anelli attorno ai numeri e puntini colorati sotto — nessuna legenda: non si capisce che l'anello è la % di completamento né cosa indicano i puntini (aree? attività?) — legenda sotto il calendario o tooltip al passaggio del mouse.
- [media] giornata-mese__pc-light.png — cella 18 (oggi) — doppio evidenziamento: rettangolo grigio di selezione + cerchio viola pieno + anello verde parziale: tre segnali sovrapposti — oggi = cerchio pieno, selezione = solo contorno; non entrambi i fondi.
- [media] giornata-mese__pc-light.png — elenco «Oggi» sotto il calendario — ordine non cronologico (22:00, senza ora, 18:00, 09:30, 15:00) — ordinare per orario, poi senza orario in fondo.
- [media] giornata-mese__pc-light.png — quadratini colorati a sinistra di ogni riga — sembrano caselle da spuntare (quelli vuoti con bordo) ma sono 10 px e probabilmente solo un colore area; l'attività completata non ha alcuna spunta, solo barrato — usare vere caselle 20 px cliccabili oppure un pallino colore chiaramente decorativo + casella separata.
- [bassa] giornata-mese__pc-light.png — «Sposta» solo sull'ultima riga, testo-link a 900 px dal titolo — azione che appare senza motivo apparente; mostrarla su hover per tutte le non fatte, o spiegarla («Sposta a domani»).
- [bassa] giornata-mese__pc-light.png — righe 24–31 — giorni futuri senza anello alla stessa grandezza: la griglia ha ritmi diversi, l'ultima riga contiene solo «31» e lascia ~60 px vuoti — accettabile, ma ridurre l'altezza delle righe vuote.

## giornata-anno__pc-light.png
- [alta] giornata-anno__pc-light.png — parte alta — come Settimana e Mese, l'Anno si apre già scorso: le card Gen–Apr sono tagliate in alto, anno e frecce invisibili — reset dello scorrimento al cambio vista.
- [media] giornata-anno__pc-light.png — mesi Gen–Mag e Set–Dic — giorni passati senza attività e giorni futuri hanno lo stesso grigio: non si distingue «non hai fatto nulla» da «non è ancora arrivato» (ad agosto la differenza è appena percettibile) — futuro senza riempimento (solo contorno tratteggiato), passato vuoto grigio chiaro.
- [media] giornata-anno__pc-light.png — numeri verdi «7», «25», «17» in alto a destra delle card — nessuna etichetta: giorni attivi? attività fatte? — scrivere «7 giorni» o tooltip, e mettere una legenda della scala di verdi sotto la griglia.
- [bassa] giornata-anno__pc-light.png — griglie dei mesi — nessuna intestazione dei giorni della settimana e nessun numero: per trovare un giorno preciso bisogna contare; il giorno di oggi in agosto ha solo un bordo sottile da 1 px quasi invisibile — tooltip con data al passaggio, bordo oggi 2 px viola.
- [bassa] giornata-anno__pc-light.png — card dei mesi — altezza fissa: i mesi con 5 righe (Gen, Apr, Giu) lasciano ~45 px vuoti in fondo, quelli con 6 righe no; il padding inferiore varia — ridurre l'altezza al contenuto o allineare le griglie in alto con padding uguale.
- [bassa] giornata-anno__pc-light.png — mese corrente «Ago» — bordo viola 2 px su tutta la card + titolo viola: va bene, ma è lo stesso trattamento usato altrove per «selezionato»; chiarire se cliccare un mese apre la vista Mese (cursore/hover).

## giornata-sonno-aperto__pc-light.png
- [alta] giornata-sonno-aperto__pc-light.png — intera schermata — il pannello «sonno e pasti» che dovrebbe essere aperto non si vede: la pagina è scorsa fino alle 08:00 e il pannello è fuori schermo sopra; chi lo apre perde subito ciò che ha aperto (o lo scorrimento automatico all'ora corrente lo spinge via) — non spostare lo scorrimento quando si apre il pannello; su computer aprirlo come pannello laterale/popover ancorato alla riga sonno.
- [bassa] giornata-sonno-aperto__pc-light.png — riga 07:00–08:00 in alto — la fascia tratteggiata del sonno è tagliata dal bordo superiore senza intestazione sticky — vedi giornata-giorno-fondo: intestazione fissa.
- [bassa] giornata-sonno-aperto__pc-light.png — stessi difetti dei blocchi già annotati (linea 10:30 sopra blocco, caselle lontane dal titolo, pasti centrati).

## giornata-scheda-blocco__pc-light.png
- [alta] giornata-scheda-blocco__pc-light.png — campo «Ora» — mostra «09:30 AM» (formato americano 12 ore) mentre tutto il resto dell'app usa 24 ore (09:30–11:00, 10:30) — forzare formato 24 h e locale it-IT nel selettore ora.
- [media] giornata-scheda-blocco__pc-light.png — titolo «Organizzare cena / con il gruppo» — va a capo dopo ~200 px pur avendo 380 px disponibili: la colonna del titolo è ristretta senza motivo — dare al titolo tutta la larghezza meno il pulsante ×.
- [media] giornata-scheda-blocco__pc-light.png — «↺ Togli la spunta» — azione testuale centrata, sospesa tra sottotitolo e campi, e lo stato «fatta» non è mai dichiarato — mostrare stato esplicito («✓ Fatta alle 10:12») con pulsante «Segna come da fare» allineato a sinistra o in fondo.
- [media] giornata-scheda-blocco__pc-light.png — valori «09:30 AM», «1 h 30», «Relazioni & Sociale» — tre stili diversi: nero su grigio, viola su lilla, viola su lilla senza ×; e il × grigio dentro la pillola è minuscolo — un solo stile di valore (testo scuro, pillola neutra), × separato e grande almeno 24 px.
- [bassa] giornata-scheda-blocco__pc-light.png — «1 h 30» — formato ibrido — «1 h 30 min» o «1:30».
- [bassa] giornata-scheda-blocco__pc-light.png — finestra — centrata sull'intera finestra (x 640) invece che sull'area di contenuto (x ~764), e senza accesso a note/passi/scheda completa — aggiungere «Apri scheda» e centrare sull'area contenuto o aprire come pannello laterale destro (più adatto a computer).
- [bassa] giornata-scheda-blocco__pc-light.png — «Sposta in Da fare» — dicitura poco chiara (toglie l'orario? la toglie da oggi?) — «Togli dal calendario» o «Rimanda (senza data)».

## giornata-scheda-abitudine__pc-light.png
- [alta] giornata-scheda-abitudine__pc-light.png — campo «Ora» — «06:00 PM» in formato 12 ore, mentre il blocco nel calendario dice 18:00–18:45 — formato 24 h.
- [media] giornata-scheda-abitudine__pc-light.png — pulsante «✓ Fatta» viola — in «Adesso» la stessa azione è «✓ Fatto» verde: cambia colore e genere grammaticale; inoltre «Fatta» con la spunta sembra uno stato già raggiunto, non un'azione — un unico pulsante ovunque: «Segna come fatta», stesso colore (verde = completato).
- [media] giornata-scheda-abitudine__pc-light.png — «Finisce qui» — espressione criptica: non si capisce che interrompe l'abitudine da oggi in poi; è un'azione distruttiva presentata in viola come le altre — «Interrompi l'abitudine da oggi» in rosso/neutro con conferma.
- [media] giornata-scheda-abitudine__pc-light.png — confronto con la scheda attività — stessa finestra ma struttura diversa (lì «Togli la spunta» testo centrato, qui pulsante pieno; lì «Elimina» rosso, qui nessun rosso) — uniformare: stato/azione principale nello stesso punto e stile, azioni distruttive sempre in fondo in rosso.
- [bassa] giornata-scheda-abitudine__pc-light.png — «Togli solo da oggi» — italiano poco naturale — «Salta oggi» (come in Adesso).
- [bassa] giornata-scheda-abitudine__pc-light.png — pillola «Salute & Sport» — unica senza ×, più larga e con padding diverso dalle altre due — stesso componente per tutti i valori.

## rituali__pc-light.png
- [media] rituali__pc-light.png — elenco rituali — 5 righe larghe 955 px con nome a sinistra e stato a destra a 800 px di distanza, e i 2/3 inferiori dello schermo vuoti — su computer: elenco a sinistra (~340 px) e rituale aperto nel pannello destro (master-detail), oppure card in griglia 2–3 colonne con stato sotto il nome.
- [media] rituali__pc-light.png — nomi «Check-in», «Review della sera», «Review della settimana» — inglese misto a italiano, mentre «Piano del giorno» e «Sonno e pasti» sono italiani — «Come stai», «Bilancio della sera», «Bilancio della settimana» (o «Revisione…»).
- [media] rituali__pc-light.png — stati a destra — vocabolario incoerente: «da fare», «da compilare», «fatto», con sottotitoli diversi («2 di 3 scelte», «0 di 4»), tutto in 11–12 px grigio — usare un'unica pillola di stato («Da fare» / «In corso 2/3» / «Fatto ✓») a 13 px.
- [media] rituali__pc-light.png — badge «1» sulla scheda Rituali — risultano 4 rituali da fare/compilare ma il badge dice 1: non si capisce cosa conti — badge = rituali da fare adesso, con tooltip; o rimuoverlo.
- [bassa] rituali__pc-light.png — icona di «Piano del giorno» piena viola, le altre tenui — non è spiegato che indica il rituale del momento — aggiungere etichetta «Adesso» o un orario suggerito per ogni rituale («mattina», «sera», «domenica»).
- [bassa] rituali__pc-light.png — testi di stato — allineati a destra su due righe con interlinea strettissima (11 px) — più aria, o una riga sola.

## rituale-piano__pc-light.png
- [media] rituale-piano__pc-light.png — contenuto del Piano del giorno — nessuna istruzione: compare direttamente un elenco senza dire «Scegli fino a 3 cose importanti per oggi»; «2 di 3 scelte» è solo nello stato in alto a destra — una riga introduttiva sotto il titolo.
- [media] rituale-piano__pc-light.png — pulsante «Salva +5 XP» — barra viola alta 52 px larga 924 px: sproporzionata su computer; «+5 XP» attaccato all'etichetta con peso diverso sembra un errore di testo — pulsante largo al contenuto (~200 px) allineato a destra, XP come piccola nota accanto o dopo il salvataggio.
- [media] rituale-piano__pc-light.png — campi «Aggiungi un'altra…» e «Es. alle 9:00, alla scrivania» — campi grigi pieni senza bordo, mentre in La giornata «Nuova attività…» è bianco con bordo: due stili di input — un unico stile di campo in tutta l'app.
- [media] rituale-piano__pc-light.png — righe scelte — nessuna casella né maniglia: non si capisce se si possono spuntare, riordinare o togliere; l'icona area (persone rosa, portafoglio giallo) a destra è senza significato esplicito — mostrare ×/rimuovi su hover, pallino area a sinistra coerente con le altre liste.
- [bassa] rituale-piano__pc-light.png — riga completata «Organizzare cena…» — barrata grigia ma con chip «★ Priorità» pieno viola che resta acceso: contrasto di gerarchia invertito — attenuare anche il chip.
- [bassa] rituale-piano__pc-light.png — «Quando inizi?» — etichetta 13 px grassetto grigio, più piccola del testo delle righe: gerarchia debole; non è chiaro che si riferisce alla prima attività — «Quando e dove inizi la prima?».

## rituale-sonno-pasti__pc-light.png
- [alta] rituale-sonno-pasti__pc-light.png — righe «A letto 11:30 PM» e «Sveglia 07:30 AM» — formato 12 ore AM/PM, e 2 righe sopra lo stesso orario è scritto «23:30–07:30»: due formati nello stesso riquadro — 24 h ovunque.
- [alta] rituale-sonno-pasti__pc-light.png — due pulsanti di conferma — «Salva» (lilla, piccolo, solo per il sonno) a metà e «Fatto» (viola pieno) in fondo: non si capisce se bisogna premerli entrambi né cosa succede premendo solo «Fatto» — un solo salvataggio in fondo; il sonno si conferma con «Come sempre» o modificando l'orario.
- [media] rituale-sonno-pasti__pc-light.png — pulsanti «sì / no / ⏰» dei pasti — minuscoli, grigi identici, nessuno stato selezionato visibile, l'orologio senza etichetta — segmentato «Sì / No» con stato selezionato colorato, «Altro orario» come link testuale; iniziali maiuscole.
- [media] rituale-sonno-pasti__pc-light.png — «Come sempre · 23:30–07:30» in alto a destra — sembra un'informazione, in realtà è un pulsante (scorciatoia per confermare) — renderlo un pulsante secondario evidente: «Come sempre (23:30–07:30)».
- [bassa] rituale-sonno-pasti__pc-light.png — sezione «Altre cose fatte» — fuori tema in un rituale «Sonno e pasti» e campo grigio diverso dagli altri — spostarla nella Review della sera o rinominare il rituale.
- [bassa] rituale-sonno-pasti__pc-light.png — stato «0 di 4» — non dice 4 di cosa (sonno + 3 pasti) — «0 di 4 voci».
- [bassa] rituale-sonno-pasti__pc-light.png — righe sonno vs righe pasti — sonno: icona + etichetta grassetto + orario a destra; pasti: etichetta + sottotitolo + 3 pulsanti: due layout diversi nello stesso pannello, con altezze riga diverse (52 vs 52 ma interlinee diverse) — uniformare.
- [bassa] rituale-sonno-pasti__pc-light.png — pulsante «Fatto» largo 924 px a filo del fondo dello schermo — come sopra, pulsante più contenuto e margine inferiore.

## rituale-checkin__pc-light.png
- [alta] rituale-checkin__pc-light.png — Check-in con stato «✓ fatto» — nessuno dei pulsanti 1–5 è selezionato: le risposte già date oggi non si vedono, sembra un modulo vuoto da rifare — mostrare i valori registrati (pulsante pieno) e il pulsante «Aggiorna» invece di «Registra».
- [media] rituale-checkin__pc-light.png — scale 1–5 — 15 pulsanti da 178×50 px: enormi su computer, la sezione occupa 450 px di altezza per 3 domande — pulsanti 44×44 raggruppati a sinistra accanto alla domanda (una riga per domanda), o slider/emoji.
- [media] rituale-checkin__pc-light.png — verbi di conferma — «Registra» qui, «Salva» nel Piano, «Salva»+«Fatto» in Sonno e pasti: tre verbi per lo stesso gesto — scegliere un verbo unico («Salva»).
- [media] rituale-checkin__pc-light.png — «Registra +3 XP» — pulsante lilla chiaro con bordo, sembra disabilitato; gli altri rituali hanno il pulsante viola pieno — stesso stile primario; se disabilitato finché non si sceglie, dirlo.
- [bassa] rituale-checkin__pc-light.png — «Media recente 4.3 / 4.2» — separatore decimale inglese — «4,3» (locale italiano).
- [bassa] rituale-checkin__pc-light.png — «5 · concentratissimo» — parola forzata, nessuna app la usa — «5 · molto concentrato» / «5 · a fuoco».
- [bassa] rituale-checkin__pc-light.png — domande «Quanta energia hai?» ecc. — 13 px grigio scuro, più piccole delle etichette dei pulsanti (16 px): la domanda è gerarchicamente sotto la risposta — domande 15–16 px semibold.
- [bassa] rituale-checkin__pc-light.png — «Andamento degli ultimi 14 giorni» in fondo — titolo 20 px più grande dei nomi dei rituali (16 px) e tagliato dal bordo inferiore; un grafico dentro una fisarmonica dentro una card — spostare l'andamento in Andamento o renderlo un sottotitolo più piccolo.

## rituale-sera__pc-light.png
- [alta] rituale-sera__pc-light.png — elenco delle 8 aree con 1–5 — nessuna domanda né legenda: non si sa cosa si sta votando (soddisfazione? tempo dedicato?) né cosa significano 1 e 5 — titolo «Come è andata oggi in ogni area?» + legenda «1 male · 5 benissimo»; permettere di saltare le aree non toccate.
- [media] rituale-sera__pc-light.png — scala 1–5 — qui è un gruppo di quadratini grigi 36×36 senza bordo, nel Check-in sono pulsanti bianchi con bordo 178×50: stesso componente con due aspetti — unico componente «scala» in tutta l'app.
- [media] rituale-sera__pc-light.png — righe aree — nome a sinistra e pulsanti a destra con ~580 px vuoti in mezzo: occhio costretto a viaggiare per riga — avvicinare la scala al nome (colonna a larghezza fissa) o restringere il pannello.
- [bassa] rituale-sera__pc-light.png — «Progetti Founder» — inglese — «Progetti personali» / «Startup» (se è un'area creata dall'utente, ok; se è predefinita, tradurre).
- [bassa] rituale-sera__pc-light.png — «Cosa è andato bene oggi?» in fondo — tagliato al bordo; la sezione è molto lunga (8 righe + domande) per un rituale serale «veloce» — mostrare solo le aree attive oggi, comprimere il resto.

## rituale-settimana__pc-light.png
- [media] rituale-settimana__pc-light.png — numeri «216 / 10 / 6/7» — carattere con grazie (serif) che non compare in nessun'altra parte dell'app — usare il font di sistema dell'app (cifre tabulari, peso bold).
- [media] rituale-settimana__pc-light.png — riga statistiche — centrata, mentre tutto il resto del pannello è allineato a sinistra a x 302 — allinearla a sinistra o farne tre card a tutta larghezza.
- [media] rituale-settimana__pc-light.png — domande «Cosa ha funzionato questa settimana», «Cosa ti ha bloccato»… — senza punto interrogativo (nella sera invece «Cosa è andato bene oggi?» lo ha) — aggiungere «?» ovunque.
- [media] rituale-settimana__pc-light.png — 4 aree di testo grigie a tutta larghezza (924 px), vuote, senza segnaposto, con maniglia di ridimensionamento visibile — su computer griglia 2×2, segnaposto d'esempio, nascondere la maniglia (auto-altezza).
- [bassa] rituale-settimana__pc-light.png — «azioni completate» — altrove si parla di «attività»; «XP guadagnati» gergo da videogioco non spiegato — «attività fatte», «punti».
- [bassa] rituale-settimana__pc-light.png — «Review della settimana» «da fare» di martedì — appare come da fare tutti i giorni; indicare quando è previsto («domenica») e non contarlo nel badge negli altri giorni.

## attivita-sistemare__pc-light.png
- [media] attivita-sistemare__pc-light.png — layout — colonna di 620 px allineata a sinistra con 335 px vuoti a destra: è il terzo schema di larghezza (Adesso centrato stretto, Giornata a tutta larghezza, qui a sinistra) — una sola regola di larghezza per le pagine di contenuto.
- [media] attivita-sistemare__pc-light.png — menu «Altro / Esplorazione» — select nativo del sistema con freccia del browser, fuori stile rispetto a tutto il resto — usare il selettore area personalizzato (pillola con pallino colore) usato nelle schede.
- [media] attivita-sistemare__pc-light.png — nessuna spiegazione del gesto — non è detto «Decidi dove va questa nota» prima dei tre pulsanti «Oggi / Da fare / Scarta»; il collegamento fra la card e i pulsanti esterni è debole — mettere i pulsanti dentro la card, sotto un'etichetta «Dove la metti?».
- [bassa] attivita-sistemare__pc-light.png — titolo «Da sistemare» sotto la scheda «Da sistemare» — ripetizione inutile — togliere l'etichetta o sostituirla con «1 di 6».
- [bassa] attivita-sistemare__pc-light.png — «In coda» — elementi in testo grigio semplice, non cliccabili in apparenza, e «e un'altra» in corsivo suona strano — righe cliccabili con hover per sistemarle in qualsiasi ordine; «+1 altra».
- [bassa] attivita-sistemare__pc-light.png — contatori — nelle schede sono quadratini lilla, nella barra laterale cerchio viola pieno; il «6» della barra laterale coincide con Da sistemare e non con Da fare (9): ambiguo — stesso stile badge e tooltip «6 note da sistemare».
- [bassa] attivita-sistemare__pc-light.png — «Idea: bot che trasforma i vocali in task» — nei dati demo «task» inglese (accettabile, è testo utente).

## attivita-dafare__pc-light.png
- [alta] attivita-dafare__pc-light.png — icona ◎ quadrata a sinistra di ogni riga — sta dove l'utente si aspetta la casella di completamento, ma è un'altra cosa (probabilmente «metti in Oggi», piena viola sulla prima riga): rischio di tocchi sbagliati e nessun modo visibile per completare — casella di spunta a sinistra, «Aggiungi a Oggi» come icona su hover a destra con tooltip.
- [media] attivita-dafare__pc-light.png — «1 di 3», «1 di 4» a destra — non dice che sono passi — «1/3 passi» o mini barra di progresso.
- [media] attivita-dafare__pc-light.png — layout — qui la lista è a tutta larghezza (955 px) mentre in «Da sistemare», scheda sorella, è 620 px a sinistra — stessa larghezza per le schede della stessa sezione; su computer valutare lista + dettaglio a destra.
- [bassa] attivita-dafare__pc-light.png — icone area (libro, razzo, valigetta…) a 12 px colorate attaccate al titolo — troppo piccole per essere riconosciute — pallino/icona 16 px con nome area in grigio sotto il titolo o tooltip.
- [bassa] attivita-dafare__pc-light.png — filtro «Tutte» — isolato, senza dire cosa filtra (area? stato?) — «Area: tutte».
- [bassa] attivita-dafare__pc-light.png — righe con sottotitolo («scade tra 20 giorni») più alte delle altre, e titolo non centrato verticalmente rispetto all'icona — ok, ma allineare l'icona alla prima riga di testo.
- [bassa] attivita-dafare__pc-light.png — «Importanti 3 / Altre 6» — etichette sezione 13 px grigio molto deboli rispetto alle righe 16 px — 14 px semibold con più spazio sopra.

## attivita-dafare-aggiunta__pc-light.png
- [media] attivita-dafare-aggiunta__pc-light.png — opzioni sotto il campo — chip «Oggi / Domani / Senza data» (32 px, bordo) affiancati a un select nativo «Altro / Esplorazione» alto 42 px con freccia di sistema: altezze e stili diversi sulla stessa riga — select personalizzato alto come i chip, con pallino area.
- [media] attivita-dafare-aggiunta__pc-light.png — riga opzioni rientrata (x 298) rispetto al campo e al filtro (x 287) — allineare il bordo sinistro.
- [media] attivita-dafare-aggiunta__pc-light.png — opzioni senza etichette — non è detto «Quando:» e «Area:»; «Senza data» preselezionato viola pieno, stesso colore del pulsante principale — etichette brevi e stato selezionato più tenue (lilla) per non competere con «Aggiungi».
- [bassa] attivita-dafare-aggiunta__pc-light.png — filtro «Tutte» subito sotto le opzioni del nuovo elemento — si confonde con le opzioni di creazione — separare con più spazio o spostare il filtro accanto al titolo di sezione a destra.
- [bassa] attivita-dafare-aggiunta__pc-light.png — mancano ora/durata/«Importante» fra le opzioni rapide — offrirli o indicare che si possono aggiungere dopo dalla scheda.

## attivita-abitudini__pc-light.png
- [media] attivita-abitudini__pc-light.png — campo «Nuova abitudine…» — qui è in fondo alla lista, in «Da fare» è in cima: stessa funzione in posizione diversa nelle schede sorelle — scegliere una posizione (in cima) per entrambe.
- [media] attivita-abitudini__pc-light.png — cerchi di completamento a destra (44 px, colore dell'area) — altrove si completa con caselle quadrate a sinistra o con il pulsante «Fatto»: tre controlli diversi per «fatto» — un unico controllo (casella a sinistra) in tutte le liste.
- [media] attivita-abitudini__pc-light.png — righe abitudine — manca la frequenza (ogni giorno? lun–ven?) e lo stato della settimana — aggiungere «Ogni giorno» e 7 puntini della settimana: su computer lo spazio c'è (700 px vuoti per riga).
- [bassa] attivita-abitudini__pc-light.png — riepilogo «0 di 3 oggi» con anello vuoto grigio 60 px — l'anello vuoto quasi bianco su fondo chiaro sembra un elemento non caricato; «oggi» minuscolo sotto, staccato — «0 di 3 fatte oggi» su una riga, anello con traccia più visibile.
- [bassa] attivita-abitudini__pc-light.png — «🔥 3» solo sulla prima riga — numero senza etichetta, e in Adesso il 🔥38 indica altro (serie globale) — «3 giorni di fila» in tooltip; distinguere serie abitudine e serie generale.
- [bassa] attivita-abitudini__pc-light.png — metà inferiore dello schermo vuota — come sopra.

## attivita-abitudini-nuova__pc-light.png
- [alta] attivita-abitudini-nuova__pc-light.png — «Giorni: Ogni giorno» con i 7 cerchi L M M G V S D tutti vuoti — contraddizione visiva: se è ogni giorno i cerchi dovrebbero essere tutti selezionati — tutti pieni quando «Ogni giorno», o mostrarli vuoti solo con etichetta «Scegli i giorni».
- [media] attivita-abitudini-nuova__pc-light.png — cerchi dei giorni distribuiti su 930 px (150 px fra uno e l'altro) — sembrano scollegati, non un unico controllo — gruppo compatto di 7 pulsanti 40 px con 8 px di spazio, allineato a sinistra o a destra accanto a «Giorni».
- [media] attivita-abitudini-nuova__pc-light.png — «Ora: Nessuno» — errore di genere — «Nessuna» (o «Senza orario», come in La giornata).
- [media] attivita-abitudini-nuova__pc-light.png — pulsante «Aggiungi» dentro il campo, sopra le opzioni — si conferma prima di aver visto le opzioni; ordine invertito — pannello opzioni sotto il nome e pulsante «Aggiungi abitudine» in fondo.
- [bassa] attivita-abitudini-nuova__pc-light.png — intestazione — la pagina è salita di ~14 px (barra schede a y 37 invece di 51) aprendo il campo: salto di layout — evitare lo scorrimento automatico quando lo spazio basta.
- [bassa] attivita-abitudini-nuova__pc-light.png — area predefinita — qui «Salute & Sport» come pillola, in Da fare «Altro / Esplorazione» come select nativo: default e componente diversi — stesso componente e stesso default (ultima usata).

## scheda-attivita__pc-light.png
- [alta] scheda-attivita__pc-light.png — «Pianifica: Ieri» — proporre di pianificare un'attività nel passato non ha senso (probabilmente bug di calcolo: dovrebbe essere «Oggi»/«Dopodomani») — togliere «Ieri», le scelte devono essere solo future.
- [media] scheda-attivita__pc-light.png — chip «Ieri / Domani / Gio / Tra una settimana» — «Gio» abbreviato accanto a etichette estese; «Un altro giorno» va a capo da solo — «Giovedì», e tutto su una riga (c'è spazio se la finestra è più larga).
- [media] scheda-attivita__pc-light.png — finestra — 460 px di larghezza su schermo 1280 con scorrimento interno: «Dettagli» e «Area» sono tagliati in fondo e la parte importante resta nascosta — su computer finestra 640–720 px in due colonne (passi a sinistra, pianifica/dettagli a destra) o pannello laterale a tutta altezza.
- [media] scheda-attivita__pc-light.png — «Distribuisci i passi: ogni giorno / ogni 2 giorni / ogni settimana» — non si capisce cosa succede (assegna date ai passi?) e chip minuscoli bianchi diversi dagli altri chip grigi — frase esplicativa («Dai una data a ogni passo: …») e stesso stile chip della sezione Pianifica.
- [bassa] scheda-attivita__pc-light.png — titolo su due righe con colonna ristretta — come nella scheda del calendario: allargare.
- [bassa] scheda-attivita__pc-light.png — «Prossimo passo in Oggi» — dicitura ellittica — «Metti il prossimo passo in Oggi».
- [bassa] scheda-attivita__pc-light.png — campo «Aggiungi un passo…» con «+» a sinistra e «Aggiungi» a destra — doppio segnale; scegliere uno.

## scheda-attivita-fondo__pc-light.png
- [media] scheda-attivita-fondo__pc-light.png — «Fissa in alto … no» — opzione sì/no mostrata come testo grigio «no» senza controllo: non sembra modificabile — usare un interruttore (switch).
- [media] scheda-attivita-fondo__pc-light.png — «↺ Non completata ›» — per un'attività che non è completata, l'azione si legge come uno stato; non si capisce cosa faccia — se serve a segnare «non fatta/abbandonata» scrivere «Segna come non fatta» o «Archivia».
- [media] scheda-attivita-fondo__pc-light.png — righe «Dettagli» — «Area» ha freccia giù (menu), «Scadenza» freccia a destra (navigazione), «Fissa in alto» nessuna: tre affordance diverse in un gruppo — coerenza: valore + chevron unico o controlli espliciti.
- [media] scheda-attivita-fondo__pc-light.png — confronto con giornata-scheda-blocco — stessa attività, due schede diverse (lì Ora/Durata/Area pillole e «Sposta in Da fare»; qui Pianifica/Passi/Dettagli): l'utente non ritrova le stesse opzioni — una scheda unica con le stesse sezioni.
- [bassa] scheda-attivita-fondo__pc-light.png — intestazione della finestra — il titolo resta fisso ma il contenuto ci scorre sotto senza ombra/divisore: la riga «Recuperare modulo 1» appare tagliata a metà sotto il titolo — aggiungere separatore o ombra quando si scorre.
- [bassa] scheda-attivita-fondo__pc-light.png — «nessuna», «no» minuscoli e grigio chiaro — valori poco leggibili — iniziale maiuscola, contrasto 4.5:1.

## scheda-abitudine__pc-light.png
- [alta] scheda-abitudine__pc-light.png — «Ora 06:00 PM» — formato 12 ore (sopra, nella stessa finestra, «lun–ven · 18:00») — 24 h.
- [media] scheda-abitudine__pc-light.png — calendario dell'abitudine — nessun nome del mese; i giorni di luglio (27–31) hanno lo stesso cerchio grigio dei giorni mancati di agosto (3, 4, 5, 12): non si distingue mese precedente / giorno mancato — titolo «Agosto», giorni fuori mese senza cerchio e in grigio chiaro, giorni mancati con contorno.
- [media] scheda-abitudine__pc-light.png — selettore giorni «Quando» — qui compatto e pieno viola, nella creazione abitudine (attivita-abitudini-nuova) sparpagliato e vuoto: stesso controllo con due aspetti — un solo componente.
- [bassa] scheda-abitudine__pc-light.png — «×» dell'ora — qui fuori dalla pillola, nella scheda del calendario dentro un cerchio grigio nella pillola — uniformare.
- [bassa] scheda-abitudine__pc-light.png — pulsante «✓ Fatta» viola — vedi sopra: stessa azione verde «Fatto» in Adesso — uniformare colore e testo.
- [bassa] scheda-abitudine__pc-light.png — finestra stretta (460 px) con calendario + impostazioni impilati e scorrimento — su computer calendario e impostazioni affiancati.

## scheda-abitudine-fondo__pc-light.png
- [alta] scheda-abitudine-fondo__pc-light.png — «Inizio 07/29/2026» — formato data americano mese/giorno — «29/07/2026» o meglio «29 lug 2026» (locale it-IT).
- [media] scheda-abitudine-fondo__pc-light.png — pulsante «Elimina» — testo rosso centrato in un riquadro grigio a tutta larghezza, senza icona; nella scheda attività «Elimina» è una riga allineata a sinistra con icona cestino — stesso componente per l'azione distruttiva.
- [bassa] scheda-abitudine-fondo__pc-light.png — valori «Salute & Sport», «07/29/2026» viola, «Mai» grigio scuro, «45 min» viola, «06:00 PM» nero — colori dei valori casuali — un unico colore per i valori modificabili.
- [bassa] scheda-abitudine-fondo__pc-light.png — calendario tagliato dal titolo fisso senza separatore (riga 3–9 mozzata) — divisore/ombra sotto l'intestazione.
- [bassa] scheda-abitudine-fondo__pc-light.png — «Inizio» modificabile su un'abitudine con storico — rischio di cancellare la storia senza avviso — chiedere conferma.

## andamento__pc-light.png
- [alta] andamento__pc-light.png — card «Per area», nomi aree — troncati a forza senza puntini: «Relazioni & Soci», «Studio / Univer», «Altro / Esplorazi», «Progetti Found» — colonna nomi larga ~150 px con ellissi, o nome sopra la barra; su 470 px di card lo spazio c'è.
- [alta] andamento__pc-light.png — barre «Per area» — partono da x diverse (913–921) e finiscono a x diverse perché la colonna percentuale ha larghezza variabile: le barre non sono confrontabili a occhio — griglia a tre colonne fisse (nome | barra | valore) con colonna valore a larghezza fissa e cifre tabulari.
- [media] andamento__pc-light.png — «🔥 38» e «65% · 81 di 124» — numeri grandi senza etichetta: non si sa cosa contino — «38 giorni di fila», «65% delle attività completate (81 di 124) negli ultimi 30 giorni».
- [media] andamento__pc-light.png — card «Costanza» — mappa di calore di 200×100 px dentro una card di 470×320: ~60% della card vuota; nessuna etichetta di mesi/giorni; colore blu, mentre la vista Anno usa il verde per lo stesso concetto — ingrandire le celle a tutta larghezza, etichette mesi, stesso colore (verde) della vista Anno.
- [media] andamento__pc-light.png — striscia settimana M G V S D L M — giorni distribuiti su 900 px, «V» vuoto senza spiegazione (giorno saltato?), nessuna data — compattarla, aggiungere numeri dei giorni e tooltip.
- [bassa] andamento__pc-light.png — «Archivio review» — inglese — «Archivio dei bilanci»; il «79» senza etichetta.
- [bassa] andamento__pc-light.png — riga «Aree» in Andamento — duplica Profilo › Aree — chiarire se mostra statistiche o porta alle impostazioni.
- [bassa] andamento__pc-light.png — card «Costanza» e «Per area» — altezze uguali forzate con «Costanza» quasi vuota — altezza al contenuto o riempirle.

## andamento-fondo__pc-light.png
- [media] andamento-fondo__pc-light.png — elenco «Archivio review / Sessioni del timer / Aree / Grafici» — quattro destinazioni importanti nascoste in fondo come righe di impostazioni a tutta larghezza; «Grafici» è un contenitore generico — su computer farne schede o card con anteprima (es. ultimo bilancio, ore di timer della settimana).
- [bassa] andamento-fondo__pc-light.png — righe dell'elenco — solo «Archivio review» ha un contatore; le altre no — o tutte o nessuna.
- [bassa] andamento-fondo__pc-light.png — stessi difetti di andamento__pc-light (nomi aree troncati, barre disallineate, card Costanza vuota).

## scoperte__pc-light.png
- [media] scoperte__pc-light.png — sottotitoli «misurato», «lo noto ogni volta», «notato una volta» — livelli di certezza non spiegati e con forme verbali miste (prima persona presente / participio) — scala esplicita e coerente: «Certezza: misurata / alta / bassa» o «Visto 1 volta / Visto spesso / Misurato».
- [media] scoperte__pc-light.png — icone 👍/👎 in un riquadro con bordo a sinistra — sembrano pulsanti di voto cliccabili come le caselle delle altre liste — icona senza riquadro (decorativa), oppure davvero cliccabile per spostare tra Funziona/Non funziona.
- [bassa] scoperte__pc-light.png — campo «Aggiungi una scoperta…» — non dice dove finirà (Funziona o Non funziona) — opzioni 👍/👎 accanto al campo.
- [bassa] scoperte__pc-light.png — tre livelli di schede (barra laterale › Riepilogo/Scoperte › Registro/Esperimenti) come in La giornata — navigazione profonda; «Registro» è un nome tecnico — «Cosa ho scoperto».
- [bassa] scoperte__pc-light.png — righe a tutta larghezza (955 px) con chevron a 900 px dal titolo — su computer griglia di card su due colonne (Funziona | Non funziona) sfrutterebbe meglio lo spazio e renderebbe il confronto immediato.

## scoperte-esperimenti__pc-light.png
- [media] scoperte-esperimenti__pc-light.png — grafico, etichette «media 3,1» e «media 4,3» — scritte sopra i punti e la linea tratteggiata (a 4,3 il testo è attraversato da un punto) — etichette fuori area dati a destra, con fondo bianco.
- [media] scoperte-esperimenti__pc-light.png — chip «⚑ concluso» e «Focus (da check-in, 1–5)» — hanno bordo e aspetto di pulsanti ma sono etichette — pillole senza bordo con fondo tenue; «Concluso» con iniziale maiuscola.
- [media] scoperte-esperimenti__pc-light.png — riquadro risultato «L'entità del cambiamento è grande (d≈3,1)» — gergo statistico (d di Cohen) incomprensibile per l'utente medio — «Differenza molto chiara» e il dettaglio tecnico in un «Scopri di più».
- [bassa] scoperte-esperimenti__pc-light.png — testo introduttivo e «La modifica: …» — colonne di 400 px dentro card di 955 px, mentre il riquadro risultato va a tutta larghezza: misure di riga incoerenti — max ~680 px per tutti i paragrafi.
- [bassa] scoperte-esperimenti__pc-light.png — «Esperimenti 2» ma il secondo esperimento è sotto la piega senza indizio — elenco compatto degli esperimenti in alto, dettaglio sotto.
- [bassa] scoperte-esperimenti__pc-light.png — asse Y con solo 1, 3, 5 e asse X senza date — aggiungere date di inizio/modifica/fine sull'asse X.
- [bassa] scoperte-esperimenti__pc-light.png — intro «Per prima cosa l'app misura…» — card spiegazione sempre visibile, anche per chi ha già 2 esperimenti — renderla richiudibile.

## scheda-scoperta__pc-light.png
- [alta] scheda-scoperta__pc-light.png — «Esito», primo pulsante — riquadro bianco vuoto: l'opzione selezionata («👍 funziona») è invisibile (testo bianco su bianco o stato selezionato rotto) — stato selezionato con fondo viola/verde e testo bianco, come in «Evidenza».
- [media] scheda-scoperta__pc-light.png — «Evidenza» — falso amico dall'inglese «evidence»: in italiano «evidenza» = cosa evidente — «Quanto ne sei sicuro?» o «Prove».
- [media] scheda-scoperta__pc-light.png — «Togli questa riga» — gergo da foglio di calcolo — «Elimina scoperta», come le altre schede usano «Elimina».
- [media] scheda-scoperta__pc-light.png — selezione «Evidenza» (viola pieno) e «Esito» (bianco con bordo) — due componenti segmentati diversi nella stessa finestra — stesso componente.
- [bassa] scheda-scoperta__pc-light.png — «Scritta 20 lug» — participio poco naturale — «Aggiunta il 20 lug».
- [bassa] scheda-scoperta__pc-light.png — titolo «Una cosa che hai capito» e etichetta «Cosa hai capito» ripetuti; la sezione si chiama «Scoperte» — titolo «Scoperta», etichetta «Cosa hai scoperto».
- [bassa] scheda-scoperta__pc-light.png — «Provalo con un esperimento» proposto anche se l'evidenza è già «misurato» — mostrarlo solo quando l'evidenza è debole, o rimandare all'esperimento esistente.

## profilo__pc-light.png
- [media] profilo__pc-light.png — barra laterale — nessuna voce è evidenziata: «Profilo e impostazioni» in basso non prende lo stato attivo, l'utente perde il riferimento — evidenziarla come le voci principali.
- [media] profilo__pc-light.png — statistiche «109 fatte · 65% riuscita» — in Andamento lo stesso 65% corrisponde a «81 di 124»: numeri diversi per la stessa percentuale, sembrano dati incoerenti — usare gli stessi numeri o specificare il periodo («dall'inizio» vs «ultimi 30 giorni»).
- [media] profilo__pc-light.png — «Promemoria · bloccati» — parola allarmante senza spiegazione (le notifiche del browser sono negate) — «Notifiche disattivate nel browser» con icona di avviso e azione «Attiva».
- [bassa] profilo__pc-light.png — «riuscita» — sostantivo poco usato in questo senso — «completate» / «tasso di completamento».
- [bassa] profilo__pc-light.png — «Diario» dentro il Profilo — è contenuto, non un'impostazione: difficile da trovare — spostarlo in Andamento o in barra laterale.
- [bassa] profilo__pc-light.png — intestazione profilo — nessun modo evidente per modificare nome e motto (manca «Modifica») — icona matita su hover.
- [bassa] profilo__pc-light.png — layout — colonna 640 px centrata, senza barra schede in alto né titolo pagina: quarta variante di impaginazione — titolo «Profilo» in alto a sinistra come le altre sezioni.

## impostazioni__pc-light.png
- [media] impostazioni__pc-light.png — Impostazioni come finestra stretta (460 px) con scorrimento interno sopra il Profilo — su computer le impostazioni sono una pagina (o finestra larga 2 colonne: elenco sezioni a sinistra, dettaglio a destra), non un foglio da telefono.
- [media] impostazioni__pc-light.png — sezione «Account» — contiene solo «Sincronizzazione: su questo dispositivo», che non è un account e non è una sincronizzazione — «Dati: salvati su questo dispositivo» sotto «I tuoi dati»; togliere «Account» finché non esiste.
- [media] impostazioni__pc-light.png — secondo gruppo (Area predefinita, Timer, Musica, Aspetto) senza titolo di sezione, mentre gli altri ne hanno uno — aggiungere «Preferenze».
- [bassa] impostazioni__pc-light.png — «Backup e ripristino · 1» — il numero non si spiega — «1 backup» o data dell'ultimo («ieri, 22:10»).
- [bassa] impostazioni__pc-light.png — «Area predefinita» con freccia giù, le altre righe con freccia a destra; valori minuscoli («chiedi sempre», «nessuna», «automatico») — coerenza affordance e maiuscole.
- [bassa] impostazioni__pc-light.png — «Scienza» in Guida — titolo vago — «Su cosa si basa l'app».

## impostazioni-fondo__pc-light.png
- [media] impostazioni-fondo__pc-light.png — «Registro tecnico» e «Design lab» nella sezione «Guida» — strumenti per sviluppatori esposti all'utente finale, e «Design lab» in inglese — nasconderli (modalità sviluppatore) o metterli in una sezione «Avanzate» in fondo.
- [media] impostazioni-fondo__pc-light.png — «Rimuovi dati di esempio» — azione importante per chi inizia, sepolta in fondo alle impostazioni in «Reimposta» accanto a «Cancella tutti i dati» — proporla anche con un banner in Oggi finché i dati d'esempio ci sono.
- [bassa] impostazioni-fondo__pc-light.png — «Esporta dati» e «Importa dati» senza chevron né indicazione del formato, mentre «Backup e ripristino» ha chevron — aggiungere «(JSON)» o una descrizione e coerenza chevron.
- [bassa] impostazioni-fondo__pc-light.png — intestazione fissa che taglia la riga precedente (bordo grigio visibile a y 100) senza separatore — ombra/divisore.

## imp-timer__pc-light.png
- [media] imp-timer__pc-light.png — «Pausa lunga ogni 4 · No» — etichetta e valore si contraddicono (dice «ogni 4» poi «No») — «Pausa lunga dopo 4 pomodori» con interruttore + durata.
- [media] imp-timer__pc-light.png — sezioni «Avvio», «Avvio rapido», «Sessione», «Pomodoro» — tre tipi di timer non spiegati; «Avvio rapido: Durata 5 min / Poi continua per 25 min» non si capisce — una riga descrittiva sotto ogni titolo («Inizi con 5 minuti; se vuoi continui per altri 25»).
- [bassa] imp-timer__pc-light.png — finestra — più bassa di quella delle Impostazioni (bordo superiore a y 75 invece di 48): passando da una pagina all'altra la finestra salta — altezza fissa per tutte le sottopagine.
- [bassa] imp-timer__pc-light.png — righe — etichette regolari 15 px qui, grassetto 14 px con icona nell'elenco Impostazioni; «Chiedi sempre» maiuscola qui, minuscola nell'elenco — uniformare.
- [bassa] imp-timer__pc-light.png — link «‹ Impostazioni» sopra il titolo in 12 px viola — area cliccabile piccola — pulsante indietro 32 px a sinistra del titolo.

## imp-musica__pc-light.png
- [media] imp-musica__pc-light.png — campi «Incolla il link» — fondo grigio chiaro su card grigio chiaro, senza bordo: i campi sono quasi invisibili (contrasto bordo < 1.3:1) — campi bianchi con bordo 1 px come gli altri input dell'app.
- [media] imp-musica__pc-light.png — «Incolla il link» — non dice di cosa (Spotify? YouTube? playlist?) né c'è una spiegazione della pagina — sottotitolo «Link a una playlist Spotify, YouTube o Apple Music da aprire col timer» e segnaposto «https://open.spotify.com/…».
- [media] imp-musica__pc-light.png — interruttore «Apri all'avvio del timer» spento — pomello bianco su binario grigio chiarissimo: si vede appena — binario spento più scuro (grigio 40%).
- [bassa] imp-musica__pc-light.png — righe per area — etichetta a 13 px dal bordo superiore della card, campo a filo del divisore sotto: padding sopra/sotto diversi; 8 aree × 2 righe obbligano a scorrere — ridurre: un solo elenco «Area → link» su una riga per area (etichetta a sinistra, campo a destra) su computer.
- [bassa] imp-musica__pc-light.png — «Predefinita» — aggettivo senza nome — «Musica predefinita».

## imp-aspetto__pc-light.png
- [media] imp-aspetto__pc-light.png — finestra — qui è centrata verticalmente e alta 340 px, le sottopagine Timer/Musica partono da y 48–75: la finestra cambia posizione e altezza a ogni pagina — posizione in alto fissa e altezza costante.
- [media] imp-aspetto__pc-light.png — «Suoni», «Vibrazione» sotto «Aspetto» — non sono aspetto; la «Vibrazione» su computer non esiste — rinominare la pagina «Aspetto e feedback» o spostare Suoni; nascondere Vibrazione su desktop.
- [bassa] imp-aspetto__pc-light.png — interruttori verdi — l'accento dell'app è viola; verde usato altrove per «fatto» — interruttori nel colore d'accento.
- [bassa] imp-aspetto__pc-light.png — «Tema» etichetta dentro la card, mentre in Timer le etichette di sezione sono fuori dalla card — uniformare.
- [bassa] imp-aspetto__pc-light.png — elenco Impostazioni dice «automatico», qui «Auto» — stessa parola.

## aree__pc-light.png
- [media] aree__pc-light.png — testo e icone dell'intera finestra — sfocati/morbidi rispetto al resto della pagina (sembra catturata a metà animazione di scala, o con transform non intero) — verificare che l'animazione d'apertura termini con scale(1) e senza traslazioni a mezzo pixel.
- [media] aree__pc-light.png — interruttori verdi accanto a ogni area — non è detto cosa fanno (attiva/nascosta? usata nella review?) — sottotitolo «Le aree spente non compaiono in…» o etichetta «Attiva».
- [media] aree__pc-light.png — cestino a 30 px dall'interruttore — azione distruttiva vicinissima a un controllo usato spesso, senza conferma visibile — spostare Elimina dentro la modifica dell'area o mostrarlo su hover con conferma.
- [media] aree__pc-light.png — nessun modo di rinominare, cambiare colore/icona o riordinare le aree — clic sulla riga apre la modifica; maniglia di trascinamento.
- [bassa] aree__pc-light.png — «Nuova area» — icona libro predefinita grigia non modificabile in apparenza; «Nome» sembra un'etichetta e non un campo — campo con bordo e selettore icona/colore.
- [bassa] aree__pc-light.png — titolo «Le tue aree», nel Profilo «Aree» e nessun «‹ indietro» come nelle sottopagine Impostazioni — uniformare titolo e navigazione.

## sonno-pasti__pc-light.png
- [alta] sonno-pasti__pc-light.png — tutti gli orari («11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «08:00 PM», «05:00 AM – 02:00 PM») — formato 12 ore; dietro, nel Profilo, la stessa riga dice «23:30–07:30» — 24 h ovunque (input time con locale it o selettore personalizzato).
- [media] sonno-pasti__pc-light.png — «Promemoria nell'app · Sonno · Tra le 05:00 AM – 02:00 PM» — non si capisce cosa sia questa finestra (quando chiedere com'è andato il sonno?) e «Tra le … – …» mescola preposizione e trattino — «Chiedimi del sonno tra le 05:00 e le 14:00».
- [bassa] sonno-pasti__pc-light.png — righe pasti — tre controlli (ora, durata, ×) stretti a destra, la × senza conferma, e la durata viola mentre l'ora è nera — stesso colore valori; conferma o annulla per l'eliminazione.
- [bassa] sonno-pasti__pc-light.png — «Durata 8h» in grigio come riga disabilitata — va bene calcolata, ma «8 h» con spazio come altrove («1 h 30»).
- [bassa] sonno-pasti__pc-light.png — finestra senza «‹ indietro» (aperta dal Profilo) mentre le sottopagine delle Impostazioni lo hanno — coerenza.

## promemoria__pc-light.png
- [alta] promemoria__pc-light.png — orari «08:30 AM», «01:00 PM», «04:30 PM», «09:30 PM», «11:00 PM – 07:00 AM» — formato 12 ore — 24 h.
- [media] promemoria__pc-light.png — interruttori tutti accesi (verdi) mentre il riquadro in alto dice che le notifiche sono bloccate — l'interfaccia promette notifiche che non arriveranno — mostrare gli interruttori attenuati/disabilitati finché il permesso è negato, con pulsante «Come riattivarle».
- [media] promemoria__pc-light.png — nomi promemoria — «Piano del mattino» (il rituale si chiama «Piano del giorno»), «Chiusura della giornata» (il rituale è «Review della sera»), «Priorità del giorno» (non corrisponde a nulla) — usare gli stessi nomi dei rituali.
- [bassa] promemoria__pc-light.png — titolo «Bloccati» — riferito a «notifiche» (femminile) — «Notifiche bloccate»; testo «alla voce di questo indirizzo» poco chiaro — «clicca il lucchetto accanto all'indirizzo › Notifiche › Consenti».
- [bassa] promemoria__pc-light.png — «Tra le» rientrato di 16 px rispetto alle altre etichette e grigio — allineare o usare «Dalle … alle …».

## diario__pc-light.png
- [media] diario__pc-light.png — barra laterale — evidenziata «Andamento» mentre la pagina è aperta dal Profilo (link «‹ Profilo» in alto): la navigazione indica il posto sbagliato — evidenziare «Profilo e impostazioni» o spostare davvero il Diario in Andamento.
- [media] diario__pc-light.png — nome «Diario» — è un registro delle azioni con «Annulla», non un diario personale — «Cronologia» / «Attività recenti».
- [media] diario__pc-light.png — pulsante «↺ Annulla» ripetuto su ogni riga (15+ volte) — rumore visivo, rischio di clic accidentali — mostrarlo solo su hover della riga o in un menu «…».
- [media] diario__pc-light.png — ordine colonne — testo, poi «Annulla», poi l'ora in fondo a destra: l'ora (chiave di lettura di un registro) è l'ultima cosa e lontana dal testo — ora a sinistra accanto all'icona, azione a destra.
- [media] diario__pc-light.png — select nativi «Relazioni & Sociale ⌄», «Associazioni ⌄» dentro le righe, preceduti da «Priorità» — controllo modificabile dentro un registro, con etichetta che non c'entra (è un'area, non una priorità) — mostrare l'area come pillola statica; modificare dalla scheda.
- [bassa] diario__pc-light.png — «Organizzare cena con il gruppo» completata oggi alle 10:00 e anche ieri alle 13:00 — dati demo incoerenti o doppio completamento non gestito — verificare.
- [bassa] diario__pc-light.png — «Review della sera · andata bene: … · ostacolo: …» — testo grigio su due righe compresso con punti mediani — mostrare le risposte come mini-citazioni su righe separate.
- [bassa] diario__pc-light.png — layout — colonna dei testi termina a x 900, poi 230 px con Annulla e ora: spazio a destra mal usato; il titolo pagina «Diario» ha uno stile (titolo grande + link indietro) che nessun'altra pagina usa — uniformare intestazioni di pagina.

## timer-scelta__pc-light.png
- [media] timer-scelta__pc-light.png — valori a destra «5 min», «25 min», «25 + 5 min», «nessun limite» — attaccati al bordo destro della card (~4 px di margine contro 12 px a sinistra) — padding destro uguale al sinistro (12–16 px), eventualmente chevron.
- [media] timer-scelta__pc-light.png — finestra — non dice per quale attività parte il timer (Ripasso flashcard) — sottotitolo «per Ripasso flashcard».
- [bassa] timer-scelta__pc-light.png — opzioni senza descrizione: «Avvio rapido» vs «Sessione» non si distinguono se non per i minuti — una riga breve sotto ciascuna («Inizia con 5 minuti, poi decidi»).
- [bassa] timer-scelta__pc-light.png — manca «Ricorda la scelta» (l'impostazione «Timer predefinito: chiedi sempre» è nascosta nelle Impostazioni) — casella in fondo alla finestra.
- [bassa] timer-scelta__pc-light.png — icone nei quadratini con bordo — sembrano caselle di spunta — icona senza riquadro.

## timer-concentrazione__pc-light.png
- [media] timer-concentrazione__pc-light.png — «⏸ Termina» — icona pausa con etichetta «Termina»: non si sa se mette in pausa o chiude la sessione; manca un vero pulsante Pausa/Riprendi — due azioni separate: «Pausa» (icona ⏸) e «Termina sessione» (icona ■).
- [media] timer-concentrazione__pc-light.png — pulsante primario verde «✓ Fatto» — durante la concentrazione l'azione più grande è chiudere l'attività, non gestire il timer; un clic accidentale la completa — rendere «Fatto» secondario, primario = Pausa.
- [bassa] timer-concentrazione__pc-light.png — schermo nero pieno in tema chiaro — passaggio brusco; accettabile per la concentrazione ma va dichiarato (impostazione «Schermo scuro durante il timer»).
- [bassa] timer-concentrazione__pc-light.png — anello di avanzamento a forma di quadrato arrotondato, grigio scuro su nero (contrasto ~1.3:1) — a 25:00 non si vede alcuna traccia; anello circolare con traccia più chiara.
- [bassa] timer-concentrazione__pc-light.png — «Cambia timer» con la stessa icona ↻ di «Pomodoro» e di «abitudine» — icona dedicata (⇄).
- [bassa] timer-concentrazione__pc-light.png — «Pomodoro · blocco 1» — «blocco» non usato altrove — «Pomodoro 1 di 4».

## cattura__pc-light.png
- [alta] cattura__pc-light.png — popup — c'è solo «Chiudi»: nessun pulsante «Salva» né indicazione «Invio per salvare»; l'utente non sa se il testo verrà salvato o perso chiudendo — pulsante «Salva» primario (disattivo finché vuoto) + suggerimento «↵ salva · Esc chiudi».
- [media] cattura__pc-light.png — nomi — il pulsante nella barra laterale dice «Aggiungi una nota», il popup «Scrivi un pensiero», la destinazione è «Da sistemare»: tre nomi per la stessa cosa — un solo termine (es. «Nota veloce») e riga «Finirà in Da sistemare».
- [bassa] cattura__pc-light.png — linea divisoria — rientrata di 4 px dai bordi (x 325–955) invece di andare da bordo a bordo o allinearsi al padding del testo (x 340) — allinearla al padding.
- [bassa] cattura__pc-light.png — «Chiudi» link 12 px in basso a destra in una fascia di 48 px quasi vuota — fascia ridotta o azioni a dimensione pulsante.

## menu-oggi-avatar__pc-light.png
- [media] menu-oggi-avatar__pc-light.png — clic sull'avatar «R» in Oggi — porta alla pagina Profilo identica a «Profilo e impostazioni» della barra laterale, e in Profilo nessuna voce laterale è evidenziata: l'utente salta di sezione senza capire dove si trova — su computer l'avatar dovrebbe aprire un piccolo menu (Profilo, Impostazioni, Tema) o sparire; evidenziare la voce attiva.
- [bassa] menu-oggi-avatar__pc-light.png — l'avatar nel Profilo è un quadrato arrotondato 64 px viola, in alto a destra nelle altre pagine 44 px: ok, ma manca qualsiasi personalizzazione (foto/iniziali/colore) — aggiungere modifica.
- [bassa] menu-oggi-avatar__pc-light.png — stessi difetti di profilo__pc-light.png.

## trascinamento-in-corso__pc-light.png
- [alta] trascinamento-in-corso__pc-light.png — barra laterale — durante il trascinamento (pagina scorsa di ~53 px) la barra laterale si accorcia: il suo fondo finisce a y 741 lasciando una fascia grigia sotto, e «Profilo e impostazioni» sale a y 704 — barra laterale `position: sticky/fixed; height: 100vh` indipendente dallo scorrimento della pagina.
- [alta] trascinamento-in-corso__pc-light.png — zona di rilascio «Togli l'orario» — riquadro tratteggiato in basso a destra che copre il bordo del calendario ed esce dalla colonna di contenuto (fino a x 1255, oltre il margine di 1241) — posizionarla dentro l'area contenuto (es. fascia in fondo a tutta larghezza o colonna laterale) senza coprire la griglia.
- [media] trascinamento-in-corso__pc-light.png — fantasma trascinato e anteprima — il fantasma viola («alle 12:45») sta a 11:30–12:00, l'anteprima 12:45–14:15 un'ora più in basso: occhio diviso fra due oggetti — il fantasma deve coincidere con l'anteprima (o sparire, lasciando solo l'anteprima).
- [media] trascinamento-in-corso__pc-light.png — anteprima sopra «Pranzo» — si sovrappone al pasto senza alcun avviso di conflitto e copre l'etichetta — affiancare i blocchi sovrapposti (colonne) e segnalare la sovrapposizione.
- [bassa] trascinamento-in-corso__pc-light.png — colore — fantasma e anteprima viola, mentre il blocco è rosa (colore area): perde l'identità — usare il colore dell'area.
- [bassa] trascinamento-in-corso__pc-light.png — trascinare un blocco già completato è permesso — valutare se ha senso spostare cose fatte.

## oggi-adesso__pc-dark.png
- [media] oggi-adesso__pc-dark.png — barra laterale — «Oggi» selezionato ha un fondo viola scurissimo (#1f1d2e circa) quasi identico al grigio delle voci non selezionate: in scuro la voce attiva si riconosce solo dal colore del testo — fondo selezionato più luminoso o barra d'accento a sinistra; togliere il fondo alle voci inattive.
- [media] oggi-adesso__pc-dark.png — card «Ripasso flashcard» — fondo blu notte (tinta dell'area Studio) diverso da tutte le altre card grigio neutro: in scuro sembra un'altra superficie/elemento di sistema — tinta area molto più leggera (bordo sinistro o 4–6% di colore).
- [bassa] oggi-adesso__pc-dark.png — casella di «Confrontare piani telefonici» — bordo grigio su grigio quasi invisibile (contrasto ~1.6:1) — bordo almeno 3:1 (WCAG non-text contrast).
- [bassa] oggi-adesso__pc-dark.png — avatar «R» lilla con lettera nera, in chiaro viola con lettera bianca — inversione non necessaria; il quadrato lilla brillante è l'elemento più luminoso dello schermo e attira l'occhio — tono più scuro con lettera chiara.
- [bassa] oggi-adesso__pc-dark.png — stessi difetti di layout del tema chiaro (colonna stretta, card hero più larga, doppio accesso al profilo).

## giornata-giorno__pc-dark.png
- [media] giornata-giorno__pc-dark.png — scheda attiva «La giornata» — fondo grigio scuro quasi uguale alla barra (differenza di luminosità minima): in scuro non si capisce quale scheda è attiva; lo stesso per «Giorno» (lilla scurissimo) — schede attive più chiare (+8–10% luminosità) o sottolineatura d'accento.
- [media] giornata-giorno__pc-dark.png — blocco completato «Organizzare cena» — testo barrato grigio scuro su grigio (contrasto ~2:1) e striscia bordeaux spenta — testo almeno 4.5:1 anche se completato.
- [bassa] giornata-giorno__pc-dark.png — casella del blocco «Confrontare piani telefonici» — quadrato nero pieno su marrone, sembra un foro, non una casella — bordo chiaro e fondo trasparente.
- [bassa] giornata-giorno__pc-dark.png — blocco giallo/marrone — testo bianco su #3d2f14: ok, ma la striscia sinistra ocra e il fondo marrone sembrano «sporchi» rispetto al rosa/verde degli altri blocchi — ricalibrare le tinte area in scuro con la stessa luminosità.
- [bassa] giornata-giorno__pc-dark.png — righe orarie e tratteggio sonno — quasi invisibili (grigio su grigio) — righe a 10–12% di bianco.

## giornata-settimana__pc-dark.png
- [media] giornata-settimana__pc-dark.png — intestazioni dei giorni «17 ago+4», «18 ago+1» — numero «+4/+1» attaccato alla data senza spazio né spiegazione (attività in più? XP?) — «17 ago · 4 attività» o un badge separato con tooltip.
- [media] giornata-settimana__pc-dark.png — intestazione «‹ 17 Ago – 23 Ago ›» — mesi con maiuscola (in italiano minuscolo) e, sotto, «17 ago» minuscolo; inoltre qui frecce quadrate piccole e titolo a sinistra, nel Giorno frecce tonde e titolo centrato — «17–23 agosto» e stessa intestazione per tutte le viste.
- [bassa] giornata-settimana__pc-dark.png — blocchi pasti — rettangoli grigi appena più chiari dello sfondo, icone grigie: quasi invisibili in scuro — vedi chiaro: renderli fascia di sfondo o nasconderli.
- [bassa] giornata-settimana__pc-dark.png — «Camminata /…» del lunedì completata — bordo grigio, testo barrato grigio scuro: illeggibile — contrasto minimo 4.5:1.
- [bassa] giornata-settimana__pc-dark.png — nota: qui (tema scuro) l'intestazione si vede, nel chiaro la vista era aperta già scorsa — conferma che lo scorrimento non viene azzerato in modo coerente.

## giornata-mese__pc-dark.png
- [media] giornata-mese__pc-dark.png — «18 giorni attivi» — nella vista Anno la card Agosto dice «17»: stesso dato, due numeri — usare lo stesso calcolo (con o senza oggi) in entrambe.
- [media] giornata-mese__pc-dark.png — giorni futuri 19–31 — numeri in bianco pieno, più luminosi dei giorni passati con anello: gerarchia invertita (il futuro vuoto è l'elemento più visibile) — futuri in grigio medio.
- [bassa] giornata-mese__pc-dark.png — «58 cose fatte» — «cose» generico; altrove «azioni completate», «fatte», «attività» — un unico termine.
- [bassa] giornata-mese__pc-dark.png — puntini colorati sotto i giorni (rosso, verde, blu scuro) — in scuro i colori scuri (blu, bordeaux su 27–30) si vedono appena — tinte più luminose o legenda.
- [bassa] giornata-mese__pc-dark.png — oggi 18 — cerchio lilla con numero scuro + anello verde + riquadro grigio: tre segnali sovrapposti — semplificare.
- [bassa] giornata-mese__pc-dark.png — intestazione «Agosto 2026» con frecce quadrate a sinistra e a destra lontane 900 px — come nelle altre viste, raggruppare.

## giornata-anno__pc-dark.png
- [media] giornata-anno__pc-dark.png — riepilogo «49 giorni attivi · 82 fatte · 1874 XP» — «82 fatte» contro «109 fatte» nel Profilo e «81 di 124» in Andamento: tre numeri per «fatte» senza indicare il periodo — etichette con periodo («nel 2026», «in totale», «ultimi 30 giorni»).
- [media] giornata-anno__pc-dark.png — componente statistiche — qui card con 3 colonne e divisori, nel Mese testo in linea «18 giorni attivi 58 cose fatte», nella Review settimanale numeri serif: tre componenti per la stessa funzione — un unico componente «stat».
- [bassa] giornata-anno__pc-dark.png — «1874» — manca il separatore delle migliaia italiano — «1.874».
- [bassa] giornata-anno__pc-dark.png — celle vuote passate e future — stesso grigio (#2a2a2a) anche in scuro; in agosto le future sono appena più scure — differenziarle chiaramente.
- [bassa] giornata-anno__pc-dark.png — numeri verdi 7/25/17 in alto a destra — verde scuro 11 px su grigio: contrasto basso e senza etichetta.

## giornata-sonno-aperto__pc-dark.png
- [alta] giornata-sonno-aperto__pc-dark.png — select durata dei pasti — testo tagliato «15 mi⌄», «45 mi⌄»: il select nativo è troppo stretto per il valore — allargare (min 84 px) o usare il componente pillola dell'app.
- [alta] giornata-sonno-aperto__pc-dark.png — campi «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM», «08:00 PM» — formato 12 ore, mentre la riga sopra dice «23:30 → 07:30» — 24 h.
- [media] giornata-sonno-aperto__pc-dark.png — campi «A letto» e «Sveglia» larghi 390 px ciascuno per 5 caratteri, mentre gli orari dei pasti sono 95 px allineati a destra: due misure per lo stesso tipo di campo nello stesso pannello — campi ora di larghezza fissa (~100 px) allineati in colonna.
- [media] giornata-sonno-aperto__pc-dark.png — terza interfaccia diversa per gli stessi dati (qui input nativi + cestini; nel Profilo pillole + ×; nel rituale sì/no/orologio) — un solo componente «sonno e pasti» riusato.
- [media] giornata-sonno-aperto__pc-dark.png — «Ripristina» e «Ritmo di base» — link affiancati senza spiegazione: non si capisce la differenza né cosa ripristinano — «Torna agli orari abituali» e «Modifica orari abituali…».
- [bassa] giornata-sonno-aperto__pc-dark.png — controlli nativi in scuro (input con bordo grigio, frecce select di sistema) — stile diverso dal resto dell'interfaccia.

## giornata-scheda-blocco__pc-dark.png
- [media] giornata-scheda-blocco__pc-dark.png — finestra in scuro — superficie quasi dello stesso grigio della pagina e velo di sfondo debolissimo: la finestra si stacca solo per un bordo sottile, la pagina dietro resta leggibilissima e distrae — velo più scuro (60–70% nero) e superficie della finestra più chiara (elevazione) in scuro.
- [media] giornata-scheda-blocco__pc-dark.png — «09:30 AM» — formato 12 ore (come nel chiaro).
- [bassa] giornata-scheda-blocco__pc-dark.png — pulsanti × grigi dentro le pillole — grigio chiaro su grigio medio, icona nera piccola: si leggono male — × più grande con contrasto 3:1.
- [bassa] giornata-scheda-blocco__pc-dark.png — stessi difetti di struttura del chiaro (titolo che va a capo, «Togli la spunta» centrato, valori con stili diversi).

## giornata-scheda-abitudine__pc-dark.png
- [media] giornata-scheda-abitudine__pc-dark.png — «06:00 PM» — formato 12 ore.
- [bassa] giornata-scheda-abitudine__pc-dark.png — pulsante «✓ Fatta» lilla chiaro con testo scuro: è il blocco più luminoso dello schermo e in scuro abbaglia; in chiaro era viola con testo bianco, in Adesso verde — uniformare (verde scuro con testo bianco per «fatto», in entrambi i temi).
- [bassa] giornata-scheda-abitudine__pc-dark.png — velo dello sfondo debole come nella scheda attività — oscurare di più.
- [bassa] giornata-scheda-abitudine__pc-dark.png — «Finisce qui», «Togli solo da oggi» — testi come nel chiaro, da riscrivere.

## rituali__pc-dark.png
- [media] rituali__pc-dark.png — scheda attiva «Rituali» — in scuro è PIÙ SCURA della barra (#151515 su #222): logica invertita rispetto al chiaro (attiva = più chiara) e poco visibile — scheda attiva più chiara della barra o con bordo/testo d'accento.
- [bassa] rituali__pc-dark.png — icone dei rituali — riquadri viola scurissimo con icona lilla tenue: in scuro si vedono appena, tranne «Piano del giorno» lilla brillante — riequilibrare (fondo 15% accento).
- [bassa] rituali__pc-dark.png — testi di stato «da fare»/«2 di 3 scelte» grigio 11 px su grigio scuro: al limite della leggibilità — 12–13 px, contrasto 4.5:1.
- [bassa] rituali__pc-dark.png — layout e testi come nel chiaro (elenco a tutta larghezza, inglese «Review», «Check-in»).

## rituale-piano__pc-dark.png
- [media] rituale-piano__pc-dark.png — pulsante «Salva +5 XP» — barra lilla chiaro 924×52 px: in scuro è una lastra luminosissima che domina la pagina — pulsante compatto e tono d'accento meno luminoso in scuro.
- [bassa] rituale-piano__pc-dark.png — riga barrata «Organizzare cena…» — grigio scuro su grigio (contrasto ~2:1) — alzare il contrasto.
- [bassa] rituale-piano__pc-dark.png — campi grigi senza bordo su card grigia — in scuro i campi si distinguono appena (Δ luminosità minima) — bordo 1 px o fondo più scuro.
- [bassa] rituale-piano__pc-dark.png — chip «★ Priorità» viola scuro con testo lilla — ok, ma resta acceso su riga completata — come nel chiaro.

## rituale-sonno-pasti__pc-dark.png
- [media] rituale-sonno-pasti__pc-dark.png — pulsanti «sì / no / ⏰» — grigio scurissimo su card grigio scuro: quasi invisibili come pulsanti (Δ luminosità ~4%) — bordo o fondo più chiaro, stato selezionato colorato.
- [media] rituale-sonno-pasti__pc-dark.png — pulsante «Salva» (viola scuro, testo lilla) vs «Fatto» (lilla chiaro, testo nero) — due pesi diversi per due conferme: confusione accentuata in scuro — un solo pulsante di conferma.
- [alta] rituale-sonno-pasti__pc-dark.png — «11:30 PM / 07:30 AM» accanto a «23:30–07:30» — formato 12 ore.
- [bassa] rituale-sonno-pasti__pc-dark.png — campo «Una cosa che hai fatto…» — grigio su grigio senza bordo, poco riconoscibile.

## rituale-checkin__pc-dark.png
- [media] rituale-checkin__pc-dark.png — pulsanti 1–5 — fondo nero, bordo grigio scuro: nessun valore selezionato pur essendo «fatto» (come nel chiaro), e in scuro lo stato selezionato, se ci fosse, va reso molto evidente — evidenziare il valore registrato.
- [media] rituale-checkin__pc-dark.png — «Registra +3 XP» viola scurissimo con bordo — sembra disabilitato, mentre in «Piano del giorno» il primario è lilla brillante — stesso stile primario.
- [bassa] rituale-checkin__pc-dark.png — legenda «1 · esausto / 3 · normale / 5 · pieno» grigio 11 px su nero — contrasto basso; «4.3» con punto decimale.
- [bassa] rituale-checkin__pc-dark.png — titolo «Andamento degli ultimi 14 giorni» tagliato in fondo — come nel chiaro.

## rituale-sera__pc-dark.png
- [bassa] rituale-sera__pc-dark.png — quadratini 1–5 — grigio scuro su grigio scuro con numeri grigi: bassa visibilità come controlli — fondo più chiaro o bordo.
- [bassa] rituale-sera__pc-dark.png — icone area colorate (verde scuro di Salute, blu di Studio) poco visibili su fondo scuro — tinte area più luminose in tema scuro.
- [media] rituale-sera__pc-dark.png — stessi difetti del chiaro: nessuna domanda/legenda per la scala, componente scala diverso dal Check-in, inglese «Review»/«Founder».

## rituale-settimana__pc-dark.png
- [bassa] rituale-settimana__pc-dark.png — aree di testo grigio scuro su card grigio scuro senza bordo — si distinguono appena (Δ ~3%) — bordo 1 px o fondo più scuro della card.
- [media] rituale-settimana__pc-dark.png — stessi difetti del chiaro: numeri in serif, riga statistiche centrata, domande senza «?», 4 aree di testo a tutta larghezza.

## attivita-sistemare__pc-dark.png
- [bassa] attivita-sistemare__pc-dark.png — scheda attiva «Da sistemare» più scura della barra (stessa inversione vista in Rituali scuro) — schiarirla.
- [bassa] attivita-sistemare__pc-dark.png — select nativo «Altro / Esplorazione» con freccia di sistema in scuro — ancora più fuori stile — componente personalizzato.
- [bassa] attivita-sistemare__pc-dark.png — «Oggi» lilla chiaro con testo nero accanto a due pulsanti neri: forte contrasto di peso, ok per la gerarchia ma in scuro è abbagliante — tono d'accento meno luminoso.
- [media] attivita-sistemare__pc-dark.png — stessi difetti di layout/testi del chiaro (colonna a sinistra, «e un'altra», titolo ripetuto).

## attivita-dafare__pc-dark.png
- [bassa] attivita-dafare__pc-dark.png — icone area verde scuro (Salute) e blu (Studio) da 12 px su grigio scuro — poco visibili — tinte più luminose in scuro.
- [bassa] attivita-dafare__pc-dark.png — «Aggiungi» viola scuro dentro il campo, poco distinguibile come pulsante — più contrasto.
- [alta] attivita-dafare__pc-dark.png — stessi difetti del chiaro: icona ◎ al posto della casella di completamento, «1 di 3» senza etichetta, larghezza diversa da «Da sistemare».

## attivita-dafare-aggiunta__pc-dark.png
- [bassa] attivita-dafare-aggiunta__pc-dark.png — select nativo «Altro / Esplorazione» con freccia di sistema bianca e altezza 42 px accanto a chip da 34 px — come nel chiaro, più evidente in scuro.
- [bassa] attivita-dafare-aggiunta__pc-dark.png — chip «Senza data» lilla chiaro con testo nero: in scuro compete con il pulsante «Aggiungi» (viola scuro) — lo stato selezionato è più forte del pulsante d'azione: invertire la gerarchia.
- [media] attivita-dafare-aggiunta__pc-dark.png — stessi difetti del chiaro (riga opzioni rientrata, nessuna etichetta Quando/Area).

## attivita-abitudini__pc-dark.png
- [media] attivita-abitudini__pc-dark.png — cerchi di completamento verde scuro e blu scuro su fondo scuro — bordo a basso contrasto (~2.5:1), sembrano disattivati — tinte più luminose o spessore maggiore.
- [bassa] attivita-abitudini__pc-dark.png — anello «0 di 3» grigio scuro su nero — si legge come un buco — traccia più chiara.
- [bassa] attivita-abitudini__pc-dark.png — scheda attiva «Abitudini» più scura della barra — inversione già segnalata.
- [media] attivita-abitudini__pc-dark.png — stessi difetti del chiaro (campo nuova abitudine in fondo, manca la frequenza, tre controlli diversi per «fatto»).

## attivita-abitudini-nuova__pc-dark.png
- [alta] attivita-abitudini-nuova__pc-dark.png — «Ogni giorno» con 7 cerchi vuoti — contraddizione come nel chiaro; in scuro i cerchi grigi su nero sono ancora meno leggibili.
- [media] attivita-abitudini-nuova__pc-dark.png — «Ora: Nessuno» — errore di genere («Nessuna»).
- [bassa] attivita-abitudini-nuova__pc-dark.png — pillola «Nessuno» grigio scuro con testo grigio: sembra disabilitata, non cliccabile — stile valore modificabile coerente.
- [bassa] attivita-abitudini-nuova__pc-dark.png — salto dello scorrimento di ~14 px all'apertura (barra schede a y 37) — come nel chiaro.

## scheda-attivita__pc-dark.png
- [alta] scheda-attivita__pc-dark.png — «Pianifica: Ieri» — come nel chiaro, opzione nel passato.
- [bassa] scheda-attivita__pc-dark.png — chip «ogni giorno / ogni 2 giorni / ogni settimana» quasi neri su grigio e caselle dei passi nere con bordo grigio scuro — bassa visibilità — bordi 3:1.
- [bassa] scheda-attivita__pc-dark.png — finestra con bordo sottile su pagina scura poco velata — elevazione debole (vedi schede del calendario).
- [bassa] scheda-attivita__pc-dark.png — passo completato barrato grigio scuro — contrasto ~2:1.

## scheda-abitudine__pc-dark.png
- [alta] scheda-abitudine__pc-dark.png — «06:00 PM» — formato 12 ore.
- [bassa] scheda-abitudine__pc-dark.png — chip «Salute & Sport» verde scurissimo con testo chiaro — leggibile ma l'icona verde scuro sparisce; giorni fuori mese (27–31, 1–2) e mancati (3–5, 12) con lo stesso cerchio grigio scuro — differenziarli.
- [bassa] scheda-abitudine__pc-dark.png — cerchi «S», «D» non selezionati quasi neri — poco visibili.

## andamento__pc-dark.png
- [alta] andamento__pc-dark.png — «Per area» — nomi troncati senza ellissi («Relazioni & Soci», «Progetti Found») e barre disallineate, come nel chiaro.
- [media] andamento__pc-dark.png — mappa «Costanza» — in scuro la scala è invertita (più chiaro = più attività) ma le celle vuote grigio scuro e i primi livelli blu scuro si confondono — verificare che i 5 livelli siano distinguibili; usare la stessa tinta (verde) della vista Anno.
- [bassa] andamento__pc-dark.png — barra «Salute & Sport» verde scuro (#0a7d0a) su traccia grigio scuro: contrasto basso rispetto alle altre barre più luminose — tinta area schiarita in scuro.
- [bassa] andamento__pc-dark.png — giorno «V» vuoto — quadrato grigio scuro quasi invisibile — contorno tratteggiato per «saltato».

## scoperte__pc-dark.png
- [bassa] scoperte__pc-dark.png — sottotitoli grigio scuro 12 px («lo noto ogni volta») su grigio — contrasto al limite (~3.5:1) — schiarire.
- [bassa] scoperte__pc-dark.png — riquadri 👍/👎 con bordo su fondo scuro — sembrano ancora di più pulsanti/caselle — togliere il riquadro.
- [media] scoperte__pc-dark.png — stessi difetti di testo del chiaro (livelli di certezza incoerenti, «Registro»).

## scoperte-esperimenti__pc-dark.png
- [bassa] scoperte-esperimenti__pc-dark.png — punti grigi della fase «Prima» su fondo scuro e linee guida dell'asse quasi invisibili — punti grigio chiaro, griglia al 10% di bianco.
- [bassa] scoperte-esperimenti__pc-dark.png — etichette «media 3,1/4,3» sovrapposte ai punti, chip con bordo che sembrano pulsanti, «d≈3,1» — come nel chiaro.

## scheda-scoperta__pc-dark.png
- [alta] scheda-scoperta__pc-dark.png — «Esito: 👍 funziona» (opzione selezionata) — testo e icona blu scurissimo su grigio scuro: invisibile (contrasto ~1.3:1); conferma il bug visto nel chiaro (lì bianco su bianco) — lo stato selezionato usa un colore di testo sbagliato: fondo accento + testo a contrasto.
- [media] scheda-scoperta__pc-dark.png — divisori fra le righe «Esito / Area / Scritta» e fra «Provalo… / Togli questa riga» — nel chiaro ci sono, qui spariscono: le righe si fondono — token del divisore anche per il tema scuro.
- [bassa] scheda-scoperta__pc-dark.png — stessi testi da correggere: «Evidenza», «Togli questa riga», «Scritta».

## profilo__pc-dark.png
- [bassa] profilo__pc-dark.png — card — le due card in alto (profilo, statistiche) non hanno bordo, le due liste sotto sì: in scuro la differenza si nota — stesso trattamento (bordo 1 px su tutte o su nessuna).
- [media] profilo__pc-dark.png — stessi difetti del chiaro: nessuna voce laterale attiva, «bloccati», numeri incoerenti con Andamento, «riuscita».

## impostazioni__pc-dark.png
- [bassa] impostazioni__pc-dark.png — divisori fra le righe dei gruppi — quasi invisibili in scuro (nel chiaro si vedono) — token divisore più chiaro.
- [bassa] impostazioni__pc-dark.png — velo dietro la finestra debole: il Profilo dietro resta leggibile — oscurare di più.
- [media] impostazioni__pc-dark.png — stessi difetti del chiaro (finestra stretta da telefono, «Account» vuoto, gruppo senza titolo, «1» senza significato).

## imp-timer__pc-dark.png
- [media] imp-timer__pc-dark.png — stessi difetti del chiaro («Pausa lunga ogni 4 · No», sezioni senza spiegazione, finestra che cambia posizione rispetto alle Impostazioni). In scuro nessun difetto di contrasto aggiuntivo rilevante.

## imp-musica__pc-dark.png
- [media] imp-musica__pc-dark.png — campi «Incolla il link» — grigio scuro su grigio scuro senza bordo, con una leggera ombra in basso che li fa sembrare pulsanti: quasi invisibili come campi — bordo 1 px chiaro.
- [bassa] imp-musica__pc-dark.png — interruttore spento: pomello bianco su binario grigio scuro — ok in scuro, ma diverso dal chiaro dove è invisibile; uniformare i token.
- [media] imp-musica__pc-dark.png — stessi difetti di contenuto del chiaro (cosa incollare non è spiegato, padding sopra/sotto diversi, 16 righe da scorrere).

## imp-aspetto__pc-dark.png
- [media] imp-aspetto__pc-dark.png — segmento «Auto / Chiaro / Scuro» — l'opzione selezionata «Auto» ha un fondo PIÙ SCURO del controllo (stessa inversione delle schede): si capisce solo dal testo bianco — selezionato più chiaro o con colore d'accento.
- [bassa] imp-aspetto__pc-dark.png — interruttori verde brillante — l'elemento più saturo della finestra, colore non d'accento — interruttori in viola d'accento.
- [bassa] imp-aspetto__pc-dark.png — stessi difetti del chiaro (Suoni/Vibrazione sotto «Aspetto», finestra che cambia posizione).

## aree__pc-dark.png
- [media] aree__pc-dark.png — testo sfocato — come nel chiaro, la finestra Aree è resa sfocata (scala/transform non intero): difetto sistematico di questa finestra.
- [bassa] aree__pc-dark.png — icone area in riquadri a tinta scurissima (Salute verde su verde scuro, Studio blu su blu scuro) — icone poco leggibili in scuro.
- [media] aree__pc-dark.png — stessi difetti del chiaro (interruttori non spiegati, cestino vicino all'interruttore, niente rinomina/colore/ordine).

## sonno-pasti__pc-dark.png
- [alta] sonno-pasti__pc-dark.png — tutti gli orari in formato 12 ore (11:30 PM, 01:00 PM, 05:00 AM – 02:00 PM…) — come nel chiaro.
- [bassa] sonno-pasti__pc-dark.png — «Colazione» non centrato verticalmente rispetto ai controlli (testo a y 394, pillole centrate a 396 ma la riga ha padding superiore minore) — allineamento verticale al centro.
- [bassa] sonno-pasti__pc-dark.png — × dei pasti grigio piccolo, nessuna conferma — come nel chiaro.

## promemoria__pc-dark.png
- [alta] promemoria__pc-dark.png — orari 12 ore AM/PM — come nel chiaro.
- [media] promemoria__pc-dark.png — avviso «Bloccati» — riquadro grigio neutro con icona grigia, nessun colore d'avviso: in scuro passa inosservato, mentre gli interruttori verdi brillanti sotto dicono il contrario — riquadro con tinta d'avviso (ambra) e interruttori attenuati.
- [bassa] promemoria__pc-dark.png — nomi promemoria diversi dai nomi dei rituali — come nel chiaro.

## diario__pc-dark.png
- [bassa] diario__pc-dark.png — righe «Completata» — la prima e la terza hanno «Priorità [select]», la seconda (ieri 13:00) ha solo l'icona area + select senza etichetta: stessa riga con due composizioni (vale anche per il chiaro) — un unico formato.
- [bassa] diario__pc-dark.png — segmento «Cose importanti / Tutto» — opzione attiva più scura della barra (inversione) — schiarirla.
- [media] diario__pc-dark.png — stessi difetti del chiaro (voce laterale «Andamento» attiva aprendo dal Profilo, «Annulla» ripetuto, ora in coda, select nativi nel registro, nome «Diario»).

## timer-scelta__pc-dark.png
- [media] timer-scelta__pc-dark.png — valori a destra attaccati al bordo della card (4 px) — come nel chiaro.
- [bassa] timer-scelta__pc-dark.png — divisori fra le opzioni invisibili in scuro — token divisore.
- [bassa] timer-scelta__pc-dark.png — velo dietro la finestra debole: la card verde «Fatto» resta ben visibile accanto alla finestra e distrae — oscurare di più.

## timer-concentrazione__pc-dark.png
- [media] timer-concentrazione__pc-dark.png — identico al chiaro: «⏸ Termina» ambiguo, nessun pulsante Pausa, «Fatto» primario durante la sessione, anello quadrato grigio su nero invisibile a 25:00.
- [bassa] timer-concentrazione__pc-dark.png — pulsante × in alto a destra (grigio scuro su nero) poco visibile e lontano da tutto il resto — accettabile in modalità concentrazione, ma dare un tooltip «Esci (Esc)».

## cattura__pc-dark.png
- [alta] cattura__pc-dark.png — solo «Chiudi», nessun «Salva» né suggerimento Invio — come nel chiaro.
- [bassa] cattura__pc-dark.png — finestra grigio scuro su sfondo sfocato quasi dello stesso tono: bordi poco definiti — bordo più chiaro o ombra marcata.
- [bassa] cattura__pc-dark.png — divisore rientrato in modo irregolare (x 325–955) — come nel chiaro.

## menu-oggi-avatar__pc-dark.png
- [media] menu-oggi-avatar__pc-dark.png — come nel chiaro: l'avatar porta al Profilo (doppione della voce laterale) e nessuna voce laterale risulta attiva; card in alto senza bordo e liste con bordo.

## Riassunto

### 1. Bug evidenti (da correggere subito)
- **Orari in formato americano 12 h (AM/PM) e date mese/giorno** in tutti i campi modificabili: schede del calendario, scheda abitudine, Sonno e pasti (Profilo, rituale, pannello della Giornata), Promemoria; «Inizio 07/29/2026». Nella stessa schermata convivono «23:30–07:30» e «11:30 PM». → Formato 24 h e date it-IT ovunque.
- **Stato selezionato invisibile** in «Esito» della scheda Scoperta (bianco su bianco nel chiaro, blu scuro su grigio nello scuro).
- **«Pianifica: Ieri»** nella scheda attività: propone una data passata.
- **«Ogni giorno» con i 7 cerchi dei giorni tutti vuoti** nella creazione di un'abitudine; «Ora: Nessuno» (errore di genere).
- **Select durata tagliato** («15 mi⌄») nel pannello sonno/pasti della Giornata.
- **Barra laterale che si accorcia** durante il trascinamento (fondo a y 741, fascia vuota sotto); la zona «Togli l'orario» esce dalla colonna e copre il calendario; il fantasma trascinato sta un'ora sopra l'anteprima.
- **Viste Settimana/Mese/Anno aperte già scorse** (nel chiaro): non si vedono le intestazioni dei giorni o del mese; il pannello Sonno e pasti aperto finisce fuori dallo schermo.
- **Finestra «Aree» sfocata** (in entrambi i temi), probabilmente un'animazione di scala che non finisce a un valore intero.
- **Check-in «fatto» senza i valori registrati**: il modulo sembra vuoto.
- **Numeri incoerenti**: 65% = «81 di 124» (Andamento) e «109 fatte» (Profilo); l'Anno dice «82 fatte»; agosto ha 17 giorni attivi nell'Anno e 18 nel Mese.

### 2. Layout su schermo largo (pensato per il telefono)
- Ogni pagina ha una larghezza diversa: Adesso è una colonna centrata di 560 px, la Giornata e Da fare vanno a tutta larghezza, Da sistemare è a sinistra in 620 px, il Profilo è centrato in 640 px. Serve una griglia unica.
- Tanto spazio vuoto: metà schermo vuota in Adesso, Rituali e Abitudini; la card «Costanza» è vuota al 60%. Mancano layout a due colonne: lista + dettaglio per Rituali e Attività, «Da pianificare» accanto al calendario, Funziona/Non funziona affiancati.
- Su computer si usano finestre stile telefono (460 px, con scorrimento interno) per le schede, le Impostazioni e le sottopagine. Altezza e posizione cambiano a ogni pagina e il contenuto viene tagliato.
- Pulsanti e controlli enormi a tutta larghezza: «Salva +5 XP» e «Fatto» a 924 px; scala del Check-in con pulsanti 178×50. Nella creazione abitudine i cerchi dei giorni sono distanti 150 px; le frecce della data sono a 900 px l'una dall'altra.
- Nessuna intestazione fissa (sticky) nel calendario e tre livelli di navigazione impilati, ciascuno con uno stile diverso.

### 3. Incoerenze fra componenti
- Ci sono tre modi diversi di segnare come fatto: caselle quadrate, cerchi a destra e il pulsante «Fatto/Fatta», a volte verde, a volte viola, a volte lilla. In «Da fare» l'icona ◎ occupa il posto della casella ma non completa l'attività.
- La scala 1–5 ha due aspetti diversi (Check-in e Review); il selettore dei giorni anche (creazione e scheda abitudine).
- I campi di testo hanno quattro stili: bianco con bordo, grigio pieno, select nativo, input nativo. I valori nelle pillole usano colori a caso (nero, viola, grigio) e la × è a volte dentro, a volte fuori.
- Per confermare si usano verbi diversi: Salva, Registra, Fatto. In Sonno e pasti ci sono due conferme.
- La stessa attività ha due schede diverse (dal calendario e da Attività). «Elimina» ha tre aspetti diversi.
- Le statistiche usano tre componenti diversi, uno con numeri in serif nella Review settimanale.
- Il calendario Anno usa il verde, la mappa «Costanza» il blu.
- In Profilo nessuna voce della barra laterale è evidenziata; nel Diario risulta attiva «Andamento».

### 4. Tema scuro
- Le schede e i segmenti attivi sono più scuri della barra che li contiene (logica opposta al chiaro), quindi quasi invisibili. Anche la voce selezionata nella barra laterale si distingue appena.
- Velo dietro le finestre troppo debole e superfici con poca elevazione. I divisori spariscono (Scoperta, Impostazioni, Timer).
- Basso contrasto su caselle, campi senza bordo, pulsanti sì/no, testi barrati (~2:1), etichette da 11 px, colori area scuri (verde e blu) e cerchi delle abitudini.
- I pulsanti primari lilla chiaro sono lastre abbaglianti (Salva, Fatta). Gli interruttori sono verdi invece del colore d'accento. L'avviso «Bloccati» è neutro mentre gli interruttori sotto sono accesi.

### 5. Testi e UX
- Inglese mescolato all'italiano: «Review», «Check-in», «Founder», «Design lab», «XP».
- Termini criptici o innaturali: «Finisce qui», «Togli solo da oggi», «Togli questa riga», «Evidenza» (falso amico), «Scritta 20 lug», «concentratissimo», «riuscita», «Diario» (che in realtà è una cronologia), «Registro», «d≈3,1».
- La nota veloce ha tre nomi diversi: «Aggiungi una nota», «Scrivi un pensiero», «Da sistemare». Il popup non ha un pulsante Salva.
- Numeri senza etichetta: 🔥38, 1/2, 1 di 3, +4/+1, 7/25/17, «Backup 1», badge «1» sui Rituali. Separatori all'inglese («4.3», «1874»).
- I nomi dei promemoria non corrispondono a quelli dei rituali. Gli interruttori delle notifiche sono attivi anche con le notifiche bloccate.
- Elementi che sembrano cliccabili ma non lo sono: chip «concluso», riquadri 👍/👎, quadratini colore nel Mese. Al contrario, «Come sempre · 23:30–07:30» è un pulsante ma sembra un testo.
- Gli strumenti per sviluppatori (Registro tecnico, Design lab) sono visibili all'utente. «Rimuovi dati di esempio» è nascosto in fondo alle Impostazioni.
