
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

const DEFAULT_POSTS = [
  {
    title: "Why Hitech is Growing Fast",
    excerpt: "Exploring how Joel hitech and the company have grown while helping businesses manage taxes and revenue.",
    content: "HITECH SOFTWARE COMPANY has grown quickly over the past few years by focusing on one thing: helping businesses manage their operations, taxes, and revenue with clean, reliable software. Founder JoelHitech built the company around a simple belief — that great systems, not flashy marketing, are what make businesses trust a technology partner for the long run.\n\nThat philosophy has translated into real growth. HITECH now works with clients across fintech, health, and logistics, delivering everything from custom ERPs to AI-powered tools. As the team scales, the focus remains the same: clean code, secure systems, and software that actually works for the people using it.",
    category: "News",
    author: "NTV Uganda",
    date: "May 13, 2025",
    readTime: "8 min",
    image: "https://i.pinimg.com/736x/36/7c/29/367c291780428a1bfc6ac8d4b45adc25.jpg"
  },
  {
    title: "The Future of Smart Software",
    excerpt: "Looking at how AI and smart systems are changing the way big companies handle their work.",
    content: "Artificial intelligence is no longer a novelty bolted onto existing software — it's becoming the core of how modern businesses operate. From automated customer support to predictive analytics that flag problems before they happen, AI is reshaping what \"good software\" even means.\n\nAt HITECH, we've seen this shift firsthand. Clients aren't just asking for dashboards anymore; they want systems that can reason about their data and suggest next steps. That's the direction the next generation of business software is heading, and it's one HITECH is building for today.",
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
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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
                onClick={() => setSelectedPost(post)}
                className="apple-card group h-full flex flex-col cursor-pointer"
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

      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2rem] max-h-[85vh] flex flex-col">
          {selectedPost && (
            <>
              <div className="aspect-video relative shrink-0">
                <Image src={selectedPost.image} alt={selectedPost.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest">{selectedPost.category}</span>
                </div>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {selectedPost.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {selectedPost.readTime}</span>
                  {selectedPost.date && <span>{selectedPost.date}</span>}
                </div>
                <h2 className="text-2xl lg:text-3xl font-headline font-bold mb-6 text-foreground">{selectedPost.title}</h2>
                <div className="text-foreground/60 font-light leading-relaxed whitespace-pre-line">
                  {selectedPost.content || selectedPost.excerpt}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
