"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, RefObject } from "react";
import Papa from "papaparse";
import { TRANSLATIONS } from "../lib/translations";
import {
  INITIAL_AGENTS,
  INITIAL_MOCK_CONNECTIONS,
  INITIAL_BANK_ROWS,
  INITIAL_CLOSE_STEPS,
  INITIAL_TAXES,
  INITIAL_SKILLS,
} from "../lib/initialData";

export type TabType = "home" | "connections" | "skills" | "agents" | "visualGraph" | "playground" | "recipe" | "integrations" | "reconciliation" | "monthlyClose" | "taxAlerts" | "templates" | "settings";

interface DashboardContextType {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agents: any[];
  setAgents: React.Dispatch<React.SetStateAction<any[]>>;
  selectedGraphAgent: string;
  setSelectedGraphAgent: React.Dispatch<React.SetStateAction<string>>;
  selectedPlaygroundAgent: string;
  setSelectedPlaygroundAgent: React.Dispatch<React.SetStateAction<string>>;
  agentFormOpen: boolean;
  setAgentFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agentEditId: string | null;
  setAgentEditId: React.Dispatch<React.SetStateAction<string | null>>;
  agentFormName: string;
  setAgentFormName: React.Dispatch<React.SetStateAction<string>>;
  agentFormRole: string;
  setAgentFormRole: React.Dispatch<React.SetStateAction<string>>;
  agentFormDesc: string;
  setAgentFormDesc: React.Dispatch<React.SetStateAction<string>>;
  agentFormSources: string[];
  setAgentFormSources: React.Dispatch<React.SetStateAction<string[]>>;
  agentFormSkills: string[];
  setAgentFormSkills: React.Dispatch<React.SetStateAction<string[]>>;
  agentFormUsers: string;
  setAgentFormUsers: React.Dispatch<React.SetStateAction<string>>;
  agentFormConfirmation: boolean;
  setAgentFormConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  toggleTheme: () => void;
  language: "en" | "es";
  setLanguage: React.Dispatch<React.SetStateAction<"en" | "es">>;
  handleLanguageChange: (lang: "en" | "es") => void;
  advancedMode: boolean;
  setAdvancedMode: React.Dispatch<React.SetStateAction<boolean>>;
  csvContent: string;
  setCsvContent: React.Dispatch<React.SetStateAction<string>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  parsedData: any;
  setParsedData: React.Dispatch<React.SetStateAction<any>>;
  previewRows: any[];
  setPreviewRows: React.Dispatch<React.SetStateAction<any[]>>;
  analysisError: string;
  setAnalysisError: React.Dispatch<React.SetStateAction<string>>;
  selectedNode: string | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
  wizardOpen: boolean;
  setWizardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  wizardSourceType: string;
  setWizardSourceType: React.Dispatch<React.SetStateAction<string>>;
  wizardConfig: Record<string, string>;
  setWizardConfig: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  wizardConnecting: boolean;
  setWizardConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  mockConnections: any[];
  setMockConnections: React.Dispatch<React.SetStateAction<any[]>>;
  copilotOpen: boolean;
  setCopilotOpen: React.Dispatch<React.SetStateAction<boolean>>;
  copilotMessages: any[];
  setCopilotMessages: React.Dispatch<React.SetStateAction<any[]>>;
  copilotQuery: string;
  setCopilotQuery: React.Dispatch<React.SetStateAction<string>>;
  copilotLoading: boolean;
  setCopilotLoading: React.Dispatch<React.SetStateAction<boolean>>;
  installedTemplates: string[];
  setInstalledTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  bankRowsState: any[];
  setBankRowsState: React.Dispatch<React.SetStateAction<any[]>>;
  closeStepsState: any[];
  setCloseStepsState: React.Dispatch<React.SetStateAction<any[]>>;
  taxesState: any[];
  setTaxesState: React.Dispatch<React.SetStateAction<any[]>>;
  skills: any[];
  setSkills: React.Dispatch<React.SetStateAction<any[]>>;
  skillFormOpen: boolean;
  setSkillFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  skillFormName: string;
  setSkillFormName: React.Dispatch<React.SetStateAction<string>>;
  skillFormDesc: string;
  setSkillFormDesc: React.Dispatch<React.SetStateAction<string>>;
  skillFormType: "read" | "action";
  setSkillFormType: React.Dispatch<React.SetStateAction<"read" | "action">>;
  skillFormMethod: "GET" | "POST";
  setSkillFormMethod: React.Dispatch<React.SetStateAction<"GET" | "POST">>;
  skillFormUrl: string;
  setSkillFormUrl: React.Dispatch<React.SetStateAction<string>>;
  skillFormJson: string;
  setSkillFormJson: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  chatLoading: boolean;
  setChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  selectedTraceStep: number | null;
  setSelectedTraceStep: React.Dispatch<React.SetStateAction<number | null>>;
  observabilityLogs: any[];
  setObservabilityLogs: React.Dispatch<React.SetStateAction<any[]>>;
  stats: any;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  chatEndRef: RefObject<HTMLDivElement | null>;
  handleCopilotSubmit: (context: "reconciliation" | "monthlyClose" | "taxAlerts", customText: string) => Promise<void>;
  t: (key: string) => string;
  tTab: (key: string) => string;
  loadSampleCSV: (url: string, name: string) => Promise<void>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processCSVData: (text: string, name: string) => Promise<void>;
  handleQuerySubmit: (e: React.FormEvent) => Promise<void>;
  copyToClipboard: (text: string) => void;
  downloadFile: (content: string, filename: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // AI Agent configurations
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  const [selectedGraphAgent, setSelectedGraphAgent] = useState<string>("all");
  const [selectedPlaygroundAgent, setSelectedPlaygroundAgent] = useState<string>("agent-reconcile");
  
  // Agent Form State
  const [agentFormOpen, setAgentFormOpen] = useState(false);
  const [agentEditId, setAgentEditId] = useState<string | null>(null);
  const [agentFormName, setAgentFormName] = useState("");
  const [agentFormRole, setAgentFormRole] = useState("");
  const [agentFormDesc, setAgentFormDesc] = useState("");
  const [agentFormSources, setAgentFormSources] = useState<string[]>([]);
  const [agentFormSkills, setAgentFormSkills] = useState<string[]>([]);
  const [agentFormUsers, setAgentFormUsers] = useState("");
  const [agentFormConfirmation, setAgentFormConfirmation] = useState(false);

  // Theme Manager & i18n states
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"en" | "es">("en");

  // Advanced Developer Mode Toggle
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  // Data connection state
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [analysisError, setAnalysisError] = useState<string>("");

  // Visual Graph Selected Node State
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Wizard & connections state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSourceType, setWizardSourceType] = useState("");
  const [wizardConfig, setWizardConfig] = useState<Record<string, string>>({});
  const [wizardConnecting, setWizardConnecting] = useState(false);
  const [mockConnections, setMockConnections] = useState(INITIAL_MOCK_CONNECTIONS);

