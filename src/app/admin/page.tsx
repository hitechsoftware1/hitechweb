
"use client";

import React, { useState, useMemo, use } from 'react';
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
  Archive,
  RefreshCcw,
  Zap,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminDashboard(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications' | 'messages'>('inquiries');

  const inquiriesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc'), limit(100));
  }, [db]);

  const applicationsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'), limit(100));
  }, [db]);

  const messagesQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(100));
  }, [db]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);
  const { data: applications, loading: applicationsLoading } = useCollection(applicationsQuery);
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);

  const handleStatusUpdate = (type: string, id: string, newStatus: string) => {
    if (!db) return;
    const docRef = doc(db, type, id);
    
    updateDoc(docRef, { status: newStatus })
      .then(() => {
        toast({
          title: "Neural Sync",
          description: `Entity status updated to: ${newStatus.toUpperCase()}`,
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = (type: string, id: string) => {
    if (!db) return;
    if (!confirm("Confirm record purge? This action is irreversible.")) return;
    
    const docRef = doc(db, type, id);
    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Neural Purge",
          description: "Record removed from local and cloud clusters.",
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const currentData = activeTab === 'inquiries' ? inquiries : activeTab === 'applications' ? applications : messages;
  const currentLoading = activeTab === 'inquiries' ? inquiriesLoading : activeTab === 'applications' ? applicationsLoading : messagesLoading;

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      {/* Header Strategy Row */}
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Enterprise Core v5.2</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-headline font-bold tracking-tight">HITECH <br /> Dashboard.</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Total Leads</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{inquiries?.length || 0}</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Talent Pool</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{applications?.length || 0}</span>
                <Users className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">System Health</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">100%</span>
                <Zap className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Inbox</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{messages?.length || 0}</span>
                <Inbox className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="apple-glass p-4 rounded-[2rem] flex flex-col gap-2">
              <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em] px-6 py-4">Neural Channels</p>
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group",
                  activeTab === 'inquiries' ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className={cn("w-5 h-5", activeTab === 'inquiries' ? "text-white" : "text-primary")} />
                  <span className="text-xs font-bold uppercase tracking-widest">Project Vision</span>
                </div>
                {inquiries && <span className="text-[10px] font-bold opacity-40">{inquiries.length}</span>}
              </button>
              
              <button 
                onClick={() => setActiveTab('applications')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group",
                  activeTab === 'applications' ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <Users className={cn("w-5 h-5", activeTab === 'applications' ? "text-white" : "text-accent")} />
                  <span className="text-xs font-bold uppercase tracking-widest">Talent Feed</span>
                </div>
                {applications && <span className="text-[10px] font-bold opacity-40">{applications.length}</span>}
              </button>

              <button 
                onClick={() => setActiveTab('messages')}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group",
                  activeTab === 'messages' ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <Mail className={cn("w-5 h-5", activeTab === 'messages' ? "text-white" : "text-amber-500")} />
                  <span className="text-xs font-bold uppercase tracking-widest">Neural Mail</span>
                </div>
                {messages && <span className="text-[10px] font-bold opacity-40">{messages.length}</span>}
              </button>
            </div>

            <div className="apple-card p-8 bg-primary/5 border-primary/10">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Command Status</h4>
              <div className="flex items-center gap-4 text-xs font-medium text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Synchronization Active
              </div>
              <p className="text-[10px] text-foreground/30 mt-4 leading-relaxed">
                All changes made in the dashboard are synchronized across the global HITECH cluster instantly.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="apple-card p-1 lg:p-2 overflow-hidden shadow-2xl"
              >
                <div className="bg-card/40 p-8 lg:p-12 rounded-[1.5rem]">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {activeTab === 'inquiries' && <MessageSquare className="w-6 h-6 text-primary" />}
                        {activeTab === 'applications' && <Users className="w-6 h-6 text-primary" />}
                        {activeTab === 'messages' && <Mail className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-headline font-bold">
                          {activeTab === 'inquiries' ? 'Project Vision Pipeline' : activeTab === 'applications' ? 'Talent Acquisition' : 'Neural Inbox'}
                        </h3>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mt-1">Real-time throughput analysis</p>
                      </div>
                    </div>
                    {currentLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-foreground/5">
                          <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Entity Details</th>
                          <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Lifecycle Status</th>
                          <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {currentData?.map((item: any) => (
                          <tr key={item.id} className="group hover:bg-foreground/[0.02] transition-all duration-500">
                            <td className="py-8 pr-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <p className="font-bold text-base text-foreground/90">{item.fullName}</p>
                                  {activeTab === 'inquiries' && (
                                    <span className="text-[8px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{item.projectType}</span>
                                  )}
                                  {activeTab === 'applications' && (
                                    <span className="text-[8px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-widest">{item.role}</span>
                                  )}
                                </div>
                                <p className="text-xs text-foreground/40 font-medium">{item.email}</p>
                                {item.company && <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.company}</p>}
                                <div className="mt-4 max-w-xl">
                                  <p className="text-xs text-foreground/50 font-light leading-relaxed line-clamp-2 italic border-l-2 border-foreground/10 pl-4">
                                    {activeTab === 'messages' ? item.message : activeTab === 'inquiries' ? item.description : item.coverLetter}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-8">
                              <div className="flex flex-col gap-2">
                                <span className={cn(
                                  "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] w-fit",
                                  ["new", "applied", "unread"].includes(item.status) 
                                    ? "bg-primary/10 text-primary animate-pulse" 
                                    : ["reviewing", "interviewing"].includes(item.status)
                                      ? "bg-amber-500/10 text-amber-500"
                                      : "bg-green-500/10 text-green-500"
                                )}>
                                  {item.status}
                                </span>
                                <p className="text-[9px] text-foreground/20 font-bold uppercase tracking-widest">
                                  {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Active'}
                                </p>
                              </div>
                            </td>
                            <td className="py-8 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-2xl hover:bg-foreground/5 transition-all">
                                    <MoreVertical className="w-5 h-5 text-foreground/40" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="apple-glass p-3 rounded-2xl min-w-[200px] border-foreground/10 shadow-2xl">
                                  <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] px-2 mb-3">Command Options</p>
                                  
                                  {activeTab === 'messages' && item.status !== 'read' && (
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('contactMessages', item.id, 'read')} className="rounded-xl flex gap-3 py-3 px-4 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer">
                                      <CheckCircle2 className="w-4 h-4 text-green-500" /> <span className="font-bold text-xs uppercase tracking-widest">Mark as Read</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {activeTab === 'inquiries' && item.status !== 'reviewing' && (
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('projectInquiries', item.id, 'reviewing')} className="rounded-xl flex gap-3 py-3 px-4 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer">
                                      <Layers className="w-4 h-4 text-amber-500" /> <span className="font-bold text-xs uppercase tracking-widest">Start Review</span>
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {activeTab === 'applications' && item.status !== 'interviewing' && (
                                    <DropdownMenuItem onClick={() => handleStatusUpdate('jobApplications', item.id, 'interviewing')} className="rounded-xl flex gap-3 py-3 px-4 focus:bg-primary/10 focus:text-primary transition-all cursor-pointer">
                                      <Users className="w-4 h-4 text-purple-500" /> <span className="font-bold text-xs uppercase tracking-widest">Schedule Screen</span>
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuSeparator className="bg-foreground/5 my-2" />
                                  
                                  <DropdownMenuItem onClick={() => handleDelete(activeTab === 'inquiries' ? 'projectInquiries' : activeTab === 'applications' ? 'jobApplications' : 'contactMessages', item.id)} className="rounded-xl text-destructive flex gap-3 py-3 px-4 focus:bg-destructive/10 focus:text-destructive transition-all cursor-pointer font-bold">
                                    <Trash2 className="w-4 h-4" /> <span className="text-xs uppercase tracking-widest">Neural Purge</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                        
                        {(!currentData || currentData.length === 0) && !currentLoading && (
                          <tr>
                            <td colSpan={3} className="py-32 text-center">
                              <div className="flex flex-col items-center gap-6 opacity-20">
                                <Archive className="w-16 h-16" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Neural cluster is currently clear</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

