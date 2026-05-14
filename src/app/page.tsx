
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { AIConsultant } from '@/components/sections/AIConsultant';
import { Portfolio } from '@/components/sections/Portfolio';
import { Pricing } from '@/components/sections/Pricing';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <Hero />
      <Stats />
      
      <div id="services">
        <Services />
      </div>

      <div id="ai-consultant" className="bg-gradient-to-b from-background via-primary/5 to-background">
        <AIConsultant />
      </div>

      <div id="portfolio">
        <Portfolio />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <div id="contact" className="bg-gradient-to-t from-background via-secondary/5 to-background">
        <Contact />
      </div>

      <Footer />

      {/* Floating Chat Button */}
      <Button className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl glow-primary z-50 p-0 flex items-center justify-center">
        <MessageCircle className="w-8 h-8" />
      </Button>
    </main>
  );
}
