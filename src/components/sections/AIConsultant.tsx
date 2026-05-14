
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Cpu, Check, ArrowRight, User, Rocket, ShieldCheck } from 'lucide-react';
import { intelligentSolutionConsultant, type IntelligentSolutionConsultantOutput } from '@/ai/flows/intelligent-solution-consultant';
import { cn } from '@/lib/utils';

export function AIConsultant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligentSolutionConsultantOutput | null>(null);

  const handleConsult = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const output = await intelligentSolutionConsultant({ businessRequirements: input });
      setResult(output);
    } catch (error) {
      console.error("Consultation failed:", error);
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
    <section id="ai-consultant" className="py-12 lg:py-32 relative overflow-hidden neural-grid">
      {/* Liquid Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        {liquidBlobs.map((blob, i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full blur-[100px]", blob.color, blob.size)}
            animate={{
              x: [Math.random() * 100, Math.random() * 500, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 500, Math.random() * 100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: blob.delay,
            }}
            style={{
              left: `${10 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Founder & Mission (Liquid Ads) */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="apple-card p-8 lg:p-10 border-primary/20 glow-blue animate-float"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary/50">
                   <User className="text-background w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-white text-lg">JoelHitech</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Founder & Visionary</p>
                </div>
              </div>
              <p className="text-white/60 font-light leading-relaxed italic">
                "HITECH SOFTWARE was founded on a simple principle: Surgical precision in code, and boundless imagination in design. We don't just build software; we engineer the future of digital ecosystems."
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="apple-glass p-6 rounded-[2rem] flex flex-col gap-3">
                <Rocket className="w-6 h-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Scale Fast</p>
                <p className="text-sm font-light text-white/70">Rapid R&D cycles.</p>
              </div>
              <div className="apple-glass p-6 rounded-[2rem] flex flex-col gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Secure Core</p>
                <p className="text-sm font-light text-white/70">Military-grade infra.</p>
              </div>
            </motion.div>

            <div className="hidden lg:block relative h-32 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em] animate-pulse">
                  HITECH SOFTWARE CO. // SURGICAL PRECISION
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: AI Consultant Interface */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 tracking-tight"
              >
                AI Strategy Studio.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base lg:text-xl text-white/50 font-light max-w-2xl leading-relaxed"
              >
                Define your vision. Our neural engine, engineered by HITECH experts, will architect a roadmap for your transformation.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="apple-card p-6 lg:p-12 overflow-hidden bg-[#1C1C1E]/60 backdrop-blur-3xl border-primary/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-widest text-white/40 uppercase">System Analyzer Active</span>
              </div>

              <Textarea 
                placeholder="Briefly describe your business requirements..."
                className="bg-transparent border-none text-lg lg:text-2xl font-light focus-visible:ring-0 placeholder:text-white/10 min-h-[160px] resize-none p-0 mb-10 text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4 sm:gap-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Engine Ready</span>
                </div>
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !input}
                  className="w-full sm:w-auto rounded-full px-10 h-14 bg-white text-background font-bold hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                  ) : (
                    <>
                      Compute Architecture 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="mt-12 grid sm:grid-cols-2 gap-8"
                >
                  <div className="apple-card p-8 lg:p-10 bg-primary/5 border-primary/20">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Proposed Stack</h3>
                    <div className="space-y-4">
                      {result.recommendedServices.map((service, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="flex items-center gap-3 text-sm lg:text-lg text-white/80 font-medium"
                        >
                          <Check className="w-5 h-5 text-primary shrink-0" />
                          {service}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="apple-card p-8 lg:p-10 bg-white/[0.02] border-white/5">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Strategic Value</h3>
                    <p className="text-sm lg:text-lg text-white/70 font-light leading-relaxed">
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
