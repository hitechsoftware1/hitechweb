"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Sun, Moon, LayoutDashboard, Terminal, Briefcase, Zap, BarChart3, ChevronDown, Info, MessageSquare, Star, Newspaper, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
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
    { name: 'Solutions', href: '/services', icon: Zap },
    { name: 'Portfolio', href: '/portfolio', icon: BarChart3 },
    { name: 'Status', href: '/status', icon: Terminal },
  ];

  const resourceLinks = [
    { name: 'AI Studio', href: '/ai-studio', icon: Sparkles },
    { name: 'Engineering Team', href: '/team', icon: Users },
    { name: 'Testimonials', href: '/testimonials', icon: Star },
    { name: 'Insights', href: '/blog', icon: Newspaper },
    { name: 'Careers', href: '/careers', icon: Briefcase },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 lg:px-6 py-4 lg:py-6">
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between transition-all duration-700 px-4 lg:px-8 py-2 lg:py-3 rounded-full",
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
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2",
                pathname === link.href ? "text-primary" : "text-foreground/40 hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Use mounted state to prevent hydration ID mismatch on DropdownMenu */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5 focus:outline-none">
                Resources <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="apple-glass border-foreground/10 rounded-2xl p-2 min-w-[200px]">
                {resourceLinks.map((res) => (
                  <DropdownMenuItem key={res.name} asChild className="rounded-xl focus:bg-primary/10 focus:text-primary p-0">
                    <Link href={res.href} className="flex items-center gap-3 w-full px-4 py-3">
                      <res.icon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{res.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground/60"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {user && (
            <Button asChild variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 text-primary font-bold text-xs h-10 px-6">
              <Link href="/staff" className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Staff
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 text-primary font-bold text-xs h-10 px-6">
            <Link href="/portal" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Portal
            </Link>
          </Button>

          <Button asChild className="rounded-full px-6 h-10 bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all cursor-pointer">
            <Link href="/request-project">Get Started</Link>
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
            className="absolute top-24 left-4 right-4 apple-glass rounded-[1.5rem] p-6 flex flex-col gap-4 md:hidden overflow-hidden"
          >
            {[...navLinks, ...resourceLinks].map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-lg font-headline font-medium hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5 text-primary" />
                  {link.name}
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
            <Link 
              href="/portal"
              className="text-lg font-headline font-medium text-primary flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Client Portal
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            {user && (
              <Link 
                href="/staff"
                className="text-lg font-headline font-medium text-accent flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Staff Portal
                <ShieldCheck className="w-5 h-5" />
              </Link>
            )}
            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <Button asChild className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/request-project">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
