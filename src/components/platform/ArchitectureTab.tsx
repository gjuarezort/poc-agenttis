import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { X, Info, Database, Server, Zap, Sparkles, Layout } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  dataSources: string[];
  skills: string[];
  users: string[];
  requireConfirmation: boolean;
  delegates: string[];
  linkedApps: string[];
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

export const ArchitectureTab: React.FC = () => {
  const {
    language,
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
    skills,
    mcpServers,
    mcpExposedServers,
    apps
  } = useDashboard();

  // 1. Data Sources
  const activeSources = [
    ...mockConnections.map(c => ({ id: c.id, name: c.name, type: c.category, status: c.status })),
    ...(parsedData ? [{ id: "file-active", name: fileName, type: "CSV", status: "connected" as const }] : [])
  ];

  // 2. MCP Servers (fallback to standard gateway if empty)
  const activeMcp = (mcpServers.length > 0 || (mcpExposedServers && mcpExposedServers.length > 0))
    ? [
        ...mcpServers.map(s => ({ id: s.id, name: s.name, type: "MCP Client", status: s.status, transport: s.type, toolsCount: s.toolsCount })),
        ...(mcpExposedServers || []).map(s => ({
          id: s.id,
          name: s.name,
          type: "MCP Host",
          status: s.status === "connected" ? ("connected" as const) : ("inactive" as const),
          transport: "sse",
          toolsCount: (s.exposedSkills?.length || 0) + (s.exposedDataSources?.length || 0) + (s.exposedAgents?.length || 0)
        }))
      ]
    : [{ id: "gateway", name: "Agenttis Gateway", type: "MCP Host", status: "connected", transport: "sse", toolsCount: skills.length }];

  const currentAgent = agents.find(a => a.id === selectedGraphAgent);

  // Helper: check if node is allowed/highlighted
  const isNodeAllowed = (nodeId: string, nodeType: "source" | "mcp" | "skill" | "agent" | "app") => {
    if (selectedGraphAgent === "all" || !currentAgent) return true;

    if (nodeType === "agent") {
      return nodeId === currentAgent.id || currentAgent.delegates?.includes(nodeId);
    }
    if (nodeType === "skill") {
      return currentAgent.skills.includes(nodeId);
    }
    if (nodeType === "source") {
      return currentAgent.dataSources.includes(nodeId);
    }
    if (nodeType === "app") {
      return currentAgent.linkedApps?.includes(nodeId) || apps.some((ap: any) => ap.agents?.includes(currentAgent.id) && ap.id === nodeId);
    }
    if (nodeType === "mcp") {
      // Connect if any skill allowed by agent belongs to this mcp server
      if (nodeId === "gateway") return true;
      const mcpObj = mcpServers.find(s => s.id === nodeId);
      if (mcpObj) {
        return mcpObj.tools.some((t: any) => currentAgent.skills.some((skId: string) => skId.includes(t.name) || skId === t.id));
      }
      const expObj = mcpExposedServers?.find(s => s.id === nodeId);
      if (expObj) {
        return expObj.exposedAgents?.includes(currentAgent.id) || 
               currentAgent.skills.some((skId: string) => expObj.exposedSkills?.includes(skId)) ||
               currentAgent.dataSources.some((dsId: string) => expObj.exposedDataSources?.includes(dsId));
      }
      return false;
    }
    return true;
  };

  // Node details card details helper
  const getNodeDetails = (nodeId: string) => {
    // Check in applications
    const appItem = apps.find((ap: any) => ap.id === nodeId);
    if (appItem) {
      return {
        title: appItem.name,
        desc: appItem.description,
        status: "active",
        type: language === "es" ? "Aplicación de Tablero" : "Dashboard Application",
        metrics: [
          { label: language === "es" ? "Widgets Totales" : "Total Widgets", value: appItem.widgets?.length || 0 },
          { label: language === "es" ? "Agentes Asignados" : "Bound Agents", value: appItem.agents?.length || 0 },
          { label: language === "es" ? "Conexiones de Datos" : "Data Connections", value: appItem.dataSources?.length || 0 }
        ]
      };
    }

    // Check in agents
    const agentItem = agents.find(a => a.id === nodeId);
    if (agentItem) {
      return {
        title: agentItem.name,
        desc: agentItem.description,
        status: "active",
        type: language === "es" ? "Agente Inteligente" : "Cognitive Agent",
        metrics: [
          { label: language === "es" ? "Rol Asignado" : "Assigned Role", value: agentItem.role },
          { label: language === "es" ? "Habilidades" : "Skills Count", value: agentItem.skills.length },
          { label: language === "es" ? "Delegación Subagentes" : "Subagent Delegates", value: agentItem.delegates?.length || 0 }
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
          { label: "Method", value: skillItem.method || "GET" },
          { label: "Endpoint", value: skillItem.endpoint ?? "Local Platform Execute" },
          { label: language === "es" ? "Regla de Acceso" : "Access Rule", value: skillItem.type === "read" ? "Read-Only" : "Action Execution" }
        ]
      };
    }

    // Check in MCP Servers
    const mcpItem = activeMcp.find(m => m.id === nodeId);
    if (mcpItem) {
      return {
        title: mcpItem.name,
        desc: mcpItem.type === "MCP Host"
          ? (language === "es" ? "Servidor host local expuesto hacia LLMs externos con claves API seguras." : "Local host server exposed to external LLMs with secure API keys.")
          : (language === "es" ? "Canal de comunicación estandarizado para importar herramientas externas." : "Standardized communication channel to import external tools."),
        status: mcpItem.status,
        type: "Model Context Protocol",
        metrics: [
          { label: "Type", value: mcpItem.type },
          { label: "Transport", value: mcpItem.transport.toUpperCase() },
          { label: language === "es" ? "Recursos / Habilidades" : "Resources / Skills", value: mcpItem.toolsCount }
        ]
      };
    }

    // Check in data sources
    const sourceItem = activeSources.find(s => s.id === nodeId);
    if (sourceItem) {
      return {
        title: sourceItem.name,
        desc: language === "es" ? `Conexión activa de tipo ${sourceItem.type}.` : `Active database connector of type ${sourceItem.type}.`,
        status: sourceItem.status,
        type: language === "es" ? "Fuente de Datos" : "Data Source",
        metrics: [
          { label: "Category", value: sourceItem.type },
          { label: "Sync Status", value: sourceItem.status === "connected" ? "Synchronized" : "Pending" }
        ]
      };
    }

    return null;
  };

  const details = selectedNode ? getNodeDetails(selectedNode) : null;

  // Layout coordinate calculations helper
  const getY = (idx: number, total: number) => {
    if (total <= 1) return 210;
    const startY = 60;
    const heightRange = 300;
    return startY + idx * (heightRange / (total - 1));
  };

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: selectedNode ? "1.25fr 0.75fr" : "1fr", gap: "1.25rem", minHeight: "520px" }}>
      {/* Left Canvas */}
      <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
              {language === "es" ? "Flujo de Datos y Conexiones Activas" : "Live Enterprise Agentic Flow Map"}
            </h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              {language === "es" ? "Vista de Agente:" : "Agent Spotlight:"}
            </span>
            <select
              value={selectedGraphAgent}
              onChange={e => setSelectedGraphAgent(e.target.value)}
              style={{ fontSize: "0.8rem", width: "190px", padding: "0.3rem 0.6rem" }}
            >
              <option value="all">{language === "es" ? "Ver Todo (Mapa Completo)" : "All Agents (Full View)"}</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="visual-graph-canvas flex-center" style={{ height: "420px", background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 880 420" style={{ maxWidth: "880px" }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* CONNECTION PATH LINES */}

            {/* 1. Data Sources -> MCP Servers */}
            {activeSources.map((src, sIdx) => {
              const startY = getY(sIdx, activeSources.length);
              const srcAllowed = isNodeAllowed(src.id, "source");
              
              return activeMcp.map((mcp, mIdx) => {
                const endY = getY(mIdx, activeMcp.length);
                const mcpAllowed = isNodeAllowed(mcp.id, "mcp");
                
                // Let's decide if this data source is connected to this MCP server
                let isConnected = true;
                const expObj = mcpExposedServers?.find(s => s.id === mcp.id);
                if (expObj) {
                  isConnected = expObj.exposedDataSources?.includes(src.id) || false;
                }
                
                if (!isConnected) return null;
                const pathAllowed = srcAllowed && mcpAllowed;

                return (
                  <g key={`src-mcp-${src.id}-${mcp.id}`} style={{ opacity: pathAllowed ? 1 : 0.08, transition: "opacity 0.25s" }}>
                    <path d={`M 150 ${startY} C 180 ${startY}, 190 ${endY}, 220 ${endY}`} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    {pathAllowed && (
                      <path d={`M 150 ${startY} C 180 ${startY}, 190 ${endY}, 220 ${endY}`} fill="none" stroke="var(--color-primary)" strokeWidth="1.5" className="edge-flow" />
                    )}
                  </g>
                );
              });
            })}

            {/* 2. MCP Servers -> Skills */}
            {activeMcp.map((mcp, mIdx) => {
              const startY = getY(mIdx, activeMcp.length);
              const mcpAllowed = isNodeAllowed(mcp.id, "mcp");

              return skills.map((sk, skIdx) => {
                const endY = getY(skIdx, skills.length);
                const skAllowed = isNodeAllowed(sk.id, "skill");
                
                // Connection rule:
                // For client servers: check if the skill belongs to its tools.
                // For host servers: check if it's in exposedSkills.
                let isConnected = false;
                const clientSrv = mcpServers.find(s => s.id === mcp.id);
                if (clientSrv) {
                  isConnected = clientSrv.tools.some((t: any) => sk.id.includes(t.name) || sk.id === t.id);
                } else {
                  const expObj = mcpExposedServers?.find(s => s.id === mcp.id);
                  if (expObj) {
                    isConnected = expObj.exposedSkills?.includes(sk.id) || false;
                  }
                }
                
                if (!isConnected) return null;
                const pathAllowed = mcpAllowed && skAllowed;

                return (
                  <g key={`mcp-sk-${mcp.id}-${sk.id}`} style={{ opacity: pathAllowed ? 1 : 0.08, transition: "opacity 0.25s" }}>
                    <path d={`M 330 ${startY} C 360 ${startY}, 370 ${endY}, 400 ${endY}`} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" />
                    {pathAllowed && (
                      <path d={`M 330 ${startY} C 360 ${startY}, 370 ${endY}, 400 ${endY}`} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" className="edge-flow" />
                    )}
                  </g>
                );
              });
            })}

            {/* 3. Skills -> Agents */}
            {skills.map((sk, skIdx) => {
              const startY = getY(skIdx, skills.length);
              const skAllowed = isNodeAllowed(sk.id, "skill");

              return agents.map((agt, aIdx) => {
                const endY = getY(aIdx, agents.length);
                const agtAllowed = isNodeAllowed(agt.id, "agent") && (selectedGraphAgent === "all" || agt.id === selectedGraphAgent);
                const isSkillAssigned = agt.skills.includes(sk.id);
                const pathAllowed = skAllowed && agtAllowed && isSkillAssigned;

                return (
                  <g key={`sk-agt-${sk.id}-${agt.id}`} style={{ opacity: pathAllowed ? 1 : 0.08, transition: "opacity 0.25s" }}>
                    <path d={`M 510 ${startY} C 540 ${startY}, 550 ${endY}, 580 ${endY}`} fill="none" stroke="var(--border-color)" strokeWidth="1" />
                    {pathAllowed && (
                      <path d={`M 510 ${startY} C 540 ${startY}, 550 ${endY}, 580 ${endY}`} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" className="edge-flow" />
                    )}
                  </g>
                );
              });
            })}

            {/* 4. Agents -> Apps */}
            {agents.map((agt, aIdx) => {
              const startY = getY(aIdx, agents.length);
              const agtAllowed = isNodeAllowed(agt.id, "agent") && (selectedGraphAgent === "all" || agt.id === selectedGraphAgent);

              return apps.map((ap: any, apIdx: number) => {
                const endY = getY(apIdx, apps.length);
                const apAllowed = isNodeAllowed(ap.id, "app");
                const isLinked = ap.agents?.includes(agt.id) || agt.linkedApps?.includes(ap.id);
                const pathAllowed = agtAllowed && apAllowed && isLinked;

                return (
                  <g key={`agt-ap-${agt.id}-${ap.id}`} style={{ opacity: pathAllowed ? 1 : 0.08, transition: "opacity 0.25s" }}>
                    <path d={`M 680 ${startY} C 700 ${startY}, 710 ${endY}, 740 ${endY}`} fill="none" stroke="var(--border-color)" strokeWidth="1" />
                    {pathAllowed && (
                      <path d={`M 680 ${startY} C 700 ${startY}, 710 ${endY}, 740 ${endY}`} fill="none" stroke="var(--color-success)" strokeWidth="1.5" className="edge-flow" />
                    )}
                  </g>
                );
              });
            })}

            {/* 5. Subagent Delegation Arcs (Col 4 -> Col 4) */}
            {agents.map((agtA, idxA) => {
              const startY = getY(idxA, agents.length);
              const allowedA = isNodeAllowed(agtA.id, "agent");

              return agtA.delegates?.map((delId: string) => {
                const idxB = agents.findIndex(x => x.id === delId);
                if (idxB === -1) return null;
                const endY = getY(idxB, agents.length);
                const allowedB = isNodeAllowed(delId, "agent");
                const pathAllowed = allowedA && allowedB && (selectedGraphAgent === "all" || selectedGraphAgent === agtA.id || selectedGraphAgent === delId);

                // Draw a loop curve wrapping outward to the right
                const controlX = 640; 
                const midY = (startY + endY) / 2;

                return (
                  <g key={`del-${agtA.id}-${delId}`} style={{ opacity: pathAllowed ? 1 : 0.08, transition: "opacity 0.25s" }}>
                    <path d={`M 680 ${startY} Q ${controlX} ${midY}, 680 ${endY}`} fill="none" stroke="var(--color-warning)" strokeWidth="1.2" strokeDasharray="3,3" />
                  </g>
                );
              });
            })}

            {/* VERTICAL COLUMNS NODES */}

            {/* Column 1: Data Sources */}
            {activeSources.map((src, idx) => {
              const nodeY = getY(idx, activeSources.length);
              const isSel = selectedNode === src.id;
              const allowed = isNodeAllowed(src.id, "source");
              return (
                <g key={src.id} transform={`translate(40, ${nodeY - 22})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(src.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity 0.25s" }}>
                  <rect x="0" y="0" width="110" height="44" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-primary)" : "var(--border-color)"} strokeWidth={isSel ? "1.5" : "1"} />
                  <circle cx="15" cy="22" r="4" fill="var(--color-success)" />
                  <text x="28" y="20" fill="var(--text-primary)" fontSize="8.5" fontWeight="700">{src.name.substring(0, 15)}</text>
                  <text x="28" y="32" fill="var(--text-muted)" fontSize="7">{src.type}</text>
                </g>
              );
            })}

            {/* Column 2: MCP / Gateway Nodes */}
            {activeMcp.map((mcp, idx) => {
              const nodeY = getY(idx, activeMcp.length);
              const isSel = selectedNode === mcp.id;
              const allowed = isNodeAllowed(mcp.id, "mcp");
              return (
                <g key={mcp.id} transform={`translate(220, ${nodeY - 22})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(mcp.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity 0.25s" }}>
                  <rect x="0" y="0" width="110" height="44" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-primary)" : "var(--border-color-glow)"} strokeWidth={isSel ? "1.5" : "1"} />
                  <circle cx="15" cy="22" r="4" fill="var(--color-primary)" />
                  <text x="28" y="20" fill="var(--text-primary)" fontSize="8.5" fontWeight="700">{mcp.name.substring(0, 15)}</text>
                  <text x="28" y="32" fill="var(--text-muted)" fontSize="7">{mcp.type}</text>
                </g>
              );
            })}

            {/* Column 3: Skills Nodes */}
            {skills.map((sk, idx) => {
              const nodeY = getY(idx, skills.length);
              const isSel = selectedNode === sk.id;
              const allowed = isNodeAllowed(sk.id, "skill");
              return (
                <g key={sk.id} transform={`translate(400, ${nodeY - 22})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(sk.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity 0.25s" }}>
                  <rect x="0" y="0" width="110" height="44" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-accent)" : "var(--border-color)"} strokeWidth={isSel ? "1.5" : "1"} />
                  <circle cx="14" cy="22" r="4" fill={sk.type === "read" ? "var(--color-info)" : "var(--color-accent)"} />
                  <text x="26" y="20" fill="var(--text-primary)" fontSize="8.5" fontWeight="700">{sk.name.substring(0, 16)}</text>
                  <text x="26" y="32" fill="var(--text-muted)" fontSize="7">{sk.type === "read" ? "GET (Read)" : "POST (Write)"}</text>
                </g>
              );
            })}

            {/* Column 4: Cognitive Agents Nodes */}
            {agents.map((agt, idx) => {
              const nodeY = getY(idx, agents.length);
              const isSel = selectedNode === agt.id;
              const allowed = isNodeAllowed(agt.id, "agent");
              const spotlight = selectedGraphAgent === "all" || selectedGraphAgent === agt.id;
              
              return (
                <g key={agt.id} transform={`translate(580, ${nodeY - 22})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(agt.id)} style={{ opacity: allowed && spotlight ? 1 : 0.15, transition: "opacity 0.25s" }}>
                  <rect x="0" y="0" width="100" height="44" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-primary)" : "var(--border-color)"} strokeWidth={isSel ? "1.5" : "1"} />
                  <circle cx="14" cy="22" r="4" fill="var(--color-primary)" />
                  <text x="26" y="20" fill="var(--text-primary)" fontSize="8.5" fontWeight="700">{agt.name.substring(0, 14)}</text>
                  <text x="26" y="32" fill="var(--text-muted)" fontSize="7">{agt.role.substring(0, 15)}</text>
                </g>
              );
            })}

            {/* Column 5: Applications Dashboard Nodes */}
            {apps.map((ap: any, idx: number) => {
              const nodeY = getY(idx, apps.length);
              const isSel = selectedNode === ap.id;
              const allowed = isNodeAllowed(ap.id, "app");
              return (
                <g key={ap.id} transform={`translate(740, ${nodeY - 22})`} className={`graph-node ${isSel ? "selected" : ""}`} onClick={() => setSelectedNode(ap.id)} style={{ opacity: allowed ? 1 : 0.15, transition: "opacity 0.25s" }}>
                  <rect x="0" y="0" width="100" height="44" rx="6" fill="var(--bg-surface-solid)" stroke={isSel ? "var(--color-success)" : "var(--border-color)"} strokeWidth={isSel ? "1.5" : "1"} />
                  <circle cx="14" cy="22" r="4" fill="var(--color-success)" />
                  <text x="26" y="20" fill="var(--text-primary)" fontSize="8.5" fontWeight="700">{ap.name.substring(0, 14)}</text>
                  <text x="26" y="32" fill="var(--text-muted)" fontSize="7">Dashboard App</text>
                </g>
              );
            })}
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
