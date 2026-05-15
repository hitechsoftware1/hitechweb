
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Portfolio } from '@/components/sections/Portfolio';
import { Excellence } from '@/components/sections/Excellence';
import { Image as ImageIcon, ExternalLink, Github } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function PortfolioPage() {
  const showcase = [
    {
      title: "Quantum Dashboard",
      category: "Fintech",
      description: "A high-frequency trading dashboard with real-time liquidity analysis and automated risk management.",
      image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl,
      stats: ["4.2ms Latency", "99.9% Uptime", "ISO 27001"]
    },
    {
      title: "Lumina OS",
      category: "Healthcare",
      description: "An AI-powered patient management system that predicts resource needs and optimizes hospital workflows.",
      image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl,
      stats: ["HIPAA Compliant", "1M+ Patients", "95% Accuracy"]
    },
    {
      title: "Nexus Hub",
      category: "Industrial",
      description: "Cloud-native IoT platform for monitoring supply chain logistics across 12 countries.",
      image: PlaceHolderImages.find(i => i.id === 'project-3')?.imageUrl,
      stats: ["25k Concurrent", "IoT Ready", "Global Nodes"]
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
          System <br /> Showcase.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
          A selection of digital ecosystems engineered for high-performance enterprises.
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
              <h2 className="text-4xl font-headline font-bold mb-6">{project.title}</h2>
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
                  <ExternalLink className="w-4 h-4" /> Live System
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                  <Github className="w-4 h-4" /> Case Study
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
                    src={project.image || "https://video-previews.elements.envatousercontent.com/files/c369f1c0-97e8-45f7-98a9-647ac6b9fd61/video_preview_h264.mp4"} 
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
