# 📅 Date & Time Picker

**Date & Time Picker** is a set of custom React date and time picker components built for Next.js — available in **light and dark modes**, fully **mobile responsive**, with a custom calendar UI and a Material Design clock powered by [timepicker-ui](https://github.com/pglejzer/timepicker-ui).

The components were designed and developed by [Jonathan Rycx](https://github.com/Rixouu), extracted from a production driver booking platform.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)
[![timepicker-ui](https://img.shields.io/badge/timepicker--ui-4-orange)](https://github.com/pglejzer/timepicker-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Key Features

### 📅 Date Picker
- Custom calendar grid — no native `<input type="date">` quirks
- Black header with year + selected date display
- Month navigation (previous / next)
- Disables past dates
- Today highlight
- Portal-rendered modal — renders outside the component tree via `createPortal`, safe for modals and drawers
- Accent color: `#FF2800`

### 🕐 Time Picker
- Material Design clock powered by [timepicker-ui](https://github.com/pglejzer/timepicker-ui)
- 12h format with AM/PM toggle
- 5-minute increment steps
- Auto-switch from hours to minutes after selection
- Keyboard input mode via switch icon
- Stores value internally as 24h (`HH:mm`) for easy form handling

### 🌗 Light & Dark Modes
- **Light** — white calendar, black header, red accent
- **Dark** — dark-first design system with CSS custom properties (`--dj-*` tokens), rounded 22px modal, subtle borders
- Both share identical UX — same interactions, same output format

### 📱 Mobile Responsive
- Modal is centered with `position: fixed` and `max-width: 95vw`
- Calendar grid adapts to narrow viewports
- Minimum touch target: `44px` (light) / `36px` (dark) per day cell

## 🛠 Tech Stack

- **Next.js 15** (App Router, `"use client"`)
- **React 18** with `createPortal` for overlay rendering
- **TypeScript** — fully typed props
- **timepicker-ui v4** — Material Design clock face
- **styled-jsx** — scoped & global CSS-in-JS (built into Next.js)
- **CSS Custom Properties** — dark theme via `--dj-*` tokens on `:root`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo with both light and dark pickers.

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

// Don't forget to import timepicker-ui CSS once globally:
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
  --dj-accent:           #ff2800;   /* ← swap this to rebrand */
  --dj-accent-soft:      #ff4d26;
  --dj-accent-muted:     rgba(255, 40, 0, 0.15);
  --dj-on-accent:        #ffffff;
  --dj-black:            #000000;
  --driver-dark-surface: var(--dj-bg-card);
}
```

To rebrand, change `--dj-accent` and `--dj-on-accent` — every interactive element (selected day, clock hand, AM/PM toggle, OK button) updates automatically.

## 📁 Project Structure

```
date-time-picker/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Demo page (light + dark side by side)
│   └── globals.css          # CSS reset, dark tokens, .bd-* component styles
├── components/
│   ├── light/
│   │   ├── DatePicker.tsx   # Light date picker (self-contained with styled-jsx)
│   │   └── TimePicker.tsx   # Light time picker (timepicker-ui + styled-jsx global)
│   └── dark/
│       ├── DatePicker.tsx   # Dark date picker (uses .bd-* CSS classes)
│       └── TimePicker.tsx   # Dark time picker (timepicker-ui dark theme override)
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
Both pickers render their modals at `document.body` level. This prevents clipping from parent `overflow: hidden` containers — common in booking forms inside cards or drawers.

### Why 24h output for Time Picker?
The clock displays 12h (friendlier for users) but stores `HH:mm`. This is easier to sort, compare, and pass to backends without ambiguity.

### Dark mode portal and CSS tokens
The dark date picker portal is outside `.bd-page`, so `.bd-dp` re-declares `--bd-*` tokens pointing at `--dj-*` globals on `:root`. No theming library needed.

## 🤝 Contributing

Contributions welcome. Before opening a PR:

1. Test both light and dark pickers on mobile viewport
2. Ensure the time picker syncs correctly when `value` changes externally
3. Open a PR describing the change

## 📄 License

MIT — free to use in personal and commercial projects.

## 👥 Author

**Jonathan Rycx** — [GitHub](https://github.com/Rixouu)

---

**Built for real booking flows. Extracted for everyone.**
