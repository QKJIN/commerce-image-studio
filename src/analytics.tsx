// Cookieless Umami analytics. Enabled only when both build-time variables
// are set, so forks and local builds send nothing.
const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const analyticsEnabled = Boolean(scriptUrl && websiteId);

export function AnalyticsScript() {
  if (!analyticsEnabled) return null;
  return <script defer src={scriptUrl} data-website-id={websiteId} />;
}

type EventData = Record<string, string | number>;

// Only counts and option names are sent; never file names or image content.
export function trackEvent(name: string, data?: EventData) {
  try {
    window.umami?.track(name, data);
  } catch {}
}
