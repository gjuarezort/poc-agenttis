import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Globe, Sun, Moon } from "lucide-react";

interface TopbarProps {
  activeTab: string;
  language: "en" | "es";
  handleLanguageChange: (lang: "en" | "es") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}



export const Topbar: React.FC = () => {
  const { activeTab,
  language,
  handleLanguageChange,
  theme,
  toggleTheme, } = useDashboard();
  return (
    <header className="top-bar">
      <div>
        <h1 style={{ fontSize: "1.2rem", margin: 0, fontWeight: 700 }}>
          {activeTab === "home" && (language === "es" ? "Inicio" : "Home")}
          {activeTab === "connections" && (language === "es" ? "Conexiones de Datos" : "Data Connections")}
          {activeTab === "skills" && (language === "es" ? "Habilidades" : "Skills")}
          {activeTab === "agents" && (language === "es" ? "Agentes de IA" : "AI Agents")}
          {activeTab === "visualGraph" && (language === "es" ? "Arquitectura" : "Architecture")}
          {activeTab === "playground" && (language === "es" ? "Playground" : "Playground")}
          {activeTab === "recipe" && (language === "es" ? "Código MCP Generado" : "Generated MCP Code")}
          {activeTab === "integrations" && (language === "es" ? "Catálogo de Integraciones" : "Integration Catalog")}
          {activeTab === "reconciliation" && (language === "es" ? "Conciliación Bancaria" : "Bank Reconciliation")}
          {activeTab === "monthlyClose" && (language === "es" ? "Cierre Mensual" : "Monthly Close")}
          {activeTab === "taxAlerts" && (language === "es" ? "Alertas Fiscales" : "Tax Alerts")}
          {activeTab === "templates" && (language === "es" ? "Galería de Plantillas" : "Template Gallery")}
          {activeTab === "settings" && (language === "es" ? "Configuración" : "Settings")}
        </h1>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {activeTab === "home" && (language === "es" ? "Resumen de su actividad de negocio" : "Summary of your business activity")}
          {activeTab === "connections" && (language === "es" ? "Conectá y administrá tus fuentes de datos" : "Connect and manage your data sources")}
          {activeTab === "skills" && (language === "es" ? "Definí habilidades y acciones protegidas de los agentes" : "Define active agent skills and protected action endpoints")}
          {activeTab === "agents" && (language === "es" ? "Configurá agentes de IA con permisos de datos y habilidades aislados" : "Configure AI agents with isolated data, skills, and access rights")}
          {activeTab === "visualGraph" && (language === "es" ? "Esquema interactivo de su solución agéntica" : "Interactive diagram of your agentic solution")}
          {activeTab === "playground" && (language === "es" ? "Pruebe las herramientas MCP y flujos de razonamiento" : "Test MCP tools and reasoning flows")}
          {activeTab === "recipe" && (language === "es" ? "Copie o descargue el servidor de datos de su MCP" : "Copy or download your MCP data server")}
          {activeTab === "integrations" && (language === "es" ? "Explore integraciones empresariales preconfiguradas" : "Explore preconfigured enterprise integrations")}
          {activeTab === "reconciliation" && (language === "es" ? "Conciliación de extractos bancarios con asistencia de agente" : "Reconciliation of bank statements with agent assistance")}
          {activeTab === "monthlyClose" && (language === "es" ? "Cierre de periodo paso a paso" : "Period closing step by step")}
          {activeTab === "taxAlerts" && (language === "es" ? "Fechas de vencimiento e impuestos controlados por IA" : "Due dates and taxes monitored by AI")}
          {activeTab === "templates" && (language === "es" ? "Aplicaciones pre-creadas para iniciar rápidamente" : "Prebuilt business templates to get started quickly")}
          {activeTab === "settings" && (language === "es" ? "Configuración del sistema y eficiencia de tokens" : "System configuration and token efficiency")}
        </p>
      </div>

      {/* Right settings selectors */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        
        {/* Language switch */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "var(--bg-surface-solid)", padding: "0.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <Globe size={13} style={{ color: "var(--text-muted)", marginLeft: "0.2rem" }} />
          <button 
            onClick={() => handleLanguageChange("en")}
            style={{
              background: language === "en" ? "var(--color-primary-glow)" : "transparent",
              color: language === "en" ? "var(--color-primary)" : "var(--text-secondary)",
              padding: "0.15rem 0.4rem",
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: language === "en" ? 700 : 500,
              border: "none",
              cursor: "pointer"
            }}
          >
            EN
          </button>
          <button 
            onClick={() => handleLanguageChange("es")}
            style={{
              background: language === "es" ? "var(--color-primary-glow)" : "transparent",
              color: language === "es" ? "var(--color-primary)" : "var(--text-secondary)",
              padding: "0.15rem 0.4rem",
              fontSize: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontWeight: language === "es" ? 700 : 500,
              border: "none",
              cursor: "pointer"
            }}
          >
            ES
          </button>
        </div>

        {/* Theme selector */}
        <button 
          onClick={toggleTheme}
          className="btn-secondary"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            borderRadius: "var(--radius-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
        </button>

      </div>
    </header>
  );
};
