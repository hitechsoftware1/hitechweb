
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Search, 
  Plus, 
  ChevronRight, 
  FileEdit, 
  Settings, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Trash2,
  Save,
  X,
  Type,
  Home,
  Info,
  Mail,
  PanelBottom,
  Image as ImageIcon,
  Newspaper,
  Briefcase,
  Users,
  Files,
  Globe,
  PlusCircle,
  Pencil,
  PlusIcon
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type WebTab = 'Overview' | 'Header' | 'Home Page' | 'About Us' | 'Contact' | 'Footer & General' | 'Banners' | 'News' | 'Services' | 'Team' | 'Files';

export default function WebManagerPortal() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<WebTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  // CMS Data Queries
  const { data: newsItems } = useCollection(db ? query(collection(db, 'news'), orderBy('createdAt', 'desc')) : null);
  const { data: servicesItems } = useCollection(db ? query(collection(db, 'services'), orderBy('createdAt', 'asc')) : null);
  const { data: teamItems } = useCollection(db ? query(collection(db, 'team'), orderBy('createdAt', 'asc')) : null);
  const { data: bannersItems } = useCollection(db ? query(collection(db, 'banners'), orderBy('createdAt', 'asc')) : null);
  const { data: globalConfig } = useDoc(db ? doc(db, 'siteConfig', 'global') : null);

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

  const handleGlobalUpdate = async (section: string, data: any) => {
    if (!db) return;
    const configRef = doc(db, 'siteConfig', 'global');
    try {
      await setDoc(configRef, { [section]: data }, { merge: true });
      toast({ title: "Updated", description: `${section} configuration updated successfully.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update configuration." });
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Header', icon: Type },
    { label: 'Home Page', icon: Home },
    { label: 'About Us', icon: Info },
    { label: 'Contact', icon: Mail },
    { label: 'Footer & General', icon: PanelBottom },
    { label: 'Banners', icon: ImageIcon },
    { label: 'News', icon: Newspaper },
    { label: 'Services', icon: Briefcase },
    { label: 'Team', icon: Users },
    { label: 'Files', icon: Files },
  ];

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-zinc-400 font-medium">Your website content at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'News Articles', value: newsItems?.length || 0 },
          { label: 'Team Members', value: teamItems?.length || 0 },
          { label: 'Active Services', value: servicesItems?.length || 0 },
          { label: 'Sliding Banners', value: bannersItems?.length || 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest">Quick Actions</h3>
             </div>
             <div className="p-4 space-y-1">
                <button onClick={() => setActiveTab('News')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Post News</h4>
                  </div>
                  <PlusCircle className="w-5 h-5 text-zinc-300" />
                </button>
                <button onClick={() => setActiveTab('Banners')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Update Banners</h4>
                  </div>
                  <Pencil className="w-5 h-5 text-zinc-300" />
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
                 <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest">Recent articles</h3>
                 <Button variant="ghost" size="sm" onClick={() => setActiveTab('News')}>Manage All</Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {newsItems?.slice(0, 5).map((news: any, i) => (
                   <div key={i} className="flex items-center gap-6 p-6 border-b border-zinc-50 dark:border-zinc-800/30 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-200 dark:text-zinc-700">
                         <Newspaper className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors line-clamp-1">{news.title}</h4>
                         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">
                           {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString() : 'Draft'}
                         </p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-200 dark:text-zinc-800 uppercase tracking-widest">{news.category}</span>
                   </div>
                 ))}
                 {(!newsItems || newsItems.length === 0) && (
                   <div className="p-20 text-center text-zinc-400 italic">No articles found.</div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );

  const renderHeaderEditor = () => {
    const config = globalConfig?.header || { logoText: 'HITECH', navLinks: ['Solutions', 'Portfolio', 'Status'] };
    return (
      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Header Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Logo Text</Label>
              <Input defaultValue={config.logoText} onBlur={(e) => handleGlobalUpdate('header', { ...config, logoText: e.target.value })} />
            </div>
            <div className="space-y-4">
              <Label>Navigation Links</Label>
              <div className="flex flex-wrap gap-2">
                {config.navLinks.map((link: string, i: number) => (
                  <Badge key={i} className="px-3 py-1 flex gap-2">
                    {link}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleGlobalUpdate('header', { ...config, navLinks: config.navLinks.filter((_: any, idx: number) => idx !== i) })} />
                  </Badge>
                ))}
                <Button variant="outline" size="sm" onClick={() => {
                  const val = prompt('Enter link text');
                  if(val) handleGlobalUpdate('header', { ...config, navLinks: [...config.navLinks, val] });
                }}>+ Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHomePageEditor = () => {
    const config = globalConfig?.home || { 
      heroTitle: 'Building Great Apps for Your Business.',
      heroDescription: 'HITECH builds strong foundations for world-class digital tools. We write clean code for innovators.',
      videoUrl: 'https://video-previews.elements.envatousercontent.com/88a1c795-102f-4bbe-8239-8be32b72c10c/watermarked_preview/watermarked_preview.mp4'
    };
    return (
      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input defaultValue={config.heroTitle} onBlur={(e) => handleGlobalUpdate('home', { ...config, heroTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Hero Description</Label>
              <Textarea defaultValue={config.heroDescription} onBlur={(e) => handleGlobalUpdate('home', { ...config, heroDescription: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Hero Video URL</Label>
              <Input defaultValue={config.videoUrl} onBlur={(e) => handleGlobalUpdate('home', { ...config, videoUrl: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAboutUsEditor = () => {
    const config = globalConfig?.about || {
      mission: 'To help innovators by building world-class digital tools.',
      standard: 'Every system we build is safe, fast, and ready to grow.'
    };
    return (
      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Vision & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Our Mission</Label>
              <Textarea defaultValue={config.mission} onBlur={(e) => handleGlobalUpdate('about', { ...config, mission: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Our Standard</Label>
              <Textarea defaultValue={config.standard} onBlur={(e) => handleGlobalUpdate('about', { ...config, standard: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContactEditor = () => {
    const config = globalConfig?.contact || {
      email: 'hitechsoftware03@gmail.com',
      phone: '+256 742 928 508',
      whatsapp: '+256 759 408 917',
      address: 'Naalya Kampala, Uganda'
    };
    return (
      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Company Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={config.email} onBlur={(e) => handleGlobalUpdate('contact', { ...config, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={config.phone} onBlur={(e) => handleGlobalUpdate('contact', { ...config, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input defaultValue={config.whatsapp} onBlur={(e) => handleGlobalUpdate('contact', { ...config, whatsapp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={config.address} onBlur={(e) => handleGlobalUpdate('contact', { ...config, address: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFooterEditor = () => {
    const config = globalConfig?.footer || {
      copyright: 'HITECH SOFTWARE COMPANY',
      tagline: 'Precision engineered software systems for companies defining the future.'
    };
    return (
      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Footer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input defaultValue={config.copyright} onBlur={(e) => handleGlobalUpdate('footer', { ...config, copyright: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Institutional Tagline</Label>
              <Textarea defaultValue={config.tagline} onBlur={(e) => handleGlobalUpdate('footer', { ...config, tagline: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBanners = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sliding Banners</h2>
        <Button onClick={() => {
          const url = prompt('Image URL');
          if(url) addDoc(collection(db!, 'banners'), { imageUrl: url, description: 'Banner', createdAt: serverTimestamp() });
        }}><Plus className="w-4 h-4 mr-2" /> Add Banner</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bannersItems?.map((banner: any) => (
          <Card key={banner.id} className="overflow-hidden group">
            <div className="aspect-video relative">
              <Image src={banner.imageUrl} alt="Banner" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={() => deleteDoc(doc(db!, 'banners', banner.id))}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Insights & News</h2>
        <Button onClick={() => {
          const title = prompt('Article Title');
          if(title) addDoc(collection(db!, 'news'), { title, excerpt: 'Excerpt', category: 'Tech', author: 'HITECH', imageUrl: PlaceHolderImages[0].imageUrl, createdAt: serverTimestamp() });
        }}><Plus className="w-4 h-4 mr-2" /> New Article</Button>
      </div>
      <div className="space-y-4">
        {newsItems?.map((news: any) => (
          <Card key={news.id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h4 className="font-bold">{news.title}</h4>
                <p className="text-xs text-zinc-400">{news.category} • {news.author}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(db!, 'news', news.id))}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Services Portfolio</h2>
        <Button onClick={() => {
          const title = prompt('Service Name');
          if(title) addDoc(collection(db!, 'services'), { title, description: 'Description', tag: 'Tag', createdAt: serverTimestamp() });
        }}><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesItems?.map((service: any) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline">{service.tag}</Badge>
                <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(db!, 'services', service.id))}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <h4 className="font-bold text-lg mb-2">{service.title}</h4>
              <p className="text-sm text-zinc-400">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Engineering Team</h2>
        <Button onClick={() => {
          const name = prompt('Name');
          if(name) addDoc(collection(db!, 'team'), { name, role: 'Engineer', initials: name[0], imageUrl: PlaceHolderImages[0].imageUrl, createdAt: serverTimestamp() });
        }}><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamItems?.map((member: any) => (
          <Card key={member.id} className="text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 overflow-hidden border">
                <Image src={member.imageUrl} alt={member.name} width={80} height={80} className="object-cover" />
              </div>
              <h4 className="font-bold">{member.name}</h4>
              <p className="text-xs text-primary font-bold uppercase tracking-widest">{member.role}</p>
              <Button variant="ghost" size="sm" className="mt-6 text-red-500" onClick={() => deleteDoc(doc(db!, 'team', member.id))}>Remove</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Institutional Files</h1>
          <p className="text-sm text-zinc-400 font-medium">Internal assets and documents.</p>
        </div>
        <Button onClick={() => toast({ title: "System Info", description: "Storage upload requires project billing. Managing records only." })}>
          <Files className="w-4 h-4 mr-2" /> Scan System
        </Button>
      </div>
      <Card className="p-32 flex flex-col items-center justify-center text-center opacity-60">
        <Globe className="w-12 h-12 mb-4" />
        <p className="text-sm italic">Cloud File Cluster initializing...</p>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5 shrink-0">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs tracking-tight uppercase">HITECH</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">SOFTWARE</span>
            </div>
          </Link>
          
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">WEB MANAGER</div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as WebTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                  activeTab === item.label 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" 
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
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> All portals
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Header' && renderHeaderEditor()}
          {activeTab === 'Home Page' && renderHomePageEditor()}
          {activeTab === 'About Us' && renderAboutUsEditor()}
          {activeTab === 'Contact' && renderContactEditor()}
          {activeTab === 'Footer & General' && renderFooterEditor()}
          {activeTab === 'Banners' && renderBanners()}
          {activeTab === 'News' && renderNews()}
          {activeTab === 'Services' && renderServices()}
          {activeTab === 'Team' && renderTeam()}
          {activeTab === 'Files' && renderFiles()}
        </AnimatePresence>
      </main>
    </div>
  );
}
