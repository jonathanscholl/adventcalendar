'use client';

import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

interface DoorCardProps {
  id: number;
  date: number;
  isUnlocked: boolean;
  onClick: () => void;
}

export default function DoorCard({ id, date, isUnlocked, onClick }: DoorCardProps) {
  const handleClick = () => {
    if (isUnlocked) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`
        relative aspect-square rounded-2xl p-3 sm:p-4 cursor-pointer
        transition-all duration-300 touch-manipulation
        min-h-[80px] sm:min-h-0
        ${isUnlocked 
          ? 'bg-gradient-to-br from-soft-red to-blush-pink shadow-lg active:shadow-xl active:scale-95 sm:hover:shadow-xl sm:hover:scale-105' 
          : 'bg-warm-beige/50 opacity-60 cursor-not-allowed blur-[1px]'
        }
      `}
      onClick={handleClick}
      whileHover={isUnlocked ? { scale: 1.05, rotate: 1 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(id * 0.02, 0.5) }}
    >
      {/* Sparkle decoration for unlocked doors */}
      {isUnlocked && (
        <motion.div
          className="absolute top-2 right-2 text-soft-gold"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={14} className="sm:w-4 sm:h-4" />
        </motion.div>
      )}

      {/* Lock icon for locked doors */}
      {!isUnlocked && (
        <div className="absolute top-2 right-2 text-gray-400">
          <Lock size={14} className="sm:w-4 sm:h-4" />
        </div>
      )}

      {/* Door number */}
      <div className="flex items-center justify-center h-full">
        <span className={`
          text-3xl sm:text-4xl font-bold
          ${isUnlocked ? 'text-white drop-shadow-lg' : 'text-gray-400'}
        `}>
          {date}
        </span>
      </div>

      {/* Subtle glow effect for unlocked doors */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

