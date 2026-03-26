export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function nowTimeHHmm(d = new Date()): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

