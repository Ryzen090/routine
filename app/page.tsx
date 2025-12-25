"use client";

import React, { useEffect } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { Financial } from "@/components/Financial";
import { Discipline } from "@/components/Discipline";
import { Setting } from "@/components/Setting";

function AppContent() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view) {
      dispatch({ type: "SET_CURRENT_VIEW", payload: view as any });
    }
  }, [dispatch]);

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "dashboard":
        return <Dashboard />;
      case "setting":
        return <Setting />;
      case "financial":
        return <Financial />;
      case "discipline":
        return <Discipline />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <div className="lg:p-6">{renderCurrentView()}</div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
