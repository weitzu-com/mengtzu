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
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.mengtzu.com" }],
        destination: "https://mengtzu.com/zh",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mengtzu.com" }],
        destination: "https://mengtzu.com/:path*",
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
    ];
  },
};

export default nextConfig;
