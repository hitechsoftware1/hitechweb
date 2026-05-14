
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Let's Talk</span>
            <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-8">Ready to Scale Your <span className="text-gradient-primary">Innovation?</span></h2>
            <p className="text-xl text-muted-foreground mb-12">
              Our engineering experts are ready to help you navigate the complexities of modern software development.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Email Us</p>
                  <p className="text-xl font-medium">hello@hitech.software</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Global Call</p>
                  <p className="text-xl font-medium">+1 (555) 902-3000</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Headquarters</p>
                  <p className="text-xl font-medium">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
            <div className="relative glass-morphism p-10 rounded-[2.5rem] border-white/10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-20 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-secondary w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-4">Inquiry Received</h3>
                  <p className="text-muted-foreground">Our solutions architect will contact you within 4 business hours.</p>
                  <Button variant="link" onClick={() => setSubmitted(false)} className="mt-8 text-primary">Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <h4 className="text-2xl font-bold font-headline">Basic Information</h4>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input className="bg-white/5 border-white/10 h-12" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Work Email</Label>
                          <Input type="email" className="bg-white/5 border-white/10 h-12" placeholder="john@company.com" required />
                        </div>
                      </div>
                      <Button onClick={nextStep} type="button" className="w-full h-12 rounded-xl glow-primary font-bold">Next Step</Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <h4 className="text-2xl font-bold font-headline">Project Scope</h4>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Estimated Budget</Label>
                          <select className="w-full h-12 bg-[#1A1F1F] border border-white/10 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                            <option>$50k - $100k</option>
                            <option>$100k - $250k</option>
                            <option>$250k - $500k</option>
                            <option>$500k+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Brief Description</Label>
                          <textarea className="w-full bg-white/5 border-white/10 rounded-lg p-3 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Tell us about your project goals..." required />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={prevStep} type="button" variant="outline" className="flex-1 h-12 rounded-xl">Back</Button>
                        <Button type="submit" className="flex-[2] h-12 rounded-xl glow-primary font-bold">Submit Inquiry</Button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
