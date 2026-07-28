"use client";

import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BadgeCheck,
  Settings,
  DumbbellIcon,
  BadgeDollarSign,
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Routine", icon: BadgeCheck },
  { id: "metrics", label: "Metrics", icon: DumbbellIcon },
  { id: "finance", label: "Finance", icon: BadgeDollarSign },
  { id: "setting", label: "Setting", icon: Settings },
];

export function Navigation() {
  const { state, dispatch } = useApp();

  const handleViewChange = (view: typeof state.currentView) => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: view });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:fixed lg:left-0 lg:top-0 lg:h-full lg:border-r lg:border-gray-200 dark:lg:border-slate-800 lg:z-40 lg:bg-white dark:lg:bg-slate-900 lg:w-64 transition-colors">
        <div className="p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Discipline
              </h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = state.currentView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start transition-colors ${
                    isActive
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                  }`}
                  onClick={() => handleViewChange(item.id as any)}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-1">
              Theme Mode
            </span>
            <ThemeToggle className="w-full justify-center" />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 transition-colors">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id as any)}
                className={`flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
