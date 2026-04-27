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
    if (!hourStr || !minStr) return;
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

  useEffect(() => {
    if (tpRef.current && value) tpRef.current.setValue(formatDisplay(value));
  }, [value]);

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
        /* Dark theme for timepicker-ui — scoped by html[data-tp-theme="dark"] */
        html[data-tp-theme="dark"] .tp-ui-wrapper[data-theme],
        html[data-tp-theme="dark"] .tp-ui-wrapper {
          --tp-primary: #ff2800 !important;
          --tp-on-primary: #ffffff !important;
          --tp-primary-container: #ff2800 !important;
          --tp-on-primary-container: #ffffff !important;
          --tp-backdrop: rgba(5, 5, 5, 0.88) !important;
          --tp-bg: #090909 !important;
          --tp-surface: #0c0c0c !important;
          --tp-surface-hover: rgba(255, 40, 0, 0.15) !important;
          --tp-input-bg: #0c0c0c !important;
          --tp-text: #fafafa !important;
          --tp-am-pm-active: #ff2800 !important;
          --tp-am-pm-text-selected: #ffffff !important;
          --tp-am-pm-text-unselected: #a3a3a3 !important;
          --tp-border: #262626 !important;
          --tp-outline: #ff2800 !important;
          --tp-shadow: 0 20px 48px rgba(0, 0, 0, 0.5) !important;
          --tp-border-radius: 22px !important;
        }

        html[data-tp-theme="dark"] .tp-ui-modal {
          background-color: rgba(5, 5, 5, 0.88) !important;
          z-index: 999999 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-wrapper {
          z-index: 1000000 !important;
          background: #090909 !important;
          border-radius: 22px !important;
          overflow: hidden !important;
          border: 1px solid #262626 !important;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5) !important;
          max-width: 340px !important;
        }

        html[data-tp-theme="dark"] .tp-ui-select-time { display: none !important; }

        html[data-tp-theme="dark"] .tp-ui-header {
          background: #050505 !important;
          color: #fafafa !important;
          padding-top: 30px !important;
        }

        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-hour,
        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-minutes {
          color: #fafafa !important;
          font-weight: 700 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-header .tp-ui-dots span {
          background-color: #fafafa !important;
        }

        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-hour,
        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-minutes,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-hour,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-minutes {
          color: #fafafa !important;
        }

        html[data-tp-theme="dark"] .tp-ui-body .tp-ui-dots span,
        html[data-tp-theme="dark"] .tp-ui-wrapper-time .tp-ui-dots span {
          background-color: #fafafa !important;
        }

        html[data-tp-theme="dark"] .tp-ui-am,
        html[data-tp-theme="dark"] .tp-ui-pm {
          background-color: #0c0c0c !important;
          color: #a3a3a3 !important;
          border-color: #262626 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-am:hover,
        html[data-tp-theme="dark"] .tp-ui-pm:hover {
          background-color: rgba(255, 40, 0, 0.08) !important;
        }

        html[data-tp-theme="dark"] .tp-ui-am.active,
        html[data-tp-theme="dark"] .tp-ui-pm.active {
          background-color: #ff2800 !important;
          color: #ffffff !important;
          border-color: #ff2800 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-hour-time-12.active,
        html[data-tp-theme="dark"] .tp-ui-hour-time-24.active,
        html[data-tp-theme="dark"] .tp-ui-minutes-time.active {
          background-color: #ff2800 !important;
          color: #ffffff !important;
        }

        html[data-tp-theme="dark"] .tp-ui-hour.active,
        html[data-tp-theme="dark"] .tp-ui-minutes.active {
          background-color: #ff2800 !important;
          color: #ffffff !important;
        }

        html[data-tp-theme="dark"] .tp-ui-clock-hand,
        html[data-tp-theme="dark"] .tp-ui-circle-hand,
        html[data-tp-theme="dark"] .tp-ui-dot {
          background-color: #ff2800 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-ok-btn {
          color: #ffffff !important;
          background: #ff2800 !important;
          border-radius: 12px !important;
          width: 110px !important;
        }

        html[data-tp-theme="dark"] .tp-ui-ok-btn:hover {
          background-color: #ff4d26 !important;
        }

        html[data-tp-theme="dark"] .tp-ui-cancel-btn {
          color: #fafafa !important;
          background: transparent !important;
          border: 1px solid #262626 !important;
          border-radius: 12px !important;
          width: 110px !important;
        }

        html[data-tp-theme="dark"] .tp-ui-cancel-btn:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        html[data-tp-theme="dark"] .tp-ui-clock-face {
          background: #0c0c0c !important;
        }
      `}</style>
    </div>
  );
}
