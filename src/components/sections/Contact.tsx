
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, CheckCircle2, MessageCircle, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function Contact() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    budget: 'below$5k - $5k',
    message: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);

    const messageData = {
      ...formData,
      status: 'unread',
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save to Firestore for Dashboard
      await addDoc(collection(db, 'contactMessages'), messageData);

      // 2. Transmit via Mail Bridge to hitechsoftware03@gmail.com
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...messageData, type: "Contact Message" }),
      });

      setSubmitted(true);
      toast({
        title: "Received.",
        description: "We will contact you soon.",
      });
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: 'contactMessages',
        operation: 'create',
        requestResourceData: messageData,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setLoading(false);
    }
  };

  const gmailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=hitechsoftware03@gmail.com";

  return (
    <section id="contact" className="py-12 lg:py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[8px] lg:text-[10px] mb-2 lg:mb-4 block">Let's Talk</span>
            <h2 className="text-3xl lg:text-5xl font-headline font-bold mb-4 lg:mb-8 leading-tight text-foreground">Ready to Build Your <br className="hidden lg:block" /> <span className="text-primary">Next Project?</span></h2>
            <p className="text-sm lg:text-lg text-foreground/50 mb-8 lg:mb-12 font-light leading-relaxed">
              Our experts are ready to help you build great software. Reach out today and let's get started.
            </p>

            <div className="space-y-4 lg:space-y-8">
              <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer decoration-transparent hover:decoration-transparent">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10 group-hover:border-primary/50 transition-colors">
                  <Mail className="text-primary w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <p className="text-[8px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Email Us</p>
                  <p className="text-xs lg:text-lg font-medium text-foreground/90">hitechsoftware03@gmail.com</p>
                </div>
              </a>
              <a href="tel:+256742928508" className="flex items-center gap-4 group cursor-pointer decoration-transparent hover:decoration-transparent">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10 group-hover:border-primary/50 transition-colors">
                  <Phone className="text-primary w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <p className="text-[8px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Call Us</p>
                  <p className="text-xs lg:text-lg font-medium text-foreground/90">+256 742 928 508</p>
                </div>
              </a>
              <a href="https://wa.me/256759408917" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer decoration-transparent hover:decoration-transparent">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10 group-hover:border-primary/50 transition-colors">
                  <MessageCircle className="text-primary w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <p className="text-[8px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">WhatsApp</p>
                  <p className="text-xs lg:text-lg font-medium text-foreground/90">+256 759 408 917</p>
                </div>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full" />
            <div className="relative apple-glass p-8 lg:p-12 rounded-[2rem] border-foreground/10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 lg:py-20 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 lg:mb-10 border border-primary/20">
                    <CheckCircle2 className="text-primary w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-headline font-bold mb-4 text-foreground">Received.</h3>
                  <p className="text-foreground/50 text-sm lg:text-base">We will contact you soon.</p>
                  <Button variant="link" onClick={() => { setSubmitted(false); setStep(1); }} className="mt-8 lg:mt-12 text-primary font-bold text-xs lg:text-sm p-0 h-auto">Send another</Button>
                </div>
              ) : (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6 lg:space-y-8">
                  {step === 1 && (
                    <div className="space-y-4 lg:space-y-8 animate-in fade-in slide-in-from-right-4">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-bold font-headline mb-1 text-foreground">Basic Info</h4>
                        <p className="text-xs lg:text-sm text-foreground/30 font-medium">Let's get started with your details.</p>
                      </div>
                      <div className="grid gap-4 lg:gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Full Name</Label>
                          <Input 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="bg-foreground/5 border-foreground/10 h-12 lg:h-14 text-sm lg:text-base rounded-xl lg:rounded-2xl focus:ring-primary/50 text-foreground" 
                            placeholder="Your name" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Work Email</Label>
                          <Input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-foreground/5 border-foreground/10 h-12 lg:h-14 text-sm lg:text-base rounded-xl lg:rounded-2xl focus:ring-primary/50 text-foreground" 
                            placeholder="email@company.com" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone Number
                          </Label>
                          <Input 
                            type="tel" 
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            className="bg-foreground/5 border-foreground/10 h-12 lg:h-14 text-sm lg:text-base rounded-xl lg:rounded-2xl focus:ring-primary/50 text-foreground" 
                            placeholder="+256 ..." 
                            required 
                          />
                        </div>
                      </div>
                      <Button onClick={nextStep} type="button" className="w-full h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-foreground text-background hover:opacity-90 font-bold text-sm lg:text-base transition-all">Next</Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 lg:space-y-8 animate-in fade-in slide-in-from-right-4">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-bold font-headline mb-1 text-foreground">Project Details</h4>
                        <p className="text-xs lg:text-sm text-foreground/30 font-medium">Tell us more about what you need.</p>
                      </div>
                      <div className="grid gap-4 lg:gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Budget</Label>
                          <select 
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            className="w-full h-12 lg:h-14 bg-background border border-foreground/10 rounded-xl lg:rounded-2xl px-4 focus:outline-none focus:ring-1 focus:ring-primary text-sm lg:text-base text-foreground"
                          >
                            <option>below$5k - $5k</option>
                            <option>$5k - $10k</option>
                            <option>$10k - $25k</option>
                            <option>$25k - $50k</option>
                            <option>$50k - $100k</option>
                            <option>$100k+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Message / Goals</Label>
                          <textarea 
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-foreground/5 border-foreground/10 rounded-xl lg:rounded-2xl p-4 h-24 lg:h-32 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-primary resize-none text-foreground" 
                            placeholder="What are your goals for this project?" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={prevStep} type="button" variant="outline" className="flex-1 h-12 lg:h-14 rounded-xl lg:rounded-2xl border-foreground/10 hover:bg-foreground/5 text-sm lg:text-base font-bold text-foreground">Back</Button>
                        <Button 
                          onClick={handleSubmit}
                          disabled={loading || !formData.message}
                          className="flex-[2] h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-foreground text-background hover:opacity-90 font-bold text-sm lg:text-base shadow-xl shadow-foreground/5 transition-all"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                        </Button>
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
