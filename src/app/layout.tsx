import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaRetail AI Assistant",
  description: "Internal RAG prototype for NovaRetail employees.",
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
