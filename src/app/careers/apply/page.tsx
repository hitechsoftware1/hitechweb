
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
import { CheckCircle2, Upload, Send, ChevronLeft, Briefcase, FileText, User, Loader2 } from 'lucide-react';
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

    addDoc(collection(db, 'jobApplications'), applicationData)
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        toast({
          title: "Application Submitted",
          description: "Your technical profile has been uploaded to our recruitment cluster.",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'jobApplications',
          operation: 'create',
          requestResourceData: applicationData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto px-6 mb-32">
      <div className="max-w-3xl mx-auto">
        <Link href="/careers" className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-12">
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
              <h2 className="text-3xl font-headline font-bold mb-4">Application Received.</h2>
              <p className="text-foreground/50 mb-10 max-w-md mx-auto">
                Thank you for applying to HITECH. Our engineering leads will review your profile and contact you if there is a match with our current throughput.
              </p>
              <Button asChild className="rounded-full px-10 h-12 bg-primary text-white font-bold">
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
                <h2 className="text-3xl font-headline font-bold mb-2">Join the Mission.</h2>
                <p className="text-foreground/40 text-sm">Fill in your technical profile for the <span className="text-primary font-bold">{role || 'selected'}</span> position.</p>
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
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50" 
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
                      className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50" 
                      placeholder="john@company.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Applying For Role
                  </Label>
                  <Input 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50" 
                    placeholder="e.g. Senior Full-Stack Engineer" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Portfolio / LinkedIn / GitHub</Label>
                  <Input 
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50" 
                    placeholder="https://..." 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Cover Letter / Why HITECH?</Label>
                  <Textarea 
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="min-h-[150px] rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50" 
                    placeholder="Tell us about your technical journey and what you bring to the team..." 
                    required 
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Resume / CV</Label>
                  <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <input type="file" className="hidden" id="resume-upload" />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-foreground/20 group-hover:text-primary mx-auto mb-4 transition-colors" />
                      <p className="text-sm font-bold mb-1">Click to upload your resume</p>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-widest">PDF, DOCX (Max 10MB)</p>
                    </label>
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
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
        <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Technical <br /> Application.</h1>
      </section>
      <Suspense fallback={<div className="container mx-auto px-6 py-20 text-center">Loading portal...</div>}>
        <ApplyFormContent />
      </Suspense>
      <Footer />
    </main>
  );
}
