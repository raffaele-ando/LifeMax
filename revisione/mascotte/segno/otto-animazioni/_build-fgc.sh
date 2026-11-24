#!/bin/bash
# costruisce NOME.html da _NOME.src.js + kit (le pagine restano autonome, caricano solo base.js)
cd "$(dirname "$0")"
for n in "$@"; do
python3 - "$n" <<'P'
import sys; n=sys.argv[1]
kit=open('_kit-fgc.js').read(); src=open(f'_{n}.src.js').read()
titolo={'fatta':'Segno — cosa fatta','giornata':'Segno — giornata chiusa','concentrazione':'Segno — fine concentrazione'}[n]
html=f'''<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>{titolo}</title>
<style>
  html,body{{margin:0;padding:0;background:#fff6f1;overflow:hidden}}
  svg{{display:block}}
  text{{font-family:'Inter Display','Inter',sans-serif}}
</style></head>
<body>
<svg id="scena" width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"></svg>
<script src="base.js"></script>
<script>
{kit}
{src}
window.render=render; window.DURATA=DURATA;
render(Number(new URLSearchParams(location.search).get('t')||0));
</script>
</body></html>
'''
open(f'{n}.html','w').write(html)
P
done
