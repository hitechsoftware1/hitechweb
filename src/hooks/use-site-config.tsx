"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';

export type SiteConfig = {
  heroHeadline?: string;
  heroSubtext?: string;
  heroImage?: string;
  heroImages?: string;
  contactAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  footerTagline?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  socialGithub?: string;
  founderName?: string;
  founderTitle?: string;
  founderQuote?: string;
  founderImage?: string;
  missionText?: string;
  standardText?: string;
};

type SiteConfigContextType = { config: SiteConfig | null; loading: boolean };

const SiteConfigContext = createContext<SiteConfigContextType>({ config: null, loading: true });

/**
 * Opens exactly one Firestore listener for siteConfig/main for the whole
 * app (mounted once in layout.tsx). Every page used to call useSiteConfig()
 * independently — Hero, Footer, Contact and FloatingWhatsApp alone opened
 * four separate listeners to the identical document on every page load.
 */
export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const db = useFirestore();
  const ref = useMemo(() => (db ? doc(db, 'siteConfig', 'main') : null), [db]);
  const { data, loading } = useDoc(ref);
  const value = useMemo(() => ({ config: (data || null) as SiteConfig | null, loading }), [data, loading]);

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

/**
 * Reads the single site-wide content doc (Firestore: siteConfig/main),
 * editable from admin Web Management > Global Config. Every caller applies
 * its own fallback default (e.g. `config?.heroHeadline || 'Building'`), so
 * the site renders its original hardcoded copy until an admin fills a
 * field in — nothing here can blank out existing page content.
 */
export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
