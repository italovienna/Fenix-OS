// War Room SFX System - Procedurally Generated Sounds using Web Audio API
// No external files needed - all sounds are generated in real-time

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    // Lazy initialization (required for browser autoplay policies)
    init() {
        if (!this.initialized && !this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        }
    }

    // MECHANICAL CLICK (Button Press)
    click(volume = 0.3) {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Sharp transient with quick decay
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.value = 1200;

        filter.type = 'highpass';
        filter.frequency.value = 800;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // SWORD SHEATHE (Timer Start)
    swordSheathe(volume = 0.4) {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Metallic sliding sound with decreasing pitch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);

        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 5;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
    }

    // DEEP GONG (Timer Finish)
    gong(volume = 0.5) {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Deep resonant tone with long decay
        const fundamental = ctx.createOscillator();
        const harmonics = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        fundamental.type = 'sine';
        fundamental.frequency.value = 120; // Deep bass

        harmonics.type = 'triangle';
        harmonics.frequency.value = 360; // Harmonic overtone

        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 3.0); // Long decay

        fundamental.connect(filter);
        harmonics.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        fundamental.start(now);
        harmonics.start(now);
        fundamental.stop(now + 3.0);
        harmonics.stop(now + 3.0);
    }

    // LEVEL UP (Reward)
    levelUp(volume = 0.4) {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Ascending arpeggio
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C
        const duration = 0.15;

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + (index * duration);
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    }
}

// Singleton instance
const sfx = new SoundEffects();

// Export hook for components
export const useSound = () => ({
    click: (vol) => sfx.click(vol),
    swordSheathe: (vol) => sfx.swordSheathe(vol),
    gong: (vol) => sfx.gong(vol),
    levelUp: (vol) => sfx.levelUp(vol),
});

export default sfx;
