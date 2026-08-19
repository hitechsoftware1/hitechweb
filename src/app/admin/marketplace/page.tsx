
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Package,
  Receipt,
  Plus,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  Loader2,
  Trash2,
  Pencil,
  Save,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useCollection, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type MarketTab = 'Overview' | 'Products' | 'Orders';

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_verification: 'border-amber-500/20 text-amber-500 bg-amber-500/5',
  verified_paid: 'border-blue-500/20 text-blue-500 bg-blue-500/5',
  fulfilled: 'border-green-500/20 text-green-500 bg-green-500/5',
  rejected: 'border-red-500/20 text-red-500 bg-red-500/5',
};

function formatMoney(amount: number, currency: string) {
  return `${currency || 'UGX'} ${(amount || 0).toLocaleString()}`;
}

export default function MarketplaceAdminPortal() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<MarketTab>('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [category, setCategory] = useState<'digital' | 'service' | 'gadget'>('digital');

  const isSuperAdmin = user?.email === 'hitechsoftware03@gmail.com';
  const profileRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  const hasMarketAccess = isSuperAdmin || !!profile?.accessiblePortals?.includes('marketplace');

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (isSuperAdmin) return;
    if (profileLoading) return;
    if (!hasMarketAccess) {
      router.push('/admin');
      toast({ variant: 'destructive', title: 'Access Restricted', description: 'Marketplace clearance required.' });
    }
  }, [user, userLoading, isSuperAdmin, profileLoading, hasMarketAccess, router, toast]);

  const { data: products } = useCollection(db ? query(collection(db, 'marketplaceProducts'), orderBy('createdAt', 'desc')) : null);
  const { data: orders } = useCollection(db ? query(collection(db, 'marketplaceOrders'), orderBy('createdAt', 'desc')) : null);

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

  const deleteProduct = async (id: string) => {
    if (!db) return;
    if (!confirm('Remove this product from the marketplace?')) return;
    try {
      await deleteDoc(doc(db, 'marketplaceProducts', id));
      toast({ title: 'Product Removed' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Operation Failed' });
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setCategory(item.category || 'digital');
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setCategory('digital');
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = { category };
    formData.forEach((value, key) => {
      if (key === 'price' || key === 'stock') {
        data[key] = value ? Number(value) : null;
      } else if (key === 'active') {
        data[key] = value === 'on';
      } else {
        data[key] = value;
      }
    });
    if (!('active' in data)) data.active = true;

    try {
      if (editingId) {
        await updateDoc(doc(db, 'marketplaceProducts', editingId), { ...data, updatedAt: serverTimestamp() });
        toast({ title: 'Product Updated' });
      } else {
        await addDoc(collection(db, 'marketplaceProducts'), { ...data, createdAt: serverTimestamp() });
        toast({ title: 'Product Listed' });
      }
      setIsDialogOpen(false);
      setEditingId(null);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Sync Failed' });
    } finally {
      setFormLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'marketplaceOrders', id), { status, verifiedAt: serverTimestamp() });
      toast({ title: 'Order Updated', description: `Marked as ${status.replace('_', ' ')}.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Update Failed' });
    }
  };

  const currentProduct = products?.find((p: any) => p.id === editingId);

  const sidebarItems = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Products', icon: Package },
    { label: 'Orders', icon: Receipt },
  ];

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight">Marketplace Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Listed Products', value: products?.length || 0, icon: Package },
          { label: 'Total Orders', value: orders?.length || 0, icon: Receipt },
          { label: 'Pending Verification', value: orders?.filter((o: any) => o.status === 'pending_verification').length || 0, icon: ShoppingBag },
          { label: 'Fulfilled', value: orders?.filter((o: any) => o.status === 'fulfilled').length || 0, icon: Truck },
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

  const renderProducts = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-xs text-zinc-400 font-medium">Managing {products?.length || 0} listings.</p>
        </div>
        <Button onClick={openNew} className="rounded-xl h-11 px-6 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((item: any) => (
          <div key={item.id} className="apple-card p-6 flex flex-col justify-between group rounded-2xl">
            <div>
              <div className="aspect-video relative rounded-xl overflow-hidden mb-6 bg-zinc-50 dark:bg-zinc-800 border border-black/5">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300"><Package className="w-8 h-8" /></div>
                )}
              </div>
              <h4 className="font-bold text-sm mb-1">{item.name}</h4>
              <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 mb-4">{item.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[7px] uppercase font-bold">{item.category}</Badge>
                {item.active === false && <Badge variant="outline" className="text-[7px] uppercase font-bold border-red-500/20 text-red-500">Inactive</Badge>}
              </div>
              <p className="text-sm font-bold mt-3">{formatMoney(item.price, item.currency)}</p>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800">
              <Button onClick={() => openEdit(item)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></Button>
              <Button onClick={() => deleteProduct(item.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
        {(!products || products.length === 0) && <div className="col-span-full p-20 text-center text-zinc-400 italic text-xs">No products listed yet.</div>}
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <th className="px-8 py-5">Customer / Items</th>
              <th className="px-8 py-5">Payment</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {orders?.map((order: any) => (
              <tr key={order.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all align-top">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold">{order.customerName}</p>
                  <p className="text-[10px] text-zinc-400 mb-1">{order.customerEmail} · {order.customerPhone}</p>
                  <p className="text-[10px] text-zinc-500 max-w-xs">
                    {order.items?.map((i: any) => `${i.name} x${i.qty}`).join(', ')}
                  </p>
                  <p className="text-xs font-bold mt-1">{formatMoney(order.totalAmount, order.currency)}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] font-bold uppercase text-zinc-500">{order.paymentMethod?.replace('_', ' ')}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">{order.transactionRef}</p>
                </td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={cn('text-[9px] font-bold uppercase', ORDER_STATUS_COLOR[order.status] || '')}>
                    {order.status?.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-1">
                    <Button onClick={() => updateOrderStatus(order.id, 'verified_paid')} size="sm" variant="ghost" title="Verify payment" className="h-8 w-8 p-0 text-blue-500"><CheckCircle2 className="w-4 h-4" /></Button>
                    <Button onClick={() => updateOrderStatus(order.id, 'fulfilled')} size="sm" variant="ghost" title="Mark fulfilled" className="h-8 w-8 p-0 text-green-500"><Truck className="w-4 h-4" /></Button>
                    <Button onClick={() => updateOrderStatus(order.id, 'rejected')} size="sm" variant="ghost" title="Reject order" className="h-8 w-8 p-0 text-red-400"><XCircle className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && <tr><td colSpan={4} className="p-20 text-center text-zinc-400 italic">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  if (userLoading || (user && !isSuperAdmin && (profileLoading || !hasMarketAccess))) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

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
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">MARKETPLACE</span>
            </div>
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label as MarketTab)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  activeTab === item.label ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm' : 'text-zinc-400 hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-4 h-4', activeTab === item.label ? 'text-primary' : 'text-zinc-400 group-hover:text-zinc-500')} />
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
          {activeTab === 'Products' && renderProducts()}
          {activeTab === 'Orders' && renderOrders()}
        </AnimatePresence>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[2rem] border-zinc-200 dark:border-zinc-800 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'List New Product'}</DialogTitle>
            <DialogDescription>Synchronize marketplace listings directly with the storefront.</DialogDescription>
          </DialogHeader>
          <form className="space-y-6 py-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input name="name" defaultValue={currentProduct?.name} required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital Product</SelectItem>
                    <SelectItem value="service">Service Package</SelectItem>
                    <SelectItem value="gadget">Gadget / Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tag</Label>
                <Input name="tag" defaultValue={currentProduct?.tag} className="rounded-xl" placeholder="Audio, Fixed Scope, etc." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input name="price" type="number" min="0" defaultValue={currentProduct?.price} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input name="currency" defaultValue={currentProduct?.currency || 'UGX'} required className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={currentProduct?.description} required className="rounded-xl h-24" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input name="image" defaultValue={currentProduct?.image} className="rounded-xl" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock (leave blank if unlimited)</Label>
                <Input name="stock" type="number" min="0" defaultValue={currentProduct?.stock ?? ''} className="rounded-xl" />
              </div>
              <div className="space-y-2 flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name="active" defaultChecked={currentProduct?.active !== false} className="rounded" />
                  Active / visible on storefront
                </label>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="submit" disabled={formLoading} className="w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
