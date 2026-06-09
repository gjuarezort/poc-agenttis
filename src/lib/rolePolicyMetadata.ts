export interface RoleMetadata {
  key: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  permissions: {
    modules: string[];      // Tab keys the role can view
    agents: string[];       // "execute" | "edit" | "bypass"
    skills: string[];       // Specific skill categories allowed: "custom_api" | "mcp_tool" | "datasource_op" | "native_util" | "compute_sandbox"
    mcp: string[];          // "manage"
    data_sources: string[]; // "read" | "write"
  };
}

export interface PermissionCategory {
  key: string;
  labelEn: string;
  labelEs: string;
  permissions: {
    key: string;
    labelEn: string;
    labelEs: string;
  }[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    key: "modules",
    labelEn: "Allowed Pages (Navigation)",
    labelEs: "Páginas Permitidas (Navegación)",
    permissions: [
      { key: "home", labelEn: "Home Dashboard", labelEs: "Tablero Principal" },
      { key: "connections", labelEn: "Data Connections Setup", labelEs: "Configuración de Conexiones" },
      { key: "skills", labelEn: "Skill Builder Panel", labelEs: "Constructor de Habilidades" },
      { key: "mcpServers", labelEn: "MCP Servers Integration", labelEs: "Servidores MCP" },
      { key: "agents", labelEn: "Agent Settings & Config", labelEs: "Configuración de Agentes" },
      { key: "apps", labelEn: "Application Catalog", labelEs: "Catálogo de Aplicaciones" },
      { key: "visualGraph", labelEn: "Platform Architecture Map", labelEs: "Mapa de Arquitectura" },
      { key: "playground", labelEn: "Agent Playground Chat", labelEs: "Chat Playground de Agentes" },
      { key: "recipe", labelEn: "Generated MCP Code View", labelEs: "Visor de Código MCP" },
      { key: "marketplace", labelEn: "Marketplace Hub", labelEs: "Portal de Marketplace" },
      { key: "reconciliation", labelEn: "Bank Reconciliation Module", labelEs: "Conciliación Bancaria" },
      { key: "monthlyClose", labelEn: "Monthly Financial Close", labelEs: "Cierre Financiero Mensual" },
      { key: "taxAlerts", labelEn: "Tax Alert Monitor", labelEs: "Control de Alertas Fiscales" },
      { key: "settings", labelEn: "Global Preferences Settings", labelEs: "Configuración Global" },
      { key: "users", labelEn: "Team & Permissions", labelEs: "Miembros y Permisos" }
    ]
  },
  {
    key: "agents",
    labelEn: "Agent Capabilities",
    labelEs: "Acciones de Agentes",
    permissions: [
      { key: "execute", labelEn: "Run Agent Automations", labelEs: "Ejecutar Automatizaciones de Agente" },
      { key: "edit", labelEn: "Configure / Edit AI Agents", labelEs: "Configurar / Editar Agentes" },
      { key: "bypass", labelEn: "Bypass Approval Requirements", labelEs: "Aprobar Automatizaciones Directamente" }
    ]
  },
  {
    key: "skills",
    labelEn: "Skill Builder (By Category)",
    labelEs: "Habilidades Permitidas (Por Categoría)",
    permissions: [
      { key: "skills_custom_api", labelEn: "Build REST API Connector Skills", labelEs: "Crear Habilidades de API REST" },
      { key: "skills_mcp_tool", labelEn: "Build MCP Server Tools Skills", labelEs: "Crear Habilidades de Servidor MCP" },
      { key: "skills_datasource_op", labelEn: "Build Database Query Skills", labelEs: "Crear Habilidades de Bases de Datos" },
      { key: "skills_native_util", labelEn: "Build App Alerts (Slack, Shopify)", labelEs: "Crear Habilidades de Slack/Shopify" },
      { key: "skills_compute_sandbox", labelEn: "Build Custom Code Sandbox Scripts", labelEs: "Crear Habilidades de Scripts en Sandbox" }
    ]
  },
  {
    key: "mcp",
    labelEn: "Integrations Access",
    labelEs: "Accesos de Integración",
    permissions: [
      { key: "manage", labelEn: "Manage API & MCP Integrations", labelEs: "Administrar Integraciones API y MCP" }
    ]
  },
  {
    key: "data_sources",
    labelEn: "Data Access Control",
    labelEs: "Acceso a Datos",
    permissions: [
      { key: "read", labelEn: "Inspect Synced Data Files", labelEs: "Ver Datos Sincronizados" },
      { key: "write", labelEn: "Add / Reconnect Data Connectors", labelEs: "Agregar / Reconectar Fuentes de Datos" }
    ]
  }
];

export const INITIAL_ROLES_METADATA: RoleMetadata[] = [
  {
    key: "Admin",
    name: "Administrator",
    description: "Full read-write control of system components and policy configuration.",
    color: "#ffffff",
    bgColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
    permissions: {
      modules: ["home", "connections", "skills", "mcpServers", "agents", "apps", "visualGraph", "playground", "recipe", "marketplace", "reconciliation", "monthlyClose", "taxAlerts", "settings", "users"],
      agents: ["execute", "edit", "bypass"],
      skills: ["custom_api", "mcp_tool", "datasource_op", "native_util", "compute_sandbox"],
      mcp: ["manage"],
      data_sources: ["read", "write"]
    }
  },
  {
    key: "Accountant",
    name: "Accountant",
    description: "Can run reconciliations, view close books, and inspect visual graphs. Read-only platform setup.",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.2)",
    permissions: {
      modules: ["home", "reconciliation", "monthlyClose", "taxAlerts", "connections", "skills", "agents", "apps", "visualGraph", "playground", "settings"],
      agents: ["execute"],
      skills: ["custom_api", "native_util"],
      mcp: [],
      data_sources: ["read"]
    }
  },
  {
    key: "Billing Operator",
    name: "Billing Operator",
    description: "Can trigger billing runs and playground experiments. High-velocity automated execution.",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.12)",
    borderColor: "rgba(6,182,212,0.2)",
    permissions: {
      modules: ["home", "reconciliation", "playground", "apps", "settings"],
      agents: ["execute", "bypass"],
      skills: ["native_util"],
      mcp: [],
      data_sources: ["read"]
    }
  },
  {
    key: "Auditor",
    name: "Auditor",
    description: "Read-only access across core operational sheets and system charts. Blocked from running agent steps.",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.2)",
    permissions: {
      modules: ["home", "reconciliation", "monthlyClose", "taxAlerts", "visualGraph", "playground", "settings"],
      agents: [],
      skills: [],
      mcp: [],
      data_sources: ["read"]
    }
  },
  {
    key: "Guest",
    name: "Guest Profile",
    description: "Extremely restricted trial environment. Sandbox access to homepage and playground only.",
    color: "#94a3b8",
    bgColor: "rgba(148,163,184,0.12)",
    borderColor: "rgba(148,163,184,0.2)",
    permissions: {
      modules: ["home", "playground"],
      agents: [],
      skills: [],
      mcp: [],
      data_sources: []
    }
  }
];
