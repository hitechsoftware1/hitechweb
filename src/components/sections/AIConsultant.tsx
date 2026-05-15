"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Cpu, Check, ArrowRight, User, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { intelligentSolutionConsultant, type IntelligentSolutionConsultantOutput } from '@/ai/flows/intelligent-solution-consultant';
import { cn } from '@/lib/utils';

export function AIConsultant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligentSolutionConsultantOutput | null>(null);
  const { toast } = useToast();

  const handleConsult = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await intelligentSolutionConsultant({ businessRequirements: input });
      setResult(output);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The neural engine encountered an error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const liquidBlobs = [
    { color: 'bg-primary/20', size: 'w-64 h-64', delay: 0 },
    { color: 'bg-purple-500/10', size: 'w-96 h-96', delay: 2 },
    { color: 'bg-blue-400/10', size: 'w-80 h-80', delay: 4 },
  ];

  return (
    <section id="ai-consultant" className="py-12 lg:py-32 relative overflow-hidden min-h-[600px] lg:min-h-[900px] flex items-center bg-background">
      
      {/* Background Texture */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 neural-grid opacity-30" />
      </div>

      {/* Liquid Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        {liquidBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full blur-[100px]", blob.color, blob.size)}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: blob.delay,
            }}
            style={{
              left: `${10 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-24 items-center">
          
          {/* Left Column: Vision Cards */}
          <div className="hidden md:flex col-span-5 space-y-6 relative flex-col justify-center">
            
            {/* Founder Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                opacity: { duration: 0.8 },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              className="apple-card p-8 border-primary/20 glow-blue relative z-30 -ml-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center overflow-hidden border border-primary/50 p-1">
                   <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-foreground">
                     <User className="w-8 h-8" />
                   </div>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-foreground text-xl">JoelHitech</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Founder & CEO</p>
                </div>
              </div>
              <p className="text-foreground/70 font-light leading-relaxed italic text-sm">
                "We don't just write code; we architect the digital soul of tomorrow."
              </p>
            </motion.div>

            {/* Momentum Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
              transition={{ 
                delay: 0.2,
                y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                x: { repeat: Infinity, duration: 10, ease: "easeInOut" }
              }}
              className="apple-glass p-6 rounded-[2.5rem] absolute top-4 -right-12 w-48 z-40"
            >
              <Rocket className="w-8 h-8 text-primary mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-2">Momentum</p>
              <p className="text-xs font-medium text-foreground/80">Rapid Scale</p>
            </motion.div>

            {/* Core Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="apple-glass p-6 rounded-[2rem] flex items-center gap-4 border-foreground/5 bg-foreground/[0.02]"
            >
              <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/30 mb-0.5">Security</p>
                <p className="text-sm font-light text-foreground/60">Zero-Trust Core.</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: AI Consultant Interface */}
          <div className="col-span-1 md:col-span-7">
            <div className="text-left mb-8 lg:mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 tracking-tight"
              >
                AI Strategy <br /> Studio.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm lg:text-xl text-foreground/50 font-light max-w-2xl leading-relaxed"
              >
                Define your vision. Our neural engine will architect your transformation.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="apple-card p-6 lg:p-12 overflow-hidden bg-card/60 border-primary/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-widest text-foreground/40 uppercase">System Active</span>
              </div>

              <Textarea 
                placeholder="Describe your business requirements, goals, and target audience..."
                className="bg-transparent border-none text-base lg:text-2xl font-light focus-visible:ring-0 placeholder:text-foreground/10 min-h-[100px] lg:min-h-[140px] resize-none p-0 mb-6 lg:mb-8 text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 lg:pt-8 border-t border-foreground/5 gap-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", loading ? "bg-primary animate-pulse" : "bg-green-500")} />
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                    {loading ? 'Analyzing...' : 'Ready'}
                  </span>
                </div>
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !input.trim()}
                  className="w-full sm:w-auto rounded-full px-10 h-12 lg:h-14 bg-foreground text-background font-bold hover:scale-105 transition-all flex items-center justify-center gap-3 group text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Processing
                    </>
                  ) : (
                    <>
                      Compute Strategy
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 lg:mt-12 space-y-4 lg:space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    <div className="apple-card p-6 lg:p-8 bg-primary/5 border-primary/20">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 lg:mb-6">Recommended Services</h3>
                      <div className="space-y-3">
                        {result.recommendedServices.map((service, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm lg:text-lg text-foreground/80 font-medium">
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="apple-card p-6 lg:p-8 bg-foreground/[0.02] border-foreground/5">
                      <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4 lg:mb-6">Architecture</h3>
                      <p className="text-sm lg:text-lg text-foreground/90 font-medium leading-relaxed">
                        {result.recommendedArchitecture}
                      </p>
                    </div>
                  </div>

                  <div className="apple-card p-6 lg:p-8 bg-foreground/[0.01] border-foreground/5">
                    <h3 className="text-xs font-bold text-foreground/30 uppercase tracking-widest mb-4">Strategic Justification</h3>
                    <p className="text-sm lg:text-lg text-foreground/70 font-light leading-relaxed">
                      {result.justification}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
