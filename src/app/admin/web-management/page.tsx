
"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  Globe
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WebTab = 'Overview' | 'Header' | 'Home Page' | 'About Us' | 'Contact' | 'Footer & General' | 'Banners' | 'News' | 'Services' | 'Team' | 'Files';

export default function WebManagerPortal() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<WebTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

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
    { label: 'Header', icon: Type },
    { label: 'Home Page', icon: Home },
    { label: 'About Us', icon: Info },
    { label: 'Contact', icon: Mail },
    { label: 'Footer & General', icon: PanelBottom },
    { label: 'Banners', icon: ImageIcon },
    { label: 'News', icon: Newspaper },
    { label: 'Services', icon: Briefcase },
    { label: 'Team', icon: Users },
    { label: 'Files', icon: Files },
  ];

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-zinc-400 font-medium">Your website content at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Articles', value: '15' },
          { label: 'Team', value: '3' },
          { label: 'Published', value: '9' },
          { label: 'Drafts', value: '6' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest">Sections</h3>
             </div>
             <div className="p-4 space-y-1">
                {[
                  { label: 'Banners', icon: ImageIcon, count: null },
                  { label: 'News', icon: Newspaper, count: 15 },
                  { label: 'Services', icon: Briefcase, count: null },
                  { label: 'Team', icon: Users, count: 3 },
                ].map((section) => (
                  <button 
                    key={section.label}
                    onClick={() => setActiveTab(section.label as WebTab)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                        <section.icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{section.label}</h4>
                    </div>
                    {section.count !== null && (
                      <span className="text-xs font-bold text-zinc-300">{section.count}</span>
                    )}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-8">
             <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest mb-10">Team</h3>
             <div className="flex gap-3">
                {[
                  { initial: 'AG', color: 'bg-blue-500' },
                  { initial: 'SS', color: 'bg-green-500' },
                  { initial: 'RR', color: 'bg-amber-500' },
                ].map((member) => (
                  <div key={member.initial} className={cn("w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", member.color)}>
                    {member.initial}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
                 <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest">Recent news</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {[
                   { title: 'Will the generation of the Power Grid be able to meet the demand of the AI and Data Centre explosion in East Africa?', date: 'Jun 10', cat: 'tech' },
                   { title: 'Smart Home in Kenya and Uganda', date: 'Jun 10', cat: 'tech' },
                   { title: 'Role of African Data centers in the digital asset market', date: 'Jun 9', cat: 'finance' },
                   { title: 'Rise of Electric Mobility in Kenya and Uganda', date: 'Jun 9', cat: 'mobility' },
                   { title: "Why Kenya is East Africa's AI Innovation Hub in 2026", date: 'Jun 8', cat: 'innovation' },
                   { title: 'How M-PESA is changing digital payments in East Africa', date: 'Jun 8', cat: 'fintech' },
                 ].map((news, i) => (
                   <div key={i} className="flex items-center gap-6 p-6 border-b border-zinc-50 dark:border-zinc-800/30 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-200 dark:text-zinc-700">
                         <Newspaper className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors line-clamp-1">{news.title}</h4>
                         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">{news.date}</p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-200 dark:text-zinc-800 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{news.cat}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
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
              <span className="font-headline font-bold text-xs tracking-tight uppercase">Deepcode</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Innovations</span>
            </div>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">WEB MANAGER</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as WebTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
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
          {activeTab !== 'Overview' && (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center justify-center h-[60vh] text-zinc-400 font-medium italic"
            >
              {activeTab} module is initializing...
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
