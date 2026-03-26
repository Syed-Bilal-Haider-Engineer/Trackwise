import type { WorkEntry } from "@/entities/work-entry/types";
import { fullDayEquivalentFromHours, hoursForEntry } from "@/entities/work-entry/lib/time";

export type WeeklySummary = {
  hours: number;
  safeLimitHours: number;
};

export type MonthlySummary = {
  hours: number;
};

export type YearlyLegalSummary = {
  usedFullDayEquivalent: number;
  remainingFullDays: number;
  percentUsed: number;
  status: "safe" | "warning" | "danger";
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isSameISODate(dateA: string, dateB: string) {
  return dateA === dateB;
}

export function sumHours(entries: WorkEntry[]): number {
  return entries.reduce((acc, e) => acc + hoursForEntry(e), 0);
}

export function filterToday(entries: WorkEntry[], now = new Date()): WorkEntry[] {
  const today = isoDate(now);
  return entries.filter((e) => isSameISODate(e.date, today));
}

export function filterCurrentMonth(entries: WorkEntry[], now = new Date()): WorkEntry[] {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `${yyyy}-${mm}-`;
  return entries.filter((e) => e.date.startsWith(prefix));
}

export function filterCurrentYear(entries: WorkEntry[], now = new Date()): WorkEntry[] {
  const prefix = `${now.getFullYear()}-`;
  return entries.filter((e) => e.date.startsWith(prefix));
}

function startOfWeekMonday(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterCurrentWeek(entries: WorkEntry[], now = new Date()): WorkEntry[] {
  const start = startOfWeekMonday(now);
  const startIso = isoDate(start);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const endIso = isoDate(end);
  return entries.filter((e) => e.date >= startIso && e.date < endIso);
}

export function getWeeklySummary(entries: WorkEntry[], safeLimitHours = 20, now = new Date()): WeeklySummary {
  const week = filterCurrentWeek(entries, now);
  return { hours: sumHours(week), safeLimitHours };
}

export function getMonthlySummary(entries: WorkEntry[], now = new Date()): MonthlySummary {
  const month = filterCurrentMonth(entries, now);
  return { hours: sumHours(month) };
}

export function getYearlyLegalSummary(
  entries: WorkEntry[],
  maxFullDays = 120,
  warningThreshold = 0.8,
  now = new Date()
): YearlyLegalSummary {
  const yearEntries = filterCurrentYear(entries, now);
  const used = yearEntries.reduce((acc, e) => acc + fullDayEquivalentFromHours(hoursForEntry(e)), 0);

  const remainingFullDays = Math.max(0, maxFullDays - used);
  const percentUsed = maxFullDays === 0 ? 1 : used / maxFullDays;

  const status: YearlyLegalSummary["status"] =
    percentUsed >= 1 ? "danger" : percentUsed >= warningThreshold ? "warning" : "safe";

  return { usedFullDayEquivalent: used, remainingFullDays, percentUsed, status };
}

