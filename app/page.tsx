"use client";

import React, { useEffect } from "react";
import { Finance } from "@/components/page/Finance";
import { Setting } from "@/components/page/Setting";
import { Metrics } from "@/components/page/Metrics";
import { Dashboard } from "@/components/page/Dashboard";
import { Navigation } from "@/components/Navigation";
import { AppProvider, useApp } from "@/contexts/AppContext";

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
      case "finance":
        return <Finance />;
      case "metrics":
        return <Metrics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
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
