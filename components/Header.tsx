'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center py-6 sm:py-8 md:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="hidden sm:block"
          >
            <Sparkles className="text-soft-gold" size={32} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-christmas-red via-blush-pink to-soft-gold bg-clip-text text-transparent">
            Skriiiiki Kalender
          </h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="hidden sm:block"
          >
            <Heart className="text-soft-red fill-soft-red" size={32} />
          </motion.div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-cute px-2">
          Jeden Tag eine kleine Überraschung
        </p>
      </motion.div>
    </header>
  );
}

