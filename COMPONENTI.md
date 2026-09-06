# I componenti di LifeMax

Il catalogo. Ogni forma dell'interfaccia sta scritta qui una volta, e da qui
si prende — invece di reinventarla ogni volta.

Non è un elenco di buone intenzioni: è stato **contato**. Nel markup generato
da `app.js` ci sono **544 classi diverse** e **1630 usi**, e sotto ci sono
molte meno forme di quante sembrino.

## Perché serve, misurato

Cinquecentosessantasei punti in cui una forma che esiste già viene riscritta a
mano. E, peggio, **lo stesso mestiere sotto nomi diversi** — trovati
confrontando le regole CSS, non i nomi:

| il mestiere | quanti nomi | quali |
|---|---|---|
| una nota sotto a qualcosa | **7** | `lista-nota` `imp-nota` `sc-nota` `agg-nota` `sm-nota` `ob-account-nota` `diag-nota` |
| l'etichetta di una riga | **8** | `sc-eti` `lista-eti` `imp-eti` `agg-eti` `stat-eti` `som-eti` `seg-eti` `conc-eti` |
| una riga di elenco | **7** | `lista-riga` `sc-riga` `rev-riga` `lez-riga` `bil-riga` `som-riga` `agg-riga` |
| un segno accanto al testo | **6** | `seg-ico` `diario-ico` `sm-porta-ico` `rev-ico` `fs-ico` `lista-azione` |
| il titolo di una riga | **5** | `lista-tit` `sm-titolo` `som-nome` `bil-nome` `ob-titolo` |
| il valore di una riga | **4** | `sc-val` `lista-val` `stat-val` `som-pc` |
| una pastiglia da scegliere | **4** | `q-chip` `chip` `agg-area` `q-chip-data` |
| lo stato vuoto | **3** | `vuoto` `som-vuoto` `som-vuota` |

E cinque coppie che dichiarano **esattamente le stesse proprietà**, al 100%:
`exp-testa`≡`riga-flex`, `lista-azioni`≡`sp-pasti`, `som-eti`≡`me-piu`,
`abd-orario`≡`sp-riga`, `agg-ora`≡`agg-area`.

Nessuno ha sbagliato. Ogni volta serviva una nota sotto a qualcosa, e ogni
volta il posto più vicino non ce l'aveva: se ne faceva una. Sette volte.

**Non è più lento riscrivere una forma a mano: è più fragile.** La differenza
fra due righe scritte in due punti diversi non si vede finché qualcuno non
cambia il CSS, e allora si rompe in una schermata sola. È così che sono nati
quasi tutti i difetti trovati dall'audit — tredici pesi tipografici, quattro
tasti pieni insieme.

## Come si usano

Due gemelli con le **stesse identiche proprietà**, così il lavoro si fa una
volta sola:

```js
   PZ.tasto({ testo: 'Salva', ico: 'save', tipo: 'pieno' })   // assets/pezzi.js
   <Tasto    testo="Salva"    ico="save"   tipo="pieno" />    // react/src/pezzi.jsx
```

**Le proprietà dicono il RUOLO, mai l'aspetto.** `tipo: 'pieno'` e non
`tipo: 'blu'`: così la regola di `DESIGN.md` — uno pieno per schermata — vive
nel codice invece che nelle teste di chi lo scrive.

`prove/pezzi.js` è un **cricchetto**: conta le forme scritte a mano e non le
lascia aumentare. Ogni volta che scendono si abbassa il tetto.

---

# I mattoni

### `Segno` — un'icona accanto a del testo
Assorbe: `seg-ico` `diario-ico` `sm-porta-ico` `rev-ico` `fs-ico` `lista-azione`

    nome    quale disegno (icons.js)
    dim     11 · 13 · 15 · 18 · 26   — la scala, e non altri numeri

