import React, { useState, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import {
  Activity,
  TrendingUp,
  Coins,
  Clock,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BarChart3,
  UserCheck,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";

export const ObservabilityTab: React.FC = () => {
  const {
    language,
    stats,
    observabilityLogs,
    chatHistory,
    t,
    bankRowsState,
    closeStepsState,
    taxesState,
  } = useDashboard();

  // State for dynamic ROI calculation
  const [hourlyWage, setHourlyWage] = useState<number>(25);

  // States for customizable Agent Adoption Targets
  const [targetReconcile, setTargetReconcile] = useState<number>(90);
  const [targetClose, setTargetClose] = useState<number>(80);
  const [targetTax, setTargetTax] = useState<number>(85);

  // Real-time task progress calculations (grounded metrics)
  const currentReconcileAdoption = useMemo(() => {
    const total = bankRowsState.length;
    const matched = bankRowsState.filter(r => r.matched).length;
    return total > 0 ? Math.round((matched / total) * 100) : 0;
  }, [bankRowsState]);

  const currentCloseAdoption = useMemo(() => {
    const total = closeStepsState.length;
    const completed = closeStepsState.filter(s => s.status === "done").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [closeStepsState]);

  const currentTaxAdoption = useMemo(() => {
    const total = taxesState.length;
    const filed = taxesState.filter(t => t.status === "filed" || t.status === "paid").length;
    return total > 0 ? Math.round((filed / total) * 100) : 0;
  }, [taxesState]);

  // Global aggregate metrics
  const avgCurrentAdoption = useMemo(() => {
    return Math.round((currentReconcileAdoption + currentCloseAdoption + currentTaxAdoption) / 3);
  }, [currentReconcileAdoption, currentCloseAdoption, currentTaxAdoption]);

  const avgTargetAdoption = useMemo(() => {
    return Math.round((targetReconcile + targetClose + targetTax) / 3);
  }, [targetReconcile, targetClose, targetTax]);

  const globalStatus = avgCurrentAdoption >= avgTargetAdoption ? "on-track" : "lagging";

  // Gartner Performance / Trust metrics
  const accuracyScore = 98.4; // % LLM-as-a-judge score
  const hallucinationRate = 1.6; // %
  const syncSuccessRate = 99.8; // % CRM / ERP pipeline success rate

  // Hours saved based on queries
  const estimatedHoursSaved = useMemo(() => {
    const baseline = 24; 
    return Math.round(baseline + stats.totalQueries * 1.5);
  }, [stats.totalQueries]);

  // HITL (Human-in-the-loop) Reduction Trend:
  const hitlReductionRate = useMemo(() => {
    const baseAutoRate = 65; 
    const queryGrowth = Math.min(25, stats.totalQueries * 2.5); 
    return Math.round(baseAutoRate + queryGrowth);
  }, [stats.totalQueries]);

  // Technology spend: $299/mo base subscription + token costs (accumulated)
  const monthlyTechCost = useMemo(() => {
    const baseSubscription = 299;
    const computedTokensCost = stats.totalCostSaved * 0.25; 
    return Number((baseSubscription + computedTokensCost).toFixed(2));
  }, [stats.totalCostSaved]);

  // Cost Avoidance (Efficiency):
  const costAvoidance = useMemo(() => {
    const laborValue = estimatedHoursSaved * hourlyWage;
    const tokenCosts = stats.totalCostSaved * 0.25; 
    return Math.max(0, laborValue - tokenCosts);
  }, [estimatedHoursSaved, hourlyWage, stats.totalCostSaved]);

  const autonomousRevenue = useMemo(() => {
    return Math.round(stats.totalQueries * 125.5);
  }, [stats.totalQueries]);

  const pipelineHealth = [
    { name: "Stripe Checkout MCP", category: "Billing", status: "healthy", errorRate: "0.1%" },
    { name: "HubSpot CRM MCP", category: "CRM", status: "healthy", errorRate: "0.3%" },
    { name: "ERP Inventory Sync Hub", category: "ERP", status: "healthy", errorRate: "0.2%" },
    { name: "Slack Channels MCP", category: "Notifications", status: "healthy", errorRate: "0.0%" },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Title Header */}
      <div>
        <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
          {t("obsTitle")}
        </h2>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {t("obsSubtitle")}
        </p>
      </div>

      {/* Dynamic Agent Adoption & Targets Section */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={18} style={{ color: "var(--color-primary)" }} />
            {t("adoptionTitle")}
          </h3>
          <span style={{ 
            fontSize: "0.75rem", 
            fontWeight: 700, 
            padding: "0.25rem 0.6rem", 
            borderRadius: "30px", 
            background: globalStatus === "on-track" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
            color: globalStatus === "on-track" ? "var(--color-success)" : "var(--color-warning)",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            {globalStatus === "on-track" ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {language === "es" ? "Estado Global: " : "Global Status: "}
            <strong>{globalStatus === "on-track" ? t("statusOnTrack") : t("statusLagging")}</strong>
          </span>
        </div>

        <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          {t("adoptionSubtitle")}
        </p>

        {/* Global summary banner */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1rem 1.25rem", 
          background: "var(--bg-surface-solid)", 
          border: "1px solid var(--border-color)", 
          borderRadius: "var(--radius-md)",
          marginBottom: "1.5rem"
        }}>
          <div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>{t("globalAdoption")}</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "0.2rem" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-primary)" }}>{avgCurrentAdoption}%</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {language === "es" ? `vs Objetivo de ${avgTargetAdoption}%` : `vs Target of ${avgTargetAdoption}%`}
              </span>
            </div>
          </div>
          <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              <span>{t("currentLabel")}</span>
              <span>{t("targetLabel")} ({avgTargetAdoption}%)</span>
            </div>
            <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", position: "relative", border: "1px solid var(--border-color)", overflow: "hidden" }}>
              {/* Target Indicator Line */}
              <div style={{ position: "absolute", left: `${avgTargetAdoption}%`, top: 0, bottom: 0, width: "2px", background: "var(--text-muted)", zIndex: 5 }} />
              {/* Current Progress bar */}
              <div style={{ height: "100%", width: `${avgCurrentAdoption}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px" }} />
            </div>
          </div>
        </div>

        {/* Individual Agent Targets Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
          
          {/* Reconciliation Agent Card */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>{t("reconcileAgentName")}</h4>
              <span className={`badge ${currentReconcileAdoption >= targetReconcile ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.6rem" }}>
                {currentReconcileAdoption >= targetReconcile ? t("statusOnTrack") : t("statusLagging")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              <span>{language === "es" ? "Conciliado en Libros" : "Matched in Books"}</span>
              <span style={{ fontWeight: 600 }}>{currentReconcileAdoption}% / {targetReconcile}%</span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${targetReconcile}%`, top: 0, bottom: 0, width: "2px", background: "var(--text-muted)", zIndex: 2 }} />
              <div style={{ height: "100%", width: `${currentReconcileAdoption}%`, background: "var(--color-primary)" }} />
            </div>
            <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              {language === "es" 
                ? `${bankRowsState.filter(r => r.matched).length} de ${bankRowsState.length} transacciones conciliadas.`
                : `${bankRowsState.filter(r => r.matched).length} of ${bankRowsState.length} transactions matched.`}
            </p>
          </div>

          {/* Monthly Close Checklist Card */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>{t("closeAgentName")}</h4>
              <span className={`badge ${currentCloseAdoption >= targetClose ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.6rem" }}>
                {currentCloseAdoption >= targetClose ? t("statusOnTrack") : t("statusLagging")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              <span>{language === "es" ? "Tareas Completadas" : "Tasks Resolved"}</span>
              <span style={{ fontWeight: 600 }}>{currentCloseAdoption}% / {targetClose}%</span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${targetClose}%`, top: 0, bottom: 0, width: "2px", background: "var(--text-muted)", zIndex: 2 }} />
              <div style={{ height: "100%", width: `${currentCloseAdoption}%`, background: "var(--color-accent)" }} />
            </div>
            <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              {language === "es"
                ? `${closeStepsState.filter(s => s.status === "done").length} de ${closeStepsState.length} tareas del cierre listas.`
                : `${closeStepsState.filter(s => s.status === "done").length} of ${closeStepsState.length} close steps completed.`}
            </p>
          </div>

          {/* Tax Compliance Alerts Card */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>{t("taxAgentName")}</h4>
              <span className={`badge ${currentTaxAdoption >= targetTax ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.6rem" }}>
                {currentTaxAdoption >= targetTax ? t("statusOnTrack") : t("statusLagging")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              <span>{language === "es" ? "Alertas Presentadas" : "Alerts Handled"}</span>
              <span style={{ fontWeight: 600 }}>{currentTaxAdoption}% / {targetTax}%</span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${targetTax}%`, top: 0, bottom: 0, width: "2px", background: "var(--text-muted)", zIndex: 2 }} />
              <div style={{ height: "100%", width: `${currentTaxAdoption}%`, background: "var(--color-success)" }} />
            </div>
            <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.68rem", color: "var(--text-muted)" }}>
              {language === "es"
                ? `${taxesState.filter(t => t.status === "filed" || t.status === "paid").length} de ${taxesState.length} alertas fiscales archivadas.`
                : `${taxesState.filter(t => t.status === "filed" || t.status === "paid").length} of ${taxesState.length} tax files archived.`}
            </p>
          </div>

        </div>

        {/* Targets Configuration Panel */}
        <div style={{ 
          background: "var(--bg-surface-solid)", 
          border: "1px solid var(--border-color)", 
          borderRadius: "var(--radius-md)", 
          padding: "1rem 1.25rem"
        }}>
          <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            {t("editTargets")}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            
            {/* Slider 1 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.4rem" }}>
                <span>{t("reconcileAgentName")}</span>
                <strong style={{ color: "var(--color-primary)" }}>{targetReconcile}%</strong>
              </div>
              <input 
                type="range" 
                min={50} 
                max={100} 
                value={targetReconcile} 
                onChange={(e) => setTargetReconcile(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-primary)" }}
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.4rem" }}>
                <span>{t("closeAgentName")}</span>
                <strong style={{ color: "var(--color-accent)" }}>{targetClose}%</strong>
              </div>
              <input 
                type="range" 
                min={50} 
                max={100} 
                value={targetClose} 
                onChange={(e) => setTargetClose(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-accent)" }}
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.4rem" }}>
                <span>{t("taxAgentName")}</span>
                <strong style={{ color: "var(--color-success)" }}>{targetTax}%</strong>
              </div>
              <input 
                type="range" 
                min={50} 
                max={100} 
                value={targetTax} 
                onChange={(e) => setTargetTax(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--color-success)" }}
              />
            </div>

          </div>
        </div>

      </div>

      {/* ROI & Wage Config Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem", background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.06))", border: "1px solid var(--border-color-glow)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(280px, auto)", gap: "1.5rem", alignItems: "center" }}>
          
          {/* Slider and wage controls */}
          <div>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 0.5rem 0", fontSize: "1.05rem", color: "var(--text-primary)" }}>
              <Sliders size={18} style={{ color: "var(--color-primary)" }} />
              {t("wageLabel")}
            </h3>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {language === "es" 
                ? "Ajuste el costo por hora de su personal para calibrar con precisión los ahorros operativos generados por la IA autónoma."
                : "Calibrate the average labor cost per hour to compute your true autonomous operating profit and savings."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input 
                type="range" 
                min={15} 
                max={150} 
                value={hourlyWage} 
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)", minWidth: "80px", textAlign: "right" }}>
                ${hourlyWage}/hr
              </span>
            </div>
          </div>

          {/* Core ROI Display Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem" }}>
            <div style={{ padding: "0.5rem 0" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("costAvoidance")}
              </span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-success)" }}>
                ${costAvoidance.toLocaleString()}
              </p>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("reallocatedTime")}
              </span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-accent)" }}>
                {estimatedHoursSaved} hrs
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Three Pillars Metric Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
        
        {/* Pillar 1: Technical Performance */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            <Cpu size={16} style={{ color: "var(--color-accent)" }} />
            {t("techPillar")}
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1, justifyContent: "center" }}>
            {/* Accuracy */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{t("accuracyJudge")}</span>
                <span style={{ fontWeight: 700, color: "var(--color-success)" }}>{accuracyScore}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${accuracyScore}%`, background: "var(--color-success)" }} />
              </div>
            </div>

            {/* Hallucination */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{t("hallucinationRate")}</span>
                <span style={{ fontWeight: 700, color: "var(--color-warning)" }}>{hallucinationRate}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hallucinationRate * 10}%`, background: "var(--color-warning)" }} />
              </div>
            </div>

            {/* Data Pipeline Sync Success */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{t("dataSyncSuccess")}</span>
                <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{syncSuccessRate}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${syncSuccessRate}%`, background: "var(--color-primary)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Operational Autonomy */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            <UserCheck size={16} style={{ color: "var(--color-primary)" }} />
            {t("autonomyPillar")}
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "center" }}>
            
            {/* HITL Reduction Progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{t("hitlReduction")}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{t("hitlDesc")}</span>
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-primary)" }}>{hitlReductionRate}%</span>
              </div>
              <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                <div style={{ height: "100%", width: `${hitlReductionRate}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px" }} />
              </div>
            </div>

            {/* Human FTE vs Tech Expense Ratio */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--bg-surface-solid)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <div>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, display: "block" }}>
                  {t("humanTechRatio")}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  ${monthlyTechCost} tech spend vs ${(estimatedHoursSaved * hourlyWage).toLocaleString()} FTE value
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-success)" }}>
                  {((monthlyTechCost / (Math.max(1, estimatedHoursSaved * hourlyWage))) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Pillar 3: Value & Efficiency (Business ROI) */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            <Coins size={16} style={{ color: "var(--color-success)" }} />
            {t("roiPillar")}
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1, justifyContent: "center" }}>
            
            {/* Cost Per Unit of Output */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {language === "es" ? "Costo por Consulta de IA" : "Cost Per AI Query"}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                ${stats.totalQueries > 0 ? (stats.totalCostSaved * 0.25 / stats.totalQueries).toFixed(4) : "0.0000"} USD
              </span>
            </div>

            {/* Output Growth Multiplier */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {t("outputGain")}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-success)" }}>
                {stats.totalQueries > 0 ? `${(1.5 + stats.totalQueries * 0.1).toFixed(1)}x Output` : "1.0x Baseline"}
              </span>
            </div>

            {/* New Autonomous Revenue */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {language === "es" ? "Nuevos Ingresos Autónomos" : "New Autonomous Revenue"}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary)" }}>
                ${autonomousRevenue.toLocaleString()} USD
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Data Sync & Pipeline Health Monitoring */}
      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={16} style={{ color: "var(--color-primary)" }} />
          {language === "es" ? "Monitoreo de Sincronización de Datos (MCP)" : "Data Sync & Pipeline Health (MCP)"}
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {pipelineHealth.map((pipe, idx) => (
            <div key={idx} style={{ padding: "0.85rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {pipe.category}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "var(--color-success)", fontWeight: 600 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-success)" }} />
                  {pipe.status}
                </span>
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>
                {pipe.name}
              </h4>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {language === "es" ? `Tasa de error: ` : `Error rate: `}
                <strong style={{ color: "var(--text-secondary)" }}>{pipe.errorRate}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cumulative Metrics & Savings comparisons (reused/relocated) */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
          <BarChart3 size={16} style={{ color: "var(--color-accent)" }} />
          {t("tokenCompTitle")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
          {[
            { label: t("queriesProcessed"), value: stats.totalQueries, color: "var(--color-primary)", icon: <Zap size={14} /> },
            { label: t("avgTokensSaved"),   value: `${stats.avgSavingsPercent}%`, color: "var(--color-accent)", icon: <Coins size={14} /> },
            { label: t("cumCostSaved"),      value: `$${stats.totalCostSaved.toFixed(4)}`, color: "var(--color-success)", icon: <TrendingUp size={14} /> },
            { label: t("speedup"),           value: stats.avgMcpLatency > 0 ? `${(stats.avgFullLatency / stats.avgMcpLatency).toFixed(1)}x` : "0x", color: "var(--color-warning)", icon: <Clock size={14} /> },
          ].map((c, i) => (
            <div key={i} style={{ padding: "0.85rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: c.color, marginBottom: "0.3rem" }}>
                {c.icon}<span style={{ fontSize: "0.72rem", fontWeight: 700 }}>{c.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Trace log table */}
        <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: 700 }}>{t("traceLogTitle")}</h4>
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
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {t("noLogsMessage")}
                  </td>
                </tr>
              ) : (
                observabilityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.query}
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                        {log.toolCalled}
                      </span>
                    </td>
                    <td>{log.metrics.mcpTokens}</td>
                    <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>
                      -{log.metrics.savingsPercent}%
                    </td>
                    <td style={{ color: "var(--color-success)" }}>
                      +${log.metrics.costSaved.toFixed(5)}
                    </td>
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
