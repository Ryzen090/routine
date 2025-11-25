'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Target, Calendar, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';

interface DailyStats {
  date: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export function Statistics() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Get daily statistics from localStorage
  const getDailyStats = (): DailyStats[] => {
    const saved = localStorage.getItem('dailyTaskStats');
    return saved ? JSON.parse(saved) : [];
  };

  const dailyStats = getDailyStats();
  const todayStats = dailyStats.find(stat => stat.date === new Date().toISOString().split('T')[0]);

  const todaysTasks = state.tasks.filter(task => task.recurring);
  const completedToday = todaysTasks.filter(task => task.completed);
  const dailyProgress = todaysTasks.length > 0 ? (completedToday.length / todaysTasks.length) * 100 : 0;

  // Calculate weekly stats
  const last7Days = dailyStats.slice(-7);
  const weeklyCompletion = last7Days.length > 0 
    ? last7Days.reduce((sum, day) => sum + day.completionRate, 0) / last7Days.length 
    : 0;

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedStats = [...dailyStats].reverse();
    
    for (const stat of sortedStats) {
      if (stat.completionRate === 100) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const totalCompleted = dailyStats.reduce((sum, day) => sum + day.completedTasks, 0);

  const stats = [
    {
      title: 'Tasks Completed',
      value: totalCompleted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Current Streak',
      value: `${currentStreak} days`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Weekly Average',
      value: `${Math.round(weeklyCompletion)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Today Progress',
      value: `${Math.round(dailyProgress)}%`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  const categoryStats = ['routine', 'work', 'skill', 'health', 'learning'].map(category => {
    const categoryTasks = state.tasks.filter(task => task.category === category);
    const completedCategoryTasks = categoryTasks.filter(task => task.completed);
    const percentage = categoryTasks.length > 0 ? (completedCategoryTasks.length / categoryTasks.length) * 100 : 0;
    
    return {
      category,
      completed: completedCategoryTasks.length,
      total: categoryTasks.length,
      percentage
    };
  });

  return (
    <div className="space-y-6 bg-white min-h-screen p-5 pb-20 lg:pb-6">
      {/* Header */}
          <h2 className="text-2xl font-bold flex items-center gap-2 text-black">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Statistics
          </h2>

      {/* Today's Progress Card */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Clock className="h-5 w-5 text-blue-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Daily Completion</span>
              <span className="text-sm text-gray-600">{completedToday.length}/{todaysTasks.length} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${dailyProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {dailyProgress === 100
                ? 'Perfect day! All tasks completed.'
                : `${Math.round(dailyProgress)}% of today's tasks completed`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} border ${stat.borderColor} shadow-sm`}>
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                  <div className="mb-2 lg:mb-0">
                    <p className="text-xs lg:text-sm font-medium text-black">{stat.title}</p>
                    <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <IconComponent className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task Categories */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Task Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No category data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-black">{stat.category}</span>
                    <span className="text-sm text-gray-600">
                      {stat.completed}/{stat.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {last7Days.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {last7Days.reverse().map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-black">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {day.completedTasks}/{day.totalTasks} tasks completed
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      day.completionRate === 100 ? 'text-green-600' : 
                      day.completionRate >= 50 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {Math.round(day.completionRate)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}