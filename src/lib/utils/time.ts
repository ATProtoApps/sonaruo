const intervals = [
  { label: "y", seconds: 31536000 },
  { label: "mo", seconds: 2592000 },
  { label: "d", seconds: 86400 },
  { label: "h", seconds: 3600 },
  { label: "m", seconds: 60 },
  { label: "s", seconds: 1 },
];

export function getRelativeTime(dates: string) {
  const date = new Date(dates);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  if (!interval) return "now";
  const count = Math.floor(seconds / interval.seconds);
  if (count < 1) return "now";
  return `${count}${interval.label}`;
}

export function getFormattedDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate: string = new Date(date).toLocaleString("en-US", options);

  // Replace second comma with "at"
  // e.g. Sep 18, 2024, 6:68 PM  -> Sep 18, 2024 at 6:58 PM
  const formattedWithAt: string = formattedDate.replace(/, (.*),/, ", $1 at ");

  return formattedWithAt;
}

export function getMonth(
  date: string,
  type: "short" | "long" = "short",
): string {
  const options: Intl.DateTimeFormatOptions = {
    month: type,
  };

  const formattedMonth: string = new Date(date).toLocaleString(
    "en-US",
    options,
  );

  return formattedMonth;
}

export function getDay(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
  };

  const formattedDay: string = new Date(date).toLocaleString("en-US", options);

  return formattedDay;
}

export function getHour(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    hour12: true,
  };

  const formattedHour: string = new Date(date).toLocaleString("en-US", options);

  return formattedHour;
}
