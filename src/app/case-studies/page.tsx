
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Zap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const studies = [
  {
    title: "Quantum Dashboard",
    client: "Global Finance Corp",
    challenge: "High-frequency trading required sub-5ms latency and real-time visualization of millions of data points.",
    solution: "Developed a custom WebGL-powered rendering engine with a distributed WebSocket cluster.",
    result: "Achieved 4.2ms latency and increased trader productivity by 40% globally.",
    tags: ["Fintech", "Real-time", "WebGL"],
    image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl
  },
  {
    title: "Lumina OS",
    client: "HealthNet Systems",
    challenge: "Traditional hospital management systems were slow and prone to error in patient resource allocation.",
    solution: "Implemented an AI-driven predictive triage system that optimizes nurse assignments.",
    result: "Reduced patient waiting times by 25% and improved diagnostic accuracy by 15%.",
    tags: ["HealthTech", "AI", "Cloud"],
    image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl
  }
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
          Engineering <br /> Truth.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
          Deep dives into the architectural challenges we've solved for market leaders.
        </p>
      </section>

      <div className="container mx-auto px-6 space-y-32 mb-32">
        {studies.map((study, idx) => (
          <section key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 block">Case Study // {study.client}</span>
                <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-6">{study.title}</h2>
                <div className="flex gap-3">
                  {study.tags.map((tag, t) => (
                    <span key={t} className="text-[10px] font-bold text-foreground/30 border border-foreground/10 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="apple-glass p-8 rounded-[2rem]">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/30 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> The Challenge
                  </h4>
                  <p className="text-lg text-foreground/70 font-light leading-relaxed">{study.challenge}</p>
                </div>
                <div className="apple-glass p-8 rounded-[2rem]">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Our Architecture
                  </h4>
                  <p className="text-lg text-foreground/70 font-light leading-relaxed">{study.solution}</p>
                </div>
                <div className="apple-glass p-8 rounded-[2rem] border-accent/20">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> The Impact
                  </h4>
                  <p className="text-lg text-foreground/70 font-light leading-relaxed">{study.result}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="sticky top-32"
            >
              <div className="apple-card p-2 rounded-[2.5rem]">
                <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden">
                  <Image src={study.image || ""} alt={study.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-4 text-white/80">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      <span className="font-bold tracking-widest uppercase text-xs">Mission Accomplished</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        ))}
      </div>

      <Footer />
    </main>
  );
}
