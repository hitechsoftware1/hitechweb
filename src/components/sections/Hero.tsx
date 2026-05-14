"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Globe } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TypingText } from '@/components/ui/typing-text';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-24 overflow-hidden bg-background">
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-2 gap-4 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-4 lg:gap-8"
          >
            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/70 py-1 px-2 lg:py-1.5 lg:px-4 rounded-full flex items-center gap-1 lg:gap-2 mb-2 lg:mb-4 hover:border-white/20 transition-all cursor-default">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[7px] lg:text-[10px] font-bold tracking-widest uppercase">System Core v4.0</span>
            </Badge>
            
            <h1 className="font-headline text-2xl sm:text-4xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gradient-apple">
              Engineering the <br />
              <TypingText 
                texts={["Visionary", "Intelligent", "Sublime"]} 
                className="text-primary"
              /> <br className="hidden lg:block" />
              Ecosystem.
            </h1>
            
            <p className="text-[10px] sm:text-base lg:text-xl text-white/50 max-w-xl leading-relaxed font-light line-clamp-3 lg:line-clamp-none">
              HITECH builds the architectural foundations for world-class digital experiences. Precision code for global innovators.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 w-full">
              <Button size="sm" className="lg:size-lg rounded-full px-4 lg:px-10 h-10 lg:h-14 text-[9px] lg:text-sm bg-white text-background font-bold hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Launch
              </Button>
              <Button size="sm" variant="ghost" className="hidden sm:flex rounded-full px-4 lg:px-10 h-10 lg:h-14 text-[9px] lg:text-sm text-white hover:bg-white/5 transition-all items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2 h-2 lg:w-3 lg:h-3 fill-current ml-0.5" />
                </div>
                Showcase
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="apple-card p-1 lg:p-2 group">
              <div className="aspect-[4/3] lg:aspect-[4/3] relative rounded-[1rem] lg:rounded-[2rem] overflow-hidden">
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
                <div className="absolute top-2 right-2 lg:top-6 lg:right-6 apple-glass p-2 lg:p-4 rounded-lg lg:rounded-2xl flex items-center gap-1 lg:gap-3 animate-float">
                  <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                  <span className="text-[6px] lg:text-[10px] font-bold text-white/80 uppercase tracking-widest">Global</span>
                </div>

                <div className="absolute bottom-2 left-2 lg:bottom-6 lg:left-6 apple-glass p-2 lg:p-4 rounded-lg lg:rounded-2xl flex flex-col gap-1 backdrop-blur-3xl">
                  <span className="text-[6px] lg:text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Compute</span>
                  <div className="flex items-end gap-0.5 lg:gap-1">
                    <div className="w-0.5 h-1.5 lg:w-1 lg:h-3 bg-primary/40 rounded-full" />
                    <div className="w-0.5 h-2.5 lg:w-1 lg:h-5 bg-primary/60 rounded-full" />
                    <div className="w-0.5 h-4 lg:w-1 lg:h-8 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Glow */}
            <div className="absolute -z-10 -inset-4 bg-primary/20 blur-[60px] lg:blur-[100px] rounded-full opacity-30 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
