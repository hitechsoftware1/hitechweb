"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Footer() {
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const gmailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=hitechsoftware03@gmail.com";

  return (
    <footer className="bg-background pt-16 lg:pt-32 pb-8 lg:pb-16 border-t border-foreground/5">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12 lg:mb-24">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-black/5">
                {logo ? (
                  <Image 
                    src={logo.imageUrl} 
                    alt="HITECH Logo" 
                    width={32} 
                    height={32} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-primary" />
                )}
              </div>
              <span className="font-headline font-bold text-xl tracking-tight text-foreground">HITECH</span>
            </div>
            <p className="text-foreground/40 text-xs lg:text-sm leading-relaxed font-light mb-8 max-w-xs">
              Precision engineered software systems for companies defining the future.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mb-6 lg:mb-8">Solutions</h4>
              <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-foreground/50 font-light">
                <li><Link href="/mobile-apps" className="hover:text-primary transition-colors">Mobile apps</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">AI & Intelligence</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Digital Platforms</Link></li>
                <li><Link href="/portfolio" className="hover:text-primary transition-colors">Project Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mb-6 lg:mb-8">Company</h4>
              <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-foreground/50 font-light">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/team" className="hover:text-primary transition-colors">Engineering Team</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/ai-studio" className="hover:text-primary transition-colors">AI Studio</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mb-6 lg:mb-8">Contact</h4>
            <p className="text-foreground/50 text-xs lg:text-sm font-light mb-1">Naalya Kampala, Uganda</p>
            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="text-foreground/50 text-xs lg:text-sm font-light mb-1 block hover:text-primary transition-colors">hitechsoftware03@gmail.com</a>
            <a href="tel:+256742928508" className="text-foreground/50 text-xs lg:text-sm font-light mb-1 block hover:text-primary transition-colors">+256 742 928 508</a>
            <a href="https://wa.me/256759408917" target="_blank" rel="noopener noreferrer" className="text-foreground/50 text-xs lg:text-sm font-light block hover:text-primary transition-colors">WA: +256 759 408 917</a>
          </div>
        </div>

        <div className="pt-8 lg:pt-16 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] lg:text-[10px] font-bold text-foreground/20 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} HITECH SOFTWARE COMPANY.
          </p>
          <div className="flex gap-4 lg:gap-8 text-[9px] lg:text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/status" className="hover:text-primary transition-colors">System Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
