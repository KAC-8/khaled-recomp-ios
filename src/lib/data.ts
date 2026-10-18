export type Lang = "ar" | "en";
export type Pair = readonly [string, string];
export type ExerciseId = "pushup" | "pullup" | "squat" | "hollow";
export interface Exercise {
  id: ExerciseId;
  name: Pair;
  group: Pair;
  description: Pair;
  sets: string;
  reps: string;
  rest: number;
  cues: Pair[];
  easier: Pair;
  harder: Pair;
  caution: Pair;
}
export const exercises: Exercise[] = [
  {
    id: "pushup",
    name: ["الضغط", "Push-up"],
    group: ["دفع · صدر وذراعان", "PUSH · CHEST & ARMS"],
    description: [
      "حركة أساسية. تحكّم كامل. ابنِ القوة من الأرض.",
      "A foundational movement. Full control. Build strength from the ground up.",
    ],
    sets: "2–3",
    reps: "6–10",
    rest: 90,
    cues: [
      [
        "ضع يديك أعرض قليلًا من كتفيك.",
        "Place hands slightly wider than your shoulders.",
      ],
      [
        "حافظ على الجذع والساقين في خط واحد.",
        "Keep your torso and legs in one line.",
      ],
      [
        "انزل ضمن مدى مريح، ثم ادفع الأرض بعيدًا.",
        "Lower through a comfortable range, then push the floor away.",
      ],
    ],
    easier: ["ضغط على سطح مرتفع وثابت.", "Use a stable elevated surface."],
    harder: [
      "تمهّل في النزول مع إبقاء التكنيك ثابتًا.",
      "Slow the lowering while keeping the same form.",
    ],
    caution: [
      "توقّف عند ألم الرسغ أو الكتف. لا تحبس النفس.",
      "Stop for wrist or shoulder pain. Keep breathing.",
    ],
  },
  {
    id: "pullup",
    name: ["العقلة", "Pull-up"],
    group: ["سحب · ظهر وذراعان", "PULL · BACK & ARMS"],
    description: [
      "ابدأ بالتحكّم في لوح الكتف، ثم ارفع جسمك بثبات.",
      "Set your shoulder blades. Lift your body with control.",
    ],
    sets: "2–3",
    reps: "3–6",
    rest: 120,
    cues: [
      [
        "استخدم بارًا مثبتًا وافحصه قبل التمرين.",
        "Use a secure bar and check it before training.",
      ],
      [
        "ابدأ من تعليق مريح مع كتف نشط.",
        "Begin in a comfortable hang with active shoulders.",
      ],
      [
        "اسحب بدون تأرجح، وانزل بهدوء.",
        "Pull without swinging. Lower with control.",
      ],
    ],
    easier: [
      "استخدم مساعدة القدمين أو رباط مقاومة بإشراف مدرب.",
      "Use foot assistance or a resistance band with a coach.",
    ],
    harder: [
      "توقّف لحظة في الأعلى بدون تمديد الرقبة.",
      "Pause at the top without reaching with your neck.",
    ],
    caution: [
      "لا ترفس للوصول للأعلى. توقّف إذا ظهر ألم في الكتف.",
      "Avoid kicking to reach the top. Stop for shoulder pain.",
    ],
  },
  {
    id: "squat",
    name: ["القرفصاء", "Bodyweight squat"],
    group: ["ساقان · توازن وتحكّم", "LEGS · BALANCE & CONTROL"],
    description: [
      "قوة تبدأ من قاعدة ثابتة ومدى يناسبك.",
      "Strength starts with a stable base and a range that works for you.",
    ],
    sets: "2–3",
    reps: "8–12",
    rest: 90,
    cues: [
      [
        "اختر وقفة مريحة مع ثبات القدمين.",
        "Choose a comfortable stance. Keep feet grounded.",
      ],
      [
        "اجعل الركبتين باتجاه أصابع القدمين.",
        "Let knees follow the direction of your toes.",
      ],
      [
        "انزل بمدى مريح ثم اصعد بدون اندفاع.",
        "Lower to a comfortable depth, then stand without bouncing.",
      ],
    ],
    easier: [
      "اجلس برفق على كرسي ثابت ثم قف.",
      "Sit gently onto a stable chair, then stand.",
    ],
    harder: [
      "أضف توقّفًا قصيرًا في أسفل الحركة.",
      "Add a brief pause at the bottom.",
    ],
    caution: [
      "العمق ليس مسابقة. عدّل المدى إذا ظهر ألم.",
      "Depth is personal. Adjust your range if it hurts.",
    ],
  },
  {
    id: "hollow",
    name: ["ثبات هولو", "Hollow hold"],
    group: ["جذع · ثبات وتحكّم", "CORE · STABILITY & CONTROL"],
    description: [
      "ثبات بسيط يبني تحكّمك في باقي الحركات.",
      "A focused hold that supports control in every other movement.",
    ],
    sets: "2–3",
    reps: "10–20 s",
    rest: 60,
    cues: [
      [
        "استلقِ واضغط أسفل ظهرك برفق باتجاه الأرض.",
        "Lie back and gently keep your lower back against the floor.",
      ],
      [
        "ارفع الكتفين والساقين ضمن قدرتك.",
        "Lift shoulders and legs only as far as you can control.",
      ],
      [
        "اثنِ الركبتين إذا ابتعد ظهرك عن الأرض.",
        "Bend your knees if your lower back lifts.",
      ],
    ],
    easier: [
      "اثنِ الركبتين وقرّب اليدين من جسمك.",
      "Tuck the knees and keep arms beside your body.",
    ],
    harder: [
      "مدّ الساقين أكثر مع الحفاظ على أسفل الظهر ثابتًا.",
      "Extend the legs while keeping your lower back grounded.",
    ],
    caution: [
      "استمر بالتنفس. توقّف عند ألم أسفل الظهر.",
      "Keep breathing. Stop for lower back pain.",
    ],
  },
];
export const sessions = [
  {
    id: "a",
    title: ["الأساس", "Foundation"] as Pair,
    subtitle: ["دفع وساقان", "Push & legs"] as Pair,
    exercises: ["pushup", "squat"] as ExerciseId[],
  },
  {
    id: "b",
    title: ["التحكّم", "Control"] as Pair,
    subtitle: ["سحب وجذع", "Pull & core"] as Pair,
    exercises: ["pullup", "hollow"] as ExerciseId[],
  },
  {
    id: "c",
    title: ["التكامل", "Full body"] as Pair,
    subtitle: ["حركة متكاملة", "Move together"] as Pair,
    exercises: ["pushup", "pullup", "squat", "hollow"] as ExerciseId[],
  },
];
export const sources = [
  {
    title: "American Academy of Pediatrics",
    url: "https://www.healthychildren.org/English/healthy-living/sports/Pages/Weigh-Ins-Weight-Gain-Rules-for-Teen-Athletes.aspx",
  },
  {
    title: "NHS · Healthy eating for young people",
    url: "https://derbyshireteenhealth.nhs.uk/healthylifestyle/healthy-eating-young-people",
  },
];
