import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Modal, PageHeading } from "../components/UI";
import { today, useApp, validDate, validateBackup } from "../lib/store";
import type { Log } from "../lib/store";
import WeekPlanner from "../components/WeekPlanner";
import FocusBalance from "../components/FocusBalance";
import { weekDates } from "../lib/calendar";

type Metric = "push" | "pull" | "hold" | "weight" | "waist" | "energy";
function download(name: string, data: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function LogForm({ log, onClose }: { log?: Log; onClose: () => void }) {
  const { t, logs, saveLog, notify, hideBody, selectedDate } = useApp();
  const initialLog = log || logs.find((l) => l.date === selectedDate);
  const [date, setDate] = useState(initialLog?.date || selectedDate),
    [energy, setEnergy] = useState(initialLog?.energy || 3),
    [body, setBody] = useState(
      !hideBody && !!(initialLog?.weight || initialLog?.waist),
    ),
    [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const existing = logs.find((l) => l.date === date);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      ["weight", "waist", "push", "pull", "hold"].map((k) => [
        k,
        String(initialLog?.[k as keyof Log] ?? ""),
      ]),
    ),
  );
  const [note, setNote] = useState(initialLog?.note || "");
  const chooseDate = (value: string) => {
    setDate(value);
    const old = logs.find((l) => l.date === value);
    setValues(
      Object.fromEntries(
        ["weight", "waist", "push", "pull", "hold"].map((k) => [
          k,
          String(old?.[k as keyof Log] ?? ""),
        ]),
      ),
    );
    setEnergy(old?.energy || 3);
    setNote(old?.note || "");
    setBody(!hideBody && !!(old?.weight || old?.waist));
  };
  const fields = [
    {
      key: "push",
      name: t("الضغط · تكرارات نظيفة", "Push-ups · clean reps"),
      max: 500,
      min: 0,
      step: 1,
    },
    {
      key: "pull",
      name: t("العقلة · تكرارات نظيفة", "Pull-ups · clean reps"),
      max: 200,
      min: 0,
      step: 1,
    },
    {
      key: "hold",
      name: t("هولو · ثوانٍ مريحة", "Hollow · controlled seconds"),
      max: 3600,
      min: 0,
      step: 1,
    },
  ];
  return (
    <Modal
      title={
        log
          ? t("تعديل المتابعة", "Edit check-in")
          : t("سجّل يومك", "Check in with yourself")
      }
      onClose={onClose}
    >
      <form
        className="log-form"
        ref={form}
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          if (!validDate(date)) {
            setError(
              t(
                "اختر تاريخًا صحيحًا حتى اليوم.",
                "Choose a valid date up to today.",
              ),
            );
            return;
          }
          const next: Log = {
            id: existing?.id || crypto.randomUUID(),
            date,
            energy,
            note: note.trim(),
          };
          for (const k of [
            "push",
            "pull",
            "hold",
            "weight",
            "waist",
          ] as const) {
            if ((k === "weight" || k === "waist") && !body) {
              if (existing?.[k] !== undefined) next[k] = existing[k];
              continue;
            }
            if (values[k] !== "" && values[k] !== undefined)
              next[k] = Number(values[k]);
          }
          try {
            validateBackup({
              version: 1,
              logs: [next],
              training: [],
              habits: {},
            });
            saveLog(next);
            notify(
              t(
                "حُفظت متابعتك على هذا الجهاز.",
                "Check-in saved on this device.",
              ),
            );
            onClose();
          } catch {
            setError(
              t(
                "راجع القياسات؛ أدخل أرقامًا ضمن المدى الموضّح.",
                "Check measurements and enter numbers within the shown ranges.",
              ),
            );
          }
        }}
      >
        <label>
          {t("التاريخ", "Date")}
          <input
            required
            type="date"
            min="2000-01-01"
            max={today()}
            value={date}
            onChange={(e) => chooseDate(e.target.value)}
          />
        </label>
        {existing && (
          <p className="inline-notice">
            {t(
              "لهذا التاريخ سجل محفوظ. سيُحدّث بالقيم المعروضة.",
              "A check-in exists for this date. Saving updates the values shown.",
            )}
          </p>
        )}
        <fieldset className="energy-field">
          <legend>{t("كيف طاقتك اليوم؟", "How is your energy today?")}</legend>
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={energy === n ? "selected" : ""}>
                <input
                  type="radio"
                  name="energy"
                  value={n}
                  checked={energy === n}
                  onChange={() => setEnergy(n)}
                />
                <span>{n}</span>
              </label>
            ))}
          </div>
          <p>
            <span>{t("منخفضة", "Low")}</span>
            <span>{t("عالية", "High")}</span>
          </p>
        </fieldset>
        <h3>{t("الأداء · اختياري", "Performance · optional")}</h3>
        <p className="subtle">
          {t(
            "من تمرينك المعتاد. لا تحتاج اختبار الحد الأقصى أو الوصول للفشل.",
            "From your usual training. No max-effort test or training to failure needed.",
          )}
        </p>
        <div className="form-grid">
          {fields.map((f) => (
            <label key={f.key}>
              {f.name}
              <input
                inputMode="numeric"
                type="number"
                min={f.min}
                max={f.max}
                step={f.step}
                placeholder="—"
                value={values[f.key] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>
        <button
          className="body-toggle"
          type="button"
          onClick={() => setBody((v) => !v)}
          aria-expanded={body}
        >
          {body ? <EyeOff size={16} /> : <Plus size={16} />}{" "}
          {t("الوزن والخصر · اختياري", "Weight & waist · optional")}
        </button>
        {body && (
          <div className="body-fields">
            <p>
              {t(
                "قياسات محايدة بدون هدف نزول. يمكنك تركها فارغة أو إخفاؤها من لوحة التقدم.",
                "Neutral measurements without a weight-loss target. Leave blank or hide them from your dashboard.",
              )}
            </p>
            <div className="form-grid two">
              <label>
                {t("الوزن · كجم", "Weight · kg")}
                <input
                  type="number"
                  inputMode="decimal"
                  min="20"
                  max="350"
                  step="0.1"
                  placeholder="—"
                  value={values.weight}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, weight: e.target.value }))
                  }
                />
              </label>
              <label>
                {t("الخصر · سم", "Waist · cm")}
                <input
                  type="number"
                  inputMode="decimal"
                  min="30"
                  max="250"
                  step="0.1"
                  placeholder="—"
                  value={values.waist}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, waist: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        )}
        <label>
          {t("ملاحظة لنفسك · اختياري", "A note to yourself · optional")}
          <textarea
            rows={3}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t(
              "كيف كان تمرينك أو نومك؟",
              "How was your training or sleep?",
            )}
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="button full" type="submit">
          {existing
            ? t("تحديث المتابعة", "Update check-in")
            : t("حفظ المتابعة", "Save check-in")}
          <Check size={18} />
        </button>
        <p className="form-privacy">
          <ShieldCheck size={14} />
          {t(
            "محفوظ على هذا المتصفح فقط. صدّر نسخة للاحتفاظ بها.",
            "Saved in this browser only. Export a copy to keep it safe.",
          )}
        </p>
      </form>
    </Modal>
  );
}

