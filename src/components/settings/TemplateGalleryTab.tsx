import { useDashboard } from "../../context/DashboardContext";
import React from "react";

interface TemplateGalleryProps {
  language: "en" | "es";
  installedTemplates: string[];
  setInstalledTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  setMockConnections: React.Dispatch<React.SetStateAction<any[]>>;
  setSkills: React.Dispatch<React.SetStateAction<any[]>>;
}



export const TemplateGalleryTab: React.FC = () => {
  const { language,
  installedTemplates,
  setInstalledTemplates,
  setMockConnections,
  setSkills, } = useDashboard();
  const templatesList = [
    {
      id: "sales_billing",
      title: language === "es" ? "Asistente de Facturación y Ventas" : "Sales & Billing Assistant",
      desc: language === "es" ? "Conecta Stripe y Reporte de facturación. Tu agente AI puede consultar ingresos, emitir reembolsos y conciliar transacciones automáticamente en lenguaje natural." : "Connects Stripe and your invoicing system. Your AI agent can query revenues, run refunds, and reconcile transactions automatically.",
      tag: language === "es" ? "Ventas y Finanzas" : "Sales & Finance",
      sources: ["Stripe API", "Reporte de facturación Portal"],
      skillsAdded: ["Reembolsar Factura", "Generar Reporte Diario"],
      color: "#3b82f6"
    },
    {
      id: "support_crm",
      title: language === "es" ? "Soporte al Cliente & CRM PyME" : "Customer Support & CRM Assistant",
      desc: language === "es" ? "Une tu base de conocimientos en Notion con los contactos de HubSpot. Permite a los agentes de soporte redactar respuestas personalizadas y registrar tickets." : "Combines your Notion knowledge base with HubSpot contacts. Allows support agents to write replies and log tickets.",
      tag: language === "es" ? "Atención y CRM" : "Support & CRM",
      sources: ["Notion Database", "HubSpot CRM Link"],
      skillsAdded: ["Buscar Documentos de Soporte", "Crear Contacto CRM"],
      color: "#8b5cf6"
    },
    {
      id: "inventory_logistics",
      title: language === "es" ? "Control de Stock y Logística" : "Inventory & Logistics Assistant",
      desc: language === "es" ? "Vincula tus planillas de Excel de existencias con el ERP local. Permite consultar stock en tiempo real y emitir alertas de reposición al agente de compras." : "Links your stock Excel files with local ERP. Allows real-time stock checks and purchase order alerts.",
      tag: language === "es" ? "Inventario" : "Inventory",
      sources: ["Excel Stock Sheet", "ERP Sync"],
      skillsAdded: ["Actualizar Stock en Sistema", "Generar Orden de Compra"],
      color: "#f59e0b"
    }
  ];

  const handleInstall = (tplId: string) => {
    const tpl = templatesList.find(t => t.id === tplId);
    if (!tpl) return;
    
    // Add template to installed
    setInstalledTemplates(prev => [...prev, tplId]);

    // Add mock connections
    tpl.sources.forEach(src => {
      setMockConnections(prev => {
        if (prev.some(c => c.name === src)) return prev;
        return [
          ...prev,
          {
            id: `conn-tpl-${Date.now()}-${Math.random()}`,
            name: src,
            category: tpl.tag,
            status: "connected" as const,
            lastSync: language === "es" ? "Ahora mismo" : "Just now",
            records: language === "es" ? "50 registros" : "50 records"
          }
        ];
      });
    });

    // Add skills
    tpl.skillsAdded.forEach(sk => {
      setSkills(prev => {
        if (prev.some(s => s.name === sk)) return prev;
        return [
          ...prev,
          {
            id: `skill-tpl-${Date.now()}-${Math.random()}`,
            name: sk,
            description: language === "es" ? `Habilidad preconfigurada instalada mediante la plantilla ${tpl.title}.` : `Preconfigured skill installed via the template ${tpl.title}.`,
            type: "action",
            status: "active" as const,
            method: "POST",
            endpoint: "https://api.agenttis.com/v1/integration/action"
          }
        ];
      });
    });

    alert(language === "es" 
      ? `¡Plantilla "${tpl.title}" instalada con éxito! Se han agregado las conexiones y habilidades correspondientes a tu capa agéntica.` 
      : `Template "${tpl.title}" installed successfully! Connections and skills have been added to your agentic layer.`
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h3 style={{ margin: "0 0 0.2rem" }}>{language === "es" ? "Plantillas Listas para Usar" : "Ready-to-Use Templates"}</h3>
        <p style={{ margin: 0, fontSize: "0.85rem" }}>
          {language === "es" 
            ? "Activá soluciones preconfiguradas con un solo clic. Cada plantilla autoconstruye los canales de datos y las acciones requeridas por el agente."
            : "Activate preconfigured solutions with a single click. Each template auto-builds the data channels and actions required by the agent."}
        </p>
      </div>

      <div className="template-grid">
        {templatesList.map(tpl => {
          const isInstalled = installedTemplates.includes(tpl.id);
          return (
            <div key={tpl.id} className="glass-panel template-card" style={{ position: "relative", border: isInstalled ? `1px solid ${tpl.color}50` : "1px solid var(--border-color)", background: "var(--bg-surface-solid)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span className="badge" style={{ backgroundColor: `${tpl.color}15`, color: tpl.color, border: `1px solid ${tpl.color}30`, fontSize: "0.62rem" }}>{tpl.tag}</span>
                  {isInstalled && (
                    <span className="badge badge-success" style={{ fontSize: "0.62rem" }}>
                      {language === "es" ? "Instalada" : "Installed"}
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem" }}>{tpl.title}</h4>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{tpl.desc}</p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
                  {tpl.sources.map((src, i) => (
                    <span key={i} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", background: "var(--bg-surface-hover)", border: "1px solid var(--border-color)", borderRadius: "4px" }}>
                      🔌 {src}
                    </span>
                  ))}
                </div>
                <button 
                  className={isInstalled ? "btn btn-secondary" : "btn btn-primary"} 
                  onClick={() => handleInstall(tpl.id)}
                  disabled={isInstalled}
                  style={{ width: "100%", padding: "0.45rem", fontSize: "0.8rem" }}
                >
                  {isInstalled 
                    ? (language === "es" ? "✓ Aplicación Activa" : "✓ Active Application") 
                    : (language === "es" ? "Instalar Plantilla" : "Install Template")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
