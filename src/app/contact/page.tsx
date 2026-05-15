
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Contact } from '@/components/sections/Contact';
import { Mail, Phone, MapPin, MessageCircle, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
          Connect.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
          Speak with our engineering leads to discuss your project requirements or strategic goals.
        </p>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="apple-card p-10 flex flex-col gap-6">
            <Mail className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">Email</h3>
              <p className="text-foreground/60">hitechsoftware03@gmail.com</p>
              <p className="text-xs text-foreground/30 mt-1 uppercase tracking-widest">24h Response Goal</p>
            </div>
          </div>
          <div className="apple-card p-10 flex flex-col gap-6">
            <Phone className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">Phone</h3>
              <p className="text-foreground/60">+256 742 928 508</p>
              <p className="text-xs text-foreground/30 mt-1 uppercase tracking-widest">Mon - Fri, 9am - 6pm</p>
            </div>
          </div>
          <div className="apple-card p-10 flex flex-col gap-6">
            <MapPin className="w-10 h-10 text-primary" />
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">Studio</h3>
              <p className="text-foreground/60">Naalya Kampala, Uganda</p>
              <p className="text-xs text-foreground/30 mt-1 uppercase tracking-widest">Engineering HQ</p>
            </div>
          </div>
        </div>

        <Contact />
      </div>

      {/* Global Presence */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 mb-32">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-8 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
            <Globe className="w-4 h-4" /> Global Reach
          </div>
          <h2 className="text-4xl font-headline font-bold mb-12">HITECH is remote-first, <br /> global-ready.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mb-2">East Africa</p>
              <p className="text-xl font-bold">Kampala, UG</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mb-2">West Africa</p>
              <p className="text-xl font-bold">Lagos, NG</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mb-2">Europe</p>
              <p className="text-xl font-bold">London, UK</p>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest mb-2">North America</p>
              <p className="text-xl font-bold">San Francisco, US</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
