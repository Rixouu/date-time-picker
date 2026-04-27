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

  const formatDisplayTime = (timeString: string): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const parseTo24 = (eventData: ConfirmEventData | UpdateEventData) => {
    if (!eventData.hour || !eventData.minutes) return;
    const h = parseInt(eventData.hour);
    const m = parseInt(eventData.minutes);
    let h24 = h;
    if (eventData.type === "PM" && h !== 12) h24 = h + 12;
    else if (eventData.type === "AM" && h === 12) h24 = 0;
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
          height: "32px",
          border: "none",
          backgroundColor: "transparent",
          fontSize: "14px",
          fontWeight: 500,
          padding: 0,
          outline: "none",
          cursor: "pointer",
          color: "#333",
        }}
      />
      <style jsx global>{`
        .lp-time-input::placeholder { color: #999 !important; font-weight: 500 !important; }

        /* Override timepicker-ui to match light mode brand colours */
        .tp-ui-wrapper[data-theme], .tp-ui-wrapper {
          --tp-primary: #FF2800 !important;
          --tp-on-primary: #fff !important;
          --tp-primary-container: #FF2800 !important;
          --tp-on-primary-container: #fff !important;
          --tp-backdrop: rgba(0, 0, 0, 0.5) !important;
          --tp-bg: #fff !important;
          --tp-surface: #fff !important;
          --tp-surface-hover: rgba(255, 40, 0, 0.1) !important;
          --tp-input-bg: #fff !important;
          --tp-am-pm-active: #FF2800 !important;
          --tp-am-pm-text-selected: #fff !important;
          --tp-am-pm-text-unselected: #333 !important;
          --tp-border: rgba(255, 255, 255, 0.3) !important;
          --tp-outline: #FF2800 !important;
          --tp-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
          --tp-border-radius: 8px !important;
        }

        .tp-ui-modal { background-color: rgba(0, 0, 0, 0.5) !important; z-index: 999999 !important; }
        .tp-ui-wrapper { z-index: 1000000 !important; background: white !important; border-radius: 8px !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important; max-width: 400px !important; }
        .tp-ui-select-time { display: none !important; }
        .tp-ui-header { background: #000 !important; color: white !important; padding-top: 30px !important; }
        .tp-ui-header .tp-ui-hour, .tp-ui-header .tp-ui-minutes { color: white !important; }
        .tp-ui-header .tp-ui-dots span { background-color: white !important; }
        .tp-ui-body .tp-ui-hour, .tp-ui-body .tp-ui-minutes,
        .tp-ui-wrapper-time .tp-ui-hour, .tp-ui-wrapper-time .tp-ui-minutes { color: #333 !important; }
        .tp-ui-body .tp-ui-dots span, .tp-ui-wrapper-time .tp-ui-dots span { background-color: #333 !important; }
        .tp-ui-am, .tp-ui-pm { background-color: rgba(255, 255, 255, 0.1) !important; color: #333 !important; border-color: rgba(0, 0, 0, 0.15) !important; }
        .tp-ui-am:hover, .tp-ui-pm:hover { background-color: rgba(255, 40, 0, 0.08) !important; }
        .tp-ui-am.active, .tp-ui-pm.active { background-color: #FF2800 !important; color: white !important; border-color: #FF2800 !important; }
        .tp-ui-hour-time-12.active, .tp-ui-hour-time-24.active, .tp-ui-minutes-time.active { background-color: #FF2800 !important; color: white !important; }
        .tp-ui-hour.active, .tp-ui-minutes.active { background-color: #FF2800 !important; color: white !important; }
        .tp-ui-clock-hand, .tp-ui-circle-hand, .tp-ui-dot { background-color: #FF2800 !important; }
        .tp-ui-ok-btn { color: #FF2800 !important; }
        .tp-ui-ok-btn:hover { background-color: rgba(255, 40, 0, 0.1) !important; }
        .tp-ui-cancel-btn { color: #6c757d !important; }
        .tp-ui-cancel-btn:hover { background-color: #f3f4f6 !important; }
      `}</style>
    </div>
  );
}
