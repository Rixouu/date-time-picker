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

  const handleDateSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(d);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
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

  const isDateDisabled = (day: number) => { const c = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day); c.setHours(0, 0, 0, 0); return c < today; };
  const isDateSelected = (day: number) => selectedDate ? selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear() : false;
  const isToday = (day: number) => { const c = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day); c.setHours(0, 0, 0, 0); return c.getTime() === today.getTime(); };

  const calendarDays = (() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < getFirstDayOfMonth(currentMonth); i++) days.push(null);
    for (let d = 1; d <= getDaysInMonth(currentMonth); d++) days.push(d);
    return days;
  })();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bd-date-picker" ref={ref}>
      <button
        type="button"
        className="bd-inf bd-inf--trigger bd-date-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={placeholder}
      >
        {formatDisplayValue() || <span className="bd-inf-placeholder">{placeholder}</span>}
      </button>
      {isOpen && mounted && createPortal(
        <div className="bd-dp-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
          <div className="bd-dp" onClick={(e) => e.stopPropagation()}>
            <div className="bd-dp-header">
              <div className="bd-dp-year">{currentMonth.getFullYear()}</div>
              <div className="bd-dp-selected">{formatDateDisplay(selectedDate)}</div>
            </div>
            <div className="bd-dp-calendar">
              <div className="bd-dp-month-nav">
                <button
                  type="button"
                  aria-label="Previous Month"
                  title="Previous Month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button
                  type="button"
                  aria-label="Next Month"
                  title="Next Month"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
              <div className="bd-dp-weekdays">{weekDays.map((d, i) => <span key={i}>{d}</span>)}</div>
              <div className="bd-dp-days">
                {calendarDays.map((day, i) => {
                  if (day === null) return <span key={i} className="bd-dp-day is-empty" />;
                  const disabled = isDateDisabled(day);
                  return (
                    <button key={i} type="button" className={`bd-dp-day ${isDateSelected(day) ? "is-sel" : ""} ${isToday(day) ? "is-today" : ""} ${disabled ? "is-disabled" : ""}`} onClick={() => !disabled && handleDateSelect(day)} disabled={disabled}>{day}</button>
                  );
                })}
              </div>
            </div>
            <div className="bd-dp-actions">
              <button type="button" className="bd-dp-btn" onClick={() => setIsOpen(false)}>CANCEL</button>
              <button type="button" className="bd-dp-btn is-ok" onClick={() => setIsOpen(false)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
