// The Sun: hot surface + corona sprite + lens-flare chain driven in screen-space.

import * as THREE from "three";
import { SCALE } from "./data.js";
import { makeSunTexture, makeFlareSprite } from "./textures.js";

export function createSun() {
  const group = new THREE.Group();
  group.name = "Sun";

  const surfaceTex = makeSunTexture();

  // Solar disc: unlit emissive sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(SCALE.sunRadius, 96, 64),
    new THREE.MeshBasicMaterial({ map: surfaceTex })
  );
  sphere.name = "SunSurface";
  group.add(sphere);

  // Inner corona shell: fresnel additive shader
  const coronaMat = new THREE.ShaderMaterial({
    uniforms: {
      uColorHot:  { value: new THREE.Color(0xfff3c8) },
      uColorCool: { value: new THREE.Color(0xff6a20) },
      uIntensity: { value: 1.0 },
      uTime:      { value: 0 },
    },
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vPosView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vPosView = mv.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vNormal;
      varying vec3 vPosView;
      uniform vec3 uColorHot;
      uniform vec3 uColorCool;
      uniform float uIntensity;
      uniform float uTime;
      void main() {
        vec3 viewDir = normalize(-vPosView);
        float f = 1.0 - max(dot(viewDir, vNormal), 0.0);
        // pulsing corona
        float pulse = 0.9 + 0.1 * sin(uTime * 0.5);
        float a = pow(f, 2.2) * uIntensity * pulse;
        vec3 col = mix(uColorCool, uColorHot, pow(f, 1.4));
        gl_FragColor = vec4(col * a, a);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const corona = new THREE.Mesh(
    new THREE.SphereGeometry(SCALE.sunRadius * 1.6, 64, 32),
    coronaMat
  );
  group.add(corona);

  // Outer soft halo sprite (always faces camera)
  const haloTex = makeFlareSprite("rgba(255,210,130,1)", 512, "disc");
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.55,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.setScalar(SCALE.sunRadius * 1.8);
  group.add(halo);

  // Soft outer glow (more subtle than the near halo)
  const godrayTex = makeFlareSprite("rgba(255,230,180,1)", 1024, "disc");
  const godrayMat = new THREE.SpriteMaterial({
    map: godrayTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.08,
  });
  const godray = new THREE.Sprite(godrayMat);
  godray.scale.setScalar(SCALE.sunRadius * 3.5);
  group.add(godray);

  // Actual point light – decay 0 for artistic uniform lighting across the
  // system (physically true sun dropoff would leave Neptune in shadow).
  const light = new THREE.PointLight(0xffe6b8, 3.2, 0, 0);
  light.position.set(0, 0, 0);
  group.add(light);

  return { group, sphere, corona, halo, godray, light, surfaceTex, coronaMat };
}

// ---------- Lens flare chain (DOM-based screen-space) ---------------------
//
// Rather than wrestling with near-plane sprites whose world-space size blows
// up as depth approaches zero, we draw the entire flare chain as ordinary
// DOM elements stacked on top of the canvas.  Positions are recomputed each
// frame from the Sun's projected screen coordinates.

const FLARE_ELEMENTS = [
  { dist: -0.10, size: 260, color: "rgba(255,220,160,1)", kind: "disc",   opacity: 0.70 },
  { dist: -0.02, size:  70, color: "rgba(255,240,210,1)", kind: "hex",    opacity: 0.45 },
  { dist:  0.08, size:  50, color: "rgba(180,220,255,1)", kind: "hex",    opacity: 0.40 },
  { dist:  0.14, size: 120, color: "rgba(255,200,140,1)", kind: "disc",   opacity: 0.40 },
  { dist:  0.24, size:  36, color: "rgba(200,220,255,1)", kind: "disc",   opacity: 0.50 },
  { dist:  0.36, size:  90, color: "rgba(255,230,180,1)", kind: "ring",   opacity: 0.45 },
  { dist:  0.58, size:  44, color: "rgba(160,200,255,1)", kind: "hex",    opacity: 0.30 },
  { dist:  0.78, size: 180, color: "rgba(255,200,140,1)", kind: "disc",   opacity: 0.35 },
  { dist:  1.10, size: 240, color: "rgba(255,180,120,1)", kind: "disc",   opacity: 0.55 },
];

export function createLensFlare(scene, camera) {
  const root = document.createElement("div");
  Object.assign(root.style, {
    position: "fixed", inset: "0", pointerEvents: "none", zIndex: "6",
    overflow: "hidden", mixBlendMode: "screen",
  });
  document.body.appendChild(root);

  function spriteEl(kind, color, size) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const s = makeFlareSprite(color, 256, kind).image;
    ctx.drawImage(s, 0, 0);
    const img = document.createElement("div");
    Object.assign(img.style, {
      position: "absolute",
      width: size + "px",
      height: size + "px",
      backgroundImage: `url(${c.toDataURL()})`,
      backgroundSize: "cover",
      transform: "translate(-50%, -50%)",
      willChange: "transform, opacity",
      pointerEvents: "none",
    });
    root.appendChild(img);
    return img;
  }

  const elements = FLARE_ELEMENTS.map((el) => ({ ...el, node: spriteEl(el.kind, el.color, el.size) }));
  const streakNode = spriteEl("streak", "rgba(255,230,180,1)", 900);
  streakNode.style.height = "8px";

  const sunScreen = new THREE.Vector3();

  function update(sunPosWorld) {
    const w = window.innerWidth, h = window.innerHeight;
    sunScreen.copy(sunPosWorld).project(camera);
    const behind = sunScreen.z > 1;
    if (behind) {
      for (const e of elements) e.node.style.opacity = 0;
      streakNode.style.opacity = 0;
      return;
    }

    const sx = (sunScreen.x * 0.5 + 0.5) * w;
    const sy = (-sunScreen.y * 0.5 + 0.5) * h;
    const cx = w * 0.5, cy = h * 0.5;

    // on-axis fade (flare gets weaker as the sun moves away from screen center)
    const onAxis = 1 - Math.min(1, Math.hypot(sunScreen.x, sunScreen.y) / 1.3);

    // distance attenuation in *world* space
    const dist = camera.position.distanceTo(sunPosWorld);
    const distFactor = THREE.MathUtils.clamp(500 / dist, 0.25, 1.6);

    for (const e of elements) {
      const x = THREE.MathUtils.lerp(sx, cx, e.dist);
      const y = THREE.MathUtils.lerp(sy, cy, e.dist);
      const scale = distFactor;
      e.node.style.transform = `translate(${x - (e.size * scale) / 2}px, ${y - (e.size * scale) / 2}px) scale(${scale})`;
      e.node.style.left = "0"; e.node.style.top = "0";
      e.node.style.opacity = (e.opacity * onAxis).toFixed(3);
    }
    // streak
    const ss = 1.4 * distFactor;
    streakNode.style.transform = `translate(${sx - 450 * ss}px, ${sy - 4 * ss}px) scale(${ss}, 1)`;
    streakNode.style.left = "0"; streakNode.style.top = "0";
    streakNode.style.opacity = (0.7 * onAxis).toFixed(3);
  }

  return { update };
}
