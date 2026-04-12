// filepath: lib/crt-shader.ts
// CRT overlay effect — pure CSS implementation
// Inspired by Serenity Shader by gingerbeardman (MIT License)
// No html2canvas, no WebGL, no render loop — just CSS layers

export interface CRTOptions {
  scanlineIntensity: number;  // 0.0–1.0,  default 0.35
  scanlineCount: number;      // 100–800,  default 256 (lines per screen)
  vignetteIntensity: number;  // 0.0–1.0,  default 0.25
  brightness: number;         // 0.8–1.2,  default 1.05
  flickerIntensity: number;   // 0.0–1.0,  default 0.4
  curvature: number;          // 0.0–10.0, default 6.0 (visual only)
  greenTint: number;          // 0.0–1.0,  default 0.15
}

export const DEFAULT_CRT_OPTIONS: CRTOptions = {
  scanlineIntensity: 0.25,
  scanlineCount: 400,
  vignetteIntensity: 0.55,
  brightness: 1.2,
  flickerIntensity: 1.0,
  curvature: 6.0,
  greenTint: 0.75,
};

export class CRTRenderer {
  private overlay: HTMLDivElement;
  private styleEl: HTMLStyleElement;
  private options: CRTOptions;

  constructor(options: Partial<CRTOptions> = {}) {
    this.options = { ...DEFAULT_CRT_OPTIONS, ...options };

    // Inject keyframe animation
    this.styleEl = document.createElement("style");
    this.styleEl.id = "crt-styles";
    document.head.appendChild(this.styleEl);

    // Create overlay element
    this.overlay = document.createElement("div");
    this.overlay.id = "crt-overlay";
    document.body.appendChild(this.overlay);

    // Create tint element
    const tint = document.createElement("div");
    tint.id = "crt-tint";
    document.body.appendChild(tint);

    this.applyStyles();
  }

  private applyStyles() {
    const o = this.options;
    const scanlineSize = Math.max(1, Math.round(window.innerHeight / o.scanlineCount));
    const scanlineAlpha = (o.scanlineIntensity * 0.3).toFixed(3);
    const vignetteSpread = Math.round(80 + o.vignetteIntensity * 200);
    const flickerAmount = (o.flickerIntensity * 0.04).toFixed(3);
    const greenHue = Math.round(o.greenTint * 20);

    // Keyframes for flicker
    this.styleEl.textContent = `
      @keyframes crt-flicker {
        0%   { opacity: ${1 - parseFloat(flickerAmount) * 0.5}; }
        5%   { opacity: ${1 - parseFloat(flickerAmount)}; }
        10%  { opacity: ${1 - parseFloat(flickerAmount) * 0.3}; }
        15%  { opacity: ${1 - parseFloat(flickerAmount) * 0.8}; }
        20%  { opacity: 1; }
        50%  { opacity: ${1 - parseFloat(flickerAmount) * 0.2}; }
        80%  { opacity: ${1 - parseFloat(flickerAmount) * 0.6}; }
        100% { opacity: ${1 - parseFloat(flickerAmount) * 0.4}; }
      }

      @keyframes crt-scanline-scroll {
        0%   { background-position: 0 0; }
        100% { background-position: 0 ${scanlineSize * 2}px; }
      }

      #crt-overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        pointer-events: none;
        animation: crt-flicker 0.15s infinite alternate;
      }

      /* Scanlines */
      #crt-overlay::before {
        content: '';
        position: fixed;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, ${scanlineAlpha}) 0px,
          rgba(0, 0, 0, ${scanlineAlpha}) ${Math.max(1, scanlineSize - 1)}px,
          transparent ${Math.max(1, scanlineSize - 1)}px,
          transparent ${scanlineSize * 2}px
        );
        animation: crt-scanline-scroll 0.5s linear infinite;
        pointer-events: none;
        z-index: 201;
      }

      /* Vignette + subtle curvature illusion */
      #crt-overlay::after {
        content: '';
        position: fixed;
        inset: 0;
        box-shadow: inset 0 0 ${vignetteSpread}px rgba(0, 0, 0, ${(o.vignetteIntensity * 1.5).toFixed(2)});
        background: radial-gradient(
          ellipse at center,
          transparent 60%,
          rgba(0, 0, 0, ${(o.vignetteIntensity * 0.6).toFixed(2)}) 100%
        );
        pointer-events: none;
        z-index: 202;
      }

      /* Green phosphor tint layer */
      #crt-tint {
        position: fixed;
        inset: 0;
        background: rgba(0, ${Math.round(40 + o.greenTint * 60)}, 0, ${(o.greenTint * 0.08).toFixed(3)});
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: 199;
      }
    `;
  }

  render() {
    // No-op for API compatibility — CSS handles everything
    return Promise.resolve();
  }

  destroy() {
    this.overlay.remove();
    document.getElementById("crt-tint")?.remove();
    this.styleEl.remove();
  }

  updateOptions(opts: Partial<CRTOptions>) {
    this.options = { ...this.options, ...opts };
    this.applyStyles();
  }

  getOptions(): CRTOptions {
    return { ...this.options };
  }
}
