
"use client";

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight">Investment.</h2>
          <p className="text-sm lg:text-xl text-white/40 max-w-2xl mx-auto font-light">
            Transparent pricing models for teams that value speed and precision.
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} tier={tier} />
          ))}
        </div>

        {/* Mobile Automatic 3D Floating Carousel */}
        <div className="lg:hidden">
          <Carousel 
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{ 
              align: "center",
              loop: true,
            }} 
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {tiers.map((tier, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-[80%] sm:basis-[50%]">
                  <motion.div
                    animate={{
                      scale: current === idx ? 1.05 : 0.9,
                      opacity: current === idx ? 1 : 0.5,
                      y: current === idx ? [0, -12, 0] : 0,
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      y: { repeat: Infinity, duration: 7, ease: "easeInOut" }
                    }}
                    className={cn(
                      "transition-all h-full duration-700",
                      current === idx && "drop-shadow-[0_20px_40px_rgba(0,113,227,0.3)]"
                    )}
                  >
                    <PricingCard tier={tier} isMobile />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          <div className="flex justify-center gap-2 mt-16">
            {tiers.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  current === idx ? "w-8 bg-primary" : "w-2 bg-white/10"
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, isMobile }: { tier: typeof tiers[0] & { popular?: boolean }, isMobile?: boolean }) {
  return (
    <div 
      className={cn(
        "apple-card flex flex-col h-full",
        tier.popular ? 'border-primary/40 ring-1 ring-primary/20' : '',
        isMobile ? "p-6" : "p-5 lg:p-10"
      )}
    >
      <div className="mb-4 lg:mb-8 flex justify-between items-start">
        <h3 className={cn("font-headline font-bold", isMobile ? "text-xl" : "text-base lg:text-2xl")}>{tier.name}</h3>
        {tier.popular && <Badge className="bg-primary text-white rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs">Popular</Badge>}
      </div>

      <div className="mb-4 lg:mb-10">
        <span className={cn("font-bold font-headline", isMobile ? "text-3xl" : "text-2xl lg:text-5xl")}>{tier.price}</span>
        {tier.price !== "Custom" && <span className="text-white/40 text-[10px] lg:text-sm ml-1">/ mo</span>}
        <p className="text-white/40 mt-3 lg:mt-6 text-[10px] lg:text-sm leading-relaxed font-light">
          {tier.description}
        </p>
      </div>

      <div className="space-y-3 lg:space-y-4 mb-8 lg:mb-12 flex-grow">
        {tier.features.map((feature, fIdx) => (
          <div key={fIdx} className="flex items-center gap-2 lg:gap-3">
            <Check className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
            <span className="text-[10px] lg:text-sm text-white/70">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={tier.popular ? 'default' : 'outline'} 
        className={cn(
          "w-full rounded-full font-bold",
          isMobile ? "h-11 text-xs" : "h-9 lg:h-12 text-[9px] lg:text-sm",
          tier.popular ? 'bg-white text-background hover:bg-white/90' : 'border-white/10 hover:bg-white/5'
        )}
      >
        {tier.price === "Custom" ? "Consult Sales" : "Begin Project"}
      </Button>
    </div>
  );
}
