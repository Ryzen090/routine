"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-20 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse ${className}`} />
    );
  }

  if (compact) {
    const isDark = resolvedTheme === "dark";
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors ${className}`}
        title={`Current theme: ${theme} (${resolvedTheme}). Click to toggle.`}
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700/60 ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          theme === "light"
            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        title="Light Mode"
      >
        <Sun className="h-3.5 w-3.5 text-amber-500" />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          theme === "dark"
            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        title="Dark Mode"
      >
        <Moon className="h-3.5 w-3.5 text-indigo-400" />
        <span>Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          theme === "system"
            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        title="System Mode"
      >
        <Laptop className="h-3.5 w-3.5 text-blue-500" />
        <span>System</span>
      </button>
    </div>
  );
}
