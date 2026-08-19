"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, ShoppingBag, Smartphone, Landmark } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function MarketplaceCheckoutPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { items, totalAmount, clear } = useCart();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'bank_transfer'>('mobile_money');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    transactionRef: '',
    notes: '',
  });

  const currency = items[0]?.currency || 'UGX';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || items.length === 0) return;
    setLoading(true);

    const orderData = {
      userId: user?.uid || null,
      items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, category: i.category })),
      totalAmount,
      currency,
      customerName: form.fullName,
      customerEmail: form.email,
      customerPhone: form.phoneNumber,
      paymentMethod,
      transactionRef: form.transactionRef,
      notes: form.notes,
      status: 'pending_verification',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'marketplaceOrders'), orderData);

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Marketplace Order',
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          items: items.map((i) => `${i.name} x${i.qty}`).join(', '),
          totalAmount: formatMoney(totalAmount, currency),
          paymentMethod,
          transactionRef: form.transactionRef,
        }),
      });

      setSubmitted(true);
      clear();
      toast({ title: 'Order received.', description: "We'll verify your payment and confirm shortly." });
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'marketplaceOrders',
        operation: 'create',
        requestResourceData: orderData,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: 'destructive', title: 'Something went wrong', description: 'Please try again or contact us directly.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-24 container mx-auto px-4 text-center max-w-lg">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <CheckCircle2 className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-headline font-bold mb-4 text-foreground">Order Received.</h1>
          <p className="text-foreground/50 text-sm lg:text-base mb-10">
            Thank you. Our team will verify your payment reference and confirm your order shortly, usually within a few hours.
          </p>
          <Button asChild className="rounded-full h-12 px-8 bg-foreground text-background font-bold">
            <Link href="/marketplace">Continue Browsing</Link>
          </Button>
        </section>
        <Footer />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-24 container mx-auto px-4 text-center max-w-lg">
          <ShoppingBag className="w-10 h-10 text-foreground/20 mx-auto mb-6" />
          <p className="text-foreground/40 mb-8">Your cart is empty.</p>
          <Button asChild variant="outline" className="rounded-full h-12 px-8">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 lg:pt-40 container mx-auto px-4 lg:px-6">
        <Link href="/marketplace" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground mb-8 lg:mb-12 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-10 lg:gap-16 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl lg:text-3xl font-headline font-bold text-foreground mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Your Details</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Full Name</Label>
                    <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-12 rounded-xl bg-foreground/5 border-foreground/10" placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Email</Label>
                      <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 rounded-xl bg-foreground/5 border-foreground/10" placeholder="email@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Phone Number</Label>
                      <Input type="tel" required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="h-12 rounded-xl bg-foreground/5 border-foreground/10" placeholder="+256 ..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all",
                      paymentMethod === 'mobile_money' ? "border-primary bg-primary/5 text-primary" : "border-foreground/10 text-foreground/50 hover:border-foreground/20"
                    )}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs font-bold">Mobile Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all",
                      paymentMethod === 'bank_transfer' ? "border-primary bg-primary/5 text-primary" : "border-foreground/10 text-foreground/50 hover:border-foreground/20"
                    )}
                  >
                    <Landmark className="w-5 h-5" />
                    <span className="text-xs font-bold">Bank Transfer</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/10 text-xs text-foreground/60 leading-relaxed">
                  {paymentMethod === 'mobile_money' ? (
                    <>Send <span className="font-bold text-foreground">{formatMoney(totalAmount, currency)}</span> via Mobile Money to <span className="font-bold text-foreground">+256 759 408 917</span> (HITECH SOFTWARE COMPANY), then enter the transaction reference below.</>
                  ) : (
                    <>Contact us on <a href="https://wa.me/256759408917" target="_blank" rel="noopener noreferrer" className="font-bold text-primary">WhatsApp</a> or <span className="font-bold text-foreground">+256 742 928 508</span> to receive our bank account details, then enter your transfer reference below.</>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Transaction Reference</Label>
                  <Input required value={form.transactionRef} onChange={(e) => setForm({ ...form, transactionRef: e.target.value })} className="h-12 rounded-xl bg-foreground/5 border-foreground/10" placeholder="e.g. MM240918.1245.A00123" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Notes (optional)</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-xl bg-foreground/5 border-foreground/10 h-24" placeholder="Delivery address, preferences, etc." />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-foreground text-background hover:opacity-90 font-bold text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Order for Verification
              </Button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="apple-card rounded-[2rem] p-6 lg:p-8 h-fit">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-foreground/70">{item.name} <span className="text-foreground/30">x{item.qty}</span></span>
                  <span className="font-bold text-foreground">{formatMoney(item.price * item.qty, item.currency)}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-foreground/10 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Total</span>
              <span className="text-xl font-headline font-bold text-foreground">{formatMoney(totalAmount, currency)}</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
