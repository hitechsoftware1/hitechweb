
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Copy, Check, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const codes = [
  { id: '1', platform: 'SportyBet', code: 'BC789X', odds: '2.45', matches: '3 Matches' },
  { id: '2', platform: '1xBet', code: '1X-HITECH-99', odds: '5.12', matches: '5 Matches' },
  { id: '3', platform: 'BetPawa', code: '456PAWA', odds: '1.85', matches: '2 Matches' },
  { id: '4', platform: 'SportyBet', code: 'SB-8822-ZZ', odds: '12.4', matches: '8 Matches' },
];

export function BookingCodes() {
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: `Booking code [${code}] has been saved to your clipboard.`,
    });
  };

  return (
    <section id="booking-codes" className="py-12 lg:py-32 relative bg-background overflow-hidden border-y border-foreground/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-12 lg:mb-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 text-primary text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            <Ticket className="w-4 h-4" /> Analyzed Receipts
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Well Analyzed <br /> Booking Receipts.
          </h2>
          <p className="text-sm lg:text-xl text-foreground/50 font-light max-w-2xl leading-relaxed">
            Get precision booking codes for popular platforms across Uganda and Africa, analyzed by our strategic algorithms.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {codes.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-6 flex flex-col justify-between group hover:border-primary/30"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.platform}</span>
                  <div className="flex items-center gap-1.5 text-green-500">
                    <Zap className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold">{item.odds} Odds</span>
                  </div>
                </div>
                <div className="bg-foreground/5 rounded-xl p-4 mb-6 text-center border border-foreground/5 group-hover:border-primary/20 transition-all">
                  <p className="text-lg lg:text-2xl font-headline font-bold tracking-wider text-foreground/90">{item.code}</p>
                </div>
                <p className="text-[10px] text-foreground/40 font-medium mb-8 text-center">{item.matches}</p>
              </div>
              <Button 
                onClick={() => copyCode(item.code)}
                variant="outline" 
                className="w-full rounded-xl border-foreground/10 hover:bg-primary hover:text-white hover:border-primary font-bold text-[10px] uppercase tracking-widest h-10 transition-all"
              >
                Copy Code
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
