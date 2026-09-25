import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ZAR ZOR",
  description: "Frontend separate from API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
