// filepath: portfolio/app/layout.tsx

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Darraj Mohamed Amine — RSS Feed"
          href="/api/rss"
        />
      </head>
      <body
        style={{
          paddingTop: "calc(var(--nav-height) + 28px)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
