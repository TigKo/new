// ─────────────────────────────────────────────────────────────────────────────
//  HELIOS — Interactive 3D Solar System
//  Top-level orchestration: scene, cameras, animation loop, interaction,
//  time scrubbing, click-to-fly, labels, audio, postprocessing.
// ─────────────────────────────────────────────────────────────────────────────

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import {
  PLANETS, SUN, SCALE,
  auToUnits, orbitPosition, worldFromAu,
  formatMass, formatDay, formatDistance,
} from "./data.js";
import { makeStarfieldTexture } from "./textures.js";
import { createSun, createLensFlare } from "./sun.js";
import { createAllPlanets } from "./planets.js";
import { createOrbitLine } from "./orbits.js";
import { createRings } from "./rings.js";
import { createAsteroidBelt } from "./asteroids.js";
import { SpaceDrone } from "./audio.js";
import { LabelSystem } from "./labels.js";

// ───── Renderer / scene / camera ────────────────────────────────────────────
const canvas   = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200000);
camera.position.set(0, 300, 720);

// Starfield rendered as an inverted sphere so it's excluded from bloom and
// tonemapping interactions the way scene.background can introduce.
const starTex = makeStarfieldTexture(4096, 2048);
const starSky = new THREE.Mesh(
  new THREE.SphereGeometry(90000, 64, 32),
  new THREE.MeshBasicMaterial({ map: starTex, side: THREE.BackSide, depthWrite: false, toneMapped: false })
);
starSky.renderOrder = -1;
scene.add(starSky);

// ───── Lighting ─────────────────────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0x7a8cd5, 0.12);
scene.add(ambient);

// ───── Sun ──────────────────────────────────────────────────────────────────
const sun = createSun();
scene.add(sun.group);
const lensFlare = createLensFlare(scene, camera);

// ───── Planets & orbits ─────────────────────────────────────────────────────
const planets = createAllPlanets(sun.light);
const planetsById = Object.create(null);
for (const p of planets) {
  scene.add(p.pivot);
  planetsById[p.data.id] = p;
  // Orbit line
  const orbitLine = createOrbitLine(p.data, p.data.colorHex);
  scene.add(orbitLine);
  p.orbitLine = orbitLine;
  // Saturn rings
  if (p.data.id === "saturn") {
    const radiusUnits = p.mesh.geometry.parameters.radius;
    const rings = createRings(p.data, radiusUnits);
    if (rings) p.tilt.add(rings);
  }
}

// ───── Asteroid belt ────────────────────────────────────────────────────────
const belt = createAsteroidBelt({ count: 3000 });
scene.add(belt.mesh);

// ───── Controls ─────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 0.9;
controls.panSpeed = 0.5;
controls.minDistance = 8;
controls.maxDistance = 80000;
controls.target.set(0, 0, 0);

// ───── Postprocessing ───────────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.55, 0.88);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ───── Labels + audio ──────────────────────────────────────────────────────
const labels = new LabelSystem(document.getElementById("labels"), camera);
for (const p of planets) {
  labels.add(p.mesh, p.data);
}

const audio = new SpaceDrone();
let audioArmed = false;
function primeAudio() {
  if (audioArmed) return;
  audioArmed = true;
  audio.start();
  document.getElementById("audio-hint")?.classList.add("gone");
}
window.addEventListener("pointerdown", primeAudio, { once: true });
window.addEventListener("keydown", primeAudio, { once: true });

// ───── Time simulation ─────────────────────────────────────────────────────
// Time is measured in Julian days since J2000.0 (~Jan 1 2000 12:00 TT).
// The slider maps years from −5000 to +5000 relative to J2000.
const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
const NOW_MS = Date.now();
const NOW_DAYS = (NOW_MS - J2000.getTime()) / (86400 * 1000);

let simDays = NOW_DAYS;       // current simulated day count (since J2000)
let playing = true;
let playbackSpeed = 1.0;      // scrub multiplier
let scrubAnchor = null;       // when slider is active

function daysToDate(d) {
  const ms = J2000.getTime() + d * 86400 * 1000;
  return new Date(ms);
}

function formatDate(date) {
  const y = date.getUTCFullYear();
  const m = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const day = date.getUTCDate();
  return `${m} ${day}, ${y}`;
}

// ───── Camera flight state ─────────────────────────────────────────────────
const cam = {
  mode: "free",       // "free" | "flying" | "orbit"
  target: null,       // planet object
  flyT: 0,
  flyDur: 2.6,
  fromPos: new THREE.Vector3(),
  fromTgt: new THREE.Vector3(),
  orbitRadius: 0,
  orbitTheta: 0,
  orbitPhi: Math.PI * 0.35,
  enterTime: 0,
};

function flyTo(planet) {
  // Switch camera to smoothly approach the planet, then drop into orbit mode.
  cam.mode = "flying";
  cam.target = planet;
  cam.flyT = 0;
  cam.fromPos.copy(camera.position);
  cam.fromTgt.copy(controls.target);

  // Orbit radius in planet-local units: ~5x the planet's visible radius
  const r = planet.mesh.geometry.parameters.radius;
  cam.orbitRadius = Math.max(r * 5.5, 10);
  cam.orbitTheta = Math.PI * 0.25;
  cam.orbitPhi = Math.PI * 0.35;
  cam.flyDur = 2.6;

  updateTargetCard(planet.data);
}

