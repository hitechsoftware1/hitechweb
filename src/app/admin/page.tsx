
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
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useUser, useAuth } from '@/firebase';
import { collection, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

type PortalModule = {
  id: string;
  title: string;
  description: string;
  icon: any;
  permissions: string[];
  href?: string;
};

export default function AdminHub(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [newOfficeCode, setNewOfficeCode] = useState('');
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

  // Queries
  const dailyCodeQuery = useMemo(() => {
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'officeCodes'), where('date', '==', today));
  }, [db]);

  const { data: activeCodes } = useCollection(dailyCodeQuery);
  const currentDailyCode = activeCodes?.[0]?.code || '--';

  // Automated Code Generation Logic
  useEffect(() => {
    if (!db || !activeCodes) return;
    
    // Only generate if no code exists for today
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

  const modules: PortalModule[] = [
    {
      id: 'account',
      title: 'My Account',
      description: 'Profile, advance requests, requisitions',
      icon: User,
      permissions: ['View', 'Create', 'Edit', 'Delete'],
      href: '/admin/my-account'
    },
    {
      id: 'web-management',
      title: 'Web Management',
      description: 'Platform oversight, SEO management, domain monitoring',
      icon: Globe,
      permissions: ['View', 'Edit'],
      href: '/admin/web-management'
    },
    {
      id: 'clients',
      title: 'Client Ecosystem',
      description: 'LPOs, quotations, invoices, inquiries',
      icon: Layers,
      permissions: ['View', 'Edit'],
      href: '#'
    },
    {
      id: 'communications',
      title: 'Communications',
      description: 'Marketing, mail, internal newsletters',
      icon: MessageSquare,
      permissions: ['View', 'Edit'],
      href: '/admin/communications'
    },
    {
      id: 'talent',
      title: 'Talent Pipeline',
      description: 'Job apps, interviews, onboarding',
      icon: Briefcase,
      permissions: ['View', 'Edit'],
      href: '#'
    },
    {
      id: 'system',
      title: 'System Architecture',
      description: 'Users, roles, module permissions',
      icon: Settings,
      permissions: ['View', 'Edit', 'Delete'],
      href: '#'
    }
  ];

  const handleManualOfficeCode = () => {
    if (!db || !newOfficeCode) return;
    const today = new Date().toISOString().split('T')[0];
    const codeId = `code_${today}`;
    setDoc(doc(db, 'officeCodes', codeId), {
      code: newOfficeCode,
      date: today,
      active: true,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Neural Code Override", description: `Code ${newOfficeCode} is now active for all workers.` });
      setNewOfficeCode('');
    });
  };

  return (
    <main className="min-h-screen bg-[#F4F1F0] dark:bg-[#121212] pt-12 pb-24 font-body">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-primary text-white font-bold">{user?.displayName?.charAt(0) || 'L'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'Lubega'}</h1>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                System Administrator • All Portals Active
              </p>
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
          <div className="flex items-center gap-8">
            <span className="text-5xl font-headline font-bold tracking-tighter text-zinc-800 dark:text-zinc-100">
              {currentDailyCode}
            </span>
            <div className="flex gap-2">
              <Input 
                value={newOfficeCode} 
                onChange={(e) => setNewOfficeCode(e.target.value)}
                placeholder="Override"
                className="w-24 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-100 text-center font-bold"
              />
              <Button onClick={handleManualOfficeCode} className="h-12 w-12 rounded-xl bg-primary text-white"><Plus className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 mb-10 shadow-sm border border-black/5 flex items-center gap-6 group transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
            <Clock className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Working day today</h4>
            <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Working hours 08:00 - 17:30</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((mod) => (
            <motion.div 
              key={mod.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] p-10 border border-black/5 shadow-sm flex flex-col justify-between min-h-[320px] relative transition-all"
            >
              <Link href={mod.href || '#'} className="flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-zinc-50 dark:bg-zinc-800 text-zinc-500">
                    <mod.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed max-w-[200px]">{mod.description}</p>
                </div>

                <div className="mt-10 pt-8 border-t border-black/5">
                  <div className="flex flex-wrap gap-2">
                    {mod.permissions.map((perm) => (
                      <button key={perm} className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>
              </Link>
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
