"use client";

import React, { useState } from "react";

const tracks = [
  {
    title: "The New",
    artist: "Interpol",
    videoId: "hI5IVvUc9Rc",
    thumbnail: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fclassicalbumsundays.com%2Fwp-content%2Fuploads%2F2016%2F12%2F55292eb15e7e442a9f40f09625d6e111.png&f=1&nofb=1&ipt=63833d127c1ee22f7a73a46852db5253377fff30d7550b5f7a41359b44612d08",
  },
  {
    title: "Ode To The Mets",
    artist: "The Strokes",
    videoId: "BjC0KUxiMhc",
    thumbnail: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcultura.id%2Fwp-content%2Fuploads%2F2020%2F06%2FThe-Strokes-The-New-Abnormal.jpeg&f=1&nofb=1&ipt=ba7713b06a4e5f2c6a05979632eda4a1225ec062c1cb37d2b882aca5a55bd3fc",
  },
  {
    title: "Starless",
    artist: "King Crimson",
    videoId: "OfR6_V91fG8",
    thumbnail: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.progarchives.com%2Fprogressive_rock_discography_covers%2F191%2Fcover_3611412112016_r.jpg&f=1&nofb=1&ipt=1454493eb1c00aa3f3a6fd039a8987dfcb9f0f0943c2a6ca51537b82ab773c8b",
  },
];

const PLAYLIST_URL = "https://music.youtube.com/playlist?list=PL5Cc9yOYiqEkPDj1_b5by1PYcNeL4-jMq&si=9OiH70T9nLftgCED";

export default function MusicWidget() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);

  const toggleTrack = (videoId: string) => {
    setActiveTrack((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <div
      role="region"
      aria-label="Music picks"
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        backgroundColor: "transparent",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--color-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ color: "var(--color-green)", marginRight: "0.5rem" }}>/</span>
        NOW PLAYING
      </div>

      {/* Tracks */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {tracks.map((track, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => toggleTrack(track.videoId)}
              aria-label={`Play ${track.title} by ${track.artist}`}
              className="music-track-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                textDecoration: "none",
                background: "transparent",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <img
                src={track.thumbnail}
                alt=""
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                  borderRadius: "0",
                  display: "block",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
                <span
                  className="music-track-title"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: activeTrack === track.videoId ? "var(--color-green)" : "var(--color-white)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {track.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {track.artist}
                </span>
              </div>
              
              {/* Play Indicator / Icon */}
              <div style={{ color: activeTrack === track.videoId ? "var(--color-green)" : "var(--color-muted)", marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                {activeTrack === track.videoId ? "[PLAYING]" : "[PLAY]"}
              </div>
            </button>
            
            {/* Embedded Player expanding underneath */}
            {activeTrack === track.videoId && (
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${track.videoId}?autoplay=1&controls=1&showinfo=0&rel=0`}
                  title="YouTube music player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Footer Link */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full playlist on YouTube Music"
          className="btn-primary"
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          [Open Full Playlist →]
        </a>
      </div>
    </div>
  );
}
