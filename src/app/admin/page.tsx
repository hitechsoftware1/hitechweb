
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Layers, 
  DollarSign, 
  ArrowUpRight, 
  MessageSquare,
  Clock,
  ShieldAlert,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const recentInquiries = [
  { name: "Sarah Jenkins", project: "Web Platform", budget: "$12k", time: "2h ago", status: "New" },
  { name: "Mark Peterson", project: "AI Chatbot", budget: "$25k", time: "5h ago", status: "Review" },
  { name: "Elena Rossi", project: "Mobile App", budget: "$18k", time: "1d ago", status: "Contacted" }
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Enterprise Admin Command</span>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Ecosystem <br /> Overview.</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full h-12 px-6 border-foreground/10">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Button className="rounded-full h-12 px-6 bg-primary text-white font-bold">
              Export Audit
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Dashboard Stats */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Active Projects", val: "14", icon: Layers, color: "text-blue-500" },
                { label: "Total Users", val: "1.2k", icon: Users, color: "text-purple-500" },
                { label: "Revenue Q1", val: "$420k", icon: DollarSign, color: "text-emerald-500" },
                { label: "Inquiries", val: "48", icon: MessageSquare, color: "text-amber-500" }
              ].map((stat, i) => (
                <div key={i} className="apple-card p-6 flex flex-col justify-between">
                  <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
                  <div>
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Overview */}
            <div className="apple-card p-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-headline font-bold">Project Velocity</h3>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Global Output</p>
                  <p className="text-xl font-bold text-primary">High</p>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Lumina OS Development</span>
                    <span className="text-sm text-foreground/40">75%</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Quantum API Integration</span>
                    <span className="text-sm text-foreground/40">92%</span>
                  </div>
                  <Progress value={92} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Nexus Hub Cloud Migration</span>
                    <span className="text-sm text-foreground/40">30%</span>
                  </div>
                  <Progress value={30} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Recent Inquiries Table */}
            <div className="apple-card p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-headline font-bold">Recent Inquiries</h3>
                <Button variant="ghost" className="text-xs font-bold text-primary">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-foreground/5">
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Client</th>
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Type</th>
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Budget</th>
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {recentInquiries.map((inq, idx) => (
                      <tr key={idx} className="group hover:bg-foreground/[0.02] transition-all">
                        <td className="py-4">
                          <p className="font-bold text-sm">{inq.name}</p>
                          <p className="text-[10px] text-foreground/40">{inq.time}</p>
                        </td>
                        <td className="py-4 text-sm">{inq.project}</td>
                        <td className="py-4 text-sm font-bold">{inq.budget}</td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Notifications / Alerts */}
          <div className="lg:col-span-3 space-y-8">
            <div className="apple-card p-8 bg-primary/5 border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm">System Alerts</h4>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary/20 pl-4">
                  <p className="text-xs font-bold mb-1">Backup Successful</p>
                  <p className="text-[10px] text-foreground/40">Daily database backup completed at 03:00 UTC.</p>
                </div>
                <div className="border-l-2 border-amber-500/20 pl-4">
                  <p className="text-xs font-bold mb-1 text-amber-500">Security Audit Flag</p>
                  <p className="text-[10px] text-foreground/40">3 unusual login attempts detected from Lagos, NG.</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-8">
              <h4 className="font-bold text-sm mb-6">Team Activity</h4>
              <div className="space-y-6">
                {[
                  { name: "JoelHitech", action: "Merged #42" },
                  { name: "Admin_1", action: "Invited new client" },
                  { name: "Bot_Neural", action: "Updated model v4" }
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] font-bold">
                      {act.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{act.name}</p>
                      <p className="text-[10px] text-foreground/40">{act.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
