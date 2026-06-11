
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Zap,
  ClipboardList,
  ShieldCheck,
  User,
  LogOut,
  Key,
  Globe,
  Layers,
  MessageSquare,
  Briefcase,
  Settings,
  Lock,
  ExternalLink,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function StaffHub() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [punchInCode, setPunchInCode] = useState('');
  const [punchingIn, setPunchingIn] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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

  const attendanceQuery = useMemo(() => {
    if (!db || !user) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'attendance'), where('userId', '==', user.uid), where('date', '==', today));
  }, [db, user]);

  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);

  const { data: todayAttendance } = useCollection(attendanceQuery);
  const { data: activeCodes } = useCollection(dailyCodeQuery);
  const currentDailyCode = activeCodes?.[0]?.code || 'WAITING...';

  const handlePunchIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !punchInCode) return;
    setPunchingIn(true);

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
        toast({ title: "Neural Punch-In", description: "Your attendance is pending admin verification." });
        setPunchInCode('');
      })
      .catch(console.error)
      .finally(() => setPunchingIn(false));
  };

  const modules = [
    { id: 'account', title: 'My Account', desc: 'Profile, advance requests', icon: User, access: true, href: '/admin/my-account' },
    { id: 'tasks', title: 'Tasks Hub', desc: 'Assigned mission directives', icon: ClipboardList, access: true },
    { id: 'web-management', title: 'Web Management', desc: 'Restricted module', icon: Globe, access: false },
    { id: 'clients', title: 'Clients', desc: 'Restricted module', icon: Layers, access: false },
    { id: 'comms', title: 'Communications', desc: 'Internal network', icon: MessageSquare, access: false },
    { id: 'system', title: 'Settings', desc: 'Security protocols', icon: Settings, access: false }
  ];

  if (userLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F4F1F0]"><Loader2 className="animate-spin text-primary" /></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#F4F1F0]"><div><ShieldCheck className="w-12 h-12 mx-auto mb-4 text-primary" /><h1 className="text-2xl font-headline font-bold">Unauthorized.</h1><p className="text-foreground/50">Clearance level insufficient.</p></div></div>;

  return (
    <main className="min-h-screen bg-[#F4F1F0] dark:bg-[#121212] pt-12 pb-24 font-body">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-primary text-white font-bold">{user?.displayName?.charAt(0) || 'E'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'Engineer'}</h1>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">HITECH Engineering Staff • Select a module</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={toggleTheme} 
              variant="ghost" 
              size="icon" 
              className="rounded-xl bg-white dark:bg-zinc-800 shadow-sm"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
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

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-4 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between transition-all">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">Punch In Protocol</h4>
              <p className="text-xs text-foreground/50 font-medium">Transmit the daily office code to log presence.</p>
            </div>
          </div>
          
          {todayAttendance && todayAttendance.length > 0 ? (
            <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-2xl border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Logged: {todayAttendance[0].status}</span>
            </div>
          ) : (
            <form onSubmit={handlePunchIn} className="flex gap-2">
              <Input 
                value={punchInCode}
                onChange={(e) => setPunchInCode(e.target.value)}
                placeholder="OFFICE CODE"
                className="w-32 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-100 text-center font-bold tracking-[0.3em]"
                required
              />
              <Button disabled={punchingIn} type="submit" className="h-12 px-6 rounded-xl bg-primary text-white font-bold">
                {punchingIn ? <Loader2 className="animate-spin w-5 h-5" /> : "Submit"}
              </Button>
            </form>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-10 shadow-sm border border-black/5 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
            <Clock className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Shift Active</h4>
            <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Standard 08:00 - 17:30 Cluster</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const CardWrapper = mod.access && mod.href ? Link : 'div';
            return (
              <motion.div 
                key={mod.id}
                whileHover={mod.access ? { y: -5 } : {}}
                className={cn(
                  "bg-white dark:bg-zinc-900 rounded-[2rem] p-10 border border-black/5 shadow-sm flex flex-col justify-between min-h-[300px] relative transition-all",
                  !mod.access && "opacity-50"
                )}
              >
                <CardWrapper href={mod.href || '#'} className="flex flex-col justify-between h-full">
                  {!mod.access && <Lock className="absolute top-10 right-10 w-5 h-5 text-zinc-300" />}
                  <div>
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-8",
                      mod.access ? "bg-zinc-50 dark:bg-zinc-800 text-zinc-500" : "bg-zinc-100/50 text-zinc-200"
                    )}>
                      <mod.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="mt-10 pt-8 border-t border-black/5">
                    {mod.access ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 p-0 h-auto">Access Portal</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-200">Access Restricted</span>
                    )}
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
