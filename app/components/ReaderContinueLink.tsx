"use client";

import type { MouseEvent, ReactNode } from "react";
import { buildReaderContinueEvent, shouldCollectProductionAnalytics } from "../lib/analytics-policy.mjs";
import { GA_MEASUREMENT_ID } from "../lib/runtime-config";
import type { Locale } from "../lib/site";

type ReaderSurface = "passage_pager" | "principle_source";

type ReaderContinueLinkProps = {
  href: string;
  locale: Locale;
  surface: ReaderSurface;
  className?: string;
  children: ReactNode;
};

export function ReaderContinueLink({ href, locale, surface, className, children }: ReaderContinueLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
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

    const payload = buildReaderContinueEvent({
      locale,
      surface,
      destinationPath: event.currentTarget.pathname,
    });

    if (!payload || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", payload.name, {
      ...payload.params,
      transport_type: "beacon",
    });
  }

  return (
    <a href={href} className={className} data-reader-continue={surface} onClick={onClick}>
      {children}
    </a>
  );
}
