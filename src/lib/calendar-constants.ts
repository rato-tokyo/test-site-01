// kanoke-in の src/lib/calendar-constants.ts を pure コピー。
import type { EventColor } from "./calendar-types";

export const CALENDAR = {
  DAYS_JA: ["月", "火", "水", "木", "金", "土", "日"] as const,
  DEFAULT_START_HOUR: 8,
  DEFAULT_END_HOUR: 18,
  CELL_HEIGHT: 40,
};

export const EVENT_COLOR_MAP: Record<
  EventColor,
  { borderColor: string; bgColor: string; textColor: string; hoverBgColor: string }
> = {
  blue: {
    borderColor: "var(--color-cal-blue-border)",
    bgColor: "var(--color-cal-blue-bg)",
    textColor: "var(--color-cal-blue-text)",
    hoverBgColor: "var(--color-cal-blue-hover)",
  },
  green: {
    borderColor: "var(--color-cal-green-border)",
    bgColor: "var(--color-cal-green-bg)",
    textColor: "var(--color-cal-green-text)",
    hoverBgColor: "var(--color-cal-green-hover)",
  },
  red: {
    borderColor: "var(--color-cal-red-border)",
    bgColor: "var(--color-cal-red-bg)",
    textColor: "var(--color-cal-red-text)",
    hoverBgColor: "var(--color-cal-red-hover)",
  },
  yellow: {
    borderColor: "var(--color-cal-yellow-border)",
    bgColor: "var(--color-cal-yellow-bg)",
    textColor: "var(--color-cal-yellow-text)",
    hoverBgColor: "var(--color-cal-yellow-hover)",
  },
  purple: {
    borderColor: "var(--color-cal-purple-border)",
    bgColor: "var(--color-cal-purple-bg)",
    textColor: "var(--color-cal-purple-text)",
    hoverBgColor: "var(--color-cal-purple-hover)",
  },
  orange: {
    borderColor: "var(--color-cal-orange-border)",
    bgColor: "var(--color-cal-orange-bg)",
    textColor: "var(--color-cal-orange-text)",
    hoverBgColor: "var(--color-cal-orange-hover)",
  },
};
