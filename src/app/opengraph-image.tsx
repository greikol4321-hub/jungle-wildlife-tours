import { ImageResponse } from "next/og";

export const alt = "Jungle Wildlife Tours · Manuel Antonio, Costa Rica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1A0F 0%, #142318 50%, #1A3D28 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-15%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(78,203,113,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,197,160,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 1254 1254" fill="none">
            <path d="M3805 9663 c-309 -21 -664 -133 -938 -296 -183 -109 -358 -269 -464 -424 -61 -89 -133 -220 -114 -209 5 4 50 37 100 74 307 231 679 378 1070 423 155 17 457 7 596 -21 340 -68 611 -213 782 -420 68 -82 142 -227 150 -297 5 -46 3 -54 -20 -77 -46 -46 -80 -38 -300 74 -279 141 -456 194 -693 207 -447 24 -1010 -196 -1469 -576 -365 -303 -616 -692 -702 -1093 -14 -64 -18 -128 -18 -278 0 -213 10 -280 67 -460 31 -97 132 -320 146 -320 4 0 20 34 35 76 60" fill="#4ECB71" transform="scale(0.1) translate(0,-12540)" />
          </svg>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#E8E4DC", letterSpacing: "-0.01em" }}>
            Jungle Wildlife Tours
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#E8E4DC",
              textAlign: "center",
              lineHeight: 1.05,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Jungle Wildlife Tours
          </h1>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(232,228,220,0.6)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
            }}
          >
            Manuel Antonio · Costa Rica
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            gap: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6 + i * 2,
                height: 6 + i * 2,
                borderRadius: "50%",
                backgroundColor: i === 1 ? "#4ECB71" : "rgba(78,203,113,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
