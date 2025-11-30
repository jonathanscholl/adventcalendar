'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center py-6 sm:py-8 mt-8 sm:mt-12 px-4">
      <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2">
        Made with <Heart className="text-soft-red fill-soft-red" size={12} /> for you
      </p>
    </footer>
  );
}

