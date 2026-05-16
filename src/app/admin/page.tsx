
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
  MoreVertical,
  Loader2,
  Download,
  FileText,
  Trash2,
  CheckCircle2,
  Filter,
  ArrowRight,
  Mail,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications' | 'messages'>('inquiries');

  // Firestore Queries
  const inquiriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const applicationsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const messagesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(50));
  }, [db]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);
  const { data: applications, loading: applicationsLoading } = useCollection(applicationsQuery);
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  // Actions
  const handleStatusUpdate = async (type: string, id: string, newStatus: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, type, id);
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

  const handleDelete = async (type: string, id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to purge this record?")) return;
    
    try {
      const docRef = doc(db, type, id);
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

  const currentData = activeTab === 'inquiries' ? inquiries : activeTab === 'applications' ? applications : messages;
  const currentLoading = activeTab === 'inquiries' ? inquiriesLoading : activeTab === 'applications' ? applicationsLoading : messagesLoading;

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
              className="rounded-full h-12 px-6 bg-primary text-white font-bold"
              onClick={() => exportToCSV(currentData || [], `hitech_audit_${activeTab}`)}
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
                { label: "System Messages", val: messages?.length || "0", icon: Mail, color: "text-blue-500" },
                { label: "Active Systems", val: "14", icon: Layers, color: "text-emerald-500" }
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
                  activeTab === 'inquiries' ? "bg-primary text-white" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Projects</span>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
                  activeTab === 'applications' ? "bg-primary text-white" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Talent</span>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
                  activeTab === 'messages' ? "bg-primary text-white" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Mailbox</span>
                </div>
              </button>
            </div>

            <div className="apple-card p-8 bg-primary/5 border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm">Cluster Health</h4>
              </div>
              <div className="space-y-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                <p>History Logging: ACTIVE</p>
                <p>Neural Storage: SYNCED</p>
              </div>
            </div>
          </div>

          {/* Main Data Table Area */}
          <div className="lg:col-span-9 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="apple-card p-10 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-headline font-bold">
                    {activeTab === 'inquiries' ? 'Project Inquiries' : activeTab === 'applications' ? 'Talent Pipeline' : 'System Mailbox'}
                  </h3>
                  {currentLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-foreground/5">
                        <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Sender / Context</th>
                        <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                        <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {currentData?.map((item: any) => (
                        <tr key={item.id} className="group hover:bg-foreground/[0.02] transition-all">
                          <td className="py-6">
                            <p className="font-bold text-sm">{item.fullName}</p>
                            <p className="text-[10px] text-foreground/40">{item.email}</p>
                            <p className="text-[10px] text-foreground/30 mt-1 italic line-clamp-2">
                              {activeTab === 'messages' ? item.message : activeTab === 'inquiries' ? `${item.projectType}: ${item.description}` : `${item.role}`}
                            </p>
                          </td>
                          <td className="py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                              item.status === 'new' || item.status === 'applied' || item.status === 'unread' ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"
                            )}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="apple-glass p-2 rounded-2xl min-w-[160px]">
                                {activeTab === 'messages' && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate('contactMessages', item.id, 'read')} className="rounded-xl flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Mark Read
                                  </DropdownMenuItem>
                                )}
                                {activeTab === 'inquiries' && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate('projectInquiries', item.id, 'reviewing')} className="rounded-xl flex gap-2">
                                    <Layers className="w-4 h-4 text-amber-500" /> Review
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator className="bg-foreground/5" />
                                <DropdownMenuItem onClick={() => handleDelete(activeTab === 'inquiries' ? 'projectInquiries' : activeTab === 'applications' ? 'jobApplications' : 'contactMessages', item.id)} className="rounded-xl text-destructive flex gap-2">
                                  <Trash2 className="w-4 h-4" /> Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {(!currentData || currentData.length === 0) && !currentLoading && (
                        <tr>
                          <td colSpan={3} className="py-20 text-center text-foreground/20 text-[10px] font-bold uppercase tracking-[0.4em]">Cluster clear.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer className="print:hidden" />
    </main>
  );
}
