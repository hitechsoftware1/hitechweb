"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Users, 
  Clock, 
  ClipboardList, 
  FileCheck, 
  Layers, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Plus,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  Loader2,
  Settings,
  UserCheck
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, updateDoc, doc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type SystemTab = 'Workforce' | 'Tasks' | 'Projects' | 'Approvals' | 'Access';

export default function SystemArchitecturePortal() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SystemTab>('Workforce');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // Queries
  const { data: attendance } = useCollection(db ? query(collection(db, 'attendance'), orderBy('date', 'desc')) : null);
  const { data: tasks } = useCollection(db ? query(collection(db, 'tasks'), orderBy('createdAt', 'desc')) : null);
  const { data: staff } = useCollection(db ? query(collection(db, 'users'), where('role', 'in', ['staff', 'admin'])) : null);
  const { data: requisitions } = useCollection(db ? query(collection(db, 'requisitions'), orderBy('createdAt', 'desc')) : null);
  const { data: projects } = useCollection(db ? query(collection(db, 'projects'), orderBy('startDate', 'desc')) : null);
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), where('status', '==', 'new')) : null);

  // States
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.href = '/';
    });
  };

  const updateAttendanceStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'attendance', id), { status })
      .then(() => toast({ title: "Attendance Verified", description: `Record marked as ${status}.` }))
      .catch(() => toast({ variant: "destructive", title: "Update Failed" }));
  };

  const updateReqStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'requisitions', id), { status })
      .then(() => toast({ title: "Requisition Updated", description: `Status set to ${status}.` }))
      .catch(() => toast({ variant: "destructive", title: "Update Failed" }));
  };

  const generateProjectFromInquiry = async (inquiry: any) => {
    if (!db) return;
    const projectData = {
      title: `${inquiry.fullName} - ${inquiry.projectType.toUpperCase()} Project`,
      clientName: inquiry.fullName,
      clientId: inquiry.email,
      description: inquiry.description,
      status: 'active',
      progress: 0,
      startDate: serverTimestamp(),
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, 'projects'), projectData)
      .then(async () => {
        await updateDoc(doc(db, 'projectInquiries', inquiry.id), { status: 'closed' });
        toast({ title: "Project Generated", description: `A new active portal has been provisioned for ${inquiry.fullName}.` });
      })
      .catch(() => toast({ variant: "destructive", title: "Generation Failed" }));
  };

  const sidebarItems = [
    { label: 'Workforce', icon: Clock },
    { label: 'Tasks', icon: ClipboardList },
    { label: 'Projects', icon: Layers },
    { label: 'Approvals', icon: FileCheck },
    { label: 'Access', icon: Users },
  ];

  const renderWorkforce = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Workforce Presence</h1>
          <p className="text-sm text-zinc-400 font-medium">Verify and confirm daily worker punch-ins.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Code Used</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {attendance?.map((log: any, i) => (
              <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{log.userName}</p>
                </td>
                <td className="px-8 py-6 text-[10px] font-bold text-zinc-400 uppercase">{log.date}</td>
                <td className="px-8 py-6 text-xs font-medium text-zinc-600 dark:text-zinc-300 font-mono tracking-widest">{log.officeCodeUsed}</td>
                <td className="px-8 py-6">
                   <Badge variant="outline" className={cn(
                      "text-[9px] font-bold uppercase",
                      log.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                      log.status === 'pending' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-red-500/20 text-red-500 bg-red-500/5'
                    )}>{log.status}</Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => updateAttendanceStatus(log.id, 'approved')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500 hover:bg-green-50"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button onClick={() => updateAttendanceStatus(log.id, 'rejected')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!attendance || attendance.length === 0) && (
          <div className="p-32 flex flex-col items-center justify-center text-center opacity-40">
             <Clock className="w-12 h-12 mb-4" />
             <p className="text-sm font-medium italic">No attendance records logs found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderTasks = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Task Assignment</h1>
          <p className="text-sm text-zinc-400 font-medium">Issue mission directives to HITECH engineering units.</p>
        </div>
        <Button onClick={() => setIsNewTaskOpen(true)} className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> New Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map((task: any, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-none font-bold text-[8px] uppercase tracking-widest">{task.priority}</Badge>
               <span className="text-[10px] text-zinc-400 font-bold uppercase">{task.status}</span>
             </div>
             <div>
               <h4 className="font-bold text-sm leading-tight mb-1">{task.title}</h4>
               <p className="text-[10px] text-zinc-400 line-clamp-2">{task.description}</p>
             </div>
             <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {task.assignedToName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{task.assignedToName}</span>
                </div>
                <button className="text-zinc-300 hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Project Portals</h1>
          <p className="text-sm text-zinc-400 font-medium">Manage active client portals and generate new projects from inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
             <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
                <h3 className="text-sm font-bold uppercase tracking-widest">Active Portals</h3>
             </div>
             <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
               {projects?.map((proj: any, i) => (
                 <div key={i} className="p-8 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                    <div>
                       <h4 className="font-bold text-sm mb-1">{proj.title}</h4>
                       <p className="text-[10px] text-zinc-400 font-medium">{proj.clientName} • {proj.status}</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-24 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${proj.progress}%` }} />
                       </div>
                       <Button variant="ghost" size="icon" className="rounded-xl"><ExternalLink className="w-4 h-4" /></Button>
                    </div>
                 </div>
               ))}
               {(!projects || projects.length === 0) && <p className="p-20 text-center text-zinc-400 italic">No active projects found.</p>}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Pending Inquiries</h3>
              <p className="text-[10px] text-zinc-400 font-medium mb-6">Convert approved leads into live project portals.</p>
              <div className="space-y-4">
                {inquiries?.map((inq: any, i) => (
                  <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group">
                    <p className="text-xs font-bold mb-1">{inq.fullName}</p>
                    <p className="text-[10px] text-zinc-400 mb-4">{inq.projectType}</p>
                    <Button onClick={() => generateProjectFromInquiry(inq)} size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-primary hover:text-white hover:border-primary transition-all">
                       Generate Portal
                    </Button>
                  </div>
                ))}
                {(!inquiries || inquiries.length === 0) && <p className="text-center text-zinc-400 text-xs italic">No new inquiries.</p>}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const renderApprovals = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Financial Approvals</h1>
          <p className="text-sm text-zinc-400 font-medium">Review and approve requisitions, fund requests, and advance retainers.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Requestor</th>
              <th className="px-8 py-5">Title</th>
              <th className="px-8 py-5">Amount (UGX)</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {requisitions?.map((req: any, i) => (
              <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{req.userName}</p>
                </td>
                <td className="px-8 py-6 text-xs font-medium text-zinc-600 dark:text-zinc-300">{req.title}</td>
                <td className="px-8 py-6 font-mono font-bold text-xs">{(req.totalAmount || 0).toLocaleString()}</td>
                <td className="px-8 py-6">
                   <Badge variant="outline" className={cn(
                      "text-[9px] font-bold uppercase",
                      req.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                      req.status === 'submitted' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-red-500/20 text-red-500 bg-red-500/5'
                    )}>{req.status}</Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => updateReqStatus(req.id, 'approved')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button onClick={() => updateReqStatus(req.id, 'rejected')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!requisitions || requisitions.length === 0) && (
          <div className="p-32 flex flex-col items-center justify-center text-center opacity-40">
             <FileCheck className="w-12 h-12 mb-4" />
             <p className="text-sm font-medium italic">No pending requisitions logs found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5 shrink-0">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs tracking-tight uppercase">HITECH</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">SYSTEM</span>
            </div>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">ARCHITECTURE</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as SystemTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" 
                    : "text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400 group-hover:text-zinc-500")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Portals hub
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Workforce' && renderWorkforce()}
          {activeTab === 'Tasks' && renderTasks()}
          {activeTab === 'Projects' && renderProjects()}
          {activeTab === 'Approvals' && renderApprovals()}
          {activeTab === 'Access' && (
             <motion.div key="access" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-32 flex flex-col items-center justify-center text-center opacity-40">
                <ShieldCheck className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium italic">User Permissions & Role Registry is initializing...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* New Task Dialog */}
      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>Issue Mission Directive</DialogTitle>
            <DialogDescription>Assign a new mission task to an engineering unit.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const taskData = {
              title: formData.get('title'),
              description: formData.get('description'),
              assignedTo: formData.get('staff'),
              assignedToName: staff?.find((s: any) => s.uid === formData.get('staff'))?.displayName || 'Unknown',
              priority: formData.get('priority'),
              status: 'todo',
              createdAt: serverTimestamp()
            };
            addDoc(collection(db!, 'tasks'), taskData).then(() => {
              toast({ title: "Task Issued" });
              setIsNewTaskOpen(false);
            });
          }}>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Task Title</Label>
              <Input name="title" required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Directives</Label>
              <Input name="description" required className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Unit Assignment</Label>
                  <select name="staff" required className="w-full h-11 bg-background border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-sm outline-none">
                    {staff?.map((s: any) => <option key={s.uid} value={s.uid}>{s.displayName}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Priority Level</Label>
                  <select name="priority" required className="w-full h-11 bg-background border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-sm outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
               </div>
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px]">Transmit Directive</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
