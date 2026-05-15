
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Stats } from '@/components/sections/Stats';
import { Excellence } from '@/components/sections/Excellence';
import { User, Shield, Target, Award, Milestone, Rocket, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  const timeline = [
    { year: '2020', title: 'The Genesis', desc: 'JoelHitech founded the firm in Kampala with a vision to revolutionize enterprise architecture in East Africa.' },
    { year: '2021', title: 'Neural Expansion', desc: 'Launched the first proprietary AI engine for automated triage in healthcare systems.' },
    { year: '2022', title: 'Global Reach', desc: 'Expanded operations to London and San Francisco, supporting fintech leaders with low-latency rails.' },
    { year: '2023', title: 'Ecosystem v3.0', desc: 'Released the HITECH Cloud Framework, a zero-trust deployment standard for scaling enterprises.' },
    { year: '2024', title: 'Intelligence Era', desc: 'Deploying Gemini-powered neural consultants across our global client base.' }
  ];

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 mb-24 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-city-at-night-aerial-view-3331-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 neural-grid opacity-30" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Our Origin & Vision</span>
            <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
              Architecting the <br /> Digital Future.
            </h1>
            <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
              HITECH is a premium software engineering firm specializing in high-performance digital ecosystems. We don't just build apps; we engineer the structural integrity of tomorrow's market leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="apple-card p-12 bg-primary/5 border-primary/10">
            <Target className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-headline font-bold mb-4">Our Mission</h3>
            <p className="text-foreground/60 leading-relaxed font-light">
              To empower global innovators by providing the architectural foundations for world-class digital experiences. We believe in precision code, secure infrastructure, and sublime user experiences.
            </p>
          </div>
          <div className="apple-card p-12 bg-accent/5 border-accent/10">
            <Shield className="w-12 h-12 text-accent mb-6" />
            <h3 className="text-2xl font-headline font-bold mb-4">Our Standard</h3>
            <p className="text-foreground/60 leading-relaxed font-light">
              Every system we build adheres to the HITECH standard: zero-trust security, high-speed performance, and infinite scalability. We are obsessed with structural integrity.
            </p>
          </div>
        </div>
      </section>

      <Stats />

      {/* Timeline Section */}
      <section className="container mx-auto px-6 py-24 border-y border-foreground/5 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-headline font-bold mb-4">The Journey.</h2>
          <p className="text-foreground/40 font-light">From a Kampala studio to a global engineering authority.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center font-headline font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  {item.year}
                </div>
                <div className="w-[2px] h-full bg-foreground/5 group-last:hidden" />
              </div>
              <div className="pb-12">
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-foreground/50 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="container mx-auto px-6 py-24 mb-32">
        <div className="apple-card p-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-64 h-64 rounded-[3rem] bg-muted flex items-center justify-center border-2 border-primary/20 overflow-hidden shadow-2xl relative">
              <User className="w-32 h-32 text-foreground/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl font-headline font-bold mb-2">JoelHitech</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Founder & Chief Architect</p>
            <p className="text-xl text-foreground/70 font-light leading-relaxed italic mb-8">
              "Technology is only as strong as the architecture it stands upon. At HITECH, we are obsessed with the structural integrity of digital systems. We are building the engines that will power the next generation of African and global enterprises."
            </p>
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground/40">
                <Award className="w-4 h-4 text-primary" /> 10+ Years Engineering
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground/40">
                <Milestone className="w-4 h-4 text-primary" /> 200+ Projects Scaled
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
