import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { MobileNav } from '@/components/layout/MobileNav';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HITECH | Intelligent Software Systems',
  description: 'Clean, futuristic digital solutions for the next generation of enterprises.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HITECH',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#00A3FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="https://i.pinimg.com/736x/34/f8/10/34f81022af3da1b3d60d0fa4315de706.jpg" />
        <link rel="apple-touch-icon" href="https://i.pinimg.com/736x/34/f8/10/34f81022af3da1b3d60d0fa4315de706.jpg" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary-foreground pb-24 md:pb-0">
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          {children}
          <MobileNav />
          <Toaster />
        </FirebaseClientProvider>
        
        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('HITECH Neural Core: ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                  console.log('HITECH Neural Core: ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
