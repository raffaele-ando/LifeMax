"""Scontorna le 6 figure singole di Kubo (PNG RGB su bianco) -> PNG con trasparenza, ombra a terra resa come nero semitrasparente."""
import glob
import numpy as np
from PIL import Image, ImageDraw
fs = sorted(glob.glob('../../kubo-zip/kubo/*.png'))
SING = (0, 1, 4, 15, 16, 19)
for n, i in enumerate(SING):
    im = Image.open(fs[i]).convert('RGB').resize((640, 640), Image.LANCZOS)
    a = np.asarray(im).astype(float)
    deficit = 255 - a.min(axis=2)              # quanto il pixel si allontana dal bianco
    bg = (deficit <= 7).astype(np.uint8) * 255
    m = Image.fromarray(bg, 'L').copy()
    for seed in ((0, 0), (639, 0), (0, 639), (639, 639)):
        if m.getpixel(seed) == 255: ImageDraw.floodfill(m, seed, 128)
    sfondo = np.asarray(m) == 128
    fg = ~sfondo
    # l'ombra: componente in basso, separata dal corpo -> la trovo con un floodfill sui pixel non-sfondo
    fgimg = Image.fromarray(fg.astype(np.uint8) * 255, 'L').copy()
    ys, xs = np.where(fg[540:, 200:440]); ombra = np.zeros_like(fg)
    if len(ys):
        k = ys.argmax(); seed = (int(xs[k] + 200), int(ys[k] + 540))
        ImageDraw.floodfill(fgimg, seed, 77); ombra = np.asarray(fgimg) == 77
        if ombra.sum() > 0.08 * fg.sum(): ombra[:] = False   # troppo grande: non è l'ombra
    corpo = fg & ~ombra
    # anello di bordo: pixel del corpo che toccano lo sfondo
    vic = np.zeros_like(sfondo)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            vic |= np.roll(np.roll(sfondo, dy, 0), dx, 1)
    bordo = corpo & vic
    alpha = np.where(corpo, 1.0, 0.0)
    alpha[bordo] = np.clip(deficit[bordo] / 40.0, 0, 1)
    rgb = a.copy()
    sel = bordo & (alpha > 0)
    rgb[sel] = np.clip((a[sel] - (1 - alpha[sel, None]) * 255) / alpha[sel, None], 0, 255)
    # ombra: nero-notte con alfa proporzionale al deficit
    rgb[ombra] = (20, 26, 60)
    alpha[ombra] = np.clip(deficit[ombra] / 255.0 * 2.2, 0, 0.35)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(f'ritagli/kubo-{n}.png')
    print(n, i, 'ombra px', int(ombra.sum()), 'corpo px', int(corpo.sum()))
