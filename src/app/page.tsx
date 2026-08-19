
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { Excellence } from '@/components/sections/Excellence';
import { Process } from '@/components/sections/Process';
import { Portfolio } from '@/components/sections/Portfolio';
import { MarketplaceShowcase } from '@/components/sections/MarketplaceShowcase';

import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { MouseFollower } from '@/components/ui/mouse-follower';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

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

      <MarketplaceShowcase />

      <div id="contact" className="relative">
        <Contact />
      </div>

      <Footer />

      {/* Floating Chat Button - Positioned above Mobile Nav */}
      <FloatingWhatsApp />
    </main>
  );
}
