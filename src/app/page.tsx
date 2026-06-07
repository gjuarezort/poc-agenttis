"use client";

import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import {
  Upload,
  Database,
  Play,
  FileCode,
  Activity,
  Cpu,
  Coins,
  Clock,
  ArrowRight,
  Download,
  Copy,
  Search,
  Sparkles,
  Check,
  Zap,
  TrendingDown,
  LineChart,
  Grid,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  Info,
  ChevronLeft,
  ChevronRight,
  Link,
  BarChart2,
  Package,
  SlidersHorizontal,
  Landmark,
  CalendarCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeftRight,
  Receipt,
  CircleDot,
  FileText,
  X,
  Cloud,
  Server,
  Building2,
  Plus,
  HardDrive,
  FolderOpen,
  RefreshCw,
  Wifi,
  WifiOff,
  Table,
} from "lucide-react";

// ENTERPRISE TRANSLATION DICTIONARY (i18n)
const TRANSLATIONS = {
  en: {
    appName: "Agenttis",
    tagline: "Enterprise Agentic Layer for PyMEs",
    mvpBuilder: "MVP Builder",
    tabs: {
      home: "Home",
      data: "Data Connections",
      playground: "Query Your Data",
      recipe: "Generated MCP Code",
      observability: "Metrics & Savings",
      integrations: "Integration Catalog",
      reconciliation: "Bank Reconciliation",
      monthlyClose: "Monthly Close",
      taxAlerts: "Tax Alerts",
      settings: "Settings"
    },
    settingsTitle: "Settings",
    settingsSubtitle: "Token efficiency, costs, and system configuration",
    reconciliationTitle: "Bank Reconciliation",
    reconciliationSubtitle: "Match your bank statement against your registered invoices and payments",
    reconciliationBank: "Bank Statement",
    reconciliationBooks: "Registered in Books",
    reconciliationMatched: "Matched",
    reconciliationUnmatched: "Unmatched",
    reconciliationPending: "Pending review",
    reconciliationRunBtn: "Run Reconciliation",
    reconciliationDiff: "Difference",
    monthlyCloseTitle: "Monthly Close",
    monthlyCloseSubtitle: "Guided checklist to close the accounting period step by step",
    monthlyClosePeriod: "Period",
    monthlyCloseProgress: "Progress",
    taxAlertsTitle: "Tax Alerts — DGI Uruguay",
    taxAlertsSubtitle: "Upcoming tax deadlines and compliance obligations for Uruguay",
    taxAlertsDue: "Due",
    taxAlertsDaysLeft: "days left",
    taxAlertsToday: "Today",
    taxAlertsOverdue: "Overdue",
    taxAlertsPaid: "Filed",
    home: {
      title: "Welcome back",
      subtitle: "Here's a summary of your latest activity",
      step1Title: "Last Processed Data",
      step1Desc: "Most recent datasets analyzed by Agenttis",
      step2Title: "Generated Reports",
      step2Desc: "Automated reports produced by your agents",
      step3Title: "Alerts",
      step3Desc: "Issues and notifications that need your attention",
      noData: "No data processed yet",
      noReports: "No reports generated yet",
      noAlerts: "No active alerts",
      viewAll: "View all",
      rowsProcessed: "rows processed",
      columnsDetected: "columns detected",
      generatedAt: "Generated",
      alertCritical: "Critical",
      alertWarning: "Warning",
      alertInfo: "Info",
      shortcutQueries: "Queries",
      shortcutReports: "Reports",
      shortcutData: "Data",
      shortcutConnections: "Connections",
      shortcutMetrics: "Metrics",
    },
    // Tab 1: Data Connection Hub
    dataTitle: "Connect Your Business Data",
    dataSubtitle: "Upload a CSV file representing your business data (e.g., Stripe exports, customer rosters, inventory sheets). Agenttis automatically analyzes schema structures and writes tailored, production-ready MCP tools.",
    uploadDragDrop: "Drag and drop CSV files here, or click to browse",
    uploadNote: "Max size 5MB. Processing is done securely inside your browser.",
    demoTitle: "Try a Demo Dataset",
    demoSubtitle: "Select one of our high-quality sample datasets to explore how Agenttis dynamic MCP server architecture works instantly without uploading your own data.",
    demoCustomers: "Customers & Sales Transactions",
    demoCustomersDesc: "Customer lists, total spent, countries, activity status, and transaction metrics.",
    demoInventory: "Product Inventory & Logistics",
    demoInventoryDesc: "Product catalog, SKUs, pricing, categorical structure, and live stock levels.",
    schemaTitle: "Auto-Generated MCP Schema",
    schemaSubtitle: "Below are the automatically detected column data types. Based on these structures, specific filter logic, math aggregate operators, and lookup queries are generated.",
    schemaHeaderField: "Field Name",
    schemaHeaderType: "Inferred Type",
    schemaHeaderSamples: "Value Samples",
    previewTitle: "CSV Data Preview",
    previewSubtitle: "A preview of the raw rows loaded into memory. When using an MCP connection, agents do not load these rows. They query them as needed.",
    tokenOptimizations: "Token Optimizations Available",
    tokenPayloadDesc: "Full context payload: ~{tokens} tokens per agent turn.",
    openPlaygroundBtn: "Open Playground",
    noDataMessage: "Please upload a CSV file or load a sample dataset above to generate the MCP Server recipe.",
    rowsDetected: "{rows} Total Rows Detected",
    analyzingMessage: "Analyzing dataset structures and composing dynamic recipes...",
    // Tab 2: Playground
    playTitle: "Query Your Data",
    playSubtitle: "Simulating agent interaction with the dynamic MCP tools serving {fileName}.",
    clearChat: "Clear Chat",
    noMessages: "No Messages Yet",
    noMessagesDesc: "Ask questions about the CSV data. The agent will run a reasoning loop, invoke the matching generated MCP tool in the backend, and formulate the final response.",
    agentThinking: "Agent thinking & calling MCP tool...",
    inputPlaceholder: "Ask a question about the dataset (e.g. 'average spent by country')",
    sendBtn: "Send",
    efficiencyTitle: "Token & Cost Efficiency",
    tokenConsumption: "Token Consumption",
    tokensSaved: "{percent}% Saved",
    fullContext: "Full Context",
    mcpTool: "MCP Tool",
    latencyTitle: "Execution Latency",
    xTimesFaster: "{x}x Faster",
    estSavings: "Est. savings per call:",
    reasoningTrace: "Agent Reasoning Trace",
    reasoningDesc: "See how the agent thinks and triggers the generated MCP tool behind the scenes in real time.",
    reasoningLogsPlaceholder: "Reasoning logs will display step-by-step agent processes.",
    metricsPlaceholder: "Metrics comparison will appear once you run an agent query.",
    // Tab 3: Code
    mcpOverviewTitle: "MCP Connections Overview",
    mcpOverviewDesc: "This schema exposes your dataset capabilities. It defines exactly what filters, operations, and input properties are valid for model parameters.",
    serverIdentity: "SERVER IDENTITY",
    availableTools: "AVAILABLE TOOLS ({count})",
    mcpVersion: "MCP VERSION STANDARD",
    setupInstructionsTitle: "Direct MCP Setup",
    generatedScriptTitle: "Generated MCP Server Script",
    generatedScriptDesc: "Node.js / Express-based Standard Model Context Protocol Server.",
    copyScript: "Copy Script",
    downloadScript: "Download index.js",
    setupStep1: "Create a directory on your machine.",
    setupStep2: "Download or copy the generated script to index.js.",
    setupStep3: "Save your CSV file as {fileName} in that folder.",
    setupStep4: "Run npm init -y && npm install @modelcontextprotocol/sdk csv-parser.",
    setupStep5: "Initialize this server with tools using standard Node stdio commands in your Claude Desktop configuration file or AI pipeline settings.",
    // Tab 4: Observability
    queriesProcessed: "QUERIES PROCESSED",
    avgTokensSaved: "AVG. TOKENS SAVED",
    cumCostSaved: "CUMULATIVE COST SAVED",
    speedup: "SPEED SPEED-UP",
    tokenCompTitle: "Token Consumption Comparison (Cumulative)",
    latencyCompTitle: "Average Processing Latency (ms)",
    savingsStatDesc: "You saved a total of {tokens} tokens, which is equivalent to reducing LLM input costs by {percent}%.",
    speedupStatDesc: "Average speed-up: Agent execution was {x}x faster using structured MCP queries!",
    observabilityPlaceholder: "Interact with the Agent Playground to populate comparison charts.",
    traceLogTitle: "Real-time Trace Log",
    logHeaderTime: "Time",
    logHeaderQuery: "Query",
    logHeaderTool: "MCP Tool Called",
    logHeaderTokens: "Tokens (MCP)",
    logHeaderSavings: "Savings %",
    logHeaderCost: "Cost Saved",
    logHeaderSpeed: "Speed",
    noLogsMessage: "No query logs registered yet. Ask questions in the Playground.",
    // Tab 5: Catalog
    catalogTitle: "Integration Catalog",
    catalogSubtitle: "Agenttis operates on prebuilt low-code recipes. Below are enterprise integrations. Activating them auto-constructs dynamic schemas and hosts standard endpoints for direct AI agent integration.",
    stripeTitle: "Stripe Checkout MCP",
    stripeDesc: "Exposes customers, subscription balances, invoices, and checkout status to AI. Allows agent-led billing lookups and revenue reconciliation.",
    hubspotTitle: "HubSpot CRM MCP",
    hubspotDesc: "Sync contacts, deals, company segments, and ticket logs. Let support/sales agents fetch pipeline updates and update contact files.",
    notionTitle: "Notion Wiki MCP",
    notionDesc: "Index Notion databases, document pages, and lists. Agents search business handbooks, policies, and meeting logs dynamically.",
    slackTitle: "Slack Channels MCP",
    slackDesc: "Let agents read threads, post summaries, search message history, or schedule alerts in specific channels. Includes security boundaries.",
    stripeReadTrans: "Read Transactions",
    stripeWriteRefund: "Write Invoices / Refunds",
    hubspotReadPipe: "Read Pipeline",
    hubspotCreateCont: "Create Contacts",
    notionSearch: "Search Workspaces",
    notionCreate: "Create Pages",
    slackReadMsg: "Read Messages",
    slackPostNotif: "Post Notifications",
    configureConn: "Configure Connection",
    requestAccess: "Request Access"
  },
  es: {
    appName: "Agenttis",
    tagline: "Capa Agéntica Empresarial para PyMEs",
    mvpBuilder: "Constructor MVP",
    tabs: {
      home: "Inicio",
      data: "Conexiones de Datos",
      playground: "Consulta tu Información",
      recipe: "Código MCP Generado",
      observability: "Métricas y Ahorros",
      integrations: "Catálogo de Integraciones",
      reconciliation: "Conciliación Bancaria",
      monthlyClose: "Cierre Mensual",
      taxAlerts: "Alertas Fiscales",
      settings: "Configuración"
    },
    settingsTitle: "Configuración",
    settingsSubtitle: "Eficiencia de tokens, costos y configuración del sistema",
    reconciliationTitle: "Conciliación Bancaria",
    reconciliationSubtitle: "Cruzá tu extracto bancario contra facturas y pagos registrados",
    reconciliationBank: "Extracto Bancario",
    reconciliationBooks: "Registrado en Libros",
    reconciliationMatched: "Conciliado",
    reconciliationUnmatched: "Sin conciliar",
    reconciliationPending: "Pendiente de revisión",
    reconciliationRunBtn: "Ejecutar Conciliación",
    reconciliationDiff: "Diferencia",
    monthlyCloseTitle: "Cierre Mensual",
    monthlyCloseSubtitle: "Checklist guiado para cerrar el período contable paso a paso",
    monthlyClosePeriod: "Período",
    monthlyCloseProgress: "Progreso",
    taxAlertsTitle: "Alertas Fiscales — DGI Uruguay",
    taxAlertsSubtitle: "Vencimientos impositivos y obligaciones fiscales para Uruguay",
    taxAlertsDue: "Vence",
    taxAlertsDaysLeft: "días",
    taxAlertsToday: "Hoy",
    taxAlertsOverdue: "Vencido",
    taxAlertsPaid: "Presentado",
    home: {
      title: "Bienvenido",
      subtitle: "Aquí tienes un resumen de tu actividad reciente",
      step1Title: "Últimos Datos Procesados",
      step1Desc: "Conjuntos de datos más recientes analizados por Agenttis",
      step2Title: "Reportes Generados",
      step2Desc: "Reportes automatizados producidos por tus agentes",
      step3Title: "Alertas",
      step3Desc: "Problemas y notificaciones que requieren tu atención",
      noData: "No hay datos procesados aún",
      noReports: "No hay reportes generados aún",
      noAlerts: "Sin alertas activas",
      viewAll: "Ver todos",
      rowsProcessed: "filas procesadas",
      columnsDetected: "columnas detectadas",
      generatedAt: "Generado",
      alertCritical: "Crítico",
      alertWarning: "Advertencia",
      alertInfo: "Info",
      shortcutQueries: "Consultas",
      shortcutReports: "Reportes",
      shortcutData: "Datos",
      shortcutConnections: "Conexiones",
      shortcutMetrics: "Métricas",
    },
    // Tab 1: Data Connection Hub
    dataTitle: "Conecte sus Datos de Negocio",
    dataSubtitle: "Suba un archivo CSV que represente sus datos comerciales (ej. exportaciones de Stripe, nóminas de clientes, hojas de inventario). Agenttis analiza automáticamente la estructura de los esquemas y escribe herramientas MCP personalizadas listas para producción.",
    uploadDragDrop: "Arrastre y suelte archivos CSV aquí, o haga clic para buscar",
    uploadNote: "Tamaño máximo 5MB. El procesamiento se realiza de forma segura en su navegador.",
    demoTitle: "Pruebe un Conjunto de Datos de Demostración",
    demoSubtitle: "Seleccione uno de nuestros conjuntos de datos de muestra de alta calidad para explorar cómo funciona instantáneamente la arquitectura del servidor MCP dinámico de Agenttis sin subir sus propios datos.",
    demoCustomers: "Clientes y Transacciones de Ventas",
    demoCustomersDesc: "Listas de clientes, gasto total, países, estado de actividad y métricas de transacciones.",
    demoInventory: "Inventario de Productos y Logística",
    demoInventoryDesc: "Catálogo de productos, SKUs, precios, estructura categórica y niveles de stock en tiempo real.",
    schemaTitle: "Esquema MCP Autogenerado",
    schemaSubtitle: "A continuación se muestran los tipos de datos de columna detectados automáticamente. En base a estas estructuras, se generan operadores de filtro, operaciones de agregación matemática y consultas de búsqueda específicas.",
    schemaHeaderField: "Nombre del Campo",
    schemaHeaderType: "Tipo Detectado",
    schemaHeaderSamples: "Muestras de Valores",
    previewTitle: "Vista Previa de Datos CSV",
    previewSubtitle: "Una vista previa de las filas brutas cargadas en memoria. Al usar una conexión MCP, los agentes no cargan estas filas en contexto. Las consultan según sea necesario.",
    tokenOptimizations: "Optimizaciones de Tokens Disponibles",
    tokenPayloadDesc: "Carga de contexto completo: ~{tokens} tokens por turno del agente.",
    openPlaygroundBtn: "Abrir Playground",
    noDataMessage: "Por favor suba un archivo CSV o cargue un conjunto de datos de muestra arriba para generar la receta del Servidor MCP.",
    rowsDetected: "{rows} Filas Totales Detectadas",
    analyzingMessage: "Analizando estructuras de datos y componiendo recetas dinámicas...",
    // Tab 2: Playground
    playTitle: "Consulta tu Información",
    playSubtitle: "Simulando la interacción del agente con las herramientas MCP dinámicas que sirven a {fileName}.",
    clearChat: "Limpiar Chat",
    noMessages: "Aún no hay Mensajes",
    noMessagesDesc: "Haga preguntas sobre los datos CSV. El agente ejecutará un bucle de razonamiento, invocará la herramienta MCP correspondiente en el backend y formulará la respuesta final.",
    agentThinking: "Agente pensando e invocando herramienta MCP...",
    inputPlaceholder: "Haga una pregunta sobre el conjunto de datos (ej. 'promedio total_spent por pais')",
    sendBtn: "Enviar",
    efficiencyTitle: "Eficiencia de Tokens y Costos",
    tokenConsumption: "Consumo de Tokens",
    tokensSaved: "{percent}% Ahorrado",
    fullContext: "Contexto Completo",
    mcpTool: "Herramienta MCP",
    latencyTitle: "Latencia de Ejecución",
    xTimesFaster: "{x}x Más Rápido",
    estSavings: "Ahorro est. por llamada:",
    reasoningTrace: "Traza de Razonamiento del Agente",
    reasoningDesc: "Vea cómo el agente piensa y activa la herramienta MCP generada tras bambalinas en tiempo real.",
    reasoningLogsPlaceholder: "Los registros de razonamiento mostrarán los procesos del agente paso a paso.",
    metricsPlaceholder: "La comparación de métricas aparecerá una vez que ejecute una consulta al agente.",
    // Tab 3: Code
    mcpOverviewTitle: "Resumen de Conexiones MCP",
    mcpOverviewDesc: "Este esquema expone las capacidades de su conjunto de datos. Define exactamente qué filtros, operaciones y propiedades de entrada son válidos para los parámetros del modelo.",
    serverIdentity: "IDENTIDAD DEL SERVIDOR",
    availableTools: "HERRAMIENTAS DISPONIBLES ({count})",
    mcpVersion: "ESTÁNDAR DE VERSIÓN MCP",
    setupInstructionsTitle: "Configuración Directa de MCP",
    generatedScriptTitle: "Script de Servidor MCP Generado",
    generatedScriptDesc: "Servidor Model Context Protocol estándar basado en Node.js y Express.",
    copyScript: "Copiar Script",
    downloadScript: "Descargar index.js",
    setupStep1: "Cree un directorio en su máquina.",
    setupStep2: "Descargue o copie el script generado en index.js.",
    setupStep3: "Guarde su archivo CSV como {fileName} en esa carpeta.",
    setupStep4: "Ejecute npm init -y && npm install @modelcontextprotocol/sdk csv-parser.",
    setupStep5: "Inicialice este servidor con herramientas utilizando comandos estándar de Node stdio en su archivo de configuración de Claude Desktop o la configuración de su pipeline de IA.",
    // Tab 4: Observability
    queriesProcessed: "CONSULTAS PROCESADAS",
    avgTokensSaved: "PROM. TOKENS AHORRADOS",
    cumCostSaved: "COSTO ACUMULADO AHORRADO",
    speedup: "ACELERACIÓN DE VELOCIDAD",
    tokenCompTitle: "Comparación de Consumo de Tokens (Acumulado)",
    latencyCompTitle: "Latencia Promedio de Procesamiento (ms)",
    savingsStatDesc: "Ahorró un total de {tokens} tokens, equivalente a reducir los costos de entrada del LLM en un {percent}%.",
    speedupStatDesc: "Aceleración promedio: ¡La ejecución del agente fue {x}x más rápida utilizando consultas MCP estructuradas!",
    observabilityPlaceholder: "Interactúe con el Playground de Agentes para rellenar los gráficos de comparación.",
    traceLogTitle: "Registro de Trazas en Tiempo Real",
    logHeaderTime: "Hora",
    logHeaderQuery: "Consulta",
    logHeaderTool: "Herror. MCP Invocada",
    logHeaderTokens: "Tokens (MCP)",
    logHeaderSavings: "Ahorro %",
    logHeaderCost: "Costo Ahorrado",
    logHeaderSpeed: "Velocidad",
    noLogsMessage: "No hay registros de consultas registrados aún. Haga preguntas en el Playground.",
    // Tab 5: Catalog
    catalogTitle: "Catálogo de Integraciones",
    catalogSubtitle: "Agenttis funciona con recetas preconstruidas de bajo código. A continuación se muestran integraciones empresariales. Al activarlas se construyen esquemas dinámicos automáticamente y se alojan puntos de acceso estándar para la integración directa del agente de IA.",
    stripeTitle: "Stripe Checkout MCP",
    stripeDesc: "Expone clientes, saldos de suscripción, facturas y estados de pago a la IA. Permite búsquedas de facturación lideradas por agentes y reconciliación de ingresos.",
    hubspotTitle: "HubSpot CRM MCP",
    hubspotDesc: "Sincronice contactos, negocios, segmentos de empresas y registros de tickets. Permita que los agentes de soporte/ventas recuperen actualizaciones e interactúen con perfiles.",
    notionTitle: "Notion Wiki MCP",
    notionDesc: "Indexe bases de datos, páginas y listas de Notion. Los agentes buscan guías comerciales, políticas y registros de reuniones de forma dinámica.",
    slackTitle: "Slack Channels MCP",
    slackDesc: "Permita que los agentes lean hilos, publiquen resúmenes, busquen historial de mensajes o programen alertas. Incluye límites de seguridad.",
    stripeReadTrans: "Leer Transacciones",
    stripeWriteRefund: "Escribir Facturas / Reembolsos",
    hubspotReadPipe: "Leer Embudo",
    hubspotCreateCont: "Crear Contactos",
    notionSearch: "Buscar Espacios de Trabajo",
    notionCreate: "Crear Páginas",
    slackReadMsg: "Leer Mensajes",
    slackPostNotif: "Publicar Notificaciones",
    configureConn: "Configurar Conexión",
    requestAccess: "Solicitar Acceso"
  }
};

