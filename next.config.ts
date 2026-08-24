import type { NextConfig } from "next";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const scriptSrc = ["'self'", "'unsafe-inline'"];
const connectSrc = ["'self'"];
const imgSrc = ["'self'", "data:", "https:"];

if (gaMeasurementId) {
  scriptSrc.push("https://www.googletagmanager.com");
  connectSrc.push("https://www.google-analytics.com", "https://region1.google-analytics.com");
  imgSrc.push("https://www.google-analytics.com");
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      `img-src ${imgSrc.join(" ")}`,
      "font-src 'self' data:",
      `script-src ${scriptSrc.join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      `connect-src ${connectSrc.join(" ")}`,
      "object-src 'none'",
    ].join("; "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // Vercel builds from an ASCII path, but local Desktop paths include Chinese
  // characters. Webpack avoids a Turbopack path-slicing panic in Next 16.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // The portrait is the only in-page raster image.  Its rendered width never
    // exceeds 400px on desktop or the 860px mobile breakpoint, so larger
    // default candidates only create redundant image-cache variants.
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [],
    formats: ["image/webp"],
  },
  async redirects() {
    const defaultLocaleHubs = [
      "/about",
      "/method",
      "/sources",
      "/faq",
      "/principles",
      "/quotes",
      "/books",
    ];

    return [
      {
        source: "/",
        has: [{ type: "host", value: "mengtzu.com" }],
        destination: "https://www.mengtzu.com/zh",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mengtzu.com" }],
        destination: "https://www.mengtzu.com/:path*",
        permanent: true,
      },
      ...defaultLocaleHubs.map((path) => ({
        source: path,
        destination: `/zh${path}`,
        permanent: true,
      })),
      {
        source: "/principles/:path*",
        destination: "/zh/principles/:path*",
        permanent: true,
      },
      {
        source: "/books/:path*",
        destination: "/zh/books/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // This is also used by schema.org and social consumers. It changes
        // only with a deliberate deployment, so allow edge and browser reuse.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
