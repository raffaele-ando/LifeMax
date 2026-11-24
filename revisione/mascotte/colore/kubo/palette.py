import math, json, itertools
def srgb2lin(c): c/=255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lin2srgb(c): c=max(0,min(1,c)); return 255*(12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055)
def hex2rgb(h): h=h.lstrip('#'); return [int(h[i:i+2],16) for i in (0,2,4)]
def rgb2hex(r): return '#'+''.join(f'{round(x):02x}' for x in r)
def oklab(h):
    r,g,b=[srgb2lin(x) for x in hex2rgb(h)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b; m=0.2119034982*r+0.6806995451*g+0.1073969566*b; s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    return (0.2104542553*l+0.7936177850*m-0.0040720468*s, 1.9779984951*l-2.4285922050*m+0.4505937099*s, 0.0259040371*l+0.7827717662*m-0.8086757660*s)
def oklch2hex(L,C,H):
    a=C*math.cos(math.radians(H)); b=C*math.sin(math.radians(H))
    l=(L+0.3963377774*a+0.2158037573*b)**3; m=(L-0.1055613458*a-0.0638541728*b)**3; s=(L-0.0894841775*a-1.2914855480*b)**3
    r=4.0767416621*l-3.3077115913*m+0.2309699292*s; g=-1.2684380046*l+2.6097574011*m-0.3413193965*s; bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    return rgb2hex([lin2srgb(x) for x in (r,g,bb)])
def lum(h): r,g,b=[srgb2lin(x) for x in hex2rgb(h)]; return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): A,B=sorted([lum(a),lum(b)],reverse=True); return (A+.05)/(B+.05)
def de(a,b): return 100*math.dist(oklab(a),oklab(b))
def lch(h): L,a,b=oklab(h); return (round(L,3),round(math.hypot(a,b),3),round(math.degrees(math.atan2(b,a))%360))
# deuteranopia (Machado 2009, severità 1)
M=[[0.367322,0.860646,-0.227968],[0.280085,0.672501,0.047413],[-0.011820,0.042940,0.968881]]
def deut(h):
    r=[srgb2lin(x) for x in hex2rgb(h)]; o=[sum(M[i][j]*r[j] for j in range(3)) for i in range(3)]
    return rgb2hex([lin2srgb(x) for x in o])
