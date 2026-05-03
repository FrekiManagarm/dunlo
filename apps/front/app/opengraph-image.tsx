import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dunlo — Stop losing revenue to failed payments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,232,123,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,123,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(0,232,123,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#f5f5f5",
            marginBottom: 48,
            display: "flex",
          }}
        >
          dunlo
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f5f5f5",
            lineHeight: 1.1,
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Stop losing revenue</span>
          <span>to failed payments.</span>
          <span style={{ color: "#00e87b", fontStyle: "italic" }}>
            Automatically.
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#888",
            marginTop: 32,
            display: "flex",
          }}
        >
          Payment recovery for bootstrapped SaaS founders.
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(0,232,123,0.3)",
            padding: "8px 20px",
            fontSize: 14,
            color: "#00e87b",
            letterSpacing: "0.15em",
          }}
        >
          dunlo.io
        </div>
      </div>
    ),
    { ...size },
  );
}
