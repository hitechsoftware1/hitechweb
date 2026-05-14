
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Cpu, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#services' },
    { name: 'Showcase', href: '#portfolio' },
    { name: 'AI Core', href: '#ai-consultant' },
    { name: 'Investment', href: '#pricing' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-6",
        isScrolled ? "bg-background/40 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center glow-primary transition-all duration-700 group-hover:rotate-[360deg] animate-gradient-x">
            <Cpu className="text-primary-foreground w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-2xl tracking-tighter text-gradient-primary">
              HITECH
            </span>
            <span className="text-[8px] font-bold tracking-[0.4em] text-primary/70 uppercase -mt-1">
              Software Systems
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 bg-white/5 border border-white/10 px-8 py-3 rounded-full glass-morphism">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white">Log Systems</Button>
          <Button className="rounded-full px-8 h-12 glow-primary bg-primary text-primary-foreground font-black tracking-widest text-xs hover:scale-105 transition-all">
            CORE ACCESS <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-3xl border-b border-white/10 p-10 flex flex-col gap-8 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-2xl font-headline font-bold hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <Zap className="w-5 h-5 opacity-0 group-hover:opacity-100 text-primary transition-all" />
              </Link>
            ))}
            <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
              <Button className="w-full h-14 rounded-2xl glow-primary bg-primary text-primary-foreground font-black text-sm">INITIALIZE CORE</Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 glass-morphism">SYSTEM STATUS</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
