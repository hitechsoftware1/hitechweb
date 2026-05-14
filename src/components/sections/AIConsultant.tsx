
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Brain, Loader2, CheckCircle2, LayoutGrid, ListChecks } from 'lucide-react';
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
    <section id="ai-consultant" className="py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">AI Engine v2.5 Online</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-headline font-bold mb-6">Solution Architecture <span className="text-gradient-primary">Assistant</span></h2>
            <p className="text-lg text-muted-foreground">
              Describe your business challenges or goals below. Our specialized AI will reason through the requirements and propose a technical roadmap.
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="glass-morphism border-primary/20 p-6 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="text-primary w-6 h-6" />
                  What are you building?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="e.g. We need a high-frequency trading platform with sub-millisecond latency and real-time dashboarding for 10k concurrent users..."
                  className="min-h-[150px] bg-white/5 border-white/10 focus:border-primary/50 text-lg rounded-2xl resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleConsult} 
                  disabled={loading || !input}
                  className="rounded-full px-10 h-14 glow-primary font-bold text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Analyzing Requirements...
                    </>
                  ) : (
                    <>Generate Architectural Roadmap</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-morphism border-secondary/20 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 text-secondary">
                        <LayoutGrid className="w-5 h-5" /> Recommended Architecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {result.recommendedArchitecture}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism border-primary/20 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 text-primary">
                        <ListChecks className="w-5 h-5" /> Key Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.recommendedServices.map((service, i) => (
                          <li key={i} className="flex items-center gap-3 text-foreground/90 font-medium">
                            <CheckCircle2 className="text-primary w-5 h-5 shrink-0" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-morphism border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-gradient-primary">Strategic Justification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{result.justification}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
