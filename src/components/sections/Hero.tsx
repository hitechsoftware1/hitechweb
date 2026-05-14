
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Shield, Rocket } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-8">
          <Badge variant="outline" className="bg-white/5 border-primary/30 text-primary py-1 px-4 rounded-full animate-bounce">
            <Zap className="w-3 h-3 mr-2" />
            Powering Next-Gen Enterprise
          </Badge>
          
          <h1 className="font-headline text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
            Engineering <span className="text-gradient-primary">Velocity</span> <br />
            For Digital Giants.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            HITECH delivers high-performance software, cloud, and AI architectures designed to scale. Experience precision-engineered digital products that drive impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg glow-primary">
              Explore Services <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/20 hover:bg-white/5">
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-4 border-t border-white/10 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Shield className="text-secondary w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">SOC2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="text-primary w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">99.9% Uptime</span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative glass-morphism rounded-3xl overflow-hidden aspect-square lg:aspect-video p-1 border-white/20 animate-float">
            <Image 
              src={heroImage?.imageUrl || "https://picsum.photos/seed/tech/800/600"} 
              alt="Futuristic Tech"
              fill
              className="object-cover rounded-2xl"
              data-ai-hint="futuristic networking"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="glass-morphism p-4 rounded-2xl">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Active Scale</p>
                <div className="flex gap-1">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="w-1 bg-primary rounded-full" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-2xl">
                <p className="text-3xl font-bold font-headline">250ms</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Global Latency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
