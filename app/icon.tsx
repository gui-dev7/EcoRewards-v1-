import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon gerado a partir da folha EcoRewards, sem depender de binário. */
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
          background: "#0e9f6e",
          borderRadius: 14,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
          <path
            d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
            fill="#ffffff"
            fillOpacity="0.22"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path
            d="M10 38 L38 10"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
