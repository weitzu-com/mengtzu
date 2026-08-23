import type { Metadata } from "next";

function readEnv(value: string | undefined) {
  value = value?.trim();
  return value && value.length > 0 ? value : null;
}

export const GOOGLE_SITE_VERIFICATION = readEnv(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
export const BING_SITE_VERIFICATION = readEnv(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION);
export const GA_MEASUREMENT_ID = readEnv(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

export function getSiteVerificationMetadata(): Metadata["verification"] {
  if (!GOOGLE_SITE_VERIFICATION && !BING_SITE_VERIFICATION) {
    return undefined;
  }

  return {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    ...(BING_SITE_VERIFICATION
      ? {
          other: {
            "msvalidate.01": BING_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}
