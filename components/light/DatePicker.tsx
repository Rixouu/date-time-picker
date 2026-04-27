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
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onChange(
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );
  };

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatDisplayValue = () => {
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const isDateDisabled = (day: number) => {
    const check = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const isDateSelected = (day: number) =>
    selectedDate
      ? selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()
      : false;

  const isToday = (day: number) => {
    const check = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    check.setHours(0, 0, 0, 0);
    return check.getTime() === today.getTime();
  };

  const generateCalendarDays = () => {
    const days: (number | null)[] = [];
    for (let i = 0; i < getFirstDayOfMonth(currentMonth); i++) days.push(null);
    for (let d = 1; d <= getDaysInMonth(currentMonth); d++) days.push(d);
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="lp-date-picker" ref={datePickerRef}>
      <div className="lp-date-trigger" onClick={() => setIsOpen(!isOpen)}>
        {formatDisplayValue() || placeholder}
      </div>

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
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  aria-label="Previous month"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  aria-label="Next month"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="lp-weekdays">
                {weekDays.map((d, i) => <div key={i} className="lp-weekday">{d}</div>)}
              </div>

              <div className="lp-days">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={i} className="lp-day lp-day--empty" />;
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
              <button type="button" className="lp-btn lp-btn--cancel" onClick={() => setIsOpen(false)}>
                CANCEL
              </button>
              <button type="button" className="lp-btn lp-btn--ok" onClick={() => setIsOpen(false)}>
                OK
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        .lp-date-picker { width: 100%; position: relative; }

        .lp-date-trigger {
          width: 100%;
          height: 32px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          padding: 0;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #333;
        }

        .lp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lp-modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 1000000;
          position: relative;
        }

        .lp-header {
          background: #000;
          color: white;
          padding: 20px;
          text-align: left;
        }

        .lp-header-year {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .lp-header-date {
          font-size: 18px;
          font-weight: 600;
        }

        .lp-calendar { padding: 16px; flex: 1; overflow-y: auto; }

        .lp-month-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .lp-month-nav button {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .lp-month-nav button:hover { background: #f3f4f6; }

        .lp-month-nav span {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .lp-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }

        .lp-weekday {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #6c757d;
          padding: 8px 0;
        }

        .lp-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .lp-day {
          aspect-ratio: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
        }

        .lp-day--empty { cursor: default; }
        .lp-day:hover:not(.lp-day--empty):not(.lp-day--disabled) { background: #f3f4f6; }
        .lp-day--today:not(.lp-day--sel) { background: #e9ecef; font-weight: 600; }
        .lp-day--sel { background: #FF2800 !important; color: white !important; font-weight: 600; }
        .lp-day--disabled { color: #ccc; cursor: not-allowed; }

        .lp-actions {
          display: flex;
          border-top: 1px solid #e9ecef;
          padding: 12px 16px;
          gap: 12px;
        }

        .lp-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .lp-btn--cancel { color: #6c757d; }
        .lp-btn--cancel:hover { background: #f3f4f6; }
        .lp-btn--ok { color: #FF2800; }
        .lp-btn--ok:hover { background: #fff5f3; }
      `}</style>
    </div>
  );
}
