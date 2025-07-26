import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Gugi, Oswald } from "next/font/google";

const gameOfSquids = localFont({
  src: "./fonts/GameOfSquids.ttf",
  variable: "--font-game-of-squids",
  display: "swap",
});

const arial = localFont({
  src: "./fonts/ARIAL.ttf",
  variable: "--font-arial",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const gugi = Gugi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gugi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Innofusion 2.0 - The Game Will Never Stop",
  description:
    "Kolkata's premier Software + Hardware Hackathon! Dive into 30 hours of innovation, collaboration, and groundbreaking projects.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gameOfSquids.variable} ${arial.variable} ${oswald.variable} ${gugi.variable} antialiased overflow-x-hidden w-screen bg-[#000000]`}
      >
        {children}
      </body>
    </html>
  );
}
