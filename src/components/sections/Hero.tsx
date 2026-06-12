"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TypingText } from '@/components/ui/typing-text';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative flex items-center pt-16 lg:pt-24 pb-2 lg:pb-4 overflow-hidden bg-background">
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-20 dark:opacity-40"
        >
          <source src="https://video-previews.elements.envatousercontent.com/88a1c795-102f-4bbe-8239-8be32b72c10c/watermarked_preview/watermarked_preview.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 neural-grid opacity-40 dark:opacity-20" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 dark:bg-primary/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-2 gap-4 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-3 lg:gap-8"
          >
            <Badge variant="outline" className="bg-foreground/5 border-foreground/10 text-foreground/70 py-0.5 px-2 lg:py-1.5 lg:px-4 rounded-full flex items-center gap-1 lg:gap-2 mb-1 lg:mb-4 hover:border-foreground/20 transition-all cursor-default">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[7px] lg:text-[10px] font-bold tracking-[0.2em] uppercase">HITECH New Version Active</span>
            </Badge>
            
            <h1 className="font-headline text-xl sm:text-4xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-gradient-apple">
              Building <br />
              <TypingText 
                texts={["Great Apps", "Smart AI", "Fast Systems"]} 
                className="text-primary"
              /> <br />
              for Your Business.
            </h1>
            
            <p className="text-[9px] sm:text-base lg:text-xl text-foreground/50 max-w-xl leading-relaxed font-light line-clamp-3 lg:line-clamp-none">
              HITECH builds strong foundations for world-class digital tools. We write clean code for innovators and companies shaping the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 w-full mt-2 lg:mt-4">
              <Button asChild size="sm" className="lg:h-14 lg:px-10 rounded-full h-8 px-4 text-[8px] lg:text-sm bg-foreground text-background font-bold hover:opacity-90 transition-all shadow-xl cursor-pointer">
                <Link href="#contact">Get Started</Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="flex rounded-full h-8 px-4 lg:h-14 lg:px-10 text-[8px] lg:text-sm text-foreground hover:bg-foreground/5 transition-all items-center gap-2 cursor-pointer">
                <Link href="#portfolio" className="flex items-center gap-2">
                  <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Play className="w-1.5 h-1.5 lg:w-3 lg:h-3 fill-current ml-0.5" />
                  </div>
                  See Our Work
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="apple-card p-0.5 lg:p-2 group">
              <div className="aspect-[4/3] relative rounded-[0.8rem] lg:rounded-[2.5rem] overflow-hidden">
                <Image 
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/apple-tech/1200/800"} 
                  alt="Modern Interface"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  data-ai-hint="modern dashboard"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                
                <div className="absolute top-2 right-2 lg:top-8 lg:right-8 apple-glass p-2 lg:p-4 rounded-lg lg:rounded-2xl items-center gap-1 lg:gap-3 animate-float flex">
                  <Globe className="w-3 h-3 lg:w-5 lg:h-5 text-primary" />
                  <span className="text-[6px] lg:text-[10px] font-bold text-foreground/80 uppercase tracking-[0.3em]">Network: Online</span>
                </div>

                <div className="absolute bottom-2 left-2 lg:bottom-8 lg:left-8 apple-glass p-2 lg:p-6 rounded-lg lg:rounded-2xl flex flex-col gap-1 lg:gap-2">
                  <span className="text-[5px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Processing Speed</span>
                  <div className="flex items-end gap-0.5 lg:gap-1.5">
                    <div className="w-0.5 h-1 lg:w-1.5 lg:h-4 bg-primary/40 rounded-full" />
                    <div className="w-0.5 h-2 lg:w-1.5 lg:h-8 bg-primary/60 rounded-full" />
                    <div className="w-0.5 h-3 lg:w-1.5 lg:h-12 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -inset-4 bg-primary/10 blur-[40px] lg:blur-[120px] rounded-full opacity-30 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
