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
export const mealIdeas: {
  breakfast: Pair;
  lunch: Pair;
  dinner: Pair;
  flex: Pair;
}[] = [
  {
    breakfast: ["بيض وخبز حبوب كاملة وفاكهة", "Eggs, wholegrain toast & fruit"],
    lunch: ["أرز ودجاج وخضار", "Rice, chicken & vegetables"],
    dinner: [
      "حمّص وخبز ولبن أو بديل مناسب",
      "Hummus, bread & yogurt or a suitable alternative",
    ],
    flex: ["اختر وجبة عائلية تحبها.", "Enjoy a family meal you like."],
  },
  {
    breakfast: ["شوفان بالحليب وفاكهة", "Oats with milk & fruit"],
    lunch: ["عدس وأرز وسلطة", "Lentils, rice & salad"],
    dinner: ["ساندويتش بيض وخضار", "Egg & vegetable sandwich"],
    flex: [
      "بدّل المكونات بما يتوفر عندك.",
      "Swap ingredients for what you have.",
    ],
  },
  {
    breakfast: ["زبادي وشوفان وموز", "Yogurt, oats & banana"],
    lunch: ["سمك وبطاطس وخضار", "Fish, potatoes & vegetables"],
    dinner: ["شوربة عدس وخبز", "Lentil soup & bread"],
    flex: ["مساحة لوجبة مع الأصدقاء.", "Make room for a meal with friends."],
  },
  {
    breakfast: ["بيض وخبز وفاكهة", "Eggs, bread & fruit"],
    lunch: [
      "مكرونة مع مصدر بروتين وخضار",
      "Pasta with a protein source & vegetables",
    ],
    dinner: [
      "تونة أو حمّص مع خبز وخضار",
      "Tuna or hummus with bread & vegetables",
    ],
    flex: [
      "استمتع بما تحب بدون تعويض أو حرمان.",
      "Enjoy what you like without compensating or restricting.",
    ],
  },
  {
    breakfast: ["فول وخبز وخضار", "Fava beans, bread & vegetables"],
    lunch: ["دجاج أو فاصوليا مع أرز", "Chicken or beans with rice"],
    dinner: [
      "لبنة وخبز وخضار أو بديل مناسب",
      "Labneh, bread & vegetables or a suitable alternative",
    ],
    flex: [
      "اختر ما يناسب ذوقك وحساسياتك.",
      "Choose what fits your taste and dietary needs.",
    ],
  },
  {
    breakfast: ["فطور عائلي متنوع", "A varied family breakfast"],
    lunch: [
      "وجبة عائلية مع مصدر بروتين وخضار",
      "A family meal with protein & vegetables",
    ],
    dinner: ["ساندويتش تحبه وفاكهة", "A sandwich you enjoy & fruit"],
    flex: [
      "وقت مع العائلة، بدون حساب نسب الوجبات.",
      "Family time without calculating meal percentages.",
    ],
  },
  {
    breakfast: [
      "شوفان أو خبز مع بيض وفاكهة",
      "Oats or toast with eggs & fruit",
    ],
    lunch: [
      "أرز مع عدس أو لحم وخضار",
      "Rice with lentils or meat & vegetables",
    ],
    dinner: ["شوربة وخبز ومصدر بروتين", "Soup, bread & a protein source"],
    flex: [
      "حضّر فكرة بسيطة للأسبوع القادم.",
      "Prepare one simple idea for next week.",
    ],
  },
];
export const recoveryIdeas: Pair[] = [
  [
    "حركة تستمتع بها، ووقت منتظم للنوم.",
    "Movement you enjoy and a consistent bedtime.",
  ],
  [
    "إحماء مريح، وتكرارات بجودة قبل زيادة العدد.",
    "A comfortable warm-up and quality reps before more volume.",
  ],
  [
    "لاحظ طاقتك؛ خفف اليوم إذا احتاج جسمك.",
    "Notice your energy. Ease off if your body needs it.",
  ],
  [
    "نسّق تدريبك مع النادي، واترك مساحة للتعافي.",
    "Coordinate with gym training and leave room to recover.",
  ],
  ["اهتم بالنوم والوجبات المنتظمة.", "Prioritize sleep and regular meals."],
  [
    "مهارة خفيفة إذا كنت مرتاحًا؛ الراحة خيار كامل.",
    "Light skill practice if recovered. Rest is a complete option.",
  ],
  [
    "راجع أسبوعك بهدوء، ثم جهّز خطوة واحدة للأسبوع القادم.",
    "Reflect on your week, then choose one next step.",
  ],
];
