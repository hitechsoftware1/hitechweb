
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  MessageSquare, 
  FileText, 
  Users, 
  Bell, 
  Briefcase, 
  CreditCard, 
  Mail, 
  Files, 
  Sun, 
  Moon, 
  ArrowLeft, 
  LogOut,
  ChevronRight,
  Headset,
  ClipboardList,
  Search,
  Plus,
  Lock,
  ChevronDown,
  Filter,
  Inbox,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Bar,
  XAxis,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type CommTab = 'Overview' | 'Messages' | 'Quote Requests' | 'Contacts' | 'Subscribers' | 'Clients' | 'Quotations' | 'Internal Contacts' | 'Files';

export default function CommunicationsPortal() {
  const { user } = useUser();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<CommTab>('Overview');
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

  const sidebarSections = [
    {
      title: 'COMMUNICATIONS',
      items: [
        { label: 'Overview', icon: LayoutGrid },
        { label: 'Messages', icon: MessageSquare },
        { label: 'Quote Requests', icon: FileText },
        { label: 'Contacts', icon: Mail },
        { label: 'Subscribers', icon: Bell },
      ]
    },
    {
      title: 'MARKETING',
      items: [
        { label: 'Clients', icon: Briefcase },
        { label: 'Quotations', icon: CreditCard },
        { label: 'Internal Contacts', icon: Users },
      ]
    },
    {
      title: 'OTHER',
      items: [
        { label: 'Files', icon: Files },
      ]
    }
  ];

  const stats = [
    { label: 'Quote Requests', value: '0' },
    { label: 'Contacts', value: '0' },
    { label: 'Subscribers', value: '1' },
  ];

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Communications</h1>
        <p className="text-sm text-zinc-400">Messages, quote requests, contact forms and subscribers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
               <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Sections</h3>
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: 'Messages', desc: 'Incoming messages', icon: Headset },
                { label: 'Quote Requests', desc: 'Service quote requests', icon: ClipboardList },
                { label: 'Contacts', desc: 'Contact form submissions', icon: Mail },
                { label: 'Subscribers', desc: 'Newsletter subscribers', icon: Bell },
              ].map((section) => (
                <button 
                  key={section.label}
                  onClick={() => setActiveTab(section.label as CommTab)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold">{section.label}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">{section.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-200 dark:text-zinc-700" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Recent Contacts</h3>
              <button className="text-[10px] font-bold text-zinc-400 hover:text-foreground">View all</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <p className="text-xs text-zinc-400 font-medium italic opacity-60">No recent activity.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMessages = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
          <p className="text-sm text-zinc-400">Outbound email communications to subscribers, contacts, and one-off recipients.</p>
        </div>
        <Button className="bg-zinc-950 dark:bg-white text-white dark:text-black font-bold rounded-xl h-11 px-6 flex items-center gap-2">
          New communication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL', value: '1' },
          { label: 'DRAFTS', value: '0', color: 'text-blue-500' },
          { label: 'SENT', value: '1', color: 'text-green-500' },
          { label: 'FAILED / PARTIAL', value: '0', color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <p className={cn("text-3xl font-headline font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input 
                placeholder="Search by subject..." 
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-none text-xs outline-none focus:ring-1 focus:ring-primary/40"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-bold border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                All statuses <ChevronDown className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-bold border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                All types <ChevronDown className="w-3 h-3" />
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/20">
                 <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                    <th className="px-6 py-4">SUBJECT</th>
                    <th className="px-6 py-4">TYPE</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">RECIPIENTS</th>
                    <th className="px-6 py-4">SENT / FAILED</th>
                    <th className="px-6 py-4">LAST SENT</th>
                    <th className="px-6 py-4">SENDER</th>
                    <th className="px-6 py-4 text-right"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                 <tr className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Please Receive this email</p>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight line-clamp-1 opacity-70">
                            GOVERNMENT TO STOP IMPORTING LOCALLY AVAILABLE ICT SOLUTIONS
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 text-[9px] font-bold px-2 rounded-md">Articles</Badge>
                    </td>
                    <td className="px-6 py-5">
                       <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 text-[9px] font-bold px-2 rounded-md">Sent</Badge>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-zinc-500">1</td>
                    <td className="px-6 py-5 text-xs font-medium text-zinc-500">1 / 0</td>
                    <td className="px-6 py-5 text-[10px] font-bold text-zinc-400">May 25, 11:08 AM</td>
                    <td className="px-6 py-5 text-xs font-bold text-zinc-600 dark:text-zinc-400">Cole Amri Kitalikibi</td>
                    <td className="px-6 py-5 text-right">
                       <Lock className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-700 ml-auto" />
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </motion.div>
  );

  const renderQuoteRequests = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quote & Demo Requests</h1>
          <p className="text-sm text-zinc-400">Leads from the Services pages — visitors asking for a quote, demo, audit, or info.</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: 'NEW', value: '0', color: 'text-blue-500' },
            { label: 'CONTACTED', value: '0', color: 'text-amber-500' },
            { label: 'CLOSED', value: '0', color: 'text-zinc-400' },
            { label: 'TOTAL', value: '0', color: 'text-foreground' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <p className={cn("text-xl font-headline font-bold", stat.color)}>{stat.value}</p>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
        {[
          { label: 'TODAY', value: '0', desc: 'new today' },
          { label: 'THIS WEEK', value: '0', desc: 'since Monday' },
          { label: 'THIS MONTH', value: '0', desc: 'since the 1st' },
          { label: 'LAST 30 DAYS', value: '0', desc: 'rolling window' },
        ].map((stat) => (
          <div key={stat.label} className="p-8">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-headline font-bold mb-1">{stat.value}</p>
            <p className="text-[10px] text-zinc-300 font-medium">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 h-full">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Quote requests — last 30 days</h3>
              <span className="text-[10px] font-bold text-zinc-400">0 new</span>
            </div>
            <div className="h-[240px] flex items-center justify-center text-zinc-200 dark:text-zinc-800">
               {/* Visual Placeholder for Bar Chart */}
               <div className="w-full h-full flex items-end gap-3 px-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-t-lg h-4" />
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 h-full">
             <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100 mb-8">Most-requested services</h3>
             <div className="space-y-4">
                <p className="text-xs text-zinc-400 font-medium italic opacity-60">No data yet.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input 
                placeholder="Search by name or email..." 
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-none text-xs outline-none focus:ring-1 focus:ring-primary/40"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl text-[10px] font-bold border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                All Status <ChevronDown className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl text-[10px] font-bold border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                All Types <ChevronDown className="w-3 h-3" />
              </Button>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
           <div className="w-16 h-16 rounded-3xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-100 dark:text-zinc-800">
              <Inbox className="w-8 h-8" />
           </div>
           <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">No quote requests found</h4>
              <p className="text-xs text-zinc-400 font-medium mt-1">No quote requests yet</p>
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
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>
          
          <div className="space-y-8">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{section.title}</div>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label as CommTab)}
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
            ))}
          </div>
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
          {activeTab === 'Messages' && renderMessages()}
          {activeTab === 'Quote Requests' && renderQuoteRequests()}
          {activeTab !== 'Overview' && activeTab !== 'Messages' && activeTab !== 'Quote Requests' && (
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
