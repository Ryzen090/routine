'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';

export function MyTools() {
  const { state, dispatch } = useApp();

  const toggleSubItem = (toolId: string, subItemId: string) => {
    dispatch({ 
      type: 'UPDATE_TOOL_SUBITEM', 
      payload: { toolId, subItemId } 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">My Tools</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.myTools.map((tool) => {
          const completedItems = tool.subItems.filter(item => item.completed).length;
          const progressPercentage = (completedItems / tool.subItems.length) * 100;

          return (
            <Card key={tool.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{tool.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900">{tool.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{completedItems}/{tool.subItems.length} ({Math.round(progressPercentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sub Items */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {tool.subItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleSubItem(tool.id, item.id)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-2 ${
                          item.completed
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                          item.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {item.completed && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span>{item.amount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}