"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MatrixRain from "@/components/MatrixRain";
import { THEMES } from "@/hooks/useTerminal";

const CDXV_ASCII_BOX = String.raw`  /$$$$$$  /$$$$$$$  /$$   /$$ /$$    /$$
 /$$__  $$| $$__  $$| $$  / $$| $$   | $$
| $$  \__/| $$  \ $$|  $$/ $$/| $$   | $$
| $$      | $$  | $$ \  $$$$/ |  $$ / $$/
| $$      | $$  | $$  >$$  $$  \  $$ $$/ 
| $$    $$| $$  | $$ /$$/\  $$  \  $$$/  
|  $$$$$$/| $$$$$$$/| $$  \ $$   \  $/   
 \______/ |_______/ |__/  |__/    \_/    `;

export default function VoidPage() {
  const router = useRouter();
  const theme = THEMES.tokyo_night;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#151515',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Background Matrix Rain */}
      <MatrixRain 
        theme={theme} 
        onExit={(e) => {
          if (e instanceof KeyboardEvent && e.key.toLowerCase() === 'q') {
            router.push('/');
          }
        }} 
      />

      {/* Centered ASCII Logo */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <pre style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 'clamp(10px, 1.5vw, 18px)',
          color: theme.success,
          textShadow: `0 0 20px ${theme.success}80`,
          lineHeight: 1.1,
          margin: 0,
          background: 'rgba(0,0,0,0.6)',
          padding: '40px',
          borderRadius: '8px',
          border: `1px solid ${theme.success}40`
        }}>
          {CDXV_ASCII_BOX}
        </pre>
        
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em'
        }}>
          PRESS 'Q' TO RETURN
        </div>
      </div>
    </div>
  );
}
