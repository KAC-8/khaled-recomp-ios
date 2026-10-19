import type { Pair } from "./data";
import { dayIndex } from "./calendar";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export type MealSelections = Record<string, Partial<Record<MealSlot, string>>>;
export interface MealOption {
  id: string;
  title: Pair;
  ingredients: Pair[];
  prep: Pair;
}
export const mealSlots: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];
export const mealNames: Record<MealSlot, Pair> = {
  breakfast: ["الفطور", "Breakfast"],
  lunch: ["الغداء", "Lunch"],
  dinner: ["العشاء", "Dinner"],
  snack: ["بين الوجبات · حسب حاجتك", "Between meals · as needed"],
};
export const mealOptions: Record<MealSlot, MealOption[]> = {
  breakfast: [
    { id: "eggs", title: ["بيض وخبز وفاكهة", "Eggs, toast & fruit"], ingredients: [["بيض", "Eggs"], ["خبز حبوب كاملة", "Wholegrain bread"], ["فاكهة", "Fruit"]], prep: ["حضّر البيض بالطريقة التي تحبها، وقدّمه مع الخبز وفاكهة.", "Cook eggs the way you enjoy, then serve with toast and fruit."] },
    { id: "oats", title: ["شوفان بالحليب والموز", "Oats, milk & banana"], ingredients: [["شوفان", "Oats"], ["حليب أو بديل مدعّم", "Milk or a fortified alternative"], ["موز", "Banana"]], prep: ["اطبخ الشوفان بالحليب أو انقعه من الليل. أضف الموز عند التقديم.", "Cook oats with milk or soak overnight. Add banana when serving."] },
    { id: "foul", title: ["فول وخبز وخضار", "Fava beans, bread & vegetables"], ingredients: [["فول", "Fava beans"], ["خبز حبوب كاملة", "Wholegrain bread"], ["طماطم وخيار", "Tomato & cucumber"], ["زيت زيتون", "Olive oil"]], prep: ["سخّن الفول وأضف زيت الزيتون. قدّمه مع الخبز والخضار.", "Warm the beans and add olive oil. Serve with bread and vegetables."] },
    { id: "yogurt", title: ["زبادي وشوفان وفاكهة", "Yogurt, oats & fruit"], ingredients: [["زبادي أو بديل مناسب", "Yogurt or a suitable alternative"], ["شوفان", "Oats"], ["فاكهة", "Fruit"]], prep: ["اخلط المكونات في وعاء. بدّل الفاكهة بما يتوفر عندك.", "Combine in a bowl. Use whichever fruit you have."] },
  ],
  lunch: [
    { id: "chicken", title: ["دجاج وأرز وسلطة", "Chicken, rice & salad"], ingredients: [["دجاج", "Chicken"], ["أرز", "Rice"], ["خضار للسلطة", "Salad vegetables"], ["زيت زيتون", "Olive oil"]], prep: ["اطبخ الدجاج جيدًا. قدّمه مع الأرز وسلطة بزيت الزيتون.", "Cook chicken thoroughly. Serve with rice and an olive-oil dressed salad."] },
    { id: "lentils", title: ["عدس وأرز ولبن", "Lentils, rice & yogurt"], ingredients: [["عدس", "Lentils"], ["أرز", "Rice"], ["خضار للسلطة", "Salad vegetables"], ["لبن أو بديل مناسب", "Yogurt or a suitable alternative"]], prep: ["اطبخ العدس والأرز، وقدّمهما مع سلطة ولبن أو بديل يناسبك.", "Cook lentils and rice. Serve with salad and yogurt or an alternative that suits you."] },
    { id: "fish", title: ["سمك وبطاطس وخضار", "Fish, potatoes & vegetables"], ingredients: [["سمك", "Fish"], ["بطاطس", "Potatoes"], ["خضار", "Vegetables"], ["زيت زيتون", "Olive oil"]], prep: ["اطبخ السمك جيدًا، واشوِ البطاطس والخضار بزيت الزيتون.", "Cook fish thoroughly. Roast potatoes and vegetables with olive oil."] },
    { id: "pasta", title: ["مكرونة بالدجاج والخضار", "Chicken & vegetable pasta"], ingredients: [["مكرونة", "Pasta"], ["دجاج", "Chicken"], ["صلصة طماطم", "Tomato sauce"], ["خضار", "Vegetables"]], prep: ["اسلق المكرونة. أضف الدجاج المطبوخ والخضار وصلصة الطماطم.", "Boil pasta. Combine with cooked chicken, vegetables and tomato sauce."] },
  ],
  dinner: [
    { id: "hummus", title: ["حمّص وخبز وخضار", "Hummus, bread & vegetables"], ingredients: [["حمّص", "Hummus"], ["خبز حبوب كاملة", "Wholegrain bread"], ["طماطم وخيار", "Tomato & cucumber"], ["لبن أو بديل مناسب", "Yogurt or a suitable alternative"]], prep: ["قدّم الحمّص مع الخبز والخضار ولبن أو بديل يناسبك.", "Serve hummus with bread, vegetables and yogurt or a suitable alternative."] },
    { id: "sandwich", title: ["ساندويتش بيض وخضار", "Egg & vegetable sandwich"], ingredients: [["بيض", "Eggs"], ["خبز حبوب كاملة", "Wholegrain bread"], ["طماطم وخيار", "Tomato & cucumber"], ["فاكهة", "Fruit"]], prep: ["اطبخ البيض، وجهّز الساندويتش بالخضار. أضف فاكهة إذا أحببت.", "Cook the eggs and make a vegetable sandwich. Add fruit if you like."] },
    { id: "labneh", title: ["لبنة وخبز وخضار", "Labneh, bread & vegetables"], ingredients: [["لبنة أو بديل مناسب", "Labneh or a suitable alternative"], ["خبز حبوب كاملة", "Wholegrain bread"], ["طماطم وخيار", "Tomato & cucumber"], ["زيت زيتون", "Olive oil"]], prep: ["قدّم اللبنة مع زيت الزيتون والخبز والخضار.", "Serve labneh with olive oil, bread and vegetables."] },
    { id: "soup", title: ["شوربة عدس وخبز ولبن", "Lentil soup, bread & yogurt"], ingredients: [["عدس", "Lentils"], ["جزر وبصل", "Carrot & onion"], ["خبز حبوب كاملة", "Wholegrain bread"], ["لبن أو بديل مناسب", "Yogurt or a suitable alternative"]], prep: ["اطبخ العدس مع الجزر والبصل وامزجه حسب رغبتك. قدّمه مع الخبز واللبن.", "Cook lentils with carrot and onion, then blend if you prefer. Serve with bread and yogurt."] },
  ],
  snack: [
    { id: "fruit-yogurt", title: ["فاكهة وزبادي", "Fruit & yogurt"], ingredients: [["فاكهة", "Fruit"], ["زبادي أو بديل مناسب", "Yogurt or a suitable alternative"]], prep: ["خيار سهل بين الوجبات أو حول التمرين عندما تحتاج طاقة.", "An easy option between meals or around training when you need energy."] },
    { id: "toast", title: ["توست بالجبن", "Cheese toast"], ingredients: [["خبز حبوب كاملة", "Wholegrain bread"], ["جبن أو بديل مناسب", "Cheese or a suitable alternative"]], prep: ["جهّز توست بالجبن أو بديل يناسبك.", "Make toast with cheese or an alternative that suits you."] },
    { id: "dates", title: ["تمر وحليب", "Dates & milk"], ingredients: [["تمر", "Dates"], ["حليب أو بديل مدعّم", "Milk or a fortified alternative"]], prep: ["خذه معك إذا كان يومك طويلًا. اختر الكمية التي تناسب شهيتك.", "Take it along on a long day. Choose an amount that suits your appetite."] },
  ],
};
export function validPlanDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "2000-01-01" || value > "2100-12-31") return false;
  const stamp = Date.parse(value + "T12:00:00Z");
  return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 10) === value;
}
export function validMealChoice(slot: MealSlot, value: unknown): value is string {
  return typeof value === "string" && (mealOptions[slot].some((m) => m.id === value) ||
    (value.startsWith("custom:") && value.slice(7).trim().length > 0 && value.length <= 167));
}
export function chosenMeal(date: string, slot: MealSlot, selections: MealSelections): MealOption {
  const value = selections[date]?.[slot];
  if (value?.startsWith("custom:")) {
    const title = value.slice(7);
    return { id: value, title: [title, title], ingredients: [], prep: ["وجبتك من اختيارك. راعِ حساسياتك وما يناسب احتياجك.", "Your own meal. Adapt to your dietary needs and restrictions."] };
  }
  const options = mealOptions[slot];
  return options.find((m) => m.id === value) || options[dayIndex(date) % options.length];
}
