import { config } from "@/lib/config";
import type { Experience, Education, SkillCategory } from "@/lib/config";

export type { Experience, Education, SkillCategory };

export interface ResumeData {
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

export const resume: ResumeData = {
  experiences: config.resume.experiences,
  education: config.resume.education,
  skills: config.resume.skills,
};
