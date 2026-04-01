import { useState, useCallback, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((prev) => !prev), []);

  return (
    <button
      data-testid="theme-toggle-btn"
      onClick={toggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );
}
