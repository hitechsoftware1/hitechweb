"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Cloud, Brain, Smartphone, Shield, Zap, Globe, CreditCard, Layout } from 'lucide-react';

const services = [
  {
    title: "Enterprise Software",
    description: "Custom ERP, CRM, and automation systems engineered for operational excellence.",
    icon: Cpu,
    tag: "Core Systems"
  },
  {
    title: "Digital Platforms",
    description: "Premium business, e-commerce, and portfolio ecosystems with global reach.",
    icon: Globe,
    tag: "Presence"
  },
  {
    title: "Mobile Mobility",
    description: "Native iOS and Android experiences refined for the palm of your hand.",
    icon: Smartphone,
    tag: "Refined"
  },
  {
    title: "Artificial Intelligence",
    description: "Neural chatbots and predictive analytics that automate complex enterprise logic.",
    icon: Brain,
    tag: "Intelligence"
  },
  {
    title: "Cloud Infrastructure",
    description: "Elastic, high-availability architecture and VPS management for global scale.",
    icon: Cloud,
    tag: "Scale"
  },
  {
    title: "Cybersecurity Core",
    description: "Zero-trust protocols and secure authentication to protect critical assets.",
    icon: Shield,
    tag: "Protected"
  },
  {
    title: "Financial Systems",
    description: "Seamless Mobile Money, PayPal, and Stripe integrations for global commerce.",
    icon: CreditCard,
    tag: "Commerce"
  },
  {
    title: "Experience Design",
    description: "Modern UI/UX and brand identity systems built for the next generation.",
    icon: Layout,
    tag: "Aesthetic"
  },
  {
    title: "Strategic R&D",
    description: "Future-proofing stacks with IoT, Blockchain, and real-time API systems.",
    icon: Zap,
    tag: "Innovation"
  }
];

export function Services() {
  return (
    <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 lg:mb-6 text-primary text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            <div className="w-6 lg:w-8 h-[1px] bg-primary" />
            Capabilities
          </motion.div>
          <h2 className="text-3xl lg:text-7xl font-headline font-bold text-gradient-apple mb-4 lg:mb-8 tracking-tight leading-tight">
            Designed for <br />
            Performance.
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
              className="apple-card p-4 md:p-10 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white/5 flex items-center justify-center mb-4 md:mb-8 transition-all duration-500 group-hover:bg-white group-hover:text-background">
                  <service.icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div className="mb-1 md:mb-4">
                  <span className="text-[7px] md:text-[10px] font-bold text-primary uppercase tracking-widest">{service.tag}</span>
                </div>
                <h3 className="text-sm md:text-2xl font-headline font-bold text-white mb-2 md:mb-4 leading-tight">{service.title}</h3>
              </div>
              <p className="text-[9px] md:text-sm text-white/40 leading-relaxed font-light line-clamp-3 md:line-clamp-none">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
