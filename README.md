# 📅 Date & Time Picker

**Date & Time Picker** is a high-performance, design-token-driven selection system built for **Next.js 15+**. It provides a premium, unified experience for date and time input with zero-compromise stability and deep customization support.

The project is led and developed by [Jonathan Rycx](https://github.com/Rixouu), focusing on professional-grade UI components that bridge the gap between complex library logic and clean React state management.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)

---

## ✨ Key Features

### 📅 Unified Date Engine
- **Zero-Dependency Calendar**: Custom-built calendar logic ensures full control over rendering and performance.
- **Portal Rendering**: Safely renders modals at the document root to prevent parent overflow clipping.
- **Smart Formatting**: Automatic localization and display formatting (DD/MM/YYYY).

### ⏰ Hybrid Time Engine
- **Stable Wrapper**: Uses a custom "Hybrid Engine" that isolates the `timepicker-ui` DOM from React's reconciliation, preventing the "disappearing field" bugs common in direct wrappers.
- **Clock-Face Interaction**: Refined touch and mouse support for intuitive hour/minute selection.
- **Persistent Instance**: Background library instances are recycled to maintain performance during parent re-renders.

### 💎 Premium Visual Design
- **Glassmorphism**: 20px backdrop-blur overlays with smooth fade-in/pop-in animations.
- **Design Tokens**: Fully customizable via HSL-based CSS variables in `picker-theme.css`.
- **Unified API**: A single component handles both light and dark modes via a simple `theme="dark"` prop.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Utilizing the latest concurrent rendering features.
- **Next.js 15**: App router architecture for optimized routing and loading.
- **Tailwind CSS 4**: Modern utility-first styling with high-performance CSS variable integration.
- **TypeScript 5**: Strict type safety across all component boundaries.

### Libraries
- **timepicker-ui**: Core engine for clock-face interactions (wrapped in a stable React layer).
- **Lucide React**: Refined iconography.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm** or **pnpm**

### Installation

```bash
# Install core library dependencies
npm install timepicker-ui
```

### Usage

```tsx
import DatePicker from "@/components/ui/picker/DatePicker";
import TimePicker from "@/components/ui/picker/TimePicker";

export default function BookingForm() {
  const [date, setDate] = useState("2024-05-20");
  const [time, setTime] = useState("14:30");

  return (
    <div className="card">
      <DatePicker 
        value={date} 
        onChange={setDate} 
        theme="dark" 
        accentColor="#FF2800" 
      />
      <TimePicker 
        value={time} 
        onChange={setTime} 
        theme="dark" 
        accentColor="#FF2800" 
      />
    </div>
  );
}
```

---

## 🎨 Design Tokens (Customization)

The system is built on a robust token system. You can override global styles in `components/ui/picker/picker-theme.css` or pass props for instance-level overrides.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `"light" \| "dark"` | `"light"` | Switches the visual context. |
| `accentColor` | `string` | `#FF2800` | Overrides the primary brand color. |
| `borderRadius` | `string` | `22px` | Adjusts the corner rounding of all modals. |

---

## 📁 Project Structure

```
date-time-picker/
├── app/                  # Next.js App Router pages
├── components/
│   └── ui/
│       └── picker/       # Core Picker System
│           ├── DatePicker.tsx    # Calendar implementation
│           ├── TimePicker.tsx    # Hybrid library wrapper
│           └── picker-theme.css  # Global design tokens
├── public/               # Static assets & brand icons
└── tailwind.config.ts    # Design system configuration
```

---

## 🏗️ Development Workflow

```bash
# Run local dev server
npm run dev

# Build production bundle
npm run build

# Run linting and type-checking
npm run lint
npm run typecheck
```

---

## 📄 License

MIT — Created by [Jonathan Rycx](https://github.com/Rixouu). Free for personal and commercial use.

## 🙏 Acknowledgments

- **Next.js Team**: For the state-of-the-art App Router and SSR foundation.
- **React Team**: For the stable Portal and Concurrent Mode APIs that make complex UI possible.
- **Tailwind CSS**: For the high-performance design system integration.
- **timepicker-ui**: For the robust clock-face interaction primitives.

---

Built with ❤️ for professional-grade React applications.
