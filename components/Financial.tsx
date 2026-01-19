import {
  Wallet,
  PieChart,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { buildTradingTransactions } from "@/lib/helper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Financial() {
  const { state } = useApp();
  const tradingTransactions = buildTradingTransactions(state.weeklyTrades);
  const allTransactions = [...state.payments, ...tradingTransactions];

  const mergedTransactions = allTransactions.reduce(
    (acc, curr) => {
      const existing = acc.find(
        (t) => t.title === curr.title && t.type === curr.type,
      );

      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ ...curr });
      }

      return acc;
    },
    [] as typeof allTransactions,
  );

  const incomeCount = mergedTransactions.filter(
    (p) => p.type === "income",
  ).length;
  const expenseCount = mergedTransactions.filter(
    (p) => p.type === "expense",
  ).length;

  const totalIncome = mergedTransactions
    .filter((p) => p.type === "income")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = mergedTransactions
    .filter((p) => p.type === "expense")
    .reduce((sum, p) => sum + p.amount, 0);

  const balance = totalIncome - totalExpenses;
  const todaysPayments = [...mergedTransactions];

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
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

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-emerald-600">INCOME</div>
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              ${totalIncome.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              {incomeCount} transaction{incomeCount !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-red-600">EXPENSES</div>
              <div className="p-1.5 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              ${totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              {expenseCount} transaction{expenseCount !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-blue-600">BALANCE</div>
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <TrendingUp className="h-3 w-3 text-blue-600" />
              </div>
            </div>
            <div
              className={`text-xl font-bold mb-1 ${
                balance >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              ${balance.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Net amount today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">Financial Breakdown</CardTitle>
              <div className="text-xs text-gray-600">
                Daily cash flow analysis
              </div>
            </div>
            <PieChart className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">Income</span>
              <span className="font-medium text-emerald-600">
                ${totalIncome.toFixed(2)}
              </span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${totalIncome > 0 ? "100%" : "0%"}` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">Expenses</span>
              <span className="font-medium text-red-600">
                ${totalExpenses.toFixed(2)}
              </span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${totalExpenses > 0 ? "100%" : "0%"}` }}
              ></div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Net Balance</span>
              <div
                className={`text-sm font-semibold ${
                  balance >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                ${balance.toFixed(2)}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {balance >= 0 ? "Positive cash flow" : "Negative cash flow"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-sm">All Transactions</CardTitle>
                <div className="text-xs text-gray-600">
                  Today&apos;s activity
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          {mergedTransactions.map((item) => (
            <div
              key={item.title + item.type}
              className="flex justify-between text-xs"
            >
              <span className="text-gray-600">{item.title}</span>
              <span
                className={`text-xs ${
                  item.type === "income" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Savings Rate</span>
            <span
              className={`font-medium ${
                balance > 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {totalIncome > 0
                ? ((balance / totalIncome) * 100).toFixed(1) + "%"
                : "0%"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
