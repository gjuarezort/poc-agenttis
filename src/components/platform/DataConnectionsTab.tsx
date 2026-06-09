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
  Lock,
  Link as LinkIcon,
  Plus,
  Settings,
  MoreVertical
} from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";

export const DataConnectionsTab: React.FC = () => {
  const { 
    language,
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
    setActiveTab,
    setHeaderAction,
  } = useDashboard();
  
  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  React.useEffect(() => {
    setHeaderAction(
      <button 
        className="btn btn-primary" 
        onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); setWizardOpen(true); }}
        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
      >
        <Plus size={16} />
        {language === "es" ? "Nueva Fuente de Datos" : "New Data Source"}
      </button>
    );
    return () => setHeaderAction(null);
  }, [language, setHeaderAction, setWizardStep, setWizardSourceType, setWizardConfig, setWizardOpen]);

  const sourceCategories = [
    { id: "files",      label: language === "es" ? "Archivos" : "Files",                   icon: <HardDrive size={18} />, color: "var(--text-secondary)",
      sources: [
        { id:"excel", label:"Excel / CSV", desc:".xlsx, .csv, .xls" },
        { id:"json_txt", label: language==="es"?"JSON / Texto":"JSON / Text", desc:".json, .txt, .xml" }
      ]
    },
    { id: "database",   label: language === "es" ? "Bases de Datos" : "Databases",          icon: <Server size={18} />,    color: "var(--text-secondary)",
      sources: [
        { id:"postgres", label:"PostgreSQL", desc:"Relational DB" },
        { id:"mysql", label:"MySQL / MariaDB", desc:"Relational DB" },
        { id:"sqlserver", label:"SQL Server", desc:"Enterprise DB" },
        { id:"gsheets", label:"Google Sheets", desc:"Spreadsheets API" }
      ]
    },
    { id: "business_apps", label: language === "es" ? "Software Empresarial" : "Business Software", icon: <Landmark size={18} />, color: "var(--text-secondary)",
      sources: [
        { id:"salesforce", label:"Salesforce", desc:"CRM & Sales" },
        { id:"hubspot", label:"HubSpot", desc:"Marketing & CRM" },
        { id:"zoho", label:"Zoho CRM", desc:"Suite" },
        { id:"odoo", label:"Odoo ERP", desc:"All-in-one Management" }
      ]
    },
    { id: "cloud",      label: "Cloud Storage",                                             icon: <Cloud size={18} />,     color: "var(--text-secondary)",
      sources: [
        { id:"gdrive", label:"Google Drive", desc:"Cloud Docs" },
        { id:"onedrive", label:"OneDrive", desc:"Microsoft Cloud" },
        { id:"dropbox", label:"Dropbox", desc:"File Hosting" }
      ]
    },
    { id: "financials", label: language === "es" ? "Pasarelas Financieras" : "Financial APIs",    icon: <Building2 size={18} />, color: "var(--text-secondary)",
      sources: [
        { id:"stripe", label:"Stripe", desc:"Payments Infrastructure" },
        { id:"paypal", label:"PayPal", desc:"Merchant API" },
        { id:"plaid", label:"Plaid", desc:"Open Banking API" }
      ]
    },
    { id: "communications", label: language === "es" ? "Comunicaciones" : "Communications",       icon: <Receipt size={18} />,   color: "var(--text-secondary)",
      sources: [
        { id:"slack", label:"Slack API", desc:"Channels & Chat" },
        { id:"discord", label:"Discord API", desc:"Communities" },
        { id:"teams", label:"MS Teams", desc:"Enterprise Chat" }
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
    .flatMap(c => c.sources.map(s => ({ ...s, catColor: c.color, catLabel: c.label, catIcon: c.icon })))
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
          sourceId: selectedSource.id,
          category: selectedSource.catLabel,
          status: "connected" as const,
          lastSync: language === "es" ? "Hace 1 min" : "1 min ago",
          records: isFile ? "150 filas" : "Syncing..."
        };
        setMockConnections((prev: any[]) => [newConn, ...prev]);
      }
    }, 1500);
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "2rem" }}>

        {/* Main Grid: Only showing ACTIVE data sources */}
      {mockConnections.length > 0 ? (
        <div className="marketplace-grid">
          {mockConnections.map((c, i) => (
            <div 
              key={i} 
              className="glass-panel glass-panel-interactive" 
              onClick={() => {
                setWizardSourceType(c.sourceId || "postgres"); // Fallback if no source ID
                setWizardStep(4); // Step 4 = View active connection details
                setWizardOpen(true);
              }}
              style={{ display: "flex", flexDirection: "column", padding: "1.5rem", minWidth: "280px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700 }}>
                  {c.name.charAt(0)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.status === "connected" ? "var(--color-success)" : "var(--color-danger)", boxShadow: c.status === "connected" ? "0 0 8px var(--color-success-glow)" : "none" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{c.status}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{c.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.category}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.lastSync}</span>
                <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>{c.records}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel flex-center" style={{ padding: "4rem", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
          <Database size={48} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
          <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: "300px" }}>
            {language === "es" ? "No hay fuentes de datos activas. Añade una para empezar." : "No active data sources. Add one to get started."}
          </p>
        </div>
      )}
      </div>

      {/* Slide-over Wizard Drawer */}
      {wizardOpen && (
        <>
          <div className="modal-overlay animate-fade-in" onClick={() => !wizardConnecting && setWizardOpen(false)} />
          <div className="slide-over-panel" style={{ maxWidth: "480px" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface-solid)" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  {wizardStep === 1 && (language === "es" ? "Seleccionar Fuente" : "Select Source")}
                  {wizardStep === 2 && (language === "es" ? `Configurar ${selectedSource?.label}` : `Configure ${selectedSource?.label}`)}
                  {wizardStep === 3 && (language === "es" ? "Fuente de Datos Agregada" : "Data Source Added")}
                  {wizardStep === 4 && (language === "es" ? "Detalles de la Fuente" : "Data Source Details")}
                </h3>
                {wizardStep === 2 && (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Lock size={12} />
                    {language === "es" ? "Cifrado de extremo a extremo" : "End-to-end encrypted"}
                  </p>
                )}
              </div>
              <button onClick={() => setWizardOpen(false)} disabled={wizardConnecting} className="btn-secondary" style={{ padding: "0.4rem", borderRadius: "50%" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              
              {/* STEP 1: Select Category/Source */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {language === "es" ? "Elige un origen de datos para conectar a tu espacio de trabajo." : "Choose a data source to connect to your workspace."}
                  </p>
                  {sourceCategories.map((cat, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.4rem" }}>
                        {cat.icon}
                        {cat.label}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                        {cat.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setWizardSourceType(src.id);
                              setWizardStep(2);
                            }}
                            className="glass-panel glass-panel-interactive"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              textAlign: "left",
                              padding: "0.85rem 1rem",
                              cursor: "pointer",
                              background: "var(--bg-surface)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontSize: "1rem", fontWeight: 700 }}>
                                {src.label.charAt(0)}
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>{src.label}</h4>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{src.desc}</p>
                              </div>
                            </div>
                            <Plus size={16} style={{ color: "var(--text-muted)" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: Configure Fields */}
              {wizardStep === 2 && (
                <form id="wizard-form" onSubmit={handleWizardSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700 }}>
                      {selectedSource?.label.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedSource?.label}</h4>
                      <span className="badge badge-info" style={{ fontSize: "0.65rem", marginTop: "0.35rem" }}>{selectedSource?.catLabel}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {wizardFormFields.map((field, fIdx) => (
                      <div key={fIdx} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>{field.label}</label>
                        {field.type === "file" ? (
                          <div style={{ border: "2px dashed var(--border-color)", borderRadius: "var(--radius-md)", padding: "2.5rem 1.5rem", textAlign: "center", cursor: "pointer", position: "relative", background: "var(--bg-surface-hover)", transition: "all var(--transition-fast)" }}>
                            <input
                              type="file"
                              onChange={e => {
                                const name = e.target.files?.[0]?.name || "dataset.csv";
                                setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: name }));
                                if ((wizardSourceType === "excel" || wizardSourceType === "json_txt") && handleFileUpload) {
                                  handleFileUpload(e);
                                }
                              }}
                              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                            />
                            <Upload size={28} style={{ margin: "0 auto 0.75rem", display: "block", color: "var(--text-primary)", opacity: 0.8 }} />
                            <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                              {wizardConfig[field.key] || (language === "es" ? "Haz clic para subir archivo" : "Click to upload file")}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {selectedSource?.desc || "CSV, Excel, JSON"}
                            </span>
                          </div>
                        ) : (
                          <input
                            type={field.type || "text"}
                            placeholder={field.placeholder || ""}
                            value={wizardConfig[field.key] || ""}
                            required
                            onChange={e => setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: e.target.value }))}
                            style={{ padding: "0.75rem 0.85rem", fontSize: "0.9rem", background: "var(--bg-surface-hover)" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              )}

              {/* STEP 3: Complete screen */}
              {wizardStep === 3 && (
                <div className="animate-fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", width: "80px", height: "80px", borderRadius: "50%", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", color: "var(--color-success)", boxShadow: "0 0 30px rgba(16, 185, 129, 0.15)" }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>{language === "es" ? "¡Fuente de Datos Agregada!" : "Data Source Added!"}</h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: "0 0 0.5rem" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedSource?.label}</strong> {language === "es" ? "está sincronizando datos." : "is syncing data."}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 2rem", maxWidth: "300px", marginInline: "auto", lineHeight: 1.5 }}>
                    {language === "es" ? "El servidor MCP autogenerado ya está disponible." : "The auto-generated MCP server is now available."}
                  </p>
                  
                  <div style={{ padding: "1.25rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", fontWeight: 700 }}>{language === "es" ? "Detalles" : "Details"}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Status</span>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <button className="btn btn-primary" onClick={() => setWizardOpen(false)} style={{ width: "100%", padding: "0.85rem" }}>
                      {language === "es" ? "Hecho" : "Done"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: View Active Connection Details */}
              {wizardStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: 700 }}>
                      {selectedSource?.label?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedSource?.label || "Data Source"}</h4>
                      <span className="badge badge-success" style={{ fontSize: "0.65rem", marginTop: "0.35rem" }}>Active</span>
                    </div>
                  </div>
                  
                  <div style={{ padding: "1.25rem", background: "var(--bg-surface-solid)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem", fontWeight: 700 }}>{language === "es" ? "Información de Sync" : "Sync Info"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Last Sync</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>1 min ago</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Records</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>Active sync</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Health</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-success)" }}>100% OK</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                    <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                      <RefreshCw size={14} />
                      {language === "es" ? "Sincronizar Ahora" : "Sync Now"}
                    </button>
                    <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                      <Settings size={14} />
                      {language === "es" ? "Configuración" : "Settings"}
                    </button>
                    <button className="btn" style={{ width: "100%", justifyContent: "center", color: "var(--color-danger)", borderColor: "transparent", background: "rgba(239, 68, 68, 0.1)" }}>
                      {language === "es" ? "Eliminar Fuente de Datos" : "Delete Data Source"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions for STEP 2 (Configuration) */}
            {wizardStep === 2 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-surface-solid)", display: "flex", justifyContent: "space-between", gap: "0.85rem" }}>
                <button type="button" className="btn btn-secondary" disabled={wizardConnecting} onClick={() => setWizardStep(1)} style={{ padding: "0.6rem 1rem" }}>
                  {language === "es" ? "Atrás" : "Back"}
                </button>
                <div style={{ display: "flex", gap: "0.85rem" }}>
                  <button type="button" className="btn btn-secondary" disabled={wizardConnecting} onClick={() => setWizardOpen(false)} style={{ padding: "0.6rem 1rem" }}>
                    {language === "es" ? "Cancelar" : "Cancel"}
                  </button>
                  <button type="submit" form="wizard-form" className="btn btn-primary" disabled={wizardConnecting} style={{ minWidth: "130px", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "0.6rem 1.25rem" }}>
                    {wizardConnecting ? (
                      <>
                        <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                        <span>{language === "es" ? "Conectando..." : "Connecting..."}</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon size={16} />
                        <span>{language === "es" ? "Conectar" : "Connect"}</span>
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
