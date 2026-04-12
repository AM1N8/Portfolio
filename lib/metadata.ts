// filepath: portfolio/lib/metadata.ts

import type { Metadata } from "next";

import { config } from "./config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amin8.dev";
const SITE_NAME = config.name;
const SITE_DESCRIPTION = config.short_description;

export function createMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const title = overrides.title
    ? `${overrides.title} — ${SITE_NAME}`
    : `${SITE_NAME} — ${SITE_DESCRIPTION}`;

  const description =
    (overrides.description as string) || SITE_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(
            typeof title === "string" ? title : SITE_NAME
          )}`,
          width: 1200,
          height: 630,
          alt: typeof title === "string" ? title : SITE_NAME,
        },
      ],
      ...(overrides.openGraph || {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(overrides.twitter || {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION };
