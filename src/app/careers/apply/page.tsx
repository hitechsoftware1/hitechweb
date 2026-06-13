
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Upload, Send, ChevronLeft, Briefcase, FileText, User, Loader2, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  const [role, setRole] = useState(roleFromQuery || '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    portfolio: '',
    coverLetter: '',
  });

  useEffect(() => {
    if (roleFromQuery) setRole(roleFromQuery);
  }, [roleFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);
    
    const applicationData = {
      ...formData,
      role,
      status: 'applied',
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'jobApplications'), applicationData);

      // 2. Transmit via Mail Bridge
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...applicationData, type: "Job Application" }),
      });

      setSubmitted(true);
      toast({
        title: "Application Received",
        description: "We will contact you soon.",
      });
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: 'jobApplications',
        operation: 'create',
        requestResourceData: applicationData,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 mb-32">
      <div className="max-w-3xl mx-auto">
        <Link href="/careers" className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest mb-12">
          <ChevronLeft className="w-4 h-4" /> Back to Careers
        </Link>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="apple-card p-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-headline font-bold mb-4 text-foreground">Received.</h2>
              <p className="text-foreground/50 mb-10 max-w-md mx-auto">
                Thank you for applying. Our team will review your profile and contact you soon.
              </p>
              <Button asChild className="rounded-full px-10 h-12 bg-foreground text-background font-bold">
                <Link href="/">Back to Home</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-card p-8 lg:p-12"
            >
              <div className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-headline font-bold mb-2 text-foreground">Join the Team.</h2>
                <p className="text-foreground/40 text-sm font-medium">Applying for: <span className="text-primary font-bold">{role || 'selected'}</span></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </Label>
                    <Input 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Work Email
                    </Label>
                    <Input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                      placeholder="john@company.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </Label>
                    <Input 
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                      placeholder="+256 ..." 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Role
                    </Label>
                    <Input 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                      placeholder="e.g. Senior Developer" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Portfolio / LinkedIn / GitHub</Label>
                  <Input 
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                    placeholder="https://..." 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Cover Letter / Intro</Label>
                  <Textarea 
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="min-h-[150px] rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground" 
                    placeholder="Tell us about your work..." 
                    required 
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Resume / CV</Label>
                  <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <input type="file" className="hidden" id="resume-upload" />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-foreground/20 group-hover:text-primary mx-auto mb-4 transition-colors" />
                      <p className="text-sm font-bold mb-1 text-foreground">Click to upload your resume</p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-widest">PDF, DOCX (Max 10MB)</p>
                    </label>
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl shadow-foreground/5"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Submit Application <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CareerApplyPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      <section className="container mx-auto px-6 mb-12">
        <h1 className="text-4xl lg:text-5xl font-headline font-bold tracking-tight text-foreground">Apply Now.</h1>
      </section>
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center text-foreground/40 italic">Loading application form...</div>}>
        <ApplyFormContent />
      </Suspense>
      <Footer />
    </main>
  );
}
