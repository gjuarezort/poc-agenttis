import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import NextLink from "next/link";
import {
  Grid,
  Database,
  SlidersHorizontal,
  Sparkles,
  Cpu,
  Play,
  FileCode,
  CalendarCheck,
  Package,
  Link,
  Server,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Lock,
  ChevronUp,
  ChevronDown,
  Store,
  Activity,
  Infinity,
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
    mobileMenuOpen,
    setMobileMenuOpen,
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
  
  // Collapsible sub-menu state for the Agentic Layer
  const [agenticOpen, setAgenticOpen] = useState(true);

  // Sidebar is visually expanded if it is pinned (sidebarOpen) OR hovered (sidebarHovered)
  const isExpanded = sidebarOpen || sidebarHovered;

  // The close is its own app at `/`, not a tab in here. Reconciliation and tax
  // alerts are steps 3 and 4 of that flow, so they no longer appear as peers.
  const applicationsItems = [
    { key: "monthlyClose", href: "/", icon: <CalendarCheck size={18} strokeWidth={1.5} />, label: tTab("monthlyClose") },
  ];

  const agenticItems = [
    { key: "connections",       icon: <Database size={18} strokeWidth={1.5} />,          label: tTab("connections") },
    { key: "skills",            icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: tTab("skills") },
    { key: "mcpServers",        icon: <Server size={18} strokeWidth={1.5} />,            label: tTab("mcpServers") },
    { key: "agents",            icon: <Sparkles size={18} strokeWidth={1.5} />,          label: tTab("agents") },
    { key: "apps",              icon: <Grid size={18} strokeWidth={1.5} />,              label: tTab("apps") },
    { key: "visualGraph",       icon: <Cpu size={18} strokeWidth={1.5} />,               label: tTab("visualGraph") },
    { key: "playground",        icon: <Play size={18} strokeWidth={1.5} />,              label: tTab("playground"),    disabled: !parsedData },
    ...(advancedMode ? [{ key: "recipe", icon: <FileCode size={18} strokeWidth={1.5} />, label: tTab("recipe"), disabled: !parsedData }] : []),
    { key: "observability",     icon: <Activity size={18} strokeWidth={1.5} />,          label: tTab("observability") },
    { key: "decisionSimulator", icon: <Infinity size={18} strokeWidth={1.5} />,          label: tTab("decisionSimulator") },
  ];

  const systemItems = [
    { key: "users",             icon: <Shield size={18} strokeWidth={1.5} />,            label: tTab("users") },
    { key: "marketplace",       icon: <Store size={18} strokeWidth={1.5} />,             label: tTab("marketplace") },
    { key: "settings",          icon: <SlidersHorizontal size={18} strokeWidth={1.5} />, label: tTab("settings") },
  ];

  const agenticKeys = [
    "connections",
    "skills",
    "mcpServers",
    "agents",
    "apps",
    "visualGraph",
    "playground",
    "recipe",
    "observability",
    "decisionSimulator"
  ];

  const renderNavItem = (item: any, isSubItem: boolean = false) => {
    const isLocked = !hasPermission(item.key);
    const sharedStyle = {
      opacity: item.disabled ? 0.5 : (isLocked ? 0.65 : 1),
      cursor: item.disabled ? "not-allowed" : "pointer",
      padding: isExpanded && isSubItem ? "0.6rem 0.8rem" : "0.7rem 1rem",
    } as React.CSSProperties;

    const body = (
      <>
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
      </>
    );

    const tooltip = isLocked ? `${item.label} (${language === "es" ? "Restringido" : "Restricted"})` : item.label;

    // Items with an href leave the platform shell for a route of their own.
    if (item.href) {
      return (
        <NextLink
          key={item.key}
          href={item.href}
          className={`sidebar-nav-item ${!isExpanded ? "collapsed" : ""}`}
          style={{ ...sharedStyle, textDecoration: "none" }}
          data-tooltip={tooltip}
          onClick={() => setMobileMenuOpen(false)}
        >
          {body}
        </NextLink>
      );
    }

    return (
      <button 
        key={item.key}
        className={`sidebar-nav-item ${activeTab === item.key ? "active" : ""} ${!isExpanded ? "collapsed" : ""}`}
        disabled={item.disabled}
        onClick={() => {
          if (!item.disabled) {
            // Navigating into the agentic layer expands it, so the active item
            // is never hidden inside a collapsed section.
            if (agenticKeys.includes(item.key)) setAgenticOpen(true);
            setActiveTab(item.key as any);
            setMobileMenuOpen(false);
          }
        }}
        style={sharedStyle}
        data-tooltip={tooltip}
      >
        {body}
      </button>
    );
  };

  return (
    <aside
      className={`sidebar ${!isExpanded ? "collapsed" : ""} ${isExpanded && !sidebarOpen ? "overlay-shadow" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
      onMouseLeave={() => {
        setSidebarHovered(false);
        setLogoHovered(false);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between"
      }}
    >
      {/* Sidebar Header Container (Sticky) */}
      <div style={{ flexShrink: 0 }}>
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
              if (!sidebarOpen) {
                setSidebarOpen(true);
                setLogoHovered(false);
              } else {
                e.stopPropagation();
                setActiveTab("home" as any);
                setMobileMenuOpen(false);
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
      </div>

      {/* Middle Navigation Section (Scrollable) */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          minHeight: 0,
          marginRight: "-0.5rem",
          paddingRight: "0.5rem"
        }} 
        className="sidebar-nav-scrollable"
      >
        <nav className="sidebar-nav">
          {/* Applications Header */}
          <div style={{
            padding: isExpanded ? "0.6rem 0.5rem 0.2rem" : "0.6rem 0 0.2rem",
            marginTop: "0.2rem",
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
                {language === "es" ? "Aplicaciones" : "Applications"}
              </span>
            )}
          </div>
          {applicationsItems.map(item => renderNavItem(item))}

          {/* Collapsible Agentic Layer Section */}
          <div style={{
            borderTop: "1px solid var(--border-color)",
            marginTop: "0.5rem",
            paddingTop: "0.5rem"
          }}>
            <button
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                  setAgenticOpen(true);
                } else {
                  setAgenticOpen(!agenticOpen);
                }
              }}
              className={`sidebar-nav-item ${!isExpanded ? "collapsed" : ""}`}
              style={{
                cursor: "pointer",
                color: "var(--text-secondary)",
                background: "transparent",
                border: "none",
                width: "100%",
                padding: "0.7rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                borderRadius: "24px"
              }}
            >
              <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-primary)]" />
              <span style={{
                opacity: isExpanded ? 1 : 0,
                maxWidth: isExpanded ? "200px" : "0px",
                overflow: "hidden",
                transition: "opacity 0.25s, max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                width: "100%",
                fontWeight: 600,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)"
              }}>
                {language === "es" ? "Capa Agéntica" : "Agentic Layer"}
                {isExpanded && (
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      marginLeft: "auto", 
                      transform: agenticOpen ? "rotate(180deg)" : "none", 
                      transition: "transform 0.2s",
                      opacity: 0.6
                    }} 
                  />
                )}
              </span>
            </button>

            {/* Sub-items list with vertical line indicator */}
            {isExpanded && agenticOpen && (
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  borderLeft: "1px solid var(--border-color)",
                  marginLeft: "1.45rem",
                  paddingLeft: "0.5rem",
                  marginTop: "0.25rem",
                  transition: "all 0.3s"
                }} 
                className="animate-fade-in"
              >
                {agenticItems.map(item => renderNavItem(item, true))}
              </div>
            )}
          </div>

          {/* System Header */}
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
                {language === "es" ? "Sistema" : "System"}
              </span>
            )}
          </div>
          {systemItems.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Sidebar Footer User profile (Sticky) */}
      <div 
        className={`sidebar-footer ${!isExpanded ? "collapsed" : ""}`} 
        style={{ flexShrink: 0, position: "relative", marginTop: "1.25rem" }}
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
