"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { queen } from "@/config/queen";
import { CelebrationParticles } from "@/components/animations/CelebrationParticles";
import { ContinueButton } from "@/components/ui/ContinueButton";

export function FinalSurprise({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <section id="surprise" className="relative mx-auto flex min-h-[100svh] w-full max-w-xl flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      <h2 className="font-serif text-4xl text-balance text-ink sm:text-5xl">Wait... one last thing, Queen ♡</h2>

      <div className="relative mt-10 h-48 w-48">
        <motion.div
          className="absolute inset-x-6 top-0 h-16 rounded-t-2xl bg-deep"
          animate={open ? { y: reduce ? -20 : -70, rotate: reduce ? 0 : -8 } : { y: [0, -6, 0] }}
          transition={open ? { duration: 0.6 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-4 top-12 h-28 rounded-2xl bg-pink shadow-[0_16px_30px_rgba(166,77,112,0.18)]" />
        <div className="absolute top-4 bottom-6 left-1/2 w-4 -translate-x-1/2 bg-gold" />
        <div className="absolute top-20 right-4 left-4 h-4 bg-gold" />
        {open && <span className="absolute top-16 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-warm/80 blur-xl" />}
      </div>
      <CelebrationParticles active={open} />

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex min-h-12 cursor-pointer items-center rounded-full bg-deep px-6 text-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
        >
          Open your surprise 🎁
        </button>
      ) : (
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="font-serif text-3xl text-ink">{queen.final.title}</p>
          <p className="arabic-wessam mt-4 text-xl text-ink" dir="rtl" lang="ar">
            {queen.final.arabic}
          </p>
          <p className="mt-4 font-script text-4xl text-deep">{queen.final.closing}</p>
          <div className="mt-8">
            <ContinueButton className="continue-arabic" dir="rtl" lang="ar" onClick={onReplay}>
              خلصنا ^-^ .. حابه نعيده ؟ ♡
            </ContinueButton>
          </div>
        </motion.div>
      )}
    </section>
  );
}
