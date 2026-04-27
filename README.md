# 📅 Unified Date & Time Picker

**Date & Time Picker** is a robust, scalable set of custom React components built for **Next.js 16+**. It provides a single unified API for both light and dark modes, with high customizability via design tokens and props.

The components were designed and developed by [Jonathan Rycx](https://github.com/Rixouu)

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Key Features

- **Unified API**: One component for all themes (`<DatePicker theme="dark" />`).
- **Design Token Driven**: Easily change colors, radius, and shadows via CSS variables.
- **Premium Aesthetics**: Glassmorphism overlays, smooth transitions, and refined typography.
- **Mobile First**: Fully responsive with touch-friendly targets.
- **Accessibility**: ARIA labels and keyboard navigation support.
- **Portal Rendering**: Safely renders at `document.body` to avoid clipping.

## 🚀 Quick Start

### Installation

```bash
npm install timepicker-ui
```

### Usage

```tsx
import DatePicker from "@/components/ui/picker/DatePicker";
import TimePicker from "@/components/ui/picker/TimePicker";

export default function MyForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div>
      <DatePicker value={date} onChange={setDate} theme="light" />
      <TimePicker value={time} onChange={setTime} theme="light" />
    </div>
  );
}
```

## 🎨 Customization

You can customize the components globally via CSS or per-instance via props.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `"light" \| "dark"` | `"light"` | The visual theme. |
| `accentColor` | `string` | `#FF2800` | The primary brand color. |
| `borderRadius` | `string` | `22px` | Corner rounding for the modal. |
| `placeholder` | `string` | `"Select..."` | Input placeholder text. |

### Design Tokens (CSS Variables)

The system uses CSS variables defined in `picker-theme.css`. You can override these in your global CSS:

```css
:root {
  --picker-accent: #6366f1; /* Indigo */
  --picker-radius: 12px;
  --picker-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

## 📁 Project Structure

```
components/ui/picker/
├── DatePicker.tsx    # Unified logic & rendering
├── TimePicker.tsx    # unified timepicker-ui wrapper
└── picker-theme.css  # Design tokens and theme scopes
```

## 📄 License

MIT — free to use in personal and commercial projects.

## 👥 Author

**Jonathan Rycx** — [GitHub](https://github.com/Rixouu)
