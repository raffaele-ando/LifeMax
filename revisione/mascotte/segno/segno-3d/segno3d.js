/* SEGNO 3D — un nastro di raso vero.
   - Il corpo è una striscia con spessore costruita lungo una spina che si piega in 3D
     (in avanti/indietro, di lato, torsione), con la tacca a V in basso: i due piedi.
   - Il RISVOLTO non è un disegno: è la cima del nastro piegata su una cerniera. Quando cade
     davanti mostra il rovescio del raso (più chiaro). Si muove con una fisica a pendolo:
     molla del tessuto + gravità + accelerazione del corpo (nel salto galleggia, all'atterraggio sbatte).
   - Le tracce di animazione usano spline di Catmull-Rom: la velocità è continua fra le chiavi,
     niente fermate a ogni chiave (era la causa degli scatti). */
import * as THREE from './node_modules/three/build/three.module.js';

export const COL = { corpo: 0xd9445a, rovescio: 0xf6b3bc, occhi: 0x2b0f1c, fondo: 0xfff6f1, oro: 0xf5b440 };

/* ---------- tracce: Catmull-Rom, velocità continua ---------- */
export function traccia(chiavi) {               // chiavi: [[t, v], ...]
  return t => {
    const k = chiavi, n = k.length;
    if (t <= k[0][0]) return k[0][1];
    if (t >= k[n - 1][0]) return k[n - 1][1];
    let i = 0; while (k[i + 1][0] < t) i++;
    const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(n - 1, i + 2)];
    const h = p2[0] - p1[0], u = (t - p1[0]) / h;
    /* tangenti scalate sull'intervallo (Catmull-Rom non uniforme); agli estremi tangente nulla */
    const m1 = i === 0 ? 0 : (p2[1] - p0[1]) / (p2[0] - p0[0]) * h;
    const m2 = i + 2 >= n ? 0 : (p3[1] - p1[1]) / (p3[0] - p1[0]) * h;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
  };
}

/* ---------- geometria del nastro ---------- */
const W = 1.0, L = 1.45, T = 0.08, F = 0.3, TACCA = 0.32, BOMBA = .09;
const NU = 14, NV = 56, NF = 18;

function telaio(p) {   // dalla posa ai punti della spina: posizione, tangente, lato, normale
  const pts = [];
  let pos = new THREE.Vector3(0, 0, 0);
  const sy = p.sy, ds = L * sy / NV;
  for (let j = 0; j <= NV; j++) {
    const v = j / NV;
    const pitch = p.incl + p.piega * v + p.esse * Math.sin(v * Math.PI * 2) + p.onda * Math.sin(v * Math.PI * 2 - p.fase);
    const roll = p.lato * v + p.latoBase;
    const tw = p.tors * v;
    const e = new THREE.Euler(pitch, tw, -roll, 'ZXY');
    const q = new THREE.Quaternion().setFromEuler(e);
    const tan = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const side = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
    const nor = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    pts.push({ pos: pos.clone(), tan, side, nor, v });
    pos.addScaledVector(tan, ds);
  }
  return pts;
}
const largh = (v, p) => W * p.sx * (1 - .07 * Math.sin(Math.PI * Math.min(1, v * 1.2)));

/* una striscia spessa generica: f(i,j) -> {c: centro, s: lato unitario, n: normale}, griglia NU x NV */
function striscia(geo, nu, nv, f, sp) {
  const P = [];
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const { c, n } = f(i, j);
    P.push(c.clone().addScaledVector(n, sp / 2), c.clone().addScaledVector(n, -sp / 2));
  }
  const id = (i, j, b) => ((j * (nu + 1) + i) * 2 + b);
  const pos = new Float32Array(P.length * 3); P.forEach((p, k) => { pos[k * 3] = p.x; pos[k * 3 + 1] = p.y; pos[k * 3 + 2] = p.z; });
  if (!geo.index) {
    const fr = [], bk = [], ed = [];
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = id(i, j, 0), b = id(i + 1, j, 0), c = id(i + 1, j + 1, 0), d = id(i, j + 1, 0);
      fr.push(a, b, c, a, c, d);
      const a2 = id(i, j, 1), b2 = id(i + 1, j, 1), c2 = id(i + 1, j + 1, 1), d2 = id(i, j + 1, 1);
      bk.push(a2, c2, b2, a2, d2, c2);
    }
    const bordo = (seq) => { for (let k = 0; k < seq.length - 1; k++) { const [i1, j1] = seq[k], [i2, j2] = seq[k + 1];
      ed.push(id(i1, j1, 0), id(i1, j1, 1), id(i2, j2, 1), id(i1, j1, 0), id(i2, j2, 1), id(i2, j2, 0)); } };
    const sx = [], dx = [], su = [], giu = [];
    for (let j = 0; j <= nv; j++) { sx.push([0, j]); dx.push([nu, nv - j]); }
    for (let i = 0; i <= nu; i++) { su.push([i, nv]); giu.push([nu - i, 0]); }
    bordo(sx); bordo(su); bordo(dx); bordo(giu);
    geo.setIndex([...fr, ...bk, ...ed]);
    geo.addGroup(0, fr.length, 0); geo.addGroup(fr.length, bk.length, 1); geo.addGroup(fr.length + bk.length, ed.length, 2);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.computeVertexNormals();
}

