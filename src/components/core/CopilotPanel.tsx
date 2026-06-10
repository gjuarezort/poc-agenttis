import { useDashboard } from "../../context/DashboardContext";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Cpu, X, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Heading } from "../ui/Heading";

export const CopilotPanel: React.FC<{ context: "reconciliation" | "monthlyClose" | "taxAlerts" }> = ({ context }) => {
  const { 
    language,
    setCopilotOpen,
    copilotMessages,
    copilotQuery,
    setCopilotQuery,
    copilotLoading,
    handleCopilotSubmit, 
  } = useDashboard();

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
      setMounted(false);
    };
  }, []);

  const renderInlineBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return text;
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="text-[var(--text-primary)] font-bold">
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
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      if (/^[\-\*•]\s/.test(line)) {
        return (
          <div key={i} className="flex gap-2 items-start my-1">
            <span className="text-[var(--color-accent)] shrink-0 leading-normal text-[10px] mt-1">▸</span>
            <span className="leading-relaxed text-xs text-[var(--text-secondary)]">
              {renderInlineBold(line.slice(2))}
            </span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/);
        if (match)
          return (
            <div key={i} className="flex gap-2 items-start my-1">
              <span className="text-[var(--color-primary)] shrink-0 font-bold min-w-[1.2rem] leading-normal text-xs">
                {match[1]}.
              </span>
              <span className="leading-relaxed text-xs text-[var(--text-secondary)]">
                {renderInlineBold(match[2])}
              </span>
            </div>
          );
      }
      if (/^\*\*.*\*\*:?\s*$/.test(line.trim())) {
        return (
          <p key={i} className="my-1.5 font-bold text-xs text-[var(--text-primary)]">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      return (
        <p key={i} className="my-0.5 leading-relaxed text-xs text-[var(--text-secondary)]">
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

  const panelContent = (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div 
          className="modal-overlay animate-fade-in" 
          onClick={() => setCopilotOpen(false)} 
          style={{ zIndex: 1900 }} 
        />
      )}
      
      <div className="copilot-drawer" style={{ zIndex: 2000, display: "flex", flexDirection: "column" }}>
        <div 
          style={{ 
            padding: "1rem 1.25rem", 
            borderBottom: "1px solid var(--border-color)", 
            background: "var(--bg-surface-solid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[var(--color-primary)]" />
            <div>
              <Heading level="h4" className="m-0 text-xs font-bold text-white leading-tight">
                {language === "es" ? "Copiloto Agéntico" : "Agent Copilot"}
              </Heading>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
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
            className="bg-transparent border-none text-[var(--text-muted)] hover:text-white cursor-pointer flex p-1"
          >
            <X size={15} />
          </button>
        </div>

        <div 
          style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: "1.25rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem" 
          }}
        >
          {copilotMessages.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-1 w-full">
              <div className={`copilot-bubble ${msg.role}`}>{msg.role === "agent" ? renderAgentText(msg.text) : msg.text}</div>
              {msg.steps && msg.steps.length > 0 && (
                <div 
                  style={{ 
                    padding: "0.75rem 1rem", 
                    border: "1px border var(--border-color)", // fallback
                    borderStyle: "solid",
                    borderColor: "var(--border-color)",
                    borderRadius: "var(--radius-md)", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "0.25rem",
                    background: "rgba(255, 255, 255, 0.02)" 
                  }}
                >
                  <div className="text-[10px] font-bold uppercase text-[var(--color-primary)] tracking-wide">
                    {language === "es" ? "Ejecución de Acción (API REST POST)" : "Action Execution (API REST POST)"}
                  </div>
                  {msg.steps.map((st: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                      <span className="text-[var(--color-success)]">✓</span>
                      <span>{st}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 text-[10px] text-[var(--color-success)] font-bold border-t border-[var(--border-color)] pt-1 mt-1">
                    <span>●</span> {language === "es" ? "Estado: 200 OK (Éxito)" : "Status: 200 OK (Success)"}
                  </div>
                </div>
              )}
            </div>
          ))}

          {copilotLoading && (
            <div className="flex gap-2">
              <div 
                style={{ 
                  padding: "0.6rem 0.85rem", 
                  background: "var(--bg-surface-solid)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "var(--radius-md)", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem" 
                }}
                className="text-xs text-[var(--text-muted)]"
              >
                <RefreshCw size={12} className="animate-spin" />
                <span>{language === "es" ? "El Agente está razonando..." : "Agent is reasoning..."}</span>
              </div>
            </div>
          )}
        </div>

        <div 
          style={{ 
            padding: "0.85rem 1rem", 
            borderTop: "1px solid var(--border-color)", 
            background: "var(--bg-surface-solid)" 
          }}
        >
          <form onSubmit={onFormSubmit} className="flex gap-1.5">
            <Input
              value={copilotQuery}
              onChange={e => setCopilotQuery(e.target.value)}
              placeholder={language === "es" ? "Pedile una acción o consulta..." : "Ask for an action or query..."}
              disabled={copilotLoading}
              className="!text-xs !py-1.5 !px-2.5 flex-1"
            />
            <Button 
              type="submit" 
              variant="primary" 
              disabled={copilotLoading || !copilotQuery.trim()} 
              className="!py-1.5 !px-3.5 flex items-center justify-center shrink-0"
            >
              <ArrowRight size={13} />
            </Button>
          </form>
          <div className="flex gap-1 flex-wrap mt-2">
            <button
              onClick={handleSuggestionClick}
              className="text-[10px] py-0.5 px-2 bg-[var(--bg-surface-hover)] border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer"
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
    </>
  );

  if (!mounted) return null;

  return isMobile ? createPortal(panelContent, document.body) : panelContent;
};
