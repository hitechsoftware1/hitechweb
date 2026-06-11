
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Globe, 
  Github, 
  Linkedin,
  User,
  Star,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const team = [
  {
    name: "JoelHitech Lubega",
    role: "Founder & Chief Architect",
    bio: "Visionary programmer and serial entrepreneur focused on high-performance digital engines and structural integrity.",
    skills: ["Architecture", "Scalability", "Neural Systems"],
    initials: "JL",
    image: "https://i.pinimg.com/736x/34/f8/10/34f81022af3da1b3d60d0fa4315de706.jpg"
  },
  {
    name: "Cole Amri Kitalikibi",
    role: "Full Stack Engineer",
    bio: "Specialist in low-latency API development and cloud-native application logic.",
    skills: ["React", "Node.js", "Cloud-Native"],
    initials: "CK"
  },
  {
    name: "Rumanzi Regan",
    role: "UI/UX Designer",
    bio: "Architecting visual systems that define the next generation of enterprise user experiences.",
    skills: ["Design Systems", "Framer", "Product Logic"],
    initials: "RR"
  },
  {
    name: "Kabaale Micheal",
    role: "Graphics & Content",
    bio: "Translating complex technical concepts into sublime visual narratives.",
    skills: ["Visual Comms", "Asset Optimization"],
    initials: "KM"
  }
];

export default function TeamPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Personnel Ledger</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            The Neural <br /> Collective.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            Meet the architects, engineers, and designers responsible for the HITECH engineering standard.
          </p>
        </motion.div>
      </section>

      {/* Leadership Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="apple-card p-8 lg:p-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-primary/5 border-primary/10">
          <div className="lg:col-span-4">
            <div className="aspect-square relative rounded-[2.5rem] overflow-hidden border-2 border-primary/20 shadow-2xl group">
              <Image 
                src={team[0].image!} 
                alt={team[0].name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Chief Architect</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-4">{team[0].name}</h2>
            <p className="text-xl lg:text-2xl text-foreground/70 font-light italic mb-8 leading-relaxed">
              "{team[0].bio}"
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {team[0].skills.map(skill => (
                <span key={skill} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-xl border-foreground/10 hover:bg-foreground/5 flex items-center gap-2 h-12 px-6 font-bold">
                <Linkedin className="w-4 h-4" /> Profile
              </Button>
              <Button variant="outline" className="rounded-xl border-foreground/10 hover:bg-foreground/5 flex items-center gap-2 h-12 px-6 font-bold">
                <Github className="w-4 h-4" /> Architecture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Grid */}
      <section className="container mx-auto px-6 mb-32">
        <div className="mb-16">
          <h3 className="text-2xl font-headline font-bold">Engineers & Designers</h3>
          <p className="text-foreground/40 font-light">The core contributors powering our technical throughput.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.slice(1).map((member, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-10 flex flex-col justify-between group hover:border-primary/30"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 border border-foreground/5 transition-all group-hover:bg-primary group-hover:text-white">
                  <span className="text-xl font-bold font-headline">{member.initials}</span>
                </div>
                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">{member.role}</p>
                <p className="text-foreground/50 font-light leading-relaxed mb-8">
                  {member.bio}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-md bg-foreground/5 text-foreground/40 text-[8px] font-bold uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission / Environment */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-8">Engineering <br /> Environment.</h2>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Neural Workspace</h4>
                    <p className="text-foreground/50 font-light leading-relaxed">Our Kampala HQ is optimized for deep focus and collaborative architecture, powered by local culture and global connectivity.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Zero-Trust Standard</h4>
                    <p className="text-foreground/50 font-light leading-relaxed">Every developer adheres to the HITECH security standard: mandatory code reviews, zero-trust protocols, and encrypted CI/CD pipelines.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="apple-card p-2 rounded-[2.5rem]">
               <div className="aspect-video relative rounded-[2rem] overflow-hidden">
                  <Image src="https://picsum.photos/seed/hitech-office/1200/800" alt="Office" fill className="object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-8 left-8">
                     <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2">Location: Naalya Studio</p>
                     <p className="text-xl font-bold font-headline">HITECH HQ // KAMPALA</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
