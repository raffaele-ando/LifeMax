# Verifica 2 — sincronizzazione, account e calendari (25 novembre 2026)

Seconda verifica, sul commit **`1548c72`** (le correzioni del 25 novembre sono nel commit `4522b6f`).
Domanda: «provate ogni situazione possibile, su 3 o più dispositivi, compresi i calendari di Google e Microsoft».

**Come è stato provato**
- **Firebase vero, in piccolo**: la stessa libreria del sito (12.16.0) collegata all'emulatore ufficiale di Firebase (Auth + Firestore) con le regole vere di `firestore.rules`. Il progetto di produzione non è stato toccato.
- **I «dispositivi»** sono browser separati, ognuno con la sua memoria, il suo orologio e il suo fuso: iPhone 13, Pixel 7 (Android), iPad, PC Windows, Mac, a volte due schede dello stesso browser. Il motore è sempre Chromium: Safari (WebKit) e Firefox **non sono installati** su questa macchina (in `/opt/pw-browsers` c'è solo Chromium). Il comportamento di Safari (cancellazione dopo 7 giorni, popup, redirect) è **imitato**, non provato davvero.
- **La sentinella dei calendari** (il Worker `lifemax` con i Durable Object) è il codice vero del commit, fatto girare con un Google, un Microsoft e un Firebase finti (`prove/comune/sentinella-finta.js`). Nessuna richiesta è uscita verso Google, Microsoft o Firebase veri: in ogni browser tutti quegli indirizzi sono bloccati e contati (nei `risultati/*.json` il campo `bloccati`).
- **Produzione**: solo letture `GET` di pagine pubbliche e di `/api/calendari/stato` (senza accesso), per sapere cosa è acceso davvero.

**Cosa c'è in questa cartella**
- `script/`: tutti i riproduttori. `lib.js` è il banco comune; `r1/` sono i 19 riproduttori del primo giro, adattati alla forma nuova dei dati; `n01`–`n09` e `c01`–`c02` sono quelli nuovi.
- `risultati/`: l'esito di ogni prova in JSON (un file per script).
- `schermate/`: le foto (scala 1).
- In fondo: come rilanciarli.

---

## 1. In breve

Le correzioni del primo giro **tengono**: tutti i quindici problemi di allora, provati di nuovo con i loro riproduttori, non si ripresentano nella forma di allora (tabella al capitolo 4). Il cloud ora regge bene molti dispositivi, offline, orologi un po' sbagliati, anni di dati, versioni vecchie dell'app.

Ma ci sono **due problemi critici nuovi**, e qualche grave:

1. **I dati di una persona restano sul dispositivo condiviso dopo «Esci», e un'altra persona li può riprendere e farli finire nel SUO account.** La strada è il pannello «Backup e ripristino»: all'uscita l'app fa una copia di sicurezza di tutto, e quella copia la vede e la ripristina chiunque usi poi quel browser. È di nuovo la «fuga fra account» del primo giro, per un'altra porta. (confermato)
2. **Qualcuno può collegare il TUO calendario Google al SUO LifeMax** mandandoti un link sul dominio vero di LifeMax: se dici «sì» a Google, lui legge e scrive il tuo calendario. La protezione che il codice dichiara (il «biscotto del legame») non la ferma. La sentinella è **accesa in produzione** (`/api/calendari/stato` risponde `google: true, microsoft: true`). (confermato)
3. **Due modifiche diverse alla stessa cosa, fatte su due dispositivi, non si sommano: una sparisce.** Esempio: rinomini un'azione sul telefono senza rete, poi la spunti sul PC: il nome nuovo si perde, ovunque. Succede anche col calendario (titolo cambiato in Google + «fatta» in LifeMax). (confermato)
4. **Un solo errore di Google su una modifica blocca il calendario per sette giorni**, e il pannello intanto dice «Tutto allineato». (confermato)
5. **Senza rete l'app non si apre proprio** (metropolitana, aereo): compare la pagina d'errore del browser, anche se i dati sono tutti nel telefono. (confermato su Chromium; su iPhone non provato)

Fra i medi, da sapere subito: una scheda rimasta aperta con la versione vecchia dell'app non riceve più niente (M5); un dispositivo con l'orologio molto sbagliato fa tornare indietro le modifiche (M7); il controllo scritto nelle istruzioni per accendere l'accesso da iPhone non può passare (M4).

Tutti i problemi, dal più grave, sono nel capitolo 3; il capitolo 2 è la tabella di tutto quello che è stato provato.

---

## 2. Tabella degli scenari provati

Legenda esito: **OK** = funziona; **PROBLEMA** = rimanda a un problema del capitolo 3; **NOTA** = comportamento da sapere, non un errore; **NON PROVATO** = vedi capitolo 5. Tutte le righe sono state eseguite da uno script, salvo dove è scritto «lettura del codice».

I conti: **96 scenari**, da **30 script** (19 del primo giro rilanciati, 11 nuovi), **278 controlli** registrati in 27 file di `risultati/` (più `r1/r01` e `r1/s01`, che scrivono solo a schermo: `risultati/log/`). Ogni controllo ha i suoi dati nel JSON.

| # | Area | Scenario (dispositivi) | Script · caso | Esito |
|---|---|---|---|---|
| 1 | Utente nuovo | Primo avvio: benvenuto; primo accesso crea il cloud; secondo dispositivo entra (Android + PC) | `n05` F1, `r1/s04` 4.1a | OK |
| 2 | Utente nuovo | Ospite con dati che poi accede: i dati salgono nell'account | `r1/s04` 4.1b | OK |
| 3 | Utente nuovo | Ospite con dati che entra in un account che ha già dati (iPad): unione senza domande | `r1/s04` 4.2b | NOTA (voluto) |
| 4 | Utente nuovo | Ospite con i dati di ESEMPIO che entra nell'account: l'esempio non sale | `n05` E1 | OK |
| 5 | Utente di mesi | 90 / 180 / 365 / 540 / 730 giorni (fino a 2,2 MB): tutto sincronizzato, PC entra in ~1,5 s | `r1/s05` | OK |
| 6 | Utente di mesi | Un anno di dati, telefono nuovo che entra (22 fette, la più grossa 199 KB, principale 1 KB) | `n06` D1–D2 | OK |
| 7 | iPad fermo | iPad riaperto dopo 45 e dopo 200 giorni: dati vecchi sbiaditi per un attimo, poi uguale al telefono | `r1/s06` (45, 200) | OK (mitigato) |
| 8 | PC sempre aperto | Riceve tutto quello che scrive il telefono, anche dopo che il telefono riapre con cose offline | `r1/r05`, `r1/s01`, `r1/s06` 6.0 | OK |
| 9 | PC sempre aperto | Mezzanotte con l'app aperta: «oggi» cambia, la cosa nuova va nel giorno nuovo | `n04` E1 | OK |
| 10 | PC sempre aperto | …lo schermo si ridisegna da solo a mezzanotte | `n04` E2 | NON VERIFICATO (il controllo guardava l'elemento sbagliato) |
| 11 | PC sempre aperto | Scheda con la versione VECCHIA (`1a85823`) mai ricaricata | `n06` B1–B5, C1–C2; `r1/s08` 8.0–8.1 | PROBLEMA M5 (non riceve, nessun avviso; ma non distrugge niente: OK) |
| 12 | Formato vecchio | Account usato solo con la versione a documento unico → primo accesso con la nuova: passaggio ai pezzi, copia «prima di dividere», niente perso | `n06` A0–A2 | OK |
| 13 | Dispositivo condiviso | «Esci» poi ospite: copia «all'uscita dall'account» nei Backup, ripristinabile dall'interfaccia | `n01` A2, B1; `n01b` | PROBLEMA C1 |
| 14 | Dispositivo condiviso | Ospite ripristina, poi accede: i dati di Mario nell'account di Luigi | `n01` C1 | PROBLEMA C1 |
| 15 | Dispositivo condiviso | Luigi già dentro ripristina la copia di Mario | `n01` D1 | PROBLEMA C1 |
| 16 | Dispositivo condiviso | Sessione chiusa dal server: copia dei dati nei Backup | `n01` E1–E2 | PROBLEMA C1 (lo schermo si svuota: OK) |
| 17 | Dispositivo condiviso | Mario e Luigi si alternano 3 volte: ognuno vede e ha nel cloud solo le sue cose | `n01` F1 | OK (ma 7 copie nei Backup: C1) |
| 18 | Dispositivo condiviso | «Esci» con il cloud irraggiungibile, poi entra Luigi | `n01` G0–G1 | PROBLEMA M1 |
| 19 | Dispositivo condiviso | Sessione chiusa dal server, poi entra Luigi: niente dati di Mario | `r1/r04` | OK |
| 20 | Due schede | «Esci» in una: l'altra esce e non riscrive | `r1/r04` b, `r1/s04` 4.6 | OK |
| 21 | Due schede | Modifica non ancora partita nella scheda A, «Esci» nella scheda B | `n02` K | OK |
| 22 | Due schede | Nella scheda B entra un altro account | `n02` L | NOTA m7 |
| 23 | Accesso | Popup bloccato → redirect | `n02` A, `r1/s08` 8.9 | OK |
| 24 | Accesso | Popup chiuso subito dall'utente | `n02` B | PROBLEMA m1 |
| 25 | Accesso | Popup chiuso dopo 3 s; dominio non autorizzato; niente rete; errore sconosciuto | `n02` B2, C, D, D2 | OK (messaggi in italiano semplice) |
| 26 | Accesso | Account disabilitato a metà uso, con una modifica non ancora salita: avviso, messa da parte, ritorna al rientro | `n02` E1–E2 | OK |
| 27 | Accesso | Account cancellato sul server | `n02` F | NOTA m8 (emulatore: sessione non chiusa) |
| 28 | Accesso | Biscotti cancellati / sessione Google scaduta | `n02` G | OK (LifeMax resta dentro) |
| 29 | Accesso | Solo `localStorage` cancellato | `n02` H1–H2; `r1/s09` 9.1 | OK dopo il rientro (9.1 rosso perché supponeva la sessione ancora valida: ora la sessione sta lì) |
| 30 | Accesso | Modifica offline e poi memoria cancellata | `n02` H3 | NOTA m6 (persa) |
| 31 | Accesso | iPhone svuotato da Safari (7 giorni) / PWA reinstallata: rientra, profilo intatto | `n02` I, `r1/s09` 9.2 | OK |
| 32 | Accesso | Due indirizzi (github.io e dominio): dati separati, profilo non azzerato, vecchio segnalibro dopo 3 settimane non riporta indietro | `r1/s11` | OK |
| 33 | Accesso | iPhone con l'interruttore `ACCESSO_DAL_DOMINIO` | produzione `GET` | PROBLEMA M4; NON PROVATO su iPhone |
| 34 | Uscita | «Esci» online, rientro, dati tornano | `r1/s04` 4.3 | OK |
| 35 | Uscita | «Esci» senza rete: esce, la modifica parte al ritorno della rete | `r1/s04` 4.4 | OK |
| 36 | Rete | Tre dispositivi, due offline, ritorno in ordine inverso: tutti uguali | `n03` A1, `r1/s03` 3.6 | OK |
| 37 | Rete | Cancellata offline vs modificata dopo (e viceversa) | `n03` A3–A4, `r1/s03` 3.3–3.4 | OK |
| 38 | Rete | Due modifiche a campi diversi della stessa cosa | `n03` A2, `n04` F2 | PROBLEMA G1 |
| 39 | Rete | Stessa cosa creata offline su due dispositivi: due righe | `r1/s03` 3.5 | NOTA |
| 40 | Rete | Rete ballerina (40% delle richieste perse) | `n03` C1 | OK |
| 41 | Rete | Rete lenta (3 s per richiesta) | `n03` D1 | OK |
| 42 | Rete | Pagina uccisa a metà transazione (crash del renderer) | `n03` E1–E2 | OK (cloud integro, la modifica parte riaprendo) |
| 43 | Rete | App chiusa subito dopo una modifica (telefono; PC con Firestore lento: «cassetta delle lettere») | `n03` F1–F2, `r1/s08` 8.4–8.4b | OK |
| 44 | Rete | Permesso negato dalle regole, poi tornate | `n03` G1–G2, `r1/s08` 8.6 | OK (riparte in 12 s) |
| 45 | Rete | Cloud muto (online ma Firestore non risponde) | `n03` I1 | OK (dice «Il cloud non risponde») |
| 46 | Rete | …quando il cloud torna, la modifica arriva senza ricaricare | `n03` I2 | NON CHIARO (non arrivata in 90 s, ma le richieste «appese» della prova non si chiudono mai come farebbe una rete vera: da verificare) |
| 47 | Rete | Firebase bloccato (rete aziendale), memoria bloccata | `r1/s08` 8.7–8.8 | OK |
| 48 | Rete | Memoria piena | `r1/s08` 8.5 | OK sui dati; avviso NON VERIFICATO |
| 49 | Rete | Riaprire l'app senza rete | `n09` A1 | PROBLEMA G3 |
| 50 | Rete | SDK di Firebase non caricato all'apertura | `n09` B1–C2 | PROBLEMA M6 |
| 51 | Orologi | Orologio −2 min, +3 h (misurati) | `r1/s03` 3.7–3.8, `n04` A1, A3 | OK |
| 52 | Orologi | +3 h aperto col cloud irraggiungibile | `n04` A2 | PROBLEMA M7 |
| 53 | Orologi | Data al 2001; anno +2 | `n08` | PROBLEMA M7 |
| 54 | Orologi | Fusi: telefono a New York, PC a Roma | `n04` C1–C2 | NOTA (l'abitudine spuntata la sera a New York è «ieri» per Roma; gli orari restano «da muro») |
| 55 | Orologi | Ora legale (marzo e ottobre) | `n04` D1 | OK |
| 56 | Orologi | Giorni passati, futuri, altro trimestre; riga che cambia trimestre | `n04` F1–F3 | OK (F2 tocca G1) |
| 57 | Funzioni | 37 funzioni una dopo l'altra su 3 dispositivi (azioni, inbox, progetti e passi, abitudini, aree, check-in, voti, rituali, review, ritmo, timer, sessioni, lezioni, esperimenti, promemoria, tema) | `r1/s02` | OK (3 rossi sono solo l'ordine delle chiavi nel confronto: contenuto identico) |
| 58 | Funzioni | Annullare (spunte, area, orari, punti) su un dispositivo | `r1/r02` | OK |
| 59 | Funzioni | Annullare un check-in dal Diario su un altro dispositivo | `n05` D1 | OK |
| 60 | Funzioni | Punti guadagnati offline su due dispositivi si sommano | `r1/s03` 3.9 | OK |
| 61 | Funzioni | «Azzera tutto» con account | `r1/s08` 8.2, `n05` A1 | OK |
| 62 | Funzioni | «Azzera tutto» e una cosa scritta offline prima | `n05` A2 | PROBLEMA M8 |
| 63 | Funzioni | Ripristino di un backup locale: torna su tutti | `n05` B1 | OK |
| 64 | Funzioni | «Riprendi il profilo» da una copia nel cloud lo stesso giorno | `n05` C1 | NOTA m11 (non c'è una copia col profilo buono: una al giorno) |
| 65 | Funzioni | «Sostituisci» con una copia nel cloud | `n05` G1 | OK |
| 66 | Funzioni | Copie nel cloud: si elencano senza scaricarle | `r1/s10` | OK |
| 67 | Funzioni | Importazione di un file durante la sincronizzazione | `r1/s08` 8.3 | OK |
| 68 | Funzioni | Dati di esempio con l'account collegato: non si caricano | lettura del codice (`app.ts` `caricaDemo`) | OK |
| 69 | Trasloco | «Porta i miei dati» da github.io: unione, nome recente non sostituito, due volte senza doppioni, finestra bloccata → file | `n07` A0–C1, E1 | OK |
| 70 | Trasloco | Con l'account senza rete: non si va finché il cloud non ha tutto | `n07` F1 | OK |
| 71 | Trasloco | I dati dell'ospite di github.io entrano nell'account collegato sul nuovo indirizzo senza domande; la proposta ritorna a ogni visita | `n07` C2, D1 | NOTA |
| 72 | Calendari | Collegare Google dalla sentinella, importare, fantasma a 300 giorni | `c02` 1.1–1.2 | OK |
| 73 | Calendari | Tutto il giorno su più giorni; ricorrenza (sposto UNA occorrenza) | `c02` 4.1–4.3 | OK |
| 74 | Calendari | Cambiato qui e là insieme: vince il calendario, il Diario lo dice | `c02` 2.1 | OK |
| 75 | Calendari | Cancellato in Google: non fatta sparisce, fatta resta staccata | `c02` 3.1, `r1/s07` C4 | OK |
| 76 | Calendari | Tolto in LifeMax su un dispositivo non collegato | `r1/s07` C5 | OK |
| 77 | Calendari | Tre dispositivi, strada del browser: niente doppioni, «Collegato su un altro dispositivo» | `r1/s07` C1–C3 | OK |
| 78 | Calendari | «Fatta» sul telefono + titolo cambiato in Google letto da un altro dispositivo | `r1/s07` C6 | PROBLEMA M9 / G1 |
| 79 | Calendari | Google rifiuta una modifica una volta | `c02` 5.1 | PROBLEMA G2 |
| 80 | Calendari | Permesso scaduto (7 giorni «In prova») o revocato: «Ricollega», la modifica resta in coda; dopo «Ricollega» riparte | `c01` F1–F2, `c02` 6.1–6.2 | OK |
| 81 | Calendari | Chiave dei permessi cambiata | `c01` E, `c02` 7.1 | PROBLEMA M2 |
| 82 | Calendari | Mario esce: specchio del calendario nel browser; fantasmi all'ospite | `c02` 8.1–8.2 | PROBLEMA M3 (fantasmi: OK, non si vedono) |
| 83 | Calendari | Entra Luigi: niente calendario di Mario a schermo | `c02` 9.1 | OK a schermo; M3 nella memoria |
| 84 | Calendari | Segreti mancanti (uno per uno, tutti, chiave troppo corta) | `c01` G | OK («non configurato», niente si rompe) |
| 85 | Calendari | Spento su un dispositivo e riacceso su un altro | `c01` J1 | OK |
| 86 | Sentinella | Collegamento cominciato da un altro (link mandato alla vittima) | `c01` A1–A6 | PROBLEMA C2 |
| 87 | Sentinella | Gettone di un altro, `x-lm-uid` falsa, uid nel corpo, gettone dal futuro, uid lungo, cancellare senza collegamento | `c01` B1–B6 | OK |
| 88 | Sentinella | `/vai` e `/ritorno`: riusati, senza biscotto, id inventato, malformato, Google↔Microsoft, dopo 11 minuti, ritorno verso siti estranei | `c01` C1–C10 | OK |
| 89 | Sentinella | Due collegamenti insieme | `c01` D1 | PROBLEMA m5 |
| 90 | Sentinella | Il cron con più di 40 persone | `c01` I1 | PROBLEMA m2 |
| 91 | Sentinella | Proxy `/__/auth`: cosa inoltra; niente traversata fuori da `/__/auth` | `c01` H1–H3 | PROBLEMA m4 (traversata: OK) |
| 92 | Produzione | `GET /api/calendari/stato` → `{"google":true,"microsoft":true}`; CORS solo per l'app (`evil.example` senza intestazioni) | `curl` | Sentinella ACCESA in produzione; CORS OK |
| 93 | Produzione | File che non devono essere pubblici: `/src/…`, `/sentinella/…`, `/wrangler.jsonc`, `/firestore.rules`, `/revisione/…`, `/prove/…`, `/.git/HEAD`, `/.git/config`, `/package.json`, `/pacco/*.map`, `/node_modules/…` | `curl` | OK (tutti rispondono con la pagina dell'app, nessun file vero) |
| 94 | Produzione | `/__/auth/handler` 200; `/__/firebase/init.json` 404 «Site Not Found» | `curl` | PROBLEMA M4 |
| 95 | Produzione | github.io e dominio servono lo stesso pacchetto (`index-DexDarKa.js`) del commit `1548c72` | `curl` | OK |
| 96 | Isolamento | Nessuna richiesta verso Google/Microsoft/Firebase veri: bloccate solo `www.google.com/images` e `apis.google.com/js` (caricate dalla pagina e dall'SDK), mai le API | tutti (`bloccati`) | OK |

---

## 3. I problemi, dal più grave

Per ognuno: cosa vede chi usa l'app, i passi per riprodurlo, la causa (file:riga del commit `1548c72`), la correzione suggerita, lo script. **Confermato** = riprodotto da uno script; **sospetto** = letto nel codice, non riprodotto.

### CRITICO

#### C1. Dopo «Esci» i dati restano nel browser, e un'altra persona li riprende e li porta nel suo account — **confermato**

**Cosa vede chi usa l'app.** Mario usa il PC di casa, poi tocca «Esci»: lo schermo si svuota, sembra tutto a posto. Luigi (o un ospite) apre LifeMax sullo stesso browser, va in Impostazioni → «Backup e ripristino» e trova, fra le copie «Su questo dispositivo», una voce **«all'uscita dall'account»** con il conto degli elementi. Tocca «Ripristina»: ricompaiono le azioni, il diario, le review della sera, il nome di Mario. Se poi Luigi accede col suo Google — o se era già dentro — tutto questo **sale nell'account di Luigi** e da lì su tutti i suoi dispositivi. È la «fuga fra account» del primo giro, rientrata da un'altra porta.

Succede uguale quando la sessione la chiude il server (account disabilitato, sessione revocata o scaduta): l'app svuota lo schermo, mostra «La sessione è finita», ma la copia completa finisce nei backup locali. Dopo tre giri Mario/Luigi sullo stesso PC le copie «all'uscita» sono sette, con i dati di tutti e due.

Oltre ai backup, dopo «Esci» restano nel browser: un «punto di ritorno» con lo stato di prima (`lifemax.annulla.p.*`), e la copia del calendario della sentinella (`lifemax.calendari.specchio`: i titoli di tutti gli eventi fino a 13 mesi avanti, vedi M3).

**Passi.**
1. PC, browser qualunque. Mario accede, scrive «Visita dallo psichiatra», compila la review della sera, mette il suo nome.
2. Mario tocca «Esci».
3. Luigi, sullo stesso browser, senza accedere: Impostazioni → Backup e ripristino → la riga «… · all'uscita dall'account» → Ripristina. Vede tutto di Mario (schermate `n01b-1-ospite-vede-backup-di-mario.png` e `n01b-2-ospite-ha-ripristinato-i-dati-di-mario.png`, fatte toccando i tasti dell'interfaccia).
4. Luigi accede con il suo Google: nel cloud di Luigi ora ci sono l'azione privata di Mario e il nome «Mario Rossi».

Variante (D1): Luigi era già dentro quando ripristina → stesso risultato, subito nel suo cloud.

**Causa.**
- `pulito()` (`src/dati/dati.ts:4466-4479`), chiamata da `lasciaAccount()` (`dati.ts:4490`) a ogni «Esci» (`src/nuvola/nuvola.ts:567`), a ogni sessione chiusa dal server (`nuvola.ts:536`) e quando entra un altro account (`nuvola.ts:655`), fa per prima cosa `backup(perche)` (`dati.ts:4468` → `backup()` a `dati.ts:1646`): una copia INTERA dello stato dell'account in `lifemax.backups.v1`.
- I backup locali non hanno un proprietario: `listBackups()` (`dati.ts:1657`) e il pannello (`src/fogli/Backup.tsx:166-185`) li mostrano tutti a chiunque; `restoreBackup()` (`dati.ts:1662`) li rimette e `save()` li manda nel cloud dell'account collegato in quel momento.
- La `save()` dentro `pulito()` lascia anche un punto di ritorno con lo stato di prima (`segnaPunto`, `dati.ts:1237`, chiamata da `save()`).

**Correzione suggerita.**
- All'uscita dall'account NON fare un backup locale dei dati dell'account: quei dati sono già nel cloud, e quello che non lo era va (giustamente) in `mettiDaParte`, che è per account. Se si vuole una rete di sicurezza, una copia per account: `lifemax.backups.<uid>`.
- Dare un proprietario a ogni backup locale (l'uid, o «ospite») e mostrare/ripristinare solo quelli dell'account collegato adesso; quelli di altri account cancellarli all'uscita.
- In `pulito()` chiamare `scordaPunti()` DOPO la `save()`, e togliere `lifemax.calendari.specchio`.

**Script:** `script/n01-dispositivo-condiviso.js` (casi A2, B1, C1, D1, E2, F2), `script/n01b-schermate-backup.js` (dall'interfaccia), `script/c02-calendari-app.js` (8.1, 9.2). Risultati: `risultati/n01-dispositivo-condiviso.json`.

#### C2. Il calendario di un'altra persona collegato al proprio LifeMax (falsificazione del collegamento) — **confermato**

**Cosa vede chi usa l'app.** Niente. Un malintenzionato con un account LifeMax (basta un Google qualunque) comincia il collegamento del calendario dal suo LifeMax, prende il link che l'app gli darebbe (`https://lifemax.theproject.world/api/calendari/google/vai?s=…`, un indirizzo vero di LifeMax) e lo manda alla vittima («apri qui per collegare il calendario»). Se la vittima, entro dieci minuti, apre il link e dice «sì» nella finestra di Google — che è la normale finestra di consenso di LifeMax — il permesso sul **calendario della vittima** finisce nella sentinella **del malintenzionato**. Da quel momento lui vede tutti gli eventi (titoli, orari) da 7 giorni fa a 13 mesi avanti, e può crearne, spostarne, cancellarne. La vittima nel suo LifeMax non vede niente di collegato.

Limite pratico: finché l'app Google è «In prova», la vittima deve essere fra gli utenti di prova (massimo 100); con l'app pubblicata, chiunque. Con Microsoft vale lo stesso.

**Passi** (eseguiti contro il Worker vero del commit):
1. L'attaccante: `POST /api/calendari/google/inizia` con il SUO gettone di Firebase → riceve l'indirizzo `/vai?s=…`. Non lo apre.
2. La vittima (un altro browser, nessun biscotto) apre quell'indirizzo: `/vai` le lascia il biscotto `lmcal_google` col «legame» e la manda da Google.
3. La vittima dice «sì»; Google torna a `/ritorno` con il codice; il biscotto c'è ed è quello giusto → `esito=ok`.
4. L'attaccante chiede `/api/calendari/cambi`: riceve «Visita oncologica (privato)», «Colloquio di lavoro segreto». Con `/scrivi` crea un evento nel calendario della vittima.

**Causa.** Il «legame» (`sentinella/sentinella.mjs:163-175`) prova solo che lo stesso browser è passato da `/vai` e da `/ritorno`, non che quel browser sia quello di chi ha chiamato `/inizia`. `/vai` (`sentinella/worker.mjs:118-128`) non chiede nessuna prova di identità: chiunque abbia il link riceve il biscotto. Il commento del codice dice il contrario («qualcuno potrebbe iniziare un collegamento col SUO account, mandarti il link… Per questo il passaggio da /vai lascia un biscotto»): protegge solo se l'attaccante manda l'indirizzo di Google invece di quello di `/vai`. Anche l'informativa (`privacy.html`, sezione 4.3) lo descrive come protezione.

**Correzione suggerita.** Legare il giro alla sessione dell'app che l'ha cominciato:
- `/inizia` restituisce all'app, nel JSON, un segreto usa-e-getta; l'app lo tiene in `sessionStorage`;
- `/ritorno` non salva il permesso ma lo lascia «da confermare» (cifrato, dieci minuti);
- tornata sull'app (`?lmcal=google&esito=da-confermare`), l'app fa `POST /api/calendari/google/conferma` con il gettone di Firebase E il segreto: solo allora il permesso diventa del suo account. Un link aperto da un'altra persona non ha né il gettone giusto né il segreto.
- In più: mostrare nell'app l'email del calendario appena collegato, prima di usarlo.

**Script:** `script/c01-sentinella-sicurezza.js` (casi A1–A6). Risultati: `risultati/c01-sentinella-sicurezza.json`.

### GRAVE

#### G1. Due modifiche diverse alla stessa cosa, su due dispositivi: una sparisce — **confermato**

**Cosa vede chi usa l'app.** In metropolitana rinomini «Telefonare al medico» in «Telefonare al medico ORE 9» sul telefono; poco dopo, dal PC, la spunti come fatta. Quando il telefono ritrova la rete, l'azione è fatta… e si chiama di nuovo «Telefonare al medico». La rinomina è sparsa su tutti i dispositivi, senza nessun avviso. Nella prova, la rinomina fatta sull'iPad (ancora più recente di quella del telefono) è sparita lo stesso, perché la spunta del PC era ancora dopo.

Lo stesso nel calendario: una riunione segnata «fatta» sul telefono mentre il PC (che in quel momento non riceveva dal cloud) leggeva da Google il titolo nuovo: alla fine in LifeMax resta il titolo vecchio, su tutti i dispositivi, mentre Google ha quello nuovo, e i giri successivi non lo sistemano (`r1/s07` caso C6; era rosso anche nel primo giro, ma il rapporto di allora non lo elencava).

**Passi.** `script/n03-rete.js`, caso A: un'azione X; telefono e iPad offline; telefono rinomina, poi iPad rinomina, poi il PC (online) la spunta; tornano online prima l'iPad poi il telefono. Risultato su tutti: `{"testo":"X originale","done":true}`.

**Causa.** Le righe si uniscono «intere»: vince la versione con l'`aggiornata` più recente, campo per campo ma prendendo TUTTI i campi da quella (`unisciRiga`, `src/dati/dati.ts:590-603`). `segnaOrologi` dà un'ora alla riga intera (`dati.ts:931-933`), non al singolo campo (solo i dizionari dentro la riga, come le spunte di un'abitudine, hanno un orologio per chiave).

**Correzione suggerita.** Un orologio per CAMPO anche nelle righe: in `segnaOrologi` segnare `azioni/<id>/testo`, `…/done`, `…/data`, `…/ora` come già si fa per i dizionari, e in `unisciRiga` decidere campo per campo con quell'orologio (con l'`aggiornata` della riga come ripiego per le righe vecchie). È la stessa macchina che già c'è per le mappe.

**Script:** `script/n03-rete.js` (A2), `script/r1/s07-calendari.js` (C6).

#### G2. Una modifica che Google rifiuta una volta blocca il calendario per sette giorni — **confermato**

**Cosa vede chi usa l'app.** Cancelli in LifeMax un'attività che viene da Google; per un motivo qualunque Google risponde con un errore che non è «manca la rete» (un 400, un 500 che resta, venti tentativi falliti, la chiave del server cambiata). Da lì in poi, per sette giorni, **non arriva più niente da Google**: gli eventi nuovi non diventano attività, gli spostamenti non arrivano, le tue modifiche non partono. Il pannello dice «**Tutto allineato.** Google: Il calendario non ha accettato la modifica.» — tutte e due le cose insieme.

**Passi.** `script/c02-calendari-app.js`, caso 5: Google finto risponde 400 alla PRIMA cancellazione di un evento, poi torna normale; si aggiunge un evento nuovo in Google; tre giri: l'evento nuovo non entra mai.

**Causa.**
- La coda della sentinella ricorda l'esito di ogni modifica per chiave (`sentinella/sentinella.mjs:445`: «già fatta, ecco la risposta»), anche quando l'esito è un fallimento definitivo (`sentinella.mjs:464-475`); la chiave la calcola l'app dal contenuto (`chiaveOp`, `src/calendari/server.ts:228`), quindi ogni nuovo tentativo riceve lo stesso fallimento.
- Nell'app, un errore su una cancellazione che non sia «permesso» fa abortire TUTTO il giro di quel fornitore (`src/calendari/sincronia.ts:269`, e `confronta` a `sincronia.ts:374-377` per le modifiche).
- I fallimenti si cancellano dalla coda solo dopo sette giorni (`sentinella.mjs:352`).
- «Tutto allineato» viene da `racconta` (`sincronia.ts:451`) che conta le operazioni andate, anche quando c'è un intoppo.

**Correzione suggerita.** Un fallimento definitivo su UNA modifica non deve fermare le altre: in `giroDi` raccogliere l'errore di quella riga (segnarla «non riuscita», scriverlo nel Diario, toglierla da `tolti` dopo N tentativi) e andare avanti. Nella sentinella non ricordare come «fatto» un fallimento non definitivo, o restituirlo una volta sola. Nel pannello non scrivere «Tutto allineato» se c'è un intoppo.

**Script:** `script/c02-calendari-app.js` (5.1), `script/c01-sentinella-sicurezza.js` (E3).

#### G3. Senza rete l'app non si apre — **confermato (Chromium)**

**Cosa vede chi usa l'app.** In metropolitana, in aereo, in montagna: tocchi l'icona di LifeMax (o ricarichi la pagina) e compare la pagina d'errore del browser («Nessuna connessione», il dinosauro di Chrome). Le tue cose sono tutte nel telefono, ma l'app non parte. È esattamente il momento in cui servirebbe annotare qualcosa.

**Passi.** `script/n09-apertura-offline.js`, caso A: il sito servito con le stesse intestazioni di cache della produzione (`index.html` «max-age=0, must-revalidate», `/pacco/*` «immutable»), service worker attivo, app usata con la rete; poi rete spenta e ricarica → `net::ERR_INTERNET_DISCONNECTED` (schermata `n09-a-riaperta-senza-rete.png`). Su iPhone non è provato (niente Safari qui), ma senza service worker che tenga la pagina Safari si comporta allo stesso modo con `must-revalidate`.

**Causa.** `sw.js` (righe 1-12) non tiene niente in cache, per scelta («Se un giorno servirà l'offline si aggiunge qui»); `index.html` va sempre ricontrollato col server.

**Correzione suggerita.** Nel service worker, una cache minima «rete prima, cache se manca la rete» per `index.html` e per i file di `/pacco/` (che hanno già l'impronta nel nome, quindi non c'è il rischio di vedere la versione di ieri: alla prima apertura con la rete arriva la nuova). E l'SDK di Firebase, se si vuole il cloud anche dopo un'apertura offline (vedi M5).

**Script:** `script/n09-apertura-offline.js` (A1).

### MEDIO

#### M1. «Esci» quando il cloud non risponde, poi entra un'altra persona: l'ultima modifica resta bloccata sul PC — **confermato**

**Cosa vede chi usa l'app.** Mario scrive una cosa e tocca «Esci» mentre il cloud non risponde (rete dell'hotel, Wi-Fi con la pagina di accesso, Firestore lento): l'app dice «Sei uscito. Una modifica non era ancora nel cloud: parte da sola appena c'è rete». Prima che la rete torni davvero, Luigi accede sullo stesso browser. Quella modifica di Mario **non parte più**: resta sul PC in `lifemax.daparte.<uid di Mario>` e arriverà solo il giorno in cui Mario rientrerà proprio da quel PC. Nel frattempo la sessione Firebase di Mario è rimasta viva «di nascosto» (lo schermo dice «uscito», ma `auth.currentUser` è ancora Mario) finché non entra Luigi.

**Passi.** `script/n01-dispositivo-condiviso.js`, caso G: Firestore bloccato (non la rete intera), modifica, «Esci» → esito `in-attesa`; accesso di Luigi; Firestore sbloccato: nel cloud di Mario la modifica non c'è.

**Causa.** `src/nuvola/nuvola.ts:470-472`: quando entra un account diverso da quello dell'uscita in sospeso, l'uscita in sospeso si butta (`togli(USCITA)`); `completaUscita` (`nuvola.ts:582`) gira solo per lo stesso uid.

**Correzione suggerita.** Prima di accettare un altro account, chiedere: «Mario ha una modifica non ancora salvata: aspetta la rete o scaricala in un file». Oppure completare l'uscita di Mario (mandare `copiaDaParte`) con la sua sessione prima di chiamare `signInWithPopup` per Luigi.

**Script:** `script/n01-dispositivo-condiviso.js` (G0, G1).

#### M2. Cambiare la chiave dei permessi (`CHIAVE_CALENDARI`): l'app dice «Collegato» e smette di funzionare in silenzio — **confermato**

**Cosa vede chi usa l'app.** Se la chiave segreta del Worker cambia (le istruzioni dicono «non cambiarla più», ma succede: un segreto rifatto, un copia-incolla sbagliato), il pannello continua a dire «Collegato» e «Tutto allineato»; gli eventi nuovi non arrivano più; ogni modifica fatta in LifeMax viene registrata dalla sentinella come «fallita per sempre» (e quindi blocca il calendario per sette giorni, vedi G2). Le istruzioni (`src/calendari/LEGGIMI.md`, S3) promettono che «a ognuno serve un tocco su Ricollega»: l'app quel tocco non lo chiede mai.

**Causa.** `decifra` fallisce con un errore generico (`sentinella/cifra.mjs:59-64`), che in `gettone()` (`sentinella/sentinella.mjs:222-251`) non diventa «revocato»; `cambi` inghiotte l'errore del giro (`sentinella.mjs:394`) e restituisce lo specchio vecchio col conto ancora `stato: 'ok'`; `fai` lo registra come fallimento definitivo `altro` (`sentinella.mjs:472`).

**Correzione suggerita.** Se il permesso non si decifra, segnare il conto `revocato` (così l'app dice «Ricollega») e non registrare la modifica come «fatta».

**Script:** `script/c01-sentinella-sicurezza.js` (E1–E3), `script/c02-calendari-app.js` (7.1).

#### M3. Il calendario resta nel browser dopo «Esci» — **confermato**

Con la sentinella, la copia locale del calendario (`lifemax.calendari.specchio`: titoli, orari, chi organizza, da 7 giorni fa a 13 mesi avanti) resta nel browser dopo «Esci», e anche dopo che un altro account è entrato (la chiave porta ancora `uid: "mario"`). Nell'app non si vede (i «fantasmi» non compaiono all'ospite né a Luigi: provato), ma chiunque apra gli strumenti del browser la legge. Allo stesso modo, nella strada senza sentinella, il permesso di Outlook di 24 ore (`lifemax.calendari.microsoft`, con il refresh token) e quello di Google di un'ora restano dopo «Esci» (lettura del codice: `src/calendari/microsoft.ts:73`, `google.ts:84`; nessuno li toglie all'uscita).

**Causa.** `lasciaAccount()`/`pulito()` (`src/dati/dati.ts:4466-4490`) non tocca le chiavi `lifemax.calendari.*`; `specchio()` (`src/calendari/server.ts:156-163`) azzera lo specchio solo in memoria.

**Correzione suggerita.** In `pulito()` togliere `lifemax.calendari.specchio`, `lifemax.calendari.google`, `lifemax.calendari.microsoft`, `lifemax.calendari.qui`.

**Script:** `script/c02-calendari-app.js` (8.1, 9.1).

#### M4. Le istruzioni per accendere l'accesso dal dominio (iPhone) hanno un controllo che non può passare — **confermato in produzione**

Il passo 5 di «Accesso su iPhone» in `revisione/cloud/RAPPORTO.md` dice: «apri `https://lifemax.theproject.world/__/firebase/init.json`, deve comparire `projectId: lifemax-9dc63`». In produzione quell'indirizzo risponde **404 «Site Not Found»** (il Worker lo prende da `lifemax-9dc63.firebaseapp.com`, dove Firebase Hosting non è attivo). `/__/auth/handler` invece risponde 200. Il fondatore, seguendo le istruzioni, si fermerà al punto 5 e non accenderà mai l'interruttore `ACCESSO_DAL_DOMINIO` (`src/nuvola/nuvola.ts:58`): l'accesso da iPhone quando il popup è bloccato (app sulla schermata Home) resta sulla strada che Safari può rompere. **Questo non è stato provato su un iPhone vero** (capitolo 5).

**Correzione suggerita.** Cambiare il controllo del punto 5 in «`/__/auth/handler` mostra una pagina (non l'app)», oppure attivare Firebase Hosting sul progetto (basta un `firebase init hosting` vuoto) se si vuole `init.json`.

**Prova:** `GET` in produzione, risposte riportate nel capitolo 2 (righe «Produzione»).

#### M5. Una scheda con la versione VECCHIA dell'app, rimasta aperta, non riceve più niente e nessuno lo dice — **confermato**

**Cosa vede chi usa l'app.** Il PC con LifeMax aperto da giorni (mai ricaricato) è rimasto alla versione di prima del 25 novembre. Continua a funzionare e a salvare: quello che scrive lì arriva agli altri. Ma da lui **non arriva più niente**: le cose scritte sul telefono non compaiono mai, finché qualcuno non ricarica la pagina. Nessun avviso. Nel primo giro la scheda vecchia (allora `b3c6d4b`) riceveva; ora no, perché i dati nel cloud hanno cambiato forma.

Buona notizia, provata: la scheda vecchia **non distrugge niente**. Le sue scritture vengono riunite, le cose cancellate altrove non risorgono, il nome cambiato altrove resta, i punti non si gonfiano (`n06` B1–B5, tutti verdi).

**Passi.** `script/n06-versioni.js` C1–C2 (la versione vecchia è il commit `1a85823`, servita su un'altra porta); `script/r1/s08-varie.js` S8.0–S8.1.

**Causa.** La versione vecchia legge solo il campo `data` del documento principale, che la nuova non scrive più (`src/nuvola/nuvola.ts:880-889`); non esiste un controllo di versione con cui la nuova possa dire alla vecchia «ricarica».

**Correzione suggerita.** Per QUESTA scheda vecchia non c'è rimedio dal codice nuovo (il codice vecchio è già quello che è), se non scrivere anche un `data` di cortesia, che però riporterebbe il limite di 1 MB. Per il futuro: un campo `versioneMinima` nel documento principale e, nell'app, un controllo all'arrivo di ogni aggiornamento («C'è una versione nuova: ricarica»); e un controllo periodico di `index.html` per le schede aperte da giorni.

#### M6. Se all'apertura l'SDK di Firebase non arriva, il cloud non riparte più finché non si chiude l'app — **confermato**

**Cosa vede chi usa l'app.** Apri LifeMax con una rete che va e viene (o con `gstatic.com` lento): l'app si apre, ma senza account («Accedi con Google» al posto del tuo nome). Scrivi qualcosa. La rete torna: non succede niente. Non c'è «Non ancora nel cloud», gli altri dispositivi non ricevono, e così per ore se l'app resta aperta (sul telefono succede spesso: la PWA resta in memoria). Riaprendola, tutto arriva (nessuna perdita: provato).

**Passi.** `script/n09-apertura-offline.js` B e C: SDK bloccato all'apertura, modifica, SDK sbloccato, evento `online` e ritorno sull'app → `cloud: false`, nessuna pastiglia; il PC non riceve; dopo una ricarica sì.

**Causa.** `src/nuvola/nuvola.ts:379-514`: l'`import()` dell'SDK si prova una volta sola; se fallisce, `emitUnavailable()` (`nuvola.ts:512`) e nessun nuovo tentativo; anche l'ascolto di `lm:change` (`nuvola.ts:499`) si aggancia solo dopo l'SDK, quindi la modifica non viene segnata «in sospeso».

**Correzione suggerita.** Riprovare l'avvio all'evento `online`, al ritorno sull'app e ogni minuto; segnare le modifiche «in sospeso» anche prima che l'SDK ci sia (se `lm-account-unito` dice che il dispositivo è di un account).

#### M7. Orologio del dispositivo molto sbagliato: le modifiche si perdono o tornano indietro — **confermato**

L'app corregge l'orologio con quello del server, ma solo in certi casi. Tre casi provati:
- **Telefono avanti di 3 ore, aperto mentre il cloud non risponde**: la correzione non c'è (si misura solo all'accesso, e non si ricorda), quindi una modifica fatta sul telefono PRIMA vince su una fatta sul PC DOPO (`n04` A2). Con la correzione misurata, invece, tutto giusto (`n04` A1, A3, e `r1/s03` 3.7–3.8).
- **Tablet con la data tornata al 2001** (batteria tampone scarica, un reset): le sue rinomine e cancellazioni **tornano indietro** da sole su tutti i dispositivi, perché portano un'ora del 2001; le cose che scrive finiscono nel giorno 1° gennaio 2001 (`n08` A1, A2, A4).
- **PC con l'anno avanti di 2**: considera scadute tutte le «lapidi» (i segni delle cose cancellate) e gli orologi delle chiavi, e li butta; una cosa cancellata dal telefono **resta** sul PC, e le lapidi spariscono anche dal cloud (`n08` B1: nel cloud 0 lapidi dopo il passaggio del PC).

**Causa.**
- Lo scarto col server si misura solo all'accesso (`misuraOrologio`, chiamata solo in `onAuthStateChanged`, `src/nuvola/nuvola.ts:478`) e sta solo in memoria (`impostaScarto`, `src/dati/dati.ts:185-188`).
- Oltre 400 giorni di errore la correzione non si applica (`dati.ts:186`), e un'ora vista arrivare da fuori più di un giorno avanti non si prende (`dati.ts:180`).
- La scadenza di lapidi e orologi usa l'orologio del dispositivo senza correzione (`dati.ts:719`, `dati.ts:793`).

**Correzione suggerita.** Ricordare lo scarto in `localStorage` e rimisurarlo a ogni ritorno della rete; se l'errore supera i 400 giorni, non scrivere ore inventate: usare l'ultima ora del server vista (`ultimoIstante`) come base e avvisare («L'orologio di questo dispositivo è sbagliato: correggilo»); calcolare la scadenza di lapidi e orologi con `adesso()` (corretto) e non con `Date.now()`, e non buttarle mai se l'orologio non è stato misurato.

**Script:** `script/n04-orologi.js` (A2), `script/n08-orologi-lontani.js`.

#### M8. «Azzera tutto»: una cosa scritta offline su un altro dispositivo PRIMA dell'azzeramento ritorna — **confermato**

Azzeri tutto dal telefono mentre l'iPad è senza rete e ha appena scritto una cosa. Quando l'iPad torna online, quella cosa ricompare su tutti i dispositivi, anche se è stata scritta prima del «Cancella tutto». Causa: l'azzeramento mette una lapide solo sulle righe che il telefono conosceva (`reset`, `src/dati/dati.ts:1606-1636`; `azzerato` è messo a 0). Correzione: scrivere nell'azzeramento l'istante (`azzerato = adesso()`) e scartare nella fusione le righe create prima di quell'istante. È il «taglio» che c'era prima, ma va calcolato con l'orologio corretto. Script: `script/n05-funzioni.js` (A2), `script/r1/s08-varie.js` (8.2).

#### M9. Il calendario: un titolo cambiato in Google si perde se intanto l'attività è stata segnata «fatta» altrove — **confermato**

È un caso di G1 sul calendario, ma con un effetto in più: LifeMax e Google restano diversi **per sempre** (LifeMax «Impegno», Google «Colloquio (spostato sala B)») e i giri successivi non li riallineano. Script: `script/r1/s07-calendari.js` (C6, rosso anche nel primo giro).


### MINORE

- **m1. Il popup di Google chiuso subito apre lo stesso il redirect verso Google** (confermato, `n02` caso B). Se chi tocca «Accedi» chiude la finestra di Google entro 2,5 secondi (ripensamento, tocco sbagliato), l'app la tratta come «popup bloccato» e porta l'intera pagina da Google. Causa: `src/nuvola/nuvola.ts:432-438` (sotto i 2,5 s `popup-closed-by-user` cade nel ramo `/popup/`). Correzione: trattare `popup-closed-by-user` sempre come scelta dell'utente; il redirect solo per `popup-blocked`.
- **m2. Il cron di riserva sveglia solo le prime 40 sentinelle** (confermato, `c01` caso I: con 45 persone e le sveglie perse, ne ripartono 39). Causa: `sentinella/worker.mjs:204` `tutte.slice(0, 40)`, sempre le stesse. Correzione: ruotare (un cursore in `meta`) o svegliarle tutte a gruppi.
- **m3. La sentinella si sveglia ogni dieci minuti anche per chi ha il permesso revocato o scaduto**, per sempre (confermato, `c01` F3; `sentinella.mjs:110-121` rimette la sveglia se c'è un conto qualunque). Costo inutile; correzione: niente sveglia se tutti i conti sono `revocato`.
- **m4. Il proxy `/__/auth` inoltra a firebaseapp.com tutti i biscotti del dominio e l'intestazione `Authorization`** e rimanda indietro i `Set-Cookie` e l'HSTS `includeSubDomains; preload` di Firebase (confermato, `c01` H1–H2; l'HSTS si vede anche in produzione). Oggi i biscotti di LifeMax sono solo su `/api/calendari/`, quindi non escono; ma ogni biscotto futuro su `/` uscirebbe verso Google. Causa: `sentinella/worker.mjs:170-171`. Correzione: inoltrare solo le intestazioni che servono, togliere `cookie` e `authorization`.
- **m5. Due collegamenti dello stesso calendario insieme (due schede): il primo fallisce dicendo «Il collegamento è tornato su un browser diverso»**, che non è vero (confermato, `c01` D1; il secondo biscotto sovrascrive il primo, `worker.mjs:127`).
- **m6. Modifiche fatte senza rete e poi memoria cancellata (Safari, «Cancella dati»): perse senza avviso** (confermato, `n02` H3). È inevitabile se la memoria sparisce; l'app però mostra già «Non ancora nel cloud» solo finché c'è.
- **m7. Due schede: se nella seconda entra un altro account, la prima resta «fuori» ma quello che ci scrivi finisce nel dispositivo del nuovo account** (confermato, `n02` L). Chi è nella prima scheda vede «non collegato» e non sa che le sue cose stanno andando nell'account di un altro.
- **m8. Account cancellato sul server: l'app non se ne accorge** (sospetto; `n02` F: con l'emulatore la sessione resta aperta dopo la cancellazione dell'utente, e rientrando con lo stesso Google nasce un uid nuovo, vuoto, mentre i dati vecchi restano orfani in Firestore). Non verificabile senza Firebase vero.
- **m9. Il Worker accetta i gettoni di un utente disabilitato fino a un'ora** (lettura del codice, `sentinella/identita.mjs`: controlla firma e scadenza, non la revoca). Inevitabile senza l'SDK Admin; da sapere.
- **m10. Abuso del server (sospetto)**: qualunque account Google può entrare in LifeMax e creare la sua sentinella e il suo spazio in Firestore senza limiti di dimensione (`firestore.rules` non mette tetti). Se nel progetto Firebase fossero accesi altri metodi di accesso (anonimo, email), chiunque potrebbe creare utenti con la chiave pubblica. Non verificato (servirebbe la console di Firebase).
- **m11. «Riprendi il profilo» non aiuta se il profilo si rovina lo stesso giorno** (confermato, `n05` C1): la copia nel cloud è una al giorno e viene presa al primo salvataggio della giornata, quindi può non contenere il nome e la visione scritti dopo. Correzione: una copia anche prima di ogni cambiamento del profilo, o di «Esci»/primo accesso di un dispositivo nuovo.
- **m12. Il trasloco da github.io porta i dati dell'ospite nell'account collegato sul nuovo indirizzo senza chiedere di chi sono, e la proposta di trasloco ricompare a ogni visita anche dopo il trasloco riuscito** (confermato, `n07` C2, D1). Su un dispositivo condiviso, i dati di un'altra persona possono finire nell'account. Correzione: se di là c'è un account collegato, chiedere conferma mostrando quanti elementi arrivano; dopo `lm-traslocato` mostrare solo un promemoria piccolo.
- **m13. Fusi orari**: un'abitudine spuntata la sera a New York risulta fatta «ieri» per il PC a Roma (`n04` C1). È coerente (il giorno è quello di chi la spunta), ma va saputo da chi viaggia.

---

## 4. Il primo giro, riprovato

Ogni riproduttore del primo giro (`script/r1/`) è stato rilanciato sul commit `1548c72`. Gli script sono quelli di allora; sono cambiate solo tre cose che il codice nuovo ha reso necessarie: la lettura del cloud (ora diviso in pezzi), il campo «Client ID» dei calendari (non c'è più: l'ID è scritto in `config.ts`) e la scheda «versione vecchia», che ora è il commit `1a85823` (l'ultimo con il documento unico).

| # (giro 1) | Problema di allora | Riproduttori rilanciati | Esito oggi | Davvero corretto? |
|---|---|---|---|---|
| 1 | Fuga di dati fra account | `r1/r04` (R04a.1–b.3 tutti verdi), `r1/s04` (4.5b, 4.6c verdi), `n02` E, K, L | Le due strade di allora (sessione chiusa dal server; «Esci» in un'altra scheda) sono chiuse. | **No, non del tutto**: la fuga rientra dal pannello «Backup» (problema **C1**). |
| 2 | PC sempre aperto «sordo», cose scritte altrove che spariscono | `r1/r05` (R05–R05d verdi), `r1/r01` verde, `r1/s01` (6/6 verdi) | Il PC riceve, niente sparisce. | **Sì.** |
| 3 | Dispositivo nuovo azzera il profilo | `r1/r03` verde, `r1/s09` 9.2 verde, `r1/s11` (4/4 verdi), `n02` I (iPhone svuotato da Safari) verde | Nome, visione, sveglia restano. | **Sì.** (Il caso del trasloco con dati vecchi: vedi `n07` B1.) |
| 4 | Annullare non arriva e poi torna indietro | `r1/r02` (R02a verde; R02b rosso solo perché il PC, catturando una nota, guadagna 1 punto: spunte, area e orari annullati NON tornano), `r1/s02` | Gli annullamenti arrivano e restano. | **Sì.** |
| 5 | Limite di 1 MB | `r1/s05`: 90, 180, 365, 540, **730 giorni (2,2 MB)** tutti verdi; `n06` D | Si sincronizza tutto; un PC entra in ~1,5 s. | **Sì.** |
| 6 | Modifiche offline perse | `r1/s03` (11/11 verdi), `n03` A1, A3, A4 | Vince l'ultima modifica, anche fra tre dispositivi che tornano in ordini diversi. | **In parte**: se le due modifiche toccano campi DIVERSI della stessa cosa, una si perde (problema **G1**). |
| 7 | App chiusa subito dopo una modifica | `r1/s08` 8.4, 8.4b verdi; `n03` F1, F2 verdi (anche con Firestore lento: la «cassetta delle lettere» `keepalive` funziona); `n03` E (pagina uccisa a metà giro: cloud integro, la modifica parte alla riapertura) | Arriva. | **Sì.** |
| 8 | Orologio sbagliato | `r1/s03` 3.7, 3.8 verdi; `n04` A1, A3 verdi; `n04` A2 e `n08` rossi | Corretto quando lo scarto è stato misurato all'accesso e sta sotto i 400 giorni. | **Sì per orologi poco sbagliati**; vedi capitolo 3 per i casi limite. |
| 9 | «Esci» senza rete perde l'ultima modifica | `r1/s04` 4.4, 4.4b verdi; `n02` E | La modifica arriva appena torna la rete. | **Sì**, salvo il caso in cui nel frattempo entra un altro account (problema **M1**). |
| 10 | Punti guadagnati in parallelo non si sommano | `r1/s03` 3.9 verde (10 + 20 = 30 ovunque) | Si sommano. | **Sì.** |
| 11 | Sessione chiusa in silenzio, messaggi da programmatore | `r1/r04` R04a.1 verde, `n02` E1 verde (finestra «La sessione è finita»), `r1/s08` 8.6, `n03` G1, I1 (messaggi in italiano semplice) | Detto, e con parole giuste. `r1/s04` 4.7 è rosso solo perché si aspettava i dati ancora sullo schermo: ora vanno (giustamente) messi da parte. | **Sì.** |
| 12 | Copie nel cloud senza limite | `r1/s10` verde (elencate in 31 ms, niente da scaricare) | Si elencano senza scaricarle. | **Sì.** |
| 13 | «Azzera tutto» lascia aree e diario | `r1/s08` 8.2 verde, `n05` A | Aree, nomi, diario se ne vanno ovunque. | **Sì**; resta un caso limite (cose create offline prima dell'azzeramento: vedi `n05` A2). |
| 14 | Due schede che scrivono ognuna per sé | `r1/s04` 4.6, `n02` K | Si uniscono; «Esci» in una scheda non perde la modifica dell'altra. | **Sì.** |
| 15 | iPad riaperto dopo settimane mostra per un attimo i dati vecchi | `r1/s06` (45 e 200 giorni) | I dati vecchi si vedono ancora per un attimo, ma sbiaditi e con «Aggiornamento dal cloud…»; dopo, tutti uguali al telefono. | **Mitigato** (come promesso). |
| S | Lapidi che scadono (dispositivo fermo a lungo) | `n08` B (orologio avanti 2 anni) | Un dispositivo con l'orologio avanti di 2 anni butta le lapidi e le toglie anche dal cloud (M7). | Non provabile per davvero: servirebbe far passare due anni anche al server. |
| S | Oltre 3000 lapidi | non rilanciato | — | Non riprovato (coperto da `prove/nuvola-fusione.js` del ramo). |
| S | Check-in e diario modificati raddoppiano | non rilanciato | — | Non riprovato (coperto da `prove/nuvola-fusione.js`). |
| S | Accesso da iPhone (`authDomain`) | produzione: `GET /__/auth/handler` 200, `GET /__/firebase/init.json` **404** | L'interruttore è spento; il controllo delle istruzioni non può passare (problema **M4**). | **Non risolto** (e non provabile senza Safari e Google veri). |
| — | Calendari fra più dispositivi (`r1/s07`) | C1–C5 verdi, **C6 rosso come nel giro 1** | Niente doppioni, cancellazioni propagate; il caso «fatta qui + titolo cambiato là» perde il titolo (problema **G1**). | **No** per C6 (era rosso anche allora, ma il rapporto non lo diceva). |
| — | Scheda con la versione vecchia (`r1/s08` 8.1) | rosso | La scheda vecchia (commit `1a85823`) non riceve più niente; nel giro 1 (versione `b3c6d4b`) riceveva. | Vedi **M5**. |
| — | Memoria del dispositivo piena (`r1/s08` 8.5) | rosso sull'avviso | La modifica arriva comunque al cloud e agli altri; l'avviso a chi usa l'app non si è visto (forse un avviso già sparito: da verificare a mano). | Funziona; l'avviso è **da verificare**. |

---

## 5. Cosa NON è stato provato, e perché

«Non provato» non vuol dire «funziona».

| Cosa | Perché non provato | Cosa è stato fatto al posto |
|---|---|---|
| **Safari vero** (iPhone, iPad, Mac) e **Firefox** | Su questa macchina c'è solo Chromium (`/opt/pw-browsers`: niente WebKit né Firefox) e non si installano browser. | Profili iPhone/iPad di Playwright su Chromium; la cancellazione di Safari dopo 7 giorni imitata cancellando tutta la memoria (`n02` I); bfcache e «app in secondo piano» imitati con `visibilitychange`/`pagehide`. Differenze reali di Safari (ITP, partizionamento dello spazio, `keepalive`, popup nella PWA) **non verificate**. |
| **PWA installata** sulla schermata Home (iOS e Android) | Serve un telefono vero. | Contesti con service worker attivo (`n09`). |
| **Accesso con Google vero**: popup, redirect, `getRedirectResult`, account Google scelto, sessione Google scaduta | Vietato usare account veri. L'emulatore accetta credenziali finte; popup e redirect sono finti (`lib.js`). | Gli esiti dei vari errori del popup (`n02` A–D); la cancellazione dei biscotti (`n02` G: LifeMax resta dentro, perché la sessione Firebase non dipende dai biscotti di Google). |
| **Accesso da iPhone con l'interruttore `ACCESSO_DAL_DOMINIO` acceso** | Serve Safari vero, Google vero e la configurazione della console. | Solo il controllo in produzione delle pagine del proxy (M4). |
| **Scadenza e revoca vere del gettone Firebase** (un'ora, revoca dalla console, cambio password) | L'emulatore non fa scadere i gettoni come Google. | Account disabilitato e cancellato nell'emulatore (`n02` E, F). La cancellazione non chiude la sessione nell'emulatore: con Firebase vero **non verificato** (m8). |
| **Google Calendar e Microsoft Graph veri** (ricorrenze vere, fusi del calendario, inviti, calendari condivisi, `syncToken` scaduto davvero, limiti di frequenza 403/429) | Vietato. | Il Google e il Microsoft finti del ramo (`prove/comune/sentinella-finta.js`), che imitano solo quello che chi li ha scritti ha capito. Le occorrenze di una ricorrenza sono state imitate come eventi separati (come le dà Google con `singleEvents`). |
| **Scadenza dei 7 giorni dell'app Google «In prova»** | Non si può far passare il tempo da Google. | Imitata col refresh token rifiutato (`c01` F, `c02` 6): il pannello dice «Ricollega» e la modifica resta in coda. |
| **Cloudflare vero** (Durable Object, sveglie, cron, limiti di CPU e memoria, `idFromString` con id inventati) | Non c'è `wrangler`/`miniflare` e non si chiama Cloudflare. | Il Worker vero in Node con il «namespace» finto del ramo; in produzione solo `GET` di pagine pubbliche e di `/api/calendari/stato`. Se un id di Durable Object inventato in `/vai` o `/ritorno` crei o no un oggetto vuoto su Cloudflare **non è verificato**. |
| **Quota di Firestore esaurita** (`resource-exhausted`) | L'emulatore non ha quote. | Solo lettura del codice: il messaggio esiste (`nuvola.ts:1359`). |
| **Lapidi e orologi oltre i due anni, assenza oltre i 600 giorni** | Servirebbe far passare il tempo anche al server; spostando solo l'orologio dei dispositivi l'app lo «corregge» (fino a 400 giorni) con l'ora del server. | `n08` con orologi molto sbagliati; il resto è lettura del codice. |
| **Promemoria push** (postino, `sw.js`) | Fuori dallo scopo di questa verifica e servono le chiavi push. | Niente. |
| **Rete cellulare vera** (perdita di pacchetti, cambi di rete Wi-Fi→4G) | — | Rete «ballerina» e lenta imitate (`n03` C, D), cloud muto (`n03` I). |
| **Il vecchio app aperto per giorni con il bundle in cache del service worker** | `sw.js` non tiene cache, quindi il caso reale è solo «scheda mai ricaricata». | Imitato con la versione `1a85823` (`n06`, `r1/s08`). |

---

## 6. Come rilanciare

Serve: Node 22, Java, Playwright con Chromium, e una cartella con `firebase-tools@15` e `firebase@12.16.0` (`npm i firebase-tools@15 firebase@12.16.0`).

1. Un worktree del commit da provare in `<cartella>/wt` (`git worktree add --detach <cartella>/wt 1548c72`), e per le prove con la versione vecchia `<cartella>/wt-vecchio` al commit `1a85823`. Nei due worktree un collegamento a `node_modules`.
2. L'emulatore, con `script/firebase.json` e `firestore.rules` nella stessa cartella: `firebase emulators:start --only auth,firestore --project demo-lifemax` (porte 9399/9380). Per farne girare più insieme: un secondo emulatore su altre porte e le variabili `FSP`, `AUP`, `PORTA` (es. `FSP=9480 AUP=9499 PORTA=9311`).
3. `script/lib.js` si aspetta questa cartella dentro `<cartella>/consegna/` e l'SDK in `<cartella>/../audit-cloud/fbt/node_modules/firebase` (si cambia con `FBSDK=`).
4. Uno script per volta: `node script/n01-dispositivo-condiviso.js`. Gli script della sentinella (`c01`, `c02`) non hanno bisogno dell'emulatore: usano il Worker del worktree con il mondo finto.

---

## Correzioni

Ogni correzione ha una prova nel ramo, rossa sul commit `1548c72` e verde dopo. Gli hash sono quelli dei commit nel ramo; «rossa su 1548c72» vuol dire che la stessa prova, fatta girare sul sito e sulla sentinella di `1548c72`, fallisce (rilanciata così, con `LIFEMAX_SITO` o con una copia del codice di allora).

| # | Correzione | Prova | Commit |
|---|---|---|---|
| C2 | Il permesso che torna da Google o Microsoft non si usa subito: resta «da confermare» per dieci minuti, cifrato. Diventa un collegamento solo quando l'app lo conferma (`POST /api/calendari/<p>/conferma`) con il gettone di Firebase del suo account E il biscotto `lmcal_ok_<p>` che il ritorno ha lasciato in quel browser (il segreto porta anche l'id della sentinella). Un link preparato da un altro e aperto dalla vittima torna nel browser della vittima, la cui conferma va alla sentinella della vittima: nella sentinella dell'attaccante il permesso scade da solo. L'attaccante, dal suo browser, il biscotto non ce l'ha. Aggiornati anche `privacy.html` e `src/calendari/LEGGIMI.md`. | `prove/sentinella.js` (sezione 9b e il giro normale con la conferma), `prove/calendari-server.js` (il giro passa da `/conferma`) | `bef9ed6` |
| C1 | Le copie locali (`lifemax.backups.v1`) hanno un proprietario (`chi`: l'uid, o '' per l'ospite); «Backup e ripristino» elenca e ripristina solo quelle di chi è dentro adesso. «Esci», la sessione chiusa dal server e il cambio d'account non prendono più una copia dei dati che escono, tolgono le copie dell'account uscente, i punti a cui tornare (`lifemax.annulla.p.*`), lo specchio del calendario e i permessi del percorso dal browser (`lifemax.calendari.*`). Le copie di prima, senza proprietario: quelle prese all'uscita da un account se ne vanno; le altre vanno all'account unito al dispositivo, o all'ospite se il dispositivo non è mai passato da un account; se non si possono attribuire, se ne vanno. Alla prima unione con un account le copie dell'ospite passano all'account, insieme ai suoi dati. | `prove/nuvola-account.js` («verifica 2, C1»), `prove/cloud.js` («dopo un backup») | `c755d4e`, `a6a33ec` |
| M3 | Coperto da C1: dopo «Esci» lo specchio del calendario e i permessi del browser non restano. | `prove/nuvola-account.js`, `prove/calendari-intoppi.js` (M3) | `c755d4e` |
| G1, M9 | La fusione di due versioni della stessa riga va campo per campo: ogni campo cambiato ha il suo orologio (`azioni/<id>/testo`, `…/done`) e vince chi l'ha toccato per ultimo. Una rinomina fatta senza rete resta anche se la riga è stata spuntata dopo altrove; il titolo cambiato nel calendario resta anche se l'attività è stata segnata fatta. Dove non c'è un orologio di campo (righe di prima) vale la regola di prima. | `prove/nuvola-fusione.js` («verifica 2, G1» e «G1/M9») | `74fd19c` |
| G2, M2 | Nell'app un no del calendario su una riga (non rete, non permesso) non ferma più il giro: la riga si conta fra le «non accettate», il pannello lo dice (mai più «Tutto allineato» insieme a un intoppo) e il Diario lo scrive; una cancellazione rifiutata tre volte, a distanza di almeno dieci minuti, si lascia stare e il Diario lo dice. Nella sentinella un rifiuto definitivo si ricorda dieci minuti e poi si può riprovare (prima restava «fatto» per sette giorni); un permesso che non si decifra più (chiave cambiata) segna il conto «revocato», e l'app chiede «Ricollega». | `prove/calendari-intoppi.js` (nuova) | `1e6bcbd` |
| G3 | Il service worker tiene la pagina e il pacco. `index.html` sempre dalla rete, e dalla cassa solo se la rete non risponde proprio; i file del pacco dalla cassa (il nome ha l'impronta del contenuto). Una pagina nuova entra in cassa solo dopo tutti i suoi file, compresi quelli caricati dopo; i file che nessuna delle due pagine più recenti nomina se ne vanno. Con la rete si apre sempre la versione appena pubblicata. | `prove/senzarete.js` (nuova) | `4cdfe14` |
| M1 | Se chi è uscito senza cloud ha ancora una modifica in attesa, prima di far entrare un altro account l'app prova a finire quell'uscita; se il cloud ancora non risponde lo dice, e solo un secondo «Accedi» entra lo stesso (la modifica resta sul dispositivo per il suo account). | `prove/nuvola-verifica2.js` (nuova) | `f319d7b` |
| M4 | Il passo 5 delle istruzioni per l'iPhone (`revisione/cloud/RAPPORTO.md`) controlla `/__/auth/handler` (deve mostrare una pagina di Firebase, non l'app) invece di `/__/firebase/init.json`, che senza Firebase Hosting risponde 404 anche quando tutto è a posto. L'accesso non ha bisogno di `init.json`. `ACCESSO_DAL_DOMINIO` resta `false`. | — | `f319d7b` |
| M5 | Il documento principale porta `versioneMinima`; una scheda la cui versione è più bassa smette di scrivere e mostra «C'è una versione nuova di LifeMax» con «Ricarica». In più, tornando sull'app (al massimo ogni dieci minuti) e ogni mezz'ora, si guarda se `index.html` sul server nomina un pacco diverso: se sì, la stessa striscia. Per le schede aperte da PRIMA di questa versione non c'è rimedio dal codice nuovo. | `prove/nuvola-verifica2.js` | `f319d7b` |
| M6 | Se l'SDK di Firebase non arriva all'apertura, le modifiche di un dispositivo che è di un account si segnano lo stesso «non ancora nel cloud»; tornata la rete (o tornando sull'app, o dopo un minuto) l'app verifica che gstatic risponda e ricarica la pagina da sé, ma solo con l'app a vista e nessun campo in cui si sta scrivendo (il browser ricorda il modulo non arrivato, e un secondo `import()` fallirebbe senza chiedere). | `prove/nuvola-verifica2.js` | `f319d7b` |
| M7 | Lo scarto misurato col server si ricorda (`lm-scarto-orologio`) e si rimisura a ogni ritorno della rete; niente più tetto di 400 giorni. Un orologio prima del 25 novembre 2026 e non ancora misurato scrive dal 25 novembre in su, e prende le ore che arrivano dagli altri. L'ultima ora vista si ricorda (`lm-ultimo-istante`). Lapidi e orologi delle chiavi scadono solo con un orologio misurato, contando con l'ora del server. | `prove/nuvola-verifica2.js` | `f319d7b` |
| M8 | **Non corretto, per scelta.** Il «taglio» dell'azzeramento è stato tolto nel primo giro perché cancellava dati veri (un azzeramento fatto da ospite tagliava il cloud; un backup ripristinato dopo un azzeramento veniva tagliato alla fusione dopo). Rimetterlo per questo caso vuol dire rifare tutti i percorsi di ripristino (copie locali, copie nel cloud, import, trasloco) perché marchino le righe ripristinate: è un cambiamento più grande e più rischioso del difetto, che fa ricomparire una cosa (non ne perde). Da decidere col fondatore. | — | — |
| m1 | La finestra di Google chiusa da chi accede (anche subito) non porta più la pagina intera da Google: il redirect solo per `popup-blocked`. | `prove/nuvola-verifica2.js` | `f319d7b` |
| m2, m3, m4, m5 | Il cron di riserva sveglia quaranta sentinelle all'ora a rotazione. Senza conti vivi e senza modifiche in coda la sentinella non si rimette la sveglia. Il proxy di `/__/auth` non porta a Firebase Cookie e Authorization e non riporta Set-Cookie e HSTS. Il biscotto del legame ha nel nome un pezzo dello state, così due collegamenti insieme non si cancellano a vicenda. | `prove/sentinella.js` (sezione 14) | `11c7ec2` |
| m11 | Al primo accesso di un dispositivo a un account, prima di unire si prende una copia del cloud com'è (anche se quella del giorno c'è già). | `prove/nuvola-verifica2.js` | `f319d7b` |
| m12 | Sul nuovo indirizzo, se c'è un account, prima di aggiungere i dati arrivati da github.io si chiede, dicendo quanti sono e in quale account finiscono; con un no non entra niente. Dopo il trasloco, sul vecchio indirizzo solo un promemoria piccolo. | `prove/nuvola-verifica2.js` | `f319d7b` |
| m6, m7, m8, m9, m10, m13 | Non toccati: m6 è inevitabile (memoria cancellata dal browser); m7 (due schede, nella seconda entra un altro account) resta da decidere — Firebase passa l'accesso fra le schede da sé, e un ricaricamento forzato della prima toglierebbe di mano quello che si sta scrivendo; m8, m9 e m10 non si verificano senza il Firebase vero o la console; m13 è il comportamento voluto (il giorno è quello di chi spunta). | — | — |

**Come sono state provate.** Ogni prova nuova o allargata è stata fatta girare anche sul codice di `1548c72` (il sito costruito di allora, servito con `LIFEMAX_SITO`, e la sentinella di allora per `prove/sentinella.js` e `prove/calendari-intoppi.js`): lì fallisce. Sul ramo è verde la catena completa: `nuvola-spazio`, `nuvola-account`, `nuvola-fusione`, `nuvola-verifica2`, `impronte`, `lezioni`, `dati`, `cloud`, `ripristino`, `pacco`, `duedispositivi`, `trasloco`, `annulla`, `calendari`, `calendari-server`, `calendari-intoppi`, `sentinella`, `senzarete`, più `tsc` e `npm run build:nuovo`. Le impronte delle schermate non sono state rifatte: nessuna correzione cambia l'aspetto delle schermate di sempre (le strisce nuove compaiono solo nei casi detti sopra).

**Da sapere per pubblicare.** La sentinella (Worker e Durable Object) e il sito escono con lo stesso deploy di Cloudflare: devono uscire insieme, perché da C2 in poi l'app conferma il collegamento del calendario e la sentinella se lo aspetta. Le regole di Firestore non cambiano. Il campo `versioneMinima` (M5) comincia da 1: da alzare solo quando una versione futura cambia la forma dei dati in un modo che le versioni di prima non devono più scrivere.

## Correzioni (verifica 3)

La terza verifica, indipendente, è in `revisione/cloud3/` (commit `d6a0f63`). Ogni correzione qui sotto ha una prova nel ramo che fallisce sul sito e sulla sentinella di `d6d4bbd` (rilanciata con `LIFEMAX_SITO` su una copia di `d6d4bbd`, o con la sentinella di allora) e passa dopo. Da questa verifica in poi il browser delle prove non usa proxy e non risolve nomi (`prove/comune/chiuso.js`): anche un rimando sbagliato non può uscire.

| # | Correzione | Prova | Commit |
|---|---|---|---|
| N1 | Una copia locale di prima dell'aggiornamento (senza proprietario) va a chi c'è solo se è della sua vita: almeno metà delle righe che contiene (id a caso) sono nello stato di adesso o fra le sue lapidi. Se no, quella presa uscendo da un account si butta (è di quell'account, che ha il cloud); tutte le altre restano «senza proprietario»: non le vede né le ripristina nessuno, e in «Backup e ripristino» → «Copie senza proprietario», con l'avviso, si possono solo scaricare in un file o eliminare. Mai buttate in silenzio. Le copie che `d6d4bbd` aveva già dato all'account di adesso si riguardano una volta. | `prove/nuvola-verifica3.js` (N1) | `d6a0f63` |
| N5 | La copia «prima di entrare nell'account» (l'ospite con l'esempio e quello che ci ha scritto sopra) è dell'account in cui si entra, e si vede da dentro; quelle di prima non sono più fra le copie da buttare. | `prove/nuvola-verifica3.js` (N5) | `d6a0f63` |
| N2 | Da github.io «Collega» apre il dominio, dove inizio, ritorno e conferma stanno sullo stesso sito; collegato lì, il calendario vale anche su github.io. Il biscotto della conferma resta `SameSite=Lax` (metterlo `None` indebolirebbe C2). Rilanciati `prove/sentinella.js` (§9b) e il `c01-adattato-conferma` della verifica 3: uguali a prima. | `prove/calendari-github.js` | `43980ae` |
| N3, N6 | La ricarica da sola per riprendere il cloud: solo per un dispositivo di un account, solo se il modulo non è arrivato (non se è arrivato e non parte: lì si dice), al massimo tre volte per sessione (dopo 1, 5, 15 minuti), e solo se non perde niente — app a vista, nessun foglio, finestra o dialogo visibile, nessun campo con dentro del testo cambiato. Se no, la striscia con «Ricarica». | `prove/nuvola-ricarica.js` | `965522a` |
| N4 | Misurato l'orologio, l'orologio logico sta al più un secondo davanti all'ora vera, e `lm-ultimo-istante` si scrive solo fin lì: un'ora avanti di 400 giorni non fa più vincere quel dispositivo per 400 giorni. | `prove/nuvola-verifica3.js` (N4) | `075c55b` |
| N13 | **Non era un difetto dell'app.** Il riproduttore `r1/s07` C6 sul PC tocca `#cal-google-collega`, che su un dispositivo col calendario già collegato altrove non c'è (c'è `#cal-google-ricollega`, «Collega anche qui»): il PC non si collegava e il titolo nuovo non lo leggeva nessuno. Collegato davvero, già `d6d4bbd` dà titolo nuovo e «fatta» ovunque. La prova nuova fa il giro vero (tre dispositivi, emulatore, Google finto, date relative a oggi) e resta come guardia: è verde anche su `d6d4bbd`. | `prove/nuvola-calendario.js` | `77d38b5` |
| N7 | Un permesso che non si decifra è «illeggibile», non «revocato»: l'app chiede «Ricollega», ma la sentinella riprova a ogni giro e, se la chiave è tornata quella giusta, il conto torna «ok» da solo. | `prove/sentinella.js` (15) | `9e77450` |
| N10 | Il ritorno mette una sveglia alla scadenza dei permessi in sospeso, e la sveglia li cancella: il permesso cifrato della vittima non resta nella sentinella di chi ha preparato il link. | `prove/sentinella.js` (15) | `9e77450` |
| N8 | Se la pagina non arriva in tre secondi e mezzo e in cassa ce n'è una, si apre quella; la richiesta continua e la pagina nuova entra in cassa per la volta dopo. | `prove/senzarete.js` (3) | `f6ad217` |
| N11 | Quando nome o visione cambiano (e prima c'erano), il giro dopo prende una copia del cloud com'era, col profilo di prima. | `prove/nuvola-verifica3.js` (N11) | `0420bee` |
| N12 | Solo su un orologio più di un anno prima del 25 novembre 2026 (sbagliato di sicuro: il tablet del 2001), il giorno di oggi si prende dall'ora misurata o, senza misura, dall'ultima ora vista arrivare dagli altri. Un giorno scelto apposta di qualche mese prima resta com'è. | `prove/nuvola-verifica2.js` (N12) | `70e4ffe`, `b1201e3` |
| N9 | Documentato accanto a `VERSIONE_MINIMA` (`src/nuvola/nuvola.ts`) come si torna indietro dopo averla alzata: si ricostruisce la versione di prima con `VERSIONE_APP` alzata al valore che c'è nel cloud. Oggi vale 1 e non si alza. Nessuna prova: non cambia il comportamento. | — | `332cffb` |

Restano com'erano, per le ragioni scritte sopra e nel capitolo 5 di `revisione/cloud3/RAPPORTO.md`: M8, m6, m7, m8, m9, m10, m13.
