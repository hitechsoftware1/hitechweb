
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Code2 } from 'lucide-react';

const stats = [
  { label: 'Global Enterprises', value: '150+', icon: Globe, color: 'text-primary' },
  { label: 'Success Velocity', value: '99.9%', icon: Award, color: 'text-secondary' },
  { label: 'Cloud Architects', value: '250+', icon: Users, color: 'text-cyan-400' },
  { label: 'Lines of Innovation', value: '25M+', icon: Code2, color: 'text-green-400' },
];

export function Stats() {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-10 glass-card group"
            >
              <div className={`p-5 rounded-2xl bg-white/5 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all ${stat.color}`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <h3 className="text-5xl lg:text-6xl font-bold font-headline mb-3 tracking-tighter text-gradient-primary">
                {stat.value}
              </h3>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
