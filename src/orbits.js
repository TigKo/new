// Glowing orbit ellipses.  One LineLoop per planet, with shader-driven alpha
// fade based on view angle so faint arcs don't clutter when looking edge-on.

import * as THREE from "three";
import { sampleOrbitLine } from "./data.js";

export function createOrbitLine(planetDef, color) {
  const pts = sampleOrbitLine(planetDef, 720);
  const geom = new THREE.BufferGeometry().setFromPoints(pts);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:    { value: new THREE.Color(color) },
      uOpacity:  { value: 0.35 },
    },
    vertexShader: /* glsl */`
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        gl_FragColor = vec4(uColor, uOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const line = new THREE.LineLoop(geom, mat);
  line.name = "Orbit_" + planetDef.id;
  line.renderOrder = 1;
  return line;
}
