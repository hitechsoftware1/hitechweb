
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Server, 
  Globe, 
  Database, 
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const services = [
  { name: "HITECH API Core", status: "operational", uptime: "100%", latency: "12ms" },
  { name: "Neural Processing Unit", status: "operational", uptime: "99.98%", latency: "42ms" },
  { name: "Global CDN Edge", status: "operational", uptime: "100%", latency: "8ms" },
  { name: "PostgreSQL Clusters", status: "operational", uptime: "99.99%", latency: "3ms" },
  { name: "Auth Verification Hub", status: "operational", uptime: "100%", latency: "15ms" },
  { name: "Client Portal Engine", status: "maintenance", uptime: "98.5%", latency: "N/A" }
];

const incidents = [
  {
    title: "Scheduled Maintenance: Portal Expansion",
    date: "March 20, 2024",
    status: "In Progress",
    description: "We are upgrading the Client Portal database schema to support new real-time collaboration features."
  },
  {
    title: "NPU Latency Spike",
    date: "March 15, 2024",
    status: "Resolved",
    description: "Brief latency increase in AI response times due to regional traffic surge. Mitigated via auto-scaling."
  }
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-[0.4em]">All Systems Nominal</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">System <br /> Pulse.</h1>
          </div>
          <div className="apple-glass px-6 py-4 rounded-2xl flex items-center gap-8">
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">90-Day Uptime</p>
              <p className="text-xl font-bold">99.998%</p>
            </div>
            <div className="w-[1px] h-10 bg-foreground/10" />
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Global Health</p>
              <p className="text-xl font-bold text-green-500">Excellent</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32 space-y-12">
        
        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="apple-card p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {service.status === 'operational' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  <h4 className="font-bold text-sm">{service.name}</h4>
                </div>
                <span className={cn(
                  "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                  service.status === 'operational' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  {service.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Uptime</p>
                  <p className="text-lg font-bold">{service.uptime}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Latency</p>
                  <p className="text-lg font-bold">{service.latency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real-time Monitor UI */}
        <div className="apple-card p-10 bg-foreground/[0.01] border-foreground/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-headline font-bold flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" /> Traffic Distribution
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Outbound</span>
              </div>
            </div>
          </div>
          <div className="h-24 flex items-end gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  repeatType: 'reverse',
                  delay: i * 0.05
                }}
                className="flex-1 bg-primary/20 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="max-w-4xl">
          <h3 className="text-2xl font-headline font-bold mb-8">Recent Incidents</h3>
          <div className="space-y-6">
            {incidents.map((incident, idx) => (
              <div key={idx} className="apple-glass p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Terminal className="w-24 h-24" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1 block">{incident.date}</span>
                    <h4 className="text-xl font-bold">{incident.title}</h4>
                  </div>
                  <span className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    incident.status === 'Resolved' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                  )}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-foreground/50 leading-relaxed font-light max-w-2xl">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
