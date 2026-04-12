"use client";

import React, { useState, useEffect } from "react";
import { useCRT } from "./CRTProvider";
import { DEFAULT_CRT_OPTIONS, type CRTOptions } from "@/lib/crt-shader";

export default function CRTSettings({ onClose }: { onClose: () => void }) {
  const { active, getOptions, setOptions, toggle } = useCRT();
  const [localOptions, setLocalOptions] = useState<CRTOptions>(
    getOptions() || DEFAULT_CRT_OPTIONS
  );

  // Sync if options change externally
  useEffect(() => {
    setLocalOptions(getOptions() || DEFAULT_CRT_OPTIONS);
  }, [active, getOptions]);

  const handleChange = (key: keyof CRTOptions, value: number) => {
    setLocalOptions((prev) => ({ ...prev, [key]: value }));
    setOptions({ [key]: value });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#121212",
        border: "1px solid #333",
        padding: "24px",
        zIndex: 1000,
        fontFamily: "'IBM Plex Mono', monospace",
        color: "#00ff00",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "16px", textTransform: "uppercase" }}>CRT Config</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#00ff00",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "14px",
          }}
        >
          [X]
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Status</span>
          <button
            onClick={() => toggle()}
            style={{
              background: active ? "#00ff00" : "transparent",
              color: active ? "#121212" : "#00ff00",
              border: "1px solid #00ff00",
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {active ? "ON" : "OFF"}
          </button>
        </div>

        {active && (
          <>
            <Slider
              label="Scanlines"
              value={localOptions.scanlineCount}
              min={100}
              max={800}
              step={10}
              onChange={(v) => handleChange("scanlineCount", v)}
            />
            <Slider
              label="Line Intensity"
              value={localOptions.scanlineIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => handleChange("scanlineIntensity", v)}
            />
            <Slider
              label="Vignette"
              value={localOptions.vignetteIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => handleChange("vignetteIntensity", v)}
            />
            <Slider
              label="Brightness"
              value={localOptions.brightness}
              min={0.8}
              max={1.2}
              step={0.05}
              onChange={(v) => handleChange("brightness", v)}
            />
            <Slider
              label="Flicker"
              value={localOptions.flickerIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => handleChange("flickerIntensity", v)}
            />
            <Slider
              label="Green Tint"
              value={localOptions.greenTint}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => handleChange("greenTint", v)}
            />
            <div style={{ marginTop: "16px" }}>
                <button 
                  onClick={() => {
                    Object.entries(DEFAULT_CRT_OPTIONS).forEach(([key, val]) => {
                      handleChange(key as keyof CRTOptions, val);
                    });
                  }}
                  style={{
                    background: "transparent",
                    color: "#00ff00",
                    border: "1px solid #00ff00",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    width: "100%",
                    textTransform: "uppercase",
                  }}
                >
                  Reset to Defaults
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
        <span>{label}</span>
        <span>{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "100%",
          accentColor: "#00ff00",
          backgroundColor: "#333",
          height: "2px",
          outline: "none",
          appearance: "none",
        }}
      />
    </div>
  );
}
