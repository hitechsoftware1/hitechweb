
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Clearance Verified",
        description: "Institutional link established. Welcome to the HITECH core.",
      });
      router.push('/admin');
    } catch (error: any) {
      let errorMessage = "Invalid credentials or insufficient clearance level.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Identity not found. Please verify your credentials.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Invalid validation key. Access denied.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication service is not enabled in the Firebase Console. Please enable Email/Password provider.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Uplink failure. Check your internet connection.";
      }

      toast({
        variant: "destructive",
        title: "Access Denied",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 neural-grid opacity-30" />
      </div>

      <section className="container mx-auto px-6 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-bold mb-2 text-foreground">System Access.</h1>
            <p className="text-foreground/40 text-sm font-medium">Enter your institutional credentials to continue.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="apple-card p-8 lg:p-10 border-foreground/10 shadow-2xl"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hitech.systems"
                  className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl bg-foreground/5 border-foreground/10 focus:ring-primary/50 text-foreground"
                  required
                />
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-foreground/50 leading-relaxed font-medium">
                  Super Admin: hitechsoftware03@gmail.com <br/>
                  Ensure Auth is enabled in Firebase Console.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Verify Clearance <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <p className="text-center text-[8px] font-bold text-foreground/20 uppercase tracking-[0.4em] mt-12">
            HITECH NEURAL CORE v5.0 // END-TO-END ENCRYPTED
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
