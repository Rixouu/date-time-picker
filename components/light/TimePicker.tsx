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
  placeholder = "Select Time" 
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timepickerRef = useRef<TimepickerUI | null>(null);

  // Format time for display (HH:mm -> hh:mm AM/PM)
  const formatDisplayTime = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize timepicker
    const timepicker = new TimepickerUI(inputRef.current, {
      ui: {
        theme: 'm3-green', // Material Design 3 theme
        mobile: false, // Will auto-detect based on screen size
        enableSwitchIcon: true, // Allow switching between mobile/desktop
        backdrop: true,
        animation: true,
      },
      clock: {
        type: '12h', // 12-hour format
        incrementMinutes: 5, // 5-minute increments
        autoSwitchToMinutes: true, // Auto switch to minutes after selecting hour
      },
      callbacks: {
        onConfirm: (eventData: ConfirmEventData) => {
          if (eventData.hour && eventData.minutes) {
            const h = parseInt(eventData.hour);
            const m = parseInt(eventData.minutes);
            let h24 = h;
            if (eventData.type === 'PM' && h !== 12) {
              h24 = h + 12;
            } else if (eventData.type === 'AM' && h === 12) {
              h24 = 0;
            }
            const time24h = `${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            onChange(time24h);
          }
        },
        onUpdate: (eventData: UpdateEventData) => {
          if (eventData.hour && eventData.minutes) {
            const h = parseInt(eventData.hour);
            const m = parseInt(eventData.minutes);
            let h24 = h;
            if (eventData.type === 'PM' && h !== 12) {
              h24 = h + 12;
            } else if (eventData.type === 'AM' && h === 12) {
              h24 = 0;
            }
            const time24h = `${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            onChange(time24h);
          }
        },
      },
    });

    timepickerRef.current = timepicker;
    timepicker.create();

    const applyDisplay = (time24: string) => {
      const input = inputRef.current;
      if (!time24) {
        if (input) input.value = "";
        return;
      }
      const display = formatDisplayTime(time24);
      if (input) input.value = display;
      if (timepickerRef.current) timepickerRef.current.setValue(display);
    };

    queueMicrotask(() => applyDisplay(value));
    requestAnimationFrame(() => applyDisplay(value));
    setTimeout(() => applyDisplay(value), 50);

    const handleFocus = () => document.documentElement.setAttribute("data-tp-theme", "light");
    inputRef.current?.addEventListener("focus", handleFocus);
    inputRef.current?.addEventListener("click", handleFocus);

    return () => {
      if (timepickerRef.current) {
        timepickerRef.current.destroy();
        timepickerRef.current = null;
      }
      inputRef.current?.removeEventListener("focus", handleFocus);
      inputRef.current?.removeEventListener("click", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const run = () => {
      const input = inputRef.current;
      const tp = timepickerRef.current;
      if (!value) {
        if (input) input.value = "";
        return;
      }
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
    <div className="booking-time-picker">
      <input
        ref={inputRef}
        type="text"
        className="booking-time-input"
        placeholder={placeholder}
        readOnly
        style={{
          width: '100%',
          height: '32px',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '14px',
          fontWeight: 500,
          padding: 0,
          outline: 'none',
          cursor: 'pointer',
          color: 'inherit',
          fontFamily: 'inherit',
        }}
      />
      <style jsx global>{`
        .booking-time-input::placeholder {
          color: #999 !important;
          font-weight: 500 !important;
          opacity: 1 !important;
        }
        
        html[data-tp-theme="light"] .tp-ui-wrapper[data-theme],
        html[data-tp-theme="light"] .tp-ui-wrapper {
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

        html[data-tp-theme="light"] .tp-ui-modal {
          background-color: rgba(0, 0, 0, 0.5) !important;
          z-index: 999999 !important;
        }

        html[data-tp-theme="light"] .tp-ui-wrapper {
          z-index: 1000000 !important;
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
          max-width: 400px !important;
          font-family: inherit !important;
        }

        html[data-tp-theme="light"] .tp-ui-select-time {
          display: none !important;
        }

        html[data-tp-theme="light"] .tp-ui-header {
          background: #000000 !important;
          color: white !important;
          padding-top: 30px !important;
        }

        html[data-tp-theme="light"] .tp-ui-header .tp-ui-hour,
        html[data-tp-theme="light"] .tp-ui-header .tp-ui-minutes {
          color: white !important;
        }

        html[data-tp-theme="light"] .tp-ui-header .tp-ui-dots span {
          background-color: white !important;
        }

        html[data-tp-theme="light"] .tp-ui-body .tp-ui-hour,
        html[data-tp-theme="light"] .tp-ui-body .tp-ui-minutes,
        html[data-tp-theme="light"] .tp-ui-wrapper-time .tp-ui-hour,
        html[data-tp-theme="light"] .tp-ui-wrapper-time .tp-ui-minutes {
          color: #333 !important;
        }

        html[data-tp-theme="light"] .tp-ui-body .tp-ui-dots span,
        html[data-tp-theme="light"] .tp-ui-wrapper-time .tp-ui-dots span {
          background-color: #333 !important;
        }

        html[data-tp-theme="light"] .tp-ui-am,
        html[data-tp-theme="light"] .tp-ui-pm {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #333 !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }

        html[data-tp-theme="light"] .tp-ui-am:hover,
        html[data-tp-theme="light"] .tp-ui-pm:hover {
          background-color: rgba(255, 40, 0, 0.08) !important;
        }

        html[data-tp-theme="light"] .tp-ui-am.active,
        html[data-tp-theme="light"] .tp-ui-pm.active {
          background-color: #FF2800 !important;
          color: white !important;
          border-color: #FF2800 !important;
        }

        html[data-tp-theme="light"] .tp-ui-hour-time-12.active,
        html[data-tp-theme="light"] .tp-ui-hour-time-24.active,
        html[data-tp-theme="light"] .tp-ui-minutes-time.active {
          background-color: #FF2800 !important;
          color: white !important;
        }

        html[data-tp-theme="light"] .tp-ui-hour.active,
        html[data-tp-theme="light"] .tp-ui-minutes.active {
          background-color: #FF2800 !important;
          color: white !important;
        }

        html[data-tp-theme="light"] .tp-ui-clock-hand,
        html[data-tp-theme="light"] .tp-ui-circle-hand,
        html[data-tp-theme="light"] .tp-ui-dot {
          background-color: #FF2800 !important;
        }

        html[data-tp-theme="light"] .tp-ui-ok-btn {
          color: #FF2800 !important;
        }

        html[data-tp-theme="light"] .tp-ui-ok-btn:hover {
          background-color: rgba(255, 40, 0, 0.1) !important;
        }

        html[data-tp-theme="light"] .tp-ui-cancel-btn {
          color: #6c757d !important;
        }

        html[data-tp-theme="light"] .tp-ui-cancel-btn:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}
