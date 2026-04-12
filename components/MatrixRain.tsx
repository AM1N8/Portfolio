"use client";

import { useEffect, useRef } from "react";
import { TerminalTheme } from "@/hooks/useTerminal";

interface MatrixRainProps {
  theme: TerminalTheme;
  onExit: (e?: KeyboardEvent | MouseEvent) => void;
}

export default function MatrixRain({ theme, onExit }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const cols = Math.floor(w / 14) + 1;
    const ypos = Array(cols).fill(0);

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    let lastDrawTime = 0;
    const overlayColor = theme.bg.length === 7 ? theme.bg + "1a" : "rgba(0,0,0,0.1)";

    function renderMatrix(time: number) {
      animationFrameId = requestAnimationFrame(renderMatrix);
      
      // Limit to ~20 fps
      if (time - lastDrawTime < 50) return;
      lastDrawTime = time;

      if (!ctx || !canvas) return;
      
      // Draw a semi-transparent rectangle on top of previous drawing for tail fade effect
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, w, h);

      // Draw the characters
      ctx.fillStyle = theme.success;
      ctx.font = "14px 'IBM Plex Mono', monospace";

      ypos.forEach((y, ind) => {
        // Use half-width Katakana logic for maximum matrix authentic effect
        const char = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = ind * 14;
        
        ctx.fillText(char, x, y);
        
        // Randomly reset the drop to top of screen
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 14;
      });
    }

    animationFrameId = requestAnimationFrame(renderMatrix);

    const handleResize = () => {
      w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  // Global exit listener
  useEffect(() => {
    const handleExit = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
         return;
      }
      e.preventDefault();
      e.stopPropagation();
      onExit(e);
    };

    window.addEventListener("keydown", handleExit, { capture: true });
    window.addEventListener("click", handleExit, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleExit, { capture: true });
      window.removeEventListener("click", handleExit, { capture: true });
    };
  }, [onExit]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        backgroundColor: theme.bg,
      }}
    />
  );
}
