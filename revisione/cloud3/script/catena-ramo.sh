#!/bin/bash
# Copia di smoke/tutte.sh del correttore, ma dal worktree di questa verifica (audit-3/wt).
S=/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad
cd $S/audit-3/wt
export CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
export LIFEMAX_EMULATORE=$S/audit-cloud/fbt
OUT=$S/audit-3/smoke
: > $OUT/esiti.txt
for t in ${ELENCO:-nuvola-spazio nuvola-account nuvola-fusione impronte lezioni dati cloud ripristino pacco duedispositivi trasloco annulla calendari-server sentinella calendari-intoppi calendari senzarete nuvola-verifica2}; do
  timeout 2400 node prove/$t.js > $OUT/r-$t.txt 2>&1; echo "$t $?" >> $OUT/esiti.txt
done
echo FINE >> $OUT/esiti.txt
