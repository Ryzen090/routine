/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Task, Achievement, UserStats } from "@/types";

interface Note {
  id: string;
  title: string;
  content: string;
  subNotes: SubNote[];
  createdAt: string;
  updatedAt: string;
}

interface SubNote {
  id: string;
  content: string;
  completed: boolean;
}

interface MyTool {
  id: string;
  title: string;
  icon: string;
  target: number;
  current: number;
  unit: string;
  subItems: ToolSubItem[];
}

interface ToolSubItem {
  id: string;
  amount: string;
  unit: string;
  completed: boolean;
}

interface Payment {
  id: string;
  title: string;
  amount: number;
  category:
    | "food"
    | "gas"
    | "family"
    | "utilities"
    | "entertainment"
    | "rent"
    | "salary"
    | "other";
  date: string;
  type: "expense" | "income";
  icon: string;
}

interface AppState {
  tasks: Task[];
  achievements: Achievement[];
  userStats: UserStats;
  selectedDate: string;
  currentView: "dashboard" | "tasks" | "stats" | "payments" | "notes";
  notes: Note[];
  myTools: MyTool[];
  payments: Payment[];
}

type AppAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "SET_SELECTED_DATE"; payload: string }
  | { type: "SET_CURRENT_VIEW"; payload: AppState["currentView"] }
  | { type: "UNLOCK_ACHIEVEMENT"; payload: string }
  | { type: "UPDATE_STATS"; payload: Partial<UserStats> }
  | { type: "LOAD_DATA"; payload: Partial<AppState> }
  | { type: "RESET_TO_DEFAULT"; payload: void }
  | { type: "RESET_DAILY_TASKS"; payload: void }
  | {
      type: "UPDATE_NOTE_SUBNOTE";
      payload: { noteId: string; subNoteId: string };
    }
  | {
      type: "UPDATE_TOOL_SUBITEM";
      payload: { toolId: string; subItemId: string };
    }
  | { type: "ADD_PAYMENT"; payload: Payment }
  | { type: "UPDATE_PAYMENT"; payload: Payment }
  | { type: "DELETE_PAYMENT"; payload: string };

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Wake Up",
    icon: "🌅",
    startTime: "06:30",
    endTime: "07:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "2",
    title: "Cooking & Cleaning",
    icon: "🍳",
    startTime: "07:40",
    endTime: "08:00",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "3",
    title: "Shower & Dress Up",
    icon: "🚿",
    startTime: "08:00",
    endTime: "08:20",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "4",
    title: "Commute",
    icon: "🏍️",
    startTime: "08:30",
    endTime: "08:40",
    category: "work",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "5",
    title: "Plan the Day & Working Day",
    icon: "💻",
    startTime: "08:40",
    endTime: "09:00",
    category: "work",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "7",
    title: "Nourishing Lunch",
    icon: "🍱",
    startTime: "12:00",
    endTime: "12:50",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "9",
    title: "Evening Relaxation & Pen Spinning",
    icon: "🎮",
    startTime: "17:00",
    endTime: "18:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "low",
  },
  {
    id: "10",
    title: "Prepare Dinner",
    icon: "🍳",
    startTime: "18:00",
    endTime: "19:15",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "11",
    title: "Evening Exercise",
    icon: "🏋️‍♂️",
    startTime: "18:20",
    endTime: "18:40",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "12",
    title: "Take a Shower",
    icon: "🚿",
    startTime: "18:50",
    endTime: "19:10",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "14",
    title: "Learning",
    icon: "📚",
    startTime: "19:00",
    endTime: "21:00",
    category: "learning",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "15",
    title: "Healthy Dinner",
    icon: "🍽️",
    startTime: "20:00",
    endTime: "20:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "17",
    title: "Relaxation",
    icon: "🎲",
    startTime: "21:15",
    endTime: "22:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "16",
    title: "Healthy night Sleep & Recharge",
    icon: "🌙",
    startTime: "23:30",
    endTime: "23:30",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
];

