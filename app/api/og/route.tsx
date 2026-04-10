// filepath: portfolio/app/api/og/route.tsx

import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Darraj Mohamed Amine"; // TODO: replace
  const description =
    searchParams.get("description") ||
    "Full-Stack Engineer & Open Source Contributor";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "60px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            backgroundColor: "#00ff00",
            marginBottom: "40px",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              color: "#00ff00",
              fontSize: "64px",
              fontWeight: 700,
              marginRight: "16px",
              lineHeight: 1,
            }}
          >
            /
          </span>
          <span
            style={{
              color: "#ffffff",
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "900px",
              overflow: "hidden",
            }}
          >
            {title}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "24px",
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          {description}
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "20px",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "18px",
            }}
          >
            amin8.dev{/* TODO: replace */}
          </span>
          <span
            style={{
              color: "#00ff00",
              fontSize: "18px",
            }}
          >
            github.com/AM1N8{/* TODO: replace */}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
