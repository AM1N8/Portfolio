# CDXV Portfolio: Mohamed Amine Darraj

## Overview

Mohamed Amine Darraj (CDXV) is an AI Engineering student specializing in Machine Learning, Deep Learning, and Computer Vision. This project is a professional engineering portfolio built with a focus on interactivity and modern web technologies. It features a fully integrated terminal environment, allowing visitors to interact with the site's content and configuration through a command-line interface.

## Technical Architecture

The portfolio is architected for performance and extensibility using the following stack:

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with a focus on high-fidelity animations and visual effects.
- **Data Management**: Dynamic YAML-driven configuration via `personal.yaml`.
- **Graphics**: WebGL-based CRT shaders for retro-futuristic hardware simulation.

## Core Features

### Integrated Terminal System
A terminal overlay (accessible via `Ctrl + \`` or `~`) provides a simulated Linux environment. This system is responsible for:
- Navigation and page routing.
- Content retrieval from the underlying YAML data layer.
- Execution of interactive utility commands.

### Dynamic Configuration
The application separates data from logic. All portfolio content—including professional experience, bio, and terminal-accessible files—is managed through a centralized `personal.yaml` file, enabling rapid updates without requiring code changes.

### Retro Hardware Simulation
The interface includes a CRT shader system that provides real-time scanline rendering, flicker effects, and color aberrations, simulating the aesthetic of legacy hardware within a modern web context.

## Installation and Deployment

### Prerequisites
- Node.js 18.x or higher
- npm

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AM1N8/portfolio.git
   cd portfolio/site
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the development environment:
   ```bash
   npm run dev
   ```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Terminal Commands Reference

| Command | Description |
| :--- | :--- |
| `help` | Lists all available system commands. |
| `whoami` | Displays professional summary and contact links. |
| `ls` | Lists navigable pages and virtual files. |
| `cat <file>` | Outputs the content of a virtual text file. |
| `vim <file>` | Launches the integrated terminal text editor. |
| `crt` | Toggles and configures the CRT shader overlay. |
| `music` | Controls the background audio jukebox. |
| `light_mode` | Toggles the high-contrast accessibility theme. |
| `sudo` | Executes commands with elevated system privileges. |

## Professional Details

- **GitHub**: [github.com/AM1N8](https://github.com/AM1N8)
- **LinkedIn**: [linkedin.com/in/mohamed-amine-darraj-5015423ab](https://www.linkedin.com/in/mohamed-amine-darraj-5015423ab/)
- **Location**: Meknès, Morocco

