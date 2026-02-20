"use client";

import { useEffect, useRef } from "react";

const CHARS = "MARLLON DINIZ<>{}[]|/\\=+-*#@$%&";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 13;
    let cols: number[] = [];
    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor(canvas.width / fontSize);
      cols = Array.from({ length: count }, () => Math.random() * -100);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(10,10,11,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;

        const bright = Math.random() > 0.94;
        if (bright) {
          ctx.fillStyle = "rgba(34,197,94,0.6)";
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(34,197,94,${0.05 + Math.random() * 0.12})`;
          ctx.shadowBlur = 0;
        }

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, x, y * fontSize);
        ctx.shadowBlur = 0;

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          cols[i] = 0;
        } else {
          cols[i] += 0.5;
        }
      });
    }

    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function loop(ts: number) {
      if (ts - last > 60) {
        draw();
        last = ts;
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-30 pointer-events-none"
      aria-hidden
    />
  );
}
