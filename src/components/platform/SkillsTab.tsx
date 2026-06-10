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
import { TRANSLATIONS } from "../../lib/translations";
import { Card } from "../ui/Card";
import { SlideOver } from "../ui/SlideOver";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { Input, Select, Textarea } from "../ui/Input";

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
      <Button variant="primary" onClick={openNewSkillWizard} className="!py-2 !px-4 !text-xs flex items-center gap-1.5">
        <Plus size={16} />
        {t("newSkillBtn")}
      </Button>
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
      <div className="animate-fade-in flex flex-col gap-8 pb-8">
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
                <Card
                  key={skill.id}
                  interactive
                  onClick={() => openSkillDetails(skill)}
                  className="flex flex-col p-6 min-w-[280px] cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-[38px] h-[38px] rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)]">
                      {skill.provider === "mcp_tool" && <Server size={18} style={{ color: iconColor }} />}
                      {skill.provider === "datasource_op" && <Database size={18} style={{ color: iconColor }} />}
                      {skill.provider === "compute_sandbox" && <FileCode size={18} style={{ color: iconColor }} />}
                      {skill.provider === "native_util" && <Zap size={18} style={{ color: iconColor }} />}
                      {(!skill.provider || skill.provider === "custom_api") && <Globe size={18} style={{ color: iconColor }} />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" style={{ boxShadow: "0 0 8px var(--color-success-glow)" }} />
                      <span className="text-[10px] text-[var(--text-muted)] capitalize">Active</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Heading level="h4" className="text-sm font-bold text-[var(--text-primary)] mb-1">{skill.name}</Heading>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed m-0">
                      {skill.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-[var(--border-color)]">
                    <Badge variant="success" className="text-[9px] uppercase">
                      {categoryLabel}
                    </Badge>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {skill.parameters?.length || 0} params
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="flex-center p-16 flex-col gap-4 text-center">
            <Zap size={44} className="text-[var(--text-muted)] opacity-50" />
            <p className="m-0 text-[var(--text-secondary)] max-w-[340px] text-sm leading-normal">
              {t("noSkills")}
            </p>
          </Card>
        )}
      </div>

      {/* Slide-over Wizard Drawer */}
      <SlideOver
        isOpen={skillFormOpen}
        onClose={() => !wizardSaving && setSkillFormOpen(false)}
        title={
          wizardStep === 1 ? t("categoryTitle") :
          wizardStep === 2 ? t("configTitle") :
          wizardStep === 3 ? t("successTitle") :
          t("detailsTitle")
        }
        description={wizardStep === 2 ? (language === "es" ? "Canal de auto-validación activo" : "Auto-validation pipeline active") : undefined}
        maxWidth="520px"
        footer={
          wizardStep === 2 ? (
            <div className="flex justify-between items-center w-full">
              <Button variant="secondary" disabled={wizardSaving} onClick={() => setWizardStep(1)} className="!py-2.5 !px-5">
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" disabled={wizardSaving} onClick={() => setSkillFormOpen(false)} className="!py-2.5 !px-5">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  form="skill-wizard-form" 
                  variant="primary" 
                  disabled={wizardSaving} 
                  className="min-w-[120px] flex items-center gap-1.5 justify-center !py-2.5 !px-5"
                >
                  {wizardSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={14} />
                      <span>Save Skill</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
              
              {/* STEP 1: Select Skill Provider Category */}
              {wizardStep === 1 && (
                <div className="flex flex-col gap-5">
                  <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {t("categoryDesc")}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {/* Custom API */}
                    {(() => {
                      const isAllowed = hasPermission("skills_custom_api");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("custom_api")}
                          className={`glass-panel flex items-center justify-between text-left p-4 cursor-pointer bg-[var(--bg-surface)] w-full gap-3.5 ${isAllowed ? "glass-panel-interactive" : "opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                            {isAllowed ? <Globe size={16} /> : <Lock size={14} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Heading level="h4" className="m-0 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                              {t("customApi")}
                              {!isAllowed && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Restricted Profile Access]</span>}
                            </Heading>
                            <p className="text-[10px] text-[var(--text-muted)] m-0">{t("customApiDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
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
                          className={`glass-panel flex items-center justify-between text-left p-4 cursor-pointer bg-[var(--bg-surface)] w-full gap-3.5 ${active ? "glass-panel-interactive" : "opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                            {isAllowed ? <Server size={16} /> : <Lock size={14} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Heading level="h4" className="m-0 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                              {t("mcpTool")}
                              {!isAllowed && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Restricted Profile Access]</span>}
                              {isAllowed && !hasMcp && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Requires MCP Connection]</span>}
                            </Heading>
                            <p className="text-[10px] text-[var(--text-muted)] m-0">{t("mcpToolDesc")}</p>
                          </div>
                          {active && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
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
                          className={`glass-panel flex items-center justify-between text-left p-4 cursor-pointer bg-[var(--bg-surface)] w-full gap-3.5 ${active ? "glass-panel-interactive" : "opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                            {isAllowed ? <Database size={16} /> : <Lock size={14} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Heading level="h4" className="m-0 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                              {t("dataSource")}
                              {!isAllowed && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Restricted Profile Access]</span>}
                              {isAllowed && !hasConn && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Requires Data Source]</span>}
                            </Heading>
                            <p className="text-[10px] text-[var(--text-muted)] m-0">{t("dataSourceDesc")}</p>
                          </div>
                          {active && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
                        </button>
                      );
                    })()}

                    {/* Platform Native */}
                    {(() => {
                      const isAllowed = hasPermission("skills_native_util");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("native_util")}
                          className={`glass-panel flex items-center justify-between text-left p-4 cursor-pointer bg-[var(--bg-surface)] w-full gap-3.5 ${isAllowed ? "glass-panel-interactive" : "opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                            {isAllowed ? <Zap size={16} /> : <Lock size={14} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Heading level="h4" className="m-0 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                              {t("native")}
                              {!isAllowed && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Restricted Profile Access]</span>}
                            </Heading>
                            <p className="text-[10px] text-[var(--text-muted)] m-0">{t("nativeDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
                        </button>
                      );
                    })()}

                    {/* Compute Sandbox */}
                    {(() => {
                      const isAllowed = hasPermission("skills_compute_sandbox");
                      return (
                        <button
                          onClick={() => isAllowed && handleSelectCategory("compute_sandbox")}
                          className={`glass-panel flex items-center justify-between text-left p-4 cursor-pointer bg-[var(--bg-surface)] w-full gap-3.5 ${isAllowed ? "glass-panel-interactive" : "opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                            {isAllowed ? <FileCode size={16} /> : <Lock size={14} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Heading level="h4" className="m-0 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                              {t("compute")}
                              {!isAllowed && <span className="text-[10px] font-normal text-[var(--color-danger)]">[Restricted Profile Access]</span>}
                            </Heading>
                            <p className="text-[10px] text-[var(--text-muted)] m-0">{t("computeDesc")}</p>
                          </div>
                          {isAllowed && <ArrowRight size={14} className="text-[var(--text-muted)]" />}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* STEP 2: Configure Category-Specific Fields */}
              {wizardStep === 2 && (
                <form id="skill-wizard-form" onSubmit={handleSaveSkill} className="flex flex-col gap-5">
                  <p className="m-0 text-xs text-[var(--text-secondary)]">
                    {t("configDesc")}
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Skill Name</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Query Inventory"
                      value={skillFormName}
                      onChange={e => setSkillFormName(e.target.value)}
                      className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Description</label>
                    <Textarea
                      required
                      rows={2}
                      placeholder="Explain what capability this exposes to the AI Agent..."
                      value={skillFormDesc}
                      onChange={e => setSkillFormDesc(e.target.value)}
                      className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                    />
                  </div>

                  {/* 1. CUSTOM API FORM */}
                  {selectedCategory === "custom_api" && (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-[var(--text-primary)] font-bold">{t("apiMethodLabel")}</label>
                          <Select
                            value={apiMethod}
                            onChange={e => setApiMethod(e.target.value as any)}
                            className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("apiUrlLabel")}</label>
                          <Input
                            type="url"
                            required
                            placeholder="https://api.domain.com/v1/resource"
                            value={apiUrl}
                            onChange={e => setApiUrl(e.target.value)}
                            className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                          <Code size={14} />
                          {t("parameters")}
                        </label>
                        <Textarea
                          rows={4}
                          value={apiParamsJson}
                          onChange={e => setApiParamsJson(e.target.value)}
                          className="!py-2.5 !px-3.5 font-mono bg-[#080808] text-emerald-500 border-[var(--border-color)]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. INGESTED MCP TOOL FORM */}
                  {selectedCategory === "mcp_tool" && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("mcpServerSelect")}</label>
                        <Select
                          value={selectedMcpServerId}
                          onChange={e => handleMcpServerChange(e.target.value)}
                          className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                        >
                          {mcpServers.map((srv: any) => (
                            <option key={srv.id} value={srv.id}>{srv.name} ({srv.type.toUpperCase()})</option>
                          ))}
                        </Select>
                      </div>

                      {selectedMcpServerId && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("mcpToolSelect")}</label>
                          <Select
                            value={selectedMcpToolName}
                            onChange={e => handleMcpToolChange(e.target.value)}
                            className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                          >
                            {mcpServers
                              .find(s => s.id === selectedMcpServerId)
                              ?.tools.map((tool: any, tIdx: number) => (
                                <option key={tIdx} value={tool.name}>{tool.name}</option>
                              ))}
                          </Select>
                        </div>
                      )}

                      {/* Displaying static mapping parameters preview */}
                      <div className="p-4 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-md">
                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wide mb-2">
                          Auto-Detected Parameters
                        </div>
                        <ul className="m-0 pl-4 text-xs text-[var(--text-secondary)] flex flex-col gap-1 list-disc">
                          <li><strong>query</strong> (string) - Search text pattern</li>
                          <li><strong>limit</strong> (number) - Max results to fetch</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 3. DATA SOURCE OPERATIONS FORM */}
                  {selectedCategory === "datasource_op" && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("dsSelect")}</label>
                        <Select
                          value={selectedConnectionId}
                          onChange={e => {
                            setSelectedConnectionId(e.target.value);
                            const conn = mockConnections.find(c => c.id === e.target.value);
                            if (conn) {
                              setSkillFormName(`${conn.name} Query`);
                              setSkillFormDesc(`Executes custom query on ${conn.name} data source.`);
                            }
                          }}
                          className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                        >
                          {mockConnections.map((conn: any) => (
                            <option key={conn.id} value={conn.id}>{conn.name} ({conn.category})</option>
                          ))}
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("dsOpTypeLabel")}</label>
                        <Select
                          value={dsOpType}
                          onChange={e => setDsOpType(e.target.value as any)}
                          className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                        >
                          <option value="sql_query">SQL Parameterized Query (Read)</option>
                          <option value="record_mutation">Record Mutation/Insert (Action)</option>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("dsSqlQueryLabel")}</label>
                        <Textarea
                          rows={3}
                          value={dsSqlQuery}
                          onChange={e => setDsSqlQuery(e.target.value)}
                          className="!py-2.5 !px-3.5 font-mono bg-[#080808] text-[var(--text-primary)] border-[var(--border-color)]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. PLATFORM NATIVE UTILITIES FORM */}
                  {selectedCategory === "native_util" && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("nativeTypeLabel")}</label>
                        <Select
                          value={nativeType}
                          onChange={e => handleNativeTypeChange(e.target.value as any)}
                          className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                        >
                          <option value="slack">Slack Notification Trigger</option>
                          <option value="approval">Human-in-the-Loop approval check</option>
                          <option value="handoff">Handoff delegation to another Agent</option>
                        </Select>
                      </div>

                      {nativeType === "slack" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("slackChanLabel")}</label>
                          <Input
                            type="text"
                            required
                            placeholder="e.g. #sales-alerts"
                            value={slackChannel}
                            onChange={e => setSlackChannel(e.target.value)}
                            className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                          />
                        </div>
                      )}

                      {nativeType === "approval" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("approvalMsgLabel")}</label>
                          <Input
                            type="text"
                            required
                            value={approvalMessage}
                            onChange={e => setApprovalMessage(e.target.value)}
                            className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                          />
                        </div>
                      )}

                      {nativeType === "handoff" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("handoffAgentLabel")}</label>
                          <Select
                            value={handoffAgentId}
                            onChange={e => setHandoffAgentId(e.target.value)}
                            className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                          >
                            <option value="">-- Select Target Agent --</option>
                            {agents.map((ag: any) => (
                              <option key={ag.id} value={ag.id}>{ag.name} ({ag.role})</option>
                            ))}
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. COMPUTE / CODE SANDBOX FORM */}
                  {selectedCategory === "compute_sandbox" && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("computeLangLabel")}</label>
                        <Select
                          value={computeLang}
                          onChange={e => {
                            setComputeLang(e.target.value as any);
                            if (e.target.value === "python") {
                              setComputeCode(`# Python Sandbox script\ndef run(input_val):\n    # Perform data formatting\n    return {\n        "result": input_val.get("value") * 1.1\n    }`);
                            } else {
                              setComputeCode(`// Transform input data\nexport function run(input) {\n  return {\n    result: input.value * 1.1\n  };\n}`);
                            }
                          }}
                          className="!py-2.5 !px-3 bg-[var(--bg-surface-hover)]"
                        >
                          <option value="js">Node.js (Javascript V8 Sandbox)</option>
                          <option value="python">Python 3.10 Sandbox</option>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">{t("computeCodeLabel")}</label>
                        <Textarea
                          rows={6}
                          value={computeCode}
                          onChange={e => setComputeCode(e.target.value)}
                          className="!py-2.5 !px-3.5 font-mono bg-[#080808] text-emerald-500 border-[var(--border-color)]"
                        />
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* STEP 3: Complete screen */}
              {wizardStep === 3 && (
                <div className="animate-fade-in text-center py-8">
                  <div className="inline-flex bg-emerald-500/10 border border-emerald-500/25 w-20 h-20 rounded-full items-center justify-center mb-6 text-[var(--color-success)] shadow-[0_0_24px_rgba(16,185,129,0.15)]">
                    <CheckCircle2 size={36} />
                  </div>
                  <Heading level="h3" className="m-0 mb-2 text-xl">{t("successTitle")}</Heading>
                  <p className="text-xs text-[var(--text-secondary)] m-0 mb-6 max-w-[340px] mx-auto leading-relaxed">
                    {t("successDesc")}
                  </p>

                  <div className="p-4 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] text-left mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-[var(--text-secondary)]">Name</span>
                      <span className="text-xs text-[var(--text-primary)] font-bold">{skillFormName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--text-secondary)]">Category</span>
                      <Badge variant="success" className="text-[9px] uppercase">
                        {selectedCategory === "custom_api" && "REST API"}
                        {selectedCategory === "mcp_tool" && "MCP TOOL"}
                        {selectedCategory === "datasource_op" && "DATA SOURCE"}
                        {selectedCategory === "native_util" && "NATIVE ACTIVITY"}
                        {selectedCategory === "compute_sandbox" && "COMPUTE"}
                      </Badge>
                    </div>
                  </div>

                  <Button variant="primary" onClick={() => setSkillFormOpen(false)} className="w-full !py-3">
                    Done
                  </Button>
                </div>
              )}

              {/* STEP 4: View Active Skill Details */}
              {wizardStep === 4 && selectedSkill && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 p-5 bg-[var(--bg-surface-hover)] border border-[var(--border-color)] rounded-md">
                    <div className="w-[38px] h-[38px] rounded-md bg-[var(--bg-surface-solid)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)]">
                      {selectedSkill.provider === "mcp_tool" && <Server size={18} style={{ color: "var(--color-primary)" }} />}
                      {selectedSkill.provider === "datasource_op" && <Database size={18} style={{ color: "var(--color-success)" }} />}
                      {selectedSkill.provider === "compute_sandbox" && <FileCode size={18} style={{ color: "var(--color-info)" }} />}
                      {selectedSkill.provider === "native_util" && <Zap size={18} style={{ color: "var(--color-warning)" }} />}
                      {(!selectedSkill.provider || selectedSkill.provider === "custom_api") && <Globe size={18} style={{ color: "var(--color-primary)" }} />}
                    </div>
                    <div>
                      <Heading level="h4" className="m-0 text-sm font-bold text-[var(--text-primary)]">{selectedSkill.name}</Heading>
                      <div className="flex gap-1.5 mt-1.5">
                        <Badge variant="success" className="text-[9px]">Active</Badge>
                        <Badge variant="info" className="text-[9px] uppercase">
                          {selectedSkill.providerLabel || "REST API"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-[var(--bg-surface-solid)] rounded-md border border-[var(--border-color)] flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] block mb-1 font-semibold">Description</span>
                      <span className="text-xs text-[var(--text-primary)] leading-relaxed">{selectedSkill.description}</span>
                    </div>

                    {selectedSkill.providerLabel && (
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block mb-1 font-semibold">{t("linkedProvider")}</span>
                        <div className="text-xs text-[var(--text-primary)] font-mono bg-[var(--bg-surface-hover)] p-2.5 rounded border border-[var(--border-color)]">
                          {selectedSkill.providerLabel}
                        </div>
                      </div>
                    )}

                    {selectedSkill.endpoint && (
                      <div>
                        <span className="text-[10px] text-[var(--text-secondary)] block mb-1 font-semibold">Endpoint URL</span>
                        <div className="text-xs text-[var(--text-primary)] bg-[var(--bg-surface-hover)] p-2.5 rounded border border-[var(--border-color)] font-mono break-all">
                          <span className="text-[var(--color-primary)] font-bold mr-2">{selectedSkill.method || "POST"}</span>
                          {selectedSkill.endpoint}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] block mb-1.5 font-semibold">{t("parameters")}</span>
                      <div className="p-3 bg-[#060606] rounded border border-[var(--border-color)]">
                        <pre className="m-0 text-[11px] font-mono text-emerald-500 overflow-x-auto">
                          {JSON.stringify(
                            selectedSkill.parameters ? selectedSkill.parameters.reduce((acc: any, curr: any) => ({ ...acc, [curr.name]: curr.type }), {}) : {},
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <Button variant="secondary" className="w-full justify-center !py-2.5">
                      <Settings size={14} className="mr-1.5" />
                      {t("editSkill")}
                    </Button>
                    <Button
                      variant="danger"
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
                      className="w-full justify-center !py-2.5 bg-red-500/10 !text-red-500 hover:bg-red-500/25 border border-red-500/20 shadow-none"
                    >
                      <Trash2 size={14} className="mr-1.5" />
                      {t("deleteSkill")}
                    </Button>
                  </div>
                </div>
              )}
      </SlideOver>
    </>
  );
};
