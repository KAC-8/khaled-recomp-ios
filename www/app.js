
const S={
  lang:localStorage.getItem('kr-lang')||'ar',
  page:(location.hash||'#home').slice(1),
  day:localStorage.getItem('kr-day')||'a',
  done:JSON.parse(localStorage.getItem('kr-done')||'{}'),
  logs:JSON.parse(localStorage.getItem('kr-logs')||'[]')
};
const A={
  ar:{
    brand:'Khalid Cut',home:'الرئيسية',cal:'الكالستنكس',cut:'التنشيف',food:'التغذية',track:'التتبع',
    heroK:'هدف المرحلة الحالية',heroT:'تنشيف هادئ. عضل محفوظ.',heroP:'بما أنك عندك قاعدة عضلية وهدفك الآن تصير أنحف وأوضح، الأفضل حاليًا تنشيف محافظ—not تجويع ولا نزول سريع. نحافظ على الأداء والقوة وننزّل الدهون تدريجيًا.',
    start:'ابدأ الكالستنكس',trackNow:'سجّل تقدمك',m1:'الهدف الأسبوعي',m1v:'0–0.4 كجم',m2:'البروتين',m2v:'130–140غ',
    cardsT:'المعادلة اللي نمشي عليها',c1:'نزول هادئ',c1p:'لا نطارد الميزان. الخصر، الصور، والأداء أهم من قراءة يوم واحد.',c2:'احفظ القوة',c2p:'إذا الأداء ينهار والتعب يزيد، ما نزيد العجز. نراجع النوم والأكل.',c3:'كالستنكس بجودة',c3p:'تكرارات نظيفة، تحكم، وتقدم أسبوعي بدون حجم عشوائي.',
    calTitle:'برنامج الكالستنكس',calSub:'3 حصص أساسية + حصة اختيارية خفيفة. الجودة أهم من العدد.',dA:'A — دفع',dB:'B — سحب',dC:'C — كور وتحكم',dR:'اختياري — مهارة',
    sets:'المجموعات',reps:'التكرارات',rest:'الراحة',rir:'اترك 1–3 تكرارات احتياط',done:'تم',
    cutTitle:'خطة التنشيف',cutSub:'الهدف: دهون أقل مع الحفاظ على أكبر قدر ممكن من العضل والقوة.',
    foodTitle:'التغذية',foodSub:'قواعد بسيطة وقابلة للاستمرار بدل دايت قاسي.',
    trackTitle:'التتبع',trackSub:'راقب المتوسط الأسبوعي، الخصر، والأداء. لا تحكم من وزن يوم واحد.',
    date:'التاريخ',weight:'الوزن كجم',waist:'الخصر سم',pull:'عقلة',push:'ضغط',save:'حفظ القياس',history:'السجل',empty:'ما عندك قياسات محفوظة حتى الآن.',
    lang:'EN'
  },
  en:{
    brand:'Khalid Cut',home:'Home',cal:'Calisthenics',cut:'Cut',food:'Nutrition',track:'Tracking',
    heroK:'Current phase',heroT:'Lean down. Keep the muscle.',heroP:'Since you already have a muscular base and your priority is getting leaner, the best move now is a conservative cut—not crash dieting. Keep performance high while fat comes down gradually.',
    start:'Start calisthenics',trackNow:'Log progress',m1:'Weekly target',m1v:'0–0.4 kg',m2:'Protein',m2v:'130–140 g',
    cardsT:'The system',c1:'Slow loss',c1p:'Do not chase scale weight. Waist, photos and performance matter more than one reading.',c2:'Protect strength',c2p:'If performance drops hard and fatigue climbs, do not cut harder. Review sleep and food.',c3:'Quality calisthenics',c3p:'Clean reps, control and weekly progression without random junk volume.',
    calTitle:'Calisthenics plan',calSub:'3 core sessions + one light optional skill day. Quality beats volume.',dA:'A — Push',dB:'B — Pull',dC:'C — Core & control',dR:'Optional — Skill',
    sets:'Sets',reps:'Reps',rest:'Rest',rir:'Keep 1–3 reps in reserve',done:'Done',
    cutTitle:'Cutting plan',cutSub:'Goal: reduce fat while keeping as much muscle and strength as possible.',
    foodTitle:'Nutrition',foodSub:'Simple rules you can actually sustain.',
    trackTitle:'Tracking',trackSub:'Judge weekly averages, waist and performance—not one weigh-in.',
    date:'Date',weight:'Weight kg',waist:'Waist cm',pull:'Pull-ups',push:'Push-ups',save:'Save log',history:'History',empty:'No saved measurements yet.',
    lang:'ع'
  }
};
const exercises={
  a:[
    {id:'pushup',n:['Push-up','Push-up'],type:'push',sets:'4',reps:'8–15',rest:'90s',cue:['جسم مستقيم، صدر قريب من الأرض، بدون انهيار الحوض.','Straight body, chest close to floor, no hip sag.']},
    {id:'dip',n:['Dips','Dips'],type:'dip',sets:'4',reps:'5–10',rest:'120s',cue:['كتف ثابت ونزول متحكم. لا تنزل أعمق من قدرتك المريحة.','Stable shoulders, controlled depth. Do not force painful range.']},
    {id:'pike',n:['Pike Push-up','Pike Push-up'],type:'push',sets:'3',reps:'6–12',rest:'90s',cue:['ادفع الرأس بين اليدين وحافظ على التحكم.','Drive the head between the hands with control.']}
  ],
  b:[
    {id:'pullup',n:['Pull-up / Assisted','Pull-up / Assisted'],type:'pull',sets:'4',reps:'4–10',rest:'120s',cue:['ابدأ بسحب لوح الكتف، بدون رفس أو تأرجح.','Start with the shoulder blades. No kicking or swinging.']},
    {id:'row',n:['Body Row','Body Row'],type:'pull',sets:'4',reps:'8–15',rest:'90s',cue:['اسحب الصدر للنقطة نفسها كل مرة وحافظ على الجسم قطعة واحدة.','Pull your chest to the same point every rep and keep the body rigid.']},
    {id:'hang',n:['Dead Hang + Scap Pull','Dead Hang + Scap Pull'],type:'pull',sets:'3',reps:'20–40s',rest:'75s',cue:['تعليق نشط، قبضة ثابتة، وتوقف إذا ظهر ألم كتف.','Active hang, firm grip, stop if shoulder pain appears.']}
  ],
  c:[
    {id:'hollow',n:['Hollow Hold','Hollow Hold'],type:'core',sets:'4',reps:'20–40s',rest:'60s',cue:['أسفل الظهر ملتصق بالأرض. قصّر الرافعة إذا فقدت الوضعية.','Keep lower back on the floor. Shorten the lever if form breaks.']},
    {id:'plank',n:['RKC Plank','RKC Plank'],type:'core',sets:'3',reps:'20–35s',rest:'60s',cue:['شد البطن والمؤخرة بقوة، لا تطارد مدة طويلة بوضعية سيئة.','Brace abs and glutes hard. Do not chase time with poor form.']},
    {id:'squat',n:['Tempo Bodyweight Squat','Tempo Bodyweight Squat'],type:'legs',sets:'3',reps:'10–15',rest:'75s',cue:['3 ثواني نزول، توقف لحظة، ثم اصعد بتحكم.','Three seconds down, brief pause, stand with control.']}
  ],
  r:[
    {id:'lsit',n:['L-sit Progression','L-sit Progression'],type:'balance',sets:'5',reps:'8–20s',rest:'60s',cue:['ابدأ Tuck إذا لزم. الهدف وضعية نظيفة لا ثواني كثيرة.','Use a tuck if needed. Clean position matters more than duration.']},
    {id:'hand',n:['Wall Handstand','Wall Handstand'],type:'balance',sets:'4',reps:'20–40s',rest:'75s',cue:['كتف مرفوع، بطن مشدود، والجدار للأمان فقط.','Elevate shoulders, brace the core and use the wall for safety.']},
    {id:'mob',n:['Mobility Flow','Mobility Flow'],type:'core',sets:'2',reps:'6–8 min',rest:'—',cue:['حركة خفيفة للكتف والورك والرسغ بدون ألم.','Light shoulder, hip and wrist mobility without pain.']}
  ]
};
function t(k){return A[S.lang][k]}
function langIndex(){return S.lang==='ar'?0:1}
function go(p){location.hash=p}
function nav(){
  const items=[['home','⌂',t('home')],['cal','◫',t('cal')],['cut','◒',t('cut')],['food','◇',t('food')],['track','⌁',t('track')]];
  return items.map(x=>'<button class="nav-btn '+(S.page===x[0]?'active':'')+'" data-go="'+x[0]+'">'+x[2]+'</button>').join('');
}
function bottom(){
  const items=[['home','⌂',t('home')],['cal','◫',t('cal')],['cut','◒',t('cut')],['food','◇',t('food')],['track','⌁',t('track')]];
  return items.map(x=>'<button class="'+(S.page===x[0]?'active':'')+'" data-go="'+x[0]+'"><span>'+x[1]+'</span>'+x[2]+'</button>').join('');
}
function home(){
  return '<section class="view active">'+
  '<div class="hero">'+
    '<div class="fade-up"><span class="kicker">● '+t('heroK')+'</span><h1>'+t('heroT')+'</h1><p class="lead">'+t('heroP')+'</p>'+
    '<div class="actions"><button class="cta primary" data-go="cal">'+t('start')+'</button><button class="cta secondary" data-go="track">'+t('trackNow')+'</button></div></div>'+
    '<div class="hero-orbit fade-up"><div class="ring r1"></div><div class="ring r2"></div><div class="body-card"><div class="figure"><i class="head"></i><i class="torso"></i><i class="arm a"></i><i class="arm b"></i><i class="leg a"></i><i class="leg b"></i></div></div><div class="hero-metric hm1"><b>'+t('m1v')+'</b>'+t('m1')+'</div><div class="hero-metric hm2"><b>'+t('m2v')+'</b>'+t('m2')+'</div></div>'+
  '</div>'+
  '<div class="section-head"><div><h2>'+t('cardsT')+'</h2></div></div>'+
  '<div class="grid cols-3"><article class="card stat fade-up"><b>01</b><h3>'+t('c1')+'</h3><span>'+t('c1p')+'</span></article><article class="card stat fade-up"><b>02</b><h3>'+t('c2')+'</h3><span>'+t('c2p')+'</span></article><article class="card stat fade-up"><b>03</b><h3>'+t('c3')+'</h3><span>'+t('c3p')+'</span></article></div>'+
  '</section>';
}
function exerciseCard(e){
  const idx=langIndex(), key=S.day+'-'+e.id, d=!!S.done[key];
  return '<article class="exercise fade-up"><div class="ex-visual '+e.type+'"><div class="mini-person"></div></div><div><h3>'+e.n[idx]+'</h3><div class="small">'+e.cue[idx]+'</div><div class="ex-meta"><span class="tag hot">'+t('sets')+' '+e.sets+'</span><span class="tag">'+t('reps')+' '+e.reps+'</span><span class="tag">'+t('rest')+' '+e.rest+'</span></div></div><button class="check '+(d?'done':'')+'" data-check="'+key+'" aria-label="'+t('done')+'">'+(d?'✓':'○')+'</button></article>';
}
function cal(){
  const days=[['a',t('dA')],['b',t('dB')],['c',t('dC')],['r',t('dR')]];
  return '<section class="view active"><div class="section-head"><div><span class="kicker">CALISTHENICS</span><h2>'+t('calTitle')+'</h2><p>'+t('calSub')+'</p></div></div>'+
  '<div class="notice">'+t('rir')+'. '+(S.lang==='ar'?'إذا كانت جودة الحركة تسوء، وقف المجموعة. الحصة الاختيارية تُلغى إذا كان عندك تعب أو ألم مفاصل.':'Stop the set when rep quality breaks. Skip the optional session if fatigue or joint pain is building.')+'</div>'+
  '<div class="plan-tabs" style="margin-top:18px">'+days.map(d=>'<button class="pill '+(S.day===d[0]?'active':'')+'" data-day="'+d[0]+'">'+d[1]+'</button>').join('')+'</div>'+
  '<div class="exercise-list">'+exercises[S.day].map(exerciseCard).join('')+'</div></section>';
}
function cut(){
  const ar=S.lang==='ar';
  const rules=ar?[
    ['لا تسوي عجز قوي','بما أنك ما زلت في سن نمو، خله تنشيف محافظ. لا تقص الأكل بعنف ولا تستخدم الجوع كأداة.'],
    ['المتوسط أهم من اليوم','وزن نفسك في ظروف متقاربة وخذ متوسط أسبوعي. نزول 0 إلى 0.4 كجم أسبوعيًا كفاية.'],
    ['الأداء خط أحمر','إذا قوتك تنزل بوضوح، نومك سيئ، أو عندك دوخة وتعب مستمر: لا تزيد الكارديو ولا تقلل الأكل أكثر.'],
    ['الخصر والصور','صورة كل أسبوعين وقياس خصر أسبوعي يعطيك قراءة أفضل من الميزان وحده.']
  ]:[
    ['Avoid aggressive deficits','You are still growing, so keep the cut conservative. Do not use starvation as a tool.'],
    ['Weekly average wins','Weigh under similar conditions and use a weekly average. About 0 to 0.4 kg per week is enough.'],
    ['Performance is a guardrail','If strength drops clearly or you get persistent fatigue or dizziness, do not cut harder or add more cardio.'],
    ['Waist and photos','A waist measurement weekly and photos every two weeks tell more than scale weight alone.']
  ];
  return '<section class="view active"><div class="section-head"><div><span class="kicker">CUT PHASE</span><h2>'+t('cutTitle')+'</h2><p>'+t('cutSub')+'</p></div></div>'+
  '<div class="grid cols-2">'+rules.map((r,i)=>'<article class="card rule fade-up"><span class="num">'+(i+1)+'</span><div><h3>'+r[0]+'</h3><p>'+r[1]+'</p></div></article>').join('')+'</div>'+
  '<div class="section-head"><div><h2>'+(ar?'إشارات نجاح الخطة':'Signs the plan is working')+'</h2></div></div>'+
  '<div class="grid cols-3"><div class="card stat"><b>↘</b><span>'+(ar?'الخصر ينزل تدريجيًا':'Waist trends down')+'</span></div><div class="card stat"><b>≈</b><span>'+(ar?'القوة مستقرة غالبًا':'Strength mostly stable')+'</span></div><div class="card stat"><b>↑</b><span>'+(ar?'التحكم بالكالستنكس يتحسن':'Calisthenics control improves')+'</span></div></section>';
}
function food(){
  const ar=S.lang==='ar';
  const meals=ar?[
    ['🍳','فطور بروتين','بيض + شريحة جبن خفيف + خبز/شوفان حسب الجوع والنشاط.'],
    ['🍗','وجبة رئيسية','دجاج أو تونة + رز/بطاطس + خضار. خل الزيت محسوب بدل السكب العشوائي.'],
    ['🥣','سناك عملي','زبادي عالي البروتين أو فاكهة مع مصدر بروتين.'],
    ['💧','الماء والنوم','اشرب بانتظام ونم 8–9 ساعات قدر الإمكان؛ النوم جزء من التنشيف وليس تفصيلًا.']
  ]:[
    ['🍳','Protein breakfast','Eggs + a light cheese slice + bread/oats based on hunger and activity.'],
    ['🍗','Main meal','Chicken or tuna + rice/potatoes + vegetables. Measure oil instead of pouring freely.'],
    ['🥣','Practical snack','High-protein yogurt or fruit paired with a protein source.'],
    ['💧','Hydration & sleep','Hydrate consistently and aim for 8–9 hours of sleep when possible.']
  ];
  return '<section class="view active"><div class="section-head"><div><span class="kicker">NUTRITION</span><h2>'+t('foodTitle')+'</h2><p>'+t('foodSub')+'</p></div></div>'+
  '<div class="grid cols-2">'+meals.map(m=>'<article class="card meal fade-up"><div class="ico">'+m[0]+'</div><div><h3>'+m[1]+'</h3><p>'+m[2]+'</p></div></article>').join('')+'</div>'+
  '<div class="notice" style="margin-top:18px">'+(ar?'قاعدة 80/20: أغلب أكلك من أطعمة مشبعة ومغذية، واترك مساحة مرنة صغيرة بدون تحويلها إلى يوم مفتوح غير محسوب. لا تبدأ جرعات عالية من فيتامين D بدون طبيب وتحليل.':'80/20 rule: most food should be filling and nutrient-dense, with a small flexible allowance—not an uncontrolled cheat day. Do not start high-dose vitamin D without clinician guidance and labs.')+'</div></section>';
}
function spark(){
  if(S.logs.length<2)return '<div class="empty">'+(S.lang==='ar'?'أضف قياسين على الأقل ليظهر الاتجاه.':'Add at least two logs to show a trend.')+'</div>';
  const vals=S.logs.slice(-12).map(x=>Number(x.w)).filter(Boolean); if(vals.length<2)return '';
  const min=Math.min(...vals),max=Math.max(...vals),range=(max-min)||1;
  const pts=vals.map((v,i)=>((i/(vals.length-1))*100)+','+(90-((v-min)/range)*72)).join(' ');
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="'+pts+'" fill="none" stroke="#b8ff5a" stroke-width="2.4" vector-effect="non-scaling-stroke"/><line x1="0" y1="90" x2="100" y2="90" stroke="#263c2d" stroke-width="1"/></svg>';
}
function track(){
  const rows=S.logs.slice().reverse().slice(0,8);
  return '<section class="view active"><div class="section-head"><div><span class="kicker">PROGRESS</span><h2>'+t('trackTitle')+'</h2><p>'+t('trackSub')+'</p></div></div>'+
  '<div class="card"><div class="form-grid"><div class="field"><label>'+t('date')+'</label><input id="fdate" type="date"></div><div class="field"><label>'+t('weight')+'</label><input id="fw" type="number" step=".1" inputmode="decimal"></div><div class="field"><label>'+t('waist')+'</label><input id="fwaist" type="number" step=".1" inputmode="decimal"></div><div class="field"><label>'+t('pull')+' / '+t('push')+'</label><input id="fperf" placeholder="8 / 25"></div></div><div class="save-row"><button class="cta primary" id="saveLog">'+t('save')+'</button><span class="small" id="saved"></span></div><div class="chart">'+spark()+'</div></div>'+
  '<div class="section-head"><div><h2>'+t('history')+'</h2></div></div><div class="history">'+(rows.length?rows.map(x=>'<div class="history-row"><span>'+x.d+'</span><span>'+x.w+' kg</span><span>'+x.waist+' cm</span><span>'+x.perf+'</span><span>↗</span></div>').join(''):'<div class="card empty">'+t('empty')+'</div>')+'</div></section>';
}
function render(){
  document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';
  if(!['home','cal','cut','food','track'].includes(S.page))S.page='home';
  document.querySelector('#brandText').textContent=t('brand');
  document.querySelector('#desktopNav').innerHTML=nav();
  document.querySelector('#bottomNav').innerHTML=bottom();
  document.querySelector('#langBtn').textContent=t('lang');
  const view={home,cal,cut,food,track}[S.page]();
  document.querySelector('#app').innerHTML=view;
  bind();
}
function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{S.day=b.dataset.day;localStorage.setItem('kr-day',S.day);render()});
  document.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{const k=b.dataset.check;S.done[k]=!S.done[k];localStorage.setItem('kr-done',JSON.stringify(S.done));b.classList.toggle('done',S.done[k]);b.textContent=S.done[k]?'✓':'○'});
  const d=document.querySelector('#fdate');if(d)d.value=new Date().toISOString().slice(0,10);
  const save=document.querySelector('#saveLog');if(save)save.onclick=()=>{const row={d:document.querySelector('#fdate').value,w:document.querySelector('#fw').value,waist:document.querySelector('#fwaist').value,perf:document.querySelector('#fperf').value};if(!row.d||!row.w)return;S.logs.push(row);S.logs=S.logs.slice(-60);localStorage.setItem('kr-logs',JSON.stringify(S.logs));render()};
}
window.addEventListener('hashchange',()=>{S.page=(location.hash||'#home').slice(1);render();window.scrollTo({top:0,behavior:'smooth'})});
document.querySelector('#langBtn').onclick=()=>{S.lang=S.lang==='ar'?'en':'ar';localStorage.setItem('kr-lang',S.lang);render()};
render();
