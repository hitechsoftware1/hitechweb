
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
  UserPlus,
  Loader2,
  X,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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

type TabType = 'Overview' | 'Profile' | 'Attendance' | 'Advance Retainer' | 'Allowances' | 'Punch-In Allowances' | 'Requisitions' | 'Projects & Tasks' | 'My Documents' | 'Files' | 'Chat';

export default function MyAccountPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [projectSubTab, setProjectSubTab] = useState<'Project Based' | 'Standalone'>('Project Based');
  const [fileSubTab, setFileSubTab] = useState<'My Files' | 'Shared With Me'>('My Files');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Auth Guard
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Leave Form State
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);

  // Compensation Form State
  const [isCompDialogOpen, setIsCompDialogOpen] = useState(false);
  const [missedDate, setMissedDate] = useState('');
  const [submittingComp, setSubmittingComp] = useState(false);

  // Retainer Form State
  const [isNewRetainerOpen, setIsNewRetainerOpen] = useState(false);
  const [retainerStartDate, setRetainerStartDate] = useState('2026-06-10');
  const [retainerEndDate, setRetainerEndDate] = useState('2026-06-11');
  const [submittingRetainer, setSubmittingRetainer] = useState(false);
  const dailyRate = 11538.46;

  // Requisitions Form State
  const [isNewRequisitionOpen, setIsNewRequisitionOpen] = useState(false);
  const [submittingReq, setSubmittingReq] = useState(false);
  const [reqItems, setReqItems] = useState([{ name: '', qty: 1, unit: '', cost: '' }]);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqPriority, setReqPriority] = useState('Medium');
  const [reqDept, setReqDept] = useState('');
  const [reqSupplier, setReqSupplier] = useState('');

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

  const handleRequestLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !leaveDate || !leaveReason) return;
    setSubmittingLeave(true);

    const leaveData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      date: leaveDate,
      reason: leaveReason,
      type: 'paid_leave',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, 'attendance'), leaveData)
      .then(() => {
        toast({
          title: "Leave Request Transmitted",
          description: `Your paid leave request for ${leaveDate} has been logged for review.`,
        });
        setIsLeaveDialogOpen(false);
        setLeaveDate('');
        setLeaveReason('');
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Transmission Failed",
          description: "Could not log leave request. Verify neural connection.",
        });
      })
      .finally(() => setSubmittingLeave(false));
  };

  const handleRequestCompensation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !missedDate) return;
    setSubmittingComp(true);

    const compData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      date: missedDate,
      type: 'compensation',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, 'attendance'), compData)
      .then(() => {
        toast({
          title: "Compensation Transmitted",
          description: `Your request to compensate for missed day ${missedDate} has been logged.`,
        });
        setIsCompDialogOpen(false);
        setMissedDate('');
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Transmission Failed",
          description: "Could not log compensation request. Check network uplink.",
        });
      })
      .finally(() => setSubmittingComp(false));
  };

  const handleRetainerSubmit = async () => {
    if (!db || !user) return;
    setSubmittingRetainer(true);

    const retainerData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      startDate: retainerStartDate,
      endDate: retainerEndDate,
      amount: dailyRate,
      status: 'submitted',
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, 'retainerRequests'), retainerData)
      .then(() => {
        toast({
          title: "Retainer Transmitted",
          description: `Advance request for UGX ${dailyRate.toLocaleString()} logged for review.`,
        });
        setIsNewRetainerOpen(false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Transmission Error",
          description: "Could not process retainer request. Neural sync failure.",
        });
      })
      .finally(() => setSubmittingRetainer(false));
  };

  const handleAddReqItem = () => {
    setReqItems([...reqItems, { name: '', qty: 1, unit: '', cost: '' }]);
  };

  const handleRemoveReqItem = (idx: number) => {
    if (reqItems.length === 1) return;
    setReqItems(reqItems.filter((_, i) => i !== idx));
  };

  const handleUpdateReqItem = (idx: number, field: string, value: any) => {
    const updated = [...reqItems];
    (updated[idx] as any)[field] = value;
    setReqItems(updated);
  };

  const handleReqSubmit = async () => {
    if (!db || !user) return;
    setSubmittingReq(true);

    const totalCost = reqItems.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
    const reqData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      title: reqTitle,
      description: reqDesc,
      priority: reqPriority,
      department: reqDept,
      supplier: reqSupplier,
      items: reqItems,
      totalAmount: totalCost,
      status: 'submitted',
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, 'requisitions'), reqData)
      .then(() => {
        toast({
          title: "Requisition Transmitted",
          description: "Your item request has been logged for institutional review.",
        });
        setIsNewRequisitionOpen(false);
        setReqItems([{ name: '', qty: 1, unit: '', cost: '' }]);
        setReqTitle('');
        setReqDesc('');
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Link Error",
          description: "Failed to transmit requisition. Check neural throughput.",
        });
      })
      .finally(() => setSubmittingReq(false));
  };

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
    }
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
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              {standaloneTasks.map((task, idx) => (
                <div key={idx} className="flex gap-6 group relative">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 z-10", task.color)} />
                    {idx !== standaloneTasks.length - 1 && <div className="w-[1px] h-[calc(100%+2rem)] bg-zinc-100 dark:bg-zinc-800 absolute top-1.5" />}
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
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-[9px] font-bold text-zinc-300">{d}</div>
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
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl">
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
            <p className="text-sm text-zinc-400 font-medium">{user?.email === 'hitechsoftware03@gmail.com' ? 'Super Admin' : 'Employee'}</p>
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
        </div>

        <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Signature</h4>
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 mb-8 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800/70 dark:text-amber-200/50 leading-relaxed font-medium">
              Please ensure your signature is written in <span className="font-bold text-amber-700 dark:text-amber-400">dark ink on a plain white background</span> and is clearly legible.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Signature
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2">
              <Camera className="w-4 h-4" /> Take photo
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as TabType)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">
            <ArrowLeft className="w-4 h-4" /> All portals
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Profile' && renderProfile()}
          {/* Add other renders as needed */}
          {activeTab !== 'Overview' && activeTab !== 'Profile' && (
            <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh] text-zinc-400 italic">
              {activeTab} module is initializing...
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
