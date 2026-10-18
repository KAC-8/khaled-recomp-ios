const { chromium, webkit } = require("playwright");
const fs = require("fs"),
  assert = require("assert");
const out = __dirname + "/../test-results",
  base = process.env.QA_BASE || "http://127.0.0.1:4173";
fs.mkdirSync(out, { recursive: true });
const results = [],
  errors = [];
const check = (name, fn) => async () => {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, passed: false, error: e.message });
    console.log("FAIL", name, e.message);
  }
};
const localDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await check("Arabic default and real route navigation", async () => {
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "الكالستنكس", exact: true })
      .click();
    await page.waitForURL("**/train");
    await page.locator("canvas").waitFor();
    await page.waitForTimeout(500);
    assert.equal(await page.locator("h1").count(), 1);
    await page
      .getByRole("button", { name: "Switch to English", exact: true })
      .click();
    assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
    await page.reload();
    await page
      .getByRole("heading", { name: "Master the fundamentals.", exact: true })
      .waitFor();
  })();
  await check("All four WebGL movement demos and controls", async () => {
    for (const name of [
      "Push-up",
      "Pull-up",
      "Bodyweight squat",
      "Hollow hold",
    ]) {
      await page
        .locator(".exercise-selector")
        .getByRole("button", {
          name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        })
        .click();
      await page
        .locator(".movement-info h2")
        .getByText(name, { exact: false })
        .waitFor();
      await page.waitForTimeout(180);
      assert.equal(await page.locator("canvas").count(), 1);
      assert.equal(await page.locator(".scene-fallback").count(), 0);
    }
    await page
      .getByRole("button", { name: "Pause movement", exact: true })
      .click();
    const a = await page.locator("canvas").screenshot();
    await page.waitForTimeout(250);
    const b = await page.locator("canvas").screenshot();
    assert(a.equals(b), "Paused scene should stay still");
    await page.getByRole("slider", { name: "Movement position" }).fill("85");
    await page.getByRole("button", { name: "Side view", exact: true }).click();
    await page.getByRole("button", { name: "Angled", exact: true }).waitFor();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: out + "/studio-en-desktop.png",
      fullPage: true,
    });
  })();
  await check(
    "Session checklist, focus trap, timer and persistence",
    async () => {
      await page
        .getByRole("button", { name: "Start a session", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await dialog
        .getByRole("button", { name: "Complete Push-up", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Complete Bodyweight squat", exact: true })
        .click();
      assert.equal(
        await dialog.locator(".session-progress>span").textContent(),
        "2 / 2",
      );
      await dialog
        .getByRole("button", { name: "Start timer", exact: true })
        .click();
      await page.waitForTimeout(1250);
      assert.notEqual(
        await dialog.locator(".rest-timer>strong").textContent(),
        "1:30",
      );
      await dialog
        .getByRole("button", { name: "Pause timer", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Reset timer", exact: true })
        .click();
      assert.equal(
        await dialog.locator(".rest-timer>strong").textContent(),
        "1:30",
      );
      await page.keyboard.press("Escape");
      await page.reload();
      await page
        .getByRole("button", { name: "Start a session", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Complete Push-up", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.keyboard.press("Escape");
    },
  )();
  await check(
    "Nutrition tabs, keyboard navigation and saved habits",
    async () => {
      await page.goto(base + "/nutrition");
      await page.getByRole("tab", { name: "Lunch", exact: true }).click();
      await page
        .getByRole("heading", { name: "A balanced plate. Your way." })
        .waitFor();
      await page.getByRole("tab", { name: "Lunch", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await page
          .getByRole("tab", { name: "Dinner", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      await page
        .getByRole("button", { name: "Regular meals", exact: true })
        .click();
      await page.reload();
      assert.equal(
        await page
          .getByRole("button", { name: "Regular meals", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.screenshot({
        path: out + "/nutrition-en-desktop.png",
        fullPage: true,
      });
    },
  )();
  await check("Create, edit, deduplicate and persist check-ins", async () => {
    await page.goto(base + "/progress");
    await page
      .getByRole("button", { name: "New check-in", exact: true })
      .click();
    let d = page.getByRole("dialog");
    await d.getByLabel("Push-ups · clean reps", { exact: true }).fill("12");
    await d.getByLabel("Pull-ups · clean reps", { exact: true }).fill("5");
    await d
      .getByLabel("Hollow · controlled seconds", { exact: true })
      .fill("20");
    await d
      .getByRole("button", { name: "Weight & waist · optional", exact: true })
      .click();
    await d.getByLabel("Weight · kg", { exact: true }).fill("72.4");
    await d.getByLabel("Waist · cm", { exact: true }).fill("82");
    await d
      .getByLabel("A note to yourself · optional", { exact: true })
      .fill("A steady training day <script>alert(1)</script>");
    await d.getByRole("button", { name: "Save check-in", exact: true }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("tbody tr").count(), 1);
    await page
      .getByRole("button", { name: `Edit ${localDate()}`, exact: true })
      .click();
    d = page.getByRole("dialog");
    await d.getByLabel("Push-ups · clean reps", { exact: true }).fill("14");
    await d
      .getByRole("button", { name: "Update check-in", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("tbody tr").count(), 1);
    assert.equal(await page.locator("tbody tr td").nth(1).textContent(), "14");
    await page.reload();
    await page.locator("tbody tr").waitFor();
    assert.equal(await page.locator("tbody tr").count(), 1);
    assert.equal(await page.locator("tbody tr td").nth(1).textContent(), "14");
    await page
      .getByRole("button", { name: "New check-in", exact: true })
      .click();
    d = page.getByRole("dialog");
    await d.getByLabel("Date", { exact: true }).fill(localDate(-7));
    await d.getByLabel("Push-ups · clean reps", { exact: true }).fill("10");
    await d.getByLabel("Pull-ups · clean reps", { exact: true }).fill("4");
    await d.getByRole("button", { name: "Save check-in", exact: true }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("tbody tr").count(), 2);
    await page.locator(".chart svg").waitFor();
  })();
  await check(
    "Validation rejects future dates and invalid measurements",
    async () => {
      await page
        .getByRole("button", { name: "New check-in", exact: true })
        .click();
      const d = page.getByRole("dialog");
      await d.getByLabel("Date", { exact: true }).fill(localDate(1));
      await d
        .getByRole("button", { name: "Save check-in", exact: true })
        .click();
      assert.equal(await d.count(), 1);
      assert.equal(
        await d
          .getByLabel("Date", { exact: true })
          .evaluate((el) => el.validity.rangeOverflow),
        true,
      );
      await d.getByLabel("Date", { exact: true }).fill(localDate(-1));
      await d.getByLabel("Push-ups · clean reps", { exact: true }).fill("-1");
      assert.equal(
        await d
          .getByLabel("Push-ups · clean reps", { exact: true })
          .evaluate((el) => el.validity.valid),
        false,
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("tbody tr").count(), 2);
    },
  )();
  await check(
    "Neutral body measurement controls and chart periods",
    async () => {
      await page.getByLabel("Metric", { exact: true }).selectOption("weight");
      await page
        .getByRole("button", { name: "Hide body measurements", exact: true })
        .click();
      assert.equal(
        await page.getByLabel("Metric", { exact: true }).inputValue(),
        "push",
      );
      assert.equal(
        await page
          .getByLabel("Metric", { exact: true })
          .getByRole("option", { name: "Weight", exact: true })
          .count(),
        0,
      );
      await page.reload();
      assert.equal(
        await page
          .getByRole("button", { name: "Show body measurements", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      for (const text of ["30 days", "90 days", "All"])
        await page.getByRole("button", { name: text, exact: true }).click();
      await page.screenshot({
        path: out + "/progress-en-desktop.png",
        fullPage: true,
      });
    },
  )();
  let saved;
  await check("Export, safe import preview and restore", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export", exact: true }).click();
    const download = await downloadPromise;
    await download.saveAs(out + "/backup.json");
    saved = JSON.parse(fs.readFileSync(out + "/backup.json", "utf8"));
    assert.equal(saved.logs.length, 2);
    await page.locator("input[type=file]").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":1,"logs":"bad"}'),
    });
    await page
      .getByRole("alert")
      .getByText(/Couldn’t read/)
      .waitFor();
    assert.equal(await page.locator("tbody tr").count(), 2);
    await page.locator("input[type=file]").setInputFiles(out + "/backup.json");
    await page
      .getByRole("dialog", { name: "Restore your backup", exact: true })
      .waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("tbody tr").count(), 2);
    await page
      .getByRole("button", { name: `Delete ${localDate(-7)}`, exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirm delete", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("tbody tr").count(), 1);
    await page.locator("input[type=file]").setInputFiles(out + "/backup.json");
    await page
      .getByRole("button", { name: "Replace & restore", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("tbody tr").count(), 2);
  })();
  await check("PWA manifest, assets and offline deep routes", async () => {
    await page.goto(base);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.waitForTimeout(1500);
    await page.reload();
    const manifest = await (
      await page.request.get(base + "/manifest.webmanifest")
    ).json();
    assert.equal(manifest.display, "standalone");
    for (const icon of manifest.icons) {
      const r = await page.request.get(base + icon.src);
      assert.equal(r.status(), 200);
      assert(r.headers()["content-type"].includes("image"));
    }
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await context.setOffline(true);
    try {
      await page.goto(base + "/nutrition");
      await page
        .getByRole("heading", { name: "Fuel your day.", exact: true })
        .waitFor();
      await page.goto(base + "/train");
      await page.locator("canvas").waitFor();
      assert.equal(await page.locator(".scene-fallback").count(), 0);
    } finally {
      await context.setOffline(false);
    }
  })();
  await check(
    "Responsive RTL/LTR across every route at 360–1920 px",
    async () => {
      for (const lang of ["ar", "en"]) {
        await page.evaluate((l) => localStorage.setItem("kr-lang", l), lang);
        for (const width of [360, 390, 768, 1440, 1920]) {
          await page.setViewportSize({ width, height: 900 });
          for (const route of [
            "/",
            "/train",
            "/approach",
            "/nutrition",
            "/progress",
          ]) {
            await page.goto(base + route);
            await page.locator("h1").waitFor();
            await page.waitForTimeout(280);
            const dims = await page.evaluate(() => ({
              w: innerWidth,
              s: document.documentElement.scrollWidth,
            }));
            assert(
              dims.s <= dims.w + 1,
              `${lang} ${width} ${route}: overflow ${dims.s}`,
            );
            assert.equal(await page.locator("h1").count(), 1);
            assert.equal(
              await page.locator("html").getAttribute("dir"),
              lang === "ar" ? "rtl" : "ltr",
            );
          }
        }
      }
    },
  )();
  await check(
    "Keyboard menu, installation help and missing route",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(base);
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page
        .locator(".mobile-menu")
        .getByRole("link", { name: "Progress", exact: true })
        .click();
      await page.waitForURL("**/progress");
      assert.equal(await page.locator(".mobile-menu").count(), 0);
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page
        .getByRole("button", { name: "Add to home screen", exact: true })
        .click();
      await page.getByRole("dialog").waitFor();
      await page.keyboard.press("Escape");
      await page.goto(base + "/missing");
      await page
        .getByRole("link", { name: "Back to overview", exact: true })
        .click();
      await page.waitForURL(base + "/");
    },
  )();
  await check(
    "Legacy migration preserves measurements without inventing energy",
    async () => {
      const legacy = await browser.newContext();
      const oldDate = localDate(-2);
      await legacy.addInitScript(
        ({ date }) => {
          localStorage.setItem("kr-lang", "en");
          localStorage.setItem(
            "kr-logs",
            JSON.stringify([{ date, weight: 72, push: 10 }]),
          );
        },
        { date: oldDate },
      );
      const p = await legacy.newPage();
      await p.goto(base + "/progress");
      await p.locator("tbody tr").waitFor();
      const data = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("khalid-cut-v1")),
      );
      assert.equal(data.logs.length, 1);
      assert.equal(data.logs[0].weight, 72);
      assert.equal(data.logs[0].push, 10);
      assert.equal(data.logs[0].energy, undefined);
      await p.reload();
      await p.locator("tbody tr").waitFor();
      assert.equal(await p.locator("tbody tr").count(), 1);
      await legacy.close();
    },
  )();
  await check(
    "Blocked browser storage is reported and the app remains usable",
    async () => {
      const restricted = await browser.newContext();
      await restricted.addInitScript(() =>
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new DOMException("Blocked", "SecurityError");
          },
        }),
      );
      const p = await restricted.newPage();
      await p.goto(base + "/progress");
      await p.getByRole("alert").waitFor();
      await p
        .getByRole("button", { name: "متابعة جديدة", exact: true })
        .click();
      await p.getByRole("dialog").waitFor();
      await p.keyboard.press("Escape");
      await restricted.close();
    },
  )();
  await check("Reduced motion disables exercise autoplay", async () => {
    const reduced = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 390, height: 844 },
    });
    const p = await reduced.newPage();
    await p.addInitScript(() => localStorage.setItem("kr-lang", "en"));
    await p.goto(base + "/train");
    await p.locator("canvas").waitFor();
    await p
      .getByRole("button", { name: "Play movement", exact: true })
      .waitFor();
    await p.waitForTimeout(300);
    const a = await p.locator("canvas").screenshot();
    await p.waitForTimeout(200);
    const b = await p.locator("canvas").screenshot();
    assert(a.equals(b));
    await reduced.close();
  })();
  await check(
    "Accessibility audit on all five pages in Arabic and English",
    async () => {
      const axe = fs.readFileSync(
        require.resolve("axe-core/axe.min.js"),
        "utf8",
      );
      const issues = [];
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
          await page.waitForTimeout(400);
          await page.addScriptTag({ content: axe });
          const r = await page.evaluate(() =>
            axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa"],
              },
            }),
          );
          for (const v of r.violations)
            issues.push({
              lang,
              route,
              id: v.id,
              impact: v.impact,
              nodes: v.nodes
                .map((n) => ({ target: n.target, summary: n.failureSummary }))
                .slice(0, 10),
            });
        }
      }
      fs.writeFileSync(
        out + "/accessibility.json",
        JSON.stringify(issues, null, 2),
      );
      assert.equal(issues.length, 0, JSON.stringify(issues));
    },
  )();
  await check("WebKit iPhone browser: navigation, saving and 3D", async () => {
    const safari = await webkit.launch({ headless: true, timeout: 20000 });
    const c = await safari.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    const p = await c.newPage();
    p.setDefaultTimeout(20000);
    await p.addInitScript(() => localStorage.setItem("kr-lang", "en"));
    await p.goto(base);
    await p.getByRole("heading", { name: /Your strength/ }).waitFor();
    await p
      .locator(".bottom-nav")
      .getByRole("link", { name: "Progress", exact: true })
      .click();
    await p.getByRole("button", { name: "New check-in", exact: true }).click();
    await p
      .getByRole("dialog")
      .getByLabel("Push-ups · clean reps", { exact: true })
      .fill("8");
    await p.getByRole("button", { name: "Save check-in", exact: true }).click();
    await p.reload();
    await p.locator("tbody tr").waitFor();
    await p.goto(base + "/train");
    await p.locator("canvas").waitFor();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + "/webkit-iphone.png", fullPage: true });
    assert.equal(await p.locator(".scene-fallback").count(), 0);
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth),
      390,
    );
    await safari.close();
  })();
  // Keep user-facing previews free of test measurements.
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.waitForTimeout(600);
  await page.screenshot({
    path: out + "/home-final-ar-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/train");
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: out + "/train-final-ar-mobile.png",
    fullPage: true,
  });
  results.push({
    name: "No uncaught browser exceptions",
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
