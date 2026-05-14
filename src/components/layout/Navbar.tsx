"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Box, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#services' },
    { name: 'Showcase', href: '#portfolio' },
    { name: 'Studio', href: '#ai-consultant' },
    { name: 'Investment', href: '#pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-8">
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between transition-all duration-700 px-8 py-3 rounded-full",
        isScrolled ? "apple-glass" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-105">
            <Box className="text-background w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">
            HITECH
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-medium tracking-tight text-white/60 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-xs font-medium text-white/60 hover:text-white">
            Support
          </Button>
          <Button className="rounded-full px-6 h-10 bg-white text-background font-bold text-xs hover:bg-white/90 transition-all">
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 apple-glass rounded-[2rem] p-8 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-xl font-headline font-medium hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
            <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
              <Button className="w-full h-12 rounded-2xl bg-white text-background font-bold">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}