import type { Metadata } from "next";

import { APP_CONFIG } from "@/lib/domain/app-config";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.productName,
    template: `%s | ${APP_CONFIG.productName}`,
  },
  description: APP_CONFIG.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
