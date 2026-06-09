import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import { Plus, XCircle, User, Network, Sparkles, Terminal, Activity, FileCode } from "lucide-react";

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

export const AgentsTab: React.FC = () => {
  const {
    language,
    agents,
    setAgents,
    skills,
    mockConnections,
    parsedData,
    fileName,
    agentFormOpen,
    setAgentFormOpen,
    agentEditId,
    setAgentEditId,
    agentFormName,
    setAgentFormName,
    agentFormRole,
    setAgentFormRole,
    agentFormDesc,
    setAgentFormDesc,
    agentFormSources,
    setAgentFormSources,
    agentFormSkills,
    setAgentFormSkills,
    agentFormUsers,
    setAgentFormUsers,
    agentFormConfirmation,
    setAgentFormConfirmation,
    setHeaderAction,
    apps,
    hasPermission,
    logSecurityAction
  } = useDashboard();

  // Local state for delegates & linked apps in form
  const [agentFormDelegates, setAgentFormDelegates] = useState<string[]>([]);
  const [agentFormApps, setAgentFormApps] = useState<string[]>([]);

  const availableConnections = [
    ...mockConnections,
    ...(parsedData ? [{ id: "file-active", name: fileName, category: "CSV" }] : [])
  ];

  React.useEffect(() => {
    setHeaderAction(
      <button 
        className="btn btn-primary" 
        onClick={() => {
          if (!hasPermission("edit_agents")) {
            logSecurityAction(
              "Agent Configuration Blocked",
              "Agents Setup module",
              "blocked",
              "Attempted to open Create Agent form without edit_agents clearance."
            );
            alert(language === "es" 
              ? "Acción denegada: Tu rol no cuenta con la autorización 'edit_agents'." 
              : "Action denied: Your current role lacks 'edit_agents' authorization.");
            return;
          }
          setAgentFormOpen(true);
          setAgentEditId(null);
          setAgentFormName("");
          setAgentFormRole("");
          setAgentFormDesc("");
          setAgentFormSources([]);
          setAgentFormSkills([]);
          setAgentFormUsers("Admin, Operaciones");
          setAgentFormConfirmation(true);
          setAgentFormDelegates([]);
          setAgentFormApps([]);
        }}
        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
      >
        <Plus size={14} /> {language === "es" ? "Nuevo Agente" : "New Agent"}
      </button>
    );
    return () => setHeaderAction(null);
  }, [language, setHeaderAction, setAgentFormOpen, setAgentEditId, setAgentFormName, setAgentFormRole, setAgentFormDesc, setAgentFormSources, setAgentFormSkills, setAgentFormUsers, setAgentFormConfirmation, hasPermission]);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Marketplace cards layout */}
      <div className="marketplace-grid">
        {agents.map(agent => (
          <div 
            key={agent.id} 
            className="glass-panel" 
            style={{ 
              padding: "1.35rem", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between", 
              gap: "1rem", 
              background: "var(--bg-surface-solid)", 
              border: "1px solid var(--border-color)", 
              minWidth: "280px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <span className="badge badge-info" style={{ fontSize: "0.6rem" }}>
                  {agent.role}
                </span>
                <span className={`badge ${agent.requireConfirmation ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.6rem" }}>
                  {agent.requireConfirmation ? "🛡️ Human-in-loop" : "⚡ Autopilot"}
                </span>
              </div>

              <h4 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {agent.name}
              </h4>
              <p style={{ margin: "0 0 0.85rem", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {agent.description}
              </p>

              {/* Connected Data Sources List */}
              <div style={{ marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  {language === "es" ? "Fuentes de Datos:" : "Data Sources:"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                  {agent.dataSources.length === 0 ? (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ninguna / None</span>
                  ) : (
                    agent.dataSources.map((dsId: string) => {
                      const ds = availableConnections.find(c => c.id === dsId);
                      return (
                        <span key={dsId} style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-secondary)" }}>
                          {ds ? ds.name : dsId}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Connected Skills List */}
              <div style={{ marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  {language === "es" ? "Habilidades:" : "Skills:"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                  {agent.skills.length === 0 ? (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ninguna / None</span>
                  ) : (
                    agent.skills.map((skId: string) => {
                      const sk = skills.find(s => s.id === skId);
                      return (
                        <span key={skId} style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-secondary)" }}>
                          {sk ? sk.name : skId}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Connections section (Delegation Agents & Linked Apps) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.6rem", marginTop: "0.6rem" }}>
                <div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.15rem" }}>
                    {language === "es" ? "Delegación Subagente:" : "Delegation Network:"}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {(!agent.delegates || agent.delegates.length === 0) ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Ninguno / None</span>
                    ) : (
                      agent.delegates.map((delId: string) => {
                        const linkedAgt = agents.find(a => a.id === delId);
                        return (
                          <span key={delId} style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--color-primary)" }}>
                            {linkedAgt ? linkedAgt.name : delId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.15rem" }}>
                    {language === "es" ? "Aplicaciones Vinculadas:" : "Linked Apps:"}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {(!agent.linkedApps || agent.linkedApps.length === 0) ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Ninguna / None</span>
                    ) : (
                      agent.linkedApps.map((appId: string) => {
                        const linkedApp = apps.find(ap => ap.id === appId);
                        return (
                          <span key={appId} style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--color-success)" }}>
                            {linkedApp ? linkedApp.name : appId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.6rem", marginTop: "0.4rem" }}>
              <button 
                onClick={() => {
                  if (!hasPermission("edit_agents")) {
                    logSecurityAction(
                      "Agent Configuration Blocked",
                      `Agent: ${agent.id}`,
                      "blocked",
                      `Attempted to edit agent "${agent.name}" configuration without edit_agents clearance.`
                    );
                    alert(language === "es" 
                      ? "Acción denegada: Tu rol no cuenta con la autorización 'edit_agents'." 
                      : "Action denied: Your current role lacks 'edit_agents' authorization.");
                    return;
                  }
                  setAgentFormOpen(true);
                  setAgentEditId(agent.id);
                  setAgentFormName(agent.name);
                  setAgentFormRole(agent.role);
                  setAgentFormDesc(agent.description);
                  setAgentFormSources(agent.dataSources);
                  setAgentFormSkills(agent.skills);
                  setAgentFormUsers(agent.users.join(", "));
                  setAgentFormConfirmation(agent.requireConfirmation);
                  setAgentFormDelegates(agent.delegates || []);
                  setAgentFormApps(agent.linkedApps || []);
                }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", padding: "0.2rem 0.5rem" }}
              >
                {language === "es" ? "Editar" : "Edit"}
              </button>
              <button 
                onClick={() => {
                  if (!hasPermission("edit_agents")) {
                    logSecurityAction(
                      "Agent Deletion Blocked",
                      `Agent: ${agent.id}`,
                      "blocked",
                      `Attempted to delete agent "${agent.name}" without edit_agents clearance.`
                    );
                    alert(language === "es" 
                      ? "Acción denegada: Tu rol no cuenta con la autorización 'edit_agents'." 
                      : "Action denied: Your current role lacks 'edit_agents' authorization.");
                    return;
                  }
                  logSecurityAction(
                    "Agent Deleted",
                    `Agent: ${agent.id}`,
                    "success",
                    `Deleted agent profile: "${agent.name}".`
                  );
                  setAgents(prev => prev.filter(a => a.id !== agent.id));
                }}
                style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem" }}
              >
                <XCircle size={12} /> {language === "es" ? "Eliminar" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SLIDE-OVER DRAWER FOR AGENTS DEFINITION */}
      {agentFormOpen && (
        <>
          <div className="modal-overlay animate-fade-in" onClick={() => setAgentFormOpen(false)} />
          <div className="slide-over-panel" style={{ maxWidth: "520px", display: "flex", flexDirection: "column" }}>
            
            {/* Header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface-solid)" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  {agentEditId ? (language === "es" ? "Configurar Agente" : "Configure Agent") : (language === "es" ? "Crear Nuevo Agente" : "Create New Agent")}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {language === "es" ? "Defina perfiles, accesos y conexiones" : "Define profiles, access rights, and subagent relations"}
                </span>
              </div>
              <button onClick={() => setAgentFormOpen(false)} className="btn-secondary" style={{ padding: "0.4rem", borderRadius: "50%" }}>
                <XCircle size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Nombre del Agente" : "Agent Name"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === "es" ? "Ej. Asistente Financiero" : "e.g., Billing Assistant"} 
                    value={agentFormName} 
                    onChange={e => setAgentFormName(e.target.value)} 
                    style={{ fontSize: "0.85rem", width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Rol / Cargo" : "Role / Position"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === "es" ? "Ej. Auditor Contable" : "e.g., Reconciliation Agent"} 
                    value={agentFormRole} 
                    onChange={e => setAgentFormRole(e.target.value)} 
                    style={{ fontSize: "0.85rem", width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Descripción" : "Description"}
                </label>
                <input 
                  type="text" 
                  placeholder={language === "es" ? "Ej. Encargado de auditar cobros de Stripe..." : "e.g., Focused on processing customer payments..."} 
                  value={agentFormDesc} 
                  onChange={e => setAgentFormDesc(e.target.value)} 
                  style={{ fontSize: "0.85rem", width: "100%" }}
                />
              </div>

              {/* Data Sources checkboxes */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Fuentes de Datos Permitidas" : "Allowed Data Sources"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "110px", overflowY: "auto" }}>
                  {availableConnections.length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.25rem" }}>
                      {language === "es" ? "No hay fuentes de datos conectadas." : "No data sources connected."}
                    </span>
                  ) : (
                    availableConnections.map(conn => {
                      const checked = agentFormSources.includes(conn.id);
                      return (
                        <label key={conn.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={checked}
                            onChange={() => {
                              setAgentFormSources(prev => 
                                checked ? prev.filter(id => id !== conn.id) : [...prev, conn.id]
                              );
                            }}
                            style={{ width: "auto" }}
                          />
                          <span>{conn.name} ({conn.category})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Skills checkboxes */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Habilidades / Acciones Permitidas" : "Allowed Skills & Actions"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "110px", overflowY: "auto" }}>
                  {skills.length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.25rem" }}>
                      {language === "es" ? "No hay habilidades creadas." : "No skills defined."}
                    </span>
                  ) : (
                    skills.map(sk => {
                      const checked = agentFormSkills.includes(sk.id);
                      return (
                        <label key={sk.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={checked}
                            onChange={() => {
                              setAgentFormSkills(prev => 
                                checked ? prev.filter(id => id !== sk.id) : [...prev, sk.id]
                              );
                            }}
                            style={{ width: "auto" }}
                          />
                          <span>{sk.name} ({sk.type === "read" ? "GET" : "POST"})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Delegation Network checkboxes */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Red de Delegación (Subagentes)" : "Delegation Network (Subagents)"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "110px", overflowY: "auto" }}>
                  {agents.filter(a => a.id !== agentEditId).length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.25rem" }}>
                      {language === "es" ? "No hay otros agentes creados." : "No other agents available."}
                    </span>
                  ) : (
                    agents.filter(a => a.id !== agentEditId).map(a => {
                      const checked = agentFormDelegates.includes(a.id);
                      return (
                        <label key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={checked}
                            onChange={() => {
                              setAgentFormDelegates(prev => 
                                checked ? prev.filter(id => id !== a.id) : [...prev, a.id]
                              );
                            }}
                            style={{ width: "auto" }}
                          />
                          <span>{a.name} ({a.role})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Linked Applications checkboxes */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Vincular Aplicaciones del Tablero" : "Link Dashboard Applications"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "110px", overflowY: "auto" }}>
                  {apps.length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.25rem" }}>
                      {language === "es" ? "No hay aplicaciones creadas." : "No applications defined."}
                    </span>
                  ) : (
                    apps.map(ap => {
                      const checked = agentFormApps.includes(ap.id);
                      return (
                        <label key={ap.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", cursor: "pointer" }}>
                          <input 
                            type="checkbox" 
                            checked={checked}
                            onChange={() => {
                              setAgentFormApps(prev => 
                                checked ? prev.filter(id => id !== ap.id) : [...prev, ap.id]
                              );
                            }}
                            style={{ width: "auto" }}
                          />
                          <span>{ap.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Usuarios Autorizados" : "Authorized User Groups"}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Admin, Facturacion" 
                    value={agentFormUsers} 
                    onChange={e => setAgentFormUsers(e.target.value)} 
                    style={{ fontSize: "0.85rem", width: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                  <input 
                    type="checkbox" 
                    id="chkConfirmation"
                    checked={agentFormConfirmation} 
                    onChange={e => setAgentFormConfirmation(e.target.checked)} 
                    style={{ width: "auto", cursor: "pointer" }}
                  />
                  <label htmlFor="chkConfirmation" style={{ fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}>
                    {language === "es" ? "Confirmar Escritura" : "Human check for Actions"}
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifySelf: "flex-end", gap: "0.5rem", background: "var(--bg-surface-solid)" }}>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!agentFormName) return;
                  const usersArray = agentFormUsers.split(",").map(u => u.trim()).filter(Boolean);
                  
                  if (agentEditId) {
                    setAgents((prev: Agent[]) => prev.map(a => a.id === agentEditId ? {
                      ...a,
                      name: agentFormName,
                      role: agentFormRole,
                      description: agentFormDesc,
                      dataSources: agentFormSources,
                      skills: agentFormSkills,
                      users: usersArray,
                      requireConfirmation: agentFormConfirmation,
                      delegates: agentFormDelegates,
                      linkedApps: agentFormApps
                    } : a));
                    logSecurityAction(
                      "Agent Modified",
                      `Agent: ${agentEditId}`,
                      "success",
                      `Successfully modified configuration for agent: "${agentFormName}".`
                    );
                  } else {
                    const newAgentId = `agent-${Date.now()}`;
                    setAgents((prev: Agent[]) => [
                      ...prev,
                      {
                        id: newAgentId,
                        name: agentFormName,
                        role: agentFormRole,
                        description: agentFormDesc,
                        dataSources: agentFormSources,
                        skills: agentFormSkills,
                        users: usersArray,
                        requireConfirmation: agentFormConfirmation,
                        delegates: agentFormDelegates,
                        linkedApps: agentFormApps
                      }
                    ]);
                    logSecurityAction(
                      "Agent Created",
                      `Agent: ${newAgentId}`,
                      "success",
                      `Successfully created new agent profile: "${agentFormName}".`
                    );
                  }
                  setAgentFormOpen(false);
                }}
                style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}
              >
                {language === "es" ? "Guardar Agente" : "Save Agent"}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setAgentFormOpen(false)}
                style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}
              >
                {language === "es" ? "Cancelar" : "Cancel"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
