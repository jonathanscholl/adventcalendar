import { isDoorUnlocked, getBerlinDate, isDecember } from './dateUtils';

describe('dateUtils', () => {
  describe('isDoorUnlocked', () => {
    it('should unlock all doors when allowAll is true', () => {
      const januaryDate = new Date('2024-01-15');
      expect(isDoorUnlocked(1, januaryDate, true)).toBe(true);
      expect(isDoorUnlocked(24, januaryDate, true)).toBe(true);
    });

    it('should return false for doors before December', () => {
      const novemberDate = new Date('2024-11-30');
      expect(isDoorUnlocked(1, novemberDate, false)).toBe(false);
    });

    it('should unlock door 1 on December 1st', () => {
      const dec1 = new Date('2024-12-01T10:00:00');
      expect(isDoorUnlocked(1, dec1, false)).toBe(true);
    });

    it('should unlock door 1 on December 2nd', () => {
      const dec2 = new Date('2024-12-02T10:00:00');
      expect(isDoorUnlocked(1, dec2, false)).toBe(true);
    });

    it('should not unlock door 2 on December 1st', () => {
      const dec1 = new Date('2024-12-01T10:00:00');
      expect(isDoorUnlocked(2, dec1, false)).toBe(false);
    });

    it('should unlock door 2 on December 2nd', () => {
      const dec2 = new Date('2024-12-02T10:00:00');
      expect(isDoorUnlocked(2, dec2, false)).toBe(true);
    });

    it('should unlock door 24 on December 24th', () => {
      const dec24 = new Date('2024-12-24T10:00:00');
      expect(isDoorUnlocked(24, dec24, false)).toBe(true);
    });

    it('should unlock door 24 on December 25th', () => {
      const dec25 = new Date('2024-12-25T10:00:00');
      expect(isDoorUnlocked(24, dec25, false)).toBe(true);
    });
  });

  describe('isDecember', () => {
    it('should return true in December', () => {
      // This test will depend on when it's run, but we can test the logic
      const decDate = new Date('2024-12-15');
      const originalDate = Date;
      global.Date = jest.fn(() => decDate) as unknown as typeof Date;
      
      // Note: This is a simplified test. In a real scenario, you'd mock the timezone
      expect(isDecember()).toBe(true);
      
      global.Date = originalDate;
    });
  });
});

