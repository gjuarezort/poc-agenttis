"use client";

import React from "react";
import { DashboardProvider, useDashboard } from "../context/DashboardContext";

// Import modularized components
import { Sidebar } from "../components/core/Sidebar";
import { Topbar } from "../components/core/Topbar";
import { HomeTab } from "../components/core/HomeTab";

import { DataConnectionsTab } from "../components/platform/DataConnectionsTab";
import { SkillsTab } from "../components/platform/SkillsTab";
import { AgentsTab } from "../components/platform/AgentsTab";
import { ArchitectureTab } from "../components/platform/ArchitectureTab";
import { PlaygroundTab } from "../components/platform/PlaygroundTab";
import { McpCodeTab } from "../components/platform/McpCodeTab";

import { BankReconciliationTab } from "../components/domain/BankReconciliationTab";
import { MonthlyCloseTab } from "../components/domain/MonthlyCloseTab";
import { TaxAlertsTab } from "../components/domain/TaxAlertsTab";

import { TemplateGalleryTab } from "../components/settings/TemplateGalleryTab";
import { SettingsTab } from "../components/settings/SettingsTab";
import { IntegrationsTab } from "../components/settings/IntegrationsTab";

function DashboardContent() {
  const { activeTab, sidebarOpen } = useDashboard();

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "row", background: "var(--bg-base)", color: "var(--text-primary)", transition: "background-color var(--transition-normal), color var(--transition-normal)" }}>
      {/* Left Sticky Sidebar Wrapper */}
      <div className={`sidebar-container ${!sidebarOpen ? "collapsed" : ""}`}>
        <Sidebar />
      </div>

      {/* Right column: main + footer */}
      <div className="main-canvas" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Top bar */}
        <Topbar />

        {/* Main content area */}
        <main className="container" style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1500px" }}>
          {activeTab === "home" && <HomeTab />}
          {activeTab === "connections" && <DataConnectionsTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "agents" && <AgentsTab />}
          {activeTab === "visualGraph" && <ArchitectureTab />}
          {activeTab === "playground" && <PlaygroundTab />}
          {activeTab === "recipe" && <McpCodeTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "reconciliation" && <BankReconciliationTab />}
          {activeTab === "monthlyClose" && <MonthlyCloseTab />}
          {activeTab === "taxAlerts" && <TaxAlertsTab />}
          {activeTab === "templates" && <TemplateGalleryTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>

        {/* Footer */}
        <footer style={{
          padding: "0.75rem 2rem",
          marginTop: "2rem",
          borderTop: "1px solid var(--border-color)",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-surface-solid)",
          transition: "background-color var(--transition-normal)"
        }}>
          <span>© 2026 Agenttis Inc. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Documentation</span>
          </div>
        </footer>

      </div> {/* end right column */}
    </div>
  );
}

export default function AgenttisDashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
