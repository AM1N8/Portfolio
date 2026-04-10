// filepath: portfolio/app/about/page.tsx

import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { resume } from "@/data/resume";
import {
  ExperienceTimeline,
  EducationList,
  SkillsGrid,
} from "@/components/ResumeSection";
import MusicWidget from "@/components/MusicWidget";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "About",
    description:
      "AI Engineering Student transforming innovative ideas into intelligent solutions through AI and data.",
  });
}

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
      }}
    >
      {/* Page Title */}
      <section
        style={{ paddingTop: "4rem", paddingBottom: "2rem" }}
        className="animate-fade-in"
      >
        <h1 className="page-title" style={{ marginBottom: "1rem" }}>
          <span className="slash">/</span> About
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 mb-16">
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "640px",
                marginBottom: "1rem"
              }}
            >
              I am a passionate AI Engineering student currently in the engineering cycle at ENSAM Meknès, specializing in Machine Learning, Deep Learning, and Computer Vision.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "640px",
              }}
            >
              Backed by a strong academic foundation, I have proven experience building intelligent systems, reinforcement learning algorithms, and predictive modeling solutions. My goal is to transform innovative ideas into real-world applications through data and algorithms.
            </p>
          </div>
          <MusicWidget />
        </div>
      </section>

      {/* Experience */}
      <section
        style={{ paddingBottom: "3rem" }}
        className="animate-fade-in-delay-1"
      >
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ color: "var(--color-green)" }}>/</span> Experience
        </h2>
        <ExperienceTimeline experiences={resume.experiences} />
      </section>

      <hr className="card-divider" />

      {/* Skills */}
      <section
        style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
        className="animate-fade-in-delay-2"
      >
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ color: "var(--color-green)" }}>/</span> Skills
        </h2>
        <SkillsGrid skills={resume.skills} />
      </section>

      <hr className="card-divider" />

      {/* Education */}
      <section
        style={{ paddingTop: "3rem", paddingBottom: "4rem" }}
        className="animate-fade-in-delay-3"
      >
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ color: "var(--color-green)" }}>/</span> Education
        </h2>
        <EducationList education={resume.education} />
      </section>
    </div>
  );
}
