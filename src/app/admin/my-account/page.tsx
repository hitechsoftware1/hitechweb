
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  User, 
  Clock, 
  CalendarCheck, 
  Wallet, 
  DollarSign, 
  FileText, 
  Layers, 
  Folder, 
  Files, 
  MessageSquare, 
  Moon, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  Search,
  Plus,
  Bell,
  MoreVertical,
  Briefcase,
  Target,
  FileCheck,
  CreditCard,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MyAccountPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('Overview');

  // Daily Code Query
  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);
  const { data: activeCodes } = useCollection(dailyCodeQuery);
  const currentDailyCode = activeCodes?.[0]?.code || '71'; // Fallback to reference 71

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Profile', icon: User },
    { label: 'Attendance', icon: Clock },
    { label: 'Advance Retainer', icon: CalendarCheck },
    { label: 'Allowances', icon: Wallet },
    { label: 'Punch-In Allowances', icon: DollarSign },
    { label: 'Requisitions', icon: FileText },
    { label: 'Projects & Tasks', icon: Layers },
    { label: 'My Documents', icon: Folder },
    { label: 'Files', icon: Files },
    { label: 'Chat', icon: MessageSquare },
  ];

  const stats = [
    { label: 'MY PROJECTS', value: '1', icon: Briefcase },
    { label: 'ACTIVE TASKS', value: '9', icon: Target },
    { label: 'REQUISITIONS', value: '6', icon: FileCheck },
    { label: 'PENDING ADVANCES', value: '0', icon: CreditCard },
  ];

  const tasks = [
    { title: 'Tmbla Rideshare Social Media Account Setup & ...', status: 'COMPLETED', type: 'STANDALONE', date: 'Due May 31', color: 'text-green-500 bg-green-500/10' },
    { title: 'Functional Testing of the Bilar Platform', status: 'IN PROGRESS', type: 'STANDALONE', date: 'Due Jun 8', color: 'text-primary bg-primary/10' },
    { title: 'Market Research & Competitive ...', status: 'SUBMITTED_FOR_COMPLETION', type: 'STANDALONE', date: 'Due Jun 12', color: 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800' },
    { title: 'Testing of the application', status: 'IN PROGRESS', type: 'Bilar - Property Manager Platform', date: 'Due Jun 15', color: 'text-primary bg-primary/10' },
    { title: 'Property Manager Acquisition Campaign', status: 'IN PROGRESS', type: 'STANDALONE', date: 'Due Jun 19', color: 'text-primary bg-primary/10' },
  ];

  const attendanceMetrics = [
    { label: 'WORKING DAYS', value: '101', color: 'text-foreground' },
    { label: 'VERIFIED', value: '15', color: 'text-green-500' },
    { label: 'PENDING', value: '0', color: 'text-amber-500' },
    { label: 'PAID LEAVE', value: '1', color: 'text-primary' },
    { label: 'COMPENSATED', value: '0', color: 'text-emerald-500' },
    { label: 'MISSED', value: '88', color: 'text-red-400' },
    { label: 'RETAINER PAID', value: '0', color: 'text-green-600' },
    { label: 'ALLOWANCE', value: '13', color: 'text-amber-600' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">H</div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">My Account</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
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
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            <Moon className="w-4 h-4" /> Dark mode
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> All portals
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        
        {/* TOP STATUS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Today's Office Code</h4>
                <p className="text-xs text-zinc-400">Enter this when you punch in today.</p>
              </div>
            </div>
            <span className="text-4xl font-headline font-bold tracking-tighter">{currentDailyCode}</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Not a working day today</p>
            </div>
            <button className="text-xs font-bold text-zinc-400 hover:text-foreground flex items-center gap-1.5 transition-colors">
              Go to Attendance <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* WELCOME SECTION */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Lubega'}</h1>
          <p className="text-sm text-zinc-400">Your tasks, attendance and pending requests at a glance.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-zinc-200 dark:text-zinc-700" />
              </div>
              <div className="text-4xl font-headline font-bold">{stat.value}</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* UPCOMING TASKS */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Upcoming Tasks</h3>
                <button className="text-xs font-bold text-zinc-400 hover:text-foreground flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-8 space-y-8 overflow-y-auto max-h-[600px]">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex gap-6 group relative">
                    <div className="flex flex-col items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 z-10" />
                      {idx !== tasks.length - 1 && <div className="w-[1px] h-[calc(100%+2rem)] bg-zinc-100 dark:bg-zinc-800 absolute top-1.5" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors max-w-[70%] leading-tight">
                          {task.title}
                        </h4>
                        <span className={cn(
                          "text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                          task.color
                        )}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                          {task.type}
                        </span>
                        <span className="text-[10px] font-medium text-red-400">{task.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ATTENDANCE CALENDAR */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Attendance Calendar</h3>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="text-sm font-bold font-headline">2026</span>
                  <button className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                {attendanceMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{m.label}</div>
                    <div className={cn("text-xl font-bold font-headline", m.color)}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto bg-zinc-50/50 dark:bg-zinc-800/30 rounded-3xl p-6 text-center">
                <h4 className="text-sm font-bold mb-8">January</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[9px] font-bold text-zinc-300">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center text-[10px] font-medium text-zinc-400 hover:text-foreground transition-colors cursor-pointer">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
