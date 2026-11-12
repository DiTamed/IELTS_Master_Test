/**
 * Constants and reference settings for IELTS Master E-Learning.
 * Fixed reference time according to test specification:
 * 11/11/2026, 09:00 (GMT+7)
 */

export const FIXED_REFERENCE_TIME_ISO = '2026-11-11T09:00:00+07:00';
export const FIXED_REFERENCE_TIME_LABEL = '11/11/2026, 09:00 (GMT+7)';
export const TIMEZONE_OFFSET_HOURS = 7; // GMT+7

/**
 * Format an ISO date string to "DD/MM/YYYY HH:mm" in GMT+7
 */
export function formatToVNDateTime(isoString: string): string {
  const date = new Date(isoString);
  // Using Intl.DateTimeFormat with Asia/Ho_Chi_Minh (+07:00)
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // e.g. "23:59 13/11/2026" -> format to "13/11/2026 23:59"
  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }

  return `${partMap.day}/${partMap.month}/${partMap.year} ${partMap.hour}:${partMap.minute}`;
}

