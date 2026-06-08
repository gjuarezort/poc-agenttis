import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Landmark, FileText, CheckCircle2, XCircle, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";
import { CopilotPanel } from "../core/CopilotPanel";

interface BankRow {
  id: number;
  date: string;
  desc: string;
  amount: number;
  matched: boolean;
}

interface BankReconciliationTabProps {
  language: "en" | "es";
  bankRowsState: BankRow[];
  setBankRowsState: React.Dispatch<React.SetStateAction<BankRow[]>>;
  setCloseStepsState: React.Dispatch<React.SetStateAction<any[]>>;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: any[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<any[]>>;
  copilotQuery: string;
  setCopilotQuery: (q: string) => void;
  copilotLoading: boolean;
  handleCopilotSubmit: (text: string) => void;
}



export const BankReconciliationTab: React.FC = () => {
  const { language,
  bankRowsState,
  setBankRowsState,
  setCloseStepsState,
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

  const bankRows = bankRowsState;
  const matched = bankRows.filter(r => r.matched).length;
  const unmatched = bankRows.filter(r => !r.matched).length;
  const totalBank = bankRows.reduce((s, r) => s + r.amount, 0);
  const diffValue = bankRows.filter(r => !r.matched).reduce((s, r) => s + Math.abs(r.amount), 0);
  const totalBooks = totalBank - diffValue;

  return (
    <div className="app-container-with-sidebar">
      <div className="main-app-content animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Header Row with Copilot button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("reconciliationTitle")}</h2>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("reconciliationSubtitle")}</p>
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
                      ? "¡Hola! Soy tu Copiloto Agéntico para la **Conciliación Bancaria**. Puedo comparar tu extracto de banco contra tus libros, identificar diferencias o conciliar automáticamente todos tus movimientos pendientes.\n\nEscribe **'conciliar'** para ejecutar las conciliaciones pendientes de inmediato." 
                      : "Hello! I am your Agentic Copilot for **Bank Reconciliation**. I can match your bank statement against books, locate differences, or auto-reconcile all your pending movements.\n\nType **'reconcile'** to run the pending reconciliations immediately." 
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

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: t("reconciliationBank"), value: `$${totalBank.toLocaleString()}`, color: "var(--color-primary)", icon: <Landmark size={16} /> },
            { label: t("reconciliationBooks"), value: `$${totalBooks.toLocaleString()}`, color: "var(--color-accent)", icon: <FileText size={16} /> },
            { label: t("reconciliationMatched"), value: matched, color: "var(--color-success)", icon: <CheckCircle2 size={16} /> },
            { label: t("reconciliationUnmatched"), value: unmatched, color: "var(--color-danger)", icon: <XCircle size={16} /> },
          ].map((card, i) => (
            <div key={i} className="glass-panel" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: card.color, marginBottom: "0.4rem" }}>
                {card.icon}
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{card.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Difference banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: diffValue > 0 ? "rgba(239,68,68,0.07)" : "rgba(16,185,129,0.07)", border: diffValue > 0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {diffValue > 0 ? <AlertTriangle size={15} style={{ color: "var(--color-danger)" }} /> : <CheckCircle2 size={15} style={{ color: "var(--color-success)" }} />}
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t("reconciliationDiff")}</span>
          </div>
          <strong style={{ color: diffValue > 0 ? "var(--color-danger)" : "var(--color-success)", fontSize: "1rem" }}>
            ${diffValue.toLocaleString()}
          </strong>
        </div>

        {/* Movements table */}
        <div className="glass-panel" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>{t("reconciliationBank")} — Junio 2025</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setBankRowsState(prev => prev.map(r => ({ ...r, matched: true })));
                setCloseStepsState(prev => prev.map(s => s.id === 2 ? { ...s, status: "done", detail: language === "es" ? "Completamente conciliado por el Agente" : "Fully matched by Agent" } : s));
                alert(language === "es" ? "¡Conciliación bancaria completada!" : "Bank reconciliation completed!");
              }}
              style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }}
            >
              <ArrowLeftRight size={13} /> {t("reconciliationRunBtn")}
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ fontSize: "0.78rem" }}>{language === "es" ? "Fecha" : "Date"}</th>
                  <th style={{ fontSize: "0.78rem" }}>{language === "es" ? "Descripción" : "Description"}</th>
                  <th style={{ fontSize: "0.78rem", textAlign: "right" }}>{language === "es" ? "Importe" : "Amount"}</th>
                  <th style={{ fontSize: "0.78rem", textAlign: "center" }}>{language === "es" ? "Estado" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {bankRows.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>{row.date}</td>
                    <td style={{ fontSize: "0.8rem" }}>{row.desc}</td>
                    <td style={{ fontSize: "0.8rem", textAlign: "right", fontWeight: 600, color: row.amount > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                      {row.amount > 0 ? "+" : ""}${Math.abs(row.amount).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {row.matched
                        ? <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{t("reconciliationMatched")}</span>
                        : <span className="badge badge-warning" style={{ fontSize: "0.65rem" }}>{t("reconciliationPending")}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render Copilot panel side panel inline */}
      {copilotOpen && (
        <CopilotPanel context="reconciliation" />
      )}
    </div>
  );
};
