"""Funzioni colore. Riprende palette.py (verificata: rosso sRGB -> OKLab L .628 C .258 h 29.2, come Ottosson 2020)
e aggiunge controllo di gamut, protanopia e tritanopia (Machado, Oliveira & Fernandes 2009, severità 1.0)."""
import math
from palette import srgb2lin, lin2srgb, hex2rgb, rgb2hex, oklab, lum, cr, de, deut

def oklch2rgb_lin(L, C, H):
    a = C*math.cos(math.radians(H)); b = C*math.sin(math.radians(H))
    l = (L+0.3963377774*a+0.2158037573*b)**3; m = (L-0.1055613458*a-0.0638541728*b)**3; s = (L-0.0894841775*a-1.2914855480*b)**3
    return (4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s)

def in_gamut(L, C, H, eps=1e-4):
    return all(-eps <= x <= 1+eps for x in oklch2rgb_lin(L, C, H))

def hx(L, C, H):
    """OKLCH -> hex; se fuori gamut riduce il croma (come CSS Color 4, mappatura sul croma)."""
    c = C
    while c > 0 and not in_gamut(L, c, H): c -= 0.002
    return rgb2hex([lin2srgb(x) for x in oklch2rgb_lin(L, max(c, 0), H)])

def lch(h):
    L, a, b = oklab(h); return (L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360)

def fmt_lch(h):
    L, C, H = lch(h); return f"oklch({L*100:.1f}% {C:.3f} {H:.0f})"

_P = [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]]
_T = [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]
def _sim(h, M):
    r = [srgb2lin(x) for x in hex2rgb(h)]; o = [sum(M[i][j]*r[j] for j in range(3)) for i in range(3)]
    return rgb2hex([lin2srgb(x) for x in o])
def prot(h): return _sim(h, _P)
def trit(h): return _sim(h, _T)
def ded(a, b): return de(deut(a), deut(b))
def dep(a, b): return de(prot(a), prot(b))
def det(a, b): return de(trit(a), trit(b))
def comp(fg, bg, alpha):
    """colore fg con opacità alpha sopra bg"""
    F, B = hex2rgb(fg), hex2rgb(bg); return rgb2hex([alpha*f+(1-alpha)*b for f, b in zip(F, B)])
