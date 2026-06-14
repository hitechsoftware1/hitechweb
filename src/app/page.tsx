
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { Excellence } from '@/components/sections/Excellence';
import { Process } from '@/components/sections/Process';
import { Portfolio } from '@/components/sections/Portfolio';

import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { MessageCircle } from 'lucide-react';
import { MouseFollower } from '@/components/ui/mouse-follower';

export default async function Home(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  // Unwrap params and searchParams for Next.js 15
  await props.params;
  await props.searchParams;

  return (
    <main className="min-h-screen relative">
      <MouseFollower />
      <Navbar />
      
      <Hero />
      <Stats />
      
      <div id="services">
        <Services />
      </div>

      <Excellence />

      <div id="process" className="relative">
        <Process />
      </div>

      <div id="portfolio">
        <Portfolio />
      </div>

  

      <div id="contact" className="relative">
        <Contact />
      </div>

      <Footer />

      {/* Floating Chat Button - Positioned above Mobile Nav */}
      <a 
        href="https://wa.me/256759408917" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl glow-primary z-50 flex items-center justify-center hover:scale-110 transition-transform bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 duration-300 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </main>
  );
}
