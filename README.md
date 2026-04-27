# 📅 Date & Time Picker

**Date & Time Picker** is a set of custom React date and time picker components built for **Next.js 16**, available in **light and dark modes**, fully **mobile responsive**, with a custom calendar UI and a Material Design clock powered by [timepicker-ui](https://github.com/pglejzer/timepicker-ui).

The components were designed and developed by [Jonathan Rycx](https://github.com/Rixouu)

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)
[![timepicker-ui](https://img.shields.io/badge/timepicker--ui-4-orange)](https://github.com/pglejzer/timepicker-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Key Features

### 📅 Date Picker

- Custom calendar grid with no native `<input type="date">` quirks
- Header with accent year label and large bold selected date
- Month navigation (previous / next)
- Disables past dates, highlights today
- Portal-rendered modal via `createPortal`, safe inside any `overflow: hidden` container
- Accent color: `#FF2800`

### 🕐 Time Picker

- Material Design clock powered by [timepicker-ui](https://github.com/pglejzer/timepicker-ui)
- 12h format with AM/PM toggle
- 5-minute increment steps
- Auto-switch from hours to minutes after selection
- Keyboard input mode via switch icon
- Value stored as 24h `HH:mm` for easy form handling

### 🌗 Fully Separated Themes

This project provides two completely separate component sets:
- **Light** — White calendar, light gray header, red accent, colors sourced from the `driver-website` palette.
- **Dark** — Deep, premium dark mode with high-contrast accents and subtle borders.

Each component manages its own global style overrides (via `styled-jsx global`) using a unique `data-tp-theme` attribute on the `html` element to prevent cross-contamination between light and dark time pickers.

### 📱 Mobile Responsive

- Modal centered with `position: fixed` and `max-width: 95vw`
- Calendar grid adapts to narrow viewports
- Minimum touch target 36px per day cell

## 🛠 Tech Stack

- **Next.js 16** (App Router, `"use client"`)
- **React 18** with `createPortal` for overlay rendering
- **TypeScript** with fully typed props
- **timepicker-ui v4** for the Material Design clock face
- **styled-jsx** scoped and global CSS-in-JS (built into Next.js)
- **CSS Custom Properties** for the dark theme via `--dj-*` tokens on `:root`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo with both light and dark pickers side by side.

### Dependencies

```bash
npm install timepicker-ui
```

The rest (`react`, `react-dom`, `next`) are already in your Next.js project.

## 📦 Usage

### Light Date Picker

```tsx
import DatePicker from "@/components/light/DatePicker";

<DatePicker
  value={date}           // "YYYY-MM-DD" or ""
  onChange={setDate}     // (date: string) => void
  placeholder="Select Date"
/>
```

### Light Time Picker

```tsx
import TimePicker from "@/components/light/TimePicker";

// Import timepicker-ui CSS once globally:
// import "timepicker-ui/main.css";

<TimePicker
  value={time}           // "HH:mm" or ""
  onChange={setTime}     // (time: string) => void
  placeholder="Select Time"
/>
```

### Dark Date Picker

```tsx
// Wrap in .bd-page to inherit CSS tokens
import DatePicker from "@/components/dark/DatePicker";

<div className="bd-page">
  <DatePicker
    value={date}
    onChange={setDate}
    placeholder="Select Date"
  />
</div>
```

### Dark Time Picker

```tsx
import TimePicker from "@/components/dark/TimePicker";

<div className="bd-page">
  <TimePicker
    value={time}
    onChange={setTime}
    placeholder="Select Time"
  />
</div>
```

### Full example

```tsx
"use client";
import { useState } from "react";
import LightDatePicker from "@/components/light/DatePicker";
import LightTimePicker from "@/components/light/TimePicker";
import DarkDatePicker from "@/components/dark/DatePicker";
import DarkTimePicker from "@/components/dark/TimePicker";

export default function BookingForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <form>
      {/* Light mode */}
      <LightDatePicker value={date} onChange={setDate} />
      <LightTimePicker value={time} onChange={setTime} />

      {/* Dark mode */}
      <div className="bd-page">
        <DarkDatePicker value={date} onChange={setDate} />
        <DarkTimePicker value={time} onChange={setTime} />
      </div>
    </form>
  );
}
```

## 🎨 CSS Variables (Dark Mode)

The dark components are driven by CSS custom properties. Set them on `:root` or any ancestor element:

```css
:root {
  --dj-bg-base:          #050505;
  --dj-bg-elevated:      #0c0c0c;
  --dj-bg-card:          #0c0c0c;
  --dj-bg-card-hover:    #1a1a1a;
  --dj-bg-mid:           #090909;
  --dj-text:             #a3a3a3;
  --dj-text-heading:     #fafafa;
  --dj-border:           #262626;
  --dj-border-subtle:    #1f1f1f;
  --dj-accent:           #ff2800;   /* swap this to rebrand */
  --dj-accent-soft:      #ff4d26;
  --dj-accent-muted:     rgba(255, 40, 0, 0.15);
  --dj-on-accent:        #ffffff;
  --dj-black:            #000000;
  --driver-dark-surface: var(--dj-bg-card);
}
```

Changing `--dj-accent` and `--dj-on-accent` rebrands every interactive element automatically: selected day, clock hand, AM/PM toggle, and OK button.

## 📁 Project Structure

```
date-time-picker/
├── app/
│   ├── layout.tsx           # Root layout with favicon metadata
│   ├── page.tsx             # Demo page (light and dark side by side)
│   └── globals.css          # CSS reset, dark tokens, .bd-* component styles
├── components/
│   ├── light/
│   │   ├── DatePicker.tsx   # Light date picker (self-contained with styled-jsx)
│   │   └── TimePicker.tsx   # Light time picker (timepicker-ui light theme)
│   └── dark/
│       ├── DatePicker.tsx   # Dark date picker (uses .bd-* CSS classes)
│       └── TimePicker.tsx   # Dark time picker (timepicker-ui dark theme override)
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── apple-touch-icon.png
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 🔧 Available Scripts

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production server
```

## 🌟 Design Notes

### Why `createPortal`?

Both pickers render their modals at `document.body` level to prevent clipping from parent `overflow: hidden` containers, which is common in booking forms inside cards or drawers.

### Why 24h output for the Time Picker?

The clock displays 12h (friendlier for users) but stores `HH:mm` internally. This is easier to sort, compare, and pass to backends without ambiguity.

### Dark mode portal and CSS tokens

The dark date picker portal is outside `.bd-page`, so `.bd-dp` re-declares `--bd-*` tokens pointing at `--dj-*` globals on `:root`. No theming library required.

## 🤝 Contributing

Contributions welcome. Before opening a PR:

1. Test both light and dark pickers on a mobile viewport
2. Ensure the time picker syncs correctly when `value` changes externally
3. Open a PR describing the change

## 📄 License

MIT — free to use in personal and commercial projects.

## 👥 Author

**Jonathan Rycx** — [GitHub](https://github.com/Rixouu)

---

Built for real booking flows. Extracted for everyone.
