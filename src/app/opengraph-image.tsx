import { ImageResponse } from "next/og";

/* The share card. It is the only part of the site most people see first, and it
   was still selling the old positioning -- "Fixed price. Production code. Done
   in days." in Georgia on #111 -- months after the company stopped describing
   itself that way. A stale OG image is the one design asset that keeps shipping
   the previous strategy to every link anyone pastes. */

export const alt = "LOVELEEDAY Studios — one object, every source";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090B",
          padding: "68px 76px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* the signal, as a single bar rather than a logo treatment */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "10px",
            height: "630px",
            backgroundColor: "#FF4713",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <rect x="18" y="18" width="27" height="27" stroke="#F5F5F2" strokeWidth="4" />
            <rect x="55" y="18" width="27" height="27" fill="#F5F5F2" />
            <rect x="18" y="55" width="27" height="27" fill="#F5F5F2" />
            <path d="M55 55H82V82H55V55Z" stroke="#F5F5F2" strokeWidth="4" />
            <circle cx="68.5" cy="68.5" r="7" fill="#FF4713" />
          </svg>
          <div style={{ display: "flex", fontSize: "23px", color: "#F5F5F2", fontWeight: 600, letterSpacing: "0.02em" }}>
            LOVELEEDAY
            <span style={{ color: "#6B7179", marginLeft: "9px" }}>Studios</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "104px",
              fontWeight: 700,
              color: "#F5F5F2",
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            One object.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "104px",
              fontWeight: 700,
              color: "#6B7179",
              letterSpacing: "-0.045em",
              lineHeight: 1.06,
            }}
          >
            Every source.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "27px",
              color: "#A0A6AE",
              marginTop: "28px",
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            Intelligence architecture, and the production software that runs on top of it.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "17px",
            color: "#6B7179",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            borderTop: "1px solid #1B1F27",
            paddingTop: "22px",
          }}
        >
          <span>loveleedaystudios.com</span>
          <span>Kalamazoo, Michigan</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
