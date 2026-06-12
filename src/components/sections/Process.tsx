
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, Cpu, Globe } from 'lucide-react';

const steps = [
  {
    title: "Discovery Protocol",
    description: "Deep-dive analysis of your enterprise ecosystem and technical hurdles.",
    icon: Search,
    color: "text-blue-500"
  },
  {
    title: "System Architecture",
    description: "Engineering the structural foundations for infinite scalability.",
    icon: Layers,
    color: "text-primary"
  },
  {
    title: "Neural Implementation",
    description: "Integrating advanced AI reasoning engines and secure logic layers.",
    icon: Cpu,
    color: "text-accent"
  },
  {
    title: "Global Deployment",
    description: "Launching on high-performance regional nodes with sub-10ms latency.",
    icon: Globe,
    color: "text-green-500"
  }
];

export function Process() {
  return (
    <section className="py-24 lg:py-32 relative bg-background overflow-hidden border-y border-foreground/5">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 neural-grid opacity-20" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 text-primary text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            <div className="w-8 h-[1px] bg-primary" />
            The HITECH Method
          </motion.div>
          <h2 className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Our Engineering <br /> Lifecycle.
          </h2>
          <p className="text-sm lg:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            From initial audit to global scale, we follow a rigorous protocol to ensure structural integrity and elite performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-8 lg:p-10 flex flex-col gap-6 group hover:border-primary/30"
            >
              <div className={`w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-headline font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-foreground/50 font-light leading-relaxed">{step.description}</p>
              </div>
              <div className="mt-auto pt-6 text-[10px] font-bold text-foreground/20 uppercase tracking-widest border-t border-foreground/5">
                Phase 0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
