
"use client";

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Layers, 
  DollarSign, 
  MessageSquare,
  ShieldAlert,
  Settings,
  MoreVertical,
  Loader2,
  Download,
  FileText,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications'>('inquiries');

  // Firestore Queries
  const inquiriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const applicationsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);
  const { data: applications, loading: applicationsLoading } = useCollection(applicationsQuery);

  // Actions
  const handleStatusUpdate = async (type: 'inquiries' | 'applications', id: string, newStatus: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, type === 'inquiries' ? 'projectInquiries' : 'jobApplications', id);
      await updateDoc(docRef, { status: newStatus });
      toast({
        title: "System Update",
        description: `Status successfully updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not sync status with the neural cluster.",
      });
    }
  };

  const handleDelete = async (type: 'inquiries' | 'applications', id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to purge this record from the cluster?")) return;
    
    try {
      const docRef = doc(db, type === 'inquiries' ? 'projectInquiries' : 'jobApplications', id);
      await deleteDoc(docRef);
      toast({
        title: "Record Purged",
        description: "The technical data has been permanently removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Purge Failed",
        description: "Security protocols blocked the deletion.",
      });
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item => Object.values(item).map(val => `"${val}"`).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFMock = () => {
    toast({
      title: "PDF Engine Initializing",
      description: "Generating system report... Please use 'Print to PDF' in the next screen.",
    });
    setTimeout(() => window.print(), 1000);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 print:pt-0">
      <Navbar className="print:hidden" />
      
      <section className="container mx-auto px-6 mb-12 print:hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Enterprise Admin Command</span>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Ecosystem <br /> Overview.</h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="rounded-full h-12 px-6 border-foreground/10"
              onClick={generatePDFMock}
            >
              <FileText className="w-4 h-4 mr-2" /> System Report
            </Button>
            <Button 
              className="rounded-full h-12 px-6 bg-primary text-white font-bold"
              onClick={() => exportToCSV(activeTab === 'inquiries' ? (inquiries || []) : (applications || []), `hitech_audit_${activeTab}`)}
            >
              <Download className="w-4 h-4 mr-2" /> Export Audit
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Dashboard Stats Panel */}
          <div className="lg:col-span-12 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Project Inquiries", val: inquiries?.length || "0", icon: MessageSquare, color: "text-amber-500" },
                { label: "Job Applications", val: applications?.length || "0", icon: Users, color: "text-purple-500" },
                { label: "Active Systems", val: "14", icon: Layers, color: "text-blue-500" },
                { label: "Estimated Value", val: "$420k", icon: DollarSign, color: "text-emerald-500" }
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
          </div>

          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-4 print:hidden">
            <div className="apple-glass p-4 rounded-3xl flex flex-col gap-2">
              <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em] px-4 mb-2">Neural Channels</p>
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
                  activeTab === 'inquiries' ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
                </div>
                {inquiries?.length && <span className="text-[10px] font-bold opacity-60">{inquiries.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
                  activeTab === 'applications' ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
                </div>
                {applications?.length && <span className="text-[10px] font-bold opacity-60">{applications.length}</span>}
              </button>
            </div>

            <div className="apple-card p-8 bg-primary/5 border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm">Cluster Health</h4>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary/20 pl-4">
                  <p className="text-xs font-bold mb-1">Firestore Sync</p>
                  <p className="text-[10px] text-foreground/40">Real-time streams active on all nodes.</p>
                </div>
                <div className="border-l-2 border-green-500/20 pl-4">
                  <p className="text-xs font-bold mb-1 text-green-500">Neural Engine</p>
                  <p className="text-[10px] text-foreground/40">Consultant AI responding to inquiries.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Data Table Area */}
          <div className="lg:col-span-9 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'inquiries' ? (
                <motion.div 
                  key="inquiries"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="apple-card p-10 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-headline font-bold">Project Inquiries</h3>
                    <div className="flex gap-2">
                       {inquiriesLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                       <Filter className="w-4 h-4 text-foreground/20 cursor-pointer" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-foreground/5">
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Client</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Type / Budget</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {inquiries?.map((inq: any) => (
                          <tr key={inq.id} className="group hover:bg-foreground/[0.02] transition-all">
                            <td className="py-6">
                              <p className="font-bold text-sm">{inq.fullName}</p>
                              <p className="text-[10px] text-foreground/40">{inq.email}</p>
                              <p className="text-[10px] text-foreground/30 mt-1 italic line-clamp-1">"{inq.description}"</p>
                            </td>
                            <td className="py-6">
                              <p className="text-xs font-bold uppercase">{inq.projectType}</p>
                              <p className="text-[10px] text-foreground/40 font-bold">{inq.budget}</p>
                            </td>
                            <td className="py-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                inq.status === 'new' ? "bg-primary/10 text-primary" : 
                                inq.status === 'reviewing' ? "bg-amber-500/10 text-amber-500" :
                                "bg-green-500/10 text-green-500"
                              )}>
                                {inq.status || 'new'}
                              </span>
                            </td>
                            <td className="py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl border border-foreground/5">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="apple-glass p-2 rounded-2xl min-w-[160px]">
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('inquiries', inq.id, 'reviewing')} className="rounded-xl flex gap-2">
                                      <Layers className="w-4 h-4 text-amber-500" /> Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('inquiries', inq.id, 'contacted')} className="rounded-xl flex gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Mark Contacted
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-foreground/5" />
                                    <DropdownMenuItem onClick={() => handleDelete('inquiries', inq.id)} className="rounded-xl text-destructive focus:text-destructive flex gap-2">
                                      <Trash2 className="w-4 h-4" /> Purge Record
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(!inquiries || inquiries.length === 0) && !inquiriesLoading && (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-foreground/20 text-[10px] font-bold uppercase tracking-[0.4em]">Zero inquiries detected.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="applications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="apple-card p-10 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-headline font-bold">Talent Pipeline</h3>
                    {applicationsLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-foreground/5">
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Candidate</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Role</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                          <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {applications?.map((app: any) => (
                          <tr key={app.id} className="group hover:bg-foreground/[0.02] transition-all">
                            <td className="py-6">
                              <p className="font-bold text-sm">{app.fullName}</p>
                              <p className="text-[10px] text-foreground/40">{app.email}</p>
                              <a href={app.portfolio} target="_blank" className="text-[10px] text-primary flex items-center gap-1 mt-1 hover:underline">
                                <ExternalLink className="w-3 h-3" /> Technical Portfolio
                              </a>
                            </td>
                            <td className="py-6">
                              <p className="text-xs font-bold">{app.role}</p>
                            </td>
                            <td className="py-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                app.status === 'applied' ? "bg-purple-500/10 text-purple-500" : 
                                app.status === 'interviewing' ? "bg-blue-500/10 text-blue-500" :
                                "bg-green-500/10 text-green-500"
                              )}>
                                {app.status || 'applied'}
                              </span>
                            </td>
                            <td className="py-6 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl border border-foreground/5">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="apple-glass p-2 rounded-2xl min-w-[160px]">
                                  <DropdownMenuItem onClick={() => handleStatusUpdate('applications', app.id, 'interviewing')} className="rounded-xl flex gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-500" /> Start Interview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate('applications', app.id, 'hired')} className="rounded-xl flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Hire
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-foreground/5" />
                                  <DropdownMenuItem onClick={() => handleDelete('applications', app.id)} className="rounded-xl text-destructive focus:text-destructive flex gap-2">
                                    <Trash2 className="w-4 h-4" /> Purge Application
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                        {(!applications || applications.length === 0) && !applicationsLoading && (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-foreground/20 text-[10px] font-bold uppercase tracking-[0.4em]">Pipeline clear. No candidates detected.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer className="print:hidden" />
    </main>
  );
}
