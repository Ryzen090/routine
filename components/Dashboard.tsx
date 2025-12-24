import React from "react";
import { Quotes } from "./Quotes";
import { MyTools } from "./MyTools";
import { Routine } from "./Routine";
import { useApp } from "@/contexts/AppContext";

export function Dashboard() {
  const { state } = useApp();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const todaysTasks = state.tasks.filter(
    (task) => task.recurring || task.id === state.selectedDate
  );

  const completedTasks = todaysTasks.filter((task) => task.completed);

  const completionRate =
    todaysTasks.length > 0
      ? (completedTasks.length / todaysTasks.length) * 100
      : 0;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen pt-6 pb-20 px-4 lg:px-0">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-1">
              Good Morning!
            </h2>
            <p className="text-blue-100 text-sm lg:text-base">{today}</p>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-3xl lg:text-4xl font-extrabold">
              {Math.round(completionRate)}%
            </div>
            <p className="text-blue-100 text-xs lg:text-sm">Daily Progress</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-white transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Quotes */}
      <section className="rounded-xl bg-white p-3 shadow-sm">
        <Quotes />
      </section>

      {/* My Tools */}
      <section className="rounded-xl bg-white p-3 shadow-sm">
        <MyTools />
      </section>

      {/* Routine (PRIMARY) */}
      <section className="rounded-xl bg-white p-1 shadow-sm border border-blue-100">
        <Routine />
      </section>
    </div>
  );
}
