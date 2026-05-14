
"use client";

import React from 'react';
import { Users, Globe, Award, Code2 } from 'lucide-react';

const stats = [
  { label: 'Global Clients', value: '120+', icon: Globe, color: 'text-primary' },
  { label: 'Project Success', value: '99.8%', icon: Award, color: 'text-secondary' },
  { label: 'Developers', value: '300+', icon: Users, color: 'text-cyan-400' },
  { label: 'Lines of Code', value: '15M+', icon: Code2, color: 'text-green-400' },
];

export function Stats() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 glass-morphism rounded-3xl group hover:border-primary/50 transition-all">
              <div className={`p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold font-headline mb-2 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
