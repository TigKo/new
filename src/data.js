// Realistic solar-system data, then compressed onto a believable cinematic scale.
//
//  - Radii in Earth-radii (r_earth).  1 r_earth = 6371 km.
//  - Orbital distances in AU.         1 AU = 149,597,870 km.
//  - Orbital periods in Julian years.
//  - Rotation periods in Earth days (sidereal).  Negative = retrograde.
//  - Axial tilt in degrees.
//
// To fit the solar system onto a single screen we compress distance with a
// log-like curve and radii with a gentle power curve.  The *relative* order
// and ratios are preserved so that Jupiter is still visibly huge and Mercury
// still hugs the Sun.

import * as THREE from "three";

// --- scaling --------------------------------------------------------------

// Visual scene units (scene "world units").
export const SCALE = {
  // Distance compression: scene units per AU, with a mild log curve so that
  // inner planets remain legible and outer planets stay in view.
  au: 90,                 // linear AU → units
  distCurve: 0.62,        // pow compression on AU (1 = linear)
  planetRadius: 2.2,      // scene units per Earth-radius (planets)
  planetRadiusCurve: 0.78,// pow compression on planet radii
  sunRadius: 24,          // fixed visible sun radius
  moonRadius: 1.2,        // Earth-radii → units (moons, slightly larger than strict)
  moonDistance: 4.0,      // moon distance multiplier (else they hide in the planet)
  // How much simulated Julian days advance per real second at 1× speed.
  // Tuned so Earth completes a full orbit in ~90s at 1× (cinematic pace).
  daysPerSecond: 4,
};

export function auToUnits(au) {
  return Math.pow(au, SCALE.distCurve) * SCALE.au;
}
export function planetRadiusToUnits(r) {
  return Math.pow(r, SCALE.planetRadiusCurve) * SCALE.planetRadius;
}
export function moonRadiusToUnits(r) {
  return Math.max(0.25, Math.pow(r, 0.7) * SCALE.moonRadius);
}

// --- helpers --------------------------------------------------------------

const deg = THREE.MathUtils.degToRad;

// Format huge numbers for HUD
export function formatMass(kg) {
  const superscript = { "-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹" };
  const exp = Math.floor(Math.log10(kg));
  const mant = kg / Math.pow(10, exp);
  const sup = String(exp).split("").map((c) => superscript[c] ?? c).join("");
  return `${mant.toFixed(3)} × 10${sup} kg`;
}
export function formatDay(dEarth) {
  const absd = Math.abs(dEarth);
  if (absd < 1) return `${(absd * 24).toFixed(2)} h${dEarth < 0 ? " retro" : ""}`;
  return `${absd.toFixed(2)} d${dEarth < 0 ? " retro" : ""}`;
}
export function formatDistance(au) {
  if (au < 0.01) return `${(au * 149597870).toFixed(0)} km`;
  return `${au.toFixed(3)} AU`;
}

// --- planets --------------------------------------------------------------

/*
  Orbit elements are simplified: semiMajorAxis (AU), eccentricity, inclination
  (deg), longitude of ascending node (deg), argument of periapsis (deg), mean
  longitude at J2000 (deg).  Periods are years.  These are not JPL-grade but
  give correct qualitative motion and alignments over millennial timescales.
*/

