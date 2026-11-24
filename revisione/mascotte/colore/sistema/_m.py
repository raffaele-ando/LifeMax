import math
src=open('cvd.py').read().split('SET={')[0].replace("D=os.path.dirname(os.path.abspath(__file__))","")
exec(src)
def L(c): return 0.2126*lin(h(c)[0])+0.7152*lin(h(c)[1])+0.0722*lin(h(c)[2])
def C(a,b): A,B=L(a),L(b); return (max(A,B)+.05)/(min(A,B)+.05)
for a,b in [('#d9445a','#ffffff'),('#d9445a','#f7f6fb'),('#d9445a','#1c1c1e'),('#d9445a','#0e0e0f'),('#2b0f1c','#d9445a'),('#f4a3ae','#ffffff'),('#f5b440','#ffffff'),('#ffffff','#d9445a')]: print(a,b,round(C(a,b),2))
for a,b in [('#d9445a','#a32222'),('#d9445a','#b3342c'),('#d9445a','#e85c56'),('#d9445a','#e87ba4'),('#d9445a','#5b4ff5'),('#d9445a','#eb6834'),('#4a3aa7','#5b4ff5'),('#9085e9','#8f87ff'),('#16b364','#e85c56'),('#0f7a2e','#b3342c')]:
  print(a,b,'dE',round(dE(a,b,None),1),'deut',round(dE(a,b,M['deuteranopia']),1),'prot',round(dE(a,b,M['protanopia']),1))
