
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Search, 
  Plus, 
  ChevronRight, 
  FileEdit, 
  Settings, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Trash2,
  Save,
  X,
  Type,
  Home,
  Info,
  Mail,
  PanelBottom,
  Image as ImageIcon,
  Newspaper,
  Briefcase,
  Users,
  Files,
  Globe,
  Pencil,
  Sparkles
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type WebTab = 'Overview' | 'Banners' | 'News' | 'Services' | 'Team' | 'Global Config';

export default function WebManagerPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<WebTab>('Overview');
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

  // CMS Data Queries
  const { data: news } = useCollection(db ? query(collection(db, 'news'), orderBy('createdAt', 'desc')) : null);
  const { data: services } = useCollection(db ? query(collection(db, 'services'), orderBy('createdAt', 'asc')) : null);
  const { data: team } = useCollection(db ? query(collection(db, 'team'), orderBy('createdAt', 'asc')) : null);
  const { data: banners } = useCollection(db ? query(collection(db, 'banners'), orderBy('createdAt', 'asc')) : null);

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

  const deleteItem = async (col: string, id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast({ title: "Archived", description: "Content node has been purged from neural core." });
    } catch (e) {
      toast({ variant: "destructive", title: "Archive Failed" });
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Banners', icon: ImageIcon },
    { label: 'News', icon: Newspaper },
    { label: 'Services', icon: Briefcase },
    { label: 'Team', icon: Users },
    { label: 'Global Config', icon: Settings },
  ];

  const renderContentList = (title: string, items: any[], collectionName: string) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <Button className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Node
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="apple-card p-6 flex flex-col justify-between">
             <div>
                <div className="aspect-video relative rounded-xl overflow-hidden mb-6 bg-zinc-50 dark:bg-zinc-800">
                   {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                </div>
                <h4 className="font-bold text-sm mb-2">{item.title || item.name}</h4>
                <p className="text-[10px] text-zinc-400 font-medium line-clamp-2">{item.description || item.bio}</p>
             </div>
             <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                <Button onClick={() => deleteItem(collectionName, item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
             </div>
          </div>
        ))}
        {(!items || items.length === 0) && <div className="col-span-full p-20 text-center text-zinc-400 italic">No content nodes found.</div>}
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight">Website Architecture</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'News Articles', value: news?.length || 0 },
          { label: 'Team Members', value: team?.length || 0 },
          { label: 'Active Services', value: services?.length || 0 },
          { label: 'Sliding Banners', value: banners?.length || 0 },
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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">SOFTWARE</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button key={item.label} onClick={() => setActiveTab(item.label as WebTab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === item.label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground")}>
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400"><ArrowLeft className="w-4 h-4" /> All portals</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Banners' && renderContentList('Sliding Banners', banners || [], 'banners')}
          {activeTab === 'News' && renderContentList('News Articles', news || [], 'news')}
          {activeTab === 'Services' && renderContentList('HITECH Services', services || [], 'services')}
          {activeTab === 'Team' && renderContentList('Expert Units', team || [], 'team')}
          {activeTab === 'Global Config' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-32 text-center text-zinc-400 italic">Configuration registry is locked to Super Admin terminal only.</motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
