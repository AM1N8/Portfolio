// filepath: portfolio/data/projects.ts

export interface Project {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  role: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    name: "ProAct GMAO",
    slug: "proact-gmao",
    description: "A full CMMS application combining industrial asset management with AI — RAG, Copilot, OCR, and Predictive Maintenance in one platform.",
    longDescription: "ProAct GMAO is a complete Computerized Maintenance Management System built with a modern full-stack architecture. It features a conversational maintenance Copilot for fault diagnosis and corrective action suggestions via LLM (Ollama/Groq), a predictive maintenance engine computing MTBF and RUL, and a RAG system for querying technical manuals in natural language. Deployed with Docker on Next.js 14 / FastAPI / PostgreSQL / FAISS.",
    role: "Solo Developer",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "FAISS", "LLM", "RAG", "Docker", "OCR"],
    github: "https://github.com/AM1N8/GMAO-Project",
    demo: undefined,
    featured: true
  },
  {
    name: "Computer Vision Health System",
    slug: "cv-health-system",
    description: "Deep learning models for automated detection of bone fractures and pulmonary diseases, paired with an NLP-powered medical chatbot.",
    longDescription: "This system applies deep learning to medical imaging for high-accuracy classification of bone fractures and lung diseases. An intelligent medical chatbot built with NLP handles symptom-to-disease mapping, guiding users through diagnostic flows. Model performance was optimized through architecture tuning and transfer learning techniques.",
    role: "Solo Developer",
    tags: ["PyTorch", "TensorFlow", "OpenCV", "NLP", "Deep Learning", "Medical Imaging"],
    github: "https://github.com/AM1N8/Computer-Vision-HealthCare",
    demo: undefined,
    featured: true
  },
  {
    name: "Advanced Trajectory Prediction System",
    slug: "trajectory-prediction",
    description: "A real-time ML pipeline for trajectory prediction and motion forecasting using advanced pattern analysis algorithms.",
    longDescription: "Designed to predict object trajectories in real time, this system implements a full ML pipeline from data ingestion to motion forecasting. Advanced pattern recognition algorithms were applied with a focus on computational efficiency, making the system suitable for real-time environments with tight latency constraints.",
    role: "Solo Developer",
    tags: ["Python", "Machine Learning", "NumPy", "Real-time", "Scikit-learn"],
    github: "https://github.com/AM1N8/TrajectoryPredictionProject",
    demo: undefined,
    featured: false
  },
  {
    name: "Intelligent Game AI",
    slug: "intelligent-game-ai",
    description: "An immersive game built in Godot Engine featuring an adaptive AI opponent powered by Q-learning reinforcement learning.",
    longDescription: "Built entirely in Godot Engine, this project integrates a Q-learning reinforcement learning agent that adapts its behavior based on player actions over time. The gameplay mechanics were designed to keep the AI challenging and dynamic, demonstrating applied reinforcement learning in an interactive entertainment context.",
    role: "Solo Developer",
    tags: ["Godot", "Q-learning", "Reinforcement Learning", "Python", "Game AI"],
    github: "https://github.com/AM1N8", // TODO: replace with exact repo URL
    demo: undefined,
    featured: false
  },
  {
    name: "Competitive Programming Solutions",
    slug: "competitive-programming",
    description: "A curated collection of algorithmic problem solutions from competitive programming contests, written in Python and C++.",
    longDescription: "Developed through active participation in algorithmic competitions as part of Club Info Gadz'it at ENSAM Meknès. This repository covers data structures, graph algorithms, dynamic programming, and optimization problems. It serves as both a personal reference and a knowledge-sharing resource for peers.",
    role: "Contributor — Club Info Gadz'it",
    tags: ["Python", "C++", "Algorithms", "Data Structures", "Competitive Programming"],
    github: "https://github.com/AM1N8", // TODO: replace with exact repo URL
    demo: undefined,
    featured: false
  },
  {
    name: "AI Research Experiments",
    slug: "ai-research-experiments",
    description: "A collection of ML/DL research experiments and prototypes spanning computer vision, NLP, and reinforcement learning.",
    longDescription: "An ongoing personal research sandbox built through the AI Research Cell of Club Info Gadz'it. Includes experiments with model architectures, training techniques, and dataset exploration across computer vision, NLP, and RL domains. Each experiment is documented with findings and reproducible code.",
    role: "Researcher",
    tags: ["PyTorch", "Research", "NLP", "Computer Vision", "Reinforcement Learning"],
    github: "https://github.com/AM1N8", // TODO: replace with exact repo URL
    demo: undefined,
    featured: false
  }
];
