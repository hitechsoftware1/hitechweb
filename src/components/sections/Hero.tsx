"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Play, Globe } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TypingText } from '@/components/ui/typing-text';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-background">
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/70 py-1.5 px-4 rounded-full flex items-center gap-2 mb-4 hover:border-white/20 transition-all cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase">System Core Update v4.0</span>
            </Badge>
            
            <h1 className="font-headline text-5xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-gradient-apple">
              Engineering the <br />
              <TypingText 
                texts={["Visionary", "Extraordinary", "Intelligent", "Sublime"]} 
                className="text-primary"
              /> <br />
              Digital Ecosystem.
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/50 max-w-2xl leading-relaxed font-light mt-4">
              HITECH builds the architectural foundations for world-class digital experiences. Precision code for global innovators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="rounded-full px-10 h-14 text-sm bg-white text-background font-bold hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Launch Experience
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-10 h-14 text-sm text-white hover:bg-white/5 transition-all flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                View System Showcase
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 relative"
          >
            <div className="apple-card p-2 group">
              <div className="aspect-video relative rounded-[2rem] overflow-hidden">
                <Image 
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/apple-tech/1200/800"} 
                  alt="Minimal Interface"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  data-ai-hint="minimal dashboard"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                
                {/* Floating Widgets */}
                <div className="absolute top-6 right-6 apple-glass p-4 rounded-2xl flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Global Ops: Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}