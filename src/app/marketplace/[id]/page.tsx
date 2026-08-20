"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';
import { useCart } from '@/hooks/use-cart';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DEFAULT_PRODUCTS, type MarketplaceProduct } from '../page';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const db = useFirestore();
  const productRef = db ? doc(db, 'marketplaceProducts', params.id) : null;
  const { data: fetched, loading } = useDoc(productRef);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const product = (fetched || DEFAULT_PRODUCTS.find((p) => p.id === params.id)) as MarketplaceProduct | undefined;

  const gallery = product
    ? Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean))) as string[]
    : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 pb-24 text-center container mx-auto px-4">
          <p className="text-foreground/40 mb-6">This product could not be found.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/marketplace/checkout');
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 lg:pt-40 container mx-auto px-4 lg:px-6">
        <button onClick={() => router.push('/marketplace')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground mb-8 lg:mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-foreground/5 apple-card">
              {gallery.length > 0 ? (
                <Image src={gallery[activeImage] || gallery[0]} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/20"><ShoppingBag className="w-16 h-16" /></div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={img + idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                      activeImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {product.tag && (
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">{product.tag}</span>
            )}
            <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl lg:text-3xl font-headline font-bold text-primary mb-8">{formatMoney(product.price, product.currency)}</p>
            <p className="text-sm lg:text-base text-foreground/50 font-light leading-relaxed mb-10">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-foreground/10 hover:bg-foreground/5 font-bold text-sm"
              >
                {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
                {added ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-14 rounded-2xl bg-foreground text-background hover:opacity-90 font-bold text-sm"
              >
                Buy Now
              </Button>
            </div>

            <p className="text-[10px] text-foreground/30 font-medium uppercase tracking-widest mt-6">
              Pay via Mobile Money or bank transfer at checkout. Your order is verified by our team before fulfillment.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
