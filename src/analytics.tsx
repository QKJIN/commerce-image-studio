"use client";

import { useEffect, useState } from "react";

// Cookieless Umami analytics. The server decides at runtime whether it is
// enabled, from the UMAMI_SCRIPT_URL and UMAMI_WEBSITE_ID environment
// variables (src/app/analytics.js/route.runtime.ts).
const analyticsRoute = process.env.ANALYTICS_ROUTE;

export function AnalyticsScript() {
  if (!analyticsRoute) return null;
  return <script defer src={analyticsRoute} />;
}

export function useAnalyticsEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const update = () => setEnabled(window.__analyticsEnabled === true);
    update();
    window.addEventListener("analytics-enabled", update);
    return () => window.removeEventListener("analytics-enabled", update);
  }, []);
  return enabled;
}

type EventData = Record<string, string | number>;

// Only counts and option names are sent; never file names or image content.
export function trackEvent(name: string, data?: EventData) {
  try {
    window.umami?.track(name, data);
  } catch {}
}
