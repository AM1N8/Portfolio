import { useState, useCallback, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PersonalConfig } from "@/lib/config";
import { startDestruction, restoreAll } from "@/lib/rmrf";
import type { CRTOptions } from "@/lib/crt-shader";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type OutputLine = {
  id: string;
  content: string | ReactNode;
  type: "output" | "success" | "error" | "muted" | "command" | "ascii" | "raw";
};

export type TerminalTheme = {
  id: string;
  name: string;
  bg: string;
  topbar: string;
  fg: string;
  user: string;
  host: string;
  char: string;
  success: string;
  error: string;
  command: string;
  muted: string;
};

export const THEMES: Record<string, TerminalTheme> = {
  tokyo_night: {
    id: "tokyo_night",
    name: "Tokyo Night",
    bg: "#1a1b26",
    topbar: "#16161e",
    fg: "#c0caf5",
    user: "#7aa2f7",
    host: "#bb9af7",
    char: "#9ece6a",
    success: "#9ece6a",
    error: "#f7768e",
    command: "#e0af68",
    muted: "#565f89",
  },
  gruvbox: {
    id: "gruvbox",
    name: "Gruvbox",
    bg: "#282828",
    topbar: "#1d2021",
    fg: "#ebdbb2",
    user: "#83a598",
    host: "#d3869b",
    char: "#b8bb26",
    success: "#b8bb26",
    error: "#fb4934",
    command: "#fabd2f",
    muted: "#928374",
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin",
    bg: "#1e1e2e",
    topbar: "#11111b",
    fg: "#cdd6f4",
    user: "#89b4fa",
    host: "#cba6f7",
    char: "#a6e3a1",
    success: "#a6e3a1",
    error: "#f38ba8",
    command: "#f9e2af",
    muted: "#6c7086",
  },
  matrix: {
    id: "matrix",
    name: "Matrix",
    bg: "#0a0a0a",
    topbar: "#050505",
    fg: "#33ff33",
    user: "#00ff00",
    host: "#00cc00",
    char: "#00ff00",
    success: "#00ff00",
    error: "#ff3333",
    command: "#66ff66",
    muted: "#1a6b1a",
  },
};

export type VimMode = 'normal' | 'insert' | 'command';

export interface VimState {
  active: boolean;
  mode: VimMode;
  content: string[];
  cursor: { row: number; col: number };
  cmdLine: string;
  modified: boolean;
  filename: string;
  showLineNumbers: boolean;
  cmdMessage: string;
  cmdMessageType: 'normal' | 'error';
  helpActive: boolean;
  helpPreviousContent: string[];
}

export const INITIAL_VIM_STATE: VimState = {
  active: false,
  mode: 'normal',
  content: [''],
  cursor: { row: 0, col: 0 },
  cmdLine: '',
  modified: false,
  filename: 'portfolio.txt',
  showLineNumbers: false,
  cmdMessage: '',
  cmdMessageType: 'normal',
  helpActive: false,
  helpPreviousContent: [],
};

export type TerminalState = {
  history: OutputLine[];
  commandHistory: string[];
  historyIndex: number;
  theme: TerminalTheme;
  isMatrixActive: boolean;
  isFullscreen: boolean;
  vim: VimState;
  playingTrack: { id: string; name: string; artist: string; start?: number } | null;
};

export const AVAILABLE_COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cd",
  "cat",
  "theme",
  "crt",
  "fastfetch",
  "cmatrix",
  "vim",
  "vi",
  "nvim",
  "screensaver",
  "fullscreen",
  "light_mode",
  "music",
  "sudo",
  "clear",
  "exit",
];

const VIM_HELP_CONTENT = [
  'VIM HELP — portfolio edition',
  '══════════════════════════════════════════',
  '',
  'MOVEMENT',
  '  h j k l       ←↓↑→',
  '  gg / G         first / last line',
  '  0 / $          start / end of line',
  '',
  'EDITING',
  '  i  insert mode    o  new line below',
  '  dd delete line    u  undo',
  '',
  'SAVING',
  '  :w    write (save)',
  '  :wq   write and quit',
  '  :q!   quit without saving (you monster)',
  '',
  'EASTER EGG',
  '  you found vim inside a portfolio terminal.',
  '  that\'s either impressive or concerning.',
  '══════════════════════════════════════════',
  '',
  'press any key to continue',
];

const PAGES = ["projects", "writing", "gallery", "about", "contact"];

const CDXV_ASCII_BOX = String.raw`  /$$$$$$  /$$$$$$$  /$$   /$$ /$$    /$$
 /$$__  $$| $$__  $$| $$  / $$| $$   | $$
| $$  \__/| $$  \ $$|  $$/ $$/| $$   | $$
| $$      | $$  | $$ \  $$$$/ |  $$ / $$/
| $$      | $$  | $$  >$$  $$  \  $$ $$/ 
| $$    $$| $$  | $$ /$$/\  $$  \  $$$/  
|  $$$$$$/| $$$$$$$/| $$  \ $$   \  $/   
 \______/ |_______/ |__/  |__/    \_/    `;

