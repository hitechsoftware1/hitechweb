
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, Cpu, Globe } from 'lucide-react';

const steps = [
  {
    title: "The Idea",
    description: "We talk about your goals to find the best way to build your project.",
    icon: Search,
    color: "text-blue-500"
  },
  {
    title: "Plan & Design",
    description: "We design how your app will look and how it will work.",
    icon: Layers,
    color: "text-primary"
  },
  {
    title: "Build & AI",
    description: "We write the code and add smart features to make it powerful.",
    icon: Cpu,
    color: "text-accent"
  },
  {
    title: "Launch",
    description: "We set up everything so your app is online and working perfectly.",
    icon: Globe,
    color: "text-green-500"
  }
];

export function Process() {
  return (
    <section className="py-12 lg:py-20 relative bg-background overflow-hidden border-y border-foreground/5">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 neural-grid opacity-20" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mb-4 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            Our Method
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            How We Build <br /> Your Project.
          </h2>
          <p className="text-sm lg:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            From the first chat to launch day, we follow a clear plan to make sure your project is a success.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-4 lg:p-10 flex flex-col gap-3 lg:gap-6 group hover:border-primary/30"
            >
              <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-foreground/5 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white ${step.color}`}>
                <step.icon className="w-4 h-4 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h4 className="text-sm lg:text-xl font-headline font-bold mb-1 lg:mb-2">{step.title}</h4>
                <p className="text-[10px] lg:text-sm text-foreground/50 font-light leading-relaxed line-clamp-3 lg:line-clamp-none">{step.description}</p>
              </div>
              <div className="mt-auto pt-4 lg:pt-6 text-[8px] lg:text-[10px] font-bold text-foreground/20 uppercase tracking-widest border-t border-foreground/5">
                Phase 0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
