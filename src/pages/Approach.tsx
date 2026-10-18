import {
  Heart,
  Moon,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Action, Eyebrow, PageHeading, Reveal } from "../components/UI";
import { sources } from "../lib/data";
import { useApp } from "../lib/store";

export default function Approach() {
  const { t } = useApp();
  const steps = [
    {
      icon: Heart,
      n: "01",
      title: t("غذِّ جسمك، لا تحرمه.", "Nourish your body."),
      body: t(
        "وجبات منتظمة ومتنوعة تكفي للنمو والدراسة والتدريب. بدون سعرات مفروضة، تخطّي وجبات أو تجفيف.",
        "Eat regular, varied meals that support growth, school and training. No prescribed calorie deficit, skipped meals or dehydration.",
      ),
    },
    {
      icon: TrendingUp,
      n: "02",
      title: t("القوّة مؤشر أفضل.", "Follow your strength."),
      body: t(
        "راقب جودة الحركة والطاقة والتعافي. الوزن والخصر قياسات اختيارية ومحايدة، وليست تقييمًا لجسمك أو نجاحك.",
        "Watch movement quality, energy and recovery. Weight and waist are optional, neutral measurements, never a score for your body or success.",
      ),
    },
    {
      icon: Moon,
      n: "03",
      title: t("التعافي جزء من الخطة.", "Recovery is part of training."),
      body: t(
        "حافظ على مواعيد نوم منتظمة وأيام راحة. بما أنك تتمرّن في النادي، نسّق الكالستنكس مع مدربك وقلّل الحجم عند التعب.",
        "Keep consistent sleep and rest days. Since you also train at the gym, coordinate calisthenics with your coach and reduce volume when tired.",
      ),
    },
  ];
  return (
    <div className="page-container">
      <PageHeading
        eyebrow={t("المنهج / صحتك أولًا", "THE APPROACH / HEALTH FIRST")}
        title={t("قوّة تدوم.", "Built to last.")}
        description={t(
          "رغبتك في الحفاظ على العضل مفهومة. الطريقة تبدأ بدعم جسمك، خصوصًا وأنت في سن النمو.",
          "Keeping your strength matters. The way forward starts with supporting your body, especially while you’re growing.",
        )}
      />
      <div className="approach-hero">
        <div>
          <Eyebrow>{t("التنشيف المحافظ", "A CONSERVATIVE APPROACH")}</Eyebrow>
          <h2>
            {t("التوازن هو", "Balance is")}
            <br />
            {t("نقطة القوّة.", "your advantage.")}
          </h2>
          <p>
            {t(
              "لا نفترض أنك تحتاج نزول وزن. يبدأ أي هدف مقصود مع ولي أمرك وطبيب أو أخصائي تغذية مؤهّل، لتحديد ما يناسب نموك ونشاطك.",
              "We don’t assume you need to lose weight. Any intentional weight goal starts with your guardian and a doctor or registered dietitian, taking your growth and activity into account.",
            )}
          </p>
          <Action to="/nutrition">
            {t("ابنِ عادات التغذية", "Build your food habits")}
          </Action>
        </div>
        <div className="approach-photo">
          <img
            src="/assets/pullup.webp"
            alt={t("تدريب العقلة في الهواء الطلق", "Outdoor pull-up training")}
            loading="lazy"
          />
          <span>{t("الجودة قبل الأرقام.", "QUALITY BEFORE NUMBERS.")}</span>
        </div>
      </div>
      <div className="approach-grid">
        {steps.map((s) => (
          <Reveal key={s.n}>
            <article className="approach-card">
              <div>
                <s.icon size={24} strokeWidth={1.4} />
                <span>{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="care-note">
        <ShieldCheck size={30} />
        <div>
          <h3>{t("اسمع إشارات جسمك.", "Listen to your body.")}</h3>
          <p>
            {t(
              "إذا ظهر دوار، تعب مستمر، ألم مفاصل أو تراجع واضح في الأداء: أوقف التمرين المجهد وراجع ولي أمرك ومختصًا. لا تقلّل الأكل أكثر ولا تضاعف التمرين.",
              "If you feel dizzy, persistently tired, have joint pain or a clear drop in performance, pause strenuous training and talk to your guardian and a professional. Don’t cut food further or double your training.",
            )}
          </p>
        </div>
      </Reveal>
      <div className="sources">
        <span>{t("مراجع المحتوى", "CONTENT REFERENCES")}</span>
        {sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
            {s.title}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
