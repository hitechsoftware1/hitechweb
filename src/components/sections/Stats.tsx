"use client";

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Enterprises', value: '150+', color: 'text-primary' },
  { label: 'System Uptime', value: '99.99%', color: 'text-foreground' },
  { label: 'Security Audits', value: '500+', color: 'text-foreground' },
  { label: 'Launches', value: '1.2k', color: 'text-foreground' },
];

export function Stats() {
  return (
    <section className="pb-8 lg:pb-12 pt-0 lg:pt-0 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <h3 className={`text-4xl lg:text-8xl font-bold font-headline mb-2 lg:mb-4 tracking-tighter ${stat.color} transition-all duration-500 group-hover:scale-105`}>
                {stat.value}
              </h3>
              <p className="text-foreground/30 font-bold uppercase text-[8px] lg:text-[10px] tracking-[0.3em] lg:tracking-[0.5em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}