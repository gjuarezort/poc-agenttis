import { useDashboard } from "../../context/DashboardContext";
import React, { useState } from "react";
import {
  Globe,
  Sun,
  Moon,
  CreditCard,
  Plus,
  Check,
  FileText,
  ArrowUpRight,
  TrendingUp,
  Database,
  Grid,
} from "lucide-react";

export const SettingsTab: React.FC = () => {
  const {
    language,
    handleLanguageChange,
    t,
    theme,
    toggleTheme,
    stats,
    parsedData,
    mockConnections,
  } = useDashboard();

  // Local state for purchased add-ons simulation
  const [tokenSliderVal, setTokenSliderVal] = useState<number>(2); // in Millions
  const [dbSliderVal, setDbSliderVal] = useState<number>(1);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  // Current counts for active items
  const activeCSVCount = parsedData ? 1 : 0;
  const totalDataSourcesCount = mockConnections.length + activeCSVCount;
  
  // Quota specifications
  const quotaLimits = {
    tokens: { used: Math.round(15420000 + stats.totalQueries * 25000), max: 50000000 },
    apiCalls: { used: 24500 + stats.totalQueries, max: 100000 },
    skills: { used: 1840 + stats.totalQueries * 2, max: 5000 },
    datasets: { used: totalDataSourcesCount, max: 10 },
  };

  // Add-on purchasing triggers
  const handlePurchaseAddon = (type: "tokens" | "db") => {
    let message = "";
    if (type === "tokens") {
      message = language === "es"
        ? `¡Éxito! Se han agregado ${tokenSliderVal}M de tokens a su cuenta. Se cargó $${tokenSliderVal * 10} USD a su tarjeta.`
        : `Success! Added ${tokenSliderVal}M tokens to your account. Charged $${tokenSliderVal * 10} USD to your card.`;
    } else {
      message = language === "es"
        ? `¡Éxito! Se han agregado ${dbSliderVal} ranuras de base de datos. Se sumó $${dbSliderVal * 15}/mes a su suscripción.`
        : `Success! Added ${dbSliderVal} database slots. Added $${dbSliderVal * 15}/mo to your subscription.`;
    }
    setPurchaseSuccessMessage(message);
    setTimeout(() => setPurchaseSuccessMessage(null), 5000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "860px" }}>

      {/* Language & Theme Configuration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        
        {/* Language */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
            <Globe size={16} style={{ color: "var(--color-primary)" }} />
            {language === "es" ? "Idioma" : "Language"}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["en", "es"] as const).map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={language === lang ? "btn btn-primary" : "btn btn-secondary"}
                style={{ minWidth: "80px" }}
              >
                {lang === "en" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
            {theme === "light" ? <Sun size={16} style={{ color: "var(--color-warning)" }} /> : <Moon size={16} style={{ color: "var(--color-primary)" }} />}
            {language === "es" ? "Tema de Color" : "Color Theme"}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => theme !== "light" && toggleTheme()}
              className={theme === "light" ? "btn btn-primary" : "btn btn-secondary"}
              style={{ minWidth: "80px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Sun size={14} />
              {language === "es" ? "Claro" : "Light"}
            </button>
            <button
              onClick={() => theme !== "dark" && toggleTheme()}
              className={theme === "dark" ? "btn btn-primary" : "btn btn-secondary"}
              style={{ minWidth: "80px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Moon size={14} />
              {language === "es" ? "Oscuro" : "Dark"}
            </button>
          </div>
        </div>

      </div>

      {/* Subscription Tier Overview & Quota Tracker */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
          <CreditCard size={16} style={{ color: "var(--color-primary)" }} />
          {t("billingTitle")}
        </h3>
        
        <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          {t("billingSubtitle")}
        </p>

        {/* Purchase Notification */}
        {purchaseSuccessMessage && (
          <div style={{ 
            marginBottom: "1.25rem", 
            padding: "0.85rem 1rem", 
            background: "rgba(16,185,129,0.08)", 
            border: "1px solid rgba(16,185,129,0.2)", 
            borderRadius: "var(--radius-md)", 
            color: "var(--color-success)",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Check size={16} />
            <span>{purchaseSuccessMessage}</span>
          </div>
        )}

        {/* Current Plan Card */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1.25rem", 
          background: "linear-gradient(135deg, var(--bg-surface-hover), rgba(99,102,241,0.04))", 
          border: "1px solid var(--border-color)", 
          borderRadius: "var(--radius-md)",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {t("activeTier")}
            </span>
            <h4 style={{ margin: "0.2rem 0 0.4rem 0", fontSize: "1.2rem", fontWeight: 800 }}>
              {t("growthPlan")}
            </h4>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {language === "es"
                ? "Renueva el 1 de Julio, 2026. Suscripción mensual de $299.00 USD."
                : "Renews on July 1, 2026. Monthly subscription of $299.00 USD."}
            </p>
          </div>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
            {t("upgradePlan")} <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Monthly Resource Quotas */}
        <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.88rem", fontWeight: 700 }}>
          {t("usageQuota")}
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          
          {/* Token Capacity */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t("tokenLimit")}</span>
              <span style={{ fontWeight: 700 }}>
                {quotaLimits.tokens.used.toLocaleString()} / {quotaLimits.tokens.max.toLocaleString()} t
              </span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ height: "100%", width: `${(quotaLimits.tokens.used / quotaLimits.tokens.max) * 100}%`, background: "var(--color-primary)" }} />
            </div>
            <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {((quotaLimits.tokens.used / quotaLimits.tokens.max) * 100).toFixed(1)}% {language === "es" ? "usado" : "consumed"}
            </p>
          </div>

          {/* API Gateway Requests */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t("apiLimit")}</span>
              <span style={{ fontWeight: 700 }}>
                {quotaLimits.apiCalls.used.toLocaleString()} / {quotaLimits.apiCalls.max.toLocaleString()}
              </span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ height: "100%", width: `${(quotaLimits.apiCalls.used / quotaLimits.apiCalls.max) * 100}%`, background: "var(--color-accent)" }} />
            </div>
            <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {((quotaLimits.apiCalls.used / quotaLimits.apiCalls.max) * 100).toFixed(1)}% {language === "es" ? "usado" : "consumed"}
            </p>
          </div>

          {/* Custom Skill Executions */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t("skillLimit")}</span>
              <span style={{ fontWeight: 700 }}>
                {quotaLimits.skills.used.toLocaleString()} / {quotaLimits.skills.max.toLocaleString()}
              </span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ height: "100%", width: `${(quotaLimits.skills.used / quotaLimits.skills.max) * 100}%`, background: "var(--color-success)" }} />
            </div>
            <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {((quotaLimits.skills.used / quotaLimits.skills.max) * 100).toFixed(1)}% {language === "es" ? "usado" : "consumed"}
            </p>
          </div>

          {/* Connected Data Sources */}
          <div className="glass-panel" style={{ padding: "1.1rem", background: "var(--bg-surface-solid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{t("connLimit")}</span>
              <span style={{ fontWeight: 700 }}>
                {quotaLimits.datasets.used} / {quotaLimits.datasets.max}
              </span>
            </div>
            <div style={{ height: "6px", background: "var(--bg-surface-hover)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ height: "100%", width: `${(quotaLimits.datasets.used / quotaLimits.datasets.max) * 100}%`, background: "var(--color-warning)" }} />
            </div>
            <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {((quotaLimits.datasets.used / quotaLimits.datasets.max) * 100).toFixed(0)}% {language === "es" ? "usado" : "consumed"}
            </p>
          </div>

        </div>
      </div>

      {/* Credit Purchase Widgets (Monetization Sliders) */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1rem" }}>
          <TrendingUp size={16} style={{ color: "var(--color-success)" }} />
          {t("addOnTitle")}
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          {/* Purchase Tokens Add-on */}
          <div style={{ paddingRight: "0.75rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {t("addOnTokens")}
            </h4>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {language === "es" 
                ? "Añada tokens de uso único para evitar ser bloqueado de las consultas al agente." 
                : "Add single-use token injection to prevent query caps during heavy execution turns."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <input 
                type="range" 
                min={1} 
                max={10} 
                value={tokenSliderVal} 
                onChange={(e) => setTokenSliderVal(Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "0.95rem", fontWeight: 700, minWidth: "60px", textAlign: "right" }}>
                {tokenSliderVal}M t
              </span>
            </div>
            <button 
              onClick={() => handlePurchaseAddon("tokens")} 
              className="btn btn-secondary" 
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Plus size={14} /> {t("buyBtn")} (${tokenSliderVal * 10} USD)
            </button>
          </div>

          {/* Purchase Connections Add-on */}
          <div style={{ paddingLeft: "0.75rem", borderLeft: "1px solid var(--border-color)" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {t("addOnConns")}
            </h4>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {language === "es"
                ? "Incremente la cantidad de bases de datos o archivos CSV conectados de forma simultánea."
                : "Increase your maximum concurrently active database nodes or CSV sync slots."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <input 
                type="range" 
                min={1} 
                max={5} 
                value={dbSliderVal} 
                onChange={(e) => setDbSliderVal(Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--color-accent)" }}
              />
              <span style={{ fontSize: "0.95rem", fontWeight: 700, minWidth: "60px", textAlign: "right" }}>
                +{dbSliderVal} {language === "es" ? "bd" : "db"}
              </span>
            </div>
            <button 
              onClick={() => handlePurchaseAddon("db")} 
              className="btn btn-secondary" 
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <Plus size={14} /> {t("buyBtn")} (+${dbSliderVal * 15}/mo)
            </button>
          </div>

        </div>
      </div>

      {/* Invoice History & Payment method */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}>
          <FileText size={16} style={{ color: "var(--color-accent)" }} />
          {t("billingHistory")}
        </h3>
        
        {/* Payment Method Details */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "0.85rem 1rem", 
          background: "var(--bg-surface-solid)", 
          border: "1px solid var(--border-color)", 
          borderRadius: "var(--radius-md)",
          marginBottom: "1rem",
          fontSize: "0.82rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-primary)" }}>VISA •••• 4242</span>
            <span style={{ color: "var(--text-muted)" }}>Exp 12/28</span>
          </div>
          <button className="btn btn-secondary" style={{ padding: "0 0.75rem", fontSize: "0.75rem", height: "28px" }}>
            {language === "es" ? "Editar" : "Edit"}
          </button>
        </div>

        {/* Invoice Rows */}
        <div className="table-container" style={{ margin: 0 }}>
          <table style={{ fontSize: "0.8rem" }}>
            <thead>
              <tr>
                <th>{language === "es" ? "Fecha" : "Date"}</th>
                <th>{language === "es" ? "Descripción" : "Description"}</th>
                <th>{language === "es" ? "Monto" : "Amount"}</th>
                <th>{language === "es" ? "Estado" : "Status"}</th>
                <th style={{ textAlign: "right" }}>{language === "es" ? "Acción" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jun 1, 2026</td>
                <td style={{ fontWeight: 600 }}>{t("growthPlan")} - Subscription</td>
                <td>$299.00 USD</td>
                <td><span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{language === "es" ? "Pagado" : "Paid"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloading invoice..."); }} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                    {language === "es" ? "Descargar" : "Download"}
                  </a>
                </td>
              </tr>
              <tr>
                <td>May 15, 2026</td>
                <td style={{ fontWeight: 600 }}>Add-on: 2M Tokens Credit</td>
                <td>$20.00 USD</td>
                <td><span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{language === "es" ? "Pagado" : "Paid"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloading invoice..."); }} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                    {language === "es" ? "Descargar" : "Download"}
                  </a>
                </td>
              </tr>
              <tr>
                <td>May 1, 2026</td>
                <td style={{ fontWeight: 600 }}>{t("growthPlan")} - Subscription</td>
                <td>$299.00 USD</td>
                <td><span className="badge badge-success" style={{ fontSize: "0.65rem" }}>{language === "es" ? "Pagado" : "Paid"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloading invoice..."); }} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                    {language === "es" ? "Descargar" : "Download"}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
