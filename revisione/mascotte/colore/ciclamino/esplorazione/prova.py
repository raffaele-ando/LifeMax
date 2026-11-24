import sys; sys.path.insert(0,'.')
from lib import *
W='#ffffff'
for H in (330,335,340,345,350):
  for L in (0.50,0.53,0.56,0.59):
    h=hx(L,0.20,H); print(H,L,h,fmt_lch(h),'bianco su',round(cr(W,h),2),'su pag scura #1a1817',round(cr(h,'#1a1817'),2),'su bianco',round(cr(h,W),2), 'airbnb',round(de(h,'#ff385c'),1),'tiimo',round(de(h,'#b9a5ef'),1))
