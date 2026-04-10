// filepath: portfolio/components/PostCard.tsx
"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "1.5rem 0",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Link
        href={`/writing/${post.slug}`}
        style={{ display: "block" }}
      >
        {/* Date */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          {formattedDate}
        </p>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--color-white)",
            marginBottom: "0.5rem",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-green)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-white)";
          }}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--color-muted)",
            marginBottom: "0.75rem",
          }}
        >
          {post.description}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {post.tags.map((tag) => (
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

        {/* Read More */}
        <span
          className="link-bracket"
          style={{ display: "inline-block", marginTop: "0.75rem" }}
        >
          [Read More]
        </span>
      </Link>
    </article>
  );
}
