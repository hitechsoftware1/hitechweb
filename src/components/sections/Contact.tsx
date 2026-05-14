"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

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
    <section id="contact" className="py-12 lg:py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-3 block">Let's Talk</span>
            <h2 className="text-3xl lg:text-5xl font-headline font-bold mb-6">Ready to Scale Your <span className="text-gradient-primary">Innovation?</span></h2>
            <p className="text-base lg:text-lg text-white/50 mb-8 font-light leading-relaxed">
              Our engineering experts are ready to help you navigate the complexities of modern software development.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Email Us</p>
                  <p className="text-lg font-medium text-white/90">hello@hitech.software</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Global Call</p>
                  <p className="text-lg font-medium text-white/90">+1 (555) 902-3000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Headquarters</p>
                  <p className="text-lg font-medium text-white/90">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full" />
            <div className="relative apple-glass p-8 lg:p-10 rounded-[2rem] border-white/10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-16 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                    <CheckCircle2 className="text-primary w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4">Inquiry Received</h3>
                  <p className="text-white/50 text-sm">Our solutions architect will contact you within 4 business hours.</p>
                  <Button variant="link" onClick={() => setSubmitted(false)} className="mt-8 text-primary font-bold">Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="mb-2">
                        <h4 className="text-xl font-bold font-headline mb-1">Basic Information</h4>
                        <p className="text-xs text-white/30">Start your journey with HITECH.</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Full Name</Label>
                          <Input className="bg-white/5 border-white/10 h-11 text-sm rounded-xl focus:ring-primary/50" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Work Email</Label>
                          <Input type="email" className="bg-white/5 border-white/10 h-11 text-sm rounded-xl focus:ring-primary/50" placeholder="john@company.com" required />
                        </div>
                      </div>
                      <Button onClick={nextStep} type="button" className="w-full h-11 rounded-xl bg-white text-background hover:bg-white/90 font-bold text-sm transition-all">Next Step</Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="mb-2">
                        <h4 className="text-xl font-bold font-headline mb-1">Project Scope</h4>
                        <p className="text-xs text-white/30">Tell us about your requirements.</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Estimated Budget</Label>
                          <select className="w-full h-11 bg-[#1A1F1F] border border-white/10 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-white/80">
                            <option>$50k - $100k</option>
                            <option>$100k - $250k</option>
                            <option>$250k - $500k</option>
                            <option>$500k+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Brief Description</Label>
                          <textarea className="w-full bg-white/5 border-white/10 rounded-xl p-3 h-28 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none text-white/80" placeholder="Tell us about your project goals..." required />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={prevStep} type="button" variant="outline" className="flex-1 h-11 rounded-xl border-white/10 hover:bg-white/5 text-sm font-bold">Back</Button>
                        <Button type="submit" className="flex-[2] h-11 rounded-xl bg-white text-background hover:bg-white/90 font-bold text-sm shadow-xl shadow-white/5 transition-all">Submit Inquiry</Button>
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
