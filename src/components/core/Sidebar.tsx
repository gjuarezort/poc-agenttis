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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [logoHovered, setLogoHovered] = useState(false);

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
    // Applications Section
    { key: "reconciliation",icon: <ArrowLeftRight size={18} strokeWidth={1.5} />,    label: tTab("reconciliation"), sectionLabel: language === "es" ? "Aplicaciones" : "Applications" },
    { key: "monthlyClose",  icon: <CalendarCheck size={18} strokeWidth={1.5} />,     label: tTab("monthlyClose") },
    { key: "taxAlerts",     icon: <Receipt size={18} strokeWidth={1.5} />,           label: tTab("taxAlerts") },
    { key: "templates",     icon: <Package size={18} strokeWidth={1.5} />,           label: tTab("templates") },
    
    // Agentic Layer Section
    { key: "connections",   icon: <Database size={18} strokeWidth={1.5} />,          label: tTab("connections"),   sectionLabel: language === "es" ? "Capa Agéntica" : "Agentic Layer" },
    { key: "skills",        icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: tTab("skills") },
    { key: "agents",        icon: <Sparkles size={18} strokeWidth={1.5} />,          label: tTab("agents") },
    { key: "visualGraph",   icon: <Cpu size={18} strokeWidth={1.5} />,               label: tTab("visualGraph") },
    { key: "playground",    icon: <Play size={18} strokeWidth={1.5} />,              label: tTab("playground"),    disabled: !parsedData },
    ...(advancedMode ? [{ key: "recipe", icon: <FileCode size={18} strokeWidth={1.5} />, label: tTab("recipe"), disabled: !parsedData }] : []),
    
    // System Section
    { key: "integrations",  icon: <Link size={18} strokeWidth={1.5} />,              label: tTab("integrations"),  sectionLabel: language === "es" ? "Sistema" : "System" },
    { key: "settings",      icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: tTab("settings") },
  ];

  return (
    <aside
      className={`sidebar ${!isExpanded ? "collapsed" : ""} ${isExpanded && !sidebarOpen ? "overlay-shadow" : ""}`}
      onMouseLeave={() => {
        setSidebarHovered(false);
        setLogoHovered(false);
      }}
    >
      <div>
        {/* Sidebar Header: acts as the trigger for the hover overlay */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isExpanded ? "space-between" : "center",
            marginBottom: "1.5rem",
            position: "relative",
            minHeight: "44px",
            cursor: !sidebarOpen ? "pointer" : "default"
          }}
          onMouseEnter={() => {
            if (!sidebarOpen) {
              setSidebarHovered(true);
              setLogoHovered(true);
            }
          }}
          onMouseLeave={() => {
            setLogoHovered(false);
          }}
          onClick={() => {
            if (!sidebarOpen) {
              setSidebarOpen(true);
              setLogoHovered(false);
            }
          }}
        >
          {/* Brand area (Logo / Open Button + Text) */}
          <div 
            className={`sidebar-brand ${!isExpanded ? "collapsed" : ""}`} 
            style={{ 
              marginBottom: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.25s"
            }}
            onClick={(e) => {
              if (sidebarOpen) {
                e.stopPropagation();
                setActiveTab("home" as any);
              }
            }}
            title={!sidebarOpen ? (language === "es" ? "Abrir barra lateral" : "Open sidebar") : (language === "es" ? "Ir al Inicio" : "Go to Home")}
          >
            <div style={{ width: "42px", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
              {(!sidebarOpen && logoHovered) ? (
                <div className="flex-center animate-fade-in" style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  background: "var(--bg-surface-hover)", color: "var(--text-primary)"
                }}>
                  <PanelLeftOpen size={20} strokeWidth={1.5} />
                </div>
              ) : (
                <div className="flex-center animate-fade-in" style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                  width: "28px", height: "28px", borderRadius: "6px",
                  color: "#000000", fontWeight: 800, fontSize: "0.95rem",
                  boxShadow: "0 2px 6px var(--color-primary-glow)"
                }}>
                  A
                </div>
              )}
            </div>
            
            <div style={{ 
              whiteSpace: "nowrap",
              opacity: isExpanded ? 1 : 0,
              maxWidth: isExpanded ? "180px" : "0px",
              overflow: "hidden",
              transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: isExpanded ? "auto" : "none",
              paddingLeft: "0.2rem"
            }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.2px" }}>
                Agenttis
              </span>
            </div>
          </div>

          {/* Toggle Button (ONLY visible when pinned!) */}
          {sidebarOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
              className="sidebar-toggle-btn animate-fade-in"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                transition: "background 0.2s, color 0.2s",
                outline: "none",
                flexShrink: 0
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--bg-surface-hover)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              title={language === "es" ? "Cerrar barra lateral" : "Close sidebar"}
            >
              <PanelLeftClose size={20} strokeWidth={1.5} />
            </button>
          )}
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
                  {isExpanded && (
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
