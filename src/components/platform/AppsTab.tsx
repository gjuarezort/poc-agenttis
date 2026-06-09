import { useDashboard } from "../../context/DashboardContext";
import React, { useState, useEffect } from "react";
import { Plus, XCircle, Grid, Play, ArrowLeft, ArrowRight, ArrowLeftRight, Layers, Key, Database, Cpu, Layout, Info, HelpCircle, Check, Sparkles, BarChart2, List, Activity, MessageSquare } from "lucide-react";

interface Widget {
  id: string;
  type: "kpi" | "list" | "chart" | "chat";
  title: string;
  config: Record<string, any>;
}

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dataSources: string[];
  agents: string[];
  widgets: Widget[];
  installed: boolean;
}

export const AppsTab: React.FC = () => {
  const {
    language,
    apps,
    setApps,
    agents,
    mockConnections,
    parsedData,
    fileName,
    setHeaderAction,
    copyToClipboard
  } = useDashboard();

  // Active view: "list" or "running" (running an app)
  const [activeView, setActiveView] = useState<"list" | "running">("list");
  const [runningApp, setRunningApp] = useState<Application | null>(null);

  // Form & Wizard states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [appName, setAppName] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [appIcon, setAppIcon] = useState("Layout");
  const [appColor, setAppColor] = useState("var(--color-primary)");
  const [appSources, setAppSources] = useState<string[]>([]);
  const [appAgents, setAppAgents] = useState<string[]>([]);
  const [appWidgets, setAppWidgets] = useState<Widget[]>([]);

  // Widget editing states (temporary state while adding widget)
  const [widgetType, setWidgetType] = useState<"kpi" | "list" | "chart" | "chat">("kpi");
  const [widgetTitle, setWidgetTitle] = useState("");
  const [widgetMetric, setWidgetMetric] = useState<"sum" | "average" | "count">("count");
  const [widgetColumn, setWidgetColumn] = useState("");
  const [widgetGroupBy, setWidgetGroupBy] = useState("");
  const [widgetAgentId, setWidgetAgentId] = useState("");

  // Live app state: chat message histories per app widget
  const [widgetChatHistory, setWidgetChatHistory] = useState<Record<string, any[]>>({});
  const [widgetChatQuery, setWidgetChatQuery] = useState<Record<string, string>>({});
  const [widgetChatLoading, setWidgetChatLoading] = useState<Record<string, boolean>>({});

  const availableConnections = [
    ...mockConnections,
    ...(parsedData ? [{ id: "file-active", name: fileName, category: "CSV" }] : [])
  ];

  // Set Topbar Header Actions
  useEffect(() => {
    if (activeView === "list") {
      setHeaderAction(
        <button
          className="btn btn-primary"
          onClick={openNewAppWizard}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          <Plus size={14} /> {language === "es" ? "Nueva Aplicación" : "New Application"}
        </button>
      );
    } else {
      setHeaderAction(
        <button
          className="btn btn-secondary"
          onClick={() => {
            setActiveView("list");
            setRunningApp(null);
          }}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.4rem" }}
        >
          <ArrowLeft size={14} /> {language === "es" ? "Volver al Catálogo" : "Back to Apps"}
        </button>
      );
    }
    return () => setHeaderAction(null);
  }, [activeView, language, setHeaderAction]);

  const openNewAppWizard = () => {
    setAppName("");
    setAppDesc("");
    setAppIcon("Layout");
    setAppColor("var(--color-primary)");
    setAppSources([]);
    setAppAgents([]);
    setAppWidgets([]);
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleAddWidget = () => {
    if (!widgetTitle) return;
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type: widgetType,
      title: widgetTitle,
      config: {
        metric: widgetMetric,
        column: widgetColumn,
        groupBy: widgetGroupBy,
        agentId: widgetAgentId || (appAgents.length > 0 ? appAgents[0] : "")
      }
    };
    setAppWidgets(prev => [...prev, newWidget]);
    setWidgetTitle("");
    setWidgetColumn("");
    setWidgetGroupBy("");
  };

  const handleRemoveWidget = (id: string) => {
    setAppWidgets(prev => prev.filter(w => w.id !== id));
  };

  const saveApplication = () => {
    if (!appName) return;
    const newApp: Application = {
      id: `app-${Date.now()}`,
      name: appName,
      description: appDesc,
      icon: appIcon,
      color: appColor,
      dataSources: appSources,
      agents: appAgents,
      widgets: appWidgets.length > 0 ? appWidgets : [
        { id: `w-chat-${Date.now()}`, type: "chat", title: language === "es" ? "Consola de IA" : "AI Interface", config: { agentId: appAgents[0] || "" } }
      ],
      installed: true
    };
    setApps(prev => [...prev, newApp]);
    setWizardOpen(false);
  };

  // Helper: compute KPI values from parsed CSV data
  const computeKpiValue = (widget: Widget, app: Application) => {
    if (!parsedData || parsedData.length === 0) {
      if (widget.config?.metric === "sum") return "$320,400";
      if (widget.config?.metric === "average") return "$640.80";
      return "120";
    }

    const col = widget.config?.column;
    const metric = widget.config?.metric;

    if (metric === "count") {
      return parsedData.length;
    }

    if (!col) return "0";

    const values = parsedData
      .map((row: any) => parseFloat(String(row[col]).replace(/[^0-9.-]/g, "")))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "N/A";

    if (metric === "sum") {
      const sum = values.reduce((a: number, b: number) => a + b, 0);
      return sum >= 1000 ? `$${sum.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `$${sum.toFixed(2)}`;
    }

    if (metric === "average") {
      const sum = values.reduce((a: number, b: number) => a + b, 0);
      const avg = sum / values.length;
      return `$${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
    }

    return "0";
  };

  // Helper: get grouped counts for charts
  const getGroupedData = (widget: Widget) => {
    const col = widget.config?.groupBy || "country";
    if (!parsedData || parsedData.length === 0) {
      return [
        { label: "Uruguay", value: 45 },
        { label: "Argentina", value: 30 },
        { label: "Brasil", value: 15 },
        { label: "Otros", value: 10 }
      ];
    }

    const counts: Record<string, number> = {};
    parsedData.forEach((row: any) => {
      const val = row[col] || "Unknown";
      counts[val] = (counts[val] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Helper: execute widget chat queries
  const handleWidgetChatSubmit = async (widgetId: string, agentId: string) => {
    const queryStr = widgetChatQuery[widgetId]?.trim();
    if (!queryStr) return;

    setWidgetChatLoading(prev => ({ ...prev, [widgetId]: true }));
    setWidgetChatHistory(prev => ({
      ...prev,
      [widgetId]: [...(prev[widgetId] || []), { role: "user", text: queryStr }]
    }));
    setWidgetChatQuery(prev => ({ ...prev, [widgetId]: "" }));

    const targetAgent = agents.find(a => a.id === agentId);
    const agentName = targetAgent ? targetAgent.name : "Agente";

    // Simulate Agent execution
    setTimeout(() => {
      let answer = "";
      let steps: string[] = [];

      if (queryStr.toLowerCase().includes("promedio") || queryStr.toLowerCase().includes("average")) {
        steps = ["Leyendo fuente de datos vinculada...", "Filtrando valores numéricos...", "Computando promedio matemático..."];
        answer = language === "es" 
          ? `El promedio calculado para la columna de transacciones es de **$842.15 USD** basado en los registros activos.`
          : `The average calculated for the transaction column is **$842.15 USD** based on active records.`;
      } else if (queryStr.toLowerCase().includes("lista") || queryStr.toLowerCase().includes("list")) {
        steps = ["Invocando herramienta de lectura MCP...", "Formateando salida de filas..."];
        answer = language === "es"
          ? `He extraído los últimos clientes registrados. Los principales son: **Cliente ABC** (Uruguay), **Cliente XYZ** (Argentina) y **Proveedor Global** (Brasil).`
          : `I have extracted the latest registered clients. The top ones are: **Client ABC** (Uruguay), **Client XYZ** (Argentina), and **Global Provider** (Brazil).`;
      } else {
        steps = ["Analizando intención de consulta...", "Consultando base de conocimientos...", "Generando respuesta sintética..."];
        answer = language === "es"
          ? `¡Hola! Como tu asistente virtual para esta aplicación, he procesado tu consulta. Por favor indícame si deseas generar un reporte o conciliar transacciones.`
          : `Hello! As your virtual assistant for this application, I have processed your query. Please let me know if you would like to generate a report or reconcile transactions.`;
      }

      setWidgetChatHistory(prev => ({
        ...prev,
        [widgetId]: [
          ...(prev[widgetId] || []),
          { role: "agent", text: answer, steps, sender: agentName }
        ]
      }));
      setWidgetChatLoading(prev => ({ ...prev, [widgetId]: false }));
    }, 1500);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* VIEW 1: APPLICATIONS MARKETPLACE CATALOG */}
        {activeView === "list" && (
          <div className="marketplace-grid">
            {apps.map((app: Application) => {
              const accentColor = app.color || "var(--color-primary)";
              return (
                <div
                  key={app.id}
                  className="glass-panel glass-panel-interactive"
                  style={{ display: "flex", flexDirection: "column", padding: "1.35rem", minWidth: "280px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: accentColor }}>
                      {app.icon === "ArrowLeftRight" && <ArrowLeftRightIcon size={20} />}
                      {app.icon === "Package" && <PackageIcon size={20} />}
                      {app.icon !== "ArrowLeftRight" && app.icon !== "Package" && <Layout size={20} />}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: "0.6rem" }}>
                      Active
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {app.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {app.description}
                    </p>

                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        <span>{language === "es" ? "Agentes Integrados:" : "Assigned Agents:"}</span>
                        <span style={{ fontWeight: 600 }}>{app.agents.length}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        <span>{language === "es" ? "Widgets Disponibles:" : "Configured Widgets:"}</span>
                        <span style={{ fontWeight: 600 }}>{app.widgets.length}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setRunningApp(app);
                        setActiveView("running");
                      }}
                      style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem", gap: "0.3rem" }}
                    >
                      <Play size={12} fill="currentColor" /> {language === "es" ? "Ejecutar Aplicación" : "Run Application"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setApps(prev => prev.filter(a => a.id !== app.id))}
                      style={{ fontSize: "0.75rem", padding: "0.4rem", color: "var(--color-danger)" }}
                    >
                      {language === "es" ? "Eliminar" : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: RUNNING APPLICATION DASHBOARD */}
        {activeView === "running" && runningApp && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass-panel" style={{ padding: "1.5rem", borderLeft: `4px solid ${runningApp.color || "var(--color-primary)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>{runningApp.name}</h2>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{runningApp.description}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {runningApp.dataSources.map(dsId => {
                    const conn = availableConnections.find(c => c.id === dsId);
                    return (
                      <span key={dsId} className="badge badge-info" style={{ fontSize: "0.65rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <Database size={10} /> {conn ? conn.name : dsId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dashboard Workspace widgets grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.25rem" }}>
              {runningApp.widgets.map((w: Widget) => {
                // Different layout sizes depending on type
                let colSpan = "span 4"; // default kpi size
                if (w.type === "list" || w.type === "chart") colSpan = "span 6";
                if (w.type === "chat") colSpan = "span 12";

                return (
                  <div
                    key={w.id}
                    className="glass-panel"
                    style={{ gridColumn: colSpan, padding: "1.35rem", display: "flex", flexDirection: "column", minHeight: w.type === "chat" ? "380px" : "220px", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)" }}
                  >
                    <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                        {w.title}
                      </h4>
                      {w.type === "kpi" && <Activity size={14} style={{ color: runningApp.color }} />}
                      {w.type === "list" && <List size={14} style={{ color: runningApp.color }} />}
                      {w.type === "chart" && <BarChart2 size={14} style={{ color: runningApp.color }} />}
                      {w.type === "chat" && <MessageSquare size={14} style={{ color: runningApp.color }} />}
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      {/* 1. KPI WIDGET */}
                      {w.type === "kpi" && (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", display: "block" }}>
                            {computeKpiValue(w, runningApp)}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {w.config?.label || "Computado en tiempo real"}
                          </span>
                        </div>
                      )}

                      {/* 2. CHART WIDGET */}
                      {w.type === "chart" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                          {getGroupedData(w).map((g, idx) => {
                            const maxVal = Math.max(...getGroupedData(w).map(x => x.value));
                            const percent = maxVal > 0 ? (g.value / maxVal) * 100 : 0;
                            return (
                              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                                  <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{g.label}</span>
                                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{g.value}</span>
                                </div>
                                <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                                  <div style={{ height: "100%", width: `${percent}%`, background: runningApp.color || "var(--color-primary)", borderRadius: "3px" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. LIST WIDGET */}
                      {w.type === "list" && (
                        <div style={{ flex: 1, overflowY: "auto", maxHeight: "160px" }}>
                          {parsedData && parsedData.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                                  <th style={{ textAlign: "left", paddingBottom: "0.4rem" }}>ID</th>
                                  <th style={{ textAlign: "left", paddingBottom: "0.4rem" }}>Name</th>
                                  <th style={{ textAlign: "right", paddingBottom: "0.4rem" }}>Detail</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parsedData.slice(0, w.config?.limit || 5).map((row: any, idx: number) => (
                                  <tr key={idx} style={{ borderBottom: "1px solid var(--bg-surface-hover)" }}>
                                    <td style={{ padding: "0.35rem 0", color: "var(--text-muted)" }}>#{idx + 1}</td>
                                    <td style={{ padding: "0.35rem 0", fontWeight: 600 }}>{row.name || row.item || row.id || "Item"}</td>
                                    <td style={{ padding: "0.35rem 0", textAlign: "right", color: "var(--text-secondary)" }}>
                                      {row.total_spent ? `$${row.total_spent}` : row.stock ? `${row.stock} uds` : "N/A"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                              {language === "es" ? "Por favor sube un dataset en la sección de Datos para ver las filas." : "Please load a dataset in Data Sources to preview rows."}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. CHAT COGNITIVE ASSISTANT WIDGET */}
                      {w.type === "chat" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
                          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "200px", minHeight: "150px", padding: "0.5rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                            {(widgetChatHistory[w.id] || []).length === 0 ? (
                              <div style={{ margin: "auto", textAlign: "center", padding: "1rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                                {language === "es" ? "Realiza consultas al agente asignado sobre las fuentes de datos configuradas." : "Query the assigned agent about the configured data sources."}
                              </div>
                            ) : (
                              (widgetChatHistory[w.id] || []).map((msg, index) => (
                                <div key={index} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: "0.5rem" }}>
                                  <div style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", maxWidth: "80%", fontSize: "0.78rem", background: msg.role === "user" ? "var(--color-primary-glow)" : "var(--bg-surface-hover)", border: msg.role === "user" ? "1px solid var(--color-primary)" : "1px solid var(--border-color)" }}>
                                    {msg.role !== "user" && <span style={{ fontWeight: 700, fontSize: "0.65rem", display: "block", color: "var(--color-accent)", marginBottom: "0.15rem" }}>{msg.sender}</span>}
                                    <span style={{ color: "var(--text-primary)" }}>{msg.text}</span>
                                    {msg.steps && msg.steps.length > 0 && (
                                      <div style={{ marginTop: "0.4rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.3rem" }}>
                                        {msg.steps.map((st: string, sidx: number) => (
                                          <div key={sidx} style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "flex", gap: "0.25rem", alignItems: "center" }}>
                                            <span>✓</span> <span>{st}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                            {widgetChatLoading[w.id] && (
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "0.25rem 0.5rem" }}>
                                {language === "es" ? "Agente pensando..." : "Agent calculating..."}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={widgetChatQuery[w.id] || ""}
                              onChange={e => setWidgetChatQuery(prev => ({ ...prev, [w.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === "Enter") handleWidgetChatSubmit(w.id, w.config?.agentId);
                              }}
                              placeholder={language === "es" ? "Haz una consulta ejecutiva sobre los datos..." : "Query dataset information..."}
                              style={{ fontSize: "0.78rem", padding: "0.45rem 0.75rem", flex: 1 }}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => handleWidgetChatSubmit(w.id, w.config?.agentId)}
                              style={{ fontSize: "0.78rem", padding: "0.45rem 0.9rem" }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SLIDE-OVER WIZARD DRAWER: NEW APP BUILDER */}
      {wizardOpen && (
        <>
          <div className="modal-overlay animate-fade-in" onClick={() => setWizardOpen(false)} />
          <div className="slide-over-panel" style={{ maxWidth: "520px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface-solid)" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
                  {language === "es" ? "Constructor de Aplicaciones" : "Low-Code Dashboard Builder"}
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Step {wizardStep} of 3
                </span>
              </div>
              <button className="btn-secondary" onClick={() => setWizardOpen(false)} style={{ padding: "0.4rem", borderRadius: "50%" }}>
                <XCircle size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* STEP 1: BASIC DETAILS */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      {language === "es" ? "Nombre de la Aplicación" : "Application Name"}
                    </label>
                    <input
                      type="text"
                      placeholder={language === "es" ? "Ej. Portal de Ventas" : "e.g., Sales Dashboard"}
                      value={appName}
                      onChange={e => setAppName(e.target.value)}
                      style={{ fontSize: "0.85rem", width: "100%" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      {language === "es" ? "Descripción" : "Description"}
                    </label>
                    <input
                      type="text"
                      placeholder={language === "es" ? "Ej. Muestra KPIs comerciales y chat de auditoría..." : "e.g., Executive KPI views for sales audits..."}
                      value={appDesc}
                      onChange={e => setAppDesc(e.target.value)}
                      style={{ fontSize: "0.85rem", width: "100%" }}
                    />
                  </div>

                  {/* Icon select */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Icon
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {["Layout", "ArrowLeftRight", "Package"].map(icName => (
                        <button
                          key={icName}
                          className="glass-panel"
                          onClick={() => setAppIcon(icName)}
                          style={{ padding: "0.5rem", border: appIcon === icName ? "2px solid var(--color-primary)" : "1px solid var(--border-color)", cursor: "pointer" }}
                        >
                          {icName === "ArrowLeftRight" && <ArrowLeftRightIcon size={16} />}
                          {icName === "Package" && <PackageIcon size={16} />}
                          {icName === "Layout" && <Layout size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color select */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Theme Color
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {["var(--color-primary)", "var(--color-success)", "var(--color-info)", "var(--color-warning)"].map(c => (
                        <button
                          key={c}
                          onClick={() => setAppColor(c)}
                          style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, border: appColor === c ? "2px solid #ffffff" : "none", cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DATASOURCES & AGENTS BINDING */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      {language === "es" ? "Conectar Fuentes de Datos" : "Bind Data Sources"}
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                      {availableConnections.map(conn => {
                        const checked = appSources.includes(conn.id);
                        return (
                          <label key={conn.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setAppSources(prev =>
                                  checked ? prev.filter(id => id !== conn.id) : [...prev, conn.id]
                                );
                              }}
                              style={{ width: "auto" }}
                            />
                            <span>{conn.name} ({conn.category})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                      {language === "es" ? "Conectar Agentes de IA" : "Bind AI Agents"}
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                      {agents.map(ag => {
                        const checked = appAgents.includes(ag.id);
                        return (
                          <label key={ag.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setAppAgents(prev =>
                                  checked ? prev.filter(id => id !== ag.id) : [...prev, ag.id]
                                );
                              }}
                              style={{ width: "auto" }}
                            />
                            <span>{ag.name} ({ag.role})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: WIDGET DESIGNER */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="glass-panel" style={{ padding: "1rem", background: "var(--bg-surface-hover)" }}>
                    <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-primary)" }}>
                      {language === "es" ? "+ Agregar Widget al Tablero" : "+ Add Workspace Widget"}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                          Widget Type
                        </label>
                        <select
                          value={widgetType}
                          onChange={e => setWidgetType(e.target.value as any)}
                          style={{ fontSize: "0.78rem", padding: "0.3rem", width: "100%" }}
                        >
                          <option value="kpi">{language === "es" ? "KPI (Indicador Métrico)" : "KPI Card"}</option>
                          <option value="chart">{language === "es" ? "Gráfico de Barras" : "Bar Chart"}</option>
                          <option value="list">{language === "es" ? "Tabla de Datos CSV" : "CSV Data Table"}</option>
                          <option value="chat">{language === "es" ? "Consola de Chat del Agente" : "Agent Query Console"}</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                          Widget Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Ventas Totales"
                          value={widgetTitle}
                          onChange={e => setWidgetTitle(e.target.value)}
                          style={{ fontSize: "0.78rem", padding: "0.3rem 0.5rem", width: "100%" }}
                        />
                      </div>

                      {/* KPI CONFIG FIELDS */}
                      {widgetType === "kpi" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Metric</label>
                            <select value={widgetMetric} onChange={e => setWidgetMetric(e.target.value as any)} style={{ fontSize: "0.78rem", padding: "0.25rem" }}>
                              <option value="count">Count (Registros)</option>
                              <option value="sum">Sum (Suma)</option>
                              <option value="average">Average (Promedio)</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Column (for Sum/Avg)</label>
                            <input type="text" placeholder="total_spent" value={widgetColumn} onChange={e => setWidgetColumn(e.target.value)} style={{ fontSize: "0.78rem", padding: "0.25rem" }} />
                          </div>
                        </div>
                      )}

                      {/* CHART CONFIG FIELDS */}
                      {widgetType === "chart" && (
                        <div>
                          <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Group By Column</label>
                          <input type="text" placeholder="e.g. country, category" value={widgetGroupBy} onChange={e => setWidgetGroupBy(e.target.value)} style={{ fontSize: "0.78rem", padding: "0.3rem", width: "100%" }} />
                        </div>
                      )}

                      {/* CHAT CONFIG FIELDS */}
                      {widgetType === "chat" && (
                        <div>
                          <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Bind Agent</label>
                          <select value={widgetAgentId} onChange={e => setWidgetAgentId(e.target.value)} style={{ fontSize: "0.78rem", padding: "0.3rem", width: "100%" }}>
                            <option value="">Default Agent</option>
                            {appAgents.map(aid => {
                              const ag = agents.find(x => x.id === aid);
                              return <option key={aid} value={aid}>{ag ? ag.name : aid}</option>;
                            })}
                          </select>
                        </div>
                      )}

                      <button
                        className="btn btn-primary"
                        onClick={handleAddWidget}
                        style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", width: "fit-content", alignSelf: "flex-end" }}
                      >
                        Add to Dashboard
                      </button>
                    </div>
                  </div>

                  {/* Active widgets list */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                      {language === "es" ? "Widgets Añadidos" : "Configured Dashboard Widgets"}
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "150px", overflowY: "auto" }}>
                      {appWidgets.length === 0 ? (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {language === "es" ? "Aún no has añadido widgets." : "No widgets added yet."}
                        </span>
                      ) : (
                        appWidgets.map(w => (
                          <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "4px" }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>{w.title} <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginLeft: "0.3rem" }}>({w.type.toUpperCase()})</span></span>
                            <button onClick={() => handleRemoveWidget(w.id)} style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontSize: "0.75rem" }}>
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER WIZARD ACTIONS */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", background: "var(--bg-surface-solid)" }}>
              {wizardStep > 1 ? (
                <button className="btn btn-secondary" onClick={() => setWizardStep(prev => prev - 1)} style={{ fontSize: "0.8rem" }}>
                  Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 3 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (wizardStep === 1 && !appName) return;
                    setWizardStep(prev => prev + 1);
                  }}
                  disabled={wizardStep === 1 && !appName}
                  style={{ fontSize: "0.8rem" }}
                >
                  Next
                </button>
              ) : (
                <button className="btn btn-success" onClick={saveApplication} style={{ fontSize: "0.8rem" }}>
                  {language === "es" ? "Guardar y Crear" : "Create Application"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Simple icon subcomponents since lucide-react name binding can be tricky
const ArrowLeftRightIcon = ({ size }: { size: number }) => <ArrowLeftRight size={size} />;
const PackageIcon = ({ size }: { size: number }) => <PackageIconSub size={size} />;
const PackageIconSub = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
