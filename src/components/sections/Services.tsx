
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, BrainCircuit, Code, Smartphone, Database, Lock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Quantum Cloud",
    description: "Highly resilient multi-cloud architectures with automated failover and elastic scaling.",
    icon: Cloud,
    color: "from-blue-500/30 to-cyan-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(37,99,235,0.2)]",
    specs: ["Global Mesh", "Auto-Scaling", "Edge Delivery"]
  },
  {
    title: "Neural Engine AI",
    description: "Advanced machine learning models and RAG workflows designed for industrial precision.",
    icon: BrainCircuit,
    color: "from-purple-500/30 to-pink-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]",
    specs: ["Custom Training", "Agentic Ops", "LLM Fine-tuning"]
  },
  {
    title: "Velocity Web",
    description: "Ultra-fast Next.js platforms optimized for sub-second performance and SEO dominance.",
    icon: Code,
    color: "from-emerald-500/30 to-green-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]",
    specs: ["Next.js 15 Core", "Rust Tooling", "Hydration Fixes"]
  },
  {
    title: "Mobile Synergy",
    description: "Cross-platform ecosystems that feel indistinguishable from native performance.",
    icon: Smartphone,
    color: "from-orange-500/30 to-red-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(249,115,22,0.2)]",
    specs: ["Expo Hybrid", "Native SDKs", "Real-time Sync"]
  },
  {
    title: "Core Data Hub",
    description: "Real-time data warehouses capable of processing petabytes with zero latency.",
    icon: Database,
    color: "from-yellow-500/30 to-amber-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(234,179,8,0.2)]",
    specs: ["Stream Analytics", "NoSQL Clusters", "BigQuery Ops"]
  },
  {
    title: "Iron Fortress",
    description: "Zero-trust security architecture for the world's most demanding enterprise clients.",
    icon: Lock,
    color: "from-indigo-500/30 to-violet-500/30",
    glow: "group-hover:shadow-[0_0_50px_rgba(99,102,241,0.2)]",
    specs: ["SOC3 Ready", "Biometric IAM", "E2E Encryption"]
  }
];

export function Services() {
  return (
    <section id="services" className="py-32 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24 gap-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black tracking-[0.5em] uppercase text-xs"
          >
            Digital Ecosystems
          </motion.span>
          <h2 className="text-6xl lg:text-8xl font-headline font-bold tracking-tighter">
            Next-Gen <span className="text-gradient-primary">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            We don't build websites. We build the future of your business through technological velocity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`glass-card group h-full border-white/5 ${service.glow} hover:-translate-y-2`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <CardHeader className="relative z-10 p-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-3xl font-headline mb-4 group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 p-10 pt-0">
                  <div className="flex flex-wrap gap-3 mb-10">
                    {service.specs.map((spec, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:border-primary/30 transition-all">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <Button variant="link" className="p-0 h-auto text-primary text-lg font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    System Specs <ChevronRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
