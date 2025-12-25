import React from "react";
import {
  Wallet,
  PieChart,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function Financial() {
  const { state } = useApp();
  const todaysPayments = state.payments;

  const todaysIncome = todaysPayments
    .filter((p) => p.type === "income")
    .reduce((sum, p) => sum + p.amount, 0);

  const todaysExpenses = todaysPayments
    .filter((p) => p.type === "expense")
    .reduce((sum, p) => sum + p.amount, 0);

  const todaysBalance = todaysIncome - todaysExpenses;

  const incomeCount = todaysPayments.filter((p) => p.type === "income").length;
  const expenseCount = todaysPayments.filter(
    (p) => p.type === "expense"
  ).length;

  const expenseCategories = todaysPayments
    .filter((p) => p.type === "expense")
    .map((p) => ({
      name: p.title,
      amount: p.amount,
      percentage: (p.amount / todaysExpenses) * 100,
      icon: p.icon,
    }));

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-2 shadow-lg">
          <Wallet className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Financial Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Track your daily income and expenses
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-emerald-600">INCOME</div>
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">
            ${todaysIncome.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">
            {incomeCount} transaction{incomeCount !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-red-600">EXPENSES</div>
            <div className="p-1.5 bg-red-100 rounded-lg">
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">
            ${todaysExpenses.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">
            {expenseCount} transaction{expenseCount !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-blue-600">BALANCE</div>
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <TrendingUp className="h-3 w-3 text-blue-600" />
            </div>
          </div>
          <div
            className={`text-xl font-bold mb-1 ${
              todaysBalance >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ${todaysBalance.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Net amount today</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-purple-600">TOTAL</div>
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <CreditCard className="h-3 w-3 text-purple-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">
            {todaysPayments.length}
          </div>
          <div className="text-xs text-gray-600">All transactions</div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900">
            Financial Breakdown
          </div>
          <PieChart className="h-4 w-4 text-gray-400" />
        </div>

        <div className="space-y-4">
          {/* Income Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Income</span>
              <span className="font-medium text-emerald-600">
                ${todaysIncome.toFixed(2)}
              </span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${todaysIncome > 0 ? "100%" : "0%"}`,
                }}
              ></div>
            </div>
          </div>

          {/* Expenses Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Expenses</span>
              <span className="font-medium text-red-600">
                ${todaysExpenses.toFixed(2)}
              </span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-500"
                style={{
                  width: `${todaysExpenses > 0 ? "100%" : "0%"}`,
                }}
              ></div>
            </div>
          </div>

          {/* Balance Indicator */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Net Balance</span>
              <div
                className={`text-sm font-semibold ${
                  todaysBalance >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                ${todaysBalance.toFixed(2)}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {todaysBalance >= 0 ? "Positive cash flow" : "Negative cash flow"}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold text-gray-900">
            All Transactions
          </h3>
        </div>

        {todaysPayments.length === 0 ? (
          <div className="text-center py-8 bg-white border border-gray-200 rounded-2xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">No transactions recorded</p>
            <p className="text-xs text-gray-500 mt-1">
              Add transactions to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`p-3 rounded-xl ${
                      payment.type === "income"
                        ? "bg-emerald-100"
                        : "bg-red-100"
                    }`}
                  >
                    <span className="text-lg">{payment.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {payment.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          payment.type === "income"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {payment.type} •{" "}
                        {payment.type === "income" ? "Monthly" : "Fixed"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-base font-semibold ${
                      payment.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.type === "income" ? "+" : "-"}$
                    {payment.amount.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {payment.type === "income" ? "Income" : "Expense"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Daily Summary</div>
            <div className="text-xs text-gray-600">Cash flow overview</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Income/Expense Ratio</span>
            <span className="text-sm font-medium text-gray-900">
              {todaysIncome > 0
                ? ((todaysExpenses / todaysIncome) * 100).toFixed(1) + "%"
                : "0%"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Savings Rate</span>
            <span
              className={`text-sm font-medium ${
                todaysBalance > 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {todaysIncome > 0
                ? ((todaysBalance / todaysIncome) * 100).toFixed(1) + "%"
                : "0%"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Largest Expense</span>
            <span className="text-sm font-medium text-red-600">
              {expenseCategories.length > 0
                ? expenseCategories.reduce((max, cat) =>
                    cat.amount > max.amount ? cat : max
                  ).name
                : "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
