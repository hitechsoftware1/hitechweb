
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
  UserCheck,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
  DollarSign,
  Monitor,
  Target,
  Calendar,
  AlertTriangle,
  Key
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, updateDoc, doc, addDoc, serverTimestamp, where, deleteDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SystemTab = 'Workforce' | 'Tasks' | 'Projects' | 'Approvals' | 'Access';

export default function SystemArchitecturePortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SystemTab>('Workforce');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // Clearance Check
  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== 'hitechsoftware03@gmail.com') {
        router.push('/admin');
        toast({ variant: "destructive", title: "Access Restricted", description: "Super Admin clearance required." });
      }
    }
  }, [user, userLoading, router, toast]);

  // Real-time Queries
  const { data: attendance } = useCollection(db ? query(collection(db, 'attendance'), orderBy('date', 'desc')) : null);
  const { data: tasks } = useCollection(db ? query(collection(db, 'tasks'), orderBy('createdAt', 'desc')) : null);
  const { data: projects } = useCollection(db ? query(collection(db, 'projects'), orderBy('startDate', 'desc')) : null);
  const { data: profiles } = useCollection(db ? query(collection(db, 'users'), orderBy('joinedAt', 'desc')) : null);
  const { data: requisitions } = useCollection(db ? query(collection(db, 'requisitions'), orderBy('createdAt', 'desc')) : null);
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), where('status', '==', 'new')) : null);

  // Modal States
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [newTaskLoading, setNewTaskLoading] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);

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

  // --- ACTIONS ---

  const updateAttendanceStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'attendance', id), { status })
      .then(() => toast({ title: "Attendance Processed", description: `Record marked as ${status}.` }))
      .catch(() => toast({ variant: "destructive", title: "Update Failed" }));
  };

  const updateTaskStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'tasks', id), { status })
      .then(() => toast({ title: "Directive Updated", description: `Task status: ${status}.` }));
  };

  const updateRequisitionStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'requisitions', id), { status })
      .then(() => toast({ title: "Requisition Processed", description: `Fund request ${status}.` }))
      .catch(() => toast({ variant: "destructive", title: "Process Failed" }));
  };

  const promoteToProject = async (inquiry: any) => {
    if (!db) return;
    try {
      const projectData = {
        title: inquiry.fullName + " - " + (inquiry.projectType?.toUpperCase() || "NEW PROJECT"),
        clientName: inquiry.fullName,
        clientId: inquiry.email,
        description: inquiry.description,
        status: 'active',
        progress: 0,
        startDate: serverTimestamp(),
      };
      await addDoc(collection(db, 'projects'), projectData);
      await updateDoc(doc(db, 'projectInquiries', inquiry.id), { status: 'closed' });
      toast({ title: "Strategic Link Active", description: "Portal generated for " + inquiry.fullName });
    } catch (e) {
      toast({ variant: "destructive", title: "Generation Failed" });
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setNewTaskLoading(true);

    const formData = new FormData(e.currentTarget);
    const assignedToUid = formData.get('assignedTo') as string;
    const worker = profiles?.find(p => p.uid === assignedToUid);

    const taskData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      assignedTo: assignedToUid,
      assignedToName: worker?.displayName || 'Unknown Worker',
      priority: formData.get('priority') as string,
      status: 'todo',
      dueDate: formData.get('dueDate') as string,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'tasks'), taskData);
      toast({ title: "Directive Dispatched", description: "Task assigned to " + taskData.assignedToName });
      setIsNewTaskOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Dispatch Failed" });
    } finally {
      setNewTaskLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setNewUserLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const salary = parseFloat(formData.get('salary') as string) || 0;
    const password = formData.get('password') as string;

    try {
      const newUserRef = doc(collection(db, 'users'));
      await setDoc(newUserRef, {
        uid: newUserRef.id,
        email,
        displayName: name,
        role,
        salary,
        accessiblePortals: selectedPortals,
        joinedAt: serverTimestamp()
      });

      // Transmit onboarding email via Mail Bridge
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          to: email,
          fullName: name,
          email,
          password,
          role: role === 'admin' ? 'Administrator' : 'Engineering Staff',
          type: "Worker Onboarding"
        }),
      });

      toast({ title: "Identity Provisioned", description: `${name} has been notified with credentials.` });
      setIsNewUserOpen(false);
      setSelectedPortals([]);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Provisioning Error", description: error.message });
    } finally {
      setNewUserLoading(false);
    }
  };

  // --- RENDERERS ---

  const renderWorkforce = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Workforce Presence</h1>
        <p className="text-sm text-zinc-400 font-medium">Verify shift integrity and process worker punch-ins.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Staff Identity</th>
              <th className="px-8 py-5">Temporal Node</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Clearance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {attendance?.map((log: any) => (
              <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{log.userName}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">CODE: {log.officeCodeUsed}</p>
                </td>
                <td className="px-8 py-6 text-[10px] font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">{log.date}</td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold uppercase",
                    log.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                    log.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                    'border-amber-500/20 text-amber-500 bg-amber-500/5'
                  )}>{log.status}</Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => updateAttendanceStatus(log.id, 'approved')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button onClick={() => updateAttendanceStatus(log.id, 'rejected')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderTasks = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Mission Directives</h1>
          <p className="text-sm text-zinc-400 font-medium">Assign architectural objectives to the engineering workforce.</p>
        </div>
        <Button onClick={() => setIsNewTaskOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Directive
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tasks?.map((task: any) => (
          <div key={task.id} className="apple-card p-8 group">
            <div className="flex justify-between items-start mb-6">
              <Badge variant="outline" className={cn(
                "text-[8px] font-bold uppercase tracking-widest",
                task.priority === 'critical' ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-primary/20 text-primary'
              )}>{task.priority}</Badge>
              <Select value={task.status} onValueChange={(val) => updateTaskStatus(task.id, val)}>
                <SelectTrigger className="w-32 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 border-none text-[8px] font-bold uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{task.title}</h4>
            <p className="text-xs text-zinc-400 line-clamp-2 mb-6">{task.description}</p>
            <div className="flex justify-between items-center pt-6 border-t border-zinc-50 dark:border-zinc-800">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold uppercase">
                     {task.assignedToName?.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">{task.assignedToName}</span>
               </div>
               <span className="text-[9px] font-medium text-zinc-400">DUE: {task.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Strategic Intake</h1>
          <p className="text-sm text-zinc-400 font-medium">Promote new client inquiries into live project portals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries?.map((inq: any) => (
            <div key={inq.id} className="apple-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-primary text-white border-none text-[8px] uppercase tracking-widest">{inq.projectType}</Badge>
                  <span className="text-[10px] font-bold text-zinc-400">{inq.budget}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{inq.fullName}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-8">{inq.description}</p>
              </div>
              <Button onClick={() => promoteToProject(inq)} className="w-full rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" /> Generate Portal
              </Button>
            </div>
          ))}
          {(!inquiries || inquiries.length === 0) && <div className="col-span-full p-12 text-center text-zinc-400 italic text-xs">Queue is clear. No new inquiries.</div>}
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight">Active Infrastructure</h2>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
              <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <th className="px-8 py-5">Portal Identity</th>
                <th className="px-8 py-5">Status / Load</th>
                <th className="px-8 py-5 text-right">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {projects?.map((proj: any) => (
                <tr key={proj.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold">{proj.title}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">{proj.clientName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[8px] font-bold uppercase">{proj.status}</Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">{proj.progress || 0}% SYNCED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderApprovals = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Financial Directives</h1>
        <p className="text-sm text-zinc-400 font-medium">Review and process institutional fund or material requisitions.</p>
      </div>

      <div className="space-y-4">
        {requisitions?.map((req: any) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="font-bold text-base">{req.title}</h4>
                   <Badge variant="outline" className={cn(
                     "text-[8px] font-bold uppercase tracking-widest",
                     req.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                     req.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-zinc-200'
                   )}>{req.status}</Badge>
                </div>
                <p className="text-xs text-zinc-400 font-medium">{req.userName} • {req.department} • <span className="text-primary font-bold">UGX {req.totalAmount?.toLocaleString()}</span></p>
              </div>
            </div>
            {req.status === 'submitted' && (
              <div className="flex gap-3">
                <Button onClick={() => updateRequisitionStatus(req.id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-11 px-6 font-bold text-xs">Authorize</Button>
                <Button onClick={() => updateRequisitionStatus(req.id, 'rejected')} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-50 rounded-xl h-11 px-6 font-bold text-xs">Deny</Button>
              </div>
            )}
          </div>
        ))}
        {(!requisitions || requisitions.length === 0) && <div className="p-20 text-center text-zinc-400 italic text-xs">Institutional ledger is balanced. No pending requisitions.</div>}
      </div>
    </motion.div>
  );

  const renderAccess = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Identity Provisioning</h1>
          <p className="text-sm text-zinc-400 font-medium">Onboard workforce units and define architectural clearance levels.</p>
        </div>
        <Button onClick={() => setIsNewUserOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Onboard Worker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles?.map((profile: any) => (
          <div key={profile.id} className="apple-card p-8 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase transition-all group-hover:bg-primary group-hover:text-white">
                  {profile.displayName?.charAt(0)}
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[8px] font-bold uppercase tracking-[0.2em]">{profile.role}</Badge>
              </div>
              <h4 className="text-lg font-bold mb-1">{profile.displayName}</h4>
              <p className="text-xs text-zinc-400 mb-6 font-medium">{profile.email}</p>
              
              <div className="space-y-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Monthly Retainer</span>
                  <span className="text-xs font-bold text-green-500">UGX {profile.salary?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Portal Authorization</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.accessiblePortals?.map((p: string) => (
                      <Badge key={p} variant="secondary" className="text-[7px] font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">{p.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (userLoading || (user && user.email !== 'hitechsoftware03@gmail.com')) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5 shrink-0">
              {logo ? <Image src={logo.imageUrl} alt="Logo" width={32} height={32} /> : <div className="w-full h-full bg-primary" />}
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs tracking-tight uppercase">HITECH</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">SYSTEM</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {[
              { id: 'Workforce', icon: Clock },
              { id: 'Tasks', icon: ClipboardList },
              { id: 'Projects', icon: Layers },
              { id: 'Approvals', icon: FileCheck },
              { id: 'Access', icon: Users },
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as SystemTab)} 
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group", 
                  activeTab === tab.id ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" : "text-zinc-400 hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-zinc-400 group-hover:text-zinc-500")} />
                {tab.id}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Portals hub</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Workforce' && renderWorkforce()}
          {activeTab === 'Tasks' && renderTasks()}
          {activeTab === 'Projects' && renderProjects()}
          {activeTab === 'Approvals' && renderApprovals()}
          {activeTab === 'Access' && renderAccess()}
        </AnimatePresence>
      </main>

      {/* DIALOGS */}

      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboard Worker Identity</DialogTitle>
            <DialogDescription>Provision a new worker profile and assign institutional access levels. An onboarding email will be sent automatically.</DialogDescription>
          </DialogHeader>
          <form className="space-y-6 py-4" onSubmit={handleCreateUser}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" required className="rounded-xl h-11" placeholder="e.g. John Smith" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select name="role" className="w-full h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none px-3 text-sm">
                  <option value="staff">Engineering Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input name="email" type="email" required className="rounded-xl h-11" placeholder="worker@hitech.systems" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="w-3 h-3 text-primary" /> Temporary Access Password
              </Label>
              <Input name="password" type="password" required className="rounded-xl h-11" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Retainer (UGX)</Label>
              <Input name="salary" type="number" required className="rounded-xl h-11" placeholder="e.g. 5000000" />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Portal Authorization</Label>
              <div className="grid grid-cols-2 gap-3">
                {['web-management', 'clients', 'communications', 'talent', 'system'].map((id) => (
                  <div key={id} className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <Checkbox 
                      id={id} 
                      checked={selectedPortals.includes(id)}
                      onCheckedChange={(checked) => setSelectedPortals(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
                    />
                    <Label htmlFor={id} className="text-[10px] font-bold cursor-pointer uppercase tracking-widest">{id.replace('-', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" disabled={newUserLoading} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                {newUserLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
                Authorize Provisioning
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-xl">
          <DialogHeader>
            <DialogTitle>Architectural Directive</DialogTitle>
            <DialogDescription>Define and assign a new mission objective for the workforce.</DialogDescription>
          </DialogHeader>
          <form className="space-y-6 py-4" onSubmit={handleCreateTask}>
            <div className="space-y-2">
              <Label>Directive Title</Label>
              <Input name="title" required className="rounded-xl h-11" placeholder="e.g. API Integration Audit" />
            </div>
            <div className="space-y-2">
              <Label>Objective Description</Label>
              <Textarea name="description" required className="rounded-xl min-h-[100px]" placeholder="Detailed technical requirements..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <select name="assignedTo" required className="w-full h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none px-3 text-sm">
                  {profiles?.map(p => (
                    <option key={p.uid} value={p.uid}>{p.displayName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select name="priority" className="w-full h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none px-3 text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input name="dueDate" type="date" required className="rounded-xl h-11" />
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" disabled={newTaskLoading} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                {newTaskLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
                Dispatch Directive
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
