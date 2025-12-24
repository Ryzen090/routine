import React from "react";
import { Task } from "@/types";
import { Clock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const taskBackgroundColors = [
  "bg-orange-100",
  "bg-teal-100",
  "bg-purple-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-pink-100",
  "bg-yellow-100",
  "bg-indigo-100",
];

export function Routine() {
  const { state, dispatch } = useApp();

  const todaysTasks = state.tasks
    .filter((task) => task.recurring)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleTaskToggle = (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };

    dispatch({
      type: "UPDATE_TASK",
      payload: updatedTask,
    });

    // Save daily statistics
    saveDailyStats();

    // Update user stats when task is completed
    if (!task.completed) {
      dispatch({
        type: "UPDATE_STATS",
        payload: {
          totalTasksCompleted: state.userStats.totalTasksCompleted + 1,
        },
      });
    }
  };

  const saveDailyStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const completedTasks = todaysTasks.filter((task) => task.completed).length;
    const totalTasks = todaysTasks.length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Get existing stats
    const existingStats = JSON.parse(
      localStorage.getItem("dailyTaskStats") || "[]"
    );

    // Update or add today's stats
    const todayIndex = existingStats.findIndex(
      (stat: any) => stat.date === today
    );
    const todayStats = {
      date: today,
      completedTasks,
      totalTasks,
      completionRate,
    };

    if (todayIndex >= 0) {
      existingStats[todayIndex] = todayStats;
    } else {
      existingStats.push(todayStats);
    }

    // Keep only last 30 days
    const last30Days = existingStats.slice(-30);
    localStorage.setItem("dailyTaskStats", JSON.stringify(last30Days));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white mb-2">
      <div className="p-2 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg lg:text-xl font-bold flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5 text-blue-600" />
              Today&apos;s Schedule
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">{today}</p>
          </div>
        </div>
      </div>

      <div className="px-2 lg:px-6 space-y-3 lg:space-y-4">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8 lg:py-12 text-gray-500">
            <Clock className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm lg:text-base">No tasks scheduled for today</p>
          </div>
        ) : (
          todaysTasks.map((task, index) => (
            <div
              key={task.id}
              className={`${
                taskBackgroundColors[index % taskBackgroundColors.length]
              } rounded-xl lg:rounded-2xl p-3 lg:p-4 transition-all duration-200 hover:shadow-md ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 lg:gap-4 flex-1">
                  <div className="text-xl lg:text-2xl xl:text-3xl">
                    {task.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        {formatTime(task.startTime)}
                      </span>
                    </div>
                    <h3
                      className={`text-sm lg:text-lg font-semibold truncate ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                    onClick={() => handleTaskToggle(task)}
                  >
                    {task.completed && (
                      <svg
                        className="w-3 h-3 lg:w-4 lg:h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
