"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ZoomImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ZoomImage({ src, alt, caption }: ZoomImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const lightbox = isOpen ? createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        backgroundColor: "rgba(10, 10, 10, 0.98)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 5vw, 4rem)",
        cursor: "zoom-out",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={() => setIsOpen(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
      <div 
        style={{ 
          position: "relative", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />
        {caption && (
          <p style={{
            marginTop: "1.5rem",
            color: "var(--color-white)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            textAlign: "center",
            maxWidth: "600px"
          }}>
            <span style={{ color: "var(--color-green)" }}>//</span> {caption}
          </p>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <figure 
        style={{ 
          margin: "3rem 0", 
          cursor: "zoom-in" 
        }} 
        onClick={() => setIsOpen(true)}
      >
        <div style={{
          border: "1px solid var(--color-border)",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          overflow: "hidden",
          transition: "all 0.3s ease",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-green)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
        {caption && (
          <figcaption
            style={{
              marginTop: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-muted)",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <span style={{ color: "var(--color-green)" }}>/</span> {caption}
          </figcaption>
        )}
      </figure>

      {lightbox}
    </>
  );
}

