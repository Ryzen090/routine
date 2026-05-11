import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Goal, Calendar, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tab = "daily" | "trade";

interface Week {
  number: number;
  start: Date;
  end: Date;
  isCurrentMonth: boolean;
}

interface CycleMonth {
  month: number;
  year: number;
  startDate: Date;
  endDate: Date;
}

export function Metrics() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = React.useState<Tab>("daily");

  const getCurrentCycleMonth = (): CycleMonth => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (currentDay >= 26) {
      return {
        month: currentMonth + 1,
        year: currentYear,
        startDate: new Date(currentYear, currentMonth, 26),
        endDate: new Date(currentYear, currentMonth + 1, 25),
      };
    } else {
      return {
        month: currentMonth,
        year: currentYear,
        startDate: new Date(currentYear, currentMonth - 1, 26),
        endDate: new Date(currentYear, currentMonth, 25),
      };
    }
  };

  const currentCycle = getCurrentCycleMonth();
  const [currentMonth, setCurrentMonth] = React.useState(currentCycle.month);
  const [currentYear, setCurrentYear] = React.useState(currentCycle.year);

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

  const getWeekNumber = (date = new Date()) => {
    const now = new Date(date);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getCurrentWeekNumber = () => {
    return getWeekNumber().toString();
  };

  const currentWeekNumber = getCurrentWeekNumber();

  const updateWeeklyTrade = (
    weekNumber: string,
    day: string,
    value: string,
  ) => {
    dispatch({
      type: "UPDATE_WEEKLY_TRADE",
      payload: {
        weekNumber,
        day,
        value,
      },
    });
  };

  const getCurrentWeekTradeData = () => {
    return state.weeklyTrades[currentWeekNumber] || {};
  };

  const currentWeekData = getCurrentWeekTradeData();

  const calculateWeeklyTotal = (weekData?: Record<string, string>) => {
    let total = 0;
    const data = weekData || currentWeekData;

    days.forEach((day) => {
      const dayData = data[day];
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

  const getCycleMonthRange = (month: number, year: number): CycleMonth => {
    const startDate = new Date(year, month - 1, 26);
    const endDate = new Date(year, month, 25);

    return {
      month,
      year,
      startDate,
      endDate,
    };
  };

  const getWeeksInCycle = (month: number, year: number): Week[] => {
    const weeks: Week[] = [];
    const cycle = getCycleMonthRange(month, year);
    const firstDay = cycle.startDate;
    const lastDay = cycle.endDate;

    let currentWeekStart = new Date(firstDay);
    while (currentWeekStart.getDay() !== 1) {
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    }

    if (currentWeekStart > lastDay) {
      return weeks;
    }

    while (currentWeekStart <= lastDay) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekNumber = getWeekNumber(currentWeekStart);

      weeks.push({
        number: weekNumber,
        start: new Date(currentWeekStart),
        end: new Date(weekEnd),
        isCurrentMonth: true,
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
  };

  const weeksInCurrentMonth = getWeeksInCycle(currentMonth, currentYear);

  const getWeekData = (weekNumber: string) => {
    return state.weeklyTrades[weekNumber] || {};
  };

  const calculateMonthlyTotal = () => {
    let total = 0;
    const cycle = getCycleMonthRange(currentMonth, currentYear);

    weeksInCurrentMonth.forEach((week) => {
      const weekData = getWeekData(week.number.toString());
      days.forEach((day) => {
        const dayValue = weekData[day];
        if (dayValue) {
          const dayIndex = days.indexOf(day);
          const weekStart = new Date(week.start);
          const currentDate = new Date(weekStart);
          currentDate.setDate(weekStart.getDate() + dayIndex);

          if (currentDate >= cycle.startDate && currentDate <= cycle.endDate) {
            const value = parseFloat(dayValue);
            if (!isNaN(value)) {
              total += value;
            }
          }
        }
      });
    });
    return total;
  };

  const monthlyTotal = calculateMonthlyTotal();
  const totalBalance = 15 + monthlyTotal;

  const resetToCurrentMonth = () => {
    const newCycle = getCurrentCycleMonth();
    setCurrentMonth(newCycle.month);
    setCurrentYear(newCycle.year);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getCycleDisplayName = () => {
    const cycle = getCycleMonthRange(currentMonth, currentYear);
    const startMonth = monthNames[cycle.startDate.getMonth()];
    const endMonth = monthNames[cycle.endDate.getMonth()];
    return `${startMonth} 26 - ${endMonth} 25`;
  };

  const isDateInCycle = (date: Date) => {
    const cycle = getCycleMonthRange(currentMonth, currentYear);
    return date >= cycle.startDate && date <= cycle.endDate;
  };

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
            {(["daily", "trade"] as Tab[]).map((tab, index) => (
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
                  {tab === "daily" && <Target className="w-4 h-4" />}
                  {tab === "trade" && <TrendingUp className="w-4 h-4" />}
                  {tab}
                  {activeTab === tab && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  )}
                </span>
                {index < 3 && activeTab !== tab && (
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
                    className="flex gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50/80 hover:border-gray-200 transition-all duration-200 group/item"
                  >
                    <div
                      onClick={() => toggleSubNote(note.id, sub.id)}
                      className="relative flex-shrink-0 cursor-pointer"
                    >
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

                    <div className="flex-1 flex flex-col">
                      <span
                        onClick={() => toggleSubNote(note.id, sub.id)}
                        className={`
                                    text-sm font-medium cursor-pointer transition-all duration-300 capitalize
                                    ${
                                      sub.completed
                                        ? "text-gray-400 line-through"
                                        : "text-gray-700 group-hover/item:text-gray-900"
                                    }
                                  `}
                      >
                        {sub.content}
                      </span>

                      {sub.description && sub.description.length > 0 && (
                        <ul className="mt-2 space-y-1 pointer-events-none">
                          {sub.description.map((item, index) => (
                            <li
                              key={index}
                              className={`
                                          text-[11px] flex items-start gap-1
                                          ${sub.completed ? "text-gray-300" : "text-gray-500"}
                                        `}
                            >
                              <span className="mt-[4px] w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {sub.completed && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-2" />
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
                    <CardTitle className="text-sm">Monthly Trading</CardTitle>
                    <div className="text-xs text-gray-600">
                      {getCycleDisplayName()}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xl font-bold ${
                    totalBalance < 0
                      ? "text-red-600"
                      : totalBalance > 0
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  ${totalBalance.toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-gray-200">
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Starting Balance:</span>
                    <span className="font-medium">$15.00</span>
                  </div>

                  <div className="flex justify-between text-xs mb-2">
                    <span>Current Balance:</span>
                    <span
                      className={`font-semibold ${
                        totalBalance < 15
                          ? "text-red-600"
                          : totalBalance > 15
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    >
                      ${totalBalance.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold border-t pt-2">
                    <span>Monthly P/L:</span>
                    <span
                      className={
                        monthlyTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      ${Math.abs(monthlyTotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold border-t pt-2 mt-2">
                    <span>This Week P/L :</span>
                    <span
                      className={
                        weeklyTotal >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      ${Math.abs(weeklyTotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3">
                    {monthlyTotal > 0 && (
                      <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        Monthly Profit: ${monthlyTotal.toFixed(2)}
                      </div>
                    )}
                    {monthlyTotal < 0 && (
                      <div className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        Monthly Loss: ${Math.abs(monthlyTotal).toFixed(2)}
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
                        <span className="font-medium">$15.00</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            monthlyTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {monthlyTotal >= 0
                            ? "Monthly Profit"
                            : "Monthly Loss"}
                          :
                        </span>
                        <span
                          className={`font-medium ${
                            monthlyTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${Math.abs(monthlyTotal).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            monthlyTotal >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Return on Capital:
                        </span>
                        <span
                          className={
                            monthlyTotal > 0
                              ? "text-green-600"
                              : monthlyTotal < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }
                        >
                          {Math.abs((monthlyTotal / 15) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold border-t pt-2">
                        <span>Total Balance:</span>
                        <span
                          className={
                            totalBalance > 15
                              ? "text-green-600"
                              : totalBalance < 15
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
                  monthlyTotal > 0
                    ? "bg-green-50 text-green-700"
                    : monthlyTotal < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-gray-700"
                }`}
              >
                <div className="text-xs font-semibold">
                  {monthlyTotal > 0
                    ? `📈 Profitable month!`
                    : monthlyTotal < 0
                      ? `📉 Losing month!`
                      : `Break Even`}
                </div>
                <div className="text-xs mt-1">
                  {monthlyTotal > 0
                    ? `${Math.abs((monthlyTotal / 15) * 100).toFixed(1)}% Return`
                    : monthlyTotal < 0
                      ? `${Math.abs((monthlyTotal / 15) * 100).toFixed(1)}% Loss`
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-600">
                      Enter your trading amount for {todayDayName} :
                    </label>
                  </div>
                  <input
                    key={period}
                    type="number"
                    step="0.01"
                    value={currentWeekData[todayDayName] || ""}
                    placeholder="Enter amount (e.g., 5.50)"
                    onChange={(e) =>
                      updateWeeklyTrade(
                        currentWeekNumber,
                        todayDayName,
                        e.target.value,
                      )
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {currentWeekData[todayDayName] && (
                    <div className="text-xs text-gray-600 pt-2 flex justify-between">
                      <span className="font-medium">Amount Today : </span>
                      {(() => {
                        const amount = parseFloat(
                          currentWeekData[todayDayName] || "0",
                        );
                        let colorClass = "text-gray-600";

                        if (amount < 0) {
                          colorClass = "text-red-600";
                        } else if (amount > 0) {
                          colorClass = "text-green-600";
                        }

                        const formattedAmount =
                          amount < 0
                            ? `$${Math.abs(amount).toFixed(2)}`
                            : `$${amount.toFixed(2)}`;

                        return (
                          <span className={`${colorClass} font-bold`}>
                            {formattedAmount}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                  {currentWeekData[todayDayName] && (
                    <div className="text-xs pt-1 flex justify-between">
                      <span className="text-gray-600">Target Progress:</span>
                      {(() => {
                        const amount = parseFloat(
                          currentWeekData[todayDayName] || "0",
                        );
                        const target = 5;
                        const percentage = (amount / target) * 100;
                        const remaining = target - amount;

                        if (amount >= target) {
                          return (
                            <span className="text-green-600 font-medium">
                              ✓ Target (+${(amount - target).toFixed(2)} Over)
                            </span>
                          );
                        } else if (amount > 0) {
                          return (
                            <span className="text-orange-600 font-medium">
                              ${remaining.toFixed(2)} ({percentage.toFixed(0)}%)
                            </span>
                          );
                        } else if (amount < 0) {
                          return (
                            <span className="text-red-600 font-medium">
                              ${Math.abs(amount).toFixed(2)} Loss
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">
                    Monthly Trading Overview
                  </CardTitle>
                  <div className="text-xs text-gray-600">
                    {getCycleDisplayName()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetToCurrentMonth}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    Current
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {weeksInCurrentMonth.map((week, index) => {
                    const weekData = getWeekData(week.number.toString());
                    const isCurrentWeek =
                      week.number.toString() === currentWeekNumber;

                    const dayAmounts = days.map((day, dayIndex) => {
                      const weekStart = new Date(week.start);
                      const currentDate = new Date(weekStart);
                      currentDate.setDate(weekStart.getDate() + dayIndex);
                      const amount = weekData[day]
                        ? parseFloat(weekData[day])
                        : null;
                      const isInCycle = isDateInCycle(currentDate);

                      return {
                        day,
                        amount,
                        isInCycle,
                        date: currentDate,
                      };
                    });

                    const weekTotal = dayAmounts.reduce(
                      (total, { amount, isInCycle }) => {
                        if (isInCycle && amount !== null && !isNaN(amount)) {
                          return total + amount;
                        }
                        return total;
                      },
                      0,
                    );

                    return (
                      <div
                        key={week.number}
                        className={`p-4 rounded-xl border ${
                          isCurrentWeek
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xs text-gray-500">
                              {week.start.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              -{" "}
                              {week.end.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Daily Summary:
                            </div>
                          </div>
                          <div
                            className={`text-lg font-bold ${
                              weekTotal >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            ${Math.abs(weekTotal).toFixed(2)}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="grid grid-cols-5 gap-2">
                            {dayAmounts.map(
                              ({ day, amount, isInCycle, date }) => (
                                <div key={day} className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">
                                    {day.slice(0, 1)}
                                  </div>
                                  <div
                                    className={`h-10 rounded-lg flex items-center justify-center text-xs border ${
                                      !isInCycle
                                        ? "text-gray-300 bg-gray-100 border-gray-200 opacity-50"
                                        : amount === null
                                          ? "text-gray-400 bg-gray-50"
                                          : amount > 0
                                            ? "text-green-600 bg-green-50 border-green-200"
                                            : amount < 0
                                              ? "text-red-600 bg-red-50 border-red-200"
                                              : "text-gray-600 bg-gray-50"
                                    }`}
                                    title={
                                      !isInCycle
                                        ? `Not in ${getCycleDisplayName()}`
                                        : ""
                                    }
                                  >
                                    {!isInCycle
                                      ? "✗"
                                      : amount === null
                                        ? "-"
                                        : amount > 0
                                          ? `${amount.toFixed(2)}`
                                          : amount < 0
                                            ? `${Math.abs(amount).toFixed(2)}`
                                            : "0.00"}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">
                              Target avg:
                            </span>
                            <span className="text-xs text-gray-600">$25</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Metrics;
