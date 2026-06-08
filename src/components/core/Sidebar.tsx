import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
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
  Menu,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    parsedData,
    advancedMode,
    tTab,
    sidebarOpen,
    setSidebarOpen,
  } = useDashboard();

  // Local state for hover expansion (when collapsed/unpinned)
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Sidebar is visually expanded if it is pinned (sidebarOpen) OR hovered (sidebarHovered)
  const isExpanded = sidebarOpen || sidebarHovered;

  // Reorganized categories: Applications -> Agentic Layer -> System
  const navItems: {
    key: string;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    sectionLabel?: string;
  }[] = [
    { key: "home",          icon: <Grid size={16} />,              label: tTab("home") },
    
    // Applications Section
    { key: "reconciliation",icon: <ArrowLeftRight size={16} />,    label: tTab("reconciliation"), sectionLabel: language === "es" ? "Aplicaciones" : "Applications" },
    { key: "monthlyClose",  icon: <CalendarCheck size={16} />,     label: tTab("monthlyClose") },
    { key: "taxAlerts",     icon: <Receipt size={16} />,           label: tTab("taxAlerts") },
    { key: "templates",     icon: <Package size={16} />,           label: tTab("templates") },
    
    // Agentic Layer Section
    { key: "connections",   icon: <Database size={16} />,          label: tTab("connections"),   sectionLabel: language === "es" ? "Capa Agéntica" : "Agentic Layer" },
    { key: "skills",        icon: <SlidersHorizontal size={16} />, label: tTab("skills") },
    { key: "agents",        icon: <Sparkles size={16} />,          label: tTab("agents") },
    { key: "visualGraph",   icon: <Cpu size={16} />,               label: tTab("visualGraph") },
    { key: "playground",    icon: <Play size={16} />,              label: tTab("playground"),    disabled: !parsedData },
    ...(advancedMode ? [{ key: "recipe", icon: <FileCode size={16} />, label: tTab("recipe"), disabled: !parsedData }] : []),
    
    // System Section
    { key: "integrations",  icon: <Link size={16} />,              label: tTab("integrations"),  sectionLabel: language === "es" ? "Sistema" : "System" },
    { key: "settings",      icon: <SlidersHorizontal size={16} />, label: tTab("settings") },
  ];

  return (
    <aside
      className={`sidebar ${!isExpanded ? "collapsed" : ""} ${isExpanded && !sidebarOpen ? "overlay-shadow" : ""}`}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <div>
        {/* Sidebar Header: Brand acts as toggle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>

          {/* Brand Logo & Name (Toggles sidebarOpen / Pinned State) */}
          <div 
            className={`sidebar-brand ${!isExpanded ? "collapsed" : ""}`} 
            style={{ marginBottom: 0, cursor: "pointer", position: "relative" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={() => setSidebarHovered(true)}
            title={sidebarOpen ? (language === "es" ? "Contraer barra lateral" : "Collapse sidebar") : (language === "es" ? "Abrir barra lateral" : "Open sidebar")}
          >
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
            <div style={{
              minWidth: 0,
              opacity: isExpanded ? 1 : 0,
              maxWidth: isExpanded ? "180px" : "0px",
              overflow: "hidden",
              transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              paddingLeft: "0.4rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
                  Agenttis
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {language === "es" ? "Capa Agéntica Empresarial" : "Enterprise Agentic Layer"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <React.Fragment key={item.key}>
              {item.sectionLabel && (
                <div style={{
                  padding: isExpanded ? "0.6rem 0.5rem 0.2rem" : "0.6rem 0 0.2rem",
                  borderTop: "1px solid var(--border-color)",
                  marginTop: "0.5rem",
                  textAlign: isExpanded ? "left" : "center",
                  transition: "all 0.35s"
                }}>
                  {isExpanded ? (
                    <span style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      whiteSpace: "nowrap"
                    }}>
                      {item.sectionLabel}
                    </span>
                  ) : (
                    <div style={{ width: "100%", height: "1px", background: "var(--border-color)", margin: "0.4rem 0" }} />
                  )}
                </div>
              )}
              <button 
                className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""} ${!isExpanded ? "collapsed" : ""}`}
                disabled={item.disabled}
                onClick={() => !item.disabled && setActiveTab(item.key as any)}
                style={{ opacity: item.disabled ? 0.5 : 1, cursor: item.disabled ? "not-allowed" : "pointer" }}
                data-tooltip={item.label}
              >
                {item.icon}
                <span style={{
                  opacity: isExpanded ? 1 : 0,
                  maxWidth: isExpanded ? "200px" : "0px",
                  overflow: "hidden",
                  transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  whiteSpace: "nowrap"
                }}>
                  {item.label}
                </span>
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer User profile */}
      <div className={`sidebar-footer ${!isExpanded ? "collapsed" : ""}`}>
        <div className={`user-profile-card ${!isExpanded ? "collapsed" : ""}`}>
          <div className="user-avatar flex-center">
            GJ
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            opacity: isExpanded ? 1 : 0,
            maxWidth: isExpanded ? "180px" : "0px",
            transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap"
          }}>
            <span className="user-name">Gabriel Juarez</span>
            <span className="user-status">
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              gjuarezort
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
