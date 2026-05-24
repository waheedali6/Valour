'use client'

import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css";
import "./responsive.css";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";

// Register GSAP plugins once at module level
gsap.registerPlugin(ScrollTrigger);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  useEffect(() => {
    // Premium Lenis config
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Body cursor style
    document.body.style.cursor = 'none';

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
