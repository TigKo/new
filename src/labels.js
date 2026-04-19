// DOM-based 3D labels. Each label is tied to a THREE.Object3D and repositioned
// to the object's screen coordinates every frame.

import * as THREE from "three";
import { formatMass, formatDay, formatDistance } from "./data.js";

export class LabelSystem {
  constructor(container, camera) {
    this.container = container;
    this.camera = camera;
    this.entries = [];
    this.visible = true;
    this._tmp = new THREE.Vector3();
  }

  add(target, planetDef) {
    const el = document.createElement("div");
    el.className = "planet-label";
    el.innerHTML = `
      <div class="pl-name">${planetDef.name}</div>
      <div class="pl-row"><span>Mass</span><b>${formatMass(planetDef.mass)}</b></div>
      <div class="pl-row"><span>Day</span><b>${formatDay(planetDef.rotationDays)}</b></div>
      <div class="pl-row"><span>Distance</span><b id="plbl-${planetDef.id}-d">0 AU</b></div>
    `;
    this.container.appendChild(el);
    this.entries.push({ el, target, data: planetDef, distEl: el.querySelector(`#plbl-${planetDef.id}-d`) });
  }

  setVisible(b) {
    this.visible = b;
    this.container.style.display = b ? "block" : "none";
  }
  toggle() { this.setVisible(!this.visible); return this.visible; }

  update(sunWorld, auPerUnit) {
    if (!this.visible) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    for (const e of this.entries) {
      e.target.getWorldPosition(this._tmp);
      // distance in AU (approx – inverse of the pow curve is baked by sampling length)
      const dFromSun = e.target.getWorldPosition(new THREE.Vector3()).distanceTo(sunWorld);
      // approximate AU: exact value derived from the PLANETS table via data
      e.distEl.textContent = formatDistance(e.data._currentAU ?? dFromSun * auPerUnit);

      const v = this._tmp.clone().project(this.camera);
      if (v.z > 1) { e.el.style.opacity = 0; continue; }
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      e.el.style.left = `${x + 40}px`;
      e.el.style.top  = `${y}px`;
      const onScreen = x > -200 && x < w + 200 && y > -200 && y < h + 200;
      e.el.style.opacity = onScreen ? 1 : 0;
    }
  }
}
