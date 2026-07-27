import React, { useState, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Info
} from "lucide-react";

interface AuditDecision {
  id: string;
  title: string;
  category: string;
  description: string;
  agent: string;
  confidence: number;
  tokensUsed: number;
  impacts: {
    approve: { cash: number; riskDelta: number; text: string; runwayDays: number };
    reject: { cash: number; riskDelta: number; text: string; runwayDays: number };
  };
}

export const DecisionSimulatorTab: React.FC = () => {
  const { language, logSecurityAction } = useDashboard();
  
  // Grounded state
  const [complianceScore, setComplianceScore] = useState<number>(92); // Scale of 100
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-reconcile");
  const [activeBranch, setActiveBranch] = useState<"approve" | "reject">("approve");
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [decisionResolved, setDecisionResolved] = useState<boolean>(false);
  
  // Audited decisions
  const [decisions, setDecisions] = useState<AuditDecision[]>([
    {
      id: "node-reconcile",
      title: language === "es" ? "Conciliar Factura Bancaria #1024" : "Reconcile Bank Invoice #1024",
      category: "Finance",
      description: language === "es" ? "Coincidencia automática de cobro de $45,000 USD contra CloudCorp." : "Automatic match of $45,000 USD receipt against CloudCorp invoice.",
      agent: "Reconciliation Agent v2.1",
      confidence: 98.4,
      tokensUsed: 1420,
      impacts: {
        approve: { 
          cash: -45000, 
          riskDelta: 5, // risk decreases (improved health)
          runwayDays: 45,
          text: language === "es" 
            ? "Mantiene las cuentas de clientes al día. Pre-simulación de tesorería: Liquidez suficiente con 45 días de caja proyectados." 
            : "Keeps client accounts receivable accurate. Cash pre-simulation: Sufficient liquidity with 45 projected runway days."
        },
        reject: { 
          cash: 0, 
          riskDelta: -10, // risk increases
          runwayDays: 52,
          text: language === "es" 
            ? "Conserva $45k en caja temporalmente, pero genera alerta de mora en el ERP e interrupción automática del servicio en 7 días." 
            : "Temporarily preserves $45k in cash, but triggers delinquency alert in ERP and automatic API suspension in 7 days."
        }
      }
    },
    {
      id: "node-tax",
      title: language === "es" ? "Presentación Mensual de Impuesto (IVA)" : "Monthly VAT Tax Filing",
      category: "Compliance",
      description: language === "es" ? "Declaración e instrucción de pago fiscal de $28,600 USD al fisco." : "File monthly invoicing declaration and authorize payment of $28,600 USD.",
      agent: "Tax Compliance Agent v1.0",
      confidence: 99.2,
      tokensUsed: 890,
      impacts: {
        approve: { 
          cash: -28600, 
          riskDelta: 8, 
          runwayDays: 42,
          text: language === "es" 
            ? "Evita multas por presentación extemporánea. El agente valida el cálculo contra el libro de compras del período." 
            : "Avoids late filing penalties. The agent verifies VAT calculations against period purchase ledgers."
        },
        reject: { 
          cash: 0, 
          riskDelta: -25, 
          runwayDays: 52,
          text: language === "es" 
            ? "Pospone el pago para el siguiente ciclo. Pre-simulación: Genera recargo del 5% e interés por mora en la próxima auditoría." 
            : "Postpones the payment to next cycle. Pre-simulation: Triggers automatic 5% surcharge and audit flags."
        }
      }
    },
    {
      id: "node-inventory",
      title: language === "es" ? "Ajustar Stock ERP (+300 SKU-982)" : "ERP Inventory Adjustment (+300 SKU-982)",
      category: "Operations",
      description: language === "es" ? "Sincronizar stock físico reportado con inventario en el módulo ERP." : "Sync physical warehouse inventory deviations with current ERP records.",
      agent: "Inventory Sync Agent v1.4",
      confidence: 94.8,
      tokensUsed: 2100,
      impacts: {
        approve: { 
          cash: 0, 
          riskDelta: 3, 
          runwayDays: 45,
          text: language === "es" 
            ? "Previsualización: Sincroniza stocks activos en la tienda online Shopify. Previene cancelaciones de pedidos por falta de stock." 
            : "Preview: Updates active stock levels in Shopify online storefront. Prevents order cancellations due to stockout."
        },
        reject: { 
          cash: 0, 
          riskDelta: -8, 
          runwayDays: 45,
          text: language === "es" 
            ? "Mantiene discrepancia en el ERP. Los clientes podrían comprar unidades no disponibles, requiriendo reembolsos manuales." 
            : "Keeps stock discrepancy in ERP. Customers could purchase unavailable units, triggering manual refund issues."
        }
      }
    }
  ]);

  const selectedDecision = useMemo(() => {
    return decisions.find(d => d.id === selectedNodeId) || decisions[0];
  }, [decisions, selectedNodeId]);

  const handleAuthorize = () => {
    if (loadingAction || !selectedDecision) return;
    
    setLoadingAction(true);
    
    // Simulate real database processing / audit log registration
    setTimeout(() => {
      setLoadingAction(false);
      setDecisionResolved(true);
      
      const impact = selectedDecision.impacts[activeBranch];
      setComplianceScore(prev => Math.min(100, Math.max(0, prev + impact.riskDelta)));
      
      // Log Action
      logSecurityAction(
        `Decision Audit Settle (${activeBranch.toUpperCase()})`,
        `Impact Simulator: ${selectedDecision.title}`,
        activeBranch === "approve" ? "success" : "warning",
        `Authorized decision: ${selectedDecision.title}. Compliance score adjusted by ${impact.riskDelta}%.`
      );

      setTimeout(() => {
        const remaining = decisions.filter(d => d.id !== selectedNodeId);
        setDecisions(remaining);
        setDecisionResolved(false);
        if (remaining.length > 0) {
          setSelectedNodeId(remaining[0].id);
        } else {
          setSelectedNodeId("");
        }
      }, 1500);
    }, 900);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Styles Injection for clean grounded UI */}
      <style dangerouslySetInnerHTML={{ __html: `
        .decision-card-active {
          border: 1px solid var(--color-primary) !important;
          background: var(--bg-surface-hover) !important;
        }
        .branch-btn-active-approve {
          border: 1px solid var(--color-success) !important;
          background: rgba(16, 185, 129, 0.04) !important;
          color: var(--color-success) !important;
        }
        .branch-btn-active-reject {
          border: 1px solid var(--color-warning) !important;
          background: rgba(245, 158, 11, 0.04) !important;
          color: var(--color-warning) !important;
        }
      `}} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-info" style={{ fontSize: "0.62rem", padding: "0.15rem 0.6rem" }}>
              {language === "es" ? "Auditoría Preventiva" : "Preventive Audit"}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={12} />
              {language === "es" ? "Previsualizador de Impacto Operativo" : "Operational Impact Previewer Active"}
            </span>
          </div>
          <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {language === "es" ? "Simulador de Impacto y Aprobación de Agentes" : "Agent Impact & Audit Simulator"}
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {language === "es" 
              ? "Audite las propuestas operativas de los agentes de IA antes de autorizarlas. Evalúe cómo impactan en la caja y el cumplimiento."
              : "Audit proposed AI agent operations before authorizing execution. View projected cash flow and compliance impacts."}
          </p>
        </div>

        {/* Grounded Score Card */}
        <div className="glass-panel" style={{ 
          padding: "0.75rem 1.25rem", 
          background: "var(--bg-surface-solid)", 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem" 
        }}>
          <div>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {language === "es" ? "Salud de Cumplimiento" : "Compliance Health"}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: complianceScore >= 80 ? "var(--color-success)" : "var(--color-warning)" }}>
                {complianceScore}%
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{language === "es" ? "puntuación" : "rating"}</span>
            </div>
          </div>
          <div style={{ position: "relative", width: "38px", height: "38px" }}>
            <svg style={{ transform: "rotate(-90deg)", width: "38px", height: "38px" }}>
              <circle cx="19" cy="19" r="16" fill="transparent" stroke="var(--border-color)" strokeWidth="2.5" />
              <circle cx="19" cy="19" r="16" fill="transparent" stroke={complianceScore >= 80 ? "var(--color-success)" : "var(--color-warning)"} strokeWidth="2.5" 
                      strokeDasharray="100.5" strokeDashoffset={100.5 - (100.5 * complianceScore) / 100} 
                      style={{ transition: "stroke-dashoffset 0.5s" }} />
            </svg>
          </div>
        </div>
      </div>

      {decisions.length === 0 ? (
        /* Empty State */
        <div className="glass-panel text-center" style={{ padding: "4rem 2rem", background: "var(--bg-surface-solid)" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(16,185,129,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <CheckCircle2 size={24} style={{ color: "var(--color-success)" }} />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.4rem 0" }}>
            {language === "es" ? "Todas las Acciones Auditadas" : "Audit Queue Cleared"}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto" }}>
            {language === "es" 
              ? "No quedan propuestas de agentes pendientes de revisión. La operación actual cumple con todos los criterios de riesgo."
              : "No pending agent proposals left. Operational pipelines are clear and running within risk parameters."}
          </p>
        </div>
      ) : (
        /* Main Grid */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "1.5rem" }}>
          
          {/* Left Column: Decision Selection List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              {language === "es" ? "Propuestas Pendientes de Agentes" : "Pending Agent Proposals"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {decisions.map(d => {
                const isActive = d.id === selectedNodeId;
                return (
                  <div
                    key={d.id}
                    className={`glass-panel ${isActive ? "decision-card-active" : ""}`}
                    onClick={() => {
                      setSelectedNodeId(d.id);
                    }}
                    style={{
                      padding: "1rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px", background: "var(--bg-surface-solid)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                        {d.category}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        {language === "es" ? "Precisión: " : "Accuracy: "}
                        <strong style={{ color: "var(--text-primary)" }}>{d.confidence}%</strong>
                      </span>
                    </div>

                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {d.title}
                    </h4>
                    
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {d.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "0.4rem", marginTop: "0.4rem", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        <Cpu size={11} />
                        {d.agent}
                      </span>
                      <span>
                        {d.tokensUsed} tokens
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit Pre-checks section */}
            <div className="glass-panel" style={{ padding: "1rem", background: "var(--bg-surface-solid)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ShieldCheck size={14} style={{ color: "var(--color-primary)" }} />
                {language === "es" ? "Chequeos Preventivos de Auditoría" : "Automated Audit Pre-checks"}
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span>{language === "es" ? "Validación de Ledger ID" : "Ledger ID validation"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span>{language === "es" ? "Verificación de duplicados" : "Duplicate query check"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span>{language === "es" ? "Conciliación de importes" : "Amount mapping validated"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ color: "var(--color-success)" }}>✓</span>
                  <span>{language === "es" ? "Seguridad de Datos (PBI)" : "Data boundaries enforced"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pre-Simulated Impact Analysis */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              {language === "es" ? "Análisis Proyectado de Impacto" : "Projected Impact Analysis"}
            </h3>

            <div className="glass-panel" style={{ 
              padding: "1.5rem", 
              background: "var(--bg-surface-solid)", 
              flex: 1, 
              display: "flex", 
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative"
            }}>
              
              {/* Settle Overlay */}
              {decisionResolved && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "var(--bg-surface-solid)",
                  opacity: 0.95,
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: activeBranch === "approve" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activeBranch === "approve" ? (
                      <CheckCircle2 size={20} style={{ color: "var(--color-success)" }} />
                    ) : (
                      <Info size={20} style={{ color: "var(--color-warning)" }} />
                    )}
                  </div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {activeBranch === "approve" 
                      ? (language === "es" ? "Acción Autorizada y Registrada" : "Action Authorized & Settled")
                      : (language === "es" ? "Acción Rechazada e Ignorada" : "Action Declined & Skipped")}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {language === "es" ? "El estado de los libros ha sido actualizado." : "Ledger states updated dynamically."}
                  </p>
                </div>
              )}

              {/* Action selection headers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                
                {/* Approve Path button */}
                <button
                  onClick={() => setActiveBranch("approve")}
                  className={`glass-panel ${activeBranch === "approve" ? "branch-btn-active-approve" : ""}`}
                  style={{
                    padding: "0.75rem",
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.15rem",
                    outline: "none"
                  }}
                >
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    {language === "es" ? "Si se Aprueba" : "If Approved"}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>
                    {language === "es" ? "Autorizar ejecución" : "Commit to ledger"}
                  </span>
                </button>

                {/* Reject/Defer Path button */}
                <button
                  onClick={() => setActiveBranch("reject")}
                  className={`glass-panel ${activeBranch === "reject" ? "branch-btn-active-reject" : ""}`}
                  style={{
                    padding: "0.75rem",
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.15rem",
                    outline: "none"
                  }}
                >
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    {language === "es" ? "Si se Rechaza" : "If Rejected"}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>
                    {language === "es" ? "Omitir u aplazar" : "Decline/Postpone"}
                  </span>
                </button>

              </div>

              {/* Grounded Financial Line Chart */}
              <div style={{ 
                background: "var(--bg-surface-solid)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <TrendingUp size={13} style={{ color: "var(--color-primary)" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      {language === "es" ? "Proyección de Caja Pro-forma (30 días)" : "Pro-forma Cash Flow Forecast (30 days)"}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: 700, 
                    color: selectedDecision.impacts[activeBranch].cash >= 0 ? "var(--color-success)" : "var(--text-secondary)"
                  }}>
                    {selectedDecision.impacts[activeBranch].cash >= 0 ? "+" : ""}${selectedDecision.impacts[activeBranch].cash.toLocaleString()} USD
                  </span>
                </div>

                {/* Grounded SVG Line Chart */}
                <div style={{ height: "90px", width: "100%" }}>
                  <svg style={{ width: "100%", height: "100%" }}>
                    {/* Horizontal Y grid lines */}
                    <line x1="0" y1="15" x2="600" y2="15" stroke="var(--border-color)" strokeWidth="0.5" />
                    <line x1="0" y1="45" x2="600" y2="45" stroke="var(--border-color)" strokeWidth="0.5" />
                    <line x1="0" y1="75" x2="600" y2="75" stroke="var(--border-color)" strokeWidth="0.5" />
                    
                    {/* Baseline path (solid flat/slight growth line) */}
                    <path
                      fill="transparent"
                      stroke="var(--text-muted)"
                      strokeWidth="1.5"
                      strokeDasharray="4"
                      d="M0 45 L 100 45 L 200 40 L 300 40 L 400 35 L 500 35"
                    />

                    {/* Forecasted path (Approve vs Reject) */}
                    <path
                      fill="transparent"
                      stroke={activeBranch === "approve" ? "var(--color-success)" : "var(--color-warning)"}
                      strokeWidth="2"
                      d={
                        activeBranch === "approve"
                          ? "M0 45 L 100 45 L 150 75 L 300 70 L 400 65 L 500 65" // Cash drops (invoice paid)
                          : "M0 45 L 100 45 L 200 45 L 300 45 L 350 55 L 500 70" // No drop initially, then drop due to penalty
                      }
                      style={{ transition: "d 0.4s ease" }}
                    />
                  </svg>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "var(--text-muted)" }}>
                  <span>{language === "es" ? "Hoy" : "Today"}</span>
                  <span>{language === "es" ? "Proyección a 30 días" : "30-day Projection"}</span>
                </div>
              </div>

              {/* Explanations & impacts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      {language === "es" ? "Runway de Caja Proyectado" : "Projected Cash Runway"}
                    </span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem", marginTop: "0.1rem" }}>
                      <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {selectedDecision.impacts[activeBranch].runwayDays}
                      </strong>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{language === "es" ? "días" : "days"}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", textAlign: "right" }}>
                      {language === "es" ? "Cambio en Nivel de Riesgo" : "Compliance Risk Delta"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.1rem", justifyContent: "flex-end" }}>
                      {selectedDecision.impacts[activeBranch].riskDelta >= 0 ? (
                        <>
                          <span style={{ color: "var(--color-success)", fontWeight: "bold", fontSize: "0.85rem" }}>
                            +{selectedDecision.impacts[activeBranch].riskDelta}%
                          </span>
                          <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{language === "es" ? "saludable" : "healthier"}</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: "var(--color-warning)", fontWeight: "bold", fontSize: "0.85rem" }}>
                            {selectedDecision.impacts[activeBranch].riskDelta}%
                          </span>
                          <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{language === "es" ? "riesgo" : "risk"}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: "0.75rem 1rem", 
                  background: "var(--bg-surface-solid)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem"
                }}>
                  <Info size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.1rem" }} />
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {selectedDecision.impacts[activeBranch].text}
                  </p>
                </div>
              </div>

              {/* Authorize Button */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                <button
                  onClick={handleAuthorize}
                  disabled={loadingAction || !selectedNodeId}
                  className={`btn ${activeBranch === "approve" ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    borderRadius: "var(--radius-md)",
                    cursor: loadingAction ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    transition: "all 0.15s ease",
                    border: "none",
                    background: activeBranch === "approve" ? "var(--color-primary)" : "var(--color-warning-solid)",
                    color: "#ffffff"
                  }}
                >
                  {loadingAction ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px", border: "2px solid #ffffff", borderRightColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.75s linear infinite" }} />
                      {language === "es" ? "Registrando decisión..." : "Registering decision in ledger..."}
                    </>
                  ) : (
                    <>
                      {activeBranch === "approve" ? (
                        <>
                          <ShieldCheck size={14} />
                          {language === "es" ? "Autorizar y Conciliar Transacción" : "Authorize & Settle Transaction"}
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} />
                          {language === "es" ? "Confirmar Rechazo / Aplazar" : "Confirm Rejection / Postpone"}
                        </>
                      )}
                    </>
                  )}
                </button>
                
                <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "center" }}>
                  {language === "es" 
                    ? "Esta acción registrará una firma de auditoría de seguridad cifrada." 
                    : "Executing this action commits a cryptographic signature to the system audit trail."}
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
