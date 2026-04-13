// kanoke-in の src/lib/calendar-helpers.ts を pure コピー。
import type { CalendarEvent, ResolvedEvent } from "./calendar-types";

export function getWeekDates(base: Date): Date[] {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay();
  const mondayOffset = (dayOfWeek + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

export function resolveEvents(
  events: CalendarEvent[],
  weekDates: Date[],
): ResolvedEvent[] {
  const weekStart = weekDates[0];
  const weekEnd = new Date(weekDates[6]);
  weekEnd.setHours(23, 59, 59, 999);

  return events
    .filter((e) => {
      const start = new Date(e.start);
      return start >= weekStart && start <= weekEnd;
    })
    .map((e) => {
      const start = new Date(e.start);
      const end = new Date(e.end);
      const jsDay = start.getDay();
      const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

      return {
        id: e.id,
        title: e.title,
        dayIndex,
        startHour: start.getHours(),
        startMinute: start.getMinutes(),
        endHour: end.getHours(),
        endMinute: end.getMinutes(),
        color: e.color,
      };
    });
}

export function groupEvents(
  events: ResolvedEvent[],
): { event: ResolvedEvent; colIndex: number; totalCols: number }[] {
  const byDay = new Map<number, ResolvedEvent[]>();
  for (const e of events) {
    const arr = byDay.get(e.dayIndex) ?? [];
    arr.push(e);
    byDay.set(e.dayIndex, arr);
  }

  const result: { event: ResolvedEvent; colIndex: number; totalCols: number }[] = [];

  for (const [, dayEvents] of byDay) {
    dayEvents.sort(
      (a, b) =>
        a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute),
    );

    const columns: ResolvedEvent[][] = [];

    for (const ev of dayEvents) {
      const evStart = ev.startHour * 60 + ev.startMinute;
      let placed = false;

      for (const col of columns) {
        const last = col[col.length - 1];
        const lastEnd = last.endHour * 60 + last.endMinute;
        if (evStart >= lastEnd) {
          col.push(ev);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([ev]);
      }
    }

    const totalCols = columns.length;
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      for (const event of columns[colIndex]) {
        result.push({ event, colIndex, totalCols });
      }
    }
  }

  return result;
}
