export const getProgressCircleColor = (completionRate: number): string => {
  if (completionRate <= 40) return "#ef4444";
  if (completionRate <= 64) return "#f97316";
  if (completionRate <= 74) return "#f59e0b";
  if (completionRate <= 80) return "#10b981";
  return "#10b981";
};
