/* KUBO 3D — ricostruito dalle immagini del fondatore, per animarlo.
   Corpo-testa: un cubo arrotondato bianco. Visore blu notte con gli occhi di luce.
   Antenna su uno stelo (molla fisica), due mani e due piedi blu staccati dal corpo (alla Rayman):
   si muovono da soli e sono la leva del linguaggio del corpo.
   Due stili: 'morbido' (luce, lucido, ombre lavanda come le immagini) e 'piatto' (due toni pieni, niente sfumature). */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const COL = { corpo: 0xf7f8ff, ombraCorpo: 0xd6dbf3, blu: 0x0f5ee8, bluOmbra: 0x0a45b5, visore: 0x1b2a62, luce: 0xffffff, oro: 0xfec72c, guance: 0x7fa8ff, fondo: 0xf6f7fc };

export function traccia(k) {
  return t => {
    const n = k.length;
    if (t <= k[0][0]) return k[0][1];
    if (t >= k[n - 1][0]) return k[n - 1][1];
    let i = 0; while (k[i + 1][0] < t) i++;
    const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(n - 1, i + 2)];
    const h = p2[0] - p1[0], u = (t - p1[0]) / h;
    const m1 = i === 0 ? 0 : (p2[1] - p0[1]) / (p2[0] - p0[0]) * h;
    const m2 = i + 2 >= n ? 0 : (p3[1] - p1[1]) / (p3[0] - p1[0]) * h;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
  };
}

/* molla deterministica (integrata a 960 Hz): l'antenna reagisce all'accelerazione del corpo */
export function molla(dur, spinta, opz = {}) {
  const dt = 1 / 960, n = Math.ceil(dur / dt) + 2, k = opz.k || 140, c = opz.c || 7;
  const out = new Float32Array(n); let a = 0, w = 0;
  for (let i = 0; i < n; i++) { const t = i * dt; w += (-k * a - c * w - spinta(t)) * dt; a += w * dt; out[i] = a; }
  return t => out[Math.min(n - 1, Math.max(0, Math.round(t / dt)))];
}
export const accel = (f, t, h = 1 / 240) => (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);

function materiali(stile) {
  if (stile === 'piatto') {
    /* toon a due toni: luce e ombra, colori pieni, nessuna sfumatura */
    const g = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 255, 255, 255, 255]), 2, 1); g.minFilter = g.magFilter = THREE.NearestFilter; g.needsUpdate = true;
    const toon = (c, ombra) => { const m = new THREE.MeshToonMaterial({ color: c, gradientMap: g }); return m; };
    return { corpo: toon(COL.corpo), blu: toon(COL.blu), visore: new THREE.MeshBasicMaterial({ color: COL.visore }), luce: new THREE.MeshBasicMaterial({ color: COL.luce }),
      guance: new THREE.MeshBasicMaterial({ color: COL.guance }), stelo: toon(0xc9cfee) };
  }
  return {
    corpo: new THREE.MeshPhysicalMaterial({ color: COL.corpo, roughness: .38, clearcoat: .35, clearcoatRoughness: .4, sheen: .4, sheenColor: new THREE.Color(0xe4e8ff) }),
    blu: new THREE.MeshPhysicalMaterial({ color: COL.blu, roughness: .32, clearcoat: .6, clearcoatRoughness: .25 }),
    visore: new THREE.MeshPhysicalMaterial({ color: COL.visore, roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }),
    luce: new THREE.MeshBasicMaterial({ color: COL.luce }),
    guance: new THREE.MeshBasicMaterial({ color: COL.guance, transparent: true, opacity: .85 }),
    stelo: new THREE.MeshPhysicalMaterial({ color: 0x2a5be0, roughness: .4 })
  };
}

