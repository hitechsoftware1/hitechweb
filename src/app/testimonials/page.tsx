
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Alexander Wright",
    role: "CTO, Global Finance",
    text: "HITECH didn't just build a dashboard; they engineered a sub-5ms liquidity engine that transformed our trading floor. Their architectural precision is unmatched.",
    stars: 5,
    project: "Quantum Core"
  },
  {
    name: "Dr. Sarah Chen",
    role: "Director, HealthNet Systems",
    text: "The AI triage system Joel and his team deployed has reduced our emergency response times by 30%. It's stable, intelligent, and sublime in its execution.",
    stars: 5,
    project: "Lumina OS"
  },
  {
    name: "Marcus Thorne",
    role: "VP Operations, Nexus Hub",
    text: "Scaling across 12 countries seemed impossible until HITECH architected our cloud infrastructure. Zero downtime, total control.",
    stars: 5,
    project: "Global Supply Chain"
  }
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Trust.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto">
            Feedback from industry leaders who have achieved the extraordinary with HITECH.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-10 relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
              <div className="flex gap-1 mb-8">
                {[...Array(test.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xl font-light leading-relaxed mb-10 text-foreground/80 italic">
                "{test.text}"
              </p>
              <div className="flex items-center gap-4 pt-8 border-t border-foreground/5">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/10">
                  <User className="w-6 h-6 text-foreground/40" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{test.name}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{test.role}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 text-primary" /> System: {test.project}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brands Wall */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.5em] mb-12">Validated by global leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            {['Finance', 'Health', 'Industrial', 'Gov', 'Logistics', 'Retail'].map((brand, i) => (
              <div key={i} className="font-headline font-bold text-2xl tracking-tighter">
                {brand} <span className="text-primary">.</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
