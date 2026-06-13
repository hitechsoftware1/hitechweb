"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Briefcase, 
  Users, 
  UserPlus, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  ExternalLink,
  MoreVertical,
  Mail,
  Phone,
  FileText,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, updateDoc, doc, deleteDoc, serverTimestamp, where } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TalentTab = 'Overview' | 'Applications' | 'Interviews' | 'Hired';

export default function TalentPortal() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TalentTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // Queries
  const { data: applications } = useCollection(db ? query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc')) : null);

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

  const updateStatus = async (appId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'jobApplications', appId), { status: newStatus });
      toast({ title: "Status Updated", description: `Application is now marked as ${newStatus}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Applications', icon: ClipboardList },
    { label: 'Interviews', icon: Calendar },
    { label: 'Hired', icon: UserPlus },
  ];

  const stats = [
    { label: 'Total Apps', value: applications?.length || 0, color: 'text-blue-500' },
    { label: 'Interviewing', value: applications?.filter((a: any) => a.status === 'interviewing').length || 0, color: 'text-amber-500' },
    { label: 'Hired (MTD)', value: applications?.filter((a: any) => a.status === 'hired').length || 0, color: 'text-green-500' },
    { label: 'Pipeline Health', value: 'Strong', color: 'text-zinc-400' },
  ];

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Talent Pipeline</h1>
        <p className="text-sm text-zinc-400 font-medium">Manage recruitment, interviews and onboarding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className={cn("text-4xl font-headline font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest">Recent Applications</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('Applications')}>View All</Button>
            </div>
            <div className="flex-1 overflow-y-auto">
               {applications?.slice(0, 5).map((app: any, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 border-b border-zinc-50 dark:border-zinc-800/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase">
                       {app.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-bold">{app.fullName}</h4>
                       <p className="text-[10px] text-zinc-400 font-medium">{app.role} • {app.email}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-bold uppercase tracking-widest",
                      app.status === 'applied' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                      app.status === 'interviewing' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      app.status === 'hired' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                      'border-zinc-500/20 text-zinc-500 bg-zinc-500/5'
                    )}>
                      {app.status}
                    </Badge>
                 </div>
               ))}
               {(!applications || applications.length === 0) && (
                 <div className="p-20 text-center text-zinc-400 italic">No applications received yet.</div>
               )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Recruitment Drive</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Open Positions</p>
                       <p className="text-sm font-bold">5</p>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-[60%] bg-primary" />
                    </div>
                 </div>
                 <div className="pt-4 space-y-3">
                    {['Senior Engineer', 'UI Designer', 'AI Specialist'].map(role => (
                      <div key={role} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-medium">{role}</span>
                        <Badge variant="secondary" className="text-[8px] font-bold">ACTIVE</Badge>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const renderApplications = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Applications</h1>
          <p className="text-sm text-zinc-400 font-medium">Browse and process candidate submissions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <Input placeholder="Search candidates..." className="pl-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100" />
          </div>
          <Button variant="outline" className="rounded-xl border-zinc-100"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Candidate</th>
              <th className="px-8 py-5">Role Applied</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Submitted</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {applications?.map((app: any, i) => (
              <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase">
                      {app.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{app.fullName}</p>
                      <p className="text-[10px] text-zinc-400">{app.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-medium text-zinc-600 dark:text-zinc-300">{app.role}</td>
                <td className="px-8 py-6">
                   <Badge variant="outline" className={cn(
                      "text-[9px] font-bold uppercase",
                      app.status === 'applied' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                      app.status === 'interviewing' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      app.status === 'hired' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                      'border-zinc-500/20 text-zinc-500 bg-zinc-500/5'
                    )}>{app.status}</Badge>
                </td>
                <td className="px-8 py-6 text-[10px] text-zinc-400 font-bold">{app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Today'}</td>
                <td className="px-8 py-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg text-zinc-300 hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-zinc-100 dark:border-zinc-800">
                      <DropdownMenuItem onClick={() => updateStatus(app.id, 'interviewing')} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>Move to Interview</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(app.id, 'hired')} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Mark as Hired</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')} className="flex items-center gap-2 text-red-500">
                        <XCircle className="w-4 h-4" />
                        <span>Reject Candidate</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!applications || applications.length === 0) && (
          <div className="p-32 flex flex-col items-center justify-center text-center opacity-40">
             <ClipboardList className="w-12 h-12 mb-4" />
             <p className="text-sm font-medium italic">No job applications logged yet.</p>
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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">TALENT</span>
            </div>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">PIPELINE</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as TalentTab)}
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
            <ArrowLeft className="w-4 h-4" /> All portals
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Applications' && renderApplications()}
          {activeTab !== 'Overview' && activeTab !== 'Applications' && (
             <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-32 flex flex-col items-center justify-center text-center opacity-40">
                <Briefcase className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium italic">{activeTab} system cluster is initializing...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
