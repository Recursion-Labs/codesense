"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Screenshots from "@/components/Screenshots";
import HowItWorks from "@/components/HowItWorks";
import FutureScope from "@/components/FutureScope";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Screenshots />
          <HowItWorks />
          <FutureScope />
          <CTA />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}