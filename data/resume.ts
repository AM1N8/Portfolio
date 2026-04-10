// filepath: portfolio/data/resume.ts

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  detail?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ResumeData {
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

export const resume: ResumeData = {
  experiences: [
    {
      company: "YAZAKI Meknès",
      role: "IT Department Intern",
      startDate: "Jun 2025",
      endDate: "Aug 2025",
      bullets: [
        "Participated in the management and maintenance of industrial information systems within a large-scale IT department.",
        "Contributed to the analysis and optimization of business processes using tools adapted to industrial constraints.",
        "Involved in IT security missions including access management and network surveillance.",
      ],
    },
    {
      company: "Club Info Gadz'it — ENSAM Meknès",
      role: "Active Member",
      startDate: "2022",
      endDate: "Present",
      bullets: [
        "AI Research Cell: participation in AI research projects and technical workshops.",
        "Competitive Programming: participation in algorithmic problem-solving competitions.",
        "Collaboration on innovative tech projects and peer knowledge-sharing initiatives.",
      ],
    },
  ],
  education: [
    {
      institution: "ENSAM Meknès",
      degree: "Engineering Cycle — Artificial Intelligence & Data Technologies",
      startDate: "2024",
      endDate: "Present",
      detail: "",
    },
    {
      institution: "ENSAM Meknès",
      degree: "Integrated Preparatory Cycle",
      startDate: "2022",
      endDate: "2024",
      detail: "",
    },
    {
      institution: "Lycée Technique Ibn El Haitham",
      degree: "Baccalauréat in Mathematical Sciences, Option B",
      startDate: "2021",
      endDate: "2022",
      detail: "Mention: Bien",
    },
  ],
  skills: [
    {
      category: "Languages",
      items: ["Python", "C++", "Java", "R", "Julia"],
    },
    {
      category: "AI / ML",
      items: ["PyTorch", "TensorFlow", "Scikit-learn"],
    },
    {
      category: "Data Science",
      items: ["Pandas", "NumPy", "Matplotlib"],
    },
    {
      category: "Computer Vision",
      items: ["OpenCV", "Image Processing"],
    },
    {
      category: "Web",
      items: ["JavaScript", "HTML", "CSS", "SQL"],
    },
    {
      category: "Tools",
      items: ["Git", "MATLAB", "Linux", "Bash", "Godot", "Docker", "FastAPI"],
    },
    {
      category: "Interests",
      items: [
        "Game Development & AI",
        "Machine Learning & Deep Learning",
        "Computer Vision Applications",
        "Reinforcement Learning Systems",
      ],
    },
  ],
};
