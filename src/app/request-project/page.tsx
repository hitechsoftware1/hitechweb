
"use client";

import React, { useState, use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap,
  Smartphone,
  Globe,
  Brain,
  Loader2,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const projectTypes = [
  { id: 'web', name: 'Web Platform', icon: Globe },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone },
  { id: 'ai', name: 'AI Solutions', icon: Brain },
  { id: 'cloud', name: 'Cloud Infrastructure', icon: Zap }
];

export default function RequestProjectPage(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  // Unwrap params and searchParams for Next.js 15
  use(props.params);
  use(props.searchParams);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const db = useFirestore();

  const [formData, setFormData] = useState({
    projectType: '',
    budget: '$5k - $10k',
    timeline: '1 - 3 Months',
    description: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    company: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!db) return;
    setLoading(true);

    const inquiryData = {
      ...formData,
      status: 'new',
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'projectInquiries'), inquiryData);

      // 2. Transmit via Mail Bridge
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inquiryData, type: "Project Inquiry" }),
      });

      setSubmitted(true);
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: 'projectInquiries',
        operation: 'create',
        requestResourceData: inquiryData,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12 lg:mb-24 text-center">
        <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-6 tracking-tight">
          Request a <br /> Project.
        </h1>
        <p className="text-base lg:text-xl text-foreground/50 font-light max-w-2xl mx-auto">
          Tell us about your idea. We will reach out to you within 24 hours.
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
                  <h3 className="text-2xl lg:text-3xl font-headline font-bold mb-4 text-foreground">Received.</h3>
                  <p className="text-foreground/50 mb-10">We will contact you soon to discuss your project.</p>
                  <Button asChild className="rounded-full px-10 h-12 bg-foreground text-background font-bold">
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
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 01</h4>
                        <h3 className="text-2xl lg:text-3xl font-headline font-bold text-foreground">Select Project Type</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {projectTypes.map((type) => (
                          <button 
                            key={type.id}
                            onClick={() => setFormData({ ...formData, projectType: type.id })}
                            className={`apple-glass p-8 rounded-3xl flex flex-col items-center gap-4 transition-all border ${formData.projectType === type.id ? 'border-primary bg-primary/5' : 'border-foreground/5 hover:border-primary/50'}`}
                          >
                            <type.icon className={`w-8 h-8 ${formData.projectType === type.id ? 'text-primary' : 'text-foreground/40'}`} />
                            <span className="font-bold text-sm text-foreground">{type.name}</span>
                          </button>
                        ))}
                      </div>
                      <Button 
                        disabled={!formData.projectType}
                        onClick={nextStep} 
                        className="w-full h-14 rounded-2xl bg-foreground text-background font-bold group"
                      >
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
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 02</h4>
                        <h3 className="text-2xl lg:text-3xl font-headline font-bold text-foreground">Project Details</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Budget Range</Label>
                          <select 
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full h-14 bg-background border border-foreground/10 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                          >
                            <option>$5k - $10k</option>
                            <option>$10k - $25k</option>
                            <option>$25k - $50k</option>
                            <option>$50k+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Timeline</Label>
                          <select 
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            className="w-full h-14 bg-background border border-foreground/10 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                          >
                            <option>1 - 3 Months</option>
                            <option>3 - 6 Months</option>
                            <option>6+ Months</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Description</Label>
                          <Textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="min-h-[150px] rounded-2xl p-4 bg-background border-foreground/10 text-foreground" 
                            placeholder="Tell us what you want to build..." 
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl border-foreground/10 text-foreground">Back</Button>
                        <Button disabled={!formData.description} onClick={nextStep} className="flex-[2] h-14 rounded-2xl bg-foreground text-background font-bold">Next</Button>
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
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Step 03</h4>
                        <h3 className="text-2xl lg:text-3xl font-headline font-bold text-foreground">Contact Info</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Full Name</Label>
                            <Input 
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="h-14 rounded-2xl bg-background border-foreground/10 text-foreground" 
                              placeholder="John Doe" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Work Email</Label>
                            <Input 
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="h-14 rounded-2xl bg-background border-foreground/10 text-foreground" 
                              placeholder="john@company.com" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center gap-2">
                              <Phone className="w-3 h-3" /> Phone Number
                            </Label>
                            <Input 
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                              className="h-14 rounded-2xl bg-background border-foreground/10 text-foreground" 
                              placeholder="+256 ..." 
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Company Name</Label>
                            <Input 
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="h-14 rounded-2xl bg-background border-foreground/10 text-foreground" 
                              placeholder="Acme Inc." 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl border-foreground/10 text-foreground">Back</Button>
                        <Button 
                          disabled={loading || !formData.fullName || !formData.email || !formData.phoneNumber}
                          onClick={handleSubmit} 
                          className="flex-[2] h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 group"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                              Submit Request <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
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
