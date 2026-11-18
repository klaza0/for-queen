"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { queen } from "@/config/queen";
import { setSoundMix } from "@/lib/sound";

export function FloatingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const volumeRef = useRef(0.7);
  const mutedRef = useRef(false);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    volumeRef.current = volume;
    mutedRef.current = muted;
    setSoundMix(volume, muted);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let disposed = false;
    let detachGesture: (() => void) | null = null;

    const detach = () => {
      detachGesture?.();
      detachGesture = null;
    };

    const beginPlayback = () => {
      if (disposed || userPausedRef.current) return;
      audio.volume = mutedRef.current ? 0 : volumeRef.current;
      void audio
        .play()
        .then(() => {
          if (!disposed && !userPausedRef.current) setPlaying(true);
        })
        .catch(() => {
          if (!disposed && audio.paused) setPlaying(false);
        });
    };

    const onGesture = (event: Event) => {
      detach();
      const button = playButtonRef.current;
      if (button && event.target instanceof Node && button.contains(event.target)) return;
      beginPlayback();
    };

    const attachGesture = () => {
      window.addEventListener("pointerdown", onGesture, true);
      window.addEventListener("keydown", onGesture, true);
      detachGesture = () => {
        window.removeEventListener("pointerdown", onGesture, true);
        window.removeEventListener("keydown", onGesture, true);
      };
    };

    audio.volume = volumeRef.current;
    void audio
      .play()
      .then(() => {
        if (!disposed && !userPausedRef.current) setPlaying(true);
      })
      .catch(() => {
        if (disposed || userPausedRef.current) return;
        attachGesture();
      });

    return () => {
      disposed = true;
      detach();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || missing) return;
    if (audio.paused) {
      userPausedRef.current = false;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      userPausedRef.current = true;
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-white/70 bg-warm/80 px-3 py-2 shadow-[0_10px_30px_rgba(73,51,61,0.12)] backdrop-blur-md">
        <button
          ref={playButtonRef}
          type="button"
          onClick={toggle}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-deep text-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </button>
        <div className="min-w-0">
          <p className="font-display text-lg leading-none text-deep">For Queen</p>
          <p className="text-[11px] text-ink/70">{missing ? "Add birthday-song.mp3" : "A song for you"}</p>
        </div>
        <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
          {[0, 1, 2, 3].map((bar) => (
            <span
              key={bar}
              className={`w-0.5 rounded-full bg-rose ${playing ? "music-bar" : "h-1.5"}`}
              style={{ animationDelay: `${bar * 0.12}s` }}
            />
          ))}
        </span>
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep"
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
        </button>
        <label className="sr-only" htmlFor="volume">
          Volume
        </label>
        <input
          id="volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(event) => {
            setMuted(false);
            setVolume(Number(event.target.value));
          }}
          className="hidden w-20 accent-deep sm:block"
        />
      </div>
      <audio
        ref={audioRef}
        src={queen.audio}
        preload="none"
        loop
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onError={() => setMissing(true)}
      />
    </div>
  );
}
