'use client';

import { useState, useEffect } from 'react';
import DoorGrid from '@/components/DoorGrid';
import DoorModal from '@/components/DoorModal';
import { doors, DoorContent } from '@/data/doors';
import { isDoorUnlocked } from '@/utils/dateUtils';

export default function Home() {
  const [selectedDoor, setSelectedDoor] = useState<DoorContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unlockedDoors, setUnlockedDoors] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Check which doors are unlocked
    const allowAll = process.env.NEXT_PUBLIC_ALLOW_ALL_DOORS === 'true';
    const unlocked = new Set<number>();

    doors.forEach((door) => {
      if (isDoorUnlocked(door.date, undefined, allowAll)) {
        unlocked.add(door.id);
      }
    });

    setUnlockedDoors(unlocked);
  }, []);

  const handleDoorClick = (door: DoorContent) => {
    if (unlockedDoors.has(door.id)) {
      setSelectedDoor(door);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay before clearing selected door for smooth exit animation
    setTimeout(() => {
      setSelectedDoor(null);
    }, 300);
  };

  return (
    <>
      <DoorGrid
        doors={doors}
        unlockedDoors={unlockedDoors}
        onDoorClick={handleDoorClick}
      />
      <DoorModal
        door={selectedDoor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

