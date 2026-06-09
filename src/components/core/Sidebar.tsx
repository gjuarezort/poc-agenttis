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
  Server,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Lock,
  ChevronUp,
  Store,
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
    theme,
    currentUser,
    changeUserSession,
    users,
    hasPermission
  } = useDashboard();

  // Local state for hover expansion (when collapsed/unpinned)
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

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
    
    // Agentic Layer Section
    { key: "connections",   icon: <Database size={18} strokeWidth={1.5} />,          label: tTab("connections"),   sectionLabel: language === "es" ? "Capa Agéntica" : "Agentic Layer" },
    { key: "skills",        icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: tTab("skills") },
    { key: "mcpServers",    icon: <Server size={18} strokeWidth={1.5} />,            label: tTab("mcpServers") },
    { key: "agents",        icon: <Sparkles size={18} strokeWidth={1.5} />,          label: tTab("agents") },
    { key: "apps",          icon: <Grid size={18} strokeWidth={1.5} />,              label: tTab("apps") },
    { key: "visualGraph",   icon: <Cpu size={18} strokeWidth={1.5} />,               label: tTab("visualGraph") },
    { key: "playground",    icon: <Play size={18} strokeWidth={1.5} />,              label: tTab("playground"),    disabled: !parsedData },
    ...(advancedMode ? [{ key: "recipe", icon: <FileCode size={18} strokeWidth={1.5} />, label: tTab("recipe"), disabled: !parsedData }] : []),
    
    { key: "users",         icon: <Shield size={18} strokeWidth={1.5} />,            label: tTab("users"), sectionLabel: language === "es" ? "Sistema" : "System" },
    { key: "marketplace",   icon: <Store size={18} strokeWidth={1.5} />,             label: tTab("marketplace") },
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
            height: "72px",
            display: "flex", 
            alignItems: "center", 
            justifyContent: isExpanded ? "space-between" : "center",
            borderBottom: "1px solid var(--border-color)",
            margin: isExpanded ? "0 -1rem 1rem -1rem" : "0 -0.4rem 1rem -0.4rem",
            paddingLeft: isExpanded ? "1rem" : "0",
            paddingRight: isExpanded ? "0.5rem" : "0",
            boxSizing: "border-box",
            position: "relative",
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
                <div className="flex-center animate-fade-in logo-handwritten" style={{
                  background: theme === "dark" ? "#ffffff" : "#000000",
                  width: "28px", height: "28px", borderRadius: "6px",
                  color: theme === "dark" ? "#000000" : "#ffffff",
                  fontSize: "1.35rem",
                  boxShadow: "0 2px 6px var(--color-primary-glow)",
                  fontFamily: "var(--font-cursive)",
                  paddingBottom: "2px"
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
              <span className="logo-handwritten" style={{ fontSize: "1.45rem", letterSpacing: "0.2px" }}>
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
          {navItems.map((item, index) => (
            <React.Fragment key={item.key}>
              {item.sectionLabel && (
                <div style={{
                  padding: isExpanded ? "0.6rem 0.5rem 0.2rem" : "0.6rem 0 0.2rem",
                  borderTop: index === 0 ? "none" : "1px solid var(--border-color)",
                  marginTop: index === 0 ? "0.2rem" : "0.5rem",
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
              {(() => {
                const isLocked = !hasPermission(item.key);
                return (
                  <button 
                    className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""} ${!isExpanded ? "collapsed" : ""}`}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && setActiveTab(item.key as any)}
                    style={{ 
                      opacity: item.disabled ? 0.5 : (isLocked ? 0.65 : 1), 
                      cursor: item.disabled ? "not-allowed" : "pointer" 
                    }}
                    data-tooltip={isLocked ? `${item.label} (${language === "es" ? "Restringido" : "Restricted"})` : item.label}
                  >
                    {item.icon}
                    <span style={{
                      opacity: isExpanded ? 1 : 0,
                      maxWidth: isExpanded ? "200px" : "0px",
                      overflow: "hidden",
                      transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      width: "100%"
                    }}>
                      {item.label}
                      {isLocked && isExpanded && (
                        <Lock size={12} style={{ marginLeft: "auto", opacity: 0.6, color: "var(--text-muted)" }} />
                      )}
                    </span>
                  </button>
                );
              })()}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer User profile */}
      <div 
        className={`sidebar-footer ${!isExpanded ? "collapsed" : ""}`} 
        style={{ position: "relative" }}
      >
        {/* Floating User Switcher Popover */}
        {switcherOpen && (
          <div 
            className="glass-panel animate-fade-in" 
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: isExpanded ? "0.5rem" : "0.2rem",
              width: isExpanded ? "240px" : "180px",
              padding: "0.5rem",
              zIndex: 1100,
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              background: "var(--bg-surface-solid)",
              border: "1px solid var(--border-color-glow)"
            }}
          >
            <div style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "0.35rem 0.5rem",
              borderBottom: "1px solid var(--border-color)",
              marginBottom: "0.25rem"
            }}>
              {language === "es" ? "Cambiar de Sesión" : "Switch User Session"}
            </div>
            
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    changeUserSession(u);
                    setSwitcherOpen(false);
                  }}
                  className="sidebar-nav-item"
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    justifyContent: "flex-start",
                    background: u.id === currentUser.id ? "var(--color-primary-glow)" : "transparent",
                    color: u.id === currentUser.id ? "var(--color-primary)" : "var(--text-secondary)",
                    border: "none",
                    width: "100%",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseOver={(e) => {
                    if (u.id !== currentUser.id) {
                      e.currentTarget.style.background = "var(--bg-surface-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (u.id !== currentUser.id) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <div className="user-avatar flex-center" style={{ width: "24px", height: "24px", fontSize: "0.7rem", flexShrink: 0 }}>
                    {u.avatar}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {u.name}
                    </span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                      {u.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clickable Profile Card */}
        <div 
          className={`user-profile-card ${!isExpanded ? "collapsed" : ""}`}
          onClick={() => setSwitcherOpen(!switcherOpen)}
          style={{
            cursor: "pointer",
            border: switcherOpen ? "1px solid var(--border-color-glow)" : "1px solid transparent",
            background: switcherOpen ? "var(--bg-surface-hover)" : "transparent",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            if (!switcherOpen) e.currentTarget.style.background = "var(--bg-surface-hover)";
          }}
          onMouseOut={(e) => {
            if (!switcherOpen) e.currentTarget.style.background = "transparent";
          }}
          title={language === "es" ? "Cambiar de usuario" : "Switch user profile"}
        >
          <div className="user-avatar flex-center">
            {currentUser.avatar}
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            opacity: isExpanded ? 1 : 0,
            maxWidth: isExpanded ? "150px" : "0px",
            transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
            flex: 1
          }}>
            <span className="user-name">{currentUser.name}</span>
            <span className="user-status">
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              {currentUser.username}
            </span>
          </div>
          {isExpanded && (
            <ChevronUp size={14} style={{ color: "var(--text-muted)", marginLeft: "auto", flexShrink: 0, transform: switcherOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          )}
        </div>
      </div>
    </aside>
  );
};
