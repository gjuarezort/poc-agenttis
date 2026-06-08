import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Plus, XCircle } from "lucide-react";

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
}

interface AgentsTabProps {
  language: "en" | "es";
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  skills: Skill[];
  mockConnections: any[];
  parsedData: any;
  fileName: string;
  agentFormOpen: boolean;
  setAgentFormOpen: (open: boolean) => void;
  agentEditId: string | null;
  setAgentEditId: (id: string | null) => void;
  agentFormName: string;
  setAgentFormName: (name: string) => void;
  agentFormRole: string;
  setAgentFormRole: (role: string) => void;
  agentFormDesc: string;
  setAgentFormDesc: (desc: string) => void;
  agentFormSources: string[];
  setAgentFormSources: React.Dispatch<React.SetStateAction<string[]>>;
  agentFormSkills: string[];
  setAgentFormSkills: React.Dispatch<React.SetStateAction<string[]>>;
  agentFormUsers: string;
  setAgentFormUsers: (users: string) => void;
  agentFormConfirmation: boolean;
  setAgentFormConfirmation: (confirmation: boolean) => void;
}



export const AgentsTab: React.FC = () => {
  const { language,
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
  setAgentFormConfirmation, } = useDashboard();
  const availableConnections = [
    ...mockConnections,
    ...(parsedData ? [{ id: "file-active", name: fileName, category: "CSV" }] : [])
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>🛡️</span> {language === "es" ? "Gobernanza y Roles de Agentes" : "Agent Governance & Roles"}
            </h3>
            <p style={{ margin: 0, fontSize: "0.82rem" }}>
              {language === "es" 
                ? "Configurá perfiles de agentes aislados. Definí qué fuentes de datos y habilidades tiene permitido usar cada rol."
                : "Configure isolated agent profiles. Define which data sources and skills each role is authorized to use."}
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setAgentFormOpen(true);
              setAgentEditId(null);
              setAgentFormName("");
              setAgentFormRole("");
              setAgentFormDesc("");
              setAgentFormSources([]);
              setAgentFormSkills([]);
              setAgentFormUsers("Admin, Operaciones");
              setAgentFormConfirmation(true);
            }}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
          >
            <Plus size={14} /> {language === "es" ? "Nuevo Agente" : "New Agent"}
          </button>
        </div>

        {/* Agent Builder Form */}
        {agentFormOpen && (
          <div className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.25rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color-glow)" }}>
            <h4 style={{ marginBottom: "0.85rem", fontSize: "0.9rem", color: "var(--color-primary)" }}>
              {agentEditId ? (language === "es" ? "Editar Agente" : "Edit Agent") : (language === "es" ? "Crear Nuevo Agente" : "Create New Agent")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "600px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Nombre del Agente" : "Agent Name"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === "es" ? "Ej. Asistente de Facturación" : "e.g., Billing Assistant"} 
                    value={agentFormName} 
                    onChange={e => setAgentFormName(e.target.value)} 
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Rol / Cargo" : "Role / Position"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === "es" ? "Ej. Reconciliation Agent" : "e.g., Reconciliation Agent"} 
                    value={agentFormRole} 
                    onChange={e => setAgentFormRole(e.target.value)} 
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Descripción" : "Description"}
                </label>
                <input 
                  type="text" 
                  placeholder={language === "es" ? "Ej. Agente enfocado en procesar cobros y conciliación..." : "e.g., Focused on processing customer payments..."} 
                  value={agentFormDesc} 
                  onChange={e => setAgentFormDesc(e.target.value)} 
                  style={{ fontSize: "0.85rem" }}
                />
              </div>

              {/* Select Data Sources (Checkboxes) */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Fuentes de Datos Permitidas" : "Allowed Data Sources"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "120px", overflowY: "auto" }}>
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

              {/* Select Action Skills (Checkboxes) */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {language === "es" ? "Habilidades / Acciones Permitidas" : "Allowed Skills & Actions"}
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.5rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxHeight: "120px", overflowY: "auto" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {language === "es" ? "Usuarios Autorizados (Roles)" : "Authorized User Groups"}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Admin, Billing, Operations" 
                    value={agentFormUsers} 
                    onChange={e => setAgentFormUsers(e.target.value)} 
                    style={{ fontSize: "0.85rem" }}
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
                    {language === "es" ? "Confirmación Humana (Escritura)" : "Human confirmation for Actions"}
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (!agentFormName) return;
                    const usersArray = agentFormUsers.split(",").map(u => u.trim()).filter(Boolean);
                    
                    if (agentEditId) {
                      setAgents(prev => prev.map(a => a.id === agentEditId ? {
                        ...a,
                        name: agentFormName,
                        role: agentFormRole,
                        description: agentFormDesc,
                        dataSources: agentFormSources,
                        skills: agentFormSkills,
                        users: usersArray,
                        requireConfirmation: agentFormConfirmation
                      } : a));
                    } else {
                      setAgents(prev => [
                        ...prev,
                        {
                          id: `agent-${Date.now()}`,
                          name: agentFormName,
                          role: agentFormRole,
                          description: agentFormDesc,
                          dataSources: agentFormSources,
                          skills: agentFormSkills,
                          users: usersArray,
                          requireConfirmation: agentFormConfirmation
                        }
                      ]);
                    }
                    setAgentFormOpen(false);
                  }}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                >
                  {language === "es" ? "Guardar Agente" : "Save Agent"}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setAgentFormOpen(false)}
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                >
                  {language === "es" ? "Cancelar" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agents list grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {agents.map(agent => (
            <div key={agent.id} className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span className="badge badge-info" style={{ fontSize: "0.6rem" }}>
                    {agent.role}
                  </span>
                  <span className={`badge ${agent.requireConfirmation ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.6rem" }}>
                    {agent.requireConfirmation ? "🛡️ Human-in-loop" : "⚡ Autopilot"}
                  </span>
                </div>

                <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {agent.name}
                </h4>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {agent.description}
                </p>

                {/* Connected Data Sources List */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                    {language === "es" ? "Conexiones de Datos:" : "Data Connections:"}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {agent.dataSources.length === 0 ? (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ninguna / None</span>
                    ) : (
                      agent.dataSources.map((dsId: string) => {
                        const ds = availableConnections.find(c => c.id === dsId);
                        return (
                          <span key={dsId} style={{ fontSize: "0.68rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-secondary)" }}>
                            {ds ? ds.name : dsId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Connected Skills List */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                    {language === "es" ? "Habilidades Habilitadas:" : "Authorized Skills:"}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                    {agent.skills.length === 0 ? (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ninguna / None</span>
                    ) : (
                      agent.skills.map((skId: string) => {
                        const sk = skills.find(s => s.id === skId);
                        return (
                          <span key={skId} style={{ fontSize: "0.68rem", padding: "0.15rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-secondary)" }}>
                            {sk ? sk.name : skId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Authorized Users List */}
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                    {language === "es" ? "Acceso de Usuarios:" : "User Group Access:"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {agent.users.join(", ")}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
                <button 
                  onClick={() => {
                    setAgentFormOpen(true);
                    setAgentEditId(agent.id);
                    setAgentFormName(agent.name);
                    setAgentFormRole(agent.role);
                    setAgentFormDesc(agent.description);
                    setAgentFormSources(agent.dataSources);
                    setAgentFormSkills(agent.skills);
                    setAgentFormUsers(agent.users.join(", "));
                    setAgentFormConfirmation(agent.requireConfirmation);
                  }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", padding: "0.2rem 0.5rem" }}
                >
                  {language === "es" ? "Editar" : "Edit"}
                </button>
                <button 
                  onClick={() => setAgents(prev => prev.filter(a => a.id !== agent.id))} 
                  style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem", padding: "0.2rem 0.5rem" }}
                >
                  <XCircle size={12} /> {language === "es" ? "Eliminar" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
