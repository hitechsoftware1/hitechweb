
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Stats } from '@/components/sections/Stats';
import { Excellence } from '@/components/sections/Excellence';
import { User, Shield, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Architecting the <br /> Digital Future.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            HITECH is a premium software engineering firm based in Kampala, Uganda. We specialize in building high-performance systems for enterprises that define their industries.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="apple-card p-12 bg-primary/5 border-primary/10">
            <Target className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-headline font-bold mb-4">Our Mission</h3>
            <p className="text-foreground/60 leading-relaxed">
              To empower global innovators by providing the architectural foundations for world-class digital experiences. We believe in precision code, secure infrastructure, and sublime user experiences.
            </p>
          </div>
          <div className="apple-card p-12 bg-accent/5 border-accent/10">
            <Shield className="w-12 h-12 text-accent mb-6" />
            <h3 className="text-2xl font-headline font-bold mb-4">Our Standard</h3>
            <p className="text-foreground/60 leading-relaxed">
              Every system we build adheres to the HITECH standard: zero-trust security, high-speed performance, and infinite scalability. We don't just write code; we engineer value.
            </p>
          </div>
        </div>
      </section>

      <Stats />

      {/* Founder Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="apple-card p-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-64 h-64 rounded-[3rem] bg-muted flex items-center justify-center border-2 border-primary/20 overflow-hidden shadow-2xl">
              <User className="w-32 h-32 text-foreground/20" />
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl font-headline font-bold mb-2">JoelHitech</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Founder & CEO</p>
            <p className="text-xl text-foreground/70 font-light leading-relaxed italic mb-8">
              "Technology is only as strong as the architecture it stands upon. At HITECH, we are obsessed with the structural integrity of digital systems. We are building the engines that will power the next generation of African and global enterprises."
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground/40">
                <Award className="w-4 h-4" /> 10+ Years Engineering
              </div>
            </div>
          </div>
        </div>
      </section>

      <Excellence />
      
      <Footer />
    </main>
  );
}
