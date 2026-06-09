export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  dataSources: string[];
  skills: string[];
  users: string[];
  requireConfirmation: boolean;
  delegates: string[];
  linkedApps: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: "read" | "action";
  status: "active";
  method?: string;
  endpoint?: string;
  parameters?: Array<{ name: string; type: string }>;
}

export interface Connection {
  id: string;
  name: string;
  category: string;
  status: "connected" | "error" | "pending";
  lastSync: string;
  records: string;
}

export interface BankRow {
  id: number;
  date: string;
  desc: string;
  amount: number;
  matched: boolean;
}

export interface CloseStep {
  id: number;
  label: string;
  status: string;
  detail: string;
}

export interface TaxItem {
  id: number;
  tax: string;
  desc: string;
  due: string;
  rate: string;
  amount: string;
  status: string;
}

export interface Widget {
  id: string;
  type: "kpi" | "list" | "chart" | "chat";
  title: string;
  config: Record<string, any>;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dataSources: string[];
  agents: string[];
  widgets: Widget[];
  installed: boolean;
}

export const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-reconcile",
    name: "Agente de Conciliación",
    role: "Reconciliation Agent",
    description: "Cruza extractos bancarios con facturas y ejecuta reembolsos en Stripe.",
    dataSources: ["demo1", "file-active"],
    skills: ["read_customers", "refund_invoice"],
    users: ["Admin", "Facturación"],
    requireConfirmation: true,
    delegates: [],
    linkedApps: []
  },
  {
    id: "agent-inventory",
    name: "Asistente de Inventario",
    role: "Inventory Copilot",
    description: "Monitorea existencias de productos y actualiza stock en el ERP.",
    dataSources: ["file-active"],
    skills: ["adjust_stock"],
    users: ["Operaciones"],
    requireConfirmation: false,
    delegates: [],
    linkedApps: []
  },
  {
    id: "agent-tax",
    name: "Copiloto Fiscal UY",
    role: "Tax Copilot",
    description: "Monitorea vencimientos y presenta reportes fiscales.",
    dataSources: ["demo1"],
    skills: ["submit_tax_report"],
    users: ["Administración", "Contador"],
    requireConfirmation: true,
    delegates: ["agent-reconcile"],
    linkedApps: []
  }
];

export const INITIAL_APPS: Application[] = [
  {
    id: "app-reconcile",
    name: "Portal de Conciliación Bancaria",
    description: "Tablero ejecutivo para auditar facturas, conciliar cuentas de Stripe y ejecutar reembolsos automáticos.",
    icon: "ArrowLeftRight",
    color: "var(--color-primary)",
    dataSources: ["demo1"],
    agents: ["agent-reconcile"],
    installed: true,
    widgets: [
      { id: "w-kpi-sales", type: "kpi", title: "Ingresos Totales (USD)", config: { metric: "sum", column: "total_spent", label: "Ventas Registradas" } },
      { id: "w-kpi-custs", type: "kpi", title: "Clientes Activos", config: { metric: "count", label: "Base de Datos" } },
      { id: "w-chart-sales", type: "chart", title: "Distribución por País", config: { groupBy: "country", label: "Distribución Geográfica" } },
      { id: "w-list-trans", type: "list", title: "Transacciones de Clientes", config: { limit: 5 } },
      { id: "w-chat-copilot", type: "chat", title: "Consola de Asistencia Financiera", config: { agentId: "agent-reconcile" } }
    ]
  },
  {
    id: "app-inventory",
    name: "Auditor de Inventario",
    description: "Monitorea SKUs en stock crítico, realiza ajustes automáticos y actualiza stock en ERP.",
    icon: "Package",
    color: "var(--color-success)",
    dataSources: ["file-active"],
    agents: ["agent-inventory"],
    installed: true,
    widgets: [
      { id: "w-kpi-stock", type: "kpi", title: "Nivel de Stock Alertas", config: { metric: "average", column: "stock", label: "Promedio" } },
      { id: "w-list-items", type: "list", title: "SKUs Críticos", config: { limit: 8 } },
      { id: "w-chat-inv", type: "chat", title: "Operación de Reabastecimiento", config: { agentId: "agent-inventory" } }
    ]
  }
];

export const INITIAL_MOCK_CONNECTIONS: Connection[] = [
  { id:"demo1", name: "Demo: Customers & Sales", category:"CSV", status:"connected", lastSync:"Hace 2h", records:"500 filas" }
];

