import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Cpu, Zap, Clock, ArrowRight, TrendingDown, ChevronDown } from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  dataSources: string[];
  skills: string[];
  users: string[];
  requireConfirmation: boolean;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  type: "read" | "action";
  status: "active";
}

export const PlaygroundTab: React.FC = () => {
  const { language,
  parsedData,
  fileName,
  query,
  setQuery,
  chatLoading,
  chatHistory,
  setChatHistory,
  selectedPlaygroundAgent,
  setSelectedPlaygroundAgent,
  selectedTraceStep,
  setSelectedTraceStep,
  agents,
  skills,
  mockConnections,
  handleQuerySubmit,
  setActiveTab,
  chatEndRef,
  setHeaderAction, } = useDashboard();

  const t = React.useCallback((key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  }, [language]);

  React.useEffect(() => {
    setHeaderAction(
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          {language === "es" ? "Agente:" : "Agent:"}
        </span>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <select
            value={selectedPlaygroundAgent}
            onChange={e => {
              setSelectedPlaygroundAgent(e.target.value);
              setChatHistory([]); // Clear chat history when switching agent
            }}
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              padding: "0 2.2rem 0 0.85rem",
              background: "var(--bg-surface-solid)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              cursor: "pointer",
              width: "auto",
              height: "38px",
              appearance: "none",
              WebkitAppearance: "none",
              margin: 0,
              boxSizing: "border-box"
            }}
          >
            {agents.map(a => (
              <option key={a.id} value={a.id} style={{ background: "var(--bg-surface-solid)", color: "var(--text-primary)" }}>
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--text-muted)"
            }}
          />
        </div>
        <button 
          onClick={() => setChatHistory([])} 
          className="btn btn-secondary" 
          style={{ padding: "0 1rem", fontSize: "0.85rem", height: "38px", margin: 0, boxSizing: "border-box" }}
        >
          {t("clearChat")}
        </button>
      </div>
    );
    return () => setHeaderAction(null);
  }, [language, agents, selectedPlaygroundAgent, setSelectedPlaygroundAgent, setChatHistory, setHeaderAction, t]);

  const renderInlineBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return text;
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const renderAgentText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: "0.4rem" }} />;
      if (/^[\-\*•]\s/.test(line)) {
        return (
          <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", margin: "0.15rem 0" }}>
            <span style={{ color: "var(--color-accent)", flexShrink: 0, lineHeight: 1.6, fontSize: "0.7rem", marginTop: "0.2rem" }}>▸</span>
            <span style={{ lineHeight: 1.6, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              {renderInlineBold(line.slice(2))}
            </span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/);
        if (match)
          return (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", margin: "0.15rem 0" }}>
              <span style={{ color: "var(--color-primary)", flexShrink: 0, fontWeight: 700, minWidth: "1.2rem", lineHeight: 1.6, fontSize: "0.82rem" }}>
                {match[1]}.
              </span>
              <span style={{ lineHeight: 1.6, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                {renderInlineBold(match[2])}
              </span>
            </div>
          );
      }
      if (/^\*\*.*\*\*:?\s*$/.test(line.trim())) {
        return (
          <p key={i} style={{ margin: "0.4rem 0 0.1rem", fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      return (
        <p key={i} style={{ margin: "0.1rem 0", lineHeight: 1.6, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          {renderInlineBold(line)}
        </p>
      );
    });
  };

  const samplePrompts =
    language === "es"
      ? [
          "¿Cuál es el promedio de total_spent en Italia?",
          "Buscar registros que contengan 'SSD'",
          "Mostrar esquema de columnas y tamaño del conjunto de datos",
          "Listar principales clientes activos ordenados por total_spent desc",
          "Promedio de precio de productos agrupado por categoría",
        ]
      : [
          "What is the average total_spent in Italy?",
          "Search for records containing 'SSD'",
          "Show column schema & dataset size",
          "List top active customers sorted by spent desc",
          "Average price of products grouped by category",
        ];

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)", gap: "1.25rem", height: "calc(100vh - 170px)" }}>
      {/* Left Column Chat frame */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.25rem" }}>
        {/* Clear spacer in place of header */}
        <div style={{ height: "0.25rem" }} />

        {/* Message loop */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.4rem", display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "0.75rem" }}>
          {chatHistory.length === 0 ? (
            <div style={{ margin: "auto", maxWidth: "450px", textAlign: "center", padding: "1.5rem" }}>
              <Cpu size={36} style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }} />
              <h4 style={{ marginBottom: "0.4rem" }}>{t("noMessages")}</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>{t("noMessagesDesc")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {samplePrompts.slice(0, 3).map((p, i) => (
                  <div
                    key={i}
                    className="glass-panel glass-panel-interactive"
                    onClick={() => setQuery(p)}
                    style={{ padding: "0.5rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", textAlign: "left", background: "var(--bg-surface-solid)" }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                }}
              >
                {/* Avatar */}
                <div style={{
                  flexShrink: 0,
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: msg.role === "user" ? "var(--color-primary)" : "var(--bg-surface-hover)",
                  border: "1px solid",
                  borderColor: msg.role === "user" ? "var(--color-primary)" : "var(--border-color)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: msg.role === "user" ? "#fff" : "var(--color-accent)",
                  marginTop: "0.1rem",
                }}>
                  {msg.role === "user" ? "Tú" : <Cpu size={14} />}
                </div>

                {/* Bubble + meta */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", maxWidth: "82%", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", paddingLeft: msg.role === "agent" ? "0.1rem" : 0, paddingRight: msg.role === "user" ? "0.1rem" : 0 }}>
                    {msg.role === "user" ? (language === "es" ? "Tú" : "You") : "Agenttis"}
                  </span>

                  <div style={{
                    padding: "0.75rem 1rem",
                    background: msg.role === "user" ? "var(--color-primary)" : "var(--bg-surface-solid)",
                    border: "1px solid",
                    borderColor: msg.role === "user" ? "var(--color-primary)" : "var(--border-color)",
                    borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    wordBreak: "break-word",
                    color: msg.role === "user" ? "#fff" : "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    boxShadow: msg.role === "user" ? "0 2px 12px var(--color-primary-glow)" : "0 2px 8px rgba(0,0,0,0.15)",
                  }}>
                    {msg.role === "user" ? msg.text : <div style={{ display: "flex", flexDirection: "column", gap: "0.05rem" }}>{renderAgentText(msg.text)}</div>}
                  </div>

                  {msg.role === "agent" && msg.metrics && (
                    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.68rem", color: "var(--text-muted)", alignItems: "center", paddingLeft: "0.1rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "var(--color-success)" }}>
                        <Zap size={9} /> {t("tokensSaved").replace("{percent}", msg.metrics.savingsPercent)}
                      </span>
                      <span style={{ color: "var(--border-color)" }}>•</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        <Clock size={9} /> {msg.metrics.mcpLatency}ms
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {chatLoading && (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "0.6rem" }}>
              <div style={{
                flexShrink: 0, width: "30px", height: "30px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)",
                color: "var(--color-accent)", marginTop: "0.1rem",
              }}>
                <Cpu size={14} />
              </div>
              <div style={{
                padding: "0.75rem 1rem",
                background: "var(--bg-surface-solid)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px 16px 16px 16px",
                display: "flex", gap: "0.3rem", alignItems: "center",
              }}>
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleQuerySubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={t("inputPlaceholder")} disabled={chatLoading} />
          <button type="submit" className="btn btn-primary" disabled={chatLoading || !query.trim()}>
            {t("sendBtn")} <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* Right Column details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%", overflowY: "auto" }}>
        {/* Agent Security Context / Permissions */}
        {(() => {
          const activeAgent = agents.find(a => a.id === selectedPlaygroundAgent) || agents[0];
          const availableConnections = [
            ...mockConnections,
            ...(parsedData ? [{ id: "file-active", name: fileName, category: "CSV" }] : []),
          ];

          return (
            <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700 }}>
                    {language === "es" ? "Gobernanza del Agente" : "Agent Governance"}
                  </span>
                  <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-primary)" }}>{activeAgent.name}</h4>
                </div>
                <span className={`badge ${activeAgent.requireConfirmation ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.6rem" }}>
                  {activeAgent.requireConfirmation ? (language === "es" ? "🛡️ Verificación Humana" : "🛡️ Human Validation") : "⚡ Autopilot"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{activeAgent.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.78rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
                <div>
                  <strong style={{ color: "var(--text-muted)" }}>{language === "es" ? "Acceso a Datos: " : "Data Access: "}</strong>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {activeAgent.dataSources
                      .map((dsId: string) => {
                        const ds = availableConnections.find(c => c.id === dsId);
                        return ds ? ds.name : dsId;
                      })
                      .join(", ") || (language === "es" ? "Ninguno" : "None")}
                  </span>
                </div>
                <div>
                  <strong style={{ color: "var(--text-muted)" }}>{language === "es" ? "Acciones: " : "Action Skills: "}</strong>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {activeAgent.skills
                      .map((skId: string) => {
                        const sk = skills.find(s => s.id === skId);
                        return sk ? sk.name : skId;
                      })
                      .join(", ") || (language === "es" ? "Ninguna" : "None")}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Link to Settings */}
        <div className="glass-panel glass-panel-interactive" onClick={() => setActiveTab("settings")} style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TrendingDown size={14} style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{t("efficiencyTitle")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{language === "es" ? "Ver en Configuración" : "See in Settings"}</span>
            <ArrowRight size={13} style={{ color: "var(--text-muted)" }} />
          </div>
        </div>

        {/* Traces */}
        <div className="glass-panel" style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Cpu size={16} style={{ color: "var(--color-primary)" }} /> {t("reasoningTrace")}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{t("reasoningDesc")}</p>

          {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "agent" && chatHistory[chatHistory.length - 1].trace ? (
            (() => {
              const currentTrace = chatHistory[chatHistory.length - 1].trace;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", flex: 1 }}>
                  {currentTrace.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        background: selectedTraceStep === step.step ? "var(--bg-surface-solid)" : "transparent",
                      }}
                    >
                      <div
                        onClick={() => setSelectedTraceStep(selectedTraceStep === step.step ? null : step.step)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          borderBottom: selectedTraceStep === step.step ? "1px solid var(--border-color)" : "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}>
                          <span
                            className="flex-center"
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background:
                                step.type === "thought"
                                  ? "var(--color-primary-glow)"
                                  : step.type === "tool_call"
                                  ? "rgba(6,182,212,0.1)"
                                  : step.type === "tool_response"
                                  ? "rgba(16,185,129,0.1)"
                                  : "rgba(255,255,255,0.05)",
                              color:
                                step.type === "thought"
                                  ? "var(--color-primary)"
                                  : step.type === "tool_call"
                                  ? "var(--color-accent)"
                                  : step.type === "tool_response"
                                  ? "var(--color-success)"
                                  : "var(--text-primary)",
                              fontSize: "0.65rem",
                              fontWeight: "bold",
                            }}
                          >
                            {step.step}
                          </span>
                          <span
                            style={{
                              fontWeight: 600,
                              textTransform: "uppercase",
                              fontSize: "0.7rem",
                              letterSpacing: "0.02em",
                              color:
                                step.type === "thought"
                                  ? "var(--color-primary)"
                                  : step.type === "tool_call"
                                  ? "var(--color-accent)"
                                  : step.type === "tool_response"
                                  ? "var(--color-success)"
                                  : "var(--text-primary)",
                            }}
                          >
                            {step.type}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                          {selectedTraceStep === step.step ? (language === "es" ? "Contraer" : "Collapse") : (language === "es" ? "Expandir" : "Expand")}
                        </span>
                      </div>

                      {selectedTraceStep === step.step && (
                        <div style={{ padding: "0.6rem 0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          <p style={{ margin: "0 0 0.4rem 0", color: "var(--text-primary)", fontSize: "0.8rem", lineHeight: "1.4" }}>{step.message}</p>

                          {step.details && (
                            <pre
                              style={{
                                margin: 0,
                                padding: "0.5rem",
                                background: "#02040a",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                overflowX: "auto",
                                whiteSpace: "pre-wrap",
                                color: "#f8fafc",
                              }}
                            >
                              {JSON.stringify(step.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <div className="flex-center" style={{ flex: 1, border: "1px dashed var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
              {t("reasoningLogsPlaceholder")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
