"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import Terminal from "./Terminal";
import { PersonalConfig } from "@/lib/config";
import { useCRT } from "./CRTProvider";

interface TerminalProviderProps {
  children: ReactNode;
  config: PersonalConfig;
}

export default function TerminalProvider({ children, config }: TerminalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggle: crtToggle } = useCRT();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTerminal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeTerminal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Explicitly check if the focused element is the terminal's own input
      const activeElement = document.activeElement;
      const isTerminalInput = activeElement?.classList?.contains("terminal-input");
      
      // True only if an unrelated text field is focused
      const isOtherInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
         activeElement.tagName === "TEXTAREA" ||
         (activeElement as HTMLElement).isContentEditable) &&
        !isTerminalInput;

      // Trigger condition: Ctrl+` (or Backquote code) OR ~ key
      const isHotkey = (e.ctrlKey && (e.key === "`" || e.code === "Backquote")) || e.key === "~";

      if (isHotkey && !isOtherInputFocused) {
        e.preventDefault(); // Prevent typing backtick/tilde if possible
        toggleTerminal();
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        closeTerminal();
      }

      // Ctrl+Shift+C toggles CRT mode
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        crtToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleTerminal, closeTerminal, crtToggle]);

  return (
    <>
      {children}
      {mounted &&
        createPortal(
          <Terminal isOpen={isOpen} closeTerminal={closeTerminal} config={config} />,
          document.body
        )}
    </>
  );
}
