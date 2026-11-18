let context: AudioContext | null = null;
let volume = 0.7;
let muted = false;

export function setSoundMix(nextVolume: number, nextMuted: boolean) {
  volume = nextVolume;
  muted = nextMuted;
}

function ctx() {
  if (!context) {
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    context = new AudioCtx();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

export function playKeyClick(softer = false) {
  if (muted || volume <= 0) return;
  const audio = ctx();
  if (!audio) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const peak = (softer ? 0.028 : 0.045) * volume;
  osc.type = "sine";
  osc.frequency.setValueAtTime(softer ? 740 : 980, now);
  osc.frequency.exponentialRampToValueAtTime(softer ? 420 : 540, now + 0.028);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (softer ? 0.04 : 0.055));
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

export function playChime() {
  if (muted || volume <= 0) return;
  const audio = ctx();
  if (!audio) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07 * volume, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.56);
}

export function playBlow() {
  if (muted || volume <= 0) return;
  const audio = ctx();
  if (!audio) return;
  const length = Math.floor(audio.sampleRate * 0.35);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade * fade;
  }
  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.value = 900;
  gain.gain.value = 0.12 * volume;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  source.start();
}
