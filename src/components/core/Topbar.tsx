import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import { Globe, Sun, Moon, Menu } from "lucide-react";

interface TopbarProps {
  activeTab: string;
  language: "en" | "es";
  handleLanguageChange: (lang: "en" | "es") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Topbar: React.FC = () => {
  const { activeTab, language, headerAction, mobileMenuOpen, setMobileMenuOpen } = useDashboard();

  return (
    <header className="top-bar" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="hamburger-toggle"
        title={language === "es" ? "Abrir menú" : "Open menu"}
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      <h1 style={{ fontSize: "1.2rem", margin: 0, fontWeight: 700, lineHeight: 1.2, flex: 1 }}>
          {activeTab === "home" && (language === "es" ? "Inicio" : "Home")}
          {activeTab === "connections" && (language === "es" ? "Fuentes de Datos" : "Data Sources")}
          {activeTab === "skills" && (language === "es" ? "Habilidades" : "Skills")}
          {activeTab === "agents" && (language === "es" ? "Agentes" : "Agents")}
          {activeTab === "apps" && (language === "es" ? "Aplicaciones" : "Applications")}
          {activeTab === "visualGraph" && (language === "es" ? "Arquitectura" : "Architecture")}
          {activeTab === "playground" && (language === "es" ? "Playground" : "Playground")}
          {activeTab === "recipe" && (language === "es" ? "Código MCP Generado" : "Generated MCP Code")}
          {activeTab === "mcpServers" && (language === "es" ? "Model Context Protocol" : "Model Context Protocol")}
          {activeTab === "marketplace" && (language === "es" ? "Marketplace" : "Marketplace")}
          {activeTab === "settings" && (language === "es" ? "Configuración" : "Settings")}
          {activeTab === "users" && (language === "es" ? "Miembros y Permisos" : "Team & Permissions")}
      </h1>

      {/* Right settings actions slot */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {headerAction}
      </div>
    </header>
  );
};
