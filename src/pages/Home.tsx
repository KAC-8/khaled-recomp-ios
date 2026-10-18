import {
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Action, Eyebrow, Reveal } from "../components/UI";
import { useApp } from "../lib/store";
import WeekPlanner from "../components/WeekPlanner";
import FocusBalance from "../components/FocusBalance";

export default function Home() {
  const { t, training, logs } = useApp();
  const count = training.filter((s) => s.done.length > 0).length;
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Eyebrow>
              {t("مساحتك للقوّة والتوازن", "YOUR SPACE FOR STRENGTH & BALANCE")}
            </Eyebrow>
            <h1 tabIndex={-1}>
              {t("قوّتك.", "Your strength.")}
              <br />
              {t("بإيقاعك.", "Your pace.")}
              <span className="orange-period">/</span>
            </h1>
            <p className="hero-description">
              {t(
                "تحرّك بوعي. كُل بتوازن. وتقدّم على مهل. تجربة شخصية تجمع الكالستنكس وعادات تدعم جسمك، كل يوم.",
                "Move with intent. Eat for energy. Make steady progress. Your personal space for calisthenics and habits that support your body.",
              )}
            </p>
            <div className="hero-buttons">
              <Action to="/train">
                {t("اكتشف تدريبك", "Explore your training")}
              </Action>
              <Link className="text-link" to="/approach">
                {t("تعرّف على المنهج", "Meet the approach")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>
          <div className="hero-note">
            <ShieldCheck size={18} />
            <span>
              {t(
                "الأداء أولًا. صحتك دائمًا.",
                "Performance first. Your health, always.",
              )}
            </span>
          </div>
        </div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/assets/rings.webp"
            alt={t(
              "رياضي يتدرّب على حلقات الجمباز",
              "Athlete training on gymnastic rings",
            )}
            fetchPriority="high"
          />
          <div className="image-shade" />
          <div className="hero-image-top">
            <span>CALISTHENICS</span>
            <span>MOVE WITH INTENT</span>
          </div>
          <div className="image-caption">
            <span>{t("تحكّم، ثم قوّة.", "CONTROL. THEN STRENGTH.")}</span>
            <p>{t("جسمك هو نقطة البداية.", "It starts with your own body.")}</p>
            <Link
              to="/train"
              className="round-arrow"
              aria-label={t("افتح الكالستنكس", "Explore calisthenics")}
            >
              <ArrowUpRight size={25} />
            </Link>
          </div>
        </motion.div>
      </section>
      <div className="home-week">
        <WeekPlanner />
      </div>
      <FocusBalance />
      <div className="principle-strip">
        <span>{t("حركة مدروسة", "INTENTIONAL MOVEMENT")}</span>
        <span className="strip-cross">/</span>
        <span>{t("تغذية متوازنة", "BALANCED NUTRITION")}</span>
        <span className="strip-cross">/</span>
        <span>{t("تقدّم مستمر", "STEADY PROGRESS")}</span>
      </div>
      <section className="overview-section">
        <Reveal className="section-intro">
          <div>
            <Eyebrow>{t("كل شيء في مكانه", "A PLACE FOR EVERY PART")}</Eyebrow>
            <h2>{t("خطوة واضحة. كل يوم.", "A clear next step. Every day.")}</h2>
          </div>
          <p>
            {t(
              "اختر ما تحتاجه اليوم. الباقي يأتي مع الاستمرار.",
              "Find what you need today. The rest comes with consistency.",
            )}
          </p>
        </Reveal>
        <div className="path-grid">
          <Reveal>
            <Link to="/train" className="path-card training-card">
              <div className="card-top">
                <span>01</span>
                <ArrowUpRight size={23} />
              </div>
              <div className="mini-lines" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div>
                <span className="small-label">{t("تدرّب", "TRAIN")}</span>
                <h3>{t("امتلك حركتك.", "Own your movement.")}</h3>
                <p>
                  {t(
                    "مكتبة ثلاثية الأبعاد. تكنيك واضح. تقدّم محسوب.",
                    "3D movement studio. Clear technique. Thoughtful progression.",
                  )}
                </p>
              </div>
            </Link>
          </Reveal>
          <Reveal>
            <Link to="/nutrition" className="path-card food-card">
              <img src="/assets/nutrition.webp" alt="" loading="lazy" />
              <div className="card-top">
                <span>02</span>
                <ArrowUpRight size={23} />
              </div>
              <div>
                <span className="small-label">{t("تغذَّ", "FUEL")}</span>
                <h3>{t("غذِّ قوّتك.", "Fuel your strength.")}</h3>
                <p>
                  {t(
                    "أكل حقيقي، وطاقة تكفي ليومك.",
                    "Real food. Energy for your whole day.",
                  )}
                </p>
              </div>
            </Link>
          </Reveal>
          <Reveal>
            <Link to="/progress" className="path-card progress-card">
              <div className="card-top">
                <span>03</span>
                <ArrowUpRight size={23} />
              </div>
              <Activity
                className="progress-art"
                size={120}
                strokeWidth={0.7}
                aria-hidden="true"
              />
              <div>
                <span className="small-label">{t("تابع", "REFLECT")}</span>
                <h3>{t("شاهد تطوّرك.", "See your progress.")}</h3>
                <p>
                  {t(
                    "أداؤك، طاقتك، وسجلك. الصورة الكاملة.",
                    "Your performance, energy and history. The full picture.",
                  )}
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>
      <Reveal className="daily-checkin">
        <div className="daily-title">
          <span className="section-number">/ 04</span>
          <h2>{t("البداية من هنا.", "Your starting point.")}</h2>
          <p>
            {count
              ? t(
                  "كل حصة خطوة في بناء عادة.",
                  "Every session is a step toward a habit.",
                )
              : t(
                  "لا تحتاج بداية مثالية. تحتاج أول خطوة.",
                  "You don’t need a perfect start. Just a first step.",
                )}
          </p>
        </div>
        <div className="daily-stat">
          <span>{t("حصص مسجّلة", "SESSIONS LOGGED")}</span>
          <strong>{String(count).padStart(2, "0")}</strong>
        </div>
        <div className="daily-stat">
          <span>{t("قياسات محفوظة", "CHECK-INS SAVED")}</span>
          <strong>{String(logs.length).padStart(2, "0")}</strong>
        </div>
        <Link
          className="circle-link"
          to="/progress"
          aria-label={t("اذهب لسجلك", "Go to your history")}
        >
          <ArrowUpRight size={28} />
        </Link>
      </Reveal>
      <Reveal className="health-note">
        <Target size={22} />
        <p>
          {t(
            "هدفك جسم أقوى وعلاقة أفضل مع الأكل. في سن النمو، أي تغيير مقصود في الوزن يبدأ مع ولي أمرك ومختص، بدون حرمان أو استعجال.",
            "Your goal is a stronger body and a healthy relationship with food. While growing, any planned weight change starts with a guardian and a qualified professional — without restriction or rushing.",
          )}
        </p>
        <Link to="/approach">
          {t("اقرأ المنهج", "Read the approach")}
          <ChevronLeft size={16} />
        </Link>
      </Reveal>
    </div>
  );
}
