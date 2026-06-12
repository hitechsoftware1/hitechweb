
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Zap, 
  Shield, 
  SmartphoneNfc, 
  Layout, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

const capabilities = [
  {
    title: "iPhone Apps",
    description: "High-speed apps built specifically for Apple devices.",
    icon: AppleIcon
  },
  {
    title: "Android Apps",
    description: "Strong, reliable apps for all Android phones.",
    icon: Smartphone
  },
  {
    title: "Cross-Platform",
    description: "One app that works perfectly on both iPhone and Android.",
    icon: SmartphoneNfc
  },
  {
    title: "Safe & Secure",
    description: "Secure login, face ID, and data protection built-in.",
    icon: Shield
  }
];

const recentProjects = [
  {
    title: "Quantum Mobile",
    category: "Fintech",
    image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl,
    metrics: "Very Fast"
  },
  {
    title: "Lumina Health",
    category: "Health",
    image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl,
    metrics: "Smart AI"
  },
  {
    title: "Nexus Logistics",
    category: "Logistics",
    image: PlaceHolderImages.find(i => i.id === 'project-3')?.imageUrl,
    metrics: "Real-time"
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const showcaseImages = [
    PlaceHolderImages.find(i => i.id === 'mobile-1'),
    PlaceHolderImages.find(i => i.id === 'mobile-2'),
    PlaceHolderImages.find(i => i.id === 'mobile-3'),
    PlaceHolderImages.find(i => i.id === 'project-1'),
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Banner Background */}
      <section className="relative min-h-[50vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10" />
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-25 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 rotate-12 scale-125 -translate-y-20">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[9/19] relative rounded-[2rem] overflow-hidden border border-foreground/10 shadow-2xl bg-zinc-800">
                <Image 
                  src={showcaseImages[i % showcaseImages.length]?.imageUrl || ""} 
                  alt="HITECH Mobile Showcase"
                  fill
                  className="object-cover"
                  data-ai-hint="mobile showcase"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 neural-grid opacity-30 z-20" />
        </div>

        <div className="container mx-auto px-6 relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Smartphone className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Mobile Apps</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
              Mobile <br /> Apps.
            </h1>
            <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
              We build great apps that work perfectly on your phone. Fast, secure, and easy-to-use software for modern businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="container mx-auto px-6 mb-32 pt-20">
        <div className="grid grid-cols-2 gap-4 lg:gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-6 lg:p-12 group hover:border-primary/30"
            >
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 lg:mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <cap.icon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <h3 className="text-sm lg:text-2xl font-headline font-bold mb-2 lg:mb-4">{cap.title}</h3>
              <p className="text-[10px] lg:text-lg text-foreground/50 font-light line-clamp-3 lg:line-clamp-none">{cap.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Protocol */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-8">Better <br /> Design.</h2>
              <div className="space-y-8">
                {[
                  { title: "Very Fast", desc: "No delays. Everything works instantly.", icon: Zap },
                  { title: "Works Offline", desc: "Our apps work even when you don't have internet.", icon: Cpu },
                  { title: "Easy to Use", desc: "Beautiful designs that are simple for everyone.", icon: Layout }
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
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">HITECH Checklist</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Biometric Login (FaceID)",
                  "Safe Encryption",
                  "Background Updates",
                  "Smart Notifications",
                  "Easy Navigation",
                  "Secure Payments"
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
            <h2 className="text-3xl lg:text-5xl font-headline font-bold mb-6">Start Your App.</h2>
            <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto font-light">
              Our engineers are ready to build your next great app. Let's talk about your idea.
            </p>
            <Button asChild size="lg" className="rounded-full bg-white text-primary font-bold hover:bg-white/90 px-10 h-14">
              <Link href="/request-project" className="flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent App Projects Slide */}
      <section className="container mx-auto px-6 mb-32">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 block">Our Work</span>
          <h2 className="text-2xl lg:text-4xl font-headline font-bold">Recent App Launches.</h2>
        </div>

        <div className="perspective-1000">
          <Carousel 
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{ 
              align: "center", 
              loop: true,
            }} 
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {recentProjects.map((project, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-[85%] md:basis-[45%] lg:basis-[33.33%]">
                  <motion.div
                    animate={{
                      scale: current === idx ? 1.02 : 0.9,
                      opacity: current === idx ? 1 : 0.5,
                      y: current === idx ? [0, -10, 0] : 0,
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                    }}
                    className={cn(
                      "transition-all duration-700 h-full",
                      current === idx && "drop-shadow-[0_20px_50px_rgba(var(--primary),0.15)]"
                    )}
                  >
                    <div className="apple-card group overflow-hidden h-full flex flex-col">
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <Image 
                          src={project.image || ""} 
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all" />
                      </div>

                      <div className="flex-grow flex flex-col justify-between p-6 lg:p-8">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Badge variant="outline" className="text-[8px] lg:text-[10px] font-bold text-primary border-primary/20 uppercase tracking-widest">{project.category}</Badge>
                            <span className="text-[8px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{project.metrics}</span>
                          </div>
                          <h3 className="font-headline font-bold text-foreground text-xl lg:text-2xl">{project.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/40 font-light mt-6 text-xs">
                          View Project <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          <div className="flex justify-center gap-2 mt-12">
            {recentProjects.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  current === idx ? "w-8 bg-primary" : "w-2 bg-foreground/10"
                )} 
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
