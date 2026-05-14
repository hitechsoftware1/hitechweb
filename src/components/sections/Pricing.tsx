"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const tiers = [
  {
    name: "Foundation",
    price: "$2,499",
    description: "Perfect for high-growth startups and validation phases.",
    features: ["Dedicated Lead", "UX Architecture", "CI/CD Pipeline", "Weekly Syncs"]
  },
  {
    name: "Velocity",
    price: "$5,999",
    description: "The complete engineering squad for rapid scale.",
    features: ["Full Stack Team", "SRE Support", "AI Integration", "Performance SLAs"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Global infrastructure for the world's leading brands.",
    features: ["Global R&D", "Compliance Suite", "Legacy Migration", "24/7 Concierge"]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl lg:text-7xl font-headline font-bold text-gradient-apple mb-8">Investment.</h2>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-light">
            Transparent pricing models for teams that value speed and precision.
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} tier={tier} />
          ))}
        </div>

        {/* Mobile/Tablet Carousel View */}
        <div className="lg:hidden -mx-6">
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full px-6">
            <CarouselContent className="-ml-4">
              {tiers.map((tier, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-[85%] sm:basis-[50%]">
                  <PricingCard tier={tier} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: typeof tiers[0] & { popular?: boolean } }) {
  return (
    <div 
      className={`apple-card p-10 flex flex-col h-full ${tier.popular ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}
    >
      <div className="mb-8 flex justify-between items-start">
        <h3 className="text-2xl font-headline font-bold">{tier.name}</h3>
        {tier.popular && <Badge className="bg-primary text-white rounded-full px-3 py-1">Popular</Badge>}
      </div>

      <div className="mb-10">
        <span className="text-5xl font-bold font-headline">{tier.price}</span>
        {tier.price !== "Custom" && <span className="text-white/40 text-sm ml-2">/ month</span>}
        <p className="text-white/40 mt-6 text-sm leading-relaxed font-light">
          {tier.description}
        </p>
      </div>

      <div className="space-y-4 mb-12 flex-grow">
        {tier.features.map((feature, fIdx) => (
          <div key={fIdx} className="flex items-center gap-3">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/70">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={tier.popular ? 'default' : 'outline'} 
        className={`w-full h-12 rounded-full font-bold ${tier.popular ? 'bg-white text-background hover:bg-white/90' : 'border-white/10 hover:bg-white/5'}`}
      >
        {tier.price === "Custom" ? "Consult Sales" : "Begin Project"}
      </Button>
    </div>
  );
}
