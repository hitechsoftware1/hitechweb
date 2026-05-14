
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const premiumFeatures = [
  "Modern Responsive Designs",
  "High-Speed Performance",
  "SEO Friendly Systems",
  "Mobile Optimized Platforms",
  "AI-Powered Features",
  "Secure Systems",
  "Cloud Integration",
  "Advanced Dashboards",
  "Real-Time Analytics",
  "Multi-Language Support",
  "Dark/Light Mode",
  "Smart Notifications",
  "Interactive User Interfaces",
  "Scalable Infrastructure",
  "Premium User Experience",
  "Automation Features",
  "Professional Admin Panels",
  "Advanced Authentication Systems",
  "Modern API Architecture",
  "Enterprise-Level Solutions"
];

export function Excellence() {
  return (
    <section className="py-24 lg:py-32 relative bg-background/50 neural-grid">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
          <h2 className="text-3xl lg:text-6xl font-headline font-bold text-gradient-apple mb-6 tracking-tight">
            The HITECH Standard.
          </h2>
          <p className="text-white/40 text-sm lg:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Every system we build comes standard with premium features designed to elevate your enterprise.
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
                <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] lg:text-xs font-medium text-white/70 leading-tight">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
