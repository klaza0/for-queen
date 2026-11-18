"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Delete } from "lucide-react";
import { queen } from "@/config/queen";
import { playChime, playKeyClick } from "@/lib/sound";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

export function SecretDateLock({ onUnlock }: { onUnlock: () => void }) {
  const reduce = useReducedMotion();
  const onUnlockRef = useRef(onUnlock);
  const codeRef = useRef("");
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    onUnlockRef.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (opened || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^\d$/.test(event.key)) {
        playKeyClick();
        setCode((current) => (current.length >= 4 ? current : `${current}${event.key}`));
      }
      if (event.key === "Backspace") {
        if (codeRef.current.length > 0) playKeyClick(true);
        setCode((value) => value.slice(0, -1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  useEffect(() => {
    if (code.length !== 4 || opened) return;
    const timer = window.setTimeout(() => {
      if (code === queen.pin) {
        setOpened(true);
        playChime();
        window.setTimeout(() => onUnlockRef.current(), reduce ? 350 : 1300);
        return;
      }
      setShake(true);
      window.setTimeout(() => {
        setShake(false);
        setCode("");
      }, 480);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [code, opened, reduce]);

  function push(digit: string) {
    if (opened) return;
    setCode((current) => (current.length >= 4 ? current : `${current}${digit}`.slice(0, 4)));
  }

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-16 text-center">
      <p className="font-script text-4xl text-deep sm:text-5xl">A little secret, just for you ♡</p>
      <p className="mt-3 max-w-xs text-sm text-ink/75">Some surprises are worth unlocking.</p>

      <motion.div
        animate={shake ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
        transition={{ duration: 0.42 }}
        className="mt-10 w-full max-w-sm"
      >
        <div className="mx-auto grid w-full max-w-[280px] grid-cols-4 gap-3" aria-label="Four digit code">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className={`flex h-16 items-center justify-center rounded-2xl border bg-warm text-2xl font-display text-ink shadow-[0_8px_24px_rgba(166,77,112,0.08)] ${
                opened ? "border-gold" : "border-pink"
              }`}
            >
              {code[index] ?? ""}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {opened ? (
            <motion.div
              key="heart"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-10 flex justify-center"
            >
              <span className="grid h-24 w-24 place-items-center rounded-full bg-pink/80 text-deep shadow-[0_0_40px_rgba(217,121,152,0.45)]">
                <svg viewBox="0 0 24 24" className="h-12 w-12" fill="currentColor" aria-hidden="true">
                  <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.7C19 15.6 12 20 12 20z" />
                </svg>
              </span>
            </motion.div>
          ) : (
            <div className="mx-auto mt-8 grid w-full max-w-[280px] grid-cols-3 gap-2.5">
              {keys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === "back") {
                      if (code.length > 0) playKeyClick(true);
                      setCode((value) => value.slice(0, -1));
                    } else if (key === "clear") setCode("");
                    else {
                      playKeyClick();
                      push(key);
                    }
                  }}
                  className="flex h-14 cursor-pointer items-center justify-center rounded-2xl bg-warm text-lg text-ink shadow-[0_6px_16px_rgba(73,51,61,0.06)] transition hover:bg-background-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep"
                  aria-label={key === "back" ? "Delete" : key === "clear" ? "Clear" : key}
                >
                  {key === "back" ? <Delete className="h-5 w-5" aria-hidden="true" /> : key === "clear" ? "C" : key}
                </button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
