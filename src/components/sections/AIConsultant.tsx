
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Cpu, Check, ArrowRight, User, Rocket, ShieldCheck, Zap, BrainCircuit, Volume2, VolumeX } from 'lucide-react';
import { intelligentSolutionConsultant, type IntelligentSolutionConsultantOutput } from '@/ai/flows/intelligent-solution-consultant';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';

export function AIConsultant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [result, setResult] = useState<IntelligentSolutionConsultantOutput | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const loadingSteps = [
    "Analyzing requirements...",
    "Scanning HITECH service catalog...",
    "Architecting digital ecosystem...",
    "Optimizing performance SLAs...",
    "Finalizing strategic roadmap...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let step = 0;
      setLoadingText(loadingSteps[0]);
      interval = setInterval(() => {
        step = (step + 1) % loadingSteps.length;
        setLoadingText(loadingSteps[step]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleConsult = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setAudioUrl(null);
    setIsSpeaking(false);
    try {
      const output = await intelligentSolutionConsultant({ businessRequirements: input });
      setResult(output);
      
      const ttsResult = await textToSpeech({ 
        text: `Here is your strategy. Recommended Architecture: ${output.recommendedArchitecture}. Justification: ${output.justification}`
      });
      setAudioUrl(ttsResult.audioUri);

      toast({
        title: "Strategy Computed",
        description: "Your custom digital roadmap and audio summary are ready.",
      });
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

  const toggleVoice = () => {
    if (!audioRef.current) return;
    if (isSpeaking) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <section id="ai-consultant" className="py-12 lg:py-32 relative overflow-hidden bg-background">
      
      {/* Background Decor & Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-10 dark:opacity-20"
        >
          <source src="https://video-previews.elements.envatousercontent.com/ba65e2b2-0f68-49bc-a9c5-f8f156ada54a/watermarked_preview/watermarked_preview.mp4" type="video/mp4" />
        </video>
        {/* Overlays */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 neural-grid opacity-30" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-24 items-start">
          
          <div className="hidden md:flex col-span-5 flex-col gap-6 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="apple-card p-8 border-primary/20 glow-blue"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border border-primary/30 overflow-hidden">
                  <User className="w-7 h-7 text-foreground/70" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-foreground text-xl">JoelHitech</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Founder & CEO</p>
                </div>
              </div>
              <p className="text-foreground/70 font-light leading-relaxed italic text-sm">
                "We don't just write code; we architect the digital soul of tomorrow. Tell us your vision, and we'll build the engine that drives it."
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="apple-glass p-6 rounded-[2rem] flex flex-col gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Security</p>
                <p className="text-xs font-medium text-foreground/80">Zero-Trust Core</p>
              </div>
              <div className="apple-glass p-6 rounded-[2rem] flex flex-col gap-3">
                <Rocket className="w-8 h-8 text-accent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Scale</p>
                <p className="text-xs font-medium text-foreground/80">Rapid Evolution</p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-7">
            <div className="mb-8 lg:mb-12">
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
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="apple-card p-6 lg:p-12 overflow-hidden border-primary/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  loading ? "bg-primary text-primary-foreground animate-spin" : "bg-primary/10 text-primary"
                )}>
                  {loading ? <BrainCircuit className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                    {loading ? 'Neural Engine Active' : 'System Ready'}
                  </span>
                  {loading && (
                    <span className="text-xs font-medium text-primary animate-pulse">{loadingText}</span>
                  )}
                </div>
              </div>

              <Textarea 
                placeholder="E.g., I need a high-speed e-commerce platform with mobile money integration and a robust admin dashboard..."
                className="bg-transparent border-none text-base lg:text-2xl font-light focus-visible:ring-0 placeholder:text-foreground/10 min-h-[120px] lg:min-h-[160px] resize-none p-0 mb-8 text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-foreground/5 gap-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                    Instant Computation
                  </span>
                </div>
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !input.trim()}
                  className="w-full sm:w-auto rounded-full px-10 h-14 bg-foreground text-background font-bold hover:scale-105 transition-all flex items-center justify-center gap-3 group text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                  ) : (
                    <>
                      Generate Strategy
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="mt-8 lg:mt-12 space-y-6"
                >
                  <div className="flex items-center justify-between apple-card p-6 bg-accent/5 border-accent/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Voice Briefing</h4>
                        <p className="text-xs text-foreground/40">Neural synthesis complete.</p>
                      </div>
                    </div>
                    {audioUrl && (
                      <>
                        <audio 
                          ref={audioRef} 
                          src={audioUrl} 
                          onEnded={() => setIsSpeaking(false)}
                          hidden 
                        />
                        <Button 
                          onClick={toggleVoice} 
                          size="icon" 
                          variant="ghost" 
                          className="rounded-full w-12 h-12 bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all"
                        >
                          {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="apple-card p-8 bg-primary/5 border-primary/20">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">HITECH Recommendations</h3>
                      <div className="space-y-4">
                        {result.recommendedServices.map((service, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 text-sm lg:text-base text-foreground/80 font-medium"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="apple-card p-8 bg-foreground/[0.02] border-foreground/5">
                      <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-6">Proposed Architecture</h3>
                      <p className="text-sm lg:text-lg text-foreground/90 font-medium leading-relaxed">
                        {result.recommendedArchitecture}
                      </p>
                    </div>
                  </div>

                  <div className="apple-card p-8 bg-foreground/[0.01] border-foreground/5">
                    <div className="flex items-center gap-3 mb-4">
                      <BrainCircuit className="w-5 h-5 text-accent" />
                      <h3 className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Strategic Analysis</h3>
                    </div>
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
