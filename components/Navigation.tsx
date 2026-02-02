"use client";

import React from "react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  BadgeCheck,
  Settings,
  DumbbellIcon,
  BadgeDollarSign,
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Routine", icon: BadgeCheck },
  { id: "discipline", label: "Metrics", icon: DumbbellIcon },
  { id: "finance", label: "Finance", icon: BadgeDollarSign },
  { id: "setting", label: "Setting", icon: Settings },
];

export function Navigation() {
  const { state, dispatch } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = (view: typeof state.currentView) => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: view });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-full lg:border-r lg:border-gray-200 lg:z-40 lg:bg-white lg:w-64">
        <div className="p-6 w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎯</div>
              <h1 className="text-xl font-bold text-gray-900">Discipline</h1>
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = state.currentView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "hover:bg-gray-100 text-gray-700"
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id as any)}
                className={`flex flex-col items-center justify-center space-y-1 relative ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
