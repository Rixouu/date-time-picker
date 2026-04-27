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
    <div className="lp-date-picker" ref={ref}>
      <button
        type="button"
        className="lp-inf lp-inf--trigger lp-date-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={placeholder}
      >
        {formatDisplayValue() || <span className="lp-inf-placeholder">{placeholder}</span>}
      </button>
      {isOpen && mounted && createPortal(
        <div className="lp-dp-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
          <div className="lp-dp" onClick={(e) => e.stopPropagation()}>
            <div className="lp-dp-header">
              <div className="lp-dp-year">{currentMonth.getFullYear()}</div>
              <div className="lp-dp-selected">{formatDateDisplay(selectedDate)}</div>
            </div>
            <div className="lp-dp-calendar">
              <div className="lp-dp-month-nav">
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
              <div className="lp-dp-weekdays">{weekDays.map((d, i) => <span key={i}>{d}</span>)}</div>
              <div className="lp-dp-days">
                {calendarDays.map((day, i) => {
                  if (day === null) return <span key={i} className="lp-dp-day is-empty" />;
                  const disabled = isDateDisabled(day);
                  return (
                    <button key={i} type="button" className={`lp-dp-day ${isDateSelected(day) ? "is-sel" : ""} ${isToday(day) ? "is-today" : ""} ${disabled ? "is-disabled" : ""}`} onClick={() => !disabled && handleDateSelect(day)} disabled={disabled}>{day}</button>
                  );
                })}
              </div>
            </div>
            <div className="lp-dp-actions">
              <button type="button" className="lp-dp-btn" onClick={() => setIsOpen(false)}>CANCEL</button>
              <button type="button" className="lp-dp-btn is-ok" onClick={() => setIsOpen(false)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style jsx global>{`
        .lp-inf {
          display: block; width: 100%; background: transparent; border: none;
          border-bottom: 1px solid #e4e4e7; color: #18181b; font-size: 14px;
          font-weight: 300; padding: 9px 0; outline: none; transition: border-color 0.2s;
          font-family: inherit; -webkit-appearance: none; appearance: none;
        }
        .lp-inf:focus { border-bottom-color: #FF2800; }
        .lp-inf-placeholder { color: #999; font-weight: 300; }
        .lp-inf--trigger { cursor: pointer; }

        .lp-dp-overlay {
          position: fixed; inset: 0; z-index: 999999;
          background: rgba(0, 0, 0, 0.4); display: flex;
          align-items: center; justify-content: center;
        }
        .lp-dp {
          background: #ffffff; border: 1px solid #e4e4e7; width: 320px;
          max-width: 95vw; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-radius: 22px; overflow: hidden; font-family: inherit;
        }
        .lp-dp button { background: transparent; padding: 0; cursor: pointer; border: none; }
        
        .lp-dp-header { background: #f8fafc; padding: 16px 20px; border-bottom: 1px solid #e4e4e7; }
        .lp-dp-year { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #FF2800; }
        .lp-dp-selected { font-size: 24px; font-weight: 800; color: #18181b; letter-spacing: -0.02em; margin-top: 2px; }

        .lp-dp-calendar { padding: 12px 20px; }
        .lp-dp-month-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .lp-dp-month-nav span { font-size: 14px; font-weight: 600; color: #18181b; }
        .lp-dp-month-nav button {
          color: #71717a; width: 32px; height: 32px; display: inline-flex;
          align-items: center; justify-content: center; border: 1px solid #e4e4e7;
          background: #ffffff; border-radius: 10px;
        }
        .lp-dp-month-nav button:hover { color: #18181b; border-color: #FF2800; }

        .lp-dp-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 6px; }
        .lp-dp-weekdays span { font-size: 10px; font-weight: 600; color: #71717a; }

        .lp-dp-days { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 2px; }
        .lp-dp-day {
          width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 500; color: #18181b; transition: all 0.15s;
          margin: 0 auto; background: transparent; border: 1px solid #f4f4f5; border-radius: 0; cursor: pointer;
        }
        .lp-dp-day.is-empty { visibility: hidden; border-color: transparent; }
        .lp-dp-day.is-disabled { color: #e4e4e7; cursor: not-allowed; border-color: #f8fafc; }
        .lp-dp-day.is-today { color: #FF2800; font-weight: 700; border-color: rgba(255, 40, 0, 0.2); }
        .lp-dp-day.is-sel { background: #FF2800; color: #ffffff; border: 1px solid #FF2800; font-weight: 700; }
        .lp-dp-day:not(.is-disabled):not(.is-sel):hover { background: #f8fafc; border-color: #FF2800; }

        .lp-dp-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; padding: 10px 16px; border-top: 1px solid #e4e4e7; }
        .lp-dp-btn {
          box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center;
          flex: 0 0 110px; width: 110px; min-width: 110px; max-width: 110px; min-height: 36px; max-height: 36px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #71717a; padding: 8px 10px; border: 1px solid #e4e4e7; background: transparent; border-radius: 12px; cursor: pointer;
        }
        .lp-dp-btn:hover { color: #18181b; }
        .lp-dp-btn.is-ok { color: #ffffff; border-color: #FF2800; background: #FF2800; }
        .lp-dp-btn.is-ok:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
