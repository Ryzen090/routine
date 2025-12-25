import React, { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Target, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <h2 className="text-2xl font-bold text-center text-black">Setting</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`${stat.bgColor} border ${stat.borderColor}`}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col items-center text-center lg:flex-row lg:justify-between">
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

      <Card className="bg-white border">
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
                const rate = getRate(day);

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
                        {getCompletedCount(day)}/{getTotalCount(day)} Tasks
                        completed
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
