'use client';

import { useState, useEffect } from 'react';
import DoorGrid from '@/components/DoorGrid';
import DoorModal from '@/components/DoorModal';
import PasswordProtection from '@/components/PasswordProtection';
import { doors, DoorContent } from '@/data/doors';
import { isDoorUnlocked } from '@/utils/dateUtils';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<DoorContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unlockedDoors, setUnlockedDoors] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Check if calendar is already unlocked from session
    const unlocked = sessionStorage.getItem('calendar_unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    // Check which doors are unlocked
    const allowAll = process.env.NEXT_PUBLIC_ALLOW_ALL_DOORS === 'true';
    const unlocked = new Set<number>();

    doors.forEach((door) => {
      if (isDoorUnlocked(door.date, undefined, allowAll)) {
        unlocked.add(door.id);
      }
    });

    setUnlockedDoors(unlocked);
  }, [isUnlocked]);

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

  if (!isUnlocked) {
    return <PasswordProtection onPasswordCorrect={() => setIsUnlocked(true)} />;
  }

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

