"use client";
import { useEffect, useRef } from "react";
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
  const tpRef = useRef<TimepickerUI | null>(null);

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
    onChange(`${h24.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
  };

  useEffect(() => {
    if (!inputRef.current) return;

    const tp = new TimepickerUI(inputRef.current, {
      ui: { theme: "basic", mobile: false, enableSwitchIcon: true, backdrop: true, animation: true },
      clock: { type: "12h", incrementMinutes: 5, autoSwitchToMinutes: true },
      callbacks: {
        onConfirm: parseTo24,
        onOpen: () => {
          document.body.classList.remove("picker-theme-light", "picker-theme-dark");
          document.body.classList.add(`picker-theme-${theme}`);
          if (accentColor) document.body.style.setProperty("--picker-accent", accentColor);
          if (borderRadius) document.body.style.setProperty("--picker-radius", borderRadius);
        },
      },
    });

    tp.on("hide", () => {
      document.body.classList.remove("picker-theme-light", "picker-theme-dark");
    });

    tpRef.current = tp;
    tp.create();

    if (value) tp.setValue(formatDisplay(value));

    return () => {
      tpRef.current?.destroy();
      tpRef.current = null;
      document.body.classList.remove("picker-theme-light", "picker-theme-dark");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, accentColor, borderRadius]);

  useEffect(() => {
    if (tpRef.current && value) tpRef.current.setValue(formatDisplay(value));
  }, [value]);

  return (
    <div className={`picker-container ${className}`}>
      <input
        ref={inputRef}
        type="text"
        className="picker-trigger-input"
        placeholder={placeholder}
        readOnly
      />
      <style jsx>{`
        .picker-trigger-input {
          display: block; width: 100%; background: transparent; border: none;
          color: var(--picker-text, #a1a1aa); font-size: 14px;
          font-weight: 300; padding: 10px 0; outline: none; transition: border-color 0.2s;
          font-family: inherit; text-align: left; cursor: pointer;
        }
        .picker-trigger-input::placeholder { color: #a1a1aa; }
      `}</style>
    </div>
  );
}
