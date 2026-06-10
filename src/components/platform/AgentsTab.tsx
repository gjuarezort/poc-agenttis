import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import { Plus, XCircle, User, Network, Activity, Database, Zap } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { Input } from "../ui/Input";
import { SlideOver } from "../ui/SlideOver";

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
      <Button 
        variant="primary" 
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
        className="!py-2 !px-4 !text-xs flex items-center gap-1.5"
      >
        <Plus size={14} /> {language === "es" ? "Nuevo Agente" : "New Agent"}
      </Button>
    );
    return () => setHeaderAction(null);
  }, [language, setHeaderAction, setAgentFormOpen, setAgentEditId, setAgentFormName, setAgentFormRole, setAgentFormDesc, setAgentFormSources, setAgentFormSkills, setAgentFormUsers, setAgentFormConfirmation, hasPermission]);

  const handleSaveAgent = () => {
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
  };

  const handleDeleteAgent = () => {
    if (!agentEditId) return;
    if (!hasPermission("edit_agents")) {
      logSecurityAction(
        "Agent Deletion Blocked",
        `Agent: ${agentEditId}`,
        "blocked",
        `Attempted to delete agent without edit_agents clearance.`
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con la autorización 'edit_agents'." 
        : "Action denied: Your current role lacks 'edit_agents' authorization.");
      return;
    }
    const agentToDelete = agents.find(a => a.id === agentEditId);
    logSecurityAction(
      "Agent Deleted",
      `Agent: ${agentEditId}`,
      "success",
      `Deleted agent profile: "${agentToDelete?.name || agentEditId}".`
    );
    setAgents((prev: Agent[]) => prev.filter(a => a.id !== agentEditId));
    setAgentFormOpen(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Marketplace cards layout */}
      <div className="marketplace-grid">
        {agents.map(agent => (
          <Card 
            key={agent.id} 
            interactive
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
            className="flex flex-col p-6 min-w-[280px] cursor-pointer animate-fade-in"
          >
            {/* Top row: Icon container on left, status dot on right */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-[38px] h-[38px] rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)]">
                <User size={18} />
              </div>
              <div className="flex items-center gap-1.5">
                <div 
                  className={`w-2 h-2 rounded-full ${agent.requireConfirmation ? "bg-[var(--color-warning)]" : "bg-[var(--color-success)]"}`}
                  style={{ 
                    boxShadow: agent.requireConfirmation 
                      ? "0 0 8px var(--color-warning-glow)" 
                      : "0 0 8px var(--color-success-glow)" 
                  }} 
                />
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  {agent.requireConfirmation 
                    ? (language === "es" ? "Control Humano" : "Human check") 
                    : (language === "es" ? "Autopilot" : "Autopilot")}
                </span>
              </div>
            </div>

            {/* Main content: Title & Description */}
            <div className="flex-1">
              <Heading level="h4" className="text-sm font-bold text-[var(--text-primary)] mb-1">
                {agent.name}
              </Heading>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed m-0">
                {agent.description}
              </p>
            </div>

            {/* Bottom separator with Role badge and connections summary statistic */}
            <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-[var(--border-color)]">
              <Badge variant="info" className="text-[9px] uppercase font-mono tracking-wider font-semibold">
                {agent.role}
              </Badge>
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                {((agent.dataSources?.length || 0) + (agent.skills?.length || 0))} {language === "es" ? "recursos" : "resources"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* SLIDE-OVER DRAWER FOR AGENTS DEFINITION */}
      <SlideOver
        isOpen={agentFormOpen}
        onClose={() => setAgentFormOpen(false)}
        title={agentEditId ? (language === "es" ? "Configurar Agente" : "Configure Agent") : (language === "es" ? "Crear Nuevo Agente" : "Create New Agent")}
        description={language === "es" ? "Defina perfiles, accesos y conexiones" : "Define profiles, access rights, and subagent relations"}
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleSaveAgent}
              >
                {language === "es" ? "Guardar" : "Save"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setAgentFormOpen(false)}
              >
                {language === "es" ? "Cancelar" : "Cancel"}
              </Button>
            </div>
            {agentEditId && (
              <Button 
                variant="secondary" 
                onClick={handleDeleteAgent}
                className="!text-red-500 hover:!bg-red-500/10 hover:!text-red-500 border border-red-500/20"
              >
                {language === "es" ? "Eliminar Agente" : "Delete Agent"}
              </Button>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Nombre del Agente" : "Agent Name"}</label>
              <Input 
                type="text" 
                placeholder={language === "es" ? "Ej. Asistente Financiero" : "e.g., Billing Assistant"} 
                value={agentFormName} 
                onChange={e => setAgentFormName(e.target.value)} 
                className="bg-[var(--bg-surface-hover)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Rol / Cargo" : "Role / Position"}</label>
              <Input 
                type="text" 
                placeholder={language === "es" ? "Ej. Auditor Contable" : "e.g., Reconciliation Agent"} 
                value={agentFormRole} 
                onChange={e => setAgentFormRole(e.target.value)} 
                className="bg-[var(--bg-surface-hover)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Descripción" : "Description"}</label>
            <Input 
              type="text" 
              placeholder={language === "es" ? "Ej. Encargado de auditar cobros de Stripe..." : "e.g., Focused on processing customer payments..."} 
              value={agentFormDesc} 
              onChange={e => setAgentFormDesc(e.target.value)} 
              className="bg-[var(--bg-surface-hover)]"
            />
          </div>

          {/* Data Sources checkboxes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Fuentes de Datos Permitidas" : "Allowed Data Sources"}</label>
            <div className="flex flex-col gap-1 p-2 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] max-h-[160px] overflow-y-auto">
              {availableConnections.length === 0 ? (
                <span className="text-xs text-[var(--text-muted)] p-2">
                  {language === "es" ? "No hay fuentes de datos conectadas." : "No data sources connected."}
                </span>
              ) : (
                availableConnections.map(conn => {
                  const checked = agentFormSources.includes(conn.id);
                  return (
                    <label key={conn.id} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-surface-solid)] text-xs cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={checked}
                        onChange={() => {
                          setAgentFormSources(prev => 
                            checked ? prev.filter(id => id !== conn.id) : [...prev, conn.id]
                          );
                        }}
                        className="w-auto accent-[var(--color-primary)]"
                      />
                      <span>{conn.name} ({conn.category})</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Skills checkboxes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Habilidades / Acciones Permitidas" : "Allowed Skills & Actions"}</label>
            <div className="flex flex-col gap-1 p-2 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] max-h-[160px] overflow-y-auto">
              {skills.length === 0 ? (
                <span className="text-xs text-[var(--text-muted)] p-2">
                  {language === "es" ? "No hay habilidades creadas." : "No skills defined."}
                </span>
              ) : (
                skills.map(sk => {
                  const checked = agentFormSkills.includes(sk.id);
                  return (
                    <label key={sk.id} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-surface-solid)] text-xs cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={checked}
                        onChange={() => {
                          setAgentFormSkills(prev => 
                            checked ? prev.filter(id => id !== sk.id) : [...prev, sk.id]
                          );
                        }}
                        className="w-auto accent-[var(--color-primary)]"
                      />
                      <span>{sk.name} ({sk.type === "read" ? "GET" : "POST"})</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Delegation Network checkboxes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Red de Delegación (Subagentes)" : "Delegation Network (Subagents)"}</label>
            <div className="flex flex-col gap-1 p-2 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] max-h-[160px] overflow-y-auto">
              {agents.filter(a => a.id !== agentEditId).length === 0 ? (
                <span className="text-xs text-[var(--text-muted)] p-2">
                  {language === "es" ? "No hay otros agentes creados." : "No other agents available."}
                </span>
              ) : (
                agents.filter(a => a.id !== agentEditId).map(a => {
                  const checked = agentFormDelegates.includes(a.id);
                  return (
                    <label key={a.id} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-surface-solid)] text-xs cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={checked}
                        onChange={() => {
                          setAgentFormDelegates(prev => 
                            checked ? prev.filter(id => id !== a.id) : [...prev, a.id]
                          );
                        }}
                        className="w-auto accent-[var(--color-primary)]"
                      />
                      <span>{a.name} ({a.role})</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Linked Applications checkboxes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Vincular Aplicaciones del Tablero" : "Link Dashboard Applications"}</label>
            <div className="flex flex-col gap-1 p-2 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] max-h-[160px] overflow-y-auto">
              {apps.length === 0 ? (
                <span className="text-xs text-[var(--text-muted)] p-2">
                  {language === "es" ? "No hay aplicaciones creadas." : "No applications defined."}
                </span>
              ) : (
                apps.map(ap => {
                  const checked = agentFormApps.includes(ap.id);
                  return (
                    <label key={ap.id} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-surface-solid)] text-xs cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={checked}
                        onChange={() => {
                          setAgentFormApps(prev => 
                            checked ? prev.filter(id => id !== ap.id) : [...prev, ap.id]
                          );
                        }}
                        className="w-auto accent-[var(--color-primary)]"
                      />
                      <span>{ap.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">{language === "es" ? "Usuarios Autorizados" : "Authorized User Groups"}</label>
              <Input 
                type="text" 
                placeholder="Admin, Facturacion" 
                value={agentFormUsers} 
                onChange={e => setAgentFormUsers(e.target.value)} 
                className="bg-[var(--bg-surface-hover)]"
              />
            </div>
            <div className="flex items-center gap-2.5 h-10 pb-2">
              <input 
                type="checkbox" 
                id="chkConfirmation"
                checked={agentFormConfirmation} 
                onChange={e => setAgentFormConfirmation(e.target.checked)} 
                className="w-auto cursor-pointer accent-[var(--color-primary)]"
              />
              <label htmlFor="chkConfirmation" className="text-xs cursor-pointer font-semibold text-[var(--text-primary)]">
                {language === "es" ? "Confirmar Escritura" : "Human check for Actions"}
              </label>
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
};
