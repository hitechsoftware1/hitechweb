
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Smartphone, Brain, Cloud, Shield, CreditCard, Layout, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const ICON_MAP: Record<string, any> = {
  'Cpu': Cpu,
  'Globe': Globe,
  'Smartphone': Smartphone,
  'Brain': Brain,
  'Cloud': Cloud,
  'Shield': Shield,
  'CreditCard': CreditCard,
  'Layout': Layout,
  'Zap': Zap
};

const DEFAULT_SERVICES = [
  { title: "Business Software", description: "Custom tools that help you manage your business easily every day.", icon: "Cpu", tag: "Software", href: "/services" },
  { title: "Websites", description: "High-quality websites and stores that look great on phones and computers.", icon: "Globe", tag: "Online", href: "/portfolio" },
  { title: "Mobile Apps", description: "Fast apps for iPhone and Android that your users will love.", icon: "Smartphone", tag: "Mobile", href: "/mobile-apps" },
  { title: "Smart AI", description: "Intelligent chatbots that help you work faster and answer customers.", icon: "Brain", tag: "AI Tools", href: "/ai-tools" },
  { title: "Cloud Hosting", description: "Safe and reliable hosting so your app is always online and ready.", icon: "Cloud", tag: "Hosting", href: "/services" },
  { title: "Security", description: "Modern safety tools to keep your data and users safe from threats.", icon: "Shield", tag: "Safety", href: "/services" }
];

export function Services() {
  const db = useFirestore();
  const { data: managedServices, loading } = useCollection(db ? query(collection(db, 'services'), orderBy('createdAt', 'asc')) : null);

  const displayServices = managedServices && managedServices.length > 0 ? managedServices : DEFAULT_SERVICES;

  return (
    <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mb-12 lg:mb-20 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 lg:mb-6 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em] justify-center"
          >
            <div className="w-6 lg:w-8 h-[1px] bg-primary" />
            Our Services
          </motion.div>
          <h2 className="text-3xl lg:text-5xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Digital Solutions <br className="hidden md:block" />
            for Business.
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {displayServices.map((service: any, idx: number) => {
              const IconComp = ICON_MAP[service.icon] || Cpu;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Link href={service.href || '/request-project'} className="apple-card p-4 md:p-10 group flex flex-col justify-between h-full hover:border-primary/30 transition-all duration-500 block">
                    <div>
                      <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 md:mb-8 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground text-foreground">
                        <IconComp className="w-4 h-4 md:w-6 md:h-6" />
                      </div>
                      <div className="mb-1 md:mb-4">
                        <span className="text-[7px] md:text-[10px] font-bold text-primary uppercase tracking-widest">{service.tag}</span>
                      </div>
                      <h3 className="text-sm md:text-2xl font-headline font-bold text-foreground mb-2 md:mb-4 leading-tight">{service.title}</h3>
                      <p className="text-[9px] md:text-sm text-foreground/40 leading-relaxed font-light line-clamp-3 md:line-clamp-none mb-6">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
