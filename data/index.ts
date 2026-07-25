import { Goal, MyTool, Note, Payment, Task } from "@/types";

export const defaultTasks: Task[] = [
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
    title: "Cleaning",
    icon: "🍳",
    startTime: "07:50",
    endTime: "08:00",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "3",
    title: "Shower",
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
    title: "Exercise",
    icon: "🏋️‍♂️",
    startTime: "08:20",
    endTime: "08:40",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "5",
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
    id: "6",
    title: "Planning",
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
    title: "Lunch",
    icon: "🍱",
    startTime: "12:00",
    endTime: "12:50",
    category: "health",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "8",
    title: "Relaxation",
    icon: "🎮",
    startTime: "17:00",
    endTime: "18:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "low",
  },
  {
    id: "9",
    title: "Cooking",
    icon: "🍳",
    startTime: "18:00",
    endTime: "19:15",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "10",
    title: "Shower",
    icon: "🚿",
    startTime: "18:50",
    endTime: "19:10",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "11",
    title: "Reading",
    icon: "📖",
    startTime: "19:00",
    endTime: "19:20",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "12",
    title: "Trading",
    icon: "📈",
    startTime: "19:20",
    endTime: "21:45",
    category: "learning",
    completed: false,
    recurring: true,
    priority: "medium",
  },

  {
    id: "13",
    title: "Dinner",
    icon: "🍽️",
    startTime: "21:45",
    endTime: "22:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "14",
    title: "Healthy Night",
    icon: "🛏️",
    startTime: "23:30",
    endTime: "23:30",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
];

export const defaultNotes: Note[] = [
  {
    id: "1",
    title: "Coding",
    content: "Build digital solutions",
    subNotes: [
      {
        id: "1-1",
        content: "Learn backend development",
        completed: false,
      },
      {
        id: "1-2",
        content: "Learn frontend development",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Reading",
    content: "Grow knowledge",
    subNotes: [
      {
        id: "1-1",
        content: "បណ្តាំកញ្រ្ជោងចាស់",
        completed: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Trading",
    content: "Learn Trading Forex",
    subNotes: [
      {
        id: "1-1",
        content: "Inner Circle Trader (ICT)",
        completed: false,
      },
      {
        id: "1-2",
        content: "Candle Range Theory (CRT)",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Fitness",
    content: "Stay healthy",
    subNotes: [
      {
        id: "1-1",
        content: "Workout",
        completed: false,
      },
      {
        id: "1-2",
        content: "Drink Water",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Travel",
    content: "Explore New Places",
    subNotes: [
      {
        id: "1-2",
        content: "កំពត",
        completed: true,
      },
      {
        id: "1-3",
        content: "បូកគោ (កំពត)",
        completed: true,
      },
      {
        id: "1-1",
        content: "កោះស្តេច (កោះកុង)",
        completed: true,
      },
      {
        id: "1-4",
        content: "ពយយាយម៉ៅ (កំពង់សោម)",
        completed: true,
      },
      {
        id: "1-5",
        content: "ជីផាត (កោះកុង)",
        completed: true,
      },
      {
        id: "1-6",
        content: "អង្គរវត្ត (សៀមរាប)",
        completed: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultMyTools: MyTool[] = [
  {
    id: "1",
    title: "Drink Water",
    target: 3,
    current: 0,
    unit: "bottle",
    subItems: [
      { id: "1-1", amount: "1 Bottle", unit: "bottle", completed: false },
      { id: "1-2", amount: "1 Bottle", unit: "bottle", completed: false },
    ],
  },
];

export const defaultPayments: Payment[] = [
  {
    id: "1",
    title: "Salary",
    amount: 440,
    type: "income",
  },
  {
    id: "2",
    title: "Family",
    amount: 200,
    type: "expense",
  },
  {
    id: "3",
    title: "Rent & Food & Motorbike",
    amount: 180,
    type: "expense",
  },
  {
    id: "5",
    title: "Savings",
    amount: 40,
    type: "expense",
  },
];

export const achievements = [
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
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const taskCompletedStyles = [
  "bg-orange-50 border-l-4 border-orange-300",
  "bg-teal-50 border-l-4 border-teal-300",
  "bg-purple-50 border-l-4 border-purple-300",
  "bg-green-50 border-l-4 border-green-300",
  "bg-blue-50 border-l-4 border-blue-300",
  "bg-pink-50 border-l-4 border-pink-300",
  "bg-yellow-50 border-l-4 border-yellow-300",
  "bg-indigo-50 border-l-4 border-indigo-300",
];

export const motivationalQuotes = [
  {
    text: "Remember who you are.",
  },
];
