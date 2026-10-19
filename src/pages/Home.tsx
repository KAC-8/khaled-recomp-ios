import { ArrowUpRight, Check, Dumbbell, Moon, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import WeekPlanner from "../components/WeekPlanner";
import DailyHabits from "../components/DailyHabits";
import { today, useApp } from "../lib/store";
import { dayIndex, planNames } from "../lib/calendar";
import { chosenMeal, mealNames, mealSlots } from "../lib/meals";

export default function Home() {
  const { t, pair, weekPlan, selectedDate, training, logs, mealSelections } = useApp();
  const plan = weekPlan[String(dayIndex(selectedDate))];
  const rest = plan === "rest";
  const dayTraining = training.filter((s) => s.date === selectedDate && s.done.length > 0);
  const checkin = logs.find((l) => l.date === selectedDate);
  return <div className="page-container essentials-page today-page">
    <div className="essential-heading">
      <div><span className="small-label">{t("KHALID CUT / يومي", "KHALID CUT / TODAY")}</span>
        <h1 tabIndex={-1}>{t("يومك، واضح.", "Your day. Made simple.")}</h1>
        <p>{t("وجباتك، حركتك، ووقتك للتعافي.", "Your meals, movement and time to recover.")}</p>
      </div>
      <Link className="button" to="/nutrition">{t("جهّز أكلك", "Plan your meals")}<ArrowUpRight size={18} /></Link>
    </div>
    <WeekPlanner />
    <div className="today-grid">
      <section className="daily-card meals-overview">
        <div className="daily-card-heading"><Utensils size={20} /><h2>{t("أكلك", "Your food")}</h2><Link to="/nutrition">{t("عدّل", "Edit")}<ArrowUpRight size={16} /></Link></div>
        <div className="meal-summary-list">{mealSlots.filter((s) => s !== "snack").map((slot) => <div key={slot}>
          <span>{pair(mealNames[slot])}</span><strong>{pair(chosenMeal(selectedDate, slot, mealSelections).title)}</strong>
        </div>)}</div>
        <Link className="daily-text-action" to="/nutrition">{t("الوجبات والتحضير", "Meals & preparation")}<ArrowUpRight size={17} /></Link>
      </section>
      <section className={`daily-card training-overview ${rest ? "recovery-day" : ""}`}>
        <div className="daily-card-heading">{rest ? <Moon size={20} /> : <Dumbbell size={20} />}<h2>{t("حركتك", "Your movement")}</h2>
          {dayTraining.length > 0 && <span className="saved-label"><Check size={14} />{t("مسجّل", "Logged")}</span>}
        </div>
        <div className="training-day-mark" aria-hidden="true">{rest ? <Moon size={52} strokeWidth={1} /> : plan.toUpperCase()}<span>{rest ? t("تعافٍ", "RECOVER") : t("كالستنكس", "CALISTHENICS")}</span></div>
        <h3>{pair(planNames[plan])}</h3>
        <p>{rest ? t("حركة مريحة إذا رغبت. لا تحتاج حصة إضافية اليوم.", "Easy movement if you feel like it. No extra session needed today.") : t("نسّقها مع تدريب النادي. إذا كنت متعبًا، خذ راحة.", "Fit this around gym training. If tired, take a rest.")}</p>
        <Link className="daily-text-action" to="/train">{rest ? t("استعرض الحركات", "Explore movements") : t("افتح تمريني", "Open my training")}<ArrowUpRight size={17} /></Link>
      </section>
      <section className="daily-card habits-overview">
        <div className="daily-card-heading"><Check size={20} /><h2>{t("أساسيات يومك", "Daily essentials")}</h2></div>
        <DailyHabits />
        <p className="subtle">{t("سجل ما يناسب يومك. لا تحتاج يومًا مثاليًا.", "Check what fits your day. No perfect day needed.")}</p>
      </section>
      <section className="daily-card energy-overview">
        <div><span className="small-label">{t("متابعتي", "MY CHECK-IN")}</span><h2>{t("كيف طاقتك؟", "How’s your energy?")}</h2>
          <p>{checkin ? t("متابعتك لهذا اليوم محفوظة.", "Your check-in for this day is saved.") : t("سجّل شعورك وأداءك عندما يناسبك.", "Record how you feel and perform when it suits you.")}</p>
        </div>
        <div className="energy-value">{checkin?.energy ?? "—"}<span>/ 5</span></div>
        {selectedDate <= today() && <Link className="daily-text-action" to="/progress?checkin=1">{checkin ? t("عدّل متابعتي", "Edit my check-in") : t("سجّل متابعتي", "Add my check-in")}<ArrowUpRight size={17} /></Link>}
      </section>
    </div>
    <p className="flex-note"><strong dir="ltr">80 / 20</strong>{t("الأساس انتظام، والباقي مرونة. بدون حساب نسب أكلك.", "Consistency first, with room for flexibility. No food percentages to calculate.")}</p>
  </div>;
}
