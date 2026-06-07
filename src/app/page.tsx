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
  Globe
} from "lucide-react";

// ENTERPRISE TRANSLATION DICTIONARY (i18n)
const TRANSLATIONS = {
  en: {
    appName: "Agenttis",
    tagline: "Enterprise Agentic Layer for PyMEs",
    mvpBuilder: "MVP Builder",
    tabs: {
      data: "Data Connections",
      playground: "Agent Playground",
      recipe: "Generated MCP Code",
      observability: "Metrics & Savings",
      integrations: "Integration Catalog"
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
    playTitle: "Agent Playground Chat",
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
    catalogTitle: "Integration Catalog Recipes",
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
      data: "Conexiones de Datos",
      playground: "Playground de Agentes",
      recipe: "Código MCP Generado",
      observability: "Métricas y Ahorros",
      integrations: "Catálogo de Integraciones"
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
    playTitle: "Chat de Playground de Agentes",
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
    catalogTitle: "Recetas del Catálogo de Integraciones",
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
  const [activeTab, setActiveTab] = useState<"data" | "playground" | "recipe" | "observability" | "integrations">("data");
  
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Dynamic Header */}
      <header className="glass-panel" style={{
        margin: "1rem",
        padding: "1rem 2.0rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        borderRadius: "var(--radius-lg)"
      }}>
        
        {/* Left branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="flex-center" style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.2rem",
            boxShadow: "0 2px 8px var(--color-primary-glow)"
          }}>
            A
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.5px" }}>{t("appName")}</span>
              <span className="badge badge-info" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>{t("mvpBuilder")}</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>{t("tagline")}</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav style={{ display: "flex", gap: "0.2rem" }}>
          <button 
            className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            <Database size={15} /> {tTab("data")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "playground" ? "active" : ""}`}
            disabled={!parsedData}
            onClick={() => setActiveTab("playground")}
            style={{ opacity: parsedData ? 1 : 0.5, cursor: parsedData ? "pointer" : "not-allowed" }}
          >
            <Play size={15} /> {tTab("playground")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "recipe" ? "active" : ""}`}
            disabled={!parsedData}
            onClick={() => setActiveTab("recipe")}
            style={{ opacity: parsedData ? 1 : 0.5, cursor: parsedData ? "pointer" : "not-allowed" }}
          >
            <FileCode size={15} /> {tTab("recipe")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "observability" ? "active" : ""}`}
            onClick={() => setActiveTab("observability")}
          >
            <Activity size={15} /> {tTab("observability")}
          </button>
          <button 
            className={`tab-btn ${activeTab === "integrations" ? "active" : ""}`}
            onClick={() => setActiveTab("integrations")}
          >
            <Settings size={15} /> {tTab("integrations")}
          </button>
        </nav>

        {/* Right Switch Controls (Language & Theme Manager) */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          
          {/* Multilingual Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--bg-surface-solid)", padding: "0.3rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <Globe size={14} style={{ color: "var(--text-muted)", marginLeft: "0.25rem" }} />
            <button 
              onClick={() => handleLanguageChange("en")}
              style={{
                background: language === "en" ? "var(--color-primary-glow)" : "transparent",
                color: language === "en" ? "var(--color-primary)" : "var(--text-secondary)",
                padding: "0.2rem 0.5rem",
                fontSize: "0.75rem",
                borderRadius: "var(--radius-sm)",
                fontWeight: language === "en" ? 700 : 500
              }}
            >
              EN
            </button>
            <button 
              onClick={() => handleLanguageChange("es")}
              style={{
                background: language === "es" ? "var(--color-primary-glow)" : "transparent",
                color: language === "es" ? "var(--color-primary)" : "var(--text-secondary)",
                padding: "0.2rem 0.5rem",
                fontSize: "0.75rem",
                borderRadius: "var(--radius-sm)",
                fontWeight: language === "es" ? 700 : 500
              }}
            >
              ES
            </button>
          </div>

          {/* Theme manager Toggle button */}
          <button 
            onClick={toggleTheme}
            className="btn-secondary"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

        </div>
      </header>

      {/* Main Content Layout */}
      <main className="container" style={{ flex: 1, padding: "1rem", maxWidth: "1500px" }}>
        
        {/* TAB 1: DATA CONNECTION HUB */}
        {activeTab === "data" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
              
              {/* Custom CSV Upload */}
              <div className="glass-panel" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Sparkles size={18} style={{ color: "var(--color-primary)" }} />
                    <h2 style={{ margin: 0 }}>{t("dataTitle")}</h2>
                  </div>
                  <p style={{ marginBottom: "1.25rem", fontSize: "0.9rem" }}>
                    {t("dataSubtitle")}
                  </p>
                  
                  <div style={{
                    border: "2px dashed var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "2rem 1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--bg-surface-solid)",
                    transition: "all var(--transition-fast)",
                    position: "relative"
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setLoading(true);
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        await processCSVData(ev.target?.result as string, file.name);
                        setLoading(false);
                      };
                      reader.readAsText(file);
                    }
                  }}
                  >
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileUpload}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer"
                      }}
                    />
                    <Upload size={32} style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }} />
                    <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                      {t("uploadDragDrop")}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                      {t("uploadNote")}
                    </p>
                  </div>
                </div>

                {analysisError && (
                  <div style={{ marginTop: "1rem", padding: "0.6rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "var(--radius-sm)", color: "var(--color-danger)", fontSize: "0.8rem" }}>
                    {analysisError}
                  </div>
                )}
              </div>

              {/* Demo Connections */}
              <div className="glass-panel" style={{ padding: "1.75rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>{t("demoTitle")}</h2>
                <p style={{ marginBottom: "1.25rem", fontSize: "0.9rem" }}>
                  {t("demoSubtitle")}
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  
                  <div 
                    className="glass-panel glass-panel-interactive" 
                    onClick={() => loadSampleCSV("/samples/customers_sales.csv", "customers_sales.csv")}
                    style={{
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: fileName === "customers_sales.csv" ? "var(--color-primary-glow)" : "var(--bg-surface-solid)",
                      borderColor: fileName === "customers_sales.csv" ? "var(--color-primary)" : "var(--border-color)"
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem", color: fileName === "customers_sales.csv" ? "var(--color-primary)" : "var(--text-primary)" }}>
                        {t("demoCustomers")}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("demoCustomersDesc")}</p>
                    </div>
                    <ArrowRight size={16} style={{ color: "var(--color-primary)" }} />
                  </div>

                  <div 
                    className="glass-panel glass-panel-interactive" 
                    onClick={() => loadSampleCSV("/samples/inventory_items.csv", "inventory_items.csv")}
                    style={{
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: fileName === "inventory_items.csv" ? "var(--color-primary-glow)" : "var(--bg-surface-solid)",
                      borderColor: fileName === "inventory_items.csv" ? "var(--color-primary)" : "var(--border-color)"
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem", color: fileName === "inventory_items.csv" ? "var(--color-primary)" : "var(--text-primary)" }}>
                        {t("demoInventory")}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("demoInventoryDesc")}</p>
                    </div>
                    <ArrowRight size={16} style={{ color: "var(--color-primary)" }} />
                  </div>

                </div>
              </div>
            </div>

            {/* Inferred Schema details & Grid preview */}
            {loading ? (
              <div className="glass-panel flex-center" style={{ height: "250px", flexDirection: "column", gap: "0.75rem" }}>
                <div className="spinner"></div>
                <p style={{ color: "var(--text-secondary)" }}>{t("analyzingMessage")}</p>
              </div>
            ) : parsedData ? (
              <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
                
                {/* Visual Schema definition */}
                <div className="glass-panel" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ margin: 0 }}>{t("schemaTitle")}</h3>
                    <span className="badge badge-success">{t("rowsDetected").replace("{rows}", parsedData.totalRows)}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {t("schemaSubtitle")}
                  </p>
                  
                  <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th>{t("schemaHeaderField")}</th>
                          <th>{t("schemaHeaderType")}</th>
                          <th>{t("schemaHeaderSamples")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.columns.map((col: any, idx: number) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{col.name}</td>
                            <td>
                              <span className={`badge ${
                                col.type === "number" ? "badge-success" : 
                                col.type === "date" ? "badge-info" : 
                                col.type === "boolean" ? "badge-warning" : "btn-secondary"
                              }`} style={{ fontSize: "0.65rem" }}>
                                {col.type}
                              </span>
                            </td>
                            <td style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                              {col.sampleValues.slice(0, 3).map(String).join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table Data list Preview */}
                <div className="glass-panel" style={{ padding: "1.25rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{t("previewTitle")} ({fileName})</h3>
                  <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {t("previewSubtitle")}
                  </p>

                  <div className="table-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table>
                      <thead>
                        <tr>
                          {parsedData.columns.map((col: any, idx: number) => (
                            <th key={idx}>{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row: any, rIdx: number) => (
                          <tr key={rIdx}>
                            {parsedData.columns.map((col: any, cIdx: number) => (
                              <td key={cIdx}>{row[col.name] !== undefined ? String(row[col.name]) : ""}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Context Metrics Box */}
                  <div style={{
                    marginTop: "1.25rem",
                    padding: "0.75rem 1rem",
                    background: "var(--bg-surface-solid)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Zap size={18} style={{ color: "var(--color-primary)" }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.9rem" }}>{t("tokenOptimizations")}</h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          {t("tokenPayloadDesc").replace("{tokens}", parsedData.fullCsvTokens.toLocaleString())}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setActiveTab("playground")}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                    >
                      {t("openPlaygroundBtn")} <ArrowRight size={12} />
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="glass-panel flex-center" style={{ height: "180px", color: "var(--text-secondary)" }}>
                {t("noDataMessage")}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLAYGROUND INTERACTIVE CHAT */}
        {activeTab === "playground" && parsedData && (
          <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.25rem", height: "calc(100vh - 170px)" }}>
            
            {/* Left Column Chat frame */}
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.25rem" }}>
              <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{t("playTitle")}</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("playSubtitle").replace("{fileName}", fileName)}</p>
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
                      {samplePrompts.map((p, i) => (
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
                        flexDirection: "column",
                        alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                        gap: "0.3rem"
                      }}
                    >
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        {msg.role === "user" ? (language === "es" ? "PREGUNTA DE USUARIO" : "USER QUERY") : (language === "es" ? "RESPUESTA DE AGENTE" : "AGENT CLIENT")}
                      </span>

                      <div className="glass-panel" style={{
                        padding: "0.85rem",
                        maxWidth: "85%",
                        background: msg.role === "user" ? "var(--color-primary-glow)" : "var(--bg-surface-solid)",
                        borderColor: msg.role === "user" ? "var(--color-primary)" : "var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap"
                      }}>
                        {msg.text}
                      </div>

                      {msg.role === "agent" && msg.metrics && (
                        <div style={{
                          display: "flex",
                          gap: "0.5rem",
                          fontSize: "0.7rem",
                          color: "var(--color-primary)",
                          fontWeight: 600,
                          padding: "0.15rem 0.4rem",
                          background: "var(--color-primary-glow)",
                          border: "1px solid var(--border-color-glow)",
                          borderRadius: "4px",
                          marginTop: "0.15rem"
                        }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <Zap size={10} /> {t("tokensSaved").replace("{percent}", msg.metrics.savingsPercent)}
                          </span>
                          <span>•</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <Clock size={10} /> Latency: {msg.metrics.mcpLatency}ms vs {msg.metrics.fullContextLatency}ms
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {chatLoading && (
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.25rem" }}>
                    <div className="spinner" style={{ width: "14px", height: "14px" }}></div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t("agentThinking")}</span>
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
              
              {/* Token efficiency chart */}
              {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "agent" && chatHistory[chatHistory.length - 1].metrics ? (
                (() => {
                  const currentMetrics = chatHistory[chatHistory.length - 1].metrics;
                  return (
                    <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid var(--color-primary)" }}>
                      <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <TrendingDown size={16} style={{ color: "var(--color-primary)" }} /> {t("efficiencyTitle")}
                      </h4>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                            <span>{t("tokenConsumption")}</span>
                            <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                              -{t("tokensSaved").replace("{percent}", currentMetrics.savingsPercent)}
                            </span>
                          </div>
                          
                          <div style={{ height: "8px", background: "var(--bg-surface-solid)", borderRadius: "4px", overflow: "hidden", position: "relative", marginBottom: "0.2rem", border: "1px solid var(--border-color)" }}>
                            <div style={{ height: "100%", width: `${currentMetrics.savingsPercent}%`, background: "var(--color-primary)" }}></div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            <span>{t("fullContext")}: {currentMetrics.fullContextTokens.toLocaleString()} t</span>
                            <span>{t("mcpTool")}: {currentMetrics.mcpTokens.toLocaleString()} t</span>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                            <span>{t("latencyTitle")}</span>
                            <span style={{ color: "var(--color-success)", fontWeight: 700 }}>
                              {t("xTimesFaster").replace("{x}", String(Math.round(currentMetrics.fullContextLatency / currentMetrics.mcpLatency)))}
                            </span>
                          </div>
                          
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem" }}>
                              <span style={{ width: "80px", color: "var(--text-muted)" }}>{t("fullContext")}:</span>
                              <div style={{ height: "4px", flex: 1, background: "rgba(239, 68, 68, 0.2)", borderRadius: "2px" }}></div>
                              <span style={{ width: "40px", textAlign: "right" }}>{currentMetrics.fullContextLatency}ms</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem" }}>
                              <span style={{ width: "80px", color: "var(--text-muted)" }}>{t("mcpTool")}:</span>
                              <div style={{ height: "4px", width: `${Math.max(5, (currentMetrics.mcpLatency / currentMetrics.fullContextLatency) * 100)}%`, background: "var(--color-success)", borderRadius: "2px" }}></div>
                              <span style={{ width: "40px", textAlign: "right" }}>{currentMetrics.mcpLatency}ms</span>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          marginTop: "0.25rem",
                          padding: "0.5rem 0.75rem",
                          background: "var(--bg-surface-solid)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8rem"
                        }}>
                          <span style={{ color: "var(--text-secondary)" }}>{t("estSavings")}</span>
                          <strong style={{ color: "var(--color-success)" }}>${currentMetrics.costSaved.toFixed(5)} USD</strong>
                        </div>

                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="glass-panel flex-center" style={{ padding: "1.25rem", height: "120px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  {t("metricsPlaceholder")}
                </div>
              )}

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

        {/* TAB 4: METRICS & OBSERVABILITY SUMMARY */}
        {activeTab === "observability" && (
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <Settings size={20} style={{ color: "var(--color-primary)" }} />
                <h2 style={{ margin: 0 }}>{t("catalogTitle")}</h2>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                {t("catalogSubtitle")}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              
              {/* Stripe checkout card */}
              <div className="glass-panel glass-panel-interactive" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>💳</span>
                    <span className="badge badge-success">Ready</span>
                  </div>
                  <h3 style={{ marginBottom: "0.4rem", fontSize: "1.1rem" }}>{t("stripeTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {t("stripeDesc")}
                  </p>
                  
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
                  <h3 style={{ marginBottom: "0.4rem", fontSize: "1.1rem" }}>{t("hubspotTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {t("hubspotDesc")}
                  </p>
                  
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
                  <h3 style={{ marginBottom: "0.4rem", fontSize: "1.1rem" }}>{t("notionTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {t("notionDesc")}
                  </p>
                  
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
                  <h3 style={{ marginBottom: "0.4rem", fontSize: "1.1rem" }}>{t("slackTitle")}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {t("slackDesc")}
                  </p>
                  
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

      </main>

      {/* Footer */}
      <footer style={{
        padding: "1rem 2rem",
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
    </div>
  );
}
