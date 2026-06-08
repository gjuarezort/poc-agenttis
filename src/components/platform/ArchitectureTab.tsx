import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { X, Info } from "lucide-react";

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
  method?: string;
  endpoint?: string;
}

interface ArchitectureTabProps {
  language: "en" | "es";
  mockConnections: any[];
  parsedData: any;
  fileName: string;
  agents: Agent[];
  selectedGraphAgent: string;
  setSelectedGraphAgent: (agent: string) => void;
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  stats: any;
  chatHistory: any[];
  skills: Skill[];
}



export const ArchitectureTab: React.FC = () => {
  const { language,
  mockConnections,
  parsedData,
  fileName,
  agents,
  selectedGraphAgent,
  setSelectedGraphAgent,
  selectedNode,
  setSelectedNode,
  stats,
  chatHistory,
  skills, } = useDashboard();
  // Identify active data sources
  const activeSources = [
    ...mockConnections.map(c => ({ id: c.id, name: c.name, type: c.category, status: c.status })),
    ...(parsedData ? [{ id: "file-active", name: fileName, type: "CSV", status: "connected" as const }] : [])
  ];

  const currentAgent = agents.find(a => a.id === selectedGraphAgent);
  
  const isSourceAllowed = (srcId: string) => {
    if (selectedGraphAgent === "all" || !currentAgent) return true;
    return currentAgent.dataSources.includes(srcId);
  };

  const isSkillAllowed = (skId: string) => {
    if (selectedGraphAgent === "all" || !currentAgent) return true;
    return currentAgent.skills.includes(skId);
  };

  // Selected node data details helper
  const getNodeDetails = (nodeId: string) => {
    if (nodeId === "gateway") {
      return {
        title: language === "es" ? "Agenttis MCP Gateway" : "Agenttis MCP Gateway",
        desc: language === "es" ? "Núcleo orquestador central que unifica las fuentes de datos y las expone de forma segura a través del protocolo estandarizado MCP." : "Central orchestrator unifying data sources and exposing them securely via Model Context Protocol.",
        status: "active",
        type: "Core Gateway",
        metrics: [
          { label: language === "es" ? "Consultas Totales" : "Total Queries", value: stats.totalQueries },
          { label: language === "es" ? "Aceleración Promedio" : "Avg Speedup", value: stats.avgMcpLatency > 0 ? `${(stats.avgFullLatency / stats.avgMcpLatency).toFixed(1)}x` : "0x" },
          { label: language === "es" ? "Tokens Ahorrados" : "Tokens Saved", value: stats.totalTokensSaved.toLocaleString() }
        ]
      };
    }
    if (nodeId === "agent") {
      return {
        title: selectedGraphAgent === "all" 
          ? (language === "es" ? "Agente de IA Genérico" : "Generic AI Agent") 
          : (currentAgent ? currentAgent.name : "AI Agent"),
        desc: selectedGraphAgent === "all"
          ? (language === "es" ? "El orquestador que consume todos los skills y datos." : "The orchestrator consuming all skills and data.")
          : (currentAgent ? currentAgent.description : "AI Agent"),
        status: "active",
        type: "LLM Agent",
        metrics: [
          { label: language === "es" ? "Mensajes Turno" : "Turn Messages", value: chatHistory.length },
          { label: language === "es" ? "Ahorro Estimado" : "Est. Savings", value: `$${stats.totalCostSaved.toFixed(4)} USD` }
        ]
      };
    }
    // Check in skills
    const skillItem = skills.find(s => s.id === nodeId);
    if (skillItem) {
      return {
        title: skillItem.name,
        desc: skillItem.description,
        status: "active",
        type: language === "es" ? "Habilidad (Skill)" : "Skill Action",
        metrics: [
          { label: language === "es" ? "Método" : "Method", value: skillItem.method },
          { label: "Endpoint", value: skillItem.endpoint ?? "N/A" },
          { label: language === "es" ? "Regla de Acceso" : "Access Rule", value: skillItem.type === "read" ? (language === "es" ? "Solo Lectura" : "Read-Only") : (language === "es" ? "Ejecución de Acción" : "Action Execution") }
        ]
      };
    }
    // Check in sources
    const sourceItem = activeSources.find(s => s.id === nodeId);
    if (sourceItem) {
      return {
        title: sourceItem.name,
        desc: language === "es" ? `Conexión activa de tipo ${sourceItem.type}.` : `Active connection of type ${sourceItem.type}.`,
        status: sourceItem.status,
        type: language === "es" ? "Fuente de Datos" : "Data Source",
        metrics: [
          { label: language === "es" ? "Categoría" : "Category", value: sourceItem.type },
          { label: language === "es" ? "Último Sinc" : "Last Sync", value: "Hace 2 horas" }
        ]
      };
    }
    return null;
  };

  const details = selectedNode ? getNodeDetails(selectedNode) : null;

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: selectedNode ? "1.25fr 0.75fr" : "1fr", gap: "1.25rem", minHeight: "520px" }}>
      {/* Left Canvas */}
      <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem" }}>{language === "es" ? "Arquitectura Agéntica de la Empresa" : "Business Agentic Architecture"}</h3>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              {language === "es" 
                ? "Esquema interactivo que ilustra el flujo de datos. Seleccioná cualquier nodo para inspeccionar sus permisos, reglas de acceso y volumen de datos procesados por la IA."
                : "Interactive diagram showing the data flow. Select any node to inspect its permissions, access rules, and data volume processed by the AI."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              {language === "es" ? "Vista de Agente:" : "Agent View:"}
            </span>
            <select
              value={selectedGraphAgent}
              onChange={e => setSelectedGraphAgent(e.target.value)}
              style={{ fontSize: "0.8rem", width: "190px", padding: "0.3rem 0.6rem" }}
            >
              <option value="all">{language === "es" ? "Todos los Agentes (Completo)" : "All Agents (Full)"}</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="visual-graph-canvas flex-center" style={{ height: "420px" }}>
          <svg width="100%" height="100%" viewBox="0 0 850 420" style={{ maxWidth: "850px" }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Animated Lines Connections */}
            {/* Sources to Gateway */}
            {activeSources.map((src, idx) => {
              const startY = activeSources.length === 1 ? 210 : 80 + idx * (260 / (activeSources.length - 1 || 1));
              const allowed = isSourceAllowed(src.id);
              return (
                <g key={`src-g-${idx}`} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity var(--transition-normal)" }}>
                  <path 
                    d={`M 150 ${startY} C 250 ${startY}, 220 210, 300 210`} 
                    fill="none" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="1.5" 
                  />
                  {allowed && (
                    <path 
                      d={`M 150 ${startY} C 250 ${startY}, 220 210, 300 210`} 
                      fill="none" 
                      stroke="var(--color-primary)" 
                      strokeWidth="1.5" 
                      className="edge-flow"
                    />
                  )}
                </g>
              );
            })}

            {/* Gateway to Skills */}
            {skills.map((sk, idx) => {
              const endY = 80 + idx * (260 / (skills.length - 1 || 1));
              const allowed = isSkillAllowed(sk.id);
              return (
                <g key={`sk-g-${idx}`} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity var(--transition-normal)" }}>
                  <path 
                    d={`M 400 210 C 480 210, 450 ${endY}, 550 ${endY}`} 
                    fill="none" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="1.5" 
                  />
                  {allowed && (
                    <path 
                      d={`M 400 210 C 480 210, 450 ${endY}, 550 ${endY}`} 
                      fill="none" 
                      stroke="var(--color-accent)" 
                      strokeWidth="1.5" 
                      className="edge-flow"
                    />
                  )}
                </g>
              );
            })}

            {/* Skills to AI Agent */}
            {skills.map((sk, idx) => {
              const startY = 80 + idx * (260 / (skills.length - 1 || 1));
              const allowed = isSkillAllowed(sk.id);
              return (
                <path 
                  key={`sk-agent-${idx}`}
                  d={`M 670 ${startY} C 730 ${startY}, 700 210, 730 210`} 
                  fill="none" 
                  stroke="var(--border-color)" 
                  strokeWidth="1" 
                  style={{ opacity: allowed ? 1 : 0.15, transition: "opacity var(--transition-normal)" }}
                />
              );
            })}

            {/* Left side Nodes: Sources */}
            {activeSources.map((src, idx) => {
              const nodeY = activeSources.length === 1 ? 210 : 80 + idx * (260 / (activeSources.length - 1 || 1));
              const isSel = selectedNode === src.id;
              const allowed = isSourceAllowed(src.id);
              return (
                <g key={src.id} transform={`translate(50, ${nodeY - 25})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(src.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity var(--transition-normal)" }}>
                  <rect x="0" y="0" width="100" height="50" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-primary)" : "var(--border-color)"} strokeWidth="1" />
                  <circle cx="15" cy="25" r="5" fill="var(--color-success)" />
                  <text x="30" y="22" fill="var(--text-primary)" fontSize="9" fontWeight="700">{src.name.substring(0, 12)}</text>
                  <text x="30" y="35" fill="var(--text-muted)" fontSize="8">{src.type}</text>
                </g>
              );
            })}

            {/* Center Node: Gateway */}
            <g transform="translate(300, 175)" className={`graph-node ${selectedNode === "gateway" ? "selected" : ""}`} onClick={() => setSelectedNode("gateway")}>
              <rect x="0" y="0" width="100" height="70" rx="8" fill="var(--bg-surface-solid)" stroke={selectedNode === "gateway" ? "var(--color-primary)" : "var(--color-primary-glow)"} strokeWidth="1.5" />
              <circle cx="50" cy="35" r="28" fill="rgba(255,255,255,0.02)" stroke="var(--border-color-glow)" strokeWidth="1" />
              <text x="50" y="32" fill="var(--text-primary)" fontSize="10" fontWeight="800" textAnchor="middle">Agenttis</text>
              <text x="50" y="45" fill="var(--color-primary)" fontSize="8" fontWeight="600" textAnchor="middle">MCP CORE</text>
              <text x="50" y="58" fill="var(--color-success)" fontSize="7" fontWeight="700" textAnchor="middle">● GATEWAY</text>
            </g>

            {/* Right-Center Nodes: Skills */}
            {skills.map((sk, idx) => {
              const nodeY = 80 + idx * (260 / (skills.length - 1 || 1));
              const isSel = selectedNode === sk.id;
              const allowed = isSkillAllowed(sk.id);
              return (
                <g key={sk.id} transform={`translate(550, ${nodeY - 25})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(sk.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity var(--transition-normal)" }}>
                  <rect x="0" y="0" width="120" height="50" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-accent)" : "var(--border-color)"} strokeWidth="1" />
                  <circle cx="15" cy="25" r="4" fill={sk.type === "read" ? "var(--color-accent)" : "var(--color-success)"} />
                  <text x="26" y="22" fill="var(--text-primary)" fontSize="9" fontWeight="700">{sk.name.substring(0, 15)}</text>
                  <text x="26" y="35" fill="var(--text-muted)" fontSize="8">{sk.type === "read" ? "GET (Read)" : "POST (Action)"}</text>
                </g>
              );
            })}

            {/* Far Right Node: AI Agent */}
            <g transform="translate(730, 185)" className={`graph-node ${selectedNode === "agent" ? "selected" : ""}`} onClick={() => setSelectedNode("agent")}>
              <rect x="0" y="0" width="90" height="50" rx="6" fill="var(--bg-surface-solid)" stroke={selectedNode === "agent" ? "var(--color-primary)" : "var(--border-color)"} strokeWidth="1" />
              <circle cx="45" cy="25" r="18" fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
              <text x="45" y="28" fill="var(--text-primary)" fontSize="8" fontWeight="700" textAnchor="middle">
                {selectedGraphAgent === "all" ? (language === "es" ? "Agente de IA" : "AI Agent") : (currentAgent ? currentAgent.role.substring(0, 16) : "AI Agent")}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Right Side Node Details Drawer */}
      {selectedNode && details && (
        <div className="glass-panel animate-fade-in" style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-surface-solid)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            <div>
              <span className="badge badge-info" style={{ fontSize: "0.6rem" }}>{details.type}</span>
              <h3 style={{ margin: "0.2rem 0 0", fontSize: "1rem" }}>{details.title}</h3>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
              <X size={16} />
            </button>
          </div>

          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{details.desc}</p>

          <div>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              {language === "es" ? "Reglas de Seguridad y Acceso" : "Security & Access Rules"}
            </h4>
            <div style={{ padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
                <span>{language === "es" ? "Estado de Conexión de IA" : "AI Connection Status"}</span>
                <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{language === "es" ? "● Conectado y Seguro" : "● Connected & Secure"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              {language === "es" ? "Métricas del Componente" : "Component Metrics"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {details.metrics.map((m: any, idx: number) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{m.label}</span>
                  <strong style={{ color: "var(--text-primary)" }}>{m.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