### `Etichetta` — il nome di una cosa, dentro a una riga
Assorbe: `sc-eti` `lista-eti` `imp-eti` `agg-eti` `stat-eti` `som-eti` `seg-eti` `conc-eti`

    testo   ·   ico   ·   per   (l'id del controllo che etichetta)

### `Valore` — quanto vale adesso quella cosa
Assorbe: `sc-val` `lista-val` `stat-val` `som-pc`

    testo   ·   forte (true = è il dato principale della riga)

### `Titolo` — il nome della cosa in una riga di elenco
Assorbe: `lista-tit` `sm-titolo` `som-nome` `bil-nome` `ob-titolo`

    testo   ·   fatta (true = barrato)

### `Nota` — la spiegazione sotto a qualcosa
Assorbe: `lista-nota` `imp-nota` `sc-nota` `agg-nota` `sm-nota` `ob-account-nota` `diag-nota`

    dice    testo normale, scappato
    html    quando dentro ci sono <b> voluti
    tono    'normale' | 'attenzione' | 'pericolo'

---

# I blocchi

### `Tasto`
Assorbe le 13 varianti di `btn-*`.

    testo · ico · sotto (il <small> dentro) · id · via (diventa <a>)
    tipo    RUOLO, non colore:
              pieno     l'azione della schermata. UNA per schermata.
              tonale    salva un blocco dentro a una schermata più lunga
              quieto    si può fare, non è la cosa principale
              chiude    verde: la conferma che chiude qualcosa
              pericolo  rosso: l'unica azione che distrugge
    misura  normale | grande | mini
    spento · etichetta (per chi non vede)

### `Riga` — una riga di elenco
Assorbe: `lista-riga` `sc-riga` `rev-riga` `lez-riga` `bil-riga` `som-riga` `agg-riga`

    mestiere  porta   ti porta altrove       → ha la freccetta
              fa      fa una cosa adesso     → non ce l'ha: non si va via
              ferma   si legge e basta       → non è un bottone
    Due forme, e si escludono:
      eti + valore          la riga fitta dei pannelli (mette `sc-riga` da sé)
      titolo + sotto + ico  la riga di un elenco vero
    coda      quello che va in fondo (una spunta, un menù)

### `Elenco`, `Scheda`
    Elenco:  righe · id
    Scheda:  titolo · sotto · ico · dentro

### `Campo`
    eti · nome · valore · segnaposto · genere · righe (>0 = area di testo)
    tastiera (inputmode) · nota · spento

### `Pastiglie` — una scelta fra poche cose, tutte visibili
Assorbe: `q-chip` `chip` `agg-area` `q-chip-data`

    voci [{ val, eti, ico }] · scelta · chiave (il nome del data-)

### `Segmenti` — una scelta che vale subito
    Come Pastiglie, ma dice ANCHE quale scelta è in vigore. La seconda metà si
    dimenticava a mano: prove/clic.js la pretende.

### `Statistica`
    valore · eti · ico

### `Niente` — lo stato vuoto
Assorbe: `vuoto` `som-vuoto` `som-vuota`

    titolo · dice · azione
    Dice DUE cose: che non c'è niente, e cosa farci. La seconda mancava in
    metà dei posti.

### `RigaFlex` — due o tre cose in fila
Assorbe: `riga-flex` `exp-testa` `focus-azioni-riga` `abd-periodo`
(le prime due dichiarano proprietà identiche al 100%)

    dentro · spaziatura ('fra' | 'inizio' | 'fine') · sopra (mt | mt-s)

### `Barra` — quanto sei arrivato
Assorbe: `fs-barra` `bil-barra` `ab-prog-barra`

    quota (0…1) · colore (di solito quello dell'area) · alta

---

# Le strutture

### `Testa` — la riga in cima a una schermata
    titolo · sottotitolo · destra
    C'è solo dove tiene un comando: il nome della schermata sta nella
    navigazione, e ripeterlo sarebbe dirlo due volte.

### `Pannello` — il foglio dal basso, la modale al centro
    titolo · dentro · indietro (il nome del posto da cui vieni)
    Una via d'uscita sola: col dito la maniglia, col mouse la ✕.

### `Sezioni` — le linguette dentro a una porta
    voci · quale
    Tutte le barre di sezione hanno la stessa forma e la stessa altezza:
    prove/sezioni.js lo pretende.

### `Avviso` — il messaggio che passa
    dice · azione (l'annulla) · durata

---

# L'ordine in cui si migra

Non si converte tutto in un colpo: si sbaglia. Si va da quello che si ripete
di più, che è anche quello che rende di più:

    1. Tasto        86 punti      6. Nota         22 (e 7 nomi diventano 1)
    2. Riga         29 + 7 nomi   7. Etichetta    17 (e 8 nomi diventano 1)
    3. Scheda       35            8. Segmenti     14
    4. Elenco       31            9. Statistica    6
    5. Campo        30           10. Niente        9

Ogni forma che passa ai pezzi in vanilla è **una forma già pronta per React**,
perché le proprietà sono le stesse. Il lavoro non si fa due volte.
