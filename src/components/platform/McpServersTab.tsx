import { useDashboard } from "../../context/DashboardContext";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Server,
  Globe,
  Terminal,
  Check,
  CheckCircle2,
  X,
  Lock,
  RefreshCw,
  Trash2,
  Settings,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Database,
  Zap,
  Play,
  FileCode,
  ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";
import { SlideOver } from "../ui/SlideOver";
import { Input, Select } from "../ui/Input";
import { Heading } from "../ui/Heading";
import { Badge } from "../ui/Badge";

interface McpTool {
  name: string;
  desc: string;
  enabled?: boolean;
}

interface McpServer {
  id: string;
  name: string;
  type: "stdio" | "sse";
  status: "connected" | "error" | "pending";
  command?: string;
  args?: string;
  env?: string;
  url?: string;
  headers?: string;
  toolsCount: number;
  lastSync: string;
  tools: McpTool[];
}

const MCP_DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    mcpServersTitle: "Model Context Protocol Integration",
    mcpServersDesc: "Orchestrate Model Context Protocol (MCP) servers. Ingest external tools to expand Agent skills, or expose your custom workspace resources outward to models like Claude Desktop.",
    ingestTab: "Ingest External Servers (Client)",
    exposeTab: "Expose Platform Resources (Host)",
    addServer: "Ingest MCP Server",
    activeServers: "Connected MCP Servers",
    noServers: "No ingested MCP servers. Connect one to expand your Agentic capabilities.",
    stdioTrans: "Stdio (Local Command)",
    sseTrans: "SSE (Remote Gateway)",
    toolsExposed: "tools",
    syncStatus: "Active sync",
    hostStatus: "Agenttis MCP Host Server Status",
    live: "LIVE GATEWAY ACTIVE",
    inactive: "HOST GATEWAY DEACTIVATED",
    sseEndpoint: "SSE HTTP Endpoint Gateway URL",
    apiKey: "Active MCP Gateway Secret API Key",
    regenerate: "Regenerate API Key",
    exposureCtrl: "Host Exposure Control Pane",
    exposureCtrlDesc: "Select which connected Data Sources, defined Skills, and active AI Agents are securely exposed outward to external LLM clients.",
    exposeDataSources: "Expose Data Sources",
    exposeSkills: "Expose Agent Skills",
    exposeAgents: "Expose AI Agents",
    claudeConfigTitle: "Claude Desktop Integration Helper",
    claudeConfigDesc: "To connect your Claude Desktop application directly to this Agenttis node, add this block to your local configuration file:",
    claudeConfigPath: "Config File Path: ~/Library/Application Support/Claude/claude_desktop_config.json",
    liveLogs: "Incoming Live MCP Host Request Logs",
    logTime: "Time",
    logRequest: "Protocol Request",
    logClient: "Client Application",
    logLatency: "Latency",
    logStatus: "Status",
    wizardTransport: "Select Protocol Transport Mode",
    wizardTransportDesc: "Determine how the Agenttis client will connect and communicate with the external server.",
    wizardConfigTitle: "Configure Server Setup Parameters",
    wizardConfigDesc: "Define connection endpoints, executable commands, arguments, and required security headers.",
    wizardDiscoveryTitle: "Discovered System Tools Mapping",
    wizardDiscoveryDesc: "We successfully queried the external MCP server. Choose which exposed tools to ingest as centralized skills.",
    successTitle: "MCP Server Ingested Successfully",
    successDesc: "Centralized controls are now active. Selected tools have been mapped as Skills.",
    detailsTitle: "MCP Server Ingestion Details",
    deleteBtn: "Remove Ingestion Link",
    editSrv: "Edit Server Setup",
    toolsLabel: "Exposed Tools List"
  },
  es: {
    mcpServersTitle: "Integración de Model Context Protocol (MCP)",
    mcpServersDesc: "Orquestá servidores Model Context Protocol (MCP). Conectá herramientas externas para ampliar las habilidades de tus agentes, o exponé los recursos de tu espacio de trabajo hacia afuera para modelos como Claude Desktop.",
    ingestTab: "Conectar Servidores Externos (Cliente)",
    exposeTab: "Exponer Recursos de la Plataforma (Host)",
    addServer: "Conectar Servidor MCP",
    activeServers: "Servidores MCP Conectados",
    noServers: "No hay servidores MCP conectados. Conecta uno para expandir las capacidades agénticas.",
    stdioTrans: "Stdio (Comando Local)",
    sseTrans: "SSE (Pasarela Remota)",
    toolsExposed: "herramientas",
    syncStatus: "Sincronización activa",
    hostStatus: "Estado del Servidor Host MCP Agenttis",
    live: "PASARELA EN VIVO ACTIVA",
    inactive: "PASARELA HOST DESACTIVADA",
    sseEndpoint: "URL de Pasarela del Endpoint HTTP SSE",
    apiKey: "Clave de API Secreta del Host MCP Activo",
    regenerate: "Regenerar Clave API",
    exposureCtrl: "Panel de Control de Exposición de Recursos",
    exposureCtrlDesc: "Seleccioná qué Fuentes de Datos, Habilidades y Agentes activos se exponen de forma segura hacia clientes LLM externos.",
    exposeDataSources: "Exponer Fuentes de Datos",
    exposeSkills: "Exponer Habilidades",
    exposeAgents: "Exponer Agentes",
    claudeConfigTitle: "Asistente de Integración para Claude Desktop",
    claudeConfigDesc: "Para conectar tu aplicación de Claude Desktop directamente a este nodo de Agenttis, agrega este bloque a tu archivo de configuración local:",
    claudeConfigPath: "Ruta del archivo: ~/Library/Application Support/Claude/claude_desktop_config.json",
    liveLogs: "Registro de Consultas Host MCP entrantes en vivo",
    logTime: "Hora",
    logRequest: "Petición del Protocolo",
    logClient: "Aplicación Cliente",
    logLatency: "Latencia",
    logStatus: "Estado",
    wizardTransport: "Seleccionar Modo de Transporte",
    wizardTransportDesc: "Determina cómo se conectará y comunicará el cliente de Agenttis con el servidor externo.",
    wizardConfigTitle: "Configurar Parámetros del Servidor",
    wizardConfigDesc: "Define puntos de conexión, comandos ejecutables, argumentos y cabeceras de seguridad requeridas.",
    wizardDiscoveryTitle: "Mapeo de Herramientas Descubiertas",
    wizardDiscoveryDesc: "Consultamos con éxito el servidor MCP externo. Elige qué herramientas expuestas vincular como habilidades centrales.",
    successTitle: "Servidor MCP Conectado con Éxito",
    successDesc: "Los controles centralizados ya están activos. Las herramientas seleccionadas se han asignado como Habilidades.",
    detailsTitle: "Detalles del Servidor MCP Conectado",
    deleteBtn: "Desconectar Servidor",
    editSrv: "Editar Configuración de Servidor",
    toolsLabel: "Lista de Herramientas Expuestas"
  }
};

