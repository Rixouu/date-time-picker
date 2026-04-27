"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { TimepickerUI, type ConfirmEventData, type UpdateEventData } from "timepicker-ui";
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
  const timepickerRef = useRef<TimepickerUI | null>(null);

  const formatDisplayTime = (ts: string): string => {
    if (!ts) return "";
    const [hours, minutes] = ts.split(":");
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const parseTo24 = (data: ConfirmEventData | UpdateEventData) => {
    if (!data.hour || !data.minutes) return;
    const h = parseInt(data.hour);
    const m = parseInt(data.minutes);
    let h24 = h;
    if (data.type === "PM" && h !== 12) h24 = h + 12;
    else if (data.type === "AM" && h === 12) h24 = 0;
    onChange(`${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  useEffect(() => {
    if (!inputRef.current) return;

    const tp = new TimepickerUI(inputRef.current, {
      ui: { theme: "m3-green", mobile: false, enableSwitchIcon: true, backdrop: true, animation: true },
      clock: { type: "12h", incrementMinutes: 5, autoSwitchToMinutes: true },
      callbacks: { onConfirm: parseTo24, onUpdate: parseTo24 },
    });

    timepickerRef.current = tp;
    tp.create();

    const applyDisplay = (time24: string) => {
      const input = inputRef.current;
      if (!time24) { if (input) input.value = ""; return; }
      const display = formatDisplayTime(time24);
      if (input) input.value = display;
      if (timepickerRef.current) timepickerRef.current.setValue(display);
    };

    queueMicrotask(() => applyDisplay(value));
    requestAnimationFrame(() => applyDisplay(value));
    setTimeout(() => applyDisplay(value), 50);

    return () => {
      timepickerRef.current?.destroy();
      timepickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const run = () => {
      const input = inputRef.current;
      const tp = timepickerRef.current;
      if (!value) { if (input) input.value = ""; return; }
      const display = formatDisplayTime(value);
      if (input) input.value = display;
      if (tp) tp.setValue(display);
    };
    run();
    requestAnimationFrame(run);
    const t = window.setTimeout(run, 50);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <div className="lp-time-picker">
      <input
        ref={inputRef}
        type="text"
        className="lp-time-input"
        placeholder={placeholder}
        readOnly
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          fontSize: "14px",
          fontWeight: 400,
          color: "#18181b",
          outline: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          lineHeight: 1.5,
        }}
      />
      <style jsx global>{`
        .lp-time-input::placeholder { color: rgba(82, 82, 91, 0.5) !important; font-weight: 300 !important; }

        /* Light theme for timepicker-ui — matches light DatePicker design */
        .tp-ui-wrapper[data-theme], .tp-ui-wrapper {
          --tp-primary: #FF2800 !important;
          --tp-on-primary: #fff !important;
          --tp-primary-container: #FF2800 !important;
          --tp-on-primary-container: #fff !important;
          --tp-backdrop: rgba(0, 0, 0, 0.45) !important;
          --tp-bg: #fff !important;
          --tp-surface: #f4f4f5 !important;
          --tp-surface-hover: rgba(255, 40, 0, 0.06) !important;
          --tp-input-bg: #f4f4f5 !important;
          --tp-text: #18181b !important;
          --tp-am-pm-active: #FF2800 !important;
          --tp-am-pm-text-selected: #fff !important;
          --tp-am-pm-text-unselected: #52525b !important;
          --tp-border: #e4e4e7 !important;
          --tp-outline: #FF2800 !important;
          --tp-shadow: 0 14px 36px rgba(15, 23, 42, 0.12) !important;
          --tp-border-radius: 22px !important;
        }

        .tp-ui-modal       { background-color: rgba(0, 0, 0, 0.45) !important; z-index: 999999 !important; }
        .tp-ui-wrapper     { z-index: 1000000 !important; background: #fff !important; border-radius: 22px !important; overflow: hidden !important; border: 1px solid #e4e4e7 !important; box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12) !important; max-width: 320px !important; font-family: inherit !important; }
        .tp-ui-select-time { display: none !important; }

        /* Header — matches lp-header */
        .tp-ui-header      { background: #f4f4f5 !important; color: #18181b !important; padding-top: 24px !important; }
        .tp-ui-header .tp-ui-hour,
        .tp-ui-header .tp-ui-minutes { color: #18181b !important; font-weight: 800 !important; font-size: clamp(28px, 8vw, 34px) !important; letter-spacing: -0.02em !important; }
        .tp-ui-header .tp-ui-dots span { background-color: #18181b !important; }

        .tp-ui-body .tp-ui-hour, .tp-ui-body .tp-ui-minutes,
        .tp-ui-wrapper-time .tp-ui-hour, .tp-ui-wrapper-time .tp-ui-minutes { color: #18181b !important; }
        .tp-ui-body .tp-ui-dots span,
        .tp-ui-wrapper-time .tp-ui-dots span                                  { background-color: #18181b !important; }

        .tp-ui-am, .tp-ui-pm                    { background-color: #f4f4f5 !important; color: #52525b !important; border-color: #e4e4e7 !important; }
        .tp-ui-am:hover, .tp-ui-pm:hover        { background-color: rgba(255, 40, 0, 0.06) !important; }
        .tp-ui-am.active, .tp-ui-pm.active      { background-color: #FF2800 !important; color: #fff !important; border-color: #FF2800 !important; }

        .tp-ui-hour-time-12.active, .tp-ui-hour-time-24.active,
        .tp-ui-minutes-time.active              { background-color: #FF2800 !important; color: #fff !important; }
        .tp-ui-hour.active, .tp-ui-minutes.active { background-color: #FF2800 !important; color: #fff !important; }
        .tp-ui-clock-hand, .tp-ui-circle-hand, .tp-ui-dot { background-color: #FF2800 !important; }

        /* Footer buttons — fixed width matching lp-btn */
        .tp-ui-wrapper-btn { display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 12px !important; }
        .tp-ui-ok-btn, .tp-ui-cancel-btn {
          box-sizing: border-box !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          padding: 8px 10px !important;
          width: 110px !important;
          min-width: 110px !important;
          max-width: 110px !important;
          min-height: 36px !important;
          max-height: 36px !important;
        }
        .tp-ui-cancel-btn       { color: #52525b !important; background: transparent !important; border: 1px solid #e4e4e7 !important; }
        .tp-ui-cancel-btn:hover { color: #18181b !important; }
        .tp-ui-ok-btn           { color: #fff !important; background: #FF2800 !important; border: 1px solid #FF2800 !important; }
        .tp-ui-ok-btn:hover     { background: #ff4d26 !important; border-color: #ff4d26 !important; }

        .tp-ui-mobile-clock-wrapper.expanded { height: auto !important; overflow: visible !important; padding-top: 12px !important; padding-bottom: 20px !important; }
        .tp-ui-body   { background: #fff !important; padding: 0 !important; margin: 0 auto !important; }
        .tp-ui-footer { background: #fff !important; border-top: 1px solid #e4e4e7 !important; display: flex !important; justify-content: space-between !important; align-items: center !important; gap: 12px !important; padding: 10px 16px !important; }
        .tp-ui-footer > div:last-child { display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 12px !important; margin-left: auto !important; }
        .tp-ui-keyboard-icon-wrapper { display: inline-flex !important; align-items: center !important; justify-content: center !important; margin-right: auto !important; }
        .tp-ui-keyboard-icon {
          box-sizing: border-box !important;
          width: 36px !important; min-width: 36px !important; height: 36px !important; min-height: 36px !important;
          padding: 0 !important;
          display: inline-flex !important; align-items: center !important; justify-content: center !important;
          color: #52525b !important; background: transparent !important;
          border: 1px solid #e4e4e7 !important; border-radius: 12px !important;
        }
        .tp-ui-keyboard-icon:hover { border-color: #FF2800 !important; color: #FF2800 !important; }
        .tp-ui-keyboard-icon svg, .tp-ui-keyboard-icon svg path { fill: currentColor !important; }
        .tp-ui-clock-face { background: #f4f4f5 !important; border-radius: 50% !important; aspect-ratio: 1 / 1 !important; }
        .tp-ui-normalize, .tp-ui-clock-face, .tp-ui-tip, .tp-ui-mobile-clock-wrapper { opacity: 1 !important; filter: none !important; }
        .tp-ui-clock-face .tp-ui-hour-time-12, .tp-ui-clock-face .tp-ui-hour-time-24,
        .tp-ui-clock-face .tp-ui-minutes-time, .tp-ui-normalize .tp-ui-hour-time-12,
        .tp-ui-normalize .tp-ui-hour-time-24, .tp-ui-normalize .tp-ui-minutes-time,
        span.tp-ui-hour-time-12, span.tp-ui-hour-time-24, span.tp-ui-minutes-time, span.tp-ui-minute-time {
          color: #18181b !important; opacity: 1 !important; font-weight: 600 !important; font-size: 14px !important;
        }
        .tp-ui-input-time { background: #f4f4f5 !important; color: #18181b !important; border-color: #e4e4e7 !important; }
        .tp-ui-input-time:focus, .tp-ui-input-time.active { border-color: #FF2800 !important; }
        .tp-ui-wrapper-time .tp-ui-hour, .tp-ui-wrapper-time .tp-ui-minutes { border-radius: 12px !important; }
      `}</style>
    </div>
  );
}
