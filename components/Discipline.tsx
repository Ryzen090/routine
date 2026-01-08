import React from "react";
import { Goal, Calendar } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tab = "daily" | "trade" | "monthly";

export function Discipline() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = React.useState<Tab>("trade");

  const monthlyGoals = state.monthlyGoals;

  const toggleSubNote = (noteId: string, subNoteId: string) => {
    dispatch({
      type: "UPDATE_NOTE_SUBNOTE",
      payload: { noteId, subNoteId },
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Trade"];

  const getTodayDayName = () => {
    const today = new Date();
    const dayIndex = today.getDay();

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

  const getWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const currentWeekNumber = getWeekNumber().toString();

  const updateWeeklyTrade = (day: string, value: string) => {
    dispatch({
      type: "UPDATE_WEEKLY_TRADE",
      payload: {
        weekNumber: currentWeekNumber,
        day,
        value,
      },
    });
  };

  const getCurrentWeekTradeData = () => {
    return state.weeklyTrades[currentWeekNumber] || {};
  };

  const currentWeekData = getCurrentWeekTradeData();

  const calculateWeeklyTotal = () => {
    let total = 0;

    days.forEach((day) => {
      const dayData = currentWeekData[day];
      if (dayData) {
        const value = parseFloat(dayData);
        if (!isNaN(value)) {
          total += value;
        }
      }
    });

    return total;
  };

  const weeklyTotal = calculateWeeklyTotal();

  const calculateAllWeeksTotal = () => {
    let allWeeksTotal = 0;
    Object.keys(state.weeklyTrades).forEach((week) => {
      const weekData = state.weeklyTrades[week];
      days.forEach((day) => {
        const dayValue = parseFloat(weekData?.[day] || "0");
        if (!isNaN(dayValue)) {
          allWeeksTotal += dayValue;
        }
      });
    });
    return allWeeksTotal;
  };

  const allWeeksTotal = calculateAllWeeksTotal();
  const totalBalance = 10 + allWeeksTotal;

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-2 shadow-lg">
            <Goal className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discipline</h2>
            <p className="text-gray-600 mt-1">
              Becoming the best version of myself
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center bg-gray-50 rounded-xl p-1.5">
            {(["daily", "trade", "monthly"] as Tab[]).map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "text-gray-900 bg-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="capitalize flex items-center gap-2">
                  {tab}
                  {activeTab === tab && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  )}
                </span>
                {index < 2 && activeTab !== tab && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-gray-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "daily" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.notes.map((note) => (
            <div
              key={note.id}
              className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200/60 p-5 hover:border-gray-300/80 transition-all duration-300"
            >
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>

              <div className="pr-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {note.title}
                </h3>
                {note.content && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {note.content}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {note.subNotes.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubNote(note.id, sub.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50/80 hover:border-gray-200 transition-all duration-200 cursor-pointer group/item"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`
                          w-5 h-5 rounded-lg border-2 flex items-center justify-center
                          transition-all duration-300 ease-out
                          ${
                            sub.completed
                              ? "border-emerald-500 bg-emerald-500 scale-110"
                              : "border-gray-300 group-hover/item:border-gray-400"
                          }
                        `}
                      >
                        {sub.completed && (
                          <svg
                            className="w-3 h-3 text-white animate-pop"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span
                      className={`
                        text-sm font-medium flex-1 transition-all duration-300 capitalize
                        ${
                          sub.completed
                            ? "text-gray-400"
                            : "text-gray-700 group-hover/item:text-gray-900"
                        }
                      `}
                    >
                      {sub.content}
                    </span>

                    {sub.completed && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "trade" && (
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
                    allWeeksTotal < 0
                      ? "text-red-600"
                      : allWeeksTotal > 0
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {allWeeksTotal < 0 ? "-$" : "$"}
                  {Math.abs(totalBalance).toFixed(2)}
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
                        totalBalance < 10
                          ? "text-red-600"
                          : totalBalance > 10
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      ${totalBalance.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold border-t pt-2">
                    <span>Net P/L:</span>
                    <span
                      className={
                        allWeeksTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {allWeeksTotal >= 0 ? "+" : ""}${allWeeksTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold border-t pt-2 mt-2">
                    <span>This Week P/L :</span>
                    <span
                      className={
                        weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {weeklyTotal >= 0 ? "+" : ""}${weeklyTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3">
                    {weeklyTotal > 0 && (
                      <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        Profit: +${weeklyTotal.toFixed(2)}
                      </div>
                    )}
                    {weeklyTotal < 0 && (
                      <div className="text-xs text-red-600 font-semibold flex items-center gap-1">
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
                            allWeeksTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {allWeeksTotal >= 0 ? "Profit" : "Loss"}:
                        </span>
                        <span
                          className={`font-medium ${
                            allWeeksTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {allWeeksTotal >= 0 ? "+" : ""}$
                          {allWeeksTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            allWeeksTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Return on Capital:
                        </span>
                        <span
                          className={
                            allWeeksTotal > 0
                              ? "text-green-600"
                              : allWeeksTotal < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {((allWeeksTotal / 10) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold border-t pt-2">
                        <span>Total Balance:</span>
                        <span
                          className={
                            totalBalance > 10
                              ? "text-green-600"
                              : totalBalance < 10
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          ${totalBalance.toFixed(2)}
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
                    ? `📈 Profit this week!`
                    : weeklyTotal < 0
                    ? `📉 Loss this week!`
                    : `Break Even`}
                </div>
                <div className="text-xs mt-1">
                  {weeklyTotal > 0
                    ? `+${((weeklyTotal / 10) * 100).toFixed(1)}% Return`
                    : weeklyTotal < 0
                    ? `${((weeklyTotal / 10) * 100).toFixed(1)}% Loss`
                    : "0% Change"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Today&apos;s Trading {todayDayName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {periods.map((period) => (
                <div key={period}>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Enter your trading amount for {todayDayName} :
                  </label>
                  <input
                    key={period}
                    type="number"
                    step="0.01"
                    value={currentWeekData[todayDayName] || ""}
                    placeholder="Enter amount (e.g., 5.50)"
                    onChange={(e) =>
                      updateWeeklyTrade(todayDayName, e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {currentWeekData[todayDayName] && (
                    <div className="text-xs text-gray-600 pt-2 flex justify-between">
                      <span className="font-medium">Amount Today : </span>
                      {(() => {
                        const amount = parseFloat(
                          currentWeekData[todayDayName] || "0"
                        );
                        let colorClass = "text-gray-600";

                        if (amount < 0) {
                          colorClass = "text-red-600";
                        } else if (amount > 0) {
                          colorClass = "text-green-600";
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
                <Calendar className="h-4 w-4" />
                All Weeks Overview
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
                      {currentWeekData[day] ? (
                        (() => {
                          const tradeAmount = parseFloat(currentWeekData[day]);
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
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        Weekly Total
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>
                          Daily Average:{" "}
                          {((allWeeksTotal / 10) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        weeklyTotal > 0
                          ? "text-green-600"
                          : weeklyTotal < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {Math.abs(weeklyTotal).toFixed(2)}$
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "monthly" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {monthlyGoals.map((goal, index) => (
              <div
                key={goal.id}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  goal.completed
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="p-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "TOGGLE_GOAL_COMPLETION",
                            payload: goal.id,
                          })
                        }
                        className="flex-shrink-0"
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                            goal.completed
                              ? "bg-gradient-to-br from-green-500 to-emerald-600"
                              : "bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200"
                          }`}
                        >
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div>
                        <div
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            goal.completed
                              ? "text-green-600"
                              : "text-purple-600"
                          }`}
                        >
                          Goal #{index + 1}
                        </div>
                        <h3
                          className={`text-sm mt-1 ${
                            goal.completed ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {goal.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Goal className="h-5 w-5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Goal className="h-5 w-5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Active Goals
                      </div>
                      <div className="text-xs text-gray-600">
                        {monthlyGoals.filter((g) => g.completed).length} of{" "}
                        {monthlyGoals.length} completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                      {Math.round(
                        (monthlyGoals.filter((g) => g.completed).length /
                          monthlyGoals.length) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">
                      Trading Weeks
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {Object.keys(state.weeklyTrades).length} weeks
                    </div>
                    <div className="text-xs text-gray-500">Data recorded</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">
                      Days Remaining
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ~15 days
                    </div>
                    <div className="text-xs text-gray-500">Until month end</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Discipline;
