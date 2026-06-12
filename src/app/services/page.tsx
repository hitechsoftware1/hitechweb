
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Services } from '@/components/sections/Services';
import { Excellence } from '@/components/sections/Excellence';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      {/* Hero Header with Video Background */}
      <section className="relative py-12 lg:py-24 mb-24 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-technological-particles-loop-background-20412-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 neural-grid opacity-30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            Our <br /> Services.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto">
            We build everything from custom business software to smart AI tools and mobile money systems.
          </p>
        </div>
      </section>

      <Services />

      {/* Tech Stack Section */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-headline font-bold mb-12 text-center">Tools We Use</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Websites", tech: "React, Next.js" },
                { name: "Mobile", tech: "Flutter, React Native" },
                { name: "Database", tech: "Safe & Secure Storage" },
                { name: "Cloud", tech: "Always Online Hosting" },
                { name: "AI Tools", tech: "Smart Automation" },
                { name: "Payments", tech: "Mobile Money & Cards" },
                { name: "Design", tech: "User Friendly UI" },
                { name: "Safety", tech: "Protected Access" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{item.name}</p>
                  <p className="text-sm font-medium text-foreground/70">{item.tech}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Excellence />

      <section className="py-24 container mx-auto px-6">
        <div className="apple-card p-12 bg-primary text-primary-foreground text-center">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-6">Ready to start?</h2>
          <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
            Our team is ready to help you build the right tools for your business.
          </p>
          <Button asChild size="lg" className="rounded-full bg-white text-primary font-bold hover:bg-white/90">
            <Link href="/request-project" className="flex items-center gap-2">
              Start Project <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
