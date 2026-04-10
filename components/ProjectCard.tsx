// filepath: portfolio/components/ProjectCard.tsx
"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "1.5rem 1rem 1.5rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Project Name */}
      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.9375rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--color-white)",
        }}
      >
        {project.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          color: "var(--color-muted)",
        }}
      >
        {project.description}
      </p>

      {/* Role */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {project.role}
      </p>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--color-green)",
              border: "1px solid rgba(0,255,0,0.25)",
              padding: "0.15rem 0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bracket Links */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "auto",
        }}
      >
        {project.demo && (
          <Link
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-bracket"
          >
            [View Project]
          </Link>
        )}
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-bracket"
          >
            [GitHub]
          </Link>
        )}
      </div>
    </article>
  );
}
