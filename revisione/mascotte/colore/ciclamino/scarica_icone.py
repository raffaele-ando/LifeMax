import json,urllib.request,urllib.parse,time,sys,os
apps=["todoist","things 3 cultured code","ticktick","notion","tiimo","structured daily planner","finch self care","habitica","forest focus","headspace","duolingo","airbnb","phantom wallet","brilliant learn math","inflow adhd","goblin tools","fabulous daily routine planner","routinery","llama life","sunsama","calm sleep meditation","amazing marvin","todo microsoft","any.do","motion ai planner","linear app"]
out={}
for q in apps:
    for t in range(3):
        try:
            u="https://itunes.apple.com/search?"+urllib.parse.urlencode({"term":q,"entity":"software","country":"it","limit":1})
            r=json.load(urllib.request.urlopen(u,timeout=20))["results"]
            break
        except Exception as e:
            time.sleep(2); r=None
    if not r: print("NONE",q); continue
    a=r[0]; fn=q.split()[0].replace('.','')+".jpg"
    urllib.request.urlretrieve(a["artworkUrl512"],fn)
    out[q]={"nome":a["trackName"],"venditore":a.get("sellerName"),"file":fn,"url":a["trackViewUrl"]}
    print(q,"->",a["trackName"],"|",a.get("sellerName"))
    time.sleep(0.5)
json.dump(out,open("icone.json","w"),indent=1,ensure_ascii=False)
