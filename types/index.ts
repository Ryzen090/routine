export interface Task {
  id: string;
  title: string;
  icon: string;
  startTime: string;
  endTime: string;
  category: "routine" | "work" | "skill" | "health" | "learning";
  completed: boolean;
  priority: "low" | "medium" | "high";
  recurring: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  target: number;
}

export interface UserStats {
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCompletion: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subNotes: SubNote[];
  createdAt: string;
  updatedAt: string;
}

export interface SubNote {
  id: string;
  content: string;
  completed: boolean;
}

export interface MyTool {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  subItems: ToolSubItem[];
}

export interface ToolSubItem {
  id: string;
  amount: string;
  unit: string;
  completed: boolean;
}

export interface Payment {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  targetAmount?: number;
  currentAmount?: number;
}

export interface WeeklyTradeData {
  [weekNumber: string]: {
    [day: string]: string;
  };
}

export interface AppState {
  tasks: Task[];
  achievements: Achievement[];
  userStats: UserStats;
  selectedDate: string;
  currentView: "dashboard" | "tasks" | "setting" | "finance" | "discipline";
  notes: Note[];
  myTools: MyTool[];
  payments: Payment[];
  monthlyGoals: Goal[];
  weeklyPlan: Record<string, Record<string, string>>;
  weeklyTrades: WeeklyTradeData;
}
