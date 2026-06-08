import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Cpu, X, RefreshCw, ArrowRight } from "lucide-react";

interface CopilotPanelProps {
  context: "reconciliation" | "monthlyClose" | "taxAlerts";
  language: "en" | "es";
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: Array<{ role: "user" | "agent" | "system"; text: string; steps?: string[] }>;
  copilotQuery: string;
  setCopilotQuery: (q: string) => void;
  copilotLoading: boolean;
  handleCopilotSubmit: (text: string) => void;
}



export const CopilotPanel: React.FC<{ context: "reconciliation" | "monthlyClose" | "taxAlerts" }> = ({ context }) => {
  const { 
  language,
  setCopilotOpen,
  copilotMessages,
  copilotQuery,
  setCopilotQuery,
  copilotLoading,
  handleCopilotSubmit, } = useDashboard();
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

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || copilotLoading) return;
    const queryText = copilotQuery;
    setCopilotQuery("");
    handleCopilotSubmit(context, queryText);
  };

  const handleSuggestionClick = () => {
    let suggestion = "";
    if (context === "reconciliation") {
      suggestion = language === "es" ? "Ejecutar conciliación" : "Run reconciliation";
    } else if (context === "monthlyClose") {
      suggestion = language === "es" ? "Calcular liquidaciones pendientes" : "Complete pending tasks";
    } else {
      suggestion = language === "es" ? "Presentar reporte de facturación" : "Submit invoicing report";
    }
    handleCopilotSubmit(context, suggestion);
  };

  return (
    <div className="copilot-drawer">
      <div className="copilot-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Cpu size={16} style={{ color: "var(--color-primary)" }} />
          <div>
            <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>
              {language === "es" ? "Copiloto Agéntico" : "Agent Copilot"}
            </h4>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {context === "reconciliation"
                ? language === "es"
                  ? "Conciliación"
                  : "Reconciliation"
                : context === "monthlyClose"
                ? language === "es"
                  ? "Cierre Mensual"
                  : "Monthly Close"
                : language === "es"
                ? "Impuestos"
                : "Taxes"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}
        >
          <X size={15} />
        </button>
      </div>

      <div className="copilot-messages">
        {copilotMessages.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
            <div className={`copilot-bubble ${msg.role}`}>{msg.role === "agent" ? renderAgentText(msg.text) : msg.text}</div>
            {msg.steps && msg.steps.length > 0 && (
              <div
                style={{
                  padding: "0.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                }}
              >
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-primary)" }}>
                  {language === "es" ? "Ejecución de Acción (API REST POST)" : "Action Execution (API REST POST)"}
                </div>
                {msg.steps.map((st: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--color-success)" }}>✓</span>
                    <span>{st}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.7rem",
                    color: "var(--color-success)",
                    fontWeight: 700,
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "0.25rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <span>●</span> {language === "es" ? "Estado: 200 OK (Éxito)" : "Status: 200 OK (Success)"}
                </div>
              </div>
            )}
          </div>
        ))}

        {copilotLoading && (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "0.5rem" }}>
            <div
              style={{
                padding: "0.6rem 0.85rem",
                background: "var(--bg-surface-solid)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.82rem",
                color: "var(--text-muted)",
              }}
            >
              <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />
              <span>{language === "es" ? "El Agente está razonando..." : "Agent is reasoning..."}</span>
            </div>
          </div>
        )}
      </div>

      <div className="copilot-input-area">
        <form onSubmit={onFormSubmit} style={{ display: "flex", gap: "0.4rem" }}>
          <input
            type="text"
            value={copilotQuery}
            onChange={e => setCopilotQuery(e.target.value)}
            placeholder={language === "es" ? "Pedile una acción o consulta..." : "Ask for an action or query..."}
            disabled={copilotLoading}
            style={{ fontSize: "0.82rem", padding: "0.45rem 0.6rem" }}
          />
          <button type="submit" className="btn btn-primary" disabled={copilotLoading || !copilotQuery.trim()} style={{ padding: "0.45rem 0.75rem" }}>
            <ArrowRight size={13} />
          </button>
        </form>
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <button
            onClick={handleSuggestionClick}
            style={{
              fontSize: "0.68rem",
              padding: "0.15rem 0.4rem",
              background: "var(--bg-surface-hover)",
              border: "1px solid var(--border-color)",
              borderRadius: "4px",
              color: "var(--text-secondary)",
            }}
          >
            ⚡️{" "}
            {context === "reconciliation"
              ? language === "es"
                ? "Conciliar todo"
                : "Reconcile all"
              : context === "monthlyClose"
              ? language === "es"
                ? "Completar tareas"
                : "Complete tasks"
              : language === "es"
              ? "Presentar reporte"
              : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  );
};
