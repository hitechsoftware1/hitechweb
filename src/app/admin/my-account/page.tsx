
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sun,
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
  Key,
  Camera,
  Upload,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Info,
  XCircle,
  Undo2,
  Check,
  Tag,
  Users,
  Zap,
  Paperclip,
  Send,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type TabType = 'Overview' | 'Profile' | 'Attendance' | 'Advance Retainer' | 'Allowances' | 'Punch-In Allowances' | 'Requisitions' | 'Projects & Tasks' | 'My Documents' | 'Files' | 'Chat';

export default function MyAccountPage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [projectSubTab, setProjectSubTab] = useState<'Project Based' | 'Standalone'>('Project Based');
  const [fileSubTab, setFileSubTab] = useState<'My Files' | 'Shared With Me'>('My Files');
  const [chatSearch, setChatSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    if (activeTab === 'Chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  // Daily Code Query
  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);
  
  const { data: activeCodes } = useCollection(dailyCodeQuery);
  const currentDailyCode = activeCodes?.[0]?.code || '--';

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

  const standaloneTasks = [
    { 
      title: 'Tmbla Rideshare Social Media Account Setup & Branding Task', 
      status: 'completed', 
      date: 'due May 31, 2026', 
      color: 'bg-orange-500',
      badges: ['GUIDELINES']
    },
    { 
      title: 'Functional Testing of the Bilar Platform', 
      status: 'in progress', 
      date: 'due Jun 8, 2026', 
      color: 'bg-orange-500',
      assignees: 5,
      badges: ['GUIDELINES']
    },
    { 
      title: 'Market Research & Competitive Positioning', 
      status: 'submitted for completion', 
      date: 'due Jun 12, 2026', 
      color: 'bg-red-500',
      assignees: 4,
      badges: ['GUIDELINES', 'AWAITING APPROVAL']
    },
    { 
      title: 'Property Manager Acquisition Campaign', 
      status: 'in progress', 
      date: 'due Jun 19, 2026', 
      color: 'bg-red-500',
      assignees: 3,
      cap: 'UGX 49,987.5',
      badges: ['GUIDELINES']
    },
    { 
      title: 'Educational Video Content Creation (YouTube & TikTok)', 
      status: 'in progress', 
      date: 'due Jun 19, 2026', 
      color: 'bg-blue-500',
      assignees: 4,
      badges: ['GUIDELINES']
    },
    { 
      title: 'Landlord Outreach Program', 
      status: 'in progress', 
      date: 'due Jun 30, 2026', 
      color: 'bg-red-500',
      assignees: 2,
      badges: ['GUIDELINES']
    },
    { 
      title: 'Tenant Demand Generation Campaign', 
      status: 'in progress', 
      date: 'due Jul 30, 2026', 
      color: 'bg-blue-500',
      assignees: 3,
      cap: 'UGX 1,999,987.5',
      badges: ['GUIDELINES']
    },
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

  const renderOverview = () => (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
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
            <p className="text-sm font-medium text-zinc-400">Working day today</p>
          </div>
          <button onClick={() => setActiveTab('Attendance')} className="text-xs font-bold text-zinc-400 hover:text-foreground flex items-center gap-1.5 transition-colors">
            Go to Attendance <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Lubega'}</h1>
        <p className="text-sm text-zinc-400">Your tasks, attendance and pending requests at a glance.</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Upcoming Tasks</h3>
              <button onClick={() => setActiveTab('Projects & Tasks')} className="text-xs font-bold text-zinc-400 hover:text-foreground flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[600px]">
              {standaloneTasks.slice(0, 5).map((task, idx) => (
                <div key={idx} className="flex gap-6 group relative">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 z-10", task.color)} />
                    {idx !== 4 && <div className="w-[1px] h-[calc(100%+2rem)] bg-zinc-100 dark:bg-zinc-800 absolute top-1.5" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors max-w-[70%] leading-tight">
                        {task.title}
                      </h4>
                      <span className={cn(
                        "text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                        task.status === 'completed' ? 'text-green-500 bg-green-500/10' : 'text-primary bg-primary/10'
                      )}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] font-medium text-zinc-400">{task.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 space-y-10">
        <div className="flex items-center gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <Avatar className="w-20 h-20 border-4 border-zinc-50 dark:border-zinc-800">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-2xl font-bold">
              {user?.displayName?.split(' ').map(n => n[0]).join('') || 'LJ'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user?.displayName || 'Lubega Joel'}</h2>
            <p className="text-sm text-zinc-400 font-medium">Employee</p>
            <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest mt-0.5">employee</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
            <input 
              defaultValue={user?.displayName || 'Lubega Joel'}
              className="h-12 w-full px-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email</Label>
            <input 
              defaultValue={user?.email || 'hitechsoftware03@gmail.com'}
              disabled
              className="h-12 w-full px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone</Label>
            <input 
              defaultValue="+256757038058"
              className="h-12 w-full px-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Department</Label>
            <div className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center px-4 text-zinc-400 text-sm font-medium">
              Projects
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Change Password (Leave blank to keep current)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">New Password</Label>
              <input type="password" placeholder="••••••••" className="h-12 w-full px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/40 outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Confirm</Label>
              <input type="password" placeholder="••••••••" className="h-12 w-full px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-primary/5 border-primary/10 focus:ring-2 focus:ring-primary/40 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Signature</h4>
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 mb-8 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800/70 dark:text-amber-200/50 leading-relaxed font-medium">
              Please ensure your signature is written in <span className="font-bold text-amber-700 dark:text-amber-400">dark ink on a plain white background</span> and is clearly legible. This signature will appear on official company documents.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Signature
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2">
              <Camera className="w-4 h-4" /> Take photo
            </Button>
            <span className="flex items-center text-[10px] font-bold text-zinc-300 uppercase tracking-widest">PNG or JPG, max 2MB</span>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-bold mb-1">Push notifications</h4>
          <p className="text-xs text-zinc-400 font-medium">Get alerts on this device even when the app is closed. Install the app to your home screen first for the best experience.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderAttendance = () => (
    <motion.div 
      key="attendance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Attendance</h1>
        <p className="text-sm text-zinc-400">Punch in at the start of your working day and punch out when you finish.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-3">
              {currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'LOADING...'}
            </p>
            <h2 className="text-5xl font-headline font-bold tracking-tighter mb-4">
              {currentTime ? currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '00:00:00 AM'}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Working hours: <span className="text-foreground">08:00 - 17:30</span> · Late after 30 min · Penalty 10%</span>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl h-12 px-6 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Not a working day
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-transparent">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">My Leave Requests</h3>
          <Button size="sm" className="bg-primary text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-primary/20">+ Request Leave</Button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-10 text-xs">
            <span className="text-zinc-500 font-bold w-24">Jun 3, 2026</span>
            <Badge className="bg-green-500/10 text-green-500 border-none rounded-lg px-3 py-1 font-bold text-[10px]">Approved</Badge>
            <div className="flex items-center gap-2">
              <span className="font-medium">Uganda Matrys Day</span>
              <span className="text-[10px] text-zinc-400 font-medium opacity-60">by Rumanzi Regen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-transparent">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">My Compensation Requests</h3>
            <p className="text-[10px] text-zinc-300 font-medium">Worked on a non-working day to make up for a working day you missed? Request compensation here.</p>
          </div>
          <Button size="sm" variant="outline" className="text-primary border-primary/20 bg-primary/5 font-bold rounded-xl h-10 px-6">+ Request Compensation</Button>
        </div>
        <div className="p-16 text-center text-zinc-400 italic text-xs font-medium opacity-60">
          No compensation requests yet.
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Recent History</h3>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-bold px-4 border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              June 2026 <ChevronRight className="w-3 h-3 rotate-90" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-bold px-4 border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              All modes <ChevronRight className="w-3 h-3 rotate-90" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 rounded-xl text-[10px] font-bold px-4 border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              All statuses <ChevronRight className="w-3 h-3 rotate-90" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/20">
              <tr className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Mode</th>
                <th className="px-8 py-5">Sessions</th>
                <th className="px-8 py-5">Total Hours</th>
                <th className="px-8 py-5">Late</th>
                <th className="px-8 py-5">Office Distance</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
              {[
                { date: 'Jun 10, 2026', mode: 'PHYSICAL', sessions: 1, hours: '10h 20m', late: '13 min', distance: '23m', status: 'Worked', distColor: 'text-green-500' },
                { date: 'Jun 8, 2026', mode: 'PHYSICAL', sessions: 1, hours: '12h 24m', late: '19 min', distance: '--', status: 'Worked', distColor: 'text-zinc-400' },
                { date: 'Jun 5, 2026', mode: 'PHYSICAL', sessions: 1, hours: '10h 54m', late: '--', distance: '--', status: 'Worked', distColor: 'text-zinc-400' },
                { date: 'Jun 1, 2026', mode: 'PHYSICAL', sessions: 1, hours: '12h 13m', late: '19 min', distance: '--', status: 'Worked', distColor: 'text-zinc-400' },
              ].map((row, i) => (
                <tr key={i} className="text-xs group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-6 font-bold">{row.date}</td>
                  <td className="px-8 py-6">
                    <Badge className="bg-amber-500/10 text-amber-600 border-none rounded px-2 py-0.5 text-[9px] font-bold">
                      {row.mode}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-zinc-400 font-bold">{row.sessions}</td>
                  <td className="px-8 py-6 font-bold text-foreground">{row.hours}</td>
                  <td className="px-8 py-6 text-zinc-400 font-medium">{row.late}</td>
                  <td className={cn("px-8 py-6 font-bold", row.distColor)}>{row.distance}</td>
                  <td className="px-8 py-6 text-green-500 font-bold">{row.status}</td>
                  <td className="px-8 py-6 text-right">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-foreground text-[10px] font-bold rounded-lg border-zinc-100">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderAdvanceRetainer = () => (
    <motion.div 
      key="advance-retainer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Advance Retainer</h1>
          <p className="text-sm text-zinc-400">Request a pro-rated salary advance based on days worked</p>
        </div>
        <Button className="bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl h-11 px-6 flex items-center gap-2 hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800 p-8 bg-zinc-50/30 dark:bg-zinc-900/50">
          <div className="pb-6 md:pb-0 md:pr-8">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Monthly Salary</p>
            <p className="text-xl font-headline font-bold">UGX 150,000</p>
          </div>
          <div className="py-6 md:py-0 md:px-8">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Est. Daily Rate</p>
            <p className="text-xl font-headline font-bold">UGX 11,538.46</p>
          </div>
          <div className="py-6 md:py-0 md:px-8">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Contract Period</p>
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">10 May 2026 - 30 Dec 2026</p>
          </div>
          <div className="pt-6 md:pt-0 md:pl-8">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Contract Status</p>
            <Badge className="bg-green-500/10 text-green-600 border-none font-bold rounded-lg px-3 py-1">203 days remaining</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 relative group hover:border-primary/20 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-headline font-bold">UGX 135,000</h3>
              <Badge className="bg-primary/10 text-primary border-none rounded-lg text-[10px] font-bold px-3 py-0.5">Submitted</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-500">10 May 2026 - 9 Jun 2026</p>
              <p className="text-xs text-zinc-400">12 days · Daily: UGX 11,538.46</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 self-stretch justify-center">
            <button className="text-[10px] font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Undo2 className="w-3 h-3" /> Revert to pending
            </button>
            <button className="text-[10px] font-bold text-red-400 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <XCircle className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAllowances = () => (
    <motion.div 
      key="allowances"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Allowances</h1>
        <p className="text-sm text-zinc-400">Request your monthly allowances — admin approval required</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Available Allowances</h3>
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-16 text-center">
          <p className="text-xs text-zinc-400 font-medium italic opacity-60">
            No allowances assigned to your account yet. Contact admin to set up allowances.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Request History</h3>
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-16 text-center">
          <p className="text-xs text-zinc-400 font-medium italic opacity-60">
            No allowance requests yet
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderPunchInAllowances = () => (
    <motion.div 
      key="punch-in-allowances"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Punch-In Allowances</h1>
        <p className="text-sm text-zinc-400">Request payment for daily allowances (transport, lunch, etc.) earned when you punched in.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">From</Label>
          <div className="relative">
            <Input defaultValue="05/11/2026" className="h-11 w-44 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 pr-10" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">To</Label>
          <div className="relative">
            <Input defaultValue="06/10/2026" className="h-11 w-44 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 pr-10" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Selected</p>
          <h3 className="text-3xl font-headline font-bold text-green-500">UGX 10,000</h3>
          <p className="text-[10px] text-zinc-400 font-medium">1 item(s) across 1 day(s)</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-green-500/20">
          Request Payment
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-transparent">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Earned & Unpaid</h3>
          <div className="flex gap-4">
             <button className="text-[10px] font-bold text-primary">Select All</button>
             <button className="text-[10px] font-bold text-primary">Deselect All</button>
          </div>
        </div>
        <div className="p-8">
           <div className="flex items-start gap-4">
              <Checkbox checked className="mt-1" />
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold">Wed, Jun 10, 2026</span>
                       <span className="text-[10px] text-zinc-300 font-medium">· 10h 20m worked</span>
                    </div>
                    <span className="text-sm font-bold">UGX 10,000</span>
                 </div>
                 <div className="inline-flex items-center gap-2 bg-green-500/5 border border-green-500/20 px-3 py-1.5 rounded-lg">
                    <Checkbox checked className="border-green-500 data-[state=checked]:bg-green-500" />
                    <span className="text-[10px] font-bold text-green-600">Transport UGX 10,000</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Paid History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/20">
              <tr className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Hours</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Paid At</th>
                <th className="px-8 py-5">Requisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
              {[
                { date: 'Mon, Jun 1, 2026', name: 'Transport', hours: '12h 13m / 9h 30m', amount: 'UGX 10,000', paidAt: 'Jun 10, 2026, 03:24 PM', req: 'Punch-In Allowances Payout' },
                { date: 'Fri, Jun 5, 2026', name: 'Transport', hours: '10h 54m / 9h 30m', amount: 'UGX 10,000', paidAt: 'Jun 10, 2026, 03:24 PM', req: 'Punch-In Allowances Payout' },
                { date: 'Mon, Jun 8, 2026', name: 'Transport', hours: '12h 24m / 9h 30m', amount: 'UGX 10,000', paidAt: 'Jun 10, 2026, 03:24 PM', req: 'Punch-In Allowances Payout' },
                { date: 'Mon, May 25, 2026', name: 'Transport', hours: '10h 24m', amount: 'UGX 10,000', paidAt: 'Jun 1, 2026, 08:48 PM', req: 'Punch-In Allowances Payout' },
                { date: 'Fri, May 29, 2026', name: 'Transport', hours: '14h 1m', amount: 'UGX 10,000', paidAt: 'Jun 1, 2026, 08:48 PM', req: 'Punch-In Allowances Payout' },
                { date: 'Fri, May 15, 2026', name: 'Transport', hours: '12h 19m', amount: 'UGX 10,000', paidAt: 'May 26, 2026, 07:25 PM', req: 'Punch-In Allowances Payout' },
              ].map((row, i) => (
                <tr key={i} className="text-xs group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-6 font-bold">{row.date}</td>
                  <td className="px-8 py-6 text-zinc-400 font-medium">{row.name}</td>
                  <td className="px-8 py-6 text-zinc-400 font-medium">{row.hours}</td>
                  <td className="px-8 py-6 font-bold text-green-600">{row.amount}</td>
                  <td className="px-8 py-6 text-zinc-400 font-medium">{row.paidAt}</td>
                  <td className="px-8 py-6 text-zinc-400 font-medium">{row.req}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderRequisitions = () => (
    <motion.div 
      key="requisitions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Requisitions</h1>
          <p className="text-sm text-zinc-400">Request items or supplies</p>
        </div>
        <Button className="bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl h-11 px-6 flex items-center gap-2 hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> New Requisition
        </Button>
      </div>

      <div className="flex gap-2 pb-2">
        {['All', 'Draft', 'Submitted', 'Approved', 'Rejected', 'Fulfilled'].map((filter) => (
          <Button 
            key={filter}
            variant="outline" 
            size="sm" 
            className={cn(
              "h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border-zinc-200 dark:border-zinc-800",
              filter === 'All' ? "bg-zinc-950 dark:bg-white text-white dark:text-black border-none" : "text-zinc-400 hover:text-foreground"
            )}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { id: '1', title: 'Punch-In Allowances Payout', priority: 'medium', desc: 'Punch-in allowance payout request for 3 earned item(s). Awaiting accounts review.', items: 3, total: '30,037.5', date: 'Jun 9, 2026', status: 'fulfilled' },
          { id: '2', title: 'Punch-In Allowances Payout', priority: 'medium', desc: 'Punch-in allowance payout request for 2 earned item(s). Awaiting accounts review.', items: 2, total: '20,025', date: 'Jun 1, 2026', status: 'fulfilled' },
          { id: '3', title: 'Punch-In Allowances Payout', priority: 'medium', desc: 'Punch-in allowance payout request for 5 earned item(s). Awaiting accounts review.', items: 5, total: '50,062.5', date: 'May 22, 2026', status: 'fulfilled' },
        ].map((req) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold">{req.title}</h3>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-bold uppercase px-2 py-0.5 rounded-md">
                    {req.priority}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 font-medium max-w-2xl leading-relaxed">
                  {req.desc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-green-500/10 text-green-500 border-none font-bold text-[9px] uppercase px-3 py-1 rounded-full">
                  {req.status}
                </Badge>
                <Button variant="ghost" className="text-zinc-400 hover:text-foreground text-[10px] font-bold p-0 h-auto">View</Button>
              </div>
            </div>
            <div className="flex gap-6 items-center pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
               <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{req.items} item(s)</span>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total:</span>
                  <span className="text-sm font-bold">UGX {req.total}</span>
               </div>
               <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest ml-auto">{req.date}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProjectsAndTasks = () => (
    <motion.div 
      key="projects-tasks"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Projects & Tasks</h1>
        <p className="text-sm text-zinc-400">Projects you're a member of plus any standalone tasks assigned to you.</p>
      </div>

      <div className="flex gap-10 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <button 
          onClick={() => setProjectSubTab('Project Based')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest pb-3 relative transition-all",
            projectSubTab === 'Project Based' ? "text-foreground" : "text-zinc-400 hover:text-zinc-500"
          )}
        >
          Project Based
          {projectSubTab === 'Project Based' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />}
        </button>
        <button 
          onClick={() => setProjectSubTab('Standalone')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest pb-3 relative transition-all",
            projectSubTab === 'Standalone' ? "text-foreground" : "text-zinc-400 hover:text-zinc-500"
          )}
        >
          Stand Alone Tasks (7)
          {projectSubTab === 'Standalone' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />}
        </button>
      </div>

      {projectSubTab === 'Project Based' ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 group hover:border-primary/20 transition-all flex justify-between items-start">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Bilar - Property Manager Platform</h3>
              <p className="text-xs text-zinc-400 font-medium max-w-3xl leading-relaxed">
                Uganda Property Rental & Management Platform Direct Landlord & PMC - per-building management - category-driven listings - commission & owner payouts
              </p>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">9 tasks</p>
            </div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">draft</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {standaloneTasks.map((task, idx) => (
             <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 group hover:border-primary/20 transition-all">
                <div className="flex items-start gap-5">
                   <div className={cn("w-2 h-2 rounded-full mt-2.5", task.color)} />
                   <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                         <h4 className="text-sm font-bold tracking-tight">{task.title}</h4>
                         <Badge className={cn(
                            "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
                            task.status === 'completed' ? "bg-green-500/10 text-green-500" : 
                            task.status === 'submitted for completion' ? "bg-amber-500/10 text-amber-500" :
                            "bg-primary/10 text-primary"
                         )}>
                            {task.status}
                         </Badge>
                         {task.badges.map(b => (
                            <Badge key={b} className={cn(
                               "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
                               b === 'GUIDELINES' ? "bg-purple-500/10 text-purple-500" : "bg-amber-500/10 text-amber-600"
                            )}>
                               {b}
                            </Badge>
                         ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-zinc-400">
                         <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {task.date}
                         </div>
                         {task.assignees && (
                            <div className="flex items-center gap-1.5">
                               <Users className="w-3.5 h-3.5" />
                               {task.assignees} assignees
                            </div>
                         )}
                         {task.cap && (
                            <div className="flex items-center gap-1.5 text-amber-600">
                               <Zap className="w-3.5 h-3.5 fill-current" />
                               cap {task.cap}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderMyDocuments = () => (
    <motion.div 
      key="my-documents"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Documents</h1>
        <p className="text-sm text-zinc-400 font-medium">Files and documents attached to your account</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-32 flex flex-col items-center justify-center text-center">
        <FileText className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mb-4" />
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">No documents yet</h3>
        <p className="text-sm text-zinc-400 font-medium">
          Documents uploaded by your administrator will appear here
        </p>
      </div>
    </motion.div>
  );

  const renderFiles = () => (
    <motion.div 
      key="files"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Files</h1>
          <p className="text-sm text-zinc-400 font-medium">Upload, manage and share your files.</p>
        </div>
        <Button className="bg-black dark:bg-white dark:text-black text-white font-bold rounded-xl h-11 px-6 flex items-center gap-2 hover:scale-[1.02] transition-all">
          <Upload className="w-4 h-4" /> Upload
        </Button>
      </div>

      <div className="flex gap-4">
        {['My Files', 'Shared With Me'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFileSubTab(tab as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              fileSubTab === tab ? "bg-zinc-950 dark:bg-white text-white dark:text-black" : "text-zinc-400 hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
        <input 
          placeholder="Search files..." 
          className="w-full h-12 pl-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-32 flex flex-col items-center justify-center text-center">
        <Folder className="w-12 h-12 text-zinc-100 dark:text-zinc-800 mb-4" />
        <p className="text-sm text-zinc-400 font-medium">
          No files uploaded yet.
        </p>
      </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div 
      key="chat"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="flex h-[calc(100vh-100px)] overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl"
    >
      {/* Inbox List Column */}
      <div className="w-[380px] border-r border-zinc-100 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold tracking-tight">Chat</h3>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-3 h-3" /> Group
            </Button>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <input 
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search messages or people..." 
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-none text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-1 p-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
             <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-zinc-900 rounded-lg shadow-sm">Chats</button>
             <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground">People</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 1, name: 'Deepcode group', last: 'Photo', date: 'Jun 1', active: true, isGroup: true },
            { id: 2, name: 'Cole Amri Kitalikibi', last: 'deepcode12.jpg', date: 'Jun 1', initial: 'CK' },
            { id: 3, name: 'Kabaale Micheal', last: 'Hello Graphics Team, As part of the Tm...', date: 'May 28', initial: 'KM' },
            { id: 4, name: 'Rumanzi Regan', last: 'No messages yet', date: '', initial: 'RR' },
          ].map((chat) => (
            <button 
              key={chat.id} 
              className={cn(
                "w-full p-4 flex gap-4 transition-all border-l-2",
                chat.active ? "bg-zinc-50/80 dark:bg-zinc-800/30 border-primary" : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
                {chat.isGroup ? <Users className="w-5 h-5 text-zinc-400" /> : <span className="text-xs font-bold text-zinc-500">{chat.initial}</span>}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate max-w-[150px]">{chat.name}</h4>
                  <span className="text-[10px] font-medium text-zinc-300">{chat.date}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
                  {chat.last === 'Photo' && <Files className="w-3 h-3" />}
                  {chat.last}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Content Column */}
      <div className="flex-1 flex flex-col bg-zinc-50/30 dark:bg-[#0C0C0E]">
        {/* Chat Header */}
        <div className="h-20 px-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
               <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-sm">Deepcode group</h3>
                 <button className="text-[10px] font-bold text-primary hover:underline">Details</button>
              </div>
              <p className="text-[10px] font-medium text-zinc-400">7 members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400"><Search className="w-4 h-4" /></Button>
             <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Incoming Message Block */}
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-primary text-white p-5 rounded-[1.5rem] rounded-tl-none shadow-lg shadow-primary/5 text-sm font-light leading-relaxed">
              Cover/banner variations if available
            </div>
            <div className="bg-primary text-white p-5 mt-2 rounded-[1.5rem] rounded-tl-none shadow-lg shadow-primary/5 text-sm font-light leading-relaxed">
              Thank you.
            </div>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-2 px-2">03:03 PM</span>
          </div>

          {/* Image Grid Block (From Rumanzi Regan) */}
          <div className="flex flex-col items-start max-w-[85%]">
            <span className="text-[10px] font-bold text-zinc-400 mb-3 px-2">Rumanzi Regan</span>
            <div className="bg-white dark:bg-zinc-900 p-2 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="grid grid-cols-2 gap-2 w-[320px]">
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                   <Image src="https://i.pinimg.com/736x/c3/e3/30/c3e3308157323082520d57055e4434c7.jpg" alt="Logo 1" fill className="object-cover opacity-80" />
                </div>
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                   <Image src="https://i.pinimg.com/736x/c3/e3/30/c3e3308157323082520d57055e4434c7.jpg" alt="Logo 2" fill className="object-cover opacity-80" />
                </div>
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                   <Image src="https://i.pinimg.com/736x/34/f8/10/34f81022af3da1b3d60d0fa4315de706.jpg" alt="Logo 3" fill className="object-cover opacity-80" />
                </div>
                <div className="aspect-square bg-zinc-950 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                   <Image src="https://i.pinimg.com/736x/34/f8/10/34f81022af3da1b3d60d0fa4315de706.jpg" alt="Logo 4" fill className="object-cover opacity-40 blur-[1px]" />
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xl font-bold text-white font-headline">+1</span>
                   </div>
                </div>
              </div>
            </div>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-2 px-2">12:14 PM</span>
          </div>

          {/* Outgoing Message Block */}
          <div className="flex flex-col items-end ml-auto max-w-[85%]">
            <div className="bg-primary text-white p-4 rounded-[1.5rem] rounded-tr-none shadow-lg shadow-primary/10 text-sm font-bold">
               Hey team
            </div>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-2 px-2">05:43 PM</span>
          </div>

          <div className="flex flex-col items-end ml-auto max-w-[85%]">
            <div className="bg-primary text-white p-6 rounded-[1.5rem] rounded-tr-none shadow-lg shadow-primary/10 text-sm font-medium leading-relaxed">
               Since we have not got any assets for Bilar unless the logos, I have come up with a temporally cover BANNER to be used on our social accounts setup as we wait from the graphics department .let me post here you share a comment about it .thank you
            </div>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-2 px-2">05:46 PM - edited</span>
          </div>

          {/* Target for scrolling */}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800">
           <form className="flex gap-4 items-center">
              <div className="flex-1 relative">
                 <input 
                    placeholder="Type a message..." 
                    className="w-full h-14 pl-6 pr-12 rounded-[1.2rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
                 />
                 <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-primary transition-colors">
                    <Paperclip className="w-5 h-5" />
                 </button>
              </div>
              <Button type="submit" className="h-14 px-8 rounded-[1.2rem] bg-zinc-500 dark:bg-zinc-400 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-md">
                 Send
              </Button>
           </form>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
              {logo ? (
                <Image 
                  src={logo.imageUrl} 
                  alt="HITECH Logo" 
                  width={32} 
                  height={32} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xs">H</div>
              )}
            </div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">My Account</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as TabType)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" 
                    : "text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400 group-hover:text-zinc-500")} />
                  {item.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> All portals
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Profile' && renderProfile()}
          {activeTab === 'Attendance' && renderAttendance()}
          {activeTab === 'Advance Retainer' && renderAdvanceRetainer()}
          {activeTab === 'Allowances' && renderAllowances()}
          {activeTab === 'Punch-In Allowances' && renderPunchInAllowances()}
          {activeTab === 'Requisitions' && renderRequisitions()}
          {activeTab === 'Projects & Tasks' && renderProjectsAndTasks()}
          {activeTab === 'My Documents' && renderMyDocuments()}
          {activeTab === 'Files' && renderFiles()}
          {activeTab === 'Chat' && renderChat()}
          {activeTab !== 'Overview' && activeTab !== 'Profile' && activeTab !== 'Attendance' && activeTab !== 'Advance Retainer' && activeTab !== 'Allowances' && activeTab !== 'Punch-In Allowances' && activeTab !== 'Requisitions' && activeTab !== 'Projects & Tasks' && activeTab !== 'My Documents' && activeTab !== 'Files' && activeTab !== 'Chat' && (
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
