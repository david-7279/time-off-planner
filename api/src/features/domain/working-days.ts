/**
 * Checks if a date is a weekday (Monday to Friday).
 * @param date The date to check.
 * @returns True if the date is a weekday, false otherwise.
 */
function isWeekday(date: Date): boolean {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}

/**
 * Counts the number of working days between two dates.
 * @param startDate The start date.
 * @param endDate The end date.
 * @returns The number of working days.
 */
export function countWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let counter = 0;

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    if (isWeekday(date)) {
      counter++;
    }
  }

  return counter;
}
