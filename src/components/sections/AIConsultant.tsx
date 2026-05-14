
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Cpu, Check, ArrowRight, User, Rocket, ShieldCheck, Zap } from 'lucide-react';
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
    <section id="ai-consultant" className="py-12 lg:py-32 relative overflow-hidden min-h-[600px] lg:min-h-[900px] flex items-center">
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-30 lg:opacity-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-loops-4433-preview.mp4" type="video/mp4" />
        </video>
        {/* Overlays for readability and texture */}
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
        <div className="grid grid-cols-12 gap-4 lg:gap-24 items-center">
          
          {/* Left Column: Floating Liquid Ads / Info Cards */}
          <div className="col-span-5 lg:col-span-5 space-y-3 lg:space-y-6 relative h-[300px] lg:h-auto flex flex-col justify-center order-1 lg:order-1">
            
            {/* Founder Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                opacity: { duration: 0.8 },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              className="apple-card p-3 lg:p-8 border-primary/20 glow-blue relative z-30 ml-0 lg:-ml-8"
            >
              <div className="flex items-center gap-2 lg:gap-4 mb-2 lg:mb-6">
                <div className="w-8 h-8 lg:w-16 lg:h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border border-primary/50 p-0.5 lg:p-1">
                   <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-background">
                     <User className="w-4 h-4 lg:w-8 lg:h-8" />
                   </div>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-white text-[10px] lg:text-xl">JoelHitech</h4>
                  <p className="text-[5px] lg:text-[10px] font-bold text-primary uppercase tracking-widest">Founder & CEO</p>
                </div>
              </div>
              <p className="text-white/70 font-light leading-relaxed italic text-[7px] lg:text-sm line-clamp-3 lg:line-clamp-none">
                "We don't just write code; we architect the digital soul of tomorrow."
              </p>
            </motion.div>

            {/* Strategic Floating Card 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
              transition={{ 
                delay: 0.2,
                y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                x: { repeat: Infinity, duration: 10, ease: "easeInOut" }
              }}
              className="apple-glass p-2 lg:p-6 rounded-xl lg:rounded-[2.5rem] absolute top-4 -right-2 lg:-right-12 w-24 lg:w-48 z-40"
            >
              <Rocket className="w-4 h-4 lg:w-8 lg:h-8 text-primary mb-1 lg:mb-4" />
              <p className="text-[5px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-0.5 lg:mb-2">Momentum</p>
              <p className="text-[6px] lg:text-xs font-medium text-white/80">Rapid Scale</p>
            </motion.div>

            {/* Core Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="apple-glass p-2 lg:p-6 rounded-xl lg:rounded-[2rem] flex items-center gap-2 lg:gap-4 border-white/5 bg-white/[0.02] backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 lg:w-10 lg:h-10 text-primary shrink-0" />
              <div>
                <p className="text-[5px] lg:text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-0.5">Security</p>
                <p className="text-[6px] lg:text-sm font-light text-white/60">Zero-Trust Core.</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: AI Consultant Interface */}
          <div className="col-span-7 lg:col-span-7 order-2 lg:order-2 pl-2 lg:pl-0">
            <div className="text-left mb-4 lg:mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-xl lg:text-7xl font-headline font-bold text-gradient-apple mb-1 lg:mb-4 tracking-tight"
              >
                AI Strategy <br className="lg:hidden" /> Studio.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[8px] lg:text-xl text-white/50 font-light max-w-2xl leading-relaxed"
              >
                Define your vision. Our neural engine will architect your transformation.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="apple-card p-4 lg:p-12 overflow-hidden bg-[#1C1C1E]/60 backdrop-blur-3xl border-primary/10 shadow-[0_10px_40px_rgba(0,113,227,0.1)]"
            >
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-8">
                <div className="w-5 h-5 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-2.5 h-2.5 lg:w-5 lg:h-5 text-primary" />
                </div>
                <span className="text-[6px] lg:text-xs font-bold tracking-widest text-white/40 uppercase">System Active</span>
              </div>

              <Textarea 
                placeholder="Business goals..."
                className="bg-transparent border-none text-[10px] lg:text-2xl font-light focus-visible:ring-0 placeholder:text-white/10 min-h-[60px] lg:min-h-[140px] resize-none p-0 mb-4 lg:mb-8 text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 lg:pt-8 border-t border-white/5 gap-2 lg:gap-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[6px] lg:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Ready</span>
                </div>
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !input}
                  className="w-full sm:w-auto rounded-full px-4 lg:px-10 h-8 lg:h-14 bg-white text-background font-bold hover:scale-105 transition-all flex items-center justify-center gap-1.5 lg:gap-3 group text-[8px] lg:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-3 h-3 lg:w-5 lg:h-5" /> Processing
                    </>
                  ) : (
                    <>
                      Compute 
                      <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
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
                  className="mt-4 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8"
                >
                  <div className="apple-card p-3 lg:p-8 bg-primary/5 border-primary/20">
                    <h3 className="text-[6px] lg:text-xs font-bold text-primary uppercase tracking-widest mb-2 lg:mb-6">Proposed</h3>
                    <div className="space-y-1 lg:space-y-4">
                      {result.recommendedServices.slice(0, 3).map((service, i) => (
                        <div key={i} className="flex items-center gap-1.5 lg:gap-3 text-[8px] lg:text-lg text-white/80 font-medium">
                          <Check className="w-2 h-2 lg:w-5 lg:h-5 text-primary shrink-0" />
                          <span className="truncate">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="apple-card p-3 lg:p-8 bg-white/[0.02] border-white/5 hidden lg:block">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Strategy</h3>
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
