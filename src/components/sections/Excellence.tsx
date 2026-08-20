
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const premiumFeatures = [
  "Modern Designs",
  "High Speed",
  "SEO Ready",
  "Mobile Apps",
  "AI Features",
  "Secure Systems",
  "Cloud Integration",
  "Dashboards",
  "Real-Time Data",
  "Multi-Language",
  "Dark/Light Mode",
  "Smart Alerts",
  "Clean Interface",
  "Easy to Scale",
  "Great User Experience",
  "Automation",
  "Admin Panels",
  "Login Systems",
  "Modern API",
  "Business Solutions"
];

export function Excellence() {
  return (
    <section className="py-12 lg:py-20 relative bg-background/50 neural-grid">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-10 lg:mb-24">
          <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-6 tracking-tight text-gradient-apple">
            HITECH Standards.
          </h2>
          <p className="text-foreground/40 text-sm lg:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Every system we build comes with features designed to help your business succeed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {premiumFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="apple-glass p-4 lg:p-6 rounded-3xl flex items-center gap-3 group hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <span className="text-[10px] lg:text-xs font-medium text-foreground/70 leading-tight">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
