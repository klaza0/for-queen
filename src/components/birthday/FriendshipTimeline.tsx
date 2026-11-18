"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FRIENDSHIP_START_YEAR } from "@/config/queen";
import { ContinueButton } from "@/components/ui/ContinueButton";

function splitElapsed(from: number, now: number) {
  let delta = Math.max(0, now - from);
  const days = Math.floor(delta / 86_400_000);
  delta %= 86_400_000;
  const hours = Math.floor(delta / 3_600_000);
  delta %= 3_600_000;
  const minutes = Math.floor(delta / 60_000);
  const seconds = Math.floor((delta % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function FriendshipTimeline({ onContinue }: { onContinue: () => void }) {
  const pathRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<number | null>(null);
  const year = FRIENDSHIP_START_YEAR;
  const start = year == null ? null : new Date(year, 8, 23, 0, 0, 0, 0).getTime();
  const elapsed = start != null && now != null && now >= start ? splitElapsed(start, now) : null;

  useEffect(() => {
    if (year == null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [year]);

  useEffect(() => {
    const root = pathRef.current;
    if (!root) return;
    const hearts = root.querySelectorAll("[data-heart]");
    const tween = gsap.to(hearts, {
      y: 180,
      duration: 5.5,
      ease: "none",
      repeat: -1,
      stagger: 1.2,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section id="timeline" className="mx-auto w-full max-w-xl px-5 py-20">
      <div className="text-center">
        <h2 className="font-serif text-4xl text-balance text-ink sm:text-5xl">From 23/09 to Forever ♾️</h2>
        <p className="mt-3 text-ink/75">Some dates are simply unforgettable.</p>
      </div>

      {elapsed && (
        <dl className="mt-8 grid grid-cols-4 gap-2 text-center">
          {(
            [
              ["Days", elapsed.days],
              ["Hours", elapsed.hours],
              ["Minutes", elapsed.minutes],
              ["Seconds", elapsed.seconds],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-warm px-2 py-3 shadow-sm">
              <dt className="text-[11px] tracking-wide text-ink/60 uppercase">{label}</dt>
              <dd className="font-display text-2xl text-deep">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div ref={pathRef} className="relative mt-12 ps-8">
        <div className="absolute top-2 bottom-2 left-3 w-px bg-pink" />
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            data-heart
            className="absolute left-[7px] text-rose"
            style={{ top: 8 }}
            aria-hidden="true"
          >
            ♥
          </span>
        ))}
        <article className="rounded-[24px] bg-warm p-5 shadow-[0_10px_30px_rgba(73,51,61,0.05)]">
          <h3 className="font-display text-3xl text-deep">23 September</h3>
          <p className="mt-1 text-ink/80">Where our story begins ♡</p>
        </article>
        <p className="py-10 text-center font-display text-xl text-ink/80">Every second is another little memory.</p>
        <article className="rounded-[24px] bg-warm p-5 shadow-[0_10px_30px_rgba(73,51,61,0.05)]">
          <h3 className="flex items-center gap-3 font-display text-3xl text-deep">
            <InfinityMark />
            Forever
          </h3>
        </article>
      </div>
      <div className="mt-10 flex justify-center">
        <ContinueButton className="continue-arabic" dir="rtl" lang="ar" onClick={onContinue}>
          لسه في حاجات حلوة مستنياكي ♡
        </ContinueButton>
      </div>
    </section>
  );
}

function InfinityMark() {
  return (
    <svg viewBox="0 0 64 32" className="h-8 w-14 text-rose" aria-hidden="true">
      <path
        d="M32 16c-4-7-10-12-16-12C8 4 2 10 2 16s6 12 14 12c6 0 12-5 16-12 4 7 10 12 16 12 8 0 14-6 14-12S56 4 48 4c-6 0-12 5-16 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        className="infinity-stroke"
      />
    </svg>
  );
}
