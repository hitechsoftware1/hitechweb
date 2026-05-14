
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

const projects = [
  {
    title: "Quantum Dashboard",
    category: "Fintech",
    image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl,
    metrics: "4.2ms Latency"
  },
  {
    title: "Lumina OS",
    category: "Health",
    image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl,
    metrics: "HIPAA Compliant"
  },
  {
    title: "Nexus Hub",
    category: "Industrial",
    image: PlaceHolderImages.find(i => i.id === 'project-3')?.imageUrl,
    metrics: "25k Concurrent"
  }
];

export function Portfolio() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="portfolio" className="py-24 lg:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-12 lg:mb-24 text-center md:text-left">
          <h2 className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight">Showcase.</h2>
          <p className="text-sm lg:text-xl text-white/40 max-w-2xl font-light mx-auto md:mx-0">
            Exceptional solutions delivered for industry-leading organizations.
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>

        {/* Mobile Automatic 3D Floating Carousel */}
        <div className="md:hidden perspective-1000">
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
              {projects.map((project, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-[80%] sm:basis-[60%]">
                  <motion.div
                    animate={{
                      scale: current === idx ? 1.05 : 0.85,
                      opacity: current === idx ? 1 : 0.4,
                      y: current === idx ? [0, -15, 0] : 0,
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                    }}
                    className={cn(
                      "transition-all duration-700",
                      current === idx && "drop-shadow-[0_20px_50px_rgba(0,113,227,0.4)]"
                    )}
                  >
                    <ProjectCard project={project} isMobile />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {projects.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  current === idx ? "w-8 bg-primary" : "w-2 bg-white/10"
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, isMobile }: { project: any, isMobile?: boolean }) {
  return (
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

      <div className={cn(
        "flex-grow flex flex-col justify-between",
        isMobile ? "p-5" : "p-4 lg:p-10"
      )}>
        <div>
          <div className="flex justify-between items-center mb-2 lg:mb-6">
            <Badge variant="outline" className="text-[7px] lg:text-[10px] font-bold text-primary border-primary/20 uppercase tracking-widest">{project.category}</Badge>
            <span className="text-[7px] lg:text-[10px] font-bold text-white/30 uppercase tracking-widest">{project.metrics}</span>
          </div>
          <h3 className={cn(
            "font-headline font-bold text-white mb-1",
            isMobile ? "text-lg" : "text-base lg:text-2xl"
          )}>{project.title}</h3>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-white/40 font-light mt-4",
          isMobile ? "text-[10px]" : "text-[9px] lg:text-sm"
        )}>
          View Case Study <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
        </div>
      </div>
    </div>
  );
}
