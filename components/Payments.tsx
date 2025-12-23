import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, DollarSign, TrendingUp } from "lucide-react";

const value = [
  {
    id: "1",
    title: "Salary",
    amount: 350,
    type: "income",
    date: "2025-12-23",
    icon: "💲",
  },
  {
    id: "5",
    title: "Family",
    amount: 100,
    type: "expense",
    date: "2025-12-23",
    icon: "👪",
  },
  {
    id: "2",
    title: "Rent",
    amount: 75,
    type: "expense",
    date: "2025-12-23",
    icon: "🏠",
  },
  {
    id: "4",
    title: "Food",
    amount: 75,
    type: "expense",
    date: "2025-12-23",
    icon: "🍛",
  },
  {
    id: "3",
    title: "Motorbike",
    amount: 20,
    type: "expense",
    date: "2025-12-23",
    icon: "⛽",
  },
];

export function Payments() {
  const today = new Date().toISOString().split("T")[0];
  const todaysPayments = value.filter((payment) => payment.date === today);

  const todaysIncome = todaysPayments
    .filter((p) => p.type === "income")
    .reduce((sum, p) => sum + p.amount, 0);

  const todaysExpenses = todaysPayments
    .filter((p) => p.type === "expense")
    .reduce((sum, p) => sum + p.amount, 0);

  const todaysBalance = todaysIncome - todaysExpenses;

  return (
    <div className="space-y-4 lg:space-y-6 bg-white min-h-screen pt-5 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-0">
      <h1 className="text-center text-2xl lg:text-3xl font-bold mb-2">
        Daily Payments
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Income Card */}
        <Card className="bg-green-50 border border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-green-800">
              Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-green-900">
              ${todaysIncome.toFixed(2)}
            </div>
            <p className="text-xs text-green-600">Today</p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="bg-red-50 border border-red-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-red-800">
              Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-red-900">
              ${todaysExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-red-600">Today</p>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className="bg-blue-50 border border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-blue-800">
              Balance
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-base lg:text-2xl font-bold ${
                todaysBalance >= 0 ? "text-green-900" : "text-red-900"
              }`}
            >
              ${todaysBalance.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600">Net</p>
          </CardContent>
        </Card>

        {/* Count Card */}
        <Card className="bg-purple-50 border border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-purple-800">
              Count
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-purple-900">
              {todaysPayments.length}
            </div>
            <p className="text-xs text-purple-600">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">
            Month&apos;s Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysPayments.length === 0 ? (
            <div className="text-center py-8 lg:py-12 text-gray-500">
              <CreditCard className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm lg:text-base">
                No transactions recorded today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xl lg:text-2xl flex-shrink-0">
                      {payment.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-black text-sm lg:text-base truncate">
                        {payment.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    <span
                      className={`text-sm lg:text-lg font-bold ${
                        payment.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.type === "income" ? "+" : "-"}$
                      {payment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
