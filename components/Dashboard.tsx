import React from "react";
import { Quotes } from "./Quotes";
import { MyTools } from "./MyTools";
import { Routine } from "./Routine";
import { useApp } from "@/contexts/AppContext";
import { getProgressCircleColor } from "@/lib/helper";

export function Dashboard() {
  const { state } = useApp();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const todaysTasks = state.tasks.filter(
    (task) => task.recurring || task.id === state.selectedDate,
  );

  const completedTasks = todaysTasks.filter((task) => task.completed);

  const completionRate =
    todaysTasks.length > 0
      ? (completedTasks.length / todaysTasks.length) * 100
      : 0;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen pt-6 pb-20 px-4 lg:px-0">
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-gray-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-pink-50 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour < 12) return "Good morning";
                  if (hour < 18) return "Good afternoon";
                  return "Good evening";
                })()}
              </h1>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{today}</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-14 h-14">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={getProgressCircleColor(completionRate)}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - completionRate / 100)}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">
                    {Math.round(completionRate)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-gray-900">
                Daily Progress
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold">{Math.round(completionRate)}%</span>
              </div>
            </div>

            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${completionRate}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
              </div>

              <div className="flex justify-between mt-2">
                {[0, 25, 50, 75, 100].map((point) => (
                  <div
                    key={point}
                    className="relative flex flex-col items-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mb-1 ${
                        completionRate >= point
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500">{point}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation & Tools */}
      <div className="space-y-4">
        <Quotes />
      </div>

      {/* My Tools */}
      {/* <section className="rounded-xl bg-white shadow-sm">
        <MyTools />
      </section> */}

      {/* Routine (PRIMARY) */}
      <section className="rounded-xl bg-white p-1 shadow-sm border border-blue-100">
        <Routine />
      </section>
    </div>
  );
}