function Chart({
  logs,
  metric,
  label,
  unit,
}: {
  logs: Log[];
  metric: Metric;
  label: string;
  unit: string;
}) {
  const { t, lang } = useApp();
  const [active, setActive] = useState<number | null>(null);
  const points = logs.filter((l) => l[metric] !== undefined);
  useEffect(() => setActive(null), [metric, logs.length]);
  if (points.length < 2)
    return (
      <div className="chart-empty">
        <Activity size={38} strokeWidth={1} />
        <h3>{t("تقدّمك يستحق وقتًا.", "Progress takes time.")}</h3>
        <p>
          {points.length
            ? t(
                "أضف متابعة ثانية لهذا المؤشر لرؤية المسار.",
                "Add a second check-in for this metric to see a trend.",
              )
            : t(
                "ابدأ بأول متابعة. سيظهر مسارك هنا مع الوقت.",
                "Start with a check-in. Your trend will take shape here.",
              )}
        </p>
      </div>
    );
  const vals = points.map((p) => p[metric] as number),
    min = Math.min(...vals),
    max = Math.max(...vals),
    pad = Math.max(
      (max - min) * 0.25,
      metric === "weight" || metric === "waist" ? 1 : 2,
    ),
    lo = Math.max(0, min - pad),
    hi = max + pad;
  const w = 900,
    h = 260,
    px = 52,
    py = 30;
  const first = Date.parse(points[0].date),
    last = Date.parse(points.at(-1)!.date);
  const coords = points.map((p) => ({
    x:
      px + ((Date.parse(p.date) - first) / (last - first || 1)) * (w - px - 20),
    y: h - py - (((p[metric] as number) - lo) / (hi - lo)) * (h - 2 * py),
  }));
  const line = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const highlight =
    active !== null && points[active] ? active : points.length - 1;
  const date = (d: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
      day: "numeric",
      month: "short",
      calendar: "gregory",
    }).format(new Date(d + "T12:00:00"));
  return (
    <div className="chart" dir="ltr">
      <div className="chart-readout">
        <strong>
          {points[highlight][metric]}
          <small>{unit}</small>
        </strong>
        <span>{date(points[highlight].date)}</span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${label}: ${points.map((p) => `${p.date}: ${p[metric]}`).join(", ")}`}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4f00" stopOpacity=".13" />
            <stop offset="100%" stopColor="#ff4f00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((v) => {
          const y = py + v * (h - 2 * py);
          return (
            <g key={v}>
              <line
                x1={px}
                x2={w - 20}
                y1={y}
                y2={y}
                stroke="#e7e7e9"
                strokeDasharray="4 5"
              />
              <text x={0} y={y + 4} fill="#777" fontSize="12">
                {(hi - v * (hi - lo)).toFixed(
                  metric === "weight" || metric === "waist" ? 1 : 0,
                )}
              </text>
            </g>
          );
        })}
        <polygon
          points={`${coords[0].x},${h - py} ${line} ${coords.at(-1)!.x},${h - py}`}
          fill="url(#chart-fill)"
        />
        <polyline
          points={line}
          fill="none"
          stroke="#d44000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <g
            key={points[i].id}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            tabIndex={0}
            role="img"
            aria-label={`${date(points[i].date)}: ${vals[i]} ${unit}`}
          >
            <circle cx={c.x} cy={c.y} r="14" fill="transparent" />
            <circle
              cx={c.x}
              cy={c.y}
              r={highlight === i ? 5 : 3}
              fill="#d44000"
              stroke="#fff"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
      <div className="chart-dates">
        <span>{date(points[0].date)}</span>
        <span>{date(points.at(-1)!.date)}</span>
      </div>
    </div>
  );
}

export default function Progress() {
  const {
    t,
    lang,
    logs,
    training,
    hideBody,
    toggleBody,
    removeLog,
    backup,
    importData,
    notify,
    selectedDate,
    habits,
  } = useApp();
  const [form, setForm] = useState<Log | null | false>(false),
    [metric, setMetric] = useState<Metric>("push"),
    [period, setPeriod] = useState("90"),
    [deleteId, setDeleteId] = useState<string | null>(null),
    [incoming, setIncoming] = useState<ReturnType<
      typeof validateBackup
    > | null>(null),
    [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const labels: Record<Metric, string> = {
    push: t("الضغط", "Push-ups"),
    pull: t("العقلة", "Pull-ups"),
    hold: t("هولو", "Hollow hold"),
    weight: t("الوزن", "Weight"),
    waist: t("الخصر", "Waist"),
    energy: t("الطاقة", "Energy"),
  };
  const units: Record<Metric, string> = {
    push: t("تكرار", "reps"),
    pull: t("تكرار", "reps"),
    hold: t("ثانية", "sec"),
    weight: t("كجم", "kg"),
    waist: t("سم", "cm"),
    energy: "/ 5",
  };
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(period));
  const filtered =
    period === "all"
      ? logs
      : logs.filter(
          (l) => Date.parse(l.date + "T12:00:00") >= cutoff.getTime(),
        );
  const visibleMetric =
    hideBody && ["weight", "waist"].includes(metric) ? "push" : metric;
  const latest = (m: Metric) =>
    [...logs].reverse().find((l) => l[m] !== undefined)?.[m];
  const exportData = () =>
    download(`khalid-cut-${today()}.json`, JSON.stringify(backup(), null, 2));
  const date = (d: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      calendar: "gregory",
    }).format(new Date(d + "T12:00:00"));
  const selectedLog = logs.find((l) => l.date === selectedDate);
  const currentWeek = weekDates(selectedDate);
  const weekLogs = logs.filter((l) => currentWeek.includes(l.date));
  const dayMoves = training
    .filter((s) => s.date === selectedDate)
    .reduce((n, s) => n + s.done.length, 0);
  return (
    <div className="page-container">
      <PageHeading
        eyebrow={t("التقدم / الصورة الكاملة", "PROGRESS / THE BIGGER PICTURE")}
        title={t("راقب ما يهم.", "Measure what matters.")}
        description={t(
          "قوّتك، طاقتك، وإحساسك بالحركة. سجل شخصي يساعدك تفهم تقدّمك بدون ضغط.",
          "Your strength, energy and how movement feels. A personal record to understand progress without pressure.",
        )}
      >
        <button
          className="button"
          onClick={() => setForm(null)}
          disabled={selectedDate > today()}
        >
          <Plus size={18} />
          {t("متابعة جديدة", "New check-in")}
        </button>
      </PageHeading>
      <WeekPlanner kind="progress" />
      <div className="daily-reflection">
        <div>
          <span className="small-label">
            {t("اليوم المحدد", "SELECTED DAY")}
          </span>
          <h2>
            {selectedLog
              ? t("متابعتك محفوظة.", "Your check-in is saved.")
              : t("مساحة لمتابعتك.", "Space for your check-in.")}
          </h2>
        </div>
        <div>
          <strong>
            {selectedLog?.energy ?? "—"}
            <small>/ 5</small>
          </strong>
          <span>{t("طاقة اليوم", "Day’s energy")}</span>
        </div>
        <div>
          <strong>{dayMoves}</strong>
          <span>{t("حركات مسجّلة", "moves logged")}</span>
        </div>
        <div>
          <strong>{weekLogs.length}</strong>
          <span>{t("متابعات هذا الأسبوع", "check-ins this week")}</span>
        </div>
      </div>
      <div className="metrics-grid">
        {(["push", "pull", "energy"] as Metric[]).map((m) => (
          <button
            className={`metric-card ${visibleMetric === m ? "selected" : ""}`}
            onClick={() => setMetric(m)}
            key={m}
          >
            <span>{labels[m]}</span>
            <strong>
              {latest(m) ?? "—"}
              <small>{units[m]}</small>
            </strong>
            <span className="subtle">{t("آخر تسجيل", "LATEST ENTRY")}</span>
          </button>
        ))}
        <div className="metric-card session-metric">
          <span>{t("حصص بدأتَها", "Sessions started")}</span>
          <strong>
            {training.filter((s) => s.done.length).length}
            <small>{t("حصة", "sessions")}</small>
          </strong>
          <span className="subtle">
            {t("كل خطوة تُحسب", "EVERY STEP COUNTS")}
          </span>
        </div>
      </div>
      <section className="chart-panel">
        <div className="chart-toolbar">
          <div>
            <span className="small-label">
              {t("مسارك بمرور الوقت", "YOUR TREND OVER TIME")}
            </span>
            <h2>{labels[visibleMetric]}</h2>
          </div>
          <div className="chart-options">
            <label className="sr-only" htmlFor="metric-select">
              {t("المؤشر", "Metric")}
            </label>
            <select
              id="metric-select"
              value={visibleMetric}
              onChange={(e) => setMetric(e.target.value as Metric)}
            >
              {(Object.keys(labels) as Metric[])
                .filter((m) => !hideBody || !["weight", "waist"].includes(m))
                .map((m) => (
                  <option key={m} value={m}>
                    {labels[m]}
                  </option>
                ))}
            </select>
            <div className="period-tabs" aria-label={t("الفترة", "Time range")}>
              {["30", "90", "all"].map((p) => (
                <button
                  className={period === p ? "active" : ""}
                  aria-pressed={period === p}
                  key={p}
                  onClick={() => setPeriod(p)}
                >
                  {p === "all" ? t("الكل", "All") : `${p} ${t("يوم", "days")}`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Chart
          logs={filtered}
          metric={visibleMetric}
          label={labels[visibleMetric]}
          unit={units[visibleMetric]}
        />
        <div className="chart-foot">
          <span>
            {t(
              "قراءة واحدة لا تحكي القصة كاملة.",
              "One entry doesn’t tell the whole story.",
            )}
          </span>
          <button onClick={toggleBody} aria-pressed={hideBody}>
            {hideBody ? <Eye size={15} /> : <EyeOff size={15} />}{" "}
            {hideBody
              ? t("إظهار قياسات الجسم", "Show body measurements")
              : t("إخفاء قياسات الجسم", "Hide body measurements")}
          </button>
        </div>
      </section>
      <FocusBalance kind="progress" />
      <section className="history-section">
        <div className="section-intro">
          <div>
            <span className="small-label">
              {t("تاريخك الشخصي", "YOUR PERSONAL RECORD")}
            </span>
            <h2>
              {t("كل متابعة. في مكان واحد.", "Every check-in. In one place.")}
            </h2>
          </div>
          <div className="data-actions">
            <button onClick={exportData}>
              <ArrowDownToLine size={16} />
              {t("تصدير", "Export")}
            </button>
            <button onClick={() => fileRef.current?.click()}>
              <ArrowUpFromLine size={16} />
              {t("استعادة نسخة", "Restore backup")}
            </button>
            <input
              type="file"
              accept=".json,application/json"
              ref={fileRef}
              className="sr-only"
              aria-label={t("ملف النسخة الاحتياطية", "Backup file")}
              onChange={async (e) => {
                setError("");
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 2_000_000) throw Error();
                  setIncoming(validateBackup(JSON.parse(await file.text())));
                } catch {
                  setError(
                    t(
                      "لم نتمكن من قراءة النسخة. اختر ملف Khalid Cut صالحًا أصغر من 2 ميجابايت.",
                      "Couldn’t read this backup. Choose a valid Khalid Cut JSON file under 2 MB.",
                    ),
                  );
                }
                e.target.value = "";
              }}
            />
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {logs.length === 0 ? (
          <div className="history-empty">
            <Activity size={26} />
            <h3>
              {t("هذه الصفحة تنتظر أول خطوة.", "Your first step goes here.")}
            </h3>
            <p>
              {t(
                "أضف طاقتك وأداءك. القياسات الأخرى اختيارية دائمًا.",
                "Log your energy and performance. Other measurements are always optional.",
              )}
            </p>
            <button
              className="text-link"
              onClick={() => setForm(null)}
              disabled={selectedDate > today()}
            >
              <Plus size={16} />
              {t("سجّل أول متابعة", "Create your first check-in")}
            </button>
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>{t("التاريخ", "Date")}</th>
                  <th>{labels.push}</th>
                  <th>{labels.pull}</th>
                  <th>{labels.hold}</th>
                  <th>{labels.energy}</th>
                  {!hideBody && (
                    <>
                      <th>{labels.weight}</th>
                      <th>{labels.waist}</th>
                    </>
                  )}
                  <th>{t("إدارة", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {[...logs].reverse().map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{date(l.date)}</strong>
                      {l.note && <span className="entry-note">{l.note}</span>}
                    </td>
                    <td>{l.push ?? "—"}</td>
                    <td>{l.pull ?? "—"}</td>
                    <td>
                      {l.hold !== undefined ? `${l.hold} ${t("ث", "s")}` : "—"}
                    </td>
                    <td>{l.energy !== undefined ? `${l.energy} / 5` : "—"}</td>
                    {!hideBody && (
                      <>
                        <td>
                          {l.weight !== undefined
                            ? `${l.weight} ${t("كجم", "kg")}`
                            : "—"}
                        </td>
                        <td>
                          {l.waist !== undefined
                            ? `${l.waist} ${t("سم", "cm")}`
                            : "—"}
                        </td>
                      </>
                    )}
                    <td>
                      <div className="row-actions">
                        {deleteId === l.id ? (
                          <>
                            <button
                              className="delete-confirm"
                              onClick={() => {
                                removeLog(l.id);
                                setDeleteId(null);
                                notify(
                                  t("حُذفت المتابعة.", "Check-in deleted."),
                                );
                              }}
                            >
                              {t("تأكيد الحذف", "Confirm delete")}
                            </button>
                            <button onClick={() => setDeleteId(null)}>
                              {t("إلغاء", "Cancel")}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="icon-button"
                              aria-label={`${t("تعديل", "Edit")} ${l.date}`}
                              onClick={() => setForm(l)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="icon-button"
                              aria-label={`${t("حذف", "Delete")} ${l.date}`}
                              onClick={() => setDeleteId(l.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="privacy-note">
        <ShieldCheck size={20} />
        <p>
          {t(
            "بياناتك تبقى في هذا المتصفح ولا تُرسل لخادم. قد تُحذف عند مسح بيانات المتصفح؛ صدّر نسخة آمنة، واستعدها على جهازك الآخر عند الحاجة.",
            "Your entries stay in this browser and are not sent to a server. Clearing browser data can remove them. Export a safe copy and restore it on another device when needed.",
          )}
        </p>
      </div>
      {form !== false && (
        <LogForm log={form || undefined} onClose={() => setForm(false)} />
      )}
      {incoming && (
        <Modal
          title={t("استعادة النسخة الاحتياطية", "Restore your backup")}
          onClose={() => setIncoming(null)}
        >
          <div className="import-review">
            <ArrowUpFromLine size={32} />
            <h3>
              {incoming.logs.length} {t("متابعات", "check-ins")} ·{" "}
              {incoming.training.length} {t("حصص", "sessions")}
            </h3>
            <p>
              {t(
                "الاستعادة تستبدل السجل والحصص والعادات الحالية بالنسخة المختارة. احتفظ بنسخة من بياناتك الحالية أولًا.",
                "Restoring replaces your current check-ins, sessions and habits with this backup. Keep a copy of your current data first.",
              )}
            </p>
            <button className="text-link" onClick={exportData}>
              <ArrowDownToLine size={17} />
              {t("تصدير بياناتي الحالية", "Export current data")}
            </button>
            <button
              className="button full"
              onClick={() => {
                importData(incoming);
                setIncoming(null);
                notify(t("استُعيدت النسخة.", "Backup restored."));
              }}
            >
              {t("استبدال واستعادة", "Replace & restore")}
              <Check size={17} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
