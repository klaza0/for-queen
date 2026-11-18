"use client";

import { useEffect, useRef, useState } from "react";
import { queen } from "@/config/queen";
import { ContinueButton } from "@/components/ui/ContinueButton";

type ScratchCardProps = {
  message: string;
  index: number;
};

export function ScratchCard({ message, index }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const [done, setDone] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const english = index === queen.scratch.length - 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const paintFoil = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#F4B8C7");
      gradient.addColorStop(0.55, "#E7A8B8");
      gradient.addColorStop(1, "#D6B38A");
      context.globalCompositeOperation = "source-over";
      context.fillStyle = gradient;
      context.fillRect(0, 0, rect.width, rect.height);
      context.fillStyle = "rgba(255,252,250,0.85)";
      const random = mulberry32(index + 11);
      for (let star = 0; star < 10; star += 1) {
        const x = 16 + random() * (rect.width - 32);
        const y = 16 + random() * (rect.height - 32);
        context.beginPath();
        context.arc(x, y, 1.3, 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = "#A64D70";
      context.font = "16px var(--font-dm), sans-serif";
      context.textAlign = "center";
      context.fillText("Scratch me ♡", rect.width / 2, rect.height * 0.62);
      drawHeart(context, rect.width / 2, rect.height * 0.36, 16);
      setDone(false);
    };

    paintFoil();
    const observer = new ResizeObserver(paintFoil);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [index, resetKey]);

  function scratchAt(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || done) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 22, 0, Math.PI * 2);
    context.fill();
  }

  function finish() {
    scratching.current = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || done) return;
    const sample = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < sample.length; i += 32) {
      total += 1;
      if (sample[i] === 0) clear += 1;
    }
    if (total > 0 && clear / total >= 0.46) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setDone(true);
    }
  }

  return (
    <article className="relative min-h-44 overflow-hidden rounded-[24px] border border-pink bg-warm shadow-[0_12px_30px_rgba(166,77,112,0.08)]">
      <p
        className={`flex min-h-44 items-center justify-center px-5 py-4 text-center text-lg leading-8 ${english ? "font-display text-deep" : "arabic-wessam text-xl text-ink"}`}
        dir={english ? "ltr" : "rtl"}
        lang={english ? "en" : "ar"}
      >
        {message}
      </p>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none rounded-[24px] ${done ? "pointer-events-none opacity-0" : "cursor-pointer"}`}
        onPointerDown={(event) => {
          scratching.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          scratchAt(event);
        }}
        onPointerMove={(event) => {
          if (scratching.current) scratchAt(event);
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
        aria-hidden="true"
      />
      <div className="absolute right-3 bottom-3 flex gap-2">
        {!done && (
          <button
            type="button"
            onClick={() => setDone(true)}
            className="min-h-11 cursor-pointer rounded-full bg-warm/90 px-3 text-xs text-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep"
          >
            Reveal
          </button>
        )}
        {done && (
          <button
            type="button"
            onClick={() => setResetKey((value) => value + 1)}
            className="min-h-11 cursor-pointer rounded-full bg-deep px-3 text-xs text-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Reset
          </button>
        )}
      </div>
    </article>
  );
}

export function ScratchGallery({ onContinue }: { onContinue: () => void }) {
  return (
    <section id="special" className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col justify-center px-5 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-serif text-4xl text-balance text-ink sm:text-5xl">Little Things That Make You Special ♡</h2>
        <p className="arabic-wessam mx-auto mt-3 max-w-md text-lg text-ink/75 sm:text-xl" dir="rtl" lang="ar">
          خربشي براحتك يا قمر، المفاجأة ليكي
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {queen.scratch.map((message, index) => (
          <ScratchCard key={message} message={message} index={index} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <ContinueButton className="continue-arabic" dir="rtl" lang="ar" onClick={onContinue}>
          لسه في حاجات حلوة مستنياكي ♡
        </ContinueButton>
      </div>
    </section>
  );
}

function drawHeart(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  context.save();
  context.translate(x, y);
  context.scale(size / 16, size / 16);
  context.beginPath();
  context.moveTo(0, 4);
  context.bezierCurveTo(-8, -4, -2, -10, 0, -4);
  context.bezierCurveTo(2, -10, 8, -4, 0, 4);
  context.fill();
  context.restore();
}

function mulberry32(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
