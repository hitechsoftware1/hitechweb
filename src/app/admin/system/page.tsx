
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
  Monitor
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
  const [newUserLoading, setNewUserLoading] = useState(false);
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
    const salary = parseFloat(formData.get('salary') as string) || 0;

    try {
      // NOTE: In a real production app, we would use a Cloud Function to create users 
      // without signing the current admin out. For this prototype, we create the Firestore profile.
      // The worker will then need to use the "Forgot Password" or admin-provided credentials.
      
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

      toast({ 
        title: "Worker Onboarded", 
        description: `${name} has been added to the institutional neural database. Portals: ${selectedPortals.join(', ')}` 
      });
      setIsNewUserOpen(false);
      setSelectedPortals([]);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Onboarding Failed", description: error.message });
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

  const portalOptions = [
    { id: 'web-management', label: 'Web Management' },
    { id: 'clients', label: 'Client Ecosystem' },
    { id: 'communications', label: 'Communications' },
    { id: 'talent', label: 'Talent Pipeline' },
    { id: 'system', label: 'System Architecture' },
  ];

  const renderWorkforce = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Workforce Presence</h1>
          <p className="text-sm text-zinc-400 font-medium">Verify daily worker punch-ins and shift sign-offs across the institution.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Date / Session</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {attendance?.map((log: any) => (
              <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{log.userName}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">Code: {log.officeCodeUsed}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100">{log.date}</p>
                  <p className="text-[9px] text-zinc-400 uppercase font-mono">Shift Active</p>
                </td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={cn(
                    "text-[9px] font-bold uppercase",
                    log.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                    log.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                    'border-amber-500/20 text-amber-500 bg-amber-500/5'
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
            {(!attendance || attendance.length === 0) && (
              <tr><td colSpan={4} className="p-20 text-center text-zinc-400 italic">No attendance logs in the neural buffer.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderAccess = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Institutional Access</h1>
          <p className="text-sm text-zinc-400 font-medium">Onboard new workers, set salaries, and manage portal permissions.</p>
        </div>
        <Button onClick={() => setIsNewUserOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Onboard Worker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles?.map((profile: any) => (
          <div key={profile.id} className="apple-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase">
                  {profile.displayName?.charAt(0) || 'U'}
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[9px] font-bold uppercase tracking-widest">{profile.role}</Badge>
              </div>
              <h4 className="text-lg font-bold mb-1">{profile.displayName}</h4>
              <p className="text-xs text-zinc-400 mb-6">{profile.email}</p>
              
              <div className="space-y-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Monthly Salary</span>
                  <span className="text-xs font-bold text-green-500">UGX {profile.salary?.toLocaleString() || '0'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Portal Access</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.accessiblePortals?.map((p: string) => (
                      <Badge key={p} variant="secondary" className="text-[8px] font-bold uppercase px-2 py-0.5">{p.replace('-', ' ')}</Badge>
                    ))}
                    {(!profile.accessiblePortals || profile.accessiblePortals.length === 0) && (
                      <span className="text-[9px] text-zinc-300 italic">None assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-800 flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-[9px] font-bold uppercase tracking-widest"><Settings className="w-3 h-3 mr-2" /> Modify</Button>
              <Button variant="ghost" size="sm" className="flex-1 text-[9px] font-bold uppercase tracking-widest text-red-400"><Trash2 className="w-3 h-3 mr-2" /> Revoke</Button>
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
          <h1 className="text-2xl font-bold tracking-tight mb-1">Strategic Portals</h1>
          <p className="text-sm text-zinc-400 font-medium">Promote pending client inquiries into active project environments.</p>
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
        {(!inquiries || inquiries.length === 0) && <div className="col-span-full p-20 text-center text-zinc-400 italic">No new inquiries available for promotion.</div>}
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
        {(!requisitions || requisitions.length === 0) && <div className="p-20 text-center text-zinc-400 italic">No active requisitions awaiting approval.</div>}
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
          {activeTab === 'Access' && renderAccess()}
          {activeTab === 'Tasks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh] text-zinc-400 italic">
              Tasks module active. Centralized mission directives dashboard loading...
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Onboard Worker Identity</DialogTitle>
            <DialogDescription>Provision a new worker profile and assign institutional access levels.</DialogDescription>
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
              <Label>Monthly Retainer (UGX)</Label>
              <Input name="salary" type="number" required className="rounded-xl h-11" placeholder="e.g. 5000000" />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Portal Authorization</Label>
              <div className="grid grid-cols-2 gap-3">
                {portalOptions.map((portal) => (
                  <div key={portal.id} className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <Checkbox 
                      id={portal.id} 
                      checked={selectedPortals.includes(portal.id)}
                      onCheckedChange={(checked) => {
                        setSelectedPortals(prev => checked ? [...prev, portal.id] : prev.filter(x => x !== portal.id));
                      }}
                    />
                    <Label htmlFor={portal.id} className="text-xs font-bold cursor-pointer">{portal.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl flex gap-3 items-start border border-amber-100 dark:border-amber-900/30">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800/70 dark:text-amber-200/50 font-medium leading-relaxed">
                Onboarding creates the profile document. Use the password "Hitech2024" for initial login.
              </p>
            </div>

            <DialogFooter className="pt-6">
              <Button type="submit" disabled={newUserLoading} className="w-full rounded-xl h-12">
                {newUserLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
                Authorize Provisioning
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
