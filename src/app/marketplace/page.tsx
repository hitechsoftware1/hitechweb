"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag, Plus, Check } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { useCart } from '@/hooks/use-cart';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type MarketplaceProduct = {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'service' | 'gadget';
  price: number;
  currency: string;
  image?: string;
  tag?: string;
  stock?: number;
  active?: boolean;
};

export const CATEGORIES: { id: MarketplaceProduct['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'digital', label: 'Digital Products' },
  { id: 'service', label: 'Service Packages' },
  { id: 'gadget', label: 'Gadgets & Tech' },
];

export const DEFAULT_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'seed-erp-starter-kit',
    name: 'ERP Starter Source Kit',
    description: 'Production-ready Next.js + Firebase ERP boilerplate with auth, billing and admin dashboards included.',
    category: 'digital',
    price: 450000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/0FD6ED?text=ERP+Kit',
    tag: 'Source Code',
  },
  {
    id: 'seed-ui-kit',
    name: 'Glassmorphism UI Kit',
    description: 'A Figma + React component library matching the HITECH design language for fast product builds.',
    category: 'digital',
    price: 180000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/68E1BC?text=UI+Kit',
    tag: 'Design',
  },
  {
    id: 'seed-landing-page',
    name: 'Landing Page Package',
    description: 'A fully designed and deployed single-page marketing site, delivered in 5 business days.',
    category: 'service',
    price: 900000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/0FD6ED?text=Landing+Page',
    tag: 'Fixed Scope',
  },
  {
    id: 'seed-mobile-mvp',
    name: 'Mobile App MVP Package',
    description: 'Cross-platform MVP build (Flutter) with up to 6 screens, backend wiring and app store submission.',
    category: 'service',
    price: 3500000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/68E1BC?text=Mobile+MVP',
    tag: 'Fixed Scope',
  },
  {
    id: 'seed-headphones',
    name: 'HITECH Studio Headphones',
    description: 'Noise-cancelling over-ear headphones, company-branded, ideal for calls and focused work.',
    category: 'gadget',
    price: 320000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/0FD6ED?text=Headphones',
    tag: 'Audio',
  },
  {
    id: 'seed-speaker',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact, high-fidelity Bluetooth speaker with 20-hour battery life.',
    category: 'gadget',
    price: 210000,
    currency: 'UGX',
    image: 'https://placehold.co/800x800/0F1414/68E1BC?text=Speaker',
    tag: 'Audio',
  },
];

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.productId === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      category: product.category,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={`/marketplace/${product.id}`} className="apple-card rounded-[1.5rem] overflow-hidden group flex flex-col h-full">
        <div className="aspect-square relative bg-foreground/5 overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/20"><ShoppingBag className="w-10 h-10" /></div>
          )}
          {product.tag && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/20">
              {product.tag}
            </span>
          )}
        </div>
        <div className="p-4 md:p-5 flex flex-col flex-1">
          <h3 className="text-sm md:text-lg font-headline font-bold text-foreground mb-1 leading-tight">{product.name}</h3>
          <p className="text-[9px] md:text-sm text-foreground/40 font-light leading-relaxed line-clamp-2 mb-4 flex-1">{product.description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs md:text-sm font-bold text-foreground">{formatMoney(product.price, product.currency)}</span>
            <Button
              onClick={handleAdd}
              size="sm"
              className={cn(
                "rounded-full h-8 px-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all",
                justAdded ? "bg-green-500 text-white" : "bg-foreground text-background hover:opacity-90"
              )}
            >
              {justAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {justAdded ? 'Added' : inCart ? 'Add more' : 'Add'}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const db = useFirestore();
  const { data, loading } = useCollection(db ? query(collection(db, 'marketplaceProducts'), orderBy('createdAt', 'desc')) : null);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]['id']>('all');

  const products: MarketplaceProduct[] = useMemo(() => {
    const source = (data && data.length > 0 ? data : DEFAULT_PRODUCTS) as MarketplaceProduct[];
    return source.filter((p) => p.active !== false);
  }, [data]);

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen relative bg-background">
      <Navbar />

      <section className="pt-36 pb-16 lg:pt-44 lg:pb-24 container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mb-4 lg:mb-6 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em] text-center"
          >
            HITECH Marketplace
          </motion.div>
          <h1 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Tech Products, Ready <br className="hidden md:block" /> to Deploy.
          </h1>
          <p className="text-sm lg:text-lg text-foreground/50 font-light leading-relaxed max-w-xl mx-auto">
            Browse digital products, fixed-scope service packages, and company gadgets all in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 lg:mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all border",
                activeCategory === cat.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-foreground/30 italic text-sm">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