const defaultNotes: Note[] = [
  {
    id: "1",
    title: "Motivation Skill",
    content: "Continuous learning and skill development",
    subNotes: [
      {
        id: "1-1",
        content: "Reading",
        completed: false,
      },
      {
        id: "1-2",
        content: "Writing",
        completed: false,
      },
      {
        id: "1-3",
        content: "Listening",
        completed: false,
      },
      {
        id: "1-4",
        content: "Speading",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Daily Learning",
    content: "Continuous learning and skill development",
    subNotes: [
      {
        id: "8-1",
        content: "អានសៀវភៅ ៣ អត្ថបទ ក្នុងមួយថ្ងៃ",
        completed: false,
      },
      {
        id: "8-2",
        content: "ជ្រើសយកប្រធានបទដែលអ្នកចាប់អារម្មណ៍ ឬជួយអភិវឌ្ឍអាជីព",
        completed: false,
      },
      {
        id: "8-3",
        content: "រៀនភាសាថ្មី ឬជំនាញថ្មីៗ ( English & Guitar & Pen Spinning )",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Consistent Sleep",
    content: "Quality sleep for better health",
    subNotes: [
      {
        id: "2-1",
        content:
          "បង្កើត ពិធីមុនគេង (bedtime ritual) ដូចជា ស្តាប់ចម្រៀងស្ងប់ស្ងាត់ ឬអានសៀវភៅ",
        completed: false,
      },
      {
        id: "2-2",
        content: "ជៀសវាងប្រើទូរស័ព្ទ ឬកុំព្យូទ័រក្នុងរយៈពេល ១ ម៉ោងមុនគេង",
        completed: false,
      },
      {
        id: "2-3",
        content: "គេងតាមម៉ោងដដែលរៀងរាល់ថ្ងៃ (ម៉ោង ១១)",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Regular Exercise",
    content: "Stay physically active",
    subNotes: [
      {
        id: "3-1",
        content: "ហាត់ប្រាណ ៤–៥ ដងក្នុងមួយសប្តាហ៍",
        completed: false,
      },
      {
        id: "3-2",
        content: "ចាប់ផ្ដើមតែ ១៥–៣០ នាទីក្នុងមួយថ្ងៃ",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Plan Your Day for Tomorrow",
    content: "Daily planning for success",
    subNotes: [
      {
        id: "4-1",
        content: "កំណត់តំលៃការងារសំខាន់ ៣ យ៉ាងក្នុងមួយថ្ងៃ",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Eat Nutritious Food",
    content: "Healthy eating habits",
    subNotes: [
      { id: "5-1", content: "ផឹកទឹក ៤-៦ កែវក្នុងមួយថ្ងៃ", completed: false },
      {
        id: "5-2",
        content: "កាត់បន្ថយអាហារផ្អែម និងអាហារដែលមិនមានប្រយោជន៍",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Limit Social Media",
    content: "Control digital consumption",
    subNotes: [
      {
        id: "6-1",
        content: "កំណត់ពេលសម្រាប់ APP ដូចជា Facebook, TikTok",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Save & Invest Early",
    content: "Financial planning",
    subNotes: [
      { id: "7-1", content: "រៀបចំថវិការៀងរាល់ខែ", completed: false },
      {
        id: "7-2",
        content: "សន្សំប្រាក់ ១០–២០% នៃចំណូលប្រចាំខែ",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultMyTools: MyTool[] = [
  {
    id: "1",
    title: "Drink Water",
    icon: "💧",
    target: 3,
    current: 0,
    unit: "bottle",
    subItems: [
      { id: "1-1", amount: "1 Bottle", unit: "bottle", completed: false },
      { id: "1-2", amount: "1 Bottle", unit: "bottle", completed: false },
    ],
  }
];

const defaultPayments: Payment[] = [
  {
    id: "1",
    title: "Payroll",
    amount: 350.0,
    category: "salary",
    date: new Date().toISOString().split("T")[0],
    type: "income",
    icon: "💰",
  },
  {
    id: "2",
    title: "Food",
    amount: 60.0,
    category: "food",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    icon: "🍱",
  },
  {
    id: "3",
    title: "Gas & Card",
    amount: 15.0,
    category: "gas",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    icon: "⛽",
  },
  {
    id: "4",
    title: "Rent",
    amount: 70.0,
    category: "rent",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    icon: "🏠",
  },
  {
    id: "5",
    title: "Family",
    amount: 100.0,
    category: "family",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    icon: "👨‍👩‍👧‍👦",
  },
];

const initialState: AppState = {
  tasks: defaultTasks,
  achievements: [
    {
      id: "first-week",
      title: "First Week Complete",
      description: "Complete 7 days of tasks",
      icon: "Trophy",
      unlocked: false,
      progress: 0,
      target: 7,
    },
    {
      id: "task-master",
      title: "Task Master",
      description: "Complete 100 tasks",
      icon: "CheckCircle",
      unlocked: false,
      progress: 0,
      target: 100,
    },
    {
      id: "consistency-king",
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      icon: "Target",
      unlocked: false,
      progress: 0,
      target: 30,
    },
  ],
  userStats: {
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyCompletion: 0,
  },
  selectedDate: new Date().toISOString().split("T")[0],
  currentView: "dashboard",
  notes: defaultNotes,
  myTools: defaultMyTools,
  payments: defaultPayments,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_CURRENT_VIEW":
      return { ...state, currentView: action.payload };
    case "UNLOCK_ACHIEVEMENT":
      return {
        ...state,
        achievements: state.achievements.map((achievement) =>
          achievement.id === action.payload
            ? {
                ...achievement,
                unlocked: true,
                unlockedDate: new Date().toISOString(),
              }
            : achievement
        ),
      };
    case "UPDATE_STATS":
      return {
        ...state,
        userStats: { ...state.userStats, ...action.payload },
      };
    case "LOAD_DATA":
      return { ...state, ...action.payload };
    case "RESET_TO_DEFAULT":
      return { ...state, tasks: defaultTasks };
    case "RESET_DAILY_TASKS":
      return {
        ...state,
        tasks: state.tasks.map((task) => ({ ...task, completed: false })),
        myTools: state.myTools.map((tool) => ({
          ...tool,
          current: 0,
          subItems: tool.subItems.map((item) => ({
            ...item,
            completed: false,
          })),
        })),
        notes: state.notes.map((note) => ({
          ...note,
          subNotes: note.subNotes.map((subNote) => ({
            ...subNote,
            completed: false,
          })),
        })),
      };
    case "UPDATE_NOTE_SUBNOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.noteId
            ? {
                ...note,
                subNotes: note.subNotes.map((subNote) =>
                  subNote.id === action.payload.subNoteId
                    ? { ...subNote, completed: !subNote.completed }
                    : subNote
                ),
                updatedAt: new Date().toISOString(),
              }
            : note
        ),
      };
    case "UPDATE_TOOL_SUBITEM":
      return {
        ...state,
        myTools: state.myTools.map((tool) =>
          tool.id === action.payload.toolId
            ? {
                ...tool,
                subItems: tool.subItems.map((item) =>
                  item.id === action.payload.subItemId
                    ? { ...item, completed: !item.completed }
                    : item
                ),
                current: tool.subItems.filter((item) =>
                  item.id === action.payload.subItemId
                    ? !item.completed
                    : item.completed
                ).length,
              }
            : tool
        ),
      };
    case "ADD_PAYMENT":
      return {
        ...state,
        payments: [...state.payments, action.payload],
      };
    case "UPDATE_PAYMENT":
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ),
      };
    case "DELETE_PAYMENT":
      return {
        ...state,
        payments: state.payments.filter(
          (payment) => payment.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Save current state to localStorage
  const saveToLocalStorage = () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Save current day's data
      const currentDayData = {
        date: today,
        tasks: state.tasks.reduce((acc, task) => {
          acc[task.id] = task.completed;
          return acc;
        }, {} as Record<string, boolean>),
        notes: state.notes.reduce((acc, note) => {
          acc[note.id] = note.subNotes.reduce((subAcc, subNote) => {
            subAcc[subNote.id] = subNote.completed;
            return subAcc;
          }, {} as Record<string, boolean>);
          return acc;
        }, {} as Record<string, Record<string, boolean>>),
        myTools: state.myTools.reduce((acc, tool) => {
          acc[tool.id] = tool.subItems.reduce((subAcc, item) => {
            subAcc[item.id] = item.completed;
            return subAcc;
          }, {} as Record<string, boolean>);
          return acc;
        }, {} as Record<string, Record<string, boolean>>),
      };

      // Save today's data
      localStorage.setItem(
        `dailyData_${today}`,
        JSON.stringify(currentDayData)
      );

      // Save payments (1 month)
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const recentPayments = state.payments.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= oneMonthAgo;
      });
      localStorage.setItem("paymentsData", JSON.stringify(recentPayments));

      // Save app state
      const appStateToSave = {
        tasks: state.tasks,
        achievements: state.achievements,
        userStats: state.userStats,
        notes: state.notes,
        myTools: state.myTools,
        payments: recentPayments,
      };
      localStorage.setItem("appState", JSON.stringify(appStateToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Load app state
      const savedAppState = localStorage.getItem("appState");
      if (savedAppState) {
        const parsedAppState = JSON.parse(savedAppState);
        dispatch({ type: "LOAD_DATA", payload: parsedAppState });
      }

      // Load today's data if it exists
      const todayData = localStorage.getItem(`dailyData_${today}`);
      if (todayData) {
        const parsedTodayData = JSON.parse(todayData);

        // Restore task completion states
        const updatedTasks = state.tasks.map((task) => ({
          ...task,
          completed: parsedTodayData.tasks[task.id] || false,
        }));

        // Restore notes completion states
        const updatedNotes = state.notes.map((note) => ({
          ...note,
          subNotes: note.subNotes.map((subNote) => ({
            ...subNote,
            completed: parsedTodayData.notes[note.id]?.[subNote.id] || false,
          })),
        }));

        // Restore tools completion states
        const updatedTools = state.myTools.map((tool) => {
          const updatedSubItems = tool.subItems.map((item) => ({
            ...item,
            completed: parsedTodayData.myTools[tool.id]?.[item.id] || false,
          }));
          return {
            ...tool,
            subItems: updatedSubItems,
            current: updatedSubItems.filter((item) => item.completed).length,
          };
        });

        dispatch({
          type: "LOAD_DATA",
          payload: {
            tasks: updatedTasks,
            notes: updatedNotes,
            myTools: updatedTools,
          },
        });
      }

      // Check if it's a new day
      const lastActiveDate = localStorage.getItem("lastActiveDate");
      if (lastActiveDate && lastActiveDate !== today) {
        // It's a new day, reset daily items but keep the data saved
        localStorage.setItem("lastActiveDate", today);
        dispatch({ type: "RESET_DAILY_TASKS", payload: undefined });
      } else if (!lastActiveDate) {
        // First time user
        localStorage.setItem("lastActiveDate", today);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (!isLoaded) {
      loadFromLocalStorage();
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Save data whenever state changes
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage();
    }
  }, [state, isLoaded]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
