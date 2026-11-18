"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { queen } from "@/config/queen";
import { ContinueButton } from "@/components/ui/ContinueButton";

export function QueenPortrait({ onContinue }: { onContinue: () => void }) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  return (
    <section id="portrait" className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <h2 className="font-serif text-4xl text-ink sm:text-6xl">There&apos;s only one Queen.</h2>
      <p className="mt-3 text-ink/75">And that&apos;s what makes you so special. ♡</p>

      <motion.figure
        className="relative mt-10 w-full max-w-[340px]"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }} transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <div className="absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(circle,rgba(244,184,199,0.7),transparent_68%)]" />
        <div className="overflow-hidden rounded-[32px] border border-gold bg-warm p-2 shadow-[0_24px_50px_rgba(73,51,61,0.12)]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[26px] bg-background-soft">
            {failed ? (
              <div className="flex h-full items-center px-6 font-display text-2xl text-deep">
                Place the photograph at public/images/queen.jpg
              </div>
            ) : (
              <Image
                src={queen.photo}
                alt="Queen"
                fill
                sizes="(max-width: 768px) 86vw, 340px"
                className="object-cover"
                onError={() => setFailed(true)}
              />
            )}
          </div>
        </div>
        </motion.div>
      </motion.figure>
      <div className="mt-10">
        <ContinueButton className="continue-arabic" dir="rtl" lang="ar" onClick={onContinue}>
          لسه في حاجات حلوة مستنياكي ♡
        </ContinueButton>
      </div>
    </section>
  );
}
