
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
  Contact, 
  Mail, 
  Files, 
  Sun, 
  Moon, 
  ArrowLeft, 
  LogOut,
  ChevronRight,
  Headset,
  ClipboardList
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

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
          {activeTab === 'Overview' ? renderOverview() : (
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
