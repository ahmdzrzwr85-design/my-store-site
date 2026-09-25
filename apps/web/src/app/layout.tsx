import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ZAR ZOR",
  description: "متجر ZAR ZOR للإلكترونيات والعروض الذكية",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
