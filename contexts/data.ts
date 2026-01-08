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
    id: "9",
    title: "Evening Relaxation",
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
    title: "Dinner",
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
    id: "13",
    title: "Trading Learning",
    icon: "📈",
    startTime: "19:00",
    endTime: "19:45",
    category: "learning",
    completed: false,
    recurring: true,
    priority: "medium",
  },
  {
    id: "14",
    title: "Healthy Dinner",
    icon: "🍽️",
    startTime: "19:45",
    endTime: "20:00",
    category: "routine",
    completed: false,
    recurring: true,
    priority: "high",
  },
  {
    id: "15",
    title: "Learning",
    icon: "📚",
    startTime: "20:00",
    endTime: "21:00",
    category: "learning",
    completed: false,
    recurring: true,
    priority: "medium",
  },

  {
    id: "16",
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
    id: "17",
    title: "Healthy night Sleep",
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
        content: "Read one book per month",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Language",
    content: "Improve communication",
    subNotes: [
      {
        id: "1-1",
        content: "Improve English",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Travel",
    content: "Explore new places",
    subNotes: [
      {
        id: "1-1",
        content: "Travel once this year",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Forex Trading",
    content: "Learn trading",
    subNotes: [
      {
        id: "1-1",
        content: "Learn forex basics",
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
        content: "Work out 4 times a week",
        completed: false,
      },
      {
        id: "1-2",
        content: "Practice martial arts",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Art",
    content: "Be creative",
    subNotes: [
      {
        id: "1-1",
        content: "Draw mountains",
        completed: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Blog",
    content: "Share ideas",
    subNotes: [
      {
        id: "1-1",
        content: "Blog with GPT",
        completed: false,
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
    amount: 350,
    type: "income",
  },
  {
    id: "5",
    title: "Family",
    amount: 100,
    type: "expense",
  },
  {
    id: "2",
    title: "Rent",
    amount: 70,
    type: "expense",
  },
  {
    id: "4",
    title: "Food",
    amount: 75,
    type: "expense",
  },
  {
    id: "3",
    title: "Motorbike",
    amount: 20,
    type: "expense",
  },
  {
    id: "1",
    title: "Save",
    amount: 20,
    type: "expense",
  },
];

export const monthlyGoals: Goal[] = [
  {
    id: "1",
    title: "Save 100$",
    icon: "💲",
    completed: false,
    targetAmount: 100,
    currentAmount: 0,
  },
  {
    id: "2",
    title: "Save 20$",
    icon: "💲",
    completed: false,
    targetAmount: 30,
    currentAmount: 0,
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
  {
    text: "If you want to be strong, learn to fight alone.",
  },
  {
    text: "You don’t have to be great to start, but you have to start to be great.",
  },
  {
    text: "The first steps are always the hardest.",
  },
];
