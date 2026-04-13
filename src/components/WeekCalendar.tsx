// React island 版 WeekCalendar。
// kanoke-in v2 の src/components/week-calendar.tsx をベースに Tailwind 化。
// カスタム CSS クラスは全廃し、Tailwind ユーティリティ + デザイントークンのみ使用。
//
// Astro 側からは <WeekCalendar client:load events={...} /> で呼び出す。
import { useState } from "react";
import type { CalendarEvent, EventColor } from "../lib/calendar-types";
import { CALENDAR, EVENT_COLOR_MAP } from "../lib/calendar-constants";
import { getWeekDates, resolveEvents, groupEvents } from "../lib/calendar-helpers";

const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

interface Props {
	events: CalendarEvent[];
	mobileMode?: "numbered" | "symbol";
}

export default function WeekCalendar({ events, mobileMode = "numbered" }: Props) {
	const [baseDate, setBaseDate] = useState(() => new Date());

	const weekDates = getWeekDates(baseDate);
	const resolved = resolveEvents(events, weekDates);
	const grouped = groupEvents(resolved);

	const todayStr = new Date().toDateString();

	const uniqueTitles: { title: string; color: EventColor }[] = [];
	for (const e of resolved) {
		if (!uniqueTitles.some((u) => u.title === e.title)) {
			uniqueTitles.push({ title: e.title, color: (e.color ?? "blue") as EventColor });
		}
	}
	const titleToIndex = new Map(uniqueTitles.map((u, i) => [u.title, i]));

	let startHour: number;
	let endHour: number;

	if (resolved.length === 0) {
		startHour = CALENDAR.DEFAULT_START_HOUR;
		endHour = CALENDAR.DEFAULT_END_HOUR;
	} else {
		startHour = Math.min(...resolved.map((e) => e.startHour)) - 1;
		endHour = Math.max(...resolved.map((e) => e.endHour)) + 1;
	}

	const hours = Array.from(
		{ length: endHour - startHour },
		(_, i) => startHour + i,
	);

	const gridHeight = hours.length * CALENDAR.CELL_HEIGHT;

	const goToPrevWeek = () => {
		setBaseDate((d) => {
			const next = new Date(d);
			next.setDate(d.getDate() - 7);
			return next;
		});
	};

	const goToNextWeek = () => {
		setBaseDate((d) => {
			const next = new Date(d);
			next.setDate(d.getDate() + 7);
			return next;
		});
	};

	const weekRangeLabel = new Intl.DateTimeFormat("ja", {
		month: "long",
		day: "numeric",
	}).formatRange(weekDates[0], weekDates[6]);

	return (
		<div className="flex flex-col gap-tight">
			{/* ナビゲーション */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					className="cursor-pointer rounded-subtle border-none bg-transparent p-quarter text-body leading-none text-text transition-colors hover:bg-text/5"
					aria-label="前の週"
					onClick={goToPrevWeek}
				>
					‹
				</button>
				<span className="text-small font-medium">{weekRangeLabel}</span>
				<button
					type="button"
					className="cursor-pointer rounded-subtle border-none bg-transparent p-quarter text-body leading-none text-text transition-colors hover:bg-text/5"
					aria-label="次の週"
					onClick={goToNextWeek}
				>
					›
				</button>
			</div>

			{/* カレンダーグリッド */}
			<div className="overflow-x-auto">
				<div className="min-w-0 sm:min-w-calendar-inner">
					{/* ヘッダー行 */}
					<div className="grid grid-cols-calendar border-b border-border">
						<div />
						{weekDates.map((date, i) => {
							const isToday = date.toDateString() === todayStr;
							return (
								<div key={i} className="pb-tight text-center">
									<span
										className={`block text-xs ${isToday ? "font-semibold text-text" : "font-normal text-text-subtle"}`}
									>
										{CALENDAR.DAYS_JA[i]}
									</span>
									<br />
									<span
										className={`text-small ${isToday ? "font-semibold" : "font-normal"}`}
									>
										{date.getDate()}
									</span>
								</div>
							);
						})}
					</div>

					{/* 時間グリッド */}
					<div
						className="relative grid grid-cols-calendar"
						style={{ height: `${gridHeight}px` }}
					>
						{/* 時間ラベル */}
						{hours.map((h, i) => (
							<div
								key={h}
								className="left-0 absolute w-time-label -translate-y-1/2 pr-tight text-right text-xs text-text-subtle"
								style={{ top: `${i * CALENDAR.CELL_HEIGHT}px` }}
							>
								{h}:00
							</div>
						))}

						{/* 横罫線(1時間ごと) */}
						{hours.slice(1).map((_, i) => (
							<div
								key={`line-${i}`}
								className="right-0 pointer-events-none absolute left-time-label border-b border-border/40"
								style={{ top: `${(i + 1) * CALENDAR.CELL_HEIGHT}px` }}
							/>
						))}

						{/* 30分刻み破線 */}
						{hours.map((_, i) => (
							<div
								key={`dash-${i}`}
								className="right-0 pointer-events-none absolute left-time-label border-b border-dashed border-border/30"
								style={{
									top: `${i * CALENDAR.CELL_HEIGHT + CALENDAR.CELL_HEIGHT / 2}px`,
								}}
							/>
						))}

						{/* 曜日列 + イベント */}
						{weekDates.map((date, dayIdx) => {
							const isToday = date.toDateString() === todayStr;
							const dayGrouped = grouped.filter(
								(g) => g.event.dayIndex === dayIdx,
							);

							return (
								<div
									key={dayIdx}
									className="relative"
									style={{
										gridColumn: dayIdx + 2,
										gridRow: 1,
										height: `${gridHeight}px`,
									}}
								>
									{isToday && <div className="inset-0 absolute bg-text/5" />}

									{dayGrouped.map(({ event, colIndex, totalCols }) => {
										const startMin =
											(event.startHour - startHour) * 60 + event.startMinute;
										const endMin =
											(event.endHour - startHour) * 60 + event.endMinute;
										const durationMin = endMin - startMin;
										const topPx = (startMin / 60) * CALENDAR.CELL_HEIGHT;
										const heightPx = (durationMin / 60) * CALENDAR.CELL_HEIGHT;
										const widthPct = 100 / totalCols;
										const leftPct = colIndex * widthPct;
										const isShort = durationMin <= 30;

										const colorStyles =
											EVENT_COLOR_MAP[(event.color ?? "blue") as EventColor];
										const idx = titleToIndex.get(event.title) ?? 0;
										const circled = CIRCLED_NUMBERS[idx] ?? `(${idx + 1})`;

										return (
											<div
												key={event.id}
												className="absolute"
												style={{
													top: `${topPx}px`,
													height: `${heightPx + 1}px`,
													left: `${leftPct}%`,
													width: `${widthPct}%`,
												}}
											>
												<div
													className="mx-event-gap h-full overflow-hidden rounded-subtle border border-solid px-tight text-xs"
													style={{
														borderColor: colorStyles.borderColor,
														backgroundColor: colorStyles.bgColor,
														color: colorStyles.textColor,
													}}
												>
													<p className="m-0 hidden overflow-hidden font-semibold text-ellipsis whitespace-nowrap sm:block">
														{event.title}
													</p>
													<p className="m-0 block overflow-hidden font-semibold text-ellipsis whitespace-nowrap sm:hidden">
														{mobileMode === "symbol" ? "◯" : circled}
													</p>
													{!isShort && (
														<p className="m-0 hidden overflow-hidden text-ellipsis whitespace-nowrap opacity-70 sm:block">
															{event.startHour}:
															{String(event.startMinute).padStart(2, "0")} –{" "}
															{event.endHour}:
															{String(event.endMinute).padStart(2, "0")}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* モバイル凡例 */}
			{uniqueTitles.length > 0 && (
				<div className="flex flex-wrap gap-x-snug gap-y-quarter text-small sm:hidden">
					{mobileMode === "symbol" ? (
						<>
							<span className="flex min-w-legend-item items-center gap-quarter">
								<span
									className="inline-block size-swatch rounded-subtle border border-solid"
									style={{
										borderColor: "#bbf7d0",
										backgroundColor: "rgba(220,252,231,0.6)",
									}}
								/>
								<span>◯ 予約可能</span>
							</span>
							<span className="flex min-w-legend-item items-center gap-quarter">
								<span
									className="inline-block size-swatch rounded-subtle border border-solid"
									style={{
										borderColor: "#fecaca",
										backgroundColor: "rgba(254,226,226,0.6)",
									}}
								/>
								<span>✗ 予約不可</span>
							</span>
						</>
					) : (
						uniqueTitles.map((u, i) => {
							const cs = EVENT_COLOR_MAP[u.color];
							return (
								<span key={u.title} className="flex min-w-legend-item items-center gap-quarter">
									<span
										className="inline-block size-swatch rounded-subtle border border-solid"
										style={{
											borderColor: cs.borderColor,
											backgroundColor: cs.bgColor,
										}}
									/>
									<span>
										{CIRCLED_NUMBERS[i] ?? `(${i + 1})`} {u.title}
									</span>
								</span>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}