export function creaSegno(scene) {
  const mat = c => new THREE.MeshBasicMaterial({ color: c });
  const mCorpo = mat(COL.corpo), mRov = mat(COL.rovescio), mBordo = mat(COL.corpo);
  const gCorpo = new THREE.BufferGeometry(), gRisv = new THREE.BufferGeometry();
  const corpo = new THREE.Mesh(gCorpo, [mCorpo, mCorpo, mBordo]);
  /* il risvolto: davanti (quando è dritto) = raso corallo, dietro = rovescio chiaro */
  const risv = new THREE.Mesh(gRisv, [mCorpo, mRov, mBordo]);
  const g = new THREE.Group(); g.add(corpo, risv); scene.add(g);
  /* occhi: neri lucidi con il riflesso */
  const mOcc = new THREE.MeshBasicMaterial({ color: COL.occhi });
  const mLuce = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const occhi = [-1, 1].map(() => {
    const o = new THREE.Group();
    const palla = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mOcc);
    const luce = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mLuce);
    const arco = new THREE.Mesh(new THREE.BufferGeometry(), mOcc);
    o.add(palla, luce, arco); g.add(o); return { o, palla, luce, arco };
  });
  /* ombra morbida a terra */
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const cx = cv.getContext('2d'), gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
  cx.fillStyle = '#f3dcd6'; cx.beginPath(); cx.arc(64, 64, 62, 0, Math.PI * 2); cx.fill();
  const ombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
  ombra.position.set(0, -.02, -.6); scene.add(ombra);

  function posa(p) {
    const S = telaio(p);
    /* CORPO: colonne dalla tacca (in basso) alla cima */
    const centro = (i, j) => {
      const u = i / NU - .5, au = Math.abs(u) * 2;
      const v0 = TACCA * (1 - au);                         // la V della tacca
      const v = v0 + (1 - v0) * (j / NV) ;                 // lungo il corpo
      const jf = v * NV, j0 = Math.min(NV - 1, Math.floor(jf)), fr = jf - j0;
      const a = S[j0], b = S[j0 + 1];
      const c = a.pos.clone().lerp(b.pos, fr), s = a.side.clone().lerp(b.side, fr).normalize(), n = a.nor.clone().lerp(b.nor, fr).normalize();
      c.addScaledVector(s, u * largh(v, p)).addScaledVector(n, BOMBA * (1 - 4 * u * u));
      /* piedi: le due punte si aprono / si alzano */
      const piede = Math.max(0, 1 - v / (TACCA + .05));
      if (piede > 0) { const pd = u < 0 ? p.piedeS : p.piedeD; c.x += Math.sign(u) * pd[0] * piede * au; c.y += pd[1] * piede * au; }
      return { c, n };
    };
    striscia(gCorpo, NU, NV, centro, T);
    /* RISVOLTO: incernierato sul bordo alto. a = angolo (0 = dritto in su, PI = steso davanti) */
    const top = S[NV];
    const risvC = (i, j) => {
      const u = i / NU - .5, s = j / NF;
      const a = p.risv + p.risvInc * u * 2 + p.ricciolo * s;     // inclinazione asimmetrica + ricciolo della stoffa
      /* la piega gira attorno al lato del telaio della cima */
      const q = new THREE.Quaternion().setFromAxisAngle(top.side, a);
      const dir = top.tan.clone().applyQuaternion(q), nor = top.nor.clone().applyQuaternion(q);
      /* integrazione lungo la piega (il ricciolo la curva) */
      const ds = F / NF;
      let c = top.pos.clone().addScaledVector(top.side, u * largh(1, p) * 1.02).addScaledVector(top.nor, BOMBA * (1 - 4 * u * u))
        .addScaledVector(top.nor, T * (1 - Math.cos(p.risv)) / 2);
      for (let k = 0; k < j; k++) { const ak = p.risv + p.risvInc * u * 2 + p.ricciolo * k / NF;
        const qk = new THREE.Quaternion().setFromAxisAngle(top.side, ak); c.addScaledVector(top.tan.clone().applyQuaternion(qk), ds); }
      return { c, n: nor };
    };
    striscia(gRisv, NU, NF, risvC, T * .8);
    /* OCCHI sul davanti del corpo */
    const vo = p.occhiV, jf = vo * NV, j0 = Math.floor(jf), fr = jf - j0, a = S[j0], b = S[j0 + 1];
    const c = a.pos.clone().lerp(b.pos, fr), s = a.side.clone().lerp(b.side, fr).normalize(), n = a.nor.clone().lerp(b.nor, fr).normalize(), tn = a.tan.clone().lerp(b.tan, fr).normalize();
    const base = new THREE.Matrix4().makeBasis(s, tn, n);
    occhi.forEach((e, k) => {
      const l = k ? 1 : -1, ap = k ? p.apriD : p.apriS;
      const pos = c.clone().addScaledVector(s, l * p.occhiDist * p.sx + p.sguardo[0]).addScaledVector(tn, p.sguardo[1]).addScaledVector(n, T / 2 + BOMBA * (1 - 4 * Math.pow((l * p.occhiDist) / W, 2)) + .004);
      e.o.position.copy(pos); e.o.quaternion.setFromRotationMatrix(base);
      const R = .125 * p.occhioK;
      if (ap > .06) {        // ovale aperto (ap 0..1 = palpebra)
        e.palla.visible = e.luce.visible = true; e.arco.visible = false;
        e.palla.scale.set(R * .8, R * 1.05 * ap, R * .35); e.palla.position.set(0, 0, 0);
        e.luce.scale.setScalar(R * .26 * Math.min(1, ap * 1.6)); e.luce.position.set(-R * .28, R * .42 * ap, R * .3);
      } else {               // archi: ap da .06 (riga) a -1 (felice pieno)
        e.palla.visible = e.luce.visible = false; e.arco.visible = true;
        const k2 = Math.max(0, -ap + .06) / 1.06, w = R * .85, h = R * .9 * k2;
        const cur = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w, -h * .4, 0), new THREE.Vector3(0, h * 1.6 - h * .4, 0), new THREE.Vector3(w, -h * .4, 0));
        e.arco.geometry.dispose(); e.arco.geometry = new THREE.TubeGeometry(cur, 24, R * .2, 10, false);
        e.arco.scale.set(1, 1, .5);
      }
    });
    ombra.scale.set(1.3 * p.sx / (1 + p.y * .9), .26 / (1 + p.y * .9), 1); ombra.material.opacity = 1;
    g.position.set(p.x, p.y, 0); g.rotation.y = p.giro;
  }
  return { posa, gruppo: g };
}

