"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STORAGE_KEY = 'hitech-subscribe-prompt';
const SNOOZE_DAYS = 14;
const SHOW_DELAY_MS = 4000;

function shouldShow() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;
    const { status, until } = JSON.parse(stored);
    if (status === 'subscribed') return false;
    if (status === 'dismissed' && until && Date.now() < until) return false;
    return true;
  } catch {
    return true;
  }
}

function remember(status: 'subscribed' | 'dismissed') {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status,
      until: Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000,
    }));
  } catch {
    // ignore storage errors (private browsing, etc.)
  }
}

export function SubscribePopup() {
  const db = useFirestore();
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!shouldShow()) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setVisible(false);
    if (!submitted) remember('dismissed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !email.trim()) return;
    setLoading(true);

    const data = { email: email.trim(), source: 'popup', createdAt: serverTimestamp() };
    try {
      await addDoc(collection(db, 'subscribers'), data);
      remember('subscribed');
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2200);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'subscribers',
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="apple-glass relative w-full max-w-md rounded-[2rem] p-8 lg:p-10 border-foreground/10 shadow-2xl pointer-events-auto">
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 text-foreground/40"
              >
                <X className="w-4 h-4" />
              </button>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                    <CheckCircle2 className="text-primary w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-2 text-foreground">You're subscribed.</h3>
                  <p className="text-foreground/50 text-sm">We'll send you our latest news and updates.</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 overflow-hidden border border-black/5 shadow-sm">
                    {logo ? (
                      <Image src={logo.imageUrl} alt="HITECH Logo" width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-2 text-foreground">Stay in the loop.</h3>
                  <p className="text-foreground/50 text-sm mb-8 leading-relaxed">
                    Subscribe for product updates, marketplace drops, and news from HITECH.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="h-12 pl-11 rounded-xl bg-foreground/5 border-foreground/10"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-foreground text-background hover:opacity-90 font-bold">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                    </Button>
                  </form>
                  <button onClick={close} className="w-full text-center text-[11px] font-medium text-foreground/30 hover:text-foreground/50 mt-4">
                    No thanks, maybe later
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
