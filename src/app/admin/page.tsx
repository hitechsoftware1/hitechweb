
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
  MessageSquare,
  ShieldAlert,
  Settings,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const db = useFirestore();
  
  const inquiriesQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const applicationsQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);
  const { data: applications, loading: applicationsLoading } = useCollection(applicationsQuery);

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
                { label: "Project Inquiries", val: inquiries?.length || "0", icon: MessageSquare, color: "text-amber-500" },
                { label: "Applications", val: applications?.length || "0", icon: Users, color: "text-purple-500" },
                { label: "Active Nodes", val: "14", icon: Layers, color: "text-blue-500" },
                { label: "Revenue Q1", val: "$420k", icon: DollarSign, color: "text-emerald-500" }
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

            {/* Recent Inquiries Table */}
            <div className="apple-card p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-headline font-bold">Recent Inquiries</h3>
                {inquiriesLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
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
                    {inquiries?.map((inq: any) => (
                      <tr key={inq.id} className="group hover:bg-foreground/[0.02] transition-all">
                        <td className="py-4">
                          <p className="font-bold text-sm">{inq.fullName}</p>
                          <p className="text-[10px] text-foreground/40">{inq.email}</p>
                        </td>
                        <td className="py-4 text-sm uppercase">{inq.projectType}</td>
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
                    {inquiries?.length === 0 && !inquiriesLoading && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-foreground/30 text-xs font-bold uppercase tracking-widest">No recent inquiries</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Applications Table */}
            <div className="apple-card p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-headline font-bold">Job Applications</h3>
                {applicationsLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-foreground/5">
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Applicant</th>
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Role</th>
                      <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {applications?.map((app: any) => (
                      <tr key={app.id} className="group hover:bg-foreground/[0.02] transition-all">
                        <td className="py-4">
                          <p className="font-bold text-sm">{app.fullName}</p>
                          <p className="text-[10px] text-foreground/40">{app.email}</p>
                        </td>
                        <td className="py-4 text-sm">{app.role}</td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {applications?.length === 0 && !applicationsLoading && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-foreground/30 text-xs font-bold uppercase tracking-widest">No recent applications</td>
                      </tr>
                    )}
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
                  <p className="text-xs font-bold mb-1">Database Sync</p>
                  <p className="text-[10px] text-foreground/40">Real-time listeners active on project clusters.</p>
                </div>
                <div className="border-l-2 border-amber-500/20 pl-4">
                  <p className="text-xs font-bold mb-1 text-amber-500">Lead Volume</p>
                  <p className="text-[10px] text-foreground/40">{inquiries?.length || 0} inquiries require review.</p>
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
