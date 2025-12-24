import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Target,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface DailyStats {
  date: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

/* =======================
   Helpers
======================= */

const isWeekday = (date: string) => {
  const day = new Date(date).getDay();
  return day >= 1 && day <= 5; // Mon–Fri
};

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const isToday = (date: string) =>
  new Date(date).toDateString() === new Date().toDateString();

export function Setting() {
  const { state } = useApp();

  /* =======================
     Load stats
  ======================= */

  const getDailyStats = (): DailyStats[] => {
    const saved = localStorage.getItem("dailyTaskStats");
    return saved ? JSON.parse(saved) : [];
  };

  const dailyStats = getDailyStats();
  const startOfWeek = getStartOfWeek();

  /* =======================
     Today progress (LIVE)
  ======================= */

  const todaysTasks = state.tasks.filter((task) => task.recurring);
  const completedToday = todaysTasks.filter((task) => task.completed);

  const dailyProgress =
    todaysTasks.length > 0
      ? (completedToday.length / todaysTasks.length) * 100
      : 0;

  /* =======================
     Weekly stats (Mon–Fri)
  ======================= */

  const weeklyStats = dailyStats.filter((day) => {
    const date = new Date(day.date);
    return date >= startOfWeek && isWeekday(day.date);
  });

  /* 🔧 FIX: include TODAY live data */
  const totalCompleted = weeklyStats.reduce((sum, day) => {
    if (isToday(day.date)) {
      return sum + completedToday.length;
    }
    return sum + day.completedTasks;
  }, 0);

  /* 🔧 FIX: weekly average */
  const weeklyCompletion =
    weeklyStats.length > 0
      ? weeklyStats.reduce((sum, day) => {
          if (isToday(day.date)) {
            return sum + dailyProgress;
          }
          return sum + day.completionRate;
        }, 0) / weeklyStats.length
      : 0;

  /* =======================
     Streak (Mon–Fri)
  ======================= */

  const calculateStreak = () => {
    let streak = 0;
    const sorted = [...weeklyStats].reverse();

    for (const day of sorted) {
      const rate = isToday(day.date) ? dailyProgress : day.completionRate;

      if (rate === 100) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  /* =======================
     Recent Activity
  ======================= */

  const recentActivity = weeklyStats.slice(-5);

  /* =======================
     Stat cards
  ======================= */

  const stats = [
    {
      title: "Weekly Completed",
      value: totalCompleted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Perfect Day Streak",
      value: `${currentStreak} days`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Weekly Average",
      value: `${Math.round(weeklyCompletion)}%`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Today Progress",
      value: `${Math.round(dailyProgress)}%`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="space-y-4 bg-white min-h-screen p-5 pb-20 lg:pb-6">
      <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-black">
        Setting
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`${stat.bgColor} border ${stat.borderColor} shadow-sm`}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col items-center text-center lg:flex-row lg:justify-between lg:text-left">
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-black">
                      {stat.title}
                    </p>
                    <p
                      className={`text-lg lg:text-2xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">This Week Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No activity this week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...recentActivity].reverse().map((day) => {
                const today = isToday(day.date);
                const rate = today ? dailyProgress : day.completionRate;

                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-black">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {today
                          ? `${completedToday.length}/${todaysTasks.length}`
                          : `${day.completedTasks}/${day.totalTasks}`}{" "}
                        Tasks completed
                      </p>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        rate === 100
                          ? "text-green-600"
                          : rate >= 50
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.round(rate)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
