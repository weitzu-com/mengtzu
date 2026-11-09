"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  PRODUCTION_MEASUREMENT_ID,
  shouldCollectProductionAnalytics,
  shouldEmitPageView,
} from "../lib/analytics-policy.mjs";
import { GA_MEASUREMENT_ID } from "../lib/runtime-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __mengtzuGa?: { id: string };
  }
}

const sentPageViews = new Set<string>();
const pendingPrerenderViews = new Set<string>();

function ensureProductionGtag(measurementId: string) {
  if (window.__mengtzuGa?.id === measurementId) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  window.__mengtzuGa = { id: measurementId };
}

function isPrerendering() {
  const doc = document as Document & { prerendering?: boolean };
  return doc.prerendering === true;
}

function emitPageView(pagePath: string) {
  const decision = shouldEmitPageView({
    prerendering: isPrerendering(),
    pagePath,
    alreadySent: sentPageViews.has(pagePath),
  });

  if (!decision.emit) {
    if (decision.reason === "prerendering" && !pendingPrerenderViews.has(pagePath)) {
      pendingPrerenderViews.add(pagePath);
      document.addEventListener(
        "prerenderingchange",
        () => {
          pendingPrerenderViews.delete(pagePath);
          emitPageView(pagePath);
        },
        { once: true },
      );
    }
    return;
  }

  sentPageViews.add(pagePath);
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (
      !shouldCollectProductionAnalytics({
        hostname: window.location.hostname,
        measurementId: GA_MEASUREMENT_ID,
      })
    ) {
      return;
    }

    ensureProductionGtag(PRODUCTION_MEASUREMENT_ID);
    const queryString = searchParams?.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    emitPageView(pagePath);
  }, [pathname, searchParams]);

  return null;
}
