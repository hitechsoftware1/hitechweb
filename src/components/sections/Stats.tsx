
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from '@/lib/utils';
import { Activity, Globe, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Business Projects', value: '150+', color: 'text-primary', change: '+12%', spark: [30, 45, 32, 60, 55, 90] },
  { label: 'Online Status', value: '99.99%', color: 'text-foreground', change: 'Stable', spark: [99, 99, 100, 99, 100, 99.9] },
  { label: 'Safety Checks', value: '500+', color: 'text-foreground', change: '+84', spark: [10, 20, 40, 80, 150, 500] },
  { label: 'App Launches', value: '1.2k', color: 'text-foreground', change: '+24%', spark: [100, 300, 450, 700, 900, 1200] },
];

const throughputData = [
  { time: "00:00", value: 4500, load: 3200 },
  { time: "04:00", value: 5200, load: 3800 },
  { time: "08:00", value: 7800, load: 6100 },
  { time: "12:00", value: 9400, load: 8500 },
  { time: "16:00", value: 8200, load: 7400 },
  { time: "20:00", value: 6100, load: 4900 },
  { time: "23:59", value: 5400, load: 4200 },
];

const regionalData = [
  { name: 'Kampala', value: 85, color: 'hsl(var(--primary))' },
  { name: 'London', value: 92, color: 'hsl(var(--accent))' },
  { name: 'S.F.', value: 98, color: 'hsl(var(--foreground))' },
];

const chartConfig = {
  value: {
    label: "Total Work",
    color: "hsl(var(--primary))",
  },
  load: {
    label: "System Load",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function Stats() {
  return (
    <section className="py-12 lg:py-20 relative bg-background overflow-hidden border-y border-foreground/5">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] " />
        <div className="absolute inset-0 neural-grid opacity-30" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        
        {/* Header Protocol */}
        <div className="mb-12 lg:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-2xl text-center md:text-left w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 mb-4 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em] justify-center md:justify-start"
            >
              <Activity className="w-3 h-3" /> Live Updates
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 tracking-tight leading-tight">
              Our Growth <br className="hidden lg:block" /> in Numbers.
            </h2>
          </div>
          <div className="apple-glass w-full md:w-auto px-6 py-4 md:px-8 md:py-5 rounded-2xl flex items-center justify-between md:justify-start gap-6 md:gap-10">
            <div className="text-center md:text-left">
              <p className="text-[8px] lg:text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg lg:text-xl font-bold text-green-500 uppercase">Running Great</p>
            </div>
            <div className="w-[1px] h-10 bg-foreground/10" />
            <div className="text-center md:text-left text-primary font-bold">
               <p className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-30 mb-1">System Speed</p>
               <p className="text-lg lg:text-xl">Fast & Reliable</p>
            </div>
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-6 mb-6">
          
          {/* Main Throughput Chart */}
          <div className="col-span-1 lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="apple-card p-3 sm:p-6 lg:p-10 h-full flex flex-col"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-3">
                <div>
                  <h3 className="text-[10px] sm:text-lg font-bold">App Reliability</h3>
                  <p className="text-[6px] sm:text-[10px] font-bold text-foreground/30 uppercase tracking-widest line-clamp-1">Performance across all systems</p>
                </div>
              </div>

              <div className="flex-grow h-[120px] sm:h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={throughputData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 8, opacity: 0.3 }}
                        dy={10}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </motion.div>
          </div>

          {/* Regional Pie Module */}
          <div className="col-span-1 lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="apple-card p-3 sm:p-8 h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-[10px] sm:text-lg font-bold mb-0.5 lg:mb-1">Global Reach</h3>
                <p className="text-[6px] sm:text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-4 lg:mb-10">Our Network</p>
                
                <div className="h-24 sm:h-48 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionalData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-sm sm:text-3xl font-headline font-bold">96%</p>
                    <p className="text-[5px] sm:text-[8px] font-bold text-foreground/30 uppercase tracking-widest">Global</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-4 pt-4 lg:pt-6 border-t border-foreground/5">
                {regionalData.map((node) => (
                  <div key={node.name} className="flex justify-between items-center text-[7px] sm:text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-foreground/60">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: node.color }} />
                      {node.name}
                    </div>
                    <span className="font-bold">{node.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Metric Strips Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="apple-card p-6 flex flex-col justify-between group hover:border-primary/30"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className={cn("text-2xl font-headline font-bold tracking-tight", stat.color)}>{stat.value}</h4>
                </div>
                <span className={cn(
                  "text-[8px] font-bold px-2 py-0.5 rounded-full",
                  stat.change.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-foreground/5 text-foreground/40"
                )}>
                  {stat.change}
                </span>
              </div>
              
              <div className="h-10 w-full opacity-30 group-hover:opacity-100 transition-opacity">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.spark.map((v, i) => ({ i, v }))}>
                       <Area 
                         type="monotone" 
                         dataKey="v" 
                         stroke="currentColor" 
                         className={stat.color} 
                         fill="transparent" 
                         strokeWidth={2}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Node Summary Strip */}
        <div className="mt-12 py-8 border-t border-foreground/5 flex flex-wrap gap-8 lg:gap-12 justify-center lg:justify-start">
           {[
             { label: 'System Stability', value: 'High', icon: ShieldCheck, color: 'text-green-500' },
             { label: 'Uptime Score', value: '99.9%', icon: TrendingUp, color: 'text-primary' },
             { label: 'Peak Capacity', value: 'High', icon: Zap, color: 'text-primary' },
             { label: 'Network Health', value: '100%', icon: Globe, color: 'text-primary' }
           ].map((node, i) => (
             <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] flex items-center justify-center">
                   <node.icon className="w-5 h-5 text-foreground/20" />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{node.label}</p>
                   <p className={cn("text-sm font-bold", node.color)}>{node.value}</p>
                </div>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
