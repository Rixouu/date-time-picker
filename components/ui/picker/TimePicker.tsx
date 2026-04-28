"use client";
import { useEffect, useRef, useId } from "react";
import { TimepickerUI } from "timepicker-ui";
import type { ConfirmEventData, UpdateEventData } from "timepicker-ui";
import "timepicker-ui/main.css";
import "./picker-theme.css";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  theme?: "light" | "dark";
  accentColor?: string;
  borderRadius?: string;
  className?: string;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  theme = "light",
  accentColor,
  borderRadius,
  className = "",
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tpRef = useRef<TimepickerUI | null>(null);
  const onChangeRef = useRef(onChange);
  const id = useId();

  // Keep onChange fresh without re-triggering effects
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const formatDisplay = (ts: string): string => {
    if (!ts) return "";
    const [h, m] = ts.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${(m || 0).toString().padStart(2, "0")} ${period}`;
  };

  const parseTo24 = (data: ConfirmEventData | UpdateEventData) => {
    if (data.hour == null || data.minutes == null) return;
    const hourStr = String(data.hour).trim();
    const minStr = String(data.minutes).trim();
    if (hourStr === "" || minStr === "") return;
    let h24 = parseInt(hourStr, 10);
    const m = parseInt(minStr, 10);
    if (Number.isNaN(h24) || Number.isNaN(m)) return;
    const ap = data.type?.toUpperCase();
    if (ap === "PM" && h24 !== 12) h24 += 12;
    else if (ap === "AM" && h24 === 12) h24 = 0;
    h24 = Math.min(23, Math.max(0, h24));
    const mm = Math.min(59, Math.max(0, m));
    onChangeRef.current(`${h24.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
  };

  // One-time initialization
  useEffect(() => {
    if (!inputRef.current) return;

    const tp = new TimepickerUI(inputRef.current, {
      ui: { 
        theme: "basic", 
        mobile: true, 
        enableSwitchIcon: true, 
        backdrop: true, 
        animation: true 
      },
      clock: { type: "12h", incrementMinutes: 5, autoSwitchToMinutes: true },
      callbacks: {
        onConfirm: parseTo24,
        onOpen: () => {
          // Use current props from the closure or handle them dynamically
          document.body.classList.add(`picker-theme-${theme}`);
          if (accentColor) document.body.style.setProperty("--picker-accent", accentColor);
          if (borderRadius) document.body.style.setProperty("--picker-radius", borderRadius);
        },
      },
    });

    tp.on("hide", () => {
      // Only remove the specific theme class
      document.body.classList.remove(`picker-theme-${theme}`);
    });

    tpRef.current = tp;
    tp.create();

    if (value) tp.setValue(formatDisplay(value));

    return () => {
      tp.destroy();
      tpRef.current = null;
      document.body.classList.remove(`picker-theme-${theme}`);
    };
    // We intentionally only run this on mount. 
    // Updates are handled by the separate effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle prop updates without destroying the instance
  useEffect(() => {
    if (tpRef.current) {
      tpRef.current.update({
        options: {
          ui: { theme: "basic", mobile: true }, // Library requires options object
          callbacks: {
            onConfirm: parseTo24,
            onOpen: () => {
              document.body.classList.add(`picker-theme-${theme}`);
              if (accentColor) document.body.style.setProperty("--picker-accent", accentColor);
              if (borderRadius) document.body.style.setProperty("--picker-radius", borderRadius);
            }
          }
        }
      });
    }
  }, [theme, accentColor, borderRadius]);

  // Sync value changes
  useEffect(() => { 
    if (tpRef.current) {
      tpRef.current.setValue(formatDisplay(value));
    }
  }, [value]);

  return (
    <div className={`picker-container ${className} tp-ui`} ref={containerRef}>
      {/* Hidden input for the library to attach to. 
          We use absolute positioning and 0 opacity so the library can still 
          calculate positions but it doesn't interfere with our layout. */}
      <input
        id={id}
        ref={inputRef}
        type="text"
        className="time-picker-hidden-engine"
        style={{ 
          position: 'absolute', 
          opacity: 0, 
          width: 1, 
          height: 1, 
          pointerEvents: 'none',
          left: 0,
          top: 0 
        }}
        defaultValue={formatDisplay(value)}
        readOnly
      />

      {/* Stable React button that matches DatePicker's design exactly */}
      <button
        type="button"
        className="picker-trigger-input"
        onClick={() => tpRef.current?.open()}
        style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        {formatDisplay(value) || <span className="picker-placeholder">{placeholder}</span>}
      </button>

      <style jsx>{`
        .picker-container {
          position: relative;
          width: 100%;
        }
        .picker-trigger-input {
          display: block;
          width: 100%;
          color: ${theme === 'dark' ? '#fafafa' : '#0f172a'} !important;
          font-size: 14px;
          font-weight: 300;
          padding: 10px 0;
          outline: none;
          font-family: inherit;
        }
        .picker-placeholder {
          color: var(--picker-text-muted, #a1a1aa);
        }
      `}</style>
    </div>
  );
}
