
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Filter } from 'lucide-react';

const categories = ["All", "Fintech", "Health", "E-commerce", "Industrial"];

const projects = [
  {
    title: "OmniPay Dashboard",
    category: "Fintech",
    image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl,
    metrics: "+40% Conversion",
    description: "Unified global payment processing suite with real-time fraud detection."
  },
  {
    title: "VitalTrack Cloud",
    category: "Health",
    image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl,
    metrics: "99.99% Latency",
    description: "HIPAA compliant IoT platform for remote patient monitoring at scale."
  },
  {
    title: "SmartFab OS",
    category: "Industrial",
    image: PlaceHolderImages.find(i => i.id === 'project-3')?.imageUrl,
    metrics: "-25% Downtime",
    description: "AI-driven preventive maintenance for global manufacturing plants."
  }
];

export function Portfolio() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = activeTab === "All" 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Our Work</span>
            <h2 className="text-4xl lg:text-6xl font-headline font-bold">Project <span className="text-gradient-primary">Showcase</span></h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${activeTab === cat ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-primary/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="group relative rounded-3xl overflow-hidden glass-morphism border-white/10 animate-in fade-in zoom-in duration-500">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image 
                  src={project.image || ""} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-8 relative z-10 -mt-16 bg-gradient-to-t from-background to-transparent pt-20">
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="text-secondary border-secondary/30">{project.category}</Badge>
                  <span className="text-xs font-bold text-primary animate-pulse">{project.metrics}</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
