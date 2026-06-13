
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
  Lock
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
  const { data: projects } = useCollection(db ? query(collection(db, 'projects'), orderBy('startDate', 'desc')) : null);

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
      // NOTE: Creating a user with client SDK signs the creator OUT and the new user IN.
      // In a production app, this would be handled by a Firebase Function to avoid logout.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        displayName: name,
        role,
        joinedAt: serverTimestamp()
      });

      toast({ title: "Identity Provisioned", description: `${name} has been added to the neural database.` });
      setIsNewUserOpen(false);
      
      // Auto-logout the newly created user to return to admin state (or user will have to relogin)
      // This is a limitation of client-side user creation.
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

  const renderAccess = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Access Management</h1>
          <p className="text-sm text-zinc-400 font-medium">Provision identities and audit module permissions.</p>
        </div>
        <Button onClick={() => setIsNewUserOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Provision identity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL IDENTITIES', value: profiles?.length || 0, icon: Users },
          { label: 'ADMIN CLEARANCE', value: profiles?.filter((p: any) => p.role === 'admin').length || 0, icon: Shield },
          { label: 'STAFF CLEARANCE', value: profiles?.filter((p: any) => p.role === 'staff').length || 0, icon: UserCheck },
          { label: 'CLIENT PORTALS', value: profiles?.filter((p: any) => p.role === 'client').length || 0, icon: Layers },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-headline font-bold">{stat.value}</p>
              <stat.icon className="w-5 h-5 text-zinc-100 dark:text-zinc-800" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Identity</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Joined</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {profiles?.map((profile: any) => (
              <tr key={profile.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <div>
                    <p className="text-xs font-bold">{profile.displayName || 'Unnamed Operator'}</p>
                    <p className="text-[10px] text-zinc-400">{profile.email}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold uppercase",
                    profile.role === 'admin' ? 'border-primary/20 text-primary bg-primary/5' :
                    profile.role === 'staff' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                    'border-zinc-300 text-zinc-400'
                  )}>{profile.role}</Badge>
                </td>
                <td className="px-8 py-6 text-[10px] font-bold text-zinc-400">
                  {profile.joinedAt?.toDate ? profile.joinedAt.toDate().toLocaleDateString() : 'Historical'}
                </td>
                <td className="px-8 py-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg"><MoreVertical className="w-4 h-4 text-zinc-300" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="text-xs font-bold">Adjust clearance</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs font-bold text-red-500">Revoke access</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          {activeTab === 'Access' && renderAccess()}
          {activeTab !== 'Workforce' && activeTab !== 'Access' && (
            <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh] text-zinc-400 italic">
              {activeTab} module is initializing...
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Provision Identity Dialog */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>Provision Identity</DialogTitle>
            <DialogDescription>Add a new operator or staff member to the HITECH system.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4" onSubmit={handleCreateUser}>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
              <Input name="name" required className="rounded-xl h-11" placeholder="Lubega Joel" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
              <Input name="email" type="email" required className="rounded-xl h-11" placeholder="operator@hitech.systems" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Initial Password</Label>
              <Input name="password" type="password" required className="rounded-xl h-11" placeholder="Minimum 6 characters" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Clearance Role</Label>
              <select name="role" className="w-full h-11 rounded-xl bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="staff">Engineering Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl flex gap-3 items-start mt-4">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700/70 dark:text-amber-200/50 leading-relaxed font-medium">
                Identity provisioning will momentarily refresh the neural link. You may need to sign back in.
              </p>
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" disabled={newUserLoading} className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {newUserLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Provisioning"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              priority: 'medium',
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
