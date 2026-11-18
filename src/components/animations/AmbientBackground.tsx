"use client";

import { useReducedMotion } from "motion/react";

const hearts = [
  { left: "8%", delay: "0s", duration: "16s", size: 14 },
  { left: "18%", delay: "3s", duration: "18s", size: 10 },
  { left: "72%", delay: "1s", duration: "15s", size: 12 },
  { left: "84%", delay: "5s", duration: "19s", size: 16 },
  { left: "46%", delay: "7s", duration: "17s", size: 9 },
  { left: "62%", delay: "2s", duration: "20s", size: 11 },
];

export function AmbientBackground() {
  const reduce = useReducedMotion();
  const visible = reduce ? hearts.slice(0, 2) : hearts;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="ambient-wash absolute inset-0" />
      {visible.map((heart) => (
        <span
          key={heart.left}
          className={reduce ? "absolute text-rose/30" : "float-heart absolute text-rose/35"}
          style={{
            left: heart.left,
            bottom: "-8%",
            fontSize: heart.size,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          <HeartGlyph />
        </span>
      ))}
      {!reduce && (
        <>
          <span className="petal absolute left-[12%] top-[20%]" />
          <span className="petal absolute right-[14%] top-[36%] [animation-delay:-6s]" />
          <span className="sparkle absolute left-[28%] top-[12%]" />
          <span className="sparkle absolute right-[30%] top-[68%] [animation-delay:-2s]" />
        </>
      )}
    </div>
  );
}

function HeartGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z" />
    </svg>
  );
}
