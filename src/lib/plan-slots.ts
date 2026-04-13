// kanoke-in の src/lib/plan-slots.ts を pure コピー。
import type { TimeSlot } from "./calendar-types";

export const REGULAR_TIME_SLOTS = [11, 13, 15, 17];

export const regularSlots: TimeSlot[] = [
  { start: 11, end: 12, title: "リラックス瞑想", color: "blue" },
  { start: 13, end: 14, title: "お経瞑想", color: "orange" },
  { start: 15, end: 16, title: "シンギングボウル瞑想", color: "purple" },
  { start: 17, end: 18, title: "静寂瞑想", color: "green" },
];

export const PRIVATE_TIME_SLOTS = [12, 14, 16, 18];

export const privateSlots: TimeSlot[] = [
  { start: 12, end: 13, title: "12:00〜", color: "blue" },
  { start: 14, end: 15, title: "14:00〜", color: "blue" },
  { start: 16, end: 17, title: "16:00〜", color: "blue" },
  { start: 18, end: 19, title: "18:00〜", color: "blue" },
];
