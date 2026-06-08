import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { CheckCircle2, AlertTriangle, CircleDot } from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";
import { CopilotPanel } from "../core/CopilotPanel";

interface TaxItem {
  id: number;
  tax: string;
  desc: string;
  due: string;
  rate: string;
  amount: string;
  status: string;
}

interface TaxAlertsTabProps {
  language: "en" | "es";
  taxesState: TaxItem[];
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: any[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<any[]>>;
  copilotQuery: string;
  setCopilotQuery: (q: string) => void;
  copilotLoading: boolean;
  handleCopilotSubmit: (text: string) => void;
}



export const TaxAlertsTab: React.FC = () => {
  const { language,
  taxesState,
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

  const today = new Date("2025-06-07");
  const diff = (d: string) => Math.round((new Date(d).getTime() - today.getTime()) / 86400000);
  const taxes = taxesState;
  
  const overdueCount = taxes.filter(t => t.status === "overdue").length;
  const pendingCount = taxes.filter(t => t.status === "pending").length;

  const statusStyle = (s: string) =>
    s === "overdue"
      ? { color: "var(--color-danger)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", badge: "badge-warning" }
      : s === "pending"
      ? { color: "var(--color-warning)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", badge: "badge-warning" }
      : s === "filed"
      ? { color: "var(--color-success)", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)", badge: "badge-success" }
      : { color: "var(--color-accent)", bg: "transparent", border: "var(--border-color)", badge: "badge-info" };

  const statusLabel = (s: string) =>
    s === "overdue"
      ? t("taxAlertsOverdue")
      : s === "pending"
      ? t("taxAlertsDue")
      : s === "filed"
      ? t("taxAlertsPaid")
      : language === "es"
      ? "Próximo"
      : "Upcoming";

  const daysLabel = (due: string, status: string) => {
    if (status === "filed") return null;
    const d = diff(due);
    if (d < 0)
      return (
        <span style={{ fontSize: "0.72rem", color: "var(--color-danger)", fontWeight: 700 }}>
          {Math.abs(d)} {t("taxAlertsDaysLeft")} {language === "es" ? "vencido" : "overdue"}
        </span>
      );
    if (d === 0) return <span style={{ fontSize: "0.72rem", color: "var(--color-danger)", fontWeight: 700 }}>{t("taxAlertsToday")}</span>;
    return (
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
        {d} {t("taxAlertsDaysLeft")}
      </span>
    );
  };

  return (
    <div className="app-container-with-sidebar">
      <div className="main-app-content animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Header with Copilot Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("taxAlertsTitle")}</h2>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("taxAlertsSubtitle")}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <span className="badge badge-warning" style={{ fontSize: "0.72rem" }}>
                {overdueCount} {language === "es" ? "vencidos" : "overdue"}
              </span>
              <span className="badge badge-info" style={{ fontSize: "0.72rem" }}>
                {pendingCount} {language === "es" ? "pendientes" : "pending"}
              </span>
            </div>
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
                        ? "¡Hola! Soy tu Asistente Impositivo para la **Impuestos y Nómina**. Puedo ayudarte a verificar tus vencimientos e incluso presentar declaraciones automáticamente firmadas digitalmente.\n\nEscribe **'presentar reporte'** para enviar el reporte de e-Factura de Junio 2025 de inmediato." 
                        : "Hello! I am your Tax Assistant. I can check your due dates and even submit declarations signed digitally.\n\nType **'submit report'** to file the June 2025 invoicing report immediately." 
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

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {taxes.map((tax, i) => {
            const st = statusStyle(tax.status);
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "1rem", padding: "0.85rem 1.1rem", background: st.bg, border: `1px solid ${st.border}`, borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "3px", height: "36px", borderRadius: "2px", background: st.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>{tax.tax}</span>
                      <span className={`badge ${st.badge}`} style={{ fontSize: "0.62rem" }}>{statusLabel(tax.status)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)" }}>{tax.desc}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.15rem", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{tax.amount}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{tax.due}</span>
                  {daysLabel(tax.due, tax.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copilot Side Panel inline */}
      {copilotOpen && (
        <CopilotPanel context="taxAlerts" />
      )}
    </div>
  );
};
