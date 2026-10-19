import type { ExerciseId, Pair } from "./data";
export interface MovementStep { title: Pair; body: Pair; breath: Pair; phase: number }
export interface Technique { setup: Pair; steps: MovementStep[]; mistakes: { problem: Pair; fix: Pair }[]; easier: Pair[]; progress: Pair; source?: { name: string; url: string } }
export const techniques: Record<ExerciseId, Technique> = {
 pushup: {
  setup: ["أرض ثابتة، كفّان قريبان من مستوى الكتفين، وجذع مشدود برفق.", "Use a stable floor, hands near shoulder level and a gently braced trunk."],
  steps: [
   { title: ["ثبّت البداية", "Set your starting position"], body: ["مدّ جسمك من الرأس للكعبين، ووزّع الضغط على الكفين. أبقِ الرقبة امتدادًا للظهر.", "Align head, trunk and heels. Spread pressure through your palms and keep your neck aligned."], breath: ["تنفّس بهدوء قبل النزول.", "Breathe comfortably before lowering."], phase: 95 },
   { title: ["انزل بتحكّم", "Lower with control"], body: ["اثنِ المرفقين وانزل بالجسم كوحدة واحدة ضمن مدى مريح؛ لا تترك الحوض يهبط.", "Bend your elbows and lower as one unit through a comfortable range. Keep hips from sagging."], breath: ["خذ شهيقًا أثناء النزول.", "Inhale as you lower."], phase: 8 },
   { title: ["ادفع وارجع", "Push back up"], body: ["ادفع الأرض بعيدًا حتى تعود للبداية. أنهِ المجموعة عندما لا تستطيع الحفاظ على الوضعية.", "Push the floor away to return. End the set when you can no longer maintain your position."], breath: ["أخرج الزفير أثناء الدفع.", "Exhale while pushing up."], phase: 95 },
  ],
  mistakes: [
   { problem: ["الحوض يهبط", "Hips sag"], fix: ["قصّر المجموعة أو استخدم سطحًا مرتفعًا ثابتًا.", "Shorten the set or use a stable elevated surface."] },
   { problem: ["الرأس يسبق الجسم", "Head reaches forward"], fix: ["أبقِ الرقبة مع الجذع وانزل بالجسم معًا.", "Keep your neck aligned and lower your whole body together."] },
  ],
  easier: [["ضع الكفين على حائط أو سطح مرتفع ثابت لا ينزلق.", "Put hands on a wall or a stable elevated surface that cannot slide."], ["حافظ على خط الجسم نفسه. كلما ارتفع السطح، أصبحت الحركة أخف غالبًا.", "Keep the same body alignment. A higher surface generally makes the movement easier."]],
  progress: ["اخفض ارتفاع السطح تدريجيًا مع مدربك عندما تؤدي الحركة براحة وتحكّم.", "Lower the surface gradually with your coach once movement feels comfortable and controlled."],
  source: { name: "ACE · Push-up", url: "https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/" },
 },
 pullup: {
  setup: ["بار مثبت ومناسب لقبضتك، مع وصول آمن إليه ودون قفز عشوائي.", "Use a secure bar with a comfortable grip and a safe way to reach it."],
  steps: [
   { title: ["جهّز التعليق", "Set up the hang"], body: ["امسك البار فوق مستوى الكتفين بقليل إذا ناسبك. ابدأ بتعليق مريح مع تحكّم في الكتفين، لا تأرجح.", "Grip the bar slightly wider than shoulder width if comfortable. Begin with a controlled hang and steady shoulders."], breath: ["خذ نفسًا هادئًا قبل السحب.", "Take a comfortable breath before pulling."], phase: 0 },
   { title: ["اسحب بثبات", "Pull smoothly"], body: ["وجّه المرفقين لأسفل واسحب جسمك دون رفس. اقترب من البار بمدى تستطيع التحكم فيه، دون مدّ الرقبة للوصول.", "Drive elbows down and pull without kicking. Use a range you control, without reaching your neck toward the bar."], breath: ["أخرج الزفير أثناء السحب.", "Exhale as you pull."], phase: 95 },
   { title: ["انزل بهدوء", "Lower gently"], body: ["مدّ الذراعين تدريجيًا إلى تعليق مريح مع بقاء الكتفين تحت السيطرة. أعد القدمين لسطح آمن عند الانتهاء.", "Gradually extend your arms into a comfortable, controlled hang. Return feet to a safe surface when finished."], breath: ["خذ شهيقًا أثناء النزول.", "Inhale as you lower."], phase: 0 },
  ],
  mistakes: [
   { problem: ["رفس وتأرجح", "Kicking and swinging"], fix: ["استعمل مساعدة مناسبة بإشراف مدرب بدل محاولة إجبار التكرار.", "Use suitable assistance with a coach instead of forcing the rep."] },
   { problem: ["الرقبة ممدودة للأعلى", "Neck cranes upward"], fix: ["راقب استقامة الرأس، واكتفِ بالمدى الذي تملكه.", "Keep your head aligned and use the range you can control."] },
  ],
  easier: [["جرّب مساعدة القدمين على سطح ثابت يختاره مدربك، أو رباطًا مناسبًا بإشرافه.", "Try foot assistance on a stable support chosen by your coach, or a suitable band with supervision."], ["اجعل المساعدة كافية لحركة هادئة؛ لا تحاول النزول البطيء من أعلى البار دون تأهيل.", "Use enough assistance for smooth movement; do not attempt unprepared slow lowers from the top."]],
  progress: ["خفّف المساعدة تدريجيًا مع بقاء السحب والنزول متحكّمًا فيهما.", "Reduce assistance gradually while keeping both lifting and lowering controlled."],
  source: { name: "NASM · Pull-up", url: "https://www.nasm.org/resource-center/exercise-library/pull-up" },
 },
 squat: {
  setup: ["قف على سطح ثابت، بقدمين في وقفة مريحة ووزن موزّع عليهما.", "Stand on a stable surface with a comfortable stance and weight across both feet."],
  steps: [
   { title: ["ثبّت القدمين", "Ground your feet"], body: ["أبقِ الكعب ومقدمة القدم على الأرض. وجّه أصابع القدمين قليلًا للخارج إذا كان ذلك أريح لك.", "Keep heels and forefeet grounded. Turn toes slightly outward if that feels more comfortable."], breath: ["خذ نفسًا مريحًا قبل النزول.", "Take a comfortable breath before lowering."], phase: 0 },
   { title: ["اجلس للخلف ولأسفل", "Sit back and down"], body: ["اثنِ الورك والركبتين معًا، واجعل الركبتين باتجاه الأصابع. انزل إلى عمق مريح مع بقاء القدمين ثابتتين.", "Bend hips and knees together, keeping knees tracking with toes. Lower to a comfortable depth while feet stay grounded."], breath: ["خذ شهيقًا أثناء النزول.", "Inhale as you lower."], phase: 95 },
   { title: ["قف بتحكّم", "Stand with control"], body: ["اضغط بالأرض وارجع للوقوف دون قفز أو اندفاع. أنهِ الحركة واقفًا بشكل طبيعي.", "Press into the floor and stand without bouncing or jumping. Finish in a natural standing position."], breath: ["أخرج الزفير أثناء الصعود.", "Exhale as you stand."], phase: 0 },
  ],
  mistakes: [
   { problem: ["الكعب يرتفع", "Heels lift"], fix: ["قلّل العمق وجرّب وقفة مريحة مع مدربك.", "Reduce depth and find a comfortable stance with your coach."] },
   { problem: ["الركبتان تنهاران للداخل", "Knees collapse inward"], fix: ["أبطئ الحركة ووجّه الركبتين مع أصابع القدمين.", "Slow down and keep knees tracking with toes."] },
  ],
  easier: [["ضع كرسيًا ثابتًا خلفك لا ينزلق، واجلس عليه برفق ثم قف.", "Use a stable chair behind you that cannot slide. Sit gently, then stand."], ["استخدم عمقًا يناسبك ولا تهبط على الكرسي بقوة.", "Choose a comfortable depth and avoid dropping onto the chair."]],
  progress: ["عندما تتحكم في الحركة، أضف مدى مريحًا أو توقّفًا قصيرًا بدل استعجال التكرارات.", "Once controlled, add comfortable range or a short pause instead of rushing repetitions."],
  source: { name: "ACE · Bodyweight squat", url: "https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/" },
 },
 hollow: {
  setup: ["بساط مريح؛ الهدف ثبات الجذع مع التنفّس، وليس رفع الساقين إلى أقصى حد.", "Use a comfortable mat. Aim for trunk control while breathing, not the hardest leg position."],
  steps: [
   { title: ["ابحث عن الثبات", "Find a stable hold"], body: ["ابدأ مستلقيًا والركبتان مثنيتان. أبقِ أسفل الظهر ملامسًا للأرض برفق، ثم ارفع الكتفين بالقدر المريح.", "Begin lying down with bent knees. Gently keep your lower back against the floor and lift shoulders only as comfortable."], breath: ["استمر بأنفاس قصيرة ومريحة.", "Keep breathing comfortably."], phase: 45 },
   { title: ["اختر طولًا تتحكم فيه", "Choose a lever you control"], body: ["مدّ الساقين والذراعين فقط ما دام ظهرك ثابتًا. إذا بدأ يتقوّس، ارجع فورًا لوضع أقصر بالركبتين مثنيتين.", "Extend legs and arms only while your back stays grounded. If it arches, return to a shorter position with bent knees."], breath: ["لا تحبس النفس حتى تحافظ على الثبات.", "Do not hold your breath to maintain the position."], phase: 45 },
   { title: ["راقب الجودة", "Check the quality"], body: ["حافظ على الموضع وقتًا مريحًا، ثم أرخِ الجسم على البساط. المجسم يعرض الثبات؛ الدخول والخروج والبديل المثني موضّحة نصيًا.", "Hold for a comfortable time, then relax onto the mat. The model shows the hold; entry, exit and the tucked alternative are described in text."], breath: ["إذا انقطع تنفّسك الطبيعي، خفّف أو أنهِ المحاولة.", "Ease off or finish if you cannot breathe normally."], phase: 45 },
  ],
  mistakes: [
   { problem: ["الظهر يتقوّس", "Lower back arches"], fix: ["اثنِ الركبتين وقرّب الذراعين من الجذع.", "Bend your knees and move arms closer to your torso."] },
   { problem: ["شدّ في الرقبة أو ألم في الظهر", "Neck strain or back pain"], fix: ["توقّف، وأعد تقييم الوضع مع مدرب مؤهل.", "Stop and review your position with a qualified coach."] },
  ],
  easier: [["أبقِ الركبتين مثنيتين والذراعين بجانب الجسم.", "Keep knees bent and arms alongside your body."], ["ابدأ بثبات قصير مريح؛ الجودة والتنفس أهم من طول الوقت.", "Use a short, comfortable hold. Position and breathing matter more than duration."]],
  progress: ["مدّ الأطراف تدريجيًا فقط مع ثبات الظهر والتنفس المريح، بدون اختبار أقصى زمن.", "Extend limbs gradually while keeping a grounded back and easy breathing, without a maximum-duration test."],
 },
};
