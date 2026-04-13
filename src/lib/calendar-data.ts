// kanoke-in の src/lib/calendar-data.ts を pure コピー。
// kanoke-in では「4/23 取材で閉店」等の個別イベントがハードコードされていたが、
// test-site-01 はデザイン移植用のダミーサイトなので、特殊イベントは含めず slots だけで生成する。
import { generateEvents, CALENDAR_START, CALENDAR_END } from "./calendar-utils";
import { regularSlots, privateSlots } from "./plan-slots";

// --- 通常プラン ---
export const regularPlanEvents = generateEvents(
  CALENDAR_START,
  CALENDAR_END,
  regularSlots,
);

// --- 貸切プラン ---
export const privatePlanEvents = generateEvents(
  CALENDAR_START,
  CALENDAR_END,
  privateSlots,
);
