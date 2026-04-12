// filepath: components/CRTProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { CRTRenderer, CRTOptions } from "@/lib/crt-shader";

interface CRTContextValue {
  active: boolean;
  toggle: () => void;
  setOptions: (opts: Partial<CRTOptions>) => void;
  getOptions: () => CRTOptions | null;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const CRTContext = createContext<CRTContextValue>({
  active: false,
  toggle: () => {},
  setOptions: () => {},
  getOptions: () => null,
  showSettings: false,
  setShowSettings: () => {},
});

import CRTSettings from "./CRTSettings";

export function CRTProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const rendererRef = useRef<CRTRenderer | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedActive = localStorage.getItem("crt_active") === "true";
    if (savedActive) {
      import("@/lib/crt-shader").then(({ CRTRenderer }) => {
        const savedOptionsRaw = localStorage.getItem("crt_options");
        const savedOptions = savedOptionsRaw ? JSON.parse(savedOptionsRaw) : undefined;
        rendererRef.current = new CRTRenderer(savedOptions);
        rendererRef.current.render();
        setActive(true);
      }).catch(err => console.error("Failed to restore CRT state:", err));
    }
  }, []);

  const toggle = useCallback(async () => {
    if (active) {
      rendererRef.current?.destroy();
      rendererRef.current = null;
      setActive(false);
      localStorage.setItem("crt_active", "false");
    } else {
      try {
        const { CRTRenderer } = await import("@/lib/crt-shader");
        const savedOptionsRaw = localStorage.getItem("crt_options");
        const savedOptions = savedOptionsRaw ? JSON.parse(savedOptionsRaw) : undefined;
        rendererRef.current = new CRTRenderer(savedOptions);
        await rendererRef.current.render();
        setActive(true);
        localStorage.setItem("crt_active", "true");
      } catch (err) {
        console.error("Failed to initialize CRT shader:", err);
      }
    }
  }, [active]);

  const setOptions = useCallback((opts: Partial<CRTOptions>) => {
    if (rendererRef.current) {
      rendererRef.current.updateOptions(opts);
      localStorage.setItem("crt_options", JSON.stringify(rendererRef.current.getOptions()));
    }
  }, []);

  const getOptions = useCallback((): CRTOptions | null => {
    return rendererRef.current?.getOptions() ?? null;
  }, []);

  return (
    <CRTContext.Provider value={{ active, toggle, setOptions, getOptions, showSettings, setShowSettings }}>
      {children}
      {showSettings && <CRTSettings onClose={() => setShowSettings(false)} />}
    </CRTContext.Provider>
  );
}

export const useCRT = () => useContext(CRTContext);
