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
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { SlideOver } from "../ui/SlideOver";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { Input } from "../ui/Input";

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
      <Button 
        variant="primary"
        onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); setWizardOpen(true); }}
        className="!py-2 !px-4 !text-xs flex items-center gap-1.5"
      >
        <Plus size={16} />
        {language === "es" ? "Nueva Fuente de Datos" : "New Data Source"}
      </Button>
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
      <div className="animate-fade-in flex flex-col gap-8 pb-8">

        {/* Main Grid: Only showing ACTIVE data sources */}
      {mockConnections.length > 0 ? (
        <div className="marketplace-grid">
          {mockConnections.map((c, i) => (
            <Card 
              key={i} 
              interactive 
              onClick={() => {
                setWizardSourceType(c.sourceId || "postgres"); // Fallback if no source ID
                setWizardStep(4); // Step 4 = View active connection details
                setWizardOpen(true);
              }}
              className="flex flex-col p-6 min-w-[280px] cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-[42px] h-[42px] rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-lg font-bold">
                  {c.name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ 
                      background: c.status === "connected" ? "var(--color-success)" : "var(--color-danger)", 
                      boxShadow: c.status === "connected" ? "0 0 8px var(--color-success-glow)" : "none" 
                    }} 
                  />
                  <span className="text-xs text-[var(--text-muted)] capitalize">{c.status}</span>
                </div>
              </div>
              <div className="flex-1">
                <Heading level="h4" className="text-base font-bold text-[var(--text-primary)] mb-1">{c.name}</Heading>
                <p className="text-xs text-[var(--text-muted)]">{c.category}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)]">{c.lastSync}</span>
                <Badge variant="success" className="text-[10px]">{c.records}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex-center p-16 flex-col gap-4 text-center">
          <Database size={48} className="text-[var(--text-muted)] opacity-50" />
          <p className="m-0 text-[var(--text-secondary)] max-w-[300px]">
            {language === "es" ? "No hay fuentes de datos activas. Añade una para empezar." : "No active data sources. Add one to get started."}
          </p>
        </Card>
      )}
      </div>

      {/* Slide-over Wizard Drawer */}
      <SlideOver
        isOpen={wizardOpen}
        onClose={() => !wizardConnecting && setWizardOpen(false)}
        maxWidth="480px"
        title={
          wizardStep === 1 ? (language === "es" ? "Seleccionar Fuente" : "Select Source") :
          wizardStep === 2 ? (language === "es" ? `Configurar ${selectedSource?.label}` : `Configure ${selectedSource?.label}`) :
          wizardStep === 3 ? (language === "es" ? "Fuente de Datos Agregada" : "Data Source Added") :
          wizardStep === 4 ? (language === "es" ? "Detalles de la Fuente" : "Data Source Details") : ""
        }
        description={
          wizardStep === 2 ? (language === "es" ? "Cifrado de extremo a extremo" : "End-to-end encrypted") : undefined
        }
        footer={
          wizardStep === 2 ? (
            <div className="flex justify-between w-full gap-4">
              <Button variant="secondary" disabled={wizardConnecting} onClick={() => setWizardStep(1)} className="!py-2.5 !px-5">
                {language === "es" ? "Atrás" : "Back"}
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" disabled={wizardConnecting} onClick={() => setWizardOpen(false)} className="!py-2.5 !px-5">
                  {language === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button 
                  type="submit" 
                  form="wizard-form" 
                  variant="primary" 
                  disabled={wizardConnecting} 
                  className="min-w-[130px] flex items-center gap-1.5 justify-center !py-2.5 !px-5"
                >
                  {wizardConnecting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{language === "es" ? "Conectando..." : "Connecting..."}</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={16} />
                      <span>{language === "es" ? "Conectar" : "Connect"}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {/* STEP 1: Select Category/Source */}
        {wizardStep === 1 && (
          <div className="flex flex-col gap-6">
            <p className="m-0 text-sm text-[var(--text-secondary)]">
              {language === "es" ? "Elige un origen de datos para conectar a tu espacio de trabajo." : "Choose a data source to connect to your workspace."}
            </p>
            {sourceCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1.5">
                  {cat.icon}
                  {cat.label}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {cat.sources.map((src, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        setWizardSourceType(src.id);
                        setWizardStep(2);
                      }}
                      className="glass-panel glass-panel-interactive flex items-center justify-between text-left p-3.5 cursor-pointer bg-[var(--bg-surface)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-sm font-bold">
                          {src.label.charAt(0)}
                        </div>
                        <div>
                          <Heading level="h4" className="m-0 text-xs font-semibold text-[var(--text-primary)]">{src.label}</Heading>
                          <p className="text-[10px] text-[var(--text-muted)] m-0">{src.desc}</p>
                        </div>
                      </div>
                      <Plus size={16} className="text-[var(--text-muted)]" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Configure Fields */}
        {wizardStep === 2 && (
          <form id="wizard-form" onSubmit={handleWizardSubmit} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-5 bg-[var(--bg-surface-hover)] border border-[var(--border-color)] rounded-md">
              <div className="w-[42px] h-[42px] rounded-md bg-[var(--bg-surface-solid)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-lg font-bold">
                {selectedSource?.label.charAt(0)}
              </div>
              <div>
                <Heading level="h4" className="m-0 text-sm font-bold text-[var(--text-primary)]">{selectedSource?.label}</Heading>
                <Badge variant="info" className="text-[9px] mt-1.5">{selectedSource?.catLabel}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {wizardFormFields.map((field, fIdx) => (
                <div key={fIdx} className="flex flex-col gap-2">
                  <label className="text-xs text-[var(--text-primary)] font-semibold">{field.label}</label>
                  {field.type === "file" ? (
                    <div className="border-2 border-dashed border-[var(--border-color)] rounded-md p-8 text-center cursor-pointer relative bg-[var(--bg-surface-hover)] hover:border-[var(--color-primary)] transition-all">
                      <input
                        type="file"
                        onChange={e => {
                          const name = e.target.files?.[0]?.name || "dataset.csv";
                          setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: name }));
                          if ((wizardSourceType === "excel" || wizardSourceType === "json_txt") && handleFileUpload) {
                            handleFileUpload(e);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload size={28} className="m-auto mb-3 block text-[var(--text-primary)] opacity-80" />
                      <span className="text-sm text-[var(--text-primary)] font-semibold block mb-1">
                        {wizardConfig[field.key] || (language === "es" ? "Haz clic para subir archivo" : "Click to upload file")}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {selectedSource?.desc || "CSV, Excel, JSON"}
                      </span>
                    </div>
                  ) : (
                    <Input
                      type={field.type || "text"}
                      placeholder={field.placeholder || ""}
                      value={wizardConfig[field.key] || ""}
                      required
                      onChange={e => setWizardConfig((prev: Record<string, string>) => ({ ...prev, [field.key]: e.target.value }))}
                      className="!py-2.5 !px-3.5 bg-[var(--bg-surface-hover)]"
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        )}

        {/* STEP 3: Complete screen */}
        {wizardStep === 3 && (
          <div className="animate-fade-in text-center py-8">
            <div className="inline-flex bg-emerald-500/10 border border-emerald-500/25 w-20 h-20 rounded-full items-center justify-center mb-6 text-[var(--color-success)] shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <CheckCircle2 size={40} />
            </div>
            <Heading level="h3" className="m-0 mb-2 text-xl">{language === "es" ? "¡Fuente de Datos Agregada!" : "Data Source Added!"}</Heading>
            <p className="text-sm text-[var(--text-secondary)] m-0 mb-2">
              <strong className="text-[var(--text-primary)]">{selectedSource?.label}</strong> {language === "es" ? "está sincronizando datos." : "is syncing data."}
            </p>
            <p className="text-xs text-[var(--text-muted)] m-0 mb-8 max-w-[300px] mx-auto leading-relaxed">
              {language === "es" ? "El servidor MCP autogenerado ya está disponible." : "The auto-generated MCP server is now available."}
            </p>
            
            <div className="p-5 bg-[var(--bg-surface-hover)] rounded-md border border-[var(--border-color)] text-left mb-8">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-3 font-bold">{language === "es" ? "Detalles" : "Details"}</div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[var(--text-secondary)]">Status</span>
                <Badge variant="success" className="text-[9px]">Active</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={() => setWizardOpen(false)} className="w-full !py-3">
                {language === "es" ? "Hecho" : "Done"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: View Active Connection Details */}
        {wizardStep === 4 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-5 bg-[var(--bg-surface-hover)] border border-[var(--border-color)] rounded-md">
              <div className="w-[42px] h-[42px] rounded-md bg-[var(--bg-surface-solid)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] text-lg font-bold">
                {selectedSource?.label?.charAt(0) || "C"}
              </div>
              <div>
                <Heading level="h4" className="m-0 text-sm font-bold text-[var(--text-primary)]">{selectedSource?.label || "Data Source"}</Heading>
                <Badge variant="success" className="text-[9px] mt-1.5">Active</Badge>
              </div>
            </div>
            
            <div className="p-5 bg-[var(--bg-surface-solid)] rounded-md border border-[var(--border-color)]">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-4 font-bold">{language === "es" ? "Información de Sync" : "Sync Info"}</div>
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Last Sync</span>
                  <span className="text-xs text-[var(--text-primary)]">1 min ago</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Records</span>
                  <span className="text-xs text-[var(--text-primary)]">Active sync</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-secondary)]">Health</span>
                  <span className="text-xs text-[var(--color-success)] font-semibold">100% OK</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              <Button variant="secondary" className="w-full justify-center !py-2.5">
                <RefreshCw size={14} className="mr-1.5" />
                {language === "es" ? "Sincronizar Ahora" : "Sync Now"}
              </Button>
              <Button variant="secondary" className="w-full justify-center !py-2.5">
                <Settings size={14} className="mr-1.5" />
                {language === "es" ? "Configuración" : "Settings"}
              </Button>
              <Button variant="danger" className="w-full justify-center !py-2.5 bg-red-500/10 !text-red-500 hover:bg-red-500/25 border border-red-500/20 shadow-none">
                {language === "es" ? "Eliminar Fuente de Datos" : "Delete Data Source"}
              </Button>
            </div>
          </div>
        )}
      </SlideOver>
    </>
  );
};
