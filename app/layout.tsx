import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IsoWorld - Isometric Society Simulator",
  description: "Build and experiment with an isometric world simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
