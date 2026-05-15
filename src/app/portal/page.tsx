
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Settings, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ClientPortal() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "System Request",
      description: `Initiating: ${action}. Please wait while we fetch the latest data from the neural cluster.`,
    });
  };

  const handleStaging = () => {
    toast({
      title: "Staging Environment",
      description: "Redirecting to your secure staging environment...",
    });
    // Simulating redirect
    setTimeout(() => {
      window.open('https://staging.hitech.systems', '_blank');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Enterprise Command Center</span>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Welcome, <br /> Innovator.</h1>
          </div>
          <div className="apple-glass px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">System Health</p>
              <p className="text-sm font-bold">99.98% Active</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { icon: LayoutDashboard, name: "Dashboard", active: true },
              { icon: MessageSquare, name: "Discussions", count: 3 },
              { icon: FileText, name: "Deliverables" },
              { icon: Calendar, name: "Timeline" },
              { icon: Settings, name: "Environment" }
            ].map((item, i) => (
              <button 
                key={i}
                onClick={() => handleAction(item.name)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all group",
                  item.active ? "bg-primary text-white" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{item.name}</span>
                </div>
                {item.count && (
                  <span className="w-5 h-5 rounded-full bg-accent text-[10px] flex items-center justify-center font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Project Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Build Progress</h4>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-headline font-bold mb-4">Phase 3</p>
                <Progress value={75} className="h-2 mb-4" />
                <p className="text-xs text-foreground/40 font-medium">Integration & Neural Tuning</p>
              </div>

              <div className="apple-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Active Sprint</h4>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-headline font-bold mb-2">Sprint 12</p>
                <p className="text-xs text-foreground/40 font-medium">14 tasks completed / 2 pending</p>
              </div>

              <div className="apple-card p-8 border-accent/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Next Milestone</h4>
                  <AlertCircle className="w-4 h-4 text-accent" />
                </div>
                <p className="text-3xl font-headline font-bold mb-2">Beta Release</p>
                <p className="text-xs text-foreground/40 font-medium">Scheduled for March 24, 2024</p>
              </div>
            </div>

            {/* Recent Activity / Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="apple-card p-10">
                <h3 className="text-xl font-headline font-bold mb-8">Recent Activity</h3>
                <div className="space-y-6">
                  {[
                    { title: "API Documentation updated", time: "2h ago", user: "JoelHitech" },
                    { title: "Dashboard UI Refinement", time: "5h ago", user: "Design Team" },
                    { title: "Staging deployment successful", time: "1d ago", user: "SRE Lead" }
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-4 border-l-2 border-primary/20 pl-6 pb-2">
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{act.title}</p>
                        <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest mt-1">{act.time} // {act.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="apple-card p-10 bg-primary/5 border-primary/10">
                <h3 className="text-xl font-headline font-bold mb-8">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background">
                    <Link href="/contact" className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Contact Lead</span>
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => handleAction("Loading Technical Specifications")}
                    variant="outline" 
                    className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">View Specs</span>
                  </Button>
                  <Button 
                    onClick={handleStaging}
                    variant="outline" 
                    className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background"
                  >
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Staging Link</span>
                  </Button>
                  <Button 
                    onClick={() => handleAction("Opening Environment Settings")}
                    variant="outline" 
                    className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background"
                  >
                    <Settings className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                  </Button>
                </div>
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
