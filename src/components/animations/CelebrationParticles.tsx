"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Piece = { id: number; left: number; delay: number; drift: number; rose: boolean };

function makePieces(seed: number): Piece[] {
  const count = window.matchMedia("(max-width: 768px)").matches ? 14 : 26;
  return Array.from({ length: count }, (_, id) => ({
    id: seed * 100 + id,
    left: 8 + Math.random() * 84,
    delay: Math.random() * 0.4,
    drift: -30 + Math.random() * 60,
    rose: Math.random() > 0.45,
  }));
}

export function CelebrationParticles({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [wasActive, setWasActive] = useState(active);
  const [generation, setGeneration] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);

  if (active !== wasActive) {
    setWasActive(active);
    if (active && !reduce) {
      const next = generation + 1;
      setGeneration(next);
      setPieces(makePieces(next));
    }
    if (!active) setPieces([]);
  }

  useEffect(() => {
    if (!pieces.length) return;
    const timer = window.setTimeout(() => setPieces([]), 2800);
    return () => window.clearTimeout(timer);
  }, [pieces]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="rise-piece absolute bottom-[18%] h-2.5 w-2.5 rounded-full"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            background: piece.rose ? "#D97998" : "#D6B38A",
            ["--drift" as string]: `${piece.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