function releaseCamera() {
  cam.mode = "free";
  cam.target = null;
  controls.minDistance = 8;
  updateTargetCard(SUN);
}

// ───── HUD bits ────────────────────────────────────────────────────────────
const tcName = document.getElementById("tc-name");
const tcMass = document.getElementById("tc-mass");
const tcDay  = document.getElementById("tc-day");
const tcDist = document.getElementById("tc-dist");
const tlSlider = document.getElementById("tl-slider");
const tlDate = document.getElementById("tl-date");
const btnPlay = document.getElementById("btn-play");
const btnRewind = document.getElementById("btn-rewind");
const btnForward = document.getElementById("btn-forward");
const btnNow = document.getElementById("btn-now");

function updateTargetCard(data) {
  tcName.textContent = data.name;
  tcMass.textContent = formatMass(data.mass);
  tcDay.textContent  = formatDay(data.rotationDays);
  if (data.id === "sun") {
    tcDist.textContent = "0 AU";
  } else {
    tcDist.textContent = formatDistance(data._currentAU ?? data.a);
  }
}

updateTargetCard(SUN);

// Slider scrubbing
tlSlider.addEventListener("input", () => {
  const years = parseFloat(tlSlider.value);
  // Year 0 on the slider = present; so absolute days = NOW_DAYS + years*365.25
  simDays = NOW_DAYS + years * 365.25;
  playing = false;
  btnPlay.textContent = "▶";
});

btnPlay.addEventListener("click", () => {
  playing = !playing;
  btnPlay.textContent = playing ? "⏸" : "▶";
});
btnRewind.addEventListener("click", () => {
  playbackSpeed = playbackSpeed >= 0 ? -10 : playbackSpeed * 1.7;
  playing = true;
  btnPlay.textContent = "⏸";
});
btnForward.addEventListener("click", () => {
  playbackSpeed = playbackSpeed <= 0 ? 10 : playbackSpeed * 1.7;
  playing = true;
  btnPlay.textContent = "⏸";
});
btnNow.addEventListener("click", () => {
  simDays = NOW_DAYS;
  playbackSpeed = 1.0;
  playing = true;
  btnPlay.textContent = "⏸";
  releaseCamera();
  controls.target.set(0, 0, 0);
  camera.position.set(0, 220, 640);
});

// ───── Input: click planet to fly, keyboard shortcuts ──────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function pickPlanet(ev) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const meshes = planets.map((p) => p.mesh);
  const sunHit = sun.sphere;
  const hits = raycaster.intersectObjects([...meshes, sunHit], false);
  if (!hits.length) return null;
  const hit = hits[0].object;
  if (hit === sunHit) return { data: SUN, isSun: true };
  return hit.userData.planetRef;
}

// Track pointer down/up to distinguish click from drag
let downX = 0, downY = 0, downT = 0;
renderer.domElement.addEventListener("pointerdown", (ev) => {
  downX = ev.clientX; downY = ev.clientY; downT = performance.now();
});
renderer.domElement.addEventListener("pointerup", (ev) => {
  const dx = ev.clientX - downX, dy = ev.clientY - downY;
  const dist = Math.hypot(dx, dy);
  const dt = performance.now() - downT;
  if (dist > 4 || dt > 500) return;
  const hit = pickPlanet(ev);
  if (!hit) return;
  if (hit.isSun) {
    releaseCamera();
    controls.target.set(0, 0, 0);
    return;
  }
  const planet = planetsById[hit.data.id];
  if (planet) flyTo(planet);
});

// Keyboard
let showOrbits = true;
let showLabels = false;
labels.setVisible(false);

window.addEventListener("keydown", (ev) => {
  if (ev.code === "KeyL") {
    showLabels = labels.toggle();
  } else if (ev.code === "KeyO") {
    showOrbits = !showOrbits;
    for (const p of planets) p.orbitLine.visible = showOrbits;
  } else if (ev.code === "KeyM") {
    audio.toggle();
  } else if (ev.code === "KeyR") {
    btnNow.click();
  } else if (ev.code === "Space") {
    ev.preventDefault();
    playing = !playing;
    btnPlay.textContent = playing ? "⏸" : "▶";
  }
});

// Resize
function onResize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onResize);
onResize();

// ───── Loader dismissal ────────────────────────────────────────────────────
const loaderEl = document.getElementById("loader");
const loaderFill = document.getElementById("loader-bar-fill");
const hud = document.getElementById("hud");

(async function hideLoader() {
  // Small artificial ramp so users see the cinematic intro
  const steps = [10, 22, 41, 62, 80, 100];
  for (const s of steps) {
    loaderFill.style.width = s + "%";
    await new Promise((r) => setTimeout(r, 160));
  }
  await new Promise((r) => setTimeout(r, 250));
  loaderEl.classList.add("done");
  hud.classList.remove("hidden");
  setTimeout(() => { loaderEl.remove(); }, 1200);
})();

