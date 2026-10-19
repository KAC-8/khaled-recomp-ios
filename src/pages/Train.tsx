import { lazy, Suspense, useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Gauge,
  Focus,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Modal, PageHeading } from "../components/UI";
import { exercises, sessions } from "../lib/data";
import type { ExerciseId } from "../lib/data";
import { today, useApp } from "../lib/store";
import { dayIndex, displayDate } from "../lib/calendar";
import WeekPlanner from "../components/WeekPlanner";
import MovementGuide from "../components/MovementGuide";
const ExerciseScene = lazy(() => import("../components/ExerciseScene"));

function RestTimer({ seconds }: { seconds: number }) {
  const { t } = useApp();
  const [left, setLeft] = useState(seconds),
    [end, setEnd] = useState<number | null>(null);
  useEffect(() => {
    if (end === null) return;
    const timer = setInterval(() => {
      const n = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(n);
      if (n === 0) setEnd(null);
    }, 200);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="rest-timer">
      <Timer size={19} />
      <span>{t("استراحة", "REST")}</span>
      <strong aria-live={left === 0 ? "polite" : "off"} dir="ltr">
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
      </strong>
      <button
        className="icon-button"
        aria-label={
          end
            ? t("إيقاف المؤقت", "Pause timer")
            : t("ابدأ المؤقت", "Start timer")
        }
        onClick={() =>
          end ? setEnd(null) : setEnd(Date.now() + (left || seconds) * 1000)
        }
      >
        {end ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        className="icon-button"
        aria-label={t("إعادة المؤقت", "Reset timer")}
        onClick={() => {
          setLeft(seconds);
          setEnd(null);
        }}
      >
        <RotateCcw size={17} />
      </button>
    </div>
  );
}
export default function Train() {
  const { t, pair, training, toggleExercise, selectedDate, weekPlan, lang } =
    useApp();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<ExerciseId>("pushup"),
    [playing, setPlaying] = useState(!reduced),
    [phase, setPhase] = useState(45),
    [poseRequest, setPoseRequest] = useState(0),
    [view, setView] = useState<"angle" | "side" | "front" | "back">("angle"),
    [speed, setSpeed] = useState(1),
    [highlight, setHighlight] = useState(true),
    [session, setSession] = useState("a"),
    [open, setOpen] = useState(false);
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);
  useEffect(() => {
    const id = weekPlan[String(dayIndex(selectedDate))];
    if (id !== "rest") setSession(id);
  }, [selectedDate, weekPlan]);
  const e = exercises.find((e) => e.id === selected)!;
  const plan = sessions.find((s) => s.id === session)!;
  const done =
    training.find((s) => s.date === selectedDate && s.session === session)
      ?.done || [];
  const showPart = (id: string) => {
    const part = document.getElementById(id);
    part?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    part?.focus({ preventScroll: true });
  };
  return (
    <div className="page-container train-page">
      <PageHeading
        eyebrow={t("تمريني / الكالستنكس", "MY TRAINING / CALISTHENICS")}
        title={t("افهم الحركة. وابدأ.", "See the move. Get started.")}
        description={t(
          "حركات واضحة، حصة محفوظة، وراحة بين المجموعات.",
          "Clear movements, a saved session and rest between sets.",
        )}
      >
        <button className="button" onClick={() => setOpen(true)}>
          <Play size={17} fill="currentColor" />
          {weekPlan[String(dayIndex(selectedDate))] === "rest" || selectedDate > today()
            ? t("استعرض حصة", "Preview a session") : t("ابدأ حصة", "Start a session")}
        </button>
      </PageHeading>
      <WeekPlanner kind="train" />
      <p className="training-day-caption">{weekPlan[String(dayIndex(selectedDate))] === "rest"
        ? t("يوم تعافٍ في جدولك. استعرض الحركات للتعلّم، ولا تحتاج حصة إضافية.", "A recovery day in your plan. Explore movements to learn; no extra session needed.")
        : t("نسّق هذه الحصة مع تدريب النادي، وخذ راحة إذا كنت متعبًا.", "Coordinate this session with gym training, and rest if tired.")}</p>
      <div
        className="exercise-selector"
        aria-label={t("اختر حركة", "Choose a movement")}
      >
        {exercises.map((x, i) => (
          <button
            key={x.id}
            aria-pressed={selected === x.id}
            className={selected === x.id ? "selected" : ""}
            onClick={() => {
              setSelected(x.id);
              setPhase(45);
              setPoseRequest((request) => request + 1);
            }}
          >
            <span>0{i + 1}</span>
            {pair(x.name)}
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
      <div className="movement-layout">
        <section
          className="movement-stage"
          id="movement-stage"
          tabIndex={-1}
          aria-label={t("عرض الحركة", "Movement demonstration")}
        >
          <div className="stage-top">
            <span>
              {t("دراسة الحركة", "MOVEMENT STUDY")}{" "}
              <span className="stage-bullet">/</span>{" "}
              {String(exercises.indexOf(e) + 1).padStart(2, "0")}
            </span>
            <span className="stage-3d">3D</span>
          </div>
          <Suspense
            fallback={
              <div className="scene-loading">
                {t("نجهّز الاستوديو…", "Preparing the studio…")}
              </div>
            }
          >
            <ExerciseScene
              exercise={selected}
              playing={playing}
              phase={phase}
              view={view}
              speed={speed}
              highlight={highlight}
              poseRequest={poseRequest}
            />
          </Suspense>
          <div className="stage-hint">
            {t("اسحب لتغيير الزاوية", "Drag to explore the angle")}
          </div>
          <div className="stage-controls">
            <button
              className="play-button"
              onClick={() => setPlaying((v) => !v)}
              aria-label={
                playing
                  ? t("إيقاف الحركة", "Pause movement")
                  : t("تشغيل الحركة", "Play movement")
              }
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <input
              aria-label={t("موضع الحركة", "Movement position")}
              type="range"
              min="0"
              max="100"
              value={phase}
              onChange={(event) => {
                setPlaying(false);
                setPhase(Number(event.target.value));
              }}
            />
          </div>
          <p className="demo-note">
            {t(
              "مجسّم توضيحي؛ تعلّم التكنيك مع مدرب مؤهّل.",
              "Illustrative movement study. Learn technique with a qualified coach.",
            )}
          </p>
          <details className="studio-settings">
          <summary>{t("زوايا العرض والسرعة", "Camera & playback")}</summary>
          <div className="studio-options">
            <div
              className="camera-options"
              aria-label={t("زوايا العرض", "Camera angles")}
            >
              {(["angle", "front", "side", "back"] as const).map((angle, i) => (
                <button
                  key={angle}
                  aria-pressed={view === angle}
                  onClick={() => setView(angle)}
                >
                  {
                    [
                      t("مائل", "Angle"),
                      t("أمامي", "Front"),
                      t("جانبي", "Side"),
                      t("خلفي", "Back"),
                    ][i]
                  }
                </button>
              ))}
            </div>
            <div className="studio-toggles">
              <button
                onClick={() => setSpeed((s) => (s === 1 ? 0.5 : 1))}
                aria-label={t("سرعة الحركة", "Movement speed")}
              >
                <Gauge size={14} />
                <span dir="ltr">{speed}×</span>
              </button>
              <button
                onClick={() => setHighlight((s) => !s)}
                aria-pressed={highlight}
              >
                <Focus size={14} />
                {t("العضلات", "Muscles")}
              </button>
            </div>
          </div>
          </details>
          <button className="back-to-guide" onClick={() => showPart("movement-guide")}>{t("العودة لشرح الحركة", "Back to movement guide")}<ChevronRight size={16} /></button>
        </section>
        <section className="movement-info" key={selected}>
          <span className="small-label">{pair(e.group)}</span>
          <h2>
            {pair(e.name)}
            <span>.</span>
          </h2>
          <p className="exercise-description">{pair(e.description)}</p>
          <div className="exercise-stats">
            <div>
              <strong>{e.sets}</strong>
              <span>{t("مجموعات", "SETS")}</span>
            </div>
            <div>
              <strong dir="ltr">{e.reps}</strong>
              <span>
                {selected === "hollow"
                  ? t("ثانية", "SECONDS")
                  : t("تكرارات", "REPS")}
              </span>
            </div>
            <div>
              <strong>
                {e.rest}
                <small>s</small>
              </strong>
              <span>{t("راحة", "REST")}</span>
            </div>
          </div>
          <MovementGuide key={selected} exercise={selected} onPose={(position) => { setPlaying(false); setPhase(position); setPoseRequest((request) => request + 1); }} onView={() => showPart("movement-stage")} />
          <p className="level-note">{t("اترك تكرارين أو أكثر قبل التعب التام. ابدأ بمجموعتين، وعدّل مع مدربك حسب تمارين النادي.", "Keep at least two reps in reserve. Begin with two sets and adjust with your coach around gym sessions.")}</p>
          <p className="caution">{pair(e.caution)}</p>
        </section>
      </div>
      <details className="alternative-sessions">
        <summary>{t("حصص بديلة", "Alternative sessions")}</summary>
        <div className="session-cards">
          {sessions.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setSession(s.id);
                setOpen(true);
              }}
            >
              <span className="session-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <div>
                <strong>{pair(s.title)}</strong>
                <span>{pair(s.subtitle)}</span>
              </div>
              <span>
                {s.exercises.length} {t("حركات", "moves")}
              </span>
              <ChevronRight size={19} />
            </button>
          ))}
        </div>
      </details>
      {open && (
        <Modal
          title={`${t("حصّتك", "Your session")} · ${displayDate(selectedDate, lang)}`}
          onClose={() => setOpen(false)}
        >
          <div className="session-modal">
            <div className="session-tabs">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  className={s.id === session ? "active" : ""}
                  aria-pressed={s.id === session}
                  onClick={() => setSession(s.id)}
                >
                  {s.id.toUpperCase()} · {pair(s.title)}
                </button>
              ))}
            </div>
            <p>
              {t(
                "ابدأ بإحماء مريح 5–10 دقائق للرسغين والكتفين والجسم. عدّل الحجم مع مدربك، وتوقّف عند الألم. علّم الحركة بعد إنهاء مجموعاتها.",
                "Begin with 5–10 minutes of comfortable wrist, shoulder and whole-body warm-up. Adjust volume with your coach and stop for pain. Check a movement after completing its sets.",
              )}
            </p>
            <div className="session-progress">
              <span>
                {
                  done.filter((id) => plan.exercises.includes(id as ExerciseId))
                    .length
                }{" "}
                / {plan.exercises.length}
              </span>
              <div>
                <i
                  style={{
                    width: `${(done.filter((id) => plan.exercises.includes(id as ExerciseId)).length / plan.exercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {plan.exercises.map((id) => {
              const x = exercises.find((x) => x.id === id)!;
              return (
                <div className="session-item" key={id}>
                  <button
                    className={`check-button ${done.includes(id) ? "checked" : ""}`}
                    aria-label={`${t("إكمال", "Complete")} ${pair(x.name)}`}
                    aria-pressed={done.includes(id)}
                    disabled={selectedDate > today()}
                    onClick={() => toggleExercise(session, id)}
                  >
                    {done.includes(id) ? <Check size={18} /> : null}
                  </button>
                  <button
                    className="session-exercise-name"
                    onClick={() => {
                      setSelected(id);
                      setOpen(false);
                    }}
                  >
                    <strong>{pair(x.name)}</strong>
                    <span dir="ltr">
                      {x.sets} × {x.reps}
                    </span>
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`${t("شاهد", "View")} ${pair(x.name)}`}
                    onClick={() => {
                      setSelected(id);
                      setOpen(false);
                    }}
                  >
                    <Play size={16} />
                  </button>
                </div>
              );
            })}
            <RestTimer key={selectedDate + session} seconds={90} />
            <p className="subtle">
              {t(
                selectedDate > today()
                  ? "يوم قادم: استعرض الخطة الآن، وسجّل الإنجاز في يومه."
                  : "الحفظ تلقائي للتاريخ المحدد. يمكنك العودة وإكمال الحصة لاحقًا.",
                selectedDate > today()
                  ? "A future day: preview the plan now and log activity on the day."
                  : "Saved automatically for the selected date. Return and pick up where you left off.",
              )}
            </p>
            <button className="button full" onClick={() => setOpen(false)}>
              {done.length >= plan.exercises.length
                ? t(
                    "حصة مكتملة. أحسنت الاستماع لجسمك.",
                    "Session complete. Keep listening to your body.",
                  )
                : t("حفظ والعودة للاستوديو", "Save & return to the studio")}
              <Check size={17} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
