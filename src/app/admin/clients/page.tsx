
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
  ExternalLink,
  ChevronDown,
  Filter,
  DollarSign,
  TrendingUp,
  Briefcase,
  Loader2,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type ClientTab = 'Overview' | 'Inquiries' | 'Quotations' | 'Invoices' | 'LPOs';

export default function ClientEcosystemPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ClientTab>('Overview');
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

  const updateStatus = async (col: string, id: string, status: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, col, id), { status });
      toast({ title: "Registry Updated", description: `Record marked as ${status}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const renderList = (title: string, items: any[], col: string) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <Button className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New {title.slice(0, -1)}
        </Button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Reference / Client</th>
              <th className="px-8 py-5">Value / Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {items?.map((item: any) => (
              <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{item.clientName || item.fullName || item.invoiceNumber}</p>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase">{item.id.substring(0, 8)}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                     <Badge variant="outline" className="text-[9px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{item.status}</Badge>
                     <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{item.totalAmount ? `$${item.totalAmount.toLocaleString()}` : ''}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => updateStatus(col, item.id, 'accepted')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-300"><ExternalLink className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {(!items || items.length === 0) && <tr><td colSpan={3} className="p-20 text-center text-zinc-400 italic">Institutional ledger is currently empty.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight">Client Ecosystem Ledger</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Inquiries', value: inquiries?.length || 0, change: 'Leads', color: 'text-blue-500' },
          { label: 'Quotations', value: quotations?.length || 0, change: 'Estimates', color: 'text-amber-500' },
          { label: 'Invoices', value: invoices?.length || 0, change: 'Revenue', color: 'text-green-500' },
          { label: 'LPOs', value: lpos?.length || 0, change: 'Orders', color: 'text-zinc-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">CLIENTS</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {['Overview', 'Inquiries', 'Quotations', 'Invoices', 'LPOs'].map((label) => (
              <button key={label} onClick={() => setActiveTab(label as ClientTab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground")}>
                <Briefcase className={cn("w-4 h-4", activeTab === label ? "text-primary" : "text-zinc-400")} />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400"><ArrowLeft className="w-4 h-4" /> All portals</Link>
          <button onClick={() => signOut(auth).then(() => window.location.href = '/')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Inquiries' && renderList('Project Inquiries', inquiries || [], 'projectInquiries')}
          {activeTab === 'Quotations' && renderList('Formal Quotations', quotations || [], 'quotations')}
          {activeTab === 'Invoices' && renderList('Billing Invoices', invoices || [], 'invoices')}
          {activeTab === 'LPOs' && renderList('Purchase Orders', lpos || [], 'lpos')}
        </AnimatePresence>
      </main>
    </div>
  );
}
