// filepath: portfolio/app/contact/page.tsx

import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import ContactForm from "@/components/ContactForm";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Contact",
    description:
      "Get in touch — whether you have a project idea, want to collaborate, or just want to say hello.",
  });
}

export default function ContactPage() {
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
          <span className="slash">/</span> Contact
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: "600px",
            marginBottom: "0.5rem",
          }}
        >
          Have a project idea, want to collaborate, or just want to say hello?
          Drop me a message below or reach out directly at{" "}
          <a
            href="mailto:mohamedaminedarraj@gmail.com"
            style={{
              color: "var(--color-green)",
              transition: "color 0.2s ease",
            }}
          >
            mohamedaminedarraj@gmail.com
          </a>
          .
        </p>
      </section>

      {/* Contact Form */}
      <section
        style={{ paddingBottom: "4rem" }}
        className="animate-fade-in-delay-1"
      >
        <ContactForm />
      </section>

      {/* Additional Info */}
      <section
        style={{ paddingBottom: "4rem" }}
        className="animate-fade-in-delay-2"
      >
        <hr className="card-divider" style={{ marginBottom: "2rem" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-green)",
                marginBottom: "0.5rem",
              }}
            >
              Location
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--color-muted)",
              }}
            >
              Meknès, Morocco
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-green)",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </h3>
            <a
              href="mailto:mohamedaminedarraj@gmail.com"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--color-muted)",
                transition: "color 0.2s ease",
              }}
            >
              mohamedaminedarraj@gmail.com
            </a>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-green)",
                marginBottom: "0.5rem",
              }}
            >
              GitHub
            </h3>
            <a
              href="https://github.com/AM1N8"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--color-muted)",
                transition: "color 0.2s ease",
              }}
            >
              github.com/AM1N8
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
