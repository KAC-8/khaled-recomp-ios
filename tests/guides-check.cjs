const {chromium,webkit}=require('playwright');
const fs=require('fs'),assert=require('assert');
const base=process.env.QA_BASE||'http://127.0.0.1:4173',out=__dirname+'/../test-results/guides';
fs.mkdirSync(out,{recursive:true});
const results=[],errors=[];
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name)}catch(e){results.push({name,passed:false,error:e.message});console.log('FAIL',name,e.message)}}
(async()=>{
 const b=await chromium.launch({headless:true});const c=await b.newContext({viewport:{width:1440,height:1000},colorScheme:'dark',timezoneId:'Asia/Riyadh'});
 const p=await c.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>!localStorage.getItem('kr-lang')&&localStorage.setItem('kr-lang','en'));
 await p.goto(base+'/nutrition');await p.locator('.meal-board').waitFor();
 await test('All 15 meals have complete recipe steps, tools, timing and alternatives',async()=>{
  let recipes=0;
  for(const slot of ['breakfast','lunch','dinner','snack']){
   await p.locator(`[data-meal="${slot}"] .swap-meal`).click();const count=await p.locator('.meal-options button').count();await p.keyboard.press('Escape');
   for(let i=0;i<count;i++){
    await p.locator(`[data-meal="${slot}"] .swap-meal`).click();await p.locator('.meal-options button').nth(i).click();
    const title=await p.locator(`[data-meal="${slot}"] h3`).textContent();
    await p.locator(`[data-meal="${slot}"] .recipe-entry button`).click();
    assert.equal(await p.locator('.modal-header h2').textContent(),title);
    assert((await p.locator('.recipe-steps li').count())>=3);assert((await p.locator('.recipe-tools').innerText()).length>20);
    assert((await p.locator('.recipe-meta').innerText()).length>5);assert((await p.locator('.recipe-swap').innerText()).length>20);
    assert.equal(await p.locator('.recipe-ingredients li').count(),await p.locator(`[data-meal="${slot}"] .meal-components`).evaluate(el=>el.textContent.split(' · ').length));
    await p.keyboard.press('Escape');recipes++;
   }
  }
  assert.equal(recipes,15);
 });
 await test('Cooking mode supports next, back, direct steps, overview and finish',async()=>{
  await p.locator('[data-meal="lunch"] .recipe-entry button').click();const count=await p.locator('.recipe-steps li').count();
  const before=await p.evaluate(()=>localStorage.getItem('khalid-cut-v1'));
  await p.getByRole('button',{name:'Start step by step',exact:true}).click();
  assert(await p.locator('.cooking-actions').getByRole('button',{name:'Back',exact:true}).isDisabled());
  await p.getByRole('button',{name:'Next',exact:true}).click();assert.equal(await p.locator('.cooking-step-nav [aria-current="step"]').textContent(),'2');
  await p.locator('.cooking-actions').getByRole('button',{name:'Back',exact:true}).click();
  await p.locator('.cooking-step-nav button').last().click();assert.equal(await p.locator('.cooking-step-nav [aria-current="step"]').textContent(),String(count));
  await p.getByRole('button',{name:'Show all steps',exact:true}).click();assert.equal(await p.locator('.recipe-steps li').count(),count);
  await p.getByRole('button',{name:'Start step by step',exact:true}).click();await p.locator('.cooking-step-nav button').last().click();
  await p.getByRole('button',{name:'Finish guide',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
  assert.equal(await p.evaluate(()=>localStorage.getItem('khalid-cut-v1')),before);
 });
 await test('Custom meals do not receive invented recipes',async()=>{
  await p.locator('[data-meal="dinner"] .swap-meal').click();await p.getByLabel('Or your own meal',{exact:true}).fill('My family recipe');await p.getByRole('button',{name:'Save my meal',exact:true}).click();
  assert.equal(await p.locator('[data-meal="dinner"] .recipe-entry').count(),0);assert.equal(await p.locator('[data-meal="dinner"] .custom-meal-note').count(),1);
 });
 await p.goto(base+'/train');await p.locator('canvas').waitFor();
 await test('All movement lessons pause 3D at their documented positions',async()=>{
  for(const [index,values] of [[0,[95,8,95]],[1,[0,95,0]],[2,[0,95,0]],[3,[45,45,45]]]){
   await p.locator('.exercise-selector button').nth(index).click();
   for(let i=0;i<3;i++){await p.locator('.lesson-stages button').nth(i).click();assert.equal(await p.getByRole('slider',{name:'Movement position'}).inputValue(),String(values[i]));await p.getByRole('button',{name:'Play movement',exact:true}).waitFor();assert((await p.locator('.breathing-cue').innerText()).length>10)}
   await p.getByRole('tab',{name:'Common mistakes',exact:true}).click();assert.equal(await p.locator('.mistake-list article').count(),2);
   await p.getByRole('tab',{name:'Easier version',exact:true}).click();assert.equal(await p.locator('.easier-guide li').count(),2);assert((await p.locator('.lesson-model-note').innerText()).includes('model'));
   await p.getByRole('tab',{name:'Movement',exact:true}).click();
  }
 });
 await test('A repeated stage request resets the same pose after autoplay',async()=>{
  await p.locator('.exercise-selector button').first().click();await p.locator('.lesson-stages button').first().click();await p.waitForTimeout(400);
  const start=await p.locator('canvas').screenshot();await p.getByRole('button',{name:'Play movement',exact:true}).click();await p.waitForTimeout(800);
  await p.locator('.lesson-stages button').first().click();await p.waitForTimeout(400);const reset=await p.locator('canvas').screenshot();assert(start.equals(reset),'The same requested pose should reset exactly');
 });
 await test('Guide tabs support LTR and RTL arrow keys',async()=>{
  await p.getByRole('tab',{name:'Movement',exact:true}).focus();await p.keyboard.press('ArrowRight');assert.equal(await p.getByRole('tab',{name:'Common mistakes',exact:true}).getAttribute('aria-selected'),'true');
  await p.getByRole('button',{name:'التبديل إلى العربية',exact:true}).click();await p.getByRole('tab',{name:'الحركة',exact:true}).click();await p.getByRole('tab',{name:'الحركة',exact:true}).focus();await p.keyboard.press('ArrowLeft');assert.equal(await p.getByRole('tab',{name:'أخطاء شائعة',exact:true}).getAttribute('aria-selected'),'true');
 });
 await test('Recipe overview, cooking mode and all exercise tabs pass automated WCAG',async()=>{
  const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8'),issues=[];
  for(const lang of ['ar','en'])for(const theme of ['light','dark']){
   await p.evaluate(({lang,theme})=>{localStorage.setItem('kr-lang',lang);localStorage.setItem('kc-theme',theme)},{lang,theme});await p.goto(base+'/nutrition');await p.locator('.meal-board').waitFor();
   await p.locator('[data-meal="lunch"] .recipe-entry button').click();await p.addScriptTag({content:axe});
   async function audit(view) {
    const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    issues.push(...r.violations.map(v=>({lang,theme,view,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
   }
   await audit('recipe');await p.getByRole('button',{name:lang==='ar'?'ابدأ خطوة بخطوة':'Start step by step',exact:true}).click();await audit('cooking');await p.keyboard.press('Escape');
   await p.goto(base+'/train');await p.locator('.movement-guide').waitFor();await p.addScriptTag({content:axe});
   for(let i=0;i<3;i++){await p.locator('.lesson-tabs button').nth(i).click();await audit('movement-'+i)}
  }
  fs.writeFileSync(out+'/accessibility.json',JSON.stringify(issues,null,2));assert.equal(issues.length,0,JSON.stringify(issues));
 });
 await test('Phone dialogs fit, remain usable and return focus to their opener',async()=>{
  await p.setViewportSize({width:360,height:800});await p.goto(base+'/nutrition');await p.locator('.meal-board').waitFor();
  await p.locator('[data-meal="lunch"] .recipe-entry button').click();
  const dims=await p.getByRole('dialog').evaluate(el=>({width:el.scrollWidth,box:el.clientWidth}));assert(dims.width<=dims.box+1,JSON.stringify(dims));
  await p.getByRole('button',{name:'Start step by step',exact:true}).click();await p.getByRole('button',{name:'Next',exact:true}).click();
  await p.keyboard.press('Escape');assert(await p.locator('[data-meal="lunch"] .recipe-entry button').evaluate(el=>el===document.activeElement));
 });
 await test('Phone controls move between the selected pose and its explanation',async()=>{
  await p.goto(base+'/train');await p.locator('canvas').waitFor();await p.locator('.lesson-stages button').nth(1).click();
  await p.getByRole('button',{name:'View this position',exact:true}).click();await p.waitForTimeout(700);
  assert(await p.locator('#movement-stage').evaluate(el=>el===document.activeElement));
  assert.equal(await p.getByRole('slider',{name:'Movement position'}).inputValue(),'8');
  await p.getByRole('button',{name:'Back to movement guide',exact:true}).click();await p.waitForTimeout(700);
  assert(await p.locator('#movement-guide').evaluate(el=>el===document.activeElement));
 });
 await test('WebKit mobile supports recipe steps and movement instruction',async()=>{
  const safari=await webkit.launch({headless:true});const context=await safari.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark'});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/nutrition');await page.locator('[data-meal="lunch"] .recipe-entry button').click();await page.getByRole('button',{name:'ابدأ خطوة بخطوة',exact:true}).click();await page.getByRole('button',{name:'التالي',exact:true}).click();
  assert.equal(await page.locator('.cooking-step-nav [aria-current="step"]').textContent(),'2');await page.getByRole('button',{name:'إغلاق',exact:true}).click();
  await page.goto(base+'/train');await page.locator('canvas').waitFor();await page.locator('.lesson-stages button').nth(1).click();assert.equal(await page.getByRole('slider').inputValue(),'8');
  await page.screenshot({path:out+'/webkit-movement-ar.png',fullPage:true});await safari.close();
 });
 await p.evaluate(()=>{localStorage.clear();localStorage.setItem('kr-lang','ar');localStorage.setItem('kc-theme','dark')});
 await p.setViewportSize({width:1440,height:1000});await p.goto(base+'/nutrition');await p.locator('[data-meal="lunch"] .recipe-entry button').click();await p.getByRole('button',{name:'ابدأ خطوة بخطوة',exact:true}).click();await p.getByRole('button',{name:'التالي',exact:true}).click();await p.screenshot({path:out+'/recipe-dark-ar.png',fullPage:true});
 await p.keyboard.press('Escape');await p.goto(base+'/train');await p.locator('canvas').waitFor();await p.locator('.lesson-stages button').nth(1).click();await p.screenshot({path:out+'/movement-dark-ar.png',fullPage:true});
 results.push({name:'No uncaught browser errors',passed:errors.length===0,errors});fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length}));await b.close();process.exit(results.some(r=>!r.passed)?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
