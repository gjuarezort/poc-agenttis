import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { CheckCircle2, AlertTriangle, CircleDot } from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";
import { CopilotPanel } from "../core/CopilotPanel";

interface CloseStep {
  id: number;
  label: string;
  status: string;
  detail: string;
}

interface MonthlyCloseTabProps {
  language: "en" | "es";
  closeStepsState: CloseStep[];
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: any[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<any[]>>;
  copilotQuery: string;
  setCopilotQuery: (q: string) => void;
  copilotLoading: boolean;
  handleCopilotSubmit: (text: string) => void;
}



export const MonthlyCloseTab: React.FC = () => {
  const { language,
  closeStepsState,
  copilotOpen,
  setCopilotOpen,
  copilotMessages,
  setCopilotMessages,
  copilotQuery,
  setCopilotQuery,
  copilotLoading,
  handleCopilotSubmit, } = useDashboard();
  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  const period = "Junio 2025";
  const steps = closeStepsState;
  const done = steps.filter(s => s.status === "done").length;
  const pct = Math.round((done / steps.length) * 100);
  
  const statusIcon = (s: string) =>
    s === "done" ? (
      <CheckCircle2 size={16} style={{ color: "var(--color-success)", flexShrink: 0 }} />
    ) : s === "warning" ? (
      <AlertTriangle size={16} style={{ color: "var(--color-warning)", flexShrink: 0 }} />
    ) : (
      <CircleDot size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
    );

  const statusBg = (s: string) => (s === "done" ? "rgba(16,185,129,0.06)" : s === "warning" ? "rgba(245,158,11,0.06)" : "transparent");

  return (
    <div className="app-container-with-sidebar">
      <div className="main-app-content animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Header with Copilot Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("monthlyCloseTitle")}</h2>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("monthlyCloseSubtitle")}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className="badge badge-info" style={{ fontSize: "0.78rem", padding: "0.25rem 0.75rem" }}>{period}</span>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                const wasOpen = copilotOpen;
                setCopilotOpen(!wasOpen);
                if (!wasOpen) {
                  setCopilotMessages([
                    { 
                      role: "agent", 
                      text: language === "es" 
                        ? "¡Hola! Soy tu Asistente de **Cierre Mensual**. Puedo ayudarte a verificar conciliaciones bancarias, revisar declaraciones impositivas pendientes e ingresar asientos de ajuste en tu ERP.\n\nEscribe **'completar'** para resolver los pendientes de impuestos y nóminas y registrar los ajustes de fin de mes." 
                        : "Hello! I am your **Monthly Close** Assistant. I can check bank reconciliations, review pending tax reports, and enter adjustments into your ERP.\n\nType **'complete'** to calculate taxes, payroll, and log the end-of-month adjustments." 
                    }
                  ]);
                }
              }}
              style={{ border: "1px solid var(--border-color-glow)", background: "rgba(139, 92, 246, 0.08)", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>🤖</span>
              <span>{copilotOpen ? (language === "es" ? "Cerrar Copiloto" : "Close Copilot") : (language === "es" ? "Abrir Copiloto" : "Open Copilot")}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass-panel" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>{t("monthlyCloseProgress")}</span>
            <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{done}/{steps.length} — {pct}%</span>
          </div>
          <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: statusBg(step.status), border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
              {statusIcon(step.status)}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{step.label}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>{step.detail}</p>
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>#{step.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Copilot Side Panel inline */}
      {copilotOpen && (
        <CopilotPanel context="monthlyClose" />
      )}
    </div>
  );
};
