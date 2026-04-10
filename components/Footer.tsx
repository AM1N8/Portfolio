// filepath: portfolio/components/Footer.tsx
"use client";

import Link from "next/link";

const footerLinksLeft = [
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const footerLinksRight = [
  { href: "https://github.com/AM1N8", label: "GitHub", external: true },
  { href: "https://discordapp.com/users/one1276", label: "Discord", external: true },
  { href: "https://www.linkedin.com/in/mohamed-amine-darraj-5015423ab/", label: "LinkedIn", external: true },
  { href: "/api/rss", label: "RSS", external: false },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        marginTop: "6rem",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "3rem var(--gutter)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        {/* Left Column */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            Navigation
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {footerLinksLeft.map((link) => (
              <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    color: "var(--color-muted)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-green)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-muted)";
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            Elsewhere
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {footerLinksRight.map((link) => (
              <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    color: "var(--color-muted)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-green)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-muted)";
                  }}
                >
                  {link.label}
                  {link.external ? " ↗" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1.5rem var(--gutter)",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-muted)",
          }}
        >
          © {new Date().getFullYear()} Mohamed Amine Darraj. All rights reserved.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-muted)",
          }}
        >
          Built with Next.js + Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
