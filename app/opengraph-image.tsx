import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Vente & pose de clôtures`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1e3d29 0%, #2d5a3d 50%, #faf7f2 100%)",
          color: "#faf7f2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#faf7f2",
              color: "#1e3d29",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>{site.tagline}</div>
        <div style={{ fontSize: 24, marginTop: 24, opacity: 0.75 }}>
          Sprimont · Esneux · Liège et environs
        </div>
      </div>
    ),
    { ...size },
  );
}
