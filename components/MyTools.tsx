"use client";

import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";

export function MyTools() {
  const { state, dispatch } = useApp();

  const toggleSubItem = (toolId: string, subItemId: string) => {
    dispatch({
      type: "UPDATE_TOOL_SUBITEM",
      payload: { toolId, subItemId },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {state.myTools.map((tool) => {
        const completed = tool.subItems.filter((item) => item.completed).length;
        const total = tool.subItems.length;
        const progress = Math.round((completed / total) * 100);

        return (
          <Card
            key={tool.id}
            className="border-none shadow-sm hover:shadow transition-shadow"
          >
            <CardContent className="p-4">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {tool.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span className="font-medium">({progress}%)</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tool.subItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSubItem(tool.id, item.id)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm
                      flex items-center gap-2 transition-colors
                      ${
                        item.completed
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-3 h-3 rounded-full border flex items-center justify-center
                      ${
                        item.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }
                    `}
                    >
                      {item.completed && (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="truncate">{item.amount}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
