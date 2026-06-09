import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e3d29",
          borderRadius: 8,
          color: "#faf7f2",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
