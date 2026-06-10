import { useDashboard } from "../../../context/DashboardContext";
import React, { useState } from "react";
import { Terminal, Globe, Plus, Trash2, X, RefreshCw, CheckCircle2, ArrowRight, Server } from "lucide-react";
import { Button } from "../../ui/Button";
import { SlideOver } from "../../ui/SlideOver";
import { Input, Select } from "../../ui/Input";
import { Heading } from "../../ui/Heading";
import { McpServer, McpTool } from "./McpTypes";
import { MCP_DICTIONARY } from "./McpDictionary";

export const McpClientSection: React.FC = () => {
  const {
    language,
    mcpServers,
    setMcpServers,
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

  return (
    <>
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
          <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-surface-solid)", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Server size={42} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)" }}>{t("noServers")}</p>
          </div>
        )}
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

      {/* WIZARD DRAWER: CONNECT NEW MCP SERVER */}
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
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
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
    </>
  );
};
