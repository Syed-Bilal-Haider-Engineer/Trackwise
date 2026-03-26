import type { DayType, WorkEntry } from "../types";

export function minutesBetween(startTime: string, endTime: string): number {
  // naive local-time math; assumes same day and start <= end
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function hoursForEntry(entry: Pick<WorkEntry, "startTime" | "endTime">): number {
  const mins = minutesBetween(entry.startTime, entry.endTime);
  return Math.max(0, mins) / 60;
}

export function dayTypeFromHours(hours: number): DayType {
  // German rule (as specified)
  return hours < 4 ? "half" : "full";
}

export function fullDayEquivalentFromHours(hours: number): number {
  return dayTypeFromHours(hours) === "full" ? 1 : 0.5;
}