export function creaKubo(scene, stile) {
  const M = materiali(stile);
  const radice = new THREE.Group(); scene.add(radice);
  const corpoG = new THREE.Group(); radice.add(corpoG);           // si schiaccia dal basso
  const testa = new THREE.Group(); corpoG.add(testa);
  testa.position.y = .62;
  const corpo = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1.3, 1.16, 8, .5), M.corpo); testa.add(corpo);
  /* il visore: un rettangolo molto arrotondato, appena bombato, quasi tutta la faccia */
  const fv = new THREE.Shape(), vw = .57, vh = .41, vr = .27;
  fv.moveTo(-vw + vr, -vh); fv.lineTo(vw - vr, -vh); fv.quadraticCurveTo(vw, -vh, vw, -vh + vr); fv.lineTo(vw, vh - vr); fv.quadraticCurveTo(vw, vh, vw - vr, vh);
  fv.lineTo(-vw + vr, vh); fv.quadraticCurveTo(-vw, vh, -vw, vh - vr); fv.lineTo(-vw, -vh + vr); fv.quadraticCurveTo(-vw, -vh, -vw + vr, -vh);
  const gV = new THREE.ExtrudeGeometry(fv, { depth: .03, bevelEnabled: true, bevelThickness: .035, bevelSize: .035, bevelSegments: 6, curveSegments: 24 });
  const visore = new THREE.Mesh(gV, M.visore); visore.position.set(0, -.03, .56); testa.add(visore);
  /* antenna: stelo + capsula, imperniata in cima */
  const perno = new THREE.Group(); perno.position.set(0, .58, 0); testa.add(perno);
  const stelo = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .3, 16), M.stelo); stelo.position.y = .13; perno.add(stelo);
  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .26, 8, 20), M.blu); cap.rotation.z = Math.PI / 2; cap.position.y = .32; cap.scale.set(1.05, 1.05, .9); perno.add(cap);
  /* mani e piedi: ellissoidi blu staccati */
  const sfera = new THREE.SphereGeometry(1, 32, 24);
  const mano = [-1, 1].map(() => { const m = new THREE.Mesh(sfera, M.blu); radice.add(m); return m; });
  const piede = [-1, 1].map(() => { const m = new THREE.Mesh(sfera, M.blu); radice.add(m); return m; });
  /* occhi di luce sul visore */
  const occhi = [-1, 1].map(() => { const o = new THREE.Group(); visore.add(o);
    const pill = new THREE.Mesh(new THREE.CapsuleGeometry(1, 1, 8, 20), M.luce); const arco = new THREE.Mesh(new THREE.BufferGeometry(), M.luce);
    o.add(pill, arco); return { o, pill, arco }; });
  const guance = [-1, 1].map(() => { const g = new THREE.Group(); visore.add(g);
    for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.CapsuleGeometry(.012, .05, 4, 8), M.guance); s.position.x = (k - 1) * .04; s.rotation.z = -.35; g.add(s); } return g; });
  /* ombra a terra */
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d');
  if (stile === 'piatto') { cx.fillStyle = '#dfe3f6'; cx.beginPath(); cx.arc(64, 64, 62, 0, 7); cx.fill(); }
  else { const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(90,100,190,.32)'); gr.addColorStop(.6, 'rgba(90,100,190,.12)'); gr.addColorStop(1, 'rgba(90,100,190,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128); }
  const ombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
  ombra.rotation.x = -Math.PI / 2; ombra.position.y = .001; scene.add(ombra);

  function posa(p) {
    radice.position.set(p.x, p.y, 0); radice.rotation.set(0, p.giro, 0);
    corpoG.position.y = .5; corpoG.scale.set(p.sx, p.sy, p.sx); corpoG.rotation.set(p.annuisci, 0, p.inclina);
    perno.rotation.set(p.antX, 0, p.antZ);
    const [ml, mr] = [p.manoS, p.manoD];
    mano[0].position.set(-.95 + ml[0], .98 + ml[1], .1 + ml[2]); mano[0].rotation.z = ml[3]; mano[0].scale.set(.19, .27, .19);
    mano[1].position.set(.95 + mr[0], .98 + mr[1], .1 + mr[2]); mano[1].rotation.z = mr[3]; mano[1].scale.set(.19, .27, .19);
    piede[0].position.set(-.36 + p.piedeS[0], .16 + p.piedeS[1], .08); piede[0].scale.set(.3, .19, .34); piede[0].rotation.x = p.piedeS[2] || 0;
    piede[1].position.set(.36 + p.piedeD[0], .16 + p.piedeD[1], .08); piede[1].scale.set(.3, .19, .34); piede[1].rotation.x = p.piedeD[2] || 0;
    /* occhi */
    occhi.forEach((e, k) => {
      const l = k ? 1 : -1, ap = k ? p.apriD : p.apriS, R = .16 * p.occhioK;
      e.o.position.set(l * .28 + p.sguardo[0], .04 + p.sguardo[1], .075);
      if (ap > .08) { e.pill.visible = true; e.arco.visible = false; e.pill.scale.set(R * .7, R * .55 * ap, R * .2); }
      else { e.pill.visible = false; e.arco.visible = true;
        const k2 = Math.max(0, -ap + .08) / 1.08, w = R * 1.1, h = R * 1.1 * k2;
        const cur = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w, -h * .45, 0), new THREE.Vector3(0, h * 1.55 - h * .45, 0), new THREE.Vector3(w, -h * .45, 0));
        e.arco.geometry.dispose(); e.arco.geometry = new THREE.TubeGeometry(cur, 24, R * .3, 10, false); e.arco.scale.set(1, 1, .4); }
    });
    guance.forEach((g, k) => { g.position.set((k ? 1 : -1) * .36, -.2, .075); g.visible = p.guance > .01; g.scale.setScalar(Math.max(.01, p.guance)); });
    ombra.scale.set(1.9 / (1 + p.y * .7), 1.25 / (1 + p.y * .7), 1); ombra.material.opacity = 1 / (1 + p.y * 1.3);
  }
  return { posa };
}
export const POSA0 = { x: 0, y: 0, giro: 0, sx: 1, sy: 1, annuisci: 0, inclina: 0, antX: 0, antZ: 0,
  manoS: [0, 0, 0, .25], manoD: [0, 0, 0, -.25], piedeS: [0, 0, 0], piedeD: [0, 0, 0], apriS: 1, apriD: 1, sguardo: [0, 0], occhioK: 1, guance: 0 };

export function scena(canvas, stile) {
  const vuoto = /trasparente/.test(location.search);
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: vuoto });
  r.setPixelRatio(1); r.setSize(1080, 1080, false); r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = stile === 'piatto' ? THREE.NoToneMapping : THREE.NeutralToneMapping;
  const s = new THREE.Scene(); if (!vuoto) s.background = new THREE.Color(COL.fondo);
  const cam = new THREE.PerspectiveCamera(22, 1, .1, 60); cam.position.set(1.2, 2.3, 8.4); cam.lookAt(0, 1.25, 0);
  if (stile === 'piatto') {
    s.add(new THREE.AmbientLight(0xffffff, 1.1)); const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(-2, 4, 4); s.add(d);
  } else {
    s.add(new THREE.HemisphereLight(0xffffff, 0xb9c0ff, 2.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-3, 5, 5); s.add(key);
    const rim = new THREE.DirectionalLight(0xdfe4ff, 1.4); rim.position.set(3, 2, -3); s.add(rim);
    const fill = new THREE.DirectionalLight(0xe7e2ff, .7); fill.position.set(3, 1, 4); s.add(fill);
  }
  return { r, s, cam };
}
