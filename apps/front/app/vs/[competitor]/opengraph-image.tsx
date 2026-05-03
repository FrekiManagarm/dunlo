import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dunlo vs competitor — Payment Recovery Comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COMPETITOR_NAMES: Record<string, string> = {
  "baremetrics-recover": "Baremetrics Recover",
  "churn-buster": "Churn Buster",
  "stripe-smart-retries": "Stripe Smart Retries",
  stunning: "Stunning",
};

export default async function Image({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const name = COMPETITOR_NAMES[competitor] ?? competitor;

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,232,123,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,123,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "5%",
            width: 450,
            height: 450,
            background:
              "radial-gradient(circle, rgba(0,232,123,0.10) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#f5f5f5",
            marginBottom: 40,
            display: "flex",
          }}
        >
          dunlo
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#00e87b",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
          }}
        >
          Comparison
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: "#f5f5f5",
            lineHeight: 1.1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Dunlo</span>
          <span>
            <span style={{ color: "#555" }}>vs </span>
            <span style={{ color: "#00e87b" }}>{name}</span>
          </span>
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#888",
            marginTop: 28,
            display: "flex",
          }}
        >
          Payment recovery for bootstrapped SaaS founders.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            alignItems: "center",
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
