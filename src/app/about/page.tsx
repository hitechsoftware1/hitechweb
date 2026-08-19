
"use client";

import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Stats } from '@/components/sections/Stats';
import { Excellence } from '@/components/sections/Excellence';
import { User, Shield, Target, Award, Milestone, Rocket, Users, Heart } from 'lucide-react';
import { useSiteConfig } from '@/hooks/use-site-config';

export default function AboutPage() {
  const { config } = useSiteConfig();
  const timeline = [
    { year: '2020', title: 'The Start', desc: 'JoelHitech founded the firm in Kampala with a vision to build better software for business.' },
    { year: '2021', title: 'Smart Systems', desc: 'Launched our first AI tools for hospitals to help with patient care.' },
    { year: '2022', title: 'Going Global', desc: 'Expanded our work to London and San Francisco, helping fintech companies with fast systems.' },
    { year: '2023', title: 'New Standards', desc: 'Released the HITECH Cloud Framework for secure and easy scaling.' },
    { year: '2024', title: 'AI Era', desc: 'Bringing smart AI assistants to all our clients around the world.' }
  ];

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 mb-12 lg:mb-24 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          >
            <source src="https://assets.mixkit.co/videos/99786/99786-720.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 neural-grid opacity-30" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Our Origin & Vision</span>
            <h1 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
              Building the <br /> Digital Future.
            </h1>
            <p className="text-base lg:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
              HITECH is a top software company that builds high-speed digital tools. We don't just make apps; we build strong systems for tomorrow's market leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 mb-24 lg:mb-32">
        <div className="grid grid-cols-2 gap-4 lg:gap-12">
          <div className="apple-card p-6 lg:p-12 bg-primary/5 border-primary/10">
            <Target className="w-8 h-8 lg:w-12 lg:h-12 text-primary mb-4 lg:mb-6" />
            <h3 className="text-sm lg:text-2xl font-headline font-bold mb-2 lg:mb-4">Our Mission</h3>
            <p className="text-[10px] lg:text-base text-foreground/60 leading-relaxed font-light line-clamp-4 lg:line-clamp-none">
              {config?.missionText || 'To help innovators by building world-class digital tools. We believe in clean code, secure setups, and great user experiences.'}
            </p>
          </div>
          <div className="apple-card p-6 lg:p-12 bg-accent/5 border-accent/10">
            <Shield className="w-8 h-8 lg:w-12 lg:h-12 text-accent mb-4 lg:mb-6" />
            <h3 className="text-sm lg:text-2xl font-headline font-bold mb-2 lg:mb-4">Our Standard</h3>
            <p className="text-[10px] lg:text-base text-foreground/60 leading-relaxed font-light line-clamp-4 lg:line-clamp-none">
              {config?.standardText || 'Every system we build is safe, fast, and ready to grow. we are focused on making things work perfectly.'}
            </p>
          </div>
        </div>
      </section>

      <Stats />

      {/* Timeline Section */}
      <section className="container mx-auto px-6 py-12 lg:py-24 border-y border-foreground/5 mb-24 lg:mb-32">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-2xl lg:text-3xl font-headline font-bold mb-4">The Journey.</h2>
          <p className="text-sm lg:text-base text-foreground/40 font-light">From a small studio to a global software firm.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-4 lg:gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-foreground/5 flex items-center justify-center font-headline font-bold text-sm lg:text-base text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {item.year}
                </div>
                <div className="w-[1px] lg:w-[2px] h-full bg-foreground/5 group-last:hidden" />
              </div>
              <div className="pb-8 lg:pb-12">
                <h4 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">{item.title}</h4>
                <p className="text-xs lg:text-base text-foreground/50 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="container mx-auto px-6 py-12 lg:py-24 mb-24 lg:mb-32">
        <div className="apple-card p-6 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-[2rem] lg:rounded-[3rem] bg-muted flex items-center justify-center border-2 border-primary/20 overflow-hidden shadow-2xl relative">
              {config?.founderImage ? (
                <Image src={config.founderImage} alt={config?.founderName || 'Founder'} fill className="object-cover" />
              ) : (
                <User className="w-24 h-24 lg:w-32 lg:h-32 text-foreground/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
          <div className="md:col-span-8 text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-headline font-bold mb-1 lg:mb-2">{config?.founderName || 'JoelHitech'}</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-xs lg:text-sm mb-4 lg:mb-6">{config?.founderTitle || 'Founder & CEO'}</p>
            <p className="text-base lg:text-xl text-foreground/70 font-light leading-relaxed italic mb-8">
              "{config?.founderQuote || 'Technology is only as strong as the foundation it stands upon. At HITECH, we focus on making digital systems work perfectly. We are building the tools that will power businesses for years to come.'}"
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 lg:gap-8">
              <div className="flex items-center gap-2 text-[10px] lg:text-sm font-bold text-foreground/40 uppercase tracking-wider">
                <Award className="w-4 h-4 text-primary" /> 10+ Years Building
              </div>
              <div className="flex items-center gap-2 text-[10px] lg:text-sm font-bold text-foreground/40 uppercase tracking-wider">
                <Milestone className="w-4 h-4 text-primary" /> 200+ Projects
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
