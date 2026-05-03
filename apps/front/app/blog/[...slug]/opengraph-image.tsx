import { ImageResponse } from "next/og";
import { blogSource } from "@/lib/blog/source";

export const alt = "Dunlo Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = blogSource.getPage(slug);
  const title = page?.data.title ?? "Blog";
  const description = page?.data.description ?? "";

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
            bottom: "10%",
            left: "5%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(0,232,123,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#00e87b",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 32,
            display: "flex",
          }}
        >
          dunlo blog
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f5f5f5",
            lineHeight: 1.15,
            maxWidth: 900,
            display: "flex",
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              fontSize: 22,
              color: "#888",
              marginTop: 28,
              maxWidth: 780,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {description}
          </div>
        ) : null}
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
