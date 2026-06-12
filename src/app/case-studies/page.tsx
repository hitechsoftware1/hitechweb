
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
    client: "Global Finance",
    challenge: "High-speed trading needed very fast data updates and a simple way to see millions of data points.",
    solution: "We built a custom engine that handles data instantly and works smoothly for users.",
    result: "Achieved very low delay and increased trader productivity by 40%.",
    tags: ["Fintech", "Fast Data", "Clean UI"],
    image: PlaceHolderImages.find(i => i.id === 'project-1')?.imageUrl
  },
  {
    title: "Lumina OS",
    client: "Health Systems",
    challenge: "Older hospital systems were slow and made mistakes when assigning resources to patients.",
    solution: "We added smart AI that helps assign nurses and resources automatically based on patient needs.",
    result: "Reduced waiting times by 25% and improved accuracy by 15%.",
    tags: ["Health", "AI", "Cloud"],
    image: PlaceHolderImages.find(i => i.id === 'project-2')?.imageUrl
  }
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
          Successful <br /> Projects.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
          A deep look at how we solved tough problems for our clients.
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
                <h2 className="text-3xl lg:text-5xl font-headline font-bold mb-6">{study.title}</h2>
                <div className="flex gap-3">
                  {study.tags.map((tag, t) => (
                    <span key={t} className="text-[10px] font-bold text-foreground/30 border border-foreground/10 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="apple-glass p-8 rounded-[2rem]">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/30 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> The Problem
                  </h4>
                  <p className="text-lg text-foreground/70 font-light leading-relaxed">{study.challenge}</p>
                </div>
                <div className="apple-glass p-8 rounded-[2rem]">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Our Solution
                  </h4>
                  <p className="text-lg text-foreground/70 font-light leading-relaxed">{study.solution}</p>
                </div>
                <div className="apple-glass p-8 rounded-[2rem] border-accent/20">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> The Result
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
