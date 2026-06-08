import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import {
  Upload,
  Database,
  Search,
  Sparkles,
  RefreshCw,
  HardDrive,
  Cloud,
  Server,
  Landmark,
  Building2,
  Receipt,
  X,
  CheckCircle2,
} from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";

interface DataConnectionsTabProps {
  language: "en" | "es";
  csvContent: string;
  fileName: string;
  loading: boolean;
  parsedData: any;
  previewRows: any[];
  analysisError: string;
  wizardOpen: boolean;
  setWizardOpen: (open: boolean) => void;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  wizardSourceType: string;
  setWizardSourceType: (type: string) => void;
  wizardConfig: Record<string, string>;
  setWizardConfig: (config: any) => void;
  wizardConnecting: boolean;
  setWizardConnecting: (connecting: boolean) => void;
  mockConnections: any[];
  setMockConnections: (conns: any) => void;
  loadSampleCSV: (url: string, name: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setActiveTab: (tab: any) => void;
}



export const DataConnectionsTab: React.FC = () => {
  const { language,
  csvContent,
  fileName,
  loading,
  parsedData,
  previewRows,
  analysisError,
  wizardOpen,
  setWizardOpen,
  wizardStep,
  setWizardStep,
  wizardSourceType,
  setWizardSourceType,
  wizardConfig,
  setWizardConfig,
  wizardConnecting,
  setWizardConnecting,
  mockConnections,
  setMockConnections,
  loadSampleCSV,
  handleFileUpload,
  setActiveTab, } = useDashboard();
  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  const sourceCategories = [
    { id: "files",      label: language === "es" ? "Archivos" : "Files",                   icon: <HardDrive size={20} />, color: "var(--color-primary)",
      sources: [
        { id:"excel", label:"Excel / CSV", desc:".xlsx, .csv, .xls" },
        { id:"json_txt", label: language==="es"?"JSON / Texto":"JSON / Text", desc:".json, .txt, .xml" }
      ]
    },
    { id: "cloud",      label: "Cloud Storage",                                             icon: <Cloud size={20} />,     color: "var(--color-accent)",
      sources: [
        { id:"gdrive", label:"Google Drive", desc:"Sheets, Docs" },
        { id:"onedrive", label:"OneDrive", desc:"Excel, SharePoint" },
        { id:"dropbox", label:"Dropbox", desc:"" }
      ]
    },
    { id: "database",   label: language === "es" ? "Bases de Datos" : "Databases",          icon: <Server size={20} />,    color: "#8b5cf6",
      sources: [
        { id:"postgres", label:"PostgreSQL", desc:"" },
        { id:"mysql", label:"MySQL / MariaDB", desc:"" },
        { id:"sqlserver", label:"SQL Server", desc:"" },
        { id:"gsheets", label:"Google Sheets API", desc:"" }
      ]
    },
    { id: "business_apps", label: language === "es" ? "Software Empresarial" : "Business Software", icon: <Landmark size={20} />, color: "var(--color-warning)",
      sources: [
        { id:"salesforce", label:"Salesforce", desc:"CRM" },
        { id:"hubspot", label:"HubSpot", desc:"CRM & Sales" },
        { id:"zoho", label:"Zoho CRM", desc:"" },
        { id:"odoo", label:"Odoo ERP", desc:"All-in-one" }
      ]
    },
    { id: "financials", label: language === "es" ? "Pasarelas Financieras" : "Financial APIs",    icon: <Building2 size={20} />, color: "var(--color-success)",
      sources: [
        { id:"stripe", label:"Stripe", desc:"Payments API" },
        { id:"paypal", label:"PayPal", desc:"Merchant API" },
        { id:"plaid", label:"Plaid", desc:"Open Banking API" }
      ]
    },
    { id: "communications", label: language === "es" ? "Comunicaciones" : "Communications",       icon: <Receipt size={20} />,   color: "#f43f5e",
      sources: [
        { id:"slack", label:"Slack API", desc:"Channels & Chat" },
        { id:"discord", label:"Discord API", desc:"" },
        { id:"teams", label:"MS Teams API", desc:"" }
      ]
    },
  ];

  const wizardFields: Record<string, {label:string,key:string,type?:string,placeholder?:string}[]> = {
    excel:      [{ label:language==="es"?"Archivo":"File", key:"file", type:"file" }],
    json_txt:   [{ label:language==="es"?"Archivo JSON o Texto":"JSON or Text file", key:"file", type:"file" }],
    gdrive:     [{ label:"Folder ID o URL", key:"folder", placeholder:"https://drive.google.com/drive/folders/..." }, { label:language==="es"?"Cuenta Google":"Google Account", key:"email", placeholder:"empresa@gmail.com" }],
    onedrive:   [{ label:"SharePoint URL", key:"url", placeholder:"https://empresa.sharepoint.com/..." }],
    dropbox:    [{ label:"Access Token", key:"token", type:"password", placeholder:"sl.B..." }],
    postgres:   [{ label:"Host", key:"host", placeholder:"localhost" }, { label:language==="es"?"Puerto":"Port", key:"port", placeholder:"5432" }, { label:language==="es"?"Base de datos":"Database", key:"db", placeholder:"ventas" }, { label:language==="es"?"Usuario":"User", key:"user", placeholder:"admin" }, { label:language==="es"?"Contraseña":"Password", key:"pass", type:"password", placeholder:"••••••••" }],
    mysql:      [{ label:"Host", key:"host", placeholder:"localhost" }, { label:language==="es"?"Puerto":"Port", key:"port", placeholder:"3306" }, { label:language==="es"?"Base de datos":"Database", key:"db", placeholder:"ventas" }, { label:language==="es"?"Usuario":"User", key:"user", placeholder:"admin" }, { label:language==="es"?"Contraseña":"Password", key:"pass", type:"password", placeholder:"••••••••" }],
    sqlserver:  [{ label:"Server", key:"host", placeholder:"SERVIDOR\\INSTANCIA" }, { label:language==="es"?"Base de datos":"Database", key:"db", placeholder:"Ventas" }, { label:language==="es"?"Usuario":"User", key:"user", placeholder:"sa" }, { label:language==="es"?"Contraseña":"Password", key:"pass", type:"password", placeholder:"••••••••" }],
    gsheets:    [{ label:"Spreadsheet ID", key:"id", placeholder:"1BxiMVs0XRA5..." }, { label:"Service Account JSON", key:"sa", type:"password", placeholder:"{ ... }" }],
    salesforce: [{ label:"Client ID", key:"clientId", placeholder:"XXXXXXXX-XXXX-..." }, { label:"Client Secret", key:"secret", type:"password" }],
    hubspot:    [{ label:"Access Token", key:"token", type:"password", placeholder:"pat-na1-..." }],
    zoho:       [{ label:"Client ID", key:"clientId" }, { label:"Client Secret", key:"secret", type:"password" }],
    odoo:       [{ label:"URL", key:"url", placeholder:"https://miempresa.odoo.com" }, { label:language==="es"?"Base de datos":"Database", key:"db" }, { label:language==="es"?"Usuario":"User", key:"user" }, { label:"API Key", key:"key", type:"password" }],
    stripe:     [{ label:"Secret Key", key:"key", type:"password", placeholder:"sk_live_..." }],
    paypal:     [{ label:"Client ID", key:"clientId" }, { label:"Client Secret", key:"secret", type:"password" }],
    plaid:      [{ label:"Plaid Client ID", key:"clientId" }, { label:"Secret Key", key:"secret", type:"password" }],
    slack:      [{ label:"Bot User OAuth Token", key:"token", type:"password", placeholder:"xoxb-..." }],
    discord:    [{ label:"Bot Token", key:"token", type:"password", placeholder:"OD..." }],
    teams:      [{ label:"Tenant ID", key:"tenantId" }, { label:"Client ID", key:"clientId" }],
  };

  const selectedSource = sourceCategories
    .flatMap(c => c.sources.map(s => ({ ...s, catColor: c.color, catLabel: c.label })))
    .find(s => s.id === wizardSourceType);
  const wizardFormFields = wizardFields[wizardSourceType] ?? [];

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardConnecting(true);
    setTimeout(() => {
      setWizardConnecting(false);
      setWizardStep(3);
      if (selectedSource) {
        const isFile = wizardSourceType === "excel" || wizardSourceType === "json_txt";
        const newConn = {
          id: "conn-" + Math.random().toString(36).substr(2, 9),
          name: isFile ? "Upload: " + (wizardConfig.file || "data.csv") : selectedSource.label + " Sync",
          category: selectedSource.catLabel,
          status: "connected" as const,
          lastSync: language === "es" ? "Hace 1 min" : "1 min ago",
          records: isFile ? "150 filas" : "Sincronizado"
        };
        setMockConnections((prev: any[]) => [newConn, ...prev]);
      }
    }, 1800);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Tab Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("dataTitle")}</h2>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>{language === "es" ? "Conectá tus fuentes de datos para que los agentes puedan operar sobre tu información de negocio." : "Connect your data sources so agents can operate on your business data."}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); setWizardOpen(true); }} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>+</span>
          <span>{language === "es" ? "Nueva Conexión" : "New Connection"}</span>
        </button>
      </div>

      {/* Main Grid: Upload Area & Schema Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Left: Drag & Drop upload or mock files */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
            <div className="flex-center" style={{ border: "2px dashed var(--border-color)", borderRadius: "var(--radius-md)", padding: "2.5rem 1.5rem", flexDirection: "column", cursor: "pointer", background: "rgba(255,255,255,0.01)" }}>
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
              <Upload size={36} style={{ color: "var(--color-primary)", marginBottom: "0.85rem", opacity: 0.8 }} />
              <p style={{ fontWeight: 700, margin: "0 0 0.3rem 0", fontSize: "0.92rem", color: "var(--text-primary)" }}>{t("uploadDragDrop")}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{t("uploadNote")}</p>
            </div>

            {/* Loading/Parsing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", color: "var(--color-primary)", fontSize: "0.85rem", justifyContent: "center" }}>
                <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                <span>{t("analyzingMessage")}</span>
              </div>
            )}
            
            {analysisError && (
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-sm)", color: "var(--color-danger)", fontSize: "0.82rem", textAlign: "center" }}>
                {analysisError}
              </div>
            )}
          </div>

          {/* Active connections list */}
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "0.95rem", fontWeight: 700 }}>{language === "es" ? "Conexiones Activas" : "Active Connections"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {mockConnections.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0.85rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.status === "connected" ? "var(--color-success)" : "var(--color-danger)" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.category} • {language === "es" ? "Sincronizado:" : "Synced:"} {c.lastSync}</div>
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{c.records}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Load Sample Options */}
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "0.95rem" }}>{t("demoTitle")}</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>{t("demoSubtitle")}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <button onClick={() => loadSampleCSV("/samples/customers_sales.csv", "customers_sales.csv")} className="glass-panel glass-panel-interactive" style={{ textAlign: "left", padding: "0.85rem 1rem", border: "1px solid var(--border-color)", cursor: "pointer", background: "rgba(255,255,255,0.01)" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.15rem", color: "var(--text-primary)" }}>{t("demoCustomers")}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.35, display: "block" }}>{t("demoCustomersDesc")}</span>
              </button>

              <button onClick={() => loadSampleCSV("/samples/product_inventory.csv", "product_inventory.csv")} className="glass-panel glass-panel-interactive" style={{ textAlign: "left", padding: "0.85rem 1rem", border: "1px solid var(--border-color)", cursor: "pointer", background: "rgba(255,255,255,0.01)" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.15rem", color: "var(--text-primary)" }}>{t("demoInventory")}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.35, display: "block" }}>{t("demoInventoryDesc")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Schema description and tokens optimization */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {parsedData ? (
            <>
              {/* Schema Details */}
              <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <h3 style={{ margin: 0, fontSize: "0.95rem" }}>{t("schemaTitle")}</h3>
                  <span className="badge badge-success" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    {t("rowsDetected").replace("{rows}", String(parsedData.totalRows))}
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>{t("schemaSubtitle")}</p>

                {/* Table list */}
                <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "var(--bg-surface-solid)", borderBottom: "1px solid var(--border-color)" }}>
                        <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)" }}>{t("schemaHeaderField")}</th>
                        <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)" }}>{t("schemaHeaderType")}</th>
                        <th style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)" }}>{t("schemaHeaderSamples")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.columns.map((col: any, index: number) => (
                        <tr key={index} style={{ borderBottom: index < parsedData.columns.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                          <td style={{ padding: "0.45rem 0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-primary)" }}>{col.name}</td>
                          <td style={{ padding: "0.45rem 0.75rem" }}>
                            <span className="badge badge-info" style={{ fontSize: "0.62rem", textTransform: "uppercase" }}>{col.type}</span>
                          </td>
                          <td style={{ padding: "0.45rem 0.75rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{col.samples?.join(", ") || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CSV Preview */}
              {previewRows.length > 0 && (
                <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
                  <h3 style={{ margin: "0 0 0.35rem", fontSize: "0.95rem" }}>{t("previewTitle")}</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 1rem 0" }}>{t("previewSubtitle")}</p>

                  <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "var(--bg-surface-solid)", borderBottom: "1px solid var(--border-color)" }}>
                          {Object.keys(previewRows[0]).map((h, i) => (
                            <th key={i} style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: rIdx < previewRows.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                            {Object.keys(previewRows[0]).map((h, cIdx) => (
                              <td key={cIdx} style={{ padding: "0.45rem 0.75rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{String(row[h])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setActiveTab("playground")} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>{t("openPlaygroundBtn")}</span>
                  <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
              <Database size={36} style={{ color: "var(--color-primary)", marginBottom: "1rem", opacity: 0.35 }} />
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, maxWidth: "280px", lineHeight: 1.5 }}>
                {t("noDataMessage")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CONNECTION WIZARD MODAL */}
      {wizardOpen && (
        <div className="modal-overlay flex-center">
          <div className="glass-panel animate-scale-up" style={{ width: "100%", maxWidth: "600px", padding: "1.75rem", position: "relative", border: "1px solid var(--border-color-glow)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
                  {wizardStep === 1 && (language === "es" ? "Seleccione Origen de Datos" : "Select Data Source")}
                  {wizardStep === 2 && (language === "es" ? `Conectar ${selectedSource?.label}` : `Connect ${selectedSource?.label}`)}
                  {wizardStep === 3 && (language === "es" ? "Conectado Correctamente" : "Connection Complete")}
                </h3>
                {wizardStep === 1 && (
                  <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {language === "es" ? "Selecciona el origen para autogenerar su servidor MCP." : "Select the source to generate its MCP server."}
                  </p>
                )}
              </div>
              <button onClick={() => setWizardOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                <X size={18} />
              </button>
            </div>

            {/* STEP 1: Categories List */}
            {wizardStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxHeight: "420px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {sourceCategories.map((cat, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: cat.color, marginBottom: "0.5rem" }}>
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      {cat.sources.map((src, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setWizardSourceType(src.id);
                            setWizardStep(2);
                          }}
                          className="glass-panel glass-panel-interactive"
                          style={{
                            textAlign: "left",
                            padding: "0.75rem 1rem",
                            cursor: "pointer",
                            border: "1px solid var(--border-color)",
                            background: "rgba(255,255,255,0.01)"
                          }}
                        >
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", color: "var(--text-primary)" }}>{src.label}</span>
                          {src.desc && (
                            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.1rem", display: "block" }}>{src.desc}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2: Configure Fields */}
            {wizardStep === 2 && (
              <form onSubmit={handleWizardSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: selectedSource?.catColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                    {selectedSource?.label.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>{selectedSource?.label}</h4>
                    <span className="badge badge-info" style={{ fontSize: "0.62rem" }}>{selectedSource?.catLabel}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {wizardFormFields.map((field, fIdx) => (
                    <div key={fIdx} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>{field.label}</label>
                      {field.type === "file" ? (
                        <div style={{ border: "1px dashed var(--border-color)", borderRadius: "var(--radius-sm)", padding: "1.25rem", textAlign: "center", cursor: "pointer", position: "relative" }}>
                          <input
                            type="file"
                            onChange={e => {
                              const name = e.target.files?.[0]?.name || "dataset.csv";
                              setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: name }));
                            }}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                          />
                          <Upload size={20} style={{ margin: "0 auto 0.4rem", display: "block", color: "var(--color-primary)", opacity: 0.8 }} />
                          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                            {wizardConfig[field.key] || (language === "es" ? "Subir archivo" : "Upload file")}
                          </span>
                        </div>
                      ) : (
                        <input
                          type={field.type || "text"}
                          placeholder={field.placeholder || ""}
                          value={wizardConfig[field.key] || ""}
                          required
                          onChange={e => setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: e.target.value }))}
                          style={{ padding: "0.5rem 0.75rem", fontSize: "0.82rem" }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end", marginTop: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                  <button type="button" className="btn btn-secondary" disabled={wizardConnecting} onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); }}>
                    {language === "es" ? "Atrás" : "Back"}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={wizardConnecting} style={{ minWidth: "100px", display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center" }}>
                    {wizardConnecting ? (
                      <>
                        <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />
                        <span>{language === "es" ? "Conectando..." : "Connecting..."}</span>
                      </>
                    ) : (
                      <span>{language === "es" ? "Conectar" : "Connect"}</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Complete screen */}
            {wizardStep === 3 && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", width: "56px", height: "56px", borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: "var(--color-success)" }}>
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ margin: "0 0 0.5rem" }}>{language === "es" ? "¡Conexión exitosa!" : "Connection successful!"}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: "0 0 0.4rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{selectedSource?.label}</strong> {language === "es" ? "está lista para usarse con los agentes de la plataforma." : "is ready to use with platform agents."}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1.75rem" }}>
                  {language === "es" ? "Los datos estarán disponibles para la capa agéntica y los flujos activos." : "Data will be available for the agentic layer and active workflows."}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button className="btn btn-secondary" onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); }}>
                    {language === "es" ? "Conectar Otro" : "Connect Another"}
                  </button>
                  <button className="btn btn-primary" onClick={() => { setWizardOpen(false); }}>
                    {language === "es" ? "Ir al Dashboard" : "Go to Dashboard"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
