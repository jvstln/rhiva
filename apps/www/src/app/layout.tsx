import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--geist",
});

export const metadata: Metadata = {
  title: "Rhiva | Liquidity Aggregator for seamless LP",
  description:
    "Experience Rhiva Beta, the all-in-one liquidity aggregator. Provide liquidity across multiple dexes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
