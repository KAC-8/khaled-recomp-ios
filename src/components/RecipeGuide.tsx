import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, CookingPot, Play, RefreshCw } from "lucide-react";
import { useApp } from "../lib/store";
import type { MealOption } from "../lib/meals";
import { recipes } from "../lib/recipes";
import { Modal } from "./UI";

export default function RecipeGuide({ meal, onClose }: { meal: MealOption; onClose: () => void }) {
  const { t, pair, notify } = useApp();
  const recipe = recipes[meal.id];
  const [cooking, setCooking] = useState(false);
  const [current, setCurrent] = useState(0);
  if (!recipe) return null;
  const active = recipe.steps[current];
  return <Modal title={pair(meal.title)} onClose={onClose}>
    <div className="recipe-guide">
      <div className="recipe-meta"><span><Clock3 size={17} />{pair(recipe.time)}</span><span>{t("وقت تقريبي", "Approximate time")}</span></div>
      <div className="recipe-tools"><CookingPot size={20} /><p><strong>{t("تحتاج", "You’ll need")}</strong>{pair(recipe.tools)}</p></div>
      {!cooking ? <>
        <section className="recipe-ingredients"><h3>{t("المكونات", "Ingredients")}</h3><ul>{meal.ingredients.map((ingredient) => <li key={ingredient[1]}>{pair(ingredient)}</li>)}</ul></section>
        <div className="recipe-section-heading"><h3>{t("طريقة التحضير", "Preparation")}</h3><button className="button" onClick={() => { setCooking(true); setCurrent(0); }}><Play size={15} />{t("ابدأ خطوة بخطوة", "Start step by step")}</button></div>
        <ol className="recipe-steps">{recipe.steps.map((step, i) => <li key={step.title[1]}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><h4>{pair(step.title)}</h4><p>{pair(step.body)}</p></div></li>)}</ol>
      </> : <section className="cooking-mode" aria-label={t("التحضير خطوة بخطوة", "Step-by-step preparation")}>
        <div className="cooking-mode-top"><span>{t("الخطوة", "Step")} <b dir="ltr">{current + 1} / {recipe.steps.length}</b></span><button onClick={() => setCooking(false)}>{t("عرض كل الخطوات", "Show all steps")}</button></div>
        <div className="cooking-step-nav" aria-label={t("خطوات الوصفة", "Recipe steps")}>{recipe.steps.map((step, i) => <button key={step.title[1]} aria-current={i === current ? "step" : undefined} aria-label={`${i + 1}. ${pair(step.title)}`} onClick={() => setCurrent(i)}>{i < current ? <Check size={15} /> : i + 1}</button>)}</div>
        <div className="cooking-active-step" role="status" aria-live="polite"><h3>{pair(active.title)}</h3><p>{pair(active.body)}</p></div>
        <div className="cooking-actions"><button className="button secondary" disabled={current === 0} onClick={() => setCurrent((s) => s - 1)}><ArrowRight className="directional-arrow" size={16} />{t("السابق", "Back")}</button>
          {current < recipe.steps.length - 1 ? <button className="button" onClick={() => setCurrent((s) => s + 1)}>{t("التالي", "Next")}<ArrowLeft className="directional-arrow" size={16} /></button> : <button className="button" onClick={() => { notify(t("انتهى دليل التحضير.", "You’ve reached the end of the recipe guide.")); onClose(); }}>{t("إنهاء الدليل", "Finish guide")}<Check size={16} /></button>}
        </div>
      </section>}
      <div className="recipe-tip"><strong>{t("لنتيجة أفضل", "A useful tip")}</strong><p>{pair(recipe.tip)}</p></div>
      <div className="recipe-swap"><RefreshCw size={16} /><p>{pair(recipe.swap)}</p></div>
      {recipe.foodSafety && <p className="recipe-safety">{pair(recipe.foodSafety)} <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noreferrer">FoodSafety.gov</a></p>}
      <p className="recipe-flex">{t("المكونات أفكار مرنة؛ حدّد الكمية بحسب شهيتك واحتياجك وحساسياتك.", "These are flexible ideas. Choose amounts to suit your appetite, needs and dietary restrictions.")}</p>
    </div>
  </Modal>;
}
