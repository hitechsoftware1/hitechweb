
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  MessageSquare, 
  Workflow, 
  Sparkles, 
  Cpu, 
  Zap, 
  ShieldCheck,
  ArrowRight,
  Code2,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const tools = [
  {
    title: "Neural Chat Systems",
    description: "Industry-specific AI chatbots trained on your internal documentation for ultra-precise customer interactions.",
    icon: MessageSquare,
    features: ["Gemini 2.5 Core", "RAG Integration", "Multi-lingual", "24/7 Ops"],
    color: "text-blue-500"
  },
  {
    title: "Process Automator",
    description: "Intelligent workflow automation that understands context, making decisions previously requiring human oversight.",
    icon: Workflow,
    features: ["Logic Chains", "Error Recovery", "API Orchestration", "Smart Triggers"],
    color: "text-purple-500"
  },
  {
    title: "Predictive Analytics",
    description: "Advanced ML models that forecast demand, risk, and user behavior with institutional-grade accuracy.",
    icon: BrainCircuit,
    features: ["Anomaly Detection", "Trend Analysis", "Risk Scoring", "Real-time Data"],
    color: "text-emerald-500"
  },
  {
    title: "Vision Systems",
    description: "Computer vision for security, inventory tracking, and medical diagnostics using neural edge processing.",
    icon: Cpu,
    features: ["Object Tracking", "Facial Identity", "OFT Scanning", "Edge Compute"],
    color: "text-amber-500"
  }
];

export default function AIToolsPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Intelligence Division</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Neural <br /> Infrastructure.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            HITECH designs and deploys sophisticated AI agents that redefine how enterprises interact with data and customers.
          </p>
        </motion.div>
      </section>

      {/* Tools Showcase */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-12 group hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-10">
                <div className={cn("w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white", tool.color)}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Architecture</p>
                  <p className="text-sm font-bold">Llama 3 / Gemini</p>
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-headline font-bold mb-4">{tool.title}</h3>
              <p className="text-foreground/50 leading-relaxed font-light mb-10 text-lg">{tool.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {tool.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    {feat}
                  </div>
                ))}
              </div>

              <Button variant="link" className="p-0 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Technical Specs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Philosophy */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-8">Seamless <br /> Deployment.</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">API First</h4>
                    <p className="text-foreground/50 font-light">Integrate neural capabilities into your existing stack with our high-performance REST and GraphQL endpoints.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Data Integrity</h4>
                    <p className="text-foreground/50 font-light">We ensure your data stays your data. Every AI model is deployed within your secure cloud perimeter.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="apple-card p-12 bg-primary/5 border-primary/20">
              <pre className="text-xs font-code text-primary leading-loose">
{`// HITECH Neural API Example
const hitech = require('@hitech/ai');

const agent = await hitech.deployAgent({
  model: 'gemini-pro',
  security: 'zero-trust',
  dataUri: 's3://your-docs-vault'
});

const response = await agent.query(
  "Predict Q4 revenue leakage..."
);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
