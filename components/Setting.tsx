import React, { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Calendar, Trophy, Clock } from "lucide-react";

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
    0
  );

  const weeklyCompletion =
    weeklyStats.length > 0
      ? weeklyStats.reduce((sum, day) => sum + getRate(day), 0) /
        weeklyStats.length
      : 0;

  const calculateStreak = () => {
    let streak = 0;
    const sorted = [...weeklyStats].reverse();
    for (const day of sorted) {
      if (getRate(day) === 100) streak++;
      else break;
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  const recentActivity = weeklyStats.slice(-5);

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-2 shadow-lg">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
          <p className="text-gray-600 mt-1">Track your productivity metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500">TODAY</div>
            <div
              className={`text-xs font-semibold ${
                dailyProgress === 100
                  ? "text-emerald-600"
                  : dailyProgress >= 70
                  ? "text-blue-600"
                  : dailyProgress >= 40
                  ? "text-amber-600"
                  : "text-gray-600"
              }`}
            >
              {Math.round(dailyProgress)}%
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {completedToday.length}/{todaysTasks.length}
          </div>
          <div className="text-xs text-gray-600">Tasks completed</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500">STREAK</div>
            <div className="text-xs font-semibold text-amber-600">
              {currentStreak} days
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {currentStreak}
          </div>
          <div className="text-xs text-gray-600">Perfect days</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500">WEEK</div>
            <div
              className={`text-xs font-semibold ${
                weeklyCompletion > 80
                  ? "text-emerald-600"
                  : weeklyCompletion > 60
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {Math.round(weeklyCompletion)}%
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {totalCompleted}
          </div>
          <div className="text-xs text-gray-600">Tasks completed</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-gray-500">AVG</div>
            <div className="text-xs font-semibold text-blue-600">Daily</div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {Math.round(weeklyCompletion)}%
          </div>
          <div className="text-xs text-gray-600">Completion rate</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900">
            This Week&apos;s Progress
          </div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-US", { month: "short" })}
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">No activity data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...recentActivity].reverse().map((day) => {
              const rate = getRate(day);
              const isTodayDate = isToday(day.date);
              const completed = getCompletedCount(day);
              const total = getTotalCount(day);

              return (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          rate === 100
                            ? "bg-emerald-500"
                            : rate >= 80
                            ? "bg-blue-500"
                            : rate >= 60
                            ? "bg-amber-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          isTodayDate ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </span>
                      {isTodayDate && (
                        <span className="text-xs text-blue-600">• Today</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(rate)}%
                    </span>
                  </div>

                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                        rate === 100
                          ? "bg-emerald-500"
                          : rate >= 80
                          ? "bg-blue-500"
                          : rate >= 60
                          ? "bg-amber-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {completed}/{total} tasks
                    </span>
                    <span>
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900">Quick Stats</div>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Best Day</div>
            <div className="font-medium text-gray-900">
              {weeklyStats.length > 0
                ? Math.max(...weeklyStats.map((d) => getRate(d))).toFixed(0) +
                  "%"
                : "--%"}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Avg Time/Day</div>
            <div className="font-medium text-gray-900">
              {Math.round(todaysTasks.length * 0.5)}h
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Success Rate</div>
            <div className="font-medium text-gray-900">
              {weeklyStats.filter((d) => getRate(d) === 100).length}/
              {weeklyStats.length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Current Week</div>
            <div className="font-medium text-gray-900">
              W{Math.ceil(new Date().getDate() / 7)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
