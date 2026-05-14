
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { Excellence } from '@/components/sections/Excellence';
import { AIConsultant } from '@/components/sections/AIConsultant';
import { Portfolio } from '@/components/sections/Portfolio';
import { Pricing } from '@/components/sections/Pricing';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MouseFollower } from '@/components/ui/mouse-follower';

export default function Home() {
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

      <div id="ai-consultant" className="relative">
        <AIConsultant />
      </div>

      <div id="portfolio">
        <Portfolio />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <div id="contact" className="relative">
        <Contact />
      </div>

      <Footer />

      {/* Floating Chat Button */}
      <Button className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl glow-primary z-50 p-0 flex items-center justify-center hover:scale-110 transition-transform bg-primary text-primary-foreground">
        <MessageCircle className="w-8 h-8" />
      </Button>
    </main>
  );
}
