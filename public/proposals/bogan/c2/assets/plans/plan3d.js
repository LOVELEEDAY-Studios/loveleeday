// plan3d.js : turns a layout from plans.json into a warm white model that can be turned by hand. Loaded only when a visitor opens 3D.
import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

const WALL_H = 4.6; const T = 0.5; const SILL = 2.4;
const C = { wall: 0xfdf8f3, wood: 0xcf9f77, carpet: 0xe9ded2, tile: 0xd9d4cc, fabric: 0x8d3a2b, linen: 0xf4ece3, stone: 0xf2ece4, dark: 0x3a2622, rug: 0xd9b9a4, oak: 0xb98560, glass: 0xbfd5dc };
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82, ...o });

function box(g, w, h, d, x, y, z, m) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  b.position.set(x + w / 2, y + h / 2, z + d / 2); b.castShadow = true; b.receiveShadow = true; g.add(b); return b;
}
function floorTexture(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  if (kind === 'wood') {
    for (let i = 0; i < 8; i += 1) { x.fillStyle = `hsl(25,${38 + (i * 13) % 12}%,${64 + (i * 37) % 9}%)`; x.fillRect(0, i * 32, 256, 31); }
  } else if (kind === 'tile') {
    x.fillStyle = '#ded9d1'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#c9c2b8'; x.lineWidth = 3; for (let i = 0; i <= 4; i += 1) { x.strokeRect(0, i * 64, 256, 0.5); x.strokeRect(i * 64, 0, 0.5, 256); }
  } else { x.fillStyle = '#ece2d7'; x.fillRect(0, 0, 256, 256); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
function furniture(g, f) {
  const fab = mat(C.fabric); const lin = mat(C.linen); const stone = mat(C.stone); const oak = mat(C.oak); const dark = mat(C.dark); const white = mat(0xffffff, { roughness: 0.4 });
  const { x, y, w, h } = f;
  switch (f.t) {
    case 'rug': box(g, w, 0.06, h, x, 0.02, y, mat(C.rug)); break;
    case 'bed': box(g, w, 1, h, x, 0.4, y, oak); box(g, w - 0.2, 0.7, h - 0.2, x + 0.1, 1.2, y + 0.1, lin);
      if (f.v) { box(g, w / 2 - 0.3, 0.45, 1.4, x + 0.2, 1.85, y + 0.25, white); box(g, w / 2 - 0.3, 0.45, 1.4, x + w / 2 + 0.1, 1.85, y + 0.25, white); box(g, w - 0.2, 0.16, h * 0.42, x + 0.1, 1.86, y + h * 0.56, fab); } else { box(g, 1.4, 0.45, h / 2 - 0.3, x + 0.25, 1.85, y + 0.2, white); box(g, 1.4, 0.45, h / 2 - 0.3, x + 0.25, 1.85, y + h / 2 + 0.1, white); box(g, w * 0.42, 0.16, h - 0.2, x + w * 0.56, 1.86, y + 0.1, fab); } break;
    case 'sofa': box(g, w, 1.3, h, x, 0.25, y, fab); if (f.r) box(g, 0.8, 1.5, h, x + w - 0.8, 0.25, y, fab); else box(g, w, 1.5, 0.8, x, 0.25, y + h - 0.8, fab); box(g, w - 0.9, 0.3, 0.45, x, 1.55, y, fab); box(g, w - 0.9, 0.3, 0.45, x, 1.55, y + h - 0.45, fab); break;
    case 'table': box(g, w, 0.14, h, x, 1.3, y, oak); box(g, 0.14, 1.3, 0.14, x + 0.1, 0, y + 0.1, dark); box(g, 0.14, 1.3, 0.14, x + w - 0.24, 0, y + h - 0.24, dark); box(g, 0.14, 1.3, 0.14, x + w - 0.24, 0, y + 0.1, dark); box(g, 0.14, 1.3, 0.14, x + 0.1, 0, y + h - 0.24, dark); break;
    case 'dining': box(g, w, 0.16, h, x, 2.4, y, oak); box(g, 0.2, 2.4, 0.2, x + 0.3, 0, y + h / 2, dark); box(g, 0.2, 2.4, 0.2, x + w - 0.5, 0, y + h / 2, dark);
      for (let i = 0; i < 3; i += 1) { const cx = x + w * (i * 2 + 1) / 6 - 0.65; box(g, 1.3, 1.5, 1.2, cx, 0, y - 1.3, lin); box(g, 1.3, 1.5, 1.2, cx, 0, y + h + 0.1, lin); } break;
    case 'dresser': box(g, w, 2.6, h, x, 0, y, oak); break;
    case 'tv': box(g, w, 1.7, h, x, 0, y, oak); box(g, 0.14, 2.3, h - 0.6, x + 0.4, 1.8, y + 0.3, dark); break;
    case 'counter': box(g, w, 3, h, x, 0, y, mat(0x5a2a22)); box(g, w + 0.05, 0.14, h, x, 3, y, stone); break;
    case 'island': box(g, w, 2.9, h, x, 0, y, mat(0x5a2a22)); box(g, w + 0.5, 0.16, h + 0.5, x - 0.25, 2.9, y - 0.25, stone); for (let i = 0; i < 3; i += 1) box(g, 1, 2, 1, x + 0.6 + i * (w - 1.8) / 2, 0, y - 1.3, oak); break;
    case 'fridge': box(g, w, 4.3, h, x, 0, y, mat(0xc9c9c6, { metalness: 0.35, roughness: 0.4 })); break;
    case 'range': box(g, w, 3.05, h, x, 0, y, dark); box(g, w, 0.04, h, x, 3.16, y, mat(0x161210)); break;
    case 'sink': box(g, w, 0.04, h, x, 3.15, y, mat(0x9aa0a4, { metalness: 0.6, roughness: 0.35 })); break;
    case 'tub': box(g, w, 1.7, h, x, 0, y, white); box(g, w - 0.5, 0.03, h - 0.5, x + 0.25, 1.71, y + 0.25, mat(0xdfe9ec)); break;
    case 'toilet': box(g, 0.7, 2.4, h, x, 0, y, white); box(g, w - 0.8, 1.3, h - 0.3, x + 0.75, 0, y + 0.15, white); break;
    case 'vanity': box(g, w, 2.7, h, x, 0, y, oak); box(g, w, 0.1, h, x, 2.7, y, stone); break;
    case 'wd': box(g, w, 3, h / 2 - 0.1, x, 0, y, white); box(g, w, 3, h / 2 - 0.1, x, 0, y + h / 2 + 0.1, white); break;
    default: break;
  }
}
export function mountPlan(el, p, { still = false } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf7e6da);
  const g = new THREE.Group(); scene.add(g);
  const wall = mat(C.wall);
  for (const r of p.rooms) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.h), mat(0xffffff, { map: floorTexture(r.f) }));
    m.material.map.repeat.set(r.w / 8, r.h / 8); m.rotation.x = -Math.PI / 2; m.position.set(r.x + r.w / 2, 0.01, r.y + r.h / 2); m.receiveShadow = true; g.add(m);
  }
  for (const w of p.runs) {
    if (w.w) box(g, w.w + T, WALL_H, T, w.x - T / 2, 0, w.y - T / 2, wall); else box(g, T, WALL_H, w.h + T, w.x - T / 2, 0, w.y - T / 2, wall);
  }
  for (const d of p.windows) {
    const glass = mat(C.glass, { transparent: true, opacity: 0.42, roughness: 0.1 });
    if (d.a === 'h') { box(g, d.l, SILL, T, d.x, 0, d.y - T / 2, wall); box(g, d.l, WALL_H - SILL, 0.08, d.x, SILL, d.y, glass); } else { box(g, T, SILL, d.l, d.x - T / 2, 0, d.y, wall); box(g, 0.08, WALL_H - SILL, d.l, d.x, SILL, d.y, glass); }
  }
  for (const f of p.fx) furniture(g, f);
  const base = new THREE.Mesh(new THREE.BoxGeometry(p.w + 1, 0.5, p.h + 1), mat(0xe8c9b6)); base.position.set(p.w / 2, -0.26, p.h / 2); base.receiveShadow = true; g.add(base);
  g.position.set(-p.w / 2, 0, -p.h / 2);

  const size = Math.max(p.w, p.h);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xf3dfd2, 2.4));
  const sun = new THREE.DirectionalLight(0xfff0e0, 1.5); sun.position.set(-size * 0.35, size * 1.6, size * 0.25); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 5; const c = sun.shadow.camera; c.left = c.bottom = -size; c.right = c.top = size; c.far = size * 4; sun.shadow.bias = -0.0005; scene.add(sun);

  const W = el.clientWidth || 900; const H = el.clientHeight || 620;
  const cam = new THREE.PerspectiveCamera(26, W / H, 1, size * 12);
  const far = W / H < 1.2 ? 1.5 : 1.22;
  cam.position.set(-size * 0.5 * far, size * 2 * far, size * 1.25 * far);
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: still });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); r.setSize(W, H); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.NoToneMapping;
  el.replaceChildren(r.domElement);
  const ctl = new OrbitControls(cam, r.domElement);
  ctl.enableDamping = true; ctl.enablePan = false; ctl.minPolarAngle = 0.15; ctl.maxPolarAngle = 1.25; ctl.minDistance = size * 0.9; ctl.maxDistance = size * 3.4; ctl.target.set(0, 1, 0);
  let on = true;
  const draw = () => { if (!on) return; ctl.update(); r.render(scene, cam); requestAnimationFrame(draw); };
  if (still) { ctl.update(); r.render(scene, cam); } else draw();
  const ro = new ResizeObserver(() => { const w = el.clientWidth; const h = el.clientHeight; if (!w || !h) return; cam.aspect = w / h; cam.updateProjectionMatrix(); r.setSize(w, h); });
  ro.observe(el);
  return () => { on = false; ro.disconnect(); ctl.dispose(); r.dispose(); };
}
