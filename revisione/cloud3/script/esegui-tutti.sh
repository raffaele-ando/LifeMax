#!/bin/bash
# Rilancia tutti i riproduttori della verifica 1 (adattati: r1/) e 2 sul worktree audit-3/wt.
S=/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad
export AUDIT=$S/audit-3 FSP=9480 AUP=9499 PORTA=9411 PORTA_C02=8971
export CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
cd $AUDIT/consegna/script
LOG=$AUDIT/consegna/risultati/log
ELENCO=${ELENCO:-"n01-dispositivo-condiviso n01b-schermate-backup n02-eventi-accesso n03-rete n04-orologi n05-funzioni n06-versioni n07-trasloco n08-orologi-lontani n09-apertura-offline c01-sentinella-sicurezza c02-calendari-app r1/s00-fumo r1/r01-offline-ritorno r1/r02-annullare-risorge r1/r03-profilo-nuovo-dispositivo r1/r04-fuga-account r1/r05-pc-sordo r1/s01-concorrenza r1/s02-funzioni r1/s03-conflitti r1/s04-account r1/s05-tanti-dati r1/s06-ipad-vecchio r1/s07-calendari r1/s08-varie r1/s09-memoria-cancellata r1/s10-copie-cloud r1/s11-due-indirizzi"}
for t in $ELENCO; do
  n=$(echo $t | tr / -)
  echo "== $t $(date +%T)" >> $LOG/esiti.txt
  timeout 1500 node $t.js > $LOG/log-$n.txt 2>&1; c=$?
  echo "$t exit=$c ok=$(grep -c '^  ok' $LOG/log-$n.txt) KO=$(grep -c '^  KO' $LOG/log-$n.txt)" >> $LOG/esiti.txt
done
echo FINE >> $LOG/esiti.txt
