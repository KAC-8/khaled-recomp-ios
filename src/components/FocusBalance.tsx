import { useApp } from "../lib/store";
import type { Pair } from "../lib/data";
import type { PlannerKind } from "./WeekPlanner";
const copy: Record<
  PlannerKind,
  { core: Pair; coreText: Pair; flex: Pair; flexText: Pair }
> = {
  overview: {
    core: ["الأساس الذي تكرّره", "The foundation you repeat"],
    coreText: [
      "حركة بجودة، وجبات منتظمة، ونوم وتعافٍ. هذه أولويات يومك.",
      "Quality movement, regular meals, sleep and recovery. Your daily priorities.",
    ],
    flex: ["المساحة التي تختارها", "The space you choose"],
    flexText: [
      "مهارة خفيفة، وجبة تحبها أو تعديل يومك حسب طاقتك.",
      "Light skill practice, food you enjoy or adapting your day to your energy.",
    ],
  },
  train: {
    core: ["أتقن حركات الأساس", "Master the foundations"],
    coreText: [
      "دفع وسحب وساقان وثبات. التكنيك والتعافي قبل زيادة الحجم.",
      "Push, pull, legs and stability. Technique and recovery before more volume.",
    ],
    flex: ["استكشف على مهلك", "Explore at your pace"],
    flexText: [
      "إيقاع أبطأ أو تدريب تحكّم إذا كنت مرتاحًا. يمكنك تركه.",
      "A slower tempo or control practice when recovered. It is fine to skip it.",
    ],
  },
  nutrition: {
    core: ["انتظام وتنوّع وكفاية", "Regular, varied, enough"],
    coreText: [
      "غذاء يكفي للنمو ويومك، وماء متاح. لا حاجة لحساب عجز سعرات.",
      "Enough food for growth and your day, with water available. No calorie-deficit calculation.",
    ],
    flex: ["مرونة بلا تعويض", "Flexibility without compensation"],
    flexText: [
      "مساحة لأكلاتك وطلعاتك. لا وجبات مذنبة ولا تجويع في اليوم التالي.",
      "Room for favorite foods and social meals. No guilt or restriction the next day.",
    ],
  },
  approach: {
    core: ["ثبّت ما يدعمك", "Keep what supports you"],
    coreText: [
      "النوم والطعام وجودة الحركة. الاستمرار على أساس مريح.",
      "Sleep, food and movement quality. A comfortable, consistent foundation.",
    ],
    flex: ["عدّل التفاصيل", "Adapt the details"],
    flexText: [
      "ترتيب الأيام والمهارات يتغيّر مع دراستك ونشاطك وتعافيك.",
      "Days and skills can change around school, activity and recovery.",
    ],
  },
  progress: {
    core: ["افهم طاقتك وأداءك", "Understand energy & performance"],
    coreText: [
      "سجّل ما يفيدك، وراجع المسار بهدوء بدل الحكم من يوم واحد.",
      "Log what helps and reflect on the trend rather than one day.",
    ],
    flex: ["أضف ما تحتاجه فقط", "Add only what helps"],
    flexText: [
      "القياسات والملاحظات اختيارية. إخفاؤها لا ينقص من تقدّمك.",
      "Measurements and notes are optional. Hiding them takes nothing away from your progress.",
    ],
  },
};
export default function FocusBalance({
  kind = "overview",
}: {
  kind?: PlannerKind;
}) {
  const { t, pair } = useApp();
  const c = copy[kind];
  return (
    <section
      className="focus-balance"
      aria-label={t("الأولويات بقاعدة 80/20", "80/20 priorities")}
    >
      <div className="balance-heading">
        <span className="small-label">
          {t("80/20 · ركّز على ما يهم", "80/20 · FOCUS ON WHAT MATTERS")}
        </span>
        <p>
          {t(
            "طريقة لترتيب اهتمامك، وليست حسبة سعرات أو وعدًا بنسبة نتائج.",
            "A way to organize your attention, not calorie math or a promise of results.",
          )}
        </p>
      </div>
      <div className="balance-columns">
        <article className="balance-core">
          <span className="balance-number" dir="ltr">
            80<small>%</small>
          </span>
          <div>
            <h3>{pair(c.core)}</h3>
            <p>{pair(c.coreText)}</p>
          </div>
        </article>
        <article className="balance-flex">
          <span className="balance-number" dir="ltr">
            20<small>%</small>
          </span>
          <div>
            <h3>{pair(c.flex)}</h3>
            <p>{pair(c.flexText)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
