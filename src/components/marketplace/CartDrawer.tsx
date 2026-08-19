"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, totalAmount } = useCart();
  const currency = items[0]?.currency || 'UGX';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background border-l border-foreground/10 z-[201] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-bold text-lg text-foreground">Your Cart</h3>
              </div>
              <button onClick={closeCart} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-foreground/5 text-foreground/50">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/30 gap-3 py-20">
                  <ShoppingBag className="w-10 h-10" />
                  <p className="text-sm font-medium">Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-4 apple-card rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-foreground/5 shrink-0 relative">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/20"><ShoppingBag className="w-5 h-5" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-foreground/40 font-medium mb-2">{formatMoney(item.price, item.currency)}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 text-foreground">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-foreground">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 text-foreground">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.productId)} className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-foreground/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Total</span>
                  <span className="text-xl font-headline font-bold text-foreground">{formatMoney(totalAmount, currency)}</span>
                </div>
                <Button asChild className="w-full h-12 rounded-xl bg-foreground text-background hover:opacity-90 font-bold" onClick={closeCart}>
                  <Link href="/marketplace/checkout">Checkout</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
