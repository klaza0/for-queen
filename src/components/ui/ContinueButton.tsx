"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";

type ContinueButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  dir?: "rtl" | "ltr";
  lang?: string;
};

export function ContinueButton({ children, onClick, className = "", dir, lang }: ContinueButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  function move(event: React.MouseEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.22;
    node.style.transform = `translate(${x}px, ${y}px)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={reset}
      dir={dir}
      lang={lang}
      className={`inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-deep px-6 text-[15px] font-medium text-warm shadow-[0_10px_30px_rgba(166,77,112,0.22)] transition-[background-color,box-shadow] duration-200 hover:bg-[#8d3f60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-deep ${className}`}
    >
      {children}
    </button>
  );
}