const CDXV_ASCII_BLOCK = `██████  ██████  ██  ██  ██  ██
██       ██  ██   ████   ██  ██
██       ██  ██    ██     ████
██       ██  ██   ████     ██
██████  ██████  ██  ██    ██`;

export interface CRTFunctions {
  active: boolean;
  toggle: () => void;
  setOptions: (opts: Partial<CRTOptions>) => void;
  getOptions: () => CRTOptions | null;
  setShowSettings: (show: boolean) => void;
}

export function useTerminal(config: PersonalConfig, closeTerminal: () => void, crt?: CRTFunctions) {
  const router = useRouter();
  const [state, setState] = useState<TerminalState>({
    history: [
      { id: "init-msg", content: "Type 'help' to see a list of available commands.", type: "muted" }
    ],
    commandHistory: [],
    historyIndex: -1,
    theme: THEMES.tokyo_night,
    isMatrixActive: false,
    isFullscreen: false,
    vim: { ...INITIAL_VIM_STATE },
    playingTrack: null,
  });

  const undoStackRef = useRef<string[][]>([]);
  const pendingGRef = useRef(false);
  const cmdMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const print = (content: string | ReactNode, type: OutputLine["type"] = "output") => {
    setState((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        { id: Math.random().toString(36).substring(7), content, type },
      ],
    }));
  };

  const clear = () => {
    setState((prev) => ({ ...prev, history: [] }));
  };

  const exitMatrix = useCallback(() => {
    setState(prev => ({ ...prev, isMatrixActive: false }));
  }, []);

  const handleRmRf = async () => {
    const loadingId = Math.random().toString(36).substring(7);
    setState(prev => ({
      ...prev,
      history: [...prev.history, { id: loadingId, content: `[sudo] password for cdxv: `, type: "muted" }]
    }));

    await sleep(200);
    setState(prev => ({ ...prev, history: prev.history.map(h => h.id === loadingId ? { ...h, content: `[sudo] password for cdxv: .` } : h) }));
    await sleep(200);
    setState(prev => ({ ...prev, history: prev.history.map(h => h.id === loadingId ? { ...h, content: `[sudo] password for cdxv: ..` } : h) }));
    await sleep(200);
    setState(prev => ({ ...prev, history: prev.history.map(h => h.id === loadingId ? { ...h, content: `[sudo] password for cdxv: ...` } : h) }));
    await sleep(200);

    print(`checking permissions...`, "muted");
    document.body.style.transition = 'background-color 0.2s ease';
    document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.08)';
    setTimeout(() => { document.body.style.backgroundColor = ''; }, 400);

    print(`WARNING: You are about to delete the entire filesystem.`, "error");
    print(`This action is irreversible.`, "error");
    await sleep(600);

    startDestruction();

    const basePaths = [
      "/bin/", "/usr/lib/", "/etc/", "/var/log/", "/usr/share/", 
      "/boot/", "/lib/", "/home/cdxv/", "/opt/", "/root/", "/dev/", "/sys/", "/proc/"
    ];
    const extensions = [".so", ".conf", ".log", ".tmp", "", ".txt", ".json", ".xml", ".pid", ".sh"];
    
    const generatedTargets = Array.from({ length: 60 }).map(() => {
      const path = basePaths[Math.floor(Math.random() * basePaths.length)];
      const filename = Math.random().toString(36).substring(2, 8) + extensions[Math.floor(Math.random() * extensions.length)];
      return `removing ${path}${filename}... done`;
    });

    const deletionTargets = [
      "removing /bin/bash... done",
      "removing /usr/lib/python3... done",
      "removing /etc/hosts... done",
      "removing /home/cdxv/.config... done",
      "removing /var/log/system.log... done",
      "removing /usr/share/fonts... done",
      "removing /etc/passwd... done",
      "removing /boot/vmlinuz... done",
      "removing /lib/systemd... done",
      "removing /home/cdxv/projects... done",
      "removing /usr/bin/fish... done",
      "removing /etc/fstab... done",
      "removing /home/cdxv/.ssh/id_rsa... done",
      "removing /usr/lib/node_modules... done",
      "removing /home/cdxv/portfolio... done",
      ...generatedTargets
    ];

    // Pick ~40 to 60 total lines and scramble them
    const shuffled = [...deletionTargets].sort(() => Math.random() - 0.5).slice(0, 40 + Math.floor(Math.random() * 20));
    
    for (let i = 0; i < shuffled.length; i++) {
      // Chaotic logging simulation: large chunks vs small chunks
      const delay = (i % 8 === 0) ? 150 + Math.random() * 250 : 15 + Math.random() * 50;
      await sleep(delay);
      print(shuffled[i], "error");
    }

    // Dramatic pause after ripping apart the OS but failing on the root structure
    await sleep(900);

    print(`rm: cannot remove '/': Permission denied\n[Process exited with code 1]`, "success");
    print(`Nice try. 😈`, "success");

    // Sit in the wreckage
    await sleep(3500);
    restoreAll();
  };

  const handleWeather = async () => {
    print(`% Total    % Received    Transferring...`, "muted");
    print(`curl wttr.in/meknes`, "muted");

    try {
      const res = await fetch('/api/weather');
      const text = await res.text();

      if (!res.ok) {
         print(text, "error");
         return;
      }
      
      const lines = text.split('\n');
      lines.forEach(line => print(line, "ascii"));

    } catch {
      print(`curl: (6) Could not resolve host: wttr.in\nTry again later.`, "error");
    }
  };

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add to command history
    setState((prev) => {
      const newCommandHistory = [...prev.commandHistory, trimmedInput];
      return {
        ...prev,
        commandHistory: newCommandHistory,
        historyIndex: newCommandHistory.length,
      };
    });

    // Echo command
    print(`cdxv@portfolio ~ $ ${trimmedInput}`, "command");

    const parts = trimmedInput.split(" ").filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "music": {
        const sub = args[0]?.toLowerCase();
        const songs = {
          "1": { id: "uUCS0Ful438", name: "Tied & True", artist: "Ween" },
          "2": { id: "J46DowUIJBs", name: "Advent", artist: "Opeth", start: 15 },
          "3": { id: "VTJcLE_VVX8", name: "They Might As Well Be Dead", artist: "Chris Christodoulou" },
          "4": { id: "AcoRc2ieFzE", name: "Samurai", artist: "Lupe Fiasco" },
          "5": { id: "4qCOSgeJ-_I", name: "One Day", artist: "Gary Moore" }
        };

        if (!sub) {
          print(`  Select a track by typing 'music <number>':`, "success");
          print(`  1 - spongebob type beat`);
          print(`  2 - death metah`);
          print(`  3 - and his music was electric`);
          print(`  4 - welcome to da samurai`);
          print(`  5 - da bluuuues`);
          print(`  off - Turn off music`);
        } else if (sub === "off" || sub === "stop") {
          setState((prev) => ({ ...prev, playingTrack: null }));
          print(`music off.`, "success");
        } else if (songs[sub as keyof typeof songs]) {
          const track = songs[sub as keyof typeof songs];
          setState((prev) => ({ ...prev, playingTrack: track }));
          print(`Playing: ${track.name} by ${track.artist}`, "success");
        } else {
          print(`music: unknown track '${sub}'`, "error");
        }
        break;
      }

      case "sudo":
        if (args.join(" ") === "rm -rf /" || args.join(" ") === "rm -rf /*") {
          handleRmRf();
        } else {
          print(`executing with elevated privileges...`, "muted");
          setTimeout(() => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
          }, 800);
        }
        break;

      case "wttr":
      case "weather":
        handleWeather();
        break;

      case "curl":
        if (args.join(" ").toLowerCase() === "wttr.in/meknes") {
          handleWeather();
        } else {
          print(`curl: try 'curl wttr.in/meknes'`, "error");
        }
        break;

      case "help":
        print(`  COMMAND          DESCRIPTION`);
        print(`  ───────────────────────────────────────────────`);
        print(`  help             Show this help message`);
        print(`  whoami           About ${config.name}`);
        print(`  ls               List available pages`);
        print(`  cd <page>        Navigate to a page`);
        print(`  cat <file>       Read a data file`);
        print(`  theme <name>     Change syntax theme`);
        print(`  crt              Toggle CRT shader overlay`);
        print(`  fastfetch        System info + ASCII art`);
        print(`  cmatrix          Digital rain effect`);
        print(`  music            Play background audio`);
        print(`  clear            Clear terminal output`);
        print(`  exit             Close the terminal`);
        break;

      case "whoami":
        print(`  ${config.name}`);
        print(`  ${config.short_description || "Software Engineer"}`);
        print(`  ─────────────────────────────────────`);
        print(`  ${config.tagline || ""}`);
        print(`  GitHub   : github.com/${config.socials.github.split('/').pop()}`);
        print(`  Email    : ${config.socials.email}`);
        print(`  Location : Meknès, Morocco`);
        break;

      case "ls": {
        const dirs = `  projects/    writing/    gallery/    about/    contact/`;
        print(dirs, "success");
        const dynamicFiles = config.files ? Object.keys(config.files) : [];
        const filesStr = dynamicFiles.join("    ");
        if (filesStr) print(`  ${filesStr}`, "command");
        break;
      }

      case "cd":
        if (args.length === 0) {
          print(`fish: cd: missing argument`, "error");
        } else {
          const page = args[0].toLowerCase();
          
          if (page === 'cdxv') {
            const handleSecret = async () => {
              print('you found it.', 'success');
              await sleep(800);
              print('entering the simulation...', 'muted');
              await sleep(1000);
              router.push('/cdxv');
            };
            handleSecret();
            return; // Important: Do NOT close terminal
          }

          if (PAGES.includes(page)) {
            print(`Navigating to /${page}...`, "muted");
            setTimeout(() => {
              router.push(`/${page}`);
              closeTerminal();
            }, 400);
          } else if (page === "home") {
            print(`Navigating to /...`, "muted");
            setTimeout(() => {
              router.push(`/`);
              closeTerminal();
            }, 400);
          } else {
            print(`fish: cd: Unknown directory: '${page}'`, "error");
            print(`Type 'ls' to see available pages.`, "muted");
          }
        }
        break;

      case "cat":
        if (args.length === 0) {
          print(`fish: cat: missing argument`, "error");
        } else {
          const file = args[0].toLowerCase();
          if (config.files && config.files[file]) {
            config.files[file].forEach((line) => {
              // replace yaml's spaces/bullet with clean indentation
              print(line);
            });
          } else {
            print(`fish: cat: No such file: '${file}'`, "error");
            const dynamicFiles = config.files ? Object.keys(config.files) : [];
            const allStr = dynamicFiles.join("  ");
            print(`Available: ${allStr}`, "muted");
          }
        }
        break;

      case "theme":
        if (args.length === 0) {
          print(`Current theme: ${state.theme.name}`, "success");
          print(`Available themes: tokyo_night  gruvbox  catppuccin  matrix`);
          print(`Usage: theme <name>`, "muted");
        } else {
          const t = args[0].toLowerCase();
          if (THEMES[t]) {
            setState(prev => ({ ...prev, theme: THEMES[t] }));
            print(`Theme changed to ${THEMES[t].name}.`, "success");
          } else {
            print(`fish: theme: Unknown theme '${t}'`, "error");
            print(`Available themes: tokyo_night  gruvbox  catppuccin  matrix`, "muted");
          }
        }
        break;

      case "fastfetch":
        print(
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", marginTop: "8px", flexWrap: "wrap" }}>
            <div style={{ color: state.theme.success, whiteSpace: "pre", lineHeight: 1 }}>{CDXV_ASCII_BOX}</div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: "280px" }}>
              <div style={{ color: state.theme.success }}>cdxv@portfolio</div>
              <div style={{ color: state.theme.muted }}>──────────────────────────────────</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>OS</span>CachyOS (Arch-based)</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>HOST</span>Acer Nitro</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>GPU</span>NVIDIA RTX 3050 Ti Laptop</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>SHELL</span>fish 3.7</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>TERM</span>kitty</div>
              <div style={{ color: state.theme.fg }}><span style={{ color: state.theme.muted, display: "inline-block", width: "70px" }}>EDITOR</span>neovim</div>
            </div>
          </div>,
          "raw"
        );
        break;

      case "crt": {
        if (!crt) {
          print(`CRT shader not available.`, "error");
          break;
        }
        const sub = args[0]?.toLowerCase();

        if (!sub || sub === "on") {
          if (crt.active) {
            print(`CRT mode is already active.`, "muted");
            print(`Type 'crt off' to disable.`, "muted");
          } else {
            print(`enabling CRT mode...`, "success");
            print(`serenity shader v1.0 — CSS overlay`, "muted");
            print(`scanlines: 256    vignette: 0.25`, "muted");
            print(`phosphor glow: active`, "success");
            print(`type 'crt off' to disable`, "muted");
            print(`type 'crt tune' to adjust settings`, "muted");
            crt.toggle();
          }
        } else if (sub === "off") {
          if (!crt.active) {
            print(`CRT mode is not active.`, "muted");
          } else {
            print(`disabling CRT mode...`, "muted");
            print(`returning to flatscreen reality.`, "success");
            crt.toggle();
          }
        } else if (sub === "status") {
          const opts = crt.getOptions();
          if (!crt.active || !opts) {
            print(`CRT MODE     inactive`, "muted");
          } else {
            print(`CRT MODE     active`, "success");
            print(`─────────────────────────────`, "muted");
            print(`scanlines          ${opts.scanlineCount}`);
            print(`scanline intensity ${opts.scanlineIntensity}`);
            print(`vignette           ${opts.vignetteIntensity}`);
            print(`brightness         ${opts.brightness}`);
            print(`flicker            ${opts.flickerIntensity}`);
            print(`green tint         ${opts.greenTint}`);
            print(`─────────────────────────────`, "muted");
            print(`renderer     CSS overlay (GPU composited)`, "muted");
          }
        } else if (sub === "settings") {
          print(`opening CRT control panel...`, "success");
          crt.setShowSettings(true);
        } else if (sub === "tune") {
          const param = args[1]?.toLowerCase();
          const value = parseFloat(args[2]);

          if (!param || isNaN(value)) {
            print(`usage: crt tune <param> <value>`, "muted");
            print(`params: scanlines  vignette  flicker  brightness  greentint`, "muted");
            break;
          }

          const paramMap: Record<string, keyof CRTOptions> = {
            scanlines: "scanlineCount",
            vignette: "vignetteIntensity",
            flicker: "flickerIntensity",
            brightness: "brightness",
            greentint: "greenTint",
          };

          const key = paramMap[param];
          if (!key) {
            print(`unknown param: '${param}'`, "error");
            print(`params: scanlines  vignette  flicker  brightness  greentint`, "muted");
          } else {
            crt.setOptions({ [key]: value });
            print(`${param} → ${value}`, "success");
            print(`shader updated.`, "muted");
          }
        } else {
          print(`usage: crt [on|off|settings|tune <param> <value>|status]`, "error");
        }
        break;
      }

      case "vim":
      case "vi":
      case "nvim": {
        const targetFile = args[0]?.toLowerCase() || 'portfolio.txt';
        
        let initialContent = [''];
        if (config.files && config.files[targetFile]) {
          initialContent = [...config.files[targetFile]];
        }
        
        const handleVimOpen = async () => {
          print('VIM — Vi IMproved 9.1', 'muted');
          await sleep(50);
          print('by Bram Moolenaar et al.', 'muted');
          await sleep(50);
          print('Modified by Arch Linux', 'muted');
          await sleep(50);
          print('Vim is open source and freely distributable', 'muted');
          await sleep(50);
          print('', 'muted');
          await sleep(50);
          print('type :q<Enter> to exit    type :help<Enter> for help', 'muted');
          await sleep(50);
          print('', 'muted');
          await sleep(50);
          print(`loading ${targetFile}...`, 'muted');
          await sleep(400);
          undoStackRef.current = [];
          pendingGRef.current = false;
          setState(prev => ({
            ...prev,
            vim: {
              ...INITIAL_VIM_STATE,
              filename: targetFile,
              content: initialContent,
              active: true,
            },
          }));
        };
        handleVimOpen();
        return;
      }

      case "screensaver": {
        const sub = args[0]?.toLowerCase();
        if (sub === "off") {
          window.dispatchEvent(new Event('screensaver-off'));
          print(`screensaver disabled for this session.`, "muted");
        } else if (sub === "on") {
          window.dispatchEvent(new Event('screensaver-on'));
          print(`screensaver enabled — triggers after 15s idle.`, "success");
        } else {
          print(`initiating screensaver...`, "muted");
          print(`move mouse or press any key to wake`, "muted");
          setTimeout(() => {
            window.dispatchEvent(new Event('force-screensaver'));
          }, 600);
        }
        break;
      }

      case "cmatrix":
        setState(prev => ({ ...prev, isMatrixActive: true }));
        return; // Don't print an extra empty line

      case "fullscreen": {
        const sub = args[0]?.toLowerCase();
        if (sub === "on") {
          setState((prev) => ({ ...prev, isFullscreen: true }));
          print(`terminal fullscreen mode activated.`, "success");
        } else if (sub === "off") {
          setState((prev) => ({ ...prev, isFullscreen: false }));
          print(`terminal fullscreen mode deactivated.`, "success");
        } else {
          setState((prev) => {
            const nextFullscreen = !prev.isFullscreen;
            print(`terminal fullscreen mode ${nextFullscreen ? 'activated' : 'deactivated'}.`, "success");
            return { ...prev, isFullscreen: nextFullscreen };
          });
        }
        break;
      }

      case "light_mode": {
        const sub = args[0]?.toLowerCase();
        if (sub === "off") {
          document.documentElement.classList.remove('light-mode-active');
          print(`light mode deactivated. Safe travels.`, "success");
        } else {
          document.documentElement.classList.add('light-mode-active');
          print(`so, you do like to suffer`, "error");
          try {
            const audio = new Audio('/Fahhh.mp3');
            audio.play().catch(() => {});
          } catch(e) {}
        }
        break;
      }

      case "clear":
        clear();
        return;

      case "exit":
        print(`  Goodbye. Closing terminal...`, "muted");
        setTimeout(() => {
          closeTerminal();
        }, 600);
        break;

      default:
        print(`fish: Unknown command: '${cmd}'. Did you mean one of: help whoami ls cd cat theme fastfetch clear exit?`, "error");
        break;
    }

    print("");
  };

  const getPreviousCommand = () => {
    if (state.commandHistory.length === 0) return "";
    const newIdx = Math.max(0, state.historyIndex - 1);
    setState(prev => ({ ...prev, historyIndex: newIdx }));
    return state.commandHistory[newIdx];
  };

  const getNextCommand = (currentInput: string) => {
    if (state.commandHistory.length === 0) return currentInput;
    const newIdx = Math.min(state.commandHistory.length, state.historyIndex + 1);
    setState(prev => ({ ...prev, historyIndex: newIdx }));
    if (newIdx === state.commandHistory.length) {
      return "";
    }
    return state.commandHistory[newIdx];
  };

  const autocomplete = (input: string) => {
    const parts = input.split(" ");
    if (parts.length === 1) {
      const match = AVAILABLE_COMMANDS.filter(c => c.startsWith(input));
      if (match.length === 1) return match[0] + " ";
      if (match.length > 1) {
         print(`cdxv@portfolio ~ $ ${input}`, "command");
         print(match.join("    "), "success");
      }
    } else if (parts.length === 2) {
      const argPrefix = parts[1].toLowerCase();
      if (parts[0] === "cd") {
        const match = PAGES.filter(p => p.startsWith(argPrefix));
        if (match.length === 1) return `cd ${match[0]} `;
        if (match.length > 1) {
             print(`cdxv@portfolio ~ $ ${input}`, "command");
             print(match.join("    "), "success");
        }
      } else if (["cat", "vim", "vi", "nvim"].includes(parts[0])) {
        const dynamicFiles = config.files ? Object.keys(config.files) : [];
        const match = dynamicFiles.filter(f => f.startsWith(argPrefix));
        
        if (match.length === 1) return `${parts[0]} ${match[0]} `;
        if (match.length > 1) {
             print(`cdxv@portfolio ~ $ ${input}`, "command");
             print(match.join("    "), "success");
        }
      } else if (parts[0] === "theme") {
        const match = Object.keys(THEMES).filter(t => t.startsWith(argPrefix));
        if (match.length === 1) return `theme ${match[0]} `;
         if (match.length > 1) {
             print(`cdxv@portfolio ~ $ ${input}`, "command");
             print(match.join("    "), "success");
        }
      }
    }
    return input;
  };

  // ── Vim key handler ──────────────────────────────────
  const clearCmdMessage = useCallback(() => {
    if (cmdMessageTimerRef.current) clearTimeout(cmdMessageTimerRef.current);
    cmdMessageTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, vim: { ...prev.vim, cmdMessage: '', cmdMessageType: 'normal' } }));
    }, 0);
  }, []);

  const flashCmdMessage = useCallback((msg: string, type: 'normal' | 'error' = 'normal', duration = 1000) => {
    if (cmdMessageTimerRef.current) clearTimeout(cmdMessageTimerRef.current);
    setState(prev => ({ ...prev, vim: { ...prev.vim, cmdMessage: msg, cmdMessageType: type } }));
    cmdMessageTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, vim: { ...prev.vim, cmdMessage: '', cmdMessageType: 'normal' } }));
    }, duration);
  }, []);

  const pushUndo = useCallback((content: string[]) => {
    const stack = undoStackRef.current;
    stack.push(content.map(l => l));
    if (stack.length > 50) stack.shift();
  }, []);

  const exitVim = useCallback((message: string, type: OutputLine['type'] = 'muted') => {
    setState(prev => ({
      ...prev,
      vim: { ...INITIAL_VIM_STATE },
    }));
    // Need to print after state update
    setTimeout(() => {
      print(message, type);
      print('');
    }, 0);
  }, []);

  const handleVimKey = useCallback((e: KeyboardEvent) => {
    const vim = state.vim;
    if (!vim.active) return;
    e.preventDefault();
    e.stopPropagation();

    const key = e.key;

    // Help mode — any key dismisses
    if (vim.helpActive) {
      setState(prev => ({
        ...prev,
        vim: {
          ...prev.vim,
          helpActive: false,
          content: prev.vim.helpPreviousContent,
          helpPreviousContent: [],
        },
      }));
      return;
    }

    // ── COMMAND MODE ──
    if (vim.mode === 'command') {
      if (key === 'Escape') {
        setState(prev => ({ ...prev, vim: { ...prev.vim, mode: 'normal', cmdLine: '' } }));
        return;
      }
      if (key === 'Backspace') {
        if (vim.cmdLine.length === 0) {
          setState(prev => ({ ...prev, vim: { ...prev.vim, mode: 'normal' } }));
        } else {
          setState(prev => ({ ...prev, vim: { ...prev.vim, cmdLine: prev.vim.cmdLine.slice(0, -1) } }));
        }
        return;
      }
      if (key === 'Enter') {
        const command = vim.cmdLine.trim();
        setState(prev => ({ ...prev, vim: { ...prev.vim, mode: 'normal', cmdLine: '' } }));

        if (command === 'q') {
          if (vim.modified) {
            flashCmdMessage('E37: No write since last change (add ! to override)', 'error', 2500);
          } else {
            exitVim('vim: farewell.', 'muted');
          }
        } else if (command === 'q!') {
          exitVim('you monster.', 'error');
        } else if (command === 'wq' || command === 'wq!' || command === 'x') {
          const lines = vim.content.length;
          const chars = vim.content.join('\n').length;
          exitVim(`"portfolio.txt" written — ${lines} lines, ${chars} characters`, 'success');
        } else if (command === 'w') {
          const lines = vim.content.length;
          const chars = vim.content.join('\n').length;
          flashCmdMessage(`"portfolio.txt" ${lines} lines, ${chars} characters written`, 'normal', 1500);
          setState(prev => ({ ...prev, vim: { ...prev.vim, modified: false } }));
        } else if (command === 'set nu') {
          setState(prev => ({ ...prev, vim: { ...prev.vim, showLineNumbers: true } }));
        } else if (command === 'set nonu') {
          setState(prev => ({ ...prev, vim: { ...prev.vim, showLineNumbers: false } }));
        } else if (command === 'help') {
          setState(prev => ({
            ...prev,
            vim: {
              ...prev.vim,
              helpActive: true,
              helpPreviousContent: prev.vim.content.map(l => l),
              content: VIM_HELP_CONTENT,
              cursor: { row: 0, col: 0 },
            },
          }));
        } else {
          flashCmdMessage(`E492: Not an editor command: ${command}`, 'error', 2000);
        }
        return;
      }
      // Accumulate typed characters
      if (key.length === 1) {
        setState(prev => ({ ...prev, vim: { ...prev.vim, cmdLine: prev.vim.cmdLine + key } }));
      }
      return;
    }

    // ── INSERT MODE ──
    if (vim.mode === 'insert') {
      if (key === 'Escape') {
        // Clamp cursor col when leaving insert mode
        setState(prev => {
          const line = prev.vim.content[prev.vim.cursor.row] || '';
          const maxCol = Math.max(0, line.length - 1);
          return {
            ...prev,
            vim: {
              ...prev.vim,
              mode: 'normal',
              cursor: { ...prev.vim.cursor, col: Math.min(prev.vim.cursor.col, maxCol) },
            },
          };
        });
        flashCmdMessage('-- NORMAL MODE --', 'normal', 800);
        return;
      }
      if (key === 'Backspace') {
        setState(prev => {
          const v = prev.vim;
          const newContent = v.content.map(l => l);
          const { row, col } = v.cursor;
          if (col > 0) {
            pushUndo(v.content);
            newContent[row] = newContent[row].slice(0, col - 1) + newContent[row].slice(col);
            return { ...prev, vim: { ...v, content: newContent, cursor: { row, col: col - 1 }, modified: true } };
          } else if (row > 0) {
            pushUndo(v.content);
            const prevLineLen = newContent[row - 1].length;
            newContent[row - 1] += newContent[row];
            newContent.splice(row, 1);
            return { ...prev, vim: { ...v, content: newContent, cursor: { row: row - 1, col: prevLineLen }, modified: true } };
          }
          return prev;
        });
        return;
      }
      if (key === 'Enter') {
        setState(prev => {
          const v = prev.vim;
          pushUndo(v.content);
          const newContent = v.content.map(l => l);
          const { row, col } = v.cursor;
          const line = newContent[row];
          const before = line.slice(0, col);
          const after = line.slice(col);
          newContent[row] = before;
          newContent.splice(row + 1, 0, after);
          return { ...prev, vim: { ...v, content: newContent, cursor: { row: row + 1, col: 0 }, modified: true } };
        });
        return;
      }
      if (key === 'Tab') {
        setState(prev => {
          const v = prev.vim;
          pushUndo(v.content);
          const newContent = v.content.map(l => l);
          const { row, col } = v.cursor;
          newContent[row] = newContent[row].slice(0, col) + '  ' + newContent[row].slice(col);
          return { ...prev, vim: { ...v, content: newContent, cursor: { row, col: col + 2 }, modified: true } };
        });
        return;
      }
      if (key === 'ArrowLeft') {
        setState(prev => {
          const col = Math.max(0, prev.vim.cursor.col - 1);
          return { ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col } } };
        });
        return;
      }
      if (key === 'ArrowRight') {
        setState(prev => {
          const line = prev.vim.content[prev.vim.cursor.row] || '';
          const col = Math.min(line.length, prev.vim.cursor.col + 1);
          return { ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col } } };
        });
        return;
      }
      if (key === 'ArrowUp') {
        setState(prev => {
          const row = Math.max(0, prev.vim.cursor.row - 1);
          const line = prev.vim.content[row] || '';
          const col = Math.min(prev.vim.cursor.col, line.length);
          return { ...prev, vim: { ...prev.vim, cursor: { row, col } } };
        });
        return;
      }
      if (key === 'ArrowDown') {
        setState(prev => {
          const row = Math.min(prev.vim.content.length - 1, prev.vim.cursor.row + 1);
          const line = prev.vim.content[row] || '';
          const col = Math.min(prev.vim.cursor.col, line.length);
          return { ...prev, vim: { ...prev.vim, cursor: { row, col } } };
        });
        return;
      }
      // Insert printable character
      if (key.length === 1) {
        setState(prev => {
          const v = prev.vim;
          pushUndo(v.content);
          const newContent = v.content.map(l => l);
          const { row, col } = v.cursor;
          newContent[row] = newContent[row].slice(0, col) + key + newContent[row].slice(col);
          return { ...prev, vim: { ...v, content: newContent, cursor: { row, col: col + 1 }, modified: true } };
        });
      }
      return;
    }

    // ── NORMAL MODE ──
    if (key === 'Escape') {
      flashCmdMessage('-- NORMAL MODE --', 'normal', 800);
      pendingGRef.current = false;
      return;
    }
    if (key === ':') {
      setState(prev => ({ ...prev, vim: { ...prev.vim, mode: 'command', cmdLine: '' } }));
      pendingGRef.current = false;
      return;
    }
    if (key === 'i') {
      setState(prev => ({ ...prev, vim: { ...prev.vim, mode: 'insert' } }));
      pendingGRef.current = false;
      return;
    }
    if (key === 'a') {
      setState(prev => {
        const line = prev.vim.content[prev.vim.cursor.row] || '';
        const col = Math.min(prev.vim.cursor.col + 1, line.length);
        return { ...prev, vim: { ...prev.vim, mode: 'insert', cursor: { ...prev.vim.cursor, col } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'o') {
      setState(prev => {
        const v = prev.vim;
        pushUndo(v.content);
        const newContent = v.content.map(l => l);
        newContent.splice(v.cursor.row + 1, 0, '');
        return { ...prev, vim: { ...v, mode: 'insert', content: newContent, cursor: { row: v.cursor.row + 1, col: 0 }, modified: true } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'O') {
      setState(prev => {
        const v = prev.vim;
        pushUndo(v.content);
        const newContent = v.content.map(l => l);
        newContent.splice(v.cursor.row, 0, '');
        return { ...prev, vim: { ...v, mode: 'insert', content: newContent, cursor: { row: v.cursor.row, col: 0 }, modified: true } };
      });
      pendingGRef.current = false;
      return;
    }
    // Movement
    if (key === 'h') {
      setState(prev => {
        const col = Math.max(0, prev.vim.cursor.col - 1);
        return { ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'l') {
      setState(prev => {
        const line = prev.vim.content[prev.vim.cursor.row] || '';
        const col = Math.min(Math.max(0, line.length - 1), prev.vim.cursor.col + 1);
        return { ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'j') {
      setState(prev => {
        const row = Math.min(prev.vim.content.length - 1, prev.vim.cursor.row + 1);
        const line = prev.vim.content[row] || '';
        const col = Math.min(prev.vim.cursor.col, Math.max(0, line.length - 1));
        return { ...prev, vim: { ...prev.vim, cursor: { row, col } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'k') {
      setState(prev => {
        const row = Math.max(0, prev.vim.cursor.row - 1);
        const line = prev.vim.content[row] || '';
        const col = Math.min(prev.vim.cursor.col, Math.max(0, line.length - 1));
        return { ...prev, vim: { ...prev.vim, cursor: { row, col } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === '0') {
      setState(prev => ({ ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col: 0 } } }));
      pendingGRef.current = false;
      return;
    }
    if (key === '$') {
      setState(prev => {
        const line = prev.vim.content[prev.vim.cursor.row] || '';
        return { ...prev, vim: { ...prev.vim, cursor: { ...prev.vim.cursor, col: Math.max(0, line.length - 1) } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'g') {
      if (pendingGRef.current) {
        // gg — go to first line
        setState(prev => ({ ...prev, vim: { ...prev.vim, cursor: { row: 0, col: 0 } } }));
        pendingGRef.current = false;
      } else {
        pendingGRef.current = true;
      }
      return;
    }
    if (key === 'G') {
      setState(prev => {
        const lastRow = prev.vim.content.length - 1;
        const line = prev.vim.content[lastRow] || '';
        return { ...prev, vim: { ...prev.vim, cursor: { row: lastRow, col: Math.max(0, line.length - 1) } } };
      });
      pendingGRef.current = false;
      return;
    }
    if (key === 'd') {
      if (pendingGRef.current) {
        // Not dd — clear pending
        pendingGRef.current = false;
      }
      // dd logic: we need two d presses. Use pendingGRef as a dual-purpose flag? No, use a separate approach.
      // Actually let's just track with a simple ref check
      return;
    }
    if (key === 'u') {
      const stack = undoStackRef.current;
      if (stack.length === 0) {
        flashCmdMessage('Already at oldest change', 'normal', 1000);
      } else {
        const prev = stack.pop()!;
        setState(s => ({
          ...s,
          vim: {
            ...s.vim,
            content: prev,
            cursor: { row: Math.min(s.vim.cursor.row, prev.length - 1), col: 0 },
          },
        }));
        flashCmdMessage(`1 change; before #${stack.length + 1}`, 'normal', 1000);
      }
      pendingGRef.current = false;
      return;
    }

    pendingGRef.current = false;
    // Unknown key - flash error for letter keys
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      flashCmdMessage(`  E: unknown command`, 'error', 1000);
    }
  }, [state.vim, flashCmdMessage, pushUndo, exitVim]);

  // ── dd handler: needs its own ref because we need two consecutive 'd' presses
  const pendingDRef = useRef(false);
  const handleVimKeyWrapped = useCallback((e: KeyboardEvent) => {
    const vim = state.vim;
    if (!vim.active) return;
    if (vim.mode === 'normal' && !vim.helpActive && e.key === 'd') {
      e.preventDefault();
      e.stopPropagation();
      if (pendingDRef.current) {
        // dd — delete line
        pendingDRef.current = false;
        pushUndo(vim.content);
        setState(prev => {
          const v = prev.vim;
          const newContent = v.content.map(l => l);
          if (newContent.length === 1) {
            newContent[0] = '';
          } else {
            newContent.splice(v.cursor.row, 1);
          }
          const newRow = Math.min(v.cursor.row, newContent.length - 1);
          const line = newContent[newRow] || '';
          return { ...prev, vim: { ...v, content: newContent, cursor: { row: newRow, col: Math.min(v.cursor.col, Math.max(0, line.length - 1)) }, modified: true } };
        });
      } else {
        pendingDRef.current = true;
        // Reset after 1s
        setTimeout(() => { pendingDRef.current = false; }, 1000);
      }
      return;
    }
    pendingDRef.current = false;
    handleVimKey(e);
  }, [state.vim, handleVimKey, pushUndo]);

  return {
    history: state.history,
    theme: state.theme,
    isMatrixActive: state.isMatrixActive,
    isFullscreen: state.isFullscreen,
    vim: state.vim,
    playingTrack: state.playingTrack,
    handleVimKey: handleVimKeyWrapped,
    executeCommand,
    getPreviousCommand,
    getNextCommand,
    autocomplete,
    exitMatrix,
  };
}
