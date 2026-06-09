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
    <div className="animate-fade-in" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "75vh",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative blurred background orbs specifically for the landing vibe */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "250px",
        background: "radial-gradient(ellipse at center, var(--color-primary-glow) 0%, transparent 70%)",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.8
      }} />

      {/* Hero Header */}
      <div style={{
        textAlign: "center",
        zIndex: 1,
        marginBottom: "4rem",
        position: "relative"
      }}>
        <h1 className="logo-handwritten animate-fade-in" style={{
          fontSize: "5.5rem",
          margin: "-0.2em 0",
          padding: "0.2em 0",
          background: "linear-gradient(180deg, var(--text-primary) 30%, var(--text-secondary) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 2px 10px rgba(255,255,255,0.05))",
          lineHeight: "1.3",
          fontFamily: "var(--font-cursive)"
        }}>
          Agenttis
        </h1>
        <p style={{
          fontSize: "1rem",
          fontWeight: 400,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginTop: "0.75rem",
          opacity: 0.85
        }}>
          {tagline}
        </p>
        
        <div style={{
          width: "50px",
          height: "1px",
          background: "var(--border-color)",
          margin: "1.5rem auto 0",
          opacity: 0.5
        }} />
      </div>

      {/* Pinned Applications Section */}
      <div style={{
        width: "100%",
        maxWidth: "1100px",
        zIndex: 1
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "0 0.5rem"
        }}>
          <h2 style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            margin: 0
          }}>
            {language === "es" ? "Aplicaciones Destacadas" : "Pinned Applications"}
          </h2>
          <span style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            <Sparkles size={12} style={{ color: "var(--color-success)" }} />
            {language === "es" ? "Automatización con IA activa" : "AI automation active"}
          </span>
        </div>

        {/* Grid of Applications */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem"
        }}>
          {appDetails.map((app) => (
            <div
              key={app.id}
              onClick={() => setActiveTab(app.id as any)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: "2rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "240px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Subtle hover glow accent */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${app.glowColor} 0%, transparent 70%)`,
                pointerEvents: "none"
              }} />

              <div>
                {/* Icon & Status */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${app.color}20 0%, ${app.color}05 100%)`,
                    border: `1px solid ${app.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: app.color,
                    boxShadow: `0 4px 12px ${app.glowColor}`
                  }}>
                    {app.icon}
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "20px",
                    background: "var(--bg-surface-solid)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)"
                  }}>
                    <span style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: app.statusType === "success" ? "var(--color-success)" : app.statusType === "warning" ? "var(--color-warning)" : "#06b6d4"
                    }} />
                    {app.statusText}
                  </div>
                </div>

                {/* Info */}
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)"
                }}>
                  {app.title}
                </h3>
                
                <p style={{
                  fontSize: "0.85rem",
                  lineHeight: "1.5",
                  color: "var(--text-secondary)",
                  marginBottom: "1.5rem"
                }}>
                  {app.desc}
                </p>
              </div>

              {/* Action Link */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: app.color,
                marginTop: "auto",
              }}
              className="launch-link"
              >
                <span>{language === "es" ? "Iniciar aplicación" : "Launch application"}</span>
                <ArrowRight size={14} className="launch-arrow" style={{ transition: "transform 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
