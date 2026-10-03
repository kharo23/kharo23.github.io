#!/usr/bin/env python3
"""Renderizza Caronte (luna di Plutone) in alta risoluzione per l'hero della home.

Uso:  /opt/homebrew/opt/python@3.13/bin/python3.13 tools/render-charon.py [N] [out.webp]
Richiede numpy e Pillow. Il risultato e' un WebP con trasparenza (sfera + bordo antialias).
Tutto e' deterministico (seed fisso): stesso output a ogni esecuzione.
"""
import sys
import numpy as np
from PIL import Image

N = int(sys.argv[1]) if len(sys.argv) > 1 else 1400
OUT = sys.argv[2] if len(sys.argv) > 2 else "assets/charon.webp"

# ---------- griglia di pixel -> coordinate sulla sfera ----------
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
u = (xx + 0.5) / N * 2 - 1
v = -((yy + 0.5) / N * 2 - 1)
r2 = u * u + v * v
inside = r2 < 1.0
z = np.sqrt(np.clip(1 - r2, 0, 1))

# orientamento: polo nord inclinato verso di noi, un po' ruotato
tilt, spin = np.radians(24), np.radians(-35)
def rot_x(x, y, zz, a):
    c, s = np.cos(a), np.sin(a)
    return x, c * y - s * zz, s * y + c * zz
def rot_y(x, y, zz, a):
    c, s = np.cos(a), np.sin(a)
    return c * x + s * zz, y, -s * x + c * zz
ox, oy, oz = rot_x(u, v, z, tilt)
ox, oy, oz = rot_y(ox, oy, oz, spin)
idx = inside.ravel()
P = np.stack([ox.ravel()[idx], oy.ravel()[idx], oz.ravel()[idx]], 1).astype(np.float64)

# ---------- rumore ----------
M32 = 0xFFFFFFFF
def hash32(ix, iy, iz, s):
    n = (ix * 374761393 + iy * 668265263 + iz * 1274126177 + s * 2246822519) & M32
    n = ((n ^ (n >> 13)) * 1274126177) & M32
    return (n ^ (n >> 16)) & M32

def vnoise(p, s=7):
    i = np.floor(p).astype(np.int64); f = p - i
    f = f * f * (3 - 2 * f)
    def g(a, b, c): return hash32(i[:, 0] + a, i[:, 1] + b, i[:, 2] + c, s) / 4294967296.0
    l = lambda a, b, t: a + (b - a) * t
    return l(l(l(g(0, 0, 0), g(1, 0, 0), f[:, 0]), l(g(0, 1, 0), g(1, 1, 0), f[:, 0]), f[:, 1]),
             l(l(g(0, 0, 1), g(1, 0, 1), f[:, 0]), l(g(0, 1, 1), g(1, 1, 1), f[:, 0]), f[:, 1]), f[:, 2])

def fbm(p, oct=5, lac=2.03, gain=0.5, s=7):
    a, tot, q = 0.5, 0.0, p.copy()
    for k in range(oct):
        tot += a * vnoise(q, s + k); q = q * lac + 7.1; a *= gain
    return tot

def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def craters(p, scale, seed, density, size, depth):
    """Crateri a cella: ogni cella puo' contenere un cratere con raggio e profondita' propri."""
    q = p * scale + seed * 13.7
    i = np.floor(q).astype(np.int64); f = q - i
    best = np.full(len(q), 9.0); rnd = np.zeros(len(q)); rnd2 = np.zeros(len(q))
    for k in (-1, 0, 1):
        for j in (-1, 0, 1):
            for m in (-1, 0, 1):
                h = hash32(i[:, 0] + m, i[:, 1] + j, i[:, 2] + k, seed)
                fx = (h & 0xFF) / 255.0; fy = ((h >> 8) & 0xFF) / 255.0; fz = ((h >> 16) & 0xFF) / 255.0
                d = np.sqrt((m + fx - f[:, 0]) ** 2 + (j + fy - f[:, 1]) ** 2 + (k + fz - f[:, 2]) ** 2)
                upd = d < best
                best = np.where(upd, d, best)
                rnd = np.where(upd, ((h >> 24) & 0xFF) / 255.0, rnd)
                rnd2 = np.where(upd, ((h >> 5) & 0xFF) / 255.0, rnd2)
    exists = (rnd2 < density).astype(np.float64)
    rad = size * (0.35 + 0.65 * rnd ** 1.6)          # raggio (in celle), molti piccoli e pochi grandi
    t = best / np.maximum(rad, 1e-3)
    bowl = -(1 - smooth(0.0, 1.0, t) ** 0.8) * (t < 1.05)
    flat = 1 - 0.55 * (1 - smooth(0.45, 1.0, t))      # fondo piu' piatto
    rim = np.exp(-((t - 1.04) / 0.17) ** 2) * 0.55
    ejecta = np.exp(-np.maximum(t - 1.15, 0) * 2.2) * (t > 1.15) * 0.06
    h = (bowl * flat + rim + ejecta) * (rad ** 0.65) * depth
    return h * exists, exists * (t < 1.1)

