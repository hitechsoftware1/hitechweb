
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const DEFAULT_POSTS = [
  {
    title: "Why Hitech is Growing Fast",
    excerpt: "Exploring how Joel hitech and the company have grown while helping businesses manage taxes and revenue.",
    category: "News",
    author: "NTV Uganda",
    date: "May 13, 2025",
    readTime: "8 min",
    image: "https://i.pinimg.com/736x/36/7c/29/367c291780428a1bfc6ac8d4b45adc25.jpg"
  },
  {
    title: "The Future of Smart Software",
    excerpt: "Looking at how AI and smart systems are changing the way big companies handle their work.",
    category: "AI",
    author: "Pulse.ug",
    date: "March 12, 2024",
    readTime: "8 min",
    image: "https://i.pinimg.com/736x/e5/56/35/e556356cd4b9c7d6dd7018da65c5eefc.jpg"
  }
];

export default function BlogPage() {
  const db = useFirestore();
  const { data: managedNews, loading } = useCollection(db ? query(collection(db, 'news'), orderBy('createdAt', 'desc')) : null);

  const posts = managedNews && managedNews.length > 0 ? managedNews : DEFAULT_POSTS;

  return (
    <main className="min-h-screen bg-background pt-32">
      <Navbar />
      
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Knowledge Base</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline font-bold text-gradient-apple mb-8 tracking-tight">
            News & Blog.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            Guides, news, and our thoughts on the future of business technology.
          </p>
        </motion.div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-32">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="apple-card group h-full flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest">{post.category}</span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-foreground/50 font-light leading-relaxed mb-8 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <Button variant="link" className="p-0 text-primary font-bold group-hover:translate-x-2 transition-transform">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
