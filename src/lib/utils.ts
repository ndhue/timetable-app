import { WEEK_STARTS_ON } from "@/const";
import { clsx, type ClassValue } from "clsx";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localizedDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getMonthVisibleRange = (date: Date) => ({
  start: startOfWeek(startOfMonth(date), { weekStartsOn: WEEK_STARTS_ON }),
  end: endOfWeek(endOfMonth(date), { weekStartsOn: WEEK_STARTS_ON }),
});

export const normalizeCalendarRange = (
  range: Date[] | { start: Date; end: Date },
) => {
  if (Array.isArray(range)) {
    const sorted = [...range].sort((a, b) => a.getTime() - b.getTime());
    const start = sorted[0];
    const end = sorted[sorted.length - 1];
    return { start, end };
  }

  return { start: range.start, end: range.end };
};