print("render", N, "px ...")
# ---------- altezza: crateri su piu' scale + terreno ----------
H = np.zeros(len(P)); floor = np.zeros(len(P))
for scale, seed, dens, size, depth in [(0.95, 1, 0.95, 0.46, 1.5), (2.1, 2, 0.8, 0.44, 1.1), (4.6, 3, 0.7, 0.43, 0.8),
                                       (10.0, 4, 0.55, 0.42, 0.45), (22.0, 5, 0.4, 0.40, 0.22), (48.0, 6, 0.3, 0.40, 0.12)]:
    h, fl = craters(P, scale, seed, dens, size, depth)
    H += h; floor = np.maximum(floor, fl)
    print("  octave", scale)
terrain = fbm(P * 3.0, 5, s=21) - 0.5
ridge = 1 - np.abs(fbm(P * 6.5, 4, s=31) * 2 - 1)
H += terrain * 0.45 + ridge * 0.10

# ---------- albedo ----------
mare = smooth(0.44, 0.58, fbm(P * 1.0 + 4.0, 4, s=41))           # zone scure ampie
base = 0.52 + (fbm(P * 1.8, 5, s=51) - 0.5) * 0.5
alb = base * (1 - 0.58 * mare)
alb *= 1 + np.clip(H, -1, 1) * 0.10                              # fondi un po' piu' scuri, bordi chiari
alb *= 1 - 0.14 * floor
alb += (hash32((P[:, 0] * 997).astype(np.int64), (P[:, 1] * 997).astype(np.int64), (P[:, 2] * 997).astype(np.int64), 3) / 4294967296.0 - 0.5) * 0.02
alb = np.clip(alb, 0.05, 1.0)
col = np.stack([alb * 1.0, alb * 0.99, alb * 0.965], 1)
# calotta polare rossastra (come Mordor Macula), bordo frastagliato
cap = smooth(0.30, 0.62, P[:, 1] + (fbm(P * 3.0, 5, s=61) - 0.5) * 0.45)
rust = np.array([0.55, 0.19, 0.08])
col = col * (1 - cap[:, None] * 0.82) + (alb * 1.15)[:, None] * rust[None, :] * cap[:, None] * 1.9

# ---------- tutto torna in 2D ----------
def to2d(a, fill=0.0):
    out = np.full(N * N, fill, np.float64); out[idx] = a; return out.reshape(N, N)
H2 = to2d(H)
col2 = np.stack([to2d(col[:, c]) for c in range(3)], 2)
H2 = H2 - H2[inside].mean()
def blur(a, passes=2):
    k = np.array([1, 2, 1], np.float64) / 4
    for _ in range(passes):
        a = np.apply_along_axis(lambda r: np.convolve(r, k, 'same'), 0, a)
        a = np.apply_along_axis(lambda r: np.convolve(r, k, 'same'), 1, a)
    return a
H2 = blur(H2, 1)                                                 # toglie i salti sui confini delle celle
gy, gx = np.gradient(H2)                                         # gradiente a schermo (smooth, nessuna quantizzazione)
gx = np.clip(gx * (N / 2), -2.5, 2.5); gy = np.clip(gy * (-N / 2), -2.5, 2.5)                                        # per unita' del disco; y a schermo e' invertita
fade = z ** 0.8
BUMP = 0.06
nx = u - BUMP * gx * fade; ny = v - BUMP * gy * fade; nz = z.copy()
nl = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-9; nx /= nl; ny /= nl; nz /= nl

# ---------- illuminazione ----------
L = np.array([-0.66, 0.38, 0.52]); L /= np.linalg.norm(L)
dif = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
geo = smooth(-0.06, 0.34, u * L[0] + v * L[1] + z * L[2])
lit = (dif ** 0.92) * geo
warm = np.array([1.00, 0.90, 0.76])
cool = np.array([0.10, 0.13, 0.20])
amb = 0.05 + 0.04 * (1 - z) ** 1.5                              # luce di rimbalzo, un filo piu' forte vicino al bordo
img = col2 * (lit[..., None] * warm[None, None, :] * 1.22 + (1 - geo)[..., None] * amb[..., None] * cool[None, None, :] * 2.2 + amb[..., None] * 0.35)
# bordo luminoso ambra sul lato della luce, bordo freddo sul lato scuro (separa il disco dallo sfondo)
fres = (1 - z) ** 3.2
side = smooth(-0.35, 0.8, u * L[0] + v * L[1])
img += fres[..., None] * (np.array([1.0, 0.66, 0.30])[None, None, :] * 0.75 * side[..., None] + np.array([0.22, 0.30, 0.50])[None, None, :] * 0.22 * (1 - side[..., None]))
# grana finissima, evita il banding nei gradienti
rng = np.random.default_rng(3)
img += (rng.random((N, N, 1)) - 0.5) * 0.012
img = np.clip(img, 0, 1) ** (1 / 2.05)

alpha = np.clip((1 - np.sqrt(r2)) * (N / 2) / 1.2, 0, 1)
rgba = np.dstack([img, alpha])
Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA").save(OUT, "WEBP", quality=92, method=6)
print("salvato", OUT)
