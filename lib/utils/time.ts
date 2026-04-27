/**
 * Normalize stored/display time strings to HH:mm for timepicker-ui and APIs.
 * Ported from driver-website/lib/utils/booking-time.ts
 */
export function toBookingTimeHHmm(raw: string | undefined | null): string {
  if (raw == null) return "";
  const s = String(raw)
    .replace(/[\u202f\u00a0]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";

  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m24) {
    let h = parseInt(m24[1], 10);
    let min = parseInt(m24[2], 10);
    if (Number.isNaN(h) || Number.isNaN(min)) return "";
    h = Math.min(23, Math.max(0, h));
    min = Math.min(59, Math.max(0, min));
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }

  /* Allow "4:20 PM", "04:20PM", thin/no-break spaces already collapsed */
  const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = parseInt(m12[2], 10);
    const ap = m12[3].toUpperCase();
    if (Number.isNaN(h) || Number.isNaN(min)) return "";
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    h = Math.min(23, Math.max(0, h));
    const m = Math.min(59, Math.max(0, min));
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  return "";
}
