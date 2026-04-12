"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PersonalConfig } from "@/lib/config";
import { useTerminal, OutputLine, AVAILABLE_COMMANDS, VimState, TerminalTheme } from "@/hooks/useTerminal";
import { useCRT } from "./CRTProvider";

interface TerminalProps {
  isOpen: boolean;
  closeTerminal: () => void;
  config: PersonalConfig;
}

import MatrixRain from "./MatrixRain";

// ── VimEditor Component ──────────────────────────────────────
function VimEditor({
  vim,
  theme,
  onKey,
}: {
  vim: VimState;
  theme: TerminalTheme;
  onKey: (e: KeyboardEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(20);

  // Focus container on mount and whenever mode changes
  useEffect(() => {
    containerRef.current?.focus();
  }, [vim.mode]);

  // Calculate visible lines based on container height
  useEffect(() => {
    const el = bufferRef.current;
    if (!el) return;
    const lineHeight = 20; // ~13px font * 1.6 line-height
    const bufferHeight = el.clientHeight;
    setVisibleLines(Math.floor(bufferHeight / lineHeight));
  }, []);

  // Attach keydown listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [onKey]);

  // Auto-scroll to cursor
  useEffect(() => {
    if (!bufferRef.current) return;
    const lineHeight = 20;
    const scrollTop = bufferRef.current.scrollTop;
    const viewportHeight = bufferRef.current.clientHeight;
    const cursorTop = vim.cursor.row * lineHeight;

    if (cursorTop < scrollTop) {
      bufferRef.current.scrollTop = cursorTop;
    } else if (cursorTop + lineHeight > scrollTop + viewportHeight) {
      bufferRef.current.scrollTop = cursorTop - viewportHeight + lineHeight;
    }
  }, [vim.cursor.row]);

  const totalLines = Math.max(vim.content.length, visibleLines);
  const gutterWidth = vim.showLineNumbers ? `${String(totalLines).length + 2}ch` : "0";

  const renderBufferLine = (lineIdx: number) => {
    const isContentLine = lineIdx < vim.content.length;
    const lineText = isContentLine ? vim.content[lineIdx] : "";
    const isCursorRow = lineIdx === vim.cursor.row;

    if (!isContentLine) {
      // Tilde line
      return (
        <div key={`line-${lineIdx}`} style={{ display: "flex", height: "20px", lineHeight: "20px" }}>
          {vim.showLineNumbers && (
            <span style={{ width: gutterWidth, color: theme.muted, textAlign: "right", paddingRight: "8px", userSelect: "none", flexShrink: 0 }}>
              {lineIdx + 1}
            </span>
          )}
          <span style={{ color: theme.muted }}>~</span>
        </div>
      );
    }

    // Render content line with cursor
    const chars = lineText.split("");
    const isInsert = vim.mode === "insert";

    return (
      <div key={`line-${lineIdx}`} style={{ display: "flex", height: "20px", lineHeight: "20px" }}>
        {vim.showLineNumbers && (
          <span style={{ width: gutterWidth, color: theme.muted, textAlign: "right", paddingRight: "8px", userSelect: "none", flexShrink: 0 }}>
            {lineIdx + 1}
          </span>
        )}
        <span style={{ whiteSpace: "pre" }}>
          {isCursorRow ? (
            <>
              {chars.map((ch, ci) => {
                if (ci === vim.cursor.col) {
                  return isInsert ? (
                    <React.Fragment key={ci}>
                      <span className="vim-cursor-insert" />
                      <span>{ch}</span>
                    </React.Fragment>
                  ) : (
                    <span key={ci} className="vim-cursor-normal">{ch}</span>
                  );
                }
                return <span key={ci}>{ch}</span>;
              })}
              {/* Cursor at end of line */}
              {vim.cursor.col >= chars.length && (
                isInsert ? (
                  <span className="vim-cursor-insert" />
                ) : (
                  <span className="vim-cursor-normal">&nbsp;</span>
                )
              )}
            </>
          ) : (
            lineText || "\u200B"
          )}
        </span>
      </div>
    );
  };

  // Status bar content
  const statusLeft = (() => {
    const mod = vim.modified ? " [Modified]" : "";
    return `  "${vim.filename}"${mod}  ${vim.content.length} line${vim.content.length !== 1 ? "s" : ""}  --`;
  })();
  const statusRight = `  Ln ${vim.cursor.row + 1}, Col ${vim.cursor.col + 1}  `;

  // Command line content
  const cmdLineContent = (() => {
    if (vim.cmdMessage) return null; // handled separately
    if (vim.mode === "command") return `:${vim.cmdLine}`;
    if (vim.mode === "insert") return null;
    return "";
  })();

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        outline: "none",
        fontFamily: `"IBM Plex Mono", monospace`,
        fontSize: "13px",
        color: theme.fg,
        backgroundColor: theme.bg,
      }}
    >
      {/* Buffer area */}
      <div
        ref={bufferRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "4px 8px",
        }}
      >
        {Array.from({ length: totalLines }).map((_, i) => renderBufferLine(i))}
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: theme.success,
          color: theme.bg,
          fontWeight: 700,
          fontSize: "12px",
          padding: "2px 0",
          lineHeight: "18px",
          flexShrink: 0,
          whiteSpace: "pre",
        }}
      >
        <span>{statusLeft}</span>
        <span>{statusRight}</span>
      </div>

      {/* Command line */}
      <div
        style={{
          height: "22px",
          lineHeight: "22px",
          padding: "0 8px",
          fontSize: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {vim.cmdMessage ? (
          <span style={{ color: vim.cmdMessageType === "error" ? theme.error : theme.success }}>
            {vim.cmdMessage}
          </span>
        ) : vim.mode === "command" ? (
          <span>
            :{vim.cmdLine}
            <span className="vim-cursor-insert" style={{ borderColor: theme.fg }} />
          </span>
        ) : vim.mode === "insert" ? (
          <>
            <span />
            <span style={{ color: theme.success, fontWeight: 700 }}>-- INSERT --</span>
          </>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

// ── Terminal Component ───────────────────────────────────────
export default function Terminal({ isOpen, closeTerminal, config }: TerminalProps) {
  const crt = useCRT();
  const { history, theme, isMatrixActive, isFullscreen, vim, playingTrack, handleVimKey, exitMatrix, executeCommand, getPreviousCommand, getNextCommand, autocomplete } = useTerminal(config, closeTerminal, crt);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when panel opens or when clicking on the body
  useEffect(() => {
    if (isOpen && !vim.active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, vim.active]);

  // Keep scroll at bottom when history changes
  useEffect(() => {
    if (bodyRef.current && !vim.active) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, vim.active]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setInput(getPreviousCommand());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setInput(getNextCommand(input));
    } else if (e.key === "Tab") {
      e.preventDefault();
      setInput(autocomplete(input));
    } else if (e.key === "Escape") {
      closeTerminal();
    }
  };

  const renderLine = (line: OutputLine) => {
    let color = theme.fg;
    let opacity = "1";
    let whiteSpace: React.CSSProperties["whiteSpace"] = "pre-wrap";

    switch (line.type) {
      case "success":
        color = theme.success;
        break;
      case "error":
        color = theme.error;
        break;
      case "muted":
        color = theme.muted;
        break;
      case "command":
        color = theme.command;
        opacity = "0.7";
        break;
      case "ascii":
        color = theme.success;
        whiteSpace = "pre";
        break;
    }

    return (
      <div key={line.id} style={{ color, opacity, whiteSpace, wordBreak: "break-all" }}>
        {line.content}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: isFullscreen ? "100vh" : "38vh",
        backgroundColor: theme.bg,
        borderTop: isFullscreen ? "none" : `1px solid ${theme.topbar}`,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        transform: isOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: `"IBM Plex Mono", monospace`,
        fontSize: "15px",
      }}
      onClick={() => {
        if (!vim.active) inputRef.current?.focus();
      }}
    >
      {/* Top Bar (Chrome) */}
      <div
        style={{
          height: "28px",
          backgroundColor: theme.topbar,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", height: "100%" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); closeTerminal(); }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); closeTerminal(); }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f", cursor: "pointer" }} />
          </div>
          <div
            style={{
              color: theme.muted,
              fontSize: "11px",
              textTransform: "uppercase",
              borderBottom: `2px solid ${theme.success}`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              userSelect: "none",
            }}
          >
            {vim.active ? `VIM — ${vim.filename}` : "TERMINAL"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", color: theme.muted }}>
          <button
            onClick={(e) => { e.stopPropagation(); closeTerminal(); }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.fg)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
            aria-label="Minimize terminal"
          >
            [—]
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeTerminal(); }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.fg)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
            aria-label="Close terminal"
          >
            [✕]
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        aria-live="polite"
        style={{
          flex: 1,
          overflowY: vim.active ? "hidden" : "auto",
          overflowX: "hidden",
          padding: vim.active ? "0" : "8px 16px",
          lineHeight: 1.6,
          position: "relative",
        }}
      >
        {vim.active ? (
          <VimEditor vim={vim} theme={theme} onKey={handleVimKey} />
        ) : (
          <>
            {isMatrixActive && <MatrixRain theme={theme} onExit={exitMatrix} />}
            
            <div style={{ paddingBottom: "16px", display: isMatrixActive ? "none" : "block" }}>
              {history.map(renderLine)}
              
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: history.length > 0 ? "8px" : "0" }}>
                <span style={{ color: theme.user }}>cdxv</span>
                <span style={{ color: theme.host }}>@portfolio </span>
                <span style={{ color: theme.char }}>~ </span>
                <span style={{ color: theme.muted, marginRight: "8px" }}>$</span>
                
                <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
                  {/* Syntax Highlighted Display */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                      color: theme.fg,
                    }}
                  >
                    {(() => {
                      if (!input) return null;
                      const parts = input.split(" ");
                      const cmd = parts[0];
                      const rest = input.substring(cmd.length);
                      
                      const cmdColor = AVAILABLE_COMMANDS.includes(cmd.toLowerCase()) 
                        ? theme.success 
                        : theme.error;
                        
                      return (
                        <>
                          <span style={{ color: cmdColor }}>{cmd}</span>
                          {rest && <span style={{ color: theme.fg }}>{rest}</span>}
                        </>
                      );
                    })()}
                  </div>

                  {/* Functional Input Layer */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "transparent",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      width: "100%",
                      caretColor: theme.char,
                    }}
                    className="terminal-input"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Invisible Audio Player for 'music' Command */}
        {playingTrack && (
          <iframe 
            width="0" 
            height="0" 
            src={`https://www.youtube.com/embed/${playingTrack.id}?autoplay=1&enablejsapi=1&start=${playingTrack.start || 0}`}
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            title="YouTube Audio" 
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        )}
      </div>
    </div>
  );
}
