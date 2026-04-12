"use client";

import React from "react";

const GH_COLORS = {
  0: "#161b22", // Background/Empty
  1: "#0e4429", // Low
  2: "#006d32", // Mid
  3: "#26a641", // High
  4: "#39d353", // Max
};

// C (5x7)
const C = [
  [0, 1, 1, 1, 0],
  [1, 2, 0, 0, 2],
  [2, 3, 0, 0, 0],
  [3, 4, 0, 0, 0],
  [2, 3, 0, 0, 0],
  [1, 2, 0, 0, 2],
  [0, 1, 1, 1, 0],
];

// D (5x7)
const D = [
  [3, 4, 3, 2, 0],
  [3, 4, 0, 0, 2],
  [3, 4, 0, 0, 1],
  [3, 4, 0, 0, 1],
  [3, 4, 0, 0, 1],
  [3, 4, 0, 0, 2],
  [3, 4, 3, 2, 0],
];

// X (5x7)
const X = [
  [4, 3, 0, 3, 4],
  [2, 4, 3, 4, 2],
  [0, 2, 4, 2, 0],
  [0, 1, 4, 1, 0],
  [0, 2, 4, 2, 0],
  [2, 4, 3, 4, 2],
  [4, 3, 0, 3, 4],
];

// V (5x7)
const V = [
  [4, 3, 0, 0, 3, 4],
  [4, 3, 0, 0, 3, 4],
  [3, 2, 0, 0, 2, 3],
  [2, 2, 0, 0, 2, 2],
  [0, 3, 2, 2, 3, 0],
  [0, 2, 4, 4, 2, 0],
  [0, 0, 4, 4, 0, 0],
];

// Spacing column
const S = Array(7).fill(0).map(() => [0]);

/**
 * Renders a stylized GitHub contribution graph displaying "CDXV"
 */
export default function ContributionGraph() {
  // Construct the full grid (7 rows)
  // We'll organize it as columns for easier rendering
  const columns: number[][] = [];

  // Stable "random" generator for decoration noise
  const getStableNoise = (i: number, r: number) => {
    const seed = (i + 1) * (r + 1) * 7919; // Using a prime for distribution
    return (seed % 10) > 8 ? (seed % 2) + 1 : 0;
  };

  // Add some noise at the beginning
  for (let i = 0; i < 4; i++) {
    columns.push(Array(7).fill(0).map((_, r) => getStableNoise(i, r)));
  }

  // Helper to push a character map (transposed for column-first storage)
  const pushChar = (char: number[][]) => {
    const width = char[0].length;
    for (let c = 0; c < width; c++) {
      const colData = [];
      for (let r = 0; r < 7; r++) {
        colData.push(char[r][c]);
      }
      columns.push(colData);
    }
  };

  pushChar(C);
  columns.push(Array(7).fill(0)); // space
  pushChar(D);
  columns.push(Array(7).fill(0)); // space
  pushChar(X);
  columns.push(Array(7).fill(0)); // space
  pushChar(V);

  // Add some noise at the end
  for (let i = 0; i < 4; i++) {
    columns.push(Array(7).fill(0).map((_, r) => getStableNoise(i + 20, r)));
  }


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        padding: "0",
        animation: "fadeInUp 0.8s ease forwards",
        maxWidth: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >


      <div style={{ display: "flex", gap: "3px", position: "relative" }}>
        {/* Days of week labels */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateRows: "repeat(7, 10px)", 
            gap: "3px", 
            marginRight: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "var(--color-muted)",
            userSelect: "none"
          }}
        >
          <div style={{ visibility: "hidden" }}>Sun</div>
          <div>Mon</div>
          <div style={{ visibility: "hidden" }}>Tue</div>
          <div>Wed</div>
          <div style={{ visibility: "hidden" }}>Thu</div>
          <div>Fri</div>
          <div style={{ visibility: "hidden" }}>Sat</div>
        </div>

        {/* The Grid */}
        <div style={{ display: "flex", gap: "3px" }}>
          {columns.map((col, cIdx) => (
            <div key={cIdx} style={{ display: "grid", gridTemplateRows: "repeat(7, 10px)", gap: "3px" }}>
              {col.map((val, rIdx) => (
                <div
                  key={`${cIdx}-${rIdx}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    backgroundColor: GH_COLORS[val as keyof typeof GH_COLORS] || GH_COLORS[0],
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.3)";
                    e.currentTarget.style.zIndex = "10";
                    e.currentTarget.style.boxShadow = `0 0 8px ${GH_COLORS[val as keyof typeof GH_COLORS] || GH_COLORS[0]}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.zIndex = "1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <p 
        style={{ 
          marginTop: "1rem", 
          fontFamily: "var(--font-mono)", 
          fontSize: "10px", 
          color: "var(--color-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}
      >
        <span style={{ color: "var(--color-green)" }}>★</span> Contribution Activity Graph <span style={{ color: "var(--color-green)" }}>★</span>
      </p>
    </div>
  );
}

