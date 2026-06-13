
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
  Sparkles
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, orderBy, updateDoc, doc, addDoc, serverTimestamp, where, deleteDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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
        toast({ variant: "destructive", title: "Access Restricted", description: "This module requires Super Admin clearance." });
      }
    }
  }, [user, userLoading, router, toast]);

  // Queries
  const { data: attendance } = useCollection(db ? query(collection(db, 'attendance'), orderBy('date', 'desc')) : null);
  const { data: tasks } = useCollection(db ? query(collection(db, 'tasks'), orderBy('createdAt', 'desc')) : null);
  const { data: profiles } = useCollection(db ? query(collection(db, 'users'), orderBy('joinedAt', 'desc')) : null);
  const { data: requisitions } = useCollection(db ? query(collection(db, 'requisitions'), orderBy('createdAt', 'desc')) : null);
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), where('status', '==', 'new')) : null);

  // States
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newUserLoading, setNewUserLoading] = useState(false);

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

  const updateRequisitionStatus = async (id: string, status: string) => {
    if (!db) return;
    updateDoc(doc(db, 'requisitions', id), { status })
      .then(() => toast({ title: "Requisition Processed", description: `Status updated to ${status}.` }))
      .catch(() => toast({ variant: "destructive", title: "Process Failed" }));
  };

  const promoteToProject = async (inquiry: any) => {
    if (!db) return;
    try {
      const projectData = {
        title: inquiry.description.substring(0, 30) + "...",
        clientName: inquiry.fullName,
        clientId: inquiry.email,
        description: inquiry.description,
        status: 'active',
        progress: 0,
        startDate: serverTimestamp(),
      };
      await addDoc(collection(db, 'projects'), projectData);
      await updateDoc(doc(db, 'projectInquiries', inquiry.id), { status: 'closed' });
      toast({ title: "Portal Generated", description: "Strategic inquiry has been promoted to a live project portal." });
    } catch (e) {
      toast({ variant: "destructive", title: "Generation Failed" });
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !auth) return;
    setNewUserLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        displayName: name,
        role,
        joinedAt: serverTimestamp()
      });

      toast({ title: "Identity Provisioned", description: `${name} added to neural database.` });
      setIsNewUserOpen(false);
      signOut(auth).then(() => router.push('/login'));
    } catch (error: any) {
      toast({ variant: "destructive", title: "Provisioning Failed", description: error.message });
    } finally {
      setNewUserLoading(false);
    }
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
          <p className="text-sm text-zinc-400 font-medium">Verify daily worker punch-ins and shift sign-offs.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {attendance?.map((log: any) => (
              <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6"><p className="text-xs font-bold">{log.userName}</p></td>
                <td className="px-8 py-6 text-[10px] font-bold text-zinc-400">{log.date}</td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold uppercase",
                    log.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
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
      </div>
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Strategic Portals</h1>
          <p className="text-sm text-zinc-400 font-medium">Generate project portals from pending client inquiries.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inquiries?.map((inq: any) => (
          <div key={inq.id} className="apple-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Badge className="bg-primary/10 text-primary border-none text-[8px] uppercase tracking-widest">{inq.projectType}</Badge>
                <span className="text-[10px] font-bold text-zinc-400">{inq.budget}</span>
              </div>
              <h4 className="text-lg font-bold mb-2">{inq.fullName}</h4>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-8">{inq.description}</p>
            </div>
            <Button onClick={() => promoteToProject(inq)} className="w-full rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Generate Portal
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderApprovals = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Institutional Requisitions</h1>
      <div className="space-y-4">
        {requisitions?.map((req: any) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{req.title}</h4>
                <p className="text-xs text-zinc-400">{req.userName} • UGX {req.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => updateRequisitionStatus(req.id, 'approved')} variant="outline" className="border-green-500/20 text-green-500 hover:bg-green-50 rounded-xl h-10">Approve</Button>
              <Button onClick={() => updateRequisitionStatus(req.id, 'rejected')} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-50 rounded-xl h-10">Reject</Button>
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
            {sidebarItems.map((item) => (
              <button key={item.label} onClick={() => setActiveTab(item.label as SystemTab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === item.label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground")}>
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400"><ArrowLeft className="w-4 h-4" /> Portals hub</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Workforce' && renderWorkforce()}
          {activeTab === 'Projects' && renderProjects()}
          {activeTab === 'Approvals' && renderApprovals()}
          {activeTab !== 'Workforce' && activeTab !== 'Projects' && activeTab !== 'Approvals' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh] text-zinc-400 italic">
              {activeTab} module active. Full provisioning tools available under clearance.
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800">
          <DialogHeader><DialogTitle>Provision Identity</DialogTitle></DialogHeader>
          <form className="space-y-4 py-4" onSubmit={handleCreateUser}>
            <div className="space-y-2"><Label>Full Name</Label><Input name="name" required className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label>Email Address</Label><Input name="email" type="email" required className="rounded-xl h-11" /></div>
            <div className="space-y-2"><Label>Initial Password</Label><Input name="password" type="password" required className="rounded-xl h-11" /></div>
            <DialogFooter className="pt-6"><Button type="submit" disabled={newUserLoading} className="w-full rounded-xl">Authorize Provisioning</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
