
"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Cpu className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tighter">HITECH</span>
            </Link>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Precision engineering for the next wave of digital transformation. We build software that scales as fast as your ambition.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 col-span-1 lg:col-span-2 gap-8">
            <div>
              <h4 className="font-headline font-bold mb-6 uppercase text-xs tracking-widest text-primary">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Our Process</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Team Leaders</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 uppercase text-xs tracking-widest text-primary">Services</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Cloud Architecture</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">AI & ML Solutions</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Web Development</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Mobile Platforms</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-headline font-bold mb-6 uppercase text-xs tracking-widest text-primary">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-6">Get technical insights and company updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input className="bg-white/5 border-white/10 h-12" placeholder="Email address" />
              <Button className="w-12 h-12 p-0 rounded-lg glow-primary">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HITECH SOFTWARE COMPANY. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
