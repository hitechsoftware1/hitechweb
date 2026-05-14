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
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 lg:gap-24 items-center max-w-6xl mx-auto">
          <div className="pr-2 lg:pr-0">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[7px] lg:text-[10px] mb-1 lg:mb-3 block">Let's Talk</span>
            <h2 className="text-xl lg:text-5xl font-headline font-bold mb-3 lg:mb-6 leading-tight">Ready to Scale Your <br className="lg:hidden" /> <span className="text-gradient-primary">Innovation?</span></h2>
            <p className="text-[9px] lg:text-lg text-white/50 mb-4 lg:mb-8 font-light leading-relaxed line-clamp-3 lg:line-clamp-none">
              Our engineering experts are ready to help you navigate the complexities of modern software development.
            </p>

            <div className="space-y-3 lg:space-y-6">
              <div className="flex items-center gap-2 lg:gap-4 group">
                <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Mail className="text-primary w-3 h-3 lg:w-5 lg:h-5" />
                </div>
                <div>
                  <p className="text-[6px] lg:text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Email Us</p>
                  <p className="text-[8px] lg:text-lg font-medium text-white/90 truncate max-w-[100px] lg:max-w-none">hello@hitech.software</p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4 group">
                <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Phone className="text-primary w-3 h-3 lg:w-5 lg:h-5" />
                </div>
                <div>
                  <p className="text-[6px] lg:text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Global Call</p>
                  <p className="text-[8px] lg:text-lg font-medium text-white/90">+1 (555) 902-3000</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-4 group">
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
            <div className="absolute inset-0 bg-primary/5 blur-[40px] lg:blur-[80px] rounded-full" />
            <div className="relative apple-glass p-4 lg:p-10 rounded-[1.5rem] lg:rounded-[2rem] border-white/10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-8 lg:py-16 animate-in zoom-in duration-500">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-primary/20">
                    <CheckCircle2 className="text-primary w-5 h-5 lg:w-8 lg:h-8" />
                  </div>
                  <h3 className="text-lg lg:text-2xl font-headline font-bold mb-2 lg:mb-4">Inquiry Received</h3>
                  <p className="text-white/50 text-[8px] lg:text-sm">Our solutions architect will contact you soon.</p>
                  <Button variant="link" onClick={() => setSubmitted(false)} className="mt-4 lg:mt-8 text-primary font-bold text-[10px] lg:text-sm p-0 h-auto">Send another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                  {step === 1 && (
                    <div className="space-y-3 lg:space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="mb-1 lg:mb-2">
                        <h4 className="text-xs lg:text-xl font-bold font-headline mb-0.5 lg:mb-1">Basic Info</h4>
                        <p className="text-[7px] lg:text-xs text-white/30">Start your journey.</p>
                      </div>
                      <div className="grid gap-2 lg:gap-4">
                        <div className="space-y-1 lg:space-y-2">
                          <Label className="text-[6px] lg:text-[10px] uppercase tracking-widest text-white/40">Full Name</Label>
                          <Input className="bg-white/5 border-white/10 h-7 lg:h-11 text-[9px] lg:text-sm rounded-lg lg:rounded-xl focus:ring-primary/50" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                          <Label className="text-[6px] lg:text-[10px] uppercase tracking-widest text-white/40">Work Email</Label>
                          <Input type="email" className="bg-white/5 border-white/10 h-7 lg:h-11 text-[9px] lg:text-sm rounded-lg lg:rounded-xl focus:ring-primary/50" placeholder="john@company.com" required />
                        </div>
                      </div>
                      <Button onClick={nextStep} type="button" className="w-full h-7 lg:h-11 rounded-lg lg:rounded-xl bg-white text-background hover:bg-white/90 font-bold text-[8px] lg:text-sm transition-all">Next</Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3 lg:space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="mb-1 lg:mb-2">
                        <h4 className="text-xs lg:text-xl font-bold font-headline mb-0.5 lg:mb-1">Project</h4>
                        <p className="text-[7px] lg:text-xs text-white/30">Scope details.</p>
                      </div>
                      <div className="grid gap-2 lg:gap-4">
                        <div className="space-y-1 lg:space-y-2">
                          <Label className="text-[6px] lg:text-[10px] uppercase tracking-widest text-white/40">Budget</Label>
                          <select className="w-full h-7 lg:h-11 bg-[#1A1F1F] border border-white/10 rounded-lg lg:rounded-xl px-2 lg:px-3 focus:outline-none focus:ring-1 focus:ring-primary text-[9px] lg:text-sm text-white/80">
                            <option>$50k - $100k</option>
                            <option>$100k - $250k</option>
                            <option>$250k - $500k</option>
                            <option>$500k+</option>
                          </select>
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                          <Label className="text-[6px] lg:text-[10px] uppercase tracking-widest text-white/40">Brief</Label>
                          <textarea className="w-full bg-white/5 border-white/10 rounded-lg lg:rounded-xl p-2 h-16 lg:h-28 text-[9px] lg:text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none text-white/80" placeholder="Goals..." required />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={prevStep} type="button" variant="outline" className="flex-1 h-7 lg:h-11 rounded-lg lg:rounded-xl border-white/10 hover:bg-white/5 text-[8px] lg:text-sm font-bold">Back</Button>
                        <Button type="submit" className="flex-[2] h-7 lg:h-11 rounded-lg lg:rounded-xl bg-white text-background hover:bg-white/90 font-bold text-[8px] lg:text-sm shadow-xl shadow-white/5 transition-all">Submit</Button>
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