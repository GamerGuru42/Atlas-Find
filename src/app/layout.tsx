import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "AtlasFind | Discover Scholarships, Internships & Global Opportunities",
  description: "Find fully funded scholarships, internships, fellowships, and study abroad opportunities worldwide.",
  openGraph: {
    title: "AtlasFind | Discover Scholarships, Internships & Global Opportunities",
    description: "Find fully funded scholarships, internships, fellowships, and study abroad opportunities worldwide.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AtlasFind | Discover Scholarships, Internships & Global Opportunities",
    description: "Find fully funded scholarships, internships, fellowships, and study abroad opportunities worldwide.",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
