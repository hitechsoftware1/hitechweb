"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Sparkles, Briefcase, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Solutions', href: '/services', icon: Zap },
    { name: 'Market', href: '/marketplace', icon: ShoppingBag },
    { name: 'Studio', href: '/ai-studio', icon: Sparkles },
    { name: 'Portal', href: '/portal', icon: LayoutDashboard },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100]">
      <div className="apple-glass rounded-full px-6 py-3 flex justify-between items-center shadow-2xl border-white/10 dark:border-white/5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-foreground/40 hover:text-foreground/60"
              )}
            >
              <link.icon className={cn("w-5 h-5 transition-transform", isActive ? "fill-primary/10" : "group-hover:scale-110")} />
              <span className="text-[8px] font-bold uppercase tracking-tighter">{link.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabMobile"
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
