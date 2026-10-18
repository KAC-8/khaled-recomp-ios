import { useState } from "react";
import {
  Check,
  Droplets,
  Leaf,
  Moon,
  Sun,
  Utensils,
  Footprints,
} from "lucide-react";
import { PageHeading, Reveal } from "../components/UI";
import { today, useApp } from "../lib/store";
import { dayIndex, mealIdeas } from "../lib/calendar";
import WeekPlanner from "../components/WeekPlanner";
import FocusBalance from "../components/FocusBalance";

export default function Nutrition() {
  const { t, habits, toggleHabit, selectedDate, pair } = useApp();
  const [meal, setMeal] = useState(0);
  const done = habits[selectedDate] || [];
  const idea = mealIdeas[dayIndex(selectedDate)];
  const meals = [
    {
      name: t("الفطور", "Breakfast"),
      title: t("بداية تمنحك طاقة.", "Start with energy."),
      foods: [
        t("بيض أو لبن / زبادي", "Eggs or milk / yogurt"),
        t("خبز حبوب كاملة أو شوفان", "Wholegrain bread or oats"),
        t("فاكهة تحبها", "Fruit you enjoy"),
      ],
      note: t(
        "مثال مرن؛ عدّل الكمية مع شهيتك واحتياجك، بدون تخطّي الوجبة.",
        "A flexible example. Adjust to your appetite and needs rather than skipping the meal.",
      ),
    },
    {
      name: t("الغداء", "Lunch"),
      title: t("وجبة متوازنة. بطريقتك.", "A balanced plate. Your way."),
      foods: [
        t("دجاج، سمك أو عدس", "Chicken, fish or lentils"),
        t("أرز أو خبز أو بطاطس", "Rice, bread or potatoes"),
        t("خضار + زيت زيتون أو مكسرات", "Vegetables + olive oil or nuts"),
      ],
      note: t(
        "الكربوهيدرات وقود مفيد للتدريب. لا تحتاج إلغاء الأرز أو الخبز.",
        "Carbohydrates help fuel training. There’s no need to cut out rice or bread.",
      ),
    },
    {
      name: t("العشاء", "Dinner"),
      title: t("اختم يومك بتغذية كافية.", "Finish the day well fed."),
      foods: [
        t("ساندويتش تونة أو حمّص", "Tuna or hummus sandwich"),
        t("خضار أو شوربة", "Vegetables or soup"),
        t(
          "لبن أو بديل مدعّم يناسبك",
          "Milk or a suitable fortified alternative",
        ),
      ],
      note: t(
        "لا تعوّض عن وجبة كبيرة بتجويع نفسك في اليوم التالي. ارجع لإيقاعك الطبيعي.",
        "Don’t compensate for a larger meal by going hungry the next day. Return to your regular routine.",
      ),
    },
    {
      name: t("حول التمرين", "Around training"),
      title: t("طاقة للحركة. غذاء للتعافي.", "Fuel to move. Food to recover."),
      foods: [
        t(
          "قبل: موزة وخبز أو زبادي إذا ناسبك",
          "Before: a banana and toast or yogurt if comfortable",
        ),
        t(
          "بعد: وجبتك المعتادة مع مصدر بروتين",
          "After: your usual meal with a protein source",
        ),
        t(
          "ماء متاح قبل وأثناء وبعد",
          "Water available before, during and after",
        ),
      ],
      note: t(
        "تجنّب مشروبات الطاقة ومكمّلات حرق الدهون. لا حاجة لمنتج خاص حتى تتقدّم.",
        "Avoid energy drinks and fat-burning supplements. Progress doesn’t require a special product.",
      ),
    },
  ];
  const habitsList = [
    { id: "meals", icon: Utensils, name: t("وجبات منتظمة", "Regular meals") },
    {
      id: "water",
      icon: Droplets,
      name: t("شرب الماء خلال اليوم", "Water throughout the day"),
    },
    {
      id: "sleep",
      icon: Moon,
      name: t("وقت كافٍ للنوم", "Enough time for sleep"),
    },
    {
      id: "move",
      icon: Footprints,
      name: t("حركة أستمتع بها", "Movement I enjoy"),
    },
  ];
  return (
    <div className="page-container">
      <PageHeading
        eyebrow={t("التغذية / طاقة للحياة", "NUTRITION / ENERGY FOR LIFE")}
        title={t("غذِّ يومك.", "Fuel your day.")}
        description={t(
          "عادات بسيطة، وأكل تستمتع فيه. طاقة تكفي للتدريب، الدراسة والنمو.",
          "Simple habits. Food you enjoy. Enough energy for training, school and growth.",
        )}
      />
      <WeekPlanner kind="nutrition" />
      <div className="daily-meal-ideas">
        <span className="small-label">
          {t(
            "اقتراحات مرنة لليوم المحدد",
            "FLEXIBLE IDEAS FOR YOUR SELECTED DAY",
          )}
        </span>
        <div>
          {[
            [t("الفطور", "Breakfast"), pair(idea.breakfast)],
            [t("الغداء", "Lunch"), pair(idea.lunch)],
            [t("العشاء", "Dinner"), pair(idea.dinner)],
          ].map(([name, food]) => (
            <article key={name}>
              <span>{name}</span>
              <p>{food}</p>
            </article>
          ))}
        </div>
        <p className="subtle">
          {t(
            "أفكار وليست حصصًا غذائية مفروضة؛ اختر ما يناسب شهيتك واحتياجاتك وحساسياتك.",
            "Ideas, not prescribed portions. Adapt to your appetite, needs and dietary restrictions.",
          )}
        </p>
      </div>
      <FocusBalance kind="nutrition" />
      <div className="nutrition-layout">
        <div className="nutrition-visual">
          <img
            src="/assets/nutrition.webp"
            alt={t(
              "طبق متنوّع من الخضار والحبوب والبروتين",
              "A varied bowl of vegetables, grains and protein",
            )}
            loading="lazy"
          />
          <div>
            <Leaf size={21} />
            <h2>
              {t("أكل حقيقي.", "Real food.")}
              <br />
              {t("حياة حقيقية.", "Real life.")}
            </h2>
          </div>
        </div>
        <div className="meal-plan">
          <span className="small-label">
            {t(
              "أفكار ليومك · ليست وصفة غذائية",
              "IDEAS FOR YOUR DAY · NOT A PRESCRIPTION",
            )}
          </span>
          <div
            className="meal-tabs"
            role="tablist"
            aria-label={t("الوجبات", "Meals")}
          >
            {meals.map((m, i) => (
              <button
                role="tab"
                aria-selected={meal === i}
                aria-controls={`meal-${i}`}
                id={`meal-tab-${i}`}
                key={m.name}
                tabIndex={meal === i ? 0 : -1}
                onKeyDown={(e) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const n =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 3
                          : (meal + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                    setMeal(n);
                    document.getElementById(`meal-tab-${n}`)?.focus();
                  }
                }}
                onClick={() => setMeal(i)}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div
            className="meal-content"
            key={meal}
            role="tabpanel"
            id={`meal-${meal}`}
            aria-labelledby={`meal-tab-${meal}`}
          >
            <Sun size={25} strokeWidth={1.5} />
            <h2>{meals[meal].title}</h2>
            <ul>
              {meals[meal].foods.map((f) => (
                <li key={f}>
                  <Check size={17} />
                  {f}
                </li>
              ))}
            </ul>
            <p>{meals[meal].note}</p>
          </div>
        </div>
      </div>
      <Reveal className="habit-section">
        <div className="section-intro">
          <div>
            <span className="small-label">
              {t("متابعة يومية خفيفة", "A GENTLE DAILY CHECK-IN")}
            </span>
            <h2>
              {t("أشياء صغيرة. فرق كبير.", "Small things. Lasting difference.")}
            </h2>
          </div>
          <span className="habit-count" aria-live="polite">
            {done.length} / 4
          </span>
        </div>
        <div className="habit-grid">
          {habitsList.map((h) => (
            <button
              key={h.id}
              className={`habit ${done.includes(h.id) ? "is-done" : ""}`}
              onClick={() => toggleHabit(h.id)}
              aria-pressed={done.includes(h.id)}
              disabled={selectedDate > today()}
            >
              <h.icon size={25} strokeWidth={1.5} />
              <span>{h.name}</span>
              <span className="habit-check">
                {done.includes(h.id) ? <Check size={15} /> : null}
              </span>
            </button>
          ))}
        </div>
        <p className="subtle">
          {t(
            selectedDate > today()
              ? "يوم قادم: يمكنك التخطيط الآن وتسجيل العادات في يومها."
              : "للتاريخ المحدد فقط. ليس عليك إكمال كل شيء ليكون يومك جيدًا.",
            selectedDate > today()
              ? "A future day: plan now and check in on the day."
              : "For the selected date. You don’t need every box checked to have a good day.",
          )}
        </p>
      </Reveal>
      <div className="nutrition-basics">
        {[
          [
            t("البروتين", "Protein"),
            t(
              "نوّع مصادره في وجباتك: بيض، لبن، سمك، لحوم أو بقول.",
              "Include varied sources in meals: eggs, dairy, fish, meat or legumes.",
            ),
          ],
          [
            t("الكربوهيدرات", "Carbohydrates"),
            t(
              "جزء أساسي من الطاقة. اختر ما تحب من حبوب وخبز وأرز وفاكهة.",
              "An important source of energy. Enjoy grains, bread, rice and fruit.",
            ),
          ],
          [
            t("الدهون والمغذّيات", "Fats & nutrients"),
            t(
              "زيت الزيتون والمكسرات والخضار والفواكه تدعم تنوّع أكلك.",
              "Olive oil, nuts, vegetables and fruit help keep meals varied.",
            ),
          ],
        ].map(([title, body], i) => (
          <article key={title}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
