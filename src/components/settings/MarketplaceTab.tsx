import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import { Info, Search, Check, CreditCard, X, Sparkles, Database, HelpCircle, ShieldCheck } from "lucide-react";

interface MarketplaceItem {
  id: string;
  type: "template" | "integration";
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  tagEn: string;
  tagEs: string;
  priceEn: string;
  priceEs: string;
  isFree: boolean;
  color: string;
  emoji: string;
  sources: string[];
  skillsAdded: string[];
  features?: { nameEn: string; nameEs: string; status: "ON" | "OFF" | "DISABLED" }[];
}

export const MarketplaceTab: React.FC = () => {
  const {
    language,
    installedTemplates,
    setInstalledTemplates,
    setMockConnections,
    setSkills,
  } = useDashboard();

  // Internal states
  const [activeCategory, setActiveCategory] = useState<"all" | "template" | "integration" | "free" | "paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaidItem, setSelectedPaidItem] = useState<MarketplaceItem | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const marketplaceItems: MarketplaceItem[] = [
    {
      id: "sales_billing",
      type: "template",
      titleEs: "Asistente de Facturación y Ventas",
      titleEn: "Sales & Billing Assistant",
      descEs: "Conecta Stripe y Reporte de facturación. Tu agente AI puede consultar ingresos, emitir reembolsos y conciliar transacciones automáticamente en lenguaje natural.",
      descEn: "Connects Stripe and your invoicing system. Your AI agent can query revenues, run refunds, and reconcile transactions automatically.",
      tagEs: "Ventas y Finanzas",
      tagEn: "Sales & Finance",
      priceEs: "Gratis",
      priceEn: "Free",
      isFree: true,
      color: "#3b82f6",
      emoji: "💳",
      sources: ["Stripe API", "Reporte de facturación Portal"],
      skillsAdded: ["Reembolsar Factura", "Generar Reporte Diario"],
    },
    {
      id: "support_crm",
      type: "template",
      titleEs: "Soporte al Cliente & CRM PyME",
      titleEn: "Customer Support & CRM Assistant",
      descEs: "Une tu base de conocimientos en Notion con los contactos de HubSpot. Permite a los agentes de soporte redactar respuestas personalizadas y registrar tickets.",
      descEn: "Combines your Notion knowledge base with HubSpot contacts. Allows support agents to write replies and log tickets.",
      tagEs: "Atención y CRM",
      tagEn: "Support & CRM",
      priceEs: "Gratis",
      priceEn: "Free",
      isFree: true,
      color: "#8b5cf6",
      emoji: "🎯",
      sources: ["Notion Database", "HubSpot CRM Link"],
      skillsAdded: ["Buscar Documentos de Soporte", "Crear Contacto CRM"],
    },
    {
      id: "inventory_logistics",
      type: "template",
      titleEs: "Control de Stock y Logística (Premium)",
      titleEn: "Inventory & Logistics Assistant (Premium)",
      descEs: "Vincula tus planillas de Excel de existencias con el ERP local. Permite consultar stock en tiempo real y emitir alertas de reposición al agente de compras.",
      descEn: "Links your stock Excel files with local ERP. Allows real-time stock checks and purchase order alerts.",
      tagEs: "Inventario",
      tagEn: "Inventory",
      priceEs: "$19.00 / mes",
      priceEn: "$19.00 / mo",
      isFree: false,
      color: "#f59e0b",
      emoji: "📦",
      sources: ["Excel Stock Sheet", "ERP Sync"],
      skillsAdded: ["Actualizar Stock en Sistema", "Generar Orden de Compra"],
    },
    {
      id: "stripe_mcp",
      type: "integration",
      titleEs: "Stripe Checkout MCP",
      titleEn: "Stripe Checkout MCP",
      descEs: "Expone clientes, saldos de suscripción, facturas y estados de pago a la IA. Permite búsquedas de facturación y reconciliación de ingresos.",
      descEn: "Exposes customers, subscription balances, invoices, and checkout status to AI. Allows agent-led billing lookups and revenue reconciliation.",
      tagEs: "Pasarela de Pago",
      tagEn: "Payment Gateway",
      priceEs: "Gratis",
      priceEn: "Free",
      isFree: true,
      color: "#10b981",
      emoji: "💳",
      sources: ["Stripe API Endpoint"],
      skillsAdded: ["Consultar Facturas Stripe"],
      features: [
        { nameEs: "Leer Transacciones", nameEn: "Read Transactions", status: "ON" },
        { nameEs: "Escribir Facturas / Reembolsos", nameEn: "Write Invoices / Refunds", status: "DISABLED" }
      ]
    },
    {
      id: "hubspot_mcp",
      type: "integration",
      titleEs: "HubSpot CRM MCP",
      titleEn: "HubSpot CRM MCP",
      descEs: "Sincronice contactos, negocios, segmentos de empresas y registros de tickets. Permita que los agentes de soporte/ventas recuperen actualizaciones e interactúen con perfiles.",
      descEn: "Sync contacts, deals, company segments, and ticket logs. Let support/sales agents fetch pipeline updates and update contact files.",
      tagEs: "CRM",
      tagEn: "CRM",
      priceEs: "Gratis",
      priceEn: "Free",
      isFree: true,
      color: "#f97316",
      emoji: "🎯",
      sources: ["HubSpot Portal Integration"],
      skillsAdded: ["Obtener Negocios HubSpot", "Actualizar Nota CRM"],
      features: [
        { nameEs: "Leer Embudo", nameEn: "Read Pipeline", status: "ON" },
        { nameEs: "Crear Contactos", nameEn: "Create Contacts", status: "ON" }
      ]
    },
    {
      id: "notion_mcp",
      type: "integration",
      titleEs: "Notion Wiki MCP",
      titleEn: "Notion Wiki MCP",
      descEs: "Indexe bases de datos, páginas y listas de Notion. Los agentes buscan guías comerciales, políticas y registros de reuniones de forma dinámica.",
      descEn: "Index Notion databases, document pages, and lists. Agents search business handbooks, policies, and meeting logs dynamically.",
      tagEs: "Productividad",
      tagEn: "Productivity",
      priceEs: "Gratis",
      priceEn: "Free",
      isFree: true,
      color: "#4b5563",
      emoji: "📝",
      sources: ["Notion Workspace API"],
      skillsAdded: ["Buscar Documentación Interna"],
      features: [
        { nameEs: "Buscar Espacios de Trabajo", nameEn: "Search Workspaces", status: "ON" },
        { nameEs: "Crear Páginas", nameEn: "Create Pages", status: "OFF" }
      ]
    },
    {
      id: "slack_mcp",
      type: "integration",
      titleEs: "Slack Channels MCP (Premium)",
      titleEn: "Slack Channels MCP (Premium)",
      descEs: "Permita que los agentes lean hilos, publiquen resúmenes, busquen historial de mensajes o programen alertas. Incluye límites de seguridad y auditoría en tiempo real.",
      descEn: "Let agents read threads, post summaries, search message history, or schedule alerts in specific channels. Includes security boundaries and real-time audit.",
      tagEs: "Comunicaciones",
      tagEn: "Communications",
      priceEs: "$29.00 / mes",
      priceEn: "$29.00 / mo",
      isFree: false,
      color: "#ec4899",
      emoji: "💬",
      sources: ["Slack Team Gateway"],
      skillsAdded: ["Enviar Mensaje Canal Slack", "Consultar Canal Slack"],
      features: [
        { nameEs: "Leer Mensajes", nameEn: "Read Messages", status: "ON" },
        { nameEs: "Publicar Notificaciones", nameEn: "Post Notifications", status: "ON" }
      ]
    }
  ];

  // Installation handler
  const handleInstallItem = (item: MarketplaceItem) => {
    // If template is already installed
    if (installedTemplates.includes(item.id)) return;

    // Trigger installation
    setInstalledTemplates(prev => [...prev, item.id]);

    // Add mock connections
    item.sources.forEach(src => {
      setMockConnections(prev => {
        if (prev.some(c => c.name === src)) return prev;
        return [
          ...prev,
          {
            id: `conn-tpl-${Date.now()}-${Math.random()}`,
            name: src,
            category: language === "es" ? item.tagEs : item.tagEn,
            status: "connected" as const,
            lastSync: language === "es" ? "Ahora mismo" : "Just now",
            records: language === "es" ? "50 registros" : "50 records"
          }
        ];
      });
    });

    // Add skills
    item.skillsAdded.forEach(sk => {
      setSkills(prev => {
        if (prev.some(s => s.name === sk)) return prev;
        return [
          ...prev,
          {
            id: `skill-tpl-${Date.now()}-${Math.random()}`,
            name: sk,
            description: language === "es" 
              ? `Habilidad preconfigurada instalada desde el Marketplace: ${item.titleEs}.` 
              : `Preconfigured skill installed from the Marketplace: ${item.titleEn}.`,
            type: "action",
            status: "active" as const,
            method: "POST",
            endpoint: "https://api.agenttis.com/v1/integration/action"
          }
        ];
      });
    });

    alert(language === "es"
      ? `¡Marketplace: "${item.titleEs}" activado con éxito! Se han agregado las conexiones y habilidades correspondientes.`
      : `Marketplace: "${item.titleEn}" activated successfully! Corresponding connections and skills have been added.`
    );
  };

  // Payment simulation handler
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaidItem) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        handleInstallItem(selectedPaidItem);
        setPaymentSuccess(false);
        setSelectedPaidItem(null);
      }, 1500);
    }, 2000);
  };

  // Filter & Search computation
  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "template" && item.type === "template") ||
      (activeCategory === "integration" && item.type === "integration") ||
      (activeCategory === "free" && item.isFree) ||
      (activeCategory === "paid" && !item.isFree);

    const term = searchQuery.toLowerCase();
    const title = (language === "es" ? item.titleEs : item.titleEn).toLowerCase();
    const desc = (language === "es" ? item.descEs : item.descEn).toLowerCase();
    const tag = (language === "es" ? item.tagEs : item.tagEn).toLowerCase();
    const matchesSearch = title.includes(term) || desc.includes(term) || tag.includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      
      {/* Search and Category filters bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        
        {/* Search bar */}
        <div style={{ position: "relative", minWidth: "280px", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder={language === "es" ? "Buscar plantillas o conexiones..." : "Search templates or connections..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.35rem", width: "100%", height: "40px" }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory("all")}
            className={`btn ${activeCategory === "all" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "8px" }}
          >
            {language === "es" ? "Todos" : "All"}
          </button>
          <button
            onClick={() => setActiveCategory("template")}
            className={`btn ${activeCategory === "template" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "8px" }}
          >
            {language === "es" ? "Plantillas" : "Templates"}
          </button>
          <button
            onClick={() => setActiveCategory("integration")}
            className={`btn ${activeCategory === "integration" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "8px" }}
          >
            {language === "es" ? "Integraciones" : "Integrations"}
          </button>
          <button
            onClick={() => setActiveCategory("free")}
            className={`btn ${activeCategory === "free" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "8px" }}
          >
            {language === "es" ? "Gratis" : "Free"}
          </button>
          <button
            onClick={() => setActiveCategory("paid")}
            className={`btn ${activeCategory === "paid" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 1rem", fontSize: "0.82rem", borderRadius: "8px" }}
          >
            {language === "es" ? "Premium" : "Premium"}
          </button>
        </div>

      </div>

      {/* Grid view of Marketplace */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {filteredItems.map(item => {
          const isInstalled = installedTemplates.includes(item.id);
          const title = language === "es" ? item.titleEs : item.titleEn;
          const desc = language === "es" ? item.descEs : item.descEn;
          const tag = language === "es" ? item.tagEs : item.tagEn;
          const price = language === "es" ? item.priceEs : item.priceEn;

          return (
            <div
              key={item.id}
              className="glass-panel glass-panel-interactive"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "280px",
                padding: "1.25rem",
                border: isInstalled ? `1px solid ${item.color}60` : "1px solid var(--border-color)",
                background: "var(--bg-surface-solid)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isInstalled ? `0 4px 15px ${item.color}15` : "none"
              }}
            >
              <div>
                {/* Badge Header Area */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "1.3rem", filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))" }}>{item.emoji}</span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        textTransform: "uppercase"
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                  
                  {/* Price Tag Badge */}
                  <span
                    className="badge"
                    style={{
                      backgroundColor: item.isFree ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                      color: item.isFree ? "var(--color-success)" : "#f59e0b",
                      border: item.isFree ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)",
                      fontSize: "0.65rem",
                      fontWeight: 700
                    }}
                  >
                    {price}
                  </span>
                </div>

                {/* Title and description */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.4rem" }}>{title}</h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{desc}</p>
                </div>

                {/* Sub-details (Connections or Features) */}
                {item.type === "template" && item.sources.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.5rem" }}>
                      {item.sources.map((src, i) => (
                        <span key={i} style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)" }}>
                          🔌 {src}
                        </span>
                      ))}
                    </div>
                    {item.skillsAdded && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        {item.skillsAdded.map((sk, i) => (
                          <span key={i} style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", background: "var(--color-primary-glow)", border: "1px solid rgba(59, 130, 246, 0.15)", borderRadius: "6px", color: "var(--color-primary)" }}>
                            ⚙️ {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {item.type === "integration" && item.features && (
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {item.features.map((feat, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem" }}>
                        <span style={{ color: "var(--text-secondary)" }}>{language === "es" ? feat.nameEs : feat.nameEn}</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: feat.status === "ON" ? "var(--color-success)" : feat.status === "OFF" ? "var(--text-muted)" : "var(--color-danger)",
                            fontSize: "0.65rem"
                          }}
                        >
                          {feat.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: "1rem" }}>
                {isInstalled ? (
                  <button
                    className="btn btn-secondary"
                    disabled
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.8rem", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                  >
                    <Check size={14} style={{ color: "var(--color-success)" }} />
                    {language === "es" ? "Instalado y Activo" : "Installed & Active"}
                  </button>
                ) : item.isFree ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleInstallItem(item)}
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                  >
                    <Sparkles size={14} />
                    {language === "es" ? "Instalar Gratis" : "Install Free"}
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => setSelectedPaidItem(item)}
                    style={{
                      width: "100%",
                      padding: "0.45rem",
                      fontSize: "0.8rem",
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "#ffffff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <CreditCard size={14} />
                    {language === "es" ? `Comprar Acceso (${price})` : `Buy Access (${price})`}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1.5rem", color: "var(--text-secondary)" }}>
            <HelpCircle size={32} style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              {language === "es" ? "No se encontraron ítems que coincidan con la búsqueda." : "No marketplace items found matching your filters."}
            </p>
          </div>
        )}
      </div>

      {/* Sleek Credit Card Checkout Modal for Premium Items */}
      {selectedPaidItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem"
          }}
        >
          <div
            className="glass-panel animate-fade-in"
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "var(--bg-surface-solid)",
              padding: "1.75rem",
              borderRadius: "16px",
              border: "1px solid var(--border-color-glow)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              position: "relative"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPaidItem(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={18} />
            </button>

            {paymentSuccess ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", padding: "2rem 0", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)", marginBottom: "1rem" }}>
                  <ShieldCheck size={36} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                  {language === "es" ? "¡Pago Confirmado!" : "Payment Confirmed!"}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "es" 
                    ? `Activando e instalando "${selectedPaidItem.titleEs}"...` 
                    : `Activating and installing "${selectedPaidItem.titleEn}"...`}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePurchaseSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span className="badge" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.2)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" }}>
                    PREMIUM ACTIVATION
                  </span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.25rem 0 0.5rem" }}>
                    {language === "es" ? selectedPaidItem.titleEs : selectedPaidItem.titleEn}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                    {language === "es"
                      ? "Esta es una herramienta avanzada. Confirma tu método de pago simulado a continuación para completar la suscripción."
                      : "This is an advanced operational package. Confirm your simulated payment details below to complete subscription."}
                  </p>
                </div>

                {/* Simulated Credit Card Graphic */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "140px",
                    boxShadow: "0 8px 16px rgba(124, 58, 237, 0.25)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em" }}>AGENTTIS GATEWAY</span>
                    <span style={{ fontSize: "1.2rem" }}>💳</span>
                  </div>
                  
                  <div style={{ fontSize: "1.1rem", fontFamily: "monospace", letterSpacing: "2px" }}>
                    {cardNumber}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", opacity: 0.9 }}>
                    <div>
                      <span style={{ display: "block", fontSize: "0.5rem", opacity: 0.7 }}>CARDHOLDER</span>
                      <span style={{ fontWeight: 600 }}>{cardName || "GABRIEL JUAREZ"}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "0.5rem", opacity: 0.7 }}>EXPIRES</span>
                      <span style={{ fontWeight: 600 }}>{cardExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      {language === "es" ? "Nombre en la Tarjeta" : "Cardholder Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gabriel Juarez"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      style={{ height: "36px", fontSize: "0.85rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                        {language === "es" ? "Número de Tarjeta" : "Card Number"}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ height: "36px", fontSize: "0.85rem", fontFamily: "monospace" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                        CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        defaultValue="123"
                        style={{ height: "36px", fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="btn"
                  disabled={isProcessingPayment}
                  style={{
                    height: "40px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 700,
                    cursor: isProcessingPayment ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#ffffff", borderRadius: "50%" }} />
                      {language === "es" ? "Procesando Pago..." : "Processing Payment..."}
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                  {language === "es"
                    ? `Autorizar & Suscribir (${selectedPaidItem.priceEs})`
                    : `Authorize & Subscribe (${selectedPaidItem.priceEn})`}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
