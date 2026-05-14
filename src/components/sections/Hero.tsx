
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Shield, Rocket, Cpu, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TypingText } from '@/components/ui/typing-text';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden neural-grid">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-secondary/10 blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start gap-8"
          >
            <Badge variant="outline" className="bg-white/5 border-primary/40 text-primary py-2 px-6 rounded-full glass-morphism flex items-center gap-2 group cursor-pointer hover:border-primary">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="font-bold tracking-wider">HITECH CORE v3.0 IS LIVE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Badge>
            
            <h1 className="font-headline text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tighter">
              Transforming Ideas Into <br />
              <TypingText 
                texts={["Intelligent", "Scalable", "Futuristic", "Powerful"]} 
                className="text-gradient-primary"
              /> <br />
              Solutions.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-light">
              HITECH engineers high-velocity digital ecosystems. We build the architecture that allows digital giants to dominate the next era of innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg glow-primary bg-primary text-primary-foreground font-bold hover:scale-105 transition-all">
                Launch Project <Rocket className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-white/20 glass-morphism hover:bg-white/10 transition-all">
                Watch System Architecture
              </Button>
            </div>

            <div className="flex items-center gap-12 pt-8 border-t border-white/10 w-full">
              <div className="flex items-center gap-3">
                <Shield className="text-primary w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Security</p>
                  <p className="text-sm font-bold">Enterprise Grade</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Cpu className="text-secondary w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compute</p>
                  <p className="text-sm font-bold">Real-time AI Edge</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[100px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative glass-card p-2 group-hover:rotate-1 transition-transform duration-700 animate-float">
              <div className="aspect-[4/3] lg:aspect-video relative rounded-[1.8rem] overflow-hidden">
                <Image 
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/tech/1200/800"} 
                  alt="Futuristic Interface"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority
                  data-ai-hint="futuristic dashboard"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute top-8 left-8 glass-morphism p-4 rounded-2xl border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Core Engine Active</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute bottom-8 right-8 glass-morphism p-4 rounded-2xl border-secondary/20"
                >
                  <p className="text-3xl font-bold font-headline leading-none">99.9%</p>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase">Uptime Stability</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
