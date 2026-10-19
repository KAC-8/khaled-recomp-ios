import { Check, Droplets, Footprints, Moon, Utensils } from "lucide-react";
import { today, useApp } from "../lib/store";

export default function DailyHabits({ foodOnly = false }: { foodOnly?: boolean }) {
  const { t, selectedDate, habits, toggleHabit } = useApp();
  const done = habits[selectedDate] || [];
  const list = [
    { id: "meals", icon: Utensils, title: t("وجبات منتظمة", "Regular meals") },
    { id: "water", icon: Droplets, title: t("ماء خلال اليوم", "Water throughout the day") },
    { id: "move", icon: Footprints, title: t("حركة أستمتع بها", "Movement I enjoy") },
    { id: "sleep", icon: Moon, title: t("وقت كافٍ للنوم", "Enough time for sleep") },
  ].filter((item) => !foodOnly || ["meals", "water"].includes(item.id));
  return <div className={`daily-habits ${foodOnly ? "food-habits" : ""}`}>
    {list.map((item) => <button key={item.id} className={done.includes(item.id) ? "is-done" : ""}
      onClick={() => toggleHabit(item.id)} aria-pressed={done.includes(item.id)} disabled={selectedDate > today()}>
      <item.icon size={19} strokeWidth={1.6} />
      <span>{item.title}</span>
      <span className="daily-check" aria-hidden="true">{done.includes(item.id) ? <Check size={15} /> : null}</span>
    </button>)}
    {selectedDate > today() && <p className="subtle">{t("التسجيل متاح في يومه؛ تقدر تخطط الآن.", "Check in on the day. You can plan ahead now.")}</p>}
  </div>;
}
