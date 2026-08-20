import { ImageResponse } from "next/og";
import { localeMeta, type Locale } from "./site";

export const socialImageSize = {
  width: 1200,
  height: 630,
} as const;

export const socialImageContentType = "image/png";

type SocialCardOptions = {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  footer: string;
  chips: string[];
};

export function renderSocialCard({
  locale,
  eyebrow,
  title,
  description,
  accent,
  footer,
  chips,
}: SocialCardOptions) {
  const zh = locale === "zh";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f7f0df 0%, #efe5cf 55%, #e2d4b4 100%)",
          color: "#1f2937",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "9999px",
            background: `${accent}20`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -90,
            width: 340,
            height: 340,
            borderRadius: "9999px",
            background: `${accent}16`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "54px 62px 42px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "9999px",
                  background: accent,
                }}
              />
              <div
                style={{
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#475569",
                }}
              >
                {eyebrow}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 980,
              }}
            >
              <div
                style={{
                  fontSize: zh ? 68 : 62,
                  fontWeight: 700,
                  lineHeight: 1.08,
                  color: "#111827",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: zh ? 28 : 27,
                  lineHeight: 1.45,
                  color: "#374151",
                  maxWidth: 960,
                }}
              >
                {description}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: 9999,
                    background: "#ffffffc8",
                    border: `1px solid ${accent}30`,
                    fontSize: 22,
                    color: "#334155",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 18,
                borderTop: "1px solid rgba(71, 85, 105, 0.18)",
                fontSize: 22,
                color: "#475569",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    background: accent,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  孟
                </div>
                <div>{localeMeta[locale].siteName}</div>
              </div>
              <div>{footer}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
    },
  );
}
