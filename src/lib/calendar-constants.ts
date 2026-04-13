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
    borderColor: "#bfdbfe",
    bgColor: "rgba(219,234,254,0.6)",
    textColor: "#1d4ed8",
    hoverBgColor: "#dbeafe",
  },
  green: {
    borderColor: "#bbf7d0",
    bgColor: "rgba(220,252,231,0.6)",
    textColor: "#15803d",
    hoverBgColor: "#dcfce7",
  },
  red: {
    borderColor: "#fecaca",
    bgColor: "rgba(254,226,226,0.6)",
    textColor: "#b91c1c",
    hoverBgColor: "#fee2e2",
  },
  yellow: {
    borderColor: "#fef08a",
    bgColor: "rgba(254,249,195,0.6)",
    textColor: "#a16207",
    hoverBgColor: "#fef9c3",
  },
  purple: {
    borderColor: "#e9d5ff",
    bgColor: "rgba(243,232,255,0.6)",
    textColor: "#7e22ce",
    hoverBgColor: "#f3e8ff",
  },
  orange: {
    borderColor: "#fed7aa",
    bgColor: "rgba(255,237,213,0.6)",
    textColor: "#c2410c",
    hoverBgColor: "#ffedd5",
  },
};
