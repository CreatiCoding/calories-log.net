export function MM(month: number): string {
  return month < 10 ? `0${month}` : `${month}`;
}

export function getDateLengthOfMonth(year: number, month: number) {
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