// ───── Animation loop ──────────────────────────────────────────────────────
const clock = new THREE.Clock();
const _auPos = new THREE.Vector3();
const _scenePos = new THREE.Vector3();
const _camWorld = new THREE.Vector3();
const _sunWorld = new THREE.Vector3(0, 0, 0);

function animate() {
  const dt = Math.min(0.1, clock.getDelta());
  const t = clock.elapsedTime;

  // Time advance
  if (playing) {
    simDays += dt * SCALE.daysPerSecond * playbackSpeed;
    const years = (simDays - NOW_DAYS) / 365.25;
    const clampedYears = Math.max(-5000, Math.min(5000, years));
    tlSlider.value = clampedYears.toFixed(3);
    if (years < -5000 || years > 5000) simDays = NOW_DAYS + clampedYears * 365.25;
  }
  tlDate.textContent = formatDate(daysToDate(simDays));

  // Sun rotates (25.4-day sidereal at equator)
  sun.sphere.rotation.y = (simDays / SUN.rotationDays) * Math.PI * 2;
  sun.corona.material.uniforms.uTime.value = t;

  // Planets: position along orbits + spin + moons
  for (const p of planets) {
    orbitPosition(p.data, simDays, _auPos);
    worldFromAu(_auPos, _scenePos);
    p.pivot.position.copy(_scenePos);
    // Store AU for HUD labels
    p.data._currentAU = _auPos.length();

    // Visual spin is scaled so fast rotators (Jupiter) don't blur but are
    // still unmistakably rotating. Still deterministic in simDays.
    const rot = (simDays / Math.max(0.25, Math.abs(p.data.rotationDays))) * Math.PI * 2 * Math.sign(p.data.rotationDays) * 0.1;
    p.mesh.rotation.y = rot;
    if (p.cloudMesh) p.cloudMesh.rotation.y = rot * 1.06;

    // Moons: orbit position + spin are both deterministic in simDays.
    for (const m of p.moonPivots) {
      const speed = (2 * Math.PI) / (m.data.periodDays || 30);
      const angle = simDays * speed;
      m.mesh.position.set(
        Math.cos(angle) * m.mesh.userData.orbitRadius,
        0,
        Math.sin(angle) * m.mesh.userData.orbitRadius
      );
      m.mesh.rotation.y = angle;
    }
  }

  // Asteroid belt
  belt.update(simDays);

  // ---- Camera logic ------------------------------------------------------
  if (cam.mode === "flying" && cam.target) {
    cam.flyT += dt;
    const k = Math.min(1, cam.flyT / cam.flyDur);
    const ease = 0.5 - 0.5 * Math.cos(Math.PI * k);

    // Target position: a point next to the planet
    const planetWorld = new THREE.Vector3();
    cam.target.mesh.getWorldPosition(planetWorld);

    // desired camera pos = planet + offset
    const orbitOffset = new THREE.Vector3(
      Math.sin(cam.orbitTheta) * Math.cos(cam.orbitPhi),
      Math.sin(cam.orbitPhi),
      Math.cos(cam.orbitTheta) * Math.cos(cam.orbitPhi)
    ).multiplyScalar(cam.orbitRadius);
    const desiredPos = planetWorld.clone().add(orbitOffset);

    camera.position.lerpVectors(cam.fromPos, desiredPos, ease);
    controls.target.lerpVectors(cam.fromTgt, planetWorld, ease);

    if (k >= 1) {
      cam.mode = "orbit";
      cam.enterTime = t;
      controls.minDistance = cam.target.mesh.geometry.parameters.radius * 2.2;
    }
  } else if (cam.mode === "orbit" && cam.target) {
    // Keep controls target on the moving planet, and subtly dolly the camera
    // along with it so the user stays in orbit.
    const planetWorld = new THREE.Vector3();
    cam.target.mesh.getWorldPosition(planetWorld);
    // Compute the controls target delta and shift camera by the same vector
    const delta = planetWorld.clone().sub(controls.target);
    controls.target.copy(planetWorld);
    camera.position.add(delta);
  }

  controls.update();

  // ---- Labels -----------------------------------------------------------
  labels.update(_sunWorld, 1); // AU already cached per planet

  // ---- Lens flare --------------------------------------------------------
  sun.group.getWorldPosition(_sunWorld);
  lensFlare.update(_sunWorld);

  // ---- Audio swell -------------------------------------------------------
  if (audioArmed && cam.mode === "orbit" && cam.target) {
    camera.getWorldPosition(_camWorld);
    const d = _camWorld.distanceTo(cam.target.mesh.getWorldPosition(new THREE.Vector3()));
    const r = cam.target.mesh.geometry.parameters.radius;
    // Swell maxes when within ~8 radii of the planet.
    const t = Math.max(0, Math.min(1, 1 - (d - r * 2) / (r * 10)));
    audio.setSwell(t);
  } else {
    audio.setSwell(0);
  }
  audio.tick(dt);

  // Update target card distance if we are tracking a planet
  if (cam.target) updateTargetCard(cam.target.data);

  composer.render();
  requestAnimationFrame(animate);
}
animate();
