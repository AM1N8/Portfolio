// filepath: portfolio/app/page.tsx

import Link from "next/link";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";
import { config } from "@/lib/config";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";


export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const latestPosts = getAllPosts().slice(0, 2);

  return (
    <div
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
      }}
    >
      {/* ── Hero Section ──────────────────────────────── */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "4rem",
        }}
        className="animate-fade-in"
      >
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>
          <span className="slash">/</span> {config.name.toUpperCase()}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.25rem",
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: "640px",
            marginBottom: "2rem",
          }}
        >
          {config.tagline}
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/projects" className="btn-primary">
            View Projects
          </Link>
          <Link
            href="/about"
            className="link-bracket"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            [Read My CV]
          </Link>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────── */}
      <section
        style={{ paddingBottom: "4rem" }}
        className="animate-fade-in-delay-1"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
            }}
          >
            <span style={{ color: "var(--color-green)" }}>/</span> Featured
            Projects
          </h2>
          <Link href="/projects" className="link-bracket">
            [View All]
          </Link>
        </div>
        <div className="grid-projects">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* ── Latest Writing ────────────────────────────── */}
      <section
        style={{ paddingBottom: "4rem" }}
        className="animate-fade-in-delay-2"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
            }}
          >
            <span style={{ color: "var(--color-green)" }}>/</span> Latest
            Writing
          </h2>
          <Link href="/writing" className="link-bracket">
            [View All]
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1.5rem",
            }}
          >
            No posts yet. Check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
