import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import {
  Plus,
  SlidersHorizontal,
  XCircle,
  X,
  CheckCircle2,
  Link as LinkIcon,
  Lock,
  RefreshCw,
  Zap,
  Code,
  Settings,
  Trash2,
  Sparkles,
  Server,
  Database,
  FileCode,
  Globe,
  ArrowRight,
  UserCheck
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  type: "read" | "action";
  status: "active";
  method?: string;
  endpoint?: string;
  parameters?: any[];
  provider?: "custom_api" | "mcp_tool" | "datasource_op" | "native_util" | "compute_sandbox";
  providerLabel?: string; // E.g. "SQLite Server", "PostgreSQL Connection"
  linkedId?: string;
}

export const SkillsTab: React.FC = () => {
  const {
    language,
    skills,
    setSkills,
    advancedMode,
    setAdvancedMode,
    mcpServers,
    mockConnections,
    agents,
    copyToClipboard,
    setHeaderAction,
    hasPermission,
    logSecurityAction
  } = useDashboard();

  // Wizard Steps:
  // 1 = Select Provider Category
  // 2 = Configure Specific Fields
  // 3 = Success Screen
  // 4 = Detail Drawer
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSaving, setWizardSaving] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Skill Builder state
  const [selectedCategory, setSelectedCategory] = useState<"custom_api" | "mcp_tool" | "datasource_op" | "native_util" | "compute_sandbox" | " font-mono" | "">("");
  
  // Category-specific states
  const [skillFormName, setSkillFormName] = useState("");
  const [skillFormDesc, setSkillFormDesc] = useState("");
  
  // Custom API states
  const [apiMethod, setApiMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("POST");
  const [apiUrl, setApiUrl] = useState("");
  const [apiParamsJson, setApiParamsJson] = useState(`{\n  "id": "string"\n}`);

  // Ingested MCP tool states
  const [selectedMcpServerId, setSelectedMcpServerId] = useState("");
  const [selectedMcpToolName, setSelectedMcpToolName] = useState("");

  // Data Source Operation states
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [dsOpType, setDsOpType] = useState<"sql_query" | "record_mutation">("sql_query");
  const [dsSqlQuery, setDsSqlQuery] = useState("SELECT * FROM table WHERE id = :id");

  // Platform Native states
  const [nativeType, setNativeType] = useState<"slack" | "approval" | "handoff">("slack");
  const [slackChannel, setSlackChannel] = useState("#general");
  const [approvalMessage, setApprovalMessage] = useState("Requesting confirmation...");
  const [handoffAgentId, setHandoffAgentId] = useState("");

  // Compute states
  const [computeLang, setComputeLang] = useState<"js" | "python">("js");
  const [computeCode, setComputeCode] = useState(`// Transform input data\nexport function run(input) {\n  return {\n    result: input.value * 1.1\n  };\n}`);

  const t = (key: string) => {
    const dictionary: Record<string, Record<string, string>> = {
      en: {
        skillsTitle: "Skills Marketplace",
        skillsDesc: "Equip your AI Agents with specialized capabilities. Choose from custom API gateways, connected MCP endpoints, native task handlers, or sandboxed execution engines.",
        newSkillBtn: "New Skill",
        noSkills: "No skills configured yet. Add a skill to give your AI agents execution capabilities.",
        customApi: "Custom API Call",
        customApiDesc: "Trigger HTTP/REST webhook endpoints.",
        mcpTool: "MCP Server Tool",
        mcpToolDesc: "Import capabilities from ingested MCP servers.",
        dataSource: "Data Connection Query",
        dataSourceDesc: "Run operations on connected business databases.",
        native: "Platform Native Utility",
        nativeDesc: "Slack alerts, approvals, and subagent handoffs.",
        compute: "Compute / Sandbox",
        computeDesc: "Execute Javascript or Python code scripts.",
        successTitle: "Skill Created Successfully",
        successDesc: "Your new skill is active and can be bound to any AI agent profile.",
        detailsTitle: "Skill Configuration Profile",
        categoryTitle: "Select Skill Category Provider",
        categoryDesc: "Expose different data operations or compute utilities as reusable Agent skills.",
        configTitle: "Configure Skill Parameters",
        configDesc: "Fill in the specific properties required to invoke this capability.",
        deleteSkill: "Delete Skill Profile",
        editSkill: "Edit Configuration",
        linkedProvider: "BOUND INTEGRATION",
        parameters: "INPUT PARAMETERS (JSON SCHEMA)",
        apiMethodLabel: "HTTP Method",
        apiUrlLabel: "Endpoint Gateway URL",
        mcpServerSelect: "Select Connected MCP Server",
        mcpToolSelect: "Select Exposed Protocol Tool",
        dsSelect: "Select Target Connected Data Source",
        dsOpTypeLabel: "Database Operation Type",
        dsSqlQueryLabel: "Parameterized SQL or Mutation Script",
        nativeTypeLabel: "Native Activity Task Type",
        slackChanLabel: "Slack Target Channel",
        approvalMsgLabel: "Human Approval Message Prompt",
        handoffAgentLabel: "Target Delegation Agent",
        computeLangLabel: "Sandbox Runtime Environment",
        computeCodeLabel: "Script Execution Code Block"
      },
      es: {
        skillsTitle: "Mercado de Habilidades",
        skillsDesc: "Equipá a tus agentes con capacidades especializadas. Elegí entre llamadas a APIs personalizadas, endpoints MCP conectados, operaciones nativas o motores de ejecución aislados.",
        newSkillBtn: "Nueva Habilidad",
        noSkills: "No hay habilidades configuradas aún. Añade una para dar capacidad de ejecución a tus agentes.",
        customApi: "Llamada a API Personalizada",
        customApiDesc: "Dispará endpoints de webhooks HTTP/REST.",
        mcpTool: "Herramienta de Servidor MCP",
        mcpToolDesc: "Importá capacidades desde tus servidores MCP conectados.",
        dataSource: "Consulta de Fuente de Datos",
        dataSourceDesc: "Corré operaciones en bases de datos comerciales activas.",
        native: "Utilidad Nativa del Sistema",
        nativeDesc: "Alertas de Slack, aprobaciones y relevos de agentes.",
        compute: "Cómputo / Sandbox",
        computeDesc: "Ejecutá scripts de código en Javascript o Python.",
        successTitle: "Habilidad Creada con Éxito",
        successDesc: "Tu nueva habilidad ya está activa y puede vincularse al perfil de cualquier Agente.",
        detailsTitle: "Perfil de Configuración de Habilidad",
        categoryTitle: "Seleccionar Categoría de Habilidad",
        categoryDesc: "Exponé diferentes operaciones de datos o utilidades de cómputo como habilidades reutilizables.",
        configTitle: "Configurar Parámetros de Habilidad",
        configDesc: "Completá los campos específicos requeridos para invocar esta capacidad.",
        deleteSkill: "Eliminar Perfil de Habilidad",
        editSkill: "Editar Configuración",
        linkedProvider: "INTEGRACIÓN VINCULADA",
        parameters: "PARÁMETROS DE ENTRADA (JSON SCHEMA)",
        apiMethodLabel: "Método HTTP",
        apiUrlLabel: "URL del Endpoint del API",
        mcpServerSelect: "Seleccionar Servidor MCP Conectado",
        mcpToolSelect: "Seleccionar Herramienta de Protocolo Expuesta",
        dsSelect: "Seleccionar Fuente de Datos Conectada",
        dsOpTypeLabel: "Tipo de Operación de Base de Datos",
        dsSqlQueryLabel: "Consulta SQL Parametrizada o Script",
        nativeTypeLabel: "Tipo de Tarea de Actividad Nativa",
        slackChanLabel: "Canal de Slack Destino",
        approvalMsgLabel: "Mensaje de Solicitud de Aprobación Humana",
        handoffAgentLabel: "Agente de Delegación Destino",
        computeLangLabel: "Entorno de Ejecución Sandbox",
        computeCodeLabel: "Bloque de Código de Ejecución del Script"
      }
    };
    const lang = language === "es" ? "es" : "en";
    return dictionary[lang][key] !== undefined ? dictionary[lang][key] : key;
  };

  const openNewSkillWizard = React.useCallback(() => {
    const canConfigureAny = 
      hasPermission("skills_custom_api") ||
      hasPermission("skills_mcp_tool") ||
      hasPermission("skills_datasource_op") ||
      hasPermission("skills_native_util") ||
      hasPermission("skills_compute_sandbox");

    if (!canConfigureAny) {
      logSecurityAction(
        "Skill Configuration Blocked",
        "Skills Management module",
        "blocked",
        "Attempted to trigger skill builder wizard without any skill category authorization."
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con permisos para crear ninguna categoría de habilidad." 
        : "Action denied: Your current role lacks permissions to create any category of skills.");
      return;
    }

    // Reset wizard states
    setSelectedCategory("");
    setSkillFormName("");
    setSkillFormDesc("");
    setApiMethod("POST");
    setApiUrl("");
    setApiParamsJson(`{\n  "id": "string"\n}`);
    setSelectedMcpServerId("");
    setSelectedMcpToolName("");
    setSelectedConnectionId("");
    setDsOpType("sql_query");
    setDsSqlQuery("SELECT * FROM table WHERE id = :id");
    setNativeType("slack");
    setSlackChannel("#general");
    setApprovalMessage("Requesting confirmation...");
    setHandoffAgentId("");
    setComputeLang("js");
    setComputeCode(`// Transform input data\nexport function run(input) {\n  return {\n    result: input.value * 1.1\n  };\n}`);
    
    setWizardStep(1);
    setSelectedSkill(null);
    setSkillFormOpen(true);
  }, [hasPermission, logSecurityAction, language]);

  React.useEffect(() => {
    setHeaderAction(
      <button className="btn btn-primary" onClick={openNewSkillWizard} style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
        <Plus size={16} />
        {t("newSkillBtn")}
      </button>
    );
    return () => setHeaderAction(null);
  }, [language, setHeaderAction, openNewSkillWizard]);

  const handleSelectCategory = (cat: "custom_api" | "mcp_tool" | "datasource_op" | "native_util" | "compute_sandbox") => {
    setSelectedCategory(cat);
    
    // Set default name and descriptions
    if (cat === "custom_api") {
      setSkillFormName("Webhook API Call");
      setSkillFormDesc("Triggers an external REST API endpoint.");
    } else if (cat === "mcp_tool") {
      // Pick first server if available
      if (mcpServers.length > 0) {
        setSelectedMcpServerId(mcpServers[0].id);
        if (mcpServers[0].tools.length > 0) {
          setSelectedMcpToolName(mcpServers[0].tools[0].name);
          setSkillFormName(`${mcpServers[0].name}: ${mcpServers[0].tools[0].name}`);
          setSkillFormDesc(mcpServers[0].tools[0].desc);
        }
      }
    } else if (cat === "datasource_op") {
      if (mockConnections.length > 0) {
        setSelectedConnectionId(mockConnections[0].id);
        setSkillFormName(`${mockConnections[0].name} Query`);
        setSkillFormDesc(`Executes custom query on ${mockConnections[0].name} data source.`);
      }
    } else if (cat === "native_util") {
      setSkillFormName("Post Slack Alert");
      setSkillFormDesc("Pushes message alerts dynamically to slack channel.");
    } else if (cat === "compute_sandbox") {
      setSkillFormName("Transform Input Data");
      setSkillFormDesc("Runs isolated javascript math/format transformations.");
    }
    
    setWizardStep(2);
  };

  // Helper when changing server dropdown in MCP configuration
  const handleMcpServerChange = (srvId: string) => {
    setSelectedMcpServerId(srvId);
    const srv = mcpServers.find(s => s.id === srvId);
    if (srv && srv.tools.length > 0) {
      setSelectedMcpToolName(srv.tools[0].name);
      setSkillFormName(`${srv.name}: ${srv.tools[0].name}`);
      setSkillFormDesc(srv.tools[0].desc);
    }
  };

  // Helper when changing tool dropdown in MCP configuration
  const handleMcpToolChange = (toolName: string) => {
    setSelectedMcpToolName(toolName);
    const srv = mcpServers.find(s => s.id === selectedMcpServerId);
    if (srv) {
      const tool = srv.tools.find((t: any) => t.name === toolName);
      if (tool) {
        setSkillFormName(`${srv.name}: ${tool.name}`);
        setSkillFormDesc(tool.desc);
      }
    }
  };

  // Helper when changing native task type
  const handleNativeTypeChange = (type: "slack" | "approval" | "handoff") => {
    setNativeType(type);
    if (type === "slack") {
      setSkillFormName("Post Slack Alert");
      setSkillFormDesc("Pushes message alerts dynamically to Slack channel.");
    } else if (type === "approval") {
      setSkillFormName("Request Approval Check");
      setSkillFormDesc("Pauses execution to ask human verification before writing changes.");
    } else if (type === "handoff") {
      setSkillFormName("Handoff to Agent");
      setSkillFormDesc("Delegates subagent tasks dynamically in runtime.");
    }
  };

  // Form Submission
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillFormName) return;

    let finalParams: any[] = [];
    let providerLabel = "";
    let linkedId = "";

    try {
      if (selectedCategory === "custom_api") {
        const parsedObj = JSON.parse(apiParamsJson);
        finalParams = Object.entries(parsedObj).map(([k, v]) => ({ name: k, type: String(v) }));
        providerLabel = "REST API";
      } else if (selectedCategory === "mcp_tool") {
        const srv = mcpServers.find(s => s.id === selectedMcpServerId);
        if (srv) {
          providerLabel = `MCP: ${srv.name}`;
          linkedId = srv.id;
          finalParams = [{ name: "query", type: "string" }];
        }
      } else if (selectedCategory === "datasource_op") {
        const conn = mockConnections.find(c => c.id === selectedConnectionId);
        if (conn) {
          providerLabel = `Data Connection: ${conn.name}`;
          linkedId = conn.id;
          finalParams = [{ name: "id", type: "string" }];
        }
      } else if (selectedCategory === "native_util") {
        providerLabel = `System Native: ${nativeType.toUpperCase()}`;
        if (nativeType === "slack") {
          finalParams = [{ name: "message", type: "string" }];
        } else if (nativeType === "approval") {
          finalParams = [{ name: "action", type: "string" }];
        } else if (nativeType === "handoff") {
          finalParams = [{ name: "input_context", type: "string" }];
        }
      } else if (selectedCategory === "compute_sandbox") {
        providerLabel = `Compute: ${computeLang.toUpperCase()} Sandbox`;
        finalParams = [{ name: "input", type: "object" }];
      }
    } catch (err) {
      alert(language === "es" ? "Parámetros JSON inválidos" : "Invalid parameters JSON schema");
      return;
    }

    setWizardSaving(true);
    setTimeout(() => {
      setWizardSaving(false);
      const newSkillId = `skill-${Date.now()}`;
      setSkills(prev => [
        ...prev,
        {
          id: newSkillId,
          name: skillFormName,
          description: skillFormDesc,
          type: selectedCategory === "custom_api" && apiMethod === "GET" ? "read" : "action",
          status: "active",
          method: selectedCategory === "custom_api" ? apiMethod : undefined,
          endpoint: selectedCategory === "custom_api" ? apiUrl : undefined,
          parameters: finalParams,
          provider: selectedCategory,
          providerLabel,
          linkedId
        }
      ]);
      logSecurityAction(
        "Skill Created",
        `Skill: ${newSkillId}`,
        "success",
        `Created new skill capability: "${skillFormName}".`
      );
      setWizardStep(3); // Success step
    }, 1000);
  };

  const openSkillDetails = (skill: Skill) => {
    setSelectedSkill(skill);
    setWizardStep(4); // View details step
    setSkillFormOpen(true);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "2rem" }}>
        {/* Active Skills Grid */}
        {skills.length > 0 ? (
          <div className="marketplace-grid">
            {skills.map(skill => {
              // Custom colors based on categories
              let iconColor = "var(--color-primary)";
              const categoryLabel = skill.providerLabel || "REST API";
              
              if (skill.provider === "mcp_tool") {
                iconColor = "var(--color-primary)";
              } else if (skill.provider === "datasource_op") {
                iconColor = "var(--color-success)";
              } else if (skill.provider === "native_util") {
                iconColor = "var(--color-warning)";
              } else if (skill.provider === "compute_sandbox") {
                iconColor = "var(--color-info)";
              }

              return (
                <div
                  key={skill.id}
                  className="glass-panel glass-panel-interactive"
                  onClick={() => openSkillDetails(skill)}
                  style={{ display: "flex", flexDirection: "column", padding: "1.35rem", minWidth: "280px", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      {skill.provider === "mcp_tool" && <Server size={18} style={{ color: iconColor }} />}
                      {skill.provider === "datasource_op" && <Database size={18} style={{ color: iconColor }} />}
                      {skill.provider === "compute_sandbox" && <FileCode size={18} style={{ color: iconColor }} />}
                      {skill.provider === "native_util" && <Zap size={18} style={{ color: iconColor }} />}
                      {(!skill.provider || skill.provider === "custom_api") && <Globe size={18} style={{ color: iconColor }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)", boxShadow: "0 0 8px var(--color-success-glow)" }} />
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize" }}>Active</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{skill.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                      {skill.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border-color)" }}>
                    <span className="badge badge-success" style={{ fontSize: "0.62rem", textTransform: "uppercase" }}>
                      {categoryLabel}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                      {skill.parameters?.length || 0} params
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel flex-center" style={{ padding: "4rem", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
            <Zap size={44} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
            <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: "340px", fontSize: "0.9rem" }}>
              {t("noSkills")}
            </p>
          </div>
        )}
      </div>

      {/* Slide-over Wizard Drawer */}
      {skillFormOpen && (
        <>
          <div className="modal-overlay animate-fade-in" onClick={() => !wizardSaving && setSkillFormOpen(false)} />
          <div className="slide-over-panel" style={{ maxWidth: "520px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface-solid)" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  {wizardStep === 1 && t("categoryTitle")}
                  {wizardStep === 2 && t("configTitle")}
                  {wizardStep === 3 && t("successTitle")}
                  {wizardStep === 4 && t("detailsTitle")}
                </h3>
                {wizardStep === 2 && (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Lock size={12} />
                    Auto-validation pipeline active
                  </p>
                )}
              </div>
              <button onClick={() => setSkillFormOpen(false)} disabled={wizardSaving} className="btn-secondary" style={{ padding: "0.4rem", borderRadius: "50%" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              
              {/* STEP 1: Select Skill Provider Category */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {t("categoryDesc")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {/* Custom API */}
                    {(() => {
                      const isAllowed = hasPermission("skills_custom_api");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("custom_api")}
                          className={`glass-panel ${isAllowed ? "glass-panel-interactive" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            padding: "1rem",
                            cursor: isAllowed ? "pointer" : "not-allowed",
                            background: "var(--bg-surface)",
                            width: "100%",
                            gap: "0.85rem",
                            opacity: isAllowed ? 1 : 0.5
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: isAllowed ? "var(--color-primary)" : "var(--text-muted)" }}>
                            {isAllowed ? <Globe size={16} /> : <Lock size={14} style={{ color: "var(--color-danger)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.1rem", fontSize: "0.88rem", color: isAllowed ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {t("customApi")}
                              {!isAllowed && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Restricted Profile Access]</span>}
                            </h4>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{t("customApiDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />}
                        </button>
                      );
                    })()}

                    {/* MCP Server Tool */}
                    {(() => {
                      const isAllowed = hasPermission("skills_mcp_tool");
                      const hasMcp = mcpServers.length > 0;
                      const active = isAllowed && hasMcp;
                      return (
                        <button
                          onClick={() => active && handleSelectCategory("mcp_tool")}
                          className={`glass-panel ${active ? "glass-panel-interactive" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            padding: "1rem",
                            cursor: active ? "pointer" : "not-allowed",
                            background: "var(--bg-surface)",
                            width: "100%",
                            gap: "0.85rem",
                            opacity: active ? 1 : 0.5
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: active ? "var(--color-primary)" : "var(--text-muted)" }}>
                            {isAllowed ? <Server size={16} /> : <Lock size={14} style={{ color: "var(--color-danger)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.1rem", fontSize: "0.88rem", color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {t("mcpTool")}
                              {!isAllowed && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Restricted Profile Access]</span>}
                              {isAllowed && !hasMcp && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Requires MCP Connection]</span>}
                            </h4>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{t("mcpToolDesc")}</p>
                          </div>
                          {active && <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />}
                        </button>
                      );
                    })()}

                    {/* Data Connection Operations */}
                    {(() => {
                      const isAllowed = hasPermission("skills_datasource_op");
                      const hasConn = mockConnections.length > 0;
                      const active = isAllowed && hasConn;
                      return (
                        <button
                          onClick={() => active && handleSelectCategory("datasource_op")}
                          className={`glass-panel ${active ? "glass-panel-interactive" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            padding: "1rem",
                            cursor: active ? "pointer" : "not-allowed",
                            background: "var(--bg-surface)",
                            width: "100%",
                            gap: "0.85rem",
                            opacity: active ? 1 : 0.5
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: active ? "var(--color-success)" : "var(--text-muted)" }}>
                            {isAllowed ? <Database size={16} /> : <Lock size={14} style={{ color: "var(--color-danger)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.1rem", fontSize: "0.88rem", color: active ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {t("dataSource")}
                              {!isAllowed && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Restricted Profile Access]</span>}
                              {isAllowed && !hasConn && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Requires Data Source]</span>}
                            </h4>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{t("dataSourceDesc")}</p>
                          </div>
                          {active && <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />}
                        </button>
                      );
                    })()}

                    {/* Platform Native */}
                    {(() => {
                      const isAllowed = hasPermission("skills_native_util");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("native_util")}
                          className={`glass-panel ${isAllowed ? "glass-panel-interactive" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            padding: "1rem",
                            cursor: isAllowed ? "pointer" : "not-allowed",
                            background: "var(--bg-surface)",
                            width: "100%",
                            gap: "0.85rem",
                            opacity: isAllowed ? 1 : 0.5
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: isAllowed ? "var(--color-warning)" : "var(--text-muted)" }}>
                            {isAllowed ? <Zap size={16} /> : <Lock size={14} style={{ color: "var(--color-danger)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.1rem", fontSize: "0.88rem", color: isAllowed ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {t("native")}
                              {!isAllowed && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Restricted Profile Access]</span>}
                            </h4>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{t("nativeDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />}
                        </button>
                      );
                    })()}

                    {/* Compute Sandbox */}
                    {(() => {
                      const isAllowed = hasPermission("skills_compute_sandbox");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("compute_sandbox")}
                          className={`glass-panel ${isAllowed ? "glass-panel-interactive" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textAlign: "left",
                            padding: "1rem",
                            cursor: isAllowed ? "pointer" : "not-allowed",
                            background: "var(--bg-surface)",
                            width: "100%",
                            gap: "0.85rem",
                            opacity: isAllowed ? 1 : 0.5
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: isAllowed ? "var(--color-info)" : "var(--text-muted)" }}>
                            {isAllowed ? <FileCode size={16} /> : <Lock size={14} style={{ color: "var(--color-danger)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.1rem", fontSize: "0.88rem", color: isAllowed ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {t("compute")}
                              {!isAllowed && <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--color-danger)" }}>[Restricted Profile Access]</span>}
                            </h4>
                            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{t("computeDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* STEP 2: Configure Category-Specific Fields */}
              {wizardStep === 2 && (
                <form id="skill-wizard-form" onSubmit={handleSaveSkill} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {t("configDesc")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Query Inventory"
                      value={skillFormName}
                      onChange={e => setSkillFormName(e.target.value)}
                      style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>Description</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Explain what capability this exposes to the AI Agent..."
                      value={skillFormDesc}
                      onChange={e => setSkillFormDesc(e.target.value)}
                      style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", resize: "vertical" }}
                    />
                  </div>

                  {/* 1. CUSTOM API FORM */}
                  {selectedCategory === "custom_api" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("apiMethodLabel")}</label>
                          <select
                            value={apiMethod}
                            onChange={e => setApiMethod(e.target.value as any)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("apiUrlLabel")}</label>
                          <input
                            type="url"
                            required
                            placeholder="https://api.domain.com/v1/resource"
                            value={apiUrl}
                            onChange={e => setApiUrl(e.target.value)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: "var(--color-primary)", fontWeight: 700 }}>
                          <Code size={14} />
                          {t("parameters")}
                        </label>
                        <textarea
                          rows={4}
                          value={apiParamsJson}
                          onChange={e => setApiParamsJson(e.target.value)}
                          style={{ padding: "0.65rem 0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "#080808", color: "#10b981", borderColor: "var(--border-color)", resize: "vertical" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. INGESTED MCP TOOL FORM */}
                  {selectedCategory === "mcp_tool" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("mcpServerSelect")}</label>
                        <select
                          value={selectedMcpServerId}
                          onChange={e => handleMcpServerChange(e.target.value)}
                          style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                        >
                          {mcpServers.map((srv: any) => (
                            <option key={srv.id} value={srv.id}>{srv.name} ({srv.type.toUpperCase()})</option>
                          ))}
                        </select>
                      </div>

                      {selectedMcpServerId && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("mcpToolSelect")}</label>
                          <select
                            value={selectedMcpToolName}
                            onChange={e => handleMcpToolChange(e.target.value)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          >
                            {mcpServers
                              .find(s => s.id === selectedMcpServerId)
                              ?.tools.map((tool: any, tIdx: number) => (
                                <option key={tIdx} value={tool.name}>{tool.name}</option>
                              ))}
                          </select>
                        </div>
                      )}

                      {/* Displaying static mapping parameters preview */}
                      <div style={{ padding: "0.85rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                          Auto-Detected Parameters
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <li><strong>query</strong> (string) - Search text pattern</li>
                          <li><strong>limit</strong> (number) - Max results to fetch</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 3. DATA SOURCE OPERATIONS FORM */}
                  {selectedCategory === "datasource_op" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("dsSelect")}</label>
                        <select
                          value={selectedConnectionId}
                          onChange={e => {
                            setSelectedConnectionId(e.target.value);
                            const conn = mockConnections.find(c => c.id === e.target.value);
                            if (conn) {
                              setSkillFormName(`${conn.name} Query`);
                              setSkillFormDesc(`Executes custom query on ${conn.name} data source.`);
                            }
                          }}
                          style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                        >
                          {mockConnections.map((conn: any) => (
                            <option key={conn.id} value={conn.id}>{conn.name} ({conn.category})</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("dsOpTypeLabel")}</label>
                        <select
                          value={dsOpType}
                          onChange={e => setDsOpType(e.target.value as any)}
                          style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                        >
                          <option value="sql_query">SQL Parameterized Query (Read)</option>
                          <option value="record_mutation">Record Mutation/Insert (Action)</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("dsSqlQueryLabel")}</label>
                        <textarea
                          rows={3}
                          value={dsSqlQuery}
                          onChange={e => setDsSqlQuery(e.target.value)}
                          style={{ padding: "0.65rem 0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", background: "#080808", color: "var(--text-primary)", borderColor: "var(--border-color)", resize: "vertical" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. PLATFORM NATIVE UTILITIES FORM */}
                  {selectedCategory === "native_util" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("nativeTypeLabel")}</label>
                        <select
                          value={nativeType}
                          onChange={e => handleNativeTypeChange(e.target.value as any)}
                          style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                        >
                          <option value="slack">Slack Notification Trigger</option>
                          <option value="approval">Human-in-the-Loop approval check</option>
                          <option value="handoff">Handoff delegation to another Agent</option>
                        </select>
                      </div>

                      {nativeType === "slack" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("slackChanLabel")}</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. #sales-alerts"
                            value={slackChannel}
                            onChange={e => setSlackChannel(e.target.value)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          />
                        </div>
                      )}

                      {nativeType === "approval" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("approvalMsgLabel")}</label>
                          <input
                            type="text"
                            required
                            value={approvalMessage}
                            onChange={e => setApprovalMessage(e.target.value)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          />
                        </div>
                      )}

                      {nativeType === "handoff" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                          <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("handoffAgentLabel")}</label>
                          <select
                            value={handoffAgentId}
                            onChange={e => setHandoffAgentId(e.target.value)}
                            style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                          >
                            <option value="">-- Select Target Agent --</option>
                            {agents.map((ag: any) => (
                              <option key={ag.id} value={ag.id}>{ag.name} ({ag.role})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. COMPUTE / CODE SANDBOX FORM */}
                  {selectedCategory === "compute_sandbox" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("computeLangLabel")}</label>
                        <select
                          value={computeLang}
                          onChange={e => {
                            setComputeLang(e.target.value as any);
                            if (e.target.value === "python") {
                              setComputeCode(`# Python Sandbox script\ndef run(input_val):\n    # Perform data formatting\n    return {\n        "result": input_val.get("value") * 1.1\n    }`);
                            } else {
                              setComputeCode(`// Transform input data\nexport function run(input) {\n  return {\n    result: input.value * 1.1\n  };\n}`);
                            }
                          }}
                          style={{ padding: "0.65rem 0.8rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                        >
                          <option value="js">Node.js (Javascript V8 Sandbox)</option>
                          <option value="python">Python 3.10 Sandbox</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>{t("computeCodeLabel")}</label>
                        <textarea
                          rows={6}
                          value={computeCode}
                          onChange={e => setComputeCode(e.target.value)}
                          style={{ padding: "0.65rem 0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "#080808", color: "#10b981", borderColor: "var(--border-color)", resize: "vertical" }}
                        />
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* STEP 3: Complete screen */}
              {wizardStep === 3 && (
                <div className="animate-fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", width: "75px", height: "75px", borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "var(--color-success)", boxShadow: "0 0 24px rgba(16, 185, 129, 0.15)" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>{t("successTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.75rem", maxWidth: "340px", marginInline: "auto", lineHeight: 1.45 }}>
                    {t("successDesc")}
                  </p>

                  <div style={{ padding: "1.1rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Name</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{skillFormName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Category</span>
                      <span className="badge badge-success" style={{ textTransform: "uppercase" }}>
                        {selectedCategory === "custom_api" && "REST API"}
                        {selectedCategory === "mcp_tool" && "MCP TOOL"}
                        {selectedCategory === "datasource_op" && "DATA SOURCE"}
                        {selectedCategory === "native_util" && "NATIVE ACTIVITY"}
                        {selectedCategory === "compute_sandbox" && "COMPUTE"}
                      </span>
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={() => setSkillFormOpen(false)} style={{ width: "100%", padding: "0.8rem" }}>
                    Done
                  </button>
                </div>
              )}

              {/* STEP 4: View Active Skill Details */}
              {wizardStep === 4 && selectedSkill && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      {selectedSkill.provider === "mcp_tool" && <Server size={18} style={{ color: "var(--color-primary)" }} />}
                      {selectedSkill.provider === "datasource_op" && <Database size={18} style={{ color: "var(--color-success)" }} />}
                      {selectedSkill.provider === "compute_sandbox" && <FileCode size={18} style={{ color: "var(--color-info)" }} />}
                      {selectedSkill.provider === "native_util" && <Zap size={18} style={{ color: "var(--color-warning)" }} />}
                      {(!selectedSkill.provider || selectedSkill.provider === "custom_api") && <Globe size={18} style={{ color: "var(--color-primary)" }} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedSkill.name}</h4>
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.35rem" }}>
                        <span className="badge badge-success" style={{ fontSize: "0.62rem" }}>Active</span>
                        <span className="badge badge-info" style={{ fontSize: "0.62rem", textTransform: "uppercase" }}>
                          {selectedSkill.providerLabel || "REST API"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1.25rem", background: "var(--bg-surface-solid)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Description</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.45 }}>{selectedSkill.description}</span>
                    </div>

                    {selectedSkill.providerLabel && (
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>{t("linkedProvider")}</span>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                          {selectedSkill.providerLabel}
                        </div>
                      </div>
                    )}

                    {selectedSkill.endpoint && (
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Endpoint URL</span>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                          <span style={{ color: "var(--color-primary)", fontWeight: 700, marginRight: "0.5rem" }}>{selectedSkill.method || "POST"}</span>
                          {selectedSkill.endpoint}
                        </div>
                      </div>
                    )}

                    <div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>{t("parameters")}</span>
                      <div style={{ padding: "0.65rem 0.85rem", background: "#060606", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#10b981", overflowX: "auto" }}>
                          {JSON.stringify(
                            selectedSkill.parameters ? selectedSkill.parameters.reduce((acc: any, curr: any) => ({ ...acc, [curr.name]: curr.type }), {}) : {},
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                      <Settings size={14} />
                      {t("editSkill")}
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        const requiredPerm = "skills_" + (selectedSkill.provider || "custom_api");
                        if (!hasPermission(requiredPerm)) {
                          logSecurityAction(
                            "Skill Deletion Blocked",
                            `Skill: ${selectedSkill.id}`,
                            "blocked",
                            `Attempted to delete skill "${selectedSkill.name}" without category permission.`
                          );
                          alert(language === "es" 
                            ? `Acción denegada: Tu rol no cuenta con la autorización para modificar habilidades de esta categoría.` 
                            : `Action denied: Your current role lacks authorization to modify skills of this category.`);
                          return;
                        }
                        logSecurityAction(
                          "Skill Deleted",
                          `Skill: ${selectedSkill.id}`,
                          "success",
                          `Deleted skill profile: "${selectedSkill.name}".`
                        );
                        setSkills(prev => prev.filter(s => s.id !== selectedSkill.id));
                        setSkillFormOpen(false);
                      }}
                      style={{ width: "100%", justifyContent: "center", color: "var(--color-danger)", borderColor: "transparent", background: "rgba(239, 68, 68, 0.1)" }}
                    >
                      <Trash2 size={14} />
                      {t("deleteSkill")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions for Step 2 Configuration */}
            {wizardStep === 2 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-surface-solid)", display: "flex", justifyContent: "space-between", gap: "0.85rem" }}>
                <button type="button" className="btn btn-secondary" disabled={wizardSaving} onClick={() => setWizardStep(1)} style={{ padding: "0.55rem 1rem" }}>
                  Back
                </button>
                <div style={{ display: "flex", gap: "0.85rem" }}>
                  <button type="button" className="btn btn-secondary" disabled={wizardSaving} onClick={() => setSkillFormOpen(false)} style={{ padding: "0.55rem 1rem" }}>
                    Cancel
                  </button>
                  <button type="submit" form="skill-wizard-form" className="btn btn-primary" disabled={wizardSaving} style={{ minWidth: "120px", display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center", padding: "0.55rem 1.15rem" }}>
                    {wizardSaving ? (
                      <>
                        <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon size={14} />
                        <span>Save Skill</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
