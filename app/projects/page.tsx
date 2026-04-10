// filepath: portfolio/app/projects/page.tsx

import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Projects",
    description:
      "A selection of projects I've built — from CLI tools and SaaS apps to open-source libraries and data visualizations.",
  });
}

export default function ProjectsPage() {
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
          <span className="slash">/</span> Projects
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: "600px",
          }}
        >
          A selection of things I&apos;ve built — from CLI tools and SaaS apps
          to open-source libraries and data visualizations.
        </p>
      </section>

      {/* Projects Grid */}
      <section
        style={{ paddingBottom: "4rem" }}
        className="animate-fade-in-delay-1"
      >
        <div className="grid-projects">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
