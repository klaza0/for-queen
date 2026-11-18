"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { queen } from "@/config/queen";
import { ContinueButton } from "@/components/ui/ContinueButton";

function LetterParagraph({ text }: { text: string }) {
  const lines = text
    .replaceAll(" عشان ", "\nعشان ")
    .replaceAll(" وكل ", "\nوكل ")
    .replaceAll("،", "،\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <p
      className="font-letter text-[1.35rem] leading-[2.35] text-ink sm:text-[1.55rem] sm:leading-[2.45]"
      style={{ fontFamily: "var(--font-amiri), 'Amiri', 'Palatino Linotype', serif" }}
    >
      {lines.map((line, index) => (
        <span key={`${line.slice(0, 12)}-${index}`} className="mb-1 block">
          {line}
        </span>
      ))}
    </p>
  );
}

export function EnvelopeLetter({ onContinue }: { onContinue: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"closed" | "opening" | "reading">("closed");
  const reading = phase === "reading";

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("reading"), reduce ? 80 : 900);
  }

  return (
    <section id="letter" className={`mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center px-5 ${reading ? "justify-start pt-16 pb-40" : "justify-center py-20"}`}>
      <h2 className="text-center font-serif text-5xl text-ink sm:text-6xl">Hey Queen 💗</h2>
      <p className="mt-3 text-center text-ink/75">A little letter, just for you.</p>

      {!reading && (
        <button
          type="button"
          onClick={open}
          className="group relative mt-10 h-[250px] w-full max-w-[360px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep"
          aria-label="Tap to open your letter"
        >
          <span className="absolute inset-x-0 bottom-0 top-8 rounded-[22px] bg-[#f7c9d4] shadow-[0_18px_40px_rgba(166,77,112,0.16)]" />
          <span className="absolute inset-x-4 top-12 h-28 rounded-xl bg-warm shadow-inner" />
          <motion.span
            className="absolute inset-x-0 top-8 h-[132px] origin-top rounded-t-[22px] bg-[#e7a8b8]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformPerspective: 800 }}
            animate={{ rotateX: phase === "opening" ? 180 : 0 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="absolute left-1/2 top-[118px] grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-deep text-warm shadow-[0_8px_20px_rgba(166,77,112,0.35)]"
            animate={phase === "closed" && !reduce ? { scale: [1, 1.06, 1] } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 1.6, repeat: phase === "closed" ? Infinity : 0 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z" />
            </svg>
          </motion.span>
          <span className="absolute inset-x-0 -bottom-8 text-sm text-deep">Tap to open your letter ♡</span>
        </button>
      )}

      {reading && (
        <motion.article
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
          className="paper mt-8 w-full rounded-[28px] px-5 py-8 shadow-[0_20px_50px_rgba(73,51,61,0.08)] sm:px-10 sm:py-12"
          lang="ar"
          dir="rtl"
        >
          <div className="space-y-8">
            {queen.letter.map((paragraph, index) => (
              <motion.div
                key={paragraph.slice(0, 16)}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.15 + index * 0.28 }}
              >
                <LetterParagraph text={paragraph} />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-left" dir="ltr" lang="en">
            <p className="font-script text-4xl text-deep sm:text-5xl">{queen.signature}</p>
            <span className="signature-line mt-1 block h-px w-32 origin-left bg-gold" />
          </div>
          <div className="mt-10 flex justify-center" dir="ltr">
            <ContinueButton className="continue-arabic" dir="rtl" lang="ar" onClick={onContinue}>
              لسه في حاجات حلوة مستنياكي ♡
            </ContinueButton>
          </div>
        </motion.article>
      )}
    </section>
  );
}
