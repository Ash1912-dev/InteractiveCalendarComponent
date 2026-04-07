# React Wall Calendar Component

A frontend-focused demo project that presents a wall-style monthly calendar with rich motion, seasonal theming, holiday markers, and lightweight note-taking.

The goal of this project is visual polish first: it should feel like an interactive desk/wall calendar rather than a plain date grid.

## Why I Built It This Way

1. Paper + wall calendar visual language
- The layout uses a spiral-bound top, textured card, and month hero image so the UI feels physical and familiar.

2. Motion as UX, not noise
- Page-flip transitions, staggered date reveals, soft ambient background movement, and hover responses are used to make navigation feel natural and premium.

3. Month personality
- Each month has a dedicated image, accent color, and weather mood badge, so moving month-to-month feels distinct.

4. Practical interactions
- Date range selection, holiday highlights, and local notes make the demo functional beyond visuals.

5. Frontend-only persistence
- Notes are stored in `localStorage` by month and year, so there is no backend requirement for running or testing core behavior.

## Main Features

- Month navigation with animated transitions
- Hover month previews on navigation arrows
- Date range selection with in-range highlighting
- Holiday markers with tooltip labels
- Per-month note capture and delete
- Export notes to plain text
- Keyboard shortcuts:
	- Left Arrow: previous month
	- Right Arrow: next month
	- T: jump to current month
- Responsive layout across mobile, tablet, and desktop

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React icons

## Project Structure (Important Parts)

- `src/components/WallCalendar.tsx`: Core calendar UI, animation logic, holidays, and notes.
- `src/app/page.tsx`: Entry page that renders the component.
- `src/app/globals.css`: Global styles.

## Holiday Data Note

Holiday entries are curated in-code in `src/components/WallCalendar.tsx` for demonstration clarity.

- Current set focuses on major Indian holidays/festivals for 2025 and 2026.
- Lunar-calendar events (for example Eid/Bakrid) can vary by local moon sighting and official announcement.

## Run Locally

### 1. Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open:

- http://localhost:3000

### 4. Production build (optional)

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev`: Start local development server (Turbopack enabled in this project).
- `npm run build`: Create production build.
- `npm run start`: Run production server.
- `npm run lint`: Run ESLint.

## Customization Guide

1. Change month visuals
- Update `MONTH_IMAGES`, `MONTH_THEMES`, and `WEATHER_MOODS` in `src/components/WallCalendar.tsx`.

2. Update holidays
- Edit `INDIAN_HOLIDAYS` in `src/components/WallCalendar.tsx`.

3. Tune animation behavior
- Adjust Framer Motion variants (`pageFlipVariants`, `imageFadeVariants`, and day-cell reveal variants) in `src/components/WallCalendar.tsx`.

4. Change note persistence key strategy
- Update `notesKey()` and related helpers in `src/components/WallCalendar.tsx`.

## Known Limitations

- Holiday data is static (not fetched from a live API at runtime).
- Notes are browser-local and device-specific.
- No user auth or cloud sync (intentional for this frontend demo).

## License

This repository currently has no explicit open-source license file.
Add a LICENSE file if you plan to distribute or open-source it.
