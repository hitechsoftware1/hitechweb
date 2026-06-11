
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  LayoutGrid, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Activity, 
  FileEdit, 
  Settings, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  RefreshCw,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart3,
  Terminal
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  XAxis,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type WebTab = 'Overview' | 'Site Pages' | 'SEO Audit' | 'Analytics' | 'Settings';

export default function WebManagementPortal() {
  const { user } = useUser();
  const auth = useAuth();
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
    { label: 'Site Pages', icon: FileEdit },
    { label: 'SEO Audit', icon: ShieldCheck },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Web Management</h1>
          <p className="text-sm text-zinc-400">Platform oversight, performance monitoring and site integrity.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Purge Cache
          </Button>
          <Button className="bg-zinc-950 dark:bg-white text-white dark:text-black font-bold rounded-xl h-11 px-6 shadow-lg shadow-black/10">
            Launch Site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Global Health', value: 'Excellent', color: 'text-green-500', icon: Activity },
          { label: 'Live Traffic', value: '1.2k', color: 'text-primary', icon: Zap },
          { label: 'Avg Latency', value: '14ms', color: 'text-zinc-400', icon: Terminal },
          { label: 'SEO Score', value: '98/100', color: 'text-amber-500', icon: ShieldCheck },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
               <stat.icon className="w-4 h-4 text-zinc-100 dark:text-zinc-800 group-hover:text-primary transition-colors" />
            </div>
            <p className={cn("text-3xl font-headline font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 h-full">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Regional Performance</h3>
                 <Badge variant="outline" className="bg-green-500/10 text-green-500 border-none rounded-lg text-[9px] font-bold">Stable</Badge>
              </div>
              <div className="h-[280px] w-full bg-zinc-50/50 dark:bg-zinc-950/50 rounded-3xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                 <div className="flex flex-col items-center gap-4 text-center opacity-40">
                    <Globe className="w-10 h-10 text-zinc-400" />
                    <p className="text-xs font-medium italic">Neural Map initializing...</p>
                 </div>
              </div>
           </div>
        </div>
        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 h-full flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100 mb-10">Maintenance Tasks</h3>
              <div className="space-y-6 flex-1">
                 {[
                   { title: 'Update SSL Certificates', deadline: '3 days left', status: 'pending' },
                   { title: 'Purge Old System Logs', deadline: 'Overdue', status: 'critical' },
                   { title: 'Database Optimization', deadline: 'Scheduled', status: 'auto' },
                 ].map((task, i) => (
                   <div key={i} className="flex items-start gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        task.status === 'pending' ? "bg-amber-400" : task.status === 'critical' ? "bg-red-500" : "bg-primary"
                      )} />
                      <div>
                         <p className="text-xs font-bold">{task.title}</p>
                         <p className="text-[10px] text-zinc-400 mt-0.5">{task.deadline}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-10 rounded-xl text-[10px] font-bold uppercase tracking-widest h-12">
                 Run Full Diagnostic
              </Button>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPages = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Site Pages</h1>
          <p className="text-sm text-zinc-400">Manage structure, content and routing for the public ecosystem.</p>
        </div>
        <Button className="bg-zinc-950 dark:bg-white text-white dark:text-black font-bold rounded-xl h-11 px-6 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Page
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input 
                placeholder="Search pages..." 
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-none text-xs outline-none focus:ring-1 focus:ring-primary/40"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl text-[10px] font-bold border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                All Status <ChevronDown className="w-3 h-3" />
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-50 dark:border-zinc-800">
               <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                  <th className="px-8 py-5">PAGE TITLE</th>
                  <th className="px-8 py-5">PATH</th>
                  <th className="px-8 py-5">STATUS</th>
                  <th className="px-8 py-5">LAST MODIFIED</th>
                  <th className="px-8 py-5">AUTHOR</th>
                  <th className="px-8 py-5 text-right">ACTIONS</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
               {[
                 { title: 'Home Engine', path: '/', status: 'Published', date: 'Jun 10, 2026', author: 'JoelHitech' },
                 { title: 'Architecture Showcase', path: '/portfolio', status: 'Published', date: 'Jun 8, 2026', author: 'Regan' },
                 { title: 'Intelligence Studio', path: '/ai-tools', status: 'Draft', date: 'Jun 5, 2026', author: 'JoelHitech' },
                 { title: 'Case Study: Quantum', path: '/case-studies/quantum', status: 'Published', date: 'May 28, 2026', author: 'Cole' },
               ].map((page, i) => (
                 <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-8 py-6 font-bold text-xs">{page.title}</td>
                    <td className="px-8 py-6">
                       <code className="text-[10px] bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded text-primary">{page.path}</code>
                    </td>
                    <td className="px-8 py-6">
                       <Badge className={cn(
                         "text-[8px] font-bold uppercase px-2 py-0.5 rounded-md border-none",
                         page.status === 'Published' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                       )}>
                          {page.status}
                       </Badge>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-zinc-400">{page.date}</td>
                    <td className="px-8 py-6 text-xs font-medium text-zinc-400">{page.author}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><FileEdit className="w-3.5 h-3.5" /></button>
                          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
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
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Web Management</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as WebTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" 
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
          {activeTab === 'Site Pages' && renderPages()}
          {activeTab !== 'Overview' && activeTab !== 'Site Pages' && (
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

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
