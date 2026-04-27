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
  placeholder = "Select Date" 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse selected date
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

  // Date picker handlers
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get today's date to disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mobile calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatDisplayValue = () => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }
    return '';
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  // Handle overlay click to close (only when clicking backdrop, not calendar content)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="booking-date-picker" ref={datePickerRef}>
      <div 
        className="booking-date-input-mobile"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '32px',
          border: 'none',
          fontSize: '14px',
          fontWeight: 500,
          padding: 0,
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
        }}
      >
        {formatDisplayValue() || placeholder}
      </div>

      {isOpen && mounted && createPortal(
        <div 
          className="mobile-date-picker-overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            className="mobile-date-picker"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Black Header */}
            <div className="mobile-date-picker-header" style={{ background: '#000000', color: 'white', padding: '20px' }}>
              <div className="mobile-date-picker-year" style={{ fontSize: '14px', opacity: 0.9 }}>{currentMonth.getFullYear()}</div>
              <div className="mobile-date-picker-selected" style={{ fontSize: '18px', fontWeight: 600 }}>
                {formatDateDisplay(selectedDate)}
              </div>
            </div>

            {/* Calendar */}
            <div className="mobile-date-picker-calendar" style={{ padding: '16px' }}>
              {/* Month Navigation */}
              <div className="mobile-date-picker-month-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button 
                  type="button"
                  onClick={handlePrevMonth}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <div style={{ fontWeight: 600, color: '#333' }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button 
                  type="button"
                  onClick={handleNextMonth}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>

              {/* Week Days */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                {weekDays.map((day, index) => (
                  <div key={index} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6c757d' }}>{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calendarDays.map((day, index) => {
                  if (day === null) return <div key={index}></div>;
                  const disabled = isDateDisabled(day);
                  const selected = isDateSelected(day);
                  return (
                    <button
                      key={index}
                      type="button"
                      style={{
                        aspectRatio: '1',
                        border: 'none',
                        background: selected ? '#FF2800' : 'transparent',
                        color: selected ? 'white' : disabled ? '#ccc' : '#333',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        borderRadius: '50%',
                        fontWeight: selected ? 600 : 500,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '44px',
                      }}
                      onClick={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', borderTop: '1px solid #e9ecef', padding: '12px 16px', gap: '12px' }}>
              <button 
                type="button"
                style={{ flex: 1, padding: '12px', border: 'none', background: 'transparent', color: '#6c757d', fontWeight: 600, cursor: 'pointer' }}
                onClick={handleCancel}
              >
                CANCEL
              </button>
              <button 
                type="button"
                style={{ flex: 1, padding: '12px', border: 'none', background: 'transparent', color: '#FF2800', fontWeight: 600, cursor: 'pointer' }}
                onClick={handleOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
