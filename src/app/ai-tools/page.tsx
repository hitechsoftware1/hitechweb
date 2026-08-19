
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
import { cn } from '@/lib/utils';

const tools = [
  {
    title: "Smart Chat Systems",
    description: "Business chatbots that know your products and can help customers 24/7 with perfect accuracy.",
    icon: MessageSquare,
    features: ["Easy to use", "Works in many languages", "24/7 Support", "Secure"],
    color: "text-blue-500"
  },
  {
    title: "Process Helper",
    description: "Automatic tools that handle daily tasks for you, saving time and reducing mistakes.",
    icon: Workflow,
    features: ["Smart logic", "Fast work", "Easy setup", "Very reliable"],
    color: "text-purple-500"
  },
  {
    title: "Smart Insights",
    description: "AI that looks at your data to help you see trends and make better business decisions.",
    icon: BrainCircuit,
    features: ["Sees trends", "Risk alerts", "Real-time info", "Accurate data"],
    color: "text-emerald-500"
  },
  {
    title: "Vision Tools",
    description: "Smart cameras and tools that can see and track inventory, security, or help with medical scans.",
    icon: Cpu,
    features: ["Track objects", "Safe login", "Fast scans", "Smart sensors"],
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
          <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Smart AI <br /> Tools.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            HITECH builds easy-to-use AI tools that help businesses manage data and help customers better.
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
                  <p className="text-sm font-bold">HITECH Neural Engine</p>
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
              <h2 className="text-3xl font-headline font-bold mb-8">Easy <br /> Setup.</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Connected Systems</h4>
                    <p className="text-foreground/50 font-light">Add smart features to your current apps easily with our high-speed connection points.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Safe Data</h4>
                    <p className="text-foreground/50 font-light">We make sure your data stays yours. Every AI tool is set up within your own secure space.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="apple-card p-12 bg-primary/5 border-primary/20">
              <pre className="text-xs font-code text-primary leading-loose">
{`// HITECH Smart API Example
const hitech = require('@hitech/ai');

const helper = await hitech.addHelper({
  model: 'hitech-neural-v2',
  safety: 'high',
  vault: 'your-secure-docs'
});

const result = await helper.ask(
  "How is my business doing?"
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
