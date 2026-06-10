import { useDashboard } from "../../context/DashboardContext";
import React from "react";
import {
  ArrowLeftRight,
  CalendarCheck,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { TRANSLATIONS } from "../../lib/translations";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";

export const HomeTab: React.FC = () => {
  const { language, setActiveTab } = useDashboard();
  const tagline = TRANSLATIONS[language].tagline;

  const appDetails = [
    {
      id: "reconciliation",
      title: language === "es" ? "Conciliación Bancaria" : "Bank Reconciliation",
      desc: language === "es" 
        ? "Automatizá el cruce de tu extracto bancario con las facturas y pagos del sistema usando agentes inteligentes."
        : "Match bank transactions against invoicing and payment records automatically with guided agent assistance.",
      statusText: language === "es" ? "3 Movimientos sin conciliar" : "3 Unmatched movements",
      statusType: "warning",
      icon: <ArrowLeftRight size={24} />,
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.12)",
    },
    {
      id: "monthlyClose",
      title: language === "es" ? "Cierre Mensual" : "Monthly Close",
      desc: language === "es"
        ? "Procedimiento guiado paso a paso para el cierre contable, liquidación de nóminas e impuestos del período."
        : "Guided period close checklist for tax calculations, payroll matching, and ledger adjustments.",
      statusText: language === "es" ? "En progreso (50%)" : "In progress (50%)",
      statusType: "info",
      icon: <CalendarCheck size={24} />,
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.12)",
    },
    {
      id: "taxAlerts",
      title: language === "es" ? "Alertas Fiscales y Cumplimiento" : "Tax & Compliance Alerts",
      desc: language === "es"
        ? "Monitoreo inteligente de vencimientos impositivos, RUT y presentación automatizada de declaraciones."
        : "Smart tax calendars, compliance obligation tracking, and automated official filings.",
      statusText: language === "es" ? "Vencimiento en 5 días" : "Deadline in 5 days",
      statusType: "success",
      icon: <Receipt size={24} />,
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.12)",
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[75vh] py-8 px-4 relative overflow-hidden">
      {/* Decorative blurred background orbs specifically for the landing vibe */}
      <div 
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[250px] rounded-full blur-[120px] pointer-events-none opacity-80 z-0"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-primary-glow) 0%, transparent 70%)"
        }}
      />

      {/* Hero Header */}
      <div className="text-center z-10 mb-16 relative">
        <Heading 
          level="h1" 
          className="logo-handwritten font-cursive text-7xl md:text-8xl animate-fade-in py-1 my-[-0.2em] bg-gradient-to-b from-white to-[var(--text-secondary)] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)] leading-tight"
        >
          Agenttis
        </Heading>
        <p className="text-sm md:text-base font-normal tracking-[0.15em] uppercase text-[var(--text-secondary)] mt-3 opacity-85">
          {tagline}
        </p>
        
        <div className="w-[50px] h-[1px] bg-[var(--border-color)] mx-auto mt-6 opacity-50" />
      </div>

      {/* Pinned Applications Section */}
      <div className="w-full max-w-[1100px] z-10">
        <div className="flex justify-between items-center mb-6 px-2">
          <Heading 
            level="h2" 
            className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] !mb-0"
          >
            {language === "es" ? "Aplicaciones Destacadas" : "Pinned Applications"}
          </Heading>
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <Sparkles size={12} className="text-[var(--color-success)]" />
            {language === "es" ? "Automatización con IA activa" : "AI automation active"}
          </span>
        </div>

        {/* Grid of Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appDetails.map((app) => (
            <Card
              key={app.id}
              onClick={() => setActiveTab(app.id as any)}
              interactive
              className="p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden"
            >
              {/* Subtle hover glow accent */}
              <div 
                className="absolute top-0 right-0 w-[100px] h-[100px] pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${app.glowColor} 0%, transparent 70%)`
                }}
              />

              <div>
                {/* Icon & Status */}
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${app.color}20 0%, ${app.color}05 100%)`,
                      border: `1px solid ${app.color}40`,
                      color: app.color,
                      boxShadow: `0 4px 12px ${app.glowColor}`
                    }}
                  >
                    {app.icon}
                  </div>
                  
                  <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[var(--bg-surface-solid)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)]">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: app.statusType === "success" ? "var(--color-success)" : app.statusType === "warning" ? "var(--color-warning)" : "#06b6d4"
                      }}
                    />
                    {app.statusText}
                  </div>
                </div>

                {/* Info */}
                <Heading level="h3" className="text-lg font-semibold mb-2 text-white">
                  {app.title}
                </Heading>
                
                <p className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)] mb-6">
                  {app.desc}
                </p>
              </div>

              {/* Action Link */}
              <div 
                style={{ color: app.color }}
                className="launch-link flex items-center gap-1.5 text-xs font-semibold mt-auto"
              >
                <span>{language === "es" ? "Iniciar aplicación" : "Launch application"}</span>
                <ArrowRight size={14} className="launch-arrow transition-transform duration-200" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
