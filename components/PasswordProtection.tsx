'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';

interface PasswordProtectionProps {
  onPasswordCorrect: () => void;
}

const CORRECT_PASSWORD = 'skriki1!'; // Change this to your desired password

export default function PasswordProtection({ onPasswordCorrect }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);    

    // Small delay for better UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        // Store in sessionStorage so it persists during the session
        sessionStorage.setItem('calendar_unlocked', 'true');
        onPasswordCorrect();
      } else {
        setError('Falsches Passwort. Versuche es nochmal! ❤️');
        setPassword('');
        setIsChecking(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm-beige to-blush-pink/30 flex items-center justify-center p-4">
      <motion.div
        className="bg-gradient-to-br from-cream to-warm-beige rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-block mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="text-christmas-red mx-auto" size={48} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-christmas-red via-blush-pink to-soft-gold bg-clip-text text-transparent mb-2">
            Skriiiiki Kalender
          </h1>
          <p className="text-gray-600 font-cute">
            Bitte gib das Passwort ein
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Passwort..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-christmas-red focus:outline-none transition-colors text-lg font-cute"
              autoFocus
              disabled={isChecking}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-christmas-red text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isChecking || !password}
            className="w-full py-3.5 bg-christmas-red text-white rounded-xl font-semibold text-lg active:bg-soft-red transition-colors touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={!isChecking && password ? { scale: 1.02 } : {}}
            whileTap={!isChecking && password ? { scale: 0.98 } : {}}
          >
            {isChecking ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>Prüfe...</span>
              </>
            ) : (
              <>
                <Heart size={20} className="fill-white" />
                <span>Öffnen</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Made with <Heart className="text-soft-red fill-soft-red" size={14} /> for you
          </p>
        </div>
      </motion.div>
    </div>
  );
}

