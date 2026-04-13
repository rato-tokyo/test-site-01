// kanoke-in の src/lib/calendar-types.ts を pure コピー。
export type EventColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: EventColor;
}

export interface TimeSlot {
  start: number;
  end: number;
  title: string;
  color?: EventColor;
}

export interface ResolvedEvent {
  id: string;
  title: string;
  dayIndex: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  color?: EventColor;
}
