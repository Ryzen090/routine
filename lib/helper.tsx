export const getProgressCircleColor = (completionRate: number): string => {
  if (completionRate <= 40) return "#ef4444";
  if (completionRate <= 64) return "#f97316";
  if (completionRate <= 74) return "#f59e0b";
  if (completionRate <= 80) return "#10b981";
  return "#10b981";
};

// #region Finance
function getMonthlyTradingTotals(
  weeklyTrades: Record<string, Record<string, string>>,
) {
  const result: Record<string, number> = {};

  Object.entries(weeklyTrades).forEach(([weekNumber, days]) => {
    const year = new Date().getFullYear();
    const weekStart = new Date(year, 0, 1 + (Number(weekNumber) - 1) * 7);
    const monthKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}`;

    const weekTotal = Object.values(days).reduce((sum, val) => {
      const n = parseFloat(val || "0");
      return isNaN(n) ? sum : sum + n;
    }, 0);

    result[monthKey] = (result[monthKey] || 0) + weekTotal;
  });

  return result;
}

export function buildTradingTransactions(
  weeklyTrades: Record<string, Record<string, string>>,
) {
  const monthlyTotals = getMonthlyTradingTotals(weeklyTrades);

  return Object.entries(monthlyTotals).map(([monthKey, total]) => {
    return {
      id: `trading-${monthKey}`,
      title: "Trading",
      amount: Math.abs(total),
      type: total >= 0 ? "income" : "expense",
    };
  });
}
