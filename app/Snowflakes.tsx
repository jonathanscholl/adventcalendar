'use client';

import { useEffect, useState } from 'react';

export default function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Reduce snowflakes on mobile for better performance
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 25 : 50;
    const flakes = Array.from({ length: count }, (_, i) => i);
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((index) => (
        <div
          key={index}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            fontSize: `${0.5 + Math.random() * 0.5}em`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

