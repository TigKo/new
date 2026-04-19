// Procedural asteroid belt (InstancedMesh).  Asteroids drift through along
// Keplerian-ish orbits with a small random inclination and slight rotation.

import * as THREE from "three";
import { auToUnits } from "./data.js";

export function createAsteroidBelt({ count = 2600 } = {}) {
  // Belt is at 2.2 to 3.2 AU with slight inclination and eccentricity scatter.
  const innerAU = 2.1, outerAU = 3.3;

  // Build a low-poly irregular geometry
  const geom = new THREE.IcosahedronGeometry(0.35, 1);
  // Jitter vertices to make it look irregular
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const j = 0.4 + Math.random() * 0.6;
    pos.setXYZ(i, x * j, y * j, z * j);
  }
  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x8b7a63,
    roughness: 1,
    metalness: 0,
    flatShading: true,
  });

  const mesh = new THREE.InstancedMesh(geom, mat, count);
  mesh.name = "AsteroidBelt";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Per-instance orbital params
  const orbits = new Array(count);
  const _mat4 = new THREE.Matrix4();
  const _pos = new THREE.Vector3();
  const _rot = new THREE.Euler();
  const _quat = new THREE.Quaternion();
  const _scl = new THREE.Vector3();
  const color = new THREE.Color();
  const _col = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const au = innerAU + Math.pow(Math.random(), 1.3) * (outerAU - innerAU);
    const radiusUnits = auToUnits(au);
    const phase = Math.random() * Math.PI * 2;
    const incl = (Math.random() - 0.5) * 0.14;   // up to ~8°
    const speed = Math.sqrt(1 / au) * 0.22 + (Math.random() - 0.5) * 0.005; // faster closer in
    const size = 0.2 + Math.pow(Math.random(), 4) * 2.5;
    const spin = (Math.random() - 0.5) * 0.4;
    const spinAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    const tint = 0.5 + Math.random() * 0.5;
    const warm = Math.random() < 0.4;
    color.setRGB(
      (warm ? 0.8 : 0.55) * tint,
      (warm ? 0.65 : 0.52) * tint,
      (warm ? 0.48 : 0.5) * tint,
    );
    _col[i * 3] = color.r; _col[i * 3 + 1] = color.g; _col[i * 3 + 2] = color.b;

    orbits[i] = { radiusUnits, phase, incl, speed, size, spin, spinAxis,
                  quat: new THREE.Quaternion(), angle: 0 };
  }

  mesh.instanceColor = new THREE.InstancedBufferAttribute(_col, 3);

  function update(daysSinceJ2000) {
    for (let i = 0; i < count; i++) {
      const o = orbits[i];
      const theta = o.phase + o.speed * daysSinceJ2000 * 0.01;
      const x = Math.cos(theta) * o.radiusUnits;
      const z = Math.sin(theta) * o.radiusUnits;
      const y = Math.sin(theta * 1.1 + o.phase) * o.radiusUnits * o.incl * 0.3;
      _pos.set(x, y, z);

      o.angle += o.spin * 0.01;
      _quat.setFromAxisAngle(o.spinAxis, o.angle);
      _scl.set(o.size, o.size, o.size);
      _mat4.compose(_pos, _quat, _scl);
      mesh.setMatrixAt(i, _mat4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  return { mesh, update };
}
