import { useState } from "react";
import { Check, ChevronDown, RefreshCw, ShoppingBasket, Utensils, X } from "lucide-react";
import { Modal } from "../components/UI";
import WeekPlanner from "../components/WeekPlanner";
import DailyHabits from "../components/DailyHabits";
import { useApp } from "../lib/store";
import { chosenMeal, mealNames, mealOptions, mealSlots } from "../lib/meals";
import type { MealSlot } from "../lib/meals";
import { displayDate } from "../lib/calendar";

export default function Nutrition() {
  const { t, pair, lang, selectedDate, mealSelections, setMealChoice, notify } = useApp();
  const [editing, setEditing] = useState<MealSlot | null>(null);
  const [custom, setCustom] = useState("");
  const [shopping, setShopping] = useState(false);
  const [includeSnack, setIncludeSnack] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const meals = mealSlots.map((slot) => ({ slot, meal: chosenMeal(selectedDate, slot, mealSelections) }));
  const shoppingMeals = meals.filter(({ slot }) => includeSnack || slot !== "snack");
  const ingredients = [...new Map(shoppingMeals.flatMap(({ meal }) => meal.ingredients).map((item) => [item[1], item])).values()];
  const customMeals = shoppingMeals.filter(({ meal }) => meal.id.startsWith("custom:"));
  function choose(slot: MealSlot, id: string) {
    setMealChoice(slot, id);
    setEditing(null);
    notify(t("حُفظ اختيار الوجبة لهذا اليوم.", "Meal choice saved for this day."));
  }
  return <div className="page-container essentials-page food-page">
    <div className="essential-heading">
      <div><span className="small-label">{t("أكلي", "MY FOOD")}</span><h1 tabIndex={-1}>{t("وش آكل اليوم؟", "What’s on the menu?")}</h1>
        <p>{t("اختر وجبات تناسبك. بدّل، حضّر، وكُل بانتظام.", "Pick meals that suit you. Swap, prepare and eat regularly.")}</p>
      </div>
      <button className="button secondary" onClick={() => { setShopping(true); setChecked([]); }}><ShoppingBasket size={18} />{t("المشتريات", "Shopping list")}</button>
    </div>
    <WeekPlanner kind="nutrition" />
    <div className="food-plan-heading"><h2>{t("وجبات اليوم", "Meals for the day")}</h2><span>{t("اختياراتك تُحفظ تلقائيًا", "Your choices save automatically")}</span></div>
    <div className="meal-board">{meals.map(({ slot, meal }, index) => <article className={`meal-tile ${slot === "snack" ? "snack-tile" : ""}`} key={slot} data-meal={slot}>
      <div className="meal-tile-top"><span className="meal-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{pair(mealNames[slot])}</span>
        <button className="swap-meal" aria-label={`${t("تبديل", "Change")} ${pair(mealNames[slot])}`} onClick={() => { setEditing(slot); setCustom(meal.id.startsWith("custom:") ? meal.title[0] : ""); }}><RefreshCw size={15} />{t("بدّل", "Swap")}</button>
      </div>
      <h3>{pair(meal.title)}</h3>
      {meal.ingredients.length > 0 && <p className="meal-components">{meal.ingredients.map(pair).join(" · ")}</p>}
      <details className="meal-prep"><summary>{t("التحضير", "Preparation")}<ChevronDown size={16} /></summary><p>{pair(meal.prep)}</p></details>
    </article>)}</div>
    <p className="meal-context">{t("أفكار مرنة وليست حصصًا مفروضة. عدّل الكمية حسب شهيتك واحتياجك، واختر مكونات تناسب حساسياتك. الوجبة الخفيفة حسب حاجتك.", "Flexible ideas, not prescribed portions. Adjust amounts to your appetite and needs, choose ingredients that suit your dietary restrictions, and have a snack when needed.")}</p>
    <section className="food-checkin"><div><Utensils size={21} /><h2>{t("متابعة بسيطة", "A simple check-in")}</h2></div><DailyHabits foodOnly /></section>
    <p className="flex-note"><strong dir="ltr">80 / 20</strong>{t("وجبات منتظمة ومتنوعة، ومرونة للأكل اللي تحبه. بدون حرمان أو تعويض.", "Regular, varied meals, with room for food you enjoy. No restriction or compensation.")}</p>
    <details className="health-details"><summary>{t("بخصوص تغيير الوزن", "About changing weight")}<ChevronDown size={16} /></summary><p>{t("في مرحلة النمو، ناقش أي هدف لتغيير الوزن مع ولي أمرك وطبيب أو أخصائي تغذية مؤهّل. هذه الصفحة لتنظيم أكلك، وليست حمية للتنحيف.", "While growing, discuss any weight-change goal with a parent or carer and a qualified clinician or dietitian. This page helps organize meals; it is not a weight-loss diet.")} <a href="https://www.healthychildren.org/English/ages-stages/teen/nutrition/Pages/Fads-and-Diets.aspx" target="_blank" rel="noreferrer">{t("المصدر: الأكاديمية الأمريكية لطب الأطفال", "Source: American Academy of Pediatrics")}</a></p></details>
    {editing && <Modal title={`${t("اختَر", "Choose")} ${pair(mealNames[editing])}`} onClose={() => setEditing(null)}>
      <div className="meal-picker"><p>{displayDate(selectedDate, lang, true)}</p>
        <div className="meal-options">{mealOptions[editing].map((option) => {
          const selected = chosenMeal(selectedDate, editing, mealSelections).id === option.id;
          return <button key={option.id} onClick={() => choose(editing, option.id)} aria-pressed={selected}><span><strong>{pair(option.title)}</strong><small>{option.ingredients.map(pair).join(" · ")}</small></span>{selected ? <Check size={20} /> : <RefreshCw size={17} />}</button>;
        })}</div>
        <form onSubmit={(event) => { event.preventDefault(); if (custom.trim()) choose(editing, `custom:${custom.trim()}`); }}>
          <label htmlFor="custom-meal">{t("أو وجبة من اختيارك", "Or your own meal")}</label>
          <input id="custom-meal" required maxLength={160} value={custom} onChange={(event) => setCustom(event.target.value)} placeholder={t("مثال: وجبة البيت مع الأهل", "For example: a family meal at home")} />
          <button className="button full" type="submit" disabled={!custom.trim()}>{t("حفظ وجبتي", "Save my meal")}<Check size={17} /></button>
        </form>
      </div>
    </Modal>}
    {shopping && <Modal title={t("مشتريات هذا اليوم", "Shopping for this day")} onClose={() => setShopping(false)}>
      <div className="shopping-list"><p>{displayDate(selectedDate, lang, true)}</p>
        <label className="snack-option"><input type="checkbox" checked={includeSnack} onChange={(event) => setIncludeSnack(event.target.checked)} />{t("أضف مكونات الوجبة الخفيفة", "Include snack ingredients")}</label>
        <ul>{ingredients.map((ingredient) => <li key={ingredient[1]}><label><input type="checkbox" checked={checked.includes(ingredient[1])} onChange={() => setChecked((values) => values.includes(ingredient[1]) ? values.filter((value) => value !== ingredient[1]) : [...values, ingredient[1]])} /><span>{pair(ingredient)}</span></label></li>)}</ul>
        {customMeals.length > 0 && <p className="shopping-custom">{t("أضف مكونات وجبتك الخاصة بنفسك:", "Add ingredients for your own meals separately:")} {customMeals.map(({ meal }) => pair(meal.title)).join(" · ")}</p>}
        <p className="subtle">{t("من اختيارات هذا اليوم. علامات المشتريات مؤقتة؛ حدّد الكميات التي تحتاجها.", "From this day’s choices. Shopping checks are temporary; choose the amounts you need.")}</p>
        <button className="button full" onClick={() => setShopping(false)}>{t("إغلاق القائمة", "Close list")}<X size={16} /></button>
      </div>
    </Modal>}
  </div>;
}
