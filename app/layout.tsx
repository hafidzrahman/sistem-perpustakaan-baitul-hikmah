"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

const spaceSans = localFont({
  src: "./fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-sans",
  weight: "300 700",
});

const sourceSerif = localFont({
  src: [
    {
      path: "./fonts/serif/SourceSerif4-VariableFont_opsz,wght.ttf",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/serif/SourceSerif4-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-source-serif",
  weight: "200 900",
});
const sourceSans = localFont({
  src: [
    {
      path: "./fonts/sans/SourceSans3-VariableFont_wght.ttf",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/sans/SourceSans3-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-source-sans",
  weight: "200 900",
});

// export const metadata: Metadata = {
//   title: "Baitul Hikmah Al-Fityah",
//   description: "Sistem Informasi Perpustakaan di SMP IT Al-Fityah",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} ${sourceSans.variable} ${spaceSans.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
