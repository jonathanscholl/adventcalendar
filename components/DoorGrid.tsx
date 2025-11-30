'use client';

import DoorCard from './DoorCard';
import { DoorContent } from '@/data/doors';

interface DoorGridProps {
  doors: DoorContent[];
  unlockedDoors: Set<number>;
  onDoorClick: (door: DoorContent) => void;
}

export default function DoorGrid({ doors, unlockedDoors, onDoorClick }: DoorGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-2 sm:px-4">
      {doors.map((door) => (
        <DoorCard
          key={door.id}
          id={door.id}
          date={door.date}
          isUnlocked={unlockedDoors.has(door.id)}
          onClick={() => onDoorClick(door)}
        />
      ))}
    </div>
  );
}

