"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "motion/react";
import { CelebrationParticles } from "@/components/animations/CelebrationParticles";
import { BalloonBackground } from "@/components/ui/balloons-pop-background";
import { ContinueButton } from "@/components/ui/ContinueButton";
import { playBlow } from "@/lib/sound";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  gold: boolean;
};

function heartPoint(t: number, scale: number, cx: number, cy: number) {
  const x = 16 * Math.sin(t) ** 3;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: cx + x * scale, y: cy + y * scale };
}

function drawHeart(context: CanvasRenderingContext2D, x: number, y: number, size: number, gold: boolean) {
  context.save();
  context.translate(x, y);
  context.scale(size, size);
  context.fillStyle = gold ? "rgba(214,179,138,0.95)" : "rgba(217,121,152,0.92)";
  context.beginPath();
  context.moveTo(0, 3);
  context.bezierCurveTo(-6, -2, -1.5, -7, 0, -3);
  context.bezierCurveTo(1.5, -7, 6, -2, 0, 3);
  context.fill();
  context.restore();
}

export function BirthdayHero({ onContinue }: { onContinue: () => void }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  if (reduce && !revealed) setRevealed(true);
  const [blown, setBlown] = useState(false);
  const [wish, setWish] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let particles: Particle[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = window.matchMedia("(max-width: 768px)").matches ? 54 : 110;
      const scale = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.016;
      particles = Array.from({ length: count }, (_, index) => {
        const target = heartPoint((index / count) * Math.PI * 2, scale, canvas.clientWidth / 2, canvas.clientHeight * 0.34);
        return {
          x: Math.random() * canvas.clientWidth,
          y: canvas.clientHeight + Math.random() * 40,
          tx: target.x,
          ty: target.y,
          vx: 0,
          vy: 0,
          size: 0.7 + (index % 4) * 0.22,
          gold: index % 5 === 0,
        };
      });
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (progress: number, exploding = false) => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const glow = context.createRadialGradient(
        canvas.clientWidth / 2,
        canvas.clientHeight * 0.34,
        10,
        canvas.clientWidth / 2,
        canvas.clientHeight * 0.34,
        180,
      );
      glow.addColorStop(0, `rgba(244,184,199,${0.18 + progress * 0.28})`);
      glow.addColorStop(1, "rgba(244,184,199,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const particle of particles) {
        if (exploding) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.03;
        } else {
          particle.x += (particle.tx - particle.x) * (0.035 + progress * 0.05);
          particle.y += (particle.ty - particle.y) * (0.035 + progress * 0.05);
        }
        drawHeart(context, particle.x, particle.y, particle.size, particle.gold);
      }
    };

    if (reduce) {
      draw(1);
      return () => window.removeEventListener("resize", resize);
    }

    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: 1,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate: () => draw(proxy.t),
      onComplete: () => {
        for (const particle of particles) {
          particle.vx = (particle.x - canvas.clientWidth / 2) * 0.035 + (Math.random() - 0.5) * 1.4;
          particle.vy = (particle.y - canvas.clientHeight * 0.34) * 0.03 - 1.2;
        }
        gsap.to(proxy, {
          t: 2,
          duration: 0.9,
          onUpdate: () => draw(1, true),
          onComplete: () => {
            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            setRevealed(true);
          },
        });
      },
    });

    return () => {
      tween.kill();
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  function makeWish() {
    if (blown) return;
    setBlown(true);
    playBlow();
    setBurst(true);
    const veil = veilRef.current;
    if (!veil || reduce) {
      setWish(true);
      return;
    }
    gsap
      .timeline()
      .to(veil, { opacity: 0.72, duration: 0.28 })
      .to(veil, { opacity: 0, duration: 0.9 })
      .call(() => setWish(true), [], 0.32);
  }

  return (
    <section className="relative isolate flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-32 text-center sm:pb-16">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      <BalloonBackground active={blown} />
      <div ref={veilRef} className="pointer-events-none absolute inset-0 z-[4] bg-[#241018] opacity-0" />
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <CelebrationParticles active={burst} />
      </div>
      <div className={`pointer-events-none relative z-10 w-full max-w-4xl transition-opacity duration-700 ${revealed || reduce ? "opacity-100" : "opacity-0"}`}>
        <motion.h2
          className="font-serif text-5xl text-balance text-ink sm:text-7xl"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={revealed || reduce ? { opacity: 1, y: 0 } : undefined}
        >
          Happy Birthday, Queen!
        </motion.h2>
        <p className="arabic-wessam mx-auto mt-4 max-w-md text-lg text-ink/75 sm:text-2xl" dir="rtl" lang="ar">
          ٧ فبراير.. يوم ما الدنيا نورت بوجودك ❤️
        </p>
        <p className="arabic-wessam mx-auto mt-2 max-w-md text-base text-deep sm:text-lg" dir="rtl" lang="ar">
          اضغطي علي البلالين هتفرقع ^^
        </p>
        <Cake blown={blown} />
        {!blown && (
          <button
            type="button"
            dir="rtl"
            lang="ar"
            onClick={makeWish}
            className="pointer-events-auto mt-6 inline-flex min-h-12 max-w-full cursor-pointer items-center justify-center rounded-full border border-gold bg-warm px-5 py-3 text-center text-[1.15rem] leading-[1.9] whitespace-normal text-ink shadow-sm transition hover:bg-background-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-deep"
            style={{ fontFamily: '"Arslan Wessam B", sans-serif' }}
          >
            اطلبي من الدنيا أمنية ♡
          </button>
        )}
        {wish && (
          <div className="mt-6">
            <p className="arabic-wessam mx-auto max-w-md text-xl text-deep sm:text-2xl" dir="rtl" lang="ar" role="status">
              يا رب كل أمنية حلوة في قلبك تبقى حقيقة ♡
            </p>
            <div className="mt-8">
              <ContinueButton className="pointer-events-auto continue-arabic" dir="rtl" lang="ar" onClick={onContinue}>
                لسه في حاجات حلوة مستنياكي ♡
              </ContinueButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Cake({ blown }: { blown: boolean }) {
  return (
    <svg viewBox="0 0 320 250" className="mx-auto mt-2 h-56 w-[min(100%,320px)]" role="img" aria-label="Birthday cake">
      <ellipse cx="160" cy="228" rx="108" ry="12" fill="#E7C7B0" />
      <rect x="78" y="168" width="164" height="52" rx="18" fill="#F6D5DE" />
      <path d="M78 186c16 16 24-10 40 2s22 16 36-2 24-14 40 0 28 14 48-2v-18H78z" fill="#D97998" />
      <rect x="98" y="128" width="124" height="48" rx="16" fill="#FFF7F4" />
      <path d="M98 146c14 12 18-8 30 2s18 12 28-2 20-12 32 0 22 10 34-2v-16H98z" fill="#F4B8C7" />
      <rect x="118" y="96" width="84" height="40" rx="14" fill="#F8E7EA" />
      <path d="M126 78c8 10 14-6 22 2s16 8 24-2 12-8 22 2" fill="none" stroke="#D6B38A" strokeWidth="3" strokeLinecap="round" />
      {[132, 160, 188].map((x, index) => (
        <g key={x}>
          <rect x={x - 4} y="62" width="8" height="36" rx="3" fill={index === 1 ? "#E7C39A" : "#D6B38A"} />
          {blown ? (
            <path d={`M${x} 58c-6-8 2-14 0-20 4 6 10 8 6 16-2 4-4 5-6 4z`} fill="#C9B7B2" opacity="0.7" />
          ) : (
            <g>
              <ellipse cx={x} cy="52" rx="7" ry="12" fill="#F6C56B">
                <animate attributeName="ry" values="12;9;12" dur={`${1.1 + index * 0.15}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse cx={x} cy="50" rx="3" ry="6" fill="#FFF6D8" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
