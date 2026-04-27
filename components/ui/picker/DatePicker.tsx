"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./picker-theme.css";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  theme?: "light" | "dark";
  accentColor?: string;
  borderRadius?: string;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  theme = "light",
  accentColor,
  borderRadius,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(d);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const formatDateDisplay = (d: Date | null) => {
    if (!d) return "No date selected";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
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

  const isDateSelected = (day: number) => {
    return selectedDate
      ? selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
      : false;
  };

  const isToday = (day: number) => {
    const c = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    c.setHours(0, 0, 0, 0);
    return c.getTime() === today.getTime();
  };

  const calendarDays = (() => {
    const days: (number | null)[] = [];
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  })();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const customStyles = {
    ...(accentColor && { "--picker-accent": accentColor }),
    ...(borderRadius && { "--picker-radius": borderRadius }),
  } as React.CSSProperties;

  return (
    <div className={`picker-container picker-theme-${theme} ${className}`} ref={containerRef} style={customStyles}>
      <button
        type="button"
        className="picker-trigger-input"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {formatDisplayValue() || <span className="picker-placeholder">{placeholder}</span>}
      </button>

      {isOpen && mounted && createPortal(
        <div
          className={`picker-overlay picker-theme-${theme}`}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          style={customStyles}
        >
          <div className="picker-modal date-picker-modal" role="dialog" aria-modal="true">
            <div className="picker-header">
              <div className="dp-year-label">{currentMonth.getFullYear()}</div>
              <div className="dp-selected-label">{formatDateDisplay(selectedDate)}</div>
            </div>

            <div className="dp-calendar-body">
              <div className="dp-nav">
                <button
                  type="button"
                  className="dp-nav-btn"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  aria-label="Previous Month"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <span className="dp-current-month">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button
                  type="button"
                  className="dp-nav-btn"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  aria-label="Next Month"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>

              <div className="dp-weekdays">
                {weekDays.map((d, i) => <span key={i}>{d}</span>)}
              </div>

              <div className="dp-days-grid">
                {calendarDays.map((day, i) => {
                  if (day === null) return <span key={i} className="dp-day-cell is-empty" />;
                  const disabled = isDateDisabled(day);
                  const selected = isDateSelected(day);
                  const isCurrentToday = isToday(day);

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`dp-day-cell ${selected ? "is-selected" : ""} ${isCurrentToday ? "is-today" : ""} ${disabled ? "is-disabled" : ""}`}
                      onClick={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="picker-footer">
              <button type="button" className="picker-btn" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="button" className="picker-btn picker-btn-primary" onClick={() => setIsOpen(false)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        .picker-trigger-input {
          display: block; width: 100%; background: transparent; border: none;
          color: var(--picker-text, #a1a1aa); font-size: 14px;
          font-weight: 300; padding: 10px 0; outline: none; transition: border-color 0.2s;
          font-family: inherit; text-align: left; cursor: pointer;
        }
        .picker-placeholder { color: var(--picker-text-muted, #a1a1aa); }

        .dp-year-label { 
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em; 
          text-transform: uppercase; color: var(--picker-accent); 
          margin-bottom: 4px;
        }
        .dp-selected-label { 
          font-size: 24px; font-weight: 800; color: var(--picker-text); 
          letter-spacing: -0.02em; 
        }

        .dp-calendar-body { padding: 16px 20px 20px; }
        .dp-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .dp-current-month { font-size: 14px; font-weight: 700; color: var(--picker-text); }
        .dp-nav-btn {
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: 1px solid var(--picker-border);
          color: var(--picker-text-muted); transition: all 0.2s; background: transparent; cursor: pointer;
        }
        .dp-nav-btn:hover { color: var(--picker-text); border-color: var(--picker-accent); background: var(--picker-surface); }

        .dp-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
        .dp-weekdays span { font-size: 10px; font-weight: 700; color: var(--picker-text-muted); text-align: center; }

        .dp-days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .dp-day-cell {
          aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 500; color: var(--picker-text);
          border-radius: 10px; border: 1px solid transparent; background: transparent;
          cursor: pointer; transition: all 0.15s;
        }
        .dp-day-cell:not(.is-disabled):not(.is-selected):hover { 
          background: var(--picker-day-hover); border-color: var(--picker-border); 
        }
        .dp-day-cell.is-today { 
          color: var(--picker-accent); font-weight: 700; border-color: var(--picker-accent); border-style: dashed;
        }
        .dp-day-cell.is-selected { 
          background: var(--picker-accent); color: var(--picker-on-accent); 
          font-weight: 700; border-color: var(--picker-accent);
        }
        .dp-day-cell.is-disabled { 
          color: var(--picker-text-muted); opacity: 0.3; cursor: not-allowed; 
        }
        .dp-day-cell.is-empty { cursor: default; pointer-events: none; }
      `}</style>
    </div>
  );
}
