// Serves the Umami loader at request time so the container's environment
// variables decide whether analytics runs. Without them it is an empty script.
// The ".runtime.ts" extension keeps this route out of static exports, which
// have no server to read environment variables (see next.config.ts).
import { connection } from "next/server";

export async function GET() {
  await connection();
  const scriptUrl = process.env.UMAMI_SCRIPT_URL;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const body = scriptUrl && websiteId
    ? `(()=>{const s=document.createElement("script");s.defer=true;s.src=${JSON.stringify(scriptUrl)};s.dataset.websiteId=${JSON.stringify(websiteId)};document.head.appendChild(s);window.__analyticsEnabled=true;window.dispatchEvent(new Event("analytics-enabled"));})();`
    : "";
  return new Response(body, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
