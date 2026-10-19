import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Wind } from "lucide-react";
import type { ExerciseId } from "../lib/data";
import { techniques } from "../lib/techniques";
import { useApp } from "../lib/store";

export default function MovementGuide({ exercise, onPose, onView }: { exercise: ExerciseId; onPose: (phase: number) => void; onView: () => void }) {
  const { t, pair, lang } = useApp();
  const guide = techniques[exercise];
  const [tab, setTab] = useState(0);
  const [stage, setStage] = useState(0);
  const tabs = [t("الحركة", "Movement"), t("أخطاء شائعة", "Common mistakes"), t("نسخة أسهل", "Easier version")];
  const choose = (index: number) => { setStage(index); onPose(guide.steps[index].phase); };
  return <div className="movement-guide" id="movement-guide" tabIndex={-1}>
    <div className="lesson-tabs" role="tablist" aria-label={t("شرح التمرين", "Exercise guide")}>{tabs.map((name, i) => <button
      key={i} role="tab" id={`guide-tab-${exercise}-${i}`} aria-controls={`guide-panel-${exercise}`} aria-selected={tab === i} tabIndex={tab === i ? 0 : -1}
      onClick={() => setTab(i)} onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (i + (event.key === (lang === "ar" ? "ArrowLeft" : "ArrowRight") ? 1 : 2)) % 3;
        setTab(next); document.getElementById(`guide-tab-${exercise}-${next}`)?.focus();
      }}>{name}</button>)}</div>
    <div className="lesson-panel" role="tabpanel" id={`guide-panel-${exercise}`} aria-labelledby={`guide-tab-${exercise}-${tab}`}>
      {tab === 0 ? <>
        <p className="lesson-setup">{pair(guide.setup)}</p>
        <p className="lesson-hint">{t("اضغط مرحلة لتثبيت المجسم على موضعها.", "Select a stage to pause the model at that position.")}</p>
        <div className="lesson-stages" aria-label={t("مراحل الحركة", "Movement stages")}>{guide.steps.map((step, i) => <button key={step.title[1]} aria-pressed={stage === i} onClick={() => choose(i)}><span>{i + 1}</span>{pair(step.title)}</button>)}</div>
        <div className="lesson-active" aria-live="polite"><h3>{pair(guide.steps[stage].title)}</h3><p>{pair(guide.steps[stage].body)}</p><div className="breathing-cue"><Wind size={18} /><span>{pair(guide.steps[stage].breath)}</span></div></div>
        <button className="view-selected-pose" onClick={() => { onPose(guide.steps[stage].phase); onView(); }}>{t("شاهد موضع هذه الخطوة", "View this position")}<ArrowRight size={16} /></button>
        <div className="lesson-navigation"><button disabled={stage === 0} onClick={() => choose(stage - 1)}><ArrowRight className="directional-arrow" size={16} />{t("السابق", "Back")}</button><span dir="ltr">{stage + 1} / {guide.steps.length}</span><button disabled={stage === guide.steps.length - 1} onClick={() => choose(stage + 1)}>{t("التالي", "Next")}<ArrowLeft className="directional-arrow" size={16} /></button></div>
      </> : tab === 1 ? <div className="mistake-list">{guide.mistakes.map((item) => <article key={item.problem[1]}><h3>{pair(item.problem)}</h3><p><Check size={15} />{pair(item.fix)}</p></article>)}</div>
        : <div className="easier-guide"><h3>{t("ابدأ من مستوى تملكه", "Start where you have control")}</h3><ol>{guide.easier.map((text) => <li key={text[1]}>{pair(text)}</li>)}</ol><p className="lesson-model-note">{t("المجسم يعرض النسخة الأساسية؛ البديل موضّح هنا نصيًا.", "The model shows the foundation version; the alternative is explained here in text.")}</p><h4>{t("متى أتقدّم؟", "When to progress")}</h4><p>{pair(guide.progress)}</p></div>}
    </div>
    {guide.source && <a className="technique-source" href={guide.source.url} target="_blank" rel="noreferrer">{t("مرجع الحركة", "Movement reference")} · {guide.source.name}</a>}
  </div>;
}
