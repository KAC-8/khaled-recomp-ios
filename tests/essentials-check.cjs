const { chromium, webkit } = require('playwright');
const fs = require('fs');
const assert = require('assert');
const { staticPreview, staticMode, contextOptions, exportBackup } = require('./static-preview.cjs');
const base = process.env.QA_BASE || 'http://127.0.0.1:4173';
const out = __dirname + '/../test-results/essentials';
fs.mkdirSync(out, { recursive: true });
const results = [], errors = [];
const date = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
async function test(name, fn) { try { await fn(); results.push({ name, passed:true }); console.log('PASS', name); } catch (e) { results.push({ name, passed:false, error:e.message }); console.log('FAIL', name, e.message); } }
async function ready(page, route) { await page.goto(base + route); await page.locator('h1').waitFor(); await page.locator('.week-day').first().waitFor(); }
async function saveState(page) { return page.evaluate(() => JSON.parse(localStorage.getItem('khalid-cut-v1'))); }
(async () => {
 const browser = await chromium.launch({headless:true, downloadsPath: __dirname + "/../test-results/downloads"});
 const context = await browser.newContext({...contextOptions, viewport:{width:1440,height:1000}, colorScheme:'light', timezoneId:'Asia/Riyadh'});
 await staticPreview(context,base);
 await context.addInitScript(()=>{ if(!localStorage.getItem('kr-lang')) localStorage.setItem('kr-lang','en'); });
 const page = await context.newPage(); page.setDefaultTimeout(10000); page.on('pageerror',e=>errors.push(e.message));
 await ready(page,'/');
 await test('Four useful routes; old approach link redirects without losing data', async()=>{
  assert.equal(await page.locator('.desktop-nav a').count(),4);
  assert.equal(await page.locator('.focus-balance,.home-hero,.principle-strip').count(),0);
  await ready(page,'/approach'); await page.waitForURL(base+'/');
  assert.equal(await page.locator('.today-grid').count(),1);
 });
 await test('Meal swaps save by date and survive reload',async()=>{
  await ready(page,'/nutrition');
  await page.getByRole('button',{name:'Change Lunch',exact:true}).click();
  await page.locator('.meal-options button').filter({hasText:'Fish, potatoes & vegetables'}).click();
  assert.equal((await saveState(page)).mealSelections[date()].lunch,'fish');
  await page.reload(); await page.locator('[data-meal="lunch"] h3').waitFor();
  assert.equal(await page.locator('[data-meal="lunch"] h3').textContent(),'Fish, potatoes & vegetables');
 });
 await test('Custom meals remain literal text; cancel and whitespace do not save',async()=>{
  await page.getByRole('button',{name:'Change Dinner',exact:true}).click();
  await page.getByLabel('Or your own meal',{exact:true}).fill('   ');
  assert(await page.getByRole('button',{name:'Save my meal',exact:true}).isDisabled());
  await page.getByLabel('Or your own meal',{exact:true}).fill('Family meal <b>with everyone</b>');
  await page.getByRole('button',{name:'Save my meal',exact:true}).click();
  assert.equal(await page.locator('[data-meal="dinner"] h3 b').count(),0);
  assert.equal(await page.locator('[data-meal="dinner"] h3').textContent(),'Family meal <b>with everyone</b>');
  const before=JSON.stringify((await saveState(page)).mealSelections);
  await page.getByRole('button',{name:'Change Breakfast',exact:true}).click();
  await page.getByLabel('Or your own meal',{exact:true}).fill('Unsaved draft');
  await page.keyboard.press('Escape');
  assert.equal(JSON.stringify((await saveState(page)).mealSelections),before);
 });
 await test('Shopping list matches selected meals, deduplicates and names custom exclusions',async()=>{
  await page.getByRole('button',{name:'Shopping list',exact:true}).click();
  const names=await page.locator('.shopping-list li span').allTextContents();
  assert(names.includes('Fish')); assert(names.includes('Potatoes')); assert.equal(new Set(names).size,names.length);
  assert((await page.locator('.shopping-custom').innerText()).includes('Family meal'));
  await page.locator('.shopping-list li input').first().check();
  assert(await page.locator('.shopping-list li input').first().isChecked());
  await page.getByLabel('Include snack ingredients',{exact:true}).check();
  assert((await page.locator('.shopping-list li').count())>=names.length);
  await page.keyboard.press('Escape');
 });
 await test('Future meal planning works while completion and check-ins stay disabled',async()=>{
  await page.getByRole('button',{name:'Next week',exact:true}).click();
  assert.equal(await page.locator('.week-day.is-active').getAttribute('data-date'),date(7));
  await page.getByRole('button',{name:'Change Lunch',exact:true}).click();
  await page.locator('.meal-options button').filter({hasText:'Lentils, rice & yogurt'}).click();
  assert.equal((await saveState(page)).mealSelections[date(7)].lunch,'lentils');
  assert.equal((await saveState(page)).mealSelections[date()].lunch,'fish');
  assert(await page.getByRole('button',{name:'Regular meals',exact:true}).isDisabled());
  await page.locator('.desktop-nav').getByRole('link',{name:'Progress',exact:true}).click();
  await page.locator('.daily-reflection').waitFor();
  assert(await page.getByRole('button',{name:'New check-in',exact:true}).isDisabled());
 });
 await test('Shared day persists on route navigation and home opens the correct dated check-in',async()=>{
  await page.getByRole('button',{name:'Today',exact:true}).click();
  await page.getByRole('button',{name:'Previous week',exact:true}).click();
  await page.locator('.desktop-nav').getByRole('link',{name:'Today',exact:true}).click();
  await page.locator('.today-grid').waitFor();
  assert.equal(await page.locator('.week-day.is-active').getAttribute('data-date'),date(-7));
  await page.getByRole('link',{name:'Add my check-in',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.getByLabel('Date',{exact:true}).inputValue(),date(-7));
  await page.getByRole('radio',{name:'4',exact:true}).check();
  await page.getByRole('button',{name:'Save check-in',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
  assert.equal((await saveState(page)).logs.find(l=>l.date===date(-7)).energy,4);
 });
 await test('Home displays saved food and synchronized habit status',async()=>{
  await ready(page,'/nutrition');
  await page.getByRole('button',{name:'Regular meals',exact:true}).click();
  await page.locator('.desktop-nav').getByRole('link',{name:'Today',exact:true}).click();
  await page.locator('.today-grid').waitFor();
  assert((await page.locator('.meal-summary-list').innerText()).includes('Fish, potatoes & vegetables'));
  assert.equal(await page.getByRole('button',{name:'Regular meals',exact:true}).getAttribute('aria-pressed'),'true');
 });
 await test('Theme toggle persists, including meal picker surfaces',async()=>{
  await page.getByRole('button',{name:'Use dark mode',exact:true}).click();
  await ready(page,'/nutrition');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.getByRole('button',{name:'Change Breakfast',exact:true}).click();
  const style=await page.getByRole('dialog').evaluate(el=>({bg:getComputedStyle(el).backgroundColor,ink:getComputedStyle(el).color}));
  assert.notEqual(style.bg,'rgb(255, 255, 255)'); assert.notEqual(style.ink,'rgb(24, 24, 27)');
  await page.keyboard.press('Escape');
  await page.reload(); await page.locator('.meal-board').waitFor();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 });
 await test('Weekly template edits preserve all saved records and meal choices',async()=>{
  await ready(page,'/train'); const before=await saveState(page);
  await page.getByRole('button',{name:'Edit your week',exact:true}).click();
  await page.getByRole('dialog').getByLabel('Plan for Sunday',{exact:true}).selectOption('b');
  await page.getByRole('button',{name:'Save weekly plan',exact:true}).click();
  const after=await saveState(page); assert.equal(after.weekPlan['0'],'b');
  for(const key of ['logs','habits','mealSelections','training']) assert.deepEqual(after[key],before[key]);
 });
 await test('3D camera, slow playback, highlighting and session controls still work',async()=>{
  await page.locator('canvas').waitFor();
  await page.locator('.studio-settings > summary').click();
  for(const angle of ['Front','Side','Back','Angle']){await page.locator('.camera-options').getByRole('button',{name:angle,exact:true}).click(); assert.equal(await page.locator('.camera-options').getByRole('button',{name:angle,exact:true}).getAttribute('aria-pressed'),'true');}
  await page.getByRole('button',{name:'Movement speed',exact:true}).click();
  assert((await page.getByRole('button',{name:'Movement speed',exact:true}).textContent()).includes('0.5'));
  await page.getByRole('button',{name:'Muscles',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Muscles',exact:true}).getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('.scene-fallback').count(),0);
 });
 await test('Meal choices are included in export; old backups migrate without losing records',async()=>{
  await ready(page,'/progress'); const before=await saveState(page);
  const backup=await exportBackup(page);
  assert.deepEqual(backup.mealSelections,before.mealSelections);
  const old={...backup}; delete old.mealSelections;
  await page.locator('input[type="file"]').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
  await page.getByRole('button',{name:'Replace & restore',exact:true}).click();
  assert.deepEqual((await saveState(page)).mealSelections,{});
  assert.deepEqual((await saveState(page)).logs,before.logs);
  await page.locator('input[type="file"]').setInputFiles({name:'new.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
  await page.getByRole('button',{name:'Replace & restore',exact:true}).click();
  assert.deepEqual((await saveState(page)).mealSelections,before.mealSelections);
  const invalid={...backup,mealSelections:{[date()]:{lunch:'unknown'}}};
  await page.locator('input[type="file"]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.deepEqual((await saveState(page)).mealSelections,before.mealSelections);
 });
 await test('All four pages and food dialogs pass dark WCAG in both languages',async()=>{
  const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8'), issues=[];
  await page.setViewportSize({width:1440,height:1000});
  for(const lang of ['ar','en']){
   await page.evaluate(lang=>localStorage.setItem('kr-lang',lang),lang);
   for(const route of ['/','/train','/nutrition','/progress']){
    await ready(page,route); await page.addScriptTag({content:axe});
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    issues.push(...result.violations.map(v=>({lang,route,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
   }
   await ready(page,'/nutrition'); await page.locator('[data-meal="breakfast"] .swap-meal').click();
   await page.addScriptTag({content:axe});
   const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   issues.push(...result.violations.map(v=>({lang,route:'meal-picker',id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
   await page.keyboard.press('Escape');
  }
  fs.writeFileSync(out+'/accessibility-dark.json',JSON.stringify(issues,null,2)); assert.equal(issues.length,0,JSON.stringify(issues));
 });
 await test('Dark RTL/LTR layout fits small phones, tablets, landscape and desktop',async()=>{
  for(const lang of ['ar','en']){await page.evaluate(lang=>localStorage.setItem('kr-lang',lang),lang);
   for(const [width,height] of [[360,800],[390,844],[768,1024],[844,390],[1920,1080]]){await page.setViewportSize({width,height});
    for(const route of ['/','/nutrition','/train','/progress']){await ready(page,route); await page.waitForTimeout(280);
     const size=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
     assert(size.content<=size.viewport+1,`${lang} ${route} ${width}: ${size.content}`);
    }
   }
  }
 });
 await test('WebKit mobile: dark mode, meal choice persistence and RTL',async()=>{
  const safari=await webkit.launch({headless:true}); const c=await safari.newContext({...contextOptions,viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark',timezoneId:'Asia/Riyadh'});
  await staticPreview(c,base); const p=await c.newPage(); p.on('pageerror',e=>errors.push(e.message));
  await ready(p,'/nutrition'); assert.equal(await p.locator('html').getAttribute('dir'),'rtl'); assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');
  await p.locator('[data-meal="breakfast"] .swap-meal').click();
  await p.locator('.meal-options button').first().click();
  await p.reload(); await p.locator('.meal-board').waitFor(); assert.equal((await saveState(p)).mealSelections[date()].breakfast,'eggs');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),390);
  await p.screenshot({path:out+'/food-webkit-ar.png',fullPage:true}); await safari.close();
 });
 // Final clean previews have no test check-ins or custom meals.
 await page.evaluate(()=>{localStorage.clear();localStorage.setItem('kc-theme','dark');localStorage.setItem('kr-lang','ar');});
 await page.setViewportSize({width:1440,height:1000}); await ready(page,'/'); await page.screenshot({path:out+'/today-dark-ar.png',fullPage:true});
 await ready(page,'/nutrition'); await page.screenshot({path:out+'/food-dark-ar.png',fullPage:true});
 await page.setViewportSize({width:390,height:844}); await ready(page,'/nutrition'); await page.screenshot({path:out+'/food-dark-mobile.png',fullPage:true});
 results.push({name:'No uncaught exceptions',passed:errors.length===0,errors});
 fs.writeFileSync(out+'/results.json',JSON.stringify({mode:staticMode?'production-build fixture without network':'HTTP',results},null,2));
 console.log(JSON.stringify({passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length}));
 await browser.close(); process.exit(results.some(r=>!r.passed)?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
