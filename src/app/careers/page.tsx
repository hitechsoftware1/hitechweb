
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Star, Heart, Rocket, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    type: "Full-time",
    location: "Kampala / Remote",
    department: "Engineering",
    description: "Architecting high-performance digital ecosystems using React and Node.js."
  },
  {
    title: "Product Designer",
    type: "Full-time",
    location: "Remote",
    department: "Design",
    description: "Defining the visual language of the next generation of enterprise software."
  },
  {
    title: "Cybersecurity Analyst",
    type: "Contract",
    location: "Kampala",
    department: "Security",
    description: "Ensuring zero-trust integrity for global digital platforms."
  },
  {
    title: "AI Engineer",
    type: "Full-time",
    location: "Remote",
    department: "Neural Systems",
    description: "Developing generative AI workflows and neural chat integrations."
  }
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Build the <br /> Extraordinary.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            Join a team of elite engineers and designers architecture the future of global enterprise systems.
          </p>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Rocket, title: "High Velocity", text: "We ship quality code fast, iterating on real-world feedback." },
            { icon: Heart, title: "Remote-First", text: "Global talent, local impact. Work from anywhere that inspires you." },
            { icon: Shield, title: "Precision", text: "We value structural integrity and clean, maintainable architecture." },
            { icon: Star, title: "Elite Peers", text: "Work alongside the best engineering minds in the region." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-10 flex flex-col gap-4"
            >
              <item.icon className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-headline font-bold">{item.title}</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Jobs List */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-headline font-bold">Open Positions</h2>
            <Badge variant="outline" className="rounded-full">{jobs.length} roles</Badge>
          </div>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="apple-glass p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/30 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">{job.department}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-foreground/40 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                  </div>
                </div>
                <Button className="rounded-full bg-foreground text-background group-hover:bg-primary group-hover:text-white transition-all">
                  Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
