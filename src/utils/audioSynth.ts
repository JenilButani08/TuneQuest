// Web Audio Procedural Music Synthesizer
// Provides realistic ambient, synthwave, lo-fi, and electronic music synthesis
// as a bulletproof fallback when remote audio URLs are unavailable or offline.

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;
  private intervalId: any = null;
  private gainNode: GainNode | null = null;
  private masterVolume = 0.8;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.masterVolume;
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public playTrack(trackId: string, genre: string = 'synthwave') {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;

    // Define scale frequencies based on genre
    const scales: Record<string, number[]> = {
      synthwave: [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37], // A Dorian
      lofi: [174.61, 220, 261.63, 329.63, 349.23, 440, 523.25], // Fmaj7
      pop: [261.63, 293.66, 329.63, 349.23, 392.0, 440, 493.88, 523.25], // C Major
      chill: [196.0, 246.94, 293.66, 369.99, 392.0, 440, 587.33], // G Major
      cyber: [130.81, 146.83, 164.81, 196.0, 220.0, 261.63], // Minor punchy
    };

    const scale = scales[genre.toLowerCase()] || scales.synthwave;
    let step = 0;

    const playNote = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Alternating bass and melody
      const isBass = step % 4 === 0;
      const freq = isBass ? scale[0] / 2 : scale[Math.floor(Math.random() * scale.length)];

      osc.type = isBass ? 'triangle' : (step % 2 === 0 ? 'sine' : 'sawtooth');
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const noteDuration = isBass ? 0.6 : 0.35;

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(isBass ? 0.25 : 0.12, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + noteDuration);

      step++;
    };

    // Trigger pulse beat
    playNote();
    this.intervalId = setInterval(playNote, 420);
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public playTone(freq: number, durationSec: number = 0.25, type: OscillatorType = 'sine') {
    this.initContext();
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const now = this.ctx.currentTime;
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + durationSec);
  }
}

export const proceduralAudio = new ProceduralAudioEngine();
