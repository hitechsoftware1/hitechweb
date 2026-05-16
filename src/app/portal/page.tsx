"use client";

import React, { useState, use, useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Settings, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Shield,
  Zap,
  Cpu,
  Send,
  Loader2,
  User,
  Sparkles,
  ChevronLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { zainabChat } from '@/ai/flows/zainab';
import { textToSpeech } from '@/ai/flows/tts-flow';

type PortalTab = 'dashboard' | 'discussions' | 'deliverables' | 'timeline' | 'environment';

interface Message {
  role: 'user' | 'model';
  content: string;
  time: string;
  audio?: string;
}

export default function ClientPortal(props: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  use(props.params);
  use(props.searchParams);

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello. I am Zainab, your neural concierge. I am a representative of HITECH, founded by the visionary JoelHitech Lubega. How can I assist with your architecture today?", time: "System Boot" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatActive]);

  const handleAction = (action: string) => {
    toast({
      title: "System Request",
      description: `Initiating: ${action}. Please wait while we fetch the latest data from the neural cluster.`,
    });
  };

  const handleDownload = (artifact: string) => {
    toast({
      title: "Secure Transfer Initiated",
      description: `Artifact [${artifact}] is being prepared for end-to-end encrypted download.`,
    });
  };

  const handleStaging = () => {
    toast({
      title: "Staging Environment",
      description: "Redirecting to your secure staging environment cluster...",
    });
    setTimeout(() => {
      window.open('https://staging.hitech.systems', '_blank');
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || chatLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } as Message];
    setMessages(newMessages);
    setChatLoading(true);

    try {
      const response = await zainabChat({
        message: userMessage,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      let audioUri = '';
      if (isSpeechEnabled) {
        try {
          const tts = await textToSpeech({ text: response.response });
          audioUri = tts.audioUri;
        } catch (ttsErr) {
          console.error("Speech synthesis failed", ttsErr);
        }
      }

      setMessages([...newMessages, { 
        role: 'model', 
        content: response.response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audio: audioUri
      }]);

      if (audioUri && isSpeechEnabled) {
        if (audioRef.current) {
          audioRef.current.src = audioUri;
          audioRef.current.play();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Neural Sync Error",
        description: "Zainab is momentarily offline. Re-establishing link...",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Build Progress</h4>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-headline font-bold mb-4">Phase 3</p>
                <Progress value={75} className="h-2 mb-4" />
                <p className="text-xs text-foreground/40 font-medium">Integration & Neural Tuning</p>
              </div>
              <div className="apple-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Active Sprint</h4>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-headline font-bold mb-2">Sprint 12</p>
                <p className="text-xs text-foreground/40 font-medium">14 tasks completed / 2 pending</p>
              </div>
              <div className="apple-card p-8 border-accent/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Next Milestone</h4>
                  <AlertCircle className="w-4 h-4 text-accent" />
                </div>
                <p className="text-3xl font-headline font-bold mb-2">Beta Release</p>
                <p className="text-xs text-foreground/40 font-medium">Scheduled for March 24, 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="apple-card p-10">
                <h3 className="text-xl font-headline font-bold mb-8">Recent Activity</h3>
                <div className="space-y-6">
                  {[
                    { title: "API Documentation updated", time: "2h ago", user: "JoelHitech" },
                    { title: "Dashboard UI Refinement", time: "5h ago", user: "Design Team" },
                    { title: "Staging deployment successful", time: "1d ago", user: "SRE Lead" }
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-4 border-l-2 border-primary/20 pl-6 pb-2">
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{act.title}</p>
                        <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest mt-1">{act.time} // {act.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="apple-card p-10 bg-primary/5 border-primary/10">
                <h3 className="text-xl font-headline font-bold mb-8">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background transition-all hover:scale-[1.02]">
                    <Link href="/contact" className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Contact Lead</span>
                    </Link>
                  </Button>
                  <Button onClick={() => setActiveTab('deliverables')} variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background transition-all hover:scale-[1.02]">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">View Specs</span>
                  </Button>
                  <Button onClick={handleStaging} variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background transition-all hover:scale-[1.02]">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Staging Link</span>
                  </Button>
                  <Button onClick={() => setActiveTab('environment')} variant="outline" className="h-24 rounded-2xl flex flex-col gap-2 border-foreground/5 hover:bg-foreground/5 bg-background transition-all hover:scale-[1.02]">
                    <Settings className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'discussions':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="apple-card p-0 flex flex-col min-h-[600px] overflow-hidden">
            <audio ref={audioRef} className="hidden" />
            <AnimatePresence mode="wait">
              {!isChatActive ? (
                <motion.div 
                  key="inbox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 flex flex-col h-full"
                >
                  <h3 className="text-2xl font-headline font-bold mb-8">Neural Discussions</h3>
                  <div className="space-y-6 flex-grow">
                    {[
                      { author: "JoelHitech", role: "Chief Architect", msg: "The latest API integration tests are passing with 4ms latency. Ready for staging review.", time: "10:45 AM" },
                      { author: "Client Admin", role: "Product Owner", msg: "Looks great. Can we confirm the security protocols for the mobile gateway?", time: "11:20 AM" },
                      { author: "SRE Lead", role: "Infrastructure", msg: "Zero-trust protocols active. Tunnels are secured with HITECH Standard v4.", time: "12:05 PM" }
                    ].map((chat, i) => (
                      <div key={i} className="flex gap-6 items-start pb-6 border-b border-foreground/5 last:border-0">
                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                          <Cpu className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-sm">{chat.author}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">{chat.role}</span>
                            <span className="text-[10px] text-foreground/30">{chat.time}</span>
                          </div>
                          <p className="text-sm text-foreground/70 font-light leading-relaxed">{chat.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-10 border-t border-foreground/5">
                    <Button onClick={() => setIsChatActive(true)} className="w-full h-14 rounded-2xl bg-primary text-white font-bold hover:scale-[1.01] shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                      Start Discussion with Zainab <Sparkles className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="chatroom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col h-[600px]"
                >
                  <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-primary/5">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" onClick={() => setIsChatActive(false)} className="rounded-full hover:bg-foreground/5">
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-white/20 shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Zainab</h4>
                          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Neural Concierge Online</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                        className={cn("rounded-full", isSpeechEnabled ? "text-primary bg-primary/10" : "text-foreground/40")}
                      >
                        {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Active Link</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-foreground/[0.01]">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-5 rounded-[1.5rem] text-sm leading-relaxed whitespace-pre-wrap font-light",
                          msg.role === 'user' 
                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                            : "bg-background border border-foreground/5 text-foreground/80 rounded-tl-none shadow-sm"
                        )}>
                          {msg.content}
                          {msg.role === 'model' && msg.audio && (
                            <button 
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.src = msg.audio!;
                                  audioRef.current.play();
                                }
                              }}
                              className="mt-3 flex items-center gap-2 text-[10px] font-bold text-primary hover:opacity-80 transition-opacity"
                            >
                              <Volume2 className="w-3 h-3" /> Replay Briefing
                            </button>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-2 px-2">
                          {msg.role === 'user' ? 'You' : 'Zainab'} // {msg.time}
                        </span>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex flex-col items-start max-w-[80%]">
                        <div className="bg-foreground/5 p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-xs font-medium text-foreground/40 italic">Zainab is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-6 border-t border-foreground/5 bg-background">
                    <div className="flex gap-4 items-center">
                      <div className="relative flex-grow">
                        <Input 
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="Ask Zainab about JoelHitech or your architecture..."
                          className="h-14 rounded-2xl bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/50 pr-12 text-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Zap className="w-4 h-4 text-primary opacity-20" />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!userInput.trim() || chatLoading}
                        className="h-14 w-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-[8px] text-center text-foreground/20 uppercase tracking-[0.3em] mt-4">
                      Encrypted End-to-End // Neural Briefing System v5.0
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case 'deliverables':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="apple-card p-10">
            <h3 className="text-2xl font-headline font-bold mb-8">System Deliverables</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-foreground/5">
                    <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Artifact</th>
                    <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Version</th>
                    <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Size</th>
                    <th className="pb-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {[
                    { name: "Technical Specs v2.4", type: "PDF", size: "4.2 MB", version: "Final" },
                    { name: "Neural API Keys (Staging)", type: "JSON", size: "12 KB", version: "Rev 1" },
                    { name: "Architecture Diagram", type: "SVG", size: "1.8 MB", version: "v1.2" }
                  ].map((file, i) => (
                    <tr key={i} className="group hover:bg-foreground/[0.01] transition-colors">
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-6"><span className="text-xs text-foreground/50">{file.version}</span></td>
                      <td className="py-6"><span className="text-xs text-foreground/50">{file.size}</span></td>
                      <td className="py-6 text-right">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                          onClick={() => handleDownload(file.name)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      case 'timeline':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="apple-card p-10">
            <h3 className="text-2xl font-headline font-bold mb-10">Project Roadmap</h3>
            <div className="space-y-12">
              {[
                { title: "Foundation & Core Architecture", status: "completed", date: "Feb 12", desc: "Setting up secure VPS clusters and neural logic foundations." },
                { title: "Neural API Integration", status: "completed", date: "Feb 28", desc: "Connecting enterprise data streams to AI reasoning engines." },
                { title: "Dashboard & Visual Logic", status: "current", date: "Mar 15", desc: "Finalizing high-fidelity client command centers." },
                { title: "Beta Testing & Scale", status: "pending", date: "Mar 30", desc: "Stress testing concurrent sessions and caching layers." }
              ].map((milestone, i) => (
                <div key={i} className="flex gap-8 relative group">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-background transition-all",
                      milestone.status === 'completed' ? "bg-green-500 text-white" : milestone.status === 'current' ? "bg-primary text-white animate-pulse" : "bg-foreground/5 text-foreground/20"
                    )}>
                      {milestone.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : milestone.status === 'current' ? <Zap className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    {i !== 3 && <div className="absolute top-10 w-[2px] h-[calc(100%+3rem)] bg-foreground/5" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-lg font-bold">{milestone.title}</h4>
                      <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{milestone.date}</span>
                    </div>
                    <p className="text-sm text-foreground/50 font-light leading-relaxed max-w-lg">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'environment':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="apple-card p-10">
            <h3 className="text-2xl font-headline font-bold mb-10">Environment Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="apple-glass p-8 rounded-3xl border-primary/20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-sm">Staging Cluster</h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Access Endpoint</p>
                <div className="bg-foreground/5 p-4 rounded-xl flex items-center justify-between group cursor-pointer" onClick={handleStaging}>
                  <code className="text-xs text-primary">staging.hitech.systems</code>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-8 flex gap-4">
                  <Button onClick={() => handleAction("Fetching real-time logs...")} size="sm" variant="outline" className="text-[10px] h-8 rounded-lg">View Logs</Button>
                  <Button onClick={() => handleAction("Purging regional cache layers...")} size="sm" variant="outline" className="text-[10px] h-8 rounded-lg">Purge Cache</Button>
                </div>
              </div>

              <div className="apple-glass p-8 rounded-3xl opacity-40 grayscale">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <h4 className="font-bold text-sm">Production Core</h4>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-foreground/10" />
                </div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">Locked Endpoint</p>
                <div className="bg-foreground/5 p-4 rounded-xl flex items-center justify-between">
                  <code className="text-xs text-foreground/30">api.hitech.production</code>
                  <AlertCircle className="w-4 h-4 text-foreground/20" />
                </div>
                <p className="mt-8 text-[10px] text-center font-bold text-foreground/30 uppercase tracking-widest">Requires Phase 4 Completion</p>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Enterprise Command Center</span>
            <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">Welcome, <br /> Innovator.</h1>
          </div>
          <div className="apple-glass px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">System Health</p>
              <p className="text-sm font-bold">99.98% Active</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, name: "Dashboard" },
              { id: 'discussions', icon: MessageSquare, name: "Discussions", count: messages.length > 1 ? messages.length : 3 },
              { id: 'deliverables', icon: FileText, name: "Deliverables" },
              { id: 'timeline', icon: Calendar, name: "Timeline" },
              { id: 'environment', icon: Settings, name: "Environment" }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as PortalTab); if(item.id !== 'discussions') setIsChatActive(false); }}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all group",
                  activeTab === item.id ? "bg-primary text-white" : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{item.name}</span>
                </div>
                {item.count && (
                  <span className={cn(
                    "w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold",
                    activeTab === item.id ? "bg-white/20" : "bg-accent text-white"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
