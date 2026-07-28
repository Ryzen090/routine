import { useApp } from "@/contexts/AppContext";
import React, { useEffect, useMemo } from "react";
import { Trophy, Clock, Sun, Moon, Laptop, Palette } from "lucide-react";
import { useTheme } from "next-themes";

interface DailyStats {
  date: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

const isWeekday = (date: string) => {
  const day = new Date(date).getDay();
  return day >= 1 && day <= 5;
};

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const isToday = (date: string) =>
  new Date(date).toDateString() === new Date().toDateString();

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export function Setting() {
  const { state } = useApp();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getDailyStats = (): DailyStats[] => {
    const saved = localStorage.getItem("dailyTaskStats");
    return saved ? JSON.parse(saved) : [];
  };

  const saveDailyStats = (stats: DailyStats[]) => {
    localStorage.setItem("dailyTaskStats", JSON.stringify(stats));
  };

  const dailyStats = getDailyStats();
  const startOfWeek = getStartOfWeek();

  const todaysTasks = state.tasks.filter((t) => t.recurring);
  const totalTasks = todaysTasks.length * 5;
  const completedToday = todaysTasks.filter((t) => t.completed);

  const dailyProgress =
    todaysTasks.length > 0
      ? (completedToday.length / todaysTasks.length) * 100
      : 0;

  useEffect(() => {
    const todayKey = getTodayKey();
    const stats = getDailyStats();

    const completed = completedToday.length;
    const total = todaysTasks.length;

    const todayStat: DailyStats = {
      date: todayKey,
      completedTasks: completed,
      totalTasks: total,
      completionRate: total ? (completed / total) * 100 : 0,
    };

    const index = stats.findIndex((d) => d.date === todayKey);

    if (index >= 0) {
      stats[index] = todayStat;
    } else {
      stats.push(todayStat);
    }

    saveDailyStats(stats);
  }, [completedToday.length, todaysTasks.length]);

  const weeklyStats = dailyStats.filter((day) => {
    const date = new Date(day.date);
    return date >= startOfWeek && isWeekday(day.date);
  });

  const getCompletedCount = (day: DailyStats) =>
    isToday(day.date) ? completedToday.length : day.completedTasks;

  const getTotalCount = (day: DailyStats) =>
    isToday(day.date) ? todaysTasks.length : day.totalTasks;

  const getRate = (day: DailyStats) =>
    isToday(day.date) ? dailyProgress : day.completionRate;

  const totalCompleted = weeklyStats.reduce(
    (sum, day) => sum + getCompletedCount(day),
    0,
  );

  const weeklyCompletion =
    weeklyStats.length > 0
      ? weeklyStats.reduce((sum, day) => sum + getRate(day), 0) /
        weeklyStats.length
      : 0;

  const getDayLabel = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const chartData = useMemo(() => {
    const weekDays = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return weekDays.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const existingData = weeklyStats.find((d) => {
        const storedDate = new Date(d.date);
        const storedYear = storedDate.getFullYear();
        const storedMonth = String(storedDate.getMonth() + 1).padStart(2, "0");
        const storedDay = String(storedDate.getDate()).padStart(2, "0");
        const storedDateStr = `${storedYear}-${storedMonth}-${storedDay}`;

        return storedDateStr === dateStr;
      });

      const rate = existingData ? getRate(existingData) : 0;
      const completed = existingData ? getCompletedCount(existingData) : 0;
      const total = existingData ? getTotalCount(existingData) : 0;

      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
      const todayDay = String(today.getDate()).padStart(2, "0");
      const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
      const isTodayDate = dateStr === todayStr;

      return {
        date: dateStr,
        dayLabel: getDayLabel(date),
        rate,
        completed,
        total,
        isTodayDate,
        hasData: !!existingData,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyStats, startOfWeek]);

  const completedCount = state.myTools[0].subItems.filter(
    (item) => item.completed,
  ).length;

  const totalLiters = completedCount * 1.5;
  const maxRate = Math.max(...chartData.map((d) => d.rate), 100);

  return (
    <div className="space-y-6 bg-white dark:bg-slate-950 min-h-screen pt-5 pb-20 px-4 transition-colors">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-2 shadow-lg">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Manage app preferences and track your productivity</p>
        </div>
      </div>

      {/* Theme Appearance Mode Card */}
      <div className="bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Appearance Theme</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Choose how Discipline looks to you. Select a light, dark, or system preference.
        </p>

        {mounted ? (
          <div className="grid grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                theme === "light"
                  ? "bg-white dark:bg-slate-800 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md text-indigo-600 dark:text-indigo-400"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700"
              }`}
            >
              <Sun className={`w-6 h-6 mb-1.5 ${theme === "light" ? "text-amber-500" : "text-gray-400 dark:text-slate-500"}`} />
              <span className="text-xs font-semibold">Light</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                theme === "dark"
                  ? "bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md text-indigo-400"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700"
              }`}
            >
              <Moon className={`w-6 h-6 mb-1.5 ${theme === "dark" ? "text-indigo-400" : "text-gray-400 dark:text-slate-500"}`} />
              <span className="text-xs font-semibold">Dark</span>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                theme === "system"
                  ? "bg-white dark:bg-slate-800 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md text-indigo-600 dark:text-indigo-400"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700"
              }`}
            >
              <Laptop className={`w-6 h-6 mb-1.5 ${theme === "system" ? "text-blue-500" : "text-gray-400 dark:text-slate-500"}`} />
              <span className="text-xs font-semibold">System</span>
            </button>
          </div>
        ) : (
          <div className="h-16 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400">TODAY</div>
            <div
              className={`text-xs font-semibold ${
                dailyProgress === 100
                  ? "text-emerald-600 dark:text-emerald-400"
                  : dailyProgress >= 70
                    ? "text-blue-600 dark:text-blue-400"
                    : dailyProgress >= 40
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-600 dark:text-slate-400"
              }`}
            >
              {Math.round(dailyProgress)}%
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {completedToday.length}/{todaysTasks.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Tasks completed</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400">STREAK</div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {weeklyStats.filter((d) => getRate(d) === 100).length} days
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {weeklyStats.filter((d) => getRate(d) === 100).length}/
            {weeklyStats.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Perfect days</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400">WEEK</div>
            <div
              className={`text-xs font-semibold ${
                weeklyCompletion > 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : weeklyCompletion > 60
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-400"
              }`}
            >
              {Math.round(weeklyCompletion)}%
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {totalCompleted}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Tasks completed</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400">AVG</div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Daily</div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {totalLiters}L
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Completion</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800 rounded-2xl py-4">
        <div className="text-sm font-semibold px-4 text-gray-900 dark:text-white">
          Weekly Performance
        </div>

        <div className="rounded-xl py-4 px-2">
          <div className="flex justify-between h-28">
            {chartData.map((day) => {
              const barHeight = (day.rate / maxRate) * 80;

              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`text-xs mb-2 ${
                      day.isTodayDate ? "text-blue-500 dark:text-blue-400 font-semibold" : "text-gray-400 dark:text-slate-500"
                    }`}
                  >
                    {day.dayLabel}
                  </div>

                  <div className="relative w-8 flex flex-col items-center justify-end h-full">
                    <div className="relative h-32 w-8 flex items-end">
                      <div
                        className={`w-8 rounded-lg absolute bottom-0 ${
                          day.hasData ? "bg-gray-200 dark:bg-slate-800" : "bg-gray-100 dark:bg-slate-800/50"
                        }`}
                        style={{ height: "80px" }}
                      ></div>
                      {day.hasData && (
                        <div
                          className={`w-8 absolute bottom-0 transition-all duration-500 ${
                            barHeight >= 79.5 ? "rounded-lg" : "rounded-b-lg"
                          } ${
                            day.isTodayDate
                              ? "bg-gradient-to-b from-blue-500 to-cyan-500"
                              : "bg-gradient-to-b from-gray-400 to-gray-300 dark:from-slate-600 dark:to-slate-700"
                          }`}
                          style={{
                            height: `${barHeight}px`,
                          }}
                        />
                      )}
                    </div>

                    <div className="mt-2 text-xs font-medium text-gray-700 dark:text-slate-300">
                      {day.hasData ? `${Math.round(day.rate)}%` : "-%"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Quick Stats</div>
          <Clock className="h-4 w-4 text-gray-400 dark:text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 rounded-xl p-3">
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Best Day</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {weeklyStats.length > 0
                ? Math.max(...weeklyStats.map((d) => getRate(d))).toFixed(0) +
                  "%"
                : "--%"}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 rounded-xl p-3">
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Avg Time/Day</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {Math.round(todaysTasks.length * 0.5)}h
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 rounded-xl p-3">
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Week Success Rate</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {totalCompleted}/{totalTasks}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 rounded-xl p-3">
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">Current Week</div>
            <div className="font-medium text-gray-900 dark:text-white">
              W{Math.ceil(new Date().getDate() / 7)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
