import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Lang, Pair } from "./data";

export interface Log {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  push?: number;
  pull?: number;
  hold?: number;
  energy?: number;
  note: string;
}
export interface Training {
  date: string;
  session: string;
  done: string[];
}
interface Saved {
  version: 1;
  logs: Log[];
  training: Training[];
  habits: Record<string, string[]>;
  hideBody: boolean;
}
const KEY = "khalid-cut-v1";
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function validDate(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    !Number.isNaN(Date.parse(v)) &&
    new Date(v + "T12:00:00Z").toISOString().slice(0, 10) === v &&
    v <= today() &&
    v >= "2000-01-01"
  );
}
const ranges = {
  weight: [20, 350],
  waist: [30, 250],
  push: [0, 500],
  pull: [0, 200],
  hold: [0, 3600],
} as const;
export function validateBackup(raw: unknown): Saved {
  if (!raw || typeof raw !== "object") throw Error("Invalid backup");
  const d = raw as Saved;
  if (
    d.version !== 1 ||
    !Array.isArray(d.logs) ||
    d.logs.length > 10000 ||
    !Array.isArray(d.training) ||
    d.training.length > 10000
  )
    throw Error("Invalid backup");
  const dates = new Set<string>();
  const ids = new Set<string>();
  const logs = d.logs.map((l) => {
    if (
      !l ||
      !validDate(l.date) ||
      dates.has(l.date) ||
      (l.energy !== undefined &&
        (!Number.isInteger(l.energy) || l.energy < 1 || l.energy > 5)) ||
      typeof l.note !== "string" ||
      l.note.length > 1000
    )
      throw Error("Invalid log");
    dates.add(l.date);
    const log: Log = {
      id: typeof l.id === "string" ? l.id.slice(0, 100) : crypto.randomUUID(),
      date: l.date,
      energy: l.energy,
      note: l.note,
    };
    if (!log.id || ids.has(log.id)) throw Error("Invalid record identifier");
    ids.add(log.id);
    for (const k of Object.keys(ranges) as (keyof typeof ranges)[]) {
      const n = l[k];
      const [min, max] = ranges[k];
      if (n !== undefined) {
        if (
          typeof n !== "number" ||
          !Number.isFinite(n) ||
          n < min ||
          n > max ||
          (["push", "pull", "hold"].includes(k) && !Number.isInteger(n))
        )
          throw Error("Invalid measurement");
        log[k] = n;
      }
    }
    return log;
  });
  const training = d.training.map((t) => {
    if (
      !t ||
      !validDate(t.date) ||
      !["a", "b", "c"].includes(t.session) ||
      !Array.isArray(t.done) ||
      t.done.some((id) => {
        const allowed: Record<string, string[]> = {
          a: ["pushup", "squat"],
          b: ["pullup", "hollow"],
          c: ["pushup", "pullup", "squat", "hollow"],
        };
        return !allowed[t.session]?.includes(id);
      })
    )
      throw Error("Invalid session");
    return { date: t.date, session: t.session, done: [...new Set(t.done)] };
  });
  const habits: Record<string, string[]> = {};
  if (d.habits && typeof d.habits === "object")
    for (const [date, values] of Object.entries(d.habits))
      if (validDate(date) && Array.isArray(values))
        habits[date] = values.filter((v) =>
          ["meals", "water", "sleep", "move"].includes(v),
        );
  return {
    version: 1,
    logs: logs.sort((a, b) => a.date.localeCompare(b.date)),
    training: Array.from(
      new Map(training.map((s) => [`${s.date}-${s.session}`, s])).values(),
    ),
    habits,
    hideBody: !!d.hideBody,
  };
}
const empty: Saved = {
  version: 1,
  logs: [],
  training: [],
  habits: {},
  hideBody: false,
};
function read(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        return validateBackup(JSON.parse(raw));
      } catch {
        localStorage.setItem(KEY + "-recovery", raw);
      }
    }
    const legacy = JSON.parse(localStorage.getItem("kr-logs") || "[]");
    if (Array.isArray(legacy)) {
      const dates = new Set<string>();
      const logs = legacy
        .filter(
          (l) =>
            l &&
            validDate(l.date) &&
            !dates.has(l.date) &&
            (dates.add(l.date), true),
        )
        .map((l) => {
          const log: Log = {
            id: crypto.randomUUID(),
            date: l.date,
            note: "",
          };
          for (const k of Object.keys(ranges) as (keyof typeof ranges)[]) {
            const n = Number(l[k]);
            if (
              l[k] !== "" &&
              l[k] != null &&
              Number.isFinite(n) &&
              n >= ranges[k][0] &&
              n <= ranges[k][1]
            )
              log[k] = n;
          }
          return log;
        });
      return { ...empty, logs };
    }
  } catch {
    /* Preserve the original storage if a previous version is unreadable. */
  }
  return empty;
}
interface AppState extends Saved {
  lang: Lang;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;
  pair: (p: Pair) => string;
  saveLog: (log: Log) => void;
  removeLog: (id: string) => void;
  toggleExercise: (session: string, id: string) => void;
  toggleHabit: (id: string) => void;
  toggleBody: () => void;
  importData: (d: unknown) => void;
  backup: () => Saved;
  storageError: boolean;
  toast: string;
  notify: (v: string) => void;
}
const Context = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState(read);
  const [storageError, setStorageError] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("kr-lang") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  });
  const [toast, notify] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [saved]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("kr-lang", lang);
    } catch {
      setStorageError(true);
    }
  }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => notify(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  const value: AppState = {
    ...saved,
    lang,
    storageError,
    toast,
    notify,
    toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
    t: (ar, en) => (lang === "ar" ? ar : en),
    pair: (p) => p[lang === "ar" ? 0 : 1],
    saveLog: (log) =>
      setSaved((s) => ({
        ...s,
        logs: [...s.logs.filter((l) => l.date !== log.date), log].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      })),
    removeLog: (id) =>
      setSaved((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== id) })),
    toggleExercise: (session, id) =>
      setSaved((s) => {
        const date = today(),
          old = s.training.find(
            (t) => t.date === date && t.session === session,
          );
        return {
          ...s,
          training: [
            ...s.training.filter((t) => t !== old),
            {
              date,
              session,
              done: old?.done.includes(id)
                ? old.done.filter((e) => e !== id)
                : [...(old?.done || []), id],
            },
          ],
        };
      }),
    toggleHabit: (id) =>
      setSaved((s) => {
        const date = today(),
          values = s.habits[date] || [];
        return {
          ...s,
          habits: {
            ...s.habits,
            [date]: values.includes(id)
              ? values.filter((v) => v !== id)
              : [...values, id],
          },
        };
      }),
    toggleBody: () => setSaved((s) => ({ ...s, hideBody: !s.hideBody })),
    importData: (d) => setSaved(validateBackup(d)),
    backup: () => saved,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const c = useContext(Context);
  if (!c) throw Error("Missing provider");
  return c;
}
