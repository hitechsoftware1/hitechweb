"use client";

import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';

export type SiteConfig = {
  heroHeadline?: string;
  heroSubtext?: string;
  heroImage?: string;
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

/**
 * Reads the single site-wide content doc (Firestore: siteConfig/main),
 * editable from admin Web Management > Global Config. Every caller applies
 * its own fallback default (e.g. `config?.heroHeadline || 'Building'`), so
 * the site renders its original hardcoded copy until an admin fills a
 * field in — nothing here can blank out existing page content.
 */
export function useSiteConfig() {
  const db = useFirestore();
  const ref = useMemo(() => (db ? doc(db, 'siteConfig', 'main') : null), [db]);
  const { data, loading } = useDoc(ref);
  return { config: (data || null) as SiteConfig | null, loading };
}
