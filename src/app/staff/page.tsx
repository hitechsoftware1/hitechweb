
"use client";

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Loader2,
  Zap,
  ClipboardList,
  Target,
  ShieldCheck,
  User,
  LogOut,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StaffPortal() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [punchInCode, setPunchInTime] = useState('');
  const [punchingIn, setPunchingIn] = useState(false);

  const tasksQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const attendanceQuery = useMemo(() => {
    if (!db || !user) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(collection(db, 'attendance'), where('userId', '==', user.uid), where('date', '==', today));
  }, [db, user]);

  const { data: tasks, loading: tasksLoading } = useCollection(tasksQuery);
  const { data: todayAttendance } = useCollection(attendanceQuery);

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
        setPunchInTime('');
      })
      .catch(console.error)
      .finally(() => setPunchingIn(false));
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center p-6 text-center"><div><ShieldCheck className="w-12 h-12 mx-auto mb-4 text-primary" /><h1 className="text-2xl font-headline font-bold">Unauthorized.</h1><p className="text-foreground/50">Access restricted to HITECH engineering staff.</p></div></div>;

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Worker Portal</span>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Welcome, <br /> {user.displayName?.split(' ')[0] || 'Engineer'}.</h1>
          </div>
          <div className="flex items-center gap-4 apple-glass px-6 py-4 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Clearance Level</p>
              <p className="text-sm font-bold">Neural Architect</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-6">
            {/* Punch In Interface */}
            <div className="apple-card p-10 bg-primary/5 border-primary/10 glow-blue">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-headline font-bold">Punch In.</h3>
                <Clock className="w-5 h-5 text-primary" />
              </div>
              
              {todayAttendance && todayAttendance.length > 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm font-bold mb-1">Status: {todayAttendance[0].status.toUpperCase()}</p>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Attendance logged for today</p>
                </div>
              ) : (
                <form onSubmit={handlePunchIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                      <Key className="w-3 h-3" /> Office Validation Code
                    </Label>
                    <Input 
                      value={punchInCode}
                      onChange={(e) => setPunchInTime(e.target.value)}
                      placeholder="ENTER TODAY'S CODE" 
                      className="h-14 rounded-2xl bg-background border-primary/20 text-center font-mono text-xl tracking-widest"
                      required
                    />
                  </div>
                  <Button disabled={punchingIn} className="w-full h-14 rounded-2xl bg-primary text-white font-bold hover:scale-[1.02] shadow-xl shadow-primary/20">
                    {punchingIn ? <Loader2 className="animate-spin" /> : "Transmit Punch-In"}
                  </Button>
                </form>
              )}
            </div>

            <div className="apple-card p-10">
              <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-6">Internal Comms</h4>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-foreground/5 border border-foreground/5">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold">System Update</p>
                    <p className="text-[10px] text-foreground/50 mt-1">Version 6.0 is now live. New task verify protocol active.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="apple-card p-10 lg:p-16">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <ClipboardList className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-headline font-bold">Directive Board.</h3>
                </div>
                {tasksLoading && <Loader2 className="animate-spin" />}
              </div>

              <div className="space-y-4">
                {tasks && tasks.length > 0 ? tasks.map((task: any) => (
                  <div key={task.id} className="apple-glass p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold">{task.title}</h4>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                          task.priority === 'critical' ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary'
                        )}>{task.priority}</span>
                      </div>
                      <p className="text-sm text-foreground/50 font-light leading-relaxed max-w-xl">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{task.status}</span>
                      <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/10">
                        Update
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-20">
                    <Target className="w-16 h-16 mx-auto mb-6" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em]">No direct directives assigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
