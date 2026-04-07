const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}