export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatLocalTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getLocalTodayString(): string {
  return formatLocalDate(new Date());
}

export function parseLocalDateTime(dateStr: string, timeStr: string): Date | null {
  const parts = dateStr.split('-').map((x) => parseInt(x, 10));
  const time = timeStr.split(':').map((x) => parseInt(x, 10));
  const yyyy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  const hh = time[0];
  const min = time[1];
  if ([yyyy, mm, dd, hh, min].some((n) => n === undefined || !Number.isFinite(n))) return null;
  if (mm! < 1 || mm! > 12) return null;
  if (dd! < 1 || dd! > 31) return null;
  if (hh! < 0 || hh! > 23) return null;
  if (min! < 0 || min! > 59) return null;
  return new Date(yyyy!, mm! - 1, dd!, hh!, min!, 0, 0);
}

export function formatTimeShort(d: Date): string {
  return formatLocalTime(d);
}

export function parseTimeToMinutes(time: string): number {
  const parts = time.split(':').map((x) => parseInt(x, 10));
  const h = parts[0];
  const m = parts[1];
  if (h === undefined || m === undefined || !Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

export function getSleepDurationMinutes(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);
  if (end < start) end += 24 * 60;
  return Math.max(0, end - start);
}

export function parseBirthDate(iso: string): Date {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d.getTime()) ? new Date() : d;
}
