# Helios — An Interactive 3D Solar System

A cinematic, fully-interactive solar system in the browser. Zero build step,
zero external assets — every planet texture, the Sun's corona, the starfield,
and the asteroid belt are generated procedurally at startup, and the scene
is rendered with Three.js + ACES filmic tone mapping and bloom.

## Run it

You only need a static HTTP server because the app uses ES modules:

```bash
# from the project root
python3 -m http.server 8123
# then open
open http://localhost:8123/
```

Anything that serves static files works (`npx serve .`, `http-server`, etc.).

## What's in the scene

- **Sun** with a rotating photospheric texture, a fresnel corona shell, a
  soft volumetric halo, a point light, and a full screen-space **lens-flare
  chain** (discs, hexes, rings, an anamorphic streak).
- **Eight planets** with correct *relative* sizes, axial tilts and sidereal
  rotation rates, textured procedurally (Earth has oceans, continents,
  polar caps and a cloud layer; Mars has craters and ice caps; gas giants
  have bands and storm systems; Venus has its opaque yellow cloud deck).
- **Atmospheric glow** rendered as a back-sided fresnel shell on every body
  that actually has an atmosphere.
- **Orbital paths** drawn as faint additive ellipses using the planet's
  eccentricity and inclination — they aren't circles.
- **Moons** — 14 of the largest (Luna, Phobos, Deimos, Io, Europa, Ganymede,
  Callisto, Titan, Rhea, Iapetus, Titania, Oberon, Triton) that become
  visible when you fly in.
- **Saturn's rings** rendered as ~18,000 individually coloured particles
  with the Cassini Division carved out of the density profile.
- **Asteroid belt** — 3,000 irregular InstancedMesh rocks on slightly
  inclined Keplerian orbits between Mars and Jupiter.
- **Starfield skybox** with a faint galactic band, nebulae tints and bright
  stars.

## How it moves

The simulation uses simplified Kepler elements (semi-major axis, eccentricity,
inclination, Ω, ω, L₀) and solves Kepler's equation each frame via
Newton–Raphson. Time is measured in Julian days since J2000.0.

## Controls

| Input               | Action                                                    |
|---------------------|-----------------------------------------------------------|
| **Click** a planet  | Smooth cinematic fly-to. Camera enters orbital view.      |
| Mouse drag / wheel  | Free orbit / zoom                                         |
| **L**               | Toggle 3D labels (mass / day length / distance from Sun) |
| **O**               | Toggle orbital path ellipses                              |
| **M**               | Toggle ambient space drone                                |
| **R**               | Reset view (and return to present)                       |
| **Space**           | Play / pause time                                         |
| Timeline slider     | Scrub ±5,000 years around the present epoch               |
| ⟪ / ▶ / ⟫ / ⌂       | Rewind, play, fast-forward, return-to-now                 |

## Audio

A WebAudio ambient drone (two detuned base oscillators, a slow filter LFO,
feedback delay, a shimmer partial and filtered noise) fades in on first
interaction and **swells** when the camera enters a planet's sphere of
influence.

## Scale compression

Real distances are compressed with a mild `auᵖ` curve so Mercury doesn't
vanish against the Sun and Neptune isn't beyond the horizon; planet radii
use a gentler curve. Ratios — Jupiter bigger than Earth, Mercury smaller
than the Moon, inner planets closer together than outer — are preserved.

## Files

```
index.html        shell + import map + HUD markup
src/
  main.js         orchestration: scene, camera, input, loop
  data.js         physical constants + Kepler propagation
  textures.js     procedural planet / Sun / star textures
  sun.js          solar surface, corona shader, lens flare
  planets.js      planet + moon construction
  orbits.js       orbital path lines
  rings.js        Saturn's particle-based ring system
  asteroids.js    procedural asteroid belt
  audio.js        ambient space drone
  labels.js       HTML label system
  styles.css      HUD + loader + typography
```

No build, no npm install — just open a static server and go.
