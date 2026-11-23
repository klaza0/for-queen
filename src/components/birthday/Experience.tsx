"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AmbientBackground } from "@/components/animations/AmbientBackground";
import { BirthdayHero } from "@/components/birthday/BirthdayHero";
import { EnvelopeLetter } from "@/components/birthday/EnvelopeLetter";
import { FinalSurprise } from "@/components/birthday/FinalSurprise";
import { FloatingMusicPlayer } from "@/components/birthday/FloatingMusicPlayer";
import { FriendshipTimeline } from "@/components/birthday/FriendshipTimeline";
import { ScratchGallery } from "@/components/birthday/ScratchCard";
import { SecretDateLock } from "@/components/birthday/SecretDateLock";

const steps = ["lock", "letter", "birthday", "scratch", "timeline", "gift"] as const;
type Step = (typeof steps)[number];

export function Experience() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("lock");
  const [run, setRun] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, run]);

  function next() {
    const index = steps.indexOf(step);
    const following = steps[index + 1];
    if (following) setStep(following);
  }

  return (
    <>
      <AmbientBackground />
      <FloatingMusicPlayer />
      <AnimatePresence mode="wait">
        <motion.main
          key={`${step}-${run}`}
          className="pb-28"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === "lock" && <SecretDateLock onUnlock={next} />}
          {step === "letter" && <EnvelopeLetter onContinue={next} />}
          {step === "birthday" && <BirthdayHero onContinue={next} />}
          {step === "scratch" && <ScratchGallery onContinue={next} />}
          {step === "timeline" && <FriendshipTimeline onContinue={next} />}
          {step === "gift" && (
            <FinalSurprise
              onReplay={() => {
                setRun((value) => value + 1);
                setStep("letter");
              }}
            />
          )}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
