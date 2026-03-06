import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { Poppins } from 'next/font/google';
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const arrayFont = localFont({
  src: [
    {
      path: '../public/fonts/array/Array-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/array/Array-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/array/Array-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-array',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-oswald',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ancient-ai.com'),
  title: {
    default: "Ancient AI Academy",
    template: "%s | Ancient AI Academy",
  },
  description: "Transformative wisdom for every stage of your journey. Strengthening the mind, body, and soul.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Ancient AI Academy",
    description: "Transformative wisdom for every stage of your journey.",
    url: '/',
    siteName: 'Ancient AI Academy',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ancient AI Academy",
    description: "Transformative wisdom for every stage of your journey.",
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${oswald.variable} ${arrayFont.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}
