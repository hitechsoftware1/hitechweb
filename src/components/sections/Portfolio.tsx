"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
  return (
    <section id="portfolio" className="py-24 lg:py-32 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight">Showcase.</h2>
          <p className="text-base lg:text-xl text-white/40 max-w-2xl font-light">
            Exceptional solutions delivered for industry-leading organizations.
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden -mx-6">
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full px-6">
            <CarouselContent className="-ml-4">
              {projects.map((project, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-[90%]">
                  <ProjectCard project={project} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="apple-card group overflow-hidden h-full flex flex-col"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <Image 
          src={project.image || ""} 
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all" />
      </div>

      <div className="p-6 lg:p-10 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <Badge variant="outline" className="text-[8px] lg:text-[10px] font-bold text-primary border-primary/20 uppercase tracking-widest">{project.category}</Badge>
            <span className="text-[8px] lg:text-[10px] font-bold text-white/30 uppercase tracking-widest">{project.metrics}</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-headline font-bold text-white mb-2">{project.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs lg:text-sm font-light mt-4 lg:mt-6">
          View Case Study <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
