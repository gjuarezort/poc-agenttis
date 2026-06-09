import React, { useState } from "react";
import { useDashboard, UserProfile } from "../../context/DashboardContext";
import { PERMISSION_CATEGORIES } from "../../lib/rolePolicyMetadata";
import {
  Users,
  Shield,
  FileText,
  Network,
  UserPlus,
  Search,
  Check,
  X,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Database,
  SlidersHorizontal,
  Server,
  Play
} from "lucide-react";

export const UsersTab: React.FC = () => {
  const {
    language,
    users,
    setUsers,
    permissionPolicy,
    setPermissionPolicy,
    rolesMetadata,
    setRolesMetadata,
    securityLogs,
    logSecurityAction,
    currentUser
  } = useDashboard();

  // Internal tab state: "directory" | "policies" | "logs" | "map" | "ai-setup"
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "policies" | "logs" | "map" | "ai-setup">("directory");

  // User Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Accountant");

  // Search & Filters for Logs
  const [logSearch, setLogSearch] = useState("");
  const [logFilter, setLogFilter] = useState<"all" | "success" | "warning" | "blocked">("all");

  // Selected User for Visual Map
  const [selectedMapUser, setSelectedMapUser] = useState<string>(users[0]?.id || "");

  // AI Prompt compiler states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiRunning, setAiRunning] = useState(false);
  const [aiOutput, setAiOutput] = useState<string[]>([]);

  const runAiSetup = (promptText: string) => {
    if (!promptText.trim()) return;
    setAiRunning(true);
    setAiOutput([
      `[AI Agent] Analyzing security policy request: "${promptText}"`,
      `[AI Agent] Scanning existing role schema & categories...`,
      `[AI Agent] Verifying compliance with organizational security constraints...`
    ]);

    setTimeout(() => {
      setAiOutput(prev => [...prev, `[AI Agent] Resolving permissions mapping...`]);
    }, 600);

    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let updatedRoles = [...rolesMetadata];
      let detailsMessage = "";
      const actionName = "AI Policy Synthesis";

      // 1. Check if it targets modifying "Accountant"
      if (lower.includes("accountant") || lower.includes("contador")) {
        updatedRoles = updatedRoles.map(role => {
          if (role.key === "Accountant") {
            const newAgents = [...role.permissions.agents];
            if (lower.includes("edit") && !newAgents.includes("edit")) newAgents.push("edit");
            if (lower.includes("bypass") && !newAgents.includes("bypass")) newAgents.push("bypass");
            
            detailsMessage = `Granted agent edit/bypass privileges to Accountant role.`;
            return {
              ...role,
              permissions: { ...role.permissions, agents: newAgents }
            };
          }
          return role;
        });
      }
      // 2. Check if it targets revoking "Guest"
      else if ((lower.includes("guest") || lower.includes("invitado")) && (lower.includes("revoke") || lower.includes("remove") || lower.includes("eliminar") || lower.includes("quitar"))) {
        updatedRoles = updatedRoles.map(role => {
          if (role.key === "Guest") {
            detailsMessage = `Revoked all permissions from Guest profile.`;
            return {
              ...role,
              permissions: { modules: ["home"], agents: [], skills: [], mcp: [], data_sources: [] }
            };
          }
          return role;
        });
      }
      // 3. Dynamic role creation / fallback
      else {
        // Parse modules
        const modulesList: string[] = ["home"];
        if (lower.includes("play") || lower.includes("chat")) modulesList.push("playground");
        if (lower.includes("reconcil") || lower.includes("banc")) modulesList.push("reconciliation");
        if (lower.includes("close") || lower.includes("cierre")) modulesList.push("monthlyClose");
        if (lower.includes("tax") || lower.includes("fiscal")) modulesList.push("taxAlerts");
        if (lower.includes("connect") || lower.includes("fuent")) modulesList.push("connections");
        if (lower.includes("skill") || lower.includes("habil")) modulesList.push("skills");
        if (lower.includes("mcp") || lower.includes("servid")) modulesList.push("mcpServers");
        if (lower.includes("agent") || lower.includes("agent")) modulesList.push("agents");
        if (lower.includes("market") || lower.includes("marketplace")) modulesList.push("marketplace");
        if (lower.includes("setting") || lower.includes("config")) modulesList.push("settings");

        // Parse actions
        const agentsList: string[] = [];
        if (lower.includes("execut") || lower.includes("ejecut")) agentsList.push("execute");
        if (lower.includes("edit") || lower.includes("modific") || lower.includes("crear")) agentsList.push("edit");
        if (lower.includes("bypass") || lower.includes("evitar")) agentsList.push("bypass");

        const skillsList: string[] = [];
        if (lower.includes("skill") && (lower.includes("edit") || lower.includes("crear"))) skillsList.push("create_edit");

        // Generate dynamic name
        let roleName = "Custom Role";
        if (lower.includes("support") || lower.includes("soporte")) roleName = "Support Operator";
        else if (lower.includes("manager") || lower.includes("gerente")) roleName = "Operations Manager";
        else if (lower.includes("billing") || lower.includes("factur")) roleName = "Billing Agent";
        else if (lower.includes("auditor")) roleName = "External Auditor";
        
        // Pick an avatar color/theme
        const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#a855f7", "#14b8a6"];
        const index = Math.floor(Math.random() * colors.length);
        const color = colors[index];

        const newRole = {
          key: roleName,
          name: roleName,
          description: `AI-generated security clearance role: ${promptText.length > 50 ? promptText.substring(0, 50) + "..." : promptText}`,
          color: color,
          bgColor: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.12)`,
          borderColor: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.2)`,
          permissions: {
            modules: modulesList,
            agents: agentsList,
            skills: skillsList,
            mcp: lower.includes("mcp") ? ["manage"] : [],
            data_sources: ["read"]
          }
        };

        updatedRoles.push(newRole);
        detailsMessage = `Synthesized new role '${roleName}' with views: [${modulesList.join(", ")}].`;
      }

      setRolesMetadata(updatedRoles);
      logSecurityAction(actionName, "AI System Setup", "success", detailsMessage);
      
      setAiOutput(prev => [
        ...prev,
        `[AI Agent] Policy changes compiled successfully.`,
        `[AI Agent] Writing metadata updates into JSON active configuration...`,
        `[AI Agent] Done! Security roles successfully updated. (${detailsMessage})`
      ]);
      setAiRunning(false);
    }, 1500);
  };

  // Add new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim() || !newUserEmail.trim()) return;

    const newUser: UserProfile = {
      id: "u-" + Math.random().toString(36).substr(2, 9),
      name: newUserName,
      username: newUserUsername.toLowerCase(),
      email: newUserEmail,
      role: newUserRole,
      status: "active",
      avatar: newUserName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      lastLogin: "Never"
    };

    setUsers(prev => [...prev, newUser]);
    logSecurityAction(
      "User Created",
      "User Registry",
      "success",
      `Created new user account: ${newUser.name} as ${newUser.role}.`
    );

    // Reset Form
    setNewUserName("");
    setNewUserUsername("");
    setNewUserEmail("");
    setNewUserRole("Accountant");
    setDrawerOpen(false);
  };

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (u.id === currentUser.id) {
          alert(language === "es" ? "No puedes desactivarte a ti mismo." : "You cannot deactivate yourself.");
          return u;
        }
        const nextStatus = u.status === "active" ? "inactive" : "active";
        logSecurityAction(
          nextStatus === "active" ? "User Activated" : "User Deactivated",
          "User Registry",
          nextStatus === "active" ? "success" : "warning",
          `Status changed for ${u.name} to ${nextStatus}.`
        );
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Update user role
  const updateUserRole = (userId: string, role: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (u.id === currentUser.id) {
          alert(language === "es" ? "No puedes cambiar tu propio rol por seguridad." : "You cannot change your own role for security reasons.");
          return u;
        }
        logSecurityAction(
          "User Role Modified",
          "User Registry",
          "success",
          `Role changed for ${u.name} from ${u.role} to ${role}.`
        );
        return { ...u, role };
      }
      return u;
    }));
  };

  // Toggle permission in matrix
  const togglePermission = (role: string, category: "views" | "actions", key: string) => {
    if (role === "Admin") return; // Admin is immutable

    setPermissionPolicy(prev => {
      const policyCopy = JSON.parse(JSON.stringify(prev));
      const rolePolicy = policyCopy[role];

      if (!rolePolicy) return prev;

      if (category === "views") {
        if (rolePolicy.views.includes(key)) {
          rolePolicy.views = rolePolicy.views.filter((v: string) => v !== key);
        } else {
          rolePolicy.views.push(key);
        }
      } else {
        rolePolicy.actions[key] = !rolePolicy.actions[key];
      }

      logSecurityAction(
        "Access Policy Updated",
        "Authorization Matrix",
        "success",
        `Modified ${category === "views" ? "view access to " + key : "action clearance: " + key} for role ${role}.`
      );

      return policyCopy;
    });
  };

  // Filter security logs
  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user.name.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(logSearch.toLowerCase()) ||
      log.resource.toLowerCase().includes(logSearch.toLowerCase());

    const matchesFilter =
      logFilter === "all" || log.status === logFilter;

    return matchesSearch && matchesFilter;
  });

  // Access Map active user details
  const activeMapUserObj = users.find(u => u.id === selectedMapUser) || users[0];

  // Permissions list categorized for matrix
  const permissionCategories = {
    views: [
      { key: "reconciliation", label: language === "es" ? "Conciliación Bancaria" : "Bank Reconciliation" },
      { key: "monthlyClose", label: language === "es" ? "Cierre Mensual" : "Monthly Close" },
      { key: "taxAlerts", label: language === "es" ? "Alertas Fiscales" : "Tax Alerts" },
      { key: "connections", label: language === "es" ? "Fuentes de Datos" : "Data Sources" },
      { key: "skills", label: language === "es" ? "Habilidades" : "Skills" },
      { key: "mcpServers", label: language === "es" ? "Servidores MCP" : "MCP Servers" },
      { key: "agents", label: language === "es" ? "Agentes" : "Agents" },
      { key: "apps", label: language === "es" ? "Catálogo de Aplicaciones" : "Applications" },
      { key: "visualGraph", label: language === "es" ? "Arquitectura" : "Architecture" },
      { key: "playground", label: language === "es" ? "Playground" : "Playground" },
      { key: "recipe", label: language === "es" ? "Código MCP" : "Generated MCP Code" },
      { key: "marketplace", label: language === "es" ? "Marketplace" : "Marketplace" },
      { key: "settings", label: language === "es" ? "Configuración" : "Settings" }
    ],
    actions: [
      { key: "execute_agents", label: language === "es" ? "Ejecutar Acciones de Agente" : "Execute Agent Actions" },
      { key: "edit_agents", label: language === "es" ? "Configurar/Crear Agentes" : "Configure/Create Agents" },
      { key: "edit_skills", label: language === "es" ? "Crear/Editar Habilidades" : "Create/Edit Skills" },
      { key: "manage_mcp", label: language === "es" ? "Gestionar Servidores MCP" : "Manage MCP Servers" },
      { key: "bypass_confirmation", label: language === "es" ? "Evitar Confirmación Manual" : "Bypass Manual Confirmation" }
    ]
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      
      {/* Sub tabs header selection */}
      <div className="tabs-header" style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.25rem" }}>
        <button
          onClick={() => setActiveSubTab("directory")}
          className={`tab-btn ${activeSubTab === "directory" ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Users size={15} />
          {language === "es" ? "Directorio" : "Directory"}
        </button>
        <button
          onClick={() => setActiveSubTab("policies")}
          className={`tab-btn ${activeSubTab === "policies" ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Shield size={15} />
          {language === "es" ? "Permisos" : "Permissions Matrix"}
        </button>
        <button
          onClick={() => setActiveSubTab("map")}
          className={`tab-btn ${activeSubTab === "map" ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Network size={15} />
          {language === "es" ? "Mapa de Accesos" : "Access Mapping"}
        </button>
        <button
          onClick={() => setActiveSubTab("logs")}
          className={`tab-btn ${activeSubTab === "logs" ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FileText size={15} />
          {language === "es" ? "Auditoría de Accesos" : "Access Audit Logs"}
        </button>
        <button
          onClick={() => setActiveSubTab("ai-setup")}
          className={`tab-btn ${activeSubTab === "ai-setup" ? "active" : ""}`}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Sparkles size={15} style={{ color: "var(--color-primary)" }} />
          {language === "es" ? "Configuración IA" : "AI Guided Setup"}
        </button>
        </div>

        {activeSubTab === "directory" && (
          <button onClick={() => setDrawerOpen(true)} className="btn btn-primary" style={{ gap: "0.5rem", flexShrink: 0 }}>
            <UserPlus size={16} />
            {language === "es" ? "Crear Usuario" : "Add User"}
          </button>
        )}
      </div>

      {/* Tab content area */}
      <div className="tab-content">
        
        {/* DIRECTORY TAB */}
        {activeSubTab === "directory" && (
          <div className="glass-panel animate-fade-in" style={{ padding: "1.25rem", overflow: "hidden" }}>
            <div className="table-container" style={{ border: "none" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>{language === "es" ? "Usuario" : "User"}</th>
                    <th>{language === "es" ? "Username" : "Username"}</th>
                    <th>{language === "es" ? "Email" : "Email"}</th>
                    <th>{language === "es" ? "Rol Asignado" : "Assigned Role"}</th>
                    <th>{language === "es" ? "Último Acceso" : "Last Login"}</th>
                    <th>{language === "es" ? "Estado" : "Status"}</th>
                    <th>{language === "es" ? "Acciones" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ opacity: u.status === "inactive" ? 0.6 : 1 }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            className="user-avatar flex-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              background: u.id === currentUser.id ? "var(--color-primary-glow)" : "var(--bg-surface-hover)",
                              border: u.id === currentUser.id ? "1.5px solid var(--color-primary)" : "1px solid var(--border-color)",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              color: "var(--text-primary)"
                            }}
                          >
                            {u.avatar}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)", display: "block" }}>{u.name}</span>
                            {u.id === currentUser.id && (
                              <span style={{ fontSize: "0.7rem", color: "var(--color-success)", fontWeight: 600 }}>
                                ({language === "es" ? "Sesión Activa" : "Active Session"})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.id === currentUser.id ? (
                          <span className="badge badge-info" style={{ textTransform: "capitalize" }}>{u.role}</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            style={{
                              padding: "0.3rem 0.5rem",
                              background: "var(--bg-base)",
                              fontSize: "0.85rem",
                              width: "auto",
                              display: "inline-block"
                            }}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Accountant">{language === "es" ? "Contador" : "Accountant"}</option>
                            <option value="Billing Operator">{language === "es" ? "Facturación" : "Billing Operator"}</option>
                            <option value="Auditor">Auditor</option>
                            <option value="Guest">{language === "es" ? "Invitado" : "Guest"}</option>
                          </select>
                        )}
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{u.lastLogin}</td>
                      <td>
                        <span className={`badge ${u.status === "active" ? "badge-success" : "badge-warning"}`}>
                          {u.status === "active" ? (language === "es" ? "Activo" : "Active") : (language === "es" ? "Inactivo" : "Inactive")}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="btn btn-secondary"
                          style={{
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.8rem",
                            borderColor: u.status === "active" ? "var(--color-danger)" : "var(--color-success)",
                            color: u.status === "active" ? "var(--color-danger)" : "var(--color-success)",
                            background: "transparent"
                          }}
                          disabled={u.id === currentUser.id}
                        >
                          {u.status === "active"
                            ? (language === "es" ? "Desactivar" : "Suspend")
                            : (language === "es" ? "Activar" : "Activate")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PERMISSIONS MATRIX TAB — organized by PERMISSION_CATEGORIES */}
        {activeSubTab === "policies" && (() => {
          const ROLES = [
            { key: "Admin",            label: "Admin" },
            { key: "Accountant",       label: language === "es" ? "Contador" : "Accountant" },
            { key: "Billing Operator", label: language === "es" ? "Facturación" : "Billing" },
            { key: "Auditor",          label: "Auditor" },
            { key: "Guest",            label: language === "es" ? "Invitado" : "Guest" }
          ];

          // Bridge: PERMISSION_CATEGORIES uses short keys, but PermissionPolicy.actions uses longer ones.
          // data_sources ("read"/"write") are not in actions at all — they're in rolesMetadata directly.
          const ACTIONS_KEY_MAP: Record<string, string> = {
            // agents category
            "execute": "execute_agents",
            "edit":    "edit_agents",
            "bypass":  "bypass_confirmation",
            // mcp category
            "manage":  "manage_mcp",
          };

          const isChecked = (roleKey: string, catKey: string, permKey: string): boolean => {
            const policy = permissionPolicy[roleKey];
            if (!policy) return false;
            if (catKey === "modules") return policy.views.includes(permKey);
            // data_sources: check rolesMetadata directly
            if (catKey === "data_sources") {
              const roleMeta = rolesMetadata.find(r => r.key === roleKey);
              return roleMeta ? roleMeta.permissions.data_sources.includes(permKey) : false;
            }
            // agents / mcp / skills: map to actual action key
            const actionKey = ACTIONS_KEY_MAP[permKey] ?? permKey;
            return !!(policy.actions as any)[actionKey];
          };

          const handleToggle = (roleKey: string, catKey: string, permKey: string) => {
            if (roleKey === "Admin") return;
            if (catKey === "modules") {
              togglePermission(roleKey, "views", permKey);
              return;
            }
            // data_sources: toggle directly in rolesMetadata
            if (catKey === "data_sources") {
              setRolesMetadata(prev => prev.map(r => {
                if (r.key !== roleKey) return r;
                const has = r.permissions.data_sources.includes(permKey);
                return {
                  ...r,
                  permissions: {
                    ...r.permissions,
                    data_sources: has
                      ? r.permissions.data_sources.filter(k => k !== permKey)
                      : [...r.permissions.data_sources, permKey]
                  }
                };
              }));
              logSecurityAction("Access Policy Updated", "Authorization Matrix", "success",
                `Modified data access '${permKey}' for role ${roleKey}.`);
              return;
            }
            // agents / mcp / skills: map to actual action key then toggle
            const actionKey = ACTIONS_KEY_MAP[permKey] ?? permKey;
            togglePermission(roleKey, "actions", actionKey);
          };

          // Icons per category
          const catIcon: Record<string, React.ReactNode> = {
            modules:      <Unlock size={14} style={{ color: "var(--color-primary)" }} />,
            agents:       <ShieldAlert size={14} style={{ color: "var(--color-warning)" }} />,
            skills:       <SlidersHorizontal size={14} style={{ color: "#8b5cf6" }} />,
            mcp:          <Server size={14} style={{ color: "#06b6d4" }} />,
            data_sources: <Database size={14} style={{ color: "var(--color-success)" }} />
          };

          return (
            <div className="glass-panel animate-fade-in" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-color)" }}>
                <ShieldCheck size={20} style={{ color: "var(--color-success)" }} />
                <div>
                  <strong style={{ display: "block" }}>{language === "es" ? "Configuración de Permisos por Rol" : "Role Permissions Configuration"}</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {language === "es"
                      ? "Los cambios se aplican en tiempo real. La columna Admin es de solo lectura."
                      : "Changes apply instantly. Admin column is read-only."}
                  </span>
                </div>
              </div>

              {/* One table per category */}
              {PERMISSION_CATEGORIES.map(cat => (
                <div key={cat.key}>
                  {/* Category header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    marginBottom: "0.75rem"
                  }}>
                    {catIcon[cat.key]}
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      {language === "es" ? cat.labelEs : cat.labelEn}
                    </span>
                    <span style={{
                      marginLeft: "0.4rem",
                      fontSize: "0.7rem",
                      background: "var(--bg-surface-hover)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "10px",
                      padding: "0.1rem 0.5rem",
                      color: "var(--text-muted)",
                      fontWeight: 600
                    }}>
                      {cat.permissions.length} {language === "es" ? "permisos" : "permissions"}
                    </span>
                  </div>

                  {/* Table */}
                  <div className="table-container">
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "38%", fontSize: "0.78rem" }}>
                            {language === "es" ? "Permiso" : "Permission"}
                          </th>
                          {ROLES.map(r => (
                            <th key={r.key} style={{ textAlign: "center", fontSize: "0.78rem" }}>
                              {r.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cat.permissions.map(perm => (
                          <tr key={perm.key}>
                            <td style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500 }}>
                              {language === "es" ? perm.labelEs : perm.labelEn}
                            </td>
                            {ROLES.map(r => {
                              const checked = isChecked(r.key, cat.key, perm.key);
                              const locked  = r.key === "Admin";
                              return (
                                <td key={r.key} style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={locked}
                                    onChange={() => handleToggle(r.key, cat.key, perm.key)}
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      cursor: locked ? "not-allowed" : "pointer",
                                      accentColor: "var(--color-primary)",
                                      opacity: locked ? 0.5 : 1
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

            </div>
          );
        })()}

        {/* TRUST MAP GRAPH TAB */}
        {activeSubTab === "map" && (
          <div className="glass-panel animate-fade-in" style={{ padding: "1.5rem" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-color)" }}>
              <div>
                <strong>{language === "es" ? "Visualizador de Flujo de Accesos" : "Visual Access Mapping"}</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "es"
                    ? "Seleccioná un usuario para visualizar su flujo de accesos a agentes, habilidades y servidores MCP"
                    : "Select a user to visually trace their permitted access flow to AI agents, skills, and backend resources"}
                </p>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{language === "es" ? "Trazar Usuario:" : "Trace User:"}</span>
                <select
                  value={selectedMapUser}
                  onChange={(e) => setSelectedMapUser(e.target.value)}
                  style={{ width: "180px", padding: "0.4rem 0.6rem" }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive access visual map */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1.25fr auto 1fr", gap: "1rem", alignItems: "stretch", minHeight: "260px" }}>
              
              {/* Col 1: Selected User */}
              <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "var(--bg-surface-solid)", borderStyle: "dashed" }}>
                <div
                  className="flex-center"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--color-primary-glow)",
                    border: "2px solid var(--color-primary)",
                    color: "var(--text-primary)",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    marginBottom: "0.75rem"
                  }}
                >
                  {activeMapUserObj.avatar}
                </div>
                <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1rem", textAlign: "center" }}>{activeMapUserObj.name}</h4>
                <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", margin: "0 0 0.5rem 0" }}>@{activeMapUserObj.username}</p>
                <span className="badge badge-info" style={{ textTransform: "uppercase" }}>{activeMapUserObj.role}</span>
              </div>

              {/* Arrow 1 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <ArrowRight size={20} className="animate-pulse" />
              </div>

              {/* Col 2: Permitted Capabilities (Allowed views & actions) */}
              <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.25rem" }}>
                  {language === "es" ? "Acceso Autorizado" : "Authorized Clearance"}
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", maxHeight: "180px", overflowY: "auto", paddingRight: "0.2rem" }}>
                  {permissionCategories.views
                    .filter(v => permissionPolicy[activeMapUserObj.role]?.views.includes(v.key))
                    .map(v => (
                      <span key={v.key} style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", borderRadius: "4px", padding: "0.2rem 0.4rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Check size={10} style={{ color: "var(--color-success)" }} />
                        {v.label}
                      </span>
                    ))
                  }
                  {permissionCategories.actions
                    .filter(a => !!(permissionPolicy[activeMapUserObj.role]?.actions as any)[a.key])
                    .map(a => (
                      <span key={a.key} style={{ fontSize: "0.72rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "4px", padding: "0.2rem 0.4rem", color: "var(--color-success)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <ShieldCheck size={10} />
                        {a.label}
                      </span>
                    ))
                  }
                  {/* Lockouts */}
                  {permissionCategories.views
                    .filter(v => !permissionPolicy[activeMapUserObj.role]?.views.includes(v.key))
                    .map(v => (
                      <span key={v.key} style={{ fontSize: "0.72rem", background: "transparent", border: "1px dashed var(--border-color)", borderRadius: "4px", padding: "0.2rem 0.4rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem", opacity: 0.5 }}>
                        <Lock size={10} />
                        {v.label}
                      </span>
                    ))
                  }
                </div>
              </div>

              {/* Arrow 2 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <ArrowRight size={20} className="animate-pulse" />
              </div>

              {/* Col 3: Permitted Agents & MCPS */}
              <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center", background: "var(--bg-surface-solid)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.25rem" }}>
                  {language === "es" ? "Agentes y Herramientas" : "AI Agent & Tools Link"}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {/* Reconciliation Agent */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.6rem", borderRadius: "6px",
                    background: permissionPolicy[activeMapUserObj.role]?.views.includes("reconciliation") ? "rgba(255,255,255,0.03)" : "transparent",
                    border: "1px solid var(--border-color)",
                    opacity: permissionPolicy[activeMapUserObj.role]?.views.includes("reconciliation") ? 1 : 0.4
                  }}>
                    <Sparkles size={12} style={{ color: "var(--color-primary)" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>Agente Conciliación</span>
                    {permissionPolicy[activeMapUserObj.role]?.views.includes("reconciliation") ? (
                      <span className="badge badge-success" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto" }}>OK</span>
                    ) : (
                      <span className="badge" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto", background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>LOCK</span>
                    )}
                  </div>

                  {/* Inventory Assistant */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.6rem", borderRadius: "6px",
                    background: permissionPolicy[activeMapUserObj.role]?.views.includes("connections") ? "rgba(255,255,255,0.03)" : "transparent",
                    border: "1px solid var(--border-color)",
                    opacity: permissionPolicy[activeMapUserObj.role]?.views.includes("connections") ? 1 : 0.4
                  }}>
                    <Database size={12} style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>Copiloto Inventario</span>
                    {permissionPolicy[activeMapUserObj.role]?.views.includes("connections") ? (
                      <span className="badge badge-success" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto" }}>OK</span>
                    ) : (
                      <span className="badge" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto", background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>LOCK</span>
                    )}
                  </div>

                  {/* SQLite Database Server tools */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.6rem", borderRadius: "6px",
                    background: permissionPolicy[activeMapUserObj.role]?.views.includes("mcpServers") ? "rgba(255,255,255,0.03)" : "transparent",
                    border: "1px solid var(--border-color)",
                    opacity: permissionPolicy[activeMapUserObj.role]?.views.includes("mcpServers") ? 1 : 0.4
                  }}>
                    <Server size={12} style={{ color: "var(--color-success)" }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>SQLite DB Server tools</span>
                    {permissionPolicy[activeMapUserObj.role]?.views.includes("mcpServers") ? (
                      <span className="badge badge-success" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto" }}>OK</span>
                    ) : (
                      <span className="badge" style={{ fontSize: "0.55rem", padding: "0 0.25rem", marginLeft: "auto", background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>LOCK</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ACCESS AUDIT LOGS TAB */}
        {activeSubTab === "logs" && (
          <div className="glass-panel animate-fade-in" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder={language === "es" ? "Buscar en bitácora..." : "Search logs..."}
                  style={{ width: "100%", padding: "0.4rem 0.6rem 0.4rem 2rem", fontSize: "0.82rem" }}
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["all", "success", "warning", "blocked"].map(f => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f as any)}
                    className="btn btn-secondary"
                    style={{
                      padding: "0.3rem 0.6rem",
                      fontSize: "0.75rem",
                      background: logFilter === f ? "var(--bg-surface-solid)" : "transparent",
                      border: logFilter === f ? "1px solid var(--border-color-glow)" : "1px solid var(--border-color)",
                      color: logFilter === f ? "var(--text-primary)" : "var(--text-secondary)"
                    }}
                  >
                    {f === "all" && (language === "es" ? "Todos" : "All")}
                    {f === "success" && (language === "es" ? "Éxito" : "Success")}
                    {f === "warning" && (language === "es" ? "Advertencias" : "Warnings")}
                    {f === "blocked" && (language === "es" ? "Bloqueos" : "Blocked")}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>{language === "es" ? "Hora" : "Timestamp"}</th>
                    <th style={{ width: "22%" }}>{language === "es" ? "Usuario / Rol" : "User / Clearance"}</th>
                    <th style={{ width: "20%" }}>{language === "es" ? "Acción" : "Action Event"}</th>
                    <th style={{ width: "18%" }}>{language === "es" ? "Módulo" : "Resource Domain"}</th>
                    <th style={{ width: "10%" }}>{language === "es" ? "Estado" : "Outcome"}</th>
                    <th style={{ width: "15%" }}>{language === "es" ? "Detalle" : "Details"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        {language === "es" ? "No se encontraron logs de seguridad." : "No matching security logs found."}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{log.timestamp}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                              className="user-avatar flex-center"
                              style={{ width: "22px", height: "22px", fontSize: "0.65rem", background: "var(--bg-surface-hover)" }}
                            >
                              {log.user.avatar}
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{log.user.name}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>({log.user.role})</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{log.action}</td>
                        <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{log.resource}</td>
                        <td>
                          {log.status === "success" && (
                            <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>SUCCESS</span>
                          )}
                          {log.status === "warning" && (
                            <span className="badge badge-warning" style={{ fontSize: "0.65rem" }}>WARNING</span>
                          )}
                          {log.status === "blocked" && (
                            <span
                              className="badge"
                              style={{
                                fontSize: "0.65rem",
                                background: "rgba(239,68,68,0.12)",
                                color: "#ef4444",
                                border: "1px solid rgba(239,68,68,0.2)"
                              }}
                            >
                              BLOCKED
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {activeSubTab === "ai-setup" && (
          <div className="glass-panel animate-fade-in" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "var(--color-primary)" }} />
              <div>
                <strong style={{ display: "block" }}>
                  {language === "es" ? "Configuración Guiada por IA (Sintetizador RBAC)" : "AI Guided Setup (RBAC Synthesizer)"}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {language === "es" 
                    ? "Genera, modifica o revoca roles y permisos empresariales a través de comandos en lenguaje natural." 
                    : "Generate, edit, or revoke enterprise security clearances using natural language instructions."}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.5rem" }}>
              {/* Left Column: Command input and suggestions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    {language === "es" ? "Instrucción de Política IA" : "AI Policy Command"}
                  </label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={language === "es" 
                      ? "ej. 'Hacer que Accountant pueda editar agentes y evitar confirmaciones' o 'Crear un rol Auditor con acceso a conciliacion y alertas fiscales'" 
                      : "e.g. 'Make Accountant able to edit agents and bypass confirmations' or 'Create a new Auditor role with access to reconciliation and taxAlerts'"}
                    style={{ 
                      width: "100%", 
                      padding: "0.6rem 0.8rem", 
                      background: "var(--bg-surface-solid)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px", 
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      resize: "none"
                    }}
                  />
                </div>

                <button
                  onClick={() => runAiSetup(aiPrompt)}
                  disabled={aiRunning || !aiPrompt.trim()}
                  className="btn btn-primary"
                  style={{ gap: "0.5rem", height: "38px", alignSelf: "flex-start", padding: "0 1.25rem" }}
                >
                  <Sparkles size={15} />
                  {aiRunning 
                    ? (language === "es" ? "Sintetizando..." : "Synthesizing...") 
                    : (language === "es" ? "Compilar y Aplicar" : "Compile & Apply Policy")}
                </button>

                {/* Command suggestions */}
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                    {language === "es" ? "Comandos sugeridos:" : "Suggested commands:"}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[
                      language === "es" 
                        ? "Hacer que Contador pueda editar agentes y evitar confirmaciones" 
                        : "Make Accountant able to edit agents and bypass confirmations",
                      language === "es" 
                        ? "Quitar todos los accesos al perfil de Invitado" 
                        : "Revoke all access from Guest profile",
                      language === "es" 
                        ? "Crear rol Auditor Externo con acceso a conciliacion y marketplace" 
                        : "Create External Auditor role with access to reconciliation and marketplace"
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAiPrompt(sug)}
                        style={{
                          textAlign: "left",
                          fontSize: "0.75rem",
                          background: "var(--bg-surface-hover)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          padding: "0.4rem 0.6rem",
                          cursor: "pointer",
                          color: "var(--text-primary)",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--border-color-glow)"}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Terminal Compiler Output */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {language === "es" ? "Consola de Compilación de Seguridad" : "Security Compiler Console"}
                </span>
                
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "1rem",
                    height: "260px",
                    overflowY: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "#34d399",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)"
                  }}
                >
                  {aiOutput.length === 0 ? (
                    <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                      {language === "es" 
                        ? "// Esperando instrucción de política..." 
                        : "// Awaiting policy instruction..."}
                    </span>
                  ) : (
                    aiOutput.map((log, idx) => (
                      <div key={idx} style={{ 
                        lineHeight: 1.4,
                        borderLeft: log.includes("Done!") || log.includes("successfully") ? "2.5px solid #10b981" : "none",
                        paddingLeft: log.includes("Done!") || log.includes("successfully") ? "0.5rem" : 0
                      }}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Slide-out drawer/modal for Adding User */}
      {drawerOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex",
          justifyContent: "flex-end"
        }}>
          {/* Backdrop closer */}
          <div onClick={() => setDrawerOpen(false)} style={{ flex: 1 }} />

          {/* Drawer container */}
          <div className="glass-panel animate-fade-in" style={{
            width: "420px", height: "100vh", borderRadius: 0, borderLeft: "1px solid var(--border-color)",
            background: "var(--bg-surface-solid)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                {language === "es" ? "Registrar Nuevo Usuario" : "Add New User Account"}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn btn-secondary flex-center"
                style={{ padding: "0.4rem", borderRadius: "50%", width: "28px", height: "28px", background: "transparent" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {language === "es" ? "Nombre Completo" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sofía Martínez"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {language === "es" ? "Nombre de Usuario" : "Username"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sofia_m"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {language === "es" ? "Correo Electrónico" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="sofia@company.com"
                  style={{
                    width: "100%", padding: "0.6rem 0.8rem", background: "var(--bg-surface-solid)",
                    border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)"
                  }}
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  {language === "es" ? "Rol Operativo" : "Security Clearance Role"}
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Accountant">{language === "es" ? "Contador (Accountant)" : "Accountant"}</option>
                  <option value="Billing Operator">{language === "es" ? "Facturación (Billing Operator)" : "Billing Operator"}</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Guest">{language === "es" ? "Invitado (Guest)" : "Guest"}</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {language === "es" ? "Registrar" : "Add Account"}
                </button>
                <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  {language === "es" ? "Cancelar" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
