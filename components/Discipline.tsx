import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ---------------- TYPES ---------------- */
type Tab = "daily" | "weekly" | "monthly";

/* ---------------- COMPONENT ---------------- */
export function Discipline() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("daily");

  /* ---------------- DAILY ---------------- */
  const toggleSubNote = (noteId: string, subNoteId: string) => {
    dispatch({
      type: "UPDATE_NOTE_SUBNOTE",
      payload: { noteId, subNoteId },
    });
  };

  /* ---------------- WEEKLY ---------------- */
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["Morning", "Afternoon", "Evening"];

  const [weeklyFocus, setWeeklyFocus] = useState("");
  const [weeklyPlan, setWeeklyPlan] = useState<
    Record<string, Record<string, string>>
  >(
    days.reduce((acc, day) => {
      acc[day] = { Morning: "", Afternoon: "", Evening: "" };
      return acc;
    }, {} as Record<string, Record<string, string>>)
  );

  /* ---------------- MONTHLY ---------------- */
  const [monthlyGoals, setMonthlyGoals] = useState<string[]>([
    "Exercise 20 days",
    "Code consistently",
    "Read 2 books",
  ]);
  const [newGoal, setNewGoal] = useState("");

  /* ---------------- STATS ---------------- */
  const habits = [
    { name: "Exercise", done: 12, target: 20 },
    { name: "Coding", done: 18, target: 25 },
    { name: "Reading", done: 9, target: 15 },
  ];

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 pb-20 px-4">
      {/* ---------- HEADER ---------- */}
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-black">Discipline</h2>
        <p className="text-sm text-gray-600">
          Becoming the best version of myself
        </p>
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex justify-center gap-2">
        {(["daily", "weekly", "monthly"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full text-sm capitalize transition
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= DAILY ================= */}
      {activeTab === "daily" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {state.notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{note.title}</CardTitle>
                {note.content && (
                  <p className="text-sm text-gray-600">{note.content}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {note.subNotes.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                  >
                    <Checkbox
                      checked={sub.completed}
                      onCheckedChange={() => toggleSubNote(note.id, sub.id)}
                    />
                    <span
                      className={`text-sm ${
                        sub.completed
                          ? "line-through text-gray-400"
                          : "text-black"
                      }`}
                    >
                      {sub.content}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <CheckSquare className="h-3 w-3" />
                  {note.subNotes.filter((s) => s.completed).length} /{" "}
                  {note.subNotes.length} completed
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= WEEKLY ================= */}
      {activeTab === "weekly" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {days.map((day) => (
              <Card key={day}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {periods.map((p) => (
                    <input
                      key={p}
                      value={weeklyPlan[day][p]}
                      onChange={(e) =>
                        setWeeklyPlan((prev) => ({
                          ...prev,
                          [day]: {
                            ...prev[day],
                            [p]: e.target.value,
                          },
                        }))
                      }
                      placeholder={p}
                      className="w-full rounded-md border px-3 py-1 text-xs"
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= MONTHLY ================= */}
      {activeTab === "monthly" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">📅 Monthly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyGoals.map((goal, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                >
                  <span>🎯</span>
                  <span className="text-sm">{goal}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Discipline;
