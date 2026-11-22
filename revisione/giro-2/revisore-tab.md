# Revisione tablet (834×1112) — giro 2

## oggi-adesso__tab-light.png
- [alta] oggi-adesso__tab-light.png — intera pagina — layout da telefono stirato a 760px: la scheda principale e il pulsante «Fatto» (≈720×54) occupano tutta la larghezza, mentre metà inferiore dello schermo (y 650–1030) è vuota — limitare la colonna a ~600px centrata oppure usare due colonne (Adesso a sinistra, Poi/Rituali a destra).
- [media] oggi-adesso__tab-light.png — pulsante «Fatto» — sproporzionato (barra verde larga quanto lo schermo) rispetto a «Timer» e «Salta oggi» che sono piccoli; gerarchia urlata — larghezza max ~320px o in riga con Timer/Salta.
- [media] oggi-adesso__tab-light.png — sotto la data, barra «1/2» — barra di avanzamento e frazione senza etichetta: 1/2 di cosa? — aggiungere «1 di 2 fatte oggi» o tooltip/legenda.
- [media] oggi-adesso__tab-light.png — badge fiamma «38» in alto a destra — numero senza contesto, non si capisce se è toccabile né cosa conta — aggiungere «38 giorni» o etichetta, e allinearlo verticalmente alla data (ora è centrato fra data e barra).
- [bassa] oggi-adesso__tab-light.png — scheda principale, «Studio / Università» sopra la pillola «Abitudine» — due etichette impilate prima del titolo, spazi verticali diversi (24px sopra la pillola, 12px sotto) — metterle sulla stessa riga (area · tipo).
- [bassa] oggi-adesso__tab-light.png — riga «Pianifica la giornata» — padding sinistro 12px contro 20px della scheda sotto; bordi interni non allineati fra le card — uniformare il padding orizzontale.
- [media] oggi-adesso__tab-light.png — sezione «Poi», casella di spunta — riquadro 44px con bordo spesso, sproporzionato rispetto al testo e senza margine sinistro coerente (12px) — casella 24px dentro area tocco 44px, padding 16–20 come le altre card.
- [bassa] oggi-adesso__tab-light.png — tab «Rituali» in alto — il badge «1» sta fra icona e testo, posizione insolita — spostare il contatore dopo l'etichetta, in stile pallino.
- [media] oggi-adesso__tab-light.png — barra di navigazione in basso — 3 voci distribuite su 750px con icone e etichette minuscole (11px) e il «+» incollato a destra dopo un separatore; margine laterale 12px diverso dai 38px del contenuto — su tablet usare una barra laterale (rail) o una barra centrata e compatta; allineare i margini.