export const INITIAL_BANK_ROWS: BankRow[] = [
  { id: 1, date: "02/06/2025", desc: "Cobro factura #1042 — Cliente ABC", amount: 45200, matched: true },
  { id: 2, date: "04/06/2025", desc: "Pago proveedor Impresos SA", amount: -12500, matched: true },
  { id: 3, date: "07/06/2025", desc: "Transferencia recibida", amount: 18000, matched: false },
  { id: 4, date: "10/06/2025", desc: "Débito automático — Suscripción Cloud", amount: -3200, matched: true },
  { id: 5, date: "14/06/2025", desc: "Portal Fiscal — Pago IVA", amount: -28600, matched: false },
  { id: 6, date: "18/06/2025", desc: "Cobro factura #1055 — Cliente XYZ", amount: 67000, matched: true }
];

export const INITIAL_CLOSE_STEPS: CloseStep[] = [
  { id: 1, label: "Importar extractos bancarios", status: "done", detail: "Stripe, Banco — 6 movimientos importados" },
  { id: 2, label: "Conciliación bancaria", status: "warning", detail: "2 movimientos sin conciliar ($5.400)" },
  { id: 3, label: "Verificar facturas emitidas", status: "done", detail: "14 facturas — todas enviadas al sistema" },
  { id: 4, label: "Verificar facturas recibidas", status: "done", detail: "9 facturas registradas" },
  { id: 5, label: "Calcular IVA del período (22% / 10%)", status: "warning", detail: "IVA a pagar: $28.600 — vence 20/07" },
  { id: 6, label: "Liquidar impuestos de nómina", status: "pending", detail: "Pendiente de cálculo" },
  { id: 7, label: "Registrar pago de impuesto corporativo", status: "pending", detail: "Vence 10/07" },
  { id: 8, label: "Cierre y asientos de ajuste", status: "pending", detail: "Requiere pasos anteriores" }
];

export const INITIAL_TAXES: TaxItem[] = [
  { id: 1, tax: "IVA Mensual", desc: "Declaración jurada IVA — Mayo 2025", due: "2025-06-20", rate: "22% / 10%", amount: "$28.600", status: "pending" },
  { id: 2, tax: "Impuesto Corporativo", desc: "Anticipo mensual de renta corporativa", due: "2025-06-10", rate: "25%", amount: "$15.200", status: "overdue" },
  { id: 3, tax: "Cargas Sociales", desc: "Aporte de seguridad social y nómina — Mayo 2025", due: "2025-06-15", rate: "7.5%", amount: "$8.400", status: "overdue" },
  { id: 4, tax: "Reporte de Facturación", desc: "Reporte mensual comprobantes electrónicos", due: "2025-06-30", rate: "—", amount: "—", status: "pending" },
  { id: 5, tax: "Retención Ganancias", desc: "Declaración de retenciones de impuestos", due: "2025-07-10", rate: "0–36%", amount: "$4.100", status: "upcoming" },
  { id: 6, tax: "IVA Mensual", desc: "Declaración jurada IVA — Junio 2025", due: "2025-07-20", rate: "22% / 10%", amount: "—", status: "upcoming" },
  { id: 7, tax: "Impuesto de Renta Anual", desc: "Cierre ejercicio corporativo 2024", due: "2025-08-30", rate: "25%", amount: "—", status: "filed" }
];

export const INITIAL_SKILLS: Skill[] = [
  { id: "read_customers", name: "Leer Clientes", description: "Consulta la lista de clientes, gasto total y estado de actividad.", type: "read", status: "active", method: "GET" },
  { id: "refund_invoice", name: "Reembolsar Factura", description: "Ejecuta un reembolso para una factura específica a través de Stripe API.", type: "action", status: "active", method: "POST", endpoint: "https://api.agenttis.com/v1/stripe/refunds", parameters: [{ name: "invoice_id", type: "string" }, { name: "amount", type: "number" }] },
  { id: "adjust_stock", name: "Actualizar Stock", description: "Modifica el nivel de existencias disponible para un código SKU en el ERP.", type: "action", status: "active", method: "POST", endpoint: "https://api.agenttis.com/v1/inventory/adjust", parameters: [{ name: "sku", type: "string" }, { name: "quantity", type: "number" }] }
];
