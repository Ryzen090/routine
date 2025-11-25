export interface Task {
  id: string;
  title: string;
  icon: string;
  startTime: string;
  endTime: string;
  category: 'routine' | 'work' | 'skill' | 'health' | 'learning';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
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