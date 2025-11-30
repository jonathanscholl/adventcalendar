/**
 * Gets the current date components in Europe/Berlin timezone
 */
function getBerlinDateComponents(date: Date = new Date()): { day: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  
  const parts = formatter.formatToParts(date);
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0', 10);
  
  return { day, month };
}

/**
 * Checks if a door is unlocked based on the current date.
 * Uses Europe/Berlin timezone for date comparisons.
 * 
 * @param doorDate - The day of December (1-24) for the door
 * @param now - Optional current date (defaults to now)
 * @param allowAll - Optional override to unlock all doors (for testing)
 * @returns true if the door should be unlocked
 */
export function isDoorUnlocked(
  doorDate: number,
  now?: Date,
  allowAll: boolean = false
): boolean {
  if (allowAll) {
    return true;
  }

  const { day: currentDay, month: currentMonth } = getBerlinDateComponents(now);
  
  // Only unlock doors in December (month 12)
  if (currentMonth !== 12) {
    return false;
  }
  
  // Door is unlocked if current day is >= door date
  return currentDay >= doorDate;
}

/**
 * Gets the current date in Europe/Berlin timezone
 */
export function getBerlinDate(): Date {
  const now = new Date();
  const { day, month } = getBerlinDateComponents(now);
  const year = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
  }).formatToParts(now).find(p => p.type === 'year')?.value || '2024';
  
  return new Date(parseInt(year, 10), month - 1, day);
}

/**
 * Checks if we're currently in December
 */
export function isDecember(): boolean {
  const { month } = getBerlinDateComponents();
  return month === 12;
}

