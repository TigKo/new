// Procedural textures so the app runs fully self-contained.
// Each planet gets a hi-res canvas texture that captures its essential look:
// banded gas giants, rocky cratered surfaces, Earth's continents, etc.

import * as THREE from "three";

// -- utility: tileable noise ------------------------------------------------

function hash2(x, y, seed = 0) {
  let h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return h - Math.floor(h);
}
function smoothstep(t) { return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }

function valueNoise(x, y, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const n00 = hash2(xi,     yi,     seed);
  const n10 = hash2(xi + 1, yi,     seed);
  const n01 = hash2(xi,     yi + 1, seed);
  const n11 = hash2(xi + 1, yi + 1, seed);
  const u = smoothstep(xf), v = smoothstep(yf);
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
}
function fbm(x, y, seed = 0, oct = 5, lac = 2.0, gain = 0.5) {
  let f = 1, a = 0.5, sum = 0, max = 0;
  for (let i = 0; i < oct; i++) {
    sum += a * valueNoise(x * f, y * f, seed + i * 7.13);
    max += a;
    a *= gain; f *= lac;
  }
  return sum / max;
}
function ridged(x, y, seed = 0, oct = 5) {
  let f = 1, a = 0.5, sum = 0, max = 0;
  for (let i = 0; i < oct; i++) {
    const n = 1 - Math.abs(valueNoise(x * f, y * f, seed + i * 3.17) * 2 - 1);
    sum += a * n * n;
    max += a;
    a *= 0.5; f *= 2.0;
  }
  return sum / max;
}

function hexToRgb(hex) {
  return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 };
}
function mixColor(a, b, t) {
  return {
    r: lerp(a.r, b.r, t) | 0,
    g: lerp(a.g, b.g, t) | 0,
    b: lerp(a.b, b.b, t) | 0,
  };
}
function paint(ctx, w, h, fn) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = fn(x, y);
      const i = (y * w + x) * 4;
      data[i]     = c.r;
      data[i + 1] = c.g;
      data[i + 2] = c.b;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Make a sphere-friendly texture: x wraps around, y stretches pole-to-pole.
// Accept width > height (2:1 aspect) for equirectangular mapping.

function newCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

// -- rocky (Mercury, Mars) --------------------------------------------------

