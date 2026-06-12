"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Smartphone, Brain, Cloud, Shield, CreditCard, Layout, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Business Software",
    description: "Custom ERP, CRM, and tools designed to make your daily work easier.",
    icon: Cpu,
    tag: "Core Tools",
    href: "/services"
  },
  {
    title: "Web Platforms",
    description: "High-quality websites and e-commerce stores that look great on any device.",
    icon: Globe,
    tag: "Online Presence",
    href: "/portfolio"
  },
  {
    title: "Mobile Apps",
    description: "Fast and easy-to-use apps for iPhone and Android devices.",
    icon: Smartphone,
    tag: "Mobile First",
    href: "/mobile-apps"
  },
  {
    title: "Smart AI Systems",
    description: "Intelligent chatbots and tools that help automate your business tasks.",
    icon: Brain,
    tag: "AI Powered",
    href: "/ai-tools"
  },
  {
    title: "Cloud & Hosting",
    description: "Secure and reliable hosting to make sure your app is always online.",
    icon: Cloud,
    tag: "Safe & Scalable",
    href: "/services"
  },
  {
    title: "Security & Safety",
    description: "Advanced protection to keep your data and your users safe.",
    icon: Shield,
    tag: "Protected",
    href: "/services"
  },
  {
    title: "Payment Systems",
    description: "Easy integration for Mobile Money, PayPal, and credit card payments.",
    icon: CreditCard,
    tag: "Easy Payments",
    href: "/portfolio"
  },
  {
    title: "Modern Design",
    description: "Beautiful and simple user interfaces that people love to use.",
    icon: Layout,
    tag: "User Friendly",
    href: "/portfolio"
  },
  {
    title: "Innovation Lab",
    description: "Future-ready technology like IoT and real-time data tracking.",
    icon: Zap,
    tag: "New Tech",
    href: "/ai-studio"
  }
];

export function Services() {
  return (
    <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mb-12 lg:mb-20 text-center md:text-left mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 lg:mb-6 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em] justify-center md:justify-start"
          >
            <div className="w-6 lg:w-8 h-[1px] bg-primary" />
            Our Services
          </motion.div>
          <h2 className="text-3xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Custom Solutions <br className="hidden md:block" />
            for You.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Link href={service.href} className="apple-card p-4 md:p-10 group flex flex-col justify-between h-full hover:border-primary/30 transition-all duration-500 block">
                <div>
                  <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 md:mb-8 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground text-foreground">
                    <service.icon className="w-4 h-4 md:w-6 md:h-6" />
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
          ))}
        </div>
      </div>
    </section>
  );
}
