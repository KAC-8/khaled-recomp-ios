const { chromium, webkit } = require("playwright");
const fs = require("fs"),
  assert = require("assert");
const out = __dirname + "/../test-results/upgrade";
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE || "http://127.0.0.1:4173",
  results = [],
  errors = [];
const date = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, passed: false, error: e.message });
    console.log("FAIL", name, e.message);
  }
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(
    () =>
      !localStorage.getItem("kr-lang") && localStorage.setItem("kr-lang", "en"),
  );
  await page.goto(base + "/train");
  await page.locator("h1").waitFor();
  await test("Direct theme toggle persists and updates browser chrome", async () => {
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page
      .getByRole("button", { name: "Use dark mode", exact: true })
      .click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload();
    await page
      .getByRole("heading", { name: "Master the fundamentals.", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "Use light mode", exact: true })
      .waitFor();
    assert.equal(
      await page.locator('meta[name="theme-color"]').getAttribute("content"),
      "#111214",
    );
    await page.screenshot({ path: out + "/train-dark-en.png", fullPage: true });
  });
  await test("OS dark preference is applied without a saved preference", async () => {
    const dark = await browser.newContext({ colorScheme: "dark" });
    const p = await dark.newPage();
    await p.goto(base);
    assert.equal(await p.locator("html").getAttribute("data-theme"), "dark");
    await dark.close();
  });
  await test("Dated navigation is shared between sections", async () => {
    await page
      .getByRole("button", { name: "Previous week", exact: true })
      .click();
    assert.equal(
      await page.locator(".week-day.is-active").getAttribute("data-date"),
      date(-7),
    );
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Nutrition", exact: true })
      .click();
    await page.waitForURL("**/nutrition");
    assert.equal(
      await page.locator(".week-day.is-active").getAttribute("data-date"),
      date(-7),
    );
    await page
      .getByRole("button", { name: "Regular meals", exact: true })
      .click();
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("khalid-cut-v1")),
    );
    assert(saved.habits[date(-7)].includes("meals"));
    assert(!saved.habits[date()]?.includes("meals"));
    await page.getByRole("button", { name: "Today", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Regular meals", exact: true })
        .getAttribute("aria-pressed"),
      "false",
    );
  });
  await test("Future days are planning-only across nutrition, training and tracking", async () => {
    await page.getByRole("button", { name: "Next week", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Regular meals", exact: true })
        .isDisabled(),
      true,
    );
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Calisthenics", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Start a session", exact: true })
      .click();
    await page
      .locator(".session-tabs")
      .getByRole("button", { name: "A · Foundation", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Complete Push-up", exact: true })
        .isDisabled(),
      true,
    );
    await page.keyboard.press("Escape");
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Progress", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "New check-in", exact: true })
        .isDisabled(),
      true,
    );
    await page.getByRole("button", { name: "Today", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "New check-in", exact: true })
        .isDisabled(),
      false,
    );
  });
  await test("Selected past date defaults in check-in form and saves accurately", async () => {
    await page
      .getByRole("button", { name: "Previous week", exact: true })
      .click();
    await page
      .getByRole("button", { name: "New check-in", exact: true })
      .click();
    assert.equal(
      await page.getByLabel("Date", { exact: true }).inputValue(),
      date(-7),
    );
    await page.getByLabel("Push-ups · clean reps", { exact: true }).fill("11");
    await page
      .getByRole("button", { name: "Save check-in", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("khalid-cut-v1")),
    );
    assert.equal(saved.logs[0].date, date(-7));
    assert.equal(saved.logs[0].push, 11);
  });
  await test("Weekly layout customization persists without altering previous records", async () => {
    const before = await page.evaluate(
      () => JSON.parse(localStorage.getItem("khalid-cut-v1")).logs,
    );
    await page
      .getByRole("button", { name: "Edit your week", exact: true })
      .click();
    await page.getByLabel("Plan for Monday", { exact: true }).selectOption("b");
    await page
      .getByRole("button", { name: "Save weekly plan", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.reload();
    await page.locator("h1").waitFor();
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("khalid-cut-v1")),
    );
    assert.equal(saved.weekPlan["1"], "b");
    assert.deepEqual(saved.logs, before);
  });
  await test("Improved 3D controls support four angles, speed and muscle highlight", async () => {
    await page.goto(base + "/train");
    await page.locator("canvas").waitFor();
    await page.locator("canvas").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page
      .locator(".exercise-selector")
      .getByRole("button", { name: /Bodyweight squat/ })
      .click();
    for (const angle of ["Front", "Side", "Back", "Angle"]) {
      await page
        .locator(".camera-options")
        .getByRole("button", { name: angle, exact: true })
        .click();
      assert.equal(
        await page
          .locator(".camera-options")
          .getByRole("button", { name: angle, exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
    }
    await page
      .getByRole("button", { name: "Movement speed", exact: true })
      .click();
    assert.match(
      await page
        .getByRole("button", { name: "Movement speed", exact: true })
        .textContent(),
      /0.5/,
    );
    await page.getByRole("button", { name: "Muscles", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Muscles", exact: true })
        .getAttribute("aria-pressed"),
      "false",
    );
    await page.getByRole("button", { name: "Muscles", exact: true }).click();
    await page.waitForTimeout(450);
    assert.equal(await page.locator(".scene-fallback").count(), 0);
    await page.screenshot({ path: out + "/studio-dark.png", fullPage: true });
  });
  await test("80/20 priorities are present and responsive on all routes", async () => {
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/train",
        "/approach",
        "/nutrition",
        "/progress",
      ]) {
        await page.goto(base + route);
        await page.locator(".focus-balance").waitFor();
        assert.equal(await page.locator(".balance-number").count(), 2);
        assert.equal(await page.locator(".week-day").count(), 7);
        const dims = await page.evaluate(() => ({
          w: innerWidth,
          s: document.documentElement.scrollWidth,
        }));
        assert(dims.s <= dims.w + 1, `${route} ${width} overflow ${dims.s}`);
      }
    }
  });
  await test("Dark mode accessibility in both languages on all pages", async () => {
    const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"),
      issues = [];
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const lang of ["ar", "en"]) {
      await page.evaluate((l) => localStorage.setItem("kr-lang", l), lang);
      for (const route of [
        "/",
        "/train",
        "/approach",
        "/nutrition",
        "/progress",
      ]) {
        await page.goto(base + route);
        await page.locator("h1").waitFor();
        await page.waitForTimeout(500);
        await page.addScriptTag({ content: axe });
        const r = await page.evaluate(() =>
          axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          }),
        );
        for (const v of r.violations)
          issues.push({
            lang,
            route,
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          });
      }
    }
    fs.writeFileSync(
      out + "/accessibility-dark.json",
      JSON.stringify(issues, null, 2),
    );
    assert.equal(issues.length, 0, JSON.stringify(issues));
  });
  await test("Past sessions use the selected date", async () => {
    await page.goto(base + "/train");
    await page.locator("h1").waitFor();
    await page
      .getByRole("button", { name: "Previous week", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Start a session", exact: true })
      .click();
    await page
      .locator(".session-tabs")
      .getByRole("button", { name: "A · Foundation", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Complete Push-up", exact: true })
      .click();
    await page.keyboard.press("Escape");
    const records = await page.evaluate(
      () => JSON.parse(localStorage.getItem("khalid-cut-v1")).training,
    );
    assert(
      records.some(
        (s) =>
          s.date === date(-7) && s.session === "a" && s.done.includes("pushup"),
      ),
    );
    assert(
      !records.some((s) => s.date === date() && s.done.includes("pushup")),
    );
  });
  await test("Dark forms, toast and keyboard skip link remain readable", async () => {
    await page.goto(base + "/progress");
    await page
      .getByRole("button", { name: "New check-in", exact: true })
      .click();
    const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
    await page.addScriptTag({ content: axe });
    const audit = await page.evaluate(() =>
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
    );
    assert.equal(
      audit.violations.length,
      0,
      JSON.stringify(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
    await page
      .getByRole("button", { name: "Save check-in", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.locator(".toast:not(:empty)").waitFor();
    const toast = await page
      .locator(".toast")
      .evaluate((el) => ({
        color: getComputedStyle(el).color,
        bg: getComputedStyle(el).backgroundColor,
      }));
    assert.notEqual(toast.color, toast.bg);
    await page.locator(".skip-link").focus();
    const skip = await page
      .locator(".skip-link")
      .evaluate((el) => ({
        color: getComputedStyle(el).color,
        bg: getComputedStyle(el).backgroundColor,
      }));
    assert.notEqual(skip.color, skip.bg);
  });
  await test("WebKit mobile dark theme and day controls", async () => {
    const safari = await webkit.launch({ headless: true, timeout: 20000 });
    const c = await safari.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "dark",
      isMobile: true,
      hasTouch: true,
    });
    const p = await c.newPage();
    p.setDefaultTimeout(20000);
    await p.addInitScript(() => localStorage.setItem("kr-lang", "ar"));
    await p.goto(base + "/train");
    await p.locator("h1").waitFor();
    assert.equal(await p.locator("html").getAttribute("data-theme"), "dark");
    await p
      .getByRole("button", { name: "الأسبوع السابق", exact: true })
      .click();
    assert.equal(
      await p.locator(".week-day.is-active").getAttribute("data-date"),
      date(-7),
    );
    await p.locator("canvas").scrollIntoViewIfNeeded();
    await p.waitForTimeout(700);
    await p.screenshot({ path: out + "/webkit-dark-ar.png", fullPage: true });
    assert.equal(await p.locator(".scene-fallback").count(), 0);
    await safari.close();
  });
  results.push({
    name: "No uncaught exceptions",
    passed: errors.length === 0,
    errors,
  });
  fs.writeFileSync(out + "/results.json", JSON.stringify(results, null, 2));
  console.log(
    JSON.stringify(
      {
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  if (results.some((r) => !r.passed)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
