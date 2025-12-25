import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckSquare,
  Goal,
  TrendingUp,
  Calculator,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tab = "daily" | "weekly" | "monthly";

export function Discipline() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("daily");

  const monthlyGoals = state.monthlyGoals;

  const toggleSubNote = (noteId: string, subNoteId: string) => {
    dispatch({
      type: "UPDATE_NOTE_SUBNOTE",
      payload: { noteId, subNoteId },
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Trade"];

  // Get today's day name
  const getTodayDayName = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Convert to Monday-Friday format
    const dayMap: Record<number, string> = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
    };

    return dayMap[dayIndex] || "Today";
  };

  const todayDayName = getTodayDayName();

  const updateWeeklyPlan = (day: string, period: string, value: string) => {
    dispatch({
      type: "UPDATE_DAY_PLAN",
      payload: { day, period, value },
    });
  };

  // Calculate total weekly trading sum
  const calculateWeeklyTotal = () => {
    let total = 0;

    days.forEach((day) => {
      const dayData = state.weeklyPlan[day];
      if (dayData && dayData.Trade) {
        const value = parseFloat(dayData.Trade);
        if (!isNaN(value)) {
          total += value;
        }
      }
    });

    return total;
  };

  const weeklyTotal = calculateWeeklyTotal();

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-black">Discipline</h2>
        <p className="text-sm text-gray-600">
          Becoming the best version of myself
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(["daily", "weekly", "monthly"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full text-sm capitalize transition
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "daily" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{note.title}</CardTitle>
                {note.content && (
                  <p className="text-sm text-gray-600">{note.content}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {note.subNotes.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                  >
                    <Checkbox
                      checked={sub.completed}
                      onCheckedChange={() => toggleSubNote(note.id, sub.id)}
                    />
                    <span
                      className={`text-sm ${
                        sub.completed
                          ? "line-through text-gray-400"
                          : "text-black"
                      }`}
                    >
                      {sub.content}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <CheckSquare className="h-3 w-3" />
                  {note.subNotes.filter((s) => s.completed).length} /{" "}
                  {note.subNotes.length} completed
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "weekly" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap">
                  <div>
                    <CardTitle className="text-sm">Weekly Trading</CardTitle>
                    <div className="text-xs text-gray-600">
                      Balance Overview
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xl font-bold ${
                    weeklyTotal < 0
                      ? "text-red-600"
                      : weeklyTotal > 0
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {weeklyTotal < 0 ? "-$" : "$"}
                  {Math.abs(weeklyTotal).toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-gray-200">
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Starting Balance:</span>
                    <span className="font-medium">$10.00</span>
                  </div>

                  <div className="flex justify-between text-xs mb-2">
                    <span>Current Balance:</span>
                    <span
                      className={`font-semibold ${
                        weeklyTotal < 0
                          ? "text-red-600"
                          : weeklyTotal > 0
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      ${(10 + weeklyTotal).toFixed(2)}
                    </span>
                  </div>

                  {/* Net Profit/Loss */}
                  <div className="flex justify-between text-xs font-semibold border-t pt-2">
                    <span>Net P/L:</span>
                    <span
                      className={
                        weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {weeklyTotal >= 0 ? "+" : ""}${weeklyTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Profit/Loss Status */}
                  <div className="mt-3">
                    {weeklyTotal > 0 && (
                      <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <span>📈</span>
                        Profit: +${weeklyTotal.toFixed(2)}
                      </div>
                    )}
                    {weeklyTotal < 0 && (
                      <div className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <span>📉</span>
                        Loss: -${Math.abs(weeklyTotal).toFixed(2)}
                      </div>
                    )}
                    {weeklyTotal === 0 && (
                      <div className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                        No profit or loss
                      </div>
                    )}
                  </div>

                  {/* Balance Breakdown */}
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Balance Breakdown
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Starting Capital:</span>
                        <span className="font-medium">$10.00</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {weeklyTotal >= 0 ? "Profit" : "Loss"}:
                        </span>
                        <span
                          className={`font-medium ${
                            weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {weeklyTotal >= 0 ? "+" : ""}${weeklyTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Return on Capital:
                        </span>
                        <span
                          className={
                            weeklyTotal > 0
                              ? "text-green-600"
                              : weeklyTotal < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {((weeklyTotal / 10) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold border-t pt-2">
                        <span>Total Balance:</span>
                        <span
                          className={
                            10 + weeklyTotal > 10
                              ? "text-green-600"
                              : 10 + weeklyTotal < 10
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          ${(10 + weeklyTotal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`text-center py-2 rounded ${
                  weeklyTotal > 0
                    ? "bg-green-50 text-green-700"
                    : weeklyTotal < 0
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <div className="text-xs font-semibold">
                  {weeklyTotal > 0
                    ? "📈 Profit this week!"
                    : weeklyTotal < 0
                    ? "📉 Loss this week"
                    : " Break even"}
                </div>
                <div className="text-xs mt-1">
                  {weeklyTotal > 0
                    ? `+${((weeklyTotal / 10) * 100).toFixed(1)}% return`
                    : weeklyTotal < 0
                    ? `${((weeklyTotal / 10) * 100).toFixed(1)}% loss`
                    : "0% change"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Today&apos;s Trading ({todayDayName})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {periods.map((period) => (
                <div key={period}>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Enter your trading amount for {todayDayName}:
                  </label>
                  <input
                    key={period}
                    type="number"
                    value={state.weeklyPlan[todayDayName]?.[period] || ""}
                    placeholder={period}
                    onChange={(e) =>
                      updateWeeklyPlan(todayDayName, period, e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-1 text-xs focus:outline-none focus:border"
                  />
                  {state.weeklyPlan[todayDayName]?.Trade && (
                    <div className="text-xs text-gray-600 pt-2 flex justify-between">
                      <span className="font-medium">
                        Amount for {todayDayName}:{" "}
                      </span>
                      {(() => {
                        const amount = parseFloat(
                          state.weeklyPlan[todayDayName]?.Trade || "0"
                        );
                        let colorClass = "text-gray-600";

                        if (amount < 0) {
                          colorClass = "text-red-600";
                        } else if (amount > 0) {
                          colorClass = "text-blue-600";
                        }

                        const formattedAmount =
                          amount < 0
                            ? `-$${Math.abs(amount).toFixed(2)}`
                            : `$${amount.toFixed(2)}`;

                        return (
                          <span className={`${colorClass} font-bold`}>
                            {formattedAmount}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Weekly Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`p-3 rounded-lg ${
                      day === todayDayName
                        ? "bg-blue-50 border-2 border-blue-300"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      {day}
                      {day === todayDayName && (
                        <span className="ml-1 text-xs text-blue-600 font-bold">
                          (Today)
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold">
                      {state.weeklyPlan[day]?.Trade ? (
                        (() => {
                          const tradeAmount = parseFloat(
                            state.weeklyPlan[day]?.Trade || "0"
                          );
                          const isNegative = tradeAmount < 0;
                          const isPositive = tradeAmount > 0;

                          return (
                            <span
                              className={
                                isNegative
                                  ? "text-red-600"
                                  : isPositive
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }
                            >
                              ${tradeAmount.toFixed(2)}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400">Not entered</span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="bg-blue-100 p-3 rounded-lg col-span-2 md:col-span-5 border border-blue-300">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-800">
                      Weekly Total
                    </div>
                    <div className="text-xl font-bold text-blue-700">
                      ${weeklyTotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>
                      Daily Average: ${(weeklyTotal / days.length).toFixed(2)}
                    </span>
                    <span>
                      Days Filled:{" "}
                      {
                        days.filter((day) => state.weeklyPlan[day]?.Trade)
                          .length
                      }
                      /{days.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "monthly" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                <div className="flex items-center gap-2">
                  <Goal className="h-6 w-6" />
                  <p>Monthly Goals</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyGoals.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Discipline;
