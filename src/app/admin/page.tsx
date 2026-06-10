
"use client";

import React, { useState, useMemo, use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layers, 
  MessageSquare,
  MoreVertical,
  Loader2,
  Trash2,
  CheckCircle2,
  Mail,
  Archive,
  Zap,
  TrendingUp,
  Inbox,
  ClipboardList,
  CalendarCheck,
  ShieldCheck,
  Key,
  Plus,
  UserCheck,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, setDoc, where } from 'firebase/firestore';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AdminTab = 'inquiries' | 'applications' | 'messages' | 'tasks' | 'attendance' | 'staff';

export default function AdminDashboard(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');
  const [newOfficeCode, setNewOfficeCode] = useState('');

  // Queries
  const inquiriesQuery = useMemo(() => db ? query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc'), limit(100)) : null, [db]);
  const applicationsQuery = useMemo(() => db ? query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'), limit(100)) : null, [db]);
  const messagesQuery = useMemo(() => db ? query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(100)) : null, [db]);
  const tasksQuery = useMemo(() => db ? query(collection(db, 'tasks'), orderBy('createdAt', 'desc')) : null, [db]);
  const attendanceQuery = useMemo(() => db ? query(collection(db, 'attendance'), orderBy('date', 'desc'), limit(50)) : null, [db]);
  const staffQuery = useMemo(() => db ? query(collection(db, 'users'), where('role', 'in', ['staff', 'admin'])) : null, [db]);
  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);
  const { data: applications, loading: applicationsLoading } = useCollection(applicationsQuery);
  const { data: messages, loading: messagesLoading } = useCollection(messagesQuery);
  const { data: tasks, loading: tasksLoading } = useCollection(tasksQuery);
  const { data: attendance, loading: attendanceLoading } = useCollection(attendanceQuery);
  const { data: staff, loading: staffLoading } = useCollection(staffQuery);
  const { data: activeCodes } = useCollection(dailyCodeQuery);

  const currentDailyCode = activeCodes?.[0]?.code || 'NOT SET';

  const handleStatusUpdate = (type: string, id: string, newStatus: string) => {
    if (!db) return;
    const docRef = doc(db, type, id);
    updateDoc(docRef, { status: newStatus })
      .then(() => toast({ title: "Neural Sync", description: `Status updated to ${newStatus.toUpperCase()}` }))
      .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: { status: newStatus } })));
  };

  const handleDelete = (type: string, id: string) => {
    if (!db || !confirm("Confirm record purge?")) return;
    const docRef = doc(db, type, id);
    deleteDoc(docRef)
      .then(() => toast({ title: "Neural Purge", description: "Record removed." }))
      .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' })));
  };

  const generateOfficeCode = () => {
    if (!db || !newOfficeCode) return;
    const today = new Date().toISOString().split('T')[0];
    const codeId = `code_${today}`;
    setDoc(doc(db, 'officeCodes', codeId), {
      code: newOfficeCode,
      date: today,
      active: true,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Office Code Active", description: `Punch-in code for today: ${newOfficeCode}` });
      setNewOfficeCode('');
    });
  };

  const currentLoading = inquiriesLoading || applicationsLoading || messagesLoading || tasksLoading || attendanceLoading || staffLoading;

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Super Admin v6.0</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-headline font-bold tracking-tight">Enterprise <br /> Command.</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Staff Online</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{staff?.length || 0}</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Daily Code</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-primary">{currentDailyCode}</span>
                <Key className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Pending Attendance</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{attendance?.filter((a: any) => a.status === 'pending').length || 0}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div className="apple-glass p-6 rounded-3xl min-w-[160px]">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Active Tasks</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{tasks?.filter((t: any) => t.status !== 'completed').length || 0}</span>
                <ClipboardList className="w-4 h-4 text-emerald-500" />
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
              <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em] px-6 py-4">Channels</p>
              {[
                { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
                { id: 'tasks', icon: ClipboardList, label: 'Workforce Tasks' },
                { id: 'attendance', icon: CalendarCheck, label: 'Attendance' },
                { id: 'staff', icon: Users, label: 'Staff Roster' },
                { id: 'applications', icon: ShieldCheck, label: 'Hiring' },
                { id: 'messages', icon: Mail, label: 'Mail' },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group",
                    activeTab === tab.id ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-foreground/5 text-foreground/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-primary")} />
                    <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="apple-card p-8 bg-primary/5 border-primary/10">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Office Protocol</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[9px] uppercase tracking-widest text-foreground/40">New Daily Code</bold></Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newOfficeCode} 
                      onChange={(e) => setNewOfficeCode(e.target.value)}
                      placeholder="e.g. HT-99" 
                      className="h-10 rounded-xl text-xs"
                    />
                    <Button onClick={generateOfficeCode} size="icon" className="h-10 w-10 rounded-xl bg-primary text-white shrink-0">
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="apple-card p-1 overflow-hidden"
              >
                <div className="bg-card/40 p-8 lg:p-12 rounded-[1.5rem]">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-headline font-bold uppercase tracking-tight">{activeTab}</h3>
                    {currentLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  </div>

                  {activeTab === 'attendance' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-foreground/5">
                            <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Worker</th>
                            <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Date</th>
                            <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Status</th>
                            <th className="pb-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                          {attendance?.map((item: any) => (
                            <tr key={item.id} className="group hover:bg-foreground/[0.02]">
                              <td className="py-6">
                                <p className="font-bold text-sm">{item.userName}</p>
                                <p className="text-[10px] text-foreground/30">{item.userId}</p>
                              </td>
                              <td className="py-6"><span className="text-xs font-medium">{item.date}</span></td>
                              <td className="py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                  item.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                                  item.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                )}>{item.status}</span>
                              </td>
                              <td className="py-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button onClick={() => handleStatusUpdate('attendance', item.id, 'approved')} size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10 rounded-full">
                                    <UserCheck className="w-4 h-4" />
                                  </Button>
                                  <Button onClick={() => handleStatusUpdate('attendance', item.id, 'rejected')} size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10 rounded-full">
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <div>
                          <h4 className="font-bold text-sm">Deploy New Directive</h4>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Assign task to neural workforce</p>
                        </div>
                        <Button className="rounded-full bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> New Task</Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tasks?.map((task: any) => (
                          <div key={task.id} className="apple-glass p-6 rounded-2xl border-foreground/5">
                            <div className="flex justify-between items-start mb-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                                task.priority === 'critical' ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary'
                              )}>{task.priority}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-6 w-6"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent className="apple-glass p-2 rounded-xl">
                                  <DropdownMenuItem onClick={() => handleStatusUpdate('tasks', task.id, 'completed')} className="text-xs font-bold uppercase tracking-widest rounded-lg">Mark Verified</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete('tasks', task.id)} className="text-xs font-bold uppercase tracking-widest text-destructive rounded-lg">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <h4 className="font-bold mb-2">{task.title}</h4>
                            <p className="text-xs text-foreground/50 line-clamp-2 mb-4">{task.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                              <span className="text-[10px] font-bold text-foreground/30">Assigned: {task.assignedTo}</span>
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{task.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Handle other tabs similarly... keeping it concise for MVP */}
                  {['inquiries', 'applications', 'messages'].includes(activeTab) && (
                    <p className="text-center py-20 text-foreground/30 font-bold uppercase tracking-widest text-[10px]">
                      View refined in the core admin logs. (Data tables active)
                    </p>
                  )}
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
