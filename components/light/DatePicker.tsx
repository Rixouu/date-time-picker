"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) { setSelectedDate(d); setCurrentMonth(d); }
    } else { setSelectedDate(null); }
  }, [value]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const formatDateDisplay = (d: Date | null) => {
    if (!d) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatDisplayValue = () => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const isDateDisabled = (day: number) => {
    const c = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    c.setHours(0, 0, 0, 0);
    return c < today;
  };

  const isDateSelected = (day: number) =>
    selectedDate
      ? selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()
      : false;

  const isToday = (day: number) => {
    const c = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    c.setHours(0, 0, 0, 0);
    return c.getTime() === today.getTime();
  };

  const calendarDays = (() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < getFirstDayOfMonth(currentMonth); i++) days.push(null);
    for (let d = 1; d <= getDaysInMonth(currentMonth); d++) days.push(d);
    return days;
  })();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function handleDateSelect(day: number) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(d);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }

  return (
    <div className="lp-date-picker" ref={ref}>
      <button
        type="button"
        className="lp-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={placeholder}
      >
        {formatDisplayValue() || <span className="lp-placeholder">{placeholder}</span>}
      </button>

      {isOpen && mounted && createPortal(
        <div
          className="lp-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lp-header">
              <div className="lp-header-year">{currentMonth.getFullYear()}</div>
              <div className="lp-header-date">{formatDateDisplay(selectedDate)}</div>
            </div>

            <div className="lp-calendar">
              <div className="lp-month-nav">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="lp-weekdays">
                {weekDays.map((d, i) => <span key={i}>{d}</span>)}
              </div>

              <div className="lp-days">
                {calendarDays.map((day, i) => {
                  if (day === null) return <span key={i} className="lp-day lp-day--empty" />;
                  const disabled = isDateDisabled(day);
                  return (
                    <button
                      key={i}
                      type="button"
                      className={[
                        "lp-day",
                        isDateSelected(day) ? "lp-day--sel" : "",
                        isToday(day) ? "lp-day--today" : "",
                        disabled ? "lp-day--disabled" : "",
                      ].join(" ")}
                      onClick={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lp-actions">
              <button type="button" className="lp-btn" onClick={() => setIsOpen(false)}>CANCEL</button>
              <button type="button" className="lp-btn lp-btn--ok" onClick={() => setIsOpen(false)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        .lp-date-picker { width: 100%; position: relative; }

        .lp-trigger {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0;
          font-size: 14px;
          font-weight: 400;
          color: #18181b;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          line-height: 1.5;
        }

        .lp-placeholder { color: rgba(82, 82, 91, 0.5); font-weight: 300; }

        .lp-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lp-modal {
          background: #fff;
          border: 1px solid #e4e4e7;
          border-radius: 22px;
          width: 100%;
          max-width: 320px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12);
          position: relative;
          z-index: 1000000;
        }

        .lp-header {
          background: #f4f4f5;
          padding: 16px 20px;
        }

        .lp-header-year {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FF2800;
        }

        .lp-header-date {
          font-size: 24px;
          font-weight: 800;
          color: #18181b;
          letter-spacing: -0.02em;
          margin-top: 2px;
        }

        .lp-calendar { padding: 12px 20px; }

        .lp-month-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .lp-month-nav button {
          color: #52525b;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e4e4e7;
          background: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .lp-month-nav button:hover { border-color: #FF2800; color: #18181b; }

        .lp-month-nav span {
          font-size: 14px;
          font-weight: 600;
          color: #18181b;
        }

        .lp-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 6px;
        }

        .lp-weekdays span {
          font-size: 10px;
          font-weight: 600;
          color: #a1a1aa;
        }

        .lp-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          gap: 2px;
        }

        .lp-day {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #18181b;
          transition: all 0.15s;
          margin: 0 auto;
          background: transparent;
          border: 1px solid #e4e4e7;
          border-radius: 0;
          cursor: pointer;
        }

        .lp-day--empty    { visibility: hidden; border-color: transparent; cursor: default; }
        .lp-day--disabled { color: #d4d4d8; cursor: not-allowed; border-color: #f4f4f5; }
        .lp-day--today    { color: #FF2800; font-weight: 700; border-color: rgba(255, 40, 0, 0.35); }
        .lp-day--sel      { background: #FF2800; color: #fff; border-color: #FF2800; font-weight: 700; border-radius: 0; }
        .lp-day:not(.lp-day--disabled):not(.lp-day--sel):hover { background: #f4f4f5; border-color: #FF2800; }

        .lp-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-top: 1px solid #e4e4e7;
        }

        .lp-btn {
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 110px;
          width: 110px;
          min-width: 110px;
          max-width: 110px;
          min-height: 36px;
          max-height: 36px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #52525b;
          padding: 8px 10px;
          border: 1px solid #e4e4e7;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
        }

        .lp-btn:hover         { color: #18181b; }
        .lp-btn--ok           { color: #fff; background: #FF2800; border-color: #FF2800; }
        .lp-btn--ok:hover     { background: #ff4d26; border-color: #ff4d26; }
      `}</style>
    </div>
  );
}
