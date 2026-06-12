
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Excellence } from '@/components/sections/Excellence';
import { ExternalLink, Github } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const showcase = [
    {
      title: "Quantum Dashboard",
      category: "Fintech",
      description: "A fast trading dashboard that helps users see market data in real-time and manage risks easily.",
      image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl,
      stats: ["Very Fast", "Always Online", "Safe"]
    },
    {
      title: "Lumina OS",
      category: "Healthcare",
      description: "An AI system that helps hospitals manage patient care and resources better.",
      image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl,
      stats: ["Secure", "1M+ Users", "95% Accurate"]
    },
    {
      title: "Nexus Hub",
      category: "Industrial",
      description: "A platform for tracking deliveries and logistics across 12 countries.",
      image: PlaceHolderImages.find(i => i.id === 'project-3')?.imageUrl,
      stats: ["Reliable", "Real-time", "Global"]
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
          Our <br /> Work.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
          Check out some of the great systems we have built for our clients.
        </p>
      </section>

      <section className="container mx-auto px-6 space-y-24 mb-32">
        {showcase.map((project, idx) => (
          <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={cn(
              "order-2 lg:order-1",
              idx % 2 === 1 ? "lg:order-2" : "lg:order-1"
            )}>
              <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">{project.category}</span>
              <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-6">{project.title}</h2>
              <p className="text-xl text-foreground/60 leading-relaxed mb-8">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {project.stats.map((stat, s) => (
                  <div key={s} className="px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/40">
                    {stat}
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" /> View Site
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                  <Github className="w-4 h-4" /> Details
                </button>
              </div>
            </div>
            <div className={cn(
              "order-1 lg:order-2",
              idx % 2 === 1 ? "lg:order-1" : "lg:order-2"
            )}>
              <div className="apple-card p-2 group">
                <div className="aspect-[16/10] relative rounded-[2rem] overflow-hidden">
                  <Image 
                    src={project.image || "https://picsum.photos/seed/project/1200/800"} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Excellence />
      
      <Footer />
    </main>
  );
}
