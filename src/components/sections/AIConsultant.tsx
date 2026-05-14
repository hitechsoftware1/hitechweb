"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Cpu, Check, ArrowRight } from 'lucide-react';
import { intelligentSolutionConsultant, type IntelligentSolutionConsultantOutput } from '@/ai/flows/intelligent-solution-consultant';

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

  return (
    <section id="ai-consultant" className="py-12 lg:py-32 relative neural-grid">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-4xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight">
              AI Strategy Studio.
            </h2>
            <p className="text-base lg:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              Define your vision. Our neural engine will architect a comprehensive roadmap for your digital transformation.
            </p>
          </div>

          <div className="apple-card p-6 lg:p-12 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <span className="text-[10px] lg:text-xs font-bold tracking-widest text-white/40 uppercase">System Analyzer Active</span>
            </div>

            <Textarea 
              placeholder="Describe your project goals..."
              className="bg-transparent border-none text-lg lg:text-2xl font-light focus-visible:ring-0 placeholder:text-white/10 min-h-[120px] lg:min-h-[160px] resize-none p-0 mb-6 lg:mb-10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 lg:pt-8 border-t border-white/5 gap-4 sm:gap-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] lg:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Ready for compute</span>
              </div>
              <Button 
                onClick={handleConsult} 
                disabled={loading || !input}
                className="w-full sm:w-auto rounded-full px-6 lg:px-8 h-10 lg:h-12 bg-white text-background font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Processing...
                  </>
                ) : (
                  <>Compute Architecture <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="mt-8 lg:mt-12 grid lg:grid-cols-2 gap-6 lg:gap-8"
              >
                <div className="apple-card p-8 lg:p-10">
                  <h3 className="text-xs lg:text-sm font-bold text-white/40 uppercase tracking-widest mb-4 lg:mb-6">Proposed Stack</h3>
                  <div className="space-y-3 lg:space-y-4">
                    {result.recommendedServices.map((service, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-3 text-sm lg:text-lg text-white/80 font-medium"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {service}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="apple-card p-8 lg:p-10">
                  <h3 className="text-xs lg:text-sm font-bold text-white/40 uppercase tracking-widest mb-4 lg:mb-6">Strategic Value</h3>
                  <p className="text-sm lg:text-lg text-white/70 font-light leading-relaxed">
                    {result.justification}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
