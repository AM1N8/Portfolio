// filepath: portfolio/components/Nav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const TAGLINE = "Transforming innovative ideas into intelligent solutions through AI and data.";

const RANDOM_QUOTES = [
  "CDXV",
  "There is no end to the larp",
  "heavy machine gun",
  "CDXV",
  "Always be shipping",
  "Data never sleeps",
  "Hack the planet"
];
const MARQUEE_TEXT = "★ " + Array(10).fill(RANDOM_QUOTES.join(" ★ ")).join(" ★ ") + " ";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "var(--nav-height)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "rgba(18, 18, 18, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        {/* Marquee Ticker — Left */}
        <div
          className="marquee-container"
          style={{
            flex: "0 0 200px",
            marginRight: "1.5rem",
            display: "none",
          }}
          data-marquee
        >
          <div className="marquee-track">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                paddingRight: "3rem",
              }}
            >
              {TAGLINE} ★ {TAGLINE} ★&nbsp;
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                paddingRight: "3rem",
              }}
            >
              {TAGLINE} ★ {TAGLINE} ★&nbsp;
            </span>
          </div>
        </div>

        {/* Name — Center-Left */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            marginRight: "auto",
          }}
        >
          MOHAMED AMINE DARRAJ{/* TODO: replace */}
        </Link>

        {/* Nav Links — Right */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "nav-link-active" : undefined}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: isActive
                    ? "var(--color-black)"
                    : "var(--color-muted)",
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap",
                  padding: "0.25rem 0.5rem"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-white)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-muted)";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary" style={{ marginLeft: "0.5rem" }}>
            Hire Me
          </Link>
        </nav>
      </div>

      {/* Marquee Bar — below nav on wider screens */}
      <div
        className="marquee-container"
        style={{
          borderTop: "1px solid var(--color-border)",
          height: "28px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(18, 18, 18, 0.95)",
        }}
      >
        <div className="marquee-track">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--color-muted)",
              paddingRight: "4rem",
            }}
          >
            {MARQUEE_TEXT}&nbsp;
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--color-muted)",
              paddingRight: "4rem",
            }}
          >
            {MARQUEE_TEXT}&nbsp;
          </span>
        </div>
      </div>
    </header>
  );
}
