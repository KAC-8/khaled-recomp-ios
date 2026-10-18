import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp, today } from "../lib/store";
import {
  calendarDate,
  dayIndex,
  displayDate,
  mealIdeas,
  planNames,
  recoveryIdeas,
  shiftDate,
  weekDates,
  weekdays,
} from "../lib/calendar";
import type { PlanId } from "../lib/calendar";
import { Modal } from "./UI";

export type PlannerKind =
  "overview" | "train" | "nutrition" | "approach" | "progress";
export default function WeekPlanner({
  kind = "overview",
}: {
  kind?: PlannerKind;
}) {
  const {
    t,
    pair,
    lang,
    selectedDate,
    setSelectedDate,
    weekPlan,
    setWeekPlan,
    logs,
    training,
    habits,
    notify,
  } = useApp();
  const [edit, setEdit] = useState(false),
    [draft, setDraft] = useState(weekPlan);
  const days = weekDates(selectedDate),
    day = dayIndex(selectedDate),
    plan = weekPlan[String(day)],
    future = selectedDate > today();
  const dates = `${displayDate(days[0], lang)} — ${displayDate(days[6], lang)} · ${calendarDate(selectedDate).getFullYear()}`;
  const done = training.filter(
    (s) => s.date === selectedDate && s.done.length > 0,
  ).length;
  const habitCount = (habits[selectedDate] || []).length;
  const log = logs.find((l) => l.date === selectedDate);
  const title =
    kind === "nutrition"
      ? t("أفكار وجبات هذا اليوم", "Meal ideas for this day")
      : kind === "approach"
        ? t("تركيزك لهذا اليوم", "Your focus for this day")
        : kind === "progress"
          ? t("متابعة اليوم المحدد", "Your selected day")
          : pair(planNames[plan]);
  const body =
    kind === "nutrition"
      ? pair(mealIdeas[day].flex)
      : kind === "progress"
        ? log
          ? t(
              "لديك متابعة محفوظة لهذا التاريخ.",
              "You have a check-in saved for this date.",
            )
          : t(
              "لم تسجّل متابعة لهذا التاريخ بعد.",
              "No check-in saved for this date yet.",
            )
        : pair(recoveryIdeas[day]);
  return (
    <section
      className={`week-planner week-${kind}`}
      aria-label={t("جدول الأسبوع", "Weekly planner")}
    >
      <div className="week-header">
        <div className="week-caption">
          <CalendarDays size={18} />
          <span>{t("أسبوعك، بطريقتك", "YOUR WEEK. YOUR WAY.")}</span>
          <strong>{dates}</strong>
        </div>
        <div className="week-actions">
          <button
            className="week-today"
            onClick={() => setSelectedDate(today())}
          >
            {t("اليوم", "Today")}
          </button>
          <button
            className="icon-button"
            aria-label={t("الأسبوع السابق", "Previous week")}
            onClick={() => setSelectedDate(shiftDate(selectedDate, -7))}
          >
            <ArrowRight size={17} />
          </button>
          <button
            className="icon-button"
            aria-label={t("الأسبوع القادم", "Next week")}
            onClick={() => setSelectedDate(shiftDate(selectedDate, 7))}
          >
            <ArrowLeft size={17} />
          </button>
        </div>
      </div>
      <div className="week-days">
        {days.map((date) => {
          const index = dayIndex(date),
            id = weekPlan[String(index)],
            active = date === selectedDate,
            hasData =
              logs.some((l) => l.date === date) ||
              training.some((s) => s.date === date && s.done.length) ||
              !!habits[date]?.length;
          return (
            <button
              key={date}
              className={`week-day ${active ? "is-active" : ""} ${date === today() ? "is-today" : ""}`}
              data-date={date}
              onClick={() => setSelectedDate(date)}
              aria-pressed={active}
              aria-label={`${displayDate(date, lang, true)} · ${pair(planNames[id])}${hasData ? ` · ${t("نشاط محفوظ", "Saved activity")}` : ""}`}
              aria-current={date === today() ? "date" : undefined}
            >
              <span>
                {lang === "en"
                  ? weekdays[index][1].slice(0, 3)
                  : pair(weekdays[index])}
              </span>
              <strong>{calendarDate(date).getDate()}</strong>
              <span className={`day-plan-tag ${id === "c" ? "is-flex" : ""}`}>
                {id === "rest"
                  ? t("تعافٍ", "Recover")
                  : id === "c"
                    ? t("مرن", "Flexible")
                    : t("أساس", "Core")}
              </span>
              <span className="day-data-dot" aria-hidden="true">
                {hasData ? <Check size={10} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="day-brief">
        <div className="day-brief-title">
          <span className="small-label">
            {displayDate(selectedDate, lang, true)}
            {future ? ` · ${t("تخطيط", "PLANNING")}` : ""}
          </span>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="day-brief-details">
          {kind === "overview" ? (
            <>
              <Link to="/train">
                <span>{t("التدريب", "TRAIN")}</span>
                <strong>{pair(planNames[plan])}</strong>
                <ChevronDown size={14} />
              </Link>
              <Link to="/nutrition">
                <span>{t("التغذية", "FUEL")}</span>
                <strong>
                  {t("وجباتك وعاداتك اليومية", "Your meals & daily habits")}
                </strong>
                <ChevronDown size={14} />
              </Link>
            </>
          ) : (
            <>
              <span>
                <strong>{done}</strong>
                {t("حصص محفوظة", "sessions logged")}
              </span>
              <span>
                <strong>
                  {habitCount}
                  <small>/ 4</small>
                </strong>
                {t("عادات مسجّلة", "habits checked")}
              </span>
            </>
          )}
        </div>
        <button
          className="week-edit"
          onClick={() => {
            setDraft({ ...weekPlan });
            setEdit(true);
          }}
        >
          <Settings2 size={15} />
          <span>{t("عدّل أسبوعك", "Edit your week")}</span>
        </button>
      </div>
      {edit && (
        <Modal
          title={t("أسبوع يناسبك", "Make the week yours")}
          onClose={() => setEdit(false)}
        >
          <form
            className="week-edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              setWeekPlan(draft);
              setEdit(false);
              notify(
                t(
                  "حُفظ توزيع أسبوعك. سجلاتك السابقة تبقى كما هي.",
                  "Weekly layout saved. Existing records stay as they are.",
                ),
              );
            }}
          >
            <p>
              {t(
                "قالب يتكرر أسبوعيًا. نسّقه مع مدربك وتمارين النادي، واترك مساحة للتعافي. اليوم المرن اختياري، وليس حصة إضافية لازمة.",
                "This layout repeats weekly. Coordinate it with your coach and gym training, leaving room for recovery. The flexible day is optional, not an extra required workout.",
              )}
            </p>
            {weekdays.map((name, i) => (
              <label key={i}>
                <span>{pair(name)}</span>
                <select
                  aria-label={`${t("خطة", "Plan for")} ${pair(name)}`}
                  value={draft[String(i)]}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      [String(i)]: e.target.value as PlanId,
                    }))
                  }
                >
                  {(Object.keys(planNames) as PlanId[]).map((id) => (
                    <option key={id} value={id}>
                      {pair(planNames[id])}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button className="button full" type="submit">
              {t("حفظ الجدول", "Save weekly plan")}
              <Check size={17} />
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
