'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCw } from 'lucide-react';
import Link from 'next/link';

const GRID_SIZE = 20; // Smaller grid
const CELL_SIZE = 20; // Smaller cells
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 130; // Game speed

type Position = { x: number; y: number };
type Direction = { x: number; y: number };

export default function SnakePage() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [apple, setApple] = useState<Position>({ x: 15, y: 15 });
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'paused' | 'gameOver'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Image paths - update these to your actual image paths
  const SNAKE_HEAD_IMAGE = '/images/snake.png'; // Girlfriend's head
  const APPLE_IMAGE = '/images/apple.png'; // Your head

  // Initialize high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snake_high_score');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Generate random apple position
  const generateApple = useCallback((currentSnake: Position[]): Position => {
    let newApple: Position;
    do {
      newApple = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(segment => segment.x === newApple.x && segment.y === newApple.y)
    );
    return newApple;
  }, []);

  // Check collision
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setGameState('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const currentDir = directionRef.current;
        const head = prevSnake[0];
        const newHead: Position = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check collision
        if (checkCollision(newHead, prevSnake)) {
          setGameState('gameOver');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if apple is eaten
        if (newHead.x === apple.x && newHead.y === apple.y) {
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              const newHighScore = newScore;
              setHighScore(newHighScore);
              localStorage.setItem('snake_high_score', newHighScore.toString());
            }
            return newScore;
          });
          setApple(generateApple(newSnake));
          // Don't remove tail - snake grows
        } else {
          // Remove tail if no apple eaten
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, apple, checkCollision, generateApple, highScore]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'gameOver') {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      if (gameState !== 'playing') return;

      const key = e.key.toLowerCase();
      const currentDir = directionRef.current;
      let newDir: Direction | null = null;

      // Prevent reversing into itself - check both current direction and opposite
      if (key === 'arrowup' || key === 'w') {
        // Only allow if not currently moving down
        if (currentDir.y !== 1) {
          newDir = { x: 0, y: -1 };
        }
      } else if (key === 'arrowdown' || key === 's') {
        // Only allow if not currently moving up
        if (currentDir.y !== -1) {
          newDir = { x: 0, y: 1 };
        }
      } else if (key === 'arrowleft' || key === 'a') {
        // Only allow if not currently moving right
        if (currentDir.x !== 1) {
          newDir = { x: -1, y: 0 };
        }
      } else if (key === 'arrowright' || key === 'd') {
        // Only allow if not currently moving left
        if (currentDir.x !== -1) {
          newDir = { x: 1, y: 0 };
        }
      } else if (key === ' ') {
        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
        return;
      }

      // Only update direction if it's valid and different from current
      if (newDir && (newDir.x !== currentDir.x || newDir.y !== currentDir.y)) {
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setApple(generateApple(INITIAL_SNAKE));
    setScore(0);
    setCountdown(3);
    setGameState('countdown');
  };

  const handleDirectionButton = (newDir: Direction) => {
    if (gameState !== 'playing') return;
    const currentDir = directionRef.current;
    
    // Prevent reversing into itself - check if new direction is opposite
    if (currentDir.x === -newDir.x && currentDir.y === -newDir.y) return;
    // Prevent setting same direction
    if (currentDir.x === newDir.x && currentDir.y === newDir.y) return;
    
    // Additional safety check: prevent if snake would immediately crash
    // (This is already handled by the opposite check above, but keeping for clarity)
    if ((currentDir.x === 1 && newDir.x === -1) || 
        (currentDir.x === -1 && newDir.x === 1) ||
        (currentDir.y === 1 && newDir.y === -1) ||
        (currentDir.y === -1 && newDir.y === 1)) {
      return;
    }

    directionRef.current = newDir;
    setDirection(newDir);
  };

  // Calculate responsive cell size - optimized for laptop and mobile
  const getCellSize = () => {
    if (typeof window === 'undefined') return CELL_SIZE;
    // For mobile, use full width minus padding, for laptop use max 500px
    const isMobile = window.innerWidth < 640;
    const padding = isMobile ? 32 : 80; // Less padding on mobile
    const borderWidth = 8; // 4px border on each side (4px * 2 = 8px total)
    const maxWidth = isMobile 
      ? window.innerWidth - padding - borderWidth
      : Math.min(window.innerWidth - padding - borderWidth, 500 - borderWidth);
    const calculatedSize = Math.floor(maxWidth / GRID_SIZE);
    // Ensure minimum cell size
    return Math.max(calculatedSize, CELL_SIZE);
  };

  const [cellSize, setCellSize] = useState(CELL_SIZE);

  useEffect(() => {
    const updateCellSize = () => {
      setCellSize(getCellSize());
    };
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  const gameSize = cellSize * GRID_SIZE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm-beige to-blush-pink/30 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-0">
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 text-christmas-red active:text-soft-red transition-colors touch-manipulation min-h-[44px] min-w-[44px] justify-center"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold hidden xs:inline">Zurück</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-christmas-red via-blush-pink to-soft-gold bg-clip-text text-transparent">
            Snake
          </h1>
          <button
            onClick={resetGame}
            className="flex items-center gap-1 sm:gap-2 text-christmas-red active:text-soft-red transition-colors touch-manipulation min-h-[44px] min-w-[44px] justify-center"
          >
            <RotateCw size={20} className="sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold hidden sm:inline">Neu</span>
          </button>
        </div>

        {/* Score */}
        <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
          <div className="text-center">
            <p className="text-sm text-gray-600">Punkte</p>
            <p className="text-2xl font-bold text-christmas-red">{score}</p>
          </div>
          {highScore > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Bester</p>
              <p className="text-2xl font-bold text-forest-green">{highScore}</p>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-4 px-2 sm:px-0 w-full overflow-hidden">
          <div
            className="relative border-4 border-christmas-red rounded-lg shadow-2xl overflow-hidden"
            style={{ 
              width: `${gameSize}px`, 
              height: `${gameSize}px`,
              minWidth: 0,
              flexShrink: 0,
              backgroundColor: '#2e7d32', // Forest green background
              backgroundImage: `
                repeating-conic-gradient(
                  #2e7d32 0% 25%,
                  #1b5e20 25% 50%,
                  #2e7d32 50% 75%,
                  #1b5e20 75% 100%
                )
              `,
              backgroundSize: `${cellSize * 2}px ${cellSize * 2}px`
            }}
          >
            {/* Apple */}
            <div
              className="absolute"
              style={{
                left: apple.x * cellSize,
                top: apple.y * cellSize,
                width: cellSize,
                height: cellSize,
              }}
            >
              <img
                src={APPLE_IMAGE}
                alt="Apple"
                className="w-full h-full object-cover rounded"
                style={{ transform: 'scale(1.6)' }}
                onError={(e) => {
                  // Fallback to colored square if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full bg-christmas-red rounded';
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
              />
            </div>

            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: segment.x * cellSize,
                  top: segment.y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              >
                <img
                  src={SNAKE_HEAD_IMAGE}
                  alt="Snake"
                  className="w-full h-full object-cover rounded"
                  style={{ transform: 'scale(1.6)' }}
                  onError={(e) => {
                    // Fallback to colored square if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-forest-green rounded';
                    (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Countdown Overlay */}
        {gameState === 'countdown' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1.2, 1], opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-cream to-warm-beige rounded-3xl shadow-2xl p-12 sm:p-16"
            >
              {countdown > 0 ? (
                <motion.h2
                  className="text-8xl sm:text-9xl font-bold text-christmas-red"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {countdown}
                </motion.h2>
              ) : (
                <motion.h2
                  className="text-6xl sm:text-7xl font-bold text-forest-green"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  Los! 🎮
                </motion.h2>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-cream to-warm-beige rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full"
            >
              <div className="text-center">
                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-4xl sm:text-5xl font-bold text-christmas-red mb-4"
                >
                  Game Over! 😢
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <p className="text-lg sm:text-xl text-gray-600 mb-2">Dein Score:</p>
                  <p className="text-5xl sm:text-6xl font-bold text-christmas-red mb-4">{score}</p>
                  
                  {highScore > 0 && (
                    <div className="mt-4">
                      <p className="text-sm sm:text-base text-gray-600 mb-1">Bester Score:</p>
                      <p className="text-2xl sm:text-3xl font-bold text-forest-green">{highScore}</p>
                    </div>
                  )}
                </motion.div>

                <motion.button
                  onClick={resetGame}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full py-4 bg-christmas-red text-white rounded-xl font-semibold text-lg sm:text-xl active:bg-soft-red transition-colors shadow-lg touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
                >
                  <RotateCw size={24} />
                  <span>Nochmal spielen</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4 px-2"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-soft-gold mb-2">
              Pausiert ⏸️
            </h2>
            <p className="text-base text-gray-700">
              Drücke Leertaste zum Fortsetzen
            </p>
          </motion.div>
        )}

        {/* Mobile Controls - WASD Layout */}
        <div className="flex flex-col items-center gap-3 mt-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {/* Top row - W (Up) */}
            <div className="flex justify-center">
              <button
                onClick={() => handleDirectionButton({ x: 0, y: -1 })}
                className="w-16 h-16 bg-christmas-red text-white rounded-full active:bg-soft-red touch-manipulation flex items-center justify-center text-2xl font-bold"
                disabled={gameState !== 'playing'}
              >
                ↑
              </button>
            </div>
            {/* Bottom row - A (Left), S (Down), D (Right) */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleDirectionButton({ x: -1, y: 0 })}
                className="w-16 h-16 bg-christmas-red text-white rounded-full active:bg-soft-red touch-manipulation flex items-center justify-center text-2xl font-bold"
                disabled={gameState !== 'playing'}
              >
                ←
              </button>
              <button
                onClick={() => handleDirectionButton({ x: 0, y: 1 })}
                className="w-16 h-16 bg-christmas-red text-white rounded-full active:bg-soft-red touch-manipulation flex items-center justify-center text-2xl font-bold"
                disabled={gameState !== 'playing'}
              >
                ↓
              </button>
              <button
                onClick={() => handleDirectionButton({ x: 1, y: 0 })}
                className="w-16 h-16 bg-christmas-red text-white rounded-full active:bg-soft-red touch-manipulation flex items-center justify-center text-2xl font-bold"
                disabled={gameState !== 'playing'}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 px-2">
          <p className="text-base sm:text-lg text-gray-600">
            Verwende die Pfeiltasten oder WASD zum Steuern • Leertaste zum Pausieren
          </p>
        </div>
      </div>
    </div>
  );
}

