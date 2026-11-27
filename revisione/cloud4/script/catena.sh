#!/bin/bash
# La catena delle prove del ramo, dal worktree della verifica 4 (a354d5c)
cd /tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/audit4/wt
export CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
export LIFEMAX_EMULATORE=/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad/audit-cloud/fbt
mkdir -p ../ris/catena; : > ../ris/catena/esiti.txt
for t in nuvola-spazio nuvola-account nuvola-fusione impronte lezioni dati cloud ripristino pacco duedispositivi trasloco annulla calendari-server sentinella calendari-intoppi calendari senzarete nuvola-verifica2 nuvola-verifica3 calendari-github nuvola-ricarica nuvola-calendario; do
  timeout 2400 node prove/$t.js > ../ris/catena/r-$t.txt 2>&1; echo "$t $?" >> ../ris/catena/esiti.txt
done
echo FINE >> ../ris/catena/esiti.txt
