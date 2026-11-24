#!/bin/bash
# uso: bash emo-src/build.sh nome "Titolo"   → nome.html (inline emo.js + emo-src/nome.js)
cd "$(dirname "$0")/.."
n=$1; t=$2
{ cat <<H
<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>$t</title>
<style>html,body{margin:0;padding:0;background:#fff6f1;overflow:hidden}svg{display:block}</style></head>
<body>
<svg id="scena" width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"></svg>
<script src="base.js"></script>
<script>
H
cat emo-src/emo.js; echo; cat emo-src/$n.js
cat <<H
window.render=render; window.DURATA=DURATA;
render(Number(new URLSearchParams(location.search).get('t')||0));
</script>
</body></html>
H
} > $n.html
