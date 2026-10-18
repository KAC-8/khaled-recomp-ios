import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowDownToLine,
  Check,
  Compass,
  Dumbbell,
  Globe2,
  House,
  Menu,
  Moon,
  Sun,
  Utensils,
  WifiOff,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useApp } from "./lib/store";
import { Modal } from "./components/UI";
import Home from "./pages/Home";
const Train = lazy(() => import("./pages/Train"));
const Approach = lazy(() => import("./pages/Approach"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Progress = lazy(() => import("./pages/Progress"));
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function App() {
  const { t, lang, toggleLang, toast, storageError, theme, toggleTheme } =
    useApp();
  const location = useLocation();
  const [menu, setMenu] = useState(false),
    [installHelp, setInstallHelp] = useState(false),
    [install, setInstall] = useState<InstallEvent | null>(null),
    [offline, setOffline] = useState(!navigator.onLine);
  const {
    needRefresh: [refresh, setRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW();
  const nav = [
    { to: "/", label: t("الرئيسية", "Overview"), icon: House },
    { to: "/train", label: t("الكالستنكس", "Calisthenics"), icon: Dumbbell },
    { to: "/approach", label: t("المنهج", "Approach"), icon: Compass },
    { to: "/nutrition", label: t("التغذية", "Nutrition"), icon: Utensils },
    { to: "/progress", label: t("التقدم", "Progress"), icon: Activity },
  ];
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `Khalid Cut — ${nav.find((n) => n.to === location.pathname)?.label || t("الصفحة غير موجودة", "Page not found")}`;
    const timeout = setTimeout(
      () =>
        document
          .querySelector<HTMLElement>("main h1")
          ?.focus({ preventScroll: true }),
      400,
    );
    return () => clearTimeout(timeout);
  }, [location.pathname, lang]);
  useEffect(() => {
    const capture = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvent);
    };
    const online = () => setOffline(!navigator.onLine);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("online", online);
    window.addEventListener("offline", online);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", online);
    };
  }, []);
  useEffect(() => {
    document
      .querySelectorAll("main h1")
      .forEach((h) => h.setAttribute("tabindex", "-1"));
  });
  const installApp = async () => {
    if (install) {
      await install.prompt();
      const result = await install.userChoice;
      if (result.outcome === "accepted") setInstall(null);
    } else setInstallHelp(true);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        {t("انتقل إلى المحتوى", "Skip to content")}
      </a>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Khalid Cut">
            <svg
              viewBox="0 0 34 34"
              width="32"
              height="32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 29 12 5h7l-9 24H3Zm13 0 5-13h10l-5 13H16Zm7-18 2-6h7l-2 6h-7Z"
                fill="currentColor"
              />
            </svg>
            <span dir="ltr">
              KHALID<span className="brand-light"> / CUT</span>
            </span>
          </Link>
          <nav
            className="desktop-nav"
            aria-label={t("التنقل الرئيسي", "Main navigation")}
          >
            {nav.map((n) => (
              <NavLink end key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="theme-button icon-button"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label={
                theme === "dark"
                  ? t("تفعيل الوضع الفاتح", "Use light mode")
                  : t("تفعيل الوضع الداكن", "Use dark mode")
              }
              title={
                theme === "dark"
                  ? t("الوضع الفاتح", "Light mode")
                  : t("الوضع الداكن", "Dark mode")
              }
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={18} />}
            </button>
            <button
              className="lang-button"
              onClick={toggleLang}
              aria-label={t("Switch to English", "التبديل إلى العربية")}
            >
              <Globe2 size={16} />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>
            <button
              className="install-button"
              onClick={installApp}
              aria-label={t("تثبيت التطبيق", "Install app")}
            >
              <ArrowDownToLine size={17} />
            </button>
            <button
              className="menu-button icon-button"
              aria-label={t("القائمة", "Menu")}
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            className="mobile-menu"
            aria-label={t("قائمة الصفحات", "Page menu")}
          >
            {nav.map((n) => (
              <NavLink end key={n.to} to={n.to} onClick={() => setMenu(false)}>
                <n.icon size={18} />
                {n.label}
              </NavLink>
            ))}
            <button onClick={installApp}>
              <ArrowDownToLine size={18} />
              {t("أضف إلى الشاشة الرئيسية", "Add to home screen")}
            </button>
          </nav>
        )}
      </header>
      {offline && (
        <div className="status-banner">
          <WifiOff size={15} />
          {t(
            "أنت غير متصل. يمكنك الاستمرار والحفظ على هذا الجهاز.",
            "You’re offline. Keep going — entries save on this device.",
          )}
        </div>
      )}
      {storageError && (
        <div className="status-banner warning" role="alert">
          {t(
            "المتصفح يمنع الحفظ. صدّر نسخة من بياناتك قبل إغلاق الصفحة.",
            "Your browser is blocking storage. Export your data before closing this page.",
          )}
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense
            fallback={
              <div className="loading" role="status">
                {t("لحظة واحدة…", "One moment…")}
              </div>
            }
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/train" element={<Train />} />
              <Route path="/approach" element={<Approach />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/progress" element={<Progress />} />
              <Route
                path="*"
                element={
                  <div className="not-found">
                    <h1>
                      {t(
                        "هذه الصفحة أخذت استراحة.",
                        "This page is taking a rest.",
                      )}
                    </h1>
                    <Link className="button" to="/">
                      {t("العودة للرئيسية", "Back to overview")}
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <footer className="footer">
        <Link to="/" className="footer-brand" dir="ltr">
          KHALID / CUT<span>MOVE WITH INTENT.</span>
        </Link>
        <p>
          {t(
            "قوّة تتطوّر. وعادات تدوم.",
            "Strength that grows. Habits that last.",
          )}
        </p>
        <span>
          {t("بياناتك محفوظة على هذا الجهاز", "Your data stays on this device")}
          {offlineReady ? <Check size={13} /> : null}
        </span>
      </footer>
      <nav
        className="bottom-nav"
        aria-label={t("التنقل السفلي", "Quick navigation")}
      >
        {nav.map((n) => (
          <NavLink end key={n.to} to={n.to}>
            <n.icon size={20} strokeWidth={1.6} />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="toast" role="status" aria-live="polite">
        {toast ? (
          <>
            <Check size={17} />
            {toast}
          </>
        ) : null}
      </div>
      {refresh && (
        <div className="update-notice">
          <span>
            {t(
              "نسخة جديدة جاهزة. احفظ أي إدخال مفتوح قبل التحديث.",
              "An update is ready. Save any open entry before refreshing.",
            )}
          </span>
          <button onClick={() => void updateServiceWorker(true)}>
            {t("تحديث", "Update")}
          </button>
          <button
            aria-label={t("لاحقًا", "Later")}
            onClick={() => setRefresh(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {installHelp && (
        <Modal
          title={t("معك أينما تمرّنت", "Ready when you are")}
          onClose={() => setInstallHelp(false)}
        >
          <div className="install-help">
            <div className="app-icon" dir="ltr">
              KC<span>/</span>
            </div>
            <p>
              {t(
                "على iPhone: افتح الموقع في Safari، اضغط زر المشاركة، ثم «إضافة إلى الشاشة الرئيسية».",
                "On iPhone: open in Safari, tap Share, then “Add to Home Screen”.",
              )}
            </p>
            <p>
              {t(
                "على الكمبيوتر وAndroid: اختر «تثبيت التطبيق» من قائمة المتصفح. بعد أول زيارة مكتملة، يعمل التطبيق دون اتصال.",
                "On desktop and Android: choose “Install app” in your browser menu. After the first full visit, the app works offline.",
              )}
            </p>
            <button className="button" onClick={() => setInstallHelp(false)}>
              {t("فهمت", "Got it")}
              <Check size={18} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