export default function AgenttisDashboard() {
  const [activeTab, setActiveTab] = useState<"home" | "data" | "playground" | "recipe" | "integrations" | "reconciliation" | "monthlyClose" | "taxAlerts" | "settings">("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme Manager & i18n states
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"en" | "es">("en");

  // Data connection state
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [analysisError, setAnalysisError] = useState<string>("");

  // Wizard & connections state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSourceType, setWizardSourceType] = useState("");
  const [wizardConfig, setWizardConfig] = useState<Record<string, string>>({});
  const [wizardConnecting, setWizardConnecting] = useState(false);
  const [mockConnections, setMockConnections] = useState<Array<{id:string, name:string, category:string, status:"connected"|"error"|"pending", lastSync:string, records:string}>>([
    { id:"demo1", name: "Demo: Clientes Uruguay", category:"CSV", status:"connected", lastSync:"Hace 2h", records:"500 filas" },
  ]);

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

  // Initialize theme from localStorage or body attribute on load
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

  // Update DOM and local storage when theme changes
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("agenttis-theme", nextTheme);
  };

  // Update local storage when language changes
  const handleLanguageChange = (lang: "en" | "es") => {
    setLanguage(lang);
    localStorage.setItem("agenttis-lang", lang);
  };

  // Translation helper function
  const t = (key: string) => {
    const dict = TRANSLATIONS[language] as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  // Translation helper for subkeys (like tab labels)
  const tTab = (key: string) => {
    const dict = TRANSLATIONS[language].tabs as any;
    return dict[key] !== undefined ? dict[key] : key;
  };

  // Initial loading of a sample CSV for easy onboarding
  useEffect(() => {
    loadSampleCSV("/samples/customers_sales.csv", "customers_sales.csv");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // Load sample CSV from public folder
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

  // Upload custom CSV file
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

  // Process and Analyze CSV Content
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

  // Submit playground query
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !csvContent) return;

    const userQuery = query.trim();
    setQuery("");
    setChatLoading(true);
    
    setChatHistory(prev => [...prev, { role: "user", text: userQuery }]);

    try {
      const response = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvContent,
          query: userQuery,
          language // Pass selected language to AI agent route
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

  // Predefined prompts localized dynamically
  const samplePrompts = language === "es" 
    ? [
        "¿Cuál es el promedio de total_spent en Italia?",
        "Buscar registros que contengan 'SSD'",
        "Mostrar esquema de columnas y tamaño del conjunto de datos",
        "Listar principales clientes activos ordenados por total_spent desc",
        "Promedio de precio de productos agrupado por categoría"
      ]
    : [
        "What is the average total_spent in Italy?",
        "Search for records containing 'SSD'",
        "Show column schema & dataset size",
        "List top active customers sorted by spent desc",
        "Average price of products grouped by category"
      ];

  const navItems: { key: typeof activeTab; icon: React.ReactNode; label: string; disabled?: boolean; sectionLabel?: string }[] = [
    { key: "home",          icon: <Grid size={16} />,              label: tTab("home") },
    { key: "data",          icon: <Database size={16} />,          label: tTab("data"),          sectionLabel: language === "es" ? "Core" : "Core" },
    { key: "playground",    icon: <Play size={16} />,              label: tTab("playground"),    disabled: !parsedData },
    { key: "recipe",        icon: <FileCode size={16} />,          label: tTab("recipe"),        disabled: !parsedData },
    { key: "reconciliation",icon: <ArrowLeftRight size={16} />,    label: tTab("reconciliation"), sectionLabel: language === "es" ? "Aplicaciones" : "Apps" },
    { key: "monthlyClose",  icon: <CalendarCheck size={16} />,     label: tTab("monthlyClose") },
    { key: "taxAlerts",     icon: <Receipt size={16} />,           label: tTab("taxAlerts") },
    { key: "integrations",  icon: <Package size={16} />,           label: tTab("integrations"),  sectionLabel: language === "es" ? "Sistema" : "System" },
    { key: "settings",      icon: <SlidersHorizontal size={16} />, label: tTab("settings") },
  ];

  const renderInlineBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return text;
    return (
      <>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  };

  const renderAgentText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '0.4rem' }} />;
      if (/^[\-\*•]\s/.test(line)) {
        return (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: '0.15rem 0' }}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0, lineHeight: 1.6, fontSize: '0.7rem', marginTop: '0.2rem' }}>▸</span>
            <span style={{ lineHeight: 1.6, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{renderInlineBold(line.slice(2))}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/);
        if (match) return (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: '0.15rem 0' }}>
            <span style={{ color: 'var(--color-primary)', flexShrink: 0, fontWeight: 700, minWidth: '1.2rem', lineHeight: 1.6, fontSize: '0.82rem' }}>{match[1]}.</span>
            <span style={{ lineHeight: 1.6, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{renderInlineBold(match[2])}</span>
          </div>
        );
      }
      if (/^\*\*.*\*\*:?\s*$/.test(line.trim())) {
        return <p key={i} style={{ margin: '0.4rem 0 0.1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{line.replace(/\*\*/g, '')}</p>;
      }
      return <p key={i} style={{ margin: '0.1rem 0', lineHeight: 1.6, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{renderInlineBold(line)}</p>;
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}>

      {/* Collapsible Sidebar — expands on hover, fixed height */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        style={{
          width: sidebarOpen ? "220px" : "52px",
          height: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          background: "var(--bg-surface-solid)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Sidebar logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          padding: sidebarOpen ? "1rem 0.85rem" : "1rem 0",
          borderBottom: "1px solid var(--border-color)",
          minHeight: "60px",
          gap: "0.6rem",
          overflow: "hidden",
          transition: "padding 0.22s ease",
        }}>
          <div className="flex-center" style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            width: "28px", height: "28px", borderRadius: "6px",
            color: "#fff", fontWeight: 800, fontSize: "0.95rem", flexShrink: 0,
            boxShadow: "0 2px 8px var(--color-primary-glow)"
          }}>A</div>
          <span style={{
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.4px",
            background: "linear-gradient(135deg, var(--text-primary) 0%, var(--color-primary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: sidebarOpen ? 1 : 0,
            maxWidth: sidebarOpen ? "160px" : "0px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "opacity 0.15s ease, max-width 0.22s ease",
          }}>
            Agenttis
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto", overflowX: "hidden" }}>
          {navItems.map(item => (
            <React.Fragment key={item.key}>
            {item.sectionLabel && (
              <div style={{
                padding: sidebarOpen ? "0.6rem 0.75rem 0.2rem" : "0.6rem 0 0.2rem",
                fontSize: "0.62rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                overflow: "hidden",
                whiteSpace: "nowrap",
                opacity: sidebarOpen ? 1 : 0,
                transition: "opacity 0.2s ease",
                borderTop: "1px solid var(--border-color)",
                marginTop: "0.25rem",
                textAlign: "left",
              }}>
                {item.sectionLabel}
              </div>
            )}
            <button
              className={`tab-btn ${activeTab === item.key ? "active" : ""}`}
              onClick={() => !item.disabled && setActiveTab(item.key as typeof activeTab)}
              title={!sidebarOpen ? item.label : undefined}
              style={{
                width: "100%",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: "0.6rem",
                padding: "0.5rem 0.75rem",
                opacity: item.disabled ? 0.45 : 1,
                cursor: item.disabled ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: sidebarOpen ? 1 : 0,
                transition: "opacity 0.1s ease",
                maxWidth: sidebarOpen ? "200px" : "0px",
              }}>{item.label}</span>
            </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Sidebar bottom: dark mode toggle */}
        <div style={{
          borderTop: "1px solid var(--border-color)",
          padding: "0.6rem 0.5rem",
          display: "flex",
          justifyContent: sidebarOpen ? "flex-start" : "center",
        }}>
          <button
            onClick={toggleTheme}
            className={`tab-btn`}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            style={{
              width: "100%",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              gap: "0.6rem",
              padding: "0.5rem 0.75rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <span style={{ flexShrink: 0 }}>
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </span>
            <span style={{
              overflow: "hidden",
              opacity: sidebarOpen ? 1 : 0,
              transition: "opacity 0.1s ease",
              maxWidth: sidebarOpen ? "200px" : "0px",
              fontSize: "0.85rem",
            }}>
              {theme === "light" ? (language === "es" ? "Modo Oscuro" : "Dark Mode") : (language === "es" ? "Modo Claro" : "Light Mode")}
            </span>
          </button>
        </div>
      </aside>

      {/* Right column: main + footer */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Floating language selector — top right */}
        <div style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "var(--bg-surface-solid)",
          padding: "0.3rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          <Globe size={14} style={{ color: "var(--text-muted)", marginLeft: "0.25rem" }} />
          <button
            onClick={() => handleLanguageChange("en")}
            style={{
              background: language === "en" ? "var(--color-primary-glow)" : "transparent",
              color: language === "en" ? "var(--color-primary)" : "var(--text-secondary)",
              padding: "0.2rem 0.5rem",
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: language === "en" ? 700 : 500,
              border: "none",
            }}
          >EN</button>
          <button
            onClick={() => handleLanguageChange("es")}
            style={{
              background: language === "es" ? "var(--color-primary-glow)" : "transparent",
              color: language === "es" ? "var(--color-primary)" : "var(--text-secondary)",
              padding: "0.2rem 0.5rem",
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: language === "es" ? 700 : 500,
              border: "none",
            }}
          >ES</button>
        </div>

      {/* Main Content Layout */}
      <main className="container" style={{ flex: 1, padding: "1rem", maxWidth: "1500px" }}>
        
        {/* TAB HOME */}
        {activeTab === "home" && (() => {
          const ht = (TRANSLATIONS[language] as any).home;
          const mockData = parsedData
            ? [{ name: parsedData.fileName ?? "dataset.csv", rows: parsedData.totalRows, cols: parsedData.columns.length, time: "Just now" }]
            : [];
          const mockReports = [
            { name: language === "es" ? "Reporte de Ventas — Jun 2026" : "Sales Report — Jun 2026",       type: language === "es" ? "Ventas" : "Sales",     time: language === "es" ? "Hace 2h" : "2h ago",   status: "success" },
            { name: language === "es" ? "Análisis de Inventario" : "Inventory Analysis",                  type: language === "es" ? "Inventario" : "Stock",  time: language === "es" ? "Hace 5h" : "5h ago",   status: "success" },
            { name: language === "es" ? "Resumen de Clientes Activos" : "Active Customers Summary",       type: language === "es" ? "Clientes" : "CRM",      time: language === "es" ? "Ayer" : "Yesterday",   status: "success" },
          ];
          const mockAlerts = [
            { level: "critical", msg: language === "es" ? "Conector Stripe sin respuesta desde hace 30 min" : "Stripe connector unresponsive for 30 min",   time: language === "es" ? "Hace 10 min" : "10 min ago" },
            { level: "warning",  msg: language === "es" ? "Dataset 'clientes_2024.csv' supera el límite recomendado de filas" : "Dataset 'customers_2024.csv' exceeds recommended row limit", time: language === "es" ? "Hace 1h" : "1h ago" },
            { level: "info",     msg: language === "es" ? "Nueva versión del servidor MCP disponible (v2.1)" : "New MCP server version available (v2.1)",   time: language === "es" ? "Hace 3h" : "3h ago" },
          ];
          const levelColor: Record<string, string> = { critical: "var(--color-danger)", warning: "var(--color-warning)", info: "var(--color-accent)" };
          const levelBadgeClass: Record<string, string> = { critical: "badge-warning", warning: "badge-warning", info: "badge-info" };
          const blockHeader = (_num: number, accent: string, _bg: string, title: string, desc: string) => (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ width: "3px", height: "32px", borderRadius: "2px", background: accent, flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{title}</h3>
                <p style={{ margin: 0, fontSize: "0.78rem" }}>{desc}</p>
              </div>
            </div>
          );

          return (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Page heading */}
              <div>
                <h2 style={{ margin: "0 0 0.2rem 0" }}>{ht.title}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>{ht.subtitle}</p>
              </div>

              {/* Shortcut buttons */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { label: ht.shortcutQueries,     icon: <Search size={20} />,   tab: "playground" },
                  { label: ht.shortcutReports,      icon: <LineChart size={20} />, tab: "monthlyClose" },
                  { label: ht.shortcutData,         icon: <Database size={20} />, tab: "data" },
                  { label: ht.shortcutConnections,  icon: <Link size={20} />,     tab: "integrations" },
                  { label: ht.shortcutMetrics,      icon: <BarChart2 size={20} />,tab: "settings" },
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(s.tab as typeof activeTab)}
                    className="glass-panel glass-panel-interactive"
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "1rem 0.5rem",
                      cursor: "pointer",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: "var(--color-primary)" }}>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Grid: 2 columns, odd last block spans full width */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>

                {/* BLOCK 1 — Last Processed Data */}
                <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
                  {blockHeader(1, "var(--color-primary)", "var(--color-primary-glow)", ht.step1Title, ht.step1Desc)}
                  {mockData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
                      <Database size={22} style={{ marginBottom: "0.5rem", opacity: 0.35, display: "block", margin: "0 auto 0.5rem" }} />
                      <p style={{ margin: 0 }}>{ht.noData}</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {mockData.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <FileCode size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                          </div>
                          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{d.rows} {ht.rowsProcessed}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{d.cols} {ht.columnsDetected}</span>
                            <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{d.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BLOCK 2 — Generated Reports */}
                <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
                  {blockHeader(2, "var(--color-accent)", "rgba(6,182,212,0.12)", ht.step2Title, ht.step2Desc)}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {mockReports.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                          <LineChart size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0 }}>
                          <span className="badge badge-info" style={{ fontSize: "0.65rem" }}>{r.type}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BLOCK 3 — Alerts (spans full width) */}
                <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", gridColumn: "1 / -1" }}>
                  {blockHeader(3, "var(--color-danger)", "rgba(239,68,68,0.1)", ht.step3Title, ht.step3Desc)}
                  {mockAlerts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
                      <ShieldCheck size={22} style={{ marginBottom: "0.5rem", opacity: 0.35, display: "block", margin: "0 auto 0.5rem" }} />
                      <p style={{ margin: 0 }}>{ht.noAlerts}</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {mockAlerts.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", border: `1px solid ${levelColor[a.level]}40` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: levelColor[a.level], flexShrink: 0 }} />
                            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{a.msg}</span>
                          </div>
                          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0 }}>
                            <span className={`badge ${levelBadgeClass[a.level]}`} style={{ fontSize: "0.65rem" }}>
                              {a.level === "critical" ? ht.alertCritical : a.level === "warning" ? ht.alertWarning : ht.alertInfo}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

        {/* TAB 1: DATA CONNECTION HUB */}
        {activeTab === "data" && (() => {
          const sourceCategories = [
            {
              id: "files", label: language === "es" ? "Archivos" : "Files",
              icon: <HardDrive size={20} />, color: "var(--color-primary)",
              sources: [
                { id: "excel", label: "Excel / CSV", desc: ".xlsx, .csv, .xls" },
                { id: "pdf",   label: language === "es" ? "PDF / e-Factura" : "PDF / e-Invoice", desc: ".pdf, .xml DGI" },
              ]
            },
            {
              id: "cloud", label: "Cloud Storage",
              icon: <Cloud size={20} />, color: "var(--color-accent)",
              sources: [
                { id: "gdrive",   label: "Google Drive",   desc: "Sheets, Docs, carpetas" },
                { id: "onedrive", label: "OneDrive",        desc: "Excel, SharePoint" },
                { id: "dropbox",  label: "Dropbox",         desc: language === "es" ? "Archivos y carpetas" : "Files & folders" },
              ]
            },
            {
              id: "database", label: language === "es" ? "Base de Datos" : "Database",
              icon: <Server size={20} />, color: "#8b5cf6",
              sources: [
                { id: "postgres",  label: "PostgreSQL",         desc: "SQL + JSON" },
                { id: "mysql",     label: "MySQL / MariaDB",    desc: "" },
                { id: "sqlserver", label: "SQL Server",         desc: "Microsoft" },
                { id: "gsheets",   label: "Google Sheets API",  desc: "" },
              ]
            },
            {
              id: "accounting", label: language === "es" ? "Software Contable" : "Accounting ERP",
              icon: <Landmark size={20} />, color: "var(--color-warning)",
              sources: [
                { id: "tango",    label: "Tango Gestión",  desc: language === "es" ? "Popular en UY/AR" : "Popular in UY/AR" },
                { id: "bejerman", label: "Bejerman",        desc: "" },
                { id: "xero",     label: "Xero",            desc: "API v2" },
                { id: "odoo",     label: "Odoo",            desc: "Open source" },
              ]
            },
            {
              id: "banks", label: language === "es" ? "Bancos Uruguay" : "Uruguayan Banks",
              icon: <Building2 size={20} />, color: "var(--color-success)",
              sources: [
                { id: "brou",       label: "BROU",            desc: language === "es" ? "Banco República" : "Banco República" },
                { id: "itau",       label: "Itaú Uruguay",    desc: "" },
                { id: "santander",  label: "Santander",       desc: "" },
                { id: "bbva",       label: "BBVA",            desc: "" },
                { id: "scotiabank", label: "Scotiabank",      desc: "" },
              ]
            },
            {
              id: "billing", label: language === "es" ? "Facturación" : "Billing",
              icon: <Receipt size={20} />, color: "#f43f5e",
              sources: [
                { id: "dgi",        label: "e-Factura DGI",   desc: language === "es" ? "Portal DGI Uruguay" : "DGI Uruguay portal" },
                { id: "mercadopago",label: "Mercado Pago",    desc: "API v1" },
                { id: "stripe",     label: "Stripe",           desc: "Payments API" },
              ]
            },
          ];

          const wizardFields: Record<string, {label:string, key:string, type?:string, placeholder?:string}[]> = {
            excel:      [{ label: language === "es" ? "Archivo" : "File", key: "file", type: "file" }],
            pdf:        [{ label: language === "es" ? "Archivo PDF/XML" : "PDF/XML file", key: "file", type: "file" }],
            gdrive:     [{ label: "Folder ID o URL", key: "folder", placeholder: "https://drive.google.com/drive/folders/..." }, { label: language === "es" ? "Cuenta Google" : "Google Account", key: "email", placeholder: "empresa@gmail.com" }],
            onedrive:   [{ label: "SharePoint URL", key: "url", placeholder: "https://empresa.sharepoint.com/..." }],
            dropbox:    [{ label: "Access Token", key: "token", type: "password", placeholder: "sl.B..." }],
            postgres:   [{ label: "Host", key: "host", placeholder: "localhost" }, { label: language === "es" ? "Puerto" : "Port", key: "port", placeholder: "5432" }, { label: language === "es" ? "Base de datos" : "Database", key: "db", placeholder: "contabilidad" }, { label: language === "es" ? "Usuario" : "User", key: "user", placeholder: "admin" }, { label: language === "es" ? "Contraseña" : "Password", key: "pass", type: "password", placeholder: "••••••••" }],
            mysql:      [{ label: "Host", key: "host", placeholder: "localhost" }, { label: language === "es" ? "Puerto" : "Port", key: "port", placeholder: "3306" }, { label: language === "es" ? "Base de datos" : "Database", key: "db", placeholder: "contabilidad" }, { label: language === "es" ? "Usuario" : "User", key: "user", placeholder: "admin" }, { label: language === "es" ? "Contraseña" : "Password", key: "pass", type: "password", placeholder: "••••••••" }],
            sqlserver:  [{ label: "Server", key: "host", placeholder: "SERVIDOR\\INSTANCIA" }, { label: language === "es" ? "Base de datos" : "Database", key: "db", placeholder: "Contabilidad" }, { label: language === "es" ? "Usuario" : "User", key: "user", placeholder: "sa" }, { label: language === "es" ? "Contraseña" : "Password", key: "pass", type: "password", placeholder: "••••••••" }],
            gsheets:    [{ label: "Spreadsheet ID", key: "id", placeholder: "1BxiMVs0XRA5..." }, { label: "Service Account JSON", key: "sa", type: "password", placeholder: "{ ... }" }],
            tango:      [{ label: language === "es" ? "Empresa" : "Company", key: "company", placeholder: "Mi empresa SRL" }, { label: "API Key", key: "key", type: "password", placeholder: "TGO-..." }],
            bejerman:   [{ label: "Host / URL", key: "host", placeholder: "http://servidor:8080" }, { label: language === "es" ? "Usuario" : "User", key: "user" }, { label: language === "es" ? "Contraseña" : "Password", key: "pass", type: "password" }],
            xero:       [{ label: "Client ID", key: "clientId", placeholder: "XXXXXXXX-XXXX-..." }, { label: "Client Secret", key: "secret", type: "password" }],
            odoo:       [{ label: "URL", key: "url", placeholder: "https://miempresa.odoo.com" }, { label: language === "es" ? "Base de datos" : "Database", key: "db" }, { label: language === "es" ? "Usuario" : "User", key: "user" }, { label: "API Key", key: "key", type: "password" }],
            brou:       [{ label: language === "es" ? "N° de cuenta" : "Account No.", key: "account", placeholder: "001-XXXXXXXX-X" }, { label: "Token BROU Open Banking", key: "token", type: "password" }],
            itau:       [{ label: "Client ID", key: "clientId" }, { label: "Client Secret", key: "secret", type: "password" }],
            santander:  [{ label: "API Key Santander", key: "key", type: "password" }],
            bbva:       [{ label: "API Key BBVA", key: "key", type: "password" }],
            scotiabank: [{ label: "API Key Scotiabank", key: "key", type: "password" }],
            dgi:        [{ label: language === "es" ? "RUT empresa" : "Company RUT", key: "rut", placeholder: "21XXXXXXX" }, { label: language === "es" ? "Certificado (.pfx)" : "Certificate (.pfx)", key: "cert", type: "file" }],
            mercadopago:[{ label: "Access Token", key: "token", type: "password", placeholder: "APP_USR-..." }],
            stripe:     [{ label: "Secret Key", key: "key", type: "password", placeholder: "sk_live_..." }],
          };

          const selectedSource = sourceCategories.flatMap(c => c.sources.map(s => ({...s, catColor: c.color, catLabel: c.label}))).find(s => s.id === wizardSourceType);
          const fields = wizardFields[wizardSourceType] ?? [];
          const statusColor = (s: string) => s === "connected" ? "var(--color-success)" : s === "error" ? "var(--color-danger)" : "var(--color-warning)";
          const statusLabel = (s: string) => s === "connected" ? (language === "es" ? "Conectado" : "Connected") : s === "error" ? "Error" : (language === "es" ? "Pendiente" : "Pending");

          const allConnections = [
            ...mockConnections,
            ...(parsedData ? [{ id: "file-active", name: fileName, category: "CSV", status: "connected" as const, lastSync: language === "es" ? "Ahora mismo" : "Just now", records: `${parsedData.totalRows} ${language === "es" ? "filas" : "rows"}` }] : []),
          ];

          return (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* ── Section header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: "0 0 0.2rem" }}>{language === "es" ? "Conexión de Datos" : "Data Connections"}</h2>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>{language === "es" ? "Conectá tus fuentes de datos para que los agentes puedan operar sobre tu información contable." : "Connect your data sources so agents can operate on your accounting data."}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => { setWizardOpen(true); setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); }}
                style={{ flexShrink: 0 }}
              >
                <Plus size={15} /> {language === "es" ? "Agregar Conexión" : "Add Connection"}
              </button>
            </div>

            {/* ── Active connections ── */}
            {allConnections.length > 0 && (
              <div className="glass-panel" style={{ padding: "1rem 1.25rem" }}>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                  {language === "es" ? "Conexiones activas" : "Active connections"} ({allConnections.length})
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {allConnections.map(conn => (
                    <div key={conn.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "9999px", fontSize: "0.8rem" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: statusColor(conn.status), flexShrink: 0, boxShadow: conn.status === "connected" ? `0 0 6px ${statusColor(conn.status)}` : "none" }} />
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{conn.name}</span>
                      <span style={{ color: "var(--text-muted)" }}>·</span>
                      <span style={{ color: "var(--text-muted)" }}>{conn.category}</span>
                      <span style={{ color: "var(--text-muted)" }}>·</span>
                      <span style={{ color: "var(--text-muted)" }}>{conn.records}</span>
                      <button onClick={() => setMockConnections(prev => prev.filter(c => c.id !== conn.id))} style={{ background: "none", border: "none", padding: "0 0 0 0.2rem", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Drag & Drop zone ── */}
            <div
              style={{ border: "2px dashed var(--border-color)", borderRadius: "var(--radius-lg)", padding: "2.5rem 1rem", textAlign: "center", cursor: "pointer", background: "var(--bg-surface-solid)", transition: "all var(--transition-fast)", position: "relative" }}
              onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)"; (e.currentTarget as HTMLElement).style.background = "var(--color-primary-glow)"; }}
              onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-solid)"; }}
              onDrop={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-solid)";
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                if (file.name.endsWith(".csv")) {
                  setLoading(true);
                  const reader = new FileReader();
                  reader.onload = async (ev) => { await processCSVData(ev.target?.result as string, file.name); setLoading(false); };
                  reader.readAsText(file);
                } else {
                  setAnalysisError(language === "es" ? `Formato .${file.name.split('.').pop()} detectado. Por ahora solo CSV es procesable en demo — el resto se conecta vía 'Agregar Conexión'.` : `Format .${file.name.split('.').pop()} detected. Only CSV is processable in demo — others connect via 'Add Connection'.`);
                }
              }}
            >
              <input type="file" accept=".csv,.xlsx,.xls,.pdf,.xml" onChange={handleFileUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              <Upload size={36} style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }} />
              <p style={{ color: "var(--text-primary)", fontWeight: 600, margin: "0 0 0.35rem", fontSize: "0.95rem" }}>
                {language === "es" ? "Arrastrá o hacé clic para cargar un archivo" : "Drag & drop or click to upload a file"}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                {language === "es" ? "Soporta CSV (procesable), Excel, PDF, XML e-Factura" : "Supports CSV (processable), Excel, PDF, XML e-Invoice"}
              </p>
              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginTop: "1rem" }}>
                {[".csv", ".xlsx", ".pdf", ".xml"].map(ext => (
                  <span key={ext} style={{ padding: "0.15rem 0.5rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{ext}</span>
                ))}
              </div>
            </div>

            {analysisError && (
              <div style={{ padding: "0.6rem 1rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "var(--radius-sm)", color: "var(--color-danger)", fontSize: "0.82rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <XCircle size={15} style={{ flexShrink: 0, marginTop: "0.1rem" }} /> {analysisError}
              </div>
            )}

            {/* ── Source type grid ── */}
            <div>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                {language === "es" ? "Tipos de fuente disponibles" : "Available source types"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
                {sourceCategories.map(cat => (
                  <div key={cat.id} className="glass-panel glass-panel-interactive" style={{ padding: "1rem 1.25rem", cursor: "pointer" }}
                    onClick={() => { setWizardSourceType(cat.sources[0].id); setWizardOpen(true); setWizardStep(1); setWizardConfig({}); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      <div style={{ color: cat.color, display: "flex" }}>{cat.icon}</div>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>{cat.label}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {cat.sources.slice(0, 3).map(s => (
                        <span key={s.id} style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-secondary)" }}>{s.label}</span>
                      ))}
                      {cat.sources.length > 3 && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>+{cat.sources.length - 3}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Demo sample datasets ── */}
            <div>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                {language === "es" ? "Datasets de demo" : "Demo datasets"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { file: "customers_sales.csv", label: t("demoCustomers"), desc: t("demoCustomersDesc"), icon: <Table size={16} /> },
                  { file: "inventory_items.csv", label: t("demoInventory"), desc: t("demoInventoryDesc"), icon: <FolderOpen size={16} /> },
                ].map(demo => (
                  <div key={demo.file} className="glass-panel glass-panel-interactive"
                    onClick={() => loadSampleCSV(`/samples/${demo.file}`, demo.file)}
                    style={{ padding: "0.9rem 1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", background: fileName === demo.file ? "var(--color-primary-glow)" : "var(--bg-surface-solid)", borderColor: fileName === demo.file ? "var(--color-primary)" : "var(--border-color)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: fileName === demo.file ? "var(--color-primary)" : "var(--text-muted)" }}>{demo.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem", color: fileName === demo.file ? "var(--color-primary)" : "var(--text-primary)" }}>{demo.label}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{demo.desc}</p>
                      </div>
                    </div>
                    <ArrowRight size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Loaded data: schema + preview ── */}
            {loading ? (
              <div className="glass-panel flex-center" style={{ height: "200px", flexDirection: "column", gap: "0.75rem" }}>
                <div className="spinner" /><p style={{ color: "var(--text-secondary)" }}>{t("analyzingMessage")}</p>
              </div>
            ) : parsedData ? (
              <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
                <div className="glass-panel" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h3 style={{ margin: 0 }}>{t("schemaTitle")}</h3>
                      <span className="info-tooltip"><Info size={14} /><span className="tooltip-text">{t("schemaSubtitle")}</span></span>
                    </div>
                    <span className="badge badge-success">{t("rowsDetected").replace("{rows}", parsedData.totalRows)}</span>
                  </div>
                  <div style={{ maxHeight: "280px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th>{t("schemaHeaderField")}</th><th>{t("schemaHeaderType")}</th><th>{t("schemaHeaderSamples")}</th></tr></thead>
                      <tbody>
                        {parsedData.columns.map((col: any, idx: number) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{col.name}</td>
                            <td><span className={`badge ${col.type === "number" ? "badge-success" : col.type === "date" ? "badge-info" : col.type === "boolean" ? "badge-warning" : "btn-secondary"}`} style={{ fontSize: "0.65rem" }}>{col.type}</span></td>
                            <td style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{col.sampleValues.slice(0, 3).map(String).join(", ")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ margin: 0 }}>{t("previewTitle")} ({fileName})</h3>
                    <span className="info-tooltip"><Info size={14} /><span className="tooltip-text">{t("previewSubtitle")}</span></span>
                  </div>
                  <div className="table-container" style={{ maxHeight: "280px", overflowY: "auto" }}>
                    <table>
                      <thead><tr>{parsedData.columns.map((col: any, idx: number) => <th key={idx}>{col.name}</th>)}</tr></thead>
                      <tbody>{previewRows.map((row: any, rIdx: number) => <tr key={rIdx}>{parsedData.columns.map((col: any, cIdx: number) => <td key={cIdx}>{row[col.name] !== undefined ? String(row[col.name]) : ""}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: "1rem", padding: "0.7rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Zap size={16} style={{ color: "var(--color-primary)" }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.85rem" }}>{t("tokenOptimizations")}</h4>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-secondary)" }}>{t("tokenPayloadDesc").replace("{tokens}", parsedData.fullCsvTokens.toLocaleString())}</p>
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setActiveTab("playground")} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", flexShrink: 0 }}>
                      {t("openPlaygroundBtn")} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* ── Wizard Modal ── */}
            {wizardOpen && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
                onClick={(e) => { if (e.target === e.currentTarget) setWizardOpen(false); }}>
                <div className="glass-panel" style={{ width: "100%", maxWidth: "620px", padding: "1.75rem", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>

                  {/* Modal header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                      <h3 style={{ margin: "0 0 0.2rem" }}>{language === "es" ? "Nueva Conexión" : "New Connection"}</h3>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {[1,2,3].map(n => (
                          <div key={n} style={{ height: "3px", width: "40px", borderRadius: "2px", background: wizardStep >= n ? "var(--color-primary)" : "var(--border-color)", transition: "background 0.2s" }} />
                        ))}
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>{language === "es" ? `Paso ${wizardStep} de 3` : `Step ${wizardStep} of 3`}</span>
                      </div>
                    </div>
                    <button onClick={() => setWizardOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}>
                      <X size={18} />
                    </button>
                  </div>

                  {/* Step 1 — Choose source */}
                  {wizardStep === 1 && (
                    <div>
                      <p style={{ margin: "0 0 1rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                        {language === "es" ? "¿Desde dónde querés traer los datos?" : "Where do you want to bring data from?"}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {sourceCategories.map(cat => (
                          <div key={cat.id}>
                            <p style={{ margin: "0 0 0.4rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>{cat.label}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                              {cat.sources.map(src => (
                                <button key={src.id}
                                  onClick={() => { setWizardSourceType(src.id); setWizardStep(2); setWizardConfig({}); }}
                                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem", fontWeight: 600, borderRadius: "var(--radius-sm)", border: `1px solid ${wizardSourceType === src.id ? cat.color : "var(--border-color)"}`, background: wizardSourceType === src.id ? `${cat.color}20` : "var(--bg-surface-solid)", color: wizardSourceType === src.id ? cat.color : "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s" }}>
                                  {src.label}
                                  {src.desc && <span style={{ fontWeight: 400, marginLeft: "0.3rem", opacity: 0.6, fontSize: "0.72rem" }}>· {src.desc}</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Configuration */}
                  {wizardStep === 2 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", padding: "0.6rem 0.85rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                        <span style={{ color: selectedSource?.catColor ?? "var(--color-primary)", fontSize: "1.1rem" }}>⬡</span>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{selectedSource?.label}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>— {selectedSource?.catLabel}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        {fields.map(f => (
                          <div key={f.key}>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.3rem" }}>{f.label}</label>
                            {f.type === "file"
                              ? <input type="file" onChange={e => setWizardConfig(prev => ({ ...prev, [f.key]: e.target.files?.[0]?.name ?? "" }))} style={{ fontSize: "0.82rem" }} />
                              : <input type={f.type ?? "text"} placeholder={f.placeholder} value={wizardConfig[f.key] ?? ""} onChange={e => setWizardConfig(prev => ({ ...prev, [f.key]: e.target.value }))} />
                            }
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                        <button className="btn btn-secondary" onClick={() => setWizardStep(1)}>{language === "es" ? "← Volver" : "← Back"}</button>
                        <button className="btn btn-primary" disabled={wizardConnecting} onClick={() => {
                          setWizardConnecting(true);
                          setTimeout(() => { setWizardConnecting(false); setWizardStep(3); }, 1400);
                        }}>
                          {wizardConnecting ? <><RefreshCw size={13} style={{ animation: "spin 0.8s linear infinite" }} /> {language === "es" ? "Conectando..." : "Connecting..."}</> : <><Wifi size={13} /> {language === "es" ? "Probar conexión" : "Test connection"}</>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Success */}
                  {wizardStep === 3 && (
                    <div style={{ textAlign: "center", padding: "1rem 0" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "2px solid var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                        <CheckCircle2 size={28} style={{ color: "var(--color-success)" }} />
                      </div>
                      <h3 style={{ margin: "0 0 0.4rem" }}>{language === "es" ? "¡Conexión exitosa!" : "Connection successful!"}</h3>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: "0 0 0.5rem" }}>
                        <strong style={{ color: "var(--text-primary)" }}>{selectedSource?.label}</strong> {language === "es" ? "está lista para usarse con los agentes contables." : "is ready to use with accounting agents."}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1.75rem" }}>
                        {language === "es" ? "Los datos estarán disponibles en Conciliación, Cierre Mensual y Alertas Fiscales." : "Data will be available in Reconciliation, Monthly Close and Tax Alerts."}
                      </p>
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                        <button className="btn btn-secondary" onClick={() => { setWizardStep(1); setWizardSourceType(""); setWizardConfig({}); }}>
                          {language === "es" ? "Agregar otra" : "Add another"}
                        </button>
                        <button className="btn btn-primary" onClick={() => {
                          setMockConnections(prev => [...prev, { id: `conn-${Date.now()}`, name: selectedSource?.label ?? wizardSourceType, category: selectedSource?.catLabel ?? "", status: "connected", lastSync: language === "es" ? "Ahora mismo" : "Just now", records: language === "es" ? "Sincronizando..." : "Syncing..." }]);
                          setWizardOpen(false);
                        }}>
                          {language === "es" ? "Comenzar a usar →" : "Start using →"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
          );
        })()}

        {/* TAB 2: PLAYGROUND INTERACTIVE CHAT */}
        {activeTab === "playground" && parsedData && (
          <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.25rem", height: "calc(100vh - 170px)" }}>
            
            {/* Left Column Chat frame */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.25rem" }}>
              <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{t("playTitle")}</h3>
                    <span className="info-tooltip">
                      <Info size={14} />
                      <span className="tooltip-text">{t("playSubtitle").replace("{fileName}", fileName)}</span>
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setChatHistory([])}
                  className="btn btn-secondary"
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                >
                  {t("clearChat")}
                </button>
              </div>

              {/* Message loop */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "0.4rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                marginBottom: "0.75rem"
              }}>
                {chatHistory.length === 0 ? (
                  <div style={{ margin: "auto", maxWidth: "450px", textAlign: "center", padding: "1.5rem" }}>
                    <Cpu size={36} style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }} />
                    <h4 style={{ marginBottom: "0.4rem" }}>{t("noMessages")}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                      {t("noMessagesDesc")}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {samplePrompts.slice(0, 3).map((p, i) => (
                        <div
                          key={i}
                          className="glass-panel glass-panel-interactive"
                          onClick={() => setQuery(p)}
                          style={{
                            padding: "0.5rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            textAlign: "left",
                            background: "var(--bg-surface-solid)"
                          }}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: msg.role === "user" ? "row-reverse" : "row",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: msg.role === "user" ? "var(--color-primary)" : "var(--bg-surface-hover)",
                        border: "1px solid",
                        borderColor: msg.role === "user" ? "var(--color-primary)" : "var(--border-color)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: msg.role === "user" ? "#fff" : "var(--color-accent)",
                        marginTop: "0.1rem",
                      }}>
                        {msg.role === "user" ? "Tú" : <Cpu size={14} />}
                      </div>

                      {/* Bubble + meta */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", maxWidth: "82%", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", paddingLeft: msg.role === "agent" ? "0.1rem" : 0, paddingRight: msg.role === "user" ? "0.1rem" : 0 }}>
                          {msg.role === "user" ? (language === "es" ? "Tú" : "You") : "Agenttis"}
                        </span>

                        <div style={{
                          padding: "0.75rem 1rem",
                          background: msg.role === "user" ? "var(--color-primary)" : "var(--bg-surface-solid)",
                          border: "1px solid",
                          borderColor: msg.role === "user" ? "var(--color-primary)" : "var(--border-color)",
                          borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                          wordBreak: "break-word",
                          color: msg.role === "user" ? "#fff" : "var(--text-secondary)",
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                          boxShadow: msg.role === "user" ? "0 2px 12px var(--color-primary-glow)" : "0 2px 8px rgba(0,0,0,0.15)",
                        }}>
                          {msg.role === "user"
                            ? msg.text
                            : <div style={{ display: "flex", flexDirection: "column", gap: "0.05rem" }}>{renderAgentText(msg.text)}</div>
                          }
                        </div>

                        {msg.role === "agent" && msg.metrics && (
                          <div style={{
                            display: "flex",
                            gap: "0.5rem",
                            fontSize: "0.68rem",
                            color: "var(--text-muted)",
                            alignItems: "center",
                            paddingLeft: "0.1rem",
                          }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "var(--color-success)" }}>
                              <Zap size={9} /> {t("tokensSaved").replace("{percent}", msg.metrics.savingsPercent)}
                            </span>
                            <span style={{ color: "var(--border-color)" }}>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                              <Clock size={9} /> {msg.metrics.mcpLatency}ms
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {chatLoading && (
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "0.6rem" }}>
                    <div style={{
                      flexShrink: 0, width: "30px", height: "30px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)",
                      color: "var(--color-accent)", marginTop: "0.1rem",
                    }}>
                      <Cpu size={14} />
                    </div>
                    <div style={{
                      padding: "0.75rem 1rem",
                      background: "var(--bg-surface-solid)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px 16px 16px 16px",
                      display: "flex", gap: "0.3rem", alignItems: "center",
                    }}>
                      <span className="typing-dot" />
                      <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                      <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleQuerySubmit} style={{ display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  disabled={chatLoading}
                />
                <button type="submit" className="btn btn-primary" disabled={chatLoading || !query.trim()}>
                  {t("sendBtn")} <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Right Column details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%", overflowY: "auto" }}>

              {/* Link to Settings */}
              <div
                className="glass-panel glass-panel-interactive"
                onClick={() => setActiveTab("settings")}
                style={{ padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingDown size={14} style={{ color: "var(--color-primary)" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{t("efficiencyTitle")}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{language === "es" ? "Ver en Configuración" : "See in Settings"}</span>
                  <ArrowRight size={13} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>

              {/* Traces */}
              <div className="glass-panel" style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <Cpu size={16} style={{ color: "var(--color-primary)" }} /> {t("reasoningTrace")}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  {t("reasoningDesc")}
                </p>

                {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "agent" && chatHistory[chatHistory.length - 1].trace ? (
                  (() => {
                    const currentTrace = chatHistory[chatHistory.length - 1].trace;
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", flex: 1 }}>
                        {currentTrace.map((step: any, idx: number) => (
                          <div 
                            key={idx} 
                            style={{
                              border: "1px solid var(--border-color)",
                              borderRadius: "var(--radius-sm)",
                              overflow: "hidden",
                              background: selectedTraceStep === step.step ? "var(--bg-surface-solid)" : "transparent"
                            }}
                          >
                            <div 
                              onClick={() => setSelectedTraceStep(selectedTraceStep === step.step ? null : step.step)}
                              style={{
                                padding: "0.5rem 0.75rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                borderBottom: selectedTraceStep === step.step ? "1px solid var(--border-color)" : "none"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}>
                                <span className="flex-center" style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  background: step.type === "thought" ? "var(--color-primary-glow)" : step.type === "tool_call" ? "rgba(6,182,212,0.1)" : step.type === "tool_response" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                                  color: step.type === "thought" ? "var(--color-primary)" : step.type === "tool_call" ? "var(--color-accent)" : step.type === "tool_response" ? "var(--color-success)" : "var(--text-primary)",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold"
                                }}>
                                  {step.step}
                                </span>
                                <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.02em", color: step.type === "thought" ? "var(--color-primary)" : step.type === "tool_call" ? "var(--color-accent)" : step.type === "tool_response" ? "var(--color-success)" : "var(--text-primary)" }}>
                                  {step.type}
                                </span>
                              </div>
                              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                                {selectedTraceStep === step.step ? (language === "es" ? "Contraer" : "Collapse") : (language === "es" ? "Expandir" : "Expand")}
                              </span>
                            </div>

                            {selectedTraceStep === step.step && (
                              <div style={{ padding: "0.6rem 0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                <p style={{ margin: "0 0 0.4rem 0", color: "var(--text-primary)", fontSize: "0.8rem", lineHeight: "1.4" }}>{step.message}</p>
                                
                                {step.details && (
                                  <pre style={{
                                    margin: 0,
                                    padding: "0.5rem",
                                    background: "#02040a",
                                    borderRadius: "4px",
                                    border: "1px solid var(--border-color)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    overflowX: "auto",
                                    whiteSpace: "pre-wrap",
                                    color: "#f8fafc"
                                  }}>
                                    {JSON.stringify(step.details, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex-center" style={{ flex: 1, border: "1px dashed var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {t("reasoningLogsPlaceholder")}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: GENERATED MCP SERVER CODE */}
        {activeTab === "recipe" && parsedData && (
          <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "1.25rem" }}>
            
            {/* Overview schema */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h3 style={{ marginBottom: "0.4rem" }}>{t("mcpOverviewTitle")}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  {t("mcpOverviewDesc")}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("serverIdentity")}</div>
                    <div style={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "0.85rem" }}>{parsedData.mcpSchema.serverName}</div>
                  </div>

                  <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {t("availableTools").replace("{count}", parsedData.mcpSchema.tools.length)}
                    </div>
                    <ul style={{ paddingLeft: "1rem", margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {parsedData.mcpSchema.tools.map((t: any, idx: number) => (
                        <li key={idx} style={{ marginBottom: "0.15rem" }}>
                          <strong style={{ color: "var(--text-primary)" }}>{t.name}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: "0.6rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("mcpVersion")}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>v1.0.0</div>
                  </div>
                </div>
              </div>

              {/* Direct instructions */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-success)" }} /> {t("setupInstructionsTitle")}
                </h4>
                <ol style={{ paddingLeft: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <li>{t("setupStep1")}</li>
                  <li>{t("setupStep2")}</li>
                  <li>{t("setupStep3").replace("{fileName}", fileName)}</li>
                  <li>{t("setupStep4")}</li>
                  <li>{t("setupStep5")}</li>
                </ol>
              </div>
            </div>

            {/* Script area */}
            <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{t("generatedScriptTitle")}</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("generatedScriptDesc")}</p>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => copyToClipboard(parsedData.generatedServerCode)}
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                  >
                    <Copy size={12} /> {t("copyScript")}
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => downloadFile(parsedData.generatedServerCode, "mcp-server-index.js")}
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                  >
                    <Download size={12} /> {t("downloadScript")}
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, position: "relative", minHeight: "400px" }}>
                <pre className="code-block" style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  margin: 0,
                  fontSize: "0.8rem",
                  lineHeight: "1.4"
                }}>
                  {parsedData.generatedServerCode}
                </pre>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: METRICS & OBSERVABILITY SUMMARY — content moved to Settings */}
        {false && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Cumulative count blocks */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              
              <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="flex-center" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--color-primary-glow)", color: "var(--color-primary)" }}>
                  <Play size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("queriesProcessed")}</div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{stats.totalQueries}</h2>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="flex-center" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "rgba(6, 182, 212, 0.1)", color: "var(--color-accent)" }}>
                  <Coins size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("avgTokensSaved")}</div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-accent)" }}>{stats.avgSavingsPercent}%</h2>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="flex-center" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)" }}>
                  <LineChart size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("cumCostSaved")}</div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-success)" }}>
                    ${stats.totalCostSaved.toFixed(4)} <span style={{ fontSize: "0.65rem", fontWeight: "normal", color: "var(--text-muted)" }}>USD</span>
                  </h2>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="flex-center" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "rgba(245, 158, 11, 0.1)", color: "var(--color-warning)" }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{t("speedup")}</div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-warning)" }}>
                    {stats.avgMcpLatency > 0 ? `${(stats.avgFullLatency / stats.avgMcpLatency).toFixed(1)}x` : "0x"}
                  </h2>
                </div>
              </div>

            </div>

            {/* Layout grids for bars */}
            <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
              
              {/* Token savings */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{t("tokenCompTitle")}</h3>
                
                {stats.totalQueries > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "0.5rem 0" }}>
                    
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                        <span>{t("fullContext")} (Without MCP)</span>
                        <strong style={{ color: "var(--color-danger)" }}>{stats.totalFullTokens.toLocaleString()} Tokens</strong>
                      </div>
                      <div style={{ height: "16px", background: "var(--bg-surface-solid)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        <div style={{ height: "100%", width: "100%", background: "var(--color-danger)" }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                        <span>{t("mcpTool")} (Agenttis)</span>
                        <strong style={{ color: "var(--color-success)" }}>{stats.totalMcpTokens.toLocaleString()} Tokens</strong>
                      </div>
                      <div style={{ height: "16px", background: "var(--bg-surface-solid)", borderRadius: "8px", overflow: "hidden", position: "relative", border: "1px solid var(--border-color)" }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.max(5, (stats.totalMcpTokens / stats.totalFullTokens) * 100)}%`,
                          background: "var(--color-success)"
                        }}></div>
                      </div>
                    </div>

                    <div style={{
                      padding: "0.75rem",
                      background: "var(--color-success-glow)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      color: "var(--color-success)"
                    }}>
                      {t("savingsStatDesc")
                        .replace("{tokens}", stats.totalTokensSaved.toLocaleString())
                        .replace("{percent}", String(stats.avgSavingsPercent))}
                    </div>

                  </div>
                ) : (
                  <div className="flex-center" style={{ height: "180px", color: "var(--text-muted)" }}>
                    {t("observabilityPlaceholder")}
                  </div>
                )}
              </div>

              {/* Latency averages */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>{t("latencyCompTitle")}</h3>
                
                {stats.totalQueries > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "0.5rem 0" }}>
                    
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                        <span>Full Context Inference Latency</span>
                        <strong style={{ color: "var(--color-danger)" }}>{stats.avgFullLatency} ms</strong>
                      </div>
                      <div style={{ height: "16px", background: "var(--bg-surface-solid)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        <div style={{ height: "100%", width: "100%", background: "var(--color-warning)" }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                        <span>MCP Server Tool Call Latency</span>
                        <strong style={{ color: "var(--color-success)" }}>{stats.avgMcpLatency} ms</strong>
                      </div>
                      <div style={{ height: "16px", background: "var(--bg-surface-solid)", borderRadius: "8px", overflow: "hidden", position: "relative", border: "1px solid var(--border-color)" }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.max(8, (stats.avgMcpLatency / stats.avgFullLatency) * 100)}%`,
                          background: "var(--color-success)"
                        }}></div>
                      </div>
                    </div>

                    <div style={{
                      padding: "0.75rem",
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      color: "var(--color-warning)"
                    }}>
                      {t("speedupStatDesc").replace("{x}", (stats.avgFullLatency / stats.avgMcpLatency).toFixed(1))}
                    </div>

                  </div>
                ) : (
                  <div className="flex-center" style={{ height: "180px", color: "var(--text-muted)" }}>
                    {t("observabilityPlaceholder")}
                  </div>
                )}
              </div>

            </div>

            {/* Trace Table */}
            <div className="glass-panel" style={{ padding: "1.25rem" }}>
              <h3 style={{ marginBottom: "0.75rem" }}>{t("traceLogTitle")}</h3>
              
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t("logHeaderTime")}</th>
                      <th>{t("logHeaderQuery")}</th>
                      <th>{t("logHeaderTool")}</th>
                      <th>{t("logHeaderTokens")}</th>
                      <th>{t("logHeaderSavings")}</th>
                      <th>{t("logHeaderCost")}</th>
                      <th>{t("logHeaderSpeed")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observabilityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                          {t("noLogsMessage")}
                        </td>
                      </tr>
                    ) : (
                      observabilityLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.timestamp}</td>
                          <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.query}</td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>
                            <span className="badge badge-info">{log.toolCalled}</span>
                          </td>
                          <td>{log.metrics.mcpTokens}</td>
                          <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>-{log.metrics.savingsPercent}%</td>
                          <td style={{ color: "var(--color-success)" }}>+${log.metrics.costSaved.toFixed(5)}</td>
                          <td>{log.metrics.mcpLatency}ms</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: INTEGRATION CATALOG RECIPES */}
        {activeTab === "integrations" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="glass-panel" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Settings size={20} style={{ color: "var(--color-primary)" }} />
                <h2 style={{ margin: 0 }}>{t("catalogTitle")}</h2>
                <span className="info-tooltip">
                  <Info size={15} />
                  <span className="tooltip-text">{t("catalogSubtitle")}</span>
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              
              {/* Stripe checkout card */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>💳</span>
                    <span className="badge badge-success">Ready</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("stripeTitle")}</h3>
                    <span className="info-tooltip">
                      <Info size={14} />
                      <span className="tooltip-text">{t("stripeDesc")}</span>
                    </span>
                  </div>
                  
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("stripeReadTrans")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("stripeWriteRefund")}</span>
                      <span style={{ color: "var(--text-muted)" }}>DISABLED</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Stripe connection simulated!")}>
                  {t("configureConn")}
                </button>
              </div>

              {/* HubSpot CRM card */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>🎯</span>
                    <span className="badge badge-success">Ready</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("hubspotTitle")}</h3>
                    <span className="info-tooltip">
                      <Info size={14} />
                      <span className="tooltip-text">{t("hubspotDesc")}</span>
                    </span>
                  </div>
                  
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("hubspotReadPipe")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("hubspotCreateCont")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("HubSpot connection simulated!")}>
                  {t("configureConn")}
                </button>
              </div>

              {/* Notion Connection card */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>📝</span>
                    <span className="badge badge-success">Ready</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("notionTitle")}</h3>
                    <span className="info-tooltip">
                      <Info size={14} />
                      <span className="tooltip-text">{t("notionDesc")}</span>
                    </span>
                  </div>
                  
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("notionSearch")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("notionCreate")}</span>
                      <span style={{ color: "var(--text-muted)" }}>OFF</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Notion connection simulated!")}>
                  {t("configureConn")}
                </button>
              </div>

              {/* Slack Connection card */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>💬</span>
                    <span className="badge badge-warning" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}>Beta</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{t("slackTitle")}</h3>
                    <span className="info-tooltip">
                      <Info size={14} />
                      <span className="tooltip-text">{t("slackDesc")}</span>
                    </span>
                  </div>
                  
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("slackReadMsg")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span>{t("slackPostNotif")}</span>
                      <span style={{ color: "var(--color-success)", fontWeight: 700 }}>ON</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: "100%", marginTop: "1rem", padding: "0.4rem", fontSize: "0.8rem" }} onClick={() => alert("Slack integration is currently in beta.")}>
                  {t("requestAccess")}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB: BANK RECONCILIATION */}
        {activeTab === "reconciliation" && (() => {
          const bankRows = [
            { date: "02/06/2025", desc: language === "es" ? "Cobro factura #1042 — Cliente ABC" : "Invoice #1042 — Client ABC", amount: 45200, matched: true },
            { date: "04/06/2025", desc: language === "es" ? "Pago proveedor Impresos SA" : "Supplier payment Impresos SA", amount: -12500, matched: true },
            { date: "07/06/2025", desc: language === "es" ? "Transferencia recibida" : "Incoming transfer", amount: 18000, matched: false },
            { date: "10/06/2025", desc: language === "es" ? "Débito automático ANTEL" : "Direct debit ANTEL", amount: -3200, matched: true },
            { date: "14/06/2025", desc: "Redpagos — DGI IVA", amount: -28600, matched: false },
            { date: "18/06/2025", desc: language === "es" ? "Cobro factura #1055 — Cliente XYZ" : "Invoice #1055 — Client XYZ", amount: 67000, matched: true },
          ];
          const matched = bankRows.filter(r => r.matched).length;
          const unmatched = bankRows.filter(r => !r.matched).length;
          const totalBank = bankRows.reduce((s, r) => s + r.amount, 0);
          const totalBooks = totalBank - 5400;
          return (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("reconciliationTitle")}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("reconciliationSubtitle")}</p>
              </div>

              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {[
                  { label: t("reconciliationBank"), value: `$${totalBank.toLocaleString()}`, color: "var(--color-primary)", icon: <Landmark size={16} /> },
                  { label: t("reconciliationBooks"), value: `$${totalBooks.toLocaleString()}`, color: "var(--color-accent)", icon: <FileText size={16} /> },
                  { label: t("reconciliationMatched"), value: matched, color: "var(--color-success)", icon: <CheckCircle2 size={16} /> },
                  { label: t("reconciliationUnmatched"), value: unmatched, color: "var(--color-danger)", icon: <XCircle size={16} /> },
                ].map((card, i) => (
                  <div key={i} className="glass-panel" style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: card.color, marginBottom: "0.4rem" }}>
                      {card.icon}
                      <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{card.label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Difference banner */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertTriangle size={15} style={{ color: "var(--color-danger)" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t("reconciliationDiff")}</span>
                </div>
                <strong style={{ color: "var(--color-danger)", fontSize: "1rem" }}>$5.400</strong>
              </div>

              {/* Movements table */}
              <div className="glass-panel" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{t("reconciliationBank")} — Junio 2025</h3>
                  <button className="btn btn-primary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }}>
                    <ArrowLeftRight size={13} /> {t("reconciliationRunBtn")}
                  </button>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ fontSize: "0.78rem" }}>{language === "es" ? "Fecha" : "Date"}</th>
                        <th style={{ fontSize: "0.78rem" }}>{language === "es" ? "Descripción" : "Description"}</th>
                        <th style={{ fontSize: "0.78rem", textAlign: "right" }}>{language === "es" ? "Importe" : "Amount"}</th>
                        <th style={{ fontSize: "0.78rem", textAlign: "center" }}>{language === "es" ? "Estado" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>{row.date}</td>
                          <td style={{ fontSize: "0.8rem" }}>{row.desc}</td>
                          <td style={{ fontSize: "0.8rem", textAlign: "right", fontWeight: 600, color: row.amount > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                            {row.amount > 0 ? "+" : ""}${Math.abs(row.amount).toLocaleString()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {row.matched
                              ? <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{t("reconciliationMatched")}</span>
                              : <span className="badge badge-warning" style={{ fontSize: "0.65rem" }}>{t("reconciliationPending")}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: MONTHLY CLOSE */}
        {activeTab === "monthlyClose" && (() => {
          const period = "Junio 2025";
          const steps = [
            { id: 1, label: language === "es" ? "Importar extractos bancarios" : "Import bank statements", status: "done", detail: language === "es" ? "BROU, Itaú — 6 movimientos importados" : "BROU, Itaú — 6 movements imported" },
            { id: 2, label: language === "es" ? "Conciliación bancaria" : "Bank reconciliation", status: "warning", detail: language === "es" ? "2 movimientos sin conciliar ($5.400)" : "2 unmatched movements ($5,400)" },
            { id: 3, label: language === "es" ? "Verificar facturas emitidas (e-Factura DGI)" : "Verify issued invoices (DGI e-Invoice)", status: "done", detail: language === "es" ? "14 facturas — todas enviadas a DGI" : "14 invoices — all sent to DGI" },
            { id: 4, label: language === "es" ? "Verificar facturas recibidas" : "Verify received invoices", status: "done", detail: language === "es" ? "9 facturas registradas" : "9 invoices registered" },
            { id: 5, label: language === "es" ? "Calcular IVA del período (22% / 10%)" : "Calculate period VAT (22% / 10%)", status: "warning", detail: language === "es" ? "IVA a pagar: $28.600 — vence 20/07" : "VAT payable: $28,600 — due 07/20" },
            { id: 6, label: language === "es" ? "Liquidar BPS del mes" : "Calculate monthly BPS", status: "pending", detail: language === "es" ? "Pendiente de cálculo" : "Pending calculation" },
            { id: 7, label: language === "es" ? "Registrar pago IRAE (anticipo)" : "Register IRAE advance payment", status: "pending", detail: language === "es" ? "Vence 10/07" : "Due 07/10" },
            { id: 8, label: language === "es" ? "Cierre y asientos de ajuste" : "Closing entries and adjustments", status: "pending", detail: language === "es" ? "Requiere pasos anteriores" : "Requires previous steps" },
          ];
          const done = steps.filter(s => s.status === "done").length;
          const pct = Math.round((done / steps.length) * 100);
          const statusIcon = (s: string) => s === "done" ? <CheckCircle2 size={16} style={{ color: "var(--color-success)", flexShrink: 0 }} /> : s === "warning" ? <AlertTriangle size={16} style={{ color: "var(--color-warning)", flexShrink: 0 }} /> : <CircleDot size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />;
          const statusBg = (s: string) => s === "done" ? "rgba(16,185,129,0.06)" : s === "warning" ? "rgba(245,158,11,0.06)" : "transparent";
          return (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "760px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("monthlyCloseTitle")}</h2>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("monthlyCloseSubtitle")}</p>
                </div>
                <span className="badge badge-info" style={{ fontSize: "0.78rem", padding: "0.25rem 0.75rem" }}>{period}</span>
              </div>

              {/* Progress bar */}
              <div className="glass-panel" style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 600 }}>{t("monthlyCloseProgress")}</span>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{done}/{steps.length} — {pct}%</span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px", transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: statusBg(step.status), border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    {statusIcon(step.status)}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{step.label}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem" }}>{step.detail}</p>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>#{step.id}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* TAB: TAX ALERTS */}
        {activeTab === "taxAlerts" && (() => {
          const today = new Date("2025-06-07");
          const diff = (d: string) => Math.round((new Date(d).getTime() - today.getTime()) / 86400000);
          const taxes = [
            { tax: "IVA Mensual", desc: language === "es" ? "Declaración jurada IVA — Mayo 2025" : "IVA Monthly Return — May 2025", due: "2025-06-20", rate: "22% / 10%", amount: "$28.600", status: "pending" },
            { tax: "IRAE Anticipo", desc: language === "es" ? "Anticipo mensual IRAE" : "IRAE Monthly Advance", due: "2025-06-10", rate: "25%", amount: "$15.200", status: "overdue" },
            { tax: "BPS Patronal", desc: language === "es" ? "Aporte patronal BPS — Mayo 2025" : "BPS Employer Contribution — May 2025", due: "2025-06-15", rate: "7.5%", amount: "$8.400", status: "overdue" },
            { tax: "e-Factura DGI", desc: language === "es" ? "Reporte mensual comprobantes electrónicos" : "Monthly e-Invoice report", due: "2025-06-30", rate: "—", amount: "—", status: "pending" },
            { tax: "IRPF Retenciones", desc: language === "es" ? "Declaración retenciones IRPF" : "IRPF Withholding Return", due: "2025-07-10", rate: "0–36%", amount: "$4.100", status: "upcoming" },
            { tax: "IVA Mensual", desc: language === "es" ? "Declaración jurada IVA — Junio 2025" : "IVA Monthly Return — Jun 2025", due: "2025-07-20", rate: "22% / 10%", amount: "—", status: "upcoming" },
            { tax: "IRAE Anual", desc: language === "es" ? "Cierre ejercicio IRAE 2024" : "IRAE Annual Return 2024", due: "2025-08-30", rate: "25%", amount: "—", status: "filed" },
          ];
          const statusStyle = (s: string) => s === "overdue"
            ? { color: "var(--color-danger)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", badge: "badge-warning" }
            : s === "pending"
            ? { color: "var(--color-warning)", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", badge: "badge-warning" }
            : s === "filed"
            ? { color: "var(--color-success)", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)", badge: "badge-success" }
            : { color: "var(--color-accent)", bg: "transparent", border: "var(--border-color)", badge: "badge-info" };
          const statusLabel = (s: string) => s === "overdue" ? t("taxAlertsOverdue") : s === "pending" ? t("taxAlertsDue") : s === "filed" ? t("taxAlertsPaid") : language === "es" ? "Próximo" : "Upcoming";
          const daysLabel = (due: string, status: string) => {
            if (status === "filed") return null;
            const d = diff(due);
            if (d < 0) return <span style={{ fontSize: "0.72rem", color: "var(--color-danger)", fontWeight: 700 }}>{Math.abs(d)} {t("taxAlertsDaysLeft")} {language === "es" ? "vencido" : "overdue"}</span>;
            if (d === 0) return <span style={{ fontSize: "0.72rem", color: "var(--color-danger)", fontWeight: 700 }}>{t("taxAlertsToday")}</span>;
            return <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{d} {t("taxAlertsDaysLeft")}</span>;
          };
          return (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("taxAlertsTitle")}</h2>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("taxAlertsSubtitle")}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className="badge badge-warning" style={{ fontSize: "0.72rem" }}>2 {language === "es" ? "vencidos" : "overdue"}</span>
                  <span className="badge badge-info" style={{ fontSize: "0.72rem" }}>2 {language === "es" ? "pendientes" : "pending"}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {taxes.map((tax, i) => {
                  const st = statusStyle(tax.status);
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "1rem", padding: "0.85rem 1.1rem", background: st.bg, border: `1px solid ${st.border}`, borderRadius: "var(--radius-md)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "3px", height: "36px", borderRadius: "2px", background: st.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>{tax.tax}</span>
                            <span className={`badge ${st.badge}`} style={{ fontSize: "0.62rem" }}>{statusLabel(tax.status)}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.78rem" }}>{tax.desc}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.15rem", alignItems: "flex-end" }}>
                        <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{tax.amount}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{tax.due}</span>
                        {daysLabel(tax.due, tax.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* TAB: SETTINGS */}
        {activeTab === "settings" && (() => {
          const lastMetrics = chatHistory.length > 0
            ? chatHistory.filter(m => m.role === "agent" && m.metrics).slice(-1)[0]?.metrics
            : null;
          return (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "860px" }}>

              <div>
                <h2 style={{ margin: "0 0 0.2rem 0" }}>{t("settingsTitle")}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>{t("settingsSubtitle")}</p>
              </div>

              {/* Token Efficiency & Costs */}
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
                  <TrendingDown size={16} style={{ color: "var(--color-primary)" }} />
                  {t("efficiencyTitle")}
                </h3>

                {lastMetrics ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

                    {/* Token consumption */}
                    <div className="glass-panel" style={{ padding: "1.25rem", background: "var(--bg-surface-solid)" }}>
                      <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{t("tokenConsumption")}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>{t("fullContext")}</span>
                        <span style={{ fontWeight: 700 }}>{lastMetrics.fullContextTokens.toLocaleString()} t</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>{t("mcpTool")}</span>
                        <span style={{ fontWeight: 700, color: "var(--color-success)" }}>{lastMetrics.mcpTokens.toLocaleString()} t</span>
                      </div>
                      <div style={{ height: "8px", background: "var(--bg-surface-hover)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        <div style={{ height: "100%", width: `${lastMetrics.savingsPercent}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: "4px" }} />
                      </div>
                      <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700, textAlign: "right" }}>
                        -{t("tokensSaved").replace("{percent}", lastMetrics.savingsPercent)}
                      </p>
                    </div>

                    {/* Latency */}
                    <div className="glass-panel" style={{ padding: "1.25rem", background: "var(--bg-surface-solid)" }}>
                      <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{t("latencyTitle")}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                          <span style={{ width: "80px", color: "var(--text-muted)", flexShrink: 0 }}>{t("fullContext")}</span>
                          <div style={{ flex: 1, height: "6px", background: "rgba(239,68,68,0.25)", borderRadius: "3px" }} />
                          <span style={{ width: "45px", textAlign: "right", fontWeight: 600 }}>{lastMetrics.fullContextLatency}ms</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem" }}>
                          <span style={{ width: "80px", color: "var(--text-muted)", flexShrink: 0 }}>{t("mcpTool")}</span>
                          <div style={{ width: `${Math.max(8, (lastMetrics.mcpLatency / lastMetrics.fullContextLatency) * 100)}%`, height: "6px", background: "var(--color-success)", borderRadius: "3px" }} />
                          <span style={{ width: "45px", textAlign: "right", fontWeight: 600, color: "var(--color-success)" }}>{lastMetrics.mcpLatency}ms</span>
                        </div>
                      </div>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "var(--color-success)", fontWeight: 700, textAlign: "right" }}>
                        {t("xTimesFaster").replace("{x}", String(Math.round(lastMetrics.fullContextLatency / lastMetrics.mcpLatency)))}
                      </p>
                    </div>

                    {/* Cost saved — spans full width */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Coins size={16} style={{ color: "var(--color-success)" }} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{t("estSavings")}</span>
                      </div>
                      <strong style={{ fontSize: "1.1rem", color: "var(--color-success)" }}>${lastMetrics.costSaved.toFixed(5)} USD</strong>
                    </div>

                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)" }}>
                    <TrendingDown size={24} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>
                      {language === "es"
                        ? "Realiza una consulta en 'Consulta tu Información' para ver métricas de eficiencia."
                        : "Run a query in 'Query Your Data' to see efficiency metrics here."}
                    </p>
                  </div>
                )}
              </div>

              {/* Cumulative Metrics */}
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
                  <Activity size={16} style={{ color: "var(--color-accent)" }} />
                  {t("tokenCompTitle")}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
                  {[
                    { label: t("queriesProcessed"), value: stats.totalQueries, color: "var(--color-primary)", icon: <Play size={15} /> },
                    { label: t("avgTokensSaved"),   value: `${stats.avgSavingsPercent}%`, color: "var(--color-accent)", icon: <Coins size={15} /> },
                    { label: t("cumCostSaved"),      value: `$${stats.totalCostSaved.toFixed(4)}`, color: "var(--color-success)", icon: <LineChart size={15} /> },
                    { label: t("speedup"),           value: stats.avgMcpLatency > 0 ? `${(stats.avgFullLatency / stats.avgMcpLatency).toFixed(1)}x` : "0x", color: "var(--color-warning)", icon: <Clock size={15} /> },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: "0.85rem 1rem", background: "var(--bg-surface-solid)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: c.color, marginBottom: "0.3rem" }}>
                        {c.icon}<span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{c.label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Trace log table */}
                <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>{t("traceLogTitle")}</h4>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>{t("logHeaderTime")}</th>
                        <th>{t("logHeaderQuery")}</th>
                        <th>{t("logHeaderTool")}</th>
                        <th>{t("logHeaderTokens")}</th>
                        <th>{t("logHeaderSavings")}</th>
                        <th>{t("logHeaderCost")}</th>
                        <th>{t("logHeaderSpeed")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {observabilityLogs.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>{t("noLogsMessage")}</td></tr>
                      ) : (
                        observabilityLogs.map((log) => (
                          <tr key={log.id}>
                            <td>{log.timestamp}</td>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.query}</td>
                            <td><span className="badge badge-info" style={{ fontFamily: "var(--font-mono)" }}>{log.toolCalled}</span></td>
                            <td>{log.metrics.mcpTokens}</td>
                            <td style={{ color: "var(--color-success)", fontWeight: "bold" }}>-{log.metrics.savingsPercent}%</td>
                            <td style={{ color: "var(--color-success)" }}>+${log.metrics.costSaved.toFixed(5)}</td>
                            <td>{log.metrics.mcpLatency}ms</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}

      </main>

      {/* Footer */}
      <footer style={{
        padding: "0.75rem 2rem",
        marginTop: "2rem",
        borderTop: "1px solid var(--border-color)",
        color: "var(--text-muted)",
        fontSize: "0.8rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--bg-surface-solid)",
        transition: "background-color var(--transition-normal)"
      }}>
        <span>© 2026 Agenttis Inc. All rights reserved.</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Documentation</span>
        </div>
      </footer>
      </div> {/* end right column */}
    </div>
  );
}
