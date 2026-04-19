// Saturn's rings rendered particle by particle.
// We sample thousands of points across the A/B/C band with a radial density
// distribution, small noise gaps (Cassini Division), and color variation.

import * as THREE from "three";
import { planetRadiusToUnits } from "./data.js";

export function createRings(planetDef, planetRadiusUnits) {
  const r = planetDef.rings;
  if (!r) return null;

  const innerUnits = r.inner * planetRadiusUnits;
  const outerUnits = r.outer * planetRadiusUnits;

  const count = r.particleCount;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const palette = r.colors.map((c) => new THREE.Color(c));

  // Cassini Division is ~91% of the way from inner to outer
  const cassini = 0.7;
  const cassiniWidth = 0.03;

  let actual = 0;
  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.6);
    const t = u;
    // gaps (Cassini + a few smaller ones)
    const gap = Math.exp(-Math.pow((t - cassini) / cassiniWidth, 2) * 6.0);
    const gap2 = Math.exp(-Math.pow((t - 0.42) / 0.012, 2) * 8.0);
    const gap3 = Math.exp(-Math.pow((t - 0.88) / 0.008, 2) * 6.0);
    const density = 1 - (gap * 0.85 + gap2 * 0.6 + gap3 * 0.5);
    if (Math.random() > density) continue;

    const radius = THREE.MathUtils.lerp(innerUnits, outerUnits, t);
    // slight radial noise for grainy look
    const rj = radius + (Math.random() - 0.5) * planetRadiusUnits * 0.008;
    const theta = Math.random() * Math.PI * 2;
    // vertical thickness: extremely thin, more spread at edges
    const yJitter = (Math.random() - 0.5) * planetRadiusUnits * 0.004 * (1 + t * 1.2);

    positions[actual * 3]     = Math.cos(theta) * rj;
    positions[actual * 3 + 1] = yJitter;
    positions[actual * 3 + 2] = Math.sin(theta) * rj;

    // color banding: lerp between palette based on radius with noise
    const c = palette[Math.floor(t * palette.length * 0.99 + Math.random() * 0.4) % palette.length];
    const brightness = 0.6 + 0.4 * (1 - Math.abs(t - 0.5) * 2);
    const jitter = 0.85 + Math.random() * 0.3;
    colors[actual * 3]     = c.r * brightness * jitter;
    colors[actual * 3 + 1] = c.g * brightness * jitter;
    colors[actual * 3 + 2] = c.b * brightness * jitter;

    sizes[actual] = (0.6 + Math.random() * 0.7) * planetRadiusUnits * 0.01;
    actual++;
  }

  const truePos = positions.slice(0, actual * 3);
  const trueCol = colors.slice(0, actual * 3);
  const trueSize = sizes.slice(0, actual);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(truePos, 3));
  geom.setAttribute("color", new THREE.BufferAttribute(trueCol, 3));
  geom.setAttribute("aSize", new THREE.BufferAttribute(trueSize, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSizeScale:  { value: 60.0 },
    },
    vertexShader: /* glsl */`
      attribute float aSize;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uSizeScale;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uSizeScale * uPixelRatio / -mv.z;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vColor;
      void main() {
        vec2 d = gl_PointCoord - 0.5;
        float r = length(d);
        if (r > 0.5) discard;
        float alpha = smoothstep(0.5, 0.15, r);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geom, mat);
  points.name = "SaturnRings";
  // Rings live in the planet's tilted frame (the parent's axial tilt already
  // reproduces the correct inclination), so no extra rotation is applied here.
  return points;
}
