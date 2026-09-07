/* UNA COSA CHE SI SA ESSERCI.

   Il modo di dire «l'ho appena cercata e l'ho trovata». `findIndex` dà un
   indice, la riga dopo lo controlla, e `arr[i]` per il compilatore resta
   comunque «forse niente»: lui non collega le due righe. Questa funzione dice
   una volta sola quello che si sa, invece di ripeterlo con un punto
   esclamativo in trenta posti — dove uno dei trenta, un giorno, finirà dove
   non si sa affatto.

   È l'UNICA affermazione non controllata di tutto il progetto, e sta in un
   file suo perché così si conta: `grep -c presa` dice quante volte in tutta
   l'app si è detto al compilatore «fidati». Se quel numero cresce senza una
   ragione, la ragione è che si sta usando al posto di un controllo.

   SI USA SOLO subito dopo un controllo sull'indice, o su una tabella scritta
   a mano di cui si vede la riga due centimetri sopra. Mai per «speriamo».

   Prende anche `null` e non solo `undefined`, perché `querySelector` risponde
   `null`: «l'HTML l'ho appena scritto io tre righe sopra, e questo nodo ci
   sta dentro» è la stessa affermazione di «l'indice l'ho appena
   controllato». */
export function presa<T>(v: T | undefined | null): T { return v as T; }
