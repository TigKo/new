// WebAudio ambient space drone.  Two detuned low-frequency oscillators with a
// slow filter sweep produce a continuous pad; a bell-like partial adds shimmer.
// The master gain swells when the camera enters a planet's sphere of influence.

export class SpaceDrone {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.droneGain = null;
    this.swellGain = null;
    this.started = false;
    this.enabled = true;
    this.currentSwell = 0;
    this.targetSwell = 0;
  }

  start() {
    if (this.started) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);
      this.master = master;

      // Low reverb-ish feel via feedback delay
      const delay = ctx.createDelay(1.5);
      delay.delayTime.value = 0.85;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.4;
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      // Two detuned base oscillators
      const pad = ctx.createGain();
      pad.gain.value = 0.22;
      pad.connect(master);
      pad.connect(delay);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      filter.Q.value = 0.6;
      filter.connect(pad);

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 55;
      const osc2 = ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.value = 55.4;
      const osc3 = ctx.createOscillator();
      osc3.type = "triangle";
      osc3.frequency.value = 110.1;
      const oscMix = ctx.createGain();
      oscMix.gain.value = 0.3;
      osc1.connect(oscMix);
      osc2.connect(oscMix);
      osc3.connect(oscMix);
      oscMix.connect(filter);

      // Slow filter LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Shimmer bell (subtle high partial)
      const bell = ctx.createOscillator();
      bell.type = "sine";
      bell.frequency.value = 880;
      const bellGain = ctx.createGain();
      bellGain.gain.value = 0.015;
      bell.connect(bellGain);
      bellGain.connect(master);
      bellGain.connect(delay);

      // Noise bed
      const noise = ctx.createBufferSource();
      const nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const nd = nbuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.18;
      noise.buffer = nbuf;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 380;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.06;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);

      osc1.start();
      osc2.start();
      osc3.start();
      bell.start();
      lfo.start();
      noise.start();

      // Fade in
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 2.5);

      this.droneGain = master;
      this.started = true;
    } catch (e) {
      console.warn("Audio init failed:", e);
    }
  }

  setSwell(t) {
    this.targetSwell = Math.max(0, Math.min(1, t));
  }
  setEnabled(b) {
    this.enabled = b;
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(b ? 0.4 : 0, t + 0.5);
    }
  }
  toggle() { this.setEnabled(!this.enabled); return this.enabled; }

  tick(dt) {
    if (!this.master || !this.enabled || !this.ctx) return;
    this.currentSwell += (this.targetSwell - this.currentSwell) * Math.min(1, dt * 1.2);
    const g = 0.4 + this.currentSwell * 0.55;
    this.master.gain.setTargetAtTime(g, this.ctx.currentTime, 0.6);
  }
}
