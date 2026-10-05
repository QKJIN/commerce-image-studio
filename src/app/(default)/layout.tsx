import type { Viewport } from "next";
import "@/main.scss";
import { AnalyticsScript } from "@/analytics";
import zhCN from "@/locales/zh-CN";
import { createLocaleMetadata } from "@/seo";

export const metadata = createLocaleMetadata("zh-CN", zhCN);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007a60",
};

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <AnalyticsScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
