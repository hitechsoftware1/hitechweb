
"use client";

import React from 'react';
import { Cloud, BrainCircuit, Code, Smartphone, Database, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Cloud Infrastructure",
    description: "Multi-cloud architecture, serverless implementation, and automated scaling for enterprise loads.",
    icon: Cloud,
    color: "from-blue-500/20 to-cyan-500/20",
    specs: ["AWS/Azure/GCP", "Kubernetes", "DevOps Pipeline"]
  },
  {
    title: "Generative AI",
    description: "Custom LLM fine-tuning, retrieval-augmented generation (RAG), and agentic workflows.",
    icon: BrainCircuit,
    color: "from-purple-500/20 to-pink-500/20",
    specs: ["Custom LLMs", "Semantic Search", "AI Agents"]
  },
  {
    title: "Web Engineering",
    description: "High-performance React/Next.js platforms with focused optimization for web vitals.",
    icon: Code,
    color: "from-green-500/20 to-emerald-500/20",
    specs: ["Next.js 15", "TypeScript", "Edge Runtime"]
  },
  {
    title: "Mobile Ecosystems",
    description: "Cross-platform mobile applications that provide native performance with web-like updates.",
    icon: Smartphone,
    color: "from-orange-500/20 to-red-500/20",
    specs: ["React Native", "Flutter", "Push Engine"]
  },
  {
    title: "Big Data Systems",
    description: "Real-time data streaming and warehouse solutions for processing terabytes of information.",
    icon: Database,
    color: "from-yellow-500/20 to-amber-500/20",
    specs: ["Snowflake", "Apache Kafka", "ETL Jobs"]
  },
  {
    title: "Cyber Security",
    description: "Zero-trust architecture and automated vulnerability scanning for modern threats.",
    icon: Lock,
    color: "from-indigo-500/20 to-violet-500/20",
    specs: ["Zero Trust", "IAM", "Encryption"]
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Our Expertise</span>
          <h2 className="text-4xl lg:text-6xl font-headline font-bold">Cutting-Edge Solutions</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            We don't just build software. We engineer competitive advantages through technological excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Card key={idx} className="glass-morphism border-white/5 hover:border-primary/50 transition-all duration-500 group overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <service.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors">{service.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground/80 group-hover:text-white transition-colors">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.specs.map((spec, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {spec}
                    </span>
                  ))}
                </div>
                <Button variant="link" className="p-0 h-auto text-primary group-hover:translate-x-2 transition-transform">
                  Learn More <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
