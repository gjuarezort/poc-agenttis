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
  INITIAL_APPS,
} from "../lib/initialData";
import { RoleMetadata, INITIAL_ROLES_METADATA } from "../lib/rolePolicyMetadata";

export type TabType = "home" | "connections" | "skills" | "mcpServers" | "agents" | "apps" | "visualGraph" | "playground" | "recipe" | "marketplace" | "reconciliation" | "monthlyClose" | "taxAlerts" | "settings" | "users";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar: string;
  lastLogin: string;
}

export interface PermissionPolicy {
  views: string[];
  actions: {
    execute_agents: boolean;
    edit_agents: boolean;
    edit_skills: boolean;
    skills_custom_api: boolean;
    skills_mcp_tool: boolean;
    skills_datasource_op: boolean;
    skills_native_util: boolean;
    skills_compute_sandbox: boolean;
    manage_mcp: boolean;
    bypass_confirmation: boolean;
  };
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  user: { name: string; role: string; avatar: string };
  action: string;
  resource: string;
  status: "success" | "warning" | "blocked";
  details?: string;
}

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

  // MCP Servers Integration states
  mcpServers: any[];
  setMcpServers: React.Dispatch<React.SetStateAction<any[]>>;
  mcpHostActive: boolean;
  setMcpHostActive: React.Dispatch<React.SetStateAction<boolean>>;
  mcpHostApiKey: string;
  setMcpHostApiKey: React.Dispatch<React.SetStateAction<string>>;
  exposedDataSources: string[];
  setExposedDataSources: React.Dispatch<React.SetStateAction<string[]>>;
  exposedSkills: string[];
  setExposedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  exposedAgents: any[];
  setExposedAgents: React.Dispatch<React.SetStateAction<any[]>>;
  mcpExposedServers: any[];
  setMcpExposedServers: React.Dispatch<React.SetStateAction<any[]>>;
  apps: any[];
  setApps: React.Dispatch<React.SetStateAction<any[]>>;
  headerAction: React.ReactNode;
  setHeaderAction: React.Dispatch<React.SetStateAction<React.ReactNode>>;

  // Users & Permissions properties
  currentUser: UserProfile;
  changeUserSession: (user: UserProfile) => void;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  permissionPolicy: Record<string, PermissionPolicy>;
  setPermissionPolicy: (updater: Record<string, PermissionPolicy> | ((prev: Record<string, PermissionPolicy>) => Record<string, PermissionPolicy>)) => void;
  rolesMetadata: RoleMetadata[];
  setRolesMetadata: React.Dispatch<React.SetStateAction<RoleMetadata[]>>;
  securityLogs: SecurityLog[];
  setSecurityLogs: React.Dispatch<React.SetStateAction<SecurityLog[]>>;
  logSecurityAction: (action: string, resource: string, status: "success" | "warning" | "blocked", details?: string) => void;
  hasPermission: (tabOrAction: string) => boolean;
}

export const INITIAL_USERS: UserProfile[] = [
  { id: "u-1", name: "Gabriel Juarez", username: "gjuarezort", email: "gabriel@agenttis.com", role: "Admin", status: "active", avatar: "GJ", lastLogin: "Just now" },
  { id: "u-2", name: "Carlos Pérez", username: "carlos_p", email: "carlos.perez@agenttis.com", role: "Accountant", status: "active", avatar: "CP", lastLogin: "10 mins ago" },
  { id: "u-3", name: "Sofía Martínez", username: "sofia_m", email: "sofia.m@agenttis.com", role: "Billing Operator", status: "active", avatar: "SM", lastLogin: "1 hour ago" },
  { id: "u-4", name: "Auditor Externo", username: "auditor_ext", email: "auditor@external.com", role: "Auditor", status: "active", avatar: "AE", lastLogin: "Yesterday" },
  { id: "u-5", name: "Invitado Temporal", username: "guest_temp", email: "guest@agenttis.com", role: "Guest", status: "inactive", avatar: "IT", lastLogin: "3 days ago" }
];

