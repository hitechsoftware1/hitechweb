"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Sparkles, 
  Cpu, 
  Zap, 
  Volume2, 
  VolumeX, 
  Loader2, 
  ChevronLeft,
  Settings,
  History,
  Trash2,
  Share2,
  Terminal,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  Database,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zainabChat } from '@/ai/flows/zainab';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { useToast } from '@/hooks/use-toast';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface Message {
  role: 'user' | 'model';
  content: string;
  time: string;
  audio?: string;
}

export default function AIStudioPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "HITECH Neural System v5.0 Active. I am Zainab, your architectural concierge. Define your technical vision or ask for an engineering audit.", time: "BOOT" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [history, setHistory] = useState([
    "Architecture Review - Project X",
    "Security Audit Protocol",
    "Fintech Integration Specs"
  ]);

  // Settings State
  const [voiceName, setVoiceName] = useState('Algenib');
  const [engineMode, setEngineMode] = useState('technical');
  const [neuralDepth, setNeuralDepth] = useState(70);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } as Message];
    setMessages(newMessages);
    setLoading(true);

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
        } catch (err) {
          console.error("Speech failure", err);
        }
      }

      setMessages([...newMessages, { 
        role: 'model', 
        content: response.response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audio: audioUri
      }]);

      if (audioUri && isSpeechEnabled && audioRef.current) {
        audioRef.current.src = audioUri;
        audioRef.current.play();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Neural Sync Error",
        description: "Re-establishing link with Zainab. Please retry.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([{ role: 'model', content: "New session initialized. How can I assist with your architecture?", time: "RESET" }]);
    toast({ title: "Session Reset", description: "Memory buffer cleared. Fresh context established." });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <audio ref={audioRef} className="hidden" />
      
      <div className="flex h-screen pt-24 lg:pt-32">
        {/* Sidebar - Chat History */}
        <aside className="hidden lg:flex w-80 border-r border-foreground/5 bg-foreground/[0.01] flex-col p-6">
          <Button 
            onClick={startNewChat}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all mb-8"
          >
            <Plus className="w-4 h-4" /> New Vision
          </Button>

          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            <div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mb-4">Neural History</p>
              <div className="space-y-1">
                {history.map((item, i) => (
                  <button key={i} className="w-full text-left p-3 rounded-lg text-sm font-medium text-foreground/50 hover:bg-foreground/5 hover:text-foreground transition-all group flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{item}</span>
                    <History className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-foreground/5 space-y-4">
            <div className="flex items-center gap-3 text-foreground/40 p-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Link Active</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/40 p-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">HITECH CORE v5.0</span>
            </div>
          </div>
        </aside>

        {/* Main Chat Interface */}
        <section className="flex-1 flex flex-col relative overflow-hidden bg-background">
          {/* Header */}
          <div className="px-8 py-4 border-b border-foreground/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Zainab AI</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">Neural Cluster: Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className={cn("rounded-xl", isSpeechEnabled ? "text-primary bg-primary/5" : "text-foreground/20")}
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl text-foreground/20 hover:text-primary transition-all">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-foreground/10 bg-background/95 backdrop-blur-xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline font-bold">Neural Configuration</DialogTitle>
                    <DialogDescription className="text-foreground/40 text-xs">Calibrate the synthesis parameters for the HITECH AI Concierge.</DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-8 py-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-primary" /> Engine Mode
                      </Label>
                      <Select value={engineMode} onValueChange={setEngineMode}>
                        <SelectTrigger className="h-12 rounded-xl bg-foreground/5 border-foreground/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="technical">HITECH Technical (v5.0)</SelectItem>
                          <SelectItem value="creative">Creative Architect</SelectItem>
                          <SelectItem value="minimal">Minimalist Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                        <Waves className="w-3 h-3 text-primary" /> Voice Synthesis
                      </Label>
                      <Select value={voiceName} onValueChange={setVoiceName}>
                        <SelectTrigger className="h-12 rounded-xl bg-foreground/5 border-foreground/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Algenib">Algenib (Standard)</SelectItem>
                          <SelectItem value="Achernar">Achernar (Authoritative)</SelectItem>
                          <SelectItem value="ZainabCustom">Zainab Neural Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                          <Sliders className="w-3 h-3 text-primary" /> Neural Depth
                        </Label>
                        <span className="text-[10px] font-bold text-primary">{neuralDepth}%</span>
                      </div>
                      <Slider 
                        defaultValue={[neuralDepth]} 
                        max={100} 
                        step={1} 
                        onValueChange={(v) => setNeuralDepth(v[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="pt-4 border-t border-foreground/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-bold">Auto-Briefing</Label>
                          <p className="text-[10px] text-foreground/40">Synthesize audio automatically on response.</p>
                        </div>
                        <Switch checked={isSpeechEnabled} onCheckedChange={setIsSpeechEnabled} />
                      </div>
                      <Button variant="outline" onClick={startNewChat} className="w-full h-12 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/5 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Purge Memory Buffer
                      </Button>
                    </div>
                  </div>

                  <DialogFooter>
                    <p className="text-[8px] text-center w-full text-foreground/20 uppercase tracking-[0.4em]">Configuration persists in neural cache</p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-24 py-12 space-y-10 custom-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex group",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] lg:max-w-[70%] flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border",
                    msg.role === 'user' ? "bg-foreground/5 border-foreground/10" : "bg-primary/10 border-primary/20"
                  )}>
                    {msg.role === 'user' ? <Terminal className="w-4 h-4 text-foreground/40" /> : <Sparkles className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "p-5 rounded-[1.5rem] text-sm lg:text-base leading-relaxed font-light shadow-sm",
                      msg.role === 'user' 
                        ? "bg-foreground text-background rounded-tr-none" 
                        : "bg-foreground/[0.02] border border-foreground/5 rounded-tl-none"
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
                          className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary hover:opacity-80 transition-all uppercase tracking-widest"
                        >
                          <Volume2 className="w-3 h-3" /> Play Audio Briefing
                        </button>
                      )}
                    </div>
                    <div className={cn(
                      "flex items-center gap-3 px-2 text-[9px] font-bold text-foreground/20 uppercase tracking-widest",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <span>{msg.role === 'user' ? 'Operator' : 'Zainab'}</span>
                      <span>//</span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-foreground/[0.02] border border-foreground/5 p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-medium text-foreground/40 italic">Neural synthesis in progress...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 lg:px-24 bg-gradient-to-t from-background via-background to-transparent sticky bottom-0">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="relative group">
                <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-full" />
                <div className="relative flex items-center gap-4 bg-background border border-foreground/10 rounded-2xl p-2 pl-6 focus-within:border-primary/40 transition-all shadow-2xl">
                  <Input 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Zainab about JoelHitech or your architecture..."
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm lg:text-base p-4"
                  />
                  <Button 
                    type="submit" 
                    disabled={!userInput.trim() || loading}
                    className="h-12 w-12 rounded-xl bg-foreground text-background hover:bg-primary hover:text-white transition-all shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {[
                  { label: "Engineering Audit", icon: Terminal },
                  { label: "JoelHitech Vision", icon: BrainCircuit },
                  { label: "Security Protocol", icon: ShieldCheck }
                ].map((tag) => (
                  <button 
                    key={tag.label}
                    onClick={() => setUserInput(tag.label)}
                    className="px-4 py-1.5 rounded-full bg-foreground/[0.03] border border-foreground/5 text-[9px] font-bold text-foreground/40 uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2"
                  >
                    <tag.icon className="w-3 h-3" />
                    {tag.label}
                  </button>
                ))}
              </div>
              <p className="text-[8px] text-center text-foreground/20 uppercase tracking-[0.4em] mt-6">
                Institutional Neural Interface // End-to-End Encrypted
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
