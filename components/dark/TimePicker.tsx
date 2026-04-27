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
    if (value) tp.setValue(formatDisplay(value));
    return () => { tpRef.current?.destroy(); tpRef.current = null; };
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
        /* Dark theme tokens for timepicker-ui (uses CSS vars from :root) */
        .tp-ui-wrapper[data-theme], .tp-ui-wrapper {
          --tp-primary: var(--dj-accent) !important;
          --tp-on-primary: var(--dj-on-accent) !important;
          --tp-primary-container: var(--dj-accent) !important;
          --tp-on-primary-container: var(--dj-on-accent) !important;
          --tp-backdrop: color-mix(in srgb, var(--dj-black) 60%, transparent) !important;
          --tp-bg: var(--dj-bg-mid) !important;
          --tp-surface: var(--driver-dark-surface) !important;
          --tp-surface-hover: color-mix(in srgb, var(--dj-accent) 10%, transparent) !important;
          --tp-input-bg: var(--driver-dark-surface) !important;
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
        .tp-ui-modal { background-color: color-mix(in srgb, var(--dj-black) 60%, transparent) !important; z-index: 999999 !important; }
        .tp-ui-wrapper { z-index: 1000000 !important; background: var(--dj-bg-mid) !important; border-radius: 22px !important; overflow: hidden !important; border: 1px solid var(--dj-border) !important; box-shadow: 0 10px 25px color-mix(in srgb, var(--dj-black) 40%, transparent) !important; max-width: 340px !important; font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important; }
        .tp-ui-select-time { display: none !important; }
        .tp-ui-header { background: var(--dj-bg-base) !important; color: var(--dj-text-heading) !important; padding-top: 30px !important; }
        .tp-ui-header .tp-ui-hour, .tp-ui-header .tp-ui-minutes { color: var(--dj-text-heading) !important; font-weight: 700 !important; font-size: clamp(28px, 8vw, 34px) !important; letter-spacing: -0.02em !important; }
        .tp-ui-header .tp-ui-dots span { background-color: var(--dj-text-heading) !important; }
        .tp-ui-body .tp-ui-hour, .tp-ui-body .tp-ui-minutes,
        .tp-ui-wrapper-time .tp-ui-hour, .tp-ui-wrapper-time .tp-ui-minutes { color: var(--dj-text-heading) !important; }
        .tp-ui-body .tp-ui-dots span, .tp-ui-wrapper-time .tp-ui-dots span { background-color: var(--dj-text-heading) !important; }
        .tp-ui-am, .tp-ui-pm { background-color: var(--driver-dark-surface) !important; color: var(--dj-text) !important; border-color: var(--dj-border) !important; }
        .tp-ui-am:hover, .tp-ui-pm:hover { background-color: color-mix(in srgb, var(--dj-accent) 8%, transparent) !important; }
        .tp-ui-am.active, .tp-ui-pm.active { background-color: var(--dj-accent) !important; color: var(--dj-on-accent) !important; border-color: var(--dj-accent) !important; }
        .tp-ui-hour-time-12.active, .tp-ui-hour-time-24.active, .tp-ui-minutes-time.active { background-color: var(--dj-accent) !important; color: var(--dj-on-accent) !important; }
        .tp-ui-hour.active, .tp-ui-minutes.active { background-color: var(--dj-accent) !important; color: var(--dj-on-accent) !important; }
        .tp-ui-clock-hand, .tp-ui-circle-hand, .tp-ui-dot { background-color: var(--dj-accent) !important; }
        .tp-ui-wrapper-btn { display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 12px !important; flex-shrink: 0 !important; }
        .tp-ui-ok-btn, .tp-ui-cancel-btn { box-sizing: border-box !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; border-radius: 12px !important; font-size: 11px !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; padding: 8px 10px !important; width: 110px !important; min-width: 110px !important; max-width: 110px !important; min-height: 36px !important; max-height: 36px !important; }
        .tp-ui-cancel-btn { color: var(--dj-text-heading) !important; background: transparent !important; border: 1px solid color-mix(in srgb, var(--dj-text-heading) 14%, transparent) !important; }
        .tp-ui-cancel-btn:hover { background-color: color-mix(in srgb, var(--dj-text-heading) 4%, transparent) !important; }
        .tp-ui-ok-btn { color: var(--dj-on-accent) !important; background: var(--dj-accent) !important; border: 1px solid var(--dj-accent) !important; }
        .tp-ui-ok-btn:hover { background-color: color-mix(in srgb, var(--dj-accent) 95%, var(--dj-black) 5%) !important; }
        .tp-ui-mobile-clock-wrapper.expanded { height: auto !important; overflow: visible !important; padding-top: 12px !important; padding-bottom: 20px !important; }
        .tp-ui-body { background: var(--dj-bg-mid) !important; padding: 0 !important; margin: 0 auto !important; }
        .tp-ui-footer { background: var(--dj-bg-mid) !important; border-top: 1px solid color-mix(in srgb, var(--dj-text-heading) 8%, transparent) !important; display: flex !important; justify-content: space-between !important; align-items: center !important; gap: 12px !important; padding: 10px 16px !important; min-height: 0 !important; }
        .tp-ui-footer > div:last-child { display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 12px !important; margin-left: auto !important; }
        .tp-ui-keyboard-icon-wrapper { display: inline-flex !important; align-items: center !important; justify-content: center !important; margin-right: auto !important; }
        .tp-ui-keyboard-icon { box-sizing: border-box !important; width: 36px !important; min-width: 36px !important; height: 36px !important; min-height: 36px !important; padding: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; color: var(--dj-text-heading) !important; background: transparent !important; border: 1px solid color-mix(in srgb, var(--dj-text-heading) 14%, transparent) !important; border-radius: 12px !important; }
        .tp-ui-keyboard-icon:hover { color: var(--dj-on-accent) !important; border-color: var(--dj-accent) !important; background: color-mix(in srgb, var(--dj-accent) 10%, transparent) !important; }
        .tp-ui-keyboard-icon svg, .tp-ui-keyboard-icon svg path { fill: currentColor !important; }
        .tp-ui-clock-face { background: var(--driver-dark-surface) !important; border-radius: 50% !important; aspect-ratio: 1 / 1 !important; }
        .tp-ui-normalize, .tp-ui-clock-face, .tp-ui-tip, .tp-ui-tip.-wrapper, .cale-in, .tp-ui-mobile-clock-wrapper { opacity: 1 !important; filter: none !important; }
        .tp-ui-clock-face .tp-ui-hour-time-12, .tp-ui-clock-face .tp-ui-hour-time-24, .tp-ui-clock-face .tp-ui-minutes-time,
        .tp-ui-normalize .tp-ui-hour-time-12, .tp-ui-normalize .tp-ui-hour-time-24, .tp-ui-normalize .tp-ui-minutes-time,
        span.tp-ui-hour-time-12, span.tp-ui-hour-time-24, span.tp-ui-minutes-time, span.tp-ui-minute-time { color: var(--dj-text-heading) !important; opacity: 1 !important; visibility: visible !important; text-shadow: none !important; font-weight: 600 !important; font-size: 14px !important; letter-spacing: 0 !important; }
        .tp-ui-input-time { background: var(--driver-dark-surface) !important; color: var(--dj-text-heading) !important; border-color: var(--dj-border) !important; }
        .tp-ui-input-time:focus, .tp-ui-input-time.active { border-color: var(--dj-accent) !important; }
        .tp-ui-wrapper-time .tp-ui-hour, .tp-ui-wrapper-time .tp-ui-minutes { border-radius: 12px !important; }
        .tp-ui-normalize .tp-ui-minutes-time.m3-green, .tp-ui-normalize .tp-ui-hour-time-12.m3-green, .tp-ui-normalize .tp-ui-hour-time-24.m3-green { color: var(--dj-text-heading) !important; opacity: 1 !important; text-shadow: none !important; font-weight: 600 !important; font-size: 14px !important; }
      `}</style>
    </div>
  );
}