## giornata-giorno__tab-light.png
- [media] giornata-giorno__tab-light.png — due controlli segmentati impilati (Adesso/La giornata/Rituali e Giorno/Settimana/Mese/Anno) — stili diversi (uno a pillola bianca su grigio, l'altro con evidenziazione viola e icone sopra il testo), larghezze delle voci non uguali; doppio livello di schede confonde — uniformare lo stile o rendere il secondo un selettore compatto a destra del titolo «Oggi».
- [media] giornata-giorno__tab-light.png — titolo «Oggi» fra le frecce — manca la data (nella vista Adesso c'è «Martedì 18 agosto») — «Oggi · mar 18 ago».
- [media] giornata-giorno__tab-light.png — riga sonno «23:30 → 07:30 · 8h · ☕ 🍴 🍴» — sequenza di icone criptiche senza testo, non si capisce che è il riepilogo sonno/pasti né che è apribile — etichetta «Sonno e pasti» e icone con testo (Colazione 8:00…).
- [media] giornata-giorno__tab-light.png — fasce tratteggiate 07:00–07:30 (e 23:30–00:00) — nessuna etichetta, sembra un errore di rendering — scritta «Sonno» dentro la fascia o colore pieno tenue.
- [media] giornata-giorno__tab-light.png — pasti: «Colazione» è una barretta alta 24px, «Pranzo» e «Cena» 40px; etichette centrate mentre le attività sono allineate a sinistra e senza orario — stessa altezza proporzionale alla durata, allineamento a sinistra con orario.
- [alta] giornata-giorno__tab-light.png — blocco «Organizzare cena con il gruppo» (09:30–11:00) — la linea dell'ora attuale passa a 2px sotto «09:30–11:00» e il badge «10:30» copre il bordo destro del blocco; il testo inizia a metà blocco invece che in alto — testo ancorato in alto (padding 8px), linea dell'ora sotto i blocchi o con opacità, badge nella colonna orari a sinistra.
- [media] giornata-giorno__tab-light.png — stile dei blocchi — attività = sfondo pieno + striscia colorata con maniglia; abitudini = solo contorno verde con maniglia dentro; attività fatta = barrata con stella; tre linguaggi diversi senza legenda — un solo componente con varianti leggere (icona tipo + colore area).
- [bassa] giornata-giorno__tab-light.png — maniglie di trascinamento «⠿» su ogni blocco — rumore visivo su tablet dove si può trascinare con pressione lunga — mostrarle solo in modifica/hover.
- [media] giornata-giorno__tab-light.png — calendario a tutta larghezza 760px con blocchi larghi 700px — spreco di spazio: su tablet affiancare il calendario (≈60%) a un pannello «Senza orario» da cui trascinare.
- [bassa] giornata-giorno__tab-light.png — barra di navigazione in basso — copre il blocco «Cena» senza sfumatura né spazio; il blocco è tagliato a metà — aggiungere padding inferiore/sfumatura sotto la barra.

## giornata-giorno-fondo__tab-light.png
- [media] giornata-giorno-fondo__tab-light.png — blocco «Leggere 20 minuti» (22:00) — unico blocco senza orario (manca «22:00–22:20»), altezza diversa — mostrare sempre l'intervallo o almeno l'ora d'inizio sulla stessa riga.
- [media] giornata-giorno-fondo__tab-light.png — sezione «Senza orario», riga «Ripasso flashcard» — è un'abitudine ma ha la casella da attività e un'icona libro blu, mentre in Adesso è marcata «Abitudine» con icona ↻ — usare la stessa icona ↻ ovunque per le abitudini.
- [media] giornata-giorno-fondo__tab-light.png — icona orologio blu a destra di «Ripasso flashcard» — azione non spiegata (dai un orario?) — aggiungere testo «Pianifica» o tooltip.
- [bassa] giornata-giorno-fondo__tab-light.png — casella di spunta qui 24px, in Adesso 44px — stesso componente con dimensioni diverse — uniformare.
- [media] giornata-giorno-fondo__tab-light.png — campo «Nuova attività…» + pulsante «Aggiungi» — duplica il «+» della barra in basso; il pulsante ha altezza diversa dal campo (margini interni 4px sopra/sotto, sproporzionati) — tenere un solo punto di inserimento o allineare l'altezza del pulsante.
- [bassa] giornata-giorno-fondo__tab-light.png — «Sposta 1 non fatta a domani» — formulazione ellittica; e l'elemento non fatto è un'abitudine (che non si "sposta") — «Sposta a domani 1 attività non completata», escludendo le abitudini.
- [bassa] giornata-giorno-fondo__tab-light.png — titolo «Senza orario» con contatore «1» — testo grigio piccolo (13px) su sfondo grigio, gerarchia debole rispetto alla lista — titolo di sezione 15–17px semibold come «Poi».

## giornata-settimana__tab-light.png
- [media] giornata-settimana__tab-light.png — titolo «17 Ago – 23 Ago» — allineato a sinistra accanto alla freccia, mentre in Giorno il titolo «Oggi» è centrato fra le frecce; «Ago» maiuscolo non è italiano — titolo centrato in tutte le viste, «17–23 agosto».
- [media] giornata-settimana__tab-light.png — riquadro con la striscia dei giorni (L…D) — sfondo che va da x≈20 a x≈814, più largo delle card sotto (38–797): bordi non allineati — stessa larghezza e raggio delle altre card.
- [media] giornata-settimana__tab-light.png — striscia dei giorni — solo 17 e 18 hanno l'anello, gli altri giorni sono numeri nudi; nessuna legenda su cosa misura l'anello — anello vuoto anche per i giorni futuri e didascalia «anello = cose fatte».
- [alta] giornata-settimana__tab-light.png — liste per giorno — su 760px di larghezza è una lista verticale da telefono con righe di 52px e testo corto: per vedere la settimana bisogna scorrere 7 schede — su tablet griglia a 7 colonne (o 2 colonne di giorni).
- [media] giornata-settimana__tab-light.png — marcatori delle righe — abitudini con ↻ verde/blu, attività con pallino colorato; nella vista Mese le stesse cose hanno quadratini colorati, in Giorno caselle: tre simboli diversi per la stessa entità — un unico indicatore per tipo/area.
- [bassa] giornata-settimana__tab-light.png — colonna orari — le righe senza ora lasciano un buco di 50px a sinistra, il testo non è allineato con quello delle righe con ora? (sì, allineato) ma l'icona ↻ e i pallini hanno dimensioni diverse (12 vs 8px) — uniformare dimensioni dell'indicatore.
- [bassa] giornata-settimana__tab-light.png — link «Sposta» solo su alcune righe e in viola testuale — non si capisce perché solo lì (non fatte nel passato/oggi) — usare un'icona coerente o un menu sulla riga.
- [bassa] giornata-settimana__tab-light.png — intestazione «Lunedì 17» grigia vs «Martedì 18» nera — differenza cromatica poco leggibile come "passato"; e la freccia «›» a destra è minuscola — rendere l'intera intestazione toccabile con freccia più visibile.

## giornata-mese__tab-light.png
- [alta] giornata-mese__tab-light.png — margini di pagina — qui il contenuto parte a x=16 (frecce, card, titoli) mentre in Giorno/Settimana parte a x=38; anche il selettore Giorno/Settimana/Mese/Anno ha spaziature diverse — stesso margine orizzontale in tutte le sotto-viste.
- [alta] giornata-mese__tab-light.png — barra di navigazione in basso — spostata più in basso (y≈1058) e tagliata dal bordo dello schermo: il «+» viola esce dal fondo — fissarla con lo stesso offset/safe-area delle altre schermate.
- [media] giornata-mese__tab-light.png — calendario — puntini colorati sotto i giorni senza legenda; anelli senza spiegazione; giorni del mese precedente (27–31) con anelli e puntini che distraggono — legenda sotto la griglia, giorni fuori mese senza dati.
- [bassa] giornata-mese__tab-light.png — giorno 18 — doppio evidenziatore (riquadro grigio + cerchio viola pieno + anello) — una sola evidenziazione.
- [bassa] giornata-mese__tab-light.png — «18 giorni attivi   58 cose fatte» — «cose fatte» colloquiale e i due numeri sono attaccati al bordo sinistro senza contenitore, stile diverso dalla riga «4 di 24 fatte» della settimana — uniformare («58 completate»).
- [media] giornata-mese__tab-light.png — lista «Oggi» sotto il mese — quadratini colorati vuoti che sembrano caselle ma non è chiaro se si possano spuntare; ripete la vista Giorno — rendere esplicito (casella vera) o mostrare solo il giorno selezionato con riepilogo.
- [bassa] giornata-mese__tab-light.png — riga «Ripasso flashcard» — unica senza orario ma con sottotitolo «Abitudine» corto, righe di altezza uguale ma contenuto disallineato — ok, ma aggiungere «senza orario» per coerenza.

## giornata-anno__tab-light.png
- [alta] giornata-anno__tab-light.png — barra di navigazione in basso — di nuovo tagliata dal bordo inferiore (il «+» esce dallo schermo) e margini pagina a 16px invece di 38px come in Giorno/Settimana — stessa posizione e margini in tutte le viste.
- [media] giornata-anno__tab-light.png — mappe di calore dei mesi — nessuna legenda dei toni di verde; i giorni futuri e i giorni passati senza attività hanno lo stesso grigio — legenda «meno → più» e giorni futuri con solo contorno.
- [media] giornata-anno__tab-light.png — numeri verdi in alto a destra delle card (Giu 7, Lug 25, Ago 17) — non si sa cosa contano; assenti nei mesi a zero — etichetta «7 giorni» o tooltip.
- [bassa] giornata-anno__tab-light.png — mini-calendari — senza iniziali dei giorni della settimana, quindi la posizione dei quadratini non è leggibile; padding interno sotto le griglie variabile (Gen/Feb/Apr finiscono prima, lasciando 40px vuoti) — aggiungere L M M G V S D sopra e altezza fissa a 6 righe.
- [media] giornata-anno__tab-light.png — riepilogo «49 giorni attivi / 82 fatte / 1874 XP» — «XP» gergo da videogioco non spiegato altrove; «fatte» senza sostantivo — «punti» con spiegazione, «82 completate».
- [bassa] giornata-anno__tab-light.png — card «Scadenze» — una sola riga in una card alta 100px; icona valigetta a destra senza significato chiaro; il chip data «7 set» grigio poco leggibile — mostrare area con testo, rendere la riga toccabile con freccia.
- [bassa] giornata-anno__tab-light.png — titolo «2026» a sinistra (come Settimana/Mese) ma «Oggi» centrato in Giorno — allineamento titolo coerente.

## giornata-sonno-aperto__tab-light.png
- [alta] giornata-sonno-aperto__tab-light.png — campi orario «11:30 PM», «07:30 AM», «08:00 AM», «01:00 PM» — formato 12 ore AM/PM in un'app italiana, e incoerente con «23:30 → 07:30» della riga sopra — forzare il formato 24 ore.
- [alta] giornata-sonno-aperto__tab-light.png — menu durata «15 mir», «45 mi» — testo troncato dalla freccia del select nativo — allargare il select (≥90px) o usare «15′»/«45 min» in un controllo personalizzato.
- [media] giornata-sonno-aperto__tab-light.png — righe Colazione/Pranzo/Cena — etichetta a sinistra e campi tutti a destra con un vuoto di 500px in mezzo; i campi «A letto»/«Sveglia» sono invece larghi 290px: due logiche di larghezza diverse nello stesso pannello — griglia a colonne fisse (etichetta 140px | ora 120px | durata 100px | elimina).
- [media] giornata-sonno-aperto__tab-light.png — select nativi grigi con freccia di sistema accanto a campi testo personalizzati — aspetto incoerente — stilizzare i select come i campi.
- [media] giornata-sonno-aperto__tab-light.png — link «+ Pasto  Ripristina  Ritmo di base» — tre azioni testuali affiancate di pari peso; «Ripristina» e «Ritmo di base» non dicono cosa fanno (ripristina cosa? apre o applica il ritmo?) — «Aggiungi pasto» come pulsante, «Ripristina orari predefiniti» e «Modifica ritmo abituale» in un menu.
- [bassa] giornata-sonno-aperto__tab-light.png — icone cestino accanto a ogni pasto — eliminazione di un pasto senza conferma visibile e senza distanza dal select — più spazio o azione dentro menu.
- [media] giornata-sonno-aperto__tab-light.png — in alto — scorrendo, il selettore Giorno/Settimana/Mese/Anno viene tagliato a metà dal bordo superiore (non è fisso né scompare del tutto) — renderlo sticky con sfondo o lasciarlo uscire del tutto.

## giornata-scheda-blocco__tab-light.png
- [alta] giornata-scheda-blocco__tab-light.png — campo «Ora» — «09:30 AM» in formato 12 ore — 24 ore («09:30»).
- [media] giornata-scheda-blocco__tab-light.png — titolo «Organizzare cena / con il gruppo» — va a capo a ~310px pur avendo 600px disponibili — togliere il max-width del titolo.
- [media] giornata-scheda-blocco__tab-light.png — foglio dal basso largo 640px agganciato al fondo, senza padding inferiore (la riga «Elimina» tocca quasi il bordo) e senza pulsante di chiusura — su tablet usare un foglio centrato/popover vicino al blocco, con «Chiudi» e safe-area in basso.
- [media] giornata-scheda-blocco__tab-light.png — «Togli la spunta» — unico segnale che l'attività è fatta è un link grigio centrato; nessuno stato «Fatta ✓» visibile nel titolo — mostrare stato completato (badge verde) e azione secondaria «Segna come da fare».
- [media] giornata-scheda-blocco__tab-light.png — azioni in basso — manca «Apri l'attività» che invece c'è nella scheda abitudine; «Sposta in Da fare» è gergale (toglie l'orario?) — «Togli dal calendario» e aggiungere «Apri dettagli».
- [bassa] giornata-scheda-blocco__tab-light.png — sottotitolo «Attività · Oggi» senza icona, mentre la scheda abitudine ha «↻ Abitudine · Oggi» — uniformare.
- [bassa] giornata-scheda-blocco__tab-light.png — chip «1 h 30» — spazio fra «1» e «h» e senza «min»; altrove «45 min» — «1 h 30 min» o «1:30».

## giornata-scheda-abitudine__tab-light.png
- [alta] giornata-scheda-abitudine__tab-light.png — «06:00 PM» — formato 12 ore — «18:00».
- [media] giornata-scheda-abitudine__tab-light.png — pulsante «Fatta» viola — in Adesso lo stesso gesto è «Fatto» su pulsante verde: genere e colore incoerenti — un'unica etichetta («Fatto») e un unico colore per il completamento.
- [media] giornata-scheda-abitudine__tab-light.png — «Termina l'abitudine» — azione distruttiva/definitiva nello stesso stile viola di «Salta oggi» e «Apri l'abitudine» — colore di avviso e conferma; separarla.
- [media] giornata-scheda-abitudine__tab-light.png — foglio — come per l'attività: agganciato al fondo senza margine inferiore, niente «Chiudi», largo 640px con molto vuoto fra etichetta e valore — popover o foglio centrato con altezza al contenuto.
- [bassa] giornata-scheda-abitudine__tab-light.png — chip valori «06:00 PM ⊗», «45 min ⊗», «Salute & Sport» — larghezze diverse e bordi destri non allineati (l'area non ha la ⊗) — larghezza minima uguale e allineamento a destra coerente.

## rituali__tab-light.png
- [media] rituali__tab-light.png — badge «1» sulla scheda «Rituali» — la lista mostra 3 «da fare» + 1 «da compilare»: il contatore non corrisponde a niente di visibile — far coincidere il numero con i rituali in sospeso di adesso, o toglierlo.
- [media] rituali__tab-light.png — pagina — 5 righe in alto e 640px vuoti sotto; su tablet nessuna informazione su quando fare ciascun rituale — aggiungere orario/momento suggerito («mattina», «sera», «domenica») e usare griglia a 2 colonne di card.
- [bassa] rituali__tab-light.png — icona di «Piano del giorno» piena viola, le altre chiare — non si capisce se indica «attivo ora» — spiegarlo (badge «Adesso») o uniformare.
- [bassa] rituali__tab-light.png — stati a destra «da fare / 2 di 3 scelte», «da compilare / 0 di 4» — due righe minuscole (11–12px) in minuscolo, «da compilare» e «da fare» sinonimi inutili — una sola etichetta («Da fare · 2/3») in pillola, più leggibile.
- [bassa] rituali__tab-light.png — nomi — qui «Fine giornata» e «Bilancio della settimana», nel resto dell'app (elenco schermate/rituale aperto) «Review della sera/settimana»: verificare che i nomi siano unici ovunque — un solo nome per rituale.

## rituale-piano__tab-light.png
- [media] rituale-piano__tab-light.png — campo «Aggiungi un‘altra…» — apostrofo tipografico sbagliato (‘ di apertura invece di ’) e «un'altra» cosa? — «Aggiungi un'altra priorità…».
- [media] rituale-piano__tab-light.png — riga «Organizzare cena con il gruppo» — barrata ma con badge «★ Priorità» pieno e icona persone rosa; «Confrontare piani telefonici» ha solo icona portafoglio arancione: icone d'area senza testo, badge e stato in conflitto — mostrare area come testo/pallino, badge priorità più discreto per le fatte.
- [media] rituale-piano__tab-light.png — «2 di 3 scelte» nell'intestazione — ma in lista ci sono 2 righe e non è chiaro che il massimo è 3 né cosa sia una «scelta» — sottotitolo dentro il pannello «Scegli fino a 3 priorità per oggi (2/3)».
- [media] rituale-piano__tab-light.png — pulsante «Salva +5 XP» largo 730px — sproporzionato; il premio «+5 XP» dentro il pulsante distrae dall'azione — pulsante ≤320px allineato a destra, ricompensa come feedback dopo il salvataggio.
- [bassa] rituale-piano__tab-light.png — «Quando inizi?» con esempio «Es. alle 9:00, alla scrivania» — domanda ambigua (ora? luogo?), e campo libero senza scopo spiegato — «Quando e dove inizi? (es. alle 9 alla scrivania)» con breve spiegazione dell'intenzione d'implementazione.
- [bassa] rituale-piano__tab-light.png — due campi grigi pieni (Aggiungi…, Quando inizi?) con stili diversi: il primo ha pulsante interno, il secondo no, altezze 50 vs 48 — uniformare.

## rituale-sonno-pasti__tab-light.png
- [alta] rituale-sonno-pasti__tab-light.png — righe «A letto 11:30 PM», «Sveglia 07:30 AM» — formato 12 ore, mentre 4 cm più su c'è «Come sempre · 23:30–07:30» — 24 ore ovunque.
- [media] rituale-sonno-pasti__tab-light.png — due salvataggi nello stesso pannello: «Salva» (pillola chiara) dopo il sonno e «Fatto» (grande viola) in fondo — non si capisce se «Fatto» salva anche il sonno — un solo pulsante finale; per il sonno basta la conferma implicita.
- [media] rituale-sonno-pasti__tab-light.png — pulsanti pasti «sì / no / 🕒» — minuscoli, tutti grigi, nessuno stato selezionato visibile; l'orologio non spiega che serve a indicare un orario diverso — controllo segmentato con stato attivo, «Altro orario» come testo.
- [bassa] rituale-sonno-pasti__tab-light.png — etichette di sezione «Sonno», «Pasti», «Altre cose fatte» — 13px grigie, spaziature diverse (Sonno→riga 50px, Pasti→riga 25px) — stile e spaziatura uniformi, titoli un po' più forti.
- [bassa] rituale-sonno-pasti__tab-light.png — link «Come sempre · 23:30–07:30» in viola a destra — sembra un'etichetta, non si capisce che applica gli orari abituali — pulsante «Usa orari abituali (23:30–07:30)».
- [bassa] rituale-sonno-pasti__tab-light.png — «Non ricordo» — accanto a «Salva» con stesso peso; azione di rinuncia — spostarla come link secondario allineato a destra.
- [bassa] rituale-sonno-pasti__tab-light.png — pulsante finale «Fatto» senza «+XP», mentre gli altri rituali hanno «Salva +5 XP» / «Registra +3 XP» — tre verbi diversi per la stessa azione di chiusura rituale — uniformare («Salva»).

## rituale-checkin__tab-light.png
- [media] rituale-checkin__tab-light.png — pulsanti selezionati (4 energia, 5 concentrazione, 5 umore) — ingranditi e con ombra: escono dalla griglia (il «5» arriva a x=785, oltre il bordo 781 degli altri) e spostano l'allineamento — stato selezionato solo con colore/bordo, stessa dimensione.
- [media] rituale-checkin__tab-light.png — stato «✓ fatto» ma pulsante «Registra +3 XP» ancora attivo — ambiguo: registra di nuovo? altri XP? — se già fatto mostrare «Aggiorna» senza XP.
- [media] rituale-checkin__tab-light.png — pulsante «Registra» in stile tenue lilla con bordo, mentre «Salva» nel Piano e «Fatto» in Sonno sono viola pieni — incoerenza dei pulsanti primari — stesso stile.
- [media] rituale-checkin__tab-light.png — grafico «Andamento degli ultimi 14 giorni» — linee interrotte senza indicare i giorni mancanti, legenda duplicata (sopra e a destra con pallini sovrapposti), linee piatte a 4 che si coprono a vicenda — una sola legenda, punti sui giorni con dati, piccoli multipli separati per Energia/Focus/Umore.
- [bassa] rituale-checkin__tab-light.png — «Focus» nel grafico ma la domanda dice «concentrarti»; «concentratissimo» colloquiale — usare «Concentrazione» ovunque, «molto concentrato».
- [bassa] rituale-checkin__tab-light.png — «Media recente 4,3» ripetuta sotto ogni domanda con icona — rumore; il dato è nel grafico — rimuovere o spostare nel grafico.
- [bassa] rituale-checkin__tab-light.png — scale «1 · esausto … 3 · normale … 5 · pieno» — etichette fuori asse rispetto ai pulsanti (il «3» è centrato sotto il pulsante ma 1 e 5 allineate ai bordi) — ok; ma «pieno» di energia è innaturale — «carico».
- [bassa] rituale-checkin__tab-light.png — il grafico finisce sotto la barra di navigazione — padding inferiore insufficiente.

## rituale-sera__tab-light.png
- [media] rituale-sera__tab-light.png — griglia aree × «1 2 3 4 5» — manca la domanda (cosa sto votando? soddisfazione? impegno?) e manca la legenda della scala; i pulsanti sono 36px mentre nel Check-in la stessa scala ha pulsanti 147×50 — titolo «Come è andata oggi in ogni area?», legenda 1=male/5=benissimo, stesso componente di scala.
- [media] rituale-sera__tab-light.png — 8 righe obbligatorie ogni sera — compito pesante, nessuna indicazione che si possono saltare — evidenziare «facoltativo» o mostrare solo le aree toccate oggi.
- [bassa] rituale-sera__tab-light.png — righe aree — nome a sinistra, pulsanti a destra con 380px di vuoto in mezzo — su tablet mettere i pulsanti subito dopo una colonna nomi di 220px o due colonne di aree.
- [bassa] rituale-sera__tab-light.png — pulsante «☾ Salva +8 XP» — icona luna diversa dall'icona dischetto degli altri «Salva» — uniformare.
- [bassa] rituale-sera__tab-light.png — il pannello finisce sotto la barra di navigazione (si intravede la riga successiva) — padding inferiore.

## rituale-settimana__tab-light.png
- [media] rituale-settimana__tab-light.png — numeri «216 / 10 / 6/7» — in carattere serif, unico punto dell'app con questo font — usare il font dell'interfaccia (numeri tabulari).
- [media] rituale-settimana__tab-light.png — riepilogo centrato mentre tutto il resto del pannello è allineato a sinistra; terminologia «azioni completate» (altrove «cose fatte», «fatte») — allineare a sinistra in card statistiche come in Anno, un solo termine.
- [media] rituale-settimana__tab-light.png — quattro textarea vuote senza esempio (la sera invece ha «Es. …»), con maniglie di ridimensionamento visibili — aggiungere placeholder d'esempio, nascondere la maniglia, auto-altezza.
- [bassa] rituale-settimana__tab-light.png — domande senza punto interrogativo («Cosa ha funzionato questa settimana») mentre in Fine giornata c'è «?» — aggiungere «?».
- [bassa] rituale-settimana__tab-light.png — link «Apri le Scoperte» — rientro sinistro 70px diverso dal contenuto (53px), maiuscola su «Scoperte» e non si capisce il nesso — «Vedi cosa hai scoperto →» allineato.
- [bassa] rituale-settimana__tab-light.png — accordion con 5 rituali che diventa lunghissimo quando aperto; i rituali sono flussi distinti — su tablet aprire il rituale in un pannello/pagina dedicata a destra della lista.

## attivita-sistemare__tab-light.png
- [media] attivita-sistemare__tab-light.png — etichetta «Da sistemare» sotto le schede — ripete il nome della scheda attiva — sostituire con istruzione utile («Decidi dove va ogni idea: 6 rimaste»).
- [media] attivita-sistemare__tab-light.png — pulsanti «Oggi / Da fare / Scarta» — staccati sotto la card (sembrano azioni della pagina, non dell'elemento); tre pulsanti larghi 250px con ombra sul primo — metterli dentro la card, in basso a destra, dimensione naturale.
- [media] attivita-sistemare__tab-light.png — select «Altro / Esplorazione» — select nativo grigio con freccia di sistema, stile diverso dai chip d'area usati nelle schede (es. «Relazioni & Sociale» pillola lilla) — usare lo stesso chip/selettore.
- [media] attivita-sistemare__tab-light.png — lista «In coda 5» — testi grigi senza separatori, rientro 49px diverso dall'etichetta (37px), non si capisce se sono toccabili; «e un'altra» in corsivo nasconde un elemento senza motivo (sono solo 5) — mostrarle tutte come righe toccabili con divisori.
- [media] attivita-sistemare__tab-light.png — contatori — scheda «Da sistemare 6», «In coda 5», badge «6» su «Attività» nella barra in basso: tre numeri vicini con significati diversi/ambigui — chiarire («1 di 6») e far corrispondere il badge di navigazione a una sola cosa.
- [alta] attivita-sistemare__tab-light.png — uso dello spazio — card e lista occupano 480px in alto, 550px vuoti; su tablet il triage starebbe bene a due colonne (coda a sinistra, elemento corrente a destra) — layout master/detail.
- [bassa] attivita-sistemare__tab-light.png — «aggiunta 18 ago, 10:30» — grigio 12px attaccato al select (8px) — più spazio o spostare sotto il titolo.

## attivita-dafare__tab-light.png
- [media] attivita-dafare__tab-light.png — pulsanti «+ Oggi» — ripetuti su 9 righe, il primo pieno viola e gli altri lilla senza motivo apparente — stesso stile per tutti (o mostrarli solo su hover/scorrimento), azione principale non ripetuta.
- [media] attivita-dafare__tab-light.png — «1 di 3», «1 di 4» a destra — numeri senza unità (passi?) — «1/3 passi» con icona checklist o mini barra.
- [media] attivita-dafare__tab-light.png — righe senza casella di spunta — in Giorno/Adesso le attività si spuntano, qui no; non si capisce come completarle — aggiungere la casella a sinistra.
- [bassa] attivita-dafare__tab-light.png — filtro «Tutte» — chip isolato a 16px sotto il campo e a soli 8px dall'etichetta «Importanti», spaziatura sbilanciata — metterlo sulla riga dei titoli a destra o in linea col campo.
- [bassa] attivita-dafare__tab-light.png — icone d'area colorate (libro, razzo, valigetta, cuore, lampadina) 14px prima del titolo — senza testo d'area, difficile distinguerle — aggiungere area come sottotitolo o raggruppare per area.
- [bassa] attivita-dafare__tab-light.png — campo «Nuova attività…» con «Aggiungi» — duplica il «+» della barra in basso; pulsante interno più basso del campo con margini irregolari — una sola via d'inserimento coerente.
- [media] attivita-dafare__tab-light.png — layout — righe larghe 760px con titolo corto e pulsante all'estremo destro (occhio che salta 500px) — colonna ~640px o due colonne Importanti/Altre.

## attivita-dafare-aggiunta__tab-light.png
- [media] attivita-dafare-aggiunta__tab-light.png — riga opzioni «Oggi / Domani / Senza data / Altro / Esplorazione ▾» — rientrata a x=49 mentre il campo sopra parte a x=37; mescola chip personalizzati e un select nativo — allineare al bordo del campo, usare un chip «Area ▾» con lo stesso stile.
- [media] attivita-dafare-aggiunta__tab-light.png — area predefinita «Altro / Esplorazione» per «Comprare il pane» — default poco sensato e nascosto — lasciare «Nessuna area» o suggerire dall'ultimo uso.
- [media] attivita-dafare-aggiunta__tab-light.png — opzioni mancanti — non si può segnare «Importante» né dare un orario, eppure la lista è divisa in Importanti/Altre — aggiungere il toggle «Importante» (stella).
- [bassa] attivita-dafare-aggiunta__tab-light.png — «Aggiungi» resta lilla tenue anche con testo inserito — non segnala che è pronto — renderlo pieno quando il campo non è vuoto.
- [bassa] attivita-dafare-aggiunta__tab-light.png — chip «Senza data» selezionato in un viola più scuro del viola primario dei pulsanti — uniformare il colore.
- [bassa] attivita-dafare-aggiunta__tab-light.png — filtro «Tutte» spinto giù fra opzioni e lista, ora sembra parte del modulo di inserimento — separare visivamente modulo e filtro.

## attivita-abitudini__tab-light.png
- [media] attivita-abitudini__tab-light.png — anello «0 di 3 oggi» — anello grigio vuoto sembra un caricamento; e in Adesso la barra dice «1/2»: due contatori del giorno diversi — spiegare cosa si conta e aggiungere colore anche a 0.
- [media] attivita-abitudini__tab-light.png — card separate per ogni abitudine — in «Da fare» la stessa lista è un gruppo unico con divisori — stesso componente lista.
- [media] attivita-abitudini__tab-light.png — cerchi di completamento 44px a destra — altrove la spunta è una casella a sinistra — posizione e forma uniformi.
- [bassa] attivita-abitudini__tab-light.png — serie «🔥3» solo su Camminata, senza etichetta — «3 giorni di fila».
- [bassa] attivita-abitudini__tab-light.png — «Ripasso flashcard» senza orario: la riga di metadati comincia con l'icona, le altre con l'ora, allineamento irregolare — ok ma aggiungere «quando vuoi».
- [media] attivita-abitudini__tab-light.png — schermata — 3 righe e 550px vuoti; su tablet mostrare a fianco la settimana dell'abitudine (mini griglia) — aggiungere sette pallini della settimana su ogni riga.

## attivita-abitudini-nuova__tab-light.png
- [media] attivita-abitudini-nuova__tab-light.png — riga «Ora · Nessuno» — errore di genere («ora» è femminile) — «Nessuna» o meglio «Quando vuoi».
- [media] attivita-abitudini-nuova__tab-light.png — cerchi dei giorni L M M G V S D — distribuiti su 735px con 70px di vuoto fra uno e l'altro; tutti pieni, non si vede lo stato "non selezionato" — gruppo compatto allineato a sinistra con stato off visibile (contorno).
- [media] attivita-abitudini-nuova__tab-light.png — pannello opzioni — card separata sotto il campo, non collegata visivamente al campo in uso; non c'è un «Annulla» — unire campo e opzioni in un'unica card con azioni Annulla/Aggiungi in fondo.
- [bassa] attivita-abitudini-nuova__tab-light.png — area preselezionata «Salute & Sport» — default arbitrario — nessuna area o ultima usata, segnalata come suggerimento.
- [bassa] attivita-abitudini-nuova__tab-light.png — «Giorni … Ogni giorno» ripete l'informazione dei 7 cerchi pieni — tenere solo il riassunto accanto all'etichetta e i cerchi sotto, oppure preset (Ogni giorno / Feriali / Personalizza).

## scheda-attivita__tab-light.png
- [media] scheda-attivita__tab-light.png — chip «Giovedi» — manca l'accento — «Giovedì».
- [media] scheda-attivita__tab-light.png — titolo «Recuperare i corsi di / ingegneria gestionale» — va a capo a ~250px su 600 disponibili — togliere il limite di larghezza.
- [media] scheda-attivita__tab-light.png — pulsante «Prossimo passo in Oggi» — italiano contorto — «Metti il prossimo passo in Oggi» o «Fai il prossimo passo oggi».
- [media] scheda-attivita__tab-light.png — caselle dei passi — quadrati 44px che riempiono tutta l'altezza della riga, attaccati al bordo sinistro (8px) del contenitore; spunta verde scuro piena molto pesante — casella 22–24px con padding 16px.
- [media] scheda-attivita__tab-light.png — «Fissa in alto  no» — valore testuale, non sembra modificabile — interruttore (switch).
- [media] scheda-attivita__tab-light.png — affordance incoerenti nella sezione Dettagli — Area con «˅», Scadenza con «›», Fissa in alto senza niente — un'unica convenzione.
- [media] scheda-attivita__tab-light.png — «Non completata ›» — non si capisce cosa fa (l'attività è già non completata) — «Segna come non riuscita / rimanda» con spiegazione.
- [bassa] scheda-attivita__tab-light.png — chip «Domani, Giovedi, Tra una settimana» con iniziale maiuscola; chip «ogni giorno, ogni 2 giorni, ogni settimana» in minuscolo; i primi grigi su bianco, i secondi bianchi su grigio — uniformare.
- [bassa] scheda-attivita__tab-light.png — «Distribuisci i passi» — gergo poco chiaro — «Pianifica i passi: uno…» con anteprima delle date.
- [media] scheda-attivita__tab-light.png — riquadri dentro riquadri — foglio bianco > pannello grigio Passi > chip bianchi; sezioni con etichette grigie piccole; nessun pulsante di chiusura — appiattire, titoli di sezione più chiari, «Chiudi» in alto a destra.

## scheda-attivita-fondo__tab-light.png
- [media] scheda-attivita-fondo__tab-light.png — intestazione fissa del foglio — il pulsante «Prossimo passo in Oggi» scorre sotto il titolo e viene tagliato di netto, senza ombra/separatore — aggiungere un separatore o ombra sotto l'intestazione fissa, oppure non rendere fisso il titolo.
- [media] scheda-attivita-fondo__tab-light.png — fondo del foglio — anche a fine scorrimento la riga «Elimina» arriva a pochi px dal bordo dello schermo, senza margine né safe-area — padding inferiore ≥24px.
- [media] scheda-attivita-fondo__tab-light.png — uso dello spazio — il foglio è una colonna da 640px alta più dello schermo; su tablet starebbe in due colonne (passi a sinistra, dettagli/azioni a destra) o come pannello laterale — layout a due colonne.

## scheda-abitudine__tab-light.png
- [alta] scheda-abitudine__tab-light.png — «Inizio 07/29/2026» — data in formato americano MM/GG/AAAA — «29/07/2026» o «29 lug 2026».
- [alta] scheda-abitudine__tab-light.png — «Ora 06:00 PM» — formato 12 ore — «18:00».
- [media] scheda-abitudine__tab-light.png — calendario delle ultime settimane — nessun mese indicato (27–31 sono di luglio, il resto agosto), cerchi grigi/verdi/senza cerchio (weekend) senza legenda — intestazione «Luglio–Agosto», legenda fatto/mancato/non previsto.
- [media] scheda-abitudine__tab-light.png — pulsante «Fatta» viola pieno — in Adesso «Fatto» verde; l'abitudine non è un genere femminile coerente con «Fatto» delle attività — uniformare.
- [media] scheda-abitudine__tab-light.png — area — nel titolo è un chip verde «Salute & Sport», nella riga «Area» un chip lilla — stesso dato con due stili — un solo stile (colore dell'area).
- [media] scheda-abitudine__tab-light.png — riga «Quando» — i 7 cerchi occupano solo 560px su 600 (D a x=649, spazio vuoto a destra) mentre in «Nuova abitudine» si stendono su tutta la larghezza; la «×» dell'ora è fuori dal chip, nelle schede del calendario è dentro — uniformare.
- [bassa] scheda-abitudine__tab-light.png — «Elimina» — qui pulsante largo centrato, nella scheda attività riga di lista allineata a sinistra con icona — stesso componente.
- [bassa] scheda-abitudine__tab-light.png — «4 record» — formulazione ambigua — «4 · serie più lunga».

## scheda-abitudine-fondo__tab-light.png
- [media] scheda-abitudine-fondo__tab-light.png — fondo del foglio — «Elimina» a 25px dal bordo e il foglio finisce sul bordo dello schermo; nessun «Chiudi»/«Fine» in tutta la scheda — padding inferiore e pulsante di chiusura in intestazione.
- [bassa] scheda-abitudine-fondo__tab-light.png — intestazione fissa — scorrendo sparisce il chip d'area e la riga «lun–ven · 18:00», il titolo resta ma senza ombra di separazione netta — ok, aggiungere separatore più visibile.
- [bassa] scheda-abitudine-fondo__tab-light.png — restano i difetti della vista precedente (07/29/2026, 06:00 PM) — vedi sopra.

## andamento__tab-light.png
- [alta] andamento__tab-light.png — card serie «🔥38» con settimana «M G V S D L M» — il venerdì è vuoto (giorno mancato) ma la serie risulta 38 giorni: contraddizione apparente; inoltre la settimana parte da mercoledì senza date — spiegare la regola (es. «giorni di riposo concessi») e mostrare date sotto le iniziali.
- [media] andamento__tab-light.png — «38» e «65% / 81 di 124» — numeri grandi senza etichetta — «38 giorni di fila», «65% completate (81 su 124) negli ultimi 30 giorni».
- [media] andamento__tab-light.png — card «Costanza» — la mappa di calore occupa 200px in un angolo di una card larga 760px, senza etichette di mesi/giorni; usa il blu mentre la vista Anno usa il verde per lo stesso concetto — allargarla alla card con etichette, stessa palette dell'Anno.
- [media] andamento__tab-light.png — «Per area» — le barre partono a x diverse (274–282) e finiscono a x diverse a seconda della larghezza del testo: colonne non allineate — griglia a colonne fisse (nome | barra | % | n/m).
- [bassa] andamento__tab-light.png — «50% 4/8» — percentuale e frazione con pesi diversi attaccate — basta una delle due o la frazione in tooltip.
- [bassa] andamento__tab-light.png — lista in fondo «Riflessioni passate / Sessioni del timer / Aree» — «Aree» c'è anche nel Profilo: doppia porta d'ingresso; voci di navigazione mischiate alle statistiche — raggrupparle sotto un titolo «Archivio».
- [media] andamento__tab-light.png — layout — card impilate a tutta larghezza; su tablet Costanza e Per area starebbero affiancate — griglia a due colonne.

## andamento-fondo__tab-light.png
- [media] andamento-fondo__tab-light.png — lista in fondo — compare anche «Grafici»: un'altra pagina di statistiche separata dentro la pagina di statistiche; «Aree» duplicata col Profilo — integrare i grafici nel Riepilogo e lasciare un solo accesso alle Aree.
- [bassa] andamento-fondo__tab-light.png — scorrendo sparisce il selettore Riepilogo/Scoperte e la card in cima è attaccata al bordo superiore (6px) — intestazione compatta fissa o margine superiore.
- [bassa] andamento-fondo__tab-light.png — «Riflessioni passate 79» — contatore solo su una voce delle quattro — uniformare (contatori o nessuno).

## scoperte__tab-light.png
- [media] scoperte__tab-light.png — riquadri pollice su/giù 44px con bordo a sinistra di ogni riga — sembrano pulsanti per votare, ma sono solo icone (la sezione già dice Funziona/Non funziona) — icona semplice 20px senza riquadro, o renderli davvero un interruttore.
- [media] scoperte__tab-light.png — etichette di evidenza «misurato», «lo noto ogni volta», «notato una volta» — formulazioni miste (participio/prima persona) e non spiegate — scala coerente: «Misurato · Sempre · Una volta» con legenda.
- [media] scoperte__tab-light.png — layout — due liste impilate e 250px vuoti; su tablet «Funziona» e «Non funziona» affiancate in due colonne.
- [bassa] scoperte__tab-light.png — sotto-schede «Registro 8 / Esperimenti 2» — terzo stile di sotto-navigazione (due voci larghe 380px) diverso da Giorno/Settimana — uniformare; «Registro» poco evocativo — «Tutte».
- [bassa] scoperte__tab-light.png — titoli «👍 Funziona 4», «👎 Non funziona 4» — 13px grigi, troppo deboli per dividere due liste — titoli 17px.
- [bassa] scoperte__tab-light.png — scheda «Scoperte» con icona pollice — icona fuorviante (sembra «Mi piace») — icona lampadina/fiaschetta come per Esperimenti.

## scoperte-esperimenti__tab-light.png
- [media] scoperte-esperimenti__tab-light.png — grafico del primo esperimento — le etichette «media 3,1» e «media 4,3» sono sovrapposte ai punti (un punto copre «media»); nel secondo grafico le etichette «…di 55» sono tagliate — spostare le etichette fuori dall'area dati (a destra della linea) con sfondo.
- [media] scoperte-esperimenti__tab-light.png — riquadro risultato «… L'entità del cambiamento è grande (d≈3,1)» — «d» di Cohen è gergo statistico incomprensibile — togliere «d≈3,1» o spiegarlo in un tooltip.
- [media] scoperte-esperimenti__tab-light.png — chip di stato/metrica — nel primo esperimento «concluso» e «Focus (da check-in, 1–5)» stanno accanto al titolo, nel secondo «attivo» accanto al titolo e la metrica su una riga a parte: posizioni incoerenti; «concluso» minuscolo — sempre: stato accanto al titolo, metrica sotto.
- [bassa] scoperte-esperimenti__tab-light.png — testi descrittivi («Per prima cosa l'app misura…», «La modifica: …») limitati a ~430px in card da 760px — accettabile per leggibilità, ma il grafico usa tutta la larghezza: allineare le colonne (testo a sinistra, risultato a destra su tablet).
- [bassa] scoperte-esperimenti__tab-light.png — asse Y con soli 1/3/5 e area grigia vuota sotto 3 — restringere l'asse a 1–5 con tutte le tacche o partire da 2.
- [bassa] scoperte-esperimenti__tab-light.png — «Focus» qui, «concentrazione» nel check-in — stesso termine.
- [media] scoperte-esperimenti__tab-light.png — pagina — card lunghissime impilate; su tablet elenco esperimenti a sinistra e dettaglio a destra.

## scheda-scoperta__tab-light.png
- [media] scheda-scoperta__tab-light.png — titolo «Una cosa che hai capito» + etichetta «Cosa hai capito» — ripetizione; e nella lista l'oggetto si chiama «scoperta» — titolo «Scoperta», campo senza etichetta ridondante.
- [bassa] scheda-scoperta__tab-light.png — «Quanto ne sei sicuro» senza «?»; chip «notato una volta / lo noto ogni volta / misurato» in minuscolo e con persone verbali diverse — «Visto una volta · Succede sempre · Misurato».
- [bassa] scheda-scoperta__tab-light.png — «Esito» dentro il gruppo «Dettagli» con chip bianchi su grigio — riquadri dentro riquadri; l'esito è il dato principale — portarlo sopra, fuori dal gruppo.
- [bassa] scheda-scoperta__tab-light.png — textarea con maniglia di ridimensionamento visibile — nasconderla, auto-altezza.
- [media] scheda-scoperta__tab-light.png — foglio — come gli altri: nessun «Chiudi/Fine», nessun salvataggio esplicito, «Elimina» attaccato al fondo dello schermo — aggiungere «Fine» in alto a destra e padding inferiore.

## profilo__tab-light.png
- [alta] profilo__tab-light.png — navigazione — nessuna intestazione né «Indietro», e nessuna voce attiva nella barra in basso: l'utente non sa dove si trova né come tornare — titolo «Profilo» con pulsante indietro/chiudi, oppure Profilo come voce della navigazione.
- [media] profilo__tab-light.png — statistiche «38 giorni / 109 fatte / 65% riuscita» — numeri diversi da quelli dell'Anno (82 fatte) e di Andamento (81 di 124), senza periodo; «riuscita» innaturale — indicare il periodo («da sempre») e usare «completamento».
- [media] profilo__tab-light.png — «Promemoria · bloccati» — stato d'errore in grigio neutro senza spiegazione né azione — evidenziarlo (arancio) con «Attiva le notifiche».
- [bassa] profilo__tab-light.png — avatar «R» quadrato arrotondato qui, cerchio nell'intestazione delle altre pagine — stessa forma.
- [bassa] profilo__tab-light.png — nome e motto non sembrano modificabili (nessuna icona matita) — aggiungere «Modifica profilo».
- [media] profilo__tab-light.png — layout — 5 voci e metà schermo vuota; su tablet il profilo può essere una colonna a sinistra con il dettaglio della voce scelta a destra (stile Impostazioni iPadOS).

## impostazioni__tab-light.png
- [media] impostazioni__tab-light.png — sezione «Account» — contiene solo «Sincronizzazione · su questo dispositivo» (non c'è un account), e il gruppo sotto (Area predefinita, Timer, Musica, Aspetto) non ha titolo e sembra parte di Account — titolo «Preferenze» per il secondo gruppo, «Dati sul dispositivo» al posto di Account.
- [media] impostazioni__tab-light.png — Impostazioni aperte come foglio sopra il Profilo, alto quanto lo schermo, senza «Chiudi» — su tablet aprire come pagina o pannello destro; pulsante «Fine».
- [bassa] impostazioni__tab-light.png — valori «Automatica» (maiuscola, con ˅) vs «chiedi sempre», «nessuna», «automatico» (minuscolo, con ›) — stessa capitalizzazione e stessa freccia.
- [bassa] impostazioni__tab-light.png — «Esporta dati», «Importa dati» senza freccia mentre «Backup e ripristino» ce l'ha (con un «1» non spiegato) — chevron uniformi, «1 backup».
- [bassa] impostazioni__tab-light.png — «Scienza», «Registro tecnico» — voci vaghe/da sviluppatori — «Perché funziona (le ricerche)», spostare il registro tecnico in fondo sotto «Avanzate».

## impostazioni-fondo__tab-light.png
- [bassa] impostazioni-fondo__tab-light.png — identica alla vista precedente: il foglio non scorre e «Cancella tutti i dati» è l'ultima voce a ~25px dal bordo inferiore — manca padding/safe-area e un piè di pagina (versione app, crediti, privacy).
- [media] impostazioni-fondo__tab-light.png — «Cancella tutti i dati» subito sotto «Rimuovi dati di esempio», nello stesso gruppo e a un tocco di distanza — separarla in un gruppo a sé con spazio e conferma esplicita.

## imp-timer__tab-light.png
- [media] imp-timer__tab-light.png — tre modalità «Avvio rapido», «Sessione», «Pomodoro» senza una riga di spiegazione; «Avvio rapido · Durata 5 min · Poi continua per 25 min» incomprensibile — aggiungere una didascalia sotto ogni gruppo («Inizia con 5 minuti, poi prosegui per altri 25»).
- [media] imp-timer__tab-light.png — «Pausa lunga ogni 4 · No» — frase spezzata e valore sì/no reso come pulsante-chip — interruttore «Pausa lunga ogni 4 sessioni».
- [media] imp-timer__tab-light.png — altezza del foglio — Impostazioni occupa quasi tutto lo schermo, la sottopagina Timer parte a metà (y=423): il foglio salta di altezza fra livelli — altezza costante per la navigazione interna.
- [bassa] imp-timer__tab-light.png — link «‹ Impostazioni» 12px sopra il titolo — area di tocco piccola — pulsante indietro nella barra del foglio, 44px.
- [bassa] imp-timer__tab-light.png — tutti i valori sono chip lilla identici, anche «Chiedi sempre» (scelta) e «No» (booleano) — controlli diversi per tipi diversi (menu, stepper, switch).

## imp-musica__tab-light.png
- [media] imp-musica__tab-light.png — campi «Incolla il link» — grigio chiaro su grigio chiaro senza bordo: quasi invisibili, non sembrano campi; rientro 147px contro 132px dell'etichetta — bordo o sfondo bianco, allineamento all'etichetta.
- [media] imp-musica__tab-light.png — 9 campi link tutti aperti — muro di input ripetuti — mostrare solo «Predefinita» e un «Personalizza per area ›» che apre l'elenco; per area righe compatte con valore a destra.
- [media] imp-musica__tab-light.png — non è detto quali link si accettano finché non si legge la nota in fondo («…abbonamento di Spotify o di YouTube») — mettere in cima «Incolla un link di Spotify o YouTube (playlist)» come placeholder e didascalia.
- [bassa] imp-musica__tab-light.png — interruttore «Apri all'avvio del timer» spento: grigio chiaro quasi invisibile sul grigio del gruppo — aumentare il contrasto della traccia.
- [bassa] imp-musica__tab-light.png — altezza del foglio diversa da Timer e Aspetto — vedi sopra.

## imp-aspetto__tab-light.png
- [media] imp-aspetto__tab-light.png — «Suoni», «Vibrazione», «Animazioni» dentro «Aspetto» — suoni e vibrazione non sono aspetto — rinominare la pagina «Aspetto e feedback» o spostarli in un gruppo «Suoni e vibrazione».
- [media] imp-aspetto__tab-light.png — foglio che parte a y=723 — terza altezza diversa per le sottopagine (Timer 423, Musica 123, Aspetto 723), metà superiore occupata dal profilo oscurato — altezza fissa.
- [bassa] imp-aspetto__tab-light.png — interruttori verdi (stile iOS) mentre il colore attivo dell'app è viola — usare il colore primario.
- [bassa] imp-aspetto__tab-light.png — controllo segmentato «Auto / Chiaro / Scuro» dentro un gruppo grigio con titolo «Tema» e ombra sotto il segmento attivo che sborda — togliere l'ombra, mettere «Tema» come etichetta di riga.
- [bassa] imp-aspetto__tab-light.png — icona campanella per «Suoni» (è l'icona dei promemoria) — icona altoparlante.

## aree__tab-light.png
- [media] aree__tab-light.png — ogni riga ha cestino + interruttore affiancati — due modi di "togliere" un'area (disattivare vs eliminare) senza spiegazione, cestino piccolo a 30px dall'interruttore: rischio di tocco sbagliato — interruttore visibile, eliminazione in un menu/scorrimento con conferma; didascalia «Le aree spente non compaiono nelle liste».
- [media] aree__tab-light.png — non si può cambiare nome, colore, icona né ordine — righe toccabili verso un dettaglio, maniglie di riordino.
- [bassa] aree__tab-light.png — riga «Nuova area» con «Aggiungi» testuale, altrove «+ Aggiungi» è un pulsante pillola lilla — stesso componente.
- [bassa] aree__tab-light.png — interruttori verdi, colore primario viola — uniformare.
- [bassa] aree__tab-light.png — nessun titolo di ritorno/chiusura e il foglio è alto a metà; i nomi «Progetti Founder» mischiano inglese e italiano (dato utente, ok) — aggiungere «Fine».

## sonno-pasti__tab-light.png
- [alta] sonno-pasti__tab-light.png — tutti gli orari in formato 12 ore (11:30 PM, 07:30 AM, 08:00 AM, 01:00 PM, 05:00 AM – 02:00 PM, 07:00 PM) mentre il riepilogo nel Profilo dice «23:30–07:30» — 24 ore.
- [media] sonno-pasti__tab-light.png — «Promemoria nell'app · Sonno · Tra le 05:00 AM – 02:00 PM» — non si capisce cosa succede in quella fascia (promemoria per registrare il sonno?); «Pasti · Alle 07:00 PM» un solo orario per tutti i pasti — didascalie esplicite («Ti chiediamo come hai dormito tra le 5 e le 14»).
- [media] sonno-pasti__tab-light.png — pulsante «Salva» esplicito, mentre Aree/Timer/Musica/Aspetto salvano da soli — un solo modello (salvataggio automatico) per tutte le impostazioni.
- [media] sonno-pasti__tab-light.png — stessa modifica disponibile in tre posti con interfacce diverse (pannello in La giornata con select nativi e cestini, rituale con sì/no, qui con chip e «×») — un unico editor riusato.
- [bassa] sonno-pasti__tab-light.png — «Durata 8h» in grigio, sembra disabilitato; «8h» senza spazio — «8 h» con colore normale come valore calcolato.
- [bassa] sonno-pasti__tab-light.png — righe secondarie «Tra le», «Alle» rientrate di 16px e grigie — gerarchia ok ma il trattino «–» fra due chip è minuscolo — usare «dalle … alle …».

## promemoria__tab-light.png
- [media] promemoria__tab-light.png — avviso «Bloccati» — card arancio larga 340px in un foglio da 600px, con ombra e titolo centrato mentre il testo è centrato in un blocco allineato a sinistra: fluttua, non allineata ai gruppi — banner a tutta larghezza del contenuto, allineato a sinistra, titolo «Notifiche bloccate».
- [alta] promemoria__tab-light.png — orari «08:30 AM», «01:00 PM», «04:30 PM», «09:30 PM», «11:00 PM – 07:00 AM» — formato 12 ore — 24 ore.
- [media] promemoria__tab-light.png — interruttori disabilitati grigi con pallino a destra — sembrano accesi-ma-grigi: stato ambiguo — mostrare lo stato reale attenuato o nasconderli con un'unica riga «Attiva le notifiche per configurarle».
- [media] promemoria__tab-light.png — «Server · da collegare» — voce tecnica incomprensibile per l'utente — spiegare («Notifiche anche ad app chiusa: richiede…») o nascondere.
- [bassa] promemoria__tab-light.png — «Priorità del giorno» come promemoria separato da «Piano del giorno» — non chiaro cosa differenzi i due — nome esplicito («Controllo priorità del pomeriggio»).
- [bassa] promemoria__tab-light.png — «Non disturbare · Attivo» attivo anche se le notifiche sono bloccate — disabilitarlo coerentemente.

## diario__tab-light.png
- [alta] diario__tab-light.png — barra in basso — è evidenziato «Andamento» anche se al Diario si arriva da Profilo («‹ Profilo»); il Diario è una pagina intera mentre le altre voci del Profilo si aprono come fogli — navigazione incoerente: stessa modalità per tutte le voci, voce attiva corretta.
- [alta] diario__tab-light.png — pulsante «↶ Annulla» su ogni riga (≥15 pulsanti 82×44) — rumore enorme, e annullare azioni di ieri con un tocco è rischioso — azione nascosta in un menu/scorrimento o solo per le ultime azioni recenti.
- [media] diario__tab-light.png — orario a destra dopo il pulsante — l'ora andrebbe a sinistra come in un registro; ora è staccata e allineata male rispetto al testo (es. Check-in: testo a y=382, pulsante a 393) — colonna ora a sinistra, azioni a destra.
- [media] diario__tab-light.png — select «Relazioni & Sociale ˅» dentro le righe del registro, a volte preceduto da «Priorità», a volte da un'icona — controlli di modifica dentro uno storico confondono e sono incoerenti — mostrare l'area come etichetta; modifica nel dettaglio.
- [media] diario__tab-light.png — controllo «Cose importanti / Tutto» — piccolo, in alto a sinistra dentro la card, con ombra del segmento attivo che sborda — spostarlo nell'intestazione accanto al titolo, senza ombra.
- [bassa] diario__tab-light.png — «Annotato · …» — verbo poco chiaro (è un'idea messa in «Da sistemare») — «Aggiunto a Da sistemare».
- [bassa] diario__tab-light.png — «focus 5» nei check-in, altrove «concentrazione» — stesso termine.
- [media] diario__tab-light.png — card unica lunghissima che contiene tutti i giorni — su tablet colonna più stretta (≈640) o separare i giorni in card con intestazione fissa.

## timer-scelta__tab-light.png
- [media] timer-scelta__tab-light.png — opzioni «Avvio rapido 5 min / Sessione 25 min / Pomodoro 25 + 5 min / Cronometro nessun limite» — nessuna descrizione: la differenza fra Avvio rapido e Sessione non è chiara — una riga di sottotitolo per ognuna («5 minuti per rompere il ghiaccio», ecc.).
- [bassa] timer-scelta__tab-light.png — icone in riquadri bianchi bordati 44px attaccati al bordo sinistro (padding 12px) — sembrano pulsanti dentro il pulsante — icona semplice o riquadro senza bordo, padding 16px.
- [bassa] timer-scelta__tab-light.png — manca «Annulla»; il foglio da 640px tocca il fondo dello schermo — popover ancorato al pulsante «Timer» su tablet.
- [bassa] timer-scelta__tab-light.png — «nessun limite» minuscolo, valori grigi piccoli a 4px dal bordo destro del gruppo — più padding a destra (16px).

## timer-concentrazione__tab-light.png
- [alta] timer-concentrazione__tab-light.png — «‖ Termina» — icona di pausa con etichetta «Termina»: non si capisce se mette in pausa o chiude la sessione; e manca un vero comando Pausa — due comandi distinti: «Pausa» (‖) e «Termina» (■) con conferma.
- [media] timer-concentrazione__tab-light.png — «Pomodoro · blocco 1» — «blocco» gergale e senza totale — «Sessione 1 di 4».
- [bassa] timer-concentrazione__tab-light.png — pulsante di chiusura «×» a 12px dagli angoli — troppo vicino al bordo per tablet; margine 24px come il resto.
- [bassa] timer-concentrazione__tab-light.png — anello quadrato-arrotondato grigio scuro quasi invisibile su nero, nessun progresso colorato — contrasto maggiore e progresso visibile fin dall'inizio.
- [bassa] timer-concentrazione__tab-light.png — azioni secondarie «Termina», «Cambia timer» 13px grigie su nero — contrasto basso — almeno 15px, grigio più chiaro.

## cattura__tab-light.png
- [media] cattura__tab-light.png — popup «Scrivi un pensiero…» — non dice dove finirà il pensiero (va in «Da sistemare»?) — sottotitolo «Finisce in Da sistemare, lo smisti dopo».
- [media] cattura__tab-light.png — «Chiudi» in una seconda riga, piccolo link a destra sotto un divisore: riga intera sprecata per un'azione — «Annulla» a sinistra e «Salva» a destra nella stessa barra, o chiusura toccando fuori/Esc.
- [bassa] cattura__tab-light.png — «Salva» pieno e attivo anche con campo vuoto — disabilitarlo finché non c'è testo.
- [bassa] cattura__tab-light.png — sfocatura pesantissima dello sfondo (non si legge più nulla) per un campo di una riga — oscuramento leggero, senza blur forte.
- [bassa] cattura__tab-light.png — icona fulmine senza significato chiaro — icona penna/lampadina o niente.

## menu-oggi-avatar__tab-light.png
- [alta] menu-oggi-avatar__tab-light.png — il tocco sull'avatar porta a una pagina Profilo identica a una scheda principale, senza titolo, senza «Indietro/Chiudi» e senza voce attiva nella barra: l'utente perde l'orientamento — aprire il Profilo come foglio/pannello con «Chiudi», o pagina con freccia indietro e titolo.
- [bassa] menu-oggi-avatar__tab-light.png — scompare anche il selettore Adesso/La giornata/Rituali: transizione brusca — mantenere l'intestazione coerente.
- [bassa] menu-oggi-avatar__tab-light.png — per il resto stessi difetti di profilo__tab-light.png.

## trascinamento-in-corso__tab-light.png
- [media] trascinamento-in-corso__tab-light.png — banner «Dati di esempio · Rimuovi ×» in cima — compare qui ma non nelle altre schermate, spostando tutto 60px più in basso; banner viola tenue con «Rimuovi» e «×» vicini (chiudi vs elimina dati: ambiguo) — comportamento costante; distinguere «Nascondi avviso» da «Elimina dati di esempio» (con conferma).
- [media] trascinamento-in-corso__tab-light.png — anteprima di trascinamento — la bolla «Organizzare cena… alle 12:45» sta 80px sopra il rettangolo di destinazione 12:45–14:15, staccata; il rettangolo copre «Pranzo» senza segnalare la sovrapposizione — bolla agganciata al rettangolo, avviso visivo «si sovrappone a Pranzo».
- [media] trascinamento-in-corso__tab-light.png — testo «12:45–14:15» nel rettangolo sovrapposto al bordo superiore di Pranzo — leggibilità scarsa — etichetta dentro con sfondo.
- [media] trascinamento-in-corso__tab-light.png — zona di rilascio «Togli l'orario» — copre la riga 18:00 e sta a 16px dalla barra di navigazione; bordo tratteggiato largo quanto lo schermo — più evidente (colore) e lasciando visibile il calendario, oppure nella colonna laterale su tablet.
- [bassa] trascinamento-in-corso__tab-light.png — scorrimento automatico non visibile: verso le ore serali bisogna trascinare sotto la zona di rilascio — prevedere autoscroll ai bordi.

## Riassunto

Esaminati tutti i 44 screenshot tablet (834×1112, tema chiaro).

### 1. Formati di data/ora non italiani (alta)
- Orari in formato 12 ore AM/PM in tutti i campi modificabili: pannello sonno in La giornata, schede di attività e abitudini nel calendario, rituale Sonno e pasti, Profilo › Sonno e pasti, Promemoria, scheda abitudine. Intanto i riepiloghi usano le 24 ore («23:30–07:30»), quindi i due formati compaiono nella stessa schermata.
- Data americana «07/29/2026» nella scheda abitudine.
- Errori di testo: «Giovedi» senza accento, «Ora · Nessuno» (va al femminile), «un‘altra» con l'apostrofo sbagliato, «Ago» con la maiuscola.
- Correzione: formattatore unico it-IT a 24 ore, controlli ora/data personalizzati.

### 2. Layout da telefono stirato sul tablet (alta)
- Tutte le schermate sono una sola colonna larga 760px.
  - Pulsanti larghi quanto lo schermo («Fatto», «Salva +XP», «Registra»).
  - Righe con il titolo a sinistra e l'azione 500px più a destra.
  - Metà dello schermo vuota in Adesso, Rituali, Da sistemare, Abitudini, Profilo e Scoperte.
- La Settimana è una lista verticale di 7 schede invece di una griglia.
- Proposte:
  - colonna massima di circa 640px, oppure layout a due colonne;
  - Giorno: calendario affiancato a «Senza orario»;
  - Da sistemare: coda e dettaglio;
  - Funziona / Non funziona affiancate;
  - Costanza e Per area affiancate;
  - rituali e Impostazioni a due pannelli.
- I fogli dal basso (schede, Impostazioni, Timer) vanno aperti come popover o fogli centrati.

### 3. Barra di navigazione e margini incoerenti (alta)
- In Mese e Anno la barra in basso è spostata e tagliata dal bordo (il «+» esce dallo schermo). Anche i margini della pagina passano da 38px a 16px.
- La barra copre i contenuti (Cena, grafico del check-in, pannello Fine giornata) perché manca il padding inferiore.
- Profilo (dall'avatar): niente titolo, niente «Indietro» e nessuna voce attiva nella barra. Il Diario, che si apre da Profilo, evidenzia «Andamento».
- Le voci del Profilo si aprono in modi diversi: alcune come fogli, il Diario come pagina.
- I fogli non hanno «Chiudi/Fine». Hanno altezze diverse fra un livello e l'altro (Timer 423, Musica 123, Aspetto 723) e niente padding inferiore («Elimina» tocca il fondo).

### 4. Stesso componente, aspetto diverso (media)
- **Spunta / completamento:** casella da 44px in Adesso e nei Passi, da 24px in Senza orario, cerchio a destra in Abitudini, quadratino colorato in Mese, nessuna casella in Da fare.
- **«Fatto»:** verde in Adesso e nel timer, «Fatta» viola nelle schede abitudine.
- **Pulsanti primari:** nei rituali sono tre (pieno, tenue con bordo, «Fatto» senza XP), con icone diverse (dischetto, luna).
- **Selettori a schede:** tre stili (principale, Giorno/Settimana con icone, Registro/Esperimenti).
- **Select nativi** grigi con il testo troncato («15 mir», «45 mi») accanto a chip personalizzati. Interruttori verdi in un'app viola.
- **Indicatori di area:** pallino, icona, chip verde o chip lilla secondo la schermata.
- **Blocchi nel calendario:** stile diverso per attività (sfondo pieno), abitudini (solo contorno), pasti (centrati, altezze diverse) e sonno (tratteggio senza etichetta).
- **Valori nelle impostazioni:** maiuscole e minuscole miste, frecce › e ˅ mescolate.

### 5. Numeri e simboli senza spiegazione (media)
- «1/2», «🔥38», «65% 81 di 124», «1 di 3», numeri verdi sui mesi dell'Anno, «4 record».
- Anelli, puntini e mappe di calore senza legenda; verde nell'Anno, blu in Costanza.
- Contatori che non tornano:
  - «Rituali 1», mentre ci sono 4 rituali in sospeso;
  - Adesso «1/2» contro Abitudini «0 di 3»;
  - fatte: 58 (Mese), 82 (Anno), 109 (Profilo), 81 (Andamento), sempre senza periodo;
  - serie di 38 giorni con un venerdì vuoto.
- Gergo: XP, «d≈3,1», «blocco 1», «Server da collegare», «Registro tecnico», «Distribuisci i passi», «Sposta in Da fare», «Ritmo di base», «Non completata».
- Lo stesso concetto ha nomi diversi: focus / concentrazione; fatte / cose fatte / azioni completate / riuscita.

### 6. Azioni poco chiare o rischiose (media/alta)
- Diario: un pulsante «Annulla» su ogni riga, anche per le azioni di ieri (più di 15 pulsanti).
- Aree: cestino accanto all'interruttore. Impostazioni: «Cancella tutti i dati» nello stesso gruppo di «Rimuovi dati di esempio».
- Timer: icona di pausa con l'etichetta «Termina», e manca un vero comando Pausa.
- Sonno e pasti nel rituale: due salvataggi diversi («Salva» e «Fatto»). Check-in già fatto ma con «Registra +3 XP» ancora attivo.
- Più campi «Nuova attività» che duplicano il «+» globale. Le opzioni di inserimento non permettono di segnare «Importante» e scelgono un'area predefinita arbitraria.
- L'editor di sonno e pasti esiste in tre posti con tre interfacce diverse.
- Trascinamento: la bolla è staccata dall'anteprima, la sovrapposizione con Pranzo non viene segnalata e la zona «Togli l'orario» copre il calendario. Il banner «Dati di esempio» compare solo in alcune schermate.

### 7. Dettagli visivi (bassa/media)
- Titoli dei fogli che vanno a capo a circa 300px pur avendo 600px disponibili.
- Riquadri dentro riquadri (foglio > gruppo grigio > chip bianchi).
- Etichette di sezione da 13px grigie e troppo deboli.
- Numeri in serif solo nel Bilancio della settimana.
- Pulsanti selezionati del check-in che crescono e escono dalla griglia.
- Etichette «media» del grafico sovrapposte ai punti.
- Textarea con la maniglia di ridimensionamento visibile e senza placeholder.
- Campi Musica quasi invisibili (grigio su grigio).
- Avviso «Bloccati» largo metà e non allineato al resto.
