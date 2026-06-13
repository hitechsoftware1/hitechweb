
"use client";

import React, { useState, useMemo, use, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layers, 
  MessageSquare, 
  MoreVertical, 
  Loader2, 
  Trash2, 
  CheckCircle2, 
  Mail, 
  Archive, 
  Zap, 
  TrendingUp, 
  Inbox, 
  ClipboardList, 
  CalendarCheck, 
  ShieldCheck, 
  Key, 
  Plus, 
  UserCheck, 
  XCircle, 
  Clock, 
  LogOut, 
  ExternalLink, 
  Moon, 
  Sun,
  LayoutGrid, 
  Lock, 
  Globe, 
  Briefcase, 
  Settings, 
  User,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PortalModule = {
  id: string;
  title: string;
  description: string;
  icon: any;
  permissions: string[];
  href?: string;
  restricted?: boolean;
};

export default function AdminHub(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Punch states
  const [showPunchInForm, setShowPunchInForm] = useState(false);
  const [punchInCode, setPunchInCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Profile Query to check specific portal access
  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile } = useDoc(profileRef);

  // Authentication & Clearance Redirect
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
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

  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.href = '/';
    });
  };

  // Queries
  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);

  const attendanceQuery = useMemo(() => {
    if (!db || !user) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'attendance'), where('userId', '==', user.uid), where('date', '==', today));
  }, [db, user]);

  const { data: activeCodes } = useCollection(dailyCodeQuery);
  const { data: userAttendance } = useCollection(attendanceQuery);
  
  const currentDailyCode = activeCodes?.[0]?.code || '--';
  const todayRecord = userAttendance?.[0];

  // Automated Code Generation Logic
  useEffect(() => {
    if (!db || !activeCodes) return;
    
    if (activeCodes.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const generatedCode = Math.floor(10 + Math.random() * 90).toString();
      const codeId = `code_${today}`;
      
      setDoc(doc(db, 'officeCodes', codeId), {
        code: generatedCode,
        date: today,
        active: true,
        createdAt: serverTimestamp()
      }).then(() => {
        toast({ 
          title: "Neural Sync: Active", 
          description: `Today's validation code [${generatedCode}] has been autonomously generated.` 
        });
      });
    }
  }, [db, activeCodes, toast]);

  // Role Logic: Supper Admin Access or Portal-specific clearance
  const isSuperAdmin = user?.email === 'hitechsoftware03@gmail.com';
  
  const hasAccess = (portalId: string) => {
    if (isSuperAdmin) return true;
    if (!profile || !profile.accessiblePortals) return false;
    return profile.accessiblePortals.includes(portalId);
  };

  const modules: PortalModule[] = [
    {
      id: 'account',
      title: 'My Account',
      description: 'Profile, advance requests, requisitions',
      icon: User,
      permissions: ['View', 'Create', 'Edit', 'Delete'],
      href: '/admin/my-account',
      restricted: false
    },
    {
      id: 'web-management',
      title: 'Web Management',
      description: 'Platform oversight, SEO management, domain monitoring',
      icon: Globe,
      permissions: ['View', 'Edit'],
      href: hasAccess('web-management') ? '/admin/web-management' : undefined,
      restricted: !hasAccess('web-management')
    },
    {
      id: 'clients',
      title: 'Client Ecosystem',
      description: 'LPOs, quotations, invoices, inquiries',
      icon: Layers,
      permissions: ['View', 'Edit'],
      href: hasAccess('clients') ? '/admin/clients' : undefined,
      restricted: !hasAccess('clients')
    },
    {
      id: 'communications',
      title: 'Communications',
      description: 'Marketing, mail, internal newsletters',
      icon: MessageSquare,
      permissions: ['View', 'Edit'],
      href: hasAccess('communications') ? '/admin/communications' : undefined,
      restricted: !hasAccess('communications')
    },
    {
      id: 'talent',
      title: 'Talent Pipeline',
      description: 'Job apps, interviews, onboarding',
      icon: Briefcase,
      permissions: ['View', 'Edit'],
      href: hasAccess('talent') ? '/admin/talent' : undefined,
      restricted: !hasAccess('talent')
    },
    {
      id: 'system',
      title: 'System Architecture',
      description: 'Users, roles, workforce tasks, approvals',
      icon: Settings,
      permissions: ['View', 'Edit', 'Delete'],
      href: hasAccess('system') ? '/admin/system' : undefined,
      restricted: !hasAccess('system')
    }
  ];

  const handlePunchIn = async () => {
    if (!db || !user || !punchInCode) return;
    
    if (punchInCode !== currentDailyCode) {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid institutional validation code." });
      return;
    }

    setIsProcessing(true);
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = {
      userId: user.uid,
      userName: user.displayName || user.email,
      date: today,
      punchInTime: serverTimestamp(),
      officeCodeUsed: punchInCode,
      status: 'pending'
    };

    addDoc(collection(db, 'attendance'), attendanceData)
      .then(() => {
        toast({ title: "Neural Link Established", description: "Shift presence logged. Work session active." });
        setShowPunchInForm(false);
      })
      .finally(() => setIsProcessing(false));
  };

  const handlePunchOut = async () => {
    if (!db || !todayRecord) return;
    setIsProcessing(true);
    updateDoc(doc(db, 'attendance', todayRecord.id), {
      punchOutTime: serverTimestamp(),
      status: 'approved'
    }).then(() => {
      toast({ title: "Session Concluded", description: "Shift ended. Institutional data synced. Safe travels." });
    }).finally(() => setIsProcessing(false));
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <main className="min-h-screen bg-[#F4F1F0] dark:bg-[#121212] pt-12 pb-24 font-body text-zinc-800 dark:text-zinc-100">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-14 h-14 border-2 border-white dark:border-zinc-800 shadow-sm">
              <AvatarFallback className="bg-primary text-white font-bold">{user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'L'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'Operator'}</h1>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest flex items-center gap-2">
                {isSuperAdmin ? <ShieldCheck className="w-3 h-3 text-primary" /> : <User className="w-3 h-3" />}
                {isSuperAdmin ? 'Super Administrator' : (profile?.role || 'Staff')} • {isSuperAdmin ? 'All Portals Active' : 'Restricted Clearance'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-zinc-400 hover:text-foreground transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" className="rounded-xl bg-white dark:bg-zinc-800 shadow-sm px-4 flex items-center gap-2" asChild>
              <Link href="/">
                <ExternalLink className="w-4 h-4" /> Site
              </Link>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              size="sm" 
              className="rounded-xl bg-red-50 text-red-500 hover:bg-red-100 px-4 font-bold border border-red-100 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-4 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between group transition-all hover:shadow-md">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">Today's Office Code</h4>
              <p className="text-xs text-foreground/50 font-medium">Auto-generated daily for global workforce validation.</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-6xl font-headline font-bold tracking-tighter text-primary">
              {currentDailyCode}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-10 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all hover:shadow-md">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Working day today</h4>
              <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Working hours 08:00 - 17:30</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {todayRecord ? (
              todayRecord.punchOutTime ? (
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/10 px-6 py-3 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Shift Completed</span>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Session Active</span>
                  <Button 
                    onClick={handlePunchOut} 
                    disabled={isProcessing}
                    className="h-12 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Punch Out"}
                  </Button>
                </div>
              )
            ) : showPunchInForm ? (
              <div className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                <Input 
                  value={punchInCode}
                  onChange={(e) => setPunchInCode(e.target.value)}
                  placeholder="CODE"
                  className="w-28 h-12 rounded-xl text-center font-bold tracking-[0.3em] bg-zinc-50 dark:bg-zinc-800 border-zinc-100"
                />
                <Button onClick={handlePunchIn} disabled={isProcessing || !punchInCode} className="h-12 px-6 rounded-xl font-bold">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                </Button>
                <Button variant="ghost" onClick={() => setShowPunchInForm(false)} className="h-12 w-12 p-0 rounded-xl hover:bg-zinc-50">
                  <XCircle className="w-5 h-5 text-zinc-300" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowPunchInForm(true)} className="h-12 px-10 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                Punch In
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((mod) => (
            <motion.div 
              key={mod.id}
              whileHover={!mod.restricted ? { y: -5 } : {}}
              className={cn(
                "bg-white dark:bg-zinc-900 rounded-[2rem] p-10 border border-black/5 shadow-sm flex flex-col justify-between min-h-[320px] relative transition-all",
                mod.restricted && "opacity-60"
              )}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-500",
                      mod.restricted && "bg-zinc-100/50 text-zinc-200"
                    )}>
                      <mod.icon className="w-7 h-7" />
                    </div>
                    {mod.restricted && (
                      <Badge variant="outline" className="border-red-500/20 text-red-500 bg-red-500/5 flex items-center gap-1 font-bold text-[8px] uppercase tracking-widest">
                        <Lock className="w-2.5 h-2.5" /> No Access
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed max-w-[200px]">{mod.description}</p>
                </div>

                <div className="mt-10 pt-8 border-t border-black/5">
                  <div className="flex flex-wrap gap-2">
                    {mod.href ? (
                      <Link href={mod.href} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
                        Access Portal
                      </Link>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 italic">
                        Restricted Module
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[10px] font-bold text-foreground/20 uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} HITECH SOFTWARE COMPANY
        </p>

      </div>
    </main>
  );
}
