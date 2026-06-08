import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import {
  Search,
  LineChart,
  Database,
  Link as LinkIcon,
  BarChart2,
  FileCode,
} from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";

interface HomeTabProps {
  language: "en" | "es";
  parsedData: any;
  setActiveTab: (tab: any) => void;
}



export const HomeTab: React.FC = () => {
  const { language,
  parsedData,
  setActiveTab, } = useDashboard();
  const ht = (TRANSLATIONS[language] as any).home;
  const mockData = parsedData
    ? [{ name: parsedData.fileName ?? "dataset.csv", rows: parsedData.totalRows, cols: parsedData.columns.length, time: "Just now" }]
    : [];
  
  const mockReports = [
    { name: language === "es" ? "Reporte de Ventas — Jun 2026" : "Sales Report — Jun 2026",       type: language === "es" ? "Ventas" : "Sales",     time: language === "es" ? "Hace 2h" : "2h ago",   status: "success" },
    { name: language === "es" ? "Análisis de Inventario" : "Inventory Analysis",                  type: language === "es" ? "Inventario" : "Stock",  time: language === "es" ? "Hace 5h" : "5h ago",   status: "success" },
    { name: language === "es" ? "Resumen de Clientes Activos" : "Active Customers Summary",       type: language === "es" ? "Clientes" : "CRM",      time: language === "es" ? "Ayer" : "Yesterday",   status: "success" },
  ];
  
  const mockAlerts = [
    { level: "critical", msg: language === "es" ? "Conector Stripe sin respuesta desde hace 30 min" : "Stripe connector unresponsive for 30 min",   time: language === "es" ? "Hace 10 min" : "10 min ago" },
    { level: "warning",  msg: language === "es" ? "Dataset 'clientes_2024.csv' supera el límite recomendado de filas" : "Dataset 'customers_2024.csv' exceeds recommended row limit", time: language === "es" ? "Hace 1h" : "1h ago" },
    { level: "info",     msg: language === "es" ? "Nueva versión del servidor MCP disponible (v2.1)" : "New MCP server version available (v2.1)",   time: language === "es" ? "Hace 3h" : "3h ago" },
  ];
  
  const levelColor: Record<string, string> = { critical: "var(--color-danger)", warning: "var(--color-warning)", info: "var(--color-accent)" };
  const levelBadgeClass: Record<string, string> = { critical: "badge-warning", warning: "badge-warning", info: "badge-info" };
  
  const blockHeader = (_num: number, accent: string, _bg: string, title: string, desc: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
      <div style={{ width: "3px", height: "32px", borderRadius: "2px", background: accent, flexShrink: 0 }} />
      <div>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "0.78rem" }}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Page heading */}
      <div>
        <h2 style={{ margin: "0 0 0.2rem 0" }}>{ht.title}</h2>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>{ht.subtitle}</p>
      </div>

      {/* Shortcut buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {[
          { label: ht.shortcutQueries,     icon: <Search size={20} />,   tab: "playground" },
          { label: ht.shortcutReports,      icon: <LineChart size={20} />, tab: "monthlyClose" },
          { label: ht.shortcutData,         icon: <Database size={20} />, tab: "connections" },
          { label: ht.shortcutConnections,  icon: <LinkIcon size={20} />,     tab: "integrations" },
          { label: ht.shortcutMetrics,      icon: <BarChart2 size={20} />,tab: "settings" },
        ].map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(s.tab as any)}
            className="glass-panel glass-panel-interactive"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem 0.5rem",
              cursor: "pointer",
              border: "1px solid var(--border-color)",
              background: "var(--bg-surface)",
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            <span style={{ color: "var(--color-primary)" }}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Grid: 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
        {/* BLOCK 1 — Last Processed Data */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          {blockHeader(1, "var(--color-primary)", "var(--color-primary-glow)", ht.step1Title, ht.step1Desc)}
          {mockData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
              <Database size={22} style={{ marginBottom: "0.5rem", opacity: 0.35, display: "block", margin: "0 auto 0.5rem" }} />
              <p style={{ margin: 0 }}>{ht.noData}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {mockData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <FileCode size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{d.rows} {ht.rowsProcessed}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{d.cols} {ht.columnsDetected}</span>
                    <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{d.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BLOCK 2 — Generated Reports */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          {blockHeader(2, "var(--color-accent)", "var(--color-accent-glow)", ht.step2Title, ht.step2Desc)}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {mockReports.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</span>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <span className="badge badge-info" style={{ fontSize: "0.62rem" }}>{r.type}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 3 — Alerts */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", gridColumn: "span 2" }}>
          {blockHeader(3, "var(--color-warning)", "var(--color-warning-glow)", ht.step3Title, ht.step3Desc)}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {mockAlerts.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: levelColor[a.level], display: "inline-block" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{a.msg}</span>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <span className={`badge ${levelBadgeClass[a.level]}`} style={{ fontSize: "0.62rem" }}>{ht["alert" + a.level.charAt(0).toUpperCase() + a.level.slice(1)]}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
