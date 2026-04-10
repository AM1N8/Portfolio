import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createMetadata({ title: "Post Not Found" });
  }

  return createMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div
      style={{
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
      }}
    >
      <article
        style={{
          maxWidth: "720px",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
        className="animate-fade-in"
      >
        {/* Post Header */}
        <header style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-green)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            {formattedDate}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "var(--color-green)" }}>/</span>{" "}
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            {post.frontmatter.description}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {post.frontmatter.tags.map((tag) => (
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
          <hr className="card-divider" style={{ marginTop: "2rem" }} />
        </header>

        {/* Post Content */}
        <div className="prose-portfolio">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
