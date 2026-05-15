
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  XAxis,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const stats = [
  { label: 'Enterprises', value: '150+', color: 'text-primary' },
  { label: 'System Uptime', value: '99.99%', color: 'text-foreground' },
  { label: 'Security Audits', value: '500+', color: 'text-foreground' },
  { label: 'Launches', value: '1.2k', color: 'text-foreground' },
];

const chartData = [
  { month: "Jan", open: 2000, close: 2400, high: 2600, low: 1800 },
  { month: "Feb", open: 2400, close: 3600, high: 3800, low: 2200 },
  { month: "Mar", open: 3600, close: 3200, high: 3700, low: 3000 },
  { month: "Apr", open: 3200, close: 5400, high: 5600, low: 3000 },
  { month: "May", open: 5400, close: 4800, high: 5500, low: 4600 },
  { month: "Jun", open: 4800, close: 7200, high: 7500, low: 4500 },
];

const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  const isGrowing = close >= open;
  const fill = isGrowing ? 'hsl(var(--primary))' : 'hsl(var(--accent))';
  
  const xCenter = x + width / 2;
  const maxValue = 8000;
  const chartHeight = 300;
  
  const getY = (val: number) => chartHeight - (val / maxValue) * chartHeight;

  return (
    <g className="transition-all duration-500">
      <line
        x1={xCenter}
        y1={getY(high)}
        x2={xCenter}
        y2={getY(low)}
        stroke={fill}
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.5}
      />
      <rect
        x={x}
        y={getY(Math.max(open, close))}
        width={width}
        height={Math.max(Math.abs(getY(open) - getY(close)), 4)}
        fill={fill}
        rx={4}
        className="drop-shadow-sm"
      />
    </g>
  );
};

export function Stats() {
  return (
    <section className="py-12 lg:py-32 relative bg-background overflow-hidden">
      
      {/* Background Video & Overlays */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-10 dark:opacity-20"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-data-computing-animation-in-a-server-room-22001-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 neural-grid opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
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
          <div className="apple-card p-6 lg:p-12 border-primary/10 bg-card/40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Engineering Velocity</span>
                <h2 className="text-2xl lg:text-4xl font-headline font-bold">Scaling Indicators.</h2>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Growth Cycle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Consolidation</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ChartContainer config={{ 
                throughput: { label: "Throughput", color: "hsl(var(--primary))" }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--foreground))', opacity: 0.2 }}
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--foreground))', opacity: 0.03 }} 
                      content={<ChartTooltipContent hideLabel />} 
                    />
                    <Bar 
                      dataKey="close" 
                      shape={<CandlestickShape />} 
                      barSize={40}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="mt-12 pt-8 border-t border-foreground/5 flex flex-wrap gap-12">
              <div>
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest mb-1">Standard Deviation</p>
                <p className="text-sm font-bold">± 4.2%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest mb-1">Compute Stability</p>
                <p className="text-sm font-bold text-green-500">High</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest mb-1">Peak Throughput</p>
                <p className="text-sm font-bold">7.5k ops/s</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
