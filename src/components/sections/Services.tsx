"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Cloud, Brain, Smartphone, Shield, Zap } from 'lucide-react';

const services = [
  {
    title: "Cloud Infrastructure",
    description: "Elastic, high-availability architecture designed for global scale.",
    icon: Cloud,
    tag: "Scale"
  },
  {
    title: "Intelligence & AI",
    description: "Neural workflows that automate complex enterprise logic.",
    icon: Brain,
    tag: "Automate"
  },
  {
    title: "Modern Platforms",
    description: "Sub-second performance for high-traffic web ecosystems.",
    icon: Cpu,
    tag: "Speed"
  },
  {
    title: "Security Core",
    description: "Zero-trust protocols to protect critical digital assets.",
    icon: Shield,
    tag: "Protected"
  },
  {
    title: "Mobile Experiences",
    description: "Refined native performance for the palm of your hand.",
    icon: Smartphone,
    tag: "Refined"
  },
  {
    title: "Strategic R&D",
    description: "Future-proofing your technology stack for what's next.",
    icon: Zap,
    tag: "Vision"
  }
];

export function Services() {
  return (
    <section id="services" className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-6 text-primary text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            <div className="w-8 h-[1px] bg-primary" />
            Capabilities
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Designed for <br />
            Performance.
          </h2>
          <p className="text-xl text-white/50 font-light leading-relaxed">
            We minimize complexity to maximize impact. Every line of code is written with surgical precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="apple-card p-10 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-white group-hover:text-background">
                <service.icon className="w-6 h-6" />
              </div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{service.tag}</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-4">{service.title}</h3>
              <p className="text-white/40 leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}