import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeContext";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Regressor's Tale of Cultivation • Web Reader",
  description: "Read A Regressor's Tale of Cultivation (회차진행자: 회귀자의 신선기) online with Catppuccin Mocha & Cultivation color palettes, 3D novel cover, anime.js animations, and cookie reading progress sync.",
  openGraph: {
    title: "A Regressor's Tale of Cultivation • Web Reader",
    description: "Read A Regressor's Tale of Cultivation with Catppuccin Mocha & Cultivation color palettes. Complete 869 chapters EPUB reader.",
    images: ['/cover.jpg'],
  },
  icons: {
    icon: '/cover.jpg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-palette="catppuccin-mocha" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <Navbar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
