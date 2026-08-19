
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  MessageSquare,
  FileText,
  Users,
  Bell,
  Briefcase,
  CreditCard,
  Mail,
  Files,
  Sun,
  Moon,
  ArrowLeft,
  LogOut,
  ChevronRight,
  Headset,
  ClipboardList,
  Loader2,
  Send,
  Trash2,
  UploadCloud,
  File as FileIcon,
  Download,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type CommTab = 'Overview' | 'Messages' | 'Quote Requests' | 'Contacts' | 'Subscribers' | 'Clients' | 'Quotations' | 'Internal Contacts' | 'Files';
type Audience = 'subscribers' | 'contacts' | 'both';

const SUPER_ADMIN_EMAIL = 'hitechsoftware03@gmail.com';

export default function CommunicationsPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CommTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;
  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  const hasCommsAccess = isSuperAdmin || !!profile?.accessiblePortals?.includes('communications');

  // Clearance Check
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (isSuperAdmin) return;
    if (profileLoading) return;
    if (!hasCommsAccess) {
      router.push('/admin');
      toast({ variant: "destructive", title: "Access Restricted", description: "This module requires Communications clearance." });
    }
  }, [user, userLoading, isSuperAdmin, profileLoading, hasCommsAccess, router, toast]);

  // Data
  const { data: quoteRequests } = useCollection(db ? query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc')) : null);
  const { data: contactMessages } = useCollection(db ? query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')) : null);
  const { data: subscribers } = useCollection(db ? query(collection(db, 'subscribers'), orderBy('createdAt', 'desc')) : null);
  const { data: campaigns } = useCollection(db ? query(collection(db, 'campaigns'), orderBy('createdAt', 'desc')) : null);
  const { data: quotations } = useCollection(db ? query(collection(db, 'quotations'), orderBy('createdAt', 'desc')) : null);
  const { data: staffDirectory } = useCollection(db ? query(collection(db, 'users'), orderBy('joinedAt', 'desc')) : null);
  const { data: files } = useCollection(db ? query(collection(db, 'files'), orderBy('createdAt', 'desc')) : null);

  // Compose state
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAudience, setComposeAudience] = useState<Audience>('subscribers');
  const [sending, setSending] = useState(false);

  // Files state (Cloudinary unsigned upload; metadata tracked in Firestore
  // so the tab can list/delete without Cloudinary's secret-key Admin API)
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast({ variant: "destructive", title: "Cloudinary Not Configured", description: "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env." });
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error?.message || 'Upload failed');

      await addDoc(collection(db, 'files'), {
        name: file.name,
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes || file.size,
        uploadedBy: user?.email || 'unknown',
        createdAt: serverTimestamp(),
      });

      toast({ title: "File Uploaded", description: file.name });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: err?.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (id: string, name: string) => {
    if (!db) return;
    if (!confirm(`Remove "${name}" from the list?`)) return;
    try {
      await deleteDoc(doc(db, 'files', id));
      toast({ title: "File Removed" });
    } catch (err) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

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

  const deleteSubscriber = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'subscribers', id));
      toast({ title: "Subscriber Removed" });
    } catch (e) {
      toast({ variant: "destructive", title: "Remove Failed" });
    }
  };

  const handleSendCampaign = async () => {
    if (!db || !composeSubject.trim() || !composeBody.trim()) return;
    setSending(true);

    const recipients = new Set<string>();
    if (composeAudience === 'subscribers' || composeAudience === 'both') {
      subscribers?.forEach((s: any) => s.email && recipients.add(s.email));
    }
    if (composeAudience === 'contacts' || composeAudience === 'both') {
      contactMessages?.forEach((c: any) => c.email && recipients.add(c.email));
    }
    const list = Array.from(recipients);

    if (list.length === 0) {
      toast({ variant: "destructive", title: "No Recipients", description: "There's nobody in the selected audience yet." });
      setSending(false);
      return;
    }

    let sentCount = 0;
    let failedCount = 0;

    await Promise.all(list.map(async (email) => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: email, type: 'Newsletter Campaign', subject: composeSubject, message: composeBody }),
        });
        const result = await res.json();
        if (result.success) sentCount++; else failedCount++;
      } catch {
        failedCount++;
      }
    }));

    try {
      await addDoc(collection(db, 'campaigns'), {
        subject: composeSubject,
        body: composeBody,
        audience: composeAudience,
        recipientCount: list.length,
        sentCount,
        failedCount,
        status: failedCount === 0 ? 'sent' : sentCount === 0 ? 'failed' : 'partial',
        sentBy: user?.email || 'unknown',
        createdAt: serverTimestamp(),
      });
    } catch {
      // history logging failing shouldn't hide that the emails already went out
    }

    toast({
      title: sentCount > 0 ? "Campaign Sent" : "Campaign Failed",
      description: `${sentCount} delivered, ${failedCount} failed, of ${list.length} recipients.`,
      variant: sentCount > 0 ? undefined : "destructive",
    });
    setComposeSubject('');
    setComposeBody('');
    setSending(false);
  };

  const sidebarSections = [
    {
      title: 'COMMUNICATIONS',
      items: [
        { label: 'Overview', icon: LayoutGrid },
        { label: 'Messages', icon: MessageSquare },
        { label: 'Quote Requests', icon: FileText },
        { label: 'Contacts', icon: Mail },
        { label: 'Subscribers', icon: Bell },
      ]
    },
    {
      title: 'MARKETING',
      items: [
        { label: 'Clients', icon: Briefcase },
        { label: 'Quotations', icon: CreditCard },
        { label: 'Internal Contacts', icon: Users },
      ]
    },
    {
      title: 'OTHER',
      items: [
        { label: 'Files', icon: Files },
      ]
    }
  ];

  const stats = [
    { label: 'Quote Requests', value: String(quoteRequests?.length || 0) },
    { label: 'Contacts', value: String(contactMessages?.length || 0) },
    { label: 'Subscribers', value: String(subscribers?.length || 0) },
  ];

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Communications</h1>
        <p className="text-sm text-zinc-400">Messages, quote requests, contact forms and subscribers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50">
               <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Sections</h3>
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: 'Messages', desc: 'Send newsletters & updates', icon: Headset },
                { label: 'Quote Requests', desc: 'Service quote requests', icon: ClipboardList },
                { label: 'Contacts', desc: 'Contact form submissions', icon: Mail },
                { label: 'Subscribers', desc: 'Newsletter subscribers', icon: Bell },
              ].map((section) => (
                <button
                  key={section.label}
                  onClick={() => setActiveTab(section.label as CommTab)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold">{section.label}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">{section.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-200 dark:text-zinc-700" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Recent Contacts</h3>
              <button onClick={() => setActiveTab('Contacts')} className="text-[10px] font-bold text-zinc-400 hover:text-foreground">View all</button>
            </div>
            {contactMessages && contactMessages.length > 0 ? (
              <div className="flex-1 divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {contactMessages.slice(0, 5).map((msg: any) => (
                  <div key={msg.id} className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-bold">{msg.fullName}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">{msg.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{msg.status || 'unread'}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                <p className="text-xs text-zinc-400 font-medium italic opacity-60">No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMessages = () => {
    const totalSent = campaigns?.reduce((sum: number, c: any) => sum + (c.sentCount || 0), 0) || 0;
    const totalFailed = campaigns?.reduce((sum: number, c: any) => sum + (c.failedCount || 0), 0) || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
          <p className="text-sm text-zinc-400">Send a newsletter or update to subscribers and contacts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'CAMPAIGNS SENT', value: String(campaigns?.length || 0) },
            { label: 'TOTAL DELIVERED', value: String(totalSent), color: 'text-green-500' },
            { label: 'FAILED', value: String(totalFailed), color: 'text-red-400' },
            { label: 'AUDIENCE SIZE', value: String((subscribers?.length || 0) + (contactMessages?.length || 0)) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{stat.label}</p>
              <p className={cn("text-3xl font-headline font-bold", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-100">Compose</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Subject</Label>
              <Input value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} placeholder="e.g. New features at HITECH" className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={composeAudience} onValueChange={(v) => setComposeAudience(v as Audience)}>
                <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscribers">Subscribers ({subscribers?.length || 0})</SelectItem>
                  <SelectItem value="contacts">Contacts ({contactMessages?.length || 0})</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={composeBody} onChange={(e) => setComposeBody(e.target.value)} placeholder="Write your update..." className="rounded-xl h-36" />
          </div>
          <Button onClick={handleSendCampaign} disabled={sending || !composeSubject.trim() || !composeBody.trim()} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Campaign
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/20">
                <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Audience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Delivered / Failed</th>
                  <th className="px-6 py-4">Sender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {campaigns?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{c.subject}</p>
                      <p className="text-[10px] text-zinc-400 font-medium line-clamp-1 max-w-xs">{c.body}</p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 text-[9px] font-bold px-2 rounded-md capitalize">{c.audience}</Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold px-2 rounded-md capitalize",
                        c.status === 'sent' ? 'bg-green-500/5 text-green-500 border-green-500/20' :
                        c.status === 'failed' ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-amber-500/5 text-amber-500 border-amber-500/20'
                      )}>{c.status}</Badge>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-zinc-500">{c.sentCount || 0} / {c.failedCount || 0}</td>
                    <td className="px-6 py-5 text-xs font-bold text-zinc-600 dark:text-zinc-400">{c.sentBy}</td>
                  </tr>
                ))}
                {(!campaigns || campaigns.length === 0) && (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-xs text-zinc-400 italic">No campaigns sent yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderQuoteRequests = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Quote Requests</h1>
        <p className="text-sm text-zinc-400">Service quote requests submitted from the project inquiry form.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project Type</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {quoteRequests?.map((inq: any) => (
              <tr key={inq.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-xs font-bold">{inq.fullName}</p>
                  <p className="text-[10px] text-zinc-400">{inq.email}</p>
                </td>
                <td className="px-6 py-5 text-xs font-medium text-zinc-500">{inq.projectType || 'Not specified'}</td>
                <td className="px-6 py-5 text-xs font-medium text-zinc-500">{inq.budget || 'Not specified'}</td>
                <td className="px-6 py-5">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{inq.status || 'new'}</Badge>
                </td>
              </tr>
            ))}
            {(!quoteRequests || quoteRequests.length === 0) && (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-xs text-zinc-400 italic">No quote requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderContacts = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Contacts</h1>
        <p className="text-sm text-zinc-400">Submissions from the homepage contact form.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {contactMessages?.map((msg: any) => (
              <tr key={msg.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-xs font-bold">{msg.fullName}</p>
                  <p className="text-[10px] text-zinc-400">{msg.email} · {msg.phoneNumber}</p>
                </td>
                <td className="px-6 py-5 text-xs text-zinc-500 max-w-md truncate">{msg.message}</td>
                <td className="px-6 py-5">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{msg.status || 'unread'}</Badge>
                </td>
              </tr>
            ))}
            {(!contactMessages || contactMessages.length === 0) && (
              <tr><td colSpan={3} className="px-6 py-20 text-center text-xs text-zinc-400 italic">No contact messages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSubscribers = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Subscribers</h1>
        <p className="text-sm text-zinc-400">Everyone who subscribed via the site-wide popup.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {subscribers?.map((s: any) => (
              <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-5 text-xs font-bold">{s.email}</td>
                <td className="px-6 py-5 text-xs font-medium text-zinc-500 capitalize">{s.source || 'site'}</td>
                <td className="px-6 py-5 text-right">
                  <Button onClick={() => deleteSubscriber(s.id)} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
            {(!subscribers || subscribers.length === 0) && (
              <tr><td colSpan={3} className="px-6 py-20 text-center text-xs text-zinc-400 italic">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderClients = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Clients</h1>
          <p className="text-sm text-zinc-400">Snapshot of the client pipeline. Full ledger lives in Client Ecosystem.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Link href="/admin/clients"><ExternalLink className="w-4 h-4" /> Open Client Ecosystem</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Inquiries', value: quoteRequests?.length || 0 },
          { label: 'Quotations', value: quotations?.length || 0 },
          { label: 'Subscribers', value: subscribers?.length || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{s.label}</p>
            <p className="text-4xl font-headline font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderQuotations = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quotations</h1>
          <p className="text-sm text-zinc-400">Same ledger as Client Ecosystem &mdash; create new quotations there.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Link href="/admin/clients"><ExternalLink className="w-4 h-4" /> Manage in Client Ecosystem</Link>
        </Button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {quotations?.map((q: any) => (
              <tr key={q.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-5 text-xs font-bold">{q.clientName}</td>
                <td className="px-6 py-5 text-xs font-mono text-zinc-400">{q.reference || '—'}</td>
                <td className="px-6 py-5 text-xs font-bold text-zinc-600 dark:text-zinc-400">{q.totalAmount ? `UGX ${q.totalAmount.toLocaleString()}` : ''}</td>
                <td className="px-6 py-5">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{q.status}</Badge>
                </td>
              </tr>
            ))}
            {(!quotations || quotations.length === 0) && (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-xs text-zinc-400 italic">No quotations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderInternalContacts = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Internal Contacts</h1>
        <p className="text-sm text-zinc-400">HITECH staff directory.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffDirectory?.map((member: any) => (
          <div key={member.id} className="apple-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase shrink-0">
              {member.email === SUPER_ADMIN_EMAIL ? <ShieldCheck className="w-5 h-5 text-primary" /> : (member.displayName?.charAt(0) || <UserIcon className="w-5 h-5" />)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{member.displayName}</p>
              <p className="text-[10px] text-zinc-400 truncate">{member.email}</p>
              <Badge variant="outline" className="text-[7px] font-bold uppercase mt-2 border-primary/20 text-primary">{member.role || 'staff'}</Badge>
            </div>
          </div>
        ))}
        {(!staffDirectory || staffDirectory.length === 0) && (
          <div className="col-span-full p-20 text-center text-zinc-400 italic text-xs">No staff on record yet.</div>
        )}
      </div>
    </motion.div>
  );

  const renderFiles = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Files</h1>
          <p className="text-sm text-zinc-400">Shared institutional files, contracts, and assets.</p>
        </div>
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          <span className="rounded-xl h-11 px-6 font-bold flex items-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-black text-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Upload File
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files?.map((file: any) => (
          <div key={file.id} className="apple-card p-6 flex flex-col items-center text-center group relative">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <FileIcon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-foreground mb-3 truncate w-full">{file.name}</p>
            <div className="flex items-center gap-2">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors">
                <Download className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => handleDeleteFile(file.id, file.name)} className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {(!files || files.length === 0) && (
          <div className="col-span-full p-20 text-center text-zinc-400 italic text-xs">No files uploaded yet.</div>
        )}
      </div>
    </motion.div>
  );

  if (userLoading || (user && !isSuperAdmin && (profileLoading || !hasCommsAccess))) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] font-body text-zinc-800 dark:text-zinc-100">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
              {logo ? (
                <Image src={logo.imageUrl} alt="Logo" width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
            </div>
            <span className="font-headline font-bold text-lg tracking-tight uppercase">Hitech</span>
          </Link>

          <div className="space-y-8">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{section.title}</div>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label as CommTab)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                        activeTab === item.label
                          ? "bg-zinc-100 dark:bg-zinc-800 text-foreground"
                          : "text-zinc-400 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", activeTab === item.label ? "text-primary" : "text-zinc-400 group-hover:text-zinc-500")} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
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
          {activeTab === 'Messages' && renderMessages()}
          {activeTab === 'Quote Requests' && renderQuoteRequests()}
          {activeTab === 'Contacts' && renderContacts()}
          {activeTab === 'Subscribers' && renderSubscribers()}
          {activeTab === 'Clients' && renderClients()}
          {activeTab === 'Quotations' && renderQuotations()}
          {activeTab === 'Internal Contacts' && renderInternalContacts()}
          {activeTab === 'Files' && renderFiles()}
        </AnimatePresence>
      </main>
    </div>
  );
}