export const INITIAL_PERMISSION_POLICY: Record<string, PermissionPolicy> = {
  "Admin": {
    views: ["home", "connections", "skills", "mcpServers", "agents", "apps", "visualGraph", "playground", "recipe", "marketplace", "reconciliation", "monthlyClose", "taxAlerts", "settings", "users"],
    actions: {
      execute_agents: true,
      edit_agents: true,
      edit_skills: true,
      skills_custom_api: true,
      skills_mcp_tool: true,
      skills_datasource_op: true,
      skills_native_util: true,
      skills_compute_sandbox: true,
      manage_mcp: true,
      bypass_confirmation: true
    }
  },
  "Accountant": {
    views: ["home", "reconciliation", "monthlyClose", "taxAlerts", "connections", "skills", "agents", "apps", "visualGraph", "playground", "settings"],
    actions: {
      execute_agents: true,
      edit_agents: false,
      edit_skills: true,
      skills_custom_api: true,
      skills_mcp_tool: false,
      skills_datasource_op: false,
      skills_native_util: true,
      skills_compute_sandbox: false,
      manage_mcp: false,
      bypass_confirmation: false
    }
  },
  "Billing Operator": {
    views: ["home", "reconciliation", "playground", "apps", "settings"],
    actions: {
      execute_agents: true,
      edit_agents: false,
      edit_skills: true,
      skills_custom_api: false,
      skills_mcp_tool: false,
      skills_datasource_op: false,
      skills_native_util: true,
      skills_compute_sandbox: false,
      manage_mcp: false,
      bypass_confirmation: true
    }
  },
  "Auditor": {
    views: ["home", "reconciliation", "monthlyClose", "taxAlerts", "visualGraph", "playground", "settings"],
    actions: {
      execute_agents: false,
      edit_agents: false,
      edit_skills: false,
      skills_custom_api: false,
      skills_mcp_tool: false,
      skills_datasource_op: false,
      skills_native_util: false,
      skills_compute_sandbox: false,
      manage_mcp: false,
      bypass_confirmation: false
    }
  },
  "Guest": {
    views: ["home", "playground"],
    actions: {
      execute_agents: false,
      edit_agents: false,
      edit_skills: false,
      skills_custom_api: false,
      skills_mcp_tool: false,
      skills_datasource_op: false,
      skills_native_util: false,
      skills_compute_sandbox: false,
      manage_mcp: false,
      bypass_confirmation: false
    }
  }
};

