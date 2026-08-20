
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  FileText, 
  Receipt, 
  ClipboardList, 
  Inbox, 
  Plus, 
  Search, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut,
  ChevronDown,
  Filter,
  DollarSign,
  TrendingUp,
  Briefcase,
  Loader2,
  Trash2,
  Save,
  CheckCircle2,
  Download,
  ChevronRight
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { downloadClientDocumentPdf } from '@/lib/generate-document-pdf';
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
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClientTab = 'Overview' | 'Inquiries' | 'Quotations' | 'Invoices' | 'LPOs';
type DocumentCol = 'quotations' | 'invoices' | 'lpos';

const RECORD_LABELS: Record<string, string> = {
  quotations: 'Quotation Reference',
  invoices: 'Invoice Number',
  lpos: 'PO Number',
};

const DOCUMENT_TYPE_LABELS: Record<DocumentCol, 'Quotation' | 'Invoice' | 'Purchase Order'> = {
  quotations: 'Quotation',
  invoices: 'Invoice',
  lpos: 'Purchase Order',
};

export default function ClientEcosystemPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ClientTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [recordCol, setRecordCol] = useState<DocumentCol>('quotations');
  const [recordLoading, setRecordLoading] = useState(false);

  const [viewItem, setViewItem] = useState<{ col: DocumentCol; item: any } | null>(null);
  const [viewSaving, setViewSaving] = useState(false);
  const [viewStatus, setViewStatus] = useState('draft');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const isSuperAdmin = user?.email === 'hitechsoftware03@gmail.com';
  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  const hasClientsAccess = isSuperAdmin || !!profile?.accessiblePortals?.includes('clients');

  // Clearance Check
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (isSuperAdmin) return;
    if (profileLoading) return;
    if (!hasClientsAccess) {
      router.push('/admin');
      toast({ variant: "destructive", title: "Access Restricted", description: "Client Ecosystem clearance required." });
    }
  }, [user, userLoading, isSuperAdmin, profileLoading, hasClientsAccess, router, toast]);

  // Queries
  const { data: inquiries } = useCollection(db ? query(collection(db, 'projectInquiries'), orderBy('createdAt', 'desc')) : null);
  const { data: quotations } = useCollection(db ? query(collection(db, 'quotations'), orderBy('createdAt', 'desc')) : null);
  const { data: invoices } = useCollection(db ? query(collection(db, 'invoices'), orderBy('createdAt', 'desc')) : null);
  const { data: lpos } = useCollection(db ? query(collection(db, 'lpos'), orderBy('createdAt', 'desc')) : null);

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

  const updateStatus = async (col: string, id: string, status: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, col, id), { status });
      toast({ title: "Registry Updated", description: `Record marked as ${status}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const deleteRecord = async (col: string, id: string) => {
    if (!db) return;
    if (!confirm('Delete this record?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast({ title: "Record Removed" });
    } catch (e) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const openNewRecord = (col: 'quotations' | 'invoices' | 'lpos') => {
    setRecordCol(col);
    setIsNewRecordOpen(true);
  };

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setRecordLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = {
      clientName: formData.get('clientName') as string,
      reference: formData.get('reference') as string,
      totalAmount: Number(formData.get('totalAmount')) || 0,
      notes: formData.get('notes') as string,
      status: 'draft',
      createdAt: serverTimestamp(),
    };
    if (recordCol === 'invoices') data.invoiceNumber = data.reference;
    if (recordCol === 'lpos') data.poNumber = data.reference;
    if (recordCol === 'quotations') data.quotationRef = data.reference;

    try {
      await addDoc(collection(db, recordCol), data);
      toast({ title: "Record Created", description: "Added to the client ledger." });
      setIsNewRecordOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Creation Failed" });
    } finally {
      setRecordLoading(false);
    }
  };

  const openViewRecord = (col: DocumentCol, item: any) => {
    setViewItem({ col, item });
    setViewStatus(item.status || 'draft');
  };

  const handleUpdateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !viewItem) return;
    setViewSaving(true);

    const formData = new FormData(e.currentTarget);
    const data: any = {
      clientName: formData.get('clientName') as string,
      reference: formData.get('reference') as string,
      totalAmount: Number(formData.get('totalAmount')) || 0,
      notes: formData.get('notes') as string,
      status: viewStatus,
    };
    if (viewItem.col === 'invoices') data.invoiceNumber = data.reference;
    if (viewItem.col === 'lpos') data.poNumber = data.reference;
    if (viewItem.col === 'quotations') data.quotationRef = data.reference;

    try {
      await updateDoc(doc(db, viewItem.col, viewItem.item.id), data);
      toast({ title: "Record Updated", description: "Changes saved to the client ledger." });
      setViewItem(null);
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setViewSaving(false);
    }
  };

  const handleDownloadRecord = async () => {
    if (!viewItem) return;
    setDownloadingPdf(true);
    try {
      await downloadClientDocumentPdf({
        id: viewItem.item.id,
        type: DOCUMENT_TYPE_LABELS[viewItem.col],
        reference: viewItem.item.reference,
        clientName: viewItem.item.clientName,
        totalAmount: viewItem.item.totalAmount || 0,
        notes: viewItem.item.notes,
        status: viewItem.item.status,
        createdAt: viewItem.item.createdAt,
      });
    } catch (err) {
      toast({ variant: "destructive", title: "PDF Generation Failed" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDeleteViewedRecord = async () => {
    if (!db || !viewItem) return;
    if (!confirm('Delete this record?')) return;
    try {
      await deleteDoc(doc(db, viewItem.col, viewItem.item.id));
      toast({ title: "Record Removed" });
      setViewItem(null);
    } catch (e) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const renderList = (title: string, items: any[], col: string, allowCreate: boolean = false) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {allowCreate && (
          <Button onClick={() => openNewRecord(col as 'quotations' | 'invoices' | 'lpos')} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New {title.slice(0, -1)}
          </Button>
        )}
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Reference / Client</th>
              <th className="px-8 py-5">Value / Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {items?.map((item: any) => (
              <tr
                key={item.id}
                onClick={allowCreate ? () => openViewRecord(col as DocumentCol, item) : undefined}
                className={cn(
                  "group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all",
                  allowCreate && "cursor-pointer"
                )}
              >
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{item.clientName || item.fullName}</p>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase">{item.reference || item.id.substring(0, 8)}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                     <Badge variant="outline" className="text-[9px] font-bold uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">{item.status}</Badge>
                     <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{item.totalAmount ? `UGX ${item.totalAmount.toLocaleString()}` : ''}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  {allowCreate ? (
                    <div className="flex justify-end">
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1 group-hover:text-primary transition-colors">
                        View / Edit <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => updateStatus(col, item.id, 'accepted')} size="sm" variant="ghost" title="Mark accepted" className="h-8 w-8 p-0 text-green-500"><CheckCircle2 className="w-4 h-4" /></Button>
                      <Button onClick={() => deleteRecord(col, item.id)} size="sm" variant="ghost" title="Delete" className="h-8 w-8 p-0 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!items || items.length === 0) && <tr><td colSpan={3} className="p-20 text-center text-zinc-400 italic">Institutional ledger is currently empty.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight">Client Ecosystem Ledger</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Inquiries', value: inquiries?.length || 0, change: 'Leads', color: 'text-blue-500' },
          { label: 'Quotations', value: quotations?.length || 0, change: 'Estimates', color: 'text-amber-500' },
          { label: 'Invoices', value: invoices?.length || 0, change: 'Revenue', color: 'text-green-500' },
          { label: 'LPOs', value: lpos?.length || 0, change: 'Orders', color: 'text-zinc-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className="text-4xl font-headline font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (userLoading || (user && !isSuperAdmin && (profileLoading || !hasClientsAccess))) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">CLIENTS</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {['Overview', 'Inquiries', 'Quotations', 'Invoices', 'LPOs'].map((label) => (
              <button key={label} onClick={() => setActiveTab(label as ClientTab)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === label ? "bg-zinc-100 dark:bg-zinc-800 text-foreground" : "text-zinc-400 hover:text-foreground")}>
                <Briefcase className={cn("w-4 h-4", activeTab === label ? "text-primary" : "text-zinc-400")} />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-1 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400"><ArrowLeft className="w-4 h-4" /> All portals</Link>
          <button onClick={() => signOut(auth).then(() => window.location.href = '/')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && renderOverview()}
          {activeTab === 'Inquiries' && renderList('Project Inquiries', inquiries || [], 'projectInquiries')}
          {activeTab === 'Quotations' && renderList('Formal Quotations', quotations || [], 'quotations', true)}
          {activeTab === 'Invoices' && renderList('Billing Invoices', invoices || [], 'invoices', true)}
          {activeTab === 'LPOs' && renderList('Purchase Orders', lpos || [], 'lpos', true)}
        </AnimatePresence>

        <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
          <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-lg">
            <DialogHeader>
              <DialogTitle>New {recordCol === 'quotations' ? 'Quotation' : recordCol === 'invoices' ? 'Invoice' : 'Purchase Order'}</DialogTitle>
              <DialogDescription>Add a new record to the client ecosystem ledger.</DialogDescription>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleCreateRecord}>
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input name="clientName" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>{RECORD_LABELS[recordCol]}</Label>
                <Input name="reference" className="rounded-xl" placeholder="e.g. QT-2026-014" />
              </div>
              <div className="space-y-2">
                <Label>Total Amount (UGX)</Label>
                <Input name="totalAmount" type="number" min="0" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" className="rounded-xl h-24" />
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={recordLoading} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                  {recordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
          <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-lg max-h-[90vh] overflow-y-auto">
            {viewItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{DOCUMENT_TYPE_LABELS[viewItem.col]} &mdash; {viewItem.item.reference || viewItem.item.id.slice(0, 8).toUpperCase()}</DialogTitle>
                  <DialogDescription>View, edit, or download this document as a branded PDF.</DialogDescription>
                </DialogHeader>
                <form className="space-y-6 py-4" onSubmit={handleUpdateRecord}>
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input name="clientName" defaultValue={viewItem.item.clientName} required className="rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{RECORD_LABELS[viewItem.col]}</Label>
                      <Input name="reference" defaultValue={viewItem.item.reference} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={viewStatus} onValueChange={setViewStatus}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Amount (UGX)</Label>
                    <Input name="totalAmount" type="number" min="0" defaultValue={viewItem.item.totalAmount} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea name="notes" defaultValue={viewItem.item.notes} className="rounded-xl h-24" />
                  </div>
                  <DialogFooter className="flex-col gap-3 pt-2 sm:flex-col">
                    <Button type="button" onClick={handleDownloadRecord} disabled={downloadingPdf} variant="outline" className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                      {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download Branded PDF
                    </Button>
                    <Button type="submit" disabled={viewSaving} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                      {viewSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                    <Button type="button" onClick={handleDeleteViewedRecord} variant="ghost" className="w-full rounded-xl h-11 font-bold uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete Record
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
