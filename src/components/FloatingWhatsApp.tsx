"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '@/hooks/use-site-config';

export function FloatingWhatsApp() {
  const { config } = useSiteConfig();
  const whatsappNumber = config?.whatsappNumber || '+256 759 408 917';

  return (
    <a
      href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl glow-primary z-50 flex items-center justify-center hover:scale-110 transition-transform bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 duration-300 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
