import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import {
  Grid,
  Database,
  SlidersHorizontal,
  Sparkles,
  Cpu,
  Play,
  FileCode,
  ArrowLeftRight,
  CalendarCheck,
  Receipt,
  Package,
  Link,
  HardDrive,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  language: "en" | "es";
  parsedData: any;
  advancedMode: boolean;
  tTab: (key: string) => string;
}



export const Sidebar: React.FC = () => {
  const { activeTab,
  setActiveTab,
  language,
  parsedData,
  advancedMode,
  tTab, } = useDashboard();
  const navItems: {
    key: string;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    sectionLabel?: string;
  }[] = [
    { key: "home",          icon: <Grid size={16} />,              label: tTab("home") },
    { key: "connections",   icon: <Database size={16} />,          label: tTab("connections"),   sectionLabel: language === "es" ? "Capa Agéntica" : "Agentic Layer" },
    { key: "skills",        icon: <SlidersHorizontal size={16} />, label: tTab("skills") },
    { key: "agents",        icon: <Sparkles size={16} />,          label: tTab("agents") },
    { key: "visualGraph",   icon: <Cpu size={16} />,               label: tTab("visualGraph") },
    { key: "playground",    icon: <Play size={16} />,              label: tTab("playground"),    disabled: !parsedData },
    ...(advancedMode ? [{ key: "recipe", icon: <FileCode size={16} />, label: tTab("recipe"), disabled: !parsedData }] : []),
    { key: "reconciliation",icon: <ArrowLeftRight size={16} />,    label: tTab("reconciliation"), sectionLabel: language === "es" ? "Aplicaciones" : "Applications" },
    { key: "monthlyClose",  icon: <CalendarCheck size={16} />,     label: tTab("monthlyClose") },
    { key: "taxAlerts",     icon: <Receipt size={16} />,           label: tTab("taxAlerts") },
    { key: "templates",     icon: <Package size={16} />,           label: tTab("templates") },
    { key: "integrations",  icon: <Link size={16} />,              label: tTab("integrations"),  sectionLabel: language === "es" ? "Sistema" : "System" },
    { key: "settings",      icon: <SlidersHorizontal size={16} />, label: tTab("settings") },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Logo and Brand */}
        <div className="sidebar-brand">
          <div className="flex-center" style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            width: "34px",
            height: "34px",
            borderRadius: "6px",
            color: "#000000",
            fontWeight: 800,
            fontSize: "1.1rem",
            boxShadow: "0 2px 6px var(--color-primary-glow)",
            flexShrink: 0
          }}>
            A
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
                Agenttis
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {language === "es" ? "Capa Agéntica Empresarial para PyMEs" : "Enterprise Agentic Layer for PyMEs"}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <React.Fragment key={item.key}>
              {item.sectionLabel && (
                <div style={{
                  padding: "0.6rem 0.5rem 0.2rem",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  borderTop: "1px solid var(--border-color)",
                  marginTop: "0.5rem",
                  textAlign: "left",
                }}>
                  {item.sectionLabel}
                </div>
              )}
              <button 
                className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""}`}
                disabled={item.disabled}
                onClick={() => !item.disabled && setActiveTab(item.key as any)}
                style={{ opacity: item.disabled ? 0.5 : 1, cursor: item.disabled ? "not-allowed" : "pointer" }}
              >
                {item.icon} {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer User profile */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar flex-center">
            GJ
          </div>
          <div className="user-details">
            <span className="user-name">Gabriel Juarez</span>
            <span className="user-status">
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              gjuarezort (default)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
