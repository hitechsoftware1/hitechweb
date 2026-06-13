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
  Trash2,
  FileCode,
  Archive,
  Star,
  ExternalLink,
  ChevronDown,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, doc, setDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type TabType = 'Overview' | 'Profile' | 'Attendance' | 'Advance Retainer' | 'Allowances' | 'Punch-In Allowances' | 'Requisitions' | 'Projects & Tasks' | 'My Documents' | 'Files' | 'Chat';

export default function MyAccountPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // Attendance Form State
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isCompDialogOpen, setIsCompDialogOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [missedDate, setMissedDate] = useState('');

  // Retainer Form State
  const [isNewRetainerOpen, setIsNewRetainerOpen] = useState(false);
  const [retainerAmount, setRetainerAmount] = useState('');
  const [retainerReason, setRetainerReason] = useState('');

  // Requisitions Form State
  const [isNewRequisitionOpen, setIsNewRequisitionOpen] = useState(false);
  const [reqItems, setReqItems] = useState([{ name: '', qty: 1, unit: 'pcs', cost: '' }]);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');

  // Sub-tabs
  const [projectSubTab, setProjectSubTab] = useState<'Projects' | 'Tasks'>('Tasks');

  // Real-time Data
  const { data: attendanceLogs } = useCollection(db && user ? query(collection(db, 'attendance'), where('userId', '==', user.uid), orderBy('date', 'desc')) : null);
  const { data: myTasks } = useCollection(db && user ? query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), orderBy('createdAt', 'desc')) : null);
  const { data: allProjects } = useCollection(db ? query(collection(db, 'projects'), orderBy('startDate', 'desc')) : null);
  const { data: myRequisitions } = useCollection(db && user ? query(collection(db, 'requisitions'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')) : null);
  const { data: activeCodes } = useCollection(db ? query(collection(db, 'officeCodes'), where('date', '==', new Date().toISOString().split('T')[0])) : null);

  useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

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

  const handleLogout = () => signOut(auth).then(() => window.location.href = '/');

  // --- MUTATIONS ---

  const submitRequisition = async () => {
    if (!db || !user) return;
    const total = reqItems.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
    const data = {
      userId: user.uid,
      userName: user.displayName || user.email,
      title: reqTitle,
      description: reqDesc,
      items: reqItems,
      totalAmount: total,
      status: 'submitted',
      createdAt: serverTimestamp(),
    };
    addDoc(collection(db, 'requisitions'), data)
      .then(() => {
        toast({ title: "Requisition Dispatched", description: "Your fund request is now awaiting review." });
        setIsNewRequisitionOpen(false);
        setReqItems([{ name: '', qty: 1, unit: 'pcs', cost: '' }]);
        setReqTitle('');
        setReqDesc('');
      });
  };

  const submitLeave = async () => {
    if (!db || !user) return;
    const data = { userId: user.uid, userName: user.displayName || user.email, date: leaveDate, type: 'paid_leave', reason: leaveReason, status: 'pending', createdAt: serverTimestamp() };
    addDoc(collection(db, 'attendance'), data).then(() => {
      toast({ title: "Leave Requested", description: `Paid leave request for ${leaveDate} logged.` });
      setIsLeaveDialogOpen(false);
    });
  };

  const submitRetainerRequest = async () => {
    if (!db || !user) return;
    const data = { userId: user.uid, userName: user.displayName || user.email, amount: parseFloat(retainerAmount), reason: retainerReason, status: 'pending', createdAt: serverTimestamp() };
    addDoc(collection(db, 'retainerRequests'), data).then(() => {
      toast({ title: "Advance Dispatched", description: "Neural sync: Retainer request logged for review." });
      setIsNewRetainerOpen(false);
      setRetainerAmount('');
      setRetainerReason('');
    });
  };

  // --- RENDERERS ---

  const renderAttendance = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Attendance Protocol</h1>
          <p className="text-sm text-zinc-400 font-medium">Verified shift history and leave management.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsLeaveDialogOpen(true)} variant="outline" className="rounded-xl h-11 px-6 font-bold border-primary/20 text-primary">
            Request Leave
          </Button>
          <Button onClick={() => setIsCompDialogOpen(true)} variant="outline" className="rounded-xl h-11 px-6 font-bold">
            Request Compensation
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Node</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type / Code</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</TableHead>
              <TableHead className="px-8 py-5 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Logs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {attendanceLogs?.map((log: any) => (
              <TableRow key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all border-none">
                <TableCell className="px-8 py-6 font-bold text-xs">{log.date}</TableCell>
                <TableCell className="px-8 py-6">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{log.type || 'Standard Shift'}</p>
                  <p className="text-[9px] text-zinc-300 font-mono">VAL: {log.officeCodeUsed || 'N/A'}</p>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold uppercase",
                    log.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                    log.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                    'border-amber-500/20 text-amber-500 bg-amber-500/5'
                  )}>{log.status}</Badge>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <span className="text-[10px] font-bold text-zinc-400">{log.punchInTime ? 'IN: Active' : 'MISSING'}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );

  const renderFinancials = (title: string, data: any[], type: 'retainer' | 'allowance' | 'punch') => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
          <p className="text-sm text-zinc-400 font-medium">Institutional financial synchronization nodes.</p>
        </div>
        {type === 'retainer' && (
          <Button onClick={() => setIsNewRetainerOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Request Advance
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.length ? data.map((item: any) => (
          <div key={item.id} className="apple-card p-8 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Wallet className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[8px] font-bold uppercase border-primary/20 text-primary">{item.status}</Badge>
            </div>
            <p className="text-2xl font-headline font-bold mb-1">UGX {item.amount?.toLocaleString() || '0'}</p>
            <p className="text-xs text-zinc-400 font-medium line-clamp-1">{item.reason || item.title || 'Institutional credit'}</p>
            <div className="mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{item.createdAt?.toDate().toLocaleDateString() || 'Node Syncing'}</span>
              <button className="text-[9px] font-bold text-primary hover:opacity-80">View Details</button>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-20 text-center text-zinc-400 italic text-xs">No active nodes in the financial buffer.</div>
        )}
      </div>
    </motion.div>
  );

  const renderRequisitions = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Requisition Ledger</h1>
          <p className="text-sm text-zinc-400 font-medium">Manage itemized fund or material requests.</p>
        </div>
        <Button onClick={() => setIsNewRequisitionOpen(true)} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Requisition
        </Button>
      </div>

      <div className="space-y-4">
        {myRequisitions?.map((req: any) => (
          <div key={req.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-md transition-all">
            <div className="flex gap-6 items-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="font-bold text-base">{req.title}</h4>
                   <Badge variant="outline" className={cn(
                     "text-[8px] font-bold uppercase tracking-widest",
                     req.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                     req.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-zinc-200'
                   )}>{req.status}</Badge>
                </div>
                <p className="text-xs text-zinc-400 font-medium">{req.items?.length || 0} items • <span className="text-primary font-bold">UGX {req.totalAmount?.toLocaleString()}</span></p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-zinc-300 hover:text-primary transition-colors flex items-center gap-2">
               Institutional Review <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProjectsAndTasks = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Operations Matrix</h1>
          <p className="text-sm text-zinc-400 font-medium">Assigned mission directives and active strategic portals.</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
           {['Tasks', 'Projects'].map(t => (
             <button 
               key={t} 
               onClick={() => setProjectSubTab(t as any)} 
               className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", projectSubTab === t ? "bg-white dark:bg-zinc-950 text-foreground shadow-sm" : "text-zinc-400 hover:text-zinc-500")}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectSubTab === 'Tasks' ? (
          myTasks?.map((task: any) => (
            <div key={task.id} className="apple-card p-8 group">
              <div className="flex justify-between items-start mb-6">
                <Badge className="bg-primary/10 text-primary border-none text-[8px] uppercase tracking-widest">{task.priority}</Badge>
                <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2 leading-tight">{task.title}</h4>
              <p className="text-xs text-zinc-400 line-clamp-3 mb-8">{task.description}</p>
              <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
                 <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">DUE: {task.dueDate}</span>
                 <Badge variant="secondary" className="text-[7px] font-bold uppercase bg-zinc-50 dark:bg-zinc-800">{task.status}</Badge>
              </div>
            </div>
          ))
        ) : (
          allProjects?.map((proj: any) => (
            <div key={proj.id} className="apple-card p-8 group overflow-hidden">
               <div className="flex justify-between items-start mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                     <Archive className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[8px] font-bold uppercase">{proj.status}</Badge>
               </div>
               <h4 className="text-xl font-bold mb-2">{proj.title}</h4>
               <p className="text-xs text-zinc-400 mb-8">{proj.clientName}</p>
               <div className="space-y-3">
                  <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                     <span>Neural Sync</span>
                     <span>{proj.progress || 0}%</span>
                  </div>
                  <Progress value={proj.progress || 0} className="h-1" />
               </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderFiles = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Institutional Storage</h1>
          <p className="text-sm text-zinc-400 font-medium">Technical blueprints, contracts, and shared assets.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Blueprint_v2.pdf', type: 'PDF', size: '2.4 MB' },
            { name: 'Architecture.svg', type: 'SVG', size: '412 KB' },
            { name: 'Contract_Main.pdf', type: 'PDF', size: '1.1 MB' },
            { name: 'Neural_Keys.json', type: 'JSON', size: '12 KB' },
          ].map((file, i) => (
            <div key={i} className="apple-card p-6 flex flex-col items-center text-center group">
               <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <FileCode className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-bold text-foreground mb-1 truncate w-full">{file.name}</p>
               <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{file.size}</p>
            </div>
          ))}
          <div className="apple-card p-6 border-dashed flex flex-col items-center justify-center text-zinc-300 hover:border-primary/50 hover:text-primary cursor-pointer transition-all">
             <Plus className="w-6 h-6 mb-2" />
             <span className="text-[10px] font-bold uppercase">Upload</span>
          </div>
       </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="apple-card p-0 flex flex-col h-[70vh] overflow-hidden">
       <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg">Z</div>
             <div>
                <h4 className="font-bold text-sm">Zainab Neural Bridge</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active uplink</span>
                </div>
             </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400"><Settings className="w-4 h-4" /></Button>
       </div>
       <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col items-start max-w-[80%]">
             <div className="p-5 rounded-2xl rounded-tl-none bg-zinc-50 dark:bg-zinc-800 text-sm font-light leading-relaxed">
                Greetings, Engineer. I am synchronized with your current mission directives. How can I assist with your architectural output today?
             </div>
             <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest mt-2">Zainab // BOOT</span>
          </div>
       </div>
       <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="relative flex items-center gap-3">
             <Input placeholder="Message the neural concierge..." className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none pr-14" />
             <Button className="h-14 w-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all"><Send className="w-5 h-5" /></Button>
          </div>
       </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Today's Office Code</h4>
              <p className="text-xs text-zinc-400">Shift validation node.</p>
            </div>
          </div>
          <span className="text-4xl font-headline font-bold text-primary">{activeCodes?.[0]?.code || '--'}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Active Cluster</p>
          </div>
          <button onClick={() => setActiveTab('Attendance')} className="text-xs font-bold text-primary flex items-center gap-1.5 transition-colors">
            Verify Presence <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Projects', value: allProjects?.length || 0, icon: Briefcase },
          { label: 'Active Tasks', value: myTasks?.length || 0, icon: Target },
          { label: 'Requisitions', value: myRequisitions?.length || 0, icon: FileCheck },
          { label: 'Attend. Grade', value: '88%', icon: Zap },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-zinc-200 dark:text-zinc-700" />
            </div>
            <div className="text-4xl font-headline font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
           <div className="apple-card p-10 h-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8">Mission Priorities</h3>
              <div className="space-y-6">
                 {myTasks?.slice(0, 3).map((task: any) => (
                   <div key={task.id} className="flex gap-6 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                         <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                         <p className="text-[10px] text-zinc-400 uppercase tracking-widest">DUE: {task.dueDate}</p>
                      </div>
                      <Badge variant="secondary" className="text-[7px] font-bold uppercase bg-zinc-50 dark:bg-zinc-800">{task.status}</Badge>
                   </div>
                 ))}
                 {(!myTasks || myTasks.length === 0) && <p className="text-xs text-zinc-400 italic">No priorities defined in the matrix.</p>}
              </div>
           </div>
        </div>
        <div className="lg:col-span-5">
           <div className="apple-card p-10 h-full bg-primary/5 border-primary/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8">Uplink Status</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-400">Profile Sync</span>
                    <span className="text-xs font-bold text-green-500">COMPLETE</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-400">Neural Encryption</span>
                    <span className="text-xs font-bold text-primary">AES-256</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-400">Institutional Role</span>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">{user?.email === 'hitechsoftware03@gmail.com' ? 'Super Admin' : 'Worker Unit'}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );

  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  }

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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">ACCOUNT</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as TabType)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" : "text-zinc-400 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400 group-hover:text-zinc-500")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Back Hub</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Attendance' && renderAttendance()}
          {activeTab === 'Advance Retainer' && renderFinancials('Advance Retainers', [], 'retainer')}
          {activeTab === 'Allowances' && renderFinancials('Monthly Allowances', [], 'allowance')}
          {activeTab === 'Punch-In Allowances' && renderFinancials('Punch-In Performance', [], 'punch')}
          {activeTab === 'Requisitions' && renderRequisitions()}
          {activeTab === 'Projects & Tasks' && renderProjectsAndTasks()}
          {activeTab === 'My Documents' && renderFiles()}
          {activeTab === 'Files' && renderFiles()}
          {activeTab === 'Chat' && renderChat()}
          {activeTab === 'Profile' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl apple-card p-12">
                <div className="flex items-center gap-8 mb-12 pb-12 border-b border-zinc-100 dark:border-zinc-800">
                   <Avatar className="w-24 h-24 border-4 border-zinc-50 dark:border-zinc-900">
                      <AvatarFallback className="bg-primary text-white text-3xl font-bold uppercase">{user?.displayName?.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h2 className="text-3xl font-bold">{user?.displayName}</h2>
                      <p className="text-sm text-zinc-400 font-medium">{user?.email}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Institutional ID</Label>
                      <Input value={user?.uid} disabled className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Encryption Level</Label>
                      <Input value="HITECH-v5-Neural" disabled className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900" />
                   </div>
                </div>
                <Button className="rounded-xl h-12 px-10 font-bold uppercase tracking-widest text-[10px]">Update Profile Node</Button>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DIALOGS */}

      <Dialog open={isNewRequisitionOpen} onOpenChange={setIsNewRequisitionOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Financial Requisition</DialogTitle>
            <DialogDescription>Submit an itemized fund request for institutional review.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
             <div className="space-y-2">
                <Label>Request Title</Label>
                <Input value={reqTitle} onChange={e => setReqTitle(e.target.value)} placeholder="e.g. Workstation Infrastructure Upgrade" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label>Details / Justification</Label>
                <Textarea value={reqDesc} onChange={e => setReqDesc(e.target.value)} placeholder="Provide technical context..." className="rounded-xl min-h-[80px]" />
             </div>
             <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Itemized Breakdown</Label>
                {reqItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                     <div className="col-span-6 space-y-1">
                        <Label className="text-[8px] uppercase">Item Node</Label>
                        <Input value={item.name} onChange={e => { const n = [...reqItems]; n[idx].name = e.target.value; setReqItems(n); }} className="h-10 rounded-lg text-xs" />
                     </div>
                     <div className="col-span-2 space-y-1">
                        <Label className="text-[8px] uppercase">Qty</Label>
                        <Input type="number" value={item.qty} onChange={e => { const n = [...reqItems]; n[idx].qty = parseInt(e.target.value); setReqItems(n); }} className="h-10 rounded-lg text-xs" />
                     </div>
                     <div className="col-span-3 space-y-1">
                        <Label className="text-[8px] uppercase">Cost (UGX)</Label>
                        <Input value={item.cost} onChange={e => { const n = [...reqItems]; n[idx].cost = e.target.value; setReqItems(n); }} className="h-10 rounded-lg text-xs" />
                     </div>
                     <div className="col-span-1">
                        <Button onClick={() => setReqItems(reqItems.filter((_, i) => i !== idx))} variant="ghost" size="icon" className="h-10 w-10 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                     </div>
                  </div>
                ))}
                <Button onClick={() => setReqItems([...reqItems, { name: '', qty: 1, unit: 'pcs', cost: '' }])} variant="outline" className="w-full rounded-xl border-dashed h-10 font-bold uppercase tracking-widest text-[8px]"><Plus className="w-3 h-3 mr-2" /> Add Item Node</Button>
             </div>
          </div>
          <DialogFooter>
             <Button onClick={submitRequisition} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"><Zap className="w-4 h-4 mr-2" /> Authorize Transmission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-md">
           <DialogHeader>
              <DialogTitle>Leave Request Protocol</DialogTitle>
              <DialogDescription>Submit a date-locked leave request for institutional approval.</DialogDescription>
           </DialogHeader>
           <div className="space-y-6 py-4">
              <div className="space-y-2">
                 <Label>Target Date</Label>
                 <Input type="date" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                 <Label>Reason / Logistics</Label>
                 <Textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Institutional justification..." />
              </div>
           </div>
           <DialogFooter>
              <Button onClick={submitLeave} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">Submit Request Node</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewRetainerOpen} onOpenChange={setIsNewRetainerOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-md">
           <DialogHeader>
              <DialogTitle>Retainer Advance</DialogTitle>
              <DialogDescription>Request a temporal synchronization of your monthly retainer.</DialogDescription>
           </DialogHeader>
           <div className="space-y-6 py-4">
              <div className="space-y-2">
                 <Label>Advance Amount (UGX)</Label>
                 <Input type="number" value={retainerAmount} onChange={e => setRetainerAmount(e.target.value)} className="rounded-xl h-11" placeholder="e.g. 500000" />
              </div>
              <div className="space-y-2">
                 <Label>Justification</Label>
                 <Textarea value={retainerReason} onChange={e => setRetainerReason(e.target.value)} className="rounded-xl min-h-[100px]" placeholder="Reason for advance..." />
              </div>
           </div>
           <DialogFooter>
              <Button onClick={submitRetainerRequest} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">Authorize Advance Node</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