export const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    colorHex: 0xb5a68a,
    radiusEarth: 0.383,
    mass: 3.301e23,
    rotationDays: 58.646,
    axialTiltDeg: 0.034,
    a: 0.387,    e: 0.2056,  i: 7.005,  omega: 48.331,  w: 29.124,  L0: 252.25,
    period: 0.2408,
    atmosphere: null,
    texture: { type: "rocky", baseColor: 0xb5a68a, secondary: 0x7c6950, noiseScale: 2.6, craters: 1.0 },
  },
  {
    id: "venus",
    name: "Venus",
    colorHex: 0xe6c98a,
    radiusEarth: 0.949,
    mass: 4.867e24,
    rotationDays: -243.025,
    axialTiltDeg: 177.36,
    a: 0.723,    e: 0.0068,  i: 3.394,  omega: 76.680,  w: 54.884,  L0: 181.98,
    period: 0.6152,
    atmosphere: { color: 0xffd08a, opacity: 0.55, thickness: 0.09 },
    texture: { type: "cloudy", baseColor: 0xe6c98a, secondary: 0xb98749, noiseScale: 3.2, bands: 0.3 },
  },
  {
    id: "earth",
    name: "Earth",
    colorHex: 0x3b82f6,
    radiusEarth: 1.0,
    mass: 5.972e24,
    rotationDays: 0.9973,
    axialTiltDeg: 23.4393,
    a: 1.000,    e: 0.0167,  i: 0.000,  omega: -11.26, w: 114.208, L0: 100.464,
    period: 1.0000,
    atmosphere: { color: 0x6fb7ff, opacity: 0.7, thickness: 0.07 },
    texture: { type: "earth", baseColor: 0x2a5caa, land: 0x4b8a3a, ice: 0xf4faff, noiseScale: 3.1 },
    moons: [
      { id: "luna", name: "Luna", radiusEarth: 0.273, distanceEarth: 60.3, periodDays: 27.32, tiltDeg: 6.68, color: 0xcac4b6 },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    colorHex: 0xc1440e,
    radiusEarth: 0.532,
    mass: 6.417e23,
    rotationDays: 1.0260,
    axialTiltDeg: 25.19,
    a: 1.524,    e: 0.0934,  i: 1.849,  omega: 49.558, w: 286.502, L0: 355.453,
    period: 1.8809,
    atmosphere: { color: 0xffa270, opacity: 0.25, thickness: 0.04 },
    texture: { type: "rocky", baseColor: 0xc1440e, secondary: 0x5a1e08, noiseScale: 3.0, craters: 0.4, polarIce: 0.88 },
    moons: [
      { id: "phobos", name: "Phobos", radiusEarth: 0.0017, distanceEarth: 1.47, periodDays: 0.319, tiltDeg: 1.1, color: 0x7d6a56 },
      { id: "deimos", name: "Deimos", radiusEarth: 0.00098, distanceEarth: 3.68, periodDays: 1.263, tiltDeg: 0.9, color: 0x8a7a65 },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    colorHex: 0xd8ca9d,
    radiusEarth: 10.97,
    mass: 1.898e27,
    rotationDays: 0.4135,
    axialTiltDeg: 3.13,
    a: 5.203,    e: 0.0484,  i: 1.304,  omega: 100.464, w: 273.867, L0: 34.404,
    period: 11.862,
    atmosphere: { color: 0xffe7b5, opacity: 0.35, thickness: 0.05 },
    texture: { type: "gasgiant", baseColor: 0xd8ca9d, secondary: 0x8d6b3d, accent: 0xc66a3a, bands: 1.0, storms: 1.0 },
    moons: [
      { id: "io",       name: "Io",       radiusEarth: 0.286, distanceEarth: 66.1,  periodDays: 1.769, tiltDeg: 0.0,  color: 0xffe38a },
      { id: "europa",   name: "Europa",   radiusEarth: 0.245, distanceEarth: 105.2, periodDays: 3.551, tiltDeg: 0.47, color: 0xe7d8b7 },
      { id: "ganymede", name: "Ganymede", radiusEarth: 0.413, distanceEarth: 167.8, periodDays: 7.155, tiltDeg: 0.2,  color: 0xb8a17e },
      { id: "callisto", name: "Callisto", radiusEarth: 0.378, distanceEarth: 295.1, periodDays: 16.69, tiltDeg: 0.19, color: 0x6a5a4a },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    colorHex: 0xe8d59a,
    radiusEarth: 9.14,
    mass: 5.683e26,
    rotationDays: 0.4440,
    axialTiltDeg: 26.73,
    a: 9.537,    e: 0.0539,  i: 2.485,  omega: 113.665, w: 339.392, L0: 49.944,
    period: 29.457,
    atmosphere: { color: 0xfff0c2, opacity: 0.3, thickness: 0.05 },
    texture: { type: "gasgiant", baseColor: 0xe8d59a, secondary: 0xb29159, accent: 0xf1e2b3, bands: 0.9, storms: 0.3 },
    rings: {
      // Rings defined in Saturn-radii; authentic ranges for Saturn's A/B/C system
      inner: 1.24, outer: 2.27,
      particleCount: 18000,
      colors: [0xe9dcc0, 0xbfa47a, 0xffe6b0, 0x8e7552],
      tiltDeg: 26.73,
    },
    moons: [
      { id: "titan",    name: "Titan",    radiusEarth: 0.404, distanceEarth: 191.0, periodDays: 15.95, tiltDeg: 0.3,  color: 0xd9a04c },
      { id: "rhea",     name: "Rhea",     radiusEarth: 0.120, distanceEarth: 82.8,  periodDays: 4.518, tiltDeg: 0.35, color: 0xcfc4b3 },
      { id: "iapetus",  name: "Iapetus",  radiusEarth: 0.115, distanceEarth: 557.2, periodDays: 79.32, tiltDeg: 15.47,color: 0x9a8a72 },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    colorHex: 0xa6e3e9,
    radiusEarth: 3.98,
    mass: 8.681e25,
    rotationDays: -0.7183,
    axialTiltDeg: 97.77,
    a: 19.191,   e: 0.0473,  i: 0.773,  omega: 74.006,  w: 96.998,  L0: 313.232,
    period: 84.011,
    atmosphere: { color: 0xbff3f5, opacity: 0.45, thickness: 0.06 },
    texture: { type: "gasgiant", baseColor: 0xa6e3e9, secondary: 0x6dadb7, accent: 0xd6f2f5, bands: 0.2, storms: 0.1 },
    moons: [
      { id: "titania",  name: "Titania",  radiusEarth: 0.124, distanceEarth: 68.4,  periodDays: 8.706, tiltDeg: 0.34, color: 0xb5a79a },
      { id: "oberon",   name: "Oberon",   radiusEarth: 0.119, distanceEarth: 91.4,  periodDays: 13.46, tiltDeg: 0.10, color: 0xa99a8a },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    colorHex: 0x4466c6,
    radiusEarth: 3.86,
    mass: 1.024e26,
    rotationDays: 0.6713,
    axialTiltDeg: 28.32,
    a: 30.069,   e: 0.0086,  i: 1.770,  omega: 131.784, w: 272.856, L0: 304.880,
    period: 164.79,
    atmosphere: { color: 0x7faaff, opacity: 0.5, thickness: 0.06 },
    texture: { type: "gasgiant", baseColor: 0x4466c6, secondary: 0x233e8a, accent: 0x90b0ff, bands: 0.45, storms: 0.6 },
    moons: [
      { id: "triton",   name: "Triton",   radiusEarth: 0.212, distanceEarth: 55.7,  periodDays: -5.877, tiltDeg: 156.865, color: 0xc5c5c0 },
    ],
  },
];

// Orbital mechanics – solve Kepler's equation to get (x,y,z) given Julian days since J2000.

export function solveKepler(M, e, iterations = 6) {
  // Newton–Raphson for E − e·sinE = M
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < iterations; i++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    E -= f / fp;
  }
  return E;
}

// Returns the position (in AU) of a body in the heliocentric ecliptic frame.
export function orbitPosition(planet, daysSinceJ2000, out = new THREE.Vector3()) {
  const n = (2 * Math.PI) / (planet.period * 365.25); // mean motion rad/day
  const M = deg(planet.L0) - deg(planet.w) - deg(planet.omega) + n * daysSinceJ2000;
  const E = solveKepler(M, planet.e);
  const cosE = Math.cos(E), sinE = Math.sin(E);
  const x = planet.a * (cosE - planet.e);
  const y = planet.a * Math.sqrt(1 - planet.e * planet.e) * sinE;

  const cosw = Math.cos(deg(planet.w));
  const sinw = Math.sin(deg(planet.w));
  const cosO = Math.cos(deg(planet.omega));
  const sinO = Math.sin(deg(planet.omega));
  const cosI = Math.cos(deg(planet.i));
  const sinI = Math.sin(deg(planet.i));

  const xw = cosw * x - sinw * y;
  const yw = sinw * x + cosw * y;

  const X = cosO * xw - sinO * yw * cosI;
  const Z = sinO * xw + cosO * yw * cosI;
  const Y = yw * sinI;

  out.set(X, Y, Z);
  return out;
}

// Samples the ellipse for drawing the orbit line (returns array of THREE.Vector3 in scene units).
export function sampleOrbitLine(planet, samples = 512) {
  const pts = [];
  const cosw = Math.cos(deg(planet.w));
  const sinw = Math.sin(deg(planet.w));
  const cosO = Math.cos(deg(planet.omega));
  const sinO = Math.sin(deg(planet.omega));
  const cosI = Math.cos(deg(planet.i));
  const sinI = Math.sin(deg(planet.i));
  const b = planet.a * Math.sqrt(1 - planet.e * planet.e);
  for (let k = 0; k <= samples; k++) {
    const E = (k / samples) * Math.PI * 2;
    const x = planet.a * (Math.cos(E) - planet.e);
    const y = b * Math.sin(E);
    const xw = cosw * x - sinw * y;
    const yw = sinw * x + cosw * y;
    const X = cosO * xw - sinO * yw * cosI;
    const Z = sinO * xw + cosO * yw * cosI;
    const Y = yw * sinI;
    // scale to units with the same curve as the planet positions
    const au = Math.hypot(X, Y, Z);
    const scale = auToUnits(au) / Math.max(au, 1e-9);
    pts.push(new THREE.Vector3(X * scale, Y * scale, Z * scale));
  }
  return pts;
}

// Convert AU position vector to scene units with the same compressed radius curve.
export function worldFromAu(vec, out = new THREE.Vector3()) {
  const au = vec.length();
  if (au < 1e-9) { out.set(0, 0, 0); return out; }
  const s = auToUnits(au) / au;
  out.copy(vec).multiplyScalar(s);
  return out;
}

// Sun metadata (not orbiting)
export const SUN = {
  id: "sun",
  name: "The Sun",
  mass: 1.989e30,
  rotationDays: 25.4,
  radiusEarth: 109,
  axialTiltDeg: 7.25,
};
