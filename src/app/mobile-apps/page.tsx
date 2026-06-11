
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Shield, SmartphoneNfc, Layout, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const capabilities = [
  {
    title: "iOS Native Development",
    description: "High-performance applications built with Swift and SwiftUI for the Apple ecosystem.",
    icon: AppleIcon
  },
  {
    title: "Android Ecosystem",
    description: "Robust, scalable Android applications utilizing Kotlin and modern Jetpack Compose architecture.",
    icon: Smartphone
  },
  {
    title: "Cross-Platform Scale",
    description: "High-fidelity Flutter and React Native systems for uniform experiences across all mobile environments.",
    icon: SmartphoneNfc
  },
  {
    title: "Mobile Security",
    description: "Biometric authentication, zero-trust protocols, and end-to-end encrypted local storage.",
    icon: Shield
  }
];

function AppleIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.88 0 3.05-1.07 4.54-1.07 1.48 0 2.5.94 4.41.94 2.14 0 3.05-2.02 3.05-2.02a6.38 6.38 0 0 1-3.13-5.52c0-4.59 3.74-5.63 3.74-5.63a6.56 6.56 0 0 0-5.14-2.8c-2.18-.23-4.24 1.28-5.34 1.28-1.1 0-2.8-1.24-4.63-1.21a6.83 6.56 0 0 0-5.75 3.32C1.65 10.63 1.15 15.65 3.31 18.9c1.05 1.59 2.3 3.16 4.02 3.1 1.66-.06 2.27-1.06 4.67-1.06Z" />
      <path d="M12 3c1.06 0 2.05.51 2.7 1.42 1.05 1.48.91 3.51.91 3.51s-2.01.21-3.07-1.28C11.89 5.74 12 3.91 12 3Z" />
    </svg>
  );
}

export default function MobileAppsPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Smartphone className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Engineering Vertical</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Mobile <br /> Intelligence.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            We architect refined mobile ecosystems that define how users interact with the digital world. High-performance native and cross-platform systems for the modern era.
          </p>
        </motion.div>
      </section>

      {/* Capabilities Grid */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-10 group hover:border-primary/30"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <cap.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">{cap.title}</h3>
              <p className="text-foreground/50 leading-relaxed font-light">{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Protocol */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-8">Refined <br /> Architecture.</h2>
              <div className="space-y-8">
                {[
                  { title: "Sub-100ms Latency", desc: "Optimized data fetching protocols for instant response times.", icon: Zap },
                  { title: "Offline Resilience", desc: "Local-first data architecture ensures 100% operational uptime.", icon: Cpu },
                  { title: "Sublime UI/UX", desc: "Adhering to the HITECH design standard for unmatched tactility.", icon: Layout }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-foreground/50 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="apple-card p-12 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-8">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">HITECH Standard Checklist</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Biometric Auth (FaceID/TouchID)",
                  "Multi-Layer Encryption",
                  "Background Data Sync",
                  "Push Notification Clusters",
                  "Accessibility v2.0 Compliance",
                  "Deep-Linking & Universal Links"
                ].map((check, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="apple-card p-12 lg:p-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 neural-grid opacity-20" />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-6">Launch Your Ecosystem.</h2>
            <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto font-light">
              Our mobile engineers are ready to build your next generation application. Let's discuss your technical requirements.
            </p>
            <Button asChild size="lg" className="rounded-full bg-white text-primary font-bold hover:bg-white/90 px-10 h-14">
              <Link href="/request-project" className="flex items-center gap-2">
                Start My Project <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
