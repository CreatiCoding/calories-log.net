export function MM(month: number): string {
  return month < 10 ? `0${month}` : `${month}`;
}

export interface CalendarDate {
  start: Date;
  end: Date;
  year: number;
  month: number;
  monthLength: number;
}

export function getDateLengthOfMonth(
  year: number,
  month: number
): CalendarDate {
  let nextMonth = month > 11 ? month - 12 + 1 : month + 1;
  let nextYear = month > 11 ? year + 1 : year;

  const start = new Date(`${year}-${MM(month)}-01T00:00:00`);
  const end = new Date(`${nextYear}-${MM(nextMonth)}-01T00:00:00`);

  return {
    start,
    end,
    year,
    month,
    monthLength: (end.getTime() - start.getTime()) / 1000 / 3600 / 24,
  };
}

export function getOneMonthDays(date: CalendarDate): number[] {
  return new Array(date.start.getDay() + date.monthLength)
    .fill(0)
    .map((_, i) => i - date.start.getDay() + 1);
}