export const INITIAL_SECURITY_LOGS: SecurityLog[] = [
  { id: "sec-1", timestamp: "10:02:45", user: { name: "System", role: "Admin", avatar: "SYS" }, action: "Policy initialization", resource: "RBAC Module", status: "success", details: "Loaded default permissions policy mapping." },
  { id: "sec-2", timestamp: "10:02:46", user: { name: "Gabriel Juarez", role: "Admin", avatar: "GJ" }, action: "Administrator login", resource: "Session", status: "success", details: "OAuth session validated successfully." },
  { id: "sec-3", timestamp: "10:15:30", user: { name: "Carlos Pérez", role: "Accountant", avatar: "CP" }, action: "Role login", resource: "Session", status: "success", details: "Accountant portal initialized." }
];

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

  // Applications list state
  const [apps, setApps] = useState(INITIAL_APPS);

  // Skill Builder Form State
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [skillFormName, setSkillFormName] = useState("");
  const [skillFormDesc, setSkillFormDesc] = useState("");
  const [skillFormType, setSkillFormType] = useState<"read" | "action">("action");
  const [skillFormMethod, setSkillFormMethod] = useState<"GET" | "POST">("POST");
  const [skillFormUrl, setSkillFormUrl] = useState("");
  const [skillFormJson, setSkillFormJson] = useState(`{\n  "invoice_id": "string",\n  "amount": "number"\n}`);

  // MCP Servers Integration states
  const [mcpServers, setMcpServers] = useState<any[]>([
    {
      id: "srv-sqlite",
      name: "SQLite Local DB Server",
      type: "stdio",
      status: "connected",
      command: "npx",
      args: "-y @modelcontextprotocol/server-sqlite --db /path/to/local.db",
      env: "DB_PATH=/path/to/local.db",
      toolsCount: 4,
      lastSync: "5 min ago",
      tools: [
        { name: "read_query", desc: "Execute a read-only query on the database." },
        { name: "write_query", desc: "Execute a write query on the database." },
        { name: "describe_table", desc: "Get structural information of a table." },
        { name: "list_tables", desc: "List all tables in the database." }
      ]
    },
    {
      id: "srv-brave",
      name: "Brave Search Gateway",
      type: "sse",
      status: "connected",
      url: "https://api.brave.com/mcp/sse",
      headers: "Authorization: Bearer bs_xxxx",
      toolsCount: 2,
      lastSync: "1h ago",
      tools: [
        { name: "web_search", desc: "Search the web for a query." },
        { name: "local_search", desc: "Search for local entities like restaurants or shops." }
      ]
    },
    {
      id: "srv-github",
      name: "GitHub Developer Server",
      type: "stdio",
      status: "error",
      command: "npx",
      args: "-y @modelcontextprotocol/server-github",
      env: "GITHUB_TOKEN=ghp_xxxxx",
      toolsCount: 6,
      lastSync: "1 day ago",
      tools: [
        { name: "list_repos", desc: "List all repositories." },
        { name: "get_issue", desc: "Get issue details." },
        { name: "create_issue", desc: "Create a new issue." },
        { name: "list_pull_requests", desc: "List pull requests." },
        { name: "get_file", desc: "Get file contents from repository." },
        { name: "search_code", desc: "Search code in repositories." }
      ]
    }
  ]);
  const [mcpHostActive, setMcpHostActive] = useState<boolean>(true);
  const [mcpHostApiKey, setMcpHostApiKey] = useState<string>("agt_live_9f2a7d4c8e1b306a");
  const [exposedDataSources, setExposedDataSources] = useState<string[]>(["demo1"]);
  const [exposedSkills, setExposedSkills] = useState<string[]>(["read_customers", "refund_invoice"]);
  const [exposedAgents, setExposedAgents] = useState<any[]>(["agent-reconcile"]);
  const [mcpExposedServers, setMcpExposedServers] = useState<any[]>([
    {
      id: "exp-gateway",
      name: "Agenttis Gateway Server",
      description: "Exposes active billing tools and transaction datasets to external LLMs.",
      status: "connected",
      url: "https://api.agenttis.com/v1/mcp/sse",
      apiKey: "agt_live_9f2a7d4c8e1b306a",
      exposedDataSources: ["demo1"],
      exposedSkills: ["read_customers", "refund_invoice"],
      exposedAgents: ["agent-reconcile"],
      logs: [
        { time: "18:54:12", request: "tools/list", client: "Claude Desktop", status: 200, latency: 15 },
        { time: "18:54:16", request: "tools/call (read_customers)", client: "Claude Desktop", status: 200, latency: 42 },
        { time: "18:55:01", request: "tools/call (refund_invoice)", client: "Cursor AI", status: 200, latency: 112 },
        { time: "18:56:45", request: "resources/list", client: "Claude Desktop", status: 200, latency: 8 },
        { time: "18:57:30", request: "tools/list", client: "Custom Agent Pipeline", status: 200, latency: 22 }
      ]
    },
    {
      id: "exp-stock",
      name: "ERP Inventory Sync Hub",
      description: "Exposes real-time stock levels and ERP inventory adjustments.",
      status: "inactive",
      url: "https://api.agenttis.com/v1/mcp/inventory/sse",
      apiKey: "agt_live_8e1b3a6c2f9d4b0a",
      exposedDataSources: ["file-active"],
      exposedSkills: ["adjust_stock"],
      exposedAgents: ["agent-inventory"],
      logs: [
        { time: "18:50:01", request: "tools/list", client: "Cursor AI", status: 200, latency: 25 },
        { time: "18:51:24", request: "tools/call (adjust_stock)", client: "Cursor AI", status: 200, latency: 98 }
      ]
    }
  ]);
  const [headerAction, setHeaderAction] = useState<React.ReactNode>(null);

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

  // Users & Permissions States
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Gabriel Juarez is Admin
  const [rolesMetadata, setRolesMetadata] = useState<RoleMetadata[]>(INITIAL_ROLES_METADATA);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);

  // Derive permissionPolicy from rolesMetadata
  const permissionPolicy = React.useMemo(() => {
    const policy: Record<string, PermissionPolicy> = {};
    rolesMetadata.forEach(role => {
      policy[role.key] = {
        views: role.permissions.modules,
        actions: {
          execute_agents: role.permissions.agents.includes("execute"),
          edit_agents: role.permissions.agents.includes("edit"),
          edit_skills: role.permissions.skills.length > 0,
          skills_custom_api: role.permissions.skills.includes("custom_api"),
          skills_mcp_tool: role.permissions.skills.includes("mcp_tool"),
          skills_datasource_op: role.permissions.skills.includes("datasource_op"),
          skills_native_util: role.permissions.skills.includes("native_util"),
          skills_compute_sandbox: role.permissions.skills.includes("compute_sandbox"),
          manage_mcp: role.permissions.mcp.includes("manage"),
          bypass_confirmation: role.permissions.agents.includes("bypass")
        }
      };
    });
    return policy;
  }, [rolesMetadata]);

  // Backwards compatible wrapper for setPermissionPolicy
  const setPermissionPolicy = React.useCallback((
    updater:
      | Record<string, PermissionPolicy>
      | ((prev: Record<string, PermissionPolicy>) => Record<string, PermissionPolicy>)
  ) => {
    setRolesMetadata(prevRoles => {
      const currentPolicy: Record<string, PermissionPolicy> = {};
      prevRoles.forEach(r => {
        currentPolicy[r.key] = {
          views: r.permissions.modules,
          actions: {
            execute_agents: r.permissions.agents.includes("execute"),
            edit_agents: r.permissions.agents.includes("edit"),
            edit_skills: r.permissions.skills.length > 0,
            skills_custom_api: r.permissions.skills.includes("custom_api"),
            skills_mcp_tool: r.permissions.skills.includes("mcp_tool"),
            skills_datasource_op: r.permissions.skills.includes("datasource_op"),
            skills_native_util: r.permissions.skills.includes("native_util"),
            skills_compute_sandbox: r.permissions.skills.includes("compute_sandbox"),
            manage_mcp: r.permissions.mcp.includes("manage"),
            bypass_confirmation: r.permissions.agents.includes("bypass")
          }
        };
      });

      const nextPolicy = typeof updater === "function" ? updater(currentPolicy) : updater;

      return prevRoles.map(r => {
        const p = nextPolicy[r.key];
        if (!p) return r;
        return {
          ...r,
          permissions: {
            modules: p.views,
            agents: [
              ...(p.actions.execute_agents ? ["execute"] : []),
              ...(p.actions.edit_agents ? ["edit"] : []),
              ...(p.actions.bypass_confirmation ? ["bypass"] : [])
            ],
            skills: [
              ...(p.actions.skills_custom_api ? ["custom_api"] : []),
              ...(p.actions.skills_mcp_tool ? ["mcp_tool"] : []),
              ...(p.actions.skills_datasource_op ? ["datasource_op"] : []),
              ...(p.actions.skills_native_util ? ["native_util"] : []),
              ...(p.actions.skills_compute_sandbox ? ["compute_sandbox"] : [])
            ],
            mcp: p.actions.manage_mcp ? ["manage"] : [],
            data_sources: r.permissions.data_sources
          }
        };
      });
    });
  }, []);

  const logSecurityAction = React.useCallback((action: string, resource: string, status: "success" | "warning" | "blocked", details?: string) => {
    const newLog: SecurityLog = {
      id: "sec-" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      user: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar
      },
      action,
      resource,
      status,
      details
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const changeUserSession = React.useCallback((user: UserProfile) => {
    const prevUser = currentUser;
    setCurrentUser(user);
    
    const timeStr = new Date().toLocaleTimeString();
    const newLog: SecurityLog = {
      id: "sec-" + Math.random().toString(36).substr(2, 9),
      timestamp: timeStr,
      user: {
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      action: "Session Switched",
      resource: "Authentication",
      status: "success",
      details: `User switched session from ${prevUser.name} (${prevUser.role}) to ${user.name} (${user.role}).`
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const hasPermission = React.useCallback((tabOrAction: string): boolean => {
    if (currentUser.role === "Admin") return true;

    const policy = permissionPolicy[currentUser.role];
    if (!policy) return false;

    if (policy.views.includes(tabOrAction)) return true;

    if (tabOrAction in policy.actions) {
      return policy.actions[tabOrAction as keyof typeof policy.actions];
    }

    return false;
  }, [currentUser, permissionPolicy]);

  const handleCopilotSubmit = async (context: "reconciliation" | "monthlyClose" | "taxAlerts", customText: string) => {
    const text = customText.trim();
    if (!text) return;
    
    setCopilotLoading(true);

    // Add user message
    setCopilotMessages(prev => [...prev, { role: "user", text }]);

    setTimeout(() => {
      if (!hasPermission("execute_agents")) {
        setCopilotMessages(prev => [
          ...prev,
          {
            role: "agent",
            text: language === "es"
              ? "⚠️ **Acceso Denegado**: Tu rol actual no tiene autorización para ejecutar tareas operativas (`execute_agents` denegado)."
              : "⚠️ **Access Denied**: Your current role does not have authorization to trigger agent executions (`execute_agents` denied).",
            steps: [language === "es" ? "Comprobando credenciales..." : "Checking credentials...", "Fallo: execute_agents denegado."]
          }
        ]);
        logSecurityAction(
          "Agent Invocation Blocked",
          `Copilot Chat (${context})`,
          "blocked",
          `Attempted to execute agent action with query: "${text}"`
        );
        setCopilotLoading(false);
        return;
      }

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

    const activeAgent = agents.find(a => a.id === selectedPlaygroundAgent);
    const userRole = currentUser.role;

    const isAgentAllowed = () => {
      if (userRole === "Admin") return true;
      if (!activeAgent) return true;
      
      const allowedRoles = activeAgent.users.map((r: string) => r.toLowerCase());
      let normalizedRole = userRole.toLowerCase();
      if (normalizedRole === "billing operator") normalizedRole = "facturación";
      if (normalizedRole === "accountant") normalizedRole = "contador";
      if (normalizedRole === "auditor") normalizedRole = "auditor";
      
      return allowedRoles.some((r: string) => 
        r.includes(normalizedRole) || 
        normalizedRole.includes(r) ||
        (normalizedRole === "contador" && r === "administración")
      );
    };

    if (!isAgentAllowed()) {
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            role: "agent",
            text: language === "es"
              ? `⚠️ **Error de Seguridad**: Tu rol (${userRole}) no tiene clearance para instruir al ${activeAgent?.name || "agente seleccionado"}.`
              : `⚠️ **Security Error**: Your role (${userRole}) lacks clearance to instruct the selected agent (${activeAgent?.name || "agent"}).`,
            isError: true
          }
        ]);
        logSecurityAction(
          "Agent Query Blocked",
          `Agent: ${selectedPlaygroundAgent}`,
          "blocked",
          `Blocked query to agent "${activeAgent?.name || selectedPlaygroundAgent}": "${userQuery}" due to clearance requirements.`
        );
        setChatLoading(false);
      }, 1000);
      return;
    }

    try {

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
    handleQuerySubmit, copyToClipboard, downloadFile,

    mcpServers, setMcpServers,
    mcpHostActive, setMcpHostActive,
    mcpHostApiKey, setMcpHostApiKey,
    exposedDataSources, setExposedDataSources,
    exposedSkills, setExposedSkills,
    exposedAgents, setExposedAgents,
    mcpExposedServers, setMcpExposedServers,
    apps, setApps,
    headerAction, setHeaderAction,

    currentUser,
    changeUserSession,
    users,
    setUsers,
    permissionPolicy,
    setPermissionPolicy,
    rolesMetadata,
    setRolesMetadata,
    securityLogs,
    setSecurityLogs,
    logSecurityAction,
    hasPermission
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
