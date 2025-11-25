'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { TaskTimeline } from './TaskTimeline';
import { MyTools } from './MyTools';
import { MotivationalQuotes } from './MotivationalQuotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Target, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todaysTasks = state.tasks.filter(task => {
    return task.recurring || task.id === state.selectedDate;
  });

  const completedTasks = todaysTasks.filter(task => task.completed);
  const completionRate = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

  return (
    <div className="space-y-6 bg-white min-h-screen pt-5 lg:pt-0 pb-20 lg:pb-0">
      <h1 className="text-center text-2xl lg:text-3xl font-bold mb-2">Today</h1>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-4 lg:p-6 text-white mx-4 lg:mx-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
              Good Morning! <span className="text-3xl lg:text-4xl"></span>
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">{today}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl lg:text-4xl font-bold">{Math.round(completionRate)}%</div>
            <p className="text-blue-100 text-sm lg:text-base">Daily Progress</p>
          </div>
        </div>
      </div>

      {/* Motivational Quotes Section */}
      <div className="mx-4 lg:mx-0">
        <MotivationalQuotes />
      </div>

      {/* My Tools Section */}
      <div className="mx-4 lg:mx-0">
        <MyTools />
      </div>

      {/* Timeline */}
      <div className="">
        <TaskTimeline />
      </div>
    </div>
  );
}