  // Copilot Panel states
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<Array<{role: "user" | "agent" | "system", text: string, steps?: string[]}>>([]);
  const [copilotQuery, setCopilotQuery] = useState<string>("");
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);

  // Installed Templates state
  const [installedTemplates, setInstalledTemplates] = useState<string[]>([]);

  // Promoted Application States for Dynamic Agent interaction
  const [bankRowsState, setBankRowsState] = useState(INITIAL_BANK_ROWS);
  const [closeStepsState, setCloseStepsState] = useState(INITIAL_CLOSE_STEPS);
  const [taxesState, setTaxesState] = useState(INITIAL_TAXES);

  // Configured Skills (Read / Write Actions) list
  const [skills, setSkills] = useState(INITIAL_SKILLS);

  // Skill Builder Form State
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [skillFormName, setSkillFormName] = useState("");
  const [skillFormDesc, setSkillFormDesc] = useState("");
  const [skillFormType, setSkillFormType] = useState<"read" | "action">("action");
  const [skillFormMethod, setSkillFormMethod] = useState<"GET" | "POST">("POST");
  const [skillFormUrl, setSkillFormUrl] = useState("");
  const [skillFormJson, setSkillFormJson] = useState(`{\n  "invoice_id": "string",\n  "amount": "number"\n}`);

  // Chat/Playground state
  const [query, setQuery] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [selectedTraceStep, setSelectedTraceStep] = useState<number | null>(null);
  // Cumulative Observability metrics
  const [observabilityLogs, setObservabilityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalFullTokens: 0,
    totalMcpTokens: 0,
    totalTokensSaved: 0,
    avgSavingsPercent: 0,
    totalCostSaved: 0,
    avgMcpLatency: 0,
    avgFullLatency: 0
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCopilotSubmit = async (context: "reconciliation" | "monthlyClose" | "taxAlerts", customText: string) => {
    const text = customText.trim();
    if (!text) return;
    
    setCopilotLoading(true);

    // Add user message
    setCopilotMessages(prev => [...prev, { role: "user", text }]);

    setTimeout(() => {
      let responseText = "";
      let steps: string[] = [];

      const queryLower = text.toLowerCase();

      if (context === "reconciliation") {
        if (queryLower.includes("concilia") || queryLower.includes("run") || queryLower.includes("ejecuta") || queryLower.includes("comparar") || queryLower.includes("reconcile")) {
          steps = [
            language === "es" ? "Buscando movimientos sin conciliar en el extracto..." : "Searching unmatched movements in statement...",
            language === "es" ? "Llamando a la herramienta \`run_reconciliation\` (POST /api/reconcile)..." : "Calling tool \`run_reconciliation\` (POST /api/reconcile)...",
            language === "es" ? "Actualizando estados de conciliación en la base de datos de libros..." : "Updating match status in books database..."
          ];
          responseText = language === "es" 
            ? "¡Excelente! He ejecutado la conciliación. Identifiqué la transferencia de **$18.000** y el débito de **-$28.600** de impuestos, cruzándolos exitosamente con tus facturas en libros. Las 6 transacciones ahora están completamente conciliadas."
            : "Perfect! I have run the reconciliation. I identified the **$18,000** transfer and the **-$28,600** tax debit, matching them with books. All 6 transactions are now reconciled.";
          
          setBankRowsState(prev => prev.map(r => ({ ...r, matched: true })));
          setCloseStepsState(prev => prev.map(s => s.id === 2 ? { ...s, status: "done", detail: language === "es" ? "Completamente conciliado por el Agente" : "Fully matched by Agent" } : s));
        } else {
          steps = [
            language === "es" ? "Analizando consulta sobre transacciones..." : "Analyzing transaction query..."
          ];
          responseText = language === "es"
            ? "Actualmente tienes 2 movimientos pendientes de conciliar: un ingreso de **$18.000** y un egreso de **$28.600** (impuestos). Puedes conciliar todos diciendo 'ejecuta la conciliación'."
            : "You currently have 2 unmatched items: a transfer of **$18,000** and a debit of **$28,600** (tax payment). You can reconcile them by saying 'run reconciliation'.";
        }
      } else if (context === "monthlyClose") {
        if (queryLower.includes("complet") || queryLower.includes("inventario") || queryLower.includes("marca") || queryLower.includes("impuesto") || queryLower.includes("nómina") || queryLower.includes("tax") || queryLower.includes("payroll") || queryLower.includes("complete")) {
          steps = [
            language === "es" ? "Buscando tareas pendientes del mes..." : "Searching pending tasks...",
            language === "es" ? "Llamando a la herramienta \`update_checklist_task\` (POST /api/close/tasks)..." : "Calling tool \`update_checklist_task\` (POST /api/close/tasks)..."
          ];
          responseText = language === "es"
            ? "¡Entendido! He actualizado el checklist de cierre mensual. Los impuestos de nómina y corporativos ya están liquidados y los asientos de ajuste correspondientes en el ERP se han registrado de forma exitosa."
            : "Understood! I updated the monthly close checklist. Payroll and corporate taxes are resolved, and adjustment entries have been registered in ERP.";
          
          setCloseStepsState(prev => prev.map(s => s.status !== "done" ? { ...s, status: "done", detail: language === "es" ? "Completado por el Copiloto IA" : "Completed by AI Copilot" } : s));
        } else {
          steps = [
            language === "es" ? "Consultando base de datos del cierre..." : "Querying closing database..."
          ];
          responseText = language === "es"
            ? "El progreso de cierre mensual está en **50%**. Tienes tareas pendientes como: Liquidar impuestos de nómina, registrar pago de impuestos corporativos y realizar los asientos de ajuste. Puedes pedirme 'completa las tareas pendientes'."
            : "Your monthly close progress is at **50%**. Pending tasks include calculating payroll taxes, registering corporate tax payments, and adjustments. You can ask me to 'complete pending tasks'.";
        }
      } else if (context === "taxAlerts") {
        if (queryLower.includes("presenta") || queryLower.includes("declara") || queryLower.includes("paga") || queryLower.includes("impuesto") || queryLower.includes("tax") || queryLower.includes("submit")) {
          steps = [
            language === "es" ? "Recuperando RUT y certificado pfx..." : "Retrieving RUT and pfx certificate...",
            language === "es" ? "Invocando herramienta de firma y envío \`submit_tax_declaration\` (POST /api/tax/submit)..." : "Invoking signature and submit tool \`submit_tax_declaration\` (POST /api/tax/submit)..."
          ];
          responseText = language === "es"
            ? "¡Hecho! He firmado digitalmente y presentado el reporte mensual de facturación a la oficina impositiva. El estado ha sido actualizado a 'Presentado'."
            : "Done! I have digitally signed and submitted the monthly invoicing report to the tax office. The status has been updated to 'Filed'.";

          setTaxesState(prev => prev.map(t => t.id === 4 ? { ...t, status: "filed" } : t));
        } else {
          steps = [
            language === "es" ? "Buscando vencimientos impositivos..." : "Searching tax deadlines..."
          ];
          responseText = language === "es"
            ? "Tienes vencimientos pendientes. El reporte de Reporte de facturación está listo para ser firmado y enviado. Pídeme 'presenta el reporte de facturación' para hacerlo."
            : "You have pending obligations. The monthly invoicing report is ready. Ask me to 'submit invoicing report' to file it.";
        }
      }

      setCopilotMessages(prev => [
        ...prev,
        { role: "agent", text: responseText, steps }
      ]);
      setCopilotLoading(false);
    }, 1500);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("agenttis-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const savedLang = localStorage.getItem("agenttis-lang") as "en" | "es";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("agenttis-theme", nextTheme);
  };

  const handleLanguageChange = (lang: "en" | "es") => {
    setLanguage(lang);
    localStorage.setItem("agenttis-lang", lang);
  };

  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  const tTab = (key: string) => {
    const dict = TRANSLATIONS[language].tabs as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  useEffect(() => {
    loadSampleCSV("/samples/customers_sales.csv", "customers_sales.csv");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  const loadSampleCSV = async (url: string, name: string) => {
    setLoading(true);
    setAnalysisError("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch sample CSV");
      const text = await res.text();
      await processCSVData(text, name);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to load sample data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAnalysisError("");
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      await processCSVData(text, file.name);
      setLoading(false);
    };
    reader.onerror = () => {
      setAnalysisError("Failed to read file");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const processCSVData = async (text: string, name: string) => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("fileName", name);

      const response = await fetch("/api/analyze-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze CSV file");
      }

      const data = await response.json();
      setCsvContent(text);
      setFileName(name);
      setParsedData(data);
      
      const preview = Papa.parse(text, {
        header: true,
        preview: 6,
        skipEmptyLines: true,
      });
      setPreviewRows(preview.data);
      setChatHistory([]);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to parse CSV data");
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !csvContent) return;

    const userQuery = query.trim();
    setQuery("");
    setChatLoading(true);
    
    setChatHistory(prev => [...prev, { role: "user", text: userQuery }]);

    try {
      const activeAgent = agents.find(a => a.id === selectedPlaygroundAgent);

      const response = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvContent,
          query: userQuery,
          language,
          allowedSources: activeAgent ? activeAgent.dataSources : undefined,
          allowedSkills: activeAgent ? activeAgent.skills : undefined,
          activeSourceId: "file-active"
        }),
      });

      if (!response.ok) throw new Error("Agent failed to respond");

      const data = await response.json();

      setChatHistory(prev => [
        ...prev,
        {
          role: "agent",
          text: data.answer,
          trace: data.trace,
          metrics: data.metrics
        }
      ]);

      const logEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        query: userQuery,
        toolCalled: data.trace.find((t: any) => t.type === "tool_call")?.details?.tool || "none",
        metrics: data.metrics
      };

      setObservabilityLogs(prev => [logEntry, ...prev]);

      setStats(prev => {
        const newTotalQueries = prev.totalQueries + 1;
        const newFullTokens = prev.totalFullTokens + data.metrics.fullContextTokens;
        const newMcpTokens = prev.totalMcpTokens + data.metrics.mcpTokens;
        const newSaved = prev.totalTokensSaved + data.metrics.tokensSaved;
        const newCost = prev.totalCostSaved + data.metrics.costSaved;
        const newMcpLat = prev.avgMcpLatency + data.metrics.mcpLatency;
        const newFullLat = prev.avgFullLatency + data.metrics.fullContextLatency;

        return {
          totalQueries: newTotalQueries,
          totalFullTokens: newFullTokens,
          totalMcpTokens: newMcpTokens,
          totalTokensSaved: newSaved,
          avgSavingsPercent: Number(((newSaved / newFullTokens) * 100).toFixed(1)),
          totalCostSaved: Number(newCost.toFixed(5)),
          avgMcpLatency: Math.round(newMcpLat / newTotalQueries),
          avgFullLatency: Math.round(newFullLat / newTotalQueries),
        };
      });

      setSelectedTraceStep(1);

    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        {
          role: "agent",
          text: language === "es" 
            ? "Lo siento, encontré un error al simular la respuesta del agente: " + err.message
            : "Sorry, I encountered an error simulating the agent response: " + err.message,
          isError: true
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === "es" ? "¡Código copiado al portapapeles!" : "Copied code to clipboard!");
  };

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/javascript" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const value: DashboardContextType = {
    activeTab, setActiveTab,
    sidebarOpen, setSidebarOpen,
    agents, setAgents,
    selectedGraphAgent, setSelectedGraphAgent,
    selectedPlaygroundAgent, setSelectedPlaygroundAgent,
    agentFormOpen, setAgentFormOpen,
    agentEditId, setAgentEditId,
    agentFormName, setAgentFormName,
    agentFormRole, setAgentFormRole,
    agentFormDesc, setAgentFormDesc,
    agentFormSources, setAgentFormSources,
    agentFormSkills, setAgentFormSkills,
    agentFormUsers, setAgentFormUsers,
    agentFormConfirmation, setAgentFormConfirmation,
    theme, setTheme, toggleTheme,
    language, setLanguage, handleLanguageChange,
    advancedMode, setAdvancedMode,
    csvContent, setCsvContent,
    fileName, setFileName,
    loading, setLoading,
    parsedData, setParsedData,
    previewRows, setPreviewRows,
    analysisError, setAnalysisError,
    selectedNode, setSelectedNode,
    wizardOpen, setWizardOpen,
    wizardStep, setWizardStep,
    wizardSourceType, setWizardSourceType,
    wizardConfig, setWizardConfig,
    wizardConnecting, setWizardConnecting,
    mockConnections, setMockConnections,
    copilotOpen, setCopilotOpen,
    copilotMessages, setCopilotMessages,
    copilotQuery, setCopilotQuery,
    copilotLoading, setCopilotLoading,
    installedTemplates, setInstalledTemplates,
    bankRowsState, setBankRowsState,
    closeStepsState, setCloseStepsState,
    taxesState, setTaxesState,
    skills, setSkills,
    skillFormOpen, setSkillFormOpen,
    skillFormName, setSkillFormName,
    skillFormDesc, setSkillFormDesc,
    skillFormType, setSkillFormType,
    skillFormMethod, setSkillFormMethod,
    skillFormUrl, setSkillFormUrl,
    skillFormJson, setSkillFormJson,
    query, setQuery,
    chatLoading, setChatLoading,
    chatHistory, setChatHistory,
    selectedTraceStep, setSelectedTraceStep,
    observabilityLogs, setObservabilityLogs,
    stats, setStats,
    chatEndRef,
    handleCopilotSubmit,
    t, tTab,
    loadSampleCSV, handleFileUpload, processCSVData,
    handleQuerySubmit, copyToClipboard, downloadFile
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
