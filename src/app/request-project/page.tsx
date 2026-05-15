
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const projectTypes = [
  { id: 'web', name: 'Web Platform', icon: Globe },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone },
  { id: 'ai', name: 'AI Solutions', icon: Brain },
  { id: 'cloud', name: 'Cloud Infrastructure', icon: Zap }
];

export default function RequestProjectPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24 text-center">
        <h1 className="text-5xl lg:text-7xl font-headline font-bold text-gradient-apple mb-6 tracking-tight">
          Request a <br /> Project.
        </h1>
        <p className="text-xl text-foreground/50 font-light max-w-2xl mx-auto">
          Tell us about your vision. Our solutions architect will contact you within 24 hours.
        </p>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="max-w-3xl mx-auto">
          
          <div className="apple-card p-10 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-foreground/5">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-4">Vision Received.</h3>
                  <p className="text-foreground/50 mb-10">Our engineering lead, JoelHitech, is reviewing your submission.</p>
                  <Button asChild className="rounded-full px-10 h-12">
                    <Link href="/">Return Home</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-12">
                  
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 01</h4>
                        <h3 className="text-3xl font-headline font-bold">Select Project Type</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {projectTypes.map((type) => (
                          <button 
                            key={type.id}
                            className="apple-glass p-8 rounded-3xl flex flex-col items-center gap-4 hover:border-primary/50 transition-all border-foreground/5"
                          >
                            <type.icon className="w-8 h-8 text-primary" />
                            <span className="font-bold text-sm">{type.name}</span>
                          </button>
                        ))}
                      </div>
                      <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-foreground text-background font-bold group">
                        Continue <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 02</h4>
                        <h3 className="text-3xl font-headline font-bold">Project Details</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/40">Budget Range</Label>
                          <select className="w-full h-14 bg-background border border-foreground/10 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>$5k - $10k</option>
                            <option>$10k - $25k</option>
                            <option>$25k - $50k</option>
                            <option>$50k+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/40">Timeline</Label>
                          <select className="w-full h-14 bg-background border border-foreground/10 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>1 - 3 Months</option>
                            <option>3 - 6 Months</option>
                            <option>6+ Months</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/40">Description</Label>
                          <Textarea className="min-h-[150px] rounded-2xl p-4" placeholder="Tell us what you're building..." />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl">Back</Button>
                        <Button onClick={nextStep} className="flex-[2] h-14 rounded-2xl bg-foreground text-background font-bold">Next</Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 03</h4>
                        <h3 className="text-3xl font-headline font-bold">Contact Info</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-foreground/40">Full Name</Label>
                            <Input className="h-14 rounded-2xl" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-foreground/40">Work Email</Label>
                            <Input className="h-14 rounded-2xl" placeholder="john@company.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-foreground/40">Company Name</Label>
                          <Input className="h-14 rounded-2xl" placeholder="Acme Inc." />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl">Back</Button>
                        <Button onClick={() => setSubmitted(true)} className="flex-[2] h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 group">
                          Launch Inquiry <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
