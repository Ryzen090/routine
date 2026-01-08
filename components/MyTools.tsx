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
        const total = tool.subItems.length;
        const completed = tool.subItems.filter((item) => item.completed).length;
        const progress = Math.round((completed / total) * 100);

        return (
          <Card key={tool.id} className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {tool.title}
                  </h4>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tool.subItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSubItem(tool.id, item.id)}
                    className={`
                      px-3 py-2 rounded-md border text-sm
                      flex items-center justify-center gap-2 transition-colors
                      ${
                        item.completed
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0
                        ${
                          item.completed
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300"
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
