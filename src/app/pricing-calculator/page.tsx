
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Sparkles, Check, Info } from 'lucide-react';

const features = [
  { id: 'mobile', name: 'Mobile App (iOS/Android)', base: 2500, icon: '📱' },
  { id: 'ecommerce', name: 'E-commerce Integration', base: 1500, icon: '🛒' },
  { id: 'ai', name: 'AI & Neural Systems', base: 3000, icon: '🧠' },
  { id: 'auth', name: 'Advanced Security (Auth)', base: 800, icon: '🔐' },
  { id: 'cloud', name: 'Cloud Infrastructure', base: 1200, icon: '☁️' },
  { id: 'analytics', name: 'Real-time Analytics', base: 1000, icon: '📊' }
];

export default function PricingCalculator() {
  const [selections, setSelections] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const featureSum = features
      .filter(f => selections.includes(f.id))
      .reduce((acc, f) => acc + f.base, 0);
    
    const complexityMultiplier = 1 + (complexity - 1) * 0.5;
    const calculatedTotal = (2000 + featureSum) * complexityMultiplier;
    setTotal(calculatedTotal);
  }, [selections, complexity]);

  const toggleFeature = (id: string) => {
    setSelections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <h1 className="text-5xl lg:text-8xl font-headline font-bold text-gradient-apple mb-8 tracking-tight text-center">
          Invest in <br /> Value.
        </h1>
        <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto text-center">
          Calculate the estimated investment for your next high-performance digital ecosystem.
        </p>
      </section>

      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          <div className="lg:col-span-7 space-y-10">
            <div className="apple-card p-10 bg-foreground/[0.02] border-foreground/5">
              <h3 className="text-2xl font-headline font-bold mb-8 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-primary" /> Feature Selection
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map(feature => (
                  <div 
                    key={feature.id} 
                    onClick={() => toggleFeature(feature.id)}
                    className={cn(
                      "p-6 rounded-[1.5rem] border transition-all cursor-pointer flex flex-col gap-3",
                      selections.includes(feature.id) 
                        ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5" 
                        : "bg-background border-foreground/5 hover:border-foreground/10"
                    )}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm">{feature.name}</h4>
                      <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">Base: ${feature.base}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-card p-10 bg-foreground/[0.02] border-foreground/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-headline font-bold">Project Complexity</h3>
                <Badge variant="outline" className="text-primary font-bold">Level {complexity}</Badge>
              </div>
              <Slider 
                defaultValue={[1]} 
                max={5} 
                min={1} 
                step={1} 
                onValueChange={(v) => setComplexity(v[0])}
                className="mb-6"
              />
              <div className="flex justify-between text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                <span>Startup MVP</span>
                <span>Enterprise Scale</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-32">
            <div className="apple-card p-10 bg-primary/5 border-primary/20 glow-blue">
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-10">Estimate Breakdown</h3>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/40">Core Architecture Fee</span>
                  <span className="font-bold">$2,000</span>
                </div>
                {features.filter(f => selections.includes(f.id)).map(f => (
                  <div key={f.id} className="flex justify-between text-sm">
                    <span className="text-foreground/40">{f.name}</span>
                    <span className="font-bold">+${f.base}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm text-primary">
                  <span>Complexity Multiplier</span>
                  <span className="font-bold">x{(1 + (complexity - 1) * 0.5).toFixed(1)}</span>
                </div>
                <div className="pt-6 border-t border-primary/20 flex justify-between items-end">
                  <span className="text-lg font-bold">Estimated Total</span>
                  <span className="text-4xl font-headline font-bold text-gradient-apple">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full rounded-full h-14 bg-foreground text-background font-bold hover:scale-105 transition-all text-sm">
                  Get Detailed Proposal
                </Button>
                <p className="text-[10px] text-center text-foreground/30 leading-relaxed">
                  *This is an estimate. Final pricing depends on technical specs and project duration.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
