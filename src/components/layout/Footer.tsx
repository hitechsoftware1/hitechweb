"use client";

import React from 'react';
import Link from 'next/link';
import { Box, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background pt-32 pb-16 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <Box className="text-white w-6 h-6" />
              <span className="font-headline font-bold text-xl tracking-tight">HITECH</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-light mb-8 max-w-xs">
              Precision engineered software systems for companies defining the future.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-background transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-background transition-all">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-background transition-all">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-8">Solutions</h4>
              <ul className="space-y-4 text-sm text-white/50 font-light">
                <li><Link href="#" className="hover:text-white transition-colors">Cloud Architecture</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">AI & Intelligence</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Digital Platforms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">R&D Studio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-8">Company</h4>
              <ul className="space-y-4 text-sm text-white/50 font-light">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Engineering</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Newsroom</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-8">Contact</h4>
            <p className="text-white/50 text-sm font-light mb-4">San Francisco, California</p>
            <p className="text-white/50 text-sm font-light mb-4">hello@hitech.software</p>
            <p className="text-white/50 text-sm font-light">+1 (800) HITECH-01</p>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © {new Date().getFullYear()} HITECH SOFTWARE COMPANY.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}