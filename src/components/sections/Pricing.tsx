
"use client";

import React, { useState } from 'react';
import { Check, Zap, Rocket, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const tiers = [
  {
    name: "Startup Core",
    icon: Zap,
    monthly: "$2,499",
    annual: "$1,999",
    description: "Ideal for validation and MVP development stages.",
    features: [
      "Dedicated Product Manager",
      "2 Specialized Developers",
      "UI/UX Design Sprints",
      "CI/CD Pipeline Setup",
      "Weekly Progress Syncs"
    ],
    highlight: false
  },
  {
    name: "Growth Engine",
    icon: Rocket,
    monthly: "$5,999",
    annual: "$4,999",
    description: "Scaling fast? Get the momentum you need to dominate.",
    features: [
      "Full Stack Squad (4-6 Devs)",
      "Architecture & Cloud Lead",
      "24/7 SRE Support",
      "AI Strategy Integration",
      "Bi-weekly Stakeholder Review"
    ],
    highlight: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise Velocity",
    icon: Building2,
    monthly: "Custom",
    annual: "Custom",
    description: "Global infrastructure and dedicated 24/7 expert teams.",
    features: [
      "Dedicated R&D Department",
      "Compliance (SOC2/HIPAA)",
      "Legacy Transformation",
      "White-Glove Integration",
      "Fixed Performance SLAs"
    ],
    highlight: false
  }
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-6">Predictable <span className="text-gradient-primary">Investment</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Transparent pricing models for teams of all sizes. Choose the velocity that matches your business roadmap.
          </p>
          
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
            <Label htmlFor="pricing-toggle" className={`cursor-pointer transition-colors ${!isAnnual ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Monthly</Label>
            <Switch 
              id="pricing-toggle" 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual} 
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="pricing-toggle" className={`cursor-pointer transition-colors ${isAnnual ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Annual (Save 20%)</Label>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-3xl glass-morphism transition-all duration-500 flex flex-col h-full overflow-hidden ${tier.highlight ? 'border-primary shadow-[0_0_40px_rgba(15,214,237,0.1)] scale-105 z-10' : 'border-white/10 hover:border-white/30'}`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-xl px-4 py-1 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${tier.highlight ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-primary'}`}>
                  <tier.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-headline font-bold">{tier.name}</h3>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold font-headline">
                  {isAnnual ? tier.annual : tier.monthly}
                </span>
                {tier.monthly !== "Custom" && (
                  <span className="text-muted-foreground ml-2 text-lg">/mo</span>
                )}
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.highlight ? 'default' : 'outline'} 
                className={`w-full h-14 rounded-xl font-bold text-lg ${tier.highlight ? 'glow-primary' : 'hover:bg-white/5'}`}
              >
                {tier.name === "Enterprise Velocity" ? "Consult Sales" : "Get Started Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
