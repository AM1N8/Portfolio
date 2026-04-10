// filepath: portfolio/components/ResumeSection.tsx

import type { Experience, Education, SkillCategory } from "@/data/resume";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <div>
      {experiences.map((exp, index) => (
        <div key={`${exp.company}-${index}`} className="timeline-item">
          {/* Date Range */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-green)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.375rem",
            }}
          >
            {exp.startDate} — {exp.endDate}
          </p>

          {/* Role & Company */}
          <h3
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-white)",
              marginBottom: "0.125rem",
            }}
          >
            {exp.role}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              marginBottom: "0.75rem",
            }}
          >
            {exp.company}
          </p>

          {/* Bullets */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            {exp.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.7)",
                  paddingLeft: "1rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--color-green)",
                  }}
                >
                  ›
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function EducationList({ education }: { education: Education[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {education.map((edu, index) => (
        <div
          key={`${edu.institution}-${index}`}
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.25rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--color-green)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.375rem",
            }}
          >
            {edu.startDate} — {edu.endDate}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-white)",
              marginBottom: "0.125rem",
            }}
          >
            {edu.degree}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              marginBottom: "0.25rem",
            }}
          >
            {edu.institution}
          </p>
          {edu.detail && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
              }}
            >
              {edu.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function SkillsGrid({
  skills,
}: {
  skills: SkillCategory[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "2rem",
      }}
    >
      {skills.map((category) => (
        <div key={category.category}>
          <h3
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-green)",
              marginBottom: "0.75rem",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "0.5rem",
            }}
          >
            {category.category}
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            {category.items.map((item) => (
              <li
                key={item}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
