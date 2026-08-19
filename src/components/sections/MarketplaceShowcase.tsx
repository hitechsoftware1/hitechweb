
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { DEFAULT_PRODUCTS, type MarketplaceProduct } from '@/app/marketplace/page';
import { cn } from '@/lib/utils';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export function MarketplaceShowcase() {
  const db = useFirestore();
  const { data } = useCollection(
    db ? query(collection(db, 'marketplaceProducts'), orderBy('createdAt', 'desc'), limit(8)) : null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const products: MarketplaceProduct[] = useMemo(() => {
    const source = (data && data.length > 0 ? data : DEFAULT_PRODUCTS) as MarketplaceProduct[];
    return source.filter((p) => p.active !== false);
  }, [data]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section id="marketplace" className="py-12 lg:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 lg:mb-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-4 lg:mb-6 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em]"
            >
              HITECH Marketplace
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-6 tracking-tight leading-tight">
              Shop Tech, Ready <br className="hidden md:block" /> to Deploy.
            </h2>
            <p className="text-sm lg:text-lg text-foreground/50 font-light leading-relaxed">
              Digital products, fixed-scope service packages, and gadgets, all in one storefront ready to check out in minutes.
            </p>
          </div>
          <Button asChild className="rounded-full h-12 lg:h-14 px-8 bg-foreground text-background hover:opacity-90 font-bold text-sm shrink-0 w-fit">
            <Link href="/marketplace" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Visit Marketplace
            </Link>
          </Button>
        </div>

        <Carousel
          setApi={setApi}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 lg:-ml-6">
            {products.map((product, idx) => (
              <CarouselItem key={product.id} className="pl-4 lg:pl-6 basis-[78%] sm:basis-[45%] lg:basis-[30%]">
                <motion.div
                  animate={{
                    scale: current === idx ? 1 : 0.94,
                    opacity: current === idx ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.5 }}
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
                    <div className="p-4 md:p-6 flex flex-col flex-1">
                      <h3 className="text-sm md:text-lg font-headline font-bold text-foreground mb-1 leading-tight">{product.name}</h3>
                      <p className="text-[9px] md:text-sm text-foreground/40 font-light leading-relaxed line-clamp-2 mb-4 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs md:text-sm font-bold text-foreground">{formatMoney(product.price, product.currency)}</span>
                        <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          View <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-6" />
          <CarouselNext className="hidden lg:flex -right-6" />
        </Carousel>

        <div className="flex justify-center gap-2 mt-8 lg:mt-12">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                current === idx ? "w-8 bg-primary" : "w-2 bg-foreground/10"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
