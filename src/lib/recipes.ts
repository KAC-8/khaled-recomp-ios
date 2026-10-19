import type { Pair } from "./data";
export interface RecipeStep { title: Pair; body: Pair }
export interface Recipe { time: Pair; tools: Pair; steps: RecipeStep[]; tip: Pair; swap: Pair; foodSafety?: Pair }
const step = (ar: string, en: string, bodyAr: string, bodyEn: string): RecipeStep => ({ title: [ar, en], body: [bodyAr, bodyEn] });
const chickenSafety: Pair = ["الدجاج جاهز عند وصول أسمك جزء إلى 74°م بميزان طعام؛ اللون وحده لا يكفي.", "Check the thickest part reaches 74°C with a food thermometer. Colour alone is not enough."];
export const recipes: Record<string, Recipe> = {
 eggs: {
  time: ["10–15 دقيقة", "10–15 min"], tools: ["مقلاة غير لاصقة، ملعقة، محمصة اختيارية", "Non-stick pan, spatula, optional toaster"],
  steps: [
   step("جهّز الإضافات", "Prepare the sides", "اغسل الفاكهة وجهّز الخبز. اكسر البيض في وعاء منفصل واخفقه بالشوكة.", "Wash the fruit and set out the bread. Crack eggs into a separate bowl and whisk with a fork."),
   step("اطبخ على نار هادئة", "Cook gently", "سخّن المقلاة على نار متوسطة إلى هادئة مع زيت يناسبك. أضف البيض وحرّكه برفق حتى يتماسك ولا يبقى سائلًا.", "Warm the pan over medium-low heat with an oil you use. Add eggs and stir gently until set, with no runny egg remaining."),
   step("قدّم الوجبة", "Put the meal together", "حمّص الخبز إذا رغبت، ثم قدّم البيض والفاكهة بجانبه. جهّز كمية تناسب شهيتك.", "Toast the bread if you like. Serve with the eggs and fruit, in amounts that suit your appetite."),
  ], tip: ["النار العالية تجفف البيض بسرعة؛ خفّضها وحرّك بهدوء.", "High heat dries eggs quickly. Lower the heat and stir gently."], swap: ["بديل: حمّص جاهز بدل البيض، وخبز يناسب حساسياتك.", "Swap eggs for prepared hummus and choose bread that suits your dietary needs."],
 },
 oats: {
  time: ["8–12 دقيقة", "8–12 min"], tools: ["قدر صغير، كوب للقياس، ملعقة", "Small saucepan, measuring cup, spoon"],
  steps: [
   step("اخلط الشوفان والحليب", "Combine oats and milk", "استخدم تقريبًا مقدار شوفان مع مقدارين من الحليب أو بديل مدعّم. هذه نسبة للطبخ؛ حضّر الكمية التي تحتاجها.", "Use roughly one part oats to two parts milk or a fortified alternative. This is a cooking ratio; make the amount you need."),
   step("اطبخ مع التحريك", "Simmer and stir", "سخّن على نار متوسطة، ثم خفّض النار عند بدء الغليان. حرّك 5–7 دقائق تقريبًا أو حسب عبوة الشوفان، حتى يلين.", "Heat over medium heat, then reduce to a gentle simmer. Stir for around 5–7 minutes, or follow the oat packet, until soft."),
   step("أضف الموز", "Add the banana", "ارفع القدر عن النار. أضف الموز المقطع، وزد الحليب إذا كان القوام أثقل مما تحب.", "Take the pan off the heat. Add sliced banana and a little more milk if you prefer a looser texture."),
  ], tip: ["حرّك من قاع القدر حتى لا يلتصق الشوفان.", "Stir along the bottom of the pan to prevent sticking."], swap: ["بدّل الموز بفاكهة متوفرة، والحليب ببديل مدعّم يناسبك.", "Use fruit you have and a fortified milk alternative that suits you."],
 },
 foul: {
  time: ["10–15 دقيقة", "10–15 min"], tools: ["قدر، شوكة، سكين ولوح للخضار", "Saucepan, fork, knife and vegetable board"],
  steps: [
   step("ابدأ بفول مطبوخ", "Use cooked beans", "استخدم فولًا مطبوخًا مسبقًا أو معلبًا جاهزًا للأكل؛ لا تطبّق هذه الطريقة على الفول الجاف. اغسل الطماطم والخيار وقطّعهما.", "Use previously cooked or ready-to-eat canned fava beans; these steps are not for dried beans. Wash and slice the tomato and cucumber."),
   step("سخّن واضبط القوام", "Warm and adjust texture", "ضع الفول في القدر مع قليل من الماء. سخّنه مع التحريك، ثم اهرس جزءًا منه بالشوكة إذا أحببت قوامًا أنعم.", "Put beans in a pan with a splash of water. Heat while stirring, then mash some with a fork if you prefer a smoother texture."),
   step("أضف وقدّم", "Finish and serve", "أضف زيت الزيتون والليمون أو الكمون إن توفر. قدّم الخبز والخضار بجانبه.", "Add olive oil and lemon or cumin if available. Serve bread and vegetables alongside."),
  ], tip: ["الماء يُضاف تدريجيًا حتى لا يصبح الفول خفيفًا جدًا.", "Add water gradually so the beans do not become too thin."], swap: ["يمكن استخدام حمّص أو عدس مطبوخ إذا كان الفول لا يناسبك.", "Use cooked chickpeas or lentils if fava beans do not suit you."],
 },
 yogurt: {
  time: ["5 دقائق", "5 min"], tools: ["وعاء، ملعقة، سكين للفواكه", "Bowl, spoon, fruit knife"],
  steps: [
   step("جهّز الفاكهة", "Prepare the fruit", "اغسل الفاكهة، وأزل البذور أو القشر غير الصالح للأكل، ثم قطّعها.", "Wash the fruit, remove any inedible peel or seeds, then cut it up."),
   step("اخلط الوعاء", "Build the bowl", "ضع الزبادي في الوعاء وأضف الشوفان المناسب للأكل بهذه الطريقة حسب العبوة. اخلط حتى يتوزّع.", "Spoon yogurt into a bowl. Add oats suitable for this use according to their packet, then stir together."),
   step("أضف الفاكهة", "Add the fruit", "وزّع الفاكهة فوقه. اتركه قليلًا في الثلاجة إذا رغبت في شوفان ألين.", "Add the fruit on top. Refrigerate briefly if you prefer the oats softer."),
  ], tip: ["حضّره في علبة محكمة واحتفظ به مبردًا إذا ستأخذه معك.", "Use a sealed container and keep it chilled if taking it with you."], swap: ["اختر زباديًا أو بديلًا مدعّمًا يناسبك، وبدّل الفاكهة حسب المتوفر.", "Choose yogurt or a fortified alternative that suits you, and use fruit you have."],
 },
 chicken: {
  time: ["25–35 دقيقة تقريبًا", "Around 25–35 min"], tools: ["قدر للأرز، مقلاة، لوح منفصل للدجاج، ميزان طعام", "Rice saucepan, frying pan, separate chicken board, food thermometer"],
  steps: [
   step("ابدأ بالأرز", "Start the rice", "اطبخ الأرز بالماء حسب تعليمات نوعه على العبوة. جهّز السلطة على لوح نظيف قبل التعامل مع الدجاج النيئ.", "Cook rice with water following its packet instructions. Prepare the salad on a clean board before handling raw chicken."),
   step("جهّز الدجاج", "Prepare the chicken", "قطّع الدجاج إلى قطع متقاربة الحجم على لوح منفصل، وتبّله بما تحب. اغسل يديك والأدوات بعد ملامسة الدجاج النيئ.", "Cut chicken into similar-sized pieces on a separate board and season as you like. Wash hands and utensils after handling raw chicken."),
   step("اطبخ وتحقّق", "Cook and check", "سخّن مقلاة بزيت مناسب، ثم اطبخ الدجاج على نار متوسطة واقلبه حتى ينضج. افحص أسمك قطعة بميزان الطعام؛ يجب أن تصل إلى 74°م.", "Heat a pan with a suitable oil. Cook chicken over medium heat, turning it until cooked. Check the thickest piece reaches 74°C with a food thermometer."),
   step("اجمع الوجبة", "Bring it together", "قدّم الدجاج مع الأرز والسلطة وزيت الزيتون. استخدم طبقًا نظيفًا للدجاج المطبوخ.", "Serve chicken with rice, salad and olive oil. Use a clean plate for the cooked chicken."),
  ], tip: ["حجم القطع وحرارة المقلاة يغيّران وقت الطبخ؛ الوقت تقديري.", "Piece size and pan heat affect cooking time; the time estimate is only a guide."], swap: ["تفضّل البقول؟ بدّل الوجبة من القائمة إلى العدس والأرز.", "Prefer legumes? Choose the lentil and rice meal from the swap menu."], foodSafety: chickenSafety,
 },
 lentils: {
  time: ["30–40 دقيقة، أو أسرع بعدس مطبوخ", "30–40 min, or quicker with cooked lentils"], tools: ["قدران، مصفاة، لوح وسكين", "Two saucepans, sieve, board and knife"],
  steps: [
   step("جهّز العدس", "Prepare the lentils", "اغسل العدس وافحصه، ثم اطبخه في ماء وفق العبوة حتى يلين. إذا كان معلبًا جاهزًا للأكل، صفّه وسخّنه حسب العبوة.", "Rinse and check the lentils, then cook in water according to the packet until tender. Drain ready-to-eat canned lentils and heat as directed."),
   step("اطبخ الأرز", "Cook the rice", "في قدر آخر، اطبخ الأرز حسب تعليمات نوعه. أضف البهارات التي تحبها للعدس بعد أن يلين.", "In another pan, cook rice according to its packet. Season the lentils once tender."),
   step("جهّز السلطة والتقديم", "Prepare salad and serve", "اغسل خضار السلطة وقطّعها. قدّم العدس والأرز مع السلطة واللبن أو بديل يناسبك.", "Wash and cut the salad vegetables. Serve lentils and rice with the salad and yogurt or a suitable alternative."),
  ], tip: ["جهّز الخضار أثناء طبخ العدس والأرز لتختصر الوقت.", "Prepare the vegetables while the rice and lentils cook to save time."], swap: ["العدس المطبوخ الجاهز خيار عملي؛ اتبع تعليمات تسخينه.", "Ready-cooked lentils are convenient; follow their reheating instructions."],
 },
 fish: {
  time: ["35–45 دقيقة تقريبًا", "Around 35–45 min"], tools: ["فرن، صينية، لوح منفصل للسمك، ميزان طعام", "Oven, baking tray, separate fish board, food thermometer"],
  steps: [
   step("ابدأ بالبطاطس", "Start the potatoes", "سخّن الفرن إلى 200°م. اغسل البطاطس والخضار، وقطّع البطاطس قطعًا متقاربة. قلّبها بزيت الزيتون وبهاراتك.", "Preheat the oven to 200°C. Wash potatoes and vegetables; cut potatoes into similar-sized pieces. Toss with olive oil and seasoning."),
   step("أدخل الخضار أولًا", "Give vegetables a head start", "وزّع البطاطس والخضار في الصينية دون تكديس. ابدأ بخبزها نحو 20 دقيقة؛ قد تحتاج البطاطس السميكة وقتًا أطول.", "Spread potatoes and vegetables on the tray without crowding. Bake for around 20 minutes initially; thick potato pieces may need longer."),
   step("أضف السمك", "Add the fish", "جهّز السمك على لوح منفصل، ثم ضعه في الصينية وتابع الطبخ. افحص أسمك جزء: السمك يصل إلى 63°م، والبطاطس تلين عند غرز الشوكة.", "Prepare fish on a separate board, add it to the tray and continue cooking. Check the thickest part reaches 63°C and the potatoes are fork-tender."),
   step("قدّم في طبق نظيف", "Serve on a clean plate", "أخرج الصينية بقفاز فرن وقدّم الوجبة. أضف الليمون بعد الطبخ إن رغبت.", "Use oven gloves to remove the tray and serve the meal. Add lemon after cooking if you like."),
  ], tip: ["الشرائح الرفيعة تنضج أسرع؛ لا تعتمد على الوقت وحده.", "Thin fillets cook faster. Do not rely on cooking time alone."], swap: ["إذا كان السمك لا يناسبك، اختر وجبة أخرى من زر «بدّل».", "If fish does not suit you, use Swap to choose another meal."], foodSafety: ["تحقّق من وصول السمك إلى 63°م بميزان طعام.", "Check fish reaches 63°C with a food thermometer."],
 },
 pasta: {
  time: ["25–35 دقيقة تقريبًا", "Around 25–35 min"], tools: ["قدر، مصفاة، مقلاة، لوح منفصل للدجاج، ميزان طعام", "Saucepan, colander, frying pan, separate chicken board, food thermometer"],
  steps: [
   step("اسلق المكرونة", "Boil the pasta", "اغلِ ماءً في القدر وأضف المكرونة. اتبع وقت العبوة، ثم احتفظ بقليل من ماء السلق قبل التصفية.", "Bring water to a boil and add pasta. Follow its packet time, reserving a little cooking water before draining."),
   step("اطبخ الدجاج", "Cook the chicken", "قطّع الدجاج على لوح منفصل واطبخه في المقلاة بزيت وتتبيلة تناسبك. افحص أسمك قطعة حتى تصل إلى 74°م.", "Cut chicken on a separate board and cook in a pan with oil and seasoning you use. Check the thickest piece reaches 74°C."),
   step("جهّز الصلصة", "Make the sauce", "أضف الخضار وصلصة الطماطم للدجاج المطبوخ. حرّك على نار هادئة حتى تلين الخضار؛ زد قليلًا من ماء المكرونة إذا احتجت.", "Add vegetables and tomato sauce to the cooked chicken. Simmer until vegetables soften, adding a little pasta water if needed."),
   step("اخلط وقدّم", "Combine and serve", "أضف المكرونة وقلّب حتى تتوزع الصلصة. تذوّق واضبط البهارات قبل التقديم.", "Add the drained pasta and toss to coat. Taste and adjust the seasoning before serving."),
  ], tip: ["احتفظ بماء السلق في كوب قبل التصفية لتضبط قوام الصلصة.", "Reserve pasta water in a cup before draining to adjust sauce consistency."], swap: ["بدّل الدجاج بحمص مطبوخ جاهز، واختر مكرونة تناسب حساسياتك.", "Swap chicken for ready-cooked chickpeas and choose pasta that suits your dietary needs."], foodSafety: chickenSafety,
 },
 hummus: {
  time: ["5–10 دقائق", "5–10 min"], tools: ["لوح، سكين، طبق", "Board, knife, plate"],
  steps: [
   step("جهّز الخضار", "Prepare the vegetables", "اغسل الطماطم والخيار وقطّعهما على لوح نظيف.", "Wash tomato and cucumber and cut them on a clean board."),
   step("جهّز الحمّص والخبز", "Prepare hummus and bread", "استخدم حمّصًا جاهزًا للأكل محفوظًا حسب العبوة. دفّئ الخبز إذا أحببت، ثم قدّمه بجانب الحمّص.", "Use ready-to-eat hummus stored according to its label. Warm the bread if you like and serve alongside."),
   step("أكمل الوجبة", "Finish the meal", "أضف الخضار واللبن أو بديلًا يناسبك. أعد العبوات التي تحتاج تبريدًا إلى الثلاجة.", "Add vegetables and yogurt or a suitable alternative. Return chilled ingredients to the fridge."),
  ], tip: ["إذا عبّأتها للخروج، افصل الخبز عن الخضار حتى لا يترطّب.", "If packing it to go, keep bread separate from vegetables so it stays firm."], swap: ["الحمّص قد يحتوي سمسمًا؛ راجع المكونات واختر بديلًا يناسب حساسياتك.", "Hummus may contain sesame. Check ingredients and choose an alternative that suits your dietary needs."],
 },
 sandwich: {
  time: ["10–15 دقيقة", "10–15 min"], tools: ["مقلاة، ملعقة، لوح وسكين", "Frying pan, spatula, board and knife"],
  steps: [
   step("جهّز الخبز والخضار", "Prepare bread and vegetables", "اغسل الخضار وقطّعها. افتح الخبز أو حمّص شرائحه إن رغبت.", "Wash and slice the vegetables. Open the bread or toast the slices if you like."),
   step("اطبخ البيض", "Cook the eggs", "اخفق البيض في وعاء، ثم اطبخه في مقلاة بزيت مناسب على نار متوسطة إلى هادئة حتى يتماسك تمامًا.", "Whisk eggs in a bowl, then cook in a pan with a suitable oil over medium-low heat until fully set."),
   step("ركّب الساندويتش", "Assemble the sandwich", "ضع البيض والخضار في الخبز. أضف فاكهة بجانبه إذا رغبت.", "Fill the bread with eggs and vegetables. Add fruit on the side if you like."),
  ], tip: ["جفّف الخضار بعد غسلها حتى يحافظ الخبز على قوامه.", "Dry vegetables after washing so the bread does not get soggy."], swap: ["استخدم حمّصًا جاهزًا بدل البيض إذا كان أنسب لك.", "Use ready-to-eat hummus instead of eggs if it suits you better."],
 },
 labneh: {
  time: ["5–10 دقائق", "5–10 min"], tools: ["طبق، ملعقة، لوح وسكين", "Plate, spoon, board and knife"],
  steps: [
   step("اغسل وقطّع", "Wash and slice", "اغسل الطماطم والخيار وقطّعهما. جهّز خبزًا يناسبك.", "Wash and slice the tomato and cucumber. Set out bread that suits you."),
   step("جهّز الطبق", "Prepare the plate", "افرد اللبنة في الطبق وأضف زيت الزيتون. يمكنك إضافة زعتر مناسب لحساسياتك إذا أحببت.", "Spread labneh on a plate and add olive oil. Add za’atar suitable for your dietary needs if you like."),
   step("قدّم واحفظ الباقي", "Serve and store", "قدّم الخبز والخضار بجانبه، وأعد اللبنة للثلاجة بعد الاستخدام.", "Serve bread and vegetables alongside, then return the labneh to the fridge."),
  ], tip: ["اتبع تعليمات التبريد على عبوة اللبنة.", "Follow the labneh container’s refrigeration instructions."], swap: ["إذا لا يناسبك الحليب، اختر بديلًا مناسبًا أو بدّل إلى وجبة الحمّص.", "If dairy does not suit you, use an appropriate alternative or swap to the hummus meal."],
 },
 soup: {
  time: ["30–40 دقيقة تقريبًا", "Around 30–40 min"], tools: ["قدر، مصفاة، لوح وسكين، خلاط اختياري", "Saucepan, sieve, board and knife, optional blender"],
  steps: [
   step("جهّز المكونات", "Prepare the ingredients", "اغسل العدس وافحصه. قشّر الجزر والبصل وقطّعهما قطعًا صغيرة.", "Rinse and check the lentils. Peel and finely chop the carrot and onion."),
   step("ابدأ الطبخ", "Start cooking", "قلّب البصل والجزر في القدر مع زيت يناسبك. أضف العدس وماءً يغمره، واتبع كمية الماء ووقت الطبخ على العبوة.", "Soften onion and carrot in a pan with an oil you use. Add lentils and enough water to cover, following the packet’s water and cooking guidance."),
   step("ليّن واضبط القوام", "Soften and adjust", "خفّض النار بعد الغليان واطبخ حتى يلين العدس والجزر. أضف الماء تدريجيًا إذا صارت الشوربة سميكة، ثم اضبط البهارات.", "Reduce to a simmer and cook until lentils and carrot are tender. Add water gradually if too thick, then adjust seasoning."),
   step("قدّم مع الإضافات", "Serve with the sides", "يمكن تركها بقوامها أو مزجها بعد إطفاء النار وتركها تبرد قليلًا وفق تعليمات الخلاط. قدّم الخبز واللبن بجانبها.", "Leave it textured, or turn off the heat and cool slightly before blending according to the blender’s instructions. Serve with bread and yogurt."),
  ], tip: ["قلّب من القاع أثناء الطبخ حتى لا يلتصق العدس.", "Stir along the bottom during cooking to stop lentils sticking."], swap: ["اللبن اختياري بحسب ما يناسبك؛ استخدم بديلًا مناسبًا إذا احتجت.", "Use yogurt or an alternative that suits your dietary needs."],
 },
 "fruit-yogurt": {
  time: ["3–5 دقائق", "3–5 min"], tools: ["وعاء، ملعقة، سكين", "Bowl, spoon, knife"],
  steps: [
   step("جهّز الفاكهة", "Prepare the fruit", "اغسل الفاكهة وأزل الأجزاء غير الصالحة للأكل، ثم قطّعها.", "Wash the fruit, remove inedible parts and cut it up."),
   step("أضف الزبادي", "Add yogurt", "ضع الزبادي أو بديلًا يناسبك في وعاء وأضف الفاكهة فوقه.", "Spoon yogurt or a suitable alternative into a bowl and add the fruit."),
   step("قدّم عند حاجتك", "Have it when needed", "هذه فكرة مرنة بين الوجبات أو حول التمرين، وليست وجبة إضافية إلزامية. احتفظ بها مبردة إذا لن تأكلها الآن.", "A flexible option between meals or around training, not a required extra meal. Keep chilled if you are not eating it now."),
  ], tip: ["علبة محكمة مع تبريد مناسبة إذا ستأخذها معك.", "Use a sealed container and keep it chilled when taking it with you."], swap: ["استخدم فاكهة موسمية أو مجمّدة مذابة حسب العبوة.", "Use seasonal fruit or frozen fruit thawed according to its packet."],
 },
 toast: {
  time: ["5–10 دقائق", "5–10 min"], tools: ["مقلاة أو محمصة، ملعقة", "Frying pan or toaster, spatula"],
  steps: [
   step("جهّز الخبز", "Prepare the bread", "ضع الجبن أو بديلًا يناسبك بين شرائح الخبز. اختر خبزًا مناسبًا لحساسياتك.", "Place cheese or a suitable alternative between bread slices. Choose bread that suits your dietary needs."),
   step("دفّئ برفق", "Warm gently", "استخدم مقلاة على نار هادئة أو محمصة مناسبة للساندويتش. اقلبه حتى يسخن الحشو ويتحمّص الخبز كما تحب.", "Use a pan over low heat or a suitable sandwich toaster. Turn until the filling warms and the bread is toasted as you like."),
   step("قدّم", "Serve", "اتركه لحظة حتى لا يكون الحشو شديد السخونة، ثم قدّمه عندما تحتاج وجبة خفيفة.", "Let the filling cool briefly, then serve when you need a snack."),
  ], tip: ["النار الهادئة تسمح للحشو أن يسخن قبل أن يحترق الخبز.", "Low heat lets the filling warm before the bread burns."], swap: ["يمكن وضع حمّص بدل الجبن وتناوله بدون تسخين الحشو.", "Use hummus instead of cheese and serve without heating the filling."],
 },
 dates: {
  time: ["دقيقتان", "2 min"], tools: ["طبق، كوب", "Plate, glass"],
  steps: [
   step("جهّز التمر", "Prepare the dates", "افحص التمر وأزل النوى قبل الأكل. اختر الكمية التي تناسب شهيتك.", "Check the dates and remove their pits before eating. Choose an amount that suits your appetite."),
   step("أضف الحليب", "Add milk", "قدّم معه حليبًا أو بديلًا مدعّمًا يناسبك، محفوظًا حسب العبوة.", "Serve with milk or a suitable fortified alternative stored according to its label."),
   step("خذه معك إذا احتجت", "Take it along if needed", "يمكن تجهيز التمر في علبة، مع إبقاء الحليب مبردًا إذا احتاج تبريدًا. ليس عليك إضافة وجبة خفيفة إذا لم تحتجها.", "Pack dates in a container and keep milk chilled if required. There is no need to add a snack when you do not need one."),
  ], tip: ["انتبه للنوى، خاصة إذا كان التمر محشوًا أو جاهزًا من عبوة.", "Check for pits, including in filled or packaged dates."], swap: ["بدّل التمر بفاكهة تحبها أو الحليب ببديل مناسب.", "Swap dates for fruit you enjoy or milk for a suitable alternative."],
 },
};
