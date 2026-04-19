// Planet + moon construction.  Each planet object bundles:
//  - pivot       (THREE.Group positioned at orbital location)
//  - tilt        (THREE.Group rotated for axial tilt + spinning)
//  - mesh        (planet Mesh)
//  - atmosphere  (fresnel shell, if any)
//  - moonPivots  (array of groups that position moons around the planet)
//  - data        (the underlying PLANETS entry)

import * as THREE from "three";
import {
  PLANETS, planetRadiusToUnits, moonRadiusToUnits, SCALE,
} from "./data.js";
import { makePlanetTexture, makeEarthCloudTexture } from "./textures.js";

// Fresnel atmosphere material
function atmosphereMaterial(color, opacity = 0.7, power = 2.5) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor:   { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uPower:   { value: power },
    },
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vPosView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vPosView = mv.xyz;
        vNormal  = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vPosView;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPower;
      void main() {
        vec3 v = normalize(-vPosView);
        float fresnel = pow(1.0 - max(dot(v, vNormal), 0.0), uPower);
        gl_FragColor = vec4(uColor * fresnel, fresnel * uOpacity);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
  });
}

export function createPlanet(def, { sunLight }) {
  const pivot = new THREE.Group();
  pivot.name = def.name + "Pivot";

  const tilt = new THREE.Group();
  tilt.name = def.name + "Tilt";
  tilt.rotation.z = THREE.MathUtils.degToRad(def.axialTiltDeg);
  pivot.add(tilt);

  const radius = planetRadiusToUnits(def.radiusEarth);
  const geom = new THREE.SphereGeometry(radius, 64, 48);
  const map = makePlanetTexture(def);
  const mat = new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0.0,
    color: 0xffffff,
  });
  // Gas giants get a bit of emission so they glow softly even on the night side
  if (def.texture?.type === "gasgiant") {
    mat.emissive = new THREE.Color(def.texture.baseColor);
    mat.emissiveIntensity = 0.06;
    mat.emissiveMap = map;
  }
  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = def.name;
  mesh.userData.planetId = def.id;
  tilt.add(mesh);

  let atmosphere = null;
  if (def.atmosphere) {
    const a = def.atmosphere;
    atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * (1 + a.thickness), 64, 32),
      atmosphereMaterial(a.color, a.opacity, 2.3)
    );
    atmosphere.name = def.name + "Atmosphere";
    tilt.add(atmosphere);
  }

  // Earth gets a rotating cloud layer
  let cloudMesh = null;
  if (def.id === "earth") {
    const cloudTex = makeEarthCloudTexture();
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.012, 64, 48),
      new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        roughness: 1,
      })
    );
    tilt.add(cloudMesh);
  }

  // Moons
  const moonPivots = [];
  if (def.moons) {
    for (const moonDef of def.moons) {
      const mp = new THREE.Group();
      mp.rotation.z = THREE.MathUtils.degToRad(moonDef.tiltDeg || 0);
      tilt.add(mp);
      const mRadius = moonRadiusToUnits(moonDef.radiusEarth);
      const mm = new THREE.Mesh(
        new THREE.SphereGeometry(mRadius, 24, 16),
        new THREE.MeshStandardMaterial({ color: moonDef.color, roughness: 1 })
      );
      // Distance — scaled for visual clarity
      const mDist = radius + Math.max(radius * 1.6, moonDef.distanceEarth * 0.05 * SCALE.moonDistance);
      mm.userData.orbitRadius = mDist;
      mm.userData.period = moonDef.periodDays;
      mp.add(mm);
      moonPivots.push({ pivot: mp, mesh: mm, data: moonDef });
    }
  }

  // Clickable target: store reference
  mesh.userData.planetRef = { data: def, pivot, tilt, mesh, atmosphere };

  return { pivot, tilt, mesh, atmosphere, cloudMesh, moonPivots, data: def };
}

export function createAllPlanets(sunLight) {
  return PLANETS.map((p) => createPlanet(p, { sunLight }));
}
