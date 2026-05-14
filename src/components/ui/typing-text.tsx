
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingTextProps {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
}

export function TypingText({ texts, speed = 100, delay = 2000, className }: TypingTextProps) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < texts[index].length) {
      timeout = setTimeout(() => {
        setDisplayText(texts[index].substring(0, displayText.length + 1));
      }, speed);
    } else if (!isDeleting && displayText.length === texts[index].length) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(texts[index].substring(0, displayText.length - 1));
      }, speed / 2);
    } else {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, texts, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-1 h-[0.9em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}
