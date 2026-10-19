import type { Pair } from "./data";
export type PlanId = "a" | "b" | "c" | "rest";
export type WeekPlan = Record<string, PlanId>;
export const defaultWeekPlan: WeekPlan = {
  0: "rest",
  1: "a",
  2: "rest",
  3: "b",
  4: "rest",
  5: "c",
  6: "rest",
};
export const weekdays: Pair[] = [
  ["الأحد", "Sunday"],
  ["الاثنين", "Monday"],
  ["الثلاثاء", "Tuesday"],
  ["الأربعاء", "Wednesday"],
  ["الخميس", "Thursday"],
  ["الجمعة", "Friday"],
  ["السبت", "Saturday"],
];
export const planNames: Record<PlanId, Pair> = {
  a: ["الأساس · دفع وساقان", "Foundation · push & legs"],
  b: ["التحكّم · سحب وجذع", "Control · pull & core"],
  c: ["مهارة اختيارية", "Optional skill practice"],
  rest: ["تعافٍ وحركة مريحة", "Recovery & easy movement"],
};
export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function calendarDate(date: string) {
  return new Date(date + "T12:00:00");
}
export function shiftDate(date: string, days: number) {
  const d = calendarDate(date);
  d.setDate(d.getDate() + days);
  return isoDate(d);
}
export function weekDates(date: string) {
  const start = shiftDate(date, -calendarDate(date).getDay());
  return Array.from({ length: 7 }, (_, i) => shiftDate(start, i));
}
export function dayIndex(date: string) {
  return calendarDate(date).getDay();
}
export function displayDate(
  date: string,
  lang: "ar" | "en",
  withWeekday = false,
) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
    calendar: "gregory",
    day: "numeric",
    month: "short",
    ...(withWeekday
      ? { weekday: "long" as const, year: "numeric" as const }
      : {}),
  }).format(calendarDate(date));
}
