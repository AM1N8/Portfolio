// filepath: portfolio/app/writing/page.tsx

import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/mdx";
import PostCard from "@/components/PostCard";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Writing",
    description:
      "Thoughts on software engineering, open source, and the tools I use to build things.",
  });
}

export default function WritingPage() {
  const posts = getAllPosts();

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
          <span className="slash">/</span> Writing
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
          Thoughts on software engineering, open source, and the tools I use to
          build things.
        </p>
      </section>

      {/* Posts List */}
      <section
        style={{ paddingBottom: "4rem", maxWidth: "720px" }}
        className="animate-fade-in-delay-1"
      >
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                color: "var(--color-muted)",
              }}
            >
              No posts yet. Check back soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
