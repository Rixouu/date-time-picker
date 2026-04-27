"use client";
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import type { ConfirmEventData, UpdateEventData } from "timepicker-ui";
import "timepicker-ui/main.css";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tpRef = useRef<TimepickerUI | null>(null);

  /** 12h string for TimepickerUI setValue — no leading zero on hours 1–9. */
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
      ui: { theme: "m3-green", mobile: false, enableSwitchIcon: true, backdrop: true, animation: true },
      clock: { type: "12h", incrementMinutes: 5, autoSwitchToMinutes: true },
      callbacks: { onConfirm: parseTo24, onUpdate: parseTo24 },
    });
    tpRef.current = tp;
    tp.create();
    if (value) tp.setValue(formatDisplay(value));
    
    const handleFocus = () => document.documentElement.setAttribute("data-tp-theme", "dark");
    inputRef.current?.addEventListener("focus", handleFocus);
    inputRef.current?.addEventListener("click", handleFocus);

    return () => { 
      tpRef.current?.destroy(); 
      tpRef.current = null; 
      inputRef.current?.removeEventListener("focus", handleFocus);
      inputRef.current?.removeEventListener("click", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (tpRef.current && value) tpRef.current.setValue(formatDisplay(value)); }, [value]);

  return (
    <div className="bd-time-picker">
      <input
        ref={inputRef}
        type="text"
        className="bd-inf bd-inf--trigger bd-time-trigger"
        placeholder={placeholder}
        readOnly
      />
      <style jsx global>{`
        html[data-tp-theme="dark"] .tp-ui-wrapper[data-theme], 
        html[data-tp-theme="dark"] .tp-ui-wrapper {
          --tp-primary: var(--dj-accent) !important;
          --tp-on-primary: var(--dj-on-accent) !important;
          --tp-primary-container: var(--dj-accent) !important;
          --tp-on-primary-container: var(--dj-on-accent) !important;
          --tp-backdrop: color-mix(in srgb, var(--dj-black) 60%, transparent) !important;
          --tp-bg: var(--dj-bg-mid) !important;
          --tp-surface: var(--dj-bg-card) !important;
          --tp-surface-hover: color-mix(in srgb, var(--dj-accent) 10%, transparent) !important;
          --tp-input-bg: var(--dj-bg-card) !important;
          --tp-text: var(--dj-text-heading) !important;
          --tp-text-secondary: color-mix(in srgb, var(--dj-text-heading) 90%, transparent) !important;
          --tp-text-type-time: color-mix(in srgb, var(--dj-text-heading) 90%, transparent) !important;
          --tp-text-icon: color-mix(in srgb, var(--dj-text-heading) 90%, transparent) !important;
          --tp-text-disabled: color-mix(in srgb, var(--dj-text-heading) 28%, transparent) !important;
          --tp-am-pm-active: var(--dj-accent) !important;
          --tp-am-pm-text-selected: var(--dj-on-accent) !important;
          --tp-am-pm-text-unselected: var(--dj-text) !important;
          --tp-border: var(--dj-border) !important;
          --tp-outline: var(--dj-accent) !important;
          --tp-shadow: 0 10px 25px color-mix(in srgb, var(--dj-black) 40%, transparent) !important;
          --tp-border-radius: 22px !important;
        }
        html[data-tp-theme="dark"] .tp-ui-modal {
          background-color: color-mix(in srgb, var(--dj-black) 60%, transparent) !important;
          z-index: 999999 !important;
        }
        html[data-tp-theme="dark"] .tp-ui-wrapper {
          z-index: 1000000 !important;
          background: var(--dj-bg-mid) !important;
          border-radius: 22px !important;
          overflow: hidden !important;
          border: 1px solid var(--dj-border) !important;
          box-shadow: 0 10px 25px color-mix(in srgb, var(--dj-black) 40%, transparent) !important;
          max-width: 340px !important;
          font-family: inherit !important;
        }
        html[data-tp-theme="dark"] .tp-ui-select-time { display: none !important; }
        html[data-tp-theme="dark"] .tp-ui-header {
          background: var(--dj-bg-base) !important;
          color: var(--dj-text-heading) !important;
          padding-top: 30px !important;
        }
        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-hour, 
        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-minutes {
          color: var(--dj-text-heading) !important;
          font-weight: 700 !important;
          font-size: clamp(28px, 8vw, 34px) !important;
          letter-spacing: -0.02em !important;
        }
        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-dots span { background-color: var(--dj-text-heading) !important; }
        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-hour,
        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-minutes,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-hour,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-minutes {
          color: var(--dj-text-heading) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-dots span,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-dots span {
          background-color: var(--dj-text-heading) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-am,
        html[data-tp-theme="dark"] .tp-ui-pm {
          background-color: var(--dj-bg-card) !important;
          color: var(--dj-text) !important;
          border-color: var(--dj-border) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-am:hover, 
        html[data-tp-theme="dark"] .tp-ui-pm:hover {
          background-color: color-mix(in srgb, var(--dj-accent) 8%, transparent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-am.active, 
        html[data-tp-theme="dark"] .tp-ui-pm.active {
          background-color: var(--dj-accent) !important;
          color: var(--dj-on-accent) !important;
          border-color: var(--dj-accent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-hour-time-12.active, 
        html[data-tp-theme="dark"] .tp-ui-hour-time-24.active, 
        html[data-tp-theme="dark"] .tp-ui-minutes-time.active {
          background-color: var(--dj-accent) !important;
          color: var(--dj-on-accent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-hour.active, 
        html[data-tp-theme="dark"] .tp-ui-minutes.active {
          background-color: var(--dj-accent) !important;
          color: var(--dj-on-accent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-clock-hand, 
        html[data-tp-theme="dark"] .tp-ui-circle-hand, 
        html[data-tp-theme="dark"] .tp-ui-dot { background-color: var(--dj-accent) !important; }
        
        html[data-tp-theme="dark"] .tp-ui-wrapper-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 12px !important;
          flex-shrink: 0 !important;
        }
        html[data-tp-theme="dark"] .tp-ui-ok-btn, 
        html[data-tp-theme="dark"] .tp-ui-cancel-btn {
          box-sizing: border-box !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          line-height: 1.2 !important;
          padding: 8px 10px !important;
          width: 110px !important;
          min-width: 110px !important;
          max-width: 110px !important;
          min-height: 36px !important;
          max-height: 36px !important;
          text-align: center !important;
          flex: 0 0 110px !important;
          flex-shrink: 0 !important;
        }
        html[data-tp-theme="dark"] .tp-ui-cancel-btn {
          margin-right: 0 !important;
          color: var(--dj-text-heading) !important;
          background: transparent !important;
          border: 1px solid color-mix(in srgb, var(--dj-text-heading) 14%, transparent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-cancel-btn:hover {
          color: var(--dj-on-accent) !important;
          background-color: color-mix(in srgb, var(--dj-text-heading) 4%, transparent) !important;
          border-color: color-mix(in srgb, var(--dj-text-heading) 22%, transparent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-ok-btn {
          color: var(--dj-on-accent) !important;
          background: var(--dj-accent) !important;
          border: 1px solid var(--dj-accent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-ok-btn:hover {
          background-color: color-mix(in srgb, var(--dj-accent) 95%, var(--dj-black) 5%) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-mobile-clock-wrapper.expanded {
          height: auto !important;
          overflow: visible !important;
          padding-top: 12px !important;
          padding-bottom: 20px !important;
        }
        html[data-tp-theme="dark"] .tp-ui-body {
          background: var(--dj-bg-mid) !important;
          padding: 0 !important;
          margin: 0 auto !important;
        }
        html[data-tp-theme="dark"] .tp-ui-footer {
          background: var(--dj-bg-mid) !important;
          border-top: 1px solid color-mix(in srgb, var(--dj-text-heading) 8%, transparent) !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 10px 16px !important;
          min-height: 0 !important;
        }
        html[data-tp-theme="dark"] .tp-ui-keyboard-icon {
          box-sizing: border-box !important;
          width: 36px !important;
          min-width: 36px !important;
          height: 36px !important;
          min-height: 36px !important;
          padding: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--dj-text-heading) !important;
          background: transparent !important;
          border: 1px solid color-mix(in srgb, var(--dj-text-heading) 14%, transparent) !important;
          border-radius: 12px !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
        }
        html[data-tp-theme="dark"] .tp-ui-keyboard-icon:hover {
          color: var(--dj-on-accent) !important;
          border-color: var(--dj-accent) !important;
          background: color-mix(in srgb, var(--dj-accent) 10%, transparent) !important;
        }
        html[data-tp-theme="dark"] .tp-ui-clock-face {
          background: var(--dj-bg-card) !important;
          border-radius: 50% !important;
          aspect-ratio: 1 / 1 !important;
        }
        html[data-tp-theme="dark"] .tp-ui-clock-face span.tp-ui-hour-time-12,
        html[data-tp-theme="dark"] .tp-ui-clock-face span.tp-ui-hour-time-24,
        html[data-tp-theme="dark"] .tp-ui-clock-face span.tp-ui-minutes-time {
          color: var(--dj-text-heading) !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
}