export const POSA0 = { x: 0, y: 0, giro: 0, sx: 1, sy: 1, incl: 0, piega: 0, esse: 0, onda: 0, fase: 0, lato: 0, latoBase: 0, tors: 0,
  piedeS: [0, 0], piedeD: [0, 0], risv: 2.5, risvInc: 0, ricciolo: .9, occhiV: .7, occhiDist: .2, occhioK: 1, apriS: 1, apriD: 1, sguardo: [0, 0] };

/* ---------- scena ---------- */
export function scena(canvas) {
  const vuoto = /trasparente/.test(location.search);
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: vuoto });
  r.setPixelRatio(1); r.setSize(1080, 1080, false);
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
  const s = new THREE.Scene(); if (!vuoto) s.background = new THREE.Color(COL.fondo);
  const cam = new THREE.PerspectiveCamera(12, 1, .1, 80); cam.position.set(0, 1.6, 12.5); cam.lookAt(0, .85, 0);
  s.add(new THREE.HemisphereLight(0xfff3ee, 0xe9c8c0, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-2.5, 4, 4); s.add(key);
  const rim = new THREE.DirectionalLight(0xffe2d0, 1.6); rim.position.set(3, 2.5, -3); s.add(rim);
  const fill = new THREE.DirectionalLight(0xffd6dc, .6); fill.position.set(3, .5, 3); s.add(fill);
  return { r, s, cam };
}

/* ---------- fisica secondaria, deterministica ----------
   Il risvolto è un pendolo sulla cerniera: molla verso l'angolo voluto, smorzamento,
   gravità efficace = g + accelerazione verticale del corpo (nel salto -> quasi zero: galleggia). */
export function simulaRisvolto(dur, obiettivo, altezza, inclinazioneCima, opz = {}) {
  const dt = 1 / 960, n = Math.ceil(dur / dt) + 2;
  const k = opz.k || 60, c = opz.c || 5.5, G = opz.G || 26;
  const out = new Float32Array(n); let a = obiettivo(0), w = 0;
  const yAt = t => altezza(t);
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    const acc = (yAt(t + dt) - 2 * yAt(t) + yAt(t - dt)) / (dt * dt);
    const geff = Math.max(-.5, 1 + acc / 9.8);
    /* gravità: rispetto alla verticale del mondo (la cima può essere inclinata) */
    const ang = a + inclinazioneCima(t);
    const tq = -k * (a - obiettivo(t)) - c * w + G * geff * Math.sin(ang);
    w += tq * dt; a += w * dt;
    a = Math.min(3.05, Math.max(-.6, a));   // non entra nel corpo
    out[i] = a;
  }
  return t => out[Math.min(n - 1, Math.max(0, Math.round(t / dt)))];
}
