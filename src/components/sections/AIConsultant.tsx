
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Brain, Loader2, CheckCircle2, LayoutGrid, ListChecks, Terminal, Zap } from 'lucide-react';
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
    <section id="ai-consultant" className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[180px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-morphism border-primary/30 text-primary mb-8"
            >
              <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">Neural Processing Unit Active</span>
            </motion.div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold mb-8">
              AI-Powered <span className="text-gradient-primary">Architecture</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Describe your business requirements. Our specialized AI model will generate a high-performance roadmap tailored to your specific scaling needs.
            </p>
          </div>

          <div className="grid gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-[2.5rem] blur-xl opacity-20" />
              <Card className="glass-card p-10 relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-2xl font-headline">
                    <Terminal className="text-primary w-8 h-8" />
                    System Input Console
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Textarea 
                    placeholder="Describe your vision (e.g., A global marketplace with AI-driven recommendations and real-time inventory management...)"
                    className="min-h-[200px] bg-white/[0.03] border-white/10 focus:border-primary/50 text-xl rounded-3xl resize-none p-6 font-light leading-relaxed placeholder:text-muted-foreground/30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ready for analysis</span>
                  </div>
                  <Button 
                    onClick={handleConsult} 
                    disabled={loading || !input}
                    className="rounded-full px-12 h-16 glow-primary font-bold text-lg bg-primary text-primary-foreground hover:scale-105 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 animate-spin w-6 h-6" /> Analyzing Core Data...
                      </>
                    ) : (
                      <>Compute Roadmap <Sparkles className="ml-2 w-5 h-5" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.8 }}
                  className="grid gap-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="glass-card border-secondary/20 group hover:border-secondary/40">
                      <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center gap-3 text-secondary">
                          <LayoutGrid className="w-6 h-6" /> Proposed Architecture
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-lg leading-relaxed font-light whitespace-pre-wrap">
                          {result.recommendedArchitecture}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-primary/20 group hover:border-primary/40">
                      <CardHeader>
                        <CardTitle className="text-2xl font-headline flex items-center gap-3 text-primary">
                          <ListChecks className="w-6 h-6" /> Technological Stack
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-1 gap-4">
                          {result.recommendedServices.map((service, i) => (
                            <motion.li 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className="flex items-center gap-4 text-foreground/90 font-medium text-lg p-4 bg-white/5 rounded-2xl border border-white/5"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              {service}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="glass-card border-white/10 p-4">
                    <CardHeader>
                      <CardTitle className="text-2xl font-headline text-gradient-primary">Strategic Advantage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative p-8 rounded-3xl bg-primary/5 border border-primary/10 italic text-xl text-muted-foreground leading-relaxed font-light">
                        <span className="absolute -top-4 -left-2 text-6xl text-primary/20 font-serif">"</span>
                        {result.justification}
                        <span className="absolute -bottom-10 -right-2 text-6xl text-primary/20 font-serif rotate-180">"</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
