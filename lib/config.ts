import fs from "fs";
import path from "path";
import yaml from "js-yaml";

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

export interface PersonalConfig {
  name: string;
  nickname: string;
  tagline: string;
  short_description: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    discord: string;
    email: string;
  };
  bio: string[];
  marquee: string[];
  resume: {
    experiences: Experience[];
    education: Education[];
    skills: SkillCategory[];
  };
  files?: Record<string, string[]>;
}

let cachedConfig: PersonalConfig | null = null;

export function getPersonalConfig(): PersonalConfig {
  if (cachedConfig && process.env.NODE_ENV !== "development") return cachedConfig;

  const filePath = path.join(process.cwd(), "data", "personal.yaml");
  const fileContent = fs.readFileSync(filePath, "utf8");
  cachedConfig = yaml.load(fileContent) as PersonalConfig;

  return cachedConfig;
}

// Global instance for convenience
export const config = getPersonalConfig();
