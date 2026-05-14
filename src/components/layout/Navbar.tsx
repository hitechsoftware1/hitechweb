"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navLinks = [
    { name: 'Solutions', href: '#services' },
    { name: 'Showcase', href: '#portfolio' },
    { name: 'Studio', href: '#ai-consultant' },
    { name: 'Investment', href: '#pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 lg:px-6 py-4 lg:py-8">
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between transition-all duration-700 px-4 lg:px-8 py-2 lg:py-3 rounded-full",
        isScrolled ? "apple-glass" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2 lg:gap-3 group">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-105 overflow-hidden border border-black/5">
            {logo ? (
              <Image 
                src={logo.imageUrl} 
                alt="HITECH Logo" 
                width={40} 
                height={40} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-primary" />
            )}
          </div>
          <span className="font-headline font-bold text-base lg:text-xl tracking-tight text-foreground">
            HITECH
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-medium tracking-tight text-foreground/60 hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground/60"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button variant="ghost" className="text-xs font-medium text-foreground/60 hover:text-foreground">
            Support
          </Button>
          <Button className="rounded-full px-6 h-10 bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all">
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
           <button 
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            className="text-foreground w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 apple-glass rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 flex flex-col gap-4 lg:gap-6 md:hidden overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-lg lg:text-xl font-headline font-medium hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
            <div className="pt-4 lg:pt-6 border-t border-black/5 dark:border-white/5 flex flex-col gap-3">
              <Button className="w-full h-11 lg:h-12 rounded-xl lg:rounded-2xl bg-foreground text-background font-bold text-sm">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}