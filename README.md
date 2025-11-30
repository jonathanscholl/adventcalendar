# Advent Calendar Website

A magical, personalized Advent Calendar website built with Next.js, TypeScript, and Tailwind CSS. Each day of December unlocks a special surprise with a cozy, romantic Christmas theme.

## Features

- 🎄 24 doors, one for each day of December
- 🔒 Automatic date-based locking (unlocks on or after each day)
- ✨ Beautiful animations with Framer Motion
- 📱 Fully responsive design
- 🎨 Cozy Christmas theme with soft pastel colors
- 🧪 Debug mode to test all doors

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file (optional, for debug mode):

```bash
cp env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Editing Door Content

All door content is stored in `data/doors.ts`. Each door has:

- `id`: Unique identifier (1-24)
- `date`: Day of December (1-24)
- `title`: Short title for the door
- `message`: The main message/surprise text
- `image`: (Optional) Path to an image (place images in `public/images/`)
- `link`: (Optional) External link to open
- `extra`: (Optional) Additional text content

Example:

```typescript
{
  id: 1,
  date: 1,
  title: "First Day of Advent",
  message: "Your custom message here! ❤️",
  image: "/images/day1.jpg",
}
```

### Adding Images

1. Create a `public/images/` directory
2. Add your images (e.g., `day1.jpg`, `day2.jpg`, etc.)
3. Reference them in `data/doors.ts` using `/images/filename.jpg`

### Styling

The theme uses custom colors defined in `tailwind.config.js`:

- `christmas-red`: Main red color
- `soft-red`: Lighter red
- `blush-pink`: Pink accent
- `cream`: Light background
- `warm-beige`: Beige background
- `forest-green`: Green accent
- `gold` / `soft-gold`: Gold accents

You can customize these colors in `tailwind.config.js` to match your preferences.

## Date Locking System

### How It Works

- Doors unlock automatically based on the current date in the **Europe/Berlin timezone**
- A door unlocks on or after its corresponding day in December
- Doors remain locked if:
  - It's not December yet
  - The current day is before the door's date

### Debug Mode

To test all doors without waiting for the actual dates:

1. Create a `.env.local` file
2. Add: `NEXT_PUBLIC_ALLOW_ALL_DOORS=true`
3. Restart the development server

**Important**: The environment variable must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## Project Structure

```
adventcalendar/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main calendar page
│   ├── globals.css          # Global styles and Tailwind
│   └── Snowflakes.tsx       # Animated snowflake background
├── components/
│   ├── DoorCard.tsx         # Individual door component
│   ├── DoorGrid.tsx         # Grid layout for doors
│   ├── DoorModal.tsx        # Modal for door content
│   ├── Header.tsx           # Page header
│   ├── Footer.tsx           # Page footer
│   └── Layout.tsx           # Main layout wrapper
├── data/
│   └── doors.ts             # Door content definitions
├── utils/
│   └── dateUtils.ts         # Date checking utilities
└── public/
    └── images/              # Place your images here
```

## Building for Production

```bash
npm run build
npm start
```

## Testing

Run the date utility tests:

```bash
npm test
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## License

This is a personal project. Feel free to use and modify as you like!

## Notes

- The website uses client-side date checking, so it respects the user's browser timezone for display, but uses Europe/Berlin for the actual unlocking logic
- Images are optional - if an image fails to load, it will gracefully hide
- All animations are subtle and delightful, designed to feel magical without being overwhelming

Enjoy your Advent Calendar! 🎄❤️✨
