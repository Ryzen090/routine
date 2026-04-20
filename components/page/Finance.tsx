import {
  Wallet,
  Shield,
  Sparkles,
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { buildTradingTransactions } from "@/lib/helper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Finance() {
  const { state } = useApp();
  const tradingTransactions = buildTradingTransactions(state.weeklyTrades);
  const Transaction = [...state.payments];
  const allTransactions = [...state.payments, ...tradingTransactions];

  const transactions = Transaction.reduce(
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

  const incomeCount = transactions.filter((p) => p.type === "income").length;
  const expenseCount = transactions.filter((p) => p.type === "expense").length;

  const totalIncome = transactions
    .filter((p) => p.type === "income")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = transactions
    .filter((p) => p.type === "expense")
    .reduce((sum, p) => sum + p.amount, 0);

  const balance = totalIncome - totalExpenses;

  const tradingAmount = tradingTransactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum - t.amount;
  }, 0);

  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl mb-2 shadow-lg">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Finance Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Track your daily income and expenses
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-black text-xs font-medium">
                  Total Balance
                </span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div
                className={`text-3xl font-bold mb-2 ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                ${balance.toFixed(2)}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`text-xs px-2 py-1 rounded-full ${balance >= 0 ? "bg-emerald-500/20 text-emerald-600" : "bg-red-500/20 text-red-500"}`}
                >
                  {balance >= 0 ? "↑ Positive" : "↓ Negative"}
                </div>
                <div className="text-xs text-gray-400">
                  {balance >= 0 ? "Keep growing!" : "Watch your spending"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-emerald-600">
                  INCOME
                </div>
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

          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
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

          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-blue-600">TRADING</div>
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <div
                className={`text-xl font-bold mb-1 ${tradingAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                ${tradingAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Trading P&L</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-purple-600">
                  SAVINGS
                </div>
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Shield className="h-3 w-3 text-purple-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {savingsRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Savings rate</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm text-gray-900">
                  Cash Flow Analysis
                </CardTitle>
                <div className="text-xs text-gray-600">Income vs Expenses</div>
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
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalIncome > 0 ? "100%" : "0%"}` }}
                />
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
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalExpenses > 0 ? "100%" : "0%"}` }}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Net Cash Flow</span>
                <div
                  className={`text-sm font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  ${balance.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Trading Result</span>
                <div
                  className={`text-sm font-bold ${tradingAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  ${tradingAmount.toFixed(2)}
                </div>
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
            {transactions
              .slice() // copy array so we don't mutate original
              .sort((a, b) => {
                // Income first, then expenses
                if (a.type === b.type) {
                  // Same type → sort descending by amount
                  return b.amount - a.amount;
                }
                return a.type === "income" ? -1 : 1; // income first
              })
              .map((item) => (
                <div
                  key={item.title + item.type}
                  className="flex justify-between text-xs"
                >
                  <span className="text-gray-600">{item.title}</span>
                  <span
                    className={`text-xs ${
                      item.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}$
                    {item.amount.toFixed(2)}
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
    </div>
  );
}
