"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  category: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = 'hitech-marketplace-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore corrupt local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'qty'>, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => i.productId === item.productId ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => i.productId === productId ? { ...i, qty } : i);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalItems,
      totalAmount,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
