"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Task, UserStats, AppState, Payment } from "@/types";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  achievements,
  days,
  defaultMyTools,
  defaultNotes,
  defaultPayments,
  defaultTasks,
  monthlyGoals,
} from "./data";

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
  | { type: "RESET_MONTHLY_GOALS"; payload: void }
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
  | { type: "DELETE_PAYMENT"; payload: string }
  | { type: "SET_WEEKLY_PLAN"; payload: Record<string, Record<string, string>> }
  | {
      type: "UPDATE_DAY_PLAN";
      payload: { day: string; period: string; value: string };
    }
  | { type: "TOGGLE_GOAL_COMPLETION"; payload: string }
  | {
      type: "UPDATE_GOAL_PROGRESS";
      payload: { id: string; currentAmount: number };
    }
  | {
      type: "UPDATE_WEEKLY_TRADE";
      payload: { weekNumber: string; day: string; value: string };
    }
  | {
      type: "CLEAR_WEEKLY_TRADE";
      payload: { weekNumber: string };
    }
  | {
      type: "DELETE_WEEKLY_TRADE";
      payload: { weekNumber: string; day: string };
    };

const initialState: AppState = {
  tasks: defaultTasks,
  achievements: achievements,
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
  monthlyGoals: monthlyGoals,
  weeklyPlan: days.reduce((acc, day) => {
    acc[day] = { Trade: "" };
    return acc;
  }, {} as Record<string, Record<string, string>>),
  weeklyTrades: {},
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
    case "SET_WEEKLY_PLAN":
      return {
        ...state,
        weeklyPlan: action.payload,
      };
    case "UPDATE_DAY_PLAN":
      return {
        ...state,
        weeklyPlan: {
          ...state.weeklyPlan,
          [action.payload.day]: {
            ...state.weeklyPlan[action.payload.day],
            [action.payload.period]: action.payload.value,
          },
        },
      };
    case "UPDATE_WEEKLY_TRADE":
      return {
        ...state,
        weeklyTrades: {
          ...state.weeklyTrades,
          [action.payload.weekNumber]: {
            ...state.weeklyTrades[action.payload.weekNumber],
            [action.payload.day]: action.payload.value,
          },
        },
      };
    case "CLEAR_WEEKLY_TRADE":
      return {
        ...state,
        weeklyTrades: {
          ...state.weeklyTrades,
          [action.payload.weekNumber]: {},
        },
      };
    case "DELETE_WEEKLY_TRADE":
      const weekData = { ...state.weeklyTrades[action.payload.weekNumber] };
      delete weekData[action.payload.day];
      return {
        ...state,
        weeklyTrades: {
          ...state.weeklyTrades,
          [action.payload.weekNumber]: weekData,
        },
      };
    case "TOGGLE_GOAL_COMPLETION":
      return {
        ...state,
        monthlyGoals: state.monthlyGoals.map((goal) =>
          goal.id === action.payload
            ? {
                ...goal,
                completed: !goal.completed,
                completedDate: !goal.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : goal
        ),
      };
    case "UPDATE_GOAL_PROGRESS":
      return {
        ...state,
        monthlyGoals: state.monthlyGoals.map((goal) =>
          goal.id === action.payload.id
            ? {
                ...goal,
                currentAmount: action.payload.currentAmount,
                completed:
                  action.payload.currentAmount >= (goal.targetAmount || 0),
              }
            : goal
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

  const checkAndResetMonthlyGoals = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastResetMonth = localStorage.getItem("lastResetMonth");
    const lastResetYear = localStorage.getItem("lastResetYear");

    if (!lastResetMonth || !lastResetYear) {
      localStorage.setItem("lastResetMonth", currentMonth.toString());
      localStorage.setItem("lastResetYear", currentYear.toString());
      return false;
    }

    const lastMonth = parseInt(lastResetMonth);
    const lastYear = parseInt(lastResetYear);

    if (
      currentYear > lastYear ||
      (currentYear === lastYear && currentMonth > lastMonth)
    ) {
      localStorage.setItem("lastResetMonth", currentMonth.toString());
      localStorage.setItem("lastResetYear", currentYear.toString());
      dispatch({ type: "RESET_MONTHLY_GOALS", payload: undefined });
      return true;
    }

    return false;
  };

  const saveToLocalStorage = () => {
    try {
      const today = new Date().toISOString().split("T")[0];

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
        weeklyPlan: state.weeklyPlan,
      };

      localStorage.setItem(
        `dailyData_${today}`,
        JSON.stringify(currentDayData)
      );

      const appStateToSave = {
        tasks: state.tasks,
        achievements: state.achievements,
        userStats: state.userStats,
        notes: state.notes,
        myTools: state.myTools,
        monthlyGoals: state.monthlyGoals,
        weeklyPlan: state.weeklyPlan,
        weeklyTrades: state.weeklyTrades,
      };
      localStorage.setItem("appState", JSON.stringify(appStateToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      checkAndResetMonthlyGoals();

      const savedAppState = localStorage.getItem("appState");
      if (savedAppState) {
        const parsedAppState = JSON.parse(savedAppState);
        const { payments, ...rest } = parsedAppState as Partial<AppState>;
        dispatch({ type: "LOAD_DATA", payload: rest });
      }

      const todayData = localStorage.getItem(`dailyData_${today}`);
      if (todayData) {
        const parsedTodayData = JSON.parse(todayData);

        const updatedTasks = state.tasks.map((task) => ({
          ...task,
          completed: parsedTodayData.tasks[task.id] || false,
        }));

        const updatedNotes = state.notes.map((note) => ({
          ...note,
          subNotes: note.subNotes.map((subNote) => ({
            ...subNote,
            completed: parsedTodayData.notes[note.id]?.[subNote.id] || false,
          })),
        }));

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

        if (parsedTodayData.weeklyPlan) {
          dispatch({
            type: "SET_WEEKLY_PLAN",
            payload: parsedTodayData.weeklyPlan,
          });
        }
      }

      const lastActiveDate = localStorage.getItem("lastActiveDate");
      if (lastActiveDate && lastActiveDate !== today) {
        localStorage.setItem("lastActiveDate", today);
        dispatch({ type: "RESET_DAILY_TASKS", payload: undefined });
      } else if (!lastActiveDate) {
        localStorage.setItem("lastActiveDate", today);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      loadFromLocalStorage();
      setIsLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage();
    }
  }, [state, isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndResetMonthlyGoals();
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
