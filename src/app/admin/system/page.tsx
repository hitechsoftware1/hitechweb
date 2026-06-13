
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
  const { data: staff } = useCollection(db ? query(collection(db, 'users'), where('role', 'in', ['staff', 'admin'])) : null);
  const { data: requisitions } = useCollection(db ? query(collection(db, 'requisitions'), orderBy('createdAt', 'desc')) : null);
  const { data: projects } = useCollection(db ? query(collection(db, 'projects'), orderBy('startDate', 'desc')) : null);
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), where('status', '==', 'new')) : null);

  // States
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

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
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as SystemTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">
            <ArrowLeft className="w-4 h-4" /> Portals hub
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Workforce' && renderWorkforce()}
          {/* Add other renders as needed */}
          {activeTab !== 'Workforce' && (
            <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh] text-zinc-400 italic">
              {activeTab} module is initializing...
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
            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px]">Transmit Directive</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
