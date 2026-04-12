// filepath: portfolio/components/Footer.tsx

import Link from "next/link";
import { PersonalConfig } from "@/lib/config";
import ContributionGraph from "./ContributionGraph";


const footerLinksLeft = [
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer({ config }: { config: PersonalConfig }) {
  const footerLinksRight = [
    { href: config.socials.github, label: "GitHub", external: true },
    { href: config.socials.discord, label: "Discord", external: false }, // RSS is internal
    { href: config.socials.linkedin, label: "LinkedIn", external: true },
    { href: "/api/rss", label: "RSS", external: false },
  ];

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
          display: "flex",
          flexWrap: "wrap",
          gap: "3rem",
          alignItems: "start",
        }}
      >


        {/* Left Column */}
        <div style={{ flex: "0 0 200px" }}>

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
                  className="footer-link"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div style={{ flex: "0 0 200px" }}>

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
                  className="footer-link"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                  {link.external ? " ↗" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Column */}
        <div style={{ flex: "0 1 500px", minWidth: "300px", marginLeft: "auto", textAlign: "right" }}>




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
            Activity
          </p>
          <ContributionGraph />
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
          © {new Date().getFullYear()} {config.name}. All rights reserved.
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

      <div style={{ textAlign: "center", paddingBottom: "1.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
          Press Ctrl+` or ~ to open terminal  ·  Ctrl+Shift+C for CRT mode
        </p>
      </div>
    </footer>
  );
}
