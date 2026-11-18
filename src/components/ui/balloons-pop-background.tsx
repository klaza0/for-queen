"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type BalloonColor = { base: string; light: string; dark: string };

const colors: BalloonColor[] = [
  { base: "#D97998", light: "#F4B8C7", dark: "#A64D70" },
  { base: "#F4B8C7", light: "#FFF8F5", dark: "#D97998" },
  { base: "#D6B38A", light: "#F6E7CF", dark: "#A68455" },
  { base: "#FFF3EC", light: "#FFFFFF", dark: "#E7C7B0" },
  { base: "#B7C7B2", light: "#E4EEE2", dark: "#6E866C" },
];

type BalloonBackgroundProps = {
  active: boolean;
};

export function BalloonBackground({ active }: BalloonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const view = { width: 0, height: 0 };
    const mouse = { x: -2000, y: -2000 };
    const spawnTimers = new Set<number>();
    let balloons: Balloon[] = [];
    let particles: Particle[] = [];
    let frame = 0;
    let alive = true;
    const reduced = reduce === true || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity = 1;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 12;
        this.speedY = (Math.random() - 0.5) * 12;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2;
        this.opacity -= 0.025;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Balloon {
      x = 0;
      y = 0;
      r = 0;
      speed = 0;
      angle = 0;
      wobbleSpeed = 0;
      popped = false;
      colorSet: BalloonColor = colors[0];
      tailMidY = 0;
      tailEndY = 0;
      tailVelMid = 0;
      tailVelEnd = 0;
      prevX = 0;

      constructor(first = true) {
        this.init(first);
      }

      init(firstLoad: boolean) {
        this.r = Math.random() * 12 + 26;
        this.x = Math.random() * view.width;
        this.y = firstLoad ? Math.random() * view.height : view.height + this.r + 180;
        this.colorSet = colors[Math.floor(Math.random() * colors.length)];
        this.speed = Math.random() * 0.7 + 0.28;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.popped = false;
        this.prevX = this.x;
        this.tailMidY = this.r + 40;
        this.tailEndY = this.r + 110;
        this.tailVelMid = 0;
        this.tailVelEnd = 0;
      }

      drawBalloonPath(radius: number) {
        ctx.beginPath();
        ctx.moveTo(0, radius);
        ctx.bezierCurveTo(-radius * 1.2, radius * 0.8, -radius * 1.3, -radius * 1.2, 0, -radius * 1.2);
        ctx.bezierCurveTo(radius * 1.3, -radius * 1.2, radius * 1.2, radius * 0.8, 0, radius);
        ctx.closePath();
      }

      drawString() {
        const dx = this.x - this.prevX;
        this.prevX = this.x;
        const stiffness = 0.08;
        const damping = 0.85;

        const midTarget = this.r + 36 + Math.abs(dx) * 8;
        this.tailVelMid += (midTarget - this.tailMidY) * stiffness;
        this.tailVelMid *= damping;
        this.tailMidY += this.tailVelMid;

        const endTarget = this.r + 108 + Math.abs(dx) * 14;
        this.tailVelEnd += (endTarget - this.tailEndY) * stiffness;
        this.tailVelEnd *= damping;
        this.tailVelEnd += 0.35;
        this.tailEndY += this.tailVelEnd;

        const sway = Math.sin(this.angle * 1.8) * 6 + dx * 4;
        ctx.beginPath();
        ctx.moveTo(0, this.r + 5);
        ctx.bezierCurveTo(sway, this.tailMidY * 0.5, -sway, this.tailMidY, sway * 0.6, this.tailEndY);
        ctx.strokeStyle = "rgba(166,77,112,0.38)";
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      pop() {
        if (this.popped || reduced) return;
        this.popped = true;
        for (let index = 0; index < 18; index += 1) {
          particles.push(new Particle(this.x, this.y, this.colorSet.base));
        }
        const timer = window.setTimeout(() => {
          spawnTimers.delete(timer);
          if (!alive) return;
          this.init(false);
        }, 1000 + Math.random() * 1000);
        spawnTimers.add(timer);
      }

      update() {
        if (this.popped) return;
        this.y -= this.speed;
        this.angle += this.wobbleSpeed;
        this.x += Math.sin(this.angle * 0.6) * 0.8;

        const dx = this.x - mouse.x;
        const dy = this.y - this.r * 0.2 - mouse.y;
        if (Math.hypot(dx, dy) < this.r + 10) this.pop();
        if (this.y < -this.r - 200) this.init(false);
        this.draw();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.angle) * 0.06);
        this.drawString();
        this.drawBalloonPath(this.r);
        const gradient = ctx.createRadialGradient(-this.r * 0.3, -this.r * 0.5, this.r * 0.1, 0, 0, this.r * 1.5);
        gradient.addColorStop(0, this.colorSet.light);
        gradient.addColorStop(0.4, this.colorSet.base);
        gradient.addColorStop(1, this.colorSet.dark);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.restore();
      }
    }

    function countForWidth() {
      return window.matchMedia("(max-width: 768px)").matches ? 12 : 22;
    }

    function clearSpawns() {
      spawnTimers.forEach((timer) => window.clearTimeout(timer));
      spawnTimers.clear();
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      view.width = canvas.clientWidth || window.innerWidth;
      view.height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(view.width * ratio));
      canvas.height = Math.max(1, Math.floor(view.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      clearSpawns();
      particles = [];
      balloons = Array.from({ length: countForWidth() }, () => new Balloon(true));
      if (reduced) paint(false);
    }

    function popAt(x: number, y: number) {
      for (const balloon of balloons) {
        if (balloon.popped) continue;
        const dx = balloon.x - x;
        const dy = balloon.y - balloon.r * 0.2 - y;
        if (Math.hypot(dx, dy) < balloon.r + 10) balloon.pop();
      }
    }

    function paint(step: boolean) {
      ctx.clearRect(0, 0, view.width, view.height);
      particles = particles.filter((particle) => particle.opacity > 0);
      for (const particle of particles) {
        if (step) particle.update();
        particle.draw();
      }
      for (const balloon of balloons) {
        if (step) balloon.update();
        else balloon.draw();
      }
    }

    function onPointer(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      popAt(mouse.x, mouse.y);
    }

    function onPointerEnd(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        mouse.x = -2000;
        mouse.y = -2000;
      }
    }

    function onPointerLeave() {
      mouse.x = -2000;
      mouse.y = -2000;
    }

    resize();

    if (reduced) {
      window.addEventListener("resize", resize);
      return () => {
        alive = false;
        clearSpawns();
        window.removeEventListener("resize", resize);
      };
    }

    const animate = () => {
      paint(true);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      clearSpawns();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [active, reduce]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 z-[2] h-full w-full touch-pan-y"
      aria-hidden="true"
    />
  );
}
