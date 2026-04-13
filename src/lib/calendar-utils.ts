// kanoke-in の src/lib/calendar-utils.ts を pure コピー。
// CALENDAR_START / CALENDAR_END は現時点のダミーデータで、
// test-site-01 では「今日が含まれる週」を表示するため十分に広い範囲を持たせている。
import type { CalendarEvent, TimeSlot } from "./calendar-types";

export const CALENDAR_START = new Date(2026, 0, 1); // 2026-01-01
export const CALENDAR_END = new Date(2027, 11, 31); // 2027-12-31

const EXTRA_CLOSED_DATES: string[] = [];

function isClosedDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 1 || day === 2) return true; // 月曜・火曜
  return EXTRA_CLOSED_DATES.includes(formatDate(date));
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function generateEvents(
  startDate: Date,
  endDate: Date,
  slots: TimeSlot[],
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    if (!isClosedDay(current)) {
      const dateStr = formatDate(current);
      for (const slot of slots) {
        events.push({
          id: `${dateStr}-${slot.start}`,
          title: slot.title,
          start: `${dateStr}T${pad(slot.start)}:00:00`,
          end: `${dateStr}T${pad(slot.end)}:00:00`,
          color: slot.color,
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return events;
}
