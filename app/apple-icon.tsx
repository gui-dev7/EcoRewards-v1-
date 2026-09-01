import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e9f6e",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 48 48" fill="none">
          <path
            d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
            fill="#ffffff"
            fillOpacity="0.22"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M10 38 L38 10"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
