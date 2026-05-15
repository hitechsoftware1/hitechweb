
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const stats = [
  { label: 'Enterprises', value: '150+', color: 'text-primary' },
  { label: 'System Uptime', value: '99.99%', color: 'text-foreground' },
  { label: 'Security Audits', value: '500+', color: 'text-foreground' },
  { label: 'Launches', value: '1.2k', color: 'text-foreground' },
];

const chartData = [
  { month: "Jan", throughput: 2400 },
  { month: "Feb", throughput: 3600 },
  { month: "Mar", throughput: 3200 },
  { month: "Apr", throughput: 5400 },
  { month: "May", throughput: 4800 },
  { month: "Jun", throughput: 7200 },
];

export function Stats() {
  return (
    <section className="pb-12 lg:pb-32 pt-0 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-32">
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

        {/* Interactive Performance Chart */}
        <div className="max-w-5xl mx-auto">
          <div className="apple-card p-6 lg:p-12 border-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Engineering Velocity</span>
                <h2 className="text-2xl lg:text-4xl font-headline font-bold">Performance Scaling</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Compute Throughput</span>
                </div>
              </div>
            </div>

            <div className="h-[200px] lg:h-[300px] w-full">
              <ChartContainer config={{ 
                throughput: { label: "Throughput", color: "hsl(var(--primary))" }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Area 
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorThroughput)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