export const McpServersTab: React.FC = () => {
  const {
    language,
    mcpServers,
    setMcpServers,
    mcpExposedServers,
    setMcpExposedServers,
    mockConnections,
    skills,
    agents,
    copyToClipboard,
    hasPermission,
    logSecurityAction
  } = useDashboard();

  const t = React.useCallback((key: string) => {
    const lang = language === "es" ? "es" : "en";
    return MCP_DICTIONARY[lang][key] !== undefined ? MCP_DICTIONARY[lang][key] : key;
  }, [language]);

  // Client Ingestion Wizard & Drawer State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardType, setWizardType] = useState<"stdio" | "sse" | "">("");
  const [wizardConfig, setWizardConfig] = useState<Record<string, string>>({
    name: "",
    command: "npx",
    args: "",
    env: "",
    url: "",
    headers: ""
  });
  const [discoveredTools, setDiscoveredTools] = useState<McpTool[]>([]);
  const [wizardConnecting, setWizardConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Exposed Host Server Wizard & Drawer State
  const [exposedWizardOpen, setExposedWizardOpen] = useState(false);
  const [exposedWizardStep, setExposedWizardStep] = useState(1);
  const [exposedWizardConfig, setExposedWizardConfig] = useState({
    name: "",
    description: "",
    exposedDataSources: [] as string[],
    exposedSkills: [] as string[],
    exposedAgents: [] as string[]
  });
  const [exposedWizardSaving, setExposedWizardSaving] = useState(false);
  const [newExposedServerResult, setNewExposedServerResult] = useState<any | null>(null);

  // Selected Exposed Server details drawer state
  const [selectedExposedServerId, setSelectedExposedServerId] = useState<string | null>(null);
  const [exposedDetailOpen, setExposedDetailOpen] = useState(false);

  const selectedExposedServer = selectedExposedServerId
    ? mcpExposedServers.find((s: any) => s.id === selectedExposedServerId) || null
    : null;

  // Simulate incoming live request logs for active exposed servers
  useEffect(() => {
    const interval = setInterval(() => {
      setMcpExposedServers(prev => {
        const activeServers = prev.filter(s => s.status === "connected");
        if (activeServers.length === 0) return prev;

        const randomRequest = [
          "tools/list",
          "tools/call (read_customers)",
          "tools/call (refund_invoice)",
          "resources/list",
          "prompts/list",
          "tools/call (adjust_stock)"
        ][Math.floor(Math.random() * 6)];
        const randomClient = ["Claude Desktop", "Cursor AI", "v0 Dev Bot", "Custom Agent Pipeline"][Math.floor(Math.random() * 4)];
        const randomLatency = Math.floor(Math.random() * 120) + 10;
        const status = Math.random() > 0.05 ? 200 : 500;
        const timeStr = new Date().toTimeString().split(" ")[0];

        // Pick one active server to add a log to
        const targetServer = activeServers[Math.floor(Math.random() * activeServers.length)];
        return prev.map(s => {
          if (s.id === targetServer.id) {
            const newLogs = [
              { time: timeStr, request: randomRequest, client: randomClient, status, latency: randomLatency },
              ...(s.logs || [])
            ].slice(0, 8);
            return { ...s, logs: newLogs };
          }
          return s;
        });
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [setMcpExposedServers]);

  // Open Client Wizard
  const handleOpenWizard = () => {
    if (!hasPermission("manage_mcp")) {
      logSecurityAction(
        "MCP Modification Blocked",
        "MCP Servers module (Client)",
        "blocked",
        "Attempted to trigger Ingest MCP Server wizard without manage_mcp clearance."
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con la autorización 'manage_mcp' requerida." 
        : "Action denied: Your current role lacks the required 'manage_mcp' clearance.");
      return;
    }
    setWizardStep(1);
    setWizardType("");
    setWizardConfig({
      name: "",
      command: "npx",
      args: "",
      env: "",
      url: "",
      headers: ""
    });
    setDiscoveredTools([]);
    setWizardOpen(true);
  };

  // Step 1 validation/progress for Client Ingestion
  const handleSelectType = (type: "stdio" | "sse") => {
    setWizardType(type);
    setWizardConfig(prev => ({
      ...prev,
      name: type === "stdio" ? "Local SQLite Server" : "External Search API"
    }));
    setWizardStep(2);
  };

  // Step 2 configuration submission (triggers mocked discovery)
  const handleConfigureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardConnecting(true);

    setTimeout(() => {
      setWizardConnecting(false);
      if (wizardType === "stdio") {
        setDiscoveredTools([
          { name: "read_query", desc: "Execute a read-only query on the database.", enabled: true },
          { name: "write_query", desc: "Execute a write query on the database.", enabled: true },
          { name: "list_tables", desc: "List all tables in the database.", enabled: true },
          { name: "describe_table", desc: "Get structural information of a table.", enabled: false }
        ]);
      } else {
        setDiscoveredTools([
          { name: "search_web", desc: "Queries search index for terms.", enabled: true },
          { name: "fetch_news", desc: "Retrieves latest news items.", enabled: true }
        ]);
      }
      setWizardStep(3);
    }, 1200);
  };

  // Step 3 validation/saving for Client Ingestion
  const handleIngestSubmit = () => {
    const enabledTools = discoveredTools.filter(t => t.enabled);
    const newServerId = `srv-${Date.now()}`;
    const newServer: McpServer = {
      id: newServerId,
      name: wizardConfig.name || (wizardType === "stdio" ? "Custom Command Server" : "Custom SSE Server"),
      type: wizardType as "stdio" | "sse",
      status: "connected",
      command: wizardType === "stdio" ? wizardConfig.command : undefined,
      args: wizardType === "stdio" ? wizardConfig.args : undefined,
      env: wizardType === "stdio" ? wizardConfig.env : undefined,
      url: wizardType === "sse" ? wizardConfig.url : undefined,
      headers: wizardType === "sse" ? wizardConfig.headers : undefined,
      toolsCount: enabledTools.length,
      lastSync: "Just now",
      tools: discoveredTools
    };

    setMcpServers(prev => [newServer, ...prev]);
    logSecurityAction(
      "MCP Ingestion Configured",
      `MCP Client Server: ${newServerId}`,
      "success",
      `Successfully ingested external MCP server: "${newServer.name}" exposing ${enabledTools.length} tools.`
    );
    setWizardStep(4);
  };

  // Detail View Drawer opener for Client Ingestion
  const handleOpenDetail = (srv: McpServer) => {
    setSelectedServer(srv);
    setDetailOpen(true);
  };

  // Delete Server Ingestion
  const handleDeleteServer = (id: string) => {
    if (!hasPermission("manage_mcp")) {
      logSecurityAction(
        "MCP Modification Blocked",
        `MCP Client Server: ${id}`,
        "blocked",
        "Attempted to remove ingested MCP server link without manage_mcp clearance."
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con la autorización 'manage_mcp'." 
        : "Action denied: Your current role lacks 'manage_mcp' authorization.");
      return;
    }
    logSecurityAction(
      "MCP Ingestion Removed",
      `MCP Client Server: ${id}`,
      "success",
      "Successfully deleted client server connection."
    );
    setMcpServers(prev => prev.filter(s => s.id !== id));
    setDetailOpen(false);
  };

  // Toggle individual discovered tool
  const toggleDiscoveredTool = (index: number) => {
    setDiscoveredTools(prev => prev.map((t, idx) => idx === index ? { ...t, enabled: !t.enabled } : t));
  };

  // Open Exposed Server Wizard
  const handleOpenExposedWizard = () => {
    if (!hasPermission("manage_mcp")) {
      logSecurityAction(
        "MCP Modification Blocked",
        "MCP Servers module (Host)",
        "blocked",
        "Attempted to trigger Expose Resources wizard without manage_mcp clearance."
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con la autorización 'manage_mcp' requerida." 
        : "Action denied: Your current role lacks the required 'manage_mcp' clearance.");
      return;
    }
    setExposedWizardStep(1);
    setExposedWizardConfig({
      name: "",
      description: "",
      exposedDataSources: [],
      exposedSkills: [],
      exposedAgents: []
    });
    setNewExposedServerResult(null);
    setExposedWizardOpen(true);
  };

  // Step 1 validation for Exposed Wizard
  const handleExposedStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setExposedWizardStep(2);
  };

  // Step 2 submit - create the exposed server
  const handleCreateExposedServerSubmit = () => {
    setExposedWizardSaving(true);
    setTimeout(() => {
      const serverSlug = exposedWizardConfig.name.toLowerCase().trim().replace(/\s+/g, "-");
      const generatedApiKey = "agt_live_" + Math.random().toString(36).substring(2, 18);
      const generatedUrl = `https://api.agenttis.com/v1/mcp/${serverSlug}/sse`;
      
      const newServerId = `exp-${Date.now()}`;
      const newServer = {
        id: newServerId,
        name: exposedWizardConfig.name,
        description: exposedWizardConfig.description || "Custom exposed server host gateway.",
        status: "connected",
        url: generatedUrl,
        apiKey: generatedApiKey,
        exposedDataSources: exposedWizardConfig.exposedDataSources,
        exposedSkills: exposedWizardConfig.exposedSkills,
        exposedAgents: exposedWizardConfig.exposedAgents,
        logs: [
          { time: new Date().toTimeString().split(" ")[0], request: "discovery/init", client: "Agenttis Network", status: 200, latency: 12 }
        ]
      };

      setMcpExposedServers(prev => [...prev, newServer]);
      logSecurityAction(
        "MCP Host Created",
        `MCP Host Gateway: ${newServerId}`,
        "success",
        `Exposed platform resources under host gateway: "${newServer.name}"`
      );
      setNewExposedServerResult(newServer);
      setExposedWizardSaving(false);
      setExposedWizardStep(3);
    }, 1000);
  };

  // Toggle checklist inside exposed wizard configuration
  const handleToggleWizardResource = (resId: string, type: "datasource" | "skill" | "agent") => {
    setExposedWizardConfig(prev => {
      const field = type === "datasource" 
        ? "exposedDataSources" 
        : type === "skill" 
          ? "exposedSkills" 
          : "exposedAgents";
      
      const currentList = prev[field];
      const newList = currentList.includes(resId)
        ? currentList.filter(id => id !== resId)
        : [...currentList, resId];
      
      return { ...prev, [field]: newList };
    });
  };

  // Open Exposed Server Detail Drawer
  const handleOpenExposedDetail = (srv: any) => {
    setSelectedExposedServerId(srv ? srv.id : null);
    setExposedDetailOpen(true);
  };

  // Toggle resource exposure inside details view
  const handleToggleExposedResource = (srvId: string, resId: string, type: "datasource" | "skill" | "agent") => {
    setMcpExposedServers(prev => prev.map(s => {
      if (s.id === srvId) {
        const field = type === "datasource" 
          ? "exposedDataSources" 
          : type === "skill" 
            ? "exposedSkills" 
            : "exposedAgents";
        
        const newList = s[field].includes(resId)
          ? s[field].filter((id: string) => id !== resId)
          : [...s[field], resId];
        
        return { ...s, [field]: newList };
      }
      return s;
    }));
  };

  // Toggle exposed server status
  const handleToggleExposedServerStatus = (srvId: string) => {
    setMcpExposedServers(prev => prev.map(s => {
      if (s.id === srvId) {
        return { ...s, status: s.status === "connected" ? "inactive" : "connected" };
      }
      return s;
    }));
  };

  // Regenerate exposed server API key
  const handleRegenerateExposedApiKey = (srvId: string) => {
    const newKey = "agt_live_" + Math.random().toString(36).substring(2, 18);
    setMcpExposedServers(prev => prev.map(s => {
      if (s.id === srvId) {
        return { ...s, apiKey: newKey };
      }
      return s;
    }));
  };

  // Delete exposed server
  const handleDeleteExposedServer = (srvId: string) => {
    if (!hasPermission("manage_mcp")) {
      logSecurityAction(
        "MCP Modification Blocked",
        `MCP Host Gateway: ${srvId}`,
        "blocked",
        "Attempted to delete exposed MCP host server without manage_mcp clearance."
      );
      alert(language === "es" 
        ? "Acción denegada: Tu rol no cuenta con la autorización 'manage_mcp'." 
        : "Action denied: Your current role lacks 'manage_mcp' authorization.");
      return;
    }
    logSecurityAction(
      "MCP Host Deleted",
      `MCP Host Gateway: ${srvId}`,
      "success",
      "Successfully removed exposed host gateway endpoint."
    );
    setMcpExposedServers(prev => prev.filter(s => s.id !== srvId));
    setExposedDetailOpen(false);
  };

  // Generate Claude Desktop integration config helper snippet dynamically
  const getClaudeConfigSnippet = (srv: any) => {
    if (!srv) return "";
    const serverSlug = srv.name.toLowerCase().trim().replace(/\s+/g, "-");
    return `{
  "mcpServers": {
    "agenttis-${serverSlug}": {
      "command": "node",
      "args": [
        "-e",
        "const s=require('events'),e=new (require('ws'))('wss://api.agenttis.com/v1/mcp/gateway?key=${srv.apiKey}');/*...*/"
      ],
      "env": {
        "AGENTTIS_API_KEY": "${srv.apiKey}"
      }
    }
  }
}`;
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "2rem" }}>
        
        {/* SECTION 1: CLIENT EXTERNAL SERVERS */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {language === "es" ? "Servidores MCP Externos (Cliente)" : "External MCP Servers (Client)"}
              </h3>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {language === "es" 
                  ? "Conectá y administrá servidores Model Context Protocol para importar herramientas como habilidades." 
                  : "Connect and manage Model Context Protocol servers to import tools as active Agent skills."}
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenWizard} style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}>
              <Plus size={14} />
              {t("addServer")}
            </button>
          </div>

          {mcpServers.length > 0 ? (
            <div className="marketplace-grid">
              {mcpServers.map((srv: McpServer) => (
                <div
                  key={srv.id}
                  className="glass-panel glass-panel-interactive"
                  onClick={() => handleOpenDetail(srv)}
                  style={{ display: "flex", flexDirection: "column", padding: "1.35rem", minWidth: "280px", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      {srv.type === "stdio" ? <Terminal size={18} style={{ color: "var(--color-primary)" }} /> : <Globe size={18} style={{ color: "var(--color-success)" }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: srv.status === "connected" ? "var(--color-success)" : srv.status === "error" ? "var(--color-danger)" : "var(--color-warning)", boxShadow: srv.status === "connected" ? "0 0 8px var(--color-success-glow)" : "none" }} />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                        {srv.status === "connected" ? "online" : srv.status === "error" ? "offline" : "pending"}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{srv.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {srv.type === "stdio" ? `${srv.command} ${srv.args}` : srv.url}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border-color)" }}>
                    <span className={`badge ${srv.type === "stdio" ? "badge-info" : "badge-success"}`} style={{ fontSize: "0.62rem" }}>
                      {srv.type === "stdio" ? t("stdioTrans") : t("sseTrans")}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {srv.toolsCount} {t("toolsExposed")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel flex-center" style={{ padding: "4rem", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
              <Server size={44} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
              <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: "340px", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {t("noServers")}
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: EXPOSED HOST SERVERS */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {language === "es" ? "Servidores MCP Expuestos (Host)" : "Exposed MCP Servers (Host)"}
              </h3>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {language === "es" 
                  ? "Exponé de forma segura tus bases de datos locales, habilidades personalizadas y agentes activos hacia clientes externos." 
                  : "Expose your databases, custom skills, and active AI agents securely to external LLM clients."}
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenExposedWizard} style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}>
              <Plus size={14} />
              {language === "es" ? "Exponer Recursos" : "Expose Resources"}
            </button>
          </div>

          {(mcpExposedServers || []).length > 0 ? (
            <div className="marketplace-grid">
              {(mcpExposedServers || []).map((srv: any) => (
                <div
                  key={srv.id}
                  className="glass-panel glass-panel-interactive"
                  onClick={() => handleOpenExposedDetail(srv)}
                  style={{ display: "flex", flexDirection: "column", padding: "1.35rem", minWidth: "280px", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      <Server size={18} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: srv.status === "connected" ? "var(--color-success)" : "var(--text-muted)", boxShadow: srv.status === "connected" ? "0 0 8px var(--color-success-glow)" : "none" }} />
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                        {srv.status === "connected" ? "online" : "offline"}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{srv.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {srv.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border-color)" }}>
                    <span className="badge badge-info" style={{ fontSize: "0.62rem" }}>
                      SSE HOST
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {((srv.exposedDataSources?.length || 0) + (srv.exposedSkills?.length || 0) + (srv.exposedAgents?.length || 0))} {language === "es" ? "recursos" : "resources"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel flex-center" style={{ padding: "4rem", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
              <Server size={44} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
              <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: "340px", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {language === "es" ? "No hay servidores MCP expuestos. Creá uno para comenzar." : "No exposed host gateways. Create one to begin."}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* DETAILED VIEW DRAWER (EXTERNAL CLIENT SERVER DETAILS) */}
      <SlideOver
        isOpen={detailOpen && !!selectedServer}
        onClose={() => setDetailOpen(false)}
        title={t("detailsTitle")}
        maxWidth="480px"
      >
        {selectedServer && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                  {selectedServer.type === "stdio" ? <Terminal size={20} style={{ color: "var(--color-primary)" }} /> : <Globe size={20} style={{ color: "var(--color-success)" }} />}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedServer.name}</h4>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem" }}>
                    <span className={`badge ${selectedServer.status === "connected" ? "badge-success" : "badge-danger"}`} style={{ fontSize: "0.65rem" }}>
                      {selectedServer.status === "connected" ? "Connected" : "Offline"}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: "0.65rem" }}>
                      {selectedServer.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Server Details Parameters */}
              <div style={{ padding: "1.25rem", background: "var(--bg-surface-solid)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem", fontWeight: 700 }}>
                  {t("editSrv")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {selectedServer.type === "stdio" ? (
                    <>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Command Executable</span>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                          {selectedServer.command}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Arguments</span>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)", wordBreak: "break-all" }}>
                          {selectedServer.args}
                        </div>
                      </div>
                      {selectedServer.env && (
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Env Variables</span>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)", wordBreak: "break-all" }}>
                            {selectedServer.env}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>SSE Gateway URL</span>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)", wordBreak: "break-all" }}>
                          {selectedServer.url}
                        </div>
                      </div>
                      {selectedServer.headers && (
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Authorization Headers</span>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontFamily: "var(--font-mono)", background: "var(--bg-surface-hover)", padding: "0.5rem", borderRadius: "var(--radius-sm)", wordBreak: "break-all" }}>
                            {selectedServer.headers}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Last Connection Sync</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                      {selectedServer.lastSync} — Status OK
                    </span>
                  </div>
                </div>
              </div>

              {/* Tools List */}
              <div style={{ padding: "1.25rem", background: "var(--bg-surface-solid)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem", fontWeight: 700 }}>
                  {t("toolsLabel")} ({selectedServer.tools.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedServer.tools.map((tool, idx) => (
                    <div key={idx} style={{ padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", fontStyle: "normal", alignItems: "center" }}>
                        <span>{tool.name}</span>
                        <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem" }}>Centralized Skill</span>
                      </div>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{tool.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                <Button
                  variant="secondary"
                  onClick={() => handleDeleteServer(selectedServer.id)}
                  className="w-full justify-center !text-red-500 hover:!bg-red-500/10 hover:!text-red-500 border border-red-500/20"
                >
                  <Trash2 size={14} />
                  {t("deleteBtn")}
                </Button>
              </div>
            </div>
          )}
      </SlideOver>

      {/* DETAILED VIEW DRAWER (EXPOSED SERVER DETAILS) */}
      <SlideOver
        isOpen={exposedDetailOpen && !!selectedExposedServer}
        onClose={() => setExposedDetailOpen(false)}
        title={language === "es" ? "Detalles del Servidor Expuesto" : "Exposed Server Details"}
        description={selectedExposedServer?.name}
        maxWidth="520px"
      >
        {selectedExposedServer && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Status Switcher */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{language === "es" ? "Estado del Servidor Host" : "Host Server Status"}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>v1.2.0 Gateway Protocol Standard</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: selectedExposedServer.status === "connected" ? "var(--color-success)" : "var(--text-muted)" }}>
                    {selectedExposedServer.status === "connected" ? t("live") : t("inactive")}
                  </span>
                  <button
                    onClick={() => handleToggleExposedServerStatus(selectedExposedServer.id)}
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "12px",
                      background: selectedExposedServer.status === "connected" ? "var(--color-primary)" : "var(--bg-surface-hover)",
                      border: "1px solid var(--border-color)",
                      position: "relative",
                      cursor: "pointer",
                      outline: "none",
                      transition: "background-color var(--transition-normal)"
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#000000",
                        position: "absolute",
                        top: "2px",
                        left: selectedExposedServer.status === "connected" ? "22px" : "2px",
                        transition: "left var(--transition-fast)"
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Endpoint Setup */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", opacity: selectedExposedServer.status === "connected" ? 1 : 0.5, transition: "opacity 0.25s" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("sseEndpoint")}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      readOnly
                      value={selectedExposedServer.url}
                      style={{ flex: 1, padding: "0.6rem 0.85rem", fontSize: "0.82rem", background: "var(--bg-surface-solid)", fontFamily: "var(--font-mono)" }}
                    />
                    <button className="btn btn-secondary" onClick={() => { copyToClipboard(selectedExposedServer.url); }} style={{ padding: "0.6rem" }}>
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("apiKey")}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}>
                      <input
                        type="password"
                        readOnly
                        value={selectedExposedServer.apiKey}
                        style={{ width: "100%", padding: "0.6rem 0.85rem", fontSize: "0.82rem", background: "var(--bg-surface-solid)", fontFamily: "var(--font-mono)", paddingRight: "2rem" }}
                      />
                      <Key size={14} style={{ position: "absolute", right: "0.75rem", color: "var(--text-muted)" }} />
                    </div>
                    <button className="btn btn-secondary" onClick={() => { copyToClipboard(selectedExposedServer.apiKey); }} style={{ padding: "0.6rem" }}>
                      <Copy size={14} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRegenerateExposedApiKey(selectedExposedServer.id)}
                      style={{ padding: "0.6rem", fontSize: "0.8rem", gap: "0.3rem" }}
                    >
                      <RefreshCw size={12} />
                      <span style={{ fontSize: "0.7rem" }}>{t("regenerate")}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Exposure Controls Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h4 style={{ margin: "0", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {t("exposureCtrl")}
                </h4>

                {/* Data Sources */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Database size={12} />
                    {t("exposeDataSources")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {mockConnections.map((conn: any) => {
                      const isExposed = selectedExposedServer.exposedDataSources?.includes(conn.id);
                      return (
                        <label
                          key={conn.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.75rem",
                            background: isExposed ? "var(--bg-surface-hover)" : "transparent",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          <span style={{ fontWeight: 600, color: isExposed ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {conn.name}
                          </span>
                          <input
                            type="checkbox"
                            checked={isExposed}
                            onChange={() => handleToggleExposedResource(selectedExposedServer.id, conn.id, "datasource")}
                            style={{ width: "auto", cursor: "pointer" }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Zap size={12} />
                    {t("exposeSkills")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {skills.map((sk: any) => {
                      const isExposed = selectedExposedServer.exposedSkills?.includes(sk.id);
                      return (
                        <label
                          key={sk.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.75rem",
                            background: isExposed ? "var(--bg-surface-hover)" : "transparent",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: isExposed ? "var(--text-primary)" : "var(--text-muted)", display: "block" }}>
                              {sk.name}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{sk.description}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isExposed}
                            onChange={() => handleToggleExposedResource(selectedExposedServer.id, sk.id, "skill")}
                            style={{ width: "auto", cursor: "pointer" }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Agents */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Cpu size={12} />
                    {t("exposeAgents")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {agents.map((ag: any) => {
                      const isExposed = selectedExposedServer.exposedAgents?.includes(ag.id);
                      return (
                        <label
                          key={ag.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.75rem",
                            background: isExposed ? "var(--bg-surface-hover)" : "transparent",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: isExposed ? "var(--text-primary)" : "var(--text-muted)", display: "block" }}>
                              {ag.name}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ag.role}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isExposed}
                            onChange={() => handleToggleExposedResource(selectedExposedServer.id, ag.id, "agent")}
                            style={{ width: "auto", cursor: "pointer" }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Claude Desktop Helper Card */}
              <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-primary)" }} />
                  {t("claudeConfigTitle")}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.45 }}>
                  {t("claudeConfigDesc")}
                </p>

                <div style={{ position: "relative", marginTop: "0.5rem" }}>
                  <pre
                    className="code-block"
                    style={{
                      margin: 0,
                      fontSize: "0.72rem",
                      lineHeight: "1.35",
                      maxHeight: "180px",
                      overflowY: "auto",
                      padding: "0.75rem",
                      background: "#080808",
                      border: "1px solid var(--border-color)",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    {getClaudeConfigSnippet(selectedExposedServer)}
                  </pre>
                  <button
                    onClick={() => { copyToClipboard(getClaudeConfigSnippet(selectedExposedServer)); }}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "var(--bg-surface-solid)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                      padding: "0.35rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Copy snippet"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              {/* Live Request Logs */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h4 style={{ margin: "0 0 0.85rem", fontSize: "0.95rem", fontWeight: 700 }}>{t("liveLogs")}</h4>
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table" style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                        <th style={{ padding: "0.5rem 0.4rem", color: "var(--text-muted)" }}>{t("logTime")}</th>
                        <th style={{ padding: "0.5rem 0.4rem", color: "var(--text-muted)" }}>{t("logRequest")}</th>
                        <th style={{ padding: "0.5rem 0.4rem", color: "var(--text-muted)" }}>{t("logClient")}</th>
                        <th style={{ padding: "0.5rem 0.4rem", color: "var(--text-muted)", textAlign: "right" }}>{t("logLatency")}</th>
                        <th style={{ padding: "0.5rem 0.4rem", color: "var(--text-muted)", textAlign: "center" }}>{t("logStatus")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedExposedServer.logs || []).map((log: any, index: number) => (
                        <tr key={index} className="animate-fade-in" style={{ borderBottom: "1px solid var(--border-color-glow)" }}>
                          <td style={{ padding: "0.55rem 0.4rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.72rem" }}>{log.time}</td>
                          <td style={{ padding: "0.55rem 0.4rem", fontWeight: 600, color: "var(--text-primary)" }}>{log.request}</td>
                          <td style={{ padding: "0.55rem 0.4rem", color: "var(--text-secondary)" }}>{log.client}</td>
                          <td style={{ padding: "0.55rem 0.4rem", textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{log.latency}ms</td>
                          <td style={{ padding: "0.55rem 0.4rem", textAlign: "center" }}>
                            <span className={`badge ${log.status === 200 ? "badge-success" : "badge-danger"}`} style={{ padding: "0.15rem 0.35rem", fontSize: "0.62rem" }}>
                              {log.status === 200 ? "200" : "500"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(selectedExposedServer.logs || []).length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                            {language === "es" ? "No hay registros de consultas todavía." : "No request logs recorded yet."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                <Button
                  variant="secondary"
                  onClick={() => handleDeleteExposedServer(selectedExposedServer.id)}
                  className="w-full justify-center !text-red-500 hover:!bg-red-500/10 hover:!text-red-500 border border-red-500/20"
                >
                  <Trash2 size={14} />
                  {language === "es" ? "Desactivar y Eliminar Servidor" : "Deactivate & Remove Server"}
                </Button>
              </div>
            </div>
          )}
      </SlideOver>

      {/* WIZARD DRAWER (INGEST MCP SERVER CLIENT) */}
      <SlideOver
        isOpen={wizardOpen}
        onClose={() => !wizardConnecting && setWizardOpen(false)}
        title={
          wizardStep === 1 ? t("wizardTransport") :
          wizardStep === 2 ? t("wizardConfigTitle") :
          wizardStep === 3 ? t("wizardDiscoveryTitle") :
          t("successTitle")
        }
        description={
          wizardStep === 1 ? t("wizardTransportDesc") :
          wizardStep === 2 ? t("wizardConfigDesc") :
          wizardStep === 3 ? t("wizardDiscoveryDesc") :
          t("successDesc")
        }
        maxWidth="480px"
        footer={
          wizardStep < 4 ? (
            <div className="flex justify-between items-center w-full">
              {wizardStep > 1 ? (
                <Button
                  variant="secondary"
                  disabled={wizardConnecting}
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="!py-2 !px-4 !text-xs"
                >
                  Back
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setWizardOpen(false)}
                  className="!py-2 !px-4 !text-xs"
                >
                  Cancel
                </Button>
              )}

              {wizardStep === 2 && (
                <Button
                  type="submit"
                  form="mcp-wizard-form"
                  variant="primary"
                  disabled={wizardConnecting}
                  className="min-w-[120px] flex items-center gap-1.5 justify-center !py-2 !px-4 !text-xs"
                >
                  {wizardConnecting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <span>Verify & Query</span>
                  )}
                </Button>
              )}

              {wizardStep === 3 && (
                <Button
                  onClick={handleIngestSubmit}
                  variant="primary"
                  className="min-w-[120px] flex items-center gap-1.5 justify-center !py-2 !px-4 !text-xs"
                >
                  <span>Ingest Tools</span>
                </Button>
              )}
            </div>
          ) : undefined
        }
      >
              
              {/* STEP 1: Select connection transport mode */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {t("wizardTransportDesc")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button
                      onClick={() => handleSelectType("stdio")}
                      className="glass-panel glass-panel-interactive"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        padding: "1.15rem",
                        cursor: "pointer",
                        background: "var(--bg-surface)",
                        width: "100%",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                        <Terminal size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 0.15rem", fontSize: "0.9rem", color: "var(--text-primary)" }}>{t("stdioTrans")}</h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                          Execute command line scripts locally (e.g. SQLite, GitHub, Python packages).
                        </p>
                      </div>
                      <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
                    </button>

                    <button
                      onClick={() => handleSelectType("sse")}
                      className="glass-panel glass-panel-interactive"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                        padding: "1.15rem",
                        cursor: "pointer",
                        background: "var(--bg-surface)",
                        width: "100%",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)" }}>
                        <Globe size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 0.15rem", fontSize: "0.9rem", color: "var(--text-primary)" }}>{t("sseTrans")}</h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                          Stream events from a remote host endpoint (SSE) with API Authentication keys.
                        </p>
                      </div>
                      <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Configure Transport Details */}
              {wizardStep === 2 && (
                <form id="mcp-wizard-form" onSubmit={handleConfigureSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {t("wizardConfigDesc")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Connection Display Name</label>
                    <input
                      type="text"
                      required
                      value={wizardConfig.name}
                      onChange={e => setWizardConfig(prev => ({ ...prev, name: e.target.value }))}
                      style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                    />
                  </div>

                  {wizardType === "stdio" ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Command Executable</label>
                        <input
                          type="text"
                          required
                          value={wizardConfig.command}
                          onChange={e => setWizardConfig(prev => ({ ...prev, command: e.target.value }))}
                          style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", fontFamily: "var(--font-mono)" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Arguments (separated by space)</label>
                        <input
                          type="text"
                          placeholder="e.g. -y @modelcontextprotocol/server-sqlite --db local.db"
                          value={wizardConfig.args}
                          onChange={e => setWizardConfig(prev => ({ ...prev, args: e.target.value }))}
                          style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", fontFamily: "var(--font-mono)" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Environment Variables (key=value, separated by commas)</label>
                        <input
                          type="text"
                          placeholder="e.g. GITHUB_TOKEN=ghp_xxx, DB_PATH=/var/db"
                          value={wizardConfig.env}
                          onChange={e => setWizardConfig(prev => ({ ...prev, env: e.target.value }))}
                          style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", fontFamily: "var(--font-mono)" }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Server SSE Gateway URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://api.external.com/mcp/sse"
                          value={wizardConfig.url}
                          onChange={e => setWizardConfig(prev => ({ ...prev, url: e.target.value }))}
                          style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", fontFamily: "var(--font-mono)" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>Authorization Header / Meta Parameters</label>
                        <input
                          type="text"
                          placeholder="e.g. Authorization: Bearer token_xxxx"
                          value={wizardConfig.headers}
                          onChange={e => setWizardConfig(prev => ({ ...prev, headers: e.target.value }))}
                          style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", fontFamily: "var(--font-mono)" }}
                        />
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* STEP 3: Discovery and tool mapping */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {t("wizardDiscoveryDesc")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {discoveredTools.map((tool, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleDiscoveredTool(idx)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          padding: "0.75rem 0.85rem",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          background: tool.enabled ? "var(--bg-surface-hover)" : "transparent",
                          cursor: "pointer",
                          gap: "0.75rem"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!tool.enabled}
                          onChange={() => {}} // handled by click on parent
                          style={{ width: "auto", cursor: "pointer", marginTop: "0.2rem" }}
                        />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: tool.enabled ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {tool.name}
                          </span>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "0.15rem 0 0 0" }}>{tool.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Success confirmation */}
              {wizardStep === 4 && (
                <div className="animate-fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", width: "75px", height: "75px", borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "var(--color-success)", boxShadow: "0 0 24px rgba(16, 185, 129, 0.15)" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>{t("successTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.5rem", maxWidth: "340px", marginInline: "auto", lineHeight: 1.45 }}>
                    {t("successDesc")}
                  </p>

                  <div style={{ padding: "1.1rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Name</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{wizardConfig.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Transport</span>
                      <span className="badge badge-info">{wizardType === "stdio" ? "STDIO" : "SSE"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Mapped Habilities</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>
                        {discoveredTools.filter(t => t.enabled).length} tools
                      </span>
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={() => setWizardOpen(false)} style={{ width: "100%", padding: "0.8rem" }}>
                    Done
                  </button>
                </div>
              )}
      </SlideOver>

      {/* WIZARD DRAWER (EXPOSE MCP HOST SERVER) */}
      <SlideOver
        isOpen={exposedWizardOpen}
        onClose={() => !exposedWizardSaving && setExposedWizardOpen(false)}
        title={
          exposedWizardStep === 1 ? (language === "es" ? "Exponer Recursos de Plataforma" : "Expose Platform Resources") :
          exposedWizardStep === 2 ? (language === "es" ? "Exponer Recursos (Detalle)" : "Expose Resources (Details)") :
          (language === "es" ? "Configuración Creada con Éxito" : "Host Setup Created Successfully")
        }
        description={
          exposedWizardStep === 1 ? (language === "es" ? "Paso 1 de 2: Nombre y detalles" : "Step 1 of 2: Name and metadata") :
          exposedWizardStep === 2 ? (language === "es" ? "Paso 2 de 2: Permisos de acceso" : "Step 2 of 2: Access permissions") :
          (language === "es" ? "El Host MCP está activo y expuesto" : "Exposed MCP Host is live")
        }
        maxWidth="480px"
        footer={
          exposedWizardStep < 3 ? (
            <div className="flex justify-between items-center w-full">
              {exposedWizardStep > 1 ? (
                <Button
                  variant="secondary"
                  disabled={exposedWizardSaving}
                  onClick={() => setExposedWizardStep(prev => prev - 1)}
                  className="!py-2 !px-4 !text-xs"
                >
                  Back
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setExposedWizardOpen(false)}
                  className="!py-2 !px-4 !text-xs"
                >
                  Cancel
                </Button>
              )}

              {exposedWizardStep === 1 && (
                <Button
                  type="submit"
                  form="mcp-exposed-wizard-form"
                  variant="primary"
                  className="!py-2 !px-4 !text-xs min-w-[100px]"
                >
                  Next
                </Button>
              )}

              {exposedWizardStep === 2 && (
                <Button
                  onClick={handleCreateExposedServerSubmit}
                  variant="primary"
                  disabled={exposedWizardSaving}
                  className="min-w-[120px] flex items-center gap-1.5 justify-center !py-2 !px-4 !text-xs"
                >
                  {exposedWizardSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Expose Server</span>
                  )}
                </Button>
              )}
            </div>
          ) : undefined
        }
      >
              
              {/* STEP 1: Basic setup */}
              {exposedWizardStep === 1 && (
                <form id="mcp-exposed-wizard-form" onSubmit={handleExposedStep1Submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {language === "es" 
                      ? "Ingresá un nombre y una descripción para el nuevo servidor de exposición MCP. Se auto-generará un Endpoint SSE seguro y una clave de API." 
                      : "Enter a name and description for your new exposed MCP server. A secure SSE endpoint and key will be automatically created."}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
                      {language === "es" ? "Nombre del Servidor" : "Server Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ERP Inventory Server"
                      value={exposedWizardConfig.name}
                      onChange={e => setExposedWizardConfig(prev => ({ ...prev, name: e.target.value }))}
                      style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
                      {language === "es" ? "Descripción" : "Description"}
                    </label>
                    <textarea
                      placeholder="e.g. Exposes database tables and custom inventory skills."
                      value={exposedWizardConfig.description}
                      onChange={e => setExposedWizardConfig(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      style={{ padding: "0.7rem 0.85rem", fontSize: "0.88rem", background: "var(--bg-surface-hover)", resize: "none" }}
                    />
                  </div>
                </form>
              )}

              {/* STEP 2: Choose Resources */}
              {exposedWizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {language === "es" 
                      ? "Seleccioná qué fuentes de datos, habilidades y agentes de la plataforma querés exponer en este servidor." 
                      : "Select which data connections, custom skills, and agents you want to expose through this gateway."}
                  </p>

                  {/* Data Sources */}
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem" }}>
                      {t("exposeDataSources")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {mockConnections.map((conn: any) => {
                        const isChecked = exposedWizardConfig.exposedDataSources.includes(conn.id);
                        return (
                          <label
                            key={conn.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.55rem 0.75rem",
                              background: isChecked ? "var(--bg-surface-hover)" : "transparent",
                              border: "1px solid var(--border-color)",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.82rem"
                            }}
                          >
                            <span style={{ fontWeight: 600, color: isChecked ? "var(--text-primary)" : "var(--text-muted)" }}>
                              {conn.name}
                            </span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWizardResource(conn.id, "datasource")}
                              style={{ width: "auto", cursor: "pointer" }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem" }}>
                      {t("exposeSkills")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {skills.map((sk: any) => {
                        const isChecked = exposedWizardConfig.exposedSkills.includes(sk.id);
                        return (
                          <label
                            key={sk.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.55rem 0.75rem",
                              background: isChecked ? "var(--bg-surface-hover)" : "transparent",
                              border: "1px solid var(--border-color)",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.82rem"
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: isChecked ? "var(--text-primary)" : "var(--text-muted)", display: "block" }}>
                                {sk.name}
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{sk.description}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWizardResource(sk.id, "skill")}
                              style={{ width: "auto", cursor: "pointer" }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Agents */}
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.3rem", marginBottom: "0.6rem" }}>
                      {t("exposeAgents")}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {agents.map((ag: any) => {
                        const isChecked = exposedWizardConfig.exposedAgents.includes(ag.id);
                        return (
                          <label
                            key={ag.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.55rem 0.75rem",
                              background: isChecked ? "var(--bg-surface-hover)" : "transparent",
                              border: "1px solid var(--border-color)",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              fontSize: "0.82rem"
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: isChecked ? "var(--text-primary)" : "var(--text-muted)", display: "block" }}>
                                {ag.name}
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ag.role}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWizardResource(ag.id, "agent")}
                              style={{ width: "auto", cursor: "pointer" }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: Success Result */}
              {exposedWizardStep === 3 && newExposedServerResult && (
                <div className="animate-fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", width: "75px", height: "75px", borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: "var(--color-success)", boxShadow: "0 0 24px rgba(16, 185, 129, 0.15)" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>
                    {language === "es" ? "Servidor Expuesto Exitosamente" : "Host Gateway Active"}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 1.5rem", maxWidth: "340px", marginInline: "auto", lineHeight: 1.45 }}>
                    {language === "es" 
                      ? "La pasarela host está lista para recibir consultas. Copiá las credenciales para configurar tu aplicación." 
                      : "The host gateway is live and ready. Copy the setup details to connect Claude Desktop or other client apps."}
                  </p>

                  <div style={{ padding: "1.1rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", textAlign: "left", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>SSE Endpoint</span>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
                        <input
                          type="text"
                          readOnly
                          value={newExposedServerResult.url}
                          style={{ flex: 1, padding: "0.45rem 0.6rem", fontSize: "0.78rem", background: "var(--bg-surface-solid)", fontFamily: "var(--font-mono)" }}
                        />
                        <button className="btn btn-secondary" onClick={() => copyToClipboard(newExposedServerResult.url)} style={{ padding: "0.45rem" }}>
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Secret API Key</span>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
                        <input
                          type="password"
                          readOnly
                          value={newExposedServerResult.apiKey}
                          style={{ flex: 1, padding: "0.45rem 0.6rem", fontSize: "0.78rem", background: "var(--bg-surface-solid)", fontFamily: "var(--font-mono)" }}
                        />
                        <button className="btn btn-secondary" onClick={() => copyToClipboard(newExposedServerResult.apiKey)} style={{ padding: "0.45rem" }}>
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={() => setExposedWizardOpen(false)} style={{ width: "100%", padding: "0.8rem" }}>
                    Done
                  </button>
                </div>
              )}
      </SlideOver>
    </>
  );
};
