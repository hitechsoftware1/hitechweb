
"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Tag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const posts = [
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
  },
  {
    title: "New Standards for Online Safety",
    excerpt: "Why old ways of keeping data safe don't work anymore and how we protect your business today.",
    category: "Safety",
    author: "Team",
    date: "March 08, 2024",
    readTime: "6 min",
    image: "https://i.pinimg.com/1200x/1b/7b/b0/1b7bb0b1d65c769b9dc94a7e5476ecb6.jpg"
  },
  {
    title: "Going Digital in Today's Market",
    excerpt: "How to easily use mobile money and international payments to grow your business online.",
    category: "Payments",
    author: "Finance Lead",
    date: "February 28, 2024",
    readTime: "12 min",
    image: "https://i.pinimg.com/736x/3c/13/f2/3c13f278cc5432b3268c7e11d0920456.jpg"
  },
  {
    title: "Tools for Smart Business Owners",
    excerpt: "New tools that help business owners make more money faster and with less manual work.",
    category: "Business",
    author: "Tech Lead",
    date: "February 28, 2026",
    readTime: "12 min",
    image: "https://i.pinimg.com/736x/d2/5a/b9/d25ab9eca57e8b0ccd20e9d2ba4da7dd.jpg"
  },
  {
    title: "Everything About Adobe Design",
    excerpt: "A simple guide to the best tools for making great designs for your brand.",
    category: "Design",
    author: "Design Lead",
    date: "June 12, 2026",
    readTime: "12 min",
    image: "https://i.pinimg.com/736x/81/e5/76/81e576777c288f5e0584e439cb6759af.jpg"
  },
   {
    title: "How to Use AI the Right Way",
    excerpt: "AI isn't the problem, it's how you use it. Learn the best strategy for your business.",
    category: "Strategy",
    author: "Team",
    date: "May 30, 2026",
    readTime: "12 min",
    image: "https://i.pinimg.com/736x/2b/b0/f0/2bb0f03cb67fbdcc3c99294a4c453bc3.jpg"
  }
];

export default function BlogPage() {
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
            Insights.
          </h1>
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
            Guides, news, and our thoughts on the future of business technology.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
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

      <Footer />
    </main>
  );
}
