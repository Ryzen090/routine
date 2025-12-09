"use client";

import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, CheckSquare } from "lucide-react";

export function Notes() {
  const { state, dispatch } = useApp();

  const toggleSubNote = (noteId: string, subNoteId: string) => {
    dispatch({
      type: "UPDATE_NOTE_SUBNOTE",
      payload: { noteId, subNoteId },
    });
  };

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2 text-black">
          Discipline
        </h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">
          Becoming the best version of myself
        </p>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {state.notes.map((note) => (
          <Card
            key={note.id}
            className="bg-white border border-gray-200 shadow-sm"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-black text-sm">{note.title}</CardTitle>
              {note.content && (
                <p className="text-sm text-gray-600 mt-2">{note.content}</p>
              )}
            </CardHeader>
            <CardContent>
              {note.subNotes.length > 0 && (
                <div className="space-y-2">
                  {note.subNotes.map((subNote) => (
                    <div
                      key={subNote.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                    >
                      <Checkbox
                        checked={subNote.completed}
                        onCheckedChange={() =>
                          toggleSubNote(note.id, subNote.id)
                        }
                      />
                      <span
                        className={`flex-1 text-sm ${
                          subNote.completed
                            ? "line-through text-gray-500"
                            : "text-black"
                        }`}
                      >
                        {subNote.content}
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckSquare className="h-3 w-3" />
                      <span>
                        {note.subNotes.filter((sub) => sub.completed).length} of{" "}
                        {note.subNotes.length} completed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
