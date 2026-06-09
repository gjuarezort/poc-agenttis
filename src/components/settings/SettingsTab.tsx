import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import {
  Globe,
  TrendingDown,
  Coins,
  Activity,
  Play,
  LineChart,
  Clock,
  Sun,
  Moon,
} from "lucide-react";

interface SettingsTabProps {
  language: "en" | "es";
  chatHistory: any[];
  stats: {
    totalQueries: number;
    avgSavingsPercent: number;
    totalCostSaved: number;
    avgFullLatency: number;
    avgMcpLatency: number;
  };
  observabilityLogs: any[];
  handleLanguageChange: (lang: "en" | "es") => void;
  t: (key: string) => string;
}



export const SettingsTab: React.FC = () => {
  const { language,
  chatHistory,
  stats,
  observabilityLogs,
  handleLanguageChange,
  t,
  theme,
  toggleTheme, } = useDashboard();
  const lastMetrics = chatHistory.length > 0
    ? chatHistory.filter(m => m.role === "agent" && m.metrics).slice(-1)[0]?.metrics
    : null;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "860px" }}>

      {/* Language & Theme Configuration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        
        {/* Language */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
            <Globe size={16} style={{ color: "var(--color-primary)" }} />
            {language === "es" ? "Idioma" : "Language"}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["en", "es"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={language === lang ? "btn btn-primary" : "btn btn-secondary"}
                style={{ minWidth: "80px" }}
              >
                {lang === "en" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
            {theme === "light" ? <Sun size={16} style={{ color: "var(--color-warning)" }} /> : <Moon size={16} style={{ color: "var(--color-primary)" }} />}
            {language === "es" ? "Tema de Color" : "Color Theme"}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => theme !== "light" && toggleTheme()}
              className={theme === "light" ? "btn btn-primary" : "btn btn-secondary"}
              style={{ minWidth: "80px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Sun size={14} />
              {language === "es" ? "Claro" : "Light"}
            </button>
            <button
              onClick={() => theme !== "dark" && toggleTheme()}
              className={theme === "dark" ? "btn btn-primary" : "btn btn-secondary"}
              style={{ minWidth: "80px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Moon size={14} />
              {language === "es" ? "Oscuro" : "Dark"}
            </button>
          </div>
        </div>

      </div>

      {/* Token Efficiency & Costs */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
          <TrendingDown size={16} style={{ color: "var(--color-primary)" }} />
          {t("efficiencyTitle")}
        </h3>

        {lastMetrics ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

            {/* Token consumption */}
            <div className="glass-panel" style={{ padding: "1.25rem", background: "var(--bg-surface-solid)" }}>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{t("tokenConsumption")}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--text-muted)" }}>{t("fullContext")}</span>
                <span style={{ fontWeight: 700 }}>{lastMetrics.fullContextTokens.toLocaleString()} t</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)" }}>{t("mcpTool")}</span>
                <span style={{ fontWeight: 700, color: "var(--color-success)" }}>{lastMetrics.mcpTokens.toLocaleString()} t</span>
              </div>
              <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                <div style={{ height: "100%", width: `${lastMetrics.savingsPercent}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px" }} />
              </div>
              <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700, textAlign: "right" }}>
                -{t("tokensSaved").replace("{percent}", lastMetrics.savingsPercent)}
              </p>
            </div>

            {/* Latency */}
            <div className="glass-panel" style={{ padding: "1.25rem", background: "var(--bg-surface-solid)" }}>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{t("latencyTitle")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                  <span style={{ width: "80px", color: "var(--text-muted)", flexShrink: 0 }}>{t("fullContext")}</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(239,68,68,0.25)", borderRadius: "3px" }} />
                  <span style={{ width: "45px", textAlign: "right", fontWeight: 600 }}>{lastMetrics.fullContextLatency}ms</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                  <span style={{ width: "80px", color: "var(--text-muted)", flexShrink: 0 }}>{t("mcpTool")}</span>
                  <div style={{ width: `${Math.max(8, (lastMetrics.mcpLatency / lastMetrics.fullContextLatency) * 100)}%`, height: "6px", background: "var(--color-success)", borderRadius: "3px" }} />
                  <span style={{ width: "45px", textAlign: "right", fontWeight: 600, color: "var(--color-success)" }}>{lastMetrics.mcpLatency}ms</span>
                </div>
              </div>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 700, textAlign: "right" }}>
                {t("xTimesFaster").replace("{x}", String(Math.round(lastMetrics.fullContextLatency / lastMetrics.mcpLatency)))}
              </p>
            </div>

            {/* Cost saved — spans full width */}
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Coins size={16} style={{ color: "var(--color-success)" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{t("estSavings")}</span>
              </div>
              <strong style={{ fontSize: "1.1rem", color: "var(--color-success)" }}>${lastMetrics.costSaved.toFixed(5)} USD</strong>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)" }}>
            <TrendingDown size={24} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              {language === "es"
                ? "Realiza una consulta en 'Consulta tu Información' para ver métricas de eficiencia."
                : "Run a query in 'Query Your Data' to see efficiency metrics here."}
            </p>
          </div>
        )}
      </div>

      {/* Cumulative Metrics */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
          <Activity size={16} style={{ color: "var(--color-accent)" }} />
          {t("tokenCompTitle")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
          {[
            { label: t("queriesProcessed"), value: stats.totalQueries, color: "var(--color-primary)", icon: <Play size={15} /> },
            { label: t("avgTokensSaved"),   value: `${stats.avgSavingsPercent}%`, color: "var(--color-accent)", icon: <Coins size={15} /> },
            { label: t("cumCostSaved"),      value: `$${stats.totalCostSaved.toFixed(4)}`, color: "var(--color-success)", icon: <LineChart size={15} /> },
            { label: t("speedup"),           value: stats.avgMcpLatency > 0 ? `${(stats.avgFullLatency / stats.avgMcpLatency).toFixed(1)}x` : "0x", color: "var(--color-warning)", icon: <Clock size={15} /> },
          ].map((c, i) => (
            <div key={i} style={{ padding: "0.85rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: c.color, marginBottom: "0.3rem" }}>
                {c.icon}<span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{c.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Trace log table */}
        <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>{t("traceLogTitle")}</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t("logHeaderTime")}</th>
                <th>{t("logHeaderQuery")}</th>
                <th>{t("logHeaderTool")}</th>
                <th>{t("logHeaderTokens")}</th>
                <th>{t("logHeaderSavings")}</th>
                <th>{t("logHeaderCost")}</th>
                <th>{t("logHeaderSpeed")}</th>
              </tr>
            </thead>
            <tbody>
              {observabilityLogs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>{t("noLogsMessage")}</td></tr>
              ) : (
                observabilityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.query}</td>
                    <td><span className="badge badge-info" style={{ fontFamily: "var(--font-mono)" }}>{log.toolCalled}</span></td>
                    <td>{log.metrics.mcpTokens}</td>
                    <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>-{log.metrics.savingsPercent}%</td>
                    <td style={{ color: "var(--color-success)" }}>+${log.metrics.costSaved.toFixed(5)}</td>
                    <td>{log.metrics.mcpLatency}ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
