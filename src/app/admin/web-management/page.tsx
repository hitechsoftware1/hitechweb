
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Plus, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  Loader2, 
  Trash2, 
  Pencil,
  Settings,
  Image as ImageIcon,
  Newspaper,
  Briefcase,
  Users,
  Star,
  Globe,
  Save,
  X,
  Type,
  Link as LinkIcon
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

type WebTab = 'Overview' | 'Banners' | 'News' | 'Services' | 'Team' | 'Testimonials' | 'Global Config';

export default function WebManagerPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<WebTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const isSuperAdmin = user?.email === 'hitechsoftware03@gmail.com';
  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  const hasWebAccess = isSuperAdmin || !!profile?.accessiblePortals?.includes('web-management');

  // Clearance Check
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (isSuperAdmin) return;
    if (profileLoading) return;
    if (!hasWebAccess) {
      router.push('/admin');
      toast({ variant: "destructive", title: "Access Restricted", description: "Web Management clearance required." });
    }
  }, [user, userLoading, isSuperAdmin, profileLoading, hasWebAccess, router, toast]);

  // CMS Data Queries — news/services/team/testimonials feed Overview's
  // stat cards so they stay always-on; banners and siteConfig are only
  // used on their own tabs and load lazily.
  const { data: news } = useCollection(db ? query(collection(db, 'news'), orderBy('createdAt', 'desc')) : null);
  const { data: services } = useCollection(db ? query(collection(db, 'services'), orderBy('createdAt', 'asc')) : null);
  const { data: team } = useCollection(db ? query(collection(db, 'team'), orderBy('createdAt', 'asc')) : null);
  const { data: banners } = useCollection(db && activeTab === 'Banners' ? query(collection(db, 'banners'), orderBy('createdAt', 'asc')) : null);
  const { data: testimonials } = useCollection(db ? query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')) : null);
  const configRef = useMemo(() => (db && activeTab === 'Global Config' ? doc(db, 'siteConfig', 'main') : null), [db, activeTab]);
  const { data: siteConfig } = useDoc(configRef);
  const [configSaving, setConfigSaving] = useState(false);

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

  const deleteItem = async (col: string, id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to purge this content node?")) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast({ title: "Node Purged", description: "Content has been removed from the neural core." });
    } catch (e) {
      toast({ variant: "destructive", title: "Operation Failed" });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const collectionName = activeTab.toLowerCase();
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'skills') {
        data[key] = (value as string).split(',').map(s => s.trim());
      } else {
        data[key] = value;
      }
    });

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), { ...data, updatedAt: serverTimestamp() });
        toast({ title: "Node Updated", description: "Structural changes synchronized." });
      } else {
        await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
        toast({ title: "Node Created", description: "New content initialized in the cluster." });
      }
      setIsDialogOpen(false);
      setEditingId(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleSaveConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setConfigSaving(true);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      // Only write fields the admin actually filled in, so blank inputs
      // never overwrite an existing value with an empty string.
      if (typeof value === 'string' && value.trim() !== '') data[key] = value;
    });

    try {
      await setDoc(doc(db, 'siteConfig', 'main'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: "Site Content Updated", description: "Changes are now live across the site." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save Failed" });
    } finally {
      setConfigSaving(false);
    }
  };

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Banners', icon: ImageIcon },
    { label: 'News', icon: Newspaper },
    { label: 'Services', icon: Briefcase },
    { label: 'Team', icon: Users },
    { label: 'Testimonials', icon: Star },
    { label: 'Global Config', icon: Settings },
  ];

  const renderContentList = (title: string, items: any[], collectionName: string) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-zinc-400 font-medium">Managing {items?.length || 0} architecture nodes.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setIsDialogOpen(true); }} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Node
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div key={item.id} className="apple-card p-6 flex flex-col justify-between group">
             <div>
                <div className="aspect-video relative rounded-xl overflow-hidden mb-6 bg-zinc-50 dark:bg-zinc-800 border border-black/5">
                   {item.image ? (
                     <Image src={item.image} alt={item.title || item.name} fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon className="w-8 h-8" /></div>
                   )}
                </div>
                <h4 className="font-bold text-sm mb-1">{item.title || item.name}</h4>
                <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 mb-4">{item.description || item.bio || item.excerpt || item.text}</p>
                {item.category && <Badge variant="secondary" className="text-[7px] uppercase font-bold">{item.category}</Badge>}
                {item.role && <Badge variant="outline" className="text-[7px] uppercase font-bold border-primary/20 text-primary">{item.role}</Badge>}
             </div>
             <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                <Button onClick={() => openEdit(item)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></Button>
                <Button onClick={() => deleteItem(collectionName, item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></Button>
             </div>
          </div>
        ))}
        {(!items || items.length === 0) && <div className="col-span-full p-20 text-center text-zinc-400 italic text-xs">No nodes initialized. Cluster is empty.</div>}
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight">Website Architecture</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'News Articles', value: news?.length || 0, icon: Newspaper },
          { label: 'Team Members', value: team?.length || 0, icon: Users },
          { label: 'Active Services', value: services?.length || 0, icon: Briefcase },
          { label: 'Testimonials', value: testimonials?.length || 0, icon: Star },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-zinc-200 dark:text-zinc-800 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (userLoading || (user && !isSuperAdmin && (profileLoading || !hasWebAccess))) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const currentItem = activeTab === 'Banners' ? banners?.find(i => i.id === editingId) :
                   activeTab === 'News' ? news?.find(i => i.id === editingId) :
                   activeTab === 'Services' ? services?.find(i => i.id === editingId) :
                   activeTab === 'Team' ? team?.find(i => i.id === editingId) :
                   activeTab === 'Testimonials' ? testimonials?.find(i => i.id === editingId) : null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5 shrink-0 group-hover:scale-105 transition-transform">
               <div className="w-full h-full bg-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs tracking-tight uppercase">HITECH</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">WEB CORE</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.label as WebTab)} 
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
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Portals hub</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Banners' && renderContentList('Sliding Banners', banners || [], 'banners')}
          {activeTab === 'News' && renderContentList('News Articles', news || [], 'news')}
          {activeTab === 'Services' && renderContentList('Managed Services', services || [], 'services')}
          {activeTab === 'Team' && renderContentList('Engineering Units', team || [], 'team')}
          {activeTab === 'Testimonials' && renderContentList('Client Verification', testimonials || [], 'testimonials')}
          {activeTab === 'Global Config' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-3xl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Global Config</h1>
                <p className="text-xs text-zinc-400 font-medium">Edit the shared text and images used across the site. Leave a field blank to keep its current value.</p>
              </div>
              <form onSubmit={handleSaveConfig} className="space-y-8">
                <div className="apple-card p-6 space-y-4 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Homepage Hero</h3>
                  <div className="space-y-2">
                    <Label>Headline Prefix</Label>
                    <Input name="heroHeadline" defaultValue={siteConfig?.heroHeadline} placeholder="Building" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtext</Label>
                    <Textarea name="heroSubtext" defaultValue={siteConfig?.heroSubtext} className="rounded-xl h-20" placeholder="HITECH builds strong foundations for world-class digital tools..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Image URL</Label>
                    <Input name="heroImage" defaultValue={siteConfig?.heroImage} placeholder="https://..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Slideshow Images (comma separated, overrides single image above)</Label>
                    <Textarea name="heroImages" defaultValue={siteConfig?.heroImages} className="rounded-xl h-20" placeholder="https://..., https://..., https://..." />
                  </div>
                </div>

                <div className="apple-card p-6 space-y-4 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Contact Details (Footer &amp; Contact section)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="contactEmail" defaultValue={siteConfig?.contactEmail} placeholder="hitechsoftware03@gmail.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input name="contactPhone" defaultValue={siteConfig?.contactPhone} placeholder="+256 742 928 508" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp Number</Label>
                      <Input name="whatsappNumber" defaultValue={siteConfig?.whatsappNumber} placeholder="+256 759 408 917" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input name="contactAddress" defaultValue={siteConfig?.contactAddress} placeholder="Naalya Kampala, Uganda" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="apple-card p-6 space-y-4 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Footer &amp; Social</h3>
                  <div className="space-y-2">
                    <Label>Footer Tagline</Label>
                    <Input name="footerTagline" defaultValue={siteConfig?.footerTagline} placeholder="Precision engineered software systems..." className="rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Twitter / X URL</Label>
                      <Input name="socialTwitter" defaultValue={siteConfig?.socialTwitter} placeholder="https://x.com/..." className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input name="socialLinkedin" defaultValue={siteConfig?.socialLinkedin} placeholder="https://linkedin.com/..." className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input name="socialGithub" defaultValue={siteConfig?.socialGithub} placeholder="https://github.com/..." className="rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="apple-card p-6 space-y-4 rounded-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">About Page &mdash; Founder &amp; Mission</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Founder Name</Label>
                      <Input name="founderName" defaultValue={siteConfig?.founderName} placeholder="JoelHitech" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Founder Title</Label>
                      <Input name="founderTitle" defaultValue={siteConfig?.founderTitle} placeholder="Founder & CEO" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Founder Photo URL</Label>
                    <Input name="founderImage" defaultValue={siteConfig?.founderImage} placeholder="https://..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Founder Quote</Label>
                    <Textarea name="founderQuote" defaultValue={siteConfig?.founderQuote} className="rounded-xl h-20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mission Statement</Label>
                    <Textarea name="missionText" defaultValue={siteConfig?.missionText} className="rounded-xl h-20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Standard Statement</Label>
                    <Textarea name="standardText" defaultValue={siteConfig?.standardText} className="rounded-xl h-20" />
                  </div>
                </div>

                <Button type="submit" disabled={configSaving} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                  {configSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Site Content
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* NODE MANAGEMENT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Architecture Node' : 'Initialize New Node'}</DialogTitle>
            <DialogDescription>Synchronize content directly with the global HITECH cluster.</DialogDescription>
          </DialogHeader>
          <form className="space-y-6 py-4" onSubmit={handleSave}>
            
            {activeTab === 'Banners' && (
              <>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input name="image" defaultValue={currentItem?.image} required className="rounded-xl" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Image Hint (SEO)</Label>
                  <Input name="imageHint" defaultValue={currentItem?.imageHint} className="rounded-xl" placeholder="e.g. cloud architecture" />
                </div>
                <div className="space-y-2">
                  <Label>Label / Title</Label>
                  <Input name="title" defaultValue={currentItem?.title} className="rounded-xl" />
                </div>
              </>
            )}

            {activeTab === 'News' && (
              <>
                <div className="space-y-2">
                  <Label>Article Title</Label>
                  <Input name="title" defaultValue={currentItem?.title} required className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input name="category" defaultValue={currentItem?.category} className="rounded-xl" placeholder="AI, Fintech, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label>Read Time</Label>
                    <Input name="readTime" defaultValue={currentItem?.readTime} className="rounded-xl" placeholder="5 min" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea name="excerpt" defaultValue={currentItem?.excerpt} required className="rounded-xl h-24" />
                </div>
                <div className="space-y-2">
                  <Label>Full Article Content (shown in the read popup)</Label>
                  <Textarea name="content" defaultValue={currentItem?.content} className="rounded-xl h-40" placeholder="Write the full article here..." />
                </div>
                <div className="space-y-2">
                  <Label>Featured Image URL</Label>
                  <Input name="image" defaultValue={currentItem?.image} required className="rounded-xl" />
                </div>
              </>
            )}

            {activeTab === 'Services' && (
              <>
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input name="title" defaultValue={currentItem?.title} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Input name="tag" defaultValue={currentItem?.tag} className="rounded-xl" placeholder="Software, Mobile, etc." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={currentItem?.description} required className="rounded-xl h-24" />
                </div>
                <div className="space-y-2">
                  <Label>Internal Link (Optional)</Label>
                  <Input name="href" defaultValue={currentItem?.href} className="rounded-xl" placeholder="/mobile-apps" />
                </div>
              </>
            )}

            {activeTab === 'Team' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input name="name" defaultValue={currentItem?.name} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Institutional Role</Label>
                    <Input name="role" defaultValue={currentItem?.role} required className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea name="bio" defaultValue={currentItem?.bio} required className="rounded-xl h-24" />
                </div>
                <div className="space-y-2">
                  <Label>Skills (Comma separated)</Label>
                  <Input name="skills" defaultValue={currentItem?.skills?.join(', ')} className="rounded-xl" placeholder="React, Node.js, AI" />
                </div>
                <div className="space-y-2">
                  <Label>Avatar Image URL</Label>
                  <Input name="image" defaultValue={currentItem?.image} className="rounded-xl" />
                </div>
              </>
            )}

            {activeTab === 'Testimonials' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input name="name" defaultValue={currentItem?.name} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Institutional Role</Label>
                    <Input name="role" defaultValue={currentItem?.role} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Project Identity</Label>
                  <Input name="project" defaultValue={currentItem?.project} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Star Rating (1-6)</Label>
                  <Input name="stars" type="number" min="1" max="6" defaultValue={currentItem?.stars || 5} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Feedback String</Label>
                  <Textarea name="text" defaultValue={currentItem?.text} required className="rounded-xl h-24" />
                </div>
              </>
            )}

            <DialogFooter className="pt-6">
              <Button type="submit" disabled={formLoading} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Authorize Node Sync
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