export function makeRockyTexture(spec, W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const base = hexToRgb(spec.baseColor);
  const dark = hexToRgb(spec.secondary ?? 0x3a2a1a);
  const ice = hexToRgb(0xf2f7ff);

  // Pre-generate crater list
  const craters = [];
  const craterAmt = (spec.craters ?? 0.6);
  const craterCount = Math.floor(500 * craterAmt);
  for (let k = 0; k < craterCount; k++) {
    craters.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.pow(Math.random(), 3) * 60 + 4,
      d: Math.random() * 0.7 + 0.2,
    });
  }

  paint(ctx, W, H, (x, y) => {
    const u = x / W, v = y / H;
    const lat = v - 0.5;

    const n = fbm(u * (spec.noiseScale ?? 3), v * (spec.noiseScale ?? 3) * 0.6, 11);
    let c = mixColor(dark, base, Math.pow(n, 0.8));

    // large-scale shading (maria-like dark patches)
    const m = fbm(u * 1.3, v * 0.9, 33, 3);
    c = mixColor(c, dark, m * 0.25);

    // craters (stamped as subtle ring + shadow)
    for (let i = 0; i < craters.length; i++) {
      const cr = craters[i];
      const dx = Math.min(Math.abs(x - cr.x), W - Math.abs(x - cr.x));
      const dy = y - cr.y;
      const d = Math.hypot(dx, dy);
      if (d < cr.r) {
        const t = d / cr.r;
        const rim = Math.pow(1 - Math.abs(t - 0.85), 4);
        const bowl = smoothstep(1 - t);
        c = mixColor(c, dark, bowl * cr.d * 0.6);
        c = mixColor(c, { r: 255, g: 240, b: 220 }, rim * 0.2);
      }
    }

    // polar caps
    if (spec.polarIce) {
      const poleness = Math.pow(Math.abs(lat) * 2, 4);
      if (poleness > 0.35) {
        const mix = smoothstep((poleness - 0.35) / 0.45);
        c = mixColor(c, ice, mix * 0.9);
      }
    }

    return c;
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// -- cloudy / Venus ---------------------------------------------------------

export function makeCloudyTexture(spec, W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const base = hexToRgb(spec.baseColor);
  const dark = hexToRgb(spec.secondary ?? 0xb98749);

  paint(ctx, W, H, (x, y) => {
    const u = x / W, v = y / H;
    const swirl = fbm(u * 3 + v * 2, v * 4, 5);
    const bands = (Math.sin(v * Math.PI * 6 + swirl * 3) * 0.5 + 0.5) * (spec.bands ?? 0.4);
    const n = fbm(u * 5, v * 3, 5);
    const t = Math.pow((n * 0.7 + swirl * 0.3 + bands * 0.3), 0.8);
    return mixColor(dark, base, t);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// -- Earth ------------------------------------------------------------------

export function makeEarthTexture(spec, W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const ocean   = hexToRgb(0x0e2c5c);
  const shallow = hexToRgb(0x2f7fb8);
  const land    = hexToRgb(0x4b8a3a);
  const dry     = hexToRgb(0xc2a35b);
  const mntn    = hexToRgb(0x6e5a3c);
  const ice     = hexToRgb(0xf6fbff);

  paint(ctx, W, H, (x, y) => {
    const u = x / W, v = y / H;
    const lat = v - 0.5;

    // continents
    const c1 = fbm(u * 3.1, v * 1.7, 5);
    const c2 = fbm(u * 5.7 + 2.1, v * 4.3 + 0.7, 7);
    const continent = c1 * 0.6 + c2 * 0.4;
    const mask = Math.pow(continent, 1.8);

    let col;
    if (mask < 0.38) {
      col = mixColor(ocean, shallow, smoothstep(mask / 0.38));
    } else {
      // biome blend: latitude-based
      const biome = Math.min(1, Math.abs(lat) * 2.1);
      const dryness = smoothstep(Math.min(1, Math.abs(lat) * 3.2 - 0.5));
      let surface = mixColor(land, dry, dryness);
      const h = fbm(u * 10, v * 8, 17, 5);
      if (h > 0.68) surface = mixColor(surface, mntn, (h - 0.68) / 0.32);
      col = mixColor(shallow, surface, smoothstep((mask - 0.38) / 0.62));
      // ice at high latitude
      if (biome > 0.75) {
        const t = smoothstep((biome - 0.75) / 0.25);
        col = mixColor(col, ice, t * 0.8);
      }
    }

    // specular-ish cloud overlay (additive-ish)
    const cloud = Math.pow(fbm(u * 4.7 + v * 1.1, v * 3.3, 41, 5), 2.2);
    const cf = smoothstep(Math.min(1, Math.max(0, (cloud - 0.38) / 0.5))) * 0.55;
    col = mixColor(col, { r: 255, g: 255, b: 255 }, cf);

    // ice caps
    const pole = Math.pow(Math.abs(lat) * 2, 6);
    if (pole > 0.55) col = mixColor(col, ice, smoothstep((pole - 0.55) / 0.45) * 0.95);

    return col;
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Earth cloud layer
export function makeEarthCloudTexture(W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(W, H);
  const data = img.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const cloud = Math.pow(fbm(u * 4.7 + v * 1.1, v * 3.3, 41, 6), 2.4);
      const a = Math.max(0, Math.min(1, (cloud - 0.35) / 0.4)) * 0.9;
      const i = (y * W + x) * 4;
      data[i] = 255; data[i+1] = 255; data[i+2] = 255;
      data[i+3] = (a * 255) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// -- gas giants -------------------------------------------------------------

export function makeGasGiantTexture(spec, W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const base = hexToRgb(spec.baseColor);
  const dark = hexToRgb(spec.secondary ?? 0x8d6b3d);
  const accent = hexToRgb(spec.accent ?? 0xc66a3a);

  // Storm centers (like Great Red Spot)
  const storms = [];
  const stormIntensity = spec.storms ?? 0.4;
  const stormCount = Math.floor(6 * stormIntensity);
  for (let i = 0; i < stormCount; i++) {
    storms.push({
      x: Math.random() * W,
      y: H * (0.35 + Math.random() * 0.3),
      rx: 60 + Math.random() * 140,
      ry: 20 + Math.random() * 45,
      intensity: 0.5 + Math.random() * 0.5,
    });
  }

  paint(ctx, W, H, (x, y) => {
    const u = x / W, v = y / H;
    const lat = v - 0.5;

    // turbulent band
    const bandCount = 16;
    const twist = fbm(u * 4, v * 2, 5, 4) * 0.6;
    const bandPos = Math.sin(v * bandCount * Math.PI + twist * 4);
    const band = bandPos * 0.5 + 0.5;
    const banding = Math.pow(band, 2.2) * (spec.bands ?? 0.8);

    // horizontal streaks
    const streak = fbm((u + twist) * 10, v * 30, 17, 4);
    const streakMix = streak * 0.35;

    // brightness variation
    const n = fbm(u * 3 + v, v * 2, 23, 4);

    let t = 0.4 + banding * 0.6 - Math.abs(lat) * 0.4 + streakMix * 0.3 + n * 0.2;
    t = Math.max(0, Math.min(1, t));
    let c = mixColor(dark, base, t);

    // storms
    for (let i = 0; i < storms.length; i++) {
      const s = storms[i];
      const dx = Math.min(Math.abs(x - s.x), W - Math.abs(x - s.x));
      const dy = y - s.y;
      const d = Math.hypot(dx / s.rx, dy / s.ry);
      if (d < 1) {
        const f = Math.pow(1 - d, 2) * s.intensity;
        c = mixColor(c, accent, f);
      }
    }
    return c;
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// -- dispatcher -------------------------------------------------------------

export function makePlanetTexture(planet) {
  const t = planet.texture;
  if (!t) return null;
  switch (t.type) {
    case "earth":    return makeEarthTexture(t);
    case "rocky":    return makeRockyTexture(t);
    case "cloudy":   return makeCloudyTexture(t);
    case "gasgiant": return makeGasGiantTexture(t);
    default: return null;
  }
}

// -- Sun texture ------------------------------------------------------------

export function makeSunTexture(W = 2048, H = 1024) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");
  paint(ctx, W, H, (x, y) => {
    const u = x / W, v = y / H;
    const n = fbm(u * 5, v * 5, 99, 6);
    const r = ridged(u * 3, v * 3, 51, 5);
    const t = Math.pow((n * 0.6 + r * 0.4), 1.2);
    const hot  = { r: 255, g: 240, b: 160 };
    const cool = { r: 215, g: 90, b: 20 };
    return mixColor(cool, hot, t);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// -- star skybox ------------------------------------------------------------

export function makeStarfieldTexture(W = 4096, H = 2048, density = 0.0003) {
  const canvas = newCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  // Subtle galactic band across middle latitudes
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.2);
  const band = ctx.createLinearGradient(0, -H * 0.18, 0, H * 0.18);
  band.addColorStop(0.0, "rgba(0,0,0,0)");
  band.addColorStop(0.5, "rgba(35, 28, 60, 1)");
  band.addColorStop(1.0, "rgba(0,0,0,0)");
  ctx.fillStyle = band;
  ctx.fillRect(-W, -H * 0.18, W * 2, H * 0.36);
  ctx.restore();

  // A few faint nebulae (clipped to reasonable band)
  for (let i = 0; i < 10; i++) {
    const nx = Math.random() * W;
    const ny = H * 0.35 + Math.random() * H * 0.3;
    const r = 180 + Math.random() * 260;
    const g2 = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
    const warm = Math.random() < 0.5;
    const hue = warm ? "90, 60, 120" : "60, 90, 140";
    g2.addColorStop(0, `rgba(${hue}, ${0.12 + Math.random() * 0.08})`);
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(nx, ny, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stars
  const count = Math.floor(W * H * density);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const s = Math.pow(Math.random(), 28) * 3.5 + 0.25;
    const bright = Math.random() * 0.8 + 0.2;
    const warm = Math.random() < 0.35;
    const r = 255;
    const g = warm ? 230 : 245;
    const b = warm ? 210 : 255;
    ctx.fillStyle = `rgba(${r},${g},${b},${bright})`;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();

    if (s > 2) {
      ctx.fillStyle = `rgba(${r},${g},${b},${bright * 0.18})`;
      ctx.beginPath();
      ctx.arc(x, y, s * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

// -- lens flare circular sprite --------------------------------------------

// Accepts "rgba(r,g,b,a)" or "rgb(r,g,b)" or "#rrggbb" → returns rgba string
function fadeRgba(color, alpha) {
  if (color.startsWith("rgba")) {
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, (_, r, g, b) => `rgba(${r},${g},${b},${alpha})`);
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `,${alpha})`);
  }
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

export function makeFlareSprite(color = "#ffd8a0", size = 256, kind = "disc") {
  const canvas = newCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const cx = size / 2, cy = size / 2;

  if (kind === "disc") {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    g.addColorStop(0, color);
    g.addColorStop(0.25, fadeRgba(color, 0.85));
    g.addColorStop(0.6, "rgba(255,200,130,0.25)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  } else if (kind === "ring") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  } else if (kind === "streak") {
    const g = ctx.createLinearGradient(0, cy, size, cy);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, cy - 2, size, 4);
  } else if (kind === "hex") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = cx + Math.cos(a) * size * 0.4;
      const y = cy + Math.sin(a) * size * 0.4;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
