// filepath: portfolio/app/layout.tsx

import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/metadata";
import { config } from "@/lib/config";
import "@/styles/globals.css";

import TerminalProvider from "@/components/TerminalProvider";
import { CRTProvider } from "@/components/CRTProvider";
import Screensaver from "@/components/Screensaver";

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
        <CRTProvider>
          <TerminalProvider config={config}>
            <Nav config={config} />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer config={config} />
          </TerminalProvider>
        </CRTProvider>
        <Screensaver />
      </body>
    </html>
  );
}
