
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  FileText, 
  Receipt, 
  ClipboardList, 
  Inbox, 
  Plus, 
  Search, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  MoreVertical,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  Filter,
  DollarSign,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type ClientTab = 'Overview' | 'Inquiries' | 'Quotations' | 'Invoices' | 'LPOs';

export default function ClientEcosystemPortal() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ClientTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // Queries
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc')) : null);
  const { data: quotations } = useCollection(db ? query(collection(db, 'quotations'), orderBy('createdAt', 'desc')) : null);
  const { data: invoices } = useCollection(db ? query(collection(db, 'invoices'), orderBy('createdAt', 'desc')) : null);
  const { data: lpos } = useCollection(db ? query(collection(db, 'lpos'), orderBy('createdAt', 'desc')) : null);

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

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Inquiries', icon: Inbox },
    { label: 'Quotations', icon: ClipboardList },
    { label: 'Invoices', icon: Receipt },
    { label: 'LPOs', icon: FileText },
  ];

  const stats = [
    { label: 'Inquiries', value: inquiries?.length || 0, change: '+2 new', color: 'text-blue-500' },
    { label: 'Pending Quotes', value: quotations?.filter((q: any) => q.status === 'draft' || q.status === 'sent').length || 0, change: '1 expires soon', color: 'text-amber-500' },
    { label: 'Revenue (MTD)', value: '$12,400', change: '+18%', color: 'text-green-500' },
    { label: 'Active Projects', value: 8, change: 'Stable', color: 'text-zinc-400' },
  ];

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Client Ecosystem</h1>
        <p className="text-sm text-zinc-400 font-medium">Manage project lifecycle from inquiry to invoice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
               <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", stat.color.replace('text', 'bg') + '/10', stat.color)}>{stat.change}</span>
            </div>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest">Recent Inquiries</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('Inquiries')}>View All</Button>
            </div>
            <div className="flex-1 overflow-y-auto">
               {inquiries?.slice(0, 5).map((inquiry: any, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 border-b border-zinc-50 dark:border-zinc-800/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all">
                       <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-bold">{inquiry.fullName}</h4>
                       <p className="text-[10px] text-zinc-400 font-medium">{inquiry.projectType} • {inquiry.budget}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-blue-500/20 text-blue-500 bg-blue-500/5">{inquiry.status}</Badge>
                 </div>
               ))}
               {(!inquiries || inquiries.length === 0) && (
                 <div className="p-20 text-center text-zinc-400 italic">No inquiries found.</div>
               )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Financial Pulse</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Collected</p>
                       <p className="text-sm font-bold">$42,000</p>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-[70%] bg-green-500" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Outstanding</p>
                       <p className="text-sm font-bold">$18,000</p>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-[30%] bg-amber-500" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const renderInquiries = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Project Inquiries</h1>
          <p className="text-sm text-zinc-400 font-medium">Potential leads from the site portals.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <Input placeholder="Search leads..." className="pl-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-100" />
          </div>
          <Button variant="outline" className="rounded-xl border-zinc-100"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Client</th>
              <th className="px-8 py-5">Project Type</th>
              <th className="px-8 py-5">Budget</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Submitted</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {inquiries?.map((item: any, i) => (
              <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {item.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{item.fullName}</p>
                      <p className="text-[10px] text-zinc-400">{item.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-none font-bold text-[9px] uppercase tracking-widest px-2 py-0.5">{item.projectType}</Badge>
                </td>
                <td className="px-8 py-6 text-[10px] font-bold">{item.budget}</td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[9px] font-bold">{item.status}</Badge>
                </td>
                <td className="px-8 py-6 text-[10px] text-zinc-400 font-bold">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}</td>
                <td className="px-8 py-6 text-right">
                  <Button variant="ghost" size="icon" className="rounded-lg text-zinc-300 hover:text-foreground transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!inquiries || inquiries.length === 0) && (
          <div className="p-32 flex flex-col items-center justify-center text-center opacity-40">
             <Inbox className="w-12 h-12 mb-4" />
             <p className="text-sm font-medium italic">No project inquiries logged yet.</p>
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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">CLIENTS</span>
            </div>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">ECOSYSTEM</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as ClientTab)}
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
          {activeTab === 'Inquiries' && renderInquiries()}
          {activeTab !== 'Overview' && activeTab !== 'Inquiries' && (
             <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-32 flex flex-col items-center justify-center text-center opacity-40">
                <LayoutGrid className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium italic">{activeTab} system cluster is initializing...